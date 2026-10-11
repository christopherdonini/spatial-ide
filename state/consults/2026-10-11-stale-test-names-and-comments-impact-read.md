# Impact read — stale-test-names-and-comments (lead-data, second pilot)
Read at: main 05b795e0 (05b795e0cbe88781303739a256111c8a65f7b3f1, from .git/refs/heads/main); PR #209's branch cut/module-docs-stale-statements at dd96e42482380cac3564edb82548d6fc026f3d20 (from .git/refs/heads/cut/module-docs-stale-statements), read in the worktree C:/dev/wt/mdocs.

Task: an impact read (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:7-11) for the placed node at PLAN.yaml:4461-4477, the docs lane's piece f (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:28). Pointers only. No draft text, design, recommendation or answer. This run had no shell: no git command was run; branch facts come from reading the worktree's files and the filed worker reports.

## 1. Each stale name or comment on main, and 2. the current fact it contradicts

Grouped by the authority that put each item in the node (PLAN.yaml:4476). The sweep's commit is 9e7362db; its check is state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md. "Holds" means the stale text is at the cited line on main.

### Finding 2: the refusal-named test (the only test rename the node names)
- Stale, holds:
  - test name: `engine/tests/identity.rs::a_file_whose_key_is_not_called_id_is_refused_until_a_mapping_is_declared` (engine/tests/identity.rs:139);
  - its watchdog label, a string literal passed to `Watchdog::new` (engine/tests/identity.rs:140).
- Current fact:
  - the test's own body: a plain open admits (engine/tests/identity.rs:156), with `IdSource::SessionOrdinal` (:157) and `ByConstructionWithinGeneration` (:158-162). The comment that records the change is at :149-155. The declared-mapping half is at :172-187;
  - the session tier: `IdSource::SessionOrdinal` (engine/src/identity.rs:55); ADR-016 Amendment 1, Accepted (docs/adr/ADR-016-stable-feature-identity-admission.md:180);
  - the assertion change is recorded without the name at engine/ADMISSION-PREREGISTRATION.md:294-295.
- Same file, not stale: `a_duplicate_id_column_is_refused_rather_than_admitted_as_identity` (engine/tests/identity.rs:106) is pinned in the engine owner's index (engine/README.md:501).

### The two references to that test (finding 2's reference; the one-file exception)
- engine/src/identity.rs:251-254, the caller list in the doc of `DatasetIdentity::candidate_columns` (engine/src/identity.rs:255). Line 254 names the test. Its exception: state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:14 (item 3) and the form's Amendment 1 item 2 (kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md, §10).
  - Why the doc names callers: the human's ruling quoted at engine/ADMISSION-PREREGISTRATION.md:1476, and the rule at :994. The gates run the caller grep (.claude/agents/reviewer.md:24; .claude/agents/worker.md:24). No script checks these names; this line has no compile-time link to the test.
  - Observed, named by no record: a third caller of `candidate_columns()` that the list does not name, in `engine/tests/b1_projection_hostile_names.rs::a_native_id_with_u0000_opens_on_the_session_tier_with_no_nul_candidate` (engine/tests/b1_projection_hostile_names.rs:733; calls at :750-755). The two named callers call it at engine/tests/session_identity.rs:201-202 and engine/tests/identity.rs:165-166.
- engine/tests/admission_instruments.rs:65-68, a comment inside `engine/tests/admission_instruments.rs::session_ordinal_reads_nothing_native_and_mapped_run_exactly_the_verification_scan` (:64). Line 67 names the test.

### PR #204's architect gate 1, D2: the renamed no-CRS generator's kept paragraph
- Stale, holds: kernel/tests/manual_walkthrough_fixtures.rs:554-563, the doc of `kernel/tests/manual_walkthrough_fixtures.rs::generate_the_no_crs_no_id_refusing_fixture` (:566). The gate's finding: state/consults/gates/2026-10-10-e2e-stale-expectations-reaim-gate1-architect.md:106-108 (its line numbers were read on the branch; on main the paragraph is at the lines above).
- Current fact:
  - the same doc's first paragraph: renamed from `bothneeded-refused.parquet`, and the both-needed loop belongs to `no-crs-string-id-refused.parquet` (kernel/tests/manual_walkthrough_fixtures.rs:550-552). The written filename is at :567;
  - `stepBothNeeded` (frontends/shell/e2e/admission-remediation.mjs:530) uses this file for its session half (a) and the other file for the both-needed half (b) (:510-518; paths at :57, :59);
  - the re-aim form's F-C row (frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:289) and its note at :486.
