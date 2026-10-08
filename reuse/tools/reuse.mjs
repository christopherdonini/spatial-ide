#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
// Query the Spatial IDE reuse index before planning a new implementation.
// No dependencies. Usage:
//   node tools/reuse.mjs <words...>        one line per matching capability
//   node tools/reuse.mjs --full <words...> details: summary, licences, dependency status, paths, open decisions
//   node tools/reuse.mjs --list            every capability, one line each
//   node tools/reuse.mjs --licence-watch   licence traps recorded so far
//   node tools/reuse.mjs --json <words...> matching entries as JSON
//   --index <path>                         another index file (default: ../reuse-index.json beside this script)
// Exit status: 0 if something matched, 1 if nothing did (research before planning), 2 on a usage error.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--") && a !== "--index"));
let indexPath = join(dirname(fileURLToPath(import.meta.url)), "..", "reuse-index.json");
const words = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--index") {
    indexPath = args[++i];
    if (!indexPath) usage("--index needs a path");
  } else if (!args[i].startsWith("--")) {
    words.push(args[i].toLowerCase());
  }
}
const known = new Set(["--full", "--list", "--json", "--licence-watch", "--license-watch", "--help"]);
for (const f of flags) if (!known.has(f)) usage(`unknown flag ${f}`);
if (flags.has("--help")) usage();

const index = JSON.parse(readFileSync(indexPath, "utf8"));
if (index.schema !== "spatial-reuse-index") usage(`${indexPath} is not a spatial-reuse-index`);
const caps = index.capabilities;

if (flags.has("--licence-watch") || flags.has("--license-watch")) {
  for (const w of index.licence_watch ?? []) console.log(`${w.id}: ${w.summary}\n  evidence: ${w.evidence}\n`);
  process.exit(0);
}

const line = (c) =>
  `capability: ${c.id} → ` +
  c.candidates.map((k) => `${k.name} [${k.mode}${k.dependency?.startsWith("new") ? ", new dependency: human's word" : ""}]`).join(", ") +
  `   (${c.register}, ${c.priority}${c.status === "closed-by-measurement" ? ", closed by measurement" : ""})`;

if (flags.has("--list")) {
  for (const c of caps) console.log(line(c));
  process.exit(0);
}
if (words.length === 0) usage("give some words to search for, or --list");

// Score: word hits in id, aliases and title count most; candidate names and the summary count less.
// A word matches a token exactly, or as a prefix when it has at least four letters ("label" → "labels"),
// never inside another word ("table" does not match "stable").
const tokens = (s) => s.toLowerCase().split(/[^a-z0-9+#]+/).filter(Boolean);
const hit = (toks, w) => toks.some((t) => t === w || (w.length >= 4 && t.startsWith(w)));
function score(c) {
  let s = 0;
  const strongText = [c.id, c.title, ...c.aliases].join(" ").toLowerCase();
  const strong = tokens(strongText);
  const weak = tokens([c.summary, ...c.candidates.map((k) => `${k.name} ${k.repo}`)].join(" "));
  const phrase = words.join(" ");
  if (words.length > 1 && (strongText.includes(phrase) || c.id === words.join("-"))) s += 10;
  let strongHits = 0;
  for (const w of words.flatMap(tokens)) {
    if (hit(strong, w)) { s += 3; strongHits++; }
    else if (hit(weak, w)) s += 1;
    else return 0; // every query word must appear somewhere in the entry
  }
  return strongHits > 0 ? s : 0; // and at least one in its id, title or aliases
}
const hits = caps
  .map((c) => [score(c), c])
  .filter(([s]) => s >= Math.max(2, words.flatMap(tokens).length))
  .sort((a, b) => b[0] - a[0])
  .map(([, c]) => c);

if (hits.length === 0) {
  console.log(`No prior art recorded for "${words.join(" ")}". Research it before planning an implementation.`);
  process.exit(1);
}
if (flags.has("--json")) {
  console.log(JSON.stringify(hits, null, 2));
  process.exit(0);
}
for (const c of hits) {
  console.log(line(c));
  if (!flags.has("--full")) continue;
  console.log(`  ${c.title}`);
  console.log(`  plan: ${c.plan_nodes.join(", ") || "none"} · status: ${c.status} · register: ${c.register}`);
  console.log(`  ${c.summary}`);
  for (const k of c.candidates) {
    console.log(`  - ${k.name} (${k.repo} @ ${k.commit || "?"}) ${k.mode} · ${k.license} [${k.license_class}]` +
      (k.dependency ? ` · dependency: ${k.dependency}` : ""));
    if (k.paths?.length) console.log(`      paths: ${k.paths.join(", ")}`);
    console.log(`      ${k.note}`);
  }
  for (const d of c.decisions_for_human) console.log(`  decision for the human: ${d}`);
  console.log(`  evidence: ${c.evidence}\n`);
}
process.exit(0);

function usage(msg) {
  if (msg) console.error(`reuse.mjs: ${msg}`);
  console.error("usage: node tools/reuse.mjs [--full|--json] <words...> | --list | --licence-watch [--index <path>]");
  process.exit(2);
}
