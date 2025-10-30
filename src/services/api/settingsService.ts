import { apiConfig, getAuthHeaders, validateResponse } from './config';
import { authService } from './authService';

export type ThemePreference = 'system' | 'light' | 'dark';
export type FrequenceBackup = 'daily' | 'weekly' | 'monthly';

export interface UserSettings {
  notifications: {
    rappelsSommeil: boolean;
    rappelsActivite: boolean;
    rappelsRepas: boolean;
    felicitations: boolean;
    conseils: boolean;
    email: boolean;
  };
  privacy: {
    partagerDonnees: boolean;
    analytiques: boolean;
    amelioration: boolean;
  };
  display: {
    theme: ThemePreference;
    unitesPoids: 'kg' | 'lb';
    unitesTaille: 'cm' | 'in';
    formatHeure: '24h' | '12h';
  };
  backup: {
    autoBackup: boolean;
    frequence: FrequenceBackup;
  };
}

export interface SettingsResponse {
  success: boolean;
  message?: string;
  data?: { user: string; notifications: UserSettings['notifications']; privacy: UserSettings['privacy']; display: UserSettings['display']; backup: UserSettings['backup'] } | UserSettings;
}

export const settingsService = {
  async getMySettings(): Promise<SettingsResponse> {
    const token = authService.getToken();
    if (!token) return { success: false, message: 'Non authentifié' };

    const res = await fetch(`${apiConfig.baseURL}/settings/me`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return await validateResponse(res) as SettingsResponse;
  },

  async updateAll(settings: Partial<UserSettings>): Promise<SettingsResponse> {
    const token = authService.getToken();
    if (!token) return { success: false, message: 'Non authentifié' };

    const res = await fetch(`${apiConfig.baseURL}/settings/me`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(settings),
    });
    return await validateResponse(res) as SettingsResponse;
  },

  async updateNotifications(notifs: Partial<UserSettings['notifications']>): Promise<SettingsResponse> {
    const token = authService.getToken();
    if (!token) return { success: false, message: 'Non authentifié' };

    const res = await fetch(`${apiConfig.baseURL}/settings/notifications`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(notifs),
    });
    return await validateResponse(res) as SettingsResponse;
  },

  async updatePrivacy(privacy: Partial<UserSettings['privacy']>): Promise<SettingsResponse> {
    const token = authService.getToken();
    if (!token) return { success: false, message: 'Non authentifié' };

    const res = await fetch(`${apiConfig.baseURL}/settings/privacy`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(privacy),
    });
    return await validateResponse(res) as SettingsResponse;
  },

  async updateDisplay(display: Partial<UserSettings['display']>): Promise<SettingsResponse> {
    const token = authService.getToken();
    if (!token) return { success: false, message: 'Non authentifié' };

    const res = await fetch(`${apiConfig.baseURL}/settings/display`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(display),
    });
    return await validateResponse(res) as SettingsResponse;
  },

  async updateBackup(backup: Partial<UserSettings['backup']>): Promise<SettingsResponse> {
    const token = authService.getToken();
    if (!token) return { success: false, message: 'Non authentifié' };

    const res = await fetch(`${apiConfig.baseURL}/settings/backup`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(backup),
    });
    return await validateResponse(res) as SettingsResponse;
  },

  async exportSettings(): Promise<SettingsResponse> {
    const token = authService.getToken();
    if (!token) return { success: false, message: 'Non authentifié' };

    const res = await fetch(`${apiConfig.baseURL}/settings/export/me`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return await validateResponse(res) as SettingsResponse;
  },

  async importSettings(settingsData: any): Promise<SettingsResponse> {
    const token = authService.getToken();
    if (!token) return { success: false, message: 'Non authentifié' };

    const res = await fetch(`${apiConfig.baseURL}/settings/import`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(settingsData),
    });
    return await validateResponse(res) as SettingsResponse;
  }
};