# COVERAGE — what has merged since v0.1.0, the walkthrough rows and KNOWN-LIMITATIONS items it touches, and the rows owed at the sitting (draft; decides nothing)

*Drafted 2026-11-03 by cloud session 8, read-only against `main` at `84a90e26` (84a90e26087b49eace4dd6fa19a8a9d3215b09df). It is the companion of `RELEASE-0.2-DRAFT.md` in this folder. It is a list for the sitting, not a verdict: a walkthrough verdict is the human's alone, and nothing here marks any row passed, waived or discharged. Every citation is `path:line @ 84a90e26` unless another commit is named. A commit hash given alone (for example `13df4cb5`) is a commit on `main`'s history at `84a90e26`, and `git show` reads it.*

---

## 0. Method, and where it is weak

**The pieces.**
- The pieces are the 225 pull requests merged on `main`'s first-parent line after the v0.1.0 tag: `git log --merges --first-parent v0.1.0..84a90e26`, keeping the "Merge pull request #N" commits. The tag is `b391e43` (governance/RELEASE-0.1.md:1282 @ 84a90e26).
- Each piece's files are `git diff --name-only <merge>^1 <merge>`.
- Each piece's node is the PLAN node whose `evidence.pr` is that number (governance/PLAN.yaml @ 84a90e26). 180 of the 225 have one.
- Two pieces shipped inside v0.1.0 through the release branch: #47 (governance/RELEASE-0.1.md:1212 @ 84a90e26) and #50, the merge-back (governance/RELEASE-0.1.md:1287 @ 84a90e26). They are listed in §3, but are not new in v0.2.

**The rows.**
- A row is a table row of `frontends/shell/MANUAL-WALKTHROUGH.md` whose first cell is a step id (A1, W8a, AC10, …) inside a `## Part …` section. One row is written `E4.5` (frontends/shell/MANUAL-WALKTHROUGH.md:244 @ 84a90e26).
- The automated-step tables, the fixture tables and the result logs are not rows. That gives 205 rows in 29 Parts.
- Two Parts are both headed "Part P" (frontends/shell/MANUAL-WALKTHROUGH.md:1457 @ 84a90e26 and :1616 @ 84a90e26). They are told apart here as **P (degrees)** and **P (points)**, as the sitting script does (state/drafts/sitting-script-2026-10-23.md:8-9 @ 84a90e26).

**A row's last operator-verified run.** This is the walkthrough's own evidence class: a human performing the numbered steps and recording the result (frontends/shell/MANUAL-WALKTHROUGH.md:8-15 @ 84a90e26). It is taken from two places:
- the dated entries in the walkthrough's result logs;
- for Part M, the release record, because the walkthrough's Part M section stayed a template: "the record is these amendments" (governance/RELEASE-0.1.md:1285 @ 84a90e26, pointing to Amendments 15 and 18 at governance/RELEASE-0.1.md:1183 @ 84a90e26 and :1258 @ 84a90e26).

The last dated operator entry in the walkthrough is 2026-09-23, N1's re-sight and N8's rerun (frontends/shell/MANUAL-WALKTHROUGH.md:1444-1449 @ 84a90e26). Every Part written after it has a blank result log. The decisions ledger's archive ends its felt verdicts with the same two sittings (state/cut-archive/DECISIONS-PENDING-2026-10-20.md:8 @ 84a90e26, :14 @ 84a90e26).

**A row's last change.** Three signals, each mechanical:
1. **Text.** `git blame --line-porcelain 84a90e26 -- frontends/shell/MANUAL-WALKTHROUGH.md` gives the commit that last changed the row's line. That commit is mapped to the first-parent merge that brought it onto `main`, or shown as "direct on main". Blame sees only the **last** edit to the line.
2. **Cited files.** These are the product files the row names, by path or by a basename unique among product files, and changed by a piece merged after the run. Most rows written before October name no file, so this signal is silent for them.
3. **Area.** These are the pieces merged after the run that changed a product file in the code area the row's Part exercises. Tests, `e2e/` and `__tests__/` are excluded. The areas and the Part-to-area table are **declared by this draft, not derived** (§0.1). They over-include on purpose: the `frame` area is `App.tsx`, `layout/`, `styles.css`, `workspace/` and `command/`, which host every surface. Only pieces merged since v0.1.0 are counted. Rows run before the tag also changed through earlier pieces, which are not counted.

**Status.**
- **never run**: no dated run is recorded.
- **changed since run**: a run is recorded, and at least one signal fired after it.
- **verified since last change**: a run is recorded after every signal. **No row has this status.**

**The sitting queue.** Two records were read:
- the `operator-sitting-queue` node (governance/PLAN.yaml:5861 @ 84a90e26);
- the order of the sitting script assembled for it (state/drafts/sitting-script-2026-10-23.md:5-17 @ 84a90e26), with its list of what joins on later merges (state/drafts/sitting-script-2026-10-23.md:323-339 @ 84a90e26).

Where the two disagree on how much of a Part runs, the row is marked **unsettled**. A Part named only in the script's join list is marked as such.

**What this method cannot see.**
- A run recorded somewhere other than the walkthrough, the release record or the ledger archive.
- A code path a row exercises outside its Part's declared area.
- An edit to a row's line that a later edit overwrote.
- Whether a change actually altered what the operator sees. A comment-only change to an area file still counts, so the area signal over-reports.

### 0.1 The declared areas

| Area | Path pattern (regular expression over product files; tests, e2e and __tests__ excluded) |
|---|---|
| frame | `^frontends/shell/src/(App\.tsx|layout/|styles\.css|workspace/|command/)` |
| canvas | `^frontends/shell/src/(canvas/|residency/|streaming/|feature/)|^engine/src/(stream|lod|geoarrow|wkb)\.rs|^kernel/src/skp\.rs` |
| admission | `^frontends/shell/src/admission/|^engine/src/(dataset|crs|crs_catalog|geoparquet|identity|error|descriptor|envelope|addressability)\.rs|^engine/src/crs-catalog\.json|^kernel/src/skp\.rs` |
| filter | `^frontends/shell/src/(filter|command)/|^engine/src/predicate\.rs|^engine/src/stream\.rs|^kernel/src/skp\.rs` |
| style | `^frontends/shell/src/style/|^renderer/bundle-viewer/src/` |
| publish | `^frontends/shell/src/publish/|^frontends/shell/src-tauri/src/(publish|commands)\.rs|^kernel/src/(publish|permission|bundle)/|^renderer/bundle-viewer/src/` |
| console | `^frontends/shell/src/console/` |
| package | `^frontends/shell/src-tauri/(tauri\.conf\.json|src/(lib|origin|main|state)\.rs|Cargo\.toml)|^frontends/shell/src/notices/|^renderer/bundle-viewer/notice` |
| watcher | `^engine/src/watch\.rs|^kernel/src/skp\.rs|^frontends/shell/src/(streaming|residency)/` |
| recording | `^kernel/src/(session_history|dataset_ref)\.rs|^frontends/shell/src-tauri/src/commands\.rs|^frontends/shell/src/style/` |
| table | `^frontends/shell/src/(table|attributes|feature)/|^engine/src/attributes\.rs` |
| selection | `^frontends/shell/src/(feature|canvas)/` |

| Part | Areas |
|---|---|
| A, D, P (degrees), P (points), S, T | frame, canvas, admission (A and D add the residency paths under canvas) |
| B, C, I, X | frame, admission |
| E | frame, filter, canvas |
| F | frame, style, publish |
| G | frame, publish |
| H | frame, canvas, admission, filter, style, publish |
| J | frame, console |
| K, L, V | frame, canvas |
| M | package, frame, canvas, admission, filter, style, publish |
| N | frame, admission, watcher, canvas, publish |
| Q | frame, watcher |
| R | publish, package |
| U, Z | frame |
| W | frame, selection, publish, filter |
| Y | frame, publish, canvas |
| AA | frame, recording, filter |
| AB | frame, filter |
| AC | frame, table |

---

## 1. Summary

- **225 pieces merged since v0.1.0** (§3).
  - 95 changed product code;
  - 68 changed tests only;
  - 17 changed operator-facing text only (the walkthrough, KNOWN-LIMITATIONS, README);
  - 45 changed governance, plan data, spikes, documentation or tooling.
  - The classification is by the files each diff touched.
- **205 walkthrough rows** (§4). **None has an operator-verified run since its last change.**
  - **93 rows have never been run.** Each belongs to a Part committed with a blank result log. Two are setup rows added before the tag.
  - **112 rows were run, and changed afterwards.**
    - In 45, the row's own text changed after the run (§2c).
    - In 37, a product file the row names changed after it.
    - In all 112, a merged piece changed a product file in the Part's declared area. In each of those Parts, the frame rebuilt by #195 (2026-10-09) is among them.
- **The last dated operator run is 2026-09-23** (frontends/shell/MANUAL-WALKTHROUGH.md:1444 @ 84a90e26). The sitting the queue waits for has no date. The human gives it, and until then no release is scheduled (governance/PLAN.yaml:5861 @ 84a90e26).

---

## 2. For the sitting: the rows with no operator-verified run since their last change

All 205 rows fall here. They are grouped by what the sitting can do with them.

### 2a. Never run, and on the sitting queue or a named route to it (66 rows)

| Part | Rows | Part heading | Merged piece it is the operator gate of (closing record) | On the sitting queue |
|---|---|---|---|---|
| P (degrees) | P1 | frontends/shell/MANUAL-WALKTHROUGH.md:1457 @ 84a90e26 | #112 (governance/forms/frontends/CRS-UNIT-FACT-AND-BOUNDS-PREREGISTRATION.md:527 @ 84a90e26) | yes: script state/drafts/sitting-script-2026-10-23.md:9 @ 84a90e26 (P1 only) |
| R | R1 | frontends/shell/MANUAL-WALKTHROUGH.md:1537 @ 84a90e26 | #165 (governance/forms/frontends/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md:373 @ 84a90e26) | own node, proposed (governance/PLAN.yaml:4015 @ 84a90e26), not on the queue node |
| P (points) | P1, P2, P3, P4, P5, P6, P7 | frontends/shell/MANUAL-WALKTHROUGH.md:1616 @ 84a90e26 | #185 (governance/forms/engine/GEOMETRY-POINTS-PREREGISTRATION.md:675 @ 84a90e26) | yes: node governance/PLAN.yaml:5861 @ 84a90e26; script state/drafts/sitting-script-2026-10-23.md:8 @ 84a90e26 |
| T | T1, T2, T3, T4, T5, T6 | frontends/shell/MANUAL-WALKTHROUGH.md:1674 @ 84a90e26 | #188 (governance/forms/engine/GEOMETRY-LINES-PREREGISTRATION.md:725 @ 84a90e26) | yes: node; script state/drafts/sitting-script-2026-10-23.md:10 @ 84a90e26 |
| W | W0, W1, W2, W3, W4, W5, W6, W7, W8, W8a, W9, W10, W10a, W11 | frontends/shell/MANUAL-WALKTHROUGH.md:1815 @ 84a90e26 | #212, #217 (governance/forms/frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1409 @ 84a90e26) | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| Y | Y0, Y1, Y2, Y3, Y4 | frontends/shell/MANUAL-WALKTHROUGH.md:1858 @ 84a90e26 | #219 (governance/forms/frontends/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md:598 @ 84a90e26) | unsettled: node names "Y (Y4)", script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names Y4; unsettled: node names "Y (Y4)", script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names Y4 only |
| Z | Z0, Z1, Z2, Z3, Z4 | frontends/shell/MANUAL-WALKTHROUGH.md:1883 @ 84a90e26 | #218 (governance/forms/frontends/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md:950 @ 84a90e26) | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| AA | AA0, AA1, AA2, AA3, AA4 | frontends/shell/MANUAL-WALKTHROUGH.md:1904 @ 84a90e26 | #222 (governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:958 @ 84a90e26) | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| AB | AB0, AB1, AB2, AB3, AB4, AB4a, AB5, AB6, AB7, AB8, AB9, AB10, AB11 | frontends/shell/MANUAL-WALKTHROUGH.md:1929 @ 84a90e26 | #233, #234 (governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:986 @ 84a90e26) | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11; unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AC | AC0, AC1, AC2, AC6, AC7, AC8, AC9, AC10, AC11 | frontends/shell/MANUAL-WALKTHROUGH.md:1972 @ 84a90e26 | #246, #253 (governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:1525 @ 84a90e26) | named only in the script's join list (state/drafts/sitting-script-2026-10-23.md:330 @ 84a90e26), not on the node; yes: node (joined on #253) |

Notes:
- **Part Y.** The node lists "Y (Y4)" and the script's order says "Part Y, Y4" (state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26). Whether Y0 to Y3 run at the sitting is not written down. Part Y is committed whole, with rows Y0 to Y4 and a blank result-log line for each of Y1 to Y4 (frontends/shell/MANUAL-WALKTHROUGH.md:1870-1881 @ 84a90e26).
- **Part AB.** The node says milestone 3's Part AB joined on #234's merge. The script's order says "Part AB (AB11)". Both readings are possible.
- **Part AC.** The node records only AC6 to AC8 joining, on #253's merge. PR A's rows AC0 to AC2 and AC9 to AC11 are named in the script's join list, "named, not checked" (state/drafts/sitting-script-2026-10-23.md:329-332 @ 84a90e26), and in no queue record since #246 merged on 2026-10-23.
- **Part R.** R1 has its own proposed node (governance/PLAN.yaml:4015 @ 84a90e26). The node says that until R1's log is filled, neither the exit seam nor Part R is discharged. R1 is not in the queue node's list.

### 2b. Never run, and on no queue record (27 rows)

This repeats, with rows and merged pieces, what the architect's scope proposal could not settle: "Six Parts have blank result logs at main that are not on the queue's list: Q, R, S, U, V and X" (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:209 @ 84a90e26). Part R is handled in §2a. Rows D0 and E4.5 are added here.

| Part | Rows | Part heading | Merged piece it is the operator gate of (closing record) | On the sitting queue |
|---|---|---|---|---|
| D | D0 | frontends/shell/MANUAL-WALKTHROUGH.md:187 @ 84a90e26 | #30 (before the tag) | no |
| E | E4.5 | frontends/shell/MANUAL-WALKTHROUGH.md:223 @ 84a90e26 | #30 (before the tag) | no |
| Q | Q1, Q2 | frontends/shell/MANUAL-WALKTHROUGH.md:1498 @ 84a90e26 | #127 (governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:582 @ 84a90e26) | no |
| S | S1, S2, S3, S4 | frontends/shell/MANUAL-WALKTHROUGH.md:1570 @ 84a90e26 | #182 (governance/forms/engine/MULTIPOLYGON-MP1-PREREGISTRATION.md:679 @ 84a90e26) | no |
| U | U1, U2, U3, U4, U5, U6, U7, U8, U9, U10 | frontends/shell/MANUAL-WALKTHROUGH.md:1722 @ 84a90e26 | #195 (governance/forms/frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md:734 @ 84a90e26) | no |
| V | V1, V2, V3, V4, V5, V6 | frontends/shell/MANUAL-WALKTHROUGH.md:1770 @ 84a90e26 | #207 (governance/forms/frontends/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:553 @ 84a90e26) | no |
| X | X1, X2, X3 | frontends/shell/MANUAL-WALKTHROUGH.md:1798 @ 84a90e26 | #214 (governance/forms/frontends/SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md:360 @ 84a90e26) | no |

- Each of Q, S, U, V and X calls itself the Operator gate of its piece's form, "discharged only once it has been run and its result log filled in" (frontends/shell/MANUAL-WALKTHROUGH.md:1500 @ 84a90e26, :1572 @ 84a90e26, :1724 @ 84a90e26, :1772 @ 84a90e26, :1800 @ 84a90e26).
- D0 and E4.5 were inserted on 2026-09-07 by #30, before the tag (`3ddeb22e`, `3137e126`). Both are DevTools steps that set the baseline residency arm (frontends/shell/MANUAL-WALKTHROUGH.md:213 @ 84a90e26, :244 @ 84a90e26). No run of Part D or Part E after that date is recorded.
- **For the human:** whether each of these is owed at the sitting, waived, or discharged elsewhere. This draft cannot tell.

### 2c. Run, then the row's own text changed after the run (45 rows)

Most of these are wording or location edits. #195's rows took the new frame's location words, #239's say when Current view is available, and #274's correct stale cites. A few changed what the row checks. G3 gained the expiry sentence (#236), F7 points at Part G with the CLI refusal line (#244), and C2 and C3 now expect the session tier (#204). Each needs reading before it is re-run.

