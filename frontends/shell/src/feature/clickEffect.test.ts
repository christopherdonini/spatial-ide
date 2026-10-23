// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { readRow } from "../attributes/values";
import { decodeBatch } from "../canvas/decodeBatch";
import { DEFAULT_STYLE_STATE } from "../style/document";
import { attributeBatchIpc } from "../testUtils/attributeBatchIpc";
import { applyViewTransition, viewInspected } from "../workspace/viewTransitions";
import type { ViewState } from "../workspace/workspaceState";
import { clickEffect } from "./clickEffect";

describe("clickEffect: the inspected feature's attributes (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.2 (e))", () => {
  // RECORDED MUTATION for "PA-U11": in `clickEffect`'s Navigate branch send `row: null` in `inspect.set`'s params. Expected failure: the transition's row is null where row 1's values were expected.
  it("a Navigate click on a feature carries its row into inspect.set, and the reducer keeps it on the inspected feature", () => {
    const { ipc, encoding } = attributeBatchIpc([1n, 2n], [{ name: "tag", kind: "utf8", values: ["a", "b"] }]);
    const batch = decodeBatch("sh_c", 0, ipc, "geometry", encoding, ["tag"]);
    const row = readRow(batch, 1);
    expect(row).toEqual([{ name: "tag", value: { kind: "text", text: "b" } }]);

    const view: ViewState = { id: "view-1", resource: "ds_x", filter: null, style: DEFAULT_STYLE_STATE };
    const pick = { streamHandle: "sh_c", batchSeq: 0, id: 2n, anchor: null };
    const bounds = { xmin: 10, ymin: 0, xmax: 11, ymax: 1 };
    const effect = clickEffect(view, { kind: "feature", pick, bounds, row }, false);

    expect(effect.transitions).toEqual([{ action: "inspect.set", params: { pick, bounds, row } }]);
    expect(effect.row).toBe("feature.inspect");
    expect(viewInspected(applyViewTransition(view, effect.transitions[0]))).toEqual({ pick, bounds, row });
  });
});
