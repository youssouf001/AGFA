import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState = ({ message = 'Aucune donnée disponible' }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
    <Inbox className="mb-3 h-12 w-12 opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);
