import React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../../lib/i18n';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { generateFinancialSnapshotPdf } from '../../lib/pdfReportEngine';
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
  MapPin,
  RefreshCw,
  Download,
} from 'lucide-react';
import { GoogleAdSlot } from '../ads/GoogleAdSlot';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  snapshot?: CompleteFinancialSnapshot;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, snapshot }) => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const city = snapshot?.economic?.cityLabel || snapshot?.inputs?.city || 'Austin';
  const state = snapshot?.inputs?.state || 'TX';

  const handleDownload = () => {
    if (snapshot) {
      generateFinancialSnapshotPdf(snapshot);
    } else {
      window.print();
    }
  };

  const navItems = [
    { id: 'overview', label: t.overview, icon: LayoutDashboard, href: '/dashboard/overview' },
    { id: 'tax-engine', label: t.taxEngine, icon: Calculator, href: '/dashboard/tax-engine' },
    { id: 'rate-analysis', label: t.rateAnalysis, icon: DollarSign, href: '/dashboard/rate-analysis' },
    { id: 'benchmarks', label: t.benchmarks, icon: PieChart, href: '/dashboard/benchmarks' },
    { id: 'housing', label: t.housing, icon: Home, href: '/dashboard/housing' },
    { id: 'fuel-commute', label: t.fuelCommute, icon: Fuel, href: '/dashboard/fuel-commute' },
    { id: 'relocation', label: t.relocation, icon: Compass, href: '/dashboard/relocation' },
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
      <aside className="hidden md:block w-64 shrink-0 bg-white dark:bg-[#101512] border border-[#BFE5D3] dark:border-[#26302A] rounded-3xl p-5 shadow-sm space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold text-[#1F8F68] dark:text-[#22C55E] uppercase tracking-wider mb-2">
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#1F8F68] dark:bg-[#22C55E] text-white shadow-md shadow-[#1F8F68]/20 dark:shadow-none'
                    : 'text-[#12372A] dark:text-[#F9FAFB] hover:bg-[#F3FBF7] dark:hover:bg-[#151C17] hover:text-[#1F8F68] dark:hover:text-[#22C55E]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Generated For & Download Report Card */}
        <div className="bg-[#F3FBF7] dark:bg-[#151C17] border border-[#BFE5D3] dark:border-[#26302A] p-4 rounded-2xl space-y-3 shadow-2xs">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Results generated for</p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#1F8F68] dark:text-[#22C55E]">
              <MapPin className="w-4 h-4 text-[#1F8F68] dark:text-[#22C55E]" />
              <span>{city}, {state}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1">
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • 10:30 AM</span>
              <RefreshCw className="w-3 h-3 text-slate-400 hover:text-[#1F8F68] dark:hover:text-[#22C55E] cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="pt-2 border-t border-[#BFE5D3]/60 dark:border-[#26302A]">
            <button
              onClick={handleDownload}
              className="w-full bg-white dark:bg-[#101512] hover:bg-[#EAF7F1] dark:hover:bg-[#1C251F] border border-[#BFE5D3] dark:border-[#26302A] text-[#12372A] dark:text-[#F9FAFB] text-xs font-bold py-2.5 px-3 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4 text-[#1F8F68] dark:text-[#22C55E]" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-[#BFE5D3]/60 dark:border-[#26302A]">
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
                  ? 'bg-[#1F8F68] dark:bg-[#22C55E] text-white shadow-xs'
                  : 'bg-white dark:bg-[#101512] text-[#12372A] dark:text-[#F9FAFB] border border-[#BFE5D3] dark:border-[#26302A] hover:bg-[#F3FBF7] dark:hover:bg-[#151C17]'
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
