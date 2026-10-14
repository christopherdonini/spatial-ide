# PR #217 gate 4 — reviewer
Reviewed: cut/shell-migration-milestone-2-phase-b @ d59f1a6abc0577a952940e1a34cbb76528ff1acc

**Verdict: PASS.** No Correctness finding and no Evidence finding, so nothing blocks. Items (a), (b), (c) and (d) are built as ruled. Each recorded mutation fails with its recorded message. The run-5 record matches the logs. There are two Documentation findings (D1 and D2), to be fixed before the merge with no re-gate; neither is the human's wording. I agree with the architect's gate 4 D-1, D-3 and D-4. D-2 is already on main at fc4560d6. The item 2e drafts are still with the human, among them W10a's expected cell (frontends/shell/MANUAL-WALKTHROUGH.md:1826 @ d59f1a6a, marked as a draft). I note them and do not block on them.

## Correctness: no finding

**(a) The late-cancel statement is a list, as my gate 3 C1 fix described it.**
- The state is `useState<readonly FinishedOutcome[]>([])` (frontends/shell/src/App.tsx:1116 @ d59f1a6a).
- Both clears set `[]` (:1126 on a report, :1139 in `confirmOpen`).
- Both decision sites append (:1131 in the ended handler, :1165 at the choice).
- The render maps one `LateCancelStatement` per outcome (:1912). The strings did not change.
- RB12g pass 4 follows my probe sequence (App.selection.test.tsx:1080 @ d59f1a6a). It asserts both paths in order, four cancel keys, and one close.
- Re-applying pass 4's mutation (the custodian's `R3-TWO.patch`, which is `setLateCancel([finished])` at the choice) fails RB12g with the recorded message, byte for byte. 27 tests pass, RB12d among them.
- **RB12d's clear still holds.** Removing the report's `setLateCancel([])` at :1126 fails RB12d with "the next export report ends the statement" (P1).
- **The per-run decision rule still holds:**
  - With no decision when a run ends (`lateCancelOutcome(false, end)` at :1130), RB12d (i) and RB12g fail (P2).
  - With no decision at the choice, RB12e "decided at the choice" and RB12g pass 3 fail (P3).
  - A run gets at most one entry: a run that ended before the choice had `cancelChosen` false in its ended handler, and a run still going gives null at the choice.

**(b) The double-click filter.**
- `if (event.type === "dblclick") return;` sits in the Deck's `onClick` (frontends/shell/src/canvas/WorkingCanvas.tsx:2026-2029 @ d59f1a6a).
- No timer and no delay were added. A `click` event reaches `onTap` as before.
- The wiring test sends a `{type:"dblclick", srcEvent}` event: nothing is emitted and no pick runs. A `click` at the same pixel then emits a feature (WorkingCanvas.wiring.test.tsx:259 @ d59f1a6a).
- With the filter removed (`R3-DBL.patch`), that test fails with the recorded message, and 13 tests pass.
- On WebView2, E-DBLCLICK passes, and with the filter removed it fails on its first assertion (run-5 logs, below).

**(c) `tapPixel`** (frontends/shell/src/canvas/clickPick.ts:60-65 @ d59f1a6a), checked against mjolnir.js 3.0.1 `getOffsetPosition`: version 3.0.1 in the worktree's `node_modules/mjolnir.js/package.json`, and `dist/utils/event-utils.js` byte-equal to the main checkout's copy.
- **The steps match `event-utils.js` lines 59 to 67:**
  - rect: line 59, `getBoundingClientRect()`;
  - scale, with the `|| 1` fallback kept: lines 62-63, `rect.width / offsetWidth || 1` and the same for height;
  - offset: lines 66-67, `(center − rect.left − clientLeft) / scaleX` and the same for y;
  - order: the same order and the same operations, so for the same inputs the result is bit-identical.
