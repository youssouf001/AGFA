import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { DataTable } from '@/components/tables/DataTable';
import type { Column } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import { ROLE_LABELS } from '@/constants/roles';
import { useDeleteMembre, useMembres } from '@/hooks/useMembres';
import type { User } from '@/types';
import { formatDate } from '@/utils/formatters';
import { parseDRFError } from '@/utils/errorParser';

export default function MembresPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const pageSize = 20;
  const { data, isLoading, isError, refetch } = useMembres(page, pageSize);
  const deleteMembre = useDeleteMembre();

  const filtered = useMemo(() => {
    const list = data?.results ?? [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (m) =>
        m.affichage.toLowerCase().includes(q) ||
        m.matricule.toLowerCase().includes(q),
    );
  }, [data, search]);

  const handleDelete = (id: number) => {
    if (!confirm('Supprimer ce membre ?')) return;
    deleteMembre.mutate(id, {
      onSuccess: () => toast.success('Membre supprimé'),
      onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
    });
  };

  const columns: Column<User>[] = [
    { key: 'matricule', header: 'Matricule', cell: (r) => r.matricule },
    { key: 'nom', header: 'Nom', cell: (r) => r.affichage },
    {
      key: 'role',
      header: 'Rôle',
      cell: (r) => <Badge variant="secondary">{ROLE_LABELS[r.role]}</Badge>,
    },
    {
      key: 'adhesion',
      header: 'Adhésion',
      cell: (r) => formatDate(r.date_adhesion),
    },
    {
      key: 'statut',
      header: 'Statut',
      cell: (r) => (r.is_active ? 'Actif' : 'Inactif'),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (r) => (
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={`/membres/${r.id}`}>Voir</Link>
          </Button>
          <PermissionGuard allowedRoles={[ROLES.PR]}>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(r.id)}>
              Suppr.
            </Button>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Membres</h2>
        <PermissionGuard allowedRoles={[ROLES.PR]}>
          <Button asChild>
            <Link to={ROUTES.MEMBRE_CREATION}>Nouveau membre</Link>
          </Button>
        </PermissionGuard>
      </div>
      <Input
        placeholder="Rechercher..."
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
        emptyMessage="Aucun membre"
      />
    </div>
  );
}
