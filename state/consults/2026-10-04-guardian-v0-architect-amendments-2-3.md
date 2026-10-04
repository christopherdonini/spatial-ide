*Custodian's filing note (2026-10-04): the architect's drafting consult for guardian-v0's Amendments 2 (class 9, G1's second reading) and 3 (class 7, E4), on question round 46, items 1 and 2, under the tag node:guardian-v0@g2. It arrived as a message and is extracted here mechanically from the session transcript's copy of the hand-back, with the harness's two-space indent removed. Its sha256, from this file's line 5 to the end, is 3b2400f4cf09326d8286c82d87d7605f339ac695c6a0da58d827a10e9246e694. Write audit PASS: zero write calls (Read 10, Grep 3). C3 clean: before 09:00:59Z, after 09:11:43Z; main is at 257827d1 at both, and the guardian worktree's porcelain is empty at both. **The architect declined one point of the custodian's brief, rightly.** The brief asked for hash pins on the branch's files at adfcb857, which round 15 (e) and the form's §8 item 14 forbid in an append-only record. The amendments name branch spans in words, and pin main's files only. The custodian's brief error is recorded in the ledger. **Appended:** the two fenced blocks, each `sha256:HASH-TBD` replaced by the custodian's hash at 257827d1 (14 pins), appended byte-exact to `tools/mods/GUARDIAN-V0-PREREGISTRATION.md` on `cut/guardian-v0` at 048de7b0, a pure append of 66 lines. **Its question Q-1** (PowerShell's backtick escape and bash brace expansion: disclose, or fix now) goes to the human.*

---

Reviewed: cut/guardian-v0 @ adfcb85709c9ca19032a68866e0ca687da5c3a9c

**Verdict:** both drafts are ready to append. This is a drafting consult, so it carries no gate verdict. I made no write-capable call (Read and Grep only).

**Read this first: I did not follow the brief on one point.** The brief said to pin the branch's files at adfcb857 with a hash. That breaks round 15 (e), which forbids a hash reference at a branch commit in an append-only record. It also breaks the form's own §8 item 14, which blocks it on sight. So the drafts name branch spans in round 25, item 2 (d)'s words form: lines a-b of `path` at adfcb857, with no hash. Only main's files are pinned, at 257827d1 with `HASH-TBD`, for you to compute. If you think adfcb857 hashes are allowed here, the gate will disagree.

## (1) Amendment 2

```
### Amendment 2 — scope addition: G1 reads subshells, substitutions, backticks and braces (class 9)

Scope addition, by round 46, item 1, made after gate 1's outcomes were seen (`state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md:95-100 @ 257827d1 sha256:HASH-TBD`; `state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:29-35 @ 257827d1 sha256:HASH-TBD`). It is declared under class 9 (`docs/PREREGISTRATION-TEMPLATE.md:170 @ 257827d1 sha256:HASH-TBD`) before any code of the addition. adfcb857 below is adfcb85709c9ca19032a68866e0ca687da5c3a9c, a branch commit, named in words with no hash (round 15 (e); round 25, item 2 (d)).

**§2.2, added: a second reading.** G1 reads `e.command` twice and refuses when either reading refuses.
- The first reading is §2.2 as written, unchanged (lines 51-220 of `tools/mods/spatial-guardian/hooks/register.js` at adfcb857).
- The second reading splits at §2.2's boundaries and also at `(`, `)`, `{`, `}` and the backtick, each outside quotes and not escaped by a backslash. Each of its segments goes through the first reading's per-segment steps unchanged: the unbalanced-quote refusal; the rescan of a quoted token holding `git` and `push`, which itself runs both readings under the same depth count and cap; and the git, global-options, `push` and argument check.
- `$(`, `<(` and `>(` need no boundary of their own, because the `(` splits them.
- Why both readings: the second alone would move a forcing argument that a substitution supplies (`git push $(echo -f)`) out of its push segment, and the first refuses that today. Keeping the first makes the refusal set a superset of today's (F31, T38).
- `{`: bash's `{` is a reserved word only as its own word, so `{ git push -f; }` is its own token and is refused today (gate-1 reviewer, `state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:33 @ 257827d1 sha256:HASH-TBD`); F31 holds it. The `{` and `}` boundaries are for a block written flush against a brace, which PowerShell allows (`& {git push -f}`), since G1 serves the PowerShell registration too (Amendment 1 (P0b), item (i)).
- Unchanged: `isGit`, the tokeniser, `pushArgumentsRefuse`, `MAX_RESCAN_DEPTH`, `G1_REASON` and both G1 registrations. No hook, call, option, export, flag or file is added.

**Over-refusal this adds.** Text that is never run is now refused when it holds a force-push spelling inside `( )`, `$( )`, backticks or braces. That text is a quoted argument (a commit message, an `echo` string, even single-quoted), a heredoc body line, or a shell comment. Before this change, only the bare spelling in that text was refused, through the quoted-token rescan and the newline split (lines 84 and 211-216 of `register.js` at adfcb857). The likely case in this repository is a markdown code span naming a force-push in a heredoc body. Record text written with the Write tool is not read by G1.

**§1, may not claim, G1 line, added:** brace expansion, variable expansion, `eval` of a variable, and PowerShell's backtick escape and line continuation. G1 reads every command, PowerShell's included, by §2.2's bash-shaped rules.

**§2.11, the README adds, in words, with no quotation** (the gates' S2-2: `state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md:95-100 @ 257827d1 sha256:HASH-TBD`):
- R1: the G1 row names the second reading;
- R2: the §1 G1 additions above;
- R3: G1's over-refusals: the text-that-is-not-run case above, in bare and wrapped spellings; `echo git push -f`; a long-option abbreviation; and the advice to write record text with the Write tool (worker list, `state/consults/2026-10-03-guardian-v0-worker-report-1.md:245 @ 257827d1 sha256:HASH-TBD`; heredoc lines, `state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md:76 @ 257827d1 sha256:HASH-TBD`);
- R4: G6 reads the first row of the newest 4096 rows, so a lead-data run longer than that loses its REPORT PATH line and every write is refused (`state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md:77 @ 257827d1 sha256:HASH-TBD`);
- R5: G3's case-alias miss, already stated at line 31 of `tools/mods/spatial-guardian/README.md` at adfcb857, kept;
- R6: a Write that creates a new file passes only when the engine's rejection for a missing path names ENOENT; otherwise every such Write is refused, until E4 (Amendment 3) shows the live shape.
The correction round lands these in the README. The closing record cites the README lines at a main commit after the merge and does not restate them.

**§3, added.**

| # | Call | Engine answers | Predicted |
|---|---|---|---|
| F30 | Bash `(git push -f origin main)`; `x=$(git push --force origin main)`; `` echo `git push -f` ``; `echo "$(git push -f)"`; `cat <(git push --force)`; PowerShell `& {git push -f}` and `$(git push --force)` | none | refused, G1 |
| F31 | Bash `{ git push -f; }`; `f() { git push -f; }`; `sudo git push -f`; `env GIT_X=1 git push --force`; `git push origin main --force`; `git push $(echo -f)`; `git push origin $(echo +main)`; `` git push `echo -f` `` | none | refused, G1 (each refused at adfcb857) |
| F32 | Bash `(cd sub && git push -u origin b)`; `x=$(git rev-parse HEAD) && git push origin "$x"`; `` echo `git log -1` ``; `git commit -m "fix (scope)"` | none | `next(e)` |

**§4, added**, in `tools/mods/spatial-guardian/test/guardian.test.ts`, run and observed as §4 states:

| # | Test | Fixture | Mutation |
|---|---|---|---|
| T37 | `G1 finds a force-push inside a subshell, a substitution, backticks or a brace block` | F30 | the second reading dropped |
| T38 | `G1 keeps every refusal it made before the second reading` | F31 | the first reading dropped (only the second runs) |
| T39 | `G1 allows an ordinary push inside a subshell and a substitution that does not push` | F32 | the second reading refusing every segment that holds git then push, without its argument check |

The worker re-observes the mutations of T1 to T9 at the correction commit, because the G1 code beneath them changes, and records that commit in each comment.

**§5, added.** Predictions: T37 to T39 pass at the head, and each fails under its mutation. Every F1 to F29 outcome and every T1 to T36 result is unchanged, and so are `validate`'s hooks and calls lines. Declared unchanged: everything outside G1's code in `register.js`, every §7 value, and §7's file list. Invalidators: **I9**, the two readings change any F1 to F29 outcome; **I10**, the addition needs a file outside §7's list, a hook or call outside §2.0, or a changed §7 value. Falsification: an F30 or F31 spelling reaches `next(e)`, or an F32 call is refused.

**§7.** The size line stands and is not edited. This amendment raises no ceiling: class 9 declares §2, §4, §5, §8 and §9 items, and a §7 overrun is class 8 (`docs/PREREGISTRATION-TEMPLATE.md:169 @ 257827d1 sha256:HASH-TBD`). At adfcb857, §7's command gives 1555 lines over 10 files (`state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:67 @ 257827d1 sha256:HASH-TBD`). Estimate for this addition: `register.js` 20, plugin tests 50, README 15, no new file. If §7's command at the correction head exceeds 1650 lines or 10 files, a class 8 amendment records it before gate 2.

**§8, added.** 19. A G1 change that removes, narrows or reorders the first reading. 20. A second-reading boundary applied inside quotes or after a backslash. 21. A G1 change outside `register.js`'s G1 section, or any new hook, call, option, export or §7 value for it.

**§9, added.** Architect: this amendment against round 46, item 1, and both gate-1 G1 probe sets; the README against R1 to R6; §8 items 19 to 21; §7's count and class 8 if it is due. Reviewer: the gate-1 reviewer's seven G1 spellings and F30 to F32, run through the shipped `pushRefused` in a scratch copy outside the repository; T37 to T39 and every re-observed mutation, observed at the gated head.

**Superseded index.** None. This amendment adds to §1, §2.2, §2.11, §3, §4, §5, §8 and §9, and replaces no earlier line.
```

## (2) Amendment 3

```
### Amendment 3 — sight-list addition: E4, a live new-file Write (class 7)

Sight-list addition (class 7, `docs/PREREGISTRATION-TEMPLATE.md:132 @ 257827d1 sha256:HASH-TBD`), by round 46, item 2, made after gate 1's outcomes were seen. Evidence: `state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md:102-106 @ 257827d1 sha256:HASH-TBD`, `state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md:37 @ 257827d1 sha256:HASH-TBD` and `state/consults/2026-10-03-guardian-v0-worker-report-1.md:244 @ 257827d1 sha256:HASH-TBD`. No claim elsewhere changes.

- **E4** joins §4's E-rows, in the unused E4 slot. It runs after install, and only if the human's typed install approval names it.
- **The call:** one Write in the main loop (no `agentId`, so G6 does not run) that creates a new file in the session's scratchpad folder. The folder exists, and the path is under none of §7's protected forms.
- **Predicted:** Guardian passes the call to `next(e)` and the file is written. This proves live that `place`'s missing-file branch receives a rejection naming ENOENT.
- **Recorded** by the custodian, as a class 1 row on main like every E-row: `claude --version`; the folder, named in words with no path (round 29's exposure rule); and the outcome, either written or the tool result's reason text byte-copied by script.
- **A refusal falsifies the prediction.** The row names the reason (`CATCH_REASON` is the case where the rejection does not carry ENOENT), and the custodian takes it to the human as his first item. Guardian's install state stays the human's.
- §9's Operator line (E0 to E6) and §5's E-row prediction already cover E4. §1's first may-not-claim bullet keeps the live rejection shape unclaimed until E4 runs.

**Superseded index.** None.
```

## (3) The correction round's scope

**The worker closes these, then gate 2 checks them:**
1. Reviewer S2-1 and architect S2-2's first bullet: Amendment 2's second reading in `register.js`, plus T37 to T39 over F30 to F32, each mutation observed and recorded with its commit. T1 to T9's mutations are re-observed at the correction commit.
2. Architect S2-2's other three bullets and the remaining limits: README items R1 to R6.
3. §7's count at the correction head by §7's command, with a class 8 amendment if it goes over (Amendment 2's §7 paragraph).
4. The `validate` outputs, text and `--json`, in the PR body, refreshed at the new head (§4).

**Gate 2 closes these, with no worker code:**
5. Reviewer S1-1: the reviewer's own `claude plugin test` run, with `claude --version`, and every mutation observed at the new head (T1 to T34, T37 to T39, M35a, M35b, M36). The rollout switch is refreshed (round 46, item 4). Your 34-pass re-run on 2026-10-04 is your evidence only. It is not the observation of record, and after the correction the count will be 37.
6. Architect S2-3 and reviewer S2-2: closed on paper by Amendment 3. E4 itself runs after install.

**These go to the closing record by reference, and are not reopened:**
7. Architect S2-1: resolved by your filing note and the reviewer's seam section. A d.ts cite carries it.
8. Architect N-1 (T34's title), which is the same item as reviewer N-4.
9. Architect N-2 (the deviations, cited by line at a main commit after the merge), which takes in reviewer N-1, N-2 and N-7.
10. Architect N-3: the summary usage call on every main-loop tool call, to watch in the first week.
11. Reviewer N-3: the two reasons that carry no rule id. This is for the human's sight of §7's reasons; the strings stay unchanged.
12. Reviewer N-5: the reviewer re-reads it at gate 2, now that the plugin tests run.
13. Reviewer N-6: folded into README item R3.
14. Reviewer N-8: the `version` warning, as built.

**How gate 2 runs.** Both gates review the correction head. Each files a fresh report under `state/consults/gates/` whose first line names the branch and commit. Branch CI must be green before either gate starts (§9). The architect checks Amendments 2 and 3, §8 item by item including items 19 to 21, and the count. The reviewer runs §9's list plus Amendment 2's §9 items. On my reading, this is a scope-addition round carrying code, not a record-correction round under the record cap.

## (4) Question for the human

**Q-1.** G1 still lets two families of spelling through, and neither is in round 46, item 1's list:
- **PowerShell's backtick escape and line continuation.** The splitter splits at a newline, and a backtick-escaped `-f` is not read as an option. PowerShell is this machine's main shell, so this matters more than it would elsewhere. The worker noted it too (`state/consults/2026-10-03-guardian-v0-worker-report-1.md:245`).
- **Bash brace expansion,** for example `{git,push,-f}`.

Amendment 2 discloses both as limits. The other choice is to fix them now with a further class 9 amendment, which would probably push the piece past §7's ceiling into a class 8 overrun. My recommendation is to disclose them in v0 and narrow later through the usual process.

Files read:
- C:/dev/wt/guardian-v0/tools/mods/GUARDIAN-V0-PREREGISTRATION.md
- C:/dev/wt/guardian-v0/tools/mods/spatial-guardian/hooks/register.js
- C:/dev/wt/guardian-v0/tools/mods/spatial-guardian/test/guardian.test.ts
- C:/dev/wt/guardian-v0/tools/mods/spatial-guardian/README.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md
- C:/dev/spatial-ide/state/consults/2026-10-03-guardian-v0-worker-report-1.md
- C:/dev/spatial-ide/DECISIONS-PENDING.md (the round 46 block)
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md
