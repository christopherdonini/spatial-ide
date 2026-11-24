# The advisor's ruling ADV-2026-11-23-39, under the human's delegation of 2026-11-13, not the human's words: the recovery offer's strings R-S1 to R-S12 and KNOWN-LIMITATIONS items 43, 70 and the new item, worded

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-23-39.md in the advisory folder, 7975 bytes, sha256 79be95c6af7fd58be1ba910e37ccb6951262177d09d4cdcc19e905abbd14cc2a, last modified at 2026-11-23T23:31:37Z by the file system. The advisor's message naming it was received at 2026-11-23T23:31:46Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-23-39, to the custodian, 2026-11-23 (23:32Z). The piece `b2-piece-1c-step-3-recovery-offer`: the words of its strings R-S1 to R-S12 and of KNOWN-LIMITATIONS items 43, 70 and the new item, owed by ADV-2026-11-23-29 item 9 and ADV-2026-11-23-38 item 11. Read by me on main at 965a7974: the form's sections 2.1, 2.2, 2.7, 2.8 and 2.10 (`governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md:45-61`, `:139-200`), its item 76 texts (`:507-513`), R-S11 and R-S12 (`:650-652`), Amendment 4 items 1 to 4 and 10 (`:905-1028`, `:1241-1264`), Amendment 6 items 15 and 16 (`:1571-1597`); the first gate's N-9 (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect.md:279-307`); the attempt 7 report; `KNOWN-LIMITATIONS.md` items 43 and 70 with their comments. No code of this piece exists yet, so every clause below rests on the form's rules. These are the advisor's words, not the human's.

1. **The strings.** Each is given without the placeholder mark.
   - R-S1: `Unsaved changes from a session that did not close normally`
   - R-S2: `{file}, last change {time}`
   - R-S3: `Recover` and `Discard`
   - R-S4: `{file} has changed since then: {components}.`
   - R-S5: `{file} cannot be found or read, so these changes cannot be recovered. Discard removes them from this computer.`
   - R-S6: `This project has changes that were not saved before an earlier session of the app ended, last at {time}.`
   - R-S7: `More unsaved sessions are kept than are shown here.`
   - R-S8: `These changes are in use in another window of the app.`
   - R-S9: `These changes can no longer be read.`
   - R-S10: `These changes can be recovered only right after the project is opened, before any change is made.`
   - R-S11: `These unsaved changes cannot be read. Discard removes them from this computer.`
   - R-S12: `These unsaved changes were made by a later version of the app, which this version cannot recover. Discard removes them from this computer.`

2. **What I changed from the drafts, and why.**
   - R-S5, R-S6 and R-S10 are the first gate's words (its N-9).
   - R-S8: "open" becomes "in use". The code also answers this way while another window only lists the record, and for a session whose project history another window holds (Amendment 4 item 5's step 3a).
   - R-S11: "can no longer be read" becomes "cannot be read". A record listed this way may never have held a step.

3. **Item 43.** Two things change; every other sentence of the item stays byte for byte.
   - Its title becomes: `**43. A crash leaves the session's filter and style changes on this machine, and the app offers them back later.**`
   - The sentence `If the app crashes or is ended from outside, the file stays, and this version neither offers to recover it nor removes it.` becomes: `If the app crashes or is ended from outside, the file stays. The app offers it back the next time it starts or, for a saved project, when that project is next opened; items 70 and <N> say when it does not. Discard removes it, and until you answer, it stays.`
   - `<N>` is the new item's number.
   - The title and that sentence were approved by the human as drafted (the item's comment). They state what this piece ends, so they are replaced under the grant's item 2. The item's comment says which words are now the advisor's and names this ruling. I tell the human.

4. **Item 70,** whole, in place of its present title and paragraph:

````text
70. **A project's session history that an earlier run left is offered back when the project is opened again only if it holds changes that were not saved.**
    When a project is saved, the session history of that open is kept under the project's own identity in the `sessions` folder of item 43. If the app crashes, that folder stays. Opening the project in a later run reads it. If it holds changes that were not saved, the app offers them back, with Recover and Discard. If it holds none, the app clears it at that open, with no question: the save it records wrote its changes to the project file. While the offer is unanswered, or while another window of the app holds that history, the later run's steps go to a record of their own, and a save of the project shows the line that the session history holds no saved-here mark for the save. A history from which nothing can be recovered, or that a later version of the app made, is listed with Discard only. A project opened again in the run that saved it continues that run's history for the project, when it has one, and makes no file of its own.
````

5. **The new item,** at the next free number at Part 2's base:

````text
<N>. **After a crash the app offers a session's changes back, but not everything is restored and not every session is listed at once.**
    - Recovering restores the applied filter and each style value. It does not restore the filter editor's clauses or the map view.
    - A session whose data cannot be found or read can only be discarded, and no re-link is offered.
    - A project's offered changes can be recovered only right after the project is opened, before any change is made. After a change, Recover is refused and says so, and the offer comes again when the project is next opened.
    - A start examines at most 64 unsaved sessions and lists those it can offer; the others are examined at a later start, as examined ones are recovered or discarded, or leave as the bullets below say.
    - A session whose changes were moved into a saved project's session history, as after a crash during a save, is not listed at a start. It is offered as that project's when the project is next opened, and it is removed when that project's history is recovered, discarded or cleared. Until then it takes one of the 64 places.
    - A session that never saved is not listed at a start, and the start says that more are kept, while another window of the app holds a saved project's session history made from the same data at the same place, while the app cannot read one of the saved projects' session histories that could hold it, or while more than 256 saved projects' session histories are kept on this computer. Each such session also takes one of the 64 places. A saved project's session history with no change after its last save leaves when that project is next opened. One with changes after it leaves when its offer there is answered, as item 70 says.
    - When more than 256 sessions that never saved are kept, when another window of the app is listing its sessions at that moment, or when the session it was moved from cannot be locked or read, a saved project's session history that is recovered, discarded or cleared may leave behind that session. It is then listed at a later start, and holds only changes the project's history held.
````

6. **Where the new item depends on the build.**
   - Its first bullet waits for what the worker establishes under section 2.7. If the filter editor's clauses are restored, its second sentence becomes `It does not restore the map view.`
   - Its third bullet is mine and no draft held it. It follows R-S10 and the form's rule that an unanswered entry leaves the record. If the code does otherwise, the gate's words come to me.
   - Its fourth to seventh bullets are the form's drafts as its Amendment 4 item 10 and Amendment 6 items 15 and 16 leave them. The seventh gains the case of ADV-2026-11-23-38 item 3, and its "the session it was moved from" moves forward so that the sentence reads once.

7. **How they land.** The strings land in Part 1 and the three items in Part 2, as the form's Amendment 10 has it. Each item's comment says the words are the advisor's, names this ruling, and names the code by symbol. The build's gates check every clause against the code. A finding on a word of mine comes back to me with the gate's words. At the merge check I compare each with this file byte for byte.

8. Nothing here is reserved.
