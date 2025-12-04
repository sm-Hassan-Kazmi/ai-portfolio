import { Command, CommandOutput, ExecutionContext } from "@/types";

/**
 * HelloCommand - Display friendly greeting
 */
export class HelloCommand implements Command {
  name = "hello";
  description = "Say hello!";
  usage = "hello";

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    return {
      success: true,
      content: (
        <div className="text-[var(--color-terminal-accent)] my-2">
          <pre className="whitespace-pre-wrap text-lg">
            {`
    👋 heyyyy! How can i help

    Type 'help' to see available commands!
            `}
          </pre>
        </div>
      ),
    };
  }
}

/**
 * ByeCommand - Display farewell message
 */
export class ByeCommand implements Command {
  name = "bye";
  description = "Say goodbye!";
  usage = "bye";

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    return {
      success: true,
      content: (
        <div className="text-[var(--color-terminal-accent)] my-2">
          <pre className="whitespace-pre-wrap text-lg">
            {`
    👋 byeeee

    Thanks for visiting! Come back soon! ✨
            `}
          </pre>
        </div>
      ),
    };
  }
}

/**
 * MakiZeninCommand - Easter egg command
 */
export class MakiZeninCommand implements Command {
  name = "maki-zenin";
  description = "???";
  usage = "maki-zenin";

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    return {
      success: true,
      content: (
        <div className="text-[var(--color-terminal-accent)] my-4">
          <pre className="whitespace-pre-wrap">
            {`
    💚 heyyyy shorty

         ⚔️  ✨  ⚔️
        ╔═══════════╗
        ║ MAKI-Zenin║
        ╚═══════════╝
         ⚔️  ✨  ⚔️

    "I'll show you what a Zenin without cursed energy can do!"
    
    - Maki Zenin, Jujutsu Kaisen
    
    🔥 Heavenly Restriction Activated! 🔥
            `}
          </pre>
          <div className="mt-2 text-[var(--color-terminal-text)] opacity-80">
            Achievement Unlocked: "Zenin Clan Rebel" 🎖️
          </div>
        </div>
      ),
    };
  }
}
