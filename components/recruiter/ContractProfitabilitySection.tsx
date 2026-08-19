'use client';

import React from 'react';
import { RecruiterInputs, RecruiterCalculationResult } from '../../lib/recruiterTypes';
import { generateMonthlyForecast } from '../../lib/recruiterEngine';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  Gift,
  AlertCircle,
  BarChart2,
  Info,
} from 'lucide-react';

interface ContractProfitabilitySectionProps {
  inputs: RecruiterInputs;
  calculation: RecruiterCalculationResult;
  onInputsChange: React.Dispatch<React.SetStateAction<RecruiterInputs>>;
}

export const ContractProfitabilitySection: React.FC<ContractProfitabilitySectionProps> = ({
  inputs,
  calculation,
  onInputsChange,
}) => {
  const monthlyForecast = generateMonthlyForecast(calculation);

  const handleIncentiveTypeChange = (type: 'percentage_profit' | 'percentage_bill' | 'fixed_monthly') => {
    onInputsChange((prev) => ({ ...prev, recruiterIncentiveType: type }));
  };

  const handleIncentiveValueChange = (val: number) => {
    onInputsChange((prev) => ({ ...prev, recruiterIncentiveValue: val }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Contract Profitability Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Financial Breakdown
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <span>Contract Profitability Calculator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive financial breakdown for the entire contract duration ({inputs.contractDurationMonths} Months).
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Contract Net Profit</span>
            <span className="text-2xl font-black text-emerald-700">
              {formatCurrency(calculation.contractTotalGrossProfit, inputs.currency)}
            </span>
          </div>
        </div>

        {/* Visual Waterfall Breakdown Table */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contract Revenue & Cost Flow</h3>

          <div className="space-y-2.5 text-xs font-semibold">
            {/* 1. Revenue */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600" />
                <span className="text-slate-800">Total Client Revenue</span>
              </div>
              <span className="text-base font-extrabold text-slate-900">
                {formatCurrency(calculation.contractTotalRevenue, inputs.currency)}
              </span>
            </div>

            {/* 2. Candidate Direct Cost */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-700">Candidate Direct Pay Cost</span>
              </div>
              <span className="text-base font-bold text-rose-600">
                -{formatCurrency(calculation.contractTotalCandidateCost, inputs.currency)}
              </span>
            </div>

            {/* 3. Employer Burden & Benefits Cost */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-700">Employer Burden & Benefits Cost</span>
              </div>
              <span className="text-base font-bold text-amber-600">
                -{formatCurrency(calculation.contractTotalEmployerCost, inputs.currency)}
              </span>
            </div>

            {/* 4. One-Time Recruiting Cost */}
            {calculation.contractTotalOtherCost > 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="text-slate-700">One-Time Recruiting Cost</span>
                </div>
                <span className="text-base font-bold text-slate-600">
                  -{formatCurrency(calculation.contractTotalOtherCost, inputs.currency)}
                </span>
              </div>
            )}

            {/* 5. Net Estimated Profit Result */}
            <div className="flex items-center justify-between p-4 bg-emerald-600 text-white rounded-xl shadow-md mt-3">
              <div>
                <span className="text-xs font-bold block text-emerald-100 uppercase">Estimated Net Contract Profit</span>
                <span className="text-[11px] text-emerald-100">
                  Effective Gross Margin: {formatPercent(calculation.grossMarginPercent)}
                </span>
              </div>
              <span className="text-2xl font-black">
                {formatCurrency(calculation.contractTotalGrossProfit, inputs.currency)}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            *All financial calculations are estimates based on user-provided bill rates, pay rates, and contract duration.
          </p>
        </div>
      </div>

      {/* 2. Contract Profit Forecast (Month-by-Month) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Contract Profit Forecast</span>
            </h3>
            <p className="text-xs text-slate-500">
              Month-by-month financial projection and cumulative profit trajectory.
            </p>
          </div>
        </div>

        {/* Forecast Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
              <tr>
                <th className="p-3.5">Month</th>
                <th className="p-3.5">Monthly Revenue</th>
                <th className="p-3.5">Candidate Cost</th>
                <th className="p-3.5">Employer & Burden</th>
                <th className="p-3.5">Monthly Profit</th>
                <th className="p-3.5">Cumulative Profit</th>
                <th className="p-3.5 text-right">Cumulative Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {monthlyForecast.map((m) => (
                <tr key={m.monthNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{m.monthName}</td>
                  <td className="p-3.5 text-slate-700">{formatCurrency(m.revenue, inputs.currency)}</td>
                  <td className="p-3.5 text-slate-600">-{formatCurrency(m.candidateCost, inputs.currency)}</td>
                  <td className="p-3.5 text-slate-600">-{formatCurrency(m.employerCost, inputs.currency)}</td>
                  <td className="p-3.5 font-bold text-emerald-700">{formatCurrency(m.grossProfit, inputs.currency)}</td>
                  <td className="p-3.5 font-extrabold text-indigo-700">{formatCurrency(m.cumulativeProfit, inputs.currency)}</td>
                  <td className="p-3.5 text-right font-bold text-emerald-600">
                    {formatPercent(m.cumulativeMarginPercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Recruiter Incentive / Commission Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-600" />
              <span>Recruiter Incentive / Commission Calculator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Calculate estimated recruiter incentive or profit-share based on contract profitability.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Incentive Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Incentive Model</label>
            <select
              value={inputs.recruiterIncentiveType}
              onChange={(e) => handleIncentiveTypeChange(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900"
            >
              <option value="percentage_profit">% Share of Gross Profit</option>
              <option value="percentage_bill">% Share of Client Bill Rate</option>
              <option value="fixed_monthly">Fixed Monthly Incentive ($/mo)</option>
            </select>
          </div>

          {/* Value Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Incentive Rate / Value</label>
            <div className="relative">
              <input
                type="number"
                value={inputs.recruiterIncentiveValue || ''}
                onChange={(e) => handleIncentiveValueChange(parseFloat(e.target.value) || 0)}
                placeholder="10"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
              />
              <span className="absolute right-3.5 top-2.5 text-slate-400 font-bold text-xs">
                {inputs.recruiterIncentiveType === 'fixed_monthly' ? '$' : '%'}
              </span>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 space-y-1">
            <span className="text-[11px] font-bold text-indigo-800 uppercase block">Estimated Recruiter Incentive</span>
            <div className="text-xl font-black text-indigo-700">
              {formatCurrency(calculation.recruiterIncentiveMonthly, inputs.currency)}
              <span className="text-xs font-medium text-indigo-500"> / month</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 block">
              {formatCurrency(calculation.recruiterIncentiveContract, inputs.currency)} Total for Contract
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            This is a customizable planning tool for recruiters and agency managers, not a guaranteed binding commission structure.
          </span>
        </div>
      </div>
    </div>
  );
};
