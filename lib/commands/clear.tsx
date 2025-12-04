import { Command, CommandOutput, ExecutionContext } from "@/types";

/**
 * ClearCommand - Clear terminal output
 * Note: This command returns a special marker that the terminal will recognize
 */
export class ClearCommand implements Command {
  name = "clear";
  description = "Clear terminal output";
  usage = "clear";
  aliases = ["cls"];

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    // Return a special marker that the terminal container will recognize
    // The terminal will handle the actual clearing of lines
    return {
      success: true,
      content: "__CLEAR_TERMINAL__",
    };
  }
}
