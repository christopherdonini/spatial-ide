# Impact read — crs-undeclared-message-wording (lead-data, second pilot, resumed)
Read at: main 2301eb36; the re-aim branch at ef1cc519 where named

How the branch was read: I had no shell in this run, so I did not run `git show ef1cc519:<path>`. I read the branch's worktree checkout, which is outside the repository. Its HEAD is the ref `cut/e2e-stale-expectations-reaim`, and that ref holds ef1cc519c913a2bbc5d28a86530c579fae0f3ed6 (read from the git ref files). I did not check that checkout for uncommitted changes. Every branch pointer below therefore rests on that checkout, and it should be re-read with `git show` before the form relies on it.

Scope by pointer: the PLAN node is PLAN.yaml:4477-4492, with its dependencies at PLAN.yaml:4484. The human's wording is state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:33, the piece's scope is :34, and its slot order is :36. The pilot's terms are state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:7-15.

## 1. The interface

- **Authoritative source.** The `Display` arm is at engine/src/error.rs:282-286, and the variant at engine/src/error.rs:30. The variant's own doc comment, engine/src/error.rs:17-29, says which files still reach the refusal. At :27-29 it says the old sentence was kept verbatim because the walkthrough and an SKP fixture quote it.
- **Where the refusal is raised on main.** There are two raise sites, each with its own `detail`:
  - engine/src/crs.rs:286-288: a `crs` key that is explicitly null. A non-object, non-null value is parsed the same way at engine/src/geoparquet.rs:450.
  - engine/src/dataset.rs:398-403: an absent key under an unpinned `geo.version`. Its detail is minted at engine/src/geoparquet.rs:574-578.
  - The pinned versions are listed at engine/src/geoparquet.rs:37 and compared at engine/src/geoparquet.rs:509.
- **Where it reaches the wire.** `error_of` sets the message from `to_string()` (kernel/src/skp.rs:2041-2047). `terminal_detail_of` prefixes the code to the same text (kernel/src/skp.rs:2034-2036). SKP-V0 says `message` is `Display` verbatim (protocol/skp/SKP-V0.md:325-326).
- **Consumers in other modules.** The shell shows the message verbatim (frontends/shell/src/admission/RefusalBlock.tsx:29). It chooses the CRS form by code, not by text (frontends/shell/src/admission/AdmissionPanel.tsx:26). On the protocol side, `SkpError` is round-tripped through the fixture below.
- **Tests that assert the text by full match:**
  - `frontends/shell/e2e/regression.mjs`, `stepRefusal` (:2340), which compares the outcome at :2345 and the panel text at :2362. It is called for B2'/B3' with `CRS_UNDECLARED_MESSAGE` (:2628). The constant is at :89-92.
  - `frontends/shell/e2e/admission-remediation.mjs`, steps ASSERT' (:214-216) and NOPERSIST' (:657-659), against `CRS_UNDECLARED_MESSAGE` (:70-73).
  - frontends/shell/src/admission/formatRefusal.test.ts, test `carries the message verbatim -- the refusal UX IS this text` (:51-55), over the synthetic fixture `crsUndeclared()` (:24-32). Note that this test compares the shell's output with its own synthetic input. It never compares against engine output.
- **Tests that assert it by prefix or substring:**
  - frontends/shell/src/admission/admitDataset.test.ts, test `a typed refusal at open_dataset never reaches describe, and is returned, not thrown` (:97-113). It mocks a first-clause-only message (:100) and asserts the message is passed through unchanged (:112).
  - frontends/shell/src/skp/__tests__/fixtures.test.ts, test `a typed engine refusal crosses with its code, verbatim message, and named fields` (:466-474). It asserts that the fixture message contains `OGC:CRS84` (:472).
  - protocol/data-plane/tests/candidate_a.rs, `a_source_refusal_reaches_the_consumer_as_a_typed_terminal` (:661-684). It has a synthetic prefix string (:668) and a substring assertion (:677-680).
  - protocol/skp/tests/fixtures.rs, `error_fixture_round_trips` (:380-383). This is a round-trip of shape only, with no text assertion.
