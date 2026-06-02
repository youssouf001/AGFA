import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types';

interface PermissionGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  allowedRoles,
  children,
  fallback = null,
}: PermissionGuardProps) => {
  const { hasRole } = useAuth();
  return hasRole(...allowedRoles) ? <>{children}</> : <>{fallback}</>;
};
