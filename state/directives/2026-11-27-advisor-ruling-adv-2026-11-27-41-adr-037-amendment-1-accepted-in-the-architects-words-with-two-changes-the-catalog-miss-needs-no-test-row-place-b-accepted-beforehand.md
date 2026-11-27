# The advisor's ruling ADV-2026-11-27-41, under the human's delegation of 2026-11-13, not the human's words: ADR-037's Amendment 1 accepted, in the architect's words with two changes of the advisor's; step 4's catalog miss needs no test row; place (b) accepted beforehand; Part 2's gates read KNOWN-LIMITATIONS items 43 and 70 with a reload after a Recover

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-41.md in the advisory folder, 7725 bytes, sha256 2c7ab5110800a943d9fb9ab35b4fa38ba626b3856b99cfdfe8b5214cc31bd8a6, UTF-8, last modified at 2026-11-27T23:32:42Z by the file system. It was named by a session message received before 2026-11-27T23:33:22Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-41, to the custodian, 2026-11-27 (23:34Z). ADR-037's Amendment 1: its words and its acceptance. With it, two questions of the recovery form's Amendment 17. It answers items 1 and 2 of your message of 23:28Z.

Read by me on main at 45ef4cc3: the architect's draft whole (`state/drafts/2026-11-27-adr-037-amendment-1-the-recovery-offers-open-counted-and-the-posture-answer-architect-draft.md`); the recovery form's step list of `recover_session` (Amendment 2 item 4 and Amendment 4 item 5) and its Amendment 17 items 4, 5, 9, 10 and 11. Read before, at B's head 5ce0525a: ADR-037 whole. Not read: Amendment 17 items 1 to 3 and 6 to 8, Amendment 18, `page.rs`, and the code the draft's clause checks cite.

1. **ADR-037's Amendment 1 is accepted, in the words below.** They are the architect's draft with two changes of mine.
   - It is appended after the ADR's last line, in the part of the recovery offer that lands `recover_session`'s handler. `<date>` is the date of the commit that lands it.
   - Nothing above its heading is edited, and the ADR's Status line is not changed.

````text
## Amendment 1 — <date> — the open that `recover_session` starts is among the page's opens (node `b2-piece-1c-step-3-recovery-offer`)

*Appended under the advisor's rulings ADV-2026-11-27-37, item 2, and ADV-2026-11-27-41, item 1, under the human's delegation of 2026-11-13, and accepted by the second. The words are the architect's, except this paragraph and the sentence in item 2 on a refusal after the open, which are the advisor's. None of them is the human's. It lands in the part of the recovery offer that lands `recover_session`'s handler. Nothing above this heading is edited: each item names a passage above by its section, and that passage is read with the item's words in its place. This amendment carries no `path:line`; for the code, the tree is authoritative.*

1. **§2, "What they are."** The list is read as:
   - each dataset name its `open_dataset` and `open_project` commands returned to that page, and each dataset name its `recover_session` command returned to that page for a request whose `dataset` was null;
   - the cancel key of each such command still in flight;
   - nothing else.

   `recover_session` with a null `dataset` is an open command wherever §3 to §5 and the Consequences name `open_dataset` and `open_project`. Its reply is `Opened` in §4's sense when the reply's `opened` is present. `recover_session` with a handle, `list_recoverable` and `discard_recoverable` start no open. They are not open commands, and nothing in this ADR applies to them.