- **Tests that pin the variant, code or detail but not the text.** These are listed so the form can see they do not move with the text:
  - engine/src/crs.rs:332-336 (`an_undeclared_crs_with_no_assertion_is_refused`);
  - engine/tests/slice.rs:216 (`an_absent_crs_key_and_an_explicit_null_are_two_different_outcomes`, whose match is at :244);
  - engine/tests/admission_format_semantics.rs:196 (`f3_an_explicit_null_crs_is_unchanged_and_still_needs_an_assertion`), :362-387 (`an_unpinned_spec_version_takes_no_format_rule_and_the_refusal_names_the_version`) and :806-836;
  - engine/tests/admission_p4_corpus.rs:174 and :396;
  - kernel/src/skp.rs:2612-2618 (`every_engine_error_variant_maps_to_a_distinct_engine_dot_code`).
  - No engine or kernel test asserts the `Display` text itself (see question 5).
- **The fixture the e2e full-match steps open.** `no-crs-refused.parquet` is written with an explicit null by kernel/tests/manual_walkthrough_fixtures.rs:143-166. That gives the crs.rs:287 detail, which is the detail inside both e2e constants.

## 2. Every place that quotes the current message

The search used fragments of the message (`none was asserted`, `declares no CRS`, `does not apply GeoParquet`, `OGC:CRS84 default`, `no silent conversion)`) over the whole tree, then the code name `crs_undeclared`.

| Place | Main 2301eb36 | Re-aim branch ef1cc519 | Class |
|---|---|---|---|
| engine/src/error.rs (the source) | :284-285 | `engine/src/error.rs` (`:284-285` at ef1cc519) | the source itself |
| e2e constant, regression.mjs | frontends/shell/e2e/regression.mjs:89-92; asserted at :2345, :2362; call at :2628 | `frontends/shell/e2e/regression.mjs` (`:94-97`; asserted `:2351`, `:2368`; call `:2670` at ef1cc519) | a test or e2e constant that asserts it |
| e2e constant, admission-remediation.mjs | frontends/shell/e2e/admission-remediation.mjs:70-73; asserted at :214-216, :657-659 | `frontends/shell/e2e/admission-remediation.mjs` (`:74-77`; asserted `:220-221`, `:708-709` at ef1cc519) | a test or e2e constant that asserts it |
| formatRefusal.test.ts | frontends/shell/src/admission/formatRefusal.test.ts:28-29 | same lines at ef1cc519 (`:28-29`) | a test that asserts it. Its detail, a missing `crs` key, is produced by neither detail source on main (engine/src/crs.rs:287, engine/src/geoparquet.rs:574-578) |
| admitDataset.test.ts | frontends/shell/src/admission/admitDataset.test.ts:100 | `:100` at ef1cc519 | a test that quotes the first clause only, mocked; not in PLAN.yaml:4492's list |
| SKP fixture | protocol/skp/tests/data/v0-error-example.json:3 | `:3` at ef1cc519 | something else: a protocol fixture, asserted only by a substring (fixtures.test.ts:472) and a round-trip (protocol/skp/tests/fixtures.rs:382). The open question at PLAN.yaml:4492 |
| data-plane test | protocol/data-plane/tests/candidate_a.rs:668 | `:668` at ef1cc519 | something else: a synthetic prefix inside a protocol/ test; its assertion (:678) is a substring; not in PLAN.yaml:4492's list |
| Walkthrough row B2 | frontends/shell/MANUAL-WALKTHROUGH.md:176 | `frontends/shell/MANUAL-WALKTHROUGH.md` (`:176` at ef1cc519, byte-identical row) | a walkthrough row (Part B) |
| Coverage row B2'/B3' | frontends/shell/MANUAL-WALKTHROUGH.md:92 | `:92` at ef1cc519 | something else: says the verbatim message without quoting it; its prose names the CRS84 default |
| Rows I1, ASSERT', NOPERSIST', N4 | frontends/shell/MANUAL-WALKTHROUGH.md:584, :608, :617, :947 | same lines at ef1cc519 | something else: these rows refer to B2's quote without quoting it. N4 cites error.rs lines 248 to 252, which at main hold other code (the arm is at :282-286) |
| KNOWN-LIMITATIONS item 2 | KNOWN-LIMITATIONS.md:43-50 (quote at :45-48) | `KNOWN-LIMITATIONS.md` (`:46-47` at ef1cc519) | a record the human excluded. Its comment line :50 cites error.rs lines 176 to 179, which at main hold other code |
| ADMISSION-RESULTS | engine/ADMISSION-RESULTS.md:13, :33 | same lines at ef1cc519 | a record the human excluded |
| e2e pointer comments | frontends/shell/e2e/regression.mjs:86-88; frontends/shell/e2e/admission-remediation.mjs:67-69 | `:91-93`, `:71-73` at ef1cc519 | something else: comments saying each constant is verbatim from error.rs |
| error.rs doc comment | engine/src/error.rs:27-29 | `:27-29` at ef1cc519 | something else: in the piece's own file, it states why the old text was kept |
| Sweep and directive records | state/consults/DRIFT-SWEEP-AREA-E-2026-10-10.md:60; state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:133; state/directives/2026-10-10-drift-sweep-area-e-instructions.md:12 | — | something else: records under state/ |

