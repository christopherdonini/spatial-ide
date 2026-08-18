// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { classARows, classBRows, classCRows } from "./surfaceRegistry";

/**
 * NEXT-CUT.md P2: the cut's anti-debt-accrual mechanism. Every `invoke(`/`invoke<` call site
 * under `frontends/shell/src/` must be accounted for in `console/surfaceRegistry.ts` -- a new
 * binding-local command that ships without a registry row, or a registry row for a command that
 * no longer exists, fails this test and the build with it. Same fs-at-test-time, walk-and-grep
 * shape as `console/soleCaptureSite.test.ts` and `admission/noCut2Language.test.ts`; same stated
 * limitation both of those already carry: a line-oriented scan can be defeated by an unusual call
 * form (a dynamic property, a spread, a multi-line first argument) -- this test does not claim
 * otherwise.
 *
 * `skp/client.ts::call()` is the ONE place `invoke` is ever called with a non-literal command name
 * (I1: the console's sole capture choke point, `command` is a parameter, not a string) -- every
 * other `invoke(`/`invoke<` call site in the tree must pass a string literal. The five SKP command
 * names are therefore not read off *that* call -- they are derived from `call("<name>", ...)`'s own
 * literal call sites inside `skp/client.ts`, which is the mechanically-derivable form NEXT-CUT.md
 * P2 asks for.
 */
const SRC_DIR = path.resolve(__dirname, "../../src");
const CLIENT_TS_REL = "skp/client.ts";
/** `src-tauri/src/lib.rs`, relative to `SRC_DIR` -- the host-side, second source of truth this
 * file cross-checks the registry against (see `deriveHandlerListFromLibRs` below). READ-ONLY:
 * this test only reads the file; it never writes Rust. */
const LIB_RS_REL = "../src-tauri/src/lib.rs";
/** This file's own path, relative to `SRC_DIR`. Excluded from the walk below: this file's own
 * source text necessarily *spells* the `invoke(`/`invoke<` pattern (in `INVOKE_CALL`'s own regex
 * literal, and in prose describing it), which is not a call site to classify -- it is the scanner
 * itself. Same shape as `soleCaptureSite.test.ts`'s `isAllowedImporter` treating `console/` as an
 * allowed self-reference rather than an offender. */
const SELF_REL = "console/surfaceCompleteness.test.ts";

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

interface InvokeSite {
  file: string;
  line: number;
  /** The raw text of the first argument, as captured up to the first top-level `,` or `)`. */
  rawArg: string;
  /** The unquoted command name, or `null` if `rawArg` is not a plain string literal. */
  literal: string | null;
}

/** Matches `invoke(`, `invoke<...>(` and captures everything up to the first `,` or `)` as the
 * first argument's raw text. Generic type parameters are assumed free of `(`/`)`/`>` themselves
 * (true of every case in this tree: `Res`, `string | null`, `CrsCatalogEntry[]`, etc.). No
 * whitespace is allowed between `invoke`/the generic close and the call's own `(` -- real code
 * never inserts one there; this is what keeps English prose like "handed to invoke (I2, ...)" in
 * a test's own `it("...")` description from matching (a genuine call site never has a space
 * before its opening paren). */
const INVOKE_CALL = /\binvoke(?:<[^>()]*>)?\(\s*([^,)]+)/;

function extractStringLiteral(rawArg: string): string | null {
  const trimmed = rawArg.trim();
  const doubleQuoted = /^"([^"]*)"$/.exec(trimmed);
  if (doubleQuoted) return doubleQuoted[1]!;
  const singleQuoted = /^'([^']*)'$/.exec(trimmed);
  if (singleQuoted) return singleQuoted[1]!;
  return null;
}

function findInvokeSites(fileAbsPath: string, fileRelPath: string): InvokeSite[] {
  const text = fs.readFileSync(fileAbsPath, "utf-8");
  const sites: InvokeSite[] = [];
  text.split("\n").forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;
    const match = INVOKE_CALL.exec(line);
    if (!match) return;
    const rawArg = match[1]!;
    sites.push({
      file: fileRelPath,
      line: i + 1,
      rawArg,
      literal: extractStringLiteral(rawArg),
    });
  });
  return sites;
}

function allInvokeSites(): InvokeSite[] {
  const out: InvokeSite[] = [];
  for (const file of walk(SRC_DIR)) {
    if (!/\.tsx?$/.test(file)) continue;
    const rel = path.relative(SRC_DIR, file).replace(/\\/g, "/");
    if (rel === SELF_REL) continue;
    out.push(...findInvokeSites(file, rel));
  }
  return out;
}

