// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The action registry, minimal (SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §2.3 (c), plan seam 1;
 * question round 66, item 2: the three toggles and Zoom to layer only -- open and export join in
 * milestone 3). Milestone 2 adds the four ids of SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md §2.2, each with a
 * product caller and neither open nor export: `tool.navigate` and `tool.select` (bare keys, `matchToolKey`) and
 * `selection.zoomTo` and `selection.clear` (no shortcut). Static data plus two pure matchers. **This file is the one
 * place the shell reads the platform** (§2.10, §8 item 12): `currentPlatform` below.
 *
 * Callers: `StudioLayout`'s one `keydown` listener on `window` (via `matchChord` and `matchToolKey`), the three
 * toggle buttons in the top bar and the Layers row's button (each by id); the tool switch's two buttons and the
 * Feature tab's two buttons take their labels (and the tools' keys, and Zoom to selection's scope words) from
 * the entries.
 */

export type ToolActionId = "tool.navigate" | "tool.select";

export type ActionId =
  | "layout.toggleLayers"
  | "layout.toggleInspector"
  | "layout.toggleActivity"
  | "layer.zoomToLayer"
  | ToolActionId
  | "selection.zoomTo"
  | "selection.clear";

/** A chord is the modifier (Mod) plus one letter. `letter` is the Latin letter matched on
 * `event.key`; `code` is the physical key matched instead when `event.key` is not a Latin letter (a
 * non-Latin layout). */
export interface Chord {
  readonly letter: string;
  readonly code: string;
}

export interface ActionEntry {
  readonly id: ActionId;
  readonly label: string;
  readonly chord: Chord | null;
  /** The bare key (no modifier) the action is matched by, `matchToolKey`; `null` for every action but the two tools
   * (the keys are the human's, Amendment 1 A4). */
  readonly bareKey: Chord | null;
  /** What the action acts on, in words (§2.5; P6): `null` when it takes no scope or acts on the layer. */
  readonly scopeWords: string | null;
}

export const ACTIONS: readonly ActionEntry[] = [
  { id: "layout.toggleLayers", label: "Layers", chord: { letter: "b", code: "KeyB" }, bareKey: null, scopeWords: null },
  { id: "layout.toggleInspector", label: "Inspector", chord: { letter: "i", code: "KeyI" }, bareKey: null, scopeWords: null },
  { id: "layout.toggleActivity", label: "Activity", chord: { letter: "j", code: "KeyJ" }, bareKey: null, scopeWords: null },
  { id: "layer.zoomToLayer", label: "Zoom to layer", chord: null, bareKey: null, scopeWords: null },
  { id: "tool.navigate", label: "Navigate", chord: null, bareKey: { letter: "n", code: "KeyN" }, scopeWords: null },
  { id: "tool.select", label: "Select", chord: null, bareKey: { letter: "s", code: "KeyS" }, scopeWords: null },
  { id: "selection.zoomTo", label: "Zoom to selection", chord: null, bareKey: null, scopeWords: "Selected, ignoring filter" },
  { id: "selection.clear", label: "Clear selection", chord: null, bareKey: null, scopeWords: null },
];

/** The registry's entry for `id`. Every id has one. */
export function actionEntry(id: ActionId): ActionEntry {
  return ACTIONS.find((entry) => entry.id === id) as ActionEntry;
}

export type Platform = "mac" | "other";

/** Mac-family platform strings (`navigator.platform` on macOS and iOS-family WebKit). */
export function platformOf(source: { readonly platform?: string; readonly userAgent?: string }): Platform {
  const platform = source.platform ?? "";
  if (/^(Mac|iPhone|iPad|iPod)/.test(platform)) return "mac";
  if (platform === "" && /Mac OS X|Macintosh/.test(source.userAgent ?? "")) return "mac";
  return "other";
}

/** The platform this window runs on: the shell's one platform read. */
export function currentPlatform(): Platform {
  return typeof navigator === "undefined" ? "other" : platformOf(navigator);
}

/** The slice of a `KeyboardEvent` the matcher reads. */
export interface KeyEventLike {
  readonly key: string;
  readonly code: string;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly altKey: boolean;
  readonly shiftKey: boolean;
  readonly repeat: boolean;
  readonly isComposing: boolean;
}

/**
 * The id of the action `event` is the chord of, or `null`.
 * - Mod is Meta on macOS and Ctrl elsewhere, and must be down with Alt, Shift and the other of
 *   Ctrl and Meta up: AltGr reports Ctrl+Alt, so it never matches.
 * - `event.repeat` and `event.isComposing` are ignored (a held key toggles once; an IME composition
 *   is never a shortcut).
 * - The letter matches on `event.key`, case-insensitively; when `event.key` is not a Latin letter,
 *   on `event.code`.
 */
export function matchChord(event: KeyEventLike, platform: Platform): ActionId | null {
  if (event.repeat || event.isComposing) return null;
  const modDown = platform === "mac" ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
  if (!modDown || event.altKey || event.shiftKey) return null;
  const isLatinLetter = /^[A-Za-z]$/.test(event.key);
  for (const entry of ACTIONS) {
    const chord = entry.chord;
    if (chord === null) continue;
    if (isLatinLetter ? event.key.toLowerCase() === chord.letter : event.code === chord.code) return entry.id;
  }
  return null;
}

/** The chord as the label shows it: `Ctrl+B`, or `⌘B` on macOS. */
export function shortcutLabel(chord: Chord, platform: Platform): string {
  const letter = chord.letter.toUpperCase();
  return platform === "mac" ? `⌘${letter}` : `Ctrl+${letter}`;
}

/** The chord as `aria-keyshortcuts` writes it. */
export function ariaKeyShortcuts(chord: Chord, platform: Platform): string {
  return `${platform === "mac" ? "Meta" : "Control"}+${chord.letter.toUpperCase()}`;
}

/** What `matchToolKey` reads of the element that holds the key: an `Element`'s `tagName`, an `HTMLElement`'s
 * `isContentEditable`. */
export interface FocusLike {
  readonly tagName?: string;
  readonly isContentEditable?: boolean;
}

function isEditable(focus: FocusLike | null): boolean {
  if (focus === null) return false;
  const tag = (focus.tagName ?? "").toUpperCase();
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || focus.isContentEditable === true;
}

/**
 * The id of the tool `event` is the bare key of, or `null` (milestone 2 §2.2; Amendment 1 A4: bare `N` and bare `S`).
 * Every guard of `matchChord` that applies to a bare key applies here:
 * - any modifier (Ctrl, Meta, Alt or Shift) ignores the event, so a chord is never a tool key;
 * - `event.repeat` and `event.isComposing` are ignored;
 * - any key is ignored while an input, textarea, select or contenteditable element holds it (`focus`).
 * The letter matches on `event.key`, case-insensitively (Caps Lock), and on `event.code` when `event.key` is not a
 * Latin letter, as `matchChord` does.
 */
export function matchToolKey(event: KeyEventLike, focus: FocusLike | null): ToolActionId | null {
  if (event.repeat || event.isComposing) return null;
  if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return null;
  if (isEditable(focus)) return null;
  const isLatinLetter = /^[A-Za-z]$/.test(event.key);
  for (const entry of ACTIONS) {
    const key = entry.bareKey;
    if (key === null) continue;
    if (isLatinLetter ? event.key.toLowerCase() === key.letter : event.code === key.code) return entry.id as ToolActionId;
  }
  return null;
}
