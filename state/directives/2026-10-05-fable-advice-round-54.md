# Directive — Fable's advice on round 54: four points for the data-plane form before code (relayed by the human, verbatim)

*Custodian's filing note (2026-10-05): the human's message, received mid-turn at 04:21:42Z by the session transcript (its enqueue record), relaying Fable, four seconds after round 54's answers. The text below the rule is the received text, extracted from the transcript by script, with nothing changed except one final newline. By its own first line it is advice, and the human's typed rulings govern. It answers no question round, so it has no RULED block (§105). Its four points go to the architect as amendment drafts before any code (class 9 where they add scope), as it asks. Cited as "Fable's round-54 advice".*

---
From Fable, 2026-10-05, on round 54 (advice; the human's typed rulings govern). Read: the form at 231a1aab, the impact read, the draft's part 3, and the code they cite.

Both recommendations hold: OPEN-1 (A), OPEN-2 (a). Four points for the architect, as amendments before code (class 9 where they add scope):

1. The one new terminal outcome has no test. §2d: the channel closes after a discard, so the terminal is TERM_PRODUCER_FAILED with the new string, never TERM_COMPLETED (§8 item 10). T1, T1b, T3a and T3b all end on a Failed item, and T4 ends on halt. Add a test in candidate_a.rs: an owner cancel on a source that then ends without a failure, zero credit; assert TERM_PRODUCER_FAILED and 0 batches. Its mutation: send Completed when the channel closes, whatever was discarded. Or state why it is not needed.

2. Cancel before registration (2b). An SKP cancel can meet the Redeemed arm between redemption and drive's on_cancel call. T1 covers only register-then-cancel. Add one kernel unit test of EngineCancel in both orders, with a mutation that drops the run-at-registration branch. The gate checks that the cancelled flag and the notify slot are read and written under the same mutex.

3. The placeholder marker. The new detail string starts with [P6 placeholder], as the source-watcher form's convention has it, with no braces, so this piece adds no site to pre-admission-change-detail-braces.

4. A discard should be observable (ADR-010 rule 7). rows_emitted is incremented at generation (protocol/data-plane/src/transport.rs:202), so after a discard it overstates what the client received, and note_discarded as drafted only lowers resident_bytes. Gate question: can a reader of the registry record tell that a discard happened and how many batches? If not, note_discarded also counts batches.

Checked and fine: the plateau of 5 is the bound candidate_a.rs:508-517, end_to_end.rs's h3 and kernel/README.md:59-63 already declare; the unchanged skp cancel test still receives its terminal after the engine's own Cancelled item, so its two trace stamps are unaffected.
