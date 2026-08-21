'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency } from '../../lib/formatters';
import { useTranslation } from '../../lib/i18n';
import { Info, Car } from 'lucide-react';

interface FuelCommuteProps {
  snapshot: CompleteFinancialSnapshot;
}

export const FuelCommute: React.FC<FuelCommuteProps> = ({ snapshot }) => {
  const { t } = useTranslation();
  const { economic, inputs } = snapshot;

  const [commuteMode, setCommuteMode] = useState<'Gasoline' | 'Hybrid' | 'EV' | 'Public Transit'>('Gasoline');
  
  const liveGasPrice = economic.fuelPriceToday || (inputs.country === 'CA' ? 1.65 : 3.45);
  const liveEvPrice = 0.16; // $ / kWh
  const liveTransitPrice = inputs.country === 'CA' ? 7.50 : 5.50; // $ / day

  const [customPrice, setCustomPrice] = useState<number>(liveGasPrice);
  const [milesPerDay, setMilesPerDay] = useState<number>(20);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);

  const weeksPerYear = inputs.weeksPerYear || 52;

  const handleModeChange = (mode: 'Gasoline' | 'Hybrid' | 'EV' | 'Public Transit') => {
    setCommuteMode(mode);
    if (mode === 'Gasoline') setCustomPrice(liveGasPrice);
    if (mode === 'Hybrid') setCustomPrice(liveGasPrice);
    if (mode === 'EV') setCustomPrice(liveEvPrice);
    if (mode === 'Public Transit') setCustomPrice(liveTransitPrice);
  };

  // Calculate daily cost based on user inputs
  const getDailyCost = () => {
    const roundtrip = milesPerDay * 2;
    const price = customPrice > 0 ? customPrice : liveGasPrice;

    switch (commuteMode) {
      case 'Hybrid':
        return (roundtrip / 48) * price;
      case 'EV':
        return (roundtrip / 3.8) * price;
      case 'Public Transit':
        return price;
      case 'Gasoline':
      default:
        return (roundtrip / 28) * price;
    }
  };

  const dailyCost = getDailyCost();
  const monthlyCost = (dailyCost * daysPerWeek * weeksPerYear) / 12;
  const annualCost = monthlyCost * 12;

  const modeIcons: Record<string, string> = {
    Gasoline: '⛽',
    Hybrid: '🔋',
    EV: '⚡',
    'Public Transit': '🚌',
  };

  return (
    <div className="bg-white dark:bg-[#101512] p-5 rounded-3xl border border-[#BFE5D3] dark:border-[#26302A] shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4 hover:border-[#1F8F68] dark:hover:border-[#22C55E]/50 transition-colors">
      {/* Title & Live Prices Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#12372A] dark:text-[#F9FAFB]">{t.fuelCommuteTitle}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{economic.cityLabel} Live Prices</p>
          </div>
          <Info className="w-4 h-4 text-[#1F8F68] dark:text-[#22C55E] cursor-pointer shrink-0" />
        </div>

        {/* Minimal Live Price Badges Bar */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-[#12372A] dark:text-[#F9FAFB]">
          <span className="bg-[#EAF7F1] dark:bg-[#151C17] text-[#1F8F68] dark:text-[#22C55E] border border-[#BFE5D3] dark:border-[#26302A] px-2 py-0.5 rounded-lg flex items-center gap-1">
            ⛽ Gas: ${liveGasPrice.toFixed(2)}/{economic.fuelPriceUnit || 'gal'}
          </span>
          <span className="bg-[#EAF7F1] dark:bg-[#151C17] text-[#1F8F68] dark:text-[#22C55E] border border-[#BFE5D3] dark:border-[#26302A] px-2 py-0.5 rounded-lg flex items-center gap-1">
            ⚡ EV: ${liveEvPrice.toFixed(2)}/kWh
          </span>
          <span className="bg-[#EAF7F1] dark:bg-[#151C17] text-[#1F8F68] dark:text-[#22C55E] border border-[#BFE5D3] dark:border-[#26302A] px-2 py-0.5 rounded-lg flex items-center gap-1">
            🚌 Transit: ${liveTransitPrice.toFixed(2)}/day
          </span>
        </div>
      </div>

      {/* Transit Mode Selection */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#F3FBF7] dark:bg-[#151C17] rounded-xl border border-[#BFE5D3] dark:border-[#26302A] text-xs font-bold text-[#12372A] dark:text-[#F9FAFB]">
        {(['Gasoline', 'Hybrid', 'EV', 'Public Transit'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => handleModeChange(mode)}
            className={`py-1 px-1 rounded-lg transition-all text-center truncate cursor-pointer flex items-center justify-center gap-1 ${
              commuteMode === mode
                ? 'bg-[#1F8F68] dark:bg-[#22C55E] text-white shadow-xs font-extrabold'
                : 'hover:text-[#12372A] dark:hover:text-white hover:bg-[#EAF7F1] dark:hover:bg-[#1C251F] text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>{modeIcons[mode]}</span>
            <span className="hidden sm:inline truncate">{mode}</span>
          </button>
        ))}
      </div>

      {/* Minimal Numerical Inputs (NO Sliders) */}
      <div className="bg-[#F3FBF7] dark:bg-[#151C17] p-3 rounded-2xl border border-[#BFE5D3] dark:border-[#26302A] space-y-2.5 text-xs">
        <div className="grid grid-cols-3 gap-2">
          {/* User Price Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#12372A] dark:text-[#F9FAFB] block">
              {commuteMode === 'EV' ? 'Price ($/kWh)' : commuteMode === 'Public Transit' ? 'Fare ($/day)' : 'Gas ($/gal)'}
            </label>
            <input
              type="number"
              step="0.05"
              value={customPrice || ''}
              onChange={(e) => setCustomPrice(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white dark:bg-[#101512] border border-[#BFE5D3] dark:border-[#26302A] rounded-lg text-[#12372A] dark:text-[#F9FAFB] font-bold text-center focus:ring-2 focus:ring-[#1F8F68] dark:focus:ring-[#22C55E]"
            />
          </div>

          {/* User Miles Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#12372A] dark:text-[#F9FAFB] block">One-way Miles</label>
            <input
              type="number"
              value={milesPerDay || ''}
              onChange={(e) => setMilesPerDay(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white dark:bg-[#101512] border border-[#BFE5D3] dark:border-[#26302A] rounded-lg text-[#12372A] dark:text-[#F9FAFB] font-bold text-center focus:ring-2 focus:ring-[#1F8F68] dark:focus:ring-[#22C55E]"
            />
          </div>

          {/* User Days Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#12372A] dark:text-[#F9FAFB] block">Days / Week</label>
            <input
              type="number"
              min={1}
              max={7}
              value={daysPerWeek || ''}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white dark:bg-[#101512] border border-[#BFE5D3] dark:border-[#26302A] rounded-lg text-[#12372A] dark:text-[#F9FAFB] font-bold text-center focus:ring-2 focus:ring-[#1F8F68] dark:focus:ring-[#22C55E]"
            />
          </div>
        </div>
      </div>

      {/* Calculated Commute Cost Results */}
      <div className="bg-[#F3FBF7] dark:bg-[#151C17] p-3 rounded-2xl border border-[#BFE5D3] dark:border-[#26302A] space-y-1.5 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between text-[10px] font-bold text-[#1F8F68] dark:text-[#22C55E] uppercase tracking-wider">
          <span>{commuteMode} Cost Result</span>
          <span className="text-[#12372A] dark:text-[#F9FAFB] bg-white dark:bg-[#101512] px-2 py-0.5 rounded-md border border-[#BFE5D3] dark:border-[#26302A]">
            {milesPerDay * 2} mi/day · {daysPerWeek}d/wk
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="bg-white dark:bg-[#101512] py-1.5 px-1 rounded-xl border border-[#BFE5D3]/60 dark:border-[#26302A] min-w-0 overflow-hidden">
            <p className="text-[9px] text-slate-400 dark:text-slate-400 font-semibold truncate">Daily</p>
            <p className="text-[11px] font-extrabold text-[#12372A] dark:text-[#F9FAFB] truncate">
              {formatCurrency(dailyCost, inputs.currency)}
            </p>
          </div>
          <div className="bg-white dark:bg-[#101512] py-1.5 px-1 rounded-xl border border-[#BFE5D3]/60 dark:border-[#26302A] min-w-0 overflow-hidden">
            <p className="text-[9px] text-slate-400 dark:text-slate-400 font-semibold truncate">Monthly</p>
            <p className="text-[11px] font-black text-[#1F8F68] dark:text-[#22C55E] truncate">
              {formatCurrency(monthlyCost, inputs.currency)}
            </p>
          </div>
          <div className="bg-white dark:bg-[#101512] py-1.5 px-1 rounded-xl border border-[#BFE5D3]/60 dark:border-[#26302A] min-w-0 overflow-hidden">
            <p className="text-[9px] text-slate-400 dark:text-slate-400 font-semibold truncate">Yearly</p>
            <p className="text-[11px] font-extrabold text-[#12372A] dark:text-[#F9FAFB] truncate">
              {formatCurrency(annualCost, inputs.currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
