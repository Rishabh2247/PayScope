import { TaxRuleMetadata, TaxBracket } from '../../canada/2026/federal';

export const US_FEDERAL_TAX_2026 = {
  metadata: {
    effectiveYear: 2026,
    source: 'Internal Revenue Service (IRS) & Social Security Administration (SSA)',
    sourceUrl: 'https://www.irs.gov/newsroom/irs-releases-tax-blooper-inflation-adjustments',
    lastVerified: '2026-01-15',
  } as TaxRuleMetadata,

  // IRS 2026 Federal Brackets (Single Filing Status)
  bracketsSingle: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: null, rate: 0.37 },
  ] as TaxBracket[],

  // IRS 2026 Federal Brackets (Married Filing Jointly)
  bracketsJoint: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: null, rate: 0.37 },
  ] as TaxBracket[],

  standardDeductionSingle: 15000,
  standardDeductionJoint: 30000,

  // FICA / Social Security (FICA OASDI) 2026
  socialSecurity: {
    wageCap: 176100,
    employeeRate: 0.062, // 6.2%
    selfEmployedRate: 0.124, // 12.4%
    maxEmployeeContrib: 10918.20,
    maxSelfEmployedContrib: 21836.40,
  },

  // Medicare (FICA HI) 2026
  medicare: {
    employeeRate: 0.0145, // 1.45%
    selfEmployedRate: 0.029, // 2.90%
    additionalThresholdSingle: 200000,
    additionalThresholdJoint: 250000,
    additionalRate: 0.009, // 0.9%
  },
};
