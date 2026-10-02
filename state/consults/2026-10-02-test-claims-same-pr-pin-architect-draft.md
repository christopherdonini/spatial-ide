# Consult — the architect's draft for test-claims-same-pr-superseded-pin (2026-10-02)

*Custodian's filing note: one hand-back from the architect agent on the custodian's brief (a drafting consult, not a gate), read at main 44f59c6, recorded verbatim below with the harness's report indentation removed. The draft is NOT committed as a form: it needs the human first (R-1 in its §0; (a) 1 and 2 and (b) B-1 and B-2 below), so it is kept here whole and the node is held. The custodian's checks, at 44f59c6 and on GitHub: verify-test-claims scans only `*PREREGISTRATION*.md` files and ADRs, so this consult's test names bind nothing; and the repository settings read today allow squash and rebase merges as well as merge commits (`gh api repos/<owner>/spatial-ide`: allow_merge_commit, allow_rebase_merge and allow_squash_merge all true), so round 26, item 3's setting change has not landed, which bears on (a) 2.*

---

Drafting consult, not a gate, so no verdict. Read at main @ 44f59c6.

The draft is below. Two problems sit outside it, and both need the human: **B-1** (round 15 (e) forbids the very pin this tool change accepts) and **B-2** (the adopted shape reads the merge record from the wrong node). Both are under (b) after the draft.

```markdown
# verify-test-claims: a superseded pin to a commit the same PR introduces, on a node that records a merge-commit merge (PLAN node `test-claims-same-pr-superseded-pin`) — preregistration

**Authority:** question round 33, item 2 (RULED 2026-10-02 — question round 33). It is cited by round and item and is not reproduced. The binding words are the item's option label. That label adopted the custodian's proposal, `state/drafts/weekly-window-2026-10-02.md:70-94` @ 44f59c6 sha256:<custodian>. The item as asked is `state/questions/round-33.md:12-14` @ 44f59c6 sha256:<custodian>. The proposal comes from the last item of the 2026-09-29 formatting ruling, `state/directives/2026-09-29-a2-1-amendment-12-formatting.md:18-19` @ 44f59c6 sha256:<custodian>. None of these three is the human's words, and nothing below quotes any of them. Node: `PLAN.yaml:3433-3449` @ 44f59c6 sha256:<custodian>.
**Drafted by** the architect agent on the custodian's brief, read at `main` 44f59c6 (the consult: <custodian>). Shape model: `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** <custodian>.
**Before any code:** the human answers R-1 (§0). If the answer leaves round 15 (e) with no exception for the row this tool would accept, the piece stops at I1.
**Gating:** full, under two heads, either enough on its own:
- **A property currently under test.** Condition (e) refuses a rev that is not an ancestor of `origin/main` (`scripts/plan/verify-test-claims.mjs:67-73` @ 44f59c6 sha256:<custodian>). That refusal is tested by `a_pin_whose_rev_is_not_an_ancestor_of_origin_main_does_not_exempt` (`scripts/plan/verify-test-claims.test.mjs:463-483` @ 44f59c6 sha256:<custodian>). This piece narrows it.
- **Size.** The piece is over §21c's bound (§7).

It touches no security posture, no wire and no ADR. Under round 25, item 2 (e), no five-line form is used. AUTONOMY.md §21a: `AUTONOMY.md:315-332` @ 44f59c6 sha256:<custodian>.

## §0. Disclosure
- **Reasoned from code at 44f59c6. Nothing was run.** These parts of the tool are relied on:
  - `originMainSha` and `isAncestorOfMain`, `scripts/plan/verify-test-claims.mjs:323-364` @ 44f59c6 sha256:<custodian>;
  - `findMarkedSpan`, which the superseded and withdrawn paths share, and `findSupersededSpan`, `scripts/plan/verify-test-claims.mjs:366-401` @ 44f59c6 sha256:<custodian>;
  - the withdrawn rows' own condition (e), `scripts/plan/verify-test-claims.mjs:542-563` @ 44f59c6 sha256:<custodian>;
  - the planned set and its sticky binding, `scripts/plan/verify-test-claims.mjs:678-710` @ 44f59c6 sha256:<custodian>;
  - the superseded branch of `runVerifyTestClaims`, `scripts/plan/verify-test-claims.mjs:786-795` @ 44f59c6 sha256:<custodian>, and the plan load in `main`, `scripts/plan/verify-test-claims.mjs:800-815` @ 44f59c6 sha256:<custodian>;
  - the test file's temp-directory sweep, `scripts/plan/verify-test-claims.test.mjs:28-49` @ 44f59c6 sha256:<custodian>, and its bare-remote fixture, `scripts/plan/verify-test-claims.test.mjs:420-461` @ 44f59c6 sha256:<custodian>.
