// Service d'authentification simulé pour HealthTrack

import { User, AuthState } from '@/types/health';

// Utilisateurs mockés
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'marie.dupont@email.com',
    nom: 'Dupont',
    prenom: 'Marie',
    dateNaissance: '1990-05-15',
    poids: 65,
    taille: 165,
    objectifPoids: 60,
  },
  {
    id: '2',
    email: 'jean.martin@email.com',
    nom: 'Martin',
    prenom: 'Jean',
    dateNaissance: '1985-08-22',
    poids: 80,
    taille: 180,
    objectifPoids: 75,
  }
];

export class MockAuthService {
  private static instance: MockAuthService;
  private authState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false
  };

  static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }

  constructor() {
    // Vérifier si l'utilisateur est déjà connecté
    this.loadAuthFromStorage();
  }

  private loadAuthFromStorage() {
    const token = localStorage.getItem('healthtrack_token');
    const userData = localStorage.getItem('healthtrack_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.authState = {
          user,
          token,
          isAuthenticated: true
        };
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        this.logout();
      }
    }
  }

  private saveAuthToStorage(user: User, token: string) {
    localStorage.setItem('healthtrack_token', token);
    localStorage.setItem('healthtrack_user', JSON.stringify(user));
  }

  private generateToken(): string {
    return 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9);
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    // En mode mock, on accepte n'importe quel mot de passe pour la démo
    if (password.length < 6) {
      return { success: false, error: 'Mot de passe incorrect' };
    }

    const token = this.generateToken();
    this.authState = {
      user,
      token,
      isAuthenticated: true
    };

    this.saveAuthToStorage(user, token);
    return { success: true };
  }

  async register(userData: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    dateNaissance: string;
    poids?: number;
    taille?: number;
  }): Promise<{ success: boolean; error?: string }> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Vérifier si l'email existe déjà
    if (MOCK_USERS.find(u => u.email === userData.email)) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }

    const newUser: User = {
      id: (MOCK_USERS.length + 1).toString(),
      email: userData.email,
      nom: userData.nom,
      prenom: userData.prenom,
      dateNaissance: userData.dateNaissance,
      poids: userData.poids,
      taille: userData.taille,
    };

    // Ajouter le nouvel utilisateur aux utilisateurs mockés
    MOCK_USERS.push(newUser);

    const token = this.generateToken();
    this.authState = {
      user: newUser,
      token,
      isAuthenticated: true
    };

    this.saveAuthToStorage(newUser, token);
    return { success: true };
  }

  logout(): void {
    this.authState = {
      user: null,
      token: null,
      isAuthenticated: false
    };
    localStorage.removeItem('healthtrack_token');
    localStorage.removeItem('healthtrack_user');
  }

  getCurrentUser(): User | null {
    return this.authState.user;
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getToken(): string | null {
    return this.authState.token;
  }

  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!this.authState.user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    const updatedUser = { ...this.authState.user, ...updates };
    this.authState.user = updatedUser;
    
    // Mettre à jour dans le localStorage
    this.saveAuthToStorage(updatedUser, this.authState.token!);
    
    return { success: true };
  }
}