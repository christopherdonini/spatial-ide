*Custodian's filing note (2026-10-04): the architect's drafting consult for guardian-v0's Amendment 4 (Parts A and B class 9: the shell-route answer in §1, and G6 closing the PowerShell route; Part C class 1: I2's build record), on the 2026-10-04 shell-route ruling, under the tag node:guardian-v0@g3. It arrived as a message and is extracted here mechanically from the session transcript's copy of the hand-back, with the harness's two-space indent removed. Its sha256, from this file's line 5 to the end, is 66d19d3027cb696f25d99121c52e0a4319700ab79a4eb7289ae6181b23ece79b. Write audit PASS: zero write calls (Read 12, Grep 5). C3 clean: before 09:22:34Z at d55458c5, after 09:31:08Z at 27178b10; main moved only by the custodian's ledger commits, and the guardian worktree is at de6a2c02 with an empty porcelain at both. **The custodian's brief** quoted the ruling's qualifier as one phrase, though it spans a line break (lines 7 and 8 of the directive); the architect paraphrased it and cited lines 6-9. **Appended:** part (1)'s fenced block, with its 11 pins computed by script at d55458c5, appended byte-exact on `cut/guardian-v0`. The directive pin equals the RULED block's d01f6c20…. **Its question** (options A to D for G2 to G4 and G6 on the PowerShell tool) goes to the human. The G6 PowerShell code goes ahead under every option.*

---

Reviewed: cut/guardian-v0 @ de6a2c02

**Verdict:** pass with notes. Amendment 4 is drafted below. It raises one question for the human. No code waits on that question, but gate 2 does.

Notes before the text:
- Your brief puts the ruling's G2–G6 qualifier in quotation marks, as if it were one phrase. In the source it is split across a line break, between lines 7 and 8 of `state/directives/2026-10-04-guardian-shell-route-ruling.md`, so it is not a byte-for-byte span. Under round 10 a record must not carry it as a quote. The draft paraphrases it and cites `:6-9` instead.
- These are the main pins left at `sha256:HASH-TBD` for you to compute:
  - the directive at `:6-9`. It should equal d01f6c20…, the value in the RULED block.
  - worker report 2 at `:1`, `:26`, `:27-31` and `:53`.
  - `docs/PREREGISTRATION-TEMPLATE.md` at `:103-105`, `:169` and `:170`.
  - `scripts/hooks/subagent-write-audit.mjs` at `:11-16`.
- The `.claude/agents/*.md` line-4 cites are named in words with no hash, as §0.3 names them.
- The amendment holds two classes: Parts A and B are class 9, Part C is class 1. If a gate reads one class per amendment, Part C can be moved unchanged into its own Amendment 5.

## (1) Amendment 4, exactly as it is to be appended

````markdown
### Amendment 4 — scope addition: the PowerShell route for G6, the shell-route answer in §1, and I2's build record (class 9; Part C is class 1)

Scope addition, by the 2026-10-04 shell-route ruling (`state/directives/2026-10-04-guardian-shell-route-ruling.md:6-9 @ d55458c5 sha256:HASH-TBD`; RULED 2026-10-04, the shell-route block in `DECISIONS-PENDING.md`, cited by its heading and not by line), made after gate 1's outcomes and worker report 2's I2 stop were seen (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:26 @ d55458c5 sha256:HASH-TBD`). It is declared under class 9 (`docs/PREREGISTRATION-TEMPLATE.md:170 @ d55458c5 sha256:HASH-TBD`) before any code of the addition, and its code lands in the same correction round as Amendment 2's. de6a2c02 below is de6a2c0212cb5026f7d71d08557eb36078793257, a branch commit, named in words with no hash (round 15 (e); round 25, item 2 (d)).

**Part A — §1, added: the shell-route answer.** The ruling asks for it in §1, either way. **The answer is yes: PowerShell.**
- The build types it, with the string field `command`: Amendment 1 (P0b), item (i), read at 2.1.288.
- This machine's session exposes it: the custodian observes that the custodian's own session, running 2.1.288, holds a PowerShell tool (the RULED block above).
- At 2.1.289, `claude plugin validate` lists `tool.call{tool=PowerShell}` on its hooks line at the unchanged head (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:53 @ d55458c5 sha256:HASH-TBD`). That shows the registration is read, and not that the tool is typed or exposed at 2.1.289.
- **Not established at 2.1.289:** the PowerShell entry and its `command` field in 2.1.289's types, which are not readable here without loading a skill in a 2.1.289 process (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:1 @ d55458c5 sha256:HASH-TBD`); whether a 2.1.289 session exposes the tool; which subagent types receive it. None of the three report-only definitions lists a shell tool (`.claude/agents/architect.md`, `.claude/agents/evidence-reader.md` and `.claude/agents/lead-data.md`, line 4 of each at d55458c5, named in words as §0.3 names them).

