# Design Document: Hassan's Terminal Portfolio

## Overview

Hassan's Terminal Portfolio is a Next.js 15 application featuring dual interaction modes: a primary terminal interface and an alternative gamified GUI. The architecture leverages Next.js App Router with Server Actions for mutations, Supabase for backend services (database, auth, storage), and Vercel for deployment. The system prioritizes performance, accessibility, and security while providing an engaging user experience through both command-line and visual interfaces.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 15 App Router                 │
│                                                         │
│  ┌─────────────────┐         ┌─────────────────┐      │
│  │  Public Routes  │         │ Protected Routes│      │
│  │  - / (Terminal) │         │  - /admin/*     │      │
│  │  - /gui         │         │                 │      │
│  └─────────────────┘         └─────────────────┘      │
│                                                         │
│  ┌─────────────────────────────────────────────┐      │
│  │           API Routes & Server Actions        │      │
│  │  - /api/portfolio (GET)                     │      │
│  │  - /api/contact (POST)                      │      │
│  │  - /api/resume (GET)                        │      │
│  │  - Server Actions for admin mutations       │      │
│  └─────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                    Supabase Backend                     │
│  ┌──────────────┐  ┌──────────┐  ┌─────────────┐      │
│  │  PostgreSQL  │  │   Auth   │  │   Storage   │      │
│  │  - sections  │  │  - JWT   │  │  - images   │      │
│  │  - settings  │  │  - RLS   │  │             │      │
│  │  - users     │  │          │  │             │      │
│  │  - audit_logs│  │          │  │             │      │
│  └──────────────┘  └──────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**

- Next.js 15 (App Router, Server Actions, React Server Components)
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- shadcn/ui for admin components
- Zustand for client-side state management
- SWR for data fetching with caching

**Backend:**

- Next.js API Routes (serverless functions)
- Supabase PostgreSQL database
- Supabase Auth (JWT-based)
- Supabase Storage for images
- Resend for email delivery

**Deployment:**

- Vercel (hosting, edge functions, analytics)
- Sentry for error tracking

## Components and Interfaces

### 1. Terminal Mode Components

#### TerminalContainer

Main container component managing terminal state and rendering.

```typescript
interface TerminalContainerProps {
  initialMode: "terminal" | "gui";
}

interface TerminalLine {
  id: string;
  type: "command" | "output" | "error";
  content: string | React.ReactNode;
  timestamp: Date;
}
```

#### CommandParser

Parses and validates user input, extracts command and arguments.

```typescript
interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

class CommandParser {
  parse(input: string): ParsedCommand;
  autocomplete(partial: string): string[];
}
```

#### CommandExecutor

Executes parsed commands and returns output.

```typescript
interface CommandExecutor {
  execute(parsed: ParsedCommand, context: ExecutionContext): Promise<CommandOutput>;
}

interface CommandOutput {
  success: boolean;
  content: React.ReactNode;
  error?: string;
}

interface ExecutionContext {
  portfolioData: PortfolioData;
  theme: Theme;
  history: string[];
}
```

#### Command Implementations

Each command is a separate module implementing the Command interface.

```typescript
interface Command {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  execute(
    args: string[],
    flags: Record<string, any>,
    context: ExecutionContext
  ): Promise<CommandOutput>;
}
```

Commands to implement:

- `HelpCommand`: Display available commands
- `AboutCommand`: Show biographical info
- `SkillsCommand`: List skills with filtering
- `ExperienceCommand`: Display work history
- `ProjectsCommand`: Show projects with filtering
- `CertificationsCommand`: List certifications
- `ContactCommand`: Display contact form
- `ResumeCommand`: Trigger PDF download
- `ClearCommand`: Clear terminal output
- `HistoryCommand`: Show command history
- `ThemeCommand`: Change terminal theme
- `StatsCommand`: Display portfolio statistics
- `GuiCommand`: Switch to GUI mode

### 2. GUI Mode Components

#### GuiContainer

Main container for gamified visual interface.

```typescript
interface GuiContainerProps {
  portfolioData: PortfolioData;
}
```

#### HeroSection

Animated hero with avatar, name, title, and XP bar.

```typescript
interface HeroSectionProps {
  name: string;
  title: string;
  avatar: string;
  level: number;
  xpProgress: number;
}
```

#### SkillsLab

Visual skill display with proficiency meters.

```typescript
interface SkillsLabProps {
  skills: Skill[];
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100
  icon?: string;
}
```

#### ExperienceTimeline

Horizontal scrollable timeline of work history.

```typescript
interface ExperienceTimelineProps {
  experiences: Experience[];
}

interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  technologies: string[];
}
```

#### ProjectsGallery

Grid of project cards with filtering.

```typescript
interface ProjectsGalleryProps {
  projects: Project[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  isFeatured: boolean;
}
```

#### AchievementsHall

Badge collection display.

```typescript
interface AchievementsHallProps {
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}
```

### 3. Admin Portal Components

#### AdminLayout

Protected layout with navigation and auth check.

```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
}
```

#### Dashboard

Overview with stats and recent changes.

```typescript
interface DashboardProps {
  stats: PortfolioStats;
  recentLogs: AuditLog[];
}

interface PortfolioStats {
  totalProjects: number;
  totalSkills: number;
  totalCertifications: number;
  totalExperiences: number;
}
```

#### SectionsManager

CRUD interface for content management.

```typescript
interface SectionsManagerProps {
  sections: Section[];
  onUpdate: (section: Section) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (sections: Section[]) => Promise<void>;
}
```

#### SectionForm

Form for creating/editing sections.

```typescript
interface SectionFormProps {
  section?: Section;
  onSubmit: (data: SectionFormData) => Promise<void>;
  onCancel: () => void;
}

interface SectionFormData {
  type: "skill" | "experience" | "project" | "certification" | "achievement";
  title: string;
  description: string;
  metadata: Record<string, any>;
  imageUrl?: string;
  startDate?: Date;
  endDate?: Date;
  isFeatured: boolean;
  isVisible: boolean;
}
```

### 4. Shared Components

#### ContactForm

Reusable contact form for both modes.

```typescript
interface ContactFormProps {
  mode: "terminal" | "gui";
  onSubmit: (data: ContactFormData) => Promise<void>;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
```

#### ThemeProvider

Context provider for theme management.

```typescript
interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

interface Theme {
  name: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    error: string;
    success: string;
  };
}
```

## Data Models

### Database Schema

#### sections table

```sql
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB,
  image_url TEXT,
  start_date DATE,
  end_date DATE,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sections_type ON sections(type);
CREATE INDEX idx_sections_order ON sections(display_order);
CREATE INDEX idx_sections_visible ON sections(is_visible);
```

**Metadata structure by type:**

```typescript
// For skills
interface SkillMetadata {
  category: "frontend" | "backend" | "tools" | "other";
  proficiency: number; // 0-100
  icon?: string;
}

// For experience
interface ExperienceMetadata {
  company: string;
  location?: string;
  technologies: string[];
}

// For projects
interface ProjectMetadata {
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
}

// For certifications
interface CertificationMetadata {
  issuer: string;
  credentialId?: string;
  credentialUrl?: string;
}

// For achievements
interface AchievementMetadata {
  icon: string;
  category: string;
}
```

#### settings table

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Settings keys:**

- `terminal_theme`: Default terminal theme configuration
- `feature_flags`: Enable/disable features
- `contact_info`: Email and social links
- `seo_metadata`: Meta tags and descriptions
- `gui_config`: GUI mode configuration

#### users table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  two_fa_enabled BOOLEAN DEFAULT false,
  two_fa_secret TEXT,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### audit_logs table

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

#### analytics_events table

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_date ON analytics_events(created_at);
```

### TypeScript Interfaces

```typescript
interface Section {
  id: string;
  type: "skill" | "experience" | "project" | "certification" | "achievement";
  title: string;
  description: string;
  metadata:
    | SkillMetadata
    | ExperienceMetadata
    | ProjectMetadata
    | CertificationMetadata
    | AchievementMetadata;
  imageUrl?: string;
  startDate?: Date;
  endDate?: Date;
  displayOrder: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PortfolioData {
  about: string;
  skills: Section[];
  experiences: Section[];
  projects: Section[];
  certifications: Section[];
  achievements: Section[];
  contactInfo: ContactInfo;
}

interface ContactInfo {
  email: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

interface AuditLog {
  id: string;
  userId: string;
  action: "create" | "update" | "delete";
  tableName: string;
  recordId: string;
  oldData?: any;
  newData?: any;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Command execution performance

_For any_ valid terminal command, execution and output display should complete within 100 milliseconds.
**Validates: Requirements 1.3, 12.3**

### Property 2: Command history navigation

_For any_ sequence of executed commands, pressing the up arrow key should retrieve commands in reverse chronological order.
**Validates: Requirements 1.4**

### Property 3: Command autocomplete uniqueness

_For any_ partial command string that has exactly one matching valid command, pressing tab should complete to that command.
**Validates: Requirements 1.5**

### Property 4: Invalid command error handling

_For any_ invalid command string, the system should display an error message with command suggestions.
**Validates: Requirements 1.7**

### Property 5: Skills grouping by category

_For any_ set of skills with category metadata, the skills command should group all skills by their category field.
**Validates: Requirements 2.2**

### Property 6: Experience chronological ordering

_For any_ set of experience entries, the experience command should display them ordered by start_date in descending order.
**Validates: Requirements 2.3**

### Property 7: Visibility filtering

_For any_ set of sections with mixed is_visible values, only sections where is_visible equals true should be displayed to unauthenticated visitors.
**Validates: Requirements 2.4, 10.2**

### Property 8: Skills category filtering

_For any_ set of skills and any category filter flag, the filtered output should contain only skills matching that category.
**Validates: Requirements 3.1**

### Property 9: Featured projects filtering

_For any_ set of projects, using the --featured flag should return only projects where is_featured equals true.
**Validates: Requirements 3.2**

### Property 10: Command history completeness

_For any_ session with executed commands, the history command should display all commands in the order they were executed.
**Validates: Requirements 3.4**

### Property 11: Statistics accuracy

_For any_ portfolio data, the stats command should display counts that match the actual number of visible items in each category.
**Validates: Requirements 3.5**

### Property 12: GUI proficiency display

_For any_ skill with a proficiency value, the GUI mode should display a meter showing the exact percentage value.
**Validates: Requirements 4.5**

### Property 13: Contact form email sending

_For any_ valid contact form submission, an email should be sent via the Resend API with the provided data.
**Validates: Requirements 5.1**

### Property 14: Email validation

_For any_ string submitted as an email, the system should accept it only if it matches valid email format patterns.
**Validates: Requirements 5.2**

### Property 15: Message field validation

_For any_ message string composed entirely of whitespace or empty, the contact form should reject the submission.
**Validates: Requirements 5.3**

### Property 16: Contact form rate limiting

_For any_ IP address, after three successful submissions within one hour, subsequent submissions should be rejected with a rate limit error.
**Validates: Requirements 5.4**

### Property 17: Contact form success state

_For any_ successful contact form submission, the form fields should be cleared and a success message should be displayed.
**Validates: Requirements 5.5**

### Property 18: Resume content completeness

_For any_ portfolio data, the generated PDF resume should include sections for personal information, skills, experience, featured projects, and certifications.
**Validates: Requirements 6.3**

### Property 19: Resume generation performance

_For any_ resume generation request, the PDF should be generated and download initiated within two seconds.
**Validates: Requirements 6.5**

### Property 20: Valid authentication session creation

_For any_ valid administrator credentials, submitting them should create an authenticated session with a valid JWT token.
**Validates: Requirements 7.1**

### Property 21: Invalid authentication rejection

_For any_ invalid administrator credentials, the login attempt should be rejected with an error message.
**Validates: Requirements 7.2**

### Property 22: Login rate limiting

_For any_ account, after five failed login attempts within fifteen minutes, subsequent login attempts should be blocked temporarily.
**Validates: Requirements 7.3**

### Property 23: Logout session invalidation

_For any_ authenticated session, logging out should invalidate the JWT token and prevent further authenticated requests.
**Validates: Requirements 7.5**

### Property 24: Section creation persistence

_For any_ section data submitted by an administrator, the section should be stored in the database with all provided fields intact.
**Validates: Requirements 8.1**

### Property 25: Section update with audit logging

_For any_ section update operation, both the section data should be modified and an audit log entry should be created with old and new values.
**Validates: Requirements 8.2**

### Property 26: Section deletion

_For any_ section, when deleted by an administrator, the section should no longer appear in database queries.
**Validates: Requirements 8.3**

### Property 27: Section reordering persistence

_For any_ new ordering of sections, the display_order field should be updated to reflect the new sequence.
**Validates: Requirements 8.4**

### Property 28: Image upload and URL storage

_For any_ image file uploaded by an administrator, the file should be stored in Supabase Storage and the section should reference the storage URL.
**Validates: Requirements 8.5**

### Property 29: Dashboard statistics accuracy

_For any_ portfolio data, the dashboard should display counts that exactly match the number of items in each category.
**Validates: Requirements 9.1**

### Property 30: Recent audit logs limiting

_For any_ set of audit log entries, the dashboard should display exactly the ten most recent entries ordered by created_at descending.
**Validates: Requirements 9.2**

### Property 31: Command frequency analytics

_For any_ set of analytics events, the most frequently executed commands should be calculated and displayed in descending order by count.
**Validates: Requirements 9.3**

### Property 32: Mode usage ratio calculation

_For any_ set of mode switch events, the ratio of terminal to GUI usage should be calculated as the proportion of time spent in each mode.
**Validates: Requirements 9.4**

### Property 33: Audit logging for all mutations

_For any_ create, update, or delete operation performed by an administrator, an audit log entry should be created with action type, table name, record ID, and timestamp.
**Validates: Requirements 10.3**

### Property 34: API rate limiting enforcement

_For any_ API endpoint, after exceeding the configured request limit within the time window, subsequent requests should be rejected with a 429 status code.
**Validates: Requirements 10.4**

### Property 35: JWT httpOnly cookie storage

_For any_ authentication response, the JWT token should be set in an httpOnly cookie with secure and sameSite attributes.
**Validates: Requirements 10.5**

### Property 36: Keyboard navigation completeness

_For any_ interactive element in the portfolio, it should be reachable and operable using only keyboard inputs.
**Validates: Requirements 11.2**

### Property 37: ARIA labels presence

_For any_ interactive component, appropriate ARIA labels and semantic HTML elements should be present for screen reader compatibility.
**Validates: Requirements 11.3**

### Property 38: Reduced motion preference

_For any_ component with animations, when prefers-reduced-motion is enabled, animations should be disabled or replaced with instant transitions.
**Validates: Requirements 11.4**

### Property 39: Image alt text completeness

_For any_ image element rendered by the system, the alt attribute should be present and contain descriptive text.
**Validates: Requirements 11.5**

### Property 40: Next.js Image optimization

_For any_ image served by the portfolio, it should be rendered using the Next.js Image component with automatic format optimization.
**Validates: Requirements 12.4**

## Error Handling

### Client-Side Error Handling

**Terminal Mode Errors:**

- Command not found: Display error with suggestions for similar commands
- Command execution failure: Show error message with retry option
- Network errors: Display connection error with retry button
- Validation errors: Show inline error messages with correction hints

**GUI Mode Errors:**

- Data loading failures: Display error boundary with reload option
- Form validation errors: Show inline validation messages
- Network errors: Toast notifications with retry actions
- Image loading failures: Display placeholder with retry option

**Error Boundary Implementation:**

```typescript
interface ErrorBoundaryProps {
  fallback: (error: Error, reset: () => void) => React.ReactNode;
  children: React.ReactNode;
}

// Wrap each major section with error boundaries
// Log errors to Sentry for monitoring
```

### Server-Side Error Handling

**API Route Error Responses:**

```typescript
interface APIError {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Standard error responses:
// 400 - Bad Request (validation errors)
// 401 - Unauthorized (auth required)
// 403 - Forbidden (insufficient permissions)
// 404 - Not Found (resource doesn't exist)
// 429 - Too Many Requests (rate limit exceeded)
// 500 - Internal Server Error (unexpected errors)
```

**Database Error Handling:**

- Connection failures: Retry with exponential backoff
- Query errors: Log error and return generic error message
- Constraint violations: Return specific validation error
- Timeout errors: Return timeout error with retry suggestion

**Authentication Error Handling:**

- Invalid credentials: Return generic "invalid credentials" message (no user enumeration)
- Expired tokens: Return 401 and trigger re-authentication
- Missing tokens: Return 401 and redirect to login
- Rate limit exceeded: Return 429 with retry-after header

### Error Logging and Monitoring

**Sentry Integration:**

- Capture all unhandled exceptions
- Log API errors with context (user ID, request details)
- Track error frequency and patterns
- Set up alerts for critical errors

**Error Context:**

```typescript
interface ErrorContext {
  userId?: string;
  sessionId: string;
  route: string;
  userAgent: string;
  timestamp: Date;
  additionalData?: Record<string, any>;
}
```

## Testing Strategy

### Unit Testing

**Framework:** Vitest with React Testing Library

**Unit Test Coverage:**

- Command parser logic (parsing, validation, flag extraction)
- Command executor functions (each command implementation)
- Form validation functions (email, message, required fields)
- Data transformation utilities (formatting, filtering, sorting)
- Authentication utilities (token generation, validation)
- Rate limiting logic
- Audit logging functions

**Example Unit Tests:**

```typescript
describe("CommandParser", () => {
  it("should parse command with flags", () => {
    const result = parser.parse("skills --frontend --level high");
    expect(result.command).toBe("skills");
    expect(result.flags).toEqual({ frontend: true, level: "high" });
  });

  it("should handle invalid commands", () => {
    const result = parser.parse("invalidcmd");
    expect(result.error).toBeDefined();
  });
});

describe("ContactForm validation", () => {
  it("should reject invalid email formats", () => {
    expect(validateEmail("notanemail")).toBe(false);
    expect(validateEmail("test@example.com")).toBe(true);
  });

  it("should reject empty messages", () => {
    expect(validateMessage("")).toBe(false);
    expect(validateMessage("   ")).toBe(false);
    expect(validateMessage("Hello")).toBe(true);
  });
});
```

### Property-Based Testing

**Framework:** fast-check (JavaScript/TypeScript property-based testing library)

**Configuration:**

- Minimum 100 iterations per property test
- Use seed for reproducible failures
- Configure shrinking for minimal failing examples

**Property Test Implementation:**
Each property-based test must:

1. Be tagged with a comment referencing the design document property
2. Generate appropriate random inputs using fast-check arbitraries
3. Execute the system under test with generated inputs
4. Assert the property holds for all inputs

**Example Property Tests:**

```typescript
import fc from "fast-check";

/**
 * Feature: terminal-portfolio, Property 7: Visibility filtering
 * For any set of sections with mixed is_visible values, only sections
 * where is_visible equals true should be displayed to unauthenticated visitors.
 */
