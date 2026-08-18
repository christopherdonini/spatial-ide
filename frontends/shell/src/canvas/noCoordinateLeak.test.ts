// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * ADR-010 rule 1, enforced as a scan rather than left to review: `info.coordinate` is a
 * renderer-local value with no CRS tag (see `PICKING.md`), and must never cross into product code.
 * The only permitted occurrences of accessing a `coordinate` property are this test file itself and
 * `PICKING.md`, which explains why.
 *
 * **Three access shapes, not one (S9, reviewer).** A plain `.includes(".coordinate")` substring
 * check only catches dot notation; `info["coordinate"]` and `const { coordinate } = info` read the
 * exact same field without ever spelling `.coordinate`. The word `coordinate` alone is deliberately
 * *not* the pattern -- this codebase's own doc comments use it constantly as English prose
 * ("authoritative coordinate", "unprojected pick coordinate"), and flagging every one of those would
 * make the scan noise a reviewer learns to ignore rather than a signal worth reading.
 */
const SRC_DIR = path.resolve(__dirname, "../../src");
const ALLOWED_FILES = new Set([
  path.resolve(__dirname, "PICKING.md"),
  path.resolve(__dirname, "noCoordinateLeak.test.ts"),
]);

const COORDINATE_ACCESS_PATTERNS: RegExp[] = [
  /\.coordinate\b/, // info.coordinate
  /\[\s*["']coordinate["']\s*\]/, // info["coordinate"] / info['coordinate']
  // Destructuring: `{ coordinate }` / `{ x, coordinate }` / `{ coordinate: x }`. Deliberately does
  // not cross a newline or a nested `{` -- this codebase's doc comments use "coordinate" as prose
  // constantly, and an unbounded scan to the next `}` (tried first) matched clean across an entire
  // multi-line comment to an unrelated later `,` or `}`, which is a false positive, not a finding.
  /\{[^\n{}]*\bcoordinate\b\s*[,:}]/,
];

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

describe("no info.coordinate leak (ADR-010 rule 1)", () => {
  it("no dot, bracket, or destructuring access to a `coordinate` property appears under src/", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC_DIR)) {
      if (ALLOWED_FILES.has(path.resolve(file))) continue;
      if (!/\.(ts|tsx)$/.test(file)) continue;
      const contents = fs.readFileSync(file, "utf-8");
      if (COORDINATE_ACCESS_PATTERNS.some((re) => re.test(contents))) {
        offenders.push(path.relative(SRC_DIR, file));
      }
    }
    expect(offenders).toEqual([]);
  });
});