| Part | Row | Last run | Last text change (commit, PR, date) | On the sitting queue |
|---|---|---|---|---|
| A | A1 (frontends/shell/MANUAL-WALKTHROUGH.md:156 @ 84a90e26) | 2026-08-14 | `13df4cb5`, #195, 2026-10-07 | no |
| A | A3 (frontends/shell/MANUAL-WALKTHROUGH.md:158 @ 84a90e26) | 2026-08-14 | `13df4cb5`, #195, 2026-10-07 | no |
| A | A4 (frontends/shell/MANUAL-WALKTHROUGH.md:159 @ 84a90e26) | 2026-08-14 | `13df4cb5`, #195, 2026-10-07 | no |
| B | B2 (frontends/shell/MANUAL-WALKTHROUGH.md:176 @ 84a90e26) | 2026-08-14 | `185dc9b3`, #206, 2026-10-10 | no |
| C | C2 (frontends/shell/MANUAL-WALKTHROUGH.md:184 @ 84a90e26) | 2026-08-14 | `cf2434e6`, #204, 2026-10-09 | no |
| C | C3 (frontends/shell/MANUAL-WALKTHROUGH.md:185 @ 84a90e26) | 2026-08-14 | `cf2434e6`, #204, 2026-10-09 | no |
| D | D2 (frontends/shell/MANUAL-WALKTHROUGH.md:215 @ 84a90e26) | 2026-08-14 | `13df4cb5`, #195, 2026-10-07 | no |
| D | D3 (frontends/shell/MANUAL-WALKTHROUGH.md:216 @ 84a90e26) | 2026-08-14 | `13df4cb5`, #195, 2026-10-07 | no |
| D | D4 (frontends/shell/MANUAL-WALKTHROUGH.md:217 @ 84a90e26) | 2026-08-14 | `3ddeb22e`, #30, 2026-09-07 | no |
| E | E1 (frontends/shell/MANUAL-WALKTHROUGH.md:240 @ 84a90e26) | 2026-08-15 | `13df4cb5`, #195, 2026-10-07 | no |
| E | E5 (frontends/shell/MANUAL-WALKTHROUGH.md:245 @ 84a90e26) | 2026-08-15 | `13df4cb5`, #195, 2026-10-07 | no |
| E | E7 (frontends/shell/MANUAL-WALKTHROUGH.md:247 @ 84a90e26) | 2026-08-15 | `13df4cb5`, #195, 2026-10-07 | no |
| F | F1 (frontends/shell/MANUAL-WALKTHROUGH.md:268 @ 84a90e26) | 2026-08-16 | `13df4cb5`, #195, 2026-10-07 | no |
| F | F7 (frontends/shell/MANUAL-WALKTHROUGH.md:274 @ 84a90e26) | 2026-08-16 | `8fbd04cc`, #244, 2026-10-22 | named in the script's join list (state/drafts/sitting-script-2026-10-23.md:17 @ 84a90e26; #244's rows) |
| F | F8 (frontends/shell/MANUAL-WALKTHROUGH.md:275 @ 84a90e26) | 2026-08-16 | `abc900f2`, #244, 2026-10-22 | named in the script's join list (state/drafts/sitting-script-2026-10-23.md:17 @ 84a90e26; #244's rows) |
| G | G1 (frontends/shell/MANUAL-WALKTHROUGH.md:326 @ 84a90e26) | 2026-08-17 | `b9369654`, #239, 2026-10-21 | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G2 (frontends/shell/MANUAL-WALKTHROUGH.md:327 @ 84a90e26) | 2026-08-17 | `13df4cb5`, #195, 2026-10-07 | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G3 (frontends/shell/MANUAL-WALKTHROUGH.md:328 @ 84a90e26) | 2026-08-17 | `42e6fc14`, #236, 2026-10-20 | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 (G3 on the node) |
| G | G4 (frontends/shell/MANUAL-WALKTHROUGH.md:329 @ 84a90e26) | 2026-08-17 | `13df4cb5`, #195, 2026-10-07 | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G5 (frontends/shell/MANUAL-WALKTHROUGH.md:330 @ 84a90e26) | 2026-08-17 | `13df4cb5`, #195, 2026-10-07 | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G7 (frontends/shell/MANUAL-WALKTHROUGH.md:332 @ 84a90e26) | 2026-08-17 | `76f4b922`, #244, 2026-10-23 | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G8 (frontends/shell/MANUAL-WALKTHROUGH.md:333 @ 84a90e26) | 2026-08-17 | `13df4cb5`, #195, 2026-10-07 | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| H | H6 (frontends/shell/MANUAL-WALKTHROUGH.md:453 @ 84a90e26) | 2026-08-22 | `13df4cb5`, #195, 2026-10-07 | no |
| H | H8 (frontends/shell/MANUAL-WALKTHROUGH.md:455 @ 84a90e26) | 2026-08-22 | `13df4cb5`, #195, 2026-10-07 | no |
| I | I1 (frontends/shell/MANUAL-WALKTHROUGH.md:586 @ 84a90e26) | 2026-08-30 | `13df4cb5`, #195, 2026-10-07 | no |
| I | I2 (frontends/shell/MANUAL-WALKTHROUGH.md:587 @ 84a90e26) | 2026-08-30 | `bbbfb5ed`, #32, 2026-09-08 | no |
| I | I3 (frontends/shell/MANUAL-WALKTHROUGH.md:588 @ 84a90e26) | 2026-08-30 | `2c457980`, #52, 2026-09-13 | no |
| I | I4 (frontends/shell/MANUAL-WALKTHROUGH.md:589 @ 84a90e26) | 2026-08-30 | `cf2434e6`, #204, 2026-10-09 | no |
| I | I5 (frontends/shell/MANUAL-WALKTHROUGH.md:590 @ 84a90e26) | 2026-08-30 | `cf2434e6`, #204, 2026-10-09 | no |
| I | I6 (frontends/shell/MANUAL-WALKTHROUGH.md:591 @ 84a90e26) | 2026-08-30 | `cf2434e6`, #204, 2026-10-09 | no |
| I | I8 (frontends/shell/MANUAL-WALKTHROUGH.md:593 @ 84a90e26) | 2026-08-30 | `cf2434e6`, #204, 2026-10-09 | no |
| J | J1 (frontends/shell/MANUAL-WALKTHROUGH.md:658 @ 84a90e26) | 2026-08-30 | `13df4cb5`, #195, 2026-10-07 | no |
| J | J3 (frontends/shell/MANUAL-WALKTHROUGH.md:660 @ 84a90e26) | 2026-08-30 | `13df4cb5`, #195, 2026-10-07 | no |
| J | J4 (frontends/shell/MANUAL-WALKTHROUGH.md:661 @ 84a90e26) | 2026-08-30 | `13df4cb5`, #195, 2026-10-07 | no |
| K | K1 (frontends/shell/MANUAL-WALKTHROUGH.md:739 @ 84a90e26) | 2026-09-02 | `3137e126`, #30, 2026-09-07 | no |
| K | K2 (frontends/shell/MANUAL-WALKTHROUGH.md:740 @ 84a90e26) | 2026-09-02 | `3137e126`, #30, 2026-09-07 | no |
| K | K3 (frontends/shell/MANUAL-WALKTHROUGH.md:741 @ 84a90e26) | 2026-09-02 | `3137e126`, #30, 2026-09-07 | no |
| L | L1 (frontends/shell/MANUAL-WALKTHROUGH.md:815 @ 84a90e26) | 2026-09-06 | `1a251a15`, #274, 2026-11-01 | no |
| L | L5 (frontends/shell/MANUAL-WALKTHROUGH.md:819 @ 84a90e26) | 2026-09-07 | `1a251a15`, #274, 2026-11-01 | yes: node (entry 48); script state/drafts/sitting-script-2026-10-23.md:14 @ 84a90e26 |
| M | M3 (frontends/shell/MANUAL-WALKTHROUGH.md:877 @ 84a90e26) | 2026-09-13 | `13df4cb5`, #195, 2026-10-07 | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M8 (frontends/shell/MANUAL-WALKTHROUGH.md:882 @ 84a90e26) | 2026-09-13 | `48329927`, #200, 2026-10-10 | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M10 (frontends/shell/MANUAL-WALKTHROUGH.md:884 @ 84a90e26) | 2026-09-13 | `13df4cb5`, #195, 2026-10-07 | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| N | N5 (frontends/shell/MANUAL-WALKTHROUGH.md:950 @ 84a90e26) | 2026-09-20 | `b9369654`, #239, 2026-10-21 | no |
| N | N6 (frontends/shell/MANUAL-WALKTHROUGH.md:951 @ 84a90e26) | 2026-09-20 | `b9a57805`, #231, 2026-10-19 | no |
| N | N8 (frontends/shell/MANUAL-WALKTHROUGH.md:953 @ 84a90e26) | 2026-09-23 | `aa30f99f`, #231, 2026-10-18 | no |

### 2d. Run, row text unchanged, and the Part's code area changed after the run (67 rows)

| Part | Rows | Last run of these rows | On the sitting queue |
|---|---|---|---|
| A | A2, A5, A6, A7, A8, A9, A10 | 2026-08-14 | no |
| B | B1, B3 | 2026-08-14 | no |
| C | C1 | 2026-08-14 | no |
| D | D1 | 2026-08-14 | no |
| E | E2, E3, E4, E6, E8 | 2026-08-15 | no |
| F | F2, F3, F4, F5, F6 | 2026-08-16 | no |
| G | G6 | 2026-08-17 | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G9, G11 | 2026-08-17, 2026-09-15 | no |
| H | H1, H2, H3, H4, H5, H7, H9 | 2026-08-22 | no |
| I | I7 | 2026-08-30 | no |
| J | J2, J5, J6 | 2026-08-30 | no |
| K | K4, K5, K6, K7 | 2026-09-02, 2026-09-14 | no |
| L | L2, L3, L4, L6, L7, L8, L9 | 2026-09-06, 2026-09-07, 2026-09-14 | no |
| M | M1, M2, M4, M5, M6, M7, M9, M11, M12, M13, M14, M15, M16, M17, M18 | 2026-09-13, 2026-09-14, 2026-09-15 | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| N | N1, N2, N3, N4, N7, N9 | 2026-09-20, 2026-09-23 | no |

- The architect's proposed release Part, the successor of Part M, would cover the hero path again on the v0.2 artifact (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26). That list is install and hash, notices, opens in three CRS conditions, filter, cards, select, attributes, table, colour by category, save and reopen, recovery, publish through the scan, the bundle in a browser, M12 mode 3 and M13's two values. It is not written yet.
- Rows of Parts A to L and N that it does not reach stay at their 2026-08/09 runs.
- K7, L7, L8, G11 and M16 to M18 were last run at the 2026-09-14/15 sitting on a dev build of `main` at `74465c0` (frontends/shell/MANUAL-WALKTHROUGH.md:1417 @ 84a90e26). They passed there, before #195's frame.

---

## 3. Every piece merged since v0.1.0, and the rows, areas and KNOWN-LIMITATIONS items it touches

How to read the columns:
- **Rows whose text it edited** comes from the piece's own diff of the walkthrough: the rows its added or changed lines fall on, at its merge commit.
- **Areas** are the declared areas of §0.1 that its product files fall in. The Parts each area reaches are in §0.1's second table.
- **KNOWN-LIMITATIONS items it edited** comes from its diff of `KNOWN-LIMITATIONS.md`, by item, at its merge commit.
- Merge commits are abbreviated. Each one is the "Merge pull request #N" commit on `main`.
- A dash means none.

