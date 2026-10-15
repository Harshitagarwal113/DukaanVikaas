import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils/formatters';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  prefixElement?: ReactNode;
  suffixElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      prefixElement,
      suffixElement,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-semibold text-stone-700"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-stone-500">
              {prefixElement}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[44px]',
              prefixElement ? 'pl-9' : '',
              suffixElement ? 'pr-10' : '',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-stone-300 focus:border-amber-500',
              className
            )}
            {...props}
          />
          {suffixElement && (
            <div className="absolute right-3 flex items-center pointer-events-none text-stone-500">
              {suffixElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-stone-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
