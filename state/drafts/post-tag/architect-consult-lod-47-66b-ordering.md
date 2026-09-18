> **Status: consult — the architect's post-tag drafts and ordering consult of 2026-09-09, for the human's sight.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# Architect consult — the three post-tag drafts and the post-tag ordering (2026-09-09, for the human's sight; nothing filed, nothing decided)

*Read-only consult by the architect agent on the custodian's brief, verifying the drafts' cites against the tree at `main` 279b43f. The recommendation line in §3 is the architect's, not a ruling. The custodian changed nothing but this header. The ADR-032 consult is the sibling file `architect-consult-adr-032.md`.*

Scope: `lod-brief-revised.draft.md`, `entry-47-repick-brief.draft.md`, `entry-66b-geometric-protection-brief.draft.md`, plus `adr-032-problem-statement.draft.md` for §3 only.

---

## 1. Per-draft verdicts

### A. `entry-66b-geometric-protection-brief.draft.md` — **pass with notes** as a preregistration draft

Every `file:line` I checked holds on `main`: `tileGrid.ts:158-167` (`flooredEnd - 1` on an integer edge), `:172-183` (`coveringIndexRanges`, private), `:197-200`, `:311`, `:342`, `:112-114`; `tileResidentSet.ts:332` (`evictTile(..., protectedTileKeys)`), `:438`, `:469` (`.has` is the only method read — the `{ has(key) }` widening claim is sound), `:417`, and the entry-66 qualifications at `:420-428`/`:436-437`/`:455-457`; `WorkingCanvas.tsx:257-261`, `:315-317`, `:1245-1251` (`anyPartialAmongCovering` iterates `coveringTileKeysRef.current` — it genuinely cannot consume a predicate); `tileViewportStreamManager.ts:259-265`, `:376-398`, `:377`, `:409-418`; `candidateArmSession.ts:1348`, `:1418`, `:1391-1399`. The half-open argument in design item 2 is correct against the code, and the equivalence argument in item 9 (`isTilePartial` false for non-resident keys) is correct.

Three findings the draft does not carry:

1. **Design item 8 understates the consequence — retention is also issuance.** `drainQueueIfRoom` (`frontends/shell/src/streaming/tileViewportStreamManager.ts:639-647`) mints from `this.queue` with **no cover re-check**, and `mintAndStart` builds the tile bbox from `this.level` at mint time (`:652`). A queued in-view tile outside the window, no longer dropped at `:378-382`, will therefore be **issued as a fresh `viewport_query`** later. Item 7's sentence — `coveringKeys` stays "for the new-candidate loop, which must only issue tiles this round actually enumerated" — is true of that loop and false of the manager. This is new wire traffic for cells this round never enumerated; declared or not, it must be named and tested.
2. **Level/frame agreement is assumed, not declared.** Tile keys are level-relative; the membership is built from `(frame, level, bbox)` separately from the plan that produced the resident keys. Today there is no drift — `this.level` is set once at construction (`:256`) and no setter exists in `frontends/shell/src` — but that is an unstated invariant the piece now depends on.
3. **The closing note cannot say "the exception is closed."** ADR-028's appended note declares **two** deviations (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:510` and `:512`); its Reopen sentence (`:518`) speaks of "this exception" singular. The piece as scoped closes `:510` only. The draft's own open question 1 sees this; the *wording* of the further appended note is the constitutional part, and it belongs in the preregistration, not in the open questions.

No overreach found. ADR-006 class is unchanged (class 1 / derived state, ADR-028:478), no boundary crossing (`:479`), no docs/08 row, no number.

### B. `entry-47-repick-brief.draft.md` — **pass with notes** as a preregistration draft

Verified: `pickResolution.ts:45` (`SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX = 2`, declared), `:97` ("deliberately NOT a re-pick"), `:119-131`; `streaming/debounce.ts:5-6` (trailing edge, exact wording as quoted); `VIEWPORT_QUERY_MIN_INTERVAL_MS = 120` at `streaming/viewportStreamManager.ts:24`; the coordinate-leak scan's three patterns (`canvas/noCoordinateLeak.test.ts:29-35`) match `.coordinate`, `["coordinate"]` and destructuring only — storing `info.x`/`info.y` does not trip it, as claimed.

