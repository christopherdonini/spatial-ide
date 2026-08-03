/**
 * The transport-neutral operation/stream interface, consumer side.
 *
 * This file is the one the H6 leakage scan checks. Nothing here may name a socket, a URL, an HTTP
 * status, a header, a port, a close code or an opcode — asserted by `scripts/check-leakage.mjs`,
 * not left to good intentions. Framing lives in `wire.ts`; adapter specifics are confined to the
 * opaque `detail` string on `Terminal`.
 */

export const TERMINAL_KINDS = [
  'Completed',
  'Cancelled',
  'ProducerFailed',
  'TransportFailed',
  'DecodeFailed',
] as const;

export type TerminalKind = (typeof TERMINAL_KINDS)[number];

export interface Terminal {
  kind: TerminalKind;
  detail: string;
}

/** Opaque, harness-allocated identifiers. Strings, never JSON numbers (ADR-004 amendment 1). */
export interface StreamHandle {
  operationId: string;
  streamId: string;
}

export interface Progress {
  batches: number;
  bytes: number;
  total: number;
}

export type Frame =
  | { t: 'open'; handle: StreamHandle }
  | { t: 'batch'; payload: Uint8Array; contiguous: boolean }
  | { t: 'progress'; progress: Progress }
  | { t: 'terminal'; terminal: Terminal };

/**
 * The one operation this harness supports. A command catalog beyond this would be authoring SKP v0
 * (docs/10's specification checklist), which is explicitly out of scope.
 */
export interface ProduceBatches {
  totalRows: number;
  rowsPerBatch: number;
}

/** Bytes reassembled across chunk boundaries — a real per-candidate copy cost (README §7). */
export interface DecoderStats {
  reassemblyCopies: number;
  jsonFramesSeen: number;
}

/**
 * The transport-neutral surface an adapter must implement.
 *
 * `candidate` is a reporting label only and is never consulted by semantic code. Demand is
 * expressed by how fast the caller iterates `frames()`: stop pulling and the producer is
 * backpressured, by whatever mechanism the adapter's transport provides.
 */
export interface BatchTransport {
  readonly candidate: string;
  readonly stats: DecoderStats;
  frames(): AsyncGenerator<Frame>;
  cancel(): void;
}
