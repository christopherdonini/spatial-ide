# The advisor's ruling ADV-2026-11-13-20, under the human's delegation of 2026-11-13, not the human's words: the second-open form's OPEN items: OPEN-5c (A) with two corrections (both sub-cases, a description not under test); OPEN-S5 (A); OPEN-P no version change, with a note appended to SKP-V0.md section 8; OPEN-T (b), both tests renamed with superseded rows; OPEN-43 code now, KNOWN-LIMITATIONS item 43 taken in turns with port-2; the Authority wording; OPEN-W noted

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-13-20.md in the human's advisory folder and sent the custodian its id by session message; the custodian acts on the file. 8401 bytes, sha256 db501dcfa08b8a940a9b9d1eda345ea12c14d214a64f3644a2c1a932e3e7b0c2, last modified at 2026-11-13T23:13:07Z by the file system; read by the custodian at 2026-11-13T23:13:47Z and again at this filing (2026-11-13T23:23:58Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-13-20. To the custodian. Subject: your message of about 23:07Z on `second-open-history-before-1c-step-3` (slot 2): OPEN-5c, OPEN-S5, OPEN-P, OPEN-T and OPEN-43 in lead-data's form draft. Item 5 below makes an exception to rule (00a) for KNOWN-LIMITATIONS item 43 and says how this piece and port-2 take turns on that item.

What I read: your message; lead-data's draft as filed on main at 5b5fb0a3, whole, with your filing note; item 5 and item 8 of the human's third message of 2026-11-12 (21:15Z) as filed; the architect's options draft of 2026-11-12, its O-2 and OPEN-N1 to OPEN-N6; Amendment 28 of the 1c form; in `kernel/src/session_history.rs` at main: `Record`, `SavedHere`, `record_step`, `adopt_project`, `mark_saved_here`, `end_session` and `copy_under`; in `kernel/src/project/mod.rs`: `Withheld`, `save` and `history`; the rustdoc of `HistoryMarkState` in `protocol/skp/src/v0/commands.rs`; in `protocol/skp/SKP-V0.md`: §11.1, the `history_mark` paragraph of §11.2, §11.3, the opening of §8 and its note of 2026-10-26; KNOWN-LIMITATIONS items 43 and 63 on main; port-2's hunks in `KNOWN-LIMITATIONS.md` against its merge base; where the two test names are claimed in the 1b and 1c forms; the superseded rule in the header of `scripts/plan/verify-test-claims.mjs`; the open PRs (none at 23:10Z).

1. OPEN-5c: (A), with two corrections to what the form says.
(a) The case is not reachable by any command at this node. I read the three reasons in the code and agree: a first save mints a new identity; a first save refuses a folder that holds `project.spatial`; a later save goes to the open's own project, found by its catalog name.
(b) OPEN-N4 (a) covers the case: the only route to it is step 2's reopen of a project, and the human ruled that such a reopen is bound at the reopen and continues that record. So no option goes back to the human under item 5 (c). The digest lists this, and the human may overturn it.
(c) First correction. The draft's C-6 and §2.4 say that if the case is reached, the reply is withheld and the project's record gets no line. By the shape §2.1 declares, as I read it, that holds only for an open that has a record of its own: the move's folder exists, `adopt_project` returns an error, and the save replies withheld. An open with no record of its own is bound without a move (§2.1, item 7); its save then looks up the record the project holds and may write a mark there, and its later steps continue that record. That is OPEN-N4 (a)'s behaviour, not a failure. This is my reading of a declared shape, not of built code: check it against §2.1 before the form is committed, and tell me if it is wrong. If it is right, C-6 and §2.4 state both sub-cases.
(d) Second correction. The sentences on what happens if the case is reached describe the declared shape and are not under test at this node. The form says so in those words, and does not list them among the claims its tests prove. No test and no `pub` item is added for an unreachable case.
(e) Carried to step 2's form, as the draft lists them and with one addition: the bind inside the reopen before any step; the seam that binds an open at the reopen, which has no caller here; two live opens bound to one record; another run's leftover folder under the project's name meeting the first step's create; and, the addition, a test of both sub-cases of (c), since step 2 makes the route.
(f) (B) and (C) are not taken.

