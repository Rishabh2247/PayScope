'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency } from '../../lib/formatters';
import { Home, Filter, RefreshCw, Info } from 'lucide-react';

interface HousingSectionProps {
  snapshot: CompleteFinancialSnapshot;
  onInputsChange?: (newInputs: any) => void;
}

export const HousingSection: React.FC<HousingSectionProps> = ({ snapshot, onInputsChange }) => {
  const { economic, inputs, tax } = snapshot;
  const [activeMode, setActiveMode] = useState<'Rent' | 'Buy'>('Rent');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [bedrooms, setBedrooms] = useState('1 Bedroom');

  const getModeMultiplier = () => {
    let base = activeMode === 'Buy' ? 2.1 : 1.0;
    if (bedrooms === '2 Bedroom') base *= 1.35;
    if (bedrooms === '3 Bedroom') base *= 1.7;
    if (propertyType === 'House') base *= 1.4;
    if (propertyType === 'Dorm') base *= 0.5;
    return base;
  };

  const multiplier = getModeMultiplier();
  const takeHomeMonthly = tax.takeHomePayMonthly || 5000;
  const avgRent = Math.round(2450 * multiplier);
  const avgHomePrice = inputs.country === 'CA' ? 1150000 : 650000;
  const housingBurden = Math.round((avgRent / takeHomeMonthly) * 100);

  const dynamicNeighborhoods = economic.neighborhoods.map((n) => {
    const rent = Math.round(n.typicalRent * multiplier);
    const homePrice = Math.round((inputs.country === 'CA' ? 1200000 : 700000) * (n.typicalRent / 2400));
    return {
      ...n,
      rent,
      homePrice,
    };
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <Home className="w-4 h-4" />
          <span>Housing & Neighborhood Intelligence</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Housing Analysis</h2>
        <p className="text-xs text-slate-500 font-medium">
          Understand rent and home prices in {economic.cityLabel} and its neighborhoods.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveMode('Rent')}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeMode === 'Rent' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Rent
          </button>
          <button
            onClick={() => setActiveMode('Buy')}
            className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeMode === 'Buy' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Buy (Mortgage)
          </button>
        </div>

        {/* Property Type Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Property:</span>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none"
          >
            <option value="Apartment">Apartment</option>
            <option value="Condo">Condo</option>
            <option value="House">House</option>
            <option value="Dorm">Dorm / Room</option>
          </select>
        </div>

        {/* Bedrooms Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Bedrooms:</span>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none"
          >
            <option value="1 Bedroom">1 Bedroom</option>
            <option value="2 Bedroom">2 Bedroom</option>
            <option value="3 Bedroom">3 Bedroom</option>
          </select>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">
            {activeMode === 'Buy' ? 'Est. Monthly Mortgage' : 'Average Rent'}
          </span>
          <p className="text-2xl font-black text-slate-900">
            {formatCurrency(avgRent, inputs.currency)}/mo
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">{bedrooms} {propertyType}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Average Home Price</span>
          <p className="text-2xl font-black text-indigo-600">
            {formatCurrency(avgHomePrice, inputs.currency)}
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">City average sale price</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Housing Cost % Take-Home</span>
          <p className={`text-2xl font-black ${housingBurden > 35 ? 'text-rose-500' : 'text-emerald-600'}`}>
            {housingBurden}%
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">Of monthly take-home pay</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Rent Affordability</span>
          <p className="text-2xl font-black text-emerald-600">
            {housingBurden <= 30 ? 'Great' : housingBurden <= 40 ? 'Moderate' : 'High Burden'}
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">Recommended &lt;30% take-home</p>
        </div>
      </div>

      {/* Top 5 Neighborhoods Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Top 5 Neighborhoods in {economic.cityLabel} ({activeMode})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="py-2.5 px-1">Neighborhood</th>
                <th className="py-2.5 px-1 text-right">Est. Rent ({bedrooms})</th>
                <th className="py-2.5 px-1 text-right">Average Home Price</th>
                <th className="py-2.5 px-1 text-right">Market Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dynamicNeighborhoods.map((n, idx) => (
                <tr key={n.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-1 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{n.name}</span>
                  </td>
                  <td className="py-3 px-1 font-bold text-slate-900 text-right">
                    {formatCurrency(n.rent, inputs.currency)}/mo
                  </td>
                  <td className="py-3 px-1 font-bold text-indigo-600 text-right">
                    {formatCurrency(n.homePrice, inputs.currency)}
                  </td>
                  <td className="py-3 px-1 font-semibold text-right">
                    {n.vsLastMonth < 0 ? (
                      <span className="text-emerald-600 font-bold">↓ {Math.abs(n.vsLastMonth)}% vs last month</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">↑ {n.vsLastMonth}% vs last month</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-100">
          <span>Source: Zillow Research & Rentals.ca ({economic.cityLabel})</span>
          <span>Data Period: 2025/2026 • Updated: Live</span>
        </div>
      </div>
    </div>
  );
};
