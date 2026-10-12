// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import {
  HOVER_BELOW_RESOLUTION_TEXT,
  HOVER_SESSION_ENDED_TEXT,
  idLine,
} from "../canvas/HoverReadoutView";
import { actionEntry } from "../layout/actionRegistry";
import type { SelectionCounts, SelectionNotice } from "../workspace/selection";
import type { InspectedFeature, InspectedPick } from "../workspace/workspaceState";

/**
 * The Feature tab (SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md §2.6): the Inspector's third tab, in the slot
 * `inspector.feature`. It shows the inspected feature (the id line from HoverReadoutView's exported `idLine`, the pin,
 * whether it is drawn), the last-click line, the selection summary with its counts, Zoom to selection, Clear selection
 * and the notice.
 *
 * A pure view: it holds no state, makes no call and records nothing. Every value is App's, and so is every handler (the
 * class-C rows are written in App's handlers). **It never renders an element with the class `hover-readout`** (§8 item
 * 15): the readout stays over the map (Amendment 1 A8), and this tab is not a second one.
 *
 * Labels: Feature, Pin, Zoom to selection and Clear selection are the human's (Amendment 1 A11), as are the words
 * `Selected, ignoring filter` (the plan's section 3 label; only that count is shown, A9). The two refusals' texts are
 * HoverReadoutView's own constants. Everything else is a P6 placeholder.
 */

/** Whether the inspected feature is drawn. Decided by App from a current view box only (Amendment 2 item 2 (c)): with
 * no current box App passes `null` and the tab shows no status and no reason. */
export type InspectedStatus = "drawn" | "outside-view" | "in-view-not-drawn";

/** What the last click was, as the tab's last-click line states it. */
export type LastClick =
  /** A click on a feature. `keptPinned` is the pinned feature a Navigate click left inspected (Amendment 1 A5). */
  | { readonly kind: "feature"; readonly pick: InspectedPick; readonly keptPinned: InspectedPick | null }
  | { readonly kind: "nothing" }
  | { readonly kind: "below-pick-resolution" }
  | { readonly kind: "session-ended" };

/** The label of the count shown: every selected feature, ignoring the filter (the plan's section 3; Amendment 1 A9). */
const SELECTED_LABEL = "Selected, ignoring filter";

const STATUS_TEXT: Record<InspectedStatus, string> = {
  drawn: "[P6 placeholder] Drawn in the view.",
  "outside-view": "[P6 placeholder] Not drawn: outside the view.",
  "in-view-not-drawn": "[P6 placeholder] Not drawn: in the view.",
};

function lastClickLine(click: LastClick): JSX.Element {
  switch (click.kind) {
    case "feature":
      return (
        <p className="feature-last-click">
          {click.keptPinned === null
            ? `[P6 placeholder] Last click: ${idLine(click.pick)}.`
            : `[P6 placeholder] Last click: ${idLine(click.pick)}. The pinned feature, id ${click.keptPinned.id.toString()}, stays inspected.`}
        </p>
      );
    case "nothing":
      return <p className="feature-last-click">[P6 placeholder] Last click: no feature there.</p>;
    case "below-pick-resolution":
      return <p className="feature-last-click feature-last-click-below-resolution">{HOVER_BELOW_RESOLUTION_TEXT}</p>;
    case "session-ended":
      return <p className="feature-last-click feature-last-click-session-ended">{HOVER_SESSION_ENDED_TEXT}</p>;
  }
}

function noticeText(notice: SelectionNotice): string {
  if (notice.kind === "refused") {
    return `[P6 placeholder] The selection holds at most ${notice.refusal.max} features: this one was not added.`;
  }
  const because = notice.reason === "source-changed" ? "the source file changed" : "a dataset was opened";
  const dropped = `${notice.dropped} selected ${notice.dropped === 1 ? "feature was" : "features were"} dropped`;
  return `[P6 placeholder] The selection ended: ${dropped}, because ${because}.`;
}

export interface FeatureTabProps {
  inspected: InspectedFeature | null;
  pinned: boolean;
  inspectedStatus: InspectedStatus | null;
  lastClick: LastClick | null;
  counts: SelectionCounts;
  notice: SelectionNotice | null;
  onPin: (pinned: boolean) => void;
  onZoomToSelection: () => void;
  onClearSelection: () => void;
}

export function FeatureTab({
  inspected,
  pinned,
  inspectedStatus,
  lastClick,
  counts,
  notice,
  onPin,
  onZoomToSelection,
  onClearSelection,
}: FeatureTabProps) {
  const zoom = actionEntry("selection.zoomTo");
  const clear = actionEntry("selection.clear");
  const nothingSelected = counts.selected === 0;
  return (
    <div className="feature-tab">
      <section className="feature-inspected" aria-label="[P6 placeholder] Inspected feature">
        {inspected === null ? (
          <p className="feature-empty">[P6 placeholder] No feature is inspected.</p>
        ) : (
          <>
            <div className="feature-id">{idLine(inspected.pick)}</div>
            <button type="button" className="feature-pin" aria-pressed={pinned} onClick={() => onPin(!pinned)}>
              Pin
            </button>
            {inspectedStatus !== null && <p className="feature-status">{STATUS_TEXT[inspectedStatus]}</p>}
          </>
        )}
        {lastClick !== null && lastClickLine(lastClick)}
      </section>
      <section className="feature-selection" aria-label="[P6 placeholder] Selection">
        <p className="feature-selected">{`${SELECTED_LABEL}: ${counts.selected}`}</p>
        {counts.outsideView !== null && (
          <p className="feature-outside-view">{`[P6 placeholder] Outside the view: ${counts.outsideView}`}</p>
        )}
        {counts.inViewNotDrawn !== null && (
          <p className="feature-in-view-not-drawn">{`[P6 placeholder] In the view, not drawn: ${counts.inViewNotDrawn}`}</p>
        )}
        {notice !== null && (
          <p className="feature-notice" role="status">
            {noticeText(notice)}
          </p>
        )}
        <div className="feature-actions">
          <button type="button" disabled={nothingSelected} onClick={onZoomToSelection}>
            {zoom.label}
          </button>
          <button type="button" disabled={nothingSelected} onClick={onClearSelection}>
            {clear.label}
          </button>
        </div>
        <p className="feature-scope">{`[P6 placeholder] ${zoom.label} acts on: ${zoom.scopeWords}`}</p>
      </section>
    </div>
  );
}
