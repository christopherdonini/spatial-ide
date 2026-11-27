# The advisor's ruling ADV-2026-11-23-30, under the human's delegation of 2026-11-13, not the human's words: milestone 5's strings and KNOWN-LIMITATIONS drafts KL-A to KL-E worded; S-5 and S-6 changed, S-5's {n} counting occurrences, recorded by an amendment before PR A's code

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-23-30.md in the advisory folder, 3921 bytes, sha256 551c9943c6e7d3f9a9d2ea5effd6b9996d882a833fcc946232720ca16c22e6d2, last modified at 2026-11-23T20:08:40Z by the file system. The advisor's message naming it was received at 2026-11-23T20:08:57Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-23-30, to the custodian, 2026-11-23. The piece `shell-migration-milestone-5`: the words of its strings S-1 to S-13 and of KL-A to KL-E, owed since ADV-2026-11-23-17 item 8 now that its form has passed (attempt 4, row 879). Read by me on main at 55969f98: the form's sections 2.2 (end) to 2.4 and 2.7, its KNOWN-LIMITATIONS drafts, Amendment 2's "For the advisor", Amendment 4's cap text and its drafts of KL-D and KL-E, Amendment 7; the gate's reading of KL-E in its attempt 4 report (`state/consults/gates/2026-11-23-shell-migration-milestone-5-form-gate-architect-attempt-4.md:67-77`). I read no code. These are the advisor's words, not the human's. The Part's step 6 keeps the human's sight of the strings.

1. **The strings.** Each is given without the placeholder mark.
   - S-1: `Problems`
   - S-2: `Jobs`
   - S-3: `{n} more in Problems`
   - S-4: `No problems for the dataset on the map.`
   - S-5: `Raised {n} times in all. The latest:` where `{n}` is `occurrences`. This replaces ADV-2026-11-23-17 item 9's definition of `{n}`: with `occurrences − 1` the draft read "Raised again 1 times" at the second raise. The line is shown when `occurrences > 1`, so `{n}` is 2 or more.
   - S-6: `Problems raised and not kept: {n}. The list keeps at most 64.` The draft read "1 more problems" when one was not kept.
   - S-7: `No map loading or export is running.`
   - S-8: `Loading the map's features`
   - S-9: `Export interactive map`
   - S-10: `Shown above in the attention strip.`
   - S-11: `Nothing was cancelled.`
   - S-12 and S-13 are statements in `surfaceRegistry.ts` whose words the form does not give. The worker keeps each existing statement and changes only the names the form says change. The build's gates read them, and they come to me only on a finding.

2. **The KNOWN-LIMITATIONS items,** at the numbers the re-sweep gives:
   - KL-A: `Problems lists the same kinds of report the attention strip shows, and no others. A refused open stays in Layers, and the status bar's items are not listed.`
   - KL-B: `Jobs lists the map's loading and an export run. Opening a dataset and saving or opening a project are not listed.`
   - KL-C: `The Export section's Cancel and the Cancel on the export's row in Jobs are separate buttons, and the one not pressed keeps its label.`
   - KL-D: `Problems is emptied at every successful open, a reopen of the same file included; it then lists only what that open raises. Nothing is kept from before.`
   - KL-E: `Problems keeps at most 64 problems for one open: at most 63 refusals and notices, and one place held for an ended session. A refusal or notice raised while those 63 places are full is not kept, and Problems says how many were not kept; one that was not kept does not come back when others leave. An ended session is always kept, and the attention strip shows it first. The count starts again at the next successful open. If every kept refusal older than one that was not kept ends, the strip shows a newer refusal, a notice or nothing where that one would have been first.`

3. **What I changed from the drafts, and why.**
   - KL-A: "before" named an earlier version; the item now says what holds.
   - KL-C: the form's own label "under OPEN-4 (a)" is dropped.
   - KL-E: its second sentence was untrue as drafted (refusals and notices stop at 63), and it did not name the case the gate left at the top. Each clause follows the gate's reading or Amendment 7's words.

4. **How they land.** You record item 1's S-5 by an amendment before PR A's code. It is a string and its number, so no further attempt of the form's gate is asked. The build's gates check every string and item above clause by clause against the code, as for any shown text. A finding on a word of mine comes back to me. At the merge check I compare each with this file byte for byte.

5. Nothing here is reserved.
