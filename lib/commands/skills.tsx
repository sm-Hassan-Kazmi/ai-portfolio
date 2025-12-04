import { Command, CommandOutput, ExecutionContext, Section, SkillMetadata } from "@/types";

interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "other";
  proficiency: number;
}

/**
 * SkillsCommand - Display skills grouped by category with filtering support
 * Requirements: 2.2, 3.1
 */
export class SkillsCommand implements Command {
  name = "skills";
  description = "Display skills, optionally filtered by category";
  usage = "skills [--frontend|--backend|--tools]";

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    // Get skills from portfolio data
    const skills = this.getSkillsFromPortfolio(context);

    if (skills.length === 0) {
      return {
        success: true,
        content: <pre className="whitespace-pre-wrap text-sm">No skills data available.</pre>,
      };
    }
    // Determine which category to filter by
    let filterCategory: string | null = null;

    if (flags.frontend) {
      filterCategory = "frontend";
    } else if (flags.backend) {
      filterCategory = "backend";
    } else if (flags.tools) {
      filterCategory = "tools";
    }

    // Filter skills if category specified
    const filteredSkills = filterCategory
      ? skills.filter((skill) => skill.category === filterCategory)
      : skills;

    // Group skills by category
    const groupedSkills = this.groupByCategory(filteredSkills);

    // Build output
    const title = filterCategory
      ? `Skills - ${this.capitalizeFirst(filterCategory)}`
      : "Skills - All Categories";

    let output = `\n${title}\n${"=".repeat(title.length)}\n\n`;

    // Display each category
    for (const [category, categorySkills] of Object.entries(groupedSkills)) {
      output += `${this.capitalizeFirst(category)}:\n`;

      categorySkills.forEach((skill) => {
        const bar = this.createProgressBar(skill.proficiency);
        output += `  ${skill.name.padEnd(20)} ${bar} ${skill.proficiency}%\n`;
      });

      output += "\n";
    }

    output += `Total Skills: ${filteredSkills.length}\n`;

    if (!filterCategory) {
      output += `\nTip: Use --frontend, --backend, or --tools to filter by category\n`;
    }

    return {
      success: true,
      content: <pre className="whitespace-pre-wrap text-sm">{output}</pre>,
    };
  }

  /**
   * Group skills by category
   */
  private groupByCategory(
    skills: Skill[]
  ): Record<string, Skill[]> {
    const grouped: Record<string, Skill[]> = {};

    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });

    // Sort skills within each category by proficiency (descending)
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => b.proficiency - a.proficiency);
    });

    return grouped;
  }

  /**
   * Create a visual progress bar
   */
  private createProgressBar(proficiency: number): string {
    const barLength = 20;
    const filledLength = Math.round((proficiency / 100) * barLength);
    const emptyLength = barLength - filledLength;

    return `[${"█".repeat(filledLength)}${"░".repeat(emptyLength)}]`;
  }

  /**
   * Capitalize first letter of a string
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Extract skills from portfolio data
   */
  private getSkillsFromPortfolio(context: ExecutionContext): Skill[] {
    if (!context.portfolioData?.skills) {
      return [];
    }

    return context.portfolioData.skills.map((section: Section) => {
      const metadata = section.metadata as SkillMetadata;
      return {
        name: section.title,
        category: metadata.category,
        proficiency: metadata.proficiency,
      };
    });
  }
}