- **Truncation comes first.** The tap truncates `clientX` before subtracting. The hover's `center` is the `mousemove`'s `clientX` as delivered (`dist/inputs/move-input.js` `_emit`). The old tap path rounded (`dist/hammerjs/input/get-center.js`, `Math.round`).
- This matches the architect's replacement words, which the human adopted (OPEN-15 wording directive, item 1; the form's Amendment 15 item 1): truncated, less the rect and the border, over drawn size / layout size.
- **§8 item 3 stands.** `createTapHandler` reads only `tap.srcEvent` and the canvas element (clickPick.ts:71-72 @ d59f1a6a). It reads no hover state, does not read deck's first `onClick` argument, and does not read `offsetCenter`.
- **The product caller** passes the same `canvas` it gives to `Deck` (WorkingCanvas.tsx:1998-2005 @ d59f1a6a). With no `parent` prop, deck's event root is that canvas.
- **The three unit mutations** (rounding, subtracting before truncating, dropping the scale) each fail with the recorded message and the recorded counts: 4 of 11; only that test; only that test.
- The `|| 1` fallback is pinned by the wiring tests. Dropping it makes jsdom's 0/0 a NaN pixel, and two wiring tests fail (P4).

**(d) My gate 3 D2, D3 and D5:**
- D2 is my words, byte for byte (App.selection.test.tsx:1012 @ d59f1a6a).
- D3 is my words, byte for byte (App.tsx:1160 @ d59f1a6a).
- D5 has the two changes, "its statements" and "ends them" (App.tsx:1114 @ d59f1a6a). The first is what I asked for. The second follows from it grammatically. The architect's D-3 words read better than mine ("its statement … ends the statements shown"); I agree with them.

**Other checks:**
- The two record commits (a8aa46b2, d59f1a6a) change comments only. Every changed line is a `//` line.
- Every commit of the round is `-s` and carries Co-Authored-By Sonnet 5.5, which matches `model: sonnet` in worker-high.

## Evidence: closed; notes only

**`npm run verify` at the head, in a shared hold (granted, then released): exit 0.**
- vitest: 93 files, 1,336 tests.
- residency-trace: 76 passed, 0 failed. citation-integrity: 30 passed, 0 failed.
- adrIndex (34 ADRs), dist-clean and dist-notice: PASS.

**The run-5 record against the scratch files in the session scratchpad under `mm2b-e2e/`.**
- **Scratch hashes:** all nine first-16 sha256 values in the record's header match.
- **`app-up.ps1`** differs from `app-up.ps1.bak` by exactly one comment line and one added line. The added line appends `--force-device-scale-factor=$E2E_FORCE_DSF` to `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` only when `E2E_FORCE_DSF` is set.
- **`run-scale.sh`:**
  - it checks the head and that the checkout is clean;
  - it applies and reverts the patch, and checks porcelain afterwards;
  - it hashes the fixtures before and after;
  - it runs `probe-dpr.mjs` before the suite.
- **The patches:**
  - `R3-DBL` removes only the filter line;
  - `R3-TWO` is the single-slot change at the choice only;
  - `R3-ROUND` replaces both `Math.trunc` calls with `Math.round`;
  - the three `DIAG` patches are e2e logging and the move only.
- **The logs:**
  - Every `r3-*` and `r5-*` log starts at the head the record names. Start times, end times and exit codes match each row.
  - Every fixtures-before list equals its fixtures-after list (17 lines each).
  - The suites' pass counts match the record: regression 17, layout 12, style 6, console 11, publish 4 plus 1 SKIP (EXPIRED'), admission 11, filter 3, filter-panel 5, refusal 3, residency-harness rc 0 with no verdicts, source-changed 8, source-watch-idle 9, pan-anchor `==== 16/16 PASS ====`, and the post route 8 with S5d-post PASS.
  - Selection is 17/17 at d59f1a6a.
- **The device pixel ratios and the WebView2 version:**
  - The `[DPR]` lines give 1 (R3-ROUND run), 1.25 and 1.5. The viewports are 1280x800, 1024x640 and 854x534.
  - The browser is `Edg/154.0.4258.62` in all three.
  - The printed point positions match the record.
  - The native unmutated run has no `[DPR]` line. The record says it takes ratio 1 from the R3-ROUND run's probe at the same head.
