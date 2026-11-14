*Custodian's filing note (2026-11-12): R4's worker report for slot 1's b2-piece-1c-save-and-reopen, step 1, under the form's Amendment 26, from its hand-back (9271 bytes, sha256 b6be9fcbf1b11e74bfc974427108ed637e259429e378d08fafe1ee85e72d79da), below the rule. **Two spans are changed:** the run's temporary folder, a user-profile path in the recording suite's failing line, is written `<TEMP>`; and one rooted line reference in the clippy list is written by line in words, since the cite checker reads rooted cites against tracked files. Nothing else is changed, and one final newline is added. Its brief by file (12753 bytes, sha256 55ecf9ce0a8bb74ed412ee0df6bbb245c3e924165c232a4507183edc2e3ae441); the run 01:54:37Z to 03:33:33Z by its transcript, 133 calls (Read 6, Bash 119, Write 3, Grep 1, Edit 2, Monitor 1, the hand-back), two errored (a foreground sleep the harness blocked; a Monitor call, a tool it does not have), 23 shared holds, model claude-sonnet-5-5. Checked by script at this commit: the branch's tip is 708a3d5c38d57c772c66b82e16a4b501e6aca563, seven files from 9e0d4b08. A report, a reading and not Authority. The two e2e failures are the custodian's to read against the gate-1 suites run's settings before any re-run.*

---

Built: b2-piece-1c-save-and-reopen R4 at 708a3d5c38d57c772c66b82e16a4b501e6aca563 (pushed). The words, checks and most suites are green. Two e2e suites failed and were not re-run: recording and table (details under "e2e", with causes).

START STATE (all as given)
- Form sha256 b81b2357…e27 at main 8134f99a. Architect report e566a98a…cb0, reviewer report 68e501ac…871.
- Worktree HEAD, ls-remote and the id 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6 all equal. Porcelain was empty before any edit.
- Disk: C: 20G free, D: 191G free.
- Harness: `sha256sum -c` printed OK for all 7 files. The list file is 609 bytes, sha256 9555fd68…fdb. I read the scripts and the conf whole.

COMMIT
- Subject: `docs: the save's words match the code (gate 1's words)`. Message file shown before commit. No sign-off or email line in it; first trailer line only has the `@`.
- 7 files, +43/-28:

| File | + | - |
|---|---|---|
| KNOWN-LIMITATIONS.md | 3 | 3 |
| frontends/shell/e2e/README.md | 1 | 1 |
| frontends/shell/e2e/project.mjs | 5 | 0 |
| kernel/src/project/mod.rs | 11 | 11 |
| kernel/tests/no_generation_in_persisted_artifacts.rs | 17 | 10 |
| protocol/skp/SKP-V0.md | 2 | 1 |
| protocol/skp/src/v0/error.rs | 4 | 0 |

- Script: `<S>/b2c-r4-words.mjs` (apply, then verify at the commit). New texts come from the reports' bytes. I typed only anchors for old text, and each is checked to be present in a report. Output is in `<S>/b2c-r4-apply.out` and `<S>/b2c-r4-verify.out`.
- Verify printed `ok` for 19 labels and `diff --name-only 9e0d4b08…HEAD` equals the seven files. `WORDS4-OK` was printed (rc 0).
- New-text sha256s, first 12 hex:

| Label | sha256 (first 12) |
|---|---|
| item 63 headline (C-1) | 056546d266d0 |
| item 63 body (C-1) | e56eb6afe075 |
| DOC-C | 46de423e0252 |
| item 63 record_step list entry | 99169ae35ea2 |
| item 63 failed-move sentences | 65e80634f941 |
| D-10 (SKP-V0 and mod.rs doc) | 2d1a96dbd758 |
| D-10 (mod.rs module doc) | 4eca52f8c04b |
| D-11 | 9c23ef9afb2c |
| D-12 | ef561c59b624 |
| D-13 (lines 55-59) | 0765569a96c0 |
| D-13 (795-796) | 6e36bbd81d30 |
| E-1 | f5f1ff70b63d |
| D-14 | b2e02d8ecddd |
| D-15 | 8874f7cb2fb6 |
| DOC-A | caf7f9ed9479 |
| D-16 in SKP-V0 | 693775c16af3 |
| D-16 in error.rs | fb88744b84ea |
| DOC-B | 6327c7fd7054 |

