import { apiConfig, getAuthHeaders, validateResponse } from './config';
import { User } from './authService';

export interface ProfileStats {
  age: number | null;
  imc: number | null;
  imcCategorie: {
    label: string;
    color: string;
  } | null;
  poidsActuel: number | null;
  objectifPoids: number | null;
  poidsRestant: number | null;
  taille: number | null;
}

export interface ProfileUpdateData {
  nom?: string;
  prenom?: string;
  email?: string;
  dateNaissance?: string;
  poids?: number;
  taille?: number;
  objectifPoids?: number;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  user?: User;
  stats?: ProfileStats;
}

/**
 * Service de profil pour communiquer avec le backend
 */
export const profileService = {
  /**
   * Récupérer les informations du profil utilisateur
   */
  async getProfile(token: string): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/profile`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as ProfileResponse;
    } catch (error) {
      console.error('Erreur profileService.getProfile:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour les informations du profil
   */
  async updateProfile(profileData: ProfileUpdateData, token: string): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(profileData),
      });

      return await validateResponse(response) as ProfileResponse;
    } catch (error) {
      console.error('Erreur profileService.updateProfile:', error);
      throw error;
    }
  },

  /**
   * Changer le mot de passe de l'utilisateur
   */
  async changePassword(passwordData: PasswordChangeData, token: string): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/profile/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(passwordData),
      });

      return await validateResponse(response) as ProfileResponse;
    } catch (error) {
      console.error('Erreur profileService.changePassword:', error);
      throw error;
    }
  },

  /**
   * Récupérer les statistiques du profil (IMC, âge, etc.)
   */
  async getProfileStats(token: string): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/profile/stats`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as ProfileResponse;
    } catch (error) {
      console.error('Erreur profileService.getProfileStats:', error);
      throw error;
    }
  },

  /**
   * Sauvegarder les données utilisateur dans le localStorage
   */
  saveUserData(user: User): void {
    localStorage.setItem('userData', JSON.stringify(user));
  },

  /**
   * Récupérer les données utilisateur depuis le localStorage
   */
  getUserData(): User | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Effacer les données utilisateur du localStorage
   */
  clearUserData(): void {
    localStorage.removeItem('userData');
  },

  /**
   * Valider les données de mise à jour du profil côté client
   */
  validateProfileUpdate(profileData: ProfileUpdateData): string[] {
    const errors: string[] = [];

    // Validation de l'email si fourni
    if (profileData.email && !this.isValidEmail(profileData.email)) {
      errors.push('Format d\'email invalide');
    }

    // Validation de la date de naissance si fournie
    if (profileData.dateNaissance && !this.isValidDate(profileData.dateNaissance)) {
      errors.push('Format de date invalide (YYYY-MM-DD)');
    }

    // Validation du poids si fourni
    if (profileData.poids !== undefined && (profileData.poids < 20 || profileData.poids > 300)) {
      errors.push('Le poids doit être compris entre 20 et 300 kg');
    }

    // Validation de la taille si fournie
    if (profileData.taille !== undefined && (profileData.taille < 100 || profileData.taille > 250)) {
      errors.push('La taille doit être comprise entre 100 et 250 cm');
    }

    // Validation de l'objectif de poids si fourni
    if (profileData.objectifPoids !== undefined && (profileData.objectifPoids < 20 || profileData.objectifPoids > 300)) {
      errors.push('L\'objectif de poids doit être compris entre 20 et 300 kg');
    }

    return errors;
  },

  /**
   * Valider les données de changement de mot de passe côté client
   */
  validatePasswordChange(passwordData: PasswordChangeData): string[] {
    const errors: string[] = [];

    if (!passwordData.currentPassword) {
      errors.push('Le mot de passe actuel est obligatoire');
    }

    if (!passwordData.newPassword) {
      errors.push('Le nouveau mot de passe est obligatoire');
    }

    if (!passwordData.confirmPassword) {
      errors.push('La confirmation du mot de passe est obligatoire');
    }

    if (passwordData.newPassword && passwordData.newPassword.length < 8) {
      errors.push('Le nouveau mot de passe doit contenir au moins 8 caractères');
    }

    if (passwordData.newPassword && !this.isStrongPassword(passwordData.newPassword)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre');
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.push('Les mots de passe ne correspondent pas');
    }

    return errors;
  },

  /**
   * Vérifier si un email est valide
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Vérifier si une date est valide (format YYYY-MM-DD)
   */
  isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return !isNaN(date.getTime());
  },

  /**
   * Vérifier si un mot de passe est fort
   */
  isStrongPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }
};
