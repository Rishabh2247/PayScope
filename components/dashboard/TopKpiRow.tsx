import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, formatPercent, isContractorRole } from '../../lib/formatters';
import { useTranslation } from '../../lib/i18n';
import { generateFinancialSnapshotPdf } from '../../lib/pdfReportEngine';
import { Wallet, Calendar, Clock, Download, ArrowRight, Pencil, ShieldCheck } from 'lucide-react';

import { AnimatedCounter } from '../ui/AnimatedCounter';

interface TopKpiRowProps {
  snapshot: CompleteFinancialSnapshot;
  onInputsChange?: (newInputs: any) => void;
}

export const TopKpiRow: React.FC<TopKpiRowProps> = ({ snapshot, onInputsChange }) => {
  const { t } = useTranslation();
  const { tax, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);
  const [isEditMode, setIsEditMode] = useState(false);

  const netHourly = tax.contractNetHourlyRate || (tax.annualBillableHours > 0 ? tax.takeHomePayAnnual / tax.annualBillableHours : 0);

  const handleDownloadPDF = () => {
    generateFinancialSnapshotPdf(snapshot);
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Inline Pen Edit Popover for KPI Row */}
      {isEditMode && (
        <div className="bg-[#F3FBF7] p-3 rounded-2xl border border-[#BFE5D3] space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-[#12372A]">
            <span>✏️ Customize Income & Filing Status:</span>
            <button onClick={() => setIsEditMode(false)} className="text-[10px] text-slate-400">✕ Close</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block">
                {isContractor ? 'Hourly Rate ($/hr)' : 'Gross Income ($/yr)'}:
              </label>
              <input
                type="number"
                value={inputs.incomeRate || ''}
                onChange={(e) =>
                  onInputsChange &&
                  onInputsChange({
                    ...inputs,
                    incomeRate: Number(e.target.value),
                    annualSalary: isContractor
                      ? Number(e.target.value) * inputs.workHoursPerWeek * inputs.weeksPerYear
                      : Number(e.target.value),
                  })
                }
                className="w-full px-2.5 py-1 bg-white border border-[#BFE5D3] rounded-lg font-bold text-[#12372A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block">Work Hours / Week:</label>
              <input
                type="number"
                value={inputs.workHoursPerWeek}
                onChange={(e) =>
                  onInputsChange && onInputsChange({ ...inputs, workHoursPerWeek: Number(e.target.value) })
                }
                className="w-full px-2.5 py-1 bg-white border border-[#BFE5D3] rounded-lg font-bold text-[#12372A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block">Filing Status:</label>
              <select
                value={inputs.filingStatus}
                onChange={(e) => onInputsChange && onInputsChange({ ...inputs, filingStatus: e.target.value })}
                className="w-full px-2.5 py-1 bg-white border border-[#BFE5D3] rounded-lg font-bold text-[#12372A]"
              >
                <option value="Single">Single</option>
                <option value="Married Jointly">Married Filing Jointly</option>
                <option value="Head of Household">Head of Household</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* CARD 1 */}
        <div className="bg-white p-5 rounded-3xl border border-[#BFE5D3] shadow-sm space-y-2 flex flex-col justify-between hover:border-[#1F8F68] transition-colors relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF7F1] text-[#1F8F68] flex items-center justify-center shrink-0">
                {isContractor ? <Clock className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">
                  {isContractor ? t.contractBillingRate : t.takeHomePay}
                </p>
                <p className="text-2xl font-black text-[#1F8F68]">
                  {isContractor ? (
                    <AnimatedCounter
                      value={tax.contractBillingRate}
                      formatter={(val) => `${formatCurrency(val, inputs.currency)}/hr`}
                    />
                  ) : (
                    <AnimatedCounter
                      value={tax.takeHomePayAnnual}
                      formatter={(val) => formatCurrency(val, inputs.currency)}
                    />
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="p-1.5 rounded-xl bg-[#F3FBF7] hover:bg-[#EAF7F1] text-[#1F8F68] border border-[#BFE5D3] transition-all cursor-pointer"
              title="Edit Values (Pen Icon)"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            {isContractor ? (
              <span>Net: <AnimatedCounter value={netHourly} formatter={(val) => `${formatCurrency(val, inputs.currency)}/hr`} /></span>
            ) : (
              t.afterTaxesDeductions
            )}
          </div>
          <div className="inline-block bg-[#EAF7F1] text-[#1F8F68] text-[10px] font-extrabold px-2 py-0.5 rounded-full w-fit">
            {isContractor
              ? `${tax.annualBillableHours.toLocaleString()} billable hrs/yr`
              : `${formatPercent(tax.takeHomePercentage)} ${t.grossIncome}`}
          </div>
        </div>

        {/* CARD 2 */}
        <div className="bg-white p-5 rounded-3xl border border-[#BFE5D3] shadow-sm space-y-2 flex flex-col justify-between hover:border-[#1F8F68] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF7F1] text-[#1F8F68] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">
                {isContractor ? t.monthlyRevenue : t.takeHomePay}
              </p>
              <p className="text-2xl font-black text-[#12372A]">
                <AnimatedCounter
                  value={isContractor ? tax.monthlyContractRevenue : tax.takeHomePayMonthly}
                  formatter={(val) => formatCurrency(val, inputs.currency)}
                />
              </p>
            </div>
          </div>
        <div className="text-[11px] text-slate-500 font-semibold">
          {isContractor
            ? `Net: ${formatCurrency(tax.takeHomePayMonthly, inputs.currency)}/mo`
            : t.monthlyNetIncome}
        </div>
        <div className="inline-block bg-[#EAF7F1] text-[#1F8F68] text-[10px] font-extrabold px-2 py-0.5 rounded-full w-fit">
          12 monthly pay cycles
        </div>
      </div>

      {/* CARD 3 */}
      <div className="bg-white p-5 rounded-3xl border border-[#BFE5D3] shadow-sm space-y-2 flex flex-col justify-between hover:border-[#1F8F68] transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF7F1] text-[#1F8F68] flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">
              {isContractor ? t.annualRevenue : t.effectiveHourlyRate}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#12372A]">
                {isContractor
                  ? formatCurrency(tax.annualContractRevenue, inputs.currency)
                  : formatCurrency(tax.effectiveHourlyRate, inputs.currency)}
              </span>
              {!isContractor && <span className="text-xs font-bold text-slate-500">/hr</span>}
            </div>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 font-semibold">
          {isContractor
            ? `Net: ${formatCurrency(tax.takeHomePayAnnual, inputs.currency)}/yr`
            : `${formatCurrency(tax.grossHourlyRate, inputs.currency)}/hr ${t.grossIncome}`}
        </div>
        <div className="inline-block bg-[#EAF7F1] text-[#1F8F68] text-[10px] font-extrabold px-2 py-0.5 rounded-full w-fit">
          {tax.annualBillableHours.toLocaleString()} hrs/yr
        </div>
      </div>

      {/* CARD 4: Effective Tax Rate & Deductions */}
      <div className="bg-white p-5 rounded-3xl border border-[#BFE5D3] shadow-sm space-y-2 flex flex-col justify-between hover:border-[#1F8F68] transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF7F1] text-[#1F8F68] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Effective Tax Rate</p>
            <p className="text-2xl font-black text-[#12372A]">
              <AnimatedCounter value={tax.effectiveTaxRate || 22.8} decimals={1} formatter={(val) => formatPercent(val)} />
            </p>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 font-semibold">
          Total Tax: {formatCurrency(tax.totalTax || 0, inputs.currency)}
        </div>
        <div className="inline-block bg-[#EAF7F1] text-[#1F8F68] text-[10px] font-extrabold px-2 py-0.5 rounded-full w-fit">
          Official 2026 Statutory Rules
        </div>
      </div>
    </div>
  </div>
);
};
