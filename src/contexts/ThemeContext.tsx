import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, settingsService } from '@/services/api';

type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const applyThemeToDOM = (pref: ThemePreference) => {
  try {
    const root = document.documentElement;
    const prefersDark = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = pref === 'dark' || (pref === 'system' && prefersDark);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } catch (e) {
    console.warn('ApplyThemeToDOM warning:', e);
  }
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemePreference>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Charger le thème depuis le backend au démarrage
  useEffect(() => {
    const loadThemeFromBackend = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const response = await settingsService.getMySettings();
          if (response.success && response.data) {
            const userTheme = response.data.display.theme;
            setThemeState(userTheme);
            applyThemeToDOM(userTheme);
          }
        } else {
          // Utilisateur non connecté, utiliser le thème système par défaut
          applyThemeToDOM('system');
        }
      } catch (error) {
        console.warn('Erreur lors du chargement du thème:', error);
        // En cas d'erreur, utiliser le thème système
        applyThemeToDOM('system');
      } finally {
        setIsLoading(false);
      }
    };

    loadThemeFromBackend();
  }, []);

  // Écouter les changements de préférence système
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyThemeToDOM('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const setTheme = async (newTheme: ThemePreference) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);

    // Sauvegarder le nouveau thème dans le backend si l'utilisateur est connecté
    try {
      const token = authService.getToken();
      if (token) {
        await settingsService.updateDisplay({ theme: newTheme });
      }
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde du thème:', error);
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};