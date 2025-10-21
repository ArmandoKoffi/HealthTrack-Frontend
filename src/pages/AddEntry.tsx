import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService, sommeilService, repasService, activiteService } from '@/services/api';
import { Navbar } from '@/components/Layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Moon, 
  Utensils, 
  Activity, 
  Save,
  Clock,
  Star,
  Plus,
  Trash2
} from 'lucide-react';

export default function AddEntry() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const typeParam = searchParams.get('type') || 'sommeil';
  const [activeTab, setActiveTab] = useState(typeParam);

  // États pour le sommeil
  const [sommeilData, setSommeilData] = useState({
    date: new Date().toISOString().split('T')[0],
    heureCoucher: '22:00',
    heureReveil: '07:00',
    qualiteSommeil: 3 as 1 | 2 | 3 | 4 | 5,
    notes: ''
  });

  // États pour les repas
  const [repasData, setRepasData] = useState({
    date: new Date().toISOString().split('T')[0],
    typeRepas: 'petit-dejeuner' as 'petit-dejeuner' | 'dejeuner' | 'diner' | 'collation',
    aliments: [''],
    calories: '',
    notes: ''
  });

  // États pour l'activité
  const [activiteData, setActiviteData] = useState({
    date: new Date().toISOString().split('T')[0],
    typeActivite: '',
    duree: '',
    intensite: 'modere' as 'faible' | 'modere' | 'intense',
    notes: ''
  });

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
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        authService.logout();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    setActiveTab(typeParam);
  }, [typeParam]);

  if (!user) return null;

  const calculerDureeSommeil = () => {
    const [hCoucher, mCoucher] = sommeilData.heureCoucher.split(':').map(Number);
    const [hReveil, mReveil] = sommeilData.heureReveil.split(':').map(Number);
    
    let minutesCoucher = hCoucher * 60 + mCoucher;
    let minutesReveil = hReveil * 60 + mReveil;
    
    if (minutesReveil < minutesCoucher) {
      minutesReveil += 24 * 60; // Ajout d'une journée
    }
    
    return (minutesReveil - minutesCoucher) / 60;
  };

  const ajouterAliment = () => {
    setRepasData({
      ...repasData,
      aliments: [...repasData.aliments, '']
    });
  };

  const supprimerAliment = (index: number) => {
    const nouveauxAliments = repasData.aliments.filter((_, i) => i !== index);
    setRepasData({
      ...repasData,
      aliments: nouveauxAliments.length > 0 ? nouveauxAliments : ['']
    });
  };

  const modifierAliment = (index: number, valeur: string) => {
    const nouveauxAliments = [...repasData.aliments];
    nouveauxAliments[index] = valeur;
    setRepasData({
      ...repasData,
      aliments: nouveauxAliments
    });
  };

  const handleSubmitSommeil = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = authService.getToken() || '';
      const entree = {
        date: sommeilData.date,
        heureCoucher: sommeilData.heureCoucher,
        heureReveil: sommeilData.heureReveil,
        qualiteSommeil: sommeilData.qualiteSommeil,
        notes: sommeilData.notes,
        dureeSommeil: calculerDureeSommeil()
      };

      const result = await sommeilService.create(entree, token);
      
      if (result.success) {
        toast({
          title: "Sommeil enregistré !",
          description: `Durée: ${calculerDureeSommeil().toFixed(1)}h`,
        });
        navigate('/dashboard');
      } else {
        throw new Error(result.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du sommeil:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRepas = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = authService.getToken() || '';
      const entree = {
        date: repasData.date,
        typeRepas: repasData.typeRepas,
        aliments: repasData.aliments.filter(a => a.trim() !== ''),
        calories: repasData.calories ? parseInt(repasData.calories) : 0,
        notes: repasData.notes
      };

      const result = await repasService.create(entree, token);
      
      if (result.success) {
        toast({
          title: "Repas enregistré !",
          description: `${entree.aliments.length} aliments ajoutés`,
        });
        navigate('/dashboard');
      } else {
        throw new Error(result.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du repas:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitActivite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = authService.getToken() || '';
      const entree = {
        date: activiteData.date,
        typeActivite: activiteData.typeActivite,
        duree: parseInt(activiteData.duree),
        intensite: activiteData.intensite,
        notes: activiteData.notes
      };

      const result = await activiteService.create(entree, token);
      
      if (result.success) {
        toast({
          title: "Activité enregistrée !",
          description: `${entree.duree} minutes de ${entree.typeActivite}`,
        });
        navigate('/dashboard');
      } else {
        throw new Error(result.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Ajouter des données
          </h1>
          <p className="text-muted-foreground">
            Enregistrez vos activités quotidiennes pour suivre vos progrès
          </p>
        </div>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Nouvelle entrée</CardTitle>
            <CardDescription>
              Choisissez le type de données que vous souhaitez ajouter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sommeil" className="flex items-center space-x-2">
                  <Moon className="h-4 w-4" />
                  <span>Sommeil</span>
                </TabsTrigger>
                <TabsTrigger value="repas" className="flex items-center space-x-2">
                  <Utensils className="h-4 w-4" />
                  <span>Repas</span>
                </TabsTrigger>
                <TabsTrigger value="activite" className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Activité</span>
                </TabsTrigger>
              </TabsList>

              {/* Formulaire Sommeil */}
              <TabsContent value="sommeil" className="mt-6">
                <form onSubmit={handleSubmitSommeil} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date-sommeil">Date</Label>
                      <Input
                        id="date-sommeil"
                        type="date"
                        value={sommeilData.date}
                        onChange={(e) => setSommeilData({ ...sommeilData, date: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Durée calculée</Label>
                      <div className="text-2xl font-bold text-primary">
                        {calculerDureeSommeil().toFixed(1)}h
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heure-coucher">Heure de coucher</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="heure-coucher"
                          type="time"
                          value={sommeilData.heureCoucher}
                          onChange={(e) => setSommeilData({ ...sommeilData, heureCoucher: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heure-reveil">Heure de réveil</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="heure-reveil"
                          type="time"
                          value={sommeilData.heureReveil}
                          onChange={(e) => setSommeilData({ ...sommeilData, heureReveil: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                   <div className="space-y-2">
                     <Label>Qualité du sommeil</Label>
                     <div className="flex flex-wrap gap-2">
                       {[1, 2, 3, 4, 5].map((qualite) => (
                         <Button
                           key={qualite}
                           type="button"
                           variant={sommeilData.qualiteSommeil === qualite ? "default" : "outline"}
                           size="sm"
                           onClick={() => setSommeilData({ ...sommeilData, qualiteSommeil: qualite as any })}
                           className="flex items-center space-x-1 min-w-0 flex-shrink-0"
                         >
                           <Star className={`h-4 w-4 ${sommeilData.qualiteSommeil >= qualite ? 'fill-current' : ''}`} />
                           <span className="hidden sm:inline">{qualite}</span>
                         </Button>
                       ))}
                     </div>
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes-sommeil">Notes (optionnel)</Label>
                    <Textarea
                      id="notes-sommeil"
                      placeholder="Comment s'est passée votre nuit ?"
                      value={sommeilData.notes}
                      onChange={(e) => setSommeilData({ ...sommeilData, notes: e.target.value })}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-white"
                    disabled={isLoading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Enregistrement...' : 'Enregistrer le sommeil'}
                  </Button>
                </form>
              </TabsContent>

              {/* Formulaire Repas */}
              <TabsContent value="repas" className="mt-6">
                <form onSubmit={handleSubmitRepas} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date-repas">Date</Label>
                      <Input
                        id="date-repas"
                        type="date"
                        value={repasData.date}
                        onChange={(e) => setRepasData({ ...repasData, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type-repas">Type de repas</Label>
                      <Select 
                        value={repasData.typeRepas} 
                        onValueChange={(value: any) => setRepasData({ ...repasData, typeRepas: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petit-dejeuner">Petit-déjeuner</SelectItem>
                          <SelectItem value="dejeuner">Déjeuner</SelectItem>
                          <SelectItem value="diner">Dîner</SelectItem>
                          <SelectItem value="collation">Collation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Aliments consommés</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={ajouterAliment}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    
                    {repasData.aliments.map((aliment, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder="Nom de l'aliment"
                          value={aliment}
                          onChange={(e) => modifierAliment(index, e.target.value)}
                          required
                        />
                        {repasData.aliments.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => supprimerAliment(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories (optionnel)</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="Nombre de calories"
                      value={repasData.calories}
                      onChange={(e) => setRepasData({ ...repasData, calories: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes-repas">Notes (optionnel)</Label>
                    <Textarea
                      id="notes-repas"
                      placeholder="Informations supplémentaires sur ce repas"
                      value={repasData.notes}
                      onChange={(e) => setRepasData({ ...repasData, notes: e.target.value })}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-white"
                    disabled={isLoading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Enregistrement...' : 'Enregistrer le repas'}
                  </Button>
                </form>
              </TabsContent>

              {/* Formulaire Activité */}
              <TabsContent value="activite" className="mt-6">
                <form onSubmit={handleSubmitActivite} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date-activite">Date</Label>
                      <Input
                        id="date-activite"
                        type="date"
                        value={activiteData.date}
                        onChange={(e) => setActiviteData({ ...activiteData, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duree">Durée (minutes)</Label>
                      <Input
                        id="duree"
                        type="number"
                        placeholder="30"
                        value={activiteData.duree}
                        onChange={(e) => setActiviteData({ ...activiteData, duree: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type-activite">Type d'activité</Label>
                    <Input
                      id="type-activite"
                      placeholder="Course à pied, natation, yoga..."
                      value={activiteData.typeActivite}
                      onChange={(e) => setActiviteData({ ...activiteData, typeActivite: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intensite">Intensité</Label>
                    <Select 
                      value={activiteData.intensite} 
                      onValueChange={(value: any) => setActiviteData({ ...activiteData, intensite: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="faible">Faible</SelectItem>
                        <SelectItem value="modere">Modérée</SelectItem>
                        <SelectItem value="intense">Intense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes-activite">Notes (optionnel)</Label>
                    <Textarea
                      id="notes-activite"
                      placeholder="Comment s'est déroulée cette séance ?"
                      value={activiteData.notes}
                      onChange={(e) => setActiviteData({ ...activiteData, notes: e.target.value })}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-white"
                    disabled={isLoading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Enregistrement...' : 'Enregistrer l\'activité'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
