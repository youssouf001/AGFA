import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  message = 'Une erreur est survenue lors du chargement.',
  onRetry,
}: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-destructive">
    <AlertCircle className="mb-3 h-12 w-12" />
    <p className="mb-4 text-sm text-muted-foreground">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        Réessayer
      </Button>
    )}
  </div>
);
