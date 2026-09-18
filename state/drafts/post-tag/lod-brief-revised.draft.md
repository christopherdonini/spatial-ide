> **Status: draft — the revised LOD brief (2026-09-09); superseded by `engine/LOD-PREREGISTRATION.md`, its pre-committed form.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# LOD brief — REVISED DRAFT with the human's companion note folded in (for the human's sight — not scheduled, not filed)

*Drafted 2026-09-09 during the away window by the architect agent on the custodian's brief, read-only against `NEXT-CUT.md` and the ADRs it cites. The original LOD section in `NEXT-CUT.md` is untouched; this file is the revision. The drafter's two notes precede the text; every fragment marked verbatim is the human's. The custodian changed nothing but this header and HTML entities.*

**Verdict: pass with notes.** The fold-in is drafting work, not a decision; nothing in the companion note conflicts with docs/01, docs/02, ADR-006 or ADR-010. Two notes before the text:

1. **The "accumulate-into-image" fallback has no description on record.** I searched the whole repo (`accumulat*`, `into-image`, `view-locked`, `identity-free`, `bitmap|single image|flatten|framebuffer|texture|snapshot`). The only hits are the human's own note (`C:\dev\spatial-ide\NEXT-CUT.md:366-368`), the custodian's placement note (`:382-383`) and the ledger copy (`C:\dev\spatial-ide\CUT-STATE.md:124`). DECISIONS-PENDING entry 28 (`C:\dev\spatial-ide\DECISIONS-PENDING.md:1414-1449`) contains no such candidate, and neither does the LOD section. I have therefore recorded it with the human's caveat verbatim and flagged the missing description as an open question rather than inventing a mechanism.
2. The existing brief's context paragraph carries measured figures; per your drafting rule I have removed all numbers and pointed to `spikes/viewport-residency-1a-diagnosis/ATTRIBUTION-PASS.md` instead. No claim in the revision rests on a figure.

Revised brief follows.

---

## LOD slice — draft problem statement (ADR-031, home of record — renumbered 2026-09-08; ADR-030 = the notice-set decision)

**Not preregistered. Redrafted producer-side 2026-09-04; revised 2026-09-09 to fold in the human's dated companion note of 2026-09-08. Scheduling is unchanged and remains the human's deferred call.** No ADR-031 file is filed by this brief; it is filed on the human's word when the slice is dispatched (`NEXT-CUT.md:384`).

### The binding companion note (the human, 2026-09-08 — verbatim, quoted in full once)

> Dated companion note to the LOD brief (ADR-031 draft), no scheduling change: (1) overview × filter rule required before preregistration — retain filterable attributes / per-predicate rebuild / declared fallback to detailed queries, cost stated; (2) first representation = identity-preserving per-feature simplified tiers; aggregation is a separately-gated later representation that refuses identity by name (ADR-010 rule 6, ADR-016); (3) the scale-class row's quantities: first meaningful geometry, time-to-complete-coverage at declared level, navigation responsiveness; preparation vs prepared-open reported separately, never conflated; block-on-sight: open never waits on preparation (tier = cancellable class-2 derivative, prep time + disk disclosed, unprepared path live). (4) ADR-011 line gains a named lever after LOD: prepared binary attributes / producer-side tessellation, measured on the existing paint segment. (5) Record the accumulate-into-image fallback as a named candidate with its caveat: addresses residency, not time-to-data (#28); view-locked; identity-free.

