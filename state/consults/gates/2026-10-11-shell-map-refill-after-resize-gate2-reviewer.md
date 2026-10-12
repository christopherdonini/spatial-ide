# PR #207 gate 2 — reviewer
Reviewed: cut/shell-map-refill-after-resize @ 9e657db1f5e2f155ba6704b46db1964a2c3925e3

**Verdict: PASS.** There are no Correctness or Evidence findings. C1 is resolved, and so are my gate 1 D1 to D5. Three new Documentation findings must be fixed in the PR body before the merge, with no re-gate. Every suite, my own layout run, CI, the hash pins and §7 are green.

Line cites into code are at 9e657db1 unless they say otherwise.

## Correctness (blocks): none

**C1 is resolved, checked against Amendment 3 item 3.**
- **The two clears:**
  - `resetFitForNewGeneration` sets `lastQueriedRef.current = null` beside its two existing lines (frontends/shell/src/canvas/WorkingCanvas.tsx:1530-1534).
  - `fitToExtent` sets `lastQueriedRef.current = null` in the `else` of the existing `if (notifyViewport)` (:1346-1353).
  - Both doc comments say so (:156-157 and :1018-1019).
- **Every `cameraRef.current =` site either reports or clears.** A grep finds exactly three sites:
  - :1339, the fit. It reports at :1350 when `notifyViewport` is set, and otherwise clears at :1352.
  - :1988, the interactive handler. It reports unconditionally at :2015, with no early return in between.
  - :2220, the DEV-only seam. It reports at :2224, with no return in between.
- **`reportViewport` is still the only non-null writer** (:1023-1024). `onResize`'s `query` path goes through it (:1953). `onViewportChangedRef.current(` occurs once.
- **The fix covers path (b) as well as path (a).** A pan before the first batch reports, and the auto-fit that follows now clears.
- **Nothing else changed.** `viewportAfterResize`, `reportViewport`, App.tsx and RF1 to RF9 are untouched, as are the auto-fit's `notifyViewport: false` and its firing condition.

## Evidence (blocks): none

Observations only:
- **No e2e step shows paths (a) or (b).** The claim rests on RF10, which reads source text, together with RF4, RF2 and RF6 and item 3's argument. Amendment 3 item 4 declared this before the code. I checked the argument independently by reading the three camera sites (above). It holds.
- **Gate 1's E1 to E3 are unchanged.** They were observations and are not in this round's scope.

## Documentation (must fix in this PR before the merge; no re-gate)

- **D1. The PR body's residency-harness bullet says its 12 measured steps have the same features and bytes at both arms.** Only 11 of them print features and bytes. `[open-drain]` prints wallMs, firstPixel and segments only, in both `residency-base.log` and `r1-residency-head.log` (the scratchpad's `refill/out/`). The other 11 match exactly. Reword it as 11 steps with figures, plus open-drain, which prints none. My gate 1 report made the same over-count, and I correct it here.
- **D2. The PR body's "What changed" bullet for `src/App.tsx` says without condition that after a shrink, the Export panel's Current view carries the new box.**
  - Since Amendment 3, after an Apply, a Clear or any automatic fit, a shrink gives `none` and the panel keeps the last reported view (Amendment 3 item 7, third bullet).
  - The body's e2e section already states that exception. Scope this bullet to match: after a shrink, once a view has been reported.
- **D3. The opening "What it does" bullet's second sentence reads as if reports happen "since the open, the last filter Apply or Clear, and the last automatic fit".**
  - The intended meaning is Amendment 3 item 7's: a pan, zoom or Zoom to layer has happened since the latest of the open, the last Apply or Clear and the last automatic fit.
  - Reword it so that the condition is unambiguous.

**Notes, no action:**
- Worker report 6 says layout had "11 steps, all PASS". The log's summary has 12 rows, including FIXTURES. The PR body's table is right. The report is a filed record and is not in this diff.
- RF10's recorded-mutation comment gives the failure messages in abbreviated form, using "...". It is not marked verbatim and does not quote the human. Mutation (b) as I observed it matches the report's byte-copied message.
- G3 is 195, against Amendment 3 item 4's "G3 stands at 191". The +4 is the D4 comment rewording. No ceiling is exceeded and Amendment 3 item 5's total holds, so there is no class 8.

## Gate 1 D1 to D5

| | Status | Evidence |
|---|---|---|
| D1 | Resolved | The body lists verify-cites (04f6332b), verify-quotes (f9444a4d) and verify-test-claims (e9735d47), each the last commit touching that script, plus the governance `node --test`. |
| D2 | Resolved | RESIZEQ is under Differences: "recorded at the base (0…, 0…), asserted at the head (72…, 0…)". The base log's RESIZEQ line confirms 0 and 0. |
| D3 | Resolved | Under "Each run", console's base arm is called "an exclusive hold". The basis for the timing reading is stated. |
| D4 | Resolved | frontends/shell/e2e/layout.mjs:35 and :273 now name `loadShellModule`, which is imported at :26 and used at :370-371 and :426-427. Line :420 ("imports no sibling suite") is still true. |
| D5 | Resolved | frontends/shell/src/canvas/WorkingCanvas.tsx:531 now says "Zoom to layer's fit". |