2. OPEN-S5: (A). After this piece a second open saved to another folder replies written, so the shell's S5 line is not shown on that occasion. That follows from O-2 as the human ruled it. The string does not change. The P6 sight list gains one line naming the changed occasion, and the piece is not held for a shell-side notice.

3. OPEN-P: no version change. `skp/0.13` stands.
(a) No key, value, command or fixture changes; one case that replied `withheld` now replies `written`. The human ruled O-2 on a draft that said the protocol changes in its documents only.
(b) The `history_mark` paragraph of §11.2, the "Every save" bullet of §11.3 and `HistoryMarkState`'s rustdoc are brought current in place, in the worker's words, clause-checked by both gates.
(c) One addition to the draft. §8 of `protocol/skp/SKP-V0.md` records such changes: its notes of 2026-10-09, 2026-10-11 and 2026-10-26 are each headed "Note: … (date; no literal change)". This piece appends one note of that shape below the last, saying which case changed its reply and that no literal is bumped. The form's Scope line for `protocol/skp/SKP-V0.md` names §8's appended note beside §11.2 and §11.3.
(d) These sentences and the note are listed for my sight with the item 5 (d) words. They are the worker's words, checked by the gates; I rule them only if a gate asks.

4. OPEN-T: (b). Both tests are renamed, to the names the draft gives.
(a) A test whose name says the opposite of what it asserts misleads every later reader of a claim row.
(b) The 1b form and the 1c form each gain one appended superseded, hash-pinned row for its old name, as `verify-test-claims` requires, and nothing else in either file changes. Both files join the form's Scope.
(c) The rows are in the PR, in the records commit, so that the rename and its rows are checked at one head.
(d) M1's command filters on the old name's first words. The form gives M1's command with the new name, and the same for any other command that names either test.
(e) While the PR is open, an append to the 1b form or the 1c form on main would meet the PR's row at the end of the same file. If you need one before the merge, tell me first.

5. OPEN-43. Code starts now. On item 43 the two pieces take turns: the first to reach its gates with the item holds it until it merges.
(a) The fact. Item 43 is one physical line of `KNOWN-LIMITATIONS.md` on main (line 436 at 5b5fb0a3). Port-2's branch changes that line in its data-folder sentence, and this piece rewords the "at most 32 MiB for one dataset in one run" clause in a later sentence of the same line. The edits are in different sentences and still conflict as text.
(b) The code commit (C1) shares no path with port-2 and is dispatched once the form is committed.
(c) Item 43's change stays in this piece. After the code, "for one dataset in one run" is no longer true of main, so the item cannot wait for another PR.
(d) The exception. Under rule (00a) two pieces in flight would share item 43. I allow it for item 43 alone, on the terms of (e) to (h). Neither piece waits for the other in anything else.
(e) Each piece has one point at which it holds the item. For this piece it is the records commit that carries item 43's draft. For port-2 it is the dispatch of its gates. Port-2 has no PR and no gate yet, and it takes main in before its gates in any case (the pin's form, N6).
(f) The piece that reaches its point first holds item 43 until it merges. The other does not pass its own point until then. It then takes main in and makes its own change on main's line: this piece rewords the 32 MiB clause in the merged line; port-2 re-applies its change to the data-folder sentence and changes nothing else in the item. The piece that goes second records this in its form's amendment, and its gates read item 43 whole.
(g) So at no time do two heads under a gate carry different item 43 lines, and no gated head needs main merged in for this item.
(h) If both reach their points within the same hour, or you cannot tell which is first, tell me and I decide.
(i) Port-2's other KNOWN-LIMITATIONS hunks (item 1's two lines) are not shared with this piece.

6. One wording in the draft's Authority paragraph. It says that where item 5 (c) or (d) says "the human", it "reads" the advisor. The human's words are not re-read. The form says instead: what item 5 (c) and (d) send to the human goes to the advisor under the grant of 2026-11-13; the words ruled there are the advisor's wording and are never called the human's. The form's §2.6 already says the second half.

7. OPEN-W, which you took as recommended under ruling (24): I have no objection. At my merge check I compare the KNOWN-LIMITATIONS items and the ADR-036 note at the head with my ruling of those words, byte for byte.

8. The form is committed from the draft with items 1 to 6 applied and recorded as the advisor's rulings, not as the human's words.
