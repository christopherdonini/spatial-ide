Reviewed: PR #240 at d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 (base ffae8c52), the scoped re-gate after correction round 1, reviewer — cut/adr-036-pre-acceptance-block @ d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0
Verdict: PASS WITH NOTES

C3 is applied exactly as Amendment 2 item 2 gives it, and V1 rebuilds the head byte for byte. There are no Correctness or Evidence findings. Two Documentation findings must be fixed before the merge. Neither is the human's wording, and neither needs a re-gate.

## Correctness
None.
- C3's new span says that containment "checks that when the data is opened". That agrees with the head's containment bullet (line 104): "checks before it opens it" and "The check is made when the data is opened."
- It claims nothing after the open, so it does not conflict with the human's sentence.
- "does not by itself show that a path leads inside" is true. Canonical form is a check on text only, and only the resolver's walk refuses links.
- I grepped the head for keep-inside and never-points-outside wording. Lines 95, 100 and 102 match, and none of them claims more than the check.

## Evidence
None.

## Documentation (must fix before the merge; no re-gate)

**D1. Amendment 2 item 2 predicts "§7's count becomes 64". The count by §7's command is 62.**
- **Which holds: 62.** `git diff --numstat ad921f55...d0c257d9 -- <ADR-036>` gives 44 + 18 = 62. That is the same as at 70edd381.
- **Why:** C3 rewrites a span inside A4's new line (line 95). Measured from B, that line was already one deletion (B's line 71) and one insertion (A4's line). C3 changes the inserted line's bytes, not the number of lines. The "62 + 2" in gate 1's architect report counts C3 against 70edd381, not against B.
- **Why this is not Correctness or Evidence:** it is a prediction in a preregistration amendment, written before the edit. §7's measured value governs, and it is under the ceiling of 90. There is no overrun, so there is no class 8, and §7 is unedited.
- **Fix:** one correction in the closing amendment (S3). The form is append-only, so item 2 stays as written. Words (not the human's):
  "Amendment 2 item 2's predicted count is corrected: `git diff --numstat ad921f552f25a138bf845368e2e9e1f726d73812...d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 -- docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` gives 44 + 18 = 62, not 64, because C3 rewrites the line A4 already replaces and so adds no line against B. 62 is under the ceiling of 90."
- **Clause check:**
  - "44 + 18 = 62": my numstat run, rc=0.
  - "the line A4 already replaces": my V1 script's check 1 found exactly one changed line between 70edd381 and the head, line 95, and it equals A4's new block before C3.
  - "adds no line against B": numstat from B to 70edd381 is also 44/18, rc=0.
  - It is two sentences, within round 12 (d)'s ceiling.

**D2. The PR body still names H as 70edd381.** §7 requires B and H in the PR body. Line 8 of the body reads "H is 70edd381ac6a1bf62d57de49b39dfa1ad95bac05".
- **Words (not the human's), to replace that clause:** "H is d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 (70edd381ac6a1bf62d57de49b39dfa1ad95bac05 with C3, the form's Amendment 2 item 2)".
- **Clause check:** `gh pr view 240` gives headRefOid d0c257d9…, and the parent of d0c257d9 is 70edd381 (`git log`, rc=0).
- The body's "§7: 62 lines" is still correct.

## What I checked (every output went to a file in my scratch folder, with the exit code printed after it)

**1. The C3 diff**
- `git diff 70edd381ac6a1bf62d57de49b39dfa1ad95bac05 d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0`: rc=0, one file. Its numstat is 1/1 on ADR-036 (rc=0), and nothing else changed.
- My script, check 1:
  - The 70edd381 file and the head have the same number of lines, and exactly one line differs (line 95).
  - The old line equals the form's A4 new block.
  - Amendment 2 item 2's old span, with the three-space indent removed, occurs exactly once in the old line.
  - Replacing it with the new span (indent removed) gives the head's line byte for byte.
- Both spans also equal, byte for byte, the backticked Old and New in gate 1's architect report, C-1 (node compare, rc=0).
- Commit d0c257d9: its parent is 70edd381, it is signed off and it carries both trailers.

**2. V1, by my own node script, not the worker's**
- **Sources:**
  - the form from `git show ffae8c52:` (main);
  - ADR-036 from `git show ad921f55:` (B).
- **Rebuild:**
  - No CR bytes in any input.
  - It collects the 40 column-0 fenced blocks.
  - Each of the 16 "as it stands" passages (A1 to B4, C1 and C2) occurs exactly once at B as whole lines, and each of the 4 insertion anchors exactly once.
  - It applies them, then inserts A0, A2's members (blank line before), B5a (blank line before) and B5b.
  - It then applies C3. Its two spans are taken from Amendment 2 item 2's three-space-indented fences, with the indent removed, and the old span occurs exactly once.
- **Result:** rc=0, "V1 PASS byte-equal", 29619 = 29619 bytes, final LF true.
- **Self-test, C3's new span with one word changed:** rc=1, "rebuilt != H", first difference at line 95.
- **Self-test, C3's old span with one word changed:** rc=1, "C3 old span occurrences 0".
- **I1:** `git diff --stat ad921f55 ffae8c52 -- <ADR-036> docs/README.md`: rc=0, empty. The merge base is ad921f55 (rc=0).

**3. §7**
- `git diff --numstat ad921f552f25a138bf845368e2e9e1f726d73812...d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 -- docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`: rc=0, 44/18 = 62.
- The worker's 62 holds, for the reason in D1.
- `git diff --name-only origin/main...HEAD`: rc=0. Only `docs/README.md` (1/1) and ADR-036, both inside §2.7.

**4. At the head (worktree HEAD d0c257d9, porcelain empty before and after)**
- `node scripts/adrIndex.mjs --check` (in frontends/shell): rc=0, "PASS -- 34 ADRs".
- The four verifiers ran in one call. It passed the 300 s timeout and went to the background, then completed with exit 0. Each printed rc:
  - `node scripts/plan/verify.mjs`: rc=0, PASS.
  - `verify-cites.mjs`: rc=0, PASS, 2161 files; the loose references are advisory.
  - `verify-quotes.mjs`: rc=0, PASS, 130 checked, 0 hash-reference errors.
  - `verify-test-claims.mjs`: rc=0, PASS, 581 claimed.
- `node scripts/plan/queue.mjs --check`: rc=0, current.
- `node scripts/plan/site.mjs --check`: rc=0, current.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`:
  - It ran inside a shared hold, granted and then released.
  - The call has the brief's hold shape and ends with `exit $rc`, so the tool's exit status is the command's, and it reported no non-zero exit (rc=0).
  - 527 tests, 527 pass, 0 fail, and no "not ok" line.
- `gh pr checks 240`: rc=0, all 8 checks pass.
  - `gh run view` on each of the 6 runs (rc=0 each) gives headSha d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0, with conclusion success.
  - `gh pr view 240` gives headRefOid d0c257d9… and isDraft true.

Nothing outside C3 was re-reviewed beyond what V1 covers, and I raise nothing outside C3. I changed no file in the worktree or the repository.
