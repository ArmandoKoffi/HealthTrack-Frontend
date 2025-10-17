import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, BarChart3, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger automatiquement si déjà connecté
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-wellness">
      {/* En-tête */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-soft">
              <span className="text-2xl">🩺</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">HealthTrack</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto"
            >
              Connexion
            </Button>
            <Button 
              onClick={() => navigate('/register')} 
              className="gradient-primary text-white w-full sm:w-auto"
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-foreground mb-6">
          Votre santé, <span className="text-primary">notre priorité</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          HealthTrack vous aide à suivre vos habitudes de santé au quotidien : sommeil, alimentation, 
          activité physique. Prenez le contrôle de votre bien-être !
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/register')} className="gradient-primary text-white w-full sm:w-auto">
            Commencer gratuitement
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="w-full sm:w-auto">
            Se connecter
          </Button>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Activity className="h-12 w-12 text-success mx-auto mb-4" />
              <CardTitle>Suivi d'activité</CardTitle>
              <CardDescription>
                Enregistrez vos séances sportives et suivez vos progrès
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-info mx-auto mb-4" />
              <CardTitle>Analyses détaillées</CardTitle>
              <CardDescription>
                Visualisez vos données avec des graphiques clairs
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Santé globale</CardTitle>
              <CardDescription>
                Sommeil, nutrition, activité - tout en un seul endroit
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