Findings:

1. **Missing hazard: framebuffer identity.** ADR-010 rule 1 makes framebuffer dimensions part of a screen coordinate's meaning (`docs/adr/ADR-010-render-frames-origins-boundaries.md:25`). `lastPointerPxRef` is captured at hover and consumed at settle; a canvas resize or DPR change in that window silently re-aims the pick at a different place, with an id emitted as confirmed. The draft never mentions resize.
2. **The replacement K6 assertion is self-certifying.** Case (ii) removes today's falsifier ("the pre-zoom id after any notch = failure") and replaces it with "an id the trace names as re-picked" — where the trace is emitted by the code under test, at the emission point. A build that emits the trace and still shows a retained id passes. The new contract needs a discriminator the implementation cannot rubber-stamp.
3. **ADR-018 label.** The three instants named (`camera_change_seen` / `camera_settled` / `readout_confirmed`) are the drafter's, not ADR-018's — that ADR's own three are `cancel_requested`/`cancel_observed`/`cancel_quiescent` (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:43-47`). The class-(a) cadence reading is faithful (`:82-88`). Label the instants as an extension of the discipline, not as ADR-018 vocabulary.
4. **Two open questions widen the ruling.** Entry 47 was ruled (b) "re-pick on camera settle" (`DECISIONS-PENDING.md:873-875`); open question 8 (pan settles too) and open question 1's "unconfirmed" marking (a new operator-visible readout state) both sit outside that ruling and outside the sharpened criterion at `:877-890`.

### C. `lod-brief-revised.draft.md` — **pass with notes**; it is a pre-preregistration brief and correctly does not claim to be more

Verified verbatim: ADR-011 `:57` (gate 2), `:63` (gate 8 MET), `:73` (binds nothing); ADR-010 `:72`; ADR-016 `:58-63`, `:89`, `:93`; ADR-006 `:13-17`, `:16`; docs/01 `:13`, `:20`; docs/08 `:25`, `:62`; ADR-028 `:506-518`. Numbers are absent throughout, as required.

Corrections and overreach:

1. **Wrong quote, right line.** The brief renders `docs/07_Roadmap.md:22` as *"each require a fresh preregistered gate, never an amendment"*; the file reads **"(each requires a fresh preregistered gate, never an amendment)"**. One word, but it is marked verbatim in a text that will become a preregistration.
2. **L5 overreaches its cite.** `docs/07:22`'s reopen conditions govern reopening the **import-layout / spatial-indexing** decision, not import-path changes generally. P2 (import-time overview tiers) is not one of the three listed conditions. Keep the gate if the human wants it — it errs safe — but relabel it as the drafter's construction, not docs/07's text. (Note the direction of travel: reopen condition (2) is itself keyed to ADR-011's tiled direction being accepted.)
3. **L1 and L6 cite a Proposed ADR as a blocking authority.** ADR-011 states, and the brief itself quotes at line 26, *"Nobody may cite this ADR to block a review"* (`ADR-011:73`, and `:3` "not architect-blockable in review"). L1's rule survives on `docs/08:62` and principle 3 — re-source it there. L6's negative form ("nothing here may be cited as meeting the gates") is fine.
4. **Class gap under the human's own words.** The companion note classes a tier a "cancellable class-2 derivative" — ruled, and the brief follows it. But ADR-006 `:17` puts *file writes outside the workspace* in class 3 with a declared reversibility. Where the tier artifact lives, and which class its **write** is, is unanswered.
5. The ADR-017 / `RELEASE-0.1.md` checks the drafter flags as unread (brief line 116) are load-bearing for the bundle-side refusal wording. They stay owed before preregistration.

---

## 2. Block-on-sight conditions

**Entry 66 (b) — geometric protection**

