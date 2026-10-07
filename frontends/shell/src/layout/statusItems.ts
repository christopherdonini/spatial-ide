// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { scanLivenessText, scanLivenessTextShouldShow } from "../App";
import type { ScanState } from "../App";

/**
 * The status bar's two computed items (SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §2.5), as pure
 * text functions so the unit suite can pin them.
 */

/** The watcher facts of the dataset on the map: the slice of `describe` the item reads, written as
 * structural types so no file under `layout/` imports from `skp/` (§2.3 (a)). A `DescribeResponse`
 * is assignable to it. */
export interface WatcherFacts {
  readonly coverage: { readonly state: string; readonly reason: string | null };
  readonly checks: { readonly state: string; readonly components: readonly string[] };
}

/**
 * The watcher item's text: the engine's `coverage` and `checks` values as written, in one line.
 * `null` with no dataset on the map, and `null` while the session-ended item stands (the ended
 * statement is stronger and is already in the attention strip). Every string is a P6 placeholder
 * (§2.8, question round 66, item 4: the watcher texts are sighted at the sitting). The wording claims
 * only the at-open wire fact (KNOWN-LIMITATIONS 24 to 26).
 */
export function watcherStatusText(facts: WatcherFacts | null, sessionEnded: boolean): string | null {
  if (facts === null || sessionEnded) return null;
  const coverage =
    facts.coverage.state === "checks-only"
      ? `[P6 placeholder] source watch: checks-only — ${facts.coverage.reason ?? "(no reason on the payload)"}`
      : `[P6 placeholder] source watch: ${facts.coverage.state}`;
  if (facts.checks.state !== "degraded") return coverage;
  return `${coverage} · [P6 placeholder] structural checks: degraded — unestablished: ${facts.checks.components.join(", ")}`;
}

/**
 * The read-only scan-liveness mirror's text (OPEN-6, question round 67): `App`'s own
 * `scanLivenessText`, shown under `App`'s own `scanLivenessTextShouldShow` gate, so the mirror can
 * neither say more nor show sooner than the line in `FilterPanel`. It has no Cancel: Cancel stays in
 * `FilterPanel` (ADR-021).
 */
export function scanMirrorText(state: ScanState, msSinceIssued: number): string | null {
  return scanLivenessTextShouldShow(state, msSinceIssued) ? scanLivenessText(state) : null;
}
