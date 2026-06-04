import { StatCard } from '@/components/cards/StatCard';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useArrieres } from '@/hooks/useArrieres';
import { useDashboard } from '@/hooks/useDashboard';
import { usePaiements } from '@/hooks/usePaiements';
import { useParametres } from '@/hooks/useParametres';
import { formatDateTime, formatMoisAnnee, formatMontantFCFA } from '@/utils/formatters';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Activity, AlertTriangle, ArrowDownCircle, ArrowUpCircle, FileText, Plus, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard();
  const { data: arrieres } = useArrieres();
  const { data: paiements } = usePaiements(1, 5);
  const { data: parametres } = useParametres();

  const dateLabel = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
  const dateLabelFormatted = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);
  
  // Détermination du mois concerné pour le solde (ex: "Juin 2026")
  const currentMonthYear = format(new Date(), "MMMM yyyy", { locale: fr });
  const currentMonthYearCapitalized = currentMonthYear.charAt(0).toUpperCase() + currentMonthYear.slice(1);

  const solde = parseFloat(dashboard?.solde ?? '0');
  const arrieresRouges = arrieres?.filter((a) => a.status_rouge).length ?? 0;

  return (
    <div className="space-y-6 pb-10">
      {/* En-tête stylisé */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A192F] flex items-center gap-2">
            <Activity className="h-8 w-8 text-[#10B981]" />
            Tableau de bord
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            {dateLabelFormatted}
          </p>
        </div>
      </div>

            {/* CONTENEUR UNIQUE DES STATISTIQUES */}
      <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-slate-900/5">
        <div className="grid grid-cols-2 gap-0">
          
          {/* LIGNE 1 : Colonne 1 (Entrées) */}
          <div className="p-3 md:p-8">
            <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD]}>
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <StatCard
                  title="Total entrées"
                  value={formatMontantFCFA(dashboard?.total_entrees ?? 0)}
                  icon={ArrowUpCircle}
                  variant="success"
                  isLoading={isLoading}
                  className="relative z-10 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-center"
                />
              </div>
            </PermissionGuard>
          </div>

          {/* LIGNE 1 : Colonne 2 (Sorties) */}
          <div className="p-3 md:p-8">
            <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD]}>
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <StatCard
                  title="Total sorties"
                  value={formatMontantFCFA(dashboard?.total_sorties ?? 0)}
                  icon={ArrowDownCircle}
                  variant="danger"
                  isLoading={isLoading}
                  className="relative z-10 border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-center"
                />
              </div>
            </PermissionGuard>
          </div>

          {/* LIGNE 2 : Solde (Pleine largeur - 2 colonnes) */}
          <div className="col-span-2 p-3 md:p-8 bg-slate-50/50 border-slate-100">
            <div className="relative group h-full w-full">
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                solde >= 0 ? 'bg-emerald-50' : 'bg-rose-50'
              }`} />
              <StatCard
                title={`Solde au ${currentMonthYearCapitalized}`}
                value={formatMontantFCFA(dashboard?.solde ?? 0)}
                icon={Wallet}
                variant={solde >= 0 ? 'success' : 'danger'}
                isLoading={isLoading}
                className={`relative z-10 border-l-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
                  solde >= 0 ? 'border-l-emerald-500' : 'border-l-rose-500'
                }`}
              />
            </div>
          </div>

        </div>
      </Card>

      {/* Alertes Arriérés */}
      {arrieresRouges > 0 && (
        <Card className="border-l-4 border-l-warning-500 bg-gradient-to-r from-warning-50 to-white shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 pb-6">
            <div className="p-3 bg-warning-100 rounded-full shrink-0">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warning-900">Attention requise</h3>
              <p className="text-sm text-warning-700 mt-1">
                <strong>{arrieresRouges}</strong> membre(s) en situation d&apos;arriéré critique.
              </p>
            </div>
            <Link 
              to={ROUTES.ARRIERES} 
              className="mt-2 sm:mt-0 px-4 py-2 bg-warning-600 text-white rounded-md text-sm font-medium hover:bg-warning-700 transition-colors whitespace-nowrap"
            >
              Voir les arriérés
            </Link>
          </CardContent>
        </Card>
      )}

            {/* Paramètres (visible pour PR, TR) */}
      <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
        {parametres && (
          <Card className="shadow-sm border-t-4 border-t-blue-500 overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-6">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Paramètres actuels
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              {/* Force 3 colonnes sur TOUTES les tailles d'écran */}
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                
                {/* Mensualité */}
                <div className="p-4 flex flex-col items-center text-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium mb-1">
                    Mensualité
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-[#0A192F] break-words">
                    {formatMontantFCFA(parametres.montant_mensualite)}
                  </span>
                </div>

                {/* Caution */}
                <div className="p-4 flex flex-col items-center text-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium mb-1">
                    Caution
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-[#0A192F] break-words">
                    {formatMontantFCFA(parametres.montant_caution)}
                  </span>
                </div>

                {/* Seuil alerte */}
                <div className="p-4 flex flex-col items-center text-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wide font-medium mb-1">
                    Seuil alerte
                  </span>
                  <span className="text-sm sm:text-lg font-bold text-[#0A192F] break-words">
                    {formatMontantFCFA(parametres.seuil_alerte_depense)}
                  </span>
                </div>

              </div>
            </CardContent>
          </Card>
        )}
      </PermissionGuard>

      {/* Boutons d'action */}
      <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD]}>
          <Button asChild className="w-full sm:w-auto bg-[#10B981] hover:bg-emerald-600 shadow-sm h-11">
            <Link to={ROUTES.PAIEMENT_CREATION}>
              <Plus className="mr-2 h-4 w-4" /> Enregistrer un paiement
            </Link>
          </Button>
        </PermissionGuard>
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
          <Button asChild variant="outline" className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 h-11">
            <Link to={ROUTES.DEPENSE_CREATION}>
              <FileText className="mr-2 h-4 w-4" /> Enregistrer une dépense
            </Link>
          </Button>
        </PermissionGuard>
      </div>

      {/* Activité récente */}
      <Card className="shadow-sm border-t-4 border-t-indigo-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-500" />
            Activité récente — Paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paiements?.results.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Aucun paiement récent enregistré.</p>
            </div>
          ) : (
            <ul className="space-y-0">
              {paiements?.results.map((p, index) => (
                <li 
                  key={p.id} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 px-1 ${
                    index !== paiements.results.length - 1 ? 'border-b border-slate-100' : ''
                  } hover:bg-slate-50/50 transition-colors rounded-md px-2 -mx-2`}
                >
                  <div className="flex flex-col">
                    <p className="font-semibold text-[#0A192F]">{p.membre.affichage}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatMoisAnnee(p.mois_concerne, p.annee_concernee)} • {(p.montant_fcfa)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <StatusBadge status={p.statut} label={p.statut_display} />
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(p.date_enregistrement)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!paiements && isLoading && (
            <div className="space-y-3 pt-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}