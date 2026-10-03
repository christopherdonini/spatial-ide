# A running publish keeps its cancel token, the grants lock is not held across a publish, and closing the window cancels the publish so its staging directory is removed (wave-1 A1 obs. 1-2, A2 obs. 3, A5-2; src-tauri) — preregistration

**Authority:**
- PLAN node `publish-attempt-lifecycle-src-tauri`, position 8 of the human's order (question round 31, item 1, RULED 2026-09-30).
- Split from `publish-refusal-codes-and-attempt-lifecycle` by question round 31, item 2 (RULED 2026-09-30). That ruling puts src-tauri bug fixes outside the shell hold and applies portability R1-R6 (`state/directives/PORTABILITY-2026-09-30.md:33-65` @ b43c0eb sha256:858fbe6132793c3558641015f865790dd3845749591c18b495a955b7fd2944ff).
- Question round 40 (RULED 2026-10-03):
  - item 1, a red line ruled in the human's typed words, is filed at `state/directives/2026-10-03-exit-drain-ruling.md:7-12` @ f421ad1 sha256:94a4ede4634c6305126e85a29cea1be72eccb390065b3617a2bea5efb375614b. f421ad1 is the main commit that adds that file. It is referenced and not reproduced, and its conditions (a) to (c) are met in §2 item 5, §1, §8 and §9;
  - item 2: the grants lock is narrowed in the shell only;
  - item 3: the exit seam is proved by the source read plus row R1;
  - item 4: the prepare-key sibling is routed out (§0).
- Origin, which is evidence and not Authority:
  - `state/cloud/wave1/A1.md:71-72` @ b43c0eb sha256:45e2a9100caafe5c1367558ccb807fbd3ac3ecd7ee8483fef8cea0bb763d08c5 with its triage `state/cloud/wave1/A1.md:98-99` @ b43c0eb sha256:78aa357de29af5d6770ce85450db53e81bb0c94e76504c69fae96ce363d3a113;
  - `state/cloud/wave1/A2.md:77` @ b43c0eb sha256:147b74e2ca32f71c0c3162fa428a005d2aa813184fad8a28b42e432f23233bf8 with its triage `state/cloud/wave1/A2.md:104` @ b43c0eb sha256:6f1a46758a6390a545e04fb140f3d14c3e3f3bcc32f65e55f1399933269cf7c2;
  - `state/cloud/wave1/A5.md:65-83` @ b43c0eb sha256:2556f7d9daf80ac1621419321115e60dad164f34f5d19b353d2d1435d631cd4f with its triage `state/cloud/wave1/A5.md:115` @ b43c0eb sha256:479b6f98806bfcaceed87dc2dcc95246d2a5255d966d14a9aedffaf942faa195.

**Drafted by** the architect agent on the custodian's brief, read at `main` b43c0eb. It was revised before commit to meet question round 40. Shape model: `frontends/shell/PUBLISH-REFUSAL-CODE-SRC-TAURI-PREREGISTRATION.md`. **Committed before any code**, on main, as its own commit. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Custodian's edits to the draft, before commit:**
- (1) Every span hash, computed at b43c0eb and, for the ruling's pin, at f421ad1. The architect had no Bash.
- (2) The ruling pin's rev filled in.
- (3) This line.

Nothing else changed. The consults are `state/consults/2026-10-03-publish-attempt-lifecycle-src-tauri-architect-draft.md` (the first draft) and `state/consults/2026-10-03-publish-attempt-lifecycle-src-tauri-architect-draft-2.md` (this revision). On the revision's open points:
- (1) Its two findings are routed as the proposed nodes `audit-unknown-outcome-at-exit` and `shell-macos-last-window-convention`. Each needs the human's typed ruling at placement.
- (2) The option not drafted, a drain on `RunEvent::Exit`, is reported to the human.
- (4) PLAN's node takes this form as its gate, 240 minutes as its budget and `merge: merge-commit`, in the same commit.

