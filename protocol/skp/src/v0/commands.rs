// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The five SKP v0 commands: `open_dataset`, `describe`, `viewport_query`, `cancel`,
//! `close_dataset`. Nothing else — see `../../SKP-V0.md` §4's named-deferral list.
//!
//! Every struct here is `#[serde(deny_unknown_fields)]` in both directions: adding, removing or
//! retyping a field is a new `skp` version string, never a tolerant reader (SKP-V0.md §4 item 13).

use serde::{Deserialize, Serialize};

use crate::v0::{DatasetHandle, DecU64, HexF64, StreamHandle};

// ---------------------------------------------------------------------------------------------
// open_dataset
// ---------------------------------------------------------------------------------------------

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct OpenDatasetRequest {
    pub skp: String,
    /// UTF-8, absolute; canonicalized and checked by the host. Never a data-plane value — the path
    /// stays on the control plane for its whole life.
    pub path: String,
    /// Client-minted (SKP-V0.md §3): names this specific open so `cancel` can stop it before it
    /// returns a handle.
    pub cancel_key: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct OpenDatasetResponse {
    pub dataset: DatasetHandle,
}

// ---------------------------------------------------------------------------------------------
// describe
// ---------------------------------------------------------------------------------------------

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct DescribeRequest {
    pub skp: String,
    pub dataset: DatasetHandle,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SourceInfo {
    pub path_display: String,
    pub geoparquet_version: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CrsInfo {
    pub identifier: String,
    pub definition_json: Option<String>,
    /// `"file"` or `"caller_asserted"`.
    pub source: String,
    pub asserted_by: Option<String>,
    pub asserted_at: Option<String>,
    pub axis_order: String,
    /// Always `"none-performed"` in this slice — no axis normalization is performed anywhere.
    pub axis_normalization: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct GeometryInfo {
    pub column: String,
    /// Always `"geoarrow.polygon"` in this slice.
    pub encoding: String,
    /// Always `"interleaved-xy"` in this slice.
    pub coordinate_layout: String,
    /// ADR-010 rule 1's envelope tag, surfaced. Always `"authoritative-project-crs"` here — this is
    /// the tag a bulk batch's own schema metadata already carries; `describe` states it once so the
    /// UI need not decode an Arrow schema just to show it.
    pub frame: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct IdentityInfo {
    /// `"file:id"` or `"mapped:<column>"`.
    pub source: String,
    /// `"verified-at-open-full-file"` or `"declared-not-verified"` — never the bare word "unique"
    /// (ADR-016 §6).
    pub uniqueness: String,
    pub verified_rows: Option<DecU64>,
    pub max_value: Option<DecU64>,
    pub js_exact: Option<bool>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct FieldInfo {
    pub name: String,
    pub arrow_type: String,
    pub nullable: bool,
}

/// **C2** (SKP-V0.md §2): never a bare integer. `basis` names what was actually established.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct RowCount {
    pub basis: String,
    pub value: Option<DecU64>,
}

/// **C1** (SKP-V0.md §2): no `Dataset::bounds()` accessor exists, so `describe` never claims one.
/// `basis` is always `"not-established-at-open"` and `value` is always `null` in v0 — the type
/// stays four-cornered so a future basis (e.g. a covering-bbox aggregate) is a value change, not a
/// shape change.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Extent {
    pub basis: String,
    pub value: Option<[HexF64; 4]>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct LicenseInfo {
    pub license: Option<String>,
    pub attribution: Option<String>,
    pub redistribution: Option<String>,
    pub declares_anything: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct DescribeResponse {
    pub source: SourceInfo,
    pub crs: CrsInfo,
    pub geometry: GeometryInfo,
    pub identity: IdentityInfo,
    pub schema: Vec<FieldInfo>,
    pub covering_bbox: bool,
    pub row_count: RowCount,
    pub extent: Extent,
    pub license: LicenseInfo,
}

// ---------------------------------------------------------------------------------------------
// viewport_query
// ---------------------------------------------------------------------------------------------

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Bbox {
    pub xmin: HexF64,
    pub ymin: HexF64,
    pub xmax: HexF64,
    pub ymax: HexF64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ViewportQueryRequest {
    pub skp: String,
    pub dataset: DatasetHandle,
    pub bbox: Option<Bbox>,
    /// `null` declares "in the dataset's own CRS" (ADR-015 §7). Never inferred from silence — a
    /// present `bbox` with an absent `bbox_crs` is exactly that declaration, not a missing field.
    pub bbox_crs: Option<String>,
    pub limit: Option<DecU64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ViewportQueryResponse {
    /// A ticket, not a data channel (ADR-019). Redeemed exactly once by the data plane.
    pub stream: StreamHandle,
    pub expires_in_ms: u32,
}

// ---------------------------------------------------------------------------------------------
// cancel
// ---------------------------------------------------------------------------------------------

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CancelRequest {
    pub skp: String,
    /// Either a [`StreamHandle`] or a `CancelKey`, disambiguated by the host on its `_` prefix
    /// (`sh_...` vs a client-chosen key). Untyped here because a single request may legitimately
    /// name either kind and the wire does not know in advance which.
    pub handle: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CancelResponse {
    /// `"requested"`, `"unknown"`, or `"already_terminal"`. No timestamp, counter or duration here —
    /// ADR-004 Amendment 4 forbids instrument surface as an SKP field.
    pub state: String,
}

// ---------------------------------------------------------------------------------------------
// close_dataset
// ---------------------------------------------------------------------------------------------

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CloseDatasetRequest {
    pub skp: String,
    pub dataset: DatasetHandle,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CloseDatasetResponse {
    pub cancelled_streams: u32,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_request_and_response_round_trips_and_refuses_unknown_fields() {
        let req = OpenDatasetRequest {
            skp: "skp/0".into(),
            path: "C:/data/parcels.parquet".into(),
            cancel_key: "open-1".into(),
        };
        let json = serde_json::to_string(&req).unwrap();
        let _back: OpenDatasetRequest = serde_json::from_str(&json).unwrap();

        let mut v: serde_json::Value = serde_json::from_str(&json).unwrap();
        v.as_object_mut().unwrap().insert("extra".into(), serde_json::Value::Bool(true));
        assert!(serde_json::from_value::<OpenDatasetRequest>(v).is_err());
    }

    #[test]
    fn extent_is_always_not_established_shaped_but_typed_for_a_future_basis() {
        let e = Extent { basis: "not-established-at-open".into(), value: None };
        let json = serde_json::to_string(&e).unwrap();
        let back: Extent = serde_json::from_str(&json).unwrap();
        assert!(back.value.is_none());
    }

    #[test]
    fn bbox_edges_are_hex_strings_on_the_wire_not_json_numbers() {
        let b = Bbox {
            xmin: HexF64(0.0),
            ymin: HexF64(0.0),
            xmax: HexF64(1.0),
            ymax: HexF64(1.0),
        };
        let v: serde_json::Value = serde_json::from_str(&serde_json::to_string(&b).unwrap()).unwrap();
        assert_eq!(v["xmin"], serde_json::json!("0000000000000000"), "0.0's bit pattern, quoted");
        assert!(v["xmin"].is_string(), "a bbox edge must never be a JSON number");
    }
}
