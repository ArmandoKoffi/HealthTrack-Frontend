import { apiConfig, getAuthHeaders } from './config';
import { User } from './authService';

export interface RealtimeEvent {
  type: 'connection' | 'heartbeat' | 'profile_updated' | 'notification' | 'settings_updated';
  data?: unknown;
  message?: string;
  timestamp: string;
}

export interface NotificationData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  data?: unknown;
}

/**
 * Service pour les mises à jour en temps réel via SSE (Server-Sent Events)
 */
export class RealtimeService {
  private eventSource: EventSource | null = null;
  private token: string | null = null;
  private listeners: Map<string, ((event: RealtimeEvent) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 seconde

  /**
   * Initialiser la connexion SSE
   */
  connect(token: string): void {
    this.token = token;
    this.createConnection();
  }

  /**
   * Créer la connexion EventSource
   */
  private createConnection(): void {
    if (!this.token) {
      console.error('Token manquant pour la connexion SSE');
      return;
    }

    try {
      // Fermer la connexion existante si elle existe
      this.disconnect();

      // Créer une nouvelle connexion SSE avec token en query (EventSource ne supporte pas les headers)
      const url = `${apiConfig.baseURL}/realtime/events?token=${encodeURIComponent(this.token)}`;
      this.eventSource = new EventSource(url);

      // Ajouter le token dans les headers (limitation d'EventSource)
      // Note: EventSource ne supporte pas les headers personnalisés
      // Alternative: passer le token en query parameter (moins sécurisé)
      // Pour une sécurité maximale, utiliser WebSocket à la place

      this.eventSource.onopen = () => {
        console.log('Connexion SSE établie');
        this.reconnectAttempts = 0;
        this.emitEvent({
          type: 'connection',
          message: 'Connexion établie',
          timestamp: new Date().toISOString(),
        });
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data: RealtimeEvent = JSON.parse(event.data);
          this.handleEvent(data);
        } catch (error) {
          console.error('Erreur lors du parsing des données SSE:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('Erreur SSE:', error);
        
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.handleReconnect();
        }
      };

    } catch (error) {
      console.error('Erreur lors de la création de la connexion SSE:', error);
      this.handleReconnect();
    }
  }

  /**
   * Gérer la reconnexion automatique
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Backoff exponentiel
      
      console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms`);
      
      setTimeout(() => {
        this.createConnection();
      }, delay);
    } else {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
      this.emitEvent({
        type: 'notification',
        data: {
          type: 'error',
          title: 'Connexion perdue',
          message: 'Impossible de rétablir la connexion en temps réel',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Traiter les événements reçus
   */
  private handleEvent(event: RealtimeEvent): void {
    console.log('Événement SSE reçu:', event);

    switch (event.type) {
      case 'profile_updated':
        this.handleProfileUpdate(event.data as User);
        break;
      case 'notification':
        this.handleNotification(event.data as NotificationData);
        break;
      case 'settings_updated':
        try {
          const display = (event.data as any)?.display || event.data;
          window.dispatchEvent(new CustomEvent('displaySettingsUpdated', { detail: display }));
        } catch (e) {
          console.warn('Erreur dispatch settings_updated:', e);
        }
        break;
      case 'heartbeat':
        // Heartbeat pour maintenir la connexion
        break;
      default:
        console.log('Type d\'événement non géré:', event.type);
    }

    this.emitEvent(event);
  }

  /**
   * Gérer les mises à jour de profil
   */
  private handleProfileUpdate(userData: User): void {
    // Mettre à jour localStorage
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Déclencher un événement personnalisé pour notifier les composants
      window.dispatchEvent(new CustomEvent('userDataUpdated', { 
        detail: userData 
      }));
    }
  }

  /**
   * Gérer les notifications
   */
  private handleNotification(notificationData: NotificationData): void {
    // Déclencher un événement personnalisé pour les notifications
    window.dispatchEvent(new CustomEvent('realtimeNotification', { 
      detail: notificationData 
    }));
  }

  /**
   * Émettre un événement vers les listeners
   */
  private emitEvent(event: RealtimeEvent): void {
    const listeners = this.listeners.get(event.type) || [];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Erreur dans le listener d\'événement:', error);
      }
    });

    // Émettre aussi vers les listeners génériques
    const genericListeners = this.listeners.get('*') || [];
    genericListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Erreur dans le listener générique:', error);
      }
    });
  }

  /**
   * Ajouter un listener pour un type d'événement
   */
  addEventListener(eventType: string, listener: (event: RealtimeEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  /**
   * Supprimer un listener
   */
  removeEventListener(eventType: string, listener: (event: RealtimeEvent) => void): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Déclencher une mise à jour de profil
   */
  async triggerProfileUpdate(updatedUser: User): Promise<void> {
    if (!this.token) {
      throw new Error('Token manquant');
    }

    try {
      const response = await fetch(`${apiConfig.baseURL}/realtime/profile-update`, {
        method: 'POST',
        headers: getAuthHeaders(this.token),
        body: JSON.stringify({ updatedUser }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du déclenchement de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur triggerProfileUpdate:', error);
      throw error;
    }
  }

  /**
   * Envoyer une notification
   */
  async sendNotification(notification: NotificationData): Promise<void> {
    if (!this.token) {
      throw new Error('Token manquant');
    }

    try {
      const response = await fetch(`${apiConfig.baseURL}/realtime/notification`, {
        method: 'POST',
        headers: getAuthHeaders(this.token),
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la notification');
      }
    } catch (error) {
      console.error('Erreur sendNotification:', error);
      throw error;
    }
  }

  /**
   * Obtenir le statut de la connexion
   */
  async getConnectionStatus(): Promise<{
    userId: string;
    activeConnections: number;
    totalUsers: number;
    isConnected: boolean;
  }> {
    if (!this.token) {
      throw new Error('Token manquant');
    }

    try {
      const response = await fetch(`${apiConfig.baseURL}/realtime/status`, {
        method: 'GET',
        headers: getAuthHeaders(this.token),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du statut');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Erreur getConnectionStatus:', error);
      throw error;
    }
  }

  /**
   * Vérifier si la connexion est active
   */
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  /**
   * Fermer la connexion SSE
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.listeners.clear();
    this.reconnectAttempts = 0;
  }

  /**
   * Réinitialiser la connexion
   */
  reconnect(): void {
    this.disconnect();
    if (this.token) {
      this.createConnection();
    }
  }
}

// Instance singleton du service
export const realtimeService = new RealtimeService();
