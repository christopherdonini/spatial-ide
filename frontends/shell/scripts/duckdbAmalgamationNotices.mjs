#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The FOURTH notice set (DECISIONS-PENDING entry 62 = (a), 2026-09-08; preregistered in
// RELEASE-0.1.md Amendment 10): the third-party works embedded in DuckDB's own AMALGAMATED source
// tree, which `libduckdb-sys` compiles into the packaged application.
//
// ## Why this needs its own generator, and cannot be derived like the other three
//
// The other three sets are each read from a BUILD MANIFEST: two esbuild/Rollup metafiles, and
// `Cargo.lock` via `cargo metadata`/`cargo tree`. This one has no build manifest to read, and that
// is a structural fact rather than an omission:
//
//   - `duckdb`/`libduckdb-sys` are the only crates Cargo resolves; no Cargo manifest anywhere names
//     the 26 works inside the amalgamation individually, so `rustCrateNotices.mjs` structurally
//     cannot see them;
//   - the crate's own `duckdb.tar.gz` carries the SOURCES of all 26 and **no license, notice or
//     copying file at all** (`tar -tzf duckdb.tar.gz | grep -ciE 'licen[cs]e|copying|notice'` -> 0),
//     so the tarball cannot supply their texts either.
//
// The texts therefore come from DuckDB's own UPSTREAM source tree at the tag the pinned crate
// version corresponds to, fetched once by hand at pin time and committed under
// `LICENSES/third-party/duckdb-<version>/` with a `MANIFEST.json`. This module only ever READS
// those pinned files. It never fetches, and the build has no network dependency because of it
// (the entry-51 discipline: curl once, at pin time, with URL, date and sha256 recorded for every
// file -- see that directory's own README.md for the full method and every URL).
//
// **"A manifest of a kind, not a build manifest"** (the preregistration's own words, and the notice
// says as much in its own rendered intro): the enumeration is the upstream tree's directory listing
// at the pinned version, intersected with what the amalgamation tarball actually carries -- a real,
// checkable source, but not one any build tool produced. Naming which kind it is, in the artifact a
// recipient reads, is the point.
//
// ## Two fail-closed guards, and what each one catches
//
//   1. `readAmalgamationManifest()` re-verifies the `sha256` of EVERY pinned file against the bytes
//      on disk, every time the notice is generated. A pinned licence text that has been edited,
//      truncated, or silently re-encoded (a CRLF checkout, say) throws here rather than being
//      embedded into a conveyed notice under a hash that no longer describes it.
//   2. `assertTarballMatchesManifest()` compares the manifest's library list against the
//      `third_party/` directory listing inside the pinned crate's OWN `duckdb.tar.gz`. If a crate
//      upgrade adds or removes a bundled work, the manifest is stale by exactly that difference and
//      the check fails, naming the added/removed directories. Without this guard the fourth section
//      would keep rendering 26 confident entries about a tree that no longer has 26.
//
// Guard 2 reads the tarball with a minimal, dependency-free tar walker below -- `gunzipSync` plus
// the 512-byte header format. Adding a tar library would be a new dependency, which this piece's
// own brief forbids.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..", "..");
const THIRD_PARTY_ROOT = join(REPO_ROOT, "LICENSES", "third-party");

// The rendered section's own heading, ruled in the preregistration ("its OWN notice section
// 'DUCKDB'S BUNDLED THIRD-PARTY SOURCES'"). Exported so `generateNotice.mjs`, `checkDistNotice.mjs`
// and the tests all name the same string once rather than four times.
export const AMALGAMATION_HEADING = "DUCKDB'S BUNDLED THIRD-PARTY SOURCES";

/**
 * The pinned directory for the DuckDB version this repository currently pins.
 *
 * Discovered from the filesystem rather than hardcoded: exactly one `duckdb-<version>` directory is
 * expected under `LICENSES/third-party/`, and finding zero or more than one is an error rather than
 * a case to pick a winner in. A second directory means a re-pin landed without the old one being
 * removed, and silently choosing either would make the conveyed notice depend on directory order.
 */
