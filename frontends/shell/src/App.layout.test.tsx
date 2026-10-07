// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md section 4, R1 to R8: the Map Studio frame rendered
 * through the REAL `App`. Mounts `App.tsx`'s default export in jsdom and admits datasets through the
 * real product path -- `AdmissionPanel`'s own `onAdmitted`, reached by the SAME `openPath` E2E hook a
 * real operator's click runs -- then drives the layout through the real `keydown` listener, buttons,
 * tabs, section headings and splitters. The layout itself is never mocked (invalidator I6).
 *
 * Mocked at the boundaries `App` does not own, the same set `App.lateResult.test.tsx` mocks: the SKP
 * transport (`./skp/client`, `./skp/events`), the baseline stream manager, and the WebGL boundary
 * (`./canvas/WorkingCanvas`: deck.gl's real `Deck` needs a WebGL context jsdom does not provide). The
 * canvas stand-in counts its mounts and unmounts per dataset handle, which is what R1 and R6 read.
 */

import { act, forwardRef, useEffect, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  /** Every call into the mocked SKP client, summed (R6: unchanged across any layout action). */
  skpCalls: 0,
  /** When set, the next `openDataset` is refused (R8). */
  refuseNextOpen: false,
  mintCounter: 0,
  canvas: { mounted: [] as string[], unmounted: [] as string[], fitCalls: 0 },
}));

function describeFixture(): import("./skp/types").DescribeResponse {
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: {
      identifier: "EPSG:2056", definition_json: null, source: "file", asserted_by: null, asserted_at: null,
      definition_provenance: null, axis_order: "easting,northing", axis_normalization: "none-performed",
      provenance: "crs:declared", axis_provenance: "axis:declared", display_convention: null, unit: "metre",
    },
    geometry: { column: "geometry", encoding: "geoarrow.polygon", declared_types: ["Polygon"], coordinate_layout: "interleaved-xy", frame: "authoritative-project-crs" },
    identity: {
      source: "file:id", uniqueness: "verified-at-open-full-file", verified_rows: "100000",
      max_value: "99999", js_exact: true, class: "native", session_statement: null,
    },
    schema: [{ name: "id", arrow_type: "UInt64", nullable: false, projectable: false }],
    covering_bbox: true, row_count: { basis: "identity-uniqueness-scan-full-file", value: "100000" },
    extent: { basis: "not-established-at-open", value: null },
    license: { license: null, attribution: null, redistribution: null, declares_anything: false },
    sanity: { level: "none", reason: "the file declares its own CRS, so no format rule was applied and there is nothing assumed to check. Not checked" },
    coverage: { state: "watching", reason: null },
    checks: { state: "full", components: [] },
    session_end: null,
  };
}

vi.mock("./skp/client", () => {
  class SkpCallError extends Error {
    readonly skpError: import("./skp/types").SkpError;
    constructor(skpError: import("./skp/types").SkpError) {
      super(`${skpError.message} (${skpError.code})`);
      this.name = "SkpCallError";
      this.skpError = skpError;
    }
  }
  return {
    SkpCallError,
    openDataset: async (): Promise<import("./skp/types").OpenDatasetResponse> => {
      mocks.skpCalls += 1;
      if (mocks.refuseNextOpen) {
        mocks.refuseNextOpen = false;
        throw new SkpCallError({ code: "engine.no_covering_bbox", message: "no covering bbox for this dataset", fields: {} });
      }
      mocks.mintCounter += 1;
      return {
        dataset: `ds_${mocks.mintCounter.toString(16).padStart(32, "0")}`,
        session: `sr_${mocks.mintCounter.toString(16).padStart(32, "0")}`,
      };
    },
    describe: async (): Promise<import("./skp/types").DescribeResponse> => {
      mocks.skpCalls += 1;
      return describeFixture();
    },
    closeDataset: async (): Promise<import("./skp/types").CloseDatasetResponse> => {
      mocks.skpCalls += 1;
      return { cancelled_streams: 0 };
    },
    cancel: async (): Promise<import("./skp/types").CancelResponse> => {
      mocks.skpCalls += 1;
      return { state: "requested" };
    },
    viewportQuery: async (): Promise<never> => {
      throw new Error("viewportQuery must not be reached directly -- ViewportStreamManager is mocked at the module boundary");
    },
  };
});

vi.mock("./skp/events", () => ({
  listenDatasetSessionEnded: async () => () => {},
}));

vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    requestViewport(): Promise<unknown> {
      return new Promise(() => {});
    }
    async cancelStream(): Promise<void> {}
    async stop(): Promise<void> {}
  }
  return { VIEWPORT_QUERY_MIN_INTERVAL_MS: 120, ViewportStreamManager: MockViewportStreamManager };
});

vi.mock("./canvas/WorkingCanvas", () => {
  const MockWorkingCanvas = forwardRef<
    import("./canvas/WorkingCanvas").WorkingCanvasHandle,
    import("./canvas/WorkingCanvas").WorkingCanvasProps
  >(function MockWorkingCanvas(props, ref) {
    useEffect(() => {
      mocks.canvas.mounted.push(props.dataset);
      return () => {
        mocks.canvas.unmounted.push(props.dataset);
      };
    }, [props.dataset]);
    useImperativeHandle(
      ref,
      () => ({
        pushBatch: () => 0,
        clearStream: () => {},
        fitToBounds: () => {
          mocks.canvas.fitCalls += 1;
          return true;
        },
        resetFitForNewGeneration: () => {},
        getResidentCounts: () => ({ totalResidentVertices: 0, totalResidentFeatures: 0 }),
        armFirstPixelRenderHook: () => false,
        disarmFirstPixelRenderHook: () => true,
        pushTileBatch: () => ({ rowsAdmitted: 0, duplicatesDropped: 0, evictedTileKeys: [], overBudget: false, fitAnchor: null, batchExtent: null }),
        clearTile: () => {},
        clearAllTiles: () => {},
        isTileResidentInCandidateSet: () => false,
        isTileCompleteInCandidateSet: () => false,
        markTilePartial: () => {},
        markTileComplete: () => {},
        markTileResidentEmpty: () => {},
        establishTileGridContext: () => {},
        applyTileViewportContext: () => false,
      }),
      []
    );
    return <div className="working-canvas-stub" data-dataset={props.dataset} />;
  });
  return { default: MockWorkingCanvas };
});

import App from "./App";
import { consoleRecorder, isGuiActionEntry } from "./console/recorder";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const PATH_A = "C:/data/parcels.parquet";
const PATH_B = "C:/data/second.parquet";

