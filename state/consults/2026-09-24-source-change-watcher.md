*Custodian's filing note (2026-09-24): the architect agent's consult for PLAN node `engine-source-change-watcher` (`node:engine-source-change-watcher@g1`, night program 2026-09-24 item 4b), filed as returned. Everything below the rule is the agent's text. The consult stopped the piece on two stop-list items (S1, S2); under the human's program ("If the preregistration hits a choice beyond these points, stop the piece and queue it", `state/directives/2026-09-24-watcher-sight.md`) the preregistration below is NOT committed as a gate and no code starts; S1 and S2 are queued as `DECISIONS-PENDING.md` entry 122.*

---

**Verdict: block. The piece stops at two items, S1 and S2 in the stop list below.** S1: no path exists for the kernel to push an idle signal to the shell (sight addition 4). S2: detecting a rename of the watched directory needs a second watch on its parent's parent (addition 5); the brief names only the parent directory. Everything else is covered by the brief plus the seven additions, and the preregistration below says where each stop item attaches. Whether to commit this text as the gate now is the custodian's call. No code starts until the human rules on S1 and S2.

---

# Preregistration: the advisory source-change watcher (`engine-source-change-watcher`)

## Header

- **Title and authority.** PLAN node `engine-source-change-watcher` (g1), night program 2026-09-24 item 4b. Binding inputs:
  - the brief, `state/briefs/source-change-watcher-brief.md:4-17`;
  - the human's seven additions, `state/directives/2026-09-24-watcher-sight.md:9-15`, which govern where they differ from the brief;
  - RULED 2026-09-24, the watcher sight;
  - RULED 2026-09-24 (night) item (2);
  - RULED 2026-09-23 (late): entry 119 item (3) as corrected by addition 1, and shell direction items (b)-(d);
  - ADR-016 Amendment 1 and its acceptance note, `docs/adr/ADR-016-stable-feature-identity-admission.md:210-240`.
- **Drafted by** the architect agent on the custodian's consult brief. It reads `main` at `eab8e82`. Every `path:line` below is a read at `eab8e82`. The committing worker adds each span's `sha256:<hex>` by script before commit, contiguous on the cite's line (round 15 (d)); the architect has no shell, and the gate recomputes every hash.
- **File: `engine/SOURCE-WATCHER-PREREGISTRATION.md`.** Why there:
  - the node's lane is `engine`;
  - the piece's origin is in the engine: the OS adapter on the existing `windows-sys` edge, and the new `EngineError` variant;
  - the sibling record for the change detector it complements, `engine/ADMISSION-PREREGISTRATION.md`, is in the same directory.

  It is one file rather than a split, because the ordering criterion crosses engine → kernel → shell and must be gated as one claim.
- **Base.** The branch is cut from `crs-unit-fact-and-bounds`' branch, not from `main` (RULED 2026-09-24 (night) item (2)). That base also edits describe assembly and `protocol/skp/src/v0/commands.rs`. The worker re-derives every cite into those files on the base; each move is a class-3 fix.
- **Committed before any code.** It is append-only once committed. An amendment written after any outcome has been seen says so in its first line.

## §0. Disclosure

1. **Inputs read.** The seven authority texts named in the Header, plus these files:
   - `engine/Cargo.toml`, `engine/src/{descriptor,dataset,error}.rs`;
   - `kernel/src/{skp,lib}.rs`;
   - `protocol/skp/src/v0/{mod,commands}.rs`, `protocol/skp/SKP-V0.md`;
   - `protocol/data-plane/src/{pump,adapter_ws,server}.rs`;
   - the shell's `App.tsx`, `DescribeSummary.tsx`, `liveTicketSet.ts`, `viewportStreamManager.ts`, and `src-tauri/src/{lib,commands}.rs`.

   No pilot was run, no spike exists and no corpus was collected.
2. **Evidence read outside the tree.** This is evidence, not Authority, per the round-14 distinction:
   - In `windows-sys 0.61.2`'s published source (the crate version resolved in `Cargo.lock`), `ReadDirectoryChangesW` is gated on the `Win32_System_IO` feature. `OVERLAPPED`, `GetOverlappedResult` and `CancelIoEx` live in that same module. `Win32_Storage_FileSystem` implies `Win32_Storage` → `Win32` → `Win32_Foundation`.
   - `mio 1.2.2`'s published manifest enables `Win32_System_IO` on that same `windows-sys` on Windows. `mio 1.2.2` → `windows-sys 0.61.2` is at `Cargo.lock:1263-1271`.
   - The gate re-reads both at those versions.
