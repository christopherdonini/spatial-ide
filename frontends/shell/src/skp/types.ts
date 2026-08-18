// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { DecU64, HexF64 } from "./codec";

/**
 * SKP v0 wire types. Field names and shapes mirror `protocol/skp/src/v0/commands.rs` exactly --
 * snake_case included -- because the same shape is both the Rust fixture-verified wire contract and
 * this client's request/response types, and renaming anything here is the kind of drift
 * `protocol/skp/tests/data/*.json` exists to catch (see `__tests__/fixtures.test.ts`).
 *
 * See `protocol/skp/SKP-V0.md` for the design note and the mandatory named-deferral list this
 * client must not silently exceed (no capability discovery, no idempotency, no subscriptions, …).
 */
export const SKP_VERSION = "skp/0.1";

/** The single dialect `skp/0.1` admits for `Filter.predicate` (see `Filter` below). `skp/1` is
 * RESERVED (docs/07's 1.0 freeze); a second dialect, if one is ever added, gets its own version
 * string, not a silent addition to this one. */
export const FILTER_DIALECT_DUCKDB_EXPR_0 = "duckdb-expr/0";

export interface SkpError {
  code: string;
  message: string;
  fields: Record<string, string>;
}

export interface OpenDatasetRequest {
  skp: string;
  path: string;
  cancel_key: string;
}
export interface OpenDatasetResponse {
  dataset: string;
}

export interface DescribeRequest {
  skp: string;
  dataset: string;
}

export interface SourceInfo {
  path_display: string;
  geoparquet_version: string;
}

export interface CrsInfo {
  identifier: string;
  definition_json: string | null;
  source: string; // "file" | "caller_asserted"
  asserted_by: string | null;
  asserted_at: string | null;
  axis_order: string;
  axis_normalization: string;
}

export interface GeometryInfo {
  column: string;
  encoding: string;
  coordinate_layout: string;
  frame: string;
}

export interface IdentityInfo {
  source: string;
  uniqueness: string;
  verified_rows: DecU64 | null;
  max_value: DecU64 | null;
  js_exact: boolean | null;
}

export interface FieldInfo {
  name: string;
  arrow_type: string;
  nullable: boolean;
}

export interface RowCount {
  basis: string;
  value: DecU64 | null;
}

export interface Extent {
  basis: string;
  value: [HexF64, HexF64, HexF64, HexF64] | null;
}

export interface LicenseInfo {
  license: string | null;
  attribution: string | null;
  redistribution: string | null;
  declares_anything: boolean;
}

export interface DescribeResponse {
  source: SourceInfo;
  crs: CrsInfo;
  geometry: GeometryInfo;
  identity: IdentityInfo;
  schema: FieldInfo[];
  covering_bbox: boolean;
  row_count: RowCount;
  extent: Extent;
  license: LicenseInfo;
}

export interface Bbox {
  xmin: HexF64;
  ymin: HexF64;
  xmax: HexF64;
  ymax: HexF64;
}

/** A row filter carried on `viewport_query` -- a boolean expression in the declared `dialect`,
 * never a whole SQL statement, never a derived-dataset handle (`protocol/skp/src/v0/commands.rs`'s
 * `Filter`, design note item 1). This client does not parse or admit `predicate`; only the kernel
 * does, and it may refuse it. */
export interface Filter {
  predicate: string;
  dialect: string; // the one admitted value is `FILTER_DIALECT_DUCKDB_EXPR_0`
}

export interface ViewportQueryRequest {
  skp: string;
  dataset: string;
  bbox: Bbox | null;
  bbox_crs: string | null;
  limit: DecU64 | null;
  filter: Filter | null; // always present, `null` means no filter (matches `bbox_crs`'s discipline)
}
export interface ViewportQueryResponse {
  stream: string;
  expires_in_ms: number;
}

export interface CancelRequest {
  skp: string;
  handle: string;
}
export interface CancelResponse {
  state: string; // "requested" | "unknown" | "already_terminal"
}

export interface CloseDatasetRequest {
  skp: string;
  dataset: string;
}
export interface CloseDatasetResponse {
  cancelled_streams: number;
}
