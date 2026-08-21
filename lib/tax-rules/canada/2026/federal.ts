export interface TaxRuleMetadata {
  effectiveYear: number;
  source: string;
  sourceUrl: string;
  lastVerified: string;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export const CA_FEDERAL_TAX_2026 = {
  metadata: {
    effectiveYear: 2026,
    source: 'Canada Revenue Agency (CRA) & Department of Finance Canada',
    sourceUrl: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions.html',
    lastVerified: '2026-02-21',
  } as TaxRuleMetadata,

  // 2026 CRA Official Federal Income Tax Brackets
  brackets: [
    { min: 0, max: 57375, rate: 0.15 },
    { min: 57375, max: 114750, rate: 0.205 },
    { min: 114750, max: 177882, rate: 0.26 },
    { min: 177882, max: 253414, rate: 0.29 },
    { min: 253414, max: null, rate: 0.33 },
  ] as TaxBracket[],

  basicPersonalAmount: 16045, // 2026 Basic Personal Amount (BPA)

  // Canada Pension Plan (CPP) 2026
  cpp: {
    basicExemption: 3500,
    ympe: 74600, // Maximum Pensionable Earnings
    employeeRate: 0.0595, // 5.95%
    selfEmployedRate: 0.119, // 11.90%
    maxEmployeeContrib: 4230.45,
    maxSelfEmployedContrib: 8460.90,
  },

  // Second Tier Canada Pension Plan (CPP2) 2026
  cpp2: {
    ceiling: 85000, // Maximum Additional Pensionable Earnings (YAMPE)
    employeeRate: 0.04, // 4.0%
    selfEmployedRate: 0.08, // 8.0%
    maxEmployeeContrib: 416.00,
    maxSelfEmployedContrib: 832.00,
  },

  // Employment Insurance (EI) 2026
  ei: {
    maxInsurableEarnings: 68900,
    employeeRate: 0.0163, // 1.63%
    maxEmployeeContrib: 1123.07,
  },
};
