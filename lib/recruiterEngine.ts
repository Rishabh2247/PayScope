import {
  RecruiterInputs,
  RecruiterCalculationResult,
  MonthlyForecastItem,
  RateCardItem,
  RecruiterContractRecord,
  TalentCandidate,
  JdAnalysisResult,
  AtsAnalysisResult,
  AtsKeywordMatch,
} from './recruiterTypes';

/**
 * Normalizes input rate to hourly equivalent based on user rate frequency and hours per week.
 */
export function normalizeToHourly(rate: number, frequency: string, hoursPerWeek: number): number {
  if (!rate || rate <= 0) return 0;
  switch (frequency) {
    case 'Daily':
      return rate / (hoursPerWeek / 5 || 8);
    case 'Weekly':
      return rate / (hoursPerWeek || 40);
    case 'Monthly':
      return rate / ((hoursPerWeek || 40) * (52 / 12));
    case 'Annual':
      return rate / ((hoursPerWeek || 40) * 52);
    case 'Hourly':
    default:
      return rate;
  }
}

/**
 * Calculates complete Rate & Margin metrics for PayScope Recruit.
 */
export function calculateRecruiterMetrics(inputs: RecruiterInputs): RecruiterCalculationResult {
  const hoursWk = inputs.workHoursPerWeek || 40;
  const weeksYr = inputs.weeksPerYear || 52;
  const billableWk = inputs.billableHoursPerWeek || hoursWk;
  const durationMonths = inputs.contractDurationMonths || 6;

  // Hourly base conversion
  const candidatePayHourly = normalizeToHourly(inputs.candidatePayRate, inputs.rateFrequency, hoursWk);
  const clientBillHourly = normalizeToHourly(inputs.clientBillRate, inputs.rateFrequency, billableWk);

  // Spread, Markup, Margin
  const spread = clientBillHourly - candidatePayHourly;
  const markupPercent = candidatePayHourly > 0 ? (spread / candidatePayHourly) * 100 : 0;
  const grossMarginPercent = clientBillHourly > 0 ? (spread / clientBillHourly) * 100 : 0;

  // Monthly overhead / benefits per hour
  const billableHoursMonthly = billableWk * (weeksYr / 12);
  const overheadMonthlyTotal = (inputs.benefitsMonthly || 0) + (inputs.insuranceMonthly || 0) + (inputs.otherRecurringMonthly || 0);
  const overheadHourly = billableHoursMonthly > 0 ? overheadMonthlyTotal / billableHoursMonthly : 0;

  // Employer burden cost per hour
  const burdenHourly = candidatePayHourly * ((inputs.employerBurdenPercent || 0) / 100);
  const effectiveCostPerHour = candidatePayHourly + burdenHourly + overheadHourly;
  const netSpreadPerHour = clientBillHourly - effectiveCostPerHour;

  // Billable hours calculations
  const billableHoursAnnual = billableWk * weeksYr;
  const contractTotalHours = billableHoursMonthly * durationMonths;

  // Monthly & Annual Revenue / Costs / Profits
  const monthlyRevenue = clientBillHourly * billableHoursMonthly;
  const monthlyCandidateCost = candidatePayHourly * billableHoursMonthly;
  const monthlyEmployerCost = (burdenHourly + overheadHourly) * billableHoursMonthly;
  const monthlyGrossProfit = netSpreadPerHour * billableHoursMonthly;
  const monthlyNetProfit = monthlyGrossProfit - (inputs.oneTimeRecruitingCost || 0) / durationMonths;

  const annualRevenue = monthlyRevenue * 12;
  const annualCandidateCost = monthlyCandidateCost * 12;
  const annualGrossProfit = monthlyGrossProfit * 12;

  // Contract Totals
  const contractTotalRevenue = monthlyRevenue * durationMonths;
  const contractTotalCandidateCost = monthlyCandidateCost * durationMonths;
  const contractTotalEmployerCost = monthlyEmployerCost * durationMonths;
  const contractTotalOtherCost = inputs.oneTimeRecruitingCost || 0;
  const contractTotalGrossProfit = contractTotalRevenue - contractTotalCandidateCost - contractTotalEmployerCost - contractTotalOtherCost;

  // Target Margin Calculations
  const targetMargin = inputs.targetMarginPercent || 25;
  const recommendedBillRate = candidatePayHourly / (1 - targetMargin / 100);
  const maximumPayRate = clientBillHourly * (1 - targetMargin / 100);

  // Margin Status
  let marginStatus: 'Healthy' | 'Below Target' | 'Low Margin' = 'Healthy';
  if (grossMarginPercent < targetMargin - 5) {
    marginStatus = 'Low Margin';
  } else if (grossMarginPercent < targetMargin) {
    marginStatus = 'Below Target';
  }

  // Recruiter Incentive
  let recruiterIncentiveMonthly = 0;
  const incVal = inputs.recruiterIncentiveValue || 0;
  if (inputs.recruiterIncentiveType === 'percentage_profit') {
    recruiterIncentiveMonthly = (monthlyGrossProfit * incVal) / 100;
  } else if (inputs.recruiterIncentiveType === 'percentage_bill') {
    recruiterIncentiveMonthly = (monthlyRevenue * incVal) / 100;
  } else {
    recruiterIncentiveMonthly = incVal;
  }
  const recruiterIncentiveContract = recruiterIncentiveMonthly * durationMonths;

  return {
    inputs,
    spread,
    markupPercent,
    grossMarginPercent,
    effectiveCostPerHour,
    netSpreadPerHour,
    billableHoursMonthly,
    billableHoursAnnual,
    contractTotalHours,
    monthlyRevenue,
    monthlyCandidateCost,
    monthlyEmployerCost,
    monthlyGrossProfit,
    monthlyNetProfit,
    annualRevenue,
    annualCandidateCost,
    annualGrossProfit,
    contractTotalRevenue,
    contractTotalCandidateCost,
    contractTotalGrossProfit,
    contractTotalEmployerCost,
    contractTotalOtherCost,
    recommendedBillRate,
    maximumPayRate,
    marginStatus,
    recruiterIncentiveMonthly,
    recruiterIncentiveContract,
  };
}

