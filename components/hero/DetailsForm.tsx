'use client';

import React, { useState } from 'react';
import { FinancialInputs, CountryCode } from '../../lib/types';
import { isContractorRole, formatCurrency } from '../../lib/formatters';
import { getProvincesForCountry, getCitiesForProvince } from '../../lib/geography';
import { useTranslation } from '../../lib/i18n';
import { Briefcase, ChevronDown, ChevronUp, Calculator, Clock, Calendar } from 'lucide-react';

interface DetailsFormProps {
  inputs: FinancialInputs;
  onChange: (inputs: FinancialInputs) => void;
  onCalculate: () => void;
  onCountryChange?: (country: CountryCode) => void;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({ inputs, onChange, onCalculate, onCountryChange }) => {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isContractor = isContractorRole(inputs.employmentType);

  const countriesList: { code: CountryCode; flag: string; name: string }[] = [
    { code: 'US', flag: '🇺🇸', name: 'United States' },
    { code: 'CA', flag: '🇨🇦', name: 'Canada' },
    { code: 'MX', flag: '🇲🇽', name: 'Mexico' },
    { code: 'BR', flag: '🇧🇷', name: 'Brazil' },
  ];

  const handleCountrySelect = (code: CountryCode) => {
    if (onCountryChange) {
      onCountryChange(code);
    } else {
      let defaultState = 'Texas';
      let defaultCity = 'Austin';
      if (code === 'CA') { defaultState = 'Ontario'; defaultCity = 'Toronto'; }
      if (code === 'MX') { defaultState = 'Mexico City'; defaultCity = 'Mexico City'; }
      if (code === 'BR') { defaultState = 'São Paulo'; defaultCity = 'São Paulo'; }
      onChange({
        ...inputs,
        country: code,
        state: defaultState,
        city: defaultCity,
      });
    }
  };

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
      return ['Full-time Employee (T4)', 'T4 Contractor', 'Incorporated Contractor (Corporation)'];
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
    <div className="space-y-4">
      {/* Form Card Header + Country Dropdown Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#BFE5D3]/40">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#12372A] tracking-tight">{t.yourFinancialDetails}</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {t.just3Things}
          </p>
        </div>

        {/* Side Country Dropdown Button */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-[#1F8F68] uppercase tracking-wider block">{t.country}:</label>
          <div className="relative">
            <select
              value={inputs.country}
              onChange={(e) => handleCountrySelect(e.target.value as CountryCode)}
              className="bg-[#F3FBF7] hover:bg-[#EAF7F1] border border-[#BFE5D3] rounded-xl px-3.5 py-1.5 text-xs font-extrabold text-[#12372A] focus:outline-none focus:ring-2 focus:ring-[#1F8F68] appearance-none pr-8 cursor-pointer shadow-2xs"
            >
              {countriesList.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#1F8F68] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Inputs Form with Enter key submit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCalculate();
        }}
        className="space-y-4"
      >
        {/* Employment Type Control Bar with Flexible Wrapping */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#12372A]">
            {t.employmentTypeAndTaxTerm}
          </label>
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#F3FBF7] rounded-2xl border border-[#BFE5D3] text-xs font-bold text-slate-600">
            {getEmploymentOptions().map((opt) => {
              const isSelected = inputs.employmentType === opt;
              let label = opt;
              if (opt === 'Full-time Employee') label = 'W2 Employee';
              if (opt === '1099 Contractor / Sole Proprietorship') label = '1099 / Sole Prop';
              if (opt === 'C2C / LLC Contractor') label = 'C2C / LLC';

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleEmploymentTypeChange(opt)}
                  className={`flex-1 min-w-[95px] sm:min-w-[110px] py-2 px-2.5 rounded-xl transition-all text-center leading-tight whitespace-normal break-words text-[11px] sm:text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F8F68] text-white shadow-xs font-extrabold'
                      : 'hover:text-[#12372A] hover:bg-[#EAF7F1] text-slate-700 bg-white/60 font-semibold'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Annual Salary & Filing Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gross Income Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#12372A]">
              {isContractor ? t.hourlyRateLabel : t.annualGrossIncome}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1F8F68] font-bold text-sm pointer-events-none">
                {getCurrencySymbol()}
              </div>
              <input
                type="number"
                value={inputs.incomeRate || ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onCalculate();
                  }
                }}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({
                    ...inputs,
                    incomeRate: val,
                    annualSalary: isContractor ? val * inputs.workHoursPerWeek * inputs.weeksPerYear : val,
                  });
                }}
                placeholder={isContractor ? '60' : '120,000'}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#BFE5D3] rounded-xl text-sm font-bold text-[#12372A] focus:outline-none focus:ring-2 focus:ring-[#1F8F68] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Filing Status Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#12372A]">{t.filingStatus}</label>
            <div className="relative">
              <select
                value={inputs.filingStatus}
                onChange={(e) => handleFieldChange('filingStatus', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#BFE5D3] rounded-xl text-sm font-semibold text-[#12372A] focus:outline-none focus:ring-2 focus:ring-[#1F8F68] transition-all appearance-none pr-8 shadow-2xs cursor-pointer"
              >
                <option value="Single">{t.single}</option>
                <option value="Married Filing Jointly">{t.marriedFilingJointly}</option>
                <option value="Head of Household">{t.headOfHousehold}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#1F8F68] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* State & City Selector Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#12372A]">{t.stateProvinceLabel}</label>
            <div className="relative">
              <select
                value={inputs.state}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#BFE5D3] rounded-xl text-sm font-semibold text-[#12372A] focus:outline-none focus:ring-2 focus:ring-[#1F8F68] transition-all appearance-none pr-8 shadow-2xs cursor-pointer"
              >
                {provinces.map((prov) => (
                  <option key={prov.name} value={prov.name}>
                    {prov.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#1F8F68] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#12372A]">{t.cityLabel}</label>
            <div className="relative">
              <select
                value={inputs.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#BFE5D3] rounded-xl text-sm font-semibold text-[#12372A] focus:outline-none focus:ring-2 focus:ring-[#1F8F68] transition-all appearance-none pr-8 shadow-2xs cursor-pointer"
              >
                {cities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#1F8F68] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Collapsible Accordion Drawer Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full py-2.5 px-4 bg-white hover:bg-[#F3FBF7] border border-[#BFE5D3] rounded-xl text-xs font-semibold text-[#12372A] transition-all flex items-center justify-between shadow-2xs cursor-pointer"
          >
            <span>{t.moreDetailsAccordion}</span>
            <span className="text-[#1F8F68] font-bold text-base">{showAdvanced ? '−' : '+'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-[#F3FBF7] rounded-2xl border border-[#BFE5D3] space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#12372A] font-semibold mb-1">{t.workHoursPerWeek}</label>
                  <input
                    type="number"
                    value={inputs.workHoursPerWeek}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onChange({
                        ...inputs,
                        workHoursPerWeek: val,
                        annualSalary: isContractor ? inputs.incomeRate * val * inputs.weeksPerYear : inputs.incomeRate,
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-[#BFE5D3] rounded-lg text-[#12372A] font-bold focus:outline-none focus:ring-2 focus:ring-[#1F8F68]"
                  />
                </div>
                <div>
                  <label className="block text-[#12372A] font-semibold mb-1">{t.weeksPerYear}</label>
                  <input
                    type="number"
                    value={inputs.weeksPerYear}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onChange({
                        ...inputs,
                        weeksPerYear: val,
                        annualSalary: isContractor ? inputs.incomeRate * inputs.workHoursPerWeek * val : inputs.incomeRate,
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-[#BFE5D3] rounded-lg text-[#12372A] font-bold focus:outline-none focus:ring-2 focus:ring-[#1F8F68]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#12372A] font-semibold mb-1">{t.dependents}</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={inputs.dependents}
                    onChange={(e) => handleFieldChange('dependents', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#BFE5D3] rounded-lg text-[#12372A] font-bold focus:outline-none focus:ring-2 focus:ring-[#1F8F68]"
                  />
                </div>
                <div>
                  <label className="block text-[#12372A] font-semibold mb-1">
                    {isContractor ? t.businessExpenseWriteoff : t.k401Contribution}
                  </label>
                  <input
                    type="number"
                    value={inputs.k401Contribution || 0}
                    onChange={(e) => handleFieldChange('k401Contribution', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#BFE5D3] rounded-lg text-[#12372A] font-bold focus:outline-none focus:ring-2 focus:ring-[#1F8F68]"
                    placeholder="e.g. 6%"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Defaults Subtext & Primary CTA Button */}
      <div className="space-y-3 pt-2">
        <p className="text-[11px] text-[#1F8F68] font-medium flex items-center gap-1.5">
          <span>💡</span> <span>{t.defaultsApplied}</span>
        </p>

        <button
          type="button"
          onClick={onCalculate}
          className="w-full bg-[#1F8F68] hover:bg-[#176F52] text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg shadow-[#1F8F68]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] border border-[#1F8F68]"
        >
          <span>⚡ See Your Full Interactive Financial Snapshot</span>
          <Calculator className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
