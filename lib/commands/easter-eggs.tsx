/**
 * Easter egg commands - Hidden anime-themed commands
 */

export const tatakaeCommand = () => {
  return (
    <div className="text-[var(--color-terminal-accent)] my-4">
      <pre className="whitespace-pre-wrap">
        {`
    ⚔️  TATAKAE! TATAKAE! ⚔️
    
    "If you win, you live.
     If you lose, you die.
     If you don't fight, you can't win!"
     
    - Eren Yeager, Attack on Titan
    
    🔥 Keep moving forward! 🔥
        `}
      </pre>
      <div className="mt-2 text-[var(--color-terminal-text)] opacity-80">
        Achievement Unlocked: "The Rumbling" 🎖️
      </div>
    </div>
  );
};

export const gear5Command = () => {
  return (
    <div className="text-[var(--color-terminal-accent)] my-4">
      <pre className="whitespace-pre-wrap">
        {`
    🌟 GEAR 5 ACTIVATED! 🌟
    
         ⚡ ☀️ ⚡
        ╔═══════════╗
        ║  SUN GOD  ║
        ║   NIKA    ║
        ╚═══════════╝
         ⚡ ☀️ ⚡
    
    "I'm the freest person in the world!"
    
    - Monkey D. Luffy, One Piece
    
    🏴‍☠️ The most ridiculous power! 🏴‍☠️
        `}
      </pre>
      <div className="mt-2 text-[var(--color-terminal-text)] opacity-80">
        Achievement Unlocked: "Joyboy Returns" 🎖️
      </div>
    </div>
  );
};

export const bankaiCommand = () => {
  return (
    <div className="text-[var(--color-terminal-accent)] my-4">
      <pre className="whitespace-pre-wrap">
        {`
    ⚡ BANKAI! ⚡
    
        ╔═══════════════╗
        ║   卍  解      ║
        ║   BANKAI      ║
        ╚═══════════════╝
    
    "Bankai: Tensa Zangetsu!"
    
    - Ichigo Kurosaki, Bleach
    
    ⚔️  Spiritual pressure intensifies... ⚔️
        `}
      </pre>
      <div className="mt-2 text-[var(--color-terminal-text)] opacity-80">
        Achievement Unlocked: "Soul Reaper" 🎖️
      </div>
    </div>
  );
};

export const easterEggCommands = {
  tatakae: tatakaeCommand,
  gear5: gear5Command,
  bankai: bankaiCommand,
};
