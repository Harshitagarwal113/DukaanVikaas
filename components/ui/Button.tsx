import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/formatters';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary:
        'bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white shadow-xs focus:ring-emerald-700',
      secondary:
        'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 focus:ring-stone-400',
      outline:
        'bg-transparent hover:bg-emerald-50 text-emerald-850 border border-emerald-300 focus:ring-emerald-700',
      danger:
        'bg-rose-700 hover:bg-rose-800 text-white shadow-xs focus:ring-rose-600',
      success:
        'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs focus:ring-emerald-600',
      ghost:
        'bg-transparent hover:bg-stone-100 text-stone-700 hover:text-stone-900 focus:ring-stone-400',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5',
      md: 'text-sm px-4 py-2.5 min-h-[44px] gap-2',
      lg: 'text-base px-6 py-3 min-h-[50px] gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
