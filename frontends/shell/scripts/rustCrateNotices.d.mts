// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Ambient declaration for `rustCrateNotices.mjs`, so the TypeScript test files under `src/notices`
// that import it (`noticeByteIdentity.test.ts`, `noticeDeterminism.test.ts`) type-check under this
// package's own `strict`/`noImplicitAny` without needing `allowJs` (which would pull every reachable
// `.mjs` file, including `renderer/bundle-viewer`'s own, into full type-checking rather than just
// typing this one module's public surface). Kept in sync with `rustCrateNotices.mjs`'s own exports
// by hand -- there is no other source of truth for a plain-JS module's types.

export interface LinkedCrate {
  name: string;
  version: string;
  license: string | null;
  // `cargo metadata`'s own `license_file` field (release-cut fix batch, MUST-FIX 12 nit): set when
  // a crate declares Cargo's `license-file` key instead of (or alongside) an SPDX `license`
  // expression.
  licenseFile: string | null;
  // `cargo metadata`'s own `authors`/`repository` fields, kept rather than discarded (release-cut
  // fix batch, MUST-FIX 2): printed under a gap crate's SPDX id so a reader has this crate's OWN
  // declared attribution to trace.
  authors: string[];
  repository: string | null;
  dir: string;
  licenseFiles: string[];
}

export interface CanonicalLicenseText {
  text: string;
  source: string;
}

export const TARGET_TRIPLE: string;

export function extractSpdxIds(license: string | null | undefined): string[];

export function collectLinkedCrates(options?: {
  manifestPath?: string;
  target?: string;
}): LinkedCrate[];

export function buildCanonicalLicenseTexts(
  crates: LinkedCrate[],
  options: { repoRoot: string },
): Map<string, CanonicalLicenseText>;
