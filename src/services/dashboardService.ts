import { apiClient } from '@/api/axiosClient';
import type { DashboardData } from '@/types';

export const dashboardService = {
  get: async (): Promise<DashboardData> => {
    const { data } = await apiClient.get<DashboardData>('/dashboard/');
    return data;
  },
};
