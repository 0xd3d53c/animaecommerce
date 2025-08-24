// Rate limiting implementation for API routes
interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

class RateLimiter {
  private cache = new Map<string, { count: number; resetTime: number }>()

  async check(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now()
    const key = identifier
    const windowStart = now - config.interval

    // Clean up expired entries
    for (const [k, v] of this.cache.entries()) {
      if (v.resetTime < now) {
        this.cache.delete(k)
      }
    }

    const current = this.cache.get(key)
    const resetTime = now + config.interval

    if (!current || current.resetTime < now) {
      // First request or window expired
      this.cache.set(key, { count: 1, resetTime })
      return {
        success: true,
        limit: config.uniqueTokenPerInterval,
        remaining: config.uniqueTokenPerInterval - 1,
        reset: resetTime,
      }
    }

    if (current.count >= config.uniqueTokenPerInterval) {
      // Rate limit exceeded
      return {
        success: false,
        limit: config.uniqueTokenPerInterval,
        remaining: 0,
        reset: current.resetTime,
      }
    }

    // Increment counter
    current.count++
    this.cache.set(key, current)

    return {
      success: true,
      limit: config.uniqueTokenPerInterval,
      remaining: config.uniqueTokenPerInterval - current.count,
      reset: current.resetTime,
    }
  }
}

export const rateLimiter = new RateLimiter()

// Rate limit configurations for different endpoints
export const RATE_LIMITS = {
  // Authentication endpoints
  auth: { interval: 15 * 60 * 1000, uniqueTokenPerInterval: 5 }, // 5 attempts per 15 minutes

  // Payment endpoints
  payment: { interval: 60 * 1000, uniqueTokenPerInterval: 10 }, // 10 requests per minute

  // General API endpoints
  api: { interval: 60 * 1000, uniqueTokenPerInterval: 100 }, // 100 requests per minute

  // Cart operations
  cart: { interval: 60 * 1000, uniqueTokenPerInterval: 50 }, // 50 requests per minute
}

export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (for different deployment environments)
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfConnectingIp = request.headers.get("cf-connecting-ip")

  const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown"

  // Include user agent for additional uniqueness
  const userAgent = request.headers.get("user-agent") || "unknown"

  return `${ip}-${userAgent.slice(0, 50)}`
}
