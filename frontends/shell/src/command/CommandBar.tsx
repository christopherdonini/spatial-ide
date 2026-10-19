// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, MutableRefObject } from "react";

import { shortcutLabel } from "../layout/actionRegistry";
import type { ActionEntry, ActionId, Platform } from "../layout/actionRegistry";
import { COMMAND_LIST_MAX_HEIGHT_PX } from "./commandConstants";
import { commandBarKey, completionOf, resolveDraft, typeDraft } from "./commandDraft";
import type { BarPos, Draft } from "./commandDraft";

/**
 * The command bar (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 2.3, PR A): one text input in the top bar with the APG combobox roles, and a list that
 * is rendered only while open. It lists and runs registry entries and owns no behaviour of its own: an applied entry calls `run`, StudioLayout's one
 * `runAction`, the function its chord, bare key or button calls. Keys go through `commandBarKey`; the draft goes through `resolveDraft`. The list and the
 * one-line note are `position: fixed` below the top bar (whose `overflow: hidden` would clip them), never over the map while closed. Every operator string is a P6 placeholder.
 */

/** What a run left behind: the action is done and the bar gives the focus back, or it moved the focus itself, or it could not start. */
export type RunOutcome = "done" | "moved-focus" | "busy";

export const COMMAND_LIST_ID = "command-list";
export const COMMAND_UNAVAILABLE_MARK = "[P6 placeholder] not available";
export const COMMAND_UNAVAILABLE_NOTE = "[P6 placeholder] That command is not available right now.";
export const COMMAND_BUSY_NOTE = "[P6 placeholder] A file is already being opened.";
export const COMMAND_EMPTY_NOTE = "[P6 placeholder] Type a command, or ? for the list.";
export const COMMAND_PICK_NOTE = "[P6 placeholder] Choose a command with the arrow keys, or press Tab to complete its name.";
export const COMMAND_UNKNOWN_NOTE = "[P6 placeholder] No command has that name. Type ? for the list.";
export const COMMAND_NONE_NOTE = "[P6 placeholder] Nothing matches that.";

/** The shell's one line for Enter on a draft that does not resolve to a command, or `null` for one that does. */
function noteFor(draft: Draft): string | null {
  switch (draft.kind) {
    case "empty":
      return COMMAND_EMPTY_NOTE;
    case "unresolved":
      return COMMAND_UNKNOWN_NOTE;
    case "run":
      return null;
    default:
      return draft.candidates.length === 0 ? COMMAND_NONE_NOTE : COMMAND_PICK_NOTE;
  }
}

export interface CommandBarProps {
  readonly registry: readonly ActionEntry[];
  readonly platform: Platform;
  readonly available: (id: ActionId) => boolean;
  readonly run: (id: ActionId) => RunOutcome;
  /** Gives the focus back (Escape, and after an applied action). */
  readonly leave: () => void;
  /** Written with the element that held the focus before the bar took it; StudioLayout keeps it and restores it in `leave`. */
  readonly held: MutableRefObject<Element | null>;
}

export interface CommandBarHandle {
  /** Ctrl+K: focus the input and select its text, doing nothing when it already has the focus. The bare `/`: focus it with `draft` in it. */
  take(draft?: string): void;
}

const optionId = (index: number): string => `${COMMAND_LIST_ID}-option-${index}`;

