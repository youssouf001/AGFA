import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { logService } from '@/services/logService';

export const useLogs = (page = 1, pageSize = 20) =>
  useQuery({
    queryKey: QUERY_KEYS.LOGS(page),
    queryFn: () => logService.list(page, pageSize),
  });
