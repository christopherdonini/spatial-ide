Reviewed: PR #229 at 620acf4f84ac5f9e38711b8545d21175a039e6dc (base 0ff2594e; gate 2, scoped to correction round 1). Branch and commit: cut/cut-state-cap-and-rotation @ 620acf4f84ac5f9e38711b8545d21175a039e6dc
Verdict: FAIL

The gate fails on one Correctness finding, C-1. The E-1 fix put two assertions into R8 that hold only for today's ledger. The piece's own first rotation removes that shape, so R8 fails on main from commit R onward. I could not make MR6 and MR8 again: the harness refused the mutation edit (see Evidence).

## Correctness

**C-1 (blocking): R8 asserts the live ledger's current shape, and the piece's own rotation destroys that shape.**
- Where: `scripts/plan/rotate-cut-state.test.mjs:216` (the title-line guard) and `:221` (the guard that requires exactly two `state/` paths on the `Previous ledger:` line), at 620acf4f. Both run on `real`, which `:198` reads from the working tree's `state/CUT-STATE.md`, and CI checks out that file.
- Why they fail: after rotation R, the live ledger is `buildRotatedLedger`'s output. That output has no title line (§2 item 3, OPEN-3 (iii)). Its `Previous ledger:` line carries three backticked `state/` paths: the archive, `state/CUT-STATE.md`, and the `Before it` path.
- Observed: I ran a read-only probe (`probe-r8.mjs` in scratch). It imports the head's `buildRotatedLedger`, `updateBlockFields`, `BLOCK_HEADING` and `SESSION_CONTINUITY_FIELDS` and writes nothing. It evaluates the exact expressions of `:216` and `:221`:
  - on the live ledger at the head: `titleGuard=true`, `prevPaths=2`;
  - on that ledger after one rotation: `titleGuard=false`, `prevPaths=3`.
- Consequence:
  - The required check `test · verify:plan` goes red on main at R and at F.
  - E9 (§6, "main's CI at F") cannot pass.
  - Every PR after the first rotation is red.
  - This is the input every rotation reads from week 2 on.
- Fix (test file only, about 4 lines):
  - Replace `:216` with `assert.ok(h >= 0, ...)`. `:217` already proves that any line before the heading is gone.
  - Replace `:221` with an assertion that the seeded line names at least one backticked `state/` path.
  - Drop the shape claim from `:198`'s comment.
  - Run R8's seeding and assertions over both `real` and `buildRotatedLedger({ oldText: real, name: 'CUT-STATE-X.md', commit: A0 })`, so the test proves itself on the post-rotation shape as well.
  - Observe and record one mutation by name: the old `:216` guard restored fails R8 on the second shape.
- Re-gate scope: the test file only. Run R1 to R9 again, and observe MR8 and the new mutation.

## Evidence

**E-1 (this gate's, not the worker's): MR6 and MR8 were not made again.**
- My first mutation command (deleting line 90, the `@{u}` check, in the temporary worktree) was refused by the harness's auto-mode classifier as "Irreversible Local Destruction".
- The porcelain showed the edit had not been applied (0 bytes). Following the refusal, I did not apply the mutation another way.
- So the only observations of MR6 and MR8 at 143bf561 are the worker's lines `rotate-cut-state.test.mjs:75-76`, and the gate does not confirm them.
- §9 ("every mutation made again") stays open for this round. It needs a permission rule, or the custodian, to make them. The re-gate after C-1 needs the same.

## Documentation
None in scope.

## Gate 1's C-1 (`--root`): resolved
- `main()` refuses any argument with exit 2 (`rotate-cut-state.mjs:71`).
- The root comes from `git rev-parse --show-toplevel` in `process.cwd()`; a failure there is a Refusal (`:72-77`).
- `REPO_ROOT`, `here` and `fileURLToPath` are gone from the script. The test's `rot` spawns with `{ cwd: dir }` (`rotate-cut-state.test.mjs:58`).
- The diff `c8b78e90..e984a6a2` touches only the two scoped files: 26 lines added, 10 removed.

## The architect's E-1 (real-shape rotation)
- Met in substance at today's ledger: R8 seeds through `updateBlockFields` and asserts the four properties the architect named.
- Its two added guards are C-1 above.

## Check 2: the caller rule at the head
- No options remain.
- `isDue`, `archiveNameFor`, `noticeLine` and `buildRotatedLedger` are all called by `main`, whose product caller is AUTONOMY.md §33 (ii) (`AUTONOMY.md:598`, no arguments). `archiveNameFor` and `noticeLine` are also C's named consumers (`scripts/plan/DECISIONS-PENDING-OPEN-AND-ARCHIVE-PREREGISTRATION.md`, item 11 (d)).
- `ROTATE_BYTES` (`:20`) is a fifth export that §2 item 3 does not list. `isDue` reads it on the product path, and R4 imports it. The round did not change it, so gate 1's verdict on it carries forward.
- Note (no finding): the script now acts on the working directory's repository, not on its own. The header (`:3`) does not say so. §33 (ii)'s relative command already implies the checkout root.

