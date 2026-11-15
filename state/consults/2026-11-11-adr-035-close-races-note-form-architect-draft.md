*Custodian's filing note (2026-11-11): the architect's draft of the form for PLAN node adr-035-close-races-note, from its hand-back (24522 bytes, sha256 50b9f97a826f2e2c5f7bf2d21c59d1a0e94435f659dead99b959d2b269637159), below the rule unchanged; one final newline is added. Its brief by file (4297 bytes, sha256 1d061492b90bd7c24ea429af4c4924cf441314d1f0f46150af3d05249dd0cfdc); the run 2026-11-11T17:59:55.847Z to 2026-11-11T18:05:11.284Z by its transcript, 40 calls (Read 20, Glob 3, Grep 16, the hand-back), none errored, none writing, model claude-opus-5-5. A draft, a reading and not Authority: the form is not committed and nothing is dispatched. Its OPEN-1 is a red line (ADR notes): it says the note's item 2, on Decision 2's mint-race arm, rests on code in which that arm is still present. The custodian read the same at main 09bafc87, by script: the refusal arm is still in viewport_query_attribute in kernel/src/skp.rs, and the follow-ups form's Amendment 2, item 7, already corrected the same premise. It goes to the human for a typed answer before any dispatch, with no replacement words. Its OPEN-2, the form's location (governance/forms/root/), is not a red line and takes the draft's recommendation (the 2026-10-31 directive, item 4, held to 2026-11-16), recorded here with the date.*

---

Drafted: adr-035-close-races-note form

Read only, at main c1aea32a166ef9727b059d3038a559181df0a86d. I wrote no file. Every `<H>` is the custodian's to compute: sha256 over the cited whole lines as committed, LF bytes. I have no shell, so I leave no background shell.

**Before you dispatch, one thing.** When I looked up the code behind item 2's third passage (Decision 2's mint-race arm), I found that the arm the passage calls gone is still in the tree at C. The refusal arm in `SkpHost::viewport_query_attribute` is still there (`kernel/src/skp.rs:1522-1548`). Test CR3 drives it in a close race (`kernel/src/skp.rs:4704-4758`). A product comment names it as the mint-race arm (`frontends/shell/src/streaming/liveTicketSet.ts:72-74`). A filed closing record has already corrected the same premise, which came from N4 (`governance/forms/kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:365`). I do not grade the clause: that is the gate's job, and the words are red-line text, so I give no replacement words. It is OPEN-1 below.

```markdown
# ADR-035's appended note in the human's words: what kernel-generation-close-races makes historical (PLAN node adr-035-close-races-note). Preregistration (full form)

File: governance/forms/root/ADR-035-CLOSE-RACES-NOTE-PREREGISTRATION.md, committed on main by the custodian before any code.

**Authority.**
- The node: `governance/PLAN.yaml:3245-3261 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` (depends_on kernel-generation-close-races, done, PR 136, `governance/PLAN.yaml:2334-2350 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; and adr-020-appended-note).
- The ruling and the words: the human's message of 2026-11-11 (17:25Z), item 1, at `state/directives/2026-11-11-adr-035-and-adr-029-notes-in-the-humans-words-table-as-consult-s3-waiting-on-you-open-questions.md:9 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` (the item) and `:11-17 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` (the words). Below, "the directive" is this file.
- What owes it: Advisory N4 of the close-races gate-1 architect report, `state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-architect.md:41-46 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`.
- Red line: `governance/AI_DEVELOPMENT.md:451-454 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` (ADR statuses and amendments). §31's replacement route does not apply to red-line text (`governance/AUTONOMY.md:544 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- Verdicts: proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). A clause's truth is Correctness.
- Reuse index (the standing step), byte for byte as the custodian's brief carried it. The query misses; the miss is noted and does not block. The prior art in the tree is the ADR-017 note form (`governance/forms/root/ADR-017-NOTE-PRODUCT-REDACTION-GATE-PREREGISTRATION.md`), the ADR-020 note form (`governance/forms/root/ADR-020-APPENDED-NOTE-PREREGISTRATION.md`) and ADR-035's own Note of 2026-09-25.
  $ node tools/reuse.mjs adr appended note close race generation
  No prior art recorded for "adr appended note close race generation". Research it before planning an implementation.
  rc=1

