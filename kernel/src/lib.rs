// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! # `kernel` — the composition root, and nothing more
//!
//! `docs/02` scopes the kernel to "orchestration, dataset registry, lineage DAG, permissions,
//! undo". This slice implements **orchestration for exactly one operation** and deliberately
//! implements none of the rest. It is the only place that knows both `engine/` and
//! `protocol/data-plane` — keeping that knowledge here is what lets each of those two crates stay
//! ignorant of the other (ADR-004's control/data-plane split is structural, per `docs/02`'s warning
//! about collapsing `protocol/` into `kernel/`).
//!
//! ## What is deliberately absent
//!
//! - **No lineage DAG, no undo, no command/event log — and the reason differs per operation, which the
//!   single sentence that used to sit here hid.** This crate now orchestrates **two** operations with
//!   **different ADR-006 classes**:
//!   - **Streaming a query** is a **pure transformation**: an input snapshot plus parameters produce a
//!     derived output, it writes nothing, so no transaction boundary and no undo machinery is owed.
//!   - **Publishing a bundle** is a **class-3 external side effect**: it writes files outside any
//!     transaction, in a location it does not own. It is **not undoable and is never described as
//!     undoable** — ADR-006 requires a declared reversibility class instead, and publish declares
//!     `irreversible` on its own API. Undo machinery is not "not owed" here; it is **impossible**, and
//!     those are different reasons for the same absence.
//!
//!   Calling both a pure transformation would put the wrong ADR-006 class on the one operation in this
//!   crate that actually has external effects.
//! - **Persistence arrived, and it is exactly the trigger this file named in advance.** The text
//!   here used to read: "Nothing is written. The moment this caches a result to disk, names datasets
//!   by URI, or emits a bundle, `docs/11`'s ResourceRef model and ADR-005's reproducibility grades
//!   are owed and this file is no longer honest." [`publish`] emits a bundle, so all three are now
//!   owed and all three are paid: the manifest carries **three** `docs/11` ResourceRefs (bundle,
//!   source, style) with every member named, datasets are addressed by a validated
//!   `spatial://dataset/<name>` logical URI, and each bundle claims an ADR-005 grade —
//!   **Snapshot**, with its basis stated and the reason Exact is not claimed written down beside it.
//!   Nothing else in this crate persists anything; a stream still writes nothing.
//! - **The approval gate exists now, and it is [`permission::boundary`].** ADR-006's class-3 row
//!   asks for three things and two were owed; [`permission`] supplies both — a scoped, expiring
//!   grant checked against execution-time facts, an explicit approval that names the destination,
//!   and a two-phase append-only redacted audit record. An unauditable class-3 operation does not
//!   run. **Nothing is exposed**: ADR-017's acceptance condition still forbids reaching publish
//!   through SKP, MCP, a plugin, a notebook or an AI surface until an exposure surface passes
//!   review, and this cut does not flip it.
//! - **It is still not `docs/09`'s permission model.** One operation kind, one principal kind, no
//!   authentication, no client, no extension surface, and grants that die with the process. What is
//!   built is a subset with the same shape; what is missing is named in
//!   `kernel/PERMISSION-BOUNDARY.md` rather than left for a reader to discover.
//! - **No dataset registry beyond a name → open dataset map** fixed at startup. Names, never paths:
//!   a client-supplied path on a listening socket is an arbitrary-file-read primitive.

use std::collections::HashMap;
use std::path::Path;
use std::sync::{Arc, RwLock};

use spatial_data_plane::transport::{
    BatchMeta, BatchSource, OpenRequest, SourceCancel, SourceFactory,
};
use spatial_engine::{
    BatchStream, CancelToken, CrsAssertion, Dataset, IdentityDeclaration, PoolConfig, ViewportQuery,
};

pub mod bundle;
pub mod params;
pub mod permission;
pub mod publish;
pub mod skp;

pub use params::{StreamParams, OPERATION};

