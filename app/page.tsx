import TerminalContainer from "@/components/terminal/TerminalContainer";
import { PersonStructuredData, WebSiteStructuredData } from "@/components/shared/StructuredData";

/**
 * Home page with ISR configuration
 * Revalidates every 3600 seconds (1 hour)
 * Requirements: 12.5
 */
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <PersonStructuredData />
      <WebSiteStructuredData />
      <main role="main" className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <TerminalContainer />
      </main>
    </>
  );
}
