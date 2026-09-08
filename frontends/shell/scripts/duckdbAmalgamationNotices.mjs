// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// **No shebang, deliberately, even though this module has a runnable main block below**
// (`AI_DEVELOPMENT.md`'s eol class, second member, PR #35's first CI run). This file is IMPORTED by
// `src/notices/duckdbAmalgamation.test.ts` and by `scripts/checkDistNotice.mjs`; on a
// `core.autocrlf=true` checkout (windows-latest) a `#!/usr/bin/env node` first line ending in CR LF
// makes Vitest's transform throw `SyntaxError: Invalid or unexpected token` in every importing
// suite, while `node --check` accepts the same file and an LF checkout passes locally. The
// standalone invocation this file's own main block serves is `node scripts/duckdbAmalgamationNotices.mjs`,
// which needs no shebang at all.

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
// ## Three fail-closed guards, and what each one catches
//
//   1. `readAmalgamationManifest()` re-verifies the `sha256` of EVERY pinned file against the bytes
//      on disk, every time the notice is generated, and asserts the pinned DIRECTORY's own name is
//      `duckdb-<manifest.duckdb_version>`. A pinned licence text that has been edited, truncated, or
//      silently re-encoded (a CRLF checkout, say) throws here rather than being embedded into a
//      conveyed notice under a hash that no longer describes it; so does a directory whose name and
//      whose manifest disagree about which DuckDB version is pinned (the notice prints the directory
//      path AND the version, and they must be the same claim).
//   2. `assertCrateVersionMatchesManifest()` compares the VERSION of the `libduckdb-sys` crate this
//      build actually links against the version the manifest pins. This is the guard the other two
//      structurally cannot be: guard 3 compares directory NAMES, and a crate upgrade that keeps the
//      same 26 `third_party/` directories -- the ordinary case for a patch or minor DuckDB bump --
//      passes it while the section goes on printing tag `v1.5.5` and commit `d8cdaa33fd…`, which
//      then describe a source tree this application no longer compiles. The tag and the commit are
//      properties of the PINNED version, so they are only true while the linked version is it.
//   3. `assertTarballMatchesManifest()` compares the manifest's library list against the
//      `third_party/` directory listing inside the pinned crate's OWN `duckdb.tar.gz`, and verifies
//      that tarball's own `sha256` and directory count against the `crate_tarball` block the
//      manifest records. If a crate upgrade adds or removes a bundled work, the manifest is stale by
//      exactly that difference and the check fails, naming the added/removed directories. Without
//      this guard the fourth section would keep rendering 26 confident entries about a tree that no
//      longer has 26.
//
// Guard 3 reads the tarball with a minimal, dependency-free tar walker below -- `gunzipSync` plus
// the 512-byte header format. Adding a tar library would be a new dependency, which this piece's
// own brief forbids.
//
// ## Which recorded fields the build VERIFIES, and which are pinned records
//
// Verified on every run, because each is checkable offline against bytes on this disk: every
// `works[].files[].sha256` (guard 1), `crate.version` (guard 2), `crate_tarball.sha256` and
// `crate_tarball.third_party_dir_count` (guard 3), and the pinned directory's own name.
// `upstream_third_party_tree_sha` is NOT verifiable offline -- it names a git tree object inside
// DuckDB's own repository, and re-deriving it needs the network this build deliberately does not
// touch. It is kept as recorded provenance, with its derivation stated: tag `v1.5.5` -> the commit
// that tag resolves to -> that commit's root tree -> the `third_party` subtree, listed once at pin
// time by the GitHub trees API call named in the pinned directory's README (step 4). The tests
// assert it is present and well-formed (40 hex characters); nothing here claims it was re-checked.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
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
  // The directory's NAME and the manifest's own `duckdb_version` are two statements of the same
  // fact, and the notice prints both (`pinnedDirName` below is built from the version, while
  // `resolvePinnedDir()` finds the directory by pattern). If they disagree -- a re-pin that renamed
  // the directory without editing the manifest, or the reverse -- the notice would print a path that
  // does not exist beside a version that is not what is pinned. `resolvePinnedDir()` cannot check
  // this on its own: it does not read the manifest, by design (it is what FINDS the directory the
  // manifest is then read from).
  const expectedDirName = `duckdb-${manifest.duckdb_version}`;
  if (basename(pinnedDir) !== expectedDirName) {
    throw new Error(
      `duckdbAmalgamationNotices: the pinned directory is named "${basename(pinnedDir)}" but ` +
        `${manifestPath} pins duckdb_version "${manifest.duckdb_version}", which requires the ` +
        `directory name "${expectedDirName}". The generated notice cites the directory by the ` +
        "version (LICENSES/third-party/duckdb-<version>), so a recipient following that path would " +
        "find nothing. Rename the directory, or correct the manifest, by the method recorded in " +
        `${join(pinnedDir, "README.md")}.`
    );
  }
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
      // The UTF-8 ROUND TRIP (architect advisory A4). The hash above pins the BYTES; what the notice
      // embeds is `bytes.toString("utf8")`, and that decode is lossy for any byte sequence that is
      // not valid UTF-8 -- each invalid sequence becomes U+FFFD, silently, under a sha256 that still
      // matches. A pinned licence text in Latin-1 (a copyright line with a 0xA9 in it, say) would
      // then be conveyed with replacement characters where the upstream text has letters, and every
      // check in this file would pass. Re-encoding and comparing is the cheap proof that the decode
      // lost nothing: if it round-trips, the text embedded IS the bytes hashed.
      const text = bytes.toString("utf8");
      if (!Buffer.from(text, "utf8").equals(bytes)) {
        mismatches.push(
          `${work.lib}/${f.file}: the pinned bytes are not valid UTF-8 -- decoding them for the ` +
            "notice loses data (U+FFFD replacement), so the conveyed text would differ from the " +
            "bytes this manifest hashes"
        );
        continue;
      }
      files.push({ file: f.file, upstreamPath: f.upstream_path, url: f.url, text });
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
// skipping each entry's data (rounded up to a 512-byte boundary), and handles the GNU long-name
// extension ('L') and the PAX per-entry extended header ('x') by reading the name from the following
// record rather than silently truncating it at the 100-byte header field -- a truncated name would
// drop a library out of the comparison and make the guard read as green when it is not.
//
// **'g' is handled distinctly from 'x', not folded into it** (reviewer nit). A PAX GLOBAL header
// ('g') does not describe the entry that follows it: its keywords are defaults for every subsequent
// entry in the archive, so treating a `path=` in one as the next entry's own name -- which folding
// it in with 'x' does -- would rename exactly one entry and leave the rest wrong. Applying global
// defaults properly is not implemented here (no writer that produces this tarball emits a global
// `path`, and there is none in the pinned archive), so a global `path` is refused rather than
// ignored: silently dropping it is how a guard reads green while its input says something it did not
// read. Global headers without a `path` are skipped, which is the ordinary case.
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
    // The size field is OCTAL in the ustar format this reads. GNU tar switches to a base-256
    // encoding (high bit of the first byte set) for sizes that do not fit the 11 octal digits --
    // i.e. entries of 8 GiB or more -- which `parseInt(…, 8)` would misparse into a wrong skip
    // length and desynchronise the whole walk. No entry in a source tarball comes close, and this
    // reader is deliberately minimal rather than a tar implementation, so the limitation is refused
    // outright instead of being silently mis-read.
    if (header[124] & 0x80) {
      throw new Error(
        "duckdbAmalgamationNotices: this archive uses base-256 (GNU large-file) size fields, which " +
          "this minimal reader does not decode. Entries of 8 GiB or more are outside what a source " +
          "tarball needs; a real tar reader would be a new dependency, which this piece's brief forbids."
      );
    }
    const sizeField = header.subarray(124, 136).toString("utf8").replace(/\0.*$/, "").trim();
    const size = parseInt(sizeField, 8) || 0;
    const typeflag = String.fromCharCode(header[156]);
    const dataOff = off + 512;
    const dataLen = Math.ceil(size / 512) * 512;

    if (typeflag === "L") {
      pendingLongName = buf.subarray(dataOff, dataOff + size).toString("utf8").replace(/\0.*$/, "");
    } else if (typeflag === "x") {
      // PAX per-entry extended header: `<len> path=<value>\n`, describing the NEXT entry. Only
      // `path` matters here.
      const pax = buf.subarray(dataOff, dataOff + size).toString("utf8");
      const m = /\d+ path=([^\n]*)\n/.exec(pax);
      if (m) pendingLongName = m[1];
    } else if (typeflag === "g") {
      // PAX GLOBAL header: defaults for every subsequent entry, not a name for the next one.
      const pax = buf.subarray(dataOff, dataOff + size).toString("utf8");
      if (/\d+ path=/.test(pax)) {
        throw new Error(
          "duckdbAmalgamationNotices: this archive carries a PAX GLOBAL header ('g') with a `path` " +
            "keyword, which sets a default path for every subsequent entry. This reader does not " +
            "apply global defaults, and ignoring one would make the third_party/ listing below " +
            "describe names the archive does not actually use."
        );
      }
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
  return thirdPartyDirsFrom(readCrateTarball(crateSrcDir).bytes);
}