/// What one finished stream ran on — an instrument record, emitted **after** the stream is over.
///
/// **The kernel is where this can be read at all**, because it is the only module that knows both
/// the engine and the binding. It is deliberately not part of `BatchMeta` or of any type in the
/// data-plane crate: that crate knows nothing about what a batch contains, and a storage-engine
/// detail crossing it would be the leakage its own boundary test gates. Nothing here reaches SKP or
/// the wire.
#[derive(Clone, Debug)]
pub struct StreamConnectionRecord {
    pub dataset: String,
    /// Whether this dataset was opened keeping connections between queries.
    pub dataset_reuses_connections: bool,
    pub physical_id: u64,
    pub lease_generation: u64,
    /// Whether this query received a connection that already existed and was already configured.
    pub reused_an_existing_connection: bool,
}

/// Datasets opened at startup, addressable by name — and, since `frontends/shell`, also opened and
/// closed **at runtime** through SKP's `open_dataset`/`close_dataset`.
///
/// **Interior mutability, deliberately.** `slice-host` and the test suite open every dataset once
/// before the data plane starts and never touch the catalog again, so `&mut self` cost them
/// nothing. The shell cannot do that: `EngineSourceFactory` holds an `Arc<Catalog>` clone that is
/// already streaming from datasets opened earlier in the same process, while the Tauri command
/// layer needs to add and remove entries in the *same* map as `open_dataset`/`close_dataset` calls
/// arrive. An `RwLock` is what lets both hold the identical `Arc<Catalog>` (architect review,
/// `frontends/shell` cut 1, D2.2).
pub struct Catalog {
    datasets: RwLock<HashMap<String, Arc<Dataset>>>,
    connections: PoolConfig,
}

impl Default for Catalog {
    fn default() -> Self {
        Self { datasets: RwLock::new(HashMap::new()), connections: PoolConfig::default() }
    }
}

impl Catalog {
    pub fn new() -> Self {
        Self::default()
    }

    /// A catalog whose datasets are opened with an explicit connection configuration.
    ///
    /// **The product default keeps connections; the alternative exists as a measurement control.**
    /// It is a capacity on the same code path, not a second implementation — see
    /// `spatial_engine::PoolConfig`.
    pub fn with_connections(connections: PoolConfig) -> Self {
        Self { datasets: RwLock::new(HashMap::new()), connections }
    }

    pub fn connections(&self) -> PoolConfig {
        self.connections
    }

