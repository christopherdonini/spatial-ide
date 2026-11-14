// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { parseStyleState } from "./document";
import type { StyleState } from "./document";

/** The legend's two fixed labels (P6 placeholders). A case is labelled by its value. */
export const LEGEND_NULL_LABEL = "[P6 placeholder] No value";
export const LEGEND_OTHER_LABEL = "[P6 placeholder] Other";
const LEGEND_EMPTY_VALUE_LABEL = "[P6 placeholder] (empty text)";

/**
 * The legend of a style that colours by category (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.3 (f)): `Style.legend` in the order the
 * resolver gives it, the cases, then No value, then Other, each swatch the `fillColor` the resolver drew for that entry. It is a function of the
 * style alone, never of the data on the map. Nothing is drawn for a one-colour style.
 */
export default function Legend({ style }: { style: StyleState }) {
  const parsed = parseStyleState(style);
  if (parsed.matchColumn === null) return null;
  return (
    <ul className="style-legend" aria-label={`[P6 placeholder] Legend for ${parsed.matchColumn}`}>
      {parsed.legend.map((entry, index) => {
        const label = entry.kind.kind === "case" ? (entry.kind.value === "" ? LEGEND_EMPTY_VALUE_LABEL : entry.kind.value) : entry.kind.kind === "null" ? LEGEND_NULL_LABEL : LEGEND_OTHER_LABEL;
        return (
          <li key={index} className="style-legend-entry">
            <span className="style-legend-swatch" style={{ backgroundColor: entry.draw.fillColor }} />
            <span className="style-legend-label">{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
