*Custodian's filing note (2026-10-23): the five-line form for `covering-case-collision-binds-other-column`, drafted by lead-data in place of the architect's drafting consult, read only at main 2ffbf957; main moved after it only in records. Its KNOWN-LIMITATIONS words are left as the architect's slot, written next. Nothing is committed from it before the human answers OPEN-1 to OPEN-5. Its sibling risks (its "What I could not settle", item 3) are recorded as one proposed node. The run 08:52:05Z to 09:00:45Z by its transcript (Grep 30, Read 25; no Write, Edit or Bash). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is e01f8750fa0755cabbf9047f7b9c9ac799d0ea6dcde1c95928b1a36e12d02074.*

---

Drafted: covering-case-collision-binds-other-column, at main 2ffbf957

I read the main checkout at 2ffbf957 and have no shell, so this report carries no sha256. The custodian pins every `@ 2ffbf957` cite by script before commit. Form path proposed: `engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md`.

---

## 1. The five-line form

*Header (for the form): Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line. Drafted by lead-data at main 2ffbf957, in place of the architect's drafting consult. Before code: the P0 below, then its result recorded as a class-1 `Amendment:` line (OPEN-1 (A)). The custodian keeps the PLAN node on main. The branch carries no PLAN file and no generated file.*

```
Authority: PLAN node covering-case-collision-binds-other-column (PLAN.yaml:4262 @ 2ffbf957; its summary, PLAN.yaml:4277 @ 2ffbf957), graded S1 and directed as a five-line form by the human's message of 2026-10-23, item 1 (state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:8 @ 2ffbf957); its origin, the covering-names-missing-column form's Amendment 1 items 4 and 5 (engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md:299-300 @ 2ffbf957) and Amendment 2 item 4 (engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md:313 @ 2ffbf957); the machine rules (state/directives/2026-10-06-machine-script-adopted.md) for every heavy run. Reuse index: node tools/reuse.mjs in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for covering column case insensitive, `No prior art recorded for "covering column case insensitive". Research it before planning an implementation.` and, for schema name collision, `No prior art recorded for "schema name collision". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: engine/src/dataset.rs (judge_covering and field_path_exists, engine/src/dataset.rs:1421-1472 @ 2ffbf957, with their doc comments, and the one call site at engine/src/dataset.rs:436 @ 2ffbf957 taking the new Result; <= 50); engine/tests/covering_case_collision.rs (new: one in-test writer built on the crate's own arrow and parquet dependencies, engine/Cargo.toml:23 @ 2ffbf957 and engine/Cargo.toml:44 @ 2ffbf957, with spatial_engine::fixture::LV95_PROJJSON, engine/src/fixture.rs:45 @ 2ffbf957, and spatial_engine::wkb::encode_polygon, engine/src/wkb.rs:593 @ 2ffbf957; CC-1 and CC-2; <= 90); KNOWN-LIMITATIONS.md (one new item, its number set at the base by search, and its source comment; <= 4); engine/README.md (Owner's index only: Last verified at, the preregistrations-in-this-module list, Declared limits; <= 3); this form; 4 files besides this form; declared line budget <= 147 changed lines (insertions plus deletions, this form excluded), of which code and tests <= 140 by §21c's counting rule, counted by git diff --numstat origin/main...HEAD -- . ':(exclude)engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md' with columns 1 and 2 summed, and per file by the same command with the file's path; engine/src/fixture.rs is not edited; no PLAN or generated file on the branch.
Change: After the unchanged U+0000 check and before absence is judged, judge_covering walks all four declared paths with the existing ASCII case-insensitive segment comparison, and where a segment equals more than one name at its level of the resident schema, it refuses the open with the existing EngineError::GeoMetadata (wire code engine.geo_metadata, no fields, through error_of's existing arm at kernel/src/skp.rs:2118 @ 2ffbf957), its detail a P6 placeholder naming the declared path and every matched name (section 3 below), returned at the call site before sanity_check, the identity scan and the descriptor, as check_geometry_column's refusal at engine/src/dataset.rs:429 @ 2ffbf957 already is; a covering with exactly one match at every level, a U+0000 covering and a covering naming an absent column keep today's outcomes and texts byte for byte.
Tests+mutation: P0 first, before any code (OPEN-1 (A); rows and selection rule in section 2 below), its result one class-1 Amendment line; new CC-1 `a_covering_whose_column_name_matches_two_schema_names_by_case_refuses_the_open_by_name` (top level: `bbox` and `BBOX` structs, the second written 1,000,000 m east, covering declared `bbox`; Dataset::open is Err(EngineError::GeoMetadata(d)), d contains `bbox.xmin`, `bbox` and `BBOX`, and contains neither `U+0000` nor `does not contain`), mutation M1, the more-than-one arm removed at the top level only so the first match is taken as `.find` takes it today, fails it by name; new CC-2 `a_covering_whose_child_name_matches_two_struct_children_by_case_refuses_the_open_by_name` (one `bbox` struct with children xmin, XMIN (offset), ymin, xmax, ymax; covering declared `bbox.xmin`; the same assertions with `bbox.xmin` and `bbox.XMIN`), mutation M2, the more-than-one arm applied at the top level only, fails it by name and leaves CC-1 green; each mutation is observed by applying it alone at the final code commit, running the named test, recording its failure by name with that commit id, and reverting it (round 25, item 2 (c)); unchanged and green without edit: C-1 to C-5 in engine/tests/covering_names_missing_column.rs (C-3's row d, a single `bbox` declared `BBOX`, still opens with its covering kept: engine/tests/covering_names_missing_column.rs:219 @ 2ffbf957), K-1 in kernel/tests/skp_projection.rs, N-13 and N-14 in engine/tests/b1_projection_hostile_covering.rs, kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case, and the whole workspace suite.
Out-of-scope: ADR: not touched, and no ADR is cited as changed. Security (what ADR-020, ADR-009 or ADR-021 governs): not touched. Wire: not touched: no SKP message, literal, field or code is added; the refusal travels as the existing engine.geo_metadata through the existing arm; protocol/, kernel/ and frontends/ have empty diffs and SKP-V0.md is not edited. Guarantee: no stated guarantee and no property under test changes; the tests named unchanged above stay green without edit, and any existing test or corpus row that moves stops the piece. §21c's "no new user-visible behaviour" is crossed: a file that opens today with its covering kept is refused at open, with a new detail text; the gate route is OPEN-2. No dependency, no exposure surface, no new pub item, no new EngineError variant, no constant.
```

---

## 2. Supporting sections (beneath the five lines)

### §0. The code as read (main 2ffbf957)

- **F1. The walk takes the first match.** `field_path_exists` compares each segment with ASCII case-insensitive equality and takes the first hit, at the top level (`.find(|f| f.name().eq_ignore_ascii_case(first))`, engine/src/dataset.rs:1454 @ 2ffbf957) and at each child (engine/src/dataset.rs:1465 @ 2ffbf957). Whole function: engine/src/dataset.rs:1446-1472 @ 2ffbf957. Its doc comment states the P0's rule (engine/src/dataset.rs:1439-1445 @ 2ffbf957).
- **F2. The one decision.** `judge_covering` runs the U+0000 check first, then looks for absence in xmin, ymin, xmax, ymax order (engine/src/dataset.rs:1421-1437 @ 2ffbf957). It returns `Option<CoveringFinding>` (engine/src/dataset.rs:1393-1399 @ 2ffbf957). It has one caller, at engine/src/dataset.rs:436 @ 2ffbf957, after `probe_schema` and `check_geometry_column` (engine/src/dataset.rs:428-429 @ 2ffbf957) and before `sanity_check` (engine/src/dataset.rs:524-532 @ 2ffbf957), the identity scan (engine/src/dataset.rs:558 @ 2ffbf957) and the descriptor (engine/src/dataset.rs:565 @ 2ffbf957).
- **F3. The texts that stay unchanged.** The U+0000 reason is at engine/src/dataset.rs:1384-1388 @ 2ffbf957 and the Absent detail at engine/src/dataset.rs:1407-1410 @ 2ffbf957. Where the covering is stored or dropped: engine/src/dataset.rs:582-587 @ 2ffbf957.
- **F4. The resident schema.** It carries DESCRIBE's bound names. Where an Arrow-export name differs, it is kept as `spatial.exported_name` metadata (engine/src/dataset.rs:1101-1164 @ 2ffbf957). The check reads these resident names. Whether two names differing only by case reach the resident schema at all is the P0's question.
- **F5. The code family.** `GeoMetadata(String)` is at engine/src/error.rs:101 @ 2ffbf957 and its Display, `"geo metadata: {d}"`, at engine/src/error.rs:340 @ 2ffbf957. The wire arm `EngineError::GeoMetadata(_) => ("geo_metadata", vec![]),` is at kernel/src/skp.rs:2118 @ 2ffbf957. So the SKP refusal is code `engine.geo_metadata`, no structured fields, and the Display text as its message.
- **F6. `parse_covering`** accepts any non-empty path of strings and judges nothing against the schema (engine/src/geoparquet.rs:624-648 @ 2ffbf957). It is not edited.
- **F7. Why the test writes its own file.** `write_hostile_covering` writes exactly one struct with four children (engine/src/fixture.rs:1688-1693 @ 2ffbf957). It cannot build either collision. An in-test writer avoids editing `engine/src/fixture.rs`, which #241 edits.

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
7. A KNOWN-LIMITATIONS text other than the architect's words as sighted.
8. A size overrun, which is class 6. Past 150 lines, §21b's mid-piece clause applies.

---

## 3. The refusal's code and text

- **Code:** `engine.geo_metadata` (existing; F5).
- **Text.** These are the drafted words, a P6 placeholder, not a quotation. The Display is `geo metadata: ` followed by the detail:
  `the covering names `<declared path>`, which matches more than one name in the file's schema when ASCII letter case is ignored: `<match>`, `<match>``
  - `<declared path>` is the declared segments joined by `.`.
  - Each `<match>` is that match's schema path down to the colliding level, in schema order. CC-1 gives `bbox`, `BBOX`; CC-2 gives `bbox.xmin`, `bbox.XMIN`.
  - Every path is rendered through `render_visible_escape`, as the existing details are.
- **Order of the checks.**
  - U+0000 first, unchanged. Such a file still opens with its covering dropped.
  - Then ambiguity, over all four paths.
  - Then absence.
  - So a file with one absent path and one ambiguous path is refused, never opened with its covering dropped. This follows the human's rule as written.

---

## 4. The KNOWN-LIMITATIONS item

- **Number: 53, as claims stand at main.**
  - At 2ffbf957 the items run 1 to 46. The last is item 46, at KNOWN-LIMITATIONS.md:407 @ 2ffbf957.
  - Item 47 is #241's (state/consults/2026-10-22-b1-shell-half-pr-a-re-sweep.md:162 @ 2ffbf957).
  - Items 48 to 50 are 1c's K-2 to K-4, "at the next free numbers after the redaction scan's item" (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:513-517 @ 2ffbf957).
  - Items 51 and 52 are PR A's KL-4 and KL-7 (frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:794 @ 2ffbf957).
  - The number is set at the piece's base by search, as 1c's records are. If 1c's withdrawn K-1 keeps a number, PR A moves to 52 and 53 (state/consults/2026-10-22-b1-shell-half-pr-a-re-sweep.md:166 @ 2ffbf957), and this item becomes 54.
- **Place:** the section "On main since v0.1.0 — not in any release yet" (KNOWN-LIMITATIONS.md:200 @ 2ffbf957), at the end of the file after the highest item present at the base. The behaviour exists on main only.
- **Nearest item:** item 9 (KNOWN-LIMITATIONS.md:109-116 @ 2ffbf957). Its sentence at KNOWN-LIMITATIONS.md:114 @ 2ffbf957 covers a covering that names an absent column. Item 22, the sanity check, is unaffected. OPEN-3 offers a sentence in item 9 instead.
- **Words:**

```
53. **<SLOT: the architect's words, for the human's sight>**
    <!-- source comment: the human's message of 2026-10-23, item 1; this form; the refusal at judge_covering in engine/src/dataset.rs, named on the branch by symbol and commit until merge -->
```

---

## 5. Rule (00) against piece 1c's groups, file by file

1c's groups are §2.11 (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:441-490 @ 2ffbf957), with Amendment 1 item 6's per-group table (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:952-965 @ 2ffbf957). Its §5 declares `engine/` unchanged (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:677 @ 2ffbf957).

| this piece's file | 1c | reading |
|---|---|---|
| `engine/src/dataset.rs` | no group names it; `engine/` declared unchanged | disjoint |
| `engine/tests/covering_case_collision.rs` (new) | none | disjoint |
| `KNOWN-LIMITATIONS.md`, item 53 | its records group holds its own items, 48 to 50 (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:457 @ 2ffbf957); separate items are separate paths (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:548 @ 2ffbf957) | disjoint |
| `engine/README.md` (owner's index) | its records group is `kernel/README.md` only | disjoint from 1c |
| this form | none | disjoint |
| `protocol/`, wire fixtures, Cargo.lock, package-lock.json | step 1 holds `protocol/`; this piece touches none | no second `protocol/` piece |
| interface contact | 1c's F1 comes from `write_geoparquet`, which writes no colliding names, and `Dataset::open_cancellable`'s signature is unchanged | not a 1c I1 |

**My reading: disjoint from 1c on every file. The piece can run in slot 2, interleaved.**

The other pieces in flight, because (00) counts PRs awaiting merge (AUTONOMY.md:609 @ 2ffbf957):
- **#241 shares `engine/README.md`.** Its ceiling is 4 (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:748 @ 2ffbf957). It also edits `engine/src/fixture.rs` (kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:734 @ 2ffbf957), which this piece only reads for `LV95_PROJJSON`; a changed constant at the base would be a stop. This is OPEN-4.
- **PR A** edits nothing under `engine/` (frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:402 @ 2ffbf957). Its KNOWN-LIMITATIONS items 51 and 52 are separate. Disjoint.
- **#244** adds no KNOWN-LIMITATIONS item and edits Part F only (frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md:279 @ 2ffbf957). Disjoint.
- **questions-mirror-item-count** touches `scripts/hooks/questions-mirror.mjs` and its test only (scripts/hooks/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md:164-165 @ 2ffbf957). Disjoint.

---

## 6. OPEN items (my recommendation each; none is my decision)

- **OPEN-1, the P0.** DuckDB's handling of two names that differ only by case is not established. The parent P0 did not cover it (engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md:300 @ 2ffbf957).
  - (A) Run the P0 after the form's commit and before code, and record it as a class-1 `Amendment:` line. This is the parent piece's pattern.
  - (B) Run the P0 before the form commits, and write the Change against its result.
  - (C) No P0: CC-1 and CC-2 discriminate at build time, and an unreachable refusal stops the worker.
  - I recommend (A). Under H2 or H3 the Change is wrong, and (C) would spend a dispatch finding that out.
- **OPEN-2, the gate route.** §21c's bound is "no new user-visible behaviour" (AUTONOMY.md:350-351 @ 2ffbf957). A refused open with a new text crosses it.
  - (A) This five-line form, with the reviewer and the architect from dispatch. The TTL piece's Out-of-scope line took this route (frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md:10 @ 2ffbf957).
  - (B) A single reviewer, reading item 1 of the human's message as the one-line note §21c allows (AUTONOMY.md:354-355 @ 2ffbf957).
  - (C) The full form.
  - I recommend (A): an admission refusal is the architect's to read. If the route sets §21c or round 25, item 2 (e) aside, that is the human's call.
- **OPEN-3, the KNOWN-LIMITATIONS place.**
  - (A) A new item, 53, in the on-main section.
  - (B) One sentence appended to item 9, as the parent piece did.
  - I recommend (A). The file's own header puts post-v0.1.0 behaviour in that section, and the human's word was "a line".
- **OPEN-4, `engine/README.md` shared with #241.**
  - (A) Code proceeds now. The owner's-index commit follows #241's merge, by merging main into the branch, and the PR opens after it. This is 1c's R1 pattern (kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:547 @ 2ffbf957).
  - (B) `engine/README.md` leaves Scope, and a later piece carries the index update. That breaks the index's same-PR rule (engine/README.md:528 @ 2ffbf957).
  - I recommend (A). Whether (A) satisfies (00)'s "before starting any piece" is the custodian's reading.
- **OPEN-5, the refusal text's sight.** I recommend that the detail in section 3 join the human's sight list with the KNOWN-LIMITATIONS line, as one item. The custodian places it.

---

## 7. What I could not settle

1. DuckDB's behaviour (H1, H2 or H3) and which column the binder reads today. The P0 decides both.
2. Whether "schema name" in the human's item 1 means the resident (DESCRIBE) names or the Parquet footer's names. The two differ only under H3.
3. Sibling risks I did not examine, which may need a PLAN node (the custodian's call):
   - `check_geometry_column` matches the geometry column by byte equality (engine/src/dataset.rs:1903 @ 2ffbf957), while DuckDB binds identifiers case-insensitively;
   - the identity column;
   - projected and filter columns, with names that differ only by case.
4. I did not inspect the corpus files' column names, which are binary. The full suite and the P4 generator are the check.
5. Budget risk. 140 of 150 code-and-test lines leaves 10 lines of headroom, and the parent piece overran its budget by 22%. An overrun is class 6, and past 150 §21b's clause closes the single-gate route.

The owner's-index lines for the merge (task 3) are written after the merge, against the merged tree: Last verified at, the preregistrations list (this form), and Declared limits (53).

Result: five-line form drafted; rule (00) finds it disjoint from all of piece 1c's groups (slot 2, interleaved); KNOWN-LIMITATIONS item 53, words left as the architect's slot.
Blocking: OPEN-1, whether the P0 runs before code (DuckDB's handling of names differing only by case is unknown, and the Change holds only under H1).
Blocking: OPEN-2, the gate route, because the change crosses §21c's no-new-user-visible-behaviour bound.
Blocking: OPEN-4, `engine/README.md` shared with #241, which is awaiting merge.
Report path: C:/dev/spatial-ide/state/consults/2026-10-23-covering-case-collision-binds-other-column-lead-data-draft.md
sha256: not computed (no shell; the custodian hashes the filed bytes).
