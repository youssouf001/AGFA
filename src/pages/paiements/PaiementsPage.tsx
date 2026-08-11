import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Column } from '@/components/tables/DataTable';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useDeletePaiement, usePaiements, useUpdatePaiement } from '@/hooks/usePaiements';
import type { Paiement } from '@/types';
import { parseDRFError } from '@/utils/errorParser';
import { formatDateTime, formatMoisAnnee } from '@/utils/formatters';
import { AlertCircle, Calendar, CreditCard, Search, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// --- Fonctions utilitaires pour vÃ©rifier le statut ---
const isPending = (status: string) => status === 'En attente';
const isAccepted = (status: string) => status === 'Valide';
const isRefused = (status: string) => status === 'Rejeté'; 

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
      className="text-xs sm:text-sm h-9 px-4 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 w-full sm:w-auto"
    >
      Valider
    </Button>
  );
}

const baseColumns: Column<Paiement>[] = [
    { 
      key: 'membre', 
      header: 'Membre', 
      cell: (r) => <div className="font-medium text-[#0A192F]">{r.membre.affichage}</div>,
    },
    { 
      key: 'montant', 
      header: 'Montant', 
      cell: (r) => (r.montant_fcfa),
    },
    { 
      key: 'type', 
      header: 'Type', 
      cell: (r) => r.type,
    },
    { 
      key: 'mode', 
      header: 'Mode', 
      cell: (r) => r.mode_display,
    },
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
  ];

export default function PaiementsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'En attente' | 'Valide' | 'Rejete'>("all");
  const pageSize = 20;
  const { data, isLoading, isError, refetch } = usePaiements(page, pageSize);
  const deletePaiement = useDeletePaiement();
  
  const { user } = useAuth(); 
  const isTrésorier = user?.role === ROLES.TR;

  const allResult  = data?.results ?? [];
  const counts = {
    all : allResult.length,
    'En attente' : allResult.filter((p) => isPending(p.statut)).length,
    'Valide' : allResult.filter((p) => isAccepted(p.statut)).length,
    'Rejete' : allResult.filter((p) => isRefused(p.statut)).length,
  }

  const filtered = useMemo(() =>{
    let list = allResult;

    if (filter !== 'all') {
      if (filter === 'En attente') list = list.filter((p) => isPending(p.statut));
      if (filter === 'Valide') list = list.filter((p) => isAccepted(p.statut));
      if (filter === 'Rejete') list = list.filter((p) => isRefused(p.statut));
    }

    if(search.trim()){
      const q = search.toLocaleLowerCase();
      list = list.filter((p) => 
      p.membre.affichage.toLocaleLowerCase().includes(q));
    }

    return list;
  }, [allResult, search, filter]);

  const columns = useMemo(() => {
    const cols = [...baseColumns];
    if (isTrésorier) {
      cols.push({
        key: 'actions',
        header: 'Actions',
        cell: (r: Paiement) => (
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            {r.statut === 'En attente' && <ValidateButton id={r.id} />}
            <Button
              size="sm"
              variant="destructive"
              className="h-9 px-4 text-xs sm:text-sm"
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
        ),
      });
    }
    return cols;
  }, [isTrésorier, deletePaiement]);

  const filterOptions = [
    {key: 'all', label: 'Tous', count: counts.all},
    {key: 'En attente', label: 'En attente', count: counts['En attente']},
    {key: 'Valide', label: 'Validé', count: counts['Valide']},
    {key: 'Rejete', label: 'Rejeté', count: counts['Rejete']},
  ]

  return (
    <div className="space-y-6 pb-10">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A192F] flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-[#10B981]" />
            Paiements
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gestion et suivi des transactions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD, ROLES.ME]}>
          <Button asChild variant="secondary" className="w-full sm:w-auto bg-[#10B981] hover:bg-slate-200 h-11">
            <Link to={ROUTES.PAIEMENT_WAVE}>
              <CreditCard className="mr-2 h-4 w-4" /> Effectuer un paiement
            </Link>
          </Button>
        </PermissionGuard>
        </div>
      </div>

      <div className="space-y-4">
        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white shadow-sm border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map(({ key, label, count }) => (
            <button
              key= {key}
              onClick={() => setFilter(key as never)}
              className={`relative px-1 py-1 rounded-full text-sm font-medium transition-all duration-200 
                flex items-center gap-2 border 
                ${filter === key
                  ? 'bg-[#10B981] text-white border-[#10B981] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}
                  `}
              >{label}
              <span className={`text-xs px-2 py-1 rounded-full font-bold
              ${filter === key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}
              `}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* VUE MOBILE : Cartes (visible uniquement si sm:hidden) */}
      <div className="block sm:hidden space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                  <div className="flex justify-between">
                    <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-destructive bg-red-50 rounded-lg border border-dashed border-red-200">
            <AlertCircle className="h-10 w-10 mx-auto mb-2" />
            <p>Erreur de chargement. Veuillez réessayer.</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()} className="mt-4">
              Réessayer
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Aucun paiement trouvé.</p>
          </div>
        ) : (
          filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-5">
                {/* En-tête de la carte : Membre et Statut */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-full">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A192F] text-base">{p.membre.affichage}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {formatMoisAnnee(p.mois_concerne, p.annee_concernee)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <StatusBadge status={p.statut} label={p.statut_display} />
                  </div>
                </div>

                {/* Corps de la carte : Montant et Type */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Montant</p>
                    <p className="text-xl font-bold text-[#0A192F]">{(p.montant_fcfa)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Type</p>
                    <p className="text-sm font-medium text-slate-700">{p.type}</p>
                  </div>
                </div>

                {/* Pied de la carte : Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                  <PermissionGuard allowedRoles={[ROLES.TR]}>
                    {p.statut === 'En attente' && (
                      <div className="w-full flex justify-center mb-2 sm:mb-0 sm:justify-start">
                         <ValidateButton id={p.id} />
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full h-9 text-xs sm:text-sm mt-2 sm:mt-0"
                      onClick={() => {
                        if (confirm('Supprimer ce paiement ?')) {
                          deletePaiement.mutate(p.id, {
                            onSuccess: () => toast.success('Paiement supprimé'),
                            onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
                          });
                        }
                      }}
                    >
                      Supprimer
                    </Button>
                  </PermissionGuard>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* VUE DESKTOP : Tableau (visible uniquement si sm:block) */}
      <div className="hidden sm:block rounded-lg border border-slate-200 shadow-sm overflow-hidden bg-white">
        {isLoading ? (
           <div className="p-8 text-center text-muted-foreground">Chargement...</div>
        ) : isError ? (
           <div className="p-8 text-center text-destructive">Erreur de chargement. <Button variant="link" onClick={() => void refetch()}>Réessayer</Button></div>
        ) : filtered.length === 0 ? (
           <div className="p-8 text-center text-muted-foreground">Aucun paiement trouvé.</div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            isLoading={false}
            isError={false}
            totalCount={data?.count ?? 0}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onRetry={() => void refetch()}
          />
        )}
      </div>
    </div>
  );
}