- **Where the gap bites.** This is narrower than the proposal's wording. A claim with no test fails only in a binding file. A file is binding when it is the gate of a done node, and binding is sticky. A PR's own form, gated by its own node that is not done, prints its missing claims as planned and stays green.
  - The check goes red when a PR amends a form that a done node also gates.
  - The motivating case: `engine/B1-PROJECTION-PREREGISTRATION.md` is the gate of `b1-engine-kernel-half` (done, `PLAN.yaml:617-627` @ 44f59c6 sha256:<custodian>). It is also the gate of `b1-close-nul-column-names` (`PLAN.yaml:3185-3195` @ 44f59c6 sha256:<custodian>), whose PR added the claiming lines `engine/B1-PROJECTION-PREREGISTRATION.md:890` @ 44f59c6 sha256:<custodian> and `engine/B1-PROJECTION-PREREGISTRATION.md:897` @ 44f59c6 sha256:<custodian>.
- **R-1: a record rule this tool change does not settle.**
  - Round 15 (e) forbids a hash reference at a branch commit in an append-only record.
  - For a commit-named test-text span, the governing practice is words with no hash until merge, then a pin on main afterwards (`docs/PREREGISTRATION-TEMPLATE.md:174` @ 44f59c6 sha256:<custodian>; `AI_DEVELOPMENT.md:732` @ 44f59c6 sha256:<custodian>).
  - A superseded row that pins a commit of its own PR is a hash reference at a branch commit. This piece makes such a row exempt mechanically. Whether a record may carry one is the human's to rule; this piece does not decide it.
- **Merge strategy on record.**
  - Round 26, item 3: no PR whose commits any record cites is squash-merged. The human also said squash and rebase merging would be disabled in the repository settings.
  - No tracked record confirms that the setting landed. Each recent merge notice reads a two-parent merge commit (`state/directives/2026-10-02-pr152-merged.md:3` @ 44f59c6 sha256:<custodian>).
  - The tool does not read the setting. The node record in §2 is the per-PR record the adopted shape asks for.
- **H1 (hypothesis): what a governance-ci `pull_request` run sees.** HEAD is GitHub's test merge commit, detached, with the base tip as first parent and the PR head as second. `origin/main` resolves to the base branch as fetched.
  - Basis: the job checks out with `fetch-depth: 0` (`.github/workflows/governance-ci.yml:112-120` at 44f59c6, sha256 <custodian>). Also, the run on A2-1's PR refused the pin rather than skipping it, which needs `origin/main` to resolve (`state/directives/2026-09-29-a2-1-amendment-12-formatting.md:3` @ 44f59c6 sha256:<custodian>).
  - Discriminator: E2 and E3 (§4). If it is false, that is invalidator I2.
- **H2 (hypothesis): how `git blame` attributes.** `git blame --porcelain -L <L>,<L> -- <F>`, given no revision, blames the working tree and reports the all-zero id for an uncommitted line. Through a merge commit, it attributes an unchanged line to the parent history that introduced it. Discriminator: T1 and T7. If it is false, that is invalidator I3.
- **What "the scanned HEAD" and `origin/main..HEAD` are:**

  | Context | HEAD | `origin/main` | `origin/main..HEAD` |
  |---|---|---|---|
  | governance-ci `pull_request` | the test merge commit (H1) | the base tip as fetched | the PR's commits plus the test merge commit |
  | governance-ci `push` (path-filtered, any branch) | the pushed tip | main as fetched | the branch's commits not on main; empty on main |
  | local | the checkout's HEAD | the last fetched remote-tracking ref | relative to that ref (see §1 on staleness) |
  | a tree with no `origin/main` | the tree's HEAD | does not resolve | undefined: the new rule is never consulted, and (e) is skipped as today |
- **Fixture drive:** nothing is measured.

