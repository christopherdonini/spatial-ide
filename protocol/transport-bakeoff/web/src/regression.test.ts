// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Consumer-side regression coverage for README §16.7's R-table.
 *
 * These must pass before any Phase-2 measurement is admissible. They exist because every one of
 * them is a way a stream can go wrong *while still looking fine* — which is the failure mode this
 * whole harness keeps rediscovering (F4's 98-of-100 silent truncation being the live precedent).
 *
 * Run with `npm test` (esbuild-bundled, executed under node).
 */

import { Sha256Stream } from './sha256.js';
import { FrameDecoder, TAG, FRAME_PREFIX_LEN } from './wire.js';
import type { Frame } from './transport.js';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    console.error(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
    failures++;
  }
}

function frame(tag: number, payload: Uint8Array): Uint8Array {
  const out = new Uint8Array(FRAME_PREFIX_LEN + payload.length);
  out[0] = tag;
  new DataView(out.buffer).setUint32(4, payload.length, false);
  out.set(payload, FRAME_PREFIX_LEN);
  return out;
}

/** A frame whose declared length lies about its payload. */
function lyingFrame(tag: number, declaredLen: number, actual: Uint8Array): Uint8Array {
  const out = new Uint8Array(FRAME_PREFIX_LEN + actual.length);
  out[0] = tag;
  new DataView(out.buffer).setUint32(4, declaredLen, false);
  out.set(actual, FRAME_PREFIX_LEN);
  return out;
}

console.log('R1 — byte-length mismatch');
{
  // Declares 4096 bytes, delivers 10. The decoder must emit nothing: a frame is complete only when
  // its declared length has actually arrived.
  const d = new FrameDecoder();
  const frames = d.push(lyingFrame(TAG.BATCH, 4096, new Uint8Array(10)));
  check('short frame yields no batch', frames.length === 0, `got ${frames.length}`);

  // And the shortfall must never be reported as a completed stream.
  const d2 = new FrameDecoder();
  const all: Frame[] = [];
  all.push(...d2.push(frame(TAG.BATCH, new Uint8Array(64))));
  all.push(...d2.push(lyingFrame(TAG.BATCH, 4096, new Uint8Array(3))));
  check(
    'only the complete frame is emitted',
    all.filter((f) => f.t === 'batch').length === 1,
    `got ${all.filter((f) => f.t === 'batch').length}`,
  );
}

console.log('R2 — checksum mismatch');
{
  // A single flipped byte anywhere in the payload must change the digest. This is the mechanism
  // behind H1's corpus-identity check, so it is verified rather than assumed.
  const payload = new Uint8Array(100_000);
  for (let i = 0; i < payload.length; i++) payload[i] = (i * 31) & 0xff;
  const a = new Sha256Stream();
  a.update(payload);
  const clean = a.digest();

  const corrupted = payload.slice();
  corrupted[54_321] ^= 0x01;
  const b = new Sha256Stream();
  b.update(corrupted);
  check('one flipped byte changes the digest', b.digest() !== clean);

  // Chunk-wise feeding must produce the identical digest — otherwise the streaming hasher and the
  // manifest could disagree for reasons unrelated to corruption.
  const c = new Sha256Stream();
  for (let i = 0; i < payload.length; i += 7919) c.update(payload.subarray(i, i + 7919));
  check('chunk-wise digest equals one-shot', c.digest() === clean);
}

console.log('R3 — partial / truncated terminal frame');
{
  // A terminal frame cut in half must not resolve. A stream that ends here has no terminal, which
  // is exactly what the adapters report as TransportFailed rather than as a short stream.
  const term = frame(TAG.TERMINAL, new Uint8Array([0]));
  const d = new FrameDecoder();
  const half = term.subarray(0, term.length - 1);
  const frames = d.push(half);
  check('truncated terminal does not resolve', frames.length === 0, `got ${frames.length}`);

  // Completing it later does resolve — the decoder is patient, not broken.
  const rest = d.push(term.subarray(term.length - 1));
  check('completing the frame resolves it', rest.length === 1 && rest[0].t === 'terminal');
}

console.log('R5 — oversized message, past the declared ceiling');
{
  const d = new FrameDecoder();
  d.maxFrameBytes = 1024; // declared low so the test can drive past it
  const frames = d.push(lyingFrame(TAG.BATCH, 4096, new Uint8Array(8)));
  const t = frames[0];
  check(
    'over-ceiling frame is rejected at the limit',
    frames.length === 1 && t.t === 'terminal' && t.terminal.kind === 'DecodeFailed',
    JSON.stringify(frames.map((f) => f.t)),
  );
  check('decoder records the fault', d.fault !== null);
  check('decoder stops after a fault', d.push(frame(TAG.BATCH, new Uint8Array(8))).length === 0);
}

console.log('Framing invariants relied on by the copy measurement');
{
  // The 8-byte prefix exists so Arrow payloads land 8-byte aligned; if that ever stopped holding,
  // the buffer-sharing result would change for reasons nothing else would report.
  const d = new FrameDecoder();
  const body = new Uint8Array(80);
  const out = d.push(frame(TAG.BATCH, body));
  const f = out[0];
  check('batch emitted', f?.t === 'batch');
  if (f?.t === 'batch') {
    check('payload is 8-byte aligned', f.payload.byteOffset % 8 === 0, `offset ${f.payload.byteOffset}`);
    check('payload length preserved', f.payload.length === body.length);
    check('single-chunk frame needs no reassembly', f.contiguous === true);
  }

  // Split across chunk boundaries: same payload, but reassembly is counted rather than hidden.
  const d2 = new FrameDecoder();
  const whole = frame(TAG.BATCH, body);
  const acc: Frame[] = [];
  for (let i = 0; i < whole.length; i += 13) acc.push(...d2.push(whole.subarray(i, i + 13)));
  const g = acc[0];
  check('split frame still emitted once', acc.filter((x) => x.t === 'batch').length === 1);
  if (g?.t === 'batch') {
    check('reassembled payload is 8-byte aligned', g.payload.byteOffset % 8 === 0);
    check('reassembly is counted', d2.stats.reassemblyCopies === 1, `${d2.stats.reassemblyCopies}`);
    check('reassembled frame is marked non-contiguous', g.contiguous === false);
  }

  // The hash sink must see the frame's bytes in order, without a contiguous copy existing first.
  const d3 = new FrameDecoder();
  const seen = new Sha256Stream();
  let sunkBytes = 0;
  d3.onBatchBytes = (s) => {
    sunkBytes += s.length;
    seen.update(s);
  };
  for (let i = 0; i < whole.length; i += 13) d3.push(whole.subarray(i, i + 13));
  const direct = new Sha256Stream();
  direct.update(whole);
  check('sink saw every frame byte', sunkBytes === whole.length, `${sunkBytes}/${whole.length}`);
  check('sink digest equals the frame digest', seen.digest() === direct.digest());
}

console.log(failures === 0 ? '\nregression: PASS' : `\nregression: FAILED (${failures})`);
// Signal failure without exiting: the runner has further suites to execute, and exiting here would
// silently skip them — a green run that never ran the analysis coverage at all.
if (failures) process.exitCode = 1;
