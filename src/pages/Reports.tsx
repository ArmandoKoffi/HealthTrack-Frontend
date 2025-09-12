import { useEffect, useState } from 'react';
import { MockAuthService } from '@/services/mockAuth';
import { MockDataService } from '@/services/mockData';
import { Navbar } from '@/components/Layout/Navbar';
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
  Share,
  Printer
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
import { StatistiquesJournalieres } from '@/types/health';

export default function Reports() {
  const [stats, setStats] = useState<StatistiquesJournalieres[]>([]);
  const [reportPeriod, setReportPeriod] = useState('month');
  const [showShareModal, setShowShareModal] = useState(false);
  
  const authService = MockAuthService.getInstance();
  const dataService = MockDataService.getInstance();
  const user = authService.getCurrentUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const statsData = dataService.getStatistiquesJournalieres(user.id);
      setStats(statsData);
    }
  }, [user]);

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

  const exportReport = () => {
    const reportData = {
      utilisateur: `${user.prenom} ${user.nom}`,
      periode: reportPeriod,
      dateGeneration: new Date().toLocaleDateString('fr-FR'),
      statistiques: report,
      donnees: filteredStats,
    };

    const reportHtml = `
      <html>
        <head>
          <title>Rapport HealthTrack</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .metric { display: inline-block; margin: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Rapport HealthTrack</h1>
            <p>Utilisateur: ${user.prenom} ${user.nom}</p>
            <p>Période: ${reportPeriod}</p>
            <p>Généré le: ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <div class="section">
            <h2>Résumé de la période</h2>
            <div class="metric">
              <h3>Sommeil moyen</h3>
              <p>${report?.sommeilMoyen.toFixed(1)} heures</p>
            </div>
            <div class="metric">
              <h3>Calories moyennes</h3>
              <p>${Math.round(report?.caloriesMoyennes || 0)} cal/jour</p>
            </div>
            <div class="metric">
              <h3>Activité totale</h3>
              <p>${report?.activiteTotale} minutes</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-healthtrack-${reportPeriod}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
    toast({
      title: "Impression lancée",
      description: "Votre rapport va être imprimé",
    });
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
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Rapports détaillés
              </h1>
              <p className="text-muted-foreground">
                Analyse complète de vos données de santé
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" onClick={exportReport} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Exporter</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button variant="outline" onClick={() => setShowShareModal(true)} className="w-full sm:w-auto">
                <Share className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Partager</span>
                <span className="sm:hidden">Share</span>
              </Button>
              <Button variant="outline" onClick={printReport} className="w-full sm:w-auto">
                <Printer className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Imprimer</span>
                <span className="sm:hidden">Print</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: 'week', label: 'Semaine', short: 'Sem' },
                { value: 'month', label: 'Mois', short: 'Mois' },
                { value: 'quarter', label: 'Trimestre', short: 'Trim' },
                { value: 'year', label: 'Année', short: 'An' }
              ].map((period) => (
                <Button
                  key={period.value}
                  variant={reportPeriod === period.value ? "default" : "outline"}
                  onClick={() => setReportPeriod(period.value)}
                  className="w-full"
                >
                  <span className="hidden sm:inline">{period.label}</span>
                  <span className="sm:hidden">{period.short}</span>
                </Button>
              ))}
            </div>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="evolution">Évolution</TabsTrigger>
                <TabsTrigger value="repartition">Répartition</TabsTrigger>
                <TabsTrigger value="comparaison">Comparaison</TabsTrigger>
                <TabsTrigger value="recommandations">Recommandations</TabsTrigger>
              </TabsList>

              {/* Graphiques d'évolution */}
              <TabsContent value="evolution" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Moon className="h-5 w-5 text-secondary-accent" />
                        <span>Évolution du sommeil</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[4, 10]} />
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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-success" />
                        <span>Activité physique</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Utensils className="h-5 w-5 text-warning" />
                      <span>Consommation calorique</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[1000, 3000]} />
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition des jours actifs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Métriques clés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Meilleure nuit de sommeil</span>
                          <Badge className="bg-success text-success-foreground">
                            {report.meilleurSommeil.toFixed(1)}h
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Plus longue séance d'activité</span>
                          <Badge className="bg-primary text-primary-foreground">
                            {report.maxActivite}min
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Jour le plus calorique</span>
                          <Badge className="bg-warning text-warning-foreground">
                            {report.maxCalories} cal
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Jour le moins calorique</span>
                          <Badge variant="outline">
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
                <Card>
                  <CardHeader>
                    <CardTitle>Comparaison avec les recommandations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Sommeil (recommandé: 7-9h)</span>
                          <span>{report.sommeilMoyen.toFixed(1)}h</span>
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
                        <div className="flex justify-between mb-2">
                          <span>Activité (recommandé: 150min/semaine)</span>
                          <span>{Math.round(report.activiteTotale * 7 / filteredStats.length)}min/sem</span>
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
                        <div className="flex justify-between mb-2">
                          <span>Régularité (objectif: quotidien)</span>
                          <span>{Math.round(report.pourcentageJoursActifs)}%</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-success">
                    <CardHeader>
                      <CardTitle className="text-success">Points forts</CardTitle>
                    </CardHeader>
                    <CardContent>
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

                  <Card className="border-warning">
                    <CardHeader>
                      <CardTitle className="text-warning">Axes d'amélioration</CardTitle>
                    </CardHeader>
                    <CardContent>
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

                <Card className="bg-accent border-accent-bright">
                  <CardHeader>
                    <CardTitle>Recommandations personnalisées</CardTitle>
                  </CardHeader>
                  <CardContent>
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
      </main>
    </div>
  );
}