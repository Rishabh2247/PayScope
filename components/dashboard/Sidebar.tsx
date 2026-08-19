'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calculator,
  DollarSign,
  PieChart,
  Home,
  Fuel,
  Compass,
  FileText,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { GoogleAdSlot } from '../ads/GoogleAdSlot';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const pathname = usePathname();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/dashboard/overview' },
    { id: 'tax-engine', label: 'Tax Engine', icon: Calculator, href: '/dashboard/tax-engine' },
    { id: 'rate-analysis', label: 'Rate Analysis', icon: DollarSign, href: '/dashboard/rate-analysis' },
    { id: 'benchmarks', label: 'Benchmarks', icon: PieChart, href: '/dashboard/benchmarks' },
    { id: 'housing', label: 'Housing', icon: Home, href: '/dashboard/housing' },
    { id: 'fuel-commute', label: 'Fuel & Commute', icon: Fuel, href: '/dashboard/fuel-commute' },
    { id: 'relocation', label: 'Relocation', icon: Compass, href: '/dashboard/relocation' },
  ];

  const secondaryItems = [
    { label: 'Reports', icon: FileText },
    { label: 'Support', icon: HelpCircle },
    { label: 'Settings', icon: Settings },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    if (activeTab) {
      return activeTab === item.id;
    }
    return pathname === item.href || (pathname === '/' && item.id === 'overview');
  };

  return (
    <>
      {/* Desktop Vertical Sidebar (>= 768px) */}
      <aside className="hidden md:block w-64 shrink-0 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            DASHBOARD
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onTabChange) {
                    onTabChange(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-1 pt-3 border-t border-slate-100">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Tools & Help
          </p>
          {secondaryItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100">
          <GoogleAdSlot type="rectangle" adSlotId="sidebar-ad-01" className="my-0" />
        </div>
      </aside>

      {/* Mobile Horizontal Scrollable Tab Bar (< 768px) */}
      <div className="md:hidden w-full overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);
          return (
            <button
              key={item.id}
              onClick={() => {
                if (onTabChange) {
                  onTabChange(item.id);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
