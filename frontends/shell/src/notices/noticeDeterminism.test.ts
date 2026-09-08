// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// RELEASE-0.1 item 9 / ADR-030 candidate (a): "Output must be identical across two runs ... and
// must not depend on the developer's registry having extra crates (only the linked set is read)"
// (the piece's own brief). Calls the real generation pipeline TWICE, in-process -- including real
// `cargo metadata`/`cargo tree` subprocess calls each time via `collectLinkedCrates()`, not a mock
// -- so this exercises cargo's own output stability, not merely `notice()`'s own pure-function
// determinism (already implied by it doing no I/O beyond reading fixed files by fixed paths, sorted
// deterministically, no timestamp -- `notice.mjs`'s own doc comment).
//
// Requires `renderer/bundle-viewer/dist-metafile.json` and `frontends/shell/dist-metafile.json` to
// already exist -- `pretest` builds both before `vitest run` starts (same precondition
// `noticeByteIdentity.test.ts` already carries).
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { notice } from "../../../../renderer/bundle-viewer/notice.mjs";
import { collectLinkedCrates, buildCanonicalLicenseTexts } from "../../scripts/rustCrateNotices.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const shellDir = join(here, "..", "..");
const repoRoot = join(shellDir, "..", "..");
const viewerDir = join(shellDir, "..", "..", "renderer", "bundle-viewer");
const viewerMetafilePath = join(viewerDir, "dist-metafile.json");
const shellMetafilePath = join(shellDir, "dist-metafile.json");

function generateOnce(): string {
  const viewerMetafile = JSON.parse(readFileSync(viewerMetafilePath, "utf8"));
  const shellMetafile = JSON.parse(readFileSync(shellMetafilePath, "utf8"));
  const crates = collectLinkedCrates();
  const canonicalTexts = buildCanonicalLicenseTexts(crates, { repoRoot });
  return notice(viewerMetafile, undefined, {
    npmSets: [
      {
        heading: "THIRD-PARTY WORKS COMPILED INTO THE PACKAGED FRONTEND (frontends/shell/dist)",
        metafile: shellMetafile,
        baseDir: shellDir,
      },
    ],
    rustCrates: {
      heading: "RUST CRATES STATICALLY LINKED INTO THE PACKAGED APPLICATION",
      crates,
      canonicalTexts,
    },
  });
}

describe("packaged NOTICE.txt generation is deterministic (RELEASE-0.1 item 9 / ADR-030 (a))", () => {
  it("produces byte-identical output across two independent runs, including two real cargo calls", () => {
    const first = generateOnce();
    const second = generateOnce();
    expect(first).toBe(second);
  });
});
