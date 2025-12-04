# Components Directory

This directory contains all React components for the portfolio application.

## Structure

- `terminal/` - Terminal mode components (TerminalContainer, CommandParser, etc.)
- `gui/` - GUI mode components (HeroSection, SkillsLab, ProjectsGallery, etc.)
- `shared/` - Shared components used across both modes (ContactForm, ThemeProvider, etc.)

## Naming Conventions

- Use PascalCase for component files (e.g., `TerminalContainer.tsx`)
- Use kebab-case for utility/helper files (e.g., `command-parser.ts`)
- Export components as named exports when possible

## Accessibility Guidelines

### Images
All images MUST have descriptive alt text. Use the `AccessibleImage` component from `shared/AccessibleImage.tsx` which:
- Enforces alt text requirement
- Uses Next.js Image component for optimization
- Provides console warnings if alt text is missing

For dynamically loaded images from the database:
- Use `generateAltText()` from `lib/utils/image-alt-text.ts` to create descriptive alt text
- Alt text should describe the image content, not just repeat the title
- Example: "Screenshot of Task Manager project" not just "Task Manager"

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Use semantic HTML elements (button, a, input, etc.)
- Ensure focus indicators are visible (handled globally in globals.css)

### Screen Readers
- Use ARIA labels for complex interactions
- Add aria-live regions for dynamic content
- Use semantic HTML (main, nav, article, section, etc.)
