*Custodian's filing note (2026-10-02): the reviewer's gate 1 on PR #156, for PLAN node `test-claims-same-pr-superseded-pin`, full gating. Reviewed: cut/test-claims-same-pr-pin @ 7bff7c1bcc47d3d1c00f6595f0350e0353b2c605 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 7bff7c1. Verdict FAIL on S1-1, which is the architect's S1-1 found independently and reproduced without mocks. Its fix, T10 and M10 come by the form's Amendment 1 (class 9, branch commit 0ce47aa). S2-1 (T1's merge half reads from caches) and N-3 are taken in the same correction round. Profile paths redacted at filing: none.*

---

VERDICT: FAIL. Reviewed cut/test-claims-same-pr-pin @ 7bff7c1bcc47d3d1c00f6595f0350e0353b2c605 (gate 1, reviewer, PR #156, node `test-claims-same-pr-superseded-pin`).

All cites below are read at 7bff7c1. The worktree was left clean (`git status --short` is empty), and no background process is left running.

## Blocking

**S1-1. In (f3), a git error is read as acceptance. This hits §8 item 4, and §2 item 3's last paragraph ("Any git failure in (f2) or (f3) means not accepted").** I found this independently; it matches the architect's S1-1, filed on main at 513cb05.
- Where: `scripts/plan/verify-test-claims.mjs:448`. The line negates `gitSucceeds(root, ['merge-base', '--is-ancestor', c, mainSha])`, and `gitSucceeds` (`:413-420`) returns false for every non-zero exit.
- Exit codes observed with git 2.49.0.windows.1: `merge-base --is-ancestor` gives 0 when it is an ancestor, 1 when it is not, and 128 on an error (`fatal: Not a valid commit name …`). The code reads 128 as "not an ancestor", which counts as "in range", so the pin is accepted.
- Reproduced end to end, with no edit to the worktree, using a scratch script that imports the shipped module:
  - The fixture: a temp repo where `pr`'s P1 adds the claim and P2 adds a superseded row pinning P1. `.git/refs/remotes/origin/main` names an object the repo does not have, so `rev-parse origin/main` resolves and every merge-base against it exits 128.
  - Result: `runVerifyTestClaims({ mergeCommitGates: {F} })` returns 0 findings and the pin as superseded with `samePr: true`. Without the record, the same tree gives 1 finding.
  - So the acceptance is reached through two git errors: condition (e)'s own refusal, which is fail-closed as before, and then (f3)'s inversion.
- Two statements are false at this commit:
  - the comment at `scripts/plan/verify-test-claims.mjs:433` ("Any git failure is false");
  - `scripts/plan/README.md:164` ("Any git failure is not acceptance").
- Fix: treat the line as in range only when the spawn throws with `status === 1`; every other outcome is false. The fixture above can be tested without mocks (write the ref file directly), so the correction can carry a test and its own recorded mutation (any non-zero exit read as not-an-ancestor), observed at the corrected commit. Re-observe M3 and M7 there as well, since both mutate this function.

## Suggestions

**S2-1. T1's test-merge half never runs (f2) or (f3) at a merge HEAD. It reads both from the module-level caches that its own branch half filled.** §0 H2 names T1 as the discriminator for blame attributing a line through a merge commit. As written, T1 does not test that.
- Where: the caches are at `scripts/plan/verify-test-claims.mjs:423-428` and `:434-454`, keyed by (root, rev) and (root, F, L). T1 is `scripts/plan/verify-test-claims.test.mjs:1451-1471` and scans the same `dir` twice.
- Proof (temporary edits, each reverted with `git checkout --`):
  - A probe that refuses (f3) whenever `HEAD^2` exists, placed after the cache read: T1 passes.
  - The same probe placed before the cache read: T1 fails.
  - With both caches bypassed, all 9 new tests pass. So H2 does hold locally on Windows (git 2.49.0.windows.1); the test just doesn't prove it.
- Fix: scan the test merge from a distinct root, for example a `git worktree add --detach` or a clone of the fixture. Otherwise the closing record must say that E2 alone discriminates H2's merge clause.
- The memoization itself matches §2 item 6 and is sound for the single-shot CLI, since `main()` is the only product caller.

## Notes

**N-1. E2 deviation (worker deviation 1, a93090c). It weakens neither E2 nor E3; I agree with the architect's N-1.**
- a93090c's parents are fa9a40d and 7b45af8. Its diff against fa9a40d touches only main's files and the generated set.
- The probe form is byte-identical between fa9a40d and a93090c (a 0-line diff), and the probe node at a93090c is intact.
- 880a13a is not an ancestor of 4952b6f (E2's base) or of origin/main at 513cb05.
- The extra merge in the PR range means blame crossed two merges and still credited 880a13a. That is a stronger case for H2, not a weaker one.
- The departure from §4's wording ("the second commit's run") stands: the run's head is a93090c, and the test merge is 76c6bfff. The closing record should name both.

**N-2. E1 now exists.** PR #156's pull_request run 37006006063 ran at 7bff7c1 and succeeded.
- Checkout: `HEAD is now at dcfb49ff Merge 7bff7c1bcc47d3d1c00f6595f0350e0353b2c605 into cecb40673bc4f1bf060c0b9e03ce0723730ba82b`.
- Results: 375 tests, all pass. verify:test-claims PASS: 463 claimed, 13 planned, 7 superseded, 17 withdrawn. No line carries the suffix, which is right because no node carries the key.
- It must be re-read at the head marked ready after the correction.

**N-3.** The doc comment of `findMarkedSpan` (`scripts/plan/verify-test-claims.mjs:376-389`) still describes a `{ span, mainUnchecked }` return. It names neither the `samePrAccept` parameter nor the `samePr` field.

**N-4.** Rebase is not tested; only squash is (T4). I agree with the architect's N-3. `AUTONOMY.md:500` and §1 May-claim 3 say "squash or rebase", and the closing record must not call rebase tested.

**N-5.** The new caches use `JSON.stringify([...])` as a key, while `isAncestorOfMain` uses a `\u0000` join. This is repository tooling, not a data path, so ADR-004 is not engaged. It is a consistency nit only.

## Item 1: the diff against §2 and §7
- **`mergeCommitGateFiles`** (`:777-785`): all three conditions are as specified (not `done`, `merge === 'merge-commit'` exactly, gate present and not `none`), and the function is pure. T6 builds its plan from YAML with the shipped `parseYamlSubset`.
- **The option and its caller:** `mergeCommitGates` defaults to an empty Set (`:823-826`). `main()` (`:879-896`) computes it inside the existing load try-block, so a failed load leaves it empty and prints the existing error. A grep finds no non-test caller other than `main()`, and `main()` is a product caller. §8 item 9 is clear.
- **(f1), (f2), (f3) in order:** they are short-circuited in that order (`:456-461`). They are consulted only inside `if (anc.checked && !anc.ok)` (`:401-406`), never when (e) is skipped or holds.
- **`blame` with no revision:** confirmed (`:441`), and M7 confirms it.
- **Git failures:** (f2) and the blame spawn read a failure as false. (f3)'s last merge-base does not (S1-1).
- **Placement:** the acceptance sits only in `findSupersededSpan`. `findWithdrawnTestSpan` (`:561`) passes no acceptance, and `isAncestorOfMain` and `withdrawnRowPinCondition` are unchanged. The test diff has no deleted lines.
- **`samePr` and the suffix:** `samePr: true` is set only on accepted entries (`:867`). `SAME_PR_SUFFIX` (`:877`) is byte-identical to §7's suffix, compared programmatically: it starts with a space and then U+2014.
- **Memoization:** as §2 item 6 specifies (see S2-1).
- **Header and README paragraphs:** the header paragraph is at `:84-92`. The README paragraph is at `scripts/plan/README.md:158-168`, after the SUPERSEDED paragraph. Neither quotes anything.
- **AUTONOMY.md §27** (`AUTONOMY.md:492-500`) meets §2 item 9:
  - it is appended at the end with 10 insertions and 0 deletions;
  - it names the key and its single value, the custodian's role (round 26, item 3), the reader, and the §6a item 3 reading;
  - it names the exception by round and item (round 34, item 4), and the row shape it states matches that ruling's Applied text in the RULED block;
  - it contains no quotation.

## Item 2: M1 to M9, re-observed
Each mutation was applied and the full file run (64 tests), then reverted with `git checkout --`. Every first failing assertion matches its RECORDED MUTATION comment.

| Mutation | Failing tests | Pass / fail | First failing assertion |
|---|---|---|---|
| M1 | T1 only | 63/1 | findings `[{…"kind":"claim"}]`, `1 !== 0` |
| M2 | T2 only | 63/1 | "a pin to a commit the scanned HEAD does not contain must not exempt: …" |
| M3 | T3 and T7 | 62/2 | "a claiming line already on main must not exempt: …" |
| M4 | T4, T2, T3 and T7 | 60/4 | T4: "after a squash the pinned commit is not on main and must not exempt: …" |
| M5 | T5 and `a_pin_whose_rev_is_not_an_ancestor_of_origin_main_does_not_exempt` | 62/2 | "no merge-commit record, no exemption: …" |
| M6 | T6 only | 63/1 | deep-equal with the extra element `'b/B-PREREGISTRATION.md'` |
| M7 | T7 only | 63/1 | "an uncommitted claiming line is in no commit's range: …" |
| M8 | 7 tests (below) | 57/7 | T8: withdrawn array `[…"ruling":"round 1, item 1","carrier":"round 2, item 5"}]`, `1 !== 0` |
| M9 | T9 and the existing condition-(e) test | 62/2 | T9: findings `1 !== 0` |

- M8's seven failures include `a_withdrawn_test_row_whose_rev_is_not_on_main_fails_by_name` and `a_pin_whose_rev_is_not_an_ancestor_of_origin_main_does_not_exempt`.
- Under M9, the existing condition-(e) test fails on "an ancestor-of-main rev must exempt", which is its on-main half.
- The worker's isolation notes are accurate for all nine mutations.

## Items 3 to 7
- **Item 3, the suites:** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` exited 0: 375 tests, 375 pass, 0 fail, 0 skipped. `verify-test-claims.test.mjs` alone: 64 of 64 pass.
  - Temp directories: the new tests leave no `verify-test-claims-samepr*` directory behind.
  - Other `verify-test-claims-*` leftovers in the OS temp directory come from other processes and predate this piece; the count moved while I watched.
- **Item 4, E2 (run 37005296152):** a pull_request run on `probe/test-claims-same-pr-pin`, head a93090c, success.
  - Checkout: `HEAD is now at 76c6bfff Merge a93090c5d8cc5e3af61b6d4dd2b3dde3e7ce25fd into 4952b6fe9eaa28308e192303117dec604cc1aabc`. H1 holds.
  - Listing: `scripts/plan/PROBE-SAMEPR-PREREGISTRATION.md:3` appears under superseded, pinned at 880a13a, with the suffix. I checked the suffix bytes with `od` against §7.
  - Result: PASS with 464 claimed, 13 planned, 8 superseded, 17 withdrawn.
- **Item 4, E3 (run 37005569762):** head 06ae5d2, success.
  - Checkout: `HEAD is now at ea1ce3bf Merge 06ae5d2a44e54ef1de1ab51c8be8fb9dcf93d975 into a0f0da77df77bef0c737cd835def556aaa882ce3`.
  - The probe line is listed under planned ("node probe-test-claims-same-pr is proposed"), and no line in the run carries the suffix.
  - Result: PASS with 14 planned and 7 superseded.
  - 06ae5d2's diff against a93090c removes the key and regenerates the generated set, nothing else.
- **No probe artefacts:** at 7bff7c1 there is no PROBE file and no probe node, and none of the branch's commits is on origin/main.
- **Item 5, §7 recount:** §7's own command at base 01b5ba0 (the merge-base) and head 7bff7c1:
  - `scripts/plan/README.md` 12/0, `scripts/plan/verify-test-claims.mjs` 94/12, `scripts/plan/verify-test-claims.test.mjs` 236/0;
  - total 354 changed lines over 3 files, against ≤ 650 and ≤ 3. No overrun.
  - AUTONOMY.md (10/0) is excluded as §7 allows.
- **Item 6, branch CI:** `gh pr checks 156` exited 0, and all four checks pass:
  - signed-off (run 37006006130);
  - profile-path scan (run 37006006043);
  - governance, push (run 37004757724);
  - governance, pull_request (run 37006006063).
  - `mergeable` read UNKNOWN. Main has moved to 513cb05 since CI's base, cecb406.
- **Item 7, the verify tools:** each run at 7bff7c1 after a `git fetch -q origin` in the worktree (remote-tracking refs only), with origin/main at 513cb05. Each exit code was captured directly; the tool's last-change commit is in brackets.
  - `verify-cites` 0 [522e448]
  - `verify-quotes` 0 [f9444a4]
  - `verify-test-claims` 0 [0e20437]
  - `verify-mutation --base 01b5ba0 --head 7bff7c1` 0 [7d24ed1]. All 9 new tests are named in a RECORDED MUTATION comment. This is a naming check, not an observation of a mutation.
  - `verify.mjs` (verify:plan) 0 [2607202]

## Versions and other runs
- node v24.18.1 and git version 2.49.0.windows.1, on Windows 10.
- `gh run view --log` for runs 37005296152, 37005569762 and 37006006063: exit 0 each.
- Temporary edits, all reverted with `git checkout --`:
  - M1 to M8, applied by a scratch replacement script;
  - M9, applied inline;
  - two cache probes and one cache bypass for S2-1.
- The S1-1 reproduction was a scratch script that imports the module read-only. Its temp repo was removed.
