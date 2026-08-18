// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { invoke } from "@tauri-apps/api/core";

/**
 * One entry of the pinned, in-tree CRS definition catalog (ADR-026 decision 1(a)). Mirrors
 * `frontends/shell/src-tauri/src/commands.rs::CrsCatalogEntry` field-for-field.
 */
export interface CrsCatalogEntry {
  id: string;
  authority: string;
  code: number;
  name: string;
  /** The full PROJJSON definition text, exactly as stored -- display it in full, never a
   * summary, before an operator may choose it (ADR-026 decision 1(a)). */
  definition: string;
  /** sha256, lowercase hex, of `definition` exactly as stored. */
  hash: string;
}

/**
 * `binding_crs_catalog` -- **not SKP** (host UI furniture, ADR-026's catalog; see the Rust
 * command's own doc comment). Static, compiled-in data: no caching here, by design -- unlike
 * `dataPlaneClient.ts`'s `dataPlaneAttach`, this has nothing that would make re-fetching costly
 * or stale, so there is no memoization to get wrong.
 */
export function crsCatalog(): Promise<CrsCatalogEntry[]> {
  return invoke<CrsCatalogEntry[]>("binding_crs_catalog");
}
