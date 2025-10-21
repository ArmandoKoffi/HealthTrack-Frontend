import { apiConfig, getAuthHeaders, validateResponse } from './config';
import { ObjectifUtilisateur } from '@/types/health';

export interface ObjectifResponse {
  success: boolean;
  message?: string;
  data?: ObjectifUtilisateur | ObjectifUtilisateur[];
}

export interface CreateObjectifData {
  type: 'poids' | 'calories' | 'activite' | 'sommeil' | 'eau';
  valeurCible: number;
  valeurActuelle: number;
  dateDebut: string;
  dateFinSouhaitee: string;
  actif: boolean;
}

export interface UpdateObjectifData {
  type?: 'poids' | 'calories' | 'activite' | 'sommeil' | 'eau';
  valeurCible?: number;
  valeurActuelle?: number;
  dateDebut?: string;
  dateFinSouhaitee?: string;
  actif?: boolean;
}

export interface ObjectifFilters {
  type?: string;
  actif?: boolean;
  dateDebut?: string;
  dateFinSouhaitee?: string;
}

/**
 * Service API pour la gestion des objectifs
 */
export const objectifService = {
  /**
   * Créer un nouvel objectif
   */
  async createObjectif(objectifData: CreateObjectifData, token: string): Promise<ObjectifResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/objectifs`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(objectifData),
      });

      return await validateResponse(response) as ObjectifResponse;
    } catch (error) {
      console.error('Erreur objectifService.createObjectif:', error);
      throw error;
    }
  },

  /**
   * Récupérer tous les objectifs de l'utilisateur
   */
  async getObjectifs(filters: ObjectifFilters = {}, token: string): Promise<ObjectifResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.actif !== undefined) queryParams.append('actif', filters.actif.toString());
      if (filters.dateDebut) queryParams.append('dateDebut', filters.dateDebut);
      if (filters.dateFinSouhaitee) queryParams.append('dateFinSouhaitee', filters.dateFinSouhaitee);

      const url = `${apiConfig.baseURL}/objectifs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as ObjectifResponse;
    } catch (error) {
      console.error('Erreur objectifService.getObjectifs:', error);
      throw error;
    }
  },

  /**
   * Récupérer un objectif spécifique par ID
   */
  async getObjectifById(id: string, token: string): Promise<ObjectifResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/objectifs/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as ObjectifResponse;
    } catch (error) {
      console.error('Erreur objectifService.getObjectifById:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un objectif
   */
  async updateObjectif(id: string, objectifData: UpdateObjectifData, token: string): Promise<ObjectifResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/objectifs/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(objectifData),
      });

      return await validateResponse(response) as ObjectifResponse;
    } catch (error) {
      console.error('Erreur objectifService.updateObjectif:', error);
      throw error;
    }
  },

  /**
   * Supprimer un objectif
   */
  async deleteObjectif(id: string, token: string): Promise<ObjectifResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/objectifs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as ObjectifResponse;
    } catch (error) {
      console.error('Erreur objectifService.deleteObjectif:', error);
      throw error;
    }
  },

  /**
   * Validation des données d'objectif
   */
  validateObjectifData(objectifData: CreateObjectifData | UpdateObjectifData): string[] {
    const errors: string[] = [];

    if ('type' in objectifData && objectifData.type) {
      const validTypes = ['poids', 'calories', 'activite', 'sommeil', 'eau'];
      if (!validTypes.includes(objectifData.type)) {
        errors.push('Le type d\'objectif doit être: poids, calories, activite, sommeil ou eau');
      }
    }

    if ('valeurCible' in objectifData && objectifData.valeurCible !== undefined) {
      if (objectifData.valeurCible <= 0) {
        errors.push('La valeur cible doit être positive');
      }
      if (objectifData.valeurCible > 100000) {
        errors.push('La valeur cible ne peut pas dépasser 100000');
      }
    }

    if ('valeurActuelle' in objectifData && objectifData.valeurActuelle !== undefined) {
      if (objectifData.valeurActuelle < 0) {
        errors.push('La valeur actuelle ne peut pas être négative');
      }
      if (objectifData.valeurActuelle > 100000) {
        errors.push('La valeur actuelle ne peut pas dépasser 100000');
      }
    }

    if ('dateDebut' in objectifData && objectifData.dateDebut) {
      if (!this.isValidDate(objectifData.dateDebut)) {
        errors.push('La date de début doit être au format YYYY-MM-DD');
      }
    }

    if ('dateFinSouhaitee' in objectifData && objectifData.dateFinSouhaitee) {
      if (!this.isValidDate(objectifData.dateFinSouhaitee)) {
        errors.push('La date de fin souhaitée doit être au format YYYY-MM-DD');
      }
    }

    // Validation croisée des dates
    if ('dateDebut' in objectifData && 'dateFinSouhaitee' in objectifData && 
        objectifData.dateDebut && objectifData.dateFinSouhaitee) {
      const dateDebut = new Date(objectifData.dateDebut);
      const dateFin = new Date(objectifData.dateFinSouhaitee);
      
      if (dateFin <= dateDebut) {
        errors.push('La date de fin doit être postérieure à la date de début');
      }
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
   * Calculer le pourcentage de progression d'un objectif
   */
  calculateProgress(objectif: ObjectifUtilisateur): number {
    if (objectif.valeurCible === 0) return 0;
    
    const progress = (objectif.valeurActuelle / objectif.valeurCible) * 100;
    return Math.min(Math.max(progress, 0), 100); // Limiter entre 0 et 100%
  },

  /**
   * Calculer le nombre de jours restants pour atteindre l'objectif
   */
  calculateDaysRemaining(objectif: ObjectifUtilisateur): number {
    const today = new Date();
    const endDate = new Date(objectif.dateFinSouhaitee);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(diffDays, 0);
  },

  /**
   * Calculer le rythme nécessaire pour atteindre l'objectif
   */
  calculateRequiredPace(objectif: ObjectifUtilisateur): {
    dailyTarget: number;
    weeklyTarget: number;
    isAchievable: boolean;
  } {
    const daysRemaining = this.calculateDaysRemaining(objectif);
    const remainingValue = objectif.valeurCible - objectif.valeurActuelle;
    
    if (daysRemaining === 0 || remainingValue <= 0) {
      return {
        dailyTarget: 0,
        weeklyTarget: 0,
        isAchievable: remainingValue <= 0,
      };
    }

    const dailyTarget = remainingValue / daysRemaining;
    const weeklyTarget = dailyTarget * 7;
    
    // Déterminer si l'objectif est réalisable selon le type
    let isAchievable = true;
    switch (objectif.type) {
      case 'poids':
        // Perte/gain de poids sain: max 1kg par semaine
        isAchievable = Math.abs(weeklyTarget) <= 1;
        break;
      case 'calories':
        // Calories par jour: max 4000 kcal
        isAchievable = dailyTarget <= 4000;
        break;
      case 'activite':
        // Minutes d'activité par jour: max 300 min
        isAchievable = dailyTarget <= 300;
        break;
      case 'sommeil':
        // Heures de sommeil par jour: max 12h
        isAchievable = dailyTarget <= 12;
        break;
      case 'eau':
        // Litres d'eau par jour: max 5L
        isAchievable = dailyTarget <= 5;
        break;
    }

    return {
      dailyTarget: Math.round(dailyTarget * 100) / 100,
      weeklyTarget: Math.round(weeklyTarget * 100) / 100,
      isAchievable,
    };
  },

  /**
   * Formater les données pour l'affichage
   */
  formatObjectifForDisplay(objectif: ObjectifUtilisateur): {
    typeFormatted: string;
    progressFormatted: string;
    daysRemainingFormatted: string;
    statusFormatted: string;
    unitLabel: string;
  } {
    const typeLabels = {
      'poids': 'Poids',
      'calories': 'Calories',
      'activite': 'Activité',
      'sommeil': 'Sommeil',
      'eau': 'Hydratation',
    };

    const unitLabels = {
      'poids': 'kg',
      'calories': 'kcal',
      'activite': 'min',
      'sommeil': 'h',
      'eau': 'L',
    };

    const progress = this.calculateProgress(objectif);
    const daysRemaining = this.calculateDaysRemaining(objectif);

    const typeFormatted = typeLabels[objectif.type] || objectif.type;
    const progressFormatted = `${progress.toFixed(1)}%`;
    const daysRemainingFormatted = daysRemaining === 0 ? 'Terminé' : `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`;
    
    let statusFormatted = 'En cours';
    if (progress >= 100) {
      statusFormatted = 'Atteint';
    } else if (daysRemaining === 0) {
      statusFormatted = 'Expiré';
    } else if (!objectif.actif) {
      statusFormatted = 'Inactif';
    }

    const unitLabel = unitLabels[objectif.type] || '';

    return {
      typeFormatted,
      progressFormatted,
      daysRemainingFormatted,
      statusFormatted,
      unitLabel,
    };
  },

  /**
   * Obtenir des suggestions d'objectifs selon le profil utilisateur
   */
  getSuggestedObjectifs(userProfile: {
    poids?: number;
    taille?: number;
    objectifPoids?: number;
    age?: number;
  }): CreateObjectifData[] {
    const suggestions: CreateObjectifData[] = [];
    const today = new Date().toISOString().split('T')[0];
    const in3Months = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Objectif de poids si défini
    if (userProfile.objectifPoids && userProfile.poids) {
      suggestions.push({
        type: 'poids',
        valeurCible: userProfile.objectifPoids,
        valeurActuelle: userProfile.poids,
        dateDebut: today,
        dateFinSouhaitee: in3Months,
        actif: true,
      });
    }

    // Objectifs standards
    suggestions.push(
      {
        type: 'activite',
        valeurCible: 150, // 150 minutes par semaine recommandées par l'OMS
        valeurActuelle: 0,
        dateDebut: today,
        dateFinSouhaitee: in3Months,
        actif: true,
      },
      {
        type: 'sommeil',
        valeurCible: 8, // 8 heures par nuit
        valeurActuelle: 0,
        dateDebut: today,
        dateFinSouhaitee: in3Months,
        actif: true,
      },
      {
        type: 'eau',
        valeurCible: 2, // 2 litres par jour
        valeurActuelle: 0,
        dateDebut: today,
        dateFinSouhaitee: in3Months,
        actif: true,
      }
    );

    return suggestions;
  },

  /**
   * Analyser les tendances des objectifs
   */
  analyzeObjectifTrends(objectifs: ObjectifUtilisateur[]): {
    totalObjectifs: number;
    objectifsActifs: number;
    objectifsAtteints: number;
    tauxReussite: number;
    typesPlusFrequents: string[];
    progressionMoyenne: number;
  } {
    if (objectifs.length === 0) {
      return {
        totalObjectifs: 0,
        objectifsActifs: 0,
        objectifsAtteints: 0,
        tauxReussite: 0,
        typesPlusFrequents: [],
        progressionMoyenne: 0,
      };
    }

    const objectifsActifs = objectifs.filter(obj => obj.actif).length;
    const objectifsAtteints = objectifs.filter(obj => this.calculateProgress(obj) >= 100).length;
    const tauxReussite = (objectifsAtteints / objectifs.length) * 100;

    const typeCounts = objectifs.reduce((counts, obj) => {
      counts[obj.type] = (counts[obj.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const typesPlusFrequents = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    const progressionMoyenne = objectifs.reduce((sum, obj) => 
      sum + this.calculateProgress(obj), 0
    ) / objectifs.length;

    return {
      totalObjectifs: objectifs.length,
      objectifsActifs,
      objectifsAtteints,
      tauxReussite: Math.round(tauxReussite * 10) / 10,
      typesPlusFrequents,
      progressionMoyenne: Math.round(progressionMoyenne * 10) / 10,
    };
  },
};
