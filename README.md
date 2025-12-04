# Hassan's Terminal Portfolio

An interactive terminal-based portfolio website built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🖥️ Terminal Mode: Command-line interface for exploring portfolio content
- 🎮 GUI Mode: Gamified visual interface (coming soon)
- 🔐 Admin Portal: Content management system (coming soon)
- 📱 Responsive Design: Optimized for all devices
- ♿ Accessible: WCAG compliant with keyboard navigation
- ⚡ Performance: Optimized with Next.js 15 and Turbopack

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Data Fetching:** SWR
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run verify-deployment` - Verify project is ready for deployment

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── terminal/       # Terminal mode components
│   ├── gui/           # GUI mode components
│   └── shared/        # Shared components
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
└── .kiro/specs/       # Feature specifications
```

## Development Workflow

This project follows a spec-driven development approach. See `.kiro/specs/terminal-portfolio/` for:

- `requirements.md` - Feature requirements
- `design.md` - Technical design
- `tasks.md` - Implementation tasks

## Deployment

This project is configured for deployment on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy

1. Verify your project is ready:
   ```bash
   npm run verify-deployment
   ```

2. Deploy to Vercel:
   ```bash
   npx vercel --prod
   ```

Or use the Vercel Dashboard to import your Git repository.

## License

ISC