export function resolvePinnedDir(root = THIRD_PARTY_ROOT) {
  if (!existsSync(root)) {
    throw new Error(
      `duckdbAmalgamationNotices: ${root} does not exist. The packaged application compiles DuckDB's ` +
        "amalgamated source tree, which embeds third-party works whose licence texts are pinned there " +
        "(DECISIONS-PENDING entry 62). Without it the generated notice would be incomplete."
    );
  }
  const dirs = readdirSync(root).filter((d) => /^duckdb-\d+\.\d+\.\d+$/.test(d)).sort();
  if (dirs.length !== 1) {
    throw new Error(
      `duckdbAmalgamationNotices: expected exactly one "duckdb-<version>" directory under ${root}, ` +
        `found ${dirs.length}${dirs.length ? ` (${dirs.join(", ")})` : ""}. Two would make the ` +
        "conveyed notice depend on which one is picked; zero means nothing is pinned."
    );
  }
  return join(root, dirs[0]);
}

/**
 * The pinned manifest, with every file's `sha256` RE-VERIFIED against the bytes on disk and its text
 * read. Returns `{ manifest, works }` where each work is
 * `{ lib, licenseId, licenseIdBasis, note, files: [{ file, upstreamPath, url, text }] }`, sorted by
 * library name.
 *
 * Fails closed, by throwing, on: a missing manifest, a missing pinned file, or any `sha256`
 * mismatch. There is no degraded path here on purpose -- for the other three sets an unreadable
 * directory renders an honest "could not be read" line that `checkDistNotice.mjs` then refuses to
 * ship, but those sets read a THIRD party's registry/`node_modules` tree whose state this repository
 * does not control. These 27 files are in this repository, committed and hash-pinned; anything wrong
 * with one of them is a defect here, and the build stopping is the correct response.
 */
export function readAmalgamationManifest({ pinnedDir = resolvePinnedDir() } = {}) {
  const manifestPath = join(pinnedDir, "MANIFEST.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`duckdbAmalgamationNotices: ${manifestPath} does not exist.`);
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest.works) || manifest.works.length === 0) {
    throw new Error(
      `duckdbAmalgamationNotices: ${manifestPath} lists no works. An empty fourth set would render a ` +
        "section claiming to enumerate DuckDB's bundled third-party sources while enumerating none."
    );
  }

  const works = [];
  const mismatches = [];
  for (const work of [...manifest.works].sort((a, b) => a.lib.localeCompare(b.lib))) {
    const files = [];
    for (const f of work.files) {
      const filePath = join(pinnedDir, work.lib, f.file);
      if (!existsSync(filePath)) {
        mismatches.push(`${work.lib}/${f.file}: pinned file is missing from ${pinnedDir}`);
        continue;
      }
      const bytes = readFileSync(filePath);
      const actual = createHash("sha256").update(bytes).digest("hex");
      if (actual !== f.sha256) {
        mismatches.push(
          `${work.lib}/${f.file}: sha256 ${actual} on disk, MANIFEST.json pins ${f.sha256}`
        );
        continue;
      }
      files.push({ file: f.file, upstreamPath: f.upstream_path, url: f.url, text: bytes.toString("utf8") });
    }
    if (files.length === 0 && mismatches.length === 0) {
      mismatches.push(`${work.lib}: MANIFEST.json lists no files for this work`);
    }
    works.push({
      lib: work.lib,
      licenseId: work.license_id,
      licenseIdBasis: work.license_id_basis,
      note: work.note ?? null,
      files,
    });
  }

  if (mismatches.length > 0) {
    throw new Error(
      `duckdbAmalgamationNotices: ${mismatches.length} pinned licence file(s) do not match ` +
        `MANIFEST.json:\n  ${mismatches.join("\n  ")}\n` +
        "These bytes are embedded VERBATIM into the NOTICE.txt this application conveys, so a hash " +
        "that no longer describes the file means the conveyed licence text is not the one that was " +
        "verified against DuckDB's upstream tree at pin time. Restore the pinned file, or re-pin " +
        `deliberately by the method recorded in ${join(pinnedDir, "README.md")}. This build refuses ` +
        "rather than conveying an unverified licence text."
    );
  }
  return { manifest, works };
}

