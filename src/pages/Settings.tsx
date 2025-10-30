import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';
import { Navbar } from '@/components/Layout/Navbar';
import { User } from '@/types/health';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Bell, 
  Shield, 
  Moon,
  Sun,
  Smartphone,
  Mail,
  Download,
  Upload,
  Trash2,
  Save
} from 'lucide-react';
import { settingsService, type UserSettings } from '@/services/api';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState({
    notifications: {
      rappelsSommeil: true,
      rappelsActivite: true,
      rappelsRepas: false,
      felicitations: true,
      conseils: true,
      email: false
    },
    privacy: {
      partagerDonnees: false,
      analytiques: true,
      amelioration: true
    },
    display: {
      theme: 'system',
      unitesPoids: 'kg',
      unitesTaille: 'cm',
      formatHeure: '24h'
    },
    backup: {
      autoBackup: true,
      frequence: 'weekly'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Récupérer les données utilisateur depuis localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Charger les paramètres depuis le backend
        settingsService.getMySettings()
          .then((resp) => {
            if (resp.success && resp.data) {
              const data = (resp.data as any);
              const payload: UserSettings = {
                notifications: data.notifications,
                privacy: data.privacy,
                display: data.display,
                backup: data.backup,
              };
              setSettings(payload);
              // Appliquer le thème depuis le backend
              applyThemePreference(payload.display.theme);
            }
          })
          .catch((error) => {
            console.error('Erreur de chargement des paramètres:', error);
            toast({ title: 'Erreur', description: 'Impossible de charger les paramètres', variant: 'destructive' });
          });
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        authService.logout();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const resp = await settingsService.updateAll(settings);
      if (resp.success) {
        toast({
          title: "Paramètres sauvegardés !",
          description: "Vos préférences ont été mises à jour",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const resp = await settingsService.exportSettings();
      if (resp.success && resp.data) {
        const json = JSON.stringify(resp.data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `healthtrack-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: 'Export réussi !', description: 'Vos paramètres ont été téléchargés' });
      }
    } catch (error) {
      toast({ title: 'Erreur', description: "Impossible d'exporter les paramètres", variant: 'destructive' });
    }
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    const next = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      }
    };
    setSettings(next);
    settingsService.updateNotifications({ [key]: value }).catch((e) => {
      console.error('Erreur update notifications:', e);
      toast({ title: 'Erreur', description: 'Mise à jour des notifications échouée', variant: 'destructive' });
    });
  };

  const updatePrivacySetting = (key: string, value: boolean) => {
    const next = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value,
      }
    };
    setSettings(next);
    settingsService.updatePrivacy({ [key]: value }).catch((e) => {
      console.error('Erreur update privacy:', e);
      toast({ title: 'Erreur', description: 'Mise à jour de la confidentialité échouée', variant: 'destructive' });
    });
  };

  const updateDisplaySetting = (key: string, value: string) => {
    const next = {
      ...settings,
      display: {
        ...settings.display,
        [key]: value,
      }
    };
    setSettings(next);
    // Si on modifie le thème, appliquer immédiatement
    if (key === 'theme') {
      applyThemePreference(value as 'system' | 'light' | 'dark');
    }
    settingsService.updateDisplay({ [key]: value } as Partial<UserSettings['display']>).catch((e) => {
      console.error('Erreur update display:', e);
      toast({ title: 'Erreur', description: "Mise à jour de l'affichage échouée", variant: 'destructive' });
    });
  };

  const updateBackupSetting = (key: string, value: boolean | string) => {
    const next = {
      ...settings,
      backup: {
        ...settings.backup,
        [key]: value,
      }
    };
    setSettings(next);
    settingsService.updateBackup({ [key]: value } as Partial<UserSettings['backup']>).catch((e) => {
      console.error('Erreur update backup:', e);
      toast({ title: 'Erreur', description: 'Mise à jour de la sauvegarde échouée', variant: 'destructive' });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience HealthTrack
          </p>
        </div>

        <div className="space-y-8">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configurez les types de notifications que vous souhaitez recevoir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rappels-sommeil">Rappels de sommeil</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications pour enregistrer votre sommeil
                  </p>
                </div>
                <Switch
                  id="rappels-sommeil"
                  checked={settings.notifications.rappelsSommeil}
                  onCheckedChange={(value) => updateNotificationSetting('rappelsSommeil', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rappels-activite">Rappels d'activité</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications pour vous encourager à bouger
                  </p>
                </div>
                <Switch
                  id="rappels-activite"
                  checked={settings.notifications.rappelsActivite}
                  onCheckedChange={(value) => updateNotificationSetting('rappelsActivite', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rappels-repas">Rappels de repas</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications pour enregistrer vos repas
                  </p>
                </div>
                <Switch
                  id="rappels-repas"
                  checked={settings.notifications.rappelsRepas}
                  onCheckedChange={(value) => updateNotificationSetting('rappelsRepas', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="felicitations">Félicitations</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications lors d'objectifs atteints
                  </p>
                </div>
                <Switch
                  id="felicitations"
                  checked={settings.notifications.felicitations}
                  onCheckedChange={(value) => updateNotificationSetting('felicitations', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="conseils">Conseils santé</Label>
                  <p className="text-sm text-muted-foreground">
                    Conseils personnalisés pour améliorer votre santé
                  </p>
                </div>
                <Switch
                  id="conseils"
                  checked={settings.notifications.conseils}
                  onCheckedChange={(value) => updateNotificationSetting('conseils', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-notif">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par email
                    </p>
                  </div>
                </div>
                <Switch
                  id="email-notif"
                  checked={settings.notifications.email}
                  onCheckedChange={(value) => updateNotificationSetting('email', value)}
                />
              </div>


            </CardContent>
          </Card>

          {/* Affichage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Sun className="h-4 w-4" />
                  <Moon className="h-4 w-4" />
                </div>
                <span>Affichage</span>
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence et les unités de mesure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <select 
                  id="theme"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={settings.display.theme}
                  onChange={(e) => updateDisplaySetting('theme', e.target.value)}
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="system">Automatique (système)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unites-poids">Unités de poids</Label>
                  <select 
                    id="unites-poids"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={settings.display.unitesPoids}
                    onChange={(e) => updateDisplaySetting('unitesPoids', e.target.value)}
                  >
                    <option value="kg">Kilogrammes (kg)</option>
                    <option value="lbs">Livres (lbs)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unites-taille">Unités de taille</Label>
                  <select 
                    id="unites-taille"
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={settings.display.unitesTaille}
                    onChange={(e) => updateDisplaySetting('unitesTaille', e.target.value)}
                  >
                    <option value="cm">Centimètres (cm)</option>
                    <option value="ft">Pieds et pouces (ft/in)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format-heure">Format d'heure</Label>
                <select 
                  id="format-heure"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={settings.display.formatHeure}
                  onChange={(e) => updateDisplaySetting('formatHeure', e.target.value)}
                >
                  <option value="24h">24 heures (14:30)</option>
                  <option value="12h">12 heures (2:30 PM)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-success" />
                <span>Confidentialité et données</span>
              </CardTitle>
              <CardDescription>
                Contrôlez comment vos données sont utilisées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="partager-donnees">Partage de données anonymes</Label>
                  <p className="text-sm text-muted-foreground">
                    Aider à améliorer HealthTrack avec des données anonymisées
                  </p>
                </div>
                <Switch
                  id="partager-donnees"
                  checked={settings.privacy.partagerDonnees}
                  onCheckedChange={(value) => updatePrivacySetting('partagerDonnees', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytiques">Données d'usage</Label>
                  <p className="text-sm text-muted-foreground">
                    Collecter des données d'utilisation pour améliorer l'app
                  </p>
                </div>
                <Switch
                  id="analytiques"
                  checked={settings.privacy.analytiques}
                  onCheckedChange={(value) => updatePrivacySetting('analytiques', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="amelioration">Suggestions d'amélioration</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des suggestions basées sur vos habitudes
                  </p>
                </div>
                <Switch
                  id="amelioration"
                  checked={settings.privacy.amelioration}
                  onCheckedChange={(value) => updatePrivacySetting('amelioration', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sauvegarde et export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-info" />
                <span>Sauvegarde et export</span>
              </CardTitle>
              <CardDescription>
                Gérez la sauvegarde et l'export de vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup">Sauvegarde automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Sauvegarder automatiquement vos données
                  </p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={settings.backup.autoBackup}
                  onCheckedChange={(value) => updateBackupSetting('autoBackup', value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequence-backup">Fréquence de sauvegarde</Label>
                <select 
                  id="frequence-backup"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={settings.backup.frequence}
                  onChange={(e) => updateBackupSetting('frequence', e.target.value)}
                  disabled={!settings.backup.autoBackup}
                >
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button 
                  onClick={handleExportData}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter mes données
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer des données
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Zone dangereuse */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                <span>Zone dangereuse</span>
              </CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-destructive border-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Effacer toutes les données
                </Button>

                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer le compte
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                ⚠️ Ces actions sont irréversibles. Assurez-vous d'avoir exporté vos données importantes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="sticky bottom-8 flex justify-center mt-8">
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="gradient-primary text-white shadow-strong"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
          </Button>
        </div>
      </main>
    </div>
  );
}

const applyThemePreference = (pref: 'system' | 'light' | 'dark') => {
  try {
    const root = document.documentElement;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = pref === 'dark' || (pref === 'system' && prefersDark);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } catch (e) {
    console.warn('ApplyThemePreference warning:', e);
  }
};
