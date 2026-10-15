'use client';

import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/formatters';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white shadow-2xl border border-stone-200 z-10 transition-all flex flex-col max-h-[90vh]',
          maxWidths[maxWidth]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 p-4 sm:p-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
              {title}
            </h2>
            {description && (
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-stone-100 bg-stone-50 p-4 sm:p-5 rounded-b-2xl flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
