import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "https://d03b3660658f45e4be733282d2d5fd9d@sentry.insert.moe/9",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}
