import { apiClient } from '@/api/axiosClient';
import type {
  PaginationResponse,
  Paiement,
  PaiementEspecesPayload,
  PaiementUpdatePayload,
  PaiementWaveInitPayload,
  PaiementWaveInitResponse,
} from '@/types';

const BASE = '/paiements';

export const paiementService = {
  list: async (page = 1, pageSize = 20) => {
    const { data } = await apiClient.get<PaginationResponse<Paiement>>(BASE, {
      params: { page, page_size: pageSize },
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<Paiement>(`${BASE}/${id}/`);
    return data;
  },

  createEspeces: async (payload: PaiementEspecesPayload) => {
    const { data } = await apiClient.post<Paiement>(`${BASE}/`, payload);
    return data;
  },

  update: async (id: number, payload: PaiementUpdatePayload) => {
    const { data } = await apiClient.patch<Paiement>(`${BASE}/${id}/`, payload);
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`${BASE}/${id}/`);
  },

  waveInit: async (payload: PaiementWaveInitPayload) => {
    const { data } = await apiClient.post<PaiementWaveInitResponse>(
      `${BASE}/wave_init/`,
      payload,
    );
    return data;
  },

  waveCallback: async (paytech_ref: string, status: string) => {
    const { data } = await apiClient.post<{ detail: string }>(
      `${BASE}/wave_callback/`,
      { paytech_ref, status },
    );
    return data;
  },
};
