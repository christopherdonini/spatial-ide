// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useRef, useSyncExternalStore } from "react";

import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import { bboxesMeet, countSelection } from "../workspace/selection";
import type { HiddenFacts, SelectionCounts, SelectionMembers } from "../workspace/selection";
import type { InspectedFeature } from "../workspace/workspaceState";
import { FeatureTab } from "./FeatureTab";
import type { FeatureTabProps, InspectedStatus } from "./FeatureTab";

/**
 * The view box the counts are made against (SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.3; Amendments 2 item 2
 * and 3): the box the canvas last reported for the current view, or `null` when none is current. A ref with a listener set,
 * not state, so that a pan, which reports a box every frame, renders nothing in `App` (navigation is not a transition,
 * section 2.4). `App` writes it from the canvas's three reports (`onViewportChanged`, `onViewportWithinLastQuery` and
 * `onViewShown`) and sets it back to `null` when the dataset is replaced; `FeaturePanel` subscribes.
 */
interface ViewBoxStore {
  get(): AuthoritativeBbox | null;
  set(box: AuthoritativeBbox | null): void;
  subscribe(listener: () => void): () => void;
}

export function createViewBoxStore(): ViewBoxStore {
  let box: AuthoritativeBbox | null = null;
  const listeners = new Set<() => void>();
  return {
    get: () => box,
    set(next) {
      box = next;
      for (const listener of [...listeners]) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}

interface Summary {
  readonly counts: SelectionCounts;
  readonly status: InspectedStatus | null;
}

/** The split and the inspected feature's drawn status, from a current box only: without one, the summary is Selected only
 * and the tab states no status (Amendment 2 item 2 (c)). Pure arithmetic over kept bounds; no scan and no query. */
function summarize(
  box: AuthoritativeBbox | null,
  members: SelectionMembers,
  drawn: ReadonlySet<bigint>,
  inspected: InspectedFeature | null,
  facts: HiddenFacts
): Summary {
  const status =
    inspected === null || box === null
      ? null
      : !bboxesMeet(inspected.bounds, box)
        ? "outside-view"
        : drawn.has(inspected.pick.id)
          ? "drawn"
          : "in-view-not-drawn";
  return { counts: countSelection(members, box, drawn, facts), status };
}

const sameSummary = (a: Summary, b: Summary): boolean =>
  a.status === b.status &&
  a.counts.selected === b.counts.selected &&
  a.counts.outsideView === b.counts.outsideView &&
  a.counts.inViewNotDrawn === b.counts.inViewNotDrawn;

interface FeaturePanelProps
  extends Omit<FeatureTabProps, "counts" | "inspectedStatus"> {
  box: ViewBoxStore;
  members: SelectionMembers;
  /** The selected and inspected ids the canvas reports as drawn. */
  drawn: ReadonlySet<bigint>;
  facts: HiddenFacts;
}

/**
 * The Feature tab with its summary subscribed to the view box: the counts are recomputed on every reported box and on every
 * change of the selection or of the drawn set, and the tab re-renders only when a count or the status changes (Amendment 2
 * item 2 (b)). The snapshot is cached on its inputs and returns the same object while the summary is equal.
 */
export function FeaturePanel({ box, members, drawn, facts, ...tab }: FeaturePanelProps) {
  const cache = useRef<{ inputs: readonly unknown[]; out: Summary } | null>(null);
  const getSnapshot = (): Summary => {
    const current = box.get();
    const inputs = [current, members, drawn, tab.inspected, facts.filterApplied, facts.viewComplete];
    const prev = cache.current;
    if (prev !== null && inputs.every((value, i) => value === prev.inputs[i])) return prev.out;
    const next = summarize(current, members, drawn, tab.inspected, facts);
    cache.current = { inputs, out: prev !== null && sameSummary(prev.out, next) ? prev.out : next };
    return cache.current.out;
  };
  const summary = useSyncExternalStore(box.subscribe, getSnapshot);
  return <FeatureTab {...tab} counts={summary.counts} inspectedStatus={summary.status} />;
}
