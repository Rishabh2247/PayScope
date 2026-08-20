'use client';

import React, { useState, useEffect } from 'react';
import { FinancialInputs, CompleteFinancialSnapshot } from '../../lib/types';
import { isContractorRole } from '../../lib/formatters';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { TopKpiRow } from './TopKpiRow';
import { TaxBreakdown } from './TaxBreakdown';
import { IncomeBenchmark } from './IncomeBenchmark';
import { CostOfLiving } from './CostOfLiving';
import { HousingSnapshot } from './HousingSnapshot';
import { FuelCommute } from './FuelCommute';
import { RealIncomeCard } from './RealIncomeCard';
import { TaxEngineSection } from './TaxEngineSection';
import { RateAnalysisSection } from './RateAnalysisSection';
import { BenchmarksSection } from './BenchmarksSection';
import { HousingSection } from './HousingSection';
import { FuelCommuteSection } from './FuelCommuteSection';
import { RelocationSection } from './RelocationSection';
import { SupportBanner } from './SupportBanner';
import { GoogleAdSlot } from '../ads/GoogleAdSlot';

interface DashboardViewProps {
  inputs: FinancialInputs;
  snapshot: CompleteFinancialSnapshot;
  onInputsChange?: (newInputs: FinancialInputs) => void;
  initialTab?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inputs,
  snapshot,
  onInputsChange,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const isContractor = isContractorRole(inputs.employmentType);

  const handleQuickIncomeChange = (val: number) => {
    if (onInputsChange) {
      onInputsChange({
        ...inputs,
        incomeRate: val,
        annualSalary: isContractor
          ? val * inputs.workHoursPerWeek * inputs.weeksPerYear
          : val,
      });
    }
  };

  const currentAnnualCalc = isContractor
    ? inputs.incomeRate * inputs.workHoursPerWeek * inputs.weeksPerYear
    : inputs.incomeRate;

  return (
    <div className="py-6 flex flex-col md:flex-row gap-6 items-start">
      {/* Left Navigation Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} snapshot={snapshot} />

      {/* Right Main Dashboard Workspace Container */}
      <main className="flex-1 w-full space-y-6">
        {/* 1. Header Profile Banner */}
        <DashboardHeader inputs={inputs} />

        {/* 2. Top 4 KPI Metric Row */}
        <TopKpiRow snapshot={snapshot} onInputsChange={onInputsChange} />

        {/* 3. Active Section Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
            <RealIncomeCard snapshot={snapshot} onInputsChange={onInputsChange} />
            <TaxBreakdown snapshot={snapshot} onInputsChange={onInputsChange} />
            <HousingSnapshot snapshot={snapshot} onInputsChange={onInputsChange} />
            <FuelCommute snapshot={snapshot} />
            <IncomeBenchmark snapshot={snapshot} />
            <CostOfLiving snapshot={snapshot} />
          </div>
        )}

        {activeTab === 'tax-engine' && <TaxEngineSection snapshot={snapshot} onInputsChange={onInputsChange} />}
        {activeTab === 'rate-analysis' && <RateAnalysisSection snapshot={snapshot} onInputsChange={onInputsChange} />}
        {activeTab === 'housing' && <HousingSection snapshot={snapshot} onInputsChange={onInputsChange} />}
        {activeTab === 'fuel-commute' && <FuelCommuteSection snapshot={snapshot} />}
        {activeTab === 'relocation' && <RelocationSection snapshot={snapshot} onInputsChange={onInputsChange} />}
        {activeTab === 'benchmarks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <IncomeBenchmark snapshot={snapshot} />
            <CostOfLiving snapshot={snapshot} />
          </div>
        )}

        {/* 5. Support Community Banner */}
        <SupportBanner />
      </main>
    </div>
  );
};
