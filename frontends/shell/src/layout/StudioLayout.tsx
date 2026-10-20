// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { Fragment, useEffect, useReducer, useRef, useState } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";

import CommandBar from "../command/CommandBar";
import type { CommandBarHandle, RunOutcome } from "../command/CommandBar";
import { recordNamed } from "../console/recorder";
import type { Tool } from "../workspace/workspaceState";
import { ACTIONS, ariaKeyShortcuts, currentPlatform, matchChord, matchCommandOpener, matchToolKey, shortcutLabel } from "./actionRegistry";
import type { ActionId, ToolActionId } from "./actionRegistry";
import {
  ACTIVITY_TABS,
  ATTENTION_ITEMS,
  ATTENTION_SLOT_IDS,
  INSPECTOR_SLOT_IDS,
  INSPECTOR_SLOT_TABS,
  INSPECTOR_TABS,
  LAYER_SECTIONS,
  REGIONS,
  STATUS_ITEMS,
} from "./contributions";
import type { RegionId, Slots } from "./contributions";
import {
  ATTENTION_MAX_HEIGHT_PX,
  RESIZE_STEP_PX,
  SPLITTER_PX,
  STATUS_BAR_HEIGHT_PX,
  TOP_BAR_HEIGHT_PX,
} from "./layoutConstants";
import { effectiveSizes, initialLayoutState, layoutReducer, sizeRangeOf } from "./layoutState";
import type { LayoutAction, SideRegion, Viewport } from "./layoutState";
import { LayersRow, SectionHeading, Splitter, TabList } from "./regionParts";

/**
 * The Map Studio frame (SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §2): the regions, their
 * toggles, tabs and sections, the three splitters and the one keyboard listener. DOM order is focus
 * order: top bar, Layers, attention strip, Map, Inspector, Activity, status bar. A closed region and an
 * inactive tab or section stay mounted and carry the `hidden` attribute; nothing is ever unmounted.
 * The map's slot sits at one fixed place in this tree and is keyed on nothing here (ADR-010 rule 1: the
 * map remounts on a new dataset handle, which `App.tsx` keys inside the slot, and on nothing else).
 *
 * The layout is pure view state for this session (plan §2 rule 10): the reducer is not keyed on the
 * dataset, so it survives a reopen; no action here calls SKP or marks the workspace. The only things
 * recorded are the class-C rows of §2.6, and this is the one layout file that imports `recordNamed`.
 *
 * The status bar's grid row and its height are one value, `STATUS_BAR_HEIGHT_PX`
 * (SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md Amendment 1, §2.4 (d)), so a status item coming or going never changes the map's size.
 */

const REGION_ID: Record<SideRegion, string> = {
  layers: "region-layers",
  inspector: "region-inspector",
  activity: "region-activity",
};

/** Which action toggles which region; Zoom to layer toggles nothing. */
const TOGGLE_REGION: Partial<Record<ActionId, SideRegion>> = {
  "layout.toggleLayers": "layers",
  "layout.toggleInspector": "inspector",
  "layout.toggleActivity": "activity",
};

/** Which tool a tool key selects. */
const TOOL_OF_ACTION: Record<ToolActionId, Tool> = { "tool.navigate": "navigate", "tool.select": "select" };

/** A region's heading, from the registered contributions (the sighted names). */
function regionLabel(id: RegionId): string {
  return REGIONS.find((region) => region.id === id)?.label ?? id;
}

/** The id of a region's splitter, which is not inside the region but is hidden with it. */
function splitterId(region: SideRegion): string {
  return `splitter-${region}`;
}

/** Whether a slot holds anything to draw: React renders none of `null`, `undefined`, `false` or `""`. */
function hasContent(node: ReactNode): boolean {
  return node !== null && node !== undefined && node !== false && node !== "";
}

function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(() => ({ width: window.innerWidth, height: window.innerHeight }));
  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return viewport;
}

/** One class-C console row per dispatched layout action (§2.6), written as literals so each row has a
 * visible call site. A resize is recorded separately, once per finished drag and once per keyboard
 * step (`recordResize`), never per pointer move. */
function recordLayoutAction(action: Exclude<LayoutAction, { kind: "resize" }>): void {
  switch (action.kind) {
    case "toggle":
      if (action.region === "layers") recordNamed("gui-action", "layout.toggleLayers");
      else if (action.region === "inspector") recordNamed("gui-action", "layout.toggleInspector");
      else recordNamed("gui-action", "layout.toggleActivity");
      return;
    case "selectTab":
      if (action.region === "inspector") recordNamed("gui-action", "layout.selectInspectorTab");
      else recordNamed("gui-action", "layout.selectActivityTab");
      return;
    case "toggleSection":
      recordNamed("gui-action", "layout.toggleSection");
      return;
  }
}

