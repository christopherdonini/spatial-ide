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
use spatial_engine::{BatchStream, CancelToken, CrsAssertion, Dataset, ViewportQuery};

pub mod params;

pub use params::{StreamParams, OPERATION};

/// Datasets opened at startup, addressable by name.
#[derive(Default)]
pub struct Catalog {
    datasets: HashMap<String, Arc<Dataset>>,
}

impl Catalog {
    pub fn new() -> Self {
        Self::default()
    }

    /// Open a dataset and register it under `name`.
    ///
    /// Opening here means the CRS admission decision (ADR-015) happens **at startup**, in the open
    /// where an operator sees it, rather than on a consumer's first request.
    pub fn open(
        &mut self,
        name: impl Into<String>,
        path: impl AsRef<Path>,
        assertion: Option<CrsAssertion>,
    ) -> spatial_engine::Result<()> {
        let ds = match assertion {
            Some(a) => Dataset::open_with_asserted_crs(path, a)?,
            None => Dataset::open(path)?,
        };
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
}

impl EngineSourceFactory {
    pub fn new(catalog: Catalog) -> Self {
        Self { catalog }
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

        Ok((Box::new(EngineSource { stream }), Arc::new(EngineCancel(cancel))))
    }
}

struct EngineSource {
    stream: BatchStream,
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
