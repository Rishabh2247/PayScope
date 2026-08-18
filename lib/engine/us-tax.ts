import { FinancialInputs, TaxCalculationResult, TaxDeductionItem } from '../types';

export function calculateUSTax(inputs: FinancialInputs): TaxCalculationResult {
  const gross = inputs.annualSalary || (inputs.incomeRate ? inputs.incomeRate * (inputs.workHoursPerWeek || 40) * (inputs.weeksPerYear || 52) : 120000);
  const filingStatus = inputs.filingStatus || 'Single';
  const state = inputs.state || 'Texas';
  const empType = inputs.employmentType || 'Full-time Employee';

  let businessWriteOffs = 0;
  let preTaxBenefits = 0;

  if (empType === '1099 Contractor') {
    const expensePercent = inputs.k401Contribution || 12;
    businessWriteOffs = gross * (expensePercent / 100);
  } else if (empType === 'C2C') {
    const expensePercent = inputs.k401Contribution || 15;
    businessWriteOffs = gross * (expensePercent / 100);
  } else {
    if (inputs.healthInsuranceMonthly) {
      preTaxBenefits += inputs.healthInsuranceMonthly * 12;
    }
    if (inputs.k401Contribution) {
      preTaxBenefits += gross * (inputs.k401Contribution / 100);
    }
  }

  const netBusinessIncome = Math.max(0, gross - businessWriteOffs);

  // Standard Deductions
  const standardDeductions: Record<string, number> = {
    Single: 14600,
    'Married Jointly': 29200,
    'Head of Household': 21900,
  };
  const stdDeduction = standardDeductions[filingStatus] || 14600;
  const dependentCredit = (inputs.dependents || 0) * 2000;

  // FICA / Self-Employment Tax (SECA)
  let socialSecurity = 0;
  let medicare = 0;
  let selfEmploymentTax = 0;

  if (empType === '1099 Contractor') {
    const seTaxable = netBusinessIncome * 0.9235;
    const ssCap = 168600;
    const seSocialSecurity = Math.min(seTaxable * 0.124, ssCap * 0.124);
    const seMedicare = seTaxable * 0.029;
    selfEmploymentTax = seSocialSecurity + seMedicare;

    socialSecurity = seSocialSecurity / 2;
    medicare = seMedicare / 2;
  } else if (empType === 'C2C') {
    const salaryComponent = netBusinessIncome * 0.60;
    socialSecurity = Math.min(salaryComponent * 0.062, 168600 * 0.062);
    medicare = salaryComponent * 0.0145;
  } else {
    const ficaBase = Math.max(0, gross - preTaxBenefits);
    socialSecurity = Math.min(ficaBase * 0.062, 168600 * 0.062);
    medicare = ficaBase * 0.0145;
    if (ficaBase > 200000 && filingStatus === 'Single') {
      medicare += (ficaBase - 200000) * 0.009;
    }
  }

  // Federal Income Taxable Base
  let federalTaxableIncome = 0;
  if (empType === '1099 Contractor') {
    const seDeduction = selfEmploymentTax / 2;
    federalTaxableIncome = Math.max(0, netBusinessIncome - seDeduction - stdDeduction);
  } else if (empType === 'C2C') {
    const qbiDeduction = netBusinessIncome * 0.20;
    federalTaxableIncome = Math.max(0, netBusinessIncome - qbiDeduction - stdDeduction);
  } else {
    federalTaxableIncome = Math.max(0, gross - preTaxBenefits - stdDeduction);
  }

  // Federal Progressive Tax Brackets (2025/2026)
  let federalTax = 0;
  if (filingStatus === 'Single') {
    if (federalTaxableIncome <= 11925) {
      federalTax = federalTaxableIncome * 0.10;
    } else if (federalTaxableIncome <= 48475) {
      federalTax = 1192.5 + (federalTaxableIncome - 11925) * 0.12;
    } else if (federalTaxableIncome <= 103350) {
      federalTax = 5578.5 + (federalTaxableIncome - 48475) * 0.22;
    } else if (federalTaxableIncome <= 197300) {
      federalTax = 17651 + (federalTaxableIncome - 103350) * 0.24;
    } else {
      federalTax = 40200 + (federalTaxableIncome - 197300) * 0.32;
    }
  } else {
    if (federalTaxableIncome <= 23850) {
      federalTax = federalTaxableIncome * 0.10;
    } else if (federalTaxableIncome <= 96950) {
      federalTax = 2385 + (federalTaxableIncome - 23850) * 0.12;
    } else if (federalTaxableIncome <= 206700) {
      federalTax = 11157 + (federalTaxableIncome - 96950) * 0.22;
    } else {
      federalTax = 35302 + (federalTaxableIncome - 206700) * 0.24;
    }
  }

  federalTax = Math.max(0, federalTax - dependentCredit);

  // State Income Tax
  let stateTax = 0;
  const noStateTaxStates = ['Texas', 'Florida', 'Washington', 'Nevada', 'South Dakota', 'Tennessee', 'Wyoming', 'Alaska'];

  if (noStateTaxStates.includes(state)) {
    stateTax = 0;
  } else if (state === 'California') {
    stateTax = federalTaxableIncome * 0.072;
  } else if (state === 'New York') {
    stateTax = federalTaxableIncome * 0.058;
  } else {
    stateTax = federalTaxableIncome * 0.045;
  }

  // Total Taxes & Net Take-Home Calculation
  const totalTax = empType === '1099 Contractor'
    ? federalTax + stateTax + selfEmploymentTax
    : federalTax + stateTax + socialSecurity + medicare;

  const totalDeductions = totalTax + businessWriteOffs + preTaxBenefits;
  const takeHomePayAnnual = Math.max(0, gross - totalDeductions);
  const takeHomePayMonthly = takeHomePayAnnual / 12;

  const totalHours = (inputs.workHoursPerWeek || 40) * (inputs.weeksPerYear || 52);
  const grossHourlyRate = totalHours > 0 ? gross / totalHours : 0;
  const effectiveHourlyRate = totalHours > 0 ? takeHomePayAnnual / totalHours : 0;

  const takeHomePercentage = gross > 0 ? (takeHomePayAnnual / gross) * 100 : 0;
  const effectiveTaxRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

  const breakdown: TaxDeductionItem[] = [
    {
      name: 'Net Take-Home Pay',
      amount: takeHomePayAnnual,
      percentage: takeHomePercentage,
      color: '#10B981',
    },
    {
      name: 'Federal Income Tax',
      amount: federalTax,
      percentage: (federalTax / gross) * 100,
      color: '#EF4444',
    },
  ];

  if (empType === '1099 Contractor') {
    breakdown.push({
      name: 'Self-Employment Tax (SECA)',
      amount: selfEmploymentTax,
      percentage: (selfEmploymentTax / gross) * 100,
      color: '#8B5CF6',
    });
    if (businessWriteOffs > 0) {
      breakdown.push({
        name: 'Business Write-Offs',
        amount: businessWriteOffs,
        percentage: (businessWriteOffs / gross) * 100,
        color: '#6366F1',
      });
    }
  } else if (empType === 'C2C') {
    breakdown.push({
      name: 'Payroll FICA Tax',
      amount: socialSecurity + medicare,
      percentage: ((socialSecurity + medicare) / gross) * 100,
      color: '#3B82F6',
    });
    if (businessWriteOffs > 0) {
      breakdown.push({
        name: 'Corp Expense Write-offs',
        amount: businessWriteOffs,
        percentage: (businessWriteOffs / gross) * 100,
        color: '#6366F1',
      });
    }
  } else {
    breakdown.push({
      name: 'Social Security (6.2%)',
      amount: socialSecurity,
      percentage: (socialSecurity / gross) * 100,
      color: '#3B82F6',
    });
    breakdown.push({
      name: 'Medicare (1.45%)',
      amount: medicare,
      percentage: (medicare / gross) * 100,
      color: '#8B5CF6',
    });
  }

  if (stateTax > 0) {
    breakdown.push({
      name: `State Tax (${state.substring(0, 2).toUpperCase()})`,
      amount: stateTax,
      percentage: (stateTax / gross) * 100,
      color: '#F59E0B',
    });
  }

  return {
    grossIncome: gross,
    annualGross: gross,
    monthlyGross: gross / 12,
    annualBillableHours: totalHours,
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
    federalTaxPercentage: (federalTax / gross) * 100,
    stateTax,
    stateTaxPercentage: (stateTax / gross) * 100,
    socialSecurityTax: socialSecurity,
    socialSecurityTaxPercentage: (socialSecurity / gross) * 100,
    medicareTax: medicare,
    medicareTaxPercentage: (medicare / gross) * 100,
    otherDeductions: businessWriteOffs + preTaxBenefits,
    otherDeductionsPercentage: ((businessWriteOffs + preTaxBenefits) / gross) * 100,
    totalTax: totalDeductions,
    effectiveTaxRate,
    breakdown,
  };
}