1. No membership predicate that does not answer identically to `tileCoverForBbox`'s key set for every bbox at or under `MAX_COVERING_TILES`, boundary-exact `xmax`/`ymax` and degenerate-point cases included; a closed-bbox intersection fails on sight.
2. No membership object built from a `(frame, level, bbox)` triple other than the one the round's own plan used; a predicate at one level tested against keys minted at another fails on sight.
3. No supersede-path change without a named, tested account of the **queue drain**: a retained queued tile is issued later by `drainQueueIfRoom` with no cover re-check, so "retained" without "and therefore issued" is an incomplete disclosure and fails on sight.
4. No inversion of `anyPartialAmongCovering` (the `fits` latch) inside this piece without the human's word — it changes an operator-visible status (`WorkingCanvas.tsx:1245-1252`); and no silent *retention* of the window read either: whichever way it goes, the closing note states it.
5. No ADR-028 closing note that says the declared exception is closed while the second deviation (`ADR-028:512`) stands; the note names which of the two paths (`:510`, `:512`) is closed, or it fails on sight.
6. No change to `MAX_COVERING_TILES`, `COVER_WINDOW_CELLS_PER_AXIS`, what is enumerated, `coveringTruncated`/`lastCoveringTruncated`, or `isFillComplete`; a diff touching completeness bookkeeping fails on sight.
7. No predicate that throws: `has` is total over any string, and a non-finite bbox protects nothing.

**Entry 47 — re-pick on settle**

8. No re-pick at a stored pixel that does not re-validate the framebuffer it was captured against (ADR-010 rule 1, `:25`); a resize between capture and settle that still fires a pick fails on sight.
9. No stored pointer value beyond screen x/y; any `info.coordinate` access, in any of the three shapes the scan knows, fails on sight (ADR-010 rule 1; `canvas/noCoordinateLeak.test.ts:29-35`).
10. No settle constant that is not declared in a constants file with the quantity it bounds — camera-change events coalesced — and never presented as a latency bound (ADR-010 rule 6; ADR-018 `:82-88`).
11. No unbounded settle: at most one outstanding timer, superseded by a real `onHover`, cancelled on unmount; a gesture that never pauses runs no pick and accumulates nothing (docs/01 principle 7, `:13`).
12. No id emitted at settle that is not a fresh GPU-ordinal → stable-id resolution (ADR-010 rule 2); a retained string re-asserted across a camera change fails on sight (rule 5, `:68`).
13. No K6 contract change that leaves staleness detectable only by a trace the same code emits: the replacement must include at least one case whose correct answer is a *different* id or an absence, so the assertion can fail on the defect the removed one caught.
14. No new operator-visible readout state ("unconfirmed"), and no pan-settle behaviour, without the human's answer — both sit outside entry 47's ruled (b) (`DECISIONS-PENDING.md:873-875`, `:877-890`).

**LOD**

