import { useState, useEffect } from 'react';
import { MockAuthService } from '@/services/mockAuth';

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const authService = MockAuthService.getInstance();

  useEffect(() => {
    // Vérifier si le tutoriel a déjà été complété
    const completed = localStorage.getItem('healthtrack_tutorial_completed');
    if (completed === 'true') {
      setTutorialCompleted(true);
    } else {
      // Afficher automatiquement le tutoriel après connexion
      const checkAuthAndShowTutorial = () => {
        if (authService.isAuthenticated()) {
          const hasSeenTutorial = localStorage.getItem('healthtrack_tutorial_shown_after_login');
          if (!hasSeenTutorial) {
            localStorage.setItem('healthtrack_tutorial_shown_after_login', 'true');
            setTimeout(() => {
              setShowTutorial(true);
            }, 1500); // Délai pour laisser l'interface se charger après connexion
          }
        }
      };

      // Vérifier immédiatement et écouter les changements d'authentification
      checkAuthAndShowTutorial();
      
      // Vérifier périodiquement (pour gérer les redirections)
      const interval = setInterval(checkAuthAndShowTutorial, 1000);
      return () => clearInterval(interval);
    }
  }, [authService]);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    setTutorialCompleted(true);
    localStorage.setItem('healthtrack_tutorial_completed', 'true');
  };

  const resetTutorial = () => {
    localStorage.removeItem('healthtrack_tutorial_completed');
    localStorage.removeItem('healthtrack_tutorial_shown_after_login');
    setTutorialCompleted(false);
    setShowTutorial(false);
  };

  return {
    showTutorial,
    tutorialCompleted,
    startTutorial,
    closeTutorial,
    completeTutorial,
    resetTutorial
  };
}
