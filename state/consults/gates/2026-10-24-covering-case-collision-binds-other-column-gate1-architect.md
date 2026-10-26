Reviewed: PR #252 at 77bbbc63127b99810fb9a5372983f3d0ffdf5c70, gate 1, architect
Verdict: PASS WITH NOTES
Branch: cut/covering-case-collision-binds-other-column @ 77bbbc63127b99810fb9a5372983f3d0ffdf5c70 (all line cites below are at this commit unless marked main)

**Summary.** The code follows §2 clause by clause. I found no Correctness or Evidence finding that blocks. There are three Documentation findings, all must-fix before the merge with no re-gate. Two Evidence items I could not run are named in check 6, along with who closes them.

## Findings

### Correctness
None.

### Evidence
None blocking. Two items rest on runs I cannot make, because I have no shell:
- **The workspace suite and clippy.** §9 names `cargo test --locked --workspace --features spatial-engine/fixture` and clippy as CI runs it. The worker ran the engine suite and three kernel test files, and did not print clippy's exit code. CI's required checks at 77bbbc63, or the reviewer's same-gate run, carry both. If neither shows them green, that is an Evidence FAIL.
- **The `engine/src/dataset.rs` §7 count** (276 + 49 = 325 against 330). The reviewer recomputes it.

### Documentation (must-fix before the merge; not the human's wording, so the worker applies the words with no re-gate and the PR body lists them)

**D-1. Item 9's appended sentence leaves out two cases item 53 states** (`KNOWN-LIMITATIONS.md:117`).
- It says "the file's column names". A second match among the fields inside the covering struct also refuses at open: CC-2, `engine/src/dataset.rs:1630-1643` then `:1574-1580`.
- It does not mention that a U+0000 path makes the file open anyway (`:1558-1560`).
- Read together with item 9's preceding sentence (the human's), an operator holding a CC-2-shaped file (child twins `xmin`/`XMIN` plus an absent path) would conclude that it opens. It is refused at open.
- I class this as Documentation, not Correctness, because the cited item 53 states both cases in full.

Replacement words for line 117 (keep the 3-space indent):
`   If another path of that covering matches more than one of the file's names, or names a column or a field the app reads under another name, the file is refused when it is opened instead, unless a path of that covering contains U+0000 (item 53).`

Clause check against the code at the head:
- "matches more than one of the file's names": `case_matches` runs at every level of the walk (`dataset.rs:1497-1504`, `:1630-1643`) and returns `Ambiguous`. Tests: CC-1, CC-2, CC-8.
- "names a column or a field the app reads under another name": `Misbound` at `:1648-1653`, at the top level (CC-3) and at child level (CC-4).
- "refused when it is opened instead": `judge_covering` returns `Err` at `:1574-1590`. An absent path is only held aside (`:1571-1573`) and is returned only at `:1606`, so the refusal wins in either order (CC-2, CC-7). The call at `:441` uses `?` before `sanity_check` at `:529`.
- "unless a path of that covering contains U+0000": `:1558-1560` returns `NotAddressable` before any walk, and the open continues.
- "(item 53)": item 53 states all of the above (`KNOWN-LIMITATIONS.md:422`).

**D-2. The DRAFT comments name a commit that does not hold the tests they cite** (`KNOWN-LIMITATIONS.md:118` and `:423`).
- Both say "at 9fb3e4c3 on the piece's branch" and then name tests in `engine/tests/covering_case_collision.rs`. By the worker's report, that file arrives at 21fb02d9; 9fb3e4c3 is the `dataset.rs` commit. Round 25 item 2 requires a test-text span on an unmerged branch to be named with its own commit id.
- Item 53's comment also still says "which the form's P0 is to show no ordinary file reaches". The P0 has run (Amendment 1, item 6, §11 bullet).

Replacements, one per span:
- In both lines, "Where the code does this, at 9fb3e4c3 on the piece's branch:" becomes "Where the code does this, the code at 9fb3e4c3 and the tests at 21fb02d9 on the piece's branch:".
- In line 423, "which the form's P0 is to show no ordinary file reaches" becomes "which no row of the form's P0 reached (its Amendment 1, items 3 and 6)".

Clause check: the worker's commit list in its report (lines 10-11 of the filed report) puts the code at 9fb3e4c3 and the tests at 21fb02d9. Amendment 1 item 3 (S-yes, its count check over all 14 rows) and item 6 (its §11 bullet) record that no row reached (i-root), (i-struct) or (i-tree).

**D-3. One changed outcome is not in §5's record: a `geo.primary_column` naming an empty-named column.** This is by code reading and was not run.
- `parquet_schema` lists the file's name `""`, and DuckDB binds it as `C2` (form §0 D6; b1 row c07, `engine/tests/b1_projection_hostile_names.rs:886-893`). `GeoMeta::parse` accepts an empty name (`engine/src/geoparquet.rs:382-393`).
- At main, the byte lookup on resident names missed, and the file was refused as `engine.source` "does not contain".
- At the head, step 2 finds `""` and step 3 refuses it as `engine.geo_metadata`, text (g), naming `C2` (`dataset.rs:2119-2136`).
- §1 item 4 covers this ("at a position where DuckDB renamed the column"), so no claim is untrue. §5's "Refused at main and after, the code moving" lists only G-1's and G-7's files.
- Fix: one line in the PR body's §5 record, naming this case as a code reading, not run. No code change and no test owed.

