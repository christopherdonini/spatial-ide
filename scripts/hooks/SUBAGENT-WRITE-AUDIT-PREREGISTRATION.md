# The subagent write audit as a tracked script — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code. The human ruled the transcript audit the primary check for lead-data and architect runs (question round 41, item 3; `state/directives/2026-10-03-write-audit-ruling.md`), and placed this node (question round 42, item 3; RULED 2026-10-03). The custodian ran the audit from its session scratchpad on 2026-10-03, and this piece lands it in the repository.*

```
Authority: PLAN node subagent-write-audit-script; question round 41, item 3 (RULED 2026-10-03; state/directives/2026-10-03-write-audit-ruling.md); question round 42, item 3 (RULED 2026-10-03, the placement)
Scope: scripts/hooks/subagent-write-audit.mjs (new) and scripts/hooks/subagent-write-audit.test.mjs (new); 2 files; <= 250 changed lines, this form excluded
Change: a CLI, `node scripts/hooks/subagent-write-audit.mjs <agent id | transcript path> <allowed report path | NONE> [--session <id>]`, Node standard library only, no export, no network, writing nothing. An agent id (a followed by 16 hex digits) resolves to the canonical transcript <home>/.claude/projects/<slug>/<session>/subagents/agent-<id>.jsonl, where <slug> is the repository root path with every character outside [A-Za-z0-9] replaced by "-", and <session> comes from --session or CLAUDE_CODE_SESSION_ID. It reads every tool_use in the JSONL and prints one JSON object {verdict, allowed, toolCounts, writeCalls, voids}. The verdict is PASS iff every Write, Edit, MultiEdit and NotebookEdit call targets exactly the allowed path (compared after normalising backslashes to slashes and case-folding), with none allowed under NONE, and no Bash or PowerShell call appears. A missing or empty transcript, or zero tool calls parsed, is VOID. Exit 0 on PASS, 1 on VOID, 2 on a usage error.
Tests+mutation: in the new test file, each test building its fixture JSONL in a temp directory it removes: T1 PASS when the only write calls target the allowed path; T2 VOID on a Write to another path; T3 VOID on any Bash call; T4 VOID under NONE with one Edit; T5 VOID on an empty file and on a transcript with zero tool calls; T6 PASS across slash and drive-letter case differences; T7 exit 2 on a missing argument. Mutation: remove the zero-calls check, and T5 fails by name; observed, reverted, recorded in a RECORDED MUTATION comment with its commit.
Out-of-scope: ADR none; security none (a read-only audit tool for the custodian; no product permission or audit surface); wire none; guarantee none -- the single reviewer gate applies (round 25, item 2 (e)). No hook wiring, settings, workflow or record-rule change. The ruling's secondary checks (status, dirty-file hashes, refs snapshot) stay the custodian's procedure.
```

Amendment: classes 2 and 8 -- budget overrun, Scope not edited. Written after the custodian's live seam check and before any gate (a post-result amendment). References only.
- **Class 2, the slug.** The Change line derives <slug> from the repository root path.
  - Run from a worktree, that is the worktree's path, and an agent id resolved to no transcript. The custodian's live check against real transcripts found this (`state/consults/2026-10-03-subagent-write-audit-script-worker-report-2.md`).
  - 47fe9e54 derives the slug from the main checkout, through git's common directory, and falls back to the script's directory. T8 tests the id path, with M2 recorded.
  - The Change line is not rewritten.
- **Mutations added.** The Tests line names M1 only. M3 to M5 (T1 to T3) were observed at 47fe9e54 and recorded at e5f3fd5f, so that every new test has a recorded mutation (`state/consults/2026-10-03-subagent-write-audit-script-worker-report-3.md`).
- **A record finding.** `state/consults/2026-10-03-subagent-write-audit-script-worker-report-1.md` records verify-mutation at rc 0. At 8d296b9c it is rc 1, with 5 of 7 new tests unrecorded. The likely cause is a run before the commit, when HEAD had no new test.
- **Class 8.**
  - Declared: at most 250 changed lines over 2 files.
  - Final: 264 lines (110 and 154) over the same 2 files, at e5f3fd5f, this form excluded.
  - Reason: T8, M2 to M5, and the common-directory resolution.
  - Scope is not edited.
- **Seam proof** (an observation, worker report 2). At 47fe9e54, run from this worktree with `--session`, the script resolved three real agent ids: two PASS, and one VOID (its Bash calls), as expected.

