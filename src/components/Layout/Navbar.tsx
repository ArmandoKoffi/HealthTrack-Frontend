import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MockAuthService } from '@/services/mockAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  BarChart3, 
  Home, 
  Plus, 
  User, 
  LogOut, 
  Bell,
  Heart,
  History,
  Target,
  Settings,
  FileText
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const authService = MockAuthService.getInstance();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur HealthTrack !",
    });
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Accueil' },
    { path: '/ajouter', icon: Plus, label: 'Ajouter' },
    { path: '/statistiques', icon: BarChart3, label: 'Stats' },
    { path: '/historique', icon: History, label: 'Historique' },
    { path: '/objectifs', icon: Target, label: 'Objectifs' },
    { path: '/rapports', icon: FileText, label: 'Rapports' }
  ];

  const getUserInitials = () => {
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
  };

  if (!user) return null;

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-soft">
              <span className="text-lg">🩺</span>
            </div>
            <Link to="/dashboard" className="text-xl font-bold text-primary">
              HealthTrack
            </Link>
          </div>

          {/* Navigation principale */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-soft' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/notifications')}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/parametres')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profil')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation mobile */}
      <div className="md:hidden border-t border-border">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center p-2 rounded-lg transition-smooth
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};