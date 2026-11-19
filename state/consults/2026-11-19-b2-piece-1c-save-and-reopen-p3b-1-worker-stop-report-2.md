*Filed by the custodian: the worker-high's hand-back (claude-opus-5-5), 16661 bytes, sha256 7553721a9a5b211a34d1e2d5f869bb8ff82f8e69dbc5fdf44ca0f02fc33ac7d1, below the rule, byte for byte but for three maskings (two hold-line project values as <m>, one scratch-folder path as <S>), with one final newline added. Calls Read 20, Bash 128, Edit 25, Write 8, SubagentHandback 1, five errored, from 2026-11-19T15:06:16Z to 16:19:55Z by its transcript. The second dispatch of P3b-1, under the 1c form's Amendment 44; it stopped at stop 4 on K-O4's declared mutation, with its branch pushed at 4bffa2b70d69d2d5d187164f4ba670647c9c3fd0, and reports a class 8 overrun. Both go to the advisor.*

---

Built: b2-piece-1c-save-and-reopen P3b-1, worker-high

**Outcome: I stopped at stop 4 (item 15.4) during step 4.** The K-O4 mutation ("`release_ended` drops every entry") did not turn K-O4 red. Everything up to that point is committed and pushed, and every test passes at the head. One more problem: the kernel-tests group is over its ceiling (229 of 220), and the total is 321 of 320, a class 8 overrun. I recorded it and changed nothing.

## Step 0: every place that takes the `saved` mutex (by grep, `<S>/1cp3b1b-step0-grep.txt`; checked again at the head)
- **`Projects::save`** (`kernel/src/project/mod.rs`, the `let mut saved = self.saved.lock()` at the top of `save`).
  - When it is taken, it holds nothing. The caller holds only an `Arc<Dataset>`, not a guard.
  - At the head, under the mutex, it takes and releases the catalog's read lock (`catalog().get`) and then the generations (`require_live`).
  - Then, as at the base, it takes the recorder's state mutex (dataset_uri, adopt/mark).
- **`Projects::open_project`** (the `saved.push` near its end).
  - When it is taken, it holds the open guard (no mutex), the `ProjectLock` file lock, and no catalog or generations guard (`drop(ds)` comes before it).
- **`Projects::release_ended`** (new).
  - When it is taken, it holds nothing. Under it, it takes and releases the catalog read lock and then the generations.

Nothing takes the catalog or the generations before `saved`, so stop 12 does not apply.

## Commits (branch `cut/b2-piece-1c-p3b-1`, base 99cceff700a7d7ba3eaa676dff9e3cf23c587dd1)
- e56782eefb3652136be10c7d40bdc7d7c3e96e7a: test: K-O26, a reopen after a session end in the same process takes the lock (1c P3b-1)
- b7937b39f4d4eb6daefa383288ab2bc801c2ed45: test: K-O17 (b), K-O28, L8 and L9, the lock freed after a close and the lineage reader's two refusals (1c P3b-1)
- 4a982cd6ee155eb75933500f5a80828347067505: test: K-O17 (b) passes its folder once, not wrapped twice (1c P3b-1)
- 4bffa2b70d69d2d5d187164f4ba670647c9c3fd0: feat: free a project's open lock when its open is closed or its session ends, and name a lineage file that is unreadable or a link (1c P3b-1)

**Push:** one push, `git push -u origin cut/b2-piece-1c-p3b-1`, in its own call, rc=0, after the feat commit. The test commits went with it, never alone. The pushed head is 4bffa2b70d69d2d5d187164f4ba670647c9c3fd0, the same as `origin/cut/b2-piece-1c-p3b-1`. No PR was opened.

## P-base (`cargo test --locked -p spatial-kernel --test project_reopen --test project_save`, one hold per commit)
- **At e567...:** rc=101.
  - project_reopen: 40 passed, 1 failed. K-O26 failed by assertion at `opened`: `expected opened: Err(OpenElsewhere(ProjectUri("spatial://project/e58c...")))` (project_reopen.rs:763).
  - project_save did not run, because cargo stops at the first failing target. It is unchanged at this commit.
- **At b793...:** rc=101, a compile failure.
  - The missing symbols: `LineageRefused::Unreadable`, `LineageRefused::ThroughLink`, `Projects::release_ended` (×2), `SaveFailure::Open`.
  - It also had one E0308 of my own making in K-O17 (b) (`Some(Some(..))`).
- **At 4a98...:** rc=101, a compile failure. Only the missing symbols remained:
  - `Unreadable` (project_reopen.rs:1935);
  - `release_ended` (project_save.rs:1235 and 1266);
  - `SaveFailure::Open` (project_save.rs:1277);
  - `ThroughLink` (project_reopen.rs:1960).
