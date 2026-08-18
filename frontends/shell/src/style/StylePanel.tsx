// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { recordNamed } from "../console/recorder";
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
  /** App-owned style state (NEXT-CUT.md P3) -- this panel never holds a second copy of it, only the
   * local `expanded` disclosure flag below. `document.ts`'s `toStyleDocument` is the one function
   * anywhere in this tree that turns this into a §5a document (binding note 2/5); this panel calls
   * it for display, never re-derives the document's shape itself. */
  style: StyleState;
  /** Every control below calls this with a FRESH `StyleState` object -- `App.tsx`'s own `setStyle`,
   * a plain `useState` setter with no viewport/manager/network parameter anywhere in its own
   * signature (binding note 7: a style change issues no query). */
  onChange: (next: StyleState) => void;
}

/**
 * The style panel (NEXT-CUT.md style-panel cut P4). Adopts ADR-017 §5a exactly (ADR-022) -- see
 * `document.ts`'s own top doc comment for how every refusal `spatial_renderer::style::parse`
 * enforces is closed structurally by this tree's one document producer, `toStyleDocument`.
 *
 * **Collapsed by default** (binding note 6): the real headroom above `.canvas-container`'s 200px
 * floor at 1280x800, with `.admission-panel` and `.filter-panel` both at their present, shipped
 * size, measures ~21.8px -- much tighter than the ~112px `FilterPanel.tsx`'s own header quotes (that
 * figure predates its own column-list extra being dropped). This panel's collapsed/expanded
 * measurements, taken fresh (a killed-and-relaunched instance, one admission, no leftover state),
 * are recorded in full in `styles.css`'s `.style-panel` comment -- collapsed fits inside that ~21.8px
 * budget with a few px to spare; expanded does not, and is accepted for the stated reason there.
 *
 * **Outline controls are live** (NEXT-CUT.md P5): `canvas/buildLayers.ts` draws a separate,
 * non-pickable `PathLayer` per batch whenever `outlineWidth > 0` -- see that module's own doc
 * comment for the construction and its declared cost. `StyleState`'s default `outlineWidth` is `0`
 * (`document.ts`'s `DEFAULT_STYLE_STATE` doc comment: "no outline is drawn today"), so a freshly
 * opened dataset shows no outline until the operator raises this control above zero.
 *
 * **Ephemeral only** (binding note 4): `style` lives in `App.tsx`'s `useState`; nothing here or
 * there persists it (no project file, no `localStorage`, no session-recoverable state -- ADR-022's
 * consequences). "Reset to default" below is a FRESH EDIT setting `DEFAULT_STYLE_STATE` -- never
 * undo-flavoured language or machinery.
 *
 * **No Save, no publish affordance** (D1 standing recommendation; binding note 8): the document
 * text is read-only, selectable, and copyable -- the hero round-trip is "copy this text, paste it
 * at `publish-bundle --style`," never a button anywhere in this tree.
 */
export default function StylePanel({ style, onChange }: StylePanelProps) {
  const [expanded, setExpanded] = useState(false);
  const fillOpacityRef = useRef<HTMLInputElement>(null);
  const outlineWidthRef = useRef<HTMLInputElement>(null);

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
  useEffect(() => {
    if (!expanded) return;
    const el = fillOpacityRef.current;
    if (!el) return;
    const onCommit = () => recordNamed("gui-action", "style.setFillOpacity");
    el.addEventListener("change", onCommit);
    return () => el.removeEventListener("change", onCommit);
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const el = outlineWidthRef.current;
    if (!el) return;
    const onCommit = () => recordNamed("gui-action", "style.setOutlineWidth");
    el.addEventListener("change", onCommit);
    return () => el.removeEventListener("change", onCommit);
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
    // NEXT-CUT.md P3 item B (class C): recorded at the point this edit actually applies, i.e. the
    // `onChange` call itself -- never on render.
    recordNamed("gui-action", "style.setFillColor");
    onChange({ ...style, fillColor: e.target.value.toLowerCase() });
  }

  function handleFillOpacity(e: ChangeEvent<HTMLInputElement>): void {
    // S2 (reviewer gate, action-console P7 fixes): the console record moved to COMMIT -- see the
    // `change`-event effect above. This handler stays responsible ONLY for the live style update,
    // called on every drag tick same as before.
    onChange({ ...style, fillOpacity: Number(e.target.value) });
  }

  function handleOutlineColor(e: ChangeEvent<HTMLInputElement>): void {
    recordNamed("gui-action", "style.setOutlineColor");
    onChange({ ...style, outlineColor: e.target.value.toLowerCase() });
  }

  function handleOutlineWidth(e: ChangeEvent<HTMLInputElement>): void {
    // S2: see handleFillOpacity's own comment above -- the record moved to the `change`-event
    // effect; this handler is the live style update only.
    onChange({ ...style, outlineWidth: Number(e.target.value) });
  }

  function handleReset(): void {
    // "Reset to default" is a FRESH EDIT, never undo-flavoured (NEXT-CUT.md binding note 4).
    recordNamed("gui-action", "style.resetToDefault");
    onChange(DEFAULT_STYLE_STATE);
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
    </div>
  );
}
