// src/pages/DashboardPage.tsx

import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useArrieres } from '@/hooks/useArrieres';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { usePaiements } from '@/hooks/usePaiements';
import { useParametres } from '@/hooks/useParametres';
import { formatMoisAnnee } from '@/utils/formatters';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  FileText,
  Plus,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ROLE_AVATAR_BG: Record<string, string> = {
  PR: 'bg-teal-500',
  TR: 'bg-emerald-500',
  AD: 'bg-violet-500',
  ME: 'bg-blue-400',
};

const getInitiales = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useDashboard();
  const { data: arrieres } = useArrieres();
  const { data: paiements, isLoading: paiementsLoading } = usePaiements(1, 5);
  const { data: parametres } = useParametres();

  const solde = parseFloat(dashboard?.solde ?? '0');
  const totalEntrees = parseFloat(dashboard?.total_entrees ?? '0');
  const totalSorties = parseFloat(dashboard?.total_sorties ?? '0');
  const arrieresRouges = arrieres?.filter((a) => a.status_rouge).length ?? 0;
  const membresActifs = arrieres?.length ?? 0;

  const currentMonth = format(new Date(), 'MMMM', { locale: fr });
  const currentMonthCap = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  const initiales = user ? getInitiales(user.first_name, user.last_name) : '??';
  const avatarBg = user ? (ROLE_AVATAR_BG[user.role] ?? 'bg-teal-500') : 'bg-teal-500';

  const roleLabel: Record<string, string> = {
    PR: 'Président(e)',
    TR: 'Trésorier(e)',
    AD: 'Adjoint(e)',
    ME: 'Membre',
  };

  return (
    <div className="min-h-full">

      {/* ── HERO BANNER ────────────────────────────────────────────────── */}
      <div className="bg-[#0F2744] -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-5 pt-6 pb-10 md:px-8 md:pt-7 md:pb-12">

        {/* Ligne salutation + avatar */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[11px] text-white/50 font-medium uppercase tracking-wider">
              Bonjour,
            </p>
            <h2 className="text-[17px] font-semibold text-white mt-0.5 leading-tight">
              {user?.first_name} {user?.last_name}
            </h2>
            <span className="inline-block mt-1.5 text-[10.5px] font-medium px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {roleLabel[user?.role ?? 'ME']}
            </span>
          </div>
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-semibold text-white flex-shrink-0 ${avatarBg}`}
          >
            {initiales}
          </div>
        </div>

        {/* Carte solde principal */}
        <div className="rounded-2xl bg-white/8 border border-white/12 p-5"
          style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <p className="text-[10.5px] text-white/50 font-medium uppercase tracking-wider mb-1">
            Solde de la caisse
          </p>
          {isLoading ? (
            <Skeleton className="h-9 w-48 bg-white/10 mt-1" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-bold text-white leading-none">
                {new Intl.NumberFormat('fr-SN').format(solde)}
              </span>
              <span className="text-[15px] text-teal-300 font-normal">FCFA</span>
            </div>
          )}
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3.5 w-3.5 text-teal-400" />
            <span className="text-[11px] text-teal-400 font-medium">
              Exercice en cours · {currentMonthCap}
            </span>
          </div>

          {/* Entrées / Sorties du mois */}
          <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD]}>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div
                className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-[9.5px] text-white/40 font-medium uppercase tracking-wider">
                  Entrées · {currentMonthCap}
                </p>
                {isLoading ? (
                  <Skeleton className="h-5 w-24 bg-white/10 mt-1.5" />
                ) : (
                  <p className="text-[15px] font-semibold text-teal-400 mt-1.5 flex items-center gap-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    + {new Intl.NumberFormat('fr-SN').format(totalEntrees)}
                  </p>
                )}
              </div>
              <div
                className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.08)' }}
              >
                <p className="text-[9.5px] text-white/40 font-medium uppercase tracking-wider">
                  Sorties · {currentMonthCap}
                </p>
                {isLoading ? (
                  <Skeleton className="h-5 w-24 bg-white/10 mt-1.5" />
                ) : (
                  <p className="text-[15px] font-semibold text-amber-400 mt-1.5 flex items-center gap-1">
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    – {new Intl.NumberFormat('fr-SN').format(totalSorties)}
                  </p>
                )}
              </div>
            </div>
          </PermissionGuard>
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL ────────────────────────────────────────── */}
      <div className="px-0 -mt-5 space-y-4 pb-10">

        {/* Raccourcis navigation */}
        <div className="grid grid-cols-2 gap-3 mx-0">
          <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
            <Link to={ROUTES.RAPPORTS}>
              <Card className="border-border/50 hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 duration-200">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-teal-600" />
                  </div>
                  <span className="text-[13px] font-medium text-foreground">Rapports</span>
                </CardContent>
              </Card>
            </Link>
          </PermissionGuard>
          <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
            <Link to={ROUTES.MEMBRES}>
              <Card className="border-border/50 hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 duration-200">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-[13px] font-medium text-foreground">Membres</span>
                </CardContent>
              </Card>
            </Link>
          </PermissionGuard>
        </div>

        {/* Mini-stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                  Membres
                </span>
                <TrendingUp className="h-3.5 w-3.5 text-teal-500" />
              </div>
              <p className="text-[24px] font-semibold text-foreground leading-none">
                {membresActifs}
              </p>
              <p className="text-[11px] text-teal-600 mt-1.5 font-medium">actifs suivis</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                  Arriérés
                </span>
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              </div>
              <p className="text-[24px] font-semibold text-foreground leading-none">
                {arrieresRouges}
              </p>
              <p className={`text-[11px] mt-1.5 font-medium ${arrieresRouges > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                {arrieresRouges > 0 ? 'critique(s)' : 'aucun critique'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerte arriérés critiques */}
        {arrieresRouges > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-amber-900">
                  {arrieresRouges} arriéré(s) critique(s)
                </p>
                <p className="text-[11.5px] text-amber-700 mt-0.5">
                  Des membres nécessitent une attention immédiate.
                </p>
              </div>
              <Link to={ROUTES.ARRIERES}>
                <ChevronRight className="h-5 w-5 text-amber-500 flex-shrink-0" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Paramètres financiers */}
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
          {parametres && (
            <Card className="border-border/50 overflow-hidden">
              <div className="h-1 bg-[#0F2744] w-full" />
              <CardContent className="p-0">
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Paramètres financiers
                  </p>
                </div>
                <div className="grid grid-cols-3 divide-x divide-border/60">
                  {[
                    { label: 'Mensualité', value: parametres.montant_mensualite },
                    { label: 'Caution', value: parametres.montant_caution },
                    { label: 'Seuil alerte', value: parametres.seuil_alerte_depense },
                  ].map((p) => (
                    <div key={p.label} className="px-3 py-3 flex flex-col items-center text-center">
                      <span className="text-[10px] text-muted-foreground font-medium">{p.label}</span>
                      <span className="text-[13px] font-semibold text-foreground mt-1 leading-tight">
                        {(p.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </PermissionGuard>

        {/* Actions rapides */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Actions rapides
          </p>
          <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD]}>
            <Button asChild className="w-full h-11 bg-[#0F2744] hover:bg-[#1a3a5c] text-white justify-start gap-3 rounded-xl">
              <Link to={ROUTES.PAIEMENT_CREATION}>
                <div className="h-6 w-6 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-3.5 w-3.5 text-teal-300" />
                </div>
                Enregistrer un paiement
              </Link>
            </Button>
          </PermissionGuard>
          <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
            <Button asChild variant="outline" className="w-full h-11 border-border/60 justify-start gap-3 rounded-xl hover:bg-muted/50">
              <Link to={ROUTES.DEPENSE_CREATION}>
                <div className="h-6 w-6 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <Plus className="h-3.5 w-3.5 text-rose-500" />
                </div>
                Enregistrer une dépense
              </Link>
            </Button>
          </PermissionGuard>
          <Button asChild variant="outline" className="w-full h-11 border-border/60 justify-start gap-3 rounded-xl hover:bg-muted/50">
            <Link to={ROUTES.PAIEMENT_WAVE}>
              <div className="h-6 w-6 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Wallet className="h-3.5 w-3.5 text-amber-500" />
              </div>
              Payer par Wave
            </Link>
          </Button>
        </div>

        {/* Dernières transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-foreground">
              Dernières transactions
            </p>
            <Link
              to={ROUTES.PAIEMENTS}
              className="text-[11.5px] text-[#0F2744] font-medium flex items-center gap-0.5 hover:underline"
            >
              Tout voir <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-0">
              {paiementsLoading && (
                <div className="space-y-0 divide-y divide-border/50">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-4">
                      <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              )}

              {!paiementsLoading && paiements?.results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-[13px] text-muted-foreground">Aucune transaction récente.</p>
                </div>
              )}

              {!paiementsLoading && paiements && paiements.results.length > 0 && (
                <ul className="divide-y divide-border/50">
                  {paiements.results.map((p) => {
                    const ini = getInitiales(
                      p.membre.affichage.split(' ')[0] ?? '',
                      p.membre.affichage.split(' ')[1] ?? ''
                    );
                    const isEntree = p.type === 'Mensualité' || p.type === 'Caution';
                    return (
                      <li key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                        {/* Avatar initiales */}
                        <div className="h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center text-[11px] font-semibold text-teal-700 flex-shrink-0">
                          {ini}
                        </div>
                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-foreground truncate">
                            {p.membre.affichage}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {p.type} · {formatMoisAnnee(p.mois_concerne, p.annee_concernee)}
                          </p>
                        </div>
                        {/* Montant + statut */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className={`text-[13px] font-semibold ${isEntree ? 'text-teal-600' : 'text-amber-600'}`}>
                            {isEntree ? '+' : '–'} {p.montant_fcfa}
                          </span>
                          <StatusBadge status={p.statut} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}