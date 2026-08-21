import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_COUNTRIES = ['US', 'CA', 'MX', 'BR'] as const;
type SupportedCountry = typeof SUPPORTED_COUNTRIES[number];

export async function GET(request: NextRequest) {
  try {
    // 1. Inspect platform-provided geolocation headers (Vercel, Cloudflare, etc.)
    const vercelCountry = request.headers.get('x-vercel-ip-country')?.toUpperCase();
    const cfCountry = request.headers.get('cf-ipcountry')?.toUpperCase();
    const generalCountry = request.headers.get('x-country')?.toUpperCase();

    const rawCountry = vercelCountry || cfCountry || generalCountry;

    if (rawCountry && (SUPPORTED_COUNTRIES as readonly string[]).includes(rawCountry)) {
      return NextResponse.json(
        { country: rawCountry as SupportedCountry, source: 'ip' },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // 2. Fallback to Accept-Language browser header if IP header is unavailable or unsupported country
    const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() || '';

    let fallbackCountry: SupportedCountry | null = null;
    if (acceptLanguage.includes('en-ca') || acceptLanguage.includes('fr-ca')) {
      fallbackCountry = 'CA';
    } else if (acceptLanguage.includes('es-mx') || acceptLanguage.includes('-mx')) {
      fallbackCountry = 'MX';
    } else if (acceptLanguage.includes('pt-br') || acceptLanguage.includes('-br')) {
      fallbackCountry = 'BR';
    } else if (acceptLanguage.includes('en-us') || acceptLanguage.includes('-us')) {
      fallbackCountry = 'US';
    }

    return NextResponse.json(
      { country: fallbackCountry, source: fallbackCountry ? 'locale_header' : 'none' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    return NextResponse.json({ country: null, source: 'error' }, { status: 200 });
  }
}
