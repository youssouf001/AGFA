import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { rapportService } from '@/services/rapportService';

export const useRapports = (page = 1, pageSize = 20) =>
  useQuery({
    queryKey: QUERY_KEYS.RAPPORTS(page),
    queryFn: () => rapportService.list(page, pageSize),
  });

export const useRapport = (id: number) =>
  useQuery({
    queryKey: QUERY_KEYS.RAPPORT(id),
    queryFn: () => rapportService.getById(id),
    enabled: !!id,
  });

export const useDownloadRapport = () =>
  useMutation({
    mutationFn: async (id: number) => {
      const blob = await rapportService.download(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