// --- the drift guard -------------------------------------------------------------------------

// Minimal, dependency-free listing of a gzipped tar's entry NAMES. Walks the 512-byte USTAR headers,
// skipping each entry's data (rounded up to a 512-byte boundary), and handles the GNU/POSIX long-name
// extensions ('L' and 'x'/'g' typeflags) by reading the name from the following record rather than
// silently truncating it at the 100-byte header field -- a truncated name would drop a library out
// of the comparison and make the guard read as green when it is not.
function tarEntryNames(gzBytes) {
  const buf = gunzipSync(gzBytes);
  const names = [];
  let off = 0;
  let pendingLongName = null;
  while (off + 512 <= buf.length) {
    const header = buf.subarray(off, off + 512);
    if (header.every((b) => b === 0)) break; // end-of-archive marker
    const rawName = header.subarray(0, 100).toString("utf8").replace(/\0.*$/, "");
    const prefix = header.subarray(345, 500).toString("utf8").replace(/\0.*$/, "");
    const sizeField = header.subarray(124, 136).toString("utf8").replace(/\0.*$/, "").trim();
    const size = parseInt(sizeField, 8) || 0;
    const typeflag = String.fromCharCode(header[156]);
    const dataOff = off + 512;
    const dataLen = Math.ceil(size / 512) * 512;

    if (typeflag === "L") {
      pendingLongName = buf.subarray(dataOff, dataOff + size).toString("utf8").replace(/\0.*$/, "");
    } else if (typeflag === "x" || typeflag === "g") {
      // PAX extended header: `<len> path=<value>\n`. Only `path` matters here.
      const pax = buf.subarray(dataOff, dataOff + size).toString("utf8");
      const m = /\d+ path=([^\n]*)\n/.exec(pax);
      if (m) pendingLongName = m[1];
    } else {
      names.push(pendingLongName ?? (prefix ? `${prefix}/${rawName}` : rawName));
      pendingLongName = null;
    }
    off = dataOff + dataLen;
  }
  return names;
}

/**
 * The `third_party/<lib>` directory names inside the pinned crate's own `duckdb.tar.gz`, sorted.
 *
 * `crateSrcDir` is the crate's registry source directory. Callers pass it from `cargo metadata`'s
 * own reported `manifest_path` (via `collectLinkedCrates()`), never from a `%USERPROFILE%` path
 * literal -- the linked set is what the build actually resolves, and hardcoding a registry layout
 * here would break on any machine or CI runner whose cargo home differs.
 */
export function tarballThirdPartyDirs(crateSrcDir) {
  const tarballPath = join(crateSrcDir, "duckdb.tar.gz");
  if (!existsSync(tarballPath)) {
    throw new Error(
      `duckdbAmalgamationNotices: ${tarballPath} does not exist, so the manifest's library list ` +
        "cannot be compared against what the crate actually bundles."
    );
  }
  const dirs = new Set();
  for (const name of tarEntryNames(readFileSync(tarballPath))) {
    const m = /^duckdb\/third_party\/([^/]+)\//.exec(name);
    if (m) dirs.add(m[1]);
  }
  return [...dirs].sort();
}

/**
 * **The drift guard** (the preregistration's item 4): the crate tarball's own `third_party/` listing
 * against the pinned manifest's library list. Throws, naming the difference in both directions, if
 * they disagree.
 *
 * This is the check that keeps the fourth section honest across a DuckDB upgrade. The manifest is a
 * snapshot taken by hand at pin time; nothing about bumping `duckdb` in `engine/Cargo.toml` would
 * otherwise tell anyone that the amalgamation gained a 27th bundled work whose licence this
 * application now conveys with no text and no name.
 */
