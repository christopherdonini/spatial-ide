// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **`SkpHost` — the five SKP v0 commands, meeting the engine and the data plane.**
//!
//! `protocol/skp` defines the wire shapes with zero dependency on `engine`, `protocol/data-plane`
//! or this crate; this module is where that changes on purpose. Every Tauri command handler in
//! `frontends/shell/src-tauri` is a thin wrapper that decodes a request, calls one method here, and
//! serializes the result — the same "frontends are clients only, no logic" discipline docs/02
//! states for the module boundary, applied one layer lower.
//!
//! See `protocol/skp/SKP-V0.md` for the design note and
//! `docs/adr/ADR-019-control-plane-admission-tickets.md` for the ticket mechanism `StreamRegistry`
//! implements.

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use spatial_data_plane::transport::{BatchSource, SourceCancel};
use spatial_engine::{CancelToken, Dataset, EngineError, ViewportQuery};
use spatial_skp::v0::{
    CancelKey, CancelRequest, CancelResponse, CloseDatasetRequest, CloseDatasetResponse, CrsInfo,
    DatasetHandle, DecU64, DescribeRequest, DescribeResponse, Extent, FieldInfo, GeometryInfo,
    IdentityInfo, LicenseInfo, OpenDatasetRequest, OpenDatasetResponse, RowCount, SkpError,
    SourceInfo, StreamHandle, ViewportQueryRequest, ViewportQueryResponse, SKP_VERSION,
};

use crate::{open_engine_stream, wrap_for_data_plane, Catalog, StreamConnectionRecord};

/// ADR-019: an unredeemed ticket is swept and its slot freed.
pub const TICKET_TTL: Duration = Duration::from_secs(30);
/// ADR-019, ADR-010 rule 6 (declared, not discovered): `viewport_query` mints tickets at gesture
/// rate under supersede-on-pan, and an unbounded pending set per dataset is exactly the failure a
/// declared ceiling exists to name in advance.
pub const MAX_PENDING_TICKETS: usize = 8;

/// `state` in a [`CancelResponse`] (SKP-V0.md §1) — no timestamp, counter or duration attaches to
/// it (ADR-004 Amendment 4).
pub enum CancelOutcome {
    Requested,
    Unknown,
    AlreadyTerminal,
}

impl CancelOutcome {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Requested => "requested",
            Self::Unknown => "unknown",
            Self::AlreadyTerminal => "already_terminal",
        }
    }
}

struct PendingBuilt {
    source: Box<dyn BatchSource>,
    cancel: Arc<dyn SourceCancel>,
}

enum TicketState {
    /// Minted by `viewport_query`, not yet redeemed by the data plane. The engine stream already
    /// exists and is already validated — `viewport_query` built it synchronously before minting —
    /// so redemption costs a lock and a map removal, nothing more.
    Pending { built: PendingBuilt, dataset: String, minted_at: Instant },
    /// Redeemed exactly once. `cancelled` is this registry's own record of whether `cancel` has
    /// been called on it — never inferred from the underlying `SourceCancel`, which exposes no way
    /// to ask.
    Redeemed { dataset: String, cancel: Arc<dyn SourceCancel>, cancelled: bool },
    /// Was `Pending`, cancelled before a redemption ever arrived. A later redemption is refused —
    /// this is the whole of what closes the cancel-then-redeem race ADR-019 names.
    CancelledBeforeRedeem,
}

/// The kernel's half of ADR-019: mints and redeems single-use, expiring stream tickets.
///
/// **Shared, not owned, by two callers.** `SkpHost::viewport_query` mints;
/// `EngineSourceFactory::ticket_only`'s `create` redeems. Both must hold the *same* `Arc` — see
/// `frontends/shell/src-tauri`'s app setup, which constructs one `StreamRegistry` and gives a clone
/// to each.
#[derive(Default)]
pub struct StreamRegistry {
    tickets: Mutex<HashMap<String, TicketState>>,
}

