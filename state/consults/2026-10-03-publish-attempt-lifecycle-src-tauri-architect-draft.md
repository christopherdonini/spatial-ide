# Consult — the architect's draft for publish-attempt-lifecycle-src-tauri (2026-10-03)

*Custodian's filing note: one hand-back from the architect agent on the custodian's brief (a drafting consult, not a gate), read at main b43c0eb, recorded verbatim below with the harness's report indentation removed. The draft is kept here whole. Its points Q1 to Q4 are asked as question round 40; Q2, the exit behaviour, is a red line and takes the human's typed words. The form is committed after the answers, with the custodian's edits listed in its header.*

*Profile paths redacted at filing: none.*

---

Drafting consult, so no verdict. Read at main @ b43c0eb.

I read the working tree of `C:/dev/spatial-ide`. Per the snapshot status, only `PLAN.yaml`, `CUSTODIAN-QUEUE.*` and `site/*` differ from b43c0eb, so every pinned span below was read from files that match b43c0eb. When you hash a span, a byte mismatch means stop; it is not something to fix by hand.

````markdown
# A running publish keeps its cancel token, the grants lock is not held across a publish, and closing the window cancels the publish so its staging directory is removed (wave-1 A1 obs. 1-2, A2 obs. 3, A5-2; src-tauri) — preregistration

**Authority:** PLAN node `publish-attempt-lifecycle-src-tauri`, position 8 of the human's order (question round 31, item 1, RULED 2026-09-30). Split from `publish-refusal-codes-and-attempt-lifecycle` by question round 31, item 2 (RULED 2026-09-30). That ruling puts src-tauri bug fixes outside the shell hold and applies portability R1-R6 (`state/directives/PORTABILITY-2026-09-30.md:33-65` @ b43c0eb sha256:<custodian>). Origin, which is evidence and not Authority: `state/cloud/wave1/A1.md:71-72` @ b43c0eb sha256:<custodian> with its triage `state/cloud/wave1/A1.md:98-99` @ b43c0eb sha256:<custodian`; `state/cloud/wave1/A2.md:77` @ b43c0eb sha256:<custodian> with its triage `state/cloud/wave1/A2.md:104` @ b43c0eb sha256:<custodian>; `state/cloud/wave1/A5.md:65-83` @ b43c0eb sha256:<custodian> with its triage `state/cloud/wave1/A5.md:115` @ b43c0eb sha256:<custodian>.
**Drafted by** the architect agent on the custodian's brief, read at `main` b43c0eb. Shape model: `frontends/shell/PUBLISH-REFUSAL-CODE-SRC-TAURI-PREREGISTRATION.md`. **Committed before any code**, on main, as its own commit. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Gating:** full (§21a: `AUTONOMY.md:315-332` @ b43c0eb sha256:<custodian>). It touches stated guarantees (§2 Heads) and crosses §21c's bounds (`AUTONOMY.md:349-357` @ b43c0eb sha256:<custodian>) on size and on user-visible behaviour. Under round 25, item 2 (e) (`AUTONOMY.md:482` @ b43c0eb sha256:<custodian>), no five-line form is used. Worker: worker-high.
**Every sentence below about a cited span is paraphrase. Nothing in this form is quoted.**