- None of the declared tests passed at its base.

## P-head at 4bffa2b7 (all in holds, all passing)
- `cargo test --locked -p spatial-kernel --lib` plus the focused targets: rc=0.
  - lib: 193 passed, 1 ignored.
  - no_generation_in_persisted_artifacts 9, project_lock_crash 2, project_reopen 43, project_save 23, project_save_skp 6, project_store 5, session_history 13.
  - skp_admission 10, skp_admission_remediation 7, skp_cancel_terminal_without_credit 2, skp_filter_cancellation 1, skp_projection 14.
- `cargo test --locked -p spatial-skp`: rc=0, 61 passed in 4 targets.
- **src-tauri `cargo test --locked`:** the first run gave rc=101. The build script found no `renderer/bundle-viewer/dist/*` and no `src/generated/NOTICE.txt`.
  - So I ran `npm ci` in renderer/bundle-viewer, then `npm ci` and then `npm run build` in frontends/shell, each in a hold, all rc=0.
  - The rerun gave rc=0: 4 targets, 78 passed.
- **Clippy, kernel** (`cargo clippy --locked -p spatial-kernel --all-targets`): rc=0. There are warnings only in files I did not change:
  - kernel/src/bin/publish-bundle.rs, kernel/src/lib.rs (2), kernel/src/permission/boundary.rs, kernel/src/publish/mod.rs, kernel/src/skp.rs;
  - engine/src/app_dirs.rs, renderer/src/canonical.rs, renderer/src/style.rs.
- **Clippy, src-tauri** (`--all-targets`): rc=0. It gave 3 warnings:
  - commands.rs:337 and commands.rs:589, `too_many_arguments` (9/7) on `binding_publish_prepare` and `binding_publish_prepare_e2e_destination`;
  - publish.rs:359, `large_enum_variant`.
  - commands.rs is a file I changed, but **I did not fix these two**. The functions are outside my hunks, which `git diff B...HEAD` shows at old lines 112, 120 and 155 only. Editing them would be a region outside item 7 (a) (stop 1). That the warnings already exist at the base rests on the diff, not on a clippy run at the base.
- **fmt:** `cargo fmt --check -p spatial-kernel` rc=0, `cargo fmt --all --check` (the root workspace) rc=0, and src-tauri `cargo fmt --check` rc=0. I ran `cargo fmt -p spatial-kernel` once before the feat commit, and the only changes were in my new lines.

## Mutations at 4bffa2b7 (round-25 rule; one node script, `<S>/1cp3b1b-mutate.mjs`, one hold; logs in `<S>/1cp3b1b-mut-<id>.log`)
| Id | Mutation | Result | Restored, `git diff --quiet` |
|---|---|---|---|
| K-O26 | release removed from `open_project` | FAILED at `opened`: `expected opened: Err(OpenElsewhere(..))` | rc=0 |
| K-O17 (b) | `catalog.get(name).is_some() &&` changed to `is_none() \|\|` | FAILED at the second reply, "the lock is free": left `Some("held")`, right `Some("taken")` | rc=0 |
| L8 | `unreadable` back to `Damaged { line: 0 }` | FAILED: `Refused(Damaged { line: 0, rule: "Access is denied. (os error 5)" })` | rc=0 |
| L9 | link test removed | FAILED: left `Refused(Unreadable { reason: "Access is denied. (os error 5)" })`, right `Refused(ThroughLink)`, the Windows case | rc=0 |
| K-O28 | the two checks under the mutex removed | FAILED at its refusal assertion. The closed case gave `Ok(Saved{..})` where the host said `skp.unknown_dataset` | rc=0 |
| K-O4 | `retain(.. && false)` (drops every entry) | **PASSED, so this is stop 4** | rc=0 |

**Why K-O4 stays green:**
- K-O4 makes each second open through a fresh `run.projects()`, which is `Projects::new(..)` (project_reopen.rs, `fn projects`).
- That instance's `release_ended` clears its own list, which is empty. It never drops the holder's entry, so the lock stays held.
- K-O4 is declared unedited, so the advisor has to rule on the row, for example by moving the row or rewording its mutation.

**Not observed here:** L9's off-Windows case (a symlink read as `Recorded`) cannot be observed on this laptop. None of these is a verify-mutation run.

