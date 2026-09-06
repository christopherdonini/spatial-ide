#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Close-out fix piece (RESIDENCY-DEBT-1B.md's "Close-out fix piece F1 geometric protection + F2 the
// settled-partial voice"), E2E pre-committed test 7: "import `tilesCoveringBbox` from the shell's
// own module." A plain `node e2e/*.mjs` process cannot resolve this codebase's own TypeScript source
// directly -- confirmed live, not assumed, before writing this file:
//
//  1. `tsconfig.json`'s own `moduleResolution: "bundler"` (with `allowImportingTsExtensions: true`)
//     lets every file under `src/` import a sibling WITHOUT an extension (`from "./tileGridConstants"`,
//     never `from "./tileGridConstants.ts"`) -- a bundler-only resolution style Node's own ESM loader
//     does not perform (it requires an exact, resolvable specifier). A bare `import` of
//     `src/canvas/tileGrid.ts` from plain `node` throws `ERR_MODULE_NOT_FOUND` on that file's own
//     FIRST internal import.
//  2. Even a custom `node:module` resolve hook that appends a missing `.ts` extension only gets one
//     step further: Node's native TypeScript support (`--experimental-strip-types`, on by default in
//     this workspace's own Node 24) does purely SYNTACTIC erasure -- it cannot tell a named import is
//     type-only (`import { TILE_GRID_DIMENSIONS, TileGridLevel } from "./tileGridConstants"`, where
//     `TileGridLevel` is a `type` alias with no runtime binding) without full type information, and
//     throws `SyntaxError: ... does not provide an export named 'TileGridLevel'` at load time.
//
// `vite-node` (already a transitive devDependency of `vitest`, which this workspace's own `npm test`
// already depends on) is the SAME esbuild-backed transform Vite itself uses to serve `src/*.ts` to
// this project's dev server -- reusing it here, programmatically, loads the REAL shell module (never
// a hand-copied reimplementation) under plain `node`, with no change to this package's own npm
// scripts, `package.json`, or entry point (`node e2e/residency-harness.mjs` keeps working exactly as
// before; only a caller that explicitly imports and calls `loadShellModule` below pays this cost).

import { createServer } from "vite";
import { ViteNodeServer } from "vite-node/server";
import { ViteNodeRunner } from "vite-node/client";
import { installSourcemapsSupport } from "vite-node/source-map";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));

/** Cached across every `loadShellModule` call in this process -- one Vite dev server (middleware
 * mode, no HTTP listener bound) and one `ViteNodeRunner`, booted lazily on first use. Deliberately
 * NOT the project's own `vite.config.ts` (`configFile` omitted): the modules this loader exists for
 * (`canvas/tileGrid.ts`, `canvas/viewportBbox.ts`) are plain TypeScript math with no React/Tauri
 * dependency, and skipping the real project config avoids pulling in plugins (React JSX transform,
 * PostCSS, the Tauri plugin) this loader has no need of and that could fail outside a real dev/build
 * context. */
let runnerPromise = null;

async function getRunner() {
  if (!runnerPromise) {
    runnerPromise = (async () => {
      const server = await createServer({
        root: SHELL_DIR,
        optimizeDeps: { noDiscovery: true },
        server: { middlewareMode: true, hmr: false },
        logLevel: "error",
      });
      await server.pluginContainer.buildStart({});
      const node = new ViteNodeServer(server);
      installSourcemapsSupport({ getSourceMap: (source) => node.getSourceMap(source) });
      const runner = new ViteNodeRunner({
        root: server.config.root,
        base: server.config.base,
        fetchModule: (id) => node.fetchModule(id),
        resolveId: (id, importer) => node.resolveId(id, importer),
      });
      return { server, runner };
    })();
  }
  return runnerPromise;
}

/** Loads `relativeSrcPath` (e.g. `"src/canvas/tileGrid.ts"`, relative to `frontends/shell`, this
 * file's own grandparent directory) through the real Vite/esbuild transform this codebase's own dev
 * server and `vitest` already use -- returns the module's real exports object: the SAME functions
 * `vitest`'s own unit tests (e.g. `src/canvas/tileGrid.test.ts`) import, never a hand-copied
 * reimplementation. */
export async function loadShellModule(relativeSrcPath) {
  const { runner } = await getRunner();
  return runner.executeFile(join(SHELL_DIR, relativeSrcPath));
}

/** Closes the cached Vite server, if one was ever booted -- a short-lived CLI process (this file's
 * only real caller today) does not strictly need this (the OS reclaims it at exit), but a future
 * caller that imports `loadShellModule` repeatedly (e.g. a test file) can use this for a clean
 * shutdown between runs. */
export async function closeShellModuleLoader() {
  if (!runnerPromise) return;
  const { server } = await runnerPromise;
  await server.close();
  runnerPromise = null;
}