impl StreamRegistry {
    pub fn new() -> Arc<Self> {
        Arc::new(Self::default())
    }

    fn sweep_locked(tickets: &mut HashMap<String, TicketState>) {
        tickets.retain(|_, state| match state {
            TicketState::Pending { minted_at, .. } => minted_at.elapsed() <= TICKET_TTL,
            _ => true,
        });
    }

    /// Mint a ticket for an already-built, already-validated engine source. Refuses beyond
    /// [`MAX_PENDING_TICKETS`] pending tickets for this dataset — a declared ceiling, not a queue.
    pub fn mint(
        &self,
        dataset: &str,
        source: Box<dyn BatchSource>,
        cancel: Arc<dyn SourceCancel>,
    ) -> Result<StreamHandle, SkpError> {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        Self::sweep_locked(&mut tickets);
        let pending_for_dataset = tickets
            .values()
            .filter(|s| matches!(s, TicketState::Pending { dataset: d, .. } if d == dataset))
            .count();
        if pending_for_dataset >= MAX_PENDING_TICKETS {
            return Err(SkpError::too_many_pending_streams(MAX_PENDING_TICKETS));
        }
        let handle = StreamHandle::mint();
        tickets.insert(
            handle.as_str().to_string(),
            TicketState::Pending {
                built: PendingBuilt { source, cancel },
                dataset: dataset.to_string(),
                minted_at: Instant::now(),
            },
        );
        Ok(handle)
    }

    /// Redeem a ticket exactly once. Called by the data plane's `SourceFactory::create` — its
    /// `Result<_, String>` shape is that trait's, not this module's.
    pub fn redeem(
        &self,
        handle: &str,
    ) -> Result<(Box<dyn BatchSource>, Arc<dyn SourceCancel>), String> {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        Self::sweep_locked(&mut tickets);
        match tickets.get(handle) {
            None => {
                return Err(format!(
                    "ticket `{handle}` is unknown: never minted, already redeemed and gone, or \
                     expired after {TICKET_TTL:?}"
                ))
            }
            Some(TicketState::CancelledBeforeRedeem) => {
                return Err(format!("ticket `{handle}` was cancelled before it was redeemed"))
            }
            Some(TicketState::Redeemed { .. }) => {
                return Err(format!("ticket `{handle}` was already redeemed; a ticket is single-use"))
            }
            Some(TicketState::Pending { .. }) => {}
        }
        let Some(TicketState::Pending { built, dataset, .. }) = tickets.remove(handle) else {
            unreachable!("state checked immediately above, under the same lock");
        };
        tickets.insert(
            handle.to_string(),
            TicketState::Redeemed { dataset, cancel: built.cancel.clone(), cancelled: false },
        );
        Ok((built.source, built.cancel))
    }

    /// Cancel one ticket by its [`StreamHandle`] string.
    pub fn cancel(&self, handle: &str) -> CancelOutcome {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        Self::sweep_locked(&mut tickets);
        match tickets.get_mut(handle) {
            None => CancelOutcome::Unknown,
            Some(TicketState::CancelledBeforeRedeem) => CancelOutcome::AlreadyTerminal,
            Some(state @ TicketState::Pending { .. }) => {
                *state = TicketState::CancelledBeforeRedeem;
                CancelOutcome::Requested
            }
            Some(TicketState::Redeemed { cancel, cancelled, .. }) => {
                if *cancelled {
                    CancelOutcome::AlreadyTerminal
                } else {
                    // ADR-019 D2.4: reaches the producer's own CancelToken directly, the same one a
                    // data-plane CANCEL frame would reach — the two mechanisms converge.
                    cancel.cancel();
                    *cancelled = true;
                    CancelOutcome::Requested
                }
            }
        }
    }

