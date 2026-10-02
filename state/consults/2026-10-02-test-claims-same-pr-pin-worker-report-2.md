# Worker report 2 — test-claims-same-pr-superseded-pin (2026-10-02)

*Custodian's filing note: the worker's hand-back on correction round 1 for PLAN node `test-claims-same-pr-superseded-pin` (form `scripts/plan/TEST-CLAIMS-SAME-PR-SUPERSEDED-PIN-PREREGISTRATION.md`, its Amendment 1 at branch commit 0ce47aa), recorded verbatim below with the harness's report indentation removed. No rooted `path:line` cite needed de-rooting; nothing in the text is changed.*

*The custodian's checks:*
- *branch `cut/test-claims-same-pr-pin` at 270bc75, its three new commits read from origin (a758290, e9735d4, 270bc75);*
- *the diff over 7bff7c1..270bc75 is 3 files (the form with its Amendment 1, `verify-test-claims.mjs` and its test file), 49 insertions and 7 deletions;*
- *PR #156's checks at 270bc75: 4 of 4 pass (runs 37008641322, 37008641320, 37008637568, 37008641345).*

*Profile paths redacted at filing: none.*

---

Correction round 1 is done on `cut/test-claims-same-pr-pin` (head 270bc75, pushed, tree clean). No force-push, no `--no-verify`. I did not edit the form and I read its Amendment 1 (pulled at 0ce47aa).

**Commits** (model: Claude Opus 5.5)
- a758290 test: T10 `a_git_error_in_the_range_check_does_not_exempt`, plus T1's test-merge half scanned from a distinct root. T1 now uses a `git worktree add --detach` of the fixture, in a separate `mkdtemp` directory, so (f2) and (f3) run there instead of reading the branch half's caches. Its name is unchanged.
- e9735d4 fix: (f3) now reads the range check as "in range" only when `merge-base --is-ancestor` exits with status 1. A new `gitExitStatus` helper uses `spawnSync`, and any other outcome, including exit 128, is not accepted. `findMarkedSpan`'s doc comment (N-3) now names `samePrAccept` and the `samePr` field, with no quotes. The "any git failure is false" comment and the README line are true as written, so I did not touch their wording.
- 270bc75 test: the M10 comment, plus a one-line re-observation note on M3.

**T10 at the test-only commit a758290:** it fails before the fix. The pin is accepted with `"samePr":true`, so the assertion "a git error is not a proof the line is introduced in the range" fails with `1 !== 0` (superseded was 1, expected 0). Setup: the S1 base shape, then `.git/refs/remotes/origin/main` is overwritten with a well-formed 40-hex id the repository does not have, with the merge-commit record set. `verify-test-claims.test.mjs` was 64 pass, 1 fail at that commit.

**Re-observations, all at e9735d4** (apply, run, revert; Node v24.18.1, git 2.49.0.windows.1)
- M1 (T1 as changed): the first assertion is unchanged, findings `1 !== 0`. Isolated, 64 of 65 pass.
- M3: the first assertion is unchanged ("a claiming line already on main must not exempt…"). It now also fails T10 and T7, so 62 of 65 pass. I added a one-line note to the M3 comment to record this.
- M7: the first assertion is unchanged. Isolated, 64 of 65 pass.
- M10 (`=== 1` becomes `!== 0`): the first failing assertion is "a git error is not a proof the line is introduced in the range: [{...,"samePr":true}]" then `1 !== 0`. Isolated, 64 of 65 pass. It is written into T10's RECORDED MUTATION comment, which names the test.
- Each mutation was reverted, and the full file is 65 of 65 pass at the final head.

**Checks at 270bc75** (exit codes taken directly)
- Scripts suite (`node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`): 376 tests, 376 pass, 0 fail, exit 0.
- `verify-test-claims` 0, `verify-cites` 0, `verify-quotes` 0.
- `verify-mutation --base origin/main --head HEAD` 0.

**§7 count** (merge-base of `origin/main` and HEAD): `README.md` 12/0, `verify-test-claims.mjs` 108/15, `verify-test-claims.test.mjs` 256/0, which is 391 changed lines over 3 files. That is within ≤ 650 and ≤ 3.

**Open points:** none new. The earlier comment counts on M2 to M9 ("63 of 64") still describe 0e20437 and stay as recorded. I have not looked at CI on the three new commits.
