// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, UC9: nothing under `src/command/` imports from `skp/`, `streaming/`, `residency/` or `canvas/`.
 * This is milestone 1's U4 scan (`layout/layoutBoundary.test.ts`) over this directory. It reads each non-test source file's import specifiers (static,
 * dynamic and re-export forms) and resolves each against `src/`: direct imports only, not transitive ones. Test files are excluded because this one names
 * the directories to assert their absence.
 */
const COMMAND_DIR = __dirname;
const SRC_DIR = path.resolve(__dirname, "..");
const FORBIDDEN_DIRS = ["skp", "streaming", "residency", "canvas"];

const SPECIFIER =
  /\b(?:import|export)\b[^;'"]*?\bfrom\s*["']([^"']+)["']|\bimport\s*["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)|\brequire\s*\(\s*["']([^"']+)["']\s*\)/g;

function commandSourceFiles(): string[] {
  return fs
    .readdirSync(COMMAND_DIR)
    .filter((name) => /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name))
    .sort();
}

function forbiddenImports(file: string): string[] {
  const text = fs.readFileSync(path.join(COMMAND_DIR, file), "utf8");
  const offenders: string[] = [];
  for (const match of text.matchAll(SPECIFIER)) {
    const specifier = match[1] ?? match[2] ?? match[3] ?? match[4];
    if (!specifier.startsWith(".")) continue;
    const relative = path.relative(SRC_DIR, path.resolve(COMMAND_DIR, specifier)).replace(/\\/g, "/");
    if (FORBIDDEN_DIRS.includes(relative.split("/")[0])) offenders.push(`command/${file} imports ${specifier}`);
  }
  return offenders;
}

// RECORDED MUTATION for "UC9": add `import "../skp/client";` to commandDraft.ts. Expected failure: the scan names the file and the specifier.
describe("UC9: nothing under src/command/ imports from skp/, streaming/, residency/ or canvas/", () => {
  it("UC9: no command source file has a forbidden import, and the scan found the command source files", () => {
    expect(commandSourceFiles(), "the scan found nothing to prove anything about").toEqual(expect.arrayContaining(["commandDraft.ts", "commandConstants.ts"]));
    const offenders = commandSourceFiles().flatMap(forbiddenImports);
    expect(offenders).toEqual([]);
  });
});