function recordResize(): void {
  recordNamed("gui-action", "layout.resizeRegion");
}

export interface StudioLayoutProps {
  /** Fixed overlays that sit outside every region (the global error banner). */
  overlays: ReactNode;
  /** The content of every slot. A missing slot is a `tsc` error. */
  slots: Slots;
  /** The Layers row for the dataset on the map: `describe.source.path_display`, or `null` before one
   * is admitted (there is no row then). */
  layersRow: { readonly pathDisplay: string } | null;
  /** The registry's `layer.zoomToLayer`: `App`'s existing `canvasRef.current?.fitToBounds()`. */
  onZoomToLayer: () => void;
  /** The registry's `tool.navigate` and `tool.select`, reached by their bare keys (milestone 2 §2.2). Consumer: App's
   * tool handler (§7 B-A, phase B). When absent a bare tool key is left alone, not consumed. */
  onSelectTool?: (tool: Tool) => void;
  /** Milestone 3 (Amendment 3 item 6): the registry's `selection.zoomTo` and `selection.clear` are App's handlers behind the Feature tab's buttons, `dataset.open` is the Layers panel's
   * `requestPick`, and `layer.revealExport` is the Export panel's `reveal`. An absent prop leaves its entry unavailable. `selectionAvailable` is the Feature tab's own enabling rule. */
  onZoomToSelection?: () => void;
  onClearSelection?: () => void;
  selectionAvailable?: boolean;
  onOpenDataset?: () => "started" | "busy";
  onRevealExport?: () => void;
}

