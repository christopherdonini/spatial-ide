import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * ADR-010 rule 1, enforced as a scan rather than left to review: `info.coordinate` is a
 * renderer-local value with no CRS tag (see `PICKING.md`), and must never cross into product code.
 * The only permitted occurrences of the literal string `.coordinate` are this test file itself and
 * `PICKING.md`, which explains why.
 */
const SRC_DIR = path.resolve(__dirname, "../../src");
const ALLOWED_FILES = new Set([
  path.resolve(__dirname, "PICKING.md"),
  path.resolve(__dirname, "noCoordinateLeak.test.ts"),
]);

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
  it("the string `.coordinate` appears nowhere under src/ except PICKING.md and this scan", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC_DIR)) {
      if (ALLOWED_FILES.has(path.resolve(file))) continue;
      if (!/\.(ts|tsx)$/.test(file)) continue;
      const contents = fs.readFileSync(file, "utf-8");
      if (contents.includes(".coordinate")) {
        offenders.push(path.relative(SRC_DIR, file));
      }
    }
    expect(offenders).toEqual([]);
  });
});
