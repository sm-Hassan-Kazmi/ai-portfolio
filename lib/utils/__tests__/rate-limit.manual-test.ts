/**
 * Manual Test for Rate Limiting
 * Run with: tsx lib/utils/__tests__/rate-limit.manual-test.ts
 */

import { checkRateLimit, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from '../rate-limit';

console.log('🧪 Testing Rate Limiting Utility\n');

// Test 1: Basic rate limiting
console.log('Test 1: Basic rate limiting (3 requests max)');
const config1 = {
  maxRequests: 3,
  windowMs: 60000, // 1 minute
};

for (let i = 1; i <= 5; i++) {
  const result = checkRateLimit('test-ip-1', config1);
  const headers = getRateLimitHeaders(result);
  
  console.log(`  Request ${i}:`);
  console.log(`    Allowed: ${result.allowed}`);
  console.log(`    Remaining: ${result.remaining}`);
  console.log(`    Headers: ${JSON.stringify(headers, null, 2)}`);
  
  if (!result.allowed) {
    console.log(`    ⚠️  Rate limited! Retry after ${result.retryAfter}s`);
  }
}

console.log('\n');

// Test 2: Different identifiers
console.log('Test 2: Different identifiers are tracked separately');
const config2 = {
  maxRequests: 2,
  windowMs: 60000,
};

const result1 = checkRateLimit('ip-1', config2);
const result2 = checkRateLimit('ip-1', config2);
const result3 = checkRateLimit('ip-1', config2); // Should be blocked

const result4 = checkRateLimit('ip-2', config2); // Should be allowed

console.log(`  IP-1 Request 1: ${result1.allowed} (remaining: ${result1.remaining})`);
console.log(`  IP-1 Request 2: ${result2.allowed} (remaining: ${result2.remaining})`);
console.log(`  IP-1 Request 3: ${result3.allowed} (remaining: ${result3.remaining}) ⚠️`);
console.log(`  IP-2 Request 1: ${result4.allowed} (remaining: ${result4.remaining}) ✅`);

console.log('\n');

// Test 3: Predefined configurations
console.log('Test 3: Predefined configurations');
console.log(`  API_READ: ${RATE_LIMIT_CONFIGS.API_READ.maxRequests} requests per ${RATE_LIMIT_CONFIGS.API_READ.windowMs / 1000}s`);
console.log(`  API_WRITE: ${RATE_LIMIT_CONFIGS.API_WRITE.maxRequests} requests per ${RATE_LIMIT_CONFIGS.API_WRITE.windowMs / 1000}s`);
console.log(`  CONTACT_FORM: ${RATE_LIMIT_CONFIGS.CONTACT_FORM.maxRequests} requests per ${RATE_LIMIT_CONFIGS.CONTACT_FORM.windowMs / 1000}s`);
console.log(`  AUTH_LOGIN: ${RATE_LIMIT_CONFIGS.AUTH_LOGIN.maxRequests} requests per ${RATE_LIMIT_CONFIGS.AUTH_LOGIN.windowMs / 1000}s`);
console.log(`  RESUME_DOWNLOAD: ${RATE_LIMIT_CONFIGS.RESUME_DOWNLOAD.maxRequests} requests per ${RATE_LIMIT_CONFIGS.RESUME_DOWNLOAD.windowMs / 1000}s`);

console.log('\n✅ All tests completed!');
