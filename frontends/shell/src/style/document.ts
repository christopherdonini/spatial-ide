// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Style v0 (ADR-017 §5a), consumed rather than reinvented (ADR-022; NEXT-CUT.md P1). This is the
 * shell's ONLY style-shaped code: a document **producer** (`StyleState` -> the §5a document) and a
 * thin bridge into the imported resolver for the parse direction. Nothing here parses, resolves, or
 * canonicalizes a style itself -- `renderer/style-ts/src/style.ts` (imported below) is the one TS
 * implementation of those semantics, exactly as ADR-022 point 2 requires ("no consumer
 * re-implements parse/resolve/legend semantics").
 *
 * ## Structurally incapable of producing a document `spatial_renderer::style::parse` refuses
 *
 * NEXT-CUT.md binding note 5. `toStyleDocument` below is the only function in this tree that
 * builds a style document, and every one of the refusals `renderer/src/style.rs::parse` enforces is
 * closed here at construction, not validated afterward:
 *
 * - **One `match`, on `fill_color` only.** `StyleDocumentV0`'s type admits a `match` on `fill_color` and
 *   a literal everywhere else, so a second `match`, or one on another property, has no field to be set
 *   through. The match is written only when `StyleState.fillMatch` is set and survives the closure
 *   below: 1 to 64 cases with distinct `when` values, `on_null` and `on_unmatched` always present, the
 *   colours normalised. Otherwise the fill is the literal. Which column and which cases are not this
 *   module's decision: the Colour by apply builds them (`categoryCases.ts`).
 * - **`#rrggbb`, lowercase.** `normalizeColor` lowercases and validates against the exact grammar
 *   `renderer/src/style.rs::Rgb::parse` accepts; anything else (a caller bug, not a control a real
 *   panel would ever produce) falls back to `#000000` rather than reaching the document malformed.
 * - **Ranges clamped, not rejected.** `fill_opacity` and `outline_width` are clamped to the exact
 *   bounds `renderer/src/style.rs` declares (`0..=1`, `0..=MAX_OUTLINE_WIDTH`) at the moment the
 *   document is built, every time -- never once at a control's own boundary that a later
 *   in-memory mutation could bypass.
 * - **No unknown keys.** The document's shape is a fixed TypeScript interface produced by object
 *   literals, never assembled by spreading arbitrary state -- there is no code path that could add
 *   an extra key.
 *
 * ## Where the state lives
 *
 * `StyleState` is the `style` member of the view in the workspace state (`workspaceState.ts`), changed
 * only through `style.set` transitions (`viewTransitions.ts`). Saving a project writes this module's
 * document as the workspace's `style` (`project/saveProject.ts`); nothing here writes a file itself,
 * and no `localStorage` or session-recoverable copy of it exists.
 */

import { Style } from "../../../../renderer/style-ts/src/style";
import type { DrawParameters } from "../../../../renderer/style-ts/src/style";

/** `renderer/src/style.rs`'s declared bounds, mirrored as plain constants -- Rust source is not
 * importable into TypeScript, so these are restated, not derived, and must be kept in step with
 * that file by hand (its own `MAX_OUTLINE_WIDTH` doc comment states the same number for the same
 * reason: "a width large enough to cover the canvas turns 'styled' into 'blank'"). */
export const MIN_OPACITY = 0;
export const MAX_OPACITY = 1;
export const MIN_OUTLINE_WIDTH = 0;
export const MAX_OUTLINE_WIDTH = 64;

/** A fill by category: the match column, its cases in order, and the colours of a NULL and of a value no
 * case names. Plain data; `toStyleDocument` is what closes it into a document. */
export interface FillMatch {
  readonly column: string;
  readonly cases: readonly { readonly when: string; readonly then: string }[];
  readonly onNull: string;
  readonly onUnmatched: string;
}

/** The panel's editable state (NEXT-CUT.md's model section) as a view's `style` member; see this file's
 * top comment for where it lives. `fillMatch` is null for a one-colour fill. */
export interface StyleState {
  fillColor: string;
  fillOpacity: number;
  outlineColor: string;
  outlineWidth: number;
  fillMatch: FillMatch | null;
}

/**
 * Today's exact rendering, captured as the panel's starting point (NEXT-CUT.md P3: "default = the
 * current fixed style's values"). `#4285f4` / `180` is `buildLayers.ts`'s own pre-P2 fixed
 * `getFillColor: [66, 133, 244, 180]` (66 = 0x42, 133 = 0x85, 244 = 0xf4), restated here as a style
 * document's own units (a `#rrggbb` literal plus a separate `0..1` opacity, not one packed RGBA
 * array) rather than re-derived from deck.gl's own array at runtime -- so this constant, not a
 * conversion of it, is the fact a reviewer can diff against that removed line. `180 / 255` is kept
 * as the exact fraction (not a rounded decimal) so `resolveDrawParameters` -> the fill-RGBA
 * conversion (`canvas/buildLayers.ts`'s `toResolvedDrawParams`) reconstructs `180` exactly, byte for
 * byte, not merely close. Outline width `0`: no outline is drawn today (`buildLayers.ts`'s own
 * pre-P2 comment, "an outline is not required by it"), so this is the literal, honest default rather
 * than an invented visible value nothing yet draws.
 */
export const DEFAULT_STYLE_STATE: StyleState = {
  fillColor: "#4285f4",
  fillOpacity: 180 / 255,
  outlineColor: "#000000",
  outlineWidth: 0,
  fillMatch: null,
};

const HEX_COLOR_RE = /^#[0-9a-f]{6}$/;

/** Lowercases and validates `#rrggbb`. A value that does not match after lowercasing (never
 * produced by an `<input type="color">`, whose own value contract is always this exact grammar --
 * this is a defensive floor under any future control, not a workaround for today's) falls back to
 * black rather than letting a malformed literal reach the document. */
function normalizeColor(input: string): string {
  const lower = input.toLowerCase();
  return HEX_COLOR_RE.test(lower) ? lower : "#000000";
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** One property's value in the §5a document: a literal. */
export interface LiteralValue<T> {
  literal: T;
}

/** `fill_color`'s other shape: §5a's `match`, with the field names the document spells. */
export interface MatchValue {
  match: { column: string; cases: { when: string; then: string }[]; on_null: string; on_unmatched: string };
}

/** The §5a document (ADR-017), restricted to a `match` on `fill_color` only. This is a strict subset of
 * the full schema `renderer/src/style.rs`/`renderer/style-ts/src/style.ts` parse (both admit `match` on
 * any property) -- narrower on purpose, so the type itself keeps a second match unreachable. */
export interface StyleDocumentV0 {
  style_version: 1;
  layer: {
    geometry: "polygon";
    fill_color: LiteralValue<string> | MatchValue;
    fill_opacity: LiteralValue<number>;
    outline_color: LiteralValue<string>;
    outline_width: LiteralValue<number>;
  };
}

/** The most cases `renderer/src/style.rs` admits in one match. */
const MAX_MATCH_CASES = 64;

/** `fill_color`: the match when `fillMatch` is set and closes to at least one case, else the literal.
 * The closure keeps the first of two cases with the same `when` and the first 64, and normalises every
 * colour; a match left with no case falls back to the literal rather than reaching the document empty. */
function fillColorValue(state: StyleState): LiteralValue<string> | MatchValue {
  const match = state.fillMatch;
  if (match !== null && match.column !== "") {
    const seen = new Set<string>();
    const cases: { when: string; then: string }[] = [];
    for (const c of match.cases) {
      if (cases.length === MAX_MATCH_CASES) break;
      if (seen.has(c.when)) continue;
      seen.add(c.when);
      cases.push({ when: c.when, then: normalizeColor(c.then) });
    }
    if (cases.length > 0) {
      return { match: { column: match.column, cases, on_null: normalizeColor(match.onNull), on_unmatched: normalizeColor(match.onUnmatched) } };
    }
  }
  return { literal: normalizeColor(state.fillColor) };
}

/** The document producer: `StyleState` -> the §5a document. The only function in this tree that
 * assembles a style document -- see this file's own top doc comment for how each refusal
 * `renderer/src/style.rs::parse` enforces is closed here, at construction. */
export function toStyleDocument(state: StyleState): StyleDocumentV0 {
  return {
    style_version: 1,
    layer: {
      geometry: "polygon",
      fill_color: fillColorValue(state),
      fill_opacity: { literal: clamp(state.fillOpacity, MIN_OPACITY, MAX_OPACITY) },
      outline_color: { literal: normalizeColor(state.outlineColor) },
      outline_width: { literal: clamp(state.outlineWidth, MIN_OUTLINE_WIDTH, MAX_OUTLINE_WIDTH) },
    },
  };
}

/**
 * The parse direction, through the SAME imported resolver `renderer/bundle-viewer` reads
 * (NEXT-CUT.md P1 item 2) -- never a re-derivation of `state` by this module's own arithmetic. Two
 * things this proves each time it runs: the document `toStyleDocument` just produced is one
 * `spatial_renderer::style::parse` (and this TS resolver, pinned to it by the agreement vector)
 * actually accepts; and the resolved value the panel would display (P4) or hand to the canvas (P3)
 * came from the resolver, not from `state` directly.
 *
 * `style.resolve(null)` always: the draw parameters this returns are the panel's one-colour values,
 * and for a style with a `match` they are the `on_null` branch's. The per-feature colours of a match
 * come from `canvas/matchGroups.ts` through the same resolver, never from here.
 */
export function resolveDrawParameters(state: StyleState): DrawParameters {
  return parseStyleState(state).resolve(null);
}

/** `state` as the imported resolver holds it: the document `toStyleDocument` produced, parsed by the same `Style.parse` the bundle viewer
 * uses. Its `groupFor`, `groups` and `legend` are what the canvas colours by and the Style tab shows (`canvas/matchGroups.ts`, `Legend.tsx`). */
export function parseStyleState(state: StyleState): Style {
  return Style.parse(JSON.stringify(toStyleDocument(state)), "shell-style");
}
