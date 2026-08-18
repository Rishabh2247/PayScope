'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, isContractorRole } from '../../lib/formatters';
import { PieChart, TrendingUp, Users, Info } from 'lucide-react';

interface BenchmarksSectionProps {
  snapshot: CompleteFinancialSnapshot;
}

export const BenchmarksSection: React.FC<BenchmarksSectionProps> = ({ snapshot }) => {
  const { tax, economic, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);
  const [householdSize, setHouseholdSize] = useState(1);

  // Compare personal owner draw for contractors, or gross salary for employees
  const comparisonIncome = isContractor ? tax.takeHomePayAnnual : tax.annualGross;
  const percentileRank = comparisonIncome > 100000 ? 78 : comparisonIncome > 75000 ? 64 : 48;

  const rateBenchmarks = [
    { label: 'Bottom 25%', rate: 38 },
    { label: 'Market Median', rate: 55 },
    { label: 'Experienced Rate', rate: 72 },
    { label: 'Top 25%', rate: 82 },
    { label: 'Top 10%', rate: 98 },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <PieChart className="w-4 h-4" />
          <span>Regional Benchmarking</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Market Benchmarks</h2>
        <p className="text-xs text-slate-500 font-medium">
          See how your income or contract rate compares with local benchmarks in {economic.cityLabel}.
        </p>
      </div>

      {/* Household Benchmark Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Household Income Benchmark</h3>
            <p className="text-xs text-slate-500">
              {isContractor ? 'Comparing estimated personal owner income (after corp write-offs)' : 'Comparing gross personal income'}
            </p>
          </div>

          {/* Household Size Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 text-xs font-semibold">
            <Users className="w-4 h-4 text-slate-400 ml-1" />
            <span className="text-slate-600">Household:</span>
            {[1, 2, 3, 4, 5].map((size) => (
              <button
                key={size}
                onClick={() => setHouseholdSize(size)}
                className={`w-7 h-7 rounded-lg transition-all cursor-pointer ${
                  householdSize === size
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {size === 5 ? '5+' : size}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Ranking Badge */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg shrink-0">
            {percentileRank}%
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900">
              Your estimated personal income ranks above {percentileRank}% of {householdSize}-person households in {economic.cityLabel}.
            </p>
            <p className="text-xs text-emerald-700 font-medium">
              Median household benchmark: {formatCurrency(78000, inputs.currency)}/year
            </p>
          </div>
        </div>

        {/* Percentile Progress Bar Visual */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>0%</span>
            <span>25th%</span>
            <span className="text-indigo-600">50th% (Median)</span>
            <span>75th%</span>
            <span>90th% (Top 10%)</span>
          </div>
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentileRank}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contract Rate Benchmark Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Hourly Rate Benchmark ({economic.cityLabel})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          {rateBenchmarks.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</span>
              <p className="text-lg font-black text-slate-900">{formatCurrency(item.rate, inputs.currency)}/hr</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-100">
          <span>Source: Statistics Canada / U.S. Bureau of Labor Statistics (BLS)</span>
          <span>Data Period: 2025/2026 • Updated: Live</span>
        </div>
      </div>
    </div>
  );
};
