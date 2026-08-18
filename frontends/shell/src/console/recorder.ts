// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The action console's recorder (NEXT-CUT.md P0). A bounded in-memory log of every request the
 * shell actually sent, captured at the ONE choke point `skp/client.ts::call()` (I1) -- see that
 * file's `record`/resolve calls, which are the only site permitted to import this module outside
 * this directory and its own tests (enforced by `soleCaptureSite.test.ts`).
 *
 * `record()` takes the EXACT object reference `call()` hands to `invoke` -- no clone, no
 * structured-clone round trip, no `JSON.parse(JSON.stringify(...))`. That reference is I2: a
 * future formatter (P1) proves display truth by asserting `entries()[i].request` `toBe` the
 * fixture object, which a copy would silently defeat. This module therefore does not, and must
 * not, mutate or serialize `request` itself -- rendering is P1's job.
 *
 * This is a session's working set, not a durable log: no persistence, no export (NEXT-CUT.md
 * non-goals, ADR-006 class 2/3; `docs/09`). It survives only in memory, only for the running
 * session.
 *
 * Zero DOM, zero React: this module imports nothing from either, matching `docs/02`'s
 * clients-only rule for anything that isn't UI.
 */

/** A caller-declared refusal -- the shape already carried by `SkpError` (`skp/client.ts`,
 * `skp/types.ts`): a stable code, a human message, and named fields. Kept as its own type here
 * rather than importing `SkpError` so this module has zero dependency on the SKP wire types --
 * P1/P2 (class B/C entries) will not need to know what an `SkpError` is to add a new `kind`. */
export interface ConsoleRefusal {
  code: string;
  message: string;
  fields: Record<string, string>;
}

/**
 * One recorded entry. `kind` is a discriminated union that started at one member (P0) and now
 * carries all three of NEXT-CUT.md's display classes (P3): `SkpRequestEntry` (class A, P1's
 * formatter target), `BindingCommandEntry` (class B), and `GuiActionEntry` (class C).
 *
 * Class B/C entries are captured through `recordNamed` below, NEVER through `record()` -- that
 * split is the designed resolution of the I1 tension (NEXT-CUT.md P3 item A): `recordNamed`
 * accepts only a string `name`, so there is no parameter an argument object could ever occupy for
 * a binding command or a GUI action, by construction of the type signature itself, not by
 * convention or review. `record()` (the full, request-carrying API) stays the ONE choke point for
 * class A (I1 unchanged); `recordNamed` is a second, narrower choke point for classes B/C, and
 * `soleCaptureSite.test.ts` enforces both allowlists mechanically, as two separate scans.
 */
export type ConsoleEntry = SkpRequestEntry | BindingCommandEntry | GuiActionEntry;

export type ConsoleEntryOutcome = "pending" | "ok" | "refused" | "threw";

export interface SkpRequestEntry {
  seq: number;
  kind: "skp-request";
  /** The SKP command name this request was sent for (e.g. `"describe"`) -- sourced from
   * `call()`'s own `command` parameter, the literal string already passed to `invoke` (never
   * re-derived from `request`'s own shape: `DescribeRequest` and `CloseDatasetRequest` are both
   * exactly `{skp, dataset}` and cannot be told apart by their fields alone). Optional only so
   * entries built directly against this interface before this field existed (`recorder.test.ts`'s
   * own fixtures) keep compiling; every entry `skp/client.ts::call()` produces carries it. */
  command?: string;
  /** The exact reference handed to `invoke` -- see this module's header on I2. Never cloned. */
  request: unknown;
  outcome: ConsoleEntryOutcome;
  /** Present only when `outcome === "refused"` -- a typed `SkpError`, distinct from an untyped
   * transport throw (`error`). Mirrors `SkpCallError` vs. a bare rethrow in `skp/client.ts`. */
  refusal?: ConsoleRefusal;
  /** Present only when `outcome === "threw"` -- an untyped transport failure, not a typed
   * refusal. */
  error?: string;
}

/** Class B (NEXT-CUT.md's "binding-local Tauri commands"): the command's NAME only, never its
 * argument object (ADR-024's fence) -- there is no field here one could occupy. `outcome` has no
 * `"refused"` member: a binding command is host-local UI furniture, not an SKP request, and never
 * produces a typed `SkpError`-shaped refusal at this boundary (a `{status: "refused"}` VALUE some
 * of these commands resolve with, e.g. `binding_publish_execute`, is a resolved outcome, not a
 * rejected promise -- it is `"ok"` at this layer; the registry row's own prose is what a reader
 * consults for what the command does, not this entry). */
export interface BindingCommandEntry {
  seq: number;
  kind: "binding-command";
  /** The binding command's own name, e.g. `"binding_pick_file"` -- matched against
   * `surfaceRegistry.ts`'s `ClassBRow.command` for display. */
  command: string;
  outcome: "pending" | "ok" | "threw";
  /** Present only when `outcome === "threw"`. */
  error?: string;
}

