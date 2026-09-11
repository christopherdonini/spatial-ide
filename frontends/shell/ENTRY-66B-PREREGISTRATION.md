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

### Amendment 1 — 2026-09-10, made AFTER the piece's results were seen (the worker's build, 64a7a5a on `cut/geometric-protection`)

§2.5's reason clause — "every comparison is `false`" for a non-finite bbox — is wrong for `±Infinity`: a `[-Infinity, Infinity]` range makes every `<=` comparison **true**, so an unguarded predicate would protect everything, not nothing. **The rule is unchanged**: a non-finite bbox protects nothing (block-on-sight 7; test 6). It is enforced by an explicit finiteness check at the membership's construction (`tileGrid.ts:417`, the factory, as landed), not by the comparisons' own outcome. No test, prediction, gate or ceiling changes; test 6 asserts the rule and passed against the guarded code. Recorded here because the preregistration's own reasoning was inaccurate and a reader must not rely on it.

### Amendment 2 — 2026-09-10, made AFTER the piece's results were seen (the worker's build, 64a7a5a on `cut/geometric-protection`)

*(The architect gate's ruling on §7 test 9, appended verbatim by the custodian.)*

§7 test 9's clause "the step must be exercised on a genuinely **over-bound** step, not merely over-budget" is not met by this piece. `CAMERA_TRACE_STEPS` (`e2e/residencyTrace.mjs`) reaches no cover past `MAX_COVERING_TILES`: its only zoom-out steps are `factor: 0.5` returns toward a "Zoom to layer" fit. Adding an over-bound step is **out of this piece's scope** — that list is the residency campaign's instrument, and `RESULTS.md`'s per-step rows, the field-sequence identity gate and the outer watchdog `(CAMERA_TRACE_STEPS.length + 1) × per-step bound` are all indexed by it, so a twelfth step would make this trace non-comparable step-for-step with every recorded arm/fixture/tile-size cell, on top of the eviction-policy declaration ADR-028 Amendment 3 clause 5 already owes any cross-commit comparison. **What lands instead:** the harness recomputes `coverMembershipFor`, so the assertion no longer compares two identical windows to each other, and each corroborated row records `coverOverBound` and `coverCellCount` so a reader sees which regime the step was in; the `exercised: false` path is preserved verbatim. **No claim is made that the over-bound regime was exercised end-to-end.** Whether such a step is added at all, and whether the harness must be run for test 9, folds into §12 item 3 (DECISIONS-PENDING entry 76). Tests 1–8, every ceiling, constant and prediction are unaffected.

### Amendment 3 — 2026-09-10, made AFTER the piece's results were seen (the architect gate of the same day)

Two wording corrections, neither moving a rule. (a) §13's closing-note draft says "inside the cover's own half-open index ranges"; the ranges are half-open in **coordinate** space and **inclusive** in **index** space (§2.2; `tileGrid.ts:388-393` as landed). When the note is appended to ADR-028 on the human's word it reads "inside the cover's own index ranges — half-open in coordinate space, inclusive in index space". (b) Amendment 1 cites `tileGrid.ts:417`, the factory; the finiteness guard itself is at `:430-431`, and both are the reference.

### Amendment 4 — 2026-09-11, on the human's ruling of DECISIONS-PENDING entry 76; recorded BEFORE the code that implements it

The ruling, verbatim: *"76: (1) invert the latch in this piece, named in the Part K row; (2) add the drop-at-drain re-check with the same predicate; (3) unit/E2E + K7 discharge the merge gate, the harness assertion executed once as an unscored smoke if a window exists, else stated unexecuted; (4) 13b retires at the post-tag landing."* What follows is the custodian's expansion of each item into this file's terms; the architect gate verifies the expansion against the ruling.

**(1) §5 is superseded — the `fits`/over-budget latch inverts in this piece.** `anyPartialAmongCovering` no longer iterates the enumerated window; it iterates the resident tile keys and counts `membership.has(key) && isTilePartial(key)` over the round's own membership (the same `(frame, level, bbox)` triple as §2.6). Past the bound the latch therefore reads the true cover. **Operator-visible consequence, declared:** a view that latched `fits` true today because the window happened to be complete can latch false past the bound, so the over-budget / settled-partial sentence appears where it did not. The Part K row names it. Block-on-sight 4 is discharged by the ruling, not violated; the closing ADR-028 note closes path (ii) `:512` together with path (i) — §13's draft is superseded by the text at the end of this amendment. K7's status assertion is re-run unchanged and must stay PASS; if the inversion changes the sentence K7 asserts, that is a finding, not something to adjust.

**(2) §4.2–§4.3 are superseded in part — the drain re-checks with the same predicate.** `drainQueueIfRoom` tests each queued tile at mint time against the **latest** membership the manager built at its most recent `onCameraChange` (the same predicate, the same triple — a second predicate or a stale triple fails on sight, block-on-sight 8 below); a tile no longer in view is **dropped** (epoch bumped and routed exactly as the supersede path drops an out-of-view tile — `onTileSuperseded`/`clearTile`), never issued; a tile still in view is issued as §4.2 said. The manager therefore retains the latest membership as state. The declared behaviour becomes: *retained across the supersede prune, and issued only if still in view at drain; otherwise dropped at drain.* The alternative §4.3 listed is now the rule. §7 test 8 splits: **8a** a retained queued in-view tile is issued by a later drain when a slot frees and it is still in view; **8b** a retained queued tile whose cell left the view before the drain is dropped at drain — not issued, epoch bumped, the supersede-drop callbacks observed — and no `viewport_query` is minted for it. Bounds unchanged (`MAX_IN_FLIGHT_TILE_STREAMS`, `MAX_QUEUED_TILES`).

**(3) §7 test 9 and §12 item 3 are resolved.** The unit tests (§7 1–8, as amended), the E2E regression suite and K7 discharge the merge gate. The residency harness assertion is executed **once as an unscored smoke** — no campaign row, no `RESULTS.md` entry, no number recorded as a result, no docs/08 claim, the run's only record being "executed, assertion outcome: <pass|fail|not exercised>" — if a window exists (one app at a time; a fresh worktree's built binary), else the record states **"unexecuted"** in those words. `CAMERA_TRACE_STEPS` is not changed (Amendment 2).

