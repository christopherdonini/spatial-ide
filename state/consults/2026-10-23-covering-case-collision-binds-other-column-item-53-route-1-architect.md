*Custodian's filing note (2026-10-23): the architect's redraft of KNOWN-LIMITATIONS item 53 for `covering-case-collision-binds-other-column`'s route 1, with the sentence appended after item 9 (the human's OPEN-8 and the full form's OPEN-B), read only at main 0c72c69a; drafts for the human's sight, not the human's words. The run 16:51:47Z to 16:56:30Z by its transcript (Read 16, Grep 6; no Write, Edit or Bash). Its findings C-1, E-1 and E-2 on lead-data's full-form draft go back to lead-data before the form is committed. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 0f0b866fee19fe145586e4e7f1f7e06a033fa5b4016678cefefc5fc7ffecadaa.*

---

Redrafted: item 53 for covering-case route 1, at main 0c72c69a

Reviewed: main @ 0c72c69a (the main checkout as read; I have no shell, so I could not confirm HEAD by command, and this report carries no sha256 anywhere). Every `path:line` below is `@ 0c72c69a` unless a different commit is named. None of these words is the human's wording. They go to the human's sight (OPEN-8). I quote only text I read in the checkout.

## 1. Where the primary-column refusal goes: inside item 53

- **It is one rule.** OPEN-4 applies one split yardstick to the names the file supplies: the covering's paths and `geo.primary_column` are judged against the file's names. One general truth comes first: the app reads a case twin under a changed name. Both refusals follow from it, which is the round 25, item 4 order.
- **One set of limits.** The limits are the same for both: names the operator supplies, the ASCII-only rule, and the earlier U+0000 rule. Two items would repeat them.
- **One code and one test file.** Both refusals use `engine.geo_metadata`, and their tests are in one file (`engine/tests/covering_case_collision.rs`, §4 of the draft).

## 2. Item 53

It goes at the end of the file, after item 52 (`KNOWN-LIMITATIONS.md:415-417`), in the on-main section (`KNOWN-LIMITATIONS.md:200`). Items 51 and 52 are already a list, so no column-0 line is needed. It adds 4 lines: a blank line, the title, the body and the comment.

