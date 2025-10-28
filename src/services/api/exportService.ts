import { authService } from './authService';
import { apiConfig, getAuthHeaders, validateResponse } from './config';

export type ExportDataResponse = {
  success: boolean;
  data?: any;
  message?: string;
};

export const exportService = {
  async getUserData(params?: { startDate?: string; endDate?: string }): Promise<ExportDataResponse> {
    const token = authService.getToken();
    if (!token) return { success: false, message: 'Non authentifié' };

    const qs = new URLSearchParams();
    if (params?.startDate) qs.set('startDate', params.startDate);
    if (params?.endDate) qs.set('endDate', params.endDate);
    const url = `${apiConfig.baseURL}/export/user-data${qs.toString() ? `?${qs.toString()}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    return await validateResponse(res) as ExportDataResponse;
  }
};