import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { membreService } from '@/services/membreService';
import type { UserCreationPayload, UserUpdatePayload } from '@/types';

export const useMembres = (page = 1, pageSize = 20) =>
  useQuery({
    queryKey: QUERY_KEYS.MEMBRES(page),
    queryFn: () => membreService.list(page, pageSize),
  });

export const useMembre = (id: number) =>
  useQuery({
    queryKey: QUERY_KEYS.MEMBRE(id),
    queryFn: () => membreService.getById(id),
    enabled: !!id,
  });

export const useCreateMembre = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCreationPayload) => membreService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['membres'] }),
  });
};

export const useUpdateMembre = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserUpdatePayload) => membreService.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.MEMBRE(id) });
      void qc.invalidateQueries({ queryKey: ['membres'] });
    },
  });
};

export const useDeleteMembre = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => membreService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['membres'] }),
  });
};