- **The mutation rows:**
  - R3-DBL fails E-DBLCLICK with "a Navigate double-click on id 836 left the Feature tab showing id 836; none was expected".
  - R3-TWO fails E-ASK-TWO naming the second bundle only.
  - R3-ROUND fails E-KINDS: "a Navigate click inspected id null; the oracle id there is 0", at (331.5, 533.5), DPR 1, with the canvas 668x736.

**The E-SEL-FILTER diagnosis is sound** (`r3-diag-selfilter-rect-f18dbefb.log`, `r3-diag-selfilter-log-f18dbefb.log`).
- Before the clicks, the notice reads that 1 selected feature was dropped because a dataset was opened, and the canvas is [266,40,668,715.453125].
- After the first click, the notice is null and the canvas is [266,40,668,736].
- The clicks on 652, 1012, 1021 and 1381 read "no feature there". 1152 (the first click, picked before the re-layout) and 1372 hit.
- With E-DBLCLICK moved last, 17 of 17 pass. At f64418bc, where nothing reopened before E-SEL-FILTER, selection passed.

**Does the move hide anything?** No.
- E-DBLCLICK passed in both positions.
- Its step body and the product lines it mutates are unchanged from f18dbefb to d59f1a6a (the selection.mjs diff touches only E-KINDS, `hoverHits` and the `runStep` order).
- What it moves out of the suite is the map growing when a notice clears. The human placed that as `shell-status-bar-one-height` and allowed the move "for now" (OPEN-15 wording directive, item 3).

**Notes (none blocking):**
- **N1.** The rounding mutation ran only at ratio 1. At 1.25 and 1.5, rounding and truncation differ on x at the printed positions (279.6, 241.67). So those two passes rest on the fractional-position guard, not on an observed discrimination. This is the proof the human set (Amendment 15 items 2-3), and the record's mutation column shows it. It agrees with the architect's N-1.
  - Two further runs of `run-scale.sh <head> 1.25 R3-ROUND.patch` and `… 1.5 …` would turn the claim's "agrees" at those ratios into an observation. They need no code.
- **N2.** No test pins the border term. Dropping `- canvas.clientLeft/Top` (P5) or flipping its sign (P5b) passes every test in clickPick.test.ts and in the wiring test. The canvas has no border today, so ordinary use cannot reach the difference. A unit case with a non-zero `clientLeft` would pin it. The human's proof list did not ask for one.
- **N3.** E-KINDS' fractional guard has never been seen to fail. Every run printed a position that is fractional on both axes.

**CI:** `gh pr checks 217` shows 8 of 8 pass. The check-runs API for d59f1a6a lists 8, all `completed success`.

**Governance scripts at the head:** all exit 0 (commands below).

## Documentation (must fix before the merge; no re-gate)

Neither finding is the human's wording. The custodian or the worker applies the words, and the PR body lists them.

**D1. The PR body's "For the human" section is stale.** It still asks the human about OPEN-13, OPEN-14 and OPEN-15, and recommends (C) for OPEN-15. The human ruled all three, and ruled (B), in the two directives the body names further down.
- Replace its OPEN-13, OPEN-14 and OPEN-15 bullets with: `- **OPEN-13 to OPEN-15:** ruled (state/directives/2026-10-12-round-72-217-third-round-open-13-to-open-15.md; state/directives/2026-10-12-open-15-wording-webview2-scale-runs-status-bar-piece.md; the form's Amendments 14 and 15) and built in correction round 3.`
- Append to its Item 2e bullet: `Part W's new W10a expected cell is among them.`
- Clause check:
  - both directives are on main;
  - Amendment 14 item 1 and Amendment 15 items 1 to 4 (frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1340, 1374-1377 @ fc4560d6);
  - W10a's cell is marked as a draft (MANUAL-WALKTHROUGH.md:1826 @ d59f1a6a).

