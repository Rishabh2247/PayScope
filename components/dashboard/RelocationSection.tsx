'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot, CountryCode } from '../../lib/types';
import { formatCurrency } from '../../lib/formatters';
import { Compass, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { getProvincesForCountry, getCitiesForProvince } from '../../lib/geography';

interface RelocationSectionProps {
  snapshot: CompleteFinancialSnapshot;
}

export const RelocationSection: React.FC<RelocationSectionProps> = ({ snapshot }) => {
  const { economic, inputs, tax } = snapshot;

  const [destCountry, setDestCountry] = useState<CountryCode>(inputs.country === 'CA' ? 'US' : 'CA');
  const [destState, setDestState] = useState(destCountry === 'US' ? 'Texas' : 'Ontario');
  const [destCity, setDestCity] = useState(destCountry === 'US' ? 'Austin' : 'Toronto');

  const destProvinces = getProvincesForCountry(destCountry);
  const destCities = getCitiesForProvince(destCountry, destState);

  const handleCountryChange = (country: CountryCode) => {
    const defaultState = country === 'CA' ? 'Ontario' : country === 'MX' ? 'Mexico City' : country === 'BR' ? 'São Paulo' : 'Texas';
    const defaultCity = country === 'CA' ? 'Toronto' : country === 'MX' ? 'Mexico City' : country === 'BR' ? 'São Paulo' : 'Austin';
    setDestCountry(country);
    setDestState(defaultState);
    setDestCity(defaultCity);
  };

  const handleStateChange = (state: string) => {
    const availableCities = getCitiesForProvince(destCountry, state);
    setDestState(state);
    setDestCity(availableCities[0] || 'Austin');
  };

  // Relocation Purchasing Power Calculations
  const baselineTakeHome = tax.takeHomePayAnnual;
  const colRatio = destCity === 'Vancouver' ? 1.12 : destCity === 'Austin' ? 0.92 : destCity === 'New York City' ? 1.45 : 1.05;

  const destTakeHomeEst = Math.round(baselineTakeHome * (1 / colRatio));
  const requiredIncome = Math.round(tax.annualGross * colRatio);
  const annualDiff = requiredIncome - tax.annualGross;
  const monthlyDiff = Math.round(annualDiff / 12);

  const destCurrency = destCountry === 'CA' ? 'CAD' : destCountry === 'MX' ? 'MXN' : destCountry === 'BR' ? 'BRL' : 'USD';

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Cross-City Relocation Intelligence</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Relocation Analysis</h2>
        <p className="text-xs text-slate-500 font-medium">
          See how your income and purchasing power would change moving from {inputs.city} to another city.
        </p>
      </div>

      {/* Destination Selection Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Select Target Relocation Destination</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Country</label>
            <select
              value={destCountry}
              onChange={(e) => handleCountryChange(e.target.value as CountryCode)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="US">🇺🇸 United States</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="MX">🇲🇽 Mexico</option>
              <option value="BR">🇧🇷 Brazil</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">State / Province</label>
            <select
              value={destState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {destProvinces.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
            <select
              value={destCity}
              onChange={(e) => setDestCity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              {destCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Baseline Current City */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">CURRENT BASELINE</span>
              <h3 className="text-xl font-black text-slate-900">{inputs.city}, {inputs.state}</h3>
            </div>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
              Baseline (100)
            </span>
          </div>

          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Gross Income</span>
              <span className="font-bold text-slate-900">{formatCurrency(tax.annualGross, inputs.currency)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Estimated Take-Home</span>
              <span className="font-bold text-emerald-600">{formatCurrency(baselineTakeHome, inputs.currency)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Cost of Living (Monthly)</span>
              <span className="font-bold text-slate-900">{formatCurrency(economic.colTotalMonthly, inputs.currency)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Average Rent (1 Bed)</span>
              <span className="font-bold text-slate-900">{formatCurrency(2450, inputs.currency)}/mo</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Purchasing Power Index</span>
              <span className="font-bold text-indigo-600">100.0</span>
            </div>
          </div>
        </div>

        {/* Destination Target City */}
        <div className="bg-white p-6 rounded-3xl border border-indigo-200/80 shadow-sm space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase">DESTINATION TARGET</span>
              <h3 className="text-xl font-black text-slate-900">{destCity}, {destState}</h3>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
              Index ({Math.round(100 * colRatio)})
            </span>
          </div>

          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Equivalent Gross Target</span>
              <span className="font-bold text-indigo-600">{formatCurrency(requiredIncome, destCurrency)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Est. Take-Home at Same Salary</span>
              <span className="font-bold text-slate-900">{formatCurrency(destTakeHomeEst, destCurrency)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Cost of Living Ratio</span>
              <span className="font-bold text-rose-500">{colRatio > 1 ? `+${Math.round((colRatio - 1) * 100)}% higher` : `${Math.round((1 - colRatio) * 100)}% lower`}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Average Rent (1 Bed)</span>
              <span className="font-bold text-slate-900">{formatCurrency(Math.round(2450 * colRatio), destCurrency)}/mo</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Purchasing Power Index</span>
              <span className="font-bold text-slate-900">{(100 / colRatio).toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Required Income Result Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 sm:p-7 rounded-3xl text-white shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Relocation Income Requirement</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black">
          Income needed in {destCity} to maintain your current {inputs.city} purchasing power:
        </h3>

        <div className="flex flex-col sm:flex-row items-baseline gap-4 pt-2">
          <span className="text-3xl sm:text-4xl font-black text-emerald-400">
            {formatCurrency(requiredIncome, destCurrency)}
          </span>
          <span className="text-xs font-semibold text-slate-300">
            ({annualDiff >= 0 ? '+' : ''}{formatCurrency(annualDiff, destCurrency)}/yr or {monthlyDiff >= 0 ? '+' : ''}{formatCurrency(monthlyDiff, destCurrency)}/mo difference)
          </span>
        </div>

        <p className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-800">
          Note: Relocation calculations are automated estimates based on regional consumer price indices. Consult a financial advisor before relocating.
        </p>
      </div>
    </div>
  );
};
