import { useState, useEffect } from 'react';

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  useEffect(() => {
    // Vérifier si le tutoriel a déjà été complété
    const completed = localStorage.getItem('healthtrack_tutorial_completed');
    if (completed === 'true') {
      setTutorialCompleted(true);
    } else {
      // Afficher automatiquement le tutoriel après connexion
      // Utiliser une logique simple basée sur la navigation
      const checkAndShowTutorial = () => {
        // Vérifier si nous sommes sur une page connectée
        const isOnConnectedPage = window.location.pathname !== '/' && 
                                 window.location.pathname !== '/login' && 
                                 window.location.pathname !== '/register' &&
                                 window.location.pathname !== '/mot-de-passe-oublie' &&
                                 window.location.pathname !== '/reset-password';
        
        if (isOnConnectedPage) {
          const hasSeenTutorial = localStorage.getItem('healthtrack_tutorial_shown_after_login');
          if (!hasSeenTutorial) {
            localStorage.setItem('healthtrack_tutorial_shown_after_login', 'true');
            setTimeout(() => {
              setShowTutorial(true);
            }, 2000); // Délai plus long pour être sûr que l'interface est chargée
          }
        }
      };

      // Vérifier immédiatement
      checkAndShowTutorial();
      
      // Vérifier périodiquement (pour gérer les redirections)
      const interval = setInterval(checkAndShowTutorial, 500);
      return () => clearInterval(interval);
    }
  }, []);

  const startTutorial = () => {
    console.log('Démarrage du tutoriel');
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
