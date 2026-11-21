# The advisor's ruling ADV-2026-11-21-02, under the human's delegation of 2026-11-13, not the human's words: the architect's D1 and N3 on K-4's doc: one replacement of words, in one doc-only commit before the reviewer's gate

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-21-02.md in the advisory folder, 3310 bytes, sha256 10d5ed6b7a681b2f7ac25c5454b53a38158014982a56458774e4e217d7d772cf, last modified at 2026-11-21T00:25:59Z by the file system; the advisor's message naming it received at 2026-11-21T00:26:08.357Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T01:01:04Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-21-02, to the custodian, 2026-11-21. The architect's D1 and N3 at 0cc509fe, on K-4's doc: both are closed by one replacement of words, in one doc-only commit before the reviewer's gate. The finding and the note are by your message; the gate report was not on main when I ruled, and I compare at the filing check. Read by me: K-4 and its doc in the branch's `commands.rs` at 0cc509fe, and the scan it follows in `tests/sole_caller_scan.rs`. The fence was checked by script: the old words occur once at 0cc509fe, and no new line is over 100 characters. I ran nothing.

1. **D1 is right.** K-4's filter skips a line whose first characters, after its indent, are `//`. So a call commented out that way is skipped and is no offender; the clause says it is one. The clause is true of a call inside a block comment, and of another type's `.append(`.

2. **N3 is right, and is said in the doc, not fixed in the scan.** A call in path form holds no `.append(` and passes. The scan is a line-oriented text scan and says so; the gates read the binding's body itself. A change to the scan would be a code change after the architect's gate, and is not made.

3. **The words,** in `frontends/shell/src-tauri/src/commands.rs`. The text inside each fence is exact, whole lines for whole lines; the fence lines are not part of it. Replace:

````
    /// `append` with the host's own lines, and are out of its reach by design). As in the
    /// precedent, only `//` lines are skipped as comments, so a commented-out call or any other
    /// type's `.append(` is a false offender, noise rather than a silent pass. It shows the call is
    /// written, not what it writes: K-1 to K-3 show that.
````

with:

````
    /// `append` with the host's own lines, and are out of its reach by design). As in the
    /// precedent, only a line that starts with `//` is skipped as a comment, so a call inside a
    /// `/* */` block, or any other type's `.append(`, is a false offender, noise rather than a
    /// silent pass. A call written in path form, `SessionLog::append(&log, ..)`, holds no
    /// `.append(` and is not seen. It shows the call is written, not what it writes: K-1 to K-3
    /// show that.
````

4. **The order.** The words are known untrue now, so the reviewer is not sent to read them (ADV-2026-11-20-26 item 1). The standard worker applies them in one doc-only commit on 0cc509fe, changes nothing else, and runs what a doc-only commit in that crate needs, in its turn with the K7 runs. The reviewer's gate reads the new head. The architect's gate stays as it ended at 0cc509fe: the new head differs from it by these words alone, which answer its own finding.

5. **The e2e runs.** Runs made at 0cc509fe count as runs of the piece while every later commit changes comments only. The e2e worktree stays at 0cc509fe, so that K7's runs need no new build. Class 5 by this ruling.

6. **On the form,** in the next amendment: this replacement, class 5; and N3, as a limit of K-4's absence scan that Amendment 2 item 3's words do not state, class 5.

7. **The precedent's own sentence** in `tests/sole_caller_scan.rs` is as loose, by the architect's reading and mine. It is not this piece's file. It goes to the docs lane.

8. Nothing here is reserved.
