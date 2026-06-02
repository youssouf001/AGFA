import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { paiementService } from '@/services/paiementService';
import type {
  PaiementEspecesPayload,
  PaiementUpdatePayload,
  PaiementWaveInitPayload,
} from '@/types';

export const usePaiements = (page = 1, pageSize = 20) =>
  useQuery({
    queryKey: QUERY_KEYS.PAIEMENTS(page),
    queryFn: () => paiementService.list(page, pageSize),
  });

export const usePaiement = (id: number) =>
  useQuery({
    queryKey: QUERY_KEYS.PAIEMENT(id),
    queryFn: () => paiementService.getById(id),
    enabled: !!id,
  });

export const useCreatePaiementEspeces = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaiementEspecesPayload) =>
      paiementService.createEspeces(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['paiements'] });
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    },
  });
};

export const useUpdatePaiement = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaiementUpdatePayload) =>
      paiementService.update(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.PAIEMENT(id) });
      void qc.invalidateQueries({ queryKey: ['paiements'] });
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    },
  });
};

export const useDeletePaiement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => paiementService.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['paiements'] });
      void qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    },
  });
};

export const useWaveInit = () =>
  useMutation({
    mutationFn: (payload: PaiementWaveInitPayload) => paiementService.waveInit(payload),
  });
