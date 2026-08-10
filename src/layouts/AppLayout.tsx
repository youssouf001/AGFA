import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ROUTES } from '@/constants/routes';
import { Outlet, useLocation } from 'react-router-dom';

export const AppLayout = () => {
  const { pathname } = useLocation();
  const showHeader = pathname !== ROUTES.DASHBOARD;

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        {showHeader && <Header />}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};
