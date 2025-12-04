# Supabase Integration

This directory contains all Supabase-related code for Hassan's Terminal Portfolio, including database schema, migrations, client utilities, and type definitions.

## Directory Structure

```
lib/supabase/
├── README.md                    # This file
├── SETUP.md                     # Detailed setup instructions
├── client.ts                    # Supabase client instances
├── types.ts                     # TypeScript type definitions
├── index.ts                     # Public exports
├── seed.ts                      # Programmatic database seeding
├── test-rls.ts                  # RLS policy testing script
└── migrations/
    ├── README.md                # Migration instructions
    ├── 001_initial_schema.sql   # Database schema
    ├── 002_rls_policies.sql     # Row-Level Security policies
    └── 003_seed_data.sql        # Initial seed data
```

## Quick Start

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 3. Run Migrations

See [SETUP.md](./SETUP.md) for detailed instructions on running migrations.

### 4. Test the Connection

```bash
npm run db:test-rls
```

## Client Usage

### Client-Side (Browser)

Use the default `supabase` client for client-side operations:

```typescript
import { supabase } from '@/lib/supabase';

// Fetch visible sections
const { data, error } = await supabase
  .from('sections')
  .select('*')
  .eq('is_visible', true);
```

### Server-Side (API Routes, Server Components)

Use `createServerClient()` for server-side operations:

```typescript
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('sections')
    .select('*')
    .eq('is_visible', true);
    
  return Response.json(data);
}
```

### Admin Operations (Bypass RLS)

Use `createAdminClient()` for admin operations that need to bypass RLS:

```typescript
import { createAdminClient } from '@/lib/supabase';

// ⚠️ Only use in secure server-side code!
const adminClient = createAdminClient();

const { data, error } = await adminClient
  .from('sections')
  .select('*'); // Returns all sections, including hidden ones
```

## Database Schema

### Tables

- **sections**: Portfolio content (skills, experience, projects, certifications, achievements)
- **settings**: Global configuration and settings
- **users**: Admin user accounts
- **audit_logs**: Audit trail of administrative actions
- **analytics_events**: Analytics and usage tracking

### Row-Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Public users**: Can read visible sections and settings, can insert analytics events
- **Authenticated users**: Can read their own user data
- **Admin users**: Full access to all tables

See [migrations/002_rls_policies.sql](./migrations/002_rls_policies.sql) for complete policy definitions.

## Type Safety

All database types are defined in `types.ts` and exported through `index.ts`:

```typescript
import type { Section, Setting, SectionMetadata } from '@/lib/supabase';

const section: Section = {
  id: '...',
  type: 'skill',
  title: 'React',
  // ... TypeScript will enforce the correct shape
};
```

## Migrations

Migrations are SQL files that define the database schema and initial data. They should be run in order:

1. `001_initial_schema.sql` - Creates tables and indexes
2. `002_rls_policies.sql` - Sets up Row-Level Security
3. `003_seed_data.sql` - Populates initial data

See [migrations/README.md](./migrations/README.md) for detailed migration instructions.

## Seeding

### Option 1: SQL Migration (Recommended)

Run the `003_seed_data.sql` migration file in the Supabase SQL Editor.

### Option 2: Programmatic Seeding

```bash
npm run db:seed
```

This runs the TypeScript seeding script, but note that it only seeds a subset of data. For complete seeding, use the SQL migration file.

## Testing

### Test RLS Policies

```bash
npm run db:test-rls
```

This script verifies that:
- Public users can read visible sections
- Public users cannot read hidden sections
- Public users cannot insert sections
- Admin users can read all sections
- Analytics events can be inserted by anyone

### Manual Testing

You can also test queries directly in the Supabase SQL Editor or using the Supabase client:

```typescript
import { supabase } from '@/lib/supabase';

// Test public read access
const { data, error } = await supabase
  .from('sections')
  .select('*')
  .eq('type', 'skill');

console.log('Skills:', data);
```

## Common Queries

### Fetch All Visible Skills

```typescript
const { data: skills } = await supabase
  .from('sections')
  .select('*')
  .eq('type', 'skill')
  .eq('is_visible', true)
  .order('display_order');
```

### Fetch Featured Projects

```typescript
const { data: projects } = await supabase
  .from('sections')
  .select('*')
  .eq('type', 'project')
  .eq('is_featured', true)
  .eq('is_visible', true)
  .order('display_order');
```

### Fetch Experience in Chronological Order

```typescript
const { data: experience } = await supabase
  .from('sections')
  .select('*')
  .eq('type', 'experience')
  .eq('is_visible', true)
  .order('start_date', { ascending: false });
```

### Get Settings by Key

```typescript
const { data: setting } = await supabase
  .from('settings')
  .select('value')
  .eq('key', 'contact_info')
  .single();

const contactInfo = setting?.value;
```

### Insert Analytics Event

```typescript
await supabase
  .from('analytics_events')
  .insert({
    event_type: 'command_executed',
    event_data: { command: 'skills', flags: { frontend: true } },
    session_id: sessionId,
  });
```

## Security Best Practices

✅ **DO:**
- Use the anon key for client-side operations
- Use the service role key only in secure server-side code
- Always validate and sanitize user input
- Use RLS policies to protect sensitive data
- Keep environment variables in `.env.local` (never commit!)
- Regularly rotate API keys

❌ **DON'T:**
- Expose the service role key to the browser
- Commit `.env.local` to version control
- Disable RLS without a good reason
- Trust client-side data without validation
- Use the admin client in client-side code

## Troubleshooting

### "Missing Supabase environment variables"

Make sure `.env.local` exists and contains valid Supabase credentials. Restart your dev server after adding them.

### "relation does not exist"

The database migrations haven't been run. Follow the setup guide in [SETUP.md](./SETUP.md).

### "new row violates row-level security policy"

This is expected! RLS is working correctly. Use the appropriate client:
- Public operations: Use `supabase` client
- Admin operations: Use `createAdminClient()` in server-side code

### Connection errors

- Verify your Supabase project is running
- Check that API keys are correct
- Ensure your IP is not blocked

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Support

For issues or questions:
1. Check the [SETUP.md](./SETUP.md) guide
2. Review the Supabase dashboard logs
3. Check browser console for errors
4. Consult the Supabase documentation
5. Ask in the Supabase Discord community
