// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Canonical JSON — the one number grammar in this repository.
//!
//! Two artifacts must hash reproducibly: the **style document** (whose hash is carried into the
//! manifest) and the **manifest** itself (whose byte-identity across two publishes is an acceptance
//! criterion). Both canonicalize through this module, deliberately, so there is exactly one number
//! grammar to specify, to test, and to re-implement. `docs/14` makes every file format open
//! permanently, and a format whose canonical form is defined by a Rust standard-library
//! implementation detail is not an open format — so the grammar below is stated in
//! implementation-independent terms and Rust's agreement with it is a property test, not the
//! definition.
//!
//! ## The declared grammar
//!
//! This is a **declared canonical subset**. It is deliberately **not** RFC 8785 / JCS conformance,
//! and must never be described as such: JCS is not implemented here, its number grammar is
//! ECMAScript's, and claiming a standard one does not meet is the kind of unearned claim `docs/01`
//! principle 8 exists to prevent.
//!
//! - **Encoding** UTF-8, no BOM, no trailing newline.
//! - **Whitespace** none outside strings.
//! - **Object keys** emitted in the order the writer inserted them, which for every document this
//!   repository produces is a **schema-declared fixed order**. Not a sort: the key sets here are
//!   closed and finite (unknown keys are refused at parse), so "sorted by code unit" would be
//!   inherited wording describing nothing. A duplicate key is a bug and is refused.
//! - **Strings** `"` and `\` escape to `\"` and `\\`; U+0008 U+0009 U+000A U+000C U+000D escape to
//!   `\b` `\t` `\n` `\f` `\r`; every other code point below U+0020 escapes to `\u00xx` with
//!   lowercase hex. Nothing else is escaped — not `/`, not non-ASCII, which travel as literal UTF-8.
//! - **Integers** minimal decimal, leading `-` when negative, never `+`, never a leading zero,
//!   never an exponent.
//! - **Doubles** non-finite is refused. `-0.0` normalizes to `0.0`. The value is written as the
//!   **shortest fixed-point decimal with at least one fractional digit that parses back to the
//!   identical IEEE-754 double** — no exponent, ever. To keep that representable the admissible
//!   domain is `0` or `1e-6 <= |v| < 1e15`; anything else is refused rather than written in a form
//!   this grammar cannot express. EPSG:2056 magnitudes (~2.6e6) sit comfortably inside it, which is
//!   what the manifest's `bounds` need.
//!
//! The domain restriction is the part worth reading twice: it is what lets the grammar promise "no
//! exponent" without that promise quietly depending on the magnitudes anyone happens to pass.

use std::fmt::Write as _;

/// A JSON value that remembers the order its object keys were inserted in.
///
/// `serde_json::Value`'s map is either sorted or hash-ordered depending on a feature flag, and
/// neither is "the order this schema declares". Carrying our own is what makes the key-order rule a
/// property of the writer rather than of a dependency's build configuration.
#[derive(Clone, Debug, PartialEq)]
pub enum Json {
    Null,
    Bool(bool),
    /// A signed integer. Written with no fractional part.
    Int(i64),
    /// An unsigned integer. Separate from `Int` so a `u64` above `i64::MAX` — which ADR-016 §7's
    /// width contract makes a real case for feature ids — is not silently narrowed.
    UInt(u64),
    /// A double. Subject to the domain restriction above.
    Double(f64),
    Str(String),
    Arr(Vec<Json>),
    /// Insertion-ordered members.
    Obj(Vec<(String, Json)>),
}

impl Json {
    /// Build an object from members in their declared order.
    pub fn obj<const N: usize>(members: [(&str, Json); N]) -> Json {
        Json::Obj(members.into_iter().map(|(k, v)| (k.to_string(), v)).collect())
    }

    pub fn str(s: impl Into<String>) -> Json {
        Json::Str(s.into())
    }

