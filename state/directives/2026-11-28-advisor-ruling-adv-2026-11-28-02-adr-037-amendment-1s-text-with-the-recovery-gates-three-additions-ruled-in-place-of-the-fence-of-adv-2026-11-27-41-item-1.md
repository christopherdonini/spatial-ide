# The advisor's ruling ADV-2026-11-28-02, under the human's delegation of 2026-11-13, not the human's words: ADR-037's Amendment 1 after the recovery form gate's N-49: its text, with the gate's three additions ruled, in place of the fenced text of ADV-2026-11-27-41 item 1; a listing that comes before an earlier page's recover has locked its record, for the gates of both parts; items 2 to 8 of ADV-2026-11-27-41 stand

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-02.md in the advisory folder, 8959 bytes, sha256 33a7704af792b3a82f9f4b94812997b82dc450eee137eadc84895f820f1412ef, UTF-8, last modified at 2026-11-28T01:21:47Z by the file system. It was named by a session message received before 2026-11-28T01:30:37Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-02, to the custodian, 2026-11-28 (01:22Z). ADR-037's Amendment 1 after the recovery form gate's N-49: its text, with the gate's three additions ruled. It is the ruling ADV-2026-11-27-46 item 6 said would follow, and it replaces the fenced text of ADV-2026-11-27-41 item 1.

Read by me: on main at 4e7f48ad, the gate's report whole (`state/consults/gates/2026-11-28-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-8.md`); in the recovery form, §2.3's listing rule, Amendment 2 item 4, Amendment 4 item 5's step lists, and Amendment 17 items 1 to 11. At B's head 5ce0525a: ADR-037 whole. My ADV-2026-11-27-41. Not read: `page.rs` beyond its log types, and the kernel code the form cites. The handler and the kernel's steps are not written, so every clause below rests on the form.

1. **ADR-037's Amendment 1 is accepted in the words below.** They are the text of ADV-2026-11-27-41 item 1 with the changes item 2 names.
   - It is appended after the ADR's last line, in the part of the recovery offer that lands `recover_session`'s handler. `<date>` is the date of the commit that lands it. Its number is given at landing (ADV-2026-11-27-44 item 3).
   - Nothing above its heading is edited. The ADR's Status line and the row in `docs/README.md` are not edited (ADV-2026-11-27-46 item 6).

````text
## Amendment 1 — <date> — the open that `recover_session` starts is among the page's opens (node `b2-piece-1c-step-3-recovery-offer`)

*Appended under the advisor's rulings ADV-2026-11-27-37, item 2, ADV-2026-11-27-41, item 1, and ADV-2026-11-28-02, item 1, under the human's delegation of 2026-11-13, and accepted in the text the last of them gives. The words are the architect's, except these, which are the advisor's: this paragraph; in item 2's row, the sentence on a refusal after the open, the sentence on a refusal of the truncation and the three sentences on the listing; and item 6. None of them is the human's. It lands in the part of the recovery offer that lands `recover_session`'s handler. Nothing above this heading is edited: each item names a passage above by its section, and that passage is read with the item's words in its place, or with them added where the item says so. This amendment carries no `path:line`; for the code, the tree is authoritative.*

1. **§2, "What they are."** The list is read as:
   - each dataset name its `open_dataset` and `open_project` commands returned to that page, and each dataset name its `recover_session` command returned to that page for a request whose `dataset` was null;
   - the cancel key of each such command still in flight;
   - nothing else.

   `recover_session` with a null `dataset` is an open command wherever §3 to §5 and the Consequences name `open_dataset` and `open_project`. Its reply is `Opened` in §4's sense when the reply's `opened` is present. `recover_session` with a handle, `list_recoverable` and `discard_recoverable` start no open. They are not open commands, and nothing in this ADR applies to them.

