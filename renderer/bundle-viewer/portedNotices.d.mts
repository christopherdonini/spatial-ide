// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Ambient declaration for `portedNotices.mjs`, for `frontends/shell`'s own `tsc --noEmit` (the same
// reason `notice.d.mts` exists). Kept in sync with the module's exports by hand.

export interface PortedText {
  file: string;
  upstream_path: string;
  bytes: number;
  sha256: string;
  // Added by `readPortedRegistry` once the bytes on disk have matched the pin.
  text?: string;
}

export interface PortedFile {
  path: string;
  upstream_path: string;
  copyright: string[];
}

export interface PortedWork {
  work: string;
  upstream_repository: string;
  upstream_commit: string;
  license_id: string;
  license_id_basis: 'self-declared' | 'read-from-body';
  texts: PortedText[];
  retrieved: string;
  adopted_by: string;
  files: PortedFile[];
}

export interface PortedRegistry {
  schema: 1;
  works: PortedWork[];
}

export const ALLOWED_UPSTREAM_LICENSE_IDS: readonly string[];

export function readPortedRegistry(options: { root: string }): PortedRegistry;

export function checkPortedFiles(options: {
  repoRoot: string;
  files: string[] | null;
  registry: PortedRegistry;
  allowlist?: Iterable<string>;
}): string[];

export function portedSectionFindings(text: string, registry: PortedRegistry): string[];

export function listTrackedFiles(repoRoot: string): string[] | null;

export function portedPrebuildCheck(options: {
  repoRoot: string;
  root?: string;
  allowlist?: Iterable<string>;
}): { registry: PortedRegistry; findings: string[]; notes: string[] };