## Checks

**1. §2 against the code; §1's two lists.**
- **§2.1.** One statement, `SELECT name, num_children FROM parquet_schema(?)`, drained inside `cancellable` (`dataset.rs:1431-1442`), between `probe_schema` and the geometry check (`:429-434`).
  - The three Source texts match the draft.
  - A NULL name fails the `String` get and surfaces as "parquet schema row". A NULL count is read as 0 (`:1451`).
  - The tree rebuild refuses rows left after the root (`:1452`), a negative count (`:1452`), and children claimed beyond the rows (`:1473-1477`). Zero rows also refuse (`:1474`).
  - (i-tree) is byte-equal to §2.6.
  - Both comments are updated (`:348`, `:439-440`).
  - `read_kv_metadata` and `probe_schema` are byte-identical to main (`:1080-1104` and `:1113-1169` at the head; `:1075-1099` and `:1108-1164` at main).
- **§2.2.** The K2 leading-N rule (`:1482-1493`), with (i-root) byte-equal. The struct count is checked only where the walk descends (`:1657-1666`), with (i-struct) byte-equal. Out-of-range indexing is impossible: `m ≥ n` is checked at the top level, and child counts are checked equal before descending.
- **§2.3.** The steps run in the form's order: (a-p) at `:2107-2118`; the miss arm with D4's text byte for byte at `:2119-2128` (compared with main `:1904-1909`); (g) at `:2130-2136`; then the unchanged U+0000 and type arms at `:2137-2151`. Comparison is ASCII case-insensitive with byte-equal names counted, through the one shared helper `case_matches`. N-8's `geo\0m` reaches the U+0000 arm, because DESCRIBE's name is byte-equal (g8).
- **§2.4.** The signature and its purity hold: no `Connection` (`:1550-1554`, `:1621-1625`). The order is U+0000, then the first ambiguous, misbound or inconsistent walk, then the first absent path. Clause (b) compares `R[j]` alone (`:1648`), so the truncated-child case is admitted as §2.4 says.
- **§2.5.** `covering_finding` keeps its type (`:529-537`, `:587-592`).
- **§2.6.** All seven texts are byte-equal to §2.6's drafts. Every name is rendered through `render_visible_escape`. The texts state engine facts only (per the operator-visible-text ruling).
- **§1 may-claim.** Items 1 to 6 hold, with these tests: (a) CC-1, CC-2, CC-7, CC-8, G-1, G-5, G-6, G-7; (b) CC-3, CC-4, G-2; absence CC-5; the primary-column miss G-3, G-4; order `:429-441` before `:529`; cancel CK-1.
- **§1 may-not-claim.** It holds:
  - The names the operator supplies are untouched; `admit_identity` still reads `file_schema` (`:563`).
  - `lod.rs` is not in the diff.
  - There is no `cfg`, no `pub` item and no constant.
- **The code does more than §2 in one place:** D-3's empty-name case, which falls inside §1 item 4.

**2. The rulings** (directive line 12):
- **OPEN-A.** No `[P6 placeholder]` in any text (`dataset.rs:1444`, `:1487`, `:1576`, `:1586`, `:1598`, `:2114`, `:2132`). I could not read the PR body, which holds the sight list, because I have no tool that reaches the PR. The custodian confirms it carries (a), (a-p), (b), (g), the three i-texts, item 53 and item 9's sentence.
- **OPEN-B.** Item 9's sentence is at `KNOWN-LIMITATIONS.md:117`. The primary-column refusal is in item 53 (`:422`). Both are byte-equal to §11 apart from the filled commit slot.
- **OPEN-C.** `engine/README.md` is not in the diff. Not a finding.
- **OPEN-D.** On main, PLAN.yaml holds the node `engine-open-neighbour-reads-unbound-to-cancel`: engine lane, proposed, depends on this piece, and its summary says S3. No KNOWN-LIMITATIONS line names it (the only "neighbour" hit is the existing line 376).
- **OPEN-E.** One `case_matches` helper (`dataset.rs:1497-1504`) serves both the covering walk and the primary column, with byte-equal names counted separately: CC-8 and G-6.
- **OPEN-F.** There is no measurement, no docs/08 row, and §6 is unchanged.
- I have no finding on the rulings themselves.