Amendment: classes 6 and 4 -- budget deviation, Scope not edited; mutations added after a gate finding. Written after gate 1 (a post-result amendment). References only.
- **Gate 1:** reviewer FAIL at 7a9784cb (`state/consults/gates/2026-10-03-subagent-write-audit-script-gate1-reviewer.md`; `state/gate-log.json` record 367).
- **Class 6 (S1-1).**
  - Declared: at most 250 changed lines over 2 files. Final: 293 lines (114 and 179) over the same 2 files, at c656076e, this form excluded, by §21c's counting rule.
  - The declared 250 was already over §21c's 150-line bound at dispatch, which is the custodian's error. The single-gate route closes as §21b's mid-piece clause says, and the architect gate is taken. The short form stays.
  - This line supersedes the first Amendment's "class 8" label, since class 8 is the full form's class. The Out-of-scope line's single-gate claim no longer holds, and the line is not rewritten. The Scope line is not edited.
- **Class 4 (S1-2, S1-3).**
  - T4, T6 and T7 now have mutations of their own: M7, M8 and M9, observed at 1202bf4e and recorded at aed61535.
  - An unparseable transcript line now voids the run, naming its line (1202bf4e). T9 tests it, with M6 observed at 1202bf4e and recorded at aed61535.
  - All four mutations are unit-only.
- **The first Amendment, corrected (S2-1, S2-2).**
  - Its fallback is the script's repository root, not the script's directory.
  - M2 fails T8 only when the suite runs from a worktree, and the clause above M2's comment says so (c656076e). M2's comment names 8d296b9c, the base its edit was applied on before the fix committed at 47fe9e54. The gate-1 reviewer re-observed M2 at 7a9784cb.
- **Routed to the human (S2-3).** The first Amendment's "Mutations added" and "A record finding" bullets fit no class in the template's section 10. They are routed to the human (`DECISIONS-PENDING.md`, OPEN 2026-10-03), and are not re-classed here.
- **Not taken in this piece:** S2-4 (an allow-list of read-only tools) and N-2 (a read error other than ENOENT exits 1 without JSON, and cannot PASS). The Change line defines the verdict by the write and shell tools, and no granted tool list reaches another tool today. Both go to the closing record's follow-ups.
- **N-1:** the header is reworded at aed61535.
- **Worker report 4:** `state/consults/2026-10-03-subagent-write-audit-script-worker-report-4.md`. Its third Deviations bullet is imprecise: the reworded header keeps "export anything".

Amendment: classes 9, 3 and 1 -- scope addition on AUTONOMY.md §14 (the sibling search), declared before any of its code; record corrections. Written after gate 2 (a post-result amendment). Correction round 2, the last of the record cap's two. References only.
- **Gate 2:** FAIL and FAIL at 8173b1e6.
  - Architect: `state/consults/gates/2026-10-03-subagent-write-audit-script-gate2-architect.md`, gate-log record 368.
  - Reviewer: `state/consults/gates/2026-10-03-subagent-write-audit-script-gate2-reviewer.md`, gate-log record 369.
- **Scope addition, class 9.** By the architect's S1-3 and the reviewer's S2-3.
  - **The sibling search (§14).** The custodian read the parse loop at 8173b1e6.
    - These carry no tool call: a blank line, a line whose `message.content` is not an array, and an item that is not a `tool_use`.
    - These void: a write call with no path, a missing or empty transcript, zero calls, and an unparseable line.
    - One sibling is a gap: a tool on neither the write list nor the shell list passes silently, an `Agent` call that spawns an unaudited writer included.
  - **The change.** A `tool_use` whose name is on none of three lists voids the run, naming the tool. The lists are read-only (`Read`, `Grep`, `Glob`, `SubagentHandback`), write (the four) and shell (the two). This narrows the Change line's PASS. The Change line is not rewritten.
  - **The test.** T10: a transcript with an allowed Write and one call to a tool on no list is VOID, exits 1, and names that tool. The mutation, M10: remove that void, and T10 fails by name.
  - **Declared unchanged:** T1 to T9 and their verdicts, the exit codes, and the agent-id resolution.
  - **The invalidator.** If the void fires on any of the four live transcripts below, the piece stops.
    - The four are lead-data dispatch 2 (a1761dc9daea9c1e5), the two NONE runs of worker report 2 (aaa04ea882704ee94, a11d6c7e3a67ec44d) and this piece's gate-2 architect (a34ab0514f1cb4e23).
    - The custodian's re-run of the four at 8173b1e6 gave PASS, PASS, VOID (its Bash calls) and PASS. That covers the architect's S2-5.
    - The gate-3 reviewer re-runs them at head.
  - This replaces the second Amendment's reason for not taking S2-4.
