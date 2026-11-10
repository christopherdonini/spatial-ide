*Custodian's filing note (2026-11-10): the P1 worker's report, from its hand-back (sha256 97ec78c5f71acefe5101837870152c15d2f038c3ac096f5fbc626c4db6e1eec5, 7189 bytes, 2026-11-10T21:09:34Z), byte for byte below the rule. Its brief, brief-p1.md (8797 bytes, sha256 9b4b2b6ca418615a17181f45c2849d9fc6297e00d61e21767677f2dc8ae80fe8). The run 2026-11-10T20:06:51Z to 2026-11-10T21:09:34Z by its transcript, 60 calls, model claude-sonnet-5-5. Checked by the custodian at 65b5e79f: the branch on origin at 7eb5aa71de4891718af82fffb8e7bbd2e90e0984, its parents 4761ded8df7fd3206cec84b21ceaec4fc8ce9338 and e57d75e191ea35fe44c3a26887d73b82f4b53262, 17 files differing from e57d75e191ea35fe44c3a26887d73b82f4b53262; the three clippy warnings it names sit on lines main wrote, not the branch.*

---

Built: b2-piece-1c-save-and-reopen P1 at 7eb5aa71de4891718af82fffb8e7bbd2e90e0984

One thing differs from what your brief expected: clippy shows 3 warnings in 2 of the branch's 17 files. They are on lines the branch did not write, so I pushed. Details under "Departures".

**Start state and M**
- Worktree `C:/dev/wt/b2c`: HEAD, and origin's branch from `git ls-remote`, were both 4761ded8df7fd3206cec84b21ceaec4fc8ce9338. The porcelain was empty.
- The form read from the main checkout: sha256 2a6b6852a482914b0cfe153583f5f64ff0fcbf05a610b78d144f972615d3e717, main checkout HEAD e57d75e1.
- `git fetch origin` exit 0. M = `git rev-parse origin/main` = e57d75e191ea35fe44c3a26887d73b82f4b53262. The merge base with HEAD is 43a39222ebe6fbe1352c2268ef54521921028b66.

**Item 1's list**
- `git diff --name-only 43a39222...HEAD` gave 17 files:
  - docs/adr/ADR-022-style-v0-as-the-single-style-model.md
  - docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md
  - kernel/src/dataset_ref.rs, kernel/src/lib.rs
  - kernel/src/project/file.rs, mod.rs, resolver.rs, store.rs, strict_json.rs
  - kernel/src/session_history.rs
  - kernel/tests/no_generation_in_persisted_artifacts.rs, project_save.rs, project_save_crash.rs
  - renderer/src/canonical.rs
  - spikes/b2-1c-onedrive-probe/Cargo.toml, README.md, src/main.rs
- `git diff --name-only 43a39222 M -- <those 17>` printed nothing, so main changed none of them. Main changed 959 files overall since 43a39222.

