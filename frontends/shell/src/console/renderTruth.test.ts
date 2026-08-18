// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { assertExactKeys } from "../testUtils/assertExactKeys";
import { MAX_ENTRY_RENDER_BYTES } from "./recorder";
import { renderSkpRequest } from "./render";

/**
 * NEXT-CUT.md P1 -- the cut's spine: "display truth is structural, not editorial." Every request
 * fixture `protocol/skp/tests/data/` publishes must round-trip through `renderSkpRequest` back to
 * itself: `JSON.parse(render(fixture).copyText)` deep-equals the fixture object. Fixtures are
 * discovered by listing the directory at test time -- never enumerated by hand -- so a new
 * fixture is covered automatically, the same discipline `skp/__tests__/fixtures.test.ts` already
 * follows for the reader/writer agreement it documents.
 */
const FIXTURE_DIR = path.resolve(__dirname, "../../../../protocol/skp/tests/data");

/** Every request fixture -- as opposed to a response or a bare error example -- by filename
 * convention (`v0-<command>-request[...].json`), same convention `fixtures.test.ts`'s own
 * hand-picked request list already relies on. Discovered, not enumerated: a new `*-request*.json`
 * fixture is picked up without editing this file. */
function discoverRequestFixtureNames(): string[] {
  return fs
    .readdirSync(FIXTURE_DIR)
    .filter((name) => name.endsWith(".json") && name.includes("-request"))
    .sort();
}

function loadFixture(name: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, name), "utf-8"));
}

/**
 * Per-command expected top-level key sets, hand-maintained against `skp/types.ts`'s own declared
 * request shapes -- the SAME discipline `skp/__tests__/fixtures.test.ts` already uses (that file's
 * own doc comment: "check the fixture's actual keys against the exact set `types.ts` declares for
 * that shape"), and the SAME literal arrays that file's own `assertExactKeys` calls use for these
 * five commands (reviewer gate S6, action-console P7 fixes).
 *
 * Deliberately NOT `Object.keys(fixture)` (the prior form here): comparing a fixture against its
 * OWN keys is tautological given the `expect(parsed).toEqual(fixture)` line right above it already
 * proves the same thing -- it cannot catch a fixture that itself dropped or renamed a field
 * `types.ts` declares. Comparing against an independent, hand-maintained list can.
 */
const REQUEST_KEY_SETS: Readonly<Record<string, readonly string[]>> = {
  open_dataset: ["skp", "path", "cancel_key", "crs_assertion", "identity"],
  describe: ["skp", "dataset"],
  viewport_query: ["skp", "dataset", "bbox", "bbox_crs", "limit", "filter"],
  cancel: ["skp", "handle"],
  close_dataset: ["skp", "dataset"],
};

/** Extracts the command name from a `v0-<command>-request[...].json` filename -- the same
 * filename convention `discoverRequestFixtureNames` already relies on. */
function commandOf(fixtureName: string): string {
  const match = /^v0-([a-z_]+)-request/.exec(fixtureName);
  if (!match) throw new Error(`renderTruth.test.ts: could not extract a command name from "${fixtureName}"`);
  return match[1]!;
}

function jsonByteLength(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value, null, 2)).length;
}

/** Builds a request whose serialized size is exactly `totalBytes`, by padding a string field.
 * Computed from a live measurement of the empty-field overhead rather than a hard-coded byte
 * count, so it stays exact regardless of `JSON.stringify`'s exact formatting. */
function buildRequestOfSize(totalBytes: number): unknown {
  const overhead = jsonByteLength({ note: "" });
  const padLength = Math.max(totalBytes - overhead, 0);
  return { note: "a".repeat(padLength) };
}

