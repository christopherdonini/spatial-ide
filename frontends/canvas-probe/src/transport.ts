/**
 * The consumer-side transport-neutral interface.
 *
 * Same rule as the producer's `transport.rs`: **permitted vocabulary** is operation, stream, batch,
 * cancel, progress, terminal error, demand/credit; **forbidden** is socket, WebSocket, URL, path,
 * status, header, fetch, `Response`, port, close code, opcode. Nothing in this file names how bytes
 * arrive — that is `adapter-ws.ts`'s business, and swapping it is the one construction site.
 */

export type TerminalKind =
  | 'Completed'
  | 'Cancelled'
  | 'ProducerFailed'
  | 'TransportFailed'
  | 'DecodeFailed';

export const TERMINAL_KINDS: TerminalKind[] = [
  'Completed',
  'Cancelled',
  'ProducerFailed',
  'TransportFailed',
  'DecodeFailed',
];

export interface StreamHandle {
  operationId: string;
  streamId: string;
}

export interface Progress {
  batches: number;
  bytes: number;
  /** `UNKNOWN_TOTAL` when the producer cannot know it without a second pass over the source. */
  total: number;
}

/**
 * Mirrors the producer's sentinel: a streaming filter does not know its own result size.
 *
 * The producer sends `u64::MAX`, which is **not exactly representable as a JavaScript number** —
 * `Number(2n ** 64n - 1n)` rounds to 2⁶⁴. Comparing after that conversion would work only because
 * two roundings happen to land on the same value, which is the kind of accidental float equality
 * ADR-004 amendment 1 exists to stop relying on. The wire decoder therefore compares the **BigInt**
 * before any conversion and substitutes this value, which is exactly representable and cannot be
 * confused with a real count.
 */
export const UNKNOWN_TOTAL = Number.POSITIVE_INFINITY;

/** The sentinel as it appears on the wire, compared before any narrowing to a JS number. */
export const UNKNOWN_TOTAL_WIRE = 0xffffffffffffffffn;

export interface Terminal {
  kind: TerminalKind;
  detail: string;
}

export type Frame =
  | { t: 'open'; handle: StreamHandle }
  | { t: 'batch'; payload: Uint8Array; contiguous: boolean }
  | { t: 'progress'; progress: Progress }
  | { t: 'terminal'; terminal: Terminal };

export interface DecoderStats {
  /** Frames that had to be reassembled because they spanned a delivery boundary. */
  reassemblyCopies: number;
  /** H5, byte-level: frames on the data channel whose payload looked like JSON. Must stay 0. */
  jsonFramesSeen: number;
}

/** What a consumer does with a stream. Adapter-independent by construction. */
export interface StreamSink {
  onOpen(handle: StreamHandle): void;
  onBatch(payload: Uint8Array, contiguous: boolean): void;
  onProgress(progress: Progress): void;
  onTerminal(terminal: Terminal): void;
}

/** One operation's parameters, before the adapter encodes them. */
export interface StreamRequest {
  dataset: string;
  bbox?: [number, number, number, number];
  bboxCrs?: string;
  limit?: number;
}

/** The one thing a consumer can do to a running stream, besides read it. */
export interface RunningStream {
  cancel(): void;
  readonly stats: DecoderStats;
}
