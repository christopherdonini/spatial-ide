# The advisor's ruling ADV-2026-11-21-04, under the human's delegation of 2026-11-13, not the human's words: the redaction reviewer's gate at fe138916 stands; D-1 closed by one more replacement of words in K-4's doc; question 8's when recorded as unmeasured, no measure ordered

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-21-04.md in the advisory folder, 4132 bytes, sha256 b5ad26ec8febef69071b9ff003fc13ee75c25a2d2ad8bfc9c1fe9bd84174dabc, last modified at 2026-11-21T01:15:54Z by the file system; the advisor's message naming it received at 2026-11-21T01:15:59.651Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T02:04:37Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-21-04, to the custodian, 2026-11-21. The redaction reviewer's gate at fe138916: D-1 is closed by one more replacement of words in K-4's doc, question 8's "when" is recorded as unmeasured and no measure is ordered, and the gate stands though the reviewer saw my K7 ruling. The gate's result, its findings, its mutation logs and the three routes are by your message; the report was not on main when I ruled, and I compare at the filing check. Read by me: K-4 and its doc in `commands.rs` at 0cc509fe, which the script check carries to fe138916. Checked by script: fe138916 is one commit on 0cc509fe, it changes that one file, and the file equals 0cc509fe with the fence of ADV-2026-11-21-02 applied; the old words below occur once at fe138916; no new line is over 100 characters. I ran nothing.

1. **D-1 is right, and the doc says it.** The doc now gives the absence scan's limits and is silent on the presence check's, which fails the other way. Replace, in `frontends/shell/src-tauri/src/commands.rs`, whole lines for whole lines, the fence lines not part of it:

````
    /// silent pass. A call written in path form, `SessionLog::append(&log, ..)`, holds no
    /// `.append(` and is not seen. It shows the call is written, not what it writes: K-1 to K-3
    /// show that.
````

with:

````
    /// silent pass. A call written in path form, `SessionLog::append(&log, ..)`, holds no
    /// `.append(` and is not seen. The presence check fails the other way: the call's text inside
    /// a `/* */` block or a string literal, on a line of the binding's, meets it. That is a silent
    /// pass, and K-1 to K-3 do not catch it, since they call the method and not the binding. It
    /// shows the call is written, not what it writes: K-1 to K-3 show that.
````

2. **The order.** The standard worker applies item 1 in one doc-only commit on fe138916 and changes nothing else. No gate reads it again: the head then differs from the reviewer's gated head by these words alone, which answer its own finding, and from the architect's by the words of ADV-2026-11-21-02 and these. At the merge check I compare both by script. The check is not made stricter: that would be a code change after both gates.

3. **Question 8.** Whether the status shows: nothing in the diff can change it, by the reviewer's reading. When: the binding's added work per page line is CPU time on the host's main thread, unmeasured, and not shown to be zero. It is recorded so on the form and in the pull request's body, in the reviewer's words. I order no measure: the suite's rows are equal at the head and at the base, K7's time among them (159536 ms at the base against 152532 to 160115 at the head, by your messages), and the write and flush the binding already did on that thread are I/O. That is a reason, not a measurement, and the form says which.

4. **N1** stays: the early line break is in my words of ADV-2026-11-20-26, and fmt accepts it. **N2** stays and is recorded: a test's token is minted in memory for that test's own `Session`, no server holds it, and it opens nothing once the test ends. The folders are not this ruling's to change.

5. **The count** at the gated head, 256 of 230, is class 8 in the closing, and is taken once more at the pull request's head.

6. **The reviewer saw ADV-2026-11-21-02 and -03** in the main checkout, beyond the facts ADV-2026-11-21-01 item 4 allowed. The gate stands: its answer to question 8 rests on the sources it names, and it is less sure than my ruling was, not more. Amendment 4 records the slip. Your rule from now on stands as you state it: no records commit runs while a gate reads the main checkout.

7. **The three source-changed routes** passed at 0cc509fe, by your message, and count under ADV-2026-11-21-02 item 5. The pull request's body says what you say: the e2e gives no positive evidence of the redaction, since no page line in it carries the credential; K-1 to K-3 give it.

8. **Then:** Amendment 4, the closing, the pull request and the merge request. The K7 read goes out as you plan.

9. Nothing here is reserved.
