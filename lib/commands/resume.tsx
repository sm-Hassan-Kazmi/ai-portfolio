/**
 * Resume Command
 * Triggers PDF resume download
 * Shows loading indicator during generation
 * 
 * Requirements: 6.1
 */

import React from "react";
import { Command, CommandOutput, ExecutionContext } from "@/types";

/**
 * Component that triggers the download automatically
 */
function DownloadTrigger() {
  // Trigger download on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/api/resume';
      link.download = 'Hassan_Kazmi_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500); // Small delay to show the message first

    return () => clearTimeout(timer);
  }, []);

  return null;
}

export class ResumeCommand implements Command {
  name = "resume";
  description = "Download resume as PDF";
  usage = "resume";
  aliases = ["cv"];

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    return {
      success: true,
      content: (
        <div className="space-y-2">
          <div className="text-green-400">
            📄 Generating resume PDF...
          </div>
          <div className="text-gray-300">
            Your resume will download shortly.
          </div>
          <div className="text-gray-400 text-sm mt-2">
            If the download doesn't start automatically, click{" "}
            <a
              href="/api/resume"
              download
              className="text-blue-400 hover:text-blue-300 underline"
              onClick={(e) => {
                // Trigger download
                e.preventDefault();
                const link = document.createElement('a');
                link.href = '/api/resume';
                link.download = 'Hassan_Kazmi_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              here
            </a>
            .
          </div>
          <DownloadTrigger />
        </div>
      ),
    };
  }
}