    /// Cancel every ticket — pending or redeemed — for one dataset. Returns how many were.
    pub fn cancel_all_for_dataset(&self, dataset: &str) -> u32 {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        Self::sweep_locked(&mut tickets);
        let mut n = 0u32;
        for state in tickets.values_mut() {
            match state {
                TicketState::Pending { dataset: d, .. } if d == dataset => {
                    *state = TicketState::CancelledBeforeRedeem;
                    n += 1;
                }
                TicketState::Redeemed { dataset: d, cancel, cancelled } if d == dataset && !*cancelled => {
                    cancel.cancel();
                    *cancelled = true;
                    n += 1;
                }
                _ => {}
            }
        }
        n
    }

}

/// Names an in-flight `open_dataset` call so `cancel(cancel_key)` can reach it before it returns a
/// handle. Separate from [`StreamRegistry`]: a different handle kind (client-minted, SKP-V0.md §3),
/// a different underlying cancel primitive (`engine::CancelToken` directly, not the data plane's
/// type-erased `SourceCancel`), and a different lifetime (dies the instant `open_dataset` returns).
#[derive(Default)]
struct OpenRegistry {
    inflight: Mutex<HashMap<String, CancelToken>>,
}

impl OpenRegistry {
    fn begin(&self, key: &str, token: CancelToken) -> Result<(), SkpError> {
        let mut m = self.inflight.lock().unwrap_or_else(|e| e.into_inner());
        if m.contains_key(key) {
            return Err(SkpError::cancel_key_in_use(key));
        }
        m.insert(key.to_string(), token);
        Ok(())
    }

    fn end(&self, key: &str) {
        self.inflight.lock().unwrap_or_else(|e| e.into_inner()).remove(key);
    }

    fn cancel(&self, key: &str) -> CancelOutcome {
        let m = self.inflight.lock().unwrap_or_else(|e| e.into_inner());
        match m.get(key) {
            None => CancelOutcome::Unknown,
            Some(token) => {
                let was_cancelled = token.is_cancelled();
                token.cancel();
                if was_cancelled { CancelOutcome::AlreadyTerminal } else { CancelOutcome::Requested }
            }
        }
    }
}

/// The composition SKP v0 needs: a shared catalog, a shared ticket registry, and an open-call
/// registry local to this host. One `SkpHost` per running shell process.
pub struct SkpHost {
    catalog: Arc<Catalog>,
    tickets: Arc<StreamRegistry>,
    opens: OpenRegistry,
    connection_reports: Option<std::sync::mpsc::Sender<StreamConnectionRecord>>,
}

impl SkpHost {
    pub fn new(catalog: Arc<Catalog>, tickets: Arc<StreamRegistry>) -> Self {
        Self { catalog, tickets, opens: OpenRegistry::default(), connection_reports: None }
    }

    /// The catalog this host mutates. `frontends/shell/src-tauri`'s app setup gives the identical
    /// `Arc` to the data-plane's raw-params tests, if any run in-process; the running shell itself
    /// only ever installs `EngineSourceFactory::ticket_only`.
    pub fn catalog(&self) -> Arc<Catalog> {
        self.catalog.clone()
    }

    /// The ticket registry this host mints into. `EngineSourceFactory::ticket_only` needs the
    /// identical `Arc` to redeem what this mints.
    pub fn tickets(&self) -> Arc<StreamRegistry> {
        self.tickets.clone()
    }

    pub fn open_dataset(&self, req: OpenDatasetRequest) -> Result<OpenDatasetResponse, SkpError> {
        check_version(&req.skp)?;
        let cancel_key = CancelKey::try_from(req.cancel_key.clone())
            .map_err(|e| SkpError::protocol("malformed_cancel_key", e))?;
        let cancel = CancelToken::new();
        self.opens.begin(cancel_key.as_str(), cancel.clone())?;
        let handle = DatasetHandle::mint();
        // The handle IS the catalog name — never user-controlled text (`kernel/src/lib.rs`'s own
        // "names, never paths" rule, one level up: now also "names, never chosen by the caller").
        let outcome = self.catalog.open_cancellable(handle.as_str(), &req.path, None, &cancel);
        self.opens.end(cancel_key.as_str());
        outcome.map_err(|e| error_of(&e))?;
        Ok(OpenDatasetResponse { dataset: handle })
    }

