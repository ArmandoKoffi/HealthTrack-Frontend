import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '@/services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez saisir votre email.',
      });
      return;
    }

    // Validation email basique côté client
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast({
        variant: 'destructive',
        title: 'Email invalide',
        description: 'Veuillez saisir une adresse email valide.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.forgotPassword({ email });
      setEmailSent(true);
      toast({
        title: 'Email envoyé !',
        description: result.message || 'Un lien de réinitialisation vous a été envoyé.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de l'email.";
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardTitle>Mot de passe oublié</CardTitle>
            <CardDescription>
              {emailSent 
                ? "Vérifiez votre boîte email pour réinitialiser votre mot de passe"
                : "Saisissez votre email pour recevoir un lien de réinitialisation"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
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
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer le lien de réinitialisation'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Vous vous souvenez de votre mot de passe ?{' '}
                    <Link 
                      to="/login" 
                      className="text-primary hover:text-primary-dark font-medium transition-smooth"
                    >
                      Se connecter
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Email envoyé avec succès !
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Si l'adresse <strong>{email}</strong> est associée à un compte HealthTrack, 
                    vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => setEmailSent(false)}
                    variant="outline" 
                    className="w-full"
                  >
                    Réessayer avec un autre email
                  </Button>
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
