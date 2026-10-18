Reviewed: PR #229 at 5201bc0b0ee432f9d1e001bdd9386332dfe72481 (base 0ff2594e; gate 3, scoped to correction round 2). Branch and commit: cut/cut-state-cap-and-rotation @ 5201bc0b0ee432f9d1e001bdd9386332dfe72481
Verdict: PASS WITH NOTES

The fix holds. R8 passes on the live ledger, on the ledger once it has been rotated, and on a ledger rotated twice. I made MR8 and MR8b again myself; each fails R8 by name. The harness refused neither edit. There is one Documentation finding, D-1, which is must-fix before the merge with no re-gate.

## Correctness
None.

## Evidence
None. §9's "every mutation made again" is now met for MR8 and MR8b at the head.

## Documentation (must-fix before the merge, no re-gate)

**D-1. The comment on `real` describes `live`.**
- Where: `scripts/plan/rotate-cut-state.test.mjs:201` at 5201bc0b.
- The comment there is the architect's suggested words, byte for byte (I checked it with `cmp`, rc 0). It reads: `// the real ledger as main holds it (before the first rotation: a title line and a two-path Previous ledger line; after it, the rotated shape)`.
- The architect wrote those words when there was only one variable. In round 2 the line also defines `real` as `buildRotatedLedger(...)` of the live ledger when `rotatedShape` is true. That value is not "as main holds it". The comment is true of `live` (`:200`) and false of `real` on the `r8(true)` pass.
- This is not the human's wording; it is the architect's suggestion. The worker applies the words below with no re-gate, and the PR body lists them (AUTONOMY §31).
- Replacement words. Move the existing comment, unchanged, to the end of `:200`, the `live` line. Replace the comment at `:201` with:
  `// rotatedShape: that ledger rotated once more in memory, the shape the next rotation reads`
- Each clause checked against the code:
  - "that ledger": the comment refers to `live`, which `:200` reads from `REPO_ROOT/state/CUT-STATE.md`.
  - "rotated once more": `buildRotatedLedger({ oldText: live, ... })` at `:201`.
  - "in memory": `buildRotatedLedger` only returns text and writes nothing (`rotate-cut-state.mjs:54-68`).
  - "the shape the next rotation reads": after R, main holds `buildRotatedLedger` output (§2 item 10). `r8(true)` seeds that shape at `:202-203`, and the real CLI rotates it at `:213`.
- Operator-observable: none. This is a test comment.

## Notes (no fix asked)
- **The filed round-2 worker report has a small line-number slip.** It gives "Lines 199-200" for `live` and `real`, and "Line 200" for the comment, at 1f4e8d5d. At 1f4e8d5d they are lines 198 and 199, and the comment is on 199. Its other line numbers (192, 217, 222) are right. The custodian's filing note gives 201 at the head, which is correct. The report is filed evidence, so I ask for no fix.
- **Amendment 5's figures all check out:**
  - item 3: 825 lines over 12 files, `rotate-cut-state.test.mjs` 276 of 290, and Amendment 4 item 4's three figures unchanged (hooks.test 23+1=24, verify-cites.test 41, AUTONOMY 77);
  - item 2: the two assertions match the gate 2 reviewer's C-1 fix, and the comment matches the architect's words.
- **D-7 (`ROTATE_BYTES`)** is recorded as class 3 in Amendment 5 item 4. It carries forward.

## Gate 2's finding: resolved
The gate 2 finding was the architect's C-2, the same finding as the gate 2 reviewer's C-1.
- `:216` became `assert.ok(h >= 0, ...)` (now `:219`).
- `:221` became "at least one backticked `state/` path" (now `:224`).
- R8 now runs as `r8(false)` then `r8(true)` (`:261-264`).
- Reproduced in both directions. I copied the head's `scripts/hooks`, `scripts/plan` and `.claude/settings.json` into a scratch root. Its `state/CUT-STATE.md` is origin/main's ledger at be802ebf rotated once, in memory, by the head's exported `buildRotatedLedger`. No tree's ledger was written, and neither script ran against one. The probe confirmed the rotated input: first line `## SESSION-CONTINUITY`, 3 backticked `state/` paths, the old title guard false.
  - The head's test file in that root: rc 0, 9 of 9. So R8 passes when its input is a ledger already rotated once (`r8(false)`) and one rotated twice (`r8(true)`). That answers check 3.
  - 620acf4f's test file in the same root (the script and the hooks are unchanged in round 2, `git diff --quiet` rc 0): rc 1, 8 pass, 1 fail. R8 fails with `the seeded ledger has a title line before the block` at `rotate-cut-state.test.mjs:216`. That is C-2 reproduced at gate 2's head.

