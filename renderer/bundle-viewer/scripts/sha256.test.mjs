// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The viewer's SHA-256 is pinned against an independent implementation.
//
// It is the whole basis of `asset-hash-mismatch`. A wrong one would either pass corrupted assets —
// silently, which is the failure mode the verification exists to prevent — or fail valid bundles,
// which trains a reader to ignore the banner. Neither is detectable by looking at the viewer.
//
// So it is checked against Node's own `crypto`, over the FIPS 180-4 vectors and over pseudo-random
// buffers at every length around the 64-byte block boundary and the 512 KiB chunk boundary, which
// is where an incremental implementation goes wrong if it is going to.

import { createHash } from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';

import { importModule } from './bundle-for-test.mjs';

const { Sha256, sha256Prefixed, HASH_CHUNK_BYTES } = await importModule('src/sha256.ts');

const reference = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('the published FIPS 180-4 vectors', () => {
  const cases = [
    ['', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    ['abc', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
    [
      'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq',
      '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1',
    ],
  ];
  for (const [input, expected] of cases) {
    const h = new Sha256();
    h.update(new TextEncoder().encode(input));
    assert.equal(h.digestHex(), expected, `vector ${JSON.stringify(input)}`);
  }
});

test('a million repeated `a` — the vector that catches a broken length field', () => {
  // The 64-bit big-endian bit count is where an incremental hasher usually breaks, and it only
  // shows up once the message is long enough for the high bits to matter.
  const h = new Sha256();
  const chunk = new Uint8Array(1000).fill(0x61);
  for (let i = 0; i < 1000; i++) h.update(chunk);
  assert.equal(h.digestHex(), 'cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0');
});

test('every length across the block boundary agrees with node:crypto', () => {
  // Deterministic bytes, not random ones: a failure has to be reproducible.
  const source = new Uint8Array(600);
  for (let i = 0; i < source.length; i++) source[i] = (i * 131 + 7) & 0xff;
  for (let n = 0; n <= 600; n++) {
    const slice = source.subarray(0, n);
    const h = new Sha256();
    h.update(slice);
    assert.equal(h.digestHex(), reference(slice), `length ${n}`);
  }
});

test('feeding in arbitrary splits gives the same digest as feeding it whole', () => {
  const source = new Uint8Array(4096);
  for (let i = 0; i < source.length; i++) source[i] = (i * 97 + 13) & 0xff;
  const whole = reference(source);
  for (const split of [1, 2, 63, 64, 65, 127, 128, 1000, 4095]) {
    const h = new Sha256();
    for (let o = 0; o < source.length; o += split) {
      h.update(source.subarray(o, Math.min(o + split, source.length)));
    }
    assert.equal(h.digestHex(), whole, `split ${split}`);
  }
});

test('the chunked, yielding wrapper agrees across the chunk boundary and prefixes its output', async () => {
  // The wrapper is what the viewer actually calls, and it yields to the event loop between chunks.
  // A bug in the chunk arithmetic would only appear above one chunk.
  for (const n of [0, 1, HASH_CHUNK_BYTES - 1, HASH_CHUNK_BYTES, HASH_CHUNK_BYTES + 1]) {
    const bytes = new Uint8Array(n);
    for (let i = 0; i < n; i++) bytes[i] = (i * 31 + 5) & 0xff;
    const got = await sha256Prefixed(bytes);
    assert.equal(got, `sha256:${reference(bytes)}`, `length ${n}`);
  }
});

test('progress is reported so a long verification is not silent', async () => {
  // ADR-010 rule 7: a long-running operation reports progress, and its silence is detectable.
  const bytes = new Uint8Array(HASH_CHUNK_BYTES * 3);
  const seen = [];
  await sha256Prefixed(bytes, (done) => seen.push(done));
  assert.equal(seen.length, 3);
  assert.equal(seen[seen.length - 1], bytes.length);
});
