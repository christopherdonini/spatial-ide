import { describe, expect, it } from "vitest";

import { decodeDecU64, decodeHexF64, encodeDecU64, encodeHexF64 } from "./codec";

describe("HexF64 (ADR-004 amendment 1)", () => {
  it("round-trips bit-exact", () => {
    const x = 2_600_000.123_456_789;
    const hex = encodeHexF64(x);
    expect(hex).toHaveLength(16);
    expect(decodeHexF64(hex)).toBe(x);
  });

  it("rejects wrong length, case, and prefix", () => {
    expect(() => decodeHexF64("0")).toThrow();
    expect(() => decodeHexF64("0".repeat(17))).toThrow();
    expect(() => decodeHexF64("00000000000000AA")).toThrow();
    expect(() => decodeHexF64("0x00000000000000")).toThrow();
  });

  it("rejects non-finite bit patterns", () => {
    expect(() => decodeHexF64("7ff0000000000000")).toThrow(/non-finite/);
    expect(() => decodeHexF64("7ff8000000000000")).toThrow(/non-finite/);
  });

  it("matches the Rust codec's known bit patterns for round numbers", () => {
    expect(encodeHexF64(0)).toBe("0000000000000000");
    expect(encodeHexF64(1)).toBe("3ff0000000000000");
    expect(encodeHexF64(2)).toBe("4000000000000000");
  });
});

describe("DecU64", () => {
  it("round-trips and rejects malformed input", () => {
    expect(decodeDecU64("0")).toBe(0n);
    expect(decodeDecU64("18446744073709551615")).toBe(18446744073709551615n);
    expect(() => decodeDecU64("")).toThrow();
    expect(() => decodeDecU64("-1")).toThrow();
    expect(() => decodeDecU64("01")).toThrow();
    expect(() => decodeDecU64("1.0")).toThrow();
  });

  it("encodes a bigint as a minimal decimal string", () => {
    expect(encodeDecU64(0n)).toBe("0");
    expect(encodeDecU64(42n)).toBe("42");
    expect(() => encodeDecU64(-1n)).toThrow();
  });
});
