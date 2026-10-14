Reviewed: main @ b9e7822938ec18394dbb4465c5bf471968f09582
sha256: not computed

Verdict: the draft is delivered. One Evidence limit has to close before the form is committed. My tools cannot read git objects, so I could not read the v0.1.0 tag (b391e436). Every tag-side row below is a check for the custodian's script, which stops on any mismatch (§D in the form). Every main-side row was read at b9e78229.

Three findings that shape the words:
- **The third axis does reach the bundle.** The brief's and PLAN's one-line summary says a third CRS axis is "not … carried into a bundle". That is not true of the code. The engine keeps the whole PROJJSON object as the definition (engine/src/geoparquet.rs:440), and the manifest carries it as a string (kernel/src/publish/mod.rs:1391-1394; ADR-017:215). So the third axis is in every published manifest, unread. The draft says this. Adopting the summary's words as they stand would be an untrue limit, which is a Correctness finding.
- **The epoch and `edges` value are never read.** `GeoMeta::parse` reads no `epoch` or `edges` member. Scanning engine/kernel/protocol/shell/src-tauri/viewer sources at M finds no product read of either. The only hits are Unix-epoch comments, the tile manager's issue epochs, and bbox-edge comments.
- **One code path does read every axis, but the shipped app never runs it.** In engine/src/lod.rs, `axes()` (:576-582) reads every axis, but only for `build_tiers`, and no product path calls `build_tiers` (item 33). It goes in the source comment's not-covered list.

Reuse index: the one hit, `axis-order-handling`, concerns swapping lat/lon order. It does not bear on a third axis or on this documents-only item. Recorded in the form; nothing is built.

Number: **44.** On main, items 1–42 are all taken, with no gaps. 43 is item L of b2-piece-1b-recording, set to 43 on its branch (C:\dev\wt\1b\KNOWN-LIMITATIONS.md:390). The record of that is the stage-2 worker report's item 3 (state/consults/2026-10-14-b2-piece-1b-recording-stage-2-worker-report.md:52). Amendment 5 of its form does not itself state the number. Milestone 3 (proposed) takes "the next free number at the code base", so the number is re-checked at merge.

Placement: in the v0.1.0 section, directly after item 42's on-main paragraph (main :194) and before the "## On main since v0.1.0" heading (main :196). Item 43 sits at the end of the file on the 1b branch, so the two edits are disjoint (directive 2026-10-09, item 5). Item 44 needs its own column-0 comment line before it, as item 42 did (PR #215 D-2). Without it, GitHub would render item 44 as 43.

What to do meanwhile: none fits. The app shows none of the three, so there is nothing in the app to check or work around. Reading the file's `geo` metadata needs a tool outside the app. The draft has no Meanwhile sentence, and the form says why.

## 1. Form choice

**Five-line short form (§21d), single combined reviewer gate (§21b).**
- **Size:** one docs file plus the node's PLAN record, 2 files and about 5 lines, well under §21c's 150 lines and 8 files.
- **No §21a category:** no ADR file, nothing under protocol/, no wire, no security posture.
- **No guarantee or invariant changes:** the item states where unchanged code stops. It touches no test, string or code.
- **Round 25 item 2(e):** the Out-of-scope line asserts that none of the four is touched, so the five-line form is open from dispatch.
- **Precedent:** item 42's form.

## 2. Draft form

