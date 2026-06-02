import { apiClient } from '@/api/axiosClient';
import type { Arriere } from '@/types';

export const arriereService = {
  list: async (): Promise<Arriere[]> => {
    const { data } = await apiClient.get<Arriere[]>('/arrieres/');
    return data;
  },
};
