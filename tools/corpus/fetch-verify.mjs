#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Fetch-and-verify for the compatibility corpus (tools/corpus/MANIFEST.json). Node standard
 * library only. Fails closed:
 *   - an entry with no pinned sha256 is refused, never fetched and never "verified";
 *   - a download is fetched from its one `url` only, redirects refused, no other source tried;
 *   - bytes whose sha256 differs from the manifest are never written to --out;
 *   - a writer-produced entry is only ever hash-checked where it already sits in --out.
 * Exit 0 only when every selected entry verified.
 *
 *   node tools/corpus/fetch-verify.mjs --out <corpus-root> [--all | --id '#11' ...]
 *
 * Default selection: the entries marked "ci": true. Behind a proxy, Node's fetch honours
 * HTTPS_PROXY only with NODE_USE_ENV_PROXY=1 (Node >= 22.21).
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
function values(flag) {
  const out = [];
  for (let i = 0; i < args.length; i++) if (args[i] === flag && i + 1 < args.length) out.push(args[++i]);
  return out;
}
const outDir = values('--out')[0];
if (!outDir) {
  console.error("usage: fetch-verify.mjs --out <corpus-root> [--all | --id '#11' ...]");
  process.exit(2);
}
const manifestPath = join(dirname(fileURLToPath(import.meta.url)), 'MANIFEST.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const ids = values('--id');
const selected = manifest.files.filter((f) =>
  ids.length > 0 ? ids.includes(f.id) : args.includes('--all') || f.ci === true,
);
const unknown = ids.filter((id) => !manifest.files.some((f) => f.id === id));
if (unknown.length > 0) {
  console.error(`unknown id(s): ${unknown.join(', ')}`);
  process.exit(2);
}

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const isPinned = (h) => typeof h === 'string' && /^[0-9a-f]{64}$/.test(h);

async function verifyOne(f) {
  if (!isPinned(f.sha256)) return `REFUSED  no pinned sha256 (prefix only: ${f.sha256_prefix_recorded ?? 'none'})`;
  const target = resolve(outDir, f.path);
  if (existsSync(target)) {
    const got = sha256(readFileSync(target));
    return got === f.sha256 ? 'OK       present, hash matches' : `MISMATCH present file hashes to ${got}`;
  }
  if (f.obtain?.kind !== 'download') {
    return `ABSENT   writer output (${f.pipeline}); not fetchable, regenerate or copy it into --out`;
  }
  let res;
  try {
    res = await fetch(f.obtain.url, { redirect: 'error' });
  } catch (e) {
    return `FAILED   fetch ${f.obtain.url}: ${e.cause?.message ?? e.message}`;
  }
  if (res.status !== 200) return `FAILED   HTTP ${res.status} from ${f.obtain.url}`;
  const bytes = Buffer.from(await res.arrayBuffer());
  const got = sha256(bytes);
  if (got !== f.sha256) return `MISMATCH downloaded bytes hash to ${got}; nothing written`;
  mkdirSync(dirname(target), { recursive: true });
  const tmp = `${target}.partial`;
  writeFileSync(tmp, bytes);
  renameSync(tmp, target);
  return `OK       fetched ${bytes.length} B, hash matches`;
}

let failed = 0;
for (const f of selected) {
  const line = await verifyOne(f);
  if (!line.startsWith('OK')) failed++;
  console.log(`${f.id.padEnd(4)} ${line}  ${f.path}`);
}
console.log(`${selected.length - failed}/${selected.length} verified`);
process.exit(failed === 0 && selected.length > 0 ? 0 : 1);
