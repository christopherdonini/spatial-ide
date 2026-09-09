// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { listen } from "@tauri-apps/api/event";

/**
 * ADR-020 Amendment 1 (rewritten 2026-09-08, the human's ruling on `DECISIONS-PENDING.md` entry
 * 55 = "(b)"): the post-load self-check is an ASSERTION, never a selection. The host pins
 * `expected_origin` once, in `setup()`, from configuration alone (the config mirror,
 * `src-tauri/src/origin.rs`); this module only renders what the host's own `on_page_load` hook
 * (`src-tauri/src/lib.rs`) already decided and logged (`origin-self-check ok` / `origin-self-check
 * MISMATCH pinned=... actual=...` / `origin-self-check UNVERIFIABLE pinned=... error=...`, the
 * session log). Nothing here, and nothing in the component that reads this store
 * (`../OriginMismatchState.tsx`), ever changes the pinned value or calls back into any command --
 * there is no code path from this module back into the data plane's admission decision.
 *
 * **Reviewer S5: two distinct outcomes, not one.** `OriginMismatchPayload` (a genuine mismatch --
 * the webview's actual origin was read successfully and differs from the pinned one; the data
 * plane WILL refuse this session) and `OriginUnverifiablePayload` (`Webview::url()` or its own
 * normalisation failed host-side; the pinned origin may still be exactly right, and admission
 * behaves as pinned -- this check simply could not confirm it) are typed separately, discriminated
 * by `kind`, mirroring `lib.rs`'s own `OriginSelfCheckOutcome` (`#[serde(tag = "kind", rename_all =
 * "camelCase")]`) field-for-field. Collapsing them into one state (the pre-fix shape) told the
 * frontend "the data plane will refuse this session" in a case where it might not.
 */

export interface OriginMismatchPayload {
  kind: "mismatch";
  pinned: string;
  actual: string;
}

export interface OriginUnverifiablePayload {
  kind: "unverifiable";
  pinned: string;
  error: string;
}

export type OriginSelfCheckPayload = OriginMismatchPayload | OriginUnverifiablePayload;

type Listener = (payload: OriginSelfCheckPayload | null) => void;

let currentOutcome: OriginSelfCheckPayload | null = null;
const listeners = new Set<Listener>();

/** React's `useSyncExternalStore`-shaped subscribe (the same pattern
 * `diagnostics/errorHandlers.ts`'s `subscribeBanner` already establishes): calls back immediately
 * with the current state. */
export function subscribeOriginMismatch(listener: Listener): () => void {
  listeners.add(listener);
  listener(currentOutcome);
  return () => {
    listeners.delete(listener);
  };
}

/** The event name `lib.rs`'s `on_page_load` hook emits on a mismatch OR an unverifiable read --
 * the single source both the host's `app.emit` call and this module's `listen(...)` call
 * (`wireOriginSelfCheck` below) must agree on. One event name for both outcomes: the payload's own
 * `kind` field discriminates, mirroring `lib.rs`'s single `ORIGIN_SELF_CHECK_MISMATCH_EVENT`
 * constant, which this module's `checkOriginEventName.mjs` drift check keeps in sync with. */
export const ORIGIN_SELF_CHECK_MISMATCH_EVENT = "origin-self-check-mismatch";

/** Records a self-check outcome (mismatch or unverifiable) as the current state, notifying every
 * subscriber. Exported so `wireOriginSelfCheck` (the real `listen(...)` wiring, below) and a unit
 * test can both drive the same store without a live Tauri event. There is no "clear" path by
 * design: once the host has emitted either outcome, nothing later can make that not have happened
 * (a mismatch's own refusal is for the rest of this process's life -- the pinned value is never
 * reselected, see the module doc above; an unverifiable read is a fact about this ONE check, not
 * something a later successful check would retract, since there is no later check -- this hook
 * fires once per page load). */
export function recordOriginMismatch(payload: OriginSelfCheckPayload): void {
  currentOutcome = payload;
  for (const l of listeners) l(currentOutcome);
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
  unlisten = await listen<OriginSelfCheckPayload>(ORIGIN_SELF_CHECK_MISMATCH_EVENT, (event) => {
    recordOriginMismatch(event.payload);
  });
}