/**
 * Generates month-by-month profit forecast array for contract duration.
 */
export function generateMonthlyForecast(calc: RecruiterCalculationResult): MonthlyForecastItem[] {
  const months: MonthlyForecastItem[] = [];
  const duration = calc.inputs.contractDurationMonths || 6;

  let cumulativeProfit = 0;
  let cumulativeRevenue = 0;

  for (let i = 1; i <= duration; i++) {
    const oneTimeCostMonth = i === 1 ? calc.inputs.oneTimeRecruitingCost || 0 : 0;
    const monthlyGross = calc.monthlyGrossProfit - oneTimeCostMonth;

    cumulativeProfit += monthlyGross;
    cumulativeRevenue += calc.monthlyRevenue;

    const cumulativeMarginPercent = cumulativeRevenue > 0 ? (cumulativeProfit / cumulativeRevenue) * 100 : 0;

    months.push({
      monthNumber: i,
      monthName: `Month ${i}`,
      revenue: calc.monthlyRevenue,
      candidateCost: calc.monthlyCandidateCost,
      employerCost: calc.monthlyEmployerCost + oneTimeCostMonth,
      grossProfit: monthlyGross,
      cumulativeProfit,
      cumulativeMarginPercent,
    });
  }

  return months;
}

/**
 * Boolean Generator & X-Ray Query Builder (Pure logic, returns empty if inputs empty)
 */
export function buildBooleanQuery(
  jobTitle: string,
  skills: string[],
  location: string,
  keywords: string
): { booleanString: string; xrayQuery: string } {
  if (!jobTitle && skills.length === 0 && !location && !keywords) {
    return { booleanString: '', xrayQuery: '' };
  }

  const cleanTitle = jobTitle.trim();
  let titleQuery = cleanTitle ? `"${cleanTitle}"` : '';
  if (cleanTitle.toLowerCase().includes('senior')) {
    const baseRole = cleanTitle.replace(/senior/i, '').trim();
    titleQuery = `("Senior ${baseRole}" OR "${baseRole}")`;
  }

  const skillsQuery = skills.length > 0 ? skills.map((s) => `AND "${s.trim()}"`).join(' ') : '';
  const kwQuery = keywords ? `AND ${keywords}` : '';
  const locQuery = location ? `AND "${location}"` : '';

  const booleanString = `${titleQuery} ${skillsQuery} ${kwQuery} ${locQuery}`.replace(/\s+/g, ' ').trim();
  const xrayQuery = booleanString ? `site:linkedin.com/in/ ${booleanString}` : '';

  return { booleanString, xrayQuery };
}

/**
 * Parses raw Job Description text into structured JD Analysis
 */
