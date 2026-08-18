// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { DescribeResponse } from "../skp/types";
import { crsSummaryLine, identitySummaryLine } from "./describeSummaryText";

/** Success shows schema, identity, row count and license as `describe` actually established them
 * -- never a dataset extent or an unqualified feature count (NEXT-CUT.md's brief said "bounds,
 * feature count"; the architect review found neither exists at open and corrected both, recorded in
 * `protocol/skp/SKP-V0.md` §2 as C1/C2). */
export default function DescribeSummary({ describe }: { describe: DescribeResponse }) {
  const rowCount =
    describe.row_count.value !== null
      ? `${describe.row_count.value} (${describe.row_count.basis})`
      : `not established (${describe.row_count.basis})`;

  return (
    <div className="describe-summary">
      <dl>
        <dt>CRS</dt>
        <dd>{crsSummaryLine(describe.crs)}</dd>

        <dt>Geometry</dt>
        <dd>
          {describe.geometry.column} ({describe.geometry.encoding})
        </dd>

        <dt>Identity</dt>
        <dd>{identitySummaryLine(describe.identity)}</dd>

        <dt>Row count</dt>
        <dd>{rowCount}</dd>

        <dt>Extent</dt>
        <dd>
          not established at open — the canvas fits to features as they stream in (a
          dataset-extent operation is not part of this build)
        </dd>

        <dt>Schema</dt>
        <dd>{describe.schema.length} columns</dd>

        <dt>License</dt>
        <dd>{describe.license.declares_anything ? (describe.license.license ?? "declared, no license name") : "not declared"}</dd>
      </dl>
    </div>
  );
}