**3. Cancellation** (ADR-018, docs/01 principle 7).
- The new statement runs inside `cancellable` (`dataset.rs:1432`), and CK-1 covers it.
- The neighbours' reads are unchanged, which is OPEN-D's node.
- One side effect I checked: `attach` refuses a token that is already bound (`engine/src/cancel.rs:239-245`). The product path mints a fresh token for every open (`kernel/src/skp.rs:1104`), so this adds no failure mode the app can reach. The kernel test `catalog_replace` reuses one token across opens one after another, and `detach` runs between them.
- No latency claim is made, which matches ADR-018 §5.

**4. The words.**
- All seven refusal texts are checked in check 1. They are true at what an operator observes: the code is `engine.geo_metadata` through `kernel/src/skp.rs:2118` and `:2216`.
- Item 53, clause by clause, holds against the code: renaming (P0 s3, g1); file-name matching (`:1630`, `:2107`); refusal for a second match, including byte-equal names (`:1633-1642`, `:2108-2118`); the changed-name refusal (`:1648-1653`, `:2130-2136`); the code and naming (`:1574-1590`, `:2113-2135`); refusal over an absent path (`:1571-1573`); absence as item 9 (`:1631`, CC-5); the primary-column miss as `engine.source` including `GEOMETRY_1` (`:2119-2128`, G-4); ASCII-only (`eq_ignore_ascii_case`); operator names unchanged (CC-9, the edited b1 test); U+0000 first (`:1558-1560`).
- The heading's "column names" is completed in the item's own body. That is not a finding.
- Item 9's sentence: D-1. The comments: D-2.
- None of these is the human's wording.

**5. §5.**
- The files that open at main and are now refused are: CC-1 to CC-4, CC-7, CC-8, G-2, G-4, and G-5 (`geometry` beside `GEOMETRY`, refused by name with (a-p)), plus G-6. The edited b1 test is the existing case that reaches the check.
- Amendment 1 item 8's hive-column case changes no outcome for a standard file:
  - A hive key is a scalar, so a two-segment covering path through it was already Absent at main.
  - A primary column naming it was already refused by the type check at main (`engine.source`).
- I found no other file that opens today and changes. Besides the twin cases, a rename comes only from the empty name, which is refused at both commits (D-3).
- **Wire.** No variant, field or literal is added. Per the custodian's filing note and the worker's report, the diff is the four §7 files, with nothing under `protocol/` or `kernel/`. I cannot run the diff myself; the reviewer confirms it.

**6. Evidence against §4 and §5.**
- **17 tests.** The names match §4 exactly (`engine/tests/covering_case_collision.rs:274-611`). Each refusal asserts the whole Display from Amendment 1 item 5, byte-equal by my reading. Each fixture is hashed after writing and re-hashed by `done()`.
- **18 mutations.**
  - The count is M1-M6, MKV, MO, MC8 (= MG7), MC9, MG1-MG4, MG6, MG9, MG10 and MK. The worker's report records each by test name at 21fb02d9. `dataset.rs` there is the code of 9fb3e4c3, and the tests exist only there, so 21fb02d9 is "the final code commit" in §4's sense.
  - The failure recorded for each is consistent with the code. For example: MKV gives "lists 3 … reported 4"; MG1 gives (g) for `GEOMETRY_1`; MG10 gives (g) under `geometry`; MK gives `GeoMetadata`. MC8 fails both CC-8 and G-6, and MC9 fails both CC-9 and the b1 test, as §4 requires.
  - The report does not call any `verify-mutation` run an observation (round 25 item 2).
  - The raw outputs are in the worker's scratch folder, not filed. The table's own records meet §4's bar.
- **§7.** I confirmed three ceilings by reading the files: the new test file is 624 lines (ceiling 660); the b1 edit is 12 (9 deleted, 3 inserted; ceiling 15); KNOWN-LIMITATIONS is 6 (ceiling 6). `dataset.rs` at 325 (ceiling 330) is the reviewer's to recompute. No overrun, so no class 8. §7's "+30" derivation for `dataset.rs` underestimated by an order of magnitude, but §7 is never edited and the ceiling held.
- **Suites.** The engine suite (462 passed) and the three kernel files are taken from the report. The workspace suite and clippy's exit code are the open Evidence items under Findings. The 39 clippy warnings the worker reports are all in files this piece does not touch.
- **Disclosures.** One `export` before a hold line, and stray output files moved out of the cargo target's parent folder. Both are process deviations, and neither touches the branch or any claim. Not findings.

Files read: `C:/dev/wt/ccc/engine/src/dataset.rs`, `C:/dev/wt/ccc/engine/tests/covering_case_collision.rs`, `C:/dev/wt/ccc/engine/tests/b1_projection_hostile_names.rs`, `C:/dev/wt/ccc/KNOWN-LIMITATIONS.md`, `C:/dev/wt/ccc/engine/src/cancel.rs`, `C:/dev/wt/ccc/kernel/src/skp.rs`, `C:/dev/spatial-ide/engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/consults/2026-10-24-covering-case-collision-binds-other-column-code-worker-report.md`, `C:/dev/spatial-ide/state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md`, `C:/dev/spatial-ide/PLAN.yaml`.
