import React, { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils/formatters';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/50',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
