// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { listen } from "@tauri-apps/api/event";

/**
 * ADR-020 Amendment 1 (rewritten 2026-09-08, the human's ruling on `DECISIONS-PENDING.md` entry
 * 55 = "(b)"): the post-load self-check is an ASSERTION, never a selection. The host pins
 * `expected_origin` once, in `setup()`, from configuration alone (the config mirror,
 * `src-tauri/src/origin.rs`); this module only renders what the host's own `on_page_load` hook
 * (`src-tauri/src/lib.rs`) already decided and logged (`origin-self-check ok` / `origin-self-check
 * MISMATCH pinned=... actual=...`, the session log). Nothing here, and nothing in the component
 * that reads this store (`../OriginMismatchState.tsx`), ever changes the pinned value or calls
 * back into any command -- there is no code path from this module back into the data plane's
 * admission decision.
 */

export interface OriginMismatchPayload {
  pinned: string;
  actual: string;
}

type Listener = (payload: OriginMismatchPayload | null) => void;

let currentMismatch: OriginMismatchPayload | null = null;
const listeners = new Set<Listener>();

/** React's `useSyncExternalStore`-shaped subscribe (the same pattern
 * `diagnostics/errorHandlers.ts`'s `subscribeBanner` already establishes): calls back immediately
 * with the current state. */
export function subscribeOriginMismatch(listener: Listener): () => void {
  listeners.add(listener);
  listener(currentMismatch);
  return () => {
    listeners.delete(listener);
  };
}

/** The event name `lib.rs`'s `on_page_load` hook emits on a mismatch -- the single source both
 * the host's `app.emit` call and this module's `listen(...)` call (`wireOriginSelfCheck` below)
 * must agree on. */
export const ORIGIN_SELF_CHECK_MISMATCH_EVENT = "origin-self-check-mismatch";

/** Records a mismatch payload as the current state, notifying every subscriber. Exported so
 * `wireOriginSelfCheck` (the real `listen(...)` wiring, below) and a unit test can both drive the
 * same store without a live Tauri event. There is no "clear" path by design: once the host has
 * found a mismatch, the data plane refuses the pinned origin's session for the rest of this
 * process's life (the pinned value is never reselected -- see the module doc above), so nothing
 * later can make that not have happened. */
export function recordOriginMismatch(payload: OriginMismatchPayload): void {
  currentMismatch = payload;
  for (const l of listeners) l(currentMismatch);
}

let unlisten: (() => void) | null = null;

/**
 * Registers the real Tauri listener for `ORIGIN_SELF_CHECK_MISMATCH_EVENT`, feeding
 * `recordOriginMismatch`. Called once, from `bootstrap.tsx`, alongside mounting `<App />` --
 * deliberately NOT inside `App` itself: this state is prior to, and independent of, any dataset
 * admission `App` owns, and a mismatch can in principle be emitted before any dataset is ever
 * opened. Idempotent: a second call tears down the previous listener before adding a new one.
 *
 * `@tauri-apps/api` is an existing dependency (`package.json`) already used elsewhere in this
 * crate for `invoke` (`@tauri-apps/api/core`, see `diagnostics/log.ts`); `listen` is the sibling
 * export from `@tauri-apps/api/event` -- no new npm dependency.
 */
export async function wireOriginSelfCheck(): Promise<void> {
  unlisten?.();
  unlisten = await listen<OriginMismatchPayload>(ORIGIN_SELF_CHECK_MISMATCH_EVENT, (event) => {
    recordOriginMismatch(event.payload);
  });
}
