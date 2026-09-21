/**
 * InfraSync AI — Sliding-Window In-Memory Rate Limiter Middleware (Phase 24)
 * Protects sensitive endpoints (AI analysis, file uploads, verifications) against abuse.
 */

import { errorResponse } from '../utils/apiResponse.js';

class MemoryRateLimiter {
  constructor(windowMs = 60000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.clients = new Map(); // ip -> Array of timestamps

    // Periodic cleanup every 5 minutes to prevent memory leaks
    setInterval(() => this._cleanup(), 300000).unref();
  }

  _cleanup() {
    const now = Date.now();
    for (const [ip, timestamps] of this.clients.entries()) {
      const valid = timestamps.filter((t) => now - t < this.windowMs);
      if (valid.length === 0) {
        this.clients.delete(ip);
      } else {
        this.clients.set(ip, valid);
      }
    }
  }

  middleware(options = {}) {
    const windowMs = options.windowMs || this.windowMs;
    const max = options.maxRequests || this.maxRequests;
    const message = options.message || 'Too many requests. Please try again later.';

    return (req, res, next) => {
      // Allow disabling rate limiting via environment in test runs
      if (process.env.RATE_LIMIT_DISABLED === 'true') {
        return next();
      }

      const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
      const now = Date.now();

      const timestamps = this.clients.get(clientIp) || [];
      const windowStart = now - windowMs;
      const recent = timestamps.filter((t) => t > windowStart);

      if (recent.length >= max) {
        const oldest = recent[0];
        const retryAfterSec = Math.ceil((oldest + windowMs - now) / 1000);
        res.setHeader('Retry-After', Math.max(1, retryAfterSec));
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', 0);

        return errorResponse(res, message, 'RATE_LIMIT_EXCEEDED', 429);
      }

      recent.push(now);
      this.clients.set(clientIp, recent);

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - recent.length));
      next();
    };
  }
}

export const generalRateLimiter = new MemoryRateLimiter(60000, 300);
export const mutationRateLimiter = new MemoryRateLimiter(60000, 60);
export const aiRateLimiter = new MemoryRateLimiter(60000, 30);
export const createRateLimiter = (windowMs, maxRequests) => new MemoryRateLimiter(windowMs, maxRequests);
