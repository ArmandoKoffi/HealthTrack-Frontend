import { apiConfig, getAuthHeaders, validateResponse } from './config';
import { Notification } from '@/types/health';

export interface NotificationsResponse {
  success: boolean;
  message?: string;
  data?: Notification | Notification[] | { updatedCount: number };
}

export interface CreateNotificationData {
  titre: string;
  message: string;
  type: 'rappel' | 'felicitations' | 'objectif' | 'conseil';
  date?: string; // YYYY-MM-DD ou ISO
}

export interface NotificationFilters {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Service API pour la gestion des notifications utilisateur
 */
export const notificationsService = {
  /** Créer une notification */
  async createNotification(notificationData: CreateNotificationData, token: string): Promise<NotificationsResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/notifications`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(notificationData),
      });
      return await validateResponse(response) as NotificationsResponse;
    } catch (error) {
      console.error('Erreur notificationsService.createNotification:', error);
      throw error;
    }
  },

  /** Récupérer les notifications */
  async getNotifications(filters: NotificationFilters = {}, token: string): Promise<NotificationsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.unreadOnly) queryParams.append('unreadOnly', String(filters.unreadOnly));
      if (typeof filters.limit === 'number') queryParams.append('limit', String(filters.limit));
      if (typeof filters.offset === 'number') queryParams.append('offset', String(filters.offset));

      const url = `${apiConfig.baseURL}/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      return await validateResponse(response) as NotificationsResponse;
    } catch (error) {
      console.error('Erreur notificationsService.getNotifications:', error);
      throw error;
    }
  },

  /** Récupérer une notification par ID */
  async getNotificationById(id: string, token: string): Promise<NotificationsResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/notifications/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      return await validateResponse(response) as NotificationsResponse;
    } catch (error) {
      console.error('Erreur notificationsService.getNotificationById:', error);
      throw error;
    }
  },

  /** Marquer une notification comme lue */
  async markAsRead(id: string, token: string): Promise<NotificationsResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      });
      return await validateResponse(response) as NotificationsResponse;
    } catch (error) {
      console.error('Erreur notificationsService.markAsRead:', error);
      throw error;
    }
  },

  /** Marquer toutes les notifications comme lues */
  async markAllAsRead(token: string): Promise<NotificationsResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      });
      return await validateResponse(response) as NotificationsResponse;
    } catch (error) {
      console.error('Erreur notificationsService.markAllAsRead:', error);
      throw error;
    }
  },

  /** Supprimer une notification */
  async deleteNotification(id: string, token: string): Promise<NotificationsResponse> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/notifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      return await validateResponse(response) as NotificationsResponse;
    } catch (error) {
      console.error('Erreur notificationsService.deleteNotification:', error);
      throw error;
    }
  },

  /** Validation des données de notification */
  validateNotificationData(notificationData: CreateNotificationData): string[] {
    const errors: string[] = [];

    if (!notificationData.titre || notificationData.titre.trim().length < 2) {
      errors.push('Le titre doit contenir au moins 2 caractères');
    }
    if (!notificationData.message || notificationData.message.trim().length < 2) {
      errors.push('Le message doit contenir au moins 2 caractères');
    }

    const validTypes = ['rappel', 'felicitations', 'objectif', 'conseil'];
    if (!validTypes.includes(notificationData.type)) {
      errors.push('Le type doit être: rappel, felicitations, objectif ou conseil');
    }

    if (notificationData.date && !this.isValidDate(notificationData.date)) {
      errors.push('La date doit être au format YYYY-MM-DD');
    }

    return errors;
  },

  /** Valider le format de date (YYYY-MM-DD) */
  isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  },
};