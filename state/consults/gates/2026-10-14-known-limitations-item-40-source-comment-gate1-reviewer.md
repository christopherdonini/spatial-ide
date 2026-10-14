Reviewed: PR #221 at cb9a9fd4b9a92fa98cae0ae7d354cdf75d009adc (base 31e25f15)
Branch: cut/known-limitations-item-40-source-comment @ cb9a9fd4b9a92fa98cae0ae7d354cdf75d009adc
Verdict: PASS

## Findings

**Correctness:** none.
**Evidence:** none.
**Documentation:** none.

One observation, not a finding. The comment says "resource.generationEnded does so with the reason source-changed". The pin for that clause, workspaceState.ts:149-158, covers `endGeneration`, which is the function the action calls. The `case "resource.generationEnded"` dispatch itself sits at workspaceState.ts:175-176 @ 71fd2c4f, outside the pin. Read as the action's effect, the clause is true. Its words come from the old line unchanged, and the form and the human's item 6 keep them, so nothing needs to change.

## Checks

All commands ran in the main checkout `C:/dev/spatial-ide` with git object commands only (show, diff, log, merge-base, rev-parse), after `git fetch origin`. Scratch output went to the session scratchpad. The temporary worktree was `C:/dev/wt/gate-kl40`.

**1. Tests+mutation line, item by item**

- **Pins at the merge commit, the base and the head.** For each pin I ran `git show <c>:<path> | sed -n '<a>,<b>p' | sha256sum`, which hashes the lines LF-joined with one final newline. I ran it at 71fd2c4fb2903e8e0a383221a18895da50971204, at 31e25f15 and at cb9a9fd4 (rc 0 each). All four hashes match the line at all three commits:
  - workspaceState.ts:140-141: 3a6bdd11…7107276
  - workspaceState.ts:149-158: 10681b82…97f73
  - viewTransitions.ts:156-165: b3df4df0…e361e8d
  - FeatureTab.tsx:68-76: b98c0ad2…70565b0
  - The same four hashes also come out at 2f18ad39363f649bad29e1fcb2556e870d6f6efd, the branch commit the old comment named. The cited text did not change between the branch and the merge.
- **The merge commit and the Authority pin.** 71fd2c4f is the "Merge pull request #217" commit and is an ancestor of origin/main (`git merge-base --is-ancestor`, rc 0). The Authority pin KNOWN-LIMITATIONS.md:384 @ 82c5996c recomputes to b34d265a…68bd1, and so does line 384 at 31e25f15.
- **The new line equals §A byte for byte.** I extracted §A's ```text block from the form at origin/main with awk. `cmp` against `git show cb9a9fd4:KNOWN-LIMITATIONS.md | sed -n 384p` gave rc 0, and both hash to 6449fc6e741be5ec19698d8755099e59ab470246a1e8d14a4015617313b0b8bf. The form is identical at 31e25f15 and at main (`cmp`, rc 0), and its commit 57d6c3bf is an ancestor of the base (rc 0).
- **Only the clause and the three locations changed.** A Python script (`python -I`) applied exactly four single-occurrence substitutions to the old line 384 and printed `old with only the four substitutions == new: True` (rc 0). The four substitutions were the "where the code is" clause and the three location strings. The 413-byte prefix before "Where the code does this" is equal, and every parenthetical is unchanged.
- **No other line changed.** `cmp <(sed '384d' old) <(sed '384d' new)` gave rc 0; both files have 388 lines. `git diff --numstat origin/main...origin/cut/known-limitations-item-40-source-comment` gives `1 1 KNOWN-LIMITATIONS.md` (rc 0). `file` reports no CRLF.

**2. Each clause against the code it names**

I read each pinned span with `git show 71fd2c4f:<path> | sed -n`.

- **workspaceState.ts:140-141.** Line 141 is `const bound = view.resource === key ? view : endViewGeneration(view, "reopened");`. A rebind ends the generation with the reason reopened, as the comment says.
- **workspaceState.ts:149-158.** `endGeneration` calls `endViewGeneration(views[id], "source-changed")` for each view bound to the key, once, guarded by `generationEnded`. The reducer reaches it from `case "resource.generationEnded"` at 175-176. The clause holds; see the observation above.
- **viewTransitions.ts:156-165.** `endViewGeneration` applies `selection.end` with `{ reason, dropped: viewSelection(view).size }`, then `inspect.set` null. The selection ends with the count dropped and the inspected feature is cleared, as the comment says.
- **FeatureTab.tsx:68-76.** `noticeText` builds the ended and refused words. It is called at FeatureTab.tsx:130 (the tab) and at App.tsx:2268 inside `"status.selectionEnded"` (the status bar). "The words the tab and the status bar show" holds.

**3. Scope**

The branch changes one file, KNOWN-LIMITATIONS.md, by one line added and one removed: 2 changed lines, inside the form's ≤ 2 budget by §21c's counting. PLAN.yaml is not touched on the branch.

**4. Out-of-scope**

The diff holds no ADR, nothing under protocol/, no code, no test and no app string. Item 40's visible lines 382-383 are byte-identical, covered by the line-384-deleted cmp in check 1 (rc 0).

**5. Checkers at the head**

I added the worktree with `git worktree add --detach C:/dev/wt/gate-kl40 cb9a9fd4b9a92fa98cae0ae7d354cdf75d009adc` (rc 0, HEAD cb9a9fd4…). Each checker ran in the foreground with a 600 s timeout, its output redirected to a scratch file and `$?` printed right after. Nothing was piped.

- `node scripts/plan/verify-cites.mjs` gave rc 0: PASS, 1902 files, 38 loose references advised (pre-existing, in state/drafts).
- `node scripts/plan/verify-quotes.mjs` gave rc 0: PASS, 121 checked, 90 verified, 30 baselined, 1 advisory, 0 hash-reference errors (2 hash-baselined, pre-existing).
- `node scripts/plan/verify-test-claims.mjs` gave rc 0: PASS, 563 claimed tests across 167 files.
- `node scripts/plan/verify.mjs` gave rc 0: `verify:plan PASS`.

I removed the worktree with `git worktree remove C:/dev/wt/gate-kl40` (rc 0), and `git worktree list` no longer shows it.

**6. CI**

`gh pr checks 221` gave rc 0, and all four checks passed:
- every commit is signed off (DCO sign-off, run 38604992192)
- no profile path in the range (Exposure scan, run 38604992105)
- ported-notices (pull_request run 38604992163)
- ported-notices (push run 38604174365)

`gh run view <id> --json headSha` shows all four runs are at cb9a9fd4b9a92fa98cae0ae7d354cdf75d009adc, the PR head (`gh pr view 221 --json headRefOid` gives the same).

**Records**

The worker's report is now tracked on main, committed at f81aa2d0ce66b25104b021ccda1ba13799f83f83, so the PR body's cite of it resolves. The worker's report and the PR body make the same claims I checked above, and each held.

I made no edit, commit, push or PR action. The main checkout's porcelain shows only the custodian's pre-existing untracked files.
