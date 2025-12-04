# Requirements Document

## Introduction

Hassan's Terminal Portfolio is a dual-mode portfolio website featuring a primary terminal interface and an alternative gamified GUI mode. The system enables visitors to explore professional experience, skills, projects, and achievements through an interactive command-line interface or a visual gamified experience. An admin portal allows content management through a secure dashboard, with all data stored in Supabase and deployed on Vercel.

## Glossary

- **Terminal Mode**: The primary command-line interface where visitors interact using text commands
- **GUI Mode**: The alternative gamified visual interface with animated components and interactive elements
- **Portfolio System**: The Next.js application serving both public and admin interfaces
- **Admin Portal**: The protected dashboard for content management
- **Supabase Backend**: The PostgreSQL database, authentication, and storage service
- **Section**: A content entity representing skills, experience, projects, certifications, or achievements
- **Command Parser**: The component that interprets and executes terminal commands
- **Theme**: A visual styling configuration for the terminal or GUI interface
- **Visitor**: An unauthenticated user browsing the portfolio
- **Administrator**: An authenticated user with content management privileges

## Requirements

### Requirement 1: Terminal Interface

**User Story:** As a visitor, I want to interact with the portfolio through a terminal interface, so that I can explore content using familiar command-line patterns.

#### Acceptance Criteria

1. WHEN a visitor loads the homepage THEN the Portfolio System SHALL display a terminal interface with a command prompt
2. WHEN a visitor types "help" THEN the Portfolio System SHALL display a list of all available commands with descriptions
3. WHEN a visitor types a valid command THEN the Portfolio System SHALL execute the command and display the output within 100 milliseconds
4. WHEN a visitor presses the up arrow key THEN the Portfolio System SHALL populate the input with the previous command from history
5. WHEN a visitor presses the tab key while typing a partial command THEN the Portfolio System SHALL autocomplete the command if a unique match exists
6. WHEN a visitor types "clear" THEN the Portfolio System SHALL remove all previous output and display a fresh prompt
7. WHEN a visitor types an invalid command THEN the Portfolio System SHALL display an error message suggesting similar valid commands

### Requirement 2: Content Display Commands

**User Story:** As a visitor, I want to view portfolio content through terminal commands, so that I can learn about Hassan's skills, experience, and projects.

#### Acceptance Criteria

1. WHEN a visitor types "about" THEN the Portfolio System SHALL display biographical information and introduction text
2. WHEN a visitor types "skills" THEN the Portfolio System SHALL display all visible skills grouped by category
3. WHEN a visitor types "experience" THEN the Portfolio System SHALL display work history in reverse chronological order
4. WHEN a visitor types "projects" THEN the Portfolio System SHALL display all visible projects with titles and descriptions
5. WHEN a visitor types "certifications" THEN the Portfolio System SHALL display all certifications and achievements
6. WHEN a visitor types "contact" THEN the Portfolio System SHALL display contact information and present a contact form interface

### Requirement 3: Terminal Advanced Features

**User Story:** As a visitor, I want advanced terminal features like command filtering and theming, so that I can customize my browsing experience.

#### Acceptance Criteria

1. WHEN a visitor types "skills --frontend" THEN the Portfolio System SHALL display only skills tagged as frontend
2. WHEN a visitor types "projects --featured" THEN the Portfolio System SHALL display only projects marked as featured
3. WHEN a visitor types "theme cyberpunk" THEN the Portfolio System SHALL apply the cyberpunk color scheme to the terminal
4. WHEN a visitor types "history" THEN the Portfolio System SHALL display all previously executed commands in the current session
5. WHEN a visitor types "stats" THEN the Portfolio System SHALL display aggregate statistics including project count and skill count

### Requirement 4: GUI Mode

**User Story:** As a visitor, I want to switch to a visual gamified interface, so that I can explore the portfolio through an alternative interactive experience.

#### Acceptance Criteria

1. WHEN a visitor types "gui" in terminal mode THEN the Portfolio System SHALL transition to GUI mode with animated elements
2. WHEN a visitor is in GUI mode THEN the Portfolio System SHALL display a hero section with animated avatar and XP progress bar
3. WHEN a visitor navigates in GUI mode THEN the Portfolio System SHALL present sections as interactive rooms with smooth transitions
4. WHEN a visitor clicks the terminal mode button in GUI mode THEN the Portfolio System SHALL transition back to terminal interface
5. WHEN a visitor views skills in GUI mode THEN the Portfolio System SHALL display proficiency meters with percentage values

### Requirement 5: Contact Form

**User Story:** As a visitor, I want to send a message through the contact form, so that I can communicate with Hassan directly.

#### Acceptance Criteria

1. WHEN a visitor submits the contact form with valid data THEN the Portfolio System SHALL send an email via Resend API
2. WHEN a visitor submits the contact form THEN the Portfolio System SHALL validate that the email field contains a valid email address
3. WHEN a visitor submits the contact form THEN the Portfolio System SHALL validate that the message field is not empty
4. WHEN a visitor submits more than three messages within one hour THEN the Portfolio System SHALL reject the submission and display a rate limit message
5. WHEN the contact form submission succeeds THEN the Portfolio System SHALL display a success message and clear the form fields

### Requirement 6: Resume Generation

