import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas.'
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 6 caractères.'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulation de réinitialisation de mot de passe
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordReset(true);
      toast({
        title: 'Mot de passe réinitialisé !',
        description: 'Votre mot de passe a été modifié avec succès.',
      });

      // Simulation de connexion automatique
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la réinitialisation du mot de passe.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-wellness">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1 flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-medium">
                  <span className="text-3xl">🩺</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">HealthTrack</h1>
              <p className="text-muted-foreground">Votre compagnon santé personnel</p>
            </div>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Lien invalide</CardTitle>
              <CardDescription>
                Le lien de réinitialisation est invalide ou a expiré.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Veuillez demander un nouveau lien de réinitialisation.
              </p>
              <Link to="/mot-de-passe-oublie" className="block">
                <Button className="w-full gradient-primary text-white">
                  Nouvelle demande
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (passwordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-wellness">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1 flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-medium">
                  <span className="text-3xl">🩺</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">HealthTrack</h1>
              <p className="text-muted-foreground">Votre compagnon santé personnel</p>
            </div>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Mot de passe réinitialisé !</CardTitle>
              <CardDescription>
                Votre mot de passe a été modifié avec succès.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Connexion en cours...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Vous allez être redirigé vers votre tableau de bord.
                </p>
              </div>

              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-wellness">
      <div className="w-full max-w-md space-y-6">
        {/* Logo et titre */}
        <div className="text-center space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 flex justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-medium">
                <span className="text-3xl">🩺</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">HealthTrack</h1>
            <p className="text-muted-foreground">Votre compagnon santé personnel</p>
          </div>
        </div>

        {/* Formulaire de réinitialisation */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Nouveau mot de passe</CardTitle>
            <CardDescription>
              Créez un nouveau mot de passe sécurisé pour votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary text-white shadow-soft hover:shadow-medium transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-dark font-medium transition-smooth"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
