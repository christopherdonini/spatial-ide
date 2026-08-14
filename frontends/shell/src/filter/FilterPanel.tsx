import { useState } from "react";
import type { KeyboardEvent } from "react";

import RefusalBlock from "../admission/RefusalBlock";
import type { FormattedRefusal } from "../admission/formatRefusal";
import type { ApplyFilterOutcome } from "../App";
import type { Filter } from "../skp/types";
import { predicateTextToFilter } from "./predicateInput";

interface FilterPanelProps {
  /** `activeFilter` (`App.tsx`) -- the last SUCCESSFULLY applied filter, distinct from whatever text
   * currently sits in the input (which may be un-applied, or a refused typo the input still shows).
   * `null` while no filter is applied. */
  appliedFilter: Filter | null;
  /** `App.tsx`'s `handleApplyFilter` -- the SAME function the dev-only `queryWithFilter` E2E hook
   * calls (deviation-3 retrofit, "hook and panel drive the identical seam"). */
  onApply: (filter: Filter | null) => Promise<ApplyFilterOutcome>;
}

/**
 * The filter panel (NEXT-CUT.md filter-panel cut P3): one text input, Apply, Clear, and the shared
 * refusal block. **The droppable static column-list extra (P3 item 3) was built, then dropped** -- a
 * live E2E measurement (`e2e/regression.mjs`'s A9' hover step, run fresh against this piece) showed it
 * pushed `.canvas-container` past its `min-height: 200px` floor in the suite's 1280x800 window
 * (`.admission-panel`'s own ~450px plus this panel's ~150px left only ~112px before the floor forced
 * the canvas down far enough that its bottom edge fell below the viewport, at which point a hover
 * target computed from a correct, live bounding rect still lands on a physically off-screen point).
 * The piece's own scope fence named this extra "droppable"; dropping it is that explicit escape hatch,
 * not a silent scope cut -- see this piece's report/CUT-STATE for the measured before/after. A future
 * piece reintroducing it should budget its vertical footprint (a scrollable, height-capped list, or a
 * collapsed-by-default disclosure) against this exact ceiling.
 *
 * **Liveness/cancel (P4) is a separate piece/commit**, layered on top of this one without changing
 * this component's own input/Apply/Clear/refusal behavior.
 *
 * **Out of scope, by name** (NEXT-CUT.md's scope fence): visual builder, autocomplete, saved/named
 * filters, "filtered layer" naming, publish/style, any measurement claim.
 */
export default function FilterPanel({ appliedFilter, onApply }: FilterPanelProps) {
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
      </div>

      {appliedFilter && <p className="filter-active">Applied: {appliedFilter.predicate}</p>}

      {refusal && (
        <div className="filter-refusal">
          <RefusalBlock refusal={refusal} />
        </div>
      )}
    </div>
  );
}
