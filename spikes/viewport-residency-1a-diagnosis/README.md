# Spike — 1a: Held-Queue, Finding-3, and Pan-West Diagnosis

**Question:** three unresolved questions block scoping the viewport-residency cut's debt slice
(1b) and drafting the LOD slice's problem statement. Before either can proceed: (1) what actually
happens to the ~150s zoom-to-layer admission queue while it is held over budget — does it drain,
does it compound, is it in any sense cancellable? (2) when a partial covering tile is evicted
under over-budget pressure (ADR-028's newly-found second undeclared eviction exception, "finding
3"), does that function as a sensible pressure valve or as harmful thrash? (3) of pan-west's
re-admitted tiles in the P10 spiking trials, what fraction were recoverable (previously
completed/untrimmed) versus unrecoverable (previously partial/trimmed) — the precondition the
pan-west request-identity-keying design seed depends on?

**Stakes:** ADR-028 §"Finding 3" names its own resolution (amendment-with-rationale vs. a fix) as
"decided from the debt slice's own 1a diagnosis phase evidence... due at 1b." The architect
consult that scoped this cut (`a8f4c2c0cb1ff80ed`, 2026-09-02) made 1b's own scheduling of
request-identity keying conditional on this spike's answer to question 3: *"Do not schedule it in
1b unless 1a shows a materially recoverable fraction."* Nothing here gates anything — per spike
discipline (CLAUDE.md), no product code changes, no preregistered gate. Written conclusions are
the deliverable; 1b's own scope and any product-code changes are a separate, later step.

## Method

Read-only code investigation, no files modified. All three questions are answered (or bounded)
purely by tracing control flow through the already-existing, already-shipped candidate-arm
residency code — no new instrumentation, no re-run of any trial. Every claim below cites an exact
file:line; every direct quotation is copied verbatim, never paraphrased into quotation marks (this
project's own recurring citation-fabrication defect class — see `frontends/shell/e2e/citationIntegrity.test.mjs`).
A sample of the highest-stakes citations in this report was independently re-verified against the
current source by the custodian dispatching this spike, separately from the investigating agent —
all matched exactly.

Files read: `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md`,
`docs/01_Principles.md`, `frontends/shell/src/canvas/tileIngest.ts`,
`frontends/shell/src/canvas/tileResidentSet.ts`, `frontends/shell/src/streaming/tileViewportStreamManager.ts`,
`frontends/shell/src/residency/candidateArmSession.ts`, `frontends/shell/src/canvas/WorkingCanvas.tsx`,
`frontends/shell/src/App.tsx`, `frontends/shell/RESULTS.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`.

## Question 1 — Queue disposition of the held-uncancelled window

**Answered, with one refinement to how the finding was originally phrased.** The core claim
("`drainQueueIfRoom` refuses to drain while over budget and nothing resumes it without a camera
change") is confirmed exactly. "Uncancelled" is accurate for every trial actually on record — the
automated harness never exercises the Cancel button — but is not literally true of the system as a
whole: a real Cancel path does reach this queue. It is simply coarse enough that it does not act as
a scoped relief valve.

- **Drainage.** `drainQueueIfRoom` (`tileViewportStreamManager.ts:447-455`) opens `if (this.overBudgetFlag) return;` — every call site is a no-op while the flag holds. The only place that flips it `false` is `setOverBudget`, called with `false` from exactly one place in the codebase: `candidateArmSession.ts:739`, inside `handleViewportChange`, which itself fires only from real pan/zoom/fit events. So: **confirmed, only a camera change resumes it.**
- **A camera change arriving mid-hold.** `onCameraChange` (`tileViewportStreamManager.ts:248-343`) drops queued/in-flight work for tiles that fall outside the new covering set, but tiles that remain covered are left exactly as they are — still `"queued"` in the same array — and newly-computed candidates are appended to that *same* queue (`:336-338`). Old held work for still-covered tiles is not cleared by a camera change; it persists and is joined by the new operation's own candidates, exactly as the original framing implies.
- **Is "uncancelled" literal?** No. `TileViewportStreamManager.stop()` (`:412-424`) does cancel every in-flight stream and empties the queue — wired to the operator's Cancel button (`App.tsx:1229-1236`, whose own comment states plainly: *"`manager.stop()` (the tile-planning `TileViewportStreamManager`, NOT the whole `session.stop()`) cancels every in-flight tile stream and drops the queue"*). But `stop()` sets `this.stopped = true` with no reset method anywhere in the class, and every subsequent `onCameraChange` short-circuits to `{kind: "stopped"}`. A fresh manager is constructed once per dataset-open. **So Cancel does reach the held queue, but only by permanently disabling all further candidate-arm tiling until the dataset is closed and reopened** — a kill switch, not a scoped cancel.
- **Against docs/01 principle 7** (verbatim: *"7. **Async by default.** All operations are cancellable, streaming, and progress-reporting."*, `docs/01_Principles.md:13`): cancellable only via an all-or-nothing kill switch; not streaming while held (no bytes flow, and the hold is open-ended once `overBudgetFlag` latches with no relieving camera change); not meaningfully progress-reported (the only operator-facing signal is a boolean scan-liveness flag and the persistent `candidate-over-budget` status — neither distinguishes "actively progressing" from "structurally stalled until a pan happens"). **The gap is real and specific: not the total absence of cancellation, but the absence of a scoped one, and the absence of a progress signal that tells the operator or the system the queue is stuck rather than working.**

## Question 2 — Finding 3: pressure valve or thrash?

**Partially answered from code structure; the frequency/severity half is not determinable without
a runtime trace, and this report does not guess a number for it.**

- **Confirmed trigger mechanism.** `planTileEviction`'s absolute rule — never evict a tile in `viewportTileKeys` — is enforced by filtering `viewportTileKeys` out of the evictable set (`tileResidentSet.ts:461`). What populates that protected set during over-budget is the gap: `onCameraChange`'s per-round outcome arrays (`issued`/`queued`/`alreadyResident`) omit (a) tiles already tracked from a prior round (`:293`, skipped at the top of the loop) and (b) any candidate dropped for lack of headroom while over budget (`:330`, `if (this.overBudgetFlag && !headroomDespiteOverBudget) continue;`) — and `alreadyResident` itself is gated on `isTileCompleteInCandidateSet`, not the weaker `isTileResidentInCandidateSet` (`candidateArmSession.ts:454`, its own comment names this explicitly: *"planning treats partial as non-resident"*). A tile that is genuinely within the viewport, durably `partial`, and untracked this round is therefore **absent** from the protected set — unprotected and evictable, confirming ADR-028's own finding-3 text.
- **The "valve" half — code-provable.** `planTileEviction` is only ever invoked from `tileIngest.ts`'s admission path (`:117-129`), gated on the incoming batch actually needing room; the freed budget is consumed by that same admission on the very next lines (`:130-151`). So "does eviction free budget that gets used productively" is trivially yes, by construction — not something a runtime trace is needed for.
- **The "thrash" half — bounded, not measured.** There is no automatic re-request mechanism anywhere in `TileViewportStreamManager`; the only path back to candidacy for an evicted tile is a future, real `onCameraChange` call that still covers its bbox. This structurally rules out tight-loop thrash (evict → same-tick re-fetch → evict again) — nothing in the code could produce that. It does **not** rule out a slower, pan-cadenced version: the evicted tile's previously-rendered content silently disappears from view — a real completeness regression with no compensating status signal — until some later pan happens to re-cover and successfully re-admit it. **Whether that reads as smooth incremental fill or as visible flicker/regression, and how often it fires, is a timing question a runtime trace would need to answer. This report does not estimate a frequency.**
- **A structural connection worth flagging, not sourced from any prior doc:** the mechanism that exposes a partial tile to eviction here and the mechanism behind pan-west's own large `duplicatesDropped` re-admission spike both hinge on the same object — a durably-partial, still-resident tile being re-requested. See Question 3.

## Question 3 — Pan-west's recoverable fraction: verify and extend

**The two code hooks ADR-028 already names for a future instrumented pass are verified accurate,
unchanged:** `tileIngest.ts:156-157` (`const trimmed = overBudget && toAdmit.ids.length < batch.ids.length; const result = tileSet.addBatch(tileKey, toAdmit, trimmed);`) and `tileResidentSet.ts`'s `TileEntry.partial: boolean` field (`:49`, sticky per its own doc comment — upgrades on a partial admission, never downgrades back to `false` except via the explicit `markTileComplete`).

**A structural (not measured) bound, newly derived here.** `knownIds`/`idOwner` — the dedupe-membership state behind `duplicatesDropped` — are cleared for a tile's ids only inside `evictTile` (`tileResidentSet.ts:367-368`); nowhere else. And a **complete** tile is excluded from re-request entirely for as long as it stays resident and un-evicted (`onCameraChange`'s `alreadyResident` routing, above). Combining these: a **large** self-duplicate count against a tile's own prior content (pan-west's own signature — `duplicatesDropped` 10,140-11,098 per trial, `RESULTS.md`) requires that tile to have been *never evicted* since its earlier delivery, and a never-evicted, still-resident tile is only re-requestable at all if it is `partial`. A genuinely evicted-then-refetched **completed** tile would instead show close to zero self-duplicates (its ids were cleared at eviction) and could only contribute the much smaller boundary/suppressor-overlap class of duplicate.

**Reading:** the specific signature pan-west shows is more consistent with partial-tile re-fetch than with evicted-completed-tile re-fetch — which pushes the recoverable fraction toward the **low end**, provisionally. This is a directional, code-grounded argument, not a number, and not a proof of 0%: an evicted-completed re-fetch remains structurally possible, Question 2's own finding muddies the "never evicted" premise for some partial tiles too, and the aggregate `duplicatesDropped` counter as currently recorded cannot separate self-duplicates from boundary-suppressor duplicates. **It does not replace the instrumented pass the design seed already calls for** (ADR-028's own pan-west design-seed section) — it narrows what that pass should expect to find, and names a cheaper coarser check 1b could run first: whether the pan-west spike's duplicate ids resolve, per `idOwner`, to a small number of distinct re-delivering tiles each contributing thousands of duplicates (partial self-redelivery) versus many tiles each contributing a handful (boundary overlap from evicted-completed tiles) — obtainable without full per-tile trim-status logging, though not from what's on disk today either.

