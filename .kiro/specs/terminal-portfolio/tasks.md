# Implementation Plan

**Note:** This task list focuses on building the terminal mode first. GUI mode, admin portal, and advanced features will be added in future iterations.

## Phase 1: Project Foundation and Terminal Core

- [x] 1. Initialize Next.js 15 project with TypeScript and Tailwind CSS
  - Create Next.js app with App Router
  - Configure TypeScript with strict mode
  - Set up Tailwind CSS with custom theme configuration
  - Install core dependencies (Zustand, SWR, Framer Motion, Lucide icons)
  - Configure ESLint and Prettier
  - Set up project directory structure (/app, /components, /lib, /types)
  - _Requirements: 12.1, 12.2_

- [x] 2. Create terminal UI components and state management
  - [x] 2.1 Implement TerminalContainer component with input and output rendering
    - Create terminal layout with command prompt
    - Implement command input field with focus management
    - Create terminal output renderer for command history
    - Add typing animation and cursor blink effect
    - _Requirements: 1.1_

  - [x] 2.2 Set up Zustand store for terminal state
    - Create store for command history, output lines, and theme
    - Implement actions for adding commands and output
    - Add theme switching logic
    - _Requirements: 1.4, 3.3_

  - [x] 2.3 Implement CommandParser class
    - Parse command string into command name, arguments, and flags
    - Extract flags with -- prefix (e.g., --frontend, --featured)
    - Handle quoted arguments
    - _Requirements: 3.1, 3.2_

  - [ ]\* 2.4 Write property test for command parsing
    - **Property 3: Command autocomplete uniqueness**
    - **Validates: Requirements 1.5**

- [x] 3. Implement core terminal commands with static data
  - [x] 3.1 Create Command interface and CommandExecutor
    - Define Command interface with execute method
    - Implement CommandExecutor to route commands to handlers
    - Add command registry for available commands
    - _Requirements: 1.3_

  - [x] 3.2 Implement HelpCommand
    - Display list of available commands with descriptions
    - Format output with command names and usage
    - _Requirements: 1.2_

  - [x] 3.3 Implement AboutCommand with static biographical data
    - Display personal introduction and bio
    - Format output with ASCII art or styled text
    - _Requirements: 2.1_

  - [x] 3.4 Implement SkillsCommand with static skill data
    - Display skills grouped by category
    - Support --frontend, --backend, --tools flags for filtering
    - _Requirements: 2.2, 3.1_

  - [ ]\* 3.5 Write property test for skills filtering
    - **Property 8: Skills category filtering**
    - **Validates: Requirements 3.1**

  - [x] 3.6 Implement ExperienceCommand with static experience data
    - Display work history in reverse chronological order
    - Format with company, title, dates, and description
    - _Requirements: 2.3_

  - [ ]\* 3.7 Write property test for experience ordering
    - **Property 6: Experience chronological ordering**
    - **Validates: Requirements 2.3**

  - [x] 3.8 Implement ProjectsCommand with static project data
    - Display projects with titles and descriptions
    - Support --featured flag for filtering
    - _Requirements: 2.4, 3.2_

  - [ ]\* 3.9 Write property test for featured projects filtering
    - **Property 9: Featured projects filtering**
    - **Validates: Requirements 3.2**

  - [x] 3.10 Implement CertificationsCommand, ClearCommand, HistoryCommand, StatsCommand
    - CertificationsCommand: Display certifications list
    - ClearCommand: Clear terminal output
    - HistoryCommand: Show command history
    - StatsCommand: Display portfolio statistics
    - _Requirements: 2.5, 1.6, 3.4, 3.5_

  - [ ]\* 3.11 Write property test for command history
    - **Property 10: Command history completeness**
    - **Validates: Requirements 3.4**

  - [ ]\* 3.12 Write property test for statistics accuracy
    - **Property 11: Statistics accuracy**
    - **Validates: Requirements 3.5**

- [x] 4. Add terminal advanced features
  - [x] 4.1 Implement command history navigation with arrow keys
    - Add keyboard event handlers for up/down arrows
    - Navigate through command history
    - _Requirements: 1.4_

  - [ ]\* 4.2 Write property test for history navigation
    - **Property 2: Command history navigation**
    - **Validates: Requirements 1.4**

  - [x] 4.3 Implement tab autocomplete
    - Detect tab key press
    - Find matching commands for partial input
    - Complete command if unique match exists
    - _Requirements: 1.5_

  - [x] 4.4 Implement error handling for invalid commands
    - Detect invalid commands
    - Suggest similar valid commands using string similarity
    - _Requirements: 1.7_

  - [ ]\* 4.5 Write property test for invalid command handling
    - **Property 4: Invalid command error handling**
    - **Validates: Requirements 1.7**

  - [x] 4.6 Implement theme switching
    - Create theme configurations (default, cyberpunk, matrix, dracula)
    - Implement ThemeCommand to switch themes
    - Apply theme colors to terminal
    - _Requirements: 3.3_

  - [ ]\* 4.7 Write property test for command execution performance
    - **Property 1: Command execution performance**
    - **Validates: Requirements 1.3, 12.3**

