import { apiClient } from '@/api/axiosClient';
import type { Parametre, ParametreUpdatePayload } from '@/types';

export const parametreService = {
  get: async (): Promise<Parametre> => {
    const { data } = await apiClient.get<{ results: Parametre[] }>('/parametres/');
    const first = data.results[0];
    if (!first) throw new Error('Paramètres introuvables');
    return first;
  },

  update: async (payload: ParametreUpdatePayload): Promise<Parametre> => {
    const { data } = await apiClient.patch<Parametre>('/parametres/1/', payload);
    return data;
  },
};
