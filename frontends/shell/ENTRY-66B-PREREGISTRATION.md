# Preregistration — entry 66 (b): restore ADR-028's geometric protection at every zoom, without enumeration

*Drafted 2026-09-10 by the architect agent on the custodian's brief; committed by the custodian on `cut/geometric-protection` before any code, under the human's authorization of 2026-09-10 ("Build the two first-post-tag pieces on branches now, through their full gates: entry 66(b) geometric protection (its own preregistration, half-open index ranges) … Merges held until after the tag; their operator rows queue into the next sitting bundle per rule 11."). The drafter's notes are folded into the text (§2.4, §4.4); its not-decided items are DECISIONS-PENDING entry 76.*

**Committed before any code exists.** Same discipline as `frontends/shell/RESIDENCY-PREREGISTRATION.md` and the `kernel/*-PREREGISTRATION.md` set. Every definition, ceiling, test, gate, invalidator and out-of-scope line below is fixed by this commit; an amendment made after any result has been seen **must say so in its first line**. **Append-only once committed** — amendments are dated additions, never edits.

**Authority.** `RELEASE-0.1.md` Amendment 12's "Preregistration — entry 66 (b)" paragraph is the outline the human accepted; this file is that paragraph expanded into the shape `RESIDENCY-PREREGISTRATION.md` set. Inputs: `RELEASE-DRAFTS-0.1.0/post-tag/entry-66b-geometric-protection-brief.draft.md` (the piece brief) and `RELEASE-DRAFTS-0.1.0/post-tag/architect-consult-lod-47-66b-ordering.md` §1A / §2 conditions 1–7. The human authorized building the piece on a branch through its full gates; **the merge is held until after the v0.1.0 tag.**

## §0. Disclosure

**No pilot, no probe, no measurement of any kind informs this file.** Nothing below rests on a run. Every `file:line` is a read of `main` at the time of drafting; where a cite comes from the consult rather than from this file's own reading it is labelled so. The consult verified the brief's cites against `main` 279b43f (its §1A: "Every `file:line` I checked holds"); this file re-read `tileGrid.ts`, `tileGridConstants.ts`, `tileResidentSet.ts`, `tileIngest.ts`, `WorkingCanvas.tsx`, `tileViewportStreamManager.ts`, `candidateArmSession.ts:1386-1430`, `e2e/residency-harness.mjs:845-980`, `e2e/regression.mjs:1200-1260`. **Not read here:** `candidateArmSession.ts:931` (`clearTile`) and `:1348` (the plan bbox) — consult-verified, cited as such; the test files' interiors beyond the line ranges the brief names.

## §1. What this document may and may not claim

- **No performance claim, anywhere** — not in code, comment, test, record or PR text (ADR-018 discipline; docs/08: no numbers, no claim). The piece is a correctness restoration.
- **No `docs/08` row** is added, amended or quoted-against.
- **No number is introduced.** The only figures that appear are declared constants read from the code: `MAX_COVERING_TILES` = 65,536 (`tileGridConstants.ts:139`), `COVER_WINDOW_CELLS_PER_AXIS` = 256 (`:147`), `MAX_IN_FLIGHT_TILE_STREAMS` = 3 (`:40`), `MAX_QUEUED_TILES` = 512 (`:54`), `MAX_RESIDENT_VERTICES` = 2,000,000 (`limits.ts:45`). **None of them changes.**
- **ADR-011 is not cited** as authority or as settled by this piece.
- The criterion is ADR-028 **Amendment 3**'s rule, verbatim: *"A tile intersecting the viewport is protected whether it is complete or partial, tracked this round or a prior one, or never requested at all"* (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:461-462`).

## §2. The predicate, exactly

**2.1 Shape.** `tileGrid.ts` gains one export: a factory `coverMembershipFor(frame, level, bbox): { has(tileKey: string): boolean }`, built on the existing private `coveringIndexRanges` (`tileGrid.ts:172-183`) — the same arithmetic `coveringCellCount` (`:197-200`) and `tileCoverForBbox` (`:310-311`) already run, allocating only the two index pairs.

