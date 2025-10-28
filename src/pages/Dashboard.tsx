import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, sommeilService, repasService, activiteService, objectifService, handleAuthError } from '@/services/api';
import { Navbar } from '@/components/Layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Moon, 
  Utensils, 
  Target, 
  Plus, 
  TrendingUp,
  Calendar,
  Clock,
  Zap,
  Download
} from 'lucide-react';
import { StatistiquesJournalieres, ObjectifUtilisateur, User, EntreeSommeil, EntreeRepas, EntreeActivite } from '@/types/health';
import { useToast } from '@/hooks/use-toast';
import { ExportPdfModal } from '@/components/ExportPdfModal';
import { exportService } from '@/services/api/exportService';
import type { ExportPayload } from '@/components/pdf/UserReport';

export default function Dashboard() {
  const [stats, setStats] = useState<StatistiquesJournalieres[]>([]);
  const [objectifs, setObjectifs] = useState<ObjectifUtilisateur[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<ExportPayload | null>(null);

  // Fonction pour calculer les statistiques à partir des données réelles
  const calculateStats = (sommeil: EntreeSommeil[], repas: EntreeRepas[], activites: EntreeActivite[]) => {
    // Créer un dictionnaire de dates pour les 7 derniers jours
    const today = new Date();
    const statsMap: Record<string, StatistiquesJournalieres> = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      statsMap[dateStr] = {
        date: dateStr,
        sommeil: 0,
        calories: 0,
        activiteMinutes: 0,
        qualiteSommeilMoyenne: 0
      };
    }
    
    // Ajouter les données de sommeil
    sommeil.forEach(s => {
      const dateStr = new Date(s.date).toISOString().split('T')[0];
      if (statsMap[dateStr]) {
        statsMap[dateStr].sommeil = s.dureeSommeil;
        statsMap[dateStr].qualiteSommeilMoyenne = s.qualiteSommeil;
      }
    });
    
    // Ajouter les données de repas
    repas.forEach(r => {
      const dateStr = new Date(r.date).toISOString().split('T')[0];
      if (statsMap[dateStr]) {
        statsMap[dateStr].calories += r.calories || 0;
      }
    });
    
    // Ajouter les données d'activité
    activites.forEach(a => {
      const dateStr = new Date(a.date).toISOString().split('T')[0];
      if (statsMap[dateStr]) {
        statsMap[dateStr].activiteMinutes += a.duree || 0;
      }
    });
    
    // Convertir le dictionnaire en tableau
    return Object.values(statsMap).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      const token = authService.getToken() || '';
      
      try {
        // Vérifier la présence du token
        if (!token) {
          navigate('/login');
          return;
        }

        // Récupérer les données utilisateur depuis localStorage
        const userData = localStorage.getItem('userData');
        if (!userData) {
          navigate('/login');
          return;
        }
        
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Récupérer les données réelles depuis les API
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = new Date().toISOString().split('T')[0];
        
        const [sommeilRes, repasRes, activitesRes, objectifsRes] = await Promise.all([
          sommeilService.getSommeils({ startDate: startDateStr, endDate: endDateStr }, token),
          repasService.getRepas({ startDate: startDateStr, endDate: endDateStr }, token),
          activiteService.getActivites({ startDate: startDateStr, endDate: endDateStr }, token),
          objectifService.getObjectifs({}, token)
        ]);
        
        // Vérifier les réponses et mettre à jour les états
        if (objectifsRes.success && objectifsRes.data) {
          setObjectifs(Array.isArray(objectifsRes.data) ? objectifsRes.data : [objectifsRes.data]);
        }
        
        // Calculer les statistiques à partir des données réelles
        const sommeilData = sommeilRes.success && sommeilRes.data ? (Array.isArray(sommeilRes.data) ? sommeilRes.data : [sommeilRes.data]) : [];
        const repasData = repasRes.success && repasRes.data ? (Array.isArray(repasRes.data) ? repasRes.data : [repasRes.data]) : [];
        const activitesData = activitesRes.success && activitesRes.data ? (Array.isArray(activitesRes.data) ? activitesRes.data : [activitesRes.data]) : [];
        
        const calculatedStats = calculateStats(sommeilData, repasData, activitesData);
        setStats(calculatedStats);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        handleAuthError(error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, toast]);

  if (!user) return null;

  const aujourdhui = stats[stats.length - 1] || {
    sommeil: 0,
    calories: 0,
    activiteMinutes: 0
  };
  const statsRecentes = stats.slice(-7);

  // Calculs pour les statistiques d'aujourd'hui
  const sommeilAujourdhui = aujourdhui.sommeil || 0;
  const caloriesAujourdhui = aujourdhui.calories || 0;
  const activiteAujourdhui = aujourdhui.activiteMinutes || 0;

  // Moyennes de la semaine avec vérification pour éviter NaN
  const sommeilMoyen = statsRecentes.length > 0 
    ? statsRecentes.reduce((acc, s) => acc + (s.sommeil || 0), 0) / statsRecentes.length 
    : 0;
  const caloriesMoyennes = statsRecentes.length > 0 
    ? statsRecentes.reduce((acc, s) => acc + (s.calories || 0), 0) / statsRecentes.length 
    : 0;
  const activiteMoyenne = statsRecentes.length > 0 
    ? statsRecentes.reduce((acc, s) => acc + (s.activiteMinutes || 0), 0) / statsRecentes.length 
    : 0;

  const objectifSommeil = objectifs.find(o => o.type === 'sommeil');
  const objectifActivite = objectifs.find(o => o.type === 'activite');

  const exportReport = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      const res = await exportService.getUserData({ startDate: startDateStr, endDate: endDateStr });
      if (!res.success || !res.data) {
        toast({ title: 'Export impossible', description: res.message || 'Erreur lors de la récupération des données', variant: 'destructive' });
        return;
      }
      setExportData(res.data);
      setShowExportModal(true);
    } catch (e) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue lors de l\'export', variant: 'destructive' });
    }
  };

  // Fonction pour obtenir la salutation en fonction de l'heure
  const getSalutation = () => {
    const heure = new Date().getHours();
    
    if (heure >= 5 && heure < 12) {
      return "Bonjour";
    } else if (heure >= 12 && heure < 18) {
      return "Bon après-midi";
    } else {
      return "Bonsoir";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de bienvenue */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getSalutation()}, {user.prenom} ! 👋
          </h1>
          <p className="text-muted-foreground">
            Voici un aperçu de votre santé aujourd'hui
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sommeil */}
          <Card className="stat-card gradient-wellness border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sommeil</CardTitle>
              <Moon className="h-4 w-4 text-secondary-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {sommeilAujourdhui.toFixed(1)}h
              </div>
              <p className="text-xs text-muted-foreground">
                Moyenne: {sommeilMoyen.toFixed(1)}h/nuit
              </p>
              {objectifSommeil && objectifSommeil.valeurCible > 0 && (
                <Progress 
                  value={Math.min((sommeilAujourdhui / objectifSommeil.valeurCible) * 100, 100)} 
                  className="mt-2" 
                />
              )}
            </CardContent>
          </Card>

          {/* Calories */}
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories</CardTitle>
              <Utensils className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {caloriesAujourdhui}
              </div>
              <p className="text-xs text-muted-foreground">
                Moyenne: {Math.round(caloriesMoyennes)} cal/jour
              </p>
              <Progress 
                value={Math.min((caloriesAujourdhui / 2000) * 100, 100)} 
                className="mt-2" 
              />
            </CardContent>
          </Card>

          {/* Activité */}
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activité</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {activiteAujourdhui}min
              </div>
              <p className="text-xs text-muted-foreground">
                Moyenne: {Math.round(activiteMoyenne)} min/jour
              </p>
              {objectifActivite && objectifActivite.valeurCible > 0 && (
                <Progress 
                  value={Math.min((activiteAujourdhui / (objectifActivite.valeurCible / 7)) * 100, 100)} 
                  className="mt-2" 
                />
              )}
            </CardContent>
          </Card>

          {/* Score du jour */}
          <Card className="stat-card gradient-primary border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Score Santé</CardTitle>
              <Target className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {Math.round(
                  Math.min(
                    ((sommeilAujourdhui / 8) + 
                     (caloriesAujourdhui / 2000) + 
                     (activiteAujourdhui / 60)) / 3 * 100,
                    100
                  )
                )}%
              </div>
              <p className="text-xs text-white/80">
                Excellent travail !
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Ajouter des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Actions rapides</span>
              </CardTitle>
              <CardDescription>
                Enregistrez vos données quotidiennes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/ajouter?type=sommeil">
                <Button variant="outline" className="w-full justify-start">
                  <Moon className="mr-2 h-4 w-4" />
                  Ajouter sommeil
                </Button>
              </Link>
              <Link to="/ajouter?type=repas">
                <Button variant="outline" className="w-full justify-start">
                  <Utensils className="mr-2 h-4 w-4" />
                  Ajouter repas
                </Button>
              </Link>
              <Link to="/ajouter?type=activite">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  Ajouter activité
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={exportReport}>
                <Download className="mr-2 h-4 w-4" />
                Exporter mes données (7 jours)
              </Button>
            </CardContent>
          </Card>

          {/* Objectifs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-success" />
                <span>Objectifs</span>
              </CardTitle>
              <CardDescription>
                Suivez vos progrès
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {objectifs.filter(o => o.actif).map((objectif) => (
                <div key={objectif.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{objectif.type}</span>
                    <span className="font-medium">
                      {objectif.valeurActuelle} / {objectif.valeurCible}
                      {objectif.type === 'sommeil' ? 'h' : 
                       objectif.type === 'activite' ? 'min/sem' : 
                       objectif.type === 'poids' ? 'kg' : ''}
                    </span>
                  </div>
                  <Progress 
                    value={objectif.valeurCible > 0 ? Math.min((objectif.valeurActuelle / objectif.valeurCible) * 100, 100) : 0}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statistiques récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-info" />
                <span>Tendances</span>
              </CardTitle>
              <CardDescription>
                Évolution de la semaine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4 text-secondary-accent" />
                  <span className="text-sm">Sommeil moyen</span>
                </div>
                <span className="font-medium">{sommeilMoyen.toFixed(1)}h</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-success" />
                  <span className="text-sm">Activité moyenne</span>
                </div>
                <span className="font-medium">{Math.round(activiteMoyenne)}min</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Utensils className="h-4 w-4 text-warning" />
                  <span className="text-sm">Calories moyennes</span>
                </div>
                <span className="font-medium">{Math.round(caloriesMoyennes)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation vers d'autres sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/statistiques">
            <Card className="stat-card cursor-pointer hover:shadow-medium transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-info" />
                  <span>Voir les statistiques détaillées</span>
                </CardTitle>
                <CardDescription>
                  Analysez vos tendances sur le long terme
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/notifications">
            <Card className="stat-card cursor-pointer hover:shadow-medium transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-warning" />
                  <span>Notifications et rappels</span>
                </CardTitle>
                <CardDescription>
                  Restez motivé avec nos conseils personnalisés
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
      <ExportPdfModal 
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={exportData}
        periodLabel={'7 derniers jours'}
      />
    </div>
  );
}

export { exportService };
export { ExportPayload };
