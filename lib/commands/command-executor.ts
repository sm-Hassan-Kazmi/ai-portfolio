import { Command, CommandOutput, ExecutionContext, ParsedCommand } from "@/types";
import { commandParser } from "@/lib/command-parser";

/**
 * CommandExecutor class for routing and executing terminal commands
 */
export class CommandExecutor {
  private commands: Map<string, Command> = new Map();
  private aliases: Map<string, string> = new Map();

  /**
   * Register a command with the executor
   * @param command - Command to register
   */
  register(command: Command): void {
    this.commands.set(command.name.toLowerCase(), command);

    // Register aliases
    if (command.aliases) {
      command.aliases.forEach((alias) => {
        this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
      });
    }
  }

  /**
   * Execute a parsed command
   * @param parsed - Parsed command from CommandParser
   * @param context - Execution context with portfolio data and theme
   * @returns CommandOutput with success status and content
   */
  async execute(
    parsed: ParsedCommand,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    const commandName = parsed.command.toLowerCase();

    // Check if command is empty
    if (!commandName) {
      return {
        success: false,
        content: "",
        error: "No command entered",
      };
    }

    // Resolve alias to actual command name
    const actualCommandName = this.aliases.get(commandName) || commandName;

    // Get command
    const command = this.commands.get(actualCommandName);

    if (!command) {
      // Command not found - suggest similar commands
      const suggestions = commandParser.getSimilarCommands(commandName);
      const suggestionText =
        suggestions.length > 0
          ? `\n\nDid you mean: ${suggestions.join(", ")}?`
          : "";

      return {
        success: false,
        content: `Command not found: ${commandName}${suggestionText}`,
        error: `Command not found: ${commandName}`,
      };
    }

    try {
      // Execute command
      const output = await command.execute(parsed.args, parsed.flags, context);
      return output;
    } catch (error) {
      // Handle execution errors
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      return {
        success: false,
        content: `Error executing command: ${errorMessage}`,
        error: errorMessage,
      };
    }
  }

  /**
   * Get all registered commands
   * @returns Array of all commands
   */
  getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  /**
   * Get a specific command by name
   * @param name - Command name or alias
   * @returns Command or undefined if not found
   */
  getCommand(name: string): Command | undefined {
    const commandName = name.toLowerCase();
    const actualCommandName = this.aliases.get(commandName) || commandName;
    return this.commands.get(actualCommandName);
  }

  /**
   * Check if a command is registered
   * @param name - Command name or alias
   * @returns True if command exists
   */
  hasCommand(name: string): boolean {
    const commandName = name.toLowerCase();
    return (
      this.commands.has(commandName) || this.aliases.has(commandName)
    );
  }
}

// Export singleton instance
export const commandExecutor = new CommandExecutor();
