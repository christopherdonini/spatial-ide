# The advisor's ruling ADV-2026-11-22-04, under the human's delegation of 2026-11-13, not the human's words: the cancel node's form; OPEN-1 ruled, the form committed now with a finding against ADR-018's wording and an appended note proposed to it and to the kernel note; OPEN-2's assertion in engine/tests/slice.rs joins the Scope; one question for the form

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-22-04.md in the advisory folder, 3330 bytes, sha256 6b2fcda1783e6f9b9a1ee0b371d8eae34638de36e5d882b559aae0b94337f2a6, last modified at 2026-11-22T04:34:39Z by the file system; the advisor's message naming it received at 2026-11-22T04:34:49.806Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T04:37:00Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-22-04, to the custodian, 2026-11-22. The cancel node's form: OPEN-1 ruled, OPEN-2 changed, the rest as you take it. Read by me on main at eb47ee33: the row for `cancel_requested` in ADR-018's item 1 and that ADR's item 2; the same row in section 2 of `kernel/CANCELLATION-AND-TRACING.md`; `cancel`, `cancel_for_drop` and `cancel_inner` in `engine/src/cancel.rs`; the budget assertion in `engine/tests/slice.rs`. The form's draft and its fix are by your message; I read the draft when it is filed.

1. **OPEN-1: neither (a) as it stands nor (b) first. The form goes ahead now, and the piece carries an appended note to ADR-018.**
   - The ADR's row says `cancel_requested` is the moment the cancellation call returns to its caller. The code stamps inside the call, after the flag is published. The fix would stamp before the flag. Neither is the moment the call returns. This is a difference between an accepted ADR's words and the code, and it is older than this piece. A form alone does not settle it: the ADR and the kernel note would go on saying "returns" while the tests rest on another order.
   - The form records it as a finding against the ADR's wording, with the reading the fix relies on: the instant is stamped inside the call, before the flag is published, so it precedes every observation of that flag, and the budgeted interval of the ADR's item 2 measured from it is never shorter than one measured from the call's return. The form says by how much the interval widens, in kind.
   - The form proposes the text of one note appended to ADR-018 and the matching note appended to section 2 of `kernel/CANCELLATION-AND-TRACING.md`. No existing line of either file is edited. The architect's gate reads the proposed text against the ADR. The words are then mine to rule, from the architect's text, before the build's gate; both notes are in the piece's diff and the build's gates read them as ruled.
   - The form's gate does not wait for the note's final words. If the architect finds that the fix changes what the ADR's item 2 budgets, and not only the wording of the instant, it comes to me before any code.

2. **OPEN-2: the same failure, and inside this piece.** The subtraction in `engine/tests/slice.rs` that reads an inversion as zero is a third place where this one cause is hidden. It is attached to this node in the ledger, not given a node of its own. The form's Scope takes that one assertion: after the fix an inversion there fails the test by name, and the form's mutation shows it. If lead-data or the architect sees a reason to keep it out, it comes to me with the reason.

3. **One question the form answers, for the architect's gate.** A drop of a stream publishes the flag without a stamp (`cancel_for_drop`). If that drop comes first and a real `cancel` follows on the same token, the stamp comes after the flag. The form says what the trace promises in that order, and whether a test holds it.

4. **OPEN-3 and OPEN-6: as you take them.** The campaign runs under the machine's holds and yields to sitting work. Its count is supporting evidence, as the human wrote. **OPEN-4 and OPEN-5: as drafted.**

5. Nothing here is reserved. An ADR note is mine under the delegation; this one goes into the human's digest, theirs to overturn.