| PR | Merged | Merge commit | PLAN node (line) | Kind | Rows whose text it edited | Areas whose product files it changed | KNOWN-LIMITATIONS items it edited |
|---|---|---|---|---|---|---|---|
| #40 | 2026-09-09 | `c2836f76` | — (branch `spike/entry69-static-crt`) | governance, docs or tooling | — | — | — |
| #41 | 2026-09-09 | `9d64a032` | — (branch `day/aidev-consolidation`) | governance, docs or tooling | — | — | — |
| #42 | 2026-09-09 | `2272178c` | — (branch `day/adr-index`) | product | — | — | — |
| #43 | 2026-09-10 | `3c378db5` | — (branch `docs/review-loop-amendment`) | governance, docs or tooling | — | — | — |
| #44 | 2026-09-11 | `869e185f` | `briefa-p1-p2` (governance/PLAN.yaml:140 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #45 | 2026-09-13 | `26876039` | `land-45` (governance/PLAN.yaml:306 @ 84a90e26) | product | K7 | canvas, watcher, selection | 13 |
| #46 | 2026-09-13 | `7e474325` | `briefa-entries-80-81` (governance/PLAN.yaml:158 @ 84a90e26) | product | — | admission | — |
| #47 — shipped in v0.1.0 via release/0.1.0 (governance/RELEASE-0.1.md:1212 @ 84a90e26) | 2026-09-13 | `b9fe3e64` | `entry-47-hover-repick` (governance/PLAN.yaml:86 @ 84a90e26) | product | L7, L8 | canvas, selection | — |
| #50 — the merge-back (governance/RELEASE-0.1.md:1287 @ 84a90e26) | 2026-09-13 | `e9900a3d` | `merge-back-pr-50` (governance/PLAN.yaml:68 @ 84a90e26) | product | M14, M15 | canvas, watcher, selection | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, unnumbered (filter-admission paragraph) |
| #51 | 2026-09-13 | `91cfb449` | `lod-feasibility-spike` (governance/PLAN.yaml:397 @ 84a90e26) | spike, plan data, docs or tooling | — | — | — |
| #52 | 2026-09-13 | `bf02011e` | `reaim-no-crs-fixture` (governance/PLAN.yaml:415 @ 84a90e26) | tests | B2, I3, I5 | — | — |
| #53 | 2026-09-13 | `4c258325` | `viewer-86-zoom-anchor` (governance/PLAN.yaml:379 @ 84a90e26) | product | — | style, publish | — |
| #54 | 2026-09-14 | `24a8f99f` | `autonomy-work-system` (governance/PLAN.yaml:433 @ 84a90e26) | tests | — | — | — |
| #55 | 2026-09-14 | `4619d4b4` | `polish-87-88-89` (governance/PLAN.yaml:344 @ 84a90e26) | product | — | canvas, watcher, selection | — |
| #56 | 2026-09-14 | `a6bd7d6a` | — (branch `governance/pages`) | governance, docs or tooling | — | — | — |
| #57 | 2026-09-14 | `a6646ca2` | `release-artifacts-from-ci` (governance/PLAN.yaml:1315 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #58 | 2026-09-14 | `024270d3` | `site-bugs-first` (governance/PLAN.yaml:558 @ 84a90e26) | tests | — | — | — |
| #59 | 2026-09-14 | `c3d258f4` | `polish-engine-lease-class` (governance/PLAN.yaml:362 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #60 | 2026-09-14 | `2bcb7fb7` | — (branch `governance/plan-2026-09-14`) | spike, plan data, docs or tooling | — | — | — |
| #61 | 2026-09-14 | `f3c97627` | `adr-023-decision-text` (governance/PLAN.yaml:576 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #62 | 2026-09-14 | `e0b32a64` | — (branch `docs/adr-033-accepted`) | product | — | filter | — |
| #63 | 2026-09-14 | `330ed643` | — (branch `docs/walkthrough-rows-86-89`) | docs (operator-facing text) | G11, M16, M17, M18 | — | — |
| #64 | 2026-09-14 | `82f061c2` | `hover-confirming-marker` (governance/PLAN.yaml:1351 @ 84a90e26) | product | — | frame, canvas, selection | — |
| #65 | 2026-09-14 | `30b3b7a1` | — (branch `governance/plan-2026-09-14b`) | spike, plan data, docs or tooling | — | — | — |
| #66 | 2026-09-14 | `333aeefe` | `adr-029-operation-lifecycle` (governance/PLAN.yaml:670 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #67 | 2026-09-14 | `a262b690` | — (branch `governance/plan-2026-09-14c`) | spike, plan data, docs or tooling | — | — | — |
| #68 | 2026-09-14 | `74465c02` | — (branch `governance/plan-2026-09-14d`) | spike, plan data, docs or tooling | — | — | — |
| #69 | 2026-09-14 | `1eed504d` | — (branch `governance/telegram-round-mirror`) | governance, docs or tooling | — | — | — |
| #70 | 2026-09-14 | `9f996209` | — (branch `governance/health-drives-metrics`) | governance, docs or tooling | — | — | — |
| #71 | 2026-09-15 | `8665adec` | — (branch `governance/autonomy-policy-2026-09-14`) | governance, docs or tooling | — | — | — |
| #72 | 2026-09-15 | `e55d581b` | — (branch `governance/pre-gate-self-checks`) | tests | — | — | — |
| #73 | 2026-09-15 | `4b7bdd60` | — (branch `fix/adr-index-drift-adr029`) | governance, docs or tooling | — | — | — |
| #75 | 2026-09-15 | `d12ba429` | — (branch `governance/flush-hardening`) | tests | — | — | — |
| #76 | 2026-09-15 | `5e0b2856` | — (branch `governance/health-strip-honest`) | tests | — | — | — |
| #77 | 2026-09-15 | `17b6cd80` | — (branch `fix/predicate-admission-fixture-race`) | tests | — | — | — |
| #78 | 2026-09-15 | `08ca30dd` | — (branch `polish/pan-anchor-95`) | product | — | canvas, selection | — |
| #79 | 2026-09-15 | `fcb9ded8` | `marker-wording-final` (governance/PLAN.yaml:597 @ 84a90e26) | product | — | canvas, selection | — |
| #80 | 2026-09-15 | `355ed9ac` | `lod-route-b-divergence` (governance/PLAN.yaml:1369 @ 84a90e26) | spike, plan data, docs or tooling | — | — | — |
| #81 | 2026-09-16 | `370ddcd7` | `engine-extension-autoload-off` (governance/PLAN.yaml:796 @ 84a90e26) | product | — | — | — |
| #82 | 2026-09-16 | `5675f073` | `self-check-false-readings` (governance/PLAN.yaml:451 @ 84a90e26) | tests | — | — | — |
| #83 | 2026-09-17 | `279ec774` | `briefa-p3-p6` (governance/PLAN.yaml:615 @ 84a90e26) | product | — | frame, canvas, admission, filter, publish, watcher | — |
| #84 | 2026-09-18 | `615d24ea` | `lod-tier-builder-route-b` (governance/PLAN.yaml:814 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #85 | 2026-09-18 | `14f6f100` | — (branch `record/residency-125-note-3`) | governance, docs or tooling | — | — | — |
| #86 | 2026-09-18 | `00b2e274` | `briefa-p3b-owner-side-invalidation` (governance/PLAN.yaml:998 @ 84a90e26) | product | — | frame, canvas, admission, filter, package, watcher, selection | — |
| #87 | 2026-09-18 | `0fdd7a47` | `governance-record-round-count` (governance/PLAN.yaml:943 @ 84a90e26) | spike, plan data, docs or tooling | — | — | — |
| #88 | 2026-09-18 | `612c711e` | — (branch `docs/source-consistency-handoff`) | spike, plan data, docs or tooling | — | — | — |
| #89 | 2026-09-18 | `9af7308d` | — (branch `docs/part-n-walkthrough`) | docs (operator-facing text) | N1, N2, N3, N4, N5, N6, N7, N8, N9 | — | — |
| #90 | 2026-09-19 | `f922a2c5` | `briefa-p3b-test-names` (governance/PLAN.yaml:2198 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #91 | 2026-09-19 | `5e44e51a` | `governance-verify-quotes` (governance/PLAN.yaml:870 @ 84a90e26) | tests | — | — | — |
| #92 | 2026-09-19 | `24c7c658` | `adr-029-g1-feasibility` (governance/PLAN.yaml:1424 @ 84a90e26) | spike, plan data, docs or tooling | — | — | — |
| #93 | 2026-09-19 | `0897610c` | `briefa-p6-describe-fields` (governance/PLAN.yaml:1073 @ 84a90e26) | product | N3 | admission | — |
| #94 | 2026-09-19 | `8c3480a0` | `briefa-p5-gate-tests` (governance/PLAN.yaml:1035 @ 84a90e26) | product | — | admission | — |
| #95 | 2026-09-19 | `b09985b6` | `briefa-p4-corpus-run` (governance/PLAN.yaml:1016 @ 84a90e26) | tests | — | — | — |
| #96 | 2026-09-19 | `8453dfa1` | `drill-clean-clone` (governance/PLAN.yaml:1278 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #97 | 2026-09-24 | `4380ae8e` | `shell-dependency-audit-piece` (governance/PLAN.yaml:1719 @ 84a90e26) | product | — | — | — |
| #98 | 2026-09-19 | `3fc4231f` | — (branch `docs/part-n-update`) | docs (operator-facing text) | N1, N2, N3, N6 | — | — |
| #99 | 2026-09-20 | `b27ec55d` | `governance-audit-npm-trees` (governance/PLAN.yaml:1499 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #100 | 2026-09-23 | `b500465d` | — (branch `fix/n8-reopen-reset`) | product | — | frame, canvas, selection | — |
| #101 | 2026-09-23 | `f6d888e7` | `briefa-p6-n8-reopen-reset` (governance/PLAN.yaml:1518 @ 84a90e26) | product | — | frame | — |
| #102 | 2026-09-24 | `2beaa33d` | `adr-013-display-statement` (governance/PLAN.yaml:1538 @ 84a90e26) | product | N1 | admission | — |
| #103 | 2026-09-24 | `b0032c80` | `accept-adr-015-a1` (governance/PLAN.yaml:1092 @ 84a90e26); `accept-adr-016-a1` (governance/PLAN.yaml:1111 @ 84a90e26); `accept-adr-013-instance` (governance/PLAN.yaml:1130 @ 84a90e26); `accept-adr-028-qualification` (governance/PLAN.yaml:1149 @ 84a90e26); `accept-adr-032` (governance/PLAN.yaml:1168 @ 84a90e26); `adr-032-decision` (governance/PLAN.yaml:1868 @ 84a90e26) | docs (operator-facing text) | — | — | 17 |
| #104 | 2026-09-24 | `8f89df97` | `drill-fix-release-only-guard` (governance/PLAN.yaml:1737 @ 84a90e26) | tests | — | — | — |
| #105 | 2026-09-24 | `ee427c46` | `drill-fix-fixture-watchdog` (governance/PLAN.yaml:1755 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #106 | 2026-09-24 | `88e11716` | `drill-fix-viewer-build-order` (governance/PLAN.yaml:1791 @ 84a90e26) | product | — | — | — |
| #107 | 2026-09-24 | `9ff0f1ad` | `governance-verify-gate-file-exists` (governance/PLAN.yaml:962 @ 84a90e26) | tests | — | — | — |
| #109 | 2026-09-24 | `0ea50d05` | `known-limitations-owed-rows` (governance/PLAN.yaml:1649 @ 84a90e26) | docs (operator-facing text) | — | — | 17, 18, 19, 20, 21, 22, 23 |
| #111 | 2026-09-24 | `bc9949c7` | `engine-tests-configured-connections` (governance/PLAN.yaml:980 @ 84a90e26) | product | — | — | — |
| #112 | 2026-09-24 | `8c58596c` | `crs-unit-fact-and-bounds` (governance/PLAN.yaml:1595 @ 84a90e26) | product | P1 | frame, canvas, admission, filter, watcher, selection | 17 |
| #113 | 2026-09-24 | `93140e98` | `adr-021-023-b1-notes` (governance/PLAN.yaml:652 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #114 | 2026-09-25 | `87e6b9e3` | — (branch `docs/adr-035-dataset-session-ended`) | tests | — | — | — |
| #115 | 2026-09-24 | `a3afbe2c` | `fixture-regeneration-entry-point` (governance/PLAN.yaml:1773 @ 84a90e26) | product | — | — | — |
| #116 | 2026-09-24 | `f165218a` | `kernel-ticket-drop-under-registry-lock` (governance/PLAN.yaml:1558 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #117 | 2026-09-24 | `aa79322b` | `governance-test-claims-superseded-scanner` (governance/PLAN.yaml:487 @ 84a90e26) | tests | — | — | — |
| #118 | 2026-09-25 | `0a03c0ee` | `governance-test-claims-withdrawn-marker` (governance/PLAN.yaml:907 @ 84a90e26) | tests | — | — | — |
| #119 | 2026-09-25 | `9f764c8e` | — (branch `docs/adr-035-acceptance`) | governance, docs or tooling | — | — | — |
| #120 | 2026-09-25 | `85bbe8d5` | `governance-hooks-cloud-inert` (governance/PLAN.yaml:2406 @ 84a90e26) | tests | — | — | — |
| #121 | 2026-09-25 | `31d7d34c` | — (branch `docs/b1-preregistration`) | spike, plan data, docs or tooling | — | — | — |
| #123 | 2026-09-27 | `ec501869` | — (branch `cloud/wave1-C`) | tests | — | — | — |
| #124 | 2026-09-27 | `dbc1ff41` | — (branch `cloud/wave1-B`) | governance, docs or tooling | — | — | — |
| #125 | 2026-09-26 | `515a8b3d` | `governance-test-claims-superseded-followups` (governance/PLAN.yaml:540 @ 84a90e26) | tests | — | — | — |
| #126 | 2026-09-26 | `ff346fa4` | `data-plane-origin-non-ascii` (governance/PLAN.yaml:2442 @ 84a90e26) | tests | — | — | — |
| #127 | 2026-09-26 | `9a42af20` | `engine-source-change-watcher` (governance/PLAN.yaml:2222 @ 84a90e26) | product | Q1, Q2 | frame, canvas, admission, filter, package, watcher | 23, 24, 25, 26, 27, 28 |
| #128 | 2026-09-27 | `36a1ea43` | `bundle-viewer-partition-offset-bounds` (governance/PLAN.yaml:2478 @ 84a90e26) | product | — | style, publish | 16, 29 |
| #129 | 2026-09-27 | `16df0d7c` | `governance-weekly-proposals-2026-09-26` (governance/PLAN.yaml:2623 @ 84a90e26) | tests | — | — | — |
| #130 | 2026-09-27 | `0c0b680f` | `data-plane-stream-registry-bound` (governance/PLAN.yaml:2460 @ 84a90e26) | tests | — | — | — |
| #131 | 2026-09-27 | `3718a39a` | `governance-stop-hook-lease` (governance/PLAN.yaml:2424 @ 84a90e26) | tests | — | — | — |
| #132 | 2026-09-27 | `0d80c702` | `corpus-reproducibility-record` (governance/PLAN.yaml:2496 @ 84a90e26) | spike, plan data, docs or tooling | — | — | — |
| #133 | 2026-09-27 | `1b92e968` | `exposure-profile-paths` (governance/PLAN.yaml:2839 @ 84a90e26) | product | — | publish | — |
| #134 | 2026-09-27 | `d6ec85af` | `b1-engine-kernel-half` (governance/PLAN.yaml:634 @ 84a90e26) | product | — | canvas, admission, filter, style, publish, watcher, recording, table | — |
| #135 | 2026-09-28 | `d04bb801` | — (branch `docs/adr-034-geometry-admission`) | tests | — | — | — |
| #136 | 2026-09-28 | `74a9b24b` | `kernel-generation-close-races` (governance/PLAN.yaml:2334 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #137 | 2026-09-28 | `81be9b63` | `test-claims-landedness-bound` (governance/PLAN.yaml:469 @ 84a90e26) | tests | — | — | — |
| #138 | 2026-09-28 | `32521982` | — (branch `docs/wave2-prompts`) | governance, docs or tooling | — | — | — |
| #139 | 2026-09-28 | `bb23bb35` | `wave2-b-admission-campaign-merge` (governance/PLAN.yaml:3299 @ 84a90e26) | tests | — | — | — |
| #140 | 2026-09-28 | `ab8ec3d8` | `suites-and-toolchain-beyond-windows` (governance/PLAN.yaml:3122 @ 84a90e26) | product | — | publish | — |
| #141 | 2026-09-29 | `d4972e07` | `watcher-first-read-on-watch-thread` (governance/PLAN.yaml:3281 @ 84a90e26) | product | — | watcher | — |
| #143 | 2026-09-29 | `468a0ae3` | `b1-close-nul-column-names` (governance/PLAN.yaml:3335 @ 84a90e26) | product | — | canvas, admission, filter, watcher, table | — |
| #144 | 2026-09-30 | `c9438211` | — (branch `docs/b-1-adr-021-note`) | governance, docs or tooling | — | — | — |
| #145 | 2026-09-30 | `8959f51e` | `filter-bind-admission-implicit-coercions` (governance/PLAN.yaml:3317 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #146 | 2026-09-30 | `1e0b4707` | `engine-cancel-before-stream-window` (governance/PLAN.yaml:3032 @ 84a90e26) | product | — | canvas, filter | — |
| #147 | 2026-09-30 | `bff107ea` | `kernel-ticket-liveness-redeem-wording` (governance/PLAN.yaml:2873 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #148 | 2026-09-30 | `98ad9ca7` | `publish-refusal-codes-and-attempt-lifecycle` (governance/PLAN.yaml:2977 @ 84a90e26) | product | — | — | — |
| #149 | 2026-09-30 | `88e238bd` | — (branch `cut/publish-refusal-src-tauri`) | product | — | publish | — |
| #150 | 2026-10-01 | `90f70047` | `kernel-close-dataset-unknown-keeps-openrecord` (governance/PLAN.yaml:3441 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #151 | 2026-10-01 | `6e84e0a3` | `catalog-open-replace-drop-latency-note` (governance/PLAN.yaml:2641 @ 84a90e26) | product | — | — | — |
| #152 | 2026-10-02 | `415bb3b0` | `audit-reader-char-boundary` (governance/PLAN.yaml:3085 @ 84a90e26) | product | — | publish | — |
| #153 | 2026-10-02 | `cdf147f7` | `exposure-scan-ci-backstop` (governance/PLAN.yaml:3655 @ 84a90e26) | tests | — | — | — |
| #154 | 2026-10-02 | `629d9694` | `round-mirror-pretooluse-hook` (governance/PLAN.yaml:3707 @ 84a90e26) | tests | — | — | — |
| #156 | 2026-10-02 | `8a8002ad` | `test-claims-same-pr-superseded-pin` (governance/PLAN.yaml:3690 @ 84a90e26) | tests | — | — | — |
| #157 | 2026-10-02 | `51ed3b25` | `workspace-rustfmt` (governance/PLAN.yaml:3672 @ 84a90e26) | product | — | canvas, admission, filter, publish, package, watcher, recording, table | — |
| #158 | 2026-10-02 | `e4e864ec` | `publish-panel-rs-regex-layout` (governance/PLAN.yaml:3775 @ 84a90e26) | tests | — | — | — |
| #159 | 2026-10-02 | `ec746529` | `questions-mirror-t11-copy-glob` (governance/PLAN.yaml:3809 @ 84a90e26) | tests | — | — | — |
| #160 | 2026-10-03 | `d3ecb9e7` | `skp-cancel-state-closed-set` (governance/PLAN.yaml:3103 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #161 | 2026-10-03 | `56264a6e` | `stop-hook-stale-continuity` (governance/PLAN.yaml:3724 @ 84a90e26) | tests | — | — | — |
| #162 | 2026-10-03 | `25b57c4a` | — (branch `cut/port-1-linux-l1`) | product | — | publish | 1 |
| #163 | 2026-10-03 | `4e3c8a8b` | — (branch `cut/publish-attempt-lifecycle-src-tauri`) | product | R1 | publish, package, recording | 28, 30 |
| #164 | 2026-10-03 | `e863d155` | `port-1-linux-l1` (governance/PLAN.yaml:3583 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #165 | 2026-10-03 | `25d75079` | `publish-attempt-lifecycle-src-tauri` (governance/PLAN.yaml:2995 @ 84a90e26) | product | R1 | publish, recording | 30 |
| #166 | 2026-10-03 | `ab70bf87` | `lead-data-pilot-setup` (governance/PLAN.yaml:3962 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #167 | 2026-10-03 | `cb4d3283` | `subagent-write-audit-script` (governance/PLAN.yaml:4032 @ 84a90e26) | tests | — | — | — |
| #168 | 2026-10-03 | `844865e6` | `kernel-ticket-drop-followups` (governance/PLAN.yaml:1576 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #169 | 2026-10-04 | `bcf3b5b4` | `guardian-v0` (governance/PLAN.yaml:4067 @ 84a90e26) | tests | — | — | — |
| #172 | 2026-10-04 | `a8cb80d4` | `evidence-recorder-v0` (governance/PLAN.yaml:4085 @ 84a90e26) | tests | — | — | — |
| #173 | 2026-10-04 | `f3426ba8` | `watch-grandparent-spawn-signal` (governance/PLAN.yaml:2890 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #174 | 2026-10-04 | `95500097` | `timing-tests-assert-property-not-budget` (governance/PLAN.yaml:2532 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #175 | 2026-10-05 | `a83e95f5` | `timing-assertions-under-contention` (governance/PLAN.yaml:2942 @ 84a90e26) | tests | — | — | — |
| #176 | 2026-10-05 | `0b7e1b62` | `data-plane-terminal-without-credit` (governance/PLAN.yaml:4261 @ 84a90e26) | product | — | — | — |
| #177 | 2026-10-05 | `e29a725b` | `evidence-recorder-v0-1` (governance/PLAN.yaml:4296 @ 84a90e26) | tests | — | — | — |
| #178 | 2026-10-05 | `f12a8eac` | `b1-engine-kernel-half-followups` (governance/PLAN.yaml:2908 @ 84a90e26) | product | — | canvas, filter | — |
| #179 | 2026-10-06 | `8009b721` | — (branch `docs/adr-034-acceptance-words`) | governance, docs or tooling | — | — | — |
| #180 | 2026-10-06 | `d704c7e0` | — (branch `docs/proportional-gates`) | governance, docs or tooling | — | — | — |
| #181 | 2026-10-06 | `af8790a6` | `compaction-record-and-resume-line` (governance/PLAN.yaml:4332 @ 84a90e26) | tests | — | — | — |
| #182 | 2026-10-06 | `c4c251d4` | `geometry-types-beyond-polygons` (governance/PLAN.yaml:1387 @ 84a90e26) | product | S1, S2, S3, S4 | frame, canvas, admission, filter, publish, watcher, selection | 9, 21, 30, 31, 32, 33, 34 |
| #183 | 2026-10-06 | `0f86b680` | `guardian-n1-before-auto-compaction` (governance/PLAN.yaml:4350 @ 84a90e26) | tests | — | — | — |
| #184 | 2026-10-06 | `9721b23b` | `mods-readme-local-scope` (governance/PLAN.yaml:5673 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #185 | 2026-10-07 | `37b42002` | `geometry-points-cut` (governance/PLAN.yaml:2296 @ 84a90e26) | product | P1, P2, P3, P4, P5, P6, P7 | canvas, admission, filter, watcher, selection | 31, 32, 33, 34, 35, 36 |
| #186 | 2026-10-07 | `6288cccc` | `kernel-close-races-followups` (governance/PLAN.yaml:3140 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #187 | 2026-10-07 | `0b624143` | `typed-terminal-codes-post-check-race` (governance/PLAN.yaml:4368 @ 84a90e26) | tests | — | — | — |
| #188 | 2026-10-08 | `e888787e` | `geometry-lines-cut` (governance/PLAN.yaml:2315 @ 84a90e26) | product | T1, T2, T3, T4, T5, T6 | canvas, admission, filter, watcher, selection | 31, 32, 33, 36, 37, 38 |
| #189 | 2026-10-08 | `ccb68555` | `data-plane-crowded-start-detail-spaces` (governance/PLAN.yaml:2695 @ 84a90e26) | tests | — | — | — |
| #190 | 2026-10-08 | `3e754dfc` | `b2-piece-1a-step-record-and-dataset-reference` (governance/PLAN.yaml:5451 @ 84a90e26) | product | — | admission, recording | — |
| #191 | 2026-10-08 | `f816d467` | `verify-cites-pinned-citations` (governance/PLAN.yaml:5041 @ 84a90e26) | tests | — | — | — |
| #193 | 2026-10-08 | `f310e1ca` | `adr-032-staleness-docs` (governance/PLAN.yaml:5078 @ 84a90e26) | spike, plan data, docs or tooling | — | — | — |
| #194 | 2026-10-08 | `7ddba6b7` | `docs-08-public-data-sentence` (governance/PLAN.yaml:5096 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #195 | 2026-10-09 | `e7086242` | `shell-migration-milestone-1` (governance/PLAN.yaml:3159 @ 84a90e26) | product | A1, A3, A4, B2, D2, D3, E1, E5, E7, F1, G1, G2, G4, G5, G7, G8, H6, H8, I1, J1, J3, J4, M3, M8, M10, N5, N6, Q1, R1, S3, P4, T4, T5, U1, U2, U3, U4, U5, U6, U7, U8, U9, U10 | frame, admission, publish, console | 18, 38, 39 |
| #196 | 2026-10-09 | `4ee8a269` | `e2e-hover-establishing-read-stale` (governance/PLAN.yaml:5241 @ 84a90e26) | tests | — | — | — |
| #197 | 2026-10-09 | `b8ad22ff` | `covering-names-missing-column` (governance/PLAN.yaml:3459 @ 84a90e26) | product | — | admission | 9 |
| #199 | 2026-10-10 | `1280e7e0` | `wire-bytes-invariant-trace-flag-race` (governance/PLAN.yaml:5295 @ 84a90e26) | tests | — | — | — |
| #200 | 2026-10-10 | `59c567d1` | `known-limitations-item-8-filter-not-published` (governance/PLAN.yaml:4686 @ 84a90e26) | docs (operator-facing text) | M8 | — | 8 |
| #201 | 2026-10-10 | `7b3d8040` | `stream-flush-cancel-exit-marks-producer-cancelled` (governance/PLAN.yaml:4933 @ 84a90e26) | product | — | canvas, filter | — |
| #202 | 2026-10-11 | `c6627398` | `filter-identity-alias-ambiguous-reached-through-skp` (governance/PLAN.yaml:4632 @ 84a90e26) | product | — | filter | — |
| #203 | 2026-10-11 | `d381e474` | `shell-stale-layout-comments-and-s1-row` (governance/PLAN.yaml:4613 @ 84a90e26); `shell-stale-frame-comments` (governance/PLAN.yaml:5222 @ 84a90e26) | product | S1 | canvas, style, publish, console, watcher, recording, selection | — |
| #204 | 2026-10-11 | `e17758b7` | `e2e-stale-expectations-reaim` (governance/PLAN.yaml:5004 @ 84a90e26) | product | C2, C3, I4, I5, I6, I8, N6 | — | 3 |
| #205 | 2026-10-11 | `3a3876a3` | `known-limitations-item-2-on-main-paragraph` (governance/PLAN.yaml:4704 @ 84a90e26) | docs (operator-facing text) | — | — | 2, 19, 20, 22 |
| #206 | 2026-10-11 | `4c6680e7` | `crs-undeclared-message-wording` (governance/PLAN.yaml:4914 @ 84a90e26) | product | B2 | admission | — |
| #207 | 2026-10-11 | `3802aab7` | `shell-map-refill-after-resize` (governance/PLAN.yaml:5433 @ 84a90e26) | product | V1, V2, V3, V4, V5, V6 | frame, canvas, selection | 39 |
| #208 | 2026-10-11 | `c95d27b8` | `ported-code-notice-route` (governance/PLAN.yaml:5132 @ 84a90e26) | product | — | package | — |
| #209 | 2026-10-11 | `0bc12abd` | `module-docs-stale-statements` (governance/PLAN.yaml:3997 @ 84a90e26) | product | — | admission, filter, publish | — |
| #210 | 2026-10-11 | `08a642b7` | `skp-v0-live-sections-current-area-c` (governance/PLAN.yaml:4668 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #211 | 2026-10-11 | `236103b3` | — (branch `docs/wording-block-rule`) | governance, docs or tooling | — | — | — |
| #212 | 2026-10-11 | `6670f4fb` | — (branch `cut/shell-migration-milestone-2-phase-a`) | product | — | frame | — |
| #213 | 2026-10-11 | `3dacdeb6` | — (branch `docs/recorder-retired`) | governance, docs or tooling | — | — | — |
| #214 | 2026-10-12 | `c61cba22` | `shell-crs-form-for-format-default-contradicted` (governance/PLAN.yaml:5151 @ 84a90e26) | product | X1, X2, X3 | admission | 2 |
| #215 | 2026-10-14 | `4095407c` | `known-limitations-current-view-stale-box` (governance/PLAN.yaml:4880 @ 84a90e26) | docs (operator-facing text) | — | — | 29, 42 |
| #216 | 2026-10-14 | `9132af64` | `guardian-v1` (governance/PLAN.yaml:4314 @ 84a90e26) | tests | — | — | — |
| #217 | 2026-10-14 | `71fd2c4f` | `shell-migration-milestone-2` (governance/PLAN.yaml:5330 @ 84a90e26) | product | W0, W1, W2, W3, W4, W5, W6, W7, W8, W8a, W9, W10, W10a, W11 | frame, canvas, admission, publish, console, table, selection | 36, 38, 39, 40, 41 |
| #218 | 2026-10-14 | `2ef82ba5` | `shell-status-bar-one-height` (governance/PLAN.yaml:5469 @ 84a90e26) | product | Z0, Z1, Z2, Z3, Z4 | frame | — |
| #219 | 2026-10-14 | `e57e6436` | `export-current-view-after-unreported-fit` (governance/PLAN.yaml:4863 @ 84a90e26) | product | Y0, Y1, Y2, Y3, Y4 | frame, publish | 42 |
| #220 | 2026-10-14 | `d6ef74b0` | `stale-test-names-and-comments` (governance/PLAN.yaml:4723 @ 84a90e26) | product | — | admission | — |
| #221 | 2026-10-14 | `c08b3eb2` | `known-limitations-item-40-source-comment` (governance/PLAN.yaml:4741 @ 84a90e26) | docs (operator-facing text) | — | — | 40 |
| #222 | 2026-10-16 | `6282b5ed` | `b2-piece-1b-recording` (governance/PLAN.yaml:5537 @ 84a90e26) | product | AA0, AA1, AA2, AA3, AA4 | frame, canvas, admission, filter, style, publish, console, package, watcher, recording | 41, 43 |
| #223 | 2026-10-17 | `cb46f85a` | `known-limitations-crs-epoch-edges-third-axis` (governance/PLAN.yaml:4897 @ 84a90e26) | docs (operator-facing text) | — | — | 42, 44 |
| #224 | 2026-10-17 | `46e56dc9` | `engine-clause-composition-properties` (governance/PLAN.yaml:5554 @ 84a90e26) | tests | — | — | — |
| #225 | 2026-10-17 | `2db0b676` | `e2e-readme-status-bar-steps` (governance/PLAN.yaml:5520 @ 84a90e26) | tests | — | — | — |
| #226 | 2026-10-17 | `78fcdf23` | `governance-search-ignore-historical` (governance/PLAN.yaml:5588 @ 84a90e26) | tests | — | — | — |
| #227 | 2026-10-18 | `4e03f85a` | — (branch `cut/unknown-attempt-step-1`) | product | — | — | — |
| #228 | 2026-10-17 | `0e3fe016` | `known-limitations-item-41-source-comment` (governance/PLAN.yaml:5793 @ 84a90e26) | docs (operator-facing text) | — | — | 41 |
| #229 | 2026-10-19 | `4b2a9976` | `governance-cut-state-cap-and-rotation` (governance/PLAN.yaml:5605 @ 84a90e26) | tests | — | — | — |
| #230 | 2026-10-20 | `3fa90769` | `known-limitations-item-23-watcher-idle-end` (governance/PLAN.yaml:5827 @ 84a90e26) | docs (operator-facing text) | — | — | 23 |
| #231 | 2026-10-20 | `6b829c08` | `source-changed-post-reopen-routes-watcher-visible` (governance/PLAN.yaml:4595 @ 84a90e26) | tests | N6, N8, Q1 | — | — |
| #232 | 2026-10-20 | `022665f9` | `governance-decisions-pending-open-and-archive` (governance/PLAN.yaml:5622 @ 84a90e26) | tests | — | — | — |
| #233 | 2026-10-20 | `116ecb3e` | — (branch `cut/shell-migration-milestone-3-pr-a`) | product | — | frame, admission, filter, publish | — |
| #234 | 2026-10-20 | `45a5a5cd` | `shell-migration-milestone-3` (governance/PLAN.yaml:5348 @ 84a90e26) | product | AB0, AB1, AB2, AB3, AB4, AB4a, AB5, AB6, AB7, AB8, AB9, AB10, AB11 | frame, filter, console | 39, 43, 45, 46 |
| #235 | 2026-10-21 | `682551f7` | `source-changed-post-route-s5d-race` (governance/PLAN.yaml:5691 @ 84a90e26) | product | — | — | — |
| #236 | 2026-10-21 | `3e8c848b` | `publish-approval-ttl-ten-minutes` (governance/PLAN.yaml:5980 @ 84a90e26) | product | G3 | publish | — |
| #237 | 2026-10-21 | `16b3d360` | `governance-plan-summaries-archive` (governance/PLAN.yaml:5997 @ 84a90e26) | spike, plan data, docs or tooling | — | — | — |
| #238 | 2026-10-21 | `398ed6ea` | `connection-reuse-recycled-interrupt-flake` (governance/PLAN.yaml:5708 @ 84a90e26) | product | — | canvas, admission, filter | — |
| #239 | 2026-10-21 | `4350a4a9` | `walkthrough-current-view-rows-g1-n5` (governance/PLAN.yaml:5503 @ 84a90e26) | docs (operator-facing text) | G1, N5 | — | — |
| #240 | 2026-10-21 | `e8f110bb` | `adr-036-pre-acceptance-block` (governance/PLAN.yaml:6014 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #241 | 2026-10-26 | `872fd257` | `bundle-redaction-scan-not-in-product-publish` (governance/PLAN.yaml:5725 @ 84a90e26) | product | — | style, publish, package | 47 |
| #242 | 2026-10-23 | `c52abe27` | `verify-quotes-round-item-cites` (governance/PLAN.yaml:5878 @ 84a90e26) | tests | — | — | — |
| #243 | 2026-10-23 | `c1f782db` | `stale-assertion-messages-and-product-comments` (governance/PLAN.yaml:4758 @ 84a90e26) | product | — | canvas, admission, selection | — |
| #244 | 2026-10-26 | `f7da7961` | `walkthrough-row-f7-cli-refusal` (governance/PLAN.yaml:4775 @ 84a90e26) | docs (operator-facing text) | F7, F8, G7 | — | — |
| #245 | 2026-10-23 | `33578f46` | `questions-mirror-item-count` (governance/PLAN.yaml:3741 @ 84a90e26) | tests | — | — | — |
| #246 | 2026-10-23 | `1b6b04a6` | — (branch `cut/b1-shell-half-pr-a`) | product | AC0, AC1, AC2, AC9, AC10, AC11 | frame, canvas, style, console, watcher, recording, table, selection | 46, 51, 52 |
| #247 | 2026-10-23 | `bd9a0dbf` | `verify-cites-pin-resolution-and-line-zero` (governance/PLAN.yaml:5186 @ 84a90e26) | tests | — | — | — |
| #248 | 2026-10-24 | `4356db14` | `flush-crlf-field-rewrite` (governance/PLAN.yaml:3792 @ 84a90e26) | tests | — | — | — |
| #249 | 2026-10-26 | `dbba229a` | `known-limitations-items-51-52-render-numbers` (governance/PLAN.yaml:4792 @ 84a90e26) | docs (operator-facing text) | — | — | 47 |
| #250 | 2026-10-24 | `4a1a3c39` | `publish-sort-window-cancel-not-exercised-on-ci` (governance/PLAN.yaml:4524 @ 84a90e26) | tests | — | — | — |
| #251 | 2026-10-25 | `bc5be853` | `guardian-parity-git-timeout-under-load` (governance/PLAN.yaml:6065 @ 84a90e26) | tests | — | — | — |
| #252 | 2026-10-27 | `a39738a0` | `covering-case-collision-binds-other-column` (governance/PLAN.yaml:4488 @ 84a90e26) | product | — | admission | 9, 53 |
| #253 | 2026-10-25 | `edf6bfa9` | — (branch `cut/b1-shell-half-pr-c`) | product | AC6, AC7, AC8 | frame, canvas, console, watcher, table, selection | 52, 54, 55, 56 |
| #254 | 2026-10-25 | `7228b715` | `autonomy-section-36-filler-slot` (governance/PLAN.yaml:4810 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #255 | 2026-10-25 | `b50ad639` | `stream-evaluation-failure-fixed-detail` (governance/PLAN.yaml:3477 @ 84a90e26) | product | — | canvas, filter | — |
| #256 | 2026-10-25 | `a06916bb` | `governance-hash-grammar-shared` (governance/PLAN.yaml:505 @ 84a90e26) | tests | — | — | — |
| #257 | 2026-10-26 | `45df07bd` | `verify-cites-out-of-range-line-count` (governance/PLAN.yaml:6116 @ 84a90e26) | tests | — | — | — |
| #258 | 2026-10-26 | `1d2e2283` | `kernel-close-during-open-admission` (governance/PLAN.yaml:3389 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #259 | 2026-10-26 | `8a27ba7d` | `session-generation-t1-t3-reobservation` (governance/PLAN.yaml:3194 @ 84a90e26) | tests | — | — | — |
| #260 | 2026-10-26 | `00347e1c` | `slice-traced-test-cross-stamping` (governance/PLAN.yaml:4577 @ 84a90e26) | tests | — | — | — |
| #261 | 2026-10-26 | `5c879ae5` | `session-generation-other-recorded-mutations-name-no-commit` (governance/PLAN.yaml:3211 @ 84a90e26) | tests | — | — | — |
| #262 | 2026-10-28 | `d511f06e` | `verify-cites-past-end-bound` (governance/PLAN.yaml:6133 @ 84a90e26) | tests | — | — | — |
| #263 | 2026-10-28 | `9a2a9df4` | `fixture-s-regeneration-entry-point` (governance/PLAN.yaml:4560 @ 84a90e26) | tests | — | — | — |
| #264 | 2026-10-28 | `a6a89695` | `first-batch-factorial-ignored-trace-tests` (governance/PLAN.yaml:4542 @ 84a90e26) | tests | — | — | — |
| #265 | 2026-10-28 | `e2d4bb71` | `governance-hash-ref-leading-dot-path` (governance/PLAN.yaml:523 @ 84a90e26) | tests | — | — | — |
| #266 | 2026-10-28 | `fa720a7f` | `admitted-integer-overflow-silent-wraparound` (governance/PLAN.yaml:3513 @ 84a90e26) | product | — | package | — |
| #267 | 2026-10-28 | `f5f91424` | `corpus-line-files` (governance/PLAN.yaml:4420 @ 84a90e26) | tests | — | — | — |
| #268 | 2026-10-29 | `073a5476` | `stream-fetch-overflow-fixed-detail` (governance/PLAN.yaml:3530 @ 84a90e26) | product | — | canvas, filter | — |
| #269 | 2026-10-30 | `01c16562` | `open-dataset-refuses-a-name-closed-during-admission` (governance/PLAN.yaml:3406 @ 84a90e26) | product | — | canvas, admission, filter, watcher | — |
| #270 | 2026-10-31 | `578ec704` | `governance-f-tidy-repository-in-place` (governance/PLAN.yaml:6185 @ 84a90e26) | docs (operator-facing text) | — | — | — |
| #271 | 2026-11-03 | `daa4b8ff` | `adr-020-appended-note` (governance/PLAN.yaml:5946 @ 84a90e26) | governance, docs or tooling | — | — | — |
| #272 | 2026-11-03 | `355ddae3` | `verify-cites-reversed-range` (governance/PLAN.yaml:6294 @ 84a90e26) | tests | — | — | — |
| #273 | 2026-11-03 | `8d933d26` | `engine-cancel-before-execute-siblings` (governance/PLAN.yaml:2714 @ 84a90e26) | product | — | admission | — |
| #274 | 2026-11-03 | `242a6178` | `walkthrough-stale-cites-l5-degrees-p1` (governance/PLAN.yaml:6082 @ 84a90e26) | docs (operator-facing text) | L1, L5, P1 | — | — |
| #275 | 2026-11-03 | `6b67d44b` | `verify-quotes-cite-listing-line-count` (governance/PLAN.yaml:6150 @ 84a90e26) | tests | — | — | — |
| #277 | 2026-11-03 | `60d8e266` | `stream-cancel-returns-left-unmarked` (governance/PLAN.yaml:4951 @ 84a90e26) | product | — | canvas, filter | — |

