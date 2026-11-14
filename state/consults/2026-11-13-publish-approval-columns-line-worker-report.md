*Custodian's filing note (2026-11-13): the publish approval worker's report, from its second hand-back (12063 bytes, sha256 544df8fd22d3be149c49cb5f14514efb60ea6b9992ba7726387a6973c518ac8f), below the rule; a final newline is added and nothing else is changed. The run after the correction (`state/consults/2026-11-13-publish-approval-columns-line-where-check-4-stop-worker-report.md`), 14:19:47Z to 15:35:33Z by its transcript: 161 calls (Bash 93, Edit 39, Read 22, Write 6, the hand-back), 17 of them inside a shared hold, model claude-sonnet-5-5; the push in a call of its own (its call 175). Seven of its calls errored and the report names none of them: six Edit calls refused by the harness because the file had not yet been read in the run (calls 48, 54, 55, 81, 86, 113), each followed by a read and the same edit; and call 176, its last check, which exited 1 at its port check, whose output is a count of 0 listening (the head, the remote and an empty porcelain before it). The clock times in its exe table are local time, UTC+1, as its file listing printed them: build 4's 16:18:53 is after the run's last call. At about 15:06Z the harness flagged the run for removing a security test. Read from its transcript, the flagged edit is M-U1 as the form's section 4 names it, applied in call 83 and reverted in call 88, with the diff empty, and no test was removed. The custodian opened PR #314 as a draft from the branch it pushed.*

---

Built: publish-approval-columns-line at b6924acea0ee757f679551442d09d1353b595d3b

**Start state and base**
- Worktree `C:/dev/wt/pac`, branch `cut/publish-approval-columns-line`, HEAD d5598e2a46df486f2b53fe396922a5c368940261 (the base), porcelain empty. `ls-remote` for the branch returned nothing.
- `df`: C: 16G free, D: 201G free.
- `npm ci` in `renderer/bundle-viewer` returned rc=0, and in `frontends/shell` rc=0.
- The form's sha256 is eab6207e6be6e56dadea9a760b1cbf681df847dcce740247a3e404ff901d2d4c, as stated. Its last commit is f14e1bc8, so no amendment sits below Amendment 1.
- Resource paths, shown again before every exe build:
  - `renderer/bundle-viewer/dist/` holds `NOTICE.txt` (163998), `app.js` (333011) and `index.html` (6463).
  - `renderer/bundle-viewer/viewer-asset-hashes.json` is 261 bytes.
  - `frontends/shell/src/generated/NOTICE.txt` is 3506979 bytes.

**Disclosures about the run**
- Where check 4 first found all three resources absent, because they are gitignored build outputs. I stopped and reported that. The custodian then corrected the order and I went on from S0, with S1 run as (a) `npm run verify`, (b) the resource check, (c) the exe build, (d) cargo test, (e) one publish run.
- I made one stray `python3` call (a heredoc with no code). It opened an empty interactive session, exited at once and touched nothing.

**S0**
- `diff --name-only origin/main...<b>` (origin/main is still d5598e2a):

| Branch | Files changed |
|---|---|
| `origin/cut/b1-shell-half-pr-b` (6649a443) | 16 files, all under `frontends/shell/src/` (App, canvas, feature, streaming, workspace). None is one of §7's eleven paths. |
| `origin/cut/verify-bundle-example-path-build-dir-layout` (4261bcec) | `kernel/README.md`, `kernel/tests/built_targets/mod.rs`, `kernel/tests/scale_pass.rs`, `kernel/tests/verify_bundle.rs` |
| `cut/pan-anchor-setcam-waits-for-its-own-reset` (local, 624b2e68) | `frontends/shell/e2e/pan-anchor.mjs` |
| `origin/cut/port-2-macos-l1-and-app-dirs` (83d2ecef) | 15 files under `.github/`, `engine/`, `kernel/`, `scripts/plan/`, plus `KNOWN-LIMITATIONS.md`. None is one of the eleven paths. |

