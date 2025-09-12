import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MockAuthService } from '@/services/mockAuth';
import { MockDataService } from '@/services/mockData';
import { Navbar } from '@/components/Layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  Clock,
  Moon,
  Utensils,
  Activity,
  Star,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EntreeSommeil, EntreeRepas, EntreeActivite } from '@/types/health';

export default function History() {
  const [searchParams] = useSearchParams();
  const [sommeilEntries, setSommeilEntries] = useState<EntreeSommeil[]>([]);
  const [repasEntries, setRepasEntries] = useState<EntreeRepas[]>([]);
  const [activiteEntries, setActiviteEntries] = useState<EntreeActivite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  
  const authService = MockAuthService.getInstance();
  const dataService = MockDataService.getInstance();
  const user = authService.getCurrentUser();
  const { toast } = useToast();
  
  const activeTab = searchParams.get('type') || 'sommeil';

  useEffect(() => {
    if (user) {
      setSommeilEntries(dataService.getEntreesSommeil(user.id));
      setRepasEntries(dataService.getEntreesRepas(user.id));
      setActiviteEntries(dataService.getEntreesActivites(user.id));
    }
  }, [user]);

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getQualityStars = (quality: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < quality ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
      />
    ));
  };

  const getIntensityBadge = (intensite: string) => {
    const styles = {
      faible: 'bg-muted text-muted-foreground',
      modere: 'bg-warning text-warning-foreground',
      intense: 'bg-destructive text-destructive-foreground'
    };
    return <Badge className={styles[intensite as keyof typeof styles]}>{intensite}</Badge>;
  };

  const filterByPeriod = (entries: any[]) => {
    if (filterPeriod === 'all') return entries;
    
    const now = new Date();
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const diffTime = now.getTime() - entryDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (filterPeriod) {
        case 'week': return diffDays <= 7;
        case 'month': return diffDays <= 30;
        case 'quarter': return diffDays <= 90;
        default: return true;
      }
    });
    
    return filtered;
  };

  const filteredSommeil = filterByPeriod(sommeilEntries);
  const filteredRepas = filterByPeriod(repasEntries);
  const filteredActivite = filterByPeriod(activiteEntries);

  const handleEdit = (id: string, type: string) => {
    toast({
      title: "Modification",
      description: `Ouverture de l'éditeur pour ${type}`,
    });
    // Ici on pourrait naviguer vers une page d'édition
  };

  const handleDelete = async (id: string, type: string) => {
    try {
      // Simuler la suppression
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (type === 'sommeil') {
        setSommeilEntries(prev => prev.filter(entry => entry.id !== id));
      } else if (type === 'repas') {
        setRepasEntries(prev => prev.filter(entry => entry.id !== id));
      } else if (type === 'activite') {
        setActiviteEntries(prev => prev.filter(entry => entry.id !== id));
      }

      toast({
        title: "Suppression réussie",
        description: `L'entrée ${type} a été supprimée`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entrée",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Historique des données
              </h1>
              <p className="text-muted-foreground">
                Consultez et gérez toutes vos entrées précédentes
              </p>
            </div>
            
            <Link to="/ajouter">
              <Button className="gradient-primary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une entrée
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtres</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toute période</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">3 derniers mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contenu principal */}
        <Tabs value={activeTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sommeil">
              <Moon className="h-4 w-4 mr-2" />
              Sommeil ({filteredSommeil.length})
            </TabsTrigger>
            <TabsTrigger value="repas">
              <Utensils className="h-4 w-4 mr-2" />
              Repas ({filteredRepas.length})
            </TabsTrigger>
            <TabsTrigger value="activite">
              <Activity className="h-4 w-4 mr-2" />
              Activités ({filteredActivite.length})
            </TabsTrigger>
          </TabsList>

          {/* Historique Sommeil */}
          <TabsContent value="sommeil" className="space-y-4">
            {filteredSommeil.map((entry) => (
              <Card key={entry.id} className="hover:shadow-medium transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-secondary-accent" />
                        <span>{formatDate(entry.date)}</span>
                      </CardTitle>
                      <CardDescription>
                        Sommeil de {entry.dureeSommeil.toFixed(1)} heures
                      </CardDescription>
                    </div>
                     <div className="flex space-x-2">
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleEdit(entry.id, 'sommeil')}
                       >
                         <Edit className="h-4 w-4" />
                       </Button>
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleDelete(entry.id, 'sommeil')}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Coucher</p>
                      <p className="text-lg font-semibold flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(entry.heureCoucher)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Réveil</p>
                      <p className="text-lg font-semibold flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(entry.heureReveil)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Durée</p>
                      <p className="text-lg font-semibold text-primary">
                        {entry.dureeSommeil.toFixed(1)}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Qualité</p>
                      <div className="flex space-x-1">
                        {getQualityStars(entry.qualiteSommeil)}
                      </div>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm text-foreground bg-muted p-2 rounded">
                        {entry.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Historique Repas */}
          <TabsContent value="repas" className="space-y-4">
            {filteredRepas.map((entry) => (
              <Card key={entry.id} className="hover:shadow-medium transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-warning" />
                        <span>{formatDate(entry.date)}</span>
                        <Badge className="capitalize">
                          {entry.typeRepas.replace('-', ' ')}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {entry.aliments.length} aliments
                        {entry.calories && ` • ${entry.calories} calories`}
                      </CardDescription>
                    </div>
                     <div className="flex space-x-2">
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleEdit(entry.id, 'repas')}
                       >
                         <Edit className="h-4 w-4" />
                       </Button>
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleDelete(entry.id, 'repas')}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Aliments</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.aliments.map((aliment, index) => (
                          <Badge key={index} variant="outline">
                            {aliment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {(entry.calories || entry.proteines || entry.glucides || entry.lipides) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {entry.calories && (
                          <div>
                            <p className="text-sm text-muted-foreground">Calories</p>
                            <p className="font-semibold">{entry.calories}</p>
                          </div>
                        )}
                        {entry.proteines && (
                          <div>
                            <p className="text-sm text-muted-foreground">Protéines</p>
                            <p className="font-semibold">{entry.proteines}g</p>
                          </div>
                        )}
                        {entry.glucides && (
                          <div>
                            <p className="text-sm text-muted-foreground">Glucides</p>
                            <p className="font-semibold">{entry.glucides}g</p>
                          </div>
                        )}
                        {entry.lipides && (
                          <div>
                            <p className="text-sm text-muted-foreground">Lipides</p>
                            <p className="font-semibold">{entry.lipides}g</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {entry.notes && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm text-foreground bg-muted p-2 rounded">
                          {entry.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Historique Activités */}
          <TabsContent value="activite" className="space-y-4">
            {filteredActivite.map((entry) => (
              <Card key={entry.id} className="hover:shadow-medium transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-success" />
                        <span>{formatDate(entry.date)}</span>
                        {getIntensityBadge(entry.intensite)}
                      </CardTitle>
                      <CardDescription>
                        {entry.typeActivite} • {entry.duree} minutes
                      </CardDescription>
                    </div>
                     <div className="flex space-x-2">
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleEdit(entry.id, 'activite')}
                       >
                         <Edit className="h-4 w-4" />
                       </Button>
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleDelete(entry.id, 'activite')}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Activité</p>
                      <p className="text-lg font-semibold">{entry.typeActivite}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Durée</p>
                      <p className="text-lg font-semibold text-success">{entry.duree} min</p>
                    </div>
                    {entry.caloriesBrulees && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Calories brûlées</p>
                        <p className="text-lg font-semibold text-warning">
                          {entry.caloriesBrulees} cal
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {entry.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm text-foreground bg-muted p-2 rounded">
                        {entry.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* État vide */}
        {filteredSommeil.length === 0 && filteredRepas.length === 0 && filteredActivite.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl text-muted-foreground mb-2">
                Aucune donnée trouvée
              </CardTitle>
              <CardDescription>
                Ajustez vos filtres ou commencez à enregistrer vos données de santé
              </CardDescription>
              <Link to="/ajouter">
                <Button className="mt-4 gradient-primary text-white">
                  Ajouter une première entrée
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}