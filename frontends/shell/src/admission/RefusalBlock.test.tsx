// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { SkpError } from "../skp/types";
import { REAL_SOURCE_CHANGED_TERMINAL_DETAIL } from "../testUtils/terminalShapes";
import { formatRefusal } from "./formatRefusal";
import RefusalBlock from "./RefusalBlock";

/**
 * **The whole refusal an operator reads on the filter route, checked as one string.**
 *
 * `FilterPanel.tsx:134` renders `<RefusalBlock refusal={refusal} />` inside `.filter-refusal`; this
 * test renders that same component over the same `FormattedRefusal` shape, so what is asserted is
 * what is displayed — `message` **and** `refusalGuidance`'s sentence together, not either half on
 * its own. The half-checked form is what let the engine's text and the owner's guidance say
 * different things about the same event through two separately-green tests.
 *
 * **From the real producer's bytes, not a transcription.** The input is
 * `protocol/skp/tests/data/v0-error-source_changed.json` — the wire fixture the Rust host reads in
 * `protocol/skp/tests/fixtures.rs::the_new_typed_refusal_fixtures_round_trip_with_their_detail_fields`
 * — and the first assertion ties that fixture byte-for-byte to the kernel's own pinned terminal
 * bytes (`kernel/tests/typed_terminal_codes.rs::a_data_plane_terminal_detail_begins_with_the_refusal_s_typed_code`,
 * carried here as `REAL_SOURCE_CHANGED_TERMINAL_DETAIL`). The three copies of this string cannot
 * drift apart without one of them failing.
 */
const FIXTURE_DIR = path.resolve(__dirname, "../../../../protocol/skp/tests/data");

function realSourceChangedRefusal(): SkpError {
  const file = path.join(FIXTURE_DIR, "v0-error-source_changed.json");
  return JSON.parse(fs.readFileSync(file, "utf-8")) as SkpError;
}

/** The text a reader sees: the rendered markup with its tags removed. */
function renderedText(error: SkpError): string {
  return renderToStaticMarkup(<RefusalBlock refusal={formatRefusal(error)} />)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("RefusalBlock, engine.source_changed", () => {
  // RECORDED MUTATION: restore the deleted consequence sentence ("Everything read for this session
  // is discarded and the identities it handed out no longer refer to anything; reopen the file to
  // continue.") to the engine's message in BOTH copies this test reads -- the SKP fixture
  // `v0-error-source_changed.json` and the kernel-pinned `REAL_SOURCE_CHANGED_TERMINAL_DETAIL` --
  // so the byte-equality assertion still passes and only the class assertion bites.
  // Expected failure: "the rendered refusal states the engine's fact and the owner's sentence, and
  // no consequence the shell did not perform" fails on the `discard` sweep over the WHOLE rendered
  // block -- which is the assertion that would have caught P3a attempt 2's over-claim, where the
  // guidance was clean and the message was not.
  it("the rendered refusal states the engine's fact and the owner's sentence, and no consequence the shell did not perform", () => {
    const error = realSourceChangedRefusal();

    // The fixture, the kernel's pinned bytes and this component's input are one string.
    expect(`engine.source_changed: ${error.message}`).toBe(REAL_SOURCE_CHANGED_TERMINAL_DETAIL);

    const text = renderedText(error);

    // The ENGINE's fact: what differed, and what the check does not establish (boundary 4's own
    // words). Both are properties of the engine's check and belong in the engine's message.
    expect(text).toContain("the source file changed while it was open");
    expect(text).toContain("does not establish snapshot consistency");
    // The OWNER's sentence, rendered beside it -- the human's ruled wording (2026-09-16, round 5
    // item 1), which `formatRefusal.test.ts` asserts verbatim at its source.
    expect(text).toContain("reopen the dataset to continue");

    // **The class this test exists for** (the human's ruling of 2026-09-16, round 7: "Engine
    // messages state engine facts; owners state consequences"). Nothing an operator reads here may
    // claim a consequence P3a does not perform: nothing clears the resident view, and no identity
    // the shell holds is dropped, until P3b.
    expect(text).not.toMatch(/discard/i);
    expect(text).not.toMatch(/no longer refer/i);
    expect(text).not.toMatch(/reopen the file/i);

    // "snapshot" survives in exactly one place: boundary 4's DENIAL of a snapshot claim (A1). An
    // affirmative one anywhere would be the other half of the same over-claim.
    expect(text.match(/snapshot/gi) ?? []).toHaveLength(1);
    expect(text).not.toMatch(/reads one snapshot/i);
  });
});
