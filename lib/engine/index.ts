import { CompleteFinancialSnapshot, FinancialInputs, TaxCalculationResult } from '../types';
import { calculateCATax } from './ca-tax';
import { calculateUSTax } from './us-tax';
import { getCountryEconomicData } from './country-data';
import { isContractorRole } from '../formatters';

export function calculateSnapshot(inputs: FinancialInputs): CompleteFinancialSnapshot {
  const country = inputs.country || 'US';
  const hoursPerWeek = inputs.workHoursPerWeek || 40;
  const weeksPerYear = inputs.weeksPerYear || 52;
  const annualBillableHours = hoursPerWeek * weeksPerYear;
  const isContractor = isContractorRole(inputs.employmentType);

  let annualGross = 0;
  let contractBillingRate = 0;

  if (isContractor) {
    // Input is Per Hour Rate for Contractors (e.g. 60)
    contractBillingRate = inputs.incomeRate || inputs.annualSalary || 60;
    annualGross = contractBillingRate * hoursPerWeek * weeksPerYear;
  } else {
    // Input is Annual Salary for Full-time / Employees (e.g. 120,000)
    annualGross = inputs.incomeRate || inputs.annualSalary || 120000;
    contractBillingRate = annualBillableHours > 0 ? annualGross / annualBillableHours : 0;
  }

  const inputsWithAnnualGross: FinancialInputs = {
    ...inputs,
    annualSalary: annualGross,
  };

  // Perform Country Tax & Deductions Calculation
  const taxResultBase: TaxCalculationResult =
    country === 'CA'
      ? calculateCATax(inputsWithAnnualGross)
      : calculateUSTax(inputsWithAnnualGross);

  const contractNetHourlyRate = annualBillableHours > 0 ? taxResultBase.takeHomePayAnnual / annualBillableHours : 0;

  const tax: TaxCalculationResult = {
    ...taxResultBase,
    annualGross,
    monthlyGross: annualGross / 12,
    annualBillableHours,
    annualContractRevenue: annualGross,
    monthlyContractRevenue: annualGross / 12,
    contractBillingRate,
    contractNetHourlyRate,
    monthlyGrossContract: annualGross / 12,
    monthlyNetContract: taxResultBase.takeHomePayMonthly,
    annualGrossContract: annualGross,
    annualNetContract: taxResultBase.takeHomePayAnnual,
    effectivePersonalNetRate: contractNetHourlyRate,
  };

  const economic = getCountryEconomicData(
    country,
    inputs.city || 'Austin',
    inputs.state || 'Texas',
    tax.takeHomePayMonthly
  );

  const purchasingPowerNeeded = annualGross * (1 + economic.inflationRate / 100);

  return {
    inputs,
    tax,
    economic,
    purchasingPowerNeeded,
  };
}
