Reviewed: PR #262 at 1043a783db52adc4b1ec874f3837908adf72a236, gate 1, architect
Verdict: PASS WITH NOTES
Branch and commit reviewed: cut/verify-cites-past-end-bound @ 1043a783db52adc4b1ec874f3837908adf72a236 (in the worktree C:/dev/wt/pb). B and the form were read in the main checkout.

I have no shell, so I computed no sha256 and ran no command. I could not compute the brief's own hash (4b12f469…). Every check below is a file read. I could not read the PR body (no `gh`), so I did not check its R1 to R5 listing or its "no 13 tokens" rule.

## Findings by class

**Correctness:** none.
**Evidence:** none.
**Documentation (must-fix before merge):** none.
**Red-line or the human's wording:** none touched. The human's ruling of OPEN-1 (B) is applied as its directive line reads, so I have no finding for the human.

**Notes (no class, no action):**
- N1. R2's clause about a merge's second parent depends on how `git log --first-parent -- <path>` judges a merge: against its first parent only. I believe it does this, which makes the clause true. No test covers a merge commit, and I could not run git. The PR and main runs depend on the same behaviour (form note 2).
- N2. The stop report's Scope paragraph calls the overrun "class 8, full-form budget". That is the worker's label in a filed record (evidence). Amendment 2 records it correctly as class 6, under §21b's mid-piece clause. Round 25 item 2's class-8 rule is for the full form, so it does not apply.
- N3. Amendment 2 says the overrun was "first seen at the list commit 7df4983f, 178 lines". That is true of when it was measured. By the reported numstat, the code commit alone already came to 160 (68+88+4). This does not affect the class or the route.
- N4. OPEN-4 covered four branch tips, and the worker also fetched their remote-tracking refs (disclosed in the stop report). This is information only. Whether #249 and #252 had branch tips to check I cannot tell. Under form note 8, an unlisted just-past-end cite on a branch is that branch's own defect.
- N5. I read B's files in the main checkout, now at 89fae2d7. The commits since B are titled as docs commits, but without git I could not confirm that `scripts/plan/verify-cites.mjs`, its test and `governance-ci.yml` are unchanged since B. The reviewer's three-dot diff settles it.
- Considered, not raised: R4 says the list "has gained no entry along its first-parent history", but the oldest commit is excepted. R1, in the same tree, states that exception exactly. The human's design text (directive 2026-10-26-resent…, item 2) uses "gains" in the same forward-looking sense. No PR or main run lets a gain through after the seed, so I do not treat it as an untrue guarantee.

## Check 1: the five lines against the head, and the composition

- **Composition**, form lead against the draft's Draft A and Draft B sections:
  - Scope and Out-of-scope are Draft B's as written; Scope's AUTONOMY pin is expanded.
  - Change is Draft A's line up to "which are not edited.".
  - Tests+mutation is Draft A's M1 to M7 plus its observation sentence.
  - Authority is Draft A's without the fold clause, "both by" read as "by", with the human's ruling added.
  - The ruling's directive line 24 holds the OPEN-1 (B) text. All of this matches the lead.
- **Authority:** holds.
  - The list's `$doc` names the node's directive, item 2. That directive's line 22 gives the design: a closed list keyed on path and cite, and it may only shrink.
- **Scope:** holds.
  - There are four files, matching the reported numstat (yml 3+1, list 18+0, mjs 53+15, test 95+0).
  - The test file only gains lines: one `node:url` import, plus a block appended after the last existing test (head 543-636). No existing test is changed.
  - The budget overrun is Amendment 2's.
- **Change:** holds.
  - The true-count bound in the tree: verify-cites.mjs:278. At a pin: :316.
  - The old bound applies only when `cite.oldBound`. It is keyed on the citing file plus `cite.raw`, which is the token without its pin (:390, :177).
  - The first-parent walk, the subset check, the oldest commit excepted, and an absent list read as empty: :351-361.
  - The shallow-clone failure: :353. It reaches the exit code: :450-454.
  - The list (verify-cites-legacy-bound.json) has 13 entries, all under `state/consults/`. None of those files is in the diff.
- **Tests+mutation:** holds, apart from M1's "alone" (Amendment 1).
  - The seven tests exist at verify-cites.test.mjs:556-636, under the form's names, each with a RECORDED MUTATION at 7df4983f.
  - I traced each mutation against its test by reading:
    - M2 fails its own test and an_out_of_range_reason_for_an_empty_file_counts_0_lines.
    - M3 to M7 each fail only their own test.
  - The file-top inclusive-bound mutation still fails only an_exact_reference_to_the_last_line_of_a_file_is_in_range, because that fixture has no final newline (:129-135).
- **Out-of-scope:** holds; see check 4.

