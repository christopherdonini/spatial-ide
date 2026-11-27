# The advisor's ruling ADV-2026-11-26-26, under the human's delegation of 2026-11-13, not the human's words: ADR-037's final text; the five clauses the architect found untrue at B's base taken with its words; the docs/02 consequence's last sentence and the Status line in the advisor's words

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-26.md in the advisory folder, 4151 bytes, sha256 971bbce0af5197ffef6e4012277061df7cf5309335b23c26a1c6a8fdd491fc12, UTF-8, last modified at 2026-11-26T21:47:32Z by the file system. It was named by a session message received before 2026-11-26T21:48:15Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-26, to the custodian, 2026-11-26 (21:47Z). ADR-037's final text: the five clauses the architect finds untrue at B's base, its note on the docs/02 consequence, and the Status line. Ruled from your message, with each Old text read by me in the draft on main (`state/drafts/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.draft.md`, lines 79, 117, 168, 172, 176 and 207 to 209), and `frontends/shell/src-tauri/src/commands.rs:16-20` and `lib.rs:13-16` on main. This replaces the fence of ADV-2026-11-26-16 item 4; the rest of that ruling stands. The New words of items 1 to 4 are the architect's. Those of items 6 and 7 are the advisor's. None are the human's.

1. **U1 is taken.** In §3 item 3:

````text
Old: The end is written against these kernel calls as they are (`SkpHost::cancel`, `SkpHost::close_dataset`, `Projects::release_ended`, `RunningPublishes::cancel_all`).
New: The end is written against these calls as they are: the kernel's `SkpHost::cancel`, `SkpHost::close_dataset` and `Projects::release_ended`, and the binding's own `RunningPublishes::cancel_all`.
````

2. **U2 is taken.** In §6, the first bullet. It follows ADV-2026-11-26-23 item 2, which has the line written at every end:

````text
Old: No earlier page has opens, so the end only runs an empty `release_ended` and opens the gate.
New: No earlier page has opens, so the end closes and cancels nothing: it runs an empty `release_ended`, writes its session-log line with every count 0, and opens the gate.
````

3. **U3 is taken.** Under Proof, the second bullet's first line, with its two leading spaces:

````text
Old:   - One test, through the binding's own functions over a real `SkpHost` and `Projects`, with three cases:
New:   - Tests through the binding's own functions over a real `SkpHost` and `Projects`, among them these three cases:
````

4. **U4 is taken.** Under "Residual, named":

````text
Old: If it is an open, that open stays held until exit, as it would today.
New: If it is an open, it is held as one of the new page's opens, which the new page cannot reach, until that page ends or the process exits.
````

5. **U5 is taken.** The ADR's text begins at the line `# ADR-037 — The main window's page lifecycle and the opens the kernel holds across a reload` and ends at Open item 1's line. The rule after it, the changes against the first draft and the questions for the advisor are the draft's report and are not ADR text. The file under `state/drafts/` may carry your filing header above a rule, as drafts do; what lands in `docs/adr/` is from that first line to that last line.

6. **The note on the docs/02 consequence: one sentence, in my words.** At the base the two doc comments do not yet name the exception; the piece changes them.

````text
Old: The "no logic" doc comments at `lib.rs:13-16` and `commands.rs:16-20` name this exception, as `commands.rs:17` already names `release_ended`.
New: The piece that lands this ADR changes the "no logic" doc comments at `lib.rs:13-16` and `commands.rs:16-20` so that they name this exception, as `commands.rs:17` already names `release_ended`.
````

7. **The Status line**, in place of the fence of ADV-2026-11-26-16 item 4:

````text
**Status:** Accepted 2026-11-26, by the advisor's rulings ADV-2026-11-26-16 and ADV-2026-11-26-26 under the human's delegation of 2026-11-13. The words are the architect's, with four passages in the advisor's words (two bullets on `cancel` in §5, the ADR-020 consequence, and the last sentence of the docs/02 consequence). None of them are the human's.
````

8. **Then.** Apply items 1 to 7 by script, each Old text occurring once, and file the result as the final text with the architect's report. I compare the filed text with the draft on main, the header sentence the architect changed included, and tell you what I find before B's documents commit. The merge check compares B's diff with that file byte for byte, from the first line to the last line of item 5.

9. **Your correction** on A's architect rows (913 BLOCK, 914 PASS WITH NOTES) is noted.

10. Nothing here is reserved.
