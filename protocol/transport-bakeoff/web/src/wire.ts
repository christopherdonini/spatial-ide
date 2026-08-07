// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Adapter-shared binary framing, consumer side. Mirrors `src/wire.rs`.
 *
 * Kept out of `transport.ts` deliberately: that file is the transport-neutral interface and may not
 * name framing at all. This decoder is shared by BOTH candidates, which is what makes "identical
 * browser consumer for both" a fact rather than a claim — the adapters differ only in where the
 * bytes come from.
 *
 * Layout, both directions: `[u8 tag][3 reserved zero bytes][u32 big-endian len][payload]`. Every
 * frame is fixed-layout binary; no JSON crosses the data channel in either direction (ADR-004;
 * README H5).
 *
 * The prefix is 8 bytes rather than 5 so the payload starts 8-byte aligned. Arrow IPC needs that
 * alignment to hand out buffer *views*; misaligned, `tableFromIPC` copies the whole batch to
 * realign it. Measured: 0/100 batches shared their buffer at a 5-byte prefix.
 */

import { TERMINAL_KINDS, type DecoderStats, type Frame } from './transport.js';

export const TAG = {
  OPEN: 0x0f,
  BATCH: 0x10,
  PROGRESS: 0x11,
  TERMINAL: 0x12,
} as const;

export const CTRL = { CREDIT: 0x01, CANCEL: 0x02 } as const;

/** Tag byte, three reserved zero bytes, big-endian u32 length — sized to keep payloads aligned. */
export const FRAME_PREFIX_LEN = 8;

export function controlFrame(tag: number, payload = new Uint8Array(0)): Uint8Array {
  const out = new Uint8Array(FRAME_PREFIX_LEN + payload.length);
  out[0] = tag;
  new DataView(out.buffer).setUint32(4, payload.length, false);
  out.set(payload, FRAME_PREFIX_LEN);
  return out;
}

/**
 * Streaming frame decoder.
 *
 * Avoids the O(n^2) trap of concatenating a growing buffer per chunk by holding a queue of chunks
 * and materializing a contiguous payload only when a frame actually spans a boundary. Whether that
 * copy was needed is recorded, because it differs between candidates and is exactly the kind of
 * cost ADR-004's "copy-minimized, never zero-copy" clause requires to be counted rather than
 * assumed away.
 */
export class FrameDecoder {
  private chunks: Uint8Array[] = [];
  private available = 0;
  readonly stats: DecoderStats = { reassemblyCopies: 0, jsonFramesSeen: 0 };

  /**
   * Called with the raw bytes of every BATCH frame, **in order, as slices, without concatenation**
   * (Phase 2, §16.4). This is what lets the checksum be computed chunk-wise: hashing a contiguous
   * buffer would require assembling one first, which for Candidate B would move the reassembly copy
   * into the raw-receipt segment and erase the difference being measured.
   *
   * Includes each frame's 8-byte prefix, so the resulting digest equals the producer's corpus wire
   * digest and can be checked against `/manifest` rather than merely compared between candidates.
   */
  onBatchBytes: ((slice: Uint8Array) => void) | null = null;

  /**
   * Declared maximum frame size the consumer will accept (§16.3). **Declared, not discovered** —
   * ADR-010 rule 6. A frame claiming more than this is rejected at the limit and surfaced, rather
   * than being buffered until something else breaks; R5 drives past it deliberately.
   */
  maxFrameBytes = 16 * 1024 * 1024;

  /** Set once a protocol violation is detected. The stream is finished, not merely paused. */
  fault: string | null = null;

