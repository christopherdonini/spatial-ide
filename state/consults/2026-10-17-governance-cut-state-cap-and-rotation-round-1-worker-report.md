*Custodian's filing note (2026-10-17): the worker's report of correction round 1 for `governance-cut-state-cap-and-rotation` (PR #229), in C:/dev/wt/csr from c8b78e90; the head 620acf4f84ac5f9e38711b8545d21175a039e6dc, pushed. The run 2026-10-17T22:52:15Z to 2026-10-17T22:59:59Z by its transcript (Read 6, Bash 20, Edit 11, Write 4); its one SubagentHandback call, at 22:59:58Z. Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed. The custodian's checks at the head: each replacement's text is found in the gate report chosen for it, and `flush.mjs`'s four lines equal the architect's W-1 with no other line changed; the counting command prints 817 12; §8 item 2's cmp exits 0 for both files. The message's sha256 as handed back is 53c4c1518e18a22bee6961686e93372a00a07ace9dacd7df686da4f4db1bdcbe; this file's, from line 5 to the end, is 062df00e930c032cfb89b13af7692be05da549788181d1566a3f296ceee1bb0b.*

---

Correction round 1 of PR #229 is done and pushed. The new head is 620acf4f, three commits above c8b78e90, and the push was an ordinary update (rc 0). Everything passed: R1 to R9 (9 of 9), the CI test globs (483 of 483), the five verify scripts, and both cmp checks. The final porcelain is clean.

**Commits (all `-s`, all through `-F` files)**
- 143bf561: the code fix (C-1, E-1, the D-6 timing comment).
- e984a6a2: the MR6 and MR8 `RECORDED MUTATION` lines. This is a third commit; the brief listed two. The lines have to name the fix commit's id, so they could not sit inside it.
- 620acf4f: the words.

**Code** (`scripts/plan/rotate-cut-state.mjs` and `scripts/plan/rotate-cut-state.test.mjs`)
- **C-1:** `--root` is gone from `main()`. Any argument refuses with exit 2; I checked `--root x` by hand, rc 2. The root is now `git rev-parse --show-toplevel` run in `process.cwd()`, and a failure there is a Refusal. In the test file, `rot` spawns with `{ cwd: dir }`.
- **REPO_ROOT:** I removed the constant, and `here` and `fileURLToPath` with it, rather than only dropping the `export`. Nothing used them once `--root` was gone. Say so if you wanted the constant kept.
- **E-1:** R8 keeps its name. It seeds its ledger from the real `state/CUT-STATE.md` through `updateBlockFields`: `flushed_at` and tip set as before, the other six fields `SENTINEL`. After the rotation it asserts:
  - the file starts with `## SESSION-CONTINUITY` and has no line before it;
  - its eight field lines equal the eight seeded lines;
  - the `Before it` path is the first backticked path of the seeded `Previous ledger:` line, which names two `state/` paths;
  - it ends with the notice, a blank line, `## Ledger` and one newline.
  - It also asserts the seeded ledger has a title line before the block.
- **D-6 timing comment:** the architect's line is added above the R-tests header comment.

**Interface read before writing.** `updateBlockFields`, `SESSION_CONTINUITY_FIELDS` and `BLOCK_HEADING` in `scripts/hooks/flush.mjs`. The seeding shape is C5 in `scripts/hooks/flush.test.mjs`.

**R1 to R9** all pass at the fix commit, in `rotate-cut-state.test.mjs`. R1 is the due-rotation test, R2 the same-day collision, R3 the Monday rule, R4 the 153,600-byte rule, R5 not-due, R6 the refusals, R7 the over-cap refusal, R8 the rotation/flush/hooks test, R9 the no-hook-runs-the-script test.

**Mutations**, each applied alone at 143bf5615439 and then reverted. The porcelain after each revert was clean.
- **MR6** (upstream check removed): only the R6 test failed, `refuses with exit 2 and writes nothing off main, on a modified tracked file, or with HEAD not equal to its upstream`.
- **MR8** (rotation rewrites `flushed_at`): two failures, R1 (`a due rotation stages the archive byte-identical to the ledger at HEAD and the new ledger's exact text`) and R8. R8 failed at `its fields are the eight seeded lines`.
- **Existing recorded lines:** unchanged. MR9 was not made again, and no `.claude/settings.json` was touched.

**Words**, written by `csr2-words.mjs` (kept in scratch). Each replacement was byte-copied from the report named, and each old span was found exactly once in its file (the script stops otherwise).
- **`scripts/hooks/flush.mjs` lines 42–43:** the architect's W-1, four lines. The first of the four equals existing line 42, so the diff changes line 43 and adds two lines.
- **`AUTONOMY.md` line 597:** the architect's W-2.
- **`AUTONOMY.md` line 604:** the reviewer's D-3, the whole sentence up to "there.".
- **`AUTONOMY.md` line 569:** the architect's D-4.
- **`AUTONOMY.md` line 625:** the architect's D-3, first replacement only.
- **`AUTONOMY.md` lines 626 and 634:** the architect's D-2, both changes.
- **Not taken:** the reviewer's C-2 and D-4, the architect's D-5, any PR body text, any form amendment.

**Checks and exit codes** (every one in the foreground, output to scratch files)
- `node --test` on the three CI globs: rc 0, 483 tests, 483 pass.
- `verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs` and `verify-test-claims.mjs`: rc 0.
- `verify-mutation.mjs`: rc 0, "all 19 new test(s) have a recorded mutation naming them".
- `cmp -n` against M0 0ff2594e for `AUTONOMY.md`: rc 0. Same for `PRECEDENTS.md`: rc 0.
- **The form's counting command (§7) against M0:** `817 12`. Per file (added, removed):

| File | Added | Removed |
|---|---|---|
| `AUTONOMY.md` | 77 | 0 |
| `PRECEDENTS.md` | 47 | 0 |
| `scripts/hooks/flush.mjs` | 76 | 2 |
| `scripts/hooks/flush.test.mjs` | 130 | 1 |
| `scripts/hooks/hooks.test.mjs` | 23 | 1 |
| `scripts/hooks/session-resume.mjs` | 1 | 1 |
| `scripts/plan/rotate-cut-state.mjs` | 137 | 0 |
| `scripts/plan/rotate-cut-state.test.mjs` | 268 | 0 |
| `scripts/plan/verify-cites.mjs` | 8 | 0 |
| `scripts/plan/verify-cites.test.mjs` | 41 | 0 |
| `state/consults/2026-09-26-source-watcher-gate3-architect.md` | 1 | 1 |
| `state/consults/2026-09-26-stop-hook-lease-gate1-reviewer.md` | 1 | 1 |

  The total is 817, up from 799 in the gate reports, still within the 960 ceiling, and still 12 files. The three per-file overruns from the reports are unchanged: `AUTONOMY.md` 77, `hooks.test.mjs` 24, `verify-cites.test.mjs` 41. The final-head figures for the custodian's amendment are therefore 817 and 12.

**Pre-gate self-check**
- **Cross-module use:** the seam is the flush exports named above, called as the file defines them.
- **Completion claims:** each points to a test or command above.
- **User-facing messages:** the one new refusal text states a git failure. The comment and AUTONOMY words describe behaviour that exists at this commit, per the reports' clause checks.
- **Required tests:** R8 reaches its new assertions; its first run failed on one of my own assertions, which I corrected.

**Caller grep for the removed option:** no file in `scripts/` still passes `--root` to `rotate-cut-state`. The only caller left is the tests' `rot`, which now uses `cwd`.

**Off-scope, not done:** nothing found.

**Model:** the harness reports Sonnet 5.5 (`claude-sonnet-5-5`). No override and no context handoff.
