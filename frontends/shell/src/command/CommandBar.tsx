// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, MutableRefObject } from "react";
import { flushSync } from "react-dom";

import RefusalBlock from "../admission/RefusalBlock";
import { CLAUSE_BUSY_LINE, clauseResultLine } from "../filter/ClauseCards";
import { shortcutLabel } from "../layout/actionRegistry";
import type { ActionEntry, ActionId, Platform } from "../layout/actionRegistry";
import type { ClauseResult } from "../workspace/filterClauses";
import { COMMAND_LIST_MAX_HEIGHT_PX } from "./commandConstants";
import { commandBarKey, completionOf, resolveDraft, typeDraft } from "./commandDraft";
import type { BarPos, Draft } from "./commandDraft";
import { completeField, fieldOptions } from "./fieldCompletion";
import type { FieldSource } from "./fieldCompletion";

/**
 * The command bar (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 2.3, PR A; `/filter` and field completion, PR B): one text input in the top bar with the APG combobox roles, and a list that
 * is rendered only while open. It lists and runs registry entries and owns no behaviour of its own: an applied entry calls `run`, StudioLayout's one
 * `runAction`, the function its chord, bare key or button calls. Keys go through `commandBarKey`; the draft goes through `resolveDraft`. The list and the one-line note are `position: fixed` below the top bar (whose `overflow: hidden` would clip them). The list is rendered only while open. The note is rendered only while it holds a line, which goes when the draft changes, when the bar handles a key, or when the input loses the focus. Every operator string is a P6 placeholder.
 *
 * `/filter <condition>` sends the condition to App through `run("filter.addClause", condition)`; an applied one clears the draft and keeps the focus, a refused one keeps the draft and shows the
 * kernel's refusal under the shell's lead line. After an `@` in the condition the list holds the file's field names, and Tab or a click puts the chosen one in, double-quoted; Enter never does.
 */

/** What a run left behind: the action is done and the bar gives the focus back, or it moved the focus itself, or it could not start. */
export type RunOutcome = "done" | "moved-focus" | "busy";

export const COMMAND_LIST_ID = "command-list";
export const COMMAND_UNAVAILABLE_MARK = "[P6 placeholder] not available";
export const COMMAND_UNAVAILABLE_NOTE = "[P6 placeholder] That command is not available right now.";
export const COMMAND_BUSY_NOTE = "[P6 placeholder] A file is already being opened.";
export const COMMAND_EMPTY_NOTE = "[P6 placeholder] Type a command, or ? for the list.";
export const COMMAND_PICK_NOTE = "[P6 placeholder] Choose a command with the arrow keys, then press Enter.";
export const COMMAND_UNKNOWN_NOTE = "[P6 placeholder] No command has that name. Type ? for the list.";
export const COMMAND_NONE_NOTE = "[P6 placeholder] Nothing matches that.";
export const COMMAND_FILTER_EMPTY_NOTE = "[P6 placeholder] Type a condition after /filter.";
export const COMMAND_FIELD_NOTE = "[P6 placeholder] Press Tab to put the field name in, then Enter to add the filter.";
export const commandFieldMore = (hidden: number): string => `[P6 placeholder] ${hidden} more. Type more letters to narrow the list.`;

/** The shell's one line for Enter on a draft that does not resolve to a command, or `null` for one that does. */
function noteFor(draft: Draft): string | null {
  switch (draft.kind) {
    case "empty":
      return COMMAND_EMPTY_NOTE;
    case "unresolved":
      return draft.reason === "filter-empty" ? COMMAND_FILTER_EMPTY_NOTE : COMMAND_UNKNOWN_NOTE;
    case "run":
    case "filter":
      return null;
    default:
      return draft.candidates.length === 0 ? COMMAND_NONE_NOTE : COMMAND_PICK_NOTE;
  }
}

