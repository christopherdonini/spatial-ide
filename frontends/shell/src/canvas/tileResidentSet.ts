// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ResidentBatch } from "./decodeBatch";

/**
 * Viewport-residency cut P3 items C/D: tile-keyed residency for the candidate arm -- a sibling to
 * `residentSet.ts`'s `ResidentSet` (baseline, stream-keyed), never imported by it, so arm="baseline"
 * never references this module (this piece's own bit-identity requirement). The candidate arm's
 * canvas-side owner (a later piece's WorkingCanvas wiring) decodes a batch exactly as it does today
 * (`decodeBatch`) and hands it to `addBatch` here alongside the tile key its stream was issued for.
 */

export interface TileIngestResult {
  /** The batch actually admitted, containing only rows whose id was not already resident via ANY
   * tile -- `null` when every row in the incoming batch was a duplicate (nothing new to render).
   * Never a partial reference into the original `ResidentBatch`: a genuinely new `BigUint64Array`/
   * `rings` array, so a caller can push it straight into a render layer the same way an ordinary
   * accepted batch already is. */
  accepted: ResidentBatch | null;
  /** Rows dropped because their id was already resident via a DIFFERENT tile (or the same one --
   * genuinely impossible today since `decodeBatch` never repeats an id within one batch, but not
   * assumed here either). The misaligned-grid test's own subject (NEXT-CUT.md P3 item C). */
  duplicatesDropped: number;
}

interface TileEntry {
  batches: ResidentBatch[];
  vertices: number;
  features: number;
  /** Viewport-residency cut P6a, Defect A / ADR-028 architect clarification 2: true iff this tile's
   * own resident content is known to be INCOMPLETE relative to what its bbox actually covers -- either
   * a delivered batch was trimmed to the vertex budget boundary (`ingestTileBatch`'s own `overBudget`
   * outcome) or the tile's own stream was cancelled mid-delivery because the manager already knew the
   * remainder could not be admitted (`candidateArmSession.ts`'s budget-exhaustion cancel). Sticky:
   * once true, only clears when the WHOLE entry is evicted (`evictTile`) and later re-ingested fresh --
   * there is no "un-mark partial in place" operation, since nothing here can prove the tile's own
   * remaining data was ever actually recovered short of a clean re-fetch. */
  partial: boolean;
}

/**
 * Cross-tile dedupe by stable feature id (item C) + distance-ordered eviction (item D), tracked per
 * tile key (`tileGrid.ts`'s own `tileKeyToString`). `totalResidentVertices`/`totalResidentFeatures`
 * mirror `ResidentSet`'s own getters, summed across every tile instead of every stream.
 *
 * **P5f complex-gate must-fix 2, the boundary-feature loss.** Before this piece, `knownIds` was a
 * flat `Set<bigint>` with no notion of WHICH tile's own batch actually stored a given id's geometry --
 * `evictTile` simply deleted every id its own batches carried from that one shared set. A feature
 * straddling a misaligned grid boundary (id 100 intersects both tile A's bbox and tile B's) is
 * ingested once, by whichever of A/B's batches arrives first (the OWNER); the other tile's own
 * delivery of the same id is dropped as a duplicate (`duplicatesDropped`) and its geometry is never
 * stored a second time. Evicting the OWNER (A) therefore deleted id 100 from `knownIds` even though B
 * -- still resident -- had "delivered" it too: the feature vanished from the render set (nobody's
 * `batches` array holds its geometry any more) while still intersecting the current viewport,
 * unrecoverable until some UNRELATED clear happened to re-fetch B.
 *
 * **The fix: refcount/attribute ids per delivering tile, chosen design B ("mark the suppressed tile
 * non-resident so planning re-fetches") over design A ("re-attribute the geometry to the surviving
 * tile").** Design A would require never discarding a suppressed duplicate's geometry at ingest (so
 * there is something to re-attribute), which changes `addBatch`'s own storage/counting contract
 * materially. Design B needs only bookkeeping: `idOwner` names which tile's `batches` actually holds
 * an id's geometry; `suppressorsOf`/`suppressedIdsByTile` record, per id, which OTHER still-resident
 * tiles also attempted to deliver it (and were suppressed at ingest). When the OWNER of an id is
 * evicted, every tile recorded as a suppressor of that id is evicted too (cascading through this same
 * method) -- `isTileResident` for that tile becomes `false`, so the next planning pass (`Tile
 * ViewportStreamManager.onCameraChange`) re-fetches it honestly if it is still covered. This keeps
 * `duplicatesDropped`'s own semantics UNCHANGED (still counted, at ingest, exactly as before) and
 * never silently loses a feature: it is either still resident under its real owner, or its
 * would-be-owner AND every tile that ever tried to deliver it are all marked non-resident together,
 * so the very next camera-change plan re-requests every one of them.
 */
