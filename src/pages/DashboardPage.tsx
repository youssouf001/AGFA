import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { StatCard } from '@/components/cards/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import { useArrieres } from '@/hooks/useArrieres';
import { useDashboard } from '@/hooks/useDashboard';
import { usePaiements } from '@/hooks/usePaiements';
import { useParametres } from '@/hooks/useParametres';
import { formatDateTime, formatMontantFCFA, formatMoisAnnee } from '@/utils/formatters';

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard();
  const { data: arrieres } = useArrieres();
  const { data: paiements } = usePaiements(1, 5);
  const { data: parametres } = useParametres();

  const solde = parseFloat(dashboard?.solde ?? '0');
  const arrieresRouges = arrieres?.filter((a) => a.status_rouge).length ?? 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tableau de bord</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total entrées"
          value={formatMontantFCFA(dashboard?.total_entrees ?? 0)}
          icon={ArrowUpCircle}
          variant="success"
          isLoading={isLoading}
        />
        <StatCard
          title="Total sorties"
          value={formatMontantFCFA(dashboard?.total_sorties ?? 0)}
          icon={ArrowDownCircle}
          variant="danger"
          isLoading={isLoading}
        />
        <StatCard
          title="Solde"
          value={formatMontantFCFA(dashboard?.solde ?? 0)}
          icon={Wallet}
          variant={solde >= 0 ? 'success' : 'danger'}
          isLoading={isLoading}
        />
      </div>

      {arrieresRouges > 0 && (
        <Card className="border-warning-500 bg-warning-500/10">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
            <p className="text-sm">
              <strong>{arrieresRouges}</strong> membre(s) en situation d&apos;arriéré critique.{' '}
              <Link to={ROUTES.ARRIERES} className="text-primary underline">
                Voir les arriérés
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
        {parametres && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Paramètres actuels</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
              <p>Mensualité : {formatMontantFCFA(parametres.montant_mensualite)}</p>
              <p>Caution : {formatMontantFCFA(parametres.montant_caution)}</p>
              <p>Seuil alerte : {formatMontantFCFA(parametres.seuil_alerte_depense)}</p>
            </CardContent>
          </Card>
        )}
      </PermissionGuard>

      <div className="flex flex-wrap gap-2">
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD]}>
          <Button asChild>
            <Link to={ROUTES.PAIEMENT_CREATION}>Enregistrer un paiement</Link>
          </Button>
        </PermissionGuard>
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
          <Button asChild variant="outline">
            <Link to={ROUTES.DEPENSE_CREATION}>Enregistrer une dépense</Link>
          </Button>
        </PermissionGuard>
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD, ROLES.ME]}>
          <Button asChild variant="secondary">
            <Link to={ROUTES.PAIEMENT_WAVE}>Payer par Wave</Link>
          </Button>
        </PermissionGuard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activité récente — Paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {paiements?.results.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun paiement récent.</p>
          )}
          <ul className="space-y-3">
            {paiements?.results.map((p) => (
              <li key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium">{p.membre.affichage}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatMoisAnnee(p.mois_concerne, p.annee_concernee)} — {p.montant_fcfa}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge status={p.statut} label={p.statut_display} />
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(p.date_enregistrement)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {!paiements && <Skeleton className="h-20 w-full" />}
        </CardContent>
      </Card>
    </div>
  );
}
