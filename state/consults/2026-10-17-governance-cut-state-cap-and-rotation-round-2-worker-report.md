*Custodian's filing note (2026-10-17): the worker's report of correction round 2 for `governance-cut-state-cap-and-rotation` (PR #229), in C:/dev/wt/csr from 620acf4f; the head 5201bc0b0ee432f9d1e001bdd9386332dfe72481, pushed. The run 2026-10-17T23:26:55Z to 2026-10-17T23:33:16Z by its transcript (Read 1, Bash 13, Write 1); its one SubagentHandback call, at 23:33:15Z. Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed. The custodian's checks at the head: only `scripts/plan/rotate-cut-state.test.mjs` changed since 620acf4f; the comment at its line 201 holds the architect's words byte for byte; the counting command prints 825 12; `node --test scripts/plan/rotate-cut-state.test.mjs` passes 9 of 9. The message's sha256 as handed back is 75a12654eb91a73ff65ef42ddbc909f7b452fe53c01be795f85bdd6120a3333f; this file's, from line 5 to the end, is f53b097e89c102317953e28483ea283ab671f9c23c9268249d37078c7dcb3cd5.*

---

Correction round 2 is done and pushed. R8 now runs over both ledger shapes and passes; MR8 and MR8b both fail R8 and are recorded.

**Head and commits**
- Start: 620acf4f84ac5f9e38711b8545d21175a039e6dc. After `git fetch origin` (rc 0) the head matched and the porcelain was empty.
- Fix commit: 1f4e8d5d41949976874a655ad2e758250f8f185c.
- Mutation-record commit: 5201bc0b0ee432f9d1e001bdd9386332dfe72481, now the head.
- Push to origin as an ordinary update: rc 0. Final porcelain: empty.

**Changes, all in `scripts/plan/rotate-cut-state.test.mjs`** (line numbers as of the fix commit)
- Line 12: `buildRotatedLedger` added to the import.
- Line 192: the R8 body became a helper `r8(rotatedShape)`. R8 keeps its test name and, at the end of the body, runs `r8(false)` then `r8(true)`.
- Lines 199-200: `live` is the ledger as read. `real` is `live`, or `buildRotatedLedger({oldText: live, name: 'cut-state-r8.md', commit: A0})` for the rotated shape.
- Line 200: the comment is the architect's suggested words, byte-copied from its C-2 by a Node script.
- Line 217 (old line 216): now `assert.ok(h >= 0, ...)`.
- Line 222 (old line 221): now at least one backticked `state/` path on the seeded `Previous ledger:` line.
- The mutation-record commit adds two `RECORDED MUTATION` lines after the existing ones. No existing line changed.

**R1 to R9**
- `node --test scripts/plan/rotate-cut-state.test.mjs`: rc 0, 9 of 9 passed.
- R8, the rotation-commit-then-flush test, passes on both shapes.
- I did not read R1 to R7 and R9 by name. They are among the 9 passing tests.

**MR8 and MR8b**
- Each was applied alone at 1f4e8d5d4194, run, reverted with `git checkout`, and the porcelain showed clean afterwards. The harness refused neither.
- MR8 (the rotation rewrites `flushed_at`): rc 1, 7 passed, 2 failed.
  - Failure 1: `rotate-cut-state: a due rotation stages the archive byte-identical to the ledger at HEAD and the new ledger's exact text` (R1).
  - Failure 2: `rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes` (R8).
- MR8b (the old title-line guard restored): rc 1, 8 passed, 1 failed. R8 failed with `the seeded ledger has a title line before the block`. `r8(false)` runs first and passes, so the failure comes from the rotated-shape pass.
- Both are recorded with commit id 1f4e8d5d4194.

**Commands and exit codes** (all rc 0 except the two intended mutation failures)
- Counting command against M0 0ff2594e2f35, using the form's section 7 text: total 825 lines over 12 files, up from 817. This file's figure is 276 against the 290 ceiling, so no class 8.
- CI globs, `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: 483 tests, 483 passed, rc 0.
- From the worktree root, `scripts/plan/verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify-mutation.mjs`: each rc 0.
- Not run: the shared-hold wrapper, since nothing was heavy.

**Differences and out of scope**
- I did not check the rotated shape against the architect's other suggested check, a scratch checkout whose `state/CUT-STATE.md` is replaced by rotated output. `r8(true)` feeds the same `buildRotatedLedger` output through R8's seeding instead.
- `ROTATE_BYTES` is still exported, as instructed. D-7 is yours to record as class 3.
- No other file changed.

**Self-check**
- Cross-module use: `buildRotatedLedger` is called as `rotate-cut-state.mjs:54` defines it, with `{oldText, name, commit}`.
- Completion claims: each points to a run above.
- Messages: no user-facing message changed.
- R8 reaches its assertions on both shapes. MR8b proves the rotated pass reaches line 217.

**Model:** the harness reports Sonnet 5.5 (claude-sonnet-5-5). I used no override and had no context handoff.