## Signposts for 1b scoping (pointers only, not a design)

- **Q1 —** scoped cancellation: `tileViewportStreamManager.ts:447-455` (`drainQueueIfRoom`), `:225-234` (`setOverBudget`), `:412-424` (`stop()`, today's only-and-total cancel), `:397-408` (`cancelTile`, exists but its one call site at `candidateArmSession.ts:580` never fires for a genuinely queued-but-unissued tile). Richer progress signal: `candidateArmSession.ts:294-299,307-316` (`hasOutstandingWork`/`syncScanLiveness`).
- **Q2 —** protected-set gap: `tileViewportStreamManager.ts:290-299,328-340` (where partial/skipped candidates fall out of the protected set), `candidateArmSession.ts:726,730` (`covering` construction / `applyTileViewportContext` call, the seam a fix would touch), `tileResidentSet.ts:426-482` (`planTileEviction`, where the exception would be formalized or closed).
- **Q3 —** instrumentation hooks: `tileIngest.ts:156` (`trimmed`), `tileResidentSet.ts:49` (`partial`), `tileIngest.ts:130-140` (`actuallyEvicted` reporting in `ingestTileBatch` — the natural place to log whether an evicted tile was partial at eviction time). Cheaper coarse check: `tileResidentSet.ts:96-107` (`idOwner`/`suppressorsOf`/`suppressedIdsByTile`).

## Scope and limits

No product code, tests, or docs were modified by this spike. No claim here is a measurement —
every quantitative-sounding statement above is either a citation of existing code structure or is
explicitly labelled as not determinable without a runtime trace. This spike does not decide finding
3's amendment-vs-fix question (ADR-028's own text: "the human's own call, not a worker's") — that
decision, and 1b's own scope, follow this write-up as a separate step.

## Correction to Q1's window attribution (2026-09-03, appended)

The attribution pass that followed this spike (`ATTRIBUTION-PASS.md`, this directory) checked
the recorded 150-second window against the trial's own persisted session log and corrects one
characterization above: Q1's code citations all stand (the drain refusal, the camera-change-only
resume, the kill-switch-only Cancel, and the principle-7 gap on scoped cancellation and honest
progress reporting), but **the recorded trial's 150s window was not held-queue idle — it was
overwhelmingly continuous slow drainage** (~65 tile-stream terminals inside the calm-wait window
at 3-way concurrency, ~4.4 MB/s sustained). The hold mechanism is real code; it was not the
dominant story of that particular window. The principle-7 finding is *sharpened*, not weakened:
the system worked continuously for 150 seconds while no operator-facing signal could distinguish
that from a stall.
