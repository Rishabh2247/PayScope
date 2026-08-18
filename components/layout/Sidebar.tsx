'use client';

import React from 'react';
import {
  BarChart3,
  Building2,
  Calculator,
  ChevronRight,
  DollarSign,
  Fuel,
  Home,
  FileText,
  Settings,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, badge: null },
    { id: 'taxes', label: 'Income & Taxes', icon: DollarSign, badge: null },
    { id: 'col', label: 'Cost of Living', icon: Building2, badge: null },
    { id: 'housing', label: 'Housing', icon: Home, badge: 'NEW' },
    { id: 'inflation', label: 'Inflation & Power', icon: TrendingUp, badge: null },
    { id: 'commute', label: 'Fuel & Commute', icon: Fuel, badge: null },
    { id: 'reports', label: 'Reports', icon: FileText, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-white border-r border-slate-100 p-4 min-h-[calc(100vh-5rem)] flex flex-col justify-between">
      {/* Top Menu Links */}
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Promo Card */}
      <div className="mt-8 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 text-center">
        <div className="w-12 h-12 mx-auto bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-800">All calculations</p>
          <p className="text-[11px] text-slate-500 leading-snug">
            are estimates based on the latest available data.
          </p>
        </div>
        <button
          onClick={() => alert('PayScope combines government census, tax engines, and live market APIs to compute your personal snapshot.')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <span>Learn more</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
