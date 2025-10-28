import { authService } from './authService';

export type ExportDataResponse = {
  success: boolean;
  data?: any;
  message?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const exportService = {
  async getUserData(): Promise<ExportDataResponse> {
    const token = authService.getToken();
    if (!token) return { success: false, message: 'Non authentifié' };

    const res = await fetch(`${API_BASE}/export/user-data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    try {
      const json = await res.json();
      return json;
    } catch (e) {
      return { success: false, message: 'Erreur de parsing JSON' };
    }
  }
};