**Gating:** full (§21a: `AUTONOMY.md:315-332` @ b43c0eb sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3). It touches stated guarantees (§2 Heads) and crosses §21c's bounds (`AUTONOMY.md:349-357` @ b43c0eb sha256:c99b2fcabe5d66acf6c904d268db4cb8f1d2451a4429bcba596b0381a2749159) on size and on user-visible behaviour. Under round 25, item 2 (e) (`AUTONOMY.md:482` @ b43c0eb sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669), no five-line form is used. Worker: worker-high.

**Every sentence below about a cited span is paraphrase. Nothing in this form is quoted.** Crate sources are cited by crate, version and file. They are evidence of an external interface, read at the versions `frontends/shell/src-tauri/Cargo.lock` pins: tauri 2.11.5, tauri-runtime-wry 2.11.4, tao 0.35.3 and muda 0.19.3. No local path is recorded.

## §0. Disclosure
- Reasoned from code at b43c0eb. No wave-1 reproducer exists for these items, and nothing from `cloud/wave1-A1`, `-A2` or `-A5` merges.
- **The pins are history; the tree governs.** A1's triage pins the prepare's lock, the execute's lock and the boundary call at ab4eb65 (lines 548, 695 and 711). At b43c0eb they are:
  - `frontends/shell/src-tauri/src/publish.rs:606-619` @ b43c0eb sha256:790424792a52dc0c64a577d47c2afdd4202a1b5ef3f1f905d5b69014e3bdf7fd (the prepare's lock);
  - `frontends/shell/src-tauri/src/publish.rs:772-773` @ b43c0eb sha256:4e55bc3486bdf4facb3c1b6ef08517351494d3e26230ba397b38557e9aa87e4f (the execute takes the lock);
  - `frontends/shell/src-tauri/src/publish.rs:788-792` @ b43c0eb sha256:4faee8b488376776efb2e12d04afae1752e16c6a01176d431cb16975c92c99f1 (the lock is held through `boundary::execute`, then dropped and the grant consumed).
  
  The tree at b43c0eb is authoritative for this piece.
- **A premise correction, paraphrased.** At b43c0eb the prepare's only cancel check is the pin phase (`frontends/shell/src-tauri/src/publish.rs:431-438` @ b43c0eb sha256:485a5e76bfc0fdb05b3a20167cdfdcacdf55daa664dc9b66b199e03f161ff967), and it runs before the lock is taken. So a concurrent prepare stalls at the lock for as long as the other publish runs, and its prepare token, still registered, is read by nothing during the wait. The fix removes the stall. The prepare remains non-cancellable after its pin, and that part is unchanged (§2.2).
- **Defect 1 sites.** Execute registers by unconditional insert (`frontends/shell/src-tauri/src/commands.rs:410-411` @ b43c0eb sha256:d432b9a360bc7094d8ed5635700367c814f5fdece5125f10c3918e064999c67d) and removes unconditionally (`frontends/shell/src-tauri/src/commands.rs:434-436` @ b43c0eb sha256:5636b662f62871caac996b59484b0f46c376f5b389c63900ab9efa2095c2e629). The registry's insert replaces whatever is there (`frontends/shell/src-tauri/src/publish.rs:998-1001` @ b43c0eb sha256:18ba0879b7ad7c6a991ff1e66f5c7f8cc81bc70b937d934691c09936aa774788). The pending attempt is single-use (`frontends/shell/src-tauri/src/publish.rs:707-709` @ b43c0eb sha256:28adabfa7db23e8d7fbc4f7ba539f175a51a32480f799bc4bda1f102dd0ac449; `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:95-100` @ b43c0eb sha256:51212b9cfa406512f33e0118f4c8cfa2050a40c5315d257b5046c7340c44add3).
- **Defect 2 seam (kernel, read first).**
  - `PublishAttempt` borrows a `&GrantSet` (`kernel/src/permission/boundary.rs:120-130` @ b43c0eb sha256:6323ddac135ccf70fb88cd36ebf3cf0fb4cc55ee1332a55cd072007b19b320ea).
  - The boundary reads it only at step 4 (`kernel/src/permission/boundary.rs:368-374` @ b43c0eb sha256:58b751e9e9eae8eb10f68a5b1724a956ac79806720e99fe32365b9a0598bc046) and step 6 (`kernel/src/permission/boundary.rs:408-413` @ b43c0eb sha256:ba01a39c0c4856011874a8f56315c21bd400551b966a6849bdaed3ad59dd145b), both before `publish_prepared` (`kernel/src/permission/boundary.rs:416` @ b43c0eb sha256:9a10864308c99e16025c1f7982f6b323d7c8109600a9ec66ad1e85f2184620bb).
  - `PublishGrant` is `Clone` (`kernel/src/permission/grant.rs:226-228` @ b43c0eb sha256:6dd245a5cd6508f25ce825d21567b125fcda2b99ec54e19e62b389d99365feca). `GrantSet` is not `Clone` and exposes no iterator (`kernel/src/permission/grant.rs:360-364` @ b43c0eb sha256:3ec8d7da9d1789ecbb92aef9913cad5727941aad0086845b4863ce8b9af288e7).
  - The two methods used are `find` (`kernel/src/permission/grant.rs:443-447` @ b43c0eb sha256:6779461da53dca6906b86944f8b711efaaeb99c73944054ef6af64b105dff985) and `remove_matching` (`kernel/src/permission/grant.rs:420-425` @ b43c0eb sha256:4feb1c18793ce6d6888ba82dd0d02191a28173141d5549ef1eaf2445d6997f99).
- **A latent race, found by this draft.** `consume_grant` re-locks after `drop(held)` (`frontends/shell/src-tauri/src/publish.rs:754-759` @ b43c0eb sha256:3cf49b5c905f7bda293726dcbaed786263b9be0ae4c2907f71079f98a751391f). A prepare with the same facts that wins the lock between those two steps loses its grant. §2.2 closes this; T3 proves it.
- **Defect 3 seam (kernel, read first).**
  - Staging is created at `kernel/src/publish/mod.rs:619` @ b43c0eb sha256:30038f911c6a10cc5d1d9f71e120c7aca6f5e4b67fb9071cd8be355ab5ed32f5, and removed on every `Err`, including `Cancelled`, at `kernel/src/publish/mod.rs:621-637` @ b43c0eb sha256:da46784b26caddb172627603fefe54597aedd5c1bfeeeae40839076ebd9de88c.
  - The first phase event, `verifying-source`, is emitted after staging exists and before the first cancel check (`kernel/src/publish/mod.rs:701-702` @ b43c0eb sha256:b6abb028f92c01c0203a62a146e2856f5a3ec727d63f46550f3062e119f30c60).
  - The kernel already declares that a crashed publish leaves the directory (`kernel/src/publish/mod.rs:1415-1420` @ b43c0eb sha256:5971d681c0001a67531ad6d77d5c696b859aa3be4b347976736139db34296c46). The name shape is `.<name>.staging-<hex>` (`kernel/src/publish/mod.rs:1434` @ b43c0eb sha256:ef7e7b642edfb4e7034a8a77f1a8d203c28b3db06b4596fde5850615335bf118). The suffix claims no cross-process uniqueness (`kernel/src/publish/mod.rs:1653-1662` @ b43c0eb sha256:77d255527e7384a03c0d0f57cdd42aaaf0031dea98d18ce084548ed58bbcaa49).
- **Defect 3 seam (Tauri, read first).** Paraphrased:
  - In tauri 2.11.5 `src/app.rs`, `RunEvent::ExitRequested { code, api }` carries `code` `None` for an exit the user caused. `ExitRequestApi::prevent_exit` sends on a channel. `AppHandle::exit` re-enters `ExitRequested` with `Some(code)`. `App::run` ends the process through `std::process::exit`, which confirms that A5-2's blocking thread dies at exit.
  - In tauri-runtime-wry 2.11.4 `src/lib.rs`, the last window's `Destroyed` emits `ExitRequested { code: None }` and reads the prevent signal with `try_recv` straight after the callback, so `prevent_exit` must be called synchronously. That branch is **not OS-keyed**. `LoopDestroyed` emits only `RunEvent::Exit`.
  - In tauri 2.11.5 `src/app.rs`, the builder installs a default menu on macOS only.
  - In muda 0.19.3 `src/platform_impl/macos/mod.rs`, that menu's Quit item maps to `terminate:`.
  - In tao 0.35.3, macOS's `applicationWillTerminate` (`src/platform_impl/macos/app_delegate.rs`) calls `AppState::exit` (`src/platform_impl/macos/app_state.rs`), which emits `LoopDestroyed`. Windows' `WM_ENDSESSION` (`src/platform_impl/windows/event_loop.rs`) calls `loop_destroyed`, and the file notes that `WM_QUERYENDSESSION` is not processed. A grep of tao 0.35.3 finds no SIGTERM handling.
  
  The worker re-reads these items before writing `lib.rs` and names the crate versions in its report.
- **Today's exit.** `.run(tauri::generate_context!())` installs no event callback (`frontends/shell/src-tauri/src/lib.rs:553-554` @ b43c0eb sha256:73458aa75e8cd3711f9cdd7b05d0abaf4e7a3480c29dad37e3367bfb62d35ffe). A window closed mid-publish today leaves the staging directory and an audit intent with no outcome.
- **Today's cover.** No automated step closes the window (`frontends/shell/MANUAL-WALKTHROUGH.md:395` @ b43c0eb sha256:1fc4f5aaf8f392f34b29ed1416f8eac57cba1fd191c9193b329404aaddd2f92c).
- **The audit's record shape, read for condition (b).**
  - `Outcome` has exactly four values: success, refused, cancelled and failed (`kernel/src/permission/audit/record.rs:56-63` @ b43c0eb sha256:da3bca4ae98f8ee50467733b4cfb545c5ba66caf94b63461c369c09bff685b06).
  - The record module defines an intent with no outcome as the readable state of an attempt that started and whose ending is unknown (`kernel/src/permission/audit/record.rs:8-11` @ b43c0eb sha256:d9aab49eb4a293bf1631adadfd8ca919064b9cfa6b7ccdea698b9e4efd614d35). The reader prints it as an orphan intent, "no outcome (interrupted?)" (`kernel/src/permission/audit/reader.rs:43-44` @ b43c0eb sha256:274cdd81f20ea036d2999cb3b841afc05757836cb752da2b633183f40335d059; `kernel/src/permission/audit/reader.rs:338` @ b43c0eb sha256:b8d04fa28865fbbdbbe92b01aaf465d59bd10b23e6372c3c54851872e363cf0c).
  - An outcome record is tied to its intent by `attempt` (`kernel/src/permission/audit/record.rs:132-135` @ b43c0eb sha256:f32f6bd805c7a76139fded17351a0bbf0b94ef15d6577089efce1d4aed2158be). The boundary mints that id privately (`kernel/src/permission/boundary.rs:342` @ b43c0eb sha256:5f4b336a2f912e5187f2db5e75478718d20c6344f1e44e60064a691ac7e65e6f).
- **Relaunch, read for condition (c).**
  - The data plane binds loopback on an OS-assigned port (`protocol/data-plane/src/server.rs:285-287` @ b43c0eb sha256:017b8441a7c487623cd7b8ef89e23d47a81af1406ae983699f76132329a500f6; `frontends/shell/src-tauri/src/lib.rs:438-441` @ b43c0eb sha256:40eddb8d1c056b623a38bd90bfc11d47af1b924df512b2118cc4b567cde3222b).
  - The session log is a per-second file name opened for append (`frontends/shell/src-tauri/src/state.rs:30-40` @ b43c0eb sha256:3a3fed2effd68da23e6f8cc1a3de53f17c09ed353e79388e1f491dc8e0fcf6b5).
  - The audit log's append is serialized within one process only. Coordination across processes is declared absent (`kernel/src/permission/audit/log.rs:44-46` @ b43c0eb sha256:d402ff8151220cc58e2fc0532d3c942c64b939332a50fe7abd667eaa7a15f644). Each append re-opens the path (`kernel/src/permission/audit/log.rs:217-222` @ b43c0eb sha256:5fde7d4d80be9e4d63d7885b6b9f2131d49b2eba2d44ef0137836e95f8c8ccc4), and rotation runs only inside `open_for`, that is, only on an execute (`kernel/src/permission/audit/log.rs:121-155` @ b43c0eb sha256:40a3311bc8f2a9c61c317ef202667c01f83f87a51f96350dcb443792781a206a).
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
  - any `docs/08` figure, any `cancel_observed` or `cancel_quiescent` duration, or that the ceiling bounds quiescence (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:56-65` @ b43c0eb sha256:9be4c73980bb8157cc300a12d1f3cf0fdcbdc929af93ffdd12a8ab45eadc8a0d);
  - cleanup after the exits §2.5 declares;
  - anything off Windows (R5);
  - that the prepare is cancellable after its pin;
  - **that the shell records an "unknown" outcome at the ceiling.** It cannot, today, without a kernel change. There are three reasons:
    - (i) `Outcome` has no unknown value, and adding one widens the `spatial-audit/1` value domain, which the human ruled on for the precedent case (`kernel/src/permission/audit/record.rs:90-99` @ b43c0eb sha256:891f4a5d005566aee2714a30f138379cb0651d5aca01b37806564a188bcf86bd);
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
  - `docs/01` principle 7 (`docs/01_Principles.md:13` @ b43c0eb sha256:8c6bcdb7ff11f95750cac89842afa4c90b6dff5a3ed5e3aaaab8994b458bcf44) and ADR-018 §1 (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:41-47` @ b43c0eb sha256:6ad29d1320d40f00412ddc7a52c656108e22811cc8f5739874ff11e10424ffb3);
  - ADR-017 §15's staging removal (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:550-552` @ b43c0eb sha256:5b66787a8c965cf7cdda062feb6cfb1401d1dad3951874e9f8859a49427e06ed);
  - ADR-006's class-3 audit obligation (`docs/adr/ADR-006-lineage-undo-side-effects.md:17` @ b43c0eb sha256:3679b1eed3e38b0bafe1cac389ea255e41fbbe827971ca94e8ce66ffa3a850dd);
  - ADR-024's single-use attempt and non-persistent grants (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:235-238` @ b43c0eb sha256:ac6c4ebe87aaf73c4b45dab0b0bf0b1e1c1cf31288a7a120e935966f55bf7dee). The moment a grant is consumed moves; the property does not change.

**User-visible behaviour (ruled: question round 40, item 1):**
- After the last window closes during a publish, the process stays alive, windowless, until the publish quiesces or 30 s pass.
- The audit records an outcome of cancelled where today it shows an intent with no outcome.
- KNOWN-LIMITATIONS gains item 30.
- No UI text changes. A refused second execute shows the existing unknown-attempt sentence (`frontends/shell/src/publish/PublishPanel.tsx:273-279` @ b43c0eb sha256:4533f6306132ca79e036d5dac93b8ea5ad0fef94363d13d5d2a967583f090617).

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
   - Residual, declared: a filesystem change between the two `resolve_destination` calls can reach `publish_prepared` under the lock on the `Err` path. That is today's behaviour, and the same TOCTOU class ADR-017 §15 declares (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:559-561` @ b43c0eb sha256:1e97596d1e0e463c3867a2d9f6778f6230c86e9b1f19770c2556a8e3a16260d1).
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
5. **Portability, rule by rule** (`state/directives/PORTABILITY-2026-09-30.md:33-65` @ b43c0eb sha256:858fbe6132793c3558641015f865790dd3845749591c18b495a955b7fd2944ff), meeting condition (a) of the 2026-10-03 exit-drain ruling.
   - **R1:** met. Cancellation, staging removal and grant semantics are the same on every OS. Every reduction is declared below and in KNOWN-LIMITATIONS 30.
   - **R2:** the exit hook sits in `lib.rs`, inside the native integration boundary (`state/directives/PORTABILITY-2026-09-30.md:45` @ b43c0eb sha256:eb07f9796e77e14e73dc2486858e33df0e91ec54970494d8280426786d0c38c0). OS facts come only from the runtime's events. No `cfg` is added.
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
   - **R5:** Windows L1, plus L2 for a last-window close through R1. Nothing is claimed off Windows (`state/directives/PORTABILITY-2026-09-30.md:27` @ b43c0eb sha256:cae24199369d34ab1264d17f879282a1bb3c63fd2902dfd26f1702c7e405429f).
   - **R6:** no test is ignored on any platform.
6. **A relaunch during a drain** (condition (c); predictions, read from code, checked by R1):
   - **Data plane:** no conflict. Each process binds its own OS-assigned loopback port, with its own session token, and the new webview attaches to its own process's port. The old listener stays up, unattached, until exit.
   - **Session log:** no conflict. Files are named per second of start, and the two starts differ.
   - **Audit log:** no conflict in R1. The new process writes to the audit only if it executes a publish, and R1 does not. Declared residual: a publish executed in the new process while the old one drains is two appenders across processes, with no coordination. A rotation by the new process's `open_for` at the 8 MiB ceiling could then put the old process's outcome in a different generation from its intent. This is already declared at `kernel/src/permission/audit/log.rs:44-46` @ b43c0eb sha256:d402ff8151220cc58e2fc0532d3c942c64b939332a50fe7abd667eaa7a15f644.
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
| F1+F3 | T3 | A returns `Success`. C returns `Refused` starting `publish.destination_exists: ` (`kernel/src/publish/error.rs:231` @ b43c0eb sha256:72640c2644761665d152d9d3b2f0ccdee30f2269ee58954840eb52e86a805c5f) |
| F1 | T4 | While parked: one `.out-<name>.staging-` entry (the positive control). After `on_exit_requested` and release: `Refused` starting `publish.cancelled: ` (`kernel/src/publish/error.rs:251` @ b43c0eb sha256:e1adc07f9ebcafb944862040f6c9f35dedf74f01fe3285125a767afa945fda43), no staging entry, the destination absent, and the audit's last record has outcome `cancelled` (`kernel/src/permission/audit/record.rs:65-73` @ b43c0eb sha256:5e9a744f0df9c274e0267b5484a5235116b33316937c56e43058eeda68232737). The shell has written no audit line of its own |
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
- Mutations are observed by applying one, running the named test, recording its failure by name with the commit, and reverting. A `verify-mutation` run is not an observation (`docs/PREREGISTRATION-TEMPLATE.md:172` @ b43c0eb sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2).

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
  - It is a declared ceiling (ADR-010 §6, `docs/adr/ADR-010-render-frames-origins-boundaries.md:70` @ b43c0eb sha256:cbcf6df98577c27bf7108e7b646c09e823795ff609504604cad1948f4b4fe2d2), not a measured bound. Quiescence stays unbounded (ADR-018 §2).
- No other new constant.
- **Size budget:** ≤ 700 changed lines (insertions plus deletions) across ≤ 5 files:
  - `frontends/shell/src-tauri/src/publish.rs`;
  - `frontends/shell/src-tauri/src/commands.rs`;
  - `frontends/shell/src-tauri/src/lib.rs`;
  - `KNOWN-LIMITATIONS.md`;
  - `frontends/shell/MANUAL-WALKTHROUGH.md`.
- **Counted by** `git diff --numstat <base>...HEAD -- . ':(exclude)frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md' ':(exclude)PLAN.yaml' ':(exclude)CUSTODIAN-QUEUE.*' ':(exclude)site' ':(exclude)state'` at a named commit. This form is excluded by name.
- An overrun is class 8 (`docs/PREREGISTRATION-TEMPLATE.md:169` @ b43c0eb sha256:8c7ea33dc2f3661d0f6f93e9e0fe89c4d1f2f523ff73b759105cfce86d511716), and this §7 line is never edited.

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
  - (iv) `publish-bundle --audit-show` reads that attempt as cancelled (`kernel/src/permission/audit/reader.rs:316-317` @ b43c0eb sha256:08226e9d42a04ce99d79bd6285ea64a894b4448c86682816b9a304ffda745e18), not as no outcome. No line is reported corrupt.
  - (v) The app's log directory holds two distinct session logs, one per process.
  
  A result of "no outcome (interrupted?)" together with a staging entry is the declared ceiling case. It is recorded as a deviation and routed, not passed. Row G9 (`frontends/shell/MANUAL-WALKTHROUGH.md:332` @ b43c0eb sha256:aeaf6de243e2326e2d642d13d32f9045c89862f4dc2f5e10b6e0060d325c1469) is unchanged.

## §10. Amendments (opens empty, append-only)

### Amendment 1 — budget overrun, §7 not edited; correction round 1 after the merge (classes 8, 1 and 4)

budget overrun, §7 not edited. Written after gate 1's results were seen and after the merge (a post-result amendment). References only.

1. **The merge came first.** PR #163 merged on 2026-10-03 at 08:01:55Z as merge commit 4e3c8a8, at head 4d92733, while gate 1 ran.
   - Both gate-1 reports then returned FAIL on the same S1, KNOWN-LIMITATIONS 30's ceiling case: `state/consults/gates/2026-10-03-publish-attempt-lifecycle-src-tauri-gate1-architect.md` and `state/consults/gates/2026-10-03-publish-attempt-lifecycle-src-tauri-gate1-reviewer.md`.
   - This round lands by a second PR from the same branch.
2. **The round (class 1).** Branch commit b125721 answers:
   - both S1-1s and the reviewer's S2-6, in KNOWN-LIMITATIONS 30;
   - the architect's S2-3 and the reviewer's N4, in row R1 and its "Before R1" notes;
   - the architect's S2-1 and the reviewer's S2-2, S2-5, S2-7 and N1, in comments and docs.

   It changes docs and comments only.
3. **Class 4, T4.** Branch commit d0184eb changes T4 after gate 1 (the reviewer's S2-3): T4 joins the publish first and asserts the drain at a zero-length wait.
   - M4 was observed again against the new T4, at d0184eb.
   - 0391787 updates M4's recorded text, which is now a paraphrase (the reviewer's N2).
   - The observation is in `state/consults/2026-10-03-publish-attempt-lifecycle-src-tauri-worker-report-2.md`.
4. **Class 8, the line count.**
   - **Declared:** §7 declares at most 700 changed lines over 5 files.
   - **Final:** by §7's own command over ff57832...0391787, the figure is 715 lines (675 insertions, 40 deletions) over the same 5 files.
   - **Reason:** this round adds 55 lines over 4 files to the 694 that gate 1 counted.
   - §7 is not edited.
5. **Routed.**
   - The reviewer's S2-1, S2-4 and S2-8, with the architect's S2-2, go to the proposed node `publish-lifecycle-drain-followups`.
   - On the reviewer's S2-9, the architect's gate-1 judgment on condition (c) stands.
6. **The human's sight (§8 item 14).** KNOWN-LIMITATIONS 30, as revised, is shown in the second PR's body.
7. **Superseded index.** Each is superseded as it stood at 4d92733:
   - `KNOWN-LIMITATIONS.md` item 30, superseded at b125721;
   - in `frontends/shell/MANUAL-WALKTHROUGH.md`, the "Before R1" notes and the last sentences of row R1's step cell, superseded at b125721;
   - the comments and docs that b125721 changes in `frontends/shell/src-tauri/src/publish.rs` and `frontends/shell/src-tauri/src/commands.rs`, superseded at b125721;
   - T4's drain assertion, superseded at d0184eb;
   - M4's recorded text, superseded at 0391787.

   No other line is superseded.
