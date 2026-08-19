'use client';

import React from 'react';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Calculator,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface RecruiterSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'search',
      label: 'Candidate Search',
      icon: Search,
    },
    {
      id: 'jobs',
      label: 'Jobs & Pipeline',
      icon: Briefcase,
    },
    {
      id: 'rate',
      label: 'Rate & Margin',
      icon: Calculator,
    },
    {
      id: 'reports',
      label: 'Reports & PDF',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-white border-r border-slate-100 p-4 min-h-[calc(100vh-5rem)] flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3.5 py-2 mb-1">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">
            PayScope Recruit Workspace
          </span>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-center">
        <div className="w-9 h-9 mx-auto bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-800">Recruiter Workspace</p>
          <p className="text-[11px] text-slate-500 leading-snug">Google-simple, recruiter-powerful.</p>
        </div>
      </div>
    </aside>
  );
};