**Drafted by** the architect, read only, at main c1aea32a166ef9727b059d3038a559181df0a86d (C). The note's words are the human's. Every other word of this form is the architect's.
**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
**Gating: full form, both gates from dispatch** (§21a, `governance/AUTONOMY.md:315-332 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; §25 (e), `governance/AUTONOMY.md:482 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- The piece appends a dated note to an Accepted ADR, which is an ADR amendment (`governance/AUTONOMY.md:319-320 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- Its item 3 restates an at-most-once emission property that is under test (`governance/AUTONOMY.md:325-327 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). It does so as text, with no code.
- So no Out-of-scope line could assert that the piece touches none of the four categories. No five-line form is committed. Dispatching on one would fail by name (round 25, item 2).
- By size the piece is under §21c (`governance/AUTONOMY.md:347-357 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- Out-of-scope, the four categories:
  - ADR: touched (ADR-035, appended only, its Status line unchanged).
  - Security posture: not touched.
  - Data plane and wire: not touched.
  - Stated guarantee: touched, as documentation only.

## §0. Disclosure
- Inputs read at C:
  - the node;
  - the directive;
  - ADR-035 whole;
  - N4;
  - §21a to §21d and §25 (e);
  - the ADR-017 and ADR-020 note forms;
  - `kernel/src/skp.rs` at the spans in §2.2;
  - `frontends/shell/src/streaming/liveTicketSet.ts:66-79`;
  - the close-races follow-ups form's Amendment 2.
- No fixture, no run, no measurement.

## §1. May and may not claim
- May claim:
  - ADR-035 at B is a byte prefix of ADR-035 at H;
  - the bytes appended are one line feed followed by the directive's lines 11 to 17, byte for byte;
  - each clause holds as the gate finds it at B, or as the human's recorded answer states.
- May not claim:
  - any change to ADR-035's Decisions, its Status line, its Acceptance section or its Note of 2026-09-25;
  - any code, test, wire or measurement change;
  - that a clause the gate sends to the human is true before the human's answer is recorded.

## §2. The change
2.0 Rules.
- (a) A single append at ADR-035's end. Nothing above it is edited.
- (b) The appended text is exactly the human's lines, unwrapped, as ADR-035's own long lines are. It carries no pin, no path:line cite, no comment and no added word.
- (c) No line of it begins with `Status:` or `**Status:**`.
- (d) If ADR-035 at B does not end in a line feed, holds a CR byte, or ends with a blank line, the worker stops (§5).

2.1 The bytes. One line feed, then the directive's lines 11 to 17, each with its line feed, copied by script from the directive at B. The directive is on main from C. The worker makes one Edit:
- `old_string` is ADR-035's last line at B, with its final line feed (at C that is :158);
- `new_string` is the same text followed by those bytes.

2.2 The clause list. Each line is one clause of the directive's :11-17. Labels are mine (paraphrase, not quotation). The spans are where each clause rests, and they are not graded here. The gate grades each one at B (§9).

| # | Clause (paraphrase, label mine) | Rests on |
|---|---|---|
| H.1 | heading: what the named piece makes historical | `governance/PLAN.yaml:2334-2350 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; items 1 to 3 below |
| I.1 | italic line: appended on the human's ruling | the directive :9 (above) |
| I.2 | italic line: the text above is unchanged, Status line, Acceptance section and the 2026-09-25 Note included | E2 at H; `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:3 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, `:141-147 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, `:149-158 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 1.1 | the close race the 2026-09-25 Note's item 3 left unsettled | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:157 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 1.2 | is closed by kernel-generation-close-races, PR 136 | `governance/PLAN.yaml:2343-2344 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; tests CR1 to CR4, `kernel/src/skp.rs:4502-4758 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 1.3 | merged 2026-09-28 | `governance/PLAN.yaml:2350 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; E12 |
| 1.4 | since that merge only `open_dataset` creates a live generation, through `mint_for_open` | `kernel/src/skp.rs:574-593 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` (the only `live.insert` outside `#[cfg(test)]`, :583); its callers `kernel/src/skp.rs:1269-1272 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` and `kernel/src/skp.rs:1312-1314 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `live_generation` `kernel/src/skp.rs:595-615 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; the test modules begin at `kernel/src/skp.rs:2441-2442 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` and `kernel/src/skp.rs:3454-3455 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; E13 |
| 1.5 | a `viewport_query` racing `close_dataset` no longer mints one | `kernel/src/skp.rs:1405-1416 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `kernel/src/skp.rs:1472 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `kernel/src/skp.rs:1666-1688 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; CR1 `kernel/src/skp.rs:4641-4702 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; CR2 `kernel/src/skp.rs:4502-4591 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 1.6 | it is refused as `skp.unknown_dataset` | `kernel/src/skp.rs:1673 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `kernel/src/skp.rs:1531-1533 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `kernel/src/skp.rs:1432-1435 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; the close's linearization and cancel, `kernel/src/skp.rs:1613-1623 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; CR1 :4676, CR2 :4553, CR3 :4739 (inside the spans above) |
| 1.7 | or by the end's reason, if the generation had already ended | `kernel/src/skp.rs:605-607 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` (the end mark is read before the closing mark); `kernel/src/skp.rs:1671-1686 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `kernel/src/skp.rs:1537-1547 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 2.1 | three passages above describe the kernel before the merge and are historical | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:29 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, `:50 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, `:60 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 2.2 | the first passage: Decision 3's bullet that the note names by its words | ADR-035 :60 (above; a sub-line span, which carries its line's hash) |
| 2.3 | no such generation can now exist | as 1.4; `EndReport`, `kernel/src/skp.rs:840-849 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; non-test `SessionRef::mint()` at :1270 and :1312 only (E13) |
| 2.4 | the case the 2026-09-25 Note gave an unheld reference for no longer arises | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:153-155 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; CR1 (above) |
| 2.5 | the second passage: Decision 3's sentence that `invalidate` marks before its live lookup | ADR-035 :50 (above) |
| 2.6 | `invalidate` now writes a mark only when it removes a live generation | `kernel/src/skp.rs:780-793 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; CR4 `kernel/src/skp.rs:4593-4639 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 2.7 | the third passage: Decision 2's mint-race arm in `viewport_query` | ADR-035 :29 (above) |
| 2.8 | that arm is gone | `viewport_query_attribute`, `kernel/src/skp.rs:1511-1548 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `frontends/shell/src/streaming/liveTicketSet.ts:72-74 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `governance/forms/kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:365 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; CR3 `kernel/src/skp.rs:4704-4758 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 2.9 | the live-generation check alone refuses | :1472 and :1522-1548 (above); CR3 |
| 3.1 | nothing else changes | ADR-035 Decisions 1 to 7, `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:23-117 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, read against the code at B; the close-races gate-1 §9 rows, `state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-architect.md:55-59 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 3.2 | every end still emits at most once | `kernel/src/skp.rs:787-793 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `kernel/src/skp.rs:914-918 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 3.3 | an end recorded during a close still emits | `kernel/src/skp.rs:761-770 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `kernel/src/skp.rs:1617-1621 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `kernel/src/skp.rs:1633 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; R2 `kernel/src/skp.rs:4760-4789 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` |
| 3.4 | no wire change | E14 (PR 136's diff under `protocol/`); this piece's diff under `protocol/` is empty (E1) |

These pins are historical, taken at C. The gate reads each clause at B and names which is authoritative where the tree at B differs from a pin: for a clause's truth, the tree at B.

2.3 Overlap, rule (00). This piece's paths:
- P1 `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`, append only;
- P2 this form, the custodian's, on main;
- P3 `governance/PLAN.yaml` with the generated `CUSTODIAN-QUEUE.*` and `site/`, the custodian's, on main.

How they meet the pieces in flight at C:
- 1c step 1 (#307) edits `kernel/src/skp.rs` (`open_dataset`). Disjoint by file. Contact: clauses 1.4, 1.5 and 2.3 read `open_dataset`'s mint, so the gate re-derives them at B.
- `adr-029-stale-line-cites` (ADR-029): disjoint.
- Nothing under `protocol/`, and no lockfile or wire fixture changes.
- The custodian re-checks rule (00) at dispatch by `git diff --name-only origin/main...<branch>` over every branch in flight and every PR awaiting merge.

2.4 Portability: no OS-dependent feature, so R3 does not apply.

## §3. Fixtures
None.

## §4. Tests and evidence
- No test is added, renamed or changed, and no mutation is owed: the piece changes a document only. No record of this piece calls any run an observation of a mutation, a `verify-mutation` run included.
- Evidence at H. Each item is run by script with its exit code checked, and each tool claim names the tool's commit (round 15 (c)):
  - E1: `git diff --numstat B...H` lists ADR-035 alone among non-generated files, with insertions 8 and deletions 0.
  - E2: ADR-035 at B is a byte prefix of ADR-035 at H (node Buffer compare).
  - E3: ADR-035 at B and at H has no CR byte and ends in exactly one line feed (node).
  - E4: H's bytes after B's length equal one line feed followed by the directive's lines 11 to 17 at B, each with its line feed (node).
  - E5: `node scripts/plan/verify-quotes.mjs` exits 0. Every passage it extracts from the note resolves to ADR-035 :29 or :60. Any other movement in its counts against B is a stop (class 2).
  - E6: `node scripts/plan/verify-cites.mjs` exits 0.
  - E7: `node scripts/plan/verify-test-claims.mjs` and `node scripts/plan/verify.mjs` exit 0.
  - E8: `npm run verify:adr-index` in `frontends/shell` exits 0. ADR-035's row, `docs/README.md:72 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, is unchanged.
  - E9: `node scripts/plan/queue.mjs --check` and `node scripts/plan/site.mjs --check` report current.
  - E10: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` exits 0.
  - E11: PR CI is green.
  - E12: `gh pr view 136 --json mergedAt,mergeCommit` reports a UTC merge date of 2026-09-28. Its merge commit is M.
  - E13: at M and at B, a listing by script of every `live.insert(` and `SessionRef::mint()` line under `kernel/src`, with file:line. The architect classifies each line against the `#[cfg(test)]` boundaries.
  - E14: `git diff --name-only M^1 M -- protocol/` is empty.

## §5. Predictions, declared unchanged, invalidators, falsification
- Predicted: E1 to E14 hold.
- Declared unchanged:
  - every byte of ADR-035 at B;
  - `docs/README.md`;
  - `protocol/skp/SKP-V0.md`;
  - every code and test file;
  - every other ADR.
- Invalidators (stop and report):
  - E3 fails at B;
  - the directive's lines 11 to 17 at B differ from those at C;
  - any in-flight piece edits ADR-035.
- Falsified if ADR-035 at B is not a prefix of H, or the appended bytes differ from the directive's.

## §6. Instruments
Assertions by script only. There is no measurement and no operator step.

## §7. Declared values and ceilings
- P1: at most 8 insertions and 0 deletions, by `git diff --numstat B...H`.
- One non-generated file in the PR. The form and PLAN.yaml are the custodian's, on main.
- Budget: 45 minutes (the node's). Past twice the budget, the node stops.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight
1. Any byte of ADR-035 at B changed, the Status line, the Acceptance section and the Note of 2026-09-25 included.
2. Appended text other than the one line feed and the directive's lines 11 to 17, byte for byte: a rewrap, an added word, a pin, a path:line cite or a comment.
3. A merge before every clause the gate sends to the human has the human's typed answer, recorded as a class 5 amendment.
4. A path outside §2.3: anything under `protocol/`, or any other ADR or doc edited.
5. A line beginning `Status:` or `**Status:**`.
6. A line cite into `DECISIONS-PENDING.md`, a bare self-line, or a hash pinned at a branch commit.
7. A tool claim without the tool's commit.
8. The round-25 items, by name:
   - a §7 overrun not recorded as class 8, or §7 edited to match;
   - a scope addition not recorded as class 9, or its code landed before its amendment;
   - a `verify-mutation` run called an observation of a mutation;
   - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates
- Architect and reviewer, both from dispatch (§21a).
  - The architect reads each clause of §2.2 at B against the code it names, by reading. It re-derives each span by symbol and cites it `path:line @ <B> sha256:<H>`. It classifies E13's listing, reads each recorded answer of the human against its clause, and checks §8 item by item.
  - The reviewer checks the diff, recomputes every pin in this form and in the architect's report, and runs E1 to E14 by script.
- Verdicts are proportional:
  - A clause found untrue is Correctness. It goes to the human with its code span and its test, and with no replacement words: this is red-line text, outside §31.
  - The human answers: accepted as it stands, recorded as a class 5 amendment, after which the finding no longer blocks; or their own words, which the architect checks once, those words only, with a failure going back to the human; or the item struck.
- Operator: none. No walkthrough row and no KNOWN-LIMITATIONS item.
- The merge is the human's click, by merge commit.

## §10. Amendments
Opens empty, append-only, classes 1 to 9. The human's answers on clauses the gate sends to them, and on OPEN-1, are class 5 and come before the merge.

## §11. OPEN items
| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | clauses 2.8 and 2.9, put to the human before dispatch or after the gate | (A) | yes: typed |
| OPEN-2 | the form's location | root | no |
```

**Answers to (a) to (f)**

- **(a) The form.** It is a full form, not a five-line one. Appending a dated note to an Accepted ADR is an ADR amendment, which is §21a's first category (`governance/AUTONOMY.md:319-320`). Item 3 restates a property that is under test, which is the fourth category (`governance/AUTONOMY.md:325-327`). Under §25(e) (`governance/AUTONOMY.md:482`), an Out-of-scope line that names a §21a category means the full form from dispatch. Round 25, item 2 fails by name a piece dispatched on a five-line form whose Out-of-scope line names one. The same reasoning was used for the ADR-020 and ADR-017 notes, and for ADR-035's Note of 2026-09-25. The Scope is ADR-035 alone: an append of 8 lines (one blank line, then the directive's :11-17), with nothing above the new heading changed.
- **(b) The gate.** It is full gating with both agents (§21a), not §21b's single reviewer: §21b is open only to pieces that touch none of the four categories (`governance/AUTONOMY.md:336`). The architect checks each clause at B by reading, cited `path:line @ <B> sha256:<H>`. The reviewer checks the bytes by script (E1 to E5), checks the merge date and that PR 136 changed nothing under `protocol/` (E12, E14), and recomputes the pins. A clause found untrue is Correctness and goes to the human with its evidence and no replacement words (`governance/AUTONOMY.md:544`).
- **(c) The clause list.** §2.2: 25 clauses, ungraded.
- **(d) The worker's commit.** §2.1: one Edit whose `old_string` is ADR-035's last line at B with its LF. The bytes are copied by script from the directive, which has been on main since c1aea32a. The commit shows E1 to E4 by script, and E5 to E11. It adds no `path:line` cite to ADR-035.
- **(e) Rule (00).** §2.3: P1 is ADR-035. P2 (the form) and P3 (PLAN.yaml and the generated files) are the custodian's. 1c's #307 is disjoint by file, but its `kernel/src/skp.rs` edits are a contact for clauses 1.4, 1.5 and 2.3.
- **(f) Budget.** This is an estimate, not a measurement: 45 minutes, the node's figure. That is about 10 minutes for the worker and about 15 for each gate, not counting the human's answer. If OPEN-1 (A) is taken, the node's `needs_human` should become a typed ruling of about 5 minutes plus the click. Its `gate: none` becomes this form's path. Both are your PLAN edits.

**OPEN items**

- **OPEN-1 (red line; the answer is typed). Clauses 2.8 and 2.9, Decision 2's mint-race arm.** At C, the code these clauses rest on still has the refusal arm in `viewport_query_attribute` (`kernel/src/skp.rs:1522-1548`). Test CR3 makes that arm refuse in a close race (`kernel/src/skp.rs:4704-4758`). A product comment names it as the mint-race arm (`frontends/shell/src/streaming/liveTicketSet.ts:72-74`). The follow-ups form's closing record, Amendment 2 item 7, has already corrected the same premise, which N4 carried (`governance/FORMS/kernel/...`: `governance/forms/kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:365`). The gate grades the clause; I offer no words.
  - (A) Put these spans to the human before dispatch. The human's answer (their own words for that passage, accepted as it stands, or struck) is recorded as class 5 before code.
  - (B) Dispatch as ruled, and the gate sends the clause to the human.
  - Recommended: (A). The evidence is already in the tree, and (B) would spend a gate round to reach the same question.
- **OPEN-2 (not a red line). The form's location.** Recommended: `governance/forms/root/`, as for the ADR-017 and ADR-020 note forms. Under the 2026-10-31 directive, item 4, this takes my recommendation.

**What I read** (at C, in `C:/dev/spatial-ide`)
- `C:/dev/spatial-ide/docs/adr/ADR-035-dataset-session-ended-control-plane-event.md` (whole)
- `C:/dev/spatial-ide/state/directives/2026-11-11-adr-035-and-adr-029-notes-in-the-humans-words-table-as-consult-s3-waiting-on-you-open-questions.md`
- `C:/dev/spatial-ide/governance/PLAN.yaml` (nodes `adr-035-close-races-note` and `kernel-generation-close-races`; the in-progress nodes)
- `C:/dev/spatial-ide/state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-architect.md` (:1-12, :41-84)
- `C:/dev/spatial-ide/governance/forms/root/ADR-020-APPENDED-NOTE-PREREGISTRATION.md`
- `C:/dev/spatial-ide/governance/forms/root/ADR-017-NOTE-PRODUCT-REDACTION-GATE-PREREGISTRATION.md`
- `C:/dev/spatial-ide/governance/forms/kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md` (:355-379)
- `C:/dev/spatial-ide/governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` (search only)
- `C:/dev/spatial-ide/governance/AUTONOMY.md` (§21 to §21d, §25 (b) and (e), §31)
- `C:/dev/spatial-ide/governance/AI_DEVELOPMENT.md` (:449-455)
- `C:/dev/spatial-ide/governance/README.md` (:19, :23)
- `C:/dev/spatial-ide/kernel/src/skp.rs` (:470-950, :1100-1688, :4495-4794; searches for mints, inserts and `cfg(test)`)
- `C:/dev/spatial-ide/frontends/shell/src/streaming/liveTicketSet.ts` (:66-81)
- `C:/dev/spatial-ide/docs/README.md` (search only)

**Model:** Opus 5.5 (claude-opus-5-5), as the harness reports it.
