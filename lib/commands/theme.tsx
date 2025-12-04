import { Command, CommandOutput, ExecutionContext } from "@/types";
import { useTerminalStore, themes } from "@/lib/store/terminal-store";

/**
 * ThemeCommand - Switch terminal color themes
 * Usage: theme [theme-name]
 * Available themes: default, cyberpunk, matrix, dracula
 */
export class ThemeCommand implements Command {
  name = "theme";
  description = "Change terminal color theme";
  usage = "theme [theme-name] - Available themes: default, cyberpunk, matrix, dracula";
  aliases = ["color", "colors"];

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    // If no theme name provided, show current theme and available themes
    if (args.length === 0) {
      const currentTheme = context.theme;
      const availableThemes = Object.keys(themes);

      return {
        success: true,
        content: (
          <div className="space-y-2">
            <div>
              <span className="text-[var(--color-terminal-accent)]">Current theme:</span>{" "}
              {currentTheme.name}
            </div>
            <div>
              <span className="text-[var(--color-terminal-accent)]">Available themes:</span>
            </div>
            <div className="ml-4">
              {availableThemes.map((themeName) => (
                <div key={themeName}>
                  • {themeName}
                  {themeName === currentTheme.name && (
                    <span className="text-[var(--color-terminal-success)]"> (current)</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-gray-400">
              Usage: theme [theme-name]
            </div>
          </div>
        ),
      };
    }

    const themeName = args[0].toLowerCase();

    // Check if theme exists
    if (!themes[themeName]) {
      const availableThemes = Object.keys(themes).join(", ");
      return {
        success: false,
        content: (
          <div className="space-y-2">
            <div className="text-[var(--color-terminal-error)]">
              Theme "{themeName}" not found.
            </div>
            <div>
              <span className="text-[var(--color-terminal-accent)]">Available themes:</span>{" "}
              {availableThemes}
            </div>
          </div>
        ),
        error: `Theme "${themeName}" not found`,
      };
    }

    // Apply the theme
    const newTheme = themes[themeName];
    useTerminalStore.getState().setTheme(newTheme);

    return {
      success: true,
      content: (
        <div className="space-y-2">
          <div className="text-[var(--color-terminal-success)]">
            ✓ Theme changed to "{themeName}"
          </div>
          <div className="text-gray-400 text-sm">
            Enjoy your new color scheme!
          </div>
        </div>
      ),
    };
  }
}