- **The v0.1.0 notes.** RELEASE-0.1.md does not quote the message: a search for the fragments, `CRS84` and `crs_undeclared` finds nothing. KNOWN-LIMITATIONS.md is headed as the v0.1.0 declaration (KNOWN-LIMITATIONS.md:1).
- **Name the code but do not quote the text:**
  - QUICKSTART.md:33;
  - frontends/shell/MANUAL-WALKTHROUGH.md:143 and :1637;
  - frontends/shell/CANCELLATION-FACTS.md:99, which names the fixture;
  - engine/GEOMETRY-POINTS-PREREGISTRATION.md:337;
  - the shell tests that use the code with stub messages: frontends/shell/src/App.test.ts:127 and frontends/shell/src/admission/AdmissionPanel.test.ts.
- **Outside main's tree.** A stale worktree copy under `.claude/worktrees/` also quotes the text. It is not main's tree and is not a target.

## 3. What governs it

- **docs/05's no-silent-conversion rule.** It is docs/05_Data_Engine.md:22-25. The pipeline-pinning section names it as the rule above at docs/05_Data_Engine.md:35-36. The principle it applies is docs/01_Principles.md:14, with the derived rule at docs/01_Principles.md:21.
- **ADR-015.** Its status is Accepted, 2026-08-05, and it is architect-blockable (docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:3-4).
  - Decision table row: :41.
  - §2, the refusal and the default not applied: :46-47.
  - Amendment 1 is headed as Accepted, 2026-09-23 (:155). Its item 3 narrows §2's second sentence for the absent key (:173-178), and its item 4 applies the pinned-rule condition (:180-184).
