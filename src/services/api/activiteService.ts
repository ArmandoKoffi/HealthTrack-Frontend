import { apiConfig, getAuthHeaders, validateResponse } from './config';
import { EntreeActivite } from '@/types/health';

export interface ActiviteResponse {
  success: boolean;
  message?: string;
  data?: EntreeActivite | EntreeActivite[];
}

export interface CreateActiviteData {
  date: string;
  typeActivite: string;
  duree: number;
  intensite: 'faible' | 'modere' | 'intense';
  caloriesBrulees: number;
  notes?: string;
}

export interface UpdateActiviteData {
  date?: string;
  typeActivite?: string;
  duree?: number;
  intensite?: 'faible' | 'modere' | 'intense';
  caloriesBrulees?: number;
  notes?: string;
}

export interface ActiviteFilters {
  startDate?: string;
  endDate?: string;
  typeActivite?: string;
  intensite?: string;
}

/**
 * Service API pour la gestion des activités physiques
 */
export const activiteService = {
  /**
   * Créer une nouvelle entrée d'activité
   */
  async createActivite(activiteData: CreateActiviteData, token: string): Promise<ActiviteResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/activites`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(activiteData),
      });

      return await validateResponse(response) as ActiviteResponse;
    } catch (error) {
      console.error('Erreur activiteService.createActivite:', error);
      throw error;
    }
  },

  /**
   * Récupérer toutes les entrées d'activité de l'utilisateur
   */
  async getActivites(filters: ActiviteFilters = {}, token: string): Promise<ActiviteResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.typeActivite) queryParams.append('typeActivite', filters.typeActivite);
      if (filters.intensite) queryParams.append('intensite', filters.intensite);

      const url = `${apiConfig.baseURL}/activites${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as ActiviteResponse;
    } catch (error) {
      console.error('Erreur activiteService.getActivites:', error);
      throw error;
    }
  },

  /**
   * Récupérer une entrée d'activité spécifique par ID
   */
  async getActiviteById(id: string, token: string): Promise<ActiviteResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/activites/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as ActiviteResponse;
    } catch (error) {
      console.error('Erreur activiteService.getActiviteById:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une entrée d'activité
   */
  async updateActivite(id: string, activiteData: UpdateActiviteData, token: string): Promise<ActiviteResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/activites/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(activiteData),
      });

      return await validateResponse(response) as ActiviteResponse;
    } catch (error) {
      console.error('Erreur activiteService.updateActivite:', error);
      throw error;
    }
  },

  /**
   * Supprimer une entrée d'activité
   */
  async deleteActivite(id: string, token: string): Promise<ActiviteResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/activites/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as ActiviteResponse;
    } catch (error) {
      console.error('Erreur activiteService.deleteActivite:', error);
      throw error;
    }
  },

  /**
   * Validation des données d'activité
   */
  validateActiviteData(activiteData: CreateActiviteData | UpdateActiviteData): string[] {
    const errors: string[] = [];

    if ('date' in activiteData && activiteData.date) {
      if (!this.isValidDate(activiteData.date)) {
        errors.push('La date doit être au format YYYY-MM-DD');
      }
    }

    if ('typeActivite' in activiteData && activiteData.typeActivite) {
      if (typeof activiteData.typeActivite !== 'string' || activiteData.typeActivite.trim() === '') {
        errors.push('Le type d\'activité est requis');
      }
      if (activiteData.typeActivite.length > 100) {
        errors.push('Le type d\'activité ne peut pas dépasser 100 caractères');
      }
    }

    if ('duree' in activiteData && activiteData.duree !== undefined) {
      if (activiteData.duree <= 0 || activiteData.duree > 1440) {
        errors.push('La durée doit être entre 1 et 1440 minutes (24h)');
      }
    }

    if ('intensite' in activiteData && activiteData.intensite) {
      const validIntensites = ['faible', 'modere', 'intense'];
      if (!validIntensites.includes(activiteData.intensite)) {
        errors.push('L\'intensité doit être: faible, modere ou intense');
      }
    }

    if ('caloriesBrulees' in activiteData && activiteData.caloriesBrulees !== undefined) {
      if (activiteData.caloriesBrulees < 0 || activiteData.caloriesBrulees > 5000) {
        errors.push('Les calories brûlées doivent être entre 0 et 5000');
      }
    }

    if ('notes' in activiteData && activiteData.notes && activiteData.notes.length > 500) {
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
   * Calculer les calories brûlées estimées selon l'activité et la durée
   */
  estimateCaloriesBurned(typeActivite: string, duree: number, intensite: 'faible' | 'modere' | 'intense', poids: number = 70): number {
    // MET (Metabolic Equivalent of Task) values pour différentes activités
    const metValues: Record<string, Record<string, number>> = {
      'course': { faible: 6, modere: 8, intense: 12 },
      'marche': { faible: 3, modere: 4, intense: 5 },
      'velo': { faible: 4, modere: 8, intense: 12 },
      'natation': { faible: 6, modere: 8, intense: 11 },
      'musculation': { faible: 3, modere: 5, intense: 6 },
      'yoga': { faible: 2, modere: 3, intense: 4 },
      'default': { faible: 3, modere: 5, intense: 7 },
    };

    const activityKey = Object.keys(metValues).find(key => 
      typeActivite.toLowerCase().includes(key)
    ) || 'default';

    const met = metValues[activityKey][intensite];
    
    // Formule: Calories = MET × poids (kg) × durée (heures)
    const calories = met * poids * (duree / 60);
    
    return Math.round(calories);
  },

  /**
   * Formater les données pour l'affichage
   */
  formatActiviteForDisplay(activite: EntreeActivite): {
    dateFormatted: string;
    dureeFormatted: string;
    intensiteFormatted: string;
    caloriesFormatted: string;
  } {
    const date = new Date(activite.date);
    const dateFormatted = date.toLocaleDateString('fr-FR');

    const hours = Math.floor(activite.duree / 60);
    const minutes = activite.duree % 60;
    const dureeFormatted = hours > 0 
      ? `${hours}h${minutes.toString().padStart(2, '0')}`
      : `${minutes}min`;

    const intensiteLabels = {
      'faible': 'Faible',
      'modere': 'Modérée',
      'intense': 'Intense',
    };
    const intensiteFormatted = intensiteLabels[activite.intensite] || activite.intensite;

    const caloriesFormatted = `${activite.caloriesBrulees} kcal`;

    return {
      dateFormatted,
      dureeFormatted,
      intensiteFormatted,
      caloriesFormatted,
    };
  },

  /**
   * Calculer les statistiques d'activité
   */
  calculateActivityStats(activites: EntreeActivite[]): {
    totalDuree: number;
    totalCalories: number;
    averageDuree: number;
    averageCalories: number;
    mostCommonActivity: string;
    mostCommonIntensity: string;
    totalActivities: number;
  } {
    if (activites.length === 0) {
      return {
        totalDuree: 0,
        totalCalories: 0,
        averageDuree: 0,
        averageCalories: 0,
        mostCommonActivity: '',
        mostCommonIntensity: '',
        totalActivities: 0,
      };
    }

    const totalDuree = activites.reduce((sum, activite) => sum + activite.duree, 0);
    const totalCalories = activites.reduce((sum, activite) => sum + activite.caloriesBrulees, 0);

    const activityCounts = activites.reduce((counts, activite) => {
      counts[activite.typeActivite] = (counts[activite.typeActivite] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const intensityCounts = activites.reduce((counts, activite) => {
      counts[activite.intensite] = (counts[activite.intensite] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostCommonActivity = Object.entries(activityCounts).reduce((a, b) => 
      activityCounts[a[0]] > activityCounts[b[0]] ? a : b
    )[0];

    const mostCommonIntensity = Object.entries(intensityCounts).reduce((a, b) => 
      intensityCounts[a[0]] > intensityCounts[b[0]] ? a : b
    )[0];

    return {
      totalDuree,
      totalCalories,
      averageDuree: Math.round(totalDuree / activites.length),
      averageCalories: Math.round(totalCalories / activites.length),
      mostCommonActivity,
      mostCommonIntensity,
      totalActivities: activites.length,
    };
  },

  /**
   * Obtenir les activités recommandées selon l'objectif
   */
  getRecommendedActivities(objectif: 'perte-poids' | 'gain-muscle' | 'endurance' | 'general'): {
    typeActivite: string;
    intensite: 'faible' | 'modere' | 'intense';
    dureeRecommandee: number;
    description: string;
  }[] {
    const recommendations = {
      'perte-poids': [
        { typeActivite: 'Course', intensite: 'modere' as const, dureeRecommandee: 30, description: 'Excellent pour brûler des calories' },
        { typeActivite: 'Vélo', intensite: 'modere' as const, dureeRecommandee: 45, description: 'Cardio efficace et doux pour les articulations' },
        { typeActivite: 'Natation', intensite: 'modere' as const, dureeRecommandee: 30, description: 'Sport complet pour tout le corps' },
      ],
      'gain-muscle': [
        { typeActivite: 'Musculation', intensite: 'intense' as const, dureeRecommandee: 60, description: 'Développement de la masse musculaire' },
        { typeActivite: 'Crossfit', intensite: 'intense' as const, dureeRecommandee: 45, description: 'Entraînement fonctionnel intense' },
        { typeActivite: 'Calisthenics', intensite: 'modere' as const, dureeRecommandee: 30, description: 'Renforcement au poids du corps' },
      ],
      'endurance': [
        { typeActivite: 'Course longue', intensite: 'faible' as const, dureeRecommandee: 60, description: 'Amélioration de l\'endurance cardiovasculaire' },
        { typeActivite: 'Vélo route', intensite: 'modere' as const, dureeRecommandee: 90, description: 'Endurance et plaisir de rouler' },
        { typeActivite: 'Randonnée', intensite: 'faible' as const, dureeRecommandee: 120, description: 'Endurance en pleine nature' },
      ],
      'general': [
        { typeActivite: 'Marche rapide', intensite: 'modere' as const, dureeRecommandee: 30, description: 'Activité accessible à tous' },
        { typeActivite: 'Yoga', intensite: 'faible' as const, dureeRecommandee: 45, description: 'Flexibilité et bien-être mental' },
        { typeActivite: 'Natation', intensite: 'modere' as const, dureeRecommandee: 30, description: 'Sport complet et doux' },
      ],
    };

    return recommendations[objectif] || recommendations['general'];
  },
};