    fn lock_write(&self) -> std::sync::RwLockWriteGuard<'_, HashMap<String, Arc<Dataset>>> {
        self.datasets.write().unwrap_or_else(|e| e.into_inner())
    }
    fn lock_read(&self) -> std::sync::RwLockReadGuard<'_, HashMap<String, Arc<Dataset>>> {
        self.datasets.read().unwrap_or_else(|e| e.into_inner())
    }

    /// Open a dataset and register it under `name`.
    ///
    /// Opening here means the CRS admission decision (ADR-015) happens **at open**, in front of
    /// whoever is watching, rather than on a consumer's first request. It is also where the
    /// dataset's first configured DuckDB connection is prepared, so the first query does not create
    /// one inside **S2** — the `query start → OPEN` segment `kernel/RESULTS.md` measured at p50
    /// 92.6 ms. **How much of S2 that creation accounts for is not known**: S2 also carries socket
    /// acquisition, the handshake, SQL construction and the configuration statement, and no
    /// measurement has yet divided it. Producing that division is what the reused-connection pass
    /// is for; nothing here claims its answer in advance.
    ///
    /// **Not cancellable.** Every product path that calls this today (`slice-host`, the test suite)
    /// opens its dataset before anything else can observe a cancel key. `open_cancellable` is the
    /// entry point SKP's `open_dataset` uses.
    pub fn open(
        &self,
        name: impl Into<String>,
        path: impl AsRef<Path>,
        assertion: Option<CrsAssertion>,
    ) -> spatial_engine::Result<()> {
        let ds = Dataset::open_with_connections(path, assertion, self.connections)?;
        self.lock_write().insert(name.into(), Arc::new(ds));
        Ok(())
    }

    /// As [`Self::open`], with a caller-held [`CancelToken`] bound throughout admission (SKP-V0.md
    /// §2, correction C3) — ADR-016's whole-column uniqueness scan is a multi-second, otherwise
    /// uninterruptible operation at `docs/07`'s 5 GB, and `docs/01` principle 7 is unqualified.
    ///
    /// `declared_identity` is P1's own admission-remediation parameter (`NEXT-CUT.md`): a caller
    /// declaration of which column carries feature identity, admitted through the identical
    /// `Dataset::open_cancellable` path `assertion` already used — CRS admission still runs first,
    /// identity second, exactly as `Dataset::open_inner` orders them (I11).
    pub fn open_cancellable(
        &self,
        name: impl Into<String>,
        path: impl AsRef<Path>,
        assertion: Option<CrsAssertion>,
        declared_identity: Option<IdentityDeclaration>,
        cancel: &CancelToken,
    ) -> spatial_engine::Result<()> {
        let ds =
            Dataset::open_cancellable(path, assertion, declared_identity, cancel, self.connections)?;
        self.lock_write().insert(name.into(), Arc::new(ds));
        Ok(())
    }

    pub fn get(&self, name: &str) -> Option<Arc<Dataset>> {
        self.lock_read().get(name).cloned()
    }

    /// Remove a dataset from the catalog. The `Arc<Dataset>` a live stream already holds keeps the
    /// dataset alive until that stream ends regardless of removal order — nothing here waits for or
    /// depends on streams being stopped first (`skp::SkpHost::close_dataset` cancels them
    /// separately, for a different reason: so they stop promptly, not so this is safe).
    pub fn remove(&self, name: &str) -> Option<Arc<Dataset>> {
        self.lock_write().remove(name)
    }

    pub fn names(&self) -> Vec<String> {
        self.lock_read().keys().cloned().collect()
    }
}

/// Build an engine stream for one viewport query, with its own fresh [`CancelToken`] — the shared
/// core both admission paths use.
///
/// Kept separate from wrapping into the data-plane's erased `(Box<dyn BatchSource>, Arc<dyn
/// SourceCancel>)` shape (see [`wrap_for_data_plane`]) because SKP's `viewport_query` needs the
/// *typed* `EngineError` to map through `skp::error_of` — the raw-params path below stringifies
/// immediately because `SourceFactory::create` has no other option, but a typed refusal degrading
/// to a string one call frame earlier than it has to is exactly what `skp::error_of`'s exhaustive
/// match exists to never let happen at the SKP boundary.
pub(crate) fn open_engine_stream(
    ds: &Dataset,
    query: &ViewportQuery,
) -> spatial_engine::Result<(BatchStream, CancelToken)> {
    let cancel = CancelToken::new();
    let stream = ds.stream_with_cancel(query, cancel.clone())?;
    Ok((stream, cancel))
}

/// Erase an engine stream into the data-plane's transport-neutral shape.
pub(crate) fn wrap_for_data_plane(
    stream: BatchStream,
    cancel: CancelToken,
    dataset: String,
    dataset_reuses_connections: bool,
    reports: Option<std::sync::mpsc::Sender<StreamConnectionRecord>>,
    invalidator: Option<Arc<skp::SessionInvalidator>>,
) -> (Box<dyn BatchSource>, Arc<dyn SourceCancel>) {
    let stats = stream.stats();
    let source = EngineSource {
        stream,
        dataset,
        dataset_reuses_connections,
        reports,
        stats,
        invalidator,
        session_ended: false,
    };
    (Box::new(source), Arc::new(EngineCancel(cancel)))
}

/// Which of two admission paths `EngineSourceFactory::create` takes.
///
/// **One process never runs both.** `Raw` is the path every product binary and test in this
/// workspace used before `frontends/shell` existed: the data-plane START frame carries the
/// operation's own parameters, decoded by [`StreamParams`]. `frontends/shell` installs
/// [`AdmissionMode::TicketOnly`] instead — ADR-019 retires the raw path's own declared "temporary
/// structural deviation" now that a control plane exists to mint tickets — and asserts by test that
/// a raw-`StreamParams` START is refused rather than silently accepted (`kernel/tests/skp_admission.rs`).
enum AdmissionMode {
    Raw,
    TicketOnly(Arc<skp::StreamRegistry>),
}