const EMPTY_PROTECTED_TILE_KEYS: ReadonlySet<string> = new Set();

export class TileResidentSet {
  private tiles = new Map<string, TileEntry>();
  /** Every feature id currently resident, via ANY tile -- the dedupe set item C's own contract
   * names ("a feature arriving in tile B that is already resident via tile A is dropped at
   * ingest"). Shrunk in lockstep with a tile's own eviction (`evictTile`), never left stale --
   * evicting a tile makes its ids available again for a later re-fetch of the same cell. Kept in
   * lockstep with `idOwner` below (same key set) -- `knownIds` stays the fast membership test
   * `addBatch`'s own hot loop reads every incoming row against; `idOwner` is the extra bookkeeping
   * `evictTile`'s own cascade needs and `addBatch`'s hot loop does not. */
  private knownIds = new Set<bigint>();
  /** id -> the tile key whose `batches` entry actually stores that id's geometry (the first tile to
   * deliver it, ingest order) -- M2's own "owner" concept. */
  private idOwner = new Map<bigint, string>();
  /** id -> the set of OTHER, still-resident tile keys that also attempted to deliver this id and were
   * suppressed as duplicates at ingest (`addBatch`'s own `duplicatesDropped` loop) -- every one of
   * these tiles must be evicted too, the moment the id's real owner is (M2's own cascade). Absent (no
   * entry) for an id nobody has ever suppressed. */
  private suppressorsOf = new Map<bigint, Set<string>>();
  /** The exact inverse index of `suppressorsOf` above, keyed by the SUPPRESSED tile instead of the
   * id -- needed so that when a tile is evicted for its OWN reason (not as part of a cascade), this
   * class can find and clean up every `suppressorsOf` entry naming it, rather than leaving stale tile
   * keys behind in sets `evictTile` will never look at again. */
  private suppressedIdsByTile = new Map<string, Set<bigint>>();
  private totalVertices = 0;
  private totalFeatures = 0;

  get totalResidentVertices(): number {
    return this.totalVertices;
  }

  get totalResidentFeatures(): number {
    return this.totalFeatures;
  }

  /** Whether `tileKey` has ever been ingested (via `addBatch` or `markTileResidentEmpty`) and not
   * since evicted -- planning's own "resident tiles are NOT re-requested" input
   * (`TileViewportStreamManager`'s `TileResidencyAccessor`). True even for a tile whose own delivery
   * turned out to carry zero (or entirely duplicate) rows -- it was still genuinely asked for and
   * answered, so asking again would be wasted work, not new data. */
  isTileResident(tileKey: string): boolean {
    return this.tiles.has(tileKey);
  }

  /** Viewport-residency cut P6a, Defect A: true iff `tileKey` is both resident (`isTileResident`) AND
   * NOT `partial` -- "we asked for this tile's own bbox and hold everything it delivered," the
   * stronger fact `isFillComplete` (`candidateArmSession.ts`) and planning's own re-fetch decision
   * both need instead of mere presence. False for a tile that was never ingested at all (nothing to be
   * complete about) -- callers that need to distinguish "missing" from "partial" read `isTileResident`/
   * `isTilePartial` directly. */
  isTileComplete(tileKey: string): boolean {
    const entry = this.tiles.get(tileKey);
    return entry !== undefined && !entry.partial;
  }

