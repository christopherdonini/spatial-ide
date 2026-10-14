# PR #217 gate 2 — architect
Reviewed: cut/shell-migration-milestone-2-phase-b @ 7ffdb6a7757fd65c2f12a861e9a1f70ddea83e48

**Verdict: block, on Evidence only (E-1).** There are no Correctness findings. D-1 to D-4 are Documentation: each is fixed before the merge, with no re-gate. C-2 (OPEN-13), OPEN-14 and OPEN-15 stay with the human and are not judged here. C-2 still holds the merge until OPEN-13 is ruled and applied.

Scope of the read: the round's code and tests at 7ffdb6a7, the round's report, run 3, and the form's Amendments 11 and 10, plus 7 item 2 and §8 items 31 and 34 to 37. Amendment 11 and run 3 are on main at ca2eae15, not at 7ffdb6a7, so I cite them there. I have no Bash, so I recomputed no diff, count or hash. Whether the round touched only its findings is judged from the files the report names, which I read at the changed spans. The reviewer confirms the file list by `git diff 575cd4b3..7ffdb6a7 --stat`.

## Correctness: none. The gate 1 items are closed.

- **My C-1 is fixed.**
  - `frontends/shell/src/console/surfaceRegistry.ts:331-337 @ 7ffdb6a7` adds the class-C row `mode.set`. Its statement is marked `[P6 placeholder]` and follows the form of `tool.set` (`:324-330`).
  - `frontends/shell/src/App.tsx:1835-1839 @ 7ffdb6a7` returns early on an unchanged mode, then calls `transit`, then `recordNamed("gui-action", "mode.set")`. This mirrors `handleSelectTool` (`:1828-1832`).
  - RB16 (`frontends/shell/src/App.selection.test.tsx:650-657 @ 7ffdb6a7`) drives the real ToolSwitch buttons (`:291`). It asserts one row for a change of mode and none for the mode already chosen. Both mutations are recorded as observed at b258dff0 (`:633-636`).
  - docs/03's requirement (`docs/03_UX.md:13 @ 7ffdb6a7`) is met in the way every class-C row meets it: the row states that no API equivalent exists, through the same recorder path that `tool.set` uses.
  - Amendment 10 item 3(f) is rightly withdrawn (Amendment 11 item 1).
- **The reviewer's C1 is fixed.**
  - `App.tsx:1156 @ 7ffdb6a7` iterates `new Set([...ask.runs, ...exportRunsRef.current.values()])`. The Set dedupes by the shared `ExportRun` identity. Each run is marked before its single `cancel()` (`:1157-1161`), and the answer is never read.
  - Amendment 7 item 2(c) holds. The mark is set before the cancel. A run that already ended is decided at the choice (`:1159`), and a running one is decided in `ended` (`:1123-1126`). The statement is decided by the outcome only.
  - §8 item 31 holds: the cancel is no longer silent. Items 34 to 37 are untouched by the round.
  - RB12g (`App.selection.test.tsx:1008-1045 @ 7ffdb6a7`) is the reviewer's sequence through the real panel and dialog. It asserts:
    - the prepare's key and the execute's key are cancelled once each;
    - the old handle closes only after the execute's outcome;
    - the statement shows on `success`, and none shows on `refused`.
  - RB12g's mutation (`ask.runs` only) is recorded as observed at b258dff0.
- **S2: RB12f holds** (`App.selection.test.tsx:974-1006 @ 7ffdb6a7`). It pins `App.tsx:1135` (a second `confirmOpen` drops the first open as Keep):
  - the first open becomes `open.dropped`, with no row for the drop;
  - the ask is shown once;
  - the choice records one row;
  - no cancel is issued, and the export reaches its outcome.
  - Its mutation is observed. Amendment 11 item 3(f) records this as a change to the B3 promise, as my D-9 asked.

## Evidence

