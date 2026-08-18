import { CountryCode, CountryEconomicData } from '../types';

export function getCountryEconomicData(
  country: CountryCode,
  city: string,
  state: string,
  takeHomeMonthly: number
): CountryEconomicData {
  if (country === 'CA') {
    const isToronto = city === 'Toronto';
    const baseHousing = isToronto ? 2500 : 2100;
    const baseTrans = 450;
    const baseFood = 520;
    const baseUtil = 280;
    const baseHealth = 180;
    const baseOther = 420;
    const colTotalMonthly = baseHousing + baseTrans + baseFood + baseUtil + baseHealth + baseOther;

    const rawNeighborhoods = isToronto
      ? [
          { id: '1', name: 'North York', baseRent: 2200, vsLastMonth: 1.2 },
          { id: '2', name: 'Etobicoke', baseRent: 2150, vsLastMonth: 0.8 },
          { id: '3', name: 'Midtown Toronto', baseRent: 2500, vsLastMonth: 1.5 },
          { id: '4', name: 'East York', baseRent: 2050, vsLastMonth: 0.4 },
          { id: '5', name: 'Downtown Core', baseRent: 3100, vsLastMonth: 2.8 },
        ]
      : [
          { id: '1', name: 'Burnaby', baseRent: 2100, vsLastMonth: 1.0 },
          { id: '2', name: 'Richmond', baseRent: 2250, vsLastMonth: 0.5 },
          { id: '3', name: 'Kitsilano', baseRent: 2600, vsLastMonth: 1.8 },
          { id: '4', name: 'Surrey', baseRent: 1850, vsLastMonth: -0.5 },
          { id: '5', name: 'Downtown Vancouver', baseRent: 2950, vsLastMonth: 2.1 },
        ];

    const neighborhoods = rawNeighborhoods.map((n) => {
      const burden = takeHomeMonthly > 0 ? (n.baseRent / takeHomeMonthly) * 100 : 30;
      let affordability: 'Great' | 'Okay' | 'Stretch' | 'High Burden' = 'Great';
      if (burden > 35) affordability = 'Stretch';
      else if (burden > 28) affordability = 'Okay';
      return {
        id: n.id,
        name: n.name,
        typicalRent: n.baseRent,
        vsLastMonth: n.vsLastMonth,
        affordability,
        affordabilityScore: Math.round(burden),
      };
    });

    return {
      country: 'CA',
      currency: 'CAD',
      currencySymbol: 'CA$',
      inflationRate: 2.4,
      inflationLabel: 'Current CPI Inflation Rate in Canada',
      fuelPriceToday: 1.65,
      fuelPriceUnit: '/L',
      fuelPriceVsYesterday: -0.01,
      colTotalMonthly,
      colComparisonText: `Compared to ${city} average 3% lower`,
      colCategories: [
        { name: 'Housing', amount: baseHousing, percentage: (baseHousing / colTotalMonthly) * 100, color: '#3B82F6', icon: 'Home' },
        { name: 'Transportation', amount: baseTrans, percentage: (baseTrans / colTotalMonthly) * 100, color: '#6366F1', icon: 'Car' },
        { name: 'Food', amount: baseFood, percentage: (baseFood / colTotalMonthly) * 100, color: '#10B981', icon: 'Utensils' },
        { name: 'Utilities', amount: baseUtil, percentage: (baseUtil / colTotalMonthly) * 100, color: '#F59E0B', icon: 'Zap' },
        { name: 'Healthcare', amount: baseHealth, percentage: (baseHealth / colTotalMonthly) * 100, color: '#EF4444', icon: 'Heart' },
        { name: 'Other', amount: baseOther, percentage: (baseOther / colTotalMonthly) * 100, color: '#64748B', icon: 'ShoppingBag' },
      ],
      benchmarkMedian: 88000,
      benchmarkTop10: 210000,
      benchmarkTop25: 135000,
      benchmarkBottom25: 52000,
      cityLabel: `${city}, ${state.substring(0, 2).toUpperCase()}`,
      neighborhoods,
    };
  }

  if (country === 'MX') {
    const baseHousing = 14500;
    const baseTrans = 3800;
    const baseFood = 4200;
    const baseUtil = 1900;
    const baseHealth = 1600;
    const baseOther = 2500;
    const colTotalMonthly = baseHousing + baseTrans + baseFood + baseUtil + baseHealth + baseOther;

    return {
      country: 'MX',
      currency: 'MXN',
      currencySymbol: 'MX$',
      inflationRate: 4.8,
      inflationLabel: 'Current CPI Inflation Rate in Mexico',
      fuelPriceToday: 24.5,
      fuelPriceUnit: '/L',
      fuelPriceVsYesterday: 0.1,
      colTotalMonthly,
      colComparisonText: `Compared to ${city} average 1% lower`,
      colCategories: [
        { name: 'Housing', amount: baseHousing, percentage: (baseHousing / colTotalMonthly) * 100, color: '#3B82F6', icon: 'Home' },
        { name: 'Transportation', amount: baseTrans, percentage: (baseTrans / colTotalMonthly) * 100, color: '#6366F1', icon: 'Car' },
        { name: 'Food', amount: baseFood, percentage: (baseFood / colTotalMonthly) * 100, color: '#10B981', icon: 'Utensils' },
        { name: 'Utilities', amount: baseUtil, percentage: (baseUtil / colTotalMonthly) * 100, color: '#F59E0B', icon: 'Zap' },
        { name: 'Healthcare', amount: baseHealth, percentage: (baseHealth / colTotalMonthly) * 100, color: '#EF4444', icon: 'Heart' },
        { name: 'Other', amount: baseOther, percentage: (baseOther / colTotalMonthly) * 100, color: '#64748B', icon: 'ShoppingBag' },
      ],
      benchmarkMedian: 320000,
      benchmarkTop10: 750000,
      benchmarkTop25: 480000,
      benchmarkBottom25: 180000,
      cityLabel: `${city}, MX`,
      neighborhoods: [
        { id: '1', name: 'Polanco', typicalRent: 28000, vsLastMonth: 1.1, affordability: 'Stretch', affordabilityScore: 40 },
        { id: '2', name: 'Roma Norte', typicalRent: 22000, vsLastMonth: 0.8, affordability: 'Okay', affordabilityScore: 32 },
        { id: '3', name: 'Condesa', typicalRent: 24000, vsLastMonth: 1.4, affordability: 'Okay', affordabilityScore: 35 },
        { id: '4', name: 'Santa Fe', typicalRent: 19500, vsLastMonth: -0.4, affordability: 'Great', affordabilityScore: 28 },
        { id: '5', name: 'Coyoacán', typicalRent: 16000, vsLastMonth: 0.2, affordability: 'Great', affordabilityScore: 23 },
      ],
    };
  }

  if (country === 'BR') {
    const baseHousing = 3500;
    const baseTrans = 850;
    const baseFood = 1200;
    const baseUtil = 450;
    const baseHealth = 400;
    const baseOther = 800;
    const colTotalMonthly = baseHousing + baseTrans + baseFood + baseUtil + baseHealth + baseOther;

    return {
      country: 'BR',
      currency: 'BRL',
      currencySymbol: 'R$',
      inflationRate: 4.2,
      inflationLabel: 'Current CPI Inflation Rate in Brazil',
      fuelPriceToday: 5.8,
      fuelPriceUnit: '/L',
      fuelPriceVsYesterday: -0.05,
      colTotalMonthly,
      colComparisonText: `Compared to ${city} average 2% lower`,
      colCategories: [
        { name: 'Housing', amount: baseHousing, percentage: (baseHousing / colTotalMonthly) * 100, color: '#3B82F6', icon: 'Home' },
        { name: 'Transportation', amount: baseTrans, percentage: (baseTrans / colTotalMonthly) * 100, color: '#6366F1', icon: 'Car' },
        { name: 'Food', amount: baseFood, percentage: (baseFood / colTotalMonthly) * 100, color: '#10B981', icon: 'Utensils' },
        { name: 'Utilities', amount: baseUtil, percentage: (baseUtil / colTotalMonthly) * 100, color: '#F59E0B', icon: 'Zap' },
        { name: 'Healthcare', amount: baseHealth, percentage: (baseHealth / colTotalMonthly) * 100, color: '#EF4444', icon: 'Heart' },
        { name: 'Other', amount: baseOther, percentage: (baseOther / colTotalMonthly) * 100, color: '#64748B', icon: 'ShoppingBag' },
      ],
      benchmarkMedian: 78000,
      benchmarkTop10: 180000,
      benchmarkTop25: 120000,
      benchmarkBottom25: 45000,
      cityLabel: `${city}, BR`,
      neighborhoods: [
        { id: '1', name: 'Pinheiros', typicalRent: 4200, vsLastMonth: 1.2, affordability: 'Stretch', affordabilityScore: 38 },
        { id: '2', name: 'Vila Madalena', typicalRent: 3800, vsLastMonth: 0.9, affordability: 'Okay', affordabilityScore: 34 },
        { id: '3', name: 'Itaim Bibi', typicalRent: 4900, vsLastMonth: 1.8, affordability: 'High Burden', affordabilityScore: 44 },
        { id: '4', name: 'Moema', typicalRent: 3600, vsLastMonth: -0.2, affordability: 'Okay', affordabilityScore: 32 },
        { id: '5', name: 'Tatuapé', typicalRent: 2700, vsLastMonth: 0.4, affordability: 'Great', affordabilityScore: 24 },
      ],
    };
  }

  // Default: United States
  const isNY = city === 'New York';
  const baseHousing = isNY ? 2950 : 1892;
  const baseTrans = isNY ? 520 : 642;
  const baseFood = isNY ? 680 : 504;
  const baseUtil = isNY ? 340 : 286;
  const baseHealth = isNY ? 490 : 412;
  const baseOther = isNY ? 780 : 590;
  const colTotalMonthly = baseHousing + baseTrans + baseFood + baseUtil + baseHealth + baseOther;

  const rawNeighborhoods = isNY
    ? [
        { id: '1', name: 'Astoria', baseRent: 2450, vsLastMonth: 0.5 },
        { id: '2', name: 'Long Island City', baseRent: 3200, vsLastMonth: 1.8 },
        { id: '3', name: 'Crown Heights', baseRent: 2600, vsLastMonth: -1.1 },
        { id: '4', name: 'Williamsburg', baseRent: 3800, vsLastMonth: 2.4 },
        { id: '5', name: 'Manhattan Midtown', baseRent: 4100, vsLastMonth: 3.1 },
      ]
    : [
        { id: '1', name: 'Round Rock', baseRent: 1900, vsLastMonth: -2.1 },
        { id: '2', name: 'North Austin', baseRent: 2100, vsLastMonth: 1.4 },
        { id: '3', name: 'Cedar Park', baseRent: 1850, vsLastMonth: 0.6 },
        { id: '4', name: 'South Austin', baseRent: 2250, vsLastMonth: 1.8 },
        { id: '5', name: 'Downtown Austin', baseRent: 2850, vsLastMonth: 3.4 },
      ];

  const neighborhoods = rawNeighborhoods.map((n) => {
    const burden = takeHomeMonthly > 0 ? (n.baseRent / takeHomeMonthly) * 100 : 30;
    let affordability: 'Great' | 'Okay' | 'Stretch' | 'High Burden' = 'Great';
    if (burden > 35) affordability = 'Stretch';
    else if (burden > 28) affordability = 'Okay';
    return {
      id: n.id,
      name: n.name,
      typicalRent: n.baseRent,
      vsLastMonth: n.vsLastMonth,
      affordability,
      affordabilityScore: Math.round(burden),
    };
  });

  return {
    country: 'US',
    currency: 'USD',
    currencySymbol: '$',
    inflationRate: 3.4,
    inflationLabel: 'Current CPI Inflation Rate in USA',
    fuelPriceToday: isNY ? 3.89 : 3.45,
    fuelPriceUnit: '/gal',
    fuelPriceVsYesterday: -0.02,
    colTotalMonthly,
    colComparisonText: `Compared to ${city} average 2% lower`,
    colCategories: [
      { name: 'Housing', amount: baseHousing, percentage: (baseHousing / colTotalMonthly) * 100, color: '#3B82F6', icon: 'Home' },
      { name: 'Transportation', amount: baseTrans, percentage: (baseTrans / colTotalMonthly) * 100, color: '#6366F1', icon: 'Car' },
      { name: 'Food', amount: baseFood, percentage: (baseFood / colTotalMonthly) * 100, color: '#10B981', icon: 'Utensils' },
      { name: 'Utilities', amount: baseUtil, percentage: (baseUtil / colTotalMonthly) * 100, color: '#F59E0B', icon: 'Zap' },
      { name: 'Healthcare', amount: baseHealth, percentage: (baseHealth / colTotalMonthly) * 100, color: '#EF4444', icon: 'Heart' },
      { name: 'Other', amount: baseOther, percentage: (baseOther / colTotalMonthly) * 100, color: '#64748B', icon: 'ShoppingBag' },
    ],
    benchmarkMedian: isNY ? 104000 : 93012,
    benchmarkTop10: isNY ? 275000 : 229000,
    benchmarkTop25: isNY ? 175000 : 149000,
    benchmarkBottom25: isNY ? 62000 : 55000,
    cityLabel: `${city}, ${state.substring(0, 2).toUpperCase()}`,
    neighborhoods,
  };
}
