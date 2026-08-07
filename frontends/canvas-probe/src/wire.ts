// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Binary framing, consumer side. Mirrors `protocol/data-plane/src/wire.rs`.
 *
 * Layout, both directions: `[u8 tag][3 reserved zero bytes][u32 big-endian len][payload]`. Every
 * frame is fixed-layout binary; no JSON crosses the data channel in either direction.
 *
 * The prefix is 8 bytes so payloads start 8-byte aligned, which is what lets Arrow hand out buffer
 * *views* instead of realigning copies. Whether that holds for **this** payload shape — variable
 * width GeoArrow, not the bake-off's fixed-width columns — is measured at run time by
 * `geoarrow.ts`, not assumed from the earlier measurement.
 */

import {
  TERMINAL_KINDS,
  UNKNOWN_TOTAL,
  UNKNOWN_TOTAL_WIRE,
  type DecoderStats,
  type Frame,
} from './transport.js';

export const TAG = { OPEN: 0x0f, BATCH: 0x10, PROGRESS: 0x11, TERMINAL: 0x12 } as const;
export const CTRL = { CREDIT: 0x01, CANCEL: 0x02, START: 0x03 } as const;
export const FRAME_PREFIX_LEN = 8;

export function controlFrame(tag: number, payload = new Uint8Array(0)): Uint8Array {
  const out = new Uint8Array(FRAME_PREFIX_LEN + payload.length);
  out[0] = tag;
  new DataView(out.buffer).setUint32(4, payload.length, false);
  out.set(payload, FRAME_PREFIX_LEN);
  return out;
}

/**
 * The START payload: `[u16 op_len][op][u32 params_len][params]`, where params are
 * `[u8 flags][u16+dataset][u16+crs][4 x f64 bits][u64 limit]`.
 *
 * **Viewport edges cross as IEEE-754 bit patterns**, never as decimal or JSON numbers: ADR-004
 * amendment 1 measured 1-ULP drift on JSON floats crossing the webview boundary, and a viewport
 * edge that moves by 1 ULP silently changes which features are selected.
 */
export function startFrame(
  operation: string,
  req: { dataset: string; bbox?: [number, number, number, number]; bboxCrs?: string; limit?: number },
): Uint8Array {
  const enc = new TextEncoder();
  const op = enc.encode(operation);
  const dataset = enc.encode(req.dataset);
  const crs = enc.encode(req.bboxCrs ?? '');

  let flags = 0;
  if (req.bbox) flags |= 0b01;
  if (req.limit !== undefined) flags |= 0b10;

  const paramsLen =
    1 + 2 + dataset.length + 2 + crs.length + (req.bbox ? 32 : 0) + (req.limit !== undefined ? 8 : 0);
  const params = new Uint8Array(paramsLen);
  const pv = new DataView(params.buffer);
  let at = 0;
  params[at++] = flags;
  pv.setUint16(at, dataset.length, false);
  at += 2;
  params.set(dataset, at);
  at += dataset.length;
  pv.setUint16(at, crs.length, false);
  at += 2;
  params.set(crs, at);
  at += crs.length;
  if (req.bbox) {
    for (const v of req.bbox) {
      // setFloat64 writes the IEEE-754 bit pattern; the producer reads it back with from_bits.
      pv.setFloat64(at, v, false);
      at += 8;
    }
  }
  if (req.limit !== undefined) {
    pv.setBigUint64(at, BigInt(req.limit), false);
    at += 8;
  }

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
 * Streaming frame decoder.
 *
 * Holds a queue of delivered chunks and materializes a contiguous payload only when a frame
 * actually spans a boundary — and records that it had to, because a copy that is not counted is a
 * copy that gets assumed away (ADR-004: "measured and minimized, not assumed absent").
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
        return [{ t: 'terminal', terminal: { kind: 'DecodeFailed', detail: this.fault } }];
      }
      const total = FRAME_PREFIX_LEN + len;
      // A frame whose declared length has not arrived is incomplete, never complete-so-far. This is
      // what makes a truncated tail a detectable fault instead of a short-but-plausible stream.
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

/** A frame this consumer could not decode, reported inside the shared terminal taxonomy. */
function malformed(detail: string): Frame {
  return { t: 'terminal', terminal: { kind: 'DecodeFailed', detail } };
}

function decode(tag: number, payload: Uint8Array, contiguous: boolean): Frame {
  switch (tag) {
    case TAG.OPEN: {
      const [operationId, streamId] = new TextDecoder().decode(payload).split(' ');
      // Both ids or neither. Without this a malformed OPEN yields `streamId === undefined` and
      // every later log line and artifact silently records a handle that is half missing.
      if (!operationId || !streamId) {
        return malformed(`OPEN frame did not carry both ids (${payload.byteLength} B)`);
      }
      return { t: 'open', handle: { operationId, streamId } };
    }
    case TAG.BATCH:
      return { t: 'batch', payload, contiguous };
    case TAG.PROGRESS: {
      // The frame's own length is validated by the decoder; the *payload's* fixed layout is not,
      // and reading past it throws a bare `RangeError` from `DataView` rather than a typed
      // outcome. Three big-endian u64s is 24 bytes, and anything shorter is a malformed frame.
      if (payload.byteLength < 24) {
        return malformed(`PROGRESS payload is ${payload.byteLength} B, expected 24`);
      }
      const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
      // Integers, never JSON floats (ADR-004 amendment 1). The unknown-total sentinel is compared
      // as a BigInt *before* any narrowing — `u64::MAX` is not exactly representable as a JS
      // number, so comparing after conversion would rely on two roundings agreeing.
      const totalRaw = dv.getBigUint64(16);
      return {
        t: 'progress',
        progress: {
          batches: Number(dv.getBigUint64(0)),
          bytes: Number(dv.getBigUint64(8)),
          total: totalRaw === UNKNOWN_TOTAL_WIRE ? UNKNOWN_TOTAL : Number(totalRaw),
        },
      };
    }
    case TAG.TERMINAL: {
      if (payload.byteLength < 1) return malformed('TERMINAL frame carried no outcome code');
      const kind = TERMINAL_KINDS[payload[0]];
      const detail = new TextDecoder().decode(payload.subarray(1));
      // An unrecognised code is a frame this consumer could not decode — not a transport failure.
      // Reporting it as `TransportFailed` would attribute a version or framing mismatch to the
      // socket and send the next reader looking in the wrong place.
      if (kind === undefined) {
        return malformed(`unknown terminal code ${payload[0]}${detail ? `: ${detail}` : ''}`);
      }
      return { t: 'terminal', terminal: { kind, detail } };
    }
    default:
      return malformed(`unknown frame tag ${tag}`);
  }
}
