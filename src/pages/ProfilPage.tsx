// src/pages/ProfilPage.tsx

import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ROLE_LABELS } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { usePaiements } from '@/hooks/usePaiements';
import { formatDate, formatMoisAnnee } from '@/utils/formatters';
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Hash,
  Mail,
  Phone,
  ShieldCheck,
  XCircle
} from 'lucide-react';

const ROLE_BADGE_STYLE: Record<string, string> = {
  PR: 'bg-blue-50 text-blue-700 border-blue-200',
  TR: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  AD: 'bg-violet-50 text-violet-700 border-violet-200',
  ME: 'bg-slate-100 text-slate-600 border-slate-200',
};

const ROLE_AVATAR_BG: Record<string, string> = {
  PR: 'bg-blue-700',
  TR: 'bg-emerald-600',
  AD: 'bg-violet-600',
  ME: 'bg-slate-500',
};

const getInitiales = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0">
      {icon}
    </div>
    <div className="flex flex-1 items-center justify-between min-w-0">
      <span className="text-[12.5px] text-muted-foreground">{label}</span>
      <div className="text-[13px] font-medium text-foreground text-right">{value}</div>
    </div>
  </div>
);

export default function ProfilPage() {
  const { user } = useAuth();
  const { data: paiements, isLoading } = usePaiements(1, 20);

  if (!user) return <LoadingSpinner />;

  const mesPaiements =
    paiements?.results.filter((p) => p.membre.id === user.id) ?? [];

  const initiales = getInitiales(user.first_name, user.last_name);
  const avatarBg = ROLE_AVATAR_BG[user.role] ?? 'bg-blue-700';
  const badgeStyle = ROLE_BADGE_STYLE[user.role] ?? 'bg-slate-100 text-slate-600';

  const totalValides = mesPaiements.filter((p) => p.statut === 'Valide').length;
  const totalEnAttente = mesPaiements.filter((p) => p.statut === 'En attente').length;

  return (
    <div className="mx-auto max-w-2xl space-y-5">

      {/* ── En-tête profil ─────────────────────────────────────────── */}
      <Card className="overflow-hidden border-border/60">
        {/* Bandeau coloré en haut */}
        <div className={`h-24 w-full ${avatarBg} opacity-10 absolute`} />
        <div className={`h-1.5 w-full ${avatarBg}`} />

        <CardContent className="pt-5 pb-5 px-6">
          <div className="flex items-center gap-4">
            {/* Avatar grand */}
            <div
              className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-semibold text-white flex-shrink-0 shadow-sm ${avatarBg}`}
            >
              {initiales}
            </div>

            {/* Identité */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground leading-tight truncate">
                {user.affichage}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                #{user.matricule}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={`text-[11px] font-medium px-2 py-0.5 ${badgeStyle}`}
                >
                  {ROLE_LABELS[user.role] ?? user.role}
                </Badge>
                <span
                  className={`flex items-center gap-1 text-[11px] font-medium ${
                    user.is_active ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {user.is_active ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {user.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Informations personnelles ───────────────────────────────── */}
      <Card className="border-border/60">
        <CardContent className="px-6 pt-5 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Informations personnelles
          </p>

          <InfoRow
            icon={<Hash className="h-4 w-4 text-muted-foreground" />}
            label="Matricule"
            value={user.matricule}
          />
          <InfoRow
            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
            label="Email"
            value={
              <span className="truncate max-w-[180px] block">{user.email}</span>
            }
          />
          <InfoRow
            icon={<Phone className="h-4 w-4 text-muted-foreground" />}
            label="Téléphone"
            value={user.telephone || '—'}
          />
          <InfoRow
            icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
            label="Date d'adhésion"
            value={formatDate(user.date_adhesion)}
          />
          <InfoRow
            icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
            label="Rôle"
            value={
              <Badge
                variant="outline"
                className={`text-[11px] font-medium px-2 py-0.5 ${badgeStyle}`}
              >
                {ROLE_LABELS[user.role] ?? user.role}
              </Badge>
            }
          />
        </CardContent>
      </Card>

      {/* ── Résumé paiements ────────────────────────────────────────── */}
      {!isLoading && mesPaiements.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: mesPaiements.length, color: 'text-foreground' },
            { label: 'Validés', value: totalValides, color: 'text-emerald-600' },
            { label: 'En attente', value: totalEnAttente, color: 'text-amber-600' },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60">
              <CardContent className="px-4 py-3 text-center">
                <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Liste paiements ─────────────────────────────────────────── */}
      <Card className="border-border/60">
        <CardContent className="px-6 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mes paiements
            </p>
            {mesPaiements.length > 0 && (
              <span className="text-[11px] text-muted-foreground">
                {mesPaiements.length} enregistrement{mesPaiements.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          )}

          {!isLoading && mesPaiements.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Aucun paiement enregistré.</p>
            </div>
          )}

          {!isLoading && mesPaiements.length > 0 && (
            <ul className="space-y-2">
              {mesPaiements.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-sm hover:bg-muted/60 transition-colors"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-foreground text-[13px]">
                      {p.type}
                    </span>
                    <span className="text-[11.5px] text-muted-foreground">
                      {formatMoisAnnee(p.mois_concerne, p.annee_concernee)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-semibold text-foreground">
                      {p.montant_fcfa}
                    </span>
                    <StatusBadge status={p.statut} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}