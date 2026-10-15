import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/formatters';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs sm:text-sm font-semibold text-stone-700"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-stone-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[44px]',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
              : 'border-stone-300 focus:border-amber-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
        {helperText && !error && <p className="text-xs text-stone-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
