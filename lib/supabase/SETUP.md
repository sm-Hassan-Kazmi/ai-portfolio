# Supabase Setup Guide

This guide will walk you through setting up Supabase for Hassan's Terminal Portfolio.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- The Supabase client library installed (`@supabase/supabase-js`)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `hassan-portfolio` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
4. Click "Create new project"
5. Wait for the project to be provisioned (this takes 1-2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll need three values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (this is safe to use in the browser)
   - **service_role key**: `eyJhbGc...` (keep this secret! server-side only)

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...
   ```

3. **Important**: Never commit `.env.local` to version control!

## Step 4: Run Database Migrations

You have three options to run the migrations:

### Option A: Using Supabase Dashboard (Recommended for First-Time Setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of each migration file in order:
   - `lib/supabase/migrations/001_initial_schema.sql`
   - `lib/supabase/migrations/002_rls_policies.sql`
   - `lib/supabase/migrations/003_seed_data.sql`
5. Click **Run** for each migration
6. Verify there are no errors in the output

### Option B: Using Supabase CLI

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link to your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Settings → General → Reference ID)

3. Run migrations:
   ```bash
   supabase db push
   ```

### Option C: Using a PostgreSQL Client

If you prefer using a PostgreSQL client like pgAdmin or DBeaver:

1. Get your database connection string from **Settings** → **Database**
2. Connect using the connection string
3. Execute each migration file in order

## Step 5: Verify the Setup

### Check Tables

Run this query in the SQL Editor to verify all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- `analytics_events`
- `audit_logs`
- `sections`
- `settings`
- `users`

### Check Row-Level Security

Verify RLS is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

### Check Seed Data

Verify data was seeded correctly:

```sql
-- Check sections by type
SELECT type, COUNT(*) as count 
FROM sections 
GROUP BY type 
ORDER BY type;

-- Check settings
SELECT key FROM settings;
```

Expected results:
- Skills: 24 rows
- Experience: 4 rows
- Projects: 7 rows
- Certifications: 6 rows
- Settings: 4 rows

## Step 6: Test the Connection

Run the RLS test script to verify everything is working:

```bash
npm run test:rls
```

Or manually test by running:

```bash
node --loader ts-node/esm lib/supabase/test-rls.ts
```

You should see output indicating:
- ✅ Public can read visible sections
- ✅ Public cannot read hidden sections
- ✅ Public can read settings
- ✅ Public cannot insert sections
- ✅ Admin can read all sections
- ✅ Public can insert analytics events

## Step 7: Start Your Application

Now you can start your Next.js application:

```bash
npm run dev
```

Visit http://localhost:3000 and test the terminal commands:
- `skills` - Should display skills from the database
- `experience` - Should display work history
- `projects` - Should display projects
- `certifications` - Should display certifications

## Troubleshooting

### Error: "Missing Supabase environment variables"

- Make sure `.env.local` exists and contains the correct values
- Restart your development server after adding environment variables

### Error: "relation does not exist"

- The migrations haven't been run yet
- Go back to Step 4 and run all migrations in order

### Error: "new row violates row-level security policy"

- RLS policies are working correctly! This means unauthenticated users cannot insert data
- Use the admin client for write operations (see `lib/supabase/client.ts`)

### No data showing in terminal commands

- Check that seed data was inserted: Run the verification queries from Step 5
- Check that `is_visible = true` for the sections you want to display
- Check browser console for any API errors

### Connection timeout or network errors

- Verify your Supabase project is running (check the dashboard)
- Check that your API keys are correct
- Ensure your IP is not blocked (Supabase has IP restrictions in some cases)

## Next Steps

Now that Supabase is set up, you can:

1. **Customize the seed data**: Edit `003_seed_data.sql` with your own information
2. **Create an admin user**: You'll need this for the admin portal (Phase 3)
3. **Set up API routes**: Implement `/api/portfolio` to fetch data from Supabase
4. **Update terminal commands**: Modify commands to fetch from API instead of static data

## Security Best Practices

- ✅ Never commit `.env.local` to version control
- ✅ Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser
- ✅ Always use RLS policies to protect sensitive data
- ✅ Use the anon key for client-side operations
- ✅ Use the service role key only in API routes and server actions
- ✅ Regularly rotate your API keys
- ✅ Monitor your Supabase dashboard for unusual activity

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row-Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Support

If you encounter issues:
1. Check the Supabase dashboard logs
2. Review the browser console for errors
3. Check the Next.js server logs
4. Consult the Supabase documentation
5. Ask for help in the Supabase Discord community
