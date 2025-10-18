import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { authService, profileService } from "@/services/api";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    let cancelled = false;
    const verify = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }
      try {
        const res = await authService.verifyResetToken(token);
        if (!cancelled) {
          setTokenValid(true);
          setUserEmail(res.user?.email ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setTokenValid(false);
          toast({
            variant: "destructive",
            title: "Lien invalide",
            description:
              err instanceof Error
                ? err.message
                : "Lien de réinitialisation invalide ou expiré.",
          });
        }
      }
    };
    verify();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    if (!profileService.isStrongPassword(newPassword)) {
      toast({
        variant: "destructive",
        title: "Mot de passe insuffisant",
        description: "Au moins 8 caractères, majuscule, minuscule et chiffre.",
      });
      return;
    }

    if (!token) {
      toast({
        variant: "destructive",
        title: "Lien invalide",
        description: "Token manquant ou invalide.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.resetPassword({
        token,
        newPassword,
        confirmPassword,
      });

      if (result.token) {
        authService.saveToken(result.token);
      }
      if (result.user) {
        profileService.saveUserData(result.user);
      }

      setPasswordReset(true);
      toast({
        title: "Mot de passe réinitialisé !",
        description:
          result.message || "Votre mot de passe a été modifié avec succès.",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la réinitialisation du mot de passe.";
      toast({
        variant: "destructive",
        title: "Erreur",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || tokenValid === false) {
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
                onClick={() => navigate("/login")}
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

  if (tokenValid === null) {
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
              <CardTitle>Vérification du lien...</CardTitle>
              <CardDescription>
                Nous vérifions la validité de votre lien de réinitialisation.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
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
                onClick={() => navigate("/login")}
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
              onClick={() => navigate("/login")}
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">HealthTrack</h1>
            <p className="text-muted-foreground">
              Votre compagnon santé personnel
            </p>
          </div>
        </div>

        {/* Formulaire de réinitialisation */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Nouveau mot de passe</CardTitle>
            <CardDescription>
              Créez un nouveau mot de passe sécurisé pour votre compte
            </CardDescription>
            <p className="text-xs text-muted-foreground mt-1">
              Au moins 8 caractères, majuscule, minuscule et chiffre.
            </p>
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
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </Label>
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
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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
                  "Réinitialiser le mot de passe"
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
