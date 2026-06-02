import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

const wrap = (Component: ComponentType) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    <Component />
  </Suspense>
);

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfilPage = lazy(() => import('@/pages/ProfilPage'));
const MembresPage = lazy(() => import('@/pages/membres/MembresPage'));
const MembreDetailPage = lazy(() => import('@/pages/membres/MembreDetailPage'));
const MembreCreationPage = lazy(() => import('@/pages/membres/MembreCreationPage'));
const PaiementsPage = lazy(() => import('@/pages/paiements/PaiementsPage'));
const PaiementCreationPage = lazy(() => import('@/pages/paiements/PaiementCreationPage'));
const PaiementWavePage = lazy(() => import('@/pages/paiements/PaiementWavePage'));
const DepensesPage = lazy(() => import('@/pages/depenses/DepensesPage'));
const DepenseCreationPage = lazy(() => import('@/pages/depenses/DepenseCreationPage'));
const ParametresPage = lazy(() => import('@/pages/ParametresPage'));
const LogsPage = lazy(() => import('@/pages/LogsPage'));
const RapportsPage = lazy(() => import('@/pages/rapports/RapportsPage'));
const RapportDetailPage = lazy(() => import('@/pages/rapports/RapportDetailPage'));
const ArrieresPage = lazy(() => import('@/pages/ArrieresPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <AuthLayout />,
    children: [{ index: true, element: wrap(LoginPage) }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: wrap(DashboardPage) },
          { path: ROUTES.PROFIL, element: wrap(ProfilPage) },
          {
            path: ROUTES.MEMBRES,
            element: (
              <RoleGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
                {wrap(MembresPage)}
              </RoleGuard>
            ),
          },
          {
            path: ROUTES.MEMBRE_CREATION,
            element: (
              <RoleGuard allowedRoles={[ROLES.PR]}>
                {wrap(MembreCreationPage)}
              </RoleGuard>
            ),
          },
          { path: ROUTES.MEMBRE_DETAIL, element: wrap(MembreDetailPage) },
          { path: ROUTES.PAIEMENTS, element: wrap(PaiementsPage) },
          { path: ROUTES.PAIEMENT_CREATION, element: wrap(PaiementCreationPage) },
          { path: ROUTES.PAIEMENT_WAVE, element: wrap(PaiementWavePage) },
          { path: ROUTES.DEPENSES, element: wrap(DepensesPage) },
          {
            path: ROUTES.DEPENSE_CREATION,
            element: (
              <RoleGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
                {wrap(DepenseCreationPage)}
              </RoleGuard>
            ),
          },
          {
            path: ROUTES.PARAMETRES,
            element: (
              <RoleGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
                {wrap(ParametresPage)}
              </RoleGuard>
            ),
          },
          {
            path: ROUTES.LOGS,
            element: (
              <RoleGuard allowedRoles={[ROLES.PR, ROLES.TR]}>
                {wrap(LogsPage)}
              </RoleGuard>
            ),
          },
          { path: ROUTES.RAPPORTS, element: wrap(RapportsPage) },
          { path: ROUTES.RAPPORT_DETAIL, element: wrap(RapportDetailPage) },
          { path: ROUTES.ARRIERES, element: wrap(ArrieresPage) },
        ],
      },
    ],
  },
  { path: ROUTES.NOT_FOUND, element: wrap(NotFoundPage) },
]);
