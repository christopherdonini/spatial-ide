// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import { consoleRecorder, isSkpRequestEntry } from "../console/recorder";
import { recordStep, SkpCallError, viewportQuery } from "./client";
import { FILTER_DIALECT_DUCKDB_EXPR_0, type SkpError } from "./types";

/**
 * `viewportQuery`'s request shape (NEXT-CUT.md P5, deliverable 1). The Rust side already validates
 * the wire contract (`protocol/skp/tests/fixtures.rs`, `kernel/src/skp.rs`) -- this asserts only
 * that this TS client actually *sends* the right JSON, which no prior test in this repo covered
 * (`CUT-STATE.md` P1/P2 both flagged this as a live gap).
 */
describe("viewportQuery request shape", () => {
  beforeEach(() => {
    invokeMock.mockReset().mockResolvedValue({ stream: "sh_0", expires_in_ms: 30_000 });
  });

  it("sends filter: null when no filter is given (the bbox_crs discipline -- never omitted)", async () => {
    await viewportQuery("ds_x", null, null, null, null, null);

    expect(invokeMock).toHaveBeenCalledWith("viewport_query", {
      request: {
        skp: "skp/0.12",
        dataset: "ds_x",
        bbox: null,
        bbox_crs: null,
        limit: null,
        filter: null,
        columns: null,
      },
    });
  });

  /** S-2: `columns` is sent as an explicit `null`, never omitted -- the `skp/0.6` discipline
   * `bbox_crs`/`filter` already follow. Mutation: omit the key from `client.ts::viewportQuery`.
   * Expected failure: this test fails by name -- the object equality check no longer matches. */
  it("sends columns: null as an explicit null when the caller passes null, never omitted", async () => {
    await viewportQuery("ds_x", null, null, null, null, null);

    const call = invokeMock.mock.calls[0][1] as { request: Record<string, unknown> };
    expect(call.request).toHaveProperty("columns");
    expect(call.request.columns).toBeNull();
  });

  // RECORDED MUTATION for "PA-U2": omit the `columns` key when it is `null` (`...(columns === null ? {} : { columns })`). Expected failure: the key
  // set below no longer equals the committed fixture's.
  it("PA-U2: sends the caller's columns as given, and its key set equals the committed request fixture with columns", async () => {
    const fixture = JSON.parse(readFileSync(join(__dirname, "../../../../protocol/skp/tests/data/v0-viewport_query-request-with-columns.json"), "utf8"));
    await viewportQuery("ds_x", null, null, null, null, ["area", "zone"]);
    await viewportQuery("ds_x", null, null, null, null, null);

    const [given, none] = invokeMock.mock.calls.map((c) => (c[1] as { request: Record<string, unknown> }).request);
    expect(given.columns).toEqual(["area", "zone"]);
    expect(none).toHaveProperty("columns", null);
    expect(Object.keys(given).sort()).toEqual(Object.keys(fixture).sort());
    expect(Object.keys(none).sort()).toEqual(Object.keys(fixture).sort());
  });

  it("sends the caller's filter verbatim -- predicate text untouched, dialect carried through", async () => {
    await viewportQuery("ds_x", null, null, null, { predicate: "zone = 'residential'", dialect: FILTER_DIALECT_DUCKDB_EXPR_0 }, null);

    expect(invokeMock).toHaveBeenCalledWith("viewport_query", {
      request: {
        skp: "skp/0.12",
        dataset: "ds_x",
        bbox: null,
        bbox_crs: null,
        limit: null,
        filter: { predicate: "zone = 'residential'", dialect: "duckdb-expr/0" },
        columns: null,
      },
    });
  });
});

/**
 * `recordStep`'s request shape (B2-1B-RECORDING-PREREGISTRATION.md section 4, C1). The kernel validates the intent; this asserts
 * only that the client sends the version and the typed intent as given, with `filter` present as `null` for no filter, and
 * nothing else (no id, time, actor or effect: ADR-004 Amendment 4).
 */
