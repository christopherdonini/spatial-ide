// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { cancelFrame, creditFrame, FrameDecoder, startFrame } from "./wire";
import type { RunningStream, StreamSink } from "./transport";

const OPERATION = "stream_features";

/** Credit window, in batches. Declared here and granted in blocks as batches are consumed --
 * `protocol/data-plane`'s own `MAX_INFLIGHT_BATCHES` is also 4, so this stays inside the
 * producer's own admitted window rather than granting more than it would ever use. */
export const CREDIT_WINDOW = 4;

export interface ConnectOptions {
  url: string;
  /** `[subprotocol, "tok.<hex>"]`, exactly as `binding_data_plane_attach` returns them. */
  subprotocols: [string, string];
  /** ADR-019: the ticket `viewport_query` already minted and validated. */
  ticketHandle: string;
  sink: StreamSink;
}

/**
 * Opens one WebSocket, starts the ticketed operation, and drives frames into `sink`.
 *
 * Ported from `frontends/canvas-probe/src/adapter-ws.ts` (the proven Candidate A consumer, ADR-012),
 * adapted for ADR-019: START's payload is the ticket handle's ASCII bytes, never a
 * dataset/bbox/limit tuple -- the query was already validated and bound to the ticket by
 * `SkpHost.viewport_query`. **Deliberately no pre-warmed spare socket** (the spike's own latency
 * optimization): this is a correctness cut with no measurement campaign, and a spare would be a
 * second code path to get right for a win nothing here claims.
 *
 * **One operation, one stream, per connection** (`protocol/data-plane`'s own rule) — supersede-on-pan
 * therefore means a new `WebSocket`, not a second operation multiplexed onto this one.
 */
export function startStream(opts: ConnectOptions): RunningStream {
  const decoder = new FrameDecoder();
  const ws = new WebSocket(opts.url, opts.subprotocols);
  ws.binaryType = "arraybuffer";

  let outstanding = 0;
  let finished = false;

  const grant = (n: number) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(creditFrame(n));
      outstanding += n;
    }
  };

  const begin = () => {
    ws.send(startFrame(OPERATION, opts.ticketHandle));
    grant(CREDIT_WINDOW);
  };
  if (ws.readyState === WebSocket.OPEN) {
    begin();
  } else {
    ws.addEventListener("open", begin);
  }

  /**
   * Re-review S9: closes the connection cleanly and stops granting any further credit -- shared by
   * both failure paths below (a decode fault, or a poisoned sink) so neither one has its own
   * half-written copy of "cancel, then close" to drift out of sync with the other.
   */
  function abandonStream(terminal: { kind: "DecodeFailed" | "SinkPoisoned"; detail: string }): void {
    if (!finished) {
      finished = true;
      opts.sink.onTerminal(terminal);
    }
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(cancelFrame());
      ws.close();
    }
  }

  ws.addEventListener("message", (ev) => {
    const chunk = new Uint8Array(ev.data as ArrayBuffer);
    // Decoding is inside the taxonomy, not outside it: a batch whose envelope is wrong or an Arrow
    // layout that contradicts it throws, and an uncaught throw here would abandon the frames
    // already parsed with no terminal at all -- the silent async death ADR-010 rule 7 forbids.
    let frames: ReturnType<typeof decoder.push>;
    try {
      frames = decoder.push(chunk);
    } catch (err) {
      abandonStream({ kind: "DecodeFailed", detail: err instanceof Error ? err.message : String(err) });
      return;
    }
    for (const frame of frames) {
      // Re-review S9: a throw from a `StreamSink` callback itself (`pushTileBatch`'s own decode/
      // ingest logic, reached synchronously through `onBatch`) is a bug in THIS client's own
      // consumption of an otherwise well-formed frame -- caught here, separately from the decode try
      // above, so it is never conflated with a genuine wire/framing fault: a distinct, typed
      // `"SinkPoisoned"` terminal (`transport.ts`), never silently stalling the stream (no further
      // frame in THIS chunk is processed once poisoned; no further credit is granted -- the batch
      // case's own `grant` call below is skipped by the same `finished` check `abandonStream` sets).
      try {
        switch (frame.t) {
          case "open":
            opts.sink.onOpen(frame.handle);
            break;
          case "batch":
            outstanding -= 1;
            opts.sink.onBatch(frame.payload, frame.contiguous);
            if (outstanding <= CREDIT_WINDOW / 2) grant(CREDIT_WINDOW - outstanding);
            break;
          case "progress":
            opts.sink.onProgress(frame.progress);
            break;
          case "terminal":
            finished = true;
            opts.sink.onTerminal(frame.terminal);
            // The consumer closes; the producer never does (ADR-012's shutdown-protocol
            // requirement) -- a producer-initiated close races frames still in this peer's receive
            // path and truncates silently.
            ws.close();
            break;
        }
      } catch (err) {
        abandonStream({ kind: "SinkPoisoned", detail: err instanceof Error ? err.message : String(err) });
      }
      if (finished) break; // poisoned or terminated -- the rest of this chunk's frames are moot
    }
  });

  ws.addEventListener("close", () => {
    if (!finished) {
      finished = true;
      opts.sink.onTerminal({ kind: "TransportFailed", detail: "the stream ended without a terminal frame" });
    }
  });

  ws.addEventListener("error", () => {
    if (!finished) {
      finished = true;
      opts.sink.onTerminal({ kind: "TransportFailed", detail: "connection error" });
    }
  });

  return {
    cancel() {
      if (ws.readyState === WebSocket.OPEN) ws.send(cancelFrame());
    },
    stats: decoder.stats,
  };
}