15. No LOD code, and no ADR-031 preregistration, before the overview × filter rule is written with its cost stated as *what will be measured against which quantity* (the human's note, `NEXT-CUT.md:357-359`, `:373-375`).
16. No first representation that does not preserve per-feature identity one-to-one (ADR-016 `:58-63`); an aggregate arriving as a configuration of the first representation fails on sight.
17. No aggregate representation without its own gate and a named refusal — in shell and in the published bundle — for any pick it cannot honour; a plausible id, a nearest-feature guess, or silence fails on sight (ADR-010 rule 6 `:72`, ADR-028 item 4, principle 8).
18. No build in which first open waits on tier preparation, whatever it measures; the unprepared path stays live and preparation's time and disk cost are disclosed before it starts (docs/01 `:13`, `:20`).
19. No artifact — docs/08 row, results table, release text — in which preparation and prepared-open are summed, averaged, or presented as one figure; and no coverage quantity without its declared level.
20. No docs/08 row without its measurement and the human's sight (`docs/08:62`; ADR-011 gate 2 is the precedent, **not** the authority — `ADR-011:73`).
21. No new `viewport_query` shape or parameter without its own ADR proposal first (control-plane change, docs/04/10).

---

## 3. Post-tag ordering — evidence, then one recommendation

**What the human has said, verbatim:**

- 2026-09-08, evening (`DECISIONS-PENDING.md:45-46`; `NEXT-CUT.md:388-389`): *"Sequencing note for the post-release call, not decided now: ADR-032 (4326 admission) likely outranks LOD."*
- 2026-09-08 (`DECISIONS-PENDING.md:62`; `RELEASE-0.1.md:728`): *"47 = next cut's first piece; A9′ flakiness gets its own entry."*
- 2026-09-09 (`DECISIONS-PENDING.md:22-23`): *"(b) preregistered as the first post-tag piece beside ADR-032/LOD, half-open index ranges."*
- `RELEASE-0.1.md:1130`: *"**Sequencing:** the first post-tag piece, beside ADR-032 (4326 admission) and the LOD slice (ADR-031); the order among the three is the post-release call, not decided here."* And `NEXT-CUT.md:393`: *"The order among the three is not decided."*

**The tension, stated and not resolved:** entry 47 is ruled "next cut's first piece" (2026-09-08) and entry 66 (b) is ruled "the first post-tag piece" (2026-09-09). Both rulings stand in the record; nothing says whether "next cut" and "post-tag" name the same queue, and the later ruling does not mention entry 47. Only the human resolves that.

**Dependency facts (no ranking implied):**
- LOD is blocked by its own gate: the overview × filter rule is unwritten (`NEXT-CUT.md:373-375`). It cannot start regardless of rank.
- ADR-032 is a decision, not code — it consumes the human's time, not the implementation queue; its outcome decides which sources are admitted, and the LOD scale-class row is defined per **dataset class** (`docs/08:25`), so admission conditions which fixtures can populate that row.
- Entry 66 (b) is the only candidate with a filed preregistration (`RELEASE-0.1.md:1126-1130`), and ADR-028 `:518` names its landing as the thing that closes the declared exception and retires a KNOWN-LIMITATIONS line shipping in v0.1.0.
- Entry 47 and entry 66 (b) both edit `frontends/shell/src/canvas/WorkingCanvas.tsx`, in different regions (hover site vs. handle signature / `protectionSetFor` / refs). Sequential landing avoids a merge over a file with an unusually dense comment record.
- Entry 58 (A9′ flakiness) is recommended to be diagnosed "alongside entry 47 … (same code, same repro harness)" (`DECISIONS-PENDING.md:414-415`) — a coupling that travels with 47's rank.

**Recommendation (the architect's, one line, not a ruling):** 66 (b) first (preregistered, closes a shipped limitation and an ADR-028 deviation, no decision owed), entry 47 second (drafted, ruled, same file, entry 58 rides with it), the ADR-032 **decision** answered in parallel on paper since it costs queue nothing, LOD last and gated on its own unwritten rule.

---

## 4. Open questions for the human (not already in the drafts)

1. Do "next cut's first piece" (entry 47) and "the first post-tag piece" (entry 66 (b)) name the same queue? If yes, which ruling governs?
2. Entry 66 (b): a retained queued in-view tile past the bound **will be issued later** by the queue drain, for a cell this round never enumerated. Acceptable as declared behaviour, or does the drain need its own cover re-check?
3. Entry 66 (b): must the further appended note to ADR-028 say the exception is *partly* closed (path `:510` only) while `:512`'s `fits`-latch deviation stands — and does the KNOWN-LIMITATIONS line then still leave with the release?
4. LOD: where does a prepared tier's artifact live — inside the workspace (ADR-006 class 2, as your note says) or on disk outside it (whose *write* is class 3 with a declared reversibility)?
5. Entry 47: is the piece allowed to disarm on a canvas resize/DPR change (the cheap answer), or must a resized frame re-pick at a re-mapped pixel?
6. Entry 47: is a trace event the code emits acceptable as the E2E's only staleness discriminator, or must the replacement K6 include a case whose correct answer is a different id?

---

Files consulted: the four drafts; ADR-028, ADR-011, ADR-010, ADR-016, ADR-018, ADR-006; docs/01, 07, 08; `NEXT-CUT.md`, `RELEASE-0.1.md`, `DECISIONS-PENDING.md`; `frontends/shell/src/canvas/{tileGrid,tileResidentSet,WorkingCanvas,pickResolution,noCoordinateLeak.test}`; `frontends/shell/src/streaming/{tileViewportStreamManager,debounce,viewportStreamManager}`; `frontends/shell/src/residency/candidateArmSession.ts`. No files written. `tileIngest.ts`, `tileGridConstants.ts`, ADR-017 and the residency harness were not read — the cites resting on them are unverified here.
