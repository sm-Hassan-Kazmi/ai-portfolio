import { Command, CommandOutput, ExecutionContext, Section, CertificationMetadata } from "@/types";

interface Certification {
  title: string;
  issuer: string;
  date: Date;
  credentialId?: string;
  credentialUrl?: string;
}

/**
 * CertificationsCommand - Display certifications and achievements
 * Requirements: 2.5
 */
export class CertificationsCommand implements Command {
  name = "certifications";
  description = "Display certifications and achievements";
  usage = "certifications";
  aliases = ["certs", "certificates"];

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    // Get certifications from portfolio data
    const certifications = this.getCertificationsFromPortfolio(context);

    if (certifications.length === 0) {
      return {
        success: true,
        content: <pre className="whitespace-pre-wrap text-sm">No certifications data available.</pre>,
      };
    }

    // Sort certifications by date (most recent first)
    const sortedCerts = [...certifications].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    let output = `\nCertifications & Achievements\n${"=".repeat(50)}\n\n`;

    sortedCerts.forEach((cert, index) => {
      const dateStr = this.formatDate(cert.date);

      output += `${cert.title}\n`;
      output += `Issued by: ${cert.issuer}\n`;
      output += `Date: ${dateStr}\n`;

      if (cert.credentialId) {
        output += `Credential ID: ${cert.credentialId}\n`;
      }

      if (cert.credentialUrl) {
        output += `Verify: ${cert.credentialUrl}\n`;
      }

      if (index < sortedCerts.length - 1) {
        output += `\n${"-".repeat(50)}\n\n`;
      }
    });

    output += `\n${"=".repeat(50)}\n`;
    output += `Total Certifications: ${sortedCerts.length}\n`;

    return {
      success: true,
      content: <pre className="whitespace-pre-wrap text-sm">{output}</pre>,
    };
  }

  /**
   * Format date as "Month Year"
   */
  private formatDate(date: Date): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  /**
   * Extract certifications from portfolio data
   */
  private getCertificationsFromPortfolio(context: ExecutionContext): Certification[] {
    if (!context.portfolioData?.certifications) {
      return [];
    }

    return context.portfolioData.certifications.map((section: Section) => {
      const metadata = section.metadata as CertificationMetadata;
      return {
        title: section.title,
        issuer: metadata.issuer,
        date: section.startDate ? new Date(section.startDate) : new Date(),
        credentialId: metadata.credentialId,
        credentialUrl: metadata.credentialUrl,
      };
    });
  }
}
