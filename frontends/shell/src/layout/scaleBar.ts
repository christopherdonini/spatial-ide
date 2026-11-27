// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The status bar's scale (governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md §2 item 1 and §7): a bar of a length
 * L = m x 10^k, m in {1, 2, 5}, in the dataset's own CRS metres, whose CSS width is L x 2^zoom, kept in [SCALE_BAR_MIN_PX, SCALE_BAR_MAX_PX).
 * Pure: it reads no canvas and no store. `2^zoom` is the CSS pixels one unit spans (`canvas/viewportBbox.ts`'s reading, measured at a
 * device pixel ratio of 1.0 only), so the width is claimed at that ratio and no other.
 */

/** The bar's CSS width, [min, max) (§7). The smallest 1-2-5 length with a width of at least the minimum is under 2.5 times it, so under the maximum. */
export const SCALE_BAR_MIN_PX = 60;
export const SCALE_BAR_MAX_PX = 150;
/** The exponent k of the length, inclusive: L from 0.001 to 50,000,000 (§7; ADR-010 rule 6). Outside it no bar is shown. */
export const SCALE_EXPONENT_MIN = -3;
export const SCALE_EXPONENT_MAX = 7;
/** The length's leading digit (§7). */
export const SCALE_MANTISSAS = [1, 2, 5] as const;

export type ScaleMantissa = (typeof SCALE_MANTISSAS)[number];

export type ScaleReading =
  | { kind: "none" }
  | { kind: "not-metre" }
  | { kind: "out-of-range" }
  | { kind: "bar"; mantissa: ScaleMantissa; exponent: number; widthPx: number };

/**
 * The strings the item shows (§2 item 7). All four are the advisor's wording under the human's delegation of 2026-11-13
 * (ADV-2026-11-27-28), not the human's; the human sees them in row AI4 of the walkthrough's Part AI.
 * SHELL-SCALE-DISPLAY S-1 and SHELL-SCALE-DISPLAY S-2 take the length's decimal from `scaleLabel`.
 */
/** SHELL-SCALE-DISPLAY S-1: the label beside the bar. */
export const scaleBarLabel = (decimal: string): string => `${decimal} m (CRS)`;
/** SHELL-SCALE-DISPLAY S-2: the title and accessible name of the bar's item. */
export const scaleBarTitle = (decimal: string): string =>
  `The bar spans ${decimal} m on the map at the current zoom, as the dataset's CRS counts metres. It is not a distance on the ground.`;
/** SHELL-SCALE-DISPLAY S-3: shown for a dataset whose unit is not the metre. */
export const SCALE_NOT_METRE_TEXT = `No scale bar: this dataset's coordinates are not known to be in metres.`;
/** SHELL-SCALE-DISPLAY S-4: shown when `scaleReading` returns `out-of-range`. */
export const SCALE_OUT_OF_RANGE_TEXT = `No scale bar at this zoom.`;

/** The length m x 10^k as its exact decimal in groups of three joined by ",", never the locale's (KNOWN-LIMITATIONS item 51), built from digits. */
export function scaleLabel(mantissa: ScaleMantissa, exponent: number): string {
  if (exponent < 0) return `0.${"0".repeat(-exponent - 1)}${mantissa}`;
  return `${mantissa}${"0".repeat(exponent)}`.replace(/\B(?=(\d{3})+$)/g, ",");
}

/** The reading for `pxPerUnit` CSS pixels per unit of a metre dataset: the smallest m x 10^k whose width m x 10^k x pxPerUnit is at least SCALE_BAR_MIN_PX. */
export function readingAtPxPerUnit(pxPerUnit: number): ScaleReading {
  if (!(pxPerUnit > 0) || !Number.isFinite(pxPerUnit)) return { kind: "out-of-range" };
  // The search starts one exponent below the range, so a smaller length that is also long enough is found and refused, not skipped; it ends at the top of the range.
  for (let exponent = SCALE_EXPONENT_MIN - 1; exponent <= SCALE_EXPONENT_MAX; exponent += 1) {
    for (const mantissa of SCALE_MANTISSAS) {
      // The product m x 10^k x pxPerUnit, with a negative k as a division by the exact power 10^-k.
      const widthPx = exponent < 0 ? (mantissa * pxPerUnit) / 10 ** -exponent : mantissa * 10 ** exponent * pxPerUnit;
      if (widthPx >= SCALE_BAR_MIN_PX) return exponent < SCALE_EXPONENT_MIN ? { kind: "out-of-range" } : { kind: "bar", mantissa, exponent, widthPx };
    }
  }
  return { kind: "out-of-range" };
}

/**
 * What the item shows for `unit` at `zoom`, the base-2 log of the CSS pixels one unit spans (`WorkingCanvasHandle.currentView`), or null when none is known.
 * `unit` is a plain `string` (a `CrsUnit` is assignable to it) so that no file under `layout/` imports from `skp/` (layoutBoundary.test.ts U4).
 */
export function scaleReading(unit: string, zoom: number | null): ScaleReading {
  if (zoom === null || !Number.isFinite(zoom)) return { kind: "none" };
  if (unit !== "metre") return { kind: "not-metre" };
  return readingAtPxPerUnit(2 ** zoom);
}
