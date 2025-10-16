import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, Play, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  location: string;
  usage: string;
  tips?: string;
  elementSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur HealthTrack !',
    description: 'Découvrez comment tirer le meilleur parti de votre application santé personnelle.',
    location: 'Tableau de bord principal',
    usage: 'Ce tutoriel interactif vous montrera comment suivre efficacement votre santé au quotidien.',
    tips: 'Exemple : Marie utilise HealthTrack pour suivre ses 10 000 pas quotidiens et améliorer son sommeil.'
  },
  {
    id: 'dashboard',
    title: 'Tableau de bord - Vue d\'ensemble',
    description: 'Votre centre de contrôle pour toutes vos données de santé.',
    location: 'Page d\'accueil après connexion',
    usage: 'Consultez rapidement vos indicateurs clés : activité, sommeil, nutrition et bien-être.',
    tips: 'Exemple : Pierre voit en un coup d\'œil qu\'il a atteint son objectif d\'hydratation mais doit améliorer son temps de sommeil.',
    elementSelector: '.dashboard-card',
    position: 'bottom'
  },
  {
    id: 'add-entry',
    title: 'Ajouter des données - Mode pas à pas',
    description: 'Enregistrez facilement vos activités et mesures quotidiennes.',
    location: 'Bouton principal "Ajouter"',
    usage: 'Saisissez vos données en 3 étapes simples :\n1. Choisissez le type (activité, sommeil, nutrition)\n2. Remplissez les champs\n3. Validez et visualisez',
    tips: 'Exemple : Sophie ajoute sa séance de yoga de 30 minutes et son repas équilibré pour suivre ses progrès vers une vie plus saine.',
    elementSelector: '.add-entry-btn',
    position: 'right'
  },
  {
    id: 'statistics',
    title: 'Analyses détaillées - Comprenez vos tendances',
    description: 'Transformez vos données en insights actionnables.',
    location: 'Onglet "Statistiques"',
    usage: 'Explorez vos données avec :\n• Graphiques d\'évolution sur 7, 30 ou 90 jours\n• Comparaisons avec vos objectifs\n• Tendances et patterns identifiés',
    tips: 'Exemple : Marc découvre qu\'il dort mieux les jours où il fait du sport, ce qui l\'encourage à maintenir sa routine.',
    elementSelector: '.stats-tab',
    position: 'left'
  },
  {
    id: 'notifications',
    title: 'Rappels intelligents - Restez motivé',
    description: 'Ne manquez jamais vos objectifs de santé.',
    location: 'Icône de notifications (cloche)',
    usage: 'Recevez des alertes personnalisées :\n• Rappels d\'hydratation toutes les 2 heures\n• Objectifs quotidiens à compléter\n• Conseils basés sur vos données',
    tips: 'Exemple : Léa reçoit une notification pour boire de l\'eau à 15h, ce qui l\'aide à atteindre ses 2L quotidiens.',
    elementSelector: '.notifications-icon',
    position: 'bottom'
  },
  {
    id: 'profile',
    title: 'Personnalisation - Adaptez à vos besoins',
    description: 'Configurez HealthTrack selon votre style de vie.',
    location: 'Menu utilisateur (votre avatar)',
    usage: 'Personnalisez :\n• Vos objectifs santé personnalisés\n• Vos préférences de notification\n• Vos données personnelles et mesures',
    tips: 'Exemple : Thomas ajuste ses objectifs après consultation médicale pour mieux correspondre à ses besoins spécifiques.',
    elementSelector: '.profile-menu',
    position: 'top'
  },
  {
    id: 'complete',
    title: 'Félicitations ! Vous maîtrisez HealthTrack',
    description: 'Vous êtes maintenant prêt à optimiser votre santé au quotidien.',
    location: 'Toute l\'application',
    usage: 'Résumé des fonctionnalités maîtrisées :\n• Suivi quotidien des indicateurs santé\n• Analyse des tendances à long terme\n• Personnalisation selon vos objectifs\n• Rappels intelligents pour rester motivé',
    tips: 'Exemple complet : Emma utilise HealthTrack depuis 3 mois et a amélioré son sommeil de 45 minutes par nuit tout en augmentant son activité physique de 30%.'
  }
];

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function Tutorial({ isOpen, onClose, onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('healthtrack_tutorial_completed', 'true');
    onComplete();
    toast({
      title: 'Tutoriel terminé !',
      description: 'Vous maîtrisez maintenant HealthTrack.',
    });
  };

  const handleSkip = () => {
    onClose();
    toast({
      title: 'Tutoriel ignoré',
      description: 'Vous pouvez le relancer depuis le menu d\'aide.',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div 
        className={`relative w-full max-w-2xl mx-4 transition-all duration-300 transform ${
          isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="relative pb-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 h-8 w-8 rounded-full"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Étape {currentStep + 1} sur {tutorialSteps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informations de localisation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Localisation</h4>
                <p className="text-foreground">{currentStepData.location}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Utilisation</h4>
                <p className="text-foreground">{currentStepData.usage}</p>
              </div>
            </div>

            {/* Conseils */}
            {currentStepData.tips && (
              <div className="bg-accent/50 rounded-lg p-4 border border-accent">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">💡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Conseil pratique</h4>
                    <p className="text-sm text-muted-foreground">{currentStepData.tips}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="text-sm"
                >
                  Passer
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => window.location.reload()}
                  className="text-sm"
                >
                  Voir plus tard
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="h-10 w-10 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  onClick={handleNext}
                  className="gradient-primary text-white px-6"
                >
                  {currentStep === tutorialSteps.length - 1 ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Terminer
                    </>
                  ) : (
                    <>
                      Suivant
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
