import * as Sentry from '@sentry/react';

// Does nothing unless VITE_SENTRY_DSN is set at build time.
const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  });
}

export default Sentry;