/** Class C (NEXT-CUT.md's "no command at all"): a named GUI action with no wire call behind it at
 * all -- a style edit, the panel disclosure toggle, a banner dismiss. No outcome: the action IS
 * its own completion (`recordGuiAction`/`recordNamed("gui-action", ...)` records it at the point
 * it actually applies, never pending, never resolved separately). */
export interface GuiActionEntry {
  seq: number;
  kind: "gui-action";
  /** A stable, dotted action name, e.g. `"style.setFillColor"` -- matched against
   * `surfaceRegistry.ts`'s `ClassCRow.action` for display. */
  action: string;
}

/** Narrowing helpers over the now-three-member `ConsoleEntry` union -- exported so a test can
 * narrow `entries()[i]` to the specific member it expects without an unchecked `as` cast (a
 * mistaken cast would silently read `undefined` off a field that does not exist on the entry's
 * real runtime shape; these throw instead, at the point of the mistake). */
export function isSkpRequestEntry(entry: ConsoleEntry): entry is SkpRequestEntry {
  return entry.kind === "skp-request";
}
export function isBindingCommandEntry(entry: ConsoleEntry): entry is BindingCommandEntry {
  return entry.kind === "binding-command";
}
export function isGuiActionEntry(entry: ConsoleEntry): entry is GuiActionEntry {
  return entry.kind === "gui-action";
}

/**
 * A session's working set, not a log: the recorder is a bounded ring, not an unbounded history.
 * 256 requests covers many minutes of interactive use (`docs/07`'s hero slice is a single
 * open-filter-style-publish session) while keeping the console's own memory footprint negligible
 * next to the datasets it is describing. Oldest entry dropped on overflow, never blocked, never
 * silently truncated without a count -- see `droppedCount()`.
 */
export const MAX_CONSOLE_ENTRIES = 256;

/**
 * A render-time ceiling for how many bytes of an entry's serialized text the console will ever
 * put on screen or into a copy buffer (P1's concern, not this module's -- storage here keeps the
 * live `request` reference, unbounded, because I2 requires the reference itself, not a truncated
 * copy of it). The constant lives here so P1 has exactly one source of truth instead of picking
 * its own number.
 *
 * Set above `engine::crs::MAX_CRS_DEFINITION_BYTES` (65_536, `engine/src/crs.rs`) deliberately: a
 * `CrsAssertion.definition_json` can legitimately be the full 65_536 bytes the kernel admits, and
 * this ceiling must not truncate a legitimately large, valid request before P1 even gets to
 * render it.
 */
export const MAX_ENTRY_RENDER_BYTES = 80_000;

/** Returned by `record()`. The only way to move an entry out of `"pending"` -- `record()` itself
 * never accepts an outcome, so every entry is observably pending between capture and resolution,
 * matching the real pre-await/post-await gap in `call()`. */
export interface EntryHandle {
  resolveOk(): void;
  resolveRefused(refusal: ConsoleRefusal): void;
  resolveThrew(message: string): void;
}

/** Returned by `recordNamed("binding-command", ...)` only -- a `GuiActionEntry` has no in-flight
 * gap to resolve (`recordNamed("gui-action", ...)` returns `void`; see its own doc comment). Two
 * outcomes, not three: no `resolveRefused` -- see `BindingCommandEntry`'s own doc comment for why
 * a binding command never produces a typed refusal at this boundary. */
export interface BindingCommandHandle {
  resolveOk(): void;
  resolveThrew(message: string): void;
}

export type ConsoleListener = () => void;

/**
 * Bounded in-memory recorder. One instance per shell session (the module-level singleton exported
 * below); this class exists mainly so `recorder.test.ts` can construct isolated instances rather
 * than sharing global state across tests.
 */
export class ConsoleRecorder {
  private readonly buffer: ConsoleEntry[] = [];
  private nextSeq = 0;
  private dropped = 0;
  private readonly listeners = new Set<ConsoleListener>();

  /** Records `request` by reference (I2) and returns a handle to resolve its outcome once the
   * in-flight call settles. Never throws, never blocks -- instrumentation must be observationally
   * invisible to its caller (`call()`'s contract). `command` is optional only so pre-P3 fixtures
   * (`recorder.test.ts`) that call this with one argument keep compiling; `skp/client.ts::call()`
   * always supplies it (`SkpRequestEntry.command`'s own doc comment has the reason). */
  record(request: unknown, command?: string): EntryHandle {
    const entry: SkpRequestEntry = {
      seq: this.nextSeq++,
      kind: "skp-request",
      command,
      request,
      outcome: "pending",
    };
    this.push(entry);
    this.notify();

    return {
      resolveOk: () => {
        entry.outcome = "ok";
        this.notify();
      },
      resolveRefused: (refusal: ConsoleRefusal) => {
        entry.outcome = "refused";
        entry.refusal = refusal;
        this.notify();
      },
      resolveThrew: (message: string) => {
        entry.outcome = "threw";
        entry.error = message;
        this.notify();
      },
    };
  }