**2.2 Half-open in coordinate space, inclusive in index space.** Cell *i* owns `[origin + i·cell, origin + (i+1)·cell)`. `coveringIndexRange` (`:158-167`) returns `flooredEnd - 1` when `(maxCoord − origin)/cellSize` is an integer; a zero-width input resolves to the single cell containing `minCoord` (`:160-162`). The ranges it returns are therefore **inclusive** in index space, so `has` is `cols[0] <= col && col <= cols[1] && rows[0] <= row && row <= rows[1]` — two `<=`, matching the loop bounds `materialiseCells` walks (`:249-257`).

**2.3 Why boundary-exact `xmax` matters.** A closed-bbox intersection (`tileBbox(key)` overlapping the viewport with `<=`/`>=`) would admit the column whose **min** edge equals `xmax` — one extra ring on any boundary-exact viewport. That column is not in `tileCoverForBbox`'s keys, so it would be protected but never planned, never requested, and never counted by the completeness bookkeeping: a tile the eviction rule keeps and no round ever refreshes. Predicate/cover agreement at or under the bound is only true of the half-open form. This is a correctness condition, not a stylistic one (block-on-sight 1).

**2.4 Totality, and the parse.** `has` must be **total over any string and must never throw** (block-on-sight 7). It may not reuse either existing parser: `tileIngest.ts:42-50` and `WorkingCanvas.tsx:336-344` are two separate private `parseTileKey`s and **both throw** on a non-`"row:col"` key. The predicate carries its own total parse in `tileGrid.ts`, returning `false` for any key that is not two finite numeric colon-separated parts — `INITIAL_TILE_KEY` reaches it through `planTileEviction`'s filter (`tileResidentSet.ts:469`) and through `evictTile`'s guard (`:335`). The duplication is declared, not hidden: `tileGrid.ts:112-117`'s "there is no `tileKeyFromString`; nothing needs to parse this back" gains a one-clause qualification in the same commit.

**2.5 Non-finite and out-of-range.** A non-finite bbox yields non-finite ranges; every comparison is `false`, so nothing is protected — matching today's empty-keys outcome (`tileGrid.ts:338-342`). For a finite bbox whose indices exceed the safe-integer range (`isEnumerableRange`, `:241-243`) the predicate answers `true` where the cover keeps nothing: a **declared superset**. Agreement with `tileCoverForBbox` is claimed **only for covers at or under `MAX_COVERING_TILES`** (test 3).

**2.6 Level/frame agreement — declared invariant** (consult §1A finding 2). Tile keys are level-relative. The membership must be built from the **same `(frame, level, bbox)` triple the round's own plan used**. Today `this.level` is set once at construction (`tileViewportStreamManager.ts:255-256`) and no setter exists in `frontends/shell/src`; `gridFrame`/`activeLevel` are public getters (`:259-265`). That invariant is unstated today and becomes load-bearing here: it is declared in this file, stated in the factory's doc comment, and is block-on-sight 2.

## §3. The `{ has(key) }` widening, and every consumer it threads to

A named type `TileKeyMembership = { has(key: string): boolean }`. `ReadonlySet<string>` satisfies it structurally, so every existing call site and every existing test that passes a `Set` compiles and passes unchanged; the empty defaults (`tileResidentSet.ts:417`, and `EMPTY_PROTECTED_TILE_KEYS` at `:332`) stay.

Consumers, each reading `.has` and nothing else (consult §1A verified `:332`, `:438`, `:469`):

