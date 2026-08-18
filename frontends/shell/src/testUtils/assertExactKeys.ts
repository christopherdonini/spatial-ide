// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { expect } from "vitest";

/**
 * Shared by `skp/__tests__/fixtures.test.ts` and `console/renderTruth.test.ts` (NEXT-CUT.md P1 --
 * "assertExactKeys reused"). TypeScript `interface`s are erased at runtime and give this client no
 * free protection against an extra or missing field on a loaded fixture object -- this checks the
 * fixture's actual key set against the exact set the caller expects, the same way
 * `renderer/tests/data/manifest-key-sets.json` closes the equivalent gap for the bundle manifest.
 *
 * One implementation only. If a second call site needs this, import it from here rather than
 * writing a second copy.
 */
export function assertExactKeys(value: unknown, expected: readonly string[], label: string): void {
  expect(Object.keys(value as Record<string, unknown>).sort(), label).toEqual([...expected].sort());
}