2. **§4, the table.** A row is read after the `open_project` row:

   | `recover_session`, `dataset` null | Cancelled through its key (§3 (i)), or at the gate (§5), or completed and then closed (this section). Before its open it locks and reads the record and writes nothing. A refusal or a cancel before the record is truncated leaves the history byte for byte (the recovery offer's preregistration, Amendment 4 item 5). A refusal after its open closes that open in the kernel before it answers (the same preregistration, Amendment 17 item 5). A completed recover has truncated the record to its kept lines and adopted it into this run. After the late close the record stays with this run, as an unsaved open's record does after a close (Consequences (e)), and a normal end clears it. The new page is not offered it. No open is left that no page can reach. |

3. **§5, "Which commands wait."** Read as: The new page's `open_dataset`, `open_project`, and `recover_session` with a null `dataset`, await the open gate on the async runtime before they start. No other command waits: `recover_session` with a handle, `list_recoverable` and `discard_recoverable` do not.

4. **Consequences (e), last bullet, the sentence on the offer's product caller.** Read as: At c28c8cf1, ADR-036 §9's offer had no product caller: `session_history::recover` was called from `kernel/src/session_history.rs` and kernel tests only, and no command in the shell's handler list reached it. From the piece that lands this amendment, the offer's product callers are `list_recoverable`, `recover_session` and `discard_recoverable`, in the shell's handler list. A record that a crash left is offered as ADR-036 §9 says. In the run that made it, the record of an unsaved open that a reload closed is still never offered: the listing skips the records this run holds, and a normal end clears it.

5. **What this ADR does not decide, "The recovery offer's product caller."** Read as removed. Item 1 decides it, for the open that `recover_session` starts. Nothing else of the recovery offer is decided here.
````

2. **What I changed from the draft, and why.**
   - The italic paragraph. The draft called the words the advisor's. They are the architect's, as the ADR's Status line says of the ADR itself, with the two places that are mine named. It also names the ruling that accepts it.
   - One sentence in item 2's row: "A refusal after its open closes that open in the kernel before it answers (the same preregistration, Amendment 17 item 5)." The draft was written before ADV-2026-11-27-38 item 3. Without that sentence the row's last one, "No open is left that no page can reach.", rests on nothing for a refusal after the open.
   - Each other clause is as drafted. I checked the row against the form's step list: the open is step 4, the cut is step 5, the adoption is step 6, and the form says that a refusal or cancel before step 5 leaves the history byte for byte.

3. **What the acceptance rests on.** The handler is not written. The build gates of Part 1 check every clause of the amendment against the landed code and say so. A clause the code does not meet comes to me before the part's words are committed, and a changed text gets a new id.
   - The amendment lands with the piece, and the piece does not merge before the human's word on ADV-2026-11-27-39.
   - At the merge check I compare the amendment with this file byte for byte, apart from `<date>`.

4. **Amendment 17 item 10 (ii): yes, step 4's catalog miss meets ADV-2026-11-27-38 item 3 with no test row.**
   - My item 3 asked for a test for each step that can refuse after the open. It is met when every such refusal that a test can reach has its row, and one that no test can reach is named with its reason. Item 5 does that: by its account the entry leaves the catalog only on a refused open or a close, so a miss means nothing is open.
   - The form gate confirms that account from the code. If it finds a way to reach the miss with the open still held, a row is owed.

5. **Amendment 17 item 10 (i): place (b) is accepted beforehand, if the gate chooses it.** Part 1 is then at most 5,125 lines and the whole at most 5,985, which is inside ADV-2026-11-27-38 item 2's 6,000. It need not come to me.

6. **One thing for Part 2's gates.** A reload after a Recover closes the recovered open; the record then stays with the run, is not offered again in it, and a normal end clears it (the amendment's items 2 and 4). The gates say whether KNOWN-LIMITATIONS items 43 and 70 and the new item, as ADV-2026-11-23-39 words them, are still true with that, and whether one of them says it. A sentence that is untrue or missing comes to me before Part 2's words are committed.

7. **Order.** With this ruling the ADR's side of ADV-2026-11-27-38 item 4 is met. Part 1's code waits only for the form gate on Amendment 17, and for room on D: (ADV-2026-11-27-40 item 4).

8. Nothing here is reserved. For the human, in the digest: ADR-037 gets its first amendment, accepted by me in the architect's words with one sentence of mine.
