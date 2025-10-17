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
      // Afficher automatiquement le tutoriel seulement à la première connexion
      const checkAndShowTutorial = () => {
        // Vérifier si nous sommes sur une page connectée
        const isOnConnectedPage = window.location.pathname !== '/' && 
                                 window.location.pathname !== '/login' && 
                                 window.location.pathname !== '/register' &&
                                 window.location.pathname !== '/mot-de-passe-oublie' &&
                                 window.location.pathname !== '/reset-password';
        
        if (isOnConnectedPage) {
          // Récupérer l'utilisateur connecté
          const userData = localStorage.getItem('userData');
          if (userData) {
            try {
              const user = JSON.parse(userData);
              const userId = user.id;
              
              // Vérifier si le tutoriel a déjà été vu par cet utilisateur
              const tutorialSeenByUser = localStorage.getItem(`healthtrack_tutorial_seen_${userId}`);
              
              if (!tutorialSeenByUser) {
                // Marquer comme vu pour cet utilisateur
                localStorage.setItem(`healthtrack_tutorial_seen_${userId}`, 'true');
                
                // Afficher le tutoriel avec un délai
                setTimeout(() => {
                  setShowTutorial(true);
                }, 2000); // Délai pour être sûr que l'interface est chargée
              }
            } catch (error) {
              console.error('Erreur lors du chargement des données utilisateur pour le tutoriel:', error);
            }
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
