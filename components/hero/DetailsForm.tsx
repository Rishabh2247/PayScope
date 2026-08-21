import React, { useState, useEffect, useRef } from 'react';
import { FinancialInputs, CountryCode } from '../../lib/types';
import { isContractorRole, formatCurrency } from '../../lib/formatters';
import { getProvincesForCountry, getCitiesForProvince } from '../../lib/geography';
import { useTranslation } from '../../lib/i18n';
import { Briefcase, ChevronDown, ChevronUp, Calculator, Clock, Calendar, Globe, Sparkles, Check } from 'lucide-react';

interface DetailsFormProps {
  inputs: FinancialInputs;
  onChange: (inputs: FinancialInputs) => void;
  onCalculate: () => void;
  onCountryChange?: (country: CountryCode) => void;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({ inputs, onChange, onCalculate, onCountryChange }) => {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'country' | 'filing' | 'state' | 'city' | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const isContractor = isContractorRole(inputs.employmentType);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const countriesList: { code: CountryCode; name: string }[] = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'MX', name: 'Mexico' },
    { code: 'BR', name: 'Brazil' },
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
    <div ref={formRef} className="space-y-4">
      {/* Form Card Header + Responsive Mobile Country Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#BFE5D3]/40">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#12372A] tracking-tight">
            <span className="font-extrabold">Y</span>our <span className="font-extrabold">F</span>inancial <span className="font-extrabold">D</span>etails
          </h2>
          <p className="text-xs sm:text-sm text-slate-800 font-normal mt-0.5">
            {t.just3Things}
          </p>
        </div>

        {/* Mobile Wrap Safe Country Select - Modern Floating Popover */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto bg-[#F3FBF7] sm:bg-transparent p-2 sm:p-0 rounded-2xl border border-[#BFE5D3]/60 sm:border-none">
          <label className="text-xs font-extrabold text-[#1F8F68] uppercase tracking-wider whitespace-nowrap">
            <span className="font-black">C</span>ountry:
          </label>
          
          <div className="relative flex-1 sm:flex-none">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'country' ? null : 'country')}
              className="w-full sm:w-auto flex items-center justify-between gap-2.5 bg-white sm:bg-[#F3FBF7] hover:bg-[#EAF7F1] border border-[#BFE5D3] rounded-xl px-3 py-2 sm:py-1.5 text-xs font-extrabold text-[#12372A] focus:outline-none transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#1F8F68]" />
                <span>{countriesList.find((c) => c.code === inputs.country)?.name}</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#1F8F68] transition-transform duration-200 ${
                  openDropdown === 'country' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdown === 'country' && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-xl border border-[#BFE5D3] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                {countriesList.map((c) => {
                  const isSelected = inputs.country === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        handleCountrySelect(c.code);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1F8F68] text-white shadow-2xs'
                          : 'text-slate-800 hover:bg-[#F3FBF7] hover:text-[#1F8F68]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#1F8F68]'}`} />
                        <span>{c.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            )}
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
                placeholder={isContractor ? 'e.g. 60' : 'e.g. 120,000'}
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#BFE5D3] rounded-xl text-sm font-bold text-[#12372A] focus:outline-none focus:ring-2 focus:ring-[#1F8F68] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Modern Custom Filing Status Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#12372A]">{t.filingStatus}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'filing' ? null : 'filing')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-[#F3FBF7] border border-[#BFE5D3] rounded-xl text-sm font-semibold text-[#12372A] transition-all cursor-pointer shadow-2xs"
              >
                <span>
                  {inputs.filingStatus === 'Single'
                    ? t.single
                    : inputs.filingStatus === 'Married Jointly'
                    ? t.marriedFilingJointly
                    : t.headOfHousehold}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#1F8F68] transition-transform duration-200 ${
                    openDropdown === 'filing' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'filing' && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white/95 backdrop-blur-xl border border-[#BFE5D3] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  {[
                    { value: 'Single', label: t.single },
                    { value: 'Married Jointly', label: t.marriedFilingJointly },
                    { value: 'Head of Household', label: t.headOfHousehold },
                  ].map((item) => {
                    const isSelected = inputs.filingStatus === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          handleFieldChange('filingStatus', item.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1F8F68] text-white font-extrabold shadow-2xs'
                            : 'text-slate-800 hover:bg-[#F3FBF7] hover:text-[#1F8F68]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* State & City Selector Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Modern Custom State/Province Popover */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#12372A]">{t.stateProvinceLabel}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'state' ? null : 'state')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-[#F3FBF7] border border-[#BFE5D3] rounded-xl text-sm font-semibold text-[#12372A] transition-all cursor-pointer shadow-2xs"
              >
                <span className="truncate">{inputs.state}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#1F8F68] shrink-0 transition-transform duration-200 ${
                    openDropdown === 'state' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'state' && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white/95 backdrop-blur-xl border border-[#BFE5D3] rounded-2xl shadow-xl p-1.5 z-50 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95">
                  {provinces.map((prov) => {
                    const isSelected = inputs.state === prov.name;
                    return (
                      <button
                        key={prov.name}
                        type="button"
                        onClick={() => {
                          handleProvinceChange(prov.name);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1F8F68] text-white font-extrabold shadow-2xs'
                            : 'text-slate-800 hover:bg-[#F3FBF7] hover:text-[#1F8F68]'
                        }`}
                      >
                        <span className="truncate">{prov.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Modern Custom City Popover */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#12372A]">{t.cityLabel}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-[#F3FBF7] border border-[#BFE5D3] rounded-xl text-sm font-semibold text-[#12372A] transition-all cursor-pointer shadow-2xs"
              >
                <span className="truncate">{inputs.city}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#1F8F68] shrink-0 transition-transform duration-200 ${
                    openDropdown === 'city' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openDropdown === 'city' && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white/95 backdrop-blur-xl border border-[#BFE5D3] rounded-2xl shadow-xl p-1.5 z-50 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95">
                  {cities.map((ct) => {
                    const isSelected = inputs.city === ct;
                    return (
                      <button
                        key={ct}
                        type="button"
                        onClick={() => {
                          handleFieldChange('city', ct);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1F8F68] text-white font-extrabold shadow-2xs'
                            : 'text-slate-800 hover:bg-[#F3FBF7] hover:text-[#1F8F68]'
                        }`}
                      >
                        <span className="truncate">{ct}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}
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
        <p className="text-[11px] text-[#1F8F68] font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#1F8F68] shrink-0" /> <span>{t.defaultsApplied}</span>
        </p>

        <button
          type="button"
          onClick={onCalculate}
          className="w-full bg-[#1F8F68] hover:bg-[#176F52] text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg shadow-[#1F8F68]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] border border-[#1F8F68]"
        >
          <span>See My Financial Snapshot →</span>
          <Calculator className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