````markdown
<!-- path: KNOWN-LIMITATIONS-ITEM-44-CRS-EPOCH-EDGES-THIRD-AXIS-PREREGISTRATION.md (repository root, beside item 42's form) -->
# KNOWN-LIMITATIONS item 44: a file's coordinate epoch, its edges value and a CRS's third axis — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The docs lane's piece after stale-test-names-and-comments. §A's words are the architect's draft under item 2e of state/directives/2026-10-11-direction-after-status-review.md; the human approves or replaces them here, recorded as Amendment 1 (class 5), before the worker applies them.

```
Authority: PLAN node known-limitations-crs-epoch-edges-third-axis; state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md, item 5 (the brief's section 2 approved as direction, its section 4 as the work); state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md, section 4 item 1, under R5; state/directives/2026-10-11-direction-after-status-review.md, items 2c and 2e; the number: 43 is b2-piece-1b-recording's item L (state/consults/2026-10-14-b2-piece-1b-recording-stage-2-worker-report.md, item 3), so this item is 44 at the base b9e78229, re-checked when the branch merges main; KNOWN-LIMITATIONS items as disjoint paths: state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:29 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:dc6bf46fc21f8f6cd3e6cb64b1fdec690aad6fd5b32be78300b9629a629efe78. Reuse index (tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, printed byte for byte as the custodian's brief carries it): for coordinate epoch, exit 1, `No prior art recorded for "coordinate epoch". Research it before planning an implementation.`; for crs axis, exit 0, `capability: axis-order-handling → gdal [CONCEPTUAL], geopandas [CONCEPTUAL], duckdb-spatial [CONCEPTUAL], geoarrow [CONCEPTUAL]   (open, P1)`; for known limitations, exit 1, `No prior art recorded for "known limitations". Research it before planning an implementation.`; the one hit concerns axis order, not a third axis, and does not bear on a documents-only item.
Scope: KNOWN-LIMITATIONS.md (one new item 44, placed after item 42's on-main paragraph and before the "On main since v0.1.0" heading: one column-0 comment line, the item, and one HTML source comment; no other item edited); PLAN.yaml (this node's record); 2 files; declared line budget <= 20 changed lines by §21c's counting, this form excluded.
Change: KNOWN-LIMITATIONS gains item 44 in the words Amendment 1 records (§A's draft until then), byte for byte by script, with §A's column-0 line and source comment; no on-main paragraph, because the words hold at the v0.1.0 tag and on main (§D).
Tests+mutation: none added or changed (documents only); the reviewer checks the words byte for byte against Amendment 1, every clause of §B at the v0.1.0 tag and at the PR's base, every pin by recomputation, and that no other item and no line outside Scope changes.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows; a document states what unchanged code does, at the v0.1.0 tag and on main.
```

Rules (the human's item 5, third bullet): this piece touches no surface of the brief's section 3; it is R5's KNOWN-LIMITATIONS statement, and it adds no scope to any piece in code.

### §A. The item (draft words for the human, item 2e)

Column-0 line (directly before the item, after one blank line under item 42's on-main paragraph):

<!-- A line at column 0, so that item 44 starts its own list and renders as 44 (as for item 42, PR #215 gate 1, D-2). -->

Item text (one line):

44. **A file's coordinate epoch and its `edges` value are ignored, and so is a CRS's third axis.** The GeoParquet metadata of a file's geometry column can declare a coordinate epoch, as `epoch`, and an `edges` value. The app reads neither: they play no part in how the file opens, is drawn or is published, and neither appears in the app or in a published bundle. A CRS whose coordinate system lists a third axis, a height for example, is read on its first two axes only. The axis order the app shows, and the one a published bundle records, names those two, and nothing the app does with the file reads the third. The CRS definition itself is kept whole, so a published bundle's manifest still carries the third axis inside the definition's text, where the bundle's viewer does not read it.

No on-main paragraph (§D shows the words hold at both). No "Meanwhile": the app shows none of the three, so nothing in the shipped app lets an operator see or act on them; reading a file's `geo` metadata needs a tool outside the app.

Source comment (one line, indented 4 spaces directly under the item, as item 42's; every pin written in full, on one line; T = b391e43622056324c56d35cc33065305140a8415, written in full in the comment; LINES-TBD and HASH-TBD resolved by §D before this form is committed):

    <!-- [The human's wording, approved | The human's own words, given] in KNOWN-LIMITATIONS-ITEM-44-CRS-EPOCH-EDGES-THIRD-AXIS-PREREGISTRATION.md Amendment 1; drafted by the architect under item 2e of state/directives/2026-10-11-direction-after-status-review.md. Authority: state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md, item 5; state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md, section 4 item 1 and R5. At the v0.1.0 tag: engine/src/geoparquet.rs:LINES-TBD @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the geo reader: no epoch or edges member is read); engine/src/geoparquet.rs:LINES-TBD @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the axis order from the first two axes); engine/src/geoparquet.rs:LINES-TBD @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the definition kept whole); kernel/src/publish/mod.rs:LINES-TBD @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the manifest carries the definition as a string, and the two-axis order); renderer/bundle-viewer/src/manifest.ts:LINES-TBD @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the viewer checks the definition is a string and reads nothing in it); frontends/shell/src/admission/describeSummaryText.ts:LINES-TBD @ b391e43622056324c56d35cc33065305140a8415 sha256:HASH-TBD (the CRS line the app shows). On main: engine/src/geoparquet.rs:348-369 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD and engine/src/geoparquet.rs:372-470 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD (GeoMeta and its parse: version, primary_column, columns, encoding, geometry_types, crs, covering, bbox; no epoch, no edges); engine/src/dataset.rs:354-356 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD (the open path's one read of geo); engine/src/geoparquet.rs:677-727 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD and engine/src/geoparquet.rs:815-832 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD (axis order and unit from axes 0 and 1; fewer than two refused, more not); engine/src/crs.rs:152-155 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD (every axis order names two axes); engine/src/geoparquet.rs:440 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD (the definition is the whole crs object); kernel/src/publish/mod.rs:1391-1394 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD and kernel/src/publish/mod.rs:1398 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD (the manifest's source_definition and axis_order); kernel/src/bundle/mod.rs:794-813 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD (the manifest's crs members: no place for an epoch or edges); renderer/bundle-viewer/src/manifest.ts:86-88 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD and renderer/bundle-viewer/src/manifest.ts:689-691 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD (exact crs keys; the definition checked as a string only); renderer/bundle-viewer/src/main.ts:308 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD (the viewer's CRS line); frontends/shell/src/admission/describeSummaryText.ts:17-28 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD and frontends/shell/src/admission/DescribeSummary.tsx:28-98 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD (what the summary shows). No product read of epoch or edges, and every reader of a CRS's axes: the form's §D scans, at the tag and on main. Not covered, by item 2c of the same direction: the describe payload's crs.definition_json (kernel/src/skp.rs:1891 @ b9e7822938ec18394dbb4465c5bf471968f09582 sha256:HASH-TBD) carries the whole definition, its third axis included, on the wire, and the app renders it nowhere; engine/src/lod.rs's tier-unit check reads every axis, and no product path calls build_tiers (item 33); a compound CRS has no top-level coordinate system and is refused (item 2), so the third-axis sentence does not reach it. -->

