import { logSessionEvent } from "./log";

/**
 * ADR-010 rule 7's BEGIN/END clause: "the last BEGIN with no matching END names the culprit." This
 * is an **instrument, not a recovery mechanism** -- it localizes a stall to a phase; it does not
 * diagnose the cause, and the rule's own text records that the same pattern supported two wrong
 * hypotheses during the ADR-003 spike's M4 investigation before the global exception handler (not
 * this) answered the actual question. Both are needed; neither substitutes for the other.
 */
export const WATCHDOG_PHASE_TIMEOUT_MS = 5_000;
const CHECK_INTERVAL_MS = 1_000;

interface PhaseEntry {
  beganAt: number;
}

const openPhases = new Map<string, PhaseEntry>();
let timer: ReturnType<typeof setInterval> | null = null;
let onStall: ((phase: string, openMs: number) => void) | null = null;

/** Mark a phase as begun. Call at every async entry point named in the shell's design note:
 * `open_dataset`, `describe`, `viewport_query`, ws-connect, frame-decode, buffer-build,
 * layer-construct. */
export function begin(phase: string): void {
  openPhases.set(phase, { beganAt: performance.now() });
}

/** Mark a phase as ended cleanly. Idempotent: ending a phase that was never begun, or was already
 * ended, is a no-op rather than an error -- the watchdog's own correctness must not depend on every
 * call site pairing begin/end perfectly. */
export function end(phase: string): void {
  openPhases.delete(phase);
}

export function setStallHandler(handler: ((phase: string, openMs: number) => void) | null): void {
  onStall = handler;
}

function check(now: number): void {
  for (const [phase, entry] of openPhases) {
    const openMs = now - entry.beganAt;
    if (openMs > WATCHDOG_PHASE_TIMEOUT_MS) {
      const message = `phase "${phase}" has had no matching end() for ${Math.round(openMs)} ms`;
      logSessionEvent("watchdog", message);
      onStall?.(phase, openMs);
      // Reset the clock so one genuinely stalled phase logs once per interval, not once per tick
      // forever -- the point is to notice it, not to flood the log with the same fact.
      openPhases.set(phase, { beganAt: now });
    }
  }
}

export function startWatchdog(): void {
  if (timer !== null) return;
  timer = setInterval(() => check(performance.now()), CHECK_INTERVAL_MS);
}

export function stopWatchdog(): void {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

/** Test-only: clears open phases without waiting for real time to pass. */
export function __resetForTests(): void {
  openPhases.clear();
}

/** Test-only: runs one check pass at a caller-supplied "now", so fake timers are not required. */
export function __checkForTests(now: number): void {
  check(now);
}
