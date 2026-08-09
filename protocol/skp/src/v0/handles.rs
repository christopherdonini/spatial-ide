// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Two minting rules, one type per kind (SKP-V0.md §3):
//!
//! - **Kernel-minted** ([`DatasetHandle`], [`StreamHandle`]) — held wherever possession authorizes
//!   *data to flow*. OS CSPRNG, unguessable, opaque to the client that receives one.
//! - **Client-minted** ([`CancelKey`]) — held wherever its only power is to stop the caller's *own*
//!   already-authorized work. Format-checked on arrival, never minted here.
//!
//! All three are session-scoped and non-persistable: none may be written to disk, logged, or reused
//! across a process restart (docs/11's ResourceRef model and ADR-016's "stability across reopen"
//! OPEN block are both unsatisfied).

use std::fmt;

fn mint_hex_id(prefix: &str) -> String {
    let mut bytes = [0u8; 16]; // 16 bytes -> 32 lowercase hex chars
    getrandom::fill(&mut bytes).expect("OS CSPRNG unavailable");
    format!("{prefix}_{}", hex::encode(bytes))
}

fn parse_kernel_minted(prefix: &str, s: &str) -> Result<(), String> {
    let head = format!("{prefix}_");
    let hex_part = s.strip_prefix(&head).ok_or_else(|| {
        format!("not a valid {prefix} handle: {s:?} (expected `{head}` + 32 lowercase hex digits)")
    })?;
    if hex_part.len() != 32 || !hex_part.bytes().all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b))
    {
        return Err(format!(
            "not a valid {prefix} handle: {s:?} (expected `{head}` + 32 lowercase hex digits)"
        ));
    }
    Ok(())
}

macro_rules! kernel_minted_handle {
    ($name:ident, $prefix:literal, $doc:literal) => {
        #[doc = $doc]
        #[derive(Clone, Debug, PartialEq, Eq, Hash, serde::Serialize)]
        #[serde(transparent)]
        pub struct $name(String);

        impl $name {
            /// Mint a fresh handle from the OS CSPRNG. Called only by the kernel.
            pub fn mint() -> Self {
                Self(mint_hex_id($prefix))
            }

            pub fn as_str(&self) -> &str {
                &self.0
            }
        }

        impl std::str::FromStr for $name {
            type Err = String;
            fn from_str(s: &str) -> Result<Self, String> {
                parse_kernel_minted($prefix, s)?;
                Ok(Self(s.to_string()))
            }
        }

        impl TryFrom<String> for $name {
            type Error = String;
            fn try_from(s: String) -> Result<Self, String> {
                parse_kernel_minted($prefix, &s)?;
                Ok(Self(s))
            }
        }

        impl<'de> serde::Deserialize<'de> for $name {
            fn deserialize<D>(d: D) -> Result<Self, D::Error>
            where
                D: serde::Deserializer<'de>,
            {
                let s = String::deserialize(d)?;
                $name::try_from(s).map_err(serde::de::Error::custom)
            }
        }

        impl fmt::Display for $name {
            fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
                f.write_str(&self.0)
            }
        }
    };
}

kernel_minted_handle!(
    DatasetHandle,
    "ds",
    "An open dataset. Kernel-minted; authorizes `describe`, `viewport_query` and `close_dataset` \
     against the dataset it names."
);
kernel_minted_handle!(
    StreamHandle,
    "sh",
    "A single-use, expiring ticket minted by `viewport_query` and redeemed exactly once by the data \
     plane (ADR-019). Authorizes one stream's worth of data to flow."
);

/// Names an in-flight `open_dataset` call so `cancel` can stop it before it returns a
/// [`DatasetHandle`]. **Client-minted** — its only power is to stop the caller's own call, so there
/// is nothing for the kernel to authorize by minting it.
#[derive(Clone, Debug, PartialEq, Eq, Hash, serde::Serialize)]
#[serde(transparent)]
pub struct CancelKey(String);

impl CancelKey {
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

fn parse_cancel_key(s: &str) -> Result<(), String> {
    if s.is_empty() || s.len() > 64 {
        return Err(format!(
            "not a valid cancel key: {s:?} (1..=64 characters of [A-Za-z0-9_-], got length {})",
            s.len()
        ));
    }
    if !s.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'_' || b == b'-') {
        return Err(format!(
            "not a valid cancel key: {s:?} (only [A-Za-z0-9_-] is admissible)"
        ));
    }
    Ok(())
}

impl std::str::FromStr for CancelKey {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, String> {
        parse_cancel_key(s)?;
        Ok(Self(s.to_string()))
    }
}

impl TryFrom<String> for CancelKey {
    type Error = String;
    fn try_from(s: String) -> Result<Self, String> {
        parse_cancel_key(&s)?;
        Ok(Self(s))
    }
}

impl<'de> serde::Deserialize<'de> for CancelKey {
    fn deserialize<D>(d: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(d)?;
        CancelKey::try_from(s).map_err(serde::de::Error::custom)
    }
}

impl fmt::Display for CancelKey {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn minted_handles_round_trip_and_carry_their_prefix() {
        let d = DatasetHandle::mint();
        assert!(d.as_str().starts_with("ds_"));
        assert_eq!(d.as_str().len(), 3 + 32);
        let back: DatasetHandle = d.as_str().parse().unwrap();
        assert_eq!(back, d);

        let s = StreamHandle::mint();
        assert!(s.as_str().starts_with("sh_"));
        let back: StreamHandle = s.as_str().parse().unwrap();
        assert_eq!(back, s);
    }

    #[test]
    fn two_mints_differ() {
        assert_ne!(DatasetHandle::mint(), DatasetHandle::mint());
        assert_ne!(StreamHandle::mint(), StreamHandle::mint());
    }

    #[test]
    fn a_dataset_handle_is_not_accepted_as_a_stream_handle() {
        let d = DatasetHandle::mint();
        assert!(d.as_str().parse::<StreamHandle>().is_err());
    }

    #[test]
    fn malformed_handles_are_rejected() {
        assert!("ds_".parse::<DatasetHandle>().is_err());
        assert!("ds_notHEX".parse::<DatasetHandle>().is_err());
        assert!("DS_00000000000000000000000000000000".parse::<DatasetHandle>().is_err(), "case-sensitive");
        assert!("ds_0000000000000000000000000000000".parse::<DatasetHandle>().is_err(), "31 hex chars");
    }

    #[test]
    fn cancel_keys_accept_the_declared_alphabet_and_length() {
        assert!("a".parse::<CancelKey>().is_ok());
        assert!("A-Za-z0-9_-".parse::<CancelKey>().is_ok());
        assert!("".parse::<CancelKey>().is_err());
        assert!("x".repeat(65).parse::<CancelKey>().is_err());
        assert!("x".repeat(64).parse::<CancelKey>().is_ok());
        assert!("has a space".parse::<CancelKey>().is_err());
    }

    #[test]
    fn handles_serialize_as_bare_json_strings() {
        let d = DatasetHandle::mint();
        let json = serde_json::to_string(&d).unwrap();
        assert_eq!(json, format!("\"{}\"", d.as_str()));
        let back: DatasetHandle = serde_json::from_str(&json).unwrap();
        assert_eq!(back, d);
    }
}