describe("App: the Map Studio frame, through the real App (milestone 1)", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.skpCalls = 0;
    mocks.refuseNextOpen = false;
    mocks.canvas.mounted = [];
    mocks.canvas.unmounted = [];
    mocks.canvas.fitCalls = 0;
    // The suite's shipped default is the candidate arm; this file mocks the baseline manager.
    setResidencyArm("baseline");
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(<App />);
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    window.__SPATIAL_E2E__ = undefined;
    __resetResidencyArmForTests();
  });

  // ------------------------------------------------------------------------------------------
  // Drivers: every one goes through the same event surface a real operator's input reaches.
  // ------------------------------------------------------------------------------------------

  /** Admits `path` through the real `openPath` hook; returns the hook's outcome. */
  async function open(path: string) {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    let outcome: Awaited<ReturnType<typeof hook>> | undefined;
    await act(async () => {
      outcome = await hook(path);
    });
    return outcome!;
  }

  function press(letter: string, over: KeyboardEventInit = {}): void {
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: letter, code: `Key${letter.toUpperCase()}`, ctrlKey: true, bubbles: true, cancelable: true, ...over }));
    });
  }

  function click(element: Element | null): void {
    if (element === null) throw new Error("click target not found");
    act(() => {
      (element as HTMLElement).click();
    });
  }

  function pressOn(element: Element, key: string): void {
    act(() => {
      element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    });
  }

  function drag(element: Element, fromX: number, toX: number, moves: number): void {
    const fire = (type: string, clientX: number) =>
      act(() => {
        element.dispatchEvent(new MouseEvent(type, { clientX, clientY: 0, bubbles: true }));
      });
    fire("pointerdown", fromX);
    for (let i = 1; i <= moves; i += 1) fire("pointermove", fromX + ((toX - fromX) * i) / moves);
    fire("pointerup", toX);
  }

  function typeInto(input: HTMLInputElement, value: string): void {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  const q = <T extends Element = HTMLElement>(selector: string): T | null => container.querySelector<T>(selector);
  const region = (name: "Layers" | "Map" | "Inspector" | "Activity") =>
    q(`[aria-label="${name}"]`) as HTMLElement;
  const isHidden = (element: Element | null) => element?.hasAttribute("hidden") === true;
  const layoutRows = () =>
    consoleRecorder
      .entries()
      .filter(isGuiActionEntry)
      .map((entry) => entry.action)
      .filter((action) => action.startsWith("layout."));

  /** Every layout action once, through every surface the layout offers. */
  function exerciseEveryLayoutAction(): void {
    for (const letter of ["b", "i", "j"]) {
      press(letter);
      press(letter);
    }
    for (const button of container.querySelectorAll(".top-bar-toggle")) {
      click(button);
      click(button);
    }
    click(q("#inspector-tab-style"));
    click(q("#inspector-tab-layer"));
    click(q("#activity-tab-notices"));
    click(q("#activity-tab-console"));
    for (const heading of container.querySelectorAll(".section-heading button")) {
      click(heading);
      click(heading);
    }
    pressOn(q("#splitter-layers")!, "ArrowRight");
    pressOn(q("#splitter-inspector")!, "ArrowLeft");
    pressOn(q("#splitter-activity")!, "ArrowUp");
    drag(q("#splitter-layers")!, 100, 140, 4);
  }

  // RECORDED MUTATION for "R1": key the map region on `inspector.open` (StudioLayout.tsx's `<main>`
  // gets `key={String(state.inspector.open)}`). Expected failure: the first Ctrl+I remounts the map, so
  // the canvas stand-in's mount list reaches 2 for the same handle.
  // OBSERVED AT 420bc3153ed2ec4623c89e88eb13ae78da304463: FAILED -- "mounts after every layout action": AssertionError: expected [ ...(5) ] to
  // deeply equal [ Array(1) ] (the same handle mounted five times). Reverted after observing.
  it("R1: the map is mounted exactly once per handle across every layout action; a reopen mounts the new handle once and unmounts the old one once", async () => {
    await open(PATH_A);
    const [handleA] = mocks.canvas.mounted;
    expect(mocks.canvas.mounted).toEqual([handleA]);
    expect(mocks.canvas.unmounted).toEqual([]);

    exerciseEveryLayoutAction();
    expect(mocks.canvas.mounted, "mounts after every layout action").toEqual([handleA]);
    expect(mocks.canvas.unmounted, "unmounts after every layout action").toEqual([]);

    await open(PATH_B);
    const [, handleB] = mocks.canvas.mounted;
    expect(handleB).not.toBe(handleA);
    expect(mocks.canvas.mounted).toEqual([handleA, handleB]);
    expect(mocks.canvas.unmounted).toEqual([handleA]);
  });

  // RECORDED MUTATION for "R2": render closed content as null (StudioLayout.tsx's section content div
  // draws `state.inspector.open ? slots[...] : null`). Expected failure: closing the Inspector unmounts
  // `FilterPanel`, so the reopened input is a fresh one and its text is gone.
  // OBSERVED AT 420bc3153ed2ec4623c89e88eb13ae78da304463: FAILED -- at the node-identity assertion after the second Ctrl+I: AssertionError:
  // expected <input class="filter-predicate" value="" ...> to be <input ... value="zone = 'residential'">
  // (Object.is equality; the reopened input is a fresh one with no text). Reverted after observing.
  it("R2: after Ctrl+I twice, the FilterPanel input's text and PublishPanel's aria-expanded survive", async () => {
    await open(PATH_A);
    const input = q<HTMLInputElement>(".filter-predicate")!;
    typeInto(input, "zone = 'residential'");
    click(q(".publish-disclosure"));
    expect(q(".publish-disclosure")!.getAttribute("aria-expanded")).toBe("true");

    press("i");
    expect(isHidden(region("Inspector")), "closed after the first Ctrl+I").toBe(true);
    press("i");
    expect(isHidden(region("Inspector")), "open again after the second").toBe(false);

    expect(q<HTMLInputElement>(".filter-predicate")).toBe(input);
    expect(q<HTMLInputElement>(".filter-predicate")!.value).toBe("zone = 'residential'");
    expect(q(".publish-disclosure")!.getAttribute("aria-expanded")).toBe("true");
  });

  // RECORDED MUTATION for "R3": remove the focus relocation (StudioLayout.tsx's
  // `if (holdsFocus) mapRef.current?.focus();`). Expected failure: the focused filter input is still the
  // active element after its region is hidden, so it is not the map.
  // OBSERVED AT 420bc3153ed2ec4623c89e88eb13ae78da304463: FAILED -- AssertionError: expected <input class="filter-predicate" ...> to be
  // <main id="region-map" ...> (Object.is equality). Reverted after observing.
  it("R3: with focus in the filter input, Ctrl+I hides the Inspector, focus is on the map region, and the text is kept", async () => {
    await open(PATH_A);
    const input = q<HTMLInputElement>(".filter-predicate")!;
    typeInto(input, "id > 5");
    input.focus();
    expect(document.activeElement).toBe(input);

    press("i");
    expect(isHidden(region("Inspector"))).toBe(true);
    expect(document.activeElement).toBe(region("Map"));
    expect(input.value).toBe("id > 5");
  });

  // RECORDED MUTATION for "R4": place the Inspector before the map in the DOM (StudioLayout.tsx's
  // Inspector `<aside>` and its splitter moved above `<main>`). Expected failure: the order assertion.
  // OBSERVED AT 420bc3153ed2ec4623c89e88eb13ae78da304463: FAILED -- "region 4 follows region 3 in the DOM": AssertionError: expected +0 to be
  // truthy (the Inspector no longer follows the map). Reverted after observing.
  it("R4: landmark roles and names, the DOM order of the regions, hidden on closed regions and never on the map", () => {
    const header = q("header")!;
    const layers = region("Layers");
    const attention = q(".attention-strip")!;
    const map = region("Map");
    const inspector = region("Inspector");
    const activity = region("Activity");
    const footer = q("footer")!;

    expect(header.tagName).toBe("HEADER");
    expect(header.querySelector(".app-header")?.textContent).toBe("Spatial IDE");
    expect([layers.tagName, inspector.tagName]).toEqual(["ASIDE", "ASIDE"]);
    expect(map.tagName).toBe("MAIN");
    expect(activity.tagName).toBe("SECTION");
    expect(attention.tagName).toBe("SECTION");
    expect(footer.tagName).toBe("FOOTER");
    expect(map.getAttribute("tabindex")).toBe("0");

    const inOrder = [header, layers, attention, map, inspector, activity, footer];
    for (let i = 1; i < inOrder.length; i += 1) {
      const follows = inOrder[i - 1].compareDocumentPosition(inOrder[i]) & Node.DOCUMENT_POSITION_FOLLOWING;
      expect(follows, `region ${i} follows region ${i - 1} in the DOM`).toBeTruthy();
    }

    // Defaults: Layers and Inspector open, Activity closed, the empty attention strip hidden.
    expect([isHidden(layers), isHidden(inspector), isHidden(activity), isHidden(attention)]).toEqual([false, false, true, true]);
    for (const letter of ["b", "i", "j"]) press(letter);
    expect([isHidden(layers), isHidden(inspector), isHidden(activity)]).toEqual([true, true, false]);
    expect(isHidden(map)).toBe(false);

    // The tabs follow the ARIA tabs pattern.
    const tablist = inspector.querySelector('[role="tablist"]')!;
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    expect(tabs.map((tab) => tab.textContent)).toEqual(["Layer", "Style"]);
    expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual(["true", "false"]);
    expect(tabs.map((tab) => tab.getAttribute("tabindex"))).toEqual(["0", "-1"]);
    for (const tab of tabs) {
      expect(inspector.querySelector(`#${tab.getAttribute("aria-controls")}`)?.getAttribute("role")).toBe("tabpanel");
    }
  });

  // RECORDED MUTATION for "R5": wire the row to a no-op (App.tsx's
  // `onZoomToLayer={() => void canvasRef.current?.fitToBounds()}` becomes `() => {}`). Expected
  // failure: the canvas handle's `fitToBounds` call count stays 0.
  // OBSERVED AT 420bc3153ed2ec4623c89e88eb13ae78da304463: FAILED -- AssertionError: expected +0 to be 1 // Object.is equality (the
  // `fitToBounds` call count after the click). Reverted after observing.
  it("R5: the Layers row's .zoom-to-layer calls fitToBounds once; there is no row before admission", async () => {
    expect(q(".layers-row")).toBeNull();
    expect(q(".zoom-to-layer")).toBeNull();

    await open(PATH_A);
    const label = q(".layers-row-label")!;
    expect(label.textContent).toBe("C:/data/parcels.parquet");
    expect(label.getAttribute("title")).toBe("C:/data/parcels.parquet");
    expect(region("Layers").contains(q(".zoom-to-layer"))).toBe(true);

    expect(mocks.canvas.fitCalls).toBe(0);
    click(q(".zoom-to-layer"));
    expect(mocks.canvas.fitCalls).toBe(1);
  });

  // RECORDED MUTATION for "R6": key StudioLayout on the dataset (App.tsx's `<StudioLayout>` gets
  // `key={admitted?.dataset}`). Expected failure: the reopen resets the layout, so Layers is open again.
  // OBSERVED AT 420bc3153ed2ec4623c89e88eb13ae78da304463: FAILED -- "Layers still closed after the reopen": AssertionError: expected false to
  // be true // Object.is equality. Reverted after observing.
  it("R6: the layout survives a reopen, and the SKP client's call count is unchanged across every layout action", async () => {
    await open(PATH_A);
    const callsBefore = mocks.skpCalls;
    exerciseEveryLayoutAction();
    expect(mocks.skpCalls, "SKP client calls across every layout action").toBe(callsBefore);

    press("b");
    press("j");
    click(q("#inspector-tab-style"));
    click(q(".section-heading button"));
    const sourceHeading = q(".section-heading button")!;
    expect(sourceHeading.getAttribute("aria-expanded")).toBe("false");

    await open(PATH_B);
    expect(isHidden(region("Layers")), "Layers still closed after the reopen").toBe(true);
    expect(isHidden(region("Activity")), "Activity still open after the reopen").toBe(false);
    expect(q("#inspector-tab-style")!.getAttribute("aria-selected")).toBe("true");
    expect(q(".section-heading button")!.getAttribute("aria-expanded")).toBe("false");
  });

  // RECORDED MUTATION for "R7": delete the recordNamed call for `layout.toggleLayers`
  // (StudioLayout.tsx's `recordLayoutAction`). Expected failure: no `layout.toggleLayers` row appears.
  // OBSERVED AT 420bc3153ed2ec4623c89e88eb13ae78da304463: FAILED -- AssertionError: expected [] to deeply equal [ 'layout.toggleLayers' ].
  // Reverted after observing.
  it("R7: Ctrl+B records one layout.toggleLayers gui-action (and a drag one layout.resizeRegion, never one per move)", async () => {
    await open(PATH_A);
    const before = layoutRows().length;
    press("b");
    expect(layoutRows().slice(before)).toEqual(["layout.toggleLayers"]);

    const afterToggle = layoutRows().length;
    drag(q("#splitter-inspector")!, 300, 260, 5);
    expect(layoutRows().slice(afterToggle), "one row for the finished drag, not one per pointer move").toEqual(["layout.resizeRegion"]);

    const afterDrag = layoutRows().length;
    pressOn(q("#splitter-inspector")!, "ArrowLeft");
    expect(layoutRows().slice(afterDrag), "one row per keyboard step").toEqual(["layout.resizeRegion"]);
  });

  // RECORDED MUTATION for "R8": restore AdmissionPanel.tsx's `DescribeSummary` render of its own
  // admitted state and drop App's `section.source` render. Expected failure: after the refused second
  // open the Source section holds no summary (the restored render lives in Layers and goes with the
  // panel's own state, which is now the refusal).
  // OBSERVED AT 420bc3153ed2ec4623c89e88eb13ae78da304463: FAILED -- at the first Source assertion: AssertionError: the given combination of
  // arguments (undefined and string) is invalid for this assertion (`#section-source .describe-summary`
  // does not exist). Reverted after observing.
  it("R8: after a refused second open, Source still shows the first dataset's summary while Layers shows the refusal", async () => {
    await open(PATH_A);
    expect(q("#section-source .describe-summary")?.textContent).toContain("EPSG:2056");

    mocks.refuseNextOpen = true;
    const outcome = await open(PATH_B);
    expect(outcome.kind).toBe("refused");

    expect(q("#section-source .describe-summary")?.textContent, "Source keeps the first dataset's summary").toContain("EPSG:2056");
    expect(region("Layers").querySelector(".admission-refusal-code")?.textContent, "Layers shows the refusal").toBe("engine.no_covering_bbox");
    expect(region("Layers").querySelector(".describe-summary")).toBeNull();
    expect(mocks.canvas.unmounted, "a refused open unmounts nothing").toEqual([]);
  });
});
