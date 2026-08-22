'use client';

import React from 'react';
import { FinancialInputs } from '../../lib/types';
import { isContractorRole, formatCurrency } from '../../lib/formatters';
import { useTranslation } from '../../lib/i18n';
import { MapPin, Briefcase, DollarSign, User, Users } from 'lucide-react';

interface DashboardHeaderProps {
  inputs: FinancialInputs;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ inputs }) => {
  const { t } = useTranslation();

  const visualBgMap: Record<string, string> = {
    US: '/assets/US Visual.png',
    CA: '/assets/Canada Visual.png',
    MX: '/assets/Mexico Visual.png',
    BR: '/assets/Brazil Visual.png',
  };

  const visualSrc = visualBgMap[inputs.country] || '/assets/US Visual.png';
  const isContractor = isContractorRole(inputs.employmentType);
  const displayIncome = isContractor
    ? inputs.incomeRate * inputs.workHoursPerWeek * inputs.weeksPerYear
    : (inputs.incomeRate || inputs.annualSalary || 0);

  return (
    <div className="relative rounded-3xl bg-white dark:bg-[#101512] border border-[#BFE5D3] dark:border-[#26302A] shadow-sm overflow-hidden min-h-[160px] flex items-center transition-colors duration-300">
      {/* Background Skyline Visual Image - Result Page Card Placement */}
      <div className="absolute right-0 top-0 bottom-0 w-3/4 sm:w-2/3 md:w-1/2 pointer-events-none overflow-hidden">
        <img
          src={visualSrc}
          alt="City skyline visual"
          width={600}
          height={200}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-right opacity-100 dark:opacity-80 scale-105"
        />
        {/* Soft left-to-right fade gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent dark:from-[#101512] dark:via-[#101512]/80 dark:to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-7 space-y-3.5 max-w-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F8F68] dark:text-[#22C55E]">
            <span>PayScope Intelligence</span>
            <span className="text-sm">✨</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#12372A] dark:text-[#F9FAFB] tracking-tight">
            {t.financialSnapshot}
          </h1>
        </div>

        {/* Input Parameter Chips Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#12372A] dark:text-[#F9FAFB] pt-0.5">
          {/* Location Chip */}
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-[#151C17]/90 backdrop-blur-md border border-[#BFE5D3] dark:border-[#26302A] px-3 py-1.5 rounded-full shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" />
            <span>
              {inputs.city}, {inputs.state}, {inputs.country}
            </span>
          </div>

          {/* Employment Chip */}
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-[#151C17]/90 backdrop-blur-md border border-[#BFE5D3] dark:border-[#26302A] px-3 py-1.5 rounded-full shadow-2xs">
            <Briefcase className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" />
            <span>{inputs.employmentType}</span>
          </div>

          {/* Income Chip */}
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-[#151C17]/90 backdrop-blur-md border border-[#BFE5D3] dark:border-[#26302A] px-3 py-1.5 rounded-full shadow-2xs">
            <DollarSign className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" />
            <span>
              {isContractor
                ? `${formatCurrency(inputs.incomeRate || 60, inputs.currency)}/hr (${formatCurrency(displayIncome, inputs.currency)}/yr)`
                : `${formatCurrency(displayIncome, inputs.currency)} ${t.annualSalaryLabel}`}
            </span>
          </div>

          {/* Filing Status Chip */}
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-[#151C17]/90 backdrop-blur-md border border-[#BFE5D3] dark:border-[#26302A] px-3 py-1.5 rounded-full shadow-2xs">
            <User className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" />
            <span>{inputs.filingStatus}</span>
          </div>

          {/* Dependents Chip */}
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-[#151C17]/90 backdrop-blur-md border border-[#BFE5D3] dark:border-[#26302A] px-3 py-1.5 rounded-full shadow-2xs">
            <Users className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E]" />
            <span>{inputs.dependents} {t.dependentsLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
