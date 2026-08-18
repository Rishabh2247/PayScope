'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency } from '../../lib/formatters';
import { Fuel, Car, ShieldCheck } from 'lucide-react';

interface FuelCommuteSectionProps {
  snapshot: CompleteFinancialSnapshot;
}

export const FuelCommuteSection: React.FC<FuelCommuteSectionProps> = ({ snapshot }) => {
  const { economic, inputs, tax } = snapshot;

  const [milesPerDay, setMilesPerDay] = useState(20);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [mpg, setMpg] = useState(28);
  const [transitMode, setTransitMode] = useState<'Car' | 'Hybrid' | 'EV' | 'Public Transit'>('Car');

  const weeksPerYear = inputs.weeksPerYear || 52;
  const takeHomeMonthly = tax.takeHomePayMonthly || 5000;

  // Mode calculations
  let baseDailyCost = inputs.country === 'CA' ? 7.20 : 4.28;
  if (transitMode === 'Hybrid') baseDailyCost *= 0.65;
  if (transitMode === 'EV') baseDailyCost *= 0.35;
  if (transitMode === 'Public Transit') baseDailyCost = inputs.country === 'CA' ? 6.50 : 3.50;

  const dailyFuelCost = baseDailyCost * (milesPerDay / 20);
  const weeklyFuelCost = dailyFuelCost * daysPerWeek;
  const monthlyFuelCost = (weeklyFuelCost * weeksPerYear) / 12;
  const annualFuelCost = monthlyFuelCost * 12;
  const commutePercentage = Math.round((monthlyFuelCost / takeHomeMonthly) * 100);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          <Fuel className="w-4 h-4" />
          <span>Commute Intelligence</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fuel & Commute Analysis</h2>
        <p className="text-xs text-slate-500 font-medium">
          See how much your commute costs and how it affects your income in {economic.cityLabel}.
        </p>
      </div>

      {/* Fuel Price Badge Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400">Current Local Fuel Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                {economic.currencySymbol}{economic.fuelPriceToday.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-500">{economic.fuelPriceUnit}</span>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
          <span>{economic.fuelPriceVsYesterday} vs yesterday</span>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Commute & Vehicle Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Transit Mode</label>
            <select
              value={transitMode}
              onChange={(e) => setTransitMode(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="Car">Car (Gasoline)</option>
              <option value="Hybrid">Hybrid Vehicle</option>
              <option value="EV">Electric Vehicle (EV)</option>
              <option value="Public Transit">Public Transit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Daily Commute Distance (miles)</label>
            <input
              type="number"
              value={milesPerDay}
              onChange={(e) => setMilesPerDay(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Commute Days / Week</label>
            <input
              type="number"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Vehicle MPG</label>
            <input
              type="number"
              value={mpg}
              onChange={(e) => setMpg(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Calculated Commute Cost Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Daily Cost</span>
          <p className="text-2xl font-black text-slate-900">
            {formatCurrency(dailyFuelCost, inputs.currency)}
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">{milesPerDay} miles/day</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Weekly Cost</span>
          <p className="text-2xl font-black text-slate-900">
            {formatCurrency(weeklyFuelCost, inputs.currency)}
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">{daysPerWeek} days/week</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Monthly Cost</span>
          <p className="text-2xl font-black text-indigo-600">
            {formatCurrency(monthlyFuelCost, inputs.currency)}
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">Monthly commute expense</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">Commute % Take-Home</span>
          <p className={`text-2xl font-black ${commutePercentage > 5 ? 'text-rose-500' : 'text-emerald-600'}`}>
            {commutePercentage}%
          </p>
          <p className="text-[10px] text-slate-500 font-semibold">Of monthly take-home pay</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between text-xs text-slate-400">
        <span>Fuel Data Source: U.S. EIA / GasBuddy / Natural Resources Canada ({economic.cityLabel})</span>
        <span className="flex items-center gap-1 font-semibold text-emerald-600">
          <ShieldCheck className="w-3.5 h-3.5" /> Updated: Live 2026
        </span>
      </div>
    </div>
  );
};
