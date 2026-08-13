import { PermissionGuard } from '@/components/guards/PermissionGuard';
import type { Column } from '@/components/tables/DataTable';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ROLE_LABELS, ROLES } from '@/constants/roles';
import { useDeleteMembre, useMembres } from '@/hooks/useMembres';
import type { User } from '@/types';
import { parseDRFError } from '@/utils/errorParser';
import { formatDate } from '@/utils/formatters';
import { Calendar, Eye, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import MembreCreationPage from './MembreCreationPage';
import MembreDetailPage from './MembreDetailPage';


export default function MembresPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedMembreId, setSelectedMembreId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreationOpen, setIsCreationOpen] = useState(false);

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
      onSuccess: () => {
        toast.success('Membre supprimé');
        refetch();
      },
      onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
    });
  };

  const handleViewDetail = (id: number) => {
    setSelectedMembreId(id);
    setIsDetailOpen(true);
  };

  // Colonnes pour le tableau Desktop
  const columns: Column<User>[] = [
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
      cell: (r) => (r.is_active ? <Badge variant="outline">Actif</Badge> : <Badge variant="destructive">Inactif</Badge>),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleViewDetail(r.id)}>
            <Eye className="h-4 w-4 mr-1" /> Voir
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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0A192F]">Membres</h2>
          <p className="text-sm text-muted-foreground">Gestion des membres</p>
        </div>
        <PermissionGuard allowedRoles={[ROLES.PR]}>
          <Dialog open={isCreationOpen} onOpenChange={setIsCreationOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#10B981] hover:bg-emerald-600">
                <Plus className="mr-2 h-4 w-4" /> Nouveau membre
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle>Nouveau membre</DialogTitle>
              </DialogHeader>
              <MembreCreationPage onSuccess={() => {
                toast.success('Membre créé avec succès');
                setIsCreationOpen(false);
                refetch();
              }} onError={(e) => parseDRFError(e).forEach((m) => toast.error(m))} />
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </div>

      {/* Barre de recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou matricule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Vue Mobile : Cartes */}
      <div className="block sm:hidden space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 rounded-lg h-32"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            Aucun membre trouvé.
          </div>
        ) : (
          filtered.map((membre) => (
            <div
              key={membre.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[#0A192F]">{membre.first_name} {membre.last_name}</h3>
                </div>
                <Badge variant="secondary">{ROLE_LABELS[membre.role]}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Adhésion</p>
                  <p className="flex items-center gap-1"><Calendar className="h-3 w-3"/> {formatDate(membre.date_adhesion)}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" className="flex-1 bg-teal-500" onClick={() => handleViewDetail(membre.id)}>
                  <Eye className="h-4 w-4 mr-1" /> Voir
                </Button>
                <PermissionGuard allowedRoles={[ROLES.PR]}>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(membre.id)}>
                    Suppr.
                  </Button>
                </PermissionGuard>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Vue Desktop : Tableau */}
      <div className="hidden sm:block rounded-lg border border-slate-200 shadow-sm overflow-hidden bg-white">
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
          emptyMessage="Aucun membre trouvé"
        />
      </div>

      {/* Modal de Détail */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Fiche membre</DialogTitle>
          </DialogHeader>
          {selectedMembreId && (
            <MembreDetailPage 
              id={selectedMembreId} 
              onSuccess={() => refetch()} 
            /> 
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}