## Counts (§2.11's command, B=99cceff7, H=4bffa2b7, the excludes set to `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`; this read is from before the stop)
Per file:
- frontends/shell/src-tauri/src/commands.rs: 9 added, 3 removed
- kernel/src/project/mod.rs: 48 added, 9 removed
- kernel/src/session_history.rs: 16 added, 7 removed
- kernel/tests/no_generation_in_persisted_artifacts.rs: 4 added, 2 removed
- kernel/tests/project_reopen.rs: 109 added, 0 removed
- kernel/tests/project_save.rs: 114 added, 0 removed

Per group, against the ceilings:
| Group | Lines | Ceiling | Result |
|---|---|---|---|
| kernel product | 80 | 85 | within |
| kernel tests | 229 | 220 | **over by 9 (class 8)** |
| src-tauri | 12 | 15 | within |
| total | 321 | 320 | **over by 1 (class 8)** |

- Under ADV-2026-11-19-12 item 6, I did not cut or pack anything.
- The lock files: `git diff --quiet B...HEAD -- Cargo.lock frontends/shell/src-tauri/Cargo.lock` gives rc=0.

## `pub` items added (caller grep at the head)
- `kernel/src/project/mod.rs`, `Projects::release_ended`. Its callers are mod.rs:729 (`open_project`) and commands.rs:133 (`close_dataset`), plus the tests.
- `kernel/src/project/mod.rs`, `SaveFailure::Open(SkpError)`. It is built at mod.rs:296 and consumed at mod.rs:1021 (`skp_error_of`).
- `kernel/src/session_history.rs`, `LineageRefused::Unreadable { reason }` and `LineageRefused::ThroughLink`. They are built in `lineage_file` (1785 and 1789) and shown by `Display`.
- No other `pub` item was added.

## Doc sentences and the lock-order comment (byte-copied from the diff)
- **The module doc, the form's words** (item 6):
  > `//! ([`Projects::open_project`]), until that open is closed, or, after its session ends, until this` / `//! process's next reopen or close ([`Projects::release_ended`]); or until [`Projects`] is dropped.`

  The sentence after it was only reflowed.
- **The `_lock` doc** (item 6):
  > It is held for as long as this entry is: until [`Projects::release_ended`] finds its open closed or its session ended, or until [`Projects`] is dropped.
- **The `save` doc clause** (item 6):
  > A first save that replaces it keeps the lock in [`Projects`] until [`Projects::release_ended`] releases it; one refused after the lock frees it.
- **The `save` doc sentence in my words** (Amendment 44 item 3 (d)). It is a new first bullet and rests on the check under the mutex in `save`:
  > - **The open is checked first**, under the `saved` mutex that [`Projects::release_ended`] also takes: the save is refused with the host's own error ([`SaveFailure::Open`]) when the catalog no longer holds the open or its session has ended.
- **The lock-order comment** (in `save`, at the mutex):
  > // The lock order: the `saved` mutex first, then the host's catalog and generations, each taken and released inside it. `release_ended` keeps the same order, and nothing takes the `saved` mutex while it holds the catalog or the generations.

  It rests on step 0's list.
- **The `release_ended` doc in my words.** It rests on its body, its two callers, and the order above:
  > Drop the entry, and with it the identity's open lock, of every open this [`Projects`] saved first or reopened that the catalog no longer holds or whose session has ended (`require_live`). The shell's `close_dataset` calls it after the host has closed the dataset, and [`Projects::open_project`] calls it before it takes a lock. It takes the `saved` mutex before the catalog and the generations, as [`Projects::save`] does, so a save in progress ends before its entry is dropped. A `record_step` that passed its live check before the session ended can still write after this frees the lock, and after another process has taken it.
- **The `SaveFailure::Open` doc**:
  > The catalog no longer holds the open, or its session has ended: the host's own error, found under the `saved` mutex.
- **The `open_project` step 3 doc**:
  > 3. [`Projects::release_ended`], then the identity's open lock, the new identity's after the answer `copy`; then this step's writes: `folders.json`, and for a copy its `project.spatial` with the new identity.
- **The `LineageRefused` docs:**
  - `Damaged`: "Against another rule, at the 1-based `line`." (I removed "; 0 when the file could not be read".)
  - `Unreadable`: "The file could not be opened or read; `reason` is the operating system's error, as text."
  - `ThroughLink`: "A link is at the file's name; it is not followed."
  - The `Display` texts: "it could not be read: {reason}" and "it is a link, which is not followed".
- **The `lineage_file` doc gains:**
  > A link at `path` is refused before any open, by the link test of [`crate::project::resolver::check_inside`].

  The code is `symlink_metadata(path).is_ok_and(|m| m.is_symlink())`, the same test as `check_inside`'s `m.is_symlink()`.
