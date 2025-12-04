# 🚀 Quick Start Guide

Get your Terminal Portfolio deployed in 10 minutes!

## Option 1: Deploy Now (Static Data)

**Fastest way to get online - no API keys needed!**

```bash
# 1. Create minimal .env.local
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" > .env.local

# 2. Test locally
npm run dev
# Visit http://localhost:3000

# 3. Push to Git
git add .
git commit -m "Ready for deployment"
git push origin main

# 4. Deploy to Vercel
# - Go to https://vercel.com/dashboard
# - Click "Add New..." → "Project"
# - Import your Git repository
# - Click "Deploy"

# 5. Update site URL
# - In Vercel: Settings → Environment Variables
# - Add: NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
# - Redeploy
```

**What works:** Terminal interface, all commands (with static data), theme switching, command history

**What doesn't work yet:** Dynamic content from database, contact form emails

---

## Option 2: Full Setup (Dynamic Content)

**Complete setup with database and email - takes 20 minutes**

### Step 1: Supabase (10 min)

```bash
# 1. Create account at https://supabase.com
# 2. Create new project
# 3. Get API keys from Settings → API
# 4. Add to .env.local:

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

```bash
# 5. Run migrations in Supabase SQL Editor:
# - lib/supabase/migrations/001_initial_schema.sql
# - lib/supabase/migrations/002_rls_policies.sql
# - lib/supabase/migrations/003_seed_data.sql
```

### Step 2: Resend Email (5 min)

```bash
# 1. Create account at https://resend.com
# 2. Get API key from dashboard
# 3. Add to .env.local:

RESEND_API_KEY=re_xxxxx
CONTACT_EMAIL_TO=your_email@example.com
CONTACT_EMAIL_FROM=noreply@yourdomain.com
```

### Step 3: Deploy (5 min)

```bash
# 1. Test locally
npm run dev

# 2. Push to Git
git add .
git commit -m "Full setup complete"
git push origin main

# 3. Deploy to Vercel
# - Import repository
# - Add ALL environment variables from .env.local
# - Deploy
```

**What works:** Everything! Dynamic content, contact form, resume generation, full functionality

---

## 🎯 What You Get

### Terminal Commands
- `help` - Show all commands
- `about` - Your bio
- `skills` - Your skills (with filters: --frontend, --backend, --tools)
- `experience` - Work history
- `projects` - Your projects (--featured for featured only)
- `certifications` - Certifications and achievements
- `contact` - Contact form
- `resume` - Download PDF resume
- `theme [name]` - Switch themes (cyberpunk, matrix, dracula)
- `clear` - Clear terminal
- `history` - Command history
- `stats` - Portfolio statistics

### Features
- ⌨️ Command history (arrow keys)
- ⭐ Tab autocomplete
- 🎨 Multiple themes
- 📱 Mobile responsive
- ♿ Fully accessible
- 🚀 Optimized performance
- 🔍 SEO ready

---

## 📝 Customization

### Update Your Content

**Option A: Edit Seed Data (Supabase)**
1. Edit `lib/supabase/migrations/003_seed_data.sql`
2. Update skills, experience, projects, certifications
3. Re-run the migration in Supabase SQL Editor

**Option B: Use Supabase Dashboard**
1. Go to Supabase Dashboard → Table Editor
2. Edit data directly in the UI
3. Changes appear immediately

### Update SEO

1. Edit `app/layout.tsx` - Update metadata
2. Edit `components/shared/StructuredData.tsx` - Add social links
3. Replace images in `public/`:
   - `favicon.ico`
   - `apple-icon.png`
   - `og-image.png`

---

## 🔍 Verification

After deployment, test these:

```bash
# Terminal functionality
✓ Type 'help' - shows commands
✓ Type 'about' - shows bio
✓ Type 'skills' - shows skills
✓ Arrow keys - navigate history
✓ Tab key - autocomplete
✓ Type 'theme cyberpunk' - changes theme

# Contact form (if configured)
✓ Type 'contact' - shows form
✓ Submit form - receives email

# Performance
✓ Run Lighthouse audit - 95+ scores
✓ Check mobile responsiveness
✓ Test on different browsers
```

---

## 🆘 Common Issues

### "Missing Supabase environment variables"
```bash
# Solution: Add to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Then restart dev server
npm run dev
```

### "Email service not configured"
```bash
# Solution: Add to .env.local
RESEND_API_KEY=your_key
CONTACT_EMAIL_TO=your_email@example.com
CONTACT_EMAIL_FROM=noreply@yourdomain.com

# Then restart dev server
npm run dev
```

### Build fails on Vercel
1. Check build logs for specific error
2. Ensure all environment variables are set in Vercel
3. Test build locally: `npm run build`

---

## 📚 Full Documentation

- **Configuration:** `CONFIGURATION_CHECKLIST.md`
- **Supabase:** `SUPABASE_SETUP_COMPLETE.md`
- **Contact Form:** `CONTACT_FORM_SETUP.md`
- **SEO:** `SEO_IMPLEMENTATION.md`
- **Deployment:** `DEPLOYMENT.md`

---

## 🎉 You're Done!

Your terminal portfolio is now live! Share your URL and impress visitors with your interactive command-line interface.

**Next Steps:**
1. Customize your content
2. Add your own projects and skills
3. Update SEO metadata
4. Share on social media
5. Add to your resume/LinkedIn

**Need help?** Check the documentation files or open an issue on GitHub.

---

## 💡 Pro Tips

1. **Test locally first** - Always run `npm run dev` before deploying
2. **Use environment variables** - Never commit API keys to Git
3. **Monitor performance** - Use Vercel Analytics
4. **Update regularly** - Keep your portfolio current
5. **Backup your data** - Export Supabase data periodically

Happy coding! 🚀
