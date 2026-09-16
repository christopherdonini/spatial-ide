// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { refusalGuidance } from "../admission/formatRefusal";
import { formatPublishRefusal } from "./formatPublishRefusal";

/**
 * **The exact string the kernel sends, captured from the kernel and not invented.**
 *
 * This is `PublishError::GeographicCrsNotPublishable { crs_identifier: "OGC:CRS84", unit_source:
 * "unit:format-rule" }.refusal_detail()` (`kernel/src/publish/error.rs`), printed from a real
 * `cargo test` run and pasted here byte-for-byte. The Rust side pins the same value in
 * `kernel/tests/typed_terminal_codes.rs`'s `a_publish_refusal_detail_begins_with_its_typed_code`,
 * so a change to either the code or the `Display` text fails there first.
 *
 * Writing this from the real producer's output, rather than from a guess at its shape, is the
 * human's ruling of 2026-09-16 (round 4) applied to this seam: a test that encodes an imagined
 * interface is a gate failure by name.
 */
const REAL_KERNEL_REFUSAL =
  "publish.geographic_crs_not_publishable: refused: OGC:CRS84 is a geographic CRS whose " +
  "coordinates are in degrees (unit:format-rule), and the bundled viewer has no degrees path — " +
  "it renders in the dataset's own CRS, while this shell's degrees display is a view-time " +
  "convention a bundle does not carry. Publishing it would hand a recipient a bundle nothing can " +
  "render correctly. Reproject the source to a projected CRS and open that, or wait for the " +
  "reader change that adds the degrees path";

describe("formatPublishRefusal", () => {
  /**
   * Mutation: delete the `/^publish\.[a-z0-9_]+$/` branch from `formatPublishRefusal`. Expected
   * failure: "parses the code out of the real kernel refusal, and shows the operator no prefix"
   * fails on both assertions — which is precisely the operator-visible regression the P3 attempt-2
   * reviewer found (B-1): the prefix reached the operator as raw text and the code was discarded.
   */
  it("parses the code out of the real kernel refusal, and shows the operator no prefix", () => {
    const f = formatPublishRefusal(REAL_KERNEL_REFUSAL);

    expect(f.code).toBe("publish.geographic_crs_not_publishable");
    // The end-to-end property: no machine code reaches the operator's eye.
    expect(f.message).not.toContain("publish.");
    expect(f.message.startsWith("refused: OGC:CRS84 is a geographic CRS")).toBe(true);
    // Nothing is summarized away either — the whole display text is carried.
    expect(f.message.endsWith("wait for the reader change that adds the degrees path")).toBe(true);
    expect(f.fields).toEqual([]);
  });

  /**
   * The reason the code matters at all: `RefusalBlock.tsx:25` dispatches
   * `refusalGuidance(refusal.code)`. Before this parser the code was the fixed `"publish-refused"`
   * label, so this case could never fire.
   *
   * Mutation: have `formatPublishRefusal` keep returning `"publish-refused"` for a prefixed
   * message. Expected failure: "the parsed code reaches refusalGuidance, which is why parsing it
   * matters" fails.
   */
  it("the parsed code reaches refusalGuidance, which is why parsing it matters", () => {
    const f = formatPublishRefusal(REAL_KERNEL_REFUSAL);
    const guidance = refusalGuidance(f.code);
    expect(guidance).not.toBeNull();
    expect(guidance).toMatch(/degrees/i);
    expect(guidance).toMatch(/nothing has been written/i);
  });

  /**
   * Messages this seam carries that the kernel never produced keep the pre-existing label and are
   * passed through untouched — `PublishPanel`'s unknown-attempt sentence and
   * `settlePrepareOutcome`'s IPC-rejection string among them.
   *
   * Mutation: drop the `head` shape test so any `"x: y"` message is split. Expected failure: "a
   * message with no typed code keeps the fixed label and is passed through untouched" fails on the
   * sentence containing a colon.
   */
  it("a message with no typed code keeps the fixed label and is passed through untouched", () => {
    const plain = "refused: ADR-017 §8 -- bundle_version 1 cannot record a row predicate";
    const f = formatPublishRefusal(plain);
    expect(f.code).toBe("publish-refused");
    expect(f.message).toBe(plain);
    expect(f.fields).toEqual([]);

    // The real unknown-attempt string `PublishPanel.tsx` builds, which has no code and must not be
    // mangled by the parser.
    const unknownAttempt =
      "this publish attempt is no longer known to the host (already used, expired, or never " +
      "issued) — start over";
    expect(formatPublishRefusal(unknownAttempt)).toEqual({
      code: "publish-refused",
      message: unknownAttempt,
      fields: [],
    });
  });

  // Mutation: relax the head test to `head.startsWith("publish.")`, dropping the character-class
  // anchor. Expected failure: "a prose colon is not a code" still passes, but widen it further to
  // `separator > 0` alone and it fails -- which is the case this exists to hold, since an IPC
  // rejection reaching this seam routinely carries a colon.
  it("a prose colon is not a code", () => {
    // An IPC rejection can look like this; it must not be read as a typed refusal.
    const rejection = "error: the publish command panicked";
    expect(formatPublishRefusal(rejection).code).toBe("publish-refused");
    expect(formatPublishRefusal(rejection).message).toBe(rejection);
  });
});
