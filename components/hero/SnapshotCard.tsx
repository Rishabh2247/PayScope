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

interface SnapshotCardProps {
  snapshot: CompleteFinancialSnapshot;
  onExploreDashboard: () => void;
}

export const SnapshotCard: React.FC<SnapshotCardProps> = ({ snapshot, onExploreDashboard }) => {
  const { t } = useTranslation();
  const { tax, economic, purchasingPowerNeeded, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);

  const netHourly = tax.contractNetHourlyRate || (tax.annualBillableHours > 0 ? tax.takeHomePayAnnual / tax.annualBillableHours : 0);

  return (
    <div
      onClick={onExploreDashboard}
      className="bg-slate-50/50 border border-slate-200/70 rounded-3xl p-6 shadow-sm space-y-4 cursor-pointer group hover:border-indigo-300 transition-all relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">{t.financialSnapshot}</h3>
        <span className="bg-emerald-100/80 text-emerald-700 text-xs font-bold px-3 py-0.5 rounded-full">
          {isContractor ? t.contractEstimateBadge : t.estimatedBadge}
        </span>
      </div>

      {/* Row 1 Main 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* CARD 1: Annual Take-Home */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              {isContractor ? <Clock className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
            </div>
            <span className="text-xs font-bold text-slate-700">
              {isContractor ? t.contractBillingRate : t.takeHomePay}
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">
              {isContractor
                ? `${formatCurrency(tax.contractBillingRate, inputs.currency)}/hr`
                : formatCurrency(tax.takeHomePayAnnual, inputs.currency)}
            </div>
            <p className="text-[11px] text-slate-500 font-medium pt-0.5">
              {isContractor
                ? `Net: ${formatCurrency(netHourly, inputs.currency)}/hr`
                : t.afterTaxesDeductions}
            </p>
          </div>
        </div>

        {/* CARD 2: Monthly Take-Home */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {isContractor ? t.monthlyRevenue : t.takeHomePay}
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(
                isContractor ? tax.monthlyContractRevenue : tax.takeHomePayMonthly,
                inputs.currency
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium pt-0.5">
              {isContractor
                ? `Net: ${formatCurrency(tax.takeHomePayMonthly, inputs.currency)}/mo`
                : t.monthlyNetIncome}
            </p>
          </div>
        </div>

        {/* CARD 3: Taxes & Deductions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {isContractor ? t.annualRevenue : t.taxesDeductions}
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {isContractor
                ? formatCurrency(tax.annualContractRevenue, inputs.currency)
                : formatCurrency(tax.totalTax, inputs.currency)}
            </div>
            <p className="text-[11px] text-slate-500 font-medium pt-0.5">
              {isContractor
                ? `Net: ${formatCurrency(tax.takeHomePayAnnual, inputs.currency)}/yr`
                : `${formatPercent(tax.effectiveTaxRate)} Effective Tax Rate`}
            </p>
          </div>
        </div>
      </div>

      {/* Row 2 Economic Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Housing */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-600">
            <Home className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">{t.housing}</span>
          </div>
          <div className="text-base font-black text-slate-900">
            {formatCurrency(economic.colTotalMonthly, inputs.currency)}
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-snug">{t.estimatedMonthlyHousing}</p>
        </div>

        {/* Fuel & Commute */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-600">
            <Fuel className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">{t.fuelCommute}</span>
          </div>
          <div className="text-base font-black text-slate-900">
            {formatCurrency(economic.fuelPriceToday, inputs.currency)}
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-snug">{t.estimatedMonthlyFuel}</p>
        </div>

        {/* Cost of Living */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-rose-600">
            <Flame className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">{t.costOfLiving}</span>
          </div>
          <div className="text-base font-black text-rose-600">
            {formatPercent(economic.inflationRate)}
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-snug">{t.inflationImpact}</p>
        </div>

        {/* Real Purchasing Power */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">{t.purchasingPower}</span>
          </div>
          <div className="text-base font-black text-emerald-600">
            {formatCurrency(purchasingPowerNeeded, inputs.currency)}
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-snug">{t.purchasingPowerNeeded}</p>
        </div>
      </div>

      {/* Legal Disclaimer Bar */}
      <div className="space-y-1 text-xs font-medium text-slate-500 bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200/50">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-snug text-[11px]">
            {isContractor ? t.disclaimerTextContractor : t.disclaimerTextEmployee}{' '}
            <Link href="/disclaimer" className="underline font-semibold text-slate-700 hover:text-indigo-600">
              {t.readDisclaimer}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
