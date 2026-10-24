// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { formatRefusal } from "../admission/formatRefusal";
import type { FormattedRefusal } from "../admission/formatRefusal";
import { readRow } from "../attributes/values";
import type { AttributeRow } from "../attributes/values";
import { decodeBatch } from "../canvas/decodeBatch";
import type { BatchAttributes } from "../canvas/decodeBatch";
import { logSessionEvent } from "../diagnostics/log";
import { traceStreamIssued, traceViewportQuery } from "../diagnostics/renderTrace";
import { cancel as skpCancel, SkpCallError, viewportQuery } from "../skp/client";
import { encodeDecU64 } from "../skp/codec";
import type { Filter } from "../skp/types";
import { startStream } from "../streaming/adapterWs";
import { dataPlaneAttach } from "../streaming/dataPlaneClient";
import { formatTerminalRefusal } from "../streaming/formatTerminalRefusal";
import { isSessionEndedRefusal, isSessionEndedTerminal, refusalDetailOf } from "../streaming/liveTicketSet";
import type { StreamSink, Terminal } from "../streaming/transport";
import { TABLE_MAX_ATTRIBUTE_BYTES, TABLE_MAX_ROWS } from "./tableConstants";

/**
 * The table's first scope (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.4 (b)): one `viewport_query` with `bbox: null`, the view's filter, `limit` `TABLE_MAX_ROWS` and the open's projection,
 * its batches decoded by the real `decodeBatch` (the geometry is walked and dropped), the ids and attribute blocks kept in arrival order.
 *
 * **One stream, structurally** (Amendment 8 item 3): this source holds one handle, and `start` cancels it, through the client's `cancel`, before it issues the next `viewport_query`. It issues nothing on pan: the tab asks for
 * a start when it is shown, the scope is the first, no export consumer is held and the filter is the view's, and for a cancel when any of those stops being true.
 *
 * **The held bytes** (Amendment 7 item 5): before a batch is added, its `attributes.bytes` joins the sum held; a total past `TABLE_MAX_ATTRIBUTE_BYTES` adds nothing more, cancels the stream and ends the result "stopped", keeping the rows already added.
 */

export type TablePhase = "idle" | "loading" | "completed" | "stopped" | "cancelled" | "refused" | "ended";

interface Block {
  readonly ids: BigUint64Array;
  readonly attributes: BatchAttributes | null;
}

/** What the tab reads. A new object per change; `ids` is the ids of the rows held and only those (section 2.4 (c)). */
export interface TableSnapshot {
  readonly phase: TablePhase;
  /** The filter this result was issued with: `null` for none, and before any issue. */
  readonly filter: Filter | null;
  readonly count: number;
  readonly ids: ReadonlySet<bigint>;
  readonly refusal: FormattedRefusal | null;
  readonly rowAt: (index: number) => { readonly id: bigint; readonly row: AttributeRow | null };
}

export const EMPTY_TABLE: TableSnapshot = { phase: "idle", filter: null, count: 0, ids: new Set(), refusal: null, rowAt: () => { throw new Error("[P6 placeholder] the table holds no rows"); } };

/** Whether the result lists every feature that passes its filter: it ended Completed below the limit (section 2.4 (b)). A cancelled, stopped, refused or limit-sized result is not complete. */
export function resultIsComplete(snapshot: TableSnapshot): boolean {
  return snapshot.phase === "completed" && snapshot.count < TABLE_MAX_ROWS;
}