**D2. The first sentence of the `lateCancel` doc comment overstates what the list holds** (App.tsx:1113 @ d59f1a6a). It says "one for each run decided". A run decided with no statement adds nothing: a prepare, a failure or a cancelled run, all of which `lateCancelOutcome` maps to null.
- Replace `The late-cancel statements' outcomes, one for each run decided, in the order they were decided.` with `The late-cancel statements' outcomes, one for each run decided to have one (an execute the choice was made for that ended in a bundle), in the order they were decided.`
- Clause check:
  - frontends/shell/src/feature/OpenDuringExportAsk.tsx:30-34 @ d59f1a6a: non-null only when `cancelChosen` is true, the phase is execute, and the status is success or succeeded-unaudited;
  - the appends at App.tsx:1131 and :1165 add only a non-null outcome.

**Already right:**
- The PR body's §7 line (Amendment 16 item 4: 5,953 and 7,123 of 8,352).
- Its Form line (Amendments 1 to 16, last first).
- The architect's D-2 on the PLAN node is applied on main at fc4560d6 (PLAN.yaml:5083 @ fc4560d6).

## The round's reach and §7

- **The round's files:** `git diff f64418bc..d59f1a6a` touches 9 files, all in Amendment 14 item 6 or Amendment 15 item 4.
- **Insertions plus deletions against the budget:**

| File | Used | Budget |
|---|---|---|
| App.tsx | 21 | 30 |
| WorkingCanvas.tsx | 14 | 30 |
| clickPick.ts | 25 | 25 (exactly at it) |
| App.selection.test.tsx | 43 | 90 |
| clickPick.test.ts | 45 | 60 |
| WorkingCanvas.wiring.test.tsx | 28 | 60 |
| selection.mjs | 74 | 100 |
| **In the count** | **250** | **410** |
| e2e/README.md (outside the count) | 4 | 10 |
| MANUAL-WALKTHROUGH.md (outside the count) | 2 | 8 |

  OpenDuringExportAsk.tsx and styles.css were not touched. Nothing is over.
- **§7, recounted from the merge base f87a7b66** with its own command and three excludes:
  - at d59f1a6a: **5,953 over 39 files**; at f64418bc: 5,773;
  - the piece is 1,170 + 5,953 = **7,123 of 8,352**;
  - per file: selection.mjs 773 (about 750 + Amendment 14's 100); App.selection.test.tsx 1,118; App.tsx 261; WorkingCanvas.tsx 118; clickPick.ts 75; the wiring test 363 (OPEN-13 class 8 at 345, plus the round's 28 within its +60);
  - outside the count: MANUAL-WALKTHROUGH.md 43, e2e/README.md 16, root KNOWN-LIMITATIONS.md 16.
- Amendment 16 item 4 is correct. No class 8 row is owed.

## Commands and exit codes