---

## 4. Every walkthrough row

How to read the columns:
- **Last operator-verified run** cites the result-log line and the verdict line.
- **Row text last changed** is git blame's commit for the row's line, with the merge that brought it.
- **PRs after the run in the Part areas** counts every piece merged after the run that changed a product file in the Part's declared areas. It also counts, in brackets, how many of those are the operator-facing pieces `RELEASE-0.2-DRAFT.md` names. §5 lists them by Part.

| Part | Row | Line | Last operator-verified run | Row text last changed (commit, PR, date) | Text changed after the run | Cited product files changed after the run | PRs after the run in the Part areas | Status | On the sitting queue |
|---|---|---|---|---|---|---|---|---|---|
| A | A1 | frontends/shell/MANUAL-WALKTHROUGH.md:156 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :999 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 67 (41 operator-facing) | changed since run | no |
| A | A2 | frontends/shell/MANUAL-WALKTHROUGH.md:157 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :999 @ 84a90e26) | `76ee453e`, direct on main, 2026-08-10 | no | — | 67 (41 operator-facing) | changed since run | no |
| A | A3 | frontends/shell/MANUAL-WALKTHROUGH.md:158 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :999 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 67 (41 operator-facing) | changed since run | no |
| A | A4 | frontends/shell/MANUAL-WALKTHROUGH.md:159 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :999 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 67 (41 operator-facing) | changed since run | no |
| A | A5 | frontends/shell/MANUAL-WALKTHROUGH.md:160 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :999 @ 84a90e26) | `76ee453e`, direct on main, 2026-08-10 | no | — | 67 (41 operator-facing) | changed since run | no |
| A | A6 | frontends/shell/MANUAL-WALKTHROUGH.md:161 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :999 @ 84a90e26) | `76ee453e`, direct on main, 2026-08-10 | no | — | 67 (41 operator-facing) | changed since run | no |
| A | A7 | frontends/shell/MANUAL-WALKTHROUGH.md:162 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :999 @ 84a90e26) | `b2fa82ca`, direct on main, 2026-08-14 | no | — | 67 (41 operator-facing) | changed since run | no |
| A | A8 | frontends/shell/MANUAL-WALKTHROUGH.md:163 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :999 @ 84a90e26) | `1094e79a`, direct on main, 2026-08-11 | no | — | 67 (41 operator-facing) | changed since run | no |
| A | A9 | frontends/shell/MANUAL-WALKTHROUGH.md:164 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :999 @ 84a90e26) | `1094e79a`, direct on main, 2026-08-11 | no | — | 67 (41 operator-facing) | changed since run | no |
| A | A10 | frontends/shell/MANUAL-WALKTHROUGH.md:165 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :999 @ 84a90e26) | `1094e79a`, direct on main, 2026-08-11 | no | — | 67 (41 operator-facing) | changed since run | no |
| B | B1 | frontends/shell/MANUAL-WALKTHROUGH.md:175 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :1017 @ 84a90e26) | `76ee453e`, direct on main, 2026-08-10 | no | — | 54 (35 operator-facing) | changed since run | no |
| B | B2 | frontends/shell/MANUAL-WALKTHROUGH.md:176 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :1017 @ 84a90e26) | `185dc9b3`, #206, 2026-10-10 | yes | — | 54 (35 operator-facing) | changed since run | no |
| B | B3 | frontends/shell/MANUAL-WALKTHROUGH.md:177 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :1017 @ 84a90e26) | `76ee453e`, direct on main, 2026-08-10 | no | — | 54 (35 operator-facing) | changed since run | no |
| C | C1 | frontends/shell/MANUAL-WALKTHROUGH.md:183 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :1019 @ 84a90e26) | `76ee453e`, direct on main, 2026-08-10 | no | — | 54 (35 operator-facing) | changed since run | no |
| C | C2 | frontends/shell/MANUAL-WALKTHROUGH.md:184 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :1019 @ 84a90e26) | `cf2434e6`, #204, 2026-10-09 | yes | — | 54 (35 operator-facing) | changed since run | no |
| C | C3 | frontends/shell/MANUAL-WALKTHROUGH.md:185 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :1019 @ 84a90e26) | `cf2434e6`, #204, 2026-10-09 | yes | — | 54 (35 operator-facing) | changed since run | no |
| D | D0 | frontends/shell/MANUAL-WALKTHROUGH.md:213 @ 84a90e26 | none recorded | `3ddeb22e`, #30, 2026-09-07 | — | — | n/a (never run) | **never run** | no |
| D | D1 | frontends/shell/MANUAL-WALKTHROUGH.md:214 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :1020 @ 84a90e26) | `4177eec6`, direct on main, 2026-08-13 | no | — | 67 (41 operator-facing) | changed since run | no |
| D | D2 | frontends/shell/MANUAL-WALKTHROUGH.md:215 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :1020 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 67 (41 operator-facing) | changed since run | no |
| D | D3 | frontends/shell/MANUAL-WALKTHROUGH.md:216 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :1020 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 67 (41 operator-facing) | changed since run | no |
| D | D4 | frontends/shell/MANUAL-WALKTHROUGH.md:217 @ 84a90e26 | 2026-08-14 (frontends/shell/MANUAL-WALKTHROUGH.md:991 @ 84a90e26; :1020 @ 84a90e26) | `3ddeb22e`, #30, 2026-09-07 | yes | — | 67 (41 operator-facing) | changed since run | no |
| E | E1 | frontends/shell/MANUAL-WALKTHROUGH.md:240 @ 84a90e26 | 2026-08-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1030 @ 84a90e26; :1034 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 58 (32 operator-facing) | changed since run | no |
| E | E2 | frontends/shell/MANUAL-WALKTHROUGH.md:241 @ 84a90e26 | 2026-08-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1030 @ 84a90e26; :1034 @ 84a90e26) | `046b41d7`, direct on main, 2026-08-14 | no | — | 58 (32 operator-facing) | changed since run | no |
| E | E3 | frontends/shell/MANUAL-WALKTHROUGH.md:242 @ 84a90e26 | 2026-08-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1030 @ 84a90e26; :1034 @ 84a90e26) | `046b41d7`, direct on main, 2026-08-14 | no | — | 58 (32 operator-facing) | changed since run | no |
| E | E4 | frontends/shell/MANUAL-WALKTHROUGH.md:243 @ 84a90e26 | 2026-08-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1030 @ 84a90e26; :1034 @ 84a90e26) | `046b41d7`, direct on main, 2026-08-14 | no | — | 58 (32 operator-facing) | changed since run | no |
| E | E4.5 | frontends/shell/MANUAL-WALKTHROUGH.md:244 @ 84a90e26 | none recorded | `3137e126`, #30, 2026-09-07 | — | #45; #47; #50; #55; #64; #78; #86; #112; #182; #185; #188; #203; #207; #217; #246; #253 | n/a (never run) | **never run** | no |
| E | E5 | frontends/shell/MANUAL-WALKTHROUGH.md:245 @ 84a90e26 | 2026-08-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1030 @ 84a90e26; :1034 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 58 (32 operator-facing) | changed since run | no |
| E | E6 | frontends/shell/MANUAL-WALKTHROUGH.md:246 @ 84a90e26 | 2026-08-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1030 @ 84a90e26; :1034 @ 84a90e26) | `046b41d7`, direct on main, 2026-08-14 | no | — | 58 (32 operator-facing) | changed since run | no |
| E | E7 | frontends/shell/MANUAL-WALKTHROUGH.md:247 @ 84a90e26 | 2026-08-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1030 @ 84a90e26; :1034 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 58 (32 operator-facing) | changed since run | no |
| E | E8 | frontends/shell/MANUAL-WALKTHROUGH.md:248 @ 84a90e26 | 2026-08-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1030 @ 84a90e26; :1034 @ 84a90e26) | `046b41d7`, direct on main, 2026-08-14 | no | — | 58 (32 operator-facing) | changed since run | no |
| F | F1 | frontends/shell/MANUAL-WALKTHROUGH.md:268 @ 84a90e26 | 2026-08-16 (frontends/shell/MANUAL-WALKTHROUGH.md:1053 @ 84a90e26; :1060 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 34 (25 operator-facing) | changed since run | no |
| F | F2 | frontends/shell/MANUAL-WALKTHROUGH.md:269 @ 84a90e26 | 2026-08-16 (frontends/shell/MANUAL-WALKTHROUGH.md:1053 @ 84a90e26; :1060 @ 84a90e26) | `29eebd18`, direct on main, 2026-08-15 | no | — | 34 (25 operator-facing) | changed since run | no |
| F | F3 | frontends/shell/MANUAL-WALKTHROUGH.md:270 @ 84a90e26 | 2026-08-16 (frontends/shell/MANUAL-WALKTHROUGH.md:1053 @ 84a90e26; :1060 @ 84a90e26) | `29eebd18`, direct on main, 2026-08-15 | no | — | 34 (25 operator-facing) | changed since run | no |
| F | F4 | frontends/shell/MANUAL-WALKTHROUGH.md:271 @ 84a90e26 | 2026-08-16 (frontends/shell/MANUAL-WALKTHROUGH.md:1053 @ 84a90e26; :1060 @ 84a90e26) | `29eebd18`, direct on main, 2026-08-15 | no | #182; #185; #188; #243; #246 | 34 (25 operator-facing) | changed since run | no |
| F | F5 | frontends/shell/MANUAL-WALKTHROUGH.md:272 @ 84a90e26 | 2026-08-16 (frontends/shell/MANUAL-WALKTHROUGH.md:1053 @ 84a90e26; :1060 @ 84a90e26) | `29eebd18`, direct on main, 2026-08-15 | no | — | 34 (25 operator-facing) | changed since run | no |
| F | F6 | frontends/shell/MANUAL-WALKTHROUGH.md:273 @ 84a90e26 | 2026-08-16 (frontends/shell/MANUAL-WALKTHROUGH.md:1053 @ 84a90e26; :1060 @ 84a90e26) | `29eebd18`, direct on main, 2026-08-15 | no | — | 34 (25 operator-facing) | changed since run | no |
| F | F7 | frontends/shell/MANUAL-WALKTHROUGH.md:274 @ 84a90e26 | 2026-08-16 (frontends/shell/MANUAL-WALKTHROUGH.md:1053 @ 84a90e26; :1060 @ 84a90e26) | `8fbd04cc`, #244, 2026-10-22 | yes | #152; #157; #241 | 34 (25 operator-facing) | changed since run | named in the script's join list (state/drafts/sitting-script-2026-10-23.md:17 @ 84a90e26; #244's rows) |
| F | F8 | frontends/shell/MANUAL-WALKTHROUGH.md:275 @ 84a90e26 | 2026-08-16 (frontends/shell/MANUAL-WALKTHROUGH.md:1053 @ 84a90e26; :1060 @ 84a90e26) | `abc900f2`, #244, 2026-10-22 | yes | — | 34 (25 operator-facing) | changed since run | named in the script's join list (state/drafts/sitting-script-2026-10-23.md:17 @ 84a90e26; #244's rows) |
| G | G1 | frontends/shell/MANUAL-WALKTHROUGH.md:326 @ 84a90e26 | 2026-08-17 (frontends/shell/MANUAL-WALKTHROUGH.md:1074 @ 84a90e26; :1080 @ 84a90e26) | `b9369654`, #239, 2026-10-21 | yes | #195; #203; #217; #219; #233 | 34 (25 operator-facing) | changed since run | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G2 | frontends/shell/MANUAL-WALKTHROUGH.md:327 @ 84a90e26 | 2026-08-17 (frontends/shell/MANUAL-WALKTHROUGH.md:1074 @ 84a90e26; :1080 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 34 (25 operator-facing) | changed since run | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G3 | frontends/shell/MANUAL-WALKTHROUGH.md:328 @ 84a90e26 | 2026-08-17 (frontends/shell/MANUAL-WALKTHROUGH.md:1074 @ 84a90e26; :1080 @ 84a90e26) | `42e6fc14`, #236, 2026-10-20 | yes | #157; #236 | 34 (25 operator-facing) | changed since run | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 (G3 on the node) |
| G | G4 | frontends/shell/MANUAL-WALKTHROUGH.md:329 @ 84a90e26 | 2026-08-17 (frontends/shell/MANUAL-WALKTHROUGH.md:1074 @ 84a90e26; :1080 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | #157 | 34 (25 operator-facing) | changed since run | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G5 | frontends/shell/MANUAL-WALKTHROUGH.md:330 @ 84a90e26 | 2026-08-17 (frontends/shell/MANUAL-WALKTHROUGH.md:1074 @ 84a90e26; :1080 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | #83; #134; #157; #182; #209; #241 | 34 (25 operator-facing) | changed since run | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G6 | frontends/shell/MANUAL-WALKTHROUGH.md:331 @ 84a90e26 | 2026-08-17 (frontends/shell/MANUAL-WALKTHROUGH.md:1074 @ 84a90e26; :1080 @ 84a90e26) | `29005d4e`, direct on main, 2026-08-17 | no | — | 34 (25 operator-facing) | changed since run | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G7 | frontends/shell/MANUAL-WALKTHROUGH.md:332 @ 84a90e26 | 2026-08-17 (frontends/shell/MANUAL-WALKTHROUGH.md:1074 @ 84a90e26; :1080 @ 84a90e26) | `76f4b922`, #244, 2026-10-23 | yes | — | 34 (25 operator-facing) | changed since run | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G8 | frontends/shell/MANUAL-WALKTHROUGH.md:333 @ 84a90e26 | 2026-08-17 (frontends/shell/MANUAL-WALKTHROUGH.md:1074 @ 84a90e26; :1080 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | #83; #149; #157; #163; #165; #182; #219; #236; #241 | 34 (25 operator-facing) | changed since run | yes: script state/drafts/sitting-script-2026-10-23.md:13 @ 84a90e26 |
| G | G9 | frontends/shell/MANUAL-WALKTHROUGH.md:334 @ 84a90e26 | 2026-08-17 (frontends/shell/MANUAL-WALKTHROUGH.md:1074 @ 84a90e26; :1080 @ 84a90e26) | `066a3cd7`, direct on main, 2026-08-16 | no | — | 34 (25 operator-facing) | changed since run | no |
| G | G11 | frontends/shell/MANUAL-WALKTHROUGH.md:335 @ 84a90e26 | 2026-09-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1421 @ 84a90e26) | `52434f25`, #63, 2026-09-14 | no | — | 32 (23 operator-facing) | changed since run | no |
| H | H1 | frontends/shell/MANUAL-WALKTHROUGH.md:448 @ 84a90e26 | 2026-08-22 (frontends/shell/MANUAL-WALKTHROUGH.md:1110 @ 84a90e26; :1114 @ 84a90e26) | `c33ffcdd`, direct on main, 2026-08-17 | no | #182; #185; #188; #246 | 80 (47 operator-facing) | changed since run | no |
| H | H2 | frontends/shell/MANUAL-WALKTHROUGH.md:449 @ 84a90e26 | 2026-08-22 (frontends/shell/MANUAL-WALKTHROUGH.md:1110 @ 84a90e26; :1114 @ 84a90e26) | `c33ffcdd`, direct on main, 2026-08-17 | no | — | 80 (47 operator-facing) | changed since run | no |
| H | H3 | frontends/shell/MANUAL-WALKTHROUGH.md:450 @ 84a90e26 | 2026-08-22 (frontends/shell/MANUAL-WALKTHROUGH.md:1110 @ 84a90e26; :1114 @ 84a90e26) | `c33ffcdd`, direct on main, 2026-08-17 | no | #59; #62; #64; #83; #86; #100; #101; #112; #127; #134; #143; #145; #157; #182; #195; #202; #207; #209; #212; #217; #219; #222; #233; #234; #246; #253 | 80 (47 operator-facing) | changed since run | no |
| H | H4 | frontends/shell/MANUAL-WALKTHROUGH.md:451 @ 84a90e26 | 2026-08-22 (frontends/shell/MANUAL-WALKTHROUGH.md:1110 @ 84a90e26; :1114 @ 84a90e26) | `c33ffcdd`, direct on main, 2026-08-17 | no | — | 80 (47 operator-facing) | changed since run | no |
| H | H5 | frontends/shell/MANUAL-WALKTHROUGH.md:452 @ 84a90e26 | 2026-08-22 (frontends/shell/MANUAL-WALKTHROUGH.md:1110 @ 84a90e26; :1114 @ 84a90e26) | `c33ffcdd`, direct on main, 2026-08-17 | no | — | 80 (47 operator-facing) | changed since run | no |
| H | H6 | frontends/shell/MANUAL-WALKTHROUGH.md:453 @ 84a90e26 | 2026-08-22 (frontends/shell/MANUAL-WALKTHROUGH.md:1110 @ 84a90e26; :1114 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | #83; #134; #143; #146; #149; #157; #163; #165; #178; #182; #185; #188; #201; #219; #236; #238; #241; #255; #268; #277 | 80 (47 operator-facing) | changed since run | no |
| H | H7 | frontends/shell/MANUAL-WALKTHROUGH.md:454 @ 84a90e26 | 2026-08-22 (frontends/shell/MANUAL-WALKTHROUGH.md:1110 @ 84a90e26; :1114 @ 84a90e26) | `c33ffcdd`, direct on main, 2026-08-17 | no | — | 80 (47 operator-facing) | changed since run | no |
| H | H8 | frontends/shell/MANUAL-WALKTHROUGH.md:455 @ 84a90e26 | 2026-08-22 (frontends/shell/MANUAL-WALKTHROUGH.md:1110 @ 84a90e26; :1114 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | #83; #134; #143; #146; #157; #178; #182; #185; #188; #201; #238; #255; #268; #277 | 80 (47 operator-facing) | changed since run | no |
| H | H9 | frontends/shell/MANUAL-WALKTHROUGH.md:456 @ 84a90e26 | 2026-08-22 (frontends/shell/MANUAL-WALKTHROUGH.md:1110 @ 84a90e26; :1114 @ 84a90e26) | `c33ffcdd`, direct on main, 2026-08-17 | no | — | 80 (47 operator-facing) | changed since run | no |
| I | I1 | frontends/shell/MANUAL-WALKTHROUGH.md:586 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1151 @ 84a90e26; :1156 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 54 (35 operator-facing) | changed since run | no |
| I | I2 | frontends/shell/MANUAL-WALKTHROUGH.md:587 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1151 @ 84a90e26; :1156 @ 84a90e26) | `bbbfb5ed`, #32, 2026-09-08 | yes | — | 54 (35 operator-facing) | changed since run | no |
| I | I3 | frontends/shell/MANUAL-WALKTHROUGH.md:588 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1151 @ 84a90e26; :1156 @ 84a90e26) | `2c457980`, #52, 2026-09-13 | yes | #44; #83; #84; #127; #143; #157; #206 | 54 (35 operator-facing) | changed since run | no |
| I | I4 | frontends/shell/MANUAL-WALKTHROUGH.md:589 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1151 @ 84a90e26; :1156 @ 84a90e26) | `cf2434e6`, #204, 2026-10-09 | yes | — | 54 (35 operator-facing) | changed since run | no |
| I | I5 | frontends/shell/MANUAL-WALKTHROUGH.md:590 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1151 @ 84a90e26; :1156 @ 84a90e26) | `cf2434e6`, #204, 2026-10-09 | yes | — | 54 (35 operator-facing) | changed since run | no |
| I | I6 | frontends/shell/MANUAL-WALKTHROUGH.md:591 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1151 @ 84a90e26; :1156 @ 84a90e26) | `cf2434e6`, #204, 2026-10-09 | yes | — | 54 (35 operator-facing) | changed since run | no |
| I | I7 | frontends/shell/MANUAL-WALKTHROUGH.md:592 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1151 @ 84a90e26; :1156 @ 84a90e26) | `16091f99`, direct on main, 2026-08-18 | no | — | 54 (35 operator-facing) | changed since run | no |
| I | I8 | frontends/shell/MANUAL-WALKTHROUGH.md:593 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1151 @ 84a90e26; :1156 @ 84a90e26) | `cf2434e6`, #204, 2026-10-09 | yes | #44; #46; #83; #94; #143; #157; #182; #197; #209; #238; #252; #273 | 54 (35 operator-facing) | changed since run | no |
| J | J1 | frontends/shell/MANUAL-WALKTHROUGH.md:658 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1176 @ 84a90e26; :1180 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | #134; #222; #246 | 20 (19 operator-facing) | changed since run | no |
| J | J2 | frontends/shell/MANUAL-WALKTHROUGH.md:659 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1176 @ 84a90e26; :1180 @ 84a90e26) | `6039cf78`, direct on main, 2026-08-18 | no | — | 20 (19 operator-facing) | changed since run | no |
| J | J3 | frontends/shell/MANUAL-WALKTHROUGH.md:660 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1176 @ 84a90e26; :1180 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 20 (19 operator-facing) | changed since run | no |
| J | J4 | frontends/shell/MANUAL-WALKTHROUGH.md:661 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1176 @ 84a90e26; :1180 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | #195; #217; #222; #234; #246; #253 | 20 (19 operator-facing) | changed since run | no |
| J | J5 | frontends/shell/MANUAL-WALKTHROUGH.md:662 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1176 @ 84a90e26; :1180 @ 84a90e26) | `6039cf78`, direct on main, 2026-08-18 | no | #83; #86; #127 | 20 (19 operator-facing) | changed since run | no |
| J | J6 | frontends/shell/MANUAL-WALKTHROUGH.md:663 @ 84a90e26 | 2026-08-30 (frontends/shell/MANUAL-WALKTHROUGH.md:1176 @ 84a90e26; :1180 @ 84a90e26) | `6039cf78`, direct on main, 2026-08-18 | no | — | 20 (19 operator-facing) | changed since run | no |
| K | K1 | frontends/shell/MANUAL-WALKTHROUGH.md:739 @ 84a90e26 | 2026-09-02 (frontends/shell/MANUAL-WALKTHROUGH.md:1207 @ 84a90e26; :1214 @ 84a90e26) | `3137e126`, #30, 2026-09-07 | yes | — | 55 (32 operator-facing) | changed since run | no |
| K | K2 | frontends/shell/MANUAL-WALKTHROUGH.md:740 @ 84a90e26 | 2026-09-02 (frontends/shell/MANUAL-WALKTHROUGH.md:1207 @ 84a90e26; :1214 @ 84a90e26) | `3137e126`, #30, 2026-09-07 | yes | #203 | 55 (32 operator-facing) | changed since run | no |
| K | K3 | frontends/shell/MANUAL-WALKTHROUGH.md:741 @ 84a90e26 | 2026-09-02 (frontends/shell/MANUAL-WALKTHROUGH.md:1207 @ 84a90e26; :1214 @ 84a90e26) | `3137e126`, #30, 2026-09-07 | yes | — | 55 (32 operator-facing) | changed since run | no |
| K | K4 | frontends/shell/MANUAL-WALKTHROUGH.md:742 @ 84a90e26 | 2026-09-02 (frontends/shell/MANUAL-WALKTHROUGH.md:1207 @ 84a90e26; :1214 @ 84a90e26) | `f5b27e64`, #16, 2026-09-02 | no | — | 55 (32 operator-facing) | changed since run | no |
| K | K5 | frontends/shell/MANUAL-WALKTHROUGH.md:743 @ 84a90e26 | 2026-09-02 (frontends/shell/MANUAL-WALKTHROUGH.md:1207 @ 84a90e26; :1214 @ 84a90e26) | `f5b27e64`, #16, 2026-09-02 | no | — | 55 (32 operator-facing) | changed since run | no |
| K | K6 | frontends/shell/MANUAL-WALKTHROUGH.md:744 @ 84a90e26 | 2026-09-02 (frontends/shell/MANUAL-WALKTHROUGH.md:1207 @ 84a90e26; :1214 @ 84a90e26) | `f5b27e64`, #16, 2026-09-02 | no | #64; #83; #86; #100; #101; #112; #127; #182; #195; #207; #212; #217; #219; #222; #233; #234; #246; #253 | 55 (32 operator-facing) | changed since run | no |
| K | K7 | frontends/shell/MANUAL-WALKTHROUGH.md:745 @ 84a90e26 | 2026-09-14 (frontends/shell/MANUAL-WALKTHROUGH.md:1415 @ 84a90e26; :1418 @ 84a90e26) | `c9161bb7`, #45, 2026-09-11 | no | — | 48 (27 operator-facing) | changed since run | no |
| L | L1 | frontends/shell/MANUAL-WALKTHROUGH.md:815 @ 84a90e26 | 2026-09-06 (frontends/shell/MANUAL-WALKTHROUGH.md:1270 @ 84a90e26; :1334-1359 @ 84a90e26) | `1a251a15`, #274, 2026-11-01 | yes | — | 55 (32 operator-facing) | changed since run | no |
| L | L2 | frontends/shell/MANUAL-WALKTHROUGH.md:816 @ 84a90e26 | 2026-09-06 (frontends/shell/MANUAL-WALKTHROUGH.md:1270 @ 84a90e26; :1334-1359 @ 84a90e26) | `5b264cc1`, #23, 2026-09-06 | no | — | 55 (32 operator-facing) | changed since run | no |
| L | L3 | frontends/shell/MANUAL-WALKTHROUGH.md:817 @ 84a90e26 | 2026-09-06 (frontends/shell/MANUAL-WALKTHROUGH.md:1270 @ 84a90e26; :1334-1359 @ 84a90e26) | `5b264cc1`, #23, 2026-09-06 | no | — | 55 (32 operator-facing) | changed since run | no |
| L | L4 | frontends/shell/MANUAL-WALKTHROUGH.md:818 @ 84a90e26 | 2026-09-06 (frontends/shell/MANUAL-WALKTHROUGH.md:1270 @ 84a90e26; :1334-1359 @ 84a90e26) | `5b264cc1`, #23, 2026-09-06 | no | — | 55 (32 operator-facing) | changed since run | no |
| L | L5 | frontends/shell/MANUAL-WALKTHROUGH.md:819 @ 84a90e26 | 2026-09-07 (frontends/shell/MANUAL-WALKTHROUGH.md:1362 @ 84a90e26; :1369-1373 @ 84a90e26) | `1a251a15`, #274, 2026-11-01 | yes | #45; #50; #86; #112; #127; #203; #246; #253 | 55 (32 operator-facing) | changed since run | yes: node (entry 48); script state/drafts/sitting-script-2026-10-23.md:14 @ 84a90e26 |
| L | L6 | frontends/shell/MANUAL-WALKTHROUGH.md:820 @ 84a90e26 | 2026-09-07 (frontends/shell/MANUAL-WALKTHROUGH.md:1362 @ 84a90e26; :1369-1373 @ 84a90e26) | `472e8839`, direct on main, 2026-09-06 | no | — | 55 (32 operator-facing) | changed since run | no |
| L | L7 | frontends/shell/MANUAL-WALKTHROUGH.md:821 @ 84a90e26 | 2026-09-14 (frontends/shell/MANUAL-WALKTHROUGH.md:1415 @ 84a90e26; :1419 @ 84a90e26) | `0eeda539`, #47, 2026-09-10 | no | — | 48 (27 operator-facing) | changed since run | no |
| L | L8 | frontends/shell/MANUAL-WALKTHROUGH.md:822 @ 84a90e26 | 2026-09-14 (frontends/shell/MANUAL-WALKTHROUGH.md:1415 @ 84a90e26; :1419 @ 84a90e26) | `0eeda539`, #47, 2026-09-10 | no | — | 48 (27 operator-facing) | changed since run | no |
| L | L9 | frontends/shell/MANUAL-WALKTHROUGH.md:823 @ 84a90e26 | 2026-09-06 (frontends/shell/MANUAL-WALKTHROUGH.md:1270 @ 84a90e26; :1334-1359 @ 84a90e26) | `5b264cc1`, #23, 2026-09-06 | no | — | 55 (32 operator-facing) | changed since run | no |
| M | M1 | frontends/shell/MANUAL-WALKTHROUGH.md:875 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `279b43fb`, direct on main, 2026-09-09 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M2 | frontends/shell/MANUAL-WALKTHROUGH.md:876 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `3275a1d4`, #31, 2026-09-08 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M3 | frontends/shell/MANUAL-WALKTHROUGH.md:877 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M4 | frontends/shell/MANUAL-WALKTHROUGH.md:878 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `279b43fb`, direct on main, 2026-09-09 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M5 | frontends/shell/MANUAL-WALKTHROUGH.md:879 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `3275a1d4`, #31, 2026-09-08 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M6 | frontends/shell/MANUAL-WALKTHROUGH.md:880 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `3275a1d4`, #31, 2026-09-08 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M7 | frontends/shell/MANUAL-WALKTHROUGH.md:881 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `3275a1d4`, #31, 2026-09-08 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M8 | frontends/shell/MANUAL-WALKTHROUGH.md:882 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `48329927`, #200, 2026-10-10 | yes | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M9 | frontends/shell/MANUAL-WALKTHROUGH.md:883 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `ba9a88ef`, direct on main, 2026-09-09 | no | #157; #222 | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M10 | frontends/shell/MANUAL-WALKTHROUGH.md:884 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `13df4cb5`, #195, 2026-10-07 | yes | #83; #140; #157; #182; #209; #241 | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M11 | frontends/shell/MANUAL-WALKTHROUGH.md:885 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `1b32e749`, direct on main, 2026-09-08 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M12 | frontends/shell/MANUAL-WALKTHROUGH.md:886 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `d38c5ada`, #36, 2026-09-08 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M13 | frontends/shell/MANUAL-WALKTHROUGH.md:887 @ 84a90e26 | 2026-09-13 (partial: two bracketed values open) (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `d38c5ada`, #36, 2026-09-08 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M14 | frontends/shell/MANUAL-WALKTHROUGH.md:888 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `2810b81e`, #50, 2026-09-13 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M15 | frontends/shell/MANUAL-WALKTHROUGH.md:889 @ 84a90e26 | 2026-09-13 (governance/RELEASE-0.1.md:1183 @ 84a90e26; :1258 @ 84a90e26) | `2810b81e`, #50, 2026-09-13 | no | — | 76 (44 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M16 | frontends/shell/MANUAL-WALKTHROUGH.md:890 @ 84a90e26 | 2026-09-14 (frontends/shell/MANUAL-WALKTHROUGH.md:1420 @ 84a90e26) | `52434f25`, #63, 2026-09-14 | no | — | 72 (41 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M17 | frontends/shell/MANUAL-WALKTHROUGH.md:891 @ 84a90e26 | 2026-09-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1423 @ 84a90e26) | `52434f25`, #63, 2026-09-14 | no | — | 70 (39 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| M | M18 | frontends/shell/MANUAL-WALKTHROUGH.md:892 @ 84a90e26 | 2026-09-15 (frontends/shell/MANUAL-WALKTHROUGH.md:1422-1425 @ 84a90e26) | `52434f25`, #63, 2026-09-14 | no | — | 70 (39 operator-facing) | changed since run | release Part (Part M successor), not yet written (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:112-122 @ 84a90e26) |
| N | N1 | frontends/shell/MANUAL-WALKTHROUGH.md:946 @ 84a90e26 | 2026-09-23 (frontends/shell/MANUAL-WALKTHROUGH.md:1444-1449 @ 84a90e26) | `ebc0fb1f`, #102, 2026-09-23 | no | #102; #112; #116; #127; #134; #136; #143; #145; #147; #150; #157; #160; #168; #173; #182; #185; #186; #188; #197; #209; #210; #220; #222; #238; #252; #258; #269; #273 | 60 (33 operator-facing) | changed since run | no |
| N | N2 | frontends/shell/MANUAL-WALKTHROUGH.md:947 @ 84a90e26 | 2026-09-20 (frontends/shell/MANUAL-WALKTHROUGH.md:1432 @ 84a90e26; :1436 @ 84a90e26) | `9d8c52b1`, #98, 2026-09-19 | no | #102; #112; #116; #127; #134; #136; #143; #145; #147; #150; #157; #160; #168; #173; #182; #185; #186; #188; #197; #209; #210; #222; #238; #246; #252; #258; #269; #273 | 62 (35 operator-facing) | changed since run | no |
| N | N3 | frontends/shell/MANUAL-WALKTHROUGH.md:948 @ 84a90e26 | 2026-09-20 (frontends/shell/MANUAL-WALKTHROUGH.md:1432 @ 84a90e26; :1436 @ 84a90e26) | `7beada41`, #98, 2026-09-19 | no | #102; #112; #116; #127; #134; #136; #143; #145; #147; #150; #157; #160; #168; #173; #182; #185; #186; #188; #209; #210; #220; #222; #246; #258; #269 | 62 (35 operator-facing) | changed since run | no |
| N | N4 | frontends/shell/MANUAL-WALKTHROUGH.md:949 @ 84a90e26 | 2026-09-20 (frontends/shell/MANUAL-WALKTHROUGH.md:1432 @ 84a90e26; :1436 @ 84a90e26) | `9eb52ac1`, #89, 2026-09-18 | no | #127; #143; #157; #195; #206; #209; #214; #217; #233 | 62 (35 operator-facing) | changed since run | no |
| N | N5 | frontends/shell/MANUAL-WALKTHROUGH.md:950 @ 84a90e26 | 2026-09-20 (frontends/shell/MANUAL-WALKTHROUGH.md:1432 @ 84a90e26; :1436 @ 84a90e26) | `b9369654`, #239, 2026-10-21 | yes | #127; #134; #149; #157; #163; #165; #182; #195; #203; #209; #217; #219; #233; #236; #241 | 62 (35 operator-facing) | changed since run | no |
| N | N6 | frontends/shell/MANUAL-WALKTHROUGH.md:951 @ 84a90e26 | 2026-09-20 (frontends/shell/MANUAL-WALKTHROUGH.md:1432 @ 84a90e26; :1436 @ 84a90e26) | `b9a57805`, #231, 2026-10-19 | yes | #100; #101; #112; #127; #143; #157; #182; #195; #206; #207; #212; #217; #219; #222; #233; #234; #246; #253 | 62 (35 operator-facing) | changed since run | no |
| N | N7 | frontends/shell/MANUAL-WALKTHROUGH.md:952 @ 84a90e26 | 2026-09-20 (frontends/shell/MANUAL-WALKTHROUGH.md:1432 @ 84a90e26; :1436 @ 84a90e26) | `9eb52ac1`, #89, 2026-09-18 | no | #217 | 62 (35 operator-facing) | changed since run | no |
| N | N8 | frontends/shell/MANUAL-WALKTHROUGH.md:953 @ 84a90e26 | 2026-09-23 (frontends/shell/MANUAL-WALKTHROUGH.md:1444-1449 @ 84a90e26) | `aa30f99f`, #231, 2026-10-18 | yes | — | 60 (33 operator-facing) | changed since run | no |
| N | N9 | frontends/shell/MANUAL-WALKTHROUGH.md:954 @ 84a90e26 | 2026-09-20 (frontends/shell/MANUAL-WALKTHROUGH.md:1432 @ 84a90e26; :1436 @ 84a90e26) | `d3e0d1f4`, #89, 2026-09-18 | no | — | 62 (35 operator-facing) | changed since run | no |
| P (degrees) | P1 | frontends/shell/MANUAL-WALKTHROUGH.md:1476 @ 84a90e26 | none recorded | `1a251a15`, #274, 2026-11-01 | — | #45; #50; #86; #112; #127; #246; #253 | n/a (never run) | **never run** | yes: script state/drafts/sitting-script-2026-10-23.md:9 @ 84a90e26 (P1 only) |
| Q | Q1 | frontends/shell/MANUAL-WALKTHROUGH.md:1515 @ 84a90e26 | none recorded | `aa30f99f`, #231, 2026-10-18 | — | #64; #83; #86; #100; #101; #112; #127; #182; #195; #207; #212; #217; #219; #222; #233; #234; #246; #253 | n/a (never run) | **never run** | no |
| Q | Q2 | frontends/shell/MANUAL-WALKTHROUGH.md:1516 @ 84a90e26 | none recorded | `b178ee5d`, #127, 2026-09-26 | — | #44; #59; #64; #83; #84; #86; #90; #93; #100; #101; #102; #112; #116; #127; #134; #136; #141; #143; #145; #147; #148; #150; #151; #157; #160; #168; #173; #176; #182; #185; #186; #188; #190; #195; #206; #207; #209; #210; #212; #217; #219; #220; #222; #233; #234; #246; #253; #258; #269 | n/a (never run) | **never run** | no |
| R | R1 | frontends/shell/MANUAL-WALKTHROUGH.md:1550 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | own node, proposed (governance/PLAN.yaml:4015 @ 84a90e26), not on the queue node |
| S | S1 | frontends/shell/MANUAL-WALKTHROUGH.md:1586 @ 84a90e26 | none recorded | `4190e428`, #203, 2026-10-10 | — | — | n/a (never run) | **never run** | no |
| S | S2 | frontends/shell/MANUAL-WALKTHROUGH.md:1587 @ 84a90e26 | none recorded | `3c29bc67`, #182, 2026-10-06 | — | — | n/a (never run) | **never run** | no |
| S | S3 | frontends/shell/MANUAL-WALKTHROUGH.md:1588 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | no |
| S | S4 | frontends/shell/MANUAL-WALKTHROUGH.md:1589 @ 84a90e26 | none recorded | `3c29bc67`, #182, 2026-10-06 | — | #44; #46; #83; #93; #102; #127; #157; #182; #185; #188; #209; #241; #246; #253 | n/a (never run) | **never run** | no |
| P (points) | P1 | frontends/shell/MANUAL-WALKTHROUGH.md:1639 @ 84a90e26 | none recorded | `55df46fd`, #185, 2026-10-06 | — | — | n/a (never run) | **never run** | yes: node governance/PLAN.yaml:5861 @ 84a90e26; script state/drafts/sitting-script-2026-10-23.md:8 @ 84a90e26 |
| P (points) | P2 | frontends/shell/MANUAL-WALKTHROUGH.md:1640 @ 84a90e26 | none recorded | `2ff9a8e6`, #185, 2026-10-07 | — | — | n/a (never run) | **never run** | yes: node governance/PLAN.yaml:5861 @ 84a90e26; script state/drafts/sitting-script-2026-10-23.md:8 @ 84a90e26 |
| P (points) | P3 | frontends/shell/MANUAL-WALKTHROUGH.md:1641 @ 84a90e26 | none recorded | `55df46fd`, #185, 2026-10-06 | — | — | n/a (never run) | **never run** | yes: node governance/PLAN.yaml:5861 @ 84a90e26; script state/drafts/sitting-script-2026-10-23.md:8 @ 84a90e26 |
| P (points) | P4 | frontends/shell/MANUAL-WALKTHROUGH.md:1642 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | yes: node governance/PLAN.yaml:5861 @ 84a90e26; script state/drafts/sitting-script-2026-10-23.md:8 @ 84a90e26 |
| P (points) | P5 | frontends/shell/MANUAL-WALKTHROUGH.md:1643 @ 84a90e26 | none recorded | `55df46fd`, #185, 2026-10-06 | — | — | n/a (never run) | **never run** | yes: node governance/PLAN.yaml:5861 @ 84a90e26; script state/drafts/sitting-script-2026-10-23.md:8 @ 84a90e26 |
| P (points) | P6 | frontends/shell/MANUAL-WALKTHROUGH.md:1644 @ 84a90e26 | none recorded | `55df46fd`, #185, 2026-10-06 | — | — | n/a (never run) | **never run** | yes: node governance/PLAN.yaml:5861 @ 84a90e26; script state/drafts/sitting-script-2026-10-23.md:8 @ 84a90e26 |
| P (points) | P7 | frontends/shell/MANUAL-WALKTHROUGH.md:1645 @ 84a90e26 | none recorded | `55df46fd`, #185, 2026-10-06 | — | #157; #182; #185; #188; #246; #253 | n/a (never run) | **never run** | yes: node governance/PLAN.yaml:5861 @ 84a90e26; script state/drafts/sitting-script-2026-10-23.md:8 @ 84a90e26 |
| T | T1 | frontends/shell/MANUAL-WALKTHROUGH.md:1692 @ 84a90e26 | none recorded | `e89bf9bf`, #188, 2026-10-07 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:10 @ 84a90e26 |
| T | T2 | frontends/shell/MANUAL-WALKTHROUGH.md:1693 @ 84a90e26 | none recorded | `e89bf9bf`, #188, 2026-10-07 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:10 @ 84a90e26 |
| T | T3 | frontends/shell/MANUAL-WALKTHROUGH.md:1694 @ 84a90e26 | none recorded | `e89bf9bf`, #188, 2026-10-07 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:10 @ 84a90e26 |
| T | T4 | frontends/shell/MANUAL-WALKTHROUGH.md:1695 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:10 @ 84a90e26 |
| T | T5 | frontends/shell/MANUAL-WALKTHROUGH.md:1696 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:10 @ 84a90e26 |
| T | T6 | frontends/shell/MANUAL-WALKTHROUGH.md:1697 @ 84a90e26 | none recorded | `e89bf9bf`, #188, 2026-10-07 | — | #157; #182; #185; #188; #246; #253 | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:10 @ 84a90e26 |
| U | U1 | frontends/shell/MANUAL-WALKTHROUGH.md:1732 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | no |
| U | U2 | frontends/shell/MANUAL-WALKTHROUGH.md:1733 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | no |
| U | U3 | frontends/shell/MANUAL-WALKTHROUGH.md:1734 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | no |
| U | U4 | frontends/shell/MANUAL-WALKTHROUGH.md:1735 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | no |
| U | U5 | frontends/shell/MANUAL-WALKTHROUGH.md:1736 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | no |
| U | U6 | frontends/shell/MANUAL-WALKTHROUGH.md:1737 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | no |
| U | U7 | frontends/shell/MANUAL-WALKTHROUGH.md:1738 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | no |
| U | U8 | frontends/shell/MANUAL-WALKTHROUGH.md:1739 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | no |
| U | U9 | frontends/shell/MANUAL-WALKTHROUGH.md:1740 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | — | n/a (never run) | **never run** | no |
| U | U10 | frontends/shell/MANUAL-WALKTHROUGH.md:1741 @ 84a90e26 | none recorded | `13df4cb5`, #195, 2026-10-07 | — | #195; #217; #222; #234; #246; #253 | n/a (never run) | **never run** | no |
| V | V1 | frontends/shell/MANUAL-WALKTHROUGH.md:1776 @ 84a90e26 | none recorded | `a2f09cc9`, #207, 2026-10-11 | — | — | n/a (never run) | **never run** | no |
| V | V2 | frontends/shell/MANUAL-WALKTHROUGH.md:1777 @ 84a90e26 | none recorded | `52df6eab`, #207, 2026-10-10 | — | — | n/a (never run) | **never run** | no |
| V | V3 | frontends/shell/MANUAL-WALKTHROUGH.md:1778 @ 84a90e26 | none recorded | `52df6eab`, #207, 2026-10-10 | — | — | n/a (never run) | **never run** | no |
| V | V4 | frontends/shell/MANUAL-WALKTHROUGH.md:1779 @ 84a90e26 | none recorded | `52df6eab`, #207, 2026-10-10 | — | — | n/a (never run) | **never run** | no |
| V | V5 | frontends/shell/MANUAL-WALKTHROUGH.md:1780 @ 84a90e26 | none recorded | `52df6eab`, #207, 2026-10-10 | — | — | n/a (never run) | **never run** | no |
| V | V6 | frontends/shell/MANUAL-WALKTHROUGH.md:1781 @ 84a90e26 | none recorded | `52df6eab`, #207, 2026-10-10 | — | — | n/a (never run) | **never run** | no |
| X | X1 | frontends/shell/MANUAL-WALKTHROUGH.md:1804 @ 84a90e26 | none recorded | `d6140c9f`, #214, 2026-10-11 | — | — | n/a (never run) | **never run** | no |
| X | X2 | frontends/shell/MANUAL-WALKTHROUGH.md:1805 @ 84a90e26 | none recorded | `d6140c9f`, #214, 2026-10-11 | — | — | n/a (never run) | **never run** | no |
| X | X3 | frontends/shell/MANUAL-WALKTHROUGH.md:1806 @ 84a90e26 | none recorded | `d6140c9f`, #214, 2026-10-11 | — | — | n/a (never run) | **never run** | no |
| W | W0 | frontends/shell/MANUAL-WALKTHROUGH.md:1821 @ 84a90e26 | none recorded | `cdc8a423`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W1 | frontends/shell/MANUAL-WALKTHROUGH.md:1822 @ 84a90e26 | none recorded | `cdc8a423`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W2 | frontends/shell/MANUAL-WALKTHROUGH.md:1823 @ 84a90e26 | none recorded | `7ffdb6a7`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W3 | frontends/shell/MANUAL-WALKTHROUGH.md:1824 @ 84a90e26 | none recorded | `cdc8a423`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W4 | frontends/shell/MANUAL-WALKTHROUGH.md:1825 @ 84a90e26 | none recorded | `cdc8a423`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W5 | frontends/shell/MANUAL-WALKTHROUGH.md:1826 @ 84a90e26 | none recorded | `cdc8a423`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W6 | frontends/shell/MANUAL-WALKTHROUGH.md:1827 @ 84a90e26 | none recorded | `cdc8a423`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W7 | frontends/shell/MANUAL-WALKTHROUGH.md:1828 @ 84a90e26 | none recorded | `cdc8a423`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W8 | frontends/shell/MANUAL-WALKTHROUGH.md:1829 @ 84a90e26 | none recorded | `cdc8a423`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W8a | frontends/shell/MANUAL-WALKTHROUGH.md:1830 @ 84a90e26 | none recorded | `cdc8a423`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W9 | frontends/shell/MANUAL-WALKTHROUGH.md:1831 @ 84a90e26 | none recorded | `7ffdb6a7`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W10 | frontends/shell/MANUAL-WALKTHROUGH.md:1832 @ 84a90e26 | none recorded | `cdc8a423`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W10a | frontends/shell/MANUAL-WALKTHROUGH.md:1833 @ 84a90e26 | none recorded | `635646e2`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| W | W11 | frontends/shell/MANUAL-WALKTHROUGH.md:1834 @ 84a90e26 | none recorded | `7ffdb6a7`, #217, 2026-10-12 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:11 @ 84a90e26 |
| Y | Y0 | frontends/shell/MANUAL-WALKTHROUGH.md:1864 @ 84a90e26 | none recorded | `304ba249`, #219, 2026-10-14 | — | — | n/a (never run) | **never run** | unsettled: node names "Y (Y4)", script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names Y4 only |
| Y | Y1 | frontends/shell/MANUAL-WALKTHROUGH.md:1865 @ 84a90e26 | none recorded | `db44c7ff`, #219, 2026-10-14 | — | — | n/a (never run) | **never run** | unsettled: node names "Y (Y4)", script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names Y4 only |
| Y | Y2 | frontends/shell/MANUAL-WALKTHROUGH.md:1866 @ 84a90e26 | none recorded | `304ba249`, #219, 2026-10-14 | — | — | n/a (never run) | **never run** | unsettled: node names "Y (Y4)", script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names Y4 only |
| Y | Y3 | frontends/shell/MANUAL-WALKTHROUGH.md:1867 @ 84a90e26 | none recorded | `a23c5624`, #219, 2026-10-14 | — | — | n/a (never run) | **never run** | unsettled: node names "Y (Y4)", script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names Y4 only |
| Y | Y4 | frontends/shell/MANUAL-WALKTHROUGH.md:1868 @ 84a90e26 | none recorded | `304ba249`, #219, 2026-10-14 | — | — | n/a (never run) | **never run** | unsettled: node names "Y (Y4)", script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names Y4 |
| Z | Z0 | frontends/shell/MANUAL-WALKTHROUGH.md:1889 @ 84a90e26 | none recorded | `5bea403c`, #218, 2026-10-14 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| Z | Z1 | frontends/shell/MANUAL-WALKTHROUGH.md:1890 @ 84a90e26 | none recorded | `5bea403c`, #218, 2026-10-14 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| Z | Z2 | frontends/shell/MANUAL-WALKTHROUGH.md:1891 @ 84a90e26 | none recorded | `5bea403c`, #218, 2026-10-14 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| Z | Z3 | frontends/shell/MANUAL-WALKTHROUGH.md:1892 @ 84a90e26 | none recorded | `5bea403c`, #218, 2026-10-14 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| Z | Z4 | frontends/shell/MANUAL-WALKTHROUGH.md:1893 @ 84a90e26 | none recorded | `c7ca9bee`, #218, 2026-10-14 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| AA | AA0 | frontends/shell/MANUAL-WALKTHROUGH.md:1910 @ 84a90e26 | none recorded | `936b7982`, #222, 2026-10-14 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| AA | AA1 | frontends/shell/MANUAL-WALKTHROUGH.md:1911 @ 84a90e26 | none recorded | `936b7982`, #222, 2026-10-14 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| AA | AA2 | frontends/shell/MANUAL-WALKTHROUGH.md:1912 @ 84a90e26 | none recorded | `936b7982`, #222, 2026-10-14 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| AA | AA3 | frontends/shell/MANUAL-WALKTHROUGH.md:1913 @ 84a90e26 | none recorded | `d0d247b6`, #222, 2026-10-16 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| AA | AA4 | frontends/shell/MANUAL-WALKTHROUGH.md:1914 @ 84a90e26 | none recorded | `d0d247b6`, #222, 2026-10-16 | — | — | n/a (never run) | **never run** | yes: node; script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 |
| AB | AB0 | frontends/shell/MANUAL-WALKTHROUGH.md:1937 @ 84a90e26 | none recorded | `516609a1`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB1 | frontends/shell/MANUAL-WALKTHROUGH.md:1938 @ 84a90e26 | none recorded | `516609a1`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB2 | frontends/shell/MANUAL-WALKTHROUGH.md:1939 @ 84a90e26 | none recorded | `516609a1`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB3 | frontends/shell/MANUAL-WALKTHROUGH.md:1940 @ 84a90e26 | none recorded | `170fc70d`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB4 | frontends/shell/MANUAL-WALKTHROUGH.md:1941 @ 84a90e26 | none recorded | `516609a1`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB4a | frontends/shell/MANUAL-WALKTHROUGH.md:1942 @ 84a90e26 | none recorded | `516609a1`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB5 | frontends/shell/MANUAL-WALKTHROUGH.md:1943 @ 84a90e26 | none recorded | `516609a1`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB6 | frontends/shell/MANUAL-WALKTHROUGH.md:1944 @ 84a90e26 | none recorded | `516609a1`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB7 | frontends/shell/MANUAL-WALKTHROUGH.md:1945 @ 84a90e26 | none recorded | `170fc70d`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB8 | frontends/shell/MANUAL-WALKTHROUGH.md:1946 @ 84a90e26 | none recorded | `516609a1`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB9 | frontends/shell/MANUAL-WALKTHROUGH.md:1947 @ 84a90e26 | none recorded | `516609a1`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB10 | frontends/shell/MANUAL-WALKTHROUGH.md:1948 @ 84a90e26 | none recorded | `516609a1`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 only |
| AB | AB11 | frontends/shell/MANUAL-WALKTHROUGH.md:1949 @ 84a90e26 | none recorded | `170fc70d`, #234, 2026-10-20 | — | — | n/a (never run) | **never run** | unsettled: node says Part AB joined, script state/drafts/sitting-script-2026-10-23.md:12 @ 84a90e26 names AB11 |
| AC | AC0 | frontends/shell/MANUAL-WALKTHROUGH.md:1980 @ 84a90e26 | none recorded | `37b9d756`, #246, 2026-10-22 | — | — | n/a (never run) | **never run** | named only in the script's join list (state/drafts/sitting-script-2026-10-23.md:330 @ 84a90e26), not on the node |
| AC | AC1 | frontends/shell/MANUAL-WALKTHROUGH.md:1981 @ 84a90e26 | none recorded | `0ed4b305`, #246, 2026-10-23 | — | — | n/a (never run) | **never run** | named only in the script's join list (state/drafts/sitting-script-2026-10-23.md:330 @ 84a90e26), not on the node |
| AC | AC2 | frontends/shell/MANUAL-WALKTHROUGH.md:1982 @ 84a90e26 | none recorded | `37b9d756`, #246, 2026-10-22 | — | — | n/a (never run) | **never run** | named only in the script's join list (state/drafts/sitting-script-2026-10-23.md:330 @ 84a90e26), not on the node |
| AC | AC6 | frontends/shell/MANUAL-WALKTHROUGH.md:1983 @ 84a90e26 | none recorded | `0c200a71`, #253, 2026-10-24 | — | — | n/a (never run) | **never run** | yes: node (joined on #253) |
| AC | AC7 | frontends/shell/MANUAL-WALKTHROUGH.md:1984 @ 84a90e26 | none recorded | `0c200a71`, #253, 2026-10-24 | — | — | n/a (never run) | **never run** | yes: node (joined on #253) |
| AC | AC8 | frontends/shell/MANUAL-WALKTHROUGH.md:1985 @ 84a90e26 | none recorded | `580d389e`, #253, 2026-10-24 | — | — | n/a (never run) | **never run** | yes: node (joined on #253) |
| AC | AC9 | frontends/shell/MANUAL-WALKTHROUGH.md:1986 @ 84a90e26 | none recorded | `0ed4b305`, #246, 2026-10-23 | — | — | n/a (never run) | **never run** | named only in the script's join list (state/drafts/sitting-script-2026-10-23.md:330 @ 84a90e26), not on the node |
| AC | AC10 | frontends/shell/MANUAL-WALKTHROUGH.md:1987 @ 84a90e26 | none recorded | `0ed4b305`, #246, 2026-10-23 | — | #182; #185; #188; #246; #253 | n/a (never run) | **never run** | named only in the script's join list (state/drafts/sitting-script-2026-10-23.md:330 @ 84a90e26), not on the node |
| AC | AC11 | frontends/shell/MANUAL-WALKTHROUGH.md:1988 @ 84a90e26 | none recorded | `37b9d756`, #246, 2026-10-22 | — | — | n/a (never run) | **never run** | named only in the script's join list (state/drafts/sitting-script-2026-10-23.md:330 @ 84a90e26), not on the node |

