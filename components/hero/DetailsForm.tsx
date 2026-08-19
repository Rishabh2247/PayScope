'use client';

import React, { useState } from 'react';
import { FinancialInputs } from '../../lib/types';
import { isContractorRole, formatCurrency } from '../../lib/formatters';
import { getProvincesForCountry, getCitiesForProvince } from '../../lib/geography';
import { useTranslation } from '../../lib/i18n';
import { Briefcase, ChevronDown, ChevronUp, Calculator } from 'lucide-react';

interface DetailsFormProps {
  inputs: FinancialInputs;
  onChange: (inputs: FinancialInputs) => void;
  onCalculate: () => void;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({ inputs, onChange, onCalculate }) => {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isContractor = isContractorRole(inputs.employmentType);

  const handleFieldChange = (field: keyof FinancialInputs, value: any) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  const handleProvinceChange = (newProvince: string) => {
    const availableCities = getCitiesForProvince(inputs.country, newProvince);
    const newCity = availableCities.includes(inputs.city) ? inputs.city : availableCities[0];
    onChange({
      ...inputs,
      state: newProvince,
      city: newCity,
    });
  };

  const handleEmploymentTypeChange = (newType: string) => {
    const isNewTypeContractor = isContractorRole(newType);
    const isOldTypeContractor = isContractor;

    let newIncomeRate = inputs.incomeRate;

    if (isNewTypeContractor && !isOldTypeContractor) {
      newIncomeRate = inputs.incomeRate > 1000 ? 60 : inputs.incomeRate;
    } else if (!isNewTypeContractor && isOldTypeContractor) {
      newIncomeRate = inputs.incomeRate < 1000 ? 120000 : inputs.incomeRate;
    }

    onChange({
      ...inputs,
      employmentType: newType,
      incomeRate: newIncomeRate,
      annualSalary: isNewTypeContractor
        ? newIncomeRate * inputs.workHoursPerWeek * inputs.weeksPerYear
        : newIncomeRate,
    });
  };

  const provinces = getProvincesForCountry(inputs.country);
  const cities = getCitiesForProvince(inputs.country, inputs.state);

  const getEmploymentOptions = () => {
    if (inputs.country === 'CA') {
      return ['Full-time Employee', 'Sole Proprietorship Contractor', 'Incorporated Contractor (Corporation)'];
    }
    if (inputs.country === 'MX') {
      return ['Sueldos y Salarios (Employee)', 'RESICO (Simplified Trust)', 'Persona Física con Actividad Empresarial'];
    }
    if (inputs.country === 'BR') {
      return ['CLT Employee', 'PJ Contractor (Simples Nacional)', 'PJ Contractor (Lucro Presumido)'];
    }
    return ['Full-time Employee', 'W2 Contractor', '1099 Contractor / Sole Proprietorship', 'C2C / LLC Contractor'];
  };

  const getCurrencySymbol = () => {
    if (inputs.currency === 'CAD') return 'CA$';
    if (inputs.currency === 'MXN') return 'MX$';
    if (inputs.currency === 'BRL') return 'R$';
    return '$';
  };

  const currentRate = inputs.incomeRate || 0;
  const totalAnnualContractRevenue = currentRate * inputs.workHoursPerWeek * inputs.weeksPerYear;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-5">
      {/* Header */}
      <div className="space-y-1 pb-2 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{t.yourDetails}</h2>
        <p className="text-xs text-slate-500 font-medium">{t.knowIncomeWorth}</p>
      </div>

      {/* Inputs Form Grid */}
      <div className="space-y-4">
        {/* Employment Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            {t.employmentTypeLabel}
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Briefcase className="w-4 h-4" />
            </div>
            <select
              value={inputs.employmentType}
              onChange={(e) => handleEmploymentTypeChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none"
            >
              {getEmploymentOptions().map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dynamic Rate Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            {isContractor ? t.hourlyRateLabel : t.annualSalaryLabel}
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">
              {getCurrencySymbol()}
            </div>
            <input
              type="number"
              value={inputs.incomeRate || ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                onChange({
                  ...inputs,
                  incomeRate: val,
                  annualSalary: isContractor ? val * inputs.workHoursPerWeek * inputs.weeksPerYear : val,
                });
              }}
              placeholder={isContractor ? '60' : '120,000'}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {isContractor && (
            <p className="text-[10px] text-indigo-600 font-bold tracking-tight">
              {formatCurrency(totalAnnualContractRevenue, inputs.currency)}/yr total revenue ({getCurrencySymbol()}{currentRate}/hr × {inputs.workHoursPerWeek}h × {inputs.weeksPerYear}w)
            </p>
          )}
        </div>

        {/* Contractor Hours & Weeks Configuration */}
        {isContractor && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-indigo-900">Work Hours / Week</label>
              <input
                type="number"
                value={inputs.workHoursPerWeek}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({
                    ...inputs,
                    workHoursPerWeek: val,
                    annualSalary: inputs.incomeRate * val * inputs.weeksPerYear,
                  });
                }}
                className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-indigo-900">Billable Weeks / Year</label>
              <input
                type="number"
                value={inputs.weeksPerYear}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({
                    ...inputs,
                    weeksPerYear: val,
                    annualSalary: inputs.incomeRate * inputs.workHoursPerWeek * val,
                  });
                }}
                className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-slate-900"
              />
            </div>
          </div>
        )}

        {/* State / Province & City Selector Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">
              {t.stateProvinceLabel}
            </label>
            <div className="relative">
              <select
                value={inputs.state}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none pr-7"
              >
                {provinces.map((prov) => (
                  <option key={prov.name} value={prov.name}>
                    {prov.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">{t.cityLabel}</label>
            <div className="relative">
              <select
                value={inputs.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none pr-7"
              >
                {cities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filing Status & Dependents Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">{t.filingStatusLabel}</label>
            <div className="relative">
              <select
                value={inputs.filingStatus}
                onChange={(e) => handleFieldChange('filingStatus', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none pr-7"
              >
                <option value="Single">Single</option>
                <option value="Married Filing Jointly">Married Filing Jointly</option>
                <option value="Head of Household">Head of Household</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">{t.dependentsLabel}</label>
            <input
              type="number"
              min={0}
              max={10}
              value={inputs.dependents}
              onChange={(e) => handleFieldChange('dependents', Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Collapsible Advanced Section */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>{t.advancedOptions}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  {isContractor ? t.expenseWriteoffLabel : t.k401Label}
                </label>
                <input
                  type="number"
                  value={inputs.k401Contribution || 0}
                  onChange={(e) => handleFieldChange('k401Contribution', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  placeholder="6%"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">{t.healthInsuranceLabel}</label>
                <input
                  type="number"
                  value={inputs.healthInsuranceMonthly || 0}
                  onChange={(e) => handleFieldChange('healthInsuranceMonthly', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                  placeholder="$250"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Calculate CTA Button */}
      <button
        onClick={onCalculate}
        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
      >
        <Calculator className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        <span>{t.calculateResults}</span>
      </button>
    </div>
  );
};
