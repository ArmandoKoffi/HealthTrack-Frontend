import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authService, profileService } from '@/services/api';
import { MockDataService } from '@/services/mockData';
import { Navbar } from '@/components/Layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { EditEntryModal } from '@/components/EditEntryModal';
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
import { EntreeSommeil, EntreeRepas, EntreeActivite, User } from '@/types/health';

export default function History() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sommeilEntries, setSommeilEntries] = useState<EntreeSommeil[]>([]);
  const [repasEntries, setRepasEntries] = useState<EntreeRepas[]>([]);
  const [activiteEntries, setActiviteEntries] = useState<EntreeActivite[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<EntreeSommeil | EntreeRepas | EntreeActivite | null>(null);
  const [selectedEntryType, setSelectedEntryType] = useState<'sommeil' | 'repas' | 'activite'>('sommeil');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const dataService = MockDataService.getInstance();
  const { toast } = useToast();
  
  const activeTab = searchParams.get('type') || 'sommeil';

  useEffect(() => {
    let mounted = true;

    (async () => {
      const token = authService.getToken();
      if (!token) {
        setLoading(false);
        navigate('/login');
        return;
      }

      let currentUser = profileService.getUserData();

      if (!currentUser) {
        try {
          const res = await profileService.getProfile(token);
          if (res.success && res.user) {
            currentUser = res.user;
            profileService.saveUserData(res.user);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du profil:', error);
          authService.logout();
          profileService.clearUserData();
          setLoading(false);
          navigate('/login');
          return;
        }
      }

      if (mounted && currentUser) {
        setUser(currentUser);
        const sommeilData = dataService.getEntreesSommeil(currentUser.id);
        const repasData = dataService.getEntreesRepas(currentUser.id);
        const activiteData = dataService.getEntreesActivites(currentUser.id);
        
        setSommeilEntries(Array.isArray(sommeilData) ? sommeilData : []);
        setRepasEntries(Array.isArray(repasData) ? repasData : []);
        setActiviteEntries(Array.isArray(activiteData) ? activiteData : []);
      }

      setLoading(false);
    })();

    return () => { mounted = false; };
  }, [navigate]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
              <CardDescription>{loading ? 'Chargement des données…' : 'Veuillez vous connecter pour voir votre historique.'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Veuillez patienter' : 'Redirection vers la connexion…'}</span>
              </div>
              {!loading && (
                <div className="mt-4">
                  <Button variant="default" onClick={() => navigate('/login')}>Se connecter</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error, dateString);
      return dateString; // Retourne la chaîne originale en cas d'erreur
    }
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

  // Fonction de recherche
  const searchEntries = (entries: (EntreeSommeil | EntreeRepas | EntreeActivite)[], type: string) => {
    if (!searchTerm.trim()) return entries;
    
    const searchLower = searchTerm.toLowerCase();
    
    return entries.filter(entry => {
      // Recherche par date
      if (formatDate(entry.date).toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Recherche par notes
      if (entry.notes && entry.notes.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Recherche spécifique par type
      if (type === 'sommeil') {
        const sleepEntry = entry as EntreeSommeil;
        return sleepEntry.heureCoucher.includes(searchTerm) || 
               sleepEntry.heureReveil.includes(searchTerm) ||
               sleepEntry.dureeSommeil.toString().includes(searchTerm);
      }
      
      if (type === 'repas') {
        const mealEntry = entry as EntreeRepas;
        return mealEntry.typeRepas.toLowerCase().includes(searchLower) ||
               mealEntry.aliments.some(aliment => aliment.toLowerCase().includes(searchLower)) ||
               (mealEntry.calories && mealEntry.calories.toString().includes(searchTerm)) ||
               (mealEntry.notes && mealEntry.notes.toLowerCase().includes(searchLower));
      }
      
      if (type === 'activite') {
        const activityEntry = entry as EntreeActivite;
        return activityEntry.typeActivite.toLowerCase().includes(searchLower) ||
               activityEntry.duree.toString().includes(searchTerm) ||
               activityEntry.intensite.toLowerCase().includes(searchLower) ||
               (activityEntry.caloriesBrulees && activityEntry.caloriesBrulees.toString().includes(searchTerm)) ||
               (activityEntry.notes && activityEntry.notes.toLowerCase().includes(searchLower));
      }
      
      return false;
    });
  };

  // Fonction de filtrage par période
  const filterByPeriod = (entries: (EntreeSommeil | EntreeRepas | EntreeActivite)[]) => {
    if (filterPeriod === 'all') return entries;
    if (!entries || entries.length === 0) return [];
    
    const now = new Date();
    const filtered = entries.filter(entry => {
      try {
        const entryDate = new Date(entry.date);
        if (isNaN(entryDate.getTime())) return false;
        
        const diffTime = now.getTime() - entryDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filterPeriod) {
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          case 'quarter': return diffDays <= 90;
          default: return true;
        }
      } catch (error) {
        console.error('Erreur lors du filtrage par période:', error, entry);
        return false;
      }
    });
    
    return filtered;
  };

  // Application des filtres et recherche
  const filteredSommeil = useMemo(() => {
    if (!sommeilEntries || sommeilEntries.length === 0) return [];
    const periodFiltered = filterByPeriod(sommeilEntries);
    return searchEntries(periodFiltered, 'sommeil');
  }, [sommeilEntries, filterPeriod, searchTerm]);

  const filteredRepas = useMemo(() => {
    if (!repasEntries || repasEntries.length === 0) return [];
    const periodFiltered = filterByPeriod(repasEntries);
    return searchEntries(periodFiltered, 'repas');
  }, [repasEntries, filterPeriod, searchTerm]);

  const filteredActivite = useMemo(() => {
    if (!activiteEntries || activiteEntries.length === 0) return [];
    const periodFiltered = filterByPeriod(activiteEntries);
    return searchEntries(periodFiltered, 'activite');
  }, [activiteEntries, filterPeriod, searchTerm]);

  const handleEdit = (entry: EntreeSommeil | EntreeRepas | EntreeActivite, type: 'sommeil' | 'repas' | 'activite') => {
    setSelectedEntry(entry);
    setSelectedEntryType(type);
    setEditModalOpen(true);
  };

  const handleSaveEntry = (updatedEntry: EntreeSommeil | EntreeRepas | EntreeActivite) => {
    if (selectedEntryType === 'sommeil') {
      setSommeilEntries(prev => prev.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry as EntreeSommeil : entry
      ));
    } else if (selectedEntryType === 'repas') {
      setRepasEntries(prev => prev.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry as EntreeRepas : entry
      ));
    } else if (selectedEntryType === 'activite') {
      setActiviteEntries(prev => prev.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry as EntreeActivite : entry
      ));
    }
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
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'entrée',
        variant: 'destructive'
      });
    }
  };

  const navigateToSection = (section: string) => {
    navigate(`/historique?type=${section}`);
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
                    placeholder="Rechercher par date, notes, aliments, activité..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Recherche en temps réel dans les dates, notes, aliments et activités
                </p>
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

        {/* Navigation rapide entre sections */}
        <div className="flex flex-nowrap gap-2 mb-6 overflow-x-auto pb-2">
          <Button 
            variant={activeTab === 'sommeil' ? "default" : "outline"} 
            className="flex items-center space-x-2 whitespace-nowrap flex-shrink-0"
            onClick={() => navigateToSection('sommeil')}
          >
            <Moon className="h-4 w-4" />
            <span>Sommeil ({filteredSommeil.length})</span>
          </Button>
          <Button 
            variant={activeTab === 'repas' ? "default" : "outline"} 
            className="flex items-center space-x-2 whitespace-nowrap flex-shrink-0"
            onClick={() => navigateToSection('repas')}
          >
            <Utensils className="h-4 w-4" />
            <span>Repas ({filteredRepas.length})</span>
          </Button>
          <Button 
            variant={activeTab === 'activite' ? "default" : "outline"} 
            className="flex items-center space-x-2 whitespace-nowrap flex-shrink-0"
            onClick={() => navigateToSection('activite')}
          >
            <Activity className="h-4 w-4" />
            <span>Activités ({filteredActivite.length})</span>
          </Button>
        </div>

        {/* Contenu principal */}
        <div className="space-y-6">
          {/* Historique Sommeil */}
          {activeTab === 'sommeil' && (
            <div className="space-y-4">
              {filteredSommeil.map((entry) => {
                const sleepEntry = entry as EntreeSommeil;
                return (
                  <Card key={sleepEntry.id} className="hover:shadow-medium transition-smooth">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-secondary-accent" />
                            <span>{formatDate(sleepEntry.date)}</span>
                          </CardTitle>
                          <CardDescription>
                            Sommeil de {sleepEntry.dureeSommeil.toFixed(1)} heures
                          </CardDescription>
                        </div>
                         <div className="flex space-x-2">
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => handleEdit(sleepEntry, 'sommeil')}
                           >
                             <Edit className="h-4 w-4" />
                           </Button>
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => handleDelete(sleepEntry.id, 'sommeil')}
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
                            {formatTime(sleepEntry.heureCoucher)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Réveil</p>
                          <p className="text-lg font-semibold flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTime(sleepEntry.heureReveil)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Durée</p>
                          <p className="text-lg font-semibold text-primary">
                            {sleepEntry.dureeSommeil.toFixed(1)}h
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Qualité</p>
                          <div className="flex space-x-1">
                            {getQualityStars(sleepEntry.qualiteSommeil)}
                          </div>
                        </div>
                      </div>
                      {sleepEntry.notes && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                          <p className="text-sm text-foreground bg-muted p-2 rounded">
                            {sleepEntry.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Historique Repas */}
          {activeTab === 'repas' && (
            <div className="space-y-4">
              {filteredRepas.map((entry) => {
                const mealEntry = entry as EntreeRepas;
                return (
                  <Card key={mealEntry.id} className="hover:shadow-medium transition-smooth">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-warning" />
                            <span>{formatDate(mealEntry.date)}</span>
                            <Badge className="capitalize">
                              {mealEntry.typeRepas.replace('-', ' ')}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {mealEntry.aliments.length} aliments
                            {mealEntry.calories && ` • ${mealEntry.calories} calories`}
                          </CardDescription>
                        </div>
                         <div className="flex space-x-2">
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => handleEdit(mealEntry, 'repas')}
                           >
                             <Edit className="h-4 w-4" />
                           </Button>
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => handleDelete(mealEntry.id, 'repas')}
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
                            {mealEntry.aliments.map((aliment, index) => (
                              <Badge key={index} variant="outline">
                                {aliment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {(mealEntry.calories || mealEntry.proteines || mealEntry.glucides || mealEntry.lipides) && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {mealEntry.calories && (
                              <div>
                                <p className="text-sm text-muted-foreground">Calories</p>
                                <p className="font-semibold">{mealEntry.calories}</p>
                              </div>
                            )}
                            {mealEntry.proteines && (
                              <div>
                                <p className="text-sm text-muted-foreground">Protéines</p>
                                <p className="font-semibold">{mealEntry.proteines}g</p>
                              </div>
                            )}
                            {mealEntry.glucides && (
                              <div>
                                <p className="text-sm text-muted-foreground">Glucides</p>
                                <p className="font-semibold">{mealEntry.glucides}g</p>
                              </div>
                            )}
                            {mealEntry.lipides && (
                              <div>
                                <p className="text-sm text-muted-foreground">Lipides</p>
                                <p className="font-semibold">{mealEntry.lipides}g</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {mealEntry.notes && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                            <p className="text-sm text-foreground bg-muted p-2 rounded">
                              {mealEntry.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Historique Activités */}
          {activeTab === 'activite' && (
            <div className="space-y-4">
              {filteredActivite.map((entry) => {
                const activityEntry = entry as EntreeActivite;
                return (
                  <Card key={activityEntry.id} className="hover:shadow-medium transition-smooth">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-success" />
                            <span>{formatDate(activityEntry.date)}</span>
                            {getIntensityBadge(activityEntry.intensite)}
                          </CardTitle>
                          <CardDescription>
                            {activityEntry.typeActivite} • {activityEntry.duree} minutes
                          </CardDescription>
                        </div>
                         <div className="flex space-x-2">
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => handleEdit(activityEntry, 'activite')}
                           >
                             <Edit className="h-4 w-4" />
                           </Button>
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => handleDelete(activityEntry.id, 'activite')}
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
                          <p className="text-lg font-semibold">{activityEntry.typeActivite}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Durée</p>
                          <p className="text-lg font-semibold text-success">{activityEntry.duree} min</p>
                        </div>
                        {activityEntry.caloriesBrulees && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Calories brûlées</p>
                            <p className="text-lg font-semibold text-warning">
                              {activityEntry.caloriesBrulees} cal
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {activityEntry.notes && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                          <p className="text-sm text-foreground bg-muted p-2 rounded">
                            {activityEntry.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

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

      {/* Popup de modification d'entrée */}
      <EditEntryModal 
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        entry={selectedEntry}
        type={selectedEntryType}
        onSave={handleSaveEntry}
      />
    </div>
  );
}
