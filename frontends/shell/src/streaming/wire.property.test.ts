// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { FrameDecoder } from "./wire";

/**
 * The property-testing trial's P3 (its preregistration, section 3): the shell's frame decoder returns the
 * frames written, however their bytes are cut into chunks. `FrameDecoder.push` is the production reader of
 * the producer's frames (`startStream` in `adapterWs.ts`).
 *
 * The test writes each frame's bytes itself from the layout `[u8 tag][3 reserved zero bytes][u32 big-endian
 * payload_len][payload]`, not through `controlFrame`, so the expected result does not rest on the code under
 * test. 1 to 8 BATCH frames, each payload 0 to 64 bytes, cut into at most 16 chunks, none empty: an empty
 * chunk is outside the domain, because every frame the producer writes carries its 8-byte prefix, so the
 * WebSocket adapter never pushes one. In a third of the runs the cuts fall only at frame boundaries (one
 * frame per chunk, the shape the adapter delivers); in the others a cut may fall at any byte.
 */
const BATCH = 0x10;
const PREFIX = 8;

function encode(payloads: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(payloads.reduce((n, p) => n + PREFIX + p.length, 0));
  const view = new DataView(out.buffer);
  let at = 0;
  for (const p of payloads) {
    out[at] = BATCH;
    view.setUint32(at + 4, p.length, false);
    out.set(p, at + PREFIX);
    at += PREFIX + p.length;
  }
  return out;
}

interface Scenario {
  payloads: Uint8Array[];
  cuts: number[];
}

const scenarioArb: fc.Arbitrary<Scenario> = fc
  .array(fc.uint8Array({ minLength: 0, maxLength: 64 }), { minLength: 1, maxLength: 8 })
  .chain((payloads) => {
    const total = encode(payloads).length;
    const boundaries: number[] = [];
    let at = 0;
    for (const p of payloads.slice(0, -1)) {
      at += PREFIX + p.length;
      boundaries.push(at);
    }
    return fc
      .oneof(
        { weight: 1, arbitrary: fc.constant(boundaries) },
        { weight: 2, arbitrary: fc.uniqueArray(fc.integer({ min: 1, max: total - 1 }), { maxLength: 15 }) }
      )
      .map((cuts): Scenario => ({ payloads, cuts: [...cuts].sort((a, b) => a - b) }));
  });

function holds({ payloads, cuts }: Scenario): void {
  const bytes = encode(payloads);
  const edges = [0, ...cuts, bytes.length];
  const chunks = edges.slice(1).map((end, i) => bytes.subarray(edges[i], end));
  const decoder = new FrameDecoder();
  const frames = chunks.flatMap((c) => decoder.push(c));

  // (a) the frames written, in order, byte for byte, and no fault.
  expect(frames.map((f) => f.t)).toEqual(payloads.map(() => "batch"));
  frames.forEach((f, i) => {
    if (f.t !== "batch") throw new Error("unreachable: checked above");
    expect(Array.from(f.payload), `frame ${i} payload`).toEqual(Array.from(payloads[i]));
  });
  expect(decoder.fault).toBeNull();

  // (b) contiguous exactly when the frame's bytes lie inside one pushed chunk; the counted copies are the others.
  let start = 0;
  const expected = payloads.map((p) => {
    const end = start + PREFIX + p.length;
    const inOneChunk = !cuts.some((c) => c > start && c < end);
    start = end;
    return inOneChunk;
  });
  frames.forEach((f, i) => {
    if (f.t !== "batch") throw new Error("unreachable: checked above");
    expect(f.contiguous, `frame ${i} contiguous`).toBe(expected[i]);
  });
  expect(decoder.stats.reassemblyCopies, "counted reassembly copies").toBe(expected.filter((c) => !c).length);
}

describe("the frame decoder, however the bytes are chunked (property)", () => {
  it("returns the frames written, with contiguity and the copy count exact, over 200 generated cases", () => {
    fc.assert(fc.property(scenarioArb, holds), { numRuns: 200 });
  });
});
