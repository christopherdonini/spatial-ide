*Custodian's filing note (2026-10-23): `covering-case-collision-binds-other-column`'s five-line form, revised by lead-data, read only at main ed2c89e0, with the human's rulings (item 3 of the rulings filed today) and the architect's F-1 to F-5. The form is committed from it with its pins. Note for the P0: the engine siblings check filed beside it (`state/consults/2026-10-23-engine-column-name-case-siblings-lead-data-check.md`, its fact B and its first unsettled item) reads DuckDB as renaming a name that differs from an earlier one only by case, which predicts the form's H3 at the top level; the P0 decides, and H3 stops the piece before code. The run 10:05:16Z to 10:12:35Z by its transcript (Grep 14, Read 41; no Write, Edit or Bash). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 39727be7ce1d723d827bccf777aeda3d05020536790e386a2db3510a59824c32.*

---

Revised: covering-case-collision-binds-other-column, at main ed2c89e0

I read the main checkout at ed2c89e0. I have no shell, so this report carries no sha256. Every cite below is re-pinned `@ ed2c89e0`, and I re-read each one at that commit. Every code line the draft cited at 2ffbf957 holds the same text at ed2c89e0. Form path proposed (unchanged): `engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md`. No markers appear inside the form text, so the custodian can commit it clean. The changed lines are listed by section in "Changed lines against the draft", after the form.

---

## 1. The five-line form

*Header (for the form): Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line. Drafted by lead-data at main 2ffbf957 and revised at main ed2c89e0 with the human's rulings of 2026-10-23 (item 3) and the architect's findings F-1 to F-5, in place of the architect's drafting consult. Before code: the P0 below, then its result recorded as a class-1 `Amendment:` line (OPEN-1 (A)). The custodian keeps the PLAN node on main. The branch carries no PLAN file and no generated file.*

