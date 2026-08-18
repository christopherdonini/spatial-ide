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
 * One recorded entry. `kind` is a discriminated union deliberately started at one member:
 * P1 adds the formatter for `"skp-request"`; P2 adds class-B (`"tauri-command"`, name only, no
 * argument object per ADR-024's fence) and class-C (`"no-api-equivalent"`) kinds additively, each
 * a new member of this union, never a change to this one's shape.
 */
export type ConsoleEntry = SkpRequestEntry;

export type ConsoleEntryOutcome = "pending" | "ok" | "refused" | "threw";

export interface SkpRequestEntry {
  seq: number;
  kind: "skp-request";
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
   * invisible to its caller (`call()`'s contract). */
  record(request: unknown): EntryHandle {
    const entry: SkpRequestEntry = {
      seq: this.nextSeq++,
      kind: "skp-request",
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