**Part B — the route (class 9).**

*The reading taken.*
- G1 hooks the PowerShell tool already: its registration is line 433 of `tools/mods/spatial-guardian/hooks/register.js` at de6a2c02, and T9 (lines 194-202 of `tools/mods/spatial-guardian/test/guardian.test.ts` at de6a2c02) proves it.
- G2 to G4 guard writes by a tool's path field (§2.1(d)), and they guard no shell write on Bash (§2.10). A shell call carries no path field. On this reading G2 to G4 hook nothing on the PowerShell tool, and §2.10's limit names both shells.
- G6 guards a report-only run's writes. A shell call by such a run is a write route that no path can place, and the write audit already voids any Bash or PowerShell call by such a run (`scripts/hooks/subagent-write-audit.mjs:11-16 @ d55458c5 sha256:HASH-TBD`). G6 therefore closes that route on the PowerShell tool without reading the command.
- This reading is the architect's, and the custodian puts it to the human as a question. Every option offered keeps the G6 code below, so that code does not wait. Gate 2 waits on the answer, and any option that adds code is declared by a further class 9 amendment before any of it.

**§2.7, added: the shell route.**
- The PowerShell registration's hook runs G6, then G1, then `next(e)`. It replaces `refuseForcePush` as that registration's hook (line 433 of `register.js` at de6a2c02). The registration's filter and its `.catch` are unchanged.
- G6: with `e.agentId` unset, it makes no `$` call. Otherwise it calls `g6Refusal` (lines 342-358 of `register.js` at de6a2c02), unchanged, with no placed target, because a shell call has none. A report-only row therefore always ends in `G6_REASON`, or in `CATCH_REASON` when a read rejects, whatever the command. Any other row, or no row, goes on. The command string is not read.
- G1: `refuseForcePush`, as §2.2 and Amendment 2 state.
- Its reads are `$.agent.list`, and for a report-only row `$.session.messages` and `$.fs.stat` on the declared path. All are in §2.0.
- **§2.1(g), added:** the order in the PowerShell hook is G6 (when `agentId` is set), then G1, then `next(e)`.
- Unchanged: `g6Refusal`, `refuseForcePush`, `pushRefused`, the Bash registration, the Write, Edit and NotebookEdit guard, and every reason. No hook, call, option, export, flag, reason or file is added.

**§2.10, third bullet, replaced:** G2 to G4 read no shell command, on Bash or PowerShell, so a shell write (`sed -i`, a redirect, `tee`, `Set-Content`) to a protected path is not refused by them. G6 refuses every PowerShell call by a report-only subagent. A report-only subagent's Bash call is untouched by G6, as before.

**§1, may not claim, the Bash-and-PowerShell writes bullet, replaced:** writes by Bash or PowerShell, except that G6 refuses every PowerShell call by a report-only subagent; and any live G6 shell refusal, because no report-only definition holds a shell tool (Part A), so there is no E-row for it.

**Over-refusals this adds.**
- A report-only subagent's PowerShell call is refused even when it only reads or writes its own REPORT PATH. Its route is the Write tool. No such definition holds the tool today (Part A), so this is defensive.
- Any other subagent's PowerShell call is refused by the catch when `$.agent.list` rejects (fail closed, §2.1(b)).
- None on the main loop, where the hook makes no `$` call (T41).

**§3, added.**

| # | Call | Engine answers | Predicted |
|---|---|---|---|
| F33 | lead-data, brief declaring a REPORT PATH: PowerShell `Get-Content C:\r\x.md`, and `Set-Content -Path <its REPORT PATH> -Value y`; architect, brief with no line: PowerShell `Get-Location` | list, messages, stat | refused, G6 |
| F34 | a `worker` row: PowerShell `git status`; an unlisted id: PowerShell `git status`; a `worker` row: PowerShell `git push --force` | list | `next(e)`; `next(e)`; refused, G1 |
| F35 | main loop: PowerShell `Set-Content C:\r\notes.md x`, then `git push -f` | none | `next(e)`; refused, G1 |

**§4, added**, in `tools/mods/spatial-guardian/test/guardian.test.ts`, run and observed as §4 states:

| # | Test | Fixture | Mutation |
|---|---|---|---|
| T40 | `G6 refuses every PowerShell call by a report-only subagent and leaves other subagents to G1` | F33, F34 | the PowerShell registration's hook set back to `refuseForcePush` (G6 dropped from it) |
| T41 | `G6 makes no engine call on a main-loop PowerShell call` | F35 | the `agentId` condition dropped, so G6 runs on a main-loop call |

T41 arms no `agent.list` answer, so under its mutation the unanswered call throws and the catch refuses. The `agentId` cast follows §4's. The worker also re-observes T22's and T23's mutations at the observation commit, because `g6Refusal` gains a caller and both mutations are predicted to fail T40 as well, and records that commit in each comment.

**§5, added.**
- Predictions: T40 and T41 pass at the head, and each fails under its mutation. Every F1 to F32 outcome and every T1 to T39 result is unchanged. `validate`'s hooks line is unchanged and its calls line names the same six calls. A difference confined to a `(via …)` annotation is recorded as class 2, not I3.
- Declared unchanged: what Part B's §2.7 lists, every §7 value, and §7's file list. Amendment 2's §5 sentence that declares everything outside G1's code in `register.js` unchanged now makes an exception for this hook.
- Invalidator: **I11**, the shell route needs a change to `g6Refusal`, a hook or call outside §2.0, a new reason or §7 value, or a file outside §7's list.
- Falsification: an F33 call reaches `next(e)`; an F34 or F35 call that does not force-push is refused; an F35 call makes a `$` call.

**§8, added.**
22. G2, G3 or G4 code on a shell registration, or a G6 check that reads a shell command, before the human's answer to the custodian's question and, for any option other than the reading taken, its class 9 amendment.
23. Any `$` call on a PowerShell call whose `agentId` is unset.
24. Under this amendment: a change to `g6Refusal`, `refuseForcePush`, the Bash registration or the Write, Edit and NotebookEdit guard; or a new reason, hook, call, option, export or §7 value.

**§9, added.**
- Architect: this amendment against the shell-route ruling and its RULED block; Part A against its sources; the human's answer filed and cited by round and item, and any further amendment before its code; §8 items 22 to 24; Part C against the correction head's runs; §7's count, and class 8 if it is due.
- Reviewer: the T40, T41, T22 and T23 mutations, observed at the gated head; `claude --version` reading 2.1.289 on every run of record.

**§2.11, the README adds, in words, with no quotation:**
- R7: Part A's answer.
- R8: the G6 row names the PowerShell route.
- R9: the shell-write limit as §2.10 now states it.
- R10: lines 5 and 36 of `tools/mods/spatial-guardian/README.md` at de6a2c02 name 2.1.289 for the tested behaviour and 2.1.288 for the type reads.

**§7.**
- The size line stands and is not edited.
- Estimate for this addition: `register.js` 12, plugin tests 55 (the T22 and T23 comments included), README 10, no new file.
- With Amendment 2's estimate of 85 and the 1555 lines its §7 records at adfcb857, the combined figure is about 1717. That is over 1650, so an overrun is predicted.
- The worker runs §7's command at the correction head and records the figure. If it exceeds 1650 lines or 10 files, a class 8 amendment (`docs/PREREGISTRATION-TEMPLATE.md:169 @ d55458c5 sha256:HASH-TBD`) records the declared figure, the final figure at the named commit and the reason, before gate 2.

