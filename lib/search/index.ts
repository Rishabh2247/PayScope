import { SearchProvider } from './SearchProviderInterface';
import { GoogleSearchProvider } from './GoogleSearchProvider';
import { SerperSearchProvider } from './SerperSearchProvider';

export * from './SearchProviderInterface';
export * from './GoogleSearchProvider';
export * from './SerperSearchProvider';

/**
 * Search Provider Factory Function
 * Resolves search provider based on environment variables:
 * - SEARCH_PROVIDER ('serper' | 'google' | 'serpapi' | 'brave', default: 'serper')
 * - SEARCH_API_KEY (fallback: SERPER_API_KEY, GOOGLE_SEARCH_API_KEY)
 * - SEARCH_ENGINE_ID (required only for Google Custom Search)
 */
export function getSearchProvider(): SearchProvider | null {
  const providerName = (process.env.SEARCH_PROVIDER || 'serper').toLowerCase();

  const apiKey =
    process.env.SEARCH_API_KEY ||
    process.env.SERPER_API_KEY ||
    process.env.GOOGLE_SEARCH_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY;

  const engineId =
    process.env.SEARCH_ENGINE_ID ||
    process.env.GOOGLE_SEARCH_CX ||
    process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CX;

  if (!apiKey) {
    console.log('[SearchProviderFactory] Search provider API key missing (SEARCH_API_KEY).');
    return null;
  }

  if (providerName === 'serper') {
    return new SerperSearchProvider(apiKey);
  }

  if (providerName === 'google') {
    if (!engineId) {
      console.log('[SearchProviderFactory] Google provider requested but SEARCH_ENGINE_ID missing. Falling back to Serper provider.');
      return new SerperSearchProvider(apiKey);
    }
    return new GoogleSearchProvider(apiKey, engineId);
  }

  // Default fallback to Serper provider
  return new SerperSearchProvider(apiKey);
}
