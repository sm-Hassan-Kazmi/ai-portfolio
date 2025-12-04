"use client";

import { useEffect, useRef, useState } from "react";
import { TerminalLine } from "@/types";
import { useTerminalStore } from "@/lib/store/terminal-store";
import { commandParser } from "@/lib/command-parser";
import { easterEggCommands } from "@/lib/commands/easter-eggs";
import { commandExecutor } from "@/lib/commands";
import { usePortfolioData } from "@/lib/hooks/usePortfolioData";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface TerminalContainerProps {
  initialMode?: "terminal" | "gui";
}

export default function TerminalContainer({
  initialMode = "terminal",
}: TerminalContainerProps) {
  const [input, setInput] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const { lines, addLine, addCommand, clearLines, navigateHistory, resetHistoryIndex } =
    useTerminalStore();

  // Fetch portfolio data with SWR
  const { portfolioData, isLoading, isError } = usePortfolioData();
  
  // Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  // Auto-focus input on mount and when clicking terminal
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cursor blink effect (disabled if reduced motion is preferred)
  useEffect(() => {
    if (prefersReducedMotion) {
      setCursorVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const trimmedInput = input.trim();
    const parsed = commandParser.parse(trimmedInput);

    // Add command to history
    addLine({
      id: crypto.randomUUID(),
      type: "command",
      content: trimmedInput,
      timestamp: new Date(),
    });

    // Add to command history for navigation
    addCommand(trimmedInput);

    // Check for easter egg commands
    if (commandParser.isEasterEgg(parsed.command)) {
      const easterEggFn =
        easterEggCommands[parsed.command as keyof typeof easterEggCommands];
      if (easterEggFn) {
        addLine({
          id: crypto.randomUUID(),
          type: "output",
          content: easterEggFn(),
          timestamp: new Date(),
        });
      }
    } else {
      // Execute command using CommandExecutor
      const { theme, commandHistory } = useTerminalStore.getState();
      const context = {
        portfolioData,
        theme,
        history: commandHistory,
      };

      const output = await commandExecutor.execute(parsed, context);

      // Handle clear command specially
      if (output.content === "__CLEAR_TERMINAL__") {
        clearLines();
      } else {
        // Add output to terminal
        addLine({
          id: crypto.randomUUID(),
          type: output.success ? "output" : "error",
          content: output.content,
          timestamp: new Date(),
        });
      }
    }

    setInput("");
    resetHistoryIndex();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const command = navigateHistory("up");
      if (command !== null) {
        setInput(command);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const command = navigateHistory("down");
      if (command !== null) {
        setInput(command);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Tab autocomplete
      const trimmedInput = input.trim();
      if (trimmedInput) {
        const completed = commandParser.getUniqueAutocomplete(trimmedInput);
        if (completed) {
          setInput(completed);
        }
      }
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Don't steal focus if clicking on form elements
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'BUTTON' ||
      target.closest('form')
    ) {
      return;
    }
    inputRef.current?.focus();
  };

  return (
    <div
      className="flex flex-col w-full max-w-5xl h-[85vh] bg-[var(--color-terminal-background)] text-[var(--color-terminal-text)] font-mono p-2 sm:p-4 overflow-hidden rounded-lg shadow-2xl border border-[var(--color-terminal-accent)] border-opacity-20"
      onClick={handleContainerClick}
      role="application"
      aria-label="Terminal Portfolio Interface"
    >
      {/* Terminal Output */}
      <div 
        ref={outputRef} 
        className="flex-1 overflow-y-auto mb-2 sm:mb-4 space-y-2 text-sm sm:text-base select-text"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {/* Welcome message */}
        {lines.length === 0 && (
          <div className="text-[var(--color-terminal-accent)] mb-4">
            {/* 2-Column Layout: Welcome Box (left) + ASCII Art (right) */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-6">
              {/* Welcome Box Column - Left */}
              <div className="flex items-center justify-center">
<pre className="whitespace-pre leading-tight text-sm font-mono">
{`
+------------------------------------------+
|                                          |
|  Welcome to Hassan's Terminal Portfolio  |
|                                          |
|  Type 'help' to see available commands   |
|  Type 'hello' for a friendly greeting    |
|                                          |
+------------------------------------------+
`}
                </pre>              </div>

              {/* ASCII ART Column - Right */}
              <div className="flex-shrink-0 hidden md:block">
                <pre className="whitespace-pre leading-tight text-xs font-mono">
{`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡠⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠟⠃⠀⠀⠙⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠋⠀⠀⠀⠀⠀⠀⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠾⢛⠒⠀⠀⠀⠀⠀⠀⠀⢸⡆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣶⣄⡈⠓⢄⠠⡀⠀⠀⠀⣄⣷⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣷⠀⠈⠱⡄⠑⣌⠆⠀⠀⡜⢻⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡿⠳⡆⠐⢿⣆⠈⢿⠀⠀⡇⠘⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣷⡇⠀⠀⠈⢆⠈⠆⢸⠀⠀⢣⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣧⠀⠀⠈⢂⠀⡇⠀⠀⢨⠓⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣦⣤⠖⡏⡸⠀⣀⡴⠋⠀⠈⠢⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠁⣹⣿⣿⣿⣷⣾⠽⠖⠊⢹⣀⠄⠀⠀⠀⠈⢣⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⣇⣰⢫⢻⢉⠉⠀⣿⡆⠀⠀⡸⡏⠀⠀⠀⠀⠀⠀⢇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢨⡇⡇⠈⢸⢸⢸⠀⠀⡇⡇⠀⠀⠁⠻⡄⡠⠂⠀⠀⠀⠘
⢤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠛⠓⡇⠀⠸⡆⢸⠀⢠⣿⠀⠀⠀⠀⣰⣿⣵⡆⠀⠀⠀⠀
⠈⢻⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡿⣦⣀⡇⠀⢧⡇⠀⠀⢺⡟⠀⠀⠀⢰⠉⣰⠟⠊⣠⠂⠀⡸
⠀⠀⢻⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢧⡙⠺⠿⡇⠀⠘⠇⠀⠀⢸⣧⠀⠀⢠⠃⣾⣌⠉⠩⠭⠍⣉⡇
⠀⠀⠀⠻⣿⣿⣿⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣞⣋⠀⠈⠀⡳⣧⠀⠀⠀⠀⠀⢸⡏⠀⠀⡞⢰⠉⠉⠉⠉⠉⠓⢻⠃
⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⢀⣀⠠⠤⣤⣤⠤⠞⠓⢠⠈⡆⠀⢣⣸⣾⠆⠀⠀⠀⠀⠀⢀⣀⡼⠁⡿⠈⣉⣉⣒⡒⠢⡼⠀
⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣎⣽⣶⣤⡶⢋⣤⠃⣠⡦⢀⡼⢦⣾⡤⠚⣟⣁⣀⣀⣀⣀⠀⣀⣈⣀⣠⣾⣅⠀⠑⠂⠤⠌⣩⡇⠀
⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡁⣺⢁⣞⣉⡴⠟⡀⠀⠀⠀⠁⠸⡅⠀⠈⢷⠈⠏⠙⠀⢹⡛⠀⢉⠀⠀⠀⣀⣀⣼⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⡟⢡⠖⣡⡴⠂⣀⣀⣀⣰⣁⣀⣀⣸⠀⠀⠀⠀⠈⠁⠀⠀⠈⠀⣠⠜⠋⣠⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⡟⢿⣿⣿⣷⡟⢋⣥⣖⣉⠀⠈⢁⡀⠤⠚⠿⣷⡦⢀⣠⣀⠢⣄⣀⡠⠔⠋⠁⠀⣼⠃⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⡄⠈⠻⣿⣿⢿⣛⣩⠤⠒⠉⠁⠀⠀⠀⠀⠀⠉⠒⢤⡀⠉⠁⠀⠀⠀⠀⠀⢀⡿⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣤⣤⠴⠟⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠤⠀⠀⠀⠀⠀⢩⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`}

                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Render terminal lines */}
        {lines.map((line) => (
          <TerminalLineComponent key={line.id} line={line} prefersReducedMotion={prefersReducedMotion} />
        ))}
      </div>

      {/* Mobile Quick Commands - Only visible on mobile */}
      <div className="sm:hidden mb-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => {
            setInput("help");
            inputRef.current?.focus();
          }}
          className="px-3 py-2 bg-[var(--color-terminal-accent)] bg-opacity-20 text-[var(--color-terminal-accent)] rounded text-xs font-semibold hover:bg-opacity-30 active:bg-opacity-40 transition-colors touch-manipulation"
          aria-label="Insert help command"
        >
          help
        </button>
        <button
          type="button"
          onClick={() => {
            setInput("about");
            inputRef.current?.focus();
          }}
          className="px-3 py-2 bg-[var(--color-terminal-accent)] bg-opacity-20 text-[var(--color-terminal-accent)] rounded text-xs font-semibold hover:bg-opacity-30 active:bg-opacity-40 transition-colors touch-manipulation"
          aria-label="Insert about command"
        >
          about
        </button>
        <button
          type="button"
          onClick={() => {
            setInput("skills");
            inputRef.current?.focus();
          }}
          className="px-3 py-2 bg-[var(--color-terminal-accent)] bg-opacity-20 text-[var(--color-terminal-accent)] rounded text-xs font-semibold hover:bg-opacity-30 active:bg-opacity-40 transition-colors touch-manipulation"
          aria-label="Insert skills command"
        >
          skills
        </button>
        <button
          type="button"
          onClick={() => {
            setInput("projects");
            inputRef.current?.focus();
          }}
          className="px-3 py-2 bg-[var(--color-terminal-accent)] bg-opacity-20 text-[var(--color-terminal-accent)] rounded text-xs font-semibold hover:bg-opacity-30 active:bg-opacity-40 transition-colors touch-manipulation"
          aria-label="Insert projects command"
        >
          projects
        </button>
        <button
          type="button"
          onClick={() => {
            setInput("contact");
            inputRef.current?.focus();
          }}
          className="px-3 py-2 bg-[var(--color-terminal-accent)] bg-opacity-20 text-[var(--color-terminal-accent)] rounded text-xs font-semibold hover:bg-opacity-30 active:bg-opacity-40 transition-colors touch-manipulation"
          aria-label="Insert contact command"
        >
          contact
        </button>
      </div>

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 relative" role="search">
        <span className="text-[var(--color-terminal-accent)] text-sm sm:text-base" aria-hidden="true">❯</span>
        <div className="flex-1 relative">
          <label htmlFor="terminal-input" className="sr-only">
            Terminal command input
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none border-none text-[var(--color-terminal-text)] text-sm sm:text-base py-2 sm:py-0 min-h-[44px] sm:min-h-0"
            style={{ caretColor: 'transparent' }}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal command input. Press Tab for autocomplete, Up and Down arrows for command history"
            aria-describedby="terminal-help"
          />
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 inline-block w-2 h-5 bg-[var(--color-terminal-text)] pointer-events-none ${
              cursorVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ 
              transition: "opacity 0.1s",
              marginLeft: `${input.length * 0.6}em`
            }}
            aria-hidden="true"
          />
        </div>
        <span id="terminal-help" className="sr-only">
          Type 'help' to see available commands. Use Tab for autocomplete. Use Up and Down arrow keys to navigate command history.
        </span>
      </form>
    </div>
  );
}

interface TerminalLineComponentProps {
  line: TerminalLine;
  prefersReducedMotion: boolean;
}

function TerminalLineComponent({ line, prefersReducedMotion }: TerminalLineComponentProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const content =
    typeof line.content === "string" ? line.content : String(line.content);

  // Typing animation for output lines (disabled if reduced motion is preferred)
  useEffect(() => {
    if (line.type === "command" || prefersReducedMotion) {
      setDisplayedContent(content);
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    setDisplayedContent("");
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 10); // Typing speed: 10ms per character

    return () => clearInterval(typingInterval);
  }, [content, line.type, prefersReducedMotion]);

  const getLineColor = () => {
    switch (line.type) {
      case "command":
        return "text-[var(--color-terminal-text)]";
      case "error":
        return "text-[var(--color-terminal-error)]";
      case "output":
        return "text-[var(--color-terminal-text)]";
      default:
        return "text-[var(--color-terminal-text)]";
    }
  };

  return (
    <div 
      className={`${getLineColor()} whitespace-pre-wrap break-words text-sm sm:text-base`}
      role={line.type === "error" ? "alert" : undefined}
      aria-live={line.type === "error" ? "assertive" : undefined}
    >
      {line.type === "command" && (
        <span className="text-[var(--color-terminal-accent)] mr-2" aria-hidden="true">❯</span>
      )}
      {line.type === "command" && (
        <span className="sr-only">Command: </span>
      )}
      {typeof line.content === "string" ? (
        <>
          {displayedContent}
          {isTyping && (
            <span 
              className="inline-block w-2 h-4 bg-[var(--color-terminal-text)] ml-1 animate-pulse" 
              aria-hidden="true"
            />
          )}
        </>
      ) : (
        line.content
      )}
    </div>
  );
}
