import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "https://033319adfcef4bd28a679ae05ed1cf8d@glitchtip.insert.moe/1",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}