1. `planTileEviction.viewportTileKeys` (`tileResidentSet.ts:438`) — used at `:469` and `:474`.
2. `evictTile.protectedTileKeys` (`:332`) — used at `:335` and at the cascade divert `:372`.
3. `ingestTileBatch.viewportTileKeys` (`tileIngest.ts:119`) — forwarded only (`:135-155`; the `evictTile` call at `:153`).
4. `WorkingCanvasHandle.applyTileViewportContext` (`WorkingCanvas.tsx:257-261`) gains a fourth, optional parameter: the membership object.
5. `protectionSetFor` (`:315-317`) widens from `Set<string>` to the union shape: with a membership and non-empty `extra`, `{ has: k => extra.has(k) || membership.has(k) }`; with a membership and no `extra`, the membership itself; **with no membership supplied, today's `new Set(covering)` exactly** — so every non-candidate path and every existing test is unchanged.
6. `currentViewportTileKeysRef` (`WorkingCanvas.tsx:544-558`) holds the widened shape; it flows into `planTileEviction` (`:1213`), `evictTile` (`:1231-1232`) and `pushTileBatch`'s ingest.
7. `coveringTileKeysRef` (`:559-565`) is **untouched** — it is the covering-only consumer, and it is iterated, not tested (see §5).

**Who builds it.** `candidateArmSession.handleViewportChange` holds the plan's own `bbox` (consult-verified `:1348`) and reads `manager.gridFrame`/`manager.activeLevel`; it passes the membership at the `applyTileViewportContext` call (`candidateArmSession.ts:1418`). The manager builds its own from the same three inputs inside `onCameraChange`. Both call one exported definition. Carrying it on `TilePlanOutcome` is **rejected**: a function member makes a data type non-data and breaks whole-outcome equality assertions in the manager's tests.

## §4. The supersede keep-set — and the queue drain, named and decided

**4.1 The keep-set change.** In `onCameraChange`'s loop over tracked tiles (`tileViewportStreamManager.ts:376-398`) the keep-test at `:377` becomes `coveringKeys.has(tileKey) || membership.has(tileKey)`. A queued (`:378-382`), issuing (`:384-393`) or in-flight (`:394-397`) tile that is geometrically in view is no longer dropped, epoch-bumped, cancelled, or routed to `clearTile`. `coveringKeys` — the materialised set — stays exactly as it is for the new-candidate loop (`:409-418`), which must only issue tiles this round actually enumerated.

**4.2 The drain, declared as behaviour** (consult §1A finding 1; block-on-sight 3). `drainQueueIfRoom` (`:639-647`) mints from `this.queue` with **no cover re-check**, and `mintAndStart` builds the tile bbox from `this.level` at mint time (`:649-653`). Therefore, past the bound, **a retained queued in-view tile will later be ISSUED as a fresh `viewport_query`** (`:662`) for a cell this round never enumerated. This is stated as the piece's own behaviour, in the code comment at the keep-test, in the ADR-028 closing note (§13), and it is tested (test 8).

**Its bound:** the same declared ceilings every other tile request has — at most `MAX_IN_FLIGHT_TILE_STREAMS` (3) concurrent, at most `MAX_QUEUED_TILES` (512) waiting (`:427-429`, `:641`), and the drain is already gated by the over-budget flag (`:640`). No new state, no new status, no new refusal, no wire or protocol change (an ordinary bbox query; tile keys never cross a boundary — ADR-028:478-479).

**4.3 Why this reading and not a cover re-check at drain.** The constitution forces the declared-behaviour reading:

- **Principle 8 (no black boxes, docs/01:14)** is discharged by naming and testing the issuance, not by suppressing it.
- **Principle 7 / "Never block the canvas" (docs/01:13, :20)** is untouched either way: enumeration is unchanged, so the hang entry 60 closed stays closed, and issuance stays inside the two declared ceilings.
- A re-check at drain against the **membership** would be a no-op (the same predicate already kept the tile). A re-check against the **enumerated window** would leave the tile queued forever — never issued, never dropped, holding declared queue room: an absorbing state discovered rather than declared, which is exactly the shape ADR-028 Consequence 1 (`:467-473`) requires be declared in advance.
- Issuing a tile the viewport genuinely covers is what the sub-bound regime already does for every covered tile; the alternative would make the two regimes behave differently at the same geometry.

