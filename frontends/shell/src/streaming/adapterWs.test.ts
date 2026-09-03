// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { afterEach, describe, expect, it, vi } from "vitest";

// Viewport-residency cut P6d (nit 3): mocked directly, mirroring `tileViewportStreamManager.test.ts`'s
// own precedent for `logSessionEvent` -- the binding-command plumbing itself is `diagnostics/log.test.ts`'s
// own subject, not this module's.
const logSessionEventMock = vi.hoisted(() => vi.fn());
vi.mock("../diagnostics/log", () => ({ logSessionEvent: logSessionEventMock }));

import { startStream } from "./adapterWs";
import type { StreamSink } from "./transport";
import { controlFrame, TAG } from "./wire";

/**
 * Re-review S9 (viewport-residency cut P6a): "a throw from `pushTileBatch` must not silently stall
 * the stream -- catch at the adapter boundary, record a loud poisoned-stream terminal (typed), credit
 * flow terminated cleanly." `pushTileBatch` itself is reached only through `TileViewportStreamManager`'s
 * own `sink.onBatch` wrapper, several modules away from `adapterWs.ts` -- but every one of those calls
 * is synchronous, so a throw from deep inside propagates, uncaught, all the way back up to exactly
 * this module's own `message` handler. Exercised here directly, at the one place `startStream` itself
 * owns: a `StreamSink` whose `onBatch` throws, standing in for `pushTileBatch`'s own eventual throw
 * without needing the whole tile-ingest call chain live in this test.
 *
 * A minimal fake `WebSocket` -- jsdom (this package's own `vitest.config.ts` environment) does not
 * implement one. Deliberately narrow: only what `adapterWs.ts` itself actually calls.
 */
class FakeWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  static instances: FakeWebSocket[] = [];

  readyState = FakeWebSocket.OPEN; // opens immediately -- this test never exercises the "open" event path
  binaryType = "";
  readonly sent: Uint8Array[] = [];
  closeCalls = 0;
  private readonly listeners = new Map<string, Array<(ev: unknown) => void>>();

  constructor(
    public readonly url: string,
    public readonly protocols: string[]
  ) {
    FakeWebSocket.instances.push(this);
  }

  addEventListener(type: string, fn: (ev: unknown) => void): void {
    const arr = this.listeners.get(type) ?? [];
    arr.push(fn);
    this.listeners.set(type, arr);
  }

  removeEventListener(): void {}

  send(data: Uint8Array): void {
    this.sent.push(data);
  }

  close(): void {
    this.closeCalls++;
    this.readyState = FakeWebSocket.CLOSED;
  }

  emit(type: string, ev: unknown = {}): void {
    for (const fn of this.listeners.get(type) ?? []) fn(ev);
  }
}

function fakeSink(overrides: Partial<StreamSink> = {}): StreamSink {
  return {
    onOpen: vi.fn(),
    onBatch: vi.fn(),
    onProgress: vi.fn(),
    onTerminal: vi.fn(),
    ...overrides,
  };
}