(Source: `NEXT-CUT.md:357-368`; ledger copy `CUT-STATE.md:124`. Every fragment re-quoted below is from this note and is labelled verbatim. Everything not so labelled is the custodian's paraphrase or a citation.)

### Context

ADR-028 records that completeness at overview scales is not delivered and owes its own gate. ADR-011 is Proposed and **binds nothing** — "Nobody may cite this ADR to block a review, and nobody may cite it as a settled design" (`docs/adr/ADR-011-tiled-render-batches-gpu-cache-lifecycle.md:73`, verbatim from the ADR); gates 1-7 remain open and unmeasured, gate 8 alone is met by ADR-028 (`:63`).

DECISIONS-PENDING entry 28's attribution pass answered the wrong-module question on direct records (`DECISIONS-PENDING.md:1414-1427`; full record `spikes/viewport-residency-1a-diagnosis/ATTRIBUTION-PASS.md`): time-to-data dominates the client-side paint segments, so **"upstream of paint" is a grounded finding** and a renderer-side (client decimation) slice would target the minor cost pool. *Figures are deliberately not restated in this brief; the pass is the record.* Still open inside time-to-data: the split between kernel query execution, wire transport, and credit-window backpressure (a harness-only instrumented design is named in the pass). Two earlier arithmetics — the "152s/70 tiles" figure and the "three of twelve nulls" count — are corrected by the pass and must not be quoted.

### The reduction happens producer-side — the candidate set

- **(P1) Server-side aggregation on `viewport_query`** — the engine returns a reduced result at overview zooms instead of the full row set. Module owner: engine (05) + protocol (04/10). A new `viewport_query` shape or parameter is an SKP change even if not a new command (ADR-021 precedent), so its first artifact is an ADR proposal. ADR-006 class 1 (pure transformation, ephemeral result) if computed per request; class 2 (workspace mutation, transactional) if it materialises anything (`docs/adr/ADR-006-lineage-undo-side-effects.md:13-17`).
- **(P2) Import-time overview tiers** — reduced levels built once and read like any other layer. Module owner: import path + docs/11. ADR-006 class 2, and it drags docs/11 and principle 3's declared reproducibility grade with it. docs/07's spatial-indexing reopen conditions "each require a fresh preregistered gate, never an amendment" (`docs/07_Roadmap.md:22`, verbatim from docs/07); this slice may not consume one as a side effect.
- **(F1) The accumulate-into-image fallback — recorded as a named candidate, per the note's point (5).** The human's caveat, verbatim: *"addresses residency, not time-to-data (#28); view-locked; identity-free."* **No description of the mechanism exists in the record** — not in this section, not in DECISIONS-PENDING entry 28, not anywhere in the repository (searched 2026-09-09). It is carried here as a name plus its caveat so it is not lost and not re-derived; its details are an open question below. Its own caveat already places it outside the wall this slice exists to move: residency is not time-to-data, and identity-free conflicts with point (2)'s first representation, so it cannot be the first representation.
- **(REJECTED) Client-side decimation (renderer/shell)** — struck by entry 28's attribution: the wall is producer-side time-to-data. Decimating client-side leaves the server delivering the same rows it would decimate. Recorded rejected, not re-litigated.

### The first representation, and what aggregation must refuse (note point 2)

The human, verbatim: *"first representation = identity-preserving per-feature simplified tiers; aggregation is a separately-gated later representation that refuses identity by name (ADR-010 rule 6, ADR-016)."*

This fixes the architecture question that was previously open inside "which reduction": **the first representation reduces geometry per feature and keeps the feature.** One source feature maps to one reduced feature carrying its admitted identity — ADR-016's per-feature identity, admitted at open with no synthesis and no row ordinals (`docs/adr/ADR-016-stable-feature-identity-admission.md:58-63`), survives the tier unchanged. ADR-010 rule 2's ordinal → stable id → authoritative f64 chain therefore still resolves against a tier, and picking is a normal pick, not a special case. A simplified vertex is a different provenance class than a source vertex (ADR-013), and per-feature weakest-vertex provenance must say so.

**Aggregation is a later, separately gated representation.** Its gate is its own — it may not be reached by amendment to this slice's, and no ADR-031 decision may be worded so that aggregation arrives as a configuration of the first representation. ADR-016 has no referent for an aggregate cell, so aggregation *changes* identity semantics rather than extending them.

**What "refuses identity by name" must mean — the drafted reading, for the human's approval (custodian's construction from ADR-010 rule 6, ADR-016 and ADR-028 item 4, not the human's words):**

*In the UI.* A hover or pick over an aggregated representation returns a **named refusal** naming the representation and the reason — never a plausible id, never a nearest-feature guess, never silence. This is the ADR-028 item 4 discipline the K6 staleness defect was ruled against, and it is ADR-010 rule 6's own rule applied to identity rather than to a pick-index ceiling: "A layer design **states its ceiling and its sharding strategy before approaching it** … 'We are comfortably under it today' is not a strategy" (`docs/adr/ADR-010-render-frames-origins-boundaries.md:72`, verbatim from the ADR). Second clause: the representation currently in view is **declared in the status**, not inferred by the user from what the map looks like; and a standing readout is re-evaluated when the representation changes under a stationary pointer (the re-pick-on-camera-settle discipline already ruled for entry 47).

*In the published bundle.* Each layer declares which representation it carries. An aggregate carries **no identity field at all** rather than a synthesised one, and — following ADR-016 §6's rule that the envelope records the identity's provenance and what was checked, "never a bare claim" (`ADR-016:93`, verbatim from the ADR) — it records that provenance as *absent by construction*, not by omission. The bundle viewer's own pick path refuses in the same words as the shell, so a reader who picks in the published artifact learns the same fact a reader in the app learns. **Check owed:** the exact surface for this in the bundle format is ADR-017's, which this brief has not read; the preregistration must cite it.

### The scale-class row and its quantities (note point 3)

Already ruled (2026-09-03, verbatim, retained from the prior draft): *"the new docs/08 scale-class row, landed with its measurement per ADR-011 gate 2, defined as a dataset class (feature/vertex brackets), not 'the 5 GB file'; 5 GB assertion-only items retained besides."* That matches docs/08's own framing — "Feature count alone is not a workload" and "Budgets are defined per dataset class" (`docs/08_Testing.md:25`, verbatim from docs/08).

The companion note names the row's quantities, verbatim: *"first meaningful geometry, time-to-complete-coverage at declared level, navigation responsiveness; preparation vs prepared-open reported separately, never conflated."*

Consequences for the preregistration:

- **Three quantities, each defined before it is measured.** "Time-to-complete-coverage **at a declared level**" is only meaningful if the level is named in the row; a coverage figure without its level is not a measurement. Whether these land as three rows or one row with three columns, and which are budget-bearing versus reported-only, is an open question below.
- **Preparation and prepared-open are separate reported quantities and are never summed, averaged, or presented as one figure.** A prepared-open figure that silently excludes preparation is the same falsehood class this programme has already convicted twice ("Showing all N" over truncated sets). The row must make it impossible to read one as the other.
- **No row lands without its measurement and human sight** — ADR-011 gate 2's own words: "The docs/08 rows land with the measurement, not before it — adding CI-enforced budget rows for an unbuilt system inverts 'no numbers, no claim'" (`ADR-011:57`, verbatim from the ADR).
- The existing 5 GB assertion-only items are retained alongside the scored row, not replaced by it.

**Block-on-sight — open never waits on preparation.** The human, verbatim: *"open never waits on preparation (tier = cancellable class-2 derivative, prep time + disk disclosed, unprepared path live)."* Read against the constitution: docs/01 principle 7 is "**Async by default.** All operations are cancellable, streaming, and progress-reporting" (`docs/01_Principles.md:13`, verbatim), with the derived rule "**Never block the canvas** … This is principle 7 made measurable" (`:20`, verbatim). Building a tier is an operation, so it is cancellable and progress-reporting like any other; ADR-016 §5 already applies exactly this reasoning to uniqueness verification, which "reads a whole column, so it is an operation" (`ADR-016:89`, verbatim). And it is ADR-006 **class 2** — a workspace mutation under the command/event log with a transaction boundary (`ADR-006:16`), which is what makes "cancellable class-2 derivative" coherent: cancelling leaves no half-tier visible as data. Therefore: opening a dataset never blocks on tier preparation; the unprepared path stays live and usable while preparation runs or is declined; preparation's time cost and disk cost are disclosed before it starts, not discovered after.

### The ADR-011 line's named lever after LOD (note point 4)

The human, verbatim: *"ADR-011 line gains a named lever after LOD: prepared binary attributes / producer-side tessellation, measured on the existing paint segment."* Recorded here as a named, *unscheduled* successor item, explicitly **after** LOD: once the producer-side wall is moved, the remaining client segment is the one the attribution pass measured, and that is the segment this lever is measured against. It binds nothing now, adds no gate to this slice, and — since ADR-011 is Proposed — may not be cited to block a review (`ADR-011:3, :73`). It sits alongside ADR-028's two existing named binding-debt mechanisms on that line (pan-west keying; the zoom-to-layer admission window), which are untouched by this slice.

### Block-on-sight conditions

- **L1** No docs/08 row lands without its measurement and human sight (ADR-011 gate 2).
- **L2** No new `viewport_query` parameter without its own ADR (ADR-021 precedent).
- **L3** No unlabelled reduced geometry: the representation in view is declared in status, and any pick it cannot honor refuses by name (ADR-028 item 4 precedent, ADR-010 rule 6, principle 8).
- **L4** Single render origin retained — per-tile origins reopen ADR-011 item 6/gate 1, unpayable here (ADR-010 rule 3).
- **L5** No import-path change without a fresh preregistered gate (`docs/07_Roadmap.md:22`); this slice may not consume one as a side effect.
- **L6** ADR-011 gates 1-7 stay open; nothing here may be cited as meeting them, and gate 8's answer is not reopened.
- **L7** Anti-cherry-pick: LOD must not regress the step classes the candidate arm just won. A fit-view win bought by a zoom regression is the trade G7 exists to catch.
- **L8 (new, note point 2)** The first representation preserves per-feature identity. No aggregate representation ships under this slice's gate; if one is built, it arrives with its own gate and its refusal-by-name surfaces in both the shell and the bundle.
- **L9 (new, note point 3)** Open never waits on preparation. A build that makes first open depend on a prepared tier fails on sight, whatever it measures.
- **L10 (new, note point 3)** Preparation and prepared-open are reported separately and never conflated, in every artifact — row, results table, release text.

### Scheduling

Unchanged by the companion note, which says so itself ("no scheduling change"). Deferred to the human at the post-release sitting. LOD is not on docs/07's own critical path (the open gates there are macOS/Linux hardware validation, `docs/07_Roadmap.md:17`; the transport bake-off and spatial indexing, `:19-22`; ADR-009, `:26` with its dated public-since correction) — it is a self-chosen quality bar. The correction recorded in the prior draft stands: the 5 GB fixture **is** deterministically regenerable (`kernel/FIXTURES.md`); the consult's contrary sentence was true when written and is now wrong. G1 (rendered-⊆-authoritative) remains unestablished, and LOD makes it harder to ignore.

### Open questions for the human (numbered; no recommendations here)

1. **The overview × filter rule** (note point 1, required before preregistration): which of *retain filterable attributes* / *per-predicate rebuild* / *declared fallback to detailed queries* is the rule, or in what combination — and what happens when a filter predicate has no prepared tier? The note requires its **cost stated**; stated as *what will be measured and against which quantity*, since no figure may be written in advance ("no numbers, no claim", `docs/08_Testing.md:62`).
2. **The accumulate-into-image fallback**: what is it? No description exists in the record. Its caveat is recorded; its mechanism is not.
3. **P1 or P2 first** — P2 cures the overview state directly with no wire change and its own class-2 gate; P1 is one SKP change that can also carry entry 42's producer-declared extent.
4. **Does entry 40's empirical producer pass run before the architecture is chosen**, or ride the LOD cut's own instrument?
5. **The aggregation representation's gate**: its own ADR, or a separately gated section of ADR-031?
6. **The scale-class row's shape**: three rows or one row with three columns; and which of the three quantities are budget-bearing versus reported-only?
7. **Is ADR-031 filed now as Proposed**, or at dispatch as the note's last sentence currently has it (`NEXT-CUT.md:384`)?
8. **Order among the three post-release candidates** (below).

### What this brief still lacks before it can be preregistered

- The overview × filter rule, written (question 1). The note makes this a **gate on preregistration, not a piece**: no LOD code before it exists.
- The architecture choice, P1 or P2 (question 3).
- The scale-class row's bracket definition, its three quantity definitions including "declared level", and its measurement plan — none of which may carry a figure in advance.
- The aggregation representation's gate shape and the exact refusal wording for shell and bundle, cited against ADR-017.
- The kernel-vs-transport-vs-backpressure split inside time-to-data, **if and only if** P1's design turns on it.
- The accumulate-into-image candidate's description (question 2).
- An account of how tiers interact with ADR-028's declared exception past the bounded tile cover (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:506-518`) — coarser levels change which zooms reach the window regime. *Custodian's inference, not a recorded finding.*

### Relation to the other two post-release candidates (sequencing facts only; the order is the human's)

- **ADR-032** (a GeoParquet source declaring a non-x-first axis order) is filed Proposed with its decision open. The human's sequencing note of 2026-09-08 evening, verbatim: *"Sequencing note for the post-release call, not decided now: ADR-032 (4326 admission) likely outranks LOD."* Not decided (`NEXT-CUT.md:388-391`). Fact of interaction: ADR-032 governs which sources are admitted at all, and the scale-class row is defined by dataset class, so which fixtures can populate that class depends on the admission decision.
- **The geometric-protection piece** — restore ADR-028's protection rule at every zoom without enumeration, via half-open index ranges — is preregistered in `RELEASE-0.1.md` Amendment 12 and named by the human "the first post-tag piece beside ADR-032/LOD" (`NEXT-CUT.md:393`, added 2026-09-09 on entry 66 = (d)). Fact of interaction: its landing closes ADR-028's declared exception by a further appended note on the human's word (`ADR-028:518`).
- **The order among the three is not decided** (`NEXT-CUT.md:393`). Nothing in this brief advances or defers any of them.

---

Files read for this draft (all absolute): `C:\dev\spatial-ide\NEXT-CUT.md`, `C:\dev\spatial-ide\CUT-STATE.md`, `C:\dev\spatial-ide\DECISIONS-PENDING.md`, `C:\dev\spatial-ide\docs\07_Roadmap.md`, `C:\dev\spatial-ide\docs\08_Testing.md`, `C:\dev\spatial-ide\docs\01_Principles.md`, `C:\dev\spatial-ide\docs\adr\ADR-010-render-frames-origins-boundaries.md`, `C:\dev\spatial-ide\docs\adr\ADR-011-tiled-render-batches-gpu-cache-lifecycle.md`, `C:\dev\spatial-ide\docs\adr\ADR-016-stable-feature-identity-admission.md`, `C:\dev\spatial-ide\docs\adr\ADR-028-viewport-bounded-residency-over-budget-contract.md`, `C:\dev\spatial-ide\docs\adr\ADR-006-lineage-undo-side-effects.md`. No files written. `ADR-017` and `RELEASE-0.1.md` are cited by name only — I did not read them, and the two places that depend on them are flagged as checks owed.
