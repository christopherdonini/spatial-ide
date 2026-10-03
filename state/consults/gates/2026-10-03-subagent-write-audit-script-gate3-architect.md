*Custodian's filing note (2026-10-03): the gate-3 architect for PR #167 returned this report as its final message; the architect agent type has no Write tool. The custodian saved the hand-back text, with the harness's indentation removed, and committed it as saved, below the rule. The hash of record, from this file's line 5 (the report's first line) to the end, is a9263981f9aa5d467574348f74e853ed42c8b13b97974db65ef59e23b5cbe404, computed by the custodian; the agent returned "sha256: not computed". Write audit PASS: zero write calls and no shell call (Read 14, Grep 5, Glob 1). C3: both worktrees were clean before and after; in the main checkout the only differences were the custodian's own commit 09992021, made during the run. The reduction under its Judgment 6 is appended to the form as written (its condition C5).*

---

VERDICT: PASS
Reviewed cut/subagent-write-audit-script @ f1e39550. PR #167, gate 3, architect.

This PASS has conditions. The piece lands only once conditions C1 to C5 below hold and the reduction under Judgment 6 has been appended to the form exactly as written. Three record defects remain (D1 to D3), and one of them, D1, is a round 25, item 2 failure by name. This was the last correction round under the record cap's item 3 (`state/directives/2026-09-18-record-cap.md`), so these defects go into the reduction and do not open a third round.

This was a read-only run, with no write call and no shell call. I read the branch files in C:/dev/wt/write-audit at f1e39550, and the main-side files in the main checkout. I recomputed no hashes and checked no commit's contents, because I have no git. Every "at <commit>" below is the record's own claim, or the gate-2 reviewer's.

## S1 (blocking)

The code has no blocking defect. The record has three. Under the cap, the reduction (Judgment 6) carries them, not a third round.
- **D1 (round 25, item 2 (d), a failure by name).** The third Amendment's Corrections bullet changes a claim in a test comment: "The script's header list of VOID cases and the test file's "T1-T8" header are updated with this Amendment's code."
  - That is class 3's test-text exception (template §10, class 3): "a record correction that changes a claim living in a test comment or an operator-facing test string is class 3, recorded by row with the superseded span pinned."
  - The span exists only on the branch. Its row must name it "by that commit's id until merge, in words and with no hash: lines <a>-<b> of `<path>` at `<commit>`." (template, Round 25 additions).
  - The row names it without a commit id.
  - The span is line 5 of `scripts/hooks/subagent-write-audit.test.mjs` at 8173b1e6. That location is from the gate-2 reviewer's S2-4. The gate-3 reviewer confirms it with `git show`.