**(4) §12 item 4 is resolved — KNOWN-LIMITATIONS 13b retires at this landing.** The 13b line is removed on this branch in this piece; v0.1.0's tagged text is untouched because the branch merges after the tag. The `fits` deviation the line did not describe is closed by (1), so nothing of 13b survives.

**Block-on-sight 8 (added):** the drain re-check uses `coverMembershipFor` on the manager's latest `(frame, level, bbox)` triple — a second predicate, a closed-bbox test, or a triple other than the latest round's fails on sight.

**§11 as amended.** "Unchanged" loses "the `fits` latch"; "Changed and declared" gains: the `fits`/over-budget latch reads the true cover past the bound (operator-visible); queued tiles are re-checked at drain and dropped if out of view. Constants, ceilings, enumeration, `coveringTruncated`/`truncatedCount`/`lastCoveringTruncated`, `isFillComplete` and "Showing all N" remain unchanged.

**§13 as it will land (supersedes §13's draft; custodian-drafted on the ruling, verified at the architect gate; appended to ADR-028 only on the human's word):**

> ## Appended note, [date] (on the human's word — entry 66 (b) landed): the 2026-09-09 exception is closed on both paths
>
> **What landed.** The geometric predicate preregistered at `RELEASE-0.1.md` Amendment 12 and expanded in `frontends/shell/ENTRY-66B-PREREGISTRATION.md` (with its §14 Amendments 1–4): a resident, tracked or queued tile is protected iff its (row, col) lies inside the cover's own index ranges — half-open in coordinate space, inclusive in index space — computed from the span, allocating nothing. Enumeration, `MAX_COVERING_TILES`, `COVER_WINDOW_CELLS_PER_AXIS` and the completeness bookkeeping are unchanged.
>
> **Path (i) of the 2026-09-09 note (`:510`) is CLOSED.** Amendment 3's rule — *"A tile intersecting the viewport is protected whether it is complete or partial, tracked this round or a prior one, or never requested at all"* (`:461-462`) — again holds at every zoom, for eviction protection and for the supersede keep-set alike.
>
> **Path (ii) of that note (`:512`) is CLOSED on the human's ruling (DECISIONS-PENDING entry 76).** The `fits`/over-budget latch now reads the true cover past the bound: it counts partial tiles among the resident set by membership, not by the enumerated window. Operator-visible consequence, declared: a view that read as fitting only because its window happened to be complete now reads over-budget / settled-partial past the bound.
>
> **Named consequence of the keep-set half, as ruled.** A queued in-view tile outside the window survives the supersede prune and is re-checked at drain against the latest membership: still in view, it is issued as a `viewport_query` for a cell that round never enumerated, within `MAX_IN_FLIGHT_TILE_STREAMS` and `MAX_QUEUED_TILES`; out of view by then, it is dropped at drain and never issued. ADR-006 class 1 throughout; no wire change; tile keys still never cross a module or protocol boundary (`:478-479`). No performance claim is made or implied.
>
> **KNOWN-LIMITATIONS 13b** retires with this landing. **Reopen.** The 2026-09-09 note's reopen sentence (`:518`) is discharged for both paths; a tile drawn and then vanishing while still on screen, or a `fits` reading that disagrees with the true cover, reopens this as a defect on the human's word.

