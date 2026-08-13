import { invoke } from "@tauri-apps/api/core";

import type { DecU64 } from "./codec";
import {
  Bbox,
  CancelResponse,
  CloseDatasetResponse,
  DescribeResponse,
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

export function viewportQuery(
  dataset: string,
  bbox: Bbox | null,
  bboxCrs: string | null,
  limit: DecU64 | null
): Promise<ViewportQueryResponse> {
  return call("viewport_query", {
    skp: SKP_VERSION,
    dataset,
    bbox,
    bbox_crs: bboxCrs,
    limit,
    // `filter: null` explicitly, matching the `bbox_crs` discipline (SKP-V0.md "v0.1" section):
    // `ViewportQueryRequest.filter` is `Option<Filter>` with no `#[serde(default)]` on the Rust
    // side, so an absent key is a deserialize failure, not a tolerated omission. The real
    // filter-sending client API is P5's; this keeps a live `viewport_query` invoke round-tripping
    // against the v0.1 struct in the meantime.
    filter: null,
  });
}

export function cancel(handle: string): Promise<CancelResponse> {
  return call("cancel", { skp: SKP_VERSION, handle });
}

export function closeDataset(dataset: string): Promise<CloseDatasetResponse> {
  return call("close_dataset", { skp: SKP_VERSION, dataset });
}