    pub fn describe(&self, req: DescribeRequest) -> Result<DescribeResponse, SkpError> {
        check_version(&req.skp)?;
        let ds = self
            .catalog
            .get(req.dataset.as_str())
            .ok_or_else(|| SkpError::unknown_dataset(req.dataset.as_str()))?;
        Ok(describe_dataset(&ds))
    }

    pub fn viewport_query(
        &self,
        req: ViewportQueryRequest,
    ) -> Result<ViewportQueryResponse, SkpError> {
        check_version(&req.skp)?;
        let dataset_name = req.dataset.as_str().to_string();
        let ds = self
            .catalog
            .get(&dataset_name)
            .ok_or_else(|| SkpError::unknown_dataset(&dataset_name))?;
        let query = build_viewport_query(&ds, &req);
        // Validated **before** any handle is minted (SKP-V0.md §1): `ViewportCrsMismatch`,
        // `ViewportCrsUnidentifiable` and `NoCoveringBbox` return here, synchronously, with their
        // full typed text — never as a data-plane terminal frame arriving after a round trip.
        let (stream, cancel) = open_engine_stream(&ds, &query).map_err(|e| error_of(&e))?;
        let (source, source_cancel) = wrap_for_data_plane(
            stream,
            cancel,
            dataset_name.clone(),
            ds.connections().config().reuses_connections(),
            self.connection_reports.clone(),
        );
        let handle = self.tickets.mint(&dataset_name, source, source_cancel)?;
        Ok(ViewportQueryResponse { stream: handle, expires_in_ms: TICKET_TTL.as_millis() as u32 })
    }

    pub fn cancel(&self, req: CancelRequest) -> Result<CancelResponse, SkpError> {
        check_version(&req.skp)?;
        // Disambiguated by the host on the handle's own shape (SKP-V0.md §1): a well-formed
        // `sh_...` stream handle is looked up in the ticket registry; anything else is treated as a
        // client-minted cancel key naming an in-flight `open_dataset`.
        let outcome = match req.handle.parse::<StreamHandle>() {
            Ok(h) => self.tickets.cancel(h.as_str()),
            Err(_) => self.opens.cancel(&req.handle),
        };
        Ok(CancelResponse { state: outcome.as_str().to_string() })
    }

    pub fn close_dataset(
        &self,
        req: CloseDatasetRequest,
    ) -> Result<CloseDatasetResponse, SkpError> {
        check_version(&req.skp)?;
        let name = req.dataset.as_str();
        if self.catalog.get(name).is_none() {
            return Err(SkpError::unknown_dataset(name));
        }
        // Invalidate/cancel every ticket first, then remove the name — never the other order,
        // which would let a `viewport_query` racing this call mint a ticket against a name already
        // gone from the catalog.
        let cancelled_streams = self.tickets.cancel_all_for_dataset(name);
        self.catalog.remove(name);
        Ok(CloseDatasetResponse { cancelled_streams })
    }
}

fn check_version(skp: &str) -> Result<(), SkpError> {
    if skp != SKP_VERSION {
        return Err(SkpError::version_unsupported(skp));
    }
    Ok(())
}