  /** Whether `tileKey` is currently tracked as durably partial -- `false` for a tile that was never
   * ingested at all, exactly like `isTileResident` would be (there is nothing partial about a tile
   * this set has never heard of). */
  isTilePartial(tileKey: string): boolean {
    return this.tiles.get(tileKey)?.partial ?? false;
  }

  residentTileKeys(): string[] {
    return [...this.tiles.keys()];
  }

  tileVertexCount(tileKey: string): number {
    return this.tiles.get(tileKey)?.vertices ?? 0;
  }

  getBatches(): ResidentBatch[] {
    const out: ResidentBatch[] = [];
    for (const entry of this.tiles.values()) {
      out.push(...entry.batches);
    }
    return out;
  }

  /**
   * Adds a batch under `tileKey`, filtering out any row whose id is already resident via another
   * tile first (item C) -- `duplicatesDropped` counts them, `accepted` carries only the rest.
   * Ceiling enforcement is deliberately NOT here: item D's own eviction is a `MAX_RESIDENT_VERTICES`
   * decision that needs the CURRENT VIEW CENTRE (never evict a viewport tile) to pick which tiles to
   * free, which this class does not know on its own -- `planTileEviction` below is the pure decision
   * function a caller runs first (typically: attempt eviction, then call this only if evicting made
   * room, or accept over-budget per item D's own contract). This keeps `addBatch` itself a pure
   * bookkeeping operation, never a refusal.
   *
   * **`partial` (viewport-residency cut P6a, Defect A):** the caller's own declaration that `batch`
   * was already trimmed to the vertex budget boundary before reaching here (`ingestTileBatch`'s own
   * `overBudget` outcome) -- this method never decides that itself (it has no budget of its own to
   * compare against). `false` by default so every pre-existing call site (nothing was ever trimmed)
   * keeps its old, non-partial behaviour unchanged. Sticky: a tile already marked partial by an
   * earlier call stays partial even if THIS call passes `false` -- see `markTileResidentEmpty`'s own
   * doc comment for why downgrading in place is never correct.
   */
  addBatch(tileKey: string, batch: ResidentBatch, partial = false): TileIngestResult {
    const keepIdx: number[] = [];
    let duplicatesDropped = 0;
    for (let i = 0; i < batch.ids.length; i++) {
      const id = batch.ids[i];
      if (this.knownIds.has(id)) {
        duplicatesDropped++;
        // M2's own suppressor bookkeeping: `tileKey` genuinely tried to deliver `id` too, but lost
        // to whichever tile already owns it -- recorded BOTH directions (id -> suppressor tiles, and
        // tile -> suppressed ids) so `evictTile` can cascade correctly in either direction later.
        let suppressors = this.suppressorsOf.get(id);
        if (!suppressors) {
          suppressors = new Set();
          this.suppressorsOf.set(id, suppressors);
        }
        suppressors.add(tileKey);
        let suppressed = this.suppressedIdsByTile.get(tileKey);
        if (!suppressed) {
          suppressed = new Set();
          this.suppressedIdsByTile.set(tileKey, suppressed);
        }
        suppressed.add(id);
      } else {
        keepIdx.push(i);
      }
    }

    this.markTileResidentEmpty(tileKey, partial); // ingesting at all makes this tile resident, even if trimmed to nothing

    if (keepIdx.length === 0) {
      return { accepted: null, duplicatesDropped };
    }

    let trimmed: ResidentBatch;
    if (duplicatesDropped === 0) {
      trimmed = batch;
    } else {
      const ids = new BigUint64Array(keepIdx.length);
      const rings: ResidentBatch["rings"] = new Array(keepIdx.length);
      let totalVertices = 0;
      keepIdx.forEach((srcIdx, dstIdx) => {
        ids[dstIdx] = batch.ids[srcIdx];
        rings[dstIdx] = batch.rings[srcIdx];
        for (const ring of rings[dstIdx]) {
          totalVertices += ring.length;
        }
      });
      trimmed = { streamHandle: batch.streamHandle, batchSeq: batch.batchSeq, ids, rings, totalVertices };
    }

    for (const id of trimmed.ids) {
      this.knownIds.add(id);
      this.idOwner.set(id, tileKey);
    }
    const entry = this.tiles.get(tileKey)!; // set by markTileResidentEmpty above
    entry.batches.push(trimmed);
    entry.vertices += trimmed.totalVertices;
    entry.features += trimmed.ids.length;
    this.totalVertices += trimmed.totalVertices;
    this.totalFeatures += trimmed.ids.length;

    return { accepted: trimmed, duplicatesDropped };
  }

