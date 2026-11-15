*Custodian's filing note (2026-10-24): KNOWN-LIMITATIONS item 53 redrafted read only by the architect at main 4de4b9a9 for covering-case's OPEN-E as the human ruled it on 2026-10-24 (item 3), in parallel with lead-data's form revision; its findings F-1 to F-4 on the form were sent to lead-data during that revision. Its item 53 words go into the form's section 11 when the form commits; nothing is committed from it now. The run 07:54:41Z to 07:59:10Z by its transcript (Read 14, Grep 6; no Write, Edit or Bash). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is c428d9b0323feefcd6664db62fe260b710b24b8323a92f164adda3042d994f2e.*

---

Redrafted: KNOWN-LIMITATIONS item 53 for covering-case's OPEN-E, at main 4de4b9a9

Reviewed: main @ 4de4b9a9 (the main checkout as read). I have no shell, so I could not confirm HEAD by command, and this report carries no sha256. Every `path:line` below is `@ 4de4b9a9` unless another commit is named. None of these words is the human's. They are drafts for the human's sight (OPEN-A: no P6 marker, sighted before the merge). I quote only text I read.

## 1. Changes against my redraft (its section 2), sentence by sentence

- **Title: changed.** It now reads "if a name in its `covering.bbox` or its `geo.primary_column` matches more than one of its column names, or names a column the app reads under another name". The old title listed the refusal kinds and left out the primary column's more-than-one refusal, which OPEN-E adds.
- **S1 to S5 (the renaming, file names judged, per-part case-blind matching, covering (a), covering (b)): unchanged.** Under the widening they are still true. Two byte-equal names also "match … without regard to the case", so S4 already covers byte-equal covering duplicates.
- **S6 ("`geo.primary_column` must match one of the file's column names exactly …"): replaced by two sentences.** The first is new: `geo.primary_column` is judged by the same rule. Where it matches two or more of the file's names, ignoring case or byte for byte, the open is refused, even when one of them is spelled exactly. The second keeps the old sentence after "Otherwise". The old sentence read as if one exact match were enough, apart from a rename. OPEN-E makes that untrue.
- **S7 to S9 (the code and what the refusal names, refused despite an absent path, covering absence): unchanged.**
- **S10 (the `engine.source` sentence): a condition is added**, ", and is not refused for matching two or more,". Without it the sentence is untrue for `Geometry` declared in a file holding `geometry` and `GEOMETRY`: that name matches none of them exactly, but it now falls to the new more-than-one refusal, not to `engine.source`.
- **S11 (letters outside A to Z): unchanged.**
- **S12: the last clause is replaced.** It said "a file whose other columns have names that differ only in letter case is not refused". If "other" is read as "case twins of the named column", that is now untrue for the primary column. The new clause is: "column names in a file that differ only in letter case cause no refusal except in the cases above".
- **S13 ("A file that holds two columns under exactly the `geo.primary_column` name is not judged …"): deleted.** The new S6 covers that case with its "two columns both named `geometry`" example.
- **S14 (U+0000): unchanged.**
- **Comment:**
  - The Authority line adds the 2026-10-24 directive, item 3 (OPEN-A, OPEN-B, OPEN-E).
  - `check_geometry_column`'s parenthetical now gives the order the words assume: more than one match, then no exact match, then a match read under a changed name.
  - The test pointers are changed (section 2 below).
  - The Not-covered list is unchanged.
- **Placement and line count: unchanged.** The item goes after item 52 (`KNOWN-LIMITATIONS.md:415-417 @ 4de4b9a9`), in the section at `KNOWN-LIMITATIONS.md:200 @ 4de4b9a9`, and adds 4 lines. The column-0 line from the ruling's item 4 goes in before item 51, so it moves item 52 down one line but does not change "after item 52". Items 51, 52 and 53 then render in sequence.

## 2. The test pointers

I propose `CC-1 to CC-5, CC-7, G-1 to G-4 and <OPEN-E test ids, from the committed form's §4> in engine/tests/covering_case_collision.rs`, not "CC-1 to CC-7":
- CC-6 is written only if the P0 gives K2, and it proves no clause of item 53. "CC-1 to CC-7" would name a test that may not exist.
- CK-1 is already named under Not covered.

The custodian fills the slot from the committed form.

## 3. Item 53, as placed

~~~