---

## 5. By Part: the operator-facing pieces merged after the Part's earliest run, in its areas

"Operator-facing" means the pieces that `RELEASE-0.2-DRAFT.md` §1 names in a "changed" or "fixed" line.

| Part | Its declared areas | Earliest last run of a row in it | Operator-facing pieces merged after that run, in its areas |
|---|---|---|---|
| A | frame, canvas, admission | 2026-08-14 | #44, #45, #46, #55, #59, #64, #78, #79, #83, #86, #93, #94, #100, #101, #102, #112, #127, #143, #145, #173, #182, #185, #188, #190, #195, #197, #206, #207, #212, #214, #217, #218, #219, #222, #233, #234, #246, #252, #253, #255, #268 |
| B | frame, admission | 2026-08-14 | #44, #46, #59, #64, #83, #86, #93, #94, #100, #101, #102, #112, #127, #143, #145, #173, #182, #185, #188, #190, #195, #197, #206, #207, #212, #214, #217, #218, #219, #222, #233, #234, #246, #252, #253 |
| C | frame, admission | 2026-08-14 | #44, #46, #59, #64, #83, #86, #93, #94, #100, #101, #102, #112, #127, #143, #145, #173, #182, #185, #188, #190, #195, #197, #206, #207, #212, #214, #217, #218, #219, #222, #233, #234, #246, #252, #253 |
| D | frame, canvas, admission | 2026-08-14 | #44, #45, #46, #55, #59, #64, #78, #79, #83, #86, #93, #94, #100, #101, #102, #112, #127, #143, #145, #173, #182, #185, #188, #190, #195, #197, #206, #207, #212, #214, #217, #218, #219, #222, #233, #234, #246, #252, #253, #255, #268 |
| E | frame, filter, canvas | 2026-08-15 | #44, #45, #55, #59, #64, #78, #79, #83, #86, #100, #101, #112, #127, #143, #145, #173, #182, #185, #188, #195, #207, #212, #217, #218, #219, #222, #233, #234, #246, #253, #255, #268 |
| F | frame, style, publish | 2026-08-16 | #53, #64, #83, #86, #100, #101, #112, #127, #149, #163, #165, #182, #195, #207, #212, #217, #218, #219, #222, #233, #234, #236, #241, #246, #253 |
| G | frame, publish | 2026-08-17 | #53, #64, #83, #86, #100, #101, #112, #127, #149, #163, #165, #182, #195, #207, #212, #217, #218, #219, #222, #233, #234, #236, #241, #246, #253 |
| H | frame, canvas, admission, filter, style, publish | 2026-08-22 | #44, #45, #46, #53, #55, #59, #64, #78, #79, #83, #86, #93, #94, #100, #101, #102, #112, #127, #143, #145, #149, #163, #165, #173, #182, #185, #188, #190, #195, #197, #206, #207, #212, #214, #217, #218, #219, #222, #233, #234, #236, #241, #246, #252, #253, #255, #268 |
| I | frame, admission | 2026-08-30 | #44, #46, #59, #64, #83, #86, #93, #94, #100, #101, #102, #112, #127, #143, #145, #173, #182, #185, #188, #190, #195, #197, #206, #207, #212, #214, #217, #218, #219, #222, #233, #234, #246, #252, #253 |
| J | frame, console | 2026-08-30 | #64, #83, #86, #100, #101, #112, #127, #182, #195, #207, #212, #217, #218, #219, #222, #233, #234, #246, #253 |
| K | frame, canvas | 2026-09-02 | #44, #45, #55, #59, #64, #78, #79, #83, #86, #100, #101, #112, #127, #143, #145, #173, #182, #185, #188, #195, #207, #212, #217, #218, #219, #222, #233, #234, #246, #253, #255, #268 |
| L | frame, canvas | 2026-09-06 | #44, #45, #55, #59, #64, #78, #79, #83, #86, #100, #101, #112, #127, #143, #145, #173, #182, #185, #188, #195, #207, #212, #217, #218, #219, #222, #233, #234, #246, #253, #255, #268 |
| M | package, frame, canvas, admission, filter, style, publish | 2026-09-13 | #55, #59, #64, #78, #79, #83, #86, #93, #94, #100, #101, #102, #112, #127, #143, #145, #149, #163, #165, #173, #182, #185, #188, #190, #195, #197, #206, #207, #212, #214, #217, #218, #219, #222, #233, #234, #236, #241, #246, #252, #253, #255, #266, #268 |
| N | frame, admission, watcher, canvas, publish | 2026-09-20 | #100, #101, #102, #112, #127, #141, #143, #145, #149, #163, #165, #173, #182, #185, #188, #190, #195, #197, #206, #207, #212, #214, #217, #218, #219, #222, #233, #234, #236, #241, #246, #252, #253, #255, #268 |
| P (degrees) | frame, canvas, admission | never run | n/a: every row in the Part is unrun |
| Q | frame, watcher | never run | n/a: every row in the Part is unrun |
| R | publish, package | never run | n/a: every row in the Part is unrun |
| S | frame, canvas, admission | never run | n/a: every row in the Part is unrun |
| P (points) | frame, canvas, admission | never run | n/a: every row in the Part is unrun |
| T | frame, canvas, admission | never run | n/a: every row in the Part is unrun |
| U | frame | never run | n/a: every row in the Part is unrun |
| V | frame, canvas | never run | n/a: every row in the Part is unrun |
| X | frame, admission | never run | n/a: every row in the Part is unrun |
| W | frame, selection, publish, filter | never run | n/a: every row in the Part is unrun |
| Y | frame, publish, canvas | never run | n/a: every row in the Part is unrun |
| Z | frame | never run | n/a: every row in the Part is unrun |
| AA | frame, recording, filter | never run | n/a: every row in the Part is unrun |
| AB | frame, filter | never run | n/a: every row in the Part is unrun |
| AC | frame, table | never run | n/a: every row in the Part is unrun |

