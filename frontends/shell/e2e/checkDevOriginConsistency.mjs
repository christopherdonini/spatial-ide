#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// ADR-020 Amendment 1, design (b), rewritten 2026-09-08 (the human's ruling on
// `DECISIONS-PENDING.md` entry 55 = "(b)"): `frontends/shell/src-tauri/src/lib.rs` no longer
// carries ANY copy of the dev-server port -- in dev mode, the data plane's expected origin is
// derived from `tauri.conf.json`'s own `build.devUrl` directly (`origin::expected_origin_from_config`,
// the config mirror -- never a runtime read of the webview, and never a hardcoded literal in
// `lib.rs`). That removes the THIRD of ADR-020's three named copies (`vite.config.ts`,
// `tauri.conf.json`'s `devUrl`, `lib.rs`); it does not remove the other two, which still have to
// agree with each other for `tauri dev` to work at all (`vite.config.ts` binds the dev server to
// `server.port`; `tauri.conf.json` `build.devUrl` is what Tauri points the webview at, AND is now
// the literal value the config mirror pins as `expected_origin` in dev mode -- hand-written as a
// URL whose own port is a second copy of the same number). Nothing before this script made that
// agreement anything but a convention a human could silently break. This check is now load-bearing
// for BOTH Tauri's own webview navigation AND the shell's data-plane origin pin -- a drift here
// used to only misdirect the webview (before this rewrite, the origin selector read the webview's
// own actual URL back, so it pinned whatever origin the webview landed on, correct or not); now the
// config mirror pins `tauri.conf.json`'s own `build.devUrl` origin directly, so the SAME drift means
// Tauri navigates the webview to that pinned origin and finds nothing serving it there (architect
// A1) -- a broken dev session, not a data-plane upgrade that gets attempted and 403s.
//
// This IS the "mechanical link" ADR-020 Amendment 1's preregistration (design (b)) requires: read
// both real config files, fail loudly if they disagree -- and, per the reviewer gate on the first
// version of this script, fail loudly (not silently pick a wrong number) when the read itself is
// AMBIGUOUS, not only when the two numbers plainly differ. The first version used `String.match`,
// which returns only the FIRST regex match in the file, comments included: a real `port: 5181`
// alongside an unrelated comment containing the text `server: { port: 5180 }` would have made this
// script silently read 5180 (the comment) and report a false PASS. `readVitePort` below uses
// `matchAll` and REQUIRES there be exactly one match; two or more (ambiguous -- which one is real?)
// or zero (the pattern no longer matches at all) both throw, loudly, rather than picking one.
//
// Chosen over a vitest unit test, and following `check:dist-clean`'s own precedent (`e2e/
// checkDistClean.mjs`) rather than adding a new kind of check: this asserts a relationship between
// two CONFIG FILES, neither of which is application source under test, so it is a `check:*` npm
// script reading real files (not synthetic fixtures) and wired into `npm run verify`'s pipeline like
// `check:dist-clean` is, independent of `npm test`'s vitest run (unit tests over source, not config).
// It does not evaluate `vite.config.ts` as JS/TS (no dynamic import, no code execution) -- a static
// text read for the `server: { port: <number> }` shape, the same "read the real artifact as text"
// idiom `check:dist-clean` already uses on `dist/`. This is a best-effort textual check, not a full
// parser: it cannot rule out every conceivable way a human could construct an ambiguous file (e.g. a
// SECOND real `server: { port: ... }` object nested somewhere unrelated); "exactly one match" is the
// guarantee it makes, not "the one match found is semantically the config Vite will actually use".
//
// `tauri.conf.json`'s own `build.devUrl` is parsed with the platform `URL` global (not string-matched
// like `vite.config.ts`, since `tauri.conf.json` is real JSON, trivially and exactly parseable) --
// its own scheme and hostname are read FROM devUrl itself, not hardcoded here as a fourth copy of
// "http://localhost": what is actually cross-checked against `vite.config.ts` is only the PORT
// component (the one number `vite.config.ts` independently declares; `vite.config.ts`'s `server`
// object never names a hostname at all, so asserting one here would be asserting something neither
// file actually declares as shared).

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const VITE_CONFIG_PATH = join(SHELL_DIR, "vite.config.ts");
const TAURI_CONFIG_PATH = join(SHELL_DIR, "src-tauri", "tauri.conf.json");

function readVitePort() {
  const text = readFileSync(VITE_CONFIG_PATH, "utf8");
  // `server: { port: 5180, ... }` -- a literal integer, not an expression. `matchAll` (not `match`,
  // which silently returns only the first hit) scans the WHOLE file, so a stray comment shaped like
  // `server: { port: <n> }` produces a SECOND match rather than silently winning over the real one.
  const matches = [...text.matchAll(/server:\s*{[^}]*?\bport:\s*(\d+)/gs)];
  if (matches.length !== 1) {
    throw new Error(
      `checkDevOriginConsistency: expected exactly one "server: { port: <number> }" match in ` +
        `${VITE_CONFIG_PATH}, found ${matches.length} -- ` +
        (matches.length === 0
          ? "the pattern this script expects may have changed; update the regex alongside it."
          : "an ambiguous file (e.g. a comment shaped like the real config, or a second server " +
            "block): this script cannot tell which match is authoritative without a human " +
            "deciding, so it refuses rather than silently picking the first one.")
    );
  }
  return Number(matches[0][1]);
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
  const devUrlRaw = readTauriDevUrl();

  let devUrl;
  try {
    devUrl = new URL(devUrlRaw);
  } catch (e) {
    console.error(
      `checkDevOriginConsistency: FAIL -- tauri.conf.json's build.devUrl ("${devUrlRaw}") is not a ` +
        `parseable URL (${e.message}).`
    );
    process.exitCode = 1;
    return;
  }

  // devUrl's own port, read from devUrl itself (`URL.port` is `""` when the URL carries no explicit
  // port at all -- `Number("")` is `0`, never equal to a real `vite.config.ts` port, so that case
  // fails the comparison below rather than being silently coerced into a false match).
  const devUrlPort = devUrl.port === "" ? null : Number(devUrl.port);

  if (devUrlPort !== port) {
    console.error(
      `checkDevOriginConsistency: FAIL -- vite.config.ts's server.port (${port}) does not match ` +
        `tauri.conf.json's build.devUrl ("${devUrlRaw}")'s own port (${devUrl.port || "(none)"}). ` +
        "These two copies of the dev-server port have drifted -- ADR-020 Amendment 1's config " +
        "mirror still pins tauri.conf.json's own build.devUrl origin (unaffected by this drift, " +
        "since it reads that value directly), and Tauri navigates the webview TO that same pinned " +
        "origin -- but Vite is not actually listening there (it is listening on vite.config.ts's " +
        "own, different port), so the webview finds nothing serving that origin: a broken dev " +
        "session (the page fails to load), not a data-plane upgrade that gets attempted and " +
        "refused. This check catches the drift before a human hits it at runtime, since neither " +
        "half fails loudly by itself."
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `checkDevOriginConsistency: PASS -- vite.config.ts's server.port (${port}) matches ` +
      `tauri.conf.json's build.devUrl ("${devUrlRaw}")'s own port.`
  );
}

main();
