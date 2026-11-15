# The human's message of 2026-11-12 (13:07Z), their second of the day, replacing their two earlier ones: the S1 fix's Amendment 2 (OPEN-A (C), S6b to S8 now, an edge check for the gate, an OPEN-C consult, OPEN-5's words for v0.1.0's record, row A7a); PR B's Amendment 12 (OPEN-A and OPEN-B by approval, item 4's On-main paragraph, a publish-approval consult, the session-end class 9 phase now); 1c's five; #308's C1 words; the platform reports; the order; no git stash in worker briefs

*Filed verbatim by the custodian from the session transcript: the human's typed message, its user record at 2026-11-12T13:07:54.290Z (UTC) and its queue record (enqueue) at 13:07:54.138Z, which hold the same text. Its text is byte-copied by script from the user record, with one final newline added. Nothing is changed; nothing in it names another project. The text below is the ruling. The custodian's note, not the ruling: of the two earlier messages of the day, the one received at 10:34Z (the flake hunt's check) was filed at 70de461a, and its check, which item 5 (f) repeats, is answered in `state/consults/2026-11-12-known-limitations-redaction-name-floor-check-and-draft.md` (not declared; a draft item, (A) or (B), for the human's sight).*

---

To the custodian, 2026-11-12 (second message; my two earlier ones of today were never filed, and this replaces them).

1. The S1 fix, Amendment 2.
(a) OPEN-A: (C), with rule (d) as Amendment 2 declares it. (c) is kept with F1, reported and not counted. The record of (c) as failed at 3df3e57c stays. I5 and I6 as declared. OPEN-B (A) and F1 to F3 land with it. S6b to S8 start now.
(b) One addition for the gate, declared before the fresh runs. The reviewer computes, from the head run's end line (target, origin, zoom), the canvas box and the fixture's own extent, where the fixture's edges fall on the canvas, and reports them beside the end image's box. An edge in K that falls more than the drawn point radius plus 4.0 buffer px from the image's edge is a Correctness finding. From the same projection the reviewer says whether the fixture reaches the canvas's top and right edges at that view. If it does, the start image is the partial one. If it does not, the end image shows data where the fixture has none, and that stops the piece.
(c) OPEN-C is not the Monday list. A read-only architect consult starts now: what is drawn at the start and what at the end, by which query each, and whether anything on screen tells the user the start is partial. It comes to me for a grade. If reading cannot name the mechanism, it proposes one observation with its form.
(d) The reproducer showed the defect and its reviewer recomputed it: S1, as placed. Run rc's OPEN-5 (B), as run, stands. The fix's OPEN-1 (C) with your change: confirmed.
(e) OPEN-5, v0.1.0's record. governance/RELEASE-0.1.md gets an appended amendment at the fix's closing record, in the words between the quotation marks, with the PR number and merge commit filled in by you:

"Known issue, found 2026-11-11 by reading; no run was made on v0.1.0. v0.1.0's canvas moves its camera inside deck.gl's view-state callback when the view passes the re-centring bound, with the same deck.gl 9.3.9 as main. On main that move does not take effect: after a pan at low zoom carries the view past the bound, the map is drawn displaced by the frame's move, and the data can leave the canvas until Zoom to layer is used. The run that showed this was made on main. v0.1.0 has no drag guard, so by reading the same can happen there during a drag as well as at its end. No data is changed by it. Fixed on main by #<PR> (<merge commit>), for v0.2."

v0.1.0's release page is not touched now; I decide that with v0.2's notes.
(f) OPEN-4 and F5, walkthrough row A7a. The expected outcome is approved as drafted. The step reads: "Scroll out until the field of parcels is about a tenth of the canvas wide. Drag left by about a third of the canvas width, N times; then drag right N times by about the same amount." The worker fills N: the count of such drags at which E1's harness, at that zoom on the head's measure build, records the first origin change, plus two. If N is over 20 the row is not added, the README's E1 entry is the guard, and the closing record says so. A5 and A6 keep their words; the closing record says that sittings before this fix did not pan past the bound at low zoom.

2. PR B, Amendment 12.
(a) OPEN-A and OPEN-B: the architect's starting texts are my words by approval, once the worker's re-check and the gate's clause check pass at PR B's head. An untrue clause comes back to me.
(b) Item 4's On-main paragraph has been untrue on main since #307. Docs lane, now, its own small PR: the paragraph becomes the words between the quotation marks. PR B's records commit then adds its Colour by sentence.

"**On `main` (not the v0.1.0 artifact above).** Opening a file also clears the filter cards, not the filter alone. Each filter you apply and each style change you commit is written to the session record item 43 describes. Saving the project writes the filter, its cards, the style and the view to the project file. Nothing yet restores a filter, a style or a view from that record or from a project file."