/// Turns an operation request into an engine stream. This is the whole composition.
pub struct EngineSourceFactory {
    catalog: Arc<Catalog>,
    /// Where finished streams report what they ran on, when anyone is listening.
    ///
    /// **Unbounded, deliberately.** A bounded channel would let a stalled reporter block a producer
    /// thread, which is an instrument changing the thing it measures.
    connection_reports: Option<std::sync::mpsc::Sender<StreamConnectionRecord>>,
    mode: AdmissionMode,
}

impl EngineSourceFactory {
    pub fn new(catalog: Arc<Catalog>) -> Self {
        Self { catalog, connection_reports: None, mode: AdmissionMode::Raw }
    }

    /// As `new`, reporting each finished stream's connection facts.
    ///
    /// **The report is emitted when the stream is dropped — after it is over — and never on the
    /// accept path.** `create` runs before the OPEN frame, so anything done there lands inside the
    /// `t_query_start → t_open` segment a measurement is trying to read. The same facts are
    /// available at stream end, where they cost the measurement nothing.
    pub fn with_connection_reports(
        catalog: Arc<Catalog>,
        reports: std::sync::mpsc::Sender<StreamConnectionRecord>,
    ) -> Self {
        Self { catalog, connection_reports: Some(reports), mode: AdmissionMode::Raw }
    }

    /// `frontends/shell`'s constructor (ADR-019). A START frame's `params` is redeemed as a
    /// [`spatial_skp::v0::StreamHandle`] ticket already built and validated by
    /// `SkpHost::viewport_query`, never decoded as [`StreamParams`].
    pub fn ticket_only(catalog: Arc<Catalog>, tickets: Arc<skp::StreamRegistry>) -> Self {
        Self { catalog, connection_reports: None, mode: AdmissionMode::TicketOnly(tickets) }
    }
}

impl SourceFactory for EngineSourceFactory {
    fn create(
        &self,
        request: &OpenRequest,
    ) -> Result<(Box<dyn BatchSource>, Arc<dyn SourceCancel>), String> {
        if request.operation != OPERATION {
            return Err(format!(
                "unknown operation `{}`; this slice has exactly one: `{OPERATION}`",
                request.operation
            ));
        }
        match &self.mode {
            AdmissionMode::Raw => self.create_from_raw_params(request),
            AdmissionMode::TicketOnly(tickets) => Self::create_from_ticket(tickets, request),
        }
    }
}

impl EngineSourceFactory {
    fn create_from_raw_params(
        &self,
        request: &OpenRequest,
    ) -> Result<(Box<dyn BatchSource>, Arc<dyn SourceCancel>), String> {
        let p = StreamParams::decode(&request.params)?;
        let ds = self
            .catalog
            .get(&p.dataset)
            .ok_or_else(|| format!("unknown dataset `{}`", p.dataset))?;

        let query = match (p.bbox, p.bbox_crs.as_deref()) {
            (Some(b), Some(crs)) => ViewportQuery::viewport(
                spatial_engine::Bbox { xmin: b[0], ymin: b[1], xmax: b[2], ymax: b[3] },
                crs,
            ),
            _ => ViewportQuery::all(),
        };
        let query = match p.limit {
            Some(n) => query.with_limit(n),
            None => query,
        };

        // Every refusal the engine can make — an unadmitted CRS, a viewport in the wrong CRS, a
        // missing covering column — arrives here as a typed error and leaves as a terminal frame
        // carrying its own words. Nothing is flattened into "failed".
        let (stream, cancel) = open_engine_stream(&ds, &query).map_err(|e| e.to_string())?;
        Ok(wrap_for_data_plane(
            stream,
            cancel,
            p.dataset,
            ds.connections().config().reuses_connections(),
            self.connection_reports.clone(),
            // The raw-params path has no `SkpHost`, so there is no dataset-session generation for a
            // post-check finding to end. The post-check still runs and the terminal still carries
            // its typed code; only the invalidation has nobody to reach.
            None,
        ))
    }

