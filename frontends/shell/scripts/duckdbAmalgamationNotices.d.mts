// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Ambient declaration for `duckdbAmalgamationNotices.mjs` (DECISIONS-PENDING entry 62 = (a)), so the
// TypeScript test files under `src/notices` that import it type-check under this package's own
// `strict`/`noImplicitAny` without needing `allowJs`. Same hand-kept discipline, and same reason, as
// `rustCrateNotices.d.mts` beside it: there is no other source of truth for a plain-JS module's
// types.

import type { LinkedCrate } from "./rustCrateNotices.d.mts";
import type { NoticeAmalgamationSet } from "../../../renderer/bundle-viewer/notice.d.mts";

/** One pinned licence/notice file, as `MANIFEST.json` records it. */
export interface AmalgamationManifestFile {
  file: string;
  upstream_path: string;
  url: string;
  bytes: number;
  sha256: string;
  git_blob_sha1: string;
}

/** One third-party work embedded in DuckDB's amalgamated source tree. */
export interface AmalgamationManifestWork {
  lib: string;
  license_id: string;
  /** `"self-declared"` (the pinned text names its own licence) or `"read-from-body"`. */
  license_id_basis: string;
  note?: string;
  files: AmalgamationManifestFile[];
}

export interface AmalgamationManifest {
  duckdb_version: string;
  duckdb_tag: string;
  duckdb_commit: string;
  crate: { name: string; version: string; feature: string };
  crate_tarball: { file: string; sha256: string; third_party_dir_count: number };
  upstream_repository: string;
  upstream_third_party_tree_sha: string;
  retrieved: string;
  works: AmalgamationManifestWork[];
}

/** The rendered section's heading, so every caller names the same string once. */
export const AMALGAMATION_HEADING: string;

/** The single `duckdb-<version>` directory under `LICENSES/third-party/`. Throws on zero or many. */
export function resolvePinnedDir(root?: string): string;

/**
 * The pinned manifest with every file's `sha256` re-verified against the bytes on disk and its text
 * read. Throws on a missing manifest, a missing pinned file, or any hash mismatch.
 */
export function readAmalgamationManifest(options?: { pinnedDir?: string }): {
  manifest: AmalgamationManifest;
  works: NoticeAmalgamationSet["works"];
};

/** The `third_party/<lib>` directory names inside the crate's own `duckdb.tar.gz`, sorted. */
export function tarballThirdPartyDirs(crateSrcDir: string): string[];

/** The drift guard: the tarball's listing against the manifest's work list. Throws on any difference. */
export function assertTarballMatchesManifest(options: {
  crateSrcDir: string;
  manifest: AmalgamationManifest;
}): { count: number; dirs: string[] };

/** The single linked `libduckdb-sys` crate. Throws if it is absent or duplicated. */
export function findLibduckdbSys(crates: LinkedCrate[]): LinkedCrate;

/** The whole fourth set, both guards run, shaped for `notice()`'s `extra.duckdbAmalgamation`. */
export function buildAmalgamationSet(crates: LinkedCrate[]): NoticeAmalgamationSet;
