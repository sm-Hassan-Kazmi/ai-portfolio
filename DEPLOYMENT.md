# Deployment Guide - Vercel

This guide walks you through deploying Hassan's Terminal Portfolio to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier is sufficient for MVP)
- Git repository pushed to GitHub, GitLab, or Bitbucket
- Node.js 18+ installed locally

## Deployment Steps

### 1. Prepare Your Repository

Ensure all changes are committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Vercel will automatically detect Next.js configuration

#### Option B: Using Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from project root:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **ai-portfolio** (or your preferred name)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

### 3. Configure Environment Variables

Currently, the MVP doesn't require any environment variables. For future phases:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add variables as needed (see `.env.example` for reference)

### 4. Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### 5. Deploy

#### Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every push to other branches and pull requests

#### Manual Deployment

Using Vercel CLI:
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 6. Verify Deployment

After deployment completes:

1. Visit your deployment URL (e.g., `https://your-project.vercel.app`)
2. Test terminal functionality:
   - Type `help` to see available commands
   - Try `about`, `skills`, `experience`, `projects`
   - Test command history with arrow keys
   - Test tab autocomplete
   - Test theme switching with `theme cyberpunk`
   - Test `clear` command

### 7. Custom Domain (Optional)

To add a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain
3. Configure DNS records as instructed by Vercel
4. Wait for DNS propagation (can take up to 48 hours)

## Performance Verification

After deployment, run performance checks:

### Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

**Target Scores (Requirements 12.1, 12.2):**
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### Vercel Analytics

Enable Vercel Analytics for real-time performance monitoring:

1. Go to **Analytics** tab in Vercel Dashboard
2. Enable Web Analytics
3. Monitor Core Web Vitals:
   - First Contentful Paint (FCP) < 1.5s
   - Time to Interactive (TTI) < 3s
   - Largest Contentful Paint (LCP) < 2.5s

## Troubleshooting

### Build Failures

**Issue:** Build fails with TypeScript errors
```bash
# Run type check locally
npm run type-check
```

**Issue:** Build fails with ESLint errors
```bash
# Run lint locally
npm run lint
```

### Runtime Errors

**Issue:** 404 errors on routes
- Verify file structure in `app/` directory
- Check Next.js App Router conventions

**Issue:** Styling not applied
- Verify Tailwind CSS configuration
- Check `globals.css` imports

### Performance Issues

**Issue:** Slow initial load
- Check bundle size in build output
- Verify code splitting is working
- Use Next.js Image component for images

## Deployment Checklist

- [ ] All code committed and pushed to Git
- [ ] Project imported to Vercel
- [ ] Build completes successfully
- [ ] Deployment URL accessible
- [ ] Terminal interface loads correctly
- [ ] All commands work (`help`, `about`, `skills`, etc.)
- [ ] Command history navigation works (arrow keys)
- [ ] Tab autocomplete works
- [ ] Theme switching works
- [ ] Clear command works
- [ ] Mobile responsive design verified
- [ ] Lighthouse scores meet targets (95+)
- [ ] No console errors in browser
- [ ] Custom domain configured (if applicable)

## Next Steps

After successful MVP deployment:

1. **Phase 2:** Set up Supabase backend and dynamic content
2. **Phase 3:** Implement contact form and resume generation
3. **Phase 4:** Add GUI mode and admin portal
4. **Phase 5:** Optimize performance and accessibility

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## Environment Variables for Future Phases

Reference for upcoming phases (see `.env.example`):

### Phase 2: Database Integration
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Phase 3: Contact Form
- `RESEND_API_KEY`

### Phase 4: Error Tracking
- `SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
