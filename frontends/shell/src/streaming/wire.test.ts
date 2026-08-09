import { describe, expect, it } from "vitest";

import { CTRL, FRAME_PREFIX_LEN, FrameDecoder, TAG, cancelFrame, controlFrame, creditFrame, startFrame } from "./wire";

function parseStartPayload(frame: Uint8Array): { operation: string; params: Uint8Array } {
  const payload = frame.subarray(FRAME_PREFIX_LEN);
  const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const opLen = dv.getUint16(0, false);
  const operation = new TextDecoder().decode(payload.subarray(2, 2 + opLen));
  const paramsLen = dv.getUint32(2 + opLen, false);
  const params = payload.subarray(2 + opLen + 4, 2 + opLen + 4 + paramsLen);
  return { operation, params };
}

describe("wire framing (mirrors protocol/data-plane/src/wire.rs)", () => {
  it("controlFrame lays out [tag][3 reserved][u32 BE len][payload]", () => {
    const f = controlFrame(TAG.BATCH, new Uint8Array([1, 2, 3, 4]));
    expect(f[0]).toBe(TAG.BATCH);
    expect(Array.from(f.subarray(1, 4))).toEqual([0, 0, 0]);
    expect(new DataView(f.buffer).getUint32(4, false)).toBe(4);
    expect(Array.from(f.subarray(FRAME_PREFIX_LEN))).toEqual([1, 2, 3, 4]);
  });

  it("startFrame carries the ticket handle as opaque params, not a StreamParams tuple (ADR-019)", () => {
    const f = startFrame("stream_features", "sh_00000000000000000000000000000000");
    expect(f[0]).toBe(CTRL.START);
    const { operation, params } = parseStartPayload(f);
    expect(operation).toBe("stream_features");
    expect(new TextDecoder().decode(params)).toBe("sh_00000000000000000000000000000000");
  });

  it("creditFrame and cancelFrame produce the declared control tags", () => {
    const credit = creditFrame(4);
    expect(credit[0]).toBe(CTRL.CREDIT);
    expect(new DataView(credit.buffer).getUint32(FRAME_PREFIX_LEN, false)).toBe(4);

    const cancel = cancelFrame();
    expect(cancel[0]).toBe(CTRL.CANCEL);
    expect(cancel.length).toBe(FRAME_PREFIX_LEN);
  });
});

describe("FrameDecoder", () => {
  it("decodes an OPEN frame's two ids", () => {
    const d = new FrameDecoder();
    const payload = new TextEncoder().encode("op_abc st_def");
    const [frame] = d.push(controlFrame(TAG.OPEN, payload));
    expect(frame).toEqual({ t: "open", handle: { operationId: "op_abc", streamId: "st_def" } });
  });

  it("a malformed OPEN (missing one id) decodes to DecodeFailed, not a half-filled handle", () => {
    const d = new FrameDecoder();
    const [frame] = d.push(controlFrame(TAG.OPEN, new TextEncoder().encode("op_abc")));
    expect(frame.t).toBe("terminal");
    if (frame.t === "terminal") expect(frame.terminal.kind).toBe("DecodeFailed");
  });

  it("decodes a BATCH frame's payload verbatim", () => {
    const d = new FrameDecoder();
    const payload = new Uint8Array([9, 8, 7, 6, 5]);
    const [frame] = d.push(controlFrame(TAG.BATCH, payload));
    expect(frame.t).toBe("batch");
    if (frame.t === "batch") expect(Array.from(frame.payload)).toEqual([9, 8, 7, 6, 5]);
  });

  it("decodes a PROGRESS frame's three big-endian u64 counters, substituting the unknown-total sentinel", () => {
    const d = new FrameDecoder();
    const p = new Uint8Array(24);
    const dv = new DataView(p.buffer);
    dv.setBigUint64(0, 3n, false);
    dv.setBigUint64(8, 12345n, false);
    dv.setBigUint64(16, 0xffffffffffffffffn, false);
    const [frame] = d.push(controlFrame(TAG.PROGRESS, p));
    expect(frame).toEqual({ t: "progress", progress: { batches: 3, bytes: 12345, total: Number.POSITIVE_INFINITY } });
  });

  it("decodes a TERMINAL frame's code and detail", () => {
    const d = new FrameDecoder();
    const payload = new Uint8Array([1, ...new TextEncoder().encode("peer closed")]); // 1 = Cancelled
    const [frame] = d.push(controlFrame(TAG.TERMINAL, payload));
    expect(frame).toEqual({ t: "terminal", terminal: { kind: "Cancelled", detail: "peer closed" } });
  });

  it("reassembles a frame split across two chunks, and counts the copy", () => {
    const d = new FrameDecoder();
    const full = controlFrame(TAG.BATCH, new Uint8Array([1, 2, 3, 4, 5, 6]));
    const first = full.subarray(0, 5);
    const second = full.subarray(5);
    expect(d.push(first)).toEqual([]);
    const [frame] = d.push(second);
    expect(frame.t).toBe("batch");
    if (frame.t === "batch") {
      expect(Array.from(frame.payload)).toEqual([1, 2, 3, 4, 5, 6]);
      expect(frame.contiguous).toBe(false);
    }
    expect(d.stats.reassemblyCopies).toBe(1);
  });

  it("a frame declaring more than the declared ceiling faults the decoder", () => {
    const d = new FrameDecoder();
    d.maxFrameBytes = 10;
    const oversized = controlFrame(TAG.BATCH, new Uint8Array(11));
    const [frame] = d.push(oversized);
    expect(frame.t).toBe("terminal");
    if (frame.t === "terminal") {
      expect(frame.terminal.kind).toBe("DecodeFailed");
      expect(frame.terminal.detail).toContain("10");
    }
    // The fault is sticky: a decoder that already faulted emits nothing further.
    expect(d.push(controlFrame(TAG.BATCH, new Uint8Array(1)))).toEqual([]);
  });

  it("counts a JSON-shaped payload without ever accepting it as valid data (ADR-004 H5)", () => {
    const d = new FrameDecoder();
    d.push(controlFrame(TAG.BATCH, new TextEncoder().encode('{"not":"allowed"}')));
    expect(d.stats.jsonFramesSeen).toBe(1);
  });
});
