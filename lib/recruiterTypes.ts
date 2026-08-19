import { CountryCode, CurrencyCode } from './types';

export type RecruiterRateFrequency = 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Annual';

export type ContractType =
  | 'W2'
  | '1099'
  | 'C2C'
  | 'Incorporated'
  | 'Staff Augmentation'
  | 'Permanent Placement';

export type MarginStatus = 'Healthy' | 'Below Target' | 'Low Margin';

export interface RecruiterInputs {
  jobTitle: string;
  country: CountryCode;
  currency: CurrencyCode;
  state: string;
  city: string;
  contractType: ContractType;
  rateFrequency: RecruiterRateFrequency;
  candidatePayRate: number;
  clientBillRate: number;
  workHoursPerWeek: number;
  weeksPerYear: number;
  billableHoursPerWeek: number;
  contractDurationMonths: number;
  targetMarginPercent: number;
  employerBurdenPercent: number;
  benefitsMonthly: number;
  insuranceMonthly: number;
  otherRecurringMonthly: number;
  oneTimeRecruitingCost: number;
  targetMarginMode: 'calculate_bill_rate' | 'calculate_max_pay_rate';
  recruiterIncentiveType: 'percentage_profit' | 'percentage_bill' | 'fixed_monthly';
  recruiterIncentiveValue: number;
}

export interface RecruiterCalculationResult {
  inputs: RecruiterInputs;
  spread: number;
  markupPercent: number;
  grossMarginPercent: number;
  effectiveCostPerHour: number;
  netSpreadPerHour: number;
  billableHoursMonthly: number;
  billableHoursAnnual: number;
  contractTotalHours: number;
  monthlyRevenue: number;
  monthlyCandidateCost: number;
  monthlyEmployerCost: number;
  monthlyGrossProfit: number;
  monthlyNetProfit: number;
  annualRevenue: number;
  annualCandidateCost: number;
  annualGrossProfit: number;
  contractTotalRevenue: number;
  contractTotalCandidateCost: number;
  contractTotalGrossProfit: number;
  contractTotalEmployerCost: number;
  contractTotalOtherCost: number;
  recommendedBillRate: number;
  maximumPayRate: number;
  marginStatus: MarginStatus;
  recruiterIncentiveMonthly: number;
  recruiterIncentiveContract: number;
}

export interface MonthlyForecastItem {
  monthNumber: number;
  monthName: string;
  revenue: number;
  candidateCost: number;
  employerCost: number;
  grossProfit: number;
  cumulativeProfit: number;
  cumulativeMarginPercent: number;
}

export interface RateCardItem {
  id: string;
  jobTitle: string;
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Principal' | 'Architect';
  location: string;
  contractType: ContractType;
  minPayRate: number;
  maxPayRate: number;
  targetPayRate: number;
  targetBillRate: number;
  targetMarginPercent: number;
  currency: CurrencyCode;
}

export interface RecruiterContractRecord {
  id: string;
  clientName: string;
  role: string;
  location: string;
  candidatePay: number;
  billRate: number;
  grossMarginPercent: number;
  contractDurationMonths: number;
  estimatedTotalProfit: number;
  status: MarginStatus;
}

export interface TalentCandidate {
  id: string;
  name: string;
  photoUrl?: string;
  headline: string;
  jobTitle: string;
  location: string;
  yearsOfExperience: number;
  skills: string[];
  education: string;
  bioSummary: string;
  linkedInUrl: string;
  source: string;
  matchScore: number; // PayScope Match Score
  matchBreakdown: {
    jobTitle: number;
    skills: number;
    experience: number;
    location: number;
    industry: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  relatedSkills: string[];
  suggestedPayRate: number;
  suggestedBillRate: number;
}

export interface JdAnalysisResult {
  jobTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number;
  location: string;
  education: string;
  certifications: string[];
  industry: string;
  keywords: string[];
  responsibilities: string[];
  suggestedTitles: string[];
  booleanString: string;
  xrayQuery: string;
}

export interface AtsKeywordMatch {
  keyword: string;
  category: 'required' | 'semantic' | 'preferred' | 'missing';
  occurrences: number;
}

export interface AtsAnalysisResult {
  overallScore: number;
  requiredScore: number;
  preferredScore: number;
  experienceScore: number;
  educationScore: number;
  skillsScore: number;
  matchedKeywords: AtsKeywordMatch[];
  missingKeywords: string[];
  weakEvidenceAreas: string[];
  parsingIssues: string[];
  recommendations: string[];
}
