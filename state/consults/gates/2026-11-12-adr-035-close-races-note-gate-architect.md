Reviewed: PR #308 at 1700ac8c13cbe4ade821a66165ce5f62bd833fab (the custodian's filing note, 2026-11-12: the gate, the architect, from dispatch, before the reviewer, PLAN node adr-035-close-races-note; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #308 at 1700ac8c13cbe4ade821a66165ce5f62bd833fab (base 7693001e), gate, architect. Branch and commit: cut/adr-035-close-races-note @ 1700ac8c13cbe4ade821a66165ce5f62bd833fab
Verdict: FAIL

All words below are mine unless marked. I give no replacement words, because the note is red-line text and the human's own. Pins take the form `path:line @ 7693001e sha256:<H>`, and the reviewer computes each `<H>`. A sub-line span carries its line's hash.

## Findings by class

**Correctness, C1 (for the human): clause 1.7 is untrue as a condition in one interleaving that a client can reach.**
- **What the note says.** Note item 1 says a racing `viewport_query` is refused "by the end's reason if the generation had already ended". The source is `state/directives/2026-11-11-adr-035-and-adr-029-notes-in-the-humans-words-table-as-consult-s3-waiting-on-you-open-questions.md:15 @ 7693001e sha256:<H>`, a sub-line span.
- **What the code does at B.**
  - `forget_dataset` removes the end mark (`kernel/src/skp.rs:827-831 @ 7693001e sha256:<H>`). Step 3 of `close_dataset` runs it before step 4's `catalog.remove` (`kernel/src/skp.rs:1627-1637 @ 7693001e sha256:<H>`).
  - So take a generation that ended before the close, and a racing query that resolved the catalog before `catalog.remove` (`kernel/src/skp.rs:1432-1435 @ 7693001e sha256:<H>`) and reaches `require_live` after `forget_dataset`.
  - `live_generation` then finds no mark, no closing flag and no live entry, and answers `NotOpen` (`kernel/src/skp.rs:602-615 @ 7693001e sha256:<H>`). `require_live` refuses that as `skp.unknown_dataset`, not with the end's code (`kernel/src/skp.rs:1666-1673 @ 7693001e sha256:<H>`).
  - The end's reason comes back only when the check runs before `forget_dataset`. R2 shows `Ended` while closing (`kernel/src/skp.rs:4786-4789 @ 7693001e sha256:<H>`).
