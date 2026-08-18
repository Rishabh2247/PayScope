'use client';

import React, { useState } from 'react';
import { CompleteFinancialSnapshot } from '../../lib/types';
import { formatCurrency } from '../../lib/formatters';
import { ArrowRight, RefreshCw, Info } from 'lucide-react';
import { FullBreakdownModal } from './FullBreakdownModal';

interface HousingSnapshotProps {
  snapshot: CompleteFinancialSnapshot;
}

export const HousingSnapshot: React.FC<HousingSnapshotProps> = ({ snapshot }) => {
  const { economic, inputs, tax } = snapshot;
  const [activeMode, setActiveMode] = useState<'Rent' | 'Buy' | 'Room'>('Rent');
  const [bedroomFilter, setBedroomFilter] = useState('1 Bed');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full min-h-[380px] space-y-4">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Housing Snapshot</h3>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                LIVE
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span>{economic.cityLabel}</span>
              <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
            </div>
          </div>

          {/* Mode Tabs (Rent, Buy, Room/Dorm) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveMode('Rent')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                activeMode === 'Rent' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Rent
            </button>
            <button
              onClick={() => setActiveMode('Buy')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                activeMode === 'Buy' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Buy (Mortgage)
            </button>
            <button
              onClick={() => setActiveMode('Room')}
              className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                activeMode === 'Room' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Room / Dorm
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between text-xs font-semibold pt-1">
            <span className="text-slate-900 font-bold text-xs">
              Top 5 Neighborhoods ({activeMode})
            </span>
            <div className="flex items-center gap-1.5">
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-semibold focus:outline-none"
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
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                <th className="py-2 px-1">Neighborhood</th>
                <th className="py-2 px-1">Est. {activeMode === 'Buy' ? 'Mortgage' : 'Cost'}</th>
                <th className="py-2 px-1">vs Last Month</th>
                <th className="py-2 px-1 text-right">Affordability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dynamicNeighborhoods.map((n, idx) => (
                <tr key={n.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-1 font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[100px]">{n.name}</span>
                  </td>
                  <td className="py-2 px-1 font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(n.typicalRate, inputs.currency)}/mo
                  </td>
                  <td className="py-2 px-1 font-bold whitespace-nowrap">
                    {n.vsLastMonth < 0 ? (
                      <span className="text-emerald-600">↓ {Math.abs(n.vsLastMonth)}%</span>
                    ) : (
                      <span className="text-emerald-600">↑ {n.vsLastMonth}%</span>
                    )}
                  </td>
                  <td className="py-2 px-1 text-right whitespace-nowrap">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        n.affordability === 'Great'
                          ? 'bg-emerald-100 text-emerald-700'
                          : n.affordability === 'Okay'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
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
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
          >
            <span>View full breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Data updated: 2026</span>
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
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