### §B. Clause check

T = b391e43622056324c56d35cc33065305140a8415; M = b9e7822938ec18394dbb4465c5bf471968f09582. M rows were read at M by the architect; T rows are §D's, run by the custodian's script before this form is committed.

| # | Clause | Evidence at M | At T | Holds |
|---|---|---|---|---|
| C1 | A file's coordinate epoch and its edges value are ignored, and so is a CRS's third axis | C3 to C11 | §D | yes at M |
| C2 | The geometry column's metadata can declare a coordinate epoch, as `epoch`, and an `edges` value | the pinned 1.0.0 text has a `#### epoch` section after `#### crs` (engine/ADMISSION-PREREGISTRATION.md:382); a corpus file of record lists `edges` among its geometry column keys (engine/compat-corpus/of-record/MANIFEST.json:2434-2440). A fact of the format; no spec sentence is quoted | same | yes |
| C3 | The app reads neither | dataset.rs:354-356 (one read of geo); geoparquet.rs:372-470 reads eight members, neither of these; GeoMeta (:348-369) has no field for either; §D1 scan | §D1, §D2 | yes at M |
| C4 | They play no part in how the file opens, is drawn or is published | follows from C3: no value is held to act on | §D1, §D2 | yes at M |
| C5 | Neither appears in the app | DescribeSummary.tsx:28-98; CrsInfo (frontends/shell/src/skp/types.ts:71-109) has no member; frontends/shell/src/feature/ names no CRS fact (scan) | §D5 | yes at M |
| C6 | …or in a published bundle | C3; the manifest's crs members (bundle/mod.rs:794-813) and the viewer's exact key sets (manifest.ts:86-88) have no place; partitions are Arrow IPC streams (bundle/mod.rs:26) built from data that holds neither | §D4 | yes at M |
| C7 | A CRS whose coordinate system lists a third axis is read on its first two axes only | geoparquet.rs:677-727 (dir/name of 0 and 1; fewer than two refused, more not); :815-832 (unit, axes 0 and 1); an assertion goes through the same function (dataset.rs:380-390) | §D3 (no unit fact expected at T; the clause does not need one) | yes at M |
| C8 | The axis order the app shows, and the one a bundle records, names those two | crs.rs:152-155; describeSummaryText.ts:27; publish/mod.rs:1277, :1398; bundle/mod.rs:810 | §D4, §D5 | yes at M |
| C9 | Nothing the app does with the file reads the third | the product readers of `coordinate_system`/`axis` are geoparquet.rs:679-680 and :817-818 (two axes); lod.rs:576-582 reads every axis but only under build_tiers, which no product path calls (item 33), named not covered | §D3 | yes at M |
| C10 | The CRS definition itself is kept whole | geoparquet.rs:440 (`crs.to_string()` of the whole object; re-serialised, so "whole", never "as written") | §D3 | yes at M |
| C11 | A published bundle's manifest still carries the third axis inside the definition's text, where the viewer does not read it | publish/mod.rs:1391-1394; bundle/mod.rs:798-804; ADR-017:215; manifest.ts:691 (string check only), main.ts:308; no other source_definition reader in renderer/bundle-viewer/src | §D4 | yes at M |

