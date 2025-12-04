// Core type definitions for the portfolio application

export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export interface CommandOutput {
  success: boolean;
  content: React.ReactNode;
  error?: string;
}

export interface TerminalLine {
  id: string;
  type: "command" | "output" | "error";
  content: string | React.ReactNode;
  timestamp: Date;
}

export interface Theme {
  name: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    error: string;
    success: string;
  };
}

export interface Section {
  id: string;
  type: "skill" | "experience" | "project" | "certification" | "achievement";
  title: string;
  description: string;
  metadata:
    | SkillMetadata
    | ExperienceMetadata
    | ProjectMetadata
    | CertificationMetadata
    | AchievementMetadata;
  imageUrl?: string;
  startDate?: Date;
  endDate?: Date;
  displayOrder: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillMetadata {
  category: "frontend" | "backend" | "tools" | "other";
  proficiency: number; // 0-100
  icon?: string;
}

export interface ExperienceMetadata {
  company: string;
  location?: string;
  technologies: string[];
}

export interface ProjectMetadata {
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
}

export interface CertificationMetadata {
  issuer: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface AchievementMetadata {
  icon: string;
  category: string;
}

export interface PortfolioData {
  about: string;
  skills: Section[];
  experiences: Section[];
  projects: Section[];
  certifications: Section[];
  achievements: Section[];
  contactInfo: ContactInfo;
}

export interface ContactInfo {
  email: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Command execution types
export interface ExecutionContext {
  portfolioData?: PortfolioData;
  theme: Theme;
  history: string[];
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput>;
}