    /// **ADR-019.** The params blob is a [`spatial_skp::v0::StreamHandle`]'s ASCII bytes, nothing
    /// else — a query built from a client-supplied bbox/limit never reaches this call. Redeeming a
    /// ticket costs a mutex lock and a map removal: the engine work already ran, synchronously,
    /// inside `SkpHost::viewport_query`.
    ///
    /// **A raw `StreamParams` payload is refused here, not specially detected.** `StreamParams`'s
    /// wire form always opens with a one-byte flag field (`0x00`–`0x03`), which can never be the
    /// `sh_` a valid ticket handle starts with, so `StreamHandle::from_str` fails deterministically
    /// on it — asserted by `kernel/tests/skp_admission.rs` rather than left to be assumed. One
    /// process never installs both admission paths (ADR-019's own consequence).
    fn create_from_ticket(
        tickets: &Arc<skp::StreamRegistry>,
        request: &OpenRequest,
    ) -> Result<(Box<dyn BatchSource>, Arc<dyn SourceCancel>), String> {
        let handle_str = std::str::from_utf8(&request.params)
            .map_err(|_| "ticket handle is not valid UTF-8".to_string())?;
        let handle: spatial_skp::v0::StreamHandle = handle_str
            .parse()
            .map_err(|e: String| format!("not a ticket this producer minted: {e}"))?;
        // **Redemption does NOT consult the dataset-session generation, and P3a says so here**
        // rather than leaving the absence to be read as an oversight. A guard was written at P3
        // attempt 2 and is removed rather than carried: nothing in the product ever constructed a
        // factory holding the generation map, so the check never ran; and its refusal text asserted
        // that the source had been observed to change, which for an **unknown** handle — expired,
        // already redeemed, never minted — was a fabricated diagnosis (`docs/01` principle 8).
        //
        // The kernel-authoritative dead-ticket refusal, wired to a real caller and with correct
        // three-valued unknown-handle behaviour, is **P3b**'s (the human's ruling of 2026-09-16,
        // round 4). Until then `redeem`'s own three refusals — unknown, cancelled-before-redeem,
        // already-redeemed — are the whole of what this path says.
        tickets.redeem(handle.as_str())
    }
}

struct EngineSource {
    stream: BatchStream,
    dataset: String,
    dataset_reuses_connections: bool,
    reports: Option<std::sync::mpsc::Sender<StreamConnectionRecord>>,
    /// This stream's own stats, where its producer records what the **post-check** found
    /// (`spatial_engine::StreamStats::source_changed_detail`). Held as the `Arc` the producer
    /// writes through, so this side reads the same cell rather than a copy.
    stats: Arc<spatial_engine::StreamStats>,
    /// Where a post-check finding ends the dataset-session generation. `None` for the raw-params
    /// admission path, which has no `SkpHost` and therefore no generation to end.
    invalidator: Option<Arc<skp::SessionInvalidator>>,
    /// Whether this source already ended its session. The operation is idempotent anyway; this
    /// keeps a drained-then-dropped stream from taking the registry's lock twice for nothing.
    session_ended: bool,
}

