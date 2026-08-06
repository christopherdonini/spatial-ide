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
//! - **No lineage DAG, no undo, no command/event log.** The operation is a **pure transformation**
//!   under ADR-006 — an input snapshot plus parameters produce a derived output — so no transaction
//!   boundary and no undo machinery is owed.
//! - **No persistence.** Nothing is written. The moment this caches a result to disk, names
//!   datasets by URI, or emits a bundle, `docs/11`'s ResourceRef model and ADR-005's reproducibility
//!   grades are owed and this file is no longer honest. **This slice claims no reproducibility
//!   grade.**
//! - **No permission model.** `docs/09`'s capability grants do not exist here, and none is claimed.
//! - **No dataset registry beyond a name → open dataset map** fixed at startup. Names, never paths:
//!   a client-supplied path on a listening socket is an arbitrary-file-read primitive.

use std::collections::HashMap;
use std::path::Path;
use std::sync::Arc;

use spatial_data_plane::transport::{
    BatchMeta, BatchSource, OpenRequest, SourceCancel, SourceFactory,
};
use spatial_engine::{BatchStream, CancelToken, CrsAssertion, Dataset, PoolConfig, ViewportQuery};

pub mod bundle;
pub mod params;

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

/// Datasets opened at startup, addressable by name.
pub struct Catalog {
    datasets: HashMap<String, Arc<Dataset>>,
    connections: PoolConfig,
}

impl Default for Catalog {
    fn default() -> Self {
        Self { datasets: HashMap::new(), connections: PoolConfig::default() }
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
        Self { datasets: HashMap::new(), connections }
    }

    pub fn connections(&self) -> PoolConfig {
        self.connections
    }

    /// Open a dataset and register it under `name`.
    ///
    /// Opening here means the CRS admission decision (ADR-015) happens **at startup**, in the open
    /// where an operator sees it, rather than on a consumer's first request. It is also where the
    /// dataset's first configured DuckDB connection is prepared, so the first query does not create
    /// one inside **S2** — the `query start → OPEN` segment `kernel/RESULTS.md` measured at p50
    /// 92.6 ms. **How much of S2 that creation accounts for is not known**: S2 also carries socket
    /// acquisition, the handshake, SQL construction and the configuration statement, and no
    /// measurement has yet divided it. Producing that division is what the reused-connection pass
    /// is for; nothing here claims its answer in advance.
    pub fn open(
        &mut self,
        name: impl Into<String>,
        path: impl AsRef<Path>,
        assertion: Option<CrsAssertion>,
    ) -> spatial_engine::Result<()> {
        let ds = Dataset::open_with_connections(path, assertion, self.connections)?;
        self.datasets.insert(name.into(), Arc::new(ds));
        Ok(())
    }

    pub fn get(&self, name: &str) -> Option<Arc<Dataset>> {
        self.datasets.get(name).cloned()
    }

    pub fn names(&self) -> Vec<&str> {
        self.datasets.keys().map(String::as_str).collect()
    }
}

/// Turns an operation request into an engine stream. This is the whole composition.
pub struct EngineSourceFactory {
    catalog: Catalog,
    /// Where finished streams report what they ran on, when anyone is listening.
    ///
    /// **Unbounded, deliberately.** A bounded channel would let a stalled reporter block a producer
    /// thread, which is an instrument changing the thing it measures.
    connection_reports: Option<std::sync::mpsc::Sender<StreamConnectionRecord>>,
}

impl EngineSourceFactory {
    pub fn new(catalog: Catalog) -> Self {
        Self { catalog, connection_reports: None }
    }

    /// As `new`, reporting each finished stream's connection facts.
    ///
    /// **The report is emitted when the stream is dropped — after it is over — and never on the
    /// accept path.** `create` runs before the OPEN frame, so anything done there lands inside the
    /// `t_query_start → t_open` segment a measurement is trying to read. The same facts are
    /// available at stream end, where they cost the measurement nothing.
    pub fn with_connection_reports(
        catalog: Catalog,
        reports: std::sync::mpsc::Sender<StreamConnectionRecord>,
    ) -> Self {
        Self { catalog, connection_reports: Some(reports) }
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

        let cancel = CancelToken::new();
        // Every refusal the engine can make — an unadmitted CRS, a viewport in the wrong CRS, a
        // missing covering column — arrives here as a typed error and leaves as a terminal frame
        // carrying its own words. Nothing is flattened into "failed".
        let stream = ds
            .stream_with_cancel(&query, cancel.clone())
            .map_err(|e| e.to_string())?;

        let source = EngineSource {
            stream,
            dataset: p.dataset,
            dataset_reuses_connections: ds.connections().config().reuses_connections(),
            reports: self.connection_reports.clone(),
        };
        Ok((Box::new(source), Arc::new(EngineCancel(cancel))))
    }
}

struct EngineSource {
    stream: BatchStream,
    dataset: String,
    dataset_reuses_connections: bool,
    reports: Option<std::sync::mpsc::Sender<StreamConnectionRecord>>,
}

impl Drop for EngineSource {
    /// Report what this stream ran on, once it is over.
    ///
    /// **Here rather than in `create`** — see `with_connection_reports`. The binding drops the
    /// source when the stream terminates, however it terminated, so a cancelled or failed stream
    /// reports the same facts a completed one does and a measurement cannot silently describe only
    /// its successes.
    fn drop(&mut self) {
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
            None => None,
            Some(Ok(info)) => Some(Ok(BatchMeta { rows: info.rows as u64 })),
            Some(Err(e)) => Some(Err(e.to_string())),
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
