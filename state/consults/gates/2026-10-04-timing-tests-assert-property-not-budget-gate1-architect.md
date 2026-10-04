*Custodian's filing note (2026-10-04): PR #174's gate 1, the architect, for PLAN node `timing-tests-assert-property-not-budget`, under the tag node:timing-tests-assert-property-not-budget@g1. Reviewed: cut/timing-tests-assert-property-not-budget @ b73e65d040ae66267e5bb49cb451d86bf2fef501 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. Its sha256, from this file's line 5 to the end, is 47a63fcdaa27f38b23057ff6d5d33cb68273a5065b36e7e51fa1c8a5c67e75dd. Write audit PASS: zero write calls (Read 21, Grep 13, Glob 1, the hand-back 1); the run lasted 20:41:32Z to 20:46:40Z. C3: the main checkout's porcelain held only its two pre-existing untracked items before (20:41:04Z) and after (20:46:51Z), and main did not move from 3831d4a9. The PR changes no code, so the architect read the worktree directly. Profile paths redacted at filing: none.*

---

Reviewed: cut/timing-tests-assert-property-not-budget @ b73e65d040ae66267e5bb49cb451d86bf2fef501

**Verdict: PASS.** Gate 1, architect, PR #174, node `timing-tests-assert-property-not-budget`, full gating. There is one S2 and five notes. No S1.

**How I read it.** I have no Bash, so I computed no hash and ran no suite. I confirmed the branch head by reading the reflog at `.git/worktrees/timing-pr/logs/HEAD`: the worktree went to 1c71ebaf, then commit b73e65d, so the branch's base is 1c71ebaf. The branch does not contain the Phase R consult or the S1 node. Both are on main only, added at 3831d4a9. So I cite the consult by section and the node by id and summary element, read at main 3831d4a9, with no line cites. The only line cites into the branch are `kernel/README.md:350` and `:373`, at b73e65d. Nothing below is a quotation. Everything is my paraphrase.

## S1 (blocking)
None.

## S2 (should fix; the PASS stands)

**S2-1. The S1 node's summary states the R-1 deadline without the instant it runs from (ADR-018 §1).** In node `data-plane-terminal-without-credit`, the opening clause gives R-1's result as no terminal within 60 s, and does not name where the 60 s starts. The consult names the start: the deadline runs from host.cancel's return (its §4 R-1 table column, and its §7 reading of H-S).
- This is not a printed figure under the form's §8 item 9. The 60 s is the declared RECV_DEADLINE, not a measured span.
- But it reads as a lower bound on cancel-to-terminal, so it needs its start instant.
- Fix: one phrase in the node summary, saying "of host.cancel's return". Make it in the done commit. PLAN.yaml is one of §7's four files.

## N (notes)

**N-1. Node element (v) and the node title.**
- Element (v) states §0.3's code reading as present-tense fact: the Failed item sits behind both queues, and the engine's send does not watch the token. Element (iii) reports R-1b's 0 batches between host.cancel's return and the terminal, in each of 11 attempts. So in these runs nothing was delivered ahead of the terminal. The queue half of H-S was not observed.
- The title says confirmed in scratch, which is §2's own label for S1.
- Neither breaches §8 item 8. (v) is attributed to §0.3, whose heading marks it a hypothesis. I drafted §2 (v)'s wording myself. And the consult's §7 reading disclaims any statement about where an item was held.
- When the data-plane form is drafted, it should treat (v) as read from code, not observed.

**N-2. Element (ii) states a general conclusion.** It says a normal completion also waits for one credit beyond the last batch. R-3/R-3b observed exactly that, but on the synthetic source, in scratch, at 1c71ebaf. Under the form's §1, this is evidence carried to the data-plane form, not this piece's claim. The data-plane form should keep that scope.

**N-3. For the data-plane drafting, not this gate.** R-1c, the unmodified skp test, passed 20 of 20 at 1c71ebaf.
- Round 51, item 2 keeps that test unchanged as the remedy's end-to-end proof.
- But the test passes most of the time even without the remedy. So the data-plane form's §4 needs a test of record whose mutation, reverting the remedy, fails it deterministically. R-1's shape is the one that fails every time.

**N-4. The tester's disclosures. Neither bears on a row.**
- **R-3b made from R-3's edit with no revert.** The R-3b diff in the consult's §3 is the whole difference from 1c71ebaf. It differs from R-3 in three lines: the index line, the grant (12 to 13) and the label. That matches §2's description, as R-3 with credit 13, so §5 invalidator 1 is not met. The consult's §1 opening says every variant was reverted before the next. That sentence is inexact for R-3 to R-3b, but §8 sentence 1 discloses the departure, and the consult is evidence filed byte-identical. Recorded here only.
- **The wider tree check was non-empty.** The cause is my drafting: §2's command included `kernel`, and §8 item 1 required the form, under `kernel/`, to be committed before Phase R. So the check could never come back empty. The consult showed the only changed path is the form. The diff narrowed to the pinned paths, and the numstat over `*.rs`/`*.toml`, are both empty, and §0.3 cites no part of the form.
  - Every pinned span is therefore byte-identical at 02dfcff3 and 1c71ebaf. The pin and the tree agree, so neither needs naming as authoritative (round 14). §5 invalidator 2's purpose holds, and the consult is not void.
  - Reviewer: confirm that `git diff --stat 02dfcff3 1c71ebaf` lists only the form under kernel/, engine/ and protocol/.
  - Under the record cap this is no new clause.

