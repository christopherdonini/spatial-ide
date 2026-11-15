*Custodian's filing note (2026-11-11): the architect's revision of its form draft for PLAN node adr-035-close-races-note, after the human's answer to its OPEN-1, from its hand-back (31743 bytes, sha256 a4a0895c377eaa106fc1d84d578e837400abb8c1ef9f18b30e7b54c52f91b72d), below the rule unchanged; one final newline is added. Its brief by file (4671 bytes, sha256 4cceb7ba7c72f122496bb0d2e222023693599d537a149651921c5d10ef6906a2), with the reuse index's output byte for byte; the run 22:17:21Z to 22:22:26Z by its transcript, 33 calls (Read 21, Grep 11, the hand-back), none errored, none writing, model claude-opus-5-5. A draft, a reading and not Authority. The form is committed at this commit from its fenced block (`governance/forms/root/ADR-035-CLOSE-RACES-NOTE-PREREGISTRATION.md`), each pin filled by script and its byte count written; each `<H>` stays as written here.*

---

Revised: adr-035-close-races-note form

Read only, in the main checkout at main @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb (C below). I wrote no file. Every `<H>` and the byte count `<N>` are for the custodian to compute. A hash is sha256 over the cited whole lines as committed, in LF bytes. I have no shell, so I leave no background shell.

```markdown
# ADR-035's appended note in the human's words: what kernel-generation-close-races makes historical (PLAN node adr-035-close-races-note). Preregistration (full form)

File: governance/forms/root/ADR-035-CLOSE-RACES-NOTE-PREREGISTRATION.md, committed on main by the custodian before any code.

**Authority.**
- The node: `governance/PLAN.yaml:3245-3261 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` (depends_on kernel-generation-close-races, done, PR 136, `governance/PLAN.yaml:2334-2350 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; and adr-020-appended-note).
- The ruling and the words, from two of the human's messages. Below, D1 and D2 are these files:
  - D1, the human's message of 2026-11-11 (17:25Z), item 1: `state/directives/2026-11-11-adr-035-and-adr-029-notes-in-the-humans-words-table-as-consult-s3-waiting-on-you-open-questions.md:9 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` (the item). The words kept are the heading, the italic line and items 1 and 3: `:11-15 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` and `:17 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`. Its item 2, `:16`, is replaced whole and does not land.
  - D2, the human's message of 2026-11-11 (21:49Z), item 1: `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md:9 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` (the item, which answers the draft's OPEN-1). The new item 2 is the span inside the outer quotation marks of `:10 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`. That is a sub-line span, and it carries its line's hash.
- What owes it: Advisory N4 of the close-races gate-1 architect report, `state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-architect.md:41-46 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`.
- Red line: `governance/AI_DEVELOPMENT.md:451-454 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` (ADR statuses and amendments). §31's replacement route does not apply to red-line text (`governance/AUTONOMY.md:544 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`).
- Verdicts: proportional (`state/directives/2026-10-05-product-first-direction.md`, section 2). Whether a clause is true is a Correctness question.
- The reuse index (the standing step). The custodian ran it in the read-only private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-11, and it is reproduced byte for byte below as the custodian's brief carried it. The query misses. The miss is noted and does not block. The draft's earlier query also missed. The prior art in the tree is the ADR-017 note form (`governance/forms/root/ADR-017-NOTE-PRODUCT-REDACTION-GATE-PREREGISTRATION.md`), the ADR-020 note form (`governance/forms/root/ADR-020-APPENDED-NOTE-PREREGISTRATION.md`) and ADR-035's own Note of 2026-09-25.
    $ node tools/reuse.mjs adr note mint race arm refused unknown dataset   (exit 1)
    No prior art recorded for "adr note mint race arm refused unknown dataset". Research it before planning an implementation.

