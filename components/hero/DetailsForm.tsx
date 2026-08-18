'use client';

import React, { useState } from 'react';
import { FinancialInputs } from '../../lib/types';
import { isContractorRole, formatCurrency } from '../../lib/formatters';
import { getProvincesForCountry, getCitiesForProvince } from '../../lib/geography';
import { Briefcase, ChevronDown, ChevronUp, Calculator } from 'lucide-react';

interface DetailsFormProps {
  inputs: FinancialInputs;
  onChange: (inputs: FinancialInputs) => void;
  onCalculate: () => void;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({ inputs, onChange, onCalculate }) => {
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
      annualSalary: isNewTypeContractor ? newIncomeRate * inputs.workHoursPerWeek * inputs.weeksPerYear : newIncomeRate,
    });
  };

  const getEmploymentOptions = () => {
    if (inputs.country === 'CA') {
      return ['Full-time Employee', 'T4 Employee', 'C2C Contractor', 'Incorporated'];
    }
    if (inputs.country === 'MX') {
      return ['Full-time Employee', 'Payroll (Sueldo)', 'Contractor (Resico)', 'Freelancer'];
    }
    if (inputs.country === 'BR') {
      return ['Full-time Employee', 'CLT Employee', 'PJ (Quotas)', 'Autônomo'];
    }
    return ['Full-time Employee', 'W-2 Employee', '1099 Contractor', 'C2C', 'H-1B'];
  };

  const provincesList = getProvincesForCountry(inputs.country);
  const citiesList = getCitiesForProvince(inputs.country, inputs.state);

  const getCurrencySymbol = () => {
    if (inputs.country === 'CA') return 'CA$';
    if (inputs.country === 'MX') return 'MX$';
    if (inputs.country === 'BR') return 'R$';
    return '$';
  };

  const currentRate = inputs.incomeRate || (isContractor ? 60 : 120000);
  const totalAnnualContractRevenue = currentRate * inputs.workHoursPerWeek * inputs.weeksPerYear;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Details</h2>
        <span className="text-xs text-slate-400 font-medium">Step 1 of 2</span>
      </div>

      {isContractor && (
        <div className="bg-indigo-50/80 border border-indigo-100 text-indigo-800 text-xs font-semibold p-2.5 rounded-xl flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Contractor Role Active: Calculating self-employment tax & contract net pay.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Employment Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">Employment Type</label>
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

        {/* Dynamic Rate Input: Contract Rate (Per Hour) vs Annual Salary */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            {isContractor ? 'Contract Rate (Per Hour)' : 'Annual Salary'}
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

          {/* Live Annual Contract Revenue calculated hint */}
          {isContractor && (
            <p className="text-[10px] text-indigo-600 font-bold tracking-tight">
              {formatCurrency(totalAnnualContractRevenue, inputs.currency)}/yr total revenue ({getCurrencySymbol()}{currentRate}/hr × {inputs.workHoursPerWeek}h × {inputs.weeksPerYear}w)
            </p>
          )}
        </div>

        {/* State / Province (Dynamically Populated per Country) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">State / Province</label>
          <div className="relative">
            <select
              value={inputs.state}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none"
            >
              {provincesList.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* City (Dynamically Filtered per Selected Province) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">City</label>
          <div className="relative">
            <select
              value={inputs.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none"
            >
              {citiesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Filing Status */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">Filing Status</label>
          <div className="relative">
            <select
              value={inputs.filingStatus}
              onChange={(e) => handleFieldChange('filingStatus', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none"
            >
              <option value="Single">Single</option>
              <option value="Married Jointly">Married Jointly</option>
              <option value="Head of Household">Head of Household</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dependents */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">Dependents</label>
          <div className="relative">
            <select
              value={inputs.dependents}
              onChange={(e) => handleFieldChange('dependents', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none"
            >
              <option value={0}>0 Dependents</option>
              <option value={1}>1 Dependent</option>
              <option value={2}>2 Dependents</option>
              <option value={3}>3+ Dependents</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Contract / Work Hours Per Week */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            {isContractor ? 'Contract Hours / Week' : 'Work Hours / Week'}
          </label>
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
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Contract / Work Weeks Per Year */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            {isContractor ? 'Contract Weeks / Year' : 'Weeks / Year'}
          </label>
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
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Advanced Optional Collapsible */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mx-auto"
        >
          <span>Advanced (optional)</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                {isContractor ? 'Business Expense / Write-off (%)' : '401k Contribution (%)'}
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
              <label className="block text-slate-600 font-medium mb-1">Health Insurance ($/mo)</label>
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

      {/* Main Calculate CTA Button */}
      <button
        onClick={onCalculate}
        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
      >
        <Calculator className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        <span>Calculate My Results</span>
      </button>
    </div>
  );
};
