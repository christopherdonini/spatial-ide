/**
 * Candidate B — loopback HTTP streaming response, consumed through `fetch` + `ReadableStream`.
 *
 * Demand is implicit and TCP-native: stop calling `reader.read()` and the receive window closes,
 * the producer's write pends, and the body stream stops being polled. There is no application
 * credit protocol, and no consumer->producer channel at all — an asymmetry against Candidate A that
 * is a genuine finding for the tie-break, not an omission.
 *
 * Cancellation is `AbortController`, which closes the connection; the producer observes the drop of
 * its response body. This is ADR-004 amendment 2's "localhost HTTP with connection-close semantics".
 */

import type { BatchTransport, Frame } from './transport.js';
import { FrameDecoder } from './wire.js';

export class HttpStreamTransport implements BatchTransport {
  readonly candidate = 'http-stream';
  private controller = new AbortController();
  private decoder = new FrameDecoder();
  readonly stats = this.decoder.stats;
  /** See BatchTransport.batchByteSink — forwarded to the decoder when the stream opens. */
  batchByteSink: ((slice: Uint8Array) => void) | null = null;

  constructor(private base: string, private token: string) {}

  async *frames(): AsyncGenerator<Frame> {
    this.decoder.onBatchBytes = this.batchByteSink;
    const res = await fetch(`${this.base}/stream/http`, {
      // Credential in a request header, never a query string (docs/09).
      headers: { Authorization: `Bearer ${this.token}` },
      signal: this.controller.signal,
      cache: 'no-store',
    });
    if (!res.ok || !res.body) {
      yield {
        t: 'terminal',
        terminal: { kind: 'TransportFailed', detail: `stream refused (${res.status})` },
      };
      return;
    }

    const reader = res.body.getReader();
    try {
      for (;;) {
        let chunk: ReadableStreamReadResult<Uint8Array>;
        try {
          chunk = await reader.read();
        } catch (e) {
          const aborted = this.controller.signal.aborted;
          yield {
            t: 'terminal',
            terminal: {
              kind: aborted ? 'Cancelled' : 'TransportFailed',
              detail: aborted ? 'client abort' : String(e),
            },
          };
          return;
        }
        if (chunk.done) return;
        for (const f of this.decoder.push(chunk.value)) {
          yield f;
          if (f.t === 'terminal') return;
        }
      }
    } finally {
      try {
        reader.releaseLock();
      } catch {
        /* already released after an abort */
      }
    }
  }

  cancel(): void {
    this.controller.abort();
  }
}
