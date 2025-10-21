import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, sommeilService, repasService, activiteService } from '@/services/api';
import { Navbar } from '@/components/Layout/Navbar';
import { User, EntreeSommeil, EntreeRepas, EntreeActivite } from '@/types/health';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  Moon, 
  Utensils, 
  TrendingUp,
  Calendar,
  BarChart3,
  Target,
  Loader2
} from 'lucide-react';
import { StatistiquesJournalieres } from '@/types/health';
import { useToast } from '@/hooks/use-toast';

export default function Statistics() {
  const [stats, setStats] = useState<StatistiquesJournalieres[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      const token = authService.getToken() || '';
      
      // Récupérer les données utilisateur depuis localStorage
      const userData = localStorage.getItem('userData');
      if (!userData) {
        navigate('/login');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Récupérer les données des 30 derniers jours
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        // Récupérer les données réelles depuis les API
        const [sommeilRes, repasRes, activitesRes] = await Promise.all([
          sommeilService.getSommeils({ startDate: startDateStr, endDate: endDateStr }, token),
          repasService.getRepas({ startDate: startDateStr, endDate: endDateStr }, token),
          activiteService.getActivites({ startDate: startDateStr, endDate: endDateStr }, token)
        ]);
        
        // Transformer les données en format StatistiquesJournalieres
        const sommeils = sommeilRes.success && sommeilRes.data ? (Array.isArray(sommeilRes.data) ? sommeilRes.data : [sommeilRes.data]) : [];
        const repas = repasRes.success && repasRes.data ? (Array.isArray(repasRes.data) ? repasRes.data : [repasRes.data]) : [];
        const activites = activitesRes.success && activitesRes.data ? (Array.isArray(activitesRes.data) ? activitesRes.data : [activitesRes.data]) : [];
        
        // Créer un dictionnaire de dates pour regrouper les données
        const dateMap = new Map<string, StatistiquesJournalieres>();
        
        // Initialiser le dictionnaire avec toutes les dates dans la plage
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          dateMap.set(dateStr, {
            date: dateStr,
            sommeil: 0,
            qualiteSommeilMoyenne: 0,
            calories: 0,
            activiteMinutes: 0
          });
        }
        
        // Ajouter les données de sommeil
        sommeils.forEach(sommeil => {
          const dateStr = sommeil.date.split('T')[0];
          const existingData = dateMap.get(dateStr) || {
            date: dateStr,
            sommeil: 0,
            qualiteSommeilMoyenne: 0,
            calories: 0,
            activiteMinutes: 0
          };
          
          existingData.sommeil = sommeil.dureeSommeil;
          existingData.qualiteSommeilMoyenne = sommeil.qualiteSommeil;
          dateMap.set(dateStr, existingData);
        });
        
        // Ajouter les données de repas (calories)
        repas.forEach(repas => {
          const dateStr = repas.date.split('T')[0];
          const existingData = dateMap.get(dateStr) || {
            date: dateStr,
            sommeil: 0,
            qualiteSommeilMoyenne: 0,
            calories: 0,
            activiteMinutes: 0
          };
          
          // Calculer les calories totales pour ce repas
          const repasCalories = repas.aliments.reduce((total, aliment) => total + aliment.calories, 0);
          existingData.calories += repasCalories;
          dateMap.set(dateStr, existingData);
        });
        
        // Ajouter les données d'activité
        activites.forEach(activite => {
          const dateStr = activite.date.split('T')[0];
          const existingData = dateMap.get(dateStr) || {
            date: dateStr,
            sommeil: 0,
            qualiteSommeilMoyenne: 0,
            calories: 0,
            activiteMinutes: 0
          };
          
          existingData.activiteMinutes += activite.duree;
          dateMap.set(dateStr, existingData);
        });
        
        // Convertir le dictionnaire en tableau et trier par date
        const statsData = Array.from(dateMap.values())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setStats(statsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, toast]);

  if (!user) return null;
  
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement des statistiques...</p>
          </div>
        </div>
      </>
    );
  }

  // Préparation des données pour les graphiques
  const donneesSommeil = stats.map(s => ({
    date: new Date(s.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    sommeil: s.sommeil || 0,
    qualite: s.qualiteSommeilMoyenne || 0
  }));

  const donneesActivite = stats.filter(s => s.activiteMinutes && s.activiteMinutes > 0).map(s => ({
    date: new Date(s.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    activite: s.activiteMinutes || 0
  }));

  const donneesCalories = stats.map(s => ({
    date: new Date(s.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    calories: s.calories || 0
  }));

  // Statistiques globales
  const sommeilMoyen = stats.reduce((acc, s) => acc + (s.sommeil || 0), 0) / stats.length;
  const caloriesMoyennes = stats.reduce((acc, s) => acc + (s.calories || 0), 0) / stats.length;
  const activiteTotale = stats.reduce((acc, s) => acc + (s.activiteMinutes || 0), 0);
  const joursActifs = stats.filter(s => s.activiteMinutes && s.activiteMinutes > 0).length;

  // Données pour le graphique en camembert de répartition du sommeil
  const repartitionSommeil = [
    { name: 'Moins de 6h', value: stats.filter(s => (s.sommeil || 0) < 6).length, color: '#ef4444' },
    { name: '6-7h', value: stats.filter(s => (s.sommeil || 0) >= 6 && (s.sommeil || 0) < 7).length, color: '#f97316' },
    { name: '7-8h', value: stats.filter(s => (s.sommeil || 0) >= 7 && (s.sommeil || 0) < 8).length, color: '#eab308' },
    { name: '8h+', value: stats.filter(s => (s.sommeil || 0) >= 8).length, color: '#22c55e' }
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Statistiques et Analyses
          </h1>
          <p className="text-muted-foreground">
            Analysez vos habitudes de santé sur les 30 derniers jours
          </p>
        </div>

        {/* Statistiques récapitulatives */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sommeil moyen</CardTitle>
              <Moon className="h-4 w-4 text-secondary-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {sommeilMoyen.toFixed(1)}h
              </div>
              <p className="text-xs text-muted-foreground">
                {sommeilMoyen >= 7 ? '✅ Objectif atteint' : '⚠️ Peut mieux faire'}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories moyennes</CardTitle>
              <Utensils className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(caloriesMoyennes)}
              </div>
              <p className="text-xs text-muted-foreground">
                Calories par jour
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activité totale</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {Math.round(activiteTotale / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">
                En {Math.round(activiteTotale)} minutes
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jours actifs</CardTitle>
              <Calendar className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {joursActifs}/{stats.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((joursActifs / stats.length) * 100)}% du temps
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques détaillés */}
        <Card className="shadow-medium mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Analyses détaillées</span>
            </CardTitle>
            <CardDescription>
              Visualisez l'évolution de vos habitudes de santé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sommeil" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sommeil">Sommeil</TabsTrigger>
                <TabsTrigger value="activite">Activité</TabsTrigger>
                <TabsTrigger value="calories">Calories</TabsTrigger>
                <TabsTrigger value="repartition">Répartition</TabsTrigger>
              </TabsList>

              {/* Graphique Sommeil */}
              <TabsContent value="sommeil" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={donneesSommeil}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs fill-muted-foreground" 
                      />
                      <YAxis 
                        className="text-xs fill-muted-foreground"
                        domain={[4, 10]}
                      />
                      <Tooltip 
                        labelClassName="text-foreground"
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sommeil" 
                        stroke="hsl(var(--secondary-accent))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--secondary-accent))', strokeWidth: 2, r: 4 }}
                        name="Heures de sommeil"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-secondary-accent rounded-full"></div>
                    <span>Durée du sommeil</span>
                  </div>
                  <Badge variant="outline">
                    Objectif: 7-9h par nuit
                  </Badge>
                </div>
              </TabsContent>

              {/* Graphique Activité */}
              <TabsContent value="activite" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={donneesActivite}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs fill-muted-foreground" 
                      />
                      <YAxis 
                        className="text-xs fill-muted-foreground"
                      />
                      <Tooltip 
                        labelClassName="text-foreground"
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Bar 
                        dataKey="activite" 
                        fill="hsl(var(--success))"
                        radius={[4, 4, 0, 0]}
                        name="Minutes d'activité"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span>Minutes d'activité physique</span>
                  </div>
                  <Badge variant="outline">
                    Objectif: 150min/semaine
                  </Badge>
                </div>
              </TabsContent>

              {/* Graphique Calories */}
              <TabsContent value="calories" className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={donneesCalories}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs fill-muted-foreground" 
                      />
                      <YAxis 
                        className="text-xs fill-muted-foreground"
                        domain={[1000, 3000]}
                      />
                      <Tooltip 
                        labelClassName="text-foreground"
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="calories" 
                        stroke="hsl(var(--warning))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
                        name="Calories consommées"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <span>Calories journalières</span>
                  </div>
                  <Badge variant="outline">
                    Recommandé: 1800-2200 cal/jour
                  </Badge>
                </div>
              </TabsContent>

              {/* Répartition du sommeil */}
              <TabsContent value="repartition" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-80">
                    <h3 className="text-lg font-semibold mb-4 text-center">Répartition du sommeil</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={repartitionSommeil}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value} jours`}
                        >
                          {repartitionSommeil.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tendances récentes</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <span className="text-sm font-medium">Meilleure semaine (sommeil)</span>
                        <Badge className="gradient-primary text-white">
                          {Math.max(...donneesSommeil.slice(-7).map(d => d.sommeil)).toFixed(1)}h
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <span className="text-sm font-medium">Séance la plus longue</span>
                        <Badge variant="outline">
                          {Math.max(...donneesActivite.map(d => d.activite))}min
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <span className="text-sm font-medium">Jour le plus actif</span>
                        <Badge className="bg-success text-white">
                          {donneesActivite.find(d => d.activite === Math.max(...donneesActivite.map(d => d.activite)))?.date}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-primary" />
                        Recommandations
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {sommeilMoyen < 7 && (
                          <li>• Essayez de vous coucher plus tôt pour atteindre 7-8h de sommeil</li>
                        )}
                        {joursActifs < stats.length * 0.5 && (
                          <li>• Visez au moins 30 minutes d'activité physique par jour</li>
                        )}
                        <li>• Maintenez une routine régulière pour de meilleurs résultats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