    /// A member list built at runtime, still in insertion order.
    pub fn obj_from(members: Vec<(String, Json)>) -> Json {
        Json::Obj(members)
    }
}

/// The lowest admissible non-zero magnitude, and the first inadmissible one.
///
/// Declared as constants because the refusal has to be greppable from the error it produces.
pub const MIN_ABS_DOUBLE: f64 = 1e-6;
pub const MAX_ABS_DOUBLE: f64 = 1e15;

#[derive(Debug, Clone, PartialEq)]
pub enum CanonicalError {
    /// NaN or an infinity. There is no canonical JSON spelling of either, and substituting `null`
    /// would be a silent conversion.
    NonFinite { at: String },
    /// Finite, but outside the domain the no-exponent rule can express.
    OutOfDomain { at: String, value: f64 },
    /// Two members of one object share a key. Always a construction bug.
    DuplicateKey { at: String, key: String },
    /// No fixed-point decimal within the tried precisions round-trips. Unreachable inside the
    /// declared domain; kept so the writer cannot silently emit a value that does not round-trip.
    NotRoundTrippable { at: String, value: f64 },
}

impl std::fmt::Display for CanonicalError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NonFinite { at } => write!(
                f,
                "canonical json: the value at {at} is NaN or infinite, which has no canonical \
                 spelling; substituting null would be a silent conversion"
            ),
            Self::OutOfDomain { at, value } => write!(
                f,
                "canonical json: {value:e} at {at} is outside the admissible domain \
                 (0, or {MIN_ABS_DOUBLE:e} <= |v| < {MAX_ABS_DOUBLE:e}); the declared grammar \
                 writes no exponent and cannot express it"
            ),
            Self::DuplicateKey { at, key } => {
                write!(f, "canonical json: object at {at} has two members named `{key}`")
            }
            Self::NotRoundTrippable { at, value } => write!(
                f,
                "canonical json: no fixed-point decimal round-trips {value:e} at {at}"
            ),
        }
    }
}

impl std::error::Error for CanonicalError {}

/// Serialize to the declared canonical form.
pub fn to_canonical_string(v: &Json) -> Result<String, CanonicalError> {
    let mut out = String::new();
    write_value(&mut out, v, "$")?;
    Ok(out)
}

/// Serialize and hash in one step — `sha256:<lowercase hex>` over the canonical UTF-8 bytes.
pub fn canonical_and_hash(v: &Json) -> Result<(String, String), CanonicalError> {
    let s = to_canonical_string(v)?;
    let h = sha256_hex(s.as_bytes());
    Ok((s, h))
}

/// `sha256:<lowercase hex>` over arbitrary bytes. The one place the prefix is spelled.
pub fn sha256_hex(bytes: &[u8]) -> String {
    use sha2::{Digest, Sha256};
    let mut h = Sha256::new();
    h.update(bytes);
    format!("sha256:{:x}", h.finalize())
}

fn write_value(out: &mut String, v: &Json, at: &str) -> Result<(), CanonicalError> {
    match v {
        Json::Null => out.push_str("null"),
        Json::Bool(true) => out.push_str("true"),
        Json::Bool(false) => out.push_str("false"),
        Json::Int(i) => {
            let _ = write!(out, "{i}");
        }
        Json::UInt(u) => {
            let _ = write!(out, "{u}");
        }
        Json::Double(d) => out.push_str(&write_double(*d, at)?),
        Json::Str(s) => write_string(out, s),
        Json::Arr(items) => {
            out.push('[');
            for (i, item) in items.iter().enumerate() {
                if i > 0 {
                    out.push(',');
                }
                write_value(out, item, &format!("{at}[{i}]"))?;
            }
            out.push(']');
        }
        Json::Obj(members) => {
            let mut seen: Vec<&str> = Vec::with_capacity(members.len());
            out.push('{');
            for (i, (k, val)) in members.iter().enumerate() {
                if seen.contains(&k.as_str()) {
                    return Err(CanonicalError::DuplicateKey {
                        at: at.to_string(),
                        key: k.clone(),
                    });
                }
                seen.push(k);
                if i > 0 {
                    out.push(',');
                }
                write_string(out, k);
                out.push(':');
                write_value(out, val, &format!("{at}.{k}"))?;
            }
            out.push('}');
        }
    }
    Ok(())
}

