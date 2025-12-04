# Configuration Checklist

This guide covers everything you need to configure before deploying your Terminal Portfolio.

## 📋 Quick Status Check

Run this command to see what's configured:
```bash
cat .env.local 2>/dev/null || echo "⚠️  .env.local not found - needs setup"
```

---

## 🔧 Required Configuration

### 1. ✅ Basic Setup (Already Done)
- [x] Next.js project initialized
- [x] Dependencies installed
- [x] Terminal interface working
- [x] SEO metadata configured

### 2. 🗄️ Supabase Database (Required for Dynamic Content)

**Status:** Code ready, needs configuration

**What it does:** Stores your portfolio data (skills, experience, projects, etc.)

**Setup Steps:**

1. **Create Supabase Project** (5 minutes)
   - Go to https://supabase.com
   - Sign up/login
   - Click "New Project"
   - Choose a name and password
   - Wait for provisioning

2. **Get API Keys**
   - Go to Settings → API
   - Copy these values:
     - Project URL
     - `anon` public key
     - `service_role` key (keep secret!)

3. **Configure Environment Variables**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Edit .env.local and add:
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

4. **Run Database Migrations**
   - Open Supabase Dashboard → SQL Editor
   - Run these files in order:
     1. `lib/supabase/migrations/001_initial_schema.sql`
     2. `lib/supabase/migrations/002_rls_policies.sql`
     3. `lib/supabase/migrations/003_seed_data.sql`

5. **Customize Your Data**
   - Edit `003_seed_data.sql` with your own:
     - Skills and proficiency levels
     - Work experience
     - Projects and links
     - Certifications
   - Re-run the seed migration

**Documentation:** See `SUPABASE_SETUP_COMPLETE.md` for detailed guide

---

### 3. 📧 Resend Email API (Required for Contact Form)

**Status:** Code ready, needs configuration

**What it does:** Sends emails when visitors use the contact form

**Setup Steps:**

1. **Create Resend Account** (2 minutes)
   - Go to https://resend.com
   - Sign up for free account
   - Verify your email

2. **Get API Key**
   - Go to API Keys section
   - Click "Create API Key"
   - Copy the key

3. **Configure Environment Variables**
   ```bash
   # Add to .env.local:
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   CONTACT_EMAIL_TO=your_email@example.com
   CONTACT_EMAIL_FROM=noreply@yourdomain.com
   ```

4. **Verify Domain (Optional but Recommended)**
   - For production, verify your domain in Resend
   - This improves email deliverability
   - Follow Resend's domain verification guide

**Documentation:** See `CONTACT_FORM_SETUP.md` for details

---

### 4. 🌐 SEO Configuration (Partially Done)

**Status:** Metadata configured, needs customization

**What to update:**

1. **Site URL** (for production)
   ```bash
   # In .env.local (or Vercel environment variables):
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

2. **Replace Placeholder Images**
   - `public/favicon.ico` - Create 16x16, 32x32, 48x48 ICO file
   - `public/apple-icon.png` - Create 180x180 PNG
   - `public/og-image.png` - Create 1200x630 PNG (for social sharing)
   
   **Tools:**
   - Favicon: https://realfavicongenerator.net/
   - OG Image: https://www.opengraph.xyz/

3. **Update Metadata** (in `app/layout.tsx`)
   - Update author name
   - Update description
   - Add social media links in `components/shared/StructuredData.tsx`

**Documentation:** See `SEO_IMPLEMENTATION.md` for details

---

## 🚀 Deployment Configuration

### Vercel Deployment

**Prerequisites:**
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier works)

**Steps:**

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your Git repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables in Vercel**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `RESEND_API_KEY`
     - `CONTACT_EMAIL_TO`
     - `CONTACT_EMAIL_FROM`
     - `NEXT_PUBLIC_SITE_URL` (use your Vercel URL)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your live site!

**Documentation:** See `DEPLOYMENT.md` for detailed guide

---

## 🎯 Optional Configuration

### 1. Custom Domain
- Add in Vercel Settings → Domains
- Configure DNS records
- Update `NEXT_PUBLIC_SITE_URL`

### 2. Sentry Error Tracking (Phase 4)
```bash
# Add to .env.local:
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

### 3. Analytics
- Enable Vercel Analytics in dashboard
- Or integrate Google Analytics 4

---

## ✅ Verification Checklist

After configuration, verify everything works:

### Local Development
```bash
npm run dev
```

- [ ] Terminal loads without errors
- [ ] Type `help` - shows all commands
- [ ] Type `about` - shows your bio
- [ ] Type `skills` - shows skills from database
- [ ] Type `experience` - shows work history
- [ ] Type `projects` - shows projects
- [ ] Type `contact` - shows contact form
- [ ] Submit contact form - receives email
- [ ] Type `resume` - downloads PDF
- [ ] Arrow keys navigate command history
- [ ] Tab key autocompletes commands
- [ ] Theme switching works (`theme cyberpunk`)

### Production Deployment
- [ ] Build completes successfully
- [ ] Site loads at Vercel URL
- [ ] All terminal commands work
- [ ] Contact form sends emails
- [ ] Resume downloads correctly
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] Lighthouse scores 95+ (Performance, Accessibility, SEO)

---

## 🆘 Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` exists with Supabase credentials
- Restart dev server after adding variables
- For Vercel: Add variables in dashboard

### "Email service not configured"
- Add `RESEND_API_KEY` to `.env.local`
- Restart dev server
- Verify API key is valid in Resend dashboard

### Build fails on Vercel
- Check build logs for specific errors
- Ensure all environment variables are set
- Run `npm run build` locally to test

### Contact form rate limiting
- Default: 3 submissions per hour per IP
- For testing: restart dev server to reset
- For production: consider Redis-based rate limiting

---

## 📚 Documentation Reference

- **Supabase Setup:** `SUPABASE_SETUP_COMPLETE.md`
- **Contact Form:** `CONTACT_FORM_SETUP.md`
- **SEO:** `SEO_IMPLEMENTATION.md`
- **Deployment:** `DEPLOYMENT.md`
- **Quick Deploy:** `QUICK_DEPLOY.md`

---

## 🎯 Minimum Viable Configuration

To get a working site deployed quickly:

1. **Skip Supabase** (use static data temporarily)
   - Comment out Supabase imports in API routes
   - Use hardcoded data in commands

2. **Skip Contact Form** (add later)
   - Contact command can just show email/social links

3. **Deploy to Vercel**
   - Only need `NEXT_PUBLIC_SITE_URL`
   - Everything else works with static data

4. **Add Dynamic Features Later**
   - Set up Supabase when ready
   - Add Resend when you want contact form

---

## 📞 Need Help?

- **Supabase Issues:** https://supabase.com/docs
- **Resend Issues:** https://resend.com/docs
- **Vercel Issues:** https://vercel.com/docs
- **Next.js Issues:** https://nextjs.org/docs

---

## 🎉 Quick Start (Minimal Setup)

Want to deploy NOW without full configuration?

```bash
# 1. Create .env.local with just the site URL
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" > .env.local

# 2. Push to Git
git add .
git commit -m "Initial deployment"
git push origin main

# 3. Import to Vercel
# - Go to vercel.com/dashboard
# - Import your repo
# - Deploy!

# 4. Update site URL in Vercel
# - Settings → Environment Variables
# - Add: NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
# - Redeploy
```

Your terminal portfolio will work with static data. Add Supabase and Resend later when you're ready for dynamic content and contact form!