## §1. May and may not claim
- **May claim:**
  1. A superseded claim that condition (e) alone refuses today is accepted when, and only when, §2 item 3's (f1) to (f3) all hold. It is then printed under the superseded heading with §7's suffix.
  2. Every other refusal is unchanged: no rev, a non-commit rev, a hex-named ref, a line out of range, a missing or negated marker, a hash mismatch, and a historical line without the name. The withdrawn path, its row-level checks included, is unchanged.
  3. After a merge commit, the same pin is accepted on main by condition (e) alone (T9). After a squash or rebase merge, it is refused on main as a binding finding (T4).
  4. Where `origin/main` does not resolve, the result is unchanged.
- **May not claim:**
  - That a record may carry such a pin (R-1).
  - That the node carrying the record is the PR being scanned. The tool reads PLAN.yaml, not GitHub. The backstop is condition (e) on main after the merge, which fails loudly, never silently (T4).
  - That the PR actually merges as a merge commit. The record is a declaration, and main's own run is the proof.
  - **A stale local `origin/main`.** A commit that landed on main after the last fetch reads as being in range. CI's fetch is authoritative.
  - **A local `blame.ignoreRevsFile`.** It can only refuse, never accept. Blame moves an ignored commit's lines to that commit's ancestors, and every ancestor of a main commit is on main.
  - **A claiming line rewritten in place on the branch.** Blame reads the line's last change. In-place edits to an append-only record are the gate's to catch (round 15 (f)).
  - Shallow clones.
  - macOS: no run is made there (R5).
  - Any `docs/08` figure.
- **Unchanged:**
  - the recognizer, the existence index, `HASH_REF_RE`, `COMMIT_ID_RE`, conditions (r) and (a) to (e) as written;
  - `plannedGateNotes`/`plannedGateFiles`;
  - the withdrawn path;
  - exit codes;
  - `plan.mjs`, `yamlSubset.mjs`, `verify.mjs`, `verify-quotes.mjs`, `verify-cites.mjs` and `.github/workflows/governance-ci.yml`;
  - every existing test's code and its `RECORDED MUTATION` comment;
  - no new dependency.

  ADR-006 does not apply: this is repository tooling. No ADR is amended.
- **Seams:**
  - **GitHub's checkout into the tool** (HEAD and `origin/main`): proven by E2 and E3 from real runs, never by a unit test alone.
  - **PLAN.yaml into the tool:**
    - `main()` passes the result of `mergeCommitGateFiles(plan)` (new export) into `runVerifyTestClaims` as its new option `mergeCommitGates`. `main()` is the product caller of both.
    - T6 parses the record from YAML text with the shipped `parseYamlSubset`, and E2 reads it from a real PLAN.yaml.
  - **git's porcelain blame output into the tool:** T1, on Windows and on ubuntu.

## §2. The change
1. **`mergeCommitGateFiles(plan)`** (exported, pure). It returns the Set of `gate` paths of nodes that meet three conditions:
   - their `status` is not `done`;
   - their `merge` value is exactly the string `merge-commit`;
   - their `gate` is present and not `none`.
   Any other value, or no `merge` key, adds nothing. `validatePlan` is not changed. It already accepts any key (`scripts/plan/plan.mjs:69-179` @ 44f59c6 sha256:<custodian>), and a key it does not recognize can only refuse.
2. **`runVerifyTestClaims({ repoRoot, plannedGates, mergeCommitGates })`.** The new option defaults to an empty Set. `main()` computes it from the plan it already loads for `plannedGates`. When PLAN.yaml fails to load, the set is empty and the existing load error is printed.
3. **The same-PR acceptance, superseded path only.** It is consulted when a span has passed (r) and (a) to (d) and condition (e) has run and refused (`checked: true, ok: false`). It accepts only if all three of the following hold, checked in this order:
   - (f1) F is in `mergeCommitGates`.
   - (f2) `git merge-base --is-ancestor <rev> HEAD` succeeds, so the pinned commit is reachable from the scanned HEAD. That it is not on main is already established by (e).
   - (f3) The claiming line is introduced in `origin/main..HEAD`. `git blame --porcelain -L <L>,<L> -- <F>` (working tree, no revision) names a commit c. The line is in range when c is not the all-zero id and `git merge-base --is-ancestor <c> <origin/main sha>` fails.

   Any git failure in (f2) or (f3) means not accepted. The acceptance is never consulted when (e) is skipped (no `origin/main`) or when (e) holds.
