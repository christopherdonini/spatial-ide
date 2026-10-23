// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { DescribeResponse } from "../skp/types";

/** Columns per open (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 7); mirrors the engine's
 * `MAX_PROJECTED_ATTRIBUTES`, which refuses a longer list. */
export const ATTRIBUTE_PROJECTION_MAX = 32;

/**
 * The open's projection set (section 2.2 (a)): the schema rows with `projectable: true`, in schema order, up to
 * `ATTRIBUTE_PROJECTION_MAX`; `null` when there are none, never `[]` (the engine refuses `Some([])`). It reads only
 * `projectable`, the kernel's own fact (ADR-023, entry 79 item (3)), and is fixed for the open.
 */
export function projectionFor(describe: Pick<DescribeResponse, "schema">): string[] | null {
  const names = describe.schema.filter((field) => field.projectable).map((field) => field.name);
  return names.length === 0 ? null : names.slice(0, ATTRIBUTE_PROJECTION_MAX);
}

/** What the Feature tab states about the columns the open does not project (section 2.2 (f)). */
export interface ProjectionSummary {
  /** The columns the open requests, in order (`projectionFor`'s list, or none). */
  readonly projected: readonly string[];
  /** The columns the kernel does not admit for projection, other than the geometry and identity columns. */
  readonly notProjected: readonly string[];
  /** The projectable columns left out because the list is capped at `ATTRIBUTE_PROJECTION_MAX`. */
  readonly leftOut: number;
}

/** The identity column's name, when the identity is a column: `file:<name>` or `mapped:<name>`. */
function identityColumnOf(source: string): string | null {
  const match = /^(?:file|mapped):(.+)$/.exec(source);
  return match === null ? null : match[1];
}

export function projectionSummary(describe: Pick<DescribeResponse, "schema" | "geometry" | "identity">): ProjectionSummary {
  const projected = projectionFor(describe) ?? [];
  const keys = new Set([describe.geometry.column, identityColumnOf(describe.identity.source)]);
  const projectable = describe.schema.filter((field) => field.projectable).length;
  return {
    projected,
    notProjected: describe.schema.filter((field) => !field.projectable && !keys.has(field.name)).map((field) => field.name),
    leftOut: projectable - projected.length,
  };
}
