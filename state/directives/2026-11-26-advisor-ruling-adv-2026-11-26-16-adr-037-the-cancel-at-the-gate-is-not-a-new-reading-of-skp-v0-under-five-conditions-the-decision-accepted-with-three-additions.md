# The advisor's ruling ADV-2026-11-26-16, under the human's delegation of 2026-11-13, not the human's words: ADR-037's cancel of a key waiting at the gate is not a new reading of SKP-V0 and not the protocol stop, under five conditions; the decision of ADR-037 accepted as revised, with three additions in the advisor's words

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-16.md in the advisory folder, 4567 bytes, sha256 d009b77581afd5ed9887feebb7820f1e8660da6f058450d049fb24f905d90c35, UTF-8, last modified at 2026-11-26T19:50:27Z by the file system. It was named by a session message received before 2026-11-26T19:51:08Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-16, to the custodian, 2026-11-26 (19:49Z). ADR-037: the architect's question on §5's cancel, and the acceptance of the decision. Read by me whole on main at 7b72d296: `state/drafts/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.draft.md`, the revision. Also `protocol/skp/SKP-V0.md:126-143`, `kernel/src/skp.rs:1108-1135` and `:1600-1612`, and `frontends/shell/src-tauri/src/commands.rs:103-109`. The words of item 3 are the advisor's, not the human's.

1. **§5's cancel is not a new reading of SKP-V0, and it is not the protocol stop.** SKP-V0 says that a key is looked up among in-flight opens. To the client that sent it, an open that has not been answered is in flight, wherever in the host it waits. `unknown` would be the untrue answer for it. The conditions:
   - (a) No text and no shape of SKP-V0 changes. The three states stay the whole set.
   - (b) The binding puts the cancel to the kernel first. The version check and the lookup by the handle's shape stay the kernel's. Only the kernel's `unknown`, for a key that the binding itself holds waiting at the gate, becomes `requested`.
   - (c) The open cancelled at the gate returns the refusal that a cancelled open returns from the kernel. The binding makes no code and no text of its own for it. A test compares the two, from the kernel's real answer.
   - (d) The form names the moment after an open has left the gate and before the kernel has registered its key. It says what a cancel answers in that moment, and whether that differs from today.
   - (e) If (b) or (c) cannot be met without a file under `kernel/` or `protocol/`, that comes to me before code.
   - The wait inside the kernel is not taken.

2. **The decision of ADR-037 is accepted as the revision has it, with the three additions of item 3.** By my reading of the filed text, the five points of ADV-2026-11-26-08 item 2 are answered and items 1 to 4 of ADV-2026-11-26-13 are carried. B's form and its gates work from it.

3. **The three additions.**
   - In §5, after the bullet that begins ``A `cancel` of the new open's own key ends the wait.``, two more bullets at the same depth:

````text
  - The binding puts that `cancel` to the kernel first, so the kernel's version check and its lookup by the handle's shape are unchanged. Only when the kernel answers `unknown` for a key that the binding itself holds waiting at the gate does the binding answer `requested`.
  - The open cancelled at the gate returns the refusal that a cancelled open returns from the kernel. The binding makes no code and no text of its own for it.
````

   - Under "Other consequences", after the bullet that begins `**docs/02, frontends.**`, one more bullet:

````text
- **ADR-020.** The arm for `Started` stands in the closure that ADR-020 Amendment 1 registers for its self-check. The self-check is unchanged and still runs only on `Finished`. The new arm takes the main window's label from the same managed state and nothing else from it. It writes neither the pinned origin nor `DataPlaneConfig`, selects no origin, and adds no Tauri command. This ADR changes no text of ADR-020.
````

4. **The Status line of the text that lands:**

````text
**Status:** Accepted 2026-11-26, by the advisor's ruling ADV-2026-11-26-16 under the human's delegation of 2026-11-13. The words are the architect's, with three additions in the advisor's words (two bullets on `cancel` in §5, and the ADR-020 consequence). None of them are the human's.
````

5. **The text that lands.** The cites into `commands.rs` and `publish.rs` are re-read at B's base, so the landed text differs from this draft in those cites and in its header lines.
   - Once B's form gates have passed, the architect files the final text under `state/drafts/`: this draft's ADR, item 3's additions byte for byte, item 4's Status line, and the re-read cites.
   - I compare it with this draft. Any other difference comes with its reason.
   - My merge check compares B's diff with that file byte for byte.
   - A clause that a gate finds untrue comes to me with words before the text lands. After it has landed, it changes only by appended amendment.

6. **The architect's question 2** (its cites are at c28c8cf1) is answered by item 5.

7. **The ADR's open item** (a mark for steps a reload discarded) stays open in the ADR. No node now.

8. Nothing here is reserved. I tell the human in the digest that I accepted a new ADR, and they may overturn it. ADV-2026-11-26-18 says what the piece must show beside ADR-020.
