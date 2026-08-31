// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { traceStreamIssued, traceViewportQuery } from "../diagnostics/renderTrace";
import { logSessionEvent } from "../diagnostics/log";
import {
  recordResidencyBatchArrived,
  recordResidencyStreamEnded,
  recordResidencyStreamIssued,
  recordResidencySupersededBytes,
} from "../instrument/residencyInstrument";
import { cancel as skpCancel, viewportQuery } from "../skp/client";
import type { Bbox, Filter } from "../skp/types";
import { startStream } from "./adapterWs";
import { dataPlaneAttach } from "./dataPlaneClient";
import type { StreamSink, Terminal } from "./transport";

/**
 * Declared client-side issue-rate ceiling (ADR-010 rule 6), not a measurement: `viewport_query`
 * mints a ticket per call, and `MAX_PENDING_TICKETS`/`MAX_CONCURRENT_STREAMS` are producer ceilings
 * this shell must not reach purely from pan-gesture frequency.
 */
export const VIEWPORT_QUERY_MIN_INTERVAL_MS = 120;

export interface ViewportStreamManagerOptions {
  dataset: string;
  /** A batch admitted for rendering -- only ever called for the *currently active* stream; a batch
   * belonging to a superseded stream is dropped before this is called (D3.7's own assertable
   * criterion: "zero batches from a superseded stream render after its supersession"). */
  onBatch: (streamHandle: string, batchSeq: number, payload: Uint8Array) => void;
  /** A stream was superseded or closed; its resident batches should be dropped. */
  onSuperseded: (streamHandle: string) => void;
  onTerminal?: (streamHandle: string, terminal: Terminal) => void;
  /** TAG_OPEN reached the transport -- the producer accepted the ticket and is scanning (NEXT-CUT.md
   * P1: "the ONLY batch-independent liveness signal", no protocol change). Only ever called for the
   * *currently active* stream, mirroring `onBatch`'s own guard -- a TAG_OPEN arriving late for a
   * stream this manager has already superseded must not report liveness for a query nobody is
   * waiting on anymore. */
  onStreamOpened?: (streamHandle: string) => void;
}

/**
 * `requestViewport`'s own outcome, reported honestly instead of a uniform `Promise<void>` (NEXT-CUT.md
 * P1: "Panel must not show 'applied' for a call that never issued; cancel needs the issued handle").
 * Reporting only -- every existing throttle/generation/supersede code path in `requestViewport` below
 * is unchanged by this type; it only names, at each existing early return, what already happened:
 *
 * - `"stopped"`: the `stopped`-guard at the very top (`stop()` was already called).
 * - `"throttled"`: the `VIEWPORT_QUERY_MIN_INTERVAL_MS` throttle-guard (a silent no-op, unchanged).
 * - `"superseded"`: any of the three generation-loss checks below (a newer call, or a concurrent
 *   `stop()` -- both bump `this.generation` the same way, and this call cannot tell which one beat
 *   it any more than the pre-existing code could; see those checks' own comments).
 * - `"issued"`: `startStream` actually ran, carrying the real stream handle.
 */
export type RequestOutcome =
  | { kind: "issued"; streamHandle: string }
  | { kind: "throttled" }
  | { kind: "superseded" }
  | { kind: "stopped" };

/**
 * Viewport-driven streaming with supersede-on-pan (NEXT-CUT.md item 3; architect review D3.7).
 *
 * **At most one in-flight viewport stream, actually enforced.** The 120 ms throttle bounds *issue
 * rate*; it is not a mutex, and `viewport_query` crosses Tauri IPC + `spawn_blocking` + a real
 * DuckDB statement preparation (`kernel/RESULTS.md`'s S2 measures this at p50 92.6 ms) -- routinely
 * longer than the throttle window. Two calls can therefore have their awaits interleaved, which is
 * exactly the race a **generation counter** exists to close: each call claims a generation before
 * its first `await`, and every point after an `await` re-checks it before mutating shared state or
 * starting a socket. A call that loses the race cancels whatever ticket it already minted (nobody
 * else knows that handle exists) and does nothing else -- it never touches `currentStreamHandle`.
 */