53. **A file is refused when it is opened if a name in its `covering.bbox` or its `geo.primary_column` matches more than one of its column names, or names a column the app reads under another name.**
    When a file holds two column names that differ only in the case of the letters A to Z, or two such field names inside one column, the app reads the later one under a changed name, with a suffix added, such as `BBOX_1` for a second `BBOX`; a changed name that meets a name the file already holds is changed again, so the file's own `BBOX_1` is then read as `BBOX_1_1`. The names in a file's `geo` metadata, the paths of its `covering.bbox` and its `geo.primary_column`, are matched against the names the file itself holds, not the changed ones. Each part of a `covering.bbox` path is matched to the file's column names, and to the names of the fields inside a column, without regard to the case of the letters A to Z. Where one part matches two or more of them, such as `bbox` against columns named `bbox` and `BBOX`, the open is refused rather than one of them chosen, even when one is spelled exactly as the path is. Where it matches one, and the app reads that column under a changed name, as for a path naming `BBOX_1` in a file that holds `bbox`, `BBOX` and `BBOX_1`, the open is refused too: the path would not read the column the file names. `geo.primary_column` is judged by the same rule: where it matches two or more of the file's column names without regard to the case of the letters A to Z, such as `geometry` against columns named `geometry` and `GEOMETRY`, or against two columns both named `geometry`, the open is refused, even when one is spelled exactly as the name is. Otherwise it must match one of the file's column names exactly, and where the app reads that column under a changed name, the open is refused the same way. These refusals have the code `engine.geo_metadata` and name the declared name with the file's names it matches, or with the name the app reads that column under. A covering is refused this way even when another of its paths names a column the file does not contain. A covering path that matches none of the file's names names a column the file does not contain, as item 9 says, even when it is spelled like a changed name, such as `BBOX_1` in a file that holds only `bbox` and `BBOX`. A `geo.primary_column` that matches none of them exactly, and is not refused for matching two or more, is refused as `engine.source`, with the same text as before, saying the file does not contain it; that now includes a name spelled like a changed name, such as `GEOMETRY_1` in a file that holds only `geometry` and `GEOMETRY`. In these checks a letter outside A to Z in a different case counts as a different letter. Only the names the file supplies are checked this way: names you supply, such as a column a filter names, are matched as before, against the names the app reads the columns under, and column names in a file that differ only in letter case cause no refusal except in the cases above. A covering path containing U+0000 still opens with that covering unusable, as before, whatever its other paths match.
    <!-- DRAFT wording for the human's sight, not the human's own wording (engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md, §11, item 53, and §1); drafted by the architect under item 2e of state/directives/2026-10-11-direction-after-status-review.md. Authority: state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md, the covering-case paragraph (OPEN-2, OPEN-3, OPEN-4, OPEN-6, OPEN-8); state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md, item 3 (OPEN-A, OPEN-B, OPEN-E). Evidence for the changed names: state/drafts/covering-case-collision-p0/p0-output.txt, rows r1 to r4; hostile_names_colliding_after_case_folding_bind_one_column_each in engine/tests/b1_projection_hostile_names.rs; the full form's P0 outputs under state/drafts/covering-case-collision-full-form-p0/. Where the code does this, at <commit> on the piece's branch: read_file_names (the file's own names, read from the footer), check_names_align, judge_covering and field_path_exists (the covering's paths: more than one match, a match read under a changed name, then absence), and check_geometry_column (geo.primary_column: more than one match, then no exact match, then a match read under a changed name), all in engine/src/dataset.rs; EngineError::GeoMetadata and EngineError::Source in engine/src/error.rs, through error_of's existing arms in kernel/src/skp.rs; CC-1 to CC-5, CC-7, G-1 to G-4 and <OPEN-E test ids, from the committed form's §4> in engine/tests/covering_case_collision.rs. The pins follow on main after the merge. Not covered, by item 2c: an open cancelled while the file's names are read, which ends as cancelled before any of these checks (CK-1), a case inside one request round trip; the internal-inconsistency refusals for a footer whose names do not line up with the schema the app reads (check_names_align, and the walk's struct check), which the form's P0 is to show no ordinary file reaches; names that differ only in the case of a letter outside A to Z, where whether the app reads either under a changed name is not established; the LOD tiers' identity column, which is its own node (lod-tier-identity-binds-file-name), and build_tiers has no product caller (item 33). -->
~~~

(The fence opens with the blank line that comes before the item. That is the 4 lines: blank, title, body, comment.)

## 4. Item 9's sentence: the sentence is unchanged, the comment is not

