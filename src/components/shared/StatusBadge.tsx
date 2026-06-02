import { Badge } from '@/components/ui/badge';
import type { PaiementStatut } from '@/types';

const statusVariant: Record<PaiementStatut, 'warning' | 'success' | 'destructive'> = {
  'En attente': 'warning',
  Valide: 'success',
  Rejete: 'destructive',
};

interface StatusBadgeProps {
  status: PaiementStatut;
  label?: string;
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => (
  <Badge variant={statusVariant[status]}>{label ?? status}</Badge>
);
