// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ActionEntry, ActionId } from "../layout/actionRegistry";
import { fieldTrigger } from "./fieldCompletion";
import type { FieldTrigger } from "./fieldCompletion";

/**
 * The command bar's two pure seams (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 2.3 and 2.4): `resolveDraft` turns the typed text
 * into one narrow result, and `commandBarKey` is the one reducer every key goes through. Nothing here reads the DOM, the platform or the
 * SKP client. `/filter` (PR B) keeps the condition after its word byte for byte and reads one thing inside it: the `@` trigger (`fieldCompletion.ts`).
 */

/** An entry as the list shows it: with whether it can run now (an unavailable entry is listed, marked, and never run). */
export interface Candidate {
  readonly entry: ActionEntry;
  readonly available: boolean;
}

export type Draft =
  | { readonly kind: "empty" }
  | { readonly kind: "help"; readonly query: string; readonly candidates: readonly Candidate[] }
  | { readonly kind: "commands"; readonly word: string; readonly candidates: readonly Candidate[] }
  | { readonly kind: "search"; readonly query: string; readonly candidates: readonly Candidate[] }
  | { readonly kind: "run"; readonly id: ActionId; readonly available: boolean }
  /** `/filter`, then the condition: the text after the first run of whitespace following the word, byte for byte, and the `@` trigger at the caret, if any. */
  | { readonly kind: "filter"; readonly id: ActionId; readonly available: boolean; readonly text: string; readonly field: FieldTrigger | null }
  | { readonly kind: "unresolved"; readonly reason: "unknown-command" | "filter-empty" };

const contains = (haystack: string, needle: string): boolean => haystack.toLowerCase().includes(needle.toLowerCase());

/**
 * What `text` means. `?` is help (every entry, narrowed by any text after it); `/word` is a command (an exact word of an entry that takes nothing
 * runs it, else the entries whose word starts with it are listed); anything else is a search, a case-insensitive substring match on label or
 * word in registry order, with no ranking. An entry with no word (`command.focus`) is in help and out of search. Registry order is the order of `registry`.
 * A word that takes a condition, followed by whitespace, is a `filter` draft; a whitespace-only condition is `filter-empty`, the only use of a trim, and nothing is trimmed in
 * the condition that is kept. `caret` is where the `@` trigger is read (the end of the text when absent).
 */
export function resolveDraft(text: string, registry: readonly ActionEntry[], available: (id: ActionId) => boolean, caret: number = text.length): Draft {
  if (/^\s*$/.test(text)) return { kind: "empty" };
  const candidatesOf = (entries: readonly ActionEntry[]): Candidate[] => entries.map((entry) => ({ entry, available: available(entry.id) }));
  const withWord = registry.filter((entry) => entry.command !== null);
  if (text.startsWith("?")) {
    const query = text.slice(1);
    return { kind: "help", query, candidates: candidatesOf(registry.filter((e) => contains(e.label, query) || (e.command !== null && contains(e.command, query)))) };
  }
  if (text.startsWith("/")) {
    const word = text.slice(1);
    const split = /^(\S*)(\s+)([\s\S]*)$/.exec(word);
    if (split !== null) {
      const entry = withWord.find((e) => e.takes === "condition" && e.command?.toLowerCase() === split[1].toLowerCase());
      if (entry === undefined) return { kind: "unresolved", reason: "unknown-command" };
      if (/^\s*$/.test(split[3])) return { kind: "unresolved", reason: "filter-empty" };
      return { kind: "filter", id: entry.id, available: available(entry.id), text: split[3], field: fieldTrigger(text, 1 + split[1].length + split[2].length, caret) };
    }
    const exact = withWord.find((entry) => entry.command?.toLowerCase() === word.toLowerCase());
    if (exact !== undefined && exact.takes === "nothing") return { kind: "run", id: exact.id, available: available(exact.id) };
    const starting = withWord.filter((entry) => entry.command?.toLowerCase().startsWith(word.toLowerCase()));
    return starting.length === 0 ? { kind: "unresolved", reason: "unknown-command" } : { kind: "commands", word, candidates: candidatesOf(starting) };
  }
  return { kind: "search", query: text, candidates: candidatesOf(withWord.filter((e) => contains(e.label, text) || contains(e.command ?? "", text))) };
}

