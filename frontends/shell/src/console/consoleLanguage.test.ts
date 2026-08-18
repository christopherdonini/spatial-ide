// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { CONSOLE_STANDING_HEADER, buildRowViewModel, type ClassBRowViewModel, type ClassCRowViewModel } from "./consoleViewModel";
import type { BindingCommandEntry, GuiActionEntry } from "./recorder";
import { classBRows, classCRows } from "./surfaceRegistry";

/**
 * NEXT-CUT.md P4, I6: the language lint that keeps status-lies out of the console permanently --
 * same `admission/noCut2Language.test.ts` shape (a source scan at test time, comment lines
 * excluded), plus two run-time shape/data assertions against the actual registry and view-model
 * builder rather than against rendered DOM (the panel composes no command text of its own -- I3 --
 * so there is nothing rendering could add that isn't already present in these data sources).
 */
const CONSOLE_DIR = path.resolve(__dirname);
const VIEW_MODEL_PATH = path.join(CONSOLE_DIR, "consoleViewModel.ts");

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

describe("the standing header (I6, NEXT-CUT.md P4): the three load-bearing phrases are present as DATA", () => {
  it("contains 'one transport binding', 'session-scoped', and 'not a script you can run'", () => {
    expect(CONSOLE_STANDING_HEADER).toContain("one transport binding");
    expect(CONSOLE_STANDING_HEADER).toContain("session-scoped");
    expect(CONSOLE_STANDING_HEADER).toContain("not a script you can run");
  });
});

describe("I6: class-B/C row shapes carry no copy affordance (named lint assertion; run-time shape)", () => {
  const bindingEntry: BindingCommandEntry = { seq: 0, kind: "binding-command", command: "binding_pick_file", outcome: "ok" };
  const guiEntry: GuiActionEntry = { seq: 0, kind: "gui-action", action: "style.setFillColor" };

  it("class-B view model has no copyText/request/rendered field", () => {
    const vm = buildRowViewModel(bindingEntry) as ClassBRowViewModel;
    expect(vm.kind).toBe("class-b");
    expect("copyText" in vm).toBe(false);
    expect("request" in vm).toBe(false);
    expect("rendered" in vm).toBe(false);
  });

  it("class-C view model has no copyText/request/rendered field", () => {
    const vm = buildRowViewModel(guiEntry) as ClassCRowViewModel;
    expect(vm.kind).toBe("class-c");
    expect("copyText" in vm).toBe(false);
    expect("request" in vm).toBe(false);
    expect("rendered" in vm).toBe(false);
  });
});

describe("I6: no JSON-block serialization call in the class-B/C row-building code paths (source scan)", () => {
  const source = fs.readFileSync(VIEW_MODEL_PATH, "utf-8");

  function caseBody(caseLabel: string): string {
    const match = new RegExp(`case "${caseLabel}": \\{([\\s\\S]*?)\\n    \\}`).exec(source);
    if (!match) throw new Error(`could not locate the "${caseLabel}" case body in ${VIEW_MODEL_PATH} -- lint is stale`);
    return match[1]!;
  }

  it("the binding-command case body calls no JSON serialization function", () => {
    expect(caseBody("binding-command")).not.toMatch(/JSON\.stringify/);
  });

  it("the gui-action case body calls no JSON serialization function", () => {
    expect(caseBody("gui-action")).not.toMatch(/JSON\.stringify/);
  });
});

describe("I6: no bare 'SKP <version>' label or '· control plane' text on a class-B/C row (registry data)", () => {
  // Banned: the bare label form class-A alone is allowed to render ("SKP skp/0.2 · control
  // plane"). Allowed: "SKP-V0" as a document citation (the registry's own class-B citation
  // strings) -- a hyphen, not a space, so it never matches the space-separated banned forms.
  const BANNED_SKP_LABEL = /\bSKP skp\/|\bSKP \d|· control plane/;

  it("no class-B row's effect or citation matches the banned pattern", () => {
    for (const row of classBRows()) {
      expect(BANNED_SKP_LABEL.test(row.effect)).toBe(false);
      expect(BANNED_SKP_LABEL.test(row.citation)).toBe(false);
    }
  });

  it("no class-C row's statement or owner matches the banned pattern", () => {
    for (const row of classCRows()) {
      expect(BANNED_SKP_LABEL.test(row.statement)).toBe(false);
      expect(BANNED_SKP_LABEL.test(row.owner)).toBe(false);
    }
  });

  it("the allowed exception -- 'SKP-V0' as a document citation -- is present and does not itself trip the banned pattern", () => {
    const citations = classBRows().map((r) => r.citation);
    expect(citations.some((c) => c.includes("SKP-V0"))).toBe(true);
    expect(citations.every((c) => !BANNED_SKP_LABEL.test(c))).toBe(true);
  });
});

describe("no 'runnable'/'replay'/'execute this'/'run this command' language under console/ (I6)", () => {
  const BANNED_PHRASES = ["runnable", "replay", "execute this", "run this command"];

  it("every occurrence in a non-test console/ source file is a comment, never user-facing copy", () => {
    const offenders: string[] = [];
    for (const file of walk(CONSOLE_DIR)) {
      if (!/\.(ts|tsx)$/.test(file)) continue;
      if (/\.test\.tsx?$/.test(file)) continue; // test files allowlisted: they name these phrases to assert their absence, not to render them
      const lines = fs.readFileSync(file, "utf-8").split("\n");
      lines.forEach((line, i) => {
        if (isCommentLine(line)) return;
        const lower = line.toLowerCase();
        for (const phrase of BANNED_PHRASES) {
          if (lower.includes(phrase)) {
            offenders.push(`${path.relative(CONSOLE_DIR, file)}:${i + 1}: banned phrase "${phrase}": ${line.trim()}`);
          }
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});

describe("class-B citations still carry the status truth (NEXT-CUT.md's own 'not callable' clause)", () => {
  it("every class-B row's citation contains 'not callable'", () => {
    for (const row of classBRows()) {
      expect(row.citation).toContain("not callable");
    }
  });
});