**The merge**
- Message file checked before the merge: one `@`, on the first trailer line; no Signed-off-by; it ends with the two given lines.
- `git merge --no-ff --signoff -F <msgfile> M` exited 0 with no conflict. No `-s` option was used.
- Merge commit 7eb5aa71de4891718af82fffb8e7bbd2e90e0984. Parents: 4761ded8df7fd3206cec84b21ceaec4fc8ce9338 and e57d75e191ea35fe44c3a26887d73b82f4b53262.
- `--signoff` appended the git-config Signed-off-by line.
- `git diff --name-only M HEAD` equals exactly the 17 files, so the merge holds only main's changes. No Cargo.lock or package-lock.json differs from M or from 4761ded8. No file under `protocol/` or `frontends/` is among the branch's files, so I1, I3, I6 and I7 are not triggered.
- `cargo fmt --all --check`: exit 0, empty log.
- `cargo clippy --all-targets --locked`: exit 0, 0 errors, 8 distinct warnings (renderer lib 2, kernel lib 5, publish-bundle 1; the log's duplicates are test-profile repeats).
  - 3 of the 8 sit in 2 of the branch's 17 files: `kernel/src/lib.rs` lines 415 and 490 (`type_complexity`), and `renderer/src/canonical.rs` line 303 (`manual_range_contains`).
  - `git diff -U0 M HEAD` shows the branch's hunks in `kernel/src/lib.rs` are only lines 18 and 81. In `canonical.rs` they are lines 42-51, 170-222 and 464-523.
  - `git blame` puts all three warned lines in main commits (d400a475f, 5721a5231), and the same text is in M.
- `cargo test --locked --features spatial-engine/fixture`: exit 0. Summed over all 120 `test result` lines: 1058 passed, 0 failed, 66 ignored (O1 had 993, 0, 57; main's new tests add 65 and 9).

**Item 5, counting**
- I ran §2.11's command over `M...HEAD` and over `43a39222...4761ded8`. Both listed the same 17 files, line for line, and both output files have the same sha256 (c761ec650b14b24bf707059e3fdc942459614b1fc5af80ad375cb9c7572d11d5).
- Added/deleted per file:

| File | Added | Deleted |
|---|---|---|
| ADR-022 | 3 | 0 |
| ADR-036 | 42 | 0 |
| dataset_ref.rs | 145 | 10 |
| kernel lib.rs | 3 | 2 |
| project/file.rs | 830 | 0 |
| project/mod.rs | 411 | 0 |
| project/resolver.rs | 119 | 0 |
| project/store.rs | 282 | 0 |
| project/strict_json.rs | 460 | 0 |
| session_history.rs | 449 | 47 |
| no_generation_in_persisted_artifacts.rs | 118 | 4 |
| project_save.rs | 768 | 0 |
| project_save_crash.rs | 93 | 0 |
| canonical.rs | 123 | 0 |
| probe Cargo.toml | 8 | 0 |
| probe README.md | 19 | 0 |
| probe src/main.rs | 117 | 0 |

**Item 6, literal sites**
- `git grep -n -F 'skp/0.12'` at the merge commit: 177 lines in 69 files. Nothing was changed.
- Code and tests, with line counts per file:
  - `frontends/shell/src/skp/types.ts` 4, with the constant at line 15
  - `frontends/shell/src/skp/client.test.ts` 4
  - `frontends/shell/src/skp/client.ts` 1 (comment)
  - `frontends/shell/src/admission/admitDataset.test.ts` 4, at lines 85, 93, 145 and 167
  - `frontends/shell/src/console/surfaceRegistry.ts` 1 (comment, line 78)
  - `frontends/shell/src-tauri/src/commands.rs` 1 (doc comment, line 8)
  - `protocol/skp/src/v0/mod.rs` 3, with the constant at line 115
  - `protocol/skp/src/v0/commands.rs` 2 and `error.rs` 1 (comments)
  - `protocol/skp/SKP-V0.md` 10
  - `protocol/skp/tests/fixtures.rs` 3, including the `assert_eq!` at line 519
  - `protocol/skp/tests/conformance/README.md` 3 and `AMBIGUITIES.md` 1
- Fixtures: 66 lines in the conformance and `tests/data` JSON files. By file: `refusals-any-layer.json` 24, `refusals-at-deserialize.json` 17, `requests-accept.json` 15, and ten `tests/data/v0-*-request*.json` files with 1 each.
- The remaining 27 lines are in `governance/`, `state/` and `site/` records (including `governance/PLAN.yaml`, the 1c form and `CUSTODIAN-QUEUE.json`).
- Raw output: `<S>/b2c-p1-sites.txt`.

**Departures from the brief**
- The clippy finding above: the brief expected no warning in the 17 files. All three are on lines the branch did not write. Clippy exit is 0 and no stop rule names this, so I pushed. Say if you want it treated as a stop.
- I added `echo cmd-rc=$rc` to the hold shape so each command's exit code is printed. Nothing else in the shape changed.
- The merge commit's Signed-off-by line carries the git-config account email, as `--signoff` writes it; the message file has none.

**Hold lines** (`also=` elided; all granted at the first request, none refused)
- fmt: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:62112 (commands started from now on inherit it; release when done)`
- clippy (13 min 23 s): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:416 (...)`
- test: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:79128 (...)`, run about 20:20 to 21:08 UTC
- The test hold ran longer than its 40-minute estimate; `lod_tier_builder` and `source_observation` are CPU-heavy in debug. No timing-sensitive failure was seen.
- Each hold was released with `MACHINE_RELEASED ... affinity=FF (cores 0-7)`.

**The push**
- `git push origin cut/b2-piece-1c-save-and-reopen`, in its own call: 4761ded8..7eb5aa71.
- `git ls-remote` shows origin's branch at 7eb5aa71de4891718af82fffb8e7bbd2e90e0984, equal to HEAD. `git status --porcelain` is empty.
- No PR was opened and no CI was waited on.

**Background shells**
- Four: the clippy and test runs, and my bounded wait loops, which I launched in the foreground and the harness moved to the background.
- All completed and exited on their own. A Get-Process check for anything running from `D:/wt-targets/b2c` found nothing. Nothing was killed.

**Model**
- Sonnet 5.5, claude-sonnet-5-5, per the harness.
- The 17-file list, numstat files, sites, fmt, clippy and test logs are in `<S>` under `b2c-p1-*`.
