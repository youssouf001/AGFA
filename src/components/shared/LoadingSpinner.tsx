import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner = ({ fullScreen, className }: LoadingSpinnerProps) => (
  <div
    className={cn(
      'flex items-center justify-center',
      fullScreen && 'min-h-screen w-full',
      className,
    )}
  >
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);
