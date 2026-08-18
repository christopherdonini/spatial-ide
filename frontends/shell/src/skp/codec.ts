// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Bit-critical scalar codecs for the control plane (ADR-004 amendment 1, `protocol/skp/SKP-V0.md`
 * §3). JSON floats crossing the webview IPC boundary were measured 1-ULP-unstable in 3/9 runs
 * (spike M4): a viewport edge that drifts by 1 ULP silently changes which features are selected.
 *
 * These must decode identically to `protocol/skp/src/v0/codec.rs` -- that Rust module is the
 * source of truth; this file is the TypeScript sibling, not an independent design.
 */

/** A 16-lowercase-hex-digit encoding of an f64's IEEE-754 bit pattern. */
export type HexF64 = string;

/** A decimal-string encoding of a u64. Kept as `bigint` client-side once decoded, never `Number`,
 * which is lossy above 2^53 -- the exact hazard ADR-016 §7 names. */
export type DecU64 = string;

export function encodeHexF64(value: number): HexF64 {
  const buf = new ArrayBuffer(8);
  new DataView(buf).setFloat64(0, value, false); // big-endian, matching f64::to_bits().to_be_bytes()
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function decodeHexF64(hex: HexF64): number {
  if (!/^[0-9a-f]{16}$/.test(hex)) {
    throw new Error(`not a valid HexF64 (16 lowercase hex digits): ${JSON.stringify(hex)}`);
  }
  const bytes = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  const value = new DataView(bytes.buffer).getFloat64(0, false);
  if (!Number.isFinite(value)) {
    throw new Error(`bit pattern ${hex} decodes to a non-finite value`);
  }
  return value;
}

export function encodeDecU64(value: bigint): DecU64 {
  if (value < 0n) {
    throw new Error(`DecU64 must be non-negative: ${value}`);
  }
  return value.toString(10);
}

export function decodeDecU64(dec: DecU64): bigint {
  if (!/^(0|[1-9][0-9]*)$/.test(dec)) {
    throw new Error(`not a valid DecU64 (decimal, no leading zero): ${JSON.stringify(dec)}`);
  }
  return BigInt(dec);
}
