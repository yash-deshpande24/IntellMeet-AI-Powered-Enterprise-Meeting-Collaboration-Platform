import rateLimit from 'express-rate-limit';

// Limits can be raised for LOCAL load tests with environment variables.
// Defaults stay strict (the same values as before).
const apiMax = Number(process.env.RATE_LIMIT_MAX) || 200;
const authMax = Number(process.env.AUTH_RATE_LIMIT_MAX) || 30;

// Standard rate limiter for API endpoints (200 requests per 15 min per IP)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: apiMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in 15 minutes.'
  }
});

// Strict rate limiter for Authentication endpoints (30 attempts per 15 min per IP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});