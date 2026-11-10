*Custodian's filing note (2026-10-23): the architect's KNOWN-LIMITATIONS words for `covering-case-collision-binds-other-column` (the human's weekend item 1) under each of lead-data's OPEN-3 options, their clause checks, its read of the draft's refusal detail, and five findings on lead-data's draft (F-1 and F-2 Correctness, F-3 Evidence, F-4 and F-5 Documentation), read only at main 6d33a446 (main moved after it only in records). The run 09:12:12Z to 09:18:18Z by its transcript (Read 13, Glob 2, Grep 15; no Write, Edit or Bash). The findings are fixed in the draft before the form commits; F-2 touches item 9's sentence, which is the human's wording, so its answer is the human's. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 650781cf650e262f8dfa3325a6da2917731cfc6840d4a2507ce1eedc8d7d293a.*

---

Words: covering-case-collision-binds-other-column, at main 6d33a446

I read the main checkout at 6d33a446. I have no shell, so this report carries no sha256. This is a words consult and not a gate. Two findings on the draft are Correctness class and one is Evidence class (item 4: F-1, F-2, F-3). They are for fixing before the form commits. Every drafted sentence below is mine and is not the human's wording, with one exception: the KNOWN-LIMITATIONS.md:114 sentence in F-2 is the human's wording (KNOWN-LIMITATIONS.md:115 @ 6d33a446).

**Wording rules found.** No file in docs/00 to docs/09 states how a refusal is worded. A search of `docs/0*.md` for "refus" returns nothing. These rules apply:
- docs/01 principle 8 (docs/01_Principles.md:14 @ 6d33a446): the engine refuses rather than choosing a column silently.
- The round 7 ruling: engine messages state engine facts, and owners state consequences.
- The KNOWN-LIMITATIONS headers (KNOWN-LIMITATIONS.md:3-12 @ 6d33a446 and KNOWN-LIMITATIONS.md:202-203 @ 6d33a446): no speed, duration or rate, and the on-main section holds lines true of main only.
- Round 25, item 4: the general truth first, then the specific limit, as item 29's source comment applies it.

## 1. The item's words (under H1)

**(A) A new item in the on-main section (I recommend this).**

```
53. **A file whose `covering.bbox` path matches more than one name in the file, when the case of the letters A to Z is ignored, is refused when it is opened.**
    The app matches each part of a `covering.bbox` path to the file's column names, and to the names of the fields inside a column, without regard to the case of the letters A to Z. Where one part matches two or more names, such as `bbox` against columns named `bbox` and `BBOX`, the app refuses the open rather than choose one of them. It does so even when one of the names is spelled exactly as the path is, and even when another path of the same covering names a column the file does not contain. This refusal has the code `engine.geo_metadata` and names the path and every name that part of it matches. Only the covering's paths are checked this way: a file whose other columns have names that differ only in letter case is not refused by this check, and which of those columns the app reads is not established. Names that differ only in the case of a letter outside A to Z count as different names. A file whose covering has a path containing the character U+0000 still opens with that covering unusable, as before, whatever its other paths match.
    <!-- DRAFT wording for the human's sight, not the human's own wording (engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md, section 4); drafted by the architect under item 2e of state/directives/2026-10-11-direction-after-status-review.md. Authority: state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md, item 1. Where the code does this, at <commit> on the piece's branch: judge_covering and field_path_exists in engine/src/dataset.rs (the more-than-one-match refusal, after the unchanged U+0000 check and before the absence check); EngineError::GeoMetadata in engine/src/error.rs; error_of's existing arm in kernel/src/skp.rs; CC-1 and CC-2 in engine/tests/covering_case_collision.rs. The pins follow on main after the merge. Not covered, by item 2c: none. -->
```

If the item above 53 at the base is not 52, a line at column 0 goes before item 53 so that it renders as 53, as was done for items 42 and 44 (KNOWN-LIMITATIONS.md:190 @ 6d33a446 and KNOWN-LIMITATIONS.md:196 @ 6d33a446).

**(B) One sentence appended to item 9, after KNOWN-LIMITATIONS.md:114 @ 6d33a446.**

```
   On main, a file is refused when it is opened if one part of a path in its `covering.bbox` matches more than one name in the file when the case of the letters A to Z is ignored, such as `bbox` against columns named `bbox` and `BBOX`, even when one name is spelled exactly as the path is and even when another of its paths names a column the file does not contain; the refusal has the code `engine.geo_metadata` and names the path and every name that part matches, only the covering's paths are checked this way, and a covering with a path containing U+0000 still opens with that covering unusable, as before.
```

Why I recommend (A):
- Item 9 sits under the v0.1.0 header, which states that every line there is true of the tagged artifact (KNOWN-LIMITATIONS.md:3-4 @ 6d33a446). (B) adds a second on-main sentence under that header. KNOWN-LIMITATIONS.md:114 is already one, and it carries no visible on-main mark.
- (B) has to fit what (A) spreads over seven sentences into one.

**Under H2 or H3:**
- **H2:** DuckDB already refuses the open, as `engine.source` with DuckDB's own text (kernel/src/skp.rs:2060 @ 6d33a446; engine/src/error.rs:282 @ 6d33a446), for any file that holds two such names, not only a covering's. The item would state that and drop the `engine.geo_metadata`, covering-only, exact-spelling and absent-path clauses.
- **H3:** no refusal lands, because the piece stops. The item would instead state that such a file opens and that its covering can be read from the other column, in the terms rows r1 to r4 record. Nothing is drafted for it before the P0. If r1 to r3 and r4 disagree, the words split by level.

## 2. Clause check (A; (B) is the same clauses joined)

These checks are against the drafted Change (the draft's line 18), the code at 6d33a446 and the tests as the draft names them. CC-1 and CC-2 do not exist yet, so the gate re-checks every clause on the branch.

| sentence | clause | what makes it true | status |
|---|---|---|---|
| Title | refused when it is opened | Change line: returned at the call site (engine/src/dataset.rs:436 @ 6d33a446), before sanity_check (:524-532), the identity scan (:558) and the descriptor (:565), all @ 6d33a446; CC-1, CC-2 | true under H1. A file that an earlier check refuses (CRS, geometry types, check_geometry_column at :429) is still refused at open, so the title holds. The U+0000 case is the last sentence's exception. |
| S1 | each part, without regard to case A to Z, at top level and child | field_path_exists, eq_ignore_ascii_case at engine/src/dataset.rs:1454 @ 6d33a446 and engine/src/dataset.rs:1465 @ 6d33a446; doc at :1439-1445; the Change reuses it | true (an existing rule, unchanged) |
| S2 | two or more matches → refuses rather than choose | Change line; today `.find` takes the first match (:1454); CC-1 (top level), CC-2 (child) | true |
| S3a | even when spelled exactly | CC-1 declares `bbox` with `bbox` present; CC-2 declares `bbox.xmin` with `xmin` present | true |
| S3b | even when another path names an absent column | draft §3, order of checks (ambiguity over all four paths, then absence) | true by the Change, but **no test proves it** (F-3) |
| S4a | code `engine.geo_metadata` | existing variant engine/src/error.rs:101 @ 6d33a446; arm kernel/src/skp.rs:2118 @ 6d33a446 | true |
| S4b | names the path and every name that part matches | draft §3 | true by the Change; **CC-1 and CC-2 as drafted do not discriminate it** (F-3) |
| S5a | only the covering's paths | Change walks the four declared paths; Block-on-sight 2 forbids a second site | true |
| S5b | which other column is read is not established | the draft's §7 item 3; check_geometry_column matches by byte equality at engine/src/dataset.rs:1903 @ 6d33a446 | true, as a statement that this is unexamined |
| S6 | a letter outside A to Z counts as a different letter | eq_ignore_ascii_case at :1454 and :1465 | true |
| S7 | a U+0000 path still opens with the covering unusable | judge_covering checks it first (engine/src/dataset.rs:1423-1424 @ 6d33a446); dropped at :582-587; Change: "the unchanged U+0000 check" | true; unchanged C-tests only |

The words leave one clause untrue elsewhere in the file: KNOWN-LIMITATIONS.md:114 @ 6d33a446 (F-2).

## 3. The refusal detail (draft §3, line 85), clause by clause

| clause | reading | status |
|---|---|---|
| "the covering names `<declared path>`" | same opening as the existing details (engine/src/dataset.rs:1385 @ 6d33a446, :1408) | true, but **which path is not covered**: §3 does not say which of the four is named when several collide (a struct-level collision makes all four collide) |
| "which matches more than one name in the file's schema" | the resident (DESCRIBE) schema, the same phrase the human approved for the Absent detail | true under H1. For a path deeper than two segments it matches prefixes, which is not untrue. |
| "when ASCII letter case is ignored" | eq_ignore_ascii_case | true |
| ": `<match>`, `<match>`" | every match, in schema order, as a schema path down to the colliding level | true by the Change; not proven by CC-1 and CC-2 (F-3) |
| render_visible_escape | as the existing details do | true |
| consequence | the text states the engine's finding and no consequence; the Display prefix is `geo metadata: ` (engine/src/error.rs:340 @ 6d33a446) | true; it satisfies the round 7 ruling |
| "a P6 placeholder" | the tree marks unsighted engine strings with a leading `[P6 placeholder] ` (engine/src/geoarrow.rs:169 @ 6d33a446; engine/src/wkb.rs:93 @ 6d33a446); §3's text has no marker | **not covered** (F-4) |
| order of checks, U+0000 first | :1423 | true |
| ambiguity, then absence | Change line | true. It contradicts the Change line's last clause (F-1). |

My replacement words, not the human's:
- For §3's first sub-bullet: "`<declared path>` is the first of the xmin, ymin, xmax and ymax paths, in that order, whose walk meets more than one name, its declared segments joined by `.`, as declared."
- Optional, for line 85: "when the case of the letters A to Z is ignored" in place of "when ASCII letter case is ignored".

The detail is an operator string and stays under P6. These are suggestions for the human's sight, not words a worker applies.

## 4. Findings in the five lines, against main 6d33a446

- **F-1, Correctness (a claim of a guarantee).** The Change line ends: a covering naming an absent column keeps "today's outcomes and texts byte for byte". That is untrue for a covering with one absent and one ambiguous path, which §3 refuses at open. Replacement words (mine): "a covering with exactly one match at every level, a U+0000 covering, and a covering naming an absent column none of whose paths meets more than one name keep today's outcomes and texts byte for byte."

- **F-2, Correctness.** The Out-of-scope line says "no stated guarantee ... changes". But KNOWN-LIMITATIONS.md:114 @ 6d33a446 states that a file whose covering names an absent column "opens", and that becomes untrue for the absent-plus-ambiguous file. That sentence is the human's wording, so the human answers: yes, their own words, or accepted as it stands.
  - My replacement words, under (A): keep the sentence as it is and append "If another path of that covering matches more than one name in the file, the file is refused when it is opened instead (item 53)."
  - Under (B), the appended sentence already carries this.
  - Either way, the Scope line's `KNOWN-LIMITATIONS.md ... <= 4` is too small. The new item takes 3 or 4 lines and the item 9 edit takes 2, so raise it to `<= 7` and raise the total to match.

- **F-3, Evidence.** As drafted, the tests do not discriminate the detail:
  - CC-1's "contains `bbox`" holds through `bbox.xmin` alone.
  - CC-2's "contains `bbox.xmin`" holds through the declared path alone, so the first match is never shown to be named.
  - No test shows ambiguity being judged before absence.
  - Fix: assert the whole Display with assert_eq, as C-1 does through `names()` (engine/tests/covering_names_missing_column.rs:94-96 @ 6d33a446 and :124). Give CC-2's covering one absent child as well, and add a mutation that judges absence first. CC-2 must then still refuse with the collision detail. This proves S3b and S4b.

- **F-4, Documentation (fix before the form commits).** The Change line calls the detail "a P6 placeholder" but gives it no `[P6 placeholder] ` prefix. Either carry the tree's marker, or sight the detail before merge under OPEN-5 and drop the word "placeholder".

- **F-5, Documentation.** The Scope line's KNOWN-LIMITATIONS entry, "one new item", assumes OPEN-3 (A). Under (B) it names item 9 and its source comment instead.

- **Cites.** At 6d33a446 the draft's code cites hold what it says at the cited lines: engine/src/dataset.rs:429, :436, :524-532, :558, :565, :582-587, :1101-1164, :1384-1388, :1407-1410, :1421-1437, :1446-1472 and :1903; engine/src/error.rs:101 and :340; kernel/src/skp.rs:2118; engine/Cargo.toml:23 and :44; engine/src/fixture.rs:45; engine/src/wkb.rs:593; engine/tests/covering_names_missing_column.rs:219. All of these are @ 6d33a446. The draft pins them @ 2ffbf957, and whether 2ffbf957 holds the same lines is for the custodian's script.

- Nothing else in the five lines is untrue against the code at main.

Reuse index: two misses, as supplied in the brief ("known limitations wording", "refusal message wording").
