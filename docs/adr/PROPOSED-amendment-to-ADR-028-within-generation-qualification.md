# PROPOSED appended amendment to ADR-028 — every residency statement is within one generation

*Drafted 2026-09-10 at Brief A's P0 by the architect agent on the custodian's brief, for the human's sight. Filed on `cut/admission-format-semantics`; nothing here is in force.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit.
**Would amend:** ADR-028 (Accepted 2026-09-02; **not** architect-blockable — `ADR-028:6`) as
**Amendment 4**, by appended text, never by rewriting.
**Basis:** Brief A's settled boundaries 3, 4, 9 and 10, and block-on-sight A1, A2, A3 (2026-09-09,
binding).
**Related:** ADR-028 Amendment 2 (the existing cancel lever and quiescence signal), Amendment 3 (the
geometric protection rule), the appended note of 2026-09-09 (the bounded-cover exception);
ADR-018 (the existing `cancel`, instants never durations); ADR-016 Amendment 1 (Proposed — where G
is defined).

## Proposed text

> **Amendment 4 (date, appended) — the within-generation qualification.**
>
> **1. Scope, not substance.** Every residency statement this ADR makes is **scoped to one dataset-
> session generation G**. This changes **no accepted rule**; it bounds the referent every rule
> already had. Specifically:
>
> - **Protection** — Amendment 3's geometric rule (*"A tile intersecting the viewport is protected
>   whether it is complete or partial, tracked this round or a prior one, or never requested at
>   all"*) protects tiles **of the current G**.
> - **Completeness** — no completeness claim ("Showing all N…") survives an invalidation. A claim
>   made under an invalidated G is stale by construction and is cleared, per Amendment 2(c)'s own
>   rule that silence and staleness never represent state.
> - **The declared partial view** and its persistent status describe the current G's resident set.
> - **The over-budget latch**, `fits`, and the fill-completeness predicate are read within G.
>
> **2. On invalidation.** Residency is **cleared**; in-flight streams are **cancelled through the
> existing cancel** (the existing `cancel` SKP command, ADR-018 — no new wire, the same lever
> Amendment 2(a) already repoints); **picks are refused** until reopen; and **late batches are
> dropped by ticket**. A batch is attributed to a generation **via its ticket**; the client drops any
> batch whose ticket belongs to an invalidated generation, so a late result never repopulates the
> canvas.
>
> **3. The drop is a second predicate at an existing site — no wire field.** The ticket already
> reaches the batch: `frontends/shell/src/streaming/tileViewportStreamManager.ts:685` captures
> `streamHandleAtStart = ticket.stream` at mint and `:699` passes it out through `onBatch`;
> `viewportStreamManager.ts:189-212` has the same shape, with an existing supersede drop at
> `:193-201` as the precedent this one sits beside. **Data plane: EMPTY DIFF.** Generation
> attribution rides the existing ticket and no new wire field is introduced.
>
> **4. Duties, split.** The **kernel** is the refusal authority: no ticket is minted or honoured
> under an invalidated G. The **client** is the drop authority: a batch already in flight is dropped
> at its sink. Both hold a ticket→generation mapping; neither puts it on the wire.
>
> **5. Interaction with the appended note of 2026-09-09 — both stand.** That note declares an
> exception past a bounded tile cover: past `MAX_COVERING_TILES` the windowed array is both the
> eviction-protected set and the supersede keep-set, so Amendment 3's geometric rule holds **inside
> the window only** at those zooms. That is a **spatial** narrowing of the protection rule. This
> amendment is a **temporal** one. They compose and neither weakens the other: inside G, protection
> is geometric within the window; outside G, there is nothing to protect. The note's completeness
> guarantee is likewise per-generation — `coveringTruncated` refuses a completeness claim over a
> windowed cover (`ADR-028:514`), and an invalidated G refuses one regardless of the cover.
>
> **6. What this amendment does not do.** It states no new residency behaviour, retires no reopen
> condition, discharges no binding debt, and touches neither the gate-8 evidence nor its ruling. It
> attaches no number and no duration to anything.

## What this changes / does not change

**Changes:** the referent of every residency statement (one generation), and names the invalidation
consequences and the drop's attribution mechanism.

**Does not change:** the Decision's items 1-5; the architect-gate clarifications; Amendments 1, 2
and 3; the 2026-09-09 note; the gate-8 written answer, its ruling, or the named binding debt;
ADR-028's **not architect-blockable** status. P3's architect-blockability comes from Brief A's own
phase gate, not from this amendment.

## Accepted at

Brief A's **P6**, on the human's word only. Red line.

## Block-on-sight conditions (P1–P3 reviewers)

1. **A3** — any diff under `protocol/data-plane/` (EMPTY DIFF), or a new wire field carrying a
   generation.
2. A batch admitted to the canvas whose ticket belongs to an invalidated generation (Gate G-A3), or
   a drop implemented by a timestamp, a sequence number or a heuristic rather than by ticket.
3. A new cancel path instead of the existing `cancel` (ADR-018; Amendment 2(a)).
4. A completeness claim, an over-budget reading, or a `fits` decision surviving an invalidation.
5. A pick answered after invalidation rather than refused.
6. Any test text claiming the mechanism demonstrates detection of *every* modification rather than
   of a **detected** change (Gate G-A3's own wording; **A1**).
7. Any duration in a walkthrough row or a status string (**A6**, ADR-018).

## Open questions routed

**Architect:** whether the client's ticket→generation mapping lives in the two stream managers or in
`candidateArmSession.ts` (both read the same ticket; one owner, not two); whether the drop is
counted for the session log the way the existing superseded-bytes counter is
(`viewportStreamManager.ts:198-200`); whether the untiled first-look stream needs its own drop or
inherits the manager's.

**Human:** none. If any of this is found to require a wire change, it stops being architect-routed
and becomes the human's by Brief A's own routing (a guarantee change).
