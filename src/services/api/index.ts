/**
 * Export centralisé de tous les services API
 */

// Import des services
import { authService } from './authService';
import { profileService } from './profileService';
import { sommeilService } from './sommeilService';
import { repasService } from './repasService';
import { activiteService } from './activiteService';
import { objectifService } from './objectifService';
import { notificationsService } from './notificationsService';
import { apiConfig, getAuthHeaders, validateResponse, handleApiError } from './config';
import { exportService } from './exportService';

// Ré-export des types et services
export { apiConfig, getAuthHeaders, validateResponse, handleApiError } from './config';
export { 
  authService, 
  type User, 
  type AuthResponse, 
  type LoginData, 
  type RegisterData, 
  type ForgotPasswordData, 
  type ResetPasswordData 
} from './authService';
export { 
  profileService, 
  type ProfileStats, 
  type ProfileUpdateData, 
  type PasswordChangeData, 
  type ProfileResponse 
} from './profileService';
export { sommeilService } from './sommeilService';
export { repasService } from './repasService';
export { activiteService } from './activiteService';
export { objectifService } from './objectifService';
export { notificationsService } from './notificationsService';
export { settingsService, type UserSettings, type SettingsResponse } from './settingsService';

/**
 * Fonction utilitaire pour initialiser l'authentification
 * Vérifie si un token existe et est valide
 */
export const initializeAuth = async (): Promise<{ isAuthenticated: boolean; user: unknown | null }> => {
  const token = authService.getToken();
  
  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const result = await authService.verifyToken(token);
    if (result.success && result.user) {
      profileService.saveUserData(result.user);
      return { isAuthenticated: true, user: result.user };
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    authService.logout();
    profileService.clearUserData();
  }

  return { isAuthenticated: false, user: null };
};

/**
 * Fonction utilitaire pour gérer les erreurs d'authentification
 */
export const handleAuthError = (error: unknown): void => {
  if (error instanceof Error && (error.message.includes('Token') || error.message.includes('authentification'))) {
    authService.logout();
    profileService.clearUserData();
    // Rediriger vers la page de connexion si nécessaire
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

/**
 * Fonction utilitaire pour construire les requêtes API avec authentification
 */
export const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<unknown> => {
  const token = authService.getToken();
  const headers = getAuthHeaders(token);

  const response = await fetch(`${apiConfig.baseURL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  return validateResponse(response);
};