- **Class 3 (the architect's S1-2).** The first Amendment's rc 1 at 8d296b9c is verify-mutation at tool commit 7d24ed15 (the gate-1 reviewer, Exit codes).
- **Class 1 (the architect's S2-3).** The parse void at 1202bf4e brings the code to its Change line, so it is class 1. The second Amendment's class 4 covers M6 only.
- **Corrections.** By the architect's S2-1, S2-2 and S2-4, and the reviewer's S2-1 and S2-4.
  - The Out-of-scope line's single-gate claim did not hold at dispatch. Its round 25 (e) cite governs §21a categories, not size.
  - The rise from 264 to 293 is T9, M6 to M9 and the parse void. The 264 is the first Amendment's reason. This Amendment's code adds to the figure, and the closing record states the final figure.
  - M1's observation of record is the gate-1 reviewer's, at 7a9784cb, as it is for M2.
  - The script's header list of VOID cases and the test file's "T1-T8" header are updated with this Amendment's code.
- **The first Amendment's "A record finding"** is class 1, by the gate-2 architect's Judgment 3. Only "Mutations added" stays with the human, and the OPEN entry is narrowed to it.
- **Superseded index** (round 12 (e)), for correction rounds 1 and 2. Each item names the superseded text, then where it is replaced.
  - The first Amendment's "class 8" label: by the second Amendment, class 6.
  - Its "falls back to the script's directory": by the second Amendment.
  - Its "so that every new test has a recorded mutation", false when it was written (gate 1, S1-2): by the second Amendment's class 4 bullet.
  - Its rc claim without the tool commit: by this Amendment, class 3.
  - Its unclassed "A record finding" bullet: by this Amendment, class 1.
  - The Out-of-scope line's single-gate claim: by the second Amendment, as corrected here.
  - The second Amendment's "no longer holds": by "did not hold at dispatch", here.
  - The second Amendment's class 4 label for the parse void: by class 1, here.
  - The second Amendment's reason for not taking S2-4: by this Amendment's scope addition.
  - Nothing else is superseded.
- **Follow-ups, for the closing record:**
  - N-2, a read error other than ENOENT exits 1 without JSON;
  - the gate-2 reviewer's N-2: verify-mutation's 500-character window constrains the order of comments.

Amendment: classes 1, 3 and 6 -- budget deviation, Scope not edited; the record reduced to references by the architect under the record cap, item 3 (`state/directives/2026-09-18-record-cap.md`), after correction round 2. Written after gate 3 (a post-result amendment). References only.
- **Defects named by gate 3:** D1, the third Amendment's test-text correction names its span without a commit id (round 25, item 2 (d)); D2, its superseded index is incomplete (round 12 (e)); D3, its S2-5 discharge names no record (round 7). Source: `state/consults/gates/2026-10-03-subagent-write-audit-script-gate3-architect.md`, S1.
- **Class 3, test text (D1).** Superseded: line 5 of `scripts/hooks/subagent-write-audit.test.mjs` at 8173b1e6. Replaced by: line 5 of the same file at f1e39550. The hash pin follows on main after the merge, as round 25, item 2 (d) orders.
- **Class 6, the final figure.** Declared 250; final 309 (118 and 191) over the same 2 files at f1e39550, by §21c's counting rule, this form excluded. Reason: the first Amendment's, the third Amendment's Corrections, and the third Amendment's class 9. Count: `state/consults/gates/2026-10-03-subagent-write-audit-script-gate3-reviewer.md`.
- **S2-5 (D3):** `state/consults/gates/2026-10-03-subagent-write-audit-script-gate2-reviewer.md`, Checklist results item 1; at head, `state/consults/2026-10-03-subagent-write-audit-script-worker-report-5.md`, Live runs, and the gate-3 reviewer's report.
- **Gate 3:** `state/gate-log.json`, node subagent-write-audit-script, attempt 3, architect and reviewer.
- **Superseded index (D2), completing the third Amendment's:**
  - the Change line's PASS condition: by the third Amendment's class 9;
  - the second Amendment's "Final: 293 lines": by this Amendment's class 6;
  - line 5 of the test file at 8173b1e6: by this Amendment's class 3;
  - the third Amendment's "Nothing else is superseded" and its S2-5 sentences: by this Amendment.
- **Routed:** the first Amendment's "Mutations added", `DECISIONS-PENDING.md` entry "OPEN 2026-10-03 — the write-audit form's unclassed "Mutations added" bullet".
- **Follow-ups:** the third Amendment's two; the class-3 hash pin, carried by its PLAN node.
