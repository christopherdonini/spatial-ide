// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";

import RefusalBlock from "../admission/RefusalBlock";
import type { FormattedRefusal } from "../admission/formatRefusal";
import type { ApplyFilterOutcome, ScanState } from "../App";
import { SCAN_LIVENESS_DELAY_MS, isScanInFlight, scanLivenessText } from "../App";
import type { Filter } from "../skp/types";
import { predicateTextToFilter } from "./predicateInput";

interface FilterPanelProps {
  /** `activeFilter` (`App.tsx`) -- the last SUCCESSFULLY applied filter, distinct from whatever text
   * currently sits in the input (which may be un-applied, or a refused typo the input still shows
   * per P4 item 4's "input keeps text"). `null` while no filter is applied. */
  appliedFilter: Filter | null;
  /** `App.tsx`'s `handleApplyFilter` -- the SAME function the dev-only `queryWithFilter` E2E hook
   * calls (deviation-3 retrofit, "hook and panel drive the identical seam"). */
  onApply: (filter: Filter | null) => Promise<ApplyFilterOutcome>;
  /** App-owned, not panel-owned (P4 item 6: indicator scope is EVERY in-flight viewport stream, not
   * filter-only -- an ordinary pan/zoom drives this too). */
  scanState: ScanState;
  /** Calls `manager.cancelStream` and transitions `scanState` to `cancelled` AT THE CALL SITE
   * (`App.tsx`'s own binding-note-6 handling) -- this component only ever decides WHEN to show the
   * button, never how cancellation itself works. */
  onCancel: () => void;
}

/**
 * The filter panel (NEXT-CUT.md filter-panel cut P3): one text input, Apply, Clear, and the liveness/
 * cancel affordance ADR-021's acceptance condition requires (P4). **The droppable static column-list
 * extra (P3 item 3) was built, then dropped** -- a live E2E measurement (`e2e/regression.mjs`'s A9'
 * hover step, run fresh against this piece) showed it pushed `.canvas-container` past its
 * `min-height: 200px` floor in the suite's 1280x800 window (`.admission-panel`'s own ~450px plus this
 * panel's ~150px left only ~112px before the floor forced the canvas down far enough that its bottom
 * edge fell below the viewport, at which point a hover target computed from a correct, live bounding
 * rect still lands on a physically off-screen point). The piece's own scope fence named this extra
 * "droppable"; dropping it is that explicit escape hatch, not a silent scope cut -- see this piece's
 * report/CUT-STATE for the measured before/after. No consumer of a per-dataset column list exists
 * elsewhere in this tree; a future piece reintroducing it should budget its vertical footprint (a
 * scrollable, height-capped list, or a collapsed-by-default disclosure) against this exact ceiling.
 * **Out of scope, by name** (NEXT-CUT.md's scope fence): visual builder, autocomplete, saved/named
 * filters, "filtered layer" naming, publish/style, any measurement claim.
 */
export default function FilterPanel({ appliedFilter, onApply, scanState, onCancel }: FilterPanelProps) {
  const [predicateText, setPredicateText] = useState("");
  const [busy, setBusy] = useState(false);
  const [refusal, setRefusal] = useState<FormattedRefusal | null>(null);

  async function submit(text: string): Promise<void> {
    setBusy(true);
    try {
      const outcome = await onApply(predicateTextToFilter(text));
      setRefusal(outcome.kind === "refused" ? outcome.refusal : null);
    } finally {
      setBusy(false);
    }
  }

  function handleApplyClick(): void {
    void submit(predicateText);
  }

  function handleClearClick(): void {
    setPredicateText("");
    void submit("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      handleApplyClick();
    }
  }

  // P4 item 2: "Text indicator gated by a declared SCAN_LIVENESS_DELAY_MS constant (anti-flicker);
  // Cancel appears with ZERO delay." A one-shot timer reset per NEWLY in-flight stream (identified by
  // `streamHandle`, not merely `isScanInFlight(scanState)` -- the same handle staying in-flight across
  // `issuing`/`open-no-rows`/`delivering` must NOT restart the delay clock at each sub-transition) is
  // the direct realization of `scanLivenessTextShouldShow`'s own pure threshold (`App.tsx`), evaluated
  // once, at exactly `SCAN_LIVENESS_DELAY_MS`, rather than re-polled continuously.
  const inFlightHandle = isScanInFlight(scanState) ? scanState.streamHandle : null;
  const [showLivenessText, setShowLivenessText] = useState(false);
  useEffect(() => {
    setShowLivenessText(false);
    if (inFlightHandle === null) {
      return;
    }
    const timer = setTimeout(() => setShowLivenessText(true), SCAN_LIVENESS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [inFlightHandle]);

  const livenessMessage = showLivenessText ? scanLivenessText(scanState) : null;

  return (
    <div className="filter-panel">
      <div className="filter-controls">
        <input
          type="text"
          className="filter-predicate"
          value={predicateText}
          onChange={(e) => setPredicateText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. zone = 'residential'"
        />
        <button type="button" className="filter-apply" onClick={handleApplyClick} disabled={busy}>
          Apply
        </button>
        <button type="button" className="filter-clear" onClick={handleClearClick}>
          Clear
        </button>
        {/* P4 item 2/7: ZERO delay, never gated by SCAN_LIVENESS_DELAY_MS -- Cancel's own visibility
          * is `isScanInFlight` alone. Copy carries no duration word or figure (binding note 4; ADR-018
          * retires "acknowledged" from prose -- this button says neither). */}
        {isScanInFlight(scanState) && (
          <button type="button" className="filter-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      {appliedFilter && <p className="filter-active">Applied: {appliedFilter.predicate}</p>}

      {livenessMessage && (
        <div className="scan-liveness" role="status">
          <span className="scan-liveness-spinner" aria-hidden="true" />
          {livenessMessage}
        </div>
      )}

      {refusal && (
        <div className="filter-refusal">
          <RefusalBlock refusal={refusal} />
        </div>
      )}
    </div>
  );
}
