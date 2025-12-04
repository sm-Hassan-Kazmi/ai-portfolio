import { Command, CommandOutput, ExecutionContext, SkillMetadata } from "@/types";

/**
 * StatsCommand - Display portfolio statistics
 * Requirements: 3.5
 */
export class StatsCommand implements Command {
  name = "stats";
  description = "Display portfolio statistics";
  usage = "stats";
  aliases = ["statistics"];

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    // Calculate stats from portfolio data
    const stats = this.calculateStats(context);

    const output = `
╔═══════════════════════════════════════════════════════════╗
║                  PORTFOLIO STATISTICS                     ║
╚═══════════════════════════════════════════════════════════╝

📊 Content Overview:
   ├─ Skills: ${stats.skills}
   ├─ Work Experiences: ${stats.experiences}
   ├─ Projects: ${stats.projects}
   ├─ Featured Projects: ${stats.featuredProjects}
   └─ Certifications: ${stats.certifications}

💼 Professional Journey:
   └─ Total Experience: ${stats.totalYearsExperience}+ years

💻 Development Stats:
   ├─ Lines of Code Written: ~${this.formatNumber(stats.linesOfCode)}
   └─ Coffee Consumed: ${this.formatNumber(stats.coffeeConsumed)} cups ☕

🎯 Skill Distribution:
   ├─ Frontend: ${stats.frontendSkills} skills
   ├─ Backend: ${stats.backendSkills} skills
   └─ Tools & DevOps: ${stats.toolsSkills} skills

🌟 Highlights:
   • ${stats.featuredProjects} featured projects showcasing best work
   • ${stats.certifications} professional certifications
   • Full-stack expertise across modern tech stack
   • Focus on performance, scalability, and user experience

Type 'help' to explore more commands!
`;

    return {
      success: true,
      content: <pre className="whitespace-pre-wrap text-sm">{output}</pre>,
    };
  }

  /**
   * Format number with commas for readability
   */
  private formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /**
   * Calculate statistics from portfolio data
   */
  private calculateStats(context: ExecutionContext) {
    const portfolioData = context.portfolioData;

    if (!portfolioData) {
      return {
        skills: 0,
        experiences: 0,
        projects: 0,
        certifications: 0,
        featuredProjects: 0,
        totalYearsExperience: 0,
        linesOfCode: 150000,
        coffeeConsumed: 2847,
        frontendSkills: 0,
        backendSkills: 0,
        toolsSkills: 0,
      };
    }

    // Count items
    const skills = portfolioData.skills?.length || 0;
    const experiences = portfolioData.experiences?.length || 0;
    const projects = portfolioData.projects?.length || 0;
    const certifications = portfolioData.certifications?.length || 0;
    const featuredProjects = portfolioData.projects?.filter(p => p.isFeatured).length || 0;

    // Calculate skill distribution
    const frontendSkills = portfolioData.skills?.filter(
      s => (s.metadata as SkillMetadata).category === 'frontend'
    ).length || 0;
    const backendSkills = portfolioData.skills?.filter(
      s => (s.metadata as SkillMetadata).category === 'backend'
    ).length || 0;
    const toolsSkills = portfolioData.skills?.filter(
      s => (s.metadata as SkillMetadata).category === 'tools'
    ).length || 0;

    // Calculate total years of experience
    let totalMonths = 0;
    portfolioData.experiences?.forEach((exp) => {
      if (exp.startDate) {
        const end = exp.endDate || new Date();
        const diffMs = end.getTime() - exp.startDate.getTime();
        const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));
        totalMonths += months;
      }
    });
    const totalYearsExperience = Math.floor(totalMonths / 12);

    return {
      skills,
      experiences,
      projects,
      certifications,
      featuredProjects,
      totalYearsExperience,
      linesOfCode: 150000, // Approximate
      coffeeConsumed: 2847, // Cups (approximate)
      frontendSkills,
      backendSkills,
      toolsSkills,
    };
  }
}