fn build_viewport_query(ds: &Dataset, req: &ViewportQueryRequest) -> ViewportQuery {
    let query = match &req.bbox {
        Some(b) => {
            let bbox =
                spatial_engine::Bbox { xmin: b.xmin.0, ymin: b.ymin.0, xmax: b.xmax.0, ymax: b.ymax.0 };
            // `bbox_crs: null` declares "in the dataset's own CRS" (ADR-015 §7; SKP-V0.md §1) — it
            // is a declaration, not an inference from silence.
            let crs = req.bbox_crs.clone().unwrap_or_else(|| ds.crs().identifier().to_string());
            ViewportQuery::viewport(bbox, crs)
        }
        None => ViewportQuery::all(),
    };
    match &req.limit {
        Some(n) => query.with_limit(n.0),
        None => query,
    }
}

fn describe_dataset(ds: &Dataset) -> DescribeResponse {
    let crs = ds.crs();
    let identity = ds.identity();
    let license = ds.source_license();

    // **C2** (SKP-V0.md §2): never a bare integer. `verified_rows()` is `Some` only under
    // `VerifiedAtOpenFullFile`; `None` is the honest answer under `DeclaredNotVerified`.
    let row_count = match identity.verified_rows() {
        Some(rows) => {
            RowCount { basis: "identity-uniqueness-scan-full-file".to_string(), value: Some(DecU64(rows)) }
        }
        None => RowCount { basis: "not-established".to_string(), value: None },
    };

    DescribeResponse {
        source: SourceInfo {
            path_display: ds.path().display().to_string(),
            geoparquet_version: ds.geoparquet_version().to_string(),
        },
        crs: CrsInfo {
            identifier: crs.identifier().to_string(),
            definition_json: crs.definition_json().map(str::to_string),
            source: crs.source().as_str().to_string(),
            asserted_by: crs.asserted_by().map(str::to_string),
            asserted_at: crs.asserted_at().map(str::to_string),
            axis_order: crs.axis_order().as_str().to_string(),
            axis_normalization: "none-performed".to_string(),
        },
        geometry: GeometryInfo {
            column: ds.geometry_column().to_string(),
            encoding: "geoarrow.polygon".to_string(),
            coordinate_layout: "interleaved-xy".to_string(),
            frame: "authoritative-project-crs".to_string(),
        },
        identity: IdentityInfo {
            source: identity.source().as_envelope_value(),
            uniqueness: identity.uniqueness().as_str().to_string(),
            verified_rows: identity.verified_rows().map(DecU64),
            max_value: identity.max_value().map(DecU64),
            js_exact: identity.js_exact(),
        },
        schema: ds
            .file_schema()
            .fields()
            .iter()
            .map(|f| FieldInfo {
                name: f.name().clone(),
                arrow_type: f.data_type().to_string(),
                nullable: f.is_nullable(),
            })
            .collect(),
        covering_bbox: ds.covering().is_some(),
        row_count,
        // **C1** (SKP-V0.md §2): no `Dataset::bounds()` accessor exists on the engine; `describe`
        // never claims a dataset extent it cannot establish without a second query.
        extent: Extent { basis: "not-established-at-open".to_string(), value: None },
        license: LicenseInfo {
            license: license.license.clone(),
            attribution: license.attribution.clone(),
            redistribution: license.redistribution.clone(),
            declares_anything: license.declares_anything(),
        },
    }
}

