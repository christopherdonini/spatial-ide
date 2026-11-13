*Custodian's filing note (2026-11-13): the S1 fix's mutation run after its first correction, a worker's report from its hand-back (3287 bytes, sha256 c73fc8dad1c45b0ef4ea1e23bf325b4d39dc417ee6e0d6f3a1ab9daffe5cd85a), below the rule; a final newline is added where missing; nothing else is changed. Its brief by file (7770 bytes, sha256 b4498a4f38f3e4ac70fbaa41463d8f8fadc5a303fb91bef4269f2971abf3db76); the run 00:27:27Z to 00:29:56Z by its transcript, 16 calls (Bash 9, Edit 5, Read 1, the hand-back), 4 shared holds, model claude-sonnet-5-5. One call errored: an Edit refused because the file had not been read first, redone after a Read; the report does not name it. It commits nothing; the worktree stays at eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8, its porcelain empty. The run is owed under Part 1, item 3 of the rulings on gate rounds (`state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`) before the re-gate; the correction worker's brief left it out, which was the custodian's error. A report, a reading and not Authority.*

---

Observed: recentre-crossing-view-displaced-fix correction 1 mutations at eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8

Where: HEAD eb63a3f80c9d321ae37e6d0f2cbfd4d0df7dd2f8, branch cut/recentre-crossing-view-displaced-fix, porcelain empty. @deck.gl/core version 9.3.9. df: C: 17G free, D: 207G free. The form's sha256 matched 401b44c1....

Runs (all `npx vitest run src/canvas/WorkingCanvas.recentre.test.tsx` in frontends/shell, each in its own shared hold):
1. At the head: rc=0, "Test Files 1 passed (1) / Tests 2 passed (2)".
2. M-U1: rc=1, "Test Files 1 failed (1) / Tests 2 failed (2)".
   Diff (whole): in WorkingCanvas.tsx, the line `rebased = { ...viewState, target: [localX, localY, vs.target[2] ?? 0] };` became `deckRef.current?.setProps({ initialViewState: { ...viewState, target: [localX, localY, vs.target[2] ?? 0] } });`. `rebased` stays undefined, so the callback returns nothing.
   - FAIL src/canvas/WorkingCanvas.recentre.test.tsx > the re-centre keeps the view where it was > U1: a drag past the bound and its settled tick change the origin and not W, at the first crossing and at a second one at the same zoom
     AssertionError: crossing 1: W.x moved by 157286.3999999999 world units: expected 157286.3999999999 to be less than or equal to 0.000001 (at expectViewKept, test.tsx:177:90)
   - U2 also failed under M-U1, as it did at the earlier head: FAIL ... > U2: no origin change on a settled tick in a transition or on one that starts a transition; the next tick with none re-centres and W is continuous
     AssertionError: (c): W.x moved by 157286.3999999999 world units: expected 157286.3999999999 to be less than or equal to 0.000001 (test.tsx:177:90)
   Revert check: `git diff --quiet HEAD -- src/canvas/WorkingCanvas.tsx` rc=0.
3. M-U2: rc=1, "Test Files 1 failed (1) / Tests 1 failed | 1 passed (2)".
   Diff (whole): `if (!isDragging && !inTransition && !startsTransition && frame.maybeRecenter(worldX, worldY)) {` became `if (!isDragging && frame.maybeRecenter(worldX, worldY)) {`.
   - FAIL src/canvas/WorkingCanvas.recentre.test.tsx > the re-centre keeps the view where it was > U2: no origin change on a settled tick in a transition or on one that starts a transition; the next tick with none re-centres and W is continuous
     AssertionError: (a) a settled tick with inTransition true: the origin stays: expected [ [ 2600040.6260723933, …(1) ], …(1) ] to deeply equal [ [ 2600040.6260723933, …(1) ], …(1) ] (at stillOldFrame, test.tsx:200:37)
   U1 passed. Revert check rc=0.
4. At the head again: rc=0, 2 of 2 passed. Final porcelain empty.

Both predictions held. U1 failed at the first crossing, and U2 failed at (a). M-U1 also failed U2, at (c), which is a failure of a test other than the declared one, as at the earlier head.

Hold lines: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=<elided> ...` then MACHINE_RELEASED, four times. No refusal.
Logs in the scratchpad folder, under names rcfm-head1.log, rcfm-mu1.log, rcfm-mu2.log and rcfm-head2.log.
Background shells left: none.
Packet gaps: none. The brief had no stated place for M-U1's `setProps`; I used `deckRef.current?.setProps`, as the file does at its other call sites.
Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.
