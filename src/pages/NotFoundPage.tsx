import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-lg text-muted-foreground">Page introuvable</p>
      <Button asChild>
        <Link to={ROUTES.DASHBOARD}>Retour au tableau de bord</Link>
      </Button>
    </div>
  );
}
