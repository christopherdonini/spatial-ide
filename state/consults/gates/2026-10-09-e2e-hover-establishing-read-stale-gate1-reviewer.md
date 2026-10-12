# PR #196 gate 1 — reviewer
Reviewed: cut/e2e-hover-establishing-read-stale @ 86c26f2bd1d11dba1b195ea54ce6592180cac10e

**Verdict: PASS.** No Correctness or Evidence finding. Two Documentation findings (D1, D2) and one PR-body update (D3) must be fixed in this PR before the merge. No re-gate is needed.

Diff range: `origin/main...origin/cut/e2e-hover-establishing-read-stale`, merge base d007a50bbc01e599229a48c70ca726eddec3a4d8. Two commits: f9e1f8dc (code) and 86c26f2b (comments only). Files changed: `frontends/shell/e2e/lib.mjs` (+63/−0) and `frontends/shell/e2e/regression.mjs` (+17/−18).

## Correctness — none

The barrier is logically sound against the consuming side, which I read at the base:
- On deck's `pointerleave` sentinel, the product's `onHover` calls `emitHoverReadout(null)` before any below-resolution branch (frontends/shell/src/canvas/WorkingCanvas.tsx:1999-2001 @ d007a50b). So a standing refusal also clears on leave, and A9′'s refusal-continues path survives the barrier. The M5 log agrees: barrier lines appear and A9′ hits its step bound, not the barrier's named failure.
- On the "found clear already" path, the pending leave request is replaced by the candidate move, so no stale id can follow. The doc comment is imprecise on this path (D2), but the code is not.
- The seam lib.mjs → regression.mjs returns `{ ok, last }`. That is the same object `waitForCondition` returns, and `last` is `readHoverReadoutState`'s shape. Both call sites read `result.ok`, `result.last.text` and `hoverReadoutId(result.last)` exactly as before. Both callers pass all three parameters. The export has a product-suite caller at two sites.
- `JSON.stringify` appears only in error and log text, not on a data path.

## Evidence — none

### §2.3, checked by diff
- Case (iii) is at base lines 1304-1344 and head lines 1303-1343.
- Its non-comment lines are byte-identical, checked with comment lines removed and again with trailing `//…` stripped.
- Only two comment lines changed, base lines 1319-1320, both inside 1318-1320.

