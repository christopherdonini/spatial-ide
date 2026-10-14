# PR #217 gate 4 — architect
Reviewed: cut/shell-migration-milestone-2-phase-b @ d59f1a6abc0577a952940e1a34cbb76528ff1acc

**Verdict: pass, with Documentation findings.** Correctness and Evidence are closed for all three items, for (d) and for the test-order move. No finding blocks. D-1 to D-4 below must be fixed before the merge, with no re-gate. None of them is in the human's wording.

How I checked: I have no Bash, so I recomputed no diff, count, hash or CI result. The branch ref and its origin ref both read d59f1a6a, and main reads 117aac6c. I read the code at the worktree head and the run-5 scratch logs that the record names. The gate 4 reviewer owns the round's file list, the §7 recount, `npm run verify` and CI at d59f1a6a.

## Correctness: no finding

**(a) The late-cancel list.** It is option (B) of my gate 3 C-1 as I described it.
- `lateCancel` is a list. Both decision sites append: the ended handler and the choice (frontends/shell/src/App.tsx:1116, 1131, 1165 @ d59f1a6a).
- Both clears set `[]`: the next export report and the next `confirmOpen` (:1126, :1139).
- The render maps one `LateCancelStatement` per outcome in `region.layers` (:1912-1914).
- Against Amendment 7:
  - 2(c) is now met for each run: every run that satisfies the three conditions gets its statement, decided at the choice when it has already ended (SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1054-1061 @ d59f1a6a).
  - 2(d)'s clears are unchanged (:1065).
  - Item 3's operator-observable promise holds for each bundle (:1081-1084).
  - §8 item 31 holds (:759): no silent cancel.
  - §8 items 34 to 37 hold (:1134-1137). `lateCancelOutcome` and `LateCancelStatement` are untouched, `bundle_path` is shown whole, there is no timer, and nothing sits over the map.
- RB12g pass 4 drives the real panel and dialog through two finished executes under one ask. It asserts both paths in order, each run's key once, and one close (App.selection.test.tsx:1080-1116 @ d59f1a6a). Its mutation is observed (:1017-1020).

**(b) The double-click filter.** It meets the human's OPEN-14 words (round 72 directive, the 17:09:28Z message, the OPEN-14 line) and my Q2.
- The filter returns early on `event.type === "dblclick"`. It adds no timer and no delay (WorkingCanvas.tsx:2026-2029 @ d59f1a6a). `tapCount` is not used.
- The wiring test sends the real `{type, srcEvent}` shape, and a mutation is observed (WorkingCanvas.wiring.test.tsx:255-271 @ d59f1a6a).
- E-DBLCLICK observes three things on WebView2: the zoom rises, Navigate inspects nothing, and Select changes nothing. A single click still inspects. R3-DBL fails it (run-5 record, items (a) and (b)).

**(c) `tapPixel` and the tap's use of it.** It meets the adopted §2.2 words: my Q1 (a) replacement, which the human answered yes to in the OPEN-15 wording directive, item 1.
- Each clause against clickPick.ts:60-65 @ d59f1a6a:
  - the tap event's own client coordinates: `srcEvent.clientX` and `clientY`;
  - truncated first: `Math.trunc`, applied before any subtraction;
  - less the rect, then the border: `r.left`, then `clientLeft`;
  - divided by drawn size over layout size: `r.width / offsetWidth || 1`.
- That is mjolnir's `getOffsetPosition`, in its order.
- `createTapHandler` reads only `srcEvent` and the canvas (:69-75). §8 item 3 stands (form:512 @ d59f1a6a).
- Q1 (b): `srcEvent` is the `pointerup`. The product caller passes the same canvas it gives Deck (WorkingCanvas.tsx:1998-2006 @ d59f1a6a).
- `tapPixel` and `PixelBox` have a product caller. The seam is written against mjolnir's real event shape and proven end to end by E-KINDS on real deck.
- The unit cases meet Q1 (d) and the human's proof terms (clickPick.test.ts:125-153 @ d59f1a6a):
  - the recorded case, (331.5, 533.5) on a canvas at (266, 40), gives (65, 493);
  - the fractional left and top case, whose mutation subtracts before truncating;
  - the fractional drawn size case, at 715.453125, which is the canvas height run 5 measured. Its mutation drops the scale.
  - Each mutation is observed. I checked the expected values by hand: 65000/1000.5 and 352495/715.453125.
- E-KINDS' guard (selection.mjs:236-251, 494-502 @ d59f1a6a):
  - the point kind alone hovers and clicks at the unrounded `exact` position;
  - it prints `hits[0].css`;
  - it fails unless that position is fractional on both axes.

**(d) The gate 3 reviewer's D2, D3 and D5.**
- D2 is byte-identical to the reviewer's words (App.selection.test.tsx:1012 @ d59f1a6a).
- D3 is byte-identical (App.tsx:1160 @ d59f1a6a).
- D5 is applied with the reviewer's own "its statements" instruction, plus one consequential change, "ends them" (App.tsx:1114). See D-3.