- [x] 5. Deploy MVP to Vercel
  - Configure Vercel project
  - Set up environment variables
  - Deploy and verify terminal functionality
  - _Requirements: 12.1, 12.2_

## Phase 2: Database Integration and Dynamic Content

- [x] 6. Set up Supabase backend
  - [x] 6.1 Create Supabase project and configure connection
    - Create Supabase account and project
    - Install Supabase client library
    - Configure environment variables
    - Create Supabase client utility
    - _Requirements: 10.1_

  - [x] 6.2 Create database schema with SQL migrations
    - Write SQL for sections table with indexes
    - Write SQL for settings table
    - Run migrations in Supabase
    - _Requirements: 8.1, 9.1_

  - [x] 6.3 Set up Row-Level Security policies
    - Create RLS policy for public read access to visible sections
    - Test policies with unauthenticated requests
    - _Requirements: 10.1, 10.2_

  - [ ]\* 6.4 Write property test for visibility filtering
    - **Property 7: Visibility filtering**
    - **Validates: Requirements 2.4, 10.2**

  - [x] 6.5 Seed database with initial data
    - Create seed script for sections (skills, experience, projects, certifications)
    - Create seed script for settings (terminal theme, contact info)
    - Run seed scripts
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

- [x] 7. Create API routes for portfolio data
  - [x] 7.1 Implement /api/portfolio GET endpoint
    - Fetch all visible sections from database
    - Fetch settings from database
    - Transform data into PortfolioData interface
    - Return JSON response
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

  - [x] 7.2 Set up SWR for client-side data fetching
    - Create useSWR hook for portfolio data
    - Configure cache and revalidation
    - Add loading and error states
    - _Requirements: 12.3_

  - [x] 7.3 Update terminal commands to use dynamic data
    - Modify SkillsCommand to fetch from API
    - Modify ExperienceCommand to fetch from API
    - Modify ProjectsCommand to fetch from API
    - Modify CertificationsCommand to fetch from API
    - Modify StatsCommand to calculate from API data
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 3.5_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Contact Form and Resume Generation

- [-] 9. Implement contact form
  - [x] 9.1 Create ContactForm component for terminal mode
    - Build form with name, email, message fields
    - Add real-time validation
    - Style for terminal display
    - _Requirements: 2.6, 5.2, 5.3_

  - [ ]\* 9.2 Write property test for email validation
    - **Property 14: Email validation**
    - **Validates: Requirements 5.2**

  - [ ]\* 9.3 Write property test for message validation
    - **Property 15: Message field validation**
    - **Validates: Requirements 5.3**

  - [x] 9.4 Implement ContactCommand
    - Display contact form in terminal
    - Handle multi-line input for message
    - _Requirements: 2.6_

  - [x] 9.5 Set up Resend for email delivery
    - Create Resend account and get API key
    - Install Resend SDK
    - Configure environment variables
    - _Requirements: 5.1_

  - [x] 9.6 Create /api/contact POST endpoint
    - Validate form data with Zod
    - Send email via Resend API
    - Return success/error response
    - _Requirements: 5.1_

  - [ ]\* 9.7 Write property test for contact form email sending
    - **Property 13: Contact form email sending**
    - **Validates: Requirements 5.1**

  - [x] 9.8 Implement rate limiting for contact form
    - Track submissions by IP address
    - Limit to 3 submissions per hour
    - Return 429 status when rate limited
    - _Requirements: 5.4_

  - [ ]\* 9.9 Write property test for contact form rate limiting
    - **Property 16: Contact form rate limiting**
    - **Validates: Requirements 5.4**

  - [ ]\* 9.10 Write property test for form success state
    - **Property 17: Contact form success state**
    - **Validates: Requirements 5.5**

- [x] 10. Implement resume PDF generation
  - [x] 10.1 Set up PDF generation library
    - Install @react-pdf/renderer
    - Create PDF document component
    - Define resume template layout
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 10.2 Create /api/resume GET endpoint
    - Fetch portfolio data from database
    - Generate PDF with personal info, skills, experience, projects, certifications
    - Return PDF as downloadable file
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]\* 10.3 Write property test for resume content completeness
    - **Property 18: Resume content completeness**
    - **Validates: Requirements 6.3**

  - [x] 10.4 Implement ResumeCommand for terminal mode
    - Trigger PDF download on command execution
    - Show loading indicator during generation
    - _Requirements: 6.1_

  - [ ]\* 10.5 Write property test for resume generation performance
    - **Property 19: Resume generation performance**
    - **Validates: Requirements 6.5**

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Polish, Accessibility, and Performance