### §8, items 1-16 (as Amendment 1 amends them)
1. **OK.** `git diff --name-only` lists only lib.mjs and regression.mjs.
2. **OK.** See §2.3 above.
3. **OK.** Case (iii) has no retry and no re-established hover.
4. **OK.** No src/** or src-tauri/** change. The worktree is clean at the head.
5. **OK.**
   - Predicates, the 5,000 ms id wait (now inside the export, same value), the 10,000 ms wait, notch counts and step bounds are unchanged.
   - A9′'s `attemptStart` and attempt record are unchanged.
6. **OK.** The barrier waits on the `clear` state. The only sleep is the existing poll interval.
7. **OK.** Every K6 and A9′ id is taken through the export, which logs one line per attempt.
8. **OK.** The only numbers in the new code are the 5,000 ms and 4 px bounds.
9. **OK.**
   - Each changed test has an observation recorded at f9e1f8dc (see the mutation record below).
   - No `verify-mutation` run is called an observation.
10. **OK.** One export, which has a caller.
11. **OK.** No dependency or lockfile change.
12. **OK.** No quote is marked verbatim.
13. **OK.** source-changed.mjs and residency-harness.mjs are untouched.
14. **OK, by bytes.** The first 595 lines of lib.mjs at the head are cmp-identical to lib.mjs at the base (595 lines, ending in LF). The diff is one hunk appended after the old last line.
15. **OK, by bytes.** None of the three is exported. Each copy is cmp-identical to its base source:

| lib.mjs at the head | regression.mjs at the base | Function |
|---|---|---|
| 602-611 | 145-154 | `waitForCondition` |
| 613-629 | 1177-1193 | `readHoverReadoutState` |
| 631-633 | 1199-1201 | `hoverReadoutId` |

16. **OK.** No second export, and no parameter or option the callers do not pass.

I8 did not fire.

### §7, by the form's command at the head
- Command: `git diff --numstat d007a50b...86c26f2b -- frontends/shell ':(exclude)…PREREGISTRATION.md'`
- Output: lib.mjs `63 0`, regression.mjs `17 18`.
- Total: 98 lines in 2 files, against 140. No overrun.

### Hash pins
- Every `path:line @ rev sha256:hex` pin in the form and in Amendment 1 was recomputed at its pinned commit: 56 occurrences, 55 distinct, 0 mismatches.
- Both pinned commits, dba12b8c and b4dc05e0, are on main.

### Mutation record
I made no product edit and see no need to observe any mutation again.

**The record.** Two hashes match:
- the report's sha256 from line 5 to the end recomputes to the filing note's value, 8f0a4176…ea65b;
- the fixture hashes (7 files) before and after the runs are identical in the worker's scratch folder.

**The worker's run logs**, read in the worker's scratch folder:
- Each mutation run fails exactly as recorded:
  - M1 at 801: K6/re-pick, expected 50244, last seen 47080.
  - M-B at 801: the barrier's clear-wait fails at K6/re-pick, with standing and last both 50244.
  - M2 at 800: expected 52144, last seen 52145.
  - M3: K6/discrete, no marker element.
  - M4: K6/release-edge, a settle re-pick line.
  - M5: A9′ times out after 120000ms, and K6/continuous finds no above-threshold candidate.
- In every mutation run, the only other failure is C2′/C3′.

**The recorded-mutation comments at 86c26f2b:**
- M-B's comment sits beside the export, lib.mjs head lines 634-636.
- M1 and M2, plus the M3/M4 re-observation, are appended to the K6 recorded-mutations block, regression.mjs head lines 1270-1275.
- M5's re-observation is at regression.mjs head line 729.
- Every message they quote is a prefix of the matching log line.

**The PR body's quotes:** each of the seven quoted failure strings, after stripping the closing quote mark, matches the report byte for byte (grep -F).

### Suites at the head
**`npm run verify`** in frontends/shell, in its own shared hold (granted on cores 0-7 and released; rc 0):
- typecheck, check:dev-origin, check:origin-event and verify:adr-index: PASS
- build: PASS
- check:dist-clean and check:dist-notice: PASS
- vitest: 78 files, 1184 of 1184 tests passed
- test:residency-trace: 76 passed, 0 failed
- test:citation-integrity: 30 passed, 0 failed

**`e2e:regression` at 1280 × 801.** Own shared hold, granted and released. Launched with my copy of the worker's tools, with paths changed to my scratch folder only. rc 1.
- Fresh launch (`launched:true`, "This run launched the app"). Map and capturePixels buffer both 668×737.
- Step results:
  - PASS: A1′, A3′, A4′, A5′/A6′, A7′, A8′, A9′, K6, K7, CURSOR′, FIND′, MP′, PT′, LN′, B2′/B3′, ABSENTCRS′.
  - FAIL: C2′/C3′, expected (`got {"kind":"admitted"}`).
  - INFO: NET′.
- Barrier lines:
  - A9′ (notch 4, flipY true): standing clear, taken 24517.
  - K6/continuous: standing clear, taken 24517.
  - K6/re-pick: standing confirmed 50244, saw the change to clear, taken 47080.
  - K6/discrete: standing 47078, taken 48646.
  - K6/release-edge: standing 50244, taken 47080.
- (iv): "a different id (47080 -> 47078), confirmed re-picked".
- Identical to the worker's four runs at 801.

**`e2e:regression` at 1280 × 800.** Own shared hold, granted and released. rc 1.
- Fresh launch. Map and buffer both 668×736.
- Step results: the same as at 801. Only C2′/C3′ fails, and NET′ is INFO.
- Barrier lines:
  - A9′ (notch 4, flipY true): standing confirmed 27683, saw the change to clear, taken 28625.
  - K6/continuous: standing clear, taken 28625.
  - K6/re-pick: standing clear, taken 52144.
  - K6/discrete: standing clear, taken 50249.
  - K6/release-edge: standing clear, taken 52144.
- (iv): "an absence, confirmed re-picked (nothing resident under that pixel)".
- Identical to the worker's two runs at 800. P3 holds again.

**After each run:** `app-down` killed only the two pids it had started, and ports 9223 and 5400 were free. There was no timing-sensitive failure and no hold exit code from 96 to 99.

### Governance checks at the head
Not held. Each line gives the tool's last-change commit.

| Check | Tool commit | Result | rc |
|---|---|---|---|
| verify-cites | 04f6332b | PASS (1594 files; 49 loose advisories, all pre-existing in state/drafts) | 0 |
| verify-quotes | f9444a4d | PASS (121 checked, 90 verified, 30 baselined, 0 errors) | 0 |
| verify-test-claims | e9735d47 | PASS (531 claims) | 0 |
| verify | 26072022 | verify:plan PASS | 0 |
| queue --check | deb56edd | current | 0 |
| site --check | f9444a4d | current | 0 |
| cfg-boundary | 859375c9 | 18 sites, 0 outside | 0 |

`node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 457 of 457 passed, rc 0.

### CI
`gh pr checks 196` (rc 0), every line, none pending:
- every commit is signed off: pass
- no profile path in the range: pass
- tauri build (NSIS, build-only, no signing): pass (2 runs)
- typecheck · build · vitest · cargo test: pass (2 runs)

### PR body and low profile
- The PR body matches the head and the report:
  - base d007a50b and head 86c26f2b;
  - 98 lines, with lib.mjs's lines appended after its last line;
  - the copies are identical;
  - (iii) is called unchanged, and the node `shell-pick-paths-disagree-at-1280x801` is named, as the case (iii) ruling requires;
  - the runs table and the mutation table.
- The title, the body and both commit messages carry no outside issue or PR reference and no @mention.

## Documentation — must fix before the merge

**D1.** regression.mjs:1113 at 86c26f2b (the K6 helper's rewritten comment) says "every zoom notch leaves the readout on the" centre pointer's feature.
- That is false whenever the centre is on a gap. At 1280 × 800, K6/re-pick, K6/discrete and K6/release-edge all stand `clear`: the worker's two runs, my run, and the form's P3.
- Fix: say "can leave".

**D2.** lib.mjs:637 at 86c26f2b (the export's doc comment) says that seeing `clear` means "the leave pick has run" and no settle re-pick stands.
- On the "found clear already" path, the leave pick may not have run yet.
- The ordering still holds, because the candidate move replaces deck's pending leave request (form §2.1's argument). The comment should say that instead of claiming the leave pick has run.

**D3.** PR body line 67 still says "**Not run yet:** `frontends/shell` `npm run verify`". Replace it with this gate's result: rc 0, vitest 1184 of 1184, residency-trace 76, citation-integrity 30.

## Observations (no action required)
- The worker report's M-B quote (state/consults/2026-10-09-e2e-hover-establishing-read-stale-worker-report-1.md:67) ends "…, last state seen the same" inside its quote marks. The log line repeats the readout object instead.
  - The PR body's and the code comment's M-B quotes are exact prefixes and stop before that span.
  - The report is a filed record on main, outside this diff, so I make no request.
- The pick mode was recorded from code reading only (`pickAsync: 'auto'`, so sync), not observed at run time. The form's §2.1 argument holds in both modes, so the result does not depend on it.

Commands that had a hold: `npm run verify`, `e2e:regression` at 801 and `e2e:regression` at 800, each in its own shared hold, all granted and released. The worktree `C:/dev/wt/k6` is clean at 86c26f2bd1d11dba1b195ea54ce6592180cac10e. Nothing was committed or published. My temporary files are only in my scratch folder.
