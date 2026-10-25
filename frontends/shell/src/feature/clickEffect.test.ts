// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { readRow } from "../attributes/values";
import { decodeBatch } from "../canvas/decodeBatch";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import { DEFAULT_STYLE_STATE } from "../style/document";
import { attributeBatchIpc } from "../testUtils/attributeBatchIpc";
import { applyViewTransition, viewInspected, viewSelection } from "../workspace/viewTransitions";
import type { ViewState } from "../workspace/workspaceState";
import { clickEffect } from "./clickEffect";

describe("clickEffect: the inspected feature's attributes (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.2 (e))", () => {
  // RECORDED MUTATION for "PA-U11": in `clickEffect`'s Navigate branch send `row: null` in `inspect.set`'s params. Expected failure: the transition's row is null where row 1's values were expected.
  it("a Navigate click on a feature carries its row into inspect.set, and the reducer keeps it on the inspected feature", () => {
    const { ipc, encoding } = attributeBatchIpc([1n, 2n], [{ name: "tag", kind: "utf8", values: ["a", "b"] }]);
    const batch = decodeBatch("sh_c", 0, ipc, "geometry", encoding, ["tag"], null);
    const row = readRow(batch, 1);
    expect(row).toEqual([{ name: "tag", value: { kind: "text", text: "b" } }]);

    const view: ViewState = { id: "view-1", resource: "ds_x", filter: null, style: DEFAULT_STYLE_STATE };
    const pick = { streamHandle: "sh_c", batchSeq: 0, id: 2n, anchor: null };
    const bounds = { xmin: 10, ymin: 0, xmax: 11, ymax: 1 };
    const effect = clickEffect(view, { kind: "feature", pick, bounds, row, filter: null }, false);

    expect(effect.transitions).toEqual([{ action: "inspect.set", params: { pick, bounds, row } }]);
    expect(effect.row).toBe("feature.inspect");
    expect(viewInspected(applyViewTransition(view, effect.transitions[0]))).toEqual({ pick, bounds, row });
  });

  // RECORDED MUTATION for "PC-U10": in `clickEffect`'s Select branch send `filter: null` in `selection.apply`'s params. Expected failure: the transition's filter is null where the click's filter object was expected.
  it("PC-U10: a Select click on a feature carries its row and filter into selection.apply, and the reducer keeps them on the member", () => {
    const filter = { predicate: "zone = 'residential'", dialect: FILTER_DIALECT_DUCKDB_EXPR_0 };
    const { ipc, encoding } = attributeBatchIpc([1n, 2n], [{ name: "tag", kind: "utf8", values: ["a", "b"] }]);
    const batch = decodeBatch("sh_c", 0, ipc, "geometry", encoding, ["tag"], filter);
    const row = readRow(batch, 1);
    const view: ViewState = { id: "view-1", resource: "ds_x", filter, style: DEFAULT_STYLE_STATE, tool: "select" };
    const pick = { streamHandle: "sh_c", batchSeq: 0, id: 2n, anchor: null };
    const bounds = { xmin: 10, ymin: 0, xmax: 11, ymax: 1 };
    const effect = clickEffect(view, { kind: "feature", pick, bounds, row, filter: batch.filter }, false);

    expect(effect.transitions).toEqual([{ action: "selection.apply", params: { mode: "toggle", id: 2n, bounds, row, filter } }]);
    const member = viewSelection(applyViewTransition(view, effect.transitions[0])).get(2n);
    expect(member).toEqual({ bounds, row, filter });
    expect(member?.filter).toBe(filter);
  });
});