/** The line a result ends with, a P6 placeholder: the count line for a Completed result, the stopped line (Amendment 7 item 5) for a stopped one, and the shell's own consequence for the rest. `null` while loading or idle. */
export function tableLine(snapshot: TableSnapshot): string | null {
  const n = snapshot.count;
  const filtered = snapshot.filter !== null;
  switch (snapshot.phase) {
    case "completed":
      return n < TABLE_MAX_ROWS
        ? `[P6 placeholder] Showing all ${n} features${filtered ? " that pass the filter" : ""}.`
        : `[P6 placeholder] Showing the first ${n} features returned, in no declared order; ${filtered ? "more may pass the filter" : "the file may hold more"}.`;
    case "stopped":
      return `[P6 placeholder] The table stopped adding features: the next ones returned would have taken its attribute data past 64 MiB. Showing the first ${n} features returned, in no declared order; more may pass the filter.`;
    case "cancelled":
      return `[P6 placeholder] Cancelled. Showing the first ${n} features returned before it stopped, in no declared order; ${filtered ? "more may pass the filter" : "the file may hold more"}.`;
    case "refused":
      return "[P6 placeholder] The table could not be loaded.";
    case "ended":
      return "[P6 placeholder] The file changed, so the table was cleared; open the file again to load it.";
    default:
      return null;
  }
}

export interface TableSourceOptions {
  readonly dataset: string;
  readonly geometryColumn: string;
  readonly geometryEncoding: string;
  /** The open's projection set (`attributes/projection.ts`), sent as `columns` and expected of every batch. */
  readonly projection: string[] | null;
  /** The dataset's session ended (a terminal or a pre-check refusal naming it): the owner's `endSession`, with the `"<code>: <display>"` detail. */
  readonly onSessionEnded: (detail: string) => void;
}

export class TableSource {
  private snapshot: TableSnapshot = EMPTY_TABLE;
  private readonly listeners = new Set<() => void>();
  private blocks: Block[] = [];
  private starts: number[] = [];
  private idSet = new Set<bigint>();
  private count = 0;
  private held = 0;
  private filter: Filter | null = null;
  private phase: TablePhase = "idle";
  private refusal: FormattedRefusal | null = null;
  /** The one stream handle (Amendment 8 item 3). */
  private handle: string | null = null;
  private readonly selfCancelled = new Set<string>();
  private run = 0;
  private disposed = false;
  private ended = false;

  constructor(private readonly opts: TableSourceOptions) {}

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  readonly getSnapshot = (): TableSnapshot => this.snapshot;

  /** Supersedes: cancels the held handle first, then issues for `filter`. A no-op after `end` or `dispose`. */
  async start(filter: Filter | null): Promise<void> {
    if (this.disposed || this.ended) return;
    const mine = ++this.run;
    const previous = this.handle;
    this.handle = null;
    this.reset(filter);
    this.phase = "loading";
    this.emit();
    // The held handle is cancelled before the next `viewport_query`; with none held, one microtask still passes, so a start whose effect is cleaned up at once (React's development double-invoke) issues nothing.
    if (previous !== null) await this.cancelHandle(previous);
    else await Promise.resolve();
    if (mine !== this.run) return;
    traceViewportQuery(this.opts.dataset, null, null);
    let stream: string;
    try {
      ({ stream } = await viewportQuery(this.opts.dataset, null, null, encodeDecU64(BigInt(TABLE_MAX_ROWS)), filter, this.opts.projection));
    } catch (err) {
      if (mine === this.run) this.refuse(err);
      return;
    }
    if (mine !== this.run) {
      await this.cancelHandle(stream); // minted for a result nobody waits for any more: this call alone knows the handle
      return;
    }
    this.handle = stream;
    let attach: Awaited<ReturnType<typeof dataPlaneAttach>>;
    try {
      attach = await dataPlaneAttach();
    } catch (err) {
      if (mine === this.run) {
        this.handle = null;
        await this.cancelHandle(stream);
        this.refuse(err);
      }
      return;
    }
    if (mine !== this.run) return; // whoever bumped the run cancelled the handle
    let seq = 0;
    const sink: StreamSink = {
      onOpen: () => {},
      onBatch: (payload) => {
        if (this.handle === stream) this.add(stream, seq++, payload, filter);
      },
      onProgress: () => {},
      onTerminal: (terminal) => this.terminal(stream, terminal),
    };
    startStream({ url: attach.url, subprotocols: attach.subprotocols, ticketHandle: stream, sink });
    traceStreamIssued(this.opts.dataset, stream);
  }

