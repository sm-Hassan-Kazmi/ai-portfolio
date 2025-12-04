import { Command, CommandOutput, ExecutionContext } from "@/types";

/**
 * HistoryCommand - Show command history
 */
export class HistoryCommand implements Command {
  name = "history";
  description = "Show command history";
  usage = "history";

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    const { history } = context;

    if (history.length === 0) {
      return {
        success: true,
        content: "No command history yet. Start typing commands!",
      };
    }

    let output = `\nCommand History\n${"=".repeat(50)}\n\n`;

    history.forEach((cmd, index) => {
      output += `${String(index + 1).padStart(4)}  ${cmd}\n`;
    });

    output += `\n${"=".repeat(50)}\n`;
    output += `Total Commands: ${history.length}\n`;
    output += `\nTip: Use Up/Down arrows to navigate through history\n`;

    return {
      success: true,
      content: <pre className="whitespace-pre-wrap text-sm">{output}</pre>,
    };
  }
}
