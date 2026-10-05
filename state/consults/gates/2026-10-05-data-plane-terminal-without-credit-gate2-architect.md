*Custodian's filing note (2026-10-05): PR #176's gate 2, the architect, a scoped re-gate under `AUTONOMY.md` §22 after correction round 1 of 2, for PLAN node `data-plane-terminal-without-credit`, under the tag node:data-plane-terminal-without-credit@g2. Reviewed: cut/data-plane-terminal-without-credit @ 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is b788536eb0f7394cbe993120f71541d5d0b0b9bce143312c2e8292e264a3562e. Write audit PASS: zero write calls (Read 12, Glob 1, Grep 7, SubagentHandback 1). Run window from the transcript: 2026-10-05T11:28:30.281Z to 2026-10-05T11:32:23.958Z. The architect read the code from the read-only export `C:/dev/wt/dptwc-head-1b2e53d4` while the reviewer ran mutations in the worktree. Profile paths redacted at filing: none.*

---

Reviewed: cut/data-plane-terminal-without-credit @ 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1

**Verdict: FAIL, on Documentation only (record).** The fix commit passes. Amendment 4 fails one fail-by-name rule: item 1 is over round 12 (d)'s ceiling. Correctness and Evidence carry forward, because the semantic applicability check holds (scope item 1 below). Gate 2 is the architect's scoped re-gate under AUTONOMY.md §22, after correction round 1 of 2. The next round is record round 2 of 2, the last under the record cap.

**How I read it.** I have no Bash, so I recomputed no hash and applied no mutation.
- Code was read from the export `C:/dev/wt/dptwc-head-1b2e53d4`. The gate-1 export at 3f7b1949 no longer exists, so I took the old text from worker report 2.
- Worker report 2's diff stat agrees with the hunks I can see: 16 insertions and 11 deletions, which break down as transport.rs 8/3, README 4/1, adapter_ws.rs 3/6 and candidate_a.rs 1/1.
- Main's commits come from `.git/logs/refs/heads/main`.
- Nothing below is a quotation.

## Scope item 1: the fix commit 1b2e53d4

**Is every statement of the identity now held to the discard drain? Yes, with one residual (S2-1 below).**
- The identity is now stated only on the discard drain, in three places, each at 1b2e53d4:
  - the `batches_discarded()` doc, `protocol/data-plane/src/transport.rs` lines 256-259;
  - the `note_discarded` doc, lines 229-232;
  - `protocol/data-plane/README.md` lines 174-177.