export class ViewportStreamManager {
  private currentStreamHandle: string | null = null;
  /**
   * The stream handle whose batches are believed resident on the canvas right now, or `null`.
   * Tracked separately from `currentStreamHandle` because that field is nulled the moment a
   * stream's terminal arrives -- Completed, Cancelled, or ProducerFailed alike (`sink.onTerminal`
   * below) -- even though a Completed stream's already-pushed batches stay resident on the canvas
   * until something explicitly clears them. Without this second field, a stream that completes
   * naturally (all its data delivered) *before* the next `requestViewport` call leaves
   * `currentStreamHandle` already `null` by the time `supersedeCurrent` runs, so the old "nothing
   * to cancel, nothing to clear" logic skipped `onSuperseded` entirely for it -- its full residency
   * then coexisted with the next stream's incoming batches, tripping `MAX_RESIDENT_VERTICES` on a
   * viewport that would have fit on its own (in-situ evidence: a completed 100k-fixture load
   * settling at 1,961,249 resident vertices, then an ordinary pan overflowing at ~2.0-2.04M because
   * the finished stream's full residency was still counted alongside the new stream's first
   * batches). `clearResidency` is what actually fires `onSuperseded` now, unconditionally on
   * whichever handle this field names, regardless of whether that stream is still `currentStreamHandle`.
   */
  private residentStreamHandle: string | null = null;
  /** Handles this manager itself cancelled -- via `supersedeCurrent` or `cancelStream` -- and whose
   * eventual terminal (however the transport chooses to report it) is therefore expected, not a
   * failure. Populated at the moment the cancel is issued, not when its terminal arrives, so the
   * decision "did I cancel this" never depends on the terminal's own `kind`. See `sink.onTerminal`
   * below and CANCELLATION-FACTS.md §1: supersede-on-pan's cancel reaches the producer through the
   * SKP path, which yields `TERM_PRODUCER_FAILED` (a `ProducerFailed` terminal here), never
   * `TERM_CANCELLED` -- so `terminal.kind` alone cannot distinguish "I cancelled this, expected"
   * from "this genuinely failed" the way `App.tsx` used to assume.
   */
  private readonly selfCancelledHandles = new Set<string>();
  private nextBatchSeq = 0;
  private lastIssuedAtMs = 0;
  private generation = 0;
  private stopped = false;

  constructor(private readonly opts: ViewportStreamManagerOptions) {}

  /** The stream a batch must belong to in order to be admitted for rendering. `null` when nothing
   * is in flight. */
  get activeStreamHandle(): string | null {
    return this.currentStreamHandle;
  }

