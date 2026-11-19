Reviewed: PR #339 at 70335c37eacc479347f811f6332ab197c3cec593 (the custodian's filing note, 2026-11-19: the reviewer's gate of P3b-1; Bash 56, Read 1, SubagentHandback 1, three errored, model claude-opus-5-5, from 2026-11-19T17:37:40Z to 17:53:07Z by its transcript; the report below byte for byte from its hand-back of 15968 bytes, sha256 f124c971121daf32ccce982fbabec5983da087e5171526dc067cac1f874d846d, but for four maskings by the custodian (the project name in a hold argument and two hold-line values as <m>, one scratch-folder path as <S>), with this note in its first line and one final newline), gate, reviewer, attempt 1
Gate: PR #339, b2-piece-1c-save-and-reopen P3b-1, reviewer, at 70335c37eacc479347f811f6332ab197c3cec593
Verdict: PASS WITH NOTES

Reviewed: `cut/b2-piece-1c-p3b-1 @ 70335c37eacc479347f811f6332ab197c3cec593`. origin/main is d3522d779b18059f7c788bc2126ceb82e2626db7 after `git fetch -q origin` (rc 0). H's parents are ff6bd07cb2378afab6838f826ba45148381e88e1 and d3522d77. `git diff --quiet ff6bd07c H -- kernel frontends engine protocol renderer Cargo.lock` gave rc 0, and `git diff --stat ff6bd07c H` lists 18 files, none of them code (KNOWN-LIMITATIONS, the form, site, state). The form `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` at origin/main has sha256 5136a9274622881faeff0b4eaac9f2e297ebd387b03e4c4985935136f0b31627 (3637 lines). I read §2.11 and Amendments 46, 44 and 43 whole, the last one first, plus ADV-2026-11-19-23, -24 and -28 whole (these are the advisor's words, not the human's), the stop report 2 and `<S>/p3b1cdone-1.md`. `git diff --name-only B...ff6bd07c` lists 7 files: `frontends/shell/src-tauri/src/commands.rs`, `kernel/src/project/{mod,store}.rs`, `kernel/src/session_history.rs`, and `kernel/tests/{no_generation_in_persisted_artifacts,project_reopen,project_save}.rs`.

## 1. The lock order (Amendment 44 item 3 (c))
Found by grep at H. There are three places that take `saved`, all in `kernel/src/project/mod.rs`:
- **:246, `release_ended`.**
  - On entry it holds nothing. From `close_dataset` it runs on its own thread. From `open_project` (:730) the caller holds only its `begin_open` guard and parsed values: no mutex, and no `ProjectLock` yet.
  - Under `saved` it calls `catalog.get` and `require_live` per entry. Each takes its lock and releases it inside the call.
  - Dropping the entries drops each `ProjectLock`, which is an unlock and a file close.
- **:290, `Projects::save`.**
  - The caller (`save_project`, :425) holds only an `Arc<Dataset>`, and the binding runs it on `spawn_blocking` (commands.rs:184).
  - Under `saved`: the catalog's read lock (`Catalog::get` → `lock_read`, released), then the generations mutex (`live_generation`, released), then the recorder's state mutex (`dataset_uri`, `adopt_project`, `mark_saved_here`), and all the save's file IO. Holding `saved` across that IO was already the design before this part, and ADV-2026-11-19-24 item 2 relies on it.
- **:816, `open_project`'s push.** It holds the `ProjectLock` file lock and the `begin_open` guard. `ds` is an `Arc`, dropped earlier, and is not a lock guard.

The catalog's `RwLock` (`kernel/src/lib.rs`, `lock_read`/`lock_write`) and the generations `Mutex` (`kernel/src/skp.rs`, `GenerationRegistry::inner`) are private and are taken only inside their own methods. No guard leaves a method, so nothing can hold either one while it takes `saved`. `catalog()` and `generations()` return `Arc`s, not guards. `record_step` takes the catalog, then the generations, then the recorder state, and none of them nested. Nothing that holds the recorder state takes `saved`.

**No path takes these locks in another order, and no cycle exists.** The `saved` mutex is held across IO, but nothing waits on it from the main thread: `save_project` runs on `spawn_blocking`, `close_dataset` spawns a thread, and `open_project` is not yet bound (Amendment 46 item 2 (e)). The lock-order comment at :287–289 is true as written.