export default function StudioLayout({
  overlays,
  slots,
  layersRow,
  onZoomToLayer,
  onSelectTool,
  onZoomToSelection,
  onClearSelection,
  selectionAvailable,
  onOpenDataset,
  onRevealExport,
}: StudioLayoutProps) {
  const [state, dispatch] = useReducer(layoutReducer, undefined, initialLayoutState);
  const viewport = useViewport();
  const platform = currentPlatform();
  const sizes = effectiveSizes(state, viewport);

  const mapRef = useRef<HTMLElement>(null);
  const barRef = useRef<CommandBarHandle>(null);
  /** The element that held the focus before the command bar took it (Ctrl+K, the bare `/` or a Tab in). */
  const heldRef = useRef<Element | null>(null);
  const regionRefs: Record<SideRegion, RefObject<HTMLElement>> = {
    layers: useRef<HTMLElement>(null),
    inspector: useRef<HTMLElement>(null),
    activity: useRef<HTMLElement>(null),
  };

  /** Dispatches `action` and records its console row. When the region being closed holds the focus,
   * the focus moves to the map first; the region's content stays mounted, so a field's text survives. */
  function apply(action: Exclude<LayoutAction, { kind: "resize" }>): void {
    if (action.kind === "toggle" && state[action.region].open) {
      const focused = document.activeElement;
      const holdsFocus =
        focused !== null &&
        (regionRefs[action.region].current?.contains(focused) === true || focused.id === splitterId(action.region));
      if (holdsFocus) mapRef.current?.focus();
    }
    dispatch(action);
    recordLayoutAction(action);
  }

  /** Whether the bar may run `id` now: with no dataset only open and the layout entries; the two selection entries follow the Feature tab's empty-selection rule. */
  function available(id: ActionId): boolean {
    const dataset = layersRow !== null;
    switch (id) {
      case "layer.zoomToLayer":
        return dataset;
      case "tool.navigate":
      case "tool.select":
        return dataset && onSelectTool !== undefined;
      case "selection.zoomTo":
        return dataset && selectionAvailable === true && onZoomToSelection !== undefined;
      case "selection.clear":
        return dataset && selectionAvailable === true && onClearSelection !== undefined;
      case "dataset.open":
        return onOpenDataset !== undefined;
      case "layer.revealExport":
        return dataset && onRevealExport !== undefined;
      case "filter.addClause":
        return false; // a product caller (App's clause handler) comes with the next step of PR B
      default:
        return true;
    }
  }


  /** Escape and an applied action: the focus goes back to the element held before, or to the map when there was none (the page body), or it is gone or inside a closed region. */
  function leaveBar(): void {
    const held = heldRef.current;
    const back = held instanceof HTMLElement && held !== document.body && held.isConnected && held.closest("[hidden]") === null ? held : mapRef.current;
    back?.focus();
  }

  /** The one dispatch (milestone 3, Amendment 3 item 6): the keys, the buttons and the bar all arrive here, and each arm calls the function its chord, bare key or button calls. */
  function runAction(id: ActionId): RunOutcome {
    const region = TOGGLE_REGION[id];
    if (region !== undefined) apply({ kind: "toggle", region });
    else if (id === "layer.zoomToLayer") onZoomToLayer();
    else if (id === "tool.navigate" || id === "tool.select") onSelectTool?.(TOOL_OF_ACTION[id]);
    else if (id === "selection.zoomTo") onZoomToSelection?.();
    else if (id === "selection.clear") onClearSelection?.();
    else if (id === "command.focus") {
      barRef.current?.take();
      return "moved-focus";
    } else if (id === "dataset.open") return onOpenDataset?.() === "busy" ? "busy" : "done";
    else if (id === "layer.revealExport") {
      if (!state.inspector.open) apply({ kind: "toggle", region: "inspector" });
      if (state.inspector.tab !== "layer") apply({ kind: "selectTab", region: "inspector", tab: "layer" });
      onRevealExport?.();
      return "moved-focus";
    }
    return "done";
  }

  // One `keydown` listener for the whole window; the closure is refreshed each render through a ref.
  const runActionRef = useRef(runAction);
  runActionRef.current = runAction;
  const onSelectToolRef = useRef(onSelectTool);
  onSelectToolRef.current = onSelectTool;
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const id = matchChord(event, platform);
      if (id !== null) {
        event.preventDefault();
        runActionRef.current(id);
        return;
      }
      // A bare key: the element that holds the key is the event's target, or the focused element when the
      // event was dispatched on the window.
      const holder = event.target instanceof Element ? event.target : document.activeElement;
      if (matchCommandOpener(event, holder)) {
        event.preventDefault();
        barRef.current?.take("/");
        return;
      }
      const selectTool = onSelectToolRef.current;
      if (selectTool === undefined) return;
      const tool = matchToolKey(event, holder);
      if (tool === null) return;
      event.preventDefault();
      selectTool(TOOL_OF_ACTION[tool]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [platform]);

  const attentionHasItems = ATTENTION_SLOT_IDS.some((id) => hasContent(slots[id]));
  const emptyInspectorText = !INSPECTOR_SLOT_IDS.some((id) => hasContent(slots[id])) ? (
    <p className="inspector-empty">[P6 placeholder] Nothing to show until a dataset is on the map.</p>
  ) : null;

  const cssVariables: CSSProperties & Record<`--${string}`, string> = {
    "--layers-w": `${sizes.layersWidth}px`,
    "--layers-split": `${state.layers.open ? SPLITTER_PX : 0}px`,
    "--inspector-w": `${sizes.inspectorWidth}px`,
    "--inspector-split": `${state.inspector.open ? SPLITTER_PX : 0}px`,
    "--activity-h": `${sizes.activityHeight}px`,
    "--activity-split": `${state.activity.open ? SPLITTER_PX : 0}px`,
    "--top-bar-h": `${TOP_BAR_HEIGHT_PX}px`,
    "--attention-max-h": `${ATTENTION_MAX_HEIGHT_PX}px`,
    "--status-h": `${STATUS_BAR_HEIGHT_PX}px`,
  };

  /** A splitter for `region`: a live resize on every move, one console row per finished drag or step. */
  function splitter(region: SideRegion, axis: "x" | "y", direction: 1 | -1, size: number, label: string) {
    const range = sizeRangeOf(region);
    return (
      <Splitter
        id={splitterId(region)}
        controls={REGION_ID[region]}
        axis={axis}
        direction={direction}
        size={size}
        min={range.min}
        max={range.max}
        step={RESIZE_STEP_PX}
        label={label}
        hidden={!state[region].open}
        onSet={(px) => dispatch({ kind: "resize", region, px })}
        onFinish={recordResize}
      />
    );
  }

  return (
    <div className="app" style={cssVariables}>
      {overlays}
      <header className="top-bar">
        <span className="app-header">Spatial IDE</span>
        <CommandBar ref={barRef} registry={ACTIONS} platform={platform} available={available} run={runAction} leave={leaveBar} held={heldRef} />
        {hasContent(slots["topBar.tools"]) && <div className="top-bar-tools">{slots["topBar.tools"]}</div>}
        <div className="top-bar-toggles">
          {ACTIONS.map((entry) => {
            const region = TOGGLE_REGION[entry.id];
            if (region === undefined || entry.chord === null) return null;
            return (
              <button
                key={entry.id}
                type="button"
                className="top-bar-toggle"
                aria-pressed={state[region].open}
                aria-controls={REGION_ID[region]}
                aria-keyshortcuts={ariaKeyShortcuts(entry.chord, platform)}
                onClick={() => runAction(entry.id)}
              >
                {`[P6 placeholder] ${entry.label} (${shortcutLabel(entry.chord, platform)})`}
              </button>
            );
          })}
        </div>
      </header>

      <aside id={REGION_ID.layers} ref={regionRefs.layers} className="region-layers" aria-label={regionLabel("layers")} hidden={!state.layers.open}>
        <h2 className="region-heading">{regionLabel("layers")}</h2>
        {slots["region.layers"]}
        {layersRow !== null && <LayersRow pathDisplay={layersRow.pathDisplay} onZoomToLayer={() => runAction("layer.zoomToLayer")} />}
      </aside>
      {splitter("layers", "x", 1, sizes.layersWidth, "[P6 placeholder] Resize Layers")}

      <section className="attention-strip" aria-label="[P6 placeholder] Attention" hidden={!attentionHasItems}>
        {ATTENTION_ITEMS.map((item) => (
          <Fragment key={item.id}>{slots[`attention.${item.id}`]}</Fragment>
        ))}
      </section>

      <main ref={mapRef} id="region-map" className="region-map" aria-label={regionLabel("map")} tabIndex={0}>
        {slots["region.map"]}
      </main>

      {splitter("inspector", "x", -1, sizes.inspectorWidth, "[P6 placeholder] Resize Inspector")}
      <aside id={REGION_ID.inspector} ref={regionRefs.inspector} className="region-inspector" aria-label={regionLabel("inspector")} hidden={!state.inspector.open}>
        <TabList
          label={regionLabel("inspector")}
          idPrefix="inspector"
          tabs={INSPECTOR_TABS}
          selected={state.inspector.tab}
          onSelect={(tab) => apply({ kind: "selectTab", region: "inspector", tab })}
        />
        <div role="tabpanel" id="inspector-panel-layer" aria-labelledby="inspector-tab-layer" hidden={state.inspector.tab !== "layer"}>
          {emptyInspectorText}
          {LAYER_SECTIONS.map((section) => {
            const contentId = `section-${section.id}`;
            const expanded = section.headingOwner === "layout" ? state.sections[section.id] : true;
            return (
              <div key={section.id} role="group" aria-label={section.label} className="inspector-section">
                {section.headingOwner === "layout" && (
                  <SectionHeading
                    label={section.label}
                    contentId={contentId}
                    expanded={expanded}
                    onToggle={() => apply({ kind: "toggleSection", section: section.id })}
                  />
                )}
                <div id={contentId} hidden={!expanded}>
                  {slots[`section.${section.id}`]}
                </div>
              </div>
            );
          })}
        </div>
        {INSPECTOR_SLOT_TABS.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`inspector-panel-${tab.id}`}
            aria-labelledby={`inspector-tab-${tab.id}`}
            hidden={state.inspector.tab !== tab.id}
          >
            {emptyInspectorText}
            {slots[`inspector.${tab.id}`]}
          </div>
        ))}
      </aside>

      {splitter("activity", "y", -1, sizes.activityHeight, "[P6 placeholder] Resize Activity")}
      <section id={REGION_ID.activity} ref={regionRefs.activity} className="region-activity" aria-label={regionLabel("activity")} hidden={!state.activity.open}>
        <TabList
          label={regionLabel("activity")}
          idPrefix="activity"
          tabs={ACTIVITY_TABS}
          selected={state.activity.tab}
          onSelect={(tab) => apply({ kind: "selectTab", region: "activity", tab })}
        />
        {ACTIVITY_TABS.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`activity-panel-${tab.id}`}
            aria-labelledby={`activity-tab-${tab.id}`}
            hidden={state.activity.tab !== tab.id}
          >
            {slots[`activity.${tab.id}`]}
          </div>
        ))}
      </section>

      <footer className="status-bar">
        {STATUS_ITEMS.map((item) => (
          <Fragment key={item.id}>{slots[`status.${item.id}`]}</Fragment>
        ))}
      </footer>
    </div>
  );
}
