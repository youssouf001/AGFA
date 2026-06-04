// src/components/cards/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return clsx(...classes);
};

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: 'success' | 'danger' | 'warning' | 'default';
  isLoading?: boolean;
  className?: string;
};

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
  isLoading,
  className,
}: StatCardProps) {
  const variants = {
    success: {
      border: 'border-l-green-500',
      text: 'text-green-600',
      bgIcon: 'bg-green-50',
      textIcon: 'text-green-600',
    },
    danger: {
      border: 'border-l-red-500',
      text: 'text-red-600',
      bgIcon: 'bg-red-50',
      textIcon: 'text-red-600',
    },
    warning: {
      border: 'border-l-amber-500',
      text: 'text-amber-600',
      bgIcon: 'bg-amber-50',
      textIcon: 'text-amber-600',
    },
    default: {
      border: 'border-l-slate-300',
      text: 'text-slate-600',
      bgIcon: 'bg-slate-50',
      textIcon: 'text-slate-600',
    },
  };

  const current = variants[variant];

  if (isLoading) {
    return (
      <Card className={cn("p-6 animate-pulse bg-white", className)}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-32 bg-slate-200 rounded" />
          </div>
          <div className="h-10 w-10 bg-slate-200 rounded-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "relative border-l-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        current.border,
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex items-end justify-between h-full">
        <div>
          <div className={cn("text-3xl font-bold tracking-tight", current.text)}>
            {value}
          </div>
        </div>
        
        <div className={cn("p-2.5 rounded-full", current.bgIcon)}>
          <Icon className={cn("h-6 w-6", current.textIcon)} />
        </div>
      </CardContent>
    </Card>
  );
}