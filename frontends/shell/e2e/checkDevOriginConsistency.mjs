#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// ADR-020 Amendment 1, design (b): `frontends/shell/src-tauri/src/lib.rs` no longer carries ANY
// copy of the dev-server port -- it derives the data plane's expected origin at runtime from the
// webview's own URL (`origin.rs`'s `expected_origin_from_url`), never from a hardcoded literal. That
// removes the THIRD of ADR-020's three named copies (`vite.config.ts`, `tauri.conf.json`'s `devUrl`,
// `lib.rs`); it does not remove the other two, which still have to agree with each other for
// `tauri dev` to work at all (`vite.config.ts` binds the dev server to `server.port`; `tauri.conf.json`
// `build.devUrl` is what Tauri points the webview at, hand-written as a second copy of the same
// number wrapped in a URL). Nothing before this script made that agreement anything but a convention
// a human could silently break.
//
// This IS the "mechanical link" ADR-020 Amendment 1's preregistration (design (b)) requires: read
// both real config files, fail loudly if they disagree.
//
// Chosen over a vitest unit test, and following `check:dist-clean`'s own precedent (`e2e/
// checkDistClean.mjs`) rather than adding a new kind of check: this asserts a relationship between
// two CONFIG FILES, neither of which is application source under test, so it is a `check:*` npm
// script reading real files (not synthetic fixtures) and wired into `npm run verify`'s pipeline like
// `check:dist-clean` is, independent of `npm test`'s vitest run (unit tests over source, not config).
// It does not evaluate `vite.config.ts` as JS/TS (no dynamic import, no code execution) -- a static
// text read for the `server: { port: <number> }` shape, the same "read the real artifact as text"
// idiom `check:dist-clean` already uses on `dist/`.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const VITE_CONFIG_PATH = join(SHELL_DIR, "vite.config.ts");
const TAURI_CONFIG_PATH = join(SHELL_DIR, "src-tauri", "tauri.conf.json");

function readVitePort() {
  const text = readFileSync(VITE_CONFIG_PATH, "utf8");
  // `server: { port: 5180, ... }` -- a literal integer, not an expression. If a future edit turns
  // this into a computed value, this regex stops matching and the script fails loudly (below)
  // rather than silently reading a stale or wrong number.
  const match = text.match(/server:\s*{[^}]*?\bport:\s*(\d+)/s);
  if (!match) {
    throw new Error(
      `checkDevOriginConsistency: could not find "server: { port: <number> }" in ${VITE_CONFIG_PATH} -- ` +
        "the pattern this script expects may have changed; update the regex alongside it."
    );
  }
  return Number(match[1]);
}

function readTauriDevUrl() {
  const config = JSON.parse(readFileSync(TAURI_CONFIG_PATH, "utf8"));
  const devUrl = config?.build?.devUrl;
  if (typeof devUrl !== "string") {
    throw new Error(`checkDevOriginConsistency: ${TAURI_CONFIG_PATH} has no build.devUrl string`);
  }
  return devUrl;
}

function main() {
  const port = readVitePort();
  const devUrl = readTauriDevUrl();
  const expected = `http://localhost:${port}`;

  if (devUrl !== expected) {
    console.error(
      `checkDevOriginConsistency: FAIL -- vite.config.ts's server.port (${port}) implies dev origin ` +
        `"${expected}", but tauri.conf.json's build.devUrl is "${devUrl}". These two copies of the dev ` +
        "origin have drifted -- tauri dev's webview would not land on the port Vite is actually " +
        "listening on, and ADR-020 Amendment 1's runtime-derived expected_origin would then pin " +
        "whatever wrong origin the webview actually got, not fail loudly by itself."
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `checkDevOriginConsistency: PASS -- vite.config.ts's server.port (${port}) and tauri.conf.json's ` +
      `build.devUrl ("${devUrl}") agree.`
  );
}

main();
