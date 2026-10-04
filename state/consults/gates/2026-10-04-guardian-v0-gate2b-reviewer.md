*Custodian's filing note (2026-10-04): PR #169's gate 2b, the reviewer's scoped re-gate (attempt 3) for its gate-2 S1-1 evidence, under node:guardian-v0@g5. Reviewed: cut/guardian-v0 @ 1d057c79232dcbaccb4709f1d14eefbbaff5a9df (from the report's own second line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). Written by the reviewer to this path through its shell and committed as written below the rule. Its sha256, from this file's line 5 to the end, is 09277129877b95bbdaa9d9fe8727877f98abd50d967b5f8dc343cc99630b664c, equal to the hand-back. The worktree's porcelain was empty after the run. With the gate-2 architect's PASS (gate-log 381), both gates pass at the head.*

---

# PR #169 gate 2b — reviewer (S1-1 evidence)
Reviewed: cut/guardian-v0 @ 1d057c79232dcbaccb4709f1d14eefbbaff5a9df

Scope: gate 2's S1-1 only (`state/consults/gates/2026-10-04-guardian-v0-gate2-reviewer.md`, untracked when this was written; its own line 6 names the same head). Everything else in that report stands and was not re-done. `<worktree>` is the gate worktree on `cut/guardian-v0`. HEAD was 1d057c79 at the start and the end, and `git status --porcelain` was empty at the start, after each mutation, and at the end. `register.js` sha256 dd420213ee0f05595e0d8704fbe7f00b77c92756b149b1a20456a438e1f96f45 at the end, the same as gate 2.

## Verdict

- **S1-1: PASS.** `claude plugin test tools/mods/spatial-guardian` ran at 1d057c79 on build 2.1.289: 39 pass, 0 fail, exit 0. All 39 recorded plugin-test mutations (T1 to T34 and T37 to T41) were observed at the head. Each failing set equals its `// RECORDED MUTATION:` comment, so none differs. The refusal did not return during this run.
- This discharges the items gate 2 listed under S1-1: §9's Reviewer item that `claude plugin test` runs on the custodian's machine; §9's "every mutation observed at the gated head" for T1 to T34 and T37 to T41; Amendment 2's §9 Reviewer item for T37 to T39 and the re-observed T1 to T9; and Amendment 4's §9 Reviewer item for T40, T41, T22 and T23. The proof is the mutation table below.
- **Overall gate verdict for the head: PASS.** Gate 2 had no other S1. Its S2-1 to S2-3 and N-1 to N-6 stand as non-blocking, and they go to the closing record and the architect as gate 2 routed them.

## Runs (UTC; in `<worktree>`; every `claude` command under `timeout`)

| Time (start to end) | Command | Exit | Result |
|---|---|---|---|
| 10:13:55Z | `timeout 60 claude --version` | 0 | `2.1.289 (Claude Code)` |
| 10:14:03Z to 10:14:06Z | `timeout 300 claude plugin test tools/mods/spatial-guardian` (unmutated) | 0 | 39 pass, 0 fail, "Ran 39 tests across 1 file. [2.31s]". Each of the 39 tests in the file printed `(pass)`. |
| 10:17:03Z to 10:19:47Z | the 39 mutation runs (below), each `timeout 300 claude plugin test tools/mods/spatial-guardian` | 1 each | "Ran 39 tests across 1 file" each time |
| 10:20:01Z to 10:20:05Z | `timeout 300 claude plugin test tools/mods/spatial-guardian` (unmutated, after every revert) | 0 | 39 pass, 0 fail, "Ran 39 tests across 1 file. [3.45s]" |
| about 10:20:06Z | `timeout 60 claude --version` | 0 | `2.1.289 (Claude Code)` |

The full output of the first unmutated run is 45 lines: the file header, 39 `(pass)` lines carrying the 39 test names in file order, and the three summary lines. It is not reproduced here, because the summary carries the claim.

## Mutations observed at the gated head (1d057c79, build 2.1.289)

Method: each mutation was applied to `tools/mods/spatial-guardian/hooks/register.js` as its comment describes, by a scripted single-occurrence string replacement in a script in the session scratchpad, outside the repository. The script confirmed the target occurred exactly once; T41 targets the second occurrence, inside `guardPowerShell`. The plugin tests were run, the `(fail)` names were read from the output, and the file was reverted with `git checkout -- <file>`. `git status --porcelain` was then empty (0 lines) after every one. The test ids follow the form's §4 table and Amendments 2 and 4, mapped to the 39 test names in file order. Every run exited 1. "=" means the failing set equals the recorded comment's.