### §C. Not covered (item 2c)

As named in the source comment: the describe payload's definition on the wire; build_tiers' every-axis unit check, not reachable in the shipped app; a compound CRS, refused under item 2. The brief's one-line summary says a third axis is not carried into a bundle; the code carries it inside the definition (C11), and §A says so.

### §D. Checks before commit (the custodian's script; STOP on any mismatch, and the draft returns to the architect)

1. Absence scan, at T and at M: `git grep -n -w -E 'epoch|edges' <rev> -- engine/src kernel/src protocol frontends/shell/src frontends/shell/src-tauri/src renderer/bundle-viewer/src`, rc printed; every hit classified; none may read a GeoParquet member. Positive self-test first: the same pattern at M finds engine/src/descriptor.rs:383.
2. At T, every member key engine/src/geoparquet.rs's geo parser reads; none is `epoch` or `edges`; pin the span.
3. At T, `git grep -n -E 'coordinate_system|"axis"' T -- engine/src kernel/src frontends/shell/src frontends/shell/src-tauri/src renderer/bundle-viewer/src`; the axis-order function reads indexes 0 and 1 only; any other reader classified (lod.rs, if present: its product callers listed); the definition kept as the whole object; pin both.
4. At T, the manifest builder's source_definition and axis_order (kernel/src/publish/mod.rs, kernel/src/bundle/mod.rs) and the viewer's crs key set and CRS line; pin.
5. At T, the summary's CRS line, and `git grep -n definition_json T -- frontends/shell/src` shows no product file rendering it; pin.
6. If any T row differs from M in a way a clause depends on, STOP: the item would need an on-main paragraph or other words.
7. The number: at the base, no item or open branch other than 1b's claims 43 or 44.

### §E. Gates

- **Route.** A single combined reviewer gate (§21b), under proportional gates (state/directives/2026-10-05-product-first-direction.md, section 2).
- **What blocks.** Correctness or Evidence only. A clause untrue at T or at the base claims a limit the code does not support: Correctness.
- **Wording blocks.** The words are the human's (item 2e). A block on the wording alone carries the reviewer's replacement words, each clause checked; the human answers under item 2b.
- **Documentation findings.** Fixed before the merge; no re-gate.
- **Order with 1b and milestone 3.** Disjoint items by number; whichever piece merges later merges main in before its last gate run, and re-checks its number.

### §F. Open for the human

- OPEN-1: approve or replace §A's words (item 2e).
- OPEN-2: should the v0.1.0 release page's correction paragraph also name item 44? Changing published text is the human's; this piece does not touch it.

## Amendments
````

## 3. Clause check

