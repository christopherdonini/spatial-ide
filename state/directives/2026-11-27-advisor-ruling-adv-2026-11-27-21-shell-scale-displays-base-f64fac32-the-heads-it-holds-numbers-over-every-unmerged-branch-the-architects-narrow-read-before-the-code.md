# The advisor's ruling ADV-2026-11-27-21, under the human's delegation of 2026-11-13, not the human's words: shell-scale-display's build base is f64fac32, which holds PR 365's head and PR A's; the base recorded as ADV-2026-11-23-15 item 4 has it, over the form's whole list; the new limitation number and Part letter taken over every unmerged branch; the architect's narrow read of §2 against the base before the code; the merge order and the port

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-21.md in the advisory folder, 5083 bytes, sha256 fe0d75959853b5f2ca550b75f7ff1d23eec90c0ec8738f1c93cd28d0509a3080, UTF-8, last modified at 2026-11-27T10:12:59Z by the file system. It was named by a session message received before 2026-11-27T10:13:18Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-21, to the custodian, 2026-11-27 (10:14Z). The base for `shell-scale-display`'s build. Read by me: the form's §9 (its Overlap, suites and Operator paragraphs) and its header on main; ADV-2026-11-23-15 item 4, ADV-2026-11-23-17 item 11 and ADV-2026-11-23-25; by git, the two parents of f64fac32, the three branch heads, and the `--stat` of PR 365's own change in the five files. I read no hunk of the five files, and nothing of PR A's diff.

1. **It builds from f64fac32f3c75da5b4ea57e5b38eee89b92ec22a, and waits for nothing.**
   - That commit is A's base: your merge of PR 365's head 639a96cc into PR A's head d6c2daf6. Both are still the heads of their branches. So one existing commit holds both heads that change `App.tsx` and `WorkingCanvas.tsx`, and the piece does not have to choose between them. No second merge of the same two heads is made.
   - Not one head alone: the other's lines in the two shared files would then meet this piece's lines at a later merge. By `--stat`, PR 365's head differs from its common ancestor with PR A's head by 2 lines in `App.tsx` and 8 in `WorkingCanvas.tsx`, insertions plus deletions.
   - Not a wait: a piece that can start does not wait (ADV-2026-11-23-25 item 2), and no merge is possible while the port is held.

2. **The base is recorded as ADV-2026-11-23-15 item 4 has it.** Starting from f64fac32, the head of every other unmerged piece that overlaps the form's file list and that f64fac32 does not hold comes in by a merge commit, in the merge order. The commit after the last of them is the base. If none is owed, f64fac32 is the base.
   - The comparison covers the form's whole list, not the five files alone: `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md`, `e2e/README.md` and `e2e/layout.mjs` as well.
   - By git, PR 363's head bf11959d is not inside d6c2daf6. The form's §9 names the re-link as a base. You say which of its heads the base holds, and take the current one in if the comparison asks for it.
   - The suites that start no app are green at the recorded base before the code. Where the base is f64fac32 itself and A's record shows them green there, they are not run again.

3. **Numbers and letters are taken over every unmerged branch, not over the base alone.** The form takes its new KNOWN-LIMITATIONS item "at the next free number at the code base" and its new Part "at the next unused letter at the code base". The identity route, text-id, A and B are not in this base, and they add Parts and may add items. You name the item's number and the Part's letter in the amendment, as the next unused over the base and over every unmerged branch whose code exists (rule (00a) counts each as a path of its own).

4. **Before the code, the architect reads the form's §2 against the base. Narrow, no verdict, no gate-log row.**
   - Why: the form's places were read at main 0bcf5434, when milestone 5 was not built (its §9), and by your finding PR A changes all five files. The form says the base is authoritative for the code, but nobody has read whether each §2 item still stands where it puts it.
   - It reads the five files and `layout/regionParts.tsx` at the base, against §2 and the symbols §4 names: `STATUS_ITEMS`, `Slots`, the footer, `NO_SLOTS`, `currentView`, `showBox` and `e2eReadWorkspace`.
   - A moved line is a cite fix (class 3). Anything §2 needs that it does not say, or an item that cannot be built as written, comes to me before the code.
   - The worker starts after it.

5. **The form's amendment, before the code,** records: this ruling; the base and the heads it holds; item 3's number and letter; item 4's read; and two replaced readings, with no filed line edited:
   - §9's "the build is on the re-link's head … The merge follows the re-link's merge" is replaced by items 1, 2 and 6;
   - the header's "after the v0.2 tag" no longer holds: no merge into main waits for the tag, and the piece does not go into `release/v0.2` (ADV-2026-11-27-02; the human's approved message of 2026-11-26, item 3).

6. **The merge order.** Never before PR 365 and PR A, nor before any other head its base holds. Its place among the later pieces I rule at its merge check, as I did for PR 367. Its PR opens as a draft, and the body names its bases.
   - A base head that moves comes in by a merge commit with the reviewer's narrow read. Two moves are already known: PR 365's head after its series, and PR A's head when it takes that in.

7. **The port.** E-SCALE in `layout.mjs` is a tester's series, so it starts an app. It takes the last place in the order of ADV-2026-11-27-11 item 4, after A's runs. The build gates run in two parts, as for the other pieces: the read part after the build, the run part after the series, and no verdict before it.

8. **Words.** A shown string, a KNOWN-LIMITATIONS sentence or a Part row of this piece that no ruling of mine holds yet comes to me before it is committed.

9. Nothing here is reserved. The worker, its worktree and the targets on D: are yours; the disk floor on C: stands.
