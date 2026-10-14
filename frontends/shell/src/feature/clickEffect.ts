// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import { applySelectionMode } from "../workspace/selection";
import {
  viewInspected,
  viewPinned,
  viewSelection,
  viewSelectionMode,
  viewTool,
} from "../workspace/viewTransitions";
import type { ViewTransition } from "../workspace/viewTransitions";
import type { InspectedPick, ViewState } from "../workspace/workspaceState";
import type { LastClick } from "./FeatureTab";

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.2, "The click", with Amendment 1 A4, A5 and B1: what one click
 * resolved by the canvas (`canvas/clickPick.ts`'s `ClickPick`, which this type mirrors member for member) does to a view,
 * by the tool, the mode and the pin. Pure: `App.tsx` dispatches the transitions, records the class-C row and sets the
 * last-click line. The pick is never taken from the hover readout (section 8 item 3).
 *
 * - **Session ended:** the click is the named session-ended state and changes nothing (the latch the hover has).
 * - **Below the 9 px rule:** nothing changes in any tool; the last-click line carries the refusal's own text.
 * - **A click on nothing:** changes no selection in any tool or mode. In Navigate it clears an inspected feature that is
 *   not pinned; in Select it does nothing (B1).
 * - **Select, on a feature:** the selection changes by the mode and the inspected feature is untouched (A4).
 * - **Navigate, on a feature:** it inspects and the selection is untouched, unless a feature is pinned: then the pinned one
 *   is kept and the last-click line names the clicked one and says so (A5).
 */
export type ClickInput =
  | { readonly kind: "feature"; readonly pick: InspectedPick; readonly bounds: AuthoritativeBbox }
  | { readonly kind: "below-pick-resolution" }
  | { readonly kind: "nothing" };

interface ClickEffect {
  readonly lastClick: LastClick;
  readonly transitions: readonly ViewTransition[];
  /** The class-C row to record, when the click applied something. */
  readonly row: "feature.inspect" | "selection.change" | null;
}

export function clickEffect(view: ViewState, click: ClickInput, sessionEnded: boolean): ClickEffect {
  if (sessionEnded) return { lastClick: { kind: "session-ended" }, transitions: [], row: null };
  if (click.kind === "below-pick-resolution") return { lastClick: click, transitions: [], row: null };
  const navigate = viewTool(view) === "navigate";
  if (click.kind === "nothing") {
    const clears = navigate && !viewPinned(view) && viewInspected(view) !== null;
    return {
      lastClick: click,
      transitions: clears ? [{ action: "inspect.set", params: null }] : [],
      row: clears ? "feature.inspect" : null,
    };
  }
  const { pick, bounds } = click;
  if (!navigate) {
    const mode = viewSelectionMode(view);
    const changed = applySelectionMode(viewSelection(view), mode, pick.id, bounds).kind === "changed";
    return {
      lastClick: { kind: "feature", pick, keptPinned: null },
      transitions: [{ action: "selection.apply", params: { mode, id: pick.id, bounds } }],
      row: changed ? "selection.change" : null,
    };
  }
  const kept = viewPinned(view) ? (viewInspected(view)?.pick ?? null) : null;
  if (kept !== null) return { lastClick: { kind: "feature", pick, keptPinned: kept }, transitions: [], row: null };
  return {
    lastClick: { kind: "feature", pick, keptPinned: null },
    transitions: [{ action: "inspect.set", params: { pick, bounds } }],
    row: "feature.inspect",
  };
}