| Mutation | Applied as | Failing tests (pass/fail) | vs comment |
|---|---|---|---|
| T1 | the `/^-[A-Za-z0-9]*[fd]/` cluster line dropped | T1, T38 (37/2) | = |
| T2 | `--force-with-lease` matched only bare | T2 (38/1) | = |
| T3 | the `+` refspec line dropped | T3, T38 (37/2) | = |
| T4 | the `--mirror` line dropped | T4 (38/1) | = |
| T5 | the `:` refspec line dropped | T5 (38/1) | = |
| T6 | the `pushRefused(token.value, depth + 1)` line dropped | T6, T37 (37/2) | = |
| T7 | the `text.includes('push')` line dropped | T7 (38/1) | = |
| T8 | `for (const text of [command])` | T8, T37 (37/2) | = |
| T9 | the PowerShell registration dropped | T9, T37, T40, T41 (35/4) | = |
| T10 | G2's suffix tested on `placed.real` with separators normalised, not lower-cased | T10, T34 (37/2) | = |
| T11 | `norm.includes('/docs/')` for the suffix | T11, T12, T15, T34 (35/4) | = |
| T12 | protected only on a literal `Accepted —` | T12, T34 (37/2) | = |
| T13 | `includes` for `startsWith` | T13 (38/1) | = |
| T14 | `return true` in the write branch | T14, T16, T26 (36/3) | = |
| T15 | `isProtected = true` | T15 (38/1) | = |
| T16 | the current-bytes read's rejection caught and read as an empty string | T16 (38/1) | = |
| T17 | G4's `placed.exists` Write branch dropped (Edit only) | T17 (38/1) | = |
| T18 | G4 on the `/state/directives/` segment alone | T18 (38/1) | = |
| T19 | `return next(e)` for the UNPLACEABLE deny | T19 (38/1) | = |
| T20 | G6 compares the basenames of the normalised paths | T20 (38/1) | = |
| T21 | G6 compares the placed paths without `normalise` | T21 (38/1) | = |
| T22 | zero REPORT PATH matches return undefined | T22, T40 (37/2) | = |
| T23 | the report-only type check dropped | T23, T40 (37/2) | = |
| T24 | the Write registration's `.catch` removed | T16, T24, T25 (36/3) | = |
| T25 | `.catch(() => undefined)` on the Write registration | T16, T24, T25 (36/3) | = |
| T26 | `timeoutMs` dropped from N1's git adapter | T26 (38/1) | = |
| T27 | `<=` for `<` in N1's threshold test | T27 (38/1) | = |
| T28 | `shownBands.add(band)` dropped | T28 (38/1) | = |
| T29 | `const verdict = { judged: true, stale: true }` | T26, T29 (37/2) | = |
| T30 | the `agentId` check dropped from N1's early return | T30 (38/1) | = |
| T31 | `shownBands.clear()` dropped | T31 (38/1) | = |
| T32 | `Math.round(p)` replaced by `p` | T32 (38/1) | = |
| T33 | the `text.endsWith(old) &&` line dropped | T33 (38/1) | = |
| T34 | the NotebookEdit registration dropped | T34 (38/1) | = |
| T37 | only the first reading (`readingRefuses(command, depth, false)`) | T37 (38/1) | = |
| T38 | only the second reading (`readingRefuses(command, depth, true)`) | T38 (38/1) | = |
| T39 | the second reading refusing any segment holding git then push, as the comment's replacement | T8, T9, T39 (36/3) | = |
| T40 | the PowerShell registration's hook set back to `refuseForcePush` | T40 (38/1) | = |
| T41 | `if (true)` for `guardPowerShell`'s `agentId` condition | T9, T37, T41 (36/3) | = |

Times: T1 started at 10:17:03Z and T41 ended at 10:19:47Z. Each run took 3 to 5 seconds.

Where a comment names the change but not its exact code, I chose the code: T10, T16, T20 and T22 (as worded above). Each chosen spelling produced the recorded failing set.

## Notes

- No `verify-mutation` run was made in this gate. The observations above are runs of the plugin tests on mutated code.
- One stray write is disclosed. A failed shell command left `cd` unexecuted, so a scratch file, `names.mjs` (test names only), was written into the main checkout's root. It was untracked and was deleted within a minute, and it never touched the worktree. The main checkout's porcelain lists no such file.

## Limits kept

The only `claude` commands run were `claude --version` (twice) and `claude plugin test tools/mods/spatial-guardian` (41 runs), each under `timeout`. There was no install, enable, marketplace, init, update, configure or eval, and no session was started. Nothing was written under the user Claude directory. Nothing was committed, pushed or rebased. The worktree ends clean at 1d057c79. Outside the session scratchpad, the only write is this report, apart from the stray file disclosed above.