OPEN-E does not reach the sentence. Matching "more than one of the file's column names" already takes in byte-equal duplicates. A primary-column refusal is one more refusal at open, like the polygon and encoding gates, and the "opens" at `KNOWN-LIMITATIONS.md:114 @ 4de4b9a9` already depends on those. The comment does change:
- the human's OPEN-B is added to it;
- "whichever comes first" is added;
- CC-7 is added beside CC-2, because E-2's other order is now tested.

Placement is unchanged: after `KNOWN-LIMITATIONS.md:116 @ 4de4b9a9`, before the blank line at `:117`. It adds 2 lines.

~~~
   If another path of that covering matches more than one of the file's column names, or names a column the app reads under another name, the file is refused when it is opened instead (item 53).
   <!-- DRAFT wording for the human's sight, not the human's own wording (engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md, §11, OPEN-B; the human's OPEN-B, state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md, item 3); the sentence above the earlier comments stays the human's wording. Where the code does this, at <commit> on the piece's branch: judge_covering in engine/src/dataset.rs, which refuses such a path before it records an absent one, whichever comes first; CC-2 and CC-7 in engine/tests/covering_case_collision.rs. The pins follow on main after the merge. -->
~~~

The total for `KNOWN-LIMITATIONS.md` stays at 6 lines, within the form's §7 ceiling of 6.

## 5. Clause checks (re-run on the new words)

"Unwritten" means the code behind the clause is not written yet. Each such clause is checked again at the PR's head.

| # | clause | what makes it true | status |
|---|---|---|---|
| T | title: more than one match (covering or primary), or read under a changed name | form §2.3 and §2.4 (a)/(b), plus the primary (a) step that OPEN-E adds | unwritten; the form does not have the primary (a) step yet (F-4) |
| 1a | the later case twin is read under a changed name, at the top level and inside a column | `state/drafts/covering-case-collision-p0/p0-output.txt:185`, `:193`, `:210 @ 4de4b9a9` | true at main (observed) |
| 1b | a changed name that collides is changed again | `engine/tests/b1_projection_hostile_names.rs:262 @ 4de4b9a9` | true at the top level; the child level waits for P0 row s3. This test's file is refused under OPEN-E (F-1), so after the piece this evidence must come from the edited test or from P0 row g1 |
| 2 | matched against the file's own names | form §2.1 `read_file_names`; today the walk uses resident names (`engine/src/dataset.rs:1446-1472 @ 4de4b9a9`) | unwritten |
| 3 | each covering part is matched ignoring case A to Z | `engine/src/dataset.rs:1454` and `:1465 @ 4de4b9a9` (`eq_ignore_ascii_case`) | the rule is true at main; its input is unwritten |
| 4 | covering: two or more matches are refused, even when one is spelled exactly | §2.4 (a); CC-1, CC-2, CC-7 | unwritten; the byte-equal covering duplicate is untested (F-2) |
| 5 | covering: one match read under a changed name is refused | §2.4 (b); CC-3, CC-4 | unwritten; rests on G-yes |
| 6a | primary: two or more case-blind matches are refused (`geometry` against `geometry` and `GEOMETRY`) | not yet in the form. Today this exact file opens: b1's control test (`engine/tests/b1_projection_hostile_names.rs:233-268 @ 4de4b9a9`, primary `geometry` at `:101`, a `GEOMETRY` column at `:252`) | unwritten; **it moves a test the form declares unchanged (F-1)** |
| 6b | primary: two byte-equal `geometry` columns are refused | none | unwritten and unobserved (F-2) |
| 6c | primary: one exact match read under a changed name is refused | §2.3 step 2; G-2 (g2) | unwritten |
| 7a | code `engine.geo_metadata` | `kernel/src/skp.rs:2118 @ 4de4b9a9` | true at main |
| 7b | the refusal names the declared name with its matches, or with the changed name | §2.6 (a), (b), (g), plus a primary (a) text that does not exist yet (F-4) | unwritten |
| 8 | refused even when another path is absent | §2.4 steps 4 and 5; CC-2, CC-7 | unwritten |
| 9 | a covering path matching none of the file's names is absent, as item 9 says | Absent detail at `engine/src/dataset.rs:1407-1410`, drop at `:582-587 @ 4de4b9a9`; CC-5 | the detail and the drop are true at main; the file-names input is unwritten |
| 10 | primary: no exact match, and not refused for two or more, gives `engine.source` with the same text, now including `GEOMETRY_1` | text at `engine/src/dataset.rs:1906`, byte lookup at `:1903`, arm at `kernel/src/skp.rs:2060 @ 4de4b9a9`; G-3, G-4 | text and arm true at main; the order of (a) before the miss is untested (F-3) |
| 11 | a letter outside A to Z in a different case is a different letter | `:1454`, `:1465`, `:1903 @ 4de4b9a9` | true |
| 12 | names you supply are matched as before; case twins cause no refusal except in the cases above | the split yardstick (§1, §8 item 11) | the yardstick holds; the "no refusal except" half lost its evidence when b1's file became a refusal (F-1) |
| 13 | (deleted) | | |
| 14 | a U+0000 covering path still opens with the covering unusable | `engine/src/dataset.rs:1423-1424 @ 4de4b9a9`; §2.4 step 2 | true at main |
| item 9 | refused at open instead, in either order | §2.4 steps 4 and 5; CC-2, CC-7 | unwritten |
| comment | function names | `judge_covering` at `:1421`, `field_path_exists` at `:1446`, `check_geometry_column` at `:1899 @ 4de4b9a9` exist; `read_file_names` and `check_names_align` do not yet | the last two are unwritten |

**Findings on the form under OPEN-E** (for lead-data's revision in progress):
- **F-1, Correctness and Evidence (blocks the form until fixed).** OPEN-E's "case-insensitively" for the primary column refuses the file in `hostile_names_colliding_after_case_folding_bind_one_column_each`: columns `geometry` and `GEOMETRY`, primary `geometry`. That file opens and binds correctly at main.
  - The revised form names that test unchanged (its §4) and lists any such test moving as an invalidator (§5).
  - B1's form says the test "come[s] along unchanged" (`engine/B1-PROJECTION-PREREGISTRATION.md:885-887 @ 4de4b9a9`).
  - The form must declare the change: the test's edit or its new expected refusal; `engine/tests/b1_projection_hostile_names.rs` added to §7 before code; this file in §5's changed-outcome list; and §1's "Duplicate byte-equal names … not judged" limit removed.
  - The human's ruling is explicit, so this is no new question. But a correctly-binding file that today opens and will now be refused should be named on the sight list. Item 53's `geometry` and `GEOMETRY` example is that case.
- **F-2, Evidence.** Byte-equal duplicates, at the primary column and in a covering, have no P0 row and no test. Whether the in-test writer can write them, and whether DuckDB opens such a file before these checks run, is not established.
- **F-3, Evidence.** The words put (a) before the exact-match miss for the primary column. That needs a test, for example `Geometry` beside `geometry` and `GEOMETRY` giving `Err(GeoMetadata)`, and a mutation that runs the miss arm first and gives `Err(Source)`.
- **F-4, Evidence.** §2.6 has no detail text for the primary column's more-than-one refusal. One is needed for the human's sight (OPEN-A). G-1's file (g3, with `GEOMETRY` declared) now matches two names, so G-1's expected text moves from (g) to that text, and MG1's predicted outcome needs re-checking.

## 6. What I could not settle

- **F-1's route.** Either the b1 test is edited or a new test is added for a file whose case twins are not named by its `geo` metadata, which clause 12 needs. That is lead-data's and the custodian's call.
- **The two-byte-equal-`geometry` example.** If the P0 shows that DuckDB or the writer refuses such a file earlier, with another code, the example comes out of S6 and the case goes into the comment.
- **The primary-column check order** (more than one match, then no exact match, then rename) is what my words assume. Lead-data's §2.3 must state it, or the words come back.
- **Everything else carries over from my 2026-10-23 redraft:** the words still assume S-yes, G-yes, and K1 or K2; s3 and g5 still decide clauses 1b and 10; and I have not verified how the shell renders an open refusal.

I wrote no file. The paths I read:
- C:/dev/spatial-ide/KNOWN-LIMITATIONS.md
- C:/dev/spatial-ide/engine/src/dataset.rs
- C:/dev/spatial-ide/kernel/src/skp.rs
- C:/dev/spatial-ide/engine/tests/b1_projection_hostile_names.rs
- C:/dev/spatial-ide/engine/B1-PROJECTION-PREREGISTRATION.md
- C:/dev/spatial-ide/state/drafts/covering-case-collision-p0/p0-output.txt
- C:/dev/spatial-ide/state/consults/2026-10-23-covering-case-collision-binds-other-column-item-53-route-1-architect.md
- C:/dev/spatial-ide/state/consults/2026-10-23-covering-case-collision-binds-other-column-full-form-revised-lead-data-draft.md
- C:/dev/spatial-ide/state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md
