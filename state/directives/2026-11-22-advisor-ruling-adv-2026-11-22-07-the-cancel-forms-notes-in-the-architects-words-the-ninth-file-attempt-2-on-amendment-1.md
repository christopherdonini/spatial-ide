# The advisor's ruling ADV-2026-11-22-07, under the human's delegation of 2026-11-13, not the human's words: the cancel node's form after its architect gate; both notes in the architect's words, the kernel note at the end as section 10, the ninth file taken; the architect's attempt 2 on Amendment 1 alone before the build

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-22-07.md in the advisory folder, 4814 bytes, sha256 0c0ce6d10d2181adc33d66db4946d8cc47262bf7a53f8bca2d69b5fb511b6f32, last modified at 2026-11-22T05:59:57Z by the file system; the advisor's message naming it received at 2026-11-22T06:00:34.815Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T06:30:45Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-22-07, to the custodian, 2026-11-22. The cancel node's form after its architect's gate (attempt 1, FAIL): the two notes' words, their place, the ninth file, and what closes the gate. Read by me on main at eb1329ed: the architect's report, whole (`state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md`, blob 4ab29fcf); the row of ADR-018's item 1 and its item 2; `cancel_inner` in `engine/src/cancel.rs`; the doc comment above `CANCELLATION_REQUESTED` in `engine/src/trace.rs`. The form itself I have not read whole; this ruling rests on the report's cites into it.

1. **The words of the two notes: the architect's text, as it stands in its report, with one change of mine in the first heading.** The report's bytes govern; copy them by script. Each hash below is the sha256 of the named lines of that blob, each line with its line feed.
   - (a) **The note appended to ADR-018**, after the file's last line: a blank line, a line `---`, a blank line, the heading below, a blank line, then the body. The heading is mine, the one line inside this fence:

```text
## Note (2026-11-22, the advisor's ruling ADV-2026-11-22-07 under the delegation of 2026-11-13): where `cancel_requested` is stamped
```

     The body is the report's line 100, one paragraph, 1717 bytes, sha256 3b06d7a482457338179dadc14d090060f9af6f69a4eec32df7e502228b48bcf1. It begins "Item 1's row defines" and ends "No line above this note is changed."
   - (b) **The note appended to `kernel/CANCELLATION-AND-TRACING.md`**, at the end of the file as its section 10: a blank line, a line `---`, a blank line, then the report's lines 126 to 130 (the heading, the paragraph that begins "Appended", the body), 957 bytes, sha256 29254115ab31c94be206bbb8ebb8c78c7b589f6591d81a46ce0eacb2f4f8197e.
   - (c) No existing line of either file is edited. Both notes are in the piece's diff, in the same pull request as the fix: the ADR note says what `CancelToken::cancel` does after the fix, so it never merges without it.
   - (d) If the build changes where or how often the instant is stamped, the notes' words come back to me before the build's gate.

2. **(a) The place of the kernel note: the end of the file, as section 10.** It moves no line that a filed record cites, and it is how that file already appends.

3. **(b) The ninth file: yes.** `engine/src/trace.rs` joins the Scope for the first sentence of the doc comment above the request mark, and for nothing else in that file. The words are the architect's, the report's lines 218 to 220, sha256 7fb56c15cff5dd0cf3e71f738688d18f867795d0739235c7089885a5660c6258. They replace the two lines that say `cancel()` returned to its caller, which is not what the code does today either.

4. **What closes the gate: Amendment 1, then the architect's attempt 2, on the amendment alone.**
   - The gate ended FAIL and stays FAIL in every record. The human's rule of 2026-11-13 closes a wording-only FAIL with no further attempt only when the ruled words are applied exactly and nothing else changes. Here Amendment 1 holds more than ruled words: D1 to D8, N3 and N4 are written by lead-data from findings the report states without replacement sentences, and N4 adds a constraint on the code. So that rule does not apply, and a second attempt is needed.
   - Attempt 2 reads Amendment 1 and nothing else: C1 in the architect's words; this ruling's items 1 to 3 recorded as ruled, the three texts equal to the report's by the hashes; D1 to D8, N3 and N4 each against the finding it answers. Everything else of attempt 1 is carried forward. If attempt 2 finds only words to correct, it gives them exactly and they are applied with no third attempt.
   - The build is dispatched after attempt 2 ends PASS or PASS WITH NOTES.

5. **My item 3 of ADV-2026-11-22-04 was wrong.** I wrote that after a drop a real `cancel` stamps after the flag. It stamps nothing: the call finds the flag set. The form's answer and the architect's confirmation stand, with the tests they name. The architect's point that the drop must reach the test hook when `stamp` is false goes into Amendment 1 with N2.

6. **For the build's record, as the architect says:** the disclosure that in a traced run an observer polling the flag sees it later by the request mark's duration, and that an untraced run adds one uncontended lock. And its residual: once the wrapper is gone, a foreign `PRODUCER_CANCELLED` from a parallel test in the `skp_admission` binary shows red, and it is not attributed to this cause without evidence. If it shows, it is a finding of its own and comes to me.

7. Nothing here is reserved. The ADR note is an amendment of an accepted ADR, ruled under the delegation; it goes into the human's digest, theirs to overturn.
