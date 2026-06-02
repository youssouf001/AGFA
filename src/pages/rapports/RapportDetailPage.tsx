import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROLES } from '@/constants/roles';
import { useDownloadRapport, useRapport } from '@/hooks/useRapports';
import { formatDateTime, formatMoisAnnee } from '@/utils/formatters';
import { parseDRFError } from '@/utils/errorParser';

export default function RapportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const rapportId = Number(id);
  const { data: rapport, isLoading, isError, refetch } = useRapport(rapportId);
  const download = useDownloadRapport();

  if (isLoading) return <LoadingSpinner />;
  if (isError || !rapport) return <ErrorState onRetry={() => void refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">{rapport.titre}</h2>
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
          <Button
            disabled={download.isPending}
            onClick={() =>
              download.mutate(rapport.id, {
                onSuccess: () => toast.success('Téléchargement lancé'),
                onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
              })
            }
          >
            Télécharger PDF
          </Button>
        </PermissionGuard>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {formatMoisAnnee(rapport.mois, rapport.annee)} —{' '}
            {formatDateTime(rapport.cree_le)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: rapport.contenu_html }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