**N-5. Two bare line cites in the consult.** It cites `protocol/data-plane/src/wire.rs:37` with no commit, and the form's `skp_admission.rs:906` "at 02dfcff3" with no hash. Both resolve. wire.rs:37 is TERM_PRODUCER_FAILED = 2 at main, and the code tree is unchanged since 02dfcff3. :906 is §0.2's own pinned line. Neither is a self-line, nor a line in a file the same commit edits, so round 14's rule does not fail them by name.

## Checklist (form §9, Architect)

**§21a and the form choice.**
- Full form and full gating were correct at dispatch. The piece concerns a cancellation guarantee and a property under test (§21a, fourth category), and its outcome routes into the data plane. Under round 25, item 2 (e), an Out-of-scope line would have named a §21a category, and no five-line form was committed.
- After S1 the piece still commits no code, and the full form stands. The PR diff is two lines of `kernel/README.md`: `:350` (Last verified at 1c71ebaf) and `:373` (the new bullet). Both are .md lines outside kernel/src and kernel/tests.

**ADR-018 vocabulary.**
- Consult: each stamp is named by its event, CANCELLATION_REQUESTED or PRODUCER_CANCELLED. Each is an offset from the start of one trace clock, and §2 Method says so. No gap is computed or judged. The deadline is named from host.cancel's return. "Acknowledged" does not appear.
- Node: elements (ii) to (v) pass. The opening clause is S2-1.

**Round and item cites, each resolved against its RULED block.**
- Round 25, item 1 (a): the slice.rs-precedent ruling on the timing tests.
- Round 25, item 2 (c): the mutation-observation wording, in the template's Round 25 additions.
- Round 31, item 1: the placement round. The timing node is position 11 in `state/questions/round-31.md`'s list, and position 12 by PLAN.
- Round 43, item 2: drafting returns to the architect.
- Round 51, items 1, 2 and 3: reproduce first, the data-plane piece on S1, the publish half closed. The node's "round 51, item 2" resolves to item 2's Applied text.
- All resolve.

**§8, item by item.**
1. Pass. Phase R ran at 1c71ebaf, which descends from the form's commit e582d79f.
2. Pass. The PR adds no code line. The reviewer confirms with §7's numstat.
3. Pass. There is no diff under kernel/src, kernel/tests, engine, protocol or frontends.
4. Pass. The node is status proposed, carries (i) to (v), and has no code on the branch.
5. Pass. There is no publish variant.
6. Pass. Every row has its diff and the commit 1c71ebaf. No run failed, and the 20 timed-out logs are filed verbatim anyway.
7. Pass. The consult's §8 resolves nine summary sentences against the run logs. See N-4 for its §1 opening sentence.
8. Pass. The consult's §7 limits H-S to R-1/R-1b, in scratch, at 1c71ebaf. It claims no fix, and it says the CI failure at :906 was not reproduced unmodified. See N-1.
9. Pass for printed figures. See S2-1 for the node.
10. Pass. The consult's header disclaims test-of-record and mutation status.

**Does S1 follow §5's condition exactly? Yes.**
- R-1's terminal prediction held in 10 of 10 runs: no terminal in the 60 s after host.cancel's return.
- R-1b's TERM_PRODUCER_FAILED held in 10 of 10 runs, across 11 attempts. Run 6's ordering-race retry also gave code 2.
- The rows that do not route all held, so no class-2 carry is owed.

**needs_human `{kind: ruling, minutes: 15}`: sound.**
- ADR-012 is Proposed, so the remedy's shape may need the human's decision (round 51, item 2).
- The node is never queued until the human places it.
- The kind is a valid value; six nodes use it.

**Round 25, item 2 fail-by-name list.** No §7 overrun: zero code, and the four named files. No scope addition. No verify-mutation wording. No test-text row pinned at a branch commit. No five-line form. Nothing trips.

**Also checked.** Seams: none, since there is no code. Verbatim quotes in the diff or the node: none. Element (iv) checked against `frontends/shell/src/streaming/adapterWs.ts` at main: CREDIT_WINDOW is 4 at :13, the grant at start is at :54, and the top-up at or below half is at :122. It matches, as read and not run.

## Closing-record list (D-4), after the merge

References and hashes only. Use full commit ids from `git rev-parse`; the short ids below are placeholders. Every rev is on main (round 15 (e)).

1. §10 Amendment 1. Its first line says it was written after Phase R's outcome was seen (the form's header rule). It is class 1, a post-result record.
2. D-1: `state/consults/2026-10-04-timing-tests-reproduction.md` @ 3831d4a9 sha256:<the whole file at that commit>. File-level, no line.
3. D-2: S1, node `data-plane-terminal-without-credit` (PLAN.yaml @ 3831d4a9), by node id. No line, because the done commit edits PLAN.yaml (round 14).
4. D-3: §2, the publish paragraph, by section, done at e582d79f.
5. The PR: #174, its merge commit id. `kernel/README.md` by file @ that merge commit.
6. The gate reports by path: this report and the reviewer's, under `state/consults/gates/`.

**The done commit, in PLAN.yaml:**
- Node `timing-tests-assert-property-not-budget`: status done, dates.done, and the evidence pr set only in this commit.
- The S2-1 phrase in node `data-plane-terminal-without-credit`.
- Node `timing-assertions-under-contention` depends on this node. Re-check its blocked status.

**Files:**
- `C:\dev\spatial-ide\kernel\TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`
- `C:\dev\spatial-ide\state\consults\2026-10-04-timing-tests-reproduction.md`
- `C:\dev\spatial-ide\PLAN.yaml` (node `data-plane-terminal-without-credit`)
- `C:\dev\wt\timing-pr\kernel\README.md`
