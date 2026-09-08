#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// RELEASE-0.1 Amendment 3, item 2 ("Notice channel"): the built frontend `dist/` must actually
// carry the notice text `src/generated/NOTICE.txt` was generated from (`?raw`-imported and
// rendered by `src/notices/NoticesPanel.tsx`) -- three strings the notice's own obligations turn
// on, each asserted present somewhere in the built output, the same "grep dist/ after npm run
// build" discipline `e2e/checkDistClean.mjs` already established for a different property.
//
// RELEASE-0.1 item 9 / ADR-030 candidate (a): also checks that every npm package this package's
// OWN Vite build actually compiled in, and every Rust crate linked into the shell binary, appears
// BY NAME somewhere in the built `dist/` output -- not merely that `src/generated/NOTICE.txt` looks
// right in isolation, but that the shipped artifact itself carries no silently dropped name. Reads
// the same two build-manifest sources `scripts/generateNotice.mjs` does
// (`dist-metafile.json`/`rustCrateNotices.mjs`), rather than a second hand-kept list.
//
// Run via `npm run check:dist-notice`, wired into `npm run verify` beside `check:dist-clean`, AFTER
// `npm run build` (this workflow's own ordering, see `package.json`'s "verify").

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { collectLinkedCrates } from "./rustCrateNotices.mjs";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST_DIR = join(SHELL_DIR, "dist");
const SHELL_METAFILE_PATH = join(SHELL_DIR, "dist-metafile.json");

// Verbatim from `notice.mjs`'s own text (which is itself verbatim from `DEPENDENCY-LICENSES.md`'s
// "Third-party data terms" section for the EPSG acknowledgement/terms-URL pair) and from the
// installer section's corresponding-source route (entry 49 F-3's ruled `Url` route).
const REQUIRED_STRINGS = [
  "Geodetic Parameter Dataset, © IOGP",
  "https://epsg.org/terms-of-use.html",
  "https://github.com/christopherdonini/spatial-ide",
];

// Mirrors `notice.mjs`'s own `extractPackages` (same node_modules-boundary logic), applied here to
// this package's OWN Vite/Rollup metafile only -- not re-exported from notice.mjs to keep this
// check script's only import surface the Rust-crate collector, which genuinely has no other home.
function packageNamesFromMetafile(metafile) {
  const names = new Set();
  for (const input of Object.keys(metafile.inputs)) {
    const at = input.lastIndexOf("node_modules/");
    if (at === -1) continue;
    const rest = input.slice(at + "node_modules/".length).split("/");
    const name = rest[0].startsWith("@") ? `${rest[0]}/${rest[1]}` : rest[0];
    names.add(name);
  }
  return names;
}

function collectFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...collectFiles(full));
    } else if (/\.(js|mjs|css|html)$/i.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  if (!existsSync(DIST_DIR)) {
    console.error(
      `check:dist-notice: ${DIST_DIR} does not exist -- run "npm run build" first (this script runs AFTER it, see package.json's own "verify" ordering).`
    );
    process.exitCode = 1;
    return;
  }

  const files = collectFiles(DIST_DIR);
  const text = files.map((f) => readFileSync(f, "utf8")).join("\n");

  const missing = REQUIRED_STRINGS.filter((s) => !text.includes(s));
  if (missing.length > 0) {
    console.error(
      `check:dist-notice: FAIL -- the built dist/ is missing ${missing.length} required notice string(s):`
    );
    for (const s of missing) {
      console.error(`  ${JSON.stringify(s)}`);
    }
    console.error(
      "The shipped Notices view must carry the IOGP acknowledgement, the EPSG terms URL, and the installer's corresponding-source URL -- see notice.mjs and DEPENDENCY-LICENSES.md's \"Third-party data terms\" section."
    );
    process.exitCode = 1;
    return;
  }

  // RELEASE-0.1 item 9 / ADR-030 candidate (a): every npm package this build actually compiled in,
  // and every Rust crate linked into the shell binary, must appear by name in the shipped dist/
  // output -- the property `notice()`'s own third-party sections exist to guarantee, checked here
  // against the ARTIFACT rather than merely against the generator's own intermediate file.
  if (!existsSync(SHELL_METAFILE_PATH)) {
    console.error(
      `check:dist-notice: FAIL -- ${SHELL_METAFILE_PATH} does not exist. "npm run build" writes it ` +
        "(vite.config.ts's own packageMetafilePlugin); this check runs after it, see package.json's " +
        '"verify" ordering.'
    );
    process.exitCode = 1;
    return;
  }
  const shellMetafile = JSON.parse(readFileSync(SHELL_METAFILE_PATH, "utf8"));
  const npmNames = packageNamesFromMetafile(shellMetafile);
  const crateNames = new Set(collectLinkedCrates().map((c) => c.name));

  const missingNpm = [...npmNames].filter((n) => !text.includes(n));
  const missingCrates = [...crateNames].filter((n) => !text.includes(n));
  if (missingNpm.length > 0 || missingCrates.length > 0) {
    console.error(
      `check:dist-notice: FAIL -- the built dist/ does not name ${missingNpm.length} Vite package(s) ` +
        `and ${missingCrates.length} linked crate(s) it is supposed to enumerate:`
    );
    for (const n of missingNpm) console.error(`  npm package: ${n}`);
    for (const n of missingCrates) console.error(`  Rust crate:  ${n}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `check:dist-notice: PASS -- all ${REQUIRED_STRINGS.length} required notice strings, all ` +
      `${npmNames.size} Vite package name(s), and all ${crateNames.size} linked crate name(s) found ` +
      `across ${files.length} dist file(s).`
  );
}

main();
