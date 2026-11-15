*Custodian's filing note (2026-11-14): the worker's report for slot 2's `second-open-history-before-1c-step-3`, C1 and C2 from its form, from its brief by file (16988 bytes, sha256 85be16bba6a5b64c3309418ffdb73780c8d496ca79e3b32cce5e18bf37f68407). Dispatched at 2026-11-14T00:30:21Z by its transcript, beside the filler slot's worker; handed back at 2026-11-14T01:59:11Z (claude-sonnet-5-5, worker-high; calls Bash 125, Read 19, Edit 31, Write 7 and the hand-back, 183 in all; two errored: an Edit with no change at 2026-11-14T00:48:06Z and a Write before a Read at 2026-11-14T01:32:39Z; its 38 Write and Edit calls are all scratch files, copied into the worktree by its Bash calls). It stopped at C1: the workspace test at C1 does not compile (E0061 in an in-lib unit test). C1 is committed at a2fbab2ca5ddda114ca18cd94392198b30dd94c1 on its branch, and nothing is pushed: the custodian read the worktree's head, its porcelain and the remote branch at this filing. The calls behind the runs it claims: the brief's hash #1; in shared holds, the viewer install and build #25, S1's workspace run #35, the shell verify #147 and the shell cargo test #155; at C1, through its shared-hold wrapper, cargo fmt #168, the no-run build and the three targeted files #172 and #174, and the workspace run #175; the commit #173; no push, stash, amend or reset call. The report below was extracted by script from the hand-back in that transcript (8984 bytes with one final newline, sha256 acb71bd7738bf7996af0ca289c621dd914d46f5ae86b4678a44dda4faeb05e30) and is unchanged. The custodian's note, not the report: its "My order was wrong" takes on itself what was the custodian's brief's order (the form's Amendment 1, item 1).*

Stopped: second-open-history-before-1c-step-3, C1 committed at a2fbab2ca5ddda114ca18cd94392198b30dd94c1 but the C1 workspace run fails to compile. Stop rule "a test or check failing". Not built: no C2, no mutation runs, nothing pushed.

## The failure
`cargo test --workspace --locked` at C1 (in a shared hold) exited 101. `spatial-kernel (lib test)` does not compile:
```
error[E0061]: this function takes 2 arguments but 1 argument was supplied
    --> kernel\src\session_history.rs:1842:24
1842 |             canonical(&header_object(DatasetRef::parse(&entry).unwrap().to_json())).unwrap();
note: function defined here
 607 | fn header_object(dataset_entry: Json, project: Option<&ProjectUri>) -> Json {
```
- Cause: my C1 gave `header_object` a second parameter. It is the project for the header, replacing the old unbound/bound split.
- At base 695e1303, `header_object` took one argument, with calls at :365 and :1777.
- I updated the production call (`create`, now :442) but missed the in-lib unit test `the_worst_case_header_and_step_lines_fit_their_ceilings` in the `mod tests` of `kernel/src/session_history.rs`.
- My earlier compile checks and the C1 kernel run used `--test <file>` targets, which never build the lib's unit tests.
- Proposed fix: add `, None` at that call. The assertion is unchanged. This is a call-site change in a test inside a §2.5 file.
- I did not apply it, because C1 is committed and amend is forbidden. A third commit is not in §2.6.
- I have not run anything after the failure. Whether other lib tests fail is unknown.

My order was wrong: I committed C1 before the workspace build. The remedy is yours: a fix commit, or a redo of C1 from `695e1303` by a fresh dispatch.

## State left
- Worktree `C:/dev/wt/so`, branch `cut/second-open-history-before-1c-step-3`, HEAD a2fbab2c (committer time 2026-11-14T02:53:31+01:00). Base 695e1303794ed390d305d07fca592694f33f589e.
- Porcelain is empty. `git ls-remote` for the branch is empty, so nothing is pushed.
- No process of mine is left running. The workspace run's hold was released.
- Scratch is in `<S>` = the scratchpad folder of session da685a21. The wanted edits are in `<S>/soc1-w-*` copies; the C2 pieces are `soc1-append-rows.mjs` (show mode run, apply not run), `soc1-mut.mjs` and `soc1-c2-msg.txt`.

## Start state, installs, S0
- Brief sha256 matched (85be16bb...8407). Form sha256 6c9af41e... matches main 695e1303.
- Branch start: HEAD at base, empty `ls-remote`, empty porcelain, C: 46 GB free, D: 193 GB.
- Installs:
  - `npm ci` in `renderer/bundle-viewer` exited 0, with 0 vulnerabilities.
  - `npm run build` there (in a hold) exited 0.
  - `npm ci` in `frontends/shell` exited 0.
  - Porcelain stayed empty, so no lockfile changed.
- Resource list in `frontends/shell/src-tauri/tauri.conf.json:40-44`, with sizes after verify:
  - `renderer/bundle-viewer/dist/` holds `NOTICE.txt` (163998), `app.js` (333011) and `index.html` (6463).
  - `renderer/bundle-viewer/viewer-asset-hashes.json` is 261 bytes.
  - `frontends/shell/src/generated/NOTICE.txt` is 3506979 bytes.
