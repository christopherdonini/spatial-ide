// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { invoke } from "@tauri-apps/api/core";

import { recordNamed } from "../console/recorder";

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
 * or stale, so there is no memoization to get wrong. NEXT-CUT.md P3 item B: name-only, pre-invoke;
 * resolved post-invoke, rethrown unchanged.
 */
export async function crsCatalog(): Promise<CrsCatalogEntry[]> {
  const entry = recordNamed("binding-command", "binding_crs_catalog");
  try {
    const result = await invoke<CrsCatalogEntry[]>("binding_crs_catalog");
    entry.resolveOk();
    return result;
  } catch (e) {
    // S4 (reviewer gate, action-console P7 fixes): resolveThrew takes no message -- `e` is still
    // rethrown unchanged, so the real text is not lost, only kept out of the console.
    entry.resolveThrew();
    throw e;
  }
}
