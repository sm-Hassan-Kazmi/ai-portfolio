# Database Migrations

This directory contains SQL migration files for the Hassan's Terminal Portfolio database schema.

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended for initial setup)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of each migration file in order
4. Execute the SQL

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: Manual Execution

You can also execute these migrations using any PostgreSQL client connected to your Supabase database.

## Migration Files

- `001_initial_schema.sql` - Creates the core tables (sections, settings, users, audit_logs, analytics_events)
- `002_rls_policies.sql` - Sets up Row-Level Security policies
- `003_seed_data.sql` - Seeds initial data (settings and sample content)

## Migration Order

Always run migrations in numerical order:
1. 001_initial_schema.sql
2. 002_rls_policies.sql
3. 003_seed_data.sql

## Rollback

If you need to rollback a migration, you can drop the tables:

```sql
-- WARNING: This will delete all data!
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
```

## Verifying Migrations

After running migrations, verify the schema:

```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```
