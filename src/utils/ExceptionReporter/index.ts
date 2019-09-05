import * as config from "config";
import * as Sentry from "@sentry/node";

export class ExceptionReporter {
  public report(error: Error): void {
    if (!config.get("sentry")) { return; }

    Sentry.captureException(error);
  }
}
