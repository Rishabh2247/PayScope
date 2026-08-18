import { FinancialInputs, TaxCalculationResult, TaxDeductionItem } from '../types';

export function calculateCATax(inputs: FinancialInputs): TaxCalculationResult {
  const gross = inputs.annualSalary || (inputs.incomeRate ? inputs.incomeRate * (inputs.workHoursPerWeek || 40) * (inputs.weeksPerYear || 52) : 120000);
  const province = inputs.state || 'Ontario';
  const empType = inputs.employmentType || 'Full-time Employee';

  let businessWriteOffs = 0;
  let cpp = 0;
  let ei = 0;
  let smallBusinessCorpTax = 0;
  let federalTax = 0;
  let provincialTax = 0;

  if (empType === 'Incorporated') {
    // 1. Incorporated Contractor (Small Business Corp)
    const expensePercent = inputs.k401Contribution || 12; // 12% typical business expense write-offs
    businessWriteOffs = gross * (expensePercent / 100);
    const activeNetCorpIncome = Math.max(0, gross - businessWriteOffs);

    // Ontario Small Business Deduction (SBD) Corp Tax = 9% Fed + 3.2% ON = 12.2%
    smallBusinessCorpTax = activeNetCorpIncome * 0.122;

    // Remaining Corp Net Income drawn as owner non-eligible dividend
    const ownerDividendDraw = Math.max(0, activeNetCorpIncome - smallBusinessCorpTax);

    // Ontario Personal Non-Eligible Dividend Tax Integration (~11.8% effective tax rate)
    federalTax = ownerDividendDraw * 0.075;
    provincialTax = ownerDividendDraw * 0.043;
  } else if (empType.includes('Contractor')) {
    // 2. Sole Proprietorship / C2C Contractor
    const expensePercent = inputs.k401Contribution || 10;
    businessWriteOffs = gross * (expensePercent / 100);
    const netBusinessIncome = Math.max(0, gross - businessWriteOffs);

    // Self-Employed CPP (11.9% on earnings between $3,500 and $68,500 max = $7,735)
    cpp = Math.min(Math.max(0, netBusinessIncome - 3500) * 0.119, 7735);
    ei = 0;

    // CRA Taxable Income (50% CPP deduction)
    const taxablePersonal = Math.max(0, netBusinessIncome - cpp / 2);

    // Federal Tax (15% up to 55,867; 20.5% up to 111,733; 26% over) less $2,355.75 BPA credit
    let fedGrossTax = 0;
    if (taxablePersonal <= 55867) {
      fedGrossTax = taxablePersonal * 0.15;
    } else if (taxablePersonal <= 111733) {
      fedGrossTax = 8380.05 + (taxablePersonal - 55867) * 0.205;
    } else {
      fedGrossTax = 19832.58 + (taxablePersonal - 111733) * 0.26;
    }
    federalTax = Math.max(0, fedGrossTax - 2355.75);

    // Ontario Tax (5.05% up to 51,446; 9.15% up to 102,894; 11.16% over) less $626.15 BPA credit
    let provGrossTax = 0;
    if (province === 'Ontario') {
      if (taxablePersonal <= 51446) {
        provGrossTax = taxablePersonal * 0.0505;
      } else if (taxablePersonal <= 102894) {
        provGrossTax = 2598.02 + (taxablePersonal - 51446) * 0.0915;
      } else {
        provGrossTax = 7310.56 + (taxablePersonal - 102894) * 0.1116;
      }
      provincialTax = Math.max(0, provGrossTax - 626.15);
    } else if (province === 'British Columbia') {
      provGrossTax = taxablePersonal <= 47937 ? taxablePersonal * 0.0506 : 2425 + (taxablePersonal - 47937) * 0.077;
      provincialTax = Math.max(0, provGrossTax - 550);
    } else {
      provincialTax = taxablePersonal * 0.082;
    }
  } else {
    // 3. T4 / Full-time Employee
    cpp = Math.min(Math.max(0, gross - 3500) * 0.0595, 3867.5);
    ei = Math.min(gross * 0.0166, 1049.12);

    const taxablePersonal = Math.max(0, gross - cpp - ei);

    // Federal Tax less $2,355.75 BPA credit
    let fedGrossTax = 0;
    if (taxablePersonal <= 55867) {
      fedGrossTax = taxablePersonal * 0.15;
    } else if (taxablePersonal <= 111733) {
      fedGrossTax = 8380.05 + (taxablePersonal - 55867) * 0.205;
    } else {
      fedGrossTax = 19832.58 + (taxablePersonal - 111733) * 0.26;
    }
    federalTax = Math.max(0, fedGrossTax - 2355.75);

    // Ontario Tax less $626.15 BPA credit
    let provGrossTax = 0;
    if (province === 'Ontario') {
      if (taxablePersonal <= 51446) {
        provGrossTax = taxablePersonal * 0.0505;
      } else if (taxablePersonal <= 102894) {
        provGrossTax = 2598.02 + (taxablePersonal - 51446) * 0.0915;
      } else {
        provGrossTax = 7310.56 + (taxablePersonal - 102894) * 0.1116;
      }
      provincialTax = Math.max(0, provGrossTax - 626.15);
    } else if (province === 'British Columbia') {
      provGrossTax = taxablePersonal <= 47937 ? taxablePersonal * 0.0506 : 2425 + (taxablePersonal - 47937) * 0.077;
      provincialTax = Math.max(0, provGrossTax - 550);
    } else {
      provincialTax = taxablePersonal * 0.082;
    }
  }

  // Calculate Net Take-Home Pay (Annual & Monthly)
  const totalTaxes = federalTax + provincialTax + cpp + ei + smallBusinessCorpTax;
  const takeHomePayAnnual = Math.max(0, gross - totalTaxes - businessWriteOffs);
  const takeHomePayMonthly = takeHomePayAnnual / 12;

  const totalHours = (inputs.workHoursPerWeek || 40) * (inputs.weeksPerYear || 52);
  const grossHourlyRate = totalHours > 0 ? gross / totalHours : 0;
  const effectiveHourlyRate = totalHours > 0 ? takeHomePayAnnual / totalHours : 0;
  const takeHomePercentage = gross > 0 ? (takeHomePayAnnual / gross) * 100 : 0;

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
    {
      name: `Provincial Tax (${province})`,
      amount: provincialTax,
      percentage: (provincialTax / gross) * 100,
      color: '#F59E0B',
    },
  ];

  if (empType === 'Incorporated') {
    breakdown.push({
      name: 'Small Business Corp Tax (12.2%)',
      amount: smallBusinessCorpTax,
      percentage: (smallBusinessCorpTax / gross) * 100,
      color: '#8B5CF6',
    });
    if (businessWriteOffs > 0) {
      breakdown.push({
        name: 'Corporate Expense Write-offs',
        amount: businessWriteOffs,
        percentage: (businessWriteOffs / gross) * 100,
        color: '#6366F1',
      });
    }
  } else if (empType.includes('Contractor')) {
    breakdown.push({
      name: 'Self-Employed CPP (11.9%)',
      amount: cpp,
      percentage: (cpp / gross) * 100,
      color: '#3B82F6',
    });
    if (businessWriteOffs > 0) {
      breakdown.push({
        name: 'Business Expense Write-offs',
        amount: businessWriteOffs,
        percentage: (businessWriteOffs / gross) * 100,
        color: '#6366F1',
      });
    }
  } else {
    breakdown.push({
      name: 'CPP (Pension 5.95%)',
      amount: cpp,
      percentage: (cpp / gross) * 100,
      color: '#3B82F6',
    });
    breakdown.push({
      name: 'EI (Insurance 1.66%)',
      amount: ei,
      percentage: (ei / gross) * 100,
      color: '#8B5CF6',
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
    businessTax: smallBusinessCorpTax,
    ownerCompensation: takeHomePayAnnual,
    estimatedPersonalTakeHome: takeHomePayAnnual,
    effectivePersonalNetRate: effectiveHourlyRate,
    federalTax,
    federalTaxPercentage: (federalTax / gross) * 100,
    stateTax: provincialTax,
    stateTaxPercentage: (provincialTax / gross) * 100,
    socialSecurityTax: cpp,
    socialSecurityTaxPercentage: (cpp / gross) * 100,
    medicareTax: ei,
    medicareTaxPercentage: (ei / gross) * 100,
    otherDeductions: businessWriteOffs,
    otherDeductionsPercentage: (businessWriteOffs / gross) * 100,
    totalTax: totalTaxes + businessWriteOffs,
    effectiveTaxRate: ((totalTaxes + businessWriteOffs) / gross) * 100,
    breakdown,
  };
}
