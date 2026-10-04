*Custodian's filing note (2026-10-04): PR #172's gate 3, the architect, for PLAN node `evidence-recorder-v0`, under the tag node:evidence-recorder-v0@g4, by reference to the gate-2 reports, after correction round 2 of 2 (the last under the record cap). Reviewed: cut/evidence-recorder-v0 @ 2d95575ea8768e4eb32042dfb66e18ba08a5e6f5 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. Its sha256, from this file's line 5 to the end, is f170fb8c079441dfe9f1b4aa8c831cac31f1bd14a68ebfc59d720ddb1204e1d5. Write audit PASS: zero write calls (Read 7, Grep 14, the hand-back 1); the run lasted 15:01:50Z to 15:04:28Z. C3: the worktree is at 2d95575e; the main checkout's porcelain held only its two pre-existing untracked items before (15:00:33Z) and after (15:04:42Z), and main did not move. The architect read a byte-exact export of the head's `tools/mods/` tree at `C:/dev/wt/rec-head-2d95575e`. Profile paths redacted at filing: none.*

---

Reviewed: cut/evidence-recorder-v0 @ 2d95575ea8768e4eb32042dfb66e18ba08a5e6f5

**Verdict: PASS.** No record defect remains. G2-S1-1 and G2-N-1, which is also the reviewer's S2-A, are resolved by Amendment 3. G2-N-4 and the reviewer's N-B, N-C and N-D are resolved in the README. N-D is resolved with one residue, G3-N-1, which is a note. There is no new S1 or S2. The record cap's reduction does not apply, because nothing is left to reduce. The piece lands on its record as it stands after correction round 2 of 2.

**How I read it.**
- Branch files: from the export `C:/dev/wt/rec-head-2d95575e/tools/mods/`. Main-side files: from the main checkout.
- I used Read and Grep only, and made no write call.
- Left to the reviewer, who has Bash:
  - byte equality of the form's lines 1-497 with 609ab945, which shows Amendment 3 is a pure append. A spot check agrees: E5 at :343, §7's count line at :398, C2-d at :484 and Amendment 2's superseded index at :496 are where my gate-2 report cited them.
  - recomputing the README's two hashes at 884fc727;
  - the §7 recount;
  - CI at this head.

## Gate-2 findings, disposition

**Mine (state/consults/gates/2026-10-04-evidence-recorder-v0-gate2-architect.md)**
- **G2-S1-1: resolved.** Amendment 3's first row is at form :502.
  - It names the defect: §8 item 3's set (form :406) includes a network call, and the calls line lists only `$` members.
  - It gives the corrected reference. Network is ruled out by reading `hooks/register.js`, citing the gate-1 reviewer's reading of §8 item 3. That reading resolves to `state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-reviewer.md:101`, which finds exactly three `$` call sites and no network call. The `$` members are ruled out by the calls line at 2.1.289.
  - Checked against the code. A Grep of register.js at this head for `import`, `require`, `fetch`, `net`, `http`, `$[`, `globalThis`, `eval` and `Function(` returns no matches, which agrees with imports nothing and makes none, and with §2.0 (form :137).
  - The row widens my prescription from the `$.` items in §8 item 3 to every `$` member outside §2.0 (form :144). The evidence carries the wider form. The calls line names only §2.0's three members, and the reading independently finds no dynamic `$` access.
  - The tool claim names its build, 2.1.289, which meets round 15 (c).
- **G2-N-1: resolved.** Amendment 3's second row (form :503) puts the C2-a withdrawal in class 1 by round 15 (g). The superseded index (form :505) names the heading's class for that row.
- **G2-N-2: stands as a note.** The custodian applies C2-d's lower-bound reading to the brief's overhead measure.
- **G2-N-3: stands as a note.** It goes with the pre-E5 write-latency amendment, together with the reviewer's N-A.
- **G2-N-4: resolved** in the README. All of §1's limits are now there:
  - README:41 carries What a record proves (form :102);
  - README:46 carries E1's condition (form :108);
  - README:47 carries Loss (form :109);
  - README:48 carries Latency (form :112).
  - I checked §1's May-not-claim list (form :101-113) against README:3, :5, :29 and :41-51, and nothing is missing.
- **G2-N-5: stands as a note.** Amendment 3 also spells `hooks/register.js` relative to the mod folder. It resolves uniquely by §2.0's convention.

**The reviewer's (state/consults/gates/2026-10-04-evidence-recorder-v0-gate2-reviewer.md)**
- **S2-A:** resolved, as G2-N-1 above.
- **N-B:** resolved at README:46.
- **N-C:** resolved at README:48.
- **N-D:** resolved at README:72, which points the reader to §9 Operator and §7, where the 300 ms and 20% figures sit (form :385-386). It states no number and carries no hash. The residue is G3-N-1.
- **N-F:** void. Amendment 3 supersedes the sentence that carried it. `$.process.spawn` is now covered only by the generic row at form :502, which restates no claim of Amendment 1.
- **N-A, N-E and N-G:** stand as notes. The two commits do not touch them.