## 2. The hand-off (ADV-2026-11-19-28 item 2 (f))
- **The code** (commands.rs:138–141): `state.close_dataset(request)`, then `if let Some(projects) = projects.inner().clone() { std::thread::spawn(move || projects.release_ended()); }`. The JoinHandle is dropped.
- **Nothing borrowed.** The closure owns an `Arc<Projects>`, which owns `Arc<StepRecorder>` → `Arc<SkpHost>`. `spawn` requires `'static`, so the compiler enforces this. If the process exits mid-release, the OS frees the file lock.
- **Nothing relies on the lock being free when `close_dataset` replies.**
  - Grep for `open.lock|OpenElsewhere|release_ended` across `.rs/.ts/.tsx/.mjs/.js` finds only kernel files and commands.rs.
  - K-O17 (b) and K-O28 call `release_ended` synchronously after `SkpHost::close_dataset`, as item 2 (c) allows.
  - No src-tauri test calls `commands::close_dataset`.
  - The shell has no reopen path yet.
  - The one future dependant is P4's E-SECOND and E-CRASH-UNLOCK: a second process trying the lock right after a close must poll or tolerate `open_elsewhere` briefly. Name this in P4's form.
- `release_ended` is poison-tolerant (`unwrap_or_else(into_inner)`), so the thread has no panic path.
- `std::thread::spawn` itself panics if the OS cannot create a thread (note N1).

## 3. ADV-2026-11-19-23 item 7
No other caller reaches `Projects::save`. Grep of `\.save\(` across `kernel/src`, `frontends/shell/src-tauri/src` and `protocol` finds one product caller, `Projects::save_project` (mod.rs:425). The tests also call it directly (K-O17 (b), K-O26, K-O28).

In any case, `save` now checks the catalog and the live session itself, under `saved`. So a direct caller of a released open is refused too. K-O28 shows it for both arms, closed and ended. I mutated each check and each turned red (§5).

## 4. The doc words
I checked them with `<S>/g339r-fences.mjs`. It joins the comment lines and counts the fences from the filed ruling at origin/main.
- **ADV-28's fences:**
  - Fence 1 is in commands.rs exactly once.
  - Fence 2 (Old) is in store.rs 0 times at H and once at B.
  - Fence 3 (New) is in store.rs once, preceded by `at a first save (P3a), ` and followed by ` The seam`.
  - Fence 4 is in commands.rs once, as `serialize ` + fence + ` — docs/02`, so it sits right after `serialize` with one space.
- **Amendment 43 item 6's three surviving texts:** each appears once in mod.rs and once in the form. Its fourth text (D4) is superseded by fence 1.
- **The worker's clauses, checked against the code at H:**
  - `release_ended` doc. Each clause holds: what it drops (the `retain` over `catalog.get().is_some() && require_live().is_ok()`); its two callers (:730, commands.rs:140); the order (:246–249); that a save in progress ends first (the mutex); and the `record_step` window (it linearizes at `require_live`, skp.rs:1683). "Until then the lock is held, after `close_dataset` has replied" holds, subject to N2.
  - `save` doc bullet. True: the check comes before `FolderRequired`, under `saved`, as `SaveFailure::Open`.
  - Lock-order comment. True (§1).
  - `close_dataset` doc. "Started on a thread of its own, which this command does not wait for" is true. "Whatever its result" is true when `Projects` is `Some`. With `None` there is no lock to free. "It may first wait for a save in flight" is true. "A reopen in this process is not affected, since `open_project` runs `release_ended` itself" is true (:730). "A reopen from another process ... is refused as already open" is true (`LockRefused::Held` → `OpenElsewhere`). "For as long as that save takes": see N2, to the advisor.
  - The `SaveFailure::Open` doc, the `LineageRefused` docs, the `Display` texts, the `lineage_file` link sentence and step 3 of `open_project`: each is true. The link test is `symlink_metadata(..).is_ok_and(|m| m.is_symlink())`, the same predicate as `check_inside`'s.
  - The K-O26 doc, mutation 2: true. I reproduced it.
  - The K-O17 (b) and K-O28 docs: true.

## 5. The tests
- **Baseline at H, in a hold** (log `g339r-base.log`, cached build, rc 0): no_generation 9, project_lock_crash 2, project_reopen 43, project_save 23, project_save_skp 6, project_store 5, session_history 13. The new tests K-O26, K-O17 (b), K-O28, L8 and L9 are each listed `ok`, and K-O4 is `ok`.
- **The mutations I reproduced.** Each was applied with one anchored `sed`, run in a hold, and restored with `git checkout -- kernel/src/project/mod.rs`. Every restore was followed by `git diff --quiet` rc 0 and an empty porcelain.

