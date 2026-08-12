import { PermissionGuard } from "@/components/guards/PermissionGuard";
import type { Column } from "@/components/tables/DataTable";
import { DataTable } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ROLES } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteDepense, useDepenses } from "@/hooks/useDepenses";
import type { Depense } from "@/types";
import { parseDRFError } from "@/utils/errorParser";
import { formatDateTime } from "@/utils/formatters";
import { AlertCircle, Calendar, Plus, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DepenseCreationPage from "./DepenseCreationPage";

export default function DepensesPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 20;
  const { data, isLoading, isError, refetch } = useDepenses(page, pageSize);
  const deleteDepense = useDeleteDepense();
  const { user } = useAuth();

  const hasTrRole = Array.isArray(user?.role)
    ? user.role.includes(ROLES.TR)
    : user?.role === ROLES.TR;

  const canDelete = hasTrRole;

  const baseColumns: Column<Depense>[] = [
    { key: "motif", header: "Motif", cell: (r) => r.motif },
    {
      key: "montant",
      header: "Montant",
      cell: (r) => (
        <span className={r.alerte_seuil ? "font-semibold text-danger-600" : ""}>
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
      key: "auteur",
      header: "Auteur",
      cell: (r) => r.auteur?.affichage ?? "—",
    },
    {
      key: "date",
      header: "Date",
      cell: (r) => formatDateTime(r.date_depense),
    },
  ];

  const columns = [
    ...baseColumns,
    ...(canDelete
      ? [
          {
            key: "actions",
            header: "Actions",
            cell: (r: Depense) => (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm("Supprimer cette dépense ?")) {
                    deleteDepense.mutate(r.id, {
                      onSuccess: () => toast.success("Dépense supprimée"),
                      onError: (e) =>
                        parseDRFError(e).forEach((m) => toast.error(m)),
                    });
                  }
                }}
              >
                Suppr.
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A192F]">Dépenses</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gestion et suivi des dépenses
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
            {/* Bouton pour Trésorier et Adjoint */}
            <PermissionGuard allowedRoles={[ROLES.TR, ROLES.AD]}>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-[#10B981] hover:bg-slate-200 h-11">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle dépense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white">
                  <DialogHeader>
                    <DialogTitle>Nouvelle dépense</DialogTitle>
                  </DialogHeader>
                  <DepenseCreationPage
                    onSuccess={() => {
                      toast.success("Dépense enregistrée");
                      setIsModalOpen(false);
                      refetch();
                    }}
                    onError={(e) =>
                      parseDRFError(e).forEach((m) => toast.error(m))
                    }
                  />
                </DialogContent>
              </Dialog>
            </PermissionGuard>

            <PermissionGuard allowedRoles={[ROLES.PR]}>
              <div className="w-full sm:w-auto text-center mt-2 sm:mt-0">
                <span className="text-sm font-semibold text-slate-600 tracking-wide">
                  Liste des dépenses
                </span>
              </div>
            </PermissionGuard>
          </div>
        </div>
      </div>

      {/* Vue Mobile (Cartes) */}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              className="mt-4"
            >
              Réessayer
            </Button>
          </div>
        ) : data?.results?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Aucune dépense trouvée.</p>
          </div>
        ) : (
          data?.results.map((depense) => (
            <Card
              key={depense.id}
              className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                {/* En-tête : motif + date */}
                <div className="mb-3">
                  <p className="font-semibold text-[#0A192F] text-base leading-tight">
                    {depense.motif}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {formatDateTime(depense.date_depense)}
                  </p>
                </div>

                {/* Section auteur */}
                <div className="mb-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 rounded-full flex-shrink-0">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {depense.auteur?.affichage ?? "—"}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
                    Auteur
                  </p>
                </div>

                {/* Montant + Badge d'alerte */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                      Montant
                    </p>
                    <p
                      className={`text-lg font-bold text-[#0A192F] ${depense.alerte_seuil ? "text-danger-600" : ""}`}
                    >
                      {depense.montant_fcfa}
                    </p>
                  </div>
                  {depense.alerte_seuil && (
                    <Badge
                      variant="warning"
                      className="px-2 py-0.5 text-[10px] h-6"
                    >
                      Alerte
                    </Badge>
                  )}
                </div>

                {/* Bouton d'action (Mobile) */}
                <div className="pt-3 border-t border-slate-100">
                  <PermissionGuard allowedRoles={[ROLES.TR]}>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full h-9 text-xs"
                      onClick={() => {
                        if (confirm("Supprimer cette dépense ?")) {
                          deleteDepense.mutate(depense.id, {
                            onSuccess: () => toast.success("Dépense supprimée"),
                            onError: (e) =>
                              parseDRFError(e).forEach((m) => toast.error(m)),
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

      {/* Vue Desktop (Tableau) */}
      <div className="hidden sm:block rounded-lg border border-slate-200 shadow-sm overflow-hidden bg-white">
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
    </div>
  );
}
