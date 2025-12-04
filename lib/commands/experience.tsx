import { Command, CommandOutput, ExecutionContext, Section, ExperienceMetadata } from "@/types";

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  technologies: string[];
}

/**
 * ExperienceCommand - Display work history in reverse chronological order
 * Requirements: 2.3
 */
export class ExperienceCommand implements Command {
  name = "experience";
  description = "Display work history in chronological order";
  usage = "experience";
  aliases = ["exp", "work"];

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    // Get experiences from portfolio data
    const experiences = this.getExperiencesFromPortfolio(context);

    if (experiences.length === 0) {
      return {
        success: true,
        content: <pre className="whitespace-pre-wrap text-sm">No experience data available.</pre>,
      };
    }

    // Sort experiences by start date in descending order (most recent first)
    const sortedExperiences = [...experiences].sort(
      (a, b) => b.startDate.getTime() - a.startDate.getTime()
    );

    let output = `\nWork Experience\n${"=".repeat(50)}\n\n`;

    sortedExperiences.forEach((exp, index) => {
      const dateRange = this.formatDateRange(exp.startDate, exp.endDate);
      const duration = this.calculateDuration(exp.startDate, exp.endDate);

      output += `${exp.title}\n`;
      output += `${exp.company} • ${exp.location}\n`;
      output += `${dateRange} (${duration})\n\n`;
      output += `${exp.description}\n\n`;
      output += `Technologies: ${exp.technologies.join(", ")}\n`;

      if (index < sortedExperiences.length - 1) {
        output += `\n${"-".repeat(50)}\n\n`;
      }
    });

    const totalYears = this.calculateTotalExperience(sortedExperiences);
    output += `\n${"=".repeat(50)}\n`;
    output += `Total Experience: ${totalYears}\n`;

    return {
      success: true,
      content: <pre className="whitespace-pre-wrap text-sm">{output}</pre>,
    };
  }

  /**
   * Format date range as "MMM YYYY - MMM YYYY" or "MMM YYYY - Present"
   */
  private formatDateRange(startDate: Date, endDate: Date | null): string {
    const formatDate = (date: Date): string => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";

    return `${start} - ${end}`;
  }

  /**
   * Calculate duration between two dates
   */
  private calculateDuration(startDate: Date, endDate: Date | null): string {
    const end = endDate || new Date();
    const diffMs = end.getTime() - startDate.getTime();
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;

    if (years === 0) {
      return `${months} month${months !== 1 ? "s" : ""}`;
    } else if (months === 0) {
      return `${years} year${years !== 1 ? "s" : ""}`;
    } else {
      return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
        months !== 1 ? "s" : ""
      }`;
    }
  }

  /**
   * Calculate total years of experience
   */
  private calculateTotalExperience(experiences: Experience[]): string {
    let totalMonths = 0;

    experiences.forEach((exp) => {
      const end = exp.endDate || new Date();
      const diffMs = end.getTime() - exp.startDate.getTime();
      const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));
      totalMonths += months;
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) {
      return `${months} month${months !== 1 ? "s" : ""}`;
    } else if (months === 0) {
      return `${years} year${years !== 1 ? "s" : ""}`;
    } else {
      return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
        months !== 1 ? "s" : ""
      }`;
    }
  }

  /**
   * Extract experiences from portfolio data
   */
  private getExperiencesFromPortfolio(context: ExecutionContext): Experience[] {
    if (!context.portfolioData?.experiences) {
      return [];
    }

    return context.portfolioData.experiences.map((section: Section) => {
      const metadata = section.metadata as ExperienceMetadata;
      return {
        title: section.title,
        company: metadata.company,
        location: metadata.location || "Remote",
        startDate: section.startDate || new Date(),
        endDate: section.endDate || null,
        description: section.description,
        technologies: metadata.technologies,
      };
    });
  }
}
