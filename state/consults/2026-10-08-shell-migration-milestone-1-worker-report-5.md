*Custodian's filing note (2026-10-08): `shell-migration-milestone-1`'s stage 5 worker report, the still-able-to-fail mutations the human allowed (`state/directives/2026-10-08-m1-mutations-branch-docs08-adr036.md`, item 1), at the branch head 512aab08aba237673da5daee82f70865cc0cc5cd (the same worker-high, resumed at 18:05:59Z, report at 18:40:14Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is c9cf552f646301074a23518e610972d705bd48ff1e6e15ef2e2514a5eb5ab6ef. The custodian read the diff 65391e79..512aab08 (comments only, 33 lines added over five e2e files). Seven mutations failed their check; the eighth, K6 case (v)'s recorded mutation, was not caught, and that goes to the human. Names below are at that head.*

---

# Stage 5 report: milestone 1 mutations

The permission system allowed every listed edit. Seven mutations were observed to fail their check. One, K6 case (v), was **not caught**: that is a finding for the human, not a pass.

Comments recording the mutations are committed and published as an ordinary update: **512aab08aba237673da5daee82f70865cc0cc5cd**, comments only, signed off, five e2e files. The worktree is clean at that commit, ports 9223 and 5400 have no listener, and no mutation was committed or left in place.

## Mutations

All were applied at 65391e79 in `C:/dev/wt/m1/frontends/shell`, one at a time. Each suite ran on a fresh launch (shim, `launched:true`) in a shared hold, the file was restored with `git checkout -- <file>`, and `git status --porcelain` printed empty before the next edit. Each listed line number matched at 65391e79; no edit was substituted.

| # | Check | Edit | Step that failed, and its message | Restore and clean check |
|---|---|---|---|---|
| 1 | post-route S4 | delete `traceStreamIssued(this.opts.dataset, ticket.stream);` (`src/streaming/tileViewportStreamManager.ts:1099`) | S4 failed: "S4-issue-one-query-and-touch-on-mint: timed out after 60000ms". S5a to S5d then failed (no session-ended block, 381076 resident vertices, no readout at the formerly occupied pixel, no `tile-session-ended-source-changed` line). | restored; porcelain empty |
| 2 | S5b, the file's recorded mutation | delete `canvas?.clearAllTiles();` (`src/residency/candidateArmSession.ts:1089`, in `endCandidateSession`) | S5b failed: "resident vertices are 381076 (features 20163), expected 0 -- the owner did not clear what it was showing". S4, S5a, S5c and S5d passed, as the file records. | restored; porcelain empty |
| 3 | A9' | `isBelowPickResolution` returns `true` (`src/canvas/pickResolution.ts:205`) | A9' failed: "A9': timed out after 120000ms" (the step's own bound; the walk never got an id). K6/continuous also failed: "no above-threshold hoverable candidate found". | restored; porcelain empty |
| 4 | K6 case (ii) | delete the `hover-readout-confirming-marker` span (`src/canvas/HoverReadoutView.tsx:88`) | K6 failed: "K6/discrete: the labelled state rendered at notch 1/8 with NO marker element ({"state":"confirming",... "marker":null})". A9' passed; K6 had reached case (ii). | restored; porcelain empty |
| 5 | K6 case (v), the recorded mutation | delete `lastPointerPxRef.current = null;` (`src/canvas/WorkingCanvas.tsx:1860`, in `onPointerRelease`) | **No failure.** K6 passed all five cases. Case (v) read `{"state":"clear"}`, an allowed answer. | restored; porcelain empty |
| 6 | FIND' | empty `resetFitForNewGeneration()` (delete `WorkingCanvas.tsx:1506-1507`) | FIND' failed: "filtered-and-completed canvas is effectively blank (0.000% non-bg, floor 0.080% for a 668 x 730 canvas, settled=true)". The earlier four steps passed. | restored; porcelain empty |
| 7 | CLASSC' | owner `"ADR-022 / ADR-023"` -> `"docs/03"` (`src/console/surfaceRegistry.ts:179`, the `style.setFillColor` row) | CLASSC' failed: "no .console-entry-class-c entry with an ADR-022 owner found after the style edit". | restored; porcelain empty |
| 8 | pan-anchor paint-vs-event | `vs.target[0]` -> `vs.target[0] * 1.1` in the `traceViewState` call (`WorkingCanvas.tsx:1943`) | The four paint-vs-event cases failed by name: small +85 "painted 83.0 vs deck 91.3 -> -8.28", small -85 "+8.29", large +250 "painted 243.9 vs deck 268.4 -> -24.48", large -250 "+24.43". The trace feeds every check, so normal-A and recenter-crossing-A failed too. there-and-back-net passed (a trace scale cancels in a net). | restored; porcelain empty |

**Mutation 5 is the finding.** The recorded mutation that HOVER-REPICK-PREREGISTRATION.md Amendment 5 describes does not bind K6 case (v) on the 668 x 730 map.
- I did not edit case (v). I did not find the cause, and I did not try a substitute edit.
- The finding is recorded as such in the `stepK6` comment (it says "NOT fail" and that the finding stands open).
- Whether (v) bound on the old map, and whether to re-aim it, are for the human.

## There-and-back-net: input-side control

- **Control.** A scratch copy of `pan-anchor.mjs` in the session scratchpad's m1w folder, outside the repository (`pa-short-return.mjs`). Its return drag is 60 px shorter than the outward one: `-(back - 60)`. The tracked file was never edited for this.
- **Run.** Against the unmodified product, through the wrapper, in a hold.
- **Result.** `there-and-back-net` failed at both sizes by name: "net residual -58.00 buffer px (tol 4)". 14/16 passed; every other check passed.
- **PR body.** There-and-back-net has no honest product mutation, and its control is this input-side one.

## Commands, exit codes and holds

Every heavy command ran inside `hold shared -Project SpatialIDE`, one per call, `cd` first, the command step alone.

| Run | rc |
|---|---|
| mutation 1, S4: `node e2e/source-changed.mjs` post route | 1 |
| mutation 2, S5b: same command | 1 |
| mutation 3, A9': `node e2e/regression.mjs` | 1 |
| mutation 4, K6 (ii): same command | 1 |
| mutation 5, K6 (v): same command | 1 (only C2'/C3', pre-existing, failed) |
| mutation 6, FIND': `node e2e/filter-panel.mjs` | 1 |
| mutation 7, CLASSC': `node e2e/console.mjs` | 1 |
| mutation 8, paint-vs-event: `node e2e/pan-anchor.mjs` | 1 |
| there-and-back-net control: scratch copy via `diag-run.mjs` | 1 |

The suites without a clean tree also fail on their pre-existing steps (C2'/C3', HEXLIM', GROUP', REGRESS'). Not held, because light: the `sed` edits, each `git checkout --` and `git status --porcelain`, `app-down.ps1` between runs, `node --check` on the five files, one `git commit` and one `git push` (each in its own call).

## Deviations

- **Class 3.** Some `git checkout -- <file>`, the clean check and the next `sed` edit shared a Bash call. The restore and the empty porcelain printed first, before the next edit ran.
- **Class 3.** The recorded comments include one sentence about mutation 5 not being caught. It is a fact, not a claim about the product.
- No product file was committed. The commit message names no other project and has no @mention.

**Model:** Sonnet 5.5 (claude-sonnet-5-5).
