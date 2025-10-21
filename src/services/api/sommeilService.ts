import { apiConfig, getAuthHeaders, validateResponse } from './config';
import { EntreeSommeil } from '@/types/health';

export interface SommeilResponse {
  success: boolean;
  message?: string;
  data?: EntreeSommeil | EntreeSommeil[];
}

export interface CreateSommeilData {
  date: string;
  heureCoucher: string;
  heureReveil: string;
  dureeSommeil: number;
  qualiteSommeil: number;
  notes?: string;
}

export interface UpdateSommeilData {
  date?: string;
  heureCoucher?: string;
  heureReveil?: string;
  dureeSommeil?: number;
  qualiteSommeil?: number;
  notes?: string;
}

export interface SommeilFilters {
  startDate?: string;
  endDate?: string;
}

/**
 * Service API pour la gestion du sommeil
 */
export const sommeilService = {
  /**
   * Créer une nouvelle entrée de sommeil
   */
  async createSommeil(sommeilData: CreateSommeilData, token: string): Promise<SommeilResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/sommeil`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(sommeilData),
      });

      return await validateResponse(response) as SommeilResponse;
    } catch (error) {
      console.error('Erreur sommeilService.createSommeil:', error);
      throw error;
    }
  },

  /**
   * Récupérer toutes les entrées de sommeil de l'utilisateur
   */
  async getSommeils(filters: SommeilFilters = {}, token: string): Promise<SommeilResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const url = `${apiConfig.baseURL}/sommeil${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as SommeilResponse;
    } catch (error) {
      console.error('Erreur sommeilService.getSommeils:', error);
      throw error;
    }
  },

  /**
   * Récupérer une entrée de sommeil spécifique par ID
   */
  async getSommeilById(id: string, token: string): Promise<SommeilResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/sommeil/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as SommeilResponse;
    } catch (error) {
      console.error('Erreur sommeilService.getSommeilById:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une entrée de sommeil
   */
  async updateSommeil(id: string, sommeilData: UpdateSommeilData, token: string): Promise<SommeilResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/sommeil/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(sommeilData),
      });

      return await validateResponse(response) as SommeilResponse;
    } catch (error) {
      console.error('Erreur sommeilService.updateSommeil:', error);
      throw error;
    }
  },

  /**
   * Supprimer une entrée de sommeil
   */
  async deleteSommeil(id: string, token: string): Promise<SommeilResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/sommeil/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as SommeilResponse;
    } catch (error) {
      console.error('Erreur sommeilService.deleteSommeil:', error);
      throw error;
    }
  },

  /**
   * Validation des données de sommeil
   */
  validateSommeilData(sommeilData: CreateSommeilData | UpdateSommeilData): string[] {
    const errors: string[] = [];

    if ('date' in sommeilData && sommeilData.date) {
      if (!this.isValidDate(sommeilData.date)) {
        errors.push('La date doit être au format YYYY-MM-DD');
      }
    }

    if ('heureCoucher' in sommeilData && sommeilData.heureCoucher) {
      if (!this.isValidTime(sommeilData.heureCoucher)) {
        errors.push('L\'heure de coucher doit être au format HH:mm');
      }
    }

    if ('heureReveil' in sommeilData && sommeilData.heureReveil) {
      if (!this.isValidTime(sommeilData.heureReveil)) {
        errors.push('L\'heure de réveil doit être au format HH:mm');
      }
    }

    if ('dureeSommeil' in sommeilData && sommeilData.dureeSommeil !== undefined) {
      if (sommeilData.dureeSommeil < 0 || sommeilData.dureeSommeil > 24) {
        errors.push('La durée de sommeil doit être entre 0 et 24 heures');
      }
    }

    if ('qualiteSommeil' in sommeilData && sommeilData.qualiteSommeil !== undefined) {
      if (sommeilData.qualiteSommeil < 1 || sommeilData.qualiteSommeil > 5) {
        errors.push('La qualité de sommeil doit être entre 1 et 5');
      }
    }

    if ('notes' in sommeilData && sommeilData.notes && sommeilData.notes.length > 500) {
      errors.push('Les notes ne peuvent pas dépasser 500 caractères');
    }

    return errors;
  },

  /**
   * Valider le format de date (YYYY-MM-DD)
   */
  isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  },

  /**
   * Valider le format d'heure (HH:mm)
   */
  isValidTime(timeString: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  },

  /**
   * Calculer la durée de sommeil à partir des heures de coucher et réveil
   */
  calculateSleepDuration(heureCoucher: string, heureReveil: string): number {
    const [coucherHours, coucherMinutes] = heureCoucher.split(':').map(Number);
    const [reveilHours, reveilMinutes] = heureReveil.split(':').map(Number);

    const coucherTime = coucherHours + coucherMinutes / 60;
    let reveilTime = reveilHours + reveilMinutes / 60;

    // Si l'heure de réveil est plus petite, c'est le lendemain
    if (reveilTime < coucherTime) {
      reveilTime += 24;
    }

    return Math.round((reveilTime - coucherTime) * 100) / 100;
  },

  /**
   * Formater les données pour l'affichage
   */
  formatSommeilForDisplay(sommeil: EntreeSommeil): {
    dateFormatted: string;
    durationFormatted: string;
    qualityLabel: string;
  } {
    const date = new Date(sommeil.date);
    const dateFormatted = date.toLocaleDateString('fr-FR');

    const hours = Math.floor(sommeil.dureeSommeil);
    const minutes = Math.round((sommeil.dureeSommeil - hours) * 60);
    const durationFormatted = `${hours}h${minutes.toString().padStart(2, '0')}`;

    const qualityLabels = ['', 'Très mauvaise', 'Mauvaise', 'Correcte', 'Bonne', 'Excellente'];
    const qualityLabel = qualityLabels[sommeil.qualiteSommeil] || 'Non définie';

    return {
      dateFormatted,
      durationFormatted,
      qualityLabel,
    };
  },
};
