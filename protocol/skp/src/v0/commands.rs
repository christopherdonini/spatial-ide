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
    /// `skp/0.2`: an explicit CRS assertion, admitted only over a file that declares none
    /// (ADR-015 §4). `null` declares "no assertion" — matches `bbox_crs`/`filter`'s own discipline
    /// (SKP-V0.md §7.2): the field carries no `#[serde(default)]`, always present on the wire, and
    /// a plain `Option<CrsAssertion>` with `None` still serializes to JSON `null`, never an absent
    /// key. The wire carries no attribution (`by`/`at`) — the host mints those (ADR-004
    /// Amendment 4; ADR-024 F-5).
    pub crs_assertion: Option<CrsAssertion>,
    /// `skp/0.2`: an explicit declaration of which column carries feature identity (ADR-016
    /// §3–§7). Same discipline as `crs_assertion` above: `null` means "no declaration", never an
    /// absent key.
    pub identity: Option<IdentityDeclaration>,
}

/// `skp/0.2`: a caller-asserted CRS for `open_dataset` (ADR-015 §4). Admitted only over a file
/// that declares no CRS; refused, without comparing, over a file that already declares one
/// (`engine.crs_assertion_conflict`). No attribution field here — the wire never carries `by`/`at`
/// (ADR-004 Amendment 4); the host mints both when it records the assertion.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CrsAssertion {
    pub identifier: String,
    pub definition_json: String,
}

