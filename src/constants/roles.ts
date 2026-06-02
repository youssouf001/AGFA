export const ROLES = {
  PR: 'PR',
  TR: 'TR',
  AD: 'AD',
  ME: 'ME',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  PR: 'Président',
  TR: 'Trésorier',
  AD: 'Adjointe',
  ME: 'Membre',
};

export const ADMIN_ROLES = [ROLES.PR, ROLES.TR] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];