- `gh pr list --state open` returned only #313 (`cut/verify-bundle-example-path-build-dir-layout`), already diffed above. None of the diffs names one of §7's eleven paths or `protocol/`.
- `diff --name-only c3b4899c d5598e2a` over the eleven paths names `frontends/shell/MANUAL-WALKTHROUGH.md` and `frontends/shell/e2e/README.md`. I re-derived each pin of the form into them (class 3, no form changed):
  - MANUAL-WALKTHROUGH `:332` (G3) **moved** to `:333`. Its whole-line sha256 687a5de6… is unchanged. The hash at `:332` at the base is f7cf995b…, which is a different line.
  - MANUAL-WALKTHROUGH `:397` (APPROVED') **moved** to `:398`. Its whole-line sha256 43ff6ba2… is unchanged. The base's `:397` hashes to 4f5474a0… (a different line).
  - README `:169-218` is **not moved**: its sha256 is 9af29102… at both commits, and the sole change is an insert at `:841`.
  - README `:189-201` is **not moved**: its sha256 is c5aab127… at both commits.
  - The cause is one inserted line at `:167` of MANUAL-WALKTHROUGH, which shifted both of its pins by +1.

**Harness files**
- All nine files match the sizes and sha256 values you gave; I read each whole and changed none.
- Fixture `target/fixtures/manual-walkthrough/filter-zoned.parquet` is 409872 bytes, sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46. It was identical before and after each of the three runs (`s1base`, `e1head`, `me1`).

**Exe builds and the exe each run used** (each build was its own shared hold, all rc=0)

| Build | Built at | Exe mtime / size | Served |
|---|---|---|---|
| 1 | base | 15:40:09, 91542016 B | `s1base` |
| 2 | S4 head (1d45189b) | 16:12:39, 91543040 B | `e1head` |
| 3 | M-E1 applied | 16:15:44, 91543040 B | `me1` |
| 4 | after the M-E1 revert, at 8524ce76 | 16:18:53, 91543040 B | no run |

Build 4's Rust matches the head (b6924ace changes no Rust); I rebuilt because the brief asks for a rebuild after the M-E1 revert.

**S1 at the base**
- `npm run verify`: 112 test files and 1458 tests passed.
- cargo test: lib 73 passed.
- Publish run `s1base`: rc=0. OPEN, APPROVED', REFUSED' and FILTERED' PASS; EXPIRED' is the suite's own SKIP.

**Commits** (each by `git add` of named files and `git commit -s -F`)
- S2 `08ac45cca949b2b321fcb5136b890549282539f7`, `feat: the publish approval names the columns a bundle publishes`.
  - Files: `publish.rs` (+125), `types.ts`, `PublishDialog.tsx`, `PublishDialog.test.ts`, `PublishPanel.test.ts`, `App.selection.test.tsx`, `App.command.test.tsx`. The last was named by tsc, which §7 allows.
  - Contents: the field and its doc, `compose_published_columns` with a one-line directive pin in its comment, the `prompt_stub` fill, the dialog `<dd className="publish-dialog-columns">`, U1 to U3, D3, and the fills.
  - Checks: cargo test lib 76 passed; `npm run verify` 112 files and 1459 tests passed; `tsc --noEmit` and `cargo fmt --check` clean.
- R1 `090e18a5ce42c57d4340cdf13ed2bc768fecc552`, `test: record the mutations observed against the columns line tests`. It adds four RECORDED MUTATION lines (`publish.rs`, `PublishDialog.test.ts`). Checks: fmt clean and the dialog test file passes (20 of 20).
- S4 `1d45189bd0e4e68dcb1416fc8e553f49bfe76b6e`, `test: the publish e2e asserts the columns line and the two-entry schema`. It adds E1 in `publish.mjs` and the README passage; `node --check` passed.
- R2 `8524ce76f97511d525139c3053443e9372fec7cd`, `test: record the mutation observed against the e2e columns assertion`. It adds the M-E1 RECORDED MUTATION line in `publish.mjs`; `node --check` passed.
- S5 `b6924acea0ee757f679551442d09d1353b595d3b`, `docs: the walkthrough and ADR-024 record the publish approval's columns line`. It touches MANUAL-WALKTHROUGH (G3 row and APPROVED' row) and ADR-024.
- The message files carry no sign-off line of mine and no email address. The `Signed-off-by` line in the commits is the one `-s` adds.

**Runs**
- `e1head` (publish.mjs at S4 head, rc=0): OPEN PASS; APPROVED' PASS in 2144 ms (it includes E1); REFUSED' PASS; EXPIRED' the suite's own SKIP; FILTERED' PASS. P-head-2 holds.
- `me1` (M-E1 applied, rc=1): APPROVED' FAIL at the `published_columns` assertion, as predicted. The rest of the suite did not alter.
- Diff after each revert was empty.
- The audit logs were fresh files `pac-s1base.audit.jsonl`, `pac-e1head.audit.jsonl` and `pac-me1.audit.jsonl` in the scratchpad.

**Mutations** (each applied alone, observed at 08ac45cc, reverted with `git diff` empty)
- M-U1 (`if attributes.is_empty()` to `if true`): U1 failed at its first `assert_eq!` (`publish.rs:1942`). Left was "Columns published: id and the geometry only." and right was "Columns published: id, the geometry, and zone.".
- M-U2 (`if false`): U2 failed at its `assert_eq!` (`publish.rs:1989`). Left was "Columns published: id, the geometry, and ." and right was "Columns published: id and the geometry only.".
- M-U3 (names sorted before the join): U3 failed at its `assert_eq!` (`publish.rs:2002` in the mutated file). Left was "Columns published: id, the geometry, and a, b, c." and right was "Columns published: id, the geometry, and b, a, c.".
- M-D3 (the new `<dd>` and its comment deleted): D3 failed with `AssertionError: expected -1 to be greater than 887` at `PublishDialog.test.ts:223`, its first `toBeGreaterThan`.
- M-E1: observed in the e2e itself at 1d45189b (run `me1`, above). The failing line was: APPROVED': published_columns is "Columns published: id, the geometry, and .", expected the no-attributes line.
- No `verify-mutation` run was used.

**S6**
- cargo test at the head: lib 76 passed, 0 failed.
- `npm run verify` at the head: 112 files and 1459 tests passed.
- `node --test` over the plan, hooks and evidence globs: 598 passed, 0 failed.
- `verify-cites` PASS, `verify-test-claims` PASS, `verify.mjs --offline` PASS (PR-merged and release-published checks skipped).
- `verify-quotes` PASS (156 checked, 0 hash-reference errors, 0 ruling-cite errors).
- Counting command: `git diff --numstat d5598e2a...HEAD` over §7's eleven paths. Each line is the file's insertions plus deletions against its ceiling:
  - `publish.rs` 128 of 140
  - `types.ts` 4 of 10
  - `PublishDialog.tsx` 2 of 10
  - `PublishDialog.test.ts` 9 of 25
  - `PublishPanel.test.ts` 1 of 3
  - `App.selection.test.tsx` 2 of 3
  - `App.command.test.tsx` 2 of 3
  - `publish.mjs` 12 of 40
  - `e2e/README.md` 8 of 8
  - `MANUAL-WALKTHROUGH.md` 4 of 8
  - ADR-024 4 of 8
  - Totals: 11 files of 11, 176 lines of 258. No overrun.

**Added that the form does not name, and departures**
- Commits R1 and R2 are extra to the brief's S2, S4 and S5. A RECORDED MUTATION line needs the commit id it was observed at, so it cannot sit in the commit that holds the test (no amend). The earlier piece's practice was the same: tests first, the lines in a later commit.
- The ADR-024 append is a script output of `## Appended note, 2026-11-13`, a blank line, then the block taken from the form at `date -u +%F`. I added the heading per §2.3's heading pattern. I did not add the italic provenance line the 2026-11-06 note carries. The script is `pac-s5-adr-append.mjs` in the scratchpad.
- The ADR's last 12 lines before and after, and the script's output, are in the run log. The script printed `appended 363 bytes; date 2026-11-13`.
- The governance `node --test` run used CI's three globs (plan, hooks, evidence), a superset of the two the brief names.
- `verify-quotes --show-cites` scoped to `publish.rs` exits 1 on one line that exists unchanged at the base: `publish.rs:935` (the base's `:909`), the "phases only, no percentages…" quote. The unscoped run, which is what CI uses, passes. The cite I added (`publish.rs:315` to the directive's line 20) shows `[hash: PASS]`.
- A first `git commit -F` with a message-file name that did not exist (S5) failed with output suppressed; nothing was committed by it.
- I ran `cargo fmt --check` and `tsc --noEmit` outside a hold; both are small checks.
- The walkthrough G3 text is mine, from the built code (columns line after Row scope, no label, W-N with G1's literal style). Nothing else was added beyond the files above.

**Harness disclosure**
- The port-5400 harness under item 1 of the 2026-10-11 approval was used: a debug exe built with the TAURI_CONFIG overlay (CDP 9223, localhost:5180 mapped to 127.0.0.1:5400), Vite on 5400 with `--strictPort`, and the npx shim on PATH for those runs only.
- It wrote to the scratchpad folder, `D:/wt-targets/pac` and `C:/dev/wt/pac/target/e2e-publish-out/` (the suite's own, gitignored). No tracked file changed for it.
- The two npm installs and the two `npm run verify` builds wrote the gitignored `dist/`, `node_modules/`, `viewer-asset-hashes.json` and `src/generated/` folders in the worktree.
- After each suite the app-down script reported "port 9223 free" and "port 5400 free"; the final check of ports 9223 and 5400 also found nothing listening.

**Hold lines** (`also=` elided; each ended `MACHINE_RELEASED`, shell bash.exe:N)
- `npm run verify` at base: 16992
- exe build at base: 28936
- cargo test at base: 81796
- publish run `s1base`: 73720
- cargo test at S2: reported only as completed rc=0
- the M-U1 to M-U3 runs, the S4-head exe build and publish run `e1head`, the M-E1 exe build and `me1`, the post-revert rebuild, the head cargo test and `npm run verify`, and `verify-quotes`: each its own `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF`, no refusal, no 96 to 99 code.

**Push**
- A separate call: `git -C C:/dev/wt/pac push -u origin cut/publish-approval-columns-line`.
- `ls-remote` shows origin's branch at b6924acea0ee757f679551442d09d1353b595d3b, equal to HEAD, and the porcelain is empty.
- No PR was opened and I did not wait for CI.

**Background shells left:** none; every background command finished before this report and I killed nothing.

**Model as the harness reports it:** claude-sonnet-5-5 (Sonnet 5.5).
