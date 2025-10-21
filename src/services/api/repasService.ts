import { apiConfig, getAuthHeaders, validateResponse } from './config';
import { EntreeRepas } from '@/types/health';

export interface RepasResponse {
  success: boolean;
  message?: string;
  data?: EntreeRepas | EntreeRepas[];
}

export interface CreateRepasData {
  date: string;
  typeRepas: 'petit-dejeuner' | 'dejeuner' | 'diner' | 'collation';
  aliments: string[];
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  notes?: string;
}

export interface UpdateRepasData {
  date?: string;
  typeRepas?: 'petit-dejeuner' | 'dejeuner' | 'diner' | 'collation';
  aliments?: string[];
  calories?: number;
  proteines?: number;
  glucides?: number;
  lipides?: number;
  notes?: string;
}

export interface RepasFilters {
  startDate?: string;
  endDate?: string;
  typeRepas?: string;
}

/**
 * Service API pour la gestion des repas
 */
export const repasService = {
  /**
   * Créer une nouvelle entrée de repas
   */
  async createRepas(repasData: CreateRepasData, token: string): Promise<RepasResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/repas`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(repasData),
      });

      return await validateResponse(response) as RepasResponse;
    } catch (error) {
      console.error('Erreur repasService.createRepas:', error);
      throw error;
    }
  },

  /**
   * Récupérer toutes les entrées de repas de l'utilisateur
   */
  async getRepas(filters: RepasFilters = {}, token: string): Promise<RepasResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.typeRepas) queryParams.append('typeRepas', filters.typeRepas);

      const url = `${apiConfig.baseURL}/repas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as RepasResponse;
    } catch (error) {
      console.error('Erreur repasService.getRepas:', error);
      throw error;
    }
  },

  /**
   * Récupérer une entrée de repas spécifique par ID
   */
  async getRepasById(id: string, token: string): Promise<RepasResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/repas/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as RepasResponse;
    } catch (error) {
      console.error('Erreur repasService.getRepasById:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une entrée de repas
   */
  async updateRepas(id: string, repasData: UpdateRepasData, token: string): Promise<RepasResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/repas/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(repasData),
      });

      return await validateResponse(response) as RepasResponse;
    } catch (error) {
      console.error('Erreur repasService.updateRepas:', error);
      throw error;
    }
  },

  /**
   * Supprimer une entrée de repas
   */
  async deleteRepas(id: string, token: string): Promise<RepasResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/repas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as RepasResponse;
    } catch (error) {
      console.error('Erreur repasService.deleteRepas:', error);
      throw error;
    }
  },

  /**
   * Validation des données de repas
   */
  validateRepasData(repasData: CreateRepasData | UpdateRepasData): string[] {
    const errors: string[] = [];

    if ('date' in repasData && repasData.date) {
      if (!this.isValidDate(repasData.date)) {
        errors.push('La date doit être au format YYYY-MM-DD');
      }
    }

    if ('typeRepas' in repasData && repasData.typeRepas) {
      const validTypes = ['petit-dejeuner', 'dejeuner', 'diner', 'collation'];
      if (!validTypes.includes(repasData.typeRepas)) {
        errors.push('Le type de repas doit être: petit-dejeuner, dejeuner, diner ou collation');
      }
    }

    if ('aliments' in repasData && repasData.aliments) {
      if (!Array.isArray(repasData.aliments) || repasData.aliments.length === 0) {
        errors.push('Au moins un aliment doit être spécifié');
      }
      if (repasData.aliments.some(aliment => typeof aliment !== 'string' || aliment.trim() === '')) {
        errors.push('Tous les aliments doivent être des chaînes non vides');
      }
    }

    if ('calories' in repasData && repasData.calories !== undefined) {
      if (repasData.calories < 0 || repasData.calories > 10000) {
        errors.push('Les calories doivent être entre 0 et 10000');
      }
    }

    if ('proteines' in repasData && repasData.proteines !== undefined) {
      if (repasData.proteines < 0 || repasData.proteines > 1000) {
        errors.push('Les protéines doivent être entre 0 et 1000g');
      }
    }

    if ('glucides' in repasData && repasData.glucides !== undefined) {
      if (repasData.glucides < 0 || repasData.glucides > 1000) {
        errors.push('Les glucides doivent être entre 0 et 1000g');
      }
    }

    if ('lipides' in repasData && repasData.lipides !== undefined) {
      if (repasData.lipides < 0 || repasData.lipides > 1000) {
        errors.push('Les lipides doivent être entre 0 et 1000g');
      }
    }

    if ('notes' in repasData && repasData.notes && repasData.notes.length > 500) {
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
   * Calculer les macronutriments totaux pour une journée
   */
  calculateDailyMacros(repas: EntreeRepas[]): {
    totalCalories: number;
    totalProteines: number;
    totalGlucides: number;
    totalLipides: number;
  } {
    return repas.reduce(
      (totals, repas) => ({
        totalCalories: totals.totalCalories + repas.calories,
        totalProteines: totals.totalProteines + repas.proteines,
        totalGlucides: totals.totalGlucides + repas.glucides,
        totalLipides: totals.totalLipides + repas.lipides,
      }),
      { totalCalories: 0, totalProteines: 0, totalGlucides: 0, totalLipides: 0 }
    );
  },

  /**
   * Formater les données pour l'affichage
   */
  formatRepasForDisplay(repas: EntreeRepas): {
    dateFormatted: string;
    typeRepasFormatted: string;
    alimentsFormatted: string;
    macrosFormatted: string;
  } {
    const date = new Date(repas.date);
    const dateFormatted = date.toLocaleDateString('fr-FR');

    const typeRepasLabels = {
      'petit-dejeuner': 'Petit-déjeuner',
      'dejeuner': 'Déjeuner',
      'diner': 'Dîner',
      'collation': 'Collation',
    };
    const typeRepasFormatted = typeRepasLabels[repas.typeRepas] || repas.typeRepas;

    const alimentsFormatted = repas.aliments.join(', ');

    const macrosFormatted = `${repas.calories} kcal | P: ${repas.proteines}g | G: ${repas.glucides}g | L: ${repas.lipides}g`;

    return {
      dateFormatted,
      typeRepasFormatted,
      alimentsFormatted,
      macrosFormatted,
    };
  },

  /**
   * Obtenir les statistiques nutritionnelles
   */
  getNutritionalStats(repas: EntreeRepas[]): {
    averageCalories: number;
    averageProteines: number;
    averageGlucides: number;
    averageLipides: number;
    mostCommonMealType: string;
    totalMeals: number;
  } {
    if (repas.length === 0) {
      return {
        averageCalories: 0,
        averageProteines: 0,
        averageGlucides: 0,
        averageLipides: 0,
        mostCommonMealType: '',
        totalMeals: 0,
      };
    }

    const totals = this.calculateDailyMacros(repas);
    const mealTypeCounts = repas.reduce((counts, repas) => {
      counts[repas.typeRepas] = (counts[repas.typeRepas] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostCommonMealType = Object.entries(mealTypeCounts).reduce((a, b) => 
      mealTypeCounts[a[0]] > mealTypeCounts[b[0]] ? a : b
    )[0];

    return {
      averageCalories: Math.round(totals.totalCalories / repas.length),
      averageProteines: Math.round((totals.totalProteines / repas.length) * 10) / 10,
      averageGlucides: Math.round((totals.totalGlucides / repas.length) * 10) / 10,
      averageLipides: Math.round((totals.totalLipides / repas.length) * 10) / 10,
      mostCommonMealType,
      totalMeals: repas.length,
    };
  },
};
