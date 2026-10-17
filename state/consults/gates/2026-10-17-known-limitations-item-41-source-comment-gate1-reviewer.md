Reviewed: PR #228 at 25a542f1301a752fb83f9c5016ad7e0f9950d30f (base 28163cb6)
Branch and commit: PR #228's head @ 25a542f1301a752fb83f9c5016ad7e0f9950d30f
Verdict: PASS

All five checks in the brief came back clean. I have no findings in any class.

**Correctness:** no findings.
- The new comment says the code sits at frontends/shell/src/workspace/selection.ts:119-157 @ 71fd2c4fb2903e8e0a383221a18895da50971204, and that claim holds when read against the code. In that span (the HiddenFacts doc through the closing brace of countSelection), `reason` is typed `null` and every return sets `reason: null`. With `viewBox === null`, the function returns `outsideView: null, inViewNotDrawn: null`, so there is no split.
- 71fd2c4f is the commit titled "Merge pull request #217 from christopherdonini/cut/shell-migration-milestone-2-phase-b", and it is an ancestor of origin/main (ab4766b9). So "on main since milestone 2 merged (PR #217, merge commit …)" is true.

**Evidence:** no findings.

**Documentation:** no findings.
- The form's Scope names 2 files (KNOWN-LIMITATIONS.md and PLAN.yaml), but the diff touches only KNOWN-LIMITATIONS.md. That is consistent with item 40's procedure, where the PLAN record comes with the done commit. It is within the declared budget, so it is not a finding.
- The change from line 388 to 392 (class 3) is stated in the PR body and the commit message. The form's line numbers are tied to 79cec8c5 and say so (Scope: "line 388 at 79cec8c5").

**Checks, each with its command and exit code**
1. `git fetch origin`, rc=0.
   - `git diff --stat 28163cb6...25a542f1`, rc=0: KNOWN-LIMITATIONS.md only, 1 insertion and 1 deletion.
   - `git log --oneline 28163cb6..25a542f1`, rc=0: one commit. `git merge-base 28163cb6 25a542f1` = 28163cb6.
   - I wrote my own node script (`check.mjs`), run on byte dumps from `git show` of KNOWN-LIMITATIONS.md at 79cec8c5, at the base and at the head, plus the form at the head. It exited rc=0 with every assertion OK:
     - No CR bytes in any of the four files.
     - Line 388 at 79cec8c5 is identical to line 392 at the base, and it occurs exactly once at the base (separate node check, rc=0: 1 occurrence, at line 392).
     - The form's Authority pin `KNOWN-LIMITATIONS.md:388 @ 79cec8c5… sha256:8885aed8…c76c` recomputes to the same hash (over the line plus LF).
     - The §A fence holds exactly one line, and head line 392 equals that line byte for byte.
2. The pin `frontends/shell/src/workspace/selection.ts:119-157` gives sha256 0092ff8df03bed9c9068eb3cc8cbd5ef4a9bbfc054995121a2474ff6c09548a4 at all five revisions I checked: 71fd2c4f, 2f18ad39, the base 28163cb6, the head 25a542f1 and origin/main. Each `git show` was rc=0, and the hash is `sed -n '119,157p' | sha256sum`.
   - All five dumps are plain ASCII with no CRLF (`file`).
   - `git merge-base --is-ancestor 71fd2c4f origin/main`, rc=0.
3. The same script shows that, from the base to the head, only line 392 differs, out of the same 396 split lines.
   - Item 41's words (lines 390-391 at the base) equal lines 386-387 at 79cec8c5 and are unchanged at the head.
   - Inside the comment, the first 574 bytes and the last 5 bytes (". -->") are identical. Only the location clause changed: the old text naming selection.ts at 2f18ad39 "on the phase B branch and not yet on main … its pin follows on main after the merge" became the new text naming the merge and pinning the location at 71fd2c4f. The parenthetical "(countSelection: the reason is always null, and with no box there is no split)" is kept word for word.
   - `git diff --quiet 28163cb6 origin/main -- KNOWN-LIMITATIONS.md`, rc=0: main has not changed the file since the base.
4. Run in a detached worktree of the head (`git worktree add --detach C:/dev/wt/k41-gate 25a542f1…`, rc=0):
   - `node scripts/plan/verify-cites.mjs`, rc=0 (PASS, 1985 files, 40 loose references advised).
   - `node scripts/plan/verify-quotes.mjs`, rc=0 (PASS, 129 checked, 0 hash-reference errors).
   - `node scripts/plan/verify-test-claims.mjs`, rc=0 (PASS, 570 claimed tests).
   - Searching the three outputs for KNOWN-LIMITATIONS found 0 matches (grep rc=1, meaning no match). The pattern was tested positive on the same file first.
   - `git worktree remove C:/dev/wt/k41-gate`, rc=0, and it no longer appears in `git worktree list`.
5. `gh pr checks 228`, rc=0, four checks, all passing: "every commit is signed off", "no profile path in the range", and "ported-notices" (two runs).
   - `gh pr view 228`, rc=0: open, not a draft, MERGEABLE, head 25a542f1, 1 file changed (+1/−1). Its base is reported as the current main tip ab4766b9, and the three-dot range is unaffected.

Nothing I ran was heavy, so no hold was taken. I made no commit, push or PR action, and wrote nothing outside the scratch folder and the temporary worktree, which I have removed.