## The third commit (620acf4f)
- `git diff --stat e984a6a2 620acf4f`: `AUTONOMY.md` and `scripts/hooks/flush.mjs` only.
- `flush.mjs`: one hunk at `:43`, inside the header comment (the imports start at `:47`).
- `AUTONOMY.md`: hunks at 569, 597, 604, 625-626 and 634, all inside §33 (`:565` to the end, `:640`).

## R1 to R9, MR6 and MR8 as I observed them
- Baseline at 620acf4f in the detached worktree `C:/dev/wt/gate229b`: rc 0, 9 of 9 passed, R1 to R9 by name:
  - R1 "a due rotation stages…";
  - R2 "a same-day collision…";
  - R3 "due from Monday 00:00Z…";
  - R4 "a ledger over 153,600 bytes…";
  - R5 "not due exits 0…";
  - R6 "refuses with exit 2…";
  - R7 "a new block over the cap…";
  - R8 "after the rotation commit…";
  - R9 "no hook in .claude/settings.json…".
- MR6: not made (harness refusal; Evidence E-1).
- MR8: not made, for the same reason.
- Porcelain after the refusal: clean (0 bytes). After the probe: clean. At the end: clean.

## Checks 4 and 5
- CI globs (`.github/workflows/governance-ci.yml:142`): `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` at the head: rc 0, 483 tests, 483 pass, 0 fail.
- The counting command against M0 0ff2594e (numstat to a file, then awk): `817 12`, both rc 0.
  - Per file: `AUTONOMY.md` 77 (of 75), `scripts/hooks/hooks.test.mjs` 24 (of 20), `scripts/plan/verify-cites.test.mjs` 41 (of 40). Every other file is within its figure.
  - This matches Amendment 4 item 4.
- `cmp -n` (§8 item 2):
  - `AUTONOMY.md`: rc 0 (86251 bytes at M0, 99811 at the head).
  - `PRECEDENTS.md`: rc 0 (26687 bytes, 30417).
- `gh pr checks 229`: rc 0, all 8 pass. They come from 6 runs, and `gh run view` says each is at 620acf4f84ac5f9e38711b8545d21175a039e6dc:
  - Governance CI: push 39077263861, pull_request 39077266380;
  - DCO: pull_request 39077266403;
  - Exposure scan: pull_request 39077266385;
  - Ported notices: push 39077263931, pull_request 39077266387.
  - These runs read today's ledger, which still has its title line, so they pass. C-1 shows only after R.

## Commands and exit codes
- `git fetch origin`: 0. `git ls-remote origin`: 0 (the branch is at 620acf4f).
- `git log` of the range: 0.
- `git show` of the form at 620acf4f and at origin/main: 0, 0. Amendment 4 is on main only.
- `git show` of the script and the test at 620acf4f: 0, 0.
- `ls` of the three reports: 0.
- `git diff c8b78e90 e984a6a2` and its `--stat`: 0, 0.
- `ls /c/dev/wt/` and `git worktree list`: 0, 0.
- `git worktree add --detach /c/dev/wt/gate229b 620acf4f…`: 0.
- `node --test scripts/plan/rotate-cut-state.test.mjs` (baseline): 0.
- `grep -n "@{u}"`: 0.
- The `sed -i` mutation for MR6: refused by the harness, not run. Then `git status --porcelain`: 0 (clean).
- The probe (`node probe-r8.mjs`): 0. Then porcelain: 0 (clean).
- Export grep and `git grep` for callers: 0, 0.
- CI glob grep: 0. CI globs `node --test`: 0.
- `git diff --numstat` with the counting pathspecs: 0. awk: 0.
- `cmp -n` for AUTONOMY.md: 0. For PRECEDENTS.md: 0.
- `git diff --stat e984a6a2 620acf4f` and the two `-U0` diffs: 0, 0, 0.
- `gh pr checks 229`: 0. `gh run view` ×6: 0 each.
- The `fetch-depth` grep: 0. The grep for tests that read the real ledger: 0.
- Final porcelain in the worktree: 0 (clean).
- `git worktree remove /c/dev/wt/gate229b`: 0. Afterwards `ls` of that path gives 2 (gone).
- The main checkout's porcelain shows only its two existing untracked entries.

I made no commit, push or PR action, and no `claude` command. I ran neither `rotate-cut-state.mjs` nor `flush.mjs` against any tree's ledger; the probe only imported their exported functions in memory. I edited no `.claude/settings.json`. I wrote only to the scratch folder: the probe script and the redirected outputs. Main moved to f064b00b during the run; I made no commit to it.

Paths: `C:\dev\spatial-ide\scripts\plan\rotate-cut-state.test.mjs` and `C:\dev\spatial-ide\scripts\plan\rotate-cut-state.mjs` (as at 620acf4f); `C:\dev\spatial-ide\scripts\plan\CUT-STATE-CAP-AND-ROTATION-PREREGISTRATION.md` (Amendment 4, on main); the probe at `<the custodian's scratchpad>/probe-r8.mjs`.