```
Authority: PLAN node covering-case-collision-binds-other-column (PLAN.yaml:4262 @ ed2c89e0; its summary, PLAN.yaml:4277 @ ed2c89e0), graded S1 and directed as a five-line form by the human's message of 2026-10-23, item 1 (state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:8 @ ed2c89e0), its OPEN items and F-2 ruled by the human's message of 2026-10-23, item 3 (state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md:10 @ ed2c89e0); the KNOWN-LIMITATIONS words and findings F-1 to F-5, the architect's (state/consults/2026-10-23-covering-case-collision-binds-other-column-kl-words-architect.md); its origin, the covering-names-missing-column form's Amendment 1 items 4 and 5 (engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md:299-300 @ ed2c89e0) and Amendment 2 item 4 (engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md:313 @ ed2c89e0); the machine rules (state/directives/2026-10-06-machine-script-adopted.md) for every heavy run. Reuse index: node tools/reuse.mjs in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for covering column case insensitive, `No prior art recorded for "covering column case insensitive". Research it before planning an implementation.` and, for schema name collision, `No prior art recorded for "schema name collision". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: engine/src/dataset.rs (judge_covering and field_path_exists, engine/src/dataset.rs:1421-1472 @ ed2c89e0, with their doc comments, and the one call site at engine/src/dataset.rs:436 @ ed2c89e0 taking the new Result; <= 50); engine/tests/covering_case_collision.rs (new: one in-test writer built on the crate's own arrow and parquet dependencies, engine/Cargo.toml:23 @ ed2c89e0 and engine/Cargo.toml:44 @ ed2c89e0, with spatial_engine::fixture::LV95_PROJJSON, engine/src/fixture.rs:45 @ ed2c89e0, and spatial_engine::wkb::encode_polygon, engine/src/wkb.rs:593 @ ed2c89e0; CC-1 and CC-2; <= 90); KNOWN-LIMITATIONS.md (item 53, a new item in the on-main section by OPEN-3 (A), with its source comment, and the architect's sentence appended after item 9's sentence at KNOWN-LIMITATIONS.md:114 @ ed2c89e0, with its source comment, that sentence and every other line of item 9 unchanged; <= 7: item 53 <= 5, its separating blank line and a column-0 line included, and item 9 2); engine/README.md (Owner's index only: Last verified at, the preregistrations-in-this-module list, Declared limits; <= 3); this form; 4 files besides this form; declared line budget <= 150 changed lines (insertions plus deletions, this form excluded), of which code and tests <= 140 by §21c's counting rule, counted by git diff --numstat origin/main...HEAD -- . ':(exclude)engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md' with columns 1 and 2 summed, and per file by the same command with the file's path; §21c's count: 140 lines of code and tests (150 with KNOWN-LIMITATIONS.md and engine/README.md) over 4 files, inside its 150 lines and 8 files (AUTONOMY.md:350-351 @ ed2c89e0), the route set by OPEN-2 (A) because the change crosses its no-new-user-visible-behaviour bound; engine/src/fixture.rs is not edited; no PLAN or generated file on the branch.
Change: After the unchanged U+0000 check and before absence is judged, judge_covering walks all four declared paths with the existing ASCII case-insensitive segment comparison, and where a segment equals more than one name at its level of the resident schema, it refuses the open with the existing EngineError::GeoMetadata (wire code engine.geo_metadata, no fields, through error_of's existing arm at kernel/src/skp.rs:2118 @ ed2c89e0), its detail naming the declared path and every matched name (section 3 below), in the words the human sights before merge under OPEN-5, returned at the call site before sanity_check, the identity scan and the descriptor, as check_geometry_column's refusal at engine/src/dataset.rs:429 @ ed2c89e0 already is; a covering with exactly one match at every level, a U+0000 covering, and a covering naming an absent column none of whose paths meets more than one name keep today's outcomes and texts byte for byte.
Tests+mutation: P0 first, before any code (OPEN-1 (A); rows and selection rule in section 2 below), its result one class-1 Amendment line; new CC-1 `a_covering_whose_column_name_matches_two_schema_names_by_case_refuses_the_open_by_name` (top level: `bbox` and `BBOX` structs, the second written 1,000,000 m east, covering declared `bbox`; Dataset::open is Err(EngineError::GeoMetadata(_)), and its whole Display is asserted with assert_eq against section 3's text for CC-1, as C-1 asserts its whole detail at engine/tests/covering_names_missing_column.rs:94-96 @ ed2c89e0 and engine/tests/covering_names_missing_column.rs:124 @ ed2c89e0), mutation M1, the more-than-one arm removed at the top level only so the first match is taken as `.find` takes it today, fails CC-1 by name and leaves CC-2 green; new CC-2 `a_covering_whose_child_name_matches_two_struct_children_by_case_refuses_the_open_by_name` (one `bbox` struct with children xmin, XMIN (offset), ymin, xmax, ymax; covering declared `bbox.xmin`, `bbox.ymin` and `bbox.xmax`, and for ymax the absent child `bbox.zmax`; Dataset::open is Err(EngineError::GeoMetadata(_)), and its whole Display is asserted with assert_eq against section 3's text for CC-2), mutation M2, the more-than-one arm applied at the top level only, fails CC-2 by name and leaves CC-1 green, and mutation M3, absence judged over all four paths before ambiguity, fails CC-2 by name (the open then succeeds with the covering dropped) and leaves CC-1 green; each mutation is observed by applying it alone at the final code commit, running its own test, recording its failure by name with that commit id, and reverting it (round 25, item 2 (c)); unchanged and green without edit: C-1 to C-5 in engine/tests/covering_names_missing_column.rs (C-3's row d, a single `bbox` declared `BBOX`, still opens with its covering kept: engine/tests/covering_names_missing_column.rs:219 @ ed2c89e0), K-1 in kernel/tests/skp_projection.rs, N-13 and N-14 in engine/tests/b1_projection_hostile_covering.rs, kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case, and the whole workspace suite.
Out-of-scope: ADR: not touched, and no ADR is cited as changed. Security (what ADR-020, ADR-009 or ADR-021 governs): not touched. Wire: not touched: no SKP message, literal, field or code is added; the refusal travels as the existing engine.geo_metadata through the existing arm; protocol/, kernel/ and frontends/ have empty diffs and SKP-V0.md is not edited. Guarantee: no property under test changes; one stated limit narrows: item 9's sentence at KNOWN-LIMITATIONS.md:114 @ ed2c89e0 says a file whose covering names an absent column opens, which stops holding where another path of that covering meets more than one name, so that sentence stays and the architect's sentence is appended after it (F-2, the human's answer); the tests named unchanged above stay green without edit, and any existing test or corpus row that moves stops the piece. §21c's "no new user-visible behaviour" is crossed: a file that opens today with its covering kept or dropped is refused at open, with a new detail text; the gate route is OPEN-2 (A), this five-line form with both gates, the reviewer and the architect, from dispatch. No dependency, no exposure surface, no new pub item, no new EngineError variant, no constant.
```

---

## 2. Supporting sections (beneath the five lines)

### §0. The code as read (main ed2c89e0)

- **F1. The walk takes the first match.** `field_path_exists` compares each segment with ASCII case-insensitive equality and takes the first hit, at the top level (`.find(|f| f.name().eq_ignore_ascii_case(first))`, engine/src/dataset.rs:1454 @ ed2c89e0) and at each child (engine/src/dataset.rs:1465 @ ed2c89e0). Whole function: engine/src/dataset.rs:1446-1472 @ ed2c89e0. Its doc comment states the P0's rule (engine/src/dataset.rs:1439-1445 @ ed2c89e0).
- **F2. The one decision.** `judge_covering` runs the U+0000 check first, then looks for absence in xmin, ymin, xmax, ymax order (engine/src/dataset.rs:1421-1437 @ ed2c89e0). It returns `Option<CoveringFinding>` (engine/src/dataset.rs:1393-1399 @ ed2c89e0). It has one caller, at engine/src/dataset.rs:436 @ ed2c89e0, after `probe_schema` and `check_geometry_column` (engine/src/dataset.rs:428-429 @ ed2c89e0) and before `sanity_check` (engine/src/dataset.rs:524-532 @ ed2c89e0), the identity scan (engine/src/dataset.rs:558 @ ed2c89e0) and the descriptor (engine/src/dataset.rs:565 @ ed2c89e0).
- **F3. The texts that stay unchanged.** The U+0000 reason is at engine/src/dataset.rs:1384-1388 @ ed2c89e0 and the Absent detail at engine/src/dataset.rs:1407-1410 @ ed2c89e0. Where the covering is stored or dropped: engine/src/dataset.rs:582-587 @ ed2c89e0.
- **F4. The resident schema.** It carries DESCRIBE's bound names. Where an Arrow-export name differs, it is kept as `spatial.exported_name` metadata (engine/src/dataset.rs:1101-1164 @ ed2c89e0). The check reads these resident names. Whether two names differing only by case reach the resident schema at all is the P0's question.
- **F5. The code family.** `GeoMetadata(String)` is at engine/src/error.rs:101 @ ed2c89e0 and its Display, `"geo metadata: {d}"`, at engine/src/error.rs:340 @ ed2c89e0. The wire arm `EngineError::GeoMetadata(_) => ("geo_metadata", vec![]),` is at kernel/src/skp.rs:2118 @ ed2c89e0. So the SKP refusal is code `engine.geo_metadata`, no structured fields, and the Display text as its message.
- **F6. `parse_covering`** accepts any non-empty path of strings and judges nothing against the schema (engine/src/geoparquet.rs:624-648 @ ed2c89e0). It is not edited.
- **F7. Why the test writes its own file.** `write_hostile_covering` writes exactly one struct with four children (engine/src/fixture.rs:1688-1693 @ ed2c89e0). It cannot build either collision. An in-test writer avoids editing `engine/src/fixture.rs`, which #241 edits.

### P0 (before code, on unmodified main at the piece's base; an untracked scratch test; outputs kept as text under `state/drafts/covering-case-collision-p0/`)

| row | written | declared | recorded |
|---|---|---|---|
| r1 | `bbox`{xmin,ymin,xmax,ymax} at the true extent, then `BBOX`{…} offset +1,000,000 m east | `bbox` | open outcome (Ok, or the error's Display); DESCRIBE's names and the Arrow export's names on a fresh connection; `covering().is_some()`; a bbox stream over the true extent: rows returned (10 = the declared struct's values, 0 = the other struct's), or its error |
| r2 | as r1, with `BBOX` written first | `bbox` | as r1 |
| r3 | as r1 | `Bbox` (matches neither name exactly) | as r1 |
| r4 | `bbox`{xmin, XMIN (offset), ymin, xmax, ymax} | `bbox.xmin` | as r1 |

**Selection rule:**
- **H1.** Every row opens, and both names are in DESCRIBE's output and in the export. The Change stands as written, and r1 to r4 record which column the binder reads today.
- **H2.** DuckDB refuses such a file at the schema probe (`engine.source`). The open is already refused by DuckDB's own text. Stop and return to the custodian: the piece reduces to a test and the KNOWN-LIMITATIONS line.
- **H3.** DESCRIBE renames one of the names. No resident-schema check can see the collision, and the file's own names live only in the Parquet footer. Stop and return to the custodian and the architect: a footer read is a different piece and would likely cross §21c.

Rows that disagree between levels are recorded as they are. None of the four rows is a prediction that can be edited.

### Declared unchanged

- Every U+0000 reason and detail.
- The Absent detail and the no-covering detail.
- `sanity_check`, its levels and reasons.
- `EngineError`'s variants and Display texts, and `error_of`.
- `describe` for every file that opens.
- `engine/src/addressability.rs`.
- `engine/src/fixture.rs`, and `engine/src/layout.rs`'s own `covering_of` (still the residual the missing-column form names).
- `engine/ADMISSION-PREREGISTRATION.md`, and the generated `engine/ADMISSION-RESULTS.md` (no regeneration is owed; a corpus row that moves is a stop).
- SKP-V0.md.
- `protocol/`, `kernel/` and `frontends/`, all with empty diffs.

The judgement stays a pure function of the declared paths and the resident schema. It takes no `Connection` and runs no statement. The code has no `cfg` and no OS-keyed rule, as the parent form's R1 to R4 require.

### Block-on-sight (for the gate)

1. Any statement or `Connection` in the decision.
2. A second site that decides ambiguity.
3. A refusal after `sanity_check`, the identity scan or the descriptor.
4. A byte change to any text declared unchanged.
5. A new variant, code, field, literal, `pub` item or constant.
6. An engine message that states another module's consequence.
7. A KNOWN-LIMITATIONS text or a refusal detail other than the words the human sighted (OPEN-5).
8. A size overrun, which is class 6. Past 150 lines, §21b's mid-piece clause applies.

---

## 3. The refusal's code and text

- **Code:** `engine.geo_metadata` (existing; F5).
- **Text.** These are the drafted words for the human's sight before merge (OPEN-5), not a quotation. They carry no `[P6 placeholder] ` marker: the human sights them before the merge, so they ship as sighted words, as the existing covering details carry none (engine/src/dataset.rs:1385 @ ed2c89e0 and engine/src/dataset.rs:1408 @ ed2c89e0). If the human changes them at sight, the code and CC-1's and CC-2's asserted texts change with them before the merge, inside Scope. The Display is `geo metadata: ` followed by the detail:
  `the covering names `<declared path>`, which matches more than one name in the file's schema when ASCII letter case is ignored: `<match>`, `<match>``
  - `<declared path>` is the first of the xmin, ymin, xmax and ymax paths, in that order, whose walk meets more than one name, its declared segments joined by `.`, as declared.
  - Each `<match>` is that match's schema path down to the colliding level, in schema order. CC-1 gives `bbox`, `BBOX`; CC-2 gives `bbox.xmin`, `bbox.XMIN`.
  - Every path is rendered through `render_visible_escape`, as the existing details are.
  - The whole Display that CC-1 and CC-2 assert with assert_eq (F-3), as drafted:
    ```
    CC-1: geo metadata: the covering names `bbox.xmin`, which matches more than one name in the file's schema when ASCII letter case is ignored: `bbox`, `BBOX`
    CC-2: geo metadata: the covering names `bbox.xmin`, which matches more than one name in the file's schema when ASCII letter case is ignored: `bbox.xmin`, `bbox.XMIN`
    ```
- **Order of the checks.**
  - U+0000 first, unchanged. Such a file still opens with its covering dropped.
  - Then ambiguity, over all four paths.
  - Then absence.
  - So a file with one absent path and one ambiguous path is refused, never opened with its covering dropped. This follows the human's rule as written. CC-2 (its absent `bbox.zmax`) and M3 prove it.

---

## 4. The KNOWN-LIMITATIONS item, and item 9's appended sentence

- **Number: 53, by the human's OPEN-3 (A)** (state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md:10 @ ed2c89e0).
  - At ed2c89e0 the items run 1 to 46. The last is item 46, at KNOWN-LIMITATIONS.md:407 @ ed2c89e0.
  - Item 47 is #241's (state/consults/2026-10-22-b1-shell-half-pr-a-re-sweep.md:162 @ ed2c89e0).
  - Items 48 to 50 are 1c's K-2 to K-4, "at the next free numbers after the redaction scan's item" (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:513-517 @ ed2c89e0).
  - Items 51 and 52 are PR A's KL-4 and KL-7 (frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:794 @ ed2c89e0).
  - At the piece's base, a search checks that no item holds 53. If one does, as happens if 1c's withdrawn K-1 keeps a number and PR A moves to 52 and 53 (state/consults/2026-10-22-b1-shell-half-pr-a-re-sweep.md:166 @ ed2c89e0), the piece stops and returns to the custodian, because the number is the human's.
  - If the item above 53 at the base is not 52, a line at column 0 goes before item 53 so that it renders as 53, as was done for items 42 and 44 (KNOWN-LIMITATIONS.md:190 @ ed2c89e0 and KNOWN-LIMITATIONS.md:196 @ ed2c89e0). That line is inside item 53's 5 lines.
- **Place:** the section "On main since v0.1.0 — not in any release yet" (KNOWN-LIMITATIONS.md:200 @ ed2c89e0), at the end of the file after the highest item present at the base. The behaviour exists on main only.
- **Nearest item:** item 9 (KNOWN-LIMITATIONS.md:109-116 @ ed2c89e0). Its sentence at KNOWN-LIMITATIONS.md:114 @ ed2c89e0 covers a covering that names an absent column. By F-2's answer, that sentence stays byte for byte and the architect's sentence is appended after it. Item 22, the sanity check, is unaffected.
- **Item 53's words, byte for byte from the architect's report, section 1, option (A):**

```
53. **A file whose `covering.bbox` path matches more than one name in the file, when the case of the letters A to Z is ignored, is refused when it is opened.**
    The app matches each part of a `covering.bbox` path to the file's column names, and to the names of the fields inside a column, without regard to the case of the letters A to Z. Where one part matches two or more names, such as `bbox` against columns named `bbox` and `BBOX`, the app refuses the open rather than choose one of them. It does so even when one of the names is spelled exactly as the path is, and even when another path of the same covering names a column the file does not contain. This refusal has the code `engine.geo_metadata` and names the path and every name that part of it matches. Only the covering's paths are checked this way: a file whose other columns have names that differ only in letter case is not refused by this check, and which of those columns the app reads is not established. Names that differ only in the case of a letter outside A to Z count as different names. A file whose covering has a path containing the character U+0000 still opens with that covering unusable, as before, whatever its other paths match.
    <!-- DRAFT wording for the human's sight, not the human's own wording (engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md, section 4); drafted by the architect under item 2e of state/directives/2026-10-11-direction-after-status-review.md. Authority: state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md, item 1. Where the code does this, at <commit> on the piece's branch: judge_covering and field_path_exists in engine/src/dataset.rs (the more-than-one-match refusal, after the unchanged U+0000 check and before the absence check); EngineError::GeoMetadata in engine/src/error.rs; error_of's existing arm in kernel/src/skp.rs; CC-1 and CC-2 in engine/tests/covering_case_collision.rs. The pins follow on main after the merge. Not covered, by item 2c: none. -->
```

- **Item 9's appended sentence, the architect's words byte for byte (its report, F-2), and its source comment (my draft words, not the human's).** Both go as two new lines directly after the human's comment at KNOWN-LIMITATIONS.md:115 @ ed2c89e0. Lines 114 and 115, and the v0.1.0 comment at KNOWN-LIMITATIONS.md:116 @ ed2c89e0, stay byte-identical, and line 115's "the sentence above" still names the human's sentence:

```
   If another path of that covering matches more than one name in the file, the file is refused when it is opened instead (item 53).
   <!-- the sentence above is the architect's wording, appended by the human's answer on F-2 (state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md, item 3; engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md, section 4); it describes main after this piece lands, not the v0.1.0 artifact the comment below pins; where the code does this: item 53's source comment -->
```

- **Line count (KNOWN-LIMITATIONS.md <= 7):** item 53 takes at most 5 (one separating blank line, the column-0 line when needed, and the three item lines). Item 9 takes 2.

---

## 5. Rule (00) at this main, against the four branches and #241, file by file

Rule (00) is at AUTONOMY.md:609 @ ed2c89e0. In progress at ed2c89e0 are: `b2-piece-1c-save-and-reopen` (PLAN.yaml:5347 @ ed2c89e0), `b1-shell-half`, PR A (PLAN.yaml:2358 @ ed2c89e0), `walkthrough-row-f7-cli-refusal`, #244 (PLAN.yaml:4519 @ ed2c89e0), `questions-mirror-item-count` (PLAN.yaml:3554 @ ed2c89e0), and `bundle-redaction-scan-not-in-product-publish`, #241 (PLAN.yaml:5433 @ ed2c89e0). port-2 is `ready` (PLAN.yaml:3415 @ ed2c89e0). session-log redaction is `blocked` (PLAN.yaml:5450 @ ed2c89e0).

**The four branches' paths, as their forms give them:**
- **1c.**
  - Its groups are §2.11 (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:441-490 @ ed2c89e0), with Amendment 1 item 6's per-group table (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:952-965 @ ed2c89e0).
  - Its §5 declares `engine/` unchanged (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:677 @ ed2c89e0).
  - Its records group is `kernel/README.md`, one KNOWN-LIMITATIONS group of its own items and a walkthrough Part (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:457 @ ed2c89e0).
  - Its Amendment 2 (N1 to N7 built) adds no path.
- **PR A.** `protocol/**`, `kernel/src/**`, `engine/**` and `src-tauri/**` are edited by no PR (frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:402 @ ed2c89e0). Its KNOWN-LIMITATIONS items are 51 and 52 (frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:794 @ ed2c89e0).
- **#244.**
  - It edits `frontends/shell/MANUAL-WALKTHROUGH.md`, Parts F and G (frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md:164-165 @ ed2c89e0, joined by its Amendment 3 item 1 at frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md:372 @ ed2c89e0), within at most 3 non-generated files (frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md:252 @ ed2c89e0).
  - It adds and edits no KNOWN-LIMITATIONS item (frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md:279 @ ed2c89e0).
- **questions-mirror.** It edits `scripts/hooks/questions-mirror.mjs` and its test only (scripts/hooks/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md:164-165 @ ed2c89e0).

**#241.** Its 24 files are listed at kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-748 @ ed2c89e0. Among them are `engine/src/fixture.rs` (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:734 @ ed2c89e0), `kernel/tests/typed_terminal_codes.rs` (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:732 @ ed2c89e0), `KNOWN-LIMITATIONS.md`, item 47 only (state/consults/2026-10-22-b1-shell-half-pr-a-re-sweep.md:162 @ ed2c89e0), and `engine/README.md`, ceiling 4 (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:748 @ ed2c89e0).

| this piece's file | 1c | PR A | #244 | questions-mirror | #241 | reading |
|---|---|---|---|---|---|---|
| `engine/src/dataset.rs` | `engine/` unchanged | `engine/**` unedited | no | no | not among its 24 | disjoint |
| `engine/tests/covering_case_collision.rs` (new) | no | no | no | no | no | disjoint |
| `KNOWN-LIMITATIONS.md`, item 53 | its own items, 48 to 50 | 51 and 52 | none | none | 47 | disjoint: separate items are separate paths (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:548 @ ed2c89e0) |
| `KNOWN-LIMITATIONS.md`, item 9's appended sentence | does not name item 9 | does not name item 9 | none | none | item 47 only | disjoint, by a search of the three forms for `item 9` (no edit found; the custodian confirms by script) |
| `engine/README.md` (owner's index) | `kernel/README.md` only | no | no | no | **shared** | OPEN-4 (A), below |
| this form | none | none | none | none | none | disjoint |
| `protocol/`, wire fixtures, Cargo.lock, package-lock.json | step 1 holds `protocol/` | no | no | no | no | this piece touches none, so there is no second `protocol/` piece |
| read only: `engine/src/fixture.rs` (`LV95_PROJJSON`) | calls `write_geoparquet` only | no | no | no | edits it | not an edit; a changed constant at the base is a stop |
| read only: `kernel/tests/typed_terminal_codes.rs` (named unchanged) | no | no | no | no | edits it | not an edit; the named test is read green at the base |

**#241's `engine/README.md` under OPEN-4 (A).** Code proceeds now. The owner's-index commit follows #241's merge, by merging main into the branch (a merge, never a rebase). The PR opens after it. This is 1c's R1 pattern (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:547 @ ed2c89e0; kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:991-992 @ ed2c89e0). The index rule asks for the update in the piece's own PR (engine/README.md:528 @ ed2c89e0), and (A) keeps it there.

**My reading: disjoint from 1c, PR A, #244 and questions-mirror on every file. Shared with #241 on `engine/README.md` only, sequenced by OPEN-4 (A). The piece can run in slot 2, interleaved, as the human's item 1 allows.** That reading is a draft. Rule (00)'s finding at dispatch is the custodian's.

---

## 6. OPEN items, as ruled (the human's message of 2026-10-23, item 3: state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md:10 @ ed2c89e0)

- **OPEN-1, the P0.** DuckDB's handling of two names that differ only by case is not established. The parent P0 did not cover it (engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md:300 @ ed2c89e0).
  - (A) Run the P0 after the form's commit and before code, and record it as a class-1 `Amendment:` line. This is the parent piece's pattern.
  - (B) Run the P0 before the form commits, and write the Change against its result.
  - (C) No P0: CC-1 and CC-2 discriminate at build time, and an unreachable refusal stops the worker.
  - Ruled: (A).
- **OPEN-2, the gate route.** §21c's bound is "no new user-visible behaviour" (AUTONOMY.md:350-351 @ ed2c89e0). A refused open with a new text crosses it.
  - (A) This five-line form, with the reviewer and the architect from dispatch. The TTL piece's Out-of-scope line took this route (frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md:10 @ ed2c89e0).
  - (B) A single reviewer, reading item 1 of the human's message as the one-line note §21c allows (AUTONOMY.md:354-355 @ ed2c89e0).
  - (C) The full form.
  - Ruled: (A), the five-line form with both gates.
- **OPEN-3, the KNOWN-LIMITATIONS place.**
  - (A) A new item, 53, in the on-main section.
  - (B) One sentence appended to item 9, as the parent piece did.
  - Ruled: (A), item 53.
- **OPEN-4, `engine/README.md` shared with #241.**
  - (A) Code proceeds now. The owner's-index commit follows #241's merge, by merging main into the branch, and the PR opens after it. This is 1c's R1 pattern (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:547 @ ed2c89e0).
  - (B) `engine/README.md` leaves Scope, and a later piece carries the index update. That breaks the index's same-PR rule (engine/README.md:528 @ ed2c89e0).
  - Ruled: (A).
- **OPEN-5, the refusal text's sight.** The detail in section 3 joins the human's sight list with the KNOWN-LIMITATIONS line, as one item. The custodian places it.
  - Ruled: yes.
- **F-2 (the architect's finding, the human's answer):** item 9's sentence stays and the architect's sentence is appended. The KNOWN-LIMITATIONS ceiling becomes <= 7, and the total follows.

---

## 7. What I could not settle

1. DuckDB's behaviour (H1, H2 or H3) and which column the binder reads today. The P0 decides both.
2. Whether "schema name" in the human's item 1 means the resident (DESCRIBE) names or the Parquet footer's names. The two differ only under H3.
3. Sibling risks I did not examine, which may need a PLAN node (the custodian's call):
   - `check_geometry_column` matches the geometry column by byte equality (engine/src/dataset.rs:1903 @ ed2c89e0), while DuckDB binds identifiers case-insensitively;
   - the identity column;
   - projected and filter columns, with names that differ only by case.
4. I did not inspect the corpus files' column names, which are binary. The full suite and the P4 generator are the check.
5. Budget risk. 140 code-and-test lines leave 10 lines under §21c's 150. Counted over every non-form line, the total is 150, with no headroom. The parent piece overran its budget by 22%. With both gates from dispatch (OPEN-2 (A)), §21c's threshold no longer decides the route. An overrun is still class 6, and past 150 §21b's clause applies.

The owner's-index lines for the merge (task 3) are written after the merge, against the merged tree: Last verified at, the preregistrations list (this form), and Declared limits (53).

---

## Changed lines against the draft

All draft line numbers are in state/consults/2026-10-23-covering-case-collision-binds-other-column-lead-data-draft.md @ ed2c89e0.

- **Every cite (draft lines 16 to 160):** re-pinned from `@ 2ffbf957` to `@ ed2c89e0`, per the brief's cite rule. Each one was re-read at ed2c89e0 and holds the same text. No other change rides on this.
- **Draft line 13 (header):** "Drafted by lead-data at main 2ffbf957" becomes "Drafted by lead-data at main 2ffbf957 and revised at main ed2c89e0 with the human's rulings … and the architect's findings F-1 to F-5". Source: the brief.
- **Draft line 16 (Authority):** adds the ruling of item 3 (…findings-graded.md:10) and the architect's words consult. Source: the brief's rulings.
- **Draft line 17 (Scope):**
  - The KNOWN-LIMITATIONS entry now names item 53 by OPEN-3 (A) (F-5) and item 9's appended sentence with its source comment, and its ceiling goes from `<= 4` to `<= 7` (F-2).
  - The total goes from `<= 147` to `<= 150` (F-2).
  - The §21c count clause is new (F-2).
  - "its number set at the base by search" is dropped, because the human fixed 53.
- **Draft line 18 (Change):**
  - "its detail a P6 placeholder naming" becomes "its detail naming …, in the words the human sights before merge under OPEN-5" (F-4).
  - The last clause is the architect's F-1 words, byte for byte (F-1).
- **Draft line 19 (Tests+mutation):**
  - CC-1's and CC-2's contains-assertions become whole-Display assert_eq, against C-1's precedent (F-3).
  - CC-2's covering declares ymax as the absent `bbox.zmax` (F-3).
  - New mutation M3 (F-3).
  - "fails it by name" becomes "fails CC-n by name", and the leaves-green clauses are made explicit for each mutation (F-3, each mutation fails its own test).
  - "running the named test" becomes "running its own test" (F-3).
- **Draft line 20 (Out-of-scope):**
  - The Guarantee clause now names item 9's narrowed sentence (F-2).
  - "with its covering kept" becomes "with its covering kept or dropped" (F-1's case; my addition, disclosed).
  - "the gate route is OPEN-2" becomes "the gate route is OPEN-2 (A), this five-line form with both gates, the reviewer and the architect, from dispatch" (the ruling).
- **Draft line 27 (§0 heading):** the main commit becomes ed2c89e0. F1 to F7 are otherwise unchanged.
- **Draft line 76 (Block-on-sight 7):** now reads "A KNOWN-LIMITATIONS text or a refusal detail other than the words the human sighted (OPEN-5)" (F-4, OPEN-5).
- **Draft line 84 (§3 Text):** "a P6 placeholder, not a quotation" becomes "for the human's sight before merge (OPEN-5), not a quotation", plus the no-marker reason and the change-at-sight sentence (F-4).
- **Draft line 86 (§3 first sub-bullet):** replaced by the architect's words, byte for byte.
- **New after draft line 88 (§3):** the two whole Display texts CC-1 and CC-2 assert (F-3).
- **Draft line 93 (§3 order):** adds "CC-2 (its absent `bbox.zmax`) and M3 prove it" (F-3).
- **Draft lines 97 to 112 (§4):**
  - The heading gains item 9.
  - The number is "53, by the human's OPEN-3 (A)", with a stop if 53 is held at the base, replacing "becomes 54", and the column-0 line from the architect's report (OPEN-3 (A)).
  - The "Nearest item" bullet: "OPEN-3 offers a sentence in item 9 instead" becomes F-2's answer.
  - The words slot becomes item 53 in the architect's option (A) words, byte for byte.
  - New: item 9's appended sentence (the architect's, byte for byte), its source comment (mine), their placement, and the line count (F-2).
- **Draft lines 116 to 136 (§5):** rewritten as rule (00) read again at ed2c89e0 (brief item 7).
  - The in-progress list is taken from PLAN.yaml.
  - #244's paths are corrected from "Part F only" to Parts F and G, per its form's lines 164-165 and Amendment 3 item 1.
  - #241's `kernel/tests/typed_terminal_codes.rs` is added as a read-only contact.
  - The item 9 row is added.
  - OPEN-4 (A)'s sequence is stated as ruled.
  - The reading is unchanged: disjoint, slot 2.
- **Draft lines 140 to 160 (§6):** the heading becomes "as ruled", with a "Ruled:" line under each item. My recommendation lines ("I recommend …") are removed, and the F-2 line is added. The option texts are otherwise unchanged.
- **Draft line 173 (§7 item 5):** the budget risk is restated for the 150 total (F-2's totals).
- **Draft lines 177 to 182 (closing lines):** replaced by this report's closing lines.

## Anything I could not settle in this revision

1. **F-4, which branch I took, and why: the detail drops the word "placeholder" and is sighted before merge.** OPEN-5 is ruled yes, so the human sights the detail with item 53 before the PR merges. A sighted text that ships is not a placeholder, and the existing covering details carry no marker. A `[P6 placeholder] ` prefix would also put a marker into the assert_eq texts that the sight would then remove. The cost: the PR cannot merge until the sight is given. The custodian places the sight.
2. **The architect's optional wording for the detail** ("when the case of the letters A to Z is ignored" in place of "when ASCII letter case is ignored") is not applied, because the brief did not list it. It is the human's choice at the OPEN-5 sight. If chosen, both asserted texts change with it.
3. **Item 53's source comment** opens "DRAFT wording for the human's sight". After the sight, that clause is restated as sighted on the same line, inside the 7-line ceiling. Item 9's appended sentence names "(item 53)". If the number ever moved, that reference moves too, but under section 4 the piece stops rather than renumber.
4. **Item 9's placement.** I placed the appended sentence on its own line after the human's comment at KNOWN-LIMITATIONS.md:115, not at the end of line 114. That keeps line 114 and line 115's "the sentence above" byte-true and keeps the count at 2 lines. It renders as a second paragraph of item 9. Appending to line 114 itself would count 3 lines and could breach 7 with the column-0 line.
5. **CC-2's absent path is ymax, after the ambiguous xmin.** M3 (absence first over all four paths) fails CC-2. A per-path walk that judges ambiguity-or-absence path by path in xmin-to-ymax order would also pass CC-2. The Change and section 3 state the all-paths order. A stronger test would put the ambiguous path last, but that redesigns CC-2's collision, which the brief did not ask for. The gate may weigh this.
6. **Sibling risks (§7 item 3)** now have a node, `engine-column-name-case-siblings` (PLAN.yaml:5819 @ ed2c89e0, the human's item 7 of the ruling). I left §7's text unchanged.

Result: five-line form revised at ed2c89e0 with F-1 to F-5 and the rulings applied; item 53 and item 9's appended sentence in the architect's words; rule (00) disjoint from 1c, PR A, #244 and questions-mirror, `engine/README.md` sequenced after #241 by OPEN-4 (A).
Blocking: none.
Report path: C:/dev/spatial-ide/state/consults/2026-10-23-covering-case-collision-binds-other-column-lead-data-revised-draft.md
sha256: not computed (no shell; the custodian hashes the filed bytes).