describe("display-truth chain: renderSkpRequest round-trips every protocol fixture (NEXT-CUT.md P1)", () => {
  const requestFixtureNames = discoverRequestFixtureNames();

  it("discovered at least one request fixture -- otherwise this suite proves nothing", () => {
    expect(requestFixtureNames.length).toBeGreaterThan(0);
  });

  for (const name of requestFixtureNames) {
    it(`${name}: JSON.parse(renderSkpRequest(fixture).copyText) deep-equals the fixture and has exact keys`, () => {
      const fixture = loadFixture(name);
      const rendered = renderSkpRequest(fixture);

      expect(rendered.truncated).toBe(false);
      if (rendered.truncated) return; // narrows copyText for TS below; unreachable given the assertion above

      const parsed: unknown = JSON.parse(rendered.copyText);
      expect(parsed).toEqual(fixture);
      const command = commandOf(name);
      const expectedKeys = REQUEST_KEY_SETS[command];
      if (!expectedKeys) {
        throw new Error(`renderTruth.test.ts: no REQUEST_KEY_SETS entry for command "${command}" (from ${name}) -- add one`);
      }
      assertExactKeys(parsed, expectedKeys, name);
    });
  }

  describe("I4: explicit nulls survive rendering", () => {
    it("open_dataset's null/null fixture renders crs_assertion and identity as literal null, never omitted", () => {
      const fixture = loadFixture("v0-open_dataset-request.json") as {
        crs_assertion: unknown;
        identity: unknown;
      };
      expect(fixture.crs_assertion).toBeNull();
      expect(fixture.identity).toBeNull();

      const rendered = renderSkpRequest(fixture);
      expect(rendered.truncated).toBe(false);
      if (rendered.truncated) return;

      expect(rendered.copyText).toContain('"crs_assertion": null');
      expect(rendered.copyText).toContain('"identity": null');
    });

    it("viewport_query's fixture renders filter as literal null where the fixture declares no filter", () => {
      const fixture = loadFixture("v0-viewport_query-request.json") as { filter: unknown };
      expect(fixture.filter).toBeNull();

      const rendered = renderSkpRequest(fixture);
      expect(rendered.truncated).toBe(false);
      if (rendered.truncated) return;

      expect(rendered.copyText).toContain('"filter": null');
    });
  });

  describe("I5: no scalar prettified inside the copy region", () => {
    it("viewport_query's rendered text carries the fixture's exact bbox hex strings and quoted limit verbatim", () => {
      const fixture = loadFixture("v0-viewport_query-request.json") as {
        bbox: { xmin: string; ymin: string; xmax: string; ymax: string };
        limit: string;
      };
      // Sanity on the fixture itself -- HexF64 is 16 lowercase hex digits, DecU64 a quoted decimal.
      expect(fixture.bbox.xmin).toMatch(/^[0-9a-f]{16}$/);
      expect(fixture.limit).toMatch(/^(0|[1-9][0-9]*)$/);

      const rendered = renderSkpRequest(fixture);
      expect(rendered.truncated).toBe(false);
      if (rendered.truncated) return;

      // Exact substrings taken FROM the fixture at test time -- never hard-coded here.
      expect(rendered.copyText).toContain(`"${fixture.bbox.xmin}"`);
      expect(rendered.copyText).toContain(`"${fixture.bbox.ymin}"`);
      expect(rendered.copyText).toContain(`"${fixture.bbox.xmax}"`);
      expect(rendered.copyText).toContain(`"${fixture.bbox.ymax}"`);
      expect(rendered.copyText).toContain(`"${fixture.limit}"`);
    });
  });

  describe("I7: visible truncation disables copy", () => {
    it("a request serialized to exactly MAX_ENTRY_RENDER_BYTES renders in full, not truncated", () => {
      const request = buildRequestOfSize(MAX_ENTRY_RENDER_BYTES);
      expect(jsonByteLength(request)).toBe(MAX_ENTRY_RENDER_BYTES);

      const rendered = renderSkpRequest(request);
      expect(rendered.truncated).toBe(false);
      if (rendered.truncated) return;
      expect(new TextEncoder().encode(rendered.copyText).length).toBe(MAX_ENTRY_RENDER_BYTES);
    });

    it("an artificial request with a >80_000-byte string field renders truncated, copy structurally disabled, elision marker present", () => {
      const request = buildRequestOfSize(MAX_ENTRY_RENDER_BYTES + 1);
      expect(jsonByteLength(request)).toBeGreaterThan(MAX_ENTRY_RENDER_BYTES);

      const rendered = renderSkpRequest(request);
      expect(rendered.truncated).toBe(true);
      if (!rendered.truncated) return;

      // copy structurally disabled: the type has no string to copy at all, not merely a falsy one.
      expect(rendered.copyText).toBeNull();
      expect(rendered.reason).toContain("MAX_ENTRY_RENDER_BYTES");
      expect(rendered.reason).toContain(String(MAX_ENTRY_RENDER_BYTES));
      expect(rendered.preview).toMatch(/… \[truncated: \d+ of \d+ bytes shown\]$/);
    });
  });

  describe("I3: the console owns no command shapes", () => {
    it("render.ts's own source text never contains the skp wire-version literal", () => {
      const renderSource = fs.readFileSync(path.resolve(__dirname, "render.ts"), "utf-8");
      expect(renderSource).not.toMatch(/skp\/0/);
    });

    // S6 (reviewer gate, action-console P7 fixes): ConsolePanel.tsx renders the class-A label
    // line ("SKP <version> · control plane") -- I3's own guarantee only holds if THAT source text
    // also never hard-codes a version literal, reading `vm.skpVersion` (sourced from the entry's
    // own captured request, `consoleViewModel.ts`'s `readSkpVersion`) instead. The scan above
    // covering only render.ts would miss a hard-coded fallback introduced here.
    it("ConsolePanel.tsx's own source text never contains the skp wire-version literal either", () => {
      const panelSource = fs.readFileSync(path.resolve(__dirname, "ConsolePanel.tsx"), "utf-8");
      expect(panelSource).not.toMatch(/skp\/0/);
    });
  });
});
