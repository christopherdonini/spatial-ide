// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * NEXT-CUT.md P3 item G: the blanket "cut-2 work — not available in this build" note is gone from
 * the product entirely -- every refusal code that had it now gets either a working remediation
 * form (B/C) or honest per-code copy (`refusalGuidance`, A/D). Same shape as
 * `canvas/noCoordinateLeak.test.ts`'s own ADR-010 rule 1 scan: a literal string match across
 * `src/`, with comment-only lines allowed (this file itself is a comment-only occurrence of
 * "cut-2" too -- explaining the history is exactly what a comment is for; the thing forbidden is
 * product copy or test-title prose still claiming the flow is unbuilt).
 */
const SRC_DIR = path.resolve(__dirname, "../../src");

function isCommentLine(line: string): boolean {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*");
}

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

describe("no cut-2 language left in product copy (NEXT-CUT.md P3 item G)", () => {
  it("every 'cut-2' occurrence under src/ is a comment explaining history, never rendered copy or a test title", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC_DIR)) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      if (path.resolve(file) === path.resolve(__filename)) continue;
      const lines = fs.readFileSync(file, "utf-8").split("\n");
      lines.forEach((line, i) => {
        if (line.includes("cut-2") && !isCommentLine(line)) {
          offenders.push(`${path.relative(SRC_DIR, file)}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});
