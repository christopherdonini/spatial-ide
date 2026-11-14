// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { admitsMatchKeyType } from "../../../../renderer/style-ts/src/style";
import { recordNamed } from "../console/recorder";
import type { Filter } from "../skp/types";
import { sameFilter } from "../table/tableScope";
import type { TableSource } from "../table/tableSource";
import { buildCategoryCases, waitForFirstScope } from "./categoryCases";
import type { FirstScopeWait } from "./categoryCases";
import Legend from "./Legend";
import { CATEGORY_NULL_COLOR, CATEGORY_OTHER_COLOR } from "./styleConstants";
import {
  DEFAULT_STYLE_STATE,
  MAX_OPACITY,
  MAX_OUTLINE_WIDTH,
  MIN_OPACITY,
  MIN_OUTLINE_WIDTH,
  toStyleDocument,
} from "./document";
import type { StyleState } from "./document";

interface StylePanelProps {
  /** The view's style state (held in the workspace by `App.tsx`) -- this panel never holds a second copy of it, only the
   * local `expanded` disclosure flag, the chosen column and the Colour by line below. `document.ts`'s `toStyleDocument` is the one function
   * anywhere in this tree that turns this into a §5a document (binding note 2/5); this panel calls
   * it for display, never re-derives the document's shape itself. */
  style: StyleState;
  /** Every control below calls this with a FRESH `StyleState` object -- `App.tsx`'s `handleStyleChange`,
   * which dispatches one `style.set` transition per changed property and has no viewport/manager/network
   * parameter anywhere in its own signature (binding note 7: a style change issues no query of its own). */
  onChange: (next: StyleState) => void;
  /** B2-1B-RECORDING-PREREGISTRATION.md section 2.5: called once per COMMITTED edit with the whole next
   * `StyleState` -- the native `change` event of each of the four controls (release of a range, close of a
   * colour picker, one keyboard step) and Reset -- never per drag tick, which only `onChange` sees. A Reset says so
   * in `source`: the owner shows a Reset that changes nothing in the console, where no step is recorded. */
  onCommit: (next: StyleState, source?: "reset") => void;
  /** The open's projected columns with their Arrow types (`projectionFor` over `describe`). The Colour by chooser lists those whose type `renderer/style-ts` admits as a match key; this panel writes no type rule. */
  columns: readonly { readonly name: string; readonly arrowType: string }[];
  /** The table's first scope for this open, where the cases are read from (`categoryCases.ts`); `null` before one exists. */
  source: TableSource | null;
  /** The view's filter, the first scope's. */
  filter: Filter | null;
  /** An export holds the dataset: the apply issues nothing (a table stream is not issued while a consumer is held). */
  exportHeld: boolean;
}

/** The Colour by lines (P6 placeholders). */
const LINE_WAITING = "[P6 placeholder] Reading the first features to find the values.";
const LINE_EXPORT_HELD = "[P6 placeholder] Colour by is not available while an export is in progress.";
const LINE_NO_COLUMN = "[P6 placeholder] No column of this file can colour the map.";
const LINE_NOT_APPLIED: Record<"cancelled" | "refused" | "ended" | "abandoned" | "filter" | "none", string> = {
  cancelled: "[P6 placeholder] Cancelled. Nothing was applied.",
  abandoned: "[P6 placeholder] Cancelled. Nothing was applied.",
  refused: "[P6 placeholder] The values could not be read, so nothing was applied.",
  ended: "[P6 placeholder] The dataset's session ended, so nothing was applied.",
  filter: "[P6 placeholder] The filter changed while the values were read, so nothing was applied.",
  none: "[P6 placeholder] The column holds no value among the features read, so nothing was applied.",
};

