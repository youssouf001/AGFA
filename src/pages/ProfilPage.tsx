import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ROLE_LABELS } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { usePaiements } from '@/hooks/usePaiements';
import { formatDate, formatMoisAnnee } from '@/utils/formatters';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ProfilPage() {
  const { user } = useAuth();
  const { data: paiements, isLoading } = usePaiements(1, 20);

  if (!user) return <LoadingSpinner />;

  const mesPaiements =
    paiements?.results.filter((p) => p.membre.id === user.id) ?? [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mon profil</h2>

      <Card>
        <CardHeader>
          <CardTitle>{user.affichage}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Matricule :</span> {user.matricule}
          </p>
          <p>
            <span className="text-muted-foreground">Rôle :</span>{' '}
            <Badge>{ROLE_LABELS[user.role]}</Badge>
          </p>
          <p>
            <span className="text-muted-foreground">Email :</span> {user.email}
          </p>
          <p>
            <span className="text-muted-foreground">Téléphone :</span> {user.telephone}
          </p>
          <p>
            <span className="text-muted-foreground">Adhésion :</span>{' '}
            {formatDate(user.date_adhesion)}
          </p>
          <p>
            <span className="text-muted-foreground">Statut :</span>{' '}
            {user.is_active ? 'Actif' : 'Inactif'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mes paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSpinner />}
          {mesPaiements.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground">Aucun paiement enregistré.</p>
          )}
          <ul className="space-y-2">
            {mesPaiements.map((p) => (
              <li key={p.id} className="flex justify-between border-b py-2 text-sm">
                <span>
                  {p.type} — {formatMoisAnnee(p.mois_concerne, p.annee_concernee)}
                </span>
                <span className="flex items-center gap-2">
                  {p.montant_fcfa}
                  <StatusBadge status={p.statut} />
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