- Each place names the entry conditions (an owner's cancel with no prior data-plane cancel, or a pump failure) and lists the halt paths and the deferral as dropping queued batches uncounted.
- README lines 172-173 (counts each batch dropped, and `resident_bytes` falls with it) now sit inside a paragraph scoped to the drain, followed by the exclusion sentence.
- No other statement of the identity remains. I grepped the export for `discarded` and the equality wording.
- My S1-1 and the reviewer's S1-1 are resolved.

**Does `batches_discarded()`'s round 5, item 4 declaration stand? Yes.**
- It is a read-only accessor over a counter the shipped writer maintains (`note_discarded`, called from `discard_queued` at adapter_ws.rs lines 371 and 380).
- Its doc says the test suite is its only caller, names the same four tests by full name, and keeps the why sentence.
- The only edit is the scope sentence. The accessor still acts on nothing.

**Is the arm's deletion confined, and does §2d still hold? Yes on both.**
- In `discard_queued` (adapter_ws.rs lines 359-389), the arm for a channel closed with nothing discarded is gone, along with the `discarded` counter and its increment. The doc at lines 362-364 now says the close in the drain is always `ProducerFailed`, which is true: line 371 counts the held batch before the loop.
- adapter_ws.rs's 9 changed lines are those 3 doc lines replaced plus 3 code deletions. The credit wait, the deferral (lines 241-250) and the main loop are untouched.
- §2d's rule that a stream with nothing discarded ends `Completed` is served by the receive wait's closed-channel arm (line 205). That arm is reachable only before any discard. §8 item 10 holds.
- My S2-1 and the reviewer's S1-2 are resolved. No code path is left without a caller.

**Do M5's and M4's observations apply to the corrected code (the semantic applicability check)? Yes, both.**
- **M5** replaces the drain's `None` arm, now the only one (lines 383-385), with `Completed`. Its description applies unchanged, and the deleted arm was unreachable, so the observations at 8f5e622e and 3f7b1949 carry over in meaning. The worker re-observed it at 1b2e53d4: T5 fails at candidate_a.rs:982 with left 0, right 2, the same site and values as the gate-1 reviewer's.
- **M4** targets the deferral block, still at adapter_ws.rs lines 242-250 and byte-unchanged as far as I can see. The worker re-observed it at 1b2e53d4: T4 fails at candidate_a.rs:959 with left 2, right 1.
- **The other mutations.** T4 now pins two workers (candidate_a.rs:944), which closes the reviewer's S2-3 and my gate-1 N-2. M1-M3 and M6-M8 target lines the fix does not touch. M7's increment has moved to transport.rs:235 and M8's literal to adapter_ws.rs:384, with their code unchanged, so their observations carry over.
- The worker's re-observations are worker evidence. The reviewer's g2 re-observation is the gate's own.

## Scope item 2: Amendment 4 (form on main, added at f472312398f1)

**Shape.** It has the defect, the corrected reference and the proof (item 1). It is a correction round with a superseded index, and the index is present: it names Amendment 3's hash parenthesis and the header's Pilot-line pin. Its pins satisfy round 15 (e): 8f4874c184ac and 92a71c30c2b4 are both on main (main log), and f4723123 creates neither.

**Readings and class-3 rows.**
- **Item 2** (the impact-read pin, class 3) stands. The reviewer recomputed the whole-file hash at 92a71c30 at gate 1.
- **Item 3** (the I-7 reading) stands:
  - I-7 (form line 475) ties its 2d path to §2g. §2g (lines 184-188) accounts for the drain's discards.
  - Row D (line 451) counts each batch 2d discards.
  - In 2d's own text (lines 176-181), the deferral waits and does not discard.
  - P-9 (line 465) names T1, T1b, T3b and T5, not T4.
  - So a 2d path is the discard drain, and I-7 has not fired on any observed run.
- **Item 4** stands; scope item 1 confirms it.
- **Item 5** stands. The re-observation at 1b2e53d4 now supports it as well as 8f5e622e.
- **Item 6** (Part 4's data-plane index half void, class 3) stands. It resolves D-4 and §8 item 18 to the kernel's index (see N-2).

## S1 (blocking, Documentation)

**S1-1. Amendment 4 item 1 is over round 12 (d)'s ceiling: a correction over the ceiling, by name.**
- Item 1 has five sentences:
  1. the characterisation of Amendment 3's hash;
  2. "The defect" sentence;
  3. the corrected reference;
  4. the proof;
  5. the statement that the amendment's commit does not create 8f4874c1.
- Sentences 1 and 2 both state the defect, and sentence 1 re-describes Amendment 3's own parenthesis.
- Its operative content is correct: the reference, its rev on main, and a proof route. Part of the overrun is my gate-1 brief, which listed four elements including the not-created note.
- **Fix (record round 2 of 2, the last).** Append Amendment 5 to the form on main: one correction of at most three sentences.
  - The defect: Amendment 4 item 1 exceeds round 12 (d)'s ceiling.
  - The corrected reference: the single-line pin `state/consults/2026-10-05-data-plane-terminal-without-credit-worker-report-1.md @ 8f4874c184ac4b4d13546b47843c643e1fcdb5ec sha256:d58d34f9d1ce6c0d284733d3b1e25a042d04e320290a5cae96a43109dd43d86a`, as the operative text.
  - The proof: the reviewer's `git show` recompute.
  - Its superseded index: Amendment 4 item 1, except that pin.
  - The same amendment may add S2-2's single reference line.
  - No code change, and no other prose.
- If the reviewer's recompute of d58d34f9… does not match, that is the defect to correct instead.

## S2

**S2-1. One residual in the scoped identity, from my own gate-1 wording. It does not block.**
- The drain races the halt signal (adapter_ws.rs lines 375-376), and it returns on a halt with the rest of the queue uncounted.
- So a stream that enters the drain by an owner's cancel and then gets a data-plane CANCEL or a peer close mid-drain ends with sent plus discarded below generated.
- The same holds for a pump-failure entry when the reader's cancel is already in flight, because the pump-failure arm (line 238) is not guarded by `is_cancelled`.
- The new sentences' second clause lists those same events as dropping queued batches uncounted, so read whole the text is not false. Read alone, the first clause is wider than the code.
- Exact wording would be: on a drain that runs to the source's failure or close.
- No observed run fired I-7 (P-9's tests do not interrupt the drain).
- Do not reopen code for this. Record it in the closing record by reference to this report, as a known residual. Optionally, tighten it in a later piece.

**S2-2. Amendment 4's preamble cites round 25, item 2 (d) for naming the fix commit by id, but names no id.**
- Items 3-5 say only "the branch fix commit". The commit did not yet exist at f4723123.
- (d) itself is not triggered: no class-3 test-text span is pinned or named, and item 5 describes T4's change without a span.
- Items 3-5's claims about that commit resolve to 1b2e53d4, as scope item 1 confirms. The record must still name it.
- Fix: one reference line in Amendment 5, `1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1` as the fix commit, or the closing record's commit list (item 10 below).

## N

- **N-1.** Amendment 4 item 3 puts the I-7 phrase in quotation marks, with a capital first letter, under a preamble saying nothing below is a quotation. I-7 at form line 475 is lower-case. It is not presented as verbatim under the round 10 triggers, so it does not block. Future records should drop the marks.
- **N-2.** Item 6's discharge clause names `kernel/README.md`'s index, a section on an unmerged branch rather than a line. It resolves: I read it complete at gate 1, and the reviewer diffed it byte-identical to the consult. The closing record's D-4 pin (item 7) is its line proof.
- **N-3.** Item 2's corrected reference is spread across a sentence rather than written as one pinned token. The closing record should carry it as one line: the impact-read path @ the full id of 92a71c30 sha256:dcb21e03….
- **N-4.** The §7 figures at 1b2e53d4 are the worker's: product 256 (limit 310), tests 478 (490), docs 34 (45). All are within limits and no class 8 is due. The reviewer recomputes them.

## Changes to my gate-1 closing-record list

- **Item 3:** worker report 1 by Amendment 4 item 1's pin, as superseded by Amendment 5.
- **Item 4:** pin T4 at the final head. Its attribute moved to candidate_a.rs:944 with `worker_threads = 2`. Use words and no hash until the merge, then a hash at the merge.
- **Item 5:** add M4 and M5 as also observed at 1b2e53d4: worker report 2's mutation section, by reference, plus the reviewer's g2 re-observation.
- **Item 6:** pin these spans at the merge commit:
  - the `batches_discarded()` doc (at 1b2e53d4, transport.rs lines 250-259);
  - the `note_discarded` doc (lines 227-232);
  - README lines 167-177.
  - Add S2-1's residual, by reference to this report.
- **Item 7:** Part 4's class-3 row is Amendment 4 item 6, by amendment and item.
- **Item 10:** the fix commit is `1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1`.
- **Item 11:** Amendment 4 items 1-6 and Amendment 5, by amendment and item. Also Amendment 4 item 2's pin, written as one line (N-3).
- **Item 12:** the superseded index lists Amendment 4's and Amendment 5's entries.
- **Item 13:** add both gate-2 reports, by path under `state/consults/gates/`.

**Files:**
- `C:\dev\spatial-ide\protocol\data-plane\TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
- `C:\dev\wt\dptwc-head-1b2e53d4\protocol\data-plane\src\transport.rs`
- `C:\dev\wt\dptwc-head-1b2e53d4\protocol\data-plane\src\adapter_ws.rs`
- `C:\dev\wt\dptwc-head-1b2e53d4\protocol\data-plane\README.md`
- `C:\dev\wt\dptwc-head-1b2e53d4\protocol\data-plane\tests\candidate_a.rs`
- `C:\dev\spatial-ide\state\consults\2026-10-05-data-plane-terminal-without-credit-worker-report-2.md`
- `C:\dev\spatial-ide\state\consults\gates\2026-10-05-data-plane-terminal-without-credit-gate1-architect.md`
- `C:\dev\spatial-ide\state\consults\gates\2026-10-05-data-plane-terminal-without-credit-gate1-reviewer.md`
