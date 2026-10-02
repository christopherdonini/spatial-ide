# Worker report 3 — exposure-scan-ci-backstop, correction round 2 (2026-10-02)

*Custodian's filing note: the worker's hand-back on correction round 2 for PR #153: the reviewer's gate-2 S2-1, N-1 and N-3. It is recorded verbatim below with the harness's report indentation removed. Branch `cut/exposure-scan-ci-backstop` at 0e07e55. The custodian then appended the form's Amendment 2 as 65793d6. The custodian's checks: the diff from e0442e0 to 0e07e55 is 13 insertions and 8 deletions over the workflow header comment and the test file.*

---

Correction round 2 is done: two comment-only commits on `cut/exposure-scan-ci-backstop`, pushed, head 0e07e55. I did not touch the form.

**Commits**
- c0277fc (`docs:`):
  - `.github/workflows/exposure-scan.yml` (+4/-3): the flattened-form item now says it is caught, if at all, only by the hooks of an armed clone under that person's own home, and the paths-filter paragraph is re-wrapped. No workflow line passes 100 columns.
  - `scripts/hooks/profile-path-scan.test.mjs` (+6/-3): T7's abort sentence is rewritten to name the scoped edit and the observation.
- 0e07e55 (`test:`, one extra commit you did not ask for): c0277fc made `verify-mutation` report T8 as having no mutation naming it. The longer T7 comment pushed T8's mutation text outside the tool's 500-character window. T8's comment now carries the test's name, as T1's does. The recorded observation is unchanged.

**Scoped-abort observation, at e0442e0 plus the scoped edit**
- The edit, in `stagedAddedLinesAgainst`: `if (runGit(['rev-parse','-q','--verify','HEAD'], cwd) !== null) args.push('--bogus-option');` before the diff call. It is not committed and the scanner is reverted.
- The init commit passed and the `commit refused` assertion passed.
- The finding assertion failed, at test line 1297 in that run, with git's usage text as stderr instead of `link:1 unlisted-segment`.
- `git status --porcelain` is empty after the revert, and still empty at the end.

**Checks at 0e07e55**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0, 366 tests, 366 pass, 0 fail.
- `verify-mutation --base origin/main --head HEAD`: rc 0, PASS 13 of 13. It had rc 1 at c0277fc, which is why 0e07e55 exists.
- Both exit codes were captured directly, not through a pipe.

**§7 count (merge base 422f8f8, head 0e07e55)**
- 558 changed lines over 3 files, within the 800 budget.
