// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { listen } from "@tauri-apps/api/event";

import { logSessionEvent } from "../diagnostics/log";
import { DATASET_SESSION_ENDED_EVENT, DatasetSessionEnded, EndReason } from "./types";

/**
 * `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2d: **the shell's first runtime SKP decoder** (D4).
 * Every other SKP wire shape reaches this client through `skp/client.ts`'s `invoke`, whose
 * `deny_unknown_fields`/type checking happens on the Rust side of the boundary and arrives here
 * already typed; a Tauri *event* payload carries no such guarantee -- `event.payload` is `unknown`
 * until this function says otherwise. Mirrors `skp/0.5`'s own wire discipline (`SKP-V0.md` §2c):
 * `deny_unknown_fields`, exactly two members, a closed `reason` enum with no fallback.
 *
 * Refuses (throws) rather than best-effort-parses:
 * - a payload that is not a plain object;
 * - a payload missing `session` or `reason`, or carrying any key beyond those two;
 * - a `session` that is not a non-empty string;
 * - a `reason` outside the closed `"observed-change" | "coverage-lost"` set.
 */
export function decodeDatasetSessionEnded(payload: unknown): DatasetSessionEnded {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    // Reviewer S3 (architect gate-1): states the payload's KIND only -- null, array, or its
    // `typeof` -- never `JSON.stringify(payload)`, which could serialize an object carrying a
    // `session` value into this thrown message (§8 item 19 in principle).
    const kind = payload === null ? "null" : Array.isArray(payload) ? "array" : typeof payload;
    throw new Error(`dataset_session_ended: payload is not an object (kind: ${kind})`);
  }
  const obj = payload as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const expected = ["reason", "session"];
  if (keys.length !== expected.length || keys.some((k, i) => k !== expected[i])) {
    throw new Error(
      `dataset_session_ended: expected exactly {session, reason}, got keys [${keys.join(", ")}]`
    );
  }
  const { session, reason } = obj;
  if (typeof session !== "string" || session.length === 0) {
    throw new Error("dataset_session_ended: `session` is missing or not a non-empty string");
  }
  if (reason !== "observed-change" && reason !== "coverage-lost") {
    throw new Error(`dataset_session_ended: unknown reason ${JSON.stringify(reason)}`);
  }
  return { session, reason: reason as EndReason };
}

export type DatasetSessionEndedHandler = (event: DatasetSessionEnded) => void;

/**
 * Wraps `@tauri-apps/api/event`'s `listen` for `DATASET_SESSION_ENDED_EVENT`
 * (`diagnostics/originSelfCheck.ts::wireOriginSelfCheck`'s own precedent for the pattern), decoding
 * every payload through `decodeDatasetSessionEnded` before calling `onEvent`. A payload that fails
 * to decode is logged (the failure's own message, never the raw payload -- it may carry a
 * `session` value, and round 21 item 1 rider (b) forbids logging the reference) and dropped, never
 * thrown into Tauri's own event dispatch.
 */
export async function listenDatasetSessionEnded(
  onEvent: DatasetSessionEndedHandler
): Promise<() => void> {
  return listen<unknown>(DATASET_SESSION_ENDED_EVENT, (event) => {
    let decoded: DatasetSessionEnded;
    try {
      decoded = decodeDatasetSessionEnded(event.payload);
    } catch (e) {
      logSessionEvent(
        "warn",
        `dataset_session_ended: malformed payload dropped: ${e instanceof Error ? e.message : String(e)}`
      );
      return;
    }
    onEvent(decoded);
  });
}
