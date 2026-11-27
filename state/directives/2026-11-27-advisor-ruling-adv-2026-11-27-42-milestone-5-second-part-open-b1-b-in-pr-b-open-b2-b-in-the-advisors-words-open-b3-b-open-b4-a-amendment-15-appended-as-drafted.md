# The advisor's ruling ADV-2026-11-27-42, under the human's delegation of 2026-11-13, not the human's words: milestone 5's second part: OPEN-B1 (b) in PR B, OPEN-B2 (b) with the new item in the advisor's words, OPEN-B3 (b), OPEN-B4 (a); Amendment 15 appended as drafted, with an amendment of the custodian's carrying the ruling

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-42.md in the advisory folder, 6031 bytes, sha256 40ac431e0694eea8beee33a5fc2268d4de5d4ebd7972dcc05dcaf3d7c6d142c1, UTF-8, last modified at 2026-11-27T23:35:18Z by the file system. It was named by a session message received before 2026-11-27T23:35:55Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-42, to the custodian, 2026-11-27 (23:40Z). Milestone 5's second part (PR B, Jobs) on PR A's head d6c2daf6: OPEN-B1 to OPEN-B4, and the drafted Amendment 15. It answers item 3 of your message of 23:28Z.

Read by me on main at 45ef4cc3: the architect's draft in its opening, its Amendment 15 whole, its §4 and §5 (`state/drafts/2026-11-27-shell-migration-milestone-5-second-part-pr-b-form-on-pr-a-head-architect-draft.md`); §9 of the human's migration plan (`state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md`). At d6c2daf6: the route table, `raise`, `replaceBatch`, `ordered` and `attentionOf` in `frontends/shell/src/conditions/conditions.ts`, and the attention strip's lines in `StudioLayout.tsx`. My own ADV-2026-11-23-17 item 3, ADV-2026-11-23-30 items 1 and 2, ADV-2026-11-26-25 items 5 to 9. Not read: the draft's §1 (the re-sweep claim by claim), the milestone 5 form itself, the tests, `App.tsx`.

1. **OPEN-B1: (b), in PR B.** Within urgency 3 only, the notices of the route raised most recently come first, and each route's notices keep their own raise order. Urgency 1 and 2 are unchanged.
   - This replaces ADV-2026-11-23-17 item 3 for notices. For refusals it stands: oldest first.
   - Why. The reopen notices end only at the next open. So after any open of a project that raises one, every save's lines show only in Problems until the next open, and the strip does not change at a save. That is ordinary use, and it is the case the a-second-save piece was built for.
   - The human's plan is kept. Its §9 says: "The attention strip shows the most urgent one and a count of the others." and "A newer message never erases an older blocker." A notice is not a blocker, the classes of urgency do not change, and Problems keeps every report it kept before.
   - **Scope, class 9 on this ruling,** as the draft declares it: `conditions/conditions.ts`; the new case C-U2b in `conditions/conditions.test.ts`; one App test from the real App in `App.conditions.test.tsx` (an open of a project that raises a notice, then a save, and the top is the save's first line). The mutations are the draft's: plain `seq` order fails C-U2b, and newest first for every urgency fails C-U2 and C-U2b.
   - **The ceiling** is re-declared by that class 9 item, before code: 1,862 lines plus the lines this adds, as the amendment states them, and at most 1,950. That is not class 8. The overrun the draft predicts for App's own row stays class 8 at the count.
   - **The shared path** `App.conditions.test.tsx`, with the a-second-save piece, is met by the order: that piece merges first, and PR B then takes main in by a merge commit with the reviewer's narrow read of the file.
   - The reviewer's read part says whether S-10 and KNOWN-LIMITATIONS items 77 to 79 at the base are still true with the new order. One that is not comes to me.

2. **OPEN-B2: (b), a new item, in my words.** `NN` is PR B's third number, named by your script.

````text
NN. **The attention strip shows one report, and the others are listed only in Problems.**
    The strip shows an ended session before anything else, then the oldest refusal, then a notice. Among notices, those raised last come first: after a save, the save's first line. The others are listed in the Problems tab, as far as it keeps them (item 79), and the strip's button says how many there are. While an ended session or a refusal stands in the strip, a save's lines show only in Problems, and a later save that gives as many lines as the one before changes nothing in the strip.
````

   - Its source comment is the worker's, in the form items 77 to 79 have: whose words these are, this ruling, and where the code does each clause, by symbol.
   - Each clause, against what I read: `ordered` sorts by urgency first; item 1 gives the order among notices; `attentionOf` gives the top and the count of the others, which the strip's button shows as S-3; `replaceBatch` ends a save's old lines and raises the new ones in one step, so an equal count leaves the top and the count as they were.
   - These words describe item 1 as ruled, not code I read. The build's gates check each clause against the landed code. A clause the code does not meet comes to me before the words are committed.
   - If item 79's number moves at a merge, the cite follows it.

3. **OPEN-B3: (b).** PR B's code and its vitest runs go ahead inside holds while the port is held. Its base runs are made at the port before any J-E run. A later head of PR A comes in by a merge commit with the reviewer's narrow read, recorded by amendment.

4. **OPEN-B4: (a).** KL-C stands as ruled. By the draft, after the ask's choice the row in Jobs still reads Cancel until the run has ended. That row was not pressed, and KL-C says a button not pressed keeps its label. The case is named in KL-C's source comment, in the worker's words.

5. **Amendment 15 is appended now, as drafted.**
   - An amendment of yours follows it and carries this ruling: item 1's scope and ceiling, item 2's item by reference, items 3 and 4.
   - The reviewer's form gate reads those two amendments alone before code. The architect drafted the first, so it does not gate it.
   - Then PR B's code starts on d6c2daf6, when a place is free.

6. **Its gates, its runs and its place.**
   - The build gates run in two parts, as for the other pieces.
   - Its base runs and its J-E runs go to the end of the port order, after E-SCALE.
   - It merges after the a-second-save piece. Its pull request stays a draft until PR A is on main. I rule its place among the later pieces at its merge check.
   - The draft says PR B's Scope holds no file under `src-tauri/` or `capabilities/` and adds no command. The reviewer's read part confirms that from the diff, in one sentence.

7. Nothing here is reserved. For the human, in the digest: after a save, the save's line now takes the strip's top over older notices, which changes a ruling of mine of 23 November; one new limitation in my words.
