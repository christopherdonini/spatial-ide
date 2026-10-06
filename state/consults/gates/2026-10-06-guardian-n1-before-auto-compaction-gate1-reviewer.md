# PR #183 gate 1 — reviewer
Reviewed: cut/guardian-n1-before-auto-compaction @ 6cd8454c55cd4572ac4c222b26a0508565636c03

**Verdict: PASS.**
- No Correctness finding and no Evidence finding.
- Two Documentation findings, D-1 and D-2. Each is to be fixed in this pull request before the merge. Neither causes a correction round or a re-gate (the product-first direction, section 2; `AUTONOMY.md` section 22 as amended by #180).

**What I read:**
- The governing form, `tools/mods/GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md` on main, read whole. It was committed at 8500ebefcddf6b52e0e324dd8e24632127cb8061, with Amendment 1 at 49d3f632.
- The P0 report and worker report 1 under `state/consults/`, by section.
- Merge base: 8500ebefcddf6b52e0e324dd8e24632127cb8061, which is on main.
- Machine: Windows 10 Pro 22H2; `claude --version` 2.1.291 (Claude Code); node v24.18.1; git 2.49.0.windows.1.

## Correctness

None. The code was read against the form, item by item:
- **§2.1 (B1).**
  - `contextFill` keeps its name and its one summary-breakdown usage call.
  - The threshold route needs all three of: `isAutoCompactEnabled === true`; a finite threshold above 0; a finite `totalTokens` at or above 0. On that route the fill is `(100 * tokens) / threshold`.
  - `percentage` is read only after the threshold route has returned.
  - An absent fill returns `ran`.
- **§2.2 (B2).**
  - `N1_BAND = 5` is edited in place on line 23, and `N1_TOP_BAND = 95` is added.
  - The band is the form's `Math.min` expression.
  - `shownBands.clear()` runs below 80 on either route.
- **§2.3 (B3).**
  - The nudge condition is `verdict.judged === true && (verdict.stale === true || flushedLongAgo(verdict.flushedAt))`.
  - `flushedLongAgo` returns false for a non-string, an unparseable value and a future time. It parses with `new Date(..).getTime()` and reads `Date.now()` at the call.
  - `continuity.mjs` adds `flushedAt` on every judged path: `null` when no ledger commit exists, `current` otherwise.
  - Its `judged` and `stale` values, git calls, parser, import and export are unchanged.
- **§2.4 (B4).**
  - The threshold route uses `N1_THRESHOLD_TEXT`, which matches §7's template byte for byte (compared, not reproduced here).
  - The fallback route uses `N1_TEXT`; line 36 is unchanged.
- **§2.5 (B5).**
  - N1 has no deny, no catch and no `.catch`.
  - It is registered first, and its first statement is `next(e)`.
  - There is no new `$` call: the calls line is byte-identical (see Evidence).
- **Seams (§1).**
  - The stub breakdown carries exactly Amendment 1's three names.
  - `judgeContinuity`'s new field has one product caller, N1's age clause.
  - No export is added.
  - The parity test's mod side reads only the outcome, and T35 and T36 pass unchanged.

## Evidence

None.

- **Plugin test at the head:** 42 pass, 0 fail, at 2.1.291. No I2.
- **validate (I3).**
  - Both targets, text and `--json`, gave rc 0.
  - On `tools/mods/spatial-guardian`, the hooks and calls lines are byte-identical to v0 Amendment 8's, `tools/mods/GUARDIAN-V0-PREREGISTRATION.md:782-783 @ 8500ebefcddf6b52e0e324dd8e24632127cb8061 sha256:cc345ff9efea1e7b68e5c999d39fb18b6ed3fb61fadff692e556fe571b3ff7f5`. The head's extracted lines hash to the same value, and `cmp` gave rc 0. The same two strings appear in the `--json` notes.
  - The v0 form is unchanged between that base and main e856a17e8f48ea49a5be2d9a52d6ef3015c697a8.
  - On `tools/mods` (the marketplace manifest) there are no hooks or calls lines and `contents` is empty, as worker report 1 says.
- **Every §4 mutation, observed by me at the head** (table below).
  - Each one failed exactly the tests the head's `RECORDED MUTATION` comments name, at 2.1.291.
  - Each was applied in the worktree, the plugin test was run on the worktree's folder, and the file was restored with `git checkout --`. `git diff --quiet` gave rc 0 after each.
  - No verify-mutation run is used as an observation here. I ran verify-mutation only as one of §6's tools.
- **Scripts suite on Windows:** rc 0, 450 tests, 450 pass.
  - T35 passed with its 13 subtests: PS1 to PS10 (PS4a and PS4b separately), PS18 and PS19. Its name in the v0 form's §4 table is `guardian parity: the mod's stale-block check and the Stop hook's stale-continuity check agree on every fixture`.
  - T36 passed. Its name is `guardian parity: the fixture set reaches stale, fresh and not judged on the Stop hook`.
  - The runner prints the names; the labels T35 and T36 come from the v0 form's §4 table rows.
  - governance-ci runs the same suite on ubuntu-latest (the node --test step in `.github/workflows/governance-ci.yml`), and it is green on the PR.
- **§7 recount**, by its own command, from base 8500ebefcddf6b52e0e324dd8e24632127cb8061 to head 6cd8454c55cd4572ac4c222b26a0508565636c03.
  - Per file (insertions/deletions): README 4/4, `continuity.mjs` 8/5, `register.js` 42/11, `guardian.test.ts` 124/11.
  - Total: 4 files, 178 + 31 = 209 changed lines, against at most 350 over 4 files.
  - No class 8, and no I8.
- **§8 items 1 to 7**, checked by reading and by the `git diff -U0` hunk headers:
  1. No new `$` call. `contextFill`'s name and its one usage call are unchanged, and the hooks and calls lines are byte-identical. Holds.
  2. No deny, catch or `.catch` in N1. The registrations have no hunk, so N1 is still first, and `next(` is called with `e` only. Holds.
  3. `percentage` is not read on the threshold route, and that route requires `isAutoCompactEnabled === true`. Holds.
  4. The `continuity.mjs` hunks are `@@ -44 +44,4` (the JSDoc), then `@@ -49`, `@@ -57`, `@@ -59` and `@@ -61`, where the return objects gain `flushedAt` and nothing else. There is no second predicate, and no import, `$` call or new export. Holds.
  5. The age reads only `verdict.flushedAt`, with `Date.now()` at the call and no working-tree read. Holds.
  6. Holds:
     - `register.js`: `@@ -15 +15` and `@@ -23 +23` are in place. Every later hunk, from `@@ -421,2 +421,3` on, is in the N1 section, which starts at line 420 at 7ce9dab2. The file is unchanged between 7ce9dab2 and 8500ebef.
     - `guardian.test.ts`: `@@ -38,2 +38,2` and `@@ -62 +62` are in place. The next hunk is `@@ -642,4 +642,6`, T28's comment, which is line 642 at 7ce9dab2.
     - Nothing is inserted or removed above line 420 or above T28, apart from the named in-place edits.
  7. Holds:
     - The test file's 11 deletions are lines 38-39, line 62, T28's lines (642-645, 648, 650-651) and T29's `state` line (659).
     - Commit 6cd8454c is 34 insertions and 0 deletions, all comment lines: `git diff 2f8100bc 6cd8454c` adds no non-comment line.
     - No existing observation line is edited. T28's comment is replaced along with its test.
- **Tools, each with its commit** (round 15 (c)), run in the worktree at the head:
  - verify-plan (`scripts/plan/verify.mjs` @ 260720226f136d1ec7d72da64656f07d29400ed7): PASS.
  - verify-cites (@ 522e448d55e089b974e115e23f0c72bfc6e1120a): PASS, 1405 files.
  - verify-quotes (@ f9444a4d99a9087394c55d4b1d4c414a8b11f980): PASS, 121 checked, 90 verified, 0 hash-reference errors.
  - verify-test-claims (@ e9735d4749f094f03b69a8b570e8bf10f511c279): PASS, 502 claimed tests.
  - verify-mutation (@ 7d24ed155a120556d6e726eea68237409270d975, `--base 8500ebef --head 6cd8454c`): PASS, 4 new tests, each with a recorded mutation naming it. Its scan lists `tools/mods/spatial-guardian/test/guardian.test.ts`, which confirms worker report 1's §4 statement at that commit. This run is not an observation of a mutation.
- **CI:** `gh pr checks 183` shows 6 checks, all pass, at head 6cd8454c55cd4572ac4c222b26a0508565636c03. No commit on main since the base touches `tools/mods/spatial-guardian/` or `scripts/hooks/`.
- **PR body (§9):** it carries the form and Amendment 1 by reference, both `validate` outputs (text and `--json`), the plugin test output with its version, and the merge-commit request.
- **Profile paths:** none in the diff. The search pattern was self-tested positive first.

### Worker report 1's five deviations, against the form

1. **The T26 and T27 observation lines are at the end of the file.** Sound.
   - For the two tests above T28, §2.6's "appended under each re-observed mutation" conflicts with §8 item 6.
   - §8 item 6 is block-on-sight, and v1's pins depend on its line stability (§0.4).
   - The end-of-file block states the reason.
   - Record as class 2 (D-2).
2. **Only T29's `c` was made recent; `p` stays FLUSH_A.** Sound.
   - §3's B-F5 row is explicit: c = recent(2), p = FLUSH_A.
   - §8 item 7 permits the T29 timestamp edits.
   - M5b is observable only with an old parent, and my M5b run fails B-T5 as recorded.
   - §2.6's "two flushed_at values" is imprecise wording in the form.
   - Record as class 2 (D-2).
3. **The README's "does not claim" bullet was edited.** Sound in substance.
   - It is inside §7's four files. Without the edit, the README would claim 2.1.291 on line 5 and exclude it in the bullet.
   - It is outside the README lines §2.6 names.
   - Record as class 2 (D-2).
4. **The helpers T28 uses are declared at the end of the file.** Sound. Function declarations are hoisted, the suite passes, and T28's neighbours keep their lines.
5. **The observations name 2f8100bc, and commit 2 is comments only.** Sound. The code under observation is identical at 2f8100bc and 6cd8454c, because commit 2 adds only comment lines. My re-observation at 6cd8454c reproduces every recorded failure.

## Documentation (must-fix before the merge)

- **D-1. The fallback qualifier is missing from two summaries.**
  - The header's N1 line (`tools/mods/spatial-guardian/hooks/register.js` line 15) and the README's N1 table row (line 18) give the condition only as 80 percent of the auto-compaction threshold.
  - On the fallback route (auto-compaction off, or no threshold in the breakdown), N1 measures the compaction-window percentage instead. The README paragraph (line 24) says so.
  - The header line and the row should carry the same qualifier, briefly.
  - The paragraph and the code agree, so this is not a guarantee claim, and the finding is Documentation.
- **D-2. The closing record should carry worker report 1's deviations 1, 2 and 3 as class 2 departures from §2.6.** It should cite the report's deviations section by reference, with no prose restating them (the record cap).

## Notes (not findings)

- **Two code paths have no test:** a future `flushed_at` and a `null` `flushedAt`. The code handles both: the age comes out negative, or the type check returns false. §3 orders neither test. A B-F4 step for each would turn the README's "missing, unparseable or future" sentence from read into tested. Optional; the form does not owe it.
- **`Number.isFinite` in `flushedLongAgo` is redundant.** A difference with an unparseable time is NaN, which compares false anyway, so no mutation can observe the check. Harmless.

## Mutations, observed at 6cd8454c55cd4572ac4c222b26a0508565636c03, `claude --version` 2.1.291 (Claude Code)

Test labels (names as the runner prints them):
- T26 = `every process call is git and carries the declared timeout`
- T27 = `N1 appends no line below 80 percent and one line at 80 percent on a stale block`
- B-T3 = `N1 appends at most one line per 5-point band, from 80 to 95 percent`
- B-T5 = `N1 appends nothing on a fresh block`
- T30 = `N1 appends nothing for a subagent call or a refused call`
- T31 = `N1 clears its bands after the fill falls below 80 percent`
- T32 = `N1's line is the declared text with the integer percent`
- B-T1 = `N1 measures the fill against the auto-compaction threshold when the breakdown carries it and auto-compaction is on`
- B-T2 = `N1 falls back to the breakdown percentage when auto-compaction is off or the threshold is absent`
- B-T4 = `N1 judges a block stale when its flushed_at is more than 10 minutes old, and never on an unparseable one`

| Mutation | Applied as | Plugin test | Failing tests | Matches the recorded line | Reverted |
|---|---|---|---|---|---|
| M1a | the threshold route's return guarded by `if (false)`, so the fill is always `percentage` | rc 1, 40/2 | B-T3, B-T1 | yes | yes |
| M1b | `N1_TEXT(p)` on both arms of the route's text choice | rc 1, 40/2 | B-T3, B-T1 | yes | yes |
| M2 | `breakdown?.isAutoCompactEnabled === true &&` replaced by `true &&` | rc 1, 41/1 | B-T2 | yes | yes |
| M3a | `shownBands.add(band);` replaced by `;` | rc 1, 41/1 | B-T3 | yes | yes |
| M3b | `N1_BAND = 10` | rc 1, 41/1 | B-T3 | yes | yes |
| M3c | the band reduced to `Math.floor(p / N1_BAND)` | rc 1, 41/1 | B-T3 | yes | yes |
| M4a | the age clause dropped (`verdict.stale === true` alone) | rc 1, 41/1 | B-T4 | yes | yes |
| M4b | the clause joined by `&&` | rc 1, 41/1 | B-T4 | yes | yes |
| M5a | `N1_MAX_AGE_MS = 0` | rc 1, 41/1 | B-T5 | yes | yes |
| M5b | `continuity.mjs`'s final return with `flushedAt: parent` | rc 1, 41/1 | B-T5 | yes | yes |
| T26 (v0) | `timeoutMs` dropped from N1's git adapter | rc 1, 41/1 | T26 | yes | yes |
| T27 (v0) | `p <= N1_THRESHOLD` in place of `p < N1_THRESHOLD` | rc 1, 39/3 | T27, B-T3, B-T1 | yes | yes |
| T29 (v0) | `judgeContinuity` skipped, verdict `{ judged: true, stale: true }` | rc 1, 39/3 | T26, B-T5, B-T4 | yes | yes |
| T30 (v0) | the `agentId` check dropped | rc 1, 41/1 | T30 | yes | yes |
| T31 (v0) | `shownBands.clear();` replaced by `;` | rc 1, 39/3 | T31, B-T2, B-T4 | yes | yes |
| T32 (v0) | `Math.round(p)` replaced by `p` in `N1_TEXT` | rc 1, 41/1 | T32 | yes | yes |

Each mutation changed one line (diffstat: 1 insertion, 1 deletion). Each target string occurred exactly once before the mutation was applied.

## Commands and exit codes

All ran in `C:/dev/wt/gn1` unless stated. Scratch output went to the session scratchpad, written `<scratchpad>` here.

1. `git status --porcelain; git rev-parse HEAD; git branch --show-current` — rc 0. Porcelain empty; HEAD 6cd8454c55cd4572ac4c222b26a0508565636c03; on the branch.
2. `git diff --stat` and `git diff origin/main...origin/cut/guardian-n1-before-auto-compaction` (three-dot) — rc 0. Exactly §7's four files.
3. `git diff --stat 7ce9dab2 8500ebef -- tools/mods/spatial-guardian/` — rc 0, empty, so the form's 7ce9dab2 pins hold at the base.
4. `git merge-base origin/main origin/cut/guardian-n1-before-auto-compaction` — rc 0, 8500ebefcddf6b52e0e324dd8e24632127cb8061. `git merge-base --is-ancestor 8500ebef origin/main` — rc 0.
5. `claude --version` — rc 0, `2.1.291 (Claude Code)`.
6. `claude plugin test C:/dev/wt/gn1/tools/mods/spatial-guardian` (timeout 300 s) — rc 0, 42 pass, 0 fail.
7. `claude plugin validate C:/dev/wt/gn1/tools/mods/spatial-guardian` — rc 0; with `--json` — rc 0.
8. `claude plugin validate C:/dev/wt/gn1/tools/mods` — rc 0; with `--json` — rc 0.
9. The validate comparison:
   - `sed -n 782,783p tools/mods/GUARDIAN-V0-PREREGISTRATION.md`, and `grep -E` of the head's hooks and calls lines, then `cmp` — rc 0.
   - `sha256sum` of both: cc345ff9efea1e7b68e5c999d39fb18b6ed3fb61fadff692e556fe571b3ff7f5.
   - `git diff --quiet origin/main origin/cut/guardian-n1-before-auto-compaction -- tools/mods/GUARDIAN-V0-PREREGISTRATION.md` — rc 0.
10. For each of the 16 mutations:
    - a `node -e` exact-string replacement, with the target count asserted to be 1 — rc 0;
    - `claude plugin test C:/dev/wt/gn1/tools/mods/spatial-guardian` (timeout 300 s) — rc 1 each;
    - `git checkout -- <file>` — rc 0 each;
    - `git diff --quiet` — rc 0 each.
11. `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` (timeout 580 s) — rc 0, 450/450.
12. `git diff --numstat 8500ebefcddf6b52e0e324dd8e24632127cb8061..6cd8454c55cd4572ac4c222b26a0508565636c03 -- . ':!tools/mods/GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'` — rc 0, 209 lines over 4 files.
13. `git diff -U0 8500ebef..6cd8454c` on the three code and test files, filtered to the file and hunk-header lines — rc 0. The headers are listed under §8 above.
14. `git diff --numstat 2f8100bc 6cd8454c` — rc 0, 34/0 in `guardian.test.ts`, with no added non-comment line.
15. A profile-path grep over the three-dot diff — rc 1 (no match), after a positive self-test of the pattern — rc 0.
16. The verify tools (each with timeout 280 s), then `git status --porcelain` afterwards, which was empty:
    - `node scripts/plan/verify.mjs` — rc 0;
    - `node scripts/plan/verify-cites.mjs` — rc 0;
    - `node scripts/plan/verify-quotes.mjs` — rc 0;
    - `node scripts/plan/verify-test-claims.mjs` — rc 0;
    - `node scripts/plan/verify-mutation.mjs --base 8500ebef --head 6cd8454c` — rc 0.
17. `git log -1 --format=%H -- scripts/plan/<tool>.mjs` for each tool — rc 0. The commits are listed under Evidence.
18. In `C:/dev/spatial-ide`:
    - `git fetch -q origin` — rc 0;
    - `gh pr checks 183` — rc 0, 6 pass;
    - `gh pr view 183`, with `--json headRefOid,baseRefName,mergeStateStatus` and with `--json body` — rc 0.
19. `git diff --stat 8500ebef origin/main -- tools/mods/spatial-guardian scripts/hooks` — rc 0, empty.
20. The report write: a quoted heredoc to the gates path — refused by Guardian G1 before it ran; the file does not exist.

**Final state:**
- The worktree is at HEAD 6cd8454c55cd4572ac4c222b26a0508565636c03 with empty porcelain.
- Nothing was written in the main checkout's `tools/mods/`.
- The only `claude` subcommands run were `--version`, `plugin validate` and `plugin test`.
- No commit, rebase or remote write.