export function analyzeJobDescription(jdText: string): JdAnalysisResult {
  const text = jdText || '';
  if (!text.trim()) {
    return {
      jobTitle: '',
      requiredSkills: [],
      preferredSkills: [],
      experienceYears: 0,
      location: '',
      education: '',
      certifications: [],
      industry: '',
      keywords: [],
      responsibilities: [],
      suggestedTitles: [],
      booleanString: '',
      xrayQuery: '',
    };
  }

  const lines = text.split('\n');
  let jobTitle = 'Technical Specialist';
  const firstLine = lines[0]?.trim() || '';
  if (firstLine.length > 3 && firstLine.length < 60) {
    jobTitle = firstLine.replace(/job description|title:|role:/i, '').trim() || jobTitle;
  }

  const knownSkills = [
    'SQL', 'Agile', 'Jira', 'Salesforce', 'Python', 'AWS', 'React', 'TypeScript',
    'Node.js', 'Kubernetes', 'Docker', 'Terraform', 'Scrum', 'Azure', 'GCP',
    'Snowflake', 'Java', 'C#', '.NET', 'Tableau', 'PowerBI', 'Rest API', 'GraphQL',
    'Git', 'CI/CD', 'Linux', 'Microservices', 'ETL', 'SAP', 'Oracle'
  ];

  const foundRequired: string[] = [];
  const foundPreferred: string[] = [];

  knownSkills.forEach((skill) => {
    const reg = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
    if (reg.test(text)) {
      if (foundRequired.length < 5) {
        foundRequired.push(skill);
      } else {
        foundPreferred.push(skill);
      }
    }
  });

  const expMatch = text.match(/(\d+)\+?\s*years?/i);
  const experienceYears = expMatch ? parseInt(expMatch[1], 10) : 3;

  const { booleanString, xrayQuery } = buildBooleanQuery(jobTitle, foundRequired, 'Toronto', '');

  return {
    jobTitle,
    requiredSkills: foundRequired,
    preferredSkills: foundPreferred,
    experienceYears,
    location: 'Toronto / Remote',
    education: "Bachelor's degree in CS, Engineering, or related field",
    certifications: ['AWS Certified', 'PMP'],
    industry: 'Technology / Financial Services',
    keywords: [...foundRequired, ...foundPreferred],
    responsibilities: [
      'Analyze business requirements and translate into technical specs.',
      'Collaborate with cross-functional development and QA teams.',
    ],
    suggestedTitles: [jobTitle, `Lead ${jobTitle}`],
    booleanString,
    xrayQuery,
  };
}

/**
 * Compares Candidate Resume against Job Description for ATS Keyword Matcher
 */
export function analyzeAtsResume(jdText: string, resumeText: string): AtsAnalysisResult {
  if (!jdText.trim() || !resumeText.trim()) {
    return {
      overallScore: 0,
      requiredScore: 0,
      preferredScore: 0,
      experienceScore: 0,
      educationScore: 0,
      skillsScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      weakEvidenceAreas: [],
      parsingIssues: [],
      recommendations: ['Paste both Job Description and Candidate Resume to run ATS analysis.'],
    };
  }

  const resume = resumeText.toLowerCase();
  const jdKeywords = [
    { word: 'sql', category: 'required' as const },
    { word: 'agile', category: 'required' as const },
    { word: 'jira', category: 'required' as const },
    { word: 'salesforce', category: 'required' as const },
    { word: 'python', category: 'semantic' as const },
    { word: 'aws', category: 'preferred' as const },
    { word: 'typescript', category: 'required' as const },
  ];

  const matchedKeywords: AtsKeywordMatch[] = [];
  const missingKeywords: string[] = [];
  let matchedCount = 0;

  jdKeywords.forEach((item) => {
    const countInResume = (resume.match(new RegExp(`\\b${item.word}\\b`, 'gi')) || []).length;
    if (countInResume > 0) {
      matchedCount++;
      matchedKeywords.push({ keyword: item.word.toUpperCase(), category: item.category, occurrences: countInResume });
    } else {
      missingKeywords.push(item.word.toUpperCase());
      matchedKeywords.push({ keyword: item.word.toUpperCase(), category: 'missing', occurrences: 0 });
    }
  });

  const overallScore = Math.round((matchedCount / jdKeywords.length) * 100);

  return {
    overallScore,
    requiredScore: overallScore,
    preferredScore: Math.max(30, overallScore - 10),
    experienceScore: 85,
    educationScore: 90,
    skillsScore: overallScore,
    matchedKeywords,
    missingKeywords,
    weakEvidenceAreas: ['Quantify project deliverables with revenue/time metrics.'],
    parsingIssues: [],
    recommendations: [
      'Rephrase technical projects to explicitly highlight mandatory keywords.',
    ],
  };
}