## §0. Disclosure
- Reasoned from code at b43c0eb. No wave-1 reproducer exists for these items, and nothing from `cloud/wave1-A1`, `-A2` or `-A5` merges.
- **The pins are history; the tree governs.** A1's triage pins the prepare's lock, the execute's lock and the boundary call at ab4eb65 (lines 548, 695 and 711). At b43c0eb they are:
  - `frontends/shell/src-tauri/src/publish.rs:606-619` @ b43c0eb sha256:<custodian> (the prepare's lock);
  - `frontends/shell/src-tauri/src/publish.rs:772-773` @ b43c0eb sha256:<custodian> (the execute takes the lock);
  - `frontends/shell/src-tauri/src/publish.rs:788-792` @ b43c0eb sha256:<custodian> (the lock is held through `boundary::execute`, then dropped and the grant consumed).
  
  The tree at b43c0eb is authoritative for this piece.
- **A premise correction, paraphrased.** A1's observation 2 says a concurrent prepare blocks before it checks its own cancel token. At b43c0eb, the prepare's only cancel check is the pin phase (`frontends/shell/src-tauri/src/publish.rs:431-438` @ b43c0eb sha256:<custodian>), and it runs before the lock is taken. So the defect is a stall: the concurrent prepare waits at the lock for as long as the other publish runs, and its prepare token, still registered, is read by nothing during the wait. The fix removes the stall. The prepare remains non-cancellable after its pin, and that part is unchanged (§2.2).
- **Defect 1 sites.** Execute registers by unconditional insert (`frontends/shell/src-tauri/src/commands.rs:410-411` @ b43c0eb sha256:<custodian>) and removes unconditionally (`frontends/shell/src-tauri/src/commands.rs:434-436` @ b43c0eb sha256:<custodian>). The registry's insert replaces whatever is there (`frontends/shell/src-tauri/src/publish.rs:998-1001` @ b43c0eb sha256:<custodian>). The pending attempt is single-use (`frontends/shell/src-tauri/src/publish.rs:707-709` @ b43c0eb sha256:<custodian>; ADR-024, `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:95-100` @ b43c0eb sha256:<custodian>).
- **Defect 2 seam (kernel, read first).**
  - `PublishAttempt` borrows a `&GrantSet` (`kernel/src/permission/boundary.rs:120-130` @ b43c0eb sha256:<custodian>).
  - The boundary reads it only at step 4 (`kernel/src/permission/boundary.rs:368-374` @ b43c0eb sha256:<custodian>) and step 6 (`kernel/src/permission/boundary.rs:408-413` @ b43c0eb sha256:<custodian>), both before `publish_prepared` (`kernel/src/permission/boundary.rs:416` @ b43c0eb sha256:<custodian>).
  - `PublishGrant` is `Clone` (`kernel/src/permission/grant.rs:226-228` @ b43c0eb sha256:<custodian>). `GrantSet` is not `Clone` and exposes no iterator (`kernel/src/permission/grant.rs:360-364` @ b43c0eb sha256:<custodian>).
  - The two methods used are `find` (`kernel/src/permission/grant.rs:443-447` @ b43c0eb sha256:<custodian>) and `remove_matching` (`kernel/src/permission/grant.rs:420-425` @ b43c0eb sha256:<custodian>).
- **A latent race, found by this draft.** At b43c0eb, `consume_grant` re-locks after `drop(held)` (`frontends/shell/src-tauri/src/publish.rs:754-759` @ b43c0eb sha256:<custodian>). A prepare with the same facts that wins the lock between those two steps loses its grant to that `remove_matching`. §2.2 closes this; T3 proves it.
- **Defect 3 seam (kernel, read first).**
  - `publish_prepared` creates the staging directory (`kernel/src/publish/mod.rs:619` @ b43c0eb sha256:<custodian>) and removes it on every `Err`, including `Cancelled` (`kernel/src/publish/mod.rs:621-637` @ b43c0eb sha256:<custodian>).
  - The first phase event, `verifying-source`, is emitted after the staging directory exists and before the first cancel check (`kernel/src/publish/mod.rs:701-702` @ b43c0eb sha256:<custodian>).
  - The kernel already declares that a crashed publish leaves the directory (`kernel/src/publish/mod.rs:1415-1420` @ b43c0eb sha256:<custodian>). The name shape is `.<name>.staging-<hex>` (`kernel/src/publish/mod.rs:1434` @ b43c0eb sha256:<custodian>).
- **Defect 3 seam (Tauri, read first; evidence of an external interface, not Authority).** I read the crate sources at the versions `frontends/shell/src-tauri/Cargo.lock` pins: tauri 2.11.5 (`src/app.rs`) and tauri-runtime-wry 2.11.4 (`src/lib.rs`). Paraphrased:
  - `RunEvent::ExitRequested { code, api }` has `code` `None` for an exit the user caused. `ExitRequestApi::prevent_exit` sends on a channel.
  - The runtime emits `ExitRequested { code: None }` when the last window is destroyed. It reads the prevent signal with `try_recv` straight after the callback, so `prevent_exit` must be called synchronously inside the callback.
  - `AppHandle::exit` re-enters `ExitRequested` with `Some(code)`.
  - The loop's `LoopDestroyed` emits only `RunEvent::Exit`.
  - `App::run`'s doc says the process ends through `std::process::exit`. That confirms A5-2's inference that the blocking thread dies at exit.
  
  The worker re-reads these items before writing lib.rs and names the crate versions in its report. No local path is recorded.
- **Today's exit.** `.run(tauri::generate_context!())` installs no event callback (`frontends/shell/src-tauri/src/lib.rs:553-554` @ b43c0eb sha256:<custodian>). A window closed mid-publish also leaves an audit intent with no outcome.
- **Today's cover.** No automated step closes the window (`frontends/shell/MANUAL-WALKTHROUGH.md:395` @ b43c0eb sha256:<custodian>).
- Fixture drive: nothing is measured.

## §1. May and may not claim
- **May claim:**
  - while an execute for an attempt id is registered, a second execute under that id returns the existing `unknown-attempt` outcome and neither replaces nor removes the registered token;
  - on every path where the shell's facts equal the boundary's, the shared `GrantSet` mutex is not held while `publish_prepared` runs;
  - a grant leaves the shared set inside the critical section that found it;
  - on Windows, when the last window closes while publishes are registered, exit is prevented once, every registered token is cancelled, and the process exits once the registry drains or at `EXIT_DRAIN_CEILING`, whichever comes first;
  - a publish cancelled this way goes through the kernel's own `Err` arm, which removes its staging directory and writes a cancelled outcome.
- **May not claim:**
  - any `docs/08` figure, any `cancel_observed` or `cancel_quiescent` duration, or that the ceiling bounds quiescence (ADR-018 §2 calls quiescence structurally unboundable: `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:56-65` @ b43c0eb sha256:<custodian>);
  - cleanup after a forced termination, a power loss, or an exit that does not pass through `ExitRequested`;
  - anything off Windows (R5);
  - that the prepare is cancellable after its pin.
- **Unchanged:**
  - no kernel, engine, protocol or TS product edit;
  - no SKP or MCP change;
  - no new Tauri command, parameter, event or outcome variant;
  - no new or changed UI string or Display;
  - no ADR amended;
  - no new dependency or feature;
  - the walkthrough row and the KNOWN-LIMITATIONS item are the only doc text.

## §2. The change
**Heads (§21a), one by one:**
- ADR status or amendment: none.
- Security posture under ADR-020, -009 or -021: none.
- Wire: none. No SKP or MCP change, and the Tauri command surface (names, parameters, `ExecuteOutcome`/`PrepareOutcome` shapes, `publish://progress`) is unchanged.
- Stated guarantee: **yes**. It covers:
  - `docs/01` principle 7 (`docs/01_Principles.md:13` @ b43c0eb sha256:<custodian>) and ADR-018 §1 (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:41-47` @ b43c0eb sha256:<custodian>): a running publish stays reachable by Cancel, and a prepare is no longer stalled;
  - ADR-017 §15's staging removal (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:550-552` @ b43c0eb sha256:<custodian>);
  - ADR-006's class-3 audit obligation (`docs/adr/ADR-006-lineage-undo-side-effects.md:17` @ b43c0eb sha256:<custodian>): an outcome record on close;
  - ADR-024's single-use attempt and non-persistent grants (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:235-238` @ b43c0eb sha256:<custodian>): the moment a grant is consumed moves, and the property does not change.

**User-visible behaviour (§21c bound, and the red line in AI_DEVELOPMENT §B):**
- After the window closes during a publish, the process stays alive, windowless, until the publish quiesces or the ceiling elapses.
- The audit log then records an outcome of cancelled for that attempt, where today there is an intent with no outcome.
- KNOWN-LIMITATIONS gains item 30.
- No UI text changes. A refused second execute shows the existing unknown-attempt sentence (`frontends/shell/src/publish/PublishPanel.tsx:273-279` @ b43c0eb sha256:<custodian>), which already covers the "already used" case.

1. **Defect 1: refuse, never a distinct key.**
   - What changes:
     - `RunningPublishes` gains `try_insert(key, token) -> bool`, which inserts only when the key is absent.
     - A new `run_exclusive(running, key, body) -> Option<T>` (async, shaped like `with_registered_cancel`) mints the token and calls `try_insert`.
     - On `false` it returns `None` without running `body` and without removing anything.
     - On `true` it runs `body` and removes the key it inserted.
     - `binding_publish_execute` calls `run_exclusive` and maps `None` to `Ok(ExecuteOutcome::UnknownAttempt)`.
   - Why refuse rather than a distinct key:
     - The pending attempt is single-use, so a second execute can only ever end as `UnknownAttempt`. Refusing it before registration changes no outcome and removes only the side effect.
     - A distinct key would leave the frontend's Cancel, which is addressed by `attempt_id`, unable to reach the run without a new return channel, which would be a wire change.
   - **Invariant I1:** from registration until its own removal, the token under an execute key belongs to the one call that will run that attempt. No other call inserts or removes under that key in that window. The check and the insert are one critical section of the registry's mutex.
   - Prepare's `with_registered_cancel` is unchanged (see the custodian's points, Q4).