**E-1. The reviewer's E1 is not fully discharged. source-changed's post route was never run in phase B.** (This blocks.)
- The reviewer's E1 names "source-changed (both routes)" (`state/consults/gates/2026-10-12-shell-migration-milestone-2-phase-b-gate1-reviewer.md:56`). Phase A's base set, which is H3's base, has two source-changed rows: default and post (`state/consults/2026-10-11-shell-migration-milestone-2-phase-a-worker-report-1.md:35-36`).
- Run 3 has one source-changed row at each commit (`state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-3.md:16, :35 @ ca2eae15`), and the route is not named. With `SPATIAL_E2E_SOURCE_CHANGED_ROUTE` unset, the route is pre (`frontends/shell/e2e/source-changed.mjs:245-246 @ 7ffdb6a7`).
- Run 3's "fourteen" are the thirteen base suites plus selection, so the post-route row is the gap.
- The post route ends the session through the terminal path (`source-changed.mjs:1237-1246 @ 7ffdb6a7`). It still reaches `endSession` (`App.tsx:1303-1311 @ 7ffdb6a7`), which now ends the selection.
- Amendment 11 item 2 therefore claims more than the record proves.
- **Resolution:** run `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post node e2e/source-changed.mjs` at 7ffdb6a7, or at any commit with the head's product code. Record it, and correct item 2 by an appended row. Suggested row (not the human's wording): "Item 2 corrected: run 3 ran source-changed on its default route only; its post route passes at <commit> (<record>). Phase A's fourteen base rows and selection pass at 7ffdb6a7." The code needs no re-gate. The reviewer checks the run record.
- **My E-1 is discharged.** The ten suites pass at 719568f8, whose product code equals 575cd4b3's, and again at 7ffdb6a7 (run 3, both tables).

## Documentation (must-fix before the merge; no re-gate)

**D-1. Run 3's result cells for pan-anchor and residency-harness** (`run-3.md:18, :34, :37 @ ca2eae15`).
- pan-anchor prints one `PASS  <name>` line per case and a `==== n/n PASS ====` summary (`frontends/shell/e2e/pan-anchor.mjs:209, :293 @ 7ffdb6a7`). Phase A recorded it as 16/16. "0 PASS, 0 FAIL" is the record script's miscount.
- The pass itself stands: exit 0 means no failed case (`pan-anchor.mjs:292-298`), unless `--measure` was passed. The record should say that it was not.
- residency-harness gives no verdicts, so its cell should say "no verdicts; rc 0" and not "0 PASS".
- Fix by an appended row that gives each log's summary line.

**D-2. KNOWN-LIMITATIONS item 40 lost its source-change clause through my D-5 words** (`KNOWN-LIMITATIONS.md:377 @ 7ffdb6a7`; the worker flagged it, and Amendment 11 item 4 routes it).
- The item's title still names a source change.
- The text is a draft for the human's words (item 2e), so these are words for the human. They replace the body's second and third sentences:
  > Opening a dataset, the same file again or another, ends the selection and clears the inspected feature once the new dataset is open; an open that is refused, or dropped with Keep exporting, leaves both as they were. When the app ends the open dataset's session, as it does when the file changes on disk, both end at once, with no new open. If a selection stood, the Feature tab and the status bar then say how many selected features were dropped and why.
- Clause check, at 7ffdb6a7:
  - The reopen: `workspaceState.ts:140-141`, then `viewTransitions.ts:156-165`, which ends the selection and clears the inspection.
  - Refused or dropped opens: the rebind is only in `handleAdmitted`, and the null outcome is at `AdmissionPanel.tsx:329`.
  - The session end: `App.tsx:1303-1311`, which dispatches `resource.generationEnded`, then `workspaceState.ts:149-158`, with the reason `source-changed`. E-GEN asserts the source change.
  - "If a selection stood": `viewTransitions.ts:115` gives a notice only when `dropped > 0`. The text is at `FeatureTab.tsx:74-75`.

