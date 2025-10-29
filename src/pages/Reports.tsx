import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, sommeilService, repasService, activiteService } from '@/services/api';
import { Navbar } from '@/components/Layout/Navbar';
import { User, StatistiquesJournalieres, EntreeSommeil, EntreeRepas, EntreeActivite } from '@/types/health';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShareModal } from '@/components/ShareModal';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  Activity,
  Moon,
  Utensils,
  BarChart3,
  PieChart,
  Share
} from 'lucide-react';
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { ExportPdfModal } from '@/components/ExportPdfModal';
import { exportService } from '@/services/api/exportService';
import { UserReport } from '@/components/pdf/UserReport';
import { pdf } from '@react-pdf/renderer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Reports() {
  const [stats, setStats] = useState<StatistiquesJournalieres[]>([]);
  const [reportPeriod, setReportPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showShareModal, setShowShareModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  // Helper pour calculer la plage de dates selon reportPeriod
  const getDateRangeForPeriod = () => {
    const end = new Date();
    let start = new Date(end);
    switch (reportPeriod) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(end.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setMonth(end.getMonth() - 1);
    }
    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];
    return { startDateStr, endDateStr };
  };
  
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
        
        // Charger les données réelles depuis les APIs selon la période
        const fetchRealStats = async () => {
          const token = authService.getToken() || '';
          if (!token) {
            navigate('/login');
            return;
          }

          const now = new Date();
          const daysMap: Record<string, number> = { week: 7, month: 30, quarter: 90, year: 365 };
          const rangeDays = daysMap[reportPeriod] ?? 30;
          const startDate = new Date(now);
          startDate.setDate(now.getDate() - rangeDays);

          const startDateStr = startDate.toISOString().split('T')[0];
          const endDateStr = now.toISOString().split('T')[0];

          try {
            const [sommeilRes, repasRes, activitesRes] = await Promise.all([
              sommeilService.getSommeils({ startDate: startDateStr, endDate: endDateStr }, token),
              repasService.getRepas({ startDate: startDateStr, endDate: endDateStr }, token),
              activiteService.getActivites({ startDate: startDateStr, endDate: endDateStr }, token)
            ]);

            const sommeils: EntreeSommeil[] = sommeilRes.success && sommeilRes.data ? (Array.isArray(sommeilRes.data) ? sommeilRes.data : [sommeilRes.data]) : [];
            const repas: EntreeRepas[] = repasRes.success && repasRes.data ? (Array.isArray(repasRes.data) ? repasRes.data : [repasRes.data]) : [];
            const activites: EntreeActivite[] = activitesRes.success && activitesRes.data ? (Array.isArray(activitesRes.data) ? activitesRes.data : [activitesRes.data]) : [];

            // Construire la timeline des statistiques
            const dateMap = new Map<string, StatistiquesJournalieres>();
            for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
              const dateStr = d.toISOString().split('T')[0];
              dateMap.set(dateStr, {
                date: dateStr,
                sommeil: 0,
                qualiteSommeilMoyenne: 0,
                calories: 0,
                activiteMinutes: 0
              });
            }

            sommeils.forEach(s => {
              const dateStr = new Date(s.date).toISOString().split('T')[0];
              const existing = dateMap.get(dateStr);
              if (existing) {
                existing.sommeil = s.dureeSommeil;
                existing.qualiteSommeilMoyenne = s.qualiteSommeil;
                dateMap.set(dateStr, existing);
              }
            });

            repas.forEach(r => {
              const dateStr = new Date(r.date).toISOString().split('T')[0];
              const existing = dateMap.get(dateStr);
              if (existing) {
                const totalCalories = Array.isArray(r.aliments) ? r.aliments.reduce((t, a) => t + (a.calories || 0), 0) : (r.calories || 0);
                existing.calories += totalCalories;
                dateMap.set(dateStr, existing);
              }
            });

            activites.forEach(a => {
              const dateStr = new Date(a.date).toISOString().split('T')[0];
              const existing = dateMap.get(dateStr);
              if (existing) {
                existing.activiteMinutes += a.duree || 0;
                dateMap.set(dateStr, existing);
              }
            });

            const statsData = Array.from(dateMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setStats(statsData);
          } catch (error) {
            console.error('Erreur chargement statistiques réelles:', error);
            toast({
              title: 'Erreur',
              description: "Impossible de charger le rapport. Veuillez réessayer.",
              variant: 'destructive'
            });
          }
        };

        fetchRealStats();
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        authService.logout();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, reportPeriod, toast]);

  if (!user) return null;

  // Filtrer les données selon la période
  const getFilteredStats = () => {
    const now = new Date();
    return stats.filter(stat => {
      const statDate = new Date(stat.date);
      const diffTime = now.getTime() - statDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (reportPeriod) {
        case 'week': return diffDays <= 7;
        case 'month': return diffDays <= 30;
        case 'quarter': return diffDays <= 90;
        case 'year': return diffDays <= 365;
        default: return true;
      }
    });
  };

  const filteredStats = getFilteredStats();

  // Calculs pour le rapport
  const calculateReport = () => {
    if (filteredStats.length === 0) return null;

    const sommeilMoyen = filteredStats.reduce((acc, s) => acc + (s.sommeil || 0), 0) / filteredStats.length;
    const caloriesMoyennes = filteredStats.reduce((acc, s) => acc + (s.calories || 0), 0) / filteredStats.length;
    const activiteTotale = filteredStats.reduce((acc, s) => acc + (s.activiteMinutes || 0), 0);
    const joursActifs = filteredStats.filter(s => s.activiteMinutes && s.activiteMinutes > 0).length;
    
    const meilleurSommeil = Math.max(...filteredStats.map(s => s.sommeil || 0));
    const piresSommeil = Math.min(...filteredStats.map(s => s.sommeil || 0));
    const maxCalories = Math.max(...filteredStats.map(s => s.calories || 0));
    const minCalories = Math.min(...filteredStats.map(s => s.calories || 0));
    const maxActivite = Math.max(...filteredStats.map(s => s.activiteMinutes || 0));

    return {
      sommeilMoyen,
      caloriesMoyennes,
      activiteTotale,
      joursActifs,
      pourcentageJoursActifs: (joursActifs / filteredStats.length) * 100,
      meilleurSommeil,
      piresSommeil,
      maxCalories,
      minCalories,
      maxActivite,
      tendances: {
        sommeil: sommeilMoyen >= 7 ? 'positive' : 'negative',
        activite: (joursActifs / filteredStats.length) >= 0.5 ? 'positive' : 'negative',
        regularite: filteredStats.length >= 7 ? 'positive' : 'negative'
      }
    };
  };

  const report = calculateReport();

  // Données pour les graphiques
  const chartData = filteredStats.map(s => ({
    date: new Date(s.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    sommeil: s.sommeil || 0,
    calories: s.calories || 0,
    activite: s.activiteMinutes || 0,
    qualite: s.qualiteSommeilMoyenne || 0
  }));

  // Données pour le graphique en secteurs
  const pieData = [
    { name: 'Jours actifs', value: report?.joursActifs || 0, color: '#22c55e' },
    { name: 'Jours inactifs', value: (filteredStats.length - (report?.joursActifs || 0)), color: '#ef4444' }
  ];

  const exportReport = async () => {
    try {
      setIsExporting(true);
      const { startDateStr, endDateStr } = getDateRangeForPeriod();
      const res = await exportService.getUserData({ startDate: startDateStr, endDate: endDateStr });
      if (!res.success) {
        toast({ title: 'Export impossible', description: res.message || 'Erreur lors de la récupération des données', variant: 'destructive' });
        return;
      }
      setExportData(res.data);
      setShowExportModal(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erreur lors de l\u2019export';
      const isRateLimit = msg.includes('Trop de requêtes');
      toast({
        title: isRateLimit ? 'Limite atteinte' : 'Export impossible',
        description: isRateLimit ? 'Vous avez atteint la limite d\u2019export. Réessayez dans quelques minutes.' : msg,
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getPeriodLabel = () => {
    const labels = {
      week: 'Cette semaine',
      month: 'Ce mois',
      quarter: 'Ce trimestre',
      year: 'Cette année'
    };
    return labels[reportPeriod as keyof typeof labels];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Rapports détaillés</h1>
              <p className="text-muted-foreground">Analyse complète de vos données de santé</p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" onClick={exportReport} className="w-full sm:w-auto" disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Exporter</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button variant="outline" onClick={() => setShowShareModal(true)} className="w-full sm:w-auto">
                <Share className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Partager</span>
                <span className="sm:hidden">Share</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Sélecteur de période */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Période du rapport</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={reportPeriod} onValueChange={(v) => setReportPeriod(v as any)}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Période du rapport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {report && (
          <>
            {/* Résumé exécutif */}
            <Card className="mb-8 gradient-wellness border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Résumé exécutif - {getPeriodLabel()}</CardTitle>
                <CardDescription>
                  Vue d'ensemble de vos performances santé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {report.sommeilMoyen.toFixed(1)}h
                    </div>
                    <div className="text-sm text-muted-foreground">Sommeil moyen/nuit</div>
                    <Badge className={report.tendances.sommeil === 'positive' ? 'bg-success' : 'bg-warning'}>
                      {report.tendances.sommeil === 'positive' ? 'Excellent' : 'À améliorer'}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-2">
                      {Math.round(report.caloriesMoyennes)}
                    </div>
                    <div className="text-sm text-muted-foreground">Calories moyennes/jour</div>
                    <Badge variant="outline">Équilibré</Badge>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">
                      {Math.round(report.activiteTotale / 60)}h
                    </div>
                    <div className="text-sm text-muted-foreground">Activité totale</div>
                    <Badge className={report.tendances.activite === 'positive' ? 'bg-success' : 'bg-warning'}>
                      {report.tendances.activite === 'positive' ? 'Actif' : 'Peu actif'}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-info mb-2">
                      {Math.round(report.pourcentageJoursActifs)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Jours actifs</div>
                    <Badge className="bg-info text-info-foreground">
                      {report.joursActifs}/{filteredStats.length} jours
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analyses détaillées */}
            <Tabs defaultValue="evolution" className="space-y-6">
              <TabsList className="flex flex-col sm:flex-row gap-2">
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-1">
                  <TabsTrigger value="evolution" className="px-4 py-3 text-sm sm:text-base flex-1">
                    Évolution
                  </TabsTrigger>
                  <TabsTrigger value="repartition" className="px-4 py-3 text-sm sm:text-base flex-1">
                    Répartition
                  </TabsTrigger>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-1">
                  <TabsTrigger value="comparaison" className="px-4 py-3 text-sm sm:text-base flex-1">
                    Comparaison
                  </TabsTrigger>
                  <TabsTrigger value="recommandations" className="px-4 py-3 text-sm sm:text-base flex-1">
                    Recommandations
                  </TabsTrigger>
                </div>
              </TabsList>

              {/* Graphiques d'évolution */}
              <TabsContent value="evolution" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                        <Moon className="h-5 w-5 text-secondary-accent mb-1 sm:mb-0" />
                        <span className="text-base sm:text-lg">Évolution du sommeil</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-48 sm:h-56 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis domain={[4, 10]} fontSize={12} />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="sommeil" 
                              stroke="hsl(var(--secondary-accent))" 
                              fill="hsl(var(--secondary-accent))"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                        <Activity className="h-5 w-5 text-success mb-1 sm:mb-0" />
                        <span className="text-base sm:text-lg">Activité physique</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-48 sm:h-56 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Bar 
                              dataKey="activite" 
                              fill="hsl(var(--success))"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                      <Utensils className="h-5 w-5 text-warning mb-1 sm:mb-0" />
                      <span className="text-base sm:text-lg">Consommation calorique</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-48 sm:h-56 md:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" fontSize={12} />
                          <YAxis domain={[1000, 3000]} fontSize={12} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="calories" 
                            stroke="hsl(var(--warning))" 
                            strokeWidth={3}
                            dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Répartition */}
              <TabsContent value="repartition" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg">Répartition des jours actifs</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-48 sm:h-56 md:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg">Métriques clés</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center text-sm sm:text-base">
                          <span className="truncate mr-2">Meilleure nuit de sommeil</span>
                          <Badge className="bg-success text-success-foreground flex-shrink-0">
                            {report.meilleurSommeil.toFixed(1)}h
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm sm:text-base">
                          <span className="truncate mr-2">Plus longue séance d'activité</span>
                          <Badge className="bg-primary text-primary-foreground flex-shrink-0">
                            {report.maxActivite}min
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm sm:text-base">
                          <span className="truncate mr-2">Jour le plus calorique</span>
                          <Badge className="bg-warning text-warning-foreground flex-shrink-0">
                            {report.maxCalories} cal
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm sm:text-base">
                          <span className="truncate mr-2">Jour le moins calorique</span>
                          <Badge variant="outline" className="flex-shrink-0">
                            {report.minCalories} cal
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Comparaison */}
              <TabsContent value="comparaison" className="space-y-6">
                <Card className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">Comparaison avec les recommandations</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 space-y-1 sm:space-y-0">
                          <span className="text-sm sm:text-base">Sommeil (recommandé: 7-9h)</span>
                          <span className="text-sm sm:text-base font-medium">{report.sommeilMoyen.toFixed(1)}h</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              report.sommeilMoyen >= 7 && report.sommeilMoyen <= 9 
                                ? 'bg-success' 
                                : 'bg-warning'
                            }`}
                            style={{ width: `${Math.min((report.sommeilMoyen / 9) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 space-y-1 sm:space-y-0">
                          <span className="text-sm sm:text-base">Activité (recommandé: 150min/semaine)</span>
                          <span className="text-sm sm:text-base font-medium">
                            {Math.round(report.activiteTotale * 7 / filteredStats.length)}min/sem
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              (report.activiteTotale * 7 / filteredStats.length) >= 150 
                                ? 'bg-success' 
                                : 'bg-warning'
                            }`}
                            style={{ 
                              width: `${Math.min(((report.activiteTotale * 7 / filteredStats.length) / 150) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 space-y-1 sm:space-y-0">
                          <span className="text-sm sm:text-base">Régularité (objectif: quotidien)</span>
                          <span className="text-sm sm:text-base font-medium">
                            {Math.round(report.pourcentageJoursActifs)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              report.pourcentageJoursActifs >= 80 
                                ? 'bg-success' 
                                : report.pourcentageJoursActifs >= 50
                                ? 'bg-warning'
                                : 'bg-destructive'
                            }`}
                            style={{ width: `${report.pourcentageJoursActifs}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recommandations */}
              <TabsContent value="recommandations" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="border-success overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-success text-base sm:text-lg">Points forts</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2 text-sm">
                        {report.sommeilMoyen >= 7 && (
                          <li>✅ Excellente qualité de sommeil moyenne</li>
                        )}
                        {report.pourcentageJoursActifs >= 50 && (
                          <li>✅ Bonne régularité dans l'activité physique</li>
                        )}
                        {report.tendances.regularite === 'positive' && (
                          <li>✅ Bon suivi des données de santé</li>
                        )}
                        <li>✅ Engagement dans le suivi de votre santé</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-warning overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-warning text-base sm:text-lg">Axes d'amélioration</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2 text-sm">
                        {report.sommeilMoyen < 7 && (
                          <li>⚠️ Augmenter la durée de sommeil (objectif: 7-9h)</li>
                        )}
                        {report.pourcentageJoursActifs < 50 && (
                          <li>⚠️ Augmenter la fréquence d'activité physique</li>
                        )}
                        {(report.activiteTotale * 7 / filteredStats.length) < 150 && (
                          <li>⚠️ Viser 150 minutes d'activité par semaine</li>
                        )}
                        <li>⚠️ Maintenir la régularité dans le suivi</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-accent border-accent-bright overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">Recommandations personnalisées</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 text-sm">
                      <p><strong>Pour améliorer votre sommeil :</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Maintenir des horaires de coucher réguliers</li>
                        <li>Éviter les écrans 1h avant le coucher</li>
                        <li>Créer un environnement propice au sommeil</li>
                      </ul>
                      
                      <p><strong>Pour augmenter votre activité :</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Commencer par 30 minutes d'activité modérée</li>
                        <li>Intégrer l'exercice dans votre routine quotidienne</li>
                        <li>Varier les types d'activités pour maintenir la motivation</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {!report && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl text-muted-foreground mb-2">
                Données insuffisantes
              </CardTitle>
              <CardDescription>
                Enregistrez plus de données pour générer un rapport détaillé
              </CardDescription>
            </CardContent>
          </Card>
        )}

        <ShareModal 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={`Rapport HealthTrack - ${getPeriodLabel()}`}
          content={`Sommeil moyen: ${report?.sommeilMoyen.toFixed(1)}h | Activité: ${Math.round((report?.activiteTotale || 0) / 60)}h`}
        />

        <ExportPdfModal 
          open={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={exportData}
          periodLabel={getPeriodLabel()}
        />
      </main>
    </div>
  );
}

export { ExportPdfModal } from '@/components/ExportPdfModal';
export { exportService } from '@/services/api/exportService';
export { UserReport } from '@/components/pdf/UserReport';
export { pdf } from '@react-pdf/renderer';
