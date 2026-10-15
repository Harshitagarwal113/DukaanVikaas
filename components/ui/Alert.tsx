import React, { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils/formatters';

export interface AlertProps {
  variant?: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Alert({
  variant = 'info',
  title,
  children,
  className,
}: AlertProps) {
  const configs = {
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    },
    danger: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    },
  };

  const current = configs[variant];

  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border p-4 flex gap-3 text-sm transition-all',
        current.bg,
        className
      )}
    >
      {current.icon}
      <div className="space-y-1 flex-1">
        {title && <h4 className="font-bold leading-tight">{title}</h4>}
        <div className="text-xs sm:text-sm opacity-90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
