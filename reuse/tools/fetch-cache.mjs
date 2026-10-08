#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
// Rebuild the local cache of researched repositories, each pinned at the commit Round 1 read.
// No dependencies; needs git 2.24 or later on PATH. Works on Windows, macOS and Linux.
//
//   node tools/fetch-cache.mjs --dest <dir>                  fetch every entry of repos.lock.json into <dir>
//   node tools/fetch-cache.mjs --dest <dir> --track j-table  only the entries a track used
//   node tools/fetch-cache.mjs --dry-run                     validate the lock and list what would be fetched
//   --lock <file>                                            another lock file (default: ../repos.lock.json)
// <dir> may also come from SPATIAL_REUSE_CACHE. It must lie outside every git repository, so third-party
// code can never be committed by accident.
//
// The lock file is untrusted input. Before any git call, every entry is validated:
//   - url: https:// on a fixed list of hosts, a plain owner/repo path, nothing else in it;
//   - commit: exactly 40 lowercase hex digits;
//   - name: one directory name, no path separator, no "..";
//   - filter: from a fixed set; sparse patterns, tracks and every other string: no leading "-";
//   - no key outside the lock's schema.
// An entry that fails is refused by name, and nothing is fetched while any entry is refused.
// Every git call passes --end-of-options before its values, disables the ext and file transports
// (GIT_ALLOW_PROTOCOL=https and protocol.{ext,file}.allow=never), never prompts, skips LFS smudging and
// checks symlinks out as plain files. The cache is read with rg, never built or run, never committed.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ALLOWED_HOSTS = new Set(["github.com", "gitlab.com"]);
const ALLOWED_FILTERS = new Set(["blob:none"]);
const ENTRY_KEYS = new Set(["url", "commit", "tracks", "sparse", "cone", "size_mb", "filter", "name"]);
const HEX40 = /^[0-9a-f]{40}$/;
const NAME = /^[A-Za-z0-9_@+][A-Za-z0-9._@+-]*$/;
const SEGMENT = /^[A-Za-z0-9_][A-Za-z0-9._-]*$/;
const TRACK = /^[a-z0-9][a-z0-9-]*$/;

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const KNOWN_FLAGS = new Set(["--dest", "--track", "--lock", "--dry-run"]);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
for (let i = 0; i < args.length; i++) {
  if (!KNOWN_FLAGS.has(args[i])) usage(`unknown argument ${JSON.stringify(args[i])}`);
  if (args[i] !== "--dry-run") {
    if (args[i + 1] === undefined || args[i + 1].startsWith("-")) usage(`${args[i]} needs a value`);
    i++;
  }
}
const destArg = opt("--dest") ?? process.env.SPATIAL_REUSE_CACHE;
const track = opt("--track");
const dry = args.includes("--dry-run");
if (track !== undefined && !TRACK.test(track)) usage(`--track ${JSON.stringify(track)} is not a track name`);
const lockPath = resolve(opt("--lock") ?? join(here, "..", "repos.lock.json"));

// ---- 1. Validate the whole lock before any git call.
let lock;
try {
  lock = JSON.parse(readFileSync(lockPath, "utf8"));
} catch (e) {
  usage(`cannot read ${lockPath}: ${e.message}`);
}
if (lock?.schema !== "spatial-reuse-cache-lock" || !Array.isArray(lock.repos)) usage(`${lockPath} is not a spatial-reuse-cache-lock`);

function validate(r, i) {
  const why = [];
  if (r === null || typeof r !== "object" || Array.isArray(r)) return { label: `entry #${i}`, why: ["not an object"] };
  const label = typeof r.name === "string" && NAME.test(r.name) && !r.name.includes("..") ? r.name : `entry #${i} (name ${JSON.stringify(r.name)})`;
  for (const k of Object.keys(r)) if (!ENTRY_KEYS.has(k)) why.push(`unknown key ${JSON.stringify(k)}`);
  // No string anywhere in the entry may start with "-" (option injection), or hold a control character.
  const walk = (v, where) => {
    if (typeof v === "string") {
      if (v.startsWith("-")) why.push(`${where} starts with "-"`);
      if (/[\u0000-\u001f\u007f]/.test(v)) why.push(`${where} holds a control character`);
    } else if (Array.isArray(v)) v.forEach((x, j) => walk(x, `${where}[${j}]`));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${where}.${k}`);
  };
  walk(r, "entry");
  // name: one directory name.
  if (typeof r.name !== "string" || !NAME.test(r.name) || r.name.includes("..") || /[\\/:]/.test(r.name))
    why.push("name must be one directory name: letters, digits, . _ @ + -, no path separator, no \"..\"");
  // url: https on an allowed host, a plain owner/repo path and nothing else.
  let u = null;
  try {
    u = new URL(r.url);
  } catch {
    why.push("url does not parse");
  }
  if (u) {
    const segs = u.pathname.split("/").slice(1);
    if (u.protocol !== "https:") why.push(`url scheme ${u.protocol} is not https:`);
    if (!ALLOWED_HOSTS.has(u.hostname)) why.push(`url host ${u.hostname} is not one of ${[...ALLOWED_HOSTS].join(", ")}`);
    if (u.username || u.password || u.port || u.search || u.hash) why.push("url carries credentials, a port, a query or a fragment");
    if (segs.length < 2 || segs.some((s) => !SEGMENT.test(s) || s === "." || s === ".."))
      why.push("url path must be owner/repo segments of letters, digits, . _ -");
    if (`https://${u.hostname}${u.pathname}` !== r.url) why.push("url is not in canonical form");
  }
  if (typeof r.commit !== "string" || !HEX40.test(r.commit)) why.push("commit must be exactly 40 lowercase hex digits");
  if (!ALLOWED_FILTERS.has(r.filter)) why.push(`filter ${JSON.stringify(r.filter)} is not one of ${[...ALLOWED_FILTERS].join(", ")}`);
  if (!Array.isArray(r.tracks) || r.tracks.length === 0 || !r.tracks.every((t) => typeof t === "string" && TRACK.test(t)))
    why.push("tracks must be a non-empty list of track names");
  if (r.sparse !== null && r.sparse !== undefined) {
    if (!Array.isArray(r.sparse) || r.sparse.length === 0) why.push("sparse must be null or a non-empty list");
    else
      for (const p of r.sparse)
        if (typeof p !== "string" || p === "" || p.split("/").includes("..")) why.push(`sparse pattern ${JSON.stringify(p)} is not allowed`);
    if (typeof r.cone !== "boolean") why.push("cone must be true or false when sparse is set");
  } else if (r.cone !== null && r.cone !== undefined) why.push("cone must be null when sparse is not set");
  if (r.size_mb !== undefined && !(Number.isFinite(r.size_mb) && r.size_mb >= 0)) why.push("size_mb must be a non-negative number");
  return { label, why };
}

