*Custodian's filing note (2026-10-04): PR #169's gate 2, the architect, for PLAN node `guardian-v0`, under the tag node:guardian-v0@g5. Reviewed: cut/guardian-v0 @ 1d057c79232dcbaccb4709f1d14eefbbaff5a9df (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here mechanically from the session transcript's copy of the hand-back, with the harness's two-space indent removed. Its sha256, from this file's line 5 to the end, is 3c0fa67fb2e00e796176c21c96f99cb3d97988fbddbf5fd16310e4021f0ccd15. Write audit PASS: zero write calls. C3: the worktree is at 1d057c79 with an empty porcelain before (09:56:22Z) and after. Main moved only by the custodian's own commits; the parallel gate-2 reviewer's in-progress mutations, if any, are the reviewer's. **S2-1 is a custodian wording error:** Amendment 5's §1 clause on the write audit was the custodian's own, and it dropped §2.7's E5 condition. The custodian takes route (a), a sight note to the human before the install approval: README line 73 and §2.7 govern, and line 44's wording is narrowed after E5 through the usual process. Profile paths redacted at filing: none.*

---

Reviewed: cut/guardian-v0 @ 1d057c79232dcbaccb4709f1d14eefbbaff5a9df

# Gate 2, architect: guardian-v0 (PR #169), node:guardian-v0@g5

**Verdict: PASS.** No S1. Two S2s, neither blocking, and eight Ns.

**Basis.** Both the branch ref and origin/cut/guardian-v0 read 1d057c79. The branch reflog orders the commits as follows:
- Amendment 2: 048de7b0
- Amendment 4: d388101c
- code: 71db3d7d
- mutation comments: 38f23c4e
- README R1 to R10: 946454d2
- Amendment 5: 8bfd7d22
- merge of main: 5f8f2306
- R11: 7fa2a67e
- Amendment 6: 1d057c79

Limits on what I could check:
- I have no shell, so I recomputed no sha256 and ran no diff. The reviewer recomputes every pin and runs the diffs.
- Where I say a span resolves, I mean its content matches what the record says it holds.
- Lines in branch-only files are named in words, at 1d057c79.
- Everything outside a code span is my paraphrase.

## Checklist

1. **Amendment 2 against round 46, item 1, and both gate-1 G1 probe sets: holds.**
   - The ruling's ( ), $( ), backtick and { cases are covered by F30 and T37.
   - All seven of the gate-1 reviewer's spellings are covered: the three it allowed are in F30, and the four it refused are in F31 and T38.
   - The gate-1 architect's two spellings are in F30.
   - Code: `pushRefused` returns the first reading, then the second, joined by `||` (lines 234-236 of register.js). The first reading is unchanged and runs first.
   - The extra splits are applied only after the quote and backslash branches have run (lines 60-95). So §8 items 19 and 20 hold.
   - The quoted-token rescan calls `pushRefused` under the same depth count and cap (lines 219-223).
   - Item 21 holds as far as I can read the head. The reviewer confirms by diff that nothing outside the G1 section changed.
   - Commit order: Amendment 2 precedes the code.
2. **Amendment 4 against the shell-route ruling, its RULED block and round 48: holds.**
   - Part A resolves against its sources:
     - Amendment 1 (P0b), item (i);
     - worker report 2: line 1 (2.1.289's types are not readable), line 26 (2.1.289), lines 27-31 (the runs) and line 53 (the PowerShell hooks line);
     - line 4 of each `.claude/agents` file: architect and evidence-reader hold Read, Grep and Glob, and lead-data adds Write. None holds a shell tool.
   - The round 48 RULED block, option A, adopts Part B's reading. So §8 item 22's hold is released, and no Option B to D code exists.
   - Code: `guardPowerShell` (lines 412-418) runs G6 only when `agentId` is set, calls `g6Refusal` with an undefined target and never reads `e.command`, then calls `refuseForcePush`. The registration's filter and `.catch` are unchanged (line 460). §2.1(g) as amended holds.
   - §8 item 23 holds for the hook; see S2-2 for N1.
   - Item 24 holds on my read. The reviewer diffs `g6Refusal`, `refuseForcePush`, the Bash registration and `guard`.
   - Commit order: Amendment 4 precedes the code.
3. **Part C against the correction head's runs: holds.** Worker report 3 records, at 946454d2:
   - `claude --version` 2.1.289;
   - 39 passing tests (T1 to T34 and T37 to T41);
   - all four validate runs, with exit 0 and the hooks and calls lines identical to report 2's;
   - the node suite at 440 of 440;
   - each verify tool, with its commit;
   - the T1 to T9, T22, T23 and T37 to T41 mutations, observed at 71db3d7d.

   After 946454d2 the branch changes only the form, a main merge that brings in a state-only commit (a30108a1), and +2 README lines. So the plugin code at the gated head is 946454d2's, and the reviewer's runs at 1d057c79 are the gated-head evidence.
4. **§8 items 19 to 25: no hit**, with item 23 read as stated in S2-2.
5. **README against R1 to R11: holds, apart from S2-1 and N-1.** Line by line:
   - R1: line 13
   - R2: line 30
   - R3: line 31
   - R4: line 73
   - R5: line 33
   - R6: line 32
   - R7: line 42
   - R8: line 17
   - R9: line 29
   - R10: lines 5 and 38
   - R11: line 44

   Line 44 does not present G6 as the primary guard, so item 25 holds.
6. **Amendment 5 against the template and the G6-backstop ruling: holds, apart from S2-1 and N-2.**
   - The first line carries the words scope addition and cites the directive by path, as class 9 permits.
   - It adds the backstop statement and the condition on definition changes to §1, and R11.
   - It precedes R11 (8bfd7d22, then 7fa2a67e).
7. **§7 and Amendment 6: class 8 is correctly recorded.**
   - The heading carries `budget overrun, §7 not edited`.
   - It records the declared figure, 1650 lines over 10 files.
   - It records the final figure, 1700 lines over 10 files, at 7fa2a67e, a branch commit named in words with no hash, against merge base a30108a1, which is on main. Worker report 4's per-file numstat adds up to 1700.
   - It gives the reason, and Amendment 4's §7 had predicted the overrun.
   - The §7 lines (441 and 452) read the same on main and on the branch.
   - Commits after 7fa2a67e touch only the form, which the counting command excludes. The reviewer recounts at 1d057c79.
8. **The brief's §1 and §5 against the whole: holds.**
   - Refuse only: there is no `tool.check`, no `allow`, no rewrite, no `$.model`, `$.ui` or write call, and `next(e)` only ever receives the event unchanged.
   - Fail closed: all five refusing registrations carry the constant deny `.catch` (lines 459-463), including the new hook.
   - N1 has no catch, by design.
   - The over-refusals added by Amendments 2 and 4 threaten the first-week acceptance and are disclosed in README lines 31 and 17.
9. **Round 25, item 2: none of the five named failures occurs.** Class 8 and class 9 are recorded, and no code precedes its amendment. The test comments say observed at 71db3d7d, and no record calls a verify-mutation run an observation. Branch spans are named in words with their commit ids. No five-line form is used.
10. **Seams and the caller rule: hold.**
    - `guardPowerShell` has one product caller, `register`, and `readingRefuses` has one, `pushRefused`. Nothing new is exported.
    - The PowerShell event's `command` field comes from the 2.1.288 type read. 2.1.289 is covered only by validate and the plugin tests, as Part A and Part C declare.
    - T40 and T41 run under the engine's own dispatch.
11. **Pins.** 257827d1, d55458c5 and a30108a1 are on main (main reflog). Hash values agree across records:
    - template:170 is 42297d7c… in Amendments 2 and 4;
    - template:169 is 8c7ea33d… in both;
    - shell-route ruling lines 6-9 are d01f6c20…, the same in Amendment 4 and the ledger's RULED block.

## Findings

**S1: none.**

**S2-1. README line 44 and Amendment 5's §1 drop §2.7's E5 condition on the write audit.**
- Amendment 5, §1, its first bullet, reads: `the write audit stays the primary check of their runs (§2.7)`. README line 44 carries `with the write audit as the primary check of their runs`.
- §2.7's last bullet and README line 73 say the write audit `stays the primary check until E5 passes, and the backstop after it`, per round 43, item 4.
- After E5 passes, line 44 contradicts line 73 and the ruling. The G6-backstop ruling says nothing about the write audit; the clause is the custodian's own.
- Not a by-name failure: it is a paraphrase, not a quotation.
- Route, the custodian's choice:
  - (a) Preferred: a sight note to the human, before his install approval, naming lines 44 and 73 and that line 73 governs. Narrow the wording after E5 through the usual process. This needs no new head.
  - (b) A one-clause README delta plus a correction row. This adds two lines over the bound, which needs a further class 8, and a reviewer re-run.

**S2-2. §8 item 23 and Amendment 4's F35 falsification, read literally, reach N1.**
- Item 23 reads `Any `$` call on a PowerShell call whose `agentId` is unset.` N1's unfiltered registration (line 458) calls `$.session.usage` on every main-loop call, PowerShell included (line 426). T41's `arm` answers that call (test file lines 55-66).
- The gate reads item 23 and the F35 falsification as applying to the PowerShell registration's hook. The basis is Amendment 4:
  - Part B's §2.7 scopes itself to that registration's hook;
  - its over-refusals bullet says the hook makes no `$` call on the main loop;
  - T41 is titled for that hook.
- N1 is §2.8's design, under round 44, item 1.
- This is a drafting gap in Amendment 4, which I drafted. It is not a code defect.
- Disposition: the closing record cites this item for the reading. There is no form edit and no correction row.

**N-1.** README line 44 opens with the record label `R11.`. That is operator-visible text, and R1 to R10 carry no label. Remove it if route (b) is taken; otherwise it is cosmetic.

**N-2.** Amendment 5 does not name what would invalidate it, which class 9 asks for. Its §5 sentence declares that it adds no code, test, mutation, hook, call, reason or §7 value, and that bounds it. The reviewer confirms that 7fa2a67e changes only the README (+2 lines).

**N-3.** Amendment 4's superseded index omits Amendment 2's §2.2 bullet that declares both G1 registrations unchanged. Part B's §2.7 supersedes that bullet for the PowerShell hook. Record only: the closing record references this item, and there is no correction round under the record cap.

**N-4.** The README's G6 row (line 17) names rounds 41 and 43 but not the 2026-10-04 shell-route ruling or round 48 for the PowerShell route (§2.11: the ruling for each rule). Cosmetic.

**N-5.** Part A answers the ruling's installed-build question from the 2.1.288 session. Whether a 2.1.289 session exposes the tool is unestablished; Part A and README line 42 disclose this, and round 48 accepted it. Optional: E0 could record whether the installing session lists a PowerShell tool, which would be a class 7 addition at the custodian's discretion.

**N-6.** Class 9's text names standing rules. Round 46, item 1, and the shell-route ruling are rulings on this piece, routed as class 9 by the RULED blocks' Applied text. No round 25 failure fires. Under the record cap this is a ledger observation at most, not a clause.

**N-7.** Carried from gate 1: N-1 (T34's title), N-2 (the undeclared deviations, whose register.js lines have since moved) and N-3 (N1's per-call cost, unmeasured).

**N-8.** §6 lists verify-mutation, but it was not run and is not relied on, so §4's coverage sentence stays unanswered. The reviewer reads the comments.

## Gate-1 items
- **S2-1:** resolved. `<skill-root>/types/claude-code.d.ts:10206-10208`; the gate-1 reviewer gives sha256 bb7a6a6e4137d31c63286518d0dab593dd5444470512d385ff152d0dc6b281e4.
- **S2-2:** carried by Amendment 2 (G1 hardened; README R1 to R6) and Amendment 4 (R7 to R10).
- **S2-3:** carried by Amendment 3 (E4).
- **N-1 to N-3:** by reference (N-7 above).

## Closing-record list (references and hashes only)
1. Mutation observations:
   - the worker's at 71db3d7d (2.1.289) for T1 to T9, T22, T23 and T37 to T41;
   - 54eba872 (2.1.288) for T10 to T21 and T24 to T34;
   - the reviewer's at 1d057c79 for all of them plus M35a, M35b and M36;
   - `node --version` and `git --version` for T35 and T36.
2. §7: Amendment 6, and the reviewer's recount at 1d057c79.
3. README R1 to R11, cited by line at a main commit after the merge (round 15 (e)), and S2-1's disposition.
4. The rulings:
   - round 46, items 1 and 2;
   - round 47;
   - round 48;
   - `state/directives/2026-10-04-guardian-shell-route-ruling.md` lines 6-9 (d01f6c204e6e80eab36831902d0b7d29d48dfbee46960313ed3a60d33b24687c);
   - `state/directives/2026-10-04-guardian-g6-backstop-ruling.md` lines 6-8 (5617d45ce4a07a763f1dbc1f66bfff910e08bf6e2c00bd7e17b3e85e9b54adef). Both hashes are as the ledger states them; the reviewer recomputes.
5. S2-2's reading, and N-2 and N-3, by reference to this report.
6. Gate-1 dispositions, as above.
7. Tool claims, each with its commit: verify-cites 522e448d, verify-quotes f9444a4d, verify-test-claims e9735d47, verify.mjs 26072022. verify-mutation is not relied on.
8. The validate outputs, text and `--json`, in the PR body (worker report 3; the reviewer's at the head).
9. A merge commit, never a squash, so that 54eba872, adfcb857, de6a2c02, 71db3d7d and 7fa2a67e stay reachable (§8 item 16).

Files read:
- C:/dev/wt/guardian-v0/tools/mods/GUARDIAN-V0-PREREGISTRATION.md
- C:/dev/wt/guardian-v0/tools/mods/spatial-guardian/hooks/register.js
- C:/dev/wt/guardian-v0/tools/mods/spatial-guardian/test/guardian.test.ts (lines 1-300 and 440-570)
- C:/dev/wt/guardian-v0/tools/mods/spatial-guardian/README.md
- C:/dev/wt/guardian-v0/docs/PREREGISTRATION-TEMPLATE.md (lines 95-178)
- C:/dev/wt/guardian-v0/state/consults/2026-10-04-guardian-v0-worker-report-2.md
- C:/dev/wt/guardian-v0/state/consults/2026-10-03-guardian-v0-worker-report-1.md (lines 240-247)
- C:/dev/wt/guardian-v0/state/consults/gates/2026-10-03-guardian-v0-gate1-reviewer.md
- C:/dev/wt/guardian-v0/scripts/hooks/subagent-write-audit.mjs (lines 1-20)
- C:/dev/wt/guardian-v0/.claude/agents/*.md (line 4 of each)
- C:/dev/spatial-ide/state/consults/gates/2026-10-03-guardian-v0-gate1-architect.md
- C:/dev/spatial-ide/state/consults/2026-10-04-guardian-v0-worker-report-3.md
- C:/dev/spatial-ide/state/consults/2026-10-04-guardian-v0-worker-report-4.md
- C:/dev/spatial-ide/state/directives/2026-10-04-guardian-shell-route-ruling.md
- C:/dev/spatial-ide/state/directives/2026-10-04-guardian-g6-backstop-ruling.md
- C:/dev/spatial-ide/state/directives/MODS-GUARDIAN-V0-2026-10-03.md
- C:/dev/spatial-ide/DECISIONS-PENDING.md (lines 1-80)
- C:/dev/spatial-ide/tools/mods/GUARDIAN-V0-PREREGISTRATION.md (the main copy, lines 441, 452 and 515-521)
- C:/dev/spatial-ide/.git refs and reflogs for cut/guardian-v0 and main
