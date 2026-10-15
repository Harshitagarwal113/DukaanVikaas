'use client';

import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  AlertTriangle,
  Receipt,
  Settings,
  ShieldCheck,
  Wheat,
} from 'lucide-react';
import { ViewTab } from '@/types';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils/formatters';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  lowStockCount?: number;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  lowStockCount = 0,
}: SidebarProps) {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'dashboard' as ViewTab,
      label: t.navDashboard,
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'inventory' as ViewTab,
      label: t.navInventory,
      icon: Boxes,
      badge: undefined,
    },
    {
      id: 'low-stock' as ViewTab,
      label: t.navLowStock,
      icon: AlertTriangle,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'sales' as ViewTab,
      label: t.navSales,
      icon: Receipt,
      badge: undefined,
    },
    {
      id: 'settings' as ViewTab,
      label: t.navSettings,
      icon: Settings,
      badge: undefined,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-stone-200 bg-stone-50/70 p-4 shrink-0 min-h-[calc(100vh-65px)] justify-between select-none">
      <div className="space-y-6">
        {/* App Title & Kirana Emblem */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
            <Wheat className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight leading-none">
              {t.appName}
            </h2>
            <p className="text-[11px] text-stone-500 font-medium mt-1 leading-tight">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all text-left min-h-[46px]',
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'text-stone-700 hover:bg-stone-200/60 hover:text-stone-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0',
                      isActive ? 'text-white' : 'text-stone-500'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border leading-tight',
                      isActive
                        ? 'bg-emerald-900 text-white border-emerald-700'
                        : item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info: Offline Storage Guarantee */}
      <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Local Device Storage</span>
        </div>
        <p className="text-[11px] text-stone-500 leading-relaxed">
          Data is saved inside your browser. No internet needed to bill or manage stock.
        </p>
      </div>
    </aside>
  );
}
