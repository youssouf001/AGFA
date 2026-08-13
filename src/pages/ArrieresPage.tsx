import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useArrieres } from '@/hooks/useArrieres';
import { cn } from '@/lib/utils';
import { AlertCircle, Calendar, DollarSign, Search, User } from 'lucide-react';
import { useMemo, useState } from 'react';

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
  <div className="flex flex-col gap-2">
    <h2 className="text-2xl font-bold text-[#0A192F]">Arriérés de paiement</h2>
    <p className="text-sm text-muted-foreground">
      Suivi des membres en retard de paiement
    </p>
  </div>

  {/* Barre de recherche stylisée */}
  <div className="relative max-w-md">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      placeholder="Rechercher par nom ou matricule..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-10 h-11 border-slate-200 focus:border-[#10B981] focus:ring-[#10B981]/20 shadow-sm"
    />
  </div>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {sorted.map((a) => (
      <Card
        key={a.matricule}
        className={cn(
          "relative overflow-hidden transition-all duration-300 hover:shadow-md group",
          a.status_rouge 
            ? "border-l-4 border-l-danger-500 bg-danger-50/50 hover:shadow-danger-100" 
            : "border-slate-200 hover:shadow-slate-200/50"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-[#0A192F] flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                {a.membre}
              </CardTitle>
              <div className="mt-1">
                <Badge variant="outline" className="text-xs font-mono bg-slate-50">
                  {a.matricule}
                </Badge>
              </div>
            </div>
            {a.status_rouge && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger-100 text-danger-600">
                <AlertCircle className="h-4 w-4" />
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="grid gap-3 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Retard</span>
            </div>
            <span className="font-semibold text-slate-700">
              {a.nb_mois_retard} mois
            </span>
          </div>
          
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Arriéré</span>
            </div>
            <span className={cn(
              "font-bold",
              a.status_rouge ? "text-danger-600" : "text-slate-700"
            )}>
              {a.montant_arriere} FCFA
            </span>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>

  {sorted.length === 0 && (
    <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
        <Search className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-slate-600">Aucun arriéré trouvé</p>
      <p className="text-xs text-muted-foreground mt-1">
        Les membres à jour de leurs paiements ne sont pas affichés ici.
      </p>
    </div>
  )}
</div>
  );
}
