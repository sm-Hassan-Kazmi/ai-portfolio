/**
 * Structured Data (JSON-LD) component for SEO
 * Requirements: 12.1
 */

interface PersonSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  sameAs?: string[];
}

interface WebSiteSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
  author: {
    "@type": string;
    name: string;
  };
}

export function PersonStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hassan-portfolio.vercel.app';
  
  const personSchema: PersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hassan",
    url: baseUrl,
    jobTitle: "Software Developer",
    description: "Software developer specializing in web development with expertise in Next.js, TypeScript, and React",
    sameAs: [
      // Add social media links here when available
      // "https://github.com/hassan",
      // "https://linkedin.com/in/hassan",
      // "https://twitter.com/hassan"
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}

export function WebSiteStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hassan-portfolio.vercel.app';
  
  const websiteSchema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hassan's Terminal Portfolio",
    url: baseUrl,
    description: "Interactive terminal-based portfolio showcasing Hassan's skills, experience, and projects",
    author: {
      "@type": "Person",
      name: "Hassan",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
}