**The round's reach.** By the three reports, the touched files are App.tsx, App.selection.test.tsx, WorkingCanvas.tsx, WorkingCanvas.wiring.test.tsx, clickPick.ts, clickPick.test.ts, selection.mjs, e2e/README.md and MANUAL-WALKTHROUGH.md. Each is in Amendment 14 item 6 or Amendment 15 item 4. Nothing I read goes beyond the three items, (d), the E-DBLCLICK move and W10a. The reviewer confirms the file list.

## Evidence: closed; notes only, none blocking

**The OPEN-15 (B) claim holds on the human's bound** (the OPEN-15 wording directive, item 2).
- The scratch `app-up.ps1` adds exactly one argument, `--force-device-scale-factor`, and only when `E2E_FORCE_DSF` is set (its line 17).
- The logs show the following:
  - `r3-scale-1.25`: DPR 1.25, Edg/154.0.4258.62, position (279.6, 417.2), E-KINDS PASS, 17 of 17;
  - `r3-scale-1.5`: DPR 1.5, position (241.67, 342.33), PASS;
  - `r3-scale-native-R3-ROUND`: DPR 1, position (331.5, 533.5). It FAILs with the inspected id null and the oracle 0, and the last-click line reads no feature there.
- Amendment 16 item 3 names exactly the factors that ran (form:1391 @ 117aac6c).

Notes:
- **N-1.** The rounding mutation ran only at ratio 1. At 1.25 and 1.5, rounding and truncation differ on x only at the printed positions, so those two passes rest on the guard, not on an observed discrimination. This matches the proof the human set, and Amendment 16 item 3 and the run-5 table disclose it.
- **N-2.** The native unmutated run's ratio is taken from the R3-ROUND run's probe at the same head. The record says so.
- **N-3.** E-DBLCLICK and E-ASK-TWO were mutated at f18dbefb, before the move. Their step bodies and the product lines they mutate did not change by d59f1a6a. The observations stand.
- **N-4.** No mutation pins the append at the ended-handler site (App.tsx:1131). It differs from a single slot only when a statement from the choice is already standing as a run ends after the choice. That needs the cancel to land after the kernel's last cancel check, the timing window D5 already names. RB12d still pins that this site decides the statement.

**The E-SEL-FILTER diagnosis holds.** In `r3-diag-selfilter-rect-f18dbefb.log`, lines 25-31:
- before the clicks, the status notice is one selected feature dropped by the reopen, and the canvas is [266,40,668,715.453125];
- after the first click it is [266,40,668,736];
- the later clicks land on stale points.

**The move hides nothing the form promises.**
- E-SEL-FILTER still asserts the same Apply and Clear counts.
- E-DBLCLICK still opens its own fixture and makes all its assertions.
- Each tap picks against the layout at the tap, so ordinary use sees the map move by one status line but gets no wrong pick.
- The move is the human's allowance "for now" (the OPEN-15 wording directive, item 3), and the shift is placed as `shell-status-bar-one-height`.

**Amendments 14 to 16 against the rulings and both gate 3 reports.**
- Amendment 14 matches the rulings:
  - item 1 is C-1 (B), the three items and no fourth round;
  - item 2: OPEN-13 is class 9, and its lines class 8;
  - item 4(a) is the reviewer's C1 fix;
  - item 4(d) is D2, D3 and D5.
- Amendment 14 item 7 is my gate 3 D-1 row, byte-identical (form:1365 @ 117aac6c).
- Amendment 15 item 1 supersedes Amendment 14 item 3 by name. Items 2 to 5 match the second directive.
- Amendment 16 items 1 to 3 resolve against the three reports and the run-5 record and its logs.
- The round count in item 4: the per-file counts in the reports sum to 250 of 410, and clickPick.ts is exactly at its cap of 25. The phase totals are the reviewer's to recount.

**Part W's W10a** (MANUAL-WALKTHROUGH.md:1826, 1848 @ d59f1a6a). It covers each part of the human's row: a real mouse, the display's own scaling, the edge of a point, a click, and recording whether the click selects what the readout names. It adds Select and Replace, a few repeats and the scale factor. Its expected cell is marked as a draft for the human.

**Noted, not judged (item 2e):** W10a's expected cell, the e2e README's Selection entry, and KNOWN-LIMITATIONS items 36, 38, 40 and 41.

## Documentation: must fix before the merge, no re-gate

Each finding below gives replacement words. None of these sentences is the human's wording, so the worker applies the words and the PR body lists them.

**D-1. The e2e README gives the wrong reason for E-DBLCLICK running last** (frontends/shell/e2e/README.md:770 @ d59f1a6a; the entry is a draft that is not the human's wording, :766).
- Replace `it reopens `filter-zoned`, builds its own scene and zooms, so it runs last` with:
  > it runs last: run earlier, its reopen ends the selection the steps before it made, the ended-selection notice takes a second line in the status bar, and the next click clears it, so the map grows under the following step's points (run 5's E-SEL-FILTER diagnosis; the move is `shell-status-bar-one-height`)
