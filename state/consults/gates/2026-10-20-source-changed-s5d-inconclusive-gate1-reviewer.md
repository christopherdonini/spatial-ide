Reviewed: PR #235 at 0e281e0793e159e8f24d47e3f8d6e9cf2c981045 (base 677ecd12), gate 1, reviewer. Branch and commit: cut/source-changed-s5d-inconclusive @ 0e281e0793e159e8f24d47e3f8d6e9cf2c981045
Verdict: PASS WITH NOTES

## Findings

**Correctness:** none.

**Evidence:** none.

**Documentation (must-fix before the merge):** none.

## Notes for the custodian (not findings)

1. **Two timing failures in shared runs. Under the machine rule they are not recorded as failures, and neither involves this diff.**
   - In my first `npm run verify` (rc 1), `src/notices/noticeDeterminism.test.ts` hit vitest's 30000 ms timeout after 52 s. Its output shows `Blocking waiting for file lock on package cache`, which is cargo contention. Re-run alone in a shared hold: rc 0, 1/1. A second full `npm run verify`: rc 0.
   - In my first governance `node --test` (rc 1, 481/483), the guardian parity subtest PS6 failed: mod `fresh`, Stop hook `not judged`, after 141 s. Re-running `scripts/hooks/guardian-continuity-parity.test.mjs` alone: rc 0, 15/15. A second full run: rc 0, 483/483.
   - Neither file is in the diff. Whether to re-run them alone on the machine is your call.
2. **Suggestion (out of scope, follow-up only).** `readRefusalDetails` (`frontends/shell/e2e/s5dVerdict.mjs:34-41`) pins the count of the two already-ended literals and the one R prefix. It does not pin the total number of `SourceChanged` sites on the mint path. A future kernel detail on that path would therefore read INCONCLUSIVE (C2) and not fail by name.
   - I checked falsification (i) at the head; it does not fire. The mint path has exactly four `SourceChanged` details: `skp.rs:1502`, `skp.rs:1620`, `descriptor.rs:315` (the finding) and `descriptor.rs:334` (R).
   - The other three sites are not mint refusals: `skp.rs:1024` (the pre-admission signal, `open_dataset` only, from :1229 and :1275), `stream.rs:1743` (the post-check) and `lib.rs:531` (a terminal; `onTerminal` never logs a refusal).
   - None of `skp.rs`, `lib.rs`, `descriptor.rs`, `stream.rs` or `tileViewportStreamManager.ts` changed between 245cb051 and the head (`git diff --stat`, rc 0, empty). So the form's clause checks at 245cb051 hold at the head.
3. **Suggestion (out of scope).** The step id `S5d-post-check-route-confirmed` was not changed. It now names a step that can read INCONCLUSIVE. It is not a new sentence (§8 items 3 and 11), so this is noted only.
4. **Not a finding: the README line omits one FAIL case.** The INCONCLUSIVE condition in `frontends/shell/e2e/README.md:243` leaves out the unreadable-line case, which the code classes C3 FAIL (`s5dVerdict.mjs:49`). The shipped app cannot produce that line: `logMintRefused` always writes `<tileKey>: <code> <JSON.stringify(fields)>` (`tileViewportStreamManager.ts:273-281`). D-H names the case. Under the wording-block rule this blocks nothing and needs no new words; it could go in the source comment if you want it recorded.

## Block-on-sight (§8)

1. Clean: the only files are the five in §7 (`git diff --name-only origin/main...HEAD`, rc 0).
2. Clean: nothing under `src/`, `src-tauri/`, `kernel/`, `engine/`, `protocol/` or `renderer/`, and no edit to `lib.mjs`, `exportElapsed.mjs`, `publish.mjs` or `selection.mjs`.
3. Clean: only S5d's body changed. Besides it there are runStep's catch (:832), the results type (:811), the summary width (:1473-1476), the exit line (:1477-1479) and §2.2's declared precondition (:764-767, before the layout).
4. Clean:
   - Only S5d throws `S5dInconclusive` (:1439; caller grep).
   - The exit rule is `anyFail ? 1 : anyInconclusive ? 3 : 0`.
   - Nothing counts INCONCLUSIVE as a pass, and the driver has no consumer of its exit code or report.
5. Clean: no positional reading. M3 kills T2 and T3.
6. Clean: an other-code or unreadable refusal (C3) and an R refusal are checked before C2 (`s5dVerdict.mjs:66-74`). T7 and T6 cover them.
7. Clean: the details are read from source (`s5dVerdict.mjs:29-30, 35-42`). No literal is written into the module.
8. Clean: no new report field, duration, rate or performance word.
9. Clean: the 5 record constants each carry a one-line pin and are byte-equal to their pinned record line. T4 to T7 are §3's four constructions.
10. Clean: M1 to M8 are recorded with full commit 217d6e8e (`s5dVerdict.test.mjs:5-13`). No `verify-mutation` run is called an observation.
11. Clean: no sentence claims a route, a proven post-check, a fixed race or a rate.
12. Clean: no human words are marked verbatim. Amendment 1 resolves to the ruling's item 3, and Amendment 2 item 4 to the booking directive's item 2.
13. Clean: #234's merge commit 45a5a5cd is an ancestor of 71f5ebbb (rc 0). The README changes only line 243.
14. Clean: `S5dInconclusive`, `initRefusalDetails` and `s5dVerdict` are called in the driver. `readRefusalDetails` is called by `initRefusalDetails`.
15. Clean: no line-number cite into `tileViewportStreamManager.ts` in a new or edited comment. D11 and D9 replace the stale ones with names.
16. Clean: Amendment 1 is at 71f5ebbb, the parent of the first code commit 217d6e8e.

