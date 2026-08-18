'use client';

import React from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, formatPercent, isContractorRole } from '../../lib/formatters';
import { X, Download, ShieldCheck, Wallet, Home, Car, FileText } from 'lucide-react';

interface FullBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: CompleteFinancialSnapshot;
  initialTab?: 'tax' | 'living' | 'housing' | 'commute' | 'all';
}

export const FullBreakdownModal: React.FC<FullBreakdownModalProps> = ({
  isOpen,
  onClose,
  snapshot,
  initialTab = 'all',
}) => {
  const [activeTab, setActiveTab] = React.useState<'tax' | 'living' | 'housing' | 'commute' | 'all'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const { tax, economic, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Full Financial Breakdown</h2>
              <p className="text-xs text-slate-500 font-medium">
                {inputs.city}, {inputs.state}, {inputs.country} • {inputs.employmentType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-100/80 border-b border-slate-200/60 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'all' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setActiveTab('tax')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'tax' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tax & Deductions
          </button>
          <button
            onClick={() => setActiveTab('living')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'living' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cost of Living
          </button>
          <button
            onClick={() => setActiveTab('housing')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'housing' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Housing Snapshot
          </button>
          <button
            onClick={() => setActiveTab('commute')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'commute' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Commute & Fuel
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Section 1: Tax & Income Breakdown */}
          {(activeTab === 'all' || activeTab === 'tax') && (
            <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Wallet className="w-4 h-4 text-indigo-600" />
                <h3>Income & Tax Breakdown Ledger</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Annual Income</span>
                  <p className="text-lg font-black text-slate-900">{formatCurrency(tax.annualGross, inputs.currency)}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Taxes & Write-offs</span>
                  <p className="text-lg font-black text-rose-500">-{formatCurrency(tax.totalTax, inputs.currency)}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Net Annual Take-Home</span>
                  <p className="text-lg font-black text-emerald-600">{formatCurrency(tax.takeHomePayAnnual, inputs.currency)}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                      <th className="py-2 px-1">Deduction Line Item</th>
                      <th className="py-2 px-1 text-right">Annual Amount</th>
                      <th className="py-2 px-1 text-right">Monthly Amount</th>
                      <th className="py-2 px-1 text-right">% of Gross</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tax.breakdown.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white transition-colors">
                        <td className="py-2.5 px-1 font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </td>
                        <td className="py-2.5 px-1 font-bold text-slate-900 text-right">
                          {formatCurrency(item.amount, inputs.currency)}
                        </td>
                        <td className="py-2.5 px-1 font-semibold text-slate-600 text-right">
                          {formatCurrency(item.amount / 12, inputs.currency)}
                        </td>
                        <td className="py-2.5 px-1 font-semibold text-slate-500 text-right">
                          {formatPercent(item.percentage)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 2: Cost of Living Breakdown */}
          {(activeTab === 'all' || activeTab === 'living') && (
            <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Home className="w-4 h-4 text-indigo-600" />
                <h3>Cost of Living Categories ({economic.cityLabel})</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {economic.colCategories.map((cat, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-800">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{formatCurrency(cat.amount, inputs.currency)}/mo</span>
                      <span className="text-[10px] text-slate-400 block">{formatPercent(cat.percentage)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Housing Snapshot Breakdown */}
          {(activeTab === 'all' || activeTab === 'housing') && (
            <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Home className="w-4 h-4 text-indigo-600" />
                <h3>Housing & Neighborhood Rent Ledger ({economic.cityLabel})</h3>
              </div>

              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                      <th className="py-2 px-1">Neighborhood</th>
                      <th className="py-2 px-1 text-right">Typical Rent</th>
                      <th className="py-2 px-1 text-right">Est. Mortgage</th>
                      <th className="py-2 px-1 text-right">Shared Room</th>
                      <th className="py-2 px-1 text-right">vs Last Month</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {economic.neighborhoods.map((n, idx) => (
                      <tr key={idx} className="hover:bg-white transition-colors">
                        <td className="py-2.5 px-1 font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{n.name}</span>
                        </td>
                        <td className="py-2.5 px-1 font-bold text-slate-900 text-right">
                          {formatCurrency(n.typicalRent, inputs.currency)}/mo
                        </td>
                        <td className="py-2.5 px-1 font-bold text-indigo-600 text-right">
                          {formatCurrency(Math.round(n.typicalRent * 2.1), inputs.currency)}/mo
                        </td>
                        <td className="py-2.5 px-1 font-semibold text-slate-600 text-right">
                          {formatCurrency(Math.round(n.typicalRent * 0.48), inputs.currency)}/mo
                        </td>
                        <td className="py-2.5 px-1 font-semibold text-right">
                          {n.vsLastMonth < 0 ? (
                            <span className="text-emerald-600">↓ {Math.abs(n.vsLastMonth)}%</span>
                          ) : (
                            <span className="text-emerald-600">↑ {n.vsLastMonth}%</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: Commute & Fuel Specifications */}
          {(activeTab === 'all' || activeTab === 'commute') && (
            <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Car className="w-4 h-4 text-indigo-600" />
                <h3>Commute & Fuel Cost Ledger</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Daily Commute</span>
                  <p className="text-base font-black text-slate-900">
                    {formatCurrency(inputs.country === 'CA' ? 7.20 : 4.28, inputs.currency)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly Commute</span>
                  <p className="text-base font-black text-indigo-600">
                    {formatCurrency(inputs.country === 'CA' ? 144 : 85.6, inputs.currency)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Yearly Commute</span>
                  <p className="text-base font-black text-slate-900">
                    {formatCurrency(inputs.country === 'CA' ? 1728 : 1027, inputs.currency)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Estimates derived from 2025/2026 regional statutory tax schedules.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-all"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