export interface CommandBarProps {
  readonly registry: readonly ActionEntry[];
  readonly platform: Platform;
  readonly available: (id: ActionId) => boolean;
  /** StudioLayout's `runAction`: an entry that takes nothing runs at once; `filter.addClause` takes the condition and answers when the kernel has. */
  readonly run: { (id: ActionId): RunOutcome; (id: ActionId, condition: string): Promise<ClauseResult> };
  /** Gives the focus back (Escape, and after an applied action). */
  readonly leave: () => void;
  /** Written with the element that held the focus before the bar took it; StudioLayout keeps it and restores it in `leave`. */
  readonly held: MutableRefObject<Element | null>;
  /** The file's schema, for field completion; `null` before a dataset is on the map. */
  readonly fields?: FieldSource | null;
  /** A bar or card change is pending: Enter on a `/filter` draft sends nothing and says so. */
  readonly filterPending?: boolean;
}

export interface CommandBarHandle {
  /** Ctrl+K: focus the input and select its text, doing nothing when it already has the focus. The bare `/`: focus it with `draft` in it. */
  take(draft?: string): void;
}

const optionId = (index: number): string => `${COMMAND_LIST_ID}-option-${index}`;

type Refused = Extract<ClauseResult, { kind: "refused" }>;

const CommandBar = forwardRef<CommandBarHandle, CommandBarProps>(function CommandBar({ registry, platform, available, run, leave, held, fields = null, filterPending = false }, ref) {
  const [pos, setPos] = useState<BarPos>(() => typeDraft(""));
  const [note, setNote] = useState<string | Refused | null>(null);
  const [left, setLeft] = useState(0);
  const [caret, setCaret] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const taking = useRef(false);
  const caretAfterRender = useRef<number | null>(null);

  const draft = resolveDraft(pos.draft, registry, available, caret);
  const candidates = "candidates" in draft ? draft.candidates : [];
  const trigger = draft.kind === "filter" && fields !== null ? draft.field : null;
  const fieldList = trigger === null || fields === null ? null : fieldOptions(fields, trigger.partial);
  const completions = trigger === null || fieldList === null ? candidates.map((c) => completionOf(c.entry)) : fieldList.options.map((o) => completeField(pos.draft, trigger, o.name));
  const shown = pos.open && completions.length > 0;

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
          setCaret(text.length);
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

  // A completion in the middle of a condition leaves the caret after the name it put in.
  useLayoutEffect(() => {
    if (caretAfterRender.current !== null) inputRef.current?.setSelectionRange(caretAfterRender.current, caretAfterRender.current);
    caretAfterRender.current = null;
  });

  const close = () => setPos((p) => ({ ...p, open: false, active: null }));

  /** The draft `completion` leaves, with the caret after the part it put in: the list stays closed until the next typed character. */
  function complete(completion: string): void {
    const at = trigger === null || fieldList === null ? completion.length : completion.length - (pos.draft.length - trigger.end);
    setPos({ draft: completion, open: false, active: null, completed: true });
    setCaret(at);
    caretAfterRender.current = at;
    setNote(null);
  }

  function applyEntry(entry: ActionEntry, isAvailable: boolean): void {
    close();
    if (!isAvailable) return setNote(COMMAND_UNAVAILABLE_NOTE);
    if (entry.takes === "condition") return setNote(COMMAND_FILTER_EMPTY_NOTE);
    // The run commits before `leave` reads the page, so the focus goes back as Escape does: not into a region the run closed, nor onto its splitter.
    const outcome = flushSync(() => run(entry.id));
    if (outcome === "busy") return setNote(COMMAND_BUSY_NOTE);
    setNote(null);
    if (outcome === "done") leave();
  }

  /** Enter on `/filter <condition>`: an applied one clears the draft and keeps the focus; any other keeps the draft and says why. */
  async function sendCondition(id: ActionId, condition: string, isAvailable: boolean): Promise<void> {
    close();
    if (!isAvailable) return setNote(COMMAND_UNAVAILABLE_NOTE);
    if (filterPending) return setNote(CLAUSE_BUSY_LINE);
    const result = await run(id, condition);
    if (result.kind === "applied") {
      setPos(typeDraft(""));
      setCaret(0);
      setNote(null);
    } else setNote(result.kind === "refused" ? result : clauseResultLine(result));
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return; // the chords belong to the window's listener
    const composing = event.nativeEvent.isComposing || event.keyCode === 229;
    const step = commandBarKey({ ...pos, open: shown, completions }, { key: event.key, shiftKey: event.shiftKey, isComposing: composing });
    if (step.preventDefault) event.preventDefault();
    if (step.preventDefault || step.pos.draft !== pos.draft) setNote(null);
    if (step.pos.draft !== pos.draft) return complete(step.pos.draft);
    setPos(step.pos);
    if (step.effect.kind === "leave") leave();
    else if (step.effect.kind === "apply") {
      if (fieldList !== null) return setNote(COMMAND_FIELD_NOTE); // Enter never completes
      const chosen = candidates[step.effect.index];
      applyEntry(chosen.entry, chosen.available);
    } else if (step.effect.kind === "applyDraft") {
      if (draft.kind === "run") applyEntry(registry.find((e) => e.id === draft.id) as ActionEntry, draft.available);
      else if (draft.kind === "filter") void sendCondition(draft.id, draft.text, draft.available);
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
        aria-disabled={filterPending && draft.kind === "filter" ? true : undefined}
        autoComplete="off"
        spellCheck={false}
        value={pos.draft}
        onChange={(event) => {
          setPos(typeDraft(event.target.value));
          setCaret(event.target.selectionStart ?? event.target.value.length);
          setNote(null);
        }}
        onSelect={(event) => setCaret(event.currentTarget.selectionStart ?? pos.draft.length)}
        onFocus={(event) => {
          if (!taking.current) held.current = event.relatedTarget instanceof Element ? event.relatedTarget : null;
        }}
        onBlur={() => {
          close();
          setNote(null);
        }}
        onKeyDown={onKeyDown}
      />
      {typeof note === "string" && (
        <p className="command-note" role="status" style={{ left }}>
          {note}
        </p>
      )}
      {note !== null && typeof note !== "string" && (
        <div className="command-note command-result" role="status" style={{ left }}>
          <p>{clauseResultLine(note)}</p>
          <RefusalBlock refusal={note.refusal} />
        </div>
      )}
      {shown && (
        <ul id={COMMAND_LIST_ID} className="command-list" role="listbox" style={{ left, maxHeight: COMMAND_LIST_MAX_HEIGHT_PX }}>
          {fieldList !== null
            ? fieldList.options.map((option, index) => (
                <li key={option.name} id={optionId(index)} className="command-option" role="option" aria-selected={index === pos.active} onMouseDown={(event) => event.preventDefault()} onClick={() => complete(completions[index] as string)}>
                  <span className="command-field-name">{option.name}</span>
                  <span className="command-field-type">{option.arrowType}</span>
                </li>
              ))
            : candidates.map((candidate, index) => (
                <li
                  key={candidate.entry.id}
                  id={optionId(index)}
                  className="command-option"
                  role="option"
                  aria-selected={index === pos.active}
                  aria-disabled={candidate.available ? undefined : true}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyEntry(candidate.entry, candidate.available)}
                >
                  <span className="command-option-word">{candidate.entry.command === null ? "" : `/${candidate.entry.command}`}</span>
                  <span className="command-option-label">{candidate.entry.label}</span>
                  {candidate.entry.chord !== null && <span className="command-option-shortcut">{shortcutLabel(candidate.entry.chord, platform)}</span>}
                  {!candidate.available && <span className="command-option-unavailable">{COMMAND_UNAVAILABLE_MARK}</span>}
                </li>
              ))}
          {fieldList !== null && fieldList.hidden > 0 && (
            <li role="presentation" className="command-field-more">
              {commandFieldMore(fieldList.hidden)}
            </li>
          )}
        </ul>
      )}
    </div>
  );
});

export default CommandBar;
