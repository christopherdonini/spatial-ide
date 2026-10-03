# Consult — the architect's revised draft for publish-attempt-lifecycle-src-tauri (2026-10-03)

*Custodian's filing note: the drafting architect's second hand-back, revising the draft to meet question round 40 (RULED 2026-10-03), item 1's conditions (a) to (c) (`state/directives/2026-10-03-exit-drain-ruling.md`), read at main b43c0eb. It is recorded verbatim below with the harness's report indentation removed. It is committed as `frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md`, whose header lists the custodian's edits.*

*Profile paths redacted at filing: none.*

---

Revised drafting consult, so no verdict. Read at main @ b43c0eb, with the round-40 ledger block and the exit-drain directive read from the working tree.

**Summary of the revision:**
- **(a) macOS and the OS table.** The pinned Tauri sources show that closing the last window exits the app on every OS, macOS included. So this shell does not follow macOS's keep-running convention today, and this piece does not change that. Honouring the convention would need macOS-only code, so it is routed as a finding; no `cfg` is added. Cmd-Q, Windows logoff and SIGTERM never reach the drain, and are declared.
- **(b) "Unknown" in the audit.** The shell cannot write it today without a kernel change, for three reasons given in the form. At the ceiling the audit shows the intent with no outcome, which the record schema already defines as "started, outcome unknown". The kernel change is routed as a finding.
- **(c) Relaunch during the drain.** I predict no conflict on the data plane, the audit log or the staging directory. Two residuals are declared. Row R1 now relaunches the app and checks all three.

````markdown
# A running publish keeps its cancel token, the grants lock is not held across a publish, and closing the window cancels the publish so its staging directory is removed (wave-1 A1 obs. 1-2, A2 obs. 3, A5-2; src-tauri) — preregistration

**Authority:**
- PLAN node `publish-attempt-lifecycle-src-tauri`, position 8 of the human's order (question round 31, item 1, RULED 2026-09-30).
- Split from `publish-refusal-codes-and-attempt-lifecycle` by question round 31, item 2 (RULED 2026-09-30). That ruling puts src-tauri bug fixes outside the shell hold and applies portability R1-R6 (`state/directives/PORTABILITY-2026-09-30.md:33-65` @ b43c0eb sha256:<custodian>).
- Question round 40 (RULED 2026-10-03):
  - item 1, a red line ruled in the human's typed words, is filed at `state/directives/2026-10-03-exit-drain-ruling.md:7-12` @ <custodian> sha256:<custodian>. The rev is the main commit that adds that file. It is referenced and not reproduced, and its conditions (a) to (c) are met in §2 item 5, §1, §8 and §9;
  - item 2: the grants lock is narrowed in the shell only;
  - item 3: the exit seam is proved by the source read plus row R1;
  - item 4: the prepare-key sibling is routed out (§0).
- Origin, which is evidence and not Authority:
  - `state/cloud/wave1/A1.md:71-72` @ b43c0eb sha256:<custodian> with its triage `state/cloud/wave1/A1.md:98-99` @ b43c0eb sha256:<custodian>;
  - `state/cloud/wave1/A2.md:77` @ b43c0eb sha256:<custodian> with its triage `state/cloud/wave1/A2.md:104` @ b43c0eb sha256:<custodian>;
  - `state/cloud/wave1/A5.md:65-83` @ b43c0eb sha256:<custodian> with its triage `state/cloud/wave1/A5.md:115` @ b43c0eb sha256:<custodian>.

**Drafted by** the architect agent on the custodian's brief, read at `main` b43c0eb. It was revised before commit to meet question round 40. Shape model: `frontends/shell/PUBLISH-REFUSAL-CODE-SRC-TAURI-PREREGISTRATION.md`. **Committed before any code**, on main, as its own commit. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating:** full (§21a: `AUTONOMY.md:315-332` @ b43c0eb sha256:<custodian>). It touches stated guarantees (§2 Heads) and crosses §21c's bounds (`AUTONOMY.md:349-357` @ b43c0eb sha256:<custodian>) on size and on user-visible behaviour. Under round 25, item 2 (e) (`AUTONOMY.md:482` @ b43c0eb sha256:<custodian>), no five-line form is used. Worker: worker-high.

**Every sentence below about a cited span is paraphrase. Nothing in this form is quoted.** Crate sources are cited by crate, version and file. They are evidence of an external interface, read at the versions `frontends/shell/src-tauri/Cargo.lock` pins: tauri 2.11.5, tauri-runtime-wry 2.11.4, tao 0.35.3 and muda 0.19.3. No local path is recorded.

