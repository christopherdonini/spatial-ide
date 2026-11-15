Reviewed: PR #307 at 791e7e9edb52328b7c430012c9a3a5e1105de8a2 (the custodian's filing note, 2026-11-11: gate 1, attempt 1, the reviewer, beside the architect, PLAN node b2-piece-1c-save-and-reopen, step 1; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #307 at 791e7e9edb52328b7c430012c9a3a5e1105de8a2 (base e3fb4a97), gate 1, reviewer
Verdict: FAIL

The gate fails on two Correctness findings. All 50 mutations were killed at their named tests and every hash matches. Six Documentation findings must be fixed before the merge.

## Correctness (blocking)

**C1. A second open of the same file puts its save's `saved-here` mark in the first project's record, and the reply says `written`.**
- **What happens:**
  - Open file F, record a step, save into folder 1. This is project A, and the session record moves to A.
  - Close F, open F again, record a step, save into folder 2. This is a first save, because `saved` is keyed by the new catalog name, so it mints project B.
  - `adopt_project` returns early because A already holds the record. `mark_saved_here` then appends B's mark to A's record, whose header names A.
  - B's reply is `history_mark: "written"`. B has no session record of its own. A's record carries a mark that no save of A made, and a recovery of A offers it.
- **Requirement:**
  - ADR-036 Amendment 1 item 5 (at 791e7e9e) says: "At a project's first save, the session's history moves to the project's record". For B, nothing moves.
  - `HistoryMarkState::Written` claims the mark is B's, which is not true.
- **Evidence (git show at 791e7e9e):**
  - `kernel/src/session_history.rs`:
    - lines 280-282: `if rec.project.is_some() { return Ok(()); }`
    - lines 302-327: the mark is appended to the record `find` returns, whichever project holds it.
    - lines 413-416: `find` matches only on `r.path == ds.path() && same_claims(...)`.
    - line 246: `records.push` is the only insertion. Records are removed only by `end_session` (line 330).
  - A `git grep 'recorder\.'` over kernel/src and src-tauri finds no recorder call at `close_dataset`.
  - `kernel/src/project/mod.rs` lines 238-246 mint a new identity when no saved entry has this catalog name.
  - Not disclosed: a grep of the form for reopen, history, mark and "same file" finds nothing.
  - No test opens one file twice.
- **Closure:**
  - A decided behaviour, recorded in the form. For example: a first save whose record another project holds starts the history anew under the new project, or withholds the mark with a named reason.
  - One real-shape kernel test through `Projects::save_project`: open F, record a step, save to folder 1, close, open F, record a step, save to folder 2. Assert B's `history_mark`, and assert that A's record bytes are unchanged.

**C2. `pub const OPEN_LOCK` has no caller.**
- **Requirement:** the caller rule, as §8 item 9 carries it. No `pub` item in the diff may lack a product caller.
- **Evidence:**
  - `kernel/src/project/store.rs:41` @ 791e7e9e reads `pub const OPEN_LOCK: &str = "open.lock";`.
  - `git grep -n -E 'OPEN_LOCK|open\.lock' 791e7e9e` finds that line as the only code hit. Every other hit is in docs, forms and reports, which place `open.lock` in step 2.
  - No amendment pre-commits it.
- **Closure:** remove it from step 1 (step 2 adds it with its caller), or have the human pre-commit it with its consumer and gate named.

## Evidence

None. Every mutation I ran was killed at its predicted test (check 5). Every recomputable hash matches (check 6).

## Documentation (must fix before the merge; none of these is the human's wording)

**D1. The `HistoryMarkState` doc comment and SKP-V0.md §11.2 leave out the no-step case.**
- Current text, `protocol/skp/src/v0/commands.rs:741-743` @ 791e7e9e: "`withheld` says only that the recorded steps do not reach the saved workspace, or that the history could not take the line."
- The code also gives `withheld` for `SavedHere::NoStep` (mod.rs `history()`, the mapping `NoStep → Withheld(NoStepRecorded)`). It also gives it when `adopt_project` fails, which is a move, not a line.
- Replacement for commands.rs:
  > Whether the session history took the `saved-here` mark. The project file was written in both cases; `withheld` says that the history holds no recorded step for the dataset, that the recorded steps do not reach the saved workspace, or that the history could not take its moves.
