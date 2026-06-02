import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { DataTable } from '@/components/tables/DataTable';
import type { Column } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import { useDeleteDepense, useDepenses } from '@/hooks/useDepenses';
import type { Depense } from '@/types';
import { formatDateTime } from '@/utils/formatters';
import { parseDRFError } from '@/utils/errorParser';

export default function DepensesPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { data, isLoading, isError, refetch } = useDepenses(page, pageSize);
  const deleteDepense = useDeleteDepense();

  const columns: Column<Depense>[] = [
    { key: 'motif', header: 'Motif', cell: (r) => r.motif },
    {
      key: 'montant',
      header: 'Montant',
      cell: (r) => (
        <span className={r.alerte_seuil ? 'font-semibold text-danger-600' : ''}>
          {r.montant_fcfa}
          {r.alerte_seuil && (
            <Badge variant="warning" className="ml-2">
              Alerte
            </Badge>
          )}
        </span>
      ),
    },
    {
      key: 'auteur',
      header: 'Auteur',
      cell: (r) => r.auteur?.affichage ?? '—',
    },
    {
      key: 'date',
      header: 'Date',
      cell: (r) => formatDateTime(r.date_depense),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (r) => (
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              if (confirm('Supprimer cette dépense ?')) {
                deleteDepense.mutate(r.id, {
                  onSuccess: () => toast.success('Dépense supprimée'),
                  onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
                });
              }
            }}
          >
            Suppr.
          </Button>
        </PermissionGuard>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Dépenses</h2>
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
          <Button asChild>
            <Link to={ROUTES.DEPENSE_CREATION}>Nouvelle dépense</Link>
          </Button>
        </PermissionGuard>
      </div>
      <DataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        isError={isError}
        totalCount={data?.count ?? 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onRetry={() => void refetch()}
      />
    </div>
  );
}
