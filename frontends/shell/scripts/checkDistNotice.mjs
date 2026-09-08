#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// RELEASE-0.1 Amendment 3, item 2 ("Notice channel"): the built frontend `dist/` must actually
// carry the notice text `src/generated/NOTICE.txt` was generated from (`?raw`-imported and
// rendered by `src/notices/NoticesPanel.tsx`) -- three strings the notice's own obligations turn
// on, each asserted present somewhere in the built output, the same "grep dist/ after npm run
// build" discipline `e2e/checkDistClean.mjs` already established for a different property.
//
// RELEASE-0.1 item 9 / ADR-030 candidate (a): also checks that every npm package this package's
// OWN Vite build actually compiled in, and every Rust crate linked into the shell binary, appears
// BY NAME somewhere in the built `dist/` output -- not merely that `src/generated/NOTICE.txt` looks
// right in isolation, but that the shipped artifact itself carries no silently dropped name. Reads
// the same two build-manifest sources `scripts/generateNotice.mjs` does
// (`dist-metafile.json`/`rustCrateNotices.mjs`), rather than a second hand-kept list.
//
// Run via `npm run check:dist-notice`, wired into `npm run verify` beside `check:dist-clean`, AFTER
// `npm run build` (this workflow's own ordering, see `package.json`'s "verify").
//
// ## Extended, release-cut fix batch (reviewer/architect re-review of RELEASE-0.1 item 9)
//
// - **SHOULD-FIX 4.** A forbidden-strings scan refuses a provisional sentinel or a stale
//   gap-not-yet-closed marker that must never reach a BUILT artifact: `*** BOOTSTRAP PASS` (must be
//   superseded within the same `npm run build` invocation -- `generateNotice.mjs`'s own two-pass
//   comment) and the `OWED`/`not yet done`/`named gap` family (removed from every header by an
//   earlier piece of this same batch). **The one deliberate exception this comment used to name --
//   `notice.mjs`'s DuckDB amalgamation GAP PARAGRAPH, worded so it did not match the family -- is
//   gone** (architect advisory A1, this fix batch): DECISIONS-PENDING entry 62 = (a) CLOSED that gap,
//   the paragraph was deleted, and the 26 works now carry their full upstream licence texts in their
//   own section. There is no exception left; every member of the family is forbidden outright, and a
//   future edit that reintroduces one is the bug this check exists to catch.
// - **SHOULD-FIX 5.** A bare substring match (`text.includes(name)`) proves almost nothing here,
//   and that is measured rather than argued: on this exact tree, deleting a name's OWN entry line
//   (`^<name> <version> — …`) from the built output left the name still present as a substring for
//   **296 of 296** crate names and **26 of 26** npm package names. Every name recurs elsewhere --
//   in the notice's own `--- <name>/LICENSE ---` delimiters and "no LICENSE/NOTICE/COPYING file
//   ships in <name>'s registry source" lines, in `repository:` URLs, and, for npm names, throughout
//   the compiled application code itself. A substring check therefore could not fail for a dropped
//   entry, which is the exact failure it was written to catch. This check instead locates
//   the embedded notice text's own sentinel lines once, un-escapes the compiled bundle's
//   JSON-string-literal newlines back to real ones (Vite's `?raw` import emits the text via
//   `JSON.stringify`, so a real newline becomes the two-character escape `\n` in the built `.js`
//   file's own bytes), and matches the generator's own emitted line shape (`^<name> <version> — `)
//   at true line start, scoped to the right section, then asserts each section's own cardinality
//   against that section's own build manifest.
// - **SHOULD-FIX 6.** Refuses if a degraded per-package/per-crate line ("(could not be read",
//   "(no LICENSE or NOTICE file ships") reaches the built artifact -- a degraded line is itself a
//   named gap (an attribution this file could not actually read) and must not ship silently.
// - **SHOULD-FIX 8.** Refuses a STALE pairing, so this check cannot validate one build's manifest
//   against a different build's output. Only `npm run build` produces a shippable NOTICE
//   (`generateNotice.mjs`'s own doc comment says so too). **The literal form the fix was proposed
//   in -- "refuse a `dist-metafile.json` older than `dist/`'s newest entry" -- cannot be used, and
//   this is a measured fact, not a preference:** `vite.config.ts`'s own `packageMetafilePlugin`
//   writes that metafile from Rollup's `generateBundle` hook, which by design runs BEFORE Vite
//   writes any file to `dist/`, so after every honest `npm run build` the metafile is a few
//   milliseconds OLDER than `dist/`'s newest entry and the literal check would fail 100% of green
//   builds. The equivalent cheap invariant used instead, exact and tolerance-free, is the ordering
//   `npm run build` itself imposes -- `generate:notice` runs BETWEEN the two `vite build` passes,
//   so a correctly built tree always has `src/generated/NOTICE.txt` older than BOTH
//   `dist-metafile.json` and `dist/`'s newest entry. A hand-run `npm run generate:notice` after a
//   build (the common way to get a `dist/` whose embedded notice is not the one on disk) inverts
//   exactly that ordering and is refused.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { collectLinkedCrates } from "./rustCrateNotices.mjs";
import {
  AMALGAMATION_HEADING,
  assertCrateVersionMatchesManifest,
  assertTarballMatchesManifest,
  findLibduckdbSys,
  readAmalgamationManifest,
} from "./duckdbAmalgamationNotices.mjs";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST_DIR = join(SHELL_DIR, "dist");
const SHELL_METAFILE_PATH = join(SHELL_DIR, "dist-metafile.json");
const GENERATED_NOTICE_PATH = join(SHELL_DIR, "src", "generated", "NOTICE.txt");
// Sibling package, same relative layout `generateNotice.mjs` and `notice.mjs`'s own `baseDir`
// discipline already use -- read here too so the viewer section's own cardinality (3 packages
// today) is a manifest fact, never a hardcoded number this script could drift out of sync with.
const VIEWER_METAFILE_PATH = join(SHELL_DIR, "..", "..", "renderer", "bundle-viewer", "dist-metafile.json");

