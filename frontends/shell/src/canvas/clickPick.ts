// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ResidentBatch } from "./decodeBatch";
import { extentOfBatch } from "./extent";
import type { PickResult } from "./pick";
import type { AuthoritativeBbox } from "./viewportBbox";

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.2, "The click" (OPEN-1 (A), ruled): what one tap on the canvas
 * resolves to. Pure -- `WorkingCanvas.tsx` supplies the three dependencies and deck's `onClick` calls this with the
 * tap's own pixel, in the same handler, so no screen coordinate crosses a boundary or a moment (ADR-010 rule 1).
 *
 * **Its dependencies have no readout member, by design (OPEN-1 (A)):** a click never reads the hover readout, which
 * may be stale or labelled, and never reads deck's pointer-down info. It picks afresh at the tap's pixel against the
 * current framebuffer, the way the settle re-pick does, through the same `pickCandidateAt` (deck's `pickObject`, then
 * the batch the picked layer was built from). Its steps are the settle re-pick's, in `onHover`'s order: no candidate is
 * `nothing`; then the threshold, which refuses by name; only above it are the pick and the row's bounds computed.
 */
export interface ClickPickDeps {
  /** deck's `pickObject` at a pixel, then `batchForLayerId`: the candidate batch and the GPU ordinal, or `null`. */
  pickCandidateAt: (x: number, y: number) => { batch: ResidentBatch; gpuOrdinal: number } | null;
  /** The ADR-028 item 4 threshold at the current zoom (`isBelowPickResolution`). */
  belowPickResolutionNow: () => boolean;
  /** ADR-010 rule 2's indirection: the GPU ordinal to the stable feature id (`resolvePick`). */
  resolveCandidate: (candidate: { batch: ResidentBatch; gpuOrdinal: number }) => PickResult | null;
}

/** `bounds` is the authoritative f64 box over every part of the picked row (looked up, never unprojected). */
export type ClickPick =
  | { kind: "feature"; pick: PickResult; bounds: AuthoritativeBbox }
  | { kind: "below-pick-resolution" }
  | { kind: "nothing" };

/** The box over every ring vertex of every part of one row, or `null` when the row has none. */
function boundsOfRow(batch: ResidentBatch, row: number): AuthoritativeBbox | null {
  return extentOfBatch({ parts: [batch.parts[row]] });
}

export function resolveClickPick(deps: ClickPickDeps, x: number, y: number): ClickPick {
  const candidate = deps.pickCandidateAt(x, y);
  if (candidate === null) return { kind: "nothing" };
  if (deps.belowPickResolutionNow()) return { kind: "below-pick-resolution" };
  const pick = deps.resolveCandidate(candidate);
  if (pick === null) return { kind: "nothing" };
  const bounds = boundsOfRow(candidate.batch, candidate.batch.partToRow[candidate.gpuOrdinal]);
  return bounds === null ? { kind: "nothing" } : { kind: "feature", pick, bounds };
}

/** What `Deck`'s `onClick` hands over as its second argument that this module reads: the tap's own pixel, relative to the
 * canvas. Deck's first argument (its picking info, the pointer-down pick) is never read. */
export interface Tap {
  readonly offsetCenter?: { readonly x: number; readonly y: number };
}

/** `Deck`'s `onClick` as one function: pick afresh at the tap's own pixel and emit what it resolves to. A tap that carries no
 * pixel emits nothing, since a pixel invented for it would be a pick nobody made (ADR-010 rule 1). */
export function createTapHandler(deps: ClickPickDeps, emit: (result: ClickPick) => void): (tap: Tap) => void {
  return (tap) => {
    const pos = tap.offsetCenter;
    if (pos === undefined) return;
    emit(resolveClickPick(deps, pos.x, pos.y));
  };
}