  /**
   * Issue a new viewport query, cancelling any prior stream first. Throttled to
   * `VIEWPORT_QUERY_MIN_INTERVAL_MS`; a call inside the throttle window is a silent no-op, exactly
   * as a declared ceiling should behave -- it is not an error for a pan gesture to fire faster than
   * this shell chooses to issue queries. A no-op after `stop()` for the same reason.
   *
   * `filter` (NEXT-CUT.md P5) rides straight through to `skp/client.ts`'s `viewportQuery` -- this
   * method does no filter logic of its own, it is only the seam a future filter panel and the
   * dev-only E2E hook (`App.tsx`'s `queryWithFilter` registration) both call to actually issue a
   * filtered query through the same production streaming path (supersede, ticket mint, transport
   * attach) every other query already uses, rather than a parallel one.
   */
  async requestViewport(
    bbox: Bbox | null,
    bboxCrs: string | null,
    nowMs: number = Date.now(),
    filter: Filter | null = null
  ): Promise<RequestOutcome> {
    if (this.stopped) {
      return { kind: "stopped" };
    }
    if (nowMs - this.lastIssuedAtMs < VIEWPORT_QUERY_MIN_INTERVAL_MS) {
      return { kind: "throttled" };
    }
    this.lastIssuedAtMs = nowMs;
    traceViewportQuery(this.opts.dataset, bbox, bboxCrs);

    // Claimed before any `await` below, so a concurrent call that starts later (and therefore
    // claims a higher generation) can be detected by this call after it resumes.
    const myGeneration = ++this.generation;

    await this.supersedeCurrent();
    if (myGeneration !== this.generation) {
      return { kind: "superseded" }; // superseded (or stopped, which also bumps the generation) while cancelling the previous stream
    }

    const { stream } = await viewportQuery(this.opts.dataset, bbox, bboxCrs, null, filter);
    if (myGeneration !== this.generation) {
      // A newer call (or stop()) won the race while this ticket was minting. This call is the only
      // thing that knows this handle exists, so it is the only thing that will ever cancel it.
      await skpCancel(stream).catch(() => {});
      return { kind: "superseded" };
    }
    this.currentStreamHandle = stream;
    this.residentStreamHandle = stream;
    this.nextBatchSeq = 0;

    const attach = await dataPlaneAttach();
    if (myGeneration !== this.generation) {
      await skpCancel(stream).catch(() => {});
      if (this.currentStreamHandle === stream) {
        this.currentStreamHandle = null;
      }
      if (this.residentStreamHandle === stream) {
        // Never actually started (never reached `startStream` below), so nothing was ever pushed
        // to the canvas under this handle -- there is no residency to clear later.
        this.residentStreamHandle = null;
      }
      return { kind: "superseded" };
    }

    const streamHandleAtStart = stream;
    const sink: StreamSink = {
      onOpen: () => {
        // Mirrors `onBatch`'s own guard immediately below: a TAG_OPEN for a stream this manager has
        // already superseded (the old socket delivering it late, exactly the race `onBatch`'s own
        // comment documents for a stray batch) must never report liveness for a query nobody is
        // waiting on anymore.
        if (this.currentStreamHandle !== streamHandleAtStart) {
          return;
        }
        this.opts.onStreamOpened?.(streamHandleAtStart);
      },
      onBatch: (payload) => {
        // Admitted only if this is still the active stream. A batch that arrives after its stream
        // was superseded is dropped here, never handed to the canvas -- this is the check D3.7's
        // acceptance criterion asks to be asserted rather than eyeballed.
        if (this.currentStreamHandle !== streamHandleAtStart) {
          // P1d suggestion 10: `payload` HAS already arrived over the wire at this point -- only
          // forwarding it is skipped. Counted here (DEV-gated, same discipline as
          // `recordResidencyStreamIssued` above) so this driver's own reported byte totals do not
          // silently under-report a superseded stream's genuinely-received bytes.
          if (import.meta.env.DEV) {
            recordResidencySupersededBytes(payload.byteLength);
          }
          return;
        }
        // Viewport-residency cut P3i (RESIDENCY-PREREGISTRATION.md §12 Amendment 15): DEV-only, the
        // earliest client-observable moment for this batch's own data-plane bytes -- BEFORE decode,
        // right here where the transport layer hands this manager a fully-received message. See
        // `residencyInstrument.ts`'s own `recordBatchArrived` doc comment for why this is a defined
        // proxy, not a true first-TCP-byte timestamp.
        if (import.meta.env.DEV) {
          recordResidencyBatchArrived();
        }
        const seq = this.nextBatchSeq++;
        this.opts.onBatch(streamHandleAtStart, seq, payload);
      },
      onProgress: () => {},
      onTerminal: (terminal) => {
        if (this.currentStreamHandle === streamHandleAtStart) {
          this.currentStreamHandle = null;
        }
        // Viewport-residency cut P1b, M6: the ONE call site covering every terminal transition this
        // stream can reach (Completed, Cancelled, ProducerFailed alike), placed BEFORE the
        // self-cancel-suppression check below -- a self-cancelled stream's terminal is suppressed
        // from reaching `this.opts.onTerminal`, but it still ENDED, and the driver-visible in-flight
        // count (§4b's own "zero in-flight viewport_query streams") must reach zero on every
        // terminal, not only the ones the app's own UI ever hears about. DEV-gated exactly like
        // `recordResidencyStreamIssued` above.
        if (import.meta.env.DEV) {
          recordResidencyStreamEnded();
        }
        // A terminal for a handle this manager itself cancelled (supersede or `cancelStream`) is
        // an expected outcome, not a failure -- even when its `kind` is `ProducerFailed`
        // (CANCELLATION-FACTS.md §1: the SKP cancel path yields `TERM_PRODUCER_FAILED`, never
        // `TERM_CANCELLED`). This manager is the only thing that knows "I cancelled this", so it
        // is the layer that suppresses the banner, not `App.tsx` guessing from `terminal.kind`.
        if (this.selfCancelledHandles.delete(streamHandleAtStart)) {
          logSessionEvent(
            "debug",
            `stream-terminal-self-cancelled: ${streamHandleAtStart}: ${terminal.kind} — ${terminal.detail}`
          );
          return;
        }
        this.opts.onTerminal?.(streamHandleAtStart, terminal);
      },
    };

    startStream({ url: attach.url, subprotocols: attach.subprotocols, ticketHandle: stream, sink });
    // P6 review, should-fix 3: logged at the moment of the real mint, not before -- `traceViewportQuery`
    // above fires on every attempt (throttled or not), this fires only once a ticket actually issued.
    traceStreamIssued(this.opts.dataset, stream);
    // Viewport-residency cut P1 (RESIDENCY-PREREGISTRATION.md §6): DEV-only, same moment
    // `traceStreamIssued` fires -- see `instrument/residencyInstrument.ts`'s own top doc comment
    // for why this check is duplicated at every product call site.
    if (import.meta.env.DEV) {
      recordResidencyStreamIssued();
    }
    return { kind: "issued", streamHandle: stream };
  }

