import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { dashboardService } from '@/services/dashboardService';

export const useDashboard = () =>
  useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: dashboardService.get,
    staleTime: 1000 * 60 * 5,
  });
