// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Tauri expects a fixed dev-server port (tauri.conf.json's devUrl) and needs to know the app is
// running inside its own webview so HMR doesn't fight the host's own reload.
//
// Port 5180, not Tauri's default 1420: 1420 falls inside this machine's Windows excluded-port
// range (1335-1434, confirmed via `netsh interface ipv4 show excludedportrange protocol=tcp`), so
// binding it fails. Same finding the ADR-003 spike hit and worked around (spikes/adr-003-crs-rendering).

// RELEASE-0.1 item 9 / ADR-030 candidate (a): the npm packages actually compiled into
// `frontends/shell/dist`, enumerated from a real build manifest -- never a hand-kept list. Verified
// before writing this (see the piece's own report), in that order: `build.manifest: true` writes
// `dist/.vite/manifest.json`, which records entry/chunk/import relationships (which CHUNK imports
// which other chunk/asset), not which npm PACKAGES were compiled in -- insufficient alone, and not
// used here. This tiny inline plugin instead reads each emitted chunk's own `modules` map (Rollup's
// `RenderedChunk.modules`, populated by the time `generateBundle` -- a late, post-bundle hook --
// runs) for module ids under `node_modules/`, and writes a metafile SHAPED like esbuild's own
// metafile (`{ inputs: { "node_modules/<pkg>/…": {} } }`) to `frontends/shell/dist-metafile.json`
// (gitignored via the root `.gitignore`'s existing bare `dist-metafile.json` pattern; a SIBLING of
// `dist/`, never inside it, the same placement `renderer/bundle-viewer/build.mjs` already uses for
// its own metafile and for the same reason -- a file inside `dist/` becomes a shipped artifact).
// `renderer/bundle-viewer/notice.mjs`'s existing `extractPackages` reads this shape unchanged --
// already exercised by every published bundle -- so no new extraction logic is needed on the
// consuming side, and no new npm dependency is added here: Vite/Rollup are already this package's
// own build tool.
//
// **Why a late hook, not `resolveId`/`load`:** the SET of node_modules ids in `chunk.modules` is
// only complete once Rollup has finished building every chunk (tree-shaking can drop an import
// entirely; a hook earlier in the pipeline could report a module that never actually ends up in
// the shipped output). `generateBundle` runs once, after chunking, before files are written to
// disk -- the same point-in-time esbuild's own `metafile: true` output describes.
function packageMetafilePlugin(): Plugin {
  return {
    name: "spatial-ide-package-metafile",
    generateBundle(_options, bundle) {
      const inputs: Record<string, Record<string, never>> = {};
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") continue;
        for (const id of Object.keys(output.modules ?? {})) {
          // Rollup's own module ids are absolute filesystem paths; made relative to this
          // package's own root (`process.cwd()` when `vite build` runs, always
          // `frontends/shell` under this repository's own npm scripts) so the key matches
          // esbuild's own metafile convention exactly -- forward-slashed, relative to the
          // build's own working directory, never an absolute path. This metafile is a SIBLING
          // of `dist/` and is never shipped (it is not a bundle asset and no packaging step
          // copies it), but it is read by a generator whose output IS shipped and whose
          // rebuilds ADR-017 §12 requires to be byte-identical -- so an absolute path here
          // would make a hashed artifact depend on where the build was invoked from, the same
          // reasoning `renderer/bundle-viewer/notice.mjs:131-136` states for its own reads.
          //
          // **FIRST `node_modules/`, not the last (release-cut fix batch, SHOULD-FIX 6).**
          // `lastIndexOf` on a NESTED path
          // (`node_modules/command-line-usage/node_modules/array-back/…`) sliced away the
          // nesting prefix and emitted the key `node_modules/array-back/…`, so the consumer
          // (`notice.mjs`'s `extractPackages`) resolved and read the TOP-LEVEL `array-back`
          // instead -- a different version's notice, or `ENOENT` and a degraded line, for the
          // copy actually compiled in. Slicing from the FIRST occurrence keeps the whole
          // nested path, which is exactly what `extractPackages` (itself `lastIndexOf`-based,
          // correctly, ON that full key) needs to land on the nested copy.
          const rel = relative(process.cwd(), id).replace(/\\/g, "/");
          const withinRoot = rel.replace(/^(?:\.\.\/)+/, "");
          const at = withinRoot.indexOf("node_modules/");
          if (at === -1) continue;
          if (withinRoot !== rel) {
            // A third-party module resolved from OUTSIDE this package's own root. Its key would
            // be attributed to `frontends/shell`'s own `node_modules` tree by every consumer of
            // this metafile (`notice.mjs` resolves each set's packages against that set's own
            // `baseDir`), which is a wrong-tree read of exactly the class MUST-FIX 1 fixed --
            // and silently wrong, since a same-named package usually exists there too. Refused.
            throw new Error(
              `packageMetafilePlugin: module id ${id} resolves OUTSIDE this package's root ` +
                `(${process.cwd()}) yet lives under node_modules/. This metafile's keys are ` +
                "resolved against frontends/shell by every consumer, so attributing it here " +
                "would read the wrong node_modules tree. Vendor it, or give this set its own " +
                "metafile entry with its own baseDir."
            );
          }
          inputs[withinRoot.slice(at)] = {};
        }
      }
      writeFileSync(resolve(process.cwd(), "dist-metafile.json"), JSON.stringify({ inputs }), "utf8");
    },
  };
}

export default defineConfig(async () => ({
  plugins: [react(), packageMetafilePlugin()],
  clearScreen: false,
  server: {
    port: 5180,
    strictPort: true,
    watch: {
      // Never watch the Rust side; a `cargo build` touching `target/` must not trigger a Vite reload.
      ignored: ["**/src-tauri/**"],
    },
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri's bundled webview (WebView2 on Windows) needs a modern target; matches the spike's own
    // choice for the same reason.
    target: "esnext",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
}));