## The round's diff (`cf24f9b4..9e657db1`)

- **Files.** There are 3 files: WorkingCanvas.tsx (+8 −3), WorkingCanvas.test.ts (+13) and layout.mjs (+2 −2). There are 4 commits: da28d15e, cbee3688, da0fc49e and 9e657db1.
- **layout.mjs is comment-only.**
  - I stripped `//…` comments from both revisions; `cmp` gave rc 0.
  - The only changed executable line, :273, has an identical code part.
  - `node --check` gave rc 0.
- **Encoding.** All 3 files are valid UTF-8, with 0 CR bytes and a final LF. I tested both checks on a positive case: the UTF-8 check rejected an invalid file (rc 1), and the CR count found 1.

## RF10

- **The suite at the head passes.** `npx vitest run src/canvas/WorkingCanvas.test.ts` (light, no hold) gave rc 0, 41 of 41.
- **Mutation (b), re-observed by me at 9e657db1 (light, no hold).**
  - I deleted the `} else {` line and the clear in `fitToExtent` (WorkingCanvas.tsx:1351-1352).
  - `npx vitest run src/canvas/WorkingCanvas.test.ts -t "RF10"` gave rc 1. RF10 failed with `AssertionError: expected 'function fitToExtent(bbox: Authoritat…' to match /if \(notifyViewport\) \{[\s\S]*?\} el…/` (1 failed, 40 skipped).
  - I reverted with `git checkout --`. `git status --porcelain` was empty, and HEAD was 9e657db1.
- **The record of mutations (a) and (c) at da0fc49e.**
  - `git diff da0fc49e 9e657db1` adds only the 5-line comment in WorkingCanvas.test.ts. The test body and WorkingCanvas.tsx are identical at both commits, so observations made at da0fc49e hold for the head.
  - The recorded failures fit the assertions:
    - (a) fails `toContain` on the `resetFitForNewGeneration() {` slice;
    - (c) fails the exact count, "expected 4 to be 3".
  - Each was recorded with the full commit id, and none is called a verify-mutation run.

## The e2e, the PR body table against the logs (the scratchpad's `refill/out/`, read only)

- **Commits and exit codes.** Every `r1-*-head.log` header names head 9e657db1, and every one ends `rc=0`. Every base log names 4fd3259a and ends `rc=0`. Console's base column is `console-solo-base.log`.
- **Step statuses.** A script extracted the summary rows of each suite, base and head. All 14 rows match the table exactly:
  - layout has 10 rows the same at both arms; FILL and BURST appear only at the head;
  - the other 12 suites show no difference;
  - pan-anchor has 16 rows the same at both arms.
- **residency-harness.** The 11 steps with figures have identical features, bytes and tiles at both arms. Open-drain carries no figures (D1). Both arms use the baseline arm with `[gridFrame] null`.
- **The two mutation logs** are both at 9e657db1 with rc 1:
  - `r1-mut-resizeq-head.log`: RESIZEQ FAIL (0 lines) and FILL FAIL (0 streams); BURST PASS.
  - `r1-mut-fill-head.log`: the same.
  - This matches the body: "Each also fails the other step."
- **My own run.** `refill/run-suite.sh head rev207g2-layout e2e/layout.mjs 420`, in a shared hold (granted on cores 0-7, then released), gave rc 0.
  - Before the run, nothing was on 9223 or 5400.
  - `app-down` killed the two trees it had started and reported both ports free. Afterwards there was no LISTENING socket on either port.
  - All 12 steps PASS.
  - RESIZEQ: 72 new lines on close, 0 on reopen, 96 cells predicted, map 480x576 to 758x576.
  - FILL: zoom −4.1693 to −3.2394, 2 qualifying cells before and 2 after, 10 streams carrying 2432 rows. The row count varies from run to run (649 in r1); at least 1 is required.
  - BURST: 0 lines.
  - Fixture hashes unchanged.
  - Log: the scratchpad's `refill/out/rev207g2-layout-head.log`.

## §7, by the form's command

The command was `git diff --numstat 4fd3259a...9e657db1 -- frontends/shell` with the three exclusions; rc 0. The merge base is still 4fd3259a.

