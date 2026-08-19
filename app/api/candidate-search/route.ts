import { NextResponse } from 'next/server';
import { getSearchProvider, CandidateSearchParams, RawSearchItem } from '../../../lib/search';
import { CandidateResultItem } from './types';

export async function POST(req: Request) {
  try {
    const body: CandidateSearchParams = await req.json();
    const { jobTitle = '', location = '', skills = [], xrayQuery = '' } = body;

    console.log('[Candidate Search API] Request received:', {
      jobTitle,
      location,
      skillsCount: skills.length,
      xrayQuery,
    });

    const provider = getSearchProvider();

    // Check if provider is configured
    if (!provider) {
      console.log('[Candidate Search API] Status: UNCONFIGURED - Search provider credentials missing in environment.');
      return NextResponse.json(
        {
          status: 'unconfigured',
          message: 'Search provider not configured. Configure SEARCH_API_KEY and SEARCH_ENGINE_ID in environment variables.',
          results: [],
          totalResults: 0,
        },
        { status: 200 }
      );
    }

    console.log(`[Candidate Search API] Executing search via provider '${provider.name}'...`);

    const rawItems: RawSearchItem[] = await provider.search(body);
    console.log(`[Candidate Search API] Provider returned ${rawItems.length} raw search items.`);

    // Normalize raw search provider items into PayScope Candidate result cards
    const normalizedResults: CandidateResultItem[] = rawItems.map((item, idx) => {
      const rawTitle = item.title || '';
      const rawSnippet = item.snippet || '';
      const rawLink = item.link || 'https://www.linkedin.com/in/';

      // Parse Name & Headline
      const titleParts = rawTitle.split(/[-|–]/).map((p: string) => p.trim());
      const candidateName = titleParts[0] || 'Professional Candidate';
      const parsedHeadline = titleParts.length > 1 ? titleParts.slice(1, titleParts.length - 1).join(' - ') : rawTitle;

      // Extract skills
      const extractedSkills: string[] = [];
      const skillCandidates = ['Java', 'Python', 'SQL', 'React', 'Agile', 'Jira', 'AWS', 'Salesforce', 'TypeScript', 'Node.js', 'Kubernetes', 'Docker', 'C#', '.NET'];
      skillCandidates.forEach((sk) => {
        if (new RegExp(`\\b${sk}\\b`, 'i').test(rawSnippet) || new RegExp(`\\b${sk}\\b`, 'i').test(rawTitle)) {
          extractedSkills.push(sk);
        }
      });

      if (extractedSkills.length === 0 && skills.length > 0) {
        extractedSkills.push(...skills.slice(0, 3));
      }

      return {
        id: `sr-${Date.now()}-${idx}`,
        name: candidateName,
        headline: parsedHeadline || jobTitle || 'Professional Profile',
        jobTitle: jobTitle || 'Specialist',
        location: location || 'Public Discoverable Profile',
        yearsOfExperience: 5,
        skills: extractedSkills.length > 0 ? extractedSkills : ['Professional Expertise'],
        bioSummary: rawSnippet,
        linkedInUrl: rawLink,
        photoUrl: item.imageSrc,
        matchScore: Math.min(98, 85 + (idx === 0 ? 10 : 8 - idx)),
        suggestedPayRate: 65,
        suggestedBillRate: 90,
        source: item.sourceProvider,
      };
    });

    console.log(`[Candidate Search API] Successfully normalized ${normalizedResults.length} candidate results.`);

    return NextResponse.json({
      status: 'success',
      results: normalizedResults,
      totalResults: normalizedResults.length,
    });
  } catch (error: any) {
    console.error('[Candidate Search API] Unexpected error during search:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'An unexpected error occurred during candidate search.',
        results: [],
        totalResults: 0,
      },
      { status: 500 }
    );
  }
}
