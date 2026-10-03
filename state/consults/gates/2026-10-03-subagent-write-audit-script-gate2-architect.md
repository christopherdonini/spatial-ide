*Custodian's filing note (2026-10-03): the gate-2 architect for PR #167 returned this report as its final message; the architect agent type has no Write tool. The custodian saved the hand-back text, with the harness's indentation removed, and committed it as saved, below the rule. The hash of record, from this file's line 5 (the report's first line) to the end, is ceda871621400fbe73d3e176f976143ce7de2a818c0b3166b58710d2f1611149, computed by the custodian; the agent returned "sha256: not computed". Write audit PASS: zero write calls and no shell call (Read 16, Grep 11, Glob 2). C3: the worktree was clean before and after; in the main checkout the only differences were the custodian's own staged files, and the only moved ref was node 9's branch, pushed by its worker.*

---

VERDICT: FAIL
Reviewed cut/subagent-write-audit-script @ 8173b1e6. PR #167, gate 2, architect.

Read-only run, with no write and no shell call. The branch files were read in C:/dev/wt/write-audit at 8173b1e6. The main-side files (AUTONOMY.md, docs/PREREGISTRATION-TEMPLATE.md, DECISIONS-PENDING.md, the ruling, the gate-1 report, worker reports 1-4, state/drafts/weekly-window-2026-10-09.md, and #166's gate-2 architect report) were read in the main checkout during this run. Its HEAD was 14a9636f at session start, and DECISIONS-PENDING.md changed while I was reading it: the OPEN entry for S2-3 appeared. I recomputed no hashes and checked no commit's contents, because I have no git. Every "at <commit>" below is the record's own claim, not something I verified.

## S1 (blocking)

**S1-1. Correction round 1 has no superseded index.** Round 12, item (e) requires one, and the gate fails its absence by name.
- The second Amendment is correction round 1 (the PLAN summary on main says "Correction round 1"). Its last bullet is "Worker report 4", not an index.
- It supersedes at least four things, two of them only in passing:
  - the first Amendment's class-8 label;
  - "falls back to the script's directory";
  - the Out-of-scope line's single-gate clause;
  - the first Amendment's "so that every new test has a recorded mutation".
- That last clause was false when it was written at e5f3fd5f (gate-1 S1-2). The class-4 bullet adds M7-M9 but never says the earlier clause was false.
- Fix: end the round with a superseded index that names all four.

**S1-2. A tool claim without the tool's commit.** Round 15 (c) applies, and the gate fails this by name.
- The first Amendment says: "At 8d296b9c it is rc 1, with 5 of 7 new tests unrecorded."
- 8d296b9c is the head that was checked, not verify-mutation's commit.
- Fix: a one-sentence class-3 correction that names the tool's commit. The gate-1 reviewer's Exit codes section reproduces this result and gives the tool commit as 7d24ed15.

**S1-3. The reason given for not taking S2-4 conflicts with the record, and the fix has no recorded sibling search.**
- The second Amendment's reason: "The Change line defines the verdict by the write and shell tools, and no granted tool list reaches another tool today."
- The record says otherwise:
  - Node 9's lead-data draft 1 was dispatched today, and "so it ran as a general agent on opus under the agent file's body" (`state/drafts/weekly-window-2026-10-09.md:99`). A general agent's transcript can hold tools that are on no tools line.
  - #166's gate-2 architect recorded: "While lead-data runs as a general agent, the audit is the only thing limiting its tools (N3)." (`state/consults/gates/2026-10-03-lead-data-pilot-setup-gate2-architect.md:68`)
  - SubagentHandback is on no agent's tools line, yet it appears in all three live transcripts (worker report 2).
  - So the tools lines do not bound what a transcript holds.
- The script's own principle covers this gap. Paraphrase of `scripts/hooks/subagent-write-audit.mjs:24-25`: the audit cannot see a write made through a shell, "which is why any shell call voids the run". A tool outside both lists is the same unseen class, and today it passes silently.
- §14 requires "On every fix: a **sibling search** (the same defect class elsewhere, by grep and by reading the sibling sites, recorded in the piece's notes)". The S1-3 fix (fail-open on an unparseable line) records none, and its nearest sibling is exactly this fail-open on unclassified tools.
- Fix, either way:
  - (a) Declare an allow-list void (any tool outside a named read-only set plus the write and shell lists voids the run), with a test and its own mutation. This changes the Change line's verdict, so it is declared before any code.
  - (b) Replace the reason with one that holds (for example, a dispatch rule that lead-data and the architect run only as their own agent types, if the custodian adopts it), and record the sibling search with S2-4 as its named follow-up.
- This is the piece's second and last record-correction round under the record cap. After it, the architect reduces the record to references.

## Judgments

**1. The ruling.**
- The ruling's words are "every Write call in lead-data's" … "anything else voids the run" (`state/directives/2026-10-03-write-audit-ruling.md:7-8`), plus the same audit for architect runs (line 9).
- The ruling as applied (question round 41, item 3, Applied): "Every write-capable call must target exactly the brief's report path; for the architect, no write-capable call is allowed. Anything else voids the run."
- The script meets this for all six named tools, and it fails closed in each of these cases:
  - a write with no path;
  - NONE (the architect case);
  - a shell call;
  - an unparseable line;
  - a missing or empty transcript;
  - zero tool calls.
- Neither the ruling's words nor the Change line names an allow-list, so the ruling does not require S2-4 as such. What blocks is the false reason (S1-3).
- N-2 is consistent with the ruling. A non-ENOENT read error exits 1 with no JSON, and that cannot PASS. It may stay a follow-up.

**2. The gating record.** The handling is correct.
- Class 6 states the remedy itself: "mid-piece clause says and the architect gate is taken; the short form stays."
- Superseding the class-8 label is right: "Class 6 stays the short form's budget class".
- The final figure fits the files as read. At 8173b1e6 both are new files, of 114 and 179 lines, which is 293. Whether 8173b1e6 touches only the form is the reviewer's numstat to confirm.
- Notes:
  - The overrun was not discovered mid-piece. §21d's template line is "Scope: <files, <= 8; declared line budget, <= 150 non-generated>", so the form was malformed when it was committed. Using §21b's mid-piece clause is still the only remedy that never writes a full form after the code, and the amendment discloses the error.
  - The Out-of-scope line is not to be rewritten. Round 25 additions: "a five-line form already committed is not rewritten". But "The Out-of-scope line's single-gate claim no longer holds" should say the claim never held. Its cite, "the single reviewer gate applies (round 25, item 2 (e))", misreads (e), which governs §21a categories, not size. The line's four category assertions still hold (Judgment 4). (S2-1)
  - Class 6 requires "the reason" for the overrun. The class-6 bullet gives the reason the route closed, not why 250 became 293 (T8, T9, M2-M9, the common-dir resolution, the parse void). A reference to the class-4 bullet and the first Amendment's reason would carry it. (S2-2)

**3. The amendment classes.** Routing to the human is permitted, but one bullet has a fitting class.
- "A record finding" fits class 1: "Records what the result was and what, if anything, it invalidates." It records worker report 1's rc 0 and what invalidates it, on the reading confirmed in round 15 (g). The first Amendment's first line already carries class 1's convention ("a post-result amendment").
- "Mutations added" fits no class cleanly. Class 4 is "A mutation added or corrected after a gate finding", and no gate had run. Routing it is right.
- A correction to the routing premise (from gate-1 S2-3 and the OPEN entry): the template says "A short-form piece that needs an amendment uses the same five classes above". So class 2 is not barred from a short form; it reads against the Change line. That is how the first Amendment's "Class 2, the slug" stands.
- The second Amendment files the S1-3 behaviour fix under class 4. That fix is a post-result change that brings the code to its Change line, which is class 1 by round 15 (g); class 4 covers M6. (S2-3)

**4. §21a.** None of the four categories applies.
- No ADR status line or amendment.
- No ADR-020, ADR-009 or ADR-021 surface. The header is AGPL SPDX, there is no network, no export, and only a fixed-argument `execFileSync('git', ['rev-parse', '--git-common-dir'])`.
- No SKP or MCP surface.
- No product guarantee or invariant is changed. The audit is governance tooling, not one of §21a's listed guarantees.
- The question is moot for routing: full gating already applies by size.

**5. AUTONOMY §14 (mutations).** Each of the nine tests has a recorded mutation of its own:
- T1 M3, T2 M4, T3 M5, T4 M7, T5 M1, T6 M8, T7 M9, T8 M2, T9 M6.
- Caveats:
  - M2 fails T8 only from a worktree. This is disclosed.
  - M1's and M2's "observed at" commits (8715ad1b and 8d296b9c) are bases at which the mutated code was not yet committed. Under round 25 (c), the gate-1 reviewer's re-observations at 7a9784cb are their observations of record. The second Amendment names this for M2 only. (S2-4)
- The §14 sibling search is missing (S1-3).

**6. Other constitution checks.** Nothing further blocks.
- Pure read-only operation (ADR-006 pure).
- No perf claim.
- Placed in scope by question round 42, item 3.
- No `export` and no option without a caller. The `--session` option is used by the custodian and by the live seam runs.
- The messages state only the script's own facts.

## S2

- S2-1: "no longer holds" should be "did not hold at dispatch", and the round 25 (e) cite should be named as misapplied.
- S2-2: the class-6 reason for the delta from 250 to 293 is missing.
- S2-3: the S1-3 behaviour fix is class 1, not class 4.
- S2-4: name the gate-1 reviewer's 7a9784cb re-observation as M1's observation of record, as was done for M2.
- S2-5: the live real-shape seam proof (gate-1 Checklist 4) predates the parse void at 1202bf4e. Re-run the three live agent ids at head to show that the new void does not fire on real transcripts. This is the reviewer's to do in gate 2.

## N

- N-1: worker report 4 is untracked on main at session start. Commit it before the merge, since the second Amendment cites it.
- N-2: PLAN `generation` is still 1 after two amendments (§15).
- N-3: the test file's header says "T1-T8", but T9 exists.
- N-4: I cannot read the PR body here. Gate-1 found its "(M1 to M5)" claim false, and the reviewer should confirm it is corrected.

Files: C:/dev/wt/write-audit/scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md, C:/dev/wt/write-audit/scripts/hooks/subagent-write-audit.mjs, C:/dev/wt/write-audit/scripts/hooks/subagent-write-audit.test.mjs, C:/dev/spatial-ide/state/drafts/weekly-window-2026-10-09.md, C:/dev/spatial-ide/state/consults/gates/2026-10-03-lead-data-pilot-setup-gate2-architect.md

sha256: not computed