  push(chunk: Uint8Array): Frame[] {
    if (this.fault) return [];
    this.chunks.push(chunk);
    this.available += chunk.length;
    const out: Frame[] = [];
    for (;;) {
      const prefix = this.peek(FRAME_PREFIX_LEN);
      if (!prefix) break;
      const len =
        ((prefix[4] << 24) | (prefix[5] << 16) | (prefix[6] << 8) | prefix[7]) >>> 0;
      const total = FRAME_PREFIX_LEN + len;
      // R5: reject at the declared ceiling instead of accumulating an unbounded buffer.
      if (len > this.maxFrameBytes) {
        this.fault = `frame declares ${len} bytes, over the declared ${this.maxFrameBytes} ceiling`;
        return [
          { t: 'terminal', terminal: { kind: 'DecodeFailed', detail: this.fault } },
        ];
      }
      // R1/R3: a frame whose declared length has not arrived is incomplete, never complete-so-far.
      // Returning here (rather than emitting what is present) is what makes a truncated tail a
      // detectable fault instead of a short-but-plausible stream.
      if (this.available < total) break;
      const sink = prefix[0] === TAG.BATCH ? this.onBatchBytes : null;
      const { bytes, contiguous } = this.take(total, sink);
      const payload = bytes.subarray(FRAME_PREFIX_LEN);
      // H5, byte-level: assert no frame on the data channel is JSON.
      const first = payload.length > 0 ? payload[0] : 0;
      if (first === 0x7b /* { */ || first === 0x5b /* [ */) this.stats.jsonFramesSeen++;
      out.push(decode(prefix[0], payload, contiguous));
    }
    return out;
  }

  private peek(n: number): Uint8Array | null {
    if (this.available < n) return null;
    if (this.chunks[0].length >= n) return this.chunks[0].subarray(0, n);
    const out = new Uint8Array(n);
    let off = 0;
    for (const c of this.chunks) {
      const take = Math.min(n - off, c.length);
      out.set(c.subarray(0, take), off);
      off += take;
      if (off === n) break;
    }
    return out;
  }

  /**
   * Removes `n` bytes from the front. `contiguous` is false when reassembly was required.
   *
   * `sink`, when present, receives the source slices in order **before** any assembly, so a
   * consumer can hash the frame without a contiguous copy existing for its benefit.
   */
  private take(
    n: number,
    sink: ((slice: Uint8Array) => void) | null,
  ): { bytes: Uint8Array; contiguous: boolean } {
    if (this.chunks[0].length >= n) {
      const head = this.chunks[0];
      const bytes = head.subarray(0, n);
      if (head.length === n) this.chunks.shift();
      else this.chunks[0] = head.subarray(n);
      this.available -= n;
      sink?.(bytes);
      return { bytes, contiguous: true };
    }
    const out = new Uint8Array(n);
    let off = 0;
    while (off < n) {
      const c = this.chunks[0];
      const take = Math.min(n - off, c.length);
      const piece = c.subarray(0, take);
      sink?.(piece);
      out.set(piece, off);
      off += take;
      if (take === c.length) this.chunks.shift();
      else this.chunks[0] = c.subarray(take);
    }
    this.available -= n;
    this.stats.reassemblyCopies++;
    return { bytes: out, contiguous: false };
  }
}

function decode(tag: number, payload: Uint8Array, contiguous: boolean): Frame {
  switch (tag) {
    case TAG.OPEN: {
      const [operationId, streamId] = new TextDecoder().decode(payload).split(' ');
      return { t: 'open', handle: { operationId, streamId } };
    }
    case TAG.BATCH:
      return { t: 'batch', payload, contiguous };
    case TAG.PROGRESS: {
      const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
      return {
        t: 'progress',
        progress: {
          // Integers, never JSON floats (ADR-004 amendment 1).
          batches: Number(dv.getBigUint64(0)),
          bytes: Number(dv.getBigUint64(8)),
          total: Number(dv.getBigUint64(16)),
        },
      };
    }
    case TAG.TERMINAL: {
      const detail = new TextDecoder().decode(payload.subarray(1));
      return {
        t: 'terminal',
        terminal: { kind: TERMINAL_KINDS[payload[0]] ?? 'TransportFailed', detail },
      };
    }
    default:
      return {
        t: 'terminal',
        terminal: { kind: 'DecodeFailed', detail: `unknown frame tag ${tag}` },
      };
  }
}