/** The five SKP command names, derived from `skp/client.ts`'s own `call("<name>", ...)` literal
 * call sites -- the mechanically-derivable form. If a sixth command is ever added, this set
 * changes automatically; `skp/client.ts` and `console/surfaceRegistry.ts` must both be updated to
 * match, or the assertions below fail the build. */
function deriveSkpCommandSetFromClient(): string[] {
  const clientAbsPath = path.join(SRC_DIR, CLIENT_TS_REL);
  const text = fs.readFileSync(clientAbsPath, "utf-8");
  const names: string[] = [];
  const pattern = /\bcall\(\s*"([a-zA-Z0-9_]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    names.push(m[1]!);
  }
  return names.sort();
}

/**
 * The SECOND, and more authoritative, source of truth: `src-tauri/src/lib.rs`'s own
 * `tauri::generate_handler![...]` list. A Tauri command cannot exist without appearing in this
 * list -- `.invoke_handler(tauri::generate_handler![...])` is what wires a `#[tauri::command]` fn
 * to the IPC dispatch table at all, so an entry missing from it is not merely undocumented, it is
 * uncallable. That makes this scan's build-failure claim honest at the Rust source rather than
 * only at the JS call-site scan above (which the file header already notes can be defeated by an
 * unusual call form): a handler-listed command with no registry row, or a class-B registry row
 * naming a command the handler list does not register, fails this test and the build with it.
 *
 * Regex-based, at test time, same fs-read shape as `deriveSkpCommandSetFromClient` above -- NOT a
 * Rust parser, and it does not claim to be one. It assumes exactly one `generate_handler![...]`
 * block, and that every handler entry is spelled `commands::<name>` (true of every entry in this
 * tree today, including the one `#[cfg(debug_assertions)]`-gated dev-seam entry -- the attribute
 * line itself does not match `commands::`, so a cfg-gated entry is still picked up the same as any
 * other; this scan does not evaluate cfg conditions, so it cannot see a release-only difference in
 * the set actually registered). An entry registered any other way (a bare fn reference without the
 * `commands::` module qualifier, a second `generate_handler!` block, a handler list assembled
 * dynamically) would be missed by this scan -- the same "a pattern-oriented scan can be defeated by
 * an unusual form" caveat this file's own header comment already states for the JS-side scan.
 */
function deriveHandlerListFromLibRs(): string[] {
  const libRsAbsPath = path.resolve(SRC_DIR, LIB_RS_REL);
  const text = fs.readFileSync(libRsAbsPath, "utf-8");
  // The closing `]` must be immediately followed by `)` -- the real close is
  // `.invoke_handler(tauri::generate_handler![...])`, so the macro's own `]` and the enclosing
  // call's `)` sit back to back. A naive `\]` alone would stop early: this block's own doc
  // comments quote `` `#[cfg(debug_assertions)]` `` in prose, which contains a `]` of its own,
  // long before the real close.
  const blockMatch = /generate_handler!\[([\s\S]*?)\]\s*\)/.exec(text);
  if (!blockMatch) {
    throw new Error(`surfaceCompleteness.test.ts: no generate_handler![...] block found in ${LIB_RS_REL}`);
  }
  const names: string[] = [];
  const pattern = /\bcommands::([a-zA-Z0-9_]+)/g;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(blockMatch[1]!)) !== null) {
    names.push(m[1]!);
  }
  return names;
}

