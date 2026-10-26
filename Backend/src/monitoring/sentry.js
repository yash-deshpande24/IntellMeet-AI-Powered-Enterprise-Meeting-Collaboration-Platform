import * as Sentry from '@sentry/node';

// Call once, AFTER dotenv has loaded the environment variables.
export const initSentry = () => {
  if (!process.env.SENTRY_DSN) {
    console.log('[Sentry] SENTRY_DSN not set, error tracking is disabled');
    return;
  }
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1,
  });
  console.log('[Sentry] Error tracking enabled');
};

// Call AFTER all routes. Reports errors to Sentry and sends a safe JSON answer.
export const attachErrorHandlers = (app) => {
  if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('[Error]', err);
    res.status(err.status || 500).json({ success: false, message: 'Internal server error' });
  });
};