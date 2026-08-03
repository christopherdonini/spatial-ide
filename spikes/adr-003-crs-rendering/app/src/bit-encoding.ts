// M5 item 4 (README ADR-004 amendment draft): a plain f64 sent as a Tauri
// invoke() command argument was measured (M4 diagnostic notes, "Precision &
// write-path correctness" row) to not reliably survive the JS->Rust IPC
// boundary bit-exact -- 3 of 9 runs showed a 1-ULP loss. Scalars that need
// guaranteed binary identity now cross as an explicit IEEE-754 bit pattern,
// a fixed 16-hex-digit lowercase string, instead of a native JSON number.
// Rust-side counterpart: f64_to_hex_bits/hex_bits_to_f64 in src-tauri/src/lib.rs.

/** Encodes a JS number's exact IEEE-754 double bit pattern as 16 lowercase hex digits. */
export function f64ToHexBits(v: number): string {
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, v);
  return dv.getBigUint64(0).toString(16).padStart(16, "0");
}

/** Inverse of f64ToHexBits. Throws on a string that isn't exactly 16 hex digits. */
export function hexBitsToF64(hex: string): number {
  if (!/^[0-9a-fA-F]{16}$/.test(hex)) {
    throw new Error(`hexBitsToF64: expected 16 hex digits, got ${JSON.stringify(hex)}`);
  }
  const dv = new DataView(new ArrayBuffer(8));
  dv.setBigUint64(0, BigInt(`0x${hex}`));
  return dv.getFloat64(0);
}
