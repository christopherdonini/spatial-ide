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

/**
 * A socket opened and authenticated ahead of a query, so the open and the credential handshake
 * leave the per-query path.
 *
 * **One stream per connection still.** This holds *spare* sockets; it does not multiplex. That
 * boundary is deliberate and not a matter of taste: the wire format carries no stream id — CANCEL
 * has an empty payload — so two live streams on one socket would make a cancel ambiguous, which is
 * a correctness defect rather than a tuning question. Multiplexing also needs a framing change that
 * ADR-012 reserves as its own decision, and an admission unit that ADR-014 is reserved for.
 *
 * The engine's real concurrency shape does not need multiplexing anyway: a superseded query
 * cancelling while its replacement starts is two connections, and a cancel on either is
 * unambiguous.
 */
let spare: WebSocket | null = null;
let spareToken: string | null = null;

/** Open a socket and hold it authenticated until a query needs it. */
export function prewarm(token: string): void {
  if (spare && spare.readyState <= WebSocket.OPEN) return;
  spareToken = token;
  const s = new WebSocket(`ws://${location.host}/stream`, [SUBPROTOCOL, `tok.${token}`]);
  s.binaryType = 'arraybuffer';
  // A spare that dies before use must not be handed out. Clearing on close/error is what keeps
  // "there is a warm socket" from meaning "there was one, once".
  const forget = () => {
    if (spare === s) spare = null;
  };
  s.addEventListener('close', forget);
  s.addEventListener('error', forget);
  spare = s;
}

/** Take the warm socket if one is usable, and immediately start warming its replacement. */
function takeSpare(token: string): WebSocket | null {
  const s = spare;
  spare = null;
  if (!s || s.readyState > WebSocket.OPEN || spareToken !== token) {
    // A socket in CLOSING/CLOSED, or one authenticated with a different credential, is not a
    // usable spare. Falling back to a fresh open is always correct — pre-warming is an
    // optimisation, never a precondition.
    prewarm(token);
    return null;
  }
  prewarm(token);
  return s;
}

export function startStream(opts: ConnectOptions): RunningStream {
  const decoder = new FrameDecoder();
  const url = `ws://${location.host}/stream`;
  const warm = takeSpare(opts.token);
  const ws = warm ?? new WebSocket(url, [SUBPROTOCOL, `tok.${opts.token}`]);
  ws.binaryType = 'arraybuffer';

  let outstanding = 0;
  let finished = false;

  const grant = (n: number) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(creditFrame(n));
      outstanding += n;
    }
  };

  // A warm socket is already open, so its `open` event fired before this listener existed. Sending
  // immediately in that case is the whole point of pre-warming; a cold socket still waits.
  const begin = () => {
    ws.send(startFrame(OPERATION, opts.request));
    grant(CREDIT_WINDOW);
  };
  if (ws.readyState === WebSocket.OPEN) {
    begin();
  } else {
    ws.addEventListener('open', begin);
  }

  ws.addEventListener('message', (ev) => {
    const chunk = new Uint8Array(ev.data as ArrayBuffer);
    // **Decoding is inside the taxonomy, not outside it.** Frame decoding and envelope checking
    // both throw — a batch whose envelope is missing or wrong, an Arrow layout that contradicts
    // the metadata, a fixed-layout payload shorter than its fields. Uncaught, such a throw
    // abandoned the frames already parsed out of this chunk, produced no terminal at all, and left
    // the producer streaming to a consumer that had stopped reading: `docs/01` principle 7's
    // failure mode, and the silent async death ADR-010 rule 7 exists to forbid. `DecodeFailed` is
    // in the shared taxonomy for exactly this and was never being constructed.
    try {
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
    } catch (err) {
      if (!finished) {
        finished = true;
        opts.sink.onTerminal({
          kind: 'DecodeFailed',
          detail: err instanceof Error ? err.message : String(err),
        });
      }
      // Tell the producer to stop before going away. A consumer that dies quietly leaves the
      // kernel computing work nobody will read — the exact behaviour ADR-004 amendment 2
      // disqualified a transport over.
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(cancelFrame());
        ws.close();
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