- Not in the node: the generator's name. It is named live at frontends/shell/e2e/admission-remediation.mjs:37 and :65, and in a verify-test-claims input, frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:289.

### The human's item 4: skp_filter_cancellation's late-matching comment
- Stale, holds: kernel/tests/skp_filter_cancellation.rs:176-177, in `cancel_reaches_the_producer_during_a_late_matching_filtered_scan_once` (:145), the helper of `kernel/tests/skp_filter_cancellation.rs::cancel_reaches_the_producer_during_a_late_matching_filtered_scan` (:123). It reads "True only for the last 100 of 200,000 ids".
- Current fact: `FEATURES` is 2_000_000 (:147); the filter is `id > FEATURES - 100` (:185). A grep of the file for 200,000 finds only :176.
- The human's terms for the new comment: state/directives/2026-10-10-pr199-merged-flush-open-1-pr200-sentence-stale-comment.md:14.

### Finding 7: ADR-018 called Proposed
- Stale, holds: kernel/tests/first_batch_factorial.rs:1290-1291, the doc of `kernel/tests/first_batch_factorial.rs::cancellation_holds_with_pruning_in_the_path` (:1301, `#[ignore]` at :1300). Line 1291 reads "as the proposed ADR-018 vocabulary requires while it remains Proposed."
- Current fact: ADR-018 Accepted (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3).
- A grep of kernel/, engine/, renderer/, frontends/ and protocol/ source for ADR-018 called Proposed finds only this line.

### Finding 4: the no-attributes reason
- Stale, holds: renderer/tests/style_shell_agreement.rs:37-38 (module doc).
- Current fact: `ViewportQueryRequest.columns` since skp/0.6 (protocol/skp/src/v0/commands.rs:441-447). The shell's own corrected sentence: frontends/shell/src/style/document.ts:20. ADR-023's carried condition 1 (docs/adr/ADR-023-attribute-projection-on-viewport-query.md:144). ADR-023 is Proposed (:3).
- Out of the node: the same sentence in product code, frontends/shell/src/canvas/buildLayers.ts:31 (PLAN.yaml:4476).

