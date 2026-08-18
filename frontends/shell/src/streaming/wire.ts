// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Binary framing, consumer side. Mirrors `protocol/data-plane/src/wire.rs`.
 *
 * Layout, both directions: `[u8 tag][3 reserved zero bytes][u32 big-endian len][payload]`. Every
 * frame is fixed-layout binary; no JSON crosses the data channel in either direction (ADR-004).
 *
 * Ported from `frontends/canvas-probe/src/wire.ts`, with one substantive change: `startFrame`
 * there encoded a `StreamParams`-shaped dataset/bbox/limit tuple, the raw-params path this shell
 * never takes. Here it carries only a ticket handle's ASCII bytes (ADR-019) -- the query was
 * already validated and bound to the ticket by `SkpHost.viewport_query` before any socket opens.
 */

import { TERMINAL_KINDS, UNKNOWN_TOTAL, UNKNOWN_TOTAL_WIRE, type DecoderStats, type Frame } from "./transport";

export const TAG = { OPEN: 0x0f, BATCH: 0x10, PROGRESS: 0x11, TERMINAL: 0x12 } as const;
export const CTRL = { CREDIT: 0x01, CANCEL: 0x02, START: 0x03 } as const;
export const FRAME_PREFIX_LEN = 8;

export function controlFrame(tag: number, payload: Uint8Array = new Uint8Array(0)): Uint8Array {
  const out = new Uint8Array(FRAME_PREFIX_LEN + payload.length);
  out[0] = tag;
  new DataView(out.buffer).setUint32(4, payload.length, false);
  out.set(payload, FRAME_PREFIX_LEN);
  return out;
}

/**
 * The START payload: `[u16 op_len][op][u32 params_len][params]`, where `params` is the ticket
 * handle's ASCII bytes and nothing else -- `kernel::EngineSourceFactory::create_from_ticket` parses
 * exactly this shape, and a `StreamParams`-encoded payload is refused deterministically because its
 * first byte can never be `s` (ADR-019).
 */
export function startFrame(operation: string, ticketHandle: string): Uint8Array {
  const enc = new TextEncoder();
  const op = enc.encode(operation);
  const params = enc.encode(ticketHandle);

  const payload = new Uint8Array(2 + op.length + 4 + params.length);
  const dv = new DataView(payload.buffer);
  dv.setUint16(0, op.length, false);
  payload.set(op, 2);
  dv.setUint32(2 + op.length, params.length, false);
  payload.set(params, 2 + op.length + 4);
  return controlFrame(CTRL.START, payload);
}

export function creditFrame(n: number): Uint8Array {
  const p = new Uint8Array(4);
  new DataView(p.buffer).setUint32(0, n, false);
  return controlFrame(CTRL.CREDIT, p);
}

export function cancelFrame(): Uint8Array {
  return controlFrame(CTRL.CANCEL);
}

/**
 * Streaming frame decoder. Holds a queue of delivered chunks and materializes a contiguous payload
 * only when a frame actually spans a delivery boundary -- and counts it, because a copy that is not
 * counted is a copy that gets assumed away (ADR-004: "measured and minimized, not assumed absent").
 */
export class FrameDecoder {
  private chunks: Uint8Array[] = [];
  private available = 0;
  readonly stats: DecoderStats = { reassemblyCopies: 0, jsonFramesSeen: 0 };

  /** Declared, not discovered (ADR-010 rule 6): a frame claiming more is rejected at the limit. */
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
      const len = ((prefix[4] << 24) | (prefix[5] << 16) | (prefix[6] << 8) | prefix[7]) >>> 0;
      if (len > this.maxFrameBytes) {
        this.fault = `frame declares ${len} bytes, over the declared ${this.maxFrameBytes} ceiling`;
        return [{ t: "terminal", terminal: { kind: "DecodeFailed", detail: this.fault } }];
      }
      const total = FRAME_PREFIX_LEN + len;
      if (this.available < total) break;
      const { bytes, contiguous } = this.take(total);
      const payload = bytes.subarray(FRAME_PREFIX_LEN);
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

  private take(n: number): { bytes: Uint8Array; contiguous: boolean } {
    if (this.chunks[0].length >= n) {
      const head = this.chunks[0];
      const bytes = head.subarray(0, n);
      if (head.length === n) this.chunks.shift();
      else this.chunks[0] = head.subarray(n);
      this.available -= n;
      return { bytes, contiguous: true };
    }
    const out = new Uint8Array(n);
    let off = 0;
    while (off < n) {
      const c = this.chunks[0];
      const take = Math.min(n - off, c.length);
      out.set(c.subarray(0, take), off);
      off += take;
      if (take === c.length) this.chunks.shift();
      else this.chunks[0] = c.subarray(take);
    }
    this.available -= n;
    this.stats.reassemblyCopies++;
    return { bytes: out, contiguous: false };
  }
}

function malformed(detail: string): Frame {
  return { t: "terminal", terminal: { kind: "DecodeFailed", detail } };
}

function decode(tag: number, payload: Uint8Array, contiguous: boolean): Frame {
  switch (tag) {
    case TAG.OPEN: {
      const [operationId, streamId] = new TextDecoder().decode(payload).split(" ");
      if (!operationId || !streamId) {
        return malformed(`OPEN frame did not carry both ids (${payload.byteLength} B)`);
      }
      return { t: "open", handle: { operationId, streamId } };
    }
    case TAG.BATCH:
      return { t: "batch", payload, contiguous };
    case TAG.PROGRESS: {
      if (payload.byteLength < 24) {
        return malformed(`PROGRESS payload is ${payload.byteLength} B, expected 24`);
      }
      const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
      const totalRaw = dv.getBigUint64(16);
      return {
        t: "progress",
        progress: {
          batches: Number(dv.getBigUint64(0)),
          bytes: Number(dv.getBigUint64(8)),
          total: totalRaw === UNKNOWN_TOTAL_WIRE ? UNKNOWN_TOTAL : Number(totalRaw),
        },
      };
    }
    case TAG.TERMINAL: {
      if (payload.byteLength < 1) return malformed("TERMINAL frame carried no outcome code");
      const kind = TERMINAL_KINDS[payload[0]];
      const detail = new TextDecoder().decode(payload.subarray(1));
      if (kind === undefined) {
        return malformed(`unknown terminal code ${payload[0]}${detail ? `: ${detail}` : ""}`);
      }
      return { t: "terminal", terminal: { kind, detail } };
    }
    default:
      return malformed(`unknown frame tag ${tag}`);
  }
}