## Amendment 3 (checklist item 2)

- **Classes:** class 2 for the G2-S1-1 row, and class 1 for the class-label row by round 15 (g).
  - The G2-S1-1 row corrects the evidence sentence of a class-2 result row. Class 2 matches the practice in Amendment 2, which gates 1 and 2 accepted.
  - Class 1 would also fit, on (g)'s reading of a post-result record. Both are post-result classes, so neither label is a by-name failure.
- **Predictions:** none edited. §3, §4, §5, E5 (:343) and §7 (:385-398) are unchanged. The header says so.
- **Round 12 (d):** the G2-S1-1 row is two sentences, the defect and then the corrected reference with its proof. The class-label row is one sentence. Neither restates an earlier amendment's claim as standing; the first sentence of the G2-S1-1 row states the defect.
- **Round 12 (e):** the superseded index is present (:505), and it matches both rows.
- **References:**
  - Gate-log 392 and 393 resolve. They are `state/gate-log.json` entries 392 and 393, 1-based, on main: gate 2's architect FAIL and reviewer PASS at 609ab945, both with `record: true`.
  - Both gate-2 report paths are tracked on main.
  - §8 item 3, §2.0 and round 15 (g) all resolve.
  - The amendment has no hash reference, no bare self-line, no line cite into DECISIONS-PENDING.md, no pin read as current and no test-text span. Nothing in it is presented as a quotation.
- **Claims beyond the evidence:** none found.
- **Round 25, item 2:**
  - There is no §7 overrun. The total is 1120 of 1400 (1117 − 73 + 76, since README is new at the base), the worker's figure, which the custodian recounted. §7's line :398 is untouched.
  - There is no scope addition.
  - No record calls a `verify-mutation` run an observation.
  - This is not a five-line form.

## New findings

**G3-N-1 (N): the README does not carry C2-d's lower-bound reading.** README:48 withholds a latency figure only before E5. README:72 points to §9 and §7, but not to Amendment 2's C2-d. By C2-d (form :486), a p95 at or under the bound does not establish §1 claim 7, even after E5, until a write-latency amendment is made before E5. A README reader could take E5 as lifting the Latency limit. This is the same kind of gap as gate-2 G2-N-4's E1 point. It is not a by-name failure, because the README's list states what it does not claim and makes no false claim. The install sight carries it, as below. No further README round.

The README's two pins at :70 are byte-unchanged, per worker report 3 and the custodian's diff read. They moved from :69 because of the inserted line :48. Gate reports that cite README:69 are read at their own reviewed commit, so they are unaffected. §8 item 11 passes at README:41, and §8 item 16 passes at README:66. §2.10's list (form :232-237) is fully covered.

The rest of §9's Architect list stands by reference to my gate-1 and gate-2 checklists. `hooks/register.js` and the tests are unchanged, per the brief's diff and worker report 3.

## Closing record after the merge (references and hashes only)

1. The merge commit id. It must be a merge commit (§8 item 15), so that 9acc86b8, 32fc334f, 976e64cd, d48bedc4, 609ab945, f7dd269e and 2d95575e stay reachable from main.
2. Gate-log entries 390, 391, 392 and 393, and the two gate-3 entry numbers.
3. The six gate report paths under `state/consults/gates/` (gate1, gate2 and gate3, each with an architect and a reviewer report).
4. The PLAN node set done, with `{pr}` set only in the done commit.
5. Any later cite into Amendments 1 to 3 is pinned at the merge commit with a sha256, once the form's amended lines are on main (round 15 (e)).

## The human's install sight (form §9 Operator) should name, by reference

- Amendment 3 first, then Amendment 2 (round 12 (e): read the last amendment first).
- Amendment 2's C2-d, together with G3-N-1: E5 cannot establish §1 claim 7 until a write-latency amendment is made before E5. That amendment also covers G2-N-3 and the reviewer's N-A.
- The E-rows he allows to run (§9 Operator, form :454).

Files read:
- C:/dev/wt/rec-head-2d95575e/tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md
- C:/dev/wt/rec-head-2d95575e/tools/mods/spatial-evidence-recorder/README.md
- C:/dev/wt/rec-head-2d95575e/tools/mods/spatial-evidence-recorder/hooks/register.js (grep)
- C:/dev/spatial-ide/state/consults/gates/2026-10-04-evidence-recorder-v0-gate2-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-04-evidence-recorder-v0-gate2-reviewer.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-04-evidence-recorder-v0-gate1-reviewer.md (grep)
- C:/dev/spatial-ide/state/consults/2026-10-04-evidence-recorder-v0-worker-report-3.md
- C:/dev/spatial-ide/state/gate-log.json (grep)
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md (grep)
