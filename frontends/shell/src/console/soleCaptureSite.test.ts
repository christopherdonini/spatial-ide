// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * NEXT-CUT.md I1: one capture site. `skp/client.ts::call()` is the only place outside this module
 * (and its own tests) permitted to import `console/recorder` -- every other module must not reach
 * around the choke point. Same shape as `frontends/shell/src-tauri/tests/sole_caller_scan.rs`'s
 * scan (a line-oriented text scan of `import` statements) and
 * `admission/noCut2Language.test.ts`'s walk-and-grep over `src/`.
 *
 * Line-oriented, so an unusual import style (a dynamic `import()`, a dotted alias) could defeat
 * it -- same limit the `sole_caller_scan.rs` header states about itself.
 */
const SRC_DIR = path.resolve(__dirname, "../../src");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function isAllowedImporter(fileRelToSrc: string): boolean {
  const normalized = fileRelToSrc.replace(/\\/g, "/");
  if (normalized.startsWith("console/")) return true;
  if (normalized === "skp/client.ts") return true;
  if (/\.test\.tsx?$/.test(normalized)) return true;
  return false;
}

describe("console/recorder has exactly one capture site (NEXT-CUT.md I1)", () => {
  it("every import of console/recorder outside the console module is skp/client.ts or a test file", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC_DIR)) {
      if (!/\.tsx?$/.test(file)) continue;
      const rel = path.relative(SRC_DIR, file);
      const text = fs.readFileSync(file, "utf-8");
      const lines = text.split("\n");
      lines.forEach((line, i) => {
        const code = line.trim();
        if (code.startsWith("//") || code.startsWith("*") || code.startsWith("/*")) return;
        // Matches `from "./recorder"`, `from "../console/recorder"`, etc. -- any specifier whose
        // last path segment is `recorder` (with or without an extension).
        const importsRecorder =
          /\bimport\b[^;]*\bfrom\s+["'][^"']*\/recorder(?:\.ts)?["']/.test(line) ||
          /\brequire\(\s*["'][^"']*\/recorder(?:\.ts)?["']\s*\)/.test(line);
        if (importsRecorder && !isAllowedImporter(rel)) {
          offenders.push(`${rel}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });

  it("skp/client.ts really does import console/recorder -- the scan above would otherwise prove nothing", () => {
    const clientPath = path.join(SRC_DIR, "skp/client.ts");
    const text = fs.readFileSync(clientPath, "utf-8");
    expect(text).toMatch(/\bimport\b[^;]*\bfrom\s+["'][^"']*\/recorder(?:\.ts)?["']/);
  });
});
