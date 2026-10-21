Reviewed: PR #240 at b12a5402710e7bb4e85d0f7ef61806787c166bb8, the scoped check after round 2, reviewer
Verdict: PASS WITH NOTES

Branch and commit: cut/adr-036-pre-acceptance-block @ b12a5402710e7bb4e85d0f7ef61806787c166bb8. The worktree C:/dev/wt/a36 was clean (`git status --porcelain` printed nothing, rc=0). Its HEAD is b12a5402. That commit's only parent is d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0. The merge-base of the branch with origin/main is ad921f552f25a138bf845368e2e9e1f726d73812, which is B. I changed nothing in any repository. The only files I wrote are scripts and outputs in my scratch folder.

## Correctness
None.

## Evidence
None.

## Documentation (must be fixed before the merge)
- **D1. The PR body still names the old head as H.** Line 8 of the PR body reads, byte-copied from `gh pr view 240 --json body`: `B is ad921f552f25a138bf845368e2e9e1f726d73812 and H is d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 (70edd381ac6a1bf62d57de49b39dfa1ad95bac05 with C3, the form's Amendment 2 item 2).`
  - §7 says B and H are named in the PR body. Amendment 3 item 4 says the same. H is now b12a5402710e7bb4e85d0f7ef61806787c166bb8.
  - The §7 figure in the body (62, ceiling 90) is still correct at the new H (see check 3).
  - This is not the human's wording, so it gets exact words. In line 8, replace `H is d0c257d9f2ef18e6b7b60228fae7eedcdfd082c0 (70edd381ac6a1bf62d57de49b39dfa1ad95bac05 with C3, the form's Amendment 2 item 2)` with `H is b12a5402710e7bb4e85d0f7ef61806787c166bb8 (70edd381ac6a1bf62d57de49b39dfa1ad95bac05 with C3, the form's Amendment 2 item 2, then round 2, the form's Amendment 4 item 2)`.
  - Clause check: both commit ids come from `git log --format='%H %P' -1` and from the PR's headRefOid. The "C3, then round 2" order is what V1 needed to rebuild H exactly (check 2).

## For the human (not a finding, no replacement words)
- Item 3 of the human's message reads `"the last two sentences"`, with a lowercase t. The ADR's new span starts a sentence, so it reads `The last two sentences of §5's containment rule`. The script's exact-case test is false; with the first letter capitalised it is true.
- Item 2's `"items 19 and 23 to 28"` sits byte for byte inside the new span.

## What I checked (command and exit code)
1. **The round-2 diff.**
   - `git diff d0c257d9… b12a5402…` gave rc=0. `--numstat` gave rc=0 and printed `2 2 docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`: one file, two lines.
   - `--word-diff=porcelain` gave rc=0. The only changed words are `-sentence` / `+two sentences` and `+and 23`.
   - My script c1.mjs gave rc=0. Each of Amendment 4 item 2's old spans occurs exactly once in d0c257d9's ADR-036. Replacing both old spans with the new ones in d0c257d9's file gives b12a5402's file byte for byte (`D+spans == H: true`).
   - The head file has 0 CR bytes and ends in exactly one LF.
2. **V1, by my own script v1.mjs.**
   - It reads the form from `git show main:…`. It takes the 32 fenced blocks of §2.1 to §2.2, checks that §2.3's two passages appear in B1's and A6's new text, and applies C1 and C2 (§2.4), C3 (Amendment 2 item 2, with its indent removed) and Amendment 4 item 2's two backtick spans.
   - It starts from ADR-036 at B, applies each passage only if it matches exactly once, and puts each insertion after its anchor line.
   - Against H it gave rc=0, `V1 EQUAL 29631`.
   - Self-test: with a wrong span (`23` changed to `22` in the new text) it gave rc=1 and named the place of the difference.
   - Against the old head d0c257d9 it gave rc=1, as it should, differing at A0's `two sentences`.
   - I1: `cmp` of ADR-036 at B against 2879e17f gave rc=0.
3. **§7 and the index.**
   - `git diff --numstat ad921f55…b12a5402 -- <ADR-036>` gave rc=0 and printed `44 18`. That is 62, under the ceiling of 90. It is unchanged from round 1, because round 2 rewrites lines the block already replaced.
   - `node frontends/shell/scripts/adrIndex.mjs --check` gave rc=0: `adrIndex: PASS -- 34 ADRs, index in docs/README.md matches every Status line`.
   - V3: `git diff --name-only B...H` gave rc=0 and listed only `docs/README.md` and the ADR-036 file.
4. **Plan checks, run in the worktree at H.**
   - `verify.mjs` rc=0 (PASS).
   - `verify-cites.mjs` rc=0 (PASS, 2161 files).
   - `verify-quotes.mjs` rc=0 (PASS, 130 checked, 0 hash-reference errors).
   - `verify-test-claims.mjs` rc=0 (PASS, 581 claims).
   - `queue.mjs --check` rc=0 (current).
   - `site.mjs --check` rc=0 (current).
   - The CI `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` ran inside a shared hold (MACHINE_HOLD granted, then MACHINE_RELEASED). It gave 527 tests, 527 pass, 0 fail, 0 cancelled. The call ended `exit $rc`, so it could not print `$?`; the harness reported no non-zero exit.
   - The directive file is tracked on main (`git ls-files --error-unmatch` rc=0).
5. **CI.**
   - `gh pr checks 240` gave rc=0. All 8 checks pass: cfg boundary ×2, sign-off, profile-path scan, ported-notices ×2, and governance test/verify/drift ×2.
   - `gh pr view 240` gave rc=0: head b12a5402710e7bb4e85d0f7ef61806787c166bb8, OPEN, draft=true.
   - `gh run list --branch cut/adr-036-pre-acceptance-block` gave rc=0. Every run at headSha b12a5402… completed with success.

Scratch files (in <the session scratch folder>):
- v1.mjs: the V1 rebuild script.
- c1.mjs: the round-2 span check.
- v1.out, v1s.out, v1d.out, c1.out, nt.out, checks.out: the outputs.
