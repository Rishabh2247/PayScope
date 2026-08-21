'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency } from '../../lib/formatters';
import { ArrowRight, RefreshCw, Info, Pencil } from 'lucide-react';
import { FullBreakdownModal } from './FullBreakdownModal';

interface HousingSnapshotProps {
  snapshot: CompleteFinancialSnapshot;
  onInputsChange?: (newInputs: any) => void;
}

export const HousingSnapshot: React.FC<HousingSnapshotProps> = ({ snapshot, onInputsChange }) => {
  const { economic, inputs, tax } = snapshot;
  const [activeMode, setActiveMode] = useState<'Rent' | 'Buy' | 'Room'>('Rent');
  const [bedroomFilter, setBedroomFilter] = useState('1 Bed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customRentOverride, setCustomRentOverride] = useState<number | null>(null);

  // Calculate dynamic mode multiplier for Rent vs Buy vs Room/Dorm
  const getModeMultiplier = () => {
    switch (activeMode) {
      case 'Buy':
        return 2.1; // Monthly mortgage estimate
      case 'Room':
        return 0.48; // Shared room / dorm estimate
      default:
        return 1.0; // Rent estimate
    }
  };

  const getBedroomMultiplier = () => {
    switch (bedroomFilter) {
      case '2 Bed':
        return 1.35;
      case 'Studio':
        return 0.82;
      default:
        return 1.0;
    }
  };

  const multiplier = getModeMultiplier() * getBedroomMultiplier();
  const takeHomeMonthly = tax.takeHomePayMonthly || 5000;

  const dynamicNeighborhoods = economic.neighborhoods.map((n) => {
    const adjustedRate = Math.round(n.typicalRent * multiplier);
    const burden = (adjustedRate / takeHomeMonthly) * 100;
    let affordability: 'Great' | 'Okay' | 'Stretch' | 'High Burden' = 'Great';
    if (burden > 42) affordability = 'High Burden';
    else if (burden > 32) affordability = 'Stretch';
    else if (burden > 24) affordability = 'Okay';

    return {
      ...n,
      typicalRate: adjustedRate,
      vsLastMonth: n.vsLastMonth,
      affordability,
      affordabilityScore: Math.round(burden),
    };
  });

  return (
    <>
      <div className="bg-white dark:bg-[#101512] p-5 rounded-3xl border border-[#BFE5D3] dark:border-[#26302A] shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4 hover:border-[#1F8F68] dark:hover:border-[#22C55E]/50 transition-colors">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#12372A] dark:text-[#F9FAFB]">Housing Snapshot</h3>
              <span className="bg-[#EAF7F1] dark:bg-[#151C17] text-[#1F8F68] dark:text-[#22C55E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                LIVE
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{economic.cityLabel}</span>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="p-1 rounded-lg bg-[#F3FBF7] dark:bg-[#151C17] hover:bg-[#EAF7F1] dark:hover:bg-[#1C251F] text-[#1F8F68] dark:text-[#22C55E] border border-[#BFE5D3] dark:border-[#26302A] transition-all cursor-pointer"
                title="Edit Housing Rent Values (Pen Icon)"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <Info className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E] cursor-pointer" />
            </div>
          </div>

          {/* Inline Pen Customizer */}
          {isEditMode && (
            <div className="bg-[#F3FBF7] dark:bg-[#151C17] p-2.5 rounded-2xl border border-[#BFE5D3] dark:border-[#26302A] space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-bold text-[#12372A] dark:text-[#F9FAFB]">
                <span>✏️ Custom Rent Override:</span>
                <button onClick={() => setIsEditMode(false)} className="text-[10px] text-slate-400">✕</button>
              </div>
              <input
                type="number"
                placeholder="Enter custom monthly rent (e.g. 1850)"
                value={customRentOverride || ''}
                onChange={(e) => setCustomRentOverride(Number(e.target.value))}
                className="w-full px-2 py-1 bg-white dark:bg-[#101512] border border-[#BFE5D3] dark:border-[#26302A] rounded-md font-bold text-[#12372A] dark:text-[#F9FAFB]"
              />
            </div>
          )}

          {/* Mode Tabs (Rent, Buy, Room/Dorm) */}
          <div className="flex items-center gap-1 p-1 bg-[#F3FBF7] dark:bg-[#151C17] rounded-xl border border-[#BFE5D3] dark:border-[#26302A] text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setActiveMode('Rent')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                activeMode === 'Rent' ? 'bg-[#1F8F68] dark:bg-[#22C55E] text-white shadow-xs font-extrabold' : 'hover:text-[#12372A] dark:hover:text-white'
              }`}
            >
              Rent
            </button>
            <button
              onClick={() => setActiveMode('Buy')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                activeMode === 'Buy' ? 'bg-[#1F8F68] dark:bg-[#22C55E] text-white shadow-xs font-extrabold' : 'hover:text-[#12372A] dark:hover:text-white'
              }`}
            >
              Buy (Mortgage)
            </button>
            <button
              onClick={() => setActiveMode('Room')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                activeMode === 'Room' ? 'bg-[#1F8F68] dark:bg-[#22C55E] text-white shadow-xs font-extrabold' : 'hover:text-[#12372A] dark:hover:text-white'
              }`}
            >
              Room / Dorm
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between text-xs font-semibold pt-1">
            <span className="text-[#12372A] dark:text-[#F9FAFB] font-extrabold text-xs">
              Top 5 Neighborhoods ({activeMode})
            </span>
            <div className="flex items-center gap-1.5">
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                className="bg-[#F3FBF7] dark:bg-[#151C17] border border-[#BFE5D3] dark:border-[#26302A] rounded-lg px-2 py-1 text-xs text-[#12372A] dark:text-[#F9FAFB] font-bold focus:outline-none focus:ring-2 focus:ring-[#1F8F68] dark:focus:ring-[#22C55E]"
              >
                <option value="1 Bed">1 Bed</option>
                <option value="2 Bed">2 Bed</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top 5 Neighborhoods Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#BFE5D3]/60 dark:border-[#26302A] text-slate-400 font-semibold text-[11px]">
                <th className="py-2 px-1">Neighborhood</th>
                <th className="py-2 px-1">Est. {activeMode === 'Buy' ? 'Mortgage' : 'Cost'}</th>
                <th className="py-2 px-1">vs Last Month</th>
                <th className="py-2 px-1 text-right">Affordability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-[#26302A]/40">
              {dynamicNeighborhoods.map((n, idx) => (
                <tr key={n.id} className="hover:bg-[#F3FBF7]/80 dark:hover:bg-[#151C17]/80 transition-colors">
                  <td className="py-2 px-1 font-bold text-[#12372A] dark:text-[#F9FAFB] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#EAF7F1] dark:bg-[#151C17] text-[#1F8F68] dark:text-[#22C55E] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[100px]">{n.name}</span>
                  </td>
                  <td className="py-2 px-1 font-extrabold text-[#12372A] dark:text-[#F9FAFB] whitespace-nowrap">
                    {formatCurrency(n.typicalRate, inputs.currency)}/mo
                  </td>
                  <td className="py-2 px-1 font-bold whitespace-nowrap">
                    {n.vsLastMonth < 0 ? (
                      <span className="text-[#1F8F68] dark:text-[#22C55E]">↓ {Math.abs(n.vsLastMonth)}%</span>
                    ) : (
                      <span className="text-[#1F8F68] dark:text-[#22C55E]">↑ {n.vsLastMonth}%</span>
                    )}
                  </td>
                  <td className="py-2 px-1 text-right whitespace-nowrap">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        n.affordability === 'Great'
                          ? 'bg-[#EAF7F1] dark:bg-[#151C17] text-[#1F8F68] dark:text-[#22C55E]'
                          : n.affordability === 'Okay'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {n.affordabilityScore}% {n.affordability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Link & Timestamp */}
        <div className="flex items-center justify-between border-t border-[#BFE5D3]/60 dark:border-[#26302A] pt-3 text-xs">
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-bold text-[#1F8F68] dark:text-[#22C55E] hover:text-[#176F52] dark:hover:text-[#16A34A] inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View full breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-400">
            <span>Data updated: 2026</span>
            <RefreshCw className="w-3.5 h-3.5 text-[#1F8F68] dark:text-[#22C55E] cursor-pointer" />
          </div>
        </div>
      </div>

      <FullBreakdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        snapshot={snapshot}
        initialTab="housing"
      />
    </>
  );
};
