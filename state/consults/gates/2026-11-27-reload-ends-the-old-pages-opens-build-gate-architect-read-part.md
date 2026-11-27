Reviewed: the branch cut/reload-ends-the-old-pages-opens at 7bd3bf2269d058bf454d936ae06d4a8e08d88ec4 in the read checkout D:/wt/read-1126b, with the form and the rulings at main 9e4c849ff8b11faea36c4adc43d2b2c880fdf6a0 in D:/wt/read-1127c, read only. This is the custodian's filing note, 2026-11-27: the architect's build gate, THE READ PART (the form's Amendment 4; ADV-2026-11-27-08 item 3), node:reload-ends-the-old-pages-opens@build-gate-architect-read-part; its run, from its completion notice only (ADV-2026-11-26-02), 43 tool uses. A read part gives no verdict and takes no gate-log row. Below the rule, the report as handed back (saved by Write with the harness's indent removed; 18501 bytes, sha256 3096bca46eb18789ffac47fe2a37f8a62bc9f7b8f31647352b0a244e8772815d), byte for byte except the scratch folder's path, written <scratch> (2 places; 18303 bytes after it, sha256 7334638d9331645dc9a9c7e31c9a0ad6013b7a265da2baa057b2d7ac43b90e07). Its F-1, F-2 and ADR-037 clauses are ruled in ADV-2026-11-27-14 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-14-bs-architect-read-part-the-thread-handle-inside-2-item-3-no-publish-rs-fix-adr-037-three-clauses-reworded.md`).

---

READ PART: `cut/reload-ends-the-old-pages-opens` @ 7bd3bf2269d058bf454d936ae06d4a8e08d88ec4. I read the code at that head in D:/wt/read-1126b, and the form and governance documents at main 9e4c849ff8b11faea36c4adc43d2b2c880fdf6a0 in D:/wt/read-1127c. This part gives no verdict (Amendment 4 items 3 and 4). Code cites below are at 7bd3bf22, a branch commit, and are named by its id with no hash. Form cites are at 9e4c849f. Nothing here is a quotation unless it is marked verbatim. I ran nothing.

## 0. For the advisor first (ADV-2026-11-27-06 item 3)

**One item that §2 does not describe: the `JoinHandle` inside `Settled::Ended`.**
- Where it is:
  - defined at page.rs:111-120;
  - returned by `settle` at :341 and :347;
  - `#[cfg_attr(not(test), allow(dead_code))]` at :112.
- Who reads it:
  - only U-2 (:948-951), U-3 (:1011-1018) and U-12 (:1300-1302), each of which joins it;
  - the commands match only `Settled::Current` and drop the rest.
