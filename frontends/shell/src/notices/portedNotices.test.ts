// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The end-to-end test of the ported-source notice route (PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md
// section 4, T15; ADR-030's note of 2026-10-09): the seam between the producer, `notice()`, and the
// consumer, `portedSectionFindings()`, which `scripts/checkDistNotice.mjs` runs on the built text.
// The two hold the entry shapes separately (`notice.mjs` writes them, `portedNotices.mjs` reads
// them), so only a test that feeds the real producer's real output to the real consumer can notice
// them drifting apart. Nothing here is a mock of either side.
//
// The producer is called as `scripts/generateNotice.mjs` calls it -- the real viewer metafile, the
// real shell metafile, the real linked crates and the real DuckDB set -- with a fixture registry
// holding one `kernel/src/` port. Requires `renderer/bundle-viewer/dist-metafile.json` and
// `frontends/shell/dist-metafile.json`, which `pretest` builds, like `noticeDeterminism.test.ts`.
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { notice } from "../../../../renderer/bundle-viewer/notice.mjs";
import { portedSectionFindings, readPortedRegistry } from "../../../../renderer/bundle-viewer/portedNotices.mjs";
import { collectLinkedCrates, buildCanonicalLicenseTexts, TARGET_TRIPLE } from "../../scripts/rustCrateNotices.mjs";
import { buildAmalgamationSet } from "../../scripts/duckdbAmalgamationNotices.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const shellDir = join(here, "..", "..");
const repoRoot = join(shellDir, "..", "..");
const viewerMetafilePath = join(repoRoot, "renderer", "bundle-viewer", "dist-metafile.json");
const shellMetafilePath = join(shellDir, "dist-metafile.json");

const KERNEL_PORT = "kernel/src/ported_fixture.rs";
const LICENSE_TEXT = "MIT License\n\nCopyright (c) 2020 The Upstream Authors\n\nPermission is hereby granted.\n";

// A registry fixture under `os.tmpdir()`: one work, one kernel file, one pinned text.
function writeRegistry(): string {
  const root = mkdtempSync(join(tmpdir(), "ported-e2e-"));
  mkdirSync(join(root, "kw"));
  writeFileSync(join(root, "kw", "LICENSE"), LICENSE_TEXT, "utf8");
  const bytes = Buffer.from(LICENSE_TEXT, "utf8");
  const manifest = {
    schema: 1,
    works: [
      {
        work: "kw",
        upstream_repository: "https://example.org/kw",
        upstream_commit: "d".repeat(40),
        license_id: "MIT",
        license_id_basis: "self-declared",
        texts: [
          { file: "LICENSE", upstream_path: "LICENSE", bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") },
        ],
        retrieved: "2026-10-11",
        adopted_by: "round 1, item 1",
        files: [{ path: KERNEL_PORT, upstream_path: "src/lib.rs", copyright: ["Copyright (c) 2020 The Upstream Authors"] }],
      },
    ],
  };
  writeFileSync(join(root, "MANIFEST.json"), JSON.stringify(manifest), "utf8");
  return root;
}

describe("the fifth notice set, from the real producer to the real consumer (ADR-030's note of 2026-10-09)", { timeout: 60_000 }, () => {
  it("reads the producer's own text: a kernel port yields no finding, and exactly one once its file line is deleted", () => {
    const portedRoot = writeRegistry();
    try {
      const viewerMetafile = JSON.parse(readFileSync(viewerMetafilePath, "utf8"));
      const shellMetafile = JSON.parse(readFileSync(shellMetafilePath, "utf8"));
      const crates = collectLinkedCrates();
      // `extra` as `generateNotice.mjs` builds it in its non-bootstrap pass.
      const extra = {
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
          canonicalTexts: buildCanonicalLicenseTexts(crates, { repoRoot }),
          targetTriple: TARGET_TRIPLE,
        },
        duckdbAmalgamation: buildAmalgamationSet(crates),
      };
      const text = notice(viewerMetafile, undefined, extra, { portedRoot });
      const registry = readPortedRegistry({ root: portedRoot });

      expect(text).toContain("END OF THE PORTED SOURCE FILES SECTION");
      expect(portedSectionFindings(text, registry)).toEqual([]);

      const fileLine = new RegExp(`^  ported file ${KERNEL_PORT.replace(/[.]/g, "\\.")} \\(from [^\\n]*\\)\\n`, "m");
      expect(text).toMatch(fileLine);
      const findings = portedSectionFindings(text.replace(fileLine, ""), registry);
      expect(findings).toHaveLength(1);
      expect(findings[0]).toContain(KERNEL_PORT);
    } finally {
      rmSync(portedRoot, { recursive: true, force: true });
    }
  });
});
