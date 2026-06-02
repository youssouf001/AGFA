import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { arriereService } from '@/services/arriereService';

export const useArrieres = () =>
  useQuery({
    queryKey: QUERY_KEYS.ARRIERES,
    queryFn: arriereService.list,
    staleTime: 1000 * 60 * 5,
  });
