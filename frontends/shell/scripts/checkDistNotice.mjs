#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// RELEASE-0.1 Amendment 3, item 2 ("Notice channel"): the built frontend `dist/` must actually
// carry the notice text `src/generated/NOTICE.txt` was generated from (`?raw`-imported and
// rendered by `src/notices/NoticesPanel.tsx`) -- three strings the notice's own obligations turn
// on, each asserted present somewhere in the built output, the same "grep dist/ after npm run
// build" discipline `e2e/checkDistClean.mjs` already established for a different property.
//
// Run via `npm run check:dist-notice`, wired into `npm run verify` beside `check:dist-clean`.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST_DIR = join(SHELL_DIR, "dist");

// Verbatim from `notice.mjs`'s own text (which is itself verbatim from `DEPENDENCY-LICENSES.md`'s
// "Third-party data terms" section for the EPSG acknowledgement/terms-URL pair) and from the
// installer section's corresponding-source route (entry 49 F-3's ruled `Url` route).
const REQUIRED_STRINGS = [
  "Geodetic Parameter Dataset, © IOGP",
  "https://epsg.org/terms-of-use.html",
  "https://github.com/christopherdonini/spatial-ide",
];

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

  console.log(`check:dist-notice: PASS -- all ${REQUIRED_STRINGS.length} required notice strings found across ${files.length} dist file(s).`);
}

main();
