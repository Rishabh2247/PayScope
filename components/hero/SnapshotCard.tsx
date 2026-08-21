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
  Zap,
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

  const hasValidIncome = (inputs.incomeRate || 0) > 0 || (inputs.annualSalary || 0) > 0;

  return (
    <div className="bg-[#12372A] text-white rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col justify-between h-full min-h-[380px] relative overflow-hidden border border-[#BFE5D3]/30 animate-fade-in">
      {/* Glow background accent */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#1F8F68]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 bg-[#176F52]/80 border border-[#BFE5D3]/40 rounded-full px-3 py-1 text-xs font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-[#198754] animate-pulse" />
            <Zap className="w-3.5 h-3.5 text-[#BFE5D3]" />
            <span>{t.liveInstantEstimate}</span>
          </div>
          <span className="text-[10px] font-extrabold text-[#BFE5D3] uppercase tracking-wider bg-[#176F52]/50 px-2 py-0.5 rounded-md">
            {isContractor ? t.contractorTaxMode : t.employeeMode}
          </span>
        </div>

        {/* Primary Take-Home Highlight with Animated Counter / Neutral Empty State */}
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-[#BFE5D3]">
            Estimated Monthly Take-Home
          </p>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {hasValidIncome ? (
              <AnimatedCounter
                value={monthlyNet}
                formatter={(val) => formatCurrency(val, inputs.currency)}
              />
            ) : (
              <span className="text-[#BFE5D3]/60">—</span>
            )}
          </div>
          <p className="text-xs text-[#EAF7F1] font-bold pt-0.5">
            {hasValidIncome ? (
              <>
                <AnimatedCounter
                  value={effectiveRate}
                  decimals={1}
                  formatter={(val) => formatPercent(val)}
                /> {t.effectiveTaxRate}
              </>
            ) : (
              <span className="text-[#BFE5D3]/80 font-normal">Enter your income to see your estimate</span>
            )}
          </p>
        </div>
      </div>

      {/* Detailed Before vs After Tax Matrix Cards */}
      <div className="my-4 space-y-2">
        <p className="text-[11px] font-black uppercase tracking-wider text-[#BFE5D3]">
          {isContractor ? t.contractorIncomeBreakdown : t.salaryTakeHomeBreakdown}
        </p>

        <div className="grid grid-cols-1 gap-2 text-xs">
          {/* Hourly Before & After (Highlight for Contractor Roles) */}
          {isContractor && (
            <div className="bg-[#176F52]/50 border border-[#BFE5D3]/30 rounded-2xl p-2.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold text-[#BFE5D3] uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#BFE5D3]" /> {t.hourlyRateLabel}
                </span>
                <span className="text-xs font-semibold text-white/90">
                  {t.beforeTax}: <strong className="text-white">{hasValidIncome ? <AnimatedCounter value={beforeTaxHourly} formatter={(val) => `${formatCurrency(val, inputs.currency)}/hr`} /> : '—'}</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#198754] bg-[#EAF7F1] px-1.5 py-0.5 rounded uppercase block">{t.afterTaxNet}</span>
                <span className="text-sm font-black text-white">
                  {hasValidIncome ? <AnimatedCounter value={afterTaxHourly} formatter={(val) => `${formatCurrency(val, inputs.currency)}/hr`} /> : <span className="text-[#BFE5D3]/60">—</span>}
                </span>
              </div>
            </div>
          )}

          {/* Monthly Before & After */}
          <div className="bg-[#176F52]/50 border border-[#BFE5D3]/30 rounded-2xl p-2.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-[#BFE5D3] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#BFE5D3]" /> {t.monthlyPayLabel}
              </span>
              <span className="text-xs font-semibold text-white/90">
                {t.beforeTax}: <strong className="text-white">{hasValidIncome ? <AnimatedCounter value={monthlyGross} formatter={(val) => formatCurrency(val, inputs.currency)} /> : '—'}</strong>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#198754] bg-[#EAF7F1] px-1.5 py-0.5 rounded uppercase block">{t.afterTaxNet}</span>
              <span className="text-sm font-black text-white">
                {hasValidIncome ? <AnimatedCounter value={monthlyNet} formatter={(val) => formatCurrency(val, inputs.currency)} /> : <span className="text-[#BFE5D3]/60">—</span>}
              </span>
            </div>
          </div>

          {/* Yearly Before & After */}
          <div className="bg-[#176F52]/50 border border-[#BFE5D3]/30 rounded-2xl p-2.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-[#BFE5D3] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#BFE5D3]" /> {t.yearlyTotalLabel}
              </span>
              <span className="text-xs font-semibold text-white/90">
                {t.beforeTax}: <strong className="text-white">{hasValidIncome ? <AnimatedCounter value={yearlyGross || 0} formatter={(val) => formatCurrency(val, inputs.currency)} /> : '—'}</strong>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#198754] bg-[#EAF7F1] px-1.5 py-0.5 rounded uppercase block">{t.afterTaxNet}</span>
              <span className="text-sm font-black text-white">
                {hasValidIncome ? <AnimatedCounter value={yearlyNet} formatter={(val) => formatCurrency(val, inputs.currency)} /> : <span className="text-[#BFE5D3]/60">—</span>}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Disclosure & Methodology Notice */}
      <div className="bg-[#176F52]/40 border border-[#BFE5D3]/30 rounded-2xl p-3 text-[11px] text-[#EAF7F1] space-y-1.5 my-2">
        <p className="font-bold text-[#BFE5D3]">Your estimate is based on:</p>
        <ul className="space-y-1 text-[10px] font-medium text-white/90">
          <li className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#BFE5D3] shrink-0" /> 2026 federal/provincial tax rules</li>
          <li className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#BFE5D3] shrink-0" /> Employment type selected</li>
          <li className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#BFE5D3] shrink-0" /> Income and working hours provided</li>
          <li className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#BFE5D3] shrink-0" /> Standard deductions and contributions</li>
        </ul>
        <p className="text-[9.5px] text-[#BFE5D3]/80 pt-1.5 leading-snug border-t border-[#BFE5D3]/20 font-normal">
          Some calculations use estimated assumptions, including local expenses, housing, fuel prices, and certain contractor contribution scenarios. This tool provides estimates and is not tax, financial, or legal advice.
        </p>
      </div>

      {/* Live Updates Footer Note */}
      <p className="text-center text-[10px] text-[#BFE5D3] font-bold pt-1 flex items-center justify-center gap-1">
        <Zap className="w-3 h-3 text-[#BFE5D3]" /> {t.updatesLive}
      </p>
    </div>
  );
};
