import { apiClient } from '@/api/axiosClient';
import type {
  Depense,
  DepenseCreationPayload,
  DepenseUpdatePayload,
  PaginationResponse,
} from '@/types';

const BASE = '/depenses';

export const depenseService = {
  list: async (page = 1, pageSize = 20) => {
    const { data } = await apiClient.get<PaginationResponse<Depense>>(BASE, {
      params: { page, page_size: pageSize },
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<Depense>(`${BASE}/${id}/`);
    return data;
  },

  create: async (payload: DepenseCreationPayload) => {
    const { data } = await apiClient.post<Depense>(`${BASE}/`, payload);
    return data;
  },

  update: async (id: number, payload: DepenseUpdatePayload) => {
    const { data } = await apiClient.patch<Depense>(`${BASE}/${id}/`, payload);
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`${BASE}/${id}/`);
  },
};