---

## 6. KNOWN-LIMITATIONS items, and the pieces since v0.1.0 whose diff edited each

How to read the columns:
- **Section** says which half of the file the item sits in at `84a90e26`: the v0.1.0 half, above KNOWN-LIMITATIONS.md:202 @ 84a90e26, or "On main since v0.1.0".
- **Wording marker** is what the item's own source comment says:
  - "DRAFT wording for the human's sight";
  - "the human's wording", or "Approved as drafted by the human".
  KNOWN-LIMITATIONS items are not red-line texts for the typed-words rule (state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:16 @ 84a90e26). The markers still say which items await the human's sight.
- #50 appears against every v0.1.0 item because it merged the release branch's finalized docs into `main`.
- Items 48 to 50 do not exist on main. They are reserved for piece 1c's KL group (state/consults/2026-10-23-v0-2-scope-proposal-architect.md:46 @ 84a90e26).

| Item | Line | Section | Pieces since v0.1.0 whose diff edited it | Wording marker in its source comment |
|---|---|---|---|---|
| 1 | KNOWN-LIMITATIONS.md:14 @ 84a90e26 | v0.1.0 | #50, #162 | — |
| 2 | KNOWN-LIMITATIONS.md:34 @ 84a90e26 | v0.1.0 | #50, #205, #214 | — |
| 3 | KNOWN-LIMITATIONS.md:62 @ 84a90e26 | v0.1.0 | #50, #204 | — |
| 4 | KNOWN-LIMITATIONS.md:72 @ 84a90e26 | v0.1.0 | #50 (#50 is the merge-back of the release docs) | — |
| 5 | KNOWN-LIMITATIONS.md:79 @ 84a90e26 | v0.1.0 | #50 (#50 is the merge-back of the release docs) | — |
| 6 | KNOWN-LIMITATIONS.md:90 @ 84a90e26 | v0.1.0 | #50 (#50 is the merge-back of the release docs) | — |
| 7 | KNOWN-LIMITATIONS.md:96 @ 84a90e26 | v0.1.0 | #50 (#50 is the merge-back of the release docs) | — |
| 8 | KNOWN-LIMITATIONS.md:105 @ 84a90e26 | v0.1.0 | #50, #200 | — |
| 9 | KNOWN-LIMITATIONS.md:109 @ 84a90e26 | v0.1.0 | #50, #182, #197, #252 | the human's, with a DRAFT sentence appended |
| 10 | KNOWN-LIMITATIONS.md:120 @ 84a90e26 | v0.1.0 | #50 (#50 is the merge-back of the release docs) | — |
| 11 | KNOWN-LIMITATIONS.md:126 @ 84a90e26 | v0.1.0 | #50 (#50 is the merge-back of the release docs) | — |
| 12 | KNOWN-LIMITATIONS.md:133 @ 84a90e26 | v0.1.0 | #50 (#50 is the merge-back of the release docs) | — |
| 13 | KNOWN-LIMITATIONS.md:141 @ 84a90e26 | v0.1.0 | #45, #50 | — |
| 14 | KNOWN-LIMITATIONS.md:148 @ 84a90e26 | v0.1.0 | #50 (#50 is the merge-back of the release docs) | — |
| 15 | KNOWN-LIMITATIONS.md:156 @ 84a90e26 | v0.1.0 | #50 (#50 is the merge-back of the release docs) | — |
| unnumbered (filter-admission paragraph) | KNOWN-LIMITATIONS.md:164 @ 84a90e26 | v0.1.0 | #50 (#50 is the merge-back of the release docs) | — |
| 16 | KNOWN-LIMITATIONS.md:170 @ 84a90e26 | v0.1.0 | #128 | — |
| 29 | KNOWN-LIMITATIONS.md:180 @ 84a90e26 | v0.1.0 | #128, #215 | — |
| 42 | KNOWN-LIMITATIONS.md:193 @ 84a90e26 | v0.1.0 | #215, #219, #223 | the human's / approved |
| 44 | KNOWN-LIMITATIONS.md:199 @ 84a90e26 | v0.1.0 | #223 | the human's / approved |
| 17 | KNOWN-LIMITATIONS.md:207 @ 84a90e26 | on main | #103, #109, #112 | DRAFT, for the human's sight |
| 18 | KNOWN-LIMITATIONS.md:225 @ 84a90e26 | on main | #109, #195 | DRAFT, for the human's sight |
| 19 | KNOWN-LIMITATIONS.md:232 @ 84a90e26 | on main | #109, #205 | — |
| 20 | KNOWN-LIMITATIONS.md:248 @ 84a90e26 | on main | #109, #205 | — |
| 21 | KNOWN-LIMITATIONS.md:259 @ 84a90e26 | on main | #109, #182 | — |
| 22 | KNOWN-LIMITATIONS.md:269 @ 84a90e26 | on main | #109, #205 | — |
| 23 | KNOWN-LIMITATIONS.md:280 @ 84a90e26 | on main | #109, #127, #230 | the human's / approved |
| 24 | KNOWN-LIMITATIONS.md:296 @ 84a90e26 | on main | #127 | — |
| 25 | KNOWN-LIMITATIONS.md:303 @ 84a90e26 | on main | #127 | — |
| 26 | KNOWN-LIMITATIONS.md:312 @ 84a90e26 | on main | #127 | — |
| 27 | KNOWN-LIMITATIONS.md:320 @ 84a90e26 | on main | #127 | — |
| 28 | KNOWN-LIMITATIONS.md:328 @ 84a90e26 | on main | #127, #163 | — |
| 30 | KNOWN-LIMITATIONS.md:336 @ 84a90e26 | on main | #163, #165, #182 | DRAFT, for the human's sight |
| 31 | KNOWN-LIMITATIONS.md:355 @ 84a90e26 | on main | #182, #185, #188 | DRAFT, for the human's sight |
| 32 | KNOWN-LIMITATIONS.md:359 @ 84a90e26 | on main | #182, #185, #188 | DRAFT, for the human's sight |
| 33 | KNOWN-LIMITATIONS.md:363 @ 84a90e26 | on main | #182, #185, #188 | DRAFT, for the human's sight |
| 34 | KNOWN-LIMITATIONS.md:367 @ 84a90e26 | on main | #182, #185 | DRAFT, for the human's sight |
| 35 | KNOWN-LIMITATIONS.md:371 @ 84a90e26 | on main | #185 | DRAFT, for the human's sight |
| 36 | KNOWN-LIMITATIONS.md:375 @ 84a90e26 | on main | #185, #188, #217 | DRAFT, for the human's sight |
| 37 | KNOWN-LIMITATIONS.md:381 @ 84a90e26 | on main | #188 | DRAFT, for the human's sight |
| 38 | KNOWN-LIMITATIONS.md:385 @ 84a90e26 | on main | #188, #195, #217 | DRAFT, for the human's sight |
| 39 | KNOWN-LIMITATIONS.md:391 @ 84a90e26 | on main | #195, #207, #217, #234 | the human's / approved |
| 40 | KNOWN-LIMITATIONS.md:394 @ 84a90e26 | on main | #217, #221 | DRAFT, for the human's sight |
| 41 | KNOWN-LIMITATIONS.md:398 @ 84a90e26 | on main | #217, #222, #228 | DRAFT, for the human's sight |
| 43 | KNOWN-LIMITATIONS.md:402 @ 84a90e26 | on main | #222, #234 | the human's / approved |
| 45 | KNOWN-LIMITATIONS.md:405 @ 84a90e26 | on main | #234 | the human's / approved |
| 46 | KNOWN-LIMITATIONS.md:409 @ 84a90e26 | on main | #234, #246 | the human's / approved |
| 47 | KNOWN-LIMITATIONS.md:413 @ 84a90e26 | on main | #241, #249 | — |
| 51 | KNOWN-LIMITATIONS.md:423 @ 84a90e26 | on main | #246 | DRAFT, for the human's sight |
| 52 | KNOWN-LIMITATIONS.md:427 @ 84a90e26 | on main | #246, #253 | DRAFT, for the human's sight |
| 53 | KNOWN-LIMITATIONS.md:431 @ 84a90e26 | on main | #252 | DRAFT, for the human's sight |
| 54 | KNOWN-LIMITATIONS.md:436 @ 84a90e26 | on main | #253 | DRAFT, for the human's sight |
| 55 | KNOWN-LIMITATIONS.md:440 @ 84a90e26 | on main | #253 | DRAFT, for the human's sight |
| 56 | KNOWN-LIMITATIONS.md:444 @ 84a90e26 | on main | #253 | DRAFT, for the human's sight |

Items the walkthrough asks the operator to read:
- Row N9 sights five KNOWN-LIMITATIONS rows (frontends/shell/MANUAL-WALKTHROUGH.md:954 @ 84a90e26). It passed on 2026-09-20.
- The queue node lists items 37, 38 and 40 among its P6 sights (governance/PLAN.yaml:5861 @ 84a90e26). They are in the sitting script at state/drafts/sitting-script-2026-10-23.md:223 @ 84a90e26 and :263 @ 84a90e26.
- No other item has a walkthrough row or a queued sight.
