*Custodian's filing note (2026-10-03): lead-data's owner's-index update for node 9 (C1 of the 2026-10-03 lead-data clarification), written by `lead-data` as its own agent type to this path itself and committed as written below the rule. The hash of record, from this file's line 5 (the report's first line) to the end, is a0a54e685dab1707f0906baee9745019f237c85b121b9df23840c7bbce40de52, computed by the custodian; the agent returned "sha256: not computed" (C3). Write audit PASS: one Write, to this path; Read 25, Grep 31, Glob 4. C3: the worktree was clean before and after; in the main checkout the only other differences are the custodian's own commit 50331054, made during the run. Its line numbers refer to the branch at 4d487d51. Its section 1 is applied in the implementation PR. Its section 3 (the Close ordering pointer) and section 4 (the body sentence) are routed to the proposed node `module-docs-stale-statements`.*

---

# lead-data index update — kernel-ticket-drop-followups (node 9), C1

- Role: lead-data, task 3 (owner's-index update), under C1 to C4 of the 2026-10-03 lead-data clarification. C1 puts this update before the final gate, in the implementation PR.
- Revision: the working tree at `C:/dev/wt/ticket-drop-fu`. The branch ref `cut/kernel-ticket-drop-followups` reads `4d487d51f20cf0e637ad4068320760f91cfc858e`, and the worktree HEAD is that ref. I have no Bash tool, so I read refs and reflog files and did not run `git status`, `git diff` or `git show`. Under C3 the custodian's porcelain record covers whether the tree is clean.
- Base, for comparison: the main checkout's `kernel/src/skp.rs`. Main is at `14a9636f`, and its only commit after `4c50677c` is a `docs(state)` commit, so I read its `skp.rs` as the branch base. Spot check: base line 1187 carries the same text as head line 1212, which is +25, the size of the `StreamRegistry` growth.
- Result: three lines of the kernel section change. Nothing changes in the engine section. Under C2 this is not a crossing piece.

## 1. The update, as the PR applies it to `kernel/README.md`

The three replaced lines are in the `## Owner's index (data-path lead; a current-state summary, edited in place)` section. Line numbers are at `4d487d51`. Nothing is added or removed, so the section stays 38 lines including its heading (limit 60).

**Line 350 (`- **Last verified at:** …`)** becomes:

```
- **Last verified at:** 4d487d51 (every pointer checked at that commit)
```

**Line 353 (the `Stream tickets` interface bullet)** becomes:

```
  - Stream tickets → SKP-V0 §1 (`viewport_query`, `cancel`), §3 (`StreamHandle`); `spatial_kernel::skp::StreamRegistry`, `spatial_kernel::EngineSourceFactory::ticket_only` · pinned by `kernel/src/skp.rs::tests::a_ticket_redeems_exactly_once`, `kernel/tests/skp_admission.rs::a_raw_stream_params_start_is_refused_in_ticket_only_mode`, `kernel/src/skp.rs::ticket_drop_under_lock_regression::an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard`, `kernel/src/skp.rs::ticket_drop_under_lock_regression::an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard`
```

**Line 373 (`- preregistrations in this module: …`)** becomes:

```
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`
```

### Why these lines, and only these

- **Stream tickets.** The diff widens a stated guarantee of `StreamRegistry`. The no-drop-under-guard invariant on the `tickets` field (`kernel/src/skp.rs`, the doc comment of `StreamRegistry`'s `tickets` field) now also covers an unwind out of `SourceCancel::cancel` or `StreamHandle::mint`, and three tests now pin it.
  - I add two of those tests, T1 and T3. Together they cover both methods that call `SourceCancel::cancel` under the guard (`cancel`, `cancel_all_for_dataset`) and both locals (`swept`, `retired`).
  - T2 (`an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard`) is left out only to keep the pointer list representative, the way the other bullets keep theirs. Adding it would also be correct. That choice is a draft, and the gate checks it.
  - No signature, SKP section or symbol on this bullet moves, so the rest of the line is unchanged.
- **Preregistrations in this module.** The new form is filed under `kernel/` and is appended to the list.
- **Last verified at.** See §2.
- **Unchanged, and why:**
  - No new public item. `EmptySource`, `PanickingCancel` and `UnwindSetup` are private to the `#[cfg(test)]` module `ticket_drop_under_lock_regression`.
  - No new product constant. `HANG_TIMEOUT` is reused and test-only, and `MAX_REKEY_ATTEMPTS` is a test-local `const` inside `put_p_before_q`. So **Ceilings** does not change.
  - No new KNOWN-LIMITATIONS row (form §1).
  - No ADR is amended, accepted or added. The form's ADR-018 and ADR-019 are already listed under accepted and proposed.
  - No consumed interface changes.
- **Engine section.** No `engine/` file is in the diff: form §5 declares this, the worker reports it, and all seven commit subjects concern `kernel/src/skp.rs`. The engine index is not touched, and its "Last verified at" stays `af40bbf`.

## 2. What "every pointer checked at 4d487d51" rests on

All checks are by reading or searching the working tree at `4d487d51`.

- **Test pointers, 31.**
  - Each was found as a `fn <name>` in the named file. The 29 already in the section, plus T1 and T3, resolve.
  - The `kernel/src/skp.rs` ones are in the named module:
    - `mod tests` spans lines 2348–2990 (`a_ticket_redeems_exactly_once` at 2432);
    - `mod ticket_drop_under_lock_regression` spans 3043–4619 (`cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` at 3185, T1 at 3573, T3 at 3613, `the_close_race_mints_no_generation_so_no_unheld_reference_exists` at 4197, `a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch` at 4563);
    - `kernel/src/params.rs` has `mod tests` at 128 and the test at 151.
- **Kernel symbols.** All of these exist with the named paths:
  - `skp`: `StreamRegistry`, `GenerationRegistry`, `SessionInvalidator::end_generation`, `SessionEndReason`, `session_end_channel`, `SkpHost`, `SkpHost::open_dataset`, `SkpHost::close_dataset`, `error_of`, `filter_error_of`, `terminal_detail_of`;
  - `lib.rs`: `EngineSourceFactory::ticket_only`, `Catalog`, and the re-exported `StreamParams`, `OPERATION`, `bundle`;
  - `publish`: `preflight`, `publish_unguarded`, `ViewerAssets`, `ceilings::reader_ceilings`;
  - `permission`: `boundary::execute` (re-exported), `audit`.
- **Files.** Every file the section names exists:
  - `kernel/src/main.rs`, `kernel/src/bin/publish-bundle.rs`, `kernel/examples/verify-bundle.rs`, `kernel/PERMISSION-BOUNDARY.md`;
  - every listed preregistration and measurement-pass form in `kernel/`, `engine/`, `frontends/shell/` and `protocol/skp/`;
  - `renderer/bundle-viewer/ceilings.json`, which `kernel/src/publish/ceilings.rs` compiles in through `include_str!`.
- **Sections.**
  - SKP-V0 has §1, §3, §5, §7, §7.5, §8 and §9.5. `skp/0.5` occurs in it.
  - `engine/SOURCE-WATCHER-PREREGISTRATION.md` has `§2b`.
  - The README has the section *Declared composed ceilings (ADR-010 rule 6)*.
- **ADRs.** By their `**Status:**` lines:
  - Accepted: 004, 005, 006, 008, 009, 010, 015, 016, 017, 018, 021, 025, 026, 033, 035.
  - Proposed: 012, 019, 023, 024.
- **KNOWN-LIMITATIONS.** Items 5, 6, 8, 12, 16, 21, 28 and 30 exist as numbered items.
- **Ceilings.** All the named constants are declared in the named files:
  - `TICKET_TTL`, `MAX_PENDING_TICKETS`, `TERMINAL_ENTRY_MAX_AGE`, `SESSION_END_EVENT_QUEUE_BOUND`;
  - `MAX_VIEWER_ASSETS`, `MAX_VIEWER_ASSET_BYTES`, `PUBLISH_WRITE_CHUNK_BYTES`;
  - `MAX_GRANT_LIFETIME`, `MAX_GRANTS`, `MAX_AUDIT_LOG_BYTES`, `MAX_AUDIT_LOG_GENERATIONS`.
- **Consumed from other modules.** Each named item exists:
  - `spatial_engine::{Dataset, BatchStream, CancelToken, EngineError}`;
  - `spatial_data_plane::transport::{SourceFactory, BatchSource, SourceCancel, OpenRequest, BatchMeta}`, and `spatial_data_plane::serve` (`protocol/data-plane/src/server.rs`, re-exported from the crate root);
  - `spatial_skp::v0` with `SkpError`, `DatasetSessionEnded` and `SKP_VERSION`;
  - `spatial_renderer::compile`, which kernel calls at `kernel/src/publish/mod.rs`, and `spatial_renderer::canonical`.
  - "the admission, projection, filter and watch types" was checked at category level only: `spatial_engine::watch`, `AdmittedProjection`, `AdmittedPredicate`, `FilterError` and `AdmissionRecord` exist.
- **Not checked:**
  - whether each KNOWN-LIMITATIONS item's text still concerns this module;
  - whether the accepted and proposed ADR lists are complete;
  - whether each pinned test outside `kernel/src/skp.rs` still exercises what its bullet names. I read the bodies only of the `skp.rs` tests named in §3 and §4.

"Checked" means resolved as above. It does not mean every pointer is well filed: see §3.

## 3. Pointers already wrong at 4d487d51 (not moved by this diff)

- **Index-wrong (C4: yes, index-wrong; pre-existing, not caused by this piece or its draft).**
  - The **Close ordering** bullet (line 357) is the `SkpHost::close_dataset` pointer. It lists `kernel/src/skp.rs::ticket_drop_under_lock_regression::cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` as a pinning test.
  - That test (`kernel/src/skp.rs`, `ticket_drop_under_lock_regression`) builds its registries with `seeded_pending_ticket` and calls only `StreamRegistry::cancel`. It never calls `close_dataset`.
  - It pins `StreamRegistry`'s return-path no-drop-under-guard invariant, which is the **Stream tickets** bullet's interface.
  - The bullet and the test are both unchanged by this diff, so §1 leaves them where they are ("change nothing the diff does not move").
  - Suggested fix, for a later index update and as a draft only: move that pointer from Close ordering to Stream tickets.
- No other kept pointer was found wrong.

## 4. Other files the diff makes stale

**None found.** These are what I checked:
- **`kernel/README.md` body, lines 177–179 (unchanged by the diff).** Form §5 declares this sentence unchanged and still true. Checked against the new doc comment:
  - **True** on the return path, and on an unwind out of `SourceCancel::cancel` or `StreamHandle::mint`. The doc comment keeps the `TicketState` half for both.
  - **Broader than the doc comment** on the unwinds the doc comment lists under "Not covered". The values in flight at three of the four named sites are themselves `TicketState`s:
    - `sweep_locked`'s partly built `Vec`;
    - `cancel_all_for_dataset`'s `retired.push(mem::replace(..))` argument;
    - `mint`'s `insert` argument.
    The body sentence, which has no qualifier, therefore claims more than the code now documents.
  - **This breadth predates the diff.** At base the field's doc comment was equally unqualified (byte-copied from the base: `no `TicketState` is ever dropped while this`). The diff narrows the gap and does not open it, so I do not class the body as made stale.
  - Form §8 item 5 confines `kernel/README.md` edits in this PR to the owner's-index lines. That is a non-blocking question for the custodian (§6).
- **`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md` lines 13 and 41.**
  - Line 13 describes "the tree … since PR #116's merge (f165218)", so it is historical.
  - Line 41's "dropped after the registry's guard is released" stays true on the return path.
  - The ADR is accepted and immutable. Not stale.
- **`ticket_drop_under_lock_regression`'s module doc, `kernel/src/skp.rs` lines 2992–3041.** "Each of the first three tests below" is still literally true, because the new tests are appended after the predecessor's four. Not stale. The worker's report calls it loosely stale; that wording predates this piece.
- **Unpinned `kernel/src/skp.rs:<line>` cites in live files.** The diff shifts every product line after the `tickets` field by up to +25. I checked against the base `skp.rs`, and these cites already missed their targets at the base, so the diff does not make them stale:
  - `kernel/tests/session_generation.rs` lines 353, 354, 427 and 476;
  - `kernel/tests/no_generation_in_persisted_artifacts.rs` line 8;
  - `KNOWN-LIMITATIONS.md` line 243;
  - `engine/tests/admission_p4_corpus.rs` line 408;
  - `frontends/shell/src-tauri/src/pool_poll.rs` line 12;
  - `frontends/shell/src/App.tsx` lines 621 and 659;
  - `frontends/shell/src/streaming/liveTicketSet.ts` line 90;
  - `frontends/shell/src/streaming/tileViewportStreamManager.ts` line 947, and its `.test.ts` line 1423.

  I did not check `liveTicketSet.ts` line 71 at the base. `kernel/src/skp.rs` line 3742 is a quoted panic location, which is historical. These cites are pre-existing drift for the custodian, not index items.

## 5. C2: does the diff change a contract another module consumes?

**No.**
- **Signatures.** The public signatures of `StreamRegistry::{new, sweep_expired, mint, redeem, cancel, cancel_all_for_dataset}` read identical at base and head.
- **Behaviour.** It changes only on an unwind out of `SourceCancel::cancel` or `StreamHandle::mint` while the guard is held. A debug-build `debug_assert` is added, and form §2.1 says it is unreachable by construction.
- **Callers outside `kernel/`.** None calls `mint`, `redeem`, `cancel` or `cancel_all_for_dataset`. A search of `frontends/`, `protocol/`, `renderer/` and `engine/` Rust sources found only `spatial_kernel::skp::StreamRegistry::new()` (`frontends/shell/src-tauri/src/lib.rs:280`). The data plane has its own, unrelated `StreamRegistry` (`protocol/data-plane/src/server.rs:146`).
- **Wire and other contracts.** No SKP literal, refusal code, `CancelOutcome` mapping, describe field, bundle or wire semantics changes.
- The guarantee is strengthened, not altered, for any consumer. If the custodian reads a strengthened guarantee on a public type as a contract change, that reading is the custodian's to make.

## 6. Verification of the worker's report against the worktree

- **Commits.** The seven commits match the worker's table in id and order, from `.git/worktrees/ticket-drop-fu/logs/HEAD`: `2813aead`, `fc86039c`, `2481ec55`, `847c6f0d`, `84d43648`, `1c8cea22`, `4d487d51`, each on its predecessor and starting from `4c50677c`. The reflog subjects match the stated purposes.
- **Not verified, for lack of Bash:**
  - the per-commit file lists;
  - the 290/26 numstat;
  - the suite results.
- **Test names.**
  - T1 to T3 exist under the form's names. Each carries `#[test]`, and none is `#[ignore]`d.
  - They sit after the predecessor's four tests (3185, sweep, cancel-all, 3328) and before E5 (3659).
  - The three test-only types the report names exist: `EmptySource` 3396, `PanickingCancel` 3407, `UnwindSetup` 3417.
- **Product code.** At head:
  - the `swept`, `retired` and `prev` declarations come before `self.tickets.lock()` in all five methods;
  - each `debug_assert!` follows `drop(tickets)`.
  I read this to place the index pointers, not as a review. I do not gate or review this piece.
- **A label in the report.** The worker's "Off-scope" list calls `kernel/README.md:177-179` "the owner's index". Those lines are the README body, and the index is the section at lines 346–383.

## 7. Questions for the custodian (none blocking this update)

- **Non-blocking.** The README body sentence at lines 177–179 does not carry the doc comment's "Not covered" qualifier (§4). Leave it, under form §5 and §8 item 5, or schedule a body edit as its own piece? That decision is the custodian's.
- **Non-blocking.** Should the Close-ordering pointer in §3 be refiled in a later index update?

## 8. Files read

- `C:/dev/spatial-ide/state/directives/2026-10-03-lead-data-pilot-clarification.md`
- `C:/dev/spatial-ide/state/consults/2026-10-03-kernel-ticket-drop-followups-worker-report-1.md`
- `C:/dev/spatial-ide/kernel/src/skp.rs` (the main checkout, lines 150–381, 1134–1137, 1185–1189 and 1235–1251, as the base)
- `C:/dev/spatial-ide/.git/worktrees/ticket-drop-fu/HEAD`, `C:/dev/spatial-ide/.git/worktrees/ticket-drop-fu/logs/HEAD`, `C:/dev/spatial-ide/.git/refs/heads/cut/kernel-ticket-drop-followups`
- `C:/dev/wt/ticket-drop-fu/.git`
- `C:/dev/wt/ticket-drop-fu/kernel/README.md` (lines 155–204, 266–383)
- `C:/dev/wt/ticket-drop-fu/engine/README.md` (lines 495–528)
- `C:/dev/wt/ticket-drop-fu/kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md` (whole)
- `C:/dev/wt/ticket-drop-fu/kernel/src/skp.rs` (lines 140–409, 536–547, 1155–1164, 1180–1219, 2990–3230, 3380–3659; searched for symbols and module bounds)
- `C:/dev/wt/ticket-drop-fu/docs/adr/ADR-035-dataset-session-ended-control-plane-event.md` (lines 9–14)
- **Searched, not read whole:**
  - `kernel/tests/*.rs` and `kernel/src/params.rs`, for test fns;
  - `kernel/src/lib.rs`, `kernel/src/publish/**` and `kernel/src/permission/**`, for public items;
  - `engine/src/lib.rs`, `engine/src/*.rs`, `protocol/data-plane/src/{lib,transport,server}.rs`, `protocol/skp/src/**` and `renderer/src/lib.rs`;
  - `protocol/skp/SKP-V0.md` for headings, `engine/SOURCE-WATCHER-PREREGISTRATION.md` for `§2b`, `docs/adr/*.md` for Status lines, and `KNOWN-LIMITATIONS.md` for item numbers;
  - `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, for "close";
  - the worktree, for `skp.rs:<line>` cites, for `StreamRegistry` callers outside `kernel/`, and for unwind/lock wording in the READMEs, ADR-019, ADR-035, SKP-V0 and KNOWN-LIMITATIONS.
- **Not read** (task 3 needs neither): `docs/PREREGISTRATION-TEMPLATE.md`, `.claude/agents/architect.md`.
- **sha256:** not computed (C3).
