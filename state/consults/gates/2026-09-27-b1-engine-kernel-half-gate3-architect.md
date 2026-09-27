*Custodian's filing note (2026-09-27): gate 3 (attempt 3), architect, full gating, for PLAN node `b1-engine-kernel-half`. Reviewed: cut/b1-engine-projection @ c9ec02e32cb36a64a446424f6db2f4584cacdefc. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). The text below the rule is the hand-back, byte-identical except for the harness's two-space indent, which is removed.*

---

**Verdict: PASS with notes.** Reviewed `cut/b1-engine-projection @ c9ec02e`.

I read the working tree at `C:/dev/wt/b1-projection` and assumed it is at `c9ec02e`. I have no Bash, so every per-commit fact below is the reviewer's to settle: line numbers at `ca3d7ae`/`a472add`, the hashes at `cec34b8`, M-1/M-2, 9.6's runs, the harness count, and the merge's byte-identity. Unless marked otherwise, line cites point into `c9ec02e`.

## Verdicts (AUTONOMY.md §22)
- **Correctness: PASS.**
  - Severity: none.
  - Scope: `engine/src/{attributes,stream,predicate}.rs`, `kernel/src/{skp.rs,publish/mod.rs}`, `protocol/skp/tests/conformance/`.
  - Disposition: none.
- **Evidence: PASS with notes.** This depends on the reviewer confirming the facts listed under "Reviewer confirms" below.
  - Severity: low.
  - Scope: 9.6(a), E-15's doc, the §9 suites, older RECORDED MUTATION self-line cites.
  - Disposition: no worker round.
- **Documentation: PASS with notes.**
  - Severity: low.
  - Scope: Amendment 8's superseded index, Amendment 9's 9.6 attribution, SKP-V0's fixture-commit list, two stream.rs docs.
  - Disposition: the record cap's reduction. Amendment 10 below is record-only and architect-authored, and it opens no gate round. The doc nits go to the follow-up node.

## 1. Gate-2 findings against the round-2 code and Amendment 8
- **C-a: fixed.** The `Dictionary` arm carries no text, and a refused dictionary falls through to main's final arm (`attributes.rs:95-101`).
- **C-b: fixed.**
  - `AdmittedProjection::source_types` (`attributes.rs:346`) has a product caller, `publish/mod.rs:492`.
  - The fallible second lookup and its developer text are gone.
- **C-c: fixed.**
  - The reserved-name arm states the engine fact (`attributes.rs:226-230`).
  - Publish's `From` arm keeps main's bytes (`:273-280`).
- **C-d: settled as not firing** (reviewer, `cec34b8`).
- **X2: met.** The kernel test exists (`skp_projection.rs:831`), and its mutation is realized both before and after C-b.
- **X3: met.**
  - The K-5 case uses the engine-API route with `skip_uniqueness_check = true` (`skp_projection.rs:628-649`).
  - It sets the real `pub` field, and its doc gives the reason. The seam rule is satisfied.
- **X6: met.**
  - The test reads `StreamPlan::for_publish` (`stream.rs:580`), which is the constructor `stream_for_publish` calls (`:911`).
  - It proves the live decision would compact before it checks the flag (`:2786-2789`).
  - Every Utf8 window carries a NULL: 8/3 covers index 9.
  - The comparison is over `TaggedBatch::assemble` (`:2720-2738`).
  - The Boolean probe outcome is pinned in the `changes` column (`:2768-2776`).
- **X7: met.** The small runs assert `Arc::ptr_eq` (`stream.rs:2619`, `:2646`).
- **X5 note: met.** `LargeUtf8` and `Utf8View` are in the case list (`predicate.rs:1260-1261`).
- **X12: met.**
- **X14, the `SKP_VERSION` doc, the round-7 cite and the flush comment:** see §4.
- **The `skp.rs` quote defect: fixed.** The cite is now round 7, item 1 (`skp.rs:1451-1453`), and round 7 has one item (`state/questions/round-7.md`).
- **X10 → 9.6:** see §3.

## 2. Amendment 8 under the record cap
**It passes.** It has:
- one table;
- a references-and-hashes superseded index;
- the P6 line;
- a one-sentence method note that restates no claim.

Every hash is pinned at `cec34b8`, which is on main (round 15 (e)). Branch-line observations use the words form with their commit (round 25, item 2 (d)). No record calls a `verify-mutation` run an observation.

I spot-checked the pinned report lines against the filed reports, and each carries the claim its row assigns: R2 lines 50, 58-60, 80-85, 90, 115-130 and A2 lines 35, 54, 76, 77. The reviewer recomputes the hashes.

**Two residuals, which I reduce myself (record cap, and my gate 2):**
- The superseded index does not name Amendment 6's X1, X4, X5, X8, X9, X11 and X13 rows. Those rows name no commit (R2-B4), and X4's pairing is false (A2 X4). The same applies to Amendment 7's first paragraph.
- Amendment 9, 9.6 attributes A-E6 to gate 2. A-E6 is gate 1's finding (Amendment 5, preamble and X10 row). That is my own error, and it is an unresolvable reference into gate 2's reports.

