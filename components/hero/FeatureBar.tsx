'use client';

import React from 'react';
import { Calculator, Home, TrendingUp, Fuel, BarChart3, Globe, Wallet } from 'lucide-react';

interface FeatureBarProps {
  onSelectFeature: (featureId: string) => void;
}

export const FeatureBar: React.FC<FeatureBarProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'taxes',
      icon: <Wallet className="w-5 h-5 text-blue-600" />,
      title: 'Salary After Tax',
      desc: 'Calculate your take-home pay with accurate federal, state, and local withholding.',
      bgColor: 'bg-blue-50/80',
    },
    {
      id: 'col',
      icon: <Home className="w-5 h-5 text-amber-600" />,
      title: 'Cost of Living',
      desc: 'See local living expenses, housing costs, and commute estimates for your city.',
      bgColor: 'bg-amber-50/80',
    },
    {
      id: 'inflation',
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      title: 'Inflation Impact',
      desc: 'Understand future purchasing power and the raise you need to keep pace with inflation.',
      bgColor: 'bg-emerald-50/80',
    },
    {
      id: 'commute',
      icon: <Fuel className="w-5 h-5 text-rose-600" />,
      title: 'Fuel & Commute',
      desc: 'Estimate fuel and commute costs based on location and typical usage patterns.',
      bgColor: 'bg-rose-50/80',
    },
    {
      id: 'benchmarks',
      icon: <BarChart3 className="w-5 h-5 text-indigo-600" />,
      title: 'Income Benchmarks',
      desc: 'Compare with local income levels and understand your purchasing power relative to peers.',
      bgColor: 'bg-indigo-50/80',
    },
    {
      id: 'countries',
      icon: <Globe className="w-5 h-5 text-sky-600" />,
      title: 'All Countries',
      desc: 'Support for multiple countries with localized tax rules and cost of living adjustments.',
      bgColor: 'bg-sky-50/80',
    },
  ];

  return (
    <div className="space-y-8 pt-16">
      {/* Centered Heading */}
      <h3 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-[#F9FAFB] tracking-tight">
        <span className="font-extrabold">E</span>verything that shapes your paycheck
      </h3>

      {/* 6 Cards Grid (3 columns on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectFeature(item.id)}
            className="p-6 bg-white dark:bg-[#101512] border border-slate-200/80 dark:border-[#26302A] rounded-2xl shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-[#22C55E]/40 transition-all cursor-pointer group space-y-3"
          >
            <div className={`w-10 h-10 rounded-xl ${item.bgColor} dark:bg-[#151C17] flex items-center justify-center`}>
              {item.icon}
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB] group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-800 dark:text-slate-300 font-normal leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
