import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { parametreService } from '@/services/parametreService';
import type { ParametreUpdatePayload } from '@/types';

export const useParametres = () =>
  useQuery({
    queryKey: QUERY_KEYS.PARAMETRES,
    queryFn: parametreService.get,
    staleTime: 1000 * 60 * 10,
  });

export const useUpdateParametre = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ParametreUpdatePayload) => parametreService.update(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.PARAMETRES }),
  });
};
