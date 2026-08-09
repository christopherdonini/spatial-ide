import { logSessionEvent } from "./log";

export interface Banner {
  message: string;
  detail: string;
}

type BannerListener = (banner: Banner | null) => void;

let currentBanner: Banner | null = null;
const listeners = new Set<BannerListener>();

/** React's `useSyncExternalStore`-shaped subscribe: calls back immediately with the current state. */
export function subscribeBanner(listener: BannerListener): () => void {
  listeners.add(listener);
  listener(currentBanner);
  return () => {
    listeners.delete(listener);
  };
}

function showBanner(message: string, detail: string): void {
  currentBanner = { message, detail };
  for (const l of listeners) l(currentBanner);
}

export function dismissBanner(): void {
  currentBanner = null;
  for (const l of listeners) l(currentBanner);
}

function describeError(candidate: unknown, fallbackMessage: string): { message: string; detail: string } {
  if (candidate instanceof Error) {
    return { message: candidate.message, detail: candidate.stack ?? candidate.message };
  }
  return { message: fallbackMessage, detail: String(candidate) };
}

/**
 * ADR-010 rule 7: global `error` and `unhandledrejection` handlers are **unconditional** in any
 * long-lived rendering session, and their output is both visible (a banner, via `subscribeBanner`)
 * and persisted (the session log, via `binding_log_session_event`). Declared recovery policy:
 * `none` -- fail visibly, never retry, never silently swallow.
 *
 * **Must be called before any other module with side effects initializes** -- see `main.tsx`'s
 * comment on why that module uses a dynamic `import()` for the rest of the app rather than a static
 * one. An async operation may not terminate silently; this is what makes that true at the top of
 * the call stack rather than only inside code that remembered to add a `.catch()`.
 */
export function installGlobalErrorHandlers(): void {
  window.addEventListener("error", (event) => {
    const { message, detail } = describeError(event.error, event.message);
    logSessionEvent("error", detail);
    showBanner(`Unhandled error: ${message}`, detail);
  });

  window.addEventListener("unhandledrejection", (event) => {
    const { message, detail } = describeError(event.reason, "unhandled promise rejection");
    logSessionEvent("unhandledrejection", detail);
    showBanner(`Unhandled promise rejection: ${message}`, detail);
  });
}

/** Records the declared recovery policy once, at startup -- ADR-010 rule 6's "declared, not
 * discovered" discipline, applied to rule 7's own recovery-policy requirement. */
export function reportRecoveryPolicyNone(): void {
  logSessionEvent(
    "policy",
    "recovery policy: none -- fail visibly and terminate the canvas with a surfaced error"
  );
}