// Verbatim from `notice.mjs`'s own text (which is itself verbatim from `DEPENDENCY-LICENSES.md`'s
// "Third-party data terms" section for the EPSG acknowledgement/terms-URL pair) and from the
// installer section's corresponding-source route (entry 49 F-3's ruled `Url` route).
const REQUIRED_STRINGS = [
  "Geodetic Parameter Dataset, © IOGP",
  "https://epsg.org/terms-of-use.html",
  "https://github.com/christopherdonini/spatial-ide",
];

// Word-boundaried ("OWED" alone, not the "OWED" inside "ALLOWED"/"DISALLOWED" -- a real risk this
// file's own third-party license-text corpus could otherwise trip) so a legitimate word inside
// someone else's LICENSE text never counts as a forbidden hit.
const FORBIDDEN_PATTERNS = [
  {
    pattern: /\*\*\* BOOTSTRAP PASS/,
    label: '"*** BOOTSTRAP PASS" (a provisional-header sentinel that must be superseded within the same `npm run build` invocation)',
  },
  { pattern: /\bOWED\b/, label: '"OWED" (a stale gap-not-yet-closed marker; a real gap must be named and dated instead)' },
  { pattern: /\bnot yet done\b/i, label: '"not yet done" (a stale gap-not-yet-closed marker)' },
  { pattern: /\bnamed gap\b/i, label: '"named gap" (a stale gap-not-yet-closed marker)' },
];