- **The named race itself.** This is the race that the Note of 2026-09-25 names: a query that reaches the generation step after `forget_dataset` (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:60 @ 7693001e sha256:<H>`). In that race the answer is always `skp.unknown_dataset`.
- **Which reading holds.** Read as a list of the possible refusal codes, the clause holds. Read as "if ended, then the end's reason", it does not.
- **Test.** I found no test that drives an ended-then-closed race. CR4 (`kernel/src/skp.rs:4602-4639 @ 7693001e sha256:<H>`) proves that the mark is gone after a close.
- **Requirement.** The proportional-gates directive, section 2: a stated guarantee the code does not support. The form's §9 sends it to the human.
- **Closure.** The human's typed answer, recorded as a class 5 amendment before the merge (§8 item 4): accepted as it stands, their own words, or struck.
- D2's item 2 is worded on the mark ("when no end is recorded"), and it is exact. This finding is on item 1 only.

**Evidence.** None blocking. Check 5 has the details.

**Documentation.** None in the diff.

## Check 1: the §2.2 clauses, graded at B

Between C and B, `kernel/src/skp.rs` has the same line numbers at every span I re-derived by symbol. None of the form's spans differs from mine. Where I add a span, I say so.

- **H.1 true.** The note's heading matches the node (`governance/PLAN.yaml:2334-2350 @ 7693001e sha256:<H>`, status done, PR 136).
- **I.1 true.** It rests on D1 item 1 and D2 item 1 (`…adr-035-and-adr-029…md:9` and `…adr-035-item-2-arm-stands…md:9`, both `@ 7693001e sha256:<H>`).
- **I.2 true, on the worker's E1 and E2** (8 insertions, 0 deletions; B is a byte prefix of H). Lines 1 to 158 at H read as the pinned spans: Status `:3`, Acceptance `:141-147`, Note `:149-158`. The byte proof is the reviewer's E2.
- **1.1 true** (`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:157 @ 7693001e sha256:<H>`).
- **1.2 true.** The node's gate and its `evidence: {pr: 136}` are at `governance/PLAN.yaml:2343-2344 @ 7693001e sha256:<H>`, and CR1 to CR4 exist (`kernel/src/skp.rs:4502-4758 @ 7693001e sha256:<H>`).
- **1.3 true.** `dates` gives done 2026-09-28 (`governance/PLAN.yaml:2350 @ 7693001e sha256:<H>`). The worker's E12 gives mergedAt 2026-09-28T18:15:11Z, a run's output that the reviewer re-runs.
- **1.4 true at B.**
  - The only write to `live` is `mint_for_open`'s insert (`kernel/src/skp.rs:574-593 @ 7693001e sha256:<H>`). My search for `.live` writes under `kernel/src` found only `:583`. The field's type is at `:448`.
  - Its callers outside test code are at `kernel/src/skp.rs:1269-1272 @ 7693001e sha256:<H>` and `kernel/src/skp.rs:1312-1314 @ 7693001e sha256:<H>`. Both are inside `open_dataset`, which runs from `:1106` to `:1336` (`describe` starts at `:1337`).
  - My search for `mint_for_open(` across the worktree, `kernel/tests/` excluded, found no other caller outside test code. `kernel/tests/` holds only test callers.
  - `live_generation` never mints (`kernel/src/skp.rs:595-615 @ 7693001e sha256:<H>`).
  - "Since the merge" is graded at B, as §1 allows. At M, only E13's text is available (Check 2).
- **1.5 true.** `viewport_query` is three steps (`kernel/src/skp.rs:1405-1416 @ 7693001e sha256:<H>`). `require_live` is called at `kernel/src/skp.rs:1472 @ 7693001e sha256:<H>` and refuses without minting (`kernel/src/skp.rs:1666-1688 @ 7693001e sha256:<H>`). CR1 and CR2 assert that no ticket is minted and nothing is emitted.
- **1.6 true, on one reading.** Every racing query that reaches the live check or the attribute step after `begin_close` (`kernel/src/skp.rs:1613-1623 @ 7693001e sha256:<H>`) is refused. Without an end mark, the refusal is `skp.unknown_dataset` (`:1673`, `:1531-1533`, and `:1432-1435` for the resolve step, all `@ 7693001e sha256:<H>`). CR1 at `:4676`, CR2 at `:4553` and CR3 at `:4739` assert it.
  - The reading, for the human and not a finding: a query whose whole call runs before `begin_close` gets `Ok`, and step 2 then cancels its ticket. That is the close's own linearization (`:1613-1616`). I read "racing" as the race that used to mint.
- **1.7 untrue as a condition** (C1). The disjunction holds: `:605-607`, `:1671-1686`, `:1537-1547`, all `@ 7693001e sha256:<H>`.
- **2.1 true.** The pre-merge text is at `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:50 @ 7693001e sha256:<H>` and `:60 @ 7693001e sha256:<H>`. A search for `live_or_mint` finds no code under `kernel/`, only a doc comment in `kernel/tests/session_generation.rs`.
- **2.2 true.** The bullet's words are a byte substring of ADR `:60`, a sub-line span. E5 resolves it there.
- **2.3 true.** The `live` value is `(u64, SessionRef)` with no option (`kernel/src/skp.rs:448 @ 7693001e sha256:<H>`, my span). `EndReport.session` is never absent (`kernel/src/skp.rs:840-849 @ 7693001e sha256:<H>`). The only inserter is the one in 1.4.
- **2.4 true.** This follows from 1.4 and 2.3, read against `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:153-155 @ 7693001e sha256:<H>`. CR1 asserts that the only live entry is B's own reference.
- **2.5 true** (ADR `:50`).
- **2.6 true.** The `let … else` returns `None` before any mark is written (`kernel/src/skp.rs:787-793 @ 7693001e sha256:<H>`). CR4 asserts it (`kernel/src/skp.rs:4602-4639 @ 7693001e sha256:<H>`).
- **2.7 true.** ADR `:29` places the arm in `SkpHost::viewport_query`. The arm is the refusal branch of the attribute step that `viewport_query` calls (`:1415`). The followups form says the same (`governance/forms/kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md:365 @ 7693001e sha256:<H>`), and so does the shell's doc (`frontends/shell/src/streaming/liveTicketSet.ts:72-74 @ 7693001e sha256:<H>`).
- **2.8 true.** The function is at `kernel/src/skp.rs:1511-1553 @ 7693001e sha256:<H>`. A search under `kernel/` finds three callers: one in the product (`:1415`) and the tests at `:4674` and `:4737`.
- **2.9 true.** `attribute_ticket` returns false while closing or with no live generation (`kernel/src/skp.rs:617-635 @ 7693001e sha256:<H>`). The call site is `kernel/src/skp.rs:1522-1525 @ 7693001e sha256:<H>`.
- **2.10 true by reading** (`kernel/src/skp.rs:1526 @ 7693001e sha256:<H>`). Check 5 covers the test.
- **2.11 true** (`kernel/src/skp.rs:1531-1547 @ 7693001e sha256:<H>`). CR3 is at `kernel/src/skp.rs:4704-4758 @ 7693001e sha256:<H>`.
- **2.12 true by reading.** `ended_reason` reads the first mark (`kernel/src/skp.rs:750-759 @ 7693001e sha256:<H>`), and the reason is matched at `:1537-1547`.
- **2.13 true** (`:1531-1533`). The mark is cleared by `forget_dataset` (`kernel/src/skp.rs:827-837 @ 7693001e sha256:<H>`), so "no end is recorded" is read at the call. CR3 drives this branch.
- **3.1 true for what close-races changes.** Decisions 1 to 7 are at `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:23-117 @ 7693001e sha256:<H>`.
  - Decision 3's "Today `invalidate` cannot report it" (`:49`) was made historical by the watcher piece, not by close-races. It is outside the heading's scope, and this is a note.
  - The close-time routes at `:63-65` still hold: `begin_close` leaves `live` in place (`kernel/src/skp.rs:761-770 @ 7693001e sha256:<H>`).
- **3.2 true.** `end_generation` enqueues only on `Some` (`kernel/src/skp.rs:914-918 @ 7693001e sha256:<H>`), and `Some` comes only from the one removal at `:787-793`.
- **3.3 true** (`:761-770`, `:1617-1621` and `:1633`, all `@ 7693001e sha256:<H>`). R2 is at `kernel/src/skp.rs:4760-4797 @ 7693001e sha256:<H>`, my span (the form's ended at `:4789`). Also at `:4222` and `:4308`.
- **3.4 true, on the worker's E14** (an empty diff under `protocol/` from M^1 to M, a run's output) and E1 (this diff has no file under `protocol/`).

## Check 2: E13 classified

- **At B.** `mod tests` runs from `:2441` to `:3402` and `mod ticket_drop_under_lock_regression` from `:3454` to `:5292` (`kernel/src/skp.rs:2441-2442 @ 7693001e sha256:<H>` and `kernel/src/skp.rs:3454-3455 @ 7693001e sha256:<H>`; the closing braces were found by a search for top-level items).
  - Outside test code: `:583` (in `mint_for_open`), and `:1270` and `:1312` (in `open_dataset`).
  - In test code: `:3616`, `:3828`, `:3919`, `:4137` and `:4772`, plus `:4646`, which is a doc comment inside the test module and not code.
- **At M.** I can read only the listing's text, not the tree.
  - `:533` has the same text as B's `:583`. `:1164` and `:1176` have the same text as B's `open_dataset` lines.
  - `:2725`, `:2907`, `:2981` and `:3567` have test-fixture shapes. `:3441` is a doc comment.
  - M's `#[cfg(test)]` boundaries and M's `mint_for_open` callers cannot be checked by reading. See the gaps.
- **Bears out 1.4:** yes at B. With one `live.insert` line at M, the listing is consistent with 1.4 since the merge.

## Check 3: OPEN-1 and the appended item 2

- Read line by line, note item 2 at H is D2's quoted span: `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md:10 @ 7693001e sha256:<H>`, a sub-line span without its outer quotation marks. The byte proof is the reviewer's E4.
- The text found only in D1's item 2 (`…adr-035-and-adr-029…md:16 @ 7693001e sha256:<H>`) is absent from ADR-035 at H. My search finds no match for its opening count word, its "which is gone" phrase or its closing "alone refusing" phrase.
- The words on Decision 3 that the two versions share are D2's own retyping and are carried inside D2's span. §8 item 3 holds.
- D2's arm clauses (2.7 to 2.13) all grade true.

## Check 4: §8, item by item, against H's diff

1. **Held**, on the worker's E1 and E2 and my reading of lines 1 to 158. The reviewer's E2 is the proof.
2. **Held by reading.** The appended text is one blank line, D1 `:11-15`, D2 `:10` inner, and D1 `:17`. It has no pin, cite or comment. E4 is the reviewer's.
3. **Held** (Check 3).
4. **Engaged.** C1 goes to the human. The PR cannot merge before the human's class 5 answer.
5. **Held**, on E1 (one file).
6. **Held.** A search for lines beginning `Status:` or `**Status:**` matches only `:3`, the existing Status line.
7. **Held.** The appended text has no cite of any kind.
8. **Held.** The note makes no tool claim. The worker's run claims name B or H.
9. **Held as far as I can read.** 8 insertions and 0 deletions, at the ceiling. N = 1450 by the worker's run. No scope addition, no `verify-mutation`, no test-text span. The 45-minute budget cannot be checked by me (gaps).

## Check 5: the test facts, weighed under Evidence

- **2.10.** CR3's cancelled-state assertion (`kernel/src/skp.rs:4740-4753 @ 7693001e sha256:<H>`) is already satisfied by the close's `cancel_all_for_dataset` (`:1623`) before the attribute step runs. With `:1526` deleted, it would still pass.
  - `:1526` is the only cancel when a ticket minted after step 2 fails attribution: `end_generation` cancels only the tickets that were attributed.
  - The form's fact holds: no test isolates it.
- **2.12.** My search under the whole worktree finds the arm's two detail strings only at `:1539` and `:1543`, and the direct calls only in CR1 and CR3, both `skp.unknown_dataset`. No test drives the end's-reason branch. The form's fact holds.
- **2.13.** CR3 drives it: an attribution after the close, with `ended_reason` `None`. Its registered mutation (restoring `unwrap_or(ObservedChange)`) is recorded as failing (`kernel/src/skp.rs:4708-4712 @ 7693001e sha256:<H>`). CR1 refuses at `:1472`, not at the arm. The form's fact holds.
- **Weighed.** Each clause describes the code and is true by reading at B, which is what §1 lets the piece claim. No measurement or guarantee in the note rests on a test. So the missing tests are a kernel coverage gap and not an Evidence defect of this piece.
- **For the human, information only:** 2.10 and 2.12 are proven by reading alone. A kernel test node would be the custodian's to propose.

## For the human
- C1 (above): clause 1.7's condition. Answer it in one of the three §9 ways.
- Information only: the reading of 1.6 (Check 1) and the coverage of 2.10 and 2.12 (Check 5).

## The packet's gaps
- I could not read the tree at M: its `#[cfg(test)]` boundaries and its `mint_for_open` callers, for classifying E13 at M.
- The worker's run window, which §8 item 9's budget is checked against.
- Without a shell, the byte-level proofs (E2, E4, D1 and D2 at B against C) rest on the worker's runs, and the reviewer re-runs them.
- The state of E11 (PR CI).

I had no shell, so I leave no background shell. Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