## R8, MR8 and MR8b as I observed them
I ran these in the detached worktree `C:/dev/wt/gate229c` at 5201bc0b. Each mutation was applied by a scratch Node script doing an exact string replace, with the anchor found exactly once.
- **Baseline:** rc 0, 9 of 9 pass, R1 to R9 by name, R8 included.
- **MR8** (the rotation rewrites `flushed_at`; one line added in `buildRotatedLedger` after the trailing-blank pop):
  - Shell escaping stripped my regex's backslashes, so the rewritten value kept its milliseconds. It is still a rewrite of `flushed_at` (actual `flushed_at: 2026-10-17T23:43:24.514Z`, against the seeded `2026-10-17T23:41:23Z`).
  - rc 1, 7 pass, 2 fail, by name:
    - `rotate-cut-state: a due rotation stages the archive byte-identical to the ledger at HEAD and the new ledger's exact text`
    - `rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes`. It failed with `its fields are the eight seeded lines` (`:222`).
  - Reverted with `git checkout`; porcelain 0 bytes.
- **MR8b** (`:219` replaced by the old `assert.ok(seededLines[0].startsWith('# ') && h > 0, 'the seeded ledger has a title line before the block')`):
  - rc 1, 8 pass, 1 fail. R8 failed with `the seeded ledger has a title line before the block` at `:219`, through the call at `:263`, which is the `r8(true)` rotated-shape pass.
  - Reverted with `git checkout`; porcelain 0 bytes.
- Both observations match the `RECORDED MUTATION` lines at `:77-78`.

## Commands and exit codes
- `git fetch origin`: 0
- `git log --oneline -5 origin/main`: 0. `git ls-tree` of state/consults: 0; the round-2 worker report is on main.
- `gh pr view 229 --json ...`: 0 (head 5201bc0b, OPEN)
- `git show` of the form at origin/main and at 5201bc0b: 0, 0
- `git show` of the gate 2 architect report, the gate 2 reviewer report and the worker report: 0, 0, 0
- `git diff --stat 620acf4f 5201bc0b`: 0. Only `scripts/plan/rotate-cut-state.test.mjs` changed, +13 −5.
- `git diff 620acf4f 5201bc0b`: 0
- `git log 620acf4f..5201bc0b`: 0. Two commits, 1f4e8d5d then 5201bc0b.
- `git show` of the test and the script at 5201bc0b: 0, 0. `git show` of the test at 1f4e8d5d: 0.
- `git worktree list`: 0. `ls /c/dev/wt/`: 0.
- `git worktree add --detach /c/dev/wt/gate229c 5201bc0b…`: 0
- `node --test scripts/plan/rotate-cut-state.test.mjs` (baseline): 0
- MR8: apply 0; `git diff` 0; run 1; revert 0; porcelain 0 (0 bytes)
- MR8b: apply 0; `git diff` 0; run 1; revert 0; porcelain 0 (0 bytes)
- Import greps (two): 0, 0
- Scratch-root copy: 0. `git show origin/main:state/CUT-STATE.md` into scratch: 0. `git rev-parse origin/main`: 0.
- Rotated-ledger probe: 0
- Head test file in the rotated scratch root: 0 (9 of 9)
- Copy with 620acf4f's test file: 0. `git diff --quiet 620acf4f 5201bc0b -- rotate-cut-state.mjs scripts/hooks`: 0. That test file in the rotated root: 1 (R8 fails at `:216`).
- CI glob grep: 0. The CI step is at `.github/workflows/governance-ci.yml:142`.
- CI globs, `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` at the head: 0 (483 tests, 483 pass, 0 fail)
- Counting command against M0 0ff2594e2f355321640a6942b710e7507b613151: `git rev-parse` 0; numstat 0; awk 0. It prints `825 12`.
- `gh pr checks 229`: 0, all 8 pass. They come from 6 runs, and `gh run view` (rc 0 each) puts every one at 5201bc0b0ee432f9d1e001bdd9386332dfe72481:
  - Governance CI: push 39079460082, pull_request 39079464281
  - DCO: pull_request 39079464367
  - Exposure scan: pull_request 39079464467
  - Ported notices: push 39079460097, pull_request 39079464337
- Comment byte check with `cmp`: 0
- Final worktree porcelain: 0 (0 bytes)
- `git worktree remove /c/dev/wt/gate229c`: 0. Afterwards `ls` of that path gives 2 (gone).
- Main checkout porcelain: 0. It shows only its two existing untracked entries.

I made no commit, push or PR action, and no `claude` command. I edited no `.claude/settings.json`. I ran neither `rotate-cut-state.mjs` nor `flush.mjs` against any tree's own `state/CUT-STATE.md`: the test file runs both CLIs only inside its own temporary repositories. I took no shared hold, because nothing here was heavy. Outside the removed worktree I wrote only to the scratch folder: the mutation helper, the probe, the two scratch roots (`r8root`, `r8root-old`) and the redirected outputs.

Paths: `C:\dev\spatial-ide\scripts\plan\rotate-cut-state.test.mjs` and `C:\dev\spatial-ide\scripts\plan\rotate-cut-state.mjs` (as at 5201bc0b); `C:\dev\spatial-ide\scripts\plan\CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md` (Amendment 5, on main).
