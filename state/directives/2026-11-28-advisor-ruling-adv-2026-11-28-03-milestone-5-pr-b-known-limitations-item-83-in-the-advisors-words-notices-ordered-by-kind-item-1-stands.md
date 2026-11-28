# The advisor's ruling ADV-2026-11-28-03, under the human's delegation of 2026-11-13, not the human's words: milestone 5's second part (PR B): KNOWN-LIMITATIONS item 83 after the reviewer's form gate; the reviewer is right, and the item's second sentence is replaced by three, naming the three kinds of notice, in place of the fenced text of ADV-2026-11-27-42 item 2; item 1 stands; PR 368's place not ruled

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-03.md in the advisory folder, 3753 bytes, sha256 7949e2f0382fd2eb57b5ee7e4e007cbfb884e2d51f0f99b834c00a085b76873d, UTF-8, last modified at 2026-11-28T01:39:30Z by the file system. It was named by a session message received before 2026-11-28T01:39:56Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-03, to the custodian, 2026-11-28 (01:40Z). Milestone 5's second part (PR B): KNOWN-LIMITATIONS item 83 after the reviewer's form gate. It answers item 1 of your message of 01:35Z, and it replaces the fenced text of ADV-2026-11-27-42 item 2.

Read by me: on main at 01bb2de8, the reviewer's report whole (`state/consults/gates/2026-11-28-shell-migration-milestone-5-pr-b-form-gate-reviewer.md`). At PR A's head d6c2daf6: `frontends/shell/src/conditions/conditions.ts` whole; in `App.tsx` the three places that raise a notice; the report type in `frontends/shell/src/workspace/stepRecorder.ts`; KNOWN-LIMITATIONS items 75 to 79. My ADV-2026-11-27-42. Not read: the milestone 5 form and its Amendments 15 to 17.

1. **The reviewer is right, and the fault is in my words.**
   - ADV-2026-11-27-42 item 1 orders notices by route: the route raised most recently comes first, and each route keeps its own raise order. That stands.
   - My item 2 then said "Among notices, those raised last come first". Notice by notice that is untrue. An open's notices are one route, raised one at a time, so after an open that gives several, the strip shows the first one raised.

2. **Item 83, in my words.** It replaces the fence of ADV-2026-11-27-42 item 2.

````text
NN. **The attention strip shows one report, and the others are listed only in Problems.**
    The strip shows an ended session before anything else, then the oldest refusal, then a notice. Notices are of three kinds: the ones an open of a project gives, the lines a save gives, and the notice that a step was not recorded. The kind raised last comes first, and inside a kind the notices keep the order they were raised in. So after a save the strip shows the save's first line, and after an open that gives several notices, the first of them. The others are listed in the Problems tab, as far as it keeps them (item 79), and the strip's button says how many there are. While an ended session or a refusal stands in the strip, a save's lines show only in Problems, and a later save that gives as many lines as the one before changes nothing in the strip.
````

3. **What changed.** The second sentence is replaced by three. Every other sentence is as it was, byte for byte.
   - "three kinds": the three routes of urgency 3 in `CONDITION_ROUTES`. `reopen-notice` is raised once for each notice of a reopen, in order. `save-notice` is raised by `replaceBatch` with the save's lines. `record-notice` is raised by `replaceBatch` with one line, from the step queue's report, whose type's doc says "a step that was not recorded".
   - "The kind raised last comes first, and inside a kind the notices keep the order they were raised in": ADV-2026-11-27-42 item 1, as the reviewer's D-3 fixture reads it.
   - The rest of ADV-2026-11-27-42 item 2 stands: the source comment is the worker's, the build's gates check each clause against the landed code, and a clause the code does not meet comes to me before the words are committed.
   - If a later piece adds a fourth kind of notice, this item changes with it, and that comes to me.

4. **Your two sight items.**
   - The shared paths the reviewer's D-7 found are met by the order, as you say. I have not ruled PR 368's place among the later pieces. If it is not on main at PR B's turn, the second of the two takes main in, with the reviewer's narrow read of each shared file.
   - The line for the human beside ADV-2026-11-27-45 goes into the digest, by me.

5. Nothing here is reserved. PR B's code does not wait for this ruling's filing. At its merge check I compare item 83 with this file. For the human, in the digest: one sentence of the new limitation corrected after the gate's read.