  /** Marks `tileKey` resident with no data of its own yet -- a stream whose own tile bbox genuinely
   * carries nothing (an empty delivery, or a delivery entirely deduped away) still counts as
   * "already have this tile" for planning purposes. Creates the entry as `partial` iff `partial` is
   * `true`; if the tile is ALREADY tracked, `partial: true` still upgrades the existing entry (sticky,
   * never downgrades it back to `false` here -- see `TileEntry.partial`'s own doc comment for why
   * there is no in-place "un-mark partial" operation). `partial` defaults to `false` so every
   * pre-existing call site keeps its old behaviour unchanged. */
  markTileResidentEmpty(tileKey: string, partial = false): void {
    const existing = this.tiles.get(tileKey);
    if (!existing) {
      this.tiles.set(tileKey, { batches: [], vertices: 0, features: 0, partial });
      return;
    }
    if (partial) existing.partial = true;
  }

  /** Viewport-residency cut P6a, Defect A: marks an ALREADY-tracked tile partial without adding a
   * batch -- the "stream superseded mid-delivery" trigger (`candidateArmSession.ts`'s own
   * budget-exhaustion cancel: the manager knows the remainder could not be admitted, cancels the
   * stream, and this is how that fact survives the cancellation instead of being silently lost). A
   * no-op for a tile this set has never heard of (`isTileResident(tileKey) === false`) -- there is no
   * entry to mark, and creating an empty-but-partial one for a tile that was never even asked for
   * would misrepresent it as "attempted and incomplete" rather than "never requested." */
  markTilePartial(tileKey: string): void {
    const entry = this.tiles.get(tileKey);
    if (entry) entry.partial = true;
  }