describe("console/surfaceRegistry completeness scan (NEXT-CUT.md P2)", () => {
  const sites = allInvokeSites();

  it("found at least one invoke() call site -- otherwise this suite proves nothing", () => {
    expect(sites.length).toBeGreaterThan(0);
  });

  describe("the SKP choke point (I1)", () => {
    const clientSites = sites.filter((s) => s.file === CLIENT_TS_REL);
    const nonClientNonLiteral = sites.filter((s) => s.file !== CLIENT_TS_REL && s.literal === null);

    it("skp/client.ts has exactly one invoke() call site, and it is the non-literal choke point", () => {
      expect(clientSites).toHaveLength(1);
      expect(clientSites[0]!.literal).toBeNull();
      expect(clientSites[0]!.rawArg.trim()).toBe("command");
    });

    it("every OTHER invoke() call site in the tree passes a string literal command name -- a " +
      "non-literal command name anywhere outside skp/client.ts must be replaced with a literal " +
      "so this scan can classify it", () => {
      // Deliberately does not spell the two-token "invoke" + "(" sequence in this message -- doing
      // so would make this scanner's own source text match its own INVOKE_CALL pattern.
      const offenders = nonClientNonLiteral.map(
        (s) => `${s.file}:${s.line}: command name is not a string literal (raw argument: ${s.rawArg.trim()})`
      );
      expect(offenders).toEqual([]);
    });
  });

  describe("class A: the five SKP commands", () => {
    const derived = deriveSkpCommandSetFromClient();
    // Hard backstop, per NEXT-CUT.md P2: if this ever disagrees with `derived` above, a sixth
    // command has been added to skp/client.ts without updating this list -- update BOTH this
    // array and console/surfaceRegistry.ts's CLASS_A_ROWS together.
    const expectedFive = ["cancel", "close_dataset", "describe", "open_dataset", "viewport_query"];

    it("skp/client.ts's own call(\"<name>\", ...) sites are exactly the five named commands", () => {
      expect(derived).toEqual(expectedFive);
    });

    it("the registry's class-A command set equals exactly skp/client.ts's derived command set", () => {
      const registryCommands = classARows()
        .map((r) => r.command)
        .sort();
      expect(registryCommands).toEqual(derived);
    });
  });

  describe("class B: binding-local commands", () => {
    const literalCommandNames = new Set(
      sites.filter((s) => s.file !== CLIENT_TS_REL && s.literal !== null).map((s) => s.literal!)
    );
    const registryCommandNames = new Set(classBRows().map((r) => r.command));

    it("every invoke() literal found outside skp/client.ts has a class-B registry row", () => {
      const missing = [...literalCommandNames].filter((name) => !registryCommandNames.has(name)).sort();
      expect(missing).toEqual([]);
    });

    it("every class-B registry row names a command that some call site actually invokes (no stale row)", () => {
      const stale = [...registryCommandNames].filter((name) => !literalCommandNames.has(name)).sort();
      expect(stale).toEqual([]);
    });

    it("has no duplicate command names", () => {
      const names = classBRows().map((r) => r.command);
      expect(new Set(names).size).toBe(names.length);
    });
  });

  describe("class B: the host's own generate_handler! list (the authoritative source)", () => {
    const handlerCommands = deriveHandlerListFromLibRs();
    const handlerBindingCommands = handlerCommands.filter((name) => name.startsWith("binding_"));
    const registryCommandNames = new Set(classBRows().map((r) => r.command));
    const handlerSet = new Set(handlerCommands);

    it("found at least one commands::binding_* entry in lib.rs's generate_handler! list -- " +
      "otherwise this check proves nothing", () => {
      expect(handlerBindingCommands.length).toBeGreaterThan(0);
    });

    it("every binding_* command registered in the host's own generate_handler! list has a " +
      "class-B registry row", () => {
      const missing = handlerBindingCommands.filter((name) => !registryCommandNames.has(name)).sort();
      expect(missing).toEqual([]);
    });

    it("every class-B registry row's command is registered in the host's own " +
      "generate_handler! list", () => {
      const notRegistered = [...registryCommandNames].filter((name) => !handlerSet.has(name)).sort();
      expect(notRegistered).toEqual([]);
    });
  });

  describe("class C: no call site exists, so completeness is not mechanically scannable", () => {
    // There is nothing to grep for a style edit, a panel toggle, or a banner dismiss -- no
    // `invoke(` call site marks their absence the way it marks a binding command's presence.
    // This is exactly NEXT-CUT.md's point about class C ("the console... is its DEBT REGISTER for
    // B/C -- publishing the gap, not hiding it"): the registry's class-C rows are maintained by
    // review, not by this scan, which is why NEXT-CUT.md Part J's J3 walkthrough item (style: no
    // API equivalent) exists as a standing human check on this table.
    it("the registry's class-C set is non-empty", () => {
      expect(classCRows().length).toBeGreaterThan(0);
    });

    it("every class-C row's owner cites a decision (\"ADR-\" or \"docs/\"), non-empty", () => {
      for (const row of classCRows()) {
        expect(row.owner.length).toBeGreaterThan(0);
        expect(row.owner.includes("ADR-") || row.owner.includes("docs/")).toBe(true);
      }
    });
  });
});