| Mutation | Test run | Result |
|---|---|---|
| K-O26 #2: `:251` → `saved.retain(\|s\| open(&s.dataset) && false);` | `--exact a_reopen_after_a_session_end_in_the_same_process_takes_the_lock` | rc 101. Panicked at project_reopen.rs:1901:5, `the control: Ok(Opened(...))`. Matches the prediction of Amendment 46 item 1 (b). |
| K-O28: `:297` `live.map_err(SaveFailure::Open)?;` → `drop(live);` (both checks) | `--exact a_save_after_the_release_of_a_closed_or_ended_open_is_refused_and_writes_nothing` | rc 101. Failed at project_save.rs:1278:9, `closed: Some(SkpError { code: "skp.unknown_dataset" ...}), Ok(Saved {...` |
| K-O28, live check only: `:296` → `let live = held.map(\|_\| ());` | same | rc 101. Failed at 1278:9 in the `ended` case, `engine.source_changed` against `Ok`. This pins the second arm, which the declared mutation never reaches (N3). |
| Amendment 46 item 4's arm: `:1022` → `SaveFailure::Open(_) => SkpError::unknown_dataset("g339r-mutated"),` | `--lib` plus the 7 focused targets | rc 0, every target green (lib 193 passed, 1 ignored). **The not-covered row of item 4 is true.** |

- **Amendment 46 item 2 (d).** "No test of this part reaches `close_dataset`" is true, by grep. "P4's suites are the first to run it" is not exact, see D2.

