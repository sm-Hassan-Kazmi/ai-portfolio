/**
 * Rate Limiting Tests
 * Tests the rate limiting utility functions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from '../rate-limit';

describe('Rate Limiting', () => {
  const testIdentifier = 'test-ip-123';

  beforeEach(() => {
    // Clear rate limit store between tests
    // Note: In a real implementation, we'd expose a reset function
  });

  describe('checkRateLimit', () => {
    it('should allow requests within limit', () => {
      const config = {
        maxRequests: 5,
        windowMs: 60000, // 1 minute
      };

      // First request should be allowed
      const result1 = checkRateLimit(testIdentifier + '-1', config);
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(4);
      expect(result1.limit).toBe(5);

      // Second request should be allowed
      const result2 = checkRateLimit(testIdentifier + '-1', config);
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(3);
    });

    it('should block requests exceeding limit', () => {
      const config = {
        maxRequests: 3,
        windowMs: 60000,
      };

      const identifier = testIdentifier + '-2';

      // Make 3 requests (should all be allowed)
      for (let i = 0; i < 3; i++) {
        const result = checkRateLimit(identifier, config);
        expect(result.allowed).toBe(true);
      }

      // 4th request should be blocked
      const result = checkRateLimit(identifier, config);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should include reset timestamp', () => {
      const config = {
        maxRequests: 5,
        windowMs: 60000,
      };

      const result = checkRateLimit(testIdentifier + '-3', config);
      expect(result.reset).toBeGreaterThan(Date.now() / 1000);
    });

    it('should handle different identifiers independently', () => {
      const config = {
        maxRequests: 2,
        windowMs: 60000,
      };

      const id1 = testIdentifier + '-4a';
      const id2 = testIdentifier + '-4b';

      // Make 2 requests for id1
      checkRateLimit(id1, config);
      checkRateLimit(id1, config);

      // id1 should be rate limited
      const result1 = checkRateLimit(id1, config);
      expect(result1.allowed).toBe(false);

      // id2 should still be allowed
      const result2 = checkRateLimit(id2, config);
      expect(result2.allowed).toBe(true);
    });
  });

  describe('getRateLimitHeaders', () => {
    it('should return correct headers for allowed request', () => {
      const result = {
        allowed: true,
        remaining: 95,
        limit: 100,
        reset: 1640000000,
      };

      const headers = getRateLimitHeaders(result);

      expect(headers['X-RateLimit-Limit']).toBe('100');
      expect(headers['X-RateLimit-Remaining']).toBe('95');
      expect(headers['X-RateLimit-Reset']).toBe('1640000000');
      expect(headers['Retry-After']).toBeUndefined();
    });

    it('should include Retry-After header when rate limited', () => {
      const result = {
        allowed: false,
        remaining: 0,
        limit: 100,
        reset: 1640000000,
        retryAfter: 60,
      };

      const headers = getRateLimitHeaders(result);

      expect(headers['X-RateLimit-Limit']).toBe('100');
      expect(headers['X-RateLimit-Remaining']).toBe('0');
      expect(headers['X-RateLimit-Reset']).toBe('1640000000');
      expect(headers['Retry-After']).toBe('60');
    });
  });

  describe('RATE_LIMIT_CONFIGS', () => {
    it('should have correct configuration for API reads', () => {
      expect(RATE_LIMIT_CONFIGS.API_READ.maxRequests).toBe(100);
      expect(RATE_LIMIT_CONFIGS.API_READ.windowMs).toBe(60000);
    });

    it('should have correct configuration for contact form', () => {
      expect(RATE_LIMIT_CONFIGS.CONTACT_FORM.maxRequests).toBe(3);
      expect(RATE_LIMIT_CONFIGS.CONTACT_FORM.windowMs).toBe(3600000); // 1 hour
    });

    it('should have correct configuration for resume downloads', () => {
      expect(RATE_LIMIT_CONFIGS.RESUME_DOWNLOAD.maxRequests).toBe(10);
      expect(RATE_LIMIT_CONFIGS.RESUME_DOWNLOAD.windowMs).toBe(60000);
    });
  });
});