3. **Labelled hypotheses about OS behaviour, each with its discriminator in §5:**
   - **H1.** A watch on directory D receives no notification when D itself is renamed.
   - **H2.** A same-size in-place write is signalled no later than the writer's handle close. This follows from the documented cache caveat on `FILE_NOTIFY_CHANGE_LAST_WRITE`/`SIZE`.
   - **H3.** A buffer overflow arrives as a successful completion with 0 bytes, or as `ERROR_NOTIFY_ENUM_DIR`.
   - **H4.** Deleting the watched directory completes the pending read with an error other than `ERROR_OPERATION_ABORTED`.
4. **No fixture drive confound.** Nothing is measured against the 5 GB fixture.

## §1. What this may and may not claim

- **May claim:**
  - the adapter maps real filesystem events on a temporary directory to exactly three signals: change, coverage lost, unavailable at open;
  - kernel-side ordering: the brief's testable criterion (`state/briefs/source-change-watcher-brief.md:13`), proved with injected signals;
  - the two describe facts;
  - the new typed refusal.
- **May not claim:**
  - any OS delivery deadline or timing;
  - snapshot consistency, or detection of every modification. ADR-016 A1 item 3's limitation (`docs/adr/ADR-016-stable-feature-identity-admission.md:217-223`) stays true and is not weakened;
  - behaviour on network shares or removable media;
  - anything off Windows (see the tier note in §4);
  - any `docs/08` row or performance figure;
  - that a re-arm proves anything about a gap.
- **Wire change:** yes, one SKP literal, gated for it (§2c).
- **User-visible wording is the human's at P6.** Every new string ships as a marked placeholder (§7). Addition 2 defers the two reasons to P6. The checks-only label, the degraded-components line and the coverage-lost guidance fall under the template's standing rule that wording is the human's.
- **ADRs:** none amended. Cited: ADR-016 A1 items 2-3, ADR-010 rules 5-6, ADR-006, ADR-018, ADR-019, ADR-004 Amendment 4, ADR-030.

## §2. The change, split on the module boundary

### §2a. Engine: the adapter and the refusal type

- **The edge** (brief scope; `engine/Cargo.toml:61-72`):
  - `windows-sys` gains exactly one feature, `Win32_System_IO`. It is required: `ReadDirectoryChangesW` is gated on it.
  - **This does not change the dependency tree.** No crate and no version enters. `Cargo.lock` records no features, so both lockfiles stay byte-identical. The shipped build already compiles that module, because `mio` enables it (§0.2). ADR-030's notice set is unchanged.
  - The directory handle is opened through `std::fs::OpenOptions` with `std::os::windows::fs::OpenOptionsExt`: `access_mode(FILE_LIST_DIRECTORY)`, `share_mode(FILE_SHARE_READ|FILE_SHARE_WRITE|FILE_SHARE_DELETE)` (addition 5), `custom_flags(FILE_FLAG_BACKUP_SEMANTICS|FILE_FLAG_OVERLAPPED)`. The constants come from `Win32_Storage_FileSystem`, which is already enabled. `CreateFileW`, and with it `Win32_Security`, is not used.
- **New module `engine/src/watch.rs`.**
  - `WatchSignal { Change { action: &'static str }, CoverageLost { cause: String } }`
  - `WatchSink = Box<dyn Fn(WatchSignal) + Send + Sync>`
  - `ArmOutcome { Watching(SourceWatch), ChecksOnly { reason: String } }`
  - `trait SourceWatchArm: Send + Sync { fn arm(&self, path: &Path, sink: WatchSink) -> ArmOutcome }`
  - `PlatformWatch`, the product implementor.
  - `SourceWatch`, with `resolves_unchanged(&self, path: &Path) -> bool`. Its `Drop` disarms: `CancelIoEx`, then join.
  - Product caller of every `pub` item: the kernel (§2b). `PlatformWatch` is constructed at `frontends/shell/src-tauri/src/lib.rs:271`, where `SkpHost` is built.
- **Arming** (addition 6; brief rule 4):
  1. Resolve the final path with `std::fs::canonicalize`, which resolves junctions and symlinks in every component.
  2. Open the final path's parent.
  3. Record the final file name and, if one exists, its 8.3 short name (`GetShortPathNameW`, in `Win32_Storage_FileSystem`).
  4. Issue the first overlapped `ReadDirectoryChangesW`, with `bWatchSubtree = FALSE`, the filter `FILE_NAME | SIZE | LAST_WRITE`, and a buffer of `WATCH_BUFFER_BYTES` (§7).
  5. Only once that read is pending, spawn one watcher thread. It waits in `GetOverlappedResult(bWait = TRUE)`, with no event object and exactly one outstanding read.

  Any failure in steps 1-4 returns `ChecksOnly { reason }` with the OS error's own text (brief rule 3).