  /** Cancels the current stream (if any) without starting a replacement -- used by
   * `requestViewport`'s own supersede step and by `stop()`. Also clears the canvas's residency for
   * whichever stream last held it (`clearResidency`), regardless of whether that stream was still
   * `currentStreamHandle` at this point -- see `residentStreamHandle`'s own doc comment for why
   * that distinction is exactly the fix for the double-residency defect. */
  private async supersedeCurrent(): Promise<void> {
    const previous = this.currentStreamHandle;
    if (previous !== null) {
      this.currentStreamHandle = null;
      this.selfCancelledHandles.add(previous);
      try {
        await skpCancel(previous);
      } catch {
        // A cancel racing an already-finished stream reports "unknown"/"already_terminal" through
        // the SKP response, not a thrown error; a transport failure calling cancel is not fatal to
        // superseding it client-side either way -- the new query proceeds regardless.
      }
    }
    this.clearResidency();
  }

  /**
   * Drops the canvas's residency for whichever stream last held it (`residentStreamHandle`), if
   * any -- called synchronously as part of `supersedeCurrent`, i.e. at the moment a new
   * `requestViewport` call decides to supersede, never deferred to when a terminal happens to
   * arrive. This runs unconditionally, even when the previously-resident stream had already
   * reached its own terminal on its own (nothing left in `currentStreamHandle` to cancel): its
   * already-pushed batches are still on the canvas either way, and are exactly what must be gone
   * before the new stream's first batch is admitted.
   */
  private clearResidency(): void {
    const resident = this.residentStreamHandle;
    if (resident === null) {
      return;
    }
    this.residentStreamHandle = null;
    this.opts.onSuperseded(resident);
  }

  /**
   * Cancel a specific stream by handle, regardless of whether it is the currently active one --
   * the canvas's own declared-ceiling refusal (`ResidentVertexCeilingExceeded`, `PickCeilingExceeded`)
   * names a stream that violated a resident limit and must stop, which is a different reason to
   * cancel than "a newer viewport superseded it" and must work even if a *newer* stream has since
   * become active.
   */
  async cancelStream(streamHandle: string): Promise<void> {
    if (this.currentStreamHandle === streamHandle) {
      this.currentStreamHandle = null;
    }
    this.selfCancelledHandles.add(streamHandle);
    try {
      await skpCancel(streamHandle);
    } catch {
      // See supersedeCurrent's identical reasoning.
    }
  }

  /** Cancel the active stream, if any, and refuse every future `requestViewport` call -- called on
   * dataset close. Also invalidates any `requestViewport` call already in flight, so it abandons
   * its own ticket instead of assigning it as active after this manager is supposed to be done. */
  async stop(): Promise<void> {
    this.stopped = true;
    this.generation++;
    await this.supersedeCurrent();
  }
}
