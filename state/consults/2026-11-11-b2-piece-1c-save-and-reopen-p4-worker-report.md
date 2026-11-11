*Custodian's filing note (2026-11-11): the worker's report on P4 of piece 1c's step 1, from its second P4 brief, given by file (10580 bytes, sha256 fb5fd22f8dc644305d15566f7d357e745a9b6b8a7149551a5709dfcaa070aebb). Dispatched at 08:47:15Z by its transcript; the hand-back came at 09:47:07Z (claude-sonnet-5-5; unique calls from that dispatch: Read 5, Bash 33, Edit 6, Write 2, the hand-back, 47 in all). Two calls errored: a Read whose input did not parse, and a foreground sleep the harness refused. The report below was extracted by script from the hand-back in that transcript (7421 bytes, sha256 c7865aaa5eaf057288671b4c095554a481d4ca44c14a007e5d0b53aa0b5eda5b) and is unchanged; one final newline is added. The custodian checked by script: the commit's two files and its parent, 41c32190; its one sign-off, git's own; the worktree and origin's branch at 2dcbd3bc, the porcelain empty; the counting command at B = e57d75e1 recomputed, 53 files and 6072 lines, the src-tauri group at 43; the test totals summed from its logs, 1070 passed, 0 failed and 66 ignored in the workspace and 75 passed in src-tauri; its push in a call of its own. Its line cites are into the branch at 2dcbd3bc.*

---

Built: b2-piece-1c-save-and-reopen P4 at 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5

**Start state (shown before any edit)**
- `git -C C:/dev/wt/b2c rev-parse HEAD` printed 41c32190b81eff94afeff54ba18c184789b23092.
- `git ls-remote origin refs/heads/cut/b2-piece-1c-save-and-reopen` printed the same id.
- The porcelain was empty.
- The form on main has sha256 5352204280a7b5625a150c1d530ae7c167ad514225b0e3e9930d0162c795ccd5 and still ends at Amendment 9. Amendment 10 was not on main when I read it, so I built against `amend10-1c-draft.md` (items 2 and 3).

**The commit**
- Full id: 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5. Subject: `feat: the shell binding's save_project command and the kernel's Projects in its managed state`.
- Files: `frontends/shell/src-tauri/src/commands.rs` (+26 -2) and `frontends/shell/src-tauri/src/lib.rs` (+14 -1). Nothing else.
- Content:
  - `commands::save_project` is an SKP command on `spawn_blocking`. It decodes `SaveProjectRequest`, calls `Projects::save_project` and returns `SaveProjectResponse` or `SkpError`. A panic maps to `SkpError::protocol("save_project_panicked", ..)`, as `record_step` does. It is listed in the handler list.
  - In `lib.rs`, the recorder is built once. `Projects::new(root, recorder)` is built from `store::projects_root()` and that same recorder. It is managed as `Option<Arc<Projects>>`, and the recorder is still managed as `Option<Arc<StepRecorder>>`.
  - If either is absent, the state is `None` and `save_project` returns `SkpError::project_file_unwritable("no per-user data directory is available")`.
  - `close_dataset` is unchanged. The module doc line listing the SKP commands now names `save_project`.