/// Maps every `EngineError` variant to an SKP error code, verbatim message, and named fields
/// (SKP-V0.md §5). **No wildcard arm** — a new `EngineError` variant fails this build until it is
/// mapped here, which is what keeps a typed refusal from silently degrading into "failed".
pub fn error_of(e: &EngineError) -> SkpError {
    let message = e.to_string();
    let (name, fields): (&str, Vec<(&'static str, String)>) = match e {
        EngineError::Source(_) => ("source", vec![]),
        EngineError::CrsUndeclared { detail } => ("crs_undeclared", vec![("detail", detail.clone())]),
        EngineError::CrsAssertionConflict { declared, asserted } => (
            "crs_assertion_conflict",
            vec![("declared", declared.clone()), ("asserted", asserted.clone())],
        ),
        EngineError::ViewportCrsMismatch { dataset, viewport } => (
            "viewport_crs_mismatch",
            vec![("dataset", dataset.clone()), ("viewport", viewport.clone())],
        ),
        EngineError::ViewportCrsUnidentifiable => ("viewport_crs_unidentifiable", vec![]),
        EngineError::AxisOrderUnestablished { detail } => {
            ("axis_order_unestablished", vec![("detail", detail.clone())])
        }
        EngineError::AxisOrderUnsupported { established } => {
            ("axis_order_unsupported", vec![("established", established.clone())])
        }
        EngineError::GeoMetadata(_) => ("geo_metadata", vec![]),
        EngineError::NoCoveringBbox { detail } => {
            ("no_covering_bbox", vec![("detail", detail.clone())])
        }
        EngineError::Wkb(_) => ("wkb", vec![]),
        EngineError::EncodingMismatch { claimed, found } => (
            "encoding_mismatch",
            vec![("claimed", claimed.clone()), ("found", found.clone())],
        ),
        EngineError::Query(_) => ("query", vec![]),
        EngineError::Arrow(_) => ("arrow", vec![]),
        EngineError::Cancelled => ("cancelled", vec![]),
        EngineError::CeilingExceeded { ceiling, limit, saw } => (
            "ceiling_exceeded",
            vec![("ceiling", ceiling.to_string()), ("limit", limit.to_string()), ("saw", saw.to_string())],
        ),
        EngineError::IdentityUnusable { column, detail } => {
            ("identity_unusable", vec![("column", column.clone()), ("detail", detail.clone())])
        }
        EngineError::FeatureTooLarge { id, limit, saw } => (
            "feature_too_large",
            vec![("id", id.to_string()), ("limit", limit.to_string()), ("saw", saw.to_string())],
        ),
        EngineError::ConnectionSetup { detail } => {
            ("connection_setup", vec![("detail", detail.clone())])
        }
        EngineError::AttributeUnpublishable { column, detail } => (
            "attribute_unpublishable",
            vec![("column", column.clone()), ("detail", detail.clone())],
        ),
        EngineError::SourceChangedUnderPublish { pinned, observed, detected_by } => (
            "source_changed_under_publish",
            vec![
                ("pinned", pinned.clone()),
                ("observed", observed.clone()),
                ("detected_by", detected_by.to_string()),
            ],
        ),
        EngineError::ConnectionsExhausted { class, capacity } => (
            "connections_exhausted",
            vec![("class", class.to_string()), ("capacity", capacity.to_string())],
        ),
        EngineError::TimingDependentOrdering { ordering, cut } => (
            "timing_dependent_ordering",
            vec![("ordering", ordering.to_string()), ("cut", cut.to_string())],
        ),
    };
    SkpError {
        code: format!("engine.{name}"),
        message,
        fields: fields.into_iter().map(|(k, v)| (k.to_string(), v)).collect(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn synthetic_source() -> (Box<dyn BatchSource>, Arc<dyn SourceCancel>) {
        struct Empty;
        impl BatchSource for Empty {
            fn next_into(
                &mut self,
                _out: &mut Vec<u8>,
            ) -> Option<Result<spatial_data_plane::transport::BatchMeta, String>> {
                None
            }
        }
        struct NoopCancel(std::sync::atomic::AtomicBool);
        impl SourceCancel for NoopCancel {
            fn cancel(&self) {
                self.0.store(true, std::sync::atomic::Ordering::SeqCst);
            }
        }
        (Box::new(Empty), Arc::new(NoopCancel(std::sync::atomic::AtomicBool::new(false))))
    }

    #[test]
    fn a_ticket_redeems_exactly_once() {
        let reg = StreamRegistry::default();
        let (s, c) = synthetic_source();
        let handle = reg.mint("d", s, c).unwrap();
        assert!(reg.redeem(handle.as_str()).is_ok());
        assert!(reg.redeem(handle.as_str()).is_err(), "a second redemption must be refused");
    }

    #[test]
    fn cancelling_before_redemption_refuses_the_later_redemption() {
        let reg = StreamRegistry::default();
        let (s, c) = synthetic_source();
        let handle = reg.mint("d", s, c).unwrap();
        assert!(matches!(reg.cancel(handle.as_str()), CancelOutcome::Requested));
        assert!(reg.redeem(handle.as_str()).is_err());
    }

    #[test]
    fn cancel_on_an_unknown_handle_is_unknown_not_an_error() {
        let reg = StreamRegistry::default();
        assert!(matches!(reg.cancel("sh_00000000000000000000000000000000"), CancelOutcome::Unknown));
    }

    #[test]
    fn cancelling_a_redeemed_ticket_twice_is_already_terminal_the_second_time() {
        let reg = StreamRegistry::default();
        let (s, c) = synthetic_source();
        let handle = reg.mint("d", s, c).unwrap();
        reg.redeem(handle.as_str()).unwrap();
        assert!(matches!(reg.cancel(handle.as_str()), CancelOutcome::Requested));
        assert!(matches!(reg.cancel(handle.as_str()), CancelOutcome::AlreadyTerminal));
    }

    #[test]
    fn the_pending_ceiling_is_per_dataset_and_declared() {
        let reg = StreamRegistry::default();
        for _ in 0..MAX_PENDING_TICKETS {
            let (s, c) = synthetic_source();
            reg.mint("d", s, c).unwrap();
        }
        let (s, c) = synthetic_source();
        let err = reg.mint("d", s, c).unwrap_err();
        assert_eq!(err.code, "skp.too_many_pending_streams");
        // A different dataset is not affected by another dataset's pending count.
        let (s, c) = synthetic_source();
        assert!(reg.mint("other", s, c).is_ok());
    }

    #[test]
    fn close_dataset_cancels_every_ticket_for_that_dataset_only() {
        let reg = StreamRegistry::default();
        let (s1, c1) = synthetic_source();
        let pending = reg.mint("d", s1, c1).unwrap();
        let (s2, c2) = synthetic_source();
        let redeemed = reg.mint("d", s2, c2).unwrap();
        reg.redeem(redeemed.as_str()).unwrap();
        let (s3, c3) = synthetic_source();
        let other = reg.mint("other", s3, c3).unwrap();

        assert_eq!(reg.cancel_all_for_dataset("d"), 2);
        assert!(reg.redeem(pending.as_str()).is_err());
        assert!(matches!(reg.cancel(redeemed.as_str()), CancelOutcome::AlreadyTerminal));
        // Untouched: a different dataset's ticket was not cancelled.
        assert!(reg.redeem(other.as_str()).is_ok());
    }

    #[test]
    fn version_mismatch_is_refused_before_anything_else() {
        assert!(check_version("skp/0").is_ok());
        let e = check_version("skp/9").unwrap_err();
        assert_eq!(e.code, "skp.version_unsupported");
    }

    #[test]
    fn every_engine_error_variant_maps_to_a_distinct_engine_dot_code() {
        // A compile-time property (`error_of`'s match has no wildcard) exercised at runtime for one
        // representative of each family, so a reviewer sees the mapping rather than trusting it.
        let e = error_of(&EngineError::CrsUndeclared { detail: "d".into() });
        assert_eq!(e.code, "engine.crs_undeclared");
        assert_eq!(e.fields.get("detail").map(String::as_str), Some("d"));

        let e = error_of(&EngineError::Cancelled);
        assert_eq!(e.code, "engine.cancelled");
        assert!(e.fields.is_empty());

        let e = error_of(&EngineError::CeilingExceeded { ceiling: "c", limit: 1, saw: 2 });
        assert_eq!(e.code, "engine.ceiling_exceeded");
        assert_eq!(e.fields.get("limit").map(String::as_str), Some("1"));
    }
}