- The whole diff was shown in my run; `git diff 9e0d4b08…HEAD` reproduces it.
- Two changes to a report's words, both as the amendment names them: item 63's C-6 sentences got a capital first letter and the cite became `` `history` in `kernel/src/project/mod.rs` ``, and `StepRecorder::record_step` joined the comment's list in the list's form.

DISCLOSURES (not named by Amendment 26)
- Rust comment edits are re-wrapped at 100 columns from the first touched line to the paragraph end. This reflowed some lines the report's words did not touch (mod.rs module doc line 16-17; the test header lines 10-12 and 795-799).
- DOC-B: I added a `//` separator line before the m-s18 entry, as the other entries have.
- D-16's error.rs comment is wrapped at 100 as a `//` comment above the `///` block.
- mod.rs line 215 still reads "the first save's record move". D-10 names only mod.rs lines 16 and 233-234, so I left it.
- The failed-move sentences sit right after the code list, before "The test is…". The amendment did not give a spot.
- I ran the first apply with a wrong headline anchor, which produced `****` in `KNOWN-LIMITATIONS.md`. I reverted with `git checkout -- .` before staging and re-ran. Nothing was staged or committed with it.

CHECKS (outputs in `<S>/b2c-r4-*.out`)
- `git diff --check 9e0d4b08…HEAD`: rc 0.
- `profile-path-scan --staged`: rc 0 ("clean"). `git diff --cached --check`: rc 0.
- verify-cites: rc 0, PASS, 2847 files. verify-test-claims: rc 0, PASS, 790 claims.

SUITES at 708a3d5c
- `cargo fmt --check`: rc 0.
- `cargo clippy --all-targets --locked` (no `-D`): rc 0. 6 distinct warning sites against R3's 8: publish-bundle.rs:149, lib.rs:415 and :490, boundary.rs:536, publish/mod.rs line 839, skp.rs:277. None is in a file R4 touched.
- `cargo test --locked --features spatial-engine/fixture`: rc 0, 122 result lines, 1073 passed, 0 failed, 66 ignored.
- src-tauri `cargo test --locked`: rc 0, 75 passed, 0 failed.
- `npm run verify` in `frontends/shell`: rc 0. Vitest: 111 files and 1456 tests passed. The trailing node tests: 5/5 and 7/7. No timeout seen. The lockfile is unchanged (porcelain empty).
- `node --test` over scripts/plan, hooks and evidence: rc 0, 598 pass, 0 fail.

EXE
- `bash b2c-e2e-build-exe.sh` (debug build): rc 0.
- Last lines: "Compiling spatial-kernel…", "Finished `dev` profile [unoptimized + debuginfo] target(s) in 1m 42s", "copied exe".
- Exe: 91545088 bytes, mtime 2026-11-12 03:52:27 (+0100).