  /**
   * Distance-ordered eviction's own apply step (item D): drops `tileKey`'s whole residency --
   * batches, vertex/feature totals, AND every id it contributed to the cross-tile dedupe set. An
   * evicted tile is genuinely gone, not merely hidden: a later re-request for the same cell is
   * treated as new data, never silently deduped against its own former residency (which would make
   * a re-fetched tile render as empty forever).
   *
   * **P5f complex-gate must-fix 2's own cascade.** Two things happen beyond the plain drop above:
   * (1) `tileKey` may itself have been a SUPPRESSOR of ids some other, still-resident tile owns --
   * that relationship is cleaned up (`suppressedIdsByTile`/`suppressorsOf`) so no stale tile key is
   * left behind for a future eviction of the real owner to find. (2) every id `tileKey` itself OWNED
   * (stored the geometry for) is checked for surviving suppressors -- any still-resident tile that
   * also once tried to deliver that id is evicted too, recursively through this same method. This is
   * what keeps a boundary feature from silently vanishing: either its owner survives, or every tile
   * that ever delivered it is evicted together, and `isTileResident` for every one of them becomes
   * `false` in the same synchronous call -- the very next planning pass re-fetches whichever of them
   * the current viewport still covers, rather than leaving a permanent, unrecoverable hole.
   *
   * **Viewport-residency cut P6a, B1: the cascade above ignored `viewportTileKeys` entirely.** A
   * suppressor found by step (2) could itself be a tile the CURRENT viewport covers -- the cascade
   * evicted it anyway, blanking a tile the "never evict a tile intersecting the current viewport"
   * rule (this class's own `planTileEviction`, and `applyTileViewportContext`'s own doc comment)
   * exists to protect, and did so through `evictedTileKeys`/`plan.evict`-derived counters that never
   * even recorded it happened. `protectedTileKeys` (typically the caller's own current covering set)
   * is the fix: a suppressor named in it is never evicted by the cascade -- only its own suppression
   * RECORD for the one id being cascaded is dropped (it may still legitimately suppress other ids
   * whose owner survives), and the tile itself is marked `partial` (Defect A's own machinery) so the
   * very next planning pass re-fetches it once headroom allows, recovering that id's geometry under
   * its own delivery this time -- geometry is never re-attributed in place (this class's own top doc
   * comment: design A was rejected), so a fresh delivery is the only honest way to recover it. The
   * return value is now the TRUE list of tile keys this call actually evicted (this tile plus every
   * cascaded, non-protected suppressor) -- a caller's own eviction counters read this, never assume
   * it equals whatever eviction PLAN it started from, since a plan's own candidate list and reality
   * can now differ exactly where a protected suppressor was involved.
   */
  evictTile(tileKey: string, protectedTileKeys: ReadonlySet<string> = EMPTY_PROTECTED_TILE_KEYS): string[] {
    const entry = this.tiles.get(tileKey);
    if (!entry) return [];
    if (protectedTileKeys.has(tileKey)) {
      // Never blank a protected tile directly. `planTileEviction`'s own `viewportTileKeys` exclusion
      // already keeps a protected key out of a plan's `evict` list in the ordinary case; this guard
      // is the structural backstop for the one OTHER route that could reach a protected tile here --
      // a cascade landing on it as a suppressor is handled per-id below, never by evicting it outright.
      return [];
    }
    this.tiles.delete(tileKey);
    this.totalVertices -= entry.vertices;
    this.totalFeatures -= entry.features;

    // (1) This tile's own suppressed-delivery bookkeeping -- ids it tried to deliver but lost to
    // some OTHER tile's ownership. That other id's own owner is untouched here (it survives).
    const ownSuppressed = this.suppressedIdsByTile.get(tileKey);
    if (ownSuppressed) {
      for (const id of ownSuppressed) {
        const suppressors = this.suppressorsOf.get(id);
        if (suppressors) {
          suppressors.delete(tileKey);
          if (suppressors.size === 0) this.suppressorsOf.delete(id);
        }
      }
      this.suppressedIdsByTile.delete(tileKey);
    }

    // (2) Ids THIS tile owned -- gone from the dedupe set; any still-resident suppressor of one of
    // them must be evicted too (cascade), collected first so mutating `this.tiles` mid-loop is safe.
    // A PROTECTED suppressor is diverted into `markTilePartial` instead of the cascade set (B1).
    const evicted: string[] = [tileKey];
    const cascadeTiles = new Set<string>();
    for (const b of entry.batches) {
      for (const id of b.ids) {
        this.knownIds.delete(id);
        this.idOwner.delete(id);
        const suppressors = this.suppressorsOf.get(id);
        if (suppressors) {
          for (const t of suppressors) {
            if (protectedTileKeys.has(t)) {
              const suppressedByT = this.suppressedIdsByTile.get(t);
              if (suppressedByT) {
                suppressedByT.delete(id);
                if (suppressedByT.size === 0) this.suppressedIdsByTile.delete(t);
              }
              this.markTilePartial(t);
            } else {
              cascadeTiles.add(t);
            }
          }
          this.suppressorsOf.delete(id);
        }
      }
    }
    for (const t of cascadeTiles) {
      if (t !== tileKey) evicted.push(...this.evictTile(t, protectedTileKeys));
    }
    return evicted;
  }

  clear(): void {
    this.tiles.clear();
    this.knownIds.clear();
    this.idOwner.clear();
    this.suppressorsOf.clear();
    this.suppressedIdsByTile.clear();
    this.totalVertices = 0;
    this.totalFeatures = 0;
  }
}

export interface EvictionPlan {
  /** Tile keys to evict, farthest-from-view-centre first -- the order a caller should actually call
   * `TileResidentSet.evictTile` in (though nothing here requires stopping early; a caller may evict
   * every entry regardless of `overBudget`, since each further eviction only frees more room). */
  evict: string[];
  /** True iff evicting every EVICTABLE tile (every resident tile not in `viewportTileKeys`) still
   * would not make room for `incomingVertices` -- item D's own "the viewport's own tiles exceed the
   * budget" case. The caller accepts up to budget and marks the state over-budget WITHOUT the
   * baseline refusal path (never `ResidentVertexCeilingExceeded` here); this flag is exactly the
   * signal for that decision. */
  overBudget: boolean;
}