// A per-package/per-crate line this file itself emits when it could not read an attribution --
// legitimate when the underlying read genuinely fails, but never something a SHIPPED artifact
// should carry silently: it means some package/crate's real license text is missing from the
// notice a recipient relies on (SHOULD-FIX 6).
// The third pattern is the RUST form (closing commit: architect advisory A3, reviewer R2). The first
// two are `notice.mjs`'s npm-side wordings; the Rust side had no such line at all until this commit,
// because `rustCrateNotices.mjs` swallowed a failed `readdirSync` into an empty listing and the
// notice then printed the AFFIRMATIVE "no LICENSE/NOTICE/COPYING file ships in <crate>'s registry
// source". That affirmative wording is deliberately NOT guarded here: it is true and legitimate for
// the twelve linked crates that genuinely ship no license file, and this check passes on them today.
// What is guarded is the honest "could not be read" line that now replaces it for an unreadable
// directory -- so an anomalous read fails `npm run verify` instead of shipping as a claim about the
// crate.
const DEGRADED_LINE_PATTERNS = [
  /\(could not be read/,
  /\(no LICENSE or NOTICE file ships/,
  /\(the registry source directory for \S+ could not be read/,
];

// Mirrors `notice.mjs`'s own `extractPackages` (same node_modules-boundary logic), applied here to
// any esbuild/Vite-shaped metafile -- not re-exported from notice.mjs to keep this check script's
// only import surface the Rust-crate collector, which genuinely has no other home.
function packageNamesFromMetafile(metafile) {
  const names = new Set();
  for (const input of Object.keys(metafile.inputs)) {
    const at = input.lastIndexOf("node_modules/");
    if (at === -1) continue;
    const rest = input.slice(at + "node_modules/".length).split("/");
    const name = rest[0].startsWith("@") ? `${rest[0]}/${rest[1]}` : rest[0];
    names.add(name);
  }
  return names;
}

function collectFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...collectFiles(full));
    } else if (/\.(js|mjs|css|html)$/i.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

// The newest mtime among every file actually shipped under dist/ (SHOULD-FIX 8) -- one half of the
// ordering invariant `npm run build` imposes and this check enforces (see this file's own top
// comment for why the literal "metafile older than dist/" form cannot be used).
function newestMtimeMs(files) {
  let newest = 0;
  for (const f of files) {
    const mtime = statSync(f).mtimeMs;
    if (mtime > newest) newest = mtime;
  }
  return newest;
}

// The generator's own emitted line shape (`notice.mjs`'s `packageSectionLines`/
// `rustCrateSectionLines`: `${name} ${version} — ${license}`), anchored to real line start
// (SHOULD-FIX 5) -- `g`/`m` so every occurrence in a section is counted, not just the first.
const ENTRY_LINE = /^(\S+) (\S+) — /gm;

// The FOURTH section's own entry-line shape (`notice.mjs`'s `duckdbAmalgamationSectionLines`:
// `${lib} (third_party/${lib}) — ${licenseId}`). A bundled C/C++ source tree has no per-work version
// to state, so that section cannot use the `<name> <version> — ` shape the other three do; matching
// its real shape is what makes a deleted entry fail here rather than pass unnoticed.
const AMALGAMATION_ENTRY_LINE = /^(\S+) \(third_party\/[^)]+\) — /gm;

function countEntries(section, pattern = ENTRY_LINE) {
  if (!section) return 0;
  return [...section.matchAll(pattern)].length;
}

function sectionSlice(body, startHeading, endHeading) {
  const s = body.indexOf(startHeading);
  if (s === -1) return null;
  const e = endHeading ? body.indexOf(endHeading, s) : -1;
  return e === -1 ? body.slice(s) : body.slice(s, e);
}

function main() {
  if (!existsSync(DIST_DIR)) {
    console.error(
      `check:dist-notice: ${DIST_DIR} does not exist -- run "npm run build" first (this script runs AFTER it, see package.json's own "verify" ordering).`
    );
    process.exitCode = 1;
    return;
  }

  const files = collectFiles(DIST_DIR);
  const text = files.map((f) => readFileSync(f, "utf8")).join("\n");

  if (!existsSync(SHELL_METAFILE_PATH)) {
    console.error(
      `check:dist-notice: FAIL -- ${SHELL_METAFILE_PATH} does not exist. "npm run build" writes it ` +
        "(vite.config.ts's own packageMetafilePlugin); this check runs after it, see package.json's " +
        '"verify" ordering.'
    );
    process.exitCode = 1;
    return;
  }

  // SHOULD-FIX 8: stale-manifest invariant. Only `npm run build`'s own `vite build` ->
  // `generate:notice` -> `vite build` sequence produces a shippable NOTICE (`generateNotice.mjs`'s
  // own doc comment); a `src/generated/NOTICE.txt` written AFTER the build that embedded a notice
  // is a different text from the one `dist/` actually carries, and every check below would then be
  // proving a claim about the wrong artifact.
  if (!existsSync(GENERATED_NOTICE_PATH)) {
    console.error(
      `check:dist-notice: FAIL -- ${GENERATED_NOTICE_PATH} does not exist. "npm run build" writes ` +
        'it (scripts/generateNotice.mjs, via the prebuild hook); this check runs after it.'
    );
    process.exitCode = 1;
    return;
  }
  const noticeMtimeMs = statSync(GENERATED_NOTICE_PATH).mtimeMs;
  const metafileMtimeMs = statSync(SHELL_METAFILE_PATH).mtimeMs;
  const distNewestMs = newestMtimeMs(files);
  const staleness = [];
  if (noticeMtimeMs > distNewestMs)
    staleness.push(
      `src/generated/NOTICE.txt (mtime ${new Date(noticeMtimeMs).toISOString()}) is NEWER than the ` +
        `newest file under dist/ (${new Date(distNewestMs).toISOString()}) -- the notice on disk is ` +
        'not the notice this dist/ embedded'
    );
  if (noticeMtimeMs > metafileMtimeMs)
    staleness.push(
      `src/generated/NOTICE.txt (mtime ${new Date(noticeMtimeMs).toISOString()}) is NEWER than ` +
        `dist-metafile.json (${new Date(metafileMtimeMs).toISOString()}) -- the package manifest ` +
        'this check reads is from a build that predates the notice on disk'
    );
  if (staleness.length > 0) {
    console.error("check:dist-notice: FAIL -- stale build pairing:");
    for (const s of staleness) console.error(`  ${s}`);
    console.error(
      'Run "npm run build" (the full `vite build && npm run generate:notice && vite build` script), ' +
        "never a lone `vite build` or a lone `npm run generate:notice`, so the notice on disk, the " +
        "package manifest, and dist/ all come from the SAME build."
    );
    process.exitCode = 1;
    return;
  }

  const missing = REQUIRED_STRINGS.filter((s) => !text.includes(s));
  if (missing.length > 0) {
    console.error(
      `check:dist-notice: FAIL -- the built dist/ is missing ${missing.length} required notice string(s):`
    );
    for (const s of missing) {
      console.error(`  ${JSON.stringify(s)}`);
    }
    console.error(
      "The shipped Notices view must carry the IOGP acknowledgement, the EPSG terms URL, and the installer's corresponding-source URL -- see notice.mjs and DEPENDENCY-LICENSES.md's \"Third-party data terms\" section."
    );
    process.exitCode = 1;
    return;
  }

  // SHOULD-FIX 4: forbidden strings -- a provisional sentinel or a stale gap marker must never
  // reach the built artifact.
  const forbiddenHits = FORBIDDEN_PATTERNS.filter(({ pattern }) => pattern.test(text));
  if (forbiddenHits.length > 0) {
    console.error(
      `check:dist-notice: FAIL -- the built dist/ carries ${forbiddenHits.length} forbidden string(s):`
    );
    for (const { label } of forbiddenHits) console.error(`  ${label}`);
    console.error(
      'A BOOTSTRAP-pass NOTICE.txt was embedded into a "final" build (the two-pass `npm run build` ' +
        "sequence did not complete, or ran out of order), or a header this repository's own fix " +
        "batch removed the gap-not-yet-closed wording from has regressed. Run \"npm run build\" (the " +
        "full two-pass script), never a lone `vite build`."
    );
    process.exitCode = 1;
    return;
  }

  // SHOULD-FIX 6: a degraded attribution line is itself a named gap and must not ship silently.
  const degradedHits = DEGRADED_LINE_PATTERNS.filter((p) => p.test(text));
  if (degradedHits.length > 0) {
    console.error(
      "check:dist-notice: FAIL -- the built dist/ carries a degraded attribution line (a " +
        "package/crate directory that could not be read, or that ships no LICENSE/NOTICE file, " +
        "surfaced as a runtime fallback rather than a real read). A degraded line means a real " +
        "attribution is missing from a notice a recipient relies on -- find and fix the underlying " +
        "read failure (a wrong baseDir, a moved/renamed package) rather than shipping the fallback."
    );
    process.exitCode = 1;
    return;
  }

  const shellMetafile = JSON.parse(readFileSync(SHELL_METAFILE_PATH, "utf8"));
  const npmNames = packageNamesFromMetafile(shellMetafile);
  const crates = collectLinkedCrates();
  const crateNames = new Set(crates.map((c) => c.name));

  const missingNpm = [...npmNames].filter((n) => !text.includes(n));
  const missingCrates = [...crateNames].filter((n) => !text.includes(n));
  if (missingNpm.length > 0 || missingCrates.length > 0) {
    console.error(
      `check:dist-notice: FAIL -- the built dist/ does not name ${missingNpm.length} Vite package(s) ` +
        `and ${missingCrates.length} linked crate(s) it is supposed to enumerate:`
    );
    for (const n of missingNpm) console.error(`  npm package: ${n}`);
    for (const n of missingCrates) console.error(`  Rust crate:  ${n}`);
    process.exitCode = 1;
    return;
  }

  // SHOULD-FIX 5: anchored line-shape matching + per-section cardinality, scoped to the embedded
  // notice text's own sentinel lines -- the substring checks just above only prove a NAME appears
  // somewhere in dist/, which a single deleted entry line can still satisfy if that name happens to
  // recur elsewhere (import specifiers, comments, other packages' own texts). This proves the
  // generator's own PER-ENTRY line survived, and that every section carries exactly as many as its
  // own build manifest says it should.
  const normalized = text.replace(/\\n/g, "\n");
  const NOTICE_START = "NOTICES\n=======";
  const startAt = normalized.indexOf(NOTICE_START);
  if (startAt === -1) {
    console.error(
      'check:dist-notice: FAIL -- could not locate the embedded notice text\'s own start sentinel ' +
        '("NOTICES" / "=======") anywhere in dist/.'
    );
    process.exitCode = 1;
    return;
  }
  // The end sentinel moved with entry 62's landing. It used to be the DuckDB amalgamation GAP
  // paragraph's closing line ("This gap is tracked, not silently shipped: ..."), which that piece
  // deletes -- the gap is closed and the works now carry their full licence texts. The fourth
  // section's own fixed terminal line takes its place: it carries no counts and no version, so it
  // does not move when the pinned set does.
  const NOTICE_END = "END OF THE DUCKDB BUNDLED THIRD-PARTY SOURCES SECTION";
  const endAt = normalized.indexOf(NOTICE_END, startAt);
  if (endAt === -1) {
    console.error(
      "check:dist-notice: FAIL -- could not locate the embedded notice text's own end sentinel " +
        `(${JSON.stringify(NOTICE_END)}, the DuckDB amalgamation section's closing line) anywhere in dist/.`
    );
    process.exitCode = 1;
    return;
  }
  const noticeBody = normalized.slice(startAt, endAt + NOTICE_END.length);

  const VIEWER_HEADING = "THIRD-PARTY WORKS COMPILED INTO THIS VIEWER";
  const FRONTEND_HEADING = "THIRD-PARTY WORKS COMPILED INTO THE PACKAGED FRONTEND";
  const RUST_HEADING = "RUST CRATES STATICALLY LINKED INTO THE PACKAGED APPLICATION";

  const viewerSection = sectionSlice(noticeBody, VIEWER_HEADING, FRONTEND_HEADING);
  const frontendSection = sectionSlice(noticeBody, FRONTEND_HEADING, RUST_HEADING);
  // **The Rust section is now BOUNDED by the fourth heading, and must be** (entry 62). It used to
  // run to the end of the notice body, which was harmless while what followed was a bullet list of
  // bare directory names. The fourth section emits 26 anchored ENTRY_LINE-shaped lines, so an
  // unbounded Rust slice would count 26 crates that are not crates and the Rust cardinality check
  // -- the one that proves no linked crate's entry was dropped -- would pass while over by exactly
  // that many.
  const rustSection = sectionSlice(noticeBody, RUST_HEADING, AMALGAMATION_HEADING);
  const amalgamationSection = sectionSlice(noticeBody, AMALGAMATION_HEADING, null);

  // FAILS CLOSED when the viewer metafile is absent (closing commit, architect advisory A4). This
  // read used to fall back to a literal `3` -- the count that happened to be true when it was
  // written -- so on any tree without a viewer metafile the check asserted a hardcoded cardinality
  // against a section generated from a manifest it had not read, and would have gone on passing
  // after the viewer gained or lost a dependency. There is no honest default here: either the
  // manifest is read, or this section's expected count is unknown. `generateNotice.mjs` already
  // refuses to run without this same file, so its absence at check time means the build that
  // produced `dist/` was not the pipeline `package.json`'s own "build" script defines.
  if (!existsSync(VIEWER_METAFILE_PATH)) {
    console.error(
      `check:dist-notice: FAIL -- ${VIEWER_METAFILE_PATH} does not exist, so the viewer section's ` +
        "expected package count cannot be derived from its own build manifest. Run `npm run build` " +
        "in renderer/bundle-viewer first (scripts/generateNotice.mjs refuses without it too); this " +
        "check does not assume a count."
    );
    process.exitCode = 1;
    return;
  }
  const viewerMetafile = JSON.parse(readFileSync(VIEWER_METAFILE_PATH, "utf8"));
  const expectedViewerCount = packageNamesFromMetafile(viewerMetafile).size;

  // The fourth set's own expected cardinality, and the THREE guards (entry 62's preregistration,
  // item 4; the version guard added by this fix batch, architect B1 = reviewer M1). All read the
  // pinned manifest -- never a literal 26 -- and all fail closed:
  //   - `readAmalgamationManifest()` re-verifies every pinned licence file's sha256 against the
  //     bytes on disk, so a corrupted or edited pinned text throws here rather than being validated
  //     against a hash that no longer describes it;
  //   - `assertCrateVersionMatchesManifest()` compares the VERSION of the `libduckdb-sys` crate this
  //     build links against the version the manifest pins. A bump that keeps the same 26 directories
  //     passes every other check here while the section prints a tag, a commit and a pinned
  //     directory that describe the old version -- this is the one check that catches it;
  //   - `assertTarballMatchesManifest()` compares the manifest's library list against the
  //     `third_party/` listing inside the pinned crate's OWN `duckdb.tar.gz`, and verifies the
  //     recorded `crate_tarball` sha256 and directory count against that archive, so a DuckDB
  //     upgrade that adds or removes a bundled work is caught at check time instead of shipping a
  //     section that confidently enumerates a tree that has changed underneath it.
  // All throw rather than returning a failure, and `main()` is wrapped accordingly below: an
  // unverifiable notice must stop the pipeline, not print a PASS line with a caveat.
  const { manifest: amalgamationManifest } = readAmalgamationManifest();
  const duckdbCrate = findLibduckdbSys(crates);
  const pinnedCrate = assertCrateVersionMatchesManifest({
    crate: duckdbCrate,
    manifest: amalgamationManifest,
  });
  const tarball = assertTarballMatchesManifest({
    crateSrcDir: duckdbCrate.dir,
    manifest: amalgamationManifest,
  });

  const expected = {
    viewer: expectedViewerCount,
    frontend: npmNames.size,
    rust: crates.length,
    amalgamation: amalgamationManifest.works.length,
  };
  const actual = {
    viewer: countEntries(viewerSection),
    frontend: countEntries(frontendSection),
    rust: countEntries(rustSection),
    amalgamation: countEntries(amalgamationSection, AMALGAMATION_ENTRY_LINE),
  };

  const cardinalityFailures = [];
  if (viewerSection === null) cardinalityFailures.push(`viewer section heading ${JSON.stringify(VIEWER_HEADING)} not found`);
  else if (actual.viewer !== expected.viewer)
    cardinalityFailures.push(`viewer section: expected ${expected.viewer} package entry line(s), found ${actual.viewer}`);
  if (frontendSection === null) cardinalityFailures.push(`frontend section heading ${JSON.stringify(FRONTEND_HEADING)} not found`);
  else if (actual.frontend !== expected.frontend)
    cardinalityFailures.push(
      `frontend section: expected ${expected.frontend} package entry line(s) (this build's own metafile), found ${actual.frontend}`
    );
  if (rustSection === null) cardinalityFailures.push(`Rust crate section heading ${JSON.stringify(RUST_HEADING)} not found`);
  else if (actual.rust !== expected.rust)
    cardinalityFailures.push(
      `Rust crate section: expected ${expected.rust} crate entry line(s) (this build's own linked set), found ${actual.rust}`
    );
  if (amalgamationSection === null)
    cardinalityFailures.push(`DuckDB amalgamation section heading ${JSON.stringify(AMALGAMATION_HEADING)} not found`);
  else if (actual.amalgamation !== expected.amalgamation)
    cardinalityFailures.push(
      `DuckDB amalgamation section: expected ${expected.amalgamation} work entry line(s) (the pinned ` +
        `manifest's own work list), found ${actual.amalgamation}`
    );

  if (cardinalityFailures.length > 0) {
    console.error(
      "check:dist-notice: FAIL -- anchored entry-line count mismatch (a deleted, duplicated, or " +
        "malformed entry line -- not merely a name missing as a bare substring):"
    );
    for (const f of cardinalityFailures) console.error(`  ${f}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `check:dist-notice: PASS -- all ${REQUIRED_STRINGS.length} required notice strings, all ` +
      `${npmNames.size} Vite package name(s), and all ${crateNames.size} linked crate name(s) found ` +
      `across ${files.length} dist file(s); no forbidden or degraded strings; anchored entry-line ` +
      `counts match each section's own source (viewer ${actual.viewer}, frontend ` +
      `${actual.frontend}, Rust crates ${actual.rust}, DuckDB amalgamation ${actual.amalgamation}); ` +
      `every pinned amalgamation licence file's sha256 re-verified, the linked ${pinnedCrate.name} ` +
      `${pinnedCrate.version} is the version the manifest pins, and the crate tarball's own sha256 ` +
      `and third_party/ listing (${tarball.count} dirs) match the pinned manifest.`
  );
}

// The two entry-62 guards signal by THROWING (a corrupted pinned licence text, or a crate tarball
// whose third_party/ listing no longer matches the pinned manifest). Catching them here turns an
// uncaught stack trace into the same named FAIL line every other refusal in this file prints, and
// keeps the non-zero exit `npm run verify` depends on.
try {
  main();
} catch (err) {
  console.error(`check:dist-notice: FAIL -- ${err?.message ?? err}`);
  process.exitCode = 1;
}