fn write_string(out: &mut String, s: &str) {
    out.push('"');
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\u{08}' => out.push_str("\\b"),
            '\u{09}' => out.push_str("\\t"),
            '\u{0a}' => out.push_str("\\n"),
            '\u{0c}' => out.push_str("\\f"),
            '\u{0d}' => out.push_str("\\r"),
            c if (c as u32) < 0x20 => {
                let _ = write!(out, "\\u{:04x}", c as u32);
            }
            c => out.push(c),
        }
    }
    out.push('"');
}

/// The double grammar, as its own function so the property test can drive it directly.
///
/// Widest precision tried is 30: inside the declared domain the minimal round-tripping fixed-point
/// precision cannot exceed it, and a bound that is reached is a bug rather than a rounding choice —
/// which is why exhausting it is an error and not a fallback to some other spelling.
pub fn write_double(d: f64, at: &str) -> Result<String, CanonicalError> {
    if !d.is_finite() {
        return Err(CanonicalError::NonFinite { at: at.to_string() });
    }
    // `-0.0 == 0.0` is true in IEEE-754, so this normalization is invisible to every comparison and
    // visible only in the bytes — which is the whole reason it has to be written down.
    let d = if d == 0.0 { 0.0 } else { d };
    let mag = d.abs();
    if d != 0.0 && (mag < MIN_ABS_DOUBLE || mag >= MAX_ABS_DOUBLE) {
        return Err(CanonicalError::OutOfDomain { at: at.to_string(), value: d });
    }
    for precision in 1..=30usize {
        let s = format!("{d:.precision$}");
        if s.parse::<f64>() == Ok(d) {
            return Ok(trim_fraction(s));
        }
    }
    Err(CanonicalError::NotRoundTrippable { at: at.to_string(), value: d })
}