**The alternative, listed for the human, not taken here:** add an explicit drop-at-drain path (a queued tile that is no longer in view at mint time is dropped with its epoch bumped, rather than issued). That is a new refusal path with its own disclosure and its own test; it is **not** in this piece unless the human rules it in.

**4.4 The brief's non-goal sentence, corrected.** `entry-66b-geometric-protection-brief.draft.md:64`'s "no change to what is enumerated, issued, or queued" is not accurate. **Enumeration is unchanged. Issuance and queue occupancy change** exactly as §4.2 declares. This file's §11 carries the corrected list.

## §5. Out of scope, explicitly: the `fits` / over-budget latch

`anyPartialAmongCovering` (`WorkingCanvas.tsx:1245-1251`) **iterates** `coveringTileKeysRef.current`; it cannot consume a predicate. Past the bound it therefore keeps reading the window — ADR-028's second declared deviation (`:512`). A mechanical inversion exists (iterate `residentTileKeys()`, count `membership.has(k) && isTilePartial(k)`), and it is equivalent today, but it **changes an operator-visible status**: views that latch `fits` true today would latch false, so the over-budget/settled-partial sentence would appear where it does not now. **The human has not ruled the inversion.** It is out of scope for this piece, and the closing note says so in words (§13, block-on-sight 4 and 5).

## §6. Declared ceilings and constants — none changes

`MAX_COVERING_TILES` (65,536), `COVER_WINDOW_CELLS_PER_AXIS` (256), `MAX_IN_FLIGHT_TILE_STREAMS` (3), `MAX_QUEUED_TILES` (512), `MAX_RESIDENT_VERTICES` (2,000,000). The window, the enumeration bound, and the pre-check that applies them (`tileGrid.ts:323-326`) are untouched. `coveringTruncated`/`truncatedCount` (`tileViewportStreamManager.ts:425-426`), `lastCoveringTruncated` (`candidateArmSession.ts:1402`) and `isFillComplete` are untouched — no "Showing all N" claim changes (ADR-028:514).

## §7. Pre-committed tests

The consult's five, made concrete, plus four from the code reading. Each: file, construction, assertion.

