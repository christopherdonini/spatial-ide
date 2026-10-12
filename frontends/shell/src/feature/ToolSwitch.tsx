// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { actionEntry } from "../layout/actionRegistry";
import type { ToolActionId } from "../layout/actionRegistry";
import type { SelectionMode } from "../workspace/selection";
import type { Tool } from "../workspace/workspaceState";

/**
 * The tool switch (SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md §2.2): the active tool, always visible and outside the
 * map (rule 11), in the top bar's `topBar.tools` slot. It shows the active tool (`aria-pressed`), states in one line what
 * a click does in each tool, and shows the mode picker only while Select is active (Amendment 1 A4).
 *
 * A pure view: it holds no state and records nothing. `onSelectTool` and `onSelectMode` are App's handlers, which
 * dispatch the typed transitions and write the class-C row. The labels and the keys come from the registry's entries, so
 * the buttons and the bare keys (`matchToolKey`) cannot disagree.
 *
 * The two tool labels and the four mode labels are the human's (Amendment 1 A11); the lines are P6 placeholders.
 */

const TOOLS: readonly { readonly tool: Tool; readonly action: ToolActionId; readonly click: string }[] = [
  { tool: "navigate", action: "tool.navigate", click: "a click inspects the feature." },
  { tool: "select", action: "tool.select", click: "a click changes the selection, by the mode." },
];

/** The four modes, in v7's order, with the labels the human approved (Amendment 1 A11). */
const MODES: readonly { readonly mode: SelectionMode; readonly label: string }[] = [
  { mode: "toggle", label: "Add / remove" },
  { mode: "replace", label: "Replace" },
  { mode: "add", label: "Add only" },
  { mode: "remove", label: "Remove only" },
];

export function ToolSwitch({
  tool,
  mode,
  onSelectTool,
  onSelectMode,
}: {
  tool: Tool;
  mode: SelectionMode;
  onSelectTool: (tool: Tool) => void;
  onSelectMode: (mode: SelectionMode) => void;
}) {
  return (
    <div className="tool-switch" role="group" aria-label="[P6 placeholder] Map tool">
      <div className="tool-switch-row">
        {TOOLS.map(({ tool: candidate, action }) => {
          const entry = actionEntry(action);
          return (
            <button
              key={candidate}
              type="button"
              className="tool-switch-button"
              aria-pressed={tool === candidate}
              aria-keyshortcuts={entry.bareKey?.letter.toUpperCase()}
              aria-describedby={`tool-switch-hint-${candidate}`}
              onClick={() => onSelectTool(candidate)}
            >
              {entry.label}
            </button>
          );
        })}
        {tool === "select" && (
          <div className="tool-switch-modes" role="group" aria-label="[P6 placeholder] Selection mode">
            {MODES.map(({ mode: candidate, label }) => (
              <button
                key={candidate}
                type="button"
                className="tool-switch-mode"
                aria-pressed={mode === candidate}
                onClick={() => onSelectMode(candidate)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="tool-switch-hints">
        {TOOLS.map(({ tool: candidate, action, click }) => {
          const entry = actionEntry(action);
          return (
            <span key={candidate} id={`tool-switch-hint-${candidate}`} className="tool-switch-hint">
              {`[P6 placeholder] ${entry.label} (${entry.bareKey?.letter.toUpperCase()}): ${click}`}
            </span>
          );
        })}
      </div>
    </div>
  );
}