### Amendment 5 — 2026-09-11, made AFTER the second batch's results were seen (the worker's build on `cut/geometric-protection`)

*(The architect gate's wording for (a)–(d), appended verbatim by the custodian; (e) is the custodian's, on that gate's note.)*

**(a) The drop-at-drain reports; the prune's queued drop stays silent — declared, not an oversight.** Amendment 4 item (2)'s "routed exactly as the supersede path drops an out-of-view tile — `onTileSuperseded`/`clearTile`" is the rule and landed as written (`tileViewportStreamManager.ts:723-731`). The prune's own QUEUED branch (`:438-443`) still drops silently, unchanged by this piece, and the two differ deliberately: a prune drop is reported to the caller by the same call's `TilePlanOutcome`, while a drain drop occurs inside a nested, return-value-less `drainQueueIfRoom`, where silence would be an unreported refusal (docs/01 principle 8). The report costs no bookkeeping: `countTileStreamEndedOnce` is issue-guarded (`candidateArmSession.ts:537-538`) and a queued tile is never resident, so its `clearTile` clears nothing. Aligning the prune's branch either way is out of this piece's scope.

**(b) The unscored smoke, as recorded.** Residency harness, run once as the unscored smoke with `--arm candidate`: **executed; assertion outcome: not exercised** — the trial was invalidated at step 0 (`fit`) by the settle watchdog ("console quiescence not reached"), so `zoom-out-1`, the only step the assertion is gated on, was never reached. No campaign row, no `RESULTS.md` entry, no docs/08 claim, and no number recorded as a result; the watchdog's own figures are its invalidation message, not a measurement. This is Amendment 4 item (3)'s "not exercised" outcome, with its reason; it is not "unexecuted", which that item reserves for no window existing.

**(c) Why `--arm candidate`.** The harness assertion is gated `step.id === "zoom-out-1" && arm === "candidate"` (`e2e/residency-harness.mjs:1709`) and the CLI arm defaults to `"baseline"` (`:397`), so a plain run cannot execute it by construction. "Executed once" therefore means the candidate arm; the invocation is recorded with the run.

**(d) 13b.** `KNOWN-LIMITATIONS.md` exists on no ref: it is release item 4, written for v0.1.0 only from Part M (RELEASE-0.1 Amendment 13), so there is no line to remove on this branch. Amendment 4 item (4) is unchanged in substance and executes as a docs step at the post-tag merge — the 13b line is removed by the commit that lands this branch, and the PR body carries that removal as a required step. v0.1.0's tagged text is untouched either way.

**(e) One clause for the closing note (custodian, on the gate's note 5b).** Where Amendment 4's §13-as-it-will-land says the latch "counts partial tiles among the resident set by membership", the appended ADR-028 note reads "…by membership, wherever a round's membership exists — the candidate arm always supplies one on a planned round; the no-membership fallback is today's window read, declared in code". Also recorded: the double epoch bump when the prune re-visits a key the nested drain already dropped is inert (declared at `tileViewportStreamManager.ts:714-715`); `latestMembership` is not reset by `clearAll`/`stop` and cannot go stale for any queued tile (the queue refills only inside `onCameraChange`, which reassigns it first) — one clause in the field's doc comment is owed at the reviewer gate, no code change.
