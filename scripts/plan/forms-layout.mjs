#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// scripts/plan/forms-layout.mjs -- governance piece F's layout check (the form
// governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md, section 2.5): every tracked
// `*PREREGISTRATION*.md` lives under governance/forms/ or state/, or is one of the two exact paths the
// human's ruling of OPEN-1 leaves under docs/. Each other path fails by name. Node's standard library only.

import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

/** OPEN-1 (A): exactly these two docs/ paths stay (docs/ is CC-BY-4.0; a move would change their licence). */
export const ALLOWED_DOCS_FORMS = [
  'docs/PREREGISTRATION-TEMPLATE.md',
  'docs/experiments/NATIVE-WGPU-RENDERER-BAKEOFF-PREREGISTRATION.md',
];

export function trackedForms(root) {
  return execFileSync('git', ['ls-files', '*PREREGISTRATION*.md'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
}

/** Returns { ok, problems, scanned }; each problem names the path. */
export function checkFormsLayout(root) {
  const forms = trackedForms(root);
  const problems = forms
    .filter((f) => !f.startsWith('governance/forms/') && !f.startsWith('state/') && !ALLOWED_DOCS_FORMS.includes(f))
    .map((f) => `${f}: a preregistration outside governance/forms/ and state/, and not one of the two allowed docs/ paths`);
  return { ok: problems.length === 0, problems, scanned: forms.length };
}

function main(argv) {
  const at = argv.indexOf('--root');
  const { ok, problems, scanned } = checkFormsLayout(at >= 0 ? path.resolve(argv[at + 1]) : REPO_ROOT);
  if (!ok) {
    console.error(`forms-layout FAIL -- ${problems.length} preregistration(s) in the wrong place:`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exitCode = 1;
    return;
  }
  console.log(`forms-layout PASS -- ${scanned} preregistration file(s), all under governance/forms/ or state/ or on the allow list.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    console.error(e.stack ?? e.message);
    process.exitCode = 1;
  }
}
