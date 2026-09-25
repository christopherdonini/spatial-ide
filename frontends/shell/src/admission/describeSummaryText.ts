// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { CrsInfo, IdentityInfo, SourceChecks, SourceCoverage } from "../skp/types";

/**
 * `DescribeSummary`'s CRS line -- factored out as a pure function so the asserted-ness rendering
 * (NEXT-CUT.md P3 item E, I3) is directly unit-testable without a React render harness (this
 * package's own convention, `App.test.ts`'s top comment).
 *
 * A caller-asserted CRS renders distinguishably from a file-declared one: identifier, "asserted by
 * `<by>` at `<at>`" (the host-minted attribution, ADR-024 F-5 -- never the wire's, which carries
 * neither), and `definition_provenance` rendered VERBATIM (`catalog:epsg-2056@sha256:...` or
 * `pasted`, ADR-026 decision 2 -- never summarized to a bare "yes"/"trusted"). A file-declared CRS
 * renders exactly as it did before this cut.
 */
export function crsSummaryLine(crs: CrsInfo): string {
  if (crs.source === "caller_asserted") {
    const by = crs.asserted_by ?? "(no asserted_by on the payload)";
    const at = crs.asserted_at ?? "(no asserted_at on the payload)";
    const provenance = crs.definition_provenance ?? "(no definition_provenance on the payload)";
    return (
      `${crs.identifier} — caller-asserted by ${by} at ${at}, ${provenance}, ` +
      `axis order ${crs.axis_order}`
    );
  }
  return `${crs.identifier} — ${crs.source}, axis order ${crs.axis_order}`;
}

/**
 * `DescribeSummary`'s identity line -- renders `uniqueness` VERBATIM, whatever the payload says it
 * is (`"verified-at-open-full-file"`, etc.), never collapsed to the bare word "unique" (I6). Same
 * function for the native `file:id` path and a `mapped:<column>` declaration -- `source` already
 * carries that distinction (`kernel/src/skp.rs`/`engine/src/dataset.rs`), so this function does not
 * need to branch on it.
 */
export function identitySummaryLine(identity: IdentityInfo): string {
  return `${identity.source} — ${identity.uniqueness}`;
}

/**
 * `DescribeSummary`'s CRS provenance row (DECISIONS-PENDING.md, RULED 2026-09-18 round 16, item 1;
 * entry 112; the sight first recorded entry 111 (1)). Renders `crs.provenance` and
 * `crs.axis_provenance` VERBATIM, comma-separated -- their own wire strings
 * (`frontends/shell/src/skp/types.ts:89,92`), never mapped to friendlier words.
 */
export function crsProvenanceLine(crs: CrsInfo): string {
  return `${crs.provenance}, ${crs.axis_provenance}`;
}

/**
 * `DescribeSummary`'s session-identity row (round 16, item 1). Renders `identity.session_statement`
 * VERBATIM (the Rust-constant sentence carried over the wire, `frontends/shell/src/skp/types.ts:124`)
 * when non-null; `null` means this identity is not session-ordinal, and the caller renders no row.
 */
export function sessionStatementLine(identity: IdentityInfo): string | null {
  return identity.session_statement;
}

/**
 * `DescribeSummary`'s display-convention row (DECISIONS-PENDING.md, RULED 2026-09-23 (late), entry
 * 119 item (5); the gap first recorded at entry 113 (3)). Renders `crs.display_convention` VERBATIM
 * (the Rust-constant sentence carried over the wire, `frontends/shell/src/skp/types.ts:100`) when
 * non-null; `null` means this dataset is not a geographic-degrees instance, and the caller renders
 * no row.
 */
export function displayConventionLine(crs: CrsInfo): string | null {
  return crs.display_convention;
}

/**
 * `DescribeSummary`'s checks-only row (`engine/SOURCE-WATCHER-PREREGISTRATION.md` §2d, the
 * `sessionStatementLine` precedent). Renders only for `coverage.state === "checks-only"`, with its
 * reason -- `null` (no row) for `"watching"`. A placeholder and a migration-inventory item (§7):
 * its wording is not settled.
 */
export function checksOnlyStatusLine(coverage: SourceCoverage): string | null {
  if (coverage.state !== "checks-only") {
    return null;
  }
  return `[P6 placeholder] checks-only — ${coverage.reason ?? "(no reason on the payload)"}`;
}

/**
 * `DescribeSummary`'s degraded-checks row (`engine/SOURCE-WATCHER-PREREGISTRATION.md` §2d). Renders
 * only for `checks.state === "degraded"`, listing which structural-descriptor components this open
 * could not establish (`components` is non-empty exactly for `degraded`, per `skp/0.5`'s own
 * discipline) -- `null` (no row) for `"full"`. A placeholder and a migration-inventory item (§7).
 */
export function degradedChecksLine(checks: SourceChecks): string | null {
  if (checks.state !== "degraded") {
    return null;
  }
  return `[P6 placeholder] degraded — unestablished: ${checks.components.join(", ")}`;
}