  /** Ends a running stream and keeps the rows it delivered (Cancel, hide, collapse, an export acquiring a consumer). Nothing to end changes nothing. */
  cancel(): void {
    this.run++;
    const handle = this.handle;
    this.handle = null;
    if (handle !== null) void this.cancelHandle(handle);
    if (this.phase === "loading") {
      this.phase = "cancelled";
      this.emit();
    }
  }

  /** The dataset's generation or session ended: the stream is cancelled, the rows are cleared, and nothing is issued again. */
  end(): void {
    if (this.ended) return;
    this.ended = true;
    this.run++;
    const handle = this.handle;
    this.handle = null;
    if (handle !== null) void this.cancelHandle(handle);
    this.reset(this.filter);
    this.phase = "ended";
    this.emit();
  }

  dispose(): void {
    this.disposed = true;
    this.cancel();
    this.listeners.clear();
  }

  private reset(filter: Filter | null): void {
    this.blocks = [];
    this.starts = [];
    this.idSet = new Set();
    this.count = 0;
    this.held = 0;
    this.filter = filter;
    this.refusal = null;
  }

  private async cancelHandle(handle: string): Promise<void> {
    this.selfCancelled.add(handle);
    try {
      await skpCancel(handle);
    } catch (err) {
      logSessionEvent("warn", `table-cancel-failed: ${handle}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  private add(stream: string, seq: number, payload: Uint8Array, filter: Filter | null): void {
    const batch = decodeBatch(stream, seq, payload, this.opts.geometryColumn, this.opts.geometryEncoding, this.opts.projection, filter);
    const attributes = batch.attributes === "not-held" ? null : batch.attributes;
    const bytes = attributes === null ? 0 : attributes.bytes;
    if (this.held + bytes > TABLE_MAX_ATTRIBUTE_BYTES) {
      // A total equal to the ceiling is within (`limits.ts` reads it so). The batch is released; the stream is cancelled and no later batch of it is added.
      this.handle = null;
      void this.cancelHandle(stream);
      this.phase = "stopped";
      this.emit();
      return;
    }
    this.starts.push(this.count);
    this.blocks.push({ ids: batch.ids, attributes });
    for (const id of batch.ids) this.idSet.add(id);
    this.count += batch.ids.length;
    this.held += bytes;
    this.emit();
  }

  private terminal(stream: string, terminal: Terminal): void {
    if (this.selfCancelled.delete(stream)) {
      logSessionEvent("debug", `table-terminal-self-cancelled: ${stream}: ${terminal.kind} — ${terminal.detail}`);
      return;
    }
    if (this.handle !== stream) return;
    this.handle = null;
    if (isSessionEndedTerminal(terminal)) {
      this.end();
      this.opts.onSessionEnded(terminal.detail);
      return;
    }
    if (terminal.kind === "Completed") {
      this.phase = "completed";
    } else {
      logSessionEvent("warn", `table-stream-failure: ${stream}: ${terminal.kind} — ${terminal.detail}`);
      this.refusal = formatTerminalRefusal(terminal.detail);
      this.phase = "refused";
    }
    this.emit();
  }

  private refuse(err: unknown): void {
    if (err instanceof SkpCallError) {
      this.refusal = formatRefusal(err.skpError);
      this.phase = "refused";
      this.emit();
      if (isSessionEndedRefusal(err)) this.opts.onSessionEnded(refusalDetailOf(err));
      return;
    }
    logSessionEvent("error", `table-failed: ${err instanceof Error ? err.message : String(err)}`);
    this.refusal = { code: "table-failed", message: err instanceof Error ? err.message : String(err), fields: [] };
    this.phase = "refused";
    this.emit();
  }

  private emit(): void {
    const { blocks, starts } = this;
    this.snapshot = {
      phase: this.phase,
      filter: this.filter,
      count: this.count,
      ids: new Set(this.idSet),
      refusal: this.refusal,
      rowAt: (index) => {
        let b = starts.length - 1;
        while (b > 0 && starts[b] > index) b--;
        const local = index - starts[b];
        return { id: blocks[b].ids[local], row: readRow({ attributes: blocks[b].attributes }, local) as AttributeRow | null };
      },
    };
    for (const listener of [...this.listeners]) listener();
  }
}