**Part C — I2's record (class 1).** Post-result record, written after worker report 2's I2 stop was seen (class 1, `docs/PREREGISTRATION-TEMPLATE.md:103-105 @ d55458c5 sha256:HASH-TBD`).
- **The change.** `claude --version` read 2.1.288 at every run of record through adfcb857 (Amendment 1's opening paragraph; the observation comments). It read 2.1.289 at correction round 1's first run of record (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:26 @ d55458c5 sha256:HASH-TBD`). The installed binary was replaced after the human's restart on 2026-10-04, and the custodian's running session stays 2.1.288 (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:1 @ d55458c5 sha256:HASH-TBD`).
- **How the 2.1.288 claims stand.** §0.1, §0.2 and Amendment 1 (P0b) are claims about build 2.1.288 (round 15 (c)). They are true of that build, and none is read as current for 2.1.289. The round does not re-read the types; Part A says why. At 2.1.289 the code relies on them only as far as the correction head's runs prove: the test kit, the engine's dispatch and `.catch` path (§0.2 items 5 and 6), and `validate`'s two lines (item 7). E0 records `claude --version` at install.
- **The unchanged head at 2.1.289.** 34 pass, and both `validate` targets exit 0, text and `--json`, with §2.0's hooks and calls (`state/consults/2026-10-04-guardian-v0-worker-report-2.md:27-31 @ d55458c5 sha256:HASH-TBD`). This is evidence about de6a2c02 only, not about the correction head.
- **What the round re-runs and records at 2.1.289, at the correction head:**
  - `claude --version`;
  - `claude plugin test tools/mods/spatial-guardian`, T1 to T34 and T37 to T41;
  - `claude plugin validate` on `tools/mods/spatial-guardian` and on `tools/mods`, text and `--json`;
  - the node suites and §6's tools, each tool named with its commit;
  - at the observation commit, every mutation whose code or failing set this round changes: T1 to T9 (Amendment 2), T22 and T23, and T37 to T41.
  The other mutation comments keep their 54eba872 observations at 2.1.288. Those stay true as records of that commit and are not edited. The reviewer observes every mutation at the gated head (§9), and the closing record names each observation's commit and build.
- **From this amendment, 2.1.289 is the build of record.** §5 I2's line is not edited, and a run of record at any build other than 2.1.289 fires I2 again. §1's may-claim items 1 and 4 hold at 2.1.289 once the correction head's runs pass. §1's build bullet now reads: any build other than 2.1.289 for the tested behaviour; the type reads remain 2.1.288's.

**Superseded index.**
- §1, may claim, items 1 and 4: the build is 2.1.289 (Part C).
- §1, may not claim: the build bullet (Part C), and the Bash-and-PowerShell writes bullet (Part B).
- §2.1(g): the PowerShell hook's order is added (Part B).
- §2.10, third bullet: replaced (Part B).
- §5, I2: its build of record is 2.1.289 (Part C).
- Amendment 2, §5, its declared-unchanged sentence for `register.js`: it now makes an exception for Part B's hook.
This amendment adds to §1, §2.7, §2.11, §3, §4, §5, §8 and §9, and replaces no other line.
````

## (2) The correction round's combined scope (Amendments 2 and 4), under tag `node:guardian-v0@g4`

1. **Observation commit first.** The code and tests are committed, every mutation is observed against that commit, then comment-only updates name it. This is the pattern in worker report 2, line 76.
2. **Code changes in `register.js`:**
   - G1's second reading (Amendment 2, §2.2).
   - The PowerShell registration's hook runs G6, then G1 (Amendment 4, §2.7). `g6Refusal`, the Bash registration and the Write, Edit and NotebookEdit guard do not change.
3. **New tests:** T37 to T39 (F30 to F32) and T40, T41 (F33 to F35), each with its mutation observed at 2.1.289.
4. **Re-observed mutations at 2.1.289:** T1 to T9 (Amendment 2), and T22 and T23 (Amendment 4). Each comment names the observation commit and `claude --version`.
5. **README:** R1 to R6 (Amendment 2) and R7 to R10 (Amendment 4), which include the build lines.
6. **I2 runs at the correction head, at 2.1.289:**
   - `claude --version`;
   - the full `claude plugin test`;
   - `validate` on both targets, text and `--json`;
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`, with T35 and T36 named;
   - verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each with the tool's commit;
   - branch CI read.
7. **§7 count at the correction head.** The worker records the figure. A class 8 amendment, which an overrun is predicted to need, is appended before gate 2. §7's line is never edited.
8. **Before gate 2:**
   - the human's answer to the question below is filed and cited by round and item;
   - if he picks option B, C or D, an Amendment 5 (class 9) declares that code, and the code lands only after it.
9. **Gate 2:** both gates re-run on the new items in §9 of Amendments 2 and 4. The reviewer's S1-1, the rollout switch, is discharged there.

The generation tag after appending: `node:guardian-v0@g4`.

## (3) Question for the human

**The shell-route ruling (`state/directives/2026-10-04-guardian-shell-route-ruling.md:6-9`) qualifies G2 to G4 and G6 by where they guard writes. Today they guard writes only on tools that carry a path field (Write, Edit, NotebookEdit), and §2.10 declares Bash writes uncovered. What should they do on the PowerShell tool?**

- **A (Recommended): close the route for G6; G2 to G4 match Bash.**
  - G6 refuses every PowerShell call by a report-only subagent without reading the command. That is a route closure, the same treatment the write audit gives any shell call. It costs nothing today, because no report-only definition holds a shell tool.
  - G2 to G4 read no shell command on either shell, and §2.10's limit names both.
  - This is drafted above, and nothing waits on it.
- **B: A, and G6 also closes the Bash route for report-only subagents.**
  - Both shells are then treated alike, as the write audit treats them.
  - It goes beyond the ruling's "that tool", so it needs the human's word.
  - Cost: one more hook change and one test, declared in Amendment 5; that code waits.
- **C: A, and G2 to G4 refuse a PowerShell command that holds a write form and names a protected path.** A write form is a declared list of cmdlets, aliases, redirections and `[IO.File]` calls.
  - The list can never be complete, which is the spelling game the ruling sets routes apart from.
  - It would bite on the primary shell, and it leaves Bash uncovered, so the two shells would differ.
  - Cost: about 150–200 more lines and a larger class 8 overrun; that code waits on Amendment 5.
- **D: C on both shells.** The largest option, and it goes beyond the ruling's words. That code waits on Amendment 5.

**Why A:** on a shell, a path match becomes a spelling match. Round 47 chose to disclose G1's remaining spelling families rather than chase them, and a write-form list would be a new spelling family on this machine's primary shell. G6's closure is the one guard on this route that needs no spelling.

**What waits:** under every option, the G6 PowerShell code in Amendment 4 goes ahead, so the worker can be dispatched now. Gate 2 waits for the answer. Code for options B, C or D waits for Amendment 5.

Files read: `C:\dev\wt\guardian-v0\tools\mods\GUARDIAN-V0-PREREGISTRATION.md`, `C:\dev\wt\guardian-v0\tools\mods\spatial-guardian\hooks\register.js`, `C:\dev\wt\guardian-v0\tools\mods\spatial-guardian\test\guardian.test.ts`, `C:\dev\wt\guardian-v0\tools\mods\spatial-guardian\README.md`, `C:\dev\spatial-ide\state\directives\2026-10-04-guardian-shell-route-ruling.md`, `C:\dev\spatial-ide\state\consults\2026-10-04-guardian-v0-worker-report-2.md`, `C:\dev\spatial-ide\DECISIONS-PENDING.md`, `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md`, `C:\dev\spatial-ide\scripts\hooks\subagent-write-audit.mjs`, `C:\dev\spatial-ide\.claude\agents\*.md`.
