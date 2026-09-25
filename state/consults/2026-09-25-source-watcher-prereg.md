*Custodian's filing note (2026-09-25): the architect agent's consult for PLAN node `engine-source-change-watcher`, redrafting the filed preregistration (`state/consults/2026-09-24-source-change-watcher.md`) to rounds 17–21 and ADR-035, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text. Section 1's fenced block is committed as `engine/SOURCE-WATCHER-PREREGISTRATION.md`, the first commit on the implementation branch; stop item X1 goes to the human.*

---

**Verdict: pass with notes.** The redraft is below, read at main `c16f41d`. S1 and S2 are resolved to round 17 item 2, and ADR-035 replaces the draft's ADR skeleton. One stop item, X1, needs the human before code reaches its attach point. X2 to X4 are sequencing or mechanics calls. No principle, boundary or operation-class violation was found. The draft had two defects, both fixed here: it relied on session-end routes the baseline manager doesn't have, and the tier-1 injection needed a test-only constructor for `SourceWatch`. Nothing below is quoted; every ruling is cited by round and item, and nothing cites a line.

---

## 1. Preregistration text. Proposed path: `/C:/dev/spatial-ide/engine/SOURCE-WATCHER-PREREGISTRATION.md`

```markdown
# Preregistration: the advisory source-change watcher (`engine-source-change-watcher`)

## Header

- **Authority.** PLAN node `engine-source-change-watcher`, generation 1. Binding, cited by round and item or by block:
  - the brief, `state/briefs/source-change-watcher-brief.md` (its Scope, Signals and rules 1–5, Testable criterion, Acceptance cases (a)–(g), Non-goals);
  - RULED 2026-09-24, the watcher sight, additions 1–7 (`state/directives/2026-09-24-watcher-sight.md`, section "The watcher sight"). Where they differ from the brief, the additions govern;
  - RULED 2026-09-24 — question round 17, item 2 (S1: one control-plane event, riders (a) and (b); S2: one grandparent watch, with ancestors above it as a KNOWN-LIMITATIONS line);
  - question round 18, items 1–3 (item 2: a kernel-minted session reference; item 3: generation-scoped refusals, and `describe` carrying the ended state);
  - question round 19, item 1 (the single emission point: every end emits);
  - question round 21, item 1 (ADR-035 accepted as merged). Riders (a) and (b) bind here; rider (c)'s `SKP-V0.md` §8 note belongs to PR #119, not this piece;
  - RULED 2026-09-24 (night), item (2) (literals follow merge order);
  - RULED 2026-09-25, the cloud hooks, the wave-1 block (§4, confirmed §5): an S1 from audits A2 or A5 in this piece's code is folded in before merge, and the SKP conformance session's `skp/0.4` fixtures are updated by the custodian at integration;
  - RULED 2026-09-23 (late): entry 119 item (3), as corrected by addition 1, and shell-direction items (c)–(d);
  - ADR-016 Amendment 1, items 2–3, with its acceptance note and its "Owed at acceptance" note;
  - ADR-035, Decisions 1–7, as the design those rulings adopted. Until PR #119 sets its Status to Accepted, the gates resolve against the rulings above, not against the ADR's text.
- **Drafted by** the architect agent on the custodian's consult brief. It reads main at `c16f41d`. References are by path, symbol and section, and no reference carries a line.
- **Base:** main. The ruled base, `crs-unit-fact-and-bounds`, merged as PR #112, so main contains it. At `c16f41d`, `SKP_VERSION` is `skp/0.4` in both `protocol/skp/src/v0/mod.rs` and `frontends/shell/src/skp/types.ts`.
- **Status: committed before any code. Append-only.** An amendment written after any outcome has been seen says so in its first line.

## §0. Disclosure

1. **Read at `c16f41d`:**
   - `engine/Cargo.toml` and `engine/src/{descriptor,dataset,error,lib}.rs`;
   - `kernel/src/{skp,lib}.rs`, including `skp.rs`'s `ticket_drop_under_lock_regression` module, and `kernel/tests/no_generation_in_persisted_artifacts.rs`;
   - `protocol/skp/src/v0/{mod,commands,handles}.rs` and `protocol/skp/SKP-V0.md` §§3, 4, 5 and 8;
   - in `frontends/shell/src-tauri/src/`, `lib.rs` (`run`'s `setup` closure) and `commands.rs`;
   - in `frontends/shell/src/`: `App.tsx` (`handleSessionEnded`, `endSessionForDataset`, `endSession`, `handleAdmitted`, `reportViewportOutcome`), `admission/{admitDataset.ts,DescribeSummary.tsx,formatRefusal.ts}`, `streaming/{liveTicketSet.ts,viewportStreamManager.ts,tileViewportStreamManager.ts}`, `residency/candidateArmSession.ts` and `skp/{types.ts,client.ts}`;
   - `frontends/shell/e2e/source-changed.mjs`;
   - `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md` and `docs/adr/ADR-016-stable-feature-identity-admission.md`.

   No pilot, spike or corpus. The filed draft, `state/consults/2026-09-24-source-change-watcher.md`, is superseded by this text.
2. **Evidence, not Authority** (the round-14 distinction). The draft read two published crate sources:
   - `windows-sys 0.61.2` (the version `Cargo.lock` resolves): `ReadDirectoryChangesW` is gated on feature `Win32_System_IO`, and `OVERLAPPED`, `GetOverlappedResult` and `CancelIoEx` live in that module;
   - `mio 1.2.2`'s manifest enables `Win32_System_IO` on the same crate. See `Cargo.lock`'s `mio` entry.

   The gate re-reads both at those versions.
3. **Hypotheses.** Each is labelled, and §5 holds its discriminator:
   - **H1.** A watch on directory D gets no notification when D itself is renamed.
   - **H2.** An in-place write is signalled no later than the writer's handle close.
   - **H3.** An overflow arrives as a 0-byte success or as `ERROR_NOTIFY_ENUM_DIR`.
   - **H4.** Deleting the watched directory completes the pending read with an error other than `ERROR_OPERATION_ABORTED`, or with a `REMOVED` event first.
   - **H5.** A modification-time touch (`File::set_modified`) under the `LAST_WRITE` filter yields `MODIFIED` on the source's name.
4. **Fixture-drive confound: none.** Nothing is measured.

## §1. What this may and may not claim

- **May claim:**
  - the adapter maps real filesystem events on a temp directory to three signals: change, coverage lost, unavailable at open;
  - kernel ordering, the brief's Testable criterion, proved with injected signals;
  - emission at the single end point, at most once per ended generation (round 19 item 1);
  - the session reference, the three `describe` facts, the new typed refusal;
  - case (f) end to end on Windows.
- **May not claim:**
  - any OS delivery deadline, event ordering against data-plane frames, or a latency (ADR-035 Consequences);
  - snapshot consistency, or detection of every modification (ADR-016 A1 item 3's limitation stands);
  - network shares or removable media; anything off Windows (tier note, §4);
  - a `docs/08` row, a cost for the enqueue or the arming, or any duration (ADR-018);
  - that a re-arm proves anything about a gap.
- **Wire change: yes.** It is gated for it: `skp/0.5` (§2c).
- **User-visible wording is the human's at P6** (addition 2). Every new string is a marked placeholder (§7).
- **ADRs: none amended.** Cited: ADR-016 A1 items 2–3; ADR-035; ADR-010 rules 5–6; ADR-006; ADR-018; ADR-019; ADR-004 Amendment 4; ADR-030.

## §2. The change, split on the module boundary

### §2a. Engine: the adapter, the refusal type, the checks accessor

- **Edge.** `engine/Cargo.toml`'s `windows-sys` gains exactly one feature, `Win32_System_IO`. No crate and no version enter, both lockfiles stay byte-identical, and ADR-030's notice set is unchanged (§0.2).
  - Handles are opened with `std::fs::OpenOptions` plus `OpenOptionsExt`, with:
    - `access_mode(FILE_LIST_DIRECTORY)`;
    - `share_mode(FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE)` (addition 5);
    - `custom_flags(FILE_FLAG_BACKUP_SEMANTICS | FILE_FLAG_OVERLAPPED)`.
  - No `CreateFileW` and no `Win32_Security`.
- **New module `engine/src/watch.rs`:**
  - `pub enum WatchSignal { Change { action: &'static str }, CoverageLost { cause: String } }`;
  - `pub type WatchSink = Arc<dyn Fn(WatchSignal) + Send + Sync>`;
  - `pub trait ArmedWatch: Send { fn resolves_unchanged(&self) -> bool; }`. Disarm is its `Drop`;
  - `pub enum ArmOutcome { Watching(Box<dyn ArmedWatch>), ChecksOnly { reason: String } }`;
  - `pub trait SourceWatchArm: Send + Sync { fn arm(&self, path: &Path, sink: WatchSink) -> ArmOutcome; }`;
  - `pub struct PlatformWatch`, the product implementor. Its `SourceWatch` is the product `ArmedWatch`.
  - Product caller of every `pub` item: the kernel (§2b). `PlatformWatch` is constructed in the shell's `run` `setup` closure, where `SkpHost` is built. Tier-1 tests implement the two traits themselves, so no constructor exists for tests only.
- **Arming** (addition 6; brief rule 4):
  1. `std::fs::canonicalize` the path. This resolves junctions and symlinks in every component.
  2. Open the parent, P.
  3. Record the final name, and its 8.3 short name if one exists (`GetShortPathNameW`).
  4. Issue P's first overlapped `ReadDirectoryChangesW`: no subtree, filter `FILE_NAME | SIZE | LAST_WRITE`, buffer `WATCH_BUFFER_BYTES`, DWORD-aligned.
  5. Unless P is a volume root (round 17 item 2, S2 as recommended), open P's parent, G, and issue its read: filter `DIR_NAME`, no subtree, matching P's long and short names.
  6. Only once every read is pending, spawn one thread per handle. Each waits in `GetOverlappedResult(bWait = TRUE)`, with no event object and one outstanding read.

  Any failure in steps 1–5 returns `ChecksOnly { reason }`: the step that failed plus the OS error's text, which are engine facts only. A failure to arm G is checks-only too; this is the conservative reading ruled as recommended.
- **Mapping.** Name comparison per §7.

| Observed | Signal |
|---|---|
| P: `ADDED`, `REMOVED`, `MODIFIED`, `RENAMED_OLD_NAME` or `RENAMED_NEW_NAME` on a matching name, or an unknown action on a matching name. A temp-write renamed over the source counts (addition 6). | `Change` |
| G: any action on P's name | `Change` |
| A non-matching name | nothing; re-issue |
| A 0-byte success, or `ERROR_NOTIFY_ENUM_DIR` | `CoverageLost` |
| Any other completion error; `ERROR_OPERATION_ABORTED` not requested by the watch's own disarm; a failed re-issue | `CoverageLost` |
| `ERROR_OPERATION_ABORTED` after its own disarm | nothing |

- **At most one signal per handle.** After its first signal a thread stops. There is no re-arm within an open (brief rule 2). The kernel's transition report makes a second handle's signal a no-op (§2b).
- **Off Windows,** `PlatformWatch::arm` returns `ChecksOnly` naming the platform, and never `Watching`.
- **Refusal type.** A new `EngineError::SourceCoverageLost { detail: String }`:
  - `error_of` maps it to `engine.source_coverage_lost` (SKP-V0 §5's `engine.` + variant-name rule), with `fields.detail`;
  - it belongs to the session-ended family and is not retryable;
  - its `Display` states engine facts only (the operator-visible-text rule) and is a P6 placeholder;
  - the engine never raises it: its product callers are the kernel's refusal sites (§2b).
- **Checks accessor.** `SourceDescriptor::unestablished_components(&self) -> Vec<&'static str>`:
  - it returns `"mtime"` when no modification time was reported, and `"footer-hash"` when no hash was taken, in `components_differing_from`'s vocabulary;
  - product caller: the kernel's `describe` assembly;
  - `degradation()` stays an instrument, unchanged.
- **Byte-unchanged:** `refuse_if_changed`, `refuse_if_changed_or_unreadable`, `Dataset::check_source_unchanged`, `post_check_source`, and `FOOTER_DESCRIPTOR_MAX_BYTES` (brief Scope).

### §2b. Kernel: arming, admission, the reason, the reference, emission, `describe`

- **Construction.**
  - `SkpHost::new(catalog, tickets, arm: Arc<dyn SourceWatchArm>, events: SessionEndSender)`. Both new parameters are required, on the `EngineSourceFactory::ticket_only` precedent.
  - `SessionInvalidator::new` gains the same `SessionEndSender`.
  - `pub fn session_end_channel() -> (SessionEndSender, SessionEndReceiver)` is bounded by `SESSION_END_EVENT_QUEUE_BOUND` (§7).
  - Product caller of all three: the shell's `run` `setup` closure. It spawns one emitter thread that drains the receiver and calls the Tauri emit for each event. The thread never logs a payload.
  - Test callers are updated; they do not discharge the caller rule.
- **Session reference** (round 18 item 2; ADR-035 D4):
  - `SessionRef`, a kernel-minted handle type in `protocol/skp` (§2c);
  - minted by `open_dataset` once per successful open, after admission, and returned as `OpenDatasetResponse.session`;
  - held only as `GenerationState.live`'s value, `(u64, Option<SessionRef>)`: `mint_for_open(dataset, session)` stores `Some`, and `live_or_mint` stores `None` (see X1 below);
  - **Rider (a)** (round 21 item 1): the reference is absent from the `tickets` attribution map, from `dead_tickets`, from `ticket_liveness` and from every refusal. Its only reads are the transition report and the event. No request type accepts it.
- **Reason** (addition 2):
  - a new `SessionEndReason { ObservedChange, CoverageLost }`;
  - `invalidated` becomes `HashMap<String, SessionEndReason>`. The first mark stands;
  - `dead_tickets`' values carry the reason;
  - `live_or_mint` returns `Result<u64, SessionEndReason>`;
  - `TicketLiveness` gains `EndedByCoverageLoss`;
  - `GenerationRegistry::ended_reason(dataset)`, whose product caller is `describe`.
- **Transition report** (ADR-035 D3): `invalidate(dataset, reason) -> Option<EndReport { session: Option<SessionRef>, reason, tickets: Vec<String> }>`.
  - It is `Some` exactly when this call removed the dataset's live generation.
  - The reference is taken under the guard, in the same step as the removal.
- **The single emission point:** `SessionInvalidator::end_generation(dataset, reason)`.
  1. Take the report.
  2. After the guard is released, `try_send` one `DatasetSessionEnded { session, reason }`.
  3. Then cancel the report's tickets through the existing `StreamRegistry::cancel`.

  The emission never waits and takes no lock of `GenerationRegistry` or `StreamRegistry`. A full queue loses the event and never skips or blocks the end (Decision 2 keeps that safe). Every route reaches this point: the pre-check (`SkpHost::end_generation`), the post-check (`EngineSource::next_into`, both arms), the drop path (`EngineSource`'s `Drop`, including retired `Pending` sources) and the watcher's sink. The first three pass `ObservedChange`.
  - **Attach point, stop item X1:** the payload when the report's `session` is `None`.
- **Open and admission** (brief rule 4; addition 6):
  - `open_dataset` arms before `catalog.open_cancellable`, and so before the descriptor read in `Dataset::open_inner`.
  - The sink holds a per-open latch with two states, pre-admission and admitted. Lock order: latch, then generations.
  - At admission, under the latch:
    1. If a signal was recorded, remove the catalog entry and refuse. A `Change` refuses as `engine.source_changed`, with a detail naming a notification before admission; a `CoverageLost` refuses as `engine.source_coverage_lost`.
    2. If `resolves_unchanged()` is false, refuse as `engine.source_changed`.
    3. Otherwise mint the `SessionRef`, run `mint_for_open`, flip the latch, and store an `OpenRecord { watch, coverage }` in the host's map.
  - The watch is dropped after the latch guard is released.
  - After admission the sink maps `Change` → `ObservedChange` and `CoverageLost` → `CoverageLost`, and calls `end_generation`. The descriptor is not consulted (rules 1–2). One log line records the reason; it carries no duration and no reference.
- **Refusals take their code from the reason, never `SourceChanged` for a coverage loss:**
  - `viewport_query`'s live-generation arm and its mint-race arm;
  - `create_from_ticket`'s dead-ticket arm, which gains an arm for `EndedByCoverageLoss`.

  New detail strings are P6 placeholders.
- **Watch lifetime.** One watch per open, never re-armed; a reopen is a new open (rules 2, 5). `close_dataset` first removes the `OpenRecord` under the map guard and drops it after release, which disarms and joins. Only then does the existing order run: cancel, `forget_dataset`, `catalog.remove`. So the watcher adds no route that reaches `invalidate` after `forget_dataset`.
- **`describe`** stays ADR-006 class 1: pure and in memory. It returns:
  - `coverage` from the `OpenRecord`, fixed at admission and never rewritten; a later loss is rule 2, never a downgrade. A dataset with no `OpenRecord` reports `checks-only`, with the reason naming that no watch was armed;
  - `checks` from `unestablished_components()`;
  - `session_end` from `ended_reason()` (round 18 item 3).

  `describe`, `cancel` and `close_dataset` still answer after an end.

### §2c. Protocol: `skp/0.5`

- **`handles.rs`:** `SessionRef`, `"sr_"` + 32 lowercase hex, OS CSPRNG. It serializes as a bare string. No command's request type carries it.
- **`commands.rs`:**
  - `OpenDatasetResponse` gains `session: SessionRef`.
  - `DescribeResponse` gains three top-level members. Enums are closed, kebab-case, with no fallback, on the `skp/0.4` `CrsUnit` precedent:
    - `coverage: SourceCoverage { state: CoverageState /* watching | checks-only */, reason: Option<String> }`. The key is always present, and `Some` exactly for `checks-only`;
    - `checks: SourceChecks { state: ChecksState /* full | degraded */, components: Vec<CheckComponent> /* mtime | footer-hash */ }`. The list is non-empty exactly for `degraded`;
    - `session_end: Option<EndReason /* observed-change | coverage-lost */>`. The key is always present.
  - The facts are independent (addition 1). `checks` delivers ADR-016 A1 item 2's owed display. `coverage` never states degradation, and `session_end` never rewrites `coverage`.
- **New `events.rs`:**
  - `pub const DATASET_SESSION_ENDED_EVENT: &str = "skp://dataset_session_ended"`;
  - `DatasetSessionEnded { session: SessionRef, reason: EndReason }`, `deny_unknown_fields`, with exactly two members (rider (b); D4).
- **Literal:** `SKP_VERSION` becomes `skp/0.5` on both sides (RULED 2026-09-24 (night) item (2); ADR-035 D6).
- **`SKP-V0.md`:**
  - §3 gains the third minting rule and `SessionRef`'s row;
  - §4 items 2, 7, 10 and 13 get notes;
  - the §8 entry for `skp/0.5` lists every member above, `engine.source_coverage_lost`, the event and its payload, no generation value, and `protocol/data-plane/` as an empty diff.
  - Rider (c)'s dated note is not this piece's.
- **Fixtures:** `protocol/skp/tests/data/*.json` with `fixtures.rs`, and `frontends/shell/src/skp/__tests__/fixtures.test.ts`, updated in the same commit as each addition (§4 item 13 condition (iii)). A new fixture, `v0-dataset_session_ended-event.json` (`{event, payload}`), is read by both sides.

### §2d. Shell: consumer, inside existing components

- **Types and client.** `types.ts` mirrors §2c: `session` on `OpenDatasetResponse`, the three `describe` members, `EndReason` and `DATASET_SESSION_ENDED_EVENT`. `Admitted` gains `session`.
- **Decoder and listener,** new in `skp/events.ts`: `decodeDatasetSessionEnded`, the shell's first runtime SKP decoder (D4). It refuses a missing member, an added member or an unknown reason. `listenDatasetSessionEnded` wraps `@tauri-apps/api/event`'s `listen`. Capabilities are unchanged: `core:default` already covers events.
- **Session map and entry** (D5; round 18 item 2):
  - `handleAdmitted` records `admittedSessionRef` beside `admittedDatasetRef`.
  - On an event, the listener compares `session` with the recorded reference and drops a mismatch.
  - On a match it calls `endSessionForReason(reason, admittedDatasetRef.current)`. That is the reason-keyed entry: it builds an owner detail `"<code>: <owner placeholder>"` and calls:
    - the baseline manager's new public `notifySessionEnded(detail)`. The draft assumed this route already existed; on the baseline manager it does not. Behind it: latch, `liveTickets.invalidate()`, `clearResidency()`, then `onSessionEnded`;
    - or the candidate manager's existing public `notifySourceChanged`, renamed `notifySessionEnded`. Its route to `endCandidateSession`, which clears all tiles, is unchanged;
    - or `endSession` directly when no manager exists yet.

    Every one of these ends in the same `endSessionForDataset` guard and the same `handleSessionEnded` latch.
  - The listener logs the reason only, never the reference (rider (b)).
- **Predicates.**
  - `isSourceChangedTerminal`, renamed `isSessionEndedTerminal`, matches `engine.source_changed` and `engine.source_coverage_lost`;
  - `isSourceChangedRefusal`, renamed `isSessionEndedRefusal`, matches the same two codes.

  Every caller is updated. The retry set is unchanged.
- **Guidance.** `refusalGuidance` gains `engine.source_coverage_lost` as a placeholder. The `engine.source_changed` string is byte-unchanged.
- **Status** (addition 3; rule (d)). Case (f) uses P3b's existing session-ended block. `DescribeSummary` gains two conditional rows, on the `sessionStatementLine` precedent:
  - checks-only, with its reason;
  - degraded checks, with its components.

  Both are placeholders and migration-inventory items. Nothing is added to `.canvas-status-stack` or placed over the map. `describe.session_end` is typed and rendered nowhere new. An end between open and `describe` reaches the block through the first-look query's refusal (rider (a)).
- **Reading recorded.** Shell-direction (b) holds the watcher's status display for Map studio. Addition 3, the later sight, places it within existing components, so no new display is built.

## §3. Fixtures, with outcomes predicted before any run

| Fixture | Use | Predicted |
|---|---|---|
| A plain file in a per-test temp directory | A1–A13 | as registered in §4 |
| `spatial_engine::fixture::write_geoparquet` output in a per-test directory, the `ticket_drop_under_lock_regression` precedent | K, E, R, W | as registered in §4; K11 predicts `checks.state = full` |
| A scratch copy of the 100k walkthrough fixture, touched by modification time only (P3b T10 precedent) | E2E (f) | block shown, zero resident vertices, pick refused. The copy's sha256 is equal before and after. |

Every fixture is hash-verified before and after. No corpus file is edited.

## §4. Tests and their mutations

**Tier note, with the non-goal beside it:**
- **Tier 1:** injected-signal ordering and emission, deterministic, through test implementors of `SourceWatchArm` and `ArmedWatch`.
- **Tier 2:** the Windows adapter, `#[cfg(windows)]`, with real events. It proves mapping, never timing. Waits are bounded by `WATCH_TEST_WAIT`.

Non-Windows is a declared non-goal: nothing off Windows is claimed beyond `ChecksOnly`.

**Tier 2, `engine/tests/source_watch_adapter.rs`:**

| Test | Asserts | Mutation |
|---|---|---|
| A1 `a_same_size_in_place_write_with_restored_mtime_signals_change_while_the_descriptor_still_matches` | `Change`; `SourceDescriptor::of` equal before and after | drop `LAST_WRITE` and `SIZE` from the filter |
| A2 `renaming_the_source_away_signals_change` | `Change` | ignore `RENAMED_OLD_NAME` |
| A3 `a_temp_write_renamed_over_the_source_signals_change` | `Change` | ignore `RENAMED_NEW_NAME` |
| A4 `deleting_the_source_signals_change` | `Change` | ignore `REMOVED` |
| A5 `a_sibling_change_signals_nothing_and_a_later_source_write_does` | the first signal is the source's | match any name |
| A6 `a_forced_overflow_signals_coverage_lost` | a blocked sink plus a burst yields `CoverageLost` | treat a 0-byte success as no events |
| A7 `a_differently_cased_name_renamed_over_the_source_signals_change` | `Change` | byte-exact comparison |
| A8 `renaming_the_watched_directory_succeeds_and_signals_change` | the rename succeeds; `Change` via G | drop the grandparent watch |
| A9 `deleting_the_watched_directory_succeeds_and_signals` | the removal succeeds; a signal arrives; the directory is gone after release | open without `FILE_SHARE_DELETE` |
| A10 `a_source_reached_through_a_junction_is_watched_at_its_final_path` | `Change` on the target (junction made by `mklink /J`, under a timeout) | watch the unresolved parent |
| A11 `an_unlistable_directory_arms_checks_only_with_its_reason` | `ChecksOnly` carrying the OS error (`icacls` deny under a timeout, removed afterwards) | return `Watching` on an open failure |
| A12 `a_disarmed_watch_delivers_nothing_and_releases_the_directory` | no signal; the directory is deletable | map abort to `CoverageLost` unconditionally |
| A13 `a_modification_time_touch_signals_change` (H5) | `Change` | drop `LAST_WRITE` from the filter |

**Seam, engine → kernel, from the real shape.** `kernel/tests/source_watch_windows.rs`, using `PlatformWatch` through `SkpHost`:

| Test | Asserts | Mutation |
|---|---|---|
| W1 `a_real_write_to_the_open_source_ends_its_generation_through_the_host` | `viewport_query` refuses `engine.source_changed`; one event carrying the open's reference | the sink ignores signals once admitted |
| W2 `renaming_the_watched_directory_ends_the_generation` (addition 5) | refused; one event | drop the grandparent watch |
| W3 `deleting_the_watched_directory_ends_the_generation` (addition 5) | refused; one event | open without `FILE_SHARE_DELETE` |

**Tier 1, `kernel/tests/source_watch_ordering.rs`:**

| Test | Asserts | Mutation |
|---|---|---|
| K1 `a_signal_before_a_query_ends_the_generation_before_its_ticket_is_minted` | criterion clause 1, case (a) | the sink records but does not end |
| K2 `a_signal_during_a_stream_ends_the_generation_before_its_terminal` | clause 2: `ticket_liveness` reports the end at terminal receipt | cancel without invalidating |
| K3 `a_signal_while_idle_ends_the_generation_and_emits_once` | clause 3, kernel half: one event, `describe.session_end` set, refused | enqueue only when tickets were cancelled |
| K4 `coverage_loss_refuses_with_its_own_code_never_source_changed` | the pre-check refusal and the dead-ticket terminal both carry `engine.source_coverage_lost` | map `CoverageLost` to `ObservedChange` |
| K5 `a_signal_free_rearm_does_not_restore_an_ended_generation` | refused until reopen, and a reopen watches again (case (c)) | clear `invalidated` when a watch arms |
| K6 `a_signal_between_arming_and_admission_refuses_the_open` | no catalog entry, no generation, no event (case (e)) | mint before the latch check |
| K7 `the_first_reason_wins_and_is_the_emitted_reason` | the reason recorded equals the reason emitted | overwrite the reason in `invalidate` |
| K8 `an_unwatchable_source_opens_checks_only_and_describe_says_so` | case (d) | `describe` hardcodes `watching` |
| K9 `a_loss_after_admission_ends_the_generation_and_describe_still_says_watching` | rule 3 | rewrite coverage on loss |
| K10 `no_batch_from_an_ended_generation_is_admitted_and_nothing_reloads` | case (g) | `live_or_mint` mints over an end |
| K11 `describe_reports_checks_full_for_an_undegraded_fixture` | checks full | report `degraded` with an empty list |
| K12 `source_coverage_lost_maps_to_its_own_code_and_detail` | the `error_of` mapping | reuse the `source_changed` arm |
| K13 `describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer` | round 18 item 3 | refuse `describe` when invalidated |
| K14 `two_opens_of_one_file_return_distinct_session_references` | round 18 item 2 | mint the reference once per host |

**Emission, one route per test** (ADR-035 Consequences). E1–E4, E6 and E9–E10 are in `kernel/tests/session_end_event.rs`. E5, E7 and E8 are in-crate in `kernel/src/skp.rs`, reusing the `ticket_drop_under_lock_regression` helpers and the `pub(crate)` split of `end_generation` (record, then enqueue):

| Test | Asserts | Mutation |
|---|---|---|
| E1 `a_pre_check_end_emits_once_and_refuses_its_call` | one event plus the refusal | move the enqueue into `SkpHost::end_generation` only |
| E2 `a_post_check_end_on_a_clean_terminal_emits_once` | one event | same as E1 |
| E3 `a_post_check_end_on_an_error_terminal_emits_once` | one event | same as E1 |
| E4 `an_end_on_the_drop_path_emits_once` | one event | same as E1 |
| E5 `a_pending_ticket_retired_by_sweep_emits_once_and_does_not_hang` | one event within the bound | same as E1 |
| E6 `a_watcher_signal_after_admission_emits_once` | one event | the sink calls `invalidate` directly |
| E7 `a_pending_drop_inside_close_emits_once_with_its_session_reference` | reference present | look the reference up after the guard |
| E8 `an_end_recorded_before_forget_dataset_and_enqueued_after_it_carries_its_reference` | reference present | same as E7 |
| E9 `a_repeat_a_nested_and_a_post_close_end_emit_nothing` | exactly one event across all three | key emission on the `invalidated` mark |
| E10 `a_full_queue_loses_the_event_never_blocks_the_end_and_the_next_call_still_refuses` | the end returns within the bound; refused | `send` instead of `try_send` |

**Riders of round 21 item 1, as requirements:**
- **R-a** `kernel/tests/session_reference.rs::the_session_reference_routes_only_the_end_event_and_attributes_no_ticket`. Asserts:
  - `ticket_liveness` answers from the ticket before and after the end;
  - the event carries the open's reference;
  - each of the five request types, with a `session` member added, fails to decode.

  Mutation: add `#[serde(default)] session: Option<SessionRef>` to `ViewportQueryRequest`.
- **R-b** `kernel/tests/no_generation_in_persisted_artifacts.rs::the_published_bundle_carries_no_session_reference_key_or_value`. A new test in the named file, reusing its helpers; existing tests are byte-unchanged. It opens through `SkpHost` to mint a real reference, publishes that open's `Dataset`, then:
  - walks every manifest and style key for `session`;
  - byte-scans every file for the minted value and for `sr_` plus 32 hex;
  - asserts a planted value is found (the file's vacuity discipline).

  Mutation: add a `("session", Json::str(<an sr_ value>))` member to `Manifest::to_json`. Secondary check: a shell test, `the listener logs no session reference` (mutation: log the payload).

**Engine unit tests:**
- `descriptor::tests::an_absent_modification_time_is_an_unestablished_component` (mutation: return an empty list);
- `descriptor::tests::a_footer_hash_not_taken_is_an_unestablished_component` (mutation: omit `footer-hash`).

**Protocol:**
- `fixtures.rs::describe_carries_coverage_checks_and_session_end_as_independent_members` (mutation: merge `coverage` and `checks`);
- `fixtures.rs::the_session_ended_event_fixture_decodes_with_exactly_two_members` (mutation: add a `dataset` member to `DatasetSessionEnded`);
- `fixtures.rs::open_dataset_response_carries_a_session_reference` (mutation: omit it);
- the literal test asserts `skp/0.5` (mutation: leave `skp/0.4`).

  Each has a matching test in `fixtures.test.ts`.

**Shell (vitest):**

| Test | Asserts | Mutation |
|---|---|---|
| SH1 | the checks-only row renders only for `checks-only`, with its reason | render it unconditionally |
| SH2 | the degraded row lists components only for `degraded` | drop the components |
| SH3 | a coverage-lost terminal ends the session once, and the block carries the coverage-lost guidance | predicate on `source_changed` only |
| SH4 | a coverage-lost pre-check refusal ends the session | same, on the refusal predicate |
| SH5 | the coverage-lost code is not retryable | add it to the retry set |
| SH6 | the decoder accepts the shared fixture and refuses a missing member, an added member or an unknown reason | accept extra members |
| SH7 | a matching event on the baseline arm clears residency (`onSuperseded`), latches the hover and shows the block | the entry skips `notifySessionEnded` |
| SH8 | a matching event on the candidate arm clears all tiles | same, for the candidate manager |
| SH9 | an event whose `session` does not match is dropped | skip the comparison |
| SH10 | after an event-ended session, a batch on a retired ticket is dropped | skip `liveTickets.invalidate()` in `notifySessionEnded` |

SH3 and SH4 build from kernel-pinned bytes added to `testUtils/terminalShapes.ts` (the P3b precedent).

**End-to-end, case (f), the seam from the real shape** (addition 4): `frontends/shell/e2e/source-watch-idle.mjs`. It admits, settles, then touches the scratch copy while idle. Steps:
- F0: no `viewport_query` entry in the console recorder after the touch, which proves the event route and not the pre-check;
- F1: the session-ended block is present, with no machine prefix;
- F2: zero resident vertices;
- F3: a hover at a formerly occupied pixel is refused.

Mutation: never register the listener; F1 and F2 fail by name.

**Cases → tests:**
- (a) A1, K1
- (b) A2–A4, A7, A8, W2, W3, K1
- (c) A6, K4, K5
- (d) A11, K8, K9, SH1
- (e) K6
- (f) K3, SH7, SH8, E2E
- (g) K10, SH10

**Caller-grep list for the PR body:** `SourceWatchArm`, `ArmedWatch`, `PlatformWatch`, `resolves_unchanged`, `unestablished_components`, `SessionEndReason`, `EndReport`, `ended_reason`, `EndedByCoverageLoss`, `session_end_channel`, `SessionRef`, `DATASET_SESSION_ENDED_EVENT`, `decodeDatasetSessionEnded`, `listenDatasetSessionEnded`, `endSessionForReason`, both `notifySessionEnded`, and the renamed predicates.

## §5. Predictions · declared unchanged · invalidators · falsification

- **Registered predictions:**
  - H1: an adapter probe sees no completion on P for P's own rename. If one arrives, that is recorded as class 2; the grandparent watch stays, as ruled.
  - H2: A1 passes with the writer's handle closed.
  - H3: A6 sees one of H3's two forms.
  - H4: A9 sees an error completion or `REMOVED` first.
  - H5: A13 passes.
- **Declared unchanged:**
  - the descriptor's comparison and refusal paths, the pre-check and the post-check;
  - `protocol/data-plane/`, an empty diff;
  - publish (`kernel/src/publish`, `src-tauri/src/publish.rs`), an empty diff;
  - the `engine.source_changed` guidance string;
  - the cancelled-terminal rule;
  - the N8 reopen reset;
  - both lockfiles, Tauri capabilities, and the `StreamRegistry` no-drop-under-guard invariant.
- **Invalidators; any one stops the piece:**
  - a crate, a version, or any `windows-sys` feature other than `Win32_System_IO` is needed;
  - either lockfile changes;
  - a test-only `pub` item is needed;
  - an addition can be met only by changing the pre-check or post-check;
  - emission needs a lock of `GenerationRegistry` or `StreamRegistry`, or a blocking send;
  - code reaches X1's attach point before the human's ruling.
- **Falsification:**
  - A1 cannot signal a same-size in-place write on NTFS even after the handle closes, so case (a) is unmeetable;
  - or E10 cannot be made non-blocking.

  Either makes the preregistration wrong, and the piece stops.

## §6. Instruments

Assertions only: signal kinds, codes, registry states, event counts and payloads, `describe` values, rendered rows, resident counts. No measurement, no duration, no `docs/08` row.

## §7. Declared values and ceilings (ADR-010 rule 6)

| Value | Declared | Bounds |
|---|---|---|
| `WATCH_BUFFER_BYTES` | 65536, DWORD-aligned | per-handle notifications; overflow past it is `CoverageLost` |
| Filters | P: `FILE_NAME \| SIZE \| LAST_WRITE`; G: `DIR_NAME`; no subtree | which events reach the mapping |
| Name comparison | UTF-16 decoded, compared per `char` through `to_uppercase` where 1:1, otherwise exact; against the long name and the 8.3 short name | a match. The residual goes to KNOWN-LIMITATIONS |
| Handles and threads per open | 2 and 2; 1 and 1 when P is a volume root | released at close |
| Signals | at most 1 per handle; ends at most 1 per open | — |
| Re-arms per open | 0 | — |
| `SESSION_END_EVENT_QUEUE_BOUND` | 64 | events enqueued and not yet emitted; each open ends at most once |
| `DATASET_SESSION_ENDED_EVENT` | `skp://dataset_session_ended` | — |
| `SessionRef` | `sr_` + 32 lowercase hex, OS CSPRNG | — |
| `WATCH_TEST_WAIT` | 10 s, tests only | harness ceiling, not a claim |
| Placeholders | each new operator string starts `[P6 placeholder]` | the checks-only row; the degraded row; the `engine.source_coverage_lost` guidance; the two event-route block messages; `SourceCoverageLost`'s `Display`; the three new kernel coverage-lost detail strings; the arming-failure and off-Windows reason prefixes |

**KNOWN-LIMITATIONS lines owed in this piece:**
- Windows only;
- the cache caveat (H2);
- ancestors above the grandparent, and a symlink retargeted after admission: caught at the next pre-check, not while idle;
- the case-fold residual;
- event delivery is best-effort: a lost event reaches the operator at the next generation-scoped refusal.

**Budget** (§21c counting rule: insertions plus deletions over non-generated code and tests):

| Module | Lines, at most |
|---|---|
| engine | 1,100 |
| kernel | 2,000 |
| protocol | 450 |
| src-tauri | 80 |
| shell, including e2e | 1,200 |
| **Total** | **4,830, across ≤ 55 files** |

An overrun is recorded in a class-1 amendment with the final figure. This section is never edited.

## §8. Block-on-sight

1. Any polling or timer-driven check.
2. Any diff in the descriptor comparison or refusal paths, `check_source_unchanged` or `post_check_source`.
3. A coverage loss surfacing as `engine.source_changed` anywhere.
4. A new element in the status stack or over the map, or the checks-only label outside `DescribeSummary`.
5. A generation value on the wire; `coverage` rewritten after admission.
6. Automatic reload, an in-open re-arm, or a restored generation.
7. A lockfile change, a new crate, or a `windows-sys` feature other than `Win32_System_IO`.
8. A `pub` item, callback or option without a product caller.
9. An operator string unmarked, or presented as settled.
10. An engine or kernel message stating a consequence.
11. Any timing or `docs/08` claim.
12. A publish diff.
13. A wrong literal, a missing §8 entry, or one-sided fixtures.
14. A non-Windows path reporting `watching`.
15. A test encoding an imagined interface.
16. A handle opened without `FILE_SHARE_DELETE`.
17. An emission that blocks, takes or re-enters a registry lock, or reads the reference after the guard.
18. More than one emission point, or an end route that bypasses it.
19. The session reference in a request type, a ticket attribution, a refusal, a log line, a persisted file or a published artifact (riders (a) and (b)).
20. An event payload with any member beyond `session` and `reason`.
21. Code at X1's attach point before the ruling.
22. An A2 or A5 audit S1 in this code left unfolded at merge (wave-1 block).

## §9. Gates

- **Architect:**
  - §8 items 1–22 one by one;
  - ADR-016 A1 items 2–3;
  - ADR-035 Decisions 1–7, resolved against the Header's rulings until PR #119 lands;
  - ADR-010 rules 5–6;
  - ADR-006: `describe` stays class 1; an end is a session-state transition, not undoable; the event is not an operation (D7);
  - the seam rule on engine → kernel (W1), kernel → protocol (fixtures), and kernel → shell (the shared event fixture and the E2E).
- **Reviewer:** the full diff. The wire change is gated in its own right.
- **Suites, green first:**
  - `cargo test` for `spatial-engine`, `spatial-kernel`, `spatial-skp` and the shell crate;
  - `npm run verify`;
  - `verify-mutation` over every §4 mutation;
  - CI's `node --test` scripts suite;
  - the E2E run on Windows.
- **Operator rows,** committed with blank logs:
  - case (f), felt;
  - the wording of every §7 placeholder;
  - read the last amendment first.
- **Merge order:** after PR #119 (see X2), before B1 (RULED night (2)). The custodian updates the conformance session's `skp/0.4` fixtures at integration (wave-1 block).

## §10. Amendments

*(opens empty; append-only)*
```

---

## 2. Changes from the filed draft (`/C:/dev/spatial-ide/state/consults/2026-09-24-source-change-watcher.md`)

1. The block verdict is removed. S1 and S2 now point to round 17 item 2, and the ADR skeleton is removed because ADR-035 is that ADR.
2. The Header cites rounds 17 item 2, 18 items 1–3, 19 item 1 and 21 item 1, the night ruling item (2), the wave-1 block, and ADR-035.
3. The base is main, not `crs-unit-fact-and-bounds`' branch: PR #112 merged.
4. The literal `skp/0.5` rests on a tree fact: `SKP_VERSION` is `skp/0.4` on both sides at `c16f41d`. It no longer rests on the custodian's statement.
5. Every `path:line` cite is replaced by a symbol or section. The draft's line numbers were stale at `c16f41d`, for example `invalidated`, `viewport_query`'s arms, `SkpHost::new` and `DescribeSummary`.
6. The draft's `Cargo.lock` line cite becomes the `mio` entry.
7. S2 is written in (§2a): a second handle on the grandparent, `DIR_NAME`, none at a volume root, and checks-only if it fails to arm.
8. A8 and A9 now prove the grandparent watch and share-delete.
9. The kernel Windows tests W2 and W3 are added so that addition 5's "ends the generation" is proved.
10. `ArmOutcome::Watching` now holds a `Box<dyn ArmedWatch>` instead of the concrete `SourceWatch`. The draft's shape needed a test-only constructor for tier 1, which was its own invalidator.
11. `WatchSink` is an `Arc` rather than a `Box`, because two threads share it.
12. `resolves_unchanged` takes no path argument; the watch holds its own.
13. S1 is now the ADR-035 design (§2b and §2d): the session reference, the transition report, the single emission point, the bounded non-blocking queue, the emitter thread, the decoder, the listener, the session map and the reason-keyed entry.
14. The draft said the managers' existing session-end routes would be called. The baseline `ViewportStreamManager` has no public route, so the piece adds `notifySessionEnded`; the candidate route exists (`notifySourceChanged`) and is renamed.
15. `describe` gains `session_end` (round 18 item 3). `describe`, `cancel` and `close_dataset` still answer after an end.
16. The `coverage`, `checks` and `session_end` states are closed kebab-case enums on the `skp/0.4` `CrsUnit` precedent, replacing the `sanity`-style strings.
17. `SessionRef` codec (`sr_`), the `open_dataset.session` member, the event name, the payload and the `EndReason` spellings are fixed, as ADR-035 leaves to this preregistration.
18. Riders (a) and (b) are requirements, with R-a and R-b.
19. R-b adds a reference test to `no_generation_in_persisted_artifacts.rs` and leaves the existing tests unchanged.
20. The per-route emission tests E1–E10 are added (ADR-035 Consequences).
21. The draft's K3, S7 and E2E attach points are now defined: K3, SH7 and SH8, and E2E steps F0–F3.
22. The E2E adds F2 (residency cleared), which the draft's S5a/S5c-only plan omitted.
23. The E2E adds F0, so the test proves the event route rather than the pre-check.
24. `close_dataset` disarms the watch before the existing sequence, so the watcher adds no post-`forget_dataset` invalidate.
25. The latch lock order and the drop-after-guard rule are declared.
26. H5 and A13 are added: a modification-time touch, which is the E2E's mutation.
27. `SESSION_END_EVENT_QUEUE_BOUND`, the event name and the `SessionRef` codec join §7. The placeholder list grows from four strings to ten.
28. §8 items 17–22 and §5's new invalidators are added.
29. A module-split line budget is declared, and "No merge tonight" is removed.
30. The merge order now reads: after #119, before B1.
31. The draft's shell-test labels S1–S7 are renamed SH1–SH10, so they no longer collide with stop-item names.

## 3. Stop list

- **X1: the payload when a generation has no session reference** (§2b's attach point). In the shipped build, `live_or_mint` mints such a generation only in the `close_dataset` race. ADR-035 Decision 3 hands the payload's form to this preregistration or to the human. Its candidate, a kernel-minted reference that no client holds, extends Decision 4's mint rule, which is the human's call. **Recommendation:** every generation carries a kernel-minted `SessionRef`, and `live_or_mint` mints one that no client holds. The listener drops such an event on mismatch, and every end still emits. The human adds this to Decision 4's rule; the race fix stays a separate node (item 4 below).
- **X2: merge order against PR #119.** #119 flips ADR-035 to Accepted and appends rider (c)'s note to `SKP-V0.md` §8. Until it lands, the ADR's Status says a review may not block on its text. **Recommendation:** commit this preregistration now, since it binds through the rulings, and merge the implementation only after #119, so that the `skp/0.5` §8 entry follows rider (c)'s note.
- **X3: one PR or a split.** The budget is about 4,800 lines. Round 8's producer exemption needs the human's pre-commitment naming the consumer and its gate, and none exists for a split. **Recommendation:** one PR. The seam tests (W1, the shared event fixture, E2E (f)) cross every module.
- **X4: renames and test titles.** `isSourceChangedTerminal`, `isSourceChangedRefusal` and `notifySourceChanged` would misname coverage loss. **Recommendation:** rename the symbols, leave every existing test title byte-unchanged, and list the old → new map in the PR body. That way no `withdrawn-test` or superseded-name rows are created.

## 4. The owed kernel notes of ADR-035's drafter

Put both notes on a separate node, for example `kernel-generation-close-races` after the watcher. They are defects that exist today, independent of the watcher, and each needs its own design. This piece stops the watcher from adding to note 1, because `close_dataset` disarms the watch first. If the human resolves X1 by closing the `close_dataset` race rather than as recommended, note 2 moves into this piece.
