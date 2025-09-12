import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MockAuthService } from '@/services/mockAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('marie.dupont@email.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const authService = MockAuthService.getInstance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        toast({
          title: "Connexion réussie !",
          description: "Bienvenue sur HealthTrack",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erreur de connexion",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
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
              onClick={() => navigate('/')}
              className="text-sm"
            >
              ← Retour
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">HealthTrack</h1>
            <p className="text-muted-foreground">Votre compagnon santé personnel</p>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour accéder à vos données de santé
            </CardDescription>
          </CardHeader>
          <CardContent>
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

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary-dark font-medium transition-smooth"
                >
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* Compte de démo */}
            <div className="mt-4 p-4 bg-accent rounded-lg border border-border">
              <p className="text-sm font-medium text-accent-foreground mb-2">
                Compte de démonstration :
              </p>
              <p className="text-xs text-muted-foreground">
                Email: marie.dupont@email.com<br />
                Mot de passe: password123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}