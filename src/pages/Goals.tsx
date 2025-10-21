import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, objectifService, handleAuthError } from '@/services/api';
import { Navbar } from '@/components/Layout/Navbar';
import { User } from '@/types/health';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  Plus, 
  Edit,
  Trash2,
  Save,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ObjectifUtilisateur } from '@/types/health';

export default function Goals() {
  const [objectifs, setObjectifs] = useState<ObjectifUtilisateur[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    type: 'poids' as 'poids' | 'sommeil' | 'activite' | 'calories' | 'eau',
    valeurCible: '',
    dateFinSouhaitee: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
        // Si pas de token, rediriger vers la page de connexion
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
        
        // Charger les données réelles depuis l'API
        const result = await objectifService.getObjectifs({}, token);
        
        if (result.success && result.data) {
          setObjectifs(Array.isArray(result.data) ? result.data : [result.data]);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les objectifs",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des objectifs:', error);
        // Gestion spécifique des erreurs d'authentification (401, token invalide/expiré)
        handleAuthError(error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les objectifs",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  if (!user) return null;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = authService.getToken() || '';
      if (!token) {
        navigate('/login');
        return;
      }
      const nouvelObjectif = {
        type: formData.type,
        valeurCible: parseFloat(formData.valeurCible),
        valeurActuelle: getCurrentValue(formData.type),
        dateDebut: new Date().toISOString().split('T')[0],
        dateFinSouhaitee: formData.dateFinSouhaitee,
        actif: true
      };

      // Correction: utiliser la bonne méthode du service
      const result = await objectifService.createObjectif(nouvelObjectif, token);
      
      if (result.success && result.data) {
        // Ajouter le nouvel objectif à la liste
        const newObjectif = result.data as ObjectifUtilisateur;
        setObjectifs([...objectifs, newObjectif]);
        setIsCreating(false);
        setFormData({ type: 'poids', valeurCible: '', dateFinSouhaitee: '' });
        
        toast({
          title: "Objectif créé !",
          description: "Votre nouvel objectif a été ajouté avec succès",
        });
      } else {
        throw new Error(result.message || "Erreur lors de la création de l'objectif");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'objectif:", error);
      handleAuthError(error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'objectif",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (objectifId: string) => {
    try {
      setEditingId(objectifId);
      const objectif = objectifs.find(obj => obj.id === objectifId);
      if (objectif) {
        setFormData({
          type: objectif.type,
          valeurCible: objectif.valeurCible.toString(),
          dateFinSouhaitee: objectif.dateFinSouhaitee
        });
        setIsCreating(true);
      }
      toast({
        title: "Mode édition",
        description: "Modifiez les paramètres de votre objectif",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'éditer l'objectif",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const token = authService.getToken() || '';
      if (!token || !editingId) {
        navigate('/login');
        return;
      }

      const updates = {
        type: formData.type,
        valeurCible: parseFloat(formData.valeurCible),
        dateFinSouhaitee: formData.dateFinSouhaitee,
      };

      const result = await objectifService.updateObjectif(editingId, updates, token);
      if (result.success && result.data) {
        const updated = result.data as ObjectifUtilisateur;
        setObjectifs(prev => prev.map(obj => obj.id === updated.id ? updated : obj));
        setIsCreating(false);
        setEditingId(null);
        setFormData({ type: 'poids', valeurCible: '', dateFinSouhaitee: '' });
        toast({
          title: "Objectif mis à jour !",
          description: "Vos modifications ont été sauvegardées",
        });
      } else {
        throw new Error(result.message || "Erreur lors de la mise à jour de l'objectif");
      }
    } catch (error) {
      handleAuthError(error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'objectif",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (objectifId: string) => {
    try {
      const token = authService.getToken() || '';
      if (!token) {
        navigate('/login');
        return;
      }

      const result = await objectifService.deleteObjectif(objectifId, token);
      if (result.success) {
        setObjectifs(objectifs.filter(obj => obj.id !== objectifId));
        toast({
          title: "Objectif supprimé",
          description: "L'objectif a été retiré de votre liste",
        });
      } else {
        throw new Error(result.message || "Erreur lors de la suppression de l'objectif");
      }
    } catch (error) {
      handleAuthError(error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'objectif",
        variant: "destructive",
      });
    }
  };

  const getCurrentValue = (type: string): number => {
    switch (type) {
      case 'poids': return user.poids || 70;
      case 'sommeil': return 7.5;
      case 'activite': return 120;
      case 'calories': return 1800;
      case 'eau': return 1.5; // Valeur par défaut en litres
      default: return 0;
    }
  };

  const getTypeLabel = (type: string): string => {
    const labels = {
      poids: 'Poids',
      sommeil: 'Sommeil',
      activite: 'Activité physique',
      calories: 'Calories',
      eau: 'Hydratation'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeUnit = (type: string): string => {
    const units = {
      poids: 'kg',
      sommeil: 'h/nuit',
      activite: 'min/semaine',
      calories: 'cal/jour',
      eau: 'L/jour'
    };
    return units[type as keyof typeof units] || '';
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return 'text-success';
    if (progress >= 70) return 'text-warning';
    return 'text-info';
  };

  const getStatusBadge = (objectif: ObjectifUtilisateur) => {
    const progress = (objectif.valeurActuelle / objectif.valeurCible) * 100;
    const isExpired = new Date(objectif.dateFinSouhaitee) < new Date();
    
    if (!objectif.actif) {
      return <Badge variant="outline">Inactif</Badge>;
    }
    if (progress >= 100) {
      return <Badge className="bg-success text-success-foreground">Atteint</Badge>;
    }
    if (isExpired) {
      return <Badge variant="destructive">Expiré</Badge>;
    }
    return <Badge className="bg-info text-info-foreground">En cours</Badge>;
  };

  const getDaysRemaining = (dateFinSouhaitee: string): number => {
    const today = new Date();
    const endDate = new Date(dateFinSouhaitee);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
                Mes Objectifs
              </h1>
              <p className="text-muted-foreground">
                Définissez et suivez vos objectifs de santé
              </p>
            </div>
            
            <Button 
              onClick={() => setIsCreating(true)}
              className="gradient-primary text-white"
              disabled={isCreating}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel objectif
            </Button>
          </div>
        </div>

        {/* Statistiques des objectifs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{objectifs.length}</p>
                  <p className="text-sm text-muted-foreground">Total objectifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {objectifs.filter(obj => obj.actif).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {objectifs.filter(obj => (obj.valeurActuelle / obj.valeurCible) >= 1).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Atteints</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-info" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(
                      objectifs
                        .filter(obj => obj.actif)
                        .reduce((acc, obj) => acc + (obj.valeurActuelle / obj.valeurCible) * 100, 0) / 
                      Math.max(objectifs.filter(obj => obj.actif).length, 1)
                    )}%
                  </p>
                  <p className="text-sm text-muted-foreground">Progression moyenne</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire de création */}
        {isCreating && (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {editingId ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                <span>{editingId ? 'Modifier l\'objectif' : 'Créer un nouvel objectif'}</span>
              </CardTitle>
              <CardDescription>
                {editingId ? 'Modifiez les paramètres de votre objectif' : 'Définissez un objectif spécifique et mesurable'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Type d'objectif</Label>
                  <select 
                    className="w-full p-2 border border-input rounded-md bg-background"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="poids">Poids corporel</option>
                    <option value="sommeil">Heures de sommeil</option>
                    <option value="activite">Activité physique</option>
                    <option value="calories">Calories quotidiennes</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Valeur cible</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder={`Ex: 65 ${getTypeUnit(formData.type)}`}
                    value={formData.valeurCible}
                    onChange={(e) => setFormData({ ...formData, valeurCible: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date limite</Label>
                  <Input
                    type="date"
                    value={formData.dateFinSouhaitee}
                    onChange={(e) => setFormData({ ...formData, dateFinSouhaitee: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={editingId ? handleUpdate : handleSave} 
                  className="gradient-primary text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Mettre à jour' : 'Créer l\'objectif'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({ type: 'poids', valeurCible: '', dateFinSouhaitee: '' });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des objectifs */}
        <div className="space-y-6">
          {objectifs.map((objectif) => {
            const progress = Math.min((objectif.valeurActuelle / objectif.valeurCible) * 100, 100);
            const daysRemaining = getDaysRemaining(objectif.dateFinSouhaitee);
            
            return (
              <Card key={objectif.id} className="shadow-medium">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl">
                          {getTypeLabel(objectif.type)}
                        </CardTitle>
                        {getStatusBadge(objectif)}
                      </div>
                      <CardDescription>
                        Objectif: {objectif.valeurCible} {getTypeUnit(objectif.type)} 
                        • Créé le {new Date(objectif.dateDebut).toLocaleDateString('fr-FR')}
                      </CardDescription>
                    </div>
                    
                     <div className="flex space-x-2">
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleEdit(objectif.id)}
                       >
                         <Edit className="h-4 w-4" />
                       </Button>
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => handleDelete(objectif.id)}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    {/* Progression */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Progression
                        </span>
                        <span className={`text-lg font-bold ${getProgressColor(progress)}`}>
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    {/* Détails */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Valeur actuelle</p>
                        <p className="text-xl font-bold text-primary">
                          {objectif.valeurActuelle} {getTypeUnit(objectif.type)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Valeur cible</p>
                        <p className="text-xl font-bold text-foreground">
                          {objectif.valeurCible} {getTypeUnit(objectif.type)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Restant</p>
                        <p className="text-xl font-bold text-warning">
                          {Math.abs(objectif.valeurCible - objectif.valeurActuelle).toFixed(1)} {getTypeUnit(objectif.type)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Temps restant</p>
                        <p className={`text-xl font-bold ${daysRemaining > 0 ? 'text-success' : 'text-destructive'}`}>
                          {daysRemaining > 0 ? `${daysRemaining} jours` : 'Expiré'}
                        </p>
                      </div>
                    </div>

                    {/* Date limite */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Date limite: {new Date(objectif.dateFinSouhaitee).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* État vide */}
        {objectifs.length === 0 && !isCreating && (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl text-muted-foreground mb-2">
                Aucun objectif défini
              </CardTitle>
              <CardDescription className="mb-4">
                Commencez par créer votre premier objectif de santé
              </CardDescription>
              <Button 
                onClick={() => setIsCreating(true)}
                className="gradient-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer mon premier objectif
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Conseils */}
        <Card className="mt-8 bg-accent border-accent-bright">
          <CardHeader>
            <CardTitle>💡 Conseils pour réussir vos objectifs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-accent-foreground">
              <li>• <strong>Soyez spécifique :</strong> Des objectifs précis sont plus faciles à atteindre</li>
              <li>• <strong>Restez réaliste :</strong> Fixez-vous des objectifs ambitieux mais atteignables</li>
              <li>• <strong>Suivez régulièrement :</strong> Mettez à jour vos données pour voir vos progrès</li>
              <li>• <strong>Célébrez les victoires :</strong> Récompensez-vous quand vous atteignez vos objectifs</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
