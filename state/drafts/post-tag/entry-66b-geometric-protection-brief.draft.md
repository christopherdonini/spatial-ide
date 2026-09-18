> **Status: draft — the entry-66 (b) geometric-protection brief (2026-09-09); superseded by `frontends/shell/ENTRY-66B-PREREGISTRATION.md`, its pre-committed form.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# DRAFT piece brief — entry 66 (b): restore ADR-028's geometric protection at every zoom, without enumeration

*Drafted 2026-09-09 during the away window by the Plan agent on the custodian's brief, read-only against `main` 998be05. For the human's sight after the v0.1.0 tag; expands `RELEASE-0.1.md` Amendment 12's preregistration paragraph. No code written. The recommendation line near the end is the drafting agent's, not the custodian's and not a ruling. The custodian changed nothing but this header and HTML entities.*

*For the human's sight after the v0.1.0 tag. Expands `RELEASE-0.1.md:1126-1130` ("Preregistration — entry 66 (b)") to implementation-brief detail, in Amendment 10/12's preregistration shape. No code written; nothing moves until the word. Cites are repo-relative and were read on main `998be05`.*

## Scope

Close the exception ADR-028's appended note of 2026-09-09 declares (`docs/adr/ADR-028-…md:506-518`, on entry 66 = (d)): past `MAX_COVERING_TILES` (65,536, `tileGridConstants.ts:139`) the windowed cover is both the eviction-protected set and the supersede keep-set, so a resident in-view tile outside the 256×256 window is evictable and an in-flight one is blanked. The piece replaces *set membership in a materialised array* with *membership in the cover's index ranges*, computed from the span, allocating nothing. Protection and the supersede keep-set become correct at every zoom; the bound, the window, the enumeration, and the completeness claim are untouched.

## The design

