import { apiClient } from '@/api/axiosClient';
import type { Log, PaginationResponse } from '@/types';

export const logService = {
  list: async (page = 1, pageSize = 20) => {
    const { data } = await apiClient.get<PaginationResponse<Log>>('/logs/', {
      params: { page, page_size: pageSize },
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<Log>(`/logs/${id}/`);
    return data;
  },
};
