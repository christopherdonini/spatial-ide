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
export const SKP_VERSION = "skp/0.3";

/** The single dialect `skp/0.1` admits for `Filter.predicate` (see `Filter` below). `skp/1` is
 * RESERVED (docs/07's 1.0 freeze); a second dialect, if one is ever added, gets its own version
 * string, not a silent addition to this one. */
export const FILTER_DIALECT_DUCKDB_EXPR_0 = "duckdb-expr/0";

export interface SkpError {
  code: string;
  message: string;
  fields: Record<string, string>;
}

/** `skp/0.2`: a caller-asserted CRS for `open_dataset` (ADR-015 §4). Admitted only over a file
 * that declares no CRS; refused, without comparing, over a file that already declares one
 * (`engine.crs_assertion_conflict`). No attribution field -- the wire never carries `by`/`at`
 * (ADR-004 Amendment 4); the host mints both when it records the assertion. */
export interface CrsAssertion {
  identifier: string;
  definition_json: string;
}

/** `skp/0.2`: a caller declaration of which column carries stable feature identity (ADR-016
 * §3-§7). No attribution field, for the same reason as `CrsAssertion`. */
export interface IdentityDeclaration {
  column: string;
}

export interface OpenDatasetRequest {
  skp: string;
  path: string;
  cancel_key: string;
  /** `skp/0.2`. `null` declares "no assertion" -- always present on the wire, matches
   * `bbox_crs`/`filter`'s own discipline (never an omitted key). */
  crs_assertion: CrsAssertion | null;
  /** `skp/0.2`. `null` declares "no declaration" -- same discipline as `crs_assertion`. */
  identity: IdentityDeclaration | null;
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
  /** `"file"` | `"caller_asserted"` | `"format-rule"`.
   *
   * `"format-rule"` is `skp/0.3`'s value-domain widening of this existing key -- the human's ruling
   * of 2026-09-16 (`DECISIONS-PENDING.md` RULED 2026-09-16 -- question round 3, item 3). An
   * admission the format's absent-`crs`-key rule supplied used to record `"file"`, which said the
   * file declared a CRS it does not declare, and that false record reached published bundle
   * manifests. `provenance` below carries which rule supplied it. */
  source: string;
  asserted_by: string | null;
  asserted_at: string | null;
  /** ADR-026 decision 2 (P2): `Some` only when `source === "caller_asserted"` --
   * `catalog:<id>@sha256:<first-12-hex>` on an exact content-hash match against the pinned in-tree
   * catalog, `pasted` otherwise. Host-derived at open; `null` for `source === "file"`. */
  definition_provenance: string | null;
  axis_order: string;
  axis_normalization: string;
  /** `skp/0.3` (Brief A boundary 9): how this dataset's CRS was established --
   * `"crs:declared"`, `"crs:asserted"` or `"crs:format-default"`. A recorded fact, never a
   * judgement: it says nothing about whether the file's producer conformed to the rule read. */
  provenance: string;
  /** `skp/0.3` (Brief A boundary 9): how the **data's** axis order was established --
   * `"axis:declared"` or `"axis:format-override"`. */
  axis_provenance: string;
  /** `skp/0.3`: the display-convention sentence for a geographic-degrees dataset, **carried over
   * the wire from the Rust constant** (`engine/src/crs.rs`'s `GEOGRAPHIC_DISPLAY_CONVENTION`) and
   * never retyped as a TypeScript literal -- the P2 architect's rule, which is why this is a
   * field and not a string in this repository's frontend. `null` for every other dataset.
   *
   * A display statement only: no coordinate value is transformed, and `axis_normalization` stays
   * `"none-performed"`. Render it verbatim; never paraphrase or shorten it. */
  display_convention: string | null;
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
  /** `skp/0.3` (Brief A boundary 9): `"native"`, `"mapped"` or `"session-ordinal"`. */
  class: string;
  /** `skp/0.3`: the session-tier statement, non-null exactly when `class === "session-ordinal"`,
   * carried verbatim from the Rust constant for the reason `display_convention` is.
   *
   * It makes **no snapshot claim** -- it says the identity does not outlive the open. No
   * generation value accompanies it, here or anywhere else on the wire: the generation is kernel
   * and client state, and this client mirrors it by live-ticket set rather than by value. */
  session_statement: string | null;
}

/** `skp/0.3` (Brief A boundary 9): what the range check was decided from at this open.
 *
 * **A sanity check convicts, never confirms.** Nothing here says a file passed, is valid or was
 * verified; `"none"` means *not checked*. Do not render it as a green tick. */
export interface SanityInfo {
  /** `"metadata"`, `"sample"` or `"none"`. */
  level: string;
  reason: string;
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
  /** `skp/0.3` (Brief A boundary 9). */
  sanity: SanityInfo;
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