// The tarball's bytes and their sha256, read once. Split out from `tarballThirdPartyDirs` so the
// drift guard below can verify the recorded `crate_tarball.sha256` against the same bytes it then
// lists, rather than reading a 40 MB archive twice to check two properties of it.
function readCrateTarball(crateSrcDir, fileName = "duckdb.tar.gz") {
  const tarballPath = join(crateSrcDir, fileName);
  if (!existsSync(tarballPath)) {
    throw new Error(
      `duckdbAmalgamationNotices: ${tarballPath} does not exist, so the manifest's library list ` +
        "cannot be compared against what the crate actually bundles."
    );
  }
  const bytes = readFileSync(tarballPath);
  return { path: tarballPath, bytes, sha256: createHash("sha256").update(bytes).digest("hex") };
}

function thirdPartyDirsFrom(tarballBytes) {
  const dirs = new Set();
  for (const name of tarEntryNames(tarballBytes)) {
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
 *
 * Also verifies the manifest's own `crate_tarball` block against the archive on disk -- its `file`
 * name, its `sha256`, and its `third_party_dir_count` (reviewer should-fix S4). Those three were
 * RECORDED at pin time and, until this commit, read by nothing: a recorded-but-unread hash is
 * provenance a reader may reasonably take as checked, and it was not. All three are checkable
 * offline, so all three are checked.
 */
export function assertTarballMatchesManifest({ crateSrcDir, manifest }) {
  const recorded = manifest.crate_tarball ?? {};
  if (!recorded.file || !recorded.sha256 || typeof recorded.third_party_dir_count !== "number") {
    throw new Error(
      "duckdbAmalgamationNotices: MANIFEST.json's `crate_tarball` block must record `file`, " +
        "`sha256` and `third_party_dir_count` -- they are what tie the pinned licence texts to the " +
        "exact archive this build compiles, and each is verified here on every run."
    );
  }
  const tarball = readCrateTarball(crateSrcDir, recorded.file);
  if (tarball.sha256 !== recorded.sha256) {
    throw new Error(
      `duckdbAmalgamationNotices: ${tarball.path} hashes to sha256 ${tarball.sha256}, but ` +
        `MANIFEST.json's crate_tarball.sha256 records ${recorded.sha256}. That archive is the ` +
        "amalgamated source tree this application compiles, and the pinned licence texts describe " +
        "the works inside THAT archive; a different archive means the enumeration below was " +
        "verified against something else. Re-pin by the method recorded in " +
        "LICENSES/third-party/<dir>/README.md."
    );
  }
  const inTarball = thirdPartyDirsFrom(tarball.bytes);
  if (inTarball.length !== recorded.third_party_dir_count) {
    throw new Error(
      `duckdbAmalgamationNotices: ${tarball.path} carries ${inTarball.length} third_party/ ` +
        `directories, but MANIFEST.json's crate_tarball.third_party_dir_count records ` +
        `${recorded.third_party_dir_count}. The recorded count is what the pin was taken against; ` +
        "a disagreement means the listing this section is built from is not the listing that was reviewed."
    );
  }
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
 * **The version guard** (architect must-fix B1 = reviewer must-fix M1): the version of
 * `libduckdb-sys` this build actually links, against the version the manifest pins.
 *
 * Everything else here resolves that crate BY NAME and compares directory NAMES. That leaves one
 * whole class of drift invisible: bump the crate to a DuckDB release whose amalgamation still
 * carries the same 26 `third_party/` directories -- the ordinary shape of a patch or minor bump --
 * and the pinned-file hashes still match (they are hashes of files in THIS repository), the
 * directory sets still match, and every check passes, while the rendered section goes on printing
 * `tag v1.5.5`, commit `d8cdaa33fda8df955cc76ef58a280f68f4cd43fa` and
 * `LICENSES/third-party/duckdb-1.5.5` for a source tree the application no longer compiles. Those
 * three strings are properties of the PINNED version and true only while the linked version is that
 * version, so this is the check that has to exist for them to be printed at all.
 */
export function assertCrateVersionMatchesManifest({ crate, manifest }) {
  const pinned = manifest.crate ?? {};
  if (crate.name !== pinned.name || crate.version !== pinned.version) {
    throw new Error(
      `duckdbAmalgamationNotices: this build links ${crate.name} ${crate.version}, but ` +
        `LICENSES/third-party/duckdb-${manifest.duckdb_version}/MANIFEST.json pins ` +
        `${pinned.name} ${pinned.version}. The tag (${manifest.duckdb_tag}), the commit ` +
        `(${manifest.duckdb_commit}) and the pinned directory the fourth notice section PRINTS all ` +
        `describe DuckDB ${manifest.duckdb_version}, the version the PINNED crate corresponds to -- ` +
        "printing them for a different linked version would tell a recipient the application " +
        "compiles a source tree it does not. Re-pin for the linked version by the method recorded " +
        `in LICENSES/third-party/duckdb-${manifest.duckdb_version}/README.md, or restore the pinned ` +
        "crate version in the dependency that resolves it."
    );
  }
  return { name: crate.name, version: crate.version };
}

/**
 * The whole fourth set, ready to hand to `notice()` as `extra.duckdbAmalgamation`, with all three
 * guards run. `crates` is `collectLinkedCrates()`'s own output, so the tarball this guard reads is
 * the one belonging to the crate cargo actually resolved for this build.
 */
export function buildAmalgamationSet(crates) {
  const { manifest, works } = readAmalgamationManifest();
  const crate = findLibduckdbSys(crates);
  assertCrateVersionMatchesManifest({ crate, manifest });
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
// non-zero if any of the three guards fires -- the standalone form the piece's own check list names,
// useful for verifying the pin without running a full build. (No shebang on this file, deliberately;
// see the top comment. `node <path>` needs none.)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { collectLinkedCrates } = await import("./rustCrateNotices.mjs");
  const crates = collectLinkedCrates();
  const set = buildAmalgamationSet(crates);
  const fileCount = set.works.reduce((n, w) => n + w.files.length, 0);
  const bytes = set.works.reduce((n, w) => n + w.files.reduce((m, f) => m + Buffer.byteLength(f.text, "utf8"), 0), 0);
  console.log(
    `duckdbAmalgamationNotices: OK -- ${set.works.length} works, ${fileCount} pinned licence file(s), ` +
      `${bytes} bytes of licence text, every sha256 verified against ${set.pinnedDirName}/MANIFEST.json; ` +
      `linked ${set.crateName} ${set.crateVersion} is the pinned version; tarball sha256, ` +
      `third_party/ directory count and listing all match (DuckDB ${set.duckdbVersion}, tag ${set.duckdbTag}).`
  );
}
