import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ROLE_LABELS } from '@/constants/roles';
import { useMembre } from '@/hooks/useMembres';
import { formatDate } from '@/utils/formatters';
import { Calendar, Mail, Phone, Shield, User } from 'lucide-react';

interface MembreDetailContentProps {
  id: number;
  onSuccess?: () => void;
}

export default function MembreDetailPage({ id }: MembreDetailContentProps) {
  const { data: membre, isLoading, isError, refetch } = useMembre(id);

  if (isLoading) return <div className="py-8 text-center"><LoadingSpinner /></div>;
  if (isError || !membre) return <div className="py-8 text-center"><ErrorState onRetry={() => void refetch()} /></div>;

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
          <User className="h-8 w-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-[#0A192F] truncate">
              {membre?.first_name} {membre?.last_name}
          </h3>
          <p className="text-sm text-muted-foreground font-mono truncate">
            {membre.matricule}
          </p>
        </div>
      </div>

      {/* Carte de détails */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6 space-y-4">
          {/* Première ligne : Email et Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Email
              </p>
              <div className="text-sm font-medium break-all leading-relaxed">
                {membre.email}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Téléphone
              </p>
              <p className="text-sm font-medium truncate">
                {membre.telephone}
              </p>
            </div>
          </div>
          
          {/* Deuxième ligne : Rôle et Adhésion (déjà géré, mais renforcement) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Rôle
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="break-normal">
                  {ROLE_LABELS[membre.role]}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Adhésion
              </p>
              <p className="text-sm font-medium truncate">
                {formatDate(membre.date_adhesion)}
              </p>
            </div>
          </div>

          {/* Statut */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Statut
            </p>
            <div className="mt-1">
              <Badge variant={membre.is_active ? "outline" : "destructive"}>
                {membre.is_active ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}