*Custodian's filing note (2026-10-12): the architect's final form, after the custodian's section D checks were sent to it by message, of `known-limitations-current-view-stale-box`'s short form, at main 2ca3a53c, handed back at 05:34:50Z by its transcript. It arrived as a message and is extracted here by script from SubagentHandback call 2 of 2 in its transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 6fb7762633560d41318b20e4f672170565d2528049791330496be29ada9bd360. Write audit PASS: zero write calls over the agent's transcript (Read 31, Grep 24, Glob 1). The form is committed as `KNOWN-LIMITATIONS-ITEM-42-CURRENT-VIEW-PREREGISTRATION.md` with its 29 pins hashed at their own revs, and section B's phrase on the placeholder hashes reworded to say so.*

---

Reviewed: main @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 · Verdict: pass with notes. Your four §D results are folded in. Every `<TBD>` is resolved; `HASH-TBD` is left for you to compute.

````markdown
# KNOWN-LIMITATIONS item 42: Current view can publish an area the map no longer shows — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The docs lane's piece ahead of piece f (the human's item 3 of state/directives/2026-10-12-current-view-graded-s1-placed-limitation-release-hold-214-merged.md). §A's words are the architect's draft under item 2e of state/directives/2026-10-11-direction-after-status-review.md; the human approves or replaces them here, recorded as Amendment 1 (class 5), before the worker applies them.

```
Authority: PLAN node known-limitations-current-view-stale-box; state/directives/2026-10-12-current-view-graded-s1-placed-limitation-release-hold-214-merged.md, items 1 and 3; state/directives/2026-10-11-direction-after-status-review.md, items 2c and 2e; the number: frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md Amendment 1 A14 and Amendment 2 item 10 (40 and 41 are phase B's), so this item is 42; KNOWN-LIMITATIONS items as disjoint paths: state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:29 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:dc6bf46fc21f8f6cd3e6cb64b1fdec690aad6fd5b32be78300b9629a629efe78. Evidence (a read, cited for what it reported): state/consults/2026-10-11-export-current-view-after-unreported-fit-read.md. Reuse index: node tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for known limitations, `No prior art recorded for "known limitations". Research it before planning an implementation.` and, for current view, `No prior art recorded for "current view". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: KNOWN-LIMITATIONS.md (one new item 42, placed after item 29 and before the "On main since v0.1.0" heading, with its on-main paragraph and one HTML source comment; no other item edited); PLAN.yaml (this node's record); 2 files; declared line budget <= 20 changed lines by §21c's counting, this form excluded.
Change: KNOWN-LIMITATIONS gains item 42 in the words Amendment 1 records (§A's draft until then), byte for byte by script, with §A's on-main paragraph and source comment, every HASH-TBD in that comment computed at its named commit before the commit.
Tests+mutation: none added or changed (documents only); the reviewer checks the words byte for byte against Amendment 1, every clause of §B at the v0.1.0 tag and at the PR's base, every pin by recomputation, and that no other item and no line outside Scope changes.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows; a document states what unchanged code does, at the v0.1.0 tag and on main.
```

### §A. The item (draft words for the human, item 2e)

Item text (one line):

42. **Current view can publish an area the map no longer shows.** Current view is the scope selected by default for **Publish…**, and it publishes the area the map showed at your last pan or zoom. Zoom to layer counts as a zoom when it moves the map. The map can change what it shows without that area following: after a filter Apply or Clear, the map can move by itself to fit the data, and when the map changes size, it shows more or less of it. Until your next pan or zoom, Current view then publishes the earlier area, not the one on the map. The approval dialog's Row scope line calls that area "the current viewport extent" and gives it only as four numbers, with nothing to say whether they match the map. Meanwhile: with Current view chosen, pan or zoom the map a little as the last thing before you click **Publish…**, and do it again if the map then moves by itself. Current view then publishes what the map shows. To publish the whole file instead, choose Whole dataset.

On-main paragraph (after the comment and one blank line, indented 3 spaces as item 2's is):

**On `main` (not the v0.1.0 artifact above).** The button reads **Export interactive map…**, in the panel labelled Export. While the map has a width and a height, a change of its size now updates Current view, except in the one exception item 39 states. After an Apply or Clear that moves the map, Current view still publishes the earlier area until your next pan or zoom, and what to do meanwhile is the same, with **Export interactive map…** in place of **Publish…**.

Source comment (one line, directly under the item text; every pin written in full, on one line):

<!-- [The human's wording, approved | The human's own words, given] in KNOWN-LIMITATIONS-ITEM-42-CURRENT-VIEW-PREREGISTRATION.md Amendment 1; drafted by the architect under item 2e of state/directives/2026-10-11-direction-after-status-review.md. Authority: state/directives/2026-10-12-current-view-graded-s1-placed-limitation-release-hold-214-merged.md, items 1 and 3. Evidence: state/consults/2026-10-11-export-current-view-after-unreported-fit-read.md. At the v0.1.0 tag: frontends/shell/src/publish/PublishPanel.tsx:326 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (Current view is the default); frontends/shell/src/publish/PublishPanel.tsx:588 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the Current view radio); frontends/shell/src/publish/PublishPanel.tsx:577 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (Whole dataset); frontends/shell/src/publish/PublishPanel.tsx:605 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (Publish…); frontends/shell/src/publish/PublishPanel.tsx:345 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the box is read at click time); frontends/shell/src/App.tsx:1388-1402 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the box's only writer apart from the reset at open); frontends/shell/src/App.tsx:1541-1548 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the panel is keyed on the dataset, so an Apply does not reset it); frontends/shell/src/filter/FilterPanel.tsx:66-69 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (Clear is Apply with an empty predicate); frontends/shell/src/App.tsx:327 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (an issued Apply or Clear re-arms the fit); frontends/shell/src/App.tsx:755 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD, frontends/shell/src/App.tsx:1061 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD and frontends/shell/src/App.tsx:1170 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (every deps object passes the canvas's reset, whichever arm); frontends/shell/src/canvas/WorkingCanvas.tsx:1339-1342 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the reset); frontends/shell/src/canvas/WorkingCanvas.tsx:1285-1295 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD and frontends/shell/src/canvas/WorkingCanvas.tsx:1486-1491 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the automatic fits); frontends/shell/src/canvas/WorkingCanvas.tsx:1157-1162 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (a fit that does not notify reports nothing); frontends/shell/src/canvas/WorkingCanvas.tsx:1760-1769 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (a pan or zoom reports); frontends/shell/src/canvas/WorkingCanvas.tsx:1335 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD and frontends/shell/src/App.tsx:1409 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (Zoom to layer reports; its button); frontends/shell/src/canvas/WorkingCanvas.tsx:439-441 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (no resize report); frontends/shell/src/publish/PublishDialog.tsx:251-252 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD and frontends/shell/src-tauri/src/publish.rs:115-123 @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the Row scope line). On main: frontends/shell/src/App.tsx:1886-1895 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and frontends/shell/src/App.tsx:1904-1906 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD (the writers, a resize included); frontends/shell/src/canvas/WorkingCanvas.tsx:1954-1958 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and frontends/shell/src/canvas/viewportBbox.ts:76-79 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD (a resize reports unless nothing was last asked for, item 39's exception, or the size is zero); frontends/shell/src/residency/candidateArmSession.ts:1658 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD (every reissue re-arms the fit); frontends/shell/src/publish/PublishPanel.tsx:513 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and frontends/shell/src/publish/PublishPanel.tsx:610 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD (the labels). Not covered, by item 2c of the same direction: a pan made after an Apply or Clear but before the map has fitted itself, inside the request round trip, is followed by the fit (the item's "do it again" covers what the operator sees); the baseline residency arm, reachable only through the instrumented build's setResidencyArm switch; the dev-only view-state and publish hooks. The fix is PLAN.yaml node export-current-view-after-unreported-fit; its form decides this item's on-main paragraph when it lands. -->

### §B. Clause check

T = b391e43622056324c56d35cc33065305140a8415; M = 2ca3a53ca812684a7b2579980db2f980c5d2a286. The pins are the source comment's (sha256:HASH-TBD). The T spans 326, 345, 1388-1402, 1541-1548 and the WorkingCanvas spans are the read's. 588 follows from the read's identical hashes for PublishPanel.tsx:579-594 @ T and :584-599 @ M. 327, 577, 605, 755, 1061, 1170 and 1409 come from the custodian's script at T.

| # | Clause | Evidence | Holds |
|---|---|---|---|
| C1 | Current view can publish an area the map no longer shows | C3 to C7 | yes |
| C2 | Current view is the scope selected by default for Publish… | PublishPanel.tsx:326, :588, :605 @ T | yes |
| C3 | It publishes the area the map showed at your last pan or zoom | App.tsx:1388-1402 @ T, the only writer apart from the reset at open; reports at WorkingCanvas.tsx:1760-1769 and :1335 @ T, plus the dev seam (§C); the box is read at click, PublishPanel.tsx:345 @ T | yes |
| C4 | Zoom to layer counts as a zoom when it moves the map | Its only camera write is fitToExtent with notify true (WorkingCanvas.tsx:1335 @ T), and that call reports | yes |
| C5 | After a filter Apply or Clear, the map can move by itself to fit the data | FilterPanel.tsx:66-69 @ T. On an issued outcome, applyFilter calls the deps reset (App.tsx:327 @ T). Every deps object App builds passes the canvas reset (App.tsx:755, :1061, :1170 @ T), so the shipped arm reaches it through applyFilter. candidateArmSession.ts at T has no call. The reset re-arms the auto-fits (WorkingCanvas.tsx:1339-1342, :1285-1295, :1486-1491 @ T), whose notify is false (:1157-1162) | yes |
| C6 | When the map changes size, it shows more or less of it, without that area following | No onResize at T (prop doc WorkingCanvas.tsx:439-441 @ T; the read's script count is 0). The view box depends on the canvas size (:1760-1769). No cause of a size change is claimed | yes |
| C7 | Until your next pan or zoom, it publishes the earlier area | App.tsx:1541-1548 @ T (keyed on the dataset); disabled only by !hasSettledView (PublishPanel.tsx:36-37 @ T), which resets only at admit (App.tsx:790-796 @ T) | yes |
| C8 | Row scope says "the current viewport extent" and gives four numbers, with nothing to say whether they match | PublishDialog.tsx:251-252 @ T (identical at M); publish.rs:115-123 @ T and :129-131 @ M; the quoted span is copied byte for byte | yes |
| C9 | Pan or zoom a little as the last thing before Publish… | WorkingCanvas.tsx:1760-1769 @ T (every view-state tick reports); PublishPanel.tsx:605 @ T | yes |
| C10 | Do it again if the map then moves by itself | The only camera move the operator does not make is the auto-fit (C5) | yes |
| C11 | Current view then publishes what the map shows | After a pan, the box is the camera's view at the canvas's size (:1760-1769 @ T; WorkingCanvas.tsx:2018-2028 @ M) | yes |
| C12 | Whole dataset publishes the whole file | PublishPanel.tsx:577 @ T; the whole-file arm uses ViewportQuery::all() (engine/src/stream.rs:216 @ T, item 8's pin; publish.rs:104 @ M); items 5 and 8 still apply | yes |
| O1 | The button reads Export interactive map…, in the panel labelled Export | PublishPanel.tsx:610 and :513 @ M | yes |
| O2 | While the map has a width and a height, a resize now updates Current view, except in item 39's exception | WorkingCanvas.tsx:1954-1958 @ M; viewportBbox.ts:76-79 @ M (77: no write at size zero; StudioLayout.tsx on main declares no minimum); App.tsx:1886-1895, :1904-1906 @ M; the exception is the window in which nothing was last asked for (WorkingCanvas.tsx:1354, :1535; candidateArmSession.ts:1658 @ M) | yes |
| O3 | After an Apply or Clear that moves the map, it still publishes the earlier area | App.tsx:345-348, :2034-2042 @ M; candidateArmSession.ts:1631-1658 @ M; WorkingCanvas.tsx:1348-1355, :1478-1488, :1681-1685 @ M; PublishPanel.tsx:329, :36-38, :348 @ M | yes |
| O4 | What to do meanwhile is the same, with the new label | WorkingCanvas.tsx:2018-2028 and PublishPanel.tsx:610 @ M | yes |

### §C. Not covered (item 2c)

As named in the source comment. A resize to zero size on main is not in this list: O2's words state it.

### §D. Tag checks (run by the custodian's script, before this form was committed)

1. At T, the reset is called only from App: App.tsx:327, inside applyFilter, and deps lines 755, 1061 and 1170. C5 rests on App's path.
2. C6 makes no claim about what changes the map's size at T.
3. StudioLayout.tsx on main declares no minimum, so O2 carries the condition that the map has a width and a height.
4. The labels are resolved as pinned. The disclosure word "Publish" was not confirmed and is not used.

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

**Changes from the draft:**
- **C5 and the pins.** The re-arm at T comes through App's `applyFilter`, not through candidateArmSession.ts: App.tsx:327, and the deps at :755, :1061 and :1170 @ T. All four lines are now pinned, and the `candidateArmSession.ts:<TBD>` pin is gone. C5 holds for the shipped arm.
- **C6.** "such as resizing the window" is dropped, and the clause now reads "when the map changes size". The tag's styles alone do not show that the canvas container follows the window.
- **O2.** It now says "While the map has a width and a height". No minimum was found in main's layout, and viewportBbox.ts:77 writes nothing at size zero.
- **C2.** "the Publish panel" is gone, because the disclosure label was not confirmed. The item now says "the scope selected by default for **Publish…**" (PublishPanel.tsx:605 @ T).
- **"Current view" radio.** It is pinned at PublishPanel.tsx:588 @ T. The read's identical hashes for 579-594 @ T and 584-599 @ M confirm the text.
- **Labels pinned.** Whole dataset at :577 @ T and Zoom to layer at App.tsx:1409 @ T.
- **C4.** "Zoom to layer counts as a zoom when it has features to fit; when it has none, it does nothing" becomes "Zoom to layer counts as a zoom when it moves the map". The no-anchor line at T was never pinned, and the new clause rests on :1335 alone.
- **On-main labels.** "The panel is labelled Export, and its button reads …" becomes "The button reads **Export interactive map…**, in the panel labelled Export."
- **§B and §D.** §B now carries the clause table inside the form; item 2e places it there, and the draft only pointed to a report that was never filed. §D now records the four results of your script instead of the checks to be run.