**Drafted for the custodian to append as-is, one record-only commit.** The reviewer checks it is append-only against `c9ec02e`; it opens no gate round:

```
### Amendment 10 — 2026-09-27, post-result: the architect's reduction under the record cap (`state/directives/2026-09-18-record-cap.md`)

Class 1 (post-result). References only.

**Superseded as of this amendment**
- Amendment 6, its X1, X4, X5, X8, X9, X11 and X13 rows: Amendment 8's rows of the same names; X4's pairing: Amendment 8's X4 and Class 4 (X4) rows.
- Amendment 7, its first paragraph: Amendment 8's X4 and Class 4 (X4) rows.
- Amendment 9, 9.6's attribution of A-E6 to gate 2: A-E6 is gate 1's (Amendment 5, its X10 row).

P6 sight list (round 12 (e)): read the last amendment first.
```

## 3. Amendment 9's execution
- **Class 9 form: met** (template, Round 25 additions, class 9).
  - The first line reads "scope addition" and cites RULED 2026-09-24 (night), item (2). That is the ledger block's own cite form.
  - It declares §2, §4, §5, §8 and §9.
  - `8b06927` precedes `c9ec02e`.
  - The merge `37b3644` brings main's code, not the addition's. The reviewer confirms that `conformance/` was byte-identical to main's in the merge.
- **9.2: met in the tree.**
  - All nine version fixtures' `spec` names the `skp/0.6` literal.
  - `any-version-skp_0_7`, `any-version-SKP_0_6` and `any-version-skp_0_6SP` (with its trailing space) are present.
  - `"columns": null` appears in exactly the four fixtures of 9.1, and each of their `spec`s gains §8's `skp/0.6` entry.
  - Field-introduction specs (`skp/0.2`, `skp/0.5`) are unchanged, and no `"skp": "skp/0.5"` remains.
  - All five re-pointed cites in `DIVERGENCES.md` resolve: `commands.rs:460-465`, `skp.rs:98-110`, `types.ts:267-268`, `skp.rs:1378-1383` and `skp.rs:982-983`.
  - The A9 clause and the one README sentence are present.
- **9.5's check against `main.rs`'s `check`: met.**
  - `columns` has no `skip_serializing_if` (`commands.rs:434`), so `None` re-serializes to `null` and round-trips value-equal.
  - M-1 (key removed → `null` added on re-serialize) and M-2 (`skip_serializing_if` → key dropped) both discriminate.
- **9.4's declared-unchanged items: met in the tree.**
  - `REPORTED_DIVERGENCES` is still the one id.
  - `expect`, `roundtrip` and `expected_refusal_code` are unchanged on every fixture I read, and the fixture count is unchanged.
  - D1's substance is unchanged.
  - `pass=62 deferred_to_host=15 diverged=1` equals main at `e606af7` (reviewer to confirm from `--nocapture` at a named commit).
- **9.6(b): met** if the reviewer confirms it. X10's realization fails both retention tests by name, so the retention proof has no gap.
- **9.6(a): acceptable as the observation of E-15's mutation, as E-15's doc names it, on three conditions:**
  1. The reviewer's report records the panic's message and site with the commit (round 25, item 2 (c)).
  2. The panic comes from inside the mutated `compact_attribute_slice`, i.e. `MutableArrayData::extend` past the sliced view's length, not from test setup.
  3. No record calls it a failure of E-15's own assertion (`stream.rs:2669`).

  The mutant is not realizable through arrow-data's API: the function only ever sees the 20-row view. Every compaction path kills it, so it proves nothing about E-15's power to discriminate. The property E-15's mutation stands for (whole-chunk retention) is carried by 9.6(b), not by E-15.

  Low: E-15's doc (`stream.rs:2660-2662`) describes a row-count failure path that does not occur. It also still says H3's second clause is false "for nullable columns" (`:2654-2655`), which is incomplete after the Boolean probe. Both go to the follow-up node.
- **Bisect note (low):** the harness is red at `37b3644` and `8b06927`, the four divergences of 9.1. That order is forced by class 9's amendment-before-code rule. Accepted.

## 4. SKP-V0's final state against the code
- **§4 item 13: met.**
  - `skp/0.6` draws the `skp/0.5` paragraph's conclusion: not an instance of the rule.
  - The commit message is marked as paraphrase, which fixes R2-D1.
- **§4 items 1, 2, 3 and 8: true.** The nit that item 3 speaks for `skp/0.5` stands (the worker declined it).
- **§8 Mechanics and §9.1: true for the wire fixtures.**
  - Low: at `c9ec02e` the conformance fixtures also changed for `skp/0.6`. The same enumeration in the `SKP_VERSION` doc (`v0/mod.rs:65-69`) and §4 item 13 does not name that commit.
  - I read "the version's fixtures" as the both-side fixture set named in the same paragraph. The conformance suite describes itself as a proposal, and §4 names a conformance suite absent.
  - Follow-up: one scoping clause.