(c) With PR B a published bundle carries the Colour by column's values. Before PR B's records commit, a read-only architect consult says what the publish approval shows before a bundle is written, and whether it names the column the bundle will carry. If it does not, the options come to me, and v0.2 does not tag with that open.
(d) PR B does not wait whole for the fix. Its session-end class 9 phase (pick.ts, HoverReadoutView.tsx, FeatureTab.tsx, clickEffect.ts, selection.ts, then workspaceState.ts and App.tsx, with their tests) shares no path with the fix and starts now on a branch from main, with the base series run at that commit. Everything touching WorkingCanvas.tsx or package.json waits for the fix's merge; main is then merged in, the series is run again, and Amendment 13 records any difference. If a pin or prediction of Amendment 12 depends on the fix's lines, that step alone waits and you record which.

3. 1c, Amendment 26 item 4, the five.
(a) K-S15: the length check meets my ruling for step 1. A mark is an append, so a save that wrote one would lengthen the record. Step 2's form takes a byte comparison if the record can be read while the recorder holds it once the store's lock is built; if not, the length check stays and the form says why.
(b) Item 63 is approved as it stands on main, my words by approval; its comment takes the approved form in the docs lane.
(c) The independent review's C2 (a save made before any step) joins second-open-history-before-1c-step-3. The node's subject is now which record a step belongs to: a second open's steps, and steps recorded after a save made before any step. The review's note on two dataset identities goes there too. ADR-036's text on both is mine, at that node.
(d) D-16 stays in step 2's form as you carried it: a named item, built in the stack's first PR that touches the store, with a test that makes the folder flush fail after the rename. No node.
(e) The node is settled before step 2's lineage reader in session_history.rs (L1 to L4) is built, and so before step 3 as placed. Step 2's resolver, store and lock do not wait for it. The node keeps its id. Its architect's options draft starts now as a read-only consult, on the code at #307's merge commit, for my ruling.

4. #308, C1: my own words. Item 1 of the note is replaced whole by the line between the quotation marks, without them:

"1. The close race that the Note of 2026-09-25, item 3, left unsettled is closed by kernel-generation-close-races (#136, merged 2026-09-28). Since that merge only `open_dataset` creates a live generation, through `mint_for_open`. A `viewport_query` racing `close_dataset` no longer mints one: it is refused, by the end's reason when an end is recorded at the moment of its check, and as `skp.unknown_dataset` otherwise. The close removes a recorded end when it forgets the dataset, so a query that checks after that gets `skp.unknown_dataset` even if the generation had ended before the close."

Items 2 and 3 and the rest of the note stand. The architect checks these words only, once. The three untested places the gates name (the cancel at a failed attribution, the end's-reason branch of the arm, the ended-then-closed race at SkpHost level) are one kernel test node, S3, filler queue.

5. The platform reports.
(a) The pre-build review's red lines. Q4 (a): the withheld mark carries its reason on the wire under step 2's version, by the names the kernel holds at step 2's base, and K-S14 asserts each by name, NoStepRecorded included; that closes the #307 review's E1. Q9 (a): three stacked PRs, each gated. Q10 (a): step 2's kernel phase may run beside PR B, by a class 5 amendment. Q12 (a): ADR-036 Amendment 2 lands as step 2's first commit. Q13 (a): as item 2 (a) above. Q17 (a): the draft's two coverage-lost sentences are the worker's starting text, P6 placeholders, not my words. The other questions take the recommendation under item 4 of 2026-10-31.
(b) The #307 review's notes on the path-length bound and the stale temp file are named items in step 2's form.
(c) Port-2: when main is merged into its branch, its baselines are recomputed and the review's three Documentation findings are applied, before its gate.
(d) The two drift sweeps: triage each finding by the S1 definition. An S1 or S2 candidate comes to me with its code span; the rest go to the filler queue or the docs lane under item 4.
(e) The stall report stays beside the architect's read; the stalls stay S3. Its three proposed observations are one S3 node behind the fix.
(f) The flake hunt: one check from it, docs lane. Does KNOWN-LIMITATIONS declare that the redaction scan ignores a machine name under 3 bytes (kernel/src/bundle/redaction.rs, the length floor)? If not, draft an item for my sight; if it does, record where.

6. Order. Slot 2: the fix to its merge, then step 2's kernel phase, ahead of pan-anchor's route-1 fix. Slot 1: PR B as item 2 (d). Docs lane, in this order: the consult of item 1 (c), #308's words, item 4's paragraph, the consult of item 2 (c), the node's options draft.

7. #309: disclose the departures as you propose. From now on every worker brief says that a worker never uses git stash, since the stash is shared by every worktree.

8. Your own slips and brief errors on the position line are read; none needs a ruling now. Keep them for the weekly window's report.