**User Story:** As a visitor, I want to download Hassan's resume as a PDF, so that I can review credentials offline.

#### Acceptance Criteria

1. WHEN a visitor types "resume" in terminal mode THEN the Portfolio System SHALL generate a PDF resume and initiate download
2. WHEN a visitor clicks the download resume button in GUI mode THEN the Portfolio System SHALL generate a PDF resume and initiate download
3. WHEN the Portfolio System generates a resume THEN the resume SHALL include personal information, skills, experience, featured projects, and certifications
4. WHEN the Portfolio System generates a resume THEN the PDF SHALL be formatted in an ATS-friendly layout
5. WHEN the resume generation completes THEN the download SHALL begin within two seconds

### Requirement 7: Admin Authentication

**User Story:** As an administrator, I want to securely log in to the admin portal, so that I can manage portfolio content.

#### Acceptance Criteria

1. WHEN an administrator submits valid credentials THEN the Portfolio System SHALL create an authenticated session with JWT token
2. WHEN an administrator submits invalid credentials THEN the Portfolio System SHALL reject the login and display an error message
3. WHEN an administrator fails login five times within fifteen minutes THEN the Portfolio System SHALL temporarily block further login attempts
4. WHEN an administrator session is inactive for thirty minutes THEN the Portfolio System SHALL expire the session and require re-authentication
5. WHEN an administrator logs out THEN the Portfolio System SHALL invalidate the session token and redirect to the login page

### Requirement 8: Content Management

**User Story:** As an administrator, I want to create, read, update, and delete portfolio sections, so that I can keep content current.

#### Acceptance Criteria

1. WHEN an administrator creates a new section THEN the Portfolio System SHALL store the section in the Supabase Backend with all provided fields
2. WHEN an administrator updates a section THEN the Portfolio System SHALL save changes and log the modification in audit logs
3. WHEN an administrator deletes a section THEN the Portfolio System SHALL remove the section and display a confirmation message
4. WHEN an administrator reorders sections THEN the Portfolio System SHALL update display order values and reflect changes immediately
5. WHEN an administrator uploads an image THEN the Portfolio System SHALL store the file in Supabase Storage and save the URL reference

### Requirement 9: Admin Dashboard

**User Story:** As an administrator, I want to view portfolio statistics and recent changes, so that I can monitor content status at a glance.

#### Acceptance Criteria

1. WHEN an administrator accesses the admin dashboard THEN the Portfolio System SHALL display total counts for projects, skills, and certifications
2. WHEN an administrator accesses the admin dashboard THEN the Portfolio System SHALL display the ten most recent audit log entries
3. WHEN an administrator accesses the analytics page THEN the Portfolio System SHALL display the most frequently executed terminal commands
4. WHEN an administrator accesses the analytics page THEN the Portfolio System SHALL display the ratio of terminal mode to GUI mode usage
5. WHEN an administrator accesses the settings page THEN the Portfolio System SHALL display editable global configuration options

### Requirement 10: Data Persistence and Security

**User Story:** As an administrator, I want all content changes to be securely stored and audited, so that I can maintain data integrity and track modifications.

#### Acceptance Criteria

1. WHEN the Portfolio System stores section data THEN the Supabase Backend SHALL enforce row-level security policies
2. WHEN an unauthenticated visitor requests section data THEN the Supabase Backend SHALL return only sections where is_visible equals true
3. WHEN an administrator performs a create, update, or delete operation THEN the Portfolio System SHALL record the action in audit logs with timestamp and user identifier
4. WHEN the Portfolio System processes API requests THEN rate limiting SHALL restrict requests to prevent abuse
5. WHEN the Portfolio System handles authentication THEN JWT tokens SHALL be stored in httpOnly cookies to prevent XSS attacks

### Requirement 11: Responsive Design and Accessibility

**User Story:** As a visitor using any device, I want the portfolio to be fully functional and accessible, so that I can explore content regardless of my device or abilities.

#### Acceptance Criteria

1. WHEN a visitor accesses the portfolio on a mobile device THEN the Portfolio System SHALL display a responsive layout optimized for touch interaction
2. WHEN a visitor navigates using only a keyboard THEN the Portfolio System SHALL provide full functionality through keyboard shortcuts
3. WHEN a visitor uses a screen reader THEN the Portfolio System SHALL provide appropriate ARIA labels and semantic HTML
4. WHEN a visitor has prefers-reduced-motion enabled THEN the Portfolio System SHALL disable animations and transitions
5. WHEN the Portfolio System renders images THEN all images SHALL include descriptive alt text

### Requirement 12: Performance and Optimization

**User Story:** As a visitor, I want the portfolio to load quickly and respond instantly, so that I can have a smooth browsing experience.

#### Acceptance Criteria

1. WHEN a visitor loads any public page THEN the Portfolio System SHALL achieve a First Contentful Paint under 1.5 seconds
2. WHEN a visitor loads any public page THEN the Portfolio System SHALL achieve a Time to Interactive under 3 seconds
3. WHEN a visitor executes a terminal command THEN the Portfolio System SHALL display results within 100 milliseconds
4. WHEN the Portfolio System serves images THEN images SHALL be optimized using Next.js Image component with appropriate formats
5. WHEN the Portfolio System generates pages THEN static pages SHALL use Incremental Static Regeneration with 3600 second revalidation
