/**
 * Utility functions for ensuring images have proper alt text
 * Requirements: 11.5
 */

/**
 * Generate descriptive alt text for section images based on section data
 */
export function generateAltText(section: {
  type: string;
  title: string;
  description?: string;
}): string {
  const typeLabels: Record<string, string> = {
    skill: "Icon for",
    experience: "Logo for",
    project: "Screenshot of",
    certification: "Badge for",
    achievement: "Icon for",
  };

  const prefix = typeLabels[section.type] || "Image for";
  return `${prefix} ${section.title}`;
}

/**
 * Validate that an image has alt text
 */
export function validateImageAltText(alt: string | undefined): boolean {
  if (!alt || alt.trim() === "") {
    return false;
  }
  return true;
}

/**
 * Get fallback alt text if none is provided
 */
export function getFallbackAltText(context: string): string {
  return `Decorative image for ${context}`;
}
