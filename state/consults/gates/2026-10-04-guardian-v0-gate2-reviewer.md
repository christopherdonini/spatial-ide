*Custodian's filing note (2026-10-04): PR #169's gate 2, the reviewer, for PLAN node `guardian-v0`, under node:guardian-v0@g5. Reviewed: cut/guardian-v0 @ 1d057c79232dcbaccb4709f1d14eefbbaff5a9df (from the report's own second line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). Written by the reviewer to this path through its shell and committed as written below the rule. Its sha256, from this file's line 5 to the end, is 48abd1f37e46a9579aeaa66dd94afc6de78c0b4c8c548897db48bea2cd6c9996, equal to the hand-back. The worktree's porcelain was empty after the run. **S1-1 is evidence only:** the rollout refusal returned during the run, with the third run ending at 10:07:04Z. The custodian's own run at 10:12:50Z passed, 39 of 39, so the switch flaps rather than staying off. A scoped re-gate for S1-1's evidence was dispatched at once. Cost: 191,853 subagent tokens, 57 tool uses, 862,970 ms. Profile paths redacted at filing: none.*

---

# PR #169 gate 2 — reviewer
Reviewed: cut/guardian-v0 @ 1d057c79232dcbaccb4709f1d14eefbbaff5a9df

Base: the merge base with main, a30108a1bd4f12bcc8bdc58feefb5ab5d0f87c87. Governing form: `tools/mods/GUARDIAN-V0-PREREGISTRATION.md` on the branch, with Amendments 1 to 6, cited by section, amendment and item. `<worktree>` is the gate worktree on `cut/guardian-v0`. Branch commits are named in words with their ids. Every hash pin below is at a commit on main.

## Verdict: FAIL

There is one S1, the same evidence gap as at gate 1: `claude plugin test` was refused again at the gated head, so I observed none of T1 to T34 or T37 to T41, and none of their mutations. Everything else I could run passed. The code is unchanged since the observation commit 71db3d7d: `git diff 71db3d7d 1d057c79 -- tools/mods/spatial-guardian/hooks/` is empty, and the test file's diff over the same range has 0 changed lines that are not `//` comments. I found nothing in the code that blocks.

## S1 (blocking)

**S1-1 (carried from gate 1). `claude plugin test tools/mods/spatial-guardian` does not run on this machine at 1d057c79.** So these items are undischarged: §9's Reviewer item that `claude plugin test` runs on the custodian's machine; §9's "every mutation observed at the gated head" for T1 to T34 and T37 to T41; Amendment 2's §9 Reviewer item for T37 to T39 and the re-observed T1 to T9 mutations; and Amendment 4's §9 Reviewer item for the T40, T41, T22 and T23 mutations.
- I ran it three times at 1d057c79, the third ending at 2026-10-04T10:07:04Z. Each exited 1 and printed one line.
- That line is byte-identical to the gate-1 refusal line, `state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:19 @ 2bab186a sha256:44796d312152a6c6dbc8ae3da5cf5c29efd780a0517ddea532b368654f48512a`. I hashed my run's first output line, and the hash is equal. The line is not reproduced here.
- The remedy the line names is to start a session, which is outside my limits.
- Round 46, item 4 records the human's refresh and the custodian's 34-pass re-run, and it plans S1-1's discharge in this re-gate. That discharge did not happen.
- The plugin-test evidence at 2.1.289 is the worker's alone: report 3's 39 passes at 946454d2, and its mutations at 71db3d7d.
- *What narrows the gap but does not close it:* I called the shipped `pushRefused` and `guardPowerShell` directly in a scratch copy, with a stub `$` and not the engine. Every F1 to F8 and F30 to F35 outcome came out as predicted (below). The engine's dispatch and `.catch` path are still unproven by this gate.
- *To re-gate:* the switch is refreshed, and then the reviewer re-runs `claude plugin test` and the 39 plugin-test mutations at the head. No change to the diff is needed.

## S2

**S2-1. Amendment 4's falsification line "an F35 call makes a `$` call" and its §8 item 23 ("Any `$` call on a PowerShell call whose `agentId` is unset") are met, read literally, by N1 as designed.** N1 (§2.8, unchanged) is the unfiltered `tool.call` hook. After `next(e)` returns undenied on a main-loop call, PowerShell included, it calls `$.session.usage` (lines 436-441 and 425-426 of `tools/mods/spatial-guardian/hooks/register.js` at 1d057c79). F35's first call, `Set-Content`, is such a call.
- T41's harness answers `session.usage` for every test (`arm`, lines 52-64 of `tools/mods/spatial-guardian/test/guardian.test.ts` at 1d057c79). T41 asserts only that no `fs.stat` and no `process.run` are made, and that no answer is missing for `agent.list` or `session.messages`.
- Read as Amendment 4's own §2.7 addition and its over-refusals bullet read ("the hook makes no `$` call"), the line holds. My stub call of `guardPowerShell` on F35 made no `$` call.
- I gated on that hook-level reading. If the architect reads item 23 literally, this is a record defect, not a code defect. The closing record should state the reading. No new clause is needed.

**S2-2. The refusal returned after the human's refresh, and the engine's line says what a recurrence means for installed mods (the cited line's last clause).** Twice now, passing runs have been followed within hours by the refusal:
- gate 1: the worker passed at about 21:00Z to 21:40Z, and the refusal came at 22:03Z (the gate-1 report's filing note);
- this gate: the custodian passed at about 08:56Z (round 46, item 4), and the refusal came from about 09:57Z.
E1 to E3 would detect an installed Guardian whose hooks modules are off, because each predicts Guardian's reason. The human should have the engine's line in front of him with the install question.

**S2-3. Amendment 5 (class 9) declares no invalidator.** The class-9 rule requires what §5 declares unchanged "and what would invalidate it" (`docs/PREREGISTRATION-TEMPLATE.md:170 @ 257827d1 sha256:42297d7cc39d169c3b8c86e5faf21d1cad61a7e6db2a002da9c2dd567b8545f4`, a sub-line span; the line's hash). Amendment 5's §5 declares only what is unchanged. The addition is four README lines and §1 text with no code, so nothing is at risk. The closing record or the architect names the reading.

## N

- **N-1.** README line 44 at 1d057c79 opens with the label `R11.`, a form item id, in user-facing text. R1 to R10 carry no label.
- **N-2.** Amendment 5's §1 and README R11 call the write audit the primary check of report-only runs with no condition. §2.7 says it is primary until E5 passes and the backstop after. README line 73 keeps the condition, so after E5 the README states both. This is a paraphrase, not a quotation, so there is no quote failure.
- **N-3.** register.js's header comment, lines 13-14 at 1d057c79, still describes G6 as a write guard only (worker report 3, Noticed).
- **N-4.** The PR body is stale for the gated head:
  - its Evidence section still gives `claude --version` 2.1.288, 34 passes and the 37 mutations at 54eba872;
  - "Rulings applied" names only rounds 43 and 44, not rounds 46 to 48 or the two 2026-10-04 rulings.
  The validate section was refreshed at 946454d2.
- **N-5.** Gate 1's N-1 to N-8 stand: the code they read is unchanged.
- **N-6.** §8 item 20 was probed. A backslash before `(`, `{` or the backtick does not split (four spellings, all ALLOW). This matches the amendment.

## Checklist results

- **Full diff, three-dot** (`git diff a30108a1...1d057c79`): 11 files, 1925 insertions, 0 deletions. These are §7's 10 files plus the form.
  - The form's diff is a pure append: one hunk after main's line 520, with 0 removed lines.
  - §7's size line is byte-identical to main's (sha256 8c06d1a0… on both sides).
  - The code since gate 1 (adfcb857..1d057c79): register.js +31/−6 (the `atGroups` splitter branch, `readingRefuses`, the two-reading `pushRefused`, and `guardPowerShell`, which replaces `refuseForcePush` on the PowerShell registration); the test file (T37 to T41 and comment updates); the README (R1 to R11).
- **Amendment order:** Amendment 2 (048de7b0) and Amendment 4 (d388101c) come before the code at 71db3d7d. Amendment 5 (8bfd7d22) comes before R11 at 7fa2a67e. Amendment 6 (1d057c79) comes after the count. No code of a scope addition precedes its class 9 amendment.
- **`claude --version`:** 2.1.289 (Claude Code), the build of record (Amendment 4, Part C). I2 did not fire.
- **`claude plugin validate`**, both targets, text and `--json`: exit 0 each, `success: true`, and one `version` warning each. The hooks line is `tool.call`, plus `tool.call` filtered to Bash, PowerShell, Write, Edit and NotebookEdit. The calls line is `$.agent.list`, `$.fs.read`, `$.fs.stat`, `$.process.run`, `$.session.messages` and `$.session.usage`, with the same via annotations as worker report 3. I3 did not fire. Amendment 4's §5 prediction is met.
- **G1 probes** (the shipped `pushRefused`, with an `export` line added, in a scratch copy in the session scratchpad, outside the repository; register.js sha256 dd420213ee0f05595e0d8704fbe7f00b77c92756b149b1a20456a438e1f96f45):
  - gate 1's seven spellings: all REFUSE, including the three that were ALLOW at gate 1;
  - F30 (seven spellings): all REFUSE;
  - F31 (eight): all REFUSE. All eight were also REFUSE at adfcb857 (`pushRefused` at that commit, run the same way), so F31's "(each refused at adfcb857)" holds;
  - F32 (four): all ALLOW;
  - F1 to F7: all REFUSE. F8's three: ALLOW. So the F1 to F8 outcomes are unchanged and I9 did not fire;
  - other probes: a push whose argument is a command substitution of `git rev-parse --abbrev-ref HEAD`, or is `HEAD@{u}`, a braced variable refspec or `main@{1}:main`, is ALLOW. A force-push spelling inside a quoted `gh` body, a shell comment or a single-quoted `echo` argument in parentheses is REFUSE, which is the declared over-refusal (README line 31).
- **`guardPowerShell`, called directly with a stub `$`:**
  - F33: all three DENY with G6. The lead-data calls make `agent.list`, `session.messages` and `fs.stat`. The architect call makes `agent.list` and `session.messages`.
  - F34: a worker or unlisted `git status` goes to `next(e)` after `agent.list` only. A worker's `git push --force` is DENY with G1.
  - F35: `next(e)`, then DENY with G1, with no `$` call from the hook.
- **§7 recount**, by its own command, base a30108a1, head 1d057c79: 1700 insertions, 0 deletions, 1700 lines over 10 files. By file: 2, 347, 14, 7, 1, 82, 62, 3, 464 and 718. It is the same at 7fa2a67e.
  - Amendment 6's figures are correct: 1700 of 1650, 50 over, 10 files, base a30108a1, 1555 at adfcb857 (the gate-1 count). Amendment 4's §7 predicted the overrun.
  - Class 8 form: the first line carries the words "budget overrun, §7 not edited". The amendment states the declared figure, the final figure at a named commit, and the reason. §7 is unedited.
- **I7:** the `state/CUT-STATE.md` blob at a30108a1 is 334899 bytes, under 4194304.
- **Hash pins:** I recomputed all 22 distinct `path:line @ rev sha256` pins in Amendments 2 to 6. All match, every rev is on main, and I read each span for its claim. The write-audit pin (lines 11-16 @ d55458c5) still matches the tree. Every words-form branch cite resolves at its commit: register.js lines 51-220, 84 and 211-216 and README line 31 at adfcb857; register.js lines 433 and 342-358, test lines 194-202 (T9) and README lines 5 and 36 at de6a2c02.
- **Rulings:**
  - Round 46, item 1 → Amendment 2. Item 2 → Amendment 3, whose first line reads "Sight-list addition". Item 4 → S1-1 above.
  - Round 47 → disclosure. README line 30 and Amendment 2's §1 G1 addition carry both families.
  - The shell-route ruling → Amendment 4.
  - Round 48, A → Amendment 4 as appended. No G2 to G4 code on any shell.
  - The G6-backstop ruling → Amendment 5 and README R11.
  - Every ledger ruling is cited by heading or by round and item, never by line.
- **Report-only definitions** (line 4 of each agent file at 1d057c79): architect and evidence-reader hold Read, Grep and Glob. lead-data holds Read, Grep, Glob and Write. None holds a shell tool, so Amendment 4's Part A and Amendment 5's §1 hold.
- **Caller grep:** `readingRefuses` has one product caller, `pushRefused`. `guardPowerShell` has one, the PowerShell registration in `register()`. The `atGroups` argument has one, the second-reading call in `pushRefused`. Nothing new is exported.
- **Branch CI** at 1d057c79:
  - Governance CI, pull_request run 37193596250, success. Its log names both parity tests and reads tests 440, pass 440, fail 0.
  - The push run 37193593392, DCO sign-off 37193596255 and the exposure scan 37193596252 are all success.

## §8, item by item

1. Pass. There is no `tool.check`, `allow`, `$.model`, `$.ui`, `$.http`, `$.store` or `$.fs.write`. Every `next(` call passes `e`.
2. Pass. All five refusing registrations carry `.catch(() => ({ deny: CATCH_REASON }))`.
3. Pass. There are two `$.process.run` sites, `['git', 'cat-file', …]` and `['git', ...args]`, each with `timeoutMs: PROCESS_TIMEOUT_MS` (2000).
4. Pass. There is no `turn.step` or `agent.spawn` hook. The validate lines are as above.
5. Pass. There is no G5 code. The only G5 mention is a header comment.
6. Pass. There is no package file or lockfile, and `.claude-plugin/types/` is absent; `git status --porcelain --ignored` was empty after validate.
7. Pass for this gate. I made no install, enable, marketplace add or session, and wrote nothing under the user Claude directory.
8. Pass. `disableAllHooks` appears only under "Not", and `project`/`local` only under "Never".
9. Pass. There is no copy of the scanner's matcher.
10. Pass. There is no `process.platform` branch, the drive-letter regexes are in `place` only, and no reason carries a path.
11. Pass. The profile-path grep over the three-dot diff and over the commit messages a30108a1..1d057c79 counts 0. The pattern was self-tested positive.
12. Pass. verify-mutation lists all 41 new tests with a comment, and each comment names its observation commit and build: 71db3d7d at 2.1.289 for T1 to T9, T22, T23 and T37 to T41; 54eba872 at 2.1.288 for the rest, as Amendment 4, Part C keeps them. No record calls a verify-mutation run an observation.
13. Pass. The §7 overrun is recorded as class 8 (Amendment 6), §7 is unedited, and no code precedes its class 9 amendment.
14. Pass:
    - no line cite into the ledger;
    - no hash pin at a branch commit;
    - every branch span is named in words with its commit id;
    - no bare self-line, and no pin read as current;
    - each of Amendments 2 to 6 ends with a superseded index;
    - Amendment 1 is first.
15. Pass. The files are §7's 10 plus the form.
16. Not applicable before merge.
17. Pass. The reasons are unchanged, and each states Guardian's own refusal.
18. Pass. No `scripts/hooks/` file other than the parity test is touched, and `continuity.mjs` and the parity test are unchanged since gate 1.
19. Pass. The first reading runs first and unchanged: `pushRefused` returns the first reading OR the second, in that order.
20. Pass. The quote and backslash branches run before the group branch, and the escaped spellings are ALLOW (N-6).
21. Pass. Every G1 change is inside register.js's G1 section, with no new hook, call, option, export or §7 value.
22. Pass. There is no G2 to G4 code on a shell. `g6Refusal` receives `undefined` as its target and never `e.command`. The hold was released by round 48.
23. Pass on the hook-level reading, since `guardPowerShell` makes no `$` call when `agentId` is unset. See S2-1 for the literal reading.
24. Pass. `g6Refusal`, `refuseForcePush`, the Bash registration and the Write, Edit and NotebookEdit guard are unchanged, and there is no new reason, hook, call, option, export or §7 value.
25. Pass. README lines 42 and 44 call G6's shell refusal defensive and a backstop, state the condition on definition changes, and say G6 does not cover Bash today. Amendment 5's §1 says the same.

## README against R1 to R11 (at 1d057c79)

- R1: line 13, the two readings.
- R2: line 30.
- R3: line 31.
- R4: line 73.
- R5: line 33, kept.
- R6: line 32.
- R7: line 42.
- R8: line 17.
- R9: line 29 (with line 17 for Bash).
- R10: lines 5 and 38.
- R11: line 44 (N-1, N-2).
All present, in words, with no quotation.

## Mutations observed at the gated head (1d057c79)

Each was applied in `<worktree>`, run with `node --test scripts/hooks/guardian-continuity-parity.test.mjs` (node v24.18.1, git version 2.49.0.windows.1), and reverted with `git checkout -- <file>`. `git status --porcelain` was empty after each.
- **M35a**, continuity.mjs line 48, a failed `git log` read as judged fresh: exit 1. It fails `PS4a` and `guardian parity: the mod's stale-block check and the Stop hook's stale-continuity check agree on every fixture`. This equals the recorded comment.
- **M35b**, stop-queue.mjs line 243, in the working tree only, the comparison inverted: exit 1. It fails `PS1`, `PS2`, `PS3`, `PS5`, `PS6`, `PS8`, `PS9`, `PS10` and the agreement test. This equals the recorded comment.
- **M36**, parity test line 289, every build replaced by PS7's: exit 1. It fails `guardian parity: the fixture set reaches stale, fresh and not judged on the Stop hook`. This equals the recorded comment.
- **T1 to T34 and T37 to T41: not observed** (S1-1).

The verify-mutation run below is a comment-presence scan, not an observation.

## Commands run, with exit codes (in `<worktree>` unless noted)

| Command | Exit |
|---|---|
| `git status --porcelain` (start, after each mutation, end); `--ignored` after validate | 0, empty each time |
| `git fetch origin`; `git rev-parse HEAD` (1d057c79); `git merge-base origin/main HEAD` (a30108a1) | 0 |
| `git diff --stat` and the full diff, three-dot from a30108a1; `git diff adfcb857 HEAD` for the code; `git diff 71db3d7d 1d057c79` for hooks/ and test/ | 0 |
| `timeout 60 claude --version` (2.1.289 (Claude Code)) | 0 |
| `node --version` (v24.18.1); `git --version` (git version 2.49.0.windows.1) | 0 |
| `timeout 300 claude plugin test tools/mods/spatial-guardian` (three runs) | 1, 1, 1 (S1-1) |
| `timeout 120 claude plugin validate tools/mods/spatial-guardian` | 0 |
| `timeout 120 claude plugin validate tools/mods/spatial-guardian --json` | 0 |
| `timeout 120 claude plugin validate tools/mods` | 0 |
| `timeout 120 claude plugin validate tools/mods --json` | 0 |
| `timeout 600 node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` (tests 440, pass 440, fail 0; T35 with its 13 subtests, and T36, named; the 13 outcome pairs equal and as §3 predicts) | 0 |
| M35a, M35b and M36 runs of `node --test scripts/hooks/guardian-continuity-parity.test.mjs` | 1, 1, 1 |
| §7's command at 1d057c79 and at 7fa2a67e | 0 |
| `git cat-file -s a30108a1:state/CUT-STATE.md` (334899) | 0 |
| `node scripts/plan/verify-cites.mjs` (tool at 522e448d): PASS, 1232 files | 0 |
| `node scripts/plan/verify-quotes.mjs` (tool at f9444a4d): PASS, 0 hash-reference errors | 0 |
| `node scripts/plan/verify-test-claims.mjs` (tool at e9735d47): PASS, 488 claimed | 0 |
| `node scripts/plan/verify.mjs` (tool at 26072022): verify:plan PASS | 0 |
| `node scripts/plan/verify-mutation.mjs` (tool at 7d24ed15): PASS, 41 new tests carry a comment; not an observation | 0 |
| the 22 pin recomputations (`git show`, `sed -n` and `sha256sum` per pin) and `git merge-base --is-ancestor <rev> origin/main` for each | 0 |
| `gh run list --branch cut/guardian-v0`; `gh run view 37193596250 --log`; `gh pr view 169` | 0 |
| G1 and `guardPowerShell` probes: `node` over scratch copies of register.js at 1d057c79 and at adfcb857, in the session scratchpad, outside the repository | 0 |
| greps for §8 items 1, 4, 5, 6, 8, 10 and 11 | 0 |

Hard limits: I ran no `claude` command other than the three permitted, each under `timeout`. I made no install, enable, marketplace add, init, update, configure, eval or session, and wrote nothing under the user Claude directory. The worktree ends clean. The one write outside the scratchpad is this report.
