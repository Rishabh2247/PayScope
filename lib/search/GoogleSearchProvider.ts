import { SearchProvider, CandidateSearchParams, RawSearchItem } from './SearchProviderInterface';

export class GoogleSearchProvider implements SearchProvider {
  public name = 'google';

  constructor(private apiKey: string, private engineId: string) {}

  public async search(params: CandidateSearchParams): Promise<RawSearchItem[]> {
    const { jobTitle, location, skills = [], xrayQuery } = params;
    const finalQuery = xrayQuery || `site:linkedin.com/in/ "${jobTitle}" "${location}" ${skills.join(' ')}`;

    const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(
      this.apiKey
    )}&cx=${encodeURIComponent(this.engineId)}&q=${encodeURIComponent(finalQuery)}&num=10`;

    console.log(`[GoogleSearchProvider] Querying Google Custom Search API...`);

    const response = await fetch(googleSearchUrl, { cache: 'no-store' });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[GoogleSearchProvider] API error response ${response.status}:`, errText);
      throw new Error(`Google Search API returned status ${response.status}`);
    }

    const data = await response.json();
    const items = data.items || [];

    return items.map((item: any) => ({
      title: item.title || '',
      snippet: item.snippet || '',
      link: item.link || 'https://www.linkedin.com/in/',
      imageSrc: item.pagemap?.cse_image?.[0]?.src,
      sourceProvider: 'Google Search Provider',
    }));
  }
}