**D-3. A stale source comment from the D3 fix** (`frontends/shell/src/admission/AdmissionPanel.tsx:328 @ 7ffdb6a7`). The comment's "(Keep exporting)" omits the second case that the message on `:329` now names. This is not the human's wording. Words: `// A dropped open (Keep exporting, or replaced by a later open while the ask stood) has no kind of its own in \`OpenPathOutcome\`, which is outside this piece's files; it reads as a refusal with its own code.` Clause check: `App.tsx:1135` and the Keep branch of `answerOpenAsk`.

**D-4. Amendment 11 item 1 says my D-4 to D-7 were applied.** For KNOWN-LIMITATIONS items 36 and 38, the reviewer's D4 words were applied instead (`KNOWN-LIMITATIONS.md:359, :369 @ 7ffdb6a7`). They are the more complete words because they cover the pin, and they rightly replace mine. The amendment should say so. Appended correction (not the human's wording): "Item 1 corrected: KNOWN-LIMITATIONS items 36 and 38 carry the reviewer's D4 words; the architect's D-5 words were applied to item 40 only."

**Resolved as applied, no finding.**
- **My items:**
  - D-4: `frontends/shell/e2e/README.md:770, :772, :774 @ 7ffdb6a7` carry the words as given. The `SELECTION_EXPORT_TODAY` guard is at `selection.mjs:735`.
  - D-5: item 40's first clause, as D-2 above limits it.
  - D-6: `MANUAL-WALKTHROUGH.md:1826`, the Step cell.
  - D-7: the three placeholders are named in W11's Expected cell, described and not reworded.
- **The reviewer's items:**
  - D1: `selection.mjs:35-37`.
  - D3: `AdmissionPanel.tsx:329`.
  - D4: as D-4 above.
  - D5: `MANUAL-WALKTHROUGH.md:1816, :1824`.
- **Amendment 11 item 3's record corrections** match my D-1, D-2, D-3, D-8 and D-9 by reference, and match the reviewer's D7 (3(g)). Item 6 gives the superseded index.

## Notes
- **§7, the reviewer to recount.** With the amendments' additions, App.selection.test.tsx (1,046 of 1,290) and selection.mjs (707 of about 750) are within their ceilings. This round's head therefore needs no class 8 row. The round report's "overruns are class 8" reads against the base ceilings, which its filing note discloses.
- **The form.** Amendment 11 is on main only. The branch takes it when main is merged in before the merge.

## Files read
- C:/dev/spatial-ide/state/consults/gates/2026-10-12-shell-migration-milestone-2-phase-b-gate1-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-12-shell-migration-milestone-2-phase-b-gate1-reviewer.md
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-correction-round-1-report.md
- C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-3.md
- C:/dev/spatial-ide/state/consults/2026-10-11-shell-migration-milestone-2-phase-a-worker-report-1.md (lines 15-49)
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (Amendments 10 and 11, on main)
- C:/dev/spatial-ide/state/directives/2026-10-11-direction-after-status-review.md
- C:/dev/spatial-ide/docs/03_UX.md
- C:/dev/spatial-ide/.git/refs/heads/cut/shell-migration-milestone-2-phase-b and refs/remotes/origin/... (both 7ffdb6a7)
- In C:/dev/wt/mm2b at 7ffdb6a7:
  - frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (Amendment 7, §7's B-T row, §8, B3)
  - frontends/shell/src/App.tsx (1095-1184, 1303-1311, 1820-1844)
  - frontends/shell/src/App.selection.test.tsx (217, 290-302, 625-658, 960-1046)
  - frontends/shell/src/console/surfaceRegistry.ts (40-79, 290-407)
  - frontends/shell/src/admission/AdmissionPanel.tsx (326-331)
  - frontends/shell/src/workspace/viewTransitions.ts (150-166) and workspaceState.ts (130-164)
  - frontends/shell/e2e/selection.mjs (header, 735-738), README.md (762-775), pan-anchor.mjs (195-301), residency-harness.mjs (exit paths), source-changed.mjs (route selection)
  - frontends/shell/package.json (the e2e scripts)
  - frontends/shell/MANUAL-WALKTHROUGH.md (Part W)
  - KNOWN-LIMITATIONS.md (items 35 to 41)
  - docs/03_UX.md
