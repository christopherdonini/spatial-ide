// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, UA5: `openDataset` has one importer,
 * `admission/admitDataset.ts` (the only open), and `admitDataset` has one importer, `AdmissionPanel.tsx`. The scan
 * reads every non-test file under `src/` for import and export specifiers (comments removed first) and the names
 * each one brings in; a type-only name such as `Admitted` is not `admitDataset`. A namespace import of `skp/client`
 * would hide a name from this scan, so the second test holds that none exists outside the files named there.
 */
const SRC_DIR = path.resolve(__dirname, "..");
const STATEMENT = /\b(?:import|export)\s+(?:type\s+)?([^;'"]*?)\s*from\s*["']([^"']+)["']/g;

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

/** `[file relative to src, resolved module relative to src without extension, imported names]` for every specifier. */
function importsOf(file: string, text = fs.readFileSync(file, "utf8")): Array<[string, string, string[]]> {
  const rel = path.relative(SRC_DIR, file).replace(/\\/g, "/");
  const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  return [...code.matchAll(STATEMENT)]
    .filter((m) => m[2].startsWith("."))
    .map((m): [string, string, string[]] => [
      rel,
      path.relative(SRC_DIR, path.resolve(path.dirname(file), m[2])).replace(/\\/g, "/"),
      m[1].replace(/[{}]/g, "").split(",").map((n) => n.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0]).filter(Boolean),
    ]);
}

const importers = (module: string, name: string, files: string[]): string[] =>
  files.flatMap((f) => importsOf(f)).filter(([, mod, names]) => mod === module && names.includes(name)).map(([rel]) => rel).sort();

// RECORDED MUTATION for "UA5": add `import { openDataset } from "./skp/client";` to App.tsx.
// Expected failure: the importers list names App.tsx beside admission/admitDataset.ts.
// OBSERVED AT deab7dc96d06bf3e329527d3ae95415dcd65152b: FAILED -- "openDataset has one importer": AssertionError: expected [ 'App.tsx', …(1) ] to deeply equal
//   [ 'admission/admitDataset.ts' ] (the received list names App.tsx). Reverted after observing.
describe("UA5: openDataset is imported only by admission/admitDataset.ts, and admitDataset only by AdmissionPanel", () => {
  const files = sourceFiles(SRC_DIR);

  it("found the shell's source files -- otherwise this scan proves nothing", () => {
    expect(files.map((f) => path.relative(SRC_DIR, f).replace(/\\/g, "/"))).toEqual(
      expect.arrayContaining(["App.tsx", "admission/AdmissionPanel.tsx", "admission/admitDataset.ts", "skp/client.ts"])
    );
  });

  it("openDataset has one importer", () => {
    expect(importers("skp/client", "openDataset", files)).toEqual(["admission/admitDataset.ts"]);
  });

  it("admitDataset has one importer", () => {
    expect(importers("admission/admitDataset", "admitDataset", files)).toEqual(["admission/AdmissionPanel.tsx"]);
  });

  it("no namespace import of skp/client hides a name from the scan", () => {
    const namespaced = files.filter((f) => /\bimport\s+\*\s+as\s+\w+\s+from\s*["'][^"']*skp\/client["']/.test(fs.readFileSync(f, "utf8")));
    expect(namespaced.map((f) => path.relative(SRC_DIR, f).replace(/\\/g, "/"))).toEqual([]);
  });
});
