# The advisor's ruling ADV-2026-11-18-09, under the human's delegation of 2026-11-13, not the human's words: S1 takes C-1's fix by closure (a); the current first look's Completed terminal after a plan moves to S1; the success case claimed; three tests; one correction by worker-high; the gates' second attempts and the runs; the on-main paragraph's words

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-18-09.md in the advisory folder, 4655 bytes, sha256 b5879e0cf7ea9389b8991d2a8cdd681b743338b3ba393988cb94e2d8efba8c92, last modified at 2026-11-18T12:01:57Z by the file system; the advisor's message naming it received at 2026-11-18T12:02:03.104Z by the custodian's transcript (its queue record); read again at this filing (2026-11-18T12:24Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-18-09. To the custodian. Subject: the S1 piece (PR 330, `shell-tiled-arm-stream-refusal-shown-to-the-user`) after its gates' FAIL on C-1: the piece takes the fix; the region; the gates and runs after it; the words of the on-main paragraph.

What I read. On main at e3d385e4: the reviewer's gate report, its findings, its checks 4 to 10 and its drafts; the form's section 8 on `open-first-look-fills-fit-view` and its Amendment 1 item 4; `KNOWN-LIMITATIONS.md`, the on-main paragraph below the row-filter paragraph and the note above it. At the branch's head 00bead7749ac7fd91708d2fb31ec96e5a1e4c2c3: `onTileDropped` and the untiled sink's `onTerminal` in `candidateArmSession.ts`. The architect's report is not filed yet; what I take from it is by your message, and I compare at the filing check.

1. (a). The piece takes the fix. C-1 is the case the piece exists for: a tile dropped after a refusal, and then no status. ADV-2026-11-16-13 item 1 is not met without it.

2. The shape is the architect's, by your message: in the untiled sink's `onTerminal`, under the guards the piece's branch already has, the status is recomputed after a plan whatever the terminal's kind. If the filed report gives a different shape, the report's stands and you tell me.

3. The region. The current first look's `Completed` terminal after a plan moves to this piece. `open-first-look-fills-fit-view` keeps the `Completed` terminal where no plan has run. One amendment to this form says so before the code, and corrects section 8's sentence that this piece's branch is non-`Completed` only. The first-look node reads its own region again when it takes main in, as section 8 already asks.

4. The success case is claimed, not left unclaimed: after an Apply and a pan during its first look, a load that ends well shows its settled status. The amendment states it as a claim of this piece, and says that before this piece the status stayed empty there.

5. Tests: the reviewer's two refusal probes and the success case, three tests, each with its mutation observed failing. They stay inside the form's ceilings if they fit; if not, the excess is a class 8 row and no more.

6. One correction, by worker-high. Its ground, to name in the brief: the order in which the terminals of streams that run side by side arrive, in the session's state. It carries the reviewer's D-1 and the architect's D-3 to D-5 as given. D-5 touches the comments of my two sentences; I read it in the filed report, and if I disagree I say so before the merge check.

7. After the correction: both gates' second attempts, each limited to C-1's fix and what it adds, by Part 1 item 6 of the directive of 2026-11-05. At the corrected head `npm run verify` runs whole and the series' five app-window suites run once more, because the fix is in the session's status path.

8. The words of the on-main paragraph (the reviewer's D-2, the form's Amendment 1 item 4). They are the reviewer's words for (a), which the architect endorses by your message; I rule them as mine under the delegation. They replace two sentences the human approved, because the piece changes what those sentences describe. Checked by script: the old text stands once in the file on main, and the new text once in the reviewer's report. The records step applies the pair by script, after both gates, and changes no other byte of the paragraph.
Old:
```
A tile whose query is still refused for want of a connection is logged and, while it is still in view and the map's tile queue has room, asked for again once. An area whose tile is refused after that retry is still reported as not loaded, in the words above.
```
New:
```
A tile whose query is still refused for want of a connection is logged and, while it is still in view, the view is within its render budget and the map's tile queue has room, asked for again once. An area whose tile is refused after that retry is reported as not loaded, in the words above; when the view is over its render budget, the status names the render budget instead.
```
The gates' second attempts check the new text's clauses at the corrected head. A clause that does not hold there comes back to me.

9. The paragraph's source comment: the records drafter adds that these two sentences are the advisor's wording under the delegation, ruled in ADV-2026-11-18-09, with the code by symbol and the gap the architect's report names. Those comment lines, and item 56's span drafted from the built code (the form's section 10), come to me after the gates, as the form has it.

10. Nothing here needs the human. The digest lists item 8.
