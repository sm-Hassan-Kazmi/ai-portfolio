# Incremental Static Regeneration (ISR) Configuration

## Overview

This portfolio uses Next.js Incremental Static Regeneration (ISR) to provide fast page loads while keeping content fresh. Pages are statically generated at build time and revalidated in the background.

## Configuration

### Revalidation Period

All public pages are configured with a 3600-second (1 hour) revalidation period:

```typescript
export const revalidate = 3600;
```

This means:
- Pages are statically generated at build time
- Cached for 1 hour
- After 1 hour, the next request triggers a background regeneration
- Visitors always see fast, cached content
- Content updates within 1 hour of changes

### Pages with ISR

1. **Home Page** (`app/page.tsx`)
   - Terminal interface
   - Revalidates every hour

2. **Layout** (`app/layout.tsx`)
   - Root layout with metadata
   - Revalidates every hour

### API Routes

API routes use cache headers instead of ISR:

```typescript
// Portfolio API
headers: {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
}

// Resume API
headers: {
  'Cache-Control': 'public, max-age=3600',
}
```

## Cache Invalidation

### Automatic Revalidation

- Pages automatically revalidate after the revalidation period
- Background regeneration ensures no downtime
- Visitors always see cached content (never wait for regeneration)

### Manual Revalidation

To manually revalidate a page:

```typescript
import { revalidatePath } from 'next/cache';

// In a Server Action or API route
revalidatePath('/');
```

### On-Demand Revalidation

For immediate updates after content changes:

```typescript
// After updating portfolio data
await fetch(`${process.env.NEXT_PUBLIC_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=/`);
```

## Performance Benefits

1. **Fast Initial Load**: Static pages load instantly
2. **Fresh Content**: Regular revalidation keeps content current
3. **No Downtime**: Background regeneration prevents stale content
4. **Reduced Server Load**: Most requests served from cache
5. **Better SEO**: Search engines see fast, static pages

## Testing Cache Behavior

### Development

In development mode, ISR is disabled for faster iteration:
```bash
npm run dev
```

### Production

Test ISR in production mode:
```bash
npm run build
npm start
```

### Vercel Deployment

On Vercel, ISR works automatically:
- First request generates the page
- Subsequent requests use cached version
- After revalidation period, background regeneration occurs

## Monitoring

Monitor ISR performance:
- Check Vercel Analytics for cache hit rates
- Monitor page load times
- Track revalidation frequency
- Review cache headers in browser DevTools

## Requirements Satisfied

- **Requirement 12.5**: Static pages use ISR with 3600 second revalidation
- **Requirement 12.1**: First Contentful Paint under 1.5 seconds
- **Requirement 12.2**: Time to Interactive under 3 seconds

## Best Practices

1. **Set appropriate revalidation periods** - Balance freshness vs. performance
2. **Use stale-while-revalidate** - Serve stale content while regenerating
3. **Monitor cache hit rates** - Ensure ISR is working effectively
4. **Test in production mode** - ISR doesn't work in development
5. **Implement on-demand revalidation** - For immediate content updates
