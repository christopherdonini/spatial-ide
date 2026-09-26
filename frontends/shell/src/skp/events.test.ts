// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { decodeDatasetSessionEnded } from "./events";
import type { DatasetSessionEnded } from "./types";

/**
 * `engine/SOURCE-WATCHER-PREREGISTRATION.md` §4, SH6: the shell's first runtime SKP decoder,
 * tested against the shared fixture both sides read (`protocol/skp/tests/fixtures.rs`,
 * `skp/__tests__/fixtures.test.ts`), never a transcription of the shape.
 */
const FIXTURE_DIR = path.resolve(__dirname, "../../../../protocol/skp/tests/data");

function loadFixturePayload(): DatasetSessionEnded {
  const file = path.join(FIXTURE_DIR, "v0-dataset_session_ended-event.json");
  const fixture = JSON.parse(fs.readFileSync(file, "utf-8")) as {
    event: string;
    payload: DatasetSessionEnded;
  };
  return fixture.payload;
}

describe("decodeDatasetSessionEnded (SH6)", () => {
  it("accepts the shared fixture", () => {
    const decoded = decodeDatasetSessionEnded(loadFixturePayload());
    expect(decoded).toEqual(loadFixturePayload());
  });

  // Mutation: drop the member-count check (accept any object with a valid `session`/`reason`,
  // ignoring extra keys). Expected failure: this assertion no longer throws.
  it("refuses a missing member", () => {
    const { session } = loadFixturePayload();
    expect(() => decodeDatasetSessionEnded({ session })).toThrow(/expected exactly/);
  });

  // Mutation: same as above -- accepting extra members. Expected failure: this assertion no
  // longer throws.
  it("refuses an added member", () => {
    const payload = loadFixturePayload();
    expect(() => decodeDatasetSessionEnded({ ...payload, extra: "unexpected" })).toThrow(
      /expected exactly/
    );
  });

  // Mutation: drop the closed-reason check (accept any string as `reason`). Expected failure: this
  // assertion no longer throws.
  it("refuses an unknown reason", () => {
    const payload = loadFixturePayload();
    expect(() => decodeDatasetSessionEnded({ ...payload, reason: "something-else" })).toThrow(
      /unknown reason/
    );
  });

  it("refuses a non-object payload", () => {
    expect(() => decodeDatasetSessionEnded(null)).toThrow();
    expect(() => decodeDatasetSessionEnded("a string")).toThrow();
    expect(() => decodeDatasetSessionEnded(42)).toThrow();
  });

  // Mutation: drop the `typeof session !== "string" || session.length === 0` check. Expected
  // failure: both assertions below fail -- neither malformed `session` throws.
  it("refuses an empty or non-string session", () => {
    const payload = loadFixturePayload();
    expect(() => decodeDatasetSessionEnded({ ...payload, session: "" })).toThrow();
    expect(() => decodeDatasetSessionEnded({ ...payload, session: 12345 })).toThrow();
  });
});
