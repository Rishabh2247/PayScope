'use client';

import React, { useState, useMemo } from 'react';
import { FinancialInputs } from '../../../lib/types';
import { calculateSnapshot } from '../../../lib/engine';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { DashboardView } from '../../../components/dashboard/DashboardView';

export default function HousingPage() {
  const [inputs, setInputs] = useState<FinancialInputs>({
    country: 'US',
    currency: 'USD',
    employmentType: 'Full-time Employee',
    incomeRate: 120000,
    annualSalary: 120000,
    state: 'Texas',
    city: 'Austin',
    filingStatus: 'Single',
    dependents: 0,
    workHoursPerWeek: 40,
    weeksPerYear: 52,
  });

  const snapshot = useMemo(() => calculateSnapshot(inputs), [inputs]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        country={inputs.country}
        currency={inputs.currency}
        onCountryChange={(c) => setInputs((prev) => ({ ...prev, country: c }))}
        onCurrencyChange={(curr) => setInputs((prev) => ({ ...prev, currency: curr }))}
        activeView="dashboard"
        onSwitchView={() => {}}
        onReset={() => {}}
      />
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <DashboardView inputs={inputs} snapshot={snapshot} initialTab="housing" />
      </div>
      <Footer />
    </div>
  );
}
