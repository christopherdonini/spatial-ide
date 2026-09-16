// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * **Terminal `detail` strings exactly as the kernel produces them.**
 *
 * Test-only, and in `testUtils/` for that reason -- no product module imports it. Every consumer
 * test of the data-plane terminal seam reads its input from here rather than
 * transcribing a shape by hand — the failure mode the human's ruling of 2026-09-16 (round 4) names:
 * "a test that encodes an imagined interface is a gate failure by name".
 *
 * The bytes below were captured from a real `cargo test` run of
 * `spatial_kernel::skp::terminal_detail_of(&EngineError::SourceChanged { .. })` and are pinned as
 * an **exact-equality assertion** on the producing side, in
 * `kernel/tests/typed_terminal_codes.rs`'s
 * `a_data_plane_terminal_detail_begins_with_the_refusal_s_typed_code`. A change to the code or to
 * `EngineError::SourceChanged`'s `Display` therefore fails in the kernel's own suite first, instead
 * of leaving these tests asserting against a shape that is no longer sent.
 *
 * **Re-captured 2026-09-16 on the human's round-7 ruling** — "Engine messages state engine facts;
 * owners state consequences". The engine's text lost its consequence sentence ("Everything read …
 * no longer refer to anything") and its guidance ("reopen the file to continue"); the owner's
 * sentence is `refusalGuidance("engine.source_changed")`.
 */
export const REAL_SOURCE_CHANGED_TERMINAL_DETAIL =
  "engine.source_changed: refused: the source file changed while it was open ({size, mtime, " +
  "footer-length, footer-hash}). This check does not establish snapshot consistency, cannot " +
  "detect every in-place modification, and may detect a change during a query only after that " +
  "query has finished reading";
