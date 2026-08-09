import type { ResidentBatch } from "./decodeBatch";
import { checkPickCeiling, MAX_RESIDENT_VERTICES, ResidentVertexCeilingExceeded } from "./limits";

/**
 * Every batch currently resident on the canvas, across every live stream. `addBatch` enforces both
 * declared ceilings (ADR-010 rule 6) and refuses rather than silently evicting or tiling -- the
 * caller (the streaming layer, next commit) is expected to cancel the offending stream and show a
 * visible typed refusal naming the constant it hit.
 */
export class ResidentSet {
  private batches: ResidentBatch[] = [];
  private totalVertices = 0;

  get totalResidentVertices(): number {
    return this.totalVertices;
  }

  getBatches(): readonly ResidentBatch[] {
    return this.batches;
  }

  /**
   * Adds a batch after checking both ceilings. Throws `PickCeilingExceeded` or
   * `ResidentVertexCeilingExceeded` and adds nothing on refusal -- a rejected batch is not
   * partially resident.
   */
  addBatch(batch: ResidentBatch): void {
    checkPickCeiling(batch.ids.length);
    const attemptedTotal = this.totalVertices + batch.totalVertices;
    if (attemptedTotal > MAX_RESIDENT_VERTICES) {
      throw new ResidentVertexCeilingExceeded(attemptedTotal);
    }
    this.batches.push(batch);
    this.totalVertices = attemptedTotal;
  }

  /** Drops every resident batch belonging to `streamHandle` -- called on supersede or close.
   * Batches from other streams are untouched. */
  clearStream(streamHandle: string): void {
    let removedVertices = 0;
    this.batches = this.batches.filter((b) => {
      if (b.streamHandle !== streamHandle) {
        return true;
      }
      removedVertices += b.totalVertices;
      return false;
    });
    this.totalVertices -= removedVertices;
  }

  clear(): void {
    this.batches = [];
    this.totalVertices = 0;
  }
}