4. **Placement.** `findSupersededSpan` passes the acceptance into `findMarkedSpan`. It is never placed in `isAncestorOfMain`. `findWithdrawnTestSpan` and `withdrawnRowPinCondition` are not touched.
5. **Output.**
   - A superseded entry accepted under item 3 carries `samePr: true`.
   - `main()` appends §7's suffix to that entry's line.
   - Nothing else printed changes.
6. **Cost.** At most three git spawns per candidate claim: (f2)'s merge-base, (f3)'s blame and (f3)'s merge-base.
   - Memoization: (f2) is memoized by (root, rev), and (f3) by (root, F, L).
   - Reached only for a claim that has no test, whose pin passes (a) to (d), whose rev fails (e), and whose file is in the set.
   - No node carries the key at 44f59c6, so the main tree adds no spawn.
7. **The tool's header** gains one paragraph after the SUPERSEDED paragraph, naming the acceptance and this form. It quotes nothing.
8. **`scripts/plan/README.md`** gains one paragraph after the SUPERSEDED paragraph (`scripts/plan/README.md:128-156` @ 44f59c6 sha256:<custodian>) with the same content. It quotes nothing.
9. **`AUTONOMY.md`** gains a dated section appended at the end (§27), never an in-place edit. It names:
   - the node key `merge: merge-commit` and its single value;
   - that the custodian sets it on a node that is not done, when that node's PR will merge as a merge commit (round 26, item 3);
   - that verify-test-claims reads it under this form;
   - that §6a item 3's superseded sentence (`AUTONOMY.md:163` @ 44f59c6 sha256:<custodian>) is read with this acceptance.

   §1 (`AUTONOMY.md:23-67` @ 44f59c6 sha256:<custodian>) and §6a are not edited.
10. **Portability** (`state/directives/PORTABILITY-2026-09-30.md:31-65` @ 44f59c6 sha256:<custodian>):
    - **R1:** one rule on every platform. The inputs are git's output and PLAN.yaml. No path separator, drive letter or case rule is involved.
    - **R2:** no OS-conditional code. This is tooling, not a product boundary.
    - **R3:**
      - Linux (ubuntu-latest, governance-ci): supported and tested.
      - Windows: supported and tested by the worker locally.
      - macOS: no run and no claim.
    - **R4:** the tests take temp paths from `os.tmpdir()`, spawn `git` through `execFileSync` with argument arrays (no shell), and write no drive letter into a path. They name the branch with `git branch -M main` and never rely on `init.defaultBranch`.
    - **R5:** the claim is only that these suites pass on the two platforms that run them.
    - **R6:** no test is ignored on any platform.

## §3. Fixtures and predicted outcomes
Every fixture is a fresh `os.tmpdir()` repository with a bare `origin`, in the existing remote fixture's pattern, and is removed by the file's existing `after()` sweep. The base shape:
- M0 on `origin/main` holds the document.
- Branch `pr` is cut from M0. P1 adds a claim at line L. P2 appends a superseded row pinning `F:L @ P1` with P1's line hash.
- Main then advances by M1, an unrelated file, which is pushed and fetched.

| # | Shape | `mergeCommitGates` | Predicted |
|---|---|---|---|
| S1 | the base, scanned twice: first at HEAD = `pr` tip, then at HEAD = a detached `--no-ff` merge of `pr` into `origin/main` | {F} | superseded, `samePr: true`, 0 findings, in both |
| S2 | a sibling branch from M0 adds the identical claim line at Q1; `pr`'s P1 adds the claim and P2 pins `F:L @ Q1` | {F} | 1 finding |
| S3 | the claim line is on M0; `pr`'s P1 touches another file; P2 pins `F:L @ P1` | {F} | 1 finding |
| S4 | S1, then `git merge --squash pr` committed on main as S, pushed and fetched; HEAD = main; the `pr` ref is kept | {F} | 1 finding |
| S5 | S1 | empty | 1 finding |
| S6 | YAML text: an in-progress node with gate A and `merge: merge-commit`; a done node with gate B and the key; an in-progress node with gate C and `merge: squash`; a ready node with `gate: none` and the key; an in-progress node with gate D and no key | — | {A} |
| S7 | S1 at the `pr` tip, plus an uncommitted edit to line L that keeps the name | {F} | 1 finding |
| S8 | a withdrawn row at a `pr` commit, in the file's existing row shape, with its ruling and carrier resolving against the synthetic ledger | {F} | a row-level finding, `refused: rev not on main` |
| S9 | S1, then a `--no-ff` merge of `pr` on main, pushed and fetched; HEAD = main | empty | superseded without `samePr`, 0 findings |

