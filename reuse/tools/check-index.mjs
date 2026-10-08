#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
// Check reuse-index.json against its schema and the guardrails. No dependencies.
//   node tools/check-index.mjs [--index <path>]
// Exit 0 when clean, 1 with one line per problem.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const i = process.argv.indexOf("--index");
const path = i >= 0 ? process.argv[i + 1] : join(here, "..", "reuse-index.json");
const root = dirname(path);
const d = JSON.parse(readFileSync(path, "utf8"));
const problems = [];
const bad = (where, msg) => problems.push(`${where}: ${msg}`);

const MODES = new Set(["ADOPT", "WRAP", "VENDOR", "FORK", "PORT", "CONCEPTUAL", "BENCHMARK", "WATCH", "REJECT"]);
const REUSE = new Set(["ADOPT", "WRAP", "VENDOR", "FORK", "PORT"]);
const REFERENCE_ONLY = new Set(["red", "likely-incompatible"]);
const PRIORITIES = new Set(["P0", "P1", "P2", "P3", "WATCH"]);
const STATUSES = new Set(["researched", "catalogued", "closed-by-measurement"]);
const REGISTERS = new Set(["do-not-reinvent", "worth-owning", "open"]);
const classes = new Set(Object.keys(d.license_classes ?? {}));

if (d.schema !== "spatial-reuse-index") bad("index", "schema is not spatial-reuse-index");
const ids = new Set();
for (const c of d.capabilities ?? []) {
  const w = `capability ${c.id}`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id ?? "")) bad(w, "id is not kebab-case");
  if (ids.has(c.id)) bad(w, "duplicate id");
  ids.add(c.id);
  for (const k of ["title", "summary", "evidence", "track"]) if (!c[k]) bad(w, `missing ${k}`);
  if (!PRIORITIES.has(c.priority)) bad(w, `priority ${c.priority}`);
  if (!STATUSES.has(c.status)) bad(w, `status ${c.status}`);
  if (!REGISTERS.has(c.register)) bad(w, `register ${c.register}`);
  if (!Array.isArray(c.aliases) || c.aliases.length === 0) bad(w, "no aliases");
  const notes = (c.evidence ?? "").match(/notes\/[\w.-]+\.md/g) ?? [];
  for (const n of notes) if (!existsSync(join(root, n))) bad(w, `evidence file ${n} not found`);
  if (!c.candidates?.length) bad(w, "no candidates");
  for (const k of c.candidates ?? []) {
    const kw = `${w} / ${k.name}`;
    if (!MODES.has(k.mode)) bad(kw, `mode ${k.mode}`);
    if (!k.license) bad(kw, "licence not stated");
    if (!classes.has(k.license_class)) bad(kw, `licence class ${k.license_class}`);
    if (REFERENCE_ONLY.has(k.license_class) && REUSE.has(k.mode))
      bad(kw, `${k.license_class} licence is reference only, but mode is ${k.mode}`);
    if (REUSE.has(k.mode) && k.mode !== "PORT" && !k.dependency) bad(kw, "reuse mode without a dependency status");
    if (k.mode === "PORT" && !k.dependency) bad(kw, "PORT without its notice-route status");
    if (!k.note) bad(kw, "no note");
  }
}
if (problems.length) {
  console.log(problems.join("\n"));
  process.exit(1);
}
console.log(`ok: ${ids.size} capabilities, ${d.capabilities.reduce((n, c) => n + c.candidates.length, 0)} candidates`);
