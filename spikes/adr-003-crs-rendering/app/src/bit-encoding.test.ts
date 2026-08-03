// CI item "serialization and exact-ID behaviour" -- the JS-side half of the
// bit-pattern encoding M5 item 4 added (src-tauri/src/lib.rs has the Rust
// counterpart, cargo test bit_encoding_tests). Pure logic, no IPC -- this
// cannot reproduce the original bug (that lived in the Tauri IPC transport,
// not in either side's encode/decode functions) but does guard against a
// regression in the encoding scheme itself, on any platform Node runs on.

import { test } from "node:test";
import assert from "node:assert/strict";
import { f64ToHexBits, hexBitsToF64 } from "./bit-encoding.ts";

function roundtripOk(hex: string): boolean {
  return f64ToHexBits(hexBitsToF64(hex)) === hex;
}

test("bit-encoding: IEEE-754 special values round-trip exactly", () => {
  const specials = [
    "0000000000000000", // +0
    "8000000000000000", // -0
    "7ff0000000000000", // +inf
    "fff0000000000000", // -inf
    "7ff8000000000000", // canonical quiet NaN
    "fff8000000000000", // negative canonical NaN
    "7ff0000000000001", // NaN, minimal nonzero payload
    "0000000000000001", // smallest positive subnormal
    "000fffffffffffff", // largest subnormal
  ];
  for (const hex of specials) {
    assert.ok(roundtripOk(hex), `${hex} failed to round-trip`);
  }
});

test("bit-encoding: the two distinct historically-observed failing values round-trip exactly", () => {
  // Same regression cases as the Rust test and the M5 property test (README
  // "Diagnostic notes (M5 item 4)") -- named, not synthetic.
  const observed = [
    "41444a815dce737b",
    "41444a815dce737a",
    f64ToHexBits(1185592.4587547975),
    f64ToHexBits(1185592.4587547977),
  ];
  for (const hex of observed) {
    assert.ok(roundtripOk(hex), `${hex} failed to round-trip`);
  }
});

test("bit-encoding: random 64-bit patterns round-trip exactly (10,000 samples)", () => {
  for (let i = 0; i < 10_000; i++) {
    const hi = (Math.floor(Math.random() * 0x100000000) >>> 0).toString(16).padStart(8, "0");
    const lo = (Math.floor(Math.random() * 0x100000000) >>> 0).toString(16).padStart(8, "0");
    const hex = hi + lo;
    assert.ok(roundtripOk(hex), `${hex} failed to round-trip`);
  }
});

test("bit-encoding: hexBitsToF64 rejects malformed input rather than silently misparsing", () => {
  assert.throws(() => hexBitsToF64("not-hex"));
  assert.throws(() => hexBitsToF64("abc")); // too short
  assert.throws(() => hexBitsToF64("41444a815dce737b00")); // too long
});
