import { apiConfig } from './config';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  poids?: number;
  taille?: number;
  objectifPoids?: number;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  poids?: number;
  taille?: number;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Service d'authentification pour communiquer avec le backend
 */
export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      return data;
    } catch (error) {
      console.error('Erreur authService.register:', error);
      throw error;
    }
  },

  /**
   * Connexion d'un utilisateur
   */
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      return data;
    } catch (error) {
      console.error('Erreur authService.login:', error);
      throw error;
    }
  },

  /**
   * Demande de réinitialisation de mot de passe
   */
  async forgotPassword(emailData: ForgotPasswordData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la demande de réinitialisation');
      }

      return data;
    } catch (error) {
      console.error('Erreur authService.forgotPassword:', error);
      throw error;
    }
  },

  /**
   * Réinitialisation du mot de passe avec token
   */
  async resetPassword(resetData: ResetPasswordData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la réinitialisation du mot de passe');
      }

      return data;
    } catch (error) {
      console.error('Erreur authService.resetPassword:', error);
      throw error;
    }
  },

  /**
   * Vérification de la validité d'un token de réinitialisation
   */
  async verifyResetToken(token: string): Promise<{ success: boolean; message: string; user?: { email: string } }> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/reset-password/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lien de réinitialisation invalide ou expiré');
      }

      return data;
    } catch (error) {
      console.error('Erreur authService.verifyResetToken:', error);
      throw error;
    }
  },

  /**
   * Vérification de la validité d'un token JWT
   */
  async verifyToken(token: string): Promise<{ success: boolean; user?: User }> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token invalide');
      }

      return data;
    } catch (error) {
      console.error('Erreur authService.verifyToken:', error);
      throw error;
    }
  },

  /**
   * Déconnexion (suppression du token côté client)
   */
  logout(): void {
    // Suppression du token du localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  /**
   * Sauvegarde du token dans le localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  /**
   * Récupération du token depuis le localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  /**
   * Vérification si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
};