| File | Lines | Amendment 3 item 5 | Ceiling |
|---|---|---|---|
| viewportBbox.ts | 31 | | 45 |
| WorkingCanvas.tsx | 54 | at most 60 | 90 |
| App.tsx | 6 | | 15 |
| **G1** | **91** | at most 97 | 150 |
| viewportBbox.test.ts | 52 | | 120 |
| WorkingCanvas.test.ts | 32 | at most 40 | 40 |
| App.layout.test.tsx | 63 | | 90 |
| **G2** | **147** | at most 155 | 250 |
| **G3** layout.mjs | **195** | (not listed) | 200 |
| **Total** | **433** | at most 443 | 600 |

Outside the count: MANUAL-WALKTHROUGH.md 28 of 30, e2e/README.md 2 of 12, KNOWN-LIMITATIONS.md 5 of 8. There is no overrun and no class 8.

## Amendment 3's pins, recomputed at 771fc1a3

771fc1a3 is on main. All 5 distinct pins recompute to their hashes: App.tsx:279-288 (cited twice), App.tsx:336-338, candidateArmSession.ts:65-76, :222-233 and :1657-1658. A negative test, App.tsx:279-287, gave a different hash. Each span says what the amendment attributes to it.

The cf24f9b4 references name their commit and carry no hash. They resolve to the lines described: :1018-1024, :1337, :1472-1481 and :1674-1676. This is the same form gate 1 accepted for Amendment 2. Amendment 3 marks nothing as a quotation and carries no discharge clause.

## Governance checks at the head (light, no hold)

`scripts/plan`, `scripts/hooks` and `scripts/evidence` are identical between 9e657db1 and origin/main 42340265 (`git diff --stat` printed nothing).

| Check | Tool commit | rc | Result |
|---|---|---|---|
| verify-cites | 04f6332b | 0 | PASS, 1685 files |
| verify-quotes | f9444a4d | 0 | 121 checked, 90 verified, 30 baselined, 0 hash-reference errors |
| verify-test-claims | e9735d47 | 0 | PASS, 534 claims |
| verify | 26072022 | 0 | PASS |
| queue --check | deb56edd | 0 | current |
| site --check | f9444a4d | 0 | current |
| cfg-boundary | 859375c9 | 0 | 18 sites, 0 outside |
| `node --test` (plan, hooks, evidence) | c813c6ab | 0 | 457 of 457 |

**`verify-quotes --show-cites` over the 10 changed files:** rc 1.
- There are 28 "quote not found" findings on 21 distinct lines, all in MANUAL-WALKTHROUGH.md, lines 122 to 1433.
- None of those lines is among the 439 lines the PR adds. My intersection check was tested on a positive case: line 1762 intersects.
- The walkthrough diff only adds lines, all at 1762 or later. So the findings are on base lines whose number and content are unchanged.

## `npm run verify` (frontends/shell)

It ran in a shared hold, granted on cores 0-7 and released, with rc 0. Log: the scratchpad's `rev207g2-verify.log`.
- typecheck: pass
- check:dev-origin: PASS
- check:origin-event: PASS
- verify:adr-index: PASS (34 ADRs)
- build: pass
- check:dist-clean: PASS
- check:dist-notice: PASS
- vitest: 78 files, 1194 tests passed
- residency-trace: 76 passed, 0 failed
- citation-integrity: 30 passed, 0 failed

## CI

`gh pr checks 207` gave rc 0, with 6 lines, all pass and none pending:
- every commit is signed off: pass
- no profile path in the range: pass
- tauri build (NSIS, build-only, no signing): pass, twice
- typecheck · build · vitest · cargo test: pass, twice

`gh run view` on the 4 runs (rc 0 each) shows headSha 9e657db1 for every run. Three were triggered by pull_request and one by the branch update.

## §8, this round

- Item 2: `onViewportChangedRef.current(` occurs once.
- Items 1 and 12: a scan of the added src lines for timer, debounce, throttle, export and perf words found none. The scan was tested on a positive case.
- Item 7: 3 files, all within §2.8.
- Item 8: App.tsx is untouched.
- Item 10: no new export, prop or callback.
- Item 11: layout.mjs changed in comments only.
- Item 16: RF10 has its three observed mutations.
- Items 3 and 4, as amended: held by the two clears, as above.

## PR body

- **Against the head and the reports.** The commits, §7 figures, verify counts, governance tool commits, mutation outcomes and suite statuses all match. The exceptions are D1 to D3. The question on item 39 is correctly left to the human.
- **Low profile** (state/directives/2026-10-08-low-profile-on-github.md). The 4 round commits, the title and the body carry no outside issue or PR reference and no outside @mention. The only links in the body are its attribution lines.

## Final state

- `C:/dev/wt/refill` is clean, at 9e657db1f5e2f155ba6704b46db1964a2c3925e3.
- Nothing is listening on 9223 or 5400.
- Both of my holds are released.
- I did not touch D:/wt/refill-base, and I did not commit, rebase, merge or publish.
- My helper files are removed. The two logs cited above stay in the scratchpad.

Files for the Documentation fixes: the PR #207 body only. No file in the repository needs to change.
