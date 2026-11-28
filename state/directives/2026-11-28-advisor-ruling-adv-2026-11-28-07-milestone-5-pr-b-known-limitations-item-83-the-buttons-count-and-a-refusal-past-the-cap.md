# The advisor's ruling ADV-2026-11-28-07, under the human's delegation of 2026-11-13, not the human's words: milestone 5's PR B, KNOWN-LIMITATIONS item 83, the button's count and a refusal past the cap

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-07.md in the advisory folder, 4131 bytes, sha256 3a947806aea2f818dd3a59aa15912bb9400fb28fcb18aceba8c2d3cd173b0269, UTF-8, last modified at 2026-11-28T03:40:30Z by the file system. It was named by a session message received before 2026-11-28T03:41:27Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-07, to the custodian, 2026-11-28 (03:40Z). Milestone 5's second part (PR B): KNOWN-LIMITATIONS item 83, the button's count and a refusal past the cap. It answers (a) and (b) of your message on the reviewer's read part, and it replaces the fenced text of ADV-2026-11-28-06 item 2.

Read by me at PR B's head 42859420: in `frontends/shell/src/App.tsx`, line 939 (`visibleConditions`), line 940 (`attention`), line 2346 (`attentionOthers`) and line 2688 (the Problems tab's `conditions` and `notKept`); `raise` and `attentionOf` in `frontends/shell/src/conditions/conditions.ts`; KNOWN-LIMITATIONS item 79. Not read: the reviewer's report, which was not yet on main. I rule from the code, and your message gave me only where to look.

1. **(a) Item 83 needs my words in two places.**
   - **The button.** The strip's button shows `attention.others`: the kept conditions below the top, the same list the Problems tab shows. A refusal or notice that was not kept is not counted. "How many there are" does not say that. The reviewer is right.
   - **A refusal.** Reading the item again for the same case, I found a second gap, and it is mine. `raise` applies the cap to refusals as well as notices. With the 63 places full, a new refusal is not kept, and the strip does not show it, even while it shows a notice. The item's first sentence puts a refusal before a notice, and the exception of ADV-2026-11-28-06 names only a notice. It now names both, in item 79's own terms.

2. **Item 83, in my words.** It replaces the fence of ADV-2026-11-28-06 item 2. Two clauses change, and everything else is byte for byte.

````text
NN. **The attention strip shows one report, and the others are listed only in Problems.**
    The strip shows an ended session before anything else, then the oldest refusal, then a notice. Notices are of three kinds: the ones an open of a project gives, the lines a save gives, and the notice that a step was not recorded. The kind raised last comes first, and inside a kind the notices keep the order they were raised in. So after a save the strip shows the save's first line, and after an open that gives several notices, the first of them. The exception is a refusal or a notice raised while the places for refusals and notices are full: it is not kept (item 79), and the strip does not show it. The others are listed in the Problems tab, as far as it keeps them (item 79), and the strip's button says how many of them are listed. While an ended session or a refusal stands in the strip, a save's lines show only in Problems, and a later save that gives as many lines as the one before changes nothing in the strip.
````

3. **The two changed clauses, at 42859420.**
   - "a refusal or a notice raised while the places for refusals and notices are full": in `raise`, any route of urgency 2 or 3 that finds `CONDITIONS_MAX - 1` conditions of urgency 2 and 3 kept. It adds 1 to `notKept` and adds no condition. An ended session is urgency 1 and always keeps its place, so it is not in the exception.
   - "the strip's button says how many of them are listed": `attentionOthers` is `attention.others`, the length of `visibleConditions` less the top. The Problems tab is given the same `visibleConditions`. So the number on the button is the number of entries in Problems besides the one the strip shows.
   - What Problems says about the ones not kept is item 79's, and item 83 does not repeat it.

4. **(b) Yes, the words commit waits for this ruling, and item 83 changes in one commit.**
   - The commit is as ADV-2026-11-28-06 item 4 has it: item 83's text and its source comment, and nothing else. The comment names this ruling, and for the two clauses the symbols of item 3. Its words are the worker's.
   - The fence of ADV-2026-11-28-06 item 2 is not committed. The rest of that ruling stands.
   - Neither read part of the build gate is run again for it. At the merge check I compare item 83 with this file.

5. Nothing here is reserved. For the human, in the digest: two clauses of the new limitation made exact for the same rare case.