- **commands.rs, D4, the form's words**:
  > `close_dataset` frees the open's project lock: after the host has closed the dataset, it calls [`Projects::release_ended`].
- **commands.rs, `close_dataset`'s doc in my words**:
  > After the host's close, whatever its result, [`Projects::release_ended`] frees the project lock of each open that the catalog no longer holds or whose session has ended.
- **no_generation, the form's words**:
  - "and its `open.lock`, which `store::ProjectLock::try_lock` creates empty and never writes" goes in after "which `Projects::save` writes,". The form's final period is dropped because the sentence goes on with "are named below and are not scanned."
  - It also gains the sentence "`open.lock` (`kernel/src/project/store.rs`, `ProjectLock::try_lock`) is created empty and never written."

## Item 13's "not covered" rows at the head
- **Two live opens bound to one record:** still holds. `release_ended` drops only the `Projects` entry. The ended open stays bound and in the catalog, and `record_step` refuses it through `require_live`.
- **`PathNotUnicode`:** still holds, untouched.
- **A cancel after the engine's open returned (item 9 (b)):** still holds, untouched.
- **New and not covered: `skp_error_of`'s `SaveFailure::Open(e) => e` arm.** No test reaches it.
  - K-O28 calls `save` directly.
  - K-O26's command assertion is refused by `save_project`'s own checks before the mutex.
  - Reaching the arm needs a release between those checks and the mutex, which is timing inside one call.

## Hold lines (masked)
Each hold printed `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (...)` and then `MACHINE_RELEASED project=<m> ... affinity=FF (cores 0-7)`. There were 13 holds:
- P-base ×3;
- the pre-commit check;
- the P-head kernel run;
- the P-head skp, shell and clippy run (rc 202 = 101+101, from the missing build files);
- npm ci in the bundle viewer, npm ci in the shell, npm run build in the shell;
- the shell rerun;
- the mutations.

None of them hit an exit code from 96 to 99, a MACHINE_WAITING or a MACHINE_ERROR.

## Departures, things noticed, and stops
- **Stop 4**, on K-O4's mutation (above).
- **Class 8 overrun:** kernel tests 229 of 220, total 321 of 320.
- **K-O17 (b) failed at its base by missing symbols, not by assertion** as item 7 (b) predicts. Its table row requires the call to `release_ended`.
- **K-O17 (b) reuses K-O17's child.** It spawns `--exact KO17` with `KO17_ROOT` and `KO17_PROJECT`, through a new helper `child_tries_lock`, rather than adding a child branch of its own.
- **An extra test commit, 4a98**, fixes my own type error. Nothing was amended.
- **Noticed, outside my files:**
  - `kernel/src/project/store.rs`'s `ProjectLock` doc still says the lock is "dropped at `close_dataset` and by the session-end forwarder (P3b)". The forwarder does not release it.
  - The commands.rs module doc says "call one `SkpHost`/state method", but `close_dataset` now calls two.
  - `close_dataset` is a sync command. `release_ended` may now wait on the `saved` mutex for an in-flight save, bounded by its IO plus up to 5 renames × 100 ms.
- **P-9's listing (item 20) was not assigned to me.** The `Unreadable` reason is the operating system's error text, not file bytes.
- **Not done, because of the stop:** nothing else stays undone. All the steps had run before the K-O4 observation, which ran last in the script.

## Self-check (the four failure classes)
- **The other module's interface:** I used `SkpHost::catalog`, `generations`, `end_generation`, `close_dataset`, `StepRecorder::host` and `require_live` as they are exposed, and `SkpError` is `PartialEq`.
- **Every claim has evidence:** each one points to a log in `<S>` or a call.
- **User-facing messages:** the new `Display` texts describe the code at 4bffa2b7.
- **Required tests reach their assertions:** each mutated test failed at its named assertion, except K-O4 (stop 4).

**Model:** Opus 5.5 (claude-opus-5-5), with no override. I received one context handoff (the compaction summary) and produced none. No background process of mine is still running: all nine of my background tasks ended, and I killed nothing.

Files: C:/dev/wt/1c-p3b-1/kernel/src/project/mod.rs, C:/dev/wt/1c-p3b-1/kernel/src/session_history.rs, C:/dev/wt/1c-p3b-1/kernel/tests/project_reopen.rs, C:/dev/wt/1c-p3b-1/kernel/tests/project_save.rs, C:/dev/wt/1c-p3b-1/kernel/tests/no_generation_in_persisted_artifacts.rs, C:/dev/wt/1c-p3b-1/frontends/shell/src-tauri/src/commands.rs. Logs: <S>/1cp3b1b-*.
