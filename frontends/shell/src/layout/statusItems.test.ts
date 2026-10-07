// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { SCAN_LIVENESS_DELAY_MS, scanLivenessText, scanLivenessTextShouldShow } from "../App";
import type { ScanState } from "../App";
import { scanMirrorText, watcherStatusText } from "./statusItems";
import type { WatcherFacts } from "./statusItems";

/**
 * SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §4, U6: the status bar's computed items (§2.5).
 */

function facts(over: Partial<WatcherFacts> = {}): WatcherFacts {
  return {
    coverage: { state: "watching", reason: null },
    checks: { state: "full", components: [] },
    ...over,
  };
}

// RECORDED MUTATION for "U6": drop the session-ended guard (`if (facts === null || sessionEnded) return
// null;` becomes `if (facts === null) return null;`). Expected failure: the watcher item still shows while
// the session-ended statement stands.
// OBSERVED AT d19c84a6c455029a7ec4bdca077ac1e9295f8b8a: FAILED -- "is null while the session-ended item stands, whatever the facts":
//   AssertionError: expected '[P6 placeholder] source watch: watchi...' to be null
// Reverted after observing.
describe("U6: the watcher item's text", () => {
  it("watching with full checks: the coverage state as the engine wrote it, marked a P6 placeholder", () => {
    expect(watcherStatusText(facts(), false)).toBe("[P6 placeholder] source watch: watching");
  });

  it("checks-only: the engine's reason as written", () => {
    const text = watcherStatusText(
      facts({ coverage: { state: "checks-only", reason: "the volume does not report change notifications" } }),
      false
    );
    expect(text).toBe("[P6 placeholder] source watch: checks-only — the volume does not report change notifications");
  });

  it("checks-only with no reason on the payload says so rather than inventing one", () => {
    const text = watcherStatusText(facts({ coverage: { state: "checks-only", reason: null } }), false);
    expect(text).toBe("[P6 placeholder] source watch: checks-only — (no reason on the payload)");
  });

  it("degraded checks: every unestablished component, in the engine's order", () => {
    const text = watcherStatusText(facts({ checks: { state: "degraded", components: ["mtime", "footer-hash"] } }), false);
    expect(text).toBe(
      "[P6 placeholder] source watch: watching · [P6 placeholder] structural checks: degraded — unestablished: mtime, footer-hash"
    );
  });

  it("checks-only and degraded together read as one line", () => {
    const text = watcherStatusText(
      facts({
        coverage: { state: "checks-only", reason: "no notifier" },
        checks: { state: "degraded", components: ["mtime"] },
      }),
      false
    );
    expect(text).toBe(
      "[P6 placeholder] source watch: checks-only — no notifier · [P6 placeholder] structural checks: degraded — unestablished: mtime"
    );
  });

  it("is null while the session-ended item stands, whatever the facts", () => {
    expect(watcherStatusText(facts(), true)).toBeNull();
    expect(
      watcherStatusText(facts({ coverage: { state: "checks-only", reason: "no notifier" } }), true)
    ).toBeNull();
  });

  it("is null with no dataset on the map", () => {
    expect(watcherStatusText(null, false)).toBeNull();
    expect(watcherStatusText(null, true)).toBeNull();
  });
});

describe("U6: the scan-liveness mirror's gate equals scanLivenessTextShouldShow (OPEN-6)", () => {
  const states: ScanState[] = [
    { kind: "idle" },
    { kind: "issuing", streamHandle: "st_1" },
    { kind: "open-no-rows", streamHandle: "st_1" },
    { kind: "delivering", streamHandle: "st_1", rows: 12 },
    { kind: "cancelled", streamHandle: "st_1", rows: 7 },
    { kind: "complete", streamHandle: "st_1" },
    { kind: "failed", streamHandle: "st_1" },
  ];
  const elapsed = [0, SCAN_LIVENESS_DELAY_MS - 1, SCAN_LIVENESS_DELAY_MS, SCAN_LIVENESS_DELAY_MS + 1, 10_000];

  it("shows App's own liveness text exactly when App's own gate holds, and never otherwise", () => {
    for (const state of states) {
      for (const ms of elapsed) {
        const expected = scanLivenessTextShouldShow(state, ms) ? scanLivenessText(state) : null;
        expect(scanMirrorText(state, ms), `${state.kind} at ${ms} ms`).toBe(expected);
      }
    }
  });

  it("the two delivering/no-rows states do show once the delay has passed (the mirror is not vacuous)", () => {
    expect(scanMirrorText({ kind: "delivering", streamHandle: "st_1", rows: 12 }, SCAN_LIVENESS_DELAY_MS)).toBe(
      "Filtering — 12 rows so far"
    );
    expect(scanMirrorText({ kind: "open-no-rows", streamHandle: "st_1" }, SCAN_LIVENESS_DELAY_MS)).not.toBeNull();
  });

  it("shows nothing before the delay", () => {
    expect(scanMirrorText({ kind: "delivering", streamHandle: "st_1", rows: 12 }, SCAN_LIVENESS_DELAY_MS - 1)).toBeNull();
  });
});
