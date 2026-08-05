//! Opening a GeoParquet dataset: read the file's own facts, admit or refuse, hold the CRS as type.
//!
//! `docs/05` puts DuckDB in the role of "querying GeoParquet", and that is the only role it has
//! here — the file's metadata is read *through* DuckDB (`parquet_kv_metadata`) rather than through a
//! second parquet implementation, so there is one reader in the shipped path.

use std::path::{Path, PathBuf};
use std::sync::Arc;

use arrow::datatypes::{DataType, SchemaRef};
use duckdb::Connection;

use crate::crs::{self, CrsAssertion, DatasetCrs};
use crate::envelope::{BatchEnvelope, ID_COLUMN};
use crate::error::{EngineError, Result};
use crate::geoparquet::{CoveringBbox, GeoMeta};

/// Everything the engine established about a file at open time.
pub struct Dataset {
    path: PathBuf,
    envelope: BatchEnvelope,
    covering: Option<CoveringBbox>,
    geo: GeoMeta,
    file_schema: SchemaRef,
}

impl Dataset {
    /// Open a GeoParquet file whose CRS the file itself declares.
    pub fn open(path: impl AsRef<Path>) -> Result<Self> {
        Self::open_inner(path.as_ref(), None)
    }

    /// Open a GeoParquet file, supplying a CRS for the case where the file declares none.
    ///
    /// The assertion is consulted **only** if the file declares nothing. If the file declares a
    /// CRS, this refuses rather than overriding — see `crs::admit`.
    pub fn open_with_asserted_crs(path: impl AsRef<Path>, assertion: CrsAssertion) -> Result<Self> {
        Self::open_inner(path.as_ref(), Some(assertion))
    }

    fn open_inner(path: &Path, assertion: Option<CrsAssertion>) -> Result<Self> {
        if !path.is_file() {
            return Err(EngineError::Source(format!("{} is not a readable file", path.display())));
        }
        let path_str = path
            .to_str()
            .ok_or_else(|| EngineError::Source("path is not valid UTF-8".into()))?
            .to_string();

        let conn = open_connection()?;

        let geo_json = read_geo_metadata(&conn, &path_str)?;
        let geo = GeoMeta::parse(&geo_json)?;

        if !geo.encoding.eq_ignore_ascii_case("WKB") {
            return Err(EngineError::GeoMetadata(format!(
                "geometry encoding is `{}`; this slice reads WKB-encoded GeoParquet only",
                geo.encoding
            )));
        }
        if !geo.geometry_types.is_empty()
            && !geo.geometry_types.iter().all(|t| t.eq_ignore_ascii_case("Polygon"))
        {
            return Err(EngineError::GeoMetadata(format!(
                "geometry_types {:?} include non-polygon types; this slice reads polygons only",
                geo.geometry_types
            )));
        }

        // The asserted axis order comes from the caller's own definition when it supplied one.
        // This engine never supplies an axis order it did not read somewhere.
        let asserted_axis = match assertion.as_ref().and_then(|a| a.definition_json.as_deref()) {
            Some(def) => {
                let v: serde_json::Value = serde_json::from_str(def)
                    .map_err(|e| EngineError::GeoMetadata(format!("asserted definition: {e}")))?;
                Some(crate::geoparquet::axis_order_from_projjson(&v)?)
            }
            None => None,
        };

        let crs = crs::admit(geo.declared_crs.clone(), assertion.as_ref(), asserted_axis)?;
        if !crs.axis_order().is_x_first() {
            return Err(EngineError::AxisOrderUnsupported {
                established: crs.axis_order().as_str().to_string(),
            });
        }

        let file_schema = probe_schema(&conn, &path_str)?;
        check_columns(&file_schema, &geo.primary_column)?;

        Ok(Self {
            path: path.to_path_buf(),
            envelope: BatchEnvelope::new(crs, geo.primary_column.clone()),
            covering: geo.covering.clone(),
            geo,
            file_schema,
        })
    }

    pub fn path(&self) -> &Path {
        &self.path
    }

    pub fn crs(&self) -> &DatasetCrs {
        self.envelope.crs()
    }

    pub fn envelope(&self) -> &BatchEnvelope {
        &self.envelope
    }

    pub fn geometry_column(&self) -> &str {
        &self.geo.primary_column
    }

    pub fn covering(&self) -> Option<&CoveringBbox> {
        self.covering.as_ref()
    }

    pub fn geoparquet_version(&self) -> &str {
        &self.geo.version
    }

    pub fn file_schema(&self) -> &SchemaRef {
        &self.file_schema
    }
}