1. **The predicate, exactly.** `tileGrid.ts` gains one export — a factory `coverMembershipFor(frame, level, bbox): { has(tileKey: string): boolean }` — built on the *existing, private* `coveringIndexRanges` (`tileGrid.ts:172-183`), which is the same arithmetic `coveringCellCount` (`:197-200`) and `tileCoverForBbox` (`:311`) already run. `has` parses `"row:col"` and answers `cols[0] <= col <= cols[1] && rows[0] <= row <= rows[1]`.
2. **Half-open on which side, and why boundary-exact `xmax` matters.** The half-openness lives in *coordinate* space, on the MAX side: cell *i* owns `[origin + i·cell, origin + (i+1)·cell)`, so `coveringIndexRange` (`:158-167`) returns `flooredEnd - 1` when `(maxCoord - origin)/cellSize` is an integer. In *index* space the resulting range is inclusive, hence the two `<=`. A closed-bbox intersection (`tileBbox(key)` overlapping the viewport with `<=`/`>=`) would include the column whose min edge equals `xmax` — one extra ring on any boundary-exact viewport — and would therefore *disagree with the cover the planner materialises* at or under the bound: a tile protected but never planned, never counted by `isFillComplete`, never re-fetched. The rule "the identical predicate at every zoom" is only true of the half-open form. The deliberately-misaligned-grid fixture case (`tileGrid.test.ts:143`) is the same property from the cover's side.
3. **Totality.** `has` returns `false` — never throws — for any key that is not two finite numeric colon-separated parts (`INITIAL_TILE_KEY`, `"initial-untiled-look"`, reaches it through `planTileEviction`'s filter at `tileResidentSet.ts:469`), and `false` when a range is non-finite (a non-finite bbox: `NaN` comparisons are `false`, matching today's empty-keys outcome at `tileGrid.ts:342`). For a finite bbox whose indices exceed the safe-integer range the predicate answers `true` where the cover keeps nothing — a deliberate, declared superset: agreement with `tileCoverForBbox` is claimed only for covers at or under the bound (test 3).
4. **The `{ has(key) }` widening.** `planTileEviction`'s `viewportTileKeys` (`tileResidentSet.ts:438`), `evictTile`'s `protectedTileKeys` (`:332`), and `ingestTileBatch`'s `viewportTileKeys` (`tileIngest.ts:119`) all read `.has` and nothing else. Their types widen from `ReadonlySet<string>` to a named `TileKeyMembership = { has(key: string): boolean }`. `ReadonlySet<string>` satisfies it structurally, so every existing call site and every existing test that passes a `Set` compiles and passes unchanged; the empty defaults (`tileResidentSet.ts:83`, `:417`) stay as they are.
5. **Threading to the eviction consumers.** `WorkingCanvasHandle.applyTileViewportContext` (`WorkingCanvas.tsx:257-261`) gains a fourth, optional parameter: the membership object. `protectionSetFor` (`:315-317`) widens from `Set` to the union shape — `extra` non-empty ⇒ `{ has: k => extra.has(k) || covering.has(k) }`, else the covering membership itself; with no membership supplied it falls back to today's `new Set(covering)`, so `App.test.ts:360,464` and every non-candidate path are unchanged. `currentViewportTileKeysRef` (`:547-558`) holds the widened shape and flows unchanged into `planTileEviction` (`:1213`), `evictTile` (`:1232`) and `pushTileBatch`'s ingest (`:1079`).
6. **Who builds it.** `candidateArmSession.handleViewportChange` already holds the plan's own `bbox` (`:1348`) and can read `manager.gridFrame`/`manager.activeLevel` (public getters, `tileViewportStreamManager.ts:259-265`); it calls the factory and passes the result at `:1418`. The manager builds its own from the same three inputs inside `onCameraChange`. Both call one exported definition. (The alternative — carrying it on `TilePlanOutcome` — is rejected: a function member breaks the whole-outcome `toEqual` at `tileViewportStreamManager.test.ts:433` and makes a data type non-data.)
7. **The supersede keep-set.** In `onCameraChange`'s loop over tracked tiles (`tileViewportStreamManager.ts:376-398`) the keep-test `coveringKeys.has(tileKey)` becomes `coveringKeys.has(tileKey) || membership.has(tileKey)`. A queued, issuing or in-flight tile that is geometrically in view is no longer dropped, epoch-bumped, cancelled, or routed to `candidateArmSession.ts:931`'s `clearTile`. `coveringKeys` (the materialised set) stays for what it is still exactly right for: the new-candidate loop (`:409-418`), which must only issue tiles this round actually enumerated.
8. **What follows from (7), named.** Past the bound, in-flight/queued in-view tiles outside the window are retained, so they continue to occupy `MAX_IN_FLIGHT_TILE_STREAMS` slots and `MAX_QUEUED_TILES` room until they terminate. Both remain bounded by their declared constants; no new state, no new status. No claim about speed either way.
9. **The `fits`/over-budget latch — explicitly NOT in scope.** `anyPartialAmongCovering` (`WorkingCanvas.tsx:1245-1251`) *iterates* `coveringTileKeysRef`, so it cannot consume a predicate; past the bound it therefore keeps reading the window, which is ADR-028's note's declared "second deviation" (`:512`). A mechanical inversion exists — iterate `tileSet.residentTileKeys()` and count a tile when `membership.has(k) && isTilePartial(k)`, which is equivalent today (`isTilePartial` is `false` for non-resident keys) and correct past the bound — but it *changes an operator-visible status*: views that latch `fits` true today would latch false, i.e. the over-budget/settled-partial sentence appears where it does not now. That is a product-behaviour change and the human's, not the piece's. Default: out of scope, and the closing note therefore closes one deviation of the two. **Open question 1.**

## File-by-file

