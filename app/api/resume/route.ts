/**
 * GET /api/resume
 * Generates and returns a PDF resume
 * Fetches portfolio data from database and generates PDF using @react-pdf/renderer
 * 
 * Requirements: 6.1, 6.2, 6.3, 10.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServerClient } from '@/lib/supabase/client';
import { Section } from '@/lib/supabase/types';
import { PortfolioData, ContactInfo } from '@/types';
import { createResumeDocument } from '@/lib/pdf/resume-document';
import { checkRateLimit, getRateLimitHeaders, getClientIp, RATE_LIMIT_CONFIGS } from '@/lib/utils/rate-limit';

export async function GET(request: NextRequest) {
  // Apply rate limiting (Requirement 10.4)
  const clientIp = getClientIp(request.headers);
  const rateLimitResult = checkRateLimit(clientIp, RATE_LIMIT_CONFIGS.RESUME_DOWNLOAD);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: RATE_LIMIT_CONFIGS.RESUME_DOWNLOAD.message,
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

    // Personal information (this should ideally come from settings or database)
    const personalInfo = {
      name: 'Hassan Kazmi',
      location: 'Karachi, Pakistan',
      phone: '+92-336-0322869',
    };

    // Generate PDF using react-pdf/renderer
    const resumeDoc = createResumeDocument({ 
      data: portfolioData, 
      personalInfo 
    });
    
    const pdfBuffer = await renderToBuffer(resumeDoc);

    // Return PDF as downloadable file with rate limit headers
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Hassan_Kazmi_Resume.pdf"',
        'Cache-Control': 'public, max-age=3600',
        ...rateLimitHeaders,
      },
    });
  } catch (error) {
    console.error('Error generating resume PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
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
    email: 'smhk760@gmail.com',
    socials: {
      github: 'https://github.com/sm-Hassan-Kazmi',
      linkedin: 'https://linkedin.com/in/hassan-kazmi-smhk760',
    },
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
