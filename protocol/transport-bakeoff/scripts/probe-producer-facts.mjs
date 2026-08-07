#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Out-of-band probe: the producer-side facts Phase 2's browser report does not carry.
 *
 * Why this exists: §16.4 requires the result artifact to contain "the **actual** memory-sampling
 * cadence, not the intended one" — §15.8 item 4 recorded Phase 1 sampling at ~62.6 ms against a
 * declared 50 ms. The producer records that (`ProducerFacts.sample_gaps_us`, plus memory and
 * resident-payload samples) and serves it from `/facts/{stream_id}`, but the Phase 2 consumer never
 * fetches it: `phase2.ts` does not read the stream id out of the OPEN frame, so no Phase 2 artifact
 * contains producer memory, producer-resident bytes, or the sampling cadence at all.
 *
 * Rather than assert the gap or edit the harness after the gate, this drives the real endpoints
 * from outside and reads the producer's own record.
 *
 * SCOPE, stated because it bounds every number this prints: **Candidate B (loopback HTTP) only.**
 * Node's global WebSocket client cannot set an `Origin` header, so the WebSocket endpoint's
 * handshake check rejects it (by design — see `websocket_upgrade_rejects_bad_credentials_and_origins`).
 * The sampler itself is candidate-independent — `start_sampler` in main.rs is called from the shared
 * `start_stream` — so the CADENCE generalizes; the memory figures do not, and are labelled B-only.
 *
 * This is a separate server instance from any measured block, so it perturbs no block.
 *
 * Usage: node scripts/probe-producer-facts.mjs [S|M|L]
 */

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const config = (process.argv[2] ?? 'M').toUpperCase();
const exe = join(root, 'target', 'release', 'transport-bakeoff.exe');
if (!existsSync(exe)) {
  console.error(`missing ${exe} — run: cargo build --release`);
  process.exit(2);
}
const outDir = join(tmpdir(), 'transport-bakeoff');
const urlFile = join(outDir, 'launch-url.txt');

// No --launch: the launch-url file survives, which is how this probe gets the session token
// without the harness ever printing it (docs/09 — the token is redacted from logs).
const child = spawn(exe, ['--phase2', '--config', config], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
let out = '';
child.stdout.on('data', (d) => { out += d.toString(); process.stdout.write(d); });
child.stderr.on('data', (d) => { out += d.toString(); });

const deadline = Date.now() + 120_000;
while (!out.includes('listening on') && Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 250));
}
const port = out.match(/listening on http:\/\/127\.0\.0\.1:(\d+)/)?.[1];
const token = readFileSync(urlFile, 'utf8').split('#')[1]?.trim();
if (!port || !token) {
  console.error('could not obtain port/token');
  spawnSync('taskkill', ['/PID', String(child.pid), '/F', '/T']);
  process.exit(1);
}
const base = `http://127.0.0.1:${port}`;
const headers = { Authorization: `Bearer ${token}`, Origin: base };

// Consume one full HTTP stream, reading the stream id out of the OPEN frame exactly as the
// browser consumer does.
const res = await fetch(`${base}/stream/http`, { headers });
const reader = res.body.getReader();
let streamId = '';
let bytes = 0;
let pending = new Uint8Array(0);
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  bytes += value.length;
  if (!streamId) {
    const merged = new Uint8Array(pending.length + value.length);
    merged.set(pending); merged.set(value, pending.length);
    pending = merged;
    if (pending.length >= 8) {
      const len = (pending[4] << 24) | (pending[5] << 16) | (pending[6] << 8) | pending[7];
      if (pending[0] === 0x0f && pending.length >= 8 + len) {
        streamId = new TextDecoder().decode(pending.subarray(8, 8 + len)).split(' ')[1];
        pending = new Uint8Array(0);
      }
    }
  }
}
console.log(`\nconsumed ${bytes} bytes, stream ${streamId}`);

await new Promise((r) => setTimeout(r, 400));
const facts = await (await fetch(`${base}/facts/${streamId}`, { headers, cache: 'no-store' })).json();

const gaps = (facts.sample_gaps_us ?? []).map((g) => g / 1000);
const pct = (xs, p) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))] : NaN;
};
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const resident = (facts.resident_samples ?? []).map(([, b]) => b);

console.log(`\n=== producer facts, configuration ${config}, Candidate B (loopback HTTP) ===`);
console.log(`adapter                       ${facts.adapter}`);
console.log(`terminal                      ${JSON.stringify(facts.terminal)}`);
console.log(`batches generated             ${facts.batches_generated}`);
console.log(`bytes emitted                 ${facts.bytes_emitted}`);
console.log(`json frames on data path      ${facts.json_frames_on_data_path}`);
console.log(`wire digest                   ${facts.payload_sha256}`);
console.log(`column digest                 ${facts.column_sha256}`);
console.log(`\nmemory sampling — DECLARED 50 ms (§6), measured:`);
console.log(`  samples                     ${gaps.length}`);
console.log(`  gap mean / p50 / p95 / max  ${mean(gaps).toFixed(2)} / ${pct(gaps, 50).toFixed(2)} / ${pct(gaps, 95).toFixed(2)} / ${Math.max(...gaps).toFixed(2)} ms`);
console.log(`\nproducer memory (PrivateUsage, GetProcessMemoryInfo):`);
console.log(`  peak private commit         ${facts.peak_memory?.private_usage_bytes}`);
console.log(`  peak working set            ${facts.peak_memory?.peak_working_set_bytes}`);
console.log(`\nproducer-resident payload bytes (the H3/allocation-pressure counter):`);
console.log(`  max                         ${Math.max(...resident)}`);
console.log(`  declared bound              ${facts.declared_resident_bound_bytes}`);
console.log(`  samples                     ${resident.length}`);

spawnSync('taskkill', ['/PID', String(child.pid), '/F', '/T']);