## 6. Scope
- **`pub` items added:** `Projects::release_ended`, `SaveFailure::Open`, `LineageRefused::Unreadable` and `LineageRefused::ThroughLink`. These match Amendment 44 item 7 (item 7 (c)'s three, plus `SaveFailure::Open`).
  - Product callers: `release_ended` ← `close_dataset` (commands.rs:140) and `open_project` (mod.rs:730). `SaveFailure::Open` ← `save` (built) and `skp_error_of` (consumed).
  - The two `LineageRefused` variants are pre-committed producers (Amendment 43 item 12), whose consumer is P3b-2's `lineage` mapping, gated by F-W1 and W-1. The exemption needs the PR body and PLAN.yaml to name that consumer (D1).
- **Files and regions:**
  - The 7 files equal item 7 (a) plus Amendment 46 item 3 (b).
  - store.rs and no_generation are comment lines only.
  - The test files are appended at the end.
  - commands.rs's hunks are the module doc, `close_dataset` and the D4 sentence.
  - No existing test is edited.
- **Lock files:** `git diff --quiet B...ff6bd07c -- Cargo.lock frontends/shell/src-tauri/Cargo.lock frontends/shell/package-lock.json` gave rc 0.
- **Counts,** by §2.11's command over `B...ff6bd07c`, with the excludes set to the form's present path, both columns:

| Group | Count | Ceiling (Amendment 46 item 6) |
|---|---|---|
| kernel product | 90 (mod.rs 49+9, store.rs 5+4, session_history.rs 16+7) | 95 |
| kernel tests | 234 | 240 |
| src-tauri | **27 (20+7)** | **25, over by 2: class 8** |
| total | 351, 7 files | 360 |

  Over `B...H` the code groups are the same, and 764 more lines come only from main's records, since B is an ancestor of d3522d77.

## 7. Clippy at H, in holds
- **Root workspace** (`cargo clippy --locked -p spatial-kernel -p spatial-skp --all-targets`, log `g339r-clippy-root.log`): rc 0. Its warnings are only in kernel/src/bin/publish-bundle.rs, kernel/src/lib.rs (2), kernel/src/permission/boundary.rs, kernel/src/publish/mod.rs, kernel/src/skp.rs, engine/src/app_dirs.rs and renderer/src/{canonical,style}.rs. None is in a changed file.
- **src-tauri** (`cargo clippy --locked --all-targets`, log `g339r-clippy-tauri.log`): rc 0, 3 warnings.
  - commands.rs:344 and :596, `too_many_arguments` on `binding_publish_prepare` and `binding_publish_prepare_e2e_destination`. These are outside the part's hunks (@@ 14, 117, 133, 139, 172) and are the two that ADV-2026-11-19-28 item 5 keeps.
  - publish.rs:359, which is unchanged.
- No finding.

## 8. Runs
See the end of the report.

## Findings

**Correctness:** none.

**Evidence:** none blocking.
- The E-SAVE run of Amendment 43 item 16 is not yet filed. The PR body holds the draft until it is, and it belongs in the closing amendment.

**Documentation (must-fix before the merge):**
- **D1.** Amendment 43 item 17 and R2 ask the PR body and the node's plan summary to name item 12's P3b-1 producers and consumers. The PR body does not. A grep of PLAN.yaml line 5756 at origin/main finds no P3B-1 producers entry. The rows to add:
  - `LineageRefused::Unreadable` and `ThroughLink` → P3b-2's `lineage` mapping (L8, L9; `v0-open_project-opened-lineage`; W-1);
  - `Projects::release_ended` → the shipped `close_dataset` and `open_project` (K-O17 (b), K-O26; E-SECOND and E-CRASH-UNLOCK in P4);
  - `SaveFailure::Open` → `skp_error_of` (K-O28 reaches the producer; the arm is not covered).
- **D2.** Amendment 46 item 2 (d) and the PR body say "P4's suites are the first to run it". The shipped `App.tsx:1579` calls `closeDataset` whenever a dataset is replaced, and `e2e/selection.mjs` E-ASK asserts a `close_dataset` row (:676). So existing suites, and this part's E-SAVE run if it closes a dataset, already run the hand-off. None of them asserts that the lock is released. Correct it in the closing amendment by reference, class 3: P4's suites are the first to assert the hand-off's effect. Amendment 46 stays unedited.
- **D3.** The closing amendment carries the src-tauri class 8 row, 27 of 25, in both columns. §7 is not edited.

**Notes:**
- **N1, to the advisor (ruled code, not reworded).** `std::thread::spawn` panics if the OS cannot create a thread, and here that panic would be on the main thread inside a sync command. Ordinary use does not reach it, since it needs the OS to fail thread creation. ADV-2026-11-19-28 item 2 (a) named `std::thread::spawn`. An option: `std::thread::Builder::new().spawn(..)`, ignoring an `Err`, after which the lock frees at the next reopen or close.
- **N2, to the advisor, unreworded, not blocking.** The `close_dataset` doc says "for as long as that save takes", and the `release_ended` doc says "until then". Two cases fall outside those words, both needing timing inside one request; I name them for the source comment:
  - (a) the spawned thread has not yet run;
  - (b) `saved` is one unfair `Mutex` for all opens, so a second save request of any open can take it before the release thread does.
- **N3.** K-O28's declared mutation fails at the `closed` case and never reaches `ended`. I observed the `ended` arm by a separate mutation (§5). The closing amendment may record both runs.
- **N4, for P3b-2's form.** `open_project` pushes its entry (:816) after `open_under`. A `close_dataset` of the new handle that lands between them leaves that entry and its lock until the next `release_ended`. This needs timing inside one request.

## Runs reused and reproduced
- **Reproduced at H (code-identical to ff6bd07c):**
  - the focused kernel targets (§5);
  - kernel `--lib`, run under the arm mutation: 193 passed, 1 ignored;
  - K-O26 mutation 2; K-O28's mutation; the live-check mutation; the arm mutation;
  - both clippy runs;
  - `cargo fmt --all --check` (root) rc 0 and `cargo fmt --check` (src-tauri) rc 0.
- **Reused from the worker at ff6bd07c:**
  - the src-tauri `cargo test --locked` (78 passed);
  - `cargo test -p spatial-skp` (61 passed, at 4bffa2b7; no protocol file changed after it);
  - the skp_* kernel targets;
  - the K-O26 #1, K-O17 (b), L8 and L9 mutations.

**Holds.** There were six, each `-Project <m>` with `-What "1c P3b-1 gate: ..."`. Each printed `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (...)` and then `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`. There was no exit code from 96 to 99, no MACHINE_WAITING and no MACHINE_ERROR. The worktree ends clean at 70335c37, and no process I started is still running.

Logs and the script are in <S>/, each named `g339r-*`: g339r-base.log, g339r-mut-ko26-2.log, g339r-mut-ko28.log, g339r-mut-ko28-live.log, g339r-mut-arm.log, g339r-clippy-root.log, g339r-clippy-tauri.log and g339r-fences.mjs.

Model, as the harness reports it: Opus 5.5 (claude-opus-5-5).
