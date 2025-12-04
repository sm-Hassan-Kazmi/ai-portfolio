/**
 * Command registry - imports and registers all available commands
 */
import { commandExecutor } from "./command-executor";
import { HelpCommand } from "./help";
import { AboutCommand } from "./about";
import { SkillsCommand } from "./skills";
import { ExperienceCommand } from "./experience";
import { ProjectsCommand } from "./projects";
import { CertificationsCommand } from "./certifications";
import { ClearCommand } from "./clear";
import { HistoryCommand } from "./history";
import { StatsCommand } from "./stats";
import { ThemeCommand } from "./theme";
import { ContactCommand } from "./contact";
import { ResumeCommand } from "./resume";
import { GithubCommand, LinkedInCommand, InstagramCommand } from "./socials";
import { HelloCommand, ByeCommand, MakiZeninCommand } from "./greetings";

// Register all commands
commandExecutor.register(new HelpCommand());
commandExecutor.register(new AboutCommand());
commandExecutor.register(new SkillsCommand());
commandExecutor.register(new ExperienceCommand());
commandExecutor.register(new ProjectsCommand());
commandExecutor.register(new CertificationsCommand());
commandExecutor.register(new ClearCommand());
commandExecutor.register(new HistoryCommand());
commandExecutor.register(new StatsCommand());
commandExecutor.register(new ThemeCommand());
commandExecutor.register(new ContactCommand());
commandExecutor.register(new ResumeCommand());
commandExecutor.register(new GithubCommand());
commandExecutor.register(new LinkedInCommand());
commandExecutor.register(new InstagramCommand());
commandExecutor.register(new HelloCommand());
commandExecutor.register(new ByeCommand());
commandExecutor.register(new MakiZeninCommand());

// Export the configured executor
export { commandExecutor };
export * from "./command-executor";
