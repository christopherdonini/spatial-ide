*Custodian's filing note (2026-10-06): `guardian-n1-before-auto-compaction`'s build, worker report 1, by the worker-high on the custodian's brief after Amendment 1 (main 49d3f632). It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is ebd473f8b54ee5941095af2c75b15f3fb84ebfdc62e84bfb8b541248f93fd2f4. Write audit PASS: 41 Write or Edit calls, every one in the worktree `C:/dev/wt/gn1` or the scratchpad folder `pieceB-build`; its Bash writes, read from its transcript, went to that folder; none was in the main checkout (whose `tools/mods/` shows no change) or under the user's Claude folder. Tool calls Read 9, Bash 31, Edit 38, Write 3, SubagentHandback 1. Run window from the transcript: 2026-10-06T05:44:34.252Z to 2026-10-06T05:58:24.546Z (the harness's usage line: 147,281 subagent tokens, 82 tool uses, 830,306 ms). Refusals in its run: none. Its two commits were published to the branch by the custodian (head 6cd8454c).*

---

# guardian-n1-before-auto-compaction — worker report 1 (the build)

Model observed: claude-sonnet-5-5 (Sonnet 5.5), run as worker-high on the brief's escalation. No model override beyond that. No context handoff received or produced.

Start check: the worktree `C:/dev/wt/gn1` was at 8500ebef on `cut/guardian-n1-before-auto-compaction`, porcelain empty. The form there is the 8500ebef copy with no Amendment 1, so I read the form and Amendment 1 from main's file (the main checkout at 49d3f632). I edited no form. Nothing was written into the main checkout: its porcelain still shows only the two untracked entries it had at the start.

## Commits (signed off, paths staged by name)
1. `2f8100bc09b80f1cae73bfbd12ed8f488a06da73` — the change: `register.js`, `continuity.mjs`, `guardian.test.ts`, `README.md`. 144 insertions, 31 deletions. `claude plugin test`: 42 pass, 0 fail.
2. `6cd8454c55cd4572ac4c222b26a0508565636c03` — the `// RECORDED MUTATION` observation lines. `guardian.test.ts` only, 34 insertions, 0 deletions. No existing line is edited. Each line names `2f8100bc` and `2.1.291 (Claude Code)`.

Worktree after commit 2: porcelain empty. Nothing was published to a remote.

## What was built (§2)
- **`contextFill`**: keeps its name and its one `$.session.usage({ breakdown: 'summary' })` call. It returns `{ p, route }`.
  - The threshold route is taken only when `isAutoCompactEnabled === true`, `autoCompactThreshold` is a finite number above 0, and `totalTokens` is a finite number at or above 0. Then p = `(100 * tokens) / threshold`.
  - Otherwise p is `percentage` when finite. Otherwise `undefined`, and N1 returns `ran`.
- **Bands**: `N1_BAND = 5` (line 23, in place). `N1_TOP_BAND = 95` and `N1_MAX_AGE_MS = 10 * 60 * 1000` are in the N1 section.
  - band = `Math.min(Math.floor(p / N1_BAND), N1_TOP_BAND / N1_BAND)`.
- **Age clause**: `flushedLongAgo(flushedAt)` returns true only for a string that parses (`new Date(..).getTime()`) to a finite time more than `N1_MAX_AGE_MS` before `Date.now()` at the call. N1 nudges on `judged === true && (stale === true || flushedLongAgo(verdict.flushedAt))`.
- **Text**: `N1_THRESHOLD_TEXT(p)` is §7's sentence, byte for byte. The fallback route keeps `N1_TEXT` on line 36, unchanged.
- **`continuity.mjs`**: each judged result carries `flushedAt`. It is `null` when no ledger commit exists. On every other judged path it is `current`, the value parsed at that commit. `judged`, `stale`, the git calls and the parser are unchanged. The JSDoc states the new shape. No import, export or `$` call was added.
- **README**: line 5 (build of record is 2.1.291), line 18 (the N1 row), line 24 (both routes, the fallback disclosure that N1 may never fire there, the age clause as N1's alone, the parity sentence kept). Also the last "does not claim" bullet (see deviation 3).
- **Tests**: `World` and `arm` edited in place (lines 38, 39 and 62: an `extra` breakdown map, spread into the breakdown).
  - T28 rewritten whole as B-T3.
  - T29's fixture made recent.
  - B-T1, B-T2 and B-T4 appended under their own section heading, with helpers `thresholdLine`, `recent`, `bashWith` and `bashTokens`. All are function declarations.
  - The stub breakdown carries Amendment 1's three names only: `totalTokens`, `isAutoCompactEnabled`, `autoCompactThreshold`.

## Tests and mutations, each observed at 2f8100bc, `claude --version` 2.1.291 (Claude Code)
Each mutation was applied by name by a scratch script (`<scratchpad>/pieceB-build/mutate.mjs`) that rewrote one string, ran `claude plugin test` on the worktree's mod folder, recorded the `(fail)` lines, and restored the file. It reported "restored byte-identical" every time, and porcelain was empty afterwards. Failing tests, by name:

| Mutation | Fails |
|---|---|
| M1a, threshold route dropped (`isAutoCompactEnabled === true` made unsatisfiable, so p is always `percentage`) | `N1 measures the fill against the auto-compaction threshold when the breakdown carries it and auto-compaction is on`; `N1 appends at most one line per 5-point band, from 80 to 95 percent` |
| M1b, v0's text on the threshold route | the same two |
| M2, `isAutoCompactEnabled === true` condition dropped | `N1 falls back to the breakdown percentage when auto-compaction is off or the threshold is absent` |
| M3a, `shownBands.add(band)` dropped | `N1 appends at most one line per 5-point band, from 80 to 95 percent` |
| M3b, `N1_BAND = 10` | the same |
| M3c, top-band bound dropped | the same |
| M4a, age clause dropped | `N1 judges a block stale when its flushed_at is more than 10 minutes old, and never on an unparseable one` |
| M4b, clause joined by AND | the same |
| M5a, `N1_MAX_AGE_MS = 0` | `N1 appends nothing on a fresh block` |
| M5b, `continuity.mjs` returning the parent's `flushed_at` as `flushedAt` | `N1 appends nothing on a fresh block` |
| T29's v0 mutation (judgment skipped, `{ judged: true, stale: true }`) | `every process call is git and carries the declared timeout`; `N1 appends nothing on a fresh block`; `N1 judges a block stale when its flushed_at is more than 10 minutes old, and never on an unparseable one` |
| T26, `timeoutMs` dropped from N1's git adapter | `every process call is git and carries the declared timeout` |
| T27, `<=` for `<` | `N1 appends no line below 80 percent and one line at 80 percent on a stale block`; B-T3's test; B-T1's test |
| T30, `agentId` check dropped | `N1 appends nothing for a subagent call or a refused call` |
| T31, `shownBands.clear()` dropped | `N1 clears its bands after the fill falls below 80 percent`; B-T2's test; B-T4's test |
| T32, `Math.round(p)` replaced by `p` in `N1_TEXT` | `N1's line is the declared text with the integer percent` |

No verify-mutation run was used as an observation. verify-mutation was run once (`--base 8500ebef --head HEAD`, rc 0): 4 new tests, each with a recorded mutation naming it. **Its scan covers `tools/mods/**/*.test.ts` at its commit:** the script's last commit is 7d24ed15, it diffs with the pathspec `*.test.ts` and no directory restriction, and its output listed `tools/mods/spatial-guardian/test/guardian.test.ts`.

## Suites at 6cd8454c, exit codes
- `claude --version`: `2.1.291 (Claude Code)`, rc 0. No I2.
- `claude plugin test C:/dev/wt/gn1/tools/mods/spatial-guardian`: 42 pass, 0 fail, rc 0. Before this piece the suite was 39 tests; B-T1, B-T2 and B-T4 add 3.
- `claude plugin validate`:
  - on `tools/mods/spatial-guardian`, text rc 0 and `--json` rc 0, one warning (no version specified), "Validation passed with warnings";
  - on `tools/mods`, text rc 0 and `--json` rc 0, two warnings (the same, per plugin), passed with warnings. That target is the marketplace manifest and prints no hooks or calls lines (`"contents": []`).
- The `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` suite, in the worktree: rc 0, 450 tests, 450 pass, 0 fail.
  - **T35**: `guardian parity: the mod's stale-block check and the Stop hook's stale-continuity check agree on every fixture`. It passed, with its 13 subtests PS1, PS2, PS3, PS4a, PS4b, PS5 to PS10, PS18 and PS19.
  - **T36**: `guardian parity: the fixture set reaches stale, fresh and not judged on the Stop hook`. It passed.
  - The T35/T36 labels are mine. The parity file's header names them, and the output prints the two test names only.
- `node scripts/plan/verify.mjs` (verify-plan): rc 0, PASS.
- verify-cites: rc 0, PASS, 1405 files.
- verify-quotes: rc 0, PASS, 121 checked, 90 verified, 0 hash-reference errors.
  - Also run with `--show-cites` on the four changed files: rc 0, 0 checked, none of the four files carries a quote or cite.
- verify-test-claims: rc 0, PASS, 502 claimed tests.
- The scripts are those of the worktree tree at 6cd8454c.

## `validate` lines (I3)
Byte-copied from the text output on `tools/mods/spatial-guardian`. The `--json` notes hold the same two strings (checked with `grep -o`).
```text
  ❯ ./register.js hooks: tool.call, tool.call{tool=Bash}, tool.call{tool=PowerShell}, tool.call{tool=Write}, tool.call{tool=Edit}, tool.call{tool=NotebookEdit}
  ❯ ./register.js calls: $.agent.list (via g6Refusal), $.fs.read (via g3Refuses), $.fs.stat (via place), $.process.run, $.session.messages (via g6Refusal), $.session.usage (via contextFill)
```
Compared with v0 Amendment 8's two lines, taken from `tools/mods/GUARDIAN-V0-PREREGISTRATION.md` lines 782-783 on this branch, with `cmp`: identical (rc 0). Both files have sha256 cc345ff9efea1e7b68e5c999d39fb18b6ed3fb61fadff692e556fe571b3ff7f5. `(via contextFill)` is intact. The two `.catch` note lines are unchanged too.

## §7's figures
Merge base: 8500ebef (`git merge-base 49d3f632 HEAD`). The count is `git diff --numstat 8500ebef..6cd8454c -- . ':!tools/mods/GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`:
- README 4/4, `continuity.mjs` 8/5, `register.js` 42/11, `guardian.test.ts` 124/11.
- Total: 4 files, 178 insertions plus 31 deletions = **209 changed lines**, against 350 and 4 files. The estimate was 40, 12, 220, 15. No I8.

## §8, item by item, as checked
1. No new `$` call. `contextFill`'s name and its one usage call are unchanged. The hooks and calls lines are byte-identical (above).
2. N1 has no deny, catch or `.catch`. It is registered first, its first statement is `next(e)`, and `next(` is called with the received event only.
3. `percentage` is read only after the threshold route has returned (it is not read on that route). The threshold route requires `isAutoCompactEnabled === true`.
4. No second staleness predicate. `continuity.mjs`'s `judged` and `stale` results, git calls and parser are unchanged. No import, `$` call or second export there.
5. The age is read from `verdict.flushedAt` only, with `Date.now()` at the call. No working-tree read.
6. `register.js` hunks, from `git diff 8500ebef 6cd8454c -U0`: `@@ -15`, `@@ -23`, then `@@ -421,2 +421,3` and later hunks, all in the N1 section. Nothing is inserted or removed above line 420 except the two in-place edits.
   - `guardian.test.ts`: `@@ -38,2 +38,2`, `@@ -62 +62` (in place), then the first change is `@@ -642,4 +642,6`, inside T28's own comment and body. Deviation 1 below is about this item.
7. The only v0 test text changed in commit 1 is T28 (rewritten) and T29's `state` line. Commit 2 has 0 deletions, so no existing observation line is edited. T28's comment is replaced along with the test.
8. Only the four files are changed. Nothing is under `scripts/hooks/` or `.claude/`, and no filed form is touched.
9. `claude` subcommands run: `claude --version`, `claude plugin validate`, `claude plugin test`. No install, enable, load, reload, marketplace or session start. Nothing was written under the user's Claude folder. Nothing was written into the main checkout. Other `claude` processes exist on the machine (the custodian's); I started none and killed none.
10. No live G1 probe, nothing G1-shaped on purpose, and no forced N1 probe.
11. No user-profile path in any file, test, record or commit message. I grepped the full diff for the user name, the AppData and Users patterns, after a positive self-test of the pattern: no match.
12. Every new test has a `RECORDED MUTATION` line, each with its observation line at 2f8100bc. No `verify-mutation` run is called an observation.
13. No §7 overrun, so no class 8. No scope addition.
14. No hash pin of a branch test-text span. I wrote no record.
15. I wrote no record or amendment.
16. No squash, rebase or force-push.
17. The two N1 texts are exactly §7's two. `N1_THRESHOLD_TEXT` was compared by eye and by the plugin test (`thresholdLine` is a separate written-out copy).
18. No five-line form.
19. Code started after Amendment 1, from the main copy. I1 and I4 did not fire. The stubs use Amendment 1's three names.

## Deviations from the form (my readings, each needs a ruling or a nod)
1. **T26 and T27 observation lines are at the end of the file, not under their tests.** §2.6 says "observation lines are appended under each re-observed mutation", but T26 (line 596) and T27 (line 629) sit above T28, and §8 item 6 forbids inserting any line above T28. I took §8 item 6, since the reviewer checks it by hunk headers. Both re-observations are in a comment block after B-T4 that says why.
2. **T29's two `flushed_at` values.** §2.6 reads "T29's two flushed_at values become recent", but B-F5 says c = recent(2), p = FLUSH_A. I made `c` recent(2) and left `p` as FLUSH_A. M5b is observable only with an old parent: with a recent parent the clause would not fire and T29 would still pass. Only the `c` value changed.
3. **README beyond lines 5, 18 and 24.** I also edited the last "does not claim" bullet, "Any build other than 2.1.289 for the tested behaviour", to 2.1.291, so that it would not contradict line 5. It names the type reads at 2.1.288 and N1's three fields at 2.1.291. Within §7's four files, but outside the lines §2.6 names.
4. T28 (above the new section) calls helpers (`thresholdLine`, `bashTokens`) defined at the end of the file. They are function declarations, so they are hoisted, and the suite passes. I put them there to leave T28's neighbours' lines alone.
5. Commit 1 carries the mutation descriptions; commit 2 carries the observations. The observation commit named in each line is 2f8100bc, a clean tree. Commit 2 changed comments only. The plugin test rerun after it passed 42/0.

## Noticed, not done (off-scope)
- B-F4 has no step for a future `flushed_at` (R-3), and nothing tests the `null` `flushedAt` path (no ledger commit). The code handles both. Neither is in §3, so I added neither.
- Edge inputs of the threshold route (threshold 0, a non-finite `totalTokens`) are not tested. §3 does not ask for them.
- The T29 fixture and the age tests use `Date.now()`-relative times. B-F4 puts 11 minutes against a 10-minute edge, so a test run would need to take over 9 minutes to flip them.

## Git commands that changed state (all rc 0)
- `git add` of the four files, then `git commit -s -F <scratchpad>/pieceB-build/msg1.txt`, giving 2f8100bc.
- `git add tools/mods/spatial-guardian/test/guardian.test.ts`, then `git commit -s -F <scratchpad>/pieceB-build/msg2.txt`, giving 6cd8454c.
- No other state-changing git command. Scratch files (`msg1.txt`, `msg2.txt`, `mutate.mjs`, `mutations.txt`, and the suites' outputs) are in `<scratchpad>/pieceB-build/`.

Exact state: `C:/dev/wt/gn1`, `cut/guardian-n1-before-auto-compaction`, HEAD 6cd8454c55cd4572ac4c222b26a0508565636c03, porcelain empty, nothing published.