- **Event → signal mapping.** A name matches when it equals the final name or the short name under case-insensitive comparison. The method is declared in §7 (addition 6).

| Observed | Signal |
|---|---|
| `ADDED`, `REMOVED`, `MODIFIED`, `RENAMED_OLD_NAME` or `RENAMED_NEW_NAME` on a matching name. Temp-write-then-rename-over arrives as `RENAMED_NEW_NAME` and counts (addition 6). An unknown action value on a matching name also lands here. | `Change` |
| A name that does not match | nothing |
| Successful completion with 0 bytes, or `ERROR_NOTIFY_ENUM_DIR` (overflow) | `CoverageLost` |
| Any other completion error, including deletion of the watched directory; or `ERROR_OPERATION_ABORTED` that the watch itself did not request; or a failed re-issue after a completion (a gap) | `CoverageLost` |
| `ERROR_OPERATION_ABORTED` after its own disarm | nothing |

- **One signal per watch.** After delivering its first signal, the thread stops and closes its handle. There is no re-arm inside an open (brief rule 2): a signal-free re-arm proves nothing.
- **Off Windows:** `PlatformWatch::arm` returns `ChecksOnly { reason }` naming the platform. This is declared beside the tier note in §4 and never claims `watching`.
- **Watched-directory rename.** The attach point is stop item **S2**: a one-level grandparent watch, filtered to `DIR_NAME` on the parent's name, would live here.
- **Refusal type.** A new `EngineError::SourceCoverageLost { detail: String }`:
  - It is mapped in `error_of`'s exhaustive match. Its code is `engine.source_coverage_lost`, and `fields` holds `detail`.
  - Class: an `engine.` code, by SKP-V0.md §5's variant-name rule (`protocol/skp/SKP-V0.md:258-275`).
  - Family: session-ended, the same family as `engine.source_changed`. Non-retryable.
  - Its `Display` states engine facts only: what coverage was lost, and the cause. It never states a consequence (the operator-visible text rule). The text is a P6 placeholder.
- **Checks accessor.** A new `SourceDescriptor::unestablished_components(&self) -> Vec<&'static str>`:
  - it returns `"mtime"` when the modification time is absent, and `"footer-hash"` when no footer hash was taken;
  - the names are the vocabulary `components_differing_from` already uses (`engine/src/descriptor.rs:248-267`);
  - product caller: the kernel's describe assembly.

  `degradation()` (`engine/src/descriptor.rs:225-227`) stays unchanged, as an instrument.
- **Unchanged, byte for byte:**
  - `refuse_if_changed` and `refuse_if_changed_or_unreadable` (`engine/src/descriptor.rs:279-305`);
  - `check_source_unchanged` (`engine/src/dataset.rs:553-555`);
  - `post_check_source`;
  - `FOOTER_DESCRIPTOR_MAX_BYTES`.

  The watcher adds signals and replaces nothing (brief scope).

### §2b. Kernel: arming, admission, the reason, ending the generation

- **Construction.** `SkpHost::new` gains a required `Arc<dyn SourceWatchArm>`, on the P3b `ticket_only` precedent. The product caller is `frontends/shell/src-tauri/src/lib.rs:271`, passing `PlatformWatch`. Test callers are updated, and a test caller does not discharge the caller rule.
- **Open and admission** (brief rule 4; addition 6). `open_dataset` (`kernel/src/skp.rs:720-749`) arms first, before `catalog.open_cancellable`, and so before the descriptor read at `engine/src/dataset.rs:509`. The kernel's sink holds a per-open latch with two states: pre-admission and admitted. At admission, under the latch lock:
  1. If any signal was recorded, the open is refused and the catalog entry removed. A `Change` refuses as `engine.source_changed`, with a `detail` naming a notification before admission. A `CoverageLost` refuses as `engine.source_coverage_lost`.
  2. If `SourceWatch::resolves_unchanged(req.path)` is false, the final path moved between arming and admission, and the open is refused as `engine.source_changed`.
  3. Otherwise `mint_for_open` runs and the latch flips to admitted.
- **The reason** (addition 2). A new `SessionEndReason { ObservedChange, CoverageLost }`.
  - `GenerationState.invalidated` (`kernel/src/skp.rs:312`) becomes `HashMap<String, SessionEndReason>`.
  - `dead_tickets` values carry the reason.
  - `invalidate(dataset, reason)` records the first reason and reports whether this call ended the generation.
  - `SessionInvalidator::end_generation(dataset, reason)` (`kernel/src/skp.rs:610-619`). The existing pre-check and post-check callers pass `ObservedChange`.
  - `live_or_mint` returns `Result<u64, SessionEndReason>`.
  - `TicketLiveness` (`kernel/src/skp.rs:349-360`) gains `EndedByCoverageLoss` beside `EndedBySourceChange`.
