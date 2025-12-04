# Supabase Quick Start

This is a quick reference guide to get you started with Supabase for Hassan's Terminal Portfolio.

## 🚀 5-Minute Setup

### 1. Create Supabase Project
- Go to https://supabase.com
- Click "New Project"
- Save your database password!

### 2. Get Your Keys
- Go to Settings → API
- Copy your Project URL and anon key

### 3. Configure Environment
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your keys:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 4. Run Migrations
- Open Supabase Dashboard → SQL Editor
- Copy/paste each file in order:
  1. `lib/supabase/migrations/001_initial_schema.sql`
  2. `lib/supabase/migrations/002_rls_policies.sql`
  3. `lib/supabase/migrations/003_seed_data.sql`
- Click "Run" for each

### 5. Test It
```bash
npm run db:test-rls
```

## ✅ What You Get

After setup, your database will have:

- **24 Skills** (React, Next.js, TypeScript, etc.)
- **4 Work Experiences** (with dates and descriptions)
- **7 Projects** (3 featured, 4 regular)
- **6 Certifications** (AWS, Google Cloud, Kubernetes, etc.)
- **4 Settings** (themes, contact info, SEO, feature flags)

All protected by Row-Level Security policies!

## 📝 Next Steps

1. **Customize the data**: Edit `003_seed_data.sql` with your own info
2. **Test the connection**: Run `npm run db:test-rls`
3. **Start building**: Create API routes to fetch data
4. **Update commands**: Modify terminal commands to use Supabase

## 🔗 Important Files

- `lib/supabase/client.ts` - Supabase client instances
- `lib/supabase/types.ts` - TypeScript types
- `lib/supabase/SETUP.md` - Detailed setup guide
- `lib/supabase/README.md` - Complete documentation

## 💡 Quick Examples

### Fetch Skills
```typescript
import { supabase } from '@/lib/supabase';

const { data } = await supabase
  .from('sections')
  .select('*')
  .eq('type', 'skill')
  .eq('is_visible', true);
```

### Fetch Featured Projects
```typescript
const { data } = await supabase
  .from('sections')
  .select('*')
  .eq('type', 'project')
  .eq('is_featured', true);
```

### Get Contact Info
```typescript
const { data } = await supabase
  .from('settings')
  .select('value')
  .eq('key', 'contact_info')
  .single();
```

## 🆘 Troubleshooting

**Error: Missing environment variables**
→ Make sure `.env.local` exists and restart your dev server

**Error: relation does not exist**
→ Run the migrations in the Supabase SQL Editor

**No data showing**
→ Check that seed data was inserted: `SELECT COUNT(*) FROM sections;`

## 📚 Learn More

- Full setup guide: [SETUP.md](./SETUP.md)
- Complete docs: [README.md](./README.md)
- Supabase docs: https://supabase.com/docs