- `frontends/shell/src/canvas/tileGrid.ts` — export the factory beside `coveringCellCount` (`:197`); `coveringIndexRanges` (`:172-183`) becomes its shared basis; the module's "there is no `tileKeyFromString`" claim (`:112-114`) gains a one-clause qualification, since the predicate parses.
- `frontends/shell/src/canvas/tileResidentSet.ts` — widen `planTileEviction.viewportTileKeys` (`:438`) and `evictTile.protectedTileKeys` (`:332`); repair the entry-66 qualifications at `:420-428` and `:436-437` and `:455-457` (they currently say "past that bound the set the caller passes is the centred window").
- `frontends/shell/src/canvas/tileIngest.ts` — widen `viewportTileKeys` (`:119`); no logic change (`:135-155` already only forwards it).
- `frontends/shell/src/canvas/WorkingCanvas.tsx` — the handle signature (`:257-261`), `protectionSetFor` (`:304-317`), the ref (`:547-565`), the assignment (`:1205`); comments at `:1199-1204`, `:1221-1229`.
- `frontends/shell/src/streaming/tileViewportStreamManager.ts` — the keep-test (`:377`); the disclosure block `:96-155` rewritten from "two things at once" to "the array plans; the predicate protects", with the ADR-028 quote retained and the entry-66 (d) paragraph replaced by this piece's own record.
- `frontends/shell/src/residency/candidateArmSession.ts` — build and pass the membership at `:1400-1418`; repair the entry-66 comment at `:1391-1399`.
- `frontends/shell/src/canvas/tileGridConstants.ts` — `MAX_COVERING_TILES`'s doc (`:73-97`), whose "…and past 65,536 cells it does NOT keep naming them" section is exactly what this piece falsifies; the constant and the window are unchanged.
- `frontends/shell/e2e/residency-harness.mjs` — `:931,947,955`: recompute membership instead of `tilesCoveringBbox`, so the assertion stops comparing two windows to each other; the "pins the rule end-to-end" paragraph (`:852-870`) loses its narrowing clause.
- Records at landing: ADR-028 a **further appended note** closing the exception (on the human's word only), `NEXT-CUT.md:404`, the KNOWN-LIMITATIONS line the human wrote (leaves with the release carrying the piece), `DECISIONS-PENDING`/`RELEASE-0.1` as the custodian's protocol requires.

## Tests

The consult's five, made concrete:

1. **`tileIngest.test.ts`** — grid frame established; two resident tiles, one inside the window, one 400 cells away but inside a viewport bbox whose cover exceeds the bound; a batch forcing eviction. Assert the far tile is absent from `evictedTileKeys` and still `isTileResident`. (Today's shape at `:102-140` is the template.)
2. **`tileIngest.test.ts`** — same fixture, a resident tile genuinely outside the viewport bbox: it *is* evicted. The piece must not protect everything.
3. **`tileGrid.test.ts`** — predicate/cover agreement: over a sweep of bboxes at or under the bound (including one whose `xmax` and `ymax` land exactly on cell boundaries, and one degenerate point), `{tilesCoveringBbox(...)}` as a key set equals `{keys where has(key)}` over the enclosing index rectangle; the boundary case asserts the `xmax` column is in *neither*.
4. **`tileResidentSet.test.ts`** (or `tileIngest.test.ts`) — a plan of more than 65,536 cells: `tileCoverForBbox` reports `truncated` and omits key K, yet `has(K)` is true and `planTileEviction`/`evictTile` refuse to evict K.
5. **`tileViewportStreamManager.test.ts`** — an in-flight tile at cell (0,0); a camera change whose cover exceeds the bound and whose window excludes (0,0) while the bbox still covers it. Assert `cancelMock` not called for its handle, `onTileSuperseded` not called (the mirror of `:260-277`, which must keep passing for the genuinely-out-of-view pan).

Added from the code reading:

6. **`tileGrid.test.ts`** — totality: `has("initial-untiled-look")` and `has("garbage")` return `false` and do not throw; a non-finite bbox protects nothing.
7. **`WorkingCanvas.test.ts`** — `protectionSetFor` widened: membership alone; membership ∪ `extra`; and the covering-only consumer still never sees `extra` (extends `:209-232`).
8. **`tileViewportStreamManager.test.ts`** — the retained in-view tile is *not* re-issued by the same plan (it stays tracked; `issued`/`queued` unchanged), and an out-of-view tracked tile is still dropped.
9. **E2E, `residency-harness.mjs`** — the changed assertion must be exercised on a genuinely over-bound step, not only over-budget: the step's `coveringKeyCount` corroboration is replaced by a membership-based count, and the `exercised: false` honesty path (`:964-975`) is preserved verbatim.

`regression.mjs`'s K7 (`:1207-1360`) is re-run unchanged and must stay PASS, including the settled-partial status assertion (`:1248`) — completeness is untouched.

## Expected outcomes

ADR-028 Amendment 3's rule ("A tile intersecting the viewport is protected whether it is complete or partial, tracked this round or a prior one, or never requested at all", `:461-462`) holds at every zoom, for both consequence paths of the appended note (`:510`). The note's exception is closed by a further appended note on the human's word; the KNOWN-LIMITATIONS line leaves. The declared partial-view status, the bound, the window, and "Showing all N" are exactly as they are today.

## Falsification

Any of tests 1–9 failing; predicate/cover disagreement on any bbox at or under the bound; a K7 regression; `npm run verify` non-zero; or, in the walkthrough row, a tile drawn and then vanishing while still on screen at the window regime.

## What the piece does NOT do

No change to `MAX_COVERING_TILES` or `COVER_WINDOW_CELLS_PER_AXIS`; no change to what is enumerated, issued, or queued; no change to `coveringTruncated`/`truncatedCount`, `lastCoveringTruncated` (`candidateArmSession.ts:298,641`) or `isFillComplete`; no `minZoom` clamp (still `NEXT-CUT.md:403`); no new operator-visible state; no new dependency; no performance claim in code, comment, test or record (ADR-018).

## Walkthrough row

One new Part-K row, felt, no numbers: *"From `polygons-100k.parquet` at a 'Zoom to layer' fit, wheel out roughly eight notches, wait for the status to settle, then pan slowly in one direction. Expected: tiles already drawn stay drawn while they remain on screen; the status still reports the view as partial. A tile that vanishes while still visible is the finding this row exists to catch."*

## Gates

Its own architect gate (ADR-028 Amendment 3 as the criterion; ADR-010 rule 6 for anything declared; docs/01 principle 7 unchanged by construction) and its own reviewer gate. This brief is its preregistration. Branch off main after the tag; sequencing beside ADR-032 and the LOD slice is the post-release call.

## Open questions for the human

1. Does this piece also close ADR-028's *second* deviation — the `fits`/over-budget latch reading the window (note `:512`) — by inverting `anyPartialAmongCovering` to iterate resident tiles, accepting that the over-budget/settled-partial sentence then appears in views that read as fitting today? If not, the closing note closes one path of two and the second deviation stands, declared.
2. Should the further appended note to ADR-028 be drafted for your word *before* the code lands (the ADR-030 shape: note and code in one branch), or after the gates report?
3. Is retaining in-view in-flight and queued tiles past the bound (design 8 — slots and queue room held by tiles this round did not enumerate) acceptable as-is, or does it want its own declared sub-bound?
4. Must the residency harness actually be run for the changed E2E assertion (a measured-class instrument, a long campaign pass), or do unit tests 1–8 plus K7 discharge the piece?
5. Does the piece's landing retire the KNOWN-LIMITATIONS line immediately, or does the line stay until an operator walkthrough row is recorded on a built artifact?

**Recommendation (the drafting agent's, one line — not a ruling):** take (1) as a separate, later piece — this one restores the rule ADR-028 states and changes no operator-visible status; (2) note drafted with the branch; (3) as-is; (4) unit tests plus K7 for the gates, the harness pass folded into the next campaign; (5) line retires with the release that carries the piece, per the preregistration.

### Critical Files for Implementation
- C:\dev\spatial-ide\frontends\shell\src\canvas\tileGrid.ts
- C:\dev\spatial-ide\frontends\shell\src\canvas\tileResidentSet.ts
- C:\dev\spatial-ide\frontends\shell\src\canvas\WorkingCanvas.tsx
- C:\dev\spatial-ide\frontends\shell\src\streaming\tileViewportStreamManager.ts
- C:\dev\spatial-ide\frontends\shell\src\residency\candidateArmSession.ts
