// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-SCALE-DISPLAY-PREREGISTRATION.md §4, U-SB1 to U-SB4: the pure part of the status bar's scale. Each recorded mutation is in the comment above its test.
 */

import { describe, expect, it } from "vitest";

import type { CrsUnit } from "../skp/types";
import {
  readingAtPxPerUnit,
  scaleLabel,
  scaleReading,
  SCALE_BAR_MAX_PX,
  SCALE_BAR_MIN_PX,
  SCALE_EXPONENT_MAX,
  SCALE_EXPONENT_MIN,
} from "./scaleBar";

describe("scaleBar (SHELL-SCALE-DISPLAY U-SB1 to U-SB4)", () => {
  // RECORDED MUTATION U-SB1 (M1): in `readingAtPxPerUnit`, each `>=` against SCALE_BAR_MIN_PX becomes `>`. Expected failure: the 30 and 12 cases.
  it("scaleReading picks the smallest 1-2-5 length whose bar is at least SCALE_BAR_MIN_PX", () => {
    // Exact products: 2 x 30 and 5 x 12 are 60 in floating point, so these cases sit on the boundary itself.
    expect(readingAtPxPerUnit(30), "30 px per unit: L 2, width 60").toEqual({ kind: "bar", mantissa: 2, exponent: 0, widthPx: 60 });
    expect(readingAtPxPerUnit(12), "12 px per unit: L 5, width 60").toEqual({ kind: "bar", mantissa: 5, exponent: 0, widthPx: 60 });
    const justBelow = readingAtPxPerUnit(29.999);
    expect(justBelow, "29.999 px per unit: L 5").toMatchObject({ kind: "bar", mantissa: 5, exponent: 0 });
    expect(justBelow.kind === "bar" && justBelow.widthPx).toBeCloseTo(149.995, 9);
    const tenAt = readingAtPxPerUnit(11.99);
    expect(tenAt, "11.99 px per unit: L 10").toMatchObject({ kind: "bar", mantissa: 1, exponent: 1 });
    expect(tenAt.kind === "bar" && tenAt.widthPx).toBeCloseTo(119.9, 9);
    // Zooms 0, -3 and 2.5 are §3's rows Z1 to Z3.
    const z1 = scaleReading("metre", 0);
    expect(z1, "zoom 0: L 100").toMatchObject({ kind: "bar", mantissa: 1, exponent: 2, widthPx: 100 });
    const z2 = scaleReading("metre", -3);
    expect(z2, "zoom -3: L 500").toMatchObject({ kind: "bar", mantissa: 5, exponent: 2, widthPx: 62.5 });
    const z3 = scaleReading("metre", 2.5);
    expect(z3, "zoom 2.5: L 20").toMatchObject({ kind: "bar", mantissa: 2, exponent: 1 });
    expect(z3.kind === "bar" && z3.widthPx).toBeCloseTo(113.137, 3);
  });

  // RECORDED MUTATION U-SB2 (M2): in `scaleBar.ts`, `SCALE_MANTISSAS` becomes `[1, 5]`. Expected failure: the first width at or above SCALE_BAR_MAX_PX.
  it("the bar is never shorter than SCALE_BAR_MIN_PX nor as long as SCALE_BAR_MAX_PX, and m is 1, 2 or 5", () => {
    // From -19 to 16 the bar exists at every step (§2 item 1; Amendment 2 item 3): -19 gives L 5 x 10^7, 16 gives L 0.001.
    for (let step = -19 * 64; step <= 16 * 64; step += 1) {
      const zoom = step / 64;
      const reading = scaleReading("metre", zoom);
      expect(reading.kind, `zoom ${zoom}`).toBe("bar");
      if (reading.kind !== "bar") continue;
      expect(reading.widthPx, `zoom ${zoom}: the width reaches SCALE_BAR_MIN_PX`).toBeGreaterThanOrEqual(SCALE_BAR_MIN_PX);
      expect(reading.widthPx, `zoom ${zoom}: the width stays under SCALE_BAR_MAX_PX`).toBeLessThan(SCALE_BAR_MAX_PX);
      expect([1, 2, 5], `zoom ${zoom}`).toContain(reading.mantissa);
      expect(reading.exponent, `zoom ${zoom}`).toBeGreaterThanOrEqual(SCALE_EXPONENT_MIN);
      expect(reading.exponent, `zoom ${zoom}`).toBeLessThanOrEqual(SCALE_EXPONENT_MAX);
      expect(reading.widthPx, `zoom ${zoom}: the width is L x 2^zoom`).toBeCloseTo(reading.mantissa * 10 ** reading.exponent * 2 ** zoom, 6);
    }
  });

  // RECORDED MUTATION U-SB3 (M3): in `scaleLabel`, the exponent's sign is ignored (`exponent = Math.abs(exponent)`). Expected failure: k = -3, then k = -1.
  it("scaleLabel writes the length's exact decimal in OPEN-4's format", () => {
    const cases: [1 | 2 | 5, number, string][] = [
      [5, -3, "0.005"],
      [1, -3, "0.001"],
      [1, -1, "0.1"],
      [2, -1, "0.2"],
      [2, 0, "2"],
      [5, 3, "5,000"],
      [1, 3, "1,000"],
      [1, 5, "100,000"],
      [5, 7, "50,000,000"],
    ];
    for (const [mantissa, exponent, text] of cases) expect(scaleLabel(mantissa, exponent), `${mantissa} x 10^${exponent}`).toBe(text);
  });

  // RECORDED MUTATION U-SB4 (M4): in `scaleReading`, `unit !== "metre"` becomes `unit === "degree"` (the one unit check). Expected failure: `other`, then `unestablished`.
  it("a bar only for metre; SHELL-SCALE-DISPLAY S-3 for degree, other and unestablished; nothing without a zoom; SHELL-SCALE-DISPLAY S-4 outside the exponent bounds", () => {
    expect(scaleReading("metre", 0).kind, "metre at zoom 0").toBe("bar");
    for (const unit of ["degree", "other", "unestablished"] as CrsUnit[]) expect(scaleReading(unit, 0), `${unit} at zoom 0`).toEqual({ kind: "not-metre" });
    for (const unit of ["metre", "degree", "other", "unestablished"] as CrsUnit[]) {
      for (const zoom of [null, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) expect(scaleReading(unit, zoom), `${unit} at zoom ${zoom}`).toEqual({ kind: "none" });
    }
    // Outside the bar's range: just past -19.67 and 16.87 (Amendment 2 item 3), and where 2^zoom is Infinity or 0 (Amendment 4 item 4).
    for (const zoom of [-19.68, -20, 16.88, 17, 1100, -1100]) expect(scaleReading("metre", zoom), `metre at zoom ${zoom}`).toEqual({ kind: "out-of-range" });
    for (const zoom of [-19.6, 16.8]) expect(scaleReading("metre", zoom).kind, `metre at zoom ${zoom}`).toBe("bar");
    expect(readingAtPxPerUnit(0), "0 px per unit").toEqual({ kind: "out-of-range" });
    expect(readingAtPxPerUnit(Number.POSITIVE_INFINITY), "Infinity px per unit").toEqual({ kind: "out-of-range" });
  });
});