/// Drop trailing fractional zeros, keeping at least one fractional digit.
///
/// Trailing zeros after the last significant digit cannot change the value, so this cannot break
/// the round trip the loop above established; keeping one digit is what makes `2600000.0` and not
/// `2600000` the canonical spelling of an integral double, so a reader never has to decide whether
/// an integer-looking token was a double.
fn trim_fraction(mut s: String) -> String {
    if !s.contains('.') {
        s.push_str(".0");
        return s;
    }
    while s.ends_with('0') && !s.ends_with(".0") {
        s.pop();
    }
    s
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn integral_doubles_keep_one_fractional_digit() {
        // So a reader never has to decide whether `2600000` was an integer or a double.
        assert_eq!(write_double(2_600_000.0, "$").unwrap(), "2600000.0");
        assert_eq!(write_double(1.0, "$").unwrap(), "1.0");
        assert_eq!(write_double(0.0, "$").unwrap(), "0.0");
    }

    #[test]
    fn negative_zero_normalizes_so_two_publishes_cannot_differ_by_a_sign_bit() {
        // -0.0 == 0.0, so nothing downstream can see the difference — except the bytes, which is
        // exactly where a determinism assertion lives.
        assert_eq!(write_double(-0.0, "$").unwrap(), "0.0");
        assert_eq!(write_double(0.0, "$").unwrap(), "0.0");
    }

    #[test]
    fn non_finite_is_refused_rather_than_spelled_as_null() {
        assert!(matches!(
            write_double(f64::NAN, "$.bounds.xmin"),
            Err(CanonicalError::NonFinite { .. })
        ));
        assert!(matches!(write_double(f64::INFINITY, "$"), Err(CanonicalError::NonFinite { .. })));
        assert!(matches!(
            write_double(f64::NEG_INFINITY, "$"),
            Err(CanonicalError::NonFinite { .. })
        ));
    }

    #[test]
    fn the_no_exponent_promise_is_kept_by_refusing_what_it_cannot_express() {
        // A grammar that promises "no exponent" and then depends on nobody passing 1e20 has not
        // promised anything.
        assert!(matches!(write_double(1e20, "$"), Err(CanonicalError::OutOfDomain { .. })));
        assert!(matches!(write_double(1e-9, "$"), Err(CanonicalError::OutOfDomain { .. })));
        // …and the LV95 working domain is comfortably inside it.
        assert_eq!(write_double(2_612_680.125, "$").unwrap(), "2612680.125");
        assert_eq!(write_double(1e-6, "$").unwrap(), "0.000001");
    }

    #[test]
    fn every_written_double_parses_back_to_the_identical_bit_pattern() {
        // The property the whole grammar exists for. Deterministic inputs — a seeded walk over the
        // admissible domain, not a random one, so a failure is reproducible.
        let mut state = 0x5EED_2056_0000_0017u64;
        let mut next = || {
            state = state.wrapping_add(0x9E37_79B9_7F4A_7C15);
            let mut z = state;
            z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
            z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
            z ^ (z >> 31)
        };
        for _ in 0..20_000 {
            let unit = (next() >> 11) as f64 * (1.0 / (1u64 << 53) as f64);
            // Spread across the domain: LV95 magnitudes, opacities, widths.
            for v in [
                2_600_000.0 + unit * 12_680.0,
                unit,
                unit * 64.0,
                -(2_600_000.0 + unit * 12_680.0),
            ] {
                let s = write_double(v, "$").unwrap();
                assert_eq!(s.parse::<f64>().unwrap().to_bits(), v.to_bits(), "{v:e} wrote {s}");
                assert!(!s.contains('e') && !s.contains('E'), "{s} used an exponent");
                assert!(s.contains('.'), "{s} has no fractional digit");
            }
        }
    }

    #[test]
    fn object_key_order_is_the_order_inserted_not_a_sort() {
        let v = Json::obj([("zebra", Json::Int(1)), ("alpha", Json::Int(2))]);
        assert_eq!(to_canonical_string(&v).unwrap(), r#"{"zebra":1,"alpha":2}"#);
    }

    #[test]
    fn a_duplicate_key_is_a_refusal_rather_than_a_last_one_wins() {
        let v = Json::Obj(vec![("a".into(), Json::Int(1)), ("a".into(), Json::Int(2))]);
        assert!(matches!(to_canonical_string(&v), Err(CanonicalError::DuplicateKey { .. })));
    }

    #[test]
    fn strings_escape_exactly_the_declared_set() {
        let v = Json::str("q\"b\\s\u{08}\u{09}\u{0a}\u{0c}\u{0d}\u{01}/é");
        assert_eq!(
            to_canonical_string(&v).unwrap(),
            "\"q\\\"b\\\\s\\b\\t\\n\\f\\r\\u0001/é\""
        );
    }

    #[test]
    fn a_u64_above_i64_max_is_not_narrowed() {
        // ADR-016 §7 makes identity width part of the contract; a manifest that narrowed one would
        // be recording a different number than the engine emitted.
        let v = Json::UInt(u64::MAX);
        assert_eq!(to_canonical_string(&v).unwrap(), "18446744073709551615");
    }

    #[test]
    fn the_hash_is_over_the_canonical_bytes() {
        let v = Json::obj([("a", Json::Int(1))]);
        let (s, h) = canonical_and_hash(&v).unwrap();
        assert_eq!(s, r#"{"a":1}"#);
        assert_eq!(h, sha256_hex(s.as_bytes()));
        assert!(h.starts_with("sha256:"));
    }
}
