// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The FOURTH notice set (DECISIONS-PENDING entry 62 = (a), 2026-09-08; preregistered in
// RELEASE-0.1.md Amendment 10): the third-party works inside DuckDB's amalgamated source tree, which
// `libduckdb-sys` compiles into the packaged application, enumerated from DuckDB's own upstream tree
// at the pinned version and hash-pinned in-tree.
//
// What these tests are for, stated so they are not weakened later by someone who reads them as
// bookkeeping: the 27 files under `LICENSES/third-party/duckdb-1.5.5/` are embedded VERBATIM into
// the NOTICE.txt this application conveys to every recipient. A silent edit to one of them silently
// changes a licence text a recipient relies on, and nothing else in this repository would notice.
// The manifest's hashes are the pin; these tests are what makes the pin bite.
//
// Requires `src/generated/NOTICE.txt` to exist -- `pretest` (`package.json`) runs the full two-pass
// `npm run build` first, same precondition `noticeByteIdentity.test.ts` already carries.
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { collectLinkedCrates } from "../../scripts/rustCrateNotices.mjs";
import {
  AMALGAMATION_HEADING,
  assertTarballMatchesManifest,
  buildAmalgamationSet,
  findLibduckdbSys,
  readAmalgamationManifest,
  resolvePinnedDir,
  tarballThirdPartyDirs,
} from "../../scripts/duckdbAmalgamationNotices.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const generatedPath = join(here, "..", "generated", "NOTICE.txt");

// The generator's own fourth-section entry-line shape (`notice.mjs`'s
// `duckdbAmalgamationSectionLines`: `${lib} (third_party/${lib}) — ${licenseId}`), anchored to a
// real line start -- the same discipline the other three sections' checks use, and for the same
// measured reason (release-cut fix batch, SHOULD-FIX 5: a bare substring match survives deleting the
// entry, because every one of these names recurs in the `--- <lib>/LICENSE ---` delimiters and in
// the pinned texts themselves).
const AMALGAMATION_ENTRY_LINE = /^(\S+) \(third_party\/[^)]+\) — /gm;

function amalgamationSection(text: string): string {
  const start = text.indexOf(AMALGAMATION_HEADING);
  if (start === -1) throw new Error(`section heading ${JSON.stringify(AMALGAMATION_HEADING)} not found`);
  return text.slice(start);
}

