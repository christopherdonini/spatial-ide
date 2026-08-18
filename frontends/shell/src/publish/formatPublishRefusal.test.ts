// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { formatPublishRefusal } from "./formatPublishRefusal";

describe("formatPublishRefusal", () => {
  it("carries the message verbatim, with no fields and no remediation-form flag", () => {
    const message = "refused: ADR-017 §8 -- bundle_version 1 cannot record a row predicate";
    const f = formatPublishRefusal(message);
    expect(f.message).toBe(message);
    expect(f.fields).toEqual([]);
    expect(f.remediationIsCut2).toBe(false);
  });

  it("uses a fixed, non-skp code label -- never confusable with a real skp.*/engine.* code", () => {
    expect(formatPublishRefusal("anything").code).toBe("publish-refused");
  });
});