2. **Defect 2: the narrower critical section.**
   - In `execute_with_progress`, after the audit log opens, one lock acquisition does `find(&facts, now)`.
   - **On `Ok(g)`:** build a call-local `GrantSet::new()` holding `g.clone()`, call `remove_matching(&facts)` on the shared set, and drop the guard. `boundary::execute` then runs against the local set, and no second `remove_matching` follows on this path.
   - **On `Err`:** the guard is kept and `boundary::execute` runs against the shared set, exactly as today. With equal facts it refuses at step 4, before `publish_prepared`, with the same error, the same audit `error_kind` and the same message. `remove_matching` then runs under the same guard, as today.
   - The failure path of `AuditLog::open_for` keeps its brief consume.
   - **Invariant I2:**
     - (a) No thread holds the shared mutex while `publish_prepared` runs, on every path where the shell's `OperationFacts` equal the boundary's. Both are built by `resolve_destination` over the same request.
     - (b) A grant authorizes at most one execute: it leaves the shared set in the critical section that found it.
     - (c) Only grants present in that critical section are removed by it.
   - Residual, declared: if `resolve_destination` gives different answers between the shell's call and the boundary's (a filesystem change in between), the `Err` path can reach `publish_prepared` under the lock. That is today's behaviour, and it is the same TOCTOU class ADR-017 §15 declares (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:559-561` @ b43c0eb sha256:<custodian>).
   - The prepare-side lock (`frontends/shell/src-tauri/src/publish.rs:606-619` @ b43c0eb sha256:<custodian>) is unchanged. Its wait is now bounded by I2's section, which is O(`MAX_GRANTS`).