- [x] 12. Implement accessibility features
  - [x] 12.1 Add keyboard navigation support
    - Ensure all interactive elements are keyboard accessible
    - Add focus visible indicators
    - Implement keyboard shortcuts
    - _Requirements: 11.2_

  - [ ]\* 12.2 Write property test for keyboard navigation
    - **Property 36: Keyboard navigation completeness**
    - **Validates: Requirements 11.2**

  - [x] 12.3 Add ARIA labels and semantic HTML
    - Add ARIA labels to all interactive components
    - Use semantic HTML elements
    - Add screen reader announcements for dynamic content
    - _Requirements: 11.3_

  - [ ]\* 12.4 Write property test for ARIA labels
    - **Property 37: ARIA labels presence**
    - **Validates: Requirements 11.3**

  - [x] 12.5 Implement prefers-reduced-motion support
    - Detect prefers-reduced-motion preference
    - Disable animations when enabled
    - Replace with instant transitions
    - _Requirements: 11.4_

  - [ ]\* 12.6 Write property test for reduced motion
    - **Property 38: Reduced motion preference**
    - **Validates: Requirements 11.4**

  - [x] 12.7 Add alt text to all images
    - Ensure all images have descriptive alt attributes
    - Add alt text to dynamically loaded images
    - _Requirements: 11.5_

  - [ ]\* 12.8 Write property test for image alt text
    - **Property 39: Image alt text completeness**
    - **Validates: Requirements 11.5**

- [x] 13. Optimize performance
  - [x] 13.1 Optimize images with Next.js Image component
    - Replace all img tags with Next.js Image
    - Configure image domains in next.config.js
    - Add appropriate sizes and srcset
    - _Requirements: 12.4_

  - [ ]\* 13.2 Write property test for Next.js Image usage
    - **Property 40: Next.js Image optimization**
    - **Validates: Requirements 12.4**

  - [x] 13.3 Configure ISR for public pages
    - Set revalidate to 3600 seconds for public pages
    - Test cache invalidation
    - _Requirements: 12.5_

  - [x] 13.4 Implement API rate limiting
    - Set up rate limiting middleware
    - Configure limits per endpoint
    - Add rate limit headers to responses
    - _Requirements: 10.4_

  - [ ]\* 13.5 Write property test for API rate limiting
    - **Property 34: API rate limiting enforcement**
    - **Validates: Requirements 10.4**

- [ ] 14. Add error tracking and monitoring
  - [ ] 14.1 Set up Sentry for error tracking
    - Create Sentry account and project
    - Install Sentry SDK
    - Configure error boundaries
    - Add source maps for better debugging
    - _Requirements: 12.1, 12.2_

  - [ ] 14.2 Implement error boundaries
    - Create error boundary components
    - Add fallback UI for errors
    - Log errors to Sentry
    - _Requirements: 12.1, 12.2_

- [x] 15. Mobile optimization and responsive design
  - [x] 15.1 Optimize terminal for mobile
    - Create mobile-friendly command input
    - Adjust font sizes for readability
    - Add touch-friendly buttons
    - _Requirements: 11.1_

- [x] 16. SEO optimization
  - [x] 16.1 Add meta tags and Open Graph tags
    - Add title, description, OG tags to all pages
    - Add Twitter card tags
    - Configure favicon and app icons
    - _Requirements: 12.1_

  - [x] 16.2 Generate sitemap and robots.txt
    - Create sitemap.xml with all public pages
    - Configure robots.txt
    - _Requirements: 12.1_

  - [x] 16.3 Add structured data (JSON-LD)
    - Add Person schema for about page
    - Add WebSite schema for homepage
    - _Requirements: 12.1_

- [ ] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Production deployment and verification
  - Deploy to Vercel production
  - Run Lighthouse audit (target 95+ on all metrics)
  - Verify all functionality in production
  - Test on multiple devices and browsers
  - _Requirements: 12.1, 12.2_

## Future Phases (To Be Added Later)

The following features will be implemented in future iterations:

- **GUI Mode**: Gamified visual interface with hero section, skills lab, experience timeline, projects gallery, and achievements hall
- **Admin Portal**: Authentication system, admin dashboard, content management (CRUD), analytics, and settings
- **Advanced Features**: Blog section with MDX, AI chat assistant, enhanced gamification, internationalization, public API access
