#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Diagnostic: when does Arrow JS hand out a VIEW over the wire buffer, and when does it copy?
 *
 * Why this exists: Phase 2 configuration S recorded, for Candidate B, 884/1000 batches that needed
 * NO reassembly copy and yet shared the wire buffer 0 times, while the 116 reassembled batches
 * shared 116/116. That inverts the naive reading of the copy counter, so the mechanism has to be
 * established rather than guessed at — §7's stage 5 is a **live-asserted** stage and the §16.9
 * step-3 copies criterion rests on it.
 *
 * Hypothesis under test: sharing depends on the payload's absolute byte offset inside its
 * ArrayBuffer. A reassembled frame is a fresh allocation with the payload at offset 8 (aligned); a
 * contiguous frame is a subarray of a network chunk at whatever offset the previous frame left,
 * and once a chunk-spanning frame has left a non-multiple-of-8 residue, every later frame taken
 * from that chunk inherits the misalignment because the frame stride is itself a multiple of 8.
 *
 * Method: build one real Arrow IPC batch, place it at controlled byte offsets inside a larger
 * buffer, and check `column.toArray().buffer === payload.buffer` — the same identity test the
 * consumer makes per batch.
 *
 * Usage: node scripts/bench-arrow-alignment.mjs   (run from protocol/transport-bakeoff/web)
 */

import { Table, tableFromIPC, tableToIPC, vectorFromArray } from 'apache-arrow';

const ROWS = 10_000;
const e = new Float64Array(ROWS);
const n = new Float64Array(ROWS);
for (let i = 0; i < ROWS; i++) {
  e[i] = 2_600_000 + i;
  n[i] = 1_200_000 + i;
}
const table = new Table({ e: vectorFromArray(e), n: vectorFromArray(n) });
const ipc = tableToIPC(table, 'stream');
console.log(`one IPC stream batch: ${ipc.length} bytes`);

/** Places the IPC bytes at `offset` inside a fresh buffer and reports whether Arrow shared it. */
function sharesAt(offset) {
  const backing = new Uint8Array(offset + ipc.length + 64);
  backing.set(ipc, offset);
  const payload = backing.subarray(offset, offset + ipc.length);
  const t = tableFromIPC(payload);
  const col = t.getChild('e').toArray();
  return col.buffer === payload.buffer;
}

console.log('\npayload byteOffset   offset % 8   Arrow shares the wire buffer');
for (const off of [0, 1, 2, 4, 7, 8, 9, 12, 16, 24, 33, 40, 64, 65, 128, 244_600, 244_601]) {
  console.log(
    `${String(off).padEnd(21)}${String(off % 8).padEnd(13)}${sharesAt(off) ? 'YES (view)' : 'NO  (copied)'}`,
  );
}

// The two shapes the consumer actually produces, spelled out.
console.log('\nthe two shapes the Phase 2 consumer produces:');
console.log(
  `  reassembled frame  → fresh buffer, payload at offset 8      → ${sharesAt(8) ? 'shares' : 'copies'}`,
);
console.log(
  `  contiguous frame after a misaligned residue (offset 8+3)    → ${sharesAt(11) ? 'shares' : 'copies'}`,
);
