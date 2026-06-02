import { apiClient } from '@/api/axiosClient';
import type {
  PaginationResponse,
  User,
  UserCreationPayload,
  UserUpdatePayload,
} from '@/types';

const BASE = '/membres';

export const membreService = {
  list: async (page = 1, pageSize = 20) => {
    const { data } = await apiClient.get<PaginationResponse<User>>(BASE, {
      params: { page, page_size: pageSize },
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<User>(`${BASE}/${id}/`);
    return data;
  },

  create: async (payload: UserCreationPayload) => {
    const { data } = await apiClient.post<User>(`${BASE}/`, payload);
    return data;
  },

  update: async (id: number, payload: UserUpdatePayload) => {
    const { data } = await apiClient.patch<User>(`${BASE}/${id}/`, payload);
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`${BASE}/${id}/`);
  },
};
