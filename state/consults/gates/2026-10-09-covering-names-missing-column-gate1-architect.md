# PR #197 gate 1 — architect
Reviewed: cut/covering-names-missing-column @ 9340c5f885d88dc8effc1275c53b79a309c661e3

**Verdict: FAIL on Evidence only (E1, a one-line code-comment fix). Correctness passes. Two Documentation findings (D1, D2) must be fixed in this PR before the merge.** Under the proportional rule, the re-gate covers E1's line only.

Everything below was read at the reviewed commit, with main as the form's source. I have no shell, so I did not recompute any sha256 and did not run any diffstat. The reviewer gate owns those (see Notes).

## Evidence

**E1. A code comment claims a binder limit that the evidence does not support, and §1 forbids that claim.**
- The comment is `engine/src/dataset.rs:1441-1444` (`field_path_exists`'s doc). It says that ASCII case-insensitive equality applies "at the top level and at every child", and that a name differing by a non-ASCII letter's case does not bind. Byte-copied from `engine/src/dataset.rs:1444`: "non-ASCII letter's case does not bind."
- The P0 tested a non-ASCII case difference only on the top-level name (row g, `state/drafts/covering-names-missing-column-p0/p0-output.txt:50-58`).
- Amendment 1, item 5 records a non-ASCII child name as not covered by the P0.
- Amendment 2, item 4 puts it on §1's may-not-claim list, on the human's ruling (2026-10-09, item 2).
- The code itself is right: ASCII folding at both levels is the rule Amendment 1, item 4 selected. Only the general statement about the binder is unsupported.
- **Fix:** limit the clause to what row g showed (a top-level name), and say that a non-ASCII child name is outside the claim (§1, Amendment 2 item 4). Nothing else changes.

## Correctness: pass

**§8, item by item:**
1. **Pass.** A bbox query reaches no lease, mint or data-plane terminal.
   - `refused_pre_lease` (engine test file, lines 78-91) asserts `leases_issued` is unchanged. C-1, C-2, C-3 (rows that drop the covering), C-4 and C-5 all use it.
   - K-1 asserts `cancel_all_for_dataset` is 0 before and after, and that leases are unchanged.
   - The refusal is `build_sql`'s existing gate (`engine/src/stream.rs:1478-1479`), reached at stream.rs:1209 before the lease.
2. **Pass.** The decision and the binder agree on every P0 row.
   - C-3's seven rows match the P0 run byte for byte, row g included: `p0-test.rs.txt:29` and C-3 both use `b\u{f6}x`/`B\u{d6}X`.
   - The oracle and the decision are each asserted.
3. **Pass.** There is one decision site.
   - `judge_covering` (dataset.rs:1421) is the only caller of `covering_not_addressable_reason` and of `field_path_exists` (dataset.rs:1423, 1433).
   - `sanity_check` (dataset.rs:1252-1269) only matches on the finding it is passed.
4. **Pass.** I compared the declared-unchanged items against main.
   - Both sanity reason texts are byte-identical: main dataset.rs:1244 and 1261-1263 against branch 1254 and 1263-1264. They keep their position after the bbox-member return and the no-covering return.
   - The U+0000 text is unchanged (branch 1384-1388).
   - The body of `no_covering_bbox_detail` is unchanged (branch 1000-1005 against main 992-997).
   - `engine/src` changes only `dataset.rs` (Amendment 3, item 2's numstat), so `layout.rs`, `error.rs` and `fixture.rs` are untouched.
   - In `engine/ADMISSION-RESULTS.md`, only lines 2, 4 and 8 moved. The M-4 note at line 46 is identical on the branch and on main.
5. **Pass.** C-1 asserts the exact detail, both negatives, and never `Query`.
6. **Pass.** No variant, code, key or literal is added. Inside the numstat scope, the protocol and shell paths are empty. For `protocol/data-plane/`, see Notes.
7. **Pass.** The engine detail states an engine fact only, in the human's words.
8. **Pass.** No prediction was edited. The results file came from its generator at 7196452e, and the generator's M-4 expectation is untouched.
9. **Pass.** The signature is `judge_covering(Option<&CoveringBbox>, &SchemaRef)`, with no `Connection`.
10. **Pass.** The detail at dataset.rs:1408 matches line 18 of `state/directives/2026-10-09-rulings-on-the-eight-forms.md`. The sentence at `KNOWN-LIMITATIONS.md:115` matches line 19 after its lead-in. Both checked byte for byte.
11. **Pass.** The reflog shows the cut from 76a09d5c, which already carries Amendments 1 and 2. The first code commit is 66e3088a.
12. **Pass.** There is no `cfg`, and the case rule is `eq_ignore_ascii_case`, not keyed to an OS.
13. **Pass.** `CoveringFinding`, `CoveringFinding::detail` and `judge_covering` are all private.

**The seams:**
- **Engine to kernel: pass.** The kernel consumes the existing `pub fn covering` (dataset.rs:988) and `EngineError::NoCoveringBbox`:
  - at `kernel/src/skp.rs:1975` (`covering_bbox: ds.covering().is_some()`);
  - at `error_of`'s arm, `kernel/src/skp.rs:2103-2104`;
  - through the pre-mint route, `kernel/src/skp.rs:1465-1471`.

  None of these is edited. K-1 (`kernel/tests/skp_projection.rs:915-1011`) proves the seam from the real shape. It uses the real `Catalog` and `SkpHost` and checks the code, the key set {detail}, the message as the engine's own Display text, no mint and no lease, and that a no-bbox query still mints.
- **Kernel to shell: pass.** In `reportViewportOutcome` (`frontends/shell/src/App.tsx:1236-1274`), the rejected arm sets `viewportRefusal(formatRefusal(e.skpError))`. It is unchanged, and existing shell tests already drive it with `engine.no_covering_bbox` (`App.lateResult.test.tsx:467-468`).

**The caller rule: pass.** The decision's only product caller is `open_inner` (dataset.rs:436). `CoveringFinding::detail` is called at dataset.rs:582.

**The no-bbox path:** the only readers of `covering()` are `build_sql`'s bbox branch, the two index builds, `describe`, and the banner at `kernel/src/main.rs:121`. So the no-bbox stream and publish paths are untouched by code reading. C-1 and C-2 drain the no-bbox stream.

**§1: pass, except E1.** Neither the PR body nor the code claims a docs/08 figure, a speed change, non-conformance or an ADR change. The PR body's case-rule sentence is limited to rows d, e and g.

**ADRs:** none amended. The commit list and the §7 numstat touch no file under `docs/adr/`, and ADR-015, ADR-019 and ADR-023 are untouched.

**SKP-V0 note** (`protocol/skp/SKP-V0.md:1075-1082`): **pass** against §2d.
- It is headed "no literal change", sits at the end of §8 before §9, and states Branch A only.
- It carries all three of §2d's under-A statements.
- Its basis is the entry-30 addendum (SKP-V0.md:641-658). The note says no value domain widens, and that is true: `covering_bbox` is an existing boolean, and `engine.no_covering_bbox` is already in `viewport_query`'s synchronous set. So the addendum's widening licence and its expiry clause are not invoked.

**Owner's index: pass** against §9's bullet. All six whole-line replacements are present on the branch:
- `engine/README.md:499`, :501 (`Dataset::covering` plus the C-1 pin) and :518 (the form);
- `kernel/README.md:350`, :352 (the K-1 pin) and :377 (the form).

"Last verified at a06a746b" is accurate. 9340c5f8 changes only these lines.

**Amendment 3: pass as a class 8 record.**
- §7's line on main, "An overrun is class 8, and this line is never edited", is intact.
- 114 + 51 + 366 + 105 = 636 in 3 files, matching the worker report (lines 25-29).
- Item 4: the HTML comment (`KNOWN-LIMITATIONS.md:116`) is in a file §7 names as outside the count. It is not operator wording. Its claim, that the sentence describes the tree after this piece lands and not the b391e436 artifact, matches the comment at :117.

**Round-25 checks: pass.**
- The overrun is recorded as class 8, and §7 is unedited.
- No scope addition on a standing rule. The comment is disclosed and is not class 9.
- No record calls a `verify-mutation` run an observation: report-1 line 48 states that none was used.
- No test-text span is pinned by hash at a branch commit. Branch spans carry their commit: 7196452e in the PR body and report-1, a06a746b in the owner's-index draft.
- No five-line form is involved.

**PR body against the reports: supported, except D2.**
- The mutation table matches report-1 (lines 49-62), and the quoted assertion texts are byte-identical to it.
- The suite figures match report-1 (lines 40-41), and the regenerated results file matches its header.

## Documentation (must fix before the merge; no re-gate)

**D1. Amendment 3 has two reference-form defects. It is on main and append-only, so fix it with one appended correction of at most three sentences (round 12, item (d)).**
- Item 1's sha256 for the worker report, taken "from its line 5", has no explicit `@ <rev>` at a main commit, which round 15, item (e) requires. Name the main commit that added the report.
- Item 4's "line 19 of" the ruling file is a bare line cite. Refer to Amendment 2, item 1's pin instead (`:15-20 @ b4dc05e0… sha256:de4805…`).

**D2. PR body, line 1 says that "A view query then refuses before any handle is minted."**
- Only a bbox `viewport_query` refuses. K-1 asserts that a no-bbox query still mints, and the shell issues a no-bbox query at `App.tsx:1630`.
- Lines 5-6 of the body already say this correctly. Qualify line 1 to match.

## Notes (not findings)

- **Left to the reviewer gate (I have no shell):**
  - the diffstat over `protocol/data-plane/`, `protocol/skp/src`, `protocol/skp/tests` and `frontends/`;
  - recomputing the sha256s in Amendments 1 and 3;
  - the custodian's `verify:*` and `node --test` runs at 9340c5f8;
  - the tester's §9 suites.
- The form's §3a row g reads `bböx`/`BBÖX`, but the P0 and C-3 ran `böx`/`BÖX`. The property being tested (a non-ASCII case difference) is the same, and Amendment 1 pins the run by hash. No action.
- A known gap, not a defect: where the walk and the binder can disagree outside the P0, the walk reports the column absent and the bbox query is refused, which can only refuse a covering that would have worked, never return wrong rows. The unsafe direction (two names differing only by case) is already the proposed node `covering-case-collision-binds-other-column`.

No ADR skeleton is needed. No decision is missing.