3. **Defect 3: cancel at exit and drain; no sweep at the next start.**
   - `RunningPublishes` gains:
     - `cancel_all() -> usize`, which cancels every registered token, for both execute and prepare keys;
     - `wait_idle(ceiling) -> Drained | TimedOut`, which watches the entry count through a `tokio::sync::watch` updated under the registry mutex, so it loses no wakeup in any order;
     - `on_exit_requested() -> ExitAction`. It returns `Proceed` when the registry is empty or a drain has already begun. Otherwise it calls `cancel_all`, sets a once-flag and returns `PreventAndDrain`.
   - `lib.rs` replaces `.run(ctx)` with `.build(ctx).expect(..).run(|app, event| ..)`. On `RunEvent::ExitRequested { api, .. }` it calls `on_exit_requested`. On `PreventAndDrain` it calls `api.prevent_exit()` synchronously and spawns `wait_idle(EXIT_DRAIN_CEILING)` on Tauri's async runtime, followed by `app.exit(0)`. Nothing waits on the event-loop thread.
   - Grounding:
     - Cancelling runs the kernel's own declared recovery: `publish_prepared` removes staging and the boundary writes the cancelled outcome. That is ADR-017 §15 and ADR-018 §1's `cancel_quiescent`, reached by an ordinary close the way `docs/01` principle 7 requires.
     - A sweep at the next start is rejected for two reasons. The shell does not know past destinations, and finding them needs persisted state. Deleting by name pattern outside an approved operation would be an unapproved class-3 deletion (ADR-006 row 17).
   - Residual, declared in KNOWN-LIMITATIONS 30:
     - forced termination, power loss, or an exit path that bypasses `ExitRequested`;
     - the ceiling elapsing before the drain finishes.
   - In each case the staging directory and an intent with no outcome remain, which is the crash case the kernel already declares.