## §0. Disclosure
- Reasoned from code at b43c0eb. No wave-1 reproducer exists for these items, and nothing from `cloud/wave1-A1`, `-A2` or `-A5` merges.
- **The pins are history; the tree governs.** A1's triage pins the prepare's lock, the execute's lock and the boundary call at ab4eb65 (lines 548, 695 and 711). At b43c0eb they are:
  - `frontends/shell/src-tauri/src/publish.rs:606-619` @ b43c0eb sha256:<custodian> (the prepare's lock);
  - `frontends/shell/src-tauri/src/publish.rs:772-773` @ b43c0eb sha256:<custodian> (the execute takes the lock);
  - `frontends/shell/src-tauri/src/publish.rs:788-792` @ b43c0eb sha256:<custodian> (the lock is held through `boundary::execute`, then dropped and the grant consumed).
  
  The tree at b43c0eb is authoritative for this piece.
- **A premise correction, paraphrased.** At b43c0eb the prepare's only cancel check is the pin phase (`frontends/shell/src-tauri/src/publish.rs:431-438` @ b43c0eb sha256:<custodian>), and it runs before the lock is taken. So a concurrent prepare stalls at the lock for as long as the other publish runs, and its prepare token, still registered, is read by nothing during the wait. The fix removes the stall. The prepare remains non-cancellable after its pin, and that part is unchanged (§2.2).
- **Defect 1 sites.** Execute registers by unconditional insert (`frontends/shell/src-tauri/src/commands.rs:410-411` @ b43c0eb sha256:<custodian>) and removes unconditionally (`frontends/shell/src-tauri/src/commands.rs:434-436` @ b43c0eb sha256:<custodian>). The registry's insert replaces whatever is there (`frontends/shell/src-tauri/src/publish.rs:998-1001` @ b43c0eb sha256:<custodian>). The pending attempt is single-use (`frontends/shell/src-tauri/src/publish.rs:707-709` @ b43c0eb sha256:<custodian>; `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:95-100` @ b43c0eb sha256:<custodian>).
- **Defect 2 seam (kernel, read first).**
  - `PublishAttempt` borrows a `&GrantSet` (`kernel/src/permission/boundary.rs:120-130` @ b43c0eb sha256:<custodian>).
  - The boundary reads it only at step 4 (`kernel/src/permission/boundary.rs:368-374` @ b43c0eb sha256:<custodian>) and step 6 (`kernel/src/permission/boundary.rs:408-413` @ b43c0eb sha256:<custodian>), both before `publish_prepared` (`kernel/src/permission/boundary.rs:416` @ b43c0eb sha256:<custodian>).
  - `PublishGrant` is `Clone` (`kernel/src/permission/grant.rs:226-228` @ b43c0eb sha256:<custodian>). `GrantSet` is not `Clone` and exposes no iterator (`kernel/src/permission/grant.rs:360-364` @ b43c0eb sha256:<custodian>).
  - The two methods used are `find` (`kernel/src/permission/grant.rs:443-447` @ b43c0eb sha256:<custodian>) and `remove_matching` (`kernel/src/permission/grant.rs:420-425` @ b43c0eb sha256:<custodian>).
- **A latent race, found by this draft.** `consume_grant` re-locks after `drop(held)` (`frontends/shell/src-tauri/src/publish.rs:754-759` @ b43c0eb sha256:<custodian>). A prepare with the same facts that wins the lock between those two steps loses its grant. §2.2 closes this; T3 proves it.
- **Defect 3 seam (kernel, read first).**
  - Staging is created at `kernel/src/publish/mod.rs:619` @ b43c0eb sha256:<custodian>, and removed on every `Err`, including `Cancelled`, at `kernel/src/publish/mod.rs:621-637` @ b43c0eb sha256:<custodian>.
  - The first phase event, `verifying-source`, is emitted after staging exists and before the first cancel check (`kernel/src/publish/mod.rs:701-702` @ b43c0eb sha256:<custodian>).
  - The kernel already declares that a crashed publish leaves the directory (`kernel/src/publish/mod.rs:1415-1420` @ b43c0eb sha256:<custodian>). The name shape is `.<name>.staging-<hex>` (`kernel/src/publish/mod.rs:1434` @ b43c0eb sha256:<custodian>). The suffix claims no cross-process uniqueness (`kernel/src/publish/mod.rs:1653-1662` @ b43c0eb sha256:<custodian>).
- **Defect 3 seam (Tauri, read first).** Paraphrased:
  - In tauri 2.11.5 `src/app.rs`, `RunEvent::ExitRequested { code, api }` carries `code` `None` for an exit the user caused. `ExitRequestApi::prevent_exit` sends on a channel. `AppHandle::exit` re-enters `ExitRequested` with `Some(code)`. `App::run` ends the process through `std::process::exit`, which confirms that A5-2's blocking thread dies at exit.
  - In tauri-runtime-wry 2.11.4 `src/lib.rs`, the last window's `Destroyed` emits `ExitRequested { code: None }` and reads the prevent signal with `try_recv` straight after the callback, so `prevent_exit` must be called synchronously. That branch is **not OS-keyed**. `LoopDestroyed` emits only `RunEvent::Exit`.
  - In tauri 2.11.5 `src/app.rs`, the builder installs a default menu on macOS only.
  - In muda 0.19.3 `src/platform_impl/macos/mod.rs`, that menu's Quit item maps to `terminate:`.
  - In tao 0.35.3, macOS's `applicationWillTerminate` (`src/platform_impl/macos/app_delegate.rs`) calls `AppState::exit` (`src/platform_impl/macos/app_state.rs`), which emits `LoopDestroyed`. Windows' `WM_ENDSESSION` (`src/platform_impl/windows/event_loop.rs`) calls `loop_destroyed`, and the file notes that `WM_QUERYENDSESSION` is not processed. A grep of tao 0.35.3 finds no SIGTERM handling.
  
  The worker re-reads these items before writing `lib.rs` and names the crate versions in its report.
- **Today's exit.** `.run(tauri::generate_context!())` installs no event callback (`frontends/shell/src-tauri/src/lib.rs:553-554` @ b43c0eb sha256:<custodian>). A window closed mid-publish today leaves the staging directory and an audit intent with no outcome.
- **Today's cover.** No automated step closes the window (`frontends/shell/MANUAL-WALKTHROUGH.md:395` @ b43c0eb sha256:<custodian>).
- **The audit's record shape, read for condition (b).**
  - `Outcome` has exactly four values: success, refused, cancelled and failed (`kernel/src/permission/audit/record.rs:56-63` @ b43c0eb sha256:<custodian>).
  - The record module defines an intent with no outcome as the readable state of an attempt that started and whose ending is unknown (`kernel/src/permission/audit/record.rs:8-11` @ b43c0eb sha256:<custodian>). The reader prints it as an orphan intent, "no outcome (interrupted?)" (`kernel/src/permission/audit/reader.rs:43-44` @ b43c0eb sha256:<custodian>; `kernel/src/permission/audit/reader.rs:338` @ b43c0eb sha256:<custodian>).
  - An outcome record is tied to its intent by `attempt` (`kernel/src/permission/audit/record.rs:132-135` @ b43c0eb sha256:<custodian>). The boundary mints that id privately (`kernel/src/permission/boundary.rs:342` @ b43c0eb sha256:<custodian>).
- **Relaunch, read for condition (c).**
  - The data plane binds loopback on an OS-assigned port (`protocol/data-plane/src/server.rs:285-287` @ b43c0eb sha256:<custodian>; `frontends/shell/src-tauri/src/lib.rs:438-441` @ b43c0eb sha256:<custodian>).
  - The session log is a per-second file name opened for append (`frontends/shell/src-tauri/src/state.rs:30-40` @ b43c0eb sha256:<custodian>).
  - The audit log's append is serialized within one process only. Coordination across processes is declared absent (`kernel/src/permission/audit/log.rs:44-46` @ b43c0eb sha256:<custodian>). Each append re-opens the path (`kernel/src/permission/audit/log.rs:217-222` @ b43c0eb sha256:<custodian>), and rotation runs only inside `open_for`, that is, only on an execute (`kernel/src/permission/audit/log.rs:121-155` @ b43c0eb sha256:<custodian>).
- **Routed out, not in this piece:**
  - (1) The prepare-key sibling, routed to the proposed node `prepare-cancel-key-per-dataset` (question round 40, item 4).
  - (2) Honouring macOS's keep-running convention on a last-window close. It needs a macOS-only `RunEvent::Reopen` path and window recreation, which is OS-keyed logic and a scope addition. This is a finding for a proposed node.
  - (3) An explicit "unknown" audit outcome at the ceiling. It needs a kernel and audit-schema change (§1). This is a finding for a proposed node.
- Fixture drive: nothing is measured.

## §1. May and may not claim
- **May claim:**
  - while an execute for an attempt id is registered, a second execute under that id returns the existing `unknown-attempt` outcome and neither replaces nor removes the registered token;
  - on every path where the shell's facts equal the boundary's, the shared `GrantSet` mutex is not held while `publish_prepared` runs;
  - a grant leaves the shared set inside the critical section that found it;
  - on Windows, when the last window closes while publishes are registered, exit is prevented once, every registered token is cancelled, and the process exits once the registry drains or at `EXIT_DRAIN_CEILING`, whichever comes first;
  - a publish cancelled this way goes through the kernel's own `Err` arm, which removes its staging directory and writes a cancelled outcome.
- **May not claim:**
  - any `docs/08` figure, any `cancel_observed` or `cancel_quiescent` duration, or that the ceiling bounds quiescence (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:56-65` @ b43c0eb sha256:<custodian>);
  - cleanup after the exits §2.5 declares;
  - anything off Windows (R5);
  - that the prepare is cancellable after its pin;
  - **that the shell records an "unknown" outcome at the ceiling.** It cannot, today, without a kernel change. There are three reasons:
    - (i) `Outcome` has no unknown value, and adding one widens the `spatial-audit/1` value domain, which the human ruled on for the precedent case (`kernel/src/permission/audit/record.rs:90-99` @ b43c0eb sha256:<custodian>);
    - (ii) the boundary's audit attempt id is minted inside `boundary::execute` and never reaches the shell, so the shell cannot write a record that pairs with the intent;
    - (iii) a shell-written terminal could race the boundary's own outcome and give one attempt two terminals.
    
    Writing an existing value (`failed`) would state something the shell does not know. So at the ceiling the shell writes nothing. **The audit then shows the attempt as its intent with no outcome.** That is the schema's existing "started, ending unknown" state, which `--audit-show` prints as no outcome (interrupted?). The same holds for every exit §2.5 declares. Recorded in KNOWN-LIMITATIONS 30.
- **Unchanged:**
  - no kernel, engine, protocol or TS product edit;
  - no SKP or MCP change;
  - no new Tauri command, parameter, event or outcome variant;
  - no new or changed UI string, Display or log line;
  - no audit record written by the shell;
  - no ADR amended;
  - no new dependency or feature;
  - no `cfg`;
  - the walkthrough row and the KNOWN-LIMITATIONS item are the only doc text.

## §2. The change
**Heads (§21a), one by one:**
- ADR status or amendment: none.
- Security posture under ADR-020, -009 or -021: none.
- Wire: none. No SKP or MCP change, and the Tauri command surface (names, parameters, outcome shapes, `publish://progress`) is unchanged.
- Stated guarantee: **yes**. It covers:
  - `docs/01` principle 7 (`docs/01_Principles.md:13` @ b43c0eb sha256:<custodian>) and ADR-018 §1 (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:41-47` @ b43c0eb sha256:<custodian>);
  - ADR-017 §15's staging removal (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:550-552` @ b43c0eb sha256:<custodian>);
  - ADR-006's class-3 audit obligation (`docs/adr/ADR-006-lineage-undo-side-effects.md:17` @ b43c0eb sha256:<custodian>);
  - ADR-024's single-use attempt and non-persistent grants (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:235-238` @ b43c0eb sha256:<custodian>). The moment a grant is consumed moves; the property does not change.

**User-visible behaviour (ruled: question round 40, item 1):**
- After the last window closes during a publish, the process stays alive, windowless, until the publish quiesces or 30 s pass.
- The audit records an outcome of cancelled where today it shows an intent with no outcome.
- KNOWN-LIMITATIONS gains item 30.
- No UI text changes. A refused second execute shows the existing unknown-attempt sentence (`frontends/shell/src/publish/PublishPanel.tsx:273-279` @ b43c0eb sha256:<custodian>).

1. **Defect 1: refuse, never a distinct key.**
   - What changes:
     - `RunningPublishes` gains `try_insert(key, token) -> bool`, which inserts only when the key is absent.
     - A new async `run_exclusive(running, key, body) -> Option<T>` mints the token and calls `try_insert`.
     - On `false` it returns `None` without running `body` and without removing anything.
     - On `true` it runs `body` and removes the key it inserted.
     - `binding_publish_execute` maps `None` to `Ok(ExecuteOutcome::UnknownAttempt)`.
   - Why refuse rather than a distinct key: the attempt is single-use, so a second execute can only end as `UnknownAttempt`. A distinct key would leave the frontend's Cancel, addressed by `attempt_id`, unable to reach the run without a wire change.
   - **Invariant I1:** from registration until its own removal, the token under an execute key belongs to the one call that runs that attempt. The check and the insert are one critical section.
   - Prepare's `with_registered_cancel` is unchanged (routed: `prepare-cancel-key-per-dataset`).
2. **Defect 2: the narrower critical section (shell only, question round 40, item 2).**
   - In `execute_with_progress`, after the audit log opens, one lock acquisition does `find(&facts, now)`.
   - **On `Ok(g)`:** build a call-local `GrantSet` holding `g.clone()`, call `remove_matching(&facts)` on the shared set, and drop the guard. `boundary::execute` runs against the local set, with no second `remove_matching`.
   - **On `Err`:** keep the guard and run `boundary::execute` against the shared set, as today. With equal facts it refuses at step 4, before `publish_prepared`, with the same error, audit `error_kind` and message. `remove_matching` then runs under the same guard.
   - **Invariant I2:**
     - (a) The shared mutex is never held while `publish_prepared` runs, on every path where the shell's facts equal the boundary's.
     - (b) A grant authorizes at most one execute.
     - (c) Only grants present in that critical section are removed by it.
   - Residual, declared: a filesystem change between the two `resolve_destination` calls can reach `publish_prepared` under the lock on the `Err` path. That is today's behaviour, and the same TOCTOU class ADR-017 §15 declares (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:559-561` @ b43c0eb sha256:<custodian>).
3. **Defect 3: cancel at exit and drain; no sweep at the next start.**
   - `RunningPublishes` gains:
     - `cancel_all() -> usize`;
     - `wait_idle(ceiling) -> Drained | TimedOut`, which watches the entry count through a `tokio::sync::watch` updated under the registry mutex, so it loses no wakeup in any order;
     - `on_exit_requested() -> ExitAction`. It returns `Proceed` when the registry is empty or a drain has already begun. Otherwise it calls `cancel_all`, sets a once-flag and returns `PreventAndDrain`.
   - `lib.rs` uses `.build(ctx).expect(..).run(|app, event| ..)`. On `RunEvent::ExitRequested { api, .. }`, with `PreventAndDrain`, it calls `api.prevent_exit()` synchronously and spawns `wait_idle(EXIT_DRAIN_CEILING)` on Tauri's async runtime, followed by `app.exit(0)`. Nothing waits on the event-loop thread. `RunEvent::Exit` is not handled, because the process ends straight after it.
   - At the ceiling the shell writes no audit record (§1).
   - Grounding: cancelling runs the kernel's own declared recovery (ADR-017 §15, ADR-018 §1). A sweep at the next start is rejected: the shell does not know past destinations, and deleting by name pattern outside an approved operation would be an unapproved class-3 deletion (ADR-006 row 17).
4. **Docs.**
   - KNOWN-LIMITATIONS gains item 30, appended at the end of the file after item 28. Its wording is a draft for the human's sight, facts only:
     - which exits leave a hidden `.<name>.staging-<hex>` directory beside the destination (§2.5's declared rows and the ceiling);
     - that nothing removes it, and it is safe to delete;
     - that the audit then shows the attempt as an intent with no outcome, its ending unknown, because the app cannot yet record "unknown" explicitly.
   - Part R, row R1, is appended at the end of `MANUAL-WALKTHROUGH.md` (§9).
   - The doc comments that say the key is removed unconditionally are corrected.
5. **Portability, rule by rule** (`state/directives/PORTABILITY-2026-09-30.md:33-65` @ b43c0eb sha256:<custodian>), meeting condition (a) of the 2026-10-03 exit-drain ruling.
   - **R1:** met. Cancellation, staging removal and grant semantics are the same on every OS. Every reduction is declared below and in KNOWN-LIMITATIONS 30.
   - **R2:** the exit hook sits in `lib.rs`, inside the native integration boundary (`state/directives/PORTABILITY-2026-09-30.md:45` @ b43c0eb sha256:<custodian>). OS facts come only from the runtime's events. No `cfg` is added.
   - **R3:** owning boundary is native integration (src-tauri). What this piece does, per exit and OS:

| Exit | Windows | macOS | Linux |
|---|---|---|---|
| Last window closed | `ExitRequested` (`None`), so the **drain runs**, then the app exits | Same runtime branch, so the **drain runs**. The app then quits, which is Tauri's default on every OS. This shell does **not** follow macOS's keep-running convention, today or after this piece; the gap is routed (§0) | Same as Windows: the **drain runs** |
| Application-menu Quit (Cmd-Q) | No app menu (Tauri's default menu is macOS-only) | `terminate:` leads to `applicationWillTerminate`, then `LoopDestroyed`, then `RunEvent::Exit` only. **No drain; reduced, declared** | No app menu |
| SIGTERM | No POSIX signal | No handler in tao 0.35.3; the default disposition ends the process with no event. **No drain; declared** | Same as macOS. **No drain; declared** |
| Logout or shutdown | `WM_ENDSESSION` leads to `loop_destroyed`, then `RunEvent::Exit` only. **No drain; declared** | Through the terminate path, then `RunEvent::Exit` only. Not verified. **No drain; declared** | No runtime event identified in the pinned sources. **No drain; declared** |
| Forced kill or power loss | **Declared** | **Declared** | **Declared** |

   - During a drain on macOS, the app is windowless and its menu remains. A Cmd-Q at that point ends the drain, a declared case.
   - Honouring macOS's convention would need `RunEvent::Reopen`, which tauri 2.11.5 compiles on macOS only, and therefore OS-keyed logic. That is the finding routed in §0, not added here.
   - Tests per platform: Windows CI (product-ci-shell) and row R1. macOS and Linux have none until PORT-3 and PORT-4.
   - **R4:** met. Paths are built with `Path::join`, and staging entries are matched by `file_name` prefix.
   - **R5:** Windows L1, plus L2 for a last-window close through R1. Nothing is claimed off Windows (`state/directives/PORTABILITY-2026-09-30.md:27` @ b43c0eb sha256:<custodian>).
   - **R6:** no test is ignored on any platform.
6. **A relaunch during a drain** (condition (c); predictions, read from code, checked by R1):
   - **Data plane:** no conflict. Each process binds its own OS-assigned loopback port, with its own session token, and the new webview attaches to its own process's port. The old listener stays up, unattached, until exit.
   - **Session log:** no conflict. Files are named per second of start, and the two starts differ.
   - **Audit log:** no conflict in R1. The new process writes to the audit only if it executes a publish, and R1 does not. Declared residual: a publish executed in the new process while the old one drains is two appenders across processes, with no coordination. A rotation by the new process's `open_for` at the 8 MiB ceiling could then put the old process's outcome in a different generation from its intent. This is already declared at `kernel/src/permission/audit/log.rs:44-46` @ b43c0eb sha256:<custodian>.
   - **Staging:** no conflict. Names carry a per-attempt random suffix. A second publish to the **same** destination during the drain is ADR-017 §15's declared concurrent-publish residual.
   - **WebView2 profile:** the two processes share the app's WebView2 user-data folder. I predict this is supported and harmless; it is unverified, and R1 observes it.
   - No single-instance mechanism is added, and none is needed by these predictions. Adding one would be a scope addition.

## §3. Fixtures and predicted outcomes
- **F1** (T2-T4): the suite's `prepared` helper (50 features, LV95, pinned), with the audit-log env set under `env_lock`. Execute runs on a spawned thread with an `EventProgress` whose closure, on the first `verifying-source` event only (an atomic once), waits twice on a `std::sync::Barrier(2)`.
- **F2** (T2): a second `fixture` in a sub-directory.
- **F3** (T3): attempts A and C prepared against one destination. C is prepared while A is parked.
- **F4** (T1, T5, T6): registry only.
- **Predictions after the fix:**

| Fixture | Test | Prediction |
|---|---|---|
| F4 | T1 | The second call returns `None`, its body never runs, and the first token is still registered and reachable |
| F1+F2 | T2 | While A is parked, `try_lock` on grants is `Ok`. F2's prepare returns `Prompt`. A returns `Success` |
| F1+F3 | T3 | A returns `Success`. C returns `Refused` starting `publish.destination_exists: ` (`kernel/src/publish/error.rs:231` @ b43c0eb sha256:<custodian>) |
| F1 | T4 | While parked: one `.out-<name>.staging-` entry (the positive control). After `on_exit_requested` and release: `Refused` starting `publish.cancelled: ` (`kernel/src/publish/error.rs:251` @ b43c0eb sha256:<custodian>), no staging entry, the destination absent, and the audit's last record has outcome `cancelled` (`kernel/src/permission/audit/record.rs:65-73` @ b43c0eb sha256:<custodian>). The shell has written no audit line of its own |
| F4 | T5 | `Drained` after the last remove, in either order; `TimedOut` at `Duration::ZERO` with one entry left |
| F4 | T6 | Empty: `Proceed`. With an entry: `PreventAndDrain` and the token cancelled; a second call returns `Proceed` |

- **At base:** T2 fails on its `try_lock` assertion (P0). T3 has no deterministic outcome at base and no P0 is claimed for it. T1, T4, T5 and T6 call new API, so they have no P0.

## §4. Tests, one mutation each (all in `frontends/shell/src-tauri/src/publish.rs` `mod tests`)
- **P0:** T2 is committed before product code and run at the base. It fails on the `try_lock` assertion by name.
- **T1** `a_second_execute_under_a_running_attempt_id_is_unknown_and_leaves_the_running_token_registered`. M1: `run_exclusive` inserts unconditionally (the base shape).
- **T2** `a_concurrent_prepare_is_not_held_behind_a_running_publishs_grant_lock`. M2: hold the guard across `boundary::execute` (the base shape).
- **T3** `a_grant_added_while_a_publish_runs_survives_that_publishs_consumption`. M3: on the `Ok` path, move `remove_matching` to after the boundary.
- **T4** `exit_requested_cancels_a_running_publish_and_its_staging_directory_is_removed`. It registers through `run_exclusive`. M4: empty `cancel_all`.
- **T5** `the_exit_drain_returns_when_the_registry_empties_and_at_its_ceiling_otherwise`. M5: `wait_idle` returns `Drained` without reading the count.
- **T6** `exit_requested_prevents_exit_once_and_only_while_something_is_registered`. M6: drop the once-flag.
- **Concurrency discipline:** no sleep and no timing assertion. T2-T4 release the barrier before any assertion, and call a lock-taking function only after `try_lock` has proved the lock free, so no mutation can hang.
- **Seams:**
  - S1, the shell into `boundary::execute` and `GrantSet`: T2 and T3.
  - S2, cancel into staging and the audit outcome: T4.
  - S3, the Tauri event loop: the crate-source read (§0) plus row R1 (question round 40, item 3).
- Mutations are observed by applying one, running the named test, recording its failure by name with the commit, and reverting. A `verify-mutation` run is not an observation (`docs/PREREGISTRATION-TEMPLATE.md:172` @ b43c0eb sha256:<custodian>).

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:** §3's table and §2 item 6. P0 fails at base. M1-M6 each fail their own test.
- **Declared unchanged:**
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
  - every Display and code.
- **Invalidators:**
  - **Stop:** the narrowing, the drain or the "unknown" record needs a kernel, ADR or audit-schema change. Route it.
  - **Stop:** an edit is needed in TS, `tauri.conf.json`, the capabilities, `Cargo.toml` or `Cargo.lock`.
  - **Stop:** a `cfg` or OS-keyed branch is needed.
  - **Stop:** R1 shows that `ExitRequested` does not fire on a last-window close on Windows, or that the relaunched process conflicts on the data plane, the audit log or staging. Route it, and propose no single-instance mechanism inside this piece.
  - **Invalid run:** T4's positive control fails, or the barrier is never reached. Use a class-2 amendment.
- **Falsification:**
  - a grant authorizes two executes;
  - `publish_prepared` runs under the shared guard with equal facts;
  - a registered execute token is replaced or removed by another call;
  - `wait_idle` returns `Drained` while a cancelled publish's staging entry exists;
  - the shell writes an audit record.

## §6. Instruments
Assertions only. No measurement. R1's checks are observations, not timings.

## §7. Declared values and ceilings
- `EXIT_DRAIN_CEILING` = 30 s, by the 2026-10-03 exit-drain ruling.
  - It bounds the wall time between `prevent_exit` and `app.exit`, at its own site.
  - It is a declared ceiling (ADR-010 §6, `docs/adr/ADR-010-render-frames-origins-boundaries.md:70` @ b43c0eb sha256:<custodian>), not a measured bound. Quiescence stays unbounded (ADR-018 §2).
- No other new constant.
- **Size budget:** ≤ 700 changed lines (insertions plus deletions) across ≤ 5 files:
  - `frontends/shell/src-tauri/src/publish.rs`;
  - `frontends/shell/src-tauri/src/commands.rs`;
  - `frontends/shell/src-tauri/src/lib.rs`;
  - `KNOWN-LIMITATIONS.md`;
  - `frontends/shell/MANUAL-WALKTHROUGH.md`.
- **Counted by** `git diff --numstat <base>...HEAD -- . ':(exclude)frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md' ':(exclude)PLAN.yaml' ':(exclude)CUSTODIAN-QUEUE.*' ':(exclude)site' ':(exclude)state'` at a named commit. This form is excluded by name.
- An overrun is class 8 (`docs/PREREGISTRATION-TEMPLATE.md:169` @ b43c0eb sha256:<custodian>), and this §7 line is never edited.

## §8. Block-on-sight
1. An edit outside §7's five files. Exempt: this form's own appended §10 amendments, and the custodian's records (`PLAN.yaml`, `CUSTODIAN-QUEUE.*`, `site/**`, `state/**`).
2. A new Tauri command, parameter, event or outcome variant, or any SKP or MCP change.
3. A new or changed UI string, Display, or log line.
4. `publish_prepared` reachable under the shared guard on the `Ok` path, or a second `remove_matching` on that path.
5. An execute key's token replaced, or removed by a non-registrant.
6. A wait on the event-loop thread; `prevent_exit` more than once per process; an exit while a key is registered before the ceiling elapses.
7. A start-up sweep, or any deletion of a path the kernel did not create in this process.
8. **Any audit record written by the shell** (an `append_intent` or `append_outcome` call outside the kernel boundary), including any existing `Outcome` value used to stand in for "unknown".
9. A sleep or timing assertion, or a test that can hang under its mutation.
10. A `cfg`, a platform ignore, or OS-keyed logic, including any macOS keep-running behaviour.
11. A single-instance mechanism.
12. T1-T6 missing, P0 unobserved, or M1-M6 unobserved; a record calling a `verify-mutation` run an observation.
13. A new `pub` item without a product caller.
14. KNOWN-LIMITATIONS 30 merged without the human's sight.
15. A §7 overrun not recorded as class 8, or a scope addition not recorded as class 9 before its code.

## §9. Gates
- **Architect:**
  - ADR-018 §1-2;
  - ADR-017 §15;
  - ADR-006 row 17;
  - ADR-024's single-use and non-persistence;
  - `docs/01` principle 7;
  - ADR-010 §6-7;
  - the 2026-10-03 exit-drain ruling's conditions (a) to (c), against §2 items 5 and 6, §1 and R1;
  - the seam rule for S1-S3;
  - the caller rule;
  - §8 one by one.
- **Reviewer:** the full diff; P0 observed; M1-M6 observed.
- **Suites:**
  - `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`;
  - `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check`;
  - `npm run verify` in `frontends/shell`;
  - `verify:cites` and `verify:plan`;
  - CI's `node --test` scripts suite.
- **Operator, row R1** (Part R, appended; Windows; the normal build, not the measure build, whose fixed CDP port two processes would contend for). Committed with a blank result log and queued. Paraphrase:
  1. Open Part H's 5 GB fixture.
  2. Publish to a fresh destination under the repository's `target` directory, and confirm.
  3. While the phase line reads `verifying-source` or `writing-partitions`, close the window with its close button.
  4. Relaunch the app at once, the same way it was launched.
  5. In the relaunched window, open the 100k fixture (Part A).
  6. Wait at least 30 s after the close.
  
  Expected:
  - (i) The relaunched app starts with no startup-refusal dialog, admits the 100k fixture and draws it (the data plane works).
  - (ii) After the wait, only one instance of the app's process remains.
  - (iii) The destination is absent. With hidden items shown, its parent holds no `.<name>.staging-*` entry.
  - (iv) `publish-bundle --audit-show` reads that attempt as cancelled (`kernel/src/permission/audit/reader.rs:316-317` @ b43c0eb sha256:<custodian>), not as no outcome. No line is reported corrupt.
  - (v) The app's log directory holds two distinct session logs, one per process.
  
  A result of "no outcome (interrupted?)" together with a staging entry is the declared ceiling case. It is recorded as a deviation and routed, not passed. Row G9 (`frontends/shell/MANUAL-WALKTHROUGH.md:332` @ b43c0eb sha256:<custodian>) is unchanged.

## §10. Amendments (opens empty, append-only)
````

**What changed from the first draft:**
- **Authority.** It now cites question round 40, items 1-4, and pins the directive at lines 7-12. That pin's rev is the main commit that adds the file, which the custodian supplies; the ledger records that commit's sha256 as 94a4ede4….
- **§0.** Added:
  - the Tauri, tao and muda event facts for macOS, Windows logoff and SIGTERM;
  - the audit record shape and how the boundary mints its attempt id;
  - the relaunch reads (data plane, session log, audit log);
  - the routed-out list: `prepare-cancel-key-per-dataset`, the macOS keep-running convention, and the "unknown" outcome.
- **§1.** The "unknown" record moved to may-not-claim, with its three reasons, and the form states what the audit shows instead. "No audit record written by the shell" and "no `cfg`" were added to Unchanged.
- **§2.** Item 5 now has the per-OS exit table and the macOS finding. Item 6, the relaunch predictions, is new. KNOWN-LIMITATIONS 30's content now names the declared exits and the intent-with-no-outcome state.
- **§3 and T4.** T4 also asserts that the shell wrote no audit line of its own.
- **§5.** New invalidators: a needed kernel, ADR or schema change; a needed `cfg`; an R1 conflict.
- **§7.** The ceiling is fixed at 30 s, as ruled. The size budget rises from ≤ 650 to ≤ 700 lines for the longer R1 row and item 30.
- **§8.** New items 8 (no shell-written audit record and no stand-in value), 10 (now also any macOS keep-running behaviour) and 11 (no single-instance mechanism).
- **§9.** R1 is rewritten with the relaunch and checks (i) to (v).

**Points still open:**
1. **Two findings to route as proposed nodes.** The names are suggestions; the custodian picks them.
   - `audit-unknown-outcome-at-exit`, a kernel change. It needs an `Outcome` value for unknown (a value-domain widening of `spatial-audit/1`, which is yours under the precedent at `kernel/src/permission/audit/record.rs:90-99`), the attempt id exposed to the caller, and a guard so each attempt gets one terminal.
   - `shell-macos-last-window-convention`, OS-keyed: `RunEvent::Reopen` and window recreation.
   
   Both are scope additions, and the second is also a user-visible behaviour change, so both need your typed ruling.
2. **An option this draft does not take.** On `RunEvent::Exit` (Cmd-Q, Windows logoff), the shell could cancel and block the main thread for up to the ceiling, so cleanup might still finish. On Windows, logoff's kill timeout would probably cut it short. It would block the event-loop thread, and it is a user-visible behaviour change, so it is not drafted. It would need your typed ruling.
3. **KNOWN-LIMITATIONS 30.** Its wording is for your sight at the PR.
4. **Budget.** My estimate is about 240 minutes of worker time for ≤ 700 lines: three code files, six concurrency tests with six observed mutations, a P0, and two doc entries. Gate rounds come on top. The node says 90; the custodian sets it.
5. **port-1-linux-l1.** There is no overlap in `frontends/shell/src-tauri`. If port-1's files include `KNOWN-LIMITATIONS.md`, both pieces edit it, but in different hunks: port-1 edits item 1, this piece appends item 30.

