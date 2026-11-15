# The advisor's ruling ADV-2026-11-15-15, under the human's delegation of 2026-11-13, not the human's words: PR B colour-by part 2's stop at PB-E3 is a product finding (a one-colour layer has no update trigger for its colour accessor, so deck.gl keeps the per-datum colours); cb2-t is class 2, and its correction goes into PR B now, declared in the same amendment before its code; a unit test that drives deck.gl's own comparison; Reset to default; a read-only sweep; four stops; KNOWN-LIMITATIONS and the walkthrough say nothing of it; nothing needs the human

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-15-15.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-15T15:53:06Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-15T15:53:40Z (the file's modification time 2026-11-15T15:52:47Z; 6166 bytes, sha256 99baa3b5f14970412829ee73fe44a1572e849249735e35a39df54cc99436538d), and again at this filing (2026-11-15T15:59:35Z), equal both times. It answers the custodian's message of 2026-11-15T15:50:34Z, which sent the finding with its trace lines. Nothing is changed. The folder's place on the machine is not written here. The text below the rule is the ruling.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-15-15. To the custodian. Subject: PR B, colour-by part 2: the stop at PB-E3 is a product finding; the scope of its correction, its class, and what the records say.

What I read. Your message with the two ledger entries. At the branch's commit 3e0f8151eaeccd7d6721b2d0317510f378674f2b: `fillProps` and `triggersOf` in `frontends/shell/src/canvas/buildLayers.ts` and the three places that call `triggersOf`; `handleOneColour` and `handleReset` in `frontends/shell/src/style/StylePanel.tsx`; the style effect in `frontends/shell/src/canvas/WorkingCanvas.tsx`; the last assertion of PB-U5 in `frontends/shell/src/canvas/buildLayers.test.ts`. In the branch's worktree, deck.gl's core package as installed, version 9.3.9: the accessor type's `equal`, `comparePropValues` and `diffUpdateTriggers`. On main at 1e53b3bbe39c782b052d41d35d3530452e9e3139, the milestone 4 form: section 2.3, PR B's list in section 2.6, the test table of section 4, section 5, and the amendment classes of `docs/PREREGISTRATION-TEMPLATE.md`. I made no run, and I did not read the ledger or the frame.

1. The finding stands, by my read of the code. It is a reading and no run has isolated it yet.
(a) One colour sets `fillMatch` to null and commits. The style effect sets the draw parameters and schedules a render.
(b) Under a match each layer's colour accessor is a function, with an update trigger on the style revision. For one colour the accessor is the constant colour and `triggersOf` gives no key.
(c) deck.gl's accessor comparison returns equal whenever the old value is a function, and its trigger check walks the new props' triggers only. So a match followed by one colour over the same data is no change to deck.gl, and the layer keeps its per-datum colours.
(d) The form declared this shape. Section 2.3 (c), third bullet: "with `fillMatch` null, today's props exactly". The defect is in the declared design, not a slip of the worker's.
(e) Reset to default sets a state whose `fillMatch` is null and reaches the same code.

2. The class. The run cb2-t is class 2: PB-E3 was predicted to pass and did not (section 5: a wrong prediction is class 2). The correction is recorded in the same amendment, written before the correction's code. It is not class 9: every file it changes is on PR B's list in section 2.6, and no standing rule adds the work. Your Amendment 20 holds the stop, your corrected reading of the ledger, this ruling by reference, and the items of 3 as declared before code.

3. The correction, in PR B, now.
(a) `frontends/shell/src/canvas/buildLayers.ts`. A layer drawn with one colour carries an update trigger for its colour accessor. Its value differs from every match revision, and it does not change from one render to the next while the fill stays one colour. This holds at all three places: the polygons' and the points' fill colour and the lines' colour. The value itself is the worker's choice. The amendment restates section 2.3 (c)'s third bullet as: with `fillMatch` null, today's props and that one trigger.
(b) The comments in that file that say a constant colour has no trigger key are brought current. Both gates clause-check them.
(c) PB-U5 keeps its claim and its mutation. Its last assertion, that a one-colour fill has no trigger, becomes the new fact, and it gains one clause: ten pans under one colour leave that trigger as it was.
(d) One new unit test in `frontends/shell/src/canvas/buildLayers.test.ts`, named by you in the amendment. Over the same batches, for each of the three layer kinds, it asserts that deck.gl itself sees a change of the colour accessor in each of four steps: a match to one colour, one colour to a match, a match to another match, one colour to another colour. It drives deck.gl's own comparison as installed, with real layer objects. Comparing our own trigger values is not enough: the defect was an assumption about deck.gl's side. Its mutation: the one-colour trigger removed; the first step fails. If deck.gl's comparison cannot be reached in the unit environment, the worker stops and you tell me what was tried.
(e) PB-E3 waits for a fresh layers line after its click, bounded, and then reads its frame. A timeout stops the worker. The run cb2-t is recorded by reference as the observation that, without the correction, the frame keeps the swatch.
(f) Reset to default. The amendment names the test that shows it ends a match in the state. If none does, PB-U6 gains that case. The draw is covered by (d).
(g) The order in the branch is the one PR B uses: the tests first, seen to fail for the declared reason, then the correction.

4. A read-only sweep, by the correction worker or the architect. Every accessor prop the canvas code gives a layer that can be a function in one render and a constant in the next over the same data. The amendment after the correction lists what was read and what was found. A case that is on main today comes to me as a proposed node. A case in PR B's own code is corrected with (a) and told to me.

5. KNOWN-LIMITATIONS and the walkthrough say nothing of this. The fill by category has never been on main, so no version a user has carries the defect. Item 51's draft and Part AC's words describe the piece as corrected.

6. Stops. The piece stops and comes to me if PB-E3 is still red after the correction; if the correction needs a file outside section 2.6; if PB-U5's claim cannot be kept, so that a pan re-evaluates an accessor; or if the sweep finds a case the correction of (a) does not reach.

7. What follows is unchanged: the runs cb3 and the mutations as the part 2 brief gives them, the records dispatch, the terms of ADV-2026-11-14-13 and -14, the changed-paths list, then both gates. No gate has read the colour-by code yet, so both read the correction with the rest.

8. For your records, one line: your first message repeated the worker's statement that no layers line followed the click, and you corrected it from the ledger's times before any record carried it. The amendment says so.

9. Nothing here needs the human. No dependency changes: deck.gl stays as installed. The digest lists it.
