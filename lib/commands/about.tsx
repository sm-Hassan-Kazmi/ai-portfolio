import { Command, CommandOutput, ExecutionContext } from "@/types";

/**
 * AboutCommand - Display biographical information and introduction
 */
export class AboutCommand implements Command {
  name = "about";
  description = "Display biographical information";
  usage = "about";

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    const aboutContent = `
╔═══════════════════════════════════════════════════════════╗
║                      ABOUT HASSAN                         ║
╚═══════════════════════════════════════════════════════════╝

👋 Hello! I'm Hassan

I'm a passionate full-stack developer with a love for building elegant,
performant, and user-friendly applications. My journey in software 
development has been driven by curiosity and a desire to solve real-world
problems through code.

🎯 What I Do:
   • Design and develop modern web applications
   • Build scalable backend systems and APIs
   • Create intuitive user interfaces
   • Optimize performance and user experience

💡 Philosophy:
   I believe in writing clean, maintainable code and following best
   practices. I'm always learning new technologies and staying up-to-date
   with industry trends. Collaboration and continuous improvement are at
   the core of my work ethic.

🚀 Current Focus:
   • Exploring cutting-edge web technologies
   • Contributing to open-source projects
   • Building tools that make developers' lives easier

📫 Let's Connect:
   Type 'contact' to get in touch or 'resume' to download my CV.
   Type 'skills' to see my technical expertise.
   Type 'experience' to view my work history.
   Type 'projects' to explore what I've built.

`;

    return {
      success: true,
      content: <pre className="whitespace-pre-wrap text-sm">{aboutContent}</pre>,
    };
  }
}