2. **§4, the table.** A row is read after the `open_project` row:

   | `recover_session`, `dataset` null | Cancelled through its key (§3 (i)), or at the gate (§5), or completed and then closed (this section). Before its open it locks and reads the record and writes nothing. A refusal or a cancel before the record is truncated leaves the history byte for byte (the recovery offer's preregistration, Amendment 4 item 5). A refusal after its open closes that open in the kernel before it answers (the same preregistration, Amendment 17 item 5). A refusal of the truncation itself leaves the history byte for byte or truncated to its kept lines, and a later listing reads the same steps either way (the same item). A completed recover has truncated the record to its kept lines and adopted it into this run. After the late close the record stays with this run, as an unsaved open's record does after a close (Consequences (e)), and a normal end clears it. The listing does not wait at the gate (§5). It skips a record this run holds and a record whose history is locked, so it lists neither a record that a recover has adopted nor one that a recover in flight has locked. When a recover in flight is then cancelled or refused, a later listing lists its record again. No open is left that no page can reach. |

3. **§5, "Which commands wait."** Read as: The new page's `open_dataset`, `open_project`, and `recover_session` with a null `dataset`, await the open gate on the async runtime before they start. No other command waits: `recover_session` with a handle, `list_recoverable` and `discard_recoverable` do not.

4. **Consequences (e), last bullet, the sentence on the offer's product caller.** Read as: At c28c8cf1, ADR-036 §9's offer had no product caller: `session_history::recover` was called from `kernel/src/session_history.rs` and kernel tests only, and no command in the shell's handler list reached it. From the piece that lands this amendment, the offer's product callers are `list_recoverable`, `recover_session` and `discard_recoverable`, in the shell's handler list. A record that a crash left is offered as ADR-036 §9 says. In the run that made it, the record of an unsaved open that a reload closed is still never offered: the listing skips the records this run holds, and a normal end clears it.

5. **What this ADR does not decide, "The recovery offer's product caller."** Read as removed. Item 1 decides it, for the open that `recover_session` starts. Nothing else of the recovery offer is decided here.

6. **§2, "What a page's end touches", its first sub-bullet.** Read with this added after it: From the piece that lands this amendment, `SkpHost::open_under` is reached by a third route, `recover_session` with a null `dataset`, and that route too is reached only through its Tauri command. So every open in the catalog is still one that a page of the main window made.
````

2. **What changed from ADV-2026-11-27-41's text, and why.** The gate's three additions are each taken, in my words.
   - **A1, in item 2's row:** one sentence on a refusal of the truncation itself. The gate's first half, the close of the open, was already in the row. Its second half was missing: the row said what the history is before the truncation and after a completed recover, and nothing for a refusal in between. It rests on the form's Amendment 17 item 5, step 5.
   - **A2, in item 2's row:** three sentences on the listing, in place of "The new page is not offered it."
     - That sentence said more than the form gives. The listing does not wait at the gate, so a listing can read a record before an earlier page's recover has locked it.
     - The new sentences say what the form says: what the listing skips, and that a cancelled or refused recover's record is listed again later. They rest on the form's §2.3, Amendment 2 item 4 and Amendment 17 items 5 and 9 (c).
   - **A3, as a new item 6.** §2's sub-bullet names two routes into `SkpHost::open_under`, and the piece adds a third. The item ends on the words of §2's own last sub-bullet, not on "one set".
   - The italic paragraph names this ruling and the places that are mine. Its last sentence but one now also covers an item that adds words and replaces none.
   - Items 1, 3, 4 and 5 are as they were, byte for byte.

3. **One thing for the gates of both parts: the listing that comes too early.**
   - By the form, a listing that reads a record before an earlier page's recover has locked it lists that record. The new page then offers it. Its Recover or Discard is refused while the earlier recover holds the lock or once this run holds the record.
   - Part 1's architect gate says whether ordinary use can reach that, and what each refusal's code is then.
   - Part 2's gates say what the offer shows for it. R-S8 says "These changes are open in another window of the app.", which would not be true of this case.
   - If ordinary use can reach it, it comes to me before the part's words are committed: the ADR then names it as a residual, and the offer's words may change.

4. **What stands of ADV-2026-11-27-41.** Its items 2 to 8 stand, read with this text.
   - The acceptance rests on Part 1's build gates checking every clause against the landed code, as its item 3 says. A clause the code does not meet comes to me, and a changed text gets a new id.
   - On macOS and Linux the row's sentence on a locked record rests on the form's H3, which K-C21 and K-C22 discriminate.
   - **At the merge check I compare the amendment with this file byte for byte, apart from `<date>` and its number.**
   - The form's records figure for Part 1 is 25 lines. The text above is 22 lines inside its fence, so the figure holds.

5. Nothing here is reserved. Part 1's code does not wait for this ruling's filing. For the human, in the digest: the ADR's amendment gained three places after the gate's read.