- **D2 (round 12 (e)).** The superseded index ends "Nothing else is superseded." That is false. It leaves out three supersessions that the same round makes:
  - the Change line's PASS condition, narrowed by the class-9 addition ("This narrows the Change line's PASS");
  - the second Amendment's class-6 "Final: 293 lines", which the third Amendment's code makes no longer final (309 at f1e39550, by worker report 5's numstat);
  - the D1 span.
- **D3 (round 7, by its reading).** The third Amendment says: "The custodian's re-run of the four at 8173b1e6 gave PASS, PASS, VOID (its Bash calls) and PASS. That covers the architect's S2-5."
  - The run names no report, so the discharge has no proof a gate can resolve.
  - S2-5 is proved elsewhere: by the gate-2 reviewer's report, Checklist results item 1 (three ids at 8173b1e6), and at head by worker report 5's "Live runs" (four ids at f1e39550), which the gate-3 reviewer re-runs.

## Judgments

**1. Gate-2 items.**
- S1-1 is resolved: the index exists. Its incompleteness is D2.
- S1-2 is resolved. The class-3 bullet names the tool commit, 7d24ed15, by reference to the gate-1 reviewer's Exit codes.
- S1-3 is resolved:
  - the sibling search is recorded;
  - option (a) is taken as class 9;
  - the code, T10 and M10 are present.
- S2-1, S2-2, S2-3 and S2-4 are resolved in the third Amendment's Corrections, class-1 and class-3 bullets.
  - S2-2's final figure is deferred to the closing record. The reduction carries it.
- S2-5 is discharged in substance by the reports named under D3. The record's own claim of it is D3.
- The gate-2 N items:
  - N-1: worker report 4 was committed at 50331054 (gate-2 reviewer, S2-2).
  - N-2: PLAN generation is 4.
  - N-3: the test header at f1e39550 line 5 is corrected.
  - N-4: the PR body is the reviewer's to check.

**2. Class 9.**
- The class is right.
  - The addition adds work: a void, a test and a mutation. Class 9 says it is "Not class 5, which narrows."
  - It is not class 1, because it changes the Change line rather than bringing the code to it.
  - It is not class 4, because it is not only a mutation.
- §14's sibling search is a standing rule that found the sibling. The ruling's "anything else voids the run" supports the same reading.
- The declared shape, against template class 9 ("its §2 shape, its §4 tests each with a mutation, what §5 declares unchanged and what would invalidate it, and its §8 and §9 items"):
  - §2: "The change".
  - §4: T10 with M10.
  - §5: "Declared unchanged" and "The invalidator".
  - §8: carried by the invalidator's stop.
  - §9: "The gate-3 reviewer re-runs them at head."
  - This is adequate for a short form.
- The code matches the declaration:
  - `READ_TOOLS` at `subagent-write-audit.mjs` line 35;
  - the void naming the tool at lines 110-111;
  - T10 asserts status 1, VOID and /Agent/;
  - M10 was observed at 18715e4b, the commit that holds the mutated code, and recorded at f1e39550;
  - T1 to T9 use only listed tools, so they are unchanged (worker report 5: 10 of 10 pass).
- **"Before any code" is unverified by me. It is condition C1.**

**3. The superseded index.**
- All nine rows point at text that exists:
  - second Amendment: "class 6", the fallback, the class-4 bullet, the Out-of-scope line as corrected;
  - third Amendment: class 3, class 1, "did not hold at dispatch", the class-1 parse-void bullet, "This replaces the second Amendment's reason".
- The index is incomplete (D2).

**4. The allow-list against the ruling.**
- It is consistent with the ruling. The ruling's words are "every Write call in lead-data's" … "anything else voids the run" (`state/directives/2026-10-03-write-audit-ruling.md`, lines 7-8). An allow-list is the strict reading of "anything else", and the ruling asks the same audit of architect runs.
- `Read`, `Grep` and `Glob` cannot write.
- `SubagentHandback` returns a message, which the custodian files. It writes nothing to the tree.
- It fails closed:
  - unknown, undefined and wrongly-cased names void;
  - `mcp__*`, `Agent`, `Task`, `TodoWrite` and `WebFetch` void;
  - a write with no path voids, because '' never equals the allowed path.
- My own run uses only listed tools.

**5. The narrowed OPEN entry.** It is right.
- After Judgment 3, only "Mutations added" fits no class.
- The recommendation (no new class) agrees with the record cap's item 2.
- Landing does not wait on the ruling, because the entry touches no line of the form. The closing record cites the entry by its heading, since it has no round or entry number yet.

**6. Landing conditions and the reduction.**
- **C1.** The gate-3 reviewer confirms two things: the commit that adds the third Amendment is an ancestor of 18715e4b, and `git diff 18715e4b~1 f1e39550` does not touch the form. Worker report 5 gives its base as ef3734af and says "The form was not edited."
- **C2.** The gate-3 reviewer recounts 309 (118 + 191) at f1e39550 by §21c's rule, and re-runs the four live ids at f1e39550 against the invalidator.
- **C3.** Worker report 5 and both gate-3 reports are committed on main before the reduction cites them. Worker report 5 is untracked on main now.
- **C4 (round 25 (d)).** The PR merges as a merge commit, never a squash. The PR body names the class-3 row. The node carries `merge: merge-commit` (AUTONOMY.md §27). A new PLAN node, blocked on this piece, carries the post-merge row `scripts/hooks/subagent-write-audit.test.mjs:5 @ 8173b1e6 sha256:<hex>`.
- **C5.** The custodian appends the block below to the form exactly as written. No other edit is made. The gate-3 reviewer, or a scoped read, confirms the bytes.

The reduction, for the custodian to append exactly as written:

```
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
```

If the gate-3 reports are filed under other names, the custodian corrects only those two paths and says so in the filing note.

## Closing-record list (what the closing record must reference)

The appended reduction above, which carries:
- the gate-2 and gate-3 reports and their gate-log records;
- worker report 5;
- the final figure, 309 at f1e39550;
- the class-3 row in words at 8173b1e6;
- the completed index;
- the OPEN entry;
- the follow-ups.

Its post-merge PLAN node carries the hash pin.

## S2

- S2-1. Class 9's first line cites "AUTONOMY.md §14". Class 9 asks for round and item, or the directive's path. §14 predates question rounds, and its source is AUTONOMY.md Appendix A, so the cite is a path form. It is acceptable; no change asked.

## N

- N-1. The sibling search says "an item that is not a `tool_use`" carries no tool call. That is loose for `server_tool_use` items (server-side web tools), which line 101 skips. They cannot write locally, so this is a note for the follow-ups only.
- N-2. The OPEN entry's Context bullet 2 ("class 2 needs a §3/§5 prediction, which a five-line form does not have") contradicts its own Narrowed bullet. It is ledger status prose (§22), so it can be edited in place.
- N-3. The gate-2 reviewer's N-3 asked that the PR body's "An audit that cannot see everything never passes" be narrowed to the transcript read. With the allow-list, the claim now holds for the transcript read. The PR body is the reviewer's to check.
- N-4. Lead-data runs as a general agent, so `TodoWrite` and similar tools will void. That is a false VOID, which is the safe direction. It is noted for dispatch briefs.

Files: C:/dev/wt/write-audit/scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md, C:/dev/wt/write-audit/scripts/hooks/subagent-write-audit.mjs, C:/dev/wt/write-audit/scripts/hooks/subagent-write-audit.test.mjs, C:/dev/spatial-ide/state/consults/2026-10-03-subagent-write-audit-script-worker-report-5.md, C:/dev/spatial-ide/state/consults/gates/2026-10-03-subagent-write-audit-script-gate2-reviewer.md, C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md, C:/dev/spatial-ide/PLAN.yaml

sha256: not computed