- `git fetch origin` (piped to tail): the branch read back as d59f1a6a, and the merge base as f87a7b66.
- `git worktree add --detach C:/dev/wt/mm2b-review4 d59f1a6a…`: succeeded ("HEAD is now at d59f1a6a").
- `npm ci`:
  - renderer/bundle-viewer: the printed code was the pipe's (tail), 0, with no npm error;
  - frontends/shell: 0 (npm's own code).
- `npm run verify` in a shared hold (MACHINE_HOLD granted, MACHINE_RELEASED): **0**.
- The mutation script (`npx vitest run <file>` after each change, reverted with `git checkout`, porcelain checked) in one shared hold (granted, then released): **0**, with final porcelain empty. The individual codes are in the table below.
- At d59f1a6a:
  - `node scripts/plan/verify-cites.mjs`: 0 (1,849 files, 60 advisories);
  - `verify-quotes.mjs`: 0 (121 checked, 90 verified, 30 baselined, 1 advisory);
  - `verify-test-claims.mjs`: 0 (560 claims, 164 files);
  - `verify.mjs`: 0.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 0, with 457 pass and 0 fail.
- The §7 numstat at f64418bc and at d59f1a6a: 0.
- `gh pr checks 217`: 0, 8 of 8 pass. `gh api …/commits/d59f1a6a…/check-runs`: 8, all success.
- No exit code from 96 to 99 came from the machine script.

## Mutation table (one at a time at d59f1a6a, reverted after each)

| # | Mutation | File run | Observed | Matches the record |
|---|---|---|---|---|
| base | none | App.selection / wiring / clickPick | 28/28, 14/14, 11/11 | — |
| M1 | `setLateCancel([finished])` at the choice (R3-TWO.patch) | App.selection.test.tsx | 1 failed, 27 passed. "pass 4: one statement for each bundle, in the order decided: expected [ 'C:/out/second' ] to deeply equal [ 'C:/out/first', 'C:/out/second' ]" | Yes, exact; RB12d green |
| M2 | the `dblclick` return removed (R3-DBL.patch) | WorkingCanvas.wiring.test.tsx | 1 failed, 13 passed. "no inspection and no selection change: nothing is emitted: expected "vi.fn()" to not be called at all, but actually been called 1 times" | Yes, exact |
| M3 | `Math.round` for both `Math.trunc` (R3-ROUND.patch) | clickPick.test.ts | 4 failed, 7 passed: the three pixel cases and the tap at (5, 6). "expected { x: 66, y: 494 } to deeply equal { x: 65, y: 493 }" | Yes, exact |
| M4 | subtract before truncating | clickPick.test.ts | 1 failed (the fractional left and top case). "expected [ 65, 493 ] to deeply equal [ NumberCloseTo 64.4 (9 digits), …(1) ]" | Yes, exact |
| M5 | `/ scaleX` and `/ scaleY` dropped | clickPick.test.ts | 1 failed (the fractional drawn size case). "expected [ 65, 493 ] to deeply equal [ …(2) ]" | Yes, exact |
| P1 | the report's `setLateCancel([])` (:1126) removed | App.selection.test.tsx | RB12d fails: "the next export report ends the statement" | Probe: RB12d holds |
| P2 | no decision when a run ends (`lateCancelOutcome(false, end)`) | App.selection.test.tsx | 2 failed: RB12d (i) and RB12g "the execute finished: the statement names its bundle" | Probe: the per-run rule holds |
| P3 | no decision at the choice | App.selection.test.tsx | 2 failed: RB12e "decided at the choice" and RB12g pass 3 | Probe: the per-run rule holds |
| P4 | `|| 1` dropped from both scales | WorkingCanvas.wiring.test.tsx | 2 failed: the pick at { x: NaN, y: NaN } | Probe: the fallback is pinned |
| P4b | the same | clickPick.test.ts | 11/11 pass | Probe: the unit cases do not pin it (the wiring tests do) |
| P5 | `- canvas.clientLeft/Top` dropped | clickPick.test.ts | **11/11 pass, survives** | Probe: N2 |
| P5b | the border's sign flipped | WorkingCanvas.wiring.test.tsx | **14/14 pass, survives** | Probe: N2 |
| base2 | none | App.selection.test.tsx | 28/28 | — |

## The scratch worktree

- C:/dev/wt/mm2b-review4 was clean before removal (porcelain empty).
- It was removed with `git worktree remove --force` (exit 0) and pruned. It is gone from `git worktree list` and from C:/dev/wt.
- No background process from this review is running. Both background holds completed with exit 0 and released. The process query for the worktree path matched only the query's own shells.
- I wrote nothing in the repository or in C:/dev/wt/mm2b. The main checkout's porcelain is as it was at the start.
- My scratch files are in the session scratchpad: `g4-verify.log`, and `g4/sub.mjs`, `g4/mut.sh`, `g4/mut-*.log`, `g4/verify-cites.log`, `g4/verify-quotes.log`, `g4/verify-test-claims.log`, `g4/verify.log` and `g4/scripts-suite.log`.
