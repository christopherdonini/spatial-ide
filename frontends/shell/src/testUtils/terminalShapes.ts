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

/**
 * **Phase 2, `engine/SOURCE-WATCHER-PREREGISTRATION.md` §4 (SH3/SH4).** Captured the same way as
 * `REAL_SOURCE_CHANGED_TERMINAL_DETAIL` above, from a real `cargo test -- --nocapture` run of
 * `spatial_kernel::skp::terminal_detail_of(&EngineError::SourceCoverageLost { detail:
 * "overflow".to_string() })` -- pinned as an exact-equality assertion on the producing side in
 * `kernel/tests/typed_terminal_codes.rs`'s
 * `a_coverage_lost_terminal_detail_carries_its_typed_code_and_exact_text`. The `[P6 placeholder]`
 * mark is part of the real string; it is pinned along with the rest, not stripped.
 */
export const REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL =
  "engine.source_coverage_lost: [P6 placeholder] refused: the advisory watch on this source lost " +
  "coverage (overflow). This is not a statement that the file changed — the OS notification " +
  "stream this session was relying on stopped reporting, and this check cannot see whether the " +
  "file changed while it was not";

/**
 * **SH4's pre-check half** -- the `SkpCallError` a coverage-lost pre-check refusal throws
 * (`kernel/src/skp.rs::viewport_query`'s `live_or_mint` error arm, through `error_of`), in the same
 * `"<code>: <message>"` shape `liveTicketSet.ts::refusalDetailOf` builds. Captured the same way,
 * from a real `spatial_kernel::skp::error_of(&EngineError::SourceCoverageLost { .. })` call over
 * the exact detail text `viewport_query`'s own arm uses -- pinned as an exact-equality assertion on
 * the producing side in `kernel/tests/typed_terminal_codes.rs`'s
 * `a_coverage_lost_pre_check_refusal_carries_its_typed_code_and_exact_text`, driven through a real
 * `SkpHost` with an injected watch signalling `CoverageLost` after admission.
 */
export const REAL_SOURCE_COVERAGE_LOST_PRE_CHECK_REFUSAL_DETAIL =
  "engine.source_coverage_lost: [P6 placeholder] refused: the advisory watch on this source lost " +
  "coverage ({[P6 placeholder] this dataset's session ended when the advisory watch on its " +
  "source lost coverage}). This is not a statement that the file changed — the OS notification " +
  "stream this session was relying on stopped reporting, and this check cannot see whether the " +
  "file changed while it was not";
