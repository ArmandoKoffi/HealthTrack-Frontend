import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService, settingsService } from '@/services/api';
import type { UserSettings } from '@/services/api/settingsService';

export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'in';
export type TimeFormat = '24h' | '12h';

interface DisplayState {
  unitesPoids: WeightUnit;
  unitesTaille: HeightUnit;
  formatHeure: TimeFormat;
}

interface DisplayContextType extends DisplayState {
  setDisplay: (partial: Partial<DisplayState>) => void;
  getWeightUnitLabel: () => string;
  getHeightUnitLabel: () => string;
  formatWeightKg: (kgValue?: number | null) => { valueText: string; unit: string };
  formatHeightCm: (cmValue?: number | null) => { valueText: string; unit: string };
  formatTime: (date: Date | string) => string;
}

const defaultState: DisplayState = {
  unitesPoids: 'kg',
  unitesTaille: 'cm',
  formatHeure: '24h',
};

const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

export const useDisplay = () => {
  const ctx = useContext(DisplayContext);
  if (!ctx) throw new Error('useDisplay must be used within DisplayProvider');
  return ctx;
};

export const DisplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DisplayState>(defaultState);

  // Charger depuis le backend au démarrage (si authentifié)
  useEffect(() => {
    const loadDisplay = async () => {
      try {
        const token = authService.getToken();
        if (!token) return;
        const res = await settingsService.getMySettings();
        if (res.success && res.data) {
          const display = (res.data as any).display || (res.data as UserSettings).display;
          if (display) {
            setState({
              unitesPoids: display.unitesPoids || 'kg',
              unitesTaille: display.unitesTaille || 'cm',
              formatHeure: display.formatHeure || '24h',
            });
          }
        }
      } catch (e) {
        console.warn('DisplayProvider: failed to load settings', e);
      }
    };
    loadDisplay();
  }, []);

  // Écouter les mises à jour temps réel (SSE)
  useEffect(() => {
    const handler = (evt: Event) => {
      const custom = evt as CustomEvent;
      const display = custom.detail as Partial<DisplayState> | undefined;
      if (display && typeof display === 'object') {
        setState(prev => ({
          unitesPoids: (display.unitesPoids as WeightUnit) || prev.unitesPoids,
          unitesTaille: (display.unitesTaille as HeightUnit) || prev.unitesTaille,
          formatHeure: (display.formatHeure as TimeFormat) || prev.formatHeure,
        }));
      }
    };
    window.addEventListener('displaySettingsUpdated', handler as EventListener);
    return () => window.removeEventListener('displaySettingsUpdated', handler as EventListener);
  }, []);

  const setDisplay = (partial: Partial<DisplayState>) => {
    setState(prev => ({ ...prev, ...partial }));
  };

  const getWeightUnitLabel = () => state.unitesPoids === 'lb' ? 'lb' : 'kg';
  const getHeightUnitLabel = () => state.unitesTaille === 'in' ? 'ft/in' : 'cm';

  const formatWeightKg = (kgValue?: number | null) => {
    if (kgValue === null || kgValue === undefined || Number.isNaN(kgValue)) {
      return { valueText: '—', unit: getWeightUnitLabel() };
    }
    if (state.unitesPoids === 'lb') {
      const lb = kgValue * 2.2046226218;
      return { valueText: lb.toFixed(1), unit: 'lb' };
    }
    return { valueText: kgValue.toFixed(1), unit: 'kg' };
  };

  const formatHeightCm = (cmValue?: number | null) => {
    if (cmValue === null || cmValue === undefined || Number.isNaN(cmValue)) {
      return { valueText: '—', unit: getHeightUnitLabel() };
    }
    if (state.unitesTaille === 'in') {
      const totalInches = cmValue * 0.3937007874;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches - feet * 12);
      return { valueText: `${feet}’ ${inches}\"`, unit: 'ft/in' };
    }
    return { valueText: `${cmValue}`, unit: 'cm' };
  };

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: state.formatHeure === '12h' ? 'h12' : 'h23',
    });
  };

  const value = useMemo<DisplayContextType>(() => ({
    ...state,
    setDisplay,
    getWeightUnitLabel,
    getHeightUnitLabel,
    formatWeightKg,
    formatHeightCm,
    formatTime,
  }), [state]);

  return (
    <DisplayContext.Provider value={value}>
      {children}
    </DisplayContext.Provider>
  );
};