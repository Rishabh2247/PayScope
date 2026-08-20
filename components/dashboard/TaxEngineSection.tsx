'use client';

import React from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, formatPercent, isContractorRole } from '../../lib/formatters';
import { Calculator, ArrowRight, ShieldCheck, Wallet, Info } from 'lucide-react';

interface TaxEngineSectionProps {
  snapshot: CompleteFinancialSnapshot;
  onInputsChange?: (newInputs: any) => void;
}

export const TaxEngineSection: React.FC<TaxEngineSectionProps> = ({ snapshot, onInputsChange }) => {
  const { tax, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);

  const billableHours = (inputs.workHoursPerWeek || 40) * (inputs.weeksPerYear || 52);
  const netHourly = tax.contractNetHourlyRate || (billableHours > 0 ? tax.takeHomePayAnnual / billableHours : 0);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#BFE5D3] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1F8F68] uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Tax Engine Analysis (2026 Statutory Rules)</span>
          </div>
          <span className="bg-[#EAF7F1] text-[#1F8F68] text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-[#BFE5D3]">
            Verified 2026 Engine
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tax Engine</h2>
          <p className="text-xs text-slate-500 font-medium pt-0.5">
            Calculation methodology for {inputs.employmentType} in {inputs.state}, {inputs.country} based on statutory 2026 brackets.
          </p>
        </div>

        {/* Data Source Traceability Box */}
        <div className="bg-[#F3FBF7] p-3 rounded-2xl border border-[#BFE5D3] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#12372A]">
            <ShieldCheck className="w-4 h-4 text-[#1F8F68] shrink-0" />
            <span className="font-bold">
              {inputs.country === 'CA' ? 'Canada Revenue Agency (CRA) & Ontario Ministry of Finance (2026 Rules)' :
               inputs.country === 'MX' ? 'Servicio de Administración Tributaria (SAT 2026 ISR & RESICO)' :
               inputs.country === 'BR' ? 'Receita Federal do Brasil (INSS & IRRF 2026 Rules)' :
               'Internal Revenue Service (IRS) & SSA (2026 FICA & Form 1040)'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#1F8F68] font-bold">
            <span>Year: 2026</span>
            <span>•</span>
            <span>Single Source Engine</span>
            <span>•</span>
            <span>100% Mathematically Consistent</span>
          </div>
        </div>
      </div>

      {isContractor ? (
        /* CONTRACTOR TAX ENGINE VIEW */
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Contract Billing Rate</span>
              <p className="text-2xl font-black text-emerald-600">
                {formatCurrency(tax.contractBillingRate, inputs.currency)}/hr
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">{billableHours.toLocaleString()} billable hrs/year</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Annual Contract Revenue</span>
              <p className="text-2xl font-black text-slate-900">
                {formatCurrency(tax.annualContractRevenue, inputs.currency)}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Before business expenses & taxes</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Est. Owner Compensation</span>
              <p className="text-2xl font-black text-indigo-600">
                {formatCurrency(tax.ownerCompensation, inputs.currency)}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">After corporate write-offs</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Est. Personal Take-Home</span>
              <p className="text-2xl font-black text-emerald-600">
                {formatCurrency(tax.takeHomePayAnnual, inputs.currency)}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Net: {formatCurrency(netHourly, inputs.currency)}/hr</p>
            </div>
          </div>

          {/* Visual Funnel Flow */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Corporate to Personal Tax Funnel</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center text-xs font-bold">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex-1 w-full">
                <span className="text-slate-400 text-[10px] uppercase block">Contract Revenue</span>
                <span className="text-sm text-slate-900">{formatCurrency(tax.annualContractRevenue, inputs.currency)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex-1 w-full">
                <span className="text-slate-400 text-[10px] uppercase block">Business Expenses</span>
                <span className="text-sm text-indigo-600">-{formatCurrency(tax.businessExpenses, inputs.currency)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex-1 w-full">
                <span className="text-slate-400 text-[10px] uppercase block">Corp / Business Tax</span>
                <span className="text-sm text-purple-600">-{formatCurrency(tax.businessTax, inputs.currency)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex-1 w-full">
                <span className="text-slate-400 text-[10px] uppercase block">Owner Draw</span>
                <span className="text-sm text-blue-600">{formatCurrency(tax.ownerCompensation, inputs.currency)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex-1 w-full">
                <span className="text-emerald-700 text-[10px] uppercase block">Personal Take-Home</span>
                <span className="text-sm text-emerald-700">{formatCurrency(tax.takeHomePayAnnual, inputs.currency)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Note: Personal take-home for incorporated/C2C contractors requires additional owner draw & accounting assumptions. Gross contract revenue is not personal income.
            </span>
          </div>
        </div>
      ) : (
        /* EMPLOYEE TAX ENGINE VIEW */
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Gross Annual Salary</span>
              <p className="text-2xl font-black text-slate-900">
                {formatCurrency(tax.annualGross, inputs.currency)}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">{formatCurrency(tax.monthlyGross, inputs.currency)}/month</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Total Deductions</span>
              <p className="text-2xl font-black text-rose-500">
                -{formatCurrency(tax.totalTax, inputs.currency)}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Effective tax rate: {formatPercent(tax.effectiveTaxRate)}</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Annual Take-Home</span>
              <p className="text-2xl font-black text-emerald-600">
                {formatCurrency(tax.takeHomePayAnnual, inputs.currency)}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">{formatPercent(tax.takeHomePercentage)} of gross</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400">Effective Net Hourly</span>
              <p className="text-2xl font-black text-indigo-600">
                {formatCurrency(tax.effectiveHourlyRate, inputs.currency)}/hr
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">Gross: {formatCurrency(tax.grossHourlyRate, inputs.currency)}/hr</p>
            </div>
          </div>

          {/* Visual Funnel Flow */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Gross to Net Pay Funnel</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center text-xs font-bold">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex-1 w-full">
                <span className="text-slate-400 text-[10px] uppercase block">Gross Income</span>
                <span className="text-sm text-slate-900">{formatCurrency(tax.annualGross, inputs.currency)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex-1 w-full">
                <span className="text-slate-400 text-[10px] uppercase block">Federal Tax</span>
                <span className="text-sm text-rose-500">-{formatCurrency(tax.federalTax, inputs.currency)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex-1 w-full">
                <span className="text-slate-400 text-[10px] uppercase block">State/Prov Tax</span>
                <span className="text-sm text-amber-500">-{formatCurrency(tax.stateTax, inputs.currency)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex-1 w-full">
                <span className="text-slate-400 text-[10px] uppercase block">Payroll / CPP / FICA</span>
                <span className="text-sm text-blue-500">-{formatCurrency(tax.socialSecurityTax + tax.medicareTax, inputs.currency)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex-1 w-full">
                <span className="text-emerald-700 text-[10px] uppercase block">Take-Home Pay</span>
                <span className="text-sm text-emerald-700">{formatCurrency(tax.takeHomePayAnnual, inputs.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Itemized Deduction Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Itemized Tax Deduction Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="py-2.5 px-1">Deduction Line Item</th>
                <th className="py-2.5 px-1 text-right">Annual Amount</th>
                <th className="py-2.5 px-1 text-right">Monthly Amount</th>
                <th className="py-2.5 px-1 text-right">% of Gross</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tax.breakdown.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
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
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
          <span>Source: Statutory 2025/2026 Tax Schedules ({inputs.country})</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Formula
          </span>
        </div>
      </div>
    </div>
  );
};