- Replacement for `protocol/skp/SKP-V0.md:1338` @ 791e7e9e:
  > - **`history_mark`** says whether the session history took the `saved-here` mark. The project file was written in both cases. `withheld` means the history holds no recorded step for the dataset, the recorded steps do not reach the saved workspace, or the history could not take its moves.
- Clause check:
  - "no recorded step": `mark_saved_here` returns `NoStep` when `find` finds no record or `last_step` is `None` (session_history.rs 309-314).
  - "do not reach": `Differs` (315-317).
  - "could not take its moves": the `Err` from `adopt_project` or from the append is mapped to `HistoryUnwritable` (mod.rs `history()`).
  - "written in both cases": `history()` runs only after `replace`.
- These words hold only once C1 is fixed. Until then, `written` can name a mark written to another project's record.

**D2. The "every binding-command call site" sentence in `console/recorder.ts` is no longer true.** This is custodian flag 3.
- The sentence is at `frontends/shell/src/console/recorder.ts:353-357` @ 791e7e9e. The file is not in the diff, but this diff makes the sentence untrue.
- `project/saveProject.ts:27` invokes `binding_pick_project_folder` and never calls `recordNamed`. It is the only binding call site that doesn't (git grep over `invoke("…")` and `recordNamed`). `surfaceRegistry.ts` still gains a class-B row for that binding.
- Preferred closure is a code change: move `pickProjectFolder` into `skp/dialog.ts` beside `pickFile`, which `soleCaptureSite.test.ts` already allows, and record its class-B name.
- Otherwise, replace "every binding-command call site (`streaming/dataPlaneClient.ts`, `diagnostics/log.ts`, `skp/dialog.ts`, `skp/crsCatalog.ts`, `publish/client.ts`)" with:
  > every binding-command call site but one (`streaming/dataPlaneClient.ts`, `diagnostics/log.ts`, `skp/dialog.ts`, `skp/crsCatalog.ts`, `publish/client.ts`; `project/saveProject.ts`'s `binding_pick_project_folder` is not recorded)
- Clause check: the five named files call `recordNamed`, and saveProject.ts imports only `invoke`, the codec, the types and the style document (git grep, Read).
- I grade this non-blocking: §2.8 requires only the class-A rows, and Amendment 16 item 5 leaves the grade to the reviewer.

**D3. The `"not-asked"` doc in `frontends/shell/src/e2e-test-surface.ts:185-186` @ 791e7e9e leaves out the no-view case.**
- The text lists "(the open had a confirmed save, a save was in flight, or no dataset was drawn)". The saver also returns `NO_VIEW_NOTICE` before it asks for a folder (saveProject.ts:98).
- Replacement:
  > (the open had a confirmed save, a save was in flight, the canvas had no view, or no dataset was drawn)
- Clause check: saveProject.ts lines 95, 98 and 101.
- This is a dev-only hook, so it is not operator-visible.

**D4. Two test names give counts that are now wrong** (worker text; Amendments 11 item 3 and 12 left them for R1, and R1 did not fix them).
- `frontends/shell/src/layout/actionRegistry.test.ts:132` @ 791e7e9e says "holds exactly the twelve ids…". It now asserts 13: SH-7's failure shows the expected array as `'command.focus', …(12)`. Replacement name:
  > holds exactly the thirteen ids: the eight of milestone 2; for milestone 3, command.focus, dataset.open, layer.revealExport and filter.addClause (question round 66, item 2; SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, UC8); and project.save (B2 piece 1c)
- `frontends/shell/src/console/surfaceCompleteness.test.ts` @ 791e7e9e: line 205 says "…are exactly the six named commands", and the `describe` at line 198 says "class A: the six SKP commands". `expectedSix` now holds 7 names. Replace "six" with "seven" in both names and in the comments at lines 23 and 111.
- If any record cites the old names, R1 has to keep those cites resolving.

**D5. The from_bytes pre-commitment is recorded only in the form.**
- The round 8 exemption needs the PR body and PLAN.yaml to name the consumer. Neither names `KnownFolders::from_bytes`'s consumer:
  - `gh pr view 307`'s body names only `recover`'s step 3 consumer.
  - PLAN.yaml line 5705 says the item "is the custodian's to settle before step 1's PR opens".
- Closure: name step 2's reopen under M1 (Amendment 16 item 1), and its gate, in both. See also H1.

**D6. KNOWN-LIMITATIONS item 62's comment promises pins that no piece is placed to add.** This is custodian flag 4.
- The comment says the pins "follow on main after the merge", and no piece is placed for that.
- Replacement for that clause:
  > so they are named in words, with no hash; no piece is yet placed to pin them on main after the merge.
- Every other clause of item 62 is true. Its line spans are unchanged between 88a35355 and 791e7e9e (`git diff --quiet` rc=0 over those files).

## Notes (non-blocking)

- `getrandom::fill(...).expect(...)` in `mint_identity` and `stage`. The same pattern is on main at dataset_ref.rs:95 and session_history.rs:325 @ e3fb4a97, so this is precedent.
- The success notices use the `canvas-refusal` slot with role=alert.
- `e2e/project.mjs` hardcodes FIXTURE to the main checkout's target path.
- `remove_stale_temps` could remove a temp file that another live process is still writing.
- If `absolute()` fails at a first save, the folder fallback is refused only at folders.json.
- Three conformance fixtures have no final LF. They had none at base either.
- `frontends/shell/src-tauri` is excluded from the workspace, so check 8 does not reach it. Shell CI covers it.

## Checks

1. **Scope:** `git diff --name-only` and the §2.11 counting command with B: 73 files and 7249 lines, identical to the packet. By group (lines / ceiling):

   | Group | Lines | Ceiling |
   |---|---|---|
   | adr | 45 | 80 |
   | e2e | 444 | 320 |
   | fixtures, protocol tests and literal | 539 | 390 |
   | kernel product | 3206 | 1350 |
   | kernel tests | 1547 | 1000 |
   | probe | 144 | 150 |
   | protocol product | 407 | 320 |
   | records | 49 | 120 |
   | renderer | 123 | 200 |
   | shell product | 307 | 380 |
   | shell tests | 372 | 380 |
   | src-tauri | 66 | 100 |

   Every file falls in a group. The overruns are class 8, recorded, not a finding.
2. **Locks and manifests:** the four lockfile diffs are empty. `frontends/shell/package.json` gains one `"e2e:project"` script line. `spikes/b2-1c-onedrive-probe/Cargo.toml` has no `[dependencies]` and its own `[workspace]`. Nothing goes to the human as a red line.
3. **§8, item by item:**
   - Items 1-8, 10, 11 and 13-15 are clean. `cfg(windows)` appears only in tests and the spike. serde_json is used only on control and record files, never on feature data. No undo or performance-number wording. Hashes go through the renderer's canonical module.
   - Item 9 fails: C2 (`OPEN_LOCK`), and `from_bytes` (D5 and H1).
   - Item 12 is clean: class 8 is recorded, the class 9 additions are declared, no verify-mutation run is cited as an observation, and the pins are at main commits.
4. **Seams, traced by function name at H:**
   - `handleSaveProject` → `projectSaver.save` → client `saveProject` `call("save_project",{skp,dataset,folder,workspace})` → src-tauri `save_project` (`spawn_blocking`) → `Projects::save_project` → `workspace_of` → `save` → `write_project` (renderer canonical `to_line_oriented_string`) → `replace` → `history()`. The shapes match at each step.
   - The real-shape tests are K-S1 (project_save.rs) and P-S1 (project_save_skp.rs).
   - The C1 seam is where this chain breaks.
5. **Mutations, by me** (script `1c-g1r-mut.js`, in four shared holds):
   - **Baseline:** all 50 named tests pass unmutated ("1 passed" each), rc 0.
   - **Per mutation:** the old text occurs exactly once, the edit is made, `git diff` is shown, the test's own command runs, the failing line is byte-copied, then `git checkout -- <file>` and an empty porcelain.
   - **The 50:** U-L1, U-R1 to U-R7, U-V1, U-V2, U-C1, U-I1, K-S1 to K-S13, N6, G3, O1-withheld, O1-nofolder, W-P1, W-F1, P2-roundtrip, P2-version, U-W1, K-W1 to K-W3, P-U1, P-U2, P-S1 to P-S3, SH-1 to SH-5, V-C1, SH-7, SH-8.
   - **Results:** all 50 killed. Rust ones gave rc=101 with `<expected test> ... FAILED` (an awk check of the expected test against the FAILED line: 20/20 and 22/22, 0 mismatches). Shell ones gave rc=1 with ` FAIL  <file> > … > <expected name>`. Porcelain was `[]` after every revert. Logs: `1c-g1r-mut-run1.log`, `-run2.log`, `-run3.log`.
   - **Sample failing lines:**
     - K-S2: "assertion `left == right` failed: kept after the first save"
     - K-S13: "folders.json: Os { code: 2, kind: NotFound, …"
     - SH-1: "AssertionError: the picker once, then the save twice: …"
   - **K-S7** fails by the test's own designed guard, "the save returned within 60 s: Timeout". That is the predicted failure, not timing noise.
   - **Departures:**
     - **K-S5:** the form's wording ("absolute path written as `at`") does nothing for outside data, as O1 disclosed. I used the report's clause mutation instead (it adds a disabled clause holding `ds.path()`), and it was killed: "the file names the data's path".
     - **K-S1:** inserts a string literal holding a real LF. The Bash tool collapses `\n`, and that LF is semantically `"\n"`.
   - E-SAVE's three mutations are the tester's and I did not run them.
6. **Hashes:**
   - The form's 238 pins, recomputed by `1c-g1r-pins.js`: ok=238, mismatch=0, unresolved=0. All pin revs (858092e3, ad921f55, e57d75e1, e6dfe624) are on main.
   - The directive file's sha256 matches.
   - The form's per-version hashes match their versions.
   - `filter-zoned.parquet`: 409872 bytes, sha256 92ed800c…, matches.
   - All 10 brief hashes and all 9 report-body hashes match.
   - Not recomputable, each disclosed in its note or held outside the repository:
     - p4-stop e2ea4c63, whose path its note replaced with `<S>`
     - O0's 9d7d5243
     - F1's 1428198f
     - the hand-back shas
     - p5-stop's draft 68efec10
7. **Records and strings, clause by clause:**
   - Item 62 is true except the clause in D6.
   - Part AD is true: the Layers button shows while a dataset is admitted, Ctrl+K `/save`, picker title S2, the notices, the member order, and the second click asks for no folder.
   - kernel/README.md's changed lines are true: test names, constants, ADR-036 Accepted.
   - The e2e README entry and the project.mjs header are true.
   - The added doc comments: D1 and D3 are untrue; D2 and D4 are pre-existing text this diff made untrue. The others I checked are true.
8. **Clippy:**
   - The brief's command gave rc=101, stopping at `spatial-renderer`.
   - Its two errors are `renderer\src\canonical.rs:303:20` (`manual_range_contains`) and `renderer\src\style.rs:10:5` (doc list item). Line 303 is not an added line (the added hunks are +42,10, +170,53 and +464,60), and style.rs is not in the diff.
   - Because of those errors the kernel was never linted, so I ran a warn-only pass (`--message-format=short`, no `-D warnings`): rc 0. It found 8 distinct diagnostics, 0 of them on added lines (`1c-g1r-clipmap.js`).
9. **fmt:** `cargo fmt --all -- --check` rc 0, empty output.
10. **Governance checks** at 791e7e9e, run from the worktree root:
    - verify-cites rc 0: "verify:cites PASS … across 2847 file(s)"
    - verify-test-claims rc 0: "verify:test-claims PASS — all 790 claimed test(s)…"
    - verify.mjs --offline rc 0: "verify:plan PASS"
    - verify-quotes, in a hold, rc 0: "verify:quotes PASS — 155 checked, 124 verified … 0 ruling-cite errors."
11. **Bytes:** the 7021 added lines contain 0 CR and 0 tab. Three fixtures have no final LF, as at base (see Notes).
12. **Reports, sampled against the code:**
    - P2/P3: `key_present` is generic; there is no save_project request fixture in tests/data; the lazy save arrow is real.
    - O1: `copy_under` does `try_lock`, then sync, then rename.
    - R1: its from_bytes and item 62 claims are true.
    - P4-stop: "no way to forget a dataset's saved entry" is true, and it is the root of C1.
    - No untrue claim found.
13. **CI** (read 2026-11-11T14:54:14Z): `gh pr checks 307` shows all 17 checks passing. All 11 runs report headSha 791e7e9e, conclusion success:
    - Product CI — Rust workspace: 43032298227, 43035874908
    - Rust fmt: 43035874907
    - Governance CI: 43032298127, 43035874898
    - DCO: 43035874965
    - Exposure scan: 43035875330
    - Ported notices: 43032298139, 43035875104
    - Product CI — shell: 43032298323, 43035875081
14. **Porcelain afterwards:** `git -C C:/dev/wt/b2c status --porcelain --untracked-files=no` is 0 bytes, rc 0. HEAD is 791e7e9edb52328b7c430012c9a3a5e1105de8a2.

## For the human

- **H1.** Amendment 16 item 1, written by the custodian, pre-commits `KnownFolders::from_bytes` to step 2. The round 8 exemption covers "a producer pre-committed by the human". Does a custodian amendment count? If not, from_bytes is a caller-rule failure (Correctness). Its closure would be `pub(crate)` with the test moved in-crate, or moving it to step 2.
- **H2.** C1 needs a product decision: what a second open of one file in one run does at its first save.

## The packet's gaps

- It did not list the exact mutation set to observe again; I built it from §4 and the amendments.
- The counting command's exclusion still names the form's old path under `kernel/`. This is harmless, because the form is not in the diff.
- It did not mention `OPEN_LOCK`.
- It gave no location in the PR body or PLAN for from_bytes's consumer.
- It did not say that the brief's clippy command stops at main's renderer errors before reaching this PR's crates.

## Disclosure

During the pin check, one call wrote a 196-byte scratch file outside the scratch folder, in the system temp directory. I removed it at once (rm rc 0, confirmed gone). Nothing tracked was written.

## Hold lines (this project only; `also=` elided)

| Run | MACHINE_HOLD | MACHINE_RELEASED |
|---|---|---|
| baseline | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:72892 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:72892 affinity=FF (cores 0-7) |
| batch 1 | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:35216 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:35216 affinity=FF (cores 0-7) |
| batch 2 | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:47164 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:47164 affinity=FF (cores 0-7) |
| batch 3 | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:81280 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:81280 affinity=FF (cores 0-7) |
| clippy | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:53880 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:53880 affinity=FF (cores 0-7) |
| clippy warn-only | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:67832 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:67832 affinity=FF (cores 0-7) |
| fmt | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:56564 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:56564 affinity=FF (cores 0-7) |
| verify-quotes | MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:10032 also=<elided> (commands started from now on inherit it; release when done) | MACHINE_RELEASED project=SpatialIDE shell=bash.exe:10032 affinity=FF (cores 0-7) |

No hold was refused, and no exit code from 96 to 99 appeared. D: had 194G free.

## Background shells left

None. Every background task I started (eight hold runs and two wait loops) reported completed. `ps -ef` at 2026-11-11T15:17:48Z shows no node, cargo, vitest or sleep process. I killed nothing.

## Model

Opus 5.5 (claude-opus-5-5)
