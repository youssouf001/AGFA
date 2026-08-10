import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useParametres } from '@/hooks/useParametres';
import { cn } from '@/lib/utils';
import {
  Activity,
  AlertTriangle,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingDown,
  User,
  Users,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent',
  );

export const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: parametres } = useParametres();

  const handleLogout = () => {
    logout();
    void navigate(ROUTES.LOGIN);
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary-900">AGFA</h2>
        <p className="text-xs text-muted-foreground">{parametres?.nom_amicale ?? 'Amicale'}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        <NavLink to={ROUTES.DASHBOARD} className={navLinkClass} end>
          <LayoutDashboard className="h-4 w-4" /> Tableau de bord
        </NavLink>
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
          <NavLink to={ROUTES.MEMBRES} className={navLinkClass}>
            <Users className="h-4 w-4" /> Membres
          </NavLink>
        </PermissionGuard>
        <NavLink to={ROUTES.PAIEMENTS} className={navLinkClass}>
          <CreditCard className="h-4 w-4" /> Paiements
        </NavLink>
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR, ROLES.AD]}>
          <NavLink to={ROUTES.DEPENSES} className={navLinkClass}>
            <TrendingDown className="h-4 w-4" /> Dépenses
          </NavLink>
        </PermissionGuard>
        <NavLink to={ROUTES.ARRIERES} className={navLinkClass}>
          <AlertTriangle className="h-4 w-4" /> Arriérés
        </NavLink>
        <NavLink to={ROUTES.RAPPORTS} className={navLinkClass}>
          <FileText className="h-4 w-4" /> Rapports
        </NavLink>
        <PermissionGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
          <NavLink to={ROUTES.PARAMETRES} className={navLinkClass}>
            <Settings className="h-4 w-4" /> Paramètres
          </NavLink>
          <NavLink to={ROUTES.LOGS} className={navLinkClass}>
            <Activity className="h-4 w-4" /> Logs
          </NavLink>
        </PermissionGuard>
        <NavLink to={ROUTES.PROFIL} className={navLinkClass}>
          <User className="h-4 w-4" /> Mon profil
        </NavLink>
      </nav>
      <div className="p-3">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Déconnexion
        </Button>
      </div>
    </aside>
  );
};
