// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * NEXT-CUT.md P3: the console panel's pure, DOM-free layer -- both grouping (I8) and the
 * per-entry view model (the row shape `ConsolePanel.tsx` renders). Kept pure and separate from the
 * component itself for the "no-render-harness" testing convention this package uses throughout
 * (`StylePanel.tsx`/`PublishPanel.tsx` have no `.test.tsx` of their own; the logic worth a test is
 * factored out, same as `App.tsx`'s own `nextResidencyStatus`/`nextScanState`).
 *
 * `buildRowViewModel` is I6's other half at the type level: `ClassBRowViewModel`/
 * `ClassCRowViewModel` carry no `copyText`/`request`/`rendered` field at all -- there is nothing
 * for `ConsolePanel.tsx` to accidentally render a copy button or a JSON block from, the same
 * "no field an argument object could occupy" discipline `surfaceRegistry.ts`'s own header
 * describes for `ClassBRow`/`ClassCRow`.
 */

import type { BindingCommandEntry, ConsoleEntry, ConsoleRefusal, GuiActionEntry, SkpRequestEntry } from "./recorder";
import { renderSkpRequest, type RenderedEntry } from "./render";
import { classARows, classBRows, classCRows } from "./surfaceRegistry";

/**
 * NEXT-CUT.md P4: the layer-2 honesty statement -- one standing sentence set, said once at the
 * top of the expanded drawer, no matter how truthful class A's own copy text already is. Kept as
 * data here (never composed inside `ConsolePanel.tsx`) so `console/consoleLanguage.test.ts` can
 * assert the load-bearing phrases against the constant itself, not by rendering the panel. The
 * three claims are fixed by NEXT-CUT.md's own text and must never drift: this app's own Tauri IPC
 * control plane is the actual transport; SKP has exactly one transport binding and no
 * out-of-process client today (SKP-V0 §4 item 2); handles are session-scoped with no idempotency
 * (§3, §4 item 9); therefore copied text is a faithful record, never a script anything can run.
 */
export const CONSOLE_STANDING_HEADER =
  "These are the requests this app sent over its own Tauri IPC control plane. SKP has one " +
  "transport binding today and no out-of-process client (SKP-V0 §4 item 2); handles are " +
  "session-scoped and there is no idempotency (§3, §4 item 9). This is a faithful record, not " +
  "a script you can run.";

/**
 * The header's own tiny "model": present, and first, when the drawer is expanded; entirely
 * absent when it is collapsed (I9 -- the closed console does zero per-entry work, and the header
 * is not an entry, so it does not mount there either). A one-element-or-empty array rather than a
 * boolean so `ConsolePanel.tsx` can spread it directly ahead of the entry groups it already
 * renders, and so a test can assert "first element" literally rather than by convention.
 */
export function standingHeaderModel(expanded: boolean): readonly [typeof CONSOLE_STANDING_HEADER] | readonly [] {
  return expanded ? [CONSOLE_STANDING_HEADER] : [];
}

/**
 * Reviewer gate S4 (action-console P7 fixes): the FIXED sentence a class-B row renders for
 * `outcome === "threw"` -- `BindingCommandEntry` structurally has no `error` field to read one
 * from (that type's own doc comment has the reason), so this is a constant, never composed from
 * the entry. Kept as data here, same convention as `CONSOLE_STANDING_HEADER` above, so
 * `consoleLanguage.test.ts` can assert the load-bearing phrase against the constant itself.
 */
export const CLASS_B_THREW_SENTENCE =
  "The host reported an error. Details are in the session log — not recorded here (host error " +
  "text may contain paths).";

export interface ClassARowViewModel {
  kind: "class-a";
  entry: SkpRequestEntry;
  /** The command name header (e.g. `"describe"`) -- sourced from the registry's own class-A row,
   * matched against `entry.command`, never composed here (I3: the console owns no command
   * shapes). */
  commandLabel: string;
  /** Read from the entry's OWN captured request object's `skp` field -- never a literal (I3). */
  skpVersion: string | null;
  rendered: RenderedEntry;
  outcome: SkpRequestEntry["outcome"];
  refusal?: ConsoleRefusal;
  error?: string;
}

/** No `request`/`rendered`/`copyText` field anywhere on this type -- I6 at the type level: there
 * is nothing here `ConsolePanel.tsx` could render as a copy button or a JSON block even by
 * accident. */
export interface ClassBRowViewModel {
  kind: "class-b";
  entry: BindingCommandEntry;
  effect: string;
  citation: string;
  outcome: BindingCommandEntry["outcome"];
}

/** Same "no argument-shaped field" property as `ClassBRowViewModel`. */
export interface ClassCRowViewModel {
  kind: "class-c";
  entry: GuiActionEntry;
  statement: string;
  owner: string;
}

/** A registry lookup miss -- an entry whose name has no row in `surfaceRegistry.ts`. Never
 * silently skipped (NEXT-CUT.md P3 item C): `surfaceCompleteness.test.ts`'s scan should make this
 * unreachable for class A/B; class C is review-maintained (that file's own comment), so this stays
 * reachable in principle and the UI stays honest about it rather than dropping the entry. */
export interface UnclassifiedRowViewModel {
  kind: "unclassified";
  entry: ConsoleEntry;
  name: string;
}

export type ConsoleRowViewModel =
  | ClassARowViewModel
  | ClassBRowViewModel
  | ClassCRowViewModel
  | UnclassifiedRowViewModel;

/** Reads the `skp` field off the entry's own captured request object -- the ONLY source for the
 * version shown in the class-A label line (I3: never a literal, never `SKP_VERSION` imported into
 * this file). `null` if the field is absent or not a string; the panel renders that as "unknown"
 * rather than guessing. */
function readSkpVersion(request: unknown): string | null {
  if (typeof request !== "object" || request === null || !("skp" in request)) return null;
  const value = (request as { skp: unknown }).skp;
  return typeof value === "string" ? value : null;
}

export function buildRowViewModel(entry: ConsoleEntry): ConsoleRowViewModel {
  switch (entry.kind) {
    case "skp-request": {
      const row = classARows().find((r) => r.command === entry.command);
      if (!row) {
        return { kind: "unclassified", entry, name: entry.command ?? "(no command name captured)" };
      }
      return {
        kind: "class-a",
        entry,
        commandLabel: row.command,
        skpVersion: readSkpVersion(entry.request),
        rendered: renderSkpRequest(entry.request),
        outcome: entry.outcome,
        refusal: entry.refusal,
        error: entry.error,
      };
    }
    case "binding-command": {
      const row = classBRows().find((r) => r.command === entry.command);
      if (!row) return { kind: "unclassified", entry, name: entry.command };
      return { kind: "class-b", entry, effect: row.effect, citation: row.citation, outcome: entry.outcome };
    }
    case "gui-action": {
      const row = classCRows().find((r) => r.action === entry.action);
      if (!row) return { kind: "unclassified", entry, name: entry.action };
      return { kind: "class-c", entry, statement: row.statement, owner: row.owner };
    }
  }
}

export interface ConsoleEntryGroup {
  /** The grouping key -- `${kind}:${name}` -- not itself rendered; exposed only so a test can
   * assert grouping without re-deriving it. */
  key: string;
  /** The REAL entries this group represents, in original order, by reference -- I8: a group never
   * synthesizes a merged entry. Expanding a group is showing this array, nothing else. */
  entries: readonly ConsoleEntry[];
}

function groupKeyOf(entry: ConsoleEntry): string {
  switch (entry.kind) {
    case "skp-request":
      return `skp-request:${entry.command ?? ""}`;
    case "binding-command":
      return `binding-command:${entry.command}`;
    case "gui-action":
      return `gui-action:${entry.action}`;
  }
}

/**
 * I8: repeated CONSECUTIVE entries sharing the same kind+name collapse into one group; anything
 * else -- a different command, or the same command with something else in between -- starts a new
 * group. Never merges two entries into one synthesized entry: a group of N is exactly N real
 * `ConsoleEntry` references, unmodified, in the same order they arrived.
 */
export function groupConsecutiveEntries(entries: readonly ConsoleEntry[]): ConsoleEntryGroup[] {
  const groups: { key: string; entries: ConsoleEntry[] }[] = [];
  for (const entry of entries) {
    const key = groupKeyOf(entry);
    const last = groups[groups.length - 1];
    if (last !== undefined && last.key === key) {
      last.entries.push(entry);
    } else {
      groups.push({ key, entries: [entry] });
    }
  }
  return groups;
}
