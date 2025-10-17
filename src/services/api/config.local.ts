/**
 * Configuration de l'API pour le développement local
 * Ce fichier est utilisé uniquement en développement
 */

// URL de base de l'API - Développement local
export const apiConfig = {
  // URL de développement local
  baseURL: 'http://localhost:3000/api',
  
  // Timeout par défaut pour les requêtes (en millisecondes)
  timeout: 30000,
  
  // Headers par défaut
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

/**
 * Gestionnaire d'erreurs global pour les requêtes API
 */
export const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    throw error;
  }
  
  if (typeof error === 'string') {
    throw new Error(error);
  }
  
  throw new Error('Une erreur inattendue est survenue');
};

/**
 * Fonction utilitaire pour construire les headers avec authentification
 */
export const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Fonction utilitaire pour valider les réponses API
 */
export const validateResponse = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Erreur de communication avec le serveur',
    }));
    
    throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};
