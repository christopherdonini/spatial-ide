// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// CI item "report-schema validation". The milestone report interfaces
// (M0Report in main.ts, M4Report in m4-editing.ts, M5Report in
// m5-dataplane.ts, etc.) are TypeScript-only and erased at runtime -- they
// can't be imported and checked directly. This validates realistic fixture
// objects (matching each report's actual current shape) against a small
// hand-rolled structural checker, so a future field rename/type change that
// isn't reflected here fails loudly instead of silently drifting from what
// the README's transcribed numbers assume. Not a live check that any
// milestone's *runtime* output matches its own interface -- that would
// need to actually run the harness (WebView2, excluded from CI) -- this is
// a regression guard on the shapes this spike's tooling was built around.

import { test } from "node:test";
import assert from "node:assert/strict";

type Checker = (v: unknown, path: string) => void;

function isType(t: "string" | "number" | "boolean"): Checker {
  return (v, path) => assert.equal(typeof v, t, `${path}: expected ${t}, got ${typeof v}`);
}
function isArrayOf(item: Checker): Checker {
  return (v, path) => {
    assert.ok(Array.isArray(v), `${path}: expected array, got ${typeof v}`);
    (v as unknown[]).forEach((el, i) => item(el, `${path}[${i}]`));
  };
}
function isObject(shape: Record<string, Checker>): Checker {
  return (v, path) => {
    assert.equal(typeof v, "object", `${path}: expected object, got ${typeof v}`);
    assert.notEqual(v, null, `${path}: expected object, got null`);
    for (const [key, check] of Object.entries(shape)) {
      assert.ok(key in (v as object), `${path}.${key}: missing`);
      check((v as Record<string, unknown>)[key], `${path}.${key}`);
    }
  };
}
/**
 * A 16-lowercase-hex-digit bit-pattern string (M5 item 4's encoding
 * scheme, src/bit-encoding.ts). Not currently wired into m4ReportShape or
 * m5ReportShape below -- the hex encoding is an IPC-argument/return-value
 * detail of commit_vertex_edit/resolve_p2_vertex specifically, and neither
 * milestone's *committed report JSON* carries a raw hex-bits field (M4's
 * report has decoded numbers; the wire encoding never leaves that one
 * function pair). Kept here, tested against literals below, as the
 * reusable checker a future report field WOULD need if one ever surfaced
 * bit-pattern data directly -- not a currently-active regression guard on
 * either report shape, and this comment says so rather than implying more
 * coverage than exists.
 */
const isHexBits: Checker = (v, path) => {
  assert.equal(typeof v, "string", `${path}: expected a hex-bits string, got ${typeof v}`);
  assert.match(v as string, /^[0-9a-f]{16}$/, `${path}: expected 16 lowercase hex digits, got ${JSON.stringify(v)}`);
};

const m0ReportShape = isObject({
  timestamp: isType("string"),
  userAgent: isType("string"),
  webviewRuntimeVersion: isType("string"),
  webgl2: isObject({ supported: isType("boolean") }),
  webgpu: isObject({ supported: isType("boolean") }),
});

const pickLatencyResultShape = isObject({
  p50Ms: isType("number"),
  samples: isType("number"),
  timeouts: isType("number"),
  lastReturnedId: () => {}, // string | null -- either is valid, no further check
  lastLayerId: () => {}, // string | null
});

const m4ReportShape = isObject({
  timestamp: isType("string"),
  valid: isType("boolean"),
  invalidReasons: isArrayOf(isType("string")),
  budgetFrameMs: isType("number"),
  dragBenchmark: isObject({
    visibleSubset: isObject({ frameTimeP50Ms: isType("number"), frameTimeP95Ms: isType("number"), frameCount: isType("number") }),
    fullP2Visible: isObject({ frameTimeP50Ms: isType("number") }),
  }),
  commitRoundTrip: isObject({
    sentE: isType("number"),
    sentN: isType("number"),
    resolvedE: isType("number"),
    resolvedN: isType("number"),
    bitExact: isType("boolean"),
  }),
  pickToGrab: isObject({
    fullSet: pickLatencyResultShape,
    overlay: pickLatencyResultShape,
    visibleSubset: pickLatencyResultShape,
    overlayWinsCollision: isType("boolean"),
  }),
});

