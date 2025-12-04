import { Command, CommandOutput, ExecutionContext } from "@/types";

/**
 * GithubCommand - Open GitHub profile
 */
export class GithubCommand implements Command {
  name = "github";
  description = "Open Hassan's GitHub profile";
  usage = "github";

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    // Open GitHub profile in new tab
    if (typeof window !== "undefined") {
      window.open("https://github.com/hassankazmi", "_blank", "noopener,noreferrer");
    }

    return {
      success: true,
      content: (
        <div className="text-[var(--color-terminal-text)]">
          <pre className="whitespace-pre-wrap">
            {`
🐙 Opening GitHub profile...

   ╔═══════════════════════════════╗
   ║     github.com/hassankazmi    ║
   ╚═══════════════════════════════╝

   Check out my repositories and contributions!
            `}
          </pre>
        </div>
      ),
    };
  }
}

/**
 * LinkedInCommand - Open LinkedIn profile
 */
export class LinkedInCommand implements Command {
  name = "linkedin";
  description = "Open Hassan's LinkedIn profile";
  usage = "linkedin";

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    // Open LinkedIn profile in new tab
    if (typeof window !== "undefined") {
      window.open("https://linkedin.com/in/hassankazmi", "_blank", "noopener,noreferrer");
    }

    return {
      success: true,
      content: (
        <div className="text-[var(--color-terminal-text)]">
          <pre className="whitespace-pre-wrap">
            {`
💼 Opening LinkedIn profile...

   ╔═══════════════════════════════════╗
   ║  linkedin.com/in/hassankazmi      ║
   ╚═══════════════════════════════════╝

   Let's connect professionally!
            `}
          </pre>
        </div>
      ),
    };
  }
}

/**
 * InstagramCommand - Open Instagram profile
 */
export class InstagramCommand implements Command {
  name = "instagram";
  description = "Open Hassan's Instagram profile";
  usage = "instagram";
  aliases = ["insta"];

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    // Open Instagram profile in new tab
    if (typeof window !== "undefined") {
      window.open("https://instagram.com/kazmi.gram", "_blank", "noopener,noreferrer");
    }

    return {
      success: true,
      content: (
        <div className="text-[var(--color-terminal-text)]">
          <pre className="whitespace-pre-wrap">
            {`
📸 Opening Instagram profile...

   ╔═══════════════════════════════╗
   ║   instagram.com/kazmi.gram    ║
   ╚═══════════════════════════════╝

   Follow for updates and photos!
            `}
          </pre>
        </div>
      ),
    };
  }
}
