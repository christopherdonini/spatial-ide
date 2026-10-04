# PR #172 gate 1 — reviewer
Reviewed: cut/evidence-recorder-v0 @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8

**Verdict: FAIL** (cut/evidence-recorder-v0 @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8). Two S1, both in Amendment 1's record; none in the code. Three S2, eight N. The code, the tests, validate, §7 and all 20 mutations come out as the form predicts. Tag `node:evidence-recorder-v0@g2`.

Cite convention: form lines 1-459 are on main at ea5aba5d120ee173d32c786a53b291ec83ff3d71 and are pinned with their line's sha256. Amendment 1 and every file under `tools/mods/spatial-evidence-recorder/` exist only on the unmerged branch: they are named with commit 976e64cdd07ae182e42cfe2f5f70891c16bedde8 and carry no hash (round 25, item 2). No passage below is a quotation.

## Blocking (S1)

**S1-1. Amendment 1, C2-b cites the wrong section.** The bullet at `tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:469 @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8` says the log-root lookup (once per module load, cached on success) is §2.4's. §2.4 is Tree and identity (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:190 @ ea5aba5d sha256:ec5f69a013e9778da819528456fae76922594c5f0baed7f1872193cfc0261dad`) and does not contain the lookup. The lookup and both terms are in §2.7 (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:218 @ ea5aba5d sha256:8aadefb4d0fc506b577a975dfa681ff0c9de1a6d799796b7e8073813c3d6f75c`, `tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:219 @ ea5aba5d sha256:29b499c141ca13ce6ec2ef48ab4d2f7175093420a738ea62df4ccd113f65257c`). A grep of the branch's form for the term finds it only at line 219 and in the amendment itself. A cite that does not resolve to what it names is a gate failure by name (round 7). Fix: an appended correction naming §2.7, with a superseded index.

**S1-2. Amendment 1 omits a class-2 result that the form classes in advance.** §5's validate prediction (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:350 @ ea5aba5d sha256:48c33cf32449faf191dab27a20c910048951416dcb689353edcdae7eec8bc4b1`) classes as class 2 any difference confined to a `(via …)` annotation. Observed at 2.1.289 (check 4 below): the calls line differs from §2.0's declared line by exactly three such annotations, `(via agentTypeOf)`, `(via writeRecord)` and `(via gitRun)`, and by nothing else. That is a class-2 result by the form's own text. Guardian's form handles the same case the same way (`tools/mods/GUARDIAN-V0-PREREGISTRATION.md:670` on main: recorded as class 2, not I3). Amendment 1 says its three items are the only ones (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:475 @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8`). The worker's reading (worker report 1, §7, last paragraph), repeated in the PR body, has §5 backwards: §5 calls the difference class 2 when the annotation is the whole difference, and here it is. I3 rightly did not fire. Fix: append a C2-d recording the annotations, in the same correction as S1-1, and correct the PR body's reading.

## Should fix (S2)

**S2-1. C2-b states the kit's rule more broadly than observed.** The bullet says the dispatch refuses any hook that is not a function declared at the module's top level. Observed at 2.1.289:
- an inline async arrow passed to `on` inside `register` (replacing `hooks/register.js:462`), with or without a captured local, loads, and the test run exits 0 with 20 pass;
- a function declared by name inside `register` and passed by name is refused at load (exit 1, 20 fail), with the load error naming the hook and the rule.

The refusal applies to a hook passed by name. The code's shape (top-level declarations) is within what the kit accepts, so nothing in the code changes. Narrow the statement in the S1-1 correction.

**S2-2. The README omits some of §1's limits.** §2.10 requires the README to state §1's limits. `tools/mods/spatial-evidence-recorder/README.md:39-48 @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8` leaves out:
- live behaviour before its E-row: the chain order with Guardian (E1), and subagent usage and listing at turn end (E3) (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:108 @ ea5aba5d sha256:99cb22d5a018e75f201c01326fcdbf8e337fb568587f65b79de64088cacb05fe`);
- loading: that `claude plugin test` or `validate` loads the mod (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:113 @ ea5aba5d sha256:140c7ab197ff54a0106f640e35bd6aa1b086efa3157ad0c53608a97fa4c2442e`);
- the not-approved table, within Coverage (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:107 @ ea5aba5d sha256:d714c261fcc8beff3bad0d63edde63fb058b05a22a849b70fc1865ecbf695b03`).