/**
 * The style panel (NEXT-CUT.md style-panel cut P4). Adopts ADR-017 §5a exactly (ADR-022) -- see
 * `document.ts`'s own top doc comment for how every refusal `spatial_renderer::style::parse`
 * enforces is closed structurally by this tree's one document producer, `toStyleDocument`.
 *
 * **Collapsed by default** (binding note 6). The stacked layout's figures -- a 200px canvas floor and
 * ~21.8px of headroom above it at 1280x800, with the measurements `styles.css`'s `.style-panel`
 * comment records -- are HISTORY (milestone 1), not the current frame. The panel is now the
 * Inspector's Style tab (`App.tsx`'s `"inspector.style"` slot), and `.canvas-container` fills the map
 * region (`styles.css`) with no floor of its own; the map region's minimum is
 * `layout/layoutConstants.ts`'s.
 *
 * **Outline controls are live** (NEXT-CUT.md P5): `canvas/buildLayers.ts` draws a separate,
 * non-pickable `PathLayer` per batch whenever `outlineWidth > 0` -- see that module's own doc
 * comment for the construction and its declared cost. `StyleState`'s default `outlineWidth` is `0`
 * (`document.ts`'s `DEFAULT_STYLE_STATE` doc comment: "no outline is drawn today"), so a freshly
 * opened dataset shows no outline until the operator raises this control above zero.
 *
 * **Where the style lives** (binding note 4): `style` is the view's member of the workspace state; this panel
 * holds none of it and writes no file (a project save writes it, `project/saveProject.ts`). A COMMITTED edit is
 * recorded by `onCommit` as a `style.set` step in the kernel's session history (ADR-022 Amendment 1; ADR-036,
 * Accepted 2026-10-22), which restores nothing and is not undo. "Reset to default" below is a FRESH EDIT setting `DEFAULT_STYLE_STATE` -- never undo-flavoured
 * language or machinery.
 *
 * **No Save, no publish affordance** (D1 standing recommendation; binding note 8): the document
 * text is read-only, selectable, and copyable -- the hero round-trip is "copy this text, paste it
 * at `publish-bundle --style`," never a button anywhere in this tree.
 */