const m5ReportShape = isObject({
  timestamp: isType("string"),
  copyAudit: isObject({
    stages: isArrayOf(isObject({ stage: isType("string"), copies: isType("number") })),
    verifiedNoCopyAtArrowParse: isType("boolean"),
  }),
  throughput: isObject({ datasetBytes: isType("number"), runs: isArrayOf(isObject({ fetchMs: isType("number"), mbPerSec: isType("number") })) }),
  cancellation: isObject({ trials: isType("number"), abortToRejectMsP50: isType("number") }),
  bitRoundtrip: isObject({
    totalPatterns: isType("number"),
    mismatches: isArrayOf(isType("string")),
    liveM4PathConfirmation: isObject({ samples: isType("number"), allBitExact: isType("boolean"), mismatches: isType("number") }),
  }),
});

test("report schema: M0Report fixture matches expected shape", () => {
  const fixture = {
    timestamp: "2026-08-03T00:00:00.000Z",
    userAgent: "Mozilla/5.0",
    webviewRuntimeVersion: "150.0.4078.105",
    webgl2: { supported: true, vendor: "Google Inc. (NVIDIA)" },
    webgpu: { supported: true },
  };
  m0ReportShape(fixture, "M0Report");
});

test("report schema: M4Report fixture matches expected shape (commitRoundTrip carries plain numbers -- the report is the decoded result, not the wire-level hex encoding)", () => {
  const fixture = {
    timestamp: "2026-08-03T00:00:00.000Z",
    valid: true,
    invalidReasons: [] as string[],
    budgetFrameMs: 16,
    dragBenchmark: {
      visibleSubset: { frameTimeP50Ms: 16.7, frameTimeP95Ms: 17.4, frameCount: 150 },
      fullP2Visible: { frameTimeP50Ms: 16.8 },
    },
    commitRoundTrip: { sentE: 2659586.73, sentN: 1185592.46, resolvedE: 2659586.73, resolvedN: 1185592.46, bitExact: true },
    pickToGrab: {
      fullSet: { p50Ms: 12.1, samples: 12, timeouts: 0, lastReturnedId: "5020000", lastLayerId: "m4-pick-full" },
      overlay: { p50Ms: 1.7, samples: 12, timeouts: 0, lastReturnedId: "5020000", lastLayerId: "m4-pick-overlay" },
      visibleSubset: { p50Ms: 1.1, samples: 12, timeouts: 0, lastReturnedId: "5020000", lastLayerId: "m4-pick-visible-overlay" },
      overlayWinsCollision: true,
    },
  };
  m4ReportShape(fixture, "M4Report");
});

test("report schema: M5Report fixture matches expected shape", () => {
  const fixture = {
    timestamp: "2026-08-03T00:00:00.000Z",
    copyAudit: { stages: [{ stage: "Rust to_vec()", copies: 1 }], verifiedNoCopyAtArrowParse: true },
    throughput: { datasetBytes: 162500488, runs: [{ fetchMs: 1500, mbPerSec: 108 }] },
    cancellation: { trials: 10, abortToRejectMsP50: 0.1 },
    bitRoundtrip: {
      totalPatterns: 100013,
      mismatches: [] as string[],
      liveM4PathConfirmation: { samples: 20, allBitExact: true, mismatches: 0 },
    },
  };
  m5ReportShape(fixture, "M5Report");
});

test("report schema: bit-pattern hex-string fields reject a reverted-to-raw-number regression", () => {
  assert.throws(() => isHexBits(5020000, "lastReturnedId")); // a raw number, not the hex-string encoding
  assert.throws(() => isHexBits("not-hex-at-all", "eBits"));
  assert.doesNotThrow(() => isHexBits("41444a815dce737b", "eBits"));
});
