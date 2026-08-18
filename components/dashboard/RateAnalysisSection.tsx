'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import { DollarSign, ArrowRight, TrendingUp, Calculator } from 'lucide-react';

interface RateAnalysisSectionProps {
  snapshot: CompleteFinancialSnapshot;
}

export const RateAnalysisSection: React.FC<RateAnalysisSectionProps> = ({ snapshot }) => {
  const { tax, inputs } = snapshot;

  const billableHours = (inputs.workHoursPerWeek || 40) * (inputs.weeksPerYear || 52);
  const workerRate = inputs.incomeRate || 60;
  const workerAnnual = workerRate * billableHours;
  const workerNetRate = tax.contractNetHourlyRate || (billableHours > 0 ? tax.takeHomePayAnnual / billableHours : workerRate * 0.65);

  const [hasClientBillRate, setHasClientBillRate] = useState(false);
  const [clientBillRate, setClientBillRate] = useState(80);

  const spread = Math.max(0, clientBillRate - workerRate);
  const grossMarginPercent = clientBillRate > 0 ? (spread / clientBillRate) * 100 : 0;
  const annualClientContractValue = clientBillRate * billableHours;
  const annualGrossSpread = spread * billableHours;

  const marketMedianRate = 55;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>Rate & Margin Intelligence</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Rate Analysis</h2>
          <p className="text-xs text-slate-500 font-medium">
            Understand what your rate means before and after taxes in {inputs.city}, {inputs.country}.
          </p>
        </div>

        {/* Client Bill Rate Toggle */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/60">
          <span className="text-xs font-semibold text-slate-600 pl-1">Include Client Bill Rate:</span>
          <button
            onClick={() => setHasClientBillRate(!hasClientBillRate)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              hasClientBillRate
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {hasClientBillRate ? 'Active' : 'Add Bill Rate'}
          </button>
        </div>
      </div>

      {!hasClientBillRate ? (
        /* WORKER ONLY RATE ANALYSIS */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Worker / Contract Rate</span>
              <p className="text-2xl font-black text-emerald-600">
                {formatCurrency(workerRate, inputs.currency)}/hr
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">{billableHours.toLocaleString()} billable hrs/year</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Annual Contract Revenue</span>
              <p className="text-2xl font-black text-slate-900">
                {formatCurrency(workerAnnual, inputs.currency)}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Gross yearly value</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Est. Personal Net Rate</span>
              <p className="text-2xl font-black text-indigo-600">
                {formatCurrency(workerNetRate, inputs.currency)}/hr
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">After estimated taxes & write-offs</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Market Median Rate</span>
              <p className="text-2xl font-black text-slate-900">
                {formatCurrency(marketMedianRate, inputs.currency)}/hr
              </p>
              <p className="text-[10px] text-emerald-600 font-bold">Ranks in 78th Percentile</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Rate Transformation Pipeline</h3>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center text-xs font-bold">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex-1 w-full">
                <span className="text-slate-400 text-[10px] uppercase block">Gross Contract Rate</span>
                <span className="text-base text-slate-900">{formatCurrency(workerRate, inputs.currency)}/hr</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 flex-1 w-full">
                <span className="text-indigo-700 text-[10px] uppercase block">Est. Net Hourly Rate</span>
                <span className="text-base text-indigo-700">{formatCurrency(workerNetRate, inputs.currency)}/hr</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CLIENT BILL RATE + SPREAD + MARGIN ANALYSIS */
        <div className="space-y-6">
          {/* Rate & Margin Input Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Contract Rate & Bill Rate Inputs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client Bill Rate ($/hr)</label>
                <input
                  type="number"
                  value={clientBillRate}
                  onChange={(e) => setClientBillRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Worker Pay Rate ($/hr)</label>
                <input
                  type="number"
                  value={workerRate}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* 6 Key Spread & Margin Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Client Bill Rate</span>
              <p className="text-2xl font-black text-slate-900">
                {formatCurrency(clientBillRate, inputs.currency)}/hr
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Total charged to end client</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Worker Gross Rate</span>
              <p className="text-2xl font-black text-emerald-600">
                {formatCurrency(workerRate, inputs.currency)}/hr
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Contractor hourly pay</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Gross Spread</span>
              <p className="text-2xl font-black text-indigo-600">
                {formatCurrency(spread, inputs.currency)}/hr
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Bill Rate - Worker Rate</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Gross Margin (%)</span>
              <p className="text-2xl font-black text-purple-600">
                {formatPercent(grossMarginPercent)}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">(Spread ÷ Bill Rate) × 100</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Annual Client Contract Value</span>
              <p className="text-2xl font-black text-slate-900">
                {formatCurrency(annualClientContractValue, inputs.currency)}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Total annual client billing</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Annual Gross Spread</span>
              <p className="text-2xl font-black text-indigo-600">
                {formatCurrency(annualGrossSpread, inputs.currency)}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Annual gross agency margin</p>
            </div>
          </div>

          {/* Visual Rate & Spread Flow */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Client Bill Rate to Worker Net Flow</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center text-xs font-bold">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex-1 w-full">
                <span className="text-slate-400 text-[10px] uppercase block">CLIENT BILL RATE</span>
                <span className="text-base text-slate-900">{formatCurrency(clientBillRate, inputs.currency)}/hr</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex-1 w-full">
                <span className="text-emerald-700 text-[10px] uppercase block">WORKER GROSS RATE</span>
                <span className="text-base text-emerald-700">{formatCurrency(workerRate, inputs.currency)}/hr</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 flex-1 w-full">
                <span className="text-indigo-700 text-[10px] uppercase block">WORKER NET RATE</span>
                <span className="text-base text-indigo-700">{formatCurrency(workerNetRate, inputs.currency)}/hr</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
