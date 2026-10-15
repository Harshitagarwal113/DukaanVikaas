import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/formatters';

export function LoadingSpinner({
  message = 'Loading...',
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 gap-3', className)}>
      <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      {message && <p className="text-xs sm:text-sm font-medium text-stone-500">{message}</p>}
    </div>
  );
}
