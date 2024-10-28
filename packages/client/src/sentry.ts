import * as Sentry from "@sentry/browser";

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    // tracing:
    // integrations: [Sentry.browserTracingIntegration()],
    // tracesSampleRate: 0.1,
  });
}