describe("the DuckDB amalgamation notice set (DECISIONS-PENDING entry 62 = (a))", () => {
  it("pins exactly one duckdb-<version> directory, with a manifest naming a version and a tag", () => {
    const { manifest } = readAmalgamationManifest();
    expect(manifest.duckdb_version).toBe("1.5.5");
    expect(manifest.duckdb_tag).toBe("v1.5.5");
    // The tag's own commit, and the SOURCE_ID the amalgamation tarball itself carries
    // (`duckdb/src/function/table/version/pragma_version.cpp`: `#define DUCKDB_SOURCE_ID
    // "d8cdaa33fd"`). The tarball this machine compiles and the upstream tree these texts came from
    // are the same revision BECAUSE these agree -- see the pinned directory's own README, step 2.
    expect(manifest.duckdb_commit).toBe("d8cdaa33fda8df955cc76ef58a280f68f4cd43fa");
    expect(manifest.duckdb_commit.startsWith("d8cdaa33fd")).toBe(true);
    expect(manifest.crate).toEqual({ name: "libduckdb-sys", version: "1.10505.0", feature: "bundled" });
  });

  // THE HASH PIN. Every pinned file's sha256 recomputed from the bytes on disk. `readAmalgamationManifest`
  // already throws on a mismatch, but asserting it here as well means the failure names the file
  // rather than surfacing as a generator crash in an unrelated test.
  it("has every pinned licence file present and matching its manifest sha256", () => {
    const pinnedDir = resolvePinnedDir();
    const { manifest } = readAmalgamationManifest();
    let fileCount = 0;
    for (const work of manifest.works) {
      for (const f of work.files) {
        const filePath = join(pinnedDir, work.lib, f.file);
        expect(existsSync(filePath), `${work.lib}/${f.file} should be pinned in-tree`).toBe(true);
        const bytes = readFileSync(filePath);
        expect(createHash("sha256").update(bytes).digest("hex"), `${work.lib}/${f.file} content hash`).toBe(
          f.sha256
        );
        expect(bytes.length, `${work.lib}/${f.file} byte count`).toBe(f.bytes);
        // Provenance is not optional: a pinned text with no recorded URL cannot be re-derived by a
        // reader, which is the whole point of pinning it rather than transcribing it.
        expect(f.url).toMatch(/^https:\/\/raw\.githubusercontent\.com\/duckdb\/duckdb\/v1\.5\.5\/third_party\//);
        expect(f.upstream_path).toMatch(/^third_party\//);
        expect(f.git_blob_sha1).toMatch(/^[0-9a-f]{40}$/);
        fileCount += 1;
      }
    }
    expect(fileCount).toBe(27);
  });

  // The blob SHA-1 recorded at pin time is the stronger of the two hashes: it is what
  // `refs/tags/v1.5.5`'s own tree reports for that path, so recomputing it locally proves these
  // bytes are the upstream blobs rather than merely unchanged since somebody copied them. Recomputed
  // here from the same formula git uses; no network access, and none wanted in a test.
  it("reproduces each pinned file's upstream git blob SHA-1", () => {
    const pinnedDir = resolvePinnedDir();
    const { manifest } = readAmalgamationManifest();
    for (const work of manifest.works) {
      for (const f of work.files) {
        const bytes = readFileSync(join(pinnedDir, work.lib, f.file));
        const blob = createHash("sha1")
          .update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes]))
          .digest("hex");
        expect(blob, `${work.lib}/${f.file} git blob sha1 (upstream ${f.upstream_path})`).toBe(f.git_blob_sha1);
      }
    }
  });

  // The CRLF class, asserted rather than trusted to `.gitattributes` (the third such instance in
  // this repository, and the first where `text eol=lf` would have been the wrong remedy).
  // `miniz/LICENSE` genuinely carries CRLF upstream; normalising it would change the conveyed
  // licence text and break both hashes above. `-text` is what keeps this true on a CRLF checkout.
  it("preserves upstream line endings exactly, including miniz's CRLF", () => {
    const pinnedDir = resolvePinnedDir();
    const { manifest } = readAmalgamationManifest();
    const withCrlf: string[] = [];
    for (const work of manifest.works) {
      for (const f of work.files) {
        const bytes = readFileSync(join(pinnedDir, work.lib, f.file));
        if (bytes.includes(Buffer.from("\r\n"))) withCrlf.push(`${work.lib}/${f.file}`);
      }
    }
    expect(withCrlf).toEqual(["miniz/LICENSE"]);
  });

  // THE DRIFT GUARD. The pinned manifest is a snapshot taken by hand; nothing about bumping `duckdb`
  // in `engine/Cargo.toml` would otherwise reveal that the amalgamation gained a 27th bundled work
  // this application now conveys with no text and no name.
  it("matches the pinned crate tarball's own third_party/ listing", () => {
    const crates = collectLinkedCrates();
    const { manifest } = readAmalgamationManifest();
    const crate = findLibduckdbSys(crates);
    const result = assertTarballMatchesManifest({ crateSrcDir: crate.dir, manifest });
    expect(result.count).toBe(26);
    expect(result.dirs).toEqual(manifest.works.map((w: { lib: string }) => w.lib).sort());
  });

  it("names 26 works, and the four upstream-only directories are deliberately absent", () => {
    const { manifest } = readAmalgamationManifest();
    expect(manifest.works.length).toBe(26);
    const libs = manifest.works.map((w: { lib: string }) => w.lib);
    // `catch`, `imdb`, `jemalloc` and `snowball` exist under third_party/ upstream at this tag (30
    // directories there) but are NOT in the amalgamation tarball, so this application conveys none
    // of them and none is pinned. Recorded in the pinned directory's README, step 3; asserted here
    // so a future re-pin cannot quietly widen the set to "everything upstream has".
    for (const upstreamOnly of ["catch", "imdb", "jemalloc", "snowball"]) {
      expect(libs, `${upstreamOnly} is upstream-only and must not be pinned`).not.toContain(upstreamOnly);
    }
  });

  it("records, for every work, a licence id and which of the two bases it rests on", () => {
    const { manifest } = readAmalgamationManifest();
    for (const work of manifest.works) {
      expect(work.license_id, `${work.lib} licence id`).toBeTruthy();
      // DuckDB declares no SPDX id for these works (there is no per-library licence index upstream
      // at this tag), so every id is either self-declared inside the pinned text or read from its
      // clauses. Which one it is, is recorded per work and never left implicit -- the pinned text is
      // the authority in both cases.
      expect(["self-declared", "read-from-body"], `${work.lib} licence id basis`).toContain(
        work.license_id_basis
      );
    }
  });

  describe("the generated NOTICE.txt", () => {
    it("carries the fourth section with one anchored entry line per pinned work", () => {
      const generated = readFileSync(generatedPath, "utf8");
      const { manifest } = readAmalgamationManifest();
      const section = amalgamationSection(generated);
      const entries = [...section.matchAll(AMALGAMATION_ENTRY_LINE)].map((m) => m[1]);
      expect(entries.length).toBe(manifest.works.length);
      expect(entries.length).toBe(26);
      expect(new Set(entries)).toEqual(new Set(manifest.works.map((w: { lib: string }) => w.lib)));
    });

    it("embeds every pinned licence text verbatim", () => {
      const generated = readFileSync(generatedPath, "utf8");
      const pinnedDir = resolvePinnedDir();
      const { manifest } = readAmalgamationManifest();
      for (const work of manifest.works) {
        for (const f of work.files) {
          const text = readFileSync(join(pinnedDir, work.lib, f.file), "utf8");
          expect(
            generated.includes(text),
            `NOTICE.txt should embed ${work.lib}/${f.file} verbatim -- it is the licence text this ` +
              "application conveys for that work"
          ).toBe(true);
        }
      }
    });

    // The preregistration's own requirement, and the substance of the human's entry-62 ruling: the
    // notice must SAY that this set is enumerated from the upstream tree at the pinned version, and
    // that this is not a build manifest. A section that carried the texts but presented them as if
    // cargo had reported them would misdescribe the one thing that makes this set different.
    it("states its enumeration source, and that it is not a build manifest", () => {
      const section = amalgamationSection(readFileSync(generatedPath, "utf8"));
      expect(section).toContain("UPSTREAM SOURCE TREE");
      expect(section).toContain("it is not a build manifest");
      expect(section).toContain("tag v1.5.5");
      expect(section).toContain("d8cdaa33fda8df955cc76ef58a280f68f4cd43fa");
      expect(section).toContain("LICENSES/third-party/duckdb-1.5.5");
      expect(section).toContain("https://github.com/duckdb/duckdb");
    });

    it("no longer carries the gap paragraph this piece replaced", () => {
      const generated = readFileSync(generatedPath, "utf8");
      expect(generated).not.toContain("Their license texts are NOT carried in this file");
      expect(generated).not.toContain("This gap is tracked, not silently shipped");
      expect(generated).not.toContain("TRACKED AT DECISIONS-PENDING ENTRY 62");
    });

    // The installed header's scope sentence, widened by this piece from three build manifests to
    // four sources. Asserted on the shipped text, because the header is where a recipient learns
    // what the file does and does not cover.
    it("has an installed header naming four sources, not three build manifests", () => {
      const generated = readFileSync(generatedPath, "utf8");
      expect(generated).toContain("It is generated, never hand-copied, from four sources");
      expect(generated).not.toContain("It is generated from three separate build manifests");
      expect(generated).not.toContain("One further, narrower gap");
    });

    it("ends the section with the fixed sentinel check:dist-notice bounds the notice by", () => {
      const generated = readFileSync(generatedPath, "utf8");
      expect(generated).toContain("END OF THE DUCKDB BUNDLED THIRD-PARTY SOURCES SECTION");
    });
  });

  // A published BUNDLE carries the viewer alone and owes no notice for the packaged application's
  // DuckDB build. `notice()`'s two-argument form must therefore be untouched by this set's addition
  // -- the same invariant item 9 established for the other two extra sets, re-asserted because this
  // piece added a fourth branch inside the same `if (extra)` block.
  it("does not leak into the viewer-only (two-argument) notice a published bundle carries", () => {
    const viewerDistPath = join(here, "..", "..", "..", "..", "renderer", "bundle-viewer", "dist", "NOTICE.txt");
    const bundleNotice = readFileSync(viewerDistPath, "utf8");
    expect(bundleNotice).not.toContain(AMALGAMATION_HEADING);
    expect(bundleNotice).not.toContain("END OF THE DUCKDB BUNDLED THIRD-PARTY SOURCES SECTION");
  });

  it("exposes a set shaped for notice(), with the counts the manifest records", () => {
    const set = buildAmalgamationSet(collectLinkedCrates());
    expect(set.heading).toBe(AMALGAMATION_HEADING);
    expect(set.works.length).toBe(26);
    expect(set.duckdbVersion).toBe("1.5.5");
    expect(set.pinnedDirName).toBe("LICENSES/third-party/duckdb-1.5.5");
    for (const work of set.works) {
      expect(work.files.length, `${work.lib} should carry at least one licence file`).toBeGreaterThan(0);
      for (const f of work.files) expect(f.text.length, `${work.lib}/${f.file} text`).toBeGreaterThan(0);
    }
    // tdigest is the only work that ships a second file upstream (a NOTICES beside its LICENSE).
    expect(set.works.find((w: { lib: string }) => w.lib === "tdigest")?.files.map((f: { file: string }) => f.file)).toEqual([
      "LICENSE",
      "NOTICES",
    ]);
  });

  // The tar walker is dependency-free (gunzip plus the 512-byte header format), so it is worth
  // proving it reads the real archive rather than, say, returning an empty set that would make the
  // drift guard vacuously green.
  it("reads the crate tarball's directory listing non-vacuously", () => {
    const crate = findLibduckdbSys(collectLinkedCrates());
    const dirs = tarballThirdPartyDirs(crate.dir);
    expect(dirs.length).toBe(26);
    expect(dirs).toContain("brotli");
    expect(dirs).toContain("zstd");
    expect(dirs).not.toContain("jemalloc");
  });
});
