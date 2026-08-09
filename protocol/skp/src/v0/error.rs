// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! One error envelope for every SKP refusal (SKP-V0.md §5).
//!
//! `code` is `engine.<variant_snake_case>` for a refusal that came from `engine::EngineError`
//! (mapped exhaustively, with no wildcard arm, by `kernel/src/skp.rs::error_of`) or `skp.<name>` for
//! a protocol-level refusal minted here. `message` is always human-readable prose a UI may display
//! verbatim — for an engine refusal it is `EngineError`'s own `Display` output, unedited, because
//! that text *is* the refusal UX the shell exists to show. `fields` carries the refusal's own named
//! values as strings, so a client can build on them without parsing `message`.

use std::collections::BTreeMap;

#[derive(Clone, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SkpError {
    pub code: String,
    pub message: String,
    #[serde(default)]
    pub fields: BTreeMap<String, String>,
}

impl SkpError {
    /// Build a protocol-level (`skp.*`) error with no fields.
    pub fn protocol(name: &str, message: impl Into<String>) -> Self {
        Self { code: format!("skp.{name}"), message: message.into(), fields: BTreeMap::new() }
    }

    /// Build a protocol-level (`skp.*`) error carrying named fields.
    pub fn protocol_with_fields(
        name: &str,
        message: impl Into<String>,
        fields: impl IntoIterator<Item = (&'static str, String)>,
    ) -> Self {
        Self {
            code: format!("skp.{name}"),
            message: message.into(),
            fields: fields.into_iter().map(|(k, v)| (k.to_string(), v)).collect(),
        }
    }

    pub fn version_unsupported(got: &str) -> Self {
        Self::protocol_with_fields(
            "version_unsupported",
            format!("unsupported skp version `{got}`; this host speaks `{}`", crate::v0::SKP_VERSION),
            [("got", got.to_string()), ("supported", crate::v0::SKP_VERSION.to_string())],
        )
    }

    pub fn unknown_dataset(handle: &str) -> Self {
        Self::protocol_with_fields(
            "unknown_dataset",
            format!("no open dataset with handle `{handle}` (closed, or never opened this session)"),
            [("handle", handle.to_string())],
        )
    }

    pub fn unknown_handle(handle: &str) -> Self {
        Self::protocol_with_fields(
            "unknown_handle",
            format!("`{handle}` names no known stream or cancel key"),
            [("handle", handle.to_string())],
        )
    }

    pub fn malformed_hex_f64(field: &str, got: &str) -> Self {
        Self::protocol_with_fields(
            "malformed_hex_f64",
            format!("`{field}` is not a valid HexF64 (16 lowercase hex digits): {got:?}"),
            [("field", field.to_string()), ("got", got.to_string())],
        )
    }

    pub fn bbox_not_finite(field: &str) -> Self {
        Self::protocol_with_fields(
            "bbox_not_finite",
            format!("`{field}` decodes to a non-finite value; a NaN or infinite bbox edge selects nothing"),
            [("field", field.to_string())],
        )
    }

    pub fn cancel_key_in_use(key: &str) -> Self {
        Self::protocol_with_fields(
            "cancel_key_in_use",
            format!("cancel key `{key}` already names a live `open_dataset` call"),
            [("cancel_key", key.to_string())],
        )
    }

    pub fn too_many_pending_streams(limit: usize) -> Self {
        Self::protocol_with_fields(
            "too_many_pending_streams",
            format!("declared ceiling MAX_PENDING_TICKETS={limit} reached for this dataset"),
            [("limit", limit.to_string())],
        )
    }
}

impl std::fmt::Display for SkpError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} ({})", self.message, self.code)
    }
}

impl std::error::Error for SkpError {}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn protocol_codes_are_prefixed_and_engine_codes_are_not_minted_here() {
        let e = SkpError::version_unsupported("skp/9");
        assert_eq!(e.code, "skp.version_unsupported");
        assert_eq!(e.fields.get("got").map(String::as_str), Some("skp/9"));
    }

    #[test]
    fn round_trips_through_json_with_deny_unknown_fields() {
        let e = SkpError::unknown_dataset("ds_deadbeef");
        let json = serde_json::to_string(&e).unwrap();
        let back: SkpError = serde_json::from_str(&json).unwrap();
        assert_eq!(back, e);

        let mut v: serde_json::Value = serde_json::from_str(&json).unwrap();
        v.as_object_mut().unwrap().insert("extra".into(), serde_json::Value::Bool(true));
        assert!(serde_json::from_value::<SkpError>(v).is_err(), "unknown field must be refused");
    }

    #[test]
    fn fields_defaults_to_empty_when_absent() {
        let v = serde_json::json!({"code": "skp.unknown_handle", "message": "m"});
        let e: SkpError = serde_json::from_value(v).unwrap();
        assert!(e.fields.is_empty());
    }
}
