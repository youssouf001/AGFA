import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useArrieres } from '@/hooks/useArrieres';
import { formatMontantFCFA } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export default function ArrieresPage() {
  const { data, isLoading, isError, refetch } = useArrieres();
  const [search, setSearch] = useState('');

  const sorted = useMemo(() => {
    const list = [...(data ?? [])].sort((a, b) => b.nb_mois_retard - a.nb_mois_retard);
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (a) =>
        a.membre.toLowerCase().includes(q) || a.matricule.toLowerCase().includes(q),
    );
  }, [data, search]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState onRetry={() => void refetch()} />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Arriérés</h2>
      <Input
        placeholder="Rechercher par nom ou matricule..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((a) => (
          <Card
            key={a.matricule}
            className={cn(a.status_rouge && 'border-danger-500 bg-danger-500/5')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{a.membre}</CardTitle>
              <p className="text-sm text-muted-foreground">{a.matricule}</p>
            </CardHeader>
            <CardContent className="grid gap-1 text-sm">
              <p>Mois de retard : <strong>{a.nb_mois_retard}</strong></p>
              <p>Montant arriéré : <strong>{formatMontantFCFA(a.montant_arriere)}</strong></p>
              <p className="text-muted-foreground">{a.email}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {sorted.length === 0 && (
        <p className="text-center text-muted-foreground">Aucun arriéré trouvé.</p>
      )}
    </div>
  );
}
