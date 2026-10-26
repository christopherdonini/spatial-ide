// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import RefusalBlock from "../admission/RefusalBlock";
import { displayValue } from "../attributes/values";
import type { AttributeRow } from "../attributes/values";
import type { Filter } from "../skp/types";
import type { CapturedRow, SelectionMembers } from "../workspace/selection";
import TableGrid from "./TableGrid";
import { sameFilter, secondScope, selectionLine, TABLE_SCOPES, thirdScope } from "./tableScope";
import type { TableScope } from "./tableScope";
import { EMPTY_TABLE, tableLine } from "./tableSource";
import type { TableSource } from "./tableSource";

/**
 * The Table tab in Activity (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.4): the scope options (plan section 3's labels, the first the default), the grid, and the lines that state what each scope established. Every string
 * but the labels and the word "features" is a P6 placeholder.
 *
 * **When the first scope issues.** Only while the tab is shown (Activity open, this tab selected), the scope is the first, no export consumer is held and the dataset's session has not ended; the effect below cancels the
 * source's stream in its cleanup, so hide, collapse, a scope change, a filter change, an export's consumer and a session end each end it. The source cancels its own handle before it issues another (`tableSource.ts`).
 * The second and third scopes issue nothing: they list the view's selection (`tableScope.ts`).
 */
const NO_SUBSCRIBE = (): (() => void) => () => {};
const NOT_HELD_TEXT = "[P6 placeholder] not held";
const CUT_TEXT = "[P6 placeholder] cut";

export interface TableTabProps {
  readonly source: TableSource | null;
  /** Activity is open and this tab is the selected one. */
  readonly shown: boolean;
  /** An export run holds a consumer of the dataset (section 2.4 (e)). */
  readonly exportHeld: boolean;
  /** The dataset's generation ended (its session ended): the source is cleared and issues nothing again. */
  readonly sessionEnded: boolean;
  readonly viewFilter: Filter | null;
  readonly members: SelectionMembers;
  /** The open's projection set: the columns after `id`. */
  readonly columns: readonly string[];
  /** The canvas handle's `residentIdsStreamedUnder` (App passes it through): the second scope's "an id in a resident batch streamed under the view's filter". */
  readonly residentIdsStreamedUnder: (streamedUnder: (filter: Filter | null) => boolean) => ReadonlySet<bigint>;
  /** True while the map has no scan in flight: the second scope reads the resident set again when this changes. */
  readonly mapSettled: boolean;
  /** The class-C rows (section 2.5), written at the action and before its outcome: App records them (`console/soleCaptureSite.test.ts` names it among the modules that may). */
  readonly recordScopeSet: () => void;
  readonly recordCancel: () => void;
}

function capturedText(row: CapturedRow, name: string): string {
  if (row === null) return "";
  if (row === "not-held") return NOT_HELD_TEXT;
  const cells = Array.isArray(row) ? row : (row as { readonly cut: AttributeRow }).cut;
  const cell = cells.find((candidate) => candidate.name === name);
  if (cell !== undefined) return displayValue(cell.value);
  return Array.isArray(row) ? "" : CUT_TEXT;
}

export default function TableTab({ source, shown, exportHeld, sessionEnded, viewFilter, members, columns, residentIdsStreamedUnder, mapSettled, recordScopeSet, recordCancel }: TableTabProps) {
  const [scope, setScope] = useState<TableScope>("filtered");
  const snapshot = useSyncExternalStore(source?.subscribe ?? NO_SUBSCRIBE, source?.getSnapshot ?? (() => EMPTY_TABLE));

  useEffect(() => {
    if (source === null || !shown || scope !== "filtered" || exportHeld || sessionEnded) return;
    void source.start(viewFilter);
    return () => source.cancel();
  }, [source, shown, scope, exportHeld, sessionEnded, viewFilter]);

  useEffect(() => {
    if (sessionEnded) source?.end();
  }, [source, sessionEnded]);

  const second = useMemo(
    () => (scope === "selected" ? secondScope(members, viewFilter, snapshot, residentIdsStreamedUnder((streamed) => sameFilter(streamed, viewFilter))) : null),
    // `mapSettled` is a trigger only: the resident set is read again when the map's scan state changes.
    [scope, members, viewFilter, snapshot, residentIdsStreamedUnder, mapSettled]
  );
  const listed = useMemo(() => (scope === "filtered" ? [] : scope === "selected" ? second?.listed ?? [] : thirdScope(members)), [scope, second, members]);
  const rowCache = useMemo(() => new Map<number, { readonly id: bigint; readonly row: AttributeRow | null }>(), [snapshot]);

  const cellAt = (row: number, column: number): string => {
    if (scope !== "filtered") {
      const id = listed[row];
      return column === 0 ? id.toString() : capturedText(members.get(id)!.row, columns[column - 1]);
    }
    let held = rowCache.get(row);
    if (held === undefined) {
      held = snapshot.rowAt(row);
      rowCache.set(row, held);
    }
    if (column === 0) return held.id.toString();
    const cell = held.row?.find((candidate) => candidate.name === columns[column - 1]);
    return cell === undefined ? "" : displayValue(cell.value);
  };

  const line =
    scope === "filtered" ? tableLine(snapshot) : selectionLine(scope, members.size, second ?? { listed, failed: 0, notEstablished: 0 });

  return (
    <div className="table-tab">
      <div className="table-head">
        <h3 className="table-heading">features</h3>
        <label className="table-scope">
          [P6 placeholder] Scope{" "}
          <select
            value={scope}
            onChange={(event) => {
              recordScopeSet();
              setScope(event.target.value as TableScope);
            }}
          >
            {TABLE_SCOPES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {scope === "filtered" && exportHeld && (
        <p className="table-note" role="status">
          [P6 placeholder] The table is not loading while an export runs.
        </p>
      )}
      {scope === "filtered" && snapshot.phase === "loading" && (
        <div className="table-liveness" role="status">
          <span>{`[P6 placeholder] Loading features: ${snapshot.count} so far.`}</span>
          <button
            type="button"
            className="table-cancel"
            onClick={() => {
              recordCancel();
              source?.cancel();
            }}
          >
            [P6 placeholder] Cancel
          </button>
        </div>
      )}
      {line !== null && (
        <p className="table-line" role="status">
          {line}
        </p>
      )}
      {scope === "filtered" && snapshot.refusal !== null && <RefusalBlock refusal={snapshot.refusal} />}
      <TableGrid label="[P6 placeholder] features" columns={["id", ...columns]} rowCount={scope === "filtered" ? snapshot.count : listed.length} cellAt={cellAt} />
    </div>
  );
}
