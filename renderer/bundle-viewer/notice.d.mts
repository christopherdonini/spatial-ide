// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Ambient declaration for `notice.mjs`, so `frontends/shell/src/notices/noticeDeterminism.test.ts`
// (a TypeScript file, under that package's own `strict`/`noImplicitAny`) can import `notice()`
// without needing `allowJs` there (which would pull every reachable `.mjs` file into full
// type-checking, rather than just typing this one module's public surface). Kept in sync with
// `notice.mjs`'s own exports by hand -- there is no other source of truth for a plain-JS module's
// types. `renderer/bundle-viewer` itself has no `tsconfig.json`/build step that reads this file; it
// exists solely for `frontends/shell`'s own `tsc --noEmit` to resolve the cross-package import.

export interface EsbuildLikeMetafile {
  inputs: Record<string, unknown>;
}

export interface NoticeNpmPackageSet {
  heading: string;
  metafile: EsbuildLikeMetafile;
  baseDir: string;
  underline?: string;
}

export interface NoticeRustCrate {
  name: string;
  version: string;
  license: string | null;
  dir: string;
  licenseFiles: string[];
}

export interface NoticeRustCrateSet {
  heading: string;
  crates: NoticeRustCrate[];
  canonicalTexts?: Map<string, { text: string; source: string }>;
  underline?: string;
}

export interface NoticeExtra {
  npmSets?: NoticeNpmPackageSet[];
  rustCrates?: NoticeRustCrateSet;
  bootstrap?: boolean;
}

export function notice(
  metafile: EsbuildLikeMetafile,
  baseDir?: string,
  extra?: NoticeExtra | null,
): string;
