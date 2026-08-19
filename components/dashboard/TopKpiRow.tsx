'use client';

import React from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency, formatPercent, isContractorRole } from '../../lib/formatters';
import { useTranslation } from '../../lib/i18n';
import { Wallet, Calendar, Clock, Download, ArrowRight } from 'lucide-react';

interface TopKpiRowProps {
  snapshot: CompleteFinancialSnapshot;
}

export const TopKpiRow: React.FC<TopKpiRowProps> = ({ snapshot }) => {
  const { t } = useTranslation();
  const { tax, inputs } = snapshot;
  const isContractor = isContractorRole(inputs.employmentType);

  const netHourly = tax.contractNetHourlyRate || (tax.annualBillableHours > 0 ? tax.takeHomePayAnnual / tax.annualBillableHours : 0);

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
      {/* CARD 1 */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            {isContractor ? <Clock className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">
              {isContractor ? t.contractBillingRate : t.takeHomePay}
            </p>
            <p className="text-2xl font-black text-emerald-600">
              {isContractor
                ? `${formatCurrency(tax.contractBillingRate, inputs.currency)}/hr`
                : formatCurrency(tax.takeHomePayAnnual, inputs.currency)}
            </p>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 font-semibold">
          {isContractor
            ? `Net: ${formatCurrency(netHourly, inputs.currency)}/hr`
            : t.afterTaxesDeductions}
        </div>
        <div className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
          {isContractor
            ? `${tax.annualBillableHours.toLocaleString()} billable hrs/yr`
            : `${formatPercent(tax.takeHomePercentage)} ${t.grossIncome}`}
        </div>
      </div>

      {/* CARD 2 */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">
              {isContractor ? t.monthlyRevenue : t.takeHomePay}
            </p>
            <p className="text-2xl font-black text-slate-900">
              {formatCurrency(
                isContractor ? tax.monthlyContractRevenue : tax.takeHomePayMonthly,
                inputs.currency
              )}
            </p>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 font-semibold">
          {isContractor
            ? `Net: ${formatCurrency(tax.takeHomePayMonthly, inputs.currency)}/mo`
            : t.monthlyNetIncome}
        </div>
        <div className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
          12 monthly billing cycles
        </div>
      </div>

      {/* CARD 3 */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">
              {isContractor ? t.annualRevenue : t.effectiveHourlyRate}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
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
        <div className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
          {tax.annualBillableHours.toLocaleString()} hrs/yr
        </div>
      </div>

      {/* CARD 4 */}
      <div
        onClick={handleDownloadPDF}
        className="bg-indigo-50/60 hover:bg-indigo-50 border border-indigo-200/80 rounded-3xl p-5 shadow-sm cursor-pointer transition-all flex items-center justify-between group h-full"
      >
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <p className="text-sm font-bold text-indigo-950">{t.downloadReport}</p>
          <p className="text-xs text-indigo-600/80 font-medium">{t.detailedBreakdown}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:translate-x-1 transition-transform">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
