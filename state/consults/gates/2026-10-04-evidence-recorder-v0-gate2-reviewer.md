# PR #172 gate 2 — reviewer
Reviewed: cut/evidence-recorder-v0 @ 609ab94515d34a4f88583188b338abc6867f53d6

**Verdict: PASS** (cut/evidence-recorder-v0 @ 609ab94515d34a4f88583188b338abc6867f53d6). Every gate-1 S1 and S2 finding, mine and the architect's, is resolved at this head. No new S1. One new S2 (a class label), seven new N. Code, tests, validate, §7 and all 20 mutations come out as the form predicts. Tag `node:evidence-recorder-v0@g3`. Re-gate by reference to `state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-reviewer.md` and `state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-architect.md`.

Cite convention: the form's lines 1-459 are on main at ea5aba5d and are cited by section. Amendments 1 and 2, and every file under `tools/mods/spatial-evidence-recorder/`, exist only on the unmerged branch; they are cited by section, amendment and item, or as path:line named with the commit, with no hash (round 25, item 2). `hooks/register.js` and `test/recorder.test.ts` are byte-identical at 976e64cd, 609ab945 and (register.js) 9acc86b8, so their line numbers are the gate-1 report's. No passage below is a quotation.

## Gate-1 findings, disposition

**Reviewer (mine):**
- **S1-1, resolved.** Amendment 2's C2-b correction places the log-root lookup in §2.7's first bullet, not §2.4. §2.7's first bullet is the lookup (once per load, cached on success). The superseded index names C2-b's section cite.
- **S1-2, resolved.** Amendment 2's C2-e records the three `(via …)` annotations as class 2 under §5, I3 not fired. Its evidence cites resolve: worker report 1 §7 carries the calls line at its lines 133 and 166, and my gate-1 check 4. The PR body's reading paragraph now reads §5 the right way round and says it was corrected after gate 1 (`gh pr view 172`). The superseded index names Amendment 1's count of three results.
- **S2-1, resolved.** The C2-b correction narrows the kit's refusal to what I observed at 2.1.289: by-name inner function refused, inline arrow accepted. It states that the code's top-level declarations are within what the kit accepts.
- **S2-2, resolved.** `tools/mods/spatial-evidence-recorder/README.md:45 @ 609ab94515d34a4f88583188b338abc6867f53d6` adds the not-approved table to Coverage, covering all seven of §2.2's not-approved rows. Line 46 adds live behaviour before E1 and E3, and line 50 adds loading. See N-B for one dropped condition.
- **S2-3, resolved.** The C2-a correction names the comment as line 89 of `test/recorder.test.ts`, unchanged since 9acc86b8 (the full id is in Amendment 2's header). At 9acc86b8, line 89 is that comment. `git diff 9acc86b8 609ab945` on the test file has its first hunk at line 147, so line 89 and the counter loop at 93-98 are unchanged.
- **N-1, resolved** by C2-d. **N-2 to N-8:** notes; nothing in either commit touches them, and they stand as notes.

**Architect:**
- **S1-1, resolved.** C2-d states that `write` runs from just before the log-root lookup to the end of the record's assembly, with the line's digest and `$.fs.write` after it. It says before + after + write is a lower bound. It reads §9's overhead stop as firing on a p95 over the bound. It says a p95 at or under the bound does not establish §1 claim 7 until an amendment before E5 names how write latency is measured. That is the row the architect asked for. Checked against code: `t2` is taken before `resolveLogRoot` (`hooks/register.js:392-393 @ 609ab94515d34a4f88583188b338abc6867f53d6`), `write` is evaluated as the record literal's last key (line 414), and `writeRecord` serialises, digests and writes after it (lines 343-348). See N-A.
- **S1-2 (a), resolved** by C2-e. **(b), resolved** by the C2-b correction. **(c), resolved:** the C2-c correction names the six counters, matching `test/recorder.test.ts:93-98 @ 609ab94515d34a4f88583188b338abc6867f53d6`, and assigns the rest of §8 item 3's set to validate's calls line. **(d), resolved:** the C2-a correction withdraws the E-row sentence, and §4's E0 to E7 indeed record no write-path spelling.
- **S2-1, resolved:**
  - README:3 now qualifies the subagent line as unclaimed live before E3.
  - Line 46 adds E1 and E3, and line 50 adds loading.
  - Line 37 sets the pruning age at 30 days. The brief's 30 days are at `state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:29`, unchanged since 884fc727.
  - Line 65 says `disableAllHooks` is not the off-switch. Its reason, that settings hooks stop too, has its source in the Guardian docs read (`state/consults/2026-10-03-guardian-v0-docs-read.md:104`).
  - Lines 67-69 add Acceptance and stop by reference.
  - §7 is recounted below: 1117.

## Amendment 2's record form (§8 item 13; round 12 (d), (e))

- **Append-only, holds.** `git diff ea5aba5d 609ab945` and `git diff 976e64cd 609ab945` on the form each remove no line (filtered grep exit 1, both). d48bedc4 touches the form alone, with 18 insertions. No prediction is edited: §3, §4, §5 and E5's prediction are untouched. C2-d narrows how §1 claim 7 is read, not a prediction.
- **Ceiling, holds.** C2-a's correction is 2 sentences, C2-b's 3, C2-c's 2, the touches line's 2. C2-d and C2-e are new class-2 rows, not corrections.
- **Superseded index, present.** It lists C2-a's last sentence, C2-b's cite and rule, C2-c's counter statement and the fourth bullet's count. It matches the four corrections.
- **References, all resolve:**
  - §2.3, §2.7 (first bullet), §5, §7, §8 item 3 and §9.
  - Amendment 1's bullets: the fourth top-level bullet is What it touches, and C2-a's second bullet is the normalisation comment.
  - Gate-log entries 390 and 391: by position in `state/gate-log.json` on main, the architect and reviewer FAIL rows at 976e64cd.
  - Both gate-1 report paths, worker report 1 §7 and §9 R3, and test line 89 at 9acc86b8.
- **No hash at a branch commit.** 9acc86b8 is named in words. There is no bare self-line, no ledger line cite, and no pin read as current. The tool claims carry 2.1.289.
- **Restatement:** see N-F. **Class of the C2-a withdrawal:** see S2-A.

## README (609ab945) against §2.10, §8 items 11 and 16, §1, §2.2

- **Hash pins, both match.** `git show 884fc727:state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md | sed -n '55,59p' | sha256sum` gives d3c294b2624a53bd2b4042cf8ebe609e63161f657ebf0113ef762cf6c00a6225. The same for lines 61-64 gives 648fffdd48a3f672d0938ba1bb2b7e581cb0f2bcee47c0a9aefefd823e238714. 884fc7271f9ef78187578164b7032a5f4ba97084 is an ancestor of origin/main (exit 0). The brief is unchanged from 884fc727 to origin/main (empty diff stat), so pin and tree agree.
- **§8 item 11, pass.** No text presents a recorder line as citable or as a mutation observation; README line 41 is unchanged.
- **§8 item 16, pass.** `disableAllHooks` is named only as not the off-switch. The only scope named is user.
- **§2.10, pass:** what is recorded, the schema and hash basis, §1's limits, the log root and pruning, the Bash-tool route and the brief rule. No quotation.

## New findings

**S2-A. The C2-a withdrawal row is class 1, not class 2 (round 15 (g)).** Amendment 2 is a record-correction round. Its C2-a correction withdraws Amendment 1's E-row sentence, and the human's round 15 (g) classes a withdrawal row in a record-correction round as class 1. Amendment 2's header classes the whole amendment as class 2. This is not blocking: round 15 (g) classes the row and is not a fail-by-name item. Amendment 2's italic first line also states that it was written after gate 1, which is class 1's substantive requirement (template class 1). If any later record touches this, it names the row's class by round 15 (g). The architect's gate-1 prescription of class 2 for the whole amendment did not separate the withdrawal.

**N-A. C2-d's exclusions are named, not exhaustive.** Outside before + after + write are also the line's serialisation (`hooks/register.js:344`, `JSON.stringify`) and the synchronous matcher (`planFor`, line 362, before `t0`). The lower-bound statement holds as written. The pre-E5 amendment that names write-latency measurement should cover both.

**N-B. README:46 drops §1's condition on E1.** §1 says the chain order is unclaimed before E1, and that E1 bears on it only if E1's refused call is approved under §2.2 (O-14). The README keeps only the E1 name. The limit is still true as stated, but it reads as if E1 would settle the order.

**N-C. README:47 omits §1's Latency clause on docs/08 rows** (any docs/08 row is unclaimed). This predates 609ab945, was not in either gate-1 report, and is in Scope.

**N-D. README:69 points at the brief's acceptance and stop lines, not at §9 Operator.** §2.10 asks for §9 Operator, by reference to the brief. The brief's stop conditions are unquantified. §7's 300 ms and 20% figures, and C2-d's lower-bound reading of the overhead stop, are in the form only. A README reader at the human's sighting does not see them.

**N-E. README:45's new sentence follows §1's wording, which is inexact for compound calls.** A not-approved form joined to an approved segment is recorded, under the whole command (`hooks/register.js:198-204`). This matches gate-1 N-4; it is for the window.

**N-F. The C2-c correction carries one standing claim of Amendment 1.** Its second sentence includes `$.process.spawn` among the calls ruled out by validate's calls line. That is Amendment 1 C2-c's second bullet, which the superseded index does not supersede. Round 12 (d) bars a correction that restates an earlier amendment's claim. I read this as not a restatement in the rule's sense. The words separate spawn from §8 item 3's set (where the architect's S1-2 (c) had placed it), carry nothing superseded, and change no meaning. I record the reading so the architect can hold otherwise.

