import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { apiConfig } from "@/services/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Lien invalide",
        description: "Token manquant ou invalide.",
      });
      return;
    }

    // Utiliser fetch au lieu de redirection directe pour éviter les problèmes CSP
    const verifyEmail = async () => {
      try {
        const verifyUrl = `${apiConfig.baseURL}/auth/verify-email/${token}`;
        const response = await fetch(verifyUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Redirection manuelle vers la page de connexion avec les paramètres
          navigate(`/login?verified=true&email=${encodeURIComponent(data.email || '')}`);
        } else {
          toast({
            variant: "destructive",
            title: "Échec de la vérification",
            description: data.message || "Une erreur est survenue lors de la vérification de l'email.",
          });
          navigate('/login');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Impossible de contacter le serveur. Veuillez réessayer plus tard.",
        });
        navigate('/login');
      }
    };

    verifyEmail();
  }, [token, navigate, toast]);

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
              <Button variant="ghost" onClick={() => navigate("/login")} className="text-sm">
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
              <CardDescription>Le lien de vérification est invalide ou a expiré.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Revenez à la page de connexion pour demander un nouveau email de vérification.
              </p>
              <Link to="/login" className="block">
                <Button className="w-full">Retour à la connexion</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Écran de vérification en cours pendant la redirection
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
            <Button variant="ghost" onClick={() => navigate("/login")} className="text-sm">
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
            <CardTitle>Vérification de l'email...</CardTitle>
            <CardDescription>Nous vérifions votre email et vous redirigeons.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Redirection en cours...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}