import { invoke } from "@tauri-apps/api/core";

/**
 * ADR-010 rule 7: a global handler's output must be persisted to a log that outlives the session.
 * `binding_log_session_event` is a **binding-local command, never an SKP field** (ADR-004
 * Amendment 4) -- this sink exists so a failure survives the process, not so anything crosses the
 * wire through it.
 *
 * Never throws: a log sink that can itself throw into the handler it is meant to record a failure
 * from would defeat the one thing rule 7 asks for.
 */
export function logSessionEvent(level: string, message: string): void {
  invoke("binding_log_session_event", { level, message }).catch(() => {
    // Nothing else can be done here -- see the doc comment above.
  });
}
