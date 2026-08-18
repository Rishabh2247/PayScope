import { CountryCode } from './types';

export interface StateProvinceInfo {
  name: string;
  code: string;
  cities: string[];
}

export const GEOGRAPHY_DATA: Record<CountryCode, StateProvinceInfo[]> = {
  US: [
    {
      name: 'Texas',
      code: 'TX',
      cities: ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington'],
    },
    {
      name: 'California',
      code: 'CA',
      cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland', 'Irvine'],
    },
    {
      name: 'New York',
      code: 'NY',
      cities: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse', 'Yonkers'],
    },
    {
      name: 'Florida',
      code: 'FL',
      cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'St. Petersburg'],
    },
    {
      name: 'Washington',
      code: 'WA',
      cities: ['Seattle', 'Spokane', 'Tacoma', 'Bellevue', 'Vancouver', 'Olympia'],
    },
    {
      name: 'Illinois',
      code: 'IL',
      cities: ['Chicago', 'Aurora', 'Naperville', 'Rockford', 'Peoria', 'Springfield'],
    },
    {
      name: 'Massachusetts',
      code: 'MA',
      cities: ['Boston', 'Cambridge', 'Worcester', 'Springfield', 'Lowell'],
    },
  ],
  CA: [
    {
      name: 'Ontario',
      code: 'ON',
      cities: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London', 'Markham', 'Kitchener'],
    },
    {
      name: 'British Columbia',
      code: 'BC',
      cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Kelowna', 'Abbotsford'],
    },
    {
      name: 'Quebec',
      code: 'QC',
      cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke'],
    },
    {
      name: 'Alberta',
      code: 'AB',
      cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'St. Albert', 'Medicine Hat'],
    },
    {
      name: 'Nova Scotia',
      code: 'NS',
      cities: ['Halifax', 'Sydney', 'Dartmouth', 'Truro'],
    },
    {
      name: 'Manitoba',
      code: 'MB',
      cities: ['Winnipeg', 'Brandon', 'Steinbach'],
    },
    {
      name: 'Saskatchewan',
      code: 'SK',
      cities: ['Saskatoon', 'Regina', 'Prince Albert'],
    },
    {
      name: 'Newfoundland and Labrador',
      code: 'NL',
      cities: ["St. John's", 'Mount Pearl', 'Corner Brook'],
    },
  ],
  MX: [
    {
      name: 'Mexico City',
      code: 'CDMX',
      cities: ['Mexico City'],
    },
    {
      name: 'Jalisco',
      code: 'JAL',
      cities: ['Guadalajara', 'Puerto Vallarta', 'Zapopan', 'Tlaquepaque'],
    },
    {
      name: 'Nuevo León',
      code: 'NL',
      cities: ['Monterrey', 'San Pedro Garza García', 'Guadalupe', 'Apodaca'],
    },
    {
      name: 'Quintana Roo',
      code: 'QR',
      cities: ['Cancún', 'Playa del Carmen', 'Cozumel', 'Chetumal'],
    },
    {
      name: 'Baja California',
      code: 'BC',
      cities: ['Tijuana', 'Mexicali', 'Ensenada'],
    },
    {
      name: 'Yucatán',
      code: 'YUC',
      cities: ['Mérida', 'Valladolid', 'Progreso'],
    },
  ],
  BR: [
    {
      name: 'São Paulo',
      code: 'SP',
      cities: ['São Paulo', 'Campinas', 'Guarulhos', 'São Bernardo do Campo', 'Santos'],
    },
    {
      name: 'Rio de Janeiro',
      code: 'RJ',
      cities: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu'],
    },
    {
      name: 'Minas Gerais',
      code: 'MG',
      cities: ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Contagem'],
    },
    {
      name: 'Paraná',
      code: 'PR',
      cities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa'],
    },
    {
      name: 'Rio Grande do Sul',
      code: 'RS',
      cities: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas'],
    },
    {
      name: 'Distrito Federal',
      code: 'DF',
      cities: ['Brasília'],
    },
  ],
};

export function getProvincesForCountry(country: CountryCode): StateProvinceInfo[] {
  return GEOGRAPHY_DATA[country] || GEOGRAPHY_DATA.US;
}

export function getCitiesForProvince(country: CountryCode, provinceName: string): string[] {
  const provinces = getProvincesForCountry(country);
  const found = provinces.find((p) => p.name.toLowerCase() === provinceName.toLowerCase());
  if (found && found.cities.length > 0) {
    return found.cities;
  }
  return provinces[0]?.cities || ['Austin'];
}