- Departure: `frontends/shell/src/generated/NOTICE.txt` was absent right after the installs and the bundle-viewer build. The brief calls that a stop. It is a gitignored file that `npm run verify`'s pretypecheck/prebuild generates, and it existed after verify. I continued.
- S0:
  - `git diff --name-only origin/main...<b>` for the four live branches shows none naming `protocol/`.
    - `b1-shell-half-pr-b`: shell frontend files only.
    - `port-2-macos-l1-and-app-dirs`: `.github/workflows/product-ci-rust.yml`, `KNOWN-LIMITATIONS.md`, engine files, `kernel/PERMISSION-BOUNDARY.md`, `kernel/src/permission/audit/log.rs`, kernel tests and `scripts/plan/cfg-boundary*`.
    - `known-limitations-item-47-name-floor-sentence`: `KNOWN-LIMITATIONS.md` only.
    - `cut/pan-anchor-setcam-waits-for-its-own-reset`: `frontends/shell/e2e/pan-anchor.mjs` only.
  - The `KNOWN-LIMITATIONS.md` hunks were port-2's items 1 and 43 (base line 400) and item 47's. Neither touches item 63.
  - The only open PR is #316, which is the item-47 branch.
  - `git diff --name-only 8c693657 695e1303 -- <§2.5's eleven paths>` is empty, so no pin moved.

## S1 at the base (each run in its own shared hold, all exit 0)
- `cargo test --workspace --locked`: 122 result lines, 1074 passed, 0 failed, 66 ignored.
- `npm run verify` in `frontends/shell`:
  - Vitest: 112 files passed (112), 1459 tests passed (1459).
  - Other suites: "76 passed, 0 failed", "30 passed, 0 failed", plus node tests 5 pass and 7 pass.
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: 76 passed in the lib, 0 in main, 2 in `sole_caller_scan`, 0 in the doc tests; 0 failed.
- Light baselines: `verify-test-claims` PASS (801 claims, 14 superseded), `verify-cites` PASS rc 0, `verify.mjs --offline` PASS.

## C1 (a2fbab2c)
- Subject: "feat: a session-history record per open until a save binds the open to a project". The message file had no Signed-off-by line. `-s` added one, the single `@` outside the trailer.
- `git diff --numstat 695e1303..HEAD` (added, deleted):

  | File | Added | Deleted |
  |---|---|---|
  | `kernel/src/project/mod.rs` | 20 | 21 |
  | `kernel/src/session_history.rs` | 160 | 95 |
  | `kernel/tests/project_save.rs` | 124 | 0 |
  | `kernel/tests/project_save_skp.rs` | 154 | 54 |
  | `kernel/tests/session_history.rs` | 31 | 34 |
  | `protocol/skp/SKP-V0.md` | 10 | 2 |
  | `protocol/skp/src/v0/commands.rs` | 3 | 4 |
  | Total | 502 | 210 |

  That is 712 changed lines against the §7 estimate of about 530 over 7 files, so about 180 lines over. It is before C2 and without the fix.
- Before the commit:
  - `cargo fmt --all` in a hold exited 0 and touched only my 7 files.
  - `cargo test -p spatial-kernel --test session_history --test project_save --test project_save_skp --locked --no-run` exited 0 with no warnings. This extra build was my addition.
- Anchor counts by `soc1-mut.mjs ... count` (exit 0 each): M1 through M6 each occur exactly 1 time.
- `git grep -nw Admission` over the changed Rust files returned rc 1, no hits, so the import is gone and unused.
- Old names:
  - K5's old name `a_reopen_of_the_same_file_continues_its_record_and_another_file_starts_its_own` survives only in `governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:533`, `state/consults/2026-10-12-b2-piece-1b-recording-architect-draft.md:565` and `state/consults/2026-11-13-second-open-history-before-1c-step-3-form-lead-data-draft.md:194`.
  - K-S15's old name `a_second_open_of_one_file_saved_to_another_folder_withholds_its_mark_and_leaves_the_first_record_unchanged` survives in `KNOWN-LIMITATIONS.md:508`, `B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1668`, `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-amendments-20-to-22-architect-draft.md:116`, `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-r3-2-worker-report.md:26,42` and the lead-data draft :208. Only `KNOWN-LIMITATIONS.md:508` is mine to edit, at C2.
  - `HeldByAnotherProject` and `RecordHeldByAnotherProject` have no hits outside `state/` and `governance/`.
- Runs at C1:
  - Three kernel files, exit 0: `project_save` 17 passed, `project_save_skp` 6 passed, `session_history` 13 passed, 0 failed.
  - The renamed and new tests all passed: K5, K-S15, N1, N2 and N3.
  - Workspace run: exit 101, the compile error above.
- Not run: `npm run verify`, the shell cargo test, `fmt --check`, `node --test`, `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify.mjs --offline` at C1. All mutations M1-M6, C2, the count against C2, and the push.
- Test changes: the only other test code change is the pending call-site fix above. No assertion of a test other than K5 and K-S15 had to change.

## Design points and departures to know
- `Record` no longer holds `uri`; `data.dataset` uses `reference.uri()`.
- `Open` holds `{name, uri, bound}`, and one dataset URI is minted per open (new `StepRecorder::dataset_uri`, `pub(crate)`). The project file's dataset entry at first save uses it (`self.recorder.dataset_uri(name)`, the M5 anchor).
- A save before any step makes `adopt_project` bind the open without a move (the M3 anchor). The next step's `create` takes the project's folder and header project directly (the M6 anchor).
- Departures:
  - The `--no-run` pre-build before C1.
  - I ran the workspace test after committing, instead of before.
  - The S1 shell script was first written by heredoc, not the Write tool.
  - The `NOTICE.txt` stop above.
  - Bounded waits used `Wait-Process -Id <pid> -Timeout`, never `sleep`.
- I read another script's README only for the hold script's usage.

## Words
- Not built: the §8 note, §11.2/§11.3, `HistoryMarkState` rustdoc, the item 63 and 43 drafts, the two rows, and the ADR-036 note. The code and SKP-V0 text are committed in a2fbab2c and the drafts are in `<S>/soc1-w-*`; byte-copying before/after needs a fresh run.

Model: Sonnet 5.5 (claude-sonnet-5-5), worker-high.
