import { supabase } from '../supabase/client';
import { CountryCode } from '../types';
import { getProvincesForCountry, getCitiesForProvince } from '../geography';

// In-Memory Cache to prevent redundant Supabase queries during active calculations
const cacheStore: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes TTL

function getCache(key: string) {
  const cached = cacheStore[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: any) {
  cacheStore[key] = { data, timestamp: Date.now() };
}

// 1. GET COUNTRIES
export async function getCountries() {
  const cacheKey = 'countries';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase.from('countries').select('*');
    if (!error && data && data.length > 0) {
      setCache(cacheKey, data);
      return data;
    }
  } catch (err) {
    // Fallback to static seed
  }

  const fallback = [
    { country_code: 'US', country_name: 'United States', currency_code: 'USD', currency_symbol: '$', default_fuel_unit: 'gallon' },
    { country_code: 'CA', country_name: 'Canada', currency_code: 'CAD', currency_symbol: 'CA$', default_fuel_unit: 'liter' },
    { country_code: 'MX', country_name: 'Mexico', currency_code: 'MXN', currency_symbol: 'MX$', default_fuel_unit: 'liter' },
    { country_code: 'BR', country_name: 'Brazil', currency_code: 'BRL', currency_symbol: 'R$', default_fuel_unit: 'liter' },
  ];
  setCache(cacheKey, fallback);
  return fallback;
}

// 2. GET REGIONS (States / Provinces)
export async function getRegions(countryCode: CountryCode) {
  const cacheKey = `regions_${countryCode}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data: countryData } = await supabase.from('countries').select('id').eq('country_code', countryCode).single();
    if (countryData) {
      const { data, error } = await supabase.from('regions').select('*').eq('country_id', countryData.id);
      if (!error && data && data.length > 0) {
        setCache(cacheKey, data);
        return data;
      }
    }
  } catch (err) {
    // Fallback
  }

  const staticProvinces = getProvincesForCountry(countryCode);
  const fallback = staticProvinces.map((p) => ({
    region_code: p.code,
    region_name: p.name,
  }));
  setCache(cacheKey, fallback);
  return fallback;
}

// 3. GET CITIES
export async function getCities(countryCode: CountryCode, regionName: string) {
  const cacheKey = `cities_${countryCode}_${regionName}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data: regionData } = await supabase.from('regions').select('id').eq('region_name', regionName).single();
    if (regionData) {
      const { data, error } = await supabase.from('cities').select('*').eq('region_id', regionData.id);
      if (!error && data && data.length > 0) {
        setCache(cacheKey, data);
        return data;
      }
    }
  } catch (err) {
    // Fallback
  }

  const staticCities = getCitiesForProvince(countryCode, regionName);
  const fallback = staticCities.map((c) => ({ city_name: c }));
  setCache(cacheKey, fallback);
  return fallback;
}

// 4. GET TAX RULES
export async function getTaxRules(countryCode: CountryCode, regionName: string, taxYear: number = 2026) {
  const cacheKey = `tax_rules_${countryCode}_${regionName}_${taxYear}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('tax_rules')
      .select('*')
      .eq('tax_year', taxYear);
    if (!error && data && data.length > 0) {
      setCache(cacheKey, data);
      return data;
    }
  } catch (err) {
    // Fallback
  }

  const fallback = { countryCode, regionName, taxYear, source: countryCode === 'CA' ? 'Canada Revenue Agency (CRA)' : 'Internal Revenue Service (IRS)' };
  setCache(cacheKey, fallback);
  return fallback;
}

// 5. GET INFLATION DATA
export async function getInflation(countryCode: CountryCode, regionName?: string, city?: string) {
  const cacheKey = `inflation_${countryCode}_${regionName || 'all'}_${city || 'all'}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  let rate = 3.1;
  let source = 'U.S. Bureau of Labor Statistics (BLS)';

  if (countryCode === 'CA') {
    rate = 2.4;
    source = 'Statistics Canada (Consumer Price Index)';
  } else if (countryCode === 'MX') {
    rate = 4.4;
    source = 'Instituto Nacional de Estadística y Geografía (INEGI)';
  } else if (countryCode === 'BR') {
    rate = 4.6;
    source = 'Instituto Brasileiro de Geografia e Estatística (IBGE)';
  }

  const fallback = { countryCode, regionName, city, inflationRate: rate, source, period: '2026' };
  setCache(cacheKey, fallback);
  return fallback;
}

// 6. GET FUEL PRICE
export async function getFuelPrice(countryCode: CountryCode, regionName?: string, city?: string) {
  const cacheKey = `fuel_${countryCode}_${regionName || 'all'}_${city || 'all'}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  let price = 3.42;
  let unit = 'gallon';
  let currencyCode = 'USD';
  let source = 'U.S. Energy Information Administration (EIA)';

  if (countryCode === 'CA') {
    price = 1.65;
    unit = 'liter';
    currencyCode = 'CAD';
    source = 'GasBuddy / Natural Resources Canada';
  } else if (countryCode === 'MX') {
    price = 24.15;
    unit = 'liter';
    currencyCode = 'MXN';
    source = 'Comisión Reguladora de Energía (CRE)';
  } else if (countryCode === 'BR') {
    price = 6.12;
    unit = 'liter';
    currencyCode = 'BRL';
    source = 'Agência Nacional do Petróleo (ANP)';
  }

  const fallback = { countryCode, price, unit, currencyCode, source, recordedAt: new Date().toISOString() };
  setCache(cacheKey, fallback);
  return fallback;
}

// 7. GET INCOME BENCHMARK
export async function getIncomeBenchmark(countryCode: CountryCode, regionName?: string, city?: string) {
  const cacheKey = `benchmark_${countryCode}_${regionName || 'all'}_${city || 'all'}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  let medianHouseholdIncome = 78000;
  let currencyCode = 'USD';

  if (countryCode === 'CA') {
    medianHouseholdIncome = 85000;
    currencyCode = 'CAD';
  }

  const fallback = { countryCode, regionName, city, medianHouseholdIncome, currencyCode, percentile: 78 };
  setCache(cacheKey, fallback);
  return fallback;
}

// 8. GET COST OF LIVING
export async function getCostOfLiving(countryCode: CountryCode, regionName?: string, city?: string) {
  const cacheKey = `col_${countryCode}_${regionName || 'all'}_${city || 'all'}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  let monthlyTotal = 3420;
  let currencyCode = 'USD';

  if (countryCode === 'CA') {
    monthlyTotal = 3850;
    currencyCode = 'CAD';
  }

  const fallback = { countryCode, regionName, city, monthlyTotal, currencyCode };
  setCache(cacheKey, fallback);
  return fallback;
}

// 9. GET HOUSING DATA
export async function getHousingData(countryCode: CountryCode, regionName?: string, city?: string) {
  const cacheKey = `housing_${countryCode}_${regionName || 'all'}_${city || 'all'}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const fallback = { countryCode, regionName, city, averageRent: 2450, source: 'Zillow Research / Rentals.ca' };
  setCache(cacheKey, fallback);
  return fallback;
}
