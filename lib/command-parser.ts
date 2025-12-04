import { ParsedCommand } from "@/types";

/**
 * CommandParser class for parsing terminal commands
 * Handles command name, arguments, and flags extraction
 */
export class CommandParser {
  private validCommands: string[] = [
    "help",
    "about",
    "skills",
    "experience",
    "projects",
    "certifications",
    "contact",
    "resume",
    "clear",
    "history",
    "stats",
    "theme",
    "gui",
  ];

  // Easter egg commands (hidden from help)
  private easterEggCommands: string[] = [
    "tatakae",
    "gear5",
    "bankai",
  ];

  /**
   * Parse a command string into command name, arguments, and flags
   * @param input - The raw command string
   * @returns ParsedCommand object with command, args, and flags
   */
  parse(input: string): ParsedCommand {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return {
        command: "",
        args: [],
        flags: {},
      };
    }

    const tokens = this.tokenize(trimmedInput);

    if (tokens.length === 0) {
      return {
        command: "",
        args: [],
        flags: {},
      };
    }

    const command = tokens[0].toLowerCase();
    const args: string[] = [];
    const flags: Record<string, string | boolean> = {};

    // Process remaining tokens
    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.startsWith("--")) {
        // This is a flag
        const flagName = token.slice(2);

        // Check if next token is a value (not a flag)
        if (i + 1 < tokens.length && !tokens[i + 1].startsWith("--")) {
          flags[flagName] = tokens[i + 1];
          i++; // Skip next token as it's the flag value
        } else {
          // Boolean flag
          flags[flagName] = true;
        }
      } else {
        // Regular argument
        args.push(token);
      }
    }

    return {
      command,
      args,
      flags,
    };
  }

  /**
   * Tokenize input string, handling quoted arguments
   * @param input - The raw command string
   * @returns Array of tokens
   */
  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let currentToken = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if ((char === '"' || char === "'") && !inQuotes) {
        // Start of quoted string
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        // End of quoted string
        inQuotes = false;
        quoteChar = "";
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
      } else if (char === " " && !inQuotes) {
        // Space outside quotes - token separator
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = "";
        }
      } else {
        // Regular character
        currentToken += char;
      }
    }

    // Add final token if exists
    if (currentToken) {
      tokens.push(currentToken);
    }

    return tokens;
  }

  /**
   * Get autocomplete suggestions for a partial command
   * @param partial - Partial command string
   * @returns Array of matching commands
   */
  autocomplete(partial: string): string[] {
    const trimmed = partial.trim().toLowerCase();

    if (!trimmed) {
      return [];
    }

    return this.validCommands.filter((cmd) => cmd.startsWith(trimmed));
  }

  /**
   * Get the best autocomplete match if unique
   * @param partial - Partial command string
   * @returns Completed command or null if not unique
   */
  getUniqueAutocomplete(partial: string): string | null {
    const matches = this.autocomplete(partial);

    if (matches.length === 1) {
      return matches[0];
    }

    return null;
  }

  /**
   * Check if a command is valid (including easter eggs)
   * @param command - Command name to validate
   * @returns True if command is valid
   */
  isValidCommand(command: string): boolean {
    const lowerCommand = command.toLowerCase();
    return (
      this.validCommands.includes(lowerCommand) ||
      this.easterEggCommands.includes(lowerCommand)
    );
  }

  /**
   * Check if a command is an easter egg
   * @param command - Command name to check
   * @returns True if command is an easter egg
   */
  isEasterEgg(command: string): boolean {
    return this.easterEggCommands.includes(command.toLowerCase());
  }

  /**
   * Get all valid commands
   * @returns Array of valid command names
   */
  getValidCommands(): string[] {
    return [...this.validCommands];
  }

  /**
   * Find similar commands for suggestions (simple Levenshtein-like matching)
   * @param command - Invalid command to find suggestions for
   * @returns Array of similar command suggestions
   */
  getSimilarCommands(command: string): string[] {
    const lowerCommand = command.toLowerCase();

    // Find commands that start with the same letter or contain similar substrings
    const suggestions = this.validCommands.filter((validCmd) => {
      // Same first letter
      if (validCmd[0] === lowerCommand[0]) return true;

      // Contains substring
      if (validCmd.includes(lowerCommand) || lowerCommand.includes(validCmd)) {
        return true;
      }

      // Simple edit distance check (1-2 character difference)
      const distance = this.simpleEditDistance(lowerCommand, validCmd);
      return distance <= 2;
    });

    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  /**
   * Calculate simple edit distance between two strings
   * @param str1 - First string
   * @param str2 - Second string
   * @returns Edit distance
   */
  private simpleEditDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;

    // Create matrix
    const matrix: number[][] = Array(len1 + 1)
      .fill(null)
      .map(() => Array(len2 + 1).fill(0));

    // Initialize first row and column
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[len1][len2];
  }
}

// Export singleton instance
export const commandParser = new CommandParser();