### Finding 3: the React-harness premise
- Stale, holds:
  - frontends/shell/src/App.test.ts:52-56 (no harness) and :58-65 (the remount untested anywhere; REOPEN' as its evidence);
  - frontends/shell/src/admission/AdmissionPanel.test.ts:24-25;
  - frontends/shell/src/admission/CrsAssertionForm.test.ts:13-14;
  - frontends/shell/src/canvas/WorkingCanvas.test.ts:119-122.
- Current fact: `App.layout.test.tsx` mounts `App` with a per-handle mount counter (frontends/shell/src/App.layout.test.tsx:4-14; `createRoot` at :175). R1 is `frontends/shell/src/App.layout.test.tsx` "R1: the map is mounted exactly once per handle across every layout action; a reopen mounts the new handle once and unmounts the old one once" (:282). Other suites mount with `createRoot`: App.lateResult.test.tsx:438, OriginMismatchState.test.tsx:29, canvas/HoverReadoutView.test.tsx:36 (all under frontends/shell/src).
- Observed, same premise, named by no node:
  - frontends/shell/src/App.lateResult.test.tsx:19;
  - frontends/shell/src/canvas/WorkingCanvas.test.ts:700;
  - in product code, out of the node's test-files rule: frontends/shell/src/admission/crsAssertionState.ts:10.

### Finding 10: two ruled decisions still marked pending
- String 6:
  - Stale, holds: frontends/shell/src/residency/residencyStatus.test.ts:195, a `describe` title, so part of each enclosed test's full name (first test at :196); frontends/shell/e2e/regression.mjs:1762-1763.
  - Current fact: entry 45 RULED 2026-09-06 (DECISIONS-PENDING.md:3120). The string's own doc now says RULED (frontends/shell/src/residency/residencyStatus.ts:425-427). The constant is at :434-435.
  - Observed: regression.mjs:1760 cites `src/residency/residencyStatus.ts:429-430` for the constant, which is now at :434.
- `HOVER_REPICK_ON_PAN`:
  - Stale, holds: frontends/shell/src/canvas/pickResolution.test.ts:236-238 (comment above `describe("shouldArmHoverRepick (D3/D6(a))"`, :239); frontends/shell/e2e/regression.mjs:1075-1079, which includes the re-aim instruction for K6 case (iv) (:1077-1079).
  - Current fact: entry 75 ruled in the 2026-09-14 question set B (DECISIONS-PENDING.md:1509, :1513). The constant's doc says RULED (frontends/shell/src/canvas/hoverRepickConstants.ts:37); the value is at :56. The node `entry-75-hover-repick-defaults` is done (PLAN.yaml:1188-1193).
  - The marker in hoverRepickConstants.ts moved to `shell-stale-frame-comments` (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:6), which is done (PLAN.yaml:4786-4791). A grep of frontends/shell/src for the marker text finds only pickResolution.test.ts:237.

## References to each test a rename would touch

The node names one test rename (finding 2). Finding 10's `describe` title (residencyStatus.test.ts:195) is a name element too; its references are listed after the first.

`engine/tests/identity.rs::a_file_whose_key_is_not_called_id_is_refused_until_a_mapping_is_declared`, by a repository-wide grep of the name and of the watchdog label (state/ included; .claude/ checked separately, no match):
- **Live, a rename leaves stale:**
  - engine/src/identity.rs:254 (the caller-grep exemption doc; see above);
  - engine/tests/admission_instruments.rs:67 (a comment).
- **Live, none found in:** PLAN.yaml (PLAN.yaml:4476 names the file, not the test); any `*PREREGISTRATION*.md` or `docs/adr/*.md` (the verify-test-claims inputs, scripts/plan/verify-test-claims.mjs:746); docs/; KNOWN-LIMITATIONS.md; RELEASE-0.1.md; frontends/shell/MANUAL-WALKTHROUGH.md; any e2e file; any other test; either owner's index.
- **Append-only records that keep the old name:**
  - state/consults/2026-10-05-main-ci-run-37264494821-attempt-1-failed-steps.txt:488;
  - state/consults/2026-10-07-pr187-ci-run-37675645746-attempt-1-failed-steps.txt:529;
  - state/consults/2026-10-08-pr189-ci-run-37723999952-attempt-1-failed-steps.txt:542;
  - state/consults/2026-10-08-pr195-ci-run-37836080416-attempt-1-failed-steps.txt:541;
  - state/consults/2026-10-10-filter-identity-alias-ambiguous-reached-through-skp-impact-read.md:19;
  - state/consults/2026-10-11-module-docs-stale-statements-impact-read.md:108;
  - state/consults/DRIFT-SWEEP-AREA-E-2026-10-10.md:18 (also the only other place the watchdog label appears).
- **Pinned cite of the reference lines:** kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md §2.3 pins engine/src/identity.rs:251-254 at 426ec39f with a sha256. §5's declared-unchanged list and §8 item 3 name those lines for PR #209.

The residencyStatus.test.ts:195 `describe` title:
- **Live:** none outside the file.
- **Records:** state/consults/DRIFT-SWEEP-AREA-E-PART-2-2026-10-10.md:24 (quotes it); state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:87-88 (cites the line).

Tests named in this read whose names the node does not change, with their live references:
- `cancel_reaches_the_producer_during_a_late_matching_filtered_scan`: kernel/tests/manual_walkthrough_fixtures.rs:663, engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md, kernel/RESULTS.md, kernel/tests/first_batch_factorial.rs (file-level grep);
- `cancellation_holds_with_pruning_in_the_path`: the same grep. No per-line list was made, because no rename is named.

## Owner's-index lines (engine/ and kernel/ only)

- **engine/README.md (index at :495-529):** no line names a test or comment this piece changes. :501 names `spatial_engine::identity` and pins `engine/tests/identity.rs::a_duplicate_id_column_is_refused_rather_than_admitted_as_identity`, a different test in the file this piece edits. :499 is Last verified at.
- **kernel/README.md (index at :346-386):** no line names `kernel/tests/manual_walkthrough_fixtures.rs`, `kernel/tests/skp_filter_cancellation.rs` or `kernel/tests/first_batch_factorial.rs`, or a test in them. The body of neither README names any of those three files or engine/tests/identity.rs's renamed test (grep of both files).
- At PR #209's head the index headings are at engine/README.md:526 and kernel/README.md:350 (C:/dev/wt/mdocs), and :501's line is at :532.

## 3. What governs them

- **ADRs (Status lines):**
  - ADR-016 Accepted (docs/adr/ADR-016-stable-feature-identity-admission.md:3), Amendment 1 Accepted (:180);
  - ADR-018 Accepted (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3);
  - ADR-023 Proposed, binding nothing (docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3), condition 1 at :144;
  - ADR-013 Amendment 1 Accepted (docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:265). Relevant only to the same-class lines in §6 Q4.
- **Preregistrations:**
  - engine/ADMISSION-PREREGISTRATION.md: R-I3 and the test's assertion change (:294-295); the caller-named exemption (:994, :1476); Amendment 4, cited at engine/src/identity.rs:249;
  - frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md: F-C (:289), the note at :486;
  - kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md: §2.3 and Amendment 1 item 2 (the one-file exception);
  - kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md, the measurement pass first_batch_factorial.rs runs under (kernel/README.md:377; cited at kernel/tests/first_batch_factorial.rs:1283).
- **The docs lane's terms:** documents, comments and test names only; no code logic, no test assertion, no string the app shows, nothing under scripts/plan (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19). Test files and e2e files only (:6), with the identity.rs exception (state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:14).
- **Budget:** 60 minutes (PLAN.yaml:4472).
- **KNOWN-LIMITATIONS items on the same facts** (none is in the node):
  - item 3, identity, with its on-main paragraph (KNOWN-LIMITATIONS.md:62, :70);
  - item 4, literal-only styling (:72);
  - item 7, the partial-view wording (:96).
- **Declared ceilings:** none touched.
- **Interfaces:** no engine or kernel interface changes. The one engine source line in scope is a doc on `spatial_engine::identity::DatasetIdentity::candidate_columns` (engine/src/identity.rs:251-255), under the index's `spatial_engine::identity` bullet (engine/README.md:501). Consumers in other modules: none of that doc line.

## 4. Overlap with PR #209 (rule 00)

The paths this piece would touch, by the node: engine/tests/identity.rs, engine/tests/admission_instruments.rs, engine/src/identity.rs, kernel/tests/manual_walkthrough_fixtures.rs, kernel/tests/skp_filter_cancellation.rs, kernel/tests/first_batch_factorial.rs, renderer/tests/style_shell_agreement.rs, frontends/shell/src/App.test.ts, frontends/shell/src/admission/AdmissionPanel.test.ts, frontends/shell/src/admission/CrsAssertionForm.test.ts, frontends/shell/src/canvas/WorkingCanvas.test.ts, frontends/shell/src/residency/residencyStatus.test.ts, frontends/shell/src/canvas/pickResolution.test.ts and frontends/shell/e2e/regression.mjs. That is 14 files, plus the form and PLAN.yaml.

PR #209's file set at dd96e424 is 16 files: engine/README.md, engine/src/crs.rs, dataset.rs, envelope.rs, geoparquet.rs, identity.rs, lib.rs, predicate.rs; kernel/CANCELLATION-AND-TRACING.md, kernel/PERMISSION-BOUNDARY.md, kernel/README.md, kernel/src/bundle/mod.rs, kernel/src/lib.rs, kernel/src/permission/boundary.rs, kernel/src/permission/mod.rs, kernel/src/publish/mod.rs. Sources: state/consults/2026-10-11-module-docs-stale-statements-worker-report-2.md:50-66 (at 1c3b4dbe) and worker report 3 (:38-44, the 1c3b4dbe..dd96e424 rewrap in three of those files).

- **Shared file: engine/src/identity.rs, the only one.**
  - PR #209 changes main's lines 5, 43, 66 and 119-121 (six lines, 6/6, net zero). Each pair was compared by reading main and C:/dev/wt/mdocs.
  - Lines 251-254 are byte-identical in both trees, at the same line numbers. **No line overlaps.** The nearest PR #209 line is 121.
- **No other shared file.** No engine/tests, kernel/tests, renderer, frontends or e2e file is in PR #209. Its form declares frontends/** unchanged (kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md §5).
- **Conditional: engine/README.md and kernel/README.md** are in PR #209 (66/35 and 10/6). They are shared only if this piece's owner's-index update edits them; §2 above finds no index line naming a changed test or comment.
- **Order:** this node depends on `skp-v0-live-sections-current-area-c` (PLAN.yaml:4468), which depends on `module-docs-stale-statements` (PLAN.yaml:4413), PR #209's node (in progress, PLAN.yaml:3810).
- **Same files, other open nodes (not checked line by line):**
  - `first-batch-factorial-ignored-trace-tests`, proposed, names first_batch_factorial (PLAN.yaml:4297-4302, :4298);
  - `mp-prime-e2e-covered-fixture`, proposed, names regression.mjs's MP' step and manual_walkthrough_fixtures (PLAN.yaml:4176-4181, :4191).
  - The other in-progress nodes, `ported-code-notice-route` (PLAN.yaml:4697) and `shell-map-refill-after-resize` (PLAN.yaml:4962), were not checked for paths beyond the PLAN.yaml grep: :4977 lists layout.mjs, not regression.mjs.
- **protocol/:** no path.

## 5. Size facts (counts of what is there)

| File | Stale lines on main (sites) |
|---|---|
| engine/tests/identity.rs | 2 (:139 name, :140 label) |
| engine/tests/admission_instruments.rs | 1 (:67, in comment :65-68) |
| engine/src/identity.rs | 1 (:254, in doc :251-254) |
| kernel/tests/manual_walkthrough_fixtures.rs | 10 (:554-563) |
| kernel/tests/skp_filter_cancellation.rs | 1 (:176, in comment :176-177) |
| kernel/tests/first_batch_factorial.rs | 2 (:1290-1291) |
| renderer/tests/style_shell_agreement.rs | 2 (:37-38) |
| frontends/shell/src/App.test.ts | 13 (:52-56, :58-65) |
| frontends/shell/src/admission/AdmissionPanel.test.ts | 2 (:24-25) |
| frontends/shell/src/admission/CrsAssertionForm.test.ts | 2 (:13-14) |
| frontends/shell/src/canvas/WorkingCanvas.test.ts | 4 (:119-122) |
| frontends/shell/src/residency/residencyStatus.test.ts | 1 (:195) |
| frontends/shell/src/canvas/pickResolution.test.ts | 3 (:236-238) |
| frontends/shell/e2e/regression.mjs | 7 (:1075-1079, :1762-1763) |

The ranges are where the stale text sits; the brief asked for no rewrite size, and none is given.

## 6. Questions the form must answer

1. What is the new name for engine/tests/identity.rs:139? Is the watchdog label at :140, a string literal, inside the lane's "no test assertion" terms? (Raised by: PLAN.yaml:4476; state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19.)
2. engine/src/identity.rs:251-254 lists two callers, and a third exists (engine/tests/b1_projection_hostile_names.rs:750-755). Does the one-file exception cover the list or only the renamed name? (Raised by: state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:14; engine/ADMISSION-PREREGISTRATION.md:1476.)
3. Is residencyStatus.test.ts:195's `describe` title counted as a test rename or as a comment? (Raised by: PLAN.yaml:4462, "names and comments only".)
4. Are same-class lines the node does not name in Scope? (Raised by: state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:119.)
   - engine/tests/admission_format_semantics.rs:504, :699, :762, :840 (ADR-013 Amendment 1 called proposed);
   - engine/tests/session_identity.rs:116, :206, and :190-192, which is inside an assertion message;
   - frontends/shell/src/App.lateResult.test.tsx:19;
   - frontends/shell/src/canvas/WorkingCanvas.test.ts:700;
   - regression.mjs:1760's line cite.
5. Does the "comment only" D2 item leave `generate_the_no_crs_no_id_refusing_fixture`'s name as it is? That name is live at frontends/shell/e2e/admission-remediation.mjs:37 and :65 and in the verify-test-claims input frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:289. (Raised by: PLAN.yaml:4476.)

## Files read

- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: 1-62
- engine/README.md: 495-530; kernel/README.md: 346-387; greps of both for the target files and tests
- PLAN.yaml: 4455-4534; greps for node ids, statuses, target file names
- state/consults/DRIFT-SWEEP-AREA-E-2026-10-10.md: 1-62; DRIFT-SWEEP-AREA-E-PART-2-2026-10-10.md: 1-43
- state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md: 1-171
- state/consults/2026-10-11-module-docs-stale-statements-impact-read.md: 1-274 (the format)
- state/consults/2026-10-11-module-docs-stale-statements-worker-report-2.md: 45-73; worker-report-3.md: 1-59; grep of report 1
- state/consults/gates/2026-10-10-e2e-stale-expectations-reaim-gate1-architect.md: grep for D2 (103-109)
- state/directives/2026-10-10-pr199-merged-flush-open-1-pr200-sentence-stale-comment.md: 1-15
- state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md: 1-19
- state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md: grep of all lines
- kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md: 294-493; grep for identity.rs
- engine/tests/identity.rs: 1-200
- engine/src/identity.rs: 1-130, 235-269 (main); 1-130, 241-256 (C:/dev/wt/mdocs); grep for impl and struct
- engine/tests/admission_instruments.rs: 50-84
- engine/tests/b1_projection_hostile_names.rs: 725-759
- engine/tests/session_identity.rs: 184-193
- engine/ADMISSION-PREREGISTRATION.md: 288-299; grep for caller-grep (994, 1476)
- kernel/tests/manual_walkthrough_fixtures.rs: 520-589
- kernel/tests/skp_filter_cancellation.rs: 130-194; greps for fns and counts
- kernel/tests/first_batch_factorial.rs: 1270-1309
- renderer/tests/style_shell_agreement.rs: 20-59
- frontends/shell/src/App.test.ts: 40-69; App.layout.test.tsx: 1-20 and grep (282); App.lateResult.test.tsx: 14-23
- frontends/shell/src/admission/AdmissionPanel.test.ts: 15-29; CrsAssertionForm.test.ts: 5-19
- frontends/shell/src/canvas/WorkingCanvas.test.ts: 112-126, 695-704; pickResolution.test.ts: 228-243
- frontends/shell/src/residency/residencyStatus.test.ts: 190-201; residencyStatus.ts: 420-436 and grep
- frontends/shell/src/canvas/hoverRepickConstants.ts: grep (37, 56)
- frontends/shell/e2e/regression.mjs: 1072-1083, 1756-1767; grep for markers
- frontends/shell/e2e/admission-remediation.mjs: 505-534; grep for fixture names
- frontends/shell/package.json: grep (7)
- protocol/skp/src/v0/commands.rs: grep (229, 441, 447)
- DECISIONS-PENDING.md: greps (1509, 1513, 3119-3120)
- KNOWN-LIMITATIONS.md: item-heading and on-main greps
- docs/adr: Status and Amendment 1 greps for ADR-013, 016, 018, 023
- scripts/plan/verify-test-claims.mjs: grep (10, 746)
- .claude/agents/reviewer.md, worker.md, AI_DEVELOPMENT.md: grep for caller grep
- .git/HEAD, .git/refs/heads/main, .git/refs/heads/cut/module-docs-stale-statements, .git/worktrees/mdocs/HEAD; C:/dev/wt/mdocs/.git
- repository greps (state/ included; .claude/ and C:/dev/wt/mdocs separately) for the test name and watchdog label, the describe title, the generator name, the two cancellation test names, candidate_columns(), the harness premise, ADR-018 and Proposed in tests
