// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * NEXT-CUT.md P2: the classification layer between the recorder/formatter (P0/P1) and the panel
 * (P3). A declaration table, not logic -- nothing here composes display text for class A (that is
 * `console/recorder.ts` + `console/render.ts`'s job, sourced from the actual captured request);
 * this module only says, for every action a shell operator can take, which of the cut's three
 * display classes it falls into and, for classes B/C, the fixed prose that accounts for it.
 *
 * NEXT-CUT.md's three-class table:
 *   A -- one of the five SKP commands: exact serialized request, copyable. Display text is never
 *        owned here (I3: "the console owns no command shapes").
 *   B -- a binding-local Tauri command: prose + the command NAME only, never the argument object
 *        (ADR-024's fence), never a copy affordance, never the string "SKP" (I6).
 *   C -- no command at all: a plain "no API equivalent exists" statement plus the decision that
 *        owns the gap.
 *
 * `SurfaceRow`'s three members enforce I6 at the type level, not just by convention: `ClassBRow`
 * and `ClassCRow` have no field capable of holding an argument object -- every field is `string`.
 * There is no `args`/`request`/`payload` field to add one to; a caller that tried would fail
 * `tsc` on the excess-property check (see `surfaceCompleteness.test.ts`'s `@ts-expect-error`
 * block), not merely fail a lint at review time.
 */

export type SurfaceClass = "A" | "B" | "C";

/** A class-A row names one of the five SKP commands. No display field: `console/recorder.ts` +
 * `console/render.ts` own the actual rendered text, sourced from the captured request itself. */
export interface ClassARow {
  readonly class: "A";
  /** One of the five SKP command names, e.g. `"open_dataset"` -- the same string
   * `skp/client.ts`'s `call()` passes to `invoke` as its first argument. */
  readonly command: string;
}

/** A class-B row names one binding-local Tauri command. Every field is `string`; there is no
 * field an argument object could occupy (I6, ADR-024's fence). */
export interface ClassBRow {
  readonly class: "B";
  /** The binding command's own name, e.g. `"binding_pick_file"`. */
  readonly command: string;
  /** One plain sentence describing what the action does -- never the request/response shape,
   * never a copy affordance, never the string "SKP". */
  readonly effect: string;
  /** Names the fence that keeps this command out of the SKP catalog and off any future
   * conformance suite -- every class-B row's citation must contain "ADR-024" or "SKP-V0"
   * (`surfaceCompleteness.test.ts` asserts this for every row in this table). */
  readonly citation: string;
}

/** A class-C row names a GUI action with no command at all -- style edits, panel toggles, banner
 * dismiss. Every field is `string`; same "no argument object field" property as `ClassBRow`. */
export interface ClassCRow {
  readonly class: "C";
  /** A stable, dotted action name, e.g. `"style.setFillColor"`. Not a call site -- there is
   * nothing to scan for these (that is the point; see `surfaceCompleteness.test.ts`). */
  readonly action: string;
  /** "No API equivalent exists" stated plainly, in the operator's own action's terms. */
  readonly statement: string;
  /** The decision that owns the gap -- an ADR number or a docs/NN section, e.g.
   * `"ADR-022 / ADR-023"` or `"docs/03 §The action console (pure view state)"`. */
  readonly owner: string;
}

export type SurfaceRow = ClassARow | ClassBRow | ClassCRow;

/** Shared citation text for every class-B row: names the SKP-V0 §4 items that exclude
 * binding-local commands from the control-plane catalog, and ADR-024, the fence's own filing.
 * A single constant, not eight independent strings, so the wording cannot drift row to row. */
const BINDING_LOCAL_CITATION =
  "host-local, not part of the API; excluded from the SKP catalog (SKP-V0 §4 items 1/3/11/13; " +
  "ADR-024); not callable by a script, plugin, notebook, CLI, or AI client.";

/** The five SKP commands (`skp/client.ts`'s own `call("...", ...)` sites) -- kept here as the
 * class-A half of the registry. A sixth command changes `skp/client.ts`, this list, and
 * `surfaceCompleteness.test.ts`'s derived-set assertion together, or the completeness scan fails
 * the build (NEXT-CUT.md P2's own anti-debt-accrual mechanism). */
const CLASS_A_ROWS: readonly ClassARow[] = [
  { class: "A", command: "open_dataset" },
  { class: "A", command: "describe" },
  { class: "A", command: "viewport_query" },
  { class: "A", command: "cancel" },
  { class: "A", command: "close_dataset" },
];

/** The seven binding-local commands plus the dev-only E2E destination seam (NEXT-CUT.md's
 * "7 + dev seam"). */
const CLASS_B_ROWS: readonly ClassBRow[] = [
  {
    class: "B",
    command: "binding_data_plane_attach",
    effect:
      "attaches this client to the local data-plane WebSocket endpoint and session token, once " +
      "per process at startup; never re-requested per viewport query.",
    citation: BINDING_LOCAL_CITATION,
  },
  {
    class: "B",
    command: "binding_log_session_event",
    effect:
      "writes one diagnostic log line to a host-side log that outlives the session (ADR-010 " +
      "rule 7); the shell never blocks on it, never surfaces its result, and never retries it.",
    citation: BINDING_LOCAL_CITATION,
  },
  {
    class: "B",
    command: "binding_crs_catalog",
    effect:
      "returns the pinned, in-tree CRS definition catalog (ADR-026 decision 1(a)) as static, " +
      "host-compiled data; no dataset, path, or query leaves the shell for this action.",
    citation: BINDING_LOCAL_CITATION,
  },
  {
    class: "B",
    command: "binding_pick_file",
    effect:
      "opens the native OS file picker so the operator can choose a dataset path before " +
      "open_dataset is called; the picker's own answer supplies the path, never a script's.",
    citation: BINDING_LOCAL_CITATION,
  },
  {
    class: "B",
    command: "binding_publish_prepare",
    effect:
      "opens the native OS destination picker host-side, runs the pure publish preflight, and " +
      "mints a single-use, TTL-bounded PublishGrant from facts the host itself holds -- never " +
      "from anything the request asserts about itself (ADR-024).",
    citation: BINDING_LOCAL_CITATION,
  },
  {
    class: "B",
    command: "binding_publish_execute",
    effect:
      "takes the single-use pending publish attempt, opens a fresh audit log for it alone, and " +
      "runs the permission boundary's one approval comparison against the operator's " +
      "already-typed confirmation phrase.",
    citation: BINDING_LOCAL_CITATION,
  },
  {
    class: "B",
    command: "binding_publish_cancel",
    effect:
      "cancels a running publish for the given attempt id, if one is still running; finding " +
      "none is not an error.",
    citation: BINDING_LOCAL_CITATION,
  },
  {
    class: "B",
    command: "binding_publish_prepare_e2e_destination",
    effect:
      "dev-only E2E test seam, compiled out of every release build (#[cfg(debug_assertions)] on " +
      "both its definition and its handler registration): mirrors binding_publish_prepare but " +
      "accepts a destination string directly, standing in for the native save dialog no " +
      "CDP-driven E2E suite can reach; the grant is still minted host-side from that destination.",
    citation: BINDING_LOCAL_CITATION,
  },
];

/** Named GUI actions with no command at all -- style edits, the one panel disclosure toggle, and
 * the two dismissible canvas banners. Not mechanically completeness-checked (no call site exists
 * to scan for); see `surfaceCompleteness.test.ts`'s own comment on why that makes this table a
 * review-maintained one, which is why NEXT-CUT.md Part J's J3 walkthrough item exists. */
const CLASS_C_ROWS: readonly ClassCRow[] = [
  {
    class: "C",
    action: "style.setFillColor",
    statement: "no API equivalent exists -- fill color is local StylePanel state, never sent to the kernel.",
    owner: "ADR-022 / ADR-023",
  },
  {
    class: "C",
    action: "style.setFillOpacity",
    statement: "no API equivalent exists -- fill opacity is local StylePanel state, never sent to the kernel.",
    owner: "ADR-022 / ADR-023",
  },
  {
    class: "C",
    action: "style.setOutlineColor",
    statement: "no API equivalent exists -- outline color is local StylePanel state, never sent to the kernel.",
    owner: "ADR-022 / ADR-023",
  },
  {
    class: "C",
    action: "style.setOutlineWidth",
    statement: "no API equivalent exists -- outline width is local StylePanel state, never sent to the kernel.",
    owner: "ADR-022 / ADR-023",
  },
  {
    class: "C",
    action: "style.resetToDefault",
    statement:
      "no API equivalent exists -- resetting StylePanel's fields to DEFAULT_STYLE_STATE is local state, " +
      "never sent to the kernel.",
    owner: "ADR-022 / ADR-023",
  },
  {
    class: "C",
    action: "style.togglePanelExpanded",
    statement:
      "no API equivalent exists -- StylePanel's collapsed/expanded disclosure is pure view state, " +
      "discarded on every dataset change.",
    owner: 'docs/03 §"The action console" (pure view state)',
  },
  {
    class: "C",
    action: "canvas.dismissCanvasRefusal",
    statement:
      "no API equivalent exists -- the Dismiss button on the .canvas-refusal banner only clears local " +
      "App state (setCanvasRefusal(null)); it never reaches the kernel and never touches the status " +
      "indicator beside it (rider 1).",
    owner: 'docs/03 §"The action console" (pure view state)',
  },
  {
    class: "C",
    action: "canvas.dismissViewportRefusal",
    statement:
      "no API equivalent exists -- the Dismiss button on the viewport-refusal banner only clears local " +
      "App state (setViewportRefusal(null)); it never reaches the kernel.",
    owner: 'docs/03 §"The action console" (pure view state)',
  },
];

/** The full registry: every classified GUI action, in no particular order. */
export const SURFACE_REGISTRY: readonly SurfaceRow[] = [...CLASS_A_ROWS, ...CLASS_B_ROWS, ...CLASS_C_ROWS];

export function classARows(): readonly ClassARow[] {
  return SURFACE_REGISTRY.filter((row): row is ClassARow => row.class === "A");
}

export function classBRows(): readonly ClassBRow[] {
  return SURFACE_REGISTRY.filter((row): row is ClassBRow => row.class === "B");
}

export function classCRows(): readonly ClassCRow[] {
  return SURFACE_REGISTRY.filter((row): row is ClassCRow => row.class === "C");
}
