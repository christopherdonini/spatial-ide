# Directive — product first, and a governance freeze (the human, verbatim)

*Custodian's filing note (2026-10-05): the human's direction, received mid-turn at 20:17:41Z by the session transcript (its enqueue record, origin human), as pasted content in the human's own message. The text below the rule is the pasted block's text, extracted by script, with its pasted-content wrapper lines removed and nothing else changed except one final newline. Two typed fragments came before it (`state/directives/2026-10-05-product-first-fragments.md`), and the human's clarification after it (`state/directives/2026-10-05-product-first-clarification.md`) says the fragments govern where they differ. Between them, at 20:18:57Z, the human wrote that the custodian waits if in doubt and that a new message follows. It gets a RULED block in `DECISIONS-PENDING.md` (§105). Cited as "the 2026-10-05 product-first direction".*

---
HUMAN DIRECTION, 2026-10-05: product first, and a governance freeze.

1. Freeze. Until shell-migration milestone 1 and MP-1 (MultiPolygon) have both merged, no new mod, pilot, trial, record rule or governance piece is placed or built. A finding is still recorded as a proposed node.
   - Continue, first in slot 2: compaction-record-and-resume-line, then guardian-n1-before-auto-compaction (CONTEXT-FLUSH-2026-10-05.md). Neither waits for guardian-v1 any more.
   - Parked until the freeze lifts, records kept as they are: guardian-v1 (no build starts; a running worker stops at its hand-back); the lead-data second pilot, paused at two of four pieces and judged when the freeze lifts; every proposed governance node; Fable's second-slot queue, which was never placed.
   - While the pilot is paused the architect drafts alone, and the implementing worker updates the owner's-index lines its piece changes, in the same pull request.
   - Guardian v0 and the Evidence Recorder stay installed. E9 and E5 are read when they reach their counts.
   - The 2026-10-09 window is reduced to section 6's measures and anything that blocks product work. Its other items wait for the first window after the freeze lifts.

2. Proportional gates. This replaces AUTONOMY section 22's Documentation-only sentence. A gate fails only on Correctness or Evidence. Documentation and record findings do not fail a gate and cause no correction round and no re-gate. They are fixed in the same pull request before the merge, the custodian checks each fix against its finding, and the closing record lists them. Three things are never documentation-only: a claim of a guarantee, a limit or a measurement that the code or the evidence does not support; a quote of my words marked verbatim that does not match its source; and any red-line text. The record cap stays. Every gate brief carries this section by reference from now. AUTONOMY section 22 and the two gate agents' definitions are brought in line in one docs pull request, for my click.

3. The won't-fix bar. A finding gets one KNOWN-LIMITATIONS line, and no ADR note, amendment or piece, when all of these hold: it needs an input that no ordinary file and no ordinary use produces (a constant-only expression, a hand-made or pathological file); what the user sees is a named refusal or a named error; and it leaks no file data, returns no wrong result silently, weakens no stated guarantee or declared ceiling, and touches no red line. If any of these fails, it is never won't-fix. The custodian applies the bar at triage and lists each use in the window report. I can overturn any of them.

4. Product first. Slot 1 is the product slot. It takes product work in this order, each as soon as it is ready, and a ready piece is never held for an earlier one that is not: shell-migration milestone 1; MP-1; the points cut; the lines cut; B2 save and reopen. B1's shell half and the migration's later milestones enter this order where the migration plan puts them. Slot 2 takes, in order: the two context-flush pieces; the placed S2 follow-ups, each only when its paths are disjoint from slot 1's piece; then the next ready product piece in a different lane with disjoint paths. Port-3 and port-4 stay after migration milestone 1, as placed.

5. Real defects are not demoted. An S1 (a silent wrong result, leaked file data, a broken guarantee, or a defect that ordinary use hits) goes into slot 1 ahead of this order. Section 3 applies only to corner cases with no realistic user.

6. Measures, at the next window: product pull requests merged against governance pull requests merged; question rounds per day; correction rounds caused by documentation against those caused by code; and the days the critical path waited on a person.

7. Unchanged: every red line; typed approvals for mods and ADRs; merge commits only; the two-pieces limit; independent gates for Correctness and Evidence.

8. Placement:
   a. geometry-types-beyond-polygons (MP-1): ready on my acceptance of ADR-034; it takes slot 1 now.
   b. shell-migration-milestone-1: a new node in the shell lane, proposed until I rule Fable's migration plan. From that ruling it is first in section 4's order.
   c. geometry-points-cut, then geometry-lines-cut: placed after MP-1 in the engine lane, each with its own preregistration.
   d. briefb-b2-save-reopen: placed after them; its dependencies stand.
   e. kernel-close-races-followups, then data-plane-crowded-start-detail-spaces: moved to slot 2, after the two context-flush pieces.
   f. guardian-v1: parked. compaction-record-and-resume-line no longer depends on it.
