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
   */
  async requestViewport(bbox: Bbox | null, bboxCrs: string | null, nowMs: number = Date.now()): Promise<void> {
    if (this.stopped) {
      return;
    }
    if (nowMs - this.lastIssuedAtMs < VIEWPORT_QUERY_MIN_INTERVAL_MS) {
      return;
    }
    this.lastIssuedAtMs = nowMs;

    // Claimed before any `await` below, so a concurrent call that starts later (and therefore
    // claims a higher generation) can be detected by this call after it resumes.
    const myGeneration = ++this.generation;

    await this.supersedeCurrent();
    if (myGeneration !== this.generation) {
      return; // superseded (or stopped, which also bumps the generation) while cancelling the previous stream
    }

    const { stream } = await viewportQuery(this.opts.dataset, bbox, bboxCrs, null);
    if (myGeneration !== this.generation) {
      // A newer call (or stop()) won the race while this ticket was minting. This call is the only
      // thing that knows this handle exists, so it is the only thing that will ever cancel it.
      await skpCancel(stream).catch(() => {});
      return;
    }
    this.currentStreamHandle = stream;
    this.nextBatchSeq = 0;

    const attach = await dataPlaneAttach();
    if (myGeneration !== this.generation) {
      await skpCancel(stream).catch(() => {});
      if (this.currentStreamHandle === stream) {
        this.currentStreamHandle = null;
      }
      return;
    }

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
   * `requestViewport`'s own supersede step and by `stop()`. */
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
