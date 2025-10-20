import { useState, useEffect } from 'react';
import { authService, profileService } from '@/services/api';
import { Navbar } from '@/components/Layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { 
  User, 
  Save, 
  Edit,
  Mail,
  Calendar,
  Scale,
  Ruler,
  Target,
  Shield,
  Loader2,
  Info
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

export default function Profile() {
  const { toast } = useToast();
  
  const [user, setUser] = useState(profileService.getUserData());
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    dateNaissance: formatDateForInput(user?.dateNaissance) || '',
    poids: user?.poids?.toString() || '',
    taille: user?.taille?.toString() || '',
    objectifPoids: user?.objectifPoids?.toString() || ''
  });

  // Charger les données du profil depuis l'API
  useEffect(() => {
    const loadProfile = async () => {
      const token = authService.getToken();
      if (!token) return;

      try {
        const result = await profileService.getProfile(token);
        if (result.success && result.user) {
          setUser(result.user);
          profileService.saveUserData(result.user);
          setFormData({
            nom: result.user.nom || '',
            prenom: result.user.prenom || '',
            email: result.user.email || '',
            dateNaissance: formatDateForInput(result.user.dateNaissance) || '',
            poids: result.user.poids?.toString() || '',
            taille: result.user.taille?.toString() || '',
            objectifPoids: result.user.objectifPoids?.toString() || ''
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    };

    loadProfile();
  }, []);

  if (!user) return null;

  const isActiveValue = user?.isActive ?? true;
  const lastLoginDisplay = formatLastLogin(user?.lastLogin);
  const roleLabel = user?.role === 'admin' ? 'Administrateur' : 'Utilisateur';
  const emailVerifiedValue = !!user?.emailVerified;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = authService.getToken();
    if (!token) {
      toast({
        title: "Erreur d'authentification",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Validation côté client
      const validationErrors = profileService.validateProfileUpdate({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        dateNaissance: formData.dateNaissance,
        poids: formData.poids ? parseFloat(formData.poids) : undefined,
        taille: formData.taille ? parseFloat(formData.taille) : undefined,
        objectifPoids: formData.objectifPoids ? parseFloat(formData.objectifPoids) : undefined
      });

      if (validationErrors.length > 0) {
        toast({
          title: "Erreur de validation",
          description: validationErrors.join(', '),
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const updates = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        dateNaissance: formData.dateNaissance,
        poids: formData.poids ? parseFloat(formData.poids) : undefined,
        taille: formData.taille ? parseFloat(formData.taille) : undefined,
        objectifPoids: formData.objectifPoids ? parseFloat(formData.objectifPoids) : undefined
      };

      const result = await profileService.updateProfile(updates, token);
      
      if (result.success && result.user) {
        setUser(result.user);
        profileService.saveUserData(result.user);
        
        toast({
          title: "Profil mis à jour !",
          description: "Vos informations ont été sauvegardées avec succès",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Impossible de mettre à jour le profil",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      dateNaissance: formatDateForInput(user.dateNaissance),
      poids: user.poids?.toString() || '',
      taille: user.taille?.toString() || '',
      objectifPoids: user.objectifPoids?.toString() || ''
    });
    setIsEditing(false);
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateIMC = () => {
    const poidsFromForm = formData.poids ? parseFloat(formData.poids) : undefined;
    const tailleFromForm = formData.taille ? parseFloat(formData.taille) : undefined;
    const poids = (isEditing && poidsFromForm !== undefined && !Number.isNaN(poidsFromForm)) ? poidsFromForm : user.poids;
    const taille = (isEditing && tailleFromForm !== undefined && !Number.isNaN(tailleFromForm)) ? tailleFromForm : user.taille;

    if (poids && taille && poids > 0 && taille > 0) {
      const tailleM = taille / 100;
      return (poids / (tailleM * tailleM)).toFixed(1);
    }
    return null;
  };

  const getIMCCategorie = (imc: number) => {
    if (imc < 18.5) return { label: 'Insuffisance pondérale', color: 'text-info' };
    if (imc < 25) return { label: 'Poids normal', color: 'text-success' };
    if (imc < 30) return { label: 'Surpoids', color: 'text-warning' };
    return { label: 'Obésité', color: 'text-destructive' };
  };

  const imc = calculateIMC();
  const imcCategorie = imc ? getIMCCategorie(parseFloat(imc)) : null;

  // Valeurs live pour le bloc Objectif de poids
  const poidsFromForm = formData.poids ? parseFloat(formData.poids) : undefined;
  const objPoidsFromForm = formData.objectifPoids ? parseFloat(formData.objectifPoids) : undefined;
  const poidsDisplay = (isEditing && poidsFromForm !== undefined && !Number.isNaN(poidsFromForm)) ? poidsFromForm : user.poids;
  const objectifPoidsDisplay = (isEditing && objPoidsFromForm !== undefined && !Number.isNaN(objPoidsFromForm)) ? objPoidsFromForm : user.objectifPoids;
  // Valeurs d'affichage pour la carte Objectif de poids
  const hasPoids = !!(poidsDisplay && poidsDisplay > 0);
  const hasObjectifPoids = !!(objectifPoidsDisplay && objectifPoidsDisplay > 0);
  const showObjectifCard = true; // Toujours afficher la carte
  const restantValue = (hasPoids && hasObjectifPoids) ? Math.abs(poidsDisplay! - objectifPoidsDisplay!).toFixed(1) : null;
  const restantClass = (hasPoids && hasObjectifPoids) ? (poidsDisplay! > objectifPoidsDisplay! ? 'text-warning' : 'text-success') : '';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mon Profil
          </h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et vos objectifs de santé
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil principal */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-primary" />
                      <span>Informations personnelles</span>
                    </CardTitle>
                    <CardDescription>
                      Vos données de base et objectifs
                    </CardDescription>
                  </div>
                  
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Modifier</span>
                    </Button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none"
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none gradient-primary text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar et nom */}
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="text-2xl font-bold gradient-primary text-white">
                        {user.prenom[0]}{user.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {user.prenom} {user.nom}
                      </h3>
                      <p className="text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {calculateAge(user.dateNaissance)} ans
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="prenom"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={true}
                        className="pl-10 bg-gray-100"
                      />
                      <div className="text-xs text-muted-foreground mt-1">L'adresse email ne peut pas être modifiée après l'inscription.</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateNaissance">Date de naissance</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateNaissance"
                        name="dateNaissance"
                        type="date"
                        value={formData.dateNaissance}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Informations physiques */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">
                      Informations physiques
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="poids">Poids (kg)</Label>
                        <div className="relative">
                          <Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="poids"
                            name="poids"
                            type="number"
                            step="0.1"
                            value={formData.poids}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taille">Taille (cm)</Label>
                        <div className="relative">
                          <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="taille"
                            name="taille"
                            type="number"
                            value={formData.taille}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="objectifPoids">Objectif poids (kg)</Label>
                        <div className="relative">
                          <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="objectifPoids"
                            name="objectifPoids"
                            type="number"
                            step="0.1"
                            value={formData.objectifPoids}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques et informations complémentaires */}
          <div className="space-y-6">
            {/* IMC */}
            {imc && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Indice de Masse Corporelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">{imc}</div>
                    <div className={`text-sm font-medium ${imcCategorie?.color}`}>
                      {imcCategorie?.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      IMC = Poids (kg) / Taille² (m)
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Objectif de poids */}
            {showObjectifCard && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2 text-success" />
                    Objectif de poids
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Actuel</span>
                      <span className="font-medium">{hasPoids ? `${poidsDisplay} kg` : 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Objectif</span>
                      <span className="font-medium">{hasObjectifPoids ? `${objectifPoidsDisplay} kg` : 'Non renseigné'}</span>
                    </div>
                    {hasPoids && hasObjectifPoids && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Restant</span>
                        <span className={`font-medium ${restantClass}`}>
                          {restantValue} kg
                        </span>
                      </div>
                    )}
                    {!hasObjectifPoids && (
                      <div className="mt-2 text-xs text-muted-foreground text-center">
                        Définissez un objectif de poids pour suivre votre progression
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informations de compte */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-secondary-accent" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Statut du compte</span>
                    <span className={`text-sm font-medium ${isActiveValue ? 'text-success' : 'text-destructive'}`}>{isActiveValue ? 'Actif' : 'Désactivé'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Dernière connexion</span>
                    <span className="text-sm font-medium">{lastLoginDisplay}</span>
                  </div>
                  <Separator />
                  <Button 
                    variant="outline" 
                    className="w-full text-sm"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Changer le mot de passe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section Compte */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Compte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Rôle</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Le rôle détermine vos permissions dans l'application.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="text-sm font-medium">{roleLabel}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Email vérifié</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Un email vérifié renforce la sécurité et facilite la récupération.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className={`text-sm font-medium ${emailVerifiedValue ? 'text-success' : 'text-destructive'}`}>
                        {emailVerifiedValue ? 'Vérifié' : 'Non vérifié'}
                      </span>
                    </div>
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>

            {/* Conseils */}
            <Card className="bg-accent border-accent-bright">
              <CardHeader>
                <CardTitle className="text-lg">💡 Conseil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-accent-foreground">
                  Maintenir vos informations à jour aide HealthTrack à vous fournir 
                  des conseils plus personnalisés et des objectifs adaptés à votre profil.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Popup de changement de mot de passe */}
      <ChangePasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}

const formatDateForInput = (date: string | Date | undefined | null): string => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) {
      return typeof date === 'string' ? (date.includes('T') ? date.split('T')[0] : date) : '';
    }
    return d.toISOString().split('T')[0];
  } catch {
    return typeof date === 'string' ? (date.includes('T') ? date.split('T')[0] : date) : '';
  }
};

const formatLastLogin = (lastLogin?: string | Date | null): string => {
  if (!lastLogin) return '—';
  try {
    const d = typeof lastLogin === 'string' ? new Date(lastLogin) : lastLogin;
    if (Number.isNaN(d.getTime())) return '—';
    const now = new Date();
    const sameDay = d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (sameDay) return "Aujourd'hui";
    const datePart = d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    const timePart = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} à ${timePart}`;
  } catch {
    return '—';
  }
};
