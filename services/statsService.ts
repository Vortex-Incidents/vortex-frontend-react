import { mainApi } from './api';

export interface AdminStats {
    totalIncidents: number;
    openIncidents: number;
    avgResolutionTime: string; // "2h 30m"
    slaBreachCount: number;
    // Add other relevant stats
}

export const getAdminStats = async (): Promise<AdminStats> => {
    // If endpoint exists: /admin/stats or /stats
    // Fallback: Calculate from incidents if backend endpoint is missing, 
    // but USER REQUESTED /api/v1/admin/stats explicitly.

    // We strictly follow instruction:
    const response = await mainApi.get<AdminStats>('/admin/stats');
    return response.data;
};
