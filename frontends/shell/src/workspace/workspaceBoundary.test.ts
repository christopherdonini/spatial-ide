// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, UA6: the workspace's import rule (section 2.1(a)).
 * Nothing under `src/workspace/` imports React, `skp/client`, `streaming/`, `residency/` or `canvas/`, except
 * type-only imports of `AuthoritativeBbox`, `Filter`, `StyleState` and `Admitted`. The scan reads each non-test
 * source file's import and export specifiers (comments removed first); it proves direct imports only.
 */
const WORKSPACE_DIR = __dirname;
const SRC_DIR = path.resolve(__dirname, "..");
const TYPE_ONLY_ALLOWED = new Set(["AuthoritativeBbox", "Filter", "StyleState", "Admitted"]);
const STATEMENT =
  /\b(?:import|export)\s+(type\s+)?([^;'"]*?)\s*from\s*["']([^"']+)["']|\bimport\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)|\brequire\s*\(\s*["']([^"']+)["']\s*\)/g;

function workspaceSourceFiles(): string[] {
  return fs
    .readdirSync(WORKSPACE_DIR)
    .filter((name) => /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name))
    .sort();
}

function isForbidden(specifier: string): boolean {
  if (!specifier.startsWith(".")) return /^react(-dom)?(\/|$)/.test(specifier);
  const relative = path.relative(SRC_DIR, path.resolve(WORKSPACE_DIR, specifier)).replace(/\\/g, "/");
  return relative === "skp/client" || ["streaming", "residency", "canvas"].includes(relative.split("/")[0]);
}

function offendingImportsIn(file: string, source: string): string[] {
  const text = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  const offenders: string[] = [];
  for (const match of text.matchAll(STATEMENT)) {
    const specifier = match[3] ?? match[4] ?? match[5] ?? match[6];
    if (!isForbidden(specifier)) continue;
    const names = match[1] !== undefined ? match[2].replace(/[{}]/g, "").split(",").map((n) => n.trim().split(/\s+as\s+/)[0]) : null;
    if (names === null || !names.every((n) => TYPE_ONLY_ALLOWED.has(n))) offenders.push(`workspace/${file} imports ${specifier}`);
  }
  return offenders;
}

const offendingImports = (file: string): string[] =>
  offendingImportsIn(file, fs.readFileSync(path.join(WORKSPACE_DIR, file), "utf8"));

// RECORDED MUTATION for "UA6": add `import { unionBbox } from "../canvas/extent";` to workspaceState.ts.
// Expected failure: the scan names the file and the specifier.
describe("UA6: nothing under src/workspace/ imports React, skp/client, streaming/, residency/ or canvas/ but four types", () => {
  it("found the workspace's source files -- otherwise this scan proves nothing", () => {
    expect(workspaceSourceFiles()).toEqual(expect.arrayContaining(["workspaceState.ts", "viewTransitions.ts"]));
  });

  it("no workspace source file has a forbidden import", () => {
    expect(workspaceSourceFiles().flatMap(offendingImports)).toEqual([]);
  });

  it("the scan itself: a value import of a canvas module is an offender; a type-only import of Admitted is not", () => {
    expect(offendingImportsIn("sample.ts", `import { unionBbox } from "../canvas/extent";`)).toHaveLength(1);
    expect(offendingImportsIn("sample.ts", `import type { Admitted } from "../admission/admitDataset";`)).toEqual([]);
    expect(offendingImportsIn("sample.ts", `import { useReducer } from "react";`)).toHaveLength(1);
  });
});
