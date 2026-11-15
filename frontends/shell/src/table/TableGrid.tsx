// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { TABLE_OVERSCAN_ROWS, TABLE_ROW_HEIGHT_PX } from "./tableConstants";

/**
 * The table's grid (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.4 (d)), with no dependency: the ARIA grid pattern's roles (`grid`, `row`, `columnheader`, `gridcell`, with `aria-rowcount`,
 * `aria-colcount` and `aria-rowindex`), one tab stop (the active cell; the others are `tabindex="-1"`), and Arrows, Home, End, PageUp and PageDown moving the active cell. Rows are windowed: the ones the scroll
 * position shows plus `TABLE_OVERSCAN_ROWS` past each edge, and the active row, so the tab stop always exists. A grid that has not been laid out (no height yet) draws as many rows as `FALLBACK_VIEWPORT_PX` shows.
 */
const FALLBACK_VIEWPORT_PX = 240;
const COLUMN_REM = 10;

export interface TableGridProps {
  /** The grid's accessible name. */
  readonly label: string;
  readonly columns: readonly string[];
  readonly rowCount: number;
  /** The text of one cell. A NULL is its marker here, never an empty string. */
  readonly cellAt: (row: number, column: number) => string;
}

export default function TableGrid({ label, columns, rowCount, cellAt }: TableGridProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const focusAfterRender = useRef(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportPx, setViewportPx] = useState(FALLBACK_VIEWPORT_PX);
  const [active, setActive] = useState({ row: 0, column: 0 });
  const lastColumn = Math.max(0, columns.length - 1);
  const lastRow = Math.max(0, rowCount - 1);
  const activeRow = Math.min(active.row, lastRow);
  const activeColumn = Math.min(active.column, lastColumn);
  const bodyPx = Math.max(TABLE_ROW_HEIGHT_PX, viewportPx - TABLE_ROW_HEIGHT_PX); // the sticky header row covers the top of the viewport
  const page = Math.max(1, Math.floor(bodyPx / TABLE_ROW_HEIGHT_PX));
  const width = `${Math.max(1, columns.length) * COLUMN_REM}rem`;

  useLayoutEffect(() => {
    const element = scroller.current;
    if (element === null) return;
    const measure = () => setViewportPx(element.clientHeight > 0 ? element.clientHeight : FALLBACK_VIEWPORT_PX);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!focusAfterRender.current) return;
    focusAfterRender.current = false;
    scroller.current?.querySelector<HTMLElement>(`[data-cell="${activeRow}:${activeColumn}"]`)?.focus();
  });

  const first = Math.max(0, Math.floor(scrollTop / TABLE_ROW_HEIGHT_PX) - TABLE_OVERSCAN_ROWS);
  const last = Math.min(rowCount - 1, Math.ceil((scrollTop + viewportPx) / TABLE_ROW_HEIGHT_PX) + TABLE_OVERSCAN_ROWS);
  const rendered: number[] = [];
  for (let r = first; r <= last; r++) rendered.push(r);
  if (rowCount > 0 && (activeRow < first || activeRow > last)) rendered.push(activeRow);

  function move(row: number, column: number): void {
    const next = { row: Math.min(lastRow, Math.max(0, row)), column: Math.min(lastColumn, Math.max(0, column)) };
    const element = scroller.current;
    if (element !== null) {
      const top = next.row * TABLE_ROW_HEIGHT_PX;
      if (top < element.scrollTop) element.scrollTop = top;
      else if (top + TABLE_ROW_HEIGHT_PX > element.scrollTop + bodyPx) element.scrollTop = top + TABLE_ROW_HEIGHT_PX - bodyPx;
      setScrollTop(element.scrollTop);
    }
    focusAfterRender.current = true;
    setActive(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const { row, column } = { row: activeRow, column: activeColumn };
    switch (event.key) {
      case "ArrowDown": return handled(event, () => move(row + 1, column));
      case "ArrowUp": return handled(event, () => move(row - 1, column));
      case "ArrowRight": return handled(event, () => move(row, column + 1));
      case "ArrowLeft": return handled(event, () => move(row, column - 1));
      case "PageDown": return handled(event, () => move(row + page, column));
      case "PageUp": return handled(event, () => move(row - page, column));
      case "Home": return handled(event, () => (event.ctrlKey ? move(0, 0) : move(row, 0)));
      case "End": return handled(event, () => (event.ctrlKey ? move(lastRow, lastColumn) : move(row, lastColumn)));
    }
  }

  return (
    <div role="grid" aria-label={label} aria-rowcount={rowCount + 1} aria-colcount={columns.length} className="table-grid" ref={scroller} onKeyDown={onKeyDown} onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}>
      <div role="row" aria-rowindex={1} className="table-grid-row table-grid-head" style={{ gridTemplateColumns: `repeat(${Math.max(1, columns.length)}, ${COLUMN_REM}rem)`, width }}>
        {columns.map((name, c) => (
          <div key={name} role="columnheader" aria-colindex={c + 1} className="table-grid-cell">
            {name}
          </div>
        ))}
      </div>
      <div role="rowgroup" className="table-grid-body" style={{ height: rowCount * TABLE_ROW_HEIGHT_PX, width }}>
        {rendered.map((r) => (
          <div
            key={r}
            role="row"
            aria-rowindex={r + 2}
            className="table-grid-row"
            style={{ top: r * TABLE_ROW_HEIGHT_PX, height: TABLE_ROW_HEIGHT_PX, gridTemplateColumns: `repeat(${Math.max(1, columns.length)}, ${COLUMN_REM}rem)`, width }}
          >
            {columns.map((name, c) => (
              <div
                key={name}
                role="gridcell"
                aria-colindex={c + 1}
                data-cell={`${r}:${c}`}
                tabIndex={r === activeRow && c === activeColumn ? 0 : -1}
                className="table-grid-cell"
                onFocus={() => setActive({ row: r, column: c })}
              >
                {cellAt(r, c)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function handled(event: KeyboardEvent<HTMLDivElement>, run: () => void): void {
  event.preventDefault();
  run();
}
