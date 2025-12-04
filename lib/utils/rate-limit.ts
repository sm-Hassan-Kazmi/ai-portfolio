/**
 * Rate Limiting Utility
 * Implements in-memory rate limiting for API endpoints
 * Requirements: 10.4
 * 
 * Note: For production with multiple instances, consider using Redis or Upstash
 */

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Optional message to return when rate limit is exceeded
   */
  message?: string;
}

export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;

  /**
   * Number of requests remaining in the current window
   */
  remaining: number;

  /**
   * Total limit for the window
   */
  limit: number;

  /**
   * Timestamp when the rate limit resets (Unix timestamp in seconds)
   */
  reset: number;

  /**
   * Number of seconds to wait before retrying (only when allowed is false)
   */
  retryAfter?: number;
}

/**
 * In-memory store for rate limit tracking
 * Maps identifier (IP address or user ID) to array of request timestamps
 */
const rateLimitStore = new Map<string, number[]>();

/**
 * Clean up old entries periodically to prevent memory leaks
 */
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

function cleanupOldEntries(windowMs: number): void {
  const now = Date.now();
  
  // Only cleanup once per hour
  if (now - lastCleanup < CLEANUP_INTERVAL) {
    return;
  }

  const cutoff = now - windowMs;
  
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const recentTimestamps = timestamps.filter(ts => ts > cutoff);
    
    if (recentTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, recentTimestamps);
    }
  }
  
  lastCleanup = now;
}

/**
 * Check if a request should be rate limited
 * 
 * @param identifier - Unique identifier for the client (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result with allowed status and metadata
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Periodic cleanup
  cleanupOldEntries(config.windowMs);

  // Get existing timestamps for this identifier
  const timestamps = rateLimitStore.get(identifier) || [];

  // Filter out timestamps outside the current window
  const recentTimestamps = timestamps.filter(ts => ts > windowStart);

  // Calculate reset time (end of current window)
  const oldestTimestamp = recentTimestamps.length > 0 
    ? Math.min(...recentTimestamps)
    : now;
  const resetTime = oldestTimestamp + config.windowMs;
  const reset = Math.ceil(resetTime / 1000); // Convert to Unix timestamp in seconds

  // Check if limit exceeded
  if (recentTimestamps.length >= config.maxRequests) {
    const retryAfter = Math.ceil((resetTime - now) / 1000);
    
    return {
      allowed: false,
      remaining: 0,
      limit: config.maxRequests,
      reset,
      retryAfter,
    };
  }

  // Add current timestamp
  recentTimestamps.push(now);
  rateLimitStore.set(identifier, recentTimestamps);

  return {
    allowed: true,
    remaining: config.maxRequests - recentTimestamps.length,
    limit: config.maxRequests,
    reset,
  };
}

/**
 * Get rate limit headers for HTTP response
 * 
 * @param result - Rate limit result from checkRateLimit
 * @returns Headers object to include in response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  };

  if (result.retryAfter !== undefined) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Predefined rate limit configurations for different endpoint types
 */
export const RATE_LIMIT_CONFIGS = {
  /**
   * API read endpoints (GET requests)
   * 100 requests per minute
   */
  API_READ: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please try again later.',
  } as RateLimitConfig,

  /**
   * API write endpoints (POST, PUT, DELETE)
   * 20 requests per minute
   */
  API_WRITE: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please try again later.',
  } as RateLimitConfig,

  /**
   * Contact form submissions
   * 3 requests per hour
   */
  CONTACT_FORM: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many submissions. Please try again later.',
  } as RateLimitConfig,

  /**
   * Authentication attempts
   * 5 requests per 15 minutes
   */
  AUTH_LOGIN: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts. Please try again later.',
  } as RateLimitConfig,

  /**
   * Resume downloads
   * 10 requests per minute
   */
  RESUME_DOWNLOAD: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many download requests. Please try again later.',
  } as RateLimitConfig,
} as const;

/**
 * Extract client IP address from request headers
 * Handles various proxy headers (Vercel, Cloudflare, etc.)
 * 
 * @param headers - Request headers
 * @returns Client IP address or 'unknown'
 */
export function getClientIp(headers: Headers): string {
  // Try various headers that might contain the real IP
  const forwarded = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip');

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return 'unknown';
}
