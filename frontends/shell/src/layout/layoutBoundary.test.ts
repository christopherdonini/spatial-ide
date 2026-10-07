// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §4, U4: the layout reducer's boundary (§2.3 (a)).
 * Nothing under `src/layout/` imports from `skp/`, `streaming/`, `residency/` or `canvas/`: the layout
 * makes no SKP call, adds no history step and cannot reach the map's code. The scan reads each
 * non-test source file's import specifiers (static, dynamic and re-export forms) and resolves each
 * against `src/`; test files are excluded because this one names the directories to assert their
 * absence.
 */
const LAYOUT_DIR = __dirname;
const SRC_DIR = path.resolve(__dirname, "..");
const FORBIDDEN_DIRS = ["skp", "streaming", "residency", "canvas"];

const SPECIFIER =
  /\b(?:import|export)\b[^;'"]*?\bfrom\s*["']([^"']+)["']|\bimport\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)|\brequire\s*\(\s*["']([^"']+)["']\s*\)/g;

function layoutSourceFiles(): string[] {
  return fs
    .readdirSync(LAYOUT_DIR)
    .filter((name) => /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name))
    .sort();
}

function forbiddenImports(file: string): string[] {
  const text = fs.readFileSync(path.join(LAYOUT_DIR, file), "utf8");
  const offenders: string[] = [];
  for (const match of text.matchAll(SPECIFIER)) {
    const specifier = match[1] ?? match[2] ?? match[3] ?? match[4];
    if (!specifier.startsWith(".")) continue;
    const relative = path.relative(SRC_DIR, path.resolve(LAYOUT_DIR, specifier)).replace(/\\/g, "/");
    if (FORBIDDEN_DIRS.includes(relative.split("/")[0])) offenders.push(`layout/${file} imports ${specifier}`);
  }
  return offenders;
}

// RECORDED MUTATION for "U4": add `import "../skp/client";` to layoutState.ts. Expected failure: the scan
// names the file and the specifier.
// OBSERVED AT d19c84a6c455029a7ec4bdca077ac1e9295f8b8a: FAILED -- "no layout source file has a forbidden import":
//   AssertionError: expected [ 'layout/layoutState.ts imports ../skp/client' ] to deeply equal []
// Reverted after observing.
describe("U4: nothing under src/layout/ imports from skp/, streaming/, residency/ or canvas/", () => {
  it("found the layout's source files -- otherwise this scan proves nothing", () => {
    expect(layoutSourceFiles()).toEqual(expect.arrayContaining(["layoutState.ts", "actionRegistry.ts"]));
  });

  it("no layout source file has a forbidden import", () => {
    const offenders = layoutSourceFiles().flatMap(forbiddenImports);
    expect(offenders).toEqual([]);
  });
});
