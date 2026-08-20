'use client';

import React from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, formatPercent, isContractorRole } from '../../lib/formatters';
import { useTranslation } from '../../lib/i18n';
import {
  Wallet,
  Calendar,
  Clock,
  TrendingUp,
  Flame,
  Home,
  Fuel,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

import { AnimatedCounter } from '../ui/AnimatedCounter';

interface SnapshotCardProps {
  snapshot: CompleteFinancialSnapshot;
  onExploreDashboard: () => void;
}

export const SnapshotCard: React.FC<SnapshotCardProps> = ({ snapshot, onExploreDashboard }) => {
  const { t } = useTranslation();
  const { tax, economic, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);

  const billableHours = (inputs.workHoursPerWeek || 40) * (inputs.weeksPerYear || 52);
  const beforeTaxHourly = isContractor ? (inputs.incomeRate || 60) : (inputs.incomeRate > 1000 ? inputs.incomeRate / billableHours : (inputs.annualSalary || 120000) / billableHours);
  const afterTaxHourly = tax.contractNetHourlyRate || (billableHours > 0 ? tax.takeHomePayAnnual / billableHours : 0);

  const monthlyGross = isContractor ? (tax.monthlyContractRevenue || (inputs.incomeRate * inputs.workHoursPerWeek * inputs.weeksPerYear / 12)) : (tax.grossIncome / 12);
  const monthlyNet = tax.takeHomePayMonthly;

  const yearlyGross = isContractor ? (tax.annualContractRevenue || inputs.annualSalary) : (tax.grossIncome || inputs.annualSalary);
  const yearlyNet = tax.takeHomePayAnnual;

  const effectiveRate = tax.effectiveTaxRate || 22.8;

  return (
    <div className="bg-[#12372A] text-white rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col justify-between h-full min-h-[380px] relative overflow-hidden border border-[#BFE5D3]/30 animate-fade-in">
      {/* Glow background accent */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#1F8F68]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 bg-[#176F52]/80 border border-[#BFE5D3]/40 rounded-full px-3 py-1 text-xs font-bold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#198754] animate-pulse" />
            <span>⚡ {t.liveInstantEstimate}</span>
          </div>
          <span className="text-[10px] font-bold text-[#BFE5D3] uppercase tracking-wider bg-[#176F52]/50 px-2 py-0.5 rounded-md">
            {isContractor ? t.contractorTaxMode : t.employeeMode}
          </span>
        </div>

        {/* Primary Take-Home Highlight with Animated Counter */}
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-[#BFE5D3]">{t.estimatedMonthlyTakeHome}</p>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            <AnimatedCounter
              value={monthlyNet}
              formatter={(val) => formatCurrency(val, inputs.currency)}
            />
          </div>
          <p className="text-xs text-[#EAF7F1]/80 font-medium pt-0.5">
            <AnimatedCounter
              value={effectiveRate}
              decimals={1}
              formatter={(val) => formatPercent(val)}
            /> {t.effectiveTaxRate}
          </p>
        </div>
      </div>

      {/* Detailed Before vs After Tax Matrix Cards */}
      <div className="my-4 space-y-2">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#BFE5D3]">
          {isContractor ? t.contractorIncomeBreakdown : t.salaryTakeHomeBreakdown}
        </p>

        <div className="grid grid-cols-1 gap-2 text-xs">
          {/* Hourly Before & After (Highlight for Contractor Roles) */}
          {isContractor && (
            <div className="bg-[#176F52]/50 border border-[#BFE5D3]/30 rounded-2xl p-2.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#BFE5D3] uppercase tracking-wider block">⏱️ {t.hourlyRateLabel}</span>
                <span className="text-xs font-medium text-white/80">
                  {t.beforeTax}: <strong className="text-white"><AnimatedCounter value={beforeTaxHourly} formatter={(val) => `${formatCurrency(val, inputs.currency)}/hr`} /></strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#198754] bg-[#EAF7F1] px-1.5 py-0.5 rounded uppercase block">{t.afterTaxNet}</span>
                <span className="text-sm font-black text-white">
                  <AnimatedCounter value={afterTaxHourly} formatter={(val) => `${formatCurrency(val, inputs.currency)}/hr`} />
                </span>
              </div>
            </div>
          )}

          {/* Monthly Before & After */}
          <div className="bg-[#176F52]/50 border border-[#BFE5D3]/30 rounded-2xl p-2.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#BFE5D3] uppercase tracking-wider block">📅 {t.monthlyPayLabel}</span>
              <span className="text-xs font-medium text-white/80">
                {t.beforeTax}: <strong className="text-white"><AnimatedCounter value={monthlyGross} formatter={(val) => formatCurrency(val, inputs.currency)} /></strong>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#198754] bg-[#EAF7F1] px-1.5 py-0.5 rounded uppercase block">{t.afterTaxNet}</span>
              <span className="text-sm font-black text-white">
                <AnimatedCounter value={monthlyNet} formatter={(val) => formatCurrency(val, inputs.currency)} />
              </span>
            </div>
          </div>

          {/* Yearly Before & After */}
          <div className="bg-[#176F52]/50 border border-[#BFE5D3]/30 rounded-2xl p-2.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#BFE5D3] uppercase tracking-wider block">🗓️ {t.yearlyTotalLabel}</span>
              <span className="text-xs font-medium text-white/80">
                {t.beforeTax}: <strong className="text-white"><AnimatedCounter value={yearlyGross || 0} formatter={(val) => formatCurrency(val, inputs.currency)} /></strong>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#198754] bg-[#EAF7F1] px-1.5 py-0.5 rounded uppercase block">{t.afterTaxNet}</span>
              <span className="text-sm font-black text-white">
                <AnimatedCounter value={yearlyNet} formatter={(val) => formatCurrency(val, inputs.currency)} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Updates Footer Note */}
      <p className="text-center text-[10px] text-[#BFE5D3]/80 font-medium pt-2">
        ⚡ {t.updatesLive}
      </p>
    </div>
  );
};