describe("recordStep request shape", () => {
  // RECORDED MUTATION for "C1": omit `skp: SKP_VERSION` from `recordStep` (client.ts). Expected failure: the object equality
  // below no longer matches.
  it("C1: recordStep sends record_step with the version and the typed intent", async () => {
    invokeMock.mockReset().mockResolvedValue({});

    await recordStep("ds_x", { action: "filter.apply", params: { filter: null } });
    await recordStep("ds_x", { action: "style.set", params: { property: "outlineWidth", value: { value: 2, unit: "px" } } });

    expect(invokeMock.mock.calls).toEqual([
      ["record_step", { request: { skp: "skp/0.12", dataset: "ds_x", intent: { action: "filter.apply", params: { filter: null } } } }],
      [
        "record_step",
        {
          request: {
            skp: "skp/0.12",
            dataset: "ds_x",
            intent: { action: "style.set", params: { property: "outlineWidth", value: { value: 2, unit: "px" } } },
          },
        },
      ],
    ]);
  });
});

/**
 * NEXT-CUT.md P0/I1/I2: `call()` is the console's one capture site. `consoleRecorder` is a
 * module-level singleton (`console/recorder.ts`), so these tests read only the entry each `it`
 * itself appended -- `consoleRecorder.entries().length` before the call marks where to look,
 * since other test files sharing this module registry may also have recorded entries by the time
 * any one test runs.
 */
describe("call() records every SKP request at the console's one capture site", () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it("records the exact request object reference handed to invoke (I2, toBe not toEqual)", async () => {
    invokeMock.mockResolvedValueOnce({ stream: "sh_0", expires_in_ms: 30_000 });
    const before = consoleRecorder.entries().length;

    await viewportQuery("ds_x", null, null, null, null, null);

    const entry = consoleRecorder.entries()[before]!;
    expect(entry.kind).toBe("skp-request");
    if (!isSkpRequestEntry(entry)) throw new Error("expected skp-request entry");
    const sentRequest = invokeMock.mock.calls[invokeMock.mock.calls.length - 1]![1].request;
    expect(entry.request).toBe(sentRequest);
  });

  it("records the command name on the entry (P3: the class-A command-name header's own source)", async () => {
    invokeMock.mockResolvedValueOnce({ stream: "sh_0", expires_in_ms: 30_000 });
    const before = consoleRecorder.entries().length;

    await viewportQuery("ds_x", null, null, null, null, null);

    const entry = consoleRecorder.entries()[before]!;
    if (!isSkpRequestEntry(entry)) throw new Error("expected skp-request entry");
    expect(entry.command).toBe("viewport_query");
  });

  it("records outcome ok after a resolved invoke, and rethrows nothing (the happy path)", async () => {
    invokeMock.mockResolvedValueOnce({ stream: "sh_0", expires_in_ms: 30_000 });
    const before = consoleRecorder.entries().length;

    await viewportQuery("ds_x", null, null, null, null, null);

    const entry = consoleRecorder.entries()[before]!;
    if (!isSkpRequestEntry(entry)) throw new Error("expected skp-request entry");
    expect(entry.outcome).toBe("ok");
  });

  it("records outcome refused with the typed SkpError, and rethrows an SkpCallError unchanged", async () => {
    const skpError: SkpError = { code: "skp.filter_unknown_column", message: "refused: bad column", fields: {} };
    invokeMock.mockRejectedValueOnce(skpError);
    const before = consoleRecorder.entries().length;

    await expect(viewportQuery("ds_x", null, null, null, null, null)).rejects.toBeInstanceOf(SkpCallError);

    const entry = consoleRecorder.entries()[before]!;
    if (!isSkpRequestEntry(entry)) throw new Error("expected skp-request entry");
    expect(entry.outcome).toBe("refused");
    expect(entry.refusal).toEqual(skpError);
    expect(entry.error).toBeUndefined();
  });

  it("records outcome threw for an untyped transport failure, and rethrows the original error unchanged", async () => {
    const transportError = new Error("network unreachable");
    invokeMock.mockRejectedValueOnce(transportError);
    const before = consoleRecorder.entries().length;

    await expect(viewportQuery("ds_x", null, null, null, null, null)).rejects.toBe(transportError);

    const entry = consoleRecorder.entries()[before]!;
    if (!isSkpRequestEntry(entry)) throw new Error("expected skp-request entry");
    expect(entry.outcome).toBe("threw");
    expect(entry.error).toBe("network unreachable");
    expect(entry.refusal).toBeUndefined();
  });
});
