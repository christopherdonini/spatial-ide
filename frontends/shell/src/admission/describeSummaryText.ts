// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { CrsInfo, IdentityInfo } from "../skp/types";

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
