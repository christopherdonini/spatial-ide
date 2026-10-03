*Custodian's filing note (2026-10-03): the gate-1 reviewer for PR #167 returned this report in its hand-back message, not as a file. The reviewer agent type has no Write tool, and this run declined to write the file through its shell. The custodian saved the text between the hand-back's report markers, with the harness's indentation removed, and committed it as saved, below the rule. The hash of record of the report, from this file's line 5 (the report's first line) to the end, is a77bb1bd8c944145e65cf41cca366996ca309b15496772a1cc73e07569e30932, computed by the custodian from the saved bytes. The reviewer computed none.*

---

VERDICT: FAIL
Reviewed cut/subagent-write-audit-script @ 7a9784cb351156c73afd2c9500208cdd060c94e8. PR #167, gate 1, reviewer.

Scope: 8715ad1b..7a9784cb (three-dot against origin/main 08057347), read in the worktree C:/dev/wt/write-audit (clean, HEAD 7a9784cb). Sources (AUTONOMY.md, docs/PREREGISTRATION-TEMPLATE.md, DECISIONS-PENDING.md, the ruling, the worker reports) read on main at 08057347. Line cites into the two new files are read at 7a9784cb. No commit, push or tracked edit; both mutations reverted with `git checkout`, the tree clean after each; nothing spawned is left running. The Write tool was disabled in this session, so this report was not written to its path by the reviewer; it is returned in the hand-back for the custodian to file.

## S1 (blocking)

S1-1. Gate route closed by size; overrun mislabelled class 8. Per `git diff --numstat origin/main...7a9784cb`, the piece is 264 changed lines (110 + 154) of non-generated code and tests over 2 files, the form excluded. The form's Scope declared "<= 250 changed lines" at dispatch. Both figures are over AUTONOMY §21c's bound, "≤ 150 changed lines of non-generated code across ≤ 8 files", and tests count under the human's counting note (question round 5, item 2).
- By §21a's size clause and §21b's mid-piece clause, the single-gate route is closed and an architect gate is owed. The form's Out-of-scope line nonetheless asserts "the single reviewer gate applies (round 25, item 2 (e))". Round 25 (e) governs §21a categories, not size.
- The overrun is class 6 (template §10, class 6, short form only). The Round 25 additions confine class 8 to the full form: "Class 6 stays the short form's budget class". The Amendment's first line reads "classes 2 and 8". That is neither class 8's words nor the right class.
- Fix: an appended row re-labels it class 6, without editing the Amendment in place, and the architect gate is opened.

S1-2. T4, T6 and T7 have no recorded mutation, and the record says they do.
- AUTONOMY §14, the five-line Tests+mutation line, and template §4 each require one mutation per new test, recorded. The test file records M1 (T5), M2 (T8) and M3 to M5 (T1 to T3) only.
- verify-mutation @ 7d24ed15 reports T4, T6 and T7 as "ok" only through its 500-character window (`hasMutationMention`). At 8d296b9c it reports T4 "ok" with only T5's comment in the file, and T6 and T7 "MISS". At 7a9784cb they read "ok" because M2's comment now sits beside them.
- So the Amendment's "so that every new test has a recorded mutation" and the PR body's "T1 to T8, each with a recorded mutation (M1 to M5)" are false.
- Fix: observe a mutation for each of T4, T6 and T7, record each with its commit (class 4 after this gate finding), and correct the record row.

S1-3. Fail-open on an unparseable line (checklist 1: an audit must not hide failures). `scripts/hooks/subagent-write-audit.mjs:87-91` (at 7a9784cb) silently skips any non-empty line that fails `JSON.parse`. A tool_use on a malformed or truncated line is therefore never counted.
- Probe: a scratch fixture outside both checkouts held two lines, a well-formed Write to the allowed path and a truncated line carrying a Write to another path. The script returned verdict PASS, rc 0, with toolCounts {Write: 1}.
- This contradicts the Change line ("It reads every tool_use in the JSONL") and the ruling ("anything else voids the run").
- Fix: count unparseable non-empty lines and VOID on any. Add one test with a mutation that fails it by name.

## Checklist results

1. The diff. Only `scripts/hooks/subagent-write-audit.mjs` (110/0), `scripts/hooks/subagent-write-audit.test.mjs` (154/0) and the form (14/0) change. The form diff is a pure append below the closing fence, so it is append-only. Imports are node:child_process, node:fs, node:path and node:url only. There is no `export` and no network. The script writes nothing: its only side calls are `fs.existsSync`, `statSync`, `readFileSync` and a read-only `git rev-parse --git-common-dir`. The two new files are LF and ASCII.
2. Behaviour against the Change line as amended.
   - Agent-id resolution: `^a[0-9a-f]{16}$`. The slug comes from the parent of `git rev-parse --git-common-dir`, resolved against the script's directory. That gives `../../.git` in the main checkout and `C:/dev/spatial-ide/.git` in the worktree (git 2.49.0.windows.1), so both map to the same slug. The fallback is the script's repository root. A missing session is usage exit 2.
   - Comparison: `\` is normalised to `/`, then `toLowerCase`, on both sides. An absent file_path or notebook_path normalises to "" and voids (fail-closed).
   - Bash and PowerShell each push a void.
   - VOID cases: a missing file or a size-0 file. Zero parsed tool_use gives the "zero tool calls parsed" void.
   - Exits: 0 on PASS, 1 on VOID, 2 on usage. The exception is S1-3.
3. T1 to T8. Each builds its fixture in an mkdtemp directory and removes it in `finally`. Each asserts the Tests line's claim, and T8 asserts the id path. Mutation observations by this gate, at 7a9784cb:
   - M1: I commented out line 107, the zero-calls check, and ran `--test-name-pattern="^T5:"`. T5 failed by name ("T5: VOID on an empty file and on a transcript with zero tool calls"), actual 0, expected 1. Reverted; T5 then passes.
   - M2: I commented out line 60, which reverts the slug to the script's own root, and ran `^T8:`. T8 failed by name ("T8: an agent id resolves under the main checkout's project slug") at a strict-equal assertion, run from the worktree. Reverted; T8 then passes.
   - verify-mutation (base origin/main, head HEAD): rc 0, 8 of 8 "ok". See S1-2: three of those are window hits, not mutations.
4. The seam, from the real shape. Run from the worktree with `--session e12d1b11-44e2-419b-9288-452e5556bf9f`, against the canonical transcripts under the main checkout's project slug:
   - a1761dc9daea9c1e5, allowed `C:/dev/spatial-ide/state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-2.md`: PASS, rc 0. Read 34, Grep 27, Glob 1, Write 2, Edit 1, SubagentHandback 1. Three write calls, all to the allowed path.
   - aaa04ea882704ee94, NONE: PASS, rc 0. Read 23, Grep 19, Glob 1, SubagentHandback 1.
   - a11d6c7e3a67ec44d, NONE: VOID, rc 1. Bash 76, Read 1, SubagentHandback 1. 76 Bash voids.
   - All three equal worker report 2's figures. The fixtures' `{message:{content:[{type:'tool_use',name,input}]}}` matches the real shape the live runs parsed.
5. The Amendment.
   - Class 2, the slug: the defect description matches worker report 2, and the fix is at 47fe9e54. The Change line is not rewritten. Inaccuracy (S2-1): the fallback is not "the script's directory".
   - Mutations added: M2 to M5 are present at 7a9784cb; see S1-2 for the "every new test" clause.
   - Worker report 1 finding: `verify-mutation --base origin/main --head 8d296b9c` gives rc 1, "5 of 7 new test(s) have no recorded mutation naming them" (T1, T2, T3, T6, T7 MISS). The finding resolves. Worker report 3's note that the tool reads committed content supports the stated cause.
   - Class 8's figure: recounted at 7a9784cb and at e5f3fd5f against origin/main, the form excluded: 110 + 154 = 264 over 2 files. The figure resolves; the class and its first line do not (S1-1).
   - References: the three worker reports exist on main. The commit ids 8d296b9c, 47fe9e54 and e5f3fd5f are branch commits, named in words with no hash, and resolve on main only through the merge commit the PR body asks for.
   - Worker reports: `tail -n +5 | sha256sum` on main gives 4be46906ca8d8350696fcffb6f454f97ddcd449fac7e9dcba9d75fdfcd56cb77, c3e61a5c86f6b840dcc258e462eac7ccef530a705bdad9ba13733f94e6a713a3 and 266bc6a79896050025e543200553136e2c86f63df82067dac4ecf12bf0bae75f for reports 1, 2 and 3. Each equals its filing note's hash of record.
6. Round 25, item 2 fail-by-name list:
   - No full-form §7 overrun (this is the short form; its overrun is S1-1).
   - No class 9.
   - No record calls a verify-mutation run an observation of a mutation. S1-2 is the related but distinct reliance on the tool's window.
   - No test-text span pinned.
   - The Out-of-scope line names no §21a category as touched. Its size failure is S1-1.

## Exit codes

All ran in the worktree at 7a9784cb under node v24.18.1. Each tool commit is the last commit touching the script at that head.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0, 423 tests, 423 pass, 0 fail.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1169 files, 38 loose advisories. Tool commit 522e448d55e089b974e115e23f0c72bfc6e1120a.
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS, 113 checked, 82 verified, 30 baselined, 1 advisory. Tool commit f9444a4d99a9087394c55d4b1d4c414a8b11f980.
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 483 claims over 114 files. Tool commit e9735d4749f094f03b69a8b570e8bf10f511c279.
- `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`: rc 0, PASS, 8 of 8. Tool commit 7d24ed155a120556d6e726eea68237409270d975. At head 8d296b9c: rc 1, 5 of 7.
- `node scripts/plan/verify.mjs` (verify:plan): rc 0. Tool commit 260720226f136d1ec7d72da64656f07d29400ed7.
- PR #167 CI: all runs are at 7a9784cb, all completed success, none pending.
  - 37125887231: Governance CI, pull_request.
  - 37125659980: Governance CI, push.
  - 37125887342: DCO sign-off.
  - 37125887217: Exposure scan.
  - verify-mutation is not a CI step.

## S2 (should fix in the same correction round)

S2-1. The Amendment says 47fe9e54 "falls back to the script's directory". The code falls back to `path.resolve(scriptDir, '..', '..')`, the repository root, as the script's own header says.

S2-2. T8 computes the expected slug with the implementation's own expression, so it proves the id path, not the harness's directory naming. M2 fails T8 only when the suite runs from a worktree. In CI and in the main checkout, the common-dir parent equals the script's root, so T8 passes under M2. The real-shape proof is the live run in Checklist 4. The M2 record should say the mutation is worktree-only.

S2-3. The Amendment's "Mutations added" and "A record finding" bullets carry no class. Class 2 is defined against a §3/§5 prediction, which a five-line form does not have. Template §10 routes an unfitting case to the human rather than to an improvised class.

S2-4. Tools outside the two lists (Task or Agent, mcp__*) pass silently. The lead-data and architect tool lists (`.claude/agents/lead-data.md`, `.claude/agents/architect.md`) do not grant them today, so this is not reachable now. An allow-list of known read-only tools that voids anything else would survive a tool-list change.

## N (nits)

N-1. The header's "Does not: ... inspect git state" sits beside a `git rev-parse` call. It should say that the script reads the repository layout, not status or refs.

N-2. A read error that is not ENOENT (a directory off Windows, EACCES) throws, exiting 1 with a stack trace and no JSON. That exit code is indistinguishable from VOID.