describe("startStream: a throw from a StreamSink callback (re-review S9)", () => {
  const originalWebSocket = globalThis.WebSocket;

  afterEach(() => {
    (globalThis as { WebSocket: unknown }).WebSocket = originalWebSocket;
    FakeWebSocket.instances = [];
    logSessionEventMock.mockClear();
  });

  it("a throw from onBatch is caught at the adapter boundary -- a typed SinkPoisoned terminal, the connection closes, no further credit is granted", () => {
    (globalThis as { WebSocket: unknown }).WebSocket = FakeWebSocket;
    const onBatch = vi.fn(() => {
      throw new Error("boom -- pushTileBatch's own bug");
    });
    const sink = fakeSink({ onBatch });

    startStream({ url: "ws://x", subprotocols: ["spatial-dp.v0", "tok.x"], ticketHandle: "sh_1", sink });
    const ws = FakeWebSocket.instances.at(-1)!;
    ws.sent.length = 0; // drop the START/initial-CREDIT bytes `begin()` already sent -- not this test's subject

    const batchFrame = controlFrame(TAG.BATCH, new Uint8Array([1, 2, 3]));
    ws.emit("message", { data: batchFrame.buffer });

    expect(sink.onTerminal).toHaveBeenCalledTimes(1);
    expect(sink.onTerminal).toHaveBeenCalledWith({ kind: "SinkPoisoned", detail: "boom -- pushTileBatch's own bug" });
    // Never silently stalled: the connection is torn down (a cancel frame sent, then closed) --
    // never left open and waiting for more frames that would only be discarded on arrival.
    expect(ws.closeCalls).toBe(1);
    expect(ws.readyState).toBe(FakeWebSocket.CLOSED);
  });

  it("a poisoned sink never grants further credit for the batch that poisoned it", () => {
    (globalThis as { WebSocket: unknown }).WebSocket = FakeWebSocket;
    const onBatch = vi.fn(() => {
      throw new Error("boom");
    });
    const sink = fakeSink({ onBatch });

    startStream({ url: "ws://x", subprotocols: ["spatial-dp.v0", "tok.x"], ticketHandle: "sh_1", sink });
    const ws = FakeWebSocket.instances.at(-1)!;
    const sentBeforePoison = ws.sent.length;

    ws.emit("message", { data: controlFrame(TAG.BATCH, new Uint8Array([1])).buffer });

    // `grant()` (a CREDIT control frame) is only ever sent by `send()` -- the cancel frame IS one
    // more `send()` call (part of the clean shutdown, asserted separately below), so this checks
    // nothing NEW beyond that one expected cancel landed on the wire.
    expect(ws.sent.length).toBe(sentBeforePoison + 1);
  });

  // Viewport-residency cut P6d (nit 3, rule 7 -- "nothing escapes uncaught"): the poisoned sink's OWN
  // `onTerminal` callback is exactly as suspect as its `onBatch` -- a second throw, delivering the
  // very terminal that reports the sink is broken, must not itself escape `abandonStream` uncaught
  // (which would ALSO skip the cancel/close cleanup right below it, leaking the connection open).
  it("if the poisoned sink's own onTerminal ALSO throws, it is caught, logged, and cleanup still runs", () => {
    (globalThis as { WebSocket: unknown }).WebSocket = FakeWebSocket;
    const onBatch = vi.fn(() => {
      throw new Error("boom -- pushTileBatch's own bug");
    });
    const onTerminal = vi.fn(() => {
      throw new Error("onTerminal itself is broken too");
    });
    const sink = fakeSink({ onBatch, onTerminal });

    startStream({ url: "ws://x", subprotocols: ["spatial-dp.v0", "tok.x"], ticketHandle: "sh_1", sink });
    const ws = FakeWebSocket.instances.at(-1)!;

    expect(() =>
      ws.emit("message", { data: controlFrame(TAG.BATCH, new Uint8Array([1, 2, 3])).buffer })
    ).not.toThrow(); // the second throw never escapes the message handler uncaught

    expect(onTerminal).toHaveBeenCalledTimes(1);
    expect(onTerminal).toHaveBeenCalledWith({ kind: "SinkPoisoned", detail: "boom -- pushTileBatch's own bug" });
    expect(logSessionEventMock).toHaveBeenCalledWith(
      "stream-sink-onterminal-threw",
      expect.stringContaining("onTerminal itself is broken too")
    );
    // Cleanup still ran despite the second throw -- never left open, waiting for frames that would
    // only be discarded on arrival.
    expect(ws.closeCalls).toBe(1);
    expect(ws.readyState).toBe(FakeWebSocket.CLOSED);
  });

  it("SinkPoisoned is distinct from DecodeFailed -- a genuine frame-decode fault (not a sink throw) still reports DecodeFailed", () => {
    (globalThis as { WebSocket: unknown }).WebSocket = FakeWebSocket;
    const sink = fakeSink();

    startStream({ url: "ws://x", subprotocols: ["spatial-dp.v0", "tok.x"], ticketHandle: "sh_1", sink });
    const ws = FakeWebSocket.instances.at(-1)!;

    // A malformed OPEN frame (missing one of its two required ids) -- a wire/framing fault the
    // decoder itself raises, never reaching any `StreamSink` callback at all.
    const malformedOpen = controlFrame(TAG.OPEN, new TextEncoder().encode("op_abc"));
    ws.emit("message", { data: malformedOpen.buffer });

    expect(sink.onBatch).not.toHaveBeenCalled();
    expect(sink.onTerminal).toHaveBeenCalledTimes(1);
    const [terminal] = (sink.onTerminal as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(terminal.kind).toBe("DecodeFailed");
  });

  it("a well-formed batch, ordinarily consumed, never reports SinkPoisoned -- only a real throw does", () => {
    (globalThis as { WebSocket: unknown }).WebSocket = FakeWebSocket;
    const sink = fakeSink();

    startStream({ url: "ws://x", subprotocols: ["spatial-dp.v0", "tok.x"], ticketHandle: "sh_1", sink });
    const ws = FakeWebSocket.instances.at(-1)!;

    ws.emit("message", { data: controlFrame(TAG.BATCH, new Uint8Array([9, 8, 7])).buffer });

    expect(sink.onBatch).toHaveBeenCalledTimes(1);
    expect(sink.onTerminal).not.toHaveBeenCalled();
    expect(ws.closeCalls).toBe(0);
  });
});
