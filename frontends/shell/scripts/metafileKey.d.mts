// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Ambient declaration for `metafileKey.mjs`, so `src/notices/metafileKey.test.ts` (a TypeScript file
// under this package's own `strict`/`noImplicitAny`) can import it without `allowJs`. Same reason
// and same shape as `rustCrateNotices.d.mts` and `renderer/bundle-viewer/notice.d.mts`; kept in sync
// with the module's own exports by hand, there being no other source of truth for a plain-JS module.

export function metafileKeyForModuleId(id: string, root: string): string | null;
