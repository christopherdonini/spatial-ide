/**
 * Candidate A — binary WebSocket, consumer side.
 *
 * Demand is explicit: credit is granted as fixed-layout binary control frames, and only as the
 * caller consumes. Stop iterating `frames()` and credit stops flowing, which is what backpressures
 * the producer (H3).
 *
 * Cancellation goes out through this same socket as a binary CANCEL frame, so the producer learns
 * of it through its own data transport rather than a side channel (H2).
 */

import type { BatchTransport, Frame } from './transport.js';
import { CTRL, FrameDecoder, controlFrame } from './wire.js';

const INITIAL_DEMAND = 4;

export class WebSocketTransport implements BatchTransport {
  readonly candidate = 'websocket';
  private ws: WebSocket | null = null;
  private decoder = new FrameDecoder();
  readonly stats = this.decoder.stats;

  constructor(private base: string, private token: string) {}

  async *frames(): AsyncGenerator<Frame> {
    const url = `${this.base.replace('http', 'ws')}/stream/ws`;
    // The credential rides in the subprotocol list, validated at handshake before the upgrade
    // completes, so an unauthenticated peer never reaches the data path. Never a query string.
    const ws = new WebSocket(url, ['bakeoff.v0', this.token]);
    ws.binaryType = 'arraybuffer';
    this.ws = ws;

    const queue: Frame[] = [];
    let notify: (() => void) | null = null;
    let done = false;
    let failure: string | null = null;

    const wake = () => {
      const n = notify;
      notify = null;
      n?.();
    };

    ws.onmessage = (ev) => {
      for (const f of this.decoder.push(new Uint8Array(ev.data as ArrayBuffer))) {
        queue.push(f);
        if (f.t === 'terminal') done = true;
      }
      wake();
    };
    ws.onerror = () => {
      failure = 'transport error';
      done = true;
      wake();
    };
    ws.onclose = () => {
      done = true;
      wake();
    };

    await new Promise<void>((resolve, reject) => {
      ws.onopen = () => resolve();
      const prior = ws.onerror;
      ws.onerror = (e) => {
        (prior as any)?.(e);
        reject(new Error('connection refused'));
      };
    });
    ws.onerror = () => {
      failure = 'transport error';
      done = true;
      wake();
    };

    let outstanding = 0;
    const grant = (n: number) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const p = new Uint8Array(4);
      new DataView(p.buffer).setUint32(0, n, false);
      ws.send(controlFrame(CTRL.CREDIT, p));
      outstanding += n;
    };

    grant(INITIAL_DEMAND);

    try {
      for (;;) {
        while (queue.length === 0 && !done) {
          await new Promise<void>((r) => (notify = r));
        }
        if (queue.length === 0) {
          // The stream ended without a terminal frame. That is truncation, and it must be loud:
          // reporting `terminal: null` lets a short stream read as an unremarkable one, which is
          // exactly how the first smoke run's 98-of-100 delivery nearly passed unnoticed.
          yield {
            t: 'terminal',
            terminal: {
              kind: 'TransportFailed',
              detail: failure ?? 'stream ended without a terminal frame (truncated)',
            },
          };
          return;
        }
        const frame = queue.shift()!;
        yield frame;
        if (frame.t === 'terminal') return;
        if (frame.t === 'batch') {
          // Demand is renewed only once the caller has come back for more. A paused consumer
          // therefore stops granting credit, and the producer blocks.
          outstanding--;
          if (outstanding < INITIAL_DEMAND) grant(INITIAL_DEMAND - outstanding);
        }
      }
    } finally {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    }
  }

  cancel(): void {
    const ws = this.ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(controlFrame(CTRL.CANCEL));
    }
  }
}