E2E
Logs are at `<H>/out/b2c-e2e-r4-<suite>.log`. All ran once, port 5400, no `--measure`.
- Suites run, from the README's npm scripts: project, regression, refusal-contract-baseline, admission-remediation, filter, filter-panel, style, publish, console, layout, selection, export-view, recording, command-bar, attributes, table.
- I also ran source-changed (named in the README, no npm script).
- Not run: debug-session (an operator instrument) and residency-harness (a measurement harness).
- Helpers, not suites: lib.mjs, residencyTrace.mjs, s5dVerdict.mjs, tsModuleLoader.mjs, writeMeasureConfigOverlay.mjs, checkDevOriginConsistency.mjs, checkDistClean.mjs, checkOriginEventName.mjs, the `*.test.mjs` files, rustdesk-guard/, source-watch-idle.mjs. pan-anchor.mjs is not in the README and the form says that branch is held, so I did not run it.
- rc 0 and every step PASS (SKIP lines named): project (12 steps, OPEN through NOTICE-S18; rc=0 end 02:53:23Z), regression (17), refusal-contract-baseline (3), admission-remediation (11), filter (3), filter-panel (5), style (6), publish (5, one SKIP: EXPIRED'), console (11, REGRESS' 376830ms), layout (11), selection (19, one SKIP: EXPORT-TODAY), export-view (3 plus "[export-view] 4 PASS, 0 FAIL"), command-bar (14), attributes (PA-E1, PA-E3), source-changed (7, S1 to S5c).
- Each log starts `worktree C:/dev/wt/b2c head 708a3d5c38d57c772c66b82e16a4b501e6aca563 start …`. The step lines are in the logs; I give only prefixes cut at column 64, which are not byte-copied.
- **recording: rc 1.** Steps OPEN, APPLY, STYLE and RESET passed. The failing line begins `[RECORD] FAIL (30528ms): no readable history.jsonl under <TEMP>\spatial-recording-RFb3qi\spatial-ide\sessions (folders: ["unsaved-5c4885abaf4c78923a9f814e03aa4ebf"]); a live lock would read as this`.
  - Likely cause: the default `shim/npx.cmd` returns at once, so the suite's `session.stop()` (which ends the process tree, then reads the file) did not end the app. The app was killed afterward by run-suite's down step ("killed tree 208 / killed tree 45364"). The file is 5043 bytes and readable now.
  - The harness has a waiting variant for this, `SHIMDIR=shim-wait`, which the brief does not mention. I did not use it or re-run: it is not a timing failure, and the brief says not to route around a harness failure. The custodian should decide on a re-run with that variant.
- **table: rc 1.** The failing line begins `[PC-E1] FAIL (1ms): PC-E1: SPATIAL_E2E_FILTER_ZONE_COUNTS is not set. Give the generator's printed zone_counts…`. PC-E2, PC-E3 and PC-E4 passed. This is a missing environment value, not a code result. I did not re-run or supply a value.
- The run-suite down step reported port 9223 and 5400 free after each suite. A final `b2c-e2e-busy.ps1` read printed FREE.

SIZE (§2.11's command, B = e3fb4a97…, H = HEAD; output at `<S>/b2c-r4-numstat.out`)
- Total 7785 lines (+7529, -256), 75 files. The 4,790 ceiling is exceeded, which is class 8 (previous total 7748).
- Groups, with the §2.11 ceiling and my mapping of files to groups (assumption: `<S>/b2c-r4-groups.mjs`): O0 probe 144 (150), ADR 51 (80), renderer 123 (200), protocol product 484 (320, over), fixtures/protocol tests/literal 541 (390, over), kernel product 3241 (1350, over), kernel tests 1766 (1000, over), src-tauri 66 (100), shell product 346 (380), shell tests 458 (380, over), e2e 510 (320, over), records 55 (120).
- R4's own part is small: roughly +15 in the product groups and +11 in the test and e2e groups.

HOLDS (shared, one per heavy call; also= elided)
`MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:75860 also=… (commands started from now on inherit it; release when done)`, then `MACHINE_RELEASED …`. No exit code 96-99 seen.

PUSH
- The push was a single call with no compound. It moved 9e0d4b08..708a3d5c.
- `git ls-remote origin refs/heads/cut/b2-piece-1c-save-and-reopen` → 708a3d5c38d57c772c66b82e16a4b501e6aca563. Porcelain is empty. No PR action.

SELF-CHECK
- Cross-module seams: none touched. R4 changes comments, docs and test text only.
- Completion claims: each rests on a call above.
- User-facing text: item 63 and the doc edits are the gate reports' own words. No new app string.
- Required tests: no new test. The suites were run as above, and the two e2e failures are stated rather than hidden.

BACKGROUND SHELLS: none left running.

MODEL: claude-sonnet-5-5 (Sonnet 5.5). No override. No context handoff received or produced.
