import { apiClient, tokenStorage } from '@/api/axiosClient';
import type { LoginPayload, TokenResponse } from '@/types';

export const authService = {
  login: async (payload: LoginPayload): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>('/token/', payload);
    tokenStorage.setTokens(data.access, data.refresh);
    return data;
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>('/token/refresh/', {
      refresh: refreshToken,
    });
    return data;
  },

  logout: () => {
    tokenStorage.clear();
  },
};
