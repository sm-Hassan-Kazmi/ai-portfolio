import { Command, CommandOutput, ExecutionContext, ContactFormData } from "@/types";
import { ContactForm } from "@/components/shared/ContactForm";

/**
 * ContactCommand - Display contact form in terminal
 * Requirements: 2.6
 */
export class ContactCommand implements Command {
  name = "contact";
  description = "Display contact information and form";
  usage = "contact";
  aliases = [];

  async execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput> {
    const contactInfo = context.portfolioData?.contactInfo;

    /**
     * Handle contact form submission
     * Sends data to /api/contact endpoint
     */
    const handleSubmit = async (
      data: ContactFormData
    ): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: result.error || "Failed to send message",
          };
        }

        return {
          success: true,
          message: result.message || "Message sent successfully!",
        };
      } catch (error) {
        return {
          success: false,
          message: "Network error. Please try again later.",
        };
      }
    };

    const content = (
      <div className="space-y-4">
        <div className="text-green-400">
          <div className="mb-4">
            <div className="text-lg font-bold mb-2">Contact Information</div>
            {contactInfo && (
              <div className="space-y-1 text-sm">
                <div>Email: {contactInfo.email}</div>
                {contactInfo.socials.github && (
                  <div>GitHub: {contactInfo.socials.github}</div>
                )}
                {contactInfo.socials.linkedin && (
                  <div>LinkedIn: {contactInfo.socials.linkedin}</div>
                )}
                {contactInfo.socials.twitter && (
                  <div>Twitter: {contactInfo.socials.twitter}</div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-green-500/30 pt-4 mt-4">
            <div className="text-lg font-bold mb-3">Send a Message</div>
            <ContactForm mode="terminal" onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    );

    return {
      success: true,
      content,
    };
  }
}
