import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

if (import.meta.env.PROD) {
  /* Sentry.init({
    dsn: // TODO: migrate to Revolt Sentry
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  }); */
}
