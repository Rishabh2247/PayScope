'use client';

import React, { useState } from 'react';
import { RecruiterInputs, RecruiterCalculationResult } from '../../lib/recruiterTypes';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import {
  BarChart3,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Sliders,
  DollarSign,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';

interface RecruiterRateSnapshotProps {
  inputs: RecruiterInputs;
  calculation: RecruiterCalculationResult;
}

export const RecruiterRateSnapshot: React.FC<RecruiterRateSnapshotProps> = ({
  inputs,
  calculation,
}) => {
  // Rate Scenario Simulator state
  const [scenarioPayRate, setScenarioPayRate] = useState<number>(inputs.candidatePayRate);
  const [scenarioBillRate, setScenarioBillRate] = useState<number>(inputs.clientBillRate);

  const currencySymbol = inputs.currency === 'CAD' ? 'CA$' : inputs.currency === 'MXN' ? 'MX$' : inputs.currency === 'BRL' ? 'R$' : '$';

  // Scenario calculations
  const scenarioSpread = scenarioBillRate - scenarioPayRate;
  const scenarioMargin = scenarioBillRate > 0 ? (scenarioSpread / scenarioBillRate) * 100 : 0;
  const scenarioMarkup = scenarioPayRate > 0 ? (scenarioSpread / scenarioPayRate) * 100 : 0;
  const marginDelta = scenarioMargin - calculation.grossMarginPercent;

  const scenarioMonthlyProfit = scenarioSpread * calculation.billableHoursMonthly;
  const scenarioAnnualProfit = scenarioMonthlyProfit * 12;
  const annualProfitChange = scenarioAnnualProfit - calculation.annualGrossProfit;

  return (
    <div className="space-y-6">
      {/* 1. Header: Recruiting Rate Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Recruiting Rate Snapshot
              </span>
              <span className="text-slate-400 text-xs font-semibold">
                {inputs.contractType} · {inputs.contractDurationMonths} Months
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              {inputs.jobTitle || 'Senior Business Analyst'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {inputs.city}, {inputs.state} ({inputs.country}) · Rate Frequency: {inputs.rateFrequency}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 shrink-0">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Current Bill / Pay</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-extrabold text-indigo-700">
                  {formatCurrency(inputs.clientBillRate, inputs.currency)}/hr
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-sm font-extrabold text-emerald-700">
                  {formatCurrency(inputs.candidatePayRate, inputs.currency)}/hr
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Metrics Grid (9 Large Visual Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {/* Card 1: Candidate Pay Rate */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">1. Candidate Pay Rate</span>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(inputs.candidatePayRate, inputs.currency)}
              <span className="text-xs text-slate-400 font-semibold ml-1">/hr</span>
            </div>
            <p className="text-[11px] text-slate-500">Direct candidate pay before agency burden</p>
          </div>

          {/* Card 2: Client Bill Rate */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">2. Client Bill Rate</span>
            <div className="text-2xl font-black text-indigo-700">
              {formatCurrency(inputs.clientBillRate, inputs.currency)}
              <span className="text-xs text-slate-400 font-semibold ml-1">/hr</span>
            </div>
            <p className="text-[11px] text-slate-500">Client billing rate charged by agency</p>
          </div>

          {/* Card 3: Spread */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">3. Hourly Spread</span>
            <div className="text-2xl font-black text-emerald-700">
              {formatCurrency(calculation.spread, inputs.currency)}
              <span className="text-xs text-slate-400 font-semibold ml-1">/hr</span>
            </div>
            <p className="text-[11px] text-slate-500">Client Bill Rate minus Candidate Pay</p>
          </div>

          {/* Card 4: Gross Margin */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">4. Gross Margin %</span>
            <div className="text-2xl font-black text-emerald-600">
              {formatPercent(calculation.grossMarginPercent)}
            </div>
            <p className="text-[11px] text-slate-500">Spread ÷ Client Bill Rate</p>
          </div>

          {/* Card 5: Markup */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">5. Markup %</span>
            <div className="text-2xl font-black text-indigo-600">
              {formatPercent(calculation.markupPercent)}
            </div>
            <p className="text-[11px] text-slate-500">Spread ÷ Candidate Cost</p>
          </div>

          {/* Card 6: Monthly Revenue */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">6. Monthly Revenue</span>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(calculation.monthlyRevenue, inputs.currency)}
            </div>
            <p className="text-[11px] text-slate-500">Bill Rate × {calculation.billableHoursMonthly.toFixed(0)} billable hrs/mo</p>
          </div>

          {/* Card 7: Monthly Gross Profit */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80 space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">7. Monthly Gross Profit</span>
            <div className="text-2xl font-black text-emerald-700">
              {formatCurrency(calculation.monthlyGrossProfit, inputs.currency)}
            </div>
            <p className="text-[11px] text-emerald-700">Monthly Revenue minus total costs</p>
          </div>

          {/* Card 8: Annual Revenue */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">8. Annual Revenue</span>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(calculation.annualRevenue, inputs.currency)}
            </div>
            <p className="text-[11px] text-slate-500">Annualized client billing contract value</p>
          </div>

          {/* Card 9: Annual Gross Profit */}
          <div className="bg-indigo-50/80 p-4 rounded-xl border border-indigo-200/80 space-y-1">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">9. Annual Gross Profit</span>
            <div className="text-2xl font-black text-indigo-700">
              {formatCurrency(calculation.annualGrossProfit, inputs.currency)}
            </div>
            <p className="text-[11px] text-indigo-700">Annualized agency gross profit spread</p>
          </div>
        </div>

        {/* Clear Formula Clarification Note */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Formula Clarification:</strong> Markup = Spread / Candidate Cost ({formatPercent(calculation.markupPercent)}) vs. Margin = Spread / Client Bill Rate ({formatPercent(calculation.grossMarginPercent)}).
          </span>
        </div>
      </div>

      {/* 3. Margin Visualization Flow & Status */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Margin Breakdown & Target Status</span>
            </h3>
            <p className="text-xs text-slate-500">
              Visual breakdown of Client Bill Rate → Candidate Pay → Agency Gross Profit
            </p>
          </div>

          {/* Margin Status Indicator */}
          <div
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border ${
              calculation.marginStatus === 'Healthy'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : calculation.marginStatus === 'Below Target'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {calculation.marginStatus === 'Healthy' && <ShieldCheck className="w-4 h-4" />}
            {calculation.marginStatus === 'Below Target' && <AlertTriangle className="w-4 h-4" />}
            {calculation.marginStatus === 'Low Margin' && <XCircle className="w-4 h-4" />}
            <span>{calculation.marginStatus} ({formatPercent(calculation.grossMarginPercent)})</span>
          </div>
        </div>

        {/* Visual Flow Representation */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Step 1: Client Bill Rate */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Client Bill Rate</span>
              <div className="text-xl font-black text-indigo-700">
                {formatCurrency(inputs.clientBillRate, inputs.currency)}/hr
              </div>
              <span className="text-[11px] text-slate-400 font-medium">100% of Revenue</span>
            </div>

            {/* Arrow Divider */}
            <div className="hidden md:flex justify-center text-slate-300">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* Step 2: Candidate Pay Rate */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase">Candidate Pay</span>
              <div className="text-xl font-black text-slate-800">
                {formatCurrency(inputs.candidatePayRate, inputs.currency)}/hr
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {formatPercent((inputs.candidatePayRate / (inputs.clientBillRate || 1)) * 100)} of Bill Rate
              </span>
            </div>

            {/* Arrow Divider */}
            <div className="hidden md:flex justify-center text-slate-300">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* Step 3: Agency Gross Profit */}
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-xs text-center space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase">Agency Gross Spread</span>
              <div className="text-xl font-black text-emerald-700">
                {formatCurrency(calculation.spread, inputs.currency)}/hr
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">
                {formatPercent(calculation.grossMarginPercent)} Gross Margin
              </span>
            </div>
          </div>

          {/* Progress Bar Visualizer */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Candidate Pay ({formatPercent((inputs.candidatePayRate / (inputs.clientBillRate || 1)) * 100)})</span>
              <span>Gross Margin ({formatPercent(calculation.grossMarginPercent)})</span>
            </div>
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (inputs.candidatePayRate / (inputs.clientBillRate || 1)) * 100)}%` }}
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${Math.max(0, calculation.grossMarginPercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Rate Scenario Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <span>Rate Scenario Simulator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Simulate candidate pay rate or bill rate changes to negotiate intelligently.
            </p>
          </div>
          <button
            onClick={() => {
              setScenarioPayRate(inputs.candidatePayRate);
              setScenarioBillRate(inputs.clientBillRate);
            }}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Inputs
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Simulated Candidate Pay Rate</span>
                <span className="text-emerald-700">{currencySymbol}{scenarioPayRate}/hr</span>
              </div>
              <input
                type="range"
                min={inputs.candidatePayRate * 0.7}
                max={inputs.candidatePayRate * 1.4}
                step="0.5"
                value={scenarioPayRate}
                onChange={(e) => setScenarioPayRate(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Simulated Client Bill Rate</span>
                <span className="text-indigo-700">{currencySymbol}{scenarioBillRate}/hr</span>
              </div>
              <input
                type="range"
                min={inputs.clientBillRate * 0.7}
                max={inputs.clientBillRate * 1.4}
                step="0.5"
                value={scenarioBillRate}
                onChange={(e) => setScenarioBillRate(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* Results Delta Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Scenario Analysis Delta</h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Simulated Margin</span>
                <span className="text-base font-extrabold text-slate-900">{formatPercent(scenarioMargin)}</span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Margin Change</span>
                <span className={`text-base font-extrabold ${marginDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {marginDelta >= 0 ? '+' : ''}{marginDelta.toFixed(2)}%
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Simulated Spread</span>
                <span className="text-base font-extrabold text-slate-900">{currencySymbol}{scenarioSpread.toFixed(2)}/hr</span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Annual Profit Impact</span>
                <span className={`text-base font-extrabold ${annualProfitChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {annualProfitChange >= 0 ? '+' : ''}{formatCurrency(annualProfitChange, inputs.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