impl EngineSource {
    /// **Read the post-check's finding and end the generation if it found a change** — §13 C's
    /// rule (ii), given the reader it lacked at P3 gate attempt 1.
    ///
    /// Called on **every terminal class**: the clean end (`next_into` returns `None`), a terminal
    /// error, a cancellation (which arrives as a terminal error and keeps its own `cancelled`
    /// terminal — a cancel is never reported as a source change), and on `Drop`.
    ///
    /// **`Drop` is a best-effort attempt and not a guarantee, and the residual is named rather than
    /// implied.** `BatchStream::drop` (`engine/src/stream.rs`) cancels the token and returns; it
    /// does **not** join the producer thread. A consumer that walks away without draining can
    /// therefore reach this line before the producer has finished its post-check, in which case the
    /// flag is still empty and nothing is ended here. The change is not lost — the **pre-check**
    /// refuses the next query issue on that dataset and ends the generation there — but the
    /// invalidation is deferred to that point instead of happening at drop.
    ///
    /// The producer records the flag **before it sends any terminal**
    /// (`engine/src/stream.rs`), so by the time any of those arrive here the cell is already
    /// written — there is no race between the terminal and the finding it belongs to.
    fn end_session_if_source_changed(&mut self) {
        if self.session_ended {
            return;
        }
        let Some(detail) = self.stats.source_changed_detail() else { return };
        self.session_ended = true;
        let Some(invalidator) = self.invalidator.as_ref() else { return };
        let cancelled = invalidator.end_generation(&self.dataset);
        // Not a log-and-continue: the generation really is over, and this line only records which
        // stream noticed and how many siblings went with it.
        eprintln!(
            "session ended for dataset `{}`: the source changed during use ({detail}); \
             {cancelled} in-flight stream(s) cancelled",
            self.dataset
        );
    }
}

impl Drop for EngineSource {
    /// Report what this stream ran on, once it is over.
    ///
    /// **Here rather than in `create`** — see `with_connection_reports`. The binding drops the
    /// source when the stream terminates, however it terminated, so a cancelled or failed stream
    /// reports the same facts a completed one does and a measurement cannot silently describe only
    /// its successes.
    fn drop(&mut self) {
        // Best-effort on the abandoned-stream path: `BatchStream::drop` cancels without joining the
        // producer, so the post-check may not have run yet and this may find nothing. When it does,
        // the next query issue's pre-check is what ends the generation instead — deferred, not lost.
        // See `end_session_if_source_changed`'s own note.
        self.end_session_if_source_changed();
        let Some(reports) = self.reports.as_ref() else { return };
        let facts = self.stream.connection_facts();
        // A closed receiver means nobody is recording, which is not an error.
        let _ = reports.send(StreamConnectionRecord {
            dataset: self.dataset.clone(),
            dataset_reuses_connections: self.dataset_reuses_connections,
            physical_id: facts.physical_id,
            lease_generation: facts.lease_generation,
            reused_an_existing_connection: facts.reused_an_existing_connection,
        });
    }
}

impl BatchSource for EngineSource {
    fn next_into(&mut self, out: &mut Vec<u8>) -> Option<Result<BatchMeta, String>> {
        match self.stream.next_into(out) {
            // The clean terminal: the producer is done and `tx` was dropped. Its post-check has
            // already run and already recorded anything it found.
            None => {
                self.end_session_if_source_changed();
                None
            }
            Some(Ok(info)) => Some(Ok(BatchMeta { rows: info.rows as u64 })),
            // Every terminal error, cancellation included.
            //
            // **The detail carries the typed code, `"<code>: <display>"`** — P3 gate attempt 1,
            // architect-ruled. `BatchSource` is typed `Result<_, String>`, so this is where the
            // typed `EngineError` stops being typed; without the prefix a client that must clear
            // residency and refuse picks on `engine.source_changed` (**P3b** — no client does
            // either in P3a) would have to match on prose whose wording is the human's at P6. The code comes from `skp::error_of`'s own table,
            // so there is one place a code is minted. The data plane is untouched: the prefix rides
            // the `String` the terminal frame already carries (A3).
            Some(Err(e)) => {
                let detail = skp::terminal_detail_of(&e);
                self.end_session_if_source_changed();
                Some(Err(detail))
            }
        }
    }

    /// **Not knowable without running the query twice.** A streaming filter does not know its own
    /// result size, and reporting a fabricated denominator would be worse than reporting none: the
    /// binding sends its `UNKNOWN_TOTAL` sentinel and the consumer shows indeterminate progress.
    fn total_batches(&self) -> Option<u64> {
        None
    }
}

struct EngineCancel(CancelToken);

impl SourceCancel for EngineCancel {
    fn cancel(&self) {
        self.0.cancel();
    }
}
