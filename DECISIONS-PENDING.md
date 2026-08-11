# Decisions pending the human

*Maintained by the custodian per AI_DEVELOPMENT.md's protocol. One entry per decision: context in
three sentences or fewer, a recommendation, and what applying it touches. Newest first.*

## Pending

1. **PR #8 operator walkthrough — re-run needed.** First run found 2 FAILs: empty canvas (camera
   never fit dataset bounds) and `skp.too_many_pending_streams` from ordinary dragging. Root-caused
   and fixed (fit-to-bounds-on-open + "Zoom to layer"; debounce viewport queries to settle) with
   regression tests (`extent.test.ts`, `debounce.test.ts`, two new supersede-storm tests in
   `viewportStreamManager.test.ts`); `npm run verify` passes. Per the away-mode evidence rule,
   accepting the walkthrough as passed is not a custodian call — needs the human's re-run.
   Recommendation: re-run `MANUAL-WALKTHROUGH.md` Part A (renumbered A1-A10; new A4, A7, A8 text)
   before departure so cut 1 merges and the away-queue starts clean. Touches: PR #8 merge.

## Resolved

*(none yet under this protocol)*
