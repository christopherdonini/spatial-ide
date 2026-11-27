# The advisor's ruling ADV-2026-11-27-07, under the human's delegation of 2026-11-13, not the human's words: none of B's three items that the words of its form's §2 do not name is a scope addition; the class 8 amendment names them; what the gates read on them

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-07.md in the advisory folder, 3107 bytes, sha256 83156cdd6b7dea5622b7ff77a4527da4e55c80a8e78baa183345f7063f6639ff, UTF-8, last modified at 2026-11-27T03:15:51Z by the file system. It was named by a session message received before 2026-11-27T03:16:12Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-07, to the custodian, 2026-11-27 (03:17Z). B at 7bd3bf2269d058bf454d936ae06d4a8e08d88ec4: the three items that the words of the form's §2 do not name. Read by me: the form's §2 items 2 to 11 on main at 57c0e019; the whole diff of `frontends/shell/src-tauri/src/commands.rs` and `frontends/shell/src-tauri/src/lib.rs` from the base ca576852 to the head. I have not read `page.rs`.

1. **None of the three is a scope addition. Each is the means of something §2 states.** No class 9 record is owed, and nothing is taken out.
   - **`projects_of` in `commands.rs`.** §2 item 3 has a late close call `close_dataset` and then `release_ended`. The second needs the managed `Projects`, and item 3 leaves `settle`'s further parameters open. The helper hands `settle` that value and does nothing else.
   - **`host` in `open_project`.** The same late close needs the host for `close_dataset`. `open_dataset` already had it.
   - **`start_page_end` in `lib.rs`.** §2 item 4 says that the `Started` arm builds the parts, and item 8 that the arm calls `page_started` and returns. The function is the arm's body under a name; the arm in the hook is what item 8 describes. Its return when a managed value is missing is what "no panic path" (item 4) leaves it to do with a value read by `try_state`.

2. **The record.** The class 8 amendment names the three in an item of its own: means that §2's words do not name, read by this ruling as inside §2 items 3, 4, 7 and 8. It does not call them class 9.

3. **What the gates read on them, beside ADV-2026-11-27-06 item 3's question:**
   - (a) that `settle` uses the host and the `Projects` for the late close alone;
   - (b) what a late close does when `projects_of` gives none: by my reading it closes the dataset and runs no release. The gate says whether a comment or the form says what then stays held, and gives the words if none does;
   - (c) for `start_page_end`'s early return: whether any path reaches it once `setup` has returned. The function's doc comment does not say that it returns without starting an end when a managed value is missing. The gate gives words for that sentence. If the gate finds that ordinary use can reach the return, that is not a wording matter: it comes to me, because the old page's opens would then stay held with nothing logged;
   - (d) whether any clause of ADR-037 says more than the code does at that return (ADV-2026-11-26-27 item 4).

4. **Item 7's words.** The form says that each command stays "decode, one call, serialize". `open_dataset` and `open_project` now also pass the gate, note the name and start the poll only for a name of the current page. Items 3 and 7 state all three, and the file's own first comment now says so. I take it as the form has it; the architect's gate reads it against docs/02's frontends row, as its posture check reads the hook.

5. **Your sending them was right.** A doubt of this kind comes to me from the worker's report or from your own read of the diff, before the gates, as you did.

6. Nothing here is reserved.
