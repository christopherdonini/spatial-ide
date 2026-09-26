// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// One esbuild bundle re-exporting both, so `instanceof BundleFailure` is meaningful across the
// pair (PARTITION-OFFSET-BOUNDS-PREREGISTRATION.md §4): bundling `decodePartition` and `BundleFailure`
// separately would give the test two distinct copies of the `BundleFailure` class.
export { decodePartition } from '../src/partition.js';
export { BundleFailure } from '../src/failure.js';
