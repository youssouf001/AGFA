import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { DataTable } from '@/components/tables/DataTable';
import type { Column } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/constants/roles';
import { useDownloadRapport, useRapports } from '@/hooks/useRapports';
import type { RapportMensuelListe } from '@/types';
import { formatDateTime, formatMoisAnnee } from '@/utils/formatters';
import { parseDRFError } from '@/utils/errorParser';

export default function RapportsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { data, isLoading, isError, refetch } = useRapports(page, pageSize);
  const download = useDownloadRapport();

  const columns: Column<RapportMensuelListe>[] = [
    { key: 'titre', header: 'Titre', cell: (r) => r.titre },
    {
      key: 'periode',
      header: 'Période',
      cell: (r) => formatMoisAnnee(r.mois, r.annee),
    },
    {
      key: 'cree',
      header: 'Créé le',
      cell: (r) => formatDateTime(r.cree_le),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (r) => (
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={`/rapports/${r.id}`}>Voir</Link>
          </Button>
          <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
            <Button
              size="sm"
              disabled={download.isPending}
              onClick={() =>
                download.mutate(r.id, {
                  onSuccess: () => toast.success('Téléchargement lancé'),
                  onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
                })
              }
            >
              PDF
            </Button>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Rapports mensuels</h2>
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
