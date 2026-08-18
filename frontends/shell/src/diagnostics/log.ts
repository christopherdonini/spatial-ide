// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { invoke } from "@tauri-apps/api/core";

import { recordNamed } from "../console/recorder";

/**
 * ADR-010 rule 7: a global handler's output must be persisted to a log that outlives the session.
 * `binding_log_session_event` is a **binding-local command, never an SKP field** (ADR-004
 * Amendment 4) -- this sink exists so a failure survives the process, not so anything crosses the
 * wire through it.
 *
 * Never throws: a log sink that can itself throw into the handler it is meant to record a failure
 * from would defeat the one thing rule 7 asks for. NEXT-CUT.md P3 item B: recorded name-only,
 * pre-invoke, resolved post-invoke -- this is the ONE binding command whose own doc comment (right
 * above) already promises never to surface a failure to its caller, so resolution here is
 * observational only, same as every other call site's wire.
 */
export function logSessionEvent(level: string, message: string): void {
  const entry = recordNamed("binding-command", "binding_log_session_event");
  invoke("binding_log_session_event", { level, message }).then(
    () => entry.resolveOk(),
    () => {
      // Nothing else can be done here -- see the doc comment above. S4 (reviewer gate,
      // action-console P7 fixes): resolveThrew takes no message by construction, so there is
      // nothing left to read off the rejection either.
      entry.resolveThrew();
    }
  );
}
