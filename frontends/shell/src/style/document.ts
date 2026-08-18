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
 * - **Literal-only.** `StyleDocumentV0`'s type has no `match` variant at all -- there is no field to
 *   set that would produce one. Categorical/match styling is unavailable live regardless
 *   (`viewport_query` carries no attributes -- ADR-023), so this is not a restriction this module
 *   imposes on top of a wider model; there is no wider model here.
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
 * ## Ephemeral only
 *
 * `StyleState` is plain in-memory React state, exactly like the camera. Nothing here persists it
 * (no project file, no `localStorage`, no session-recoverable state) -- NEXT-CUT.md binding note 4 /
 * ADR-022's consequences: persisting a style anywhere owes ADR-006 class-2 machinery and docs/11
 * obligations this cut does not take on.
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

/** The panel's editable state (NEXT-CUT.md's model section, verbatim field set). Held in React
 * state by `App.tsx`; nothing else in the shell may hold a second copy of it. */
export interface StyleState {
  fillColor: string;
  fillOpacity: number;
  outlineColor: string;
  outlineWidth: number;
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

/** One property's value in the §5a document -- deliberately the ONLY shape this module's document
 * type admits (never `{"match": ...}`; see this file's own top doc comment). */
export interface LiteralValue<T> {
  literal: T;
}

/** The §5a document (ADR-017), restricted to what a literal-only style can express. This is a
 * strict subset of the full schema `renderer/src/style.rs`/`renderer/style-ts/src/style.ts` parse
 * (both admit `match` too) -- narrower on purpose, so the TYPE ITSELF is one more thing that makes a
 * `match` unreachable from this module, not only the runtime code that happens to never write one. */
export interface StyleDocumentV0 {
  style_version: 1;
  layer: {
    geometry: "polygon";
    fill_color: LiteralValue<string>;
    fill_opacity: LiteralValue<number>;
    outline_color: LiteralValue<string>;
    outline_width: LiteralValue<number>;
  };
}

/** The document producer: `StyleState` -> the §5a document. The only function in this tree that
 * assembles a style document -- see this file's own top doc comment for how each refusal
 * `renderer/src/style.rs::parse` enforces is closed here, at construction. */
export function toStyleDocument(state: StyleState): StyleDocumentV0 {
  return {
    style_version: 1,
    layer: {
      geometry: "polygon",
      fill_color: { literal: normalizeColor(state.fillColor) },
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
 * `style.resolve(null)` always: a shell-produced document is always literal-only (never a `match` --
 * see `StyleDocumentV0`), so every branch (`null`/a value/`unmatched`) `resolve` could take returns
 * the identical draw parameters; `null` is as good a key as any to ask for them with.
 */
export function resolveDrawParameters(state: StyleState): DrawParameters {
  const doc = toStyleDocument(state);
  const style = Style.parse(JSON.stringify(doc), "shell-style");
  return style.resolve(null);
}