- **§9.4: matches** `build_viewport_query` (`skp.rs:1537-1545`) and `admit_projection`'s two passes (`attributes.rs:447-502`), including step 4's resolve-before-rules sentence.
- **§9.5: matches** `projection_error_of` (`skp.rs:1486-1525`) field for field, with seven codes. The publish paragraph matches `admit_bundle_format` (`publish/mod.rs:424-444`), which reads the carried source type (`:492`).
- **`SKP_VERSION` doc:** says seven codes, and the commit facts are correct.
- **Doc nits for the follow-up node (low):**
  - `single_run_retention`'s doc (`stream.rs:2264-2266`): the "which never enters … compacting branch" clause attaches to the live stream. It means the other plans.
  - `retain_or_compact_single_run` lost its doc to `single_run_retention`'s (`:2257-2261`).
  - "this function's" in `MAX_ATTRIBUTE_RETENTION_FACTOR`'s doc (`:99`) names a const.
  - A9's "has since merged" is true only from B1's merge.

## Other notes (low, not blocking)
- **Older RECORDED MUTATION comments carry bare self-line cites with no commit:**
  - `skp_projection.rs:301`, `:551`, `:660`, `:778`;
  - `stream.rs:2528`.

  These are not class-3 rows, so round 25, item 2 (d) does not fire. Several are stale: `:551` says `:384`, but the assertion is at `:595`. Follow-up node.
- **§9 suites:** `cargo fmt --check`, the licence audit and the shell E2E suite are required green "before either gate" (prereg §9). No record discharges them; Amendment 3 disclosed the first two as blocked by the environment. The reviewer resolves them from CI at `c9ec02e`. Whatever CI does not cover goes in the PR body as not run, with the reason.
- **Round 25 checks:**
  - no §7 line budget, so class 8 cannot fire;
  - class 9 is recorded, with no code ahead of it;
  - no `verify-mutation` observation;
  - no hash at a branch commit;
  - B1 was full-form from dispatch, so (e) does not apply.

## May B1 open its PR?
**Yes**, once four things hold:
1. The reviewer's gate 3 confirms, at named commits:
   - Amendment 8's line cites and `cec34b8` hashes;
   - M-1 and M-2;
   - 9.6(a) under the conditions above, and 9.6(b);
   - the harness count;
   - `c9ec02e`'s path set;
   - `protocol/data-plane/` empty.
2. CI at `c9ec02e` is green.
3. Amendment 10 is appended.
4. The PR body:
   - asks for a merge commit, never a squash (Amendment 5, 5.4; round 25, item 2 (d));
   - names the words-form reference in Amendment 8's superseded index (lines 273-274 of `engine/src/fixture.rs` at `273a79d`), with its post-merge pin carried by a PLAN node blocked on the piece;
   - lists the sighting items below as pending;
   - contains no sentence calling B1 done (§8 item 17).

## For the human at B1's close (not before this PR)
Per prereg §1 and §9's Operator line, the texts to sight, at `c9ec02e`:
1. `ProjectionError`'s seven wire messages (`engine/src/attributes.rs:189-238`). C-c's reserved-name arm (`:226-230`) has no fixture.
2. `type_check`'s `[B1 close placeholder]` detail (`attributes.rs:398-402`), also carried in `protocol/skp/tests/data/v0-error-projection_type_not_admitted.json`.
3. `filter_surrogate`'s placeholder (`engine/src/predicate.rs:1084-1087`). It is unreachable.
4. The empty-list message (`kernel/src/skp.rs:1455-1456`).
5. The dictionary filter reason (`predicate.rs:1061-1065`), new text by round 17, item 3.

Also for the human:
- **Red line:** ADR-023's acceptance, with condition (2)'s corrigendum and F6's notes.
- **One point to state when the human sights the texts:** rewording item 2 after `skp/0.6` merges changes a committed error fixture's `message` under a frozen literal. SKP-V0 §4 item 13 (iv) freezes the field set, and I read `message` as outside it, so no bump is needed. The human should confirm that reading.

No ADR is needed.

Files:
- `C:/dev/wt/b1-projection/engine/B1-PROJECTION-PREREGISTRATION.md`
- `C:/dev/wt/b1-projection/engine/src/attributes.rs`
- `C:/dev/wt/b1-projection/engine/src/stream.rs`
- `C:/dev/wt/b1-projection/engine/src/predicate.rs`
- `C:/dev/wt/b1-projection/kernel/src/skp.rs`
- `C:/dev/wt/b1-projection/kernel/src/publish/mod.rs`
- `C:/dev/wt/b1-projection/kernel/tests/skp_projection.rs`
- `C:/dev/wt/b1-projection/protocol/skp/SKP-V0.md`
- `C:/dev/wt/b1-projection/protocol/skp/src/v0/mod.rs`
- `C:/dev/wt/b1-projection/protocol/skp/src/v0/commands.rs`
- `C:/dev/wt/b1-projection/protocol/skp/tests/conformance/` (main.rs, fixtures/*.json, DIVERGENCES.md, AMBIGUITIES.md, README.md)
- `C:/dev/spatial-ide/state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-architect.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md`
- `C:/dev/spatial-ide/state/consults/2026-09-27-b1-correction-round-2-worker-report.md`
