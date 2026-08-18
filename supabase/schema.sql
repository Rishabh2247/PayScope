-- PayScope Supabase PostgreSQL Schema & Seed Migration Script
-- Creates 10 market/reference data tables with Row Level Security (RLS) enabled.
-- NO USER DATA OR CALCULATIONS STORED.

-- 1. COUNTRIES TABLE
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) UNIQUE NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  currency_symbol VARCHAR(10) NOT NULL,
  default_fuel_unit VARCHAR(20) NOT NULL DEFAULT 'gallon',
  default_timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. REGIONS TABLE
CREATE TABLE IF NOT EXISTS public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  region_code VARCHAR(10) NOT NULL,
  region_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(country_id, region_code)
);

-- 3. CITIES TABLE
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  region_id UUID NOT NULL REFERENCES public.regions(id) ON DELETE CASCADE,
  city_name VARCHAR(100) NOT NULL,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(region_id, city_name)
);

-- 4. TAX RULES TABLE
CREATE TABLE IF NOT EXISTS public.tax_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  tax_year INT NOT NULL DEFAULT 2026,
  tax_type VARCHAR(50) NOT NULL,
  bracket_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  additional_rules JSONB DEFAULT '{}'::jsonb,
  source VARCHAR(255) NOT NULL,
  source_url VARCHAR(500),
  effective_from DATE,
  effective_to DATE,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. INFLATION DATA TABLE
CREATE TABLE IF NOT EXISTS public.inflation_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  period VARCHAR(20) NOT NULL,
  inflation_rate NUMERIC(5, 2) NOT NULL,
  source VARCHAR(255) NOT NULL,
  source_url VARCHAR(500),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. FUEL PRICES TABLE
CREATE TABLE IF NOT EXISTS public.fuel_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  fuel_type VARCHAR(50) NOT NULL DEFAULT 'Regular Gasoline',
  price NUMERIC(8, 3) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  source VARCHAR(255) NOT NULL,
  source_url VARCHAR(500),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. INCOME BENCHMARKS TABLE
CREATE TABLE IF NOT EXISTS public.income_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  household_size INT NOT NULL DEFAULT 1,
  income_type VARCHAR(50) NOT NULL DEFAULT 'Household',
  percentile INT NOT NULL DEFAULT 50,
  income_value NUMERIC(12, 2) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  period VARCHAR(20) NOT NULL DEFAULT '2026',
  source VARCHAR(255) NOT NULL,
  source_url VARCHAR(500),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. COST OF LIVING TABLE
CREATE TABLE IF NOT EXISTS public.cost_of_living (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  household_size INT NOT NULL DEFAULT 1,
  category VARCHAR(50) NOT NULL,
  monthly_cost NUMERIC(10, 2) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  period VARCHAR(20) NOT NULL DEFAULT '2026',
  source VARCHAR(255) NOT NULL,
  source_url VARCHAR(500),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. HOUSING DATA TABLE
CREATE TABLE IF NOT EXISTS public.housing_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  neighborhood VARCHAR(100) NOT NULL,
  property_type VARCHAR(50) NOT NULL DEFAULT 'Apartment',
  bedrooms INT,
  average_rent NUMERIC(10, 2) NOT NULL,
  average_sale_price NUMERIC(12, 2),
  currency_code VARCHAR(3) NOT NULL,
  period VARCHAR(20) NOT NULL DEFAULT '2026',
  listing_count INT,
  source VARCHAR(255) NOT NULL,
  source_url VARCHAR(500),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DATA SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name VARCHAR(150) NOT NULL,
  source_url VARCHAR(500) NOT NULL,
  data_type VARCHAR(100) NOT NULL,
  country_code VARCHAR(2),
  update_frequency VARCHAR(50) NOT NULL DEFAULT 'Monthly',
  last_checked TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inflation_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_of_living ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.housing_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ-ONLY ACCESS POLICIES
CREATE POLICY "Allow public read access on countries" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Allow public read access on regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tax_rules" ON public.tax_rules FOR SELECT USING (true);
CREATE POLICY "Allow public read access on inflation_data" ON public.inflation_data FOR SELECT USING (true);
CREATE POLICY "Allow public read access on fuel_prices" ON public.fuel_prices FOR SELECT USING (true);
CREATE POLICY "Allow public read access on income_benchmarks" ON public.income_benchmarks FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cost_of_living" ON public.cost_of_living FOR SELECT USING (true);
CREATE POLICY "Allow public read access on housing_data" ON public.housing_data FOR SELECT USING (true);
CREATE POLICY "Allow public read access on data_sources" ON public.data_sources FOR SELECT USING (true);

-- INITIAL SEED DATA FOR US, CA, MX, BR
INSERT INTO public.countries (country_code, country_name, currency_code, currency_symbol, default_fuel_unit) VALUES
('US', 'United States', 'USD', '$', 'gallon'),
('CA', 'Canada', 'CAD', 'CA$', 'liter'),
('MX', 'Mexico', 'MXN', 'MX$', 'liter'),
('BR', 'Brazil', 'BRL', 'R$', 'liter')
ON CONFLICT (country_code) DO NOTHING;
