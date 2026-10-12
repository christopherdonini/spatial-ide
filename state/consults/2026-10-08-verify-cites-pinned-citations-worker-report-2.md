*Custodian's filing note (2026-10-08): `verify-cites-pinned-citations`'s worker report 2, the gate-1 fixes under the form's Amendment 1, at the branch head 2d684ad5bcc1155a1cce568633cdf3342db33ec7 (worker run from 15:33:04Z, report at 15:40:13Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 6c406277f60a0f7fa0a9aef1d01bee761fd31b9ab9fe8c2bec664457a7b735b4. The custodian read the checker diff 57e8d2b3..2d684ad5 and the numstat from ed396e94 (45 added and 7 removed in the checker, 94 added in the tests: 146 of 150). Paths and lines below are at the branch head, not main.*

---

All four Amendment 1 items are done on `cut/verify-cites-pinned-citations`, and every check exits 0.

**Commits (signed off, each pushed as an ordinary update):**
- 7f332caf669e8a4524c1bb3b3da86e9a393db6e3: `fix: verify-cites reads the pin as a blob and keeps the tree's reason (gate-1 C1, C2, D1, D2; Amendment 1 items 1 to 4)`
- 2d684ad5bcc1155a1cce568633cdf3342db33ec7: `docs: record the hand-applied mutations for P5 and P6 (observed at 7f332caf669e)`

**Mutations (applied by hand at 7f332caf669e, the test file run, then reverted; `verify-mutation` not used; the `RECORDED MUTATION` comments are in the second commit):**

| Test | Change applied | Test rc | Failing test (the only one) |
|---|---|---|---|
| P5 | `git cat-file blob` replaced by `git show` | 1 | `a_pinned_cite_whose_path_is_a_directory_at_that_commit_fails_by_name` |
| P6 | `\|\| maxL > lc` removed from the check at the pin | 1 | `a_pinned_cite_whose_line_is_past_the_file_end_at_that_commit_fails_by_name` |

**How the reason is now chosen:**
- **Normal case:** `checkPinned` reads `git cat-file blob <pin>:<path>`. If that fails, it asks `git cat-file -t` to tell a directory from a missing file.
- **Pin reasons:** it returns the pin's own reason for a missing commit, a directory ("is a directory at pinned commit"), or a line out of range at the pin.
- **Missing file:** for "path not found at the commit" it also returns `missingFile: true`. `runVerifyCites` then keeps the tree's reason whenever the tree found a file for the cite (any status except `no-match`). A rooted `no-match` still gets the pin's "not found" reason, which is true.
- **Tiers:** no cite changes tier. P1 to P4 pass unchanged.

**D1 and D2:** the header now states the pinned fallback and the three limits (a pin after a closing backtick or two spaces is not read; a pin on a cite that resolves in the tree is not checked; a hex word right after `@` is read as a pin). The `extractCitations` JSDoc now names `pin`.

**Checks (rc):**
- `node --test scripts/plan/verify-cites.test.mjs`: 0 (22 pass).
- Scripts suite, in the shared hold of the exact shape you gave: rc 0 from the call itself (tests 457, pass 457, fail 0). The hold was granted on cores 0-7 and released.
- `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify` (plan), `queue --check`, `site --check`: all 0.
- `cfg-boundary.mjs`: 0.

**Seam proof** (`runVerifyCites` imported from `C:/dev/wt/vcp`, `repoRoot` `C:/dev/wt/m1`, read-only):
- Gated 0, advisory 37, scanned 1513. This is the same as the reviewer's branch figures.
- The two advisory reasons in the architect-draft file (its lines 139 and 145) are back to tree reasons: "line 2006 exceeds frontends/shell/src/App.tsx (1997 lines)" and "line 2020 exceeds frontends/shell/src/App.tsx (1997 lines)".
- `git status --porcelain` in `C:/dev/wt/m1` showed 0 lines afterwards.

**Scope's count:** `git diff --numstat ed396e94 HEAD -- scripts/plan/verify-cites.mjs scripts/plan/verify-cites.test.mjs` gives 45 added and 7 removed in the checker, and 94 added and 0 removed in the tests. That is 146, at most 150.

**Deviations:**
- I added one test beyond P5 and P6, `a_pinned_loose_cite_keeps_the_trees_reason_when_the_pin_path_is_not_found`, to guard C2. Amendment 1 names no test for C2.
- I added a small `pinnedRun` helper that only the three new tests use, to stay under 150 lines. P1 to P4 are untouched.
- The checker passes `missingFile`, a new field on `checkPinned`'s return, to its caller. Its only reader is `runVerifyCites`.
- The first scripts-suite run was part of a background batch because the single call hit the 120 s timeout. Its rc was read from the batch, not from a pipe or `tail`.
- The scratch folder already held other files, so I used the `vcpfix-` prefix for mine.

Worktree `C:/dev/wt/vcp` is clean (`git status --porcelain` is empty) at 2d684ad5, pushed. I did not merge main, rebase, force-push, or touch any PR.

Model: Sonnet 5.5 (`claude-sonnet-5-5`), no override. I received no context handoff and produced none.

**Pre-gate self-check:**
- **Interfaces:** the code uses only git's real `cat-file` modes (`blob`, `-t`, `-e`), and the tests drive real temporary git repos.
- **Completion claims:** every claim points to a named test or a command rc above.
- **User-facing messages:** the new "is a directory at pinned commit" message describes behaviour implemented at 7f332caf, and P5 asserts it.
- **Test assertions:** each new test reaches its assertion, and the P5 and P6 mutations make exactly the named test fail.
