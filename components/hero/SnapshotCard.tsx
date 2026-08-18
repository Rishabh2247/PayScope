'use client';

import React from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, formatPercent, isContractorRole } from '../../lib/formatters';
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
  Car,
} from 'lucide-react';
import Link from 'next/link';

interface SnapshotCardProps {
  snapshot: CompleteFinancialSnapshot;
  onExploreDashboard: () => void;
}

export const SnapshotCard: React.FC<SnapshotCardProps> = ({ snapshot, onExploreDashboard }) => {
  const { tax, economic, purchasingPowerNeeded, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);

  const netHourly = tax.contractNetHourlyRate || (tax.annualBillableHours > 0 ? tax.takeHomePayAnnual / tax.annualBillableHours : 0);

  return (
    <div
      onClick={onExploreDashboard}
      className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-md shadow-slate-100 space-y-4 cursor-pointer group hover:border-indigo-300 transition-all relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Your Financial Snapshot</h3>
        <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
          {isContractor ? 'Contract Estimate' : 'Estimated'}
        </span>
      </div>

      {/* Row 1 Main 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* CARD 1: Contract Billing Rate (Contractor) OR Take-Home Pay (Employee) */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              {isContractor ? <Clock className="w-3.5 h-3.5" /> : <Wallet className="w-3.5 h-3.5" />}
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              {isContractor ? 'Contract Billing Rate' : 'Take-Home Pay'}
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">
              {isContractor
                ? `${formatCurrency(tax.contractBillingRate, inputs.currency)}/hr`
                : formatCurrency(tax.takeHomePayAnnual, inputs.currency)}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">
              {isContractor
                ? `Net: ${formatCurrency(netHourly, inputs.currency)}/hr after taxes & expenses`
                : 'After taxes & deductions'}
            </div>
          </div>
          <div className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {isContractor
              ? `${tax.annualBillableHours.toLocaleString()} billable hrs/year`
              : `${formatPercent(tax.takeHomePercentage)} of gross income`}
          </div>
        </div>

        {/* CARD 2: Monthly Contract Revenue (Contractor) OR Monthly Take-Home (Employee) */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              {isContractor ? 'Monthly Contract Revenue' : 'Monthly Take-Home'}
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {formatCurrency(
                isContractor ? tax.monthlyContractRevenue : tax.takeHomePayMonthly,
                inputs.currency
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">
              {isContractor
                ? `Net: ${formatCurrency(tax.takeHomePayMonthly, inputs.currency)}/mo after taxes & expenses`
                : 'Monthly net income'}
            </div>
          </div>
        </div>

        {/* CARD 3: Annual Contract Revenue (Contractor) OR Effective Hourly Rate (Employee) */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              {isContractor ? 'Annual Contract Revenue' : 'Effective Hourly Rate'}
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {isContractor
                ? formatCurrency(tax.annualContractRevenue, inputs.currency)
                : `${formatCurrency(tax.effectiveHourlyRate, inputs.currency)}/hr`}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">
              {isContractor
                ? `Net: ${formatCurrency(tax.takeHomePayAnnual, inputs.currency)}/yr after taxes & expenses`
                : `Before taxes: ${formatCurrency(tax.grossHourlyRate, inputs.currency)}/hr`}
            </div>
          </div>
        </div>
      </div>

      {/* 2x3 Grid Cards with Country-Specific Data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Income Benchmark */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-slate-700">Income Benchmark</span>
          </div>
          <div className="text-xl font-black text-emerald-600">78%</div>
          <p className="text-[10px] text-slate-500 leading-snug">
            {isContractor ? 'Est. personal income vs local benchmark' : 'Your gross income vs local benchmark'} in {economic.cityLabel}
          </p>
        </div>

        {/* Inflation (YoY) - Country Specific */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[11px]">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-700">Inflation (YoY)</span>
          </div>
          <div className="text-xl font-black text-amber-500">{economic.inflationRate}%</div>
          <p className="text-[10px] text-slate-500 leading-snug">{economic.inflationLabel}</p>
        </div>

        {/* Cost of Living - Country Specific */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[11px]">
            <Home className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-slate-700">Cost of Living (Monthly)</span>
          </div>
          <div className="text-xl font-black text-rose-500">
            {formatCurrency(economic.colTotalMonthly, inputs.currency)}
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">Estimated total in {economic.cityLabel}</p>
        </div>

        {/* Fuel Price Today - Country Specific Units */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[11px]">
            <Fuel className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-slate-700">Fuel Price Today</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900">
              {economic.currencySymbol}{economic.fuelPriceToday.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">{economic.fuelPriceUnit}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>{economic.cityLabel}</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-1 py-0.2 rounded">
              {economic.fuelPriceVsYesterday} vs yesterday
            </span>
          </div>
        </div>

        {/* Commute Cost */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[11px]">
            <Car className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-slate-700">Commute Cost (Monthly)</span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {formatCurrency(inputs.country === 'CA' ? 144 : 85.6, inputs.currency)}
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">Est. fuel cost (20 miles/day)</p>
        </div>

        {/* Purchasing Power */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-slate-700">Purchasing Power</span>
          </div>
          <div className="text-xl font-black text-emerald-600">
            {formatCurrency(purchasingPowerNeeded, inputs.currency)}
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">Needed next year to maintain purchasing power</p>
        </div>
      </div>

      {/* Unobtrusive Legal Disclaimer Bar Under Results */}
      <div className="space-y-1 text-[11px] font-medium text-slate-500 bg-slate-100/90 p-3 rounded-xl border border-slate-200/60">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            {isContractor
              ? 'Contract and business estimates may differ based on business expenses, corporate structure, compensation method and applicable tax rules.'
              : 'Estimates are for informational purposes only and may vary based on your location, tax year, employment type, deductions and individual circumstances.'}{' '}
            <Link href="/disclaimer" className="underline font-semibold hover:text-indigo-600">
              Read Disclaimer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
