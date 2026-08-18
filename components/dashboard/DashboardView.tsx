'use client';

import React, { useState, useEffect } from 'react';
import { FinancialInputs, CompleteFinancialSnapshot } from '../../lib/types';
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
  initialTab?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inputs,
  snapshot,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="py-6 flex flex-col md:flex-row gap-6 items-start">
      {/* Left Navigation Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Right Main Dashboard Workspace Container */}
      <main className="flex-1 w-full space-y-6">
        {/* 1. Header Profile Banner */}
        <DashboardHeader inputs={inputs} />

        {/* 2. Top 4 KPI Metric Row */}
        <TopKpiRow snapshot={snapshot} />

        {/* 3. In-Feed Google Ad Slot */}
        <GoogleAdSlot type="in-feed" adSlotId="dashboard-infeed-01" className="my-2" />

        {/* 4. Active Section Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
            {/* Card 1: Tax / Income Breakdown */}
            <TaxBreakdown snapshot={snapshot} />

            {/* Card 2: Income vs Local Benchmark */}
            <IncomeBenchmark snapshot={snapshot} />

            {/* Card 3: Cost of Living Breakdown */}
            <CostOfLiving snapshot={snapshot} />

            {/* Card 4: Housing Snapshot */}
            <HousingSnapshot snapshot={snapshot} />

            {/* Card 5: Fuel & Commute Cost */}
            <FuelCommute snapshot={snapshot} />

            {/* Card 6: Real Income After Expenses */}
            <RealIncomeCard snapshot={snapshot} />
          </div>
        )}

        {activeTab === 'tax-engine' && <TaxEngineSection snapshot={snapshot} />}
        {activeTab === 'rate-analysis' && <RateAnalysisSection snapshot={snapshot} />}
        {activeTab === 'benchmarks' && <BenchmarksSection snapshot={snapshot} />}
        {activeTab === 'housing' && <HousingSection snapshot={snapshot} />}
        {activeTab === 'fuel-commute' && <FuelCommuteSection snapshot={snapshot} />}
        {activeTab === 'relocation' && <RelocationSection snapshot={snapshot} />}

        {/* 5. Support Community Banner */}
        <SupportBanner />
      </main>
    </div>
  );
};
