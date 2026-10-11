#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The repository check of the ported-source notice route (PORTED-CODE-NOTICE-ROUTE-PREREGISTRATION.md
// section 2.6; ADR-030's note of 2026-10-09): the tracked files, the registry, and the checks in
// `renderer/bundle-viewer/portedNotices.mjs`, in both directions. A thin entry point -- the logic
// and its tests live there. CI runs it as `.github/workflows/ported-notices.yml`, with no install.
//
// It has no archive mode: a tree without a `.git` entry fails by name, because the other direction
// (a marked file with no registry entry) cannot be searched without a listing. The packaged build's
// own prebuild check (`frontends/shell/scripts/generateNotice.mjs`) is the one that goes on in that
// case. Prints one PASS line, or the findings, and exits 1 on any finding.

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ALLOWED_UPSTREAM_LICENSE_IDS,
  checkPortedFiles,
  listTrackedFiles,
  readPortedRegistry,
} from '../renderer/bundle-viewer/portedNotices.mjs';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

try {
  const registry = readPortedRegistry({ root: join(repoRoot, 'LICENSES', 'third-party', 'ported') });
  const files = listTrackedFiles(repoRoot);
  if (files === null) {
    console.error(
      `check-ported-notices: FAIL -- ${repoRoot} is not a git checkout (no .git entry); this check has no archive mode.`,
    );
    process.exit(1);
  }
  const findings = checkPortedFiles({ repoRoot, files, registry, allowlist: ALLOWED_UPSTREAM_LICENSE_IDS });
  if (findings.length > 0) {
    console.error(`check-ported-notices: FAIL -- ${findings.length} finding(s):\n  ${findings.join('\n  ')}`);
    process.exit(1);
  }
  const registered = registry.works.reduce((n, w) => n + w.files.length, 0);
  console.log(
    `check-ported-notices: PASS -- ${files.length} tracked file(s) searched for port markers; ` +
      `${registry.works.length} registered work(s), ${registered} registered file(s)`,
  );
} catch (err) {
  console.error(`check-ported-notices: FAIL -- ${err?.message ?? err}`);
  process.exit(1);
}
