'use client';

import React, { useState } from 'react';
import { RecruiterInputs, RecruiterCalculationResult, RecruiterContractRecord } from '../../lib/recruiterTypes';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Building2,
  ArrowUpDown,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Search,
  Calendar,
  Layers,
} from 'lucide-react';

interface RecruiterDashboardViewProps {
  inputs: RecruiterInputs;
  calculation: RecruiterCalculationResult;
  onNavigateTab: (tab: string) => void;
}

type SortField = 'grossMarginPercent' | 'estimatedTotalProfit' | 'billRate' | 'candidatePay' | 'contractDurationMonths';

export const RecruiterDashboardView: React.FC<RecruiterDashboardViewProps> = ({
  inputs,
  calculation,
  onNavigateTab,
}) => {
  const [contracts, setContracts] = useState<RecruiterContractRecord[]>([]);
  const [sortField, setSortField] = useState<SortField>('grossMarginPercent');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedContracts = [...contracts].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalRevenue = contracts.reduce((acc, c) => acc + c.billRate * 160 * c.contractDurationMonths, 0);
  const totalProfit = contracts.reduce((acc, c) => acc + c.estimatedTotalProfit, 0);
  const avgMargin = contracts.reduce((acc, c) => acc + c.grossMarginPercent, 0) / (contracts.length || 1);

  return (
    <div className="space-y-6">
      {/* 1. Recruiter Dashboard Banner & Top Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Agency Dashboard
              </span>
              <span className="text-slate-400 text-xs font-semibold">PayScope Recruit Overview</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Recruiter Dashboard</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Overview of active contracts, portfolio margin metrics, and profit forecasts.
            </p>
          </div>
        </div>

        {/* 8 Primary Recruiter Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Contracts</span>
            <div className="text-2xl font-black text-slate-900">{contracts.length}</div>
            <span className="text-[11px] text-slate-400 font-medium">Placements on Billing</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Client Revenue</span>
            <div className="text-2xl font-black text-indigo-700">{formatCurrency(totalRevenue, inputs.currency)}</div>
            <span className="text-[11px] text-slate-400 font-medium">Portfolio Billing Value</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200/80 space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Est. Gross Profit</span>
            <div className="text-2xl font-black text-emerald-700">{formatCurrency(totalProfit, inputs.currency)}</div>
            <span className="text-[11px] text-emerald-600 font-medium">Total Agency Net Spread</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Average Margin</span>
            <div className="text-2xl font-black text-emerald-600">{formatPercent(avgMargin)}</div>
            <span className="text-[11px] text-slate-400 font-medium">Target: {inputs.targetMarginPercent}%</span>
          </div>
        </div>
      </div>

      {/* 2. Recruiter Contract Table (Sortable) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Active Placement Contracts Table</span>
            </h3>
            <p className="text-xs text-slate-500">
              Click headers to sort contracts by Margin, Profit, Bill Rate, Pay Rate, or Duration.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Client & Role</th>
                <th className="p-3.5 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('candidatePay')}>
                  <div className="flex items-center gap-1">
                    <span>Pay Rate</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('billRate')}>
                  <div className="flex items-center gap-1">
                    <span>Bill Rate</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('grossMarginPercent')}>
                  <div className="flex items-center gap-1">
                    <span>Margin %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('contractDurationMonths')}>
                  <div className="flex items-center gap-1">
                    <span>Duration</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('estimatedTotalProfit')}>
                  <div className="flex items-center gap-1">
                    <span>Est Profit</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {sortedContracts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{c.role}</div>
                    <div className="text-[11px] text-slate-500 font-semibold">{c.clientName} · {c.location}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">${c.candidatePay}/hr</td>
                  <td className="p-3.5 font-bold text-indigo-700">${c.billRate}/hr</td>
                  <td className="p-3.5 font-extrabold text-emerald-600">{formatPercent(c.grossMarginPercent)}</td>
                  <td className="p-3.5 text-slate-600">{c.contractDurationMonths} Months</td>
                  <td className="p-3.5 font-extrabold text-slate-900">{formatCurrency(c.estimatedTotalProfit, inputs.currency)}</td>
                  <td className="p-3.5 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-lg font-extrabold text-[11px] inline-flex items-center gap-1 ${
                        c.status === 'Healthy'
                          ? 'bg-emerald-50 text-emerald-700'
                          : c.status === 'Below Target'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Quick Action Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateTab('rate-cards')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 text-left space-y-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Rate Card Builder</h4>
          <p className="text-xs text-slate-500">Manage client rate cards by job title, seniority and location.</p>
        </button>

        <button
          onClick={() => onNavigateTab('talent-search')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 text-left space-y-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Talent Search & X-Ray</h4>
          <p className="text-xs text-slate-500">Generate Boolean strings and search candidate profiles.</p>
        </button>

        <button
          onClick={() => onNavigateTab('jd-ats')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 text-left space-y-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">JD & ATS Analyzer</h4>
          <p className="text-xs text-slate-500">Extract skills from JDs and match candidate resumes.</p>
        </button>
      </div>
    </div>
  );
};