- Clause check:
  - the reopen drops one selected feature: diag log line 25;
  - the canvas height is 715.453125 with the notice and 736 after it clears: diag lines 25-26 and the run-5 record (:17 @ 117aac6c);
  - E-SEL-FILTER fails with the old order and passes with the new one: run-5 :9-12.

**D-2. PLAN.yaml carries the superseded tap rule** (PLAN.yaml:5083 @ 117aac6c, the `shell-real-app-run-macos-linux` summary). It has no border term and no scale term.
- Replace `the tap's pixel, truncated from the tap event's own client coordinates less the canvas rect, agrees with the hover's (claimed for WebView2 only)` with:
  > the tap's pixel, by the rule Amendment 15 item 1 adopts (the tap event's own client coordinates truncated, less the canvas rect and border, over drawn / layout size; `tapPixel` in clickPick.ts), agrees with the hover's (claimed for WebView2 Edg/154.0.4258.62 at device pixel ratios 1, 1.25 and 1.5, Amendment 16 item 3)
- Clause check: clickPick.ts:60-65 @ d59f1a6a, and form:1374, 1391 @ 117aac6c.

**D-3. D5 as applied reads as if one run had several statements** (App.tsx:1114 @ d59f1a6a).
- Replace `shows its statements, and an export report during that ask ends them before the next choice` with:
  > shows its statement, and an export report during that ask ends the statements shown before the next choice
- Clause check:
  - one outcome is appended per run: :1131;
  - a report clears the whole list: :1126.
- These are the reviewer's words, adapted for the list.

**D-4. The wiring test's doc line attributes the `pointerup` to deck.js** (WorkingCanvas.wiring.test.tsx:11-12 @ d59f1a6a). The native event comes from mjolnir; deck only passes it on (pre-build check Q1 (b)).
- Replace `and `event.srcEvent` is the tap's native `pointerup`, whose client coordinates give its pixel (`_onEvent`)` with:
  > and `event.srcEvent` is the tap's native `pointerup` (mjolnir.js 3.0.1 `dist/hammerjs/inputs/pointerevent.js`, passed on by deck's `_onEvent`), whose client coordinates give its pixel (`tapPixel`)
- Clause check: my pre-build check, Q1 (b) (:57-59 @ 117aac6c).

**Carried from gate 3 (the custodian confirms; I cannot read it):** the PR body's Form line names Amendment 16, and its §7 line carries Amendment 16 item 4's numbers.

## Files read
- C:/dev/spatial-ide/state/directives/2026-10-12-round-72-217-third-round-open-13-to-open-15.md
- C:/dev/spatial-ide/state/directives/2026-10-12-open-15-wording-webview2-scale-runs-status-bar-piece.md
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (Amendments 11 to 16, @ 117aac6c)
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-round-3-pre-build-architect.md
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-correction-round-3-report-items-a-b-d.md, -report-e2e-steps.md, -report-item-c.md
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-12-shell-migration-milestone-2-phase-b-gate3-architect.md and -gate3-reviewer.md
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-4.md (D4's correction, by search)
- C:/dev/spatial-ide/PLAN.yaml (the shell-real-app-run-macos-linux node, by search)
- C:/dev/spatial-ide/.git: refs/heads/main, refs/heads/cut/shell-migration-milestone-2-phase-b, refs/remotes/origin/cut/shell-migration-milestone-2-phase-b, worktrees/mm2b/HEAD
- In C:/dev/wt/mm2b @ d59f1a6a:
  - frontends/shell/src/canvas/clickPick.ts
  - frontends/shell/src/canvas/clickPick.test.ts (115-181)
  - frontends/shell/src/canvas/WorkingCanvas.tsx (1985-2044)
  - frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx (1-40, 225-314)
  - frontends/shell/src/App.tsx (1095-1189, 1900-1919)
  - frontends/shell/src/App.selection.test.tsx (1004-1118, mutation lines by search)
  - frontends/shell/e2e/selection.mjs (1-62, 225-274, 486-530, step lines by search)
  - frontends/shell/e2e/README.md (766-775)
  - frontends/shell/MANUAL-WALKTHROUGH.md (1820-1850)
  - the form (Amendment 7; §8 items 3, 4, 18 and 31)
- The custodian's scratchpad mm2b-e2e/:
  - app-up.ps1
  - mutations/R3-ROUND.patch
  - out/r3-scale-1.25-d59f1a6a.log, out/r3-scale-1.5-d59f1a6a.log, out/r3-scale-native-R3-ROUND-d59f1a6a.log and out/r5-selection-d59f1a6a.log (by search)
  - out/r3-diag-selfilter-rect-f18dbefb.log (by search)