const CommandBar = forwardRef<CommandBarHandle, CommandBarProps>(function CommandBar({ registry, platform, available, run, leave, held }, ref) {
  const [pos, setPos] = useState<BarPos>(() => typeDraft(""));
  const [note, setNote] = useState<string | null>(null);
  const [left, setLeft] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const taking = useRef(false);

  const draft = resolveDraft(pos.draft, registry, available);
  const candidates = "candidates" in draft ? draft.candidates : [];
  const shown = pos.open && candidates.length > 0;

  useImperativeHandle(
    ref,
    () => ({
      take(text) {
        const input = inputRef.current;
        if (input === null || (document.activeElement === input && text === undefined)) return;
        if (document.activeElement !== input) held.current = document.activeElement;
        taking.current = true;
        input.focus();
        taking.current = false;
        if (text === undefined) input.select();
        else {
          setPos(typeDraft(text));
          setNote(null);
        }
      },
    }),
    [held]
  );

  // The list and the note sit at the input's left edge, read when either opens and on a window resize while one is open.
  useLayoutEffect(() => {
    if (!shown && note === null) return;
    const place = () => setLeft(inputRef.current?.getBoundingClientRect().left ?? 0);
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [shown, note]);

  const close = () => setPos((p) => ({ ...p, open: false, active: null }));

  function applyEntry(id: ActionId, isAvailable: boolean): void {
    close();
    if (!isAvailable) return setNote(COMMAND_UNAVAILABLE_NOTE);
    const outcome = run(id);
    if (outcome === "busy") return setNote(COMMAND_BUSY_NOTE);
    setNote(null);
    if (outcome === "done") leave();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return; // the chords belong to the window's listener
    const composing = event.nativeEvent.isComposing || event.keyCode === 229;
    const step = commandBarKey({ ...pos, open: shown, completions: candidates.map((c) => completionOf(c.entry)) }, { key: event.key, shiftKey: event.shiftKey, isComposing: composing });
    if (step.preventDefault) event.preventDefault();
    if (step.preventDefault || step.pos.draft !== pos.draft) setNote(null);
    setPos(step.pos);
    if (step.effect.kind === "leave") leave();
    else if (step.effect.kind === "apply") {
      const chosen = candidates[step.effect.index];
      applyEntry(chosen.entry.id, chosen.available);
    } else if (step.effect.kind === "applyDraft") {
      if (draft.kind === "run") applyEntry(draft.id, draft.available);
      else {
        close();
        setNote(noteFor(draft));
      }
    }
  }

  return (
    <div className="command-bar">
      <input
        ref={inputRef}
        className="command-input"
        type="text"
        role="combobox"
        aria-label="[P6 placeholder] Command bar"
        placeholder="[P6 placeholder] Type / for commands or ? for help"
        aria-expanded={shown}
        aria-controls={COMMAND_LIST_ID}
        aria-autocomplete="list"
        aria-activedescendant={shown && pos.active !== null ? optionId(pos.active) : undefined}
        autoComplete="off"
        spellCheck={false}
        value={pos.draft}
        onChange={(event) => {
          setPos(typeDraft(event.target.value));
          setNote(null);
        }}
        onFocus={(event) => {
          if (!taking.current) held.current = event.relatedTarget instanceof Element ? event.relatedTarget : null;
        }}
        onBlur={() => {
          close();
          setNote(null);
        }}
        onKeyDown={onKeyDown}
      />
      {note !== null && (
        <p className="command-note" role="status" style={{ left }}>
          {note}
        </p>
      )}
      {shown && (
        <ul id={COMMAND_LIST_ID} className="command-list" role="listbox" style={{ left, maxHeight: COMMAND_LIST_MAX_HEIGHT_PX }}>
          {candidates.map((candidate, index) => (
            <li
              key={candidate.entry.id}
              id={optionId(index)}
              className="command-option"
              role="option"
              aria-selected={index === pos.active}
              aria-disabled={candidate.available ? undefined : true}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyEntry(candidate.entry.id, candidate.available)}
            >
              <span className="command-option-word">{candidate.entry.command === null ? "" : `/${candidate.entry.command}`}</span>
              <span className="command-option-label">{candidate.entry.label}</span>
              {candidate.entry.chord !== null && <span className="command-option-shortcut">{shortcutLabel(candidate.entry.chord, platform)}</span>}
              {!candidate.available && <span className="command-option-unavailable">{COMMAND_UNAVAILABLE_MARK}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default CommandBar;