export function assertTarballMatchesManifest({ crateSrcDir, manifest }) {
  const inTarball = tarballThirdPartyDirs(crateSrcDir);
  const inManifest = manifest.works.map((w) => w.lib).sort();
  const added = inTarball.filter((d) => !inManifest.includes(d));
  const removed = inManifest.filter((d) => !inTarball.includes(d));
  if (added.length > 0 || removed.length > 0) {
    throw new Error(
      "duckdbAmalgamationNotices: the pinned manifest no longer describes the crate's own " +
        `amalgamation tarball (${crateSrcDir}).\n` +
        (added.length ? `  in the tarball but NOT pinned (${added.length}): ${added.join(", ")}\n` : "") +
        (removed.length ? `  pinned but NOT in the tarball (${removed.length}): ${removed.join(", ")}\n` : "") +
        `  tarball: ${inTarball.length} third_party directories; manifest: ${inManifest.length} works.\n` +
        "A work in the tarball with no pinned licence text is conveyed with no attribution at all, " +
        "which is the gap this set exists to close. Re-pin by the method recorded in " +
        "LICENSES/third-party/<dir>/README.md."
    );
  }
  return { count: inTarball.length, dirs: inTarball };
}

/**
 * Locates `libduckdb-sys`'s registry source directory in a collected linked-crate set
 * (`rustCrateNotices.mjs`'s `collectLinkedCrates()` output). Throws if it is absent: the whole
 * fourth set exists BECAUSE that crate is linked, so its disappearance means the pinned manifest is
 * describing something this build no longer conveys.
 */
export function findLibduckdbSys(crates) {
  const found = crates.filter((c) => c.name === "libduckdb-sys");
  if (found.length !== 1) {
    throw new Error(
      `duckdbAmalgamationNotices: expected exactly one linked "libduckdb-sys" crate, found ` +
        `${found.length}. The fourth notice set enumerates the third-party works inside THAT crate's ` +
        "bundled DuckDB amalgamation; if it is no longer linked, the set must be removed rather than " +
        "left describing code this application does not carry."
    );
  }
  return found[0];
}

/**
 * The whole fourth set, ready to hand to `notice()` as `extra.duckdbAmalgamation`, with both guards
 * run. `crates` is `collectLinkedCrates()`'s own output, so the tarball this guard reads is the one
 * belonging to the crate cargo actually resolved for this build.
 */
export function buildAmalgamationSet(crates) {
  const { manifest, works } = readAmalgamationManifest();
  const crate = findLibduckdbSys(crates);
  assertTarballMatchesManifest({ crateSrcDir: crate.dir, manifest });
  return {
    heading: AMALGAMATION_HEADING,
    works,
    duckdbVersion: manifest.duckdb_version,
    duckdbTag: manifest.duckdb_tag,
    duckdbCommit: manifest.duckdb_commit,
    upstreamRepository: manifest.upstream_repository,
    crateName: manifest.crate.name,
    crateVersion: manifest.crate.version,
    pinnedDirName: `LICENSES/third-party/duckdb-${manifest.duckdb_version}`,
    retrieved: manifest.retrieved,
  };
}

// Run directly (`node scripts/duckdbAmalgamationNotices.mjs`) it prints one summary line and exits
// non-zero if either guard fires -- the standalone form the piece's own check list names, useful for
// verifying the pin without running a full build.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { collectLinkedCrates } = await import("./rustCrateNotices.mjs");
  const crates = collectLinkedCrates();
  const set = buildAmalgamationSet(crates);
  const fileCount = set.works.reduce((n, w) => n + w.files.length, 0);
  const bytes = set.works.reduce((n, w) => n + w.files.reduce((m, f) => m + Buffer.byteLength(f.text, "utf8"), 0), 0);
  console.log(
    `duckdbAmalgamationNotices: OK -- ${set.works.length} works, ${fileCount} pinned licence file(s), ` +
      `${bytes} bytes of licence text, every sha256 verified against ${set.pinnedDirName}/MANIFEST.json; ` +
      `tarball third_party/ listing matches (DuckDB ${set.duckdbVersion}, tag ${set.duckdbTag}, ` +
      `${set.crateName} ${set.crateVersion}).`
  );
}