/// The `geo` key from the parquet file's key/value metadata, read through DuckDB.
fn read_geo_metadata(conn: &Connection, path: &str) -> Result<String> {
    let mut stmt = conn
        .prepare("SELECT key, value FROM parquet_kv_metadata(?)")
        .map_err(|e| EngineError::Source(format!("prepare kv metadata: {e}")))?;

    // Drained in full before anything else runs on this connection. Abandoning a result
    // mid-iteration and then preparing the next statement left DuckDB reporting
    // "ActiveTransaction called without active transaction" — an internal error surfacing as an
    // unrelated failure two calls later, which is exactly the kind of thing that is cheap to avoid
    // and expensive to diagnose.
    let pairs: Vec<(Vec<u8>, Vec<u8>)> = stmt
        .query_map([path], |row| {
            let k: Vec<u8> = row.get(0)?;
            let v: Vec<u8> = row.get(1)?;
            Ok((k, v))
        })
        .map_err(|e| EngineError::Source(format!("read kv metadata: {e}")))?
        .collect::<std::result::Result<Vec<_>, _>>()
        .map_err(|e| EngineError::Source(format!("kv metadata row: {e}")))?;

    for (k, v) in pairs {
        if k == b"geo" {
            return String::from_utf8(v)
                .map_err(|e| EngineError::GeoMetadata(format!("`geo` is not UTF-8: {e}")));
        }
    }

    Err(EngineError::GeoMetadata(format!(
        "{path} carries no `geo` key: it is a parquet file, but not a GeoParquet file"
    )))
}

fn probe_schema(conn: &Connection, path: &str) -> Result<SchemaRef> {
    let mut stmt = conn
        .prepare("SELECT * FROM read_parquet(?) LIMIT 0")
        .map_err(|e| EngineError::Source(format!("prepare schema probe: {e}")))?;
    let arrow = stmt
        .query_arrow([path])
        .map_err(|e| EngineError::Source(format!("schema probe: {e}")))?;
    Ok(arrow.get_schema())
}

/// The two columns this slice needs, checked at open so a stream cannot fail halfway for a reason
/// that was knowable up front.
///
/// **What the id check establishes, and what it does not** — ADR-016 (Proposed), whose Context says
/// this in full. It establishes that a 64-bit column named `id` exists. It does **not** establish
/// dataset-wide uniqueness (values are never compared), nor stability across reopen, nor that the
/// values mean anything — an exporter's invented row number is admitted here. Read as a narrow
/// structural precondition, not as a guarantee of the stable identity ADR-010 rule 2 consumes.
fn check_columns(schema: &SchemaRef, geometry_column: &str) -> Result<()> {
    let id = schema
        .fields()
        .iter()
        .find(|f| f.name() == ID_COLUMN)
        .ok_or_else(|| {
            EngineError::Source(format!(
                "no `{ID_COLUMN}` column: stable per-feature identity is required (docs/11)"
            ))
        })?;
    if !matches!(id.data_type(), DataType::UInt64 | DataType::Int64) {
        return Err(EngineError::Source(format!(
            "`{ID_COLUMN}` is {}; expected a 64-bit integer",
            id.data_type()
        )));
    }

    let geom = schema
        .fields()
        .iter()
        .find(|f| f.name() == geometry_column)
        .ok_or_else(|| {
            EngineError::Source(format!(
                "`geo.primary_column` names `{geometry_column}`, which the file does not contain"
            ))
        })?;
    if !matches!(geom.data_type(), DataType::Binary | DataType::LargeBinary | DataType::BinaryView) {
        return Err(EngineError::Source(format!(
            "geometry column `{geometry_column}` is {}; WKB must be a binary column",
            geom.data_type()
        )));
    }
    Ok(())
}

/// Every DuckDB connection this module opens, configured identically.
///
/// **`enable_geoparquet_conversion` is turned off deliberately, and it is not only a workaround.**
/// DuckDB (v1.5.5 on the reference profile) will, by default, interpret a file's `geo` metadata and
/// hand back a converted geometry type. That would put a **second CRS policy** in the path — one
/// this engine did not write, whose admission rules are not ADR-015's, and whose conversions are
/// invisible here. `docs/05` allows exactly one: no silent conversion, CRS decided once, by the
/// engine that owns the dataset's type. This engine therefore reads the raw WKB and decides for
/// itself.
///
/// It also avoids an upstream defect found while building this slice, recorded here because it will
/// otherwise be rediscovered: with the conversion enabled, `read_parquet` on a GeoParquet file whose
/// `geo` metadata has **no `crs` key** fails with an internal error
/// (`TransactionContext::ActiveTransaction called without active transaction`) rather than a
/// diagnosable one. Files without a declared CRS are precisely the ones this engine has an
/// admission policy for, so that path is not exotic here.
fn open_connection() -> Result<Connection> {
    let conn = Connection::open_in_memory()
        .map_err(|e| EngineError::Source(format!("duckdb open: {e}")))?;
    conn.execute_batch("SET enable_geoparquet_conversion=false")
        .map_err(|e| EngineError::Source(format!("duckdb configure: {e}")))?;
    Ok(conn)
}

/// A DuckDB connection for one stream, with its interrupt handle already bound to `cancel`.
///
/// Created here — on the caller's thread — rather than inside the producer thread, so there is no
/// window in which a cancel could arrive before anything is interruptible.
pub(crate) fn connect_for_stream(cancel: &crate::cancel::CancelToken) -> Result<Connection> {
    let conn = open_connection()?;
    cancel.attach(Arc::clone(&conn.interrupt_handle()))?;
    Ok(conn)
}
