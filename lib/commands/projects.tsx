import { Command, CommandOutput, ExecutionContext, Section, ProjectMetadata } from "@/types";

interface Project {
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  isFeatured: boolean;
  year: number;
}

/**
 * ProjectsCommand - Display projects with optional featured filtering
 * Requirements: 2.4, 3.2
 */
export class ProjectsCommand implements Command {
  name = "projects";
  description = "Display projects, optionally show only featured";
  usage = "projects [--featured]";

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    // Get projects from portfolio data
    const projects = this.getProjectsFromPortfolio(context);

    if (projects.length === 0) {
      return {
        success: true,
        content: <pre className="whitespace-pre-wrap text-sm">No projects data available.</pre>,
      };
    }

    // Filter projects if --featured flag is present
    const filteredProjects = flags.featured
      ? projects.filter((project) => project.isFeatured)
      : projects;

    // Sort by year (most recent first)
    const sortedProjects = [...filteredProjects].sort((a, b) => b.year - a.year);

    const title = flags.featured ? "Featured Projects" : "All Projects";
    let output = `\n${title}\n${"=".repeat(50)}\n\n`;

    sortedProjects.forEach((project, index) => {
      output += `${project.title}${project.isFeatured ? " ⭐" : ""} (${project.year})\n`;
      output += `${"-".repeat(project.title.length + (project.isFeatured ? 3 : 0) + 7)}\n`;
      output += `${project.description}\n\n`;
      output += `Tech Stack: ${project.techStack.join(", ")}\n`;

      if (project.liveUrl) {
        output += `Live: ${project.liveUrl}\n`;
      }
      if (project.githubUrl) {
        output += `GitHub: ${project.githubUrl}\n`;
      }

      if (index < sortedProjects.length - 1) {
        output += `\n`;
      }
    });

    output += `\n${"=".repeat(50)}\n`;
    output += `Showing ${sortedProjects.length} of ${projects.length} projects\n`;

    if (!flags.featured && projects.some((p) => p.isFeatured)) {
      output += `\nTip: Use --featured to show only featured projects\n`;
    }

    return {
      success: true,
      content: <pre className="whitespace-pre-wrap text-sm">{output}</pre>,
    };
  }

  /**
   * Extract projects from portfolio data
   */
  private getProjectsFromPortfolio(context: ExecutionContext): Project[] {
    if (!context.portfolioData?.projects) {
      return [];
    }

    return context.portfolioData.projects.map((section: Section) => {
      const metadata = section.metadata as ProjectMetadata;
      const year = section.startDate ? section.startDate.getFullYear() : new Date().getFullYear();
      
      return {
        title: section.title,
        description: section.description,
        techStack: metadata.techStack,
        liveUrl: metadata.liveUrl,
        githubUrl: metadata.githubUrl,
        isFeatured: section.isFeatured,
        year,
      };
    });
  }
}
