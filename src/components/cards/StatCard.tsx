import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  isLoading?: boolean;
}

const variantClasses = {
  default: 'text-primary',
  success: 'text-success-600',
  danger: 'text-danger-600',
  warning: 'text-warning-600',
};

export const StatCard = ({
  title,
  value,
  icon: Icon,
  variant = 'default',
  isLoading,
}: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={cn('h-5 w-5', variantClasses[variant])} />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-32" />
      ) : (
        <p className={cn('text-2xl font-bold', variantClasses[variant])}>{value}</p>
      )}
    </CardContent>
  </Card>
);