- **Signal after admission** (brief rules 1-2; additions 1-2). The sink calls `end_generation(dataset, reason)`: `Change` → `ObservedChange`, `CoverageLost` → `CoverageLost`. This happens regardless of the descriptor. The existing invalidate-then-cancel order is kept, so every ticket of that generation is recorded dead before any cancel produces a terminal (criterion clause 2). One log line records what ended it; there is no duration (ADR-018).
- **The refusal takes its code from the reason, never `SourceChanged` for a coverage loss:**
  - the live-generation arm and the mint-race arm in `viewport_query` (`kernel/src/skp.rs:797-803`, `:840-846`);
  - `create_from_ticket`'s dead-ticket arm (`kernel/src/lib.rs:409-434`), which gains the third arm.

  The descriptor comparison itself is untouched.
- **Cancelled streams.** A stream cancelled by a watcher-ended generation keeps its own cancelled terminal (`kernel/src/lib.rs:459-461`; that rule is unchanged). The shell learns of the end through the push, S1.
- **Watch lifetime.** The watch lives as long as the open. It is dropped at `close_dataset`. It is never re-armed. A reopen is a new `open_dataset` with a new handle and a new watch (brief rules 2 and 5).
- **Describe** (`kernel/src/skp.rs:751-758`) stays ADR-006 class 1, pure:
  - `coverage` is the fact recorded at admission and is never rewritten afterwards. After a loss it still reads `watching`, because a later loss is rule 2, never a downgrade to checks-only (brief rule 3).
  - `checks` comes from `ds.descriptor().unestablished_components()`.
- **Idle notification.** The attach point is stop item **S1**. Here would sit the host's session-ended listener, which the watcher's sink calls only on the transition that actually ends the generation.

### §2c. Protocol: two describe facts, one code, one literal

- **Rust** (`protocol/skp/src/v0/commands.rs:226-240`). `DescribeResponse` gains two top-level members, named in the human's words (addition 1):
  - `coverage: SourceCoverage { state: String /* "watching" | "checks-only" */, reason: Option<String> /* Some exactly for checks-only; key always present */ }`
  - `checks: SourceChecks { state: String /* "full" | "degraded" */, components: Vec<String> /* non-empty exactly for degraded; "mtime" | "footer-hash" */ }`

  Both are `deny_unknown_fields`, in the string-valued convention `sanity` already uses.
- **TypeScript** (`frontends/shell/src/skp/types.ts`):
  - `type SourceCoverage = { state: "watching"; reason: null } | { state: "checks-only"; reason: string }`
  - `type SourceChecks = { state: "full"; components: [] } | { state: "degraded"; components: ("mtime" | "footer-hash")[] }`