const EMPTY_RESERVED: ReadonlySet<string> = new Set();

/**
 * The pure eviction DECISION (item D) -- never evicts a tile in `viewportTileKeys` (the current
 * viewport's own covering set), regardless of distance or budget: "never evict a tile intersecting
 * the current viewport" is absolute, not merely preferred. Ordered farthest-from-`viewCentre` first
 * via `distanceToViewCentre` (typically `tileGrid.ts`'s own `tileDistanceToPoint`, injected here so
 * this function stays free of any grid-frame/level knowledge of its own).
 */
export function planTileEviction(params: {
  /** Every currently resident tile this caller is willing to consider evicting from (typically
   * `TileResidentSet.residentTileKeys()`). */
  residentTileKeys: readonly string[];
  tileVertices: (tileKey: string) => number;
  /** Tiles the current viewport itself covers -- never evicted, however far the budget overshoots. */
  viewportTileKeys: ReadonlySet<string>;
  incomingVertices: number;
  currentTotalVertices: number;
  maxResidentVertices: number;
  distanceToViewCentre: (tileKey: string) => number;
  /**
   * P5f complex-gate must-fix 3: tile keys with no real grid position -- the candidate arm's
   * reserved `INITIAL_TILE_KEY` (`tileGridConstants.ts`) is the one example today, but the shape is
   * general. `distanceToViewCentre` is NEVER called for a key in this set (a caller's own
   * `parseTileKey`-based implementation, e.g. `tileIngest.ts`/`WorkingCanvas.tsx`, would otherwise
   * receive this key and produce `NaN`, which made `Array.prototype.sort`'s own ordering a
   * comparator artifact rather than a distance order -- the bug this parameter exists to make
   * structurally impossible). Reserved keys are excluded from the ordinary distance-sorted eviction
   * candidates and appended to the candidate list LAST, in their given order, after every ordinary
   * evictable tile -- the declared policy (recommended by the finding this fixes): a reserved tile's
   * content is what every real tile's own cross-tile dedupe compared against, so it is the single
   * most valuable thing to keep resident and the honest LAST resort once nothing else is left to
   * free. Still never evicted while itself named in `viewportTileKeys` -- the same absolute rule
   * every other tile gets. Defaults to empty (ordinary, non-candidate callers are unaffected).
   */
  reservedTileKeys?: ReadonlySet<string>;
}): EvictionPlan {
  const projectedNoEviction = params.currentTotalVertices + params.incomingVertices;
  if (projectedNoEviction <= params.maxResidentVertices) {
    return { evict: [], overBudget: false };
  }

  const reserved = params.reservedTileKeys ?? EMPTY_RESERVED;
  const evictable = params.residentTileKeys
    .filter((k) => !params.viewportTileKeys.has(k) && !reserved.has(k))
    .map((k) => ({ key: k, vertices: params.tileVertices(k), distance: params.distanceToViewCentre(k) }))
    .sort((a, b) => b.distance - a.distance);
  // Reserved, evictable (not currently in the viewport) tiles -- declared LAST resort, in their
  // given order, never distance-ordered (their `distanceToViewCentre` is never even called).
  const reservedEvictable = params.residentTileKeys.filter((k) => reserved.has(k) && !params.viewportTileKeys.has(k));

  const evict: string[] = [];
  let projected = projectedNoEviction;
  for (const t of evictable) {
    if (projected <= params.maxResidentVertices) break;
    evict.push(t.key);
    projected -= t.vertices;
  }
  for (const key of reservedEvictable) {
    if (projected <= params.maxResidentVertices) break;
    evict.push(key);
    projected -= params.tileVertices(key);
  }

  return { evict, overBudget: projected > params.maxResidentVertices };
}
