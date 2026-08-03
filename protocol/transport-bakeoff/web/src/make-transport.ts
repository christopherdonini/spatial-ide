/**
 * **The single adapter construction site** — H6's falsifiable claim, in one file.
 *
 * Switching candidates changes this function and nothing else: no semantic code, in either phase,
 * names an adapter type. `scripts/check-leakage.mjs` asserts that every `new …Transport` in the
 * whole source tree lives here, so a second construction site added elsewhere fails the build
 * rather than quietly weakening the claim.
 */

import { HttpStreamTransport } from './adapter-http.js';
import { WebSocketTransport } from './adapter-ws.js';
import type { BatchTransport } from './transport.js';

export type Candidate = 'websocket' | 'http-stream';

export function makeTransport(c: Candidate, base: string, token: string): BatchTransport {
  return c === 'websocket'
    ? new WebSocketTransport(base, token)
    : new HttpStreamTransport(base, token);
}