- **Independence.** The two facts are independent (addition 1). `checks: degraded` is what delivers ADR-016 A1 item 2's owed display (`docs/adr/ADR-016-stable-feature-identity-admission.md:214`, `:240`); no separate wire field carries degradation alone. `coverage` never carries a degradation, and `checks` never carries coverage. No generation value is on the wire.
- **Literal.** The literal after `crs-unit-fact-and-bounds`' literal, by merge order (RULED 2026-09-24 (night) item (2)). On the custodian's statement that that piece takes `skp/0.4`, this is `skp/0.5`. The bump is at `protocol/skp/src/v0/mod.rs:40`.
- **Change-log entry.** A new SKP-V0.md §8 entry, appended per `protocol/skp/SKP-V0.md:449-454`, listing:
  - the two members and their value sets;
  - `engine.source_coverage_lost`;
  - "no generation value";
  - "`protocol/data-plane/` has an empty diff".

  Fixtures on both sides of the wire are updated in the same commit (§4 item 13's discipline). §4 items 7 and 8 get their one-line notes. Item 7's note attaches to **S1**.

### §2d. Shell: the owner, inside existing components only

- **Matching** (`frontends/shell/src/streaming/liveTicketSet.ts:43-71`). The two predicates widen to the session-ended family, `engine.source_changed` and `engine.source_coverage_lost`, and are renamed `isSessionEndedTerminal` / `isSessionEndedRefusal` so that neither name misstates what it matches. Every caller is updated. The detail's code prefix carries the reason unchanged through `handleSessionEnded` / `endSessionForDataset` (`frontends/shell/src/App.tsx:638-672`). That is the same owner-side path, and nothing new is added to it (addition 2).
- **Guidance.** `refusalGuidance` gains an `engine.source_coverage_lost` case, as a P6 placeholder. The existing `engine.source_changed` string is unchanged.
- **Status** (addition 3; redesign rule (d)). Case (f)'s status is P3b's existing session-ended block (`App.tsx:1725-1727`), with the new reason. No element is added to `.canvas-status-stack` or placed over the map. **The brief's rule 3 places the checks-only label in "describe + status stack"; addition 3 governs, so the label goes in `DescribeSummary` only.**
- **DescribeSummary** (`frontends/shell/src/admission/DescribeSummary.tsx:11-65`) gains two conditional rows, following the `sessionStatementLine` precedent:
  - a checks-only row, shown only when `coverage.state === "checks-only"`, with its reason;
  - a degraded-checks row, shown only when `checks.state === "degraded"`, with its components.

  Both are P6 placeholders, and both are migration-inventory items owed in the ledger under rule (d). **Reading recorded:** shell direction item (b) holds the watcher's status display for Map studio. Addition 3, the later sight, places that display within existing components, so no new display is built and (b) is honoured.
- **Retry set.** Unchanged. The new code is not retryable.
- **Idle and in-stream consequences.** The attach point is stop item **S1**: a listener calling the managers' existing session-end routes and `endSession`.

## §3. Fixtures — outcomes predicted before any run

| Fixture | Use | Predicted outcome |
|---|---|---|
| A plain file in a per-test temp directory | engine adapter tests A1-A11 | as registered in §4 |
| The small GeoParquet fixture `engine/tests/session_identity.rs` opens, copied into a temp directory | kernel tests K1-K12 | as registered in §4 |
| The same fixture's describe | K11 | `checks.state = "full"` |

Every fixture is hash-verified before copying and again after the run. No corpus file is edited.

## §4. Tests, and one mutation per new test

**The tier note, with the non-goal beside it.** There are two tiers, and each claims only what it proves:
- **Tier 1:** injected-signal ordering, deterministic. It uses a test `SourceWatchArm` whose sink the test fires.
- **Tier 2:** the Windows adapter, `#[cfg(windows)]`, with real events on a temp directory. It proves the mapping, never timing. Waits are bounded by the harness ceiling in §7, which is not a claim.

Non-Windows is a non-goal, declared here: nothing off Windows is tested or claimed beyond `ChecksOnly`.

**Tier 2, `engine/tests/source_watch_adapter.rs`:**

| Test | Asserts | Mutation that fails it by name |
|---|---|---|
| A1 `a_same_size_in_place_write_with_restored_mtime_signals_change_while_the_descriptor_still_matches` | `Change`, and `SourceDescriptor::of` equal before and after | drop `LAST_WRITE` and `SIZE` from the filter |
| A2 `renaming_the_source_away_signals_change` | `Change` | ignore `RENAMED_OLD_NAME` |
| A3 `a_temp_write_renamed_over_the_source_signals_change` | `Change` (addition 6) | ignore `RENAMED_NEW_NAME` |
| A4 `deleting_the_source_signals_change` | `Change` | ignore `REMOVED` |
| A5 `a_sibling_change_signals_nothing_and_a_later_source_write_does` | the first signal is the source's (negative control) | match any name |
| A6 `a_forced_overflow_signals_coverage_lost` | a blocking test sink holds the thread while a burst fills `WATCH_BUFFER_BYTES`; the next completion yields `CoverageLost` | treat a 0-byte success as "no events" |
| A7 `a_differently_cased_name_renamed_over_the_source_signals_change` | `Change` (addition 6) | compare names byte-exactly |
| A8 `renaming_the_watched_directory_succeeds_and_signals` | **attach: S2** | — |
| A9 `deleting_the_watched_directory_succeeds_and_signals` | the removal succeeds (not locked), a signal arrives, and the directory is gone once released (addition 5) | open without `FILE_SHARE_DELETE` |
| A10 `a_source_reached_through_a_junction_is_watched_at_its_final_path` | the junction is created by `cmd /C mklink /J`, spawned with a timeout; `Change` on the target | watch the unresolved parent |
| A11 `an_unlistable_directory_arms_checks_only_with_its_reason` | `icacls` deny on list-directory, spawned with a timeout and removed afterwards; `ChecksOnly` with the OS error | panic, or `Watching`, on an open failure |
| A12 `a_disarmed_watch_delivers_nothing` | disarm, then no signal, and the directory can be deleted | map `ERROR_OPERATION_ABORTED` to `CoverageLost` unconditionally |

**Seam test, engine → kernel, from the real shape.** `kernel/tests/source_watch_windows.rs::a_real_write_to_the_open_source_ends_its_generation_through_the_host`:
- it runs `PlatformWatch` through `SkpHost::open_dataset` on a temp copy;
- then writes to the file;
- `viewport_query` then refuses with `engine.source_changed`.
- Mutation: the sink ignores signals once admitted.

**Tier 1, `kernel/tests/source_watch_ordering.rs`:**

| Test | Asserts | Mutation |
|---|---|---|
| K1 `a_signal_before_a_query_ends_the_generation_before_its_ticket_is_minted` | criterion clause 1 and case (a): the file is untouched, the descriptor matches, and the query is refused | sink records but does not end |
| K2 `a_signal_during_a_stream_ends_the_generation_before_its_terminal` | at terminal receipt, `ticket_liveness` already reports ended (criterion clause 2) | sink cancels tickets without invalidating |
| K3 `a_signal_while_idle_ends_the_generation_and_notifies_the_host` | **attach: S1** | — |
| K4 `coverage_loss_refuses_with_its_own_code_never_source_changed` | the pre-check refusal and the dead-ticket terminal both carry `engine.source_coverage_lost` (addition 2) | map `CoverageLost` to `ObservedChange` |
| K5 `a_signal_free_rearm_does_not_restore_an_ended_generation` | refused until reopen; a reopen admits a fresh watch (case (c)) | clear `invalidated` when a new watch arms |
| K6 `a_signal_between_arming_and_admission_refuses_the_open` | no catalog entry, no generation (case (e)) | mint before checking the latch |
| K7 `the_first_reason_wins_when_two_signals_end_one_generation` | the first reason stands | overwrite the reason in `invalidate` |
| K8 `an_unwatchable_source_opens_checks_only_and_describe_says_so` | case (d) | describe hardcodes `watching` |
| K9 `a_loss_after_admission_ends_the_generation_and_describe_still_says_watching` | case (d)'s second half (rule 3) | rewrite coverage on loss |
| K10 `no_batch_from_an_ended_generation_is_admitted_and_nothing_reloads` | the dead ticket refuses, `live_or_mint` stays refused, and nothing reopens (case (g)) | `live_or_mint` mints over an invalidation |
| K11 `describe_reports_checks_full_for_an_undegraded_fixture` | checks full on a real fixture | report `degraded` with an empty list |
| K12 `source_coverage_lost_maps_to_its_own_code_and_detail` | the `error_of` mapping | reuse the `source_changed` arm |

**Engine unit tests:**
- `descriptor::tests::an_absent_modification_time_is_an_unestablished_component`. It uses the shipped `of` plus the private recorder, per the in-module precedent. Mutation: return an empty list.
- `descriptor::tests::a_footer_hash_not_taken_is_an_unestablished_component`. Mutation: omit `footer-hash`.

**Protocol:**
- `protocol/skp/tests/fixtures.rs::describe_carries_coverage_and_checks_as_two_independent_objects`, with the matching test in `frontends/shell/src/skp/__tests__/fixtures.test.ts`. Mutation: merge the two into one list.
- The literal test asserts the version from §2c. Mutation: leave the unit piece's literal.

**Shell (vitest):**

| Test | Asserts | Mutation |
|---|---|---|
| S1 | DescribeSummary renders the checks-only row with its reason, and only then (case (d); addition 3) | render it unconditionally |
| S2 | the degraded row lists the components | drop the components |
| S3 | a coverage-lost terminal ends the session once through `handleSessionEnded`; the block carries the coverage-lost guidance, not the source-changed sentence | leave the predicate on `source_changed` only |
| S4 | a coverage-lost pre-check refusal ends the session | same mutation on the refusal predicate |
| S5 | the coverage-lost code is not retryable | add it to the retry set |
| S6 | after a watcher-ended session, a batch on the retired ticket is dropped | skip `liveTickets.invalidate()` |
| S7 | idle event → residency cleared, picks refused, block shown | **attach: S1** |
| E2E | `frontends/shell/e2e/source-watch-idle.mjs`, case (f), using P3b's S5a/S5c assertions | **attach: S1** |

S3 and S4 build the terminal and refusal from the kernel-produced bytes pinned in `testUtils/terminalShapes.ts`, the P3b precedent.

**Acceptance cases mapped to tests:**
- (a) K1, A1
- (b) A2, A3, A4, A7, K1
- (c) A6, K4, K5
- (d) A11, K8, K9, S1
- (e) K6
- (f) K3, S7, E2E: **all attach to S1**
- (g) K10, S6

**Caller-grep list for the PR body.** Each item with its product caller: `SourceWatchArm`, `PlatformWatch`, `SourceWatch::resolves_unchanged`, `unestablished_components`, `SessionEndReason`, `EndedByCoverageLoss`, the renamed shell predicates, `coverageLine`, `checksLine`.

## §5. Registered predictions · declared unchanged · invalidators · falsification

- **Registered predictions:**
  - H1: an adapter probe records no completion on the parent handle when that directory is renamed. If one arrives, S2's second watch is unnecessary; that is recorded as class 2.
  - H2: A1 passes with the writer's handle closed before the wait.
  - H3: A6 observes one of the two forms named in §0.
  - H4: A9 observes an error completion or a `REMOVED` event first. Either one ends the watch.
- **Declared unchanged:**
  - the descriptor's comparison and refusal paths, and the pre-check and post-check (§2a);
  - `protocol/data-plane/`, an empty diff;
  - publish (`kernel/src/publish`, `src-tauri/src/publish.rs`), an empty diff;
  - the `engine.source_changed` guidance string;
  - the cancelled-terminal rule;
  - the N8 reopen reset;
  - both lockfiles.
- **Invalidators — any one stops the piece:**
  - a crate, a crate version, or a `windows-sys` feature beyond `Win32_System_IO` is needed;
  - either lockfile changes;
  - the tier-1 injection cannot be built without a test-only `pub` item;
  - any addition can be met only by changing the pre-check or post-check.
- **Falsification:** A1 cannot be made to signal a same-size in-place write at all on NTFS, even after the writer's handle closes. Then case (a) cannot be met, the preregistration is wrong, and the piece stops.

## §6. Instruments

- Assertions only: signal kinds, typed codes, registry states, describe values, rendered rows.
- No measurement, no duration (ADR-018), no `docs/08` row.

## §7. Declared values and ceilings (ADR-010 rule 6)

| Value | Declared | What it bounds |
|---|---|---|
| `WATCH_BUFFER_BYTES` | 65536 | the per-watch notification buffer; overflow past it is `CoverageLost` |
| Notify filter | `FILE_NAME \| SIZE \| LAST_WRITE`, no subtree | which events reach the mapping |
| Name comparison | UTF-16 decoded, compared per `char` through `to_uppercase` where the mapping is 1:1, otherwise exact; against the final long name and the 8.3 short name | a match. The residual — exotic characters where NTFS's upcase table differs — is disclosed as a KNOWN-LIMITATIONS line |
| Signals per watch | 1 | after it, the thread exits |
| Re-arms per open | 0 | — |
| Watches per open | 1 thread, 1 handle (S2 would make it 2 handles) | released at close |
| `WATCH_TEST_WAIT` | 10 s, tests only | harness ceiling, not a claim |
| String placeholders | each shipped string starts `[P6 placeholder]` | the four new operator strings: checks-only row, degraded row, coverage-lost guidance, `SourceCoverageLost` Display |

**KNOWN-LIMITATIONS lines owed, in this piece:**
- Windows only;
- the cache-flush caveat (H2);
- a symlink retargeted after admission is caught at the next pre-check, not while idle;
- ancestors above the watched level;
- the case-fold residual.

## §8. Block-on-sight

1. Any polling or timer-driven check.
2. Any diff in the descriptor comparison or refusal paths, `check_source_unchanged`, or `post_check_source`.
3. A coverage loss surfacing as `engine.source_changed` anywhere, in Rust or TypeScript.
4. A new element in the canvas status stack or over the map, or the checks-only label outside `DescribeSummary`.
5. A generation value on the wire, or `coverage` rewritten after admission.
6. Automatic reload, in-open re-arm, or a restored generation.
7. Either lockfile changes, a new crate, or a `windows-sys` feature other than `Win32_System_IO`.
8. A `pub` item, callback or option without a product caller.
9. An operator string unmarked as a placeholder, or presented as settled.
10. An engine message stating a consequence.
11. Any timing or `docs/08` claim.
12. A publish diff.
13. A wrong literal, a missing §8 entry, or fixtures not updated on both sides in one commit.
14. A non-Windows path reporting `watching`.
15. A test encoding an imagined interface.
16. A directory handle opened without `FILE_SHARE_DELETE`.
17. Work on the S1 or S2 attach points before the human's ruling.

## §9. Gates

- **Architect:** block-on-sight items 1-17 one by one; ADR-016 A1 items 2-3; ADR-010 rules 5-6; ADR-006 (describe stays class 1, and a watcher end is a session-state transition, not undoable); the cross-module seam rule on each seam, engine→kernel, kernel→protocol and kernel→shell.
- **Reviewer:** the full diff, with the wire change reviewer-gated in its own right.
- **Suites:** these must be green first:
  - `cargo test` for `spatial-engine`, `spatial-kernel` and `spatial-skp`;
  - the shell's `npm run verify`;
  - `verify-mutation` over every §4 mutation;
  - CI's `node --test` scripts suite.
- **Operator:** rows committed with blank result logs and queued for the next sitting:
  - case (f), felt;
  - wording of the checks-only row and the degraded row;
  - wording of the coverage-lost guidance;
  - "read the last amendment first".
- **No merge tonight.** Merge order: after `crs-unit-fact-and-bounds`, before B1.

## §10. Amendments

*(opens empty; append-only)*

---

## Stop list

**S1 — the idle push path does not exist.** This blocks addition 4, case (f), and the owner-side consequences of a watcher end during a stream.
- **Why it is beyond the brief.** SKP v0 declares no server-to-client push "in any form" (`protocol/skp/SKP-V0.md:216`, §4 item 7). The only kernel-host → webview events today are Tauri `emit`s outside SKP: publish progress (`frontends/shell/src-tauri/src/commands.rs:319`, `:404`) and the origin self-check (`frontends/shell/src-tauri/src/lib.rs:139-142`, `:243-246`). Neither carries a dataset-session fact. The data plane socket exists only while a stream runs (`frontends/shell/src/streaming/adapterWs.ts:34-37`). Carrying a kernel dataset-handle fact to the shell is a control-plane push: the first "subscriptions and events" entry that `docs/10_SKP_Protocol.md:21` requires the spec to cover. That is a protocol decision, not implementation.
- **Where it attaches:**
  - the listener in §2b;
  - `protocol/skp` §4 item 7 and the §8 entry;
  - the §2d listener, which calls the managers' session-end routes and `endSession`;
  - K3, S7 and the E2E test.
- **Recommendation:** rule a single SKP event, per the ADR skeleton below, carried by the watcher's own literal. Not recommended: a Tauri event outside SKP on the publish-progress precedent. It would put an SKP dataset fact on a second contract that the conformance suite and the MCP adapter can never see (docs/02, docs/10).

**S2 — detecting a rename of the watched directory needs a second watch.**
- **Why it is beyond the brief.** The brief names `ReadDirectoryChangesW` "on the parent directory" (`state/briefs/source-change-watcher-brief.md:4`). Addition 5 requires that renaming that directory "ends the generation". Per H1, the parent's own watch does not see its own rename.
- **Where it attaches:**
  - a second handle in §2a on the final path's parent's parent: `DIR_NAME` only, no subtree, share-all, mapped to `Change` on the parent's name;
  - A8;
  - §7's handle count.
- **Recommendation:** approve one level. A parent at a drive root needs no second watch. If the grandparent cannot be armed, the open is `checks-only` with that reason, which is conservative. Ancestors above the grandparent become a KNOWN-LIMITATIONS line: they are caught at the next pre-check, not while idle. If the H1 probe shows the parent watch does see its own rename, S2 falls away as class 2.

**Checked, not stop items (already covered):**
- the `Win32_System_IO` feature: the dependency tree is unchanged, see §2a;
- the four placeholder strings: they are required by ruled items, and their wording is the human's at P6;
- no polling;
- no publish change;
- no pre-check or post-check change;
- the checks-only label's placement: addition 3 overrides the brief's status-stack placement;
- the migration-inventory ledger entries: owed by the custodian under rule (d).

---

## ADR skeleton (for S1): proposed, for the human

**ADR-0XX — SKP control-plane events: `dataset_session_ended`**

- **Context.**
  - SKP v0 declares no push (`protocol/skp/SKP-V0.md:216`), yet `docs/10_SKP_Protocol.md:21` requires the spec to cover subscriptions and events.
  - The advisory watcher can end a dataset-session generation while no command or stream is in flight. The sight's addition 4 requires the shell to learn of it without polling.
  - Tauri events already exist outside SKP, for publish progress and the origin self-check.
- **Decision (proposed).**
  - One event kind on the control plane, delivered over the Tauri binding as a Tauri event whose name is a constant in `protocol/skp`.
  - Payload `{ skp, kind: "dataset_session_ended", dataset, code, detail }`. `code` is `engine.source_changed` or `engine.source_coverage_lost`. `detail` has the terminal's `"<code>: <display>"` shape, so the existing owner handler consumes it unchanged.
  - No generation value, no timestamp (ADR-004 Amendment 4), no subscription command: the one webview receives it implicitly.
  - Best-effort and at most once. The kernel stays authoritative: every later command refuses by its code regardless. Consumers must be idempotent, which the P3b and N8 handlers already are.
  - SKP-V0 §4 items 2 and 7 are updated under the watcher's literal.
- **Consequences.**
  - It is SKP's first push. Its ordering relative to data-plane frames is not guaranteed and must not be claimed.
  - The conformance suite and a future MCP adapter inherit the event.
  - Any later event kind is a new version and its own decision, not an extension of this one.
