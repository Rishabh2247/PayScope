'use client';

import React from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency } from '../../lib/formatters';
import { Info, Car } from 'lucide-react';

interface FuelCommuteProps {
  snapshot: CompleteFinancialSnapshot;
}

export const FuelCommute: React.FC<FuelCommuteProps> = ({ snapshot }) => {
  const { economic, inputs } = snapshot;

  const mpg = 28;
  const milesPerDay = 20;
  const daysPerWeek = 5;
  const weeksPerYear = inputs.weeksPerYear || 52;

  const dailyFuelCost = inputs.country === 'CA' ? 7.20 : 4.28;
  const monthlyFuelCost = (dailyFuelCost * daysPerWeek * weeksPerYear) / 12;
  const annualFuelCost = monthlyFuelCost * 12;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4 overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Fuel & Commute</h3>
          <p className="text-xs text-slate-400">Based on {milesPerDay} miles one way in {economic.cityLabel}</p>
        </div>
        <Info className="w-4 h-4 text-slate-400 cursor-pointer shrink-0" />
      </div>

      {/* Fuel & Commute Subcards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Left Subcard: Fuel Price Today (5 cols) */}
        <div className="sm:col-span-5 bg-slate-50/90 p-3 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-1 min-w-0 overflow-hidden">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Fuel Price Today</p>
          <div>
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {economic.currencySymbol}{economic.fuelPriceToday.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{economic.fuelPriceUnit}</span>
            </div>
            <div className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 whitespace-nowrap">
              {economic.fuelPriceVsYesterday} vs yesterday
            </div>
          </div>
        </div>

        {/* Right Subcard: Commute Cost Est. (7 cols) */}
        <div className="sm:col-span-7 bg-slate-50/90 p-3 rounded-2xl border border-slate-100 space-y-1.5 min-w-0 overflow-hidden">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">Commute Cost (Est.)</p>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="bg-white py-1.5 px-1 rounded-xl border border-slate-100 min-w-0 overflow-hidden">
              <p className="text-[9px] text-slate-400 font-semibold truncate">Daily</p>
              <p className="text-[11px] font-bold text-slate-900 truncate">
                {formatCurrency(dailyFuelCost, inputs.currency)}
              </p>
            </div>
            <div className="bg-white py-1.5 px-1 rounded-xl border border-slate-100 min-w-0 overflow-hidden">
              <p className="text-[9px] text-slate-400 font-semibold truncate">Monthly</p>
              <p className="text-[11px] font-bold text-indigo-600 truncate">
                {formatCurrency(monthlyFuelCost, inputs.currency)}
              </p>
            </div>
            <div className="bg-white py-1.5 px-1 rounded-xl border border-slate-100 min-w-0 overflow-hidden">
              <p className="text-[9px] text-slate-400 font-semibold truncate">Yearly</p>
              <p className="text-[11px] font-bold text-slate-900 truncate">
                {formatCurrency(annualFuelCost, inputs.currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Specs Bar */}
      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600">
        <div className="flex items-center gap-1">
          <Car className="w-3.5 h-3.5 text-slate-700 shrink-0" />
          <span>{mpg} MPG</span>
        </div>
        <span className="text-slate-300">•</span>
        <span>{milesPerDay * 2} mi/day</span>
        <span className="text-slate-300">•</span>
        <span>5 days/wk</span>
        <span className="text-slate-300">•</span>
        <span>{weeksPerYear} wks/yr</span>
      </div>

      {/* Market Update Subcard */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Market Update</p>
            <p className="text-[10px] text-slate-500 truncate">{economic.cityLabel} Market</p>
          </div>
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
            Favoring renters
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 text-center pt-0.5">
          <div className="bg-white p-1 rounded-xl border border-slate-100 min-w-0 overflow-hidden">
            <p className="text-[8px] sm:text-[9px] text-slate-400 truncate">New</p>
            <p className="text-[10px] sm:text-[11px] font-bold text-emerald-600 truncate">↑ 8.2%</p>
          </div>
          <div className="bg-white p-1 rounded-xl border border-slate-100 min-w-0 overflow-hidden">
            <p className="text-[8px] sm:text-[9px] text-slate-400 truncate">Active</p>
            <p className="text-[10px] sm:text-[11px] font-bold text-emerald-600 truncate">↑ 6.7%</p>
          </div>
          <div className="bg-white p-1 rounded-xl border border-slate-100 min-w-0 overflow-hidden">
            <p className="text-[8px] sm:text-[9px] text-slate-400 truncate">Rent</p>
            <p className="text-[10px] sm:text-[11px] font-bold text-emerald-600 truncate">↓ 1.4%</p>
          </div>
          <div className="bg-white p-1 rounded-xl border border-slate-100 min-w-0 overflow-hidden">
            <p className="text-[8px] sm:text-[9px] text-slate-400 truncate">Days</p>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 truncate">↑ 5 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};
