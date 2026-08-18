// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { invoke } from "@tauri-apps/api/core";

import { recordNamed } from "../console/recorder";

export interface DataPlaneAttach {
  url: string;
  subprotocols: [string, string];
}

/**
 * `binding_data_plane_attach` is the one command that ever hands this client a transport endpoint
 * and a credential (SKP-V0.md §3; ADR-012 H6: no transport detail may leak into the semantic API,
 * so this is explicitly not SKP). The data plane starts once, in the Tauri app's `setup`, and its
 * port and session token never change for the process's life -- so this is fetched once and cached,
 * not re-requested per viewport query.
 */
let cached: Promise<DataPlaneAttach> | null = null;

export function dataPlaneAttach(): Promise<DataPlaneAttach> {
  if (!cached) {
    // NEXT-CUT.md P3 item B: name-only, pre-invoke; resolved post-invoke, rethrown unchanged --
    // this wire must be observationally invisible to `dataPlaneAttach`'s own callers/memoization.
    const entry = recordNamed("binding-command", "binding_data_plane_attach");
    cached = invoke<DataPlaneAttach>("binding_data_plane_attach").then(
      (result) => {
        entry.resolveOk();
        return result;
      },
      (e: unknown) => {
        entry.resolveThrew(e instanceof Error ? e.message : String(e));
        throw e;
      }
    );
  }
  return cached;
}

/** Test-only: clears the memoized attach so each test starts fresh. */
export function __resetForTests(): void {
  cached = null;
}
