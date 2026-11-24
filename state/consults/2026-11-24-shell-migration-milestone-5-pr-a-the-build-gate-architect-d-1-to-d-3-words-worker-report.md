# Milestone 5 PR A: the architect build gate's D-1 to D-3 words on the branch, byte for byte, the worker report

*Filed by the custodian from the worker's hand-back, as claims, not evidence: node:shell-migration-milestone-5@pr-a-build-gate-architect-d1-d3-words-1. Its commit c62940ab70da475a056f1b6316e6fca08e8c8902 on `cut/shell-migration-milestone-5-pr-a` changes 3 files (3 3 KNOWN-LIMITATIONS.md; 11 9 frontends/shell/src/App.tsx; 1 0 frontends/shell/src/conditions/conditions.test.ts), as the custodian read from its diff; each file at the commit is the file at its parent with the seven Old and New texts of the gate's D-1 (a) to (c), D-2 and D-3 applied, byte for byte. D-2's line went in after the custodian read the C-1 worker's run log of C-U1's mutation (2294 bytes, sha256 509bdbab9abe79285ec2502f5650e3a62ff170c296f0b8ff27c7024d12051b4a, last modified at 2026-11-24T02:26:57Z, between 7c18e29f and 7c816dd4 by their commit times): C-U1 and C-U6 failed, 13 passed. D-4 waits on the advisor's answer to Q1. It ran during no build, in the sitting. Dispatched at 2026-11-24T05:01:07Z; its run: Bash 5, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-24T05:01:07Z to 2026-11-24T05:01:32Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T05:01:32Z. 1617 bytes, sha256 fec01addd1a2b3e947ce61e032c757b77775a20df37e85493a180060259ed517, byte for byte, nothing masked, with one final newline added.*

---

The D-1, D-2 and D-3 words are on the branch and pushed in one commit. Nothing was built or tested, as the sitting requires.

- Commit: c62940ab70da475a056f1b6316e6fca08e8c8902. Its parent is 9d990d79b3710c560605321b22eef9391fb00245.
- `git diff --numstat 9d990d79b3710c560605321b22eef9391fb00245 HEAD`:
  - `3 3 KNOWN-LIMITATIONS.md`
  - `11 9 frontends/shell/src/App.tsx`
  - `1 0 frontends/shell/src/conditions/conditions.test.ts`
- Push, last line: `9d990d79..c62940ab  cut/shell-migration-milestone-5-pr-a -> cut/shell-migration-milestone-5-pr-a`
- `git status --porcelain` after the push: empty.
- The diff changed only comment lines. A grep for non-comment changed lines found none.
- The message file's sha256 matched `d739232a...` before the commit. The pre-commit hook ran and passed.

Commands, in order (all exit 0):
1. `git rev-parse HEAD`, `git rev-parse --abbrev-ref HEAD` and `git status --porcelain` in `D:/wt/m5a`. HEAD, the branch name and a clean tree all matched.
2. `node <S>/apply-m5a-dfix-1.cjs`, which printed `APPLIED 7 edits in 3 files`.
3. `git diff --numstat`, then `git diff -U0` filtered for non-comment lines. The filter's grep exited 1, meaning no match.
4. `sha256sum <S>/msg-m5a-dfix-1.txt`.
5. `git add -- frontends/shell/src/App.tsx frontends/shell/src/conditions/conditions.test.ts KNOWN-LIMITATIONS.md`.
6. `git commit -s -F <S>/msg-m5a-dfix-1.txt`.
7. `git push origin cut/shell-migration-milestone-5-pr-a`, in its own call.
8. `git rev-parse HEAD HEAD~1`, `git diff --numstat 9d990d79... HEAD` and `git status --porcelain`.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override.
