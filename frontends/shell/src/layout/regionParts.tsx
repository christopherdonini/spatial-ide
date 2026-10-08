// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

import { SCAN_LIVENESS_DELAY_MS, isScanInFlight } from "../App";
import type { ScanState } from "../App";
import { scanMirrorText, watcherStatusText } from "./statusItems";
import type { WatcherFacts } from "./statusItems";

/**
 * The frame's small parts (SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §2.1 and §2.5): the tab
 * list, the splitter, a section heading, the Layers row, and the two status-bar items that compute.
 * Pure view components: none imports the recorder or touches the kernel; `StudioLayout` owns every
 * dispatch and every console row.
 */

export interface TabEntry<T extends string> {
  readonly id: T;
  readonly label: string;
}

/** The ARIA tabs pattern: a roving tabindex, arrow keys (and Home and End) between tabs. */
export function TabList<T extends string>({
  label,
  idPrefix,
  tabs,
  selected,
  onSelect,
}: {
  label: string;
  idPrefix: string;
  tabs: readonly TabEntry<T>[];
  selected: T;
  onSelect: (tab: T) => void;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number): void {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    onSelect(tabs[next].id);
    document.getElementById(`${idPrefix}-tab-${tabs[next].id}`)?.focus();
  }

  return (
    <div role="tablist" aria-label={label} className="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${tab.id}`}
          aria-selected={tab.id === selected}
          aria-controls={`${idPrefix}-panel-${tab.id}`}
          tabIndex={tab.id === selected ? 0 : -1}
          onClick={() => onSelect(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/** A layout-owned section heading: a disclosure button with `aria-expanded` (§2.1). */
export function SectionHeading({
  label,
  contentId,
  expanded,
  onToggle,
}: {
  label: string;
  contentId: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <h3 className="section-heading">
      <button type="button" aria-expanded={expanded} aria-controls={contentId} onClick={onToggle}>
        {expanded ? "▾" : "▸"} {label}
      </button>
    </h3>
  );
}

/**
 * A focusable splitter (`role="separator"`) that resizes by pointer drag and by arrow keys.
 * `direction` is +1 when moving the pointer right (or down) grows the region and -1 when it shrinks it.
 * `onSet` is called with every new extent (live, never recorded); `onFinish` once per finished drag
 * and once per keyboard step -- the console rows are recorded there, never per pointer move (§2.6).
 */
export function Splitter({
  id,
  controls,
  axis,
  direction,
  size,
  min,
  max,
  step,
  label,
  hidden,
  onSet,
  onFinish,
}: {
  id: string;
  controls: string;
  axis: "x" | "y";
  direction: 1 | -1;
  size: number;
  min: number;
  max: number;
  step: number;
  label: string;
  hidden: boolean;
  onSet: (px: number) => void;
  onFinish: () => void;
}) {
  // The drag in progress: where the pointer started and what the region measured then.
  const drag = useRef<{ start: number; startSize: number } | null>(null);
  const coordinate = (event: PointerEvent<HTMLDivElement>): number => (axis === "x" ? event.clientX : event.clientY);

  function finishDrag(): void {
    if (drag.current === null) return;
    drag.current = null;
    onFinish();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const forward = axis === "x" ? "ArrowRight" : "ArrowDown";
    const backward = axis === "x" ? "ArrowLeft" : "ArrowUp";
    if (event.key !== forward && event.key !== backward) return;
    event.preventDefault();
    onSet(size + direction * (event.key === forward ? step : -step));
    onFinish();
  }

  return (
    <div
      id={id}
      role="separator"
      tabIndex={0}
      className={`splitter splitter-${axis}`}
      aria-orientation={axis === "x" ? "vertical" : "horizontal"}
      aria-controls={controls}
      aria-label={label}
      aria-valuenow={size}
      aria-valuemin={min}
      aria-valuemax={max}
      hidden={hidden}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture?.(event.pointerId);
        drag.current = { start: coordinate(event), startSize: size };
      }}
      onPointerMove={(event) => {
        const dragging = drag.current;
        if (dragging !== null) onSet(dragging.startSize + direction * (coordinate(event) - dragging.start));
      }}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    />
  );
}

/**
 * The Layers row for the dataset on the map (§2.1): labelled with `describe.source.path_display`
 * exactly as the backend rendered it -- the frontend never parses a path -- cut to the row's width by
 * CSS with its full text in `title`. Its button is the old Zoom to layer, `.zoom-to-layer` unchanged.
 */
export function LayersRow({ pathDisplay, onZoomToLayer }: { pathDisplay: string; onZoomToLayer: () => void }) {
  return (
    <div className="layers-row">
      <span className="layers-row-label" title={pathDisplay}>
        {pathDisplay}
      </span>
      <button type="button" className="zoom-to-layer" onClick={onZoomToLayer}>
        Zoom to layer
      </button>
    </div>
  );
}

/**
 * The read-only scan-liveness mirror (OPEN-6): the same delayed text as `FilterPanel`'s own line, kept
 * visible in the status bar while the Inspector is closed. The delay is one one-shot timer per newly
 * in-flight stream, exactly `FilterPanel`'s realization of `scanLivenessTextShouldShow`'s threshold.
 * No Cancel here; Cancel stays in `FilterPanel` (ADR-021).
 */
export function ScanLivenessMirror({ scanState }: { scanState: ScanState }) {
  const inFlightHandle = isScanInFlight(scanState) ? scanState.streamHandle : null;
  const [delayElapsed, setDelayElapsed] = useState(false);
  useEffect(() => {
    setDelayElapsed(false);
    if (inFlightHandle === null) return;
    const timer = setTimeout(() => setDelayElapsed(true), SCAN_LIVENESS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [inFlightHandle]);

  const text = delayElapsed ? scanMirrorText(scanState, SCAN_LIVENESS_DELAY_MS) : null;
  if (text === null) return null;
  return (
    <div className="status-scan-liveness">
      <span className="scan-liveness-spinner" aria-hidden="true" />
      {text}
    </div>
  );
}

/** The watcher item (§2.5): nothing when `watcherStatusText` has no text. */
export function WatcherStatusItem({ facts, sessionEnded }: { facts: WatcherFacts; sessionEnded: boolean }) {
  const text = watcherStatusText(facts, sessionEnded);
  if (text === null) return null;
  return (
    <div className="status-source-watch" role="status">
      {text}
    </div>
  );
}