- Checks, run in one shared hold through `b2c-p4b-run.sh c1`:
  - `cargo fmt --check` in the workspace: rc=0.
  - `cargo clippy --all-targets --locked` in the workspace: rc=0, with 8 distinct warnings. These are kernel lib 5, the `publish-bundle` bin 1 and renderer lib 2, the same 8 as P3. None are in a line P4 writes.
  - `cargo test --locked --features spatial-engine/fixture` in the workspace: rc=0, with 1070 passed, 0 failed, 66 ignored (summed over the log's `test result` lines). This is the same as P3.
  - `cargo fmt --check` in `frontends/shell/src-tauri`: rc=0.
  - `cargo clippy --all-targets --locked` in `src-tauri`: rc=0, with 3 warnings. They are at `src\commands.rs:309` and `:561` (too many arguments) and `src\publish.rs:332` (large size difference). All were there before P4. `save_project` sits at lines 161-175, so none are in a line I wrote.
  - `cargo test --locked` in `src-tauri`: rc=0, with 73 passed in the lib, 0 in `main`, 2 passed in `tests/sole_caller_scan.rs` and 0 in doc tests. No failures and no ignored tests.
  - `npm run verify` in `frontends/shell`: rc=0, with vitest "Test Files 109 passed (109)" and "Tests 1447 passed (1447)", and the node tests 5 and 7 passed, 0 failed.
  - No lockfile changed. The porcelain was clean after the checks.
- Commit message: the file has an `@` only in its first trailer line (shown with grep), no Signed-off-by line (`-s` added it), no email, and no ruling, round or directive named.

**New tests and mutations**
- P4 adds no test. §4's step 1 table names none in these files, and no test file was edited, including the completeness test. So there is no mutation to observe.
- I could not unit-test the new command's wiring without a Tauri mock app, which would need a `tauri` feature change in `Cargo.toml` (I6).

**Counting command**
- Command: `git diff --numstat e57d75e191ea35fe44c3a26887d73b82f4b53262...HEAD -- . ':!kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.md' ':!CUSTODIAN-QUEUE.json' ':!site' ':!docs/README.md' ':!Cargo.lock' ':!frontends/shell/src-tauri/Cargo.lock' ':!frontends/shell/package-lock.json'`, at HEAD 2dcbd3bc. Its output is in `b2c-p4b-numstat.txt` in my scratch folder.
- The command printed 53 files with 5,859 added and 213 deleted, a total of 6,072 lines. At P3 the step stood at 6,029 lines and 51 files, and P4 adds 43 lines (26+2 and 14+1) in 2 files. Against the ceilings of ≤ 4,790 lines and ≤ 77 files, the step is over on lines and within on files. This overrun was already recorded as class 8 in Amendment 9; I trimmed nothing.
- Groups. The split of the protocol test, fixture and literal files follows my P3 split, since §2.11 does not make one:

| Group | Lines | Files | Ceiling |
| --- | --- | --- | --- |
| src-tauri | 43 | 2 | 100 |
| shell product (non-test `frontends/shell/src/`) | 0 | 0 | 380 |
| protocol product | 407 | 4 | 320 |
| fixtures and protocol tests | 467 | 14 | 260 |
| version literals | 90 | 14 | 130 lines, 30 files |
| kernel product | 3,206 | 8 | 1,350 |
| kernel tests | 1,547 | 5 | 1,000 |
| probe (`spikes/b2-1c-onedrive-probe`) | 144 | 3 | 150 |
| ADR text (docs) | 45 | 2 | 80 |
| renderer (`renderer/src/canonical.rs`) | 123 | 1 | 200 |

- The three shell files in the numstat are the literal edits from P2: `admission/admitDataset.test.ts`, `skp/client.test.ts` and `skp/types.ts`, 18 lines. They count in the literal group. P4 edits nothing under `frontends/shell/src/`.
- Which groups are over: protocol product, fixtures, kernel product and kernel tests, as Amendment 9 recorded. All of those are unchanged by P4, and P4 raises only the src-tauri group.

**Not named in the form (disclosed)**
- The refusal for an absent recorder or data directory uses `project_file_unwritable`, `save_project`'s own documented code, with the same detail text `record_step` uses (`no per-user data directory is available`). The brief said to handle the absent case "the same way" as the recorder, and did not name the code.
- The `save_project_panicked` protocol error name, by the pattern of `record_step_panicked`.
- The `lib.rs` comment is written from the built code. The recorder is now bound to a `let` first so that both managed values share it.

**Departures from the brief**
- None. I did not merge main. `close_dataset` is untouched. No `binding_pick_project_folder` and no class-B row were added. No file under `frontends/shell/src/` was edited.

**Hold lines (`also=` elided)**
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:18972` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:18972 affinity=FF (cores 0-7)` for the cargo run. The hold was 45 minutes, `-What "b2-piece-1c P4: cargo fmt clippy test, workspace and src-tauri"`. The run took about 55 minutes: the machine was shared, and src-tauri's clippy alone was 10m 39s.
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:57372` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:57372 affinity=FF (cores 0-7)` for `npm run verify`.
- No script exit code was in 96 to 99.

**Push**
- A call of its own with only `git -C C:/dev/wt/b2c push origin cut/b2-piece-1c-save-and-reopen`. It printed `41c32190..2dcbd3bc  cut/b2-piece-1c-save-and-reopen -> cut/b2-piece-1c-save-and-reopen`.
- After it, `git rev-parse HEAD` and `git ls-remote origin refs/heads/cut/b2-piece-1c-save-and-reopen` both printed 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5, and the porcelain was empty.
- I opened no PR and did not wait for CI.

**Background shells**
- None left. The three background calls (the cargo hold, the verify hold, and my own bounded wait loops) all exited. I killed nothing.

**Model:** Sonnet 5.5 (`claude-sonnet-5-5`).
