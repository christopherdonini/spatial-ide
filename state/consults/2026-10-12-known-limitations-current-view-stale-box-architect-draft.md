*Custodian's filing note (2026-10-12): the architect's draft of `known-limitations-current-view-stale-box`'s short form, at main 2ca3a53c, handed back at 05:26:35Z by its transcript. It arrived as a message and is extracted here by script from SubagentHandback call 1 of 2 in its transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 9827d2b5615750a4c036b08710b8b0311d75e2000977e17a7597988619b4f66e. Write audit PASS: zero write calls over the agent's transcript (Read 31, Grep 24, Glob 1).*

---

Reviewed: main @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 · Verdict: pass with notes. This is a draft, not a gate. Two checks at the tag must be run before the form is committed (§D).

**The item number is 42.** I checked it.
- KNOWN-LIMITATIONS.md at main stops at 39.
- Phase B holds 40 and 41: milestone 2's form, Amendment 1 A14 and Amendment 2 item 10.
- Milestone 3's new items float: its §2.10 takes "the next free number at the code base", so it gets 43 and up.
- PLAN.yaml (phase B's summary) and CUT-STATE.md already call this item 42.
- No other record claims 42. The old "entry 42" in RELEASE-0.1.md and DECISIONS-PENDING.md is a ledger entry, not this file's item.

## 1. Form choice

Five-line short form (`AUTONOMY.md` §21d), with a single combined reviewer gate (§21b).
- It touches documents only: KNOWN-LIMITATIONS.md and PLAN.yaml, 2 files, at most 20 lines. That is far under §21c's limits.
- It touches none of §21a's four categories. No ADR, no security posture, no wire. It adds no guarantee: it states a limit of code that does not change.
- The same route was used for KNOWN-LIMITATIONS items 8 and 2.
- The Out-of-scope line says the piece touches none of the four, so Round 25's "Out-of-scope at dispatch" rule does not force the full form.
- Item 2e needs the drafted sentence and its clause check in the form. They go in sections below the five lines, for the human to answer there.

## 2. Draft form

````markdown
# KNOWN-LIMITATIONS item 42: Current view can publish an area the map no longer shows — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The docs lane's piece ahead of piece f (the human's item 3 of state/directives/2026-10-12-current-view-graded-s1-placed-limitation-release-hold-214-merged.md). §A's words are the architect's draft under item 2e of state/directives/2026-10-11-direction-after-status-review.md; the human approves or replaces them here, recorded as Amendment 1 (class 5), before the worker applies them.

```
Authority: PLAN node known-limitations-current-view-stale-box; state/directives/2026-10-12-current-view-graded-s1-placed-limitation-release-hold-214-merged.md, items 1 and 3; state/directives/2026-10-11-direction-after-status-review.md, items 2c and 2e; the number: frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md Amendment 1 A14 and Amendment 2 item 10 (40 and 41 are phase B's), so this item is 42; KNOWN-LIMITATIONS items as disjoint paths: state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:29 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:dc6bf46fc21f8f6cd3e6cb64b1fdec690aad6fd5b32be78300b9629a629efe78. Evidence (a read, cited for what it reported): state/consults/2026-10-11-export-current-view-after-unreported-fit-read.md. Reuse index: node tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for known limitations, `No prior art recorded for "known limitations". Research it before planning an implementation.` and, for current view, `No prior art recorded for "current view". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: KNOWN-LIMITATIONS.md (one new item 42, placed after item 29 and before the "On main since v0.1.0" heading, with its on-main paragraph and one HTML source comment; no other item edited); PLAN.yaml (this node's record); 2 files; declared line budget <= 20 changed lines by §21c's counting, this form excluded.
Change: KNOWN-LIMITATIONS gains item 42 in the words Amendment 1 records (§A's draft until then), byte for byte by script, with §A's on-main paragraph and source comment, every HASH-TBD and <TBD> line in that comment computed at its named commit before the commit.
Tests+mutation: none added or changed (documents only); the reviewer checks the words byte for byte against Amendment 1, every clause of §B at the v0.1.0 tag and at the PR's base, every pin by recomputation, §D's two tag checks, and that no other item and no line outside Scope changes.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows; a document states what unchanged code does, at the v0.1.0 tag and on main.
```

### §A. The item (draft words for the human, item 2e)

Item text (one line):

42. **Current view can publish an area the map no longer shows.** Current view is the scope the Publish panel starts on, and it publishes the area the map showed at your last pan or zoom. Zoom to layer counts as a zoom when it has features to fit; when it has none, it does nothing. The map can change what it shows without that area following: after a filter Apply or Clear, the map can move by itself to fit the data, and a change of the map's size, such as resizing the window, shows more or less of it. Until your next pan or zoom, Current view then publishes the earlier area, not the one on the map. The approval dialog's Row scope line calls that area "the current viewport extent" and gives it only as four numbers, with nothing to say whether they match the map. Meanwhile: with Current view chosen, pan or zoom the map a little as the last thing before you click **Publish…**, and do it again if the map then moves by itself. Current view then publishes what the map shows. To publish the whole file instead, choose Whole dataset.

On-main paragraph (after the comment and one blank line, indented 3 spaces as item 2's is):

**On `main` (not the v0.1.0 artifact above).** The panel is labelled Export, and its button reads **Export interactive map…**. A change of the map's size now updates Current view, except in the one exception item 39 states. After an Apply or Clear that moves the map, Current view still publishes the earlier area until your next pan or zoom, and what to do meanwhile is the same, with **Export interactive map…** in place of **Publish…**.

Source comment (one line, directly under the item text; T = b391e43622056324c56d35cc33065305140a8415, the v0.1.0 tag; M = 2ca3a53ca812684a7b2579980db2f980c5d2a286; every pin is written in full and on one line):

<!-- [The human's wording, approved | The human's own words, given] in KNOWN-LIMITATIONS-ITEM-42-CURRENT-VIEW-PREREGISTRATION.md Amendment 1; drafted by the architect under item 2e of state/directives/2026-10-11-direction-after-status-review.md. Authority: state/directives/2026-10-12-current-view-graded-s1-placed-limitation-release-hold-214-merged.md, items 1 and 3. Evidence: state/consults/2026-10-11-export-current-view-after-unreported-fit-read.md. At the v0.1.0 tag: frontends/shell/src/publish/PublishPanel.tsx:326 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (Current view is the default); frontends/shell/src/publish/PublishPanel.tsx:345 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the box is read at click time); frontends/shell/src/App.tsx:1388-1402 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the box's only writer apart from the reset at open); frontends/shell/src/App.tsx:1541-1548 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the panel is keyed on the dataset, so an Apply does not reset it); frontends/shell/src/canvas/WorkingCanvas.tsx:1157-1162 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (a fit that does not notify reports nothing); frontends/shell/src/canvas/WorkingCanvas.tsx:1285-1295 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD and frontends/shell/src/canvas/WorkingCanvas.tsx:1486-1491 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the automatic fits); frontends/shell/src/canvas/WorkingCanvas.tsx:1339-1342 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (re-armed by an Apply or Clear); frontends/shell/src/residency/candidateArmSession.ts:<TBD> @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the shipped arm's re-arm, §D check 1); frontends/shell/src/canvas/WorkingCanvas.tsx:1760-1769 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (a pan or zoom reports); frontends/shell/src/canvas/WorkingCanvas.tsx:1335 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (Zoom to layer reports); frontends/shell/src/canvas/WorkingCanvas.tsx:439-441 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (no resize report); frontends/shell/src/publish/PublishDialog.tsx:251-252 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD and frontends/shell/src-tauri/src/publish.rs:115-123 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the Row scope line). On main: frontends/shell/src/App.tsx:1886-1895 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and frontends/shell/src/App.tsx:1904-1906 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD (the writers, a resize included); frontends/shell/src/canvas/WorkingCanvas.tsx:1954-1958 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and frontends/shell/src/canvas/viewportBbox.ts:76-79 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD (a resize reports unless nothing was last asked for: item 39's exception); frontends/shell/src/residency/candidateArmSession.ts:1658 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD (every reissue re-arms the fit); frontends/shell/src/publish/PublishPanel.tsx:513 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and frontends/shell/src/publish/PublishPanel.tsx:610 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD (the labels). Not covered, by item 2c of the same direction: a pan made after an Apply or Clear but before the map has fitted itself, inside the request round trip, is followed by the fit (the item's "do it again" covers what the operator sees); the baseline residency arm, reachable only through the instrumented build's setResidencyArm switch; the dev-only view-state and publish hooks. The fix is PLAN.yaml node export-current-view-after-unreported-fit; its form decides this item's on-main paragraph when it lands. -->

### §B. Clause check

The table is in the architect's report (`state/consults/` filing of this draft). The reviewer re-runs every row at T and at the PR's base.

### §C. Not covered (item 2c)

The source comment names them. One more case, on main, is for the reviewer: a resize to zero width or height reports nothing (viewportBbox.ts:77). §D check 3.

### §D. Before commit (the custodian, by script)

1. `git grep -n resetFitForNewGeneration b391e43622056324c56d35cc33065305140a8415 -- frontends/shell/src/residency/candidateArmSession.ts`. If there is no call, the shipped arm at the tag needs another route to the fit after an Apply, and clause C5 goes back to the architect before this form is committed.
2. At T, the canvas's CSS size follows the window (`frontends/shell/src/styles.css` and App's layout at T). If it does not, C6's "such as resizing the window" goes back to the architect.
3. On main: can ordinary use bring the map to zero width or height (layout minimums in `layout/StudioLayout.tsx`)? If it can, O2's words become: "A change of the map's size now updates Current view while the map has a width and a height, except in the one exception item 39 states."
4. Resolve the tag labels by `git grep -n` at T: the disclosure "Publish", the button "Publish…", the radios "Current view" and "Whole dataset", the Zoom to layer button, and FilterPanel's Apply and Clear.

### §E. Gates

- **Route.** A single combined reviewer gate (§21b), under proportional gates (state/directives/2026-10-05-product-first-direction.md, section 2).
- **What blocks.** It blocks only on Correctness or Evidence. A clause untrue at T or at the base claims a limit the code does not support, so it is Correctness.
- **Wording blocks.** The words are the human's (item 2e). So a block on the wording alone carries the reviewer's replacement words, each clause checked, and the human answers under item 2b.
- **Documentation findings.** They are fixed before the merge and do not cause a re-gate.
- **Order with phase B.** Phase B edits items 36, 38, 40 and 41, and the items are disjoint by number. Whichever piece merges later merges main in before its last gate run.

### §F. Open for the human

- OPEN-1: approve or replace §A's words (item 2e).
- OPEN-2: should the v0.1.0 release page's notes also carry item 42? Changing published text is the human's. This piece does not touch them.
````

## 3. Clause check

T = b391e43622056324c56d35cc33065305140a8415, M = 2ca3a53ca812684a7b2579980db2f980c5d2a286. The T line numbers come from the read; they are evidence and the reviewer recomputes them. The M line numbers I read myself at 2ca3a53c. Every hash is sha256:HASH-TBD.

**The item, at the tag:**

| # | Clause | At the tag (T) | Holds? |
|---|---|---|---|
| C1 | Current view can publish an area the map no longer shows | C3 to C7 combined | yes, if C5 and C6 hold |
| C2 | Current view is the scope the Publish panel starts on | `frontends/shell/src/publish/PublishPanel.tsx:326 @ T sha256:HASH-TBD`. The "Publish" label line is `<TBD>` (§D check 4). | yes; the label goes to the on-main note |
| C3 | It publishes the area the map showed at your last pan or zoom | The writer is `frontends/shell/src/App.tsx:1388-1402 @ T sha256:HASH-TBD`. Report sites: `frontends/shell/src/canvas/WorkingCanvas.tsx:1760-1769 @ T sha256:HASH-TBD` (pan and zoom) and `:1335` (Zoom to layer); the third is the dev seam (§C). The box is read at click: `frontends/shell/src/publish/PublishPanel.tsx:345 @ T sha256:HASH-TBD`. | yes |
| C4 | Zoom to layer counts as a zoom when it has features to fit; with none it does nothing | `WorkingCanvas.tsx:1335 @ T` calls fitToExtent with notify true. The no-anchor `return false` line at T is `<TBD>`. These are item 39's own words. | yes |
| C5 | After a filter Apply or Clear, the map can move by itself to fit the data | `FilterPanel.tsx:66-69 @ T`, then `App.tsx:325-328 @ T`, then `:755`, then `WorkingCanvas.tsx:1339-1342 @ T`. Auto-fits: `:1285-1295` and `:1486-1491`. Notify false reports nothing: `:1157-1162`. | yes, but the shipped (candidate) arm at T still needs §D check 1. The read did not open candidateArmSession.ts. |
| C6 | A change of the map's size shows more or less of the map, without the area following | At T, WorkingCanvas has no onResize: the read's script count is 0, and the prop doc is `WorkingCanvas.tsx:439-441 @ T`. The view box is computed from the canvas size (`:1760-1769`). | yes, with §D check 2 for "the window" |
| C7 | Until your next pan or zoom, it publishes the earlier area | The panel is keyed on the dataset: `App.tsx:1541-1548 @ T`. It is disabled only by `!hasSettledView`: `PublishPanel.tsx:36-37 @ T`. That flag resets only at admit: `App.tsx:790-796 @ T`. | yes |
| C8 | The Row scope line calls the area "the current viewport extent" and gives four numbers, with nothing to say whether they match | `PublishDialog.tsx:251-252 @ T` (identical at M, per the read's `git diff --quiet`). The format is `frontends/shell/src-tauri/src/publish.rs:115-123 @ T`. At M it is `publish.rs:129-131`, which I read: "row scope: the current viewport extent only (xmin {}, ymin {}, xmax {}, ymax {})". The quoted span is copied byte for byte. | yes |
| C9 | Pan or zoom a little as the last thing before you click Publish… | Every view-state tick reports (`:1760-1769 @ T`). The label "Publish…" at T is `<TBD>` (§D check 4). | yes, once the label is verified |
| C10 | Do it again if the map then moves by itself | At T the only move the operator does not make is the auto-fit (C5). This covers the round-trip case. | yes |
| C11 | Current view then publishes what the map shows | After a pan, the box is computeAuthoritativeViewportBbox of the camera and the canvas size (`:1760-1769 @ T`; at M `WorkingCanvas.tsx:2018-2028`). | yes |
| C12 | Choose Whole dataset to publish the whole file | The whole-file arm uses ViewportQuery::all(): `engine/src/stream.rs:216 @ T` (item 8's comment pin). At M it is `publish.rs:104`. Items 5 and 8 still apply. | yes |

**The on-main note, at M:**

| # | Clause | At main (M) | Holds? |
|---|---|---|---|
| O1 | The panel is labelled Export; the button reads Export interactive map… | `PublishPanel.tsx:513 @ M` and `PublishPanel.tsx:610 @ M` | yes |
| O2 | A resize now updates Current view, except in item 39's exception | onResize: `WorkingCanvas.tsx:1954-1958 @ M`. Decision: `viewportBbox.ts:76-79 @ M`. Writers: `App.tsx:1886-1895` and `:1904-1906 @ M`. The exception is the time when nothing is recorded as last asked for (`WorkingCanvas.tsx:1354`, `:1535`), and every reissue clears it (`candidateArmSession.ts:1658 @ M`). That is the window the human's item 5 describes. | yes, with §D check 3 for a zero size |
| O3 | After an Apply or Clear that moves the map, it still publishes the earlier area | The Apply path: `App.tsx:345-348 @ M` and `candidateArmSession.ts:1631-1658 @ M`. Fits: `WorkingCanvas.tsx:1478-1488`, `:1681-1685`, `:1348-1355`. Panel: `App.tsx:2034-2042`, `PublishPanel.tsx:329`, `:36-38`, `:348`. | yes |
| O4 | What to do meanwhile is the same, with the new label | `WorkingCanvas.tsx:2018-2028 @ M`; `PublishPanel.tsx:610 @ M` | yes |

These sentences are the human's under item 2e.

## 4. Open items for the human

- **OPEN-2:** should the v0.1.0 release page's notes carry item 42? This is outward-published text, and the piece does not touch it.

Nothing else is the human's. Placement, the number and the route are settled above.

**Notes for the custodian (not the human's):**
- The fix's form (`export-current-view-after-unreported-fit`) must take on item 42's on-main paragraph: it rewrites or retires it when the fix lands.
- The read's §2 says the tag is "the same for Apply and Clear". That rests on App's own path; the read says it did not open candidateArmSession.ts. §D check 1 closes this gap.

## 5. Files read

- C:\dev\spatial-ide\state\directives\2026-10-12-current-view-graded-s1-placed-limitation-release-hold-214-merged.md
- C:\dev\spatial-ide\state\directives\2026-10-11-direction-after-status-review.md
- C:\dev\spatial-ide\state\consults\2026-10-11-export-current-view-after-unreported-fit-read.md
- C:\dev\spatial-ide\KNOWN-LIMITATIONS.md
- C:\dev\spatial-ide\KNOWN-LIMITATIONS-ITEM-8-PREREGISTRATION.md
- C:\dev\spatial-ide\KNOWN-LIMITATIONS-ITEM-2-ON-MAIN-PREREGISTRATION.md
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (§2.8, A14, Amendments 2 to 6)
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md (§2.10)
- C:\dev\spatial-ide\PLAN.yaml (the nodes `known-limitations-current-view-stale-box`, `export-current-view-after-unreported-fit` and `stale-test-names-and-comments`)
- C:\dev\spatial-ide\AUTONOMY.md §21a to §21d
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (the short form and the Round 25 additions)
- At M:
  - C:\dev\spatial-ide\frontends\shell\src\publish\PublishPanel.tsx
  - C:\dev\spatial-ide\frontends\shell\src\publish\PublishDialog.tsx (200-280)
  - C:\dev\spatial-ide\frontends\shell\src-tauri\src\publish.rs (60-136)
  - C:\dev\spatial-ide\frontends\shell\src\App.tsx (255-351, 830-849, 1010-1029, 1325-1384, 1830-1909, 2028-2047)
  - C:\dev\spatial-ide\frontends\shell\src\canvas\WorkingCanvas.tsx (1320-1356, 1470-1536, 1676-1687, 1945-2029)
  - C:\dev\spatial-ide\frontends\shell\src\canvas\viewportBbox.ts (45-80)
  - C:\dev\spatial-ide\frontends\shell\src\residency\candidateArmSession.ts (1625-1669)
  - C:\dev\spatial-ide\frontends\shell\src\filter\FilterPanel.tsx (55-134)
  - C:\dev\spatial-ide\frontends\shell\src\layout\regionParts.tsx (172-188)
- C:\dev\spatial-ide\frontends\shell\MANUAL-WALKTHROUGH.md (grep: Zoom to layer, Part M)
- Tag code: not read directly. I have no git. Every T line above comes from the read, or is marked `<TBD>` for §D.
