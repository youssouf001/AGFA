import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { DataTable } from '@/components/tables/DataTable';
import type { Column } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import { useDeletePaiement, usePaiements, useUpdatePaiement } from '@/hooks/usePaiements';
import type { Paiement } from '@/types';
import { formatDateTime, formatMoisAnnee } from '@/utils/formatters';
import { parseDRFError } from '@/utils/errorParser';

function ValidateButton({ id }: { id: number }) {
  const update = useUpdatePaiement(id);
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={update.isPending}
      onClick={() =>
        update.mutate(
          { statut: 'Valide' },
          {
            onSuccess: () => toast.success('Paiement validé'),
            onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
          },
        )
      }
    >
      Valider
    </Button>
  );
}

export default function PaiementsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const pageSize = 20;
  const { data, isLoading, isError, refetch } = usePaiements(page, pageSize);
  const deletePaiement = useDeletePaiement();

  const filtered = useMemo(() => {
    const list = data?.results ?? [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((p) => p.membre.affichage.toLowerCase().includes(q));
  }, [data, search]);

  const columns: Column<Paiement>[] = [
    { key: 'membre', header: 'Membre', cell: (r) => r.membre.affichage },
    { key: 'type', header: 'Type', cell: (r) => r.type },
    { key: 'montant', header: 'Montant', cell: (r) => r.montant_fcfa },
    { key: 'mode', header: 'Mode', cell: (r) => r.mode_display },
    {
      key: 'statut',
      header: 'Statut',
      cell: (r) => <StatusBadge status={r.statut} label={r.statut_display} />,
    },
    {
      key: 'periode',
      header: 'Période',
      cell: (r) => formatMoisAnnee(r.mois_concerne, r.annee_concernee),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (r) => formatDateTime(r.date_enregistrement),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (r) => (
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
          <div className="flex gap-1">
            {r.statut === 'En attente' && <ValidateButton id={r.id} />}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (confirm('Supprimer ?')) {
                  deletePaiement.mutate(r.id, {
                    onSuccess: () => toast.success('Supprimé'),
                    onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
                  });
                }
              }}
            >
              Suppr.
            </Button>
          </div>
        </PermissionGuard>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-4">
        <h2 className="text-2xl font-bold">Paiements</h2>
        <div className="flex gap-2">
          <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD]}>
            <Button asChild>
              <Link to={ROUTES.PAIEMENT_CREATION}>Nouveau paiement</Link>
            </Button>
          </PermissionGuard>
          <Button asChild variant="secondary">
            <Link to={ROUTES.PAIEMENT_WAVE}>Wave</Link>
          </Button>
        </div>
      </div>
      <Input
        placeholder="Rechercher un membre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <DataTable
        columns={columns}
        data={filtered}
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
