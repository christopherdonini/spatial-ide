/**
 * **Candidate A, consumer side — the one construction site that names a transport.**
 *
 * ADR-012 is Proposed and no §19.9 branch selected a candidate. This adapter is the *provisional*
 * choice the bake-off README's §19.10 step 3 licenses building against, with that step's own
 * declared gate: if the hero-slice confirmation falsifies it, this is rework. Nothing here is a
 * transport decision and nothing here may be cited as one.
 *
 * Everything above this file — `transport.ts`, `geoarrow.ts`, `render.ts`, the scenario in
 * `main.ts` — is written against the neutral interface and does not know a WebSocket exists.
 */

import { FrameDecoder, cancelFrame, creditFrame, startFrame } from './wire.js';
import type { RunningStream, StreamRequest, StreamSink } from './transport.js';

const OPERATION = 'stream_features';
const SUBPROTOCOL = 'spatial-dp.v0';

/** Credit window, in batches. Declared here and granted in blocks as batches are consumed. */
export const CREDIT_WINDOW = 4;

export interface ConnectOptions {
  /** Session credential, delivered out of band — never in a query string, never in the document. */
  token: string;
  request: StreamRequest;
  sink: StreamSink;
}

export function startStream(opts: ConnectOptions): RunningStream {
  const decoder = new FrameDecoder();
  const url = `ws://${location.host}/stream`;
  const ws = new WebSocket(url, [SUBPROTOCOL, `tok.${opts.token}`]);
  ws.binaryType = 'arraybuffer';

  let outstanding = 0;
  let finished = false;

  const grant = (n: number) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(creditFrame(n));
      outstanding += n;
    }
  };

  ws.addEventListener('open', () => {
    ws.send(startFrame(OPERATION, opts.request));
    grant(CREDIT_WINDOW);
  });

  ws.addEventListener('message', (ev) => {
    const chunk = new Uint8Array(ev.data as ArrayBuffer);
    for (const frame of decoder.push(chunk)) {
      switch (frame.t) {
        case 'open':
          opts.sink.onOpen(frame.handle);
          break;
        case 'batch':
          outstanding -= 1;
          opts.sink.onBatch(frame.payload, frame.contiguous);
          // Demand is renewed as work is consumed, which is what keeps the producer's window —
          // and therefore its memory — bounded by something this consumer controls.
          if (outstanding <= CREDIT_WINDOW / 2) grant(CREDIT_WINDOW - outstanding);
          break;
        case 'progress':
          opts.sink.onProgress(frame.progress);
          break;
        case 'terminal':
          finished = true;
          opts.sink.onTerminal(frame.terminal);
          // The consumer closes; the producer never does. A producer-initiated close races the
          // frames still in this peer's receive path and truncates silently.
          ws.close();
          break;
      }
    }
  });

  ws.addEventListener('close', () => {
    if (!finished) {
      // A stream that ends without a terminal frame is a failure, never a short stream.
      finished = true;
      opts.sink.onTerminal({
        kind: 'TransportFailed',
        detail: 'the stream ended without a terminal frame',
      });
    }
  });

  ws.addEventListener('error', () => {
    if (!finished) {
      finished = true;
      opts.sink.onTerminal({ kind: 'TransportFailed', detail: 'connection error' });
    }
  });

  return {
    cancel() {
      if (ws.readyState === WebSocket.OPEN) ws.send(cancelFrame());
    },
    stats: decoder.stats,
  };
}