describe("Property 7: Visibility filtering", () => {
  it("should only return visible sections to unauthenticated users", () => {
    fc.assert(
      fc.property(
        fc.array(sectionArbitrary()), // Generate random sections
        (sections) => {
          const result = filterSectionsForVisitor(sections);
          // All returned sections must have is_visible = true
          expect(result.every((s) => s.isVisible)).toBe(true);
          // All visible sections must be in result
          const visibleSections = sections.filter((s) => s.isVisible);
          expect(result.length).toBe(visibleSections.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: terminal-portfolio, Property 15: Message field validation
 * For any message string composed entirely of whitespace or empty,
 * the contact form should reject the submission.
 */
describe("Property 15: Message field validation", () => {
  it("should reject whitespace-only messages", () => {
    fc.assert(
      fc.property(fc.stringOf(fc.constantFrom(" ", "\t", "\n", "\r")), (whitespaceMessage) => {
        const result = validateContactForm({
          name: "Test",
          email: "test@example.com",
          message: whitespaceMessage,
        });
        expect(result.valid).toBe(false);
        expect(result.errors.message).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: terminal-portfolio, Property 6: Experience chronological ordering
 * For any set of experience entries, the experience command should display
 * them ordered by start_date in descending order.
 */
describe("Property 6: Experience chronological ordering", () => {
  it("should order experiences by start date descending", () => {
    fc.assert(
      fc.property(fc.array(experienceArbitrary(), { minLength: 2 }), (experiences) => {
        const result = formatExperienceOutput(experiences);
        const dates = result.map((e) => e.startDate.getTime());
        // Check that dates are in descending order
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
        }
      }),
      { numRuns: 100 }
    );
  });
});
```

**Custom Arbitraries:**

```typescript
// Generate random sections
const sectionArbitrary = () =>
  fc.record({
    id: fc.uuid(),
    type: fc.constantFrom("skill", "experience", "project", "certification", "achievement"),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    description: fc.string(),
    isVisible: fc.boolean(),
    isFeatured: fc.boolean(),
    displayOrder: fc.integer({ min: 0, max: 1000 }),
    metadata: fc.jsonValue(),
  });

// Generate random experience entries
const experienceArbitrary = () =>
  fc.record({
    id: fc.uuid(),
    title: fc.string({ minLength: 1 }),
    company: fc.string({ minLength: 1 }),
    startDate: fc.date(),
    endDate: fc.option(fc.date()),
    description: fc.string(),
  });

// Generate random email addresses
const emailArbitrary = () => fc.emailAddress();

// Generate random valid commands
const validCommandArbitrary = () =>
  fc.constantFrom(
    "help",
    "about",
    "skills",
    "experience",
    "projects",
    "certifications",
    "contact",
    "resume",
    "clear",
    "history",
    "stats",
    "gui"
  );
```

### Integration Testing

**Scope:**

- API route handlers with database interactions
- Authentication flow (login, logout, session management)
- Contact form submission with email sending
- Resume PDF generation
- Admin CRUD operations with audit logging

**Test Database:**

- Use Supabase local development instance
- Reset database state between tests
- Seed with test data

**Example Integration Tests:**

```typescript
describe("Admin Section CRUD", () => {
  it("should create section and log audit entry", async () => {
    const section = await createSection(adminUser, sectionData);
    expect(section.id).toBeDefined();

    const auditLog = await getLatestAuditLog();
    expect(auditLog.action).toBe("create");
    expect(auditLog.tableName).toBe("sections");
    expect(auditLog.recordId).toBe(section.id);
  });
});

describe("Contact Form API", () => {
  it("should enforce rate limiting", async () => {
    const formData = { name: "Test", email: "test@example.com", message: "Hello" };

    // Submit 3 times (should succeed)
    for (let i = 0; i < 3; i++) {
      const response = await submitContactForm(formData);
      expect(response.status).toBe(200);
    }

    // 4th submission should be rate limited
    const response = await submitContactForm(formData);
    expect(response.status).toBe(429);
  });
});
```

### End-to-End Testing

**Framework:** Playwright

**Test Scenarios:**

- Visitor explores portfolio in terminal mode
- Visitor switches between terminal and GUI modes
- Visitor submits contact form
- Visitor downloads resume
- Admin logs in and manages content
- Admin views analytics dashboard

**Example E2E Test:**

```typescript
test("visitor can explore portfolio via terminal", async ({ page }) => {
  await page.goto("/");

  // Type help command
  await page.locator('input[type="text"]').fill("help");
  await page.keyboard.press("Enter");
  await expect(page.locator("text=Available commands")).toBeVisible();

  // Type skills command
  await page.locator('input[type="text"]').fill("skills");
  await page.keyboard.press("Enter");
  await expect(page.locator("text=Frontend")).toBeVisible();

  // Switch to GUI mode
  await page.locator('input[type="text"]').fill("gui");
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-testid="gui-hero"]')).toBeVisible();
});
```

### Test Coverage Goals

- Unit test coverage: 80%+ for utility functions and business logic
- Property test coverage: All 40 correctness properties implemented
- Integration test coverage: All API routes and server actions
- E2E test coverage: Critical user journeys (terminal exploration, admin CRUD)

## Security Considerations

### Authentication and Authorization

**JWT Implementation:**

- Use HS256 algorithm with strong secret (minimum 256 bits)
- Set appropriate expiration (30 minutes for access tokens)
- Store in httpOnly, secure, sameSite=strict cookies
- Implement token refresh mechanism

**Password Security:**

- Hash passwords with bcrypt (cost factor 12)
- Enforce minimum password requirements (12 characters, mixed case, numbers, symbols)
- Implement password reset flow with time-limited tokens
- Consider 2FA with TOTP for additional security

**Row-Level Security (RLS) Policies:**

```sql
-- Public read access to visible sections
CREATE POLICY "Public sections read" ON sections
  FOR SELECT TO anon
  USING (is_visible = true);

-- Admin full access
CREATE POLICY "Admin full access" ON sections
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Audit logs admin read-only
CREATE POLICY "Admin audit logs read" ON audit_logs
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
```

### Input Validation and Sanitization

**Server-Side Validation:**

- Validate all inputs against schemas (use Zod)
- Sanitize HTML inputs to prevent XSS
- Validate file uploads (type, size, content)
- Reject malformed JSON

**SQL Injection Prevention:**

- Use parameterized queries (Supabase client handles this)
- Never concatenate user input into SQL strings
- Validate UUIDs before using in queries

### Rate Limiting

**Implementation Strategy:**

- Use Vercel Edge Config or Upstash Redis for distributed rate limiting
- Apply different limits per endpoint:
  - Login: 5 attempts per 15 minutes per IP
  - Contact form: 3 submissions per hour per IP
  - API reads: 100 requests per minute per IP
  - API writes: 20 requests per minute per authenticated user

**Rate Limit Headers:**

```typescript
{
  'X-RateLimit-Limit': '100',
  'X-RateLimit-Remaining': '95',
  'X-RateLimit-Reset': '1640000000',
  'Retry-After': '60' // Only on 429 responses
}
```

### CSRF Protection

- Use Next.js built-in CSRF protection for Server Actions
- Verify origin header matches expected domain
- Use SameSite=strict cookies
- Implement CSRF tokens for form submissions

### Content Security Policy

```typescript
const csp = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Next.js requires unsafe-eval in dev
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https://your-supabase-project.supabase.co"],
  "font-src": ["'self'"],
  "connect-src": ["'self'", "https://your-supabase-project.supabase.co"],
  "frame-ancestors": ["'none'"],
};
```

### Data Privacy

- No tracking cookies without consent
- Anonymize analytics data
- No personal data in logs
- Implement data retention policies for audit logs
- GDPR compliance for contact form (privacy policy link)

## Performance Optimization

### Client-Side Optimization

**Code Splitting:**

- Lazy load GUI mode components
- Lazy load admin portal components
- Dynamic imports for heavy libraries (PDF generation, Framer Motion)

**Image Optimization:**

- Use Next.js Image component with automatic optimization
- Serve WebP/AVIF formats with fallbacks
- Implement lazy loading for below-fold images
- Use appropriate sizes and srcset

**Bundle Optimization:**

- Tree-shake unused code
- Minimize third-party dependencies
- Use dynamic imports for route-specific code
- Analyze bundle with @next/bundle-analyzer

### Server-Side Optimization

**Caching Strategy:**

- ISR for public pages (revalidate: 3600 seconds)
- SWR for client-side data fetching with stale-while-revalidate
- Cache API responses with appropriate headers
- Use Vercel Edge Caching for static assets

**Database Optimization:**

- Create indexes on frequently queried columns (type, display_order, is_visible)
- Use connection pooling (Supabase handles this)
- Optimize queries to fetch only needed fields
- Use database views for complex queries

**API Optimization:**

- Implement response compression (gzip/brotli)
- Use HTTP/2 for multiplexing
- Minimize API payload sizes
- Batch related queries

### Monitoring and Metrics

**Core Web Vitals Targets:**

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- FCP (First Contentful Paint): < 1.5s
- TTI (Time to Interactive): < 3.0s

**Performance Monitoring:**

- Vercel Analytics for Core Web Vitals
- Sentry Performance Monitoring for API response times
- Custom metrics for terminal command execution time
- Database query performance monitoring

## Deployment Architecture

### Vercel Configuration

**Environment Variables:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Authentication
JWT_SECRET=xxx
NEXTAUTH_URL=https://yourportfolio.com
NEXTAUTH_SECRET=xxx

# Email
RESEND_API_KEY=re_xxx

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Analytics (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourportfolio.com
```

**Build Configuration:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "nodeVersion": "20.x"
}
```

### Database Migration Strategy

**Initial Setup:**

1. Create Supabase project
2. Run SQL migrations for table creation
3. Set up RLS policies
4. Create initial admin user
5. Seed with initial settings

**Migration Process:**

1. Write migration SQL files
2. Test in local Supabase instance
3. Apply to staging environment
4. Verify data integrity
5. Apply to production
6. Monitor for errors

### Continuous Integration/Deployment

**CI/CD Pipeline:**

1. Push to GitHub
2. Vercel automatically builds preview deployment
3. Run tests (unit, integration, E2E)
4. Run Lighthouse CI for performance checks
5. If tests pass, deploy to production (main branch)
6. Run smoke tests on production

**Rollback Strategy:**

- Vercel instant rollback to previous deployment
- Database migrations include rollback scripts
- Monitor error rates after deployment
- Automated rollback if error rate exceeds threshold

## Future Enhancements

### Phase 2 Features (Post-MVP)

1. **Blog Section with MDX**
   - MDX file-based blog posts
   - Syntax highlighting with Shiki
   - Tag filtering and search
   - RSS feed generation

2. **Advanced Analytics**
   - Visitor heatmaps
   - Command usage patterns
   - Session recordings (privacy-friendly)
   - Conversion tracking

3. **AI Chat Assistant**
   - Floating chat widget
   - GPT-4o-mini integration
   - Context-aware responses about portfolio
   - Command suggestions

4. **Enhanced Gamification**
   - Visitor achievements (easter eggs)
   - Unlockable badges
   - Interactive skill tree
   - Progress tracking

5. **Internationalization**
   - Multi-language support
   - Translated commands
   - Locale-specific content

6. **API Access**
   - Public API for portfolio data
   - Rate-limited endpoints
   - API documentation
   - Developer portal

### Technical Debt and Improvements

- Implement comprehensive E2E test suite
- Add performance budgets to CI/CD
- Implement A/B testing framework
- Add feature flags system
- Improve error recovery mechanisms
- Implement offline support with service workers
- Add progressive web app (PWA) capabilities

## Conclusion

This design document provides a comprehensive blueprint for Hassan's Terminal Portfolio. The architecture leverages modern web technologies (Next.js 15, Supabase, Vercel) to deliver a performant, secure, and engaging portfolio experience. The dual-mode interface (terminal and GUI) provides accessibility while maintaining a unique developer-focused aesthetic.

The implementation will follow a phased approach, starting with core terminal functionality, then adding database integration, admin portal, GUI mode, and finally advanced features. Each phase builds incrementally on the previous, ensuring a working product at each stage.

The correctness properties defined in this document will guide property-based testing to ensure the system behaves correctly across all inputs and edge cases. Combined with unit tests, integration tests, and E2E tests, this provides comprehensive quality assurance.

Security, performance, and accessibility are first-class concerns throughout the design, ensuring the portfolio is not only impressive but also production-ready and maintainable.
