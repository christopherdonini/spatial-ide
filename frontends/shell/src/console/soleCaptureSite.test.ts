// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * NEXT-CUT.md I1: one capture site -- now TWO, one per API surface, split by WHAT is imported, not
 * merely THAT `console/recorder` is imported (P3 item A's designed resolution): `consoleRecorder`
 * (the full `record(request)` API, request-carrying) stays reachable ONLY from `skp/client.ts`
 * outside this module; `recordNamed` (name-only, no payload parameter exists in its own signature)
 * is reachable from exactly the five binding-command modules plus the class-C handler modules
 * named below (`RECORD_NAMED_ALLOWLIST`'s own comment has the current, grown list -- S5, reviewer
 * gate, action-console P7 fixes). A module that imports `recordNamed` alone must never ALSO be able to
 * reach `consoleRecorder`'s `record()` by the same import line -- these are two independent scans
 * over two independent name allowlists, not one blanket "imports this module" check, precisely so
 * a future binding-command module cannot casually widen its own import to `consoleRecorder` and
 * regain the ability to record an argument object for class B.
 *
 * Same shape as `frontends/shell/src-tauri/tests/sole_caller_scan.rs`'s scan (a line-oriented text
 * scan of `import` statements) and `admission/noCut2Language.test.ts`'s walk-and-grep over `src/`.
 *
 * Line-oriented, so an unusual import style (a dynamic `import()`, a dotted alias, a multi-line
 * named-import list) could defeat it -- same limit the `sole_caller_scan.rs` header states about
 * itself. A recorder-module import line that names NEITHER `consoleRecorder` nor `recordNamed`
 * explicitly (an unusual form this scan's named-import extractor cannot parse) is treated as an
 * offender under BOTH allowlists below, conservatively -- an import this scan cannot classify is
 * never silently waved through.
 */
const SRC_DIR = path.resolve(__dirname, "../../src");

/** Files allowed to import `consoleRecorder` (the full, request-carrying `record()` API) from
 * OUTSIDE `console/` -- `skp/client.ts`, the ONE choke point for class A (I1). */
const CONSOLE_RECORDER_ALLOWLIST = new Set(["skp/client.ts"]);

/** Files allowed to import `recordNamed` (name-only, classes B and C) from OUTSIDE `console/` --
 * NEXT-CUT.md P3 item A's original five binding-command modules, plus the class-C handler modules
 * (`App.tsx` for the two canvas refusal-banner dismissals, `style/StylePanel.tsx` for every style
 * edit and its own panel disclosure toggle, `ErrorBanner.tsx` for the global error banner's own
 * dismiss, `publish/PublishPanel.tsx` for its own panel disclosure toggle -- S5, reviewer gate,
 * action-console P7 fixes). `console/ConsolePanel.tsx`'s own two toggles
 * (`console.togglePanelExpanded`/`console.toggleGroupExpanded`, same S5 fix) need no entry here --
 * `isInsideConsoleModuleOrTest` below already treats every file under `console/` as an allowed
 * self-reference, the same as `consoleRecorder`'s own choke point does. */
const RECORD_NAMED_ALLOWLIST = new Set([
  "streaming/dataPlaneClient.ts",
  "diagnostics/log.ts",
  "skp/dialog.ts",
  "skp/crsCatalog.ts",
  "publish/client.ts",
  "App.tsx",
  "style/StylePanel.tsx",
  "ErrorBanner.tsx",
  "publish/PublishPanel.tsx",
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

function isInsideConsoleModuleOrTest(fileRelToSrc: string): boolean {
  const normalized = fileRelToSrc.replace(/\\/g, "/");
  if (normalized.startsWith("console/")) return true;
  if (/\.test\.tsx?$/.test(normalized)) return true;
  return false;
}

const RECORDER_IMPORT_LINE =
  /\bimport\b[^;]*\bfrom\s+["'][^"']*\/recorder(?:\.ts)?["']|\brequire\(\s*["'][^"']*\/recorder(?:\.ts)?["']\s*\)/;

/** Extracts the named-import symbol list from a single-line `import { a, b as c } from
 * ".../recorder"` statement -- `null` if the line does not match that exact named-import shape
 * (a default/namespace import, a multi-line list, etc.), so the caller can fall back to the
 * conservative "classify under both allowlists" treatment this file's own header describes. */
function extractNamedImports(line: string): string[] | null {
  const match = /\bimport\s+(?:type\s+)?\{([^}]*)\}\s+from\s+["'][^"']*\/recorder(?:\.ts)?["']/.exec(line);
  if (!match) return null;
  return match[1]!
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => s.replace(/^type\s+/, "").split(/\s+as\s+/)[0]!.trim());
}

interface RecorderImportLine {
  rel: string;
  lineNo: number;
  text: string;
  names: string[] | null;
}

function findRecorderImportLines(): RecorderImportLine[] {
  const found: RecorderImportLine[] = [];
  for (const file of walk(SRC_DIR)) {
    if (!/\.tsx?$/.test(file)) continue;
    const rel = path.relative(SRC_DIR, file).replace(/\\/g, "/");
    const text = fs.readFileSync(file, "utf-8");
    text.split("\n").forEach((line, i) => {
      const code = line.trim();
      if (code.startsWith("//") || code.startsWith("*") || code.startsWith("/*")) return;
      if (!RECORDER_IMPORT_LINE.test(line)) return;
      found.push({ rel, lineNo: i + 1, text: line.trim(), names: extractNamedImports(line) });
    });
  }
  return found;
}

describe("console/recorder's two capture surfaces are each reachable from only their allowed importers (NEXT-CUT.md I1, P3 item A)", () => {
  const importLines = findRecorderImportLines();

  it("found at least one import of console/recorder -- otherwise this suite proves nothing", () => {
    expect(importLines.length).toBeGreaterThan(0);
  });

  describe("consoleRecorder (the full record(request) API)", () => {
    it("every import of consoleRecorder outside console/ is skp/client.ts or a test file", () => {
      const offenders: string[] = [];
      for (const imp of importLines) {
        if (isInsideConsoleModuleOrTest(imp.rel)) continue;
        const namesUnclassifiable = imp.names === null;
        const importsConsoleRecorder = namesUnclassifiable || imp.names!.includes("consoleRecorder");
        if (importsConsoleRecorder && !CONSOLE_RECORDER_ALLOWLIST.has(imp.rel)) {
          offenders.push(`${imp.rel}:${imp.lineNo}: ${imp.text}`);
        }
      }
      expect(offenders).toEqual([]);
    });

    it("skp/client.ts really does import consoleRecorder -- the scan above would otherwise prove nothing", () => {
      const clientPath = path.join(SRC_DIR, "skp/client.ts");
      const text = fs.readFileSync(clientPath, "utf-8");
      expect(text).toMatch(/\bimport\b[^;]*\bconsoleRecorder\b[^;]*\bfrom\s+["'][^"']*\/recorder(?:\.ts)?["']/);
    });
  });

  describe("recordNamed (name-only, classes B and C)", () => {
    it("every import of recordNamed outside console/ is one of the named binding-command/class-C handler modules, or a test file", () => {
      const offenders: string[] = [];
      for (const imp of importLines) {
        if (isInsideConsoleModuleOrTest(imp.rel)) continue;
        const namesUnclassifiable = imp.names === null;
        const importsRecordNamed = namesUnclassifiable || imp.names!.includes("recordNamed");
        if (importsRecordNamed && !RECORD_NAMED_ALLOWLIST.has(imp.rel)) {
          offenders.push(`${imp.rel}:${imp.lineNo}: ${imp.text}`);
        }
      }
      expect(offenders).toEqual([]);
    });

    it("at least one of the allowed modules really does import recordNamed -- otherwise this scan proves nothing", () => {
      const foundIn = new Set(
        importLines.filter((imp) => imp.names !== null && imp.names.includes("recordNamed")).map((imp) => imp.rel)
      );
      const anyAllowed = [...RECORD_NAMED_ALLOWLIST].some((rel) => foundIn.has(rel));
      expect(anyAllowed).toBe(true);
    });
  });
});
