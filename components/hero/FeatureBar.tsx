'use client';

import React from 'react';
import { Calculator, Home, TrendingUp, Fuel, BarChart3, Globe } from 'lucide-react';

interface FeatureBarProps {
  onSelectFeature: (featureId: string) => void;
}

export const FeatureBar: React.FC<FeatureBarProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'taxes',
      icon: Calculator,
      title: 'Salary After Tax',
      desc: 'Calculate your take-home pay',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'col',
      icon: Home,
      title: 'Cost of Living',
      desc: 'See local living expenses',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 'inflation',
      icon: TrendingUp,
      title: 'Inflation Impact',
      desc: 'Understand future purchasing power',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'commute',
      icon: Fuel,
      title: 'Fuel & Commute',
      desc: 'Estimate fuel and commute costs',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'benchmarks',
      icon: BarChart3,
      title: 'Income Benchmarks',
      desc: 'Compare with local income levels',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'countries',
      icon: Globe,
      title: 'All Countries',
      desc: 'Support for multiple countries',
      color: 'bg-sky-50 text-sky-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-8 border-t border-slate-100">
      {features.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => onSelectFeature(item.id)}
            className="p-4 bg-white border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group space-y-2"
          >
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
