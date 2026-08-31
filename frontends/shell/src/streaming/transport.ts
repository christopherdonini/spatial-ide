// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The consumer-side transport-neutral vocabulary. Ported from
 * `frontends/canvas-probe/src/transport.ts` (the ADR-003 spike's proven client), which states the
 * same rule the producer's `transport.rs` does: **permitted** vocabulary is operation, stream,
 * batch, cancel, progress, terminal error, demand/credit; **forbidden** is socket, WebSocket, URL,
 * path, status, header, fetch, `Response`, port, close code, opcode. Nothing in this file names how
 * bytes arrive — that is `adapterWs.ts`'s business.
 *
 * **Not reused as-is**: `StreamRequest` (dataset/bbox/limit) belonged to the raw-`StreamParams`
 * path this shell never takes (ADR-019) — a stream here starts from an opaque ticket handle, which
 * `viewportStreamManager.ts` already holds before any transport code runs.
 */

/**
 * Re-review S9 (viewport-residency cut P6a): `"SinkPoisoned"` is a CLIENT-LOCAL terminal, never sent
 * by the producer -- appended LAST so every existing wire ordinal `TERMINAL_KINDS[payload[0]]`
 * (`wire.ts`) already decodes stays unchanged; the same precedent `"DecodeFailed"`/`"TransportFailed"`
 * already set (both are also synthesized client-side, never producer-sent). It names a batch-sink
 * callback (`StreamSink.onBatch`/`onOpen`/`onProgress`) throwing -- a bug in THIS client's own
 * consumption of an otherwise well-formed frame, never a wire/framing defect (`"DecodeFailed"`'s own
 * meaning, unchanged) -- so a diagnosis reading this kind knows to look at the consumer, not the wire.
 */
export type TerminalKind = "Completed" | "Cancelled" | "ProducerFailed" | "TransportFailed" | "DecodeFailed" | "SinkPoisoned";

export const TERMINAL_KINDS: TerminalKind[] = [
  "Completed",
  "Cancelled",
  "ProducerFailed",
  "TransportFailed",
  "DecodeFailed",
  "SinkPoisoned",
];

/** The data-plane's own per-process instrument identities (`protocol/data-plane/src/transport.rs`'s
 * `OperationId`/`StreamId`) -- never an SKP handle, never used for anything but joining this
 * client's own logs off the wire (ADR-004 Amendment 4's "not forbidden" clause). */
export interface WireOpenHandle {
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
 * Mirrors the producer's sentinel. The producer sends `u64::MAX`, not exactly representable as a
 * JS number, so the wire decoder compares the **BigInt** before any conversion and substitutes this
 * value — exactly representable, and never confused with a real count.
 */
export const UNKNOWN_TOTAL = Number.POSITIVE_INFINITY;
export const UNKNOWN_TOTAL_WIRE = 0xffffffffffffffffn;

export interface Terminal {
  kind: TerminalKind;
  detail: string;
}

export type Frame =
  | { t: "open"; handle: WireOpenHandle }
  | { t: "batch"; payload: Uint8Array; contiguous: boolean }
  | { t: "progress"; progress: Progress }
  | { t: "terminal"; terminal: Terminal };

export interface DecoderStats {
  /** Frames that had to be reassembled because they spanned a delivery boundary. */
  reassemblyCopies: number;
  /** ADR-004: frames on the data channel whose payload looked like JSON. Must stay 0. */
  jsonFramesSeen: number;
}

/** What a consumer does with a stream. Adapter-independent by construction. */
export interface StreamSink {
  onOpen(handle: WireOpenHandle): void;
  onBatch(payload: Uint8Array, contiguous: boolean): void;
  onProgress(progress: Progress): void;
  onTerminal(terminal: Terminal): void;
}

/** The one thing a consumer can do to a running stream, besides read it. */
export interface RunningStream {
  cancel(): void;
  readonly stats: DecoderStats;
}
