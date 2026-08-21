import { TaxRuleMetadata, TaxBracket } from '../../canada/2026/federal';

export const US_FEDERAL_TAX_2026 = {
  metadata: {
    effectiveYear: 2026,
    source: 'Internal Revenue Service (IRS) & Social Security Administration (SSA)',
    sourceUrl: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments',
    lastVerified: '2026-02-21',
  } as TaxRuleMetadata,

  // IRS 2026 Official Federal Brackets (Single Filing Status)
  bracketsSingle: [
    { min: 0, max: 12400, rate: 0.10 },
    { min: 12400, max: 50400, rate: 0.12 },
    { min: 50400, max: 105700, rate: 0.22 },
    { min: 105700, max: 201775, rate: 0.24 },
    { min: 201775, max: 256225, rate: 0.32 },
    { min: 256225, max: 640600, rate: 0.35 },
    { min: 640600, max: null, rate: 0.37 },
  ] as TaxBracket[],

  // IRS 2026 Official Federal Brackets (Married Filing Jointly)
  bracketsJoint: [
    { min: 0, max: 24800, rate: 0.10 },
    { min: 24800, max: 100800, rate: 0.12 },
    { min: 100800, max: 211400, rate: 0.22 },
    { min: 211400, max: 403550, rate: 0.24 },
    { min: 403550, max: 512450, rate: 0.32 },
    { min: 512450, max: 768700, rate: 0.35 },
    { min: 768700, max: null, rate: 0.37 },
  ] as TaxBracket[],

  standardDeductionSingle: 16100,
  standardDeductionJoint: 32200,

  // FICA / Social Security (FICA OASDI) 2026
  socialSecurity: {
    wageCap: 184500,
    employeeRate: 0.062, // 6.2%
    selfEmployedRate: 0.124, // 12.4%
    maxEmployeeContrib: 11439.00,
    maxSelfEmployedContrib: 22878.00,
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
