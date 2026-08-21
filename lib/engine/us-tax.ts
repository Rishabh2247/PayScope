import { FinancialInputs, TaxCalculationResult, TaxDeductionItem } from '../types';
import { US_FEDERAL_TAX_2026 } from '../tax-rules/united-states/2026/federal';
import { US_STATE_TAX_2026 } from '../tax-rules/united-states/2026/states';

export function calculateUSTax(inputs: FinancialInputs): TaxCalculationResult {
  const hoursPerWeek = inputs.workHoursPerWeek || 40;
  const weeksPerYear = inputs.weeksPerYear || 52;
  const annualHours = hoursPerWeek * weeksPerYear;

  const gross = Math.max(0, typeof inputs.annualSalary === 'number' ? inputs.annualSalary : (inputs.incomeRate ? inputs.incomeRate * annualHours : 0));
  const state = inputs.state || 'Texas';
  const empType = inputs.employmentType || 'Full-time Employee';
  const isJoint = inputs.filingStatus === 'Married Jointly';

  let businessWriteOffs = 0;
  let socialSecurity = 0;
  let medicare = 0;
  let federalTax = 0;
  let stateTax = 0;

  const fedRules = US_FEDERAL_TAX_2026;
  const stateConfig = US_STATE_TAX_2026[state] || US_STATE_TAX_2026['Texas'];

  const is1099 = empType.includes('1099') || empType.includes('Sole Proprietorship') || empType.includes('Self-Employed');
  const isC2C = empType.includes('C2C') || empType.includes('LLC');

  if (is1099 || isC2C) {
    // 1. 1099 / C2C / SOLE PROPRIETOR (SELF-EMPLOYED TAXATION)
    const writeOffPct = (inputs.k401Contribution || 10) / 100;
    businessWriteOffs = gross * writeOffPct;
    const netBusinessIncome = Math.max(0, gross - businessWriteOffs);

    // Self-Employment Tax (15.3% on 92.35% of net business income)
    const seTaxableIncome = netBusinessIncome * 0.9235;

    // Social Security portion (12.4% up to $176,100 cap)
    const ssEarnings = Math.min(seTaxableIncome, fedRules.socialSecurity.wageCap);
    socialSecurity = Math.min(ssEarnings * fedRules.socialSecurity.selfEmployedRate, fedRules.socialSecurity.maxSelfEmployedContrib);

    // Medicare portion (2.9% + 0.9% additional over threshold)
    medicare = seTaxableIncome * fedRules.medicare.selfEmployedRate;
    const addThreshold = isJoint ? fedRules.medicare.additionalThresholdJoint : fedRules.medicare.additionalThresholdSingle;
    if (seTaxableIncome > addThreshold) {
      medicare += (seTaxableIncome - addThreshold) * fedRules.medicare.additionalRate;
    }

    // Adjusted Gross Income (AGI) less 50% SE Tax & Standard Deduction
    const seDeduction = (socialSecurity + medicare) / 2;
    const stdDeduction = isJoint ? fedRules.standardDeductionJoint : fedRules.standardDeductionSingle;
    const taxablePersonal = Math.max(0, netBusinessIncome - seDeduction - stdDeduction);

    // Progressive Federal Income Tax (IRS 2026)
    const brackets = isJoint ? fedRules.bracketsJoint : fedRules.bracketsSingle;
    federalTax = calculateProgressiveTax(taxablePersonal, brackets);

    // Progressive State Income Tax
    if (stateConfig && stateConfig.hasStateTax) {
      stateTax = calculateProgressiveTax(taxablePersonal, stateConfig.brackets);
    }

  } else {
    // 2. W-2 FULL-TIME EMPLOYEE / W2 CONTRACTOR
    // Employee Social Security (6.2% up to $176,100 cap)
    const ssEarnings = Math.min(gross, fedRules.socialSecurity.wageCap);
    socialSecurity = Math.min(ssEarnings * fedRules.socialSecurity.employeeRate, fedRules.socialSecurity.maxEmployeeContrib);

    // Employee Medicare (1.45% + 0.9% additional over threshold)
    medicare = gross * fedRules.medicare.employeeRate;
    const addThreshold = isJoint ? fedRules.medicare.additionalThresholdJoint : fedRules.medicare.additionalThresholdSingle;
    if (gross > addThreshold) {
      medicare += (gross - addThreshold) * fedRules.medicare.additionalRate;
    }

    // 401(k) / Pre-tax Health Deductions
    const k401Deduction = gross * ((inputs.k401Contribution || 0) / 100);
    const stdDeduction = isJoint ? fedRules.standardDeductionJoint : fedRules.standardDeductionSingle;
    const taxablePersonal = Math.max(0, gross - k401Deduction - stdDeduction);

    // Progressive Federal Tax (IRS 2026)
    const brackets = isJoint ? fedRules.bracketsJoint : fedRules.bracketsSingle;
    federalTax = calculateProgressiveTax(taxablePersonal, brackets);

    // State Tax
    if (stateConfig && stateConfig.hasStateTax) {
      stateTax = calculateProgressiveTax(taxablePersonal, stateConfig.brackets);
    }
  }

  const mandatoryDeductions = federalTax + stateTax + socialSecurity + medicare;
  const takeHomePayAnnual = Math.max(0, gross - mandatoryDeductions - businessWriteOffs);
  const takeHomePayMonthly = takeHomePayAnnual / 12;

  const grossHourlyRate = annualHours > 0 ? gross / annualHours : 0;
  const effectiveHourlyRate = annualHours > 0 ? takeHomePayAnnual / annualHours : 0;
  const takeHomePercentage = gross > 0 ? (takeHomePayAnnual / gross) * 100 : 0;

  const breakdown: TaxDeductionItem[] = [
    {
      name: 'Net Take-Home Pay',
      amount: takeHomePayAnnual,
      percentage: takeHomePercentage,
      color: '#1F8F68',
    },
    {
      name: 'Federal Income Tax (IRS 2026)',
      amount: federalTax,
      percentage: gross > 0 ? (federalTax / gross) * 100 : 0,
      color: '#EF4444',
    },
  ];

  if (stateTax > 0) {
    breakdown.push({
      name: `State Tax (${state})`,
      amount: stateTax,
      percentage: gross > 0 ? (stateTax / gross) * 100 : 0,
      color: '#F59E0B',
    });
  }

  if (socialSecurity > 0) {
    breakdown.push({
      name: is1099 ? 'Self-Employment Social Security (12.4%)' : 'Social Security (6.2%)',
      amount: socialSecurity,
      percentage: gross > 0 ? (socialSecurity / gross) * 100 : 0,
      color: '#3B82F6',
    });
  }

  if (medicare > 0) {
    breakdown.push({
      name: is1099 ? 'Self-Employment Medicare (2.9%)' : 'Medicare (1.45%)',
      amount: medicare,
      percentage: gross > 0 ? (medicare / gross) * 100 : 0,
      color: '#8B5CF6',
    });
  }

  if (businessWriteOffs > 0) {
    breakdown.push({
      name: 'Business Expense Write-offs',
      amount: businessWriteOffs,
      percentage: gross > 0 ? (businessWriteOffs / gross) * 100 : 0,
      color: '#6366F1',
    });
  }

  return {
    grossIncome: gross,
    annualGross: gross,
    monthlyGross: gross / 12,
    annualBillableHours: annualHours,
    grossHourlyRate,
    takeHomePayAnnual,
    takeHomePayMonthly,
    effectiveHourlyRate,
    takeHomePercentage,
    annualContractRevenue: gross,
    monthlyContractRevenue: gross / 12,
    contractBillingRate: grossHourlyRate,
    contractNetHourlyRate: effectiveHourlyRate,
    monthlyGrossContract: gross / 12,
    monthlyNetContract: takeHomePayMonthly,
    annualGrossContract: gross,
    annualNetContract: takeHomePayAnnual,
    businessExpenses: businessWriteOffs,
    businessTax: 0,
    ownerCompensation: takeHomePayAnnual,
    estimatedPersonalTakeHome: takeHomePayAnnual,
    effectivePersonalNetRate: effectiveHourlyRate,
    federalTax,
    federalTaxPercentage: gross > 0 ? (federalTax / gross) * 100 : 0,
    stateTax,
    stateTaxPercentage: gross > 0 ? (stateTax / gross) * 100 : 0,
    socialSecurityTax: socialSecurity,
    socialSecurityTaxPercentage: gross > 0 ? (socialSecurity / gross) * 100 : 0,
    medicareTax: medicare,
    medicareTaxPercentage: gross > 0 ? (medicare / gross) * 100 : 0,
    otherDeductions: businessWriteOffs,
    otherDeductionsPercentage: gross > 0 ? (businessWriteOffs / gross) * 100 : 0,
    totalTax: mandatoryDeductions + businessWriteOffs,
    effectiveTaxRate: gross > 0 ? ((mandatoryDeductions + businessWriteOffs) / gross) * 100 : 0,
    breakdown,
  };
}

function calculateProgressiveTax(taxable: number, brackets: { min: number; max: number | null; rate: number }[]): number {
  if (taxable <= 0) return 0;
  let tax = 0;

  for (const b of brackets) {
    if (taxable > b.min) {
      const chunk = b.max ? Math.min(taxable - b.min, b.max - b.min) : taxable - b.min;
      tax += chunk * b.rate;
    }
  }

  return Math.max(0, tax);
}
