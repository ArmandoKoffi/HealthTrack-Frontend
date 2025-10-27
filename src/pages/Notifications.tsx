import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, notificationsService } from '@/services/api';
import { Navbar } from '@/components/Layout/Navbar';
import { User, Notification } from '@/types/health';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Bell,
  CheckCircle,
  Trophy,
  Target,
  Lightbulb,
  Clock,
  Mail,
  Check,
  Activity,
  Utensils,
  Moon,
} from 'lucide-react';
import { realtimeService, RealtimeEvent } from '@/services/api/realtimeService';
import { Progress } from '@/components/ui/progress';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const token = authService.getToken();
        if (!token) {
          authService.logout();
          navigate('/login');
          return;
        }

        // Charger les notifications initiales
        (async () => {
          try {
            const res = await notificationsService.getNotifications({}, token);
            if (res && res.success && Array.isArray(res.data)) {
              setNotifications(res.data as Notification[]);
            } else {
              setNotifications([]);
            }
          } catch (error) {
            console.error('Erreur lors du chargement des notifications:', error);
            toast({
              title: 'Erreur',
              description: 'Impossible de charger les notifications',
              variant: 'destructive',
            });
          }
        })();

        // Connexion SSE et souscription aux notifications en temps réel
        try {
          realtimeService.connect(token);
        } catch (e) {
          console.warn('Connexion SSE non initialisée:', e);
        }

        const onRealtimeNotification = (event: RealtimeEvent) => {
          if (event.type !== 'notification') return;
          const data: any = event.data || {};

          // Afficher un toast selon la notification reçue
          const toastTitle = data.title || data.titre || 'Notification';
          const toastMessage = data.message || '';
          const toastVariant = data.type === 'error' ? 'destructive' : undefined;
          if (toastTitle || toastMessage) {
            toast({ title: toastTitle, description: toastMessage, variant: toastVariant });
          }

          // Si la notification ressemble à une notification persistée, l'ajouter à la liste
          const allowedTypes = ['rappel', 'felicitations', 'objectif', 'conseil', 'progres', 'rappel_activite', 'rappel_repas', 'rappel_sommeil'];
          if (data && typeof data === 'object' && (data.titre || data.title) && data.message && allowedTypes.includes(data.type)) {
            const newNotif: Notification = {
              id: String(data.id || Date.now()),
              userId: String(parsedUser?.id || parsedUser?._id || ''),
              titre: data.titre || data.title,
              message: data.message,
              type: data.type,
              date: data.date || new Date().toISOString(),
              lu: false,
              priority: data.priority,
              isAutomatic: data.isAutomatic,
              relatedObjectId: data.relatedObjectId,
              relatedObjectType: data.relatedObjectType,
              progressData: data.progressData,
              reminderConfig: data.reminderConfig,
            };
            setNotifications((prev) => [newNotif, ...prev]);
          }
        };

        realtimeService.addEventListener('notification', onRealtimeNotification);

        return () => {
          realtimeService.removeEventListener('notification', onRealtimeNotification);
          realtimeService.disconnect();
        };
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

  const marquerCommeLue = async (notificationId: string) => {
    try {
      const token = authService.getToken();
      if (!token) {
        authService.logout();
        navigate('/login');
        return;
      }
      const res = await notificationsService.markAsRead(notificationId, token);
      if (res && res.success && res.data && typeof res.data === 'object') {
        const updated = res.data as Notification;
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, lu: true, date: updated.date } : n
        ));
      } else {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, lu: true } : n
        ));
      }
      toast({
        title: "Notification marquée comme lue",
        description: "La notification a été mise à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification",
        variant: "destructive",
      });
    }
  };

  const marquerToutCommeLu = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        authService.logout();
        navigate('/login');
        return;
      }
      await notificationsService.markAllAsRead(token);
      
      setNotifications(notifications.map(n => ({ ...n, lu: true })));
      toast({
        title: "Toutes les notifications marquées",
        description: "Toutes vos notifications sont maintenant lues",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'rappel':
        return <Clock className="h-5 w-5 text-info" />;
      case 'felicitations':
        return <Trophy className="h-5 w-5 text-warning" />;
      case 'objectif':
        return <Target className="h-5 w-5 text-success" />;
      case 'conseil':
        return <Lightbulb className="h-5 w-5 text-secondary-accent" />;
      case 'progres':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rappel_activite':
        return <Activity className="h-5 w-5 text-info" />;
      case 'rappel_repas':
        return <Utensils className="h-5 w-5 text-warning" />;
      case 'rappel_sommeil':
        return <Moon className="h-5 w-5 text-secondary-accent" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type: Notification['type']) => {
    const styles: Record<Notification['type'], string> = {
      rappel: 'bg-info text-info-foreground',
      felicitations: 'bg-warning text-warning-foreground',
      objectif: 'bg-success text-success-foreground',
      conseil: 'bg-secondary-accent text-white',
      progres: 'bg-success text-success-foreground',
      rappel_activite: 'bg-info text-info-foreground',
      rappel_repas: 'bg-warning text-warning-foreground',
      rappel_sommeil: 'bg-secondary-accent text-white',
    } as any;
    
    const labels: Record<Notification['type'], string> = {
      rappel: 'Rappel',
      felicitations: 'Félicitations',
      objectif: 'Objectif',
      conseil: 'Conseil',
      progres: 'Progrès',
      rappel_activite: 'Rappel activité',
      rappel_repas: 'Rappel repas',
      rappel_sommeil: 'Rappel sommeil',
    } as any;

    return (
      <Badge className={styles[type]}>
        {labels[type]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const renderNotificationContent = (n: Notification) => {
    const isProgress = n.type === 'progres' && n.progressData && typeof n.progressData.progressPercentage === 'number';
    if (!isProgress) {
      return <p className="text-muted-foreground">{n.message}</p>;
    }
    const pct = Math.max(0, Math.min(100, Math.round(n.progressData!.progressPercentage || 0)));
    return (
      <div className="space-y-2">
        <p className="text-muted-foreground">{n.message}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progression</span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {typeof n.progressData!.currentValue === 'number' && (
            <Badge variant="outline">Actuel: {n.progressData!.currentValue}</Badge>
          )}
          {typeof n.progressData!.targetValue === 'number' && (
            <Badge variant="outline">Cible: {n.progressData!.targetValue}</Badge>
          )}
        </div>
      </div>
    );
  };

  const notificationsNonLues = notifications.filter(n => !n.lu);
  const notificationsLues = notifications.filter(n => n.lu);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Notifications
              </h1>
              <p className="text-muted-foreground">
                Restez informé de vos progrès et rappels
              </p>
            </div>
            
            {notificationsNonLues.length > 0 && (
              <Button 
                onClick={marquerToutCommeLu}
                variant="outline"
                className="flex items-center space-x-2 text-xs sm:text-sm px-2 sm:px-4"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Tout marquer comme lu</span>
                <span className="sm:hidden">Marquer tout</span>
              </Button>
            )}
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
                  <p className="text-sm text-muted-foreground">Total notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{notificationsNonLues.length}</p>
                  <p className="text-sm text-muted-foreground">Non lues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-success" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {notifications.filter(n => n.type === 'felicitations').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Félicitations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications non lues */}
        {notificationsNonLues.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              Nouvelles notifications ({notificationsNonLues.length})
            </h2>
            
            <div className="space-y-4">
              {notificationsNonLues.map((notification) => (
                <Card 
                  key={notification.id} 
                  className="shadow-medium border-l-4 border-l-primary pulse-notification"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(notification.type)}
                        <div>
                          <CardTitle className="text-lg">{notification.titre}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {getTypeBadge(notification.type)}
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => marquerCommeLue(notification.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderNotificationContent(notification)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Notifications lues */}
        {notificationsLues.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-success" />
              Notifications lues ({notificationsLues.length})
            </h2>
            
            <div className="space-y-4">
              {notificationsLues.map((notification) => (
                <Card 
                  key={notification.id} 
                  className="opacity-75 hover:opacity-100 transition-smooth"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(notification.type)}
                        <div>
                          <CardTitle className="text-lg">{notification.titre}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {getTypeBadge(notification.type)}
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.date)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Lu
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderNotificationContent(notification)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* État vide */}
        {notifications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl text-muted-foreground mb-2">
                Aucune notification
              </CardTitle>
              <CardDescription>
                Vous recevrez des notifications pour vos rappels et félicitations ici
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {/* Conseils pour les notifications */}
        <Card className="mt-8 bg-accent border-accent-bright">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-accent-bright" />
              <span>À propos des notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-accent-foreground">
              <li>• <strong>Rappels :</strong> Vous aident à maintenir vos habitudes quotidiennes</li>
              <li>• <strong>Félicitations :</strong> Célèbrent vos réussites et objectifs atteints</li>
              <li>• <strong>Conseils :</strong> Suggestions personnalisées pour améliorer votre santé</li>
              <li>• <strong>Objectifs :</strong> Mises à jour sur votre progression vers vos objectifs</li>
              <li>• <strong>Progrès :</strong> Affichent votre avancement avec des barres de progression</li>
              <li>• <strong>Rappel activité :</strong> Vous encouragent à rester actif</li>
              <li>• <strong>Rappel repas :</strong> Vous rappellent de bien vous alimenter</li>
              <li>• <strong>Rappel sommeil :</strong> Vous aident à maintenir un bon rythme de sommeil</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