export default function StylePanel({ style, onChange, onCommit, columns, source, filter, exportHeld }: StylePanelProps) {
  const [expanded, setExpanded] = useState(false);
  const candidates = columns.filter((c) => admitsMatchKeyType(c.arrowType));
  const [column, setColumn] = useState(style.fillMatch?.column ?? "");
  const [line, setLine] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const waitRef = useRef<FirstScopeWait | null>(null);
  const filterRef = useRef(filter);
  filterRef.current = filter;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  // The wait ends with the panel (a dataset change keys a new one): it cancels a stream it issued and leaves a joined one running.
  useEffect(() => () => waitRef.current?.abandon(), []);
  const fillColorRef = useRef<HTMLInputElement>(null);
  const fillOpacityRef = useRef<HTMLInputElement>(null);
  const outlineColorRef = useRef<HTMLInputElement>(null);
  const outlineWidthRef = useRef<HTMLInputElement>(null);
  // The listeners below are bound once per disclosure; these refs give them the style and the callback as of the commit.
  const styleRef = useRef(style);
  styleRef.current = style;
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;

  // S2 (reviewer gate, action-console P7 fixes): React's own `onChange` prop is bound to the
  // native `input` event for `<input type="range">` (React treats "range" as a text-like control
  // needing per-tick normalization -- see react-dom's own `supportedInputTypes` table), so it
  // fires once PER DRAG TICK, not once per drag -- roughly 100 times for one slow drag. Recording
  // one console entry per tick was evicting the console's 256-entry ring after about three drags.
  // The native DOM `change` event, by contrast, fires exactly once per COMMIT (pointer release for
  // a mouse drag; once per discrete step for a keyboard adjustment) -- but React's synthetic event
  // system dedupes a later native `change` against the value the preceding native `input` already
  // reported, so a plain `onChange` prop never sees it as a second call. Binding `change` directly
  // via `addEventListener` here bypasses that normalization and gets the commit-only signal for
  // real. `onChange` on the elements below stays wired to the LIVE style update (fires every tick,
  // so the canvas keeps repainting as the operator drags); these two effects own ONLY the console
  // record, once per commit, never per tick.
  //
  // B2 piece 1b: the same native `change` of ALL FOUR controls is now the commit signal for `onCommit`
  // (the session history's step), in place of the console rows these effects used to record: a commit
  // shows as the captured `record_step` request (class A). A colour picker fires `change` when it closes.
  // The next style is the control's own value over the style as of the commit, lowercased as `handleFillColor`
  // does, so it does not depend on React having rendered the last tick.
  useEffect(() => {
    if (!expanded) return;
    const controls: Array<[HTMLInputElement | null, (value: string) => StyleState]> = [
      [fillColorRef.current, (v) => ({ ...styleRef.current, fillColor: v.toLowerCase(), fillMatch: null })],
      [fillOpacityRef.current, (v) => ({ ...styleRef.current, fillOpacity: Number(v) })],
      [outlineColorRef.current, (v) => ({ ...styleRef.current, outlineColor: v.toLowerCase() })],
      [outlineWidthRef.current, (v) => ({ ...styleRef.current, outlineWidth: Number(v) })],
    ];
    const removers: Array<() => void> = [];
    for (const [el, next] of controls) {
      if (!el) continue;
      const onCommitChange = () => onCommitRef.current(next(el.value));
      el.addEventListener("change", onCommitChange);
      removers.push(() => el.removeEventListener("change", onCommitChange));
    }
    return () => removers.forEach((remove) => remove());
  }, [expanded]);

  function handleFillColor(e: ChangeEvent<HTMLInputElement>): void {
    // WHATWG HTML's `<input type="color">` value sanitization algorithm normalizes to a valid
    // LOWERCASE simple color on every set
    // (https://html.spec.whatwg.org/multipage/input.html#color-state-(type=color)) -- `.value` is
    // therefore already lowercase `#rrggbb` in practice. Lowercased again here anyway, AT THE
    // CONTROL BOUNDARY -- the same defensive discipline `document.ts`'s own `normalizeColor` uses
    // (never trust a boundary even when the spec already guarantees it); `toStyleDocument`
    // normalizes a second time regardless when the document is built, so this is
    // belt-and-suspenders, not the only guard against a malformed literal (binding note 5).
    onChange({ ...style, fillColor: e.target.value.toLowerCase(), fillMatch: null });
  }

  function handleFillOpacity(e: ChangeEvent<HTMLInputElement>): void {
    // S2 (reviewer gate, action-console P7 fixes): the console record moved to COMMIT -- see the
    // `change`-event effect above. This handler stays responsible ONLY for the live style update,
    // called on every drag tick same as before.
    onChange({ ...style, fillOpacity: Number(e.target.value) });
  }

  function handleOutlineColor(e: ChangeEvent<HTMLInputElement>): void {
    onChange({ ...style, outlineColor: e.target.value.toLowerCase() });
  }

  function handleOutlineWidth(e: ChangeEvent<HTMLInputElement>): void {
    // S2: see handleFillOpacity's own comment above -- the record moved to the `change`-event
    // effect; this handler is the live style update only.
    onChange({ ...style, outlineWidth: Number(e.target.value) });
  }

  /** Colour by (section 2.3 (d)): waits for the first scope, builds the cases, and applies them as one edit and one commit. Anything but rows applies nothing. */
  async function applyColourBy(): Promise<void> {
    if (source === null || column === "" || exportHeld || waitRef.current !== null) return;
    const wait = waitForFirstScope(source, filter);
    waitRef.current = wait;
    setWaiting(true);
    setLine(LINE_WAITING);
    const outcome = await wait.result;
    if (waitRef.current !== wait) return;
    waitRef.current = null;
    setWaiting(false);
    if (outcome.kind === "not-applied") return setLine(LINE_NOT_APPLIED[outcome.reason]);
    if (!sameFilter(outcome.snapshot.filter, filterRef.current)) return setLine(LINE_NOT_APPLIED.filter);
    const { cases, found, other } = buildCategoryCases(outcome.snapshot, column);
    if (cases.length === 0) return setLine(LINE_NOT_APPLIED.none);
    const next: StyleState = { ...styleRef.current, fillMatch: { column, cases, onNull: CATEGORY_NULL_COLOR, onUnmatched: CATEGORY_OTHER_COLOR } };
    onChangeRef.current(next);
    onCommitRef.current(next);
    setLine(`[P6 placeholder] Coloured by ${column}: ${found} distinct values found among the first ${outcome.snapshot.count} features read, ${other} of them drawn as Other. A value not among those features also draws as Other.`);
  }

  function handleCancelColourBy(): void {
    const wait = waitRef.current;
    waitRef.current = null;
    wait?.abandon();
    setWaiting(false);
    setLine(LINE_NOT_APPLIED.abandoned);
  }

  function handleOneColour(): void {
    const next = { ...style, fillMatch: null };
    onChange(next);
    onCommit(next);
    setLine(null);
  }

  function handleReset(): void {
    // "Reset to default" is a FRESH EDIT, never undo-flavoured (NEXT-CUT.md binding note 4). It is one commit.
    onChange(DEFAULT_STYLE_STATE);
    onCommit(DEFAULT_STYLE_STATE, "reset");
  }

  return (
    <div className="style-panel">
      <button
        type="button"
        className="style-disclosure"
        onClick={() => {
          recordNamed("gui-action", "style.togglePanelExpanded");
          setExpanded((v) => !v);
        }}
        aria-expanded={expanded}
      >
        {expanded ? "▾" : "▸"} Style
      </button>
      {expanded && (
        <div className="style-controls">
          <label>
            Fill colour
            <input
              type="color"
              ref={fillColorRef}
              className="style-fill-color"
              value={style.fillColor}
              onChange={handleFillColor}
            />
          </label>
          <label>
            Fill opacity
            {/* NIT (reviewer gate, style-panel cut P7 fixes): `DEFAULT_STYLE_STATE.fillOpacity` is
              * 180/255 = 0.70588235... -- not a multiple of this `step`, so the FIRST drag on a
              * freshly opened panel visibly snaps the thumb to the nearest 0.01 (0.70 or 0.71), a
              * one-time cosmetic jump on an otherwise smooth control. Left as-is: `step={0.01}` is
              * NEXT-CUT.md's own literal instruction, the snap is imperceptible in the rendered
              * fill, and `toStyleDocument` clamps/accepts either value identically either way. */}
            <input
              ref={fillOpacityRef}
              type="range"
              className="style-fill-opacity"
              min={MIN_OPACITY}
              max={MAX_OPACITY}
              step={0.01}
              value={style.fillOpacity}
              onChange={handleFillOpacity}
            />
          </label>
          <label>
            Outline colour
            <input
              type="color"
              ref={outlineColorRef}
              className="style-outline-color"
              value={style.outlineColor}
              onChange={handleOutlineColor}
            />
          </label>
          <label>
            Outline width
            <input
              ref={outlineWidthRef}
              type="range"
              className="style-outline-width"
              min={MIN_OUTLINE_WIDTH}
              max={MAX_OUTLINE_WIDTH}
              step={1}
              value={style.outlineWidth}
              onChange={handleOutlineWidth}
            />
          </label>
          <button type="button" className="style-reset" onClick={handleReset}>
            Reset to default
          </button>
          {/* docs/01 "plain text everywhere" / docs/03 "GUI over the DSL" minimal form: the
            * document IS the model, shown verbatim, selectable and copyable -- the hero round-trip
            * (binding note 8) is "copy this text, paste it at `publish-bundle --style`," never a
            * button anywhere in this tree. */}
          <pre className="style-document">{JSON.stringify(toStyleDocument(style), null, 2)}</pre>
        </div>
      )}
      <div className="style-colour-by">
        <label>
          [P6 placeholder] Colour by
          <select className="style-colour-column" value={column} onChange={(e) => setColumn(e.target.value)}>
            <option value="">[P6 placeholder] Choose a column</option>
            {candidates.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="style-colour-apply" disabled={source === null || column === "" || exportHeld || waiting} onClick={() => void applyColourBy()}>
          [P6 placeholder] Apply
        </button>
        {waiting && (
          <button type="button" className="style-colour-cancel" onClick={handleCancelColourBy}>
            [P6 placeholder] Cancel
          </button>
        )}
        <button type="button" className="style-one-colour" disabled={style.fillMatch === null} onClick={handleOneColour}>
          [P6 placeholder] One colour
        </button>
        <p className="style-colour-line" role="status">
          {exportHeld ? LINE_EXPORT_HELD : candidates.length === 0 ? LINE_NO_COLUMN : line}
        </p>
        <Legend style={style} />
      </div>
    </div>
  );
}
