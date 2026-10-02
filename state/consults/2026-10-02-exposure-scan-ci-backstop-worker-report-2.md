# Worker report 2 — exposure-scan-ci-backstop, correction round 1 (2026-10-02)

*Custodian's filing note: the worker's hand-back on correction round 1 for PR #153: the architect's gate-1 S2, the reviewer's N4, both gates' N2 and the reviewer's N1. It is recorded verbatim below with the harness's report indentation removed. Branch `cut/exposure-scan-ci-backstop` at e0442e0. The custodian's checks: the two commits a5e2e79 and e0442e0 read from origin; the diff against 5d3951f is 14 insertions and 6 deletions over the workflow header comment and the test file. On the report's last line: the probe branch was deleted on origin by the custodian after E2 to E4 were read (the 07:05Z ledger entry), and the worker's local view did not include that.*

---

Correction round 1 for exposure-scan-ci-backstop is done: two commits on `cut/exposure-scan-ci-backstop`, pushed, head e0442e0. I pulled 5d3951f first, as you said.

**Commits**
- a5e2e79, `ci:`. Changes 1 and 2, comment-only, in `.github/workflows/exposure-scan.yml` (+5/-3).
  - The last "does not mean" item is now a person's flattened profile form. The local-profile rule keys on the scanning machine's home, which on the runner is a machine account, so only an armed clone's hooks catch that form.
  - The paths-filter sentence now says a paths filter filters events by changed path and could skip such commits; it no longer says "exactly".
- e0442e0, `test:`. Changes 3 and 4 in `scripts/hooks/profile-path-scan.test.mjs` (+9/-3).
  - T7 gained one assertion after the `commit refused` one: the hook's stderr includes `link:1 unlisted-segment`.
  - The M7 comment gained the re-observation and the abort observation.
  - The M10 comment is re-recorded.

**Observations**
I applied each edit to the scanner on top of a5e2e79 plus the changed T7, ran the named test, and reverted. The tree is clean after the runs. The commit they are tied to is e0442e0, which carries the T7 assertion and the recorded comments.
- **T7 unmutated:** passes.
- **M7 (staged filter restored to ACMR):** the `notEqual` on the commit status still fails first (status 0).
- **Abort (`'--bogus-option'` appended to the staged content diff's arguments):** the `commit refused` assertion passes, because the hook prints it on an abort too. The new assertion then fails; its message is git's usage text, so the refusal was an abort with no finding line.
- **M10 (the catch in `runGitCaptured` returns `''`):** cases 1 to 3 still exit 2 through the `!base || !head` guard.
  - The status assertion of case 4 (two unrelated roots) fails, 0 !== 2.
  - The failing output carries the count line "range read 1 commits, 0 added lines, 0 path names". I identified the case from that output and the guard, not by printing the case index.
  - The M10 comment now names the edit and case 4.

**Checks at e0442e0**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: 366 tests, 366 pass, 0 fail.
- `verify-cites`: rc 0.
- `verify-quotes`: rc 0.
- `verify-test-claims`: rc 0.
- `verify-mutation --base origin/main --head HEAD`: PASS, 13 of 13. I read the PASS line, not the exit code (rc 0 was only of `tail`).
- `timeout 570 node scripts/plan/verify.mjs`: PASS. Same: read the PASS line, not the exit code.

**§7 count (merge base 422f8f8, head e0442e0)**
- `.github/workflows/exposure-scan.yml`: 93
- `scripts/hooks/profile-path-scan.mjs`: 86
- `scripts/hooks/profile-path-scan.test.mjs`: 374
- Total 553 changed lines over 3 files, within the 800 budget.

`git status --porcelain` is empty. The probe branch `probe/exposure-scan-push` is untouched and still in place.
