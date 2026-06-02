import { apiClient } from '@/api/axiosClient';
import type {
  PaginationResponse,
  RapportMensuel,
  RapportMensuelListe,
} from '@/types';

const BASE = '/rapports';

export const rapportService = {
  list: async (page = 1, pageSize = 20) => {
    const { data } = await apiClient.get<PaginationResponse<RapportMensuelListe>>(
      BASE,
      { params: { page, page_size: pageSize } },
    );
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<RapportMensuel>(`${BASE}/${id}/`);
    return data;
  },

  download: async (id: number): Promise<Blob> => {
    const { data } = await apiClient.get(`${BASE}/${id}/download/`, {
      responseType: 'blob',
    });
    return data as Blob;
  },
};
