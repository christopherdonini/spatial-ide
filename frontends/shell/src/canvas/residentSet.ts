// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ResidentBatch } from "./decodeBatch";
import { checkPickCeiling, MAX_RESIDENT_VERTICES, ResidentVertexCeilingExceeded } from "./limits";

/** Same key shape as `buildLayers.ts`'s own `layerId` -- not imported from there to avoid a
 * dependency back into the render-layer module from this purely-bookkeeping one. */
function batchKey(batch: Pick<ResidentBatch, "streamHandle" | "batchSeq">): string {
  return `${batch.streamHandle}:${batch.batchSeq}`;
}

/** A `(streamHandle, batchSeq)` pair arrived twice (S12, reviewer): a retransmit, a caller bug, or
 * a data-plane ordering violation, never a legitimate resend -- ADR-019 mints a stream ticket once
 * and a stream's own batch sequence is not restarted mid-stream. Accepting it silently would double-
 * count `totalVertices` against the declared ceiling and hand `buildLayers` two layers sharing one
 * `layerId`, which deck.gl does not support. Treated as a genuine failure, not a declared ceiling:
 * `WorkingCanvas.pushBatch` lets this propagate rather than reporting it via `onCanvasRefusal`. */
export class DuplicateBatchError extends Error {
  constructor(
    public readonly streamHandle: string,
    public readonly batchSeq: number
  ) {
    super(`batch ${streamHandle}:${batchSeq} is already resident -- a batch sequence must not repeat`);
    this.name = "DuplicateBatchError";
  }
}

/**
 * Every batch currently resident on the canvas, across every live stream. `addBatch` enforces both
 * declared ceilings (ADR-010 rule 6) and refuses rather than silently evicting or tiling -- the
 * caller (the streaming layer, next commit) is expected to cancel the offending stream and show a
 * visible typed refusal naming the constant it hit.
 */
export class ResidentSet {
  private batches: ResidentBatch[] = [];
  private totalVertices = 0;
  /** Sum of `batch.ids.length` across every resident batch -- rows/features, not vertices. Kept in
   * lockstep with `totalVertices` the same way: grown in `addBatch`, shrunk in `clearStream`, zeroed
   * in `clear`. Added for rider 1 (DECISIONS-PENDING.md entry 0, option (a)): the persistent
   * ceiling-refusal status indicator names "N of M features rendered", and a vertex count is not a
   * feature count -- one refused batch can carry any number of vertices per feature. */
  private totalFeatures = 0;
  private keys = new Set<string>();

  get totalResidentVertices(): number {
    return this.totalVertices;
  }

  /** Rows/features currently resident across every live stream -- what rider 1's status indicator
   * reports as `residentFeatureCount` at the moment a batch is refused (this getter is read
   * *before* the refused batch's own features are added, since `addBatch` adds nothing on
   * refusal). */
  get totalResidentFeatures(): number {
    return this.totalFeatures;
  }

  getBatches(): readonly ResidentBatch[] {
    return this.batches;
  }

  /**
   * Adds a batch after checking both ceilings. Throws `PickCeilingExceeded` or
   * `ResidentVertexCeilingExceeded` and adds nothing on refusal -- a rejected batch is not
   * partially resident. Throws `DuplicateBatchError` for a `(streamHandle, batchSeq)` already
   * resident, checked before either ceiling since a duplicate is not a capacity question at all.
   */
  addBatch(batch: ResidentBatch): void {
    const key = batchKey(batch);
    if (this.keys.has(key)) {
      throw new DuplicateBatchError(batch.streamHandle, batch.batchSeq);
    }
    checkPickCeiling(batch.ids.length);
    const attemptedTotal = this.totalVertices + batch.totalVertices;
    if (attemptedTotal > MAX_RESIDENT_VERTICES) {
      throw new ResidentVertexCeilingExceeded(attemptedTotal);
    }
    this.batches.push(batch);
    this.totalVertices = attemptedTotal;
    this.totalFeatures += batch.ids.length;
    this.keys.add(key);
  }

  /** Drops every resident batch belonging to `streamHandle` -- called on supersede or close.
   * Batches from other streams are untouched. */
  clearStream(streamHandle: string): void {
    let removedVertices = 0;
    let removedFeatures = 0;
    this.batches = this.batches.filter((b) => {
      if (b.streamHandle !== streamHandle) {
        return true;
      }
      removedVertices += b.totalVertices;
      removedFeatures += b.ids.length;
      this.keys.delete(batchKey(b));
      return false;
    });
    this.totalVertices -= removedVertices;
    this.totalFeatures -= removedFeatures;
  }

  clear(): void {
    this.batches = [];
    this.totalVertices = 0;
    this.totalFeatures = 0;
    this.keys.clear();
  }
}
