import { cancel as skpCancel, viewportQuery } from "../skp/client";
import type { Bbox } from "../skp/types";
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
}

/**
 * Viewport-driven streaming with supersede-on-pan (NEXT-CUT.md item 3; architect review D3.7).
 *
 * **At most one in-flight viewport stream.** A new viewport calls `cancel` on the previous stream
 * *before* issuing the next `viewport_query` -- it does not wait for the previous terminal. This
 * ordering is what "supersede" means as opposed to "run both": the old stream's cancellation
 * reaches the producer directly (ADR-019 D2.4) while the new one is already being requested.
 */
export class ViewportStreamManager {
  private currentStreamHandle: string | null = null;
  private nextBatchSeq = 0;
  private lastIssuedAtMs = 0;

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
   * this shell chooses to issue queries.
   */
  async requestViewport(bbox: Bbox | null, bboxCrs: string | null, nowMs: number = Date.now()): Promise<void> {
    if (nowMs - this.lastIssuedAtMs < VIEWPORT_QUERY_MIN_INTERVAL_MS) {
      return;
    }
    this.lastIssuedAtMs = nowMs;

    await this.supersedeCurrent();

    const { stream } = await viewportQuery(this.opts.dataset, bbox, bboxCrs, null);
    this.currentStreamHandle = stream;
    this.nextBatchSeq = 0;

    const attach = await dataPlaneAttach();
    const streamHandleAtStart = stream;

    const sink: StreamSink = {
      onOpen: () => {},
      onBatch: (payload) => {
        // Admitted only if this is still the active stream. A batch that arrives after its stream
        // was superseded is dropped here, never handed to the canvas -- this is the check D3.7's
        // acceptance criterion asks to be asserted rather than eyeballed.
        if (this.currentStreamHandle !== streamHandleAtStart) {
          return;
        }
        const seq = this.nextBatchSeq++;
        this.opts.onBatch(streamHandleAtStart, seq, payload);
      },
      onProgress: () => {},
      onTerminal: (terminal) => {
        if (this.currentStreamHandle === streamHandleAtStart) {
          this.currentStreamHandle = null;
        }
        this.opts.onTerminal?.(streamHandleAtStart, terminal);
      },
    };

    startStream({ url: attach.url, subprotocols: attach.subprotocols, ticketHandle: stream, sink });
  }

  /** Cancels the current stream (if any) without starting a replacement -- used by
   * `supersedeCurrent` and by an explicit stop (e.g. dataset close). */
  private async supersedeCurrent(): Promise<void> {
    const previous = this.currentStreamHandle;
    if (previous === null) {
      return;
    }
    this.currentStreamHandle = null;
    try {
      await skpCancel(previous);
    } catch {
      // A cancel racing an already-finished stream reports "unknown"/"already_terminal" through
      // the SKP response, not a thrown error; a transport failure calling cancel is not fatal to
      // superseding it client-side either way -- the new query proceeds regardless.
    }
    this.opts.onSuperseded(previous);
  }

  /** Cancel the active stream, if any, and stop issuing queries -- called on dataset close. */
  async stop(): Promise<void> {
    await this.supersedeCurrent();
  }
}
