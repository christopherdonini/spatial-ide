import { invoke } from "@tauri-apps/api/core";

import type { DecU64 } from "./codec";
import {
  Bbox,
  CancelResponse,
  CloseDatasetResponse,
  DescribeResponse,
  Filter,
  OpenDatasetResponse,
  SkpError,
  SKP_VERSION,
  ViewportQueryResponse,
} from "./types";

/** Thrown when the host returns a typed `SkpError` -- never a bare string, so a caller can branch
 * on `.skpError.code` the way `protocol/skp/SKP-V0.md` §5 intends. */
export class SkpCallError extends Error {
  readonly skpError: SkpError;
  constructor(skpError: SkpError) {
    super(`${skpError.message} (${skpError.code})`);
    this.name = "SkpCallError";
    this.skpError = skpError;
  }
}

function isSkpError(value: unknown): value is SkpError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    "fields" in value &&
    typeof (value as SkpError).code === "string"
  );
}

async function call<Res>(command: string, request: Record<string, unknown>): Promise<Res> {
  try {
    return await invoke<Res>(command, { request });
  } catch (e) {
    if (isSkpError(e)) {
      throw new SkpCallError(e);
    }
    throw e;
  }
}

export function openDataset(path: string, cancelKey: string): Promise<OpenDatasetResponse> {
  return call("open_dataset", { skp: SKP_VERSION, path, cancel_key: cancelKey });
}

export function describe(dataset: string): Promise<DescribeResponse> {
  return call("describe", { skp: SKP_VERSION, dataset });
}

/**
 * `filter` is `Filter | null`, defaulting to `null` -- every existing call site (viewport-driven
 * streaming with no predicate) is unaffected, and it is the ONE function both a future filter panel
 * and the dev-only E2E hook (`e2e-test-surface.ts`'s `queryWithFilter`, wired through
 * `ViewportStreamManager.requestViewport`) call to actually send one (NEXT-CUT.md P5: "client only,
 * no logic" -- this function does not parse, admit, or otherwise inspect `filter.predicate`; only
 * the kernel does, and it may refuse it). `filter: null` is sent explicitly, never omitted, matching
 * the `bbox_crs` discipline (SKP-V0.md "v0.1" section): `ViewportQueryRequest.filter` is
 * `Option<Filter>` with no `#[serde(default)]` on the Rust side, so an absent key is a deserialize
 * failure, not a tolerated omission.
 */
export function viewportQuery(
  dataset: string,
  bbox: Bbox | null,
  bboxCrs: string | null,
  limit: DecU64 | null,
  filter: Filter | null = null
): Promise<ViewportQueryResponse> {
  return call("viewport_query", {
    skp: SKP_VERSION,
    dataset,
    bbox,
    bbox_crs: bboxCrs,
    limit,
    filter,
  });
}

export function cancel(handle: string): Promise<CancelResponse> {
  return call("cancel", { skp: SKP_VERSION, handle });
}

export function closeDataset(dataset: string): Promise<CloseDatasetResponse> {
  return call("close_dataset", { skp: SKP_VERSION, dataset });
}