- **ADR-032.** Its status is Accepted, 2026-09-23 (docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5). Decisions 1, 2 and 6 are at :25, :26 and :30.
- **ADR-026.** Its status is Accepted, 2026-09-02 (docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:3). It is the assertion route that a refused file is sent to.
- **Preregistrations:**
  - engine/ADMISSION-PREREGISTRATION.md:50 (R-C1, the unpinned-version case that refuses under this variant) and :52 (R-C3, explicit null unchanged);
  - its §12d, :232-234 (the four new user-visible strings sighted at P6), which error.rs:29 names as the string pass;
  - engine/GEOMETRY-POINTS-PREREGISTRATION.md:337 (corpus #2 predicted refused by this code).
  - **Missing:** I found no preregistration in the tree that introduced the current text. ADR-015:5-7 says the engine's first cut implemented the policy before acceptance.
- **SKP-V0.md:**
  - §5, the error taxonomy: protocol/skp/SKP-V0.md:319-336. The message is `Display` verbatim at :325-326, and this code is the worked example at :327.
  - §4 item 8, the error taxonomy deferral: :256-266.
  - §4 item 13, schema evolution, where any field change is a new version string: :281-285.
- **The human's terms for this piece:**
  - wording, directive :33; scope, :34, which also requires that the human sees the string at the PR;
  - the PLAN node excludes KNOWN-LIMITATIONS item 2 and engine/ADMISSION-RESULTS.md (PLAN.yaml:4492);
  - the same node lists the three cases in which the refusal fires on main, as does state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:124-136.
- **What the wording relies on.** The wording names two versions, and those are the contents of `PINNED_SPEC_VERSIONS` (engine/src/geoparquet.rs:37).
- **Owner's index.** The engine's typed-refusals line (engine/README.md:510) and the kernel's wire-codes line (kernel/README.md:359) do not point to any test that pins this text. KNOWN-LIMITATIONS item 2 is in the engine's declared limits (engine/README.md:523).

## 4. Overlap (rule 00)

| Path the piece would touch | Re-aim branch (ef1cc519) | filter-identity branch (d5863945) | Docs lane (`cut/shell-stale-frame-and-layout-comments`) |
|---|---|---|---|
| engine/src/error.rs | no (the re-aim's engine file is engine/src/fixture.rs, under its OPEN-1 (A) only: frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:431) | no (engine/src/predicate.rs) | no |
| frontends/shell/e2e/regression.mjs | **yes** (its budget row: E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:429; the constant moves to `:94-97` at ef1cc519) | no | no (style.mjs, residency-harness.mjs: frontends/shell/SHELL-STALE-FRAME-AND-LAYOUT-COMMENTS-PREREGISTRATION.md:7) |
| frontends/shell/e2e/admission-remediation.mjs | **yes** (E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:427) | no | no |
| frontends/shell/src/admission/formatRefusal.test.ts | no | no | no |
| frontends/shell/MANUAL-WALKTHROUGH.md, row B2 (Part B) | **same file**, other rows: C2, C3, I4 to I8, coverage rows, the Part C heading and fixture tables (E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:320-324) | no | **same file**, row S1 (Part S) only (SHELL-STALE-FRAME-AND-LAYOUT-COMMENTS-PREREGISTRATION.md:7) |
| frontends/shell/src/admission/admitDataset.test.ts (only if in scope) | no | no | no |
| protocol/skp/tests/data/v0-error-example.json (only if in scope) | no | no; its form says it is not touched there (kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md:286) | no |
| protocol/data-plane/tests/candidate_a.rs (only if in scope) | no | no | no |
| protocol/skp/SKP-V0.md (only if the form needs a version or §8 note) | no | **yes**, per the brief | no |
| frontends/shell/src/skp/__tests__/fixtures.test.ts (only if the fixture is in scope) | no | no | no |

- **The walkthrough rows.** The human's rule that a row in a different Part counts as disjoint is at state/directives/2026-10-10-drift-sweep-area-e-instructions.md:21.
- **Paths under `protocol/`:**
  - protocol/skp/tests/data/v0-error-example.json;
  - protocol/data-plane/tests/candidate_a.rs;
  - protocol/skp/SKP-V0.md;
  - protocol/skp/tests/fixtures.rs, which round-trips the fixture and needs no edit for a text change.
  - The filter-identity branch is the piece that touches `protocol/` in slot 2, per the brief and PLAN.yaml:4484.
- **Observed, not asked.** KNOWN-LIMITATIONS item 2 is excluded from this piece. The docs lane's item c, which is not open, edits that item (directive :25). The re-aim edits item 3 only (E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:325).

## 5. Questions the form must answer

1. Does protocol/skp/tests/data/v0-error-example.json:3 count as a test that quotes the message? If it does, how does the piece meet rule (00)'s single-protocol/ count? (PLAN.yaml:4492; kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md:286)
2. SKP-V0 makes `message` the `Display` text verbatim (protocol/skp/SKP-V0.md:325-326) and makes any field change a new version (:281-285), but it names no rule for a changed message text. Which rule applies to this change? This is a contract reading, which goes to the custodian.
3. The scope says nothing else (directive :34). Which references that point to the message without quoting it are in scope? They are rows B2'/B3', I1, ASSERT', NOPERSIST' and N4 (frontends/shell/MANUAL-WALKTHROUGH.md:92, :584, :608, :617, :947, where N4's error.rs line cite is stale), the e2e pointer comments, and error.rs's own reason-kept comment (engine/src/error.rs:27-29).
4. Are the prefix and substring quotes in scope? They are admitDataset.test.ts:100, protocol/data-plane/tests/candidate_a.rs:668, and the substring check at frontends/shell/src/skp/__tests__/fixtures.test.ts:472. PLAN.yaml:4492 lists none of them.
5. No engine or kernel test asserts the `Display` text: engine/src/crs.rs:332-336 and kernel/src/skp.rs:2612-2618 pin only the variant, code and detail. The e2e constants are the only full-text checks against real output. What pins the new text at its source, and what runs at the PR?

## Files read

- engine/README.md 495-530
- kernel/README.md 346-387
- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md 1-62
- state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md 1-41
- state/directives/2026-10-10-drift-sweep-area-e-instructions.md 1-24
- state/consults/DRIFT-SWEEP-AREA-E-2026-10-10.md 55-62 (and a search)
- state/consults/DRIFT-SWEEP-AREA-E-PART-2-2026-10-10.md (search only; no CRS matches)
- state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md 95-154
- PLAN.yaml 4474-4493 (and search hits)
- engine/src/error.rs 1-60, 265-354
- engine/src/crs.rs 280-339
- engine/src/geoparquet.rs 30-41, 444-453, 504-513, 566-579
- engine/src/dataset.rs 395-404
- engine/tests/admission_format_semantics.rs 360-389, 795-837 (and a function-name search)
- engine/tests/slice.rs (function-name search)
- engine/ADMISSION-PREREGISTRATION.md 48-55, 228-237, 1754-1757 (and a heading search)
- kernel/src/skp.rs 2030-2049, 2600-2624
- protocol/skp/SKP-V0.md 20-51, 250-349 (and a heading search)
- protocol/skp/tests/data/v0-error-example.json 1-7
- protocol/skp/tests/fixtures.rs 360-389
- protocol/data-plane/tests/candidate_a.rs 650-684
- frontends/shell/src/admission/formatRefusal.test.ts 1-60
- frontends/shell/src/admission/admitDataset.test.ts 85-116
- frontends/shell/src/skp/__tests__/fixtures.test.ts 455-479
- frontends/shell/e2e/regression.mjs 78-107, 2335-2366, 2615-2634
- frontends/shell/e2e/admission-remediation.mjs 60-79, 195-219, 640-661
- frontends/shell/e2e/console.mjs 385-424
- frontends/shell/MANUAL-WALKTHROUGH.md 90-93, 168-179 (and searches for row identifiers and fragments)
- frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md 316-335, 418-437 (and a search)
- frontends/shell/SHELL-STALE-FRAME-AND-LAYOUT-COMMENTS-PREREGISTRATION.md 1-12
- KNOWN-LIMITATIONS.md 30-61 (and a heading search)
- docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md 1-50, 160-199 (and a heading search)
- docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md 20-31
- docs/adr/ (Status lines, by search)
- docs/05_Data_Engine.md 18-37
- docs/01_Principles.md (search: :14, :21)
- RELEASE-0.1.md (search only)
- the re-aim branch's worktree checkout: frontends/shell/e2e/admission-remediation.mjs 70-78, 525-549; frontends/shell/e2e/regression.mjs 90-98; frontends/shell/MANUAL-WALKTHROUGH.md 176; searches for fragments, the code name and row identifiers
- git ref files: main, `cut/e2e-stale-expectations-reaim`, `cut/filter-identity-alias-ambiguous-reached-through-skp`, `cut/shell-stale-frame-and-layout-comments`, and the HEADs of the two worktrees
- whole-tree searches for the fragments and for `crs_undeclared`, `CrsUndeclared` and `v0-error-example`

*Custodian's filing note (2026-10-10): written by lead-data to this path (run 19:49:45Z to 19:57:47Z by its transcript; write audit PASS, one Write, to this path only: Grep 50, Read 64, Glob 6, Write 1, SubagentHandback 1). As written, its sha256 was 0382a10634ec8f32d5b377131dcfba16f8ea445f2ae32340959688de40608fad; the only change is this appended note. The branch was read from the re-aim worktree, not by git show. At the time, that worktree carried one uncommitted change, the re-aim worker's scratch hash-log patch on engine/src/fixture.rs, under the human's allowance. The custodian checked the three branch spans this read leans on with git show at ef1cc519: engine/src/error.rs lines 284-285, and the message constant in the two e2e suites (regression.mjs lines 94-97, admission-remediation.mjs lines 74-77). Each equals the worktree's bytes.*