The README is within §7's scope; the fix stays within the 1400-line ceiling (1109 now).

**S2-3. C2-a describes test text with no commit id.** C2-a (`tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md:467 @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8`) says the tests normalise the written path and say so in a comment. The comment is `tools/mods/spatial-evidence-recorder/test/recorder.test.ts:89 @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8`, on the unmerged branch. The clause cites no span, so I do not hold it to round 25, item 2's span rule as a block. It carries no commit id, though, and the same correction can add one: the comment is unchanged since 9acc86b8c55956d679f14c0df98981c80137d9ef.

## Notes (N)

- **N-1, R3.** `recorder_ms.write` covers the log-root lookup (a git call, on the first record of a load) and the record assembly. It does not cover the `$.fs.write` call or the file-name hash. E5's sum therefore under-counts by the write's latency. E5's row should say so.
- **N-2, R1.** The case where one pair differs and another is `unavailable` resolves to true. No test exercises it.
- **N-3, R7.** The report says F4 adds an exit-128 and a rejection on each of the three calls. T4 actually runs rev-parse with reject and exit-128, status with exit-128 and reject, and diff with truncated and reject; there is no exit-128 on diff. This is a report inaccuracy only.
- **N-4, a gap in the form's matcher, not a code defect.** It approves calls whose approved segment does not run: a `#` comment ahead of `&& cargo test`, or `true || cargo test`. It also approves the unquoted-backslash spelling F3 lists, which bash collapses. The code follows §2.2 as written. Records are not citable in v0. This is for the window.
- **N-5.** `splitCommand` also splits at a bare CR, beyond §2.2's newlines. It is harmless on CRLF.
- **N-6.** Neither `$.agent.list` nor `$.fs.write` has a timeout. The form requires one only on `$.process.run`, but a hang in either would hold the tool result.
- **N-7.** The failing-write path is asserted with `toEqual` only, in T15. In T13's every-`$`-call-rejects case the log-root lookup fails first, so the write is never reached under its `JSON.stringify` check. Identity holds by reading: `return ran` at `hooks/register.js:421 @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8`.
- **N-8.** With `tree_basis` `unresolved`, the log-root git call still runs on the first record of a load. It is not a tree call, and §2.4's no-git clause reads as covering tree calls.

## Checks, with exit codes

All commands ran in `C:/dev/wt/recorder` at 976e64cdd07ae182e42cfe2f5f70891c16bedde8. `claude` ran only as `--version`, `plugin test` and `plugin validate`, each under `timeout`.

1. **The diff.** `git diff --stat origin/main...origin/cut/evidence-recorder-v0` exits 0. It shows 8 files and 1128 insertions: §7's seven files plus the form's 19 appended lines. `git log origin/main..HEAD` shows three commits: 9acc86b8c55956d679f14c0df98981c80137d9ef, 32fc334f43ec3667bb0d5474ece34bbb1f32cf67 and 976e64cdd07ae182e42cfe2f5f70891c16bedde8. The merge base is ea5aba5d120ee173d32c786a53b291ec83ff3d71, which is on main.
   - 32fc334f changes only comment lines: a filtered grep of its diff for any other changed line finds none (exit 1).
   - register.js is identical at 9acc86b8 and the head: the stat is empty, exit 0.
   - The form's diff from ea5aba5d removes no line (grep exit 1), so it is append-only.
   - The PR timeline shows three committed events and no force event.
2. **`claude --version`** prints 2.1.289 (Claude Code), exit 0. I2 (a) did not fire.
3. **`claude plugin test tools/mods/spatial-evidence-recorder`** exits 0: 20 pass, 0 fail, with T1 to T20 named as in §4.
4. **`claude plugin validate`**, all four runs exit 0:
   - `tools/mods/spatial-evidence-recorder`, text: passes with one warning (no `version`). The hooks line is `tool.call{tool=Bash}, turn.complete`, and the calls line is `$.agent.list`, `$.fs.write` and `$.process.run`, each with its `(via …)`.
   - the same with `--json`: success true, and the same two notes.
   - `tools/mods`, text: passes with two `version` warnings.
   - `tools/mods --json`: success true.

   All four agree with the PR body's outputs except for the worktree path. I3 did not fire.