const refusals = lock.repos.map(validate).filter((v) => v.why.length);
const names = lock.repos.map((r) => r?.name);
for (const n of new Set(names.filter((n, i) => names.indexOf(n) !== i))) refusals.push({ label: String(n), why: ["name is used by more than one entry"] });
if (refusals.length) {
  for (const { label, why } of refusals) console.error(`REFUSED ${label}: ${why.join("; ")}`);
  console.error(`\nfetch-cache: ${refusals.length} lock entr${refusals.length === 1 ? "y" : "ies"} refused; nothing was fetched.`);
  process.exit(2);
}

const repos = lock.repos.filter((r) => !track || r.tracks.includes(track));
if (repos.length === 0) usage(`no entries${track ? ` for track ${track}` : ""}`);

if (dry) {
  for (const r of repos)
    console.log(`${r.name}  ${r.url} @ ${r.commit.slice(0, 10)}${r.sparse ? `  sparse: ${r.sparse.join(" ")}` : ""}`);
  console.log(`\n${repos.length} entries, all valid.`);
  process.exit(0);
}

// ---- 2. Git, locked down.
const GIT_ENV = {
  ...process.env,
  GIT_ALLOW_PROTOCOL: "https",
  GIT_TERMINAL_PROMPT: "0",
  GIT_LFS_SKIP_SMUDGE: "1",
};
const GIT_CFG = [
  "-c", "protocol.ext.allow=never",
  "-c", "protocol.file.allow=never",
  "-c", "core.symlinks=false",
  "-c", "advice.detachedHead=false",
];
const git = (cwd, ...a) => spawnSync("git", [...GIT_CFG, ...a], { cwd, encoding: "utf8", env: GIT_ENV });

const ver = git(here, "--version");
const m = /git version (\d+)\.(\d+)/.exec(ver.stdout ?? "");
if (!m || +m[1] < 2 || (+m[1] === 2 && +m[2] < 24)) usage("git 2.24 or later is required (for --end-of-options)");

if (!destArg) usage("give --dest <dir> (or set SPATIAL_REUSE_CACHE); it must be outside every git repository");
const dest = resolve(destArg);
let probe = dest;
while (!existsSync(probe) && dirname(probe) !== probe) probe = dirname(probe);
const top = git(probe, "rev-parse", "--show-toplevel");
if (top.status === 0) usage(`${dest} is inside the git repository ${top.stdout.trim()}; put the cache outside it`);
mkdirSync(dest, { recursive: true });

let fetched = 0, skipped = 0, failed = 0;
for (const r of repos) {
  const dir = join(dest, r.name);
  if (existsSync(join(dir, ".git")) && git(dir, "rev-parse", "--verify", "--end-of-options", "HEAD").stdout?.trim() === r.commit) {
    skipped++;
    continue;
  }
  mkdirSync(dir, { recursive: true });
  const steps = [
    ["init", "-q", "--end-of-options"],
    ["fetch", "-q", "--no-tags", "--no-recurse-submodules", "--depth", "1", `--filter=${r.filter}`, "--end-of-options", r.url, r.commit],
  ];
  if (r.sparse) steps.push(["sparse-checkout", "set", r.cone ? "--cone" : "--no-cone", "--end-of-options", ...r.sparse]);
  steps.push(["switch", "-q", "--detach", "--end-of-options", r.commit]);
  let ok = true;
  for (const s of steps) {
    const res = git(dir, ...s);
    if (res.status !== 0) {
      console.error(`FAILED ${r.name}: git ${s[0]} ${s[1] ?? ""}\n${(res.stderr ?? "").trim()}`);
      ok = false;
      break;
    }
  }
  if (ok && git(dir, "rev-parse", "--verify", "--end-of-options", "HEAD").stdout?.trim() !== r.commit) {
    console.error(`FAILED ${r.name}: HEAD is not the pinned commit after checkout`);
    ok = false;
  }
  ok ? fetched++ : failed++;
  if (ok) console.log(`fetched ${r.name}`);
}
console.log(`\n${fetched} fetched, ${skipped} already at their pin, ${failed} failed → ${dest}`);
process.exit(failed ? 1 : 0);

function usage(msg) {
  console.error(`fetch-cache: ${msg}`);
  console.error("usage: node tools/fetch-cache.mjs --dest <dir> [--track <name>] [--lock <file>] | --dry-run [--track <name>] [--lock <file>]");
  process.exit(2);
}
