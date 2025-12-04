import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';
import { Section } from '@/lib/supabase/types';
import { PortfolioData, ContactInfo } from '@/types';
import { checkRateLimit, getRateLimitHeaders, getClientIp, RATE_LIMIT_CONFIGS } from '@/lib/utils/rate-limit';

/**
 * GET /api/portfolio
 * Fetches all visible portfolio sections and settings
 * Returns transformed data in PortfolioData format
 * 
 * Requirements: 2.2, 2.3, 2.4, 2.5, 10.4
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting (Requirement 10.4)
  const clientIp = getClientIp(request.headers);
  const rateLimitResult = checkRateLimit(clientIp, RATE_LIMIT_CONFIGS.API_READ);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: RATE_LIMIT_CONFIGS.API_READ.message,
      },
      {
        status: 429,
        headers: rateLimitHeaders,
      }
    );
  }
  try {
    const supabase = createServerClient();

    // Fetch all visible sections from database
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (sectionsError) {
      console.error('Error fetching sections:', sectionsError);
      return NextResponse.json(
        { error: 'Failed to fetch portfolio sections' },
        { status: 500 }
      );
    }

    // Fetch settings from database
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['contact_info', 'about']);

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      return NextResponse.json(
        { error: 'Failed to fetch portfolio settings' },
        { status: 500 }
      );
    }

    // Transform data into PortfolioData interface
    const portfolioData = transformToPortfolioData(sections || [], settings || []);

    // Return JSON response with cache headers and rate limit headers
    return NextResponse.json(portfolioData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        ...rateLimitHeaders,
      },
    });
  } catch (error) {
    console.error('Unexpected error in /api/portfolio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Transform database sections and settings into PortfolioData format
 */
function transformToPortfolioData(
  sections: Section[],
  settings: Array<{ key: string; value: any }>
): PortfolioData {
  // Extract about text from settings
  const aboutSetting = settings.find((s) => s.key === 'about');
  const about = aboutSetting?.value?.text || '';

  // Extract contact info from settings
  const contactSetting = settings.find((s) => s.key === 'contact_info');
  const contactInfo: ContactInfo = contactSetting?.value || {
    email: '',
    socials: {},
  };

  // Group sections by type
  const skills = sections
    .filter((s) => s.type === 'skill')
    .map(transformSection);

  const experiences = sections
    .filter((s) => s.type === 'experience')
    .map(transformSection);

  const projects = sections
    .filter((s) => s.type === 'project')
    .map(transformSection);

  const certifications = sections
    .filter((s) => s.type === 'certification')
    .map(transformSection);

  const achievements = sections
    .filter((s) => s.type === 'achievement')
    .map(transformSection);

  return {
    about,
    skills,
    experiences,
    projects,
    certifications,
    achievements,
    contactInfo,
  };
}

/**
 * Transform database Section to application Section format
 * Converts snake_case to camelCase and Date strings to Date objects
 */
function transformSection(dbSection: Section): any {
  return {
    id: dbSection.id,
    type: dbSection.type,
    title: dbSection.title,
    description: dbSection.description,
    metadata: dbSection.metadata,
    imageUrl: dbSection.image_url,
    startDate: dbSection.start_date ? new Date(dbSection.start_date) : undefined,
    endDate: dbSection.end_date ? new Date(dbSection.end_date) : undefined,
    displayOrder: dbSection.display_order,
    isFeatured: dbSection.is_featured,
    isVisible: dbSection.is_visible,
    createdAt: new Date(dbSection.created_at),
    updatedAt: new Date(dbSection.updated_at),
  };
}
