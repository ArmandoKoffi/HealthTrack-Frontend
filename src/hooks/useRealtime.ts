import { useEffect, useRef, useCallback } from 'react';
import { realtimeService, RealtimeEvent, NotificationData } from '../services/api/realtimeService';
import { User } from '../services/api/authService';
import { authService } from '../services/api/authService';

/**
 * Hook personnalisé pour gérer les connexions temps réel
 */
export const useRealtime = () => {
  const isInitialized = useRef(false);

  /**
   * Initialiser la connexion temps réel
   */
  const initializeRealtime = useCallback(() => {
    if (isInitialized.current) return;

    const token = authService.getToken();
    if (token && authService.isAuthenticated()) {
      realtimeService.connect(token);
      isInitialized.current = true;
    }
  }, []);

  /**
   * Fermer la connexion temps réel
   */
  const disconnectRealtime = useCallback(() => {
    realtimeService.disconnect();
    isInitialized.current = false;
  }, []);

  /**
   * Ajouter un listener d'événement
   */
  const addEventListener = useCallback((
    eventType: string, 
    listener: (event: RealtimeEvent) => void
  ) => {
    realtimeService.addEventListener(eventType, listener);
  }, []);

  /**
   * Supprimer un listener d'événement
   */
  const removeEventListener = useCallback((
    eventType: string, 
    listener: (event: RealtimeEvent) => void
  ) => {
    realtimeService.removeEventListener(eventType, listener);
  }, []);

  /**
   * Déclencher une mise à jour de profil
   */
  const triggerProfileUpdate = useCallback(async (updatedUser: User) => {
    try {
      await realtimeService.triggerProfileUpdate(updatedUser);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil en temps réel:', error);
      throw error;
    }
  }, []);

  /**
   * Envoyer une notification
   */
  const sendNotification = useCallback(async (notification: NotificationData) => {
    try {
      await realtimeService.sendNotification(notification);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      throw error;
    }
  }, []);

  /**
   * Obtenir le statut de la connexion
   */
  const getConnectionStatus = useCallback(async () => {
    try {
      return await realtimeService.getConnectionStatus();
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      throw error;
    }
  }, []);

  /**
   * Vérifier si connecté
   */
  const isConnected = useCallback(() => {
    return realtimeService.isConnected();
  }, []);

  /**
   * Reconnecter
   */
  const reconnect = useCallback(() => {
    realtimeService.reconnect();
  }, []);

  // Initialiser automatiquement lors du montage
  useEffect(() => {
    initializeRealtime();

    // Nettoyer lors du démontage
    return () => {
      disconnectRealtime();
    };
  }, [initializeRealtime, disconnectRealtime]);

  return {
    initializeRealtime,
    disconnectRealtime,
    addEventListener,
    removeEventListener,
    triggerProfileUpdate,
    sendNotification,
    getConnectionStatus,
    isConnected,
    reconnect,
  };
};

/**
 * Hook pour écouter les mises à jour de profil en temps réel
 */
export const useProfileUpdates = (onProfileUpdate?: (user: User) => void) => {
  const { addEventListener, removeEventListener } = useRealtime();

  useEffect(() => {
    // Listener pour les événements de mise à jour de profil
    const handleProfileUpdate = (event: RealtimeEvent) => {
      if (event.type === 'profile_updated' && event.data) {
        onProfileUpdate?.(event.data as User);
      }
    };

    // Listener pour les événements personnalisés du navigateur
    const handleUserDataUpdate = (event: CustomEvent) => {
      onProfileUpdate?.(event.detail);
    };

    addEventListener('profile_updated', handleProfileUpdate);
    window.addEventListener('userDataUpdated', handleUserDataUpdate as EventListener);

    return () => {
      removeEventListener('profile_updated', handleProfileUpdate);
      window.removeEventListener('userDataUpdated', handleUserDataUpdate as EventListener);
    };
  }, [addEventListener, removeEventListener, onProfileUpdate]);
};

/**
 * Hook pour écouter les notifications en temps réel
 */
export const useRealtimeNotifications = (
  onNotification?: (notification: NotificationData) => void
) => {
  const { addEventListener, removeEventListener } = useRealtime();

  useEffect(() => {
    // Listener pour les événements de notification
    const handleNotification = (event: RealtimeEvent) => {
      if (event.type === 'notification' && event.data) {
        onNotification?.(event.data as NotificationData);
      }
    };

    // Listener pour les événements personnalisés du navigateur
    const handleRealtimeNotification = (event: CustomEvent) => {
      onNotification?.(event.detail);
    };

    addEventListener('notification', handleNotification);
    window.addEventListener('realtimeNotification', handleRealtimeNotification as EventListener);

    return () => {
      removeEventListener('notification', handleNotification);
      window.removeEventListener('realtimeNotification', handleRealtimeNotification as EventListener);
    };
  }, [addEventListener, removeEventListener, onNotification]);
};

/**
 * Hook pour gérer l'état de connexion temps réel
 */
export const useConnectionStatus = () => {
  const { isConnected, getConnectionStatus, reconnect } = useRealtime();

  const checkConnection = useCallback(async () => {
    try {
      const status = await getConnectionStatus();
      return {
        ...status,
        isConnected: isConnected(),
      };
    } catch (error) {
      return {
        userId: '',
        activeConnections: 0,
        totalUsers: 0,
        isConnected: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }, [getConnectionStatus, isConnected]);

  return {
    isConnected,
    checkConnection,
    reconnect,
  };
};
