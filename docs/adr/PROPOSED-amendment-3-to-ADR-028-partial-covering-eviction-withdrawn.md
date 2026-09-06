# PROPOSED — Amendment 3 to ADR-028: the partial-covering eviction exception is WITHDRAWN on its own reopen condition

**Status: RULED 2026-09-06 — APPEND, on the human's word (DECISIONS-PENDING entry 45, item 2;
clause 5 ruled by the human, quoted verbatim inside it). Sequencing, the human verbatim:
"Amendment 3 appends only after my L9." Drafted by the custodian per the architect consult of the
same day; appended to ADR-028 by the custodian on the L9 re-verdict, this file deleted in the
same commit. Accepted ADRs are append-only — nothing above the new section changes.**

The text below is the proposed section, verbatim as it would be appended.

---

## Amendment 3 — the partial-covering eviction exception is withdrawn on its own reopen condition (2026-09-06, appended — Proposed until the human's word)

**This section fires Amendment 1's own reopen condition**, quoted from that amendment verbatim:
*"Evidence of visible in-viewport holes attributable to partial-covering eviction reopens this as
a defect — this declaration stands only while no such evidence exists."* The evidence exists.

**Context.** At the residency-debt close-out sitting (walkthrough Part L, 2026-09-06; candidate
arm, `fine`, polygons-100k, arm verified from the app's own session log), the human observed at an
over-budget zoom-out, verbatim: *"you see that he's rendering tiles for half a second, then they
disappear, and a new one appear and then disappear, constantly and then the last one rendered in
the north, left corner and stayed there."* An operator observation, not a measurement (docs/08: no
numbers, no claim). Mechanism, code-traced (DECISIONS-PENDING entry 44; the 1a diagnosis spike's
Q2): over budget, each admission evicts to make room; a just-admitted, budget-trimmed tile is
durably partial; a partial in-viewport tile falls out of the per-round protected set — exactly the
exception this amendment withdraws — so the next admission evicts it: admit, evict, admit, evict.
The session log of that window shows the other half: every zoom-out re-plan truncated the covering
set by 865 to 5,758 tiles beyond `MAX_QUEUED_TILES` while ~2,000 tile streams landed — a fill that
could never converge at that zoom. The human's ruling (entry 44), verbatim: *"we either fix it and
I re-do L5 to L9, otherwise is pointless."*

**What is WITHDRAWN.** Amendment 1's exception 2 — *"Partial covering tiles during over-budget"* —
only. Item 3's rule, *"never evict a tile intersecting the current viewport"*, returns to admitting
ONE declared exception.

**What is KEPT, unchanged.** Exception 1, the dedupe-owner cascade (architect-gate clarification 3),
and with it the divert-don't-blank behavior that keeps it honest (a protected suppressor is marked
partial, never evicted).

**What replaces it.** Protection is geometric: the set of tile keys covering the current viewport
bbox at the active grid level — the planner's own `tilesCoveringBbox` result for the round —
independent of any planning round's outcome arrays. A tile intersecting the viewport is protected
whether it is complete or partial, tracked this round or a prior one, or never requested at all.
The same set is what the completeness bookkeeping reads, so a covering tile that was never
requested can never be absent from the set a "Showing all N" claim is checked against (Amendment
2's reopen condition (2), closed by construction rather than by observation).

**Consequences.**
1. An over-budget view whose resident set is entirely in view has no pressure valve. The declared
   partial view plus its persistent status — the over-budget sentence with the paused suffix while
   tiles remain queued, or with the settled-partial suffix at quiescence; alternatives, never a
   sequence — is the entire answer (decisions 24(a)/(b)). A stable partial view replaces a
   flickering one. The exits are a real pan or zoom, which is what the settled-partial wording
   already tells the operator to do. This absorbing state is declared here, not discovered.
2. Amendment 1's settled-predicate caveat (*"an eviction under this clause frees vertices, which
   reopens headroom, which reopens issuance, so "settled" may never be declared from a state this
   exception can still change"*) becomes vacuous for the withdrawn clause — the predicate is
   strictly safer, not less safe. It is retained for exception 1.
3. ADR-006 class 1 / derived state only. No wire change; ADR-010 rule 1 untouched. Tile keys never
   cross a module or protocol boundary.
4. Finding 3, carried as a named open item "due at 1b" by this ADR's Acceptance-discharged
   section, is discharged here BY FIX rather than by declaration.
5. **Ruled by the human, 2026-09-06 (DECISIONS-PENDING entry 45), verbatim:** *"Amendment 3 =
   APPEND, clause 5 ruled — this is a fix, recorded as such: proposed stance, gate-8 ruling
   stands on its existing commits, no re-measure owed now, but any future cross-commit arm
   comparison must declare the eviction-policy change."* Amendment 1 stated, verbatim: *"Because
   the resolution is declaration, not fix, option (ii)'s consequences do not attach: the gate-8
   evidence above remains comparable as-is for future arms, and no re-measure obligation is
   created."* This amendment IS a fix, so that sentence's premise no longer holds, and the ruled
   stance replaces it: the gate-8 ruling stands on the evidence at its own recorded commits; no
   re-measure is owed now; the fix keeps the resident set nearer `MAX_RESIDENT_VERTICES` for
   longer at over-budget zoom-out (the same axis G4 measured, where G4 already fails on its strict
   letter), so any FUTURE arm comparison across this change must declare the eviction-policy
   change, and a fresh preregistered gate is owed only if a future cut wants to compare across it.
   The Part L re-run is a felt re-verdict and is never presented as a G4 re-measure.

**Reopen conditions** (Amendment 2's own pattern).
1. Evidence of a stuck-partial state that a real pan or zoom cannot exit reopens this as a defect.
2. A contradicting felt re-verdict at the L2-L9 re-run on the fixed build reopens rather than
   stands (this ADR's own gate-8 rider pattern).

**Provenance.** Drafted for the human's sight beside the implementing piece (branch
`cut/residency-debt-fix`, preregistered in `frontends/shell/RESIDENCY-DEBT-1B.md`'s close-out
section); appended to ADR-028 only on the human's word, at which point this PROPOSED file is
deleted in the same commit.