5. **§7 recount.** The form's command, with base ea5aba5d and head 976e64cdd07ae182e42cfe2f5f70891c16bedde8, exits 0. It gives 5, 7, 1, 65, 3, 464 and 564 insertions with no deletions, over §7's seven files: 1109 of 1400. There is no overrun, and §7's line is unedited.
6. **CI.** `gh pr checks 172` shows six checks, all passing.
7. **Leftovers.** Neither `C:/dev/spatial-ide-local` nor `C:/dev/recorder-local` exists: `ls` reports both missing, before and after. `git status --porcelain` is empty at the end, and HEAD is still 976e64cdd07ae182e42cfe2f5f70891c16bedde8.

## Mutations observed at the gated head

Method: apply the mutation to `hooks/register.js` with a perl line edit, run `claude plugin test tools/mods/spatial-evidence-recorder`, read the `(fail)` lines, restore the file with `git checkout`, and confirm `git status --porcelain` is empty. Every porcelain read after a revert was empty. `claude --version` read 2.1.289. Each mutation's failing set equals the set its `// RECORDED MUTATION:` comment states at the head.

| Test | Mutation (the form's §4) | test exit | pass/fail | Named test failed |
|---|---|---|---|---|
| T1 | snapshotAfter always all-unavailable | 1 | 15/5 | yes |
| T2 | A4 matches any `verify*.mjs` basename | 1 | 19/1 | yes |
| T3 | env-assignment branch disabled | 1 | 19/1 | yes |
| T4 | try around the before-snapshot removed | 1 | 19/1 | yes |
| T5 | treeChanged over the diff pair alone | 1 | 17/3 | yes |
| T6 | an unavailable pair reads false | 1 | 16/4 | yes |
| T7 | errored arm's stdout/stderr from `ran.result` | 1 | 19/1 | yes |
| T8 | `persisted` fixed false | 1 | 19/1 | yes |
| T9 | deny clause removed | 1 | 19/1 | yes |
| T10 | `run_in_background` check removed | 1 | 19/1 | yes |
| T11 | usage `agent_type` fixed unavailable | 1 | 19/1 | yes |
| T12 | main-loop return removed from recordUsage | 1 | 19/1 | yes |
| T13 | recordRun returns a spread with its own context | 1 | 6/14 | yes |
| T14 | gitRun drops `cwd` | 1 | 18/2 | yes |
| T15 | log root from the toplevel plus `/.git` | 1 | 16/4 | yes |
| T16 | before-side calls awaited one by one | 1 | 19/1 | yes |
| T17 | after-side diff without `timeoutMs` | 1 | 19/1 | yes |
| T18 | run-record agent type not looked up | 1 | 19/1 | yes |
| T19 | `backgroundedAfterMs` fixed undefined | 1 | 19/1 | yes |
| T20 | extra `stdout_text` field | 1 | 18/2 | yes |

Disclosure: my first T15 attempt did not parse. The Bash tool collapsed an escaped backslash, the module failed to load, and all 20 tests failed. That run is void. The T15 row above is the re-run with a valid edit (no load error). This report is a run's output, not a recorder line.

**Amendment 1's class-2 records against observation:**
- **C2-a holds.** With the test stub's separator normalisation removed (`test/recorder.test.ts:90`), the run exits 1 and the stub receives a backslash path beginning `C:\r-local\evidence\`.
- **C2-b's result holds, but its statement is too broad.** See S2-1; its section cite is S1-1.
- **C2-c holds.** A plain async `process.spawn` stub fails at load: the error says the hook must be an async generator.

## §8 items 1 to 4: every hook path and every `$.process.run`, read

- **1 and 2.** recordRun calls `next(e)` once on every path: the not-approved, background and non-string paths return `next(e)` (`hooks/register.js:366`), and the approved path awaits it once (`hooks/register.js:378`), outside any try. Its value comes back as the same object (`hooks/register.js:382`, `hooks/register.js:421`). If `next` rejects, the rejection propagates unchanged. recordUsage's first statement awaits `next(e)` (`hooks/register.js:425`) and returns `out` on every path. There is no deny, allow, `tool.check`, context, result or text of the mod's own, and no `.catch` (grep). Pass.
- **3.** There are exactly three `$` call sites: `hooks/register.js:220`, `hooks/register.js:294` and `hooks/register.js:347`. There is no `$.model`, `$.ui`, `$.session`, `$.store`, `$.fs.read/list/stat/exists`, or network call. Pass.
- **4.** `gitRun` (`hooks/register.js:218-221`) is the only `$.process.run` site. Its `argv[0]` is the literal `git`, its `argv[1]` is `--no-optional-locks`, and its subcommands are rev-parse, status and diff (`hooks/register.js:257-259`, `hooks/register.js:272-274`, `hooks/register.js:354`). `timeoutMs` is `PROCESS_TIMEOUT_MS` (2000) on both init branches. Pass.

All lines above are @ 976e64cdd07ae182e42cfe2f5f70891c16bedde8.

**The pass-through (§2.1) holds byte for byte on every path,** by reading and by test. `ran` and `out` are never copied, spread or mutated. T13 compares with `toEqual` and with `JSON.stringify` on the answered, not-approved, errored, deny, usage and every-`$`-rejects paths. T13's own mutation (a spread with a context) fails 14 tests. The failing-write path is covered in N-7.

## §8 items 5 to 20

- **5. Pass.** Hooks and calls are §2.0's (validate). The write path is `<root>/<YYYY-MM-DD>/<digits>-<hex>.json` only. The record holds counts and hashes, never output, status or diff text (T20 and T7).
- **6. Pass.** Every field is set or has an `unavailable` route. The two optional keys are absent when the source is absent (R2). Nothing is estimated; for the `write` label, see N-1.
- **7. Pass.** No `package.json` and no lockfile. `.gitignore` holds `.claude-plugin/types/`, and `git ls-files` shows no types folder.
- **8. Pass for this gate.** I ran no install, enable, marketplace add, session or `--plugin-dir`, and wrote nothing under the user Claude directory. The worker's report states the same, and the custodian's note records its checks.
- **9. Pass.** Nothing under `tools/mods/spatial-guardian/` changes. Guardian's marketplace entry is unchanged; the diff adds one entry after it.
- **10. Pass.** No OS branch. The only drive pattern is in `leadingCdDir` (`hooks/register.js:184`). No user-profile path in any file (grep exits 1). CI's profile-path check passes.
- **11. Pass.** All 20 tests carry a `RECORDED MUTATION` naming the observation commit (9acc86b8c559) and `claude --version`. No record calls a verify-mutation run an observation; worker report 1, §6, says it is a presence check. The README says recorder lines are not citable and never a mutation observation.
- **12. Pass.** No overrun, §7's line unedited, no scope addition.
- **13. Record form fails.** See S1-1. Otherwise Amendment 1 has no ledger line cite, no hash at a branch commit (its commits are named in words), no bare self-line, no pin read as current, and its tool claims carry 2.1.289. It is not a correction round. See also S2-3.
- **14. Pass.** Files are §7's seven plus the form.
- **15. Pass so far.** No force event on the PR. The merge method is set at merge.
- **16. Pass.** No `disableAllHooks`; the only scope named is user.
- **17. Pass.** O-1 to O-13 match their shapes in §2.3 to §2.7. Concurrency holds on both sides (`Promise.allSettled` before and after). `head_after` is compared. Each hash field is named per O-5.
- **18. Pass.** No pruning or delete code.
- **19. Pass.** No force-shaped string in any fixture, and no probe.
- **20. Pass.** No E-row is claimed.

## The worker's readings R1 to R7, against the form

- **R1: consistent.** §2.4 is ambiguous on the mixed case, and true-wins is defensible. See N-2.
- **R2: consistent.** §2.5 makes the first key absent; the form is silent on the second.
- **R3: consistent only as a disclosed limit.** The form asks for a quantity a record cannot hold about its own write. See N-1.
- **R4: consistent** with §2.2's not-approved table (substitutions, heredocs, wrappers, loops).
- **R5: consistent** with §2.4: any other `cd` is `unresolved`.
- **R6: consistent** with §2.7.
- **R7: consistent.** Fixtures beyond §3's are allowed. Its F4 wording is inexact (N-3).

## Writes

The only write to the repository is this report. During the run, I wrote the four validate outputs to the session scratchpad, outside the repository, and deleted them. In the worktree, each mutation was a temporary edit, reverted before the next. A first attempt to write this report in one block failed to parse and created no file; it was then written in parts.