**Drafted by** the architect, read only, at main 8e09470c4ad7b0d10561005dbc2746bf2deefdfb (C). The draft is revised after the human's answer to its OPEN-1 (D2, item 1). The note's words are the human's. Every other word of this form is the architect's.
**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
**Gating: full form, both gates from dispatch** (§21a, `governance/AUTONOMY.md:315-332 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; §25 (e), `governance/AUTONOMY.md:482 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`).
- The piece appends a dated note to an Accepted ADR, which makes it an ADR amendment (`governance/AUTONOMY.md:319-320 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`).
- Its item 3 restates an at-most-once emission property that is under test, and its item 2 states how a refusal arm in the current code behaves (`governance/AUTONOMY.md:325-327 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`). Both are text only, with no code.
- So no Out-of-scope line could assert that the piece touches none of the four categories. No five-line form is committed. Dispatching on one would fail by name (round 25, item 2).
- By size the piece is under §21c (`governance/AUTONOMY.md:347-357 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`).
- Out-of-scope, the four categories:
  - ADR: touched (ADR-035, appended only, its Status line unchanged).
  - Security posture: not touched.
  - Data plane and wire: not touched.
  - Stated guarantee: touched, as documentation only.

## §0. Disclosure
- Inputs read at C:
  - the node;
  - D1 and D2;
  - ADR-035, whole;
  - N4;
  - §21a to §21d and §25 (e);
  - the ADR-017 and ADR-020 note forms;
  - `kernel/src/skp.rs` at the spans in §2.2, with searches for `viewport_query_attribute(`, `live.insert(`, `SessionRef::mint()` and the attribute arm's two detail strings;
  - `frontends/shell/src/streaming/liveTicketSet.ts:66-79`;
  - the close-races follow-ups form's Amendment 2, item 7.
- The draft's OPEN-1 was answered by D2, item 1, and this form is the revision. The draft is filed at `state/consults/2026-11-11-adr-035-close-races-note-form-architect-draft.md`.
- No fixture, no run, no measurement.

## §1. May and may not claim
- May claim:
  - ADR-035 at B is a byte prefix of ADR-035 at H;
  - the bytes appended are exactly the output of the §2.1 script run on D1 and D2 at C;
  - each clause holds as the gate finds it at B, or as the human's recorded answer states.
- May not claim:
  - any change to ADR-035's Decisions, its Status line, its Acceptance section or its Note of 2026-09-25;
  - that D1's item 2 (`:16`) is any part of the note;
  - any change to code, tests, the wire or a measurement;
  - that a clause the gate sends to the human is true before the human's answer is recorded.

## §2. The change
2.0 Rules.
- (a) A single append at ADR-035's end. Nothing above it is edited.
- (b) The appended text is the human's words as §2.1 assembles them, unwrapped, as ADR-035's own long lines are. It carries no pin, no path:line cite, no comment and no added word.
- (c) No line of it begins with `Status:` or `**Status:**`.
- (d) The worker stops (§5) if ADR-035 at B does not end in a line feed, holds a CR byte, or ends with a blank line.

2.1 The bytes, assembled by script from D1 and D2 at C. Each file is read as bytes with `git show 8e09470c4ad7b0d10561005dbc2746bf2deefdfb:<path>` and split on LF. Line numbers below are 1-based at C.
- Piece A, from D1: lines 11 to 15, each with its LF.
- Piece B, from D2: line 10 without its first byte and without its last byte before the LF (the outer quotation marks), followed by one LF.
- Piece C, from D1: line 17, with its LF.
- The output is one LF, then A, then B, then C.

The script checks these, and stops on any failure with a non-zero exit and nothing written:
- 1. Neither D1 nor D2 contains a CR byte.
- 2. Found once:
  - D1's lines 11 to 15, joined, occur exactly once in D1;
  - D1's line 16 begins with the anchor `2. Three passages`;
  - D1's line 17 begins with `3. `;
  - D2's line 10 begins with the two bytes `"2` and ends with `."` before its LF;
  - D2's line 10 holds exactly four `"` bytes (the outer pair and the inner pair around the quoted bullet);
  - piece B, without its LF, occurs exactly once in D2.

  The anchors are for locating the lines only. They are not quotations.
- 3. The join: the output holds exactly 8 LFs, and its first byte is LF. Its line 7 (counting the leading blank line as line 1) equals piece B without its LF. No line of D1's line 16, whole or in part from its third byte on, occurs in the output.
- 4. The final newline: the output's last byte is LF and the byte before it is not.
- 5. The total byte count: the output's length equals `<N>` (§7). N is derived independently of the script as `(git show C:D1 | sed -n '11,15p;17p' | wc -c) + (git show C:D2 | sed -n '10p' | wc -c) - 1`. That is one leading LF, plus D2 line 10's length less its two outer quotation bytes, with its LF kept.
- 6. ADR-035's working copy equals ADR-035 at B byte for byte, and §2.0 (d) holds.

When every check passes, the same script appends the output to `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md` and exits 0. If a guard refuses the script's write, the fallback is one Edit. Its `old_string` is ADR-035's last line at B with its final LF (at C that is :158), and its `new_string` is the same text followed by the script's output, read from the scratch file the script wrote. E4 proves the bytes either way.

2.2 The clause list. Each line is one clause of the note as §2.1 assembles it. The labels are mine: they paraphrase and do not quote. The spans show where each clause rests, and none is graded here. The gate grades each one at B (§9).

| # | Clause (paraphrase, label mine) | Rests on |
|---|---|---|
| H.1 | heading: what the named piece makes historical | `governance/PLAN.yaml:2334-2350 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; items 1 to 3 below |
| I.1 | italic line: appended on the human's ruling | D1 :9 and D2 :9 (above) |
| I.2 | italic line: the text above is unchanged, Status line, Acceptance section and the 2026-09-25 Note included | E2 at H; `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:3 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`, `:141-147 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`, `:149-158 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 1.1 | the close race the 2026-09-25 Note's item 3 left unsettled | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:157 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 1.2 | is closed by kernel-generation-close-races, PR 136 | `governance/PLAN.yaml:2343-2344 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; tests CR1 to CR4, `kernel/src/skp.rs:4502-4758 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 1.3 | merged 2026-09-28 | `governance/PLAN.yaml:2350 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; E12 |
| 1.4 | since that merge only `open_dataset` creates a live generation, through `mint_for_open` | `kernel/src/skp.rs:574-593 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` (the only `live.insert` outside `#[cfg(test)]`, :583); its callers `kernel/src/skp.rs:1269-1272 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` and `kernel/src/skp.rs:1312-1314 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; `live_generation` `kernel/src/skp.rs:595-615 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; the test modules begin at `kernel/src/skp.rs:2441-2442 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` and `kernel/src/skp.rs:3454-3455 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; E13 |
| 1.5 | a `viewport_query` racing `close_dataset` no longer mints one | `kernel/src/skp.rs:1405-1416 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; `kernel/src/skp.rs:1472 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; `kernel/src/skp.rs:1666-1688 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; CR1 `kernel/src/skp.rs:4641-4702 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; CR2 `kernel/src/skp.rs:4502-4591 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 1.6 | it is refused as `skp.unknown_dataset` | `kernel/src/skp.rs:1673 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; `kernel/src/skp.rs:1531-1533 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; `kernel/src/skp.rs:1432-1435 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; the close's linearization and cancel, `kernel/src/skp.rs:1613-1623 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; CR1 :4676, CR2 :4553, CR3 :4739 (inside the spans above) |
| 1.7 | or by the end's reason, if the generation had already ended | `kernel/src/skp.rs:605-607 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` (the end mark is read before the closing mark); `kernel/src/skp.rs:1671-1686 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; `kernel/src/skp.rs:1537-1547 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 2.1 | two passages above describe the kernel before the merge and are historical | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:50 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`, `:60 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 2.2 | the first passage: Decision 3's bullet that the note names by its words | ADR-035 :60 (above; a sub-line span, which carries its line's hash) |
| 2.3 | no such generation can now exist | as 1.4; `EndReport`, `kernel/src/skp.rs:840-849 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; non-test `SessionRef::mint()` at :1270 and :1312 only (E13) |
| 2.4 | the case the 2026-09-25 Note gave an unheld reference for no longer arises | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:153-155 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; CR1 (above) |
| 2.5 | the second passage: Decision 3's sentence that `invalidate` marks before its live lookup | ADR-035 :50 (above) |
| 2.6 | `invalidate` now writes a mark only when it removes a live generation | `kernel/src/skp.rs:780-793 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; CR4 `kernel/src/skp.rs:4593-4639 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 2.7 | Decision 2's mint-race arm is not historical: it stands | `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:29 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` (Decision 2 places the arm in `SkpHost::viewport_query`); `governance/forms/kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:365 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; `frontends/shell/src/streaming/liveTicketSet.ts:72-74 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 2.8 | in `SkpHost::viewport_query_attribute` | `kernel/src/skp.rs:1511-1553 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; its only product caller, `viewport_query`'s third step, :1415 (inside 1.5's first span) |
| 2.9 | where a ticket that cannot be attributed to the live generation | `attribute_ticket`, `kernel/src/skp.rs:617-635 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` (false with no live generation, or while closing, :625-630); its call, `kernel/src/skp.rs:1522-1525 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 2.10 | is cancelled | `kernel/src/skp.rs:1526 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`. A fact for the gate: CR3's cancelled-state assertion, `kernel/src/skp.rs:4740-4753 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`, also holds through the close's own cancel at :1623. My search found no test that isolates :1526 |
| 2.11 | and the call refused | `kernel/src/skp.rs:1531-1547 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; CR3 `kernel/src/skp.rs:4704-4758 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 2.12 | by the end's reason | :1531 and :1537-1547 (above); `ended_reason`, `kernel/src/skp.rs:750-759 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` (the first mark). A fact for the gate: my searches under `kernel/` found `viewport_query_attribute(` called only by CR1 (:4674) and CR3 (:4737), both asserting `skp.unknown_dataset`, and found the arm's two detail strings (:1539, :1543) nowhere else. No test I found drives this branch |
| 2.13 | or as `skp.unknown_dataset` when no end is recorded | :1531-1533 (above); CR3 :4739; `forget_dataset` clears the mark, `kernel/src/skp.rs:827-837 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`. A fact for the gate: CR1 :4676 refuses at the mint step's `require_live` (:1472), not at this arm |
| 3.1 | nothing else changes | ADR-035 Decisions 1 to 7, `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:23-117 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`, read against the code at B; the close-races gate-1 §9 rows, `state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-architect.md:55-59 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 3.2 | every end still emits at most once | `kernel/src/skp.rs:787-793 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; `kernel/src/skp.rs:914-918 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 3.3 | an end recorded during a close still emits | `kernel/src/skp.rs:761-770 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; `kernel/src/skp.rs:1617-1621 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; `kernel/src/skp.rs:1633 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`; R2 `kernel/src/skp.rs:4760-4789 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>` |
| 3.4 | no wire change | E14 (PR 136's diff under `protocol/`); this piece's diff under `protocol/` is empty (E1) |

These pins are historical and were taken at C. The gate reads each clause at B. Where the tree at B differs from a pin, the gate names which one is authoritative; for a clause's truth, that is the tree at B.

2.3 Overlap, rule (00). This piece's paths:
- P1 `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`, append only;
- P2 this form, the custodian's, on main;
- P3 `governance/PLAN.yaml` with the generated `CUSTODIAN-QUEUE.*` and `site/`, the custodian's, on main.

How they meet the pieces in flight at C:
- 1c step 1 (#307) edits `kernel/src/skp.rs` (`open_dataset`). It is disjoint by file. Its contact is that clauses 1.4, 1.5, 2.3 and 2.8 to 2.13 read `kernel/src/skp.rs`, so the gate re-derives them at B.
- `adr-029-stale-line-cites` (ADR-029): disjoint.
- Nothing under `protocol/`, and no lockfile or wire fixture changes.
- At dispatch, the custodian re-checks rule (00) with `git diff --name-only origin/main...<branch>` over every branch in flight and every PR awaiting merge.

2.4 Portability: no OS-dependent feature, so R3 does not apply.

## §3. Fixtures
None.

## §4. Tests and evidence
- No test is added, renamed or changed, and no mutation is owed, because the piece changes a document only. No record of this piece calls any run an observation of a mutation, a `verify-mutation` run included.
- Evidence at H. Each item is run by script with its exit code checked, and each tool claim names the tool's commit (round 15 (c)):
  - E1: `git diff --numstat B...H` lists ADR-035 alone among non-generated files, with 8 insertions and 0 deletions.
  - E2: ADR-035 at B is a byte prefix of ADR-035 at H (node Buffer compare).
  - E3: ADR-035 at B and at H has no CR byte and ends in exactly one line feed (node).
  - E4: H's bytes after B's length equal the §2.1 script's output, re-run on D1 and D2 at C with every check of §2.1 passing (node).
  - E5: `node scripts/plan/verify-quotes.mjs` exits 0. Every passage it extracts from the note resolves to ADR-035 :60. Any other movement in its counts against B is a stop (class 2).
  - E6: `node scripts/plan/verify-cites.mjs` exits 0.
  - E7: `node scripts/plan/verify-test-claims.mjs` and `node scripts/plan/verify.mjs` exit 0.
  - E8: `npm run verify:adr-index` in `frontends/shell` exits 0. ADR-035's row, `docs/README.md:72 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`, is unchanged.
  - E9: `node scripts/plan/queue.mjs --check` and `node scripts/plan/site.mjs --check` report current.
  - E10: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` exits 0.
  - E11: PR CI is green.
  - E12: `gh pr view 136 --json mergedAt,mergeCommit` reports a UTC merge date of 2026-09-28. Its merge commit is M.
  - E13: a script lists every `live.insert(` and `SessionRef::mint()` line under `kernel/src`, with file:line, at M and at B. The architect classifies each line against the `#[cfg(test)]` boundaries.
  - E14: `git diff --name-only M^1 M -- protocol/` is empty.
  - E15: the byte count of H's appended bytes (H's ADR-035 length less B's) equals N from §2.1 check 5, computed again at H by the same `git show | sed | wc -c` derivation.

## §5. Predictions, declared unchanged, invalidators, falsification
- Predicted: E1 to E15 hold.
- Declared unchanged:
  - every byte of ADR-035 at B;
  - `docs/README.md`;
  - `protocol/skp/SKP-V0.md`;
  - every code and test file;
  - every other ADR;
  - D1 and D2.
- Invalidators (stop and report):
  - E3 fails at B;
  - D1 or D2 at B differs in any byte from the same file at C;
  - any in-flight piece edits ADR-035;
  - any check of §2.1 fails.
- Falsified if ADR-035 at B is not a prefix of H, or if the appended bytes differ from the §2.1 output.

## §6. Instruments
Assertions by script only. There is no measurement and no operator step.

## §7. Declared values and ceilings
- P1: at most 8 insertions and 0 deletions, by `git diff --numstat B...H`.
- P1's appended bytes: exactly N = `<N>`. The custodian computes N by §2.1 check 5's derivation at C and writes it here before this form is committed.
- One non-generated file in the PR. The form and PLAN.yaml are the custodian's, on main.
- Budget: 45 minutes (the node's). Past twice the budget, the node stops.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight
1. Any byte of ADR-035 at B changed, the Status line, the Acceptance section and the Note of 2026-09-25 included.
2. Appended text other than the §2.1 output, byte for byte: a rewrap, an added word, a pin, a path:line cite or a comment.
3. Any part of D1's item 2 (`:16`) in the appended text.
4. A merge before every clause the gate sends to the human has the human's typed answer, recorded as a class 5 amendment.
5. A path outside §2.3: anything under `protocol/`, or any other ADR or doc edited.
6. A line beginning `Status:` or `**Status:**`.
7. A line cite into `DECISIONS-PENDING.md`, a bare self-line, or a hash pinned at a branch commit.
8. A tool claim without the tool's commit.
9. The round-25 items, by name:
   - a §7 overrun not recorded as class 8, or §7 edited to match;
   - a scope addition not recorded as class 9, or its code landed before its amendment;
   - a `verify-mutation` run called an observation of a mutation;
   - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates
- Architect and reviewer, both from dispatch (§21a).
  - The architect reads each clause of §2.2 at B against the code it names, by reading. It re-derives each span by symbol and cites it `path:line @ <B> sha256:<H>`. It classifies E13's listing, reads each recorded answer of the human against its clause, and checks §8 item by item. The test facts recorded on clauses 2.10, 2.12 and 2.13 are the architect's to weigh under Evidence.
  - The reviewer checks the diff, re-runs the §2.1 script, recomputes every pin in this form and in the architect's report, and runs E1 to E15 by script.
- Verdicts are proportional:
  - A clause found untrue is a Correctness finding. It goes to the human with its code span and its test, and with no replacement words, because this is red-line text, outside §31. The new item 2 (D2) is graded the same way as every other clause.
  - The human answers in one of three ways. Accepted as it stands: recorded as a class 5 amendment, after which the finding no longer blocks. Their own words: the architect checks those words only, once, and a failure goes back to the human. Or the item is struck.
- Operator: none. No walkthrough row and no KNOWN-LIMITATIONS item.
- The merge is the human's click, by merge commit.

## §10. Amendments
Opens empty and is append-only, with classes 1 to 9. The human's answers on clauses the gate sends to them are class 5 and come before the merge.

## §11. OPEN items
| Item | Subject | State | Red line |
|---|---|---|---|
| OPEN-1 | the draft's note item 2, Decision 2's mint-race arm | answered by D2, item 1: D1's item 2 is replaced whole by the human's new words | yes: answered in the human's words |
| OPEN-2 | the form's location | `governance/forms/root/`, the draft's recommendation, taken under `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, item 4 (the draft's filing note, 2026-11-11) | no |
```

**Answers to (a) to (f)**

- **(a) The form.** It stays a full form. It cannot be a five-line one.
  - §25 (e) (`governance/AUTONOMY.md:482 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`) gives a piece whose Out-of-scope line would name a §21a category the full form from dispatch, and no five-line form is committed for it.
  - This piece names two categories:
    - the ADR category, because it amends an Accepted ADR (`governance/AUTONOMY.md:319-320 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`);
    - the stated-guarantee category (`:325-327 @ 8e09470c4ad7b0d10561005dbc2746bf2deefdfb sha256:<H>`). Item 3 restates the at-most-once property, and the new item 2 now states how the attribute arm refuses.
  - Round 25, item 2 fails by name a piece dispatched on a five-line form like this one.
  - The Scope is ADR-035 alone: one append of 8 lines and `<N>` bytes, with nothing above the new heading changed (§2.0, §7).
- **(b) The note's text.** It is D1 :11-15, then D2 :10 without its outer quotation marks, then D1 :17, all read at C, after one leading LF. D1 :16 is dropped.
  - The script reads both files at 8e09470c4ad7b0d10561005dbc2746bf2deefdfb with `git show` as bytes. It checks that neither file holds a CR byte.
  - It checks that each piece is found exactly once: A in D1, B in D2. B is located by D2 :10's leading `"2` and trailing `."`, with exactly four `"` bytes on the line. The anchors on D1 :16 and :17 confirm the line numbering.
  - It checks the join: 8 LFs, a leading LF, line 7 equal to B, and none of D1 :16 in the output.
  - It checks the final newline: the last byte is LF and the byte before it is not.
  - It checks the total byte count against N. N is derived independently as `wc -c` of D1 :11-15 and :17, plus `wc -c` of D2 :10, minus 1.
  - Only when every check passes does it append. A refused write falls back to one Edit. E4 and E15 prove the bytes at H (§2.1).
- **(c) The clause list.** §2.2 has 25 rows. Rows H.1 to 1.7 and 3.1 to 3.4 are as in the draft, re-pinned at C; every line I re-read sits at the draft's numbers. The new item 2 is rows 2.1 to 2.13, ungraded. Three rows record facts the gate needs:
  - 2.10: no test I found isolates the arm's own cancel;
  - 2.12: no test I found drives the by-reason branch;
  - 2.13: CR1 refuses at `require_live`, not at the arm.
- **(d) OPEN-1.** It is recorded as answered by D2, item 1 (§11). Dropped with it:
  - the draft's "Before you dispatch" paragraph;
  - OPEN-1's options;
  - old clauses 2.7 to 2.9 (the arm gone; the live check alone refusing);
  - the E5 resolution to ADR-035 :29, since the new item 2 quotes only :60;
  - §10's "and on OPEN-1".
- **(e) The gate, rule (00) and the budget.**
  - The gate is unchanged: full, both gates. Added: the reviewer re-runs the §2.1 script and E15, and the architect weighs the facts on rows 2.10, 2.12 and 2.13 under Evidence.
  - Rule (00) is unchanged except that its contact list now includes rows 2.8 to 2.13, which also read `kernel/src/skp.rs`.
  - The budget is unchanged: 45 minutes, an estimate, not a measurement. The draft's `needs_human` remark is dropped, because the answer is on file.
  - Your PLAN edits: the node's `gate:` becomes this form's path. Its title still ends "Decision 2's mint-race arm gone", which the note no longer says; the title is yours to reword.
- **(f) The change list, by section:**
  - Header and every pin: C is now 8e09470c (was c1aea32a), and each cite is re-pinned there.
  - Authority:
    - adds D2, item 1;
    - the words are now D1 :11-15 and :17 plus D2 :10's span, with D1 :16 replaced;
    - adds the brief's reuse query (a miss), and the draft's query is noted as a miss.
  - Drafted by: C, and the revision is stated.
  - Gating: the second bullet adds the new item 2's statement of the arm.
  - §0: adds D2, the `attribute_ticket` span and the searches, and the revision note.
  - §1: may-claim is now the §2.1 output; adds may-not-claim for D1 :16.
  - §2.0 (b): now "as §2.1 assembles them".
  - §2.1: rewritten as a two-file assembly with checks 1 to 6. It now appends by script, with an Edit fallback (it was one Edit).
  - §2.2: old 2.1 to 2.9 are replaced by 2.1 to 2.13, I.1 adds D2 :9, and every row is re-pinned.
  - §2.3: the contact list adds rows 2.8 to 2.13.
  - §4: E4 is re-defined, E5 resolves to :60 only, and E15 is added.
  - §5: predictions run to E15; D1 and D2 join declared unchanged; the invalidators add D1 or D2 drift and a §2.1 check failure.
  - §7: adds N.
  - §8: item 2 is reworded and item 3 (D1 :16) is new, so the later items are renumbered.
  - §9: adds the reviewer's script re-run and E15, the facts on rows 2.10, 2.12 and 2.13, and that D2's words are graded like the rest.
  - §10: drops OPEN-1.
  - §11: OPEN-1 answered, OPEN-2 taken.

**OPEN items**

- None new.
  - OPEN-1 (red line) was answered by the human's message of 2026-11-11 (21:49Z), item 1.
  - OPEN-2 (not a red line) was taken at its recommendation under the 2026-10-31 directive, item 4, held to 2026-11-16, as the draft's filing note records.
- One fact to weigh before dispatch, not an OPEN item: rows 2.10 and 2.12 rest on code with no test of their own that I could find. That is the gate's to weigh under Evidence, and if the gate finds a clause untrue it goes to the human with no replacement words.

**What I read** (at 8e09470c4ad7b0d10561005dbc2746bf2deefdfb, in `C:/dev/spatial-ide`)
- `C:/dev/spatial-ide/state/consults/2026-11-11-adr-035-close-races-note-form-architect-draft.md` (whole)
- `C:/dev/spatial-ide/state/directives/2026-11-11-adr-035-and-adr-029-notes-in-the-humans-words-table-as-consult-s3-waiting-on-you-open-questions.md` (whole)
- `C:/dev/spatial-ide/state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md` (whole)
- `C:/dev/spatial-ide/docs/adr/ADR-035-dataset-session-ended-control-plane-event.md` (whole)
- `C:/dev/spatial-ide/governance/PLAN.yaml` (:2334-2350, :3243-3261)
- `C:/dev/spatial-ide/governance/forms/kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md` (Amendment 2, :337-378)
- `C:/dev/spatial-ide/kernel/src/skp.rs` (:440-641, :740-859, :905-920, :1395-1689, :4360-4465, :4638-4761; searches for the step functions, `live.insert(`, `SessionRef::mint()`, `viewport_query_attribute(`, `attribute_ticket(`, the arm's detail strings and `#[cfg(test)]`)
- `C:/dev/spatial-ide/frontends/shell/src/streaming/liveTicketSet.ts` (:66-79)
- `C:/dev/spatial-ide/governance/AUTONOMY.md` (§21 to §21d, :306-377; §25, :476-483; heading search)
- `C:/dev/spatial-ide/governance/AI_DEVELOPMENT.md` (:449-455)
- `C:/dev/spatial-ide/state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-architect.md` (:40-59)
- `C:/dev/spatial-ide/docs/README.md` (search only)

**Background shells:** none. I have no shell.

**Model:** Opus 5.5 (claude-opus-5-5), as the harness reports it.
