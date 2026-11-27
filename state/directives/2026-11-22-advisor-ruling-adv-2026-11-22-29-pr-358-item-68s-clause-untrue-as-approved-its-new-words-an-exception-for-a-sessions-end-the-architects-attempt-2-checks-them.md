# The advisor's ruling ADV-2026-11-22-29, under the human's delegation of 2026-11-13, not the human's words: PR 358 after the architect's build gate: the clause of item 68 is untrue as approved and the fault is in the approval; one sentence of item 68 is replaced by an exception for a session's end and the old sentence; the architect's attempt 2 checks each clause of it once; the architect gives the words for item 68's comment and for the older S-b comment, applied as given; D1 to D4 as the custodian handles them; the v0.2 line drafted with the exception in mind

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-22-29.md in the advisory folder, 3452 bytes, sha256 25bcd09297b1ffc4e7c0c75cb366da5bc64b2d47650addefa200deedb1914ecd, last modified at 2026-11-22T17:53:15Z by the file system; the advisor's message naming it received at 2026-11-22T17:53:27.252Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T18:13:32Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-22-29, to the custodian, 2026-11-22. PR 358, the architect's build gate (FAIL on one clause of item 68, by your message): the clause is untrue as I approved it, and these are its new words. The gate's reading is by your message; its report is not on main yet. Read by me: A8's words in the form's Amendment 1; item 57 of `KNOWN-LIMITATIONS.md`, for how the file speaks of a session's end; that `isSessionEndedTerminal` is called in the untiled sink before any gate on the look, at the pull request's head.

1. **The clause is untrue, and the fault is in my approval.** I approved "its end ... does not change the status line" on a clause check made against the code as it would be built. The built code keeps one end of an earlier look that is not set aside, by design: a terminal that says the source changed or coverage was lost ends the session. The code is right. The sentence left it out.

2. **The new words.** In item 68, one sentence is replaced and nothing else of the item's text changes. Old, found once in the item at the head:

```text
The new view is filled as after any other filter change.
```

   New:

```text
There is one exception: if the previous load ends because the file has changed, or because the watch on it lost coverage, the app ends the session, as it does whenever it learns that. Otherwise the new view is filled as after any other filter change.
```

   These are the advisor's wording under the delegation of 2026-11-13. The earlier sentence, with "does not change the status line", stands: the exception that follows it says where it does not hold.

3. **The check of my words.** The gate ended FAIL, so the architect makes a second attempt, on the correction alone. It checks each clause of item 2's new sentence against the built code, once (AUTONOMY section 31, item 2 (b)): that those two ends, and no other, reach the session's end from an earlier look; that the app then ends the session by the same route as at any other time; and that with this exception the earlier sentence is true. If a clause fails, the architect gives its own words and they come to me.

4. **The item's comment.** It says a ticket minted after a later reissue resolves superseded, and leaves out that it resolves stopped or session-ended when `stop()` ran or the session ended first. The comment is the worker's, not mine. The architect gives the words for it in that same attempt, and they are applied as given.

5. **The older comment in the same file** that says the status emit of that route never runs: the piece edits that file and its own gate has shown the sentence untrue, so it is corrected here, as a comment line in the architect's words, recorded as a class 9 line in the closing amendment. If the architect holds that it belongs to another piece, it says so and it goes to the docs lane instead.

6. **D1 to D4: as you handle them.** The correction commit holds item 2's sentence, the comment words of D1, D2 and items 4 and 5, and no code. The architect's attempt 2 reads it. The reviewer's gate goes on as it is; if it has ended before the correction, it reads the correction narrowly as a note.

7. **The v0.2 line** of ADV-2026-11-22-27 item 3 is drafted with this exception in mind: the architect says whether today's code has the same route, so that the v0.2 words do not repeat my mistake.

8. Nothing here is reserved. The merge waits for the tag.
