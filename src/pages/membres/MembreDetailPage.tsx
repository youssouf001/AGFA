import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorState } from '@/components/shared/ErrorState';
import { ROLE_LABELS } from '@/constants/roles';
import { useMembre } from '@/hooks/useMembres';
import { formatDate } from '@/utils/formatters';

export default function MembreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const membreId = Number(id);
  const { data: membre, isLoading, isError, refetch } = useMembre(membreId);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !membre) return <ErrorState onRetry={() => void refetch()} />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Fiche membre</h2>
      <Card>
        <CardHeader>
          <CardTitle>{membre.affichage}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <p>Matricule : {membre.matricule}</p>
          <p>
            Rôle : <Badge>{ROLE_LABELS[membre.role]}</Badge>
          </p>
          <p>Email : {membre.email}</p>
          <p>Téléphone : {membre.telephone}</p>
          <p>Adhésion : {formatDate(membre.date_adhesion)}</p>
          <p>Statut : {membre.is_active ? 'Actif' : 'Inactif'}</p>
        </CardContent>
      </Card>
    </div>
  );
}
