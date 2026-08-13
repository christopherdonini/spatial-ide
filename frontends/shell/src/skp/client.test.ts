import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.hoisted(() => vi.fn());
vi.mock("@tauri-apps/api/core", () => ({ invoke: invokeMock }));

import { viewportQuery } from "./client";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "./types";

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
    await viewportQuery("ds_x", null, null, null);

    expect(invokeMock).toHaveBeenCalledWith("viewport_query", {
      request: { skp: "skp/0.1", dataset: "ds_x", bbox: null, bbox_crs: null, limit: null, filter: null },
    });
  });

  it("sends the caller's filter verbatim -- predicate text untouched, dialect carried through", async () => {
    await viewportQuery("ds_x", null, null, null, {
      predicate: "zone = 'residential'",
      dialect: FILTER_DIALECT_DUCKDB_EXPR_0,
    });

    expect(invokeMock).toHaveBeenCalledWith("viewport_query", {
      request: {
        skp: "skp/0.1",
        dataset: "ds_x",
        bbox: null,
        bbox_crs: null,
        limit: null,
        filter: { predicate: "zone = 'residential'", dialect: "duckdb-expr/0" },
      },
    });
  });
});
