import { invoke } from "@tauri-apps/api/core";

/** The OS file picker. **Not SKP** -- `open_dataset` takes a path already chosen; how the caller
 * got one is UI, which docs/02 keeps out of the protocol. `null` means the operator cancelled. */
export function pickFile(): Promise<string | null> {
  return invoke<string | null>("binding_pick_file");
}