Overlap: the only other open PR is #236. Its `e2e/README.md` hunk is at line 212 (publish), and it does not touch `source-changed.mjs` or `package.json`.

## What I checked

1. **The diff, three dots** (`git diff origin/main...HEAD`, rc 0; merge base 71f5ebbb).
   - 5 files: +179 / −46.
   - It matches §2.1 to §2.5 item by item: module shape, rule order, messages, import, precondition, runStep, S5d body, exit rule, comments and package scripts.
   - ADR-004: the `JSON.parse` at `s5dVerdict.mjs:48` reads a diagnostic session-log line inside an e2e harness. It is not on a data path.
2. **M1 to M8 at 217d6e8e,** in my own worktree under `C:/dev/wt/`. Each was applied alone, then `node e2e/s5dVerdict.test.mjs` was run (script `mut3.mjs`, rc 0).
   - Unmutated: T1 to T7 pass.
   - M1 fails T2, T3. M2 fails T5. M3 fails T2, T3, T6, T7. M4 fails T6. M5 fails T7. M6 fails T4. M7 fails T1, T2, T3, T5, T6. M8 fails T5.
   - Porcelain was `""` after each revert. The restored run: 7/7.
   - This matches the worker's table and the header's extra failures exactly.
   - My first attempt (`mut.mjs`, rc 1) is void: its parser expected TAP output, and the Bash tool halved the backslashes in its M8 pattern.
3. **§7's command at the head** (rc 0):
   - `s5dVerdict.mjs`: 57 of 80.
   - `s5dVerdict.test.mjs`: 67 of 100.
   - `source-changed.mjs`: 96 of 100 (52 added, 44 removed).
   - `package.json`: 3 of 3.
   - `README.md`: 2 of 4.
   - Total: 225 of 287. No overrun.
4. **npm in shared holds:**
   - `npm ci` in `renderer/bundle-viewer`: exit 0 as the tool reported it (I did not print rc on that call); the output ends `found 0 vulnerabilities`.
   - `npm ci` in `frontends/shell`: rc 0.
   - `npm run verify`, first run: rc 1 (note 1).
   - `npm run verify`, second run: rc 0. Vitest 100 files and 1391 tests passed; export-elapsed 5/5; `test:s5d-verdict` 7 tests, 7 pass, 0 fail.
5. **Governance at the head:**
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 1 at 481/483, then rc 0 at 483/483 (note 1).
   - Plan scripts, each named with its last commit:

| Script | Commit | Result |
|---|---|---|
| `verify.mjs --offline` | 26072022 | rc 0, PASS |
| `verify-cites.mjs` | 2f4f8252 | rc 0, PASS; the advisories are earlier gate files, none from this PR |
| `verify-quotes.mjs` | f9444a4d | rc 0, PASS |
| `verify-test-claims.mjs` | e9735d47 | rc 0, PASS |

6. **§2.4's words, by script** (the form on main against the head):
   - D-H: form lines 99-119 are byte-identical to `source-changed.mjs` lines 179-199.
   - D11: form lines 137-141 are byte-identical to lines 168-172.
   - D9: form lines 152-159 are byte-identical to lines 1407-1414, indented 4.
   - README: form line 185 is byte-identical to `README.md` line 243.
   - D8: the C2, C1, R and C3 messages are byte-identical around their placeholders.
   - The rule-1 FAIL text and the PASS text are byte-identical to the base driver's.
   - `words.mjs` exited rc 1 only because its PASS extractor picked up the doc comment. `pass.mjs` (rc 0) corrects that.
7. **Hashes and the e2e record's rows:**
   - All 46 form pins recompute equal (LF bytes), and so do the 5 test pins (`hashes.mjs`, rc 0).
   - Amendment 2's sha256 714628f3… recomputes equal over the record at the commit that adds it, 907d3e0a (on main), and the record is unchanged on main since.
   - Amendment 2 item 1's chain checks out: 217d6e8e → 287b2bec → 61bf1c08 → 0e281e07, starting from 71f5ebbb.
   - The exe's sha256 recomputes to f3fdf25a…. The record's path-list diff: rc 0, empty.
   - The record's rows against the 10 reports in the e2e checkout's `e2e/out` (`rows.mjs`, rc 0):
     - `launched: true` in all 10;
     - every step verdict equal;
     - the exit code derived from each report's results equals the record's (3 ×8, 0, 0);
     - each S5d suite line, rebuilt from its report, is byte-equal to the record's;
     - each run's named session-log lines after line 31 are equal to the record's and agree with the report's evidence object.
   - The stderr captures (`plines.mjs`, rc 0): line counts 2, 3, 4, 3, 4, 3, 2, 2, and the P lines are byte-equal to the record's. post-1, post-7 and post-8 have no P line, so Amendment 2 item 3's class 2 is correct.
   - The series summary shows rc 3 ×8 and 0 ×2, and the checkout clean at the end.

**Cleanup:** my throwaway worktree was removed (`git worktree remove --force`, rc 0). `C:/dev/wt/s5di` is untouched: HEAD 0e281e07, porcelain clean. Nothing was committed or pushed, and no file was written outside my scratch folder and that worktree.