/// `skp/0.2`: a caller declaration of which column carries stable feature identity (ADR-016
/// §3–§7), used to admit a file whose identity is not its own `id` column. No attribution field
/// here either, for the same reason as [`CrsAssertion`].
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct IdentityDeclaration {
    pub column: String,
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
    /// **ADR-026 decision 2** (this cut's P2), `Some` only when `source == "caller_asserted"`:
    /// `catalog:<id>@sha256:<first-12-hex>` if the assertion's `definition_json` matched a pinned
    /// in-tree catalog entry's own content hash exactly, `pasted` otherwise. Host-derived at open
    /// (`kernel/src/skp.rs::host_minted_crs_assertion`) — never present on any request; a file's
    /// own declared CRS never went through either ADR-026 supply route, so this is `None` for
    /// `source == "file"`. **Entry 30 (2026-09-03):** an assertion carrying no definition at all
    /// (the CLI `--assert-crs` route, `definition_provenance(None)`) records `none-supplied` — it
    /// previously recorded `pasted`, asserting an action that never happened. A value-domain
    /// widening of this existing field (no new key), so it rides `skp/0.2` with no bump (RULED
    /// 2026-09-04, entry-6 shape + expiry clause); full record in `SKP-V0.md`'s entry-30 addendum.
    pub definition_provenance: Option<String>,
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

/// The single dialect `skp/0.1` admits for [`Filter::predicate`] (design note item 2: `skp/1` is
/// RESERVED and would be where a second dialect, if ever added, gets its own version string — not
/// this one). Named `skp.filter_dialect_unsupported` in the refusal taxonomy (design note item 5),
/// but that taxonomy is wired at the kernel admission boundary (a later phase); this crate only
/// enforces the one value it documents, at construction and at deserialization.
pub const FILTER_DIALECT_DUCKDB_EXPR_0: &str = "duckdb-expr/0";

/// A row filter carried on `viewport_query` (design note item 1): a boolean expression in the
/// declared `dialect`, composed by the host into the query it already builds — never a whole SQL
/// statement, never a derived-dataset handle. `predicate` is opaque text here; this crate does not
/// parse or admit it (docs/09's allowlist walk is engine/kernel work, a later phase) — it only
/// enforces that `dialect` names the one dialect this host speaks, so an unsupported dialect fails
/// before the predicate text is ever looked at.
#[derive(Clone, Debug, Serialize)]
pub struct Filter {
    pub predicate: String,
    pub dialect: String,
}

impl Filter {
    /// Construct a `Filter`, refusing any `dialect` other than [`FILTER_DIALECT_DUCKDB_EXPR_0`].
    /// The same check backs the `Deserialize` impl below (via this constructor), so a `Filter`
    /// built directly in Rust cannot skip a check a wire value is subject to.
    pub fn new(predicate: impl Into<String>, dialect: impl Into<String>) -> Result<Self, String> {
        let dialect = dialect.into();
        if dialect != FILTER_DIALECT_DUCKDB_EXPR_0 {
            return Err(format!(
                "unsupported filter dialect `{dialect}`; this host speaks `{FILTER_DIALECT_DUCKDB_EXPR_0}`"
            ));
        }
        Ok(Self { predicate: predicate.into(), dialect })
    }
}

impl<'de> Deserialize<'de> for Filter {
    fn deserialize<D>(d: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        #[derive(Deserialize)]
        #[serde(deny_unknown_fields)]
        struct Raw {
            predicate: String,
            dialect: String,
        }
        let raw = Raw::deserialize(d)?;
        Filter::new(raw.predicate, raw.dialect).map_err(serde::de::Error::custom)
    }
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
    /// `null` means no filter (matches `bbox_crs`'s discipline: always present on the wire, never
    /// omitted — deny_unknown_fields plus this struct's own derive requires the key, and a plain
    /// `Option<T>` field still serializes to JSON `null`, never an absent key, because nothing here
    /// opts into `skip_serializing_if`). `describe` is untouched by this field (design note item 1).
    pub filter: Option<Filter>,
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
    use crate::v0::SKP_VERSION;

    #[test]
    fn every_request_and_response_round_trips_and_refuses_unknown_fields() {
        let req = OpenDatasetRequest {
            skp: SKP_VERSION.into(),
            path: "C:/data/parcels.parquet".into(),
            cancel_key: "open-1".into(),
            crs_assertion: None,
            identity: None,
        };
        let json = serde_json::to_string(&req).unwrap();
        let _back: OpenDatasetRequest = serde_json::from_str(&json).unwrap();

        let mut v: serde_json::Value = serde_json::from_str(&json).unwrap();
        v.as_object_mut().unwrap().insert("extra".into(), serde_json::Value::Bool(true));
        assert!(serde_json::from_value::<OpenDatasetRequest>(v).is_err());
    }

    /// `skp/0.2`: `crs_assertion`/`identity` follow the exact `bbox_crs`/`filter` discipline —
    /// `null` on the wire is a present, explicit "none declared", never an omitted key.
    #[test]
    fn open_dataset_request_carries_crs_assertion_and_identity_as_explicit_null_when_absent() {
        let req = OpenDatasetRequest {
            skp: SKP_VERSION.into(),
            path: "C:/data/parcels.parquet".into(),
            cancel_key: "open-1".into(),
            crs_assertion: None,
            identity: None,
        };
        let v: serde_json::Value = serde_json::from_str(&serde_json::to_string(&req).unwrap()).unwrap();
        let obj = v.as_object().unwrap();
        assert!(obj.contains_key("crs_assertion"), "crs_assertion key must be present");
        assert!(obj.contains_key("identity"), "identity key must be present");
        assert_eq!(v["crs_assertion"], serde_json::Value::Null);
        assert_eq!(v["identity"], serde_json::Value::Null);
    }

    #[test]
    fn open_dataset_request_with_crs_assertion_and_identity_round_trips() {
        let req = OpenDatasetRequest {
            skp: SKP_VERSION.into(),
            path: "C:/data/parcels.parquet".into(),
            cancel_key: "open-1".into(),
            crs_assertion: Some(CrsAssertion {
                identifier: "EPSG:2056".into(),
                definition_json: "{\"type\":\"GeographicCRS\"}".into(),
            }),
            identity: Some(IdentityDeclaration { column: "parcel_key".into() }),
        };
        let json = serde_json::to_string(&req).unwrap();
        let back: OpenDatasetRequest = serde_json::from_str(&json).unwrap();
        assert_eq!(back.crs_assertion.unwrap().identifier, "EPSG:2056");
        assert_eq!(back.identity.unwrap().column, "parcel_key");
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

    #[test]
    fn filter_accepts_its_one_admitted_dialect_and_round_trips() {
        let f = Filter::new("zone = 3", FILTER_DIALECT_DUCKDB_EXPR_0).unwrap();
        let json = serde_json::to_string(&f).unwrap();
        let back: Filter = serde_json::from_str(&json).unwrap();
        assert_eq!(back.predicate, "zone = 3");
        assert_eq!(back.dialect, FILTER_DIALECT_DUCKDB_EXPR_0);
    }

    #[test]
    fn filter_refuses_any_other_dialect_at_construction_and_at_deserialization() {
        assert!(Filter::new("zone = 3", "sql/ansi").is_err());

        let v = serde_json::json!({"predicate": "zone = 3", "dialect": "sql/ansi"});
        assert!(serde_json::from_value::<Filter>(v).is_err());
    }

    #[test]
    fn filter_deserialization_refuses_unknown_fields_too() {
        let v = serde_json::json!({
            "predicate": "zone = 3",
            "dialect": FILTER_DIALECT_DUCKDB_EXPR_0,
            "extra": true,
        });
        assert!(serde_json::from_value::<Filter>(v).is_err());
    }

    #[test]
    fn viewport_query_request_carries_filter_as_explicit_null_when_absent() {
        let req = ViewportQueryRequest {
            skp: SKP_VERSION.into(),
            dataset: "ds_00112233445566778899aabbccddeeff".parse().unwrap(),
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
        };
        let v: serde_json::Value = serde_json::from_str(&serde_json::to_string(&req).unwrap()).unwrap();
        assert!(v.as_object().unwrap().contains_key("filter"), "filter key must be present");
        assert_eq!(v["filter"], serde_json::Value::Null, "absent filter is `null`, never omitted");
    }

    #[test]
    fn viewport_query_request_with_a_filter_round_trips() {
        let req = ViewportQueryRequest {
            skp: SKP_VERSION.into(),
            dataset: "ds_00112233445566778899aabbccddeeff".parse().unwrap(),
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: Some(Filter::new("zone = 3 AND area > 100", FILTER_DIALECT_DUCKDB_EXPR_0).unwrap()),
        };
        let json = serde_json::to_string(&req).unwrap();
        let back: ViewportQueryRequest = serde_json::from_str(&json).unwrap();
        assert_eq!(back.filter.unwrap().predicate, "zone = 3 AND area > 100");
    }
}