/** The draft Tab completes `entry` to: its word, or `null` for an entry with none. */
export function completionOf(entry: ActionEntry): string | null {
  return entry.command === null ? null : `/${entry.command}`;
}

/**
 * Where the bar stands: the typed text, whether the list is open, the active option (an index into the options listed, or none), and whether Tab has just completed
 * the draft (set by Tab's completion, cleared by the next typed character, so that a second Tab leaves, and so that the list stays closed until then: ArrowDown and ArrowUp do not reopen it).
 */
export interface BarPos {
  readonly draft: string;
  readonly open: boolean;
  readonly active: number | null;
  readonly completed: boolean;
}

/** `BarPos` and what Tab would complete each listed option to (`completionOf`, in list order): the caller derives it from the draft. */
export interface BarState extends BarPos {
  readonly completions: readonly (string | null)[];
}

/** The slice of a `KeyboardEvent` the reducer reads. */
export interface BarKey {
  readonly key: string;
  readonly shiftKey: boolean;
  readonly isComposing: boolean;
}

/** What the caller does after the reducer: apply the active option, apply the draft if it resolves exactly, or leave the bar. */
export type BarEffect = { readonly kind: "none" } | { readonly kind: "apply"; readonly index: number } | { readonly kind: "applyDraft" } | { readonly kind: "leave" };

export interface BarStep {
  readonly pos: BarPos;
  readonly effect: BarEffect;
  readonly preventDefault: boolean;
}

/** Typing opens the list on the first character and keeps no option active; an empty draft closes it. Typing also clears `completed`. */
export function typeDraft(draft: string): BarPos {
  return { draft, open: draft !== "", active: null, completed: false };
}

/**
 * The one reducer for a key in the bar (section 2.3, OPEN-1 package (A)). A key during composition does nothing. Shift+Tab is never intercepted. Tab is
 * intercepted only to complete: an active option of the open list, or else the only candidate whether the list is open or closed, to that option's word; the list
 * then stays closed and `completed` stays set until the next typed character, so a second Tab leaves. Tab never applies. Enter applies the active option, or else the draft, and never completes.
 * Escape closes the list, or else leaves. ArrowDown and ArrowUp open the list and move the active option.
 */
export function commandBarKey(state: BarState, key: BarKey): BarStep {
  const pos: BarPos = { draft: state.draft, open: state.open, active: state.active, completed: state.completed };
  const none: BarStep = { pos, effect: { kind: "none" }, preventDefault: false };
  if (key.isComposing) return none;
  const count = state.completions.length;
  switch (key.key) {
    case "Tab": {
      if (key.shiftKey || state.completed || count === 0) return none;
      const index = state.open && state.active !== null ? state.active : count === 1 ? 0 : null;
      const completion = index === null ? null : state.completions[index];
      if (completion === null) return none;
      return { pos: { draft: completion, open: false, active: null, completed: true }, effect: none.effect, preventDefault: true };
    }
    case "Enter":
      return { pos, effect: state.open && state.active !== null ? { kind: "apply", index: state.active } : { kind: "applyDraft" }, preventDefault: true };
    case "Escape":
      return state.open ? { pos: { ...pos, open: false, active: null }, effect: none.effect, preventDefault: true } : { pos, effect: { kind: "leave" }, preventDefault: true };
    case "ArrowDown":
      if (count === 0 || state.completed) return none;
      return { pos: { ...pos, open: true, active: state.open && state.active !== null ? Math.min(state.active + 1, count - 1) : 0 }, effect: none.effect, preventDefault: true };
    case "ArrowUp": {
      if (count === 0 || state.completed) return none;
      const active = !state.open || state.active === null ? count - 1 : state.active === 0 ? null : state.active - 1;
      return { pos: { ...pos, open: true, active }, effect: none.effect, preventDefault: true };
    }
    default:
      return none;
  }
}
