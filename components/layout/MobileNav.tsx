'use client';

import React from 'react';
import { LayoutDashboard, Boxes, AlertTriangle, Receipt, Settings } from 'lucide-react';
import { ViewTab } from '@/types';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils/formatters';

interface MobileNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  lowStockCount?: number;
}

export function MobileNav({
  currentTab,
  onSelectTab,
  lowStockCount = 0,
}: MobileNavProps) {
  const { t } = useLanguage();

  const items = [
    {
      id: 'dashboard' as ViewTab,
      label: t.navDashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'inventory' as ViewTab,
      label: t.navInventory,
      icon: Boxes,
    },
    {
      id: 'low-stock' as ViewTab,
      label: t.navLowStock,
      icon: AlertTriangle,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
    },
    {
      id: 'sales' as ViewTab,
      label: t.navSales,
      icon: Receipt,
    },
    {
      id: 'settings' as ViewTab,
      label: t.navSettings,
      icon: Settings,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-1.5 py-1 shadow-sm"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all min-h-[50px]',
                isActive
                  ? 'text-emerald-900 font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform',
                    isActive ? 'scale-105 text-emerald-800' : 'text-stone-500'
                  )}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none truncate max-w-[58px]">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-4 h-0.5 bg-emerald-800 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