  /** Class B's own capture, name only (NEXT-CUT.md P3 item A) -- called by `recordNamed`, never
   * directly by a binding-command call site (see `recordNamed`'s own doc comment for the
   * import-level fence `soleCaptureSite.test.ts` enforces). */
  recordBindingCommand(command: string): BindingCommandHandle {
    const entry: BindingCommandEntry = {
      seq: this.nextSeq++,
      kind: "binding-command",
      command,
      outcome: "pending",
    };
    this.push(entry);
    this.notify();

    return {
      resolveOk: () => {
        entry.outcome = "ok";
        this.notify();
      },
      resolveThrew: (message: string) => {
        entry.outcome = "threw";
        entry.error = message;
        this.notify();
      },
    };
  }

  /** Class C's own capture, name only -- no outcome to resolve (the action IS its own
   * completion; see `GuiActionEntry`'s own doc comment). Called by `recordNamed`, never directly. */
  recordGuiAction(action: string): void {
    const entry: GuiActionEntry = {
      seq: this.nextSeq++,
      kind: "gui-action",
      action,
    };
    this.push(entry);
    this.notify();
  }

  /** Drop-with-count on overflow (`engine/src/trace.rs`'s bounded-buffer shape, replicated here
   * as a *shape*, not ported code): the buffer never grows past `MAX_CONSOLE_ENTRIES`, and every
   * eviction increments `dropped` under the same synchronous call that performs it, so the count
   * and the length can never disagree. Unlike `trace.rs` -- which refuses new records once full,
   * because a trace times a fixed run it must not lie about -- this recorder evicts the OLDEST
   * entry instead: it is a session's rolling working set (this file's header), so the newest
   * action a user just took is the one worth keeping visible. Either policy keeps the invariant
   * this module exists to guarantee: an overflow is counted, never silent.
   */
  private push(entry: ConsoleEntry): void {
    if (this.buffer.length >= MAX_CONSOLE_ENTRIES) {
      this.buffer.shift();
      this.dropped++;
    }
    this.buffer.push(entry);
  }

  /** How many entries the ceiling has evicted since this recorder was created. Never silent --
   * see this class's `push`. */
  droppedCount(): number {
    return this.dropped;
  }

  /** Every live entry, oldest first (insertion order survives eviction -- only the oldest ever
   * leaves). A fresh array each call so a caller cannot mutate the recorder's own buffer. */
  entries(): readonly ConsoleEntry[] {
    return [...this.buffer];
  }

  /** Notified on every record and every resolution. Returns an unsubscribe function. A plain
   * listener set -- no framework import, so P3's panel can wrap this in whatever UI binding it
   * uses without this module knowing about it. */
  subscribe(listener: ConsoleListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** Recorder inertness: a listener that throws must never break the caller of `record()`/
   * resolve* -- the recorder is instrumentation for display, never load-bearing. Swallow and
   * `console.error`, then keep notifying the remaining listeners. */
  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("console recorder: a subscriber threw; continuing", e);
      }
    }
  }
}

/** The shell's single recorder instance -- `skp/client.ts::call()` is the only module permitted
 * to call `record()` on it (I1; see `soleCaptureSite.test.ts`). */
export const consoleRecorder = new ConsoleRecorder();

/**
 * The name-only capture API (NEXT-CUT.md P3 item A) -- the designed resolution of the I1 tension
 * for classes B and C. Deliberately narrow: this function's own signature accepts a `kind` and a
 * `name: string`, nothing else -- there is no third parameter for a caller to smuggle an argument
 * object through, so a class-B entry can never carry one BY CONSTRUCTION, not by convention or a
 * reviewer's eye (`recorder.test.ts`'s own `@ts-expect-error` case proves a caller cannot pass one
 * even if they tried).
 *
 * A second, narrower choke point than `consoleRecorder.record()`: every binding-command call site
 * (`streaming/dataPlaneClient.ts`, `diagnostics/log.ts`, `skp/dialog.ts`, `skp/crsCatalog.ts`,
 * `publish/client.ts`) and every class-C handler module (`App.tsx`, `style/StylePanel.tsx`) import
 * THIS function, never `consoleRecorder` itself -- `soleCaptureSite.test.ts` enforces both
 * allowlists as two separate scans, one per exported name, so a module that has no business
 * reaching the full `record(request)` API cannot reach it merely by importing this module for
 * `recordNamed`.
 */
export function recordNamed(kind: "binding-command", name: string): BindingCommandHandle;
export function recordNamed(kind: "gui-action", name: string): void;
export function recordNamed(kind: "binding-command" | "gui-action", name: string): BindingCommandHandle | void {
  if (kind === "binding-command") {
    return consoleRecorder.recordBindingCommand(name);
  }
  consoleRecorder.recordGuiAction(name);
}