**N-G. Worker report 2, pre-gate class 3, is inexact.** It says the README states only what the form already says. The 30-day age is the brief's, and the `disableAllHooks` reason is the Guardian docs read's. Both are sourced, so this is a report inaccuracy only.

**CI note (not in this PR's diff).** The pull_request run 37209345096, attempt 1, failed at `scripts/plan/verify.test.mjs:234`. That assertion requires that no failure string contain the substring `pr`. Run locally on this head with the same inputs, runVerify returns five queue/site drift failures, each carrying the `mkdtemp` directory path, whose 6-character random suffix follows `verify-offline-note-`. A suffix containing `pr` fails the test. That is about 5 in 3844 per run with lowercase letters, and it would pass on a re-run. This is a probable cause, not a confirmed one: the CI log does not print the failure strings. A fix would assert on the PR and release failure text itself rather than the bare substring.

## Checks, with exit codes

All in `C:/dev/wt/recorder` at 609ab94515d34a4f88583188b338abc6867f53d6. `claude` ran only as `--version`, `plugin test` and `plugin validate`, each under `timeout`.

1. `git status --porcelain` was empty at the start, and `git rev-parse HEAD` gave 609ab945 (exit 0). `git fetch origin` exited 0; origin/cut/evidence-recorder-v0 is 609ab945. The merge base with origin/main is ea5aba5d120ee173d32c786a53b291ec83ff3d71. `git log origin/main..HEAD` shows five commits, linear: 9acc86b8, 32fc334f, 976e64cd, d48bedc4, 609ab945.
2. `git diff --stat 976e64cd 609ab945` (exit 0): the form +18, README +11/-3, nothing else. On register.js and the test file it is empty (exit 0). The blob ids are equal at 976e64cd and 609ab945: register.js 079d8b89, the test file e705127b. register.js is the same blob at 9acc86b8.
3. `git diff --stat origin/main...origin/cut/evidence-recorder-v0` (exit 0): 8 files, 1154 insertions, no deletions. These are §7's seven files plus the form's 37 appended lines.
4. §7's counting command, base ea5aba5d120ee173d32c786a53b291ec83ff3d71, head 609ab945 (exit 0): 5, 7, 1, 73, 3, 464 and 564 insertions, no deletions, over §7's seven files. That is 1117 of 1400: no overrun, and §7's line is unedited.
5. Append-only: filtered grep for removed lines in the form's diff from ea5aba5d, and from 976e64cd, exit 1 both.
6. `timeout 60 claude --version` printed 2.1.289 (Claude Code), exit 0, before the test run and again before the mutations. I2 (a) did not fire.
7. `timeout 300 claude plugin test tools/mods/spatial-evidence-recorder` exits 0: 20 pass, 0 fail.
8. `claude plugin validate`, each under `timeout 120`, all four exit 0:
   - `tools/mods/spatial-evidence-recorder`, text: passes with one `version` warning. The hooks line is `tool.call{tool=Bash}, turn.complete`. The calls line is `$.agent.list (via agentTypeOf)`, `$.fs.write (via writeRecord)`, `$.process.run (via gitRun)`.
   - the same with `--json`: success true, the same two notes.
   - `tools/mods`, text: passes with two `version` warnings.
   - `tools/mods --json`: success true.
   - All four equal the PR body's outputs once the worktree path is replaced. I3 did not fire.
9. Commit messages for d48bedc4 and 609ab945: signed off, and no profile path. A grep of the three-dot diff for a profile path exits 1. The PR timeline shows five committed events and no force event.
10. `gh pr checks 172` (exit 0): six checks, all passing.
11. The CI note's probe (exit 0): a scratch script outside the repository that runs runVerify on the test's fixture, offline. Its temp directory was removed.
12. End state: `git status --porcelain` is empty, and HEAD is 609ab945. `ls` reports `C:/dev/spatial-ide-local` and `C:/dev/recorder-local` both missing, before and after the run.

## Mutations observed at the gated head

**Method.** A Node script outside the repository replaced one exact span in `hooks/register.js`. It asserted exactly one occurrence, and that the edit was present, before each run. All 20 edits passed `node --check` in a dry run, and their diffs were read. My first draft of the T2 and T15 edits lost a backslash in the Bash tool (the gate-1 T15 note). That was caught in the dry run, before any test run, and both edits were rewritten with no backslash (`[.]mjs`; `String.fromCharCode(10)`).

For each mutation, the script ran `timeout 300 claude plugin test tools/mods/spatial-evidence-recorder`, restored the file with `git checkout`, and counted porcelain lines (0 every time). It then compared the `(fail)` names with the failing set that the test's `// RECORDED MUTATION:` comment states. No run printed a load error. `claude --version` read 2.1.289.

| Test | Mutation (§4) | test exit | pass/fail | Named test failed | Failing set equals the comment's |
|---|---|---|---|---|---|
| T1 | snapshotAfter always all-unavailable | 1 | 15/5 | yes | yes |
| T2 | A4 matches any `verify*.mjs` basename | 1 | 19/1 | yes | yes |
| T3 | env-assignment branch disabled | 1 | 19/1 | yes | yes |
| T4 | try around the before-snapshot removed | 1 | 19/1 | yes | yes |
| T5 | treeChanged over the diff pair alone | 1 | 17/3 | yes | yes |
| T6 | an unavailable pair reads false | 1 | 16/4 | yes | yes |
| T7 | errored arm's stdout/stderr from `ran.result` | 1 | 19/1 | yes | yes |
| T8 | `persisted` fixed false | 1 | 19/1 | yes | yes |
| T9 | deny clause removed | 1 | 19/1 | yes | yes |
| T10 | `run_in_background` check removed | 1 | 19/1 | yes | yes |
| T11 | usage `agent_type` fixed unavailable | 1 | 19/1 | yes | yes |
| T12 | main-loop return removed from recordUsage | 1 | 19/1 | yes | yes |
| T13 | recordRun's final return a spread with its own context | 1 | 6/14 | yes | yes |
| T14 | gitRun drops `cwd` | 1 | 18/2 | yes | yes |
| T15 | log root from the toplevel plus `/.git` | 1 | 16/4 | yes | yes |
| T16 | before-side calls awaited one by one | 1 | 19/1 | yes | yes |
| T17 | after-side diff without `timeoutMs` | 1 | 19/1 | yes | yes |
| T18 | run-record agent type not looked up | 1 | 19/1 | yes | yes |
| T19 | `backgroundedAfterMs` fixed undefined | 1 | 19/1 | yes | yes |
| T20 | extra `stdout_text` field | 1 | 18/2 | yes | yes |

This report is a run's output, not a recorder line, and no `verify-mutation` run was made or relied on.

## §8 items 1 to 4

By reference to my gate-1 reading (`state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-reviewer.md`, its §8 items 1 to 4 section). `hooks/register.js` is byte-identical at 976e64cd and 609ab945 (check 2), so every line cited there holds at this head. Pass. Items 5 to 20 are unchanged from gate 1 except as noted: item 11 and item 16 were re-read on the new README (pass), item 12 was re-read on the new count (pass), and item 13 was re-read on Amendment 2 (pass, with S2-A and N-F).

## Writes

The only write to the repository is this report. Outside the repository, in the session scratchpad: the test, validate and mutation outputs, the mutation script and the CI probe script. The probe's temp directory was removed. In the worktree, each mutation was a temporary edit, reverted before the next. A first attempt to write this report in one block failed to parse and created no file; it was then written in parts.
