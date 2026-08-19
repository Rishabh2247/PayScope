'use client';

import React, { useState } from 'react';
import { RecruiterInputs, RecruiterCalculationResult, ContractType, RecruiterRateFrequency } from '../../lib/recruiterTypes';
import { generateRatePdf } from '../../lib/pdfReportEngine';
import { DownloadPdfButton } from './DownloadPdfButton';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Briefcase,
  Percent,
  Clock,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Info,
} from 'lucide-react';

interface RecruiterHeroSectionProps {
  inputs: RecruiterInputs;
  calculation: RecruiterCalculationResult;
  onInputsChange: React.Dispatch<React.SetStateAction<RecruiterInputs>>;
  onCalculate: () => void;
}

export const RecruiterHeroSection: React.FC<RecruiterHeroSectionProps> = ({
  inputs,
  calculation,
  onInputsChange,
  onCalculate,
}) => {
  const [showAdditionalCosts, setShowAdditionalCosts] = useState(false);

  const handleChange = (field: keyof RecruiterInputs, value: any) => {
    onInputsChange((prev) => ({ ...prev, [field]: value }));
  };

  const currencySymbol = inputs.currency === 'CAD' ? 'CA$' : inputs.currency === 'MXN' ? 'MX$' : inputs.currency === 'BRL' ? 'R$' : '$';
  const hasInputValues = inputs.candidatePayRate > 0 || inputs.clientBillRate > 0;

  return (
    <div className="space-y-6">
      {/* Top Banner introducing PayScope Recruit Mode */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm border border-indigo-800/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                PayScope Recruit Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Rate & Margin Calculator
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Calculate candidate pay rate, client bill rate, margin and contract profitability in real-time.
            </p>
          </div>

          {hasInputValues && (
            <DownloadPdfButton
              onDownload={() => generateRatePdf(inputs, calculation)}
              variant="outline"
            />
          )}
        </div>
      </div>

      {/* Main Simplified Calculator Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>How much are you making on this contract?</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter candidate pay rate and client bill rate below to see your gross spread and margin.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => handleChange('targetMarginMode', 'calculate_bill_rate')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                inputs.targetMarginMode === 'calculate_bill_rate'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calculate Bill Rate
            </button>
            <button
              onClick={() => handleChange('targetMarginMode', 'calculate_max_pay_rate')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                inputs.targetMarginMode === 'calculate_max_pay_rate'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calculate Max Pay Rate
            </button>
          </div>
        </div>

        {/* Primary Input Grid (All inputs start blank, placeholders provide guidance) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-xs font-bold text-slate-700 block">Job Title</label>
            <input
              type="text"
              value={inputs.jobTitle || ''}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              placeholder="e.g. Senior Business Analyst"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Candidate Pay Rate ($/hr)</label>
            <input
              type="number"
              value={inputs.candidatePayRate || ''}
              onChange={(e) => handleChange('candidatePayRate', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 65"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Client Bill Rate ($/hr)</label>
            <input
              type="number"
              value={inputs.clientBillRate || ''}
              onChange={(e) => handleChange('clientBillRate', parseFloat(e.target.value) || 0)}
              placeholder="e.g. 90"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-indigo-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Target Margin</span>
              <span className="text-slate-400 font-normal" title="Margin is the percentage of client bill rate remaining after candidate pay.">ⓘ</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={inputs.targetMarginPercent || ''}
                onChange={(e) => handleChange('targetMarginPercent', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 25"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 pr-8"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400 font-bold text-xs">%</span>
            </div>
          </div>
        </div>

        {/* Progressive Disclosure: Additional Costs */}
        <button
          onClick={() => setShowAdditionalCosts(!showAdditionalCosts)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 pt-1"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showAdditionalCosts ? 'Hide Advanced Overhead Costs' : '+ Add Additional Costs (Employer Burden, Benefits, Recruiting)'}</span>
        </button>

        {showAdditionalCosts && (
          <div className="bg-slate-50 p-4 rounded-xl border grid grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-in fade-in">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Employer Burden %</label>
              <input
                type="number"
                value={inputs.employerBurdenPercent || ''}
                onChange={(e) => handleChange('employerBurdenPercent', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 10"
                className="w-full bg-white border rounded-lg p-2 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Benefits / Ins. ($/mo)</label>
              <input
                type="number"
                value={inputs.benefitsMonthly || ''}
                onChange={(e) => handleChange('benefitsMonthly', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 200"
                className="w-full bg-white border rounded-lg p-2 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">One-Time Costs ($)</label>
              <input
                type="number"
                value={inputs.oneTimeRecruitingCost || ''}
                onChange={(e) => handleChange('oneTimeRecruitingCost', parseFloat(e.target.value) || 0)}
                placeholder="e.g. 1000"
                className="w-full bg-white border rounded-lg p-2 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contract Duration (Mos)</label>
              <input
                type="number"
                value={inputs.contractDurationMonths || ''}
                onChange={(e) => handleChange('contractDurationMonths', parseInt(e.target.value, 10) || 0)}
                placeholder="e.g. 6"
                className="w-full bg-white border rounded-lg p-2 font-semibold"
              />
            </div>
          </div>
        )}

        {/* Primary Key Results Cards (Shows 0 until user enters rates) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">Pay Rate</span>
            <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
              {inputs.candidatePayRate > 0 ? `${formatCurrency(inputs.candidatePayRate, inputs.currency)}/hr` : '$0/hr'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">Client Bill Rate</span>
            <span className="text-sm font-extrabold text-indigo-700 block mt-0.5">
              {inputs.clientBillRate > 0 ? `${formatCurrency(inputs.clientBillRate, inputs.currency)}/hr` : '$0/hr'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
              <span>Pay vs. Client Rate</span>
              <span title="Spread is the hourly difference between client rate and candidate pay rate.">ⓘ</span>
            </span>
            <span className="text-sm font-extrabold text-emerald-700 block mt-0.5">
              {hasInputValues ? `${formatCurrency(calculation.spread, inputs.currency)}/hr` : '$0/hr'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
              <span>Gross Margin</span>
              <span title="Margin is the percentage of client bill rate remaining after candidate pay.">ⓘ</span>
            </span>
            <span className="text-sm font-extrabold text-emerald-600 block mt-0.5">
              {hasInputValues ? formatPercent(calculation.grossMarginPercent) : '0%'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
              <span>Markup</span>
              <span title="Markup is the percentage added on top of candidate pay rate.">ⓘ</span>
            </span>
            <span className="text-sm font-extrabold text-indigo-600 block mt-0.5">
              {hasInputValues ? formatPercent(calculation.markupPercent) : '0%'}
            </span>
          </div>

          <div className="bg-indigo-600 text-white p-3.5 rounded-xl border border-indigo-700 shadow-xs">
            <span className="text-[11px] font-medium text-indigo-100 block">Monthly Profit</span>
            <span className="text-sm font-black block mt-0.5">
              {hasInputValues ? formatCurrency(calculation.monthlyGrossProfit, inputs.currency) : '$0'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
