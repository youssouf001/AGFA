import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/constants/roles';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:px-6">
      <div>
        <h1 className="text-lg font-bold text-primary-900">AGFA</h1>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Gestion financière CERTT-UADB
        </p>
      </div>
      {user && (
        <div className="text-right">
          <p className="text-sm font-medium">{user.affichage}</p>
          <Badge variant="secondary" className="text-xs">
            {ROLE_LABELS[user.role] ?? user.role}
          </Badge>
        </div>
      )}
    </header>
  );
};
