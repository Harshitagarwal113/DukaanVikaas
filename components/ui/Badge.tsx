import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/formatters';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'demo';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
    danger: 'bg-rose-50 text-rose-800 border-rose-200 font-semibold',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    demo: 'bg-stone-200 text-stone-800 border-stone-300 font-medium',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border leading-none tracking-wide select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