1. **`tileIngest.test.ts`** — grid frame established; two resident tiles, one inside the window, one far outside it but inside a viewport bbox whose cover exceeds the bound; a batch forcing eviction. **Assert** the far tile is absent from `evictedTileKeys` and still resident.
2. **`tileIngest.test.ts`** — same fixture, a resident tile genuinely outside the viewport bbox. **Assert** it *is* evicted (the piece must not protect everything).
3. **`tileGrid.test.ts`** — predicate/cover agreement over a sweep of bboxes at or under the bound, including one whose `xmax` and `ymax` land exactly on cell boundaries and one degenerate point. **Assert** `{tilesCoveringBbox(...)}` as a key set equals `{keys where has(key)}` over the enclosing index rectangle; the boundary case additionally **asserts the `xmax` column is in neither**.
4. **`tileResidentSet.test.ts`** — a cover of more than `MAX_COVERING_TILES` cells: `tileCoverForBbox` reports `truncated` and omits key K, yet `has(K)` is true and `planTileEviction`/`evictTile` refuse to evict K.
5. **`tileViewportStreamManager.test.ts`** — an in-flight tile whose cell the window excludes while the bbox still covers it; a camera change whose cover exceeds the bound. **Assert** cancel is not called for its handle and `onTileSuperseded` is not called. The existing genuinely-out-of-view supersede test must keep passing unchanged.
6. **`tileGrid.test.ts`** — totality: `has("initial-untiled-look")`, `has("garbage")`, `has("")`, `has("1:2:3")` all return `false` and **do not throw**; a non-finite bbox protects nothing.
7. **`WorkingCanvas.test.ts`** — `protectionSetFor` widened, four cases: membership alone; membership ∪ `extra`; no membership (today's `Set` behaviour, unchanged); and the covering-only consumer still never sees `extra`.
8. **`tileViewportStreamManager.test.ts`** — **the drain declaration (§4.2)**: a retained queued in-view tile outside the window is not re-issued by the same plan (it stays tracked; `issued`/`queued` unchanged), **and is issued by a later `drainQueueIfRoom` when a slot frees** — the behaviour asserted, not merely allowed. An out-of-view tracked tile is still dropped.
9. **E2E, `e2e/residency-harness.mjs`** — `:931`/`:947` recompute the membership instead of `tilesCoveringBbox`, so the assertion at `:955` stops comparing two windows to each other; the step must be exercised on a genuinely **over-bound** step, not merely over-budget; the `exercised: false` honesty path (`:964-975`) is preserved verbatim; the narrowing clause in the doc comment (`:864-870`) is removed.

**`e2e/regression.mjs`'s K7 is re-run unchanged and must stay PASS**, including the settled-partial status assertion (`:1248`) — completeness is untouched (§6).

**Whether the residency harness must actually be run** for test 9, or whether tests 1–8 plus K7 discharge the gates with the harness pass folded into the next campaign, is **not decided here** (§12).

## §8. Walkthrough row

One new Part K row, **felt, no durations, no numbers** — committed with a blank result log and **queued for the next accumulated sitting bundle** (`AI_DEVELOPMENT.md`, rule 11; the piece never demands same-day operator time):

> *"From `polygons-100k.parquet` at a 'Zoom to layer' fit, wheel out roughly eight notches, wait for the status to settle, then pan slowly in one direction. Expected: tiles already drawn stay drawn while they remain on screen; the status still reports the view as partial. A tile that vanishes while still visible is the finding this row exists to catch."*

## §9. Block-on-sight conditions (the consult's 1–7, verbatim; cited in every review of work under this file)

> 1. No membership predicate that does not answer identically to `tileCoverForBbox`'s key set for every bbox at or under `MAX_COVERING_TILES`, boundary-exact `xmax`/`ymax` and degenerate-point cases included; a closed-bbox intersection fails on sight.
> 2. No membership object built from a `(frame, level, bbox)` triple other than the one the round's own plan used; a predicate at one level tested against keys minted at another fails on sight.
> 3. No supersede-path change without a named, tested account of the **queue drain**: a retained queued tile is issued later by `drainQueueIfRoom` with no cover re-check, so "retained" without "and therefore issued" is an incomplete disclosure and fails on sight.
> 4. No inversion of `anyPartialAmongCovering` (the `fits` latch) inside this piece without the human's word — it changes an operator-visible status (`WorkingCanvas.tsx:1245-1252`); and no silent *retention* of the window read either: whichever way it goes, the closing note states it.
> 5. No ADR-028 closing note that says the declared exception is closed while the second deviation (`ADR-028:512`) stands; the note names which of the two paths (`:510`, `:512`) is closed, or it fails on sight.
> 6. No change to `MAX_COVERING_TILES`, `COVER_WINDOW_CELLS_PER_AXIS`, what is enumerated, `coveringTruncated`/`lastCoveringTruncated`, or `isFillComplete`; a diff touching completeness bookkeeping fails on sight.
> 7. No predicate that throws: `has` is total over any string, and a non-finite bbox protects nothing.

## §10. Gates

- **Architect gate**, criterion = **ADR-028 Amendment 3's rule** (`:461-462`) holding at every zoom, plus §9's seven conditions, ADR-010 rule 6 for anything declared, docs/01 principle 7 unchanged by construction.
- **Reviewer gate** on the full diff.
- `npm run verify` in `frontends/shell` green; K7 PASS.
- **Merge held until after the v0.1.0 tag.** The branch may be built and gated now; it does not merge before the tag.

## §11. Declared — what does not change; invalidators; falsification

**Unchanged:** the bound, the window, what is **enumerated**, `coveringTruncated`/`truncatedCount`/`lastCoveringTruncated`, `isFillComplete`, "Showing all N", every constant in §6, the declared partial-view status and its wording, `coveringTileKeysRef`'s covering-only channel, `minZoom` (no clamp). **No new dependency. No new operator-visible state. No performance claim.** ADR-006 class 1 (ephemeral/derived) throughout; no wire, SKP or MCP surface touched.

**Changed and declared:** protection membership (predicate, not array); the supersede keep-set; and, as a consequence, **which tiles are issued and hold queue room past the bound** (§4.2, §4.4).

**Invalidators:** any use of a `(frame, level, bbox)` triple other than the round's own (a cell so built is not evidence); a predicate reached through a throwing parser; a diff touching any §6 constant or any completeness field. Any of these voids the work it touches and the piece re-enters review.

**Falsification:** any of tests 1–9 failing; predicate/cover disagreement on any bbox at or under the bound; a K7 regression; `npm run verify` non-zero; or, in the walkthrough row, a tile drawn and then vanishing while still on screen at the window regime.

## §12. What is NOT decided by this file

1. **The `fits`/over-budget latch inversion** (`ADR-028:512`) — the human's, not this piece's (§5).
2. **A cover re-check at the queue drain** — §4.3 routes this to declared behaviour; the alternative drop-at-drain path is listed there and is the human's to rule if wanted.
3. **Whether the residency harness must be run** for test 9's changed assertion, or whether tests 1–8 plus K7 discharge the gates (§7).
4. **Whether the KNOWN-LIMITATIONS line retires at this landing.** Its text names only the vanishing behaviour, which path `:510`'s closure discharges; the `fits` deviation it does not describe still stands. The human's word.
5. **Post-tag ordering** among this piece, entry 47 and ADR-032/LOD.

## §13. The ADR-028 closing note — exact draft text, for the human's word

Landing only on the human's word, as a **further appended note** (ADR-028 is accepted and immutable; appended, never edited):

> ## Appended note, [date] (on the human's word — entry 66 (b) landed): the 2026-09-09 exception is closed on path (i); path (ii) stands
>
> **What landed.** The geometric predicate preregistered at `RELEASE-0.1.md` Amendment 12 and expanded in `frontends/shell/ENTRY-66B-PREREGISTRATION.md`: a resident or tracked tile is protected iff its (row, col) lies inside the cover's own half-open index ranges, computed from the span, allocating nothing. Enumeration, `MAX_COVERING_TILES`, `COVER_WINDOW_CELLS_PER_AXIS` and the completeness bookkeeping are unchanged.
>
> **Path (i) of the 2026-09-09 note (`:510`) is CLOSED.** Amendment 3's rule — *"A tile intersecting the viewport is protected whether it is complete or partial, tracked this round or a prior one, or never requested at all"* (`:461-462`) — again holds at every zoom, for eviction protection and for the supersede keep-set alike. A resident in-view tile outside the window is no longer evictable; an in-flight in-view tile outside the window is no longer superseded and blanked.
>
> **Path (ii) of that note (`:512`) STANDS, declared.** The `fits`/over-budget latch still reads the enumerated window, because its consumer iterates the covering array rather than testing membership; past the bound, "fits" and over-budget are still decided over the window, not the true cover. Inverting it changes an operator-visible status and was left to the human, deliberately out of the landed piece's scope. **This note therefore closes one of that note's two declared deviations, not "the exception".**
>
> **Named consequence of the keep-set half.** A queued in-view tile outside the window now survives the supersede prune and is issued later by the queue drain, with no cover re-check at mint — a `viewport_query` for a cell that round never enumerated. Declared here as behaviour, bounded by `MAX_IN_FLIGHT_TILE_STREAMS` and `MAX_QUEUED_TILES` exactly as every other tile request is. ADR-006 class 1 throughout; no wire change; tile keys still never cross a module or protocol boundary (`:478-479`). No performance claim is made or implied.
>
> **Reopen.** The 2026-09-09 note's reopen sentence (`:518`) is discharged for path (i) — that landing is what it named. It survives unchanged for path (ii): evidence that the window-read `fits` latch misreports a view past the bound reopens that deviation as a defect, and its repair is a separate piece, on the human's word.

## §14. Amendments

*(none yet)*