~~~
53. **A file is refused when it is opened if a name in its `covering.bbox` matches more than one of its column names, or if its `covering.bbox` or `geo.primary_column` names a column the app reads under another name.**
    When a file holds two column names that differ only in the case of the letters A to Z, or two such field names inside one column, the app reads the later one under a changed name, with a suffix added, such as `BBOX_1` for a second `BBOX`; a changed name that meets a name the file already holds is changed again, so the file's own `BBOX_1` is then read as `BBOX_1_1`. The names in a file's `geo` metadata, the paths of its `covering.bbox` and its `geo.primary_column`, are matched against the names the file itself holds, not the changed ones. Each part of a `covering.bbox` path is matched to the file's column names, and to the names of the fields inside a column, without regard to the case of the letters A to Z. Where one part matches two or more of them, such as `bbox` against columns named `bbox` and `BBOX`, the open is refused rather than one of them chosen, even when one is spelled exactly as the path is. Where it matches one, and the app reads that column under a changed name, as for a path naming `BBOX_1` in a file that holds `bbox`, `BBOX` and `BBOX_1`, the open is refused too: the path would not read the column the file names. `geo.primary_column` must match one of the file's column names exactly, and where the app reads that column under a changed name, the open is refused the same way. These refusals have the code `engine.geo_metadata` and name the declared name with the file's names it matches, or with the name the app reads that column under. A covering is refused this way even when another of its paths names a column the file does not contain. A covering path that matches none of the file's names names a column the file does not contain, as item 9 says, even when it is spelled like a changed name, such as `BBOX_1` in a file that holds only `bbox` and `BBOX`. A `geo.primary_column` that matches none of them exactly is refused as `engine.source`, with the same text as before, saying the file does not contain it; that now includes a name spelled like a changed name, such as `GEOMETRY_1` in a file that holds only `geometry` and `GEOMETRY`. In these checks a letter outside A to Z in a different case counts as a different letter. Only the names the file supplies are checked this way: names you supply, such as a column a filter names, are matched as before, against the names the app reads the columns under, and a file whose other columns have names that differ only in letter case is not refused. A file that holds two columns under exactly the `geo.primary_column` name is not judged by this check, and which of them the app reads is not established. A covering path containing U+0000 still opens with that covering unusable, as before, whatever its other paths match.
    <!-- DRAFT wording for the human's sight, not the human's own wording (engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md, §11, item 53, and §1); drafted by the architect under item 2e of state/directives/2026-10-11-direction-after-status-review.md. Authority: state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md, the covering-case paragraph (OPEN-2, OPEN-3, OPEN-4, OPEN-6, OPEN-8). Evidence for the changed names: state/drafts/covering-case-collision-p0/p0-output.txt, rows r1 to r4; hostile_names_colliding_after_case_folding_bind_one_column_each in engine/tests/b1_projection_hostile_names.rs; the full form's P0 outputs under state/drafts/covering-case-collision-full-form-p0/. Where the code does this, at <commit> on the piece's branch: read_file_names (the file's own names, read from the footer), check_names_align, judge_covering and field_path_exists (the covering's paths: more than one match, a match read under a changed name, then absence), and check_geometry_column (geo.primary_column), all in engine/src/dataset.rs; EngineError::GeoMetadata and EngineError::Source in engine/src/error.rs, through error_of's existing arms in kernel/src/skp.rs; CC-1 to CC-5 and G-1 to G-3 in engine/tests/covering_case_collision.rs. The pins follow on main after the merge. Not covered, by item 2c: an open cancelled while the file's names are read, which ends as cancelled before any of these checks (CK-1), a case inside one request round trip; the internal-inconsistency refusals for a footer whose names do not line up with the schema the app reads (check_names_align, and the walk's struct check), which the form's P0 is to show no ordinary file reaches; names that differ only in the case of a letter outside A to Z, where whether the app reads either under a changed name is not established; the LOD tiers' identity column, which is its own node (lod-tier-identity-binds-file-name), and build_tiers has no product caller (item 33). -->
~~~

## 3. Item 9 (OPEN-B): one sentence is needed

**Why.** The sentence at `KNOWN-LIMITATIONS.md:114` is the human's wording (`:115` says so), and it stays byte for byte. Under route 1 its "opens" becomes untrue in one case: a covering with one absent path and another path that is ambiguous or read under a changed name is refused at open (§2.4, steps 4 and 5). This is F-2 of my earlier words, carried over.

**Where.** After `KNOWN-LIMITATIONS.md:116`, before the blank line at `:117`, with 3 spaces of indent. It adds 2 lines. Like `:114`, it carries no visible on-main mark. If the human wants one, start the sentence with "On main, if another path…".

~~~
   If another path of that covering matches more than one of the file's column names, or names a column the app reads under another name, the file is refused when it is opened instead (item 53).
   <!-- DRAFT wording for the human's sight, not the human's own wording (engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md, §11, OPEN-B); the sentence above the earlier comments stays the human's wording. Where the code does this, at <commit> on the piece's branch: judge_covering in engine/src/dataset.rs, which refuses such a path before it records an absent one; CC-2 in engine/tests/covering_case_collision.rs. The pins follow on main after the merge. -->
~~~

Total for `KNOWN-LIMITATIONS.md`: 6 insertions, within the draft's §7 ceiling of 14.

## 4. Clause checks

"Unwritten" means the clause rests on code that is not written yet. Each such clause is checked again at the PR's head.

| # | clause | what makes it true | status |
|---|---|---|---|
| T | title | the two refusal kinds of §2.4 (a) and (b), and §2.3 step 2 | unwritten |
| 1a | the later of two case twins is read under a changed name, at the top level and inside a column | `state/drafts/covering-case-collision-p0/p0-output.txt:185` (bbox, BBOX gives BBOX_1), `:193` (BBOX, bbox gives bbox_1), `:210` (child xmin, XMIN gives XMIN_1) | true at main (observed) |
| 1b | a changed name that collides is changed again | `engine/tests/b1_projection_hostile_names.rs:262` (Zone_1 becomes Zone_1_1); top level only, no struct case | true at main at the top level. The child level waits for P0 row s3. |
| 2 | matched against the file's own names | §2.1 `read_file_names` (`parquet_schema`); today the walk uses resident names (`engine/src/dataset.rs:1446-1472`) | unwritten; also rests on H-S |
| 3 | each part, without regard to case A to Z, top level and child | `eq_ignore_ascii_case` at `engine/src/dataset.rs:1454` and `:1465`, kept by §2.4 step 3 | the rule is true at main; its input is unwritten |
| 4 | two or more matches are refused, even when one is spelled exactly | §2.4 (a); CC-1 (s1, `bbox` declared beside `BBOX` and `bbox`); CC-2 | unwritten. Today r2 opens and reads the other column (`p0-output.txt:196-199`). |
| 5 | one match read under a changed name is refused | §2.4 (b); CC-3 (g1), CC-4 (s3). "would not read the column the file names" is text (b)'s own claim, not a stronger one | unwritten; rests on G-yes |
| 6 | the primary column matches exactly, and a renamed one is refused | §2.3 steps 1 and 2; exact matching today at `engine/src/dataset.rs:1903`; G-1, G-2 | unwritten |
| 7a | code `engine.geo_metadata` | the existing arm at `kernel/src/skp.rs:2118` | true at main (unchanged arm) |
| 7b | names the declared name with the matches, or with the name it is read under | §2.6 texts (a), (b), (g); §4 asserts the whole Display | unwritten |
| 8 | refused even when another path is absent | §2.4 steps 4 and 5; CC-2 with M3 | unwritten; **evidence gap E-2** |
| 9 | a path matching no file name is absent, as item 9 says, even when spelled like a changed name | §2.4 Absent; the Absent detail at `engine/src/dataset.rs:1407-1410` is unchanged; the drop is at `:582-587`; CC-5 (g4) | unwritten |
| 10 | a primary column matching no file name exactly is `engine.source` with the same text, now including `GEOMETRY_1` | §2.3 step 1; the text at `engine/src/dataset.rs:1906`; the arm at `kernel/src/skp.rs:2060`; G-3 | the text and arm are true at main; the `GEOMETRY_1` case is unwritten and **untested (E-1)** |
| 11 | a letter outside A to Z in a different case counts as different | `eq_ignore_ascii_case` (`:1454`, `:1465`); byte equality (`:1903`) | true |
| 12 | names you supply are matched as before; other case-twin columns are not refused | §1 split yardstick; §8 item 11; §5 declared unchanged; the b1 test opens such a file (`engine/tests/b1_projection_hostile_names.rs:258`) and is declared unchanged in §4 | true at main; the unchanged claim is checked at the head |
| 13 | two byte-equal primary names are not judged, and which one is read is not established | §1 limits; §2.3 step 1 takes the first; OPEN-E | true by the draft; the sentence goes if OPEN-E widens the piece |
| 14 | a U+0000 path still opens with the covering unusable | `engine/src/dataset.rs:1423-1424` checks it first, and §2.4 step 2 keeps it first; the drop is at `:582-587` | true at main (unchanged path) |
| item 9 | refused at open instead | §2.4 steps 4 and 5; CC-2 | unwritten; E-2 applies |
| comment | function names | `judge_covering` `:1421`, `field_path_exists` `:1446`, `check_geometry_column` `:1899` exist at main; `read_file_names` and `check_names_align` are §2.1 and §2.2 | the last two are unwritten |

## 5. Findings on the draft, from these checks (fix before the form commits)

- **C-1, Correctness (a claim the code will not support).** §1, item 4's second sentence says a primary column the file does not contain "keeps today's `engine.source` refusal and text". That is false for a name spelled like a generated one. Take `GEOMETRY_1` in a file that holds `geometry` and `GEOMETRY`. Today the exact lookup on the resident schema (`engine/src/dataset.rs:1903`) finds the resident `GEOMETRY_1`, which is the file's `GEOMETRY`, so the file opens and reads that column. After §2.3 step 1, the open is refused. Only the text is kept, not the outcome. My replacement words: "A `geo.primary_column` that matches none of the file's names byte for byte is refused as `engine.source` with today's text byte for byte; that includes a name spelled like a generated name, such as `GEOMETRY_1` beside `geometry` and `GEOMETRY`, which today opens reading the file's `GEOMETRY`." §5's `describe` exception, and any operator-facing count of changed outcomes, should name this case too.
- **E-1, Evidence.** Nothing tests clause 10's new case, and the P0 has no row for it. Add a P0 row g5 (`geometry`, `GEOMETRY`, primary `GEOMETRY_1`, predicted to open and read the file's `GEOMETRY` today). Add a test G-4: `Err(Source)` with D4's text for `GEOMETRY_1`. Its mutation: the file-name lookup replaced by the resident-schema lookup, which gives `Ok`.
- **E-2, Evidence.** CC-2's absent path is `ymax`, which comes after the colliding `xmin`. A mutation that returns the first walk that does not resolve, in path order, still passes CC-2. So clause 8 ("even when another of its paths names a column the file does not contain"), and the item 9 sentence, are proven for only one order. Fix: put CC-2's absent path ahead of the colliding one (for example `xmin` absent and `ymin` colliding), or add a test in that order. Add the mutation (MO): the first walk that does not resolve, in path order, is returned.

## 6. What I could not settle

- **The words assume the P0 comes out S-yes, G-yes, and K1 or K2.**
  - G-no at the top level: the `BBOX_1` examples in clauses 5 and 9 change to the child level, or are dropped.
  - S-no or K3: the item is void.
  - P0 row s3 also decides whether clause 1b holds inside a column.
- **The "not covered" internal-inconsistency case.** It stays in the comment only if the P0 shows that no ordinary file reaches it. If one does (for example a `k=v` folder outside K2), ordinary use can reach it, and it needs a sentence in the body.
- **OPEN-E.** If the human widens the piece to judge byte-equal duplicate primary names, clause 13 is dropped.
- **Three or more case twins.** The rename suffix is not measured for them, which is why the words say "such as".
- **What the shell shows on an open refusal.** I did not verify how the shell renders it. I followed item 31's register (`KNOWN-LIMITATIONS.md:354`), which says a file is "refused at open as `engine.geo_metadata`".
- **Whether item 9's appended sentence carries a visible "On main," mark.** That is the human's choice; §3 gives the variant.
