import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Moon, Utensils, Activity } from 'lucide-react';
import { EntreeSommeil, EntreeRepas, EntreeActivite } from '@/types/health';

interface EditEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: EntreeSommeil | EntreeRepas | EntreeActivite | null;
  type: 'sommeil' | 'repas' | 'activite';
  onSave: (updatedEntry: EntreeSommeil | EntreeRepas | EntreeActivite) => void;
}

export function EditEntryModal({ isOpen, onClose, entry, type, onSave }: EditEntryModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour chaque type d'entrée
  const [sommeilData, setSommeilData] = useState({
    date: '',
    heureCoucher: '',
    heureReveil: '',
    qualiteSommeil: 3,
    notes: ''
  });
  
  const [repasData, setRepasData] = useState({
    date: '',
    typeRepas: 'petit-dejeuner',
    aliments: '',
    calories: '',
    proteines: '',
    glucides: '',
    lipides: '',
    notes: ''
  });
  
  const [activiteData, setActiviteData] = useState({
    date: '',
    typeActivite: '',
    duree: '',
    intensite: 'modere',
    caloriesBrulees: '',
    notes: ''
  });

  // Initialiser les données quand l'entrée change
  useEffect(() => {
    if (entry) {
      if (type === 'sommeil') {
        const sleepEntry = entry as EntreeSommeil;
        setSommeilData({
          date: sleepEntry.date,
          heureCoucher: sleepEntry.heureCoucher,
          heureReveil: sleepEntry.heureReveil,
          qualiteSommeil: sleepEntry.qualiteSommeil,
          notes: sleepEntry.notes || ''
        });
      } else if (type === 'repas') {
        const mealEntry = entry as EntreeRepas;
        setRepasData({
          date: mealEntry.date,
          typeRepas: mealEntry.typeRepas,
          aliments: mealEntry.aliments.join(', '),
          calories: mealEntry.calories?.toString() || '',
          proteines: mealEntry.proteines?.toString() || '',
          glucides: mealEntry.glucides?.toString() || '',
          lipides: mealEntry.lipides?.toString() || '',
          notes: mealEntry.notes || ''
        });
      } else if (type === 'activite') {
        const activityEntry = entry as EntreeActivite;
        setActiviteData({
          date: activityEntry.date,
          typeActivite: activityEntry.typeActivite,
          duree: activityEntry.duree.toString(),
          intensite: activityEntry.intensite,
          caloriesBrulees: activityEntry.caloriesBrulees?.toString() || '',
          notes: activityEntry.notes || ''
        });
      }
    }
  }, [entry, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let updatedEntry;

      if (type === 'sommeil') {
        // Calculer la durée du sommeil
        const coucher = new Date(`2000-01-01T${sommeilData.heureCoucher}`);
        const reveil = new Date(`2000-01-01T${sommeilData.heureReveil}`);
        let duree = (reveil.getTime() - coucher.getTime()) / (1000 * 60 * 60);
        if (duree < 0) duree += 24; // Gérer le passage de minuit

        updatedEntry = {
          ...entry,
          date: sommeilData.date,
          heureCoucher: sommeilData.heureCoucher,
          heureReveil: sommeilData.heureReveil,
          dureeSommeil: parseFloat(duree.toFixed(1)),
          qualiteSommeil: sommeilData.qualiteSommeil,
          notes: sommeilData.notes || undefined
        };
      } else if (type === 'repas') {
        updatedEntry = {
          ...entry,
          date: repasData.date,
          typeRepas: repasData.typeRepas,
          aliments: repasData.aliments.split(',').map(a => a.trim()).filter(a => a),
          calories: repasData.calories ? parseInt(repasData.calories) : undefined,
          proteines: repasData.proteines ? parseFloat(repasData.proteines) : undefined,
          glucides: repasData.glucides ? parseFloat(repasData.glucides) : undefined,
          lipides: repasData.lipides ? parseFloat(repasData.lipides) : undefined,
          notes: repasData.notes || undefined
        };
      } else if (type === 'activite') {
        updatedEntry = {
          ...entry,
          date: activiteData.date,
          typeActivite: activiteData.typeActivite,
          duree: parseInt(activiteData.duree),
          intensite: activiteData.intensite,
          caloriesBrulees: activiteData.caloriesBrulees ? parseInt(activiteData.caloriesBrulees) : undefined,
          notes: activiteData.notes || undefined
        };
      }

      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSave(updatedEntry);
      
      toast({
        title: "Succès !",
        description: "L'entrée a été modifiée avec succès",
      });

      onClose();

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la modification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    onClose();
  };

  const getModalTitle = () => {
    const icons = {
      sommeil: <Moon className="h-5 w-5 text-secondary-accent" />,
      repas: <Utensils className="h-5 w-5 text-warning" />,
      activite: <Activity className="h-5 w-5 text-success" />
    };
    
    const titles = {
      sommeil: "Modifier l'entrée de sommeil",
      repas: "Modifier l'entrée de repas", 
      activite: "Modifier l'entrée d'activité"
    };

    return (
      <div className="flex items-center space-x-2">
        {icons[type]}
        <span>{titles[type]}</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre entrée
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Formulaire Sommeil */}
          {type === 'sommeil' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={sommeilData.date}
                  onChange={(e) => setSommeilData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heureCoucher">Heure de coucher</Label>
                  <Input
                    id="heureCoucher"
                    type="time"
                    value={sommeilData.heureCoucher}
                    onChange={(e) => setSommeilData(prev => ({ ...prev, heureCoucher: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heureReveil">Heure de réveil</Label>
                  <Input
                    id="heureReveil"
                    type="time"
                    value={sommeilData.heureReveil}
                    onChange={(e) => setSommeilData(prev => ({ ...prev, heureReveil: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualiteSommeil">Qualité du sommeil</Label>
                <Select 
                  value={sommeilData.qualiteSommeil.toString()} 
                  onValueChange={(value) => setSommeilData(prev => ({ ...prev, qualiteSommeil: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la qualité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Très mauvais</SelectItem>
                    <SelectItem value="2">2 - Mauvais</SelectItem>
                    <SelectItem value="3">3 - Moyen</SelectItem>
                    <SelectItem value="4">4 - Bon</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Ajoutez des notes sur votre sommeil..."
                  value={sommeilData.notes}
                  onChange={(e) => setSommeilData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Formulaire Repas */}
          {type === 'repas' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={repasData.date}
                  onChange={(e) => setRepasData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeRepas">Type de repas</Label>
                <Select 
                  value={repasData.typeRepas} 
                  onValueChange={(value) => setRepasData(prev => ({ ...prev, typeRepas: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petit-dejeuner">Petit-déjeuner</SelectItem>
                    <SelectItem value="dejeuner">Déjeuner</SelectItem>
                    <SelectItem value="diner">Dîner</SelectItem>
                    <SelectItem value="collation">Collation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aliments">Aliments (séparés par des virgules)</Label>
                <Textarea
                  id="aliments"
                  placeholder="Pomme, Pain complet, Fromage..."
                  value={repasData.aliments}
                  onChange={(e) => setRepasData(prev => ({ ...prev, aliments: e.target.value }))}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="0"
                    value={repasData.calories}
                    onChange={(e) => setRepasData(prev => ({ ...prev, calories: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proteines">Protéines (g)</Label>
                  <Input
                    id="proteines"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={repasData.proteines}
                    onChange={(e) => setRepasData(prev => ({ ...prev, proteines: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="glucides">Glucides (g)</Label>
                  <Input
                    id="glucides"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={repasData.glucides}
                    onChange={(e) => setRepasData(prev => ({ ...prev, glucides: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lipides">Lipides (g)</Label>
                  <Input
                    id="lipides"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={repasData.lipides}
                    onChange={(e) => setRepasData(prev => ({ ...prev, lipides: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Ajoutez des notes sur votre repas..."
                  value={repasData.notes}
                  onChange={(e) => setRepasData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Formulaire Activité */}
          {type === 'activite' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={activiteData.date}
                  onChange={(e) => setActiviteData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeActivite">Type d'activité</Label>
                <Input
                  id="typeActivite"
                  placeholder="Course à pied, Yoga, Natation..."
                  value={activiteData.typeActivite}
                  onChange={(e) => setActiviteData(prev => ({ ...prev, typeActivite: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duree">Durée (minutes)</Label>
                  <Input
                    id="duree"
                    type="number"
                    placeholder="30"
                    value={activiteData.duree}
                    onChange={(e) => setActiviteData(prev => ({ ...prev, duree: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intensite">Intensité</Label>
                  <Select 
                    value={activiteData.intensite} 
                    onValueChange={(value) => setActiviteData(prev => ({ ...prev, intensite: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez l'intensité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="faible">Faible</SelectItem>
                      <SelectItem value="modere">Modérée</SelectItem>
                      <SelectItem value="intense">Intense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caloriesBrulees">Calories brûlées</Label>
                <Input
                  id="caloriesBrulees"
                  type="number"
                  placeholder="0"
                  value={activiteData.caloriesBrulees}
                  onChange={(e) => setActiviteData(prev => ({ ...prev, caloriesBrulees: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Ajoutez des notes sur votre activité..."
                  value={activiteData.notes}
                  onChange={(e) => setActiviteData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isLoading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 gradient-primary text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Modification...
                </>
              ) : (
                'Modifier'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
