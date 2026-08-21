import { FinancialInputs, TaxCalculationResult, TaxDeductionItem } from '../types';
import { CA_FEDERAL_TAX_2026 } from '../tax-rules/canada/2026/federal';
import { CA_PROVINCIAL_TAX_2026 } from '../tax-rules/canada/2026/provinces';

export function calculateCATax(inputs: FinancialInputs): TaxCalculationResult {
  const hoursPerWeek = inputs.workHoursPerWeek || 40;
  const weeksPerYear = inputs.weeksPerYear || 52;
  const annualHours = hoursPerWeek * weeksPerYear;

  const gross = Math.max(0, typeof inputs.annualSalary === 'number' ? inputs.annualSalary : (inputs.incomeRate ? inputs.incomeRate * annualHours : 0));
  const province = inputs.state || 'Ontario';
  const empType = inputs.employmentType || 'Full-time Employee';

  let businessWriteOffs = 0;
  let cpp = 0;
  let cpp2 = 0;
  let ei = 0;
  let smallBusinessCorpTax = 0;
  let federalTax = 0;
  let provincialTax = 0;

  const provConfig = CA_PROVINCIAL_TAX_2026[province] || CA_PROVINCIAL_TAX_2026['Ontario'];
  const fedRules = CA_FEDERAL_TAX_2026;

  // Determine strict category:
  // Is this self-employed / sole prop? ONLY if explicitly selected as Sole Proprietorship / Self-Employed!
  const isSoleProp = empType.includes('Sole Proprietorship') || empType.includes('Self-Employed') || empType.includes('1099');
  const isIncorporated = empType.includes('Incorporated') || empType.includes('Corporation');

  if (isIncorporated) {
    // 1. INCORPORATED CONTRACTOR (SMALL BUSINESS CORPORATION)
    const writeOffPct = (inputs.k401Contribution || 12) / 100;
    businessWriteOffs = gross * writeOffPct;
    const activeNetCorpIncome = Math.max(0, gross - businessWriteOffs);

    // Ontario Small Business Rate (SBD): 9% Fed + 3.2% ON = 12.2%
    smallBusinessCorpTax = activeNetCorpIncome * 0.122;

    const ownerDividendDraw = Math.max(0, activeNetCorpIncome - smallBusinessCorpTax);
    federalTax = ownerDividendDraw * 0.075;
    provincialTax = ownerDividendDraw * 0.043;

  } else if (isSoleProp) {
    // 2. SELF-EMPLOYED / SOLE PROPRIETOR
    const writeOffPct = (inputs.k401Contribution || 10) / 100;
    businessWriteOffs = gross * writeOffPct;
    const netBusinessIncome = Math.max(0, gross - businessWriteOffs);

    // Self-Employed CPP Tier 1 (11.9% on earnings between $3,500 and $71,300)
    const cppEarnings1 = Math.max(0, Math.min(netBusinessIncome, fedRules.cpp.ympe) - fedRules.cpp.basicExemption);
    cpp = Math.min(cppEarnings1 * fedRules.cpp.selfEmployedRate, fedRules.cpp.maxSelfEmployedContrib);

    // Self-Employed CPP Tier 2 (8.0% on earnings between $71,300 and $76,000)
    const cppEarnings2 = Math.max(0, Math.min(netBusinessIncome, fedRules.cpp2.ceiling) - fedRules.cpp.ympe);
    cpp2 = Math.min(cppEarnings2 * fedRules.cpp2.selfEmployedRate, fedRules.cpp2.maxSelfEmployedContrib);

    ei = 0; // Self-employed do not pay employee EI unless opted in

    // CRA Taxable Income (50% deduction of self-employed CPP/CPP2)
    const taxablePersonal = Math.max(0, netBusinessIncome - (cpp + cpp2) / 2);

    // Progressive Federal Income Tax Calculation
    federalTax = calculateProgressiveTax(taxablePersonal, fedRules.brackets, fedRules.basicPersonalAmount * 0.15);

    // Progressive Provincial Income Tax Calculation
    provincialTax = calculateProgressiveTax(taxablePersonal, provConfig.brackets, provConfig.basicPersonalAmount * (provConfig.brackets[0]?.rate || 0.0505));

  } else {
    // 3. T4 / PAYROLL EMPLOYEE OR T4 CONTRACTOR
    // Employee CPP Tier 1 (5.95% on earnings between $3,500 and $71,300, max $4,034.10)
    const cppEarnings1 = Math.max(0, Math.min(gross, fedRules.cpp.ympe) - fedRules.cpp.basicExemption);
    cpp = Math.min(cppEarnings1 * fedRules.cpp.employeeRate, fedRules.cpp.maxEmployeeContrib);

    // Employee CPP Tier 2 (4.0% on earnings between $71,300 and $76,000, max $188.00)
    const cppEarnings2 = Math.max(0, Math.min(gross, fedRules.cpp2.ceiling) - fedRules.cpp.ympe);
    cpp2 = Math.min(cppEarnings2 * fedRules.cpp2.employeeRate, fedRules.cpp2.maxEmployeeContrib);

    // Employee EI (1.64% on insurable earnings up to $65,700, max $1,077.48)
    const eiEarnings = Math.min(gross, fedRules.ei.maxInsurableEarnings);
    ei = Math.min(eiEarnings * fedRules.ei.employeeRate, fedRules.ei.maxEmployeeContrib);

    // Taxable Income for T4 (gross less CPP, CPP2, EI)
    const taxablePersonal = Math.max(0, gross - cpp - cpp2 - ei);

    // Progressive Federal Tax (less BPA credit)
    federalTax = calculateProgressiveTax(taxablePersonal, fedRules.brackets, fedRules.basicPersonalAmount * 0.15);

    // Progressive Provincial Tax (less Provincial BPA credit)
    provincialTax = calculateProgressiveTax(taxablePersonal, provConfig.brackets, provConfig.basicPersonalAmount * (provConfig.brackets[0]?.rate || 0.0505));
  }

  // Mandatory statutory deductions sum
  const mandatoryDeductions = federalTax + provincialTax + cpp + cpp2 + ei + smallBusinessCorpTax;
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
      name: 'Federal Income Tax (CRA 2026)',
      amount: federalTax,
      percentage: gross > 0 ? (federalTax / gross) * 100 : 0,
      color: '#EF4444',
    },
    {
      name: province === 'Quebec' ? 'Provincial Tax (Quebec Revenu Québec)' : `Provincial Tax (${province})`,
      amount: provincialTax,
      percentage: gross > 0 ? (provincialTax / gross) * 100 : 0,
      color: '#F59E0B',
    },
  ];

  if (cpp > 0) {
    breakdown.push({
      name: isSoleProp ? 'CPP Contribution (Base + 1st Additional 11.9%)' : 'CPP Contribution (Base 4.95% + 1st Additional 1.00%)',
      amount: cpp,
      percentage: gross > 0 ? (cpp / gross) * 100 : 0,
      color: '#3B82F6',
    });
  }

  if (cpp2 > 0) {
    breakdown.push({
      name: isSoleProp ? 'CPP2 Second Additional Contribution (8.0%)' : 'CPP2 Second Additional Contribution (4.0%)',
      amount: cpp2,
      percentage: gross > 0 ? (cpp2 / gross) * 100 : 0,
      color: '#60A5FA',
    });
  }

  if (ei > 0) {
    breakdown.push({
      name: province === 'Quebec' ? 'EI Premium (Quebec Standard Estimate)' : 'EI Premium (1.63%)',
      amount: ei,
      percentage: gross > 0 ? (ei / gross) * 100 : 0,
      color: '#8B5CF6',
    });
  }

  if (smallBusinessCorpTax > 0) {
    breakdown.push({
      name: 'Small Business Corp Tax (12.2%)',
      amount: smallBusinessCorpTax,
      percentage: gross > 0 ? (smallBusinessCorpTax / gross) * 100 : 0,
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
    businessTax: smallBusinessCorpTax,
    ownerCompensation: takeHomePayAnnual,
    estimatedPersonalTakeHome: takeHomePayAnnual,
    effectivePersonalNetRate: effectiveHourlyRate,
    federalTax,
    federalTaxPercentage: gross > 0 ? (federalTax / gross) * 100 : 0,
    stateTax: provincialTax,
    stateTaxPercentage: gross > 0 ? (provincialTax / gross) * 100 : 0,
    socialSecurityTax: cpp + cpp2,
    socialSecurityTaxPercentage: gross > 0 ? ((cpp + cpp2) / gross) * 100 : 0,
    medicareTax: ei,
    medicareTaxPercentage: gross > 0 ? (ei / gross) * 100 : 0,
    otherDeductions: businessWriteOffs,
    otherDeductionsPercentage: gross > 0 ? (businessWriteOffs / gross) * 100 : 0,
    totalTax: mandatoryDeductions + businessWriteOffs,
    effectiveTaxRate: gross > 0 ? ((mandatoryDeductions + businessWriteOffs) / gross) * 100 : 0,
    breakdown,
  };
}

function calculateProgressiveTax(taxable: number, brackets: { min: number; max: number | null; rate: number }[], taxCredit = 0): number {
  if (taxable <= 0) return 0;
  let tax = 0;

  for (const b of brackets) {
    if (taxable > b.min) {
      const chunk = b.max ? Math.min(taxable - b.min, b.max - b.min) : taxable - b.min;
      tax += chunk * b.rate;
    }
  }

  return Math.max(0, tax - taxCredit);
}
