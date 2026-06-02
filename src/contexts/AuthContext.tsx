import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { tokenStorage } from '@/api/axiosClient';
import { authService } from '@/services/authService';
import { membreService } from '@/services/membreService';
import type { LoginPayload, Role, User } from '@/types';
import { parseJwt } from '@/utils/tokenUtils';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: Role | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenStorage.getAccess();
      if (!accessToken) {
        setIsLoading(false);
        return;
      }
      try {
        const payload = parseJwt(accessToken);
        if (!payload.user_id) throw new Error('Invalid token');
        const userData = await membreService.getById(payload.user_id as number);
        setUser(userData);
      } catch {
        tokenStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    void initAuth();

    const handleForceLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const tokens = await authService.login(payload);
    const jwtPayload = parseJwt(tokens.access);
    const userData = await membreService.getById(jwtPayload.user_id as number);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: Role[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        role: user?.role ?? null,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
};
