export type CountryCode = 'US' | 'CA' | 'MX' | 'BR';
export type CurrencyCode = 'USD' | 'CAD' | 'MXN' | 'BRL';

export interface FinancialInputs {
  country: CountryCode;
  currency: CurrencyCode;
  employmentType: string;
  incomeRate: number; // For contractors: Per Hour Rate ($60/hr). For employees: Annual Salary ($120,000)
  annualSalary?: number; // Backward compatibility alias
  state: string;
  city: string;
  filingStatus: 'Single' | 'Married Jointly' | 'Head of Household';
  dependents: number;
  workHoursPerWeek: number;
  weeksPerYear: number;
  k401Contribution?: number;
  healthInsuranceMonthly?: number;
}

export interface TaxDeductionItem {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TaxCalculationResult {
  grossIncome: number;
  annualGross: number;
  monthlyGross: number;
  annualBillableHours: number;
  grossHourlyRate: number;
  takeHomePayAnnual: number;
  takeHomePayMonthly: number;
  effectiveHourlyRate: number;
  takeHomePercentage: number;

  // Contractor Specific Per-Hour & Total Fields
  annualContractRevenue: number;
  monthlyContractRevenue: number;
  contractBillingRate: number;
  contractNetHourlyRate?: number;
  monthlyGrossContract?: number;
  monthlyNetContract?: number;
  annualGrossContract?: number;
  annualNetContract?: number;
  businessExpenses: number;
  businessTax: number;
  ownerCompensation: number;
  estimatedPersonalTakeHome: number;
  effectivePersonalNetRate: number;

  federalTax: number;
  federalTaxPercentage: number;
  stateTax: number;
  stateTaxPercentage: number;
  socialSecurityTax: number;
  socialSecurityTaxPercentage: number;
  medicareTax: number;
  medicareTaxPercentage: number;
  otherDeductions: number;
  otherDeductionsPercentage: number;
  totalTax: number;
  effectiveTaxRate: number;
  breakdown: TaxDeductionItem[];
}

export interface CountryEconomicData {
  country: CountryCode;
  currency: CurrencyCode;
  currencySymbol: string;
  inflationRate: number;
  inflationLabel: string;
  fuelPriceToday: number;
  fuelPriceUnit: string;
  fuelPriceVsYesterday: number;
  colTotalMonthly: number;
  colComparisonText: string;
  colCategories: {
    name: string;
    amount: number;
    percentage: number;
    color: string;
    icon: string;
  }[];
  benchmarkMedian: number;
  benchmarkTop10: number;
  benchmarkTop25: number;
  benchmarkBottom25: number;
  cityLabel: string;
  neighborhoods: {
    id: string;
    name: string;
    typicalRent: number;
    vsLastMonth: number;
    affordability: 'Great' | 'Okay' | 'Stretch' | 'High Burden';
    affordabilityScore: number;
  }[];
}

export interface CompleteFinancialSnapshot {
  inputs: FinancialInputs;
  tax: TaxCalculationResult;
  economic: CountryEconomicData;
  purchasingPowerNeeded: number;
}