The clause check is §B in the form above. Main-side summary: C1 to C11 hold at b9e78229 at the lines cited. Tag side: every row is pending §D. The draft's claim to be true of the v0.1.0 artifact stands only once §D1 to §D5 pass.

## 4. OPEN items (the human's)

- **OPEN-1:** approve or replace §A's words. Two things to know when deciding:
  - The draft departs from the summary's "not … carried into a bundle" for the third axis, because the code carries it inside the definition.
  - It has no Meanwhile sentence, because nothing in the app can help.
- **OPEN-2:** whether the v0.1.0 release page's correction paragraph gains item 44. That text is outward and the human typed it, so it is the human's. My lean is (a), add it. The paragraph lists the limits KNOWN-LIMITATIONS on main states that the notes did not, and item 44 is one of them, true of v0.1.0.

To fix in the same PR (Documentation, not blocking):
- **PLAN node title:** it repeats the summary's clause that is untrue for the third axis. Its closing record cites §C by reference and does not restate it.
- **1b's item 43:** it renders as a bold paragraph (`**43. …**`), not as a numbered list item. That belongs to that piece's gate, not this one.

## 5. Files read

- C:\dev\spatial-ide\state\directives\2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md
- C:\dev\spatial-ide\state\consults\GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md
- C:\dev\spatial-ide\state\directives\2026-10-11-direction-after-status-review.md
- C:\dev\spatial-ide\state\directives\2026-10-09-rulings-additions-reaim-identity-route-documents.md (:27-29)
- C:\dev\spatial-ide\PLAN.yaml (:4540-4582, :5017-5023, :5206-5222)
- C:\dev\spatial-ide\KNOWN-LIMITATIONS.md (whole)
- C:\dev\spatial-ide\KNOWN-LIMITATIONS-ITEM-42-CURRENT-VIEW-PREREGISTRATION.md
- C:\dev\spatial-ide\AUTONOMY.md (§21–§21d)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (:146-178)
- C:\dev\spatial-ide\kernel\B2-1B-RECORDING-PREREGISTRATION.md (:400-411, Amendment 5)
- C:\dev\spatial-ide\state\consults\2026-10-14-b2-piece-1b-recording-stage-2-worker-report.md (:40-64)
- C:\dev\wt\1b\KNOWN-LIMITATIONS.md (:386-392, branch worktree)
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md (:333-340)
- C:\dev\spatial-ide\engine\src\geoparquet.rs (:1-848)
- C:\dev\spatial-ide\engine\src\dataset.rs (:350-399)
- C:\dev\spatial-ide\engine\src\envelope.rs (:80-227)
- C:\dev\spatial-ide\engine\src\crs.rs (grep: definition, :152-155)
- C:\dev\spatial-ide\engine\src\lod.rs (:470-582)
- C:\dev\spatial-ide\kernel\src\publish\mod.rs (:1260-1419)
- C:\dev\spatial-ide\kernel\src\bundle\mod.rs (:26, :730-819)
- C:\dev\spatial-ide\kernel\src\skp.rs (grep: :1891)
- C:\dev\spatial-ide\renderer\bundle-viewer\src\manifest.ts and main.ts (grep)
- C:\dev\spatial-ide\frontends\shell\src\skp\types.ts (:25-134)
- C:\dev\spatial-ide\frontends\shell\src\admission\describeSummaryText.ts and DescribeSummary.tsx
- C:\dev\spatial-ide\frontends\shell\src\feature\ (grep only)
- C:\dev\spatial-ide\docs\adr\ADR-017-static-bundle-format-and-publish-semantics.md (grep: :193, :215, :308)
- C:\dev\spatial-ide\engine\ADMISSION-PREREGISTRATION.md (:92-95, :340-384)
- C:\dev\spatial-ide\engine\compat-corpus\of-record\MANIFEST.json (:2395-2464)
- Scans (Grep) over engine/kernel/protocol/shell/src-tauri/viewer sources for `epoch`, `edges`, `coordinate_system`, `"axis"` and `definition_json`.

Not read: anything at the v0.1.0 tag. That is the open Evidence item, and §D closes it.
