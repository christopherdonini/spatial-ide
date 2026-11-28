# The advisor's ruling ADV-2026-11-28-06, under the human's delegation of 2026-11-13, not the human's words: milestone 5's PR B, KNOWN-LIMITATIONS item 83 after the architect's build gate, one sentence added for a notice that is not kept

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-06.md in the advisory folder, 4440 bytes, sha256 d2c843f302a5ae234d77c4b21cf6552fbcc5809e78772c048e24c13eadce5cee, UTF-8, last modified at 2026-11-28T03:15:37Z by the file system. It was named by a session message received before 2026-11-28T03:16:16Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-06, to the custodian, 2026-11-28 (03:15Z). Milestone 5's second part (PR B): KNOWN-LIMITATIONS item 83 after the architect's build gate, one sentence added for a notice that is not kept. It answers the sight item of your message on the reload keys' DOC-5, and it replaces the fenced text of ADV-2026-11-28-03 item 2.

Read by me: on main at f0098033, the architect's report on item 83 and its note for my sight (`state/consults/gates/2026-11-28-shell-migration-milestone-5-pr-b-build-gate-architect.md`, lines 119 to 127). At PR B's head 42859420: `raise`, `replaceBatch`, `opened`, `ordered` and `attentionOf` in `frontends/shell/src/conditions/conditions.ts`; `CONDITIONS_MAX` in `conditionsConstants.ts`; KNOWN-LIMITATIONS items 79 and 83 with their source comments; in `App.tsx`, `handleReopened` and the place that sends `opened`; the lines of `reopenApply` that collect its notices. Not read: the rest of the report, the rest of `App.tsx`, and `lineagePlaces` itself.

1. **The architect's note is right, and the sentence is mine to correct.**
   - No clause was found unmet, and you asked for no ruling. But "after a save the strip shows the save's first line" is untrue in one case that ordinary use can reach.
   - The case: 63 refusals and notices are already kept for the open, and none of them is a line of an earlier save. `replaceBatch` then raises each of the save's lines through `raise`, the cap included. None is kept, and the strip does not show one.
   - It is rare: 63 refusals and notices have to stand in one open. An open raises one notice for each entry `lineagePlaces` gives, among others (`reopenApply` in `frontends/shell/src/project/openProject.ts`), so I do not rule the case out of ordinary use. It needs no dev switch and no timing. So the sentence does not stand as it is.
   - The clause on an open is not affected, by my read. `opened` ends every condition of another open, and `handleReopened` raises the open's notices in the same turn, under the new open's own dataset. So the first of them finds the places empty.

2. **Item 83, in my words.** It replaces the fence of ADV-2026-11-28-03 item 2. One sentence is added after the fourth, and every other sentence is byte for byte.

````text
NN. **The attention strip shows one report, and the others are listed only in Problems.**
    The strip shows an ended session before anything else, then the oldest refusal, then a notice. Notices are of three kinds: the ones an open of a project gives, the lines a save gives, and the notice that a step was not recorded. The kind raised last comes first, and inside a kind the notices keep the order they were raised in. So after a save the strip shows the save's first line, and after an open that gives several notices, the first of them. The exception is a notice raised while the places for refusals and notices are full: it is not kept (item 79), and the strip does not show it. The others are listed in the Problems tab, as far as it keeps them (item 79), and the strip's button says how many there are. While an ended session or a refusal stands in the strip, a save's lines show only in Problems, and a later save that gives as many lines as the one before changes nothing in the strip.
````

3. **The added sentence, clause by clause, at 42859420.**
   - "a notice raised while the places for refusals and notices are full": in `raise`, a route of urgency 2 or 3 that finds `CONDITIONS_MAX - 1` conditions of urgency 2 and 3 kept. `CONDITIONS_MAX` is 64, and item 79 calls these the 63 places.
   - "it is not kept (item 79)": `raise` adds 1 to `notKept` and adds no condition.
   - "and the strip does not show it": the strip's top is `attentionOf` over the kept conditions only.

4. **How it lands.**
   - One commit on PR B's branch that changes item 83's text and its source comment, and nothing else. The comment names this ruling beside ADV-2026-11-28-03 and adds the three symbols of item 3. Its words are the worker's.
   - It is a words-only commit of ruled text. Neither read part of the build gate waits for it, and neither is run again for it. At the merge check I compare item 83 with this file.
   - The rest of ADV-2026-11-28-03 stands: a fourth kind of notice brings the item back to me.

5. Nothing here is reserved. For the human, in the digest: one sentence added to the new limitation after the architect's note.
