// src/components/layout/Header.tsx

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROLE_LABELS } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useParametres } from '@/hooks/useParametres';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getInitiales = (firstName: string, lastName: string): string =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const getPrenom = (firstName: string): string =>
  firstName.split(' ')[0];

const ROLE_AVATAR_BG: Record<string, string> = {
  PR: 'bg-blue-700',
  TR: 'bg-emerald-600',
  AD: 'bg-violet-600',
  ME: 'bg-slate-500',
};

const ROLE_BADGE_STYLE: Record<string, string> = {
  PR: 'bg-blue-50 text-blue-700',
  TR: 'bg-emerald-50 text-emerald-700',
  AD: 'bg-violet-50 text-violet-700',
  ME: 'bg-slate-100 text-slate-600',
};

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const notifCount = 0;
  const { data: parametres } = useParametres();

  if (!user) return null;

  const initiales = getInitiales(user.first_name, user.last_name);
  const prenomCourt = `${getPrenom(user.first_name)} ${user.last_name.charAt(0)}.`;
  const avatarBg = ROLE_AVATAR_BG[user.role] ?? 'bg-blue-700';
  const badgeStyle = ROLE_BADGE_STYLE[user.role] ?? 'bg-slate-100 text-slate-600';
  const handleProfil = () => navigate(ROUTES.PROFIL);
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:px-6">

      {/* ── Gauche : Nom de l'amicale ──────────────────────────── */}
      <div className="flex flex-col leading-tight">
       {parametres?.nom_amicale ?? 'Amicale'}
      </div>

      {/* ── Droite : notifications + avatar ───────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Cloche notifications */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative h-8 w-8 rounded-full border border-border/60 bg-muted/40 hover:bg-muted"
        >
          <Bell className="h-[15px] w-[15px] text-muted-foreground" />
          {notifCount > 0 && (
            <span className="absolute top-1 right-1 flex h-[7px] w-[7px] rounded-full bg-red-500 ring-[1.5px] ring-card" />
          )}
        </Button>

        {/* Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Menu profil"
              className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 hover:bg-muted pl-1 pr-2.5 py-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Cercle initiales */}
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0 ${avatarBg}`}
              >
                {initiales}
              </div>

              {/* Nom + rôle — masqués sur mobile */}
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-[12.5px] font-medium text-foreground">
                  {prenomCourt}
                </span>
                <span
                  className={`text-[10.5px] font-medium px-1.5 py-0 rounded-full leading-[1.6] ${badgeStyle}`}
                >
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
              </div>

              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 bg-white">
            {/* Identité complète */}
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-[13px] font-semibold text-white flex-shrink-0 ${avatarBg}`}
                >
                  {initiales}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold leading-none truncate text-gray-700">
                    {user.first_name} {user.last_name}
                  </p>
                  <span
                    className={`mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full w-fit ${badgeStyle}`}
                  >
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" onSelect={handleProfil}>
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onSelect={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
};