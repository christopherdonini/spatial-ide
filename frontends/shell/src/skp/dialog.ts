// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { invoke } from "@tauri-apps/api/core";

import { recordNamed } from "../console/recorder";

/** The OS file picker. **Not SKP** -- `open_dataset` takes a path already chosen; how the caller
 * got one is UI, which docs/02 keeps out of the protocol. `null` means the operator cancelled.
 * NEXT-CUT.md P3 item B: name-only, pre-invoke; resolved post-invoke, rethrown unchanged. */
export async function pickFile(): Promise<string | null> {
  const entry = recordNamed("binding-command", "binding_pick_file");
  try {
    const result = await invoke<string | null>("binding_pick_file");
    entry.resolveOk();
    return result;
  } catch (e) {
    // S4 (reviewer gate, action-console P7 fixes): resolveThrew takes no message -- `e` is still
    // rethrown unchanged, so the real text is not lost, only kept out of the console.
    entry.resolveThrew();
    throw e;
  }
}
