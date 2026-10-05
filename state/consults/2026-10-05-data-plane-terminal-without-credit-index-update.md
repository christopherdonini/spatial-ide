*Custodian's filing note (2026-10-05): lead-data's owner's-index update for `data-plane-terminal-without-credit` (the second pilot's §1 item 2; the 2026-10-03 clarification's C1), written to the custodian's scratchpad (run 10:12:12Z to 10:15:43Z; 120,891 subagent tokens, 52 tool uses) and copied here byte-identical below the rule. Its sha256 as written, from this file's line 5 to the end, is da02bc0c4c9e86fa2dae34d85baeb49ed60965c10ab3bcf0e8b5f30e1601762e. Write audit PASS: one Write, at its REPORT PATH line's path (Grep 29, Read 14, Glob 7, the hand-back 1). C3: the main checkout held only its two pre-existing untracked items before (10:11:56Z) and after (10:15:50Z), and the worktree's porcelain was empty before and after. A worker applies its three edits on the branch. Profile paths redacted at filing: none.

---

# Owner's-index update — data-plane-terminal-without-credit (lead-data, second pilot, piece 1)
Read at: cut/data-plane-terminal-without-credit d60a0bed

Task: the owner's-index update under state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md §1, item 2, and the 2026-10-03 lead-data clarification's C1, for the form protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md (its §2 Part 4 and §8 item 18). This file holds replacement text for a worker to apply. It holds no draft text, design, recommendation or answer to any open item. Line numbers are in words ("line N") and refer to the branch at d60a0bed, whose kernel/README.md this piece has not yet edited.

How it was read: Read, Grep and Glob only. I had no Bash, so I computed no hash and ran no git command. The branch ref file .git/refs/heads/cut/data-plane-terminal-without-credit reads d60a0bed4e96b8e92e3cbeefb848e46e2faac2a4, and the read-only worktree's HEAD names that branch. Every kernel index pointer was checked by grep or glob in that worktree (see "Pointer check" below).

## kernel/README.md, Owner's index (heading at line 346)

### Edit 1 — Last verified at (replace line 350)

Current, kernel/README.md line 350 at d60a0bed, byte-copied:

```
- **Last verified at:** 5bb2b104 (every pointer checked at that commit)
```

Replacement:

```
- **Last verified at:** d60a0bed (every pointer checked at that commit)
```

### Edit 2 — the SKP-cancel route into the data plane (add after line 353)

Anchor, kernel/README.md line 353 at d60a0bed, byte-copied (unchanged):

```
  - Stream tickets → SKP-V0 §1 (`viewport_query`, `cancel`), §3 (`StreamHandle`); `spatial_kernel::skp::StreamRegistry`, `spatial_kernel::EngineSourceFactory::ticket_only` · pinned by `kernel/src/skp.rs::tests::a_ticket_redeems_exactly_once`, `kernel/tests/skp_admission.rs::a_raw_stream_params_start_is_refused_in_ticket_only_mode`, `kernel/src/skp.rs::ticket_drop_under_lock_regression::an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard`, `kernel/src/skp.rs::ticket_drop_under_lock_regression::an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard`
```

Add after line 353, exact text (one line):

```
  - The cancel handed to the data plane → `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`; `spatial_data_plane::transport::SourceCancel` (`cancel`, `on_cancel`), implemented by the crate-private `EngineCancel` and its `CancelNotice` (`kernel/src/lib.rs`) · pinned by `kernel/src/lib.rs::cancel_notice_tests::engine_cancel_runs_the_registered_notice_once_in_either_order`, `kernel/tests/skp_cancel_terminal_without_credit.rs::an_skp_cancel_reaches_the_client_as_a_terminal_with_no_credit_granted`, `kernel/tests/skp_cancel_terminal_without_credit.rs::a_close_dataset_reaches_the_client_as_a_terminal_with_no_credit_granted`
```

Each name in it resolves at d60a0bed: `struct EngineCancel` at kernel/src/lib.rs line 705, `struct CancelNotice` at line 711, `impl SourceCancel for EngineCancel` at line 725 with `fn on_cancel` at line 738, `mod cancel_notice_tests` at line 755 (under `#[cfg(test)]`, line 754) with the test fn at line 763; the provided method `fn on_cancel` at protocol/data-plane/src/transport.rs line 142; the two tests at kernel/tests/skp_cancel_terminal_without_credit.rs lines 263 and 270, the file's only two tests.

### Edit 3 — kernel halves of pieces filed elsewhere (replace line 375)

Current, kernel/README.md line 375 at d60a0bed, byte-copied:

```
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`
```

Replacement:

```
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
```

This one line is also the form's Part 4 "kernel/README.md: the preregistrations bullet": kernel/README.md has no preregistrations bullet outside the index at d60a0bed (grep of PREREGISTRATION in the file: lines 200, 356, 373, 374, 375 only; line 200 is prose, the rest are index lines).

### Pointers this piece does not change (checked, no edit)

- Consumed from other modules, line 367: it names the trait `SourceCancel`; `on_cancel` is a method of it, and kernel/src/lib.rs lines 55-57 still import exactly the five names the line lists. No edit.
- Governed by, line 372 (accepted ADRs): the form touches no ADR (its §1 and §7 must-print-nothing set include docs/adr). ADR-004, ADR-010 and ADR-018, which the form cites as binding, are already listed. No edit.
- Proposed ADRs, line 376: ADR-012 and ADR-019 still read Proposed at d60a0bed. No edit.
- Declared limits, line 377: the form adds no KNOWN-LIMITATIONS item (Amendment 1, OPEN-2 row; KNOWN-LIMITATIONS.md is in its §7 must-print-nothing set). No edit.
- Ceilings, lines 378-382: no ceiling moved. The form's §7 declares no new product constant and the worker report's §7 figures say none was added; the new test file's `RECV_DEADLINE` (line 36) is a test-site liveness bound, and the index lists no test-site value. The composed-ceilings rows the line 382 pointer names (kernel/README.md lines 59-63) read at d60a0bed as the form's §0.6 cites them, (4 + 1) for the data-plane row; the form declares them unchanged. No edit.

### Line count

Insertions plus deletions in kernel/README.md: Edit 1, 2 (1 + 1); Edit 2, 1 (1 + 0); Edit 3, 2 (1 + 1). Total 5, against the 19 the brief states remain under the form's §7 documentation ceiling. The index section grows from 37 lines (346-382) to 38, under its 60-line rule.

## engine/README.md, Owner's index (heading at line 495)

No change: no engine/ line changed, by the form's §7 must-print-nothing set (which includes engine) and worker report 1's §7 figures (the command printed nothing at d60a0bed, and its commit list touches no engine/ path); I ran no git diff myself (no Bash).

## Pointer check at d60a0bed (kernel index, lines 346-382)

- Every test pointer resolves to a `fn` of that name in that file and module: the 32 named in lines 352-364 (greps of `fn <name>` under kernel/; the six `kernel/src/skp.rs` pins fall in `mod tests` at line 2362 or `mod ticket_drop_under_lock_regression` at line 3057, as each pointer names; `kernel/src/params.rs::tests` at line 128).
- Every `spatial_kernel` symbol resolves: `skp::SkpHost` (with `open_dataset`, `close_dataset`, `cancel`), `skp::StreamRegistry`, `skp::GenerationRegistry`, `skp::SessionInvalidator::end_generation`, `skp::SessionEndReason`, `skp::session_end_channel`, `skp::error_of`, `skp::filter_error_of`, `skp::terminal_detail_of`, `Catalog`, `EngineSourceFactory` (with `ticket_only`), `StreamParams`, `OPERATION`, `publish::preflight`, `publish::publish_unguarded`, `publish::ViewerAssets`, `publish::ceilings::reader_ceilings`, `bundle`, `permission::boundary::execute`, `permission::audit`.
- Files: `kernel/src/main.rs` (bin `slice-host` in kernel/Cargo.toml), `kernel/src/bin/publish-bundle.rs`, `kernel/examples/verify-bundle.rs`, `kernel/PERMISSION-BOUNDARY.md`, `renderer/bundle-viewer/ceilings.json`, and every preregistration file lines 356, 373, 374 and 375 name, all present; kernel/ holds 19 preregistration files, all listed in lines 373-374.
- Sections: SKP-V0 §1, §3, §5, §7.5, §8 (with `skp/0.5`), §9.5; engine/SOURCE-WATCHER-PREREGISTRATION.md §2b; this README's *Declared composed ceilings (ADR-010 rule 6)* at line 52.
- ADR Status lines match lines 372 and 376; KNOWN-LIMITATIONS items 5, 6, 8, 12, 16, 21, 28 and 30 are present.
- Ceiling constants: all eleven named in lines 379-381 are declared in the files named.

## Found, not changed

- protocol/data-plane/README.md has no "Owner's index" section at d60a0bed (grep under protocol/ finds none), while the form's §2 Part 4 places an owner's-index update "in kernel/README.md and protocol/data-plane/README.md"; that module is outside lead-data's, and nothing here writes it.
- engine/README.md's index records `Last verified at: 8efcde9`; it is not re-verified here, because no engine line changed.

## Files read

- the branch at d60a0bed (read-only worktree): kernel/README.md lines 50-84 and 340-383, plus a grep of PREREGISTRATION; engine/README.md lines 490-528; kernel/tests/skp_cancel_terminal_without_credit.rs whole; kernel/src/lib.rs lines 50-69 and 690-793, plus greps; kernel/src/skp.rs greps (top-level items, pub methods, imports); kernel/src/publish/mod.rs, kernel/src/permission/mod.rs, kernel/src/permission/audit/mod.rs, kernel/src/publish/viewer_assets.rs, kernel/src/publish/ceilings.rs, kernel/src/permission/grant.rs, kernel/src/permission/audit/log.rs, kernel/src/permission/boundary.rs: greps; kernel/tests and kernel/src: greps of every pinned fn name; kernel/Cargo.toml: grep; protocol/data-plane/src/transport.rs: grep (`on_cancel`, `note_discarded`, `batches_discarded`); protocol/skp/SKP-V0.md: greps (headings, `skp/0.5`); engine/SOURCE-WATCHER-PREREGISTRATION.md: grep of headings; docs/adr: glob and greps of Status lines; KNOWN-LIMITATIONS.md: greps (headings, item numbers); globs of preregistration files, kernel source files and renderer/bundle-viewer/ceilings.json; grep of "Owner's index" under protocol/.
- main: protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md whole; state/consults/2026-10-05-data-plane-terminal-without-credit-worker-report-1.md whole; state/consults/2026-10-05-data-plane-terminal-without-credit-impact-read.md whole; state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md whole; state/directives/2026-10-03-lead-data-pilot-clarification.md whole.
- git metadata: the worktree's .git file and its HEAD; .git/refs/heads/cut/data-plane-terminal-without-credit; a grep of .git/packed-refs.

sha256: not computed
