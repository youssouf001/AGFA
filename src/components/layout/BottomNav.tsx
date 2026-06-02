import { CreditCard, FileText, LayoutDashboard, TrendingDown, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import { cn } from '@/lib/utils';

const itemClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex flex-1 flex-col items-center gap-1 py-2 text-xs',
    isActive ? 'text-primary font-semibold' : 'text-muted-foreground',
  );

export const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-card md:hidden">
    <NavLink to={ROUTES.DASHBOARD} className={itemClass} end>
      <LayoutDashboard className="h-5 w-5" />
      Accueil
    </NavLink>
    <NavLink to={ROUTES.PAIEMENTS} className={itemClass}>
      <CreditCard className="h-5 w-5" />
      Paiements
    </NavLink>
    <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD]}>
      <NavLink to={ROUTES.DEPENSES} className={itemClass}>
        <TrendingDown className="h-5 w-5" />
        Dépenses
      </NavLink>
    </PermissionGuard>
    <NavLink to={ROUTES.RAPPORTS} className={itemClass}>
      <FileText className="h-5 w-5" />
      Rapports
    </NavLink>
    <NavLink to={ROUTES.PROFIL} className={itemClass}>
      <User className="h-5 w-5" />
      Profil
    </NavLink>
  </nav>
);
