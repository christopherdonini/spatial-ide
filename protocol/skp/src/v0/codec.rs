// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Bit-critical scalar codecs for the control plane (ADR-004 amendment 1, SKP-V0.md §3).
//!
//! JSON floats crossing the webview IPC boundary were measured 1-ULP-unstable in 3/9 runs (spike
//! M4): a viewport edge that drifts by 1 ULP silently changes which features are selected. So a
//! bbox edge crosses as [`HexF64`] — an explicit IEEE-754 bit pattern, hex-encoded — never as a
//! JSON number. A `u64` (id, row count, byte count) crosses as [`DecU64`] — a decimal string — for
//! the same reason `docs/16`'s width contract exists: `Number` is lossy above 2^53 and an unhandled
//! `BigInt` serialization is the M4 root cause behind ADR-010 rule 7.
//!
//! Both are **strict**: a malformed value is a refusal, never a best-effort parse.

/// Why a [`HexF64`] failed to decode — kept distinct so a caller can map the two cases to different
/// SKP error codes (`skp.malformed_hex_f64` vs `skp.bbox_not_finite`).
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum HexF64ParseError {
    /// Not 16 lowercase hex digits, or not parseable as one.
    Malformed(String),
    /// The bit pattern decoded to a value that cannot describe a bbox edge.
    NonFinite(String),
}

impl std::fmt::Display for HexF64ParseError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Malformed(s) => write!(f, "not a valid HexF64 (16 lowercase hex digits): {s:?}"),
            Self::NonFinite(s) => write!(f, "bit pattern {s} decodes to a non-finite value"),
        }
    }
}

impl std::error::Error for HexF64ParseError {}

/// An `f64` carried as its exact IEEE-754 bit pattern, big-endian, 16 lowercase hex digits.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct HexF64(pub f64);

impl HexF64 {
    pub fn to_hex(self) -> String {
        format!("{:016x}", self.0.to_bits())
    }

    pub fn from_hex(s: &str) -> Result<Self, HexF64ParseError> {
        if s.len() != 16 || !s.bytes().all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b)) {
            return Err(HexF64ParseError::Malformed(s.to_string()));
        }
        let bits = u64::from_str_radix(s, 16).map_err(|_| HexF64ParseError::Malformed(s.to_string()))?;
        let v = f64::from_bits(bits);
        if !v.is_finite() {
            return Err(HexF64ParseError::NonFinite(s.to_string()));
        }
        Ok(Self(v))
    }
}

impl serde::Serialize for HexF64 {
    fn serialize<S: serde::Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&self.to_hex())
    }
}

impl<'de> serde::Deserialize<'de> for HexF64 {
    fn deserialize<D>(d: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(d)?;
        HexF64::from_hex(&s).map_err(serde::de::Error::custom)
    }
}

/// A `u64` carried as a minimal decimal string — never a leading zero (except the literal `0`),
/// never a sign. The same "minimal decimal" discipline ADR-017 §2 already uses for canonical JSON
/// integers, applied here so a control-plane count cannot be confused with a JSON float that
/// happens to have no fractional part.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct DecU64(pub u64);

impl DecU64 {
    pub fn to_dec(self) -> String {
        self.0.to_string()
    }

    pub fn from_dec(s: &str) -> Result<Self, String> {
        if s.is_empty() || !s.bytes().all(|b| b.is_ascii_digit()) {
            return Err(format!("not a valid DecU64 (decimal digits only): {s:?}"));
        }
        if s.len() > 1 && s.starts_with('0') {
            return Err(format!("not a valid DecU64 (leading zero): {s:?}"));
        }
        s.parse::<u64>().map(DecU64).map_err(|e| format!("DecU64 out of range: {s:?} ({e})"))
    }
}

impl serde::Serialize for DecU64 {
    fn serialize<S: serde::Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&self.to_dec())
    }
}

impl<'de> serde::Deserialize<'de> for DecU64 {
    fn deserialize<D>(d: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(d)?;
        DecU64::from_dec(&s).map_err(serde::de::Error::custom)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hex_f64_round_trips_bit_exact() {
        let x = 2_600_000.123_456_789_f64;
        let hex = HexF64(x).to_hex();
        assert_eq!(hex.len(), 16);
        assert_eq!(HexF64::from_hex(&hex).unwrap().0.to_bits(), x.to_bits());
    }

    #[test]
    fn hex_f64_rejects_wrong_length_case_and_prefix() {
        assert!(matches!(HexF64::from_hex("0"), Err(HexF64ParseError::Malformed(_))));
        assert!(matches!(HexF64::from_hex(&"0".repeat(17)), Err(HexF64ParseError::Malformed(_))));
        assert!(matches!(
            HexF64::from_hex("00000000000000AA"),
            Err(HexF64ParseError::Malformed(_))
        ));
        assert!(matches!(
            HexF64::from_hex("0x00000000000000"),
            Err(HexF64ParseError::Malformed(_))
        ));
    }

    #[test]
    fn hex_f64_rejects_non_finite_bit_patterns() {
        // f64::INFINITY.to_bits() = 0x7ff0000000000000
        assert!(matches!(
            HexF64::from_hex("7ff0000000000000"),
            Err(HexF64ParseError::NonFinite(_))
        ));
        // A NaN bit pattern.
        assert!(matches!(
            HexF64::from_hex("7ff8000000000000"),
            Err(HexF64ParseError::NonFinite(_))
        ));
    }

    #[test]
    fn dec_u64_round_trips_and_rejects_malformed() {
        assert_eq!(DecU64::from_dec("0").unwrap().0, 0);
        assert_eq!(DecU64::from_dec("18446744073709551615").unwrap().0, u64::MAX);
        assert!(DecU64::from_dec("").is_err());
        assert!(DecU64::from_dec("-1").is_err());
        assert!(DecU64::from_dec("01").is_err());
        assert!(DecU64::from_dec("1.0").is_err());
        assert!(DecU64::from_dec("18446744073709551616").is_err(), "overflow");
    }

    #[test]
    fn both_codecs_serialize_as_json_strings_not_numbers() {
        let j = serde_json::to_string(&HexF64(1.5)).unwrap();
        assert!(j.starts_with('"') && j.ends_with('"'));
        let j = serde_json::to_string(&DecU64(42)).unwrap();
        assert_eq!(j, "\"42\"");
    }
}
