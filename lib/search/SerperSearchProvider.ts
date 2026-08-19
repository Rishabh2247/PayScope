import { SearchProvider, CandidateSearchParams, RawSearchItem } from './SearchProviderInterface';

export class SerperSearchProvider implements SearchProvider {
  public name = 'serper';

  constructor(private apiKey: string) {}

  public async search(params: CandidateSearchParams): Promise<RawSearchItem[]> {
    const { jobTitle, location, skills = [], xrayQuery } = params;
    const finalQuery = xrayQuery || `site:linkedin.com/in/ "${jobTitle}" "${location}" ${skills.join(' ')}`;

    console.log(`[SerperSearchProvider] Querying Serper Google Search API for: "${finalQuery}"`);

    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: finalQuery,
        num: 10,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[SerperSearchProvider] API error response ${response.status}:`, errText);
      throw new Error(`Serper Search API returned status ${response.status}`);
    }

    const data = await response.json();
    const organicItems = data.organic || [];

    console.log(`[SerperSearchProvider] Received ${organicItems.length} organic search results.`);

    return organicItems.map((item: any) => ({
      title: item.title || '',
      snippet: item.snippet || '',
      link: item.link || 'https://www.linkedin.com/in/',
      imageSrc: item.imageUrl || item.attributes?.image,
      sourceProvider: 'Public Web Search (Serper API)',
    }));
  }
}