## §4. Tests, one mutation each (`scripts/plan/verify-test-claims.test.mjs`)
- **How a mutation is observed:** apply it, run the named test, record the first failing assertion in the test's `// RECORDED MUTATION:` comment, then revert. The commit it was observed at is named in the closing record. A `verify-mutation` run is not an observation.
- **No timing.** No sleep, timeout or timing assertion. No existing helper is edited; one new base-shape helper is added.

| # | Test | Shape | Mutation |
|---|---|---|---|
| T1 | `a_same_pr_superseded_pin_is_advisory_on_the_branch_and_on_its_test_merge` | S1 | M1: `findSupersededSpan` never passes the acceptance |
| T2 | `a_same_pr_pin_to_a_commit_outside_the_range_does_not_exempt` | S2 | M2: (f2) dropped |
| T3 | `a_same_pr_pin_whose_claiming_line_predates_the_range_does_not_exempt` | S3 | M3: (f3) dropped |
| T4 | `a_same_pr_pin_after_a_squash_merge_stays_a_binding_finding` | S4 | M4: the acceptance reduced to (f1) alone |
| T5 | `a_same_pr_pin_without_the_merge_commit_record_does_not_exempt` | S5 | M5: (f1) dropped |
| T6 | `the_merge_commit_gate_set_reads_only_not_done_nodes_with_the_exact_value` | S6 | M6: the not-done filter dropped from `mergeCommitGateFiles` |
| T7 | `an_uncommitted_claiming_line_is_not_introduced_in_the_range` | S7 | M7: (f3) blames `HEAD` instead of the working tree |
| T8 | `a_withdrawn_test_row_at_a_same_pr_commit_still_fails_by_name` | S8 | M8: the acceptance moved into `isAncestorOfMain` |
| T9 | `a_same_pr_pin_after_a_merge_commit_holds_on_main_without_the_record` | S9 | M9: `isAncestorOfMain` reports not-an-ancestor whenever `origin/main` resolves (not isolated; the existing condition-(e) test's on-main half fails too, as recorded) |

- **End-to-end runs from the real shape (the seam rule).** The worker records each run's id.
  - **E1:** this PR's own governance-ci `pull_request` run, green at the head marked ready.
  - **E2 and E3:** a draft probe PR from branch `probe/test-claims-same-pr-pin`, cut from the piece's head. It is never merged and is closed after E3. The piece's branch never carries its commits.
    - Its first commit adds a probe preregistration under `scripts/plan/` whose line 3 claims one test that does not exist. It also adds a proposed PLAN node gating that file with `merge: merge-commit`, and regenerates the generated set.
    - Its second commit appends a superseded row pinning that line at the first commit.
    - **E2:** the second commit's run is green. The checkout step's log shows HEAD at a merge commit (H1). verify:test-claims lists the probe claim under the superseded heading with §7's suffix.
    - **E3:** a third commit removes the key and regenerates. The run is green, and the probe claim is listed under planned, not superseded.
    - The probe's claim name is never written in backticks in any tracked record.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:**
  - T1 to T9 pass at the fix, and each fails under its own mutation.
  - Every existing test passes unchanged.
  - E1 to E3 come out as §4 predicts.
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` is green on Windows and in governance-ci.
- **Declared unchanged:** §1's Unchanged list.
- **Invalidators:**
  - **I1 (stop, to the human):** R-1 is unanswered at the first code commit, or it is answered with no exception.
  - **I2 (stop):** E2 shows HEAD not at a merge commit, or `origin/main` unresolved (H1).
  - **I3 (stop):** T1 or T7 fails at the fix because of blame's attribution (H2).
  - **I4 (stop, to the custodian):** the change needs an edit to any of the following:
    - conditions (r) or (a) to (e);
    - the withdrawn path;
    - `plannedGate*`;
    - the recognizer or the existence index;
    - `plan.mjs`, `yamlSubset.mjs`, `verify.mjs`, `verify-quotes.mjs` or the workflow.
  - **I5 (stop):** a test needs a platform ignore, a shell spawn, a drive letter in a temp path, or a timing assertion.
  - **I6 (stop):** an existing test fails, or its code needs an edit.
  - **I7 (stop):** the file count goes past §7's.
- **Falsification:** any of the following.
  - A pin is accepted while any of (f1) to (f3) fails.
  - A withdrawn row is accepted at a commit that is not on main.
  - A pin is accepted on main after a squash.
  - Any result changes where `origin/main` does not resolve.

## §6. Instruments
Assertions only:
1. The `findings`, `superseded` (with `samePr`) and `withdrawn` arrays of `runVerifyTestClaims`.
2. The returned Set of `mergeCommitGateFiles`.
3. E1 to E3's run ids, the checkout log's HEAD line, and the superseded and planned listings.
4. `git --version` and `node --version` on each platform that runs the suites (round 15 (c)).
5. `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify-mutation` and `verify:plan`, each named with the tool's commit.

## §7. Declared values and ceilings
- **PLAN key:** `merge`, whose only accepted value is `merge-commit`.
- **Entry field:** `samePr: true`.
- **Suffix** on a superseded line accepted under §2 item 3: ` — pin not yet on main; same-PR claim, merge-commit node`.
- **The git argument sets:**
  - `merge-base --is-ancestor <rev> HEAD`;
  - `blame --porcelain -L <L>,<L> -- <F>`;
  - `merge-base --is-ancestor <c> <origin/main sha>`.
- **Size budget:** ≤ 650 changed lines, insertions plus deletions, over ≤ 3 counted files: `scripts/plan/verify-test-claims.mjs`, `scripts/plan/verify-test-claims.test.mjs` and `scripts/plan/README.md`. AUTONOMY.md §27 is excluded as a governing-doc sentence the piece is obliged to add (`AUTONOMY.md:357` @ 44f59c6 sha256:<custodian>).
  - Counting command: `git diff --numstat <merge-base>...<head> -- . ':!scripts/plan/TEST-CLAIMS-SAME-PR-SUPERSEDED-PIN-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**' ':!AUTONOMY.md'`, run at a named commit.
  - An overrun is class 8, and this line is never edited to match.
  - Estimate: about 80 tool lines, 420 test lines and 10 README lines.
- **Minutes:** <custodian>.

## §8. Block-on-sight
1. The acceptance is reachable from the withdrawn path, or it is placed in `isAncestorOfMain`.
2. Any change to conditions (r) or (a) to (e) as written, to the recognizer, to the existence index or to `plannedGate*`.
3. The acceptance is consulted when `origin/main` does not resolve, or when (e) holds.
4. `blame` is run with a revision, or a git failure is read as acceptance.
5. A file outside §7's three, apart from this form, AUTONOMY.md §27 and the custodian's generated set.
6. Any probe commit, probe file or probe node at the gated head or on main.
7. A test that is ignored on a platform, uses a shell, puts a drive letter in a temp path, asserts timing, or leaves its temp directory behind.
8. A quotation in the tool's header, the README paragraph, §27 or the new tests' comments.
9. A new export or option with no product caller.
10. A record that calls a `verify-mutation` run an observation, or a mutation recorded without its commit in the closing record.
11. A §7 overrun not recorded as class 8, or §7 edited; any code of a scope addition before its class 9 amendment.
12. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit, unless R-1's answer makes an exception that covers it;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id;
    - a bare self-line;
    - reproduced text without its path:line and hash;
    - a correction round without its superseded index;
    - a post-result amendment whose first line does not say so.
13. A squash or rebase merge.
14. Any user-profile path anywhere in the diff.

## §9. Gates
- **Architect:**
  - the Gating line's two heads;
  - round 33, item 2 against §2;
  - round 15 (e) and R-1's answer;
  - round 26, item 3;
  - round 25, item 2;
  - the seam reading and the caller rule (§1);
  - the round 7 ruling on operator-visible text (§7's suffix states the tool's own fact);
  - R1 to R6;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - M1 to M9 observed;
  - E1 to E3 read by run id;
  - §7 recounted.
- **Suites, green before either gate:**
  - the `node --test` scripts suite on Windows, and governance-ci on ubuntu-latest;
  - §6 item 5's tools, each with its commit;
  - branch CI read before gating.
- **Operator:** none.

## §10. Amendments (opens empty, append-only; classes 1 to 9; each correction round ends with a superseded index)
```

**(a) Open points, with my recommended reading**
1. **R-1 needs the human before the form is committed.** I recommend asking first, as one item: read round 33, item 2 as a narrow exception to round 15 (e). The exception would cover only a superseded row whose claiming line and pinned commit both come from the scanned PR, on a node that records `merge: merge-commit`. Without that exception, every record that would use the new path fails the gate by name. The code would then have no product use, and the caller rule blocks it.
2. **The merge record mechanism.** The record offers none today, and PLAN.yaml has no merge field. I recommend the smallest option: the node key `merge: merge-commit`. It needs no change to the `plan.mjs` schema, because unknown keys already pass and a typo can only refuse. It does need one appended AUTONOMY.md §27, because setting a key is not among the custodian's permitted edits in §1. The alternative is to treat round 26, item 3's repository setting as a record that holds globally. That drops the node condition, which departs from the adopted shape and is the human's call. No record confirms the setting landed.
3. **E2 and E3 need a draft probe PR,** because the seam is the shape of the synthetic merge ref. A probe pushed without a PR would not prove H1. I recommend the draft PR, never merged.
4. **Budget.** The node declares 90 minutes. With nine git-fixture tests and the probe, I recommend 180.
5. **R-1 text, if it is ruled.** If the human makes the exception, one sentence citing round 33 and the item joins §27 as an obliged governing-doc sentence.

**(b) Where the record contradicts the adopted shape**
- **B-1.** The shape accepts a hash pin at a branch commit. Round 15 (e) forbids that in an append-only record. Round 25 (d) (`docs/PREREGISTRATION-TEMPLATE.md:174`) and `AI_DEVELOPMENT.md:732` prescribe words until merge and a pin on main after it. Every recent form's §8 also lists "a hash reference at a branch commit" as block-on-sight.
- **B-2. "The node the file gates" is the wrong node.** In the motivating case, the file is gated by a done node whose PR merged long ago (#134) and by the node whose PR is scanned. Read literally, the record would sit on a node whose PR has already merged. I read it as "a node that is not done and whose gate is F". A PR that amends a done node's form while its own node gates a different file is then refused. That is fail-closed, and it is disclosed in the draft.
- **B-3. The draft overstates where the check stays red.** It says the PR's check stays red until merge. That happens only when the claiming file is binding, meaning a done node gates it. A PR's own form prints its missing claims as planned.
- **B-4. Two listed fixtures are the same case by definition.** "A pin outside the range" and "a pin not reachable from HEAD" cannot differ, because a commit reachable from HEAD and not from origin/main is in the range. I split them into T2 (a commit on a sibling branch, PR shape) and T4 (after a squash, main shape).

**(c) Routed items for other nodes**
- **A post-merge proof (optional new node).** verify:plan could check that a done node carrying `merge: merge-commit` names a PR that GitHub reports merged with a two-parent commit. Condition (e) on main already fails loudly, so this is optional.
- **Dot-path pins.** The `.github/` references stay in plain text, for the existing node `governance-hash-grammar-shared`.
- **`workspace-rustfmt`.** Its `.git-blame-ignore-revs` cannot widen this rule, because ignored revisions can only make it refuse (§1). No action is needed.

The files this draft cites:
- C:\dev\spatial-ide\scripts\plan\verify-test-claims.mjs
- C:\dev\spatial-ide\scripts\plan\verify-test-claims.test.mjs
- C:\dev\spatial-ide\scripts\plan\README.md
- C:\dev\spatial-ide\scripts\plan\plan.mjs
- C:\dev\spatial-ide\.github\workflows\governance-ci.yml
- C:\dev\spatial-ide\AUTONOMY.md
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
- C:\dev\spatial-ide\AI_DEVELOPMENT.md
- C:\dev\spatial-ide\PLAN.yaml
- C:\dev\spatial-ide\engine\B1-PROJECTION-PREREGISTRATION.md
- C:\dev\spatial-ide\state\drafts\weekly-window-2026-10-02.md
- C:\dev\spatial-ide\state\questions\round-33.md
- C:\dev\spatial-ide\state\directives\2026-09-29-a2-1-amendment-12-formatting.md
- C:\dev\spatial-ide\state\directives\2026-10-02-pr152-merged.md
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
