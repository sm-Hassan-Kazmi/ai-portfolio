# API Rate Limiting

## Overview

This portfolio implements comprehensive rate limiting to prevent abuse and ensure fair resource usage. Rate limiting is applied to all API endpoints with different limits based on endpoint type.

## Implementation

### Rate Limiting Utility

The `lib/utils/rate-limit.ts` module provides:

- **In-memory rate limiting** - Fast, simple implementation for single-instance deployments
- **Configurable limits** - Different limits per endpoint type
- **Standard headers** - RFC-compliant rate limit headers
- **Automatic cleanup** - Prevents memory leaks

### Rate Limit Configurations

| Endpoint Type | Limit | Window | Use Case |
|--------------|-------|--------|----------|
| API Read (GET) | 100 requests | 1 minute | Portfolio data, general reads |
| API Write (POST/PUT/DELETE) | 20 requests | 1 minute | Content updates, mutations |
| Contact Form | 3 requests | 1 hour | Contact form submissions |
| Auth Login | 5 requests | 15 minutes | Login attempts |
| Resume Download | 10 requests | 1 minute | PDF generation |

### Rate Limit Headers

All responses include standard rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

When rate limited (429 response):

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640000000
Retry-After: 60
```

## Usage

### In API Routes

```typescript
import { checkRateLimit, getRateLimitHeaders, getClientIp, RATE_LIMIT_CONFIGS } from '@/lib/utils/rate-limit';

export async function GET(request: NextRequest) {
  // Get client IP
  const clientIp = getClientIp(request.headers);
  
  // Check rate limit
  const rateLimitResult = checkRateLimit(clientIp, RATE_LIMIT_CONFIGS.API_READ);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);
  
  // Return 429 if rate limited
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders }
    );
  }
  
  // Process request and include rate limit headers
  return NextResponse.json(data, {
    headers: rateLimitHeaders,
  });
}
```

### Custom Rate Limits

```typescript
const customConfig = {
  maxRequests: 50,
  windowMs: 5 * 60 * 1000, // 5 minutes
  message: 'Custom rate limit message',
};

const result = checkRateLimit(identifier, customConfig);
```

## Client IP Detection

The system detects client IP from various headers:

1. `x-forwarded-for` (Vercel, most proxies)
2. `x-real-ip` (Nginx)
3. `cf-connecting-ip` (Cloudflare)

This ensures accurate rate limiting behind proxies and CDNs.

## API Endpoints with Rate Limiting

### 1. Portfolio API (`/api/portfolio`)

- **Limit**: 100 requests per minute
- **Type**: Read
- **Purpose**: Fetch portfolio data

### 2. Contact API (`/api/contact`)

- **Limit**: 3 requests per hour
- **Type**: Write
- **Purpose**: Submit contact form

### 3. Resume API (`/api/resume`)

- **Limit**: 10 requests per minute
- **Type**: Read
- **Purpose**: Generate and download PDF resume

## Error Responses

### Rate Limit Exceeded (429)

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later."
}
```

Headers:
```
Status: 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640000000
Retry-After: 60
```

## Production Considerations

### Current Implementation

- **In-memory storage** - Simple, fast, works for single instance
- **Automatic cleanup** - Prevents memory leaks
- **No persistence** - Resets on server restart

### Scaling to Multiple Instances

For production with multiple instances, consider:

1. **Redis** - Distributed rate limiting
   ```typescript
   import { Redis } from '@upstash/redis';
   
   const redis = new Redis({
     url: process.env.UPSTASH_REDIS_URL,
     token: process.env.UPSTASH_REDIS_TOKEN,
   });
   ```

2. **Upstash Rate Limit** - Managed solution
   ```typescript
   import { Ratelimit } from '@upstash/ratelimit';
   
   const ratelimit = new Ratelimit({
     redis,
     limiter: Ratelimit.slidingWindow(100, '1 m'),
   });
   ```

3. **Vercel Edge Config** - Edge-based rate limiting
   ```typescript
   import { get } from '@vercel/edge-config';
   ```

### Migration Path

1. Keep current implementation for MVP
2. Monitor rate limit hits in production
3. Migrate to Redis when scaling to multiple instances
4. Update `lib/utils/rate-limit.ts` with Redis implementation
5. No changes needed in API routes (same interface)

## Monitoring

### Metrics to Track

1. **Rate limit hits** - How often users hit limits
2. **Endpoint usage** - Which endpoints are most used
3. **Abuse patterns** - Repeated limit violations
4. **False positives** - Legitimate users being limited

### Logging

Rate limit violations are logged:

```typescript
if (!rateLimitResult.allowed) {
  console.warn(`Rate limit exceeded for ${clientIp} on ${endpoint}`);
}
```

### Alerts

Set up alerts for:
- High rate limit hit rate (>10% of requests)
- Repeated violations from same IP
- Sudden spikes in API usage

## Testing

### Manual Testing

```bash
# Test rate limit
for i in {1..105}; do
  curl http://localhost:3000/api/portfolio
done

# Should see 429 after 100 requests
```

### Automated Testing

```typescript
describe('Rate Limiting', () => {
  it('should rate limit after max requests', async () => {
    const requests = Array(101).fill(null).map(() => 
      fetch('/api/portfolio')
    );
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status === 429);
    
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

## Security Benefits

1. **DDoS Protection** - Prevents overwhelming the server
2. **Brute Force Prevention** - Limits login attempts
3. **Resource Protection** - Prevents abuse of expensive operations
4. **Fair Usage** - Ensures resources available for all users
5. **Cost Control** - Limits API calls to external services

## Requirements Satisfied

- **Requirement 10.4**: API rate limiting to prevent abuse
- **Requirement 5.4**: Contact form rate limiting (3 per hour)
- **Requirement 7.3**: Login rate limiting (5 per 15 minutes)

## Best Practices

1. **Set appropriate limits** - Balance security vs. usability
2. **Include clear error messages** - Help users understand limits
3. **Use standard headers** - Follow RFC specifications
4. **Monitor and adjust** - Review limits based on usage patterns
5. **Document limits** - Make limits clear to API consumers
6. **Implement graceful degradation** - Don't break the app on rate limit
7. **Consider user experience** - Don't frustrate legitimate users

## Future Enhancements

1. **User-based rate limiting** - Different limits for authenticated users
2. **Dynamic rate limiting** - Adjust limits based on server load
3. **Rate limit bypass** - Allow certain IPs to bypass limits
4. **Rate limit analytics** - Dashboard for monitoring usage
5. **Distributed rate limiting** - Redis-based for multi-instance
