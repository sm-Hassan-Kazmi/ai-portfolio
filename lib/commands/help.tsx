import { Command, CommandOutput, ExecutionContext } from "@/types";

/**
 * HelpCommand - Display list of available commands with descriptions
 */
export class HelpCommand implements Command {
  name = "help";
  description = "Display list of available commands";
  usage = "help";
  aliases = ["?", "h"];

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    const helpText = `
Available Commands:

  help, ?, h              Display this help message
  about                   Display biographical information
  skills [--frontend|--backend|--tools]
                          Display skills, optionally filtered by category
  experience              Display work history in chronological order
  projects [--featured]   Display projects, optionally show only featured
  certifications          Display certifications and achievements
  contact                 Display contact information
  resume                  Download resume as PDF
  clear                   Clear terminal output
  history                 Show command history
  stats                   Display portfolio statistics
  theme [name]            Change terminal theme (default, cyberpunk, matrix, dracula)
  gui                     Switch to GUI mode

Tips:
  - Use Tab for command autocomplete
  - Use Up/Down arrows to navigate command history
  - Use flags like --frontend to filter results

Examples:
  skills --frontend       Show only frontend skills
  projects --featured     Show only featured projects
  theme cyberpunk         Switch to cyberpunk theme
`;

    return {
      success: true,
      content: <pre className="whitespace-pre-wrap">{helpText}</pre>,
    };
  }
}