4. **Docs.**
   - KNOWN-LIMITATIONS gains item 30, appended at the end of the file after item 28, so no line above it moves. It is draft wording for the human's sight, stating facts only: an interrupted publish can leave a hidden `.<name>.staging-<hex>` directory beside the destination, nothing removes it, and it is safe to delete; the cases are as listed above.
   - `MANUAL-WALKTHROUGH.md` gains Part R, row R1, appended at the end (§9).
   - The doc comments of `commands.rs` and `RunningPublishes` that say the key is removed unconditionally are corrected to say it is removed by the call that registered it.
5. **Portability, rule by rule** (`state/directives/PORTABILITY-2026-09-30.md:33-65` @ b43c0eb sha256:<custodian>):
   - **R1:** met. Cancellation, staging removal and grant semantics are the same on every OS. Every reduction is declared in KNOWN-LIMITATIONS 30, none is silent.
   - **R2:** the exit hook sits in `lib.rs`, inside the native integration boundary (`state/directives/PORTABILITY-2026-09-30.md:45` @ b43c0eb sha256:<custodian>). No `cfg` is added anywhere. Staging naming and removal stay in the kernel's portable `std` calls.
   - **R3:** owning boundary is native integration (src-tauri).
     - Windows: supported for a last-window close, by L1 tests plus row R1.
     - macOS: the same code. The runtime emits `ExitRequested` on a last-window close. Quit from the application menu is not verified to pass through `ExitRequested` (the runtime's `LoopDestroyed` emits only `Exit`), so it is explicitly reduced, the same as a crash.
     - Linux: the same as macOS for a last-window close. SIGTERM and logout are explicitly reduced.
     - Every OS: forced termination is explicitly reduced.
     - Deferred to PORT-3 (L1 off Windows) and PORT-4 (L2). Recorded in KNOWN-LIMITATIONS 30.
   - **R4:** met. There is no drive letter, backslash, `LOCALAPPDATA` or OS-keyed rule. Tests build paths with `Path::join` and match the staging entry by `file_name` prefix.
   - **R5:** Windows L1, plus L2 for the exit path through R1. Nothing is claimed off Windows (`state/directives/PORTABILITY-2026-09-30.md:27` @ b43c0eb sha256:<custodian>).
   - **R6:** no test is ignored on any platform.

## §3. Fixtures and predicted outcomes
- **F1** (T2-T4): the suite's `prepared` helper (50 features, LV95, pinned), with the audit-log env set under `env_lock`. Execute runs on a spawned thread with an `EventProgress` whose closure, on the first `verifying-source` event only (an atomic once), waits twice on a `std::sync::Barrier(2)`: once to arrive, once to be released.
- **F2** (T2): a second `fixture` in a sub-directory, for the concurrent prepare.
- **F3** (T3): attempts A and C prepared against **one** destination, so they have equal facts. C is prepared while A is parked.
- **F4** (T1, T5, T6): registry only, with no files.
- **Predictions after the fix:**

| Fixture | Test | Prediction |
|---|---|---|
| F4 | T1 | The second call returns `None` (the command maps it to `UnknownAttempt`), its body never runs, and the first token is still registered and reachable |
| F1+F2 | T2 | While A is parked, `try_lock` on grants is `Ok`. F2's prepare returns `Prompt`. A returns `Success` |
| F1+F3 | T3 | A returns `Success`. C's execute returns `Refused` with a message starting `publish.destination_exists: ` (code at `kernel/src/publish/error.rs:231` @ b43c0eb sha256:<custodian>), which means C's grant survived A |
| F1 | T4 | While parked, the destination's parent holds one `.out-<name>.staging-` entry (the positive control). After `cancel_all` and release: `Refused` starting `publish.cancelled: ` (`kernel/src/publish/error.rs:251` @ b43c0eb sha256:<custodian>), no staging entry, the destination absent, and the audit log's last record is a cancelled outcome |
| F4 | T5 | `Drained` after the last entry is removed, in either order; `TimedOut` at `Duration::ZERO` with one entry left |
| F4 | T6 | With nothing registered: `Proceed`. With an entry registered: `PreventAndDrain` and the token cancelled; a second call returns `Proceed` |

- **At base:** T2 fails on its `try_lock` assertion (P0). T3 has no deterministic outcome at base and no P0 is claimed for it. T1, T4, T5 and T6 call new API, so they have no P0, and their mutations restore the base shape where one exists.

## §4. Tests, one mutation each (all in `frontends/shell/src-tauri/src/publish.rs` `mod tests`)
- **P0:** T2 is committed before any product code and run at the branch base. It fails on the `try_lock` assertion by name.
- **T1** `a_second_execute_under_a_running_attempt_id_is_unknown_and_leaves_the_running_token_registered`. Mutation M1: `run_exclusive` inserts unconditionally (the base shape). The original-token-cancelled assertion fails.
- **T2** `a_concurrent_prepare_is_not_held_behind_a_running_publishs_grant_lock`. Mutation M2: hold the guard across `boundary::execute` (the base shape). The `try_lock` assertion fails.
- **T3** `a_grant_added_while_a_publish_runs_survives_that_publishs_consumption`. Mutation M3: on the `Ok` path, move `remove_matching` to after `boundary::execute`. C gets `NoGrant`, and the prefix assertion fails.
- **T4** `exit_requested_cancels_a_running_publish_and_its_staging_directory_is_removed`. It registers through `run_exclusive`, the command's own path, and cancels through `on_exit_requested`. Mutation M4: empty `cancel_all`. The outcome assertion fails, because the result is `Success`.
- **T5** `the_exit_drain_returns_when_the_registry_empties_and_at_its_ceiling_otherwise`. Mutation M5: `wait_idle` returns `Drained` without reading the count. The `TimedOut` assertion fails.
- **T6** `exit_requested_prevents_exit_once_and_only_while_something_is_registered`. Mutation M6: drop the once-flag. The second-call assertion fails.
- **Concurrency discipline:**
  - No sleep and no timing assertion (round 25, item 1 (a)). Barriers and the watch channel do the sequencing.
  - T2-T4 release the barrier before any assertion, and call a lock-taking function only after `try_lock` has proved the lock free. A mutation therefore fails by name and never hangs.
- **Seams, each from the real shape:**
  - S1, the shell into `boundary::execute` and `GrantSet`: T2 and T3 run the real `execute_with_progress`, the real kernel boundary and a real fixture.
  - S2, cancel into `publish_prepared`'s staging and audit: T4.
  - S3, the Tauri event loop into `on_exit_requested`: the crate-source read (§0) plus row R1. No automated test reaches the Tauri event loop; see the custodian's points, Q3.
- **Mutation evidence:** a mutation is observed by applying it, running the named test, recording its failure by name with the commit, and reverting. A `verify-mutation` run is not an observation (`docs/PREREGISTRATION-TEMPLATE.md:172` @ b43c0eb sha256:<custodian>).

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:** §3's table. P0 fails at base. M1-M6 each fail their own test.
- **Declared unchanged (green before and after):**
  - `a_second_execute_on_the_same_attempt_id_is_unknown_not_a_stale_approval`;
  - `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt`;
  - `execute_with_progress_emits_every_phase_reached_stamped_with_the_right_attempt_id`;
  - `running_publishes_cancel_is_a_lookup_not_an_error_on_a_miss`;
  - `a_registered_cancel_key_is_gone_from_running_publishes_after_any_outcome`;
  - `seventy_sequential_prepare_execute_cycles_never_hit_the_grant_ceiling`;
  - `cancel_during_the_pin_phase_produces_a_typed_cancelled_outcome_with_no_side_effect`;
  - `an_execute_time_publish_refusal_carries_its_typed_code_and_a_permission_refusal_does_not`;
  - `a_pin_phase_engine_failure_refuses_as_publish_engine`;
  - `frontends/shell/src-tauri/tests/sole_caller_scan.rs`;
  - `kernel/tests/permission_boundary.rs`;
  - every TS test;
  - every Display and code, byte for byte.
- **Invalidators:**
  - **Stop:** the narrowing needs a kernel API (for example `GrantSet: Clone`). Route Q1 (b).
  - **Stop:** any edit is needed in a TS file, `tauri.conf.json`, the capabilities, `Cargo.toml` or `Cargo.lock`.
  - **Stop:** a UI string or Display is needed.
  - **Stop:** R1 shows that `ExitRequested` does not fire on a last-window close on Windows.
  - **Invalid run:** T4's positive control finds no staging entry, or the barrier is never reached (the park point is not inside `publish_prepared`). Re-declare the park point by a class-2 amendment.
- **Falsification:**
  - a grant authorizes two executes;
  - `publish_prepared` runs under the shared guard with equal facts;
  - a registered execute token is replaced or removed by a call that did not register it;
  - `wait_idle` returns `Drained` while a cancelled publish's staging entry still exists.

## §6. Instruments
Assertions only: outcome variants, message prefixes, `try_lock` results, directory listings, the audit record's outcome, and registry state. No measurement.

## §7. Declared values and ceilings
- `EXIT_DRAIN_CEILING`, proposed at 30 s (custodian's points, Q2).
  - It bounds the wall time between `prevent_exit` and `app.exit`, at its own site.
  - It is a declared ceiling (ADR-010 §6, `docs/adr/ADR-010-render-frames-origins-boundaries.md:70` @ b43c0eb sha256:<custodian>), not a measured bound. Quiescence stays unbounded (ADR-018 §2).
  - Context only, not a basis: the largest cancel-to-return figure on record is 3,920 ms (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:19-23` @ b43c0eb sha256:<custodian>).
- No other new constant.
- **Size budget:** ≤ 650 changed lines (insertions plus deletions) across ≤ 5 files:
  - `frontends/shell/src-tauri/src/publish.rs`;
  - `frontends/shell/src-tauri/src/commands.rs`;
  - `frontends/shell/src-tauri/src/lib.rs`;
  - `KNOWN-LIMITATIONS.md`;
  - `frontends/shell/MANUAL-WALKTHROUGH.md`.
- **Counted by** `git diff --numstat <base>...HEAD -- . ':(exclude)frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md' ':(exclude)PLAN.yaml' ':(exclude)CUSTODIAN-QUEUE.*' ':(exclude)site' ':(exclude)state'` at a named commit. This form is excluded by name.
- An overrun is class 8 (`docs/PREREGISTRATION-TEMPLATE.md:169` @ b43c0eb sha256:<custodian>), and this §7 line is never edited.

## §8. Block-on-sight
1. An edit outside §7's five files. That includes `kernel/**`, `engine/**`, `protocol/**`, `frontends/shell/src/**`, `tauri.conf.json`, `capabilities/**`, any `Cargo.toml` or `Cargo.lock`, and files from `cloud/wave1-*`. Exempt: this form's own appended §10 amendments, and the custodian's records (`PLAN.yaml`, `CUSTODIAN-QUEUE.*`, `site/**`, `state/**`).
2. A new Tauri command, parameter, event or outcome variant, a changed outcome shape, or any SKP or MCP change.
3. A new or changed UI string, Display, or log line.
4. `publish_prepared` reachable under the shared guard on the `Ok` path, or a second `remove_matching` on the `Ok` path.
5. An execute key's token replaced, or removed by a non-registrant.
6. A wait on the event-loop thread; `prevent_exit` more than once per process; an exit while a key is registered before the ceiling elapses.
7. A start-up sweep, or any deletion of a path the kernel did not create in this process.
8. A sleep or timing assertion, or a test that can hang under its mutation.
9. A `cfg`, a platform ignore, or OS-keyed logic.
10. T1-T6 missing, P0 unobserved, or M1-M6 unobserved; a record calling a `verify-mutation` run an observation.
11. A new `pub` item without a product caller. `try_insert` and `run_exclusive` are called from `commands.rs`; `cancel_all` from `on_exit_requested`; `on_exit_requested` and `wait_idle` from `lib.rs`.
12. KNOWN-LIMITATIONS 30 merged without the human's sight.
13. A §7 overrun not recorded as class 8, or a scope addition not recorded as class 9 before its code.

## §9. Gates
- **Architect:**
  - ADR-018 §1 and §2;
  - ADR-017 §15;
  - ADR-006 row 17;
  - ADR-024's single-use and non-persistence;
  - `docs/01` principle 7;
  - ADR-010 §6 and §7;
  - the seam rule for S1-S3;
  - the caller rule;
  - §2 item 5 rule by rule;
  - §8 one by one.
- **Reviewer:** the full diff; P0 observed; M1-M6 observed.
- **Suites:**
  - `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`;
  - `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check`;
  - `npm run verify` in `frontends/shell`;
  - `verify:cites` and `verify:plan`;
  - CI's `node --test` scripts suite.
- **Operator:** row R1 is committed with a blank result log and queued. Paraphrase of the row: on Windows, start a publish of the 5 GB fixture (Part H's), and close the window while the phase line reads `verifying-source` or `writing-partitions`. Expected:
  - the app's process ends within the ceiling;
  - with hidden items shown, the destination's parent holds no `.<name>.staging-*` entry;
  - `publish-bundle --audit-show` reads that attempt as cancelled, not as an intent with no outcome.
  
  Row G9 (`frontends/shell/MANUAL-WALKTHROUGH.md:332` @ b43c0eb sha256:<custodian>) is unchanged.

## §10. Amendments (opens empty, append-only)
````

**Points for the custodian and the human** (option labels; "typed-only" marks a red line under `AI_DEVELOPMENT.md` §B: a change to user-visible behaviour not already ruled, a scope change to a ruled item, or a dependency change):

1. **Q1, the grants critical section.**
   - (a) Shell-only, as drafted. It changes no kernel file, and its residual is the declared `Err`-path TOCTOU. Recommended.
   - (b) Add `#[derive(Clone)]` to `GrantSet` in `kernel/src/permission/grant.rs`, then snapshot the set and run `remove_matching` under one lock. That is exact by construction, but it is one kernel line outside the node's src-tauri scope as round 31, item 2 ruled it. **Typed-only.**
2. **Q2, exit behaviour and the ceiling.** The window disappears at once and the process keeps running, windowless, until it drains.
   - (a) 30 s. Recommended.
   - (b) Another number.
   - (c) No ceiling; this declines ADR-010 §6.
   - (d) Alternatively, keep the window open on `CloseRequested` until the drain finishes. That is visible behaviour and is not drafted.
   
   **Typed-only.**
3. **Q3, proof for the Tauri seam (S3).**
   - (a) The crate-source read plus operator row R1 is S3's end-to-end proof. Recommended. Walkthrough evidence is yours either way.
   - (b) An automated test using tauri's `test` feature mock runtime. That is a dev-dependency feature change and may change the lockfile. **Typed-only.**
4. **Q4, a sibling defect the draft found.** `with_registered_cancel` keys the prepare token by `prepare:<dataset_handle>` (`frontends/shell/src-tauri/src/publish.rs:1044-1057` @ b43c0eb). Two concurrent prepares on one dataset therefore have the same replace-and-remove defect. I have not verified whether the panel can issue two at once.
   - (a) Record it as a PLAN note or proposed node. Recommended.
   - (b) Fold it in here. That needs a new refusal string and is a class-9 scope addition. **Typed-only.**
5. **KNOWN-LIMITATIONS 30.** Its wording is for your sight at the PR, as with item 29's precedent.
6. **port-1-linux-l1 overlap.** There is no overlap in `frontends/shell/src-tauri`; that crate is outside the root workspace and PORT-1's Linux job. There is one likely shared file: PORT-1 edits KNOWN-LIMITATIONS item 1 (`state/directives/PORTABILITY-2026-09-30.md` §6 item 4). This piece appends item 30 at the end of the file, so the hunks differ and nothing above moves. Check whether port-1's 13 files include `KNOWN-LIMITATIONS.md`. PORT-1's cfg-boundary check meets nothing here, because this piece adds no `cfg`.
7. **For the custodian.**
   - Set the node's `gate` to `frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md` in the same commit that commits the form on main.
   - The ≤ 650-line budget is far over the node's `budget_minutes: 90`; re-estimate it.
   - A1's observation 5 (grants are not tied to an attempt) is narrowed as a side effect of the shell's call-local clone. That is not claimed here; it is a note.
   - The worker should run the rustfmt check locally before pushing, because main now enforces it on src-tauri.