- Why it is outside §2: §2 item 3 describes no return value. §2 item 4 commits ahead of time only to `page_started`'s handle.
- The rest of `Settled`, telling `Current` from `Ended`, is the means of §2 item 3's last line (the dev pool poll starts only for a name of the current page). That part is inside §2.
- The doc at :116-118 says only the tests read the handle, but it names no test. So the instrument-accessor exemption is not met as written.
- **Class:** Architecture (the caller rule and §2's scope).
- **Correction:** either
  - the advisor rules it inside §2 item 3, as the same means item 4 grants `page_started`. Then F-6's words apply, with no code change. Or
  - the handle is removed and U-2, U-3 and U-12 are rebuilt. That changes code.

Nothing else in `page.rs`, `lib.rs` or `commands.rs` lies outside §2 (section 7 below).

## 1. The named check (ADV-2026-11-26-18 item 3): ADR-020 with its Amendment 1, ADR-027 and docs/09

**The piece does not change the security posture.** The six things, each with its proof by reading:

1. **The `Finished` arm is unchanged.**
   - Base lib.rs:216-277 is head lib.rs:275-336, an offset of 59.
   - The only hunk near it, @@ -213,6 +264,14, adds 8 lines before the filter and deletes none.
   - The enum, base :142-183, is head :147-188. Its hunk (@@ -182,6 +187,45) keeps the enum as context and adds after it.
   - The added text matches none of `checkOriginEventName.mjs`'s exactly-one patterns (:44, :54-55).
   - `checkOriginEventName.mjs`, `origin.rs` and `OriginMismatchState.test.tsx` are not in the numstat.
   - Whether they are green is the reviewer's to run. The worker reports `check:origin-event` PASS at 7bd3bf22.
2. **Only the label.** The arm (lib.rs:267-274) reads only `PinnedOrigin.window_label`. `start_page_end` (:197-227) reads exactly the four managed values §9 item 5 allows. The closures' reads of `PoolPollTasks` and `SessionLog` happen on the end's thread.
3. **No write and no origin.** The arm and `start_page_end` write neither `PinnedOrigin` nor `DataPlaneConfig`, select no origin, and call nothing in `origin.rs` and no `expected_origin*`.
4. **No new way in.**
   - The handler list (lib.rs:612-635) has no hunk.
   - No added code line carries `listen`, a bind, `register_uri_scheme_protocol`, a capability, `generate_handler` or `#[tauri::command]`. A grep over b-diff.txt found those words only in ADR-037's prose and the README.
   - ADR-027 decision 4 is not engaged.
5. **`tauri.conf.json`, `capabilities/`, `Cargo.toml` and `Cargo.lock` are not in the 8-file numstat.**
6. **The work runs off the hook's thread.**
   - The end runs on `std::thread::Builder::spawn` (page.rs:380-385). The late close does too (:331-339).
   - The decrements sit in drop guards (:160-184), so a panic unwinds only that thread (U-9).
   - The hook's own path (lib.rs:267-274, :197-227; page.rs:369-396) has no `unwrap`, `expect`, indexing, `eprintln!` or unchecked arithmetic. Every lock recovers from poison (:197-199; U-10).
   - The `Finished` arm (lib.rs:275-336) reads no `Pages` state.
   - The session log is the only state both arms write (state.rs, unchanged).

Against docs/09: the end writes one log line of counts, with no handle, path or identity (page.rs:502-507). The `cancel` answer stays inside SKP-V0's three states. Local-first, grants and the loopback socket are untouched.

**The ADR-020 note is absent**, as it should be while ADV-2026-11-26-21 is unapproved: no ADR-020 path is in the numstat. §9 item 1 is not triggered.

## 2. §2 against ADR-037 as accepted

§2 agrees with ADR-037 §3, §4 and §5:
- The end's order is in `run_end` (page.rs:471-508).
- The page is checked and the name entered in one critical section with the taking of the set (:306-321 against :370-375).
- The gate's three conditions are at :271-272.
- The log line's words match ADV-2026-11-26-23 item 2 (:505).

**Clauses of ADR-037 that say more than the code (ADV-2026-11-26-27 item 4).** Reported unreworded, with no words proposed:
- **A-1, §4, second bullet.** It says the binding closes the returned name by §3 (ii) and then runs `release_ended`.
  - The late close (page.rs:333-339) runs no pool-poll stop. No poll exists to stop: the commands start one only for `Settled::Current` (commands.rs:86-91, :259-266).
  - It runs no `release_ended` when no `Projects` is managed (:336-338).
  - Neither difference can be observed. Without `Projects`, `open_project` and `save_project` refuse by name (commands.rs:216-220, :243-247), so no project lock can exist.
- **A-2, §6.** It says the first load runs an empty `release_ended`. It runs only when a `Projects` is managed (page.rs:499-501). This is the same no-`Projects` case as A-1.
- **A-3, §5.** It says a cancel of the new open's own key ends the wait. That does not hold in the form's second moment of §2 item 6 (d), described at page.rs:410-413.
  - That moment needs timing inside one request round trip, so ordinary use does not reach it. It is named in the form and in page.rs.
- **A-4, the prepare row.** It says no command can dismiss the native dialog.
  - Its cite (base commands.rs:386-391, which is head :430-435) speaks of the prepare command alone.
  - The code bears the wider clause out. No command in the handler list closes a dialog, and `app.dialog()` appears in commands.rs only to open pickers (:365, :388, :457).
  - So the clause is not wider than the code. I note it only because the advisor asked.

## 3. docs/01, ADR-006, docs/02, docs/10

- **docs/01, never block the canvas (principle 7).**
  - The hook does no wait and no kernel call.
  - The end and the late closes run on their own threads.
  - The gate waits on the async runtime by `watch` (page.rs:226-256), and the open's own key can cancel it.
  - `cancel` and `close_dataset` are sync commands. The piece adds to them only short critical sections, never held across a kernel call (page.rs:424-432, :354-358).
- **ADR-006.**
  - The end writes no project file and records no step.
  - `release_ended` frees an OS file lock (store.rs:255-259), as `close_dataset` already does.
  - Publishes are cancelled by `cancel_all` (publish.rs:1183-1187), which leaves `drain_begun` alone. Each publish then takes its own audited cancelled path.
  - So the end is neither a workspace mutation nor a side effect.
- **docs/02, the frontends row ("no logic"), and §2 item 7's words.**
  - The commands now also pass the gate, note the name on its page, and start the dev-only poll for a current-page name only.
  - That is session bookkeeping for the client's own opens. It maps a fact only the host sees and decides nothing about data.
  - The file's first comment (commands.rs:308-313) and lib.rs:13-19 name the exception, as ADR-037's docs/02 consequence requires.
  - No violation, with one wording defect in that comment (F-5).
- **docs/10.** No wire change: no protocol/ path is touched, and `CancelResponse` has no new state.

## 4. ADV-2026-11-26-16 item 1

- **(a)** No SKP text or shape changes.
- **(b)** The kernel answers first (page.rs:420), and every other answer is returned unchanged (:421-423, :438). Shown by U-7 (:1093-1172): a bad version is refused, an `sh_` key never matches, and a second cancel answers `unknown`.
- **(c)** The gate's refusal is `error_of(&EngineError::Cancelled)` (:188-190). U-6 compares it, by serialization, with a real kernel refusal from a real held open (:1059-1090).
- **(d)** The moment is named (:408-413).
- **(e)** No file under kernel/ or protocol/.
- **The last line (no wait inside the kernel).** `admit` runs before `spawn_blocking` (commands.rs:84-87, :249-253).

All hold.

## 5. The caller rule

- `Pages::new` is called from lib.rs:552.
- `admit` and `settle` are called from `open_dataset` and `open_project`; `forget` from `close_dataset`; `cancel` from the `cancel` command.
- `page_started` is called from `start_page_end`, which the hook calls.
- `stop_poll` and `log` are built in lib.rs:212-224.
- The `Ticket`'s `Drop` is reached by the commands: every ticket is dropped in `settle`. Its acting branch, like `WaitGuard`'s, runs only on an unwind or a dropped command future. Both are drop guards that §2 item 2 requires.
- The one exception is F-1 (section 0).

## 6. §9, item by item (my reading)

| Item | Finding | Where |
|---|---|---|
| 1 | Not triggered | Section 1 |
| 2 | Not triggered | No kernel/ or protocol/ path |
| 3 | Not triggered | 8 files, all in §7's Scope; handler list unchanged; no command, listener, port, scheme or capability |
| 4 | Not triggered | `Finished` arm unchanged; the pin tests not in the diff; green is the reviewer's run |
| 5 | Not triggered | lib.rs:267-274, :197-227 |
| 6 | Not triggered | page.rs:472-478 (temporary guard), :420 before :424 |
| 7 | Not triggered | Section 4 |
| 8 | Not triggered | Threads at page.rs:331, :380 |
| 9 | Not triggered | U tests use latches with a harness bound (:534-568), no sleep; E-1 (project.mjs, the E-1 hunk) has no retry or skip |
| 10 | Not triggered | `reopen.mjs` is not in the diff |
| 11 | Not triggered | The worker names its mutation runs at 2962d546 and 7bd3bf22 and calls none an observation of `verify-mutation` |
| 12 | Not triggered | Amendment 3 records class 8; §7 reads 1250 at 9e4c849f; Amendment 3's arithmetic checks |
| 13 | Not triggered | No hash at a branch commit; Amendment 3's page.rs lines are named at 7bd3bf22 with no hash |
| 14 | Not triggered by my read | The sha256 is the advisor's (ADV-2026-11-27-06 item 4); the reviewer recomputes it |
| 15 | Not mine to read | The run part's |
| 16 | Holds by records I did not verify by git | f73dfed3 touches project.mjs alone (ADV-2026-11-27-06 item 4). E-1 unchanged since the red commit is the worker's claim; the reviewer checks it by git |

## 7. ADV-2026-11-27-06 item 3, in so many words

Every item of `page.rs` is inside §2 as gated except the `JoinHandle` in `Settled::Ended` (F-1). The items I checked:
- the module doc;
- `InFlight`, `Waiting` and `State`, whose `next_id` is the means of §2 item 6's distinct tickets;
- `Pages` and `Default`;
- `StopFn`, `LogFn` and `EndParts`;
- the four guards;
- `cancelled()`;
- `lock`, `bump` and `change`;
- `admit` and `try_admit`. The closed-channel return in `admit` (:252-254) cannot be reached while `self` holds the sender. It avoids a panic path and returns item 2 (ii)'s value. The `cancelled` flag check at :266 is never true, since `cancel` removes flagged entries in the same section. It is harmless and matches item 6's words;
- `settle`, `forget`, `page_started` and `cancel`;
- `close_one` and `run_end`.

Every change in lib.rs and commands.rs is inside §2. Under ADV-2026-11-27-07 item 1 that includes `projects_of`, `open_project`'s `host` parameter and `start_page_end`.

## 8. ADV-2026-11-27-07 item 3

- **(a) Yes.** `settle` uses `host` only at :330 and `projects` only at :336-338, both inside the late close.
- **(b)** With no `Projects`, the late close closes the dataset and runs no release.
  - No lock stays held: `open_project` and `save_project` refuse by name without one (commands.rs:216-220, :243-247).
  - No comment or form text says so. Words are at F-3.
- **(c) No path reaches the early return** (lib.rs:198-205).
  - `setup()` manages all four values with no condition: `Projects` at :516-521 (as an `Option`, `None` included), `SkpHost` at :523, `RunningPublishes` at :549 and `Pages` at :552.
  - The arm calls `start_page_end` only once `PinnedOrigin` is managed (:268-270, managed at :529).
  - Between :529 and :552 there are only `manage` calls, which dispatch no WebView2 callback.
  - This holds even in the measure build, whose window is built after :552 (:597-599). It does not rest on the tauri ordering claim at :250-257.
  - So ordinary use cannot reach the return, and nothing goes to the advisor. Words for the doc's missing sentence are at F-4.
- **(d) No clause of ADR-037 says more at that return.** §6 says the hook runs only after `setup()` has managed the state it reads, and that is true here. A-1 to A-4 are elsewhere.

## 9. Findings

Under the proportional-gates direction, the Documentation findings are must-fix before the merge. They block nothing and need no re-gate. None of the words below is the human's: all are the worker's doc comments, so under §31 the worker applies them and the PR body lists them. rustfmt does not reflow comments, so the bytes land as given.

**F-1. Architecture.** See section 0. It goes to the advisor first. Its correction may change code.

**F-2. Evidence.**
- The worker's report says `cargo clippy --locked --all-targets -- -D warnings` exits 101 at 7bd3bf22, on `publish.rs:359` (`large_enum_variant`).
- That file is outside §7's Scope. §10's "fmt and clippy" item still binds before the read part (Amendment 4 item 2).
- I have not established whether clippy is also red at the base ca576852.
- A fix in `publish.rs` would be a scope addition, recorded as class 9 before its code. That goes to the advisor.
- Also not shown in anything I read: CI's `node --test` (the worker ran none), the verify scripts and `verify:plan`, and the branch's CI. The reviewer's read part owes them.
- The correction may change code outside Scope.

**F-3. Documentation: words for (b).** Words only, no code change. In `frontends/shell/src-tauri/src/page.rs`:
- Old (occurs once): `    ///   opens the gate, and that open stays held, as it was before this module.`
- New:
```
    ///   opens the gate, and that open stays held, as it was before this module.
    ///   With no [`Projects`] (`setup` manages `None` when the per-user data directory did not
    ///   resolve), the late close closes the dataset and runs no release: `open_project` and
    ///   `save_project` then refuse by name, so no project lock was taken and none stays held.
```
- Clause check:
  - `setup` manages `None`: lib.rs:514-521, and commands.rs:53-55 says the same.
  - The close and no release: page.rs:335-338.
  - The refusals: commands.rs:216-220, :243-247.
  - No lock without `Projects`: only `Projects` takes `ProjectLock`.

**F-4. Documentation: words for (c).** Words only, no code change. In `frontends/shell/src-tauri/src/lib.rs`:
- Old (occurs once): `/// tests of `page.rs`.`
- New:
```
/// tests of `page.rs`. When one of the four managed values it reads is missing, it returns without
/// starting an end, and the old page's opens stay held with nothing logged. No path reaches that
/// return: `setup()` manages all four with no condition, `Projects` and `SkpHost` before
/// `PinnedOrigin` and `RunningPublishes` and `Pages` after it, with no call between them that can
/// run this hook, and the arm calls this function only once `PinnedOrigin` is managed.
```
- Clause check:
  - The return: lib.rs:198-205.
  - Nothing logged and the set not taken: `page_started` is not called.
  - The order: :516-521, :523, :529, :549, :552.
  - Between :529 and :552, `manage` calls only.
  - The arm's guard: :268-270.

**F-5. Documentation: the first comment of `commands.rs`.** Words only, no code change.
- The defect: it says `cancel` "notes" a gate-waiting open. In fact `cancel` itself answers `requested` and ends that open (page.rs:424-439, :262-265). That is the binding's one answer of its own, which ADV-2026-11-27-07 item 4 has read against docs/02.
- In `frontends/shell/src-tauri/src/commands.rs`, Old (occurs once): `//! `close_dataset` note a gate-waiting open and a closed name, all in `page.rs`: ADR-037) — docs/02's`
- New:
```
//! `close_dataset` respectively end an open that waits at the gate and drop a closed name from the
//! page's opens, all in `page.rs`: ADR-037) — docs/02's
```
- Clause check: the gate cancel is at page.rs:424-439 with `admit`'s answer at :262-265; the dropped name is `forget` at :354-358, called at commands.rs:403.

**F-6. Documentation, only if the advisor keeps F-1's handle.** Words only. In `frontends/shell/src-tauri/src/page.rs`:
- Old (occurs once): `    /// tests read the handle.`
- New:
```
    /// tests read the handle: `an_open_settled_after_its_page_ended_is_closed`,
    /// `the_gate_waits_for_ends_earlier_opens_and_late_closes` and
    /// `a_reopen_behind_an_earlier_pages_reopen_waits_then_opens` join it, so that they assert after
    /// the late close has run; the commands discard it.
```
- Clause check: the joins are at :951, :1018 and :1301; the commands' matches are at commands.rs:86-87 and :259-261.

**For the advisor, unreworded:** ADR-037 clauses A-1 to A-3 (section 2). Their effects cannot be observed, or need timing inside one request round trip. None engages the posture.

## 10. Owed to the run part

- E-1 red at f73dfed342bb504949c3d8172c3339bef1ae8b46, answering `skp.project_open_elsewhere`, and green at the head.
- The head series' other suites (§10).
- F-1's ruling, and any code it changes.
- F-2's resolution.
- After that, the verdict.

Files read: D:/wt/read-1126b/frontends/shell/src-tauri/src/page.rs, D:/wt/read-1126b/frontends/shell/src-tauri/src/lib.rs, D:/wt/read-1126b/frontends/shell/src-tauri/src/commands.rs, D:/wt/read-1126b/docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md, D:/wt/read-1127c/governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md, <scratch>/b-diff.txt, <scratch>/b-worker-report-1.md
