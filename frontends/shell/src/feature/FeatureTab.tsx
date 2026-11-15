// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import {
  HOVER_BELOW_RESOLUTION_TEXT,
  HOVER_SESSION_ENDED_TEXT,
  idLine,
} from "../canvas/HoverReadoutView";
import { ATTRIBUTE_PROJECTION_MAX } from "../attributes/projection";
import type { ProjectionSummary } from "../attributes/projection";
import { displayValue } from "../attributes/values";
import type { AttributeRow } from "../attributes/values";
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
 * **Attributes (milestone 4 PR A, section 2.2 (f)):** under the inspected feature, every projected column in declared order with its value or the NULL marker (ADR-023
 * entry 79 item (2)), a line naming the columns that are not projected, and the not-held state named. The values are the inspected feature's own `row`, copied at the click.
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

const NO_COLUMN_PROJECTED_TEXT = "[P6 placeholder] No attribute column is projected for this dataset.";
const NOT_HELD_TEXT = "[P6 placeholder] Attributes are not held for this feature: the resident attribute limit was reached.";

/** The line naming what the open leaves out: the columns the kernel does not admit for projection, and the projectable ones over the cap. */
function unprojectedLine(summary: ProjectionSummary): string | null {
  const parts = [
    summary.notProjected.length > 0 ? `Not projected: ${summary.notProjected.join(", ")}` : null,
    summary.leftOut > 0 ? `${summary.leftOut} projectable ${summary.leftOut === 1 ? "column" : "columns"} left out over the limit of ${ATTRIBUTE_PROJECTION_MAX}` : null,
  ].filter((part) => part !== null);
  return parts.length === 0 ? null : `[P6 placeholder] ${parts.join(". ")}.`;
}

function attributesSection(row: AttributeRow | "not-held" | null, summary: ProjectionSummary): JSX.Element {
  const unprojected = unprojectedLine(summary);
  return (
    <section className="feature-attributes" aria-label="[P6 placeholder] Attributes">
      {row === "not-held" && <p className="feature-attributes-not-held">{NOT_HELD_TEXT}</p>}
      {row === null && <p className="feature-attributes-none">{NO_COLUMN_PROJECTED_TEXT}</p>}
      {row !== null && row !== "not-held" && (
        <dl className="feature-attributes-list">
          {row.map((cell) => (
            <div className="feature-attribute" key={cell.name}>
              <dt className="feature-attribute-name">{cell.name}</dt>
              <dd className="feature-attribute-value">{displayValue(cell.value)}</dd>
            </div>
          ))}
        </dl>
      )}
      {unprojected !== null && <p className="feature-attributes-unprojected">{unprojected}</p>}
    </section>
  );
}

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

/** The notice's words: the Feature tab shows them, and so does the status bar item for an ended selection (App). */
export function noticeText(notice: SelectionNotice): string {
  if (notice.kind === "refused") {
    return `[P6 placeholder] The selection holds at most ${notice.refusal.max} features: this one was not added.`;
  }
  const because = notice.reason === "source-changed" ? "the source file changed" : "a dataset was opened";
  const dropped = `${notice.dropped} selected ${notice.dropped === 1 ? "feature was" : "features were"} dropped`;
  return `[P6 placeholder] The selection ended: ${dropped}, because ${because}.`;
}

export interface FeatureTabProps {
  inspected: InspectedFeature | null;
  /** What the open projects and leaves out (`attributes/projection.ts`'s `projectionSummary`), fixed for the open. */
  projection: ProjectionSummary;
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
  projection,
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
            {attributesSection(inspected.row, projection)}
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