## Check 2: the amendments

- **Amendment 1:** class 2. It says in its first line that it was written after the results.
  - Tests+mutation (form line 9) still says "(alone)" for M1; the prediction is not edited.
  - Its reason holds of the tests as written:
    - Under M1, the empty-file test's cite (line 1, one piece) passes. So does the docs/b.md cite in the M4 test (line 4 of a three-line file ending in a newline, four pieces). Both tests then fail.
    - No other test is reached, because their cites exceed the piece count too (:514-542, :572-576).
  - The comment at :555 states the outcome.
- **Amendment 2:** class 6, "budget deviation, Scope not edited".
  - Its figures (68/95/18/4 = 185) match the build report's numstat.
  - It applies §21b's mid-piece clause (AUTONOMY.md §21b, "Size overrun discovered mid-piece") as written: the five-line form is kept, the Scope line is not edited, and the architect gate is taken beside the reviewer.

## Check 3: the words R1 to R5 at the head

All five are in place word for word (only line wraps differ). Each clause is true of the code.
- **R1**, verify-cites.mjs:15-25:
  - countOf (:254-257) gives the true count and the pieces.
  - Every reason that prints a count prints `.lines` (:283, :289, :317).
  - The legacy disjunct is in both places.
  - The list's key and its failure conditions are as stated (:351-361).
  - "The list holds cites inside filed records" is true of the 13 entries at head.
- **R2**, :72-75:
  - A list entry no longer needed is not reported: there is no such code (OPEN-2 (A)).
  - The history check reads committed history, while the bound reads the working-tree list (:376).
  - The walk uses `--first-parent` (N1).
- **R3**, :247: holds.
- **R4**, governance-ci.yml:22-24: holds; see "Considered, not raised".
- **R5**, :138: placed after the original line 136, now 137. It holds by :353 and :356.

## Check 4: Out-of-scope

- **ADR:** none touched.
- **Security:** standard library and git only, no new dependency. The workflow diff is comments only (yml lines 23-24 and 138); steps, triggers and permissions are unchanged.
- **Wire:** nothing under protocol/.
- **Guarantee:**
  - The inclusive upper bound under test is kept (:129-135, file-top RECORDED MUTATION).
  - No existing test assertion changed: the test file has 0 deletions, and the only lines inside the existing tests are the new import.
  - The header's disclosed limit is narrowed from all such cites (B :67-68) to listed cites (head :72).
  - Other callers are unaffected:
    - verify-quotes imports only helpers whose behaviour is unchanged.
    - rotate-decisions-pending.test runs in a temporary git repo that is not shallow.
    - The only CI caller is governance-ci, with fetch-depth 0.
- **The list:** all 13 entries are in filed records (6 in state/consults/, 7 in state/consults/gates/), and none is edited. By the stop report's enumeration this makes 5 gated and 8 advisory, matching form note 3's expected 13.

## Check 5: the worker's disclosures

None bears on the evidence or the words.
- **M1:** Amendment 1, whose reason is confirmed by my reading in check 2.
- **The overrun:** Amendment 2 (N2, N3).
- **The scratch clone of the base:** a Glob for pb-w-B* under C:/dev/wt finds nothing, so it is removed.
- **The four branch tips:** read from scratch exports, information only (N4).
- **The garbled first draft of the comments:** reverted before any commit. The comments at :555-619 match the build report's copied block.
- **The first verify-quotes run timing out (rc 124):** re-run to rc 0 at both commits.

My own process checks:
- Seam: `legacyListErrors` is exported, and its caller is runVerifyCites, which is product code.
- Operator-visible text: the new FAIL and shallow-clone messages state verify-cites' own facts.

Files read:
- C:/dev/spatial-ide/scripts/plan/VERIFY-CITES-PAST-END-BOUND-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-26-verify-cites-past-end-bound-five-line-form-architect-draft.md (lines 19-48)
- C:/dev/spatial-ide/state/consults/2026-10-27-verify-cites-past-end-bound-worker-stop-report.md
- C:/dev/spatial-ide/state/consults/2026-10-27-verify-cites-past-end-bound-build-worker-report.md
- C:/dev/spatial-ide/state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md
- C:/dev/spatial-ide/state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md (searched)
- C:/dev/spatial-ide/AUTONOMY.md (§21b to §21d)
- B-side (main checkout): scripts/plan/verify-cites.mjs, its test (head), .github/workflows/governance-ci.yml (parts)
- Head (C:/dev/wt/pb): scripts/plan/verify-cites.mjs, scripts/plan/verify-cites.test.mjs (parts), scripts/plan/verify-cites-legacy-bound.json, .github/workflows/governance-ci.yml (lines 1-160)
