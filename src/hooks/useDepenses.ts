import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { depenseService } from '@/services/depenseService';
import type { DepenseCreationPayload } from '@/types';

export const useDepenses = (page = 1, pageSize = 20) =>
  useQuery({
    queryKey: QUERY_KEYS.DEPENSES(page),
    queryFn: () => depenseService.list(page, pageSize),
  });

export const useCreateDepense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepenseCreationPayload) => depenseService.create(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['depenses'] });
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    },
  });
};

export const useDeleteDepense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => depenseService.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['depenses'] });
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    },
  });
};
