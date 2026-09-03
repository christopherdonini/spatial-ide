// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The shared gate predicate for the E2E test surface + the client-side half of the residency
 * instrument's own call-site guards (viewport-residency cut P3r, `RESIDENCY-PREREGISTRATION.md`
 * §12 Amendment 16). Replaces bare `import.meta.env.DEV` at the gate sites this piece is scoped
 * to touch (`e2e-test-surface.ts`, `App.tsx`, `admission/AdmissionPanel.tsx`) -- everywhere else
 * that still reads `import.meta.env.DEV` directly (`src/canvas/`, `src/streaming/`,
 * `src/residency/`, `src/instrument/residencyInstrument.ts`) is under this cut's own forbidden
 * list (concurrent mini-review) and was deliberately left untouched; see this piece's own report
 * for the resulting gap (`residencyInstrument.ts`'s `enableResidencyInstrument` carries the one
 * gate this predicate could not reach).
 *
 * `true` for a plain dev build (`import.meta.env.DEV`, unchanged) OR a **measure build**
 * (`import.meta.env.VITE_MEASURE_BUILD === "1"`, set only by `.env.measure` /
 * `vite build --mode measure`, this cut's third, release-optimized-but-instrumented build class --
 * never a shipped default, docs/09's dev/debug-gate discipline). `false` for a plain production
 * build (`npm run build` / `vite build`), exactly as `import.meta.env.DEV` alone already was --
 * this predicate only WIDENS which builds keep the gated code, never narrows it.
 *
 * Vite replaces both `import.meta.env.DEV` and `import.meta.env.VITE_MEASURE_BUILD` with literal
 * values at build time (the same static-replacement + dead-code-elimination mechanism
 * `e2e-test-surface.ts`'s own top comment documents for `DEV` alone), so a plain production build
 * still reduces this function's body to `return false`, keeping every existing
 * `check:dist-clean` guarantee intact.
 */
export function isInstrumentedBuild(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_MEASURE_BUILD === "1";
}
