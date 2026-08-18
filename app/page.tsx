'use client';

import React, { useState, useMemo } from 'react';
import { FinancialInputs, CountryCode, CurrencyCode } from '../lib/types';
import { calculateSnapshot } from '../lib/engine';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/hero/HeroSection';
import { DashboardView } from '../components/dashboard/DashboardView';
import { GoogleAdSlot } from '../components/ads/GoogleAdSlot';

export default function Home() {
  const [activeView, setActiveView] = useState<'hero' | 'dashboard'>('hero');

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

  const snapshot = useMemo(() => {
    return calculateSnapshot(inputs);
  }, [inputs]);

  const handleCountryChange = (country: CountryCode) => {
    let defaultCurrency: CurrencyCode = 'USD';
    let defaultEmployment = 'Full-time Employee';
    let defaultState = 'Texas';
    let defaultCity = 'Austin';

    if (country === 'CA') {
      defaultCurrency = 'CAD';
      defaultEmployment = 'Full-time Employee';
      defaultState = 'Ontario';
      defaultCity = 'Toronto';
    } else if (country === 'MX') {
      defaultCurrency = 'MXN';
      defaultEmployment = 'Full-time Employee';
      defaultState = 'Mexico City';
      defaultCity = 'Mexico City';
    } else if (country === 'BR') {
      defaultCurrency = 'BRL';
      defaultEmployment = 'Full-time Employee';
      defaultState = 'São Paulo';
      defaultCity = 'São Paulo';
    }

    setInputs((prev) => ({
      ...prev,
      country,
      currency: defaultCurrency,
      employmentType: defaultEmployment,
      state: defaultState,
      city: defaultCity,
    }));
  };

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setInputs((prev) => ({
      ...prev,
      currency,
    }));
  };

  const handleReset = () => {
    setActiveView('hero');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar Header */}
      <Navbar
        country={inputs.country}
        currency={inputs.currency}
        onCountryChange={handleCountryChange}
        onCurrencyChange={handleCurrencyChange}
        activeView={activeView}
        onSwitchView={setActiveView}
        onReset={handleReset}
      />

      {/* Top Google Leaderboard Ad Space */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <GoogleAdSlot type="leaderboard" adSlotId="top-leaderboard-01" />
      </div>

      {/* Main Container - Expanded Width (max-w-[1440px]) for Spacious Cards */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {activeView === 'hero' ? (
          <HeroSection
            inputs={inputs}
            snapshot={snapshot}
            onInputsChange={setInputs}
            onCalculate={() => setActiveView('dashboard')}
          />
        ) : (
          <DashboardView inputs={inputs} snapshot={snapshot} />
        )}
      </div>

      {/* Bottom Google Leaderboard Ad Space */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <GoogleAdSlot type="in-feed" adSlotId="bottom-leaderboard-02" />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
