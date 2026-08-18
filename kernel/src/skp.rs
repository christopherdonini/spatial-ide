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
use spatial_engine::{AdmittedPredicate, CancelToken, Dataset, EngineError, FilterError, ViewportQuery};
use spatial_skp::v0::{
    CancelKey, CancelRequest, CancelResponse, CloseDatasetRequest, CloseDatasetResponse, CrsInfo,
    DatasetHandle, DecU64, DescribeRequest, DescribeResponse, Extent, FieldInfo, GeometryInfo,
    IdentityInfo, LicenseInfo, OpenDatasetRequest, OpenDatasetResponse, RowCount, SkpError,
    SourceInfo, StreamHandle, ViewportQueryRequest, ViewportQueryResponse, SKP_VERSION,
};

use crate::{open_engine_stream, wrap_for_data_plane, Catalog};

/// ADR-019: an unredeemed ticket is swept and its slot freed.
pub const TICKET_TTL: Duration = Duration::from_secs(30);
/// ADR-019, ADR-010 rule 6 (declared, not discovered): `viewport_query` mints tickets at gesture
/// rate under supersede-on-pan, and an unbounded pending set per dataset is exactly the failure a
/// declared ceiling exists to name in advance.
///
/// **Not the ceiling reached first in practice.** Every `Pending` ticket already holds a leased
/// `engine::pool::Class::Stream` connection (`SkpHost::viewport_query` builds the engine stream
/// *before* minting), and that pool's own `MAX_STREAM_CONNECTIONS` is 4 — so a dataset's fifth
/// concurrent pending ticket fails at the connection lease with `engine.connections_exhausted`
/// long before this constant's count is ever checked. This ceiling stays as the declared backstop
/// for whichever pool sizing ends up binding, per ADR-010 rule 6's "declared, not discovered" —
/// it is not dead, just usually not the one that fires (reviewer finding B5, this cut).
pub const MAX_PENDING_TICKETS: usize = 8;
/// B4 (reviewer, this cut): neither `Redeemed` nor `CancelledBeforeRedeem` has any other event that
/// ever removes its entry — unlike `Pending`, which the stream itself either redeems or lets expire
/// against [`TICKET_TTL`]. Left unbounded, `StreamRegistry`'s map would grow for the whole life of
/// the process. Evicting an entry this old trades away `cancel()`'s ability to reach an
/// exceptionally long-running *redeemed* stream after this window (it would report `unknown`
/// instead of forwarding the cancellation, the same as an always-unknown handle) for bounded
/// memory — accepted because docs/08's target datasets stream in well under five minutes, and an
/// abandoned client's own transport disconnect is what the data plane's own cleanup is for, not
/// this registry.
pub const TERMINAL_ENTRY_MAX_AGE: Duration = Duration::from_secs(300);

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
    /// to ask. `redeemed_at` bounds this entry's own lifetime in the map (`TERMINAL_ENTRY_MAX_AGE`)
    /// — it is not a signal that the underlying stream has finished.
    Redeemed { dataset: String, cancel: Arc<dyn SourceCancel>, cancelled: bool, redeemed_at: Instant },
    /// Was `Pending`, cancelled before a redemption ever arrived. A later redemption is refused —
    /// this is the whole of what closes the cancel-then-redeem race ADR-019 names.
    CancelledBeforeRedeem { cancelled_at: Instant },
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
            TicketState::Redeemed { redeemed_at, .. } => redeemed_at.elapsed() <= TERMINAL_ENTRY_MAX_AGE,
            TicketState::CancelledBeforeRedeem { cancelled_at } => {
                cancelled_at.elapsed() <= TERMINAL_ENTRY_MAX_AGE
            }
        });
    }

    /// Reclaim stale entries — a `Pending` ticket's leased connection among them — without waiting
    /// for `mint`/`redeem`/`cancel`/`cancel_all_for_dataset` to do it as an incidental side effect.
    ///
    /// **B5 (reviewer, this cut).** Every one of those four methods sweeps only *after* acquiring
    /// this registry's own lock, which is fine when reaching them costs nothing scarce — but
    /// `SkpHost::viewport_query` leases an `engine::pool::Class::Stream` connection *before* it
    /// ever calls `mint`, so once enough expired `Pending` tickets have exhausted that pool, a new
    /// `viewport_query` fails at the lease and never reaches a method that would have swept them.
    /// Without an entry point reachable *before* the lease, that lockout would be permanent rather
    /// than bounded by `TICKET_TTL`. Called at the top of `viewport_query`, before it leases.
    pub fn sweep_expired(&self) {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        Self::sweep_locked(&mut tickets);
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
            Some(TicketState::CancelledBeforeRedeem { .. }) => {
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
            TicketState::Redeemed {
                dataset,
                cancel: built.cancel.clone(),
                cancelled: false,
                redeemed_at: Instant::now(),
            },
        );
        Ok((built.source, built.cancel))
    }

    /// Cancel one ticket by its [`StreamHandle`] string.
    pub fn cancel(&self, handle: &str) -> CancelOutcome {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        Self::sweep_locked(&mut tickets);
        match tickets.get_mut(handle) {
            None => CancelOutcome::Unknown,
            Some(TicketState::CancelledBeforeRedeem { .. }) => CancelOutcome::AlreadyTerminal,
            Some(state @ TicketState::Pending { .. }) => {
                *state = TicketState::CancelledBeforeRedeem { cancelled_at: Instant::now() };
                CancelOutcome::Requested
            }
            Some(TicketState::Redeemed { cancel, cancelled, .. }) => {
                if *cancelled {
                    CancelOutcome::AlreadyTerminal
                } else {
                    // ADR-019's Consequences: reaches the producer's own CancelToken directly, the
                    // same one a data-plane CANCEL frame would reach — the two mechanisms converge.
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
                    *state = TicketState::CancelledBeforeRedeem { cancelled_at: Instant::now() };
                    n += 1;
                }
                TicketState::Redeemed { dataset: d, cancel, cancelled, .. } if d == dataset && !*cancelled => {
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

/// RAII counterpart to [`OpenRegistry::end`] — S5 (reviewer, this cut). `begin`/`end` alone rely on
/// the caller reaching the matching `end` on every path out of the function, panics included; this
/// makes "every path" true by construction instead of by discipline.
struct OpenGuard<'a> {
    opens: &'a OpenRegistry,
    key: String,
}

impl Drop for OpenGuard<'_> {
    fn drop(&mut self) {
        self.opens.end(&self.key);
    }
}

/// The composition SKP v0 needs: a shared catalog, a shared ticket registry, and an open-call
/// registry local to this host. One `SkpHost` per running shell process.
pub struct SkpHost {
    catalog: Arc<Catalog>,
    tickets: Arc<StreamRegistry>,
    opens: OpenRegistry,
}

impl SkpHost {
    pub fn new(catalog: Arc<Catalog>, tickets: Arc<StreamRegistry>) -> Self {
        Self { catalog, tickets, opens: OpenRegistry::default() }
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
        // S5 (reviewer, this cut): a guard, not a bare `self.opens.end(...)` after the call below —
        // `open_cancellable` runs arbitrary engine/DuckDB code, and an unwind out of it must still
        // free this cancel key. Without this, a panic here would leave `cancel_key` permanently
        // `cancel_key_in_use` for the rest of the process's life, since nothing else ever removes it.
        let _end_open_on_drop = OpenGuard { opens: &self.opens, key: cancel_key.as_str().to_string() };
        let handle = DatasetHandle::mint();
        // The handle IS the catalog name — never user-controlled text (`kernel/src/lib.rs`'s own
        // "names, never paths" rule, one level up: now also "names, never chosen by the caller").
        let outcome = self.catalog.open_cancellable(handle.as_str(), &req.path, None, &cancel);
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
        // B5 (reviewer, this cut): reclaim stale pending tickets' leased connections *before*
        // attempting to lease another. `open_engine_stream` below leases from a pool bounded by
        // `MAX_STREAM_CONNECTIONS`, and that lease can fail before this call ever reaches
        // `tickets.mint`'s own sweep — the only other place a `Pending` ticket's expiry is noticed.
        // See `MAX_PENDING_TICKETS`'s doc comment for why that pool, not this registry's declared
        // ceiling, is the one that binds in practice.
        self.tickets.sweep_expired();
        let dataset_name = req.dataset.as_str().to_string();
        let ds = self
            .catalog
            .get(&dataset_name)
            .ok_or_else(|| SkpError::unknown_dataset(&dataset_name))?;
        // Filter admission (`NEXT-CUT.md` P4; `AdmittedPredicate::admit`, `engine/src/predicate.rs`
        // P3) runs *inside* `build_viewport_query`, right here — after `ds` is resolved (admission
        // needs the dataset's own resident schema, an ADR-016-style structural precondition: no
        // extra IO beyond DuckDB's own parse/bind against what is already open) but strictly
        // *before* `open_engine_stream` below ever leases a `Class::Stream` connection and *before*
        // `self.tickets.mint` ever runs. A refused predicate returns here, synchronously, as one of
        // the eleven typed `skp.filter_*` codes (`filter_error_of`) — never as a data-plane terminal
        // frame arriving after a round trip, and never after a ticket a client would have to redeem
        // just to learn it was refused (SKP-V0 §1, ADR-019 §1).
        let query = build_viewport_query(&ds, &req).map_err(|e| filter_error_of(&e))?;
        // Validated **before** any handle is minted (SKP-V0.md §1): `ViewportCrsMismatch`,
        // `ViewportCrsUnidentifiable` and `NoCoveringBbox` return here, synchronously, with their
        // full typed text — never as a data-plane terminal frame arriving after a round trip.
        let (stream, cancel) = open_engine_stream(&ds, &query).map_err(|e| error_of(&e))?;
        // `None`: `frontends/shell` has no consumer for `StreamConnectionRecord` telemetry yet
        // (unlike `kernel::main`'s own product binary, which does via `with_connection_reports`) —
        // no half-built reporting path here waiting for a caller that doesn't exist (S7, reviewer,
        // this cut: this used to be a field that could only ever be constructed as `None`).
        let (source, source_cancel) = wrap_for_data_plane(
            stream,
            cancel,
            dataset_name.clone(),
            ds.connections().config().reuses_connections(),
            None,
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

fn build_viewport_query(
    ds: &Dataset,
    req: &ViewportQueryRequest,
) -> Result<ViewportQuery, FilterError> {
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
    let query = match &req.limit {
        Some(n) => query.with_limit(n.0),
        None => query,
    };
    match &req.filter {
        // **Real admission, not a pass-through.** `Filter::new` (`protocol/skp`) only ever checked
        // the wire dialect is `duckdb-expr/0`; `AdmittedPredicate::admit` (`engine/src/predicate.rs`,
        // P3) is what actually parses the predicate's grammar (structural admission), resolves every
        // column against `ds`'s resident schema (namespace admission), and asks DuckDB's own binder
        // whether it evaluates to `BOOLEAN` (bind admission) — all three stages, in that order, each
        // gating the next. `?` here is what makes this function, and so `viewport_query` above,
        // refuse synchronously and typed the moment any stage refuses.
        Some(f) => Ok(query.with_filter(AdmittedPredicate::admit(f.predicate.clone(), ds)?)),
        None => Ok(query),
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
        EngineError::IdentityUnusable { column, detail, candidate_columns } => (
            "identity_unusable",
            vec![
                ("column", column.clone()),
                ("detail", detail.clone()),
                // `SkpError::fields` is `BTreeMap<String, String>` (SKP-V0.md §5) — no list shape
                // on the wire, so the schema-ordered, unranked candidate list is comma-joined into
                // one string field. Empty when the file carries no 64-bit integer column at all.
                ("candidate_columns", candidate_columns.join(",")),
            ],
        ),
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

/// Maps every `FilterError` variant (`engine::predicate`, P3's admission) to its declared
/// `skp.filter_*` wire code and named fields — `NEXT-CUT.md` design essential 5's taxonomy,
/// field for field. **No wildcard arm**: a twelfth `FilterError` variant fails this build until it
/// is mapped here, the same discipline [`error_of`] applies to `EngineError` above. `message` is
/// `FilterError`'s own `Display` output, unedited, exactly [`error_of`]'s own convention.
pub fn filter_error_of(e: &FilterError) -> SkpError {
    let message = e.to_string();
    match e {
        FilterError::DialectUnsupported { declared } => SkpError::protocol_with_fields(
            "filter_dialect_unsupported",
            message,
            [("declared", declared.clone())],
        ),
        FilterError::Unparsable { detail } => {
            SkpError::protocol_with_fields("filter_unparsable", message, [("detail", detail.clone())])
        }
        FilterError::NotASingleExpression { statements } => SkpError::protocol_with_fields(
            "filter_not_a_single_expression",
            message,
            [("statements", statements.to_string())],
        ),
        FilterError::ConstructNotAdmitted { construct } => SkpError::protocol_with_fields(
            "filter_construct_not_admitted",
            message,
            [("construct", construct.clone())],
        ),
        FilterError::UnknownColumn { column } => SkpError::protocol_with_fields(
            "filter_unknown_column",
            message,
            [("column", column.clone())],
        ),
        FilterError::ColumnNotFilterable { column, reason } => SkpError::protocol_with_fields(
            "filter_column_not_filterable",
            message,
            [("column", column.clone()), ("reason", reason.clone())],
        ),
        FilterError::IdentityAliasAmbiguous { column, source_column } => SkpError::protocol_with_fields(
            "filter_identity_alias_ambiguous",
            message,
            [("column", column.clone()), ("source_column", source_column.clone())],
        ),
        FilterError::NotBoolean { inferred_type } => SkpError::protocol_with_fields(
            "filter_not_boolean",
            message,
            [("inferred_type", inferred_type.clone())],
        ),
        FilterError::TooLong { limit, saw } => SkpError::protocol_with_fields(
            "filter_too_long",
            message,
            [("limit", limit.to_string()), ("saw", saw.to_string())],
        ),
        FilterError::TooDeep { limit, saw } => SkpError::protocol_with_fields(
            "filter_too_deep",
            message,
            [("limit", limit.to_string()), ("saw", saw.to_string())],
        ),
        FilterError::RejectedByBinder { detail } => SkpError::protocol_with_fields(
            "filter_rejected_by_binder",
            message,
            [("detail", detail.clone())],
        ),
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

    /// B5: without `sweep_expired`, an expired `Pending` ticket sits in the map — and holds
    /// whatever it leased — until some *other* registry method happens to run and sweep it as a
    /// side effect. `SkpHost::viewport_query` cannot rely on that: it leases a connection before
    /// calling any of them. This exercises the reclaim directly, without a real 30-second wait —
    /// `minted_at` is backdated past `TICKET_TTL` under the same lock a real sweep would use.
    #[test]
    fn sweep_expired_reclaims_a_stale_pending_ticket_without_any_other_call() {
        let reg = StreamRegistry::default();
        let (s, c) = synthetic_source();
        let handle = reg.mint("d", s, c).unwrap();
        {
            let mut tickets = reg.tickets.lock().unwrap();
            match tickets.get_mut(handle.as_str()) {
                Some(TicketState::Pending { minted_at, .. }) => {
                    *minted_at = Instant::now() - TICKET_TTL - Duration::from_secs(1);
                }
                other => panic!("expected a fresh Pending ticket, found_entry={}", other.is_some()),
            }
        }
        reg.sweep_expired();
        assert!(
            reg.redeem(handle.as_str()).is_err(),
            "an expired pending ticket must already be gone, not merely redeemable-but-stale"
        );
    }

    /// B4: a terminal (`CancelledBeforeRedeem`) entry has no event that ever removes it other than
    /// aging out — this exercises that path directly the same way the sibling test above exercises
    /// `Pending` expiry, again without a real five-minute wait.
    #[test]
    fn sweep_expired_reclaims_an_old_cancelled_before_redeem_entry() {
        let reg = StreamRegistry::default();
        let (s, c) = synthetic_source();
        let handle = reg.mint("d", s, c).unwrap();
        assert!(matches!(reg.cancel(handle.as_str()), CancelOutcome::Requested));
        {
            let mut tickets = reg.tickets.lock().unwrap();
            match tickets.get_mut(handle.as_str()) {
                Some(TicketState::CancelledBeforeRedeem { cancelled_at }) => {
                    *cancelled_at = Instant::now() - TERMINAL_ENTRY_MAX_AGE - Duration::from_secs(1);
                }
                other => panic!("expected CancelledBeforeRedeem, found_entry={}", other.is_some()),
            }
        }
        reg.sweep_expired();
        // Gone from the map entirely: a fresh cancel on the same handle now reports `Unknown`, not
        // `AlreadyTerminal` -- the two are observably different outcomes over SKP's own wire shape.
        assert!(matches!(reg.cancel(handle.as_str()), CancelOutcome::Unknown));
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
        assert!(check_version(SKP_VERSION).is_ok());
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

    // ---- `filter_error_of` — one test per `skp.filter_*` code (`NEXT-CUT.md` design essential 5,
    // brief evidence item B) ------------------------------------------------------------------
    //
    // `filter_error_of`'s match has no wildcard arm (a compile-time exhaustiveness property, same
    // discipline `error_of` uses above), and unlike `every_engine_error_variant_maps_to_a_distinct_
    // engine_dot_code`'s three-of-twenty sample, every one of `FilterError`'s eleven variants gets
    // its own test below — code AND every field key asserted, never a bare `is_err`.

    #[test]
    fn filter_dialect_unsupported_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::DialectUnsupported { declared: "sql/legacy".into() });
        assert_eq!(e.code, "skp.filter_dialect_unsupported");
        assert_eq!(e.fields.get("declared").map(String::as_str), Some("sql/legacy"));
    }

    #[test]
    fn filter_unparsable_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::Unparsable { detail: "syntax error".into() });
        assert_eq!(e.code, "skp.filter_unparsable");
        assert_eq!(e.fields.get("detail").map(String::as_str), Some("syntax error"));
    }

    #[test]
    fn filter_not_a_single_expression_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::NotASingleExpression { statements: 2 });
        assert_eq!(e.code, "skp.filter_not_a_single_expression");
        assert_eq!(e.fields.get("statements").map(String::as_str), Some("2"));
    }

    #[test]
    fn filter_construct_not_admitted_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::ConstructNotAdmitted { construct: "a subquery".into() });
        assert_eq!(e.code, "skp.filter_construct_not_admitted");
        assert_eq!(e.fields.get("construct").map(String::as_str), Some("a subquery"));
    }

    #[test]
    fn filter_unknown_column_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::UnknownColumn { column: "zzz".into() });
        assert_eq!(e.code, "skp.filter_unknown_column");
        assert_eq!(e.fields.get("column").map(String::as_str), Some("zzz"));
    }

    #[test]
    fn filter_column_not_filterable_maps_to_its_code_and_fields() {
        let e = filter_error_of(&FilterError::ColumnNotFilterable {
            column: "geometry".into(),
            reason: "this is the geometry column".into(),
        });
        assert_eq!(e.code, "skp.filter_column_not_filterable");
        assert_eq!(e.fields.get("column").map(String::as_str), Some("geometry"));
        assert_eq!(e.fields.get("reason").map(String::as_str), Some("this is the geometry column"));
    }

    #[test]
    fn filter_identity_alias_ambiguous_maps_to_its_code_and_fields() {
        let e = filter_error_of(&FilterError::IdentityAliasAmbiguous {
            column: "id".into(),
            source_column: "parcel_key".into(),
        });
        assert_eq!(e.code, "skp.filter_identity_alias_ambiguous");
        assert_eq!(e.fields.get("column").map(String::as_str), Some("id"));
        assert_eq!(e.fields.get("source_column").map(String::as_str), Some("parcel_key"));
    }

    #[test]
    fn filter_not_boolean_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::NotBoolean { inferred_type: "BIGINT".into() });
        assert_eq!(e.code, "skp.filter_not_boolean");
        assert_eq!(e.fields.get("inferred_type").map(String::as_str), Some("BIGINT"));
    }

    #[test]
    fn filter_too_long_maps_to_its_code_and_fields() {
        let e = filter_error_of(&FilterError::TooLong { limit: 4096, saw: 5000 });
        assert_eq!(e.code, "skp.filter_too_long");
        assert_eq!(e.fields.get("limit").map(String::as_str), Some("4096"));
        assert_eq!(e.fields.get("saw").map(String::as_str), Some("5000"));
    }

    #[test]
    fn filter_too_deep_maps_to_its_code_and_fields() {
        let e = filter_error_of(&FilterError::TooDeep { limit: 32, saw: 40 });
        assert_eq!(e.code, "skp.filter_too_deep");
        assert_eq!(e.fields.get("limit").map(String::as_str), Some("32"));
        assert_eq!(e.fields.get("saw").map(String::as_str), Some("40"));
    }

    #[test]
    fn filter_rejected_by_binder_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::RejectedByBinder { detail: "binder refused".into() });
        assert_eq!(e.code, "skp.filter_rejected_by_binder");
        assert_eq!(e.fields.get("detail").map(String::as_str), Some("binder refused"));
    }
}
