//! Opening a GeoParquet dataset: read the file's own facts, admit or refuse, hold the CRS as type.
//!
//! `docs/05` puts DuckDB in the role of "querying GeoParquet", and that is the only role it has
//! here — the file's metadata is read *through* DuckDB (`parquet_kv_metadata`) rather than through a
//! second parquet implementation, so there is one reader in the shipped path.

use std::path::{Path, PathBuf};
use std::sync::Arc;

use arrow::datatypes::{DataType, SchemaRef};
use duckdb::Connection;

use crate::cancel::CancelToken;
use crate::crs::{self, CrsAssertion, DatasetCrs};
use crate::envelope::{BatchEnvelope, ID_COLUMN};
use crate::identity::{self, DatasetIdentity, IdSource, IdUniqueness, IdentityDeclaration};
use crate::index;
use crate::error::{EngineError, Result};
use crate::geoparquet::{CoveringBbox, GeoMeta};

/// Process-wide, in-memory index cache. Not persisted — persisting is the trigger
/// `kernel/README.md` names for `docs/11`'s ResourceRef model and ADR-005's grades, and that needs
/// its own decision rather than arriving as a side effect of a latency fix.
static INDEX_CACHE: std::sync::LazyLock<index::IndexCache> =
    std::sync::LazyLock::new(index::IndexCache::default);

/// What one `build_index` call cost and produced. Build cost and query benefit stay separate.
#[derive(Clone, Debug)]
pub struct IndexReport {
    /// `None` when a cached index was reused; otherwise why it could not be.
    pub miss: Option<index::IndexMiss>,
    pub content_hash_millis: f64,
    pub build_millis: f64,
    pub indexed_features: usize,
    pub declared_memory_bytes: usize,
    pub scanned_rows: u64,
}

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
        Self::open_inner(path.as_ref(), None, None, &CancelToken::new())
    }

    /// Open a GeoParquet file, supplying a CRS for the case where the file declares none.
    ///
    /// The assertion is consulted **only** if the file declares nothing. If the file declares a
    /// CRS, this refuses rather than overriding — see `crs::admit`.
    pub fn open_with_asserted_crs(path: impl AsRef<Path>, assertion: CrsAssertion) -> Result<Self> {
        Self::open_inner(path.as_ref(), Some(assertion), None, &CancelToken::new())
    }

    /// Open a file whose feature identity lives in a column this engine does not name `id`
    /// (**ADR-016 §3**).
    ///
    /// The declaration is explicit, per dataset, and never inferred. The uniqueness scan runs over
    /// the **mapped** values and reads a whole column, so it is an *operation* rather than a lookup
    /// — `cancel` is honoured throughout (`docs/01` principle 7), and at `docs/07`'s 5 GB it lands
    /// on the same `docs/08` cold-open budget `kernel/RESULTS.md` records as unmeasured.
    pub fn open_with_declared_identity(
        path: impl AsRef<Path>,
        identity: IdentityDeclaration,
        cancel: &CancelToken,
    ) -> Result<Self> {
        Self::open_inner(path.as_ref(), None, Some(identity), cancel)
    }

    fn open_inner(
        path: &Path,
        assertion: Option<CrsAssertion>,
        declared_identity: Option<IdentityDeclaration>,
        cancel: &CancelToken,
    ) -> Result<Self> {
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
        check_geometry_column(&file_schema, &geo.primary_column)?;

        // Identity admission (ADR-016). Native `id` unless the caller declared a mapping; the
        // uniqueness scan runs either way, so a native column is no longer trusted without it.
        let identity = admit_identity(&conn, &path_str, &file_schema, declared_identity, cancel)?;

        Ok(Self {
            path: path.to_path_buf(),
            envelope: BatchEnvelope::new(crs, geo.primary_column.clone(), identity),
            covering: geo.covering.clone(),
            geo,
            file_schema,
        })
    }

    pub fn identity(&self) -> &DatasetIdentity {
        self.envelope.identity()
    }

    /// Build (or reuse) this dataset's spatial index — `docs/07`'s open gate.
    ///
    /// **Build cost and query benefit are different quantities and are returned separately.** The
    /// report carries the content-hash cost, the index build cost and the row count as their own
    /// numbers; nothing here nets them into "pays for itself after N queries", which would be a
    /// claim neither figure supports on its own.
    ///
    /// The index is per-process and in-memory (`index::IndexCache`). A cached index is *found* by
    /// path and *admitted* by content hash, builder version, answered predicate, build parameters
    /// and a fail-closed validity heuristic — so a stale index cannot serve a newer revision; it is
    /// found, rejected, and the reason is in the report.
    pub fn build_index(&self, cancel: &CancelToken) -> Result<IndexReport> {
        let covering = self.covering().ok_or_else(|| EngineError::NoCoveringBbox {
            detail: "the file's `geo` metadata declares no covering.bbox, so there is nothing to                      index in this slice"
                .into(),
        })?;

        let (content_hash, hash_millis) = index::content_hash(self.path(), cancel)?;
        let key = index::IndexKey::new(content_hash);
        let validity = index::ValidityHeuristic::of(self.path());

        match INDEX_CACHE.get(self.path(), &key, validity.as_ref()) {
            Ok(existing) => Ok(IndexReport {
                miss: None,
                content_hash_millis: hash_millis,
                build_millis: 0.0,
                indexed_features: existing.feature_count(),
                declared_memory_bytes: existing.declared_memory_bound(),
                scanned_rows: existing.scanned_rows(),
            }),
            Err(miss) => {
                let path_str = self
                    .path()
                    .to_str()
                    .ok_or_else(|| EngineError::Source("path is not valid UTF-8".into()))?;
                let conn = open_connection()?;
                let built = index::SpatialIndex::build(
                    &conn,
                    path_str,
                    covering,
                    self.identity().source().source_column(),
                    key,
                    validity,
                    cancel,
                )?;
                let report = IndexReport {
                    miss: Some(miss),
                    content_hash_millis: hash_millis,
                    build_millis: built.build_millis(),
                    indexed_features: built.feature_count(),
                    declared_memory_bytes: built.declared_memory_bound(),
                    scanned_rows: built.scanned_rows(),
                };
                INDEX_CACHE.insert(self.path().to_path_buf(), std::sync::Arc::new(built));
                Ok(report)
            }
        }
    }

    /// The index that may serve this dataset right now, if any.
    ///
    /// Re-checks admission on every call rather than caching the answer: the file can change under
    /// a long-lived process, and an index that was admissible a minute ago is not thereby
    /// admissible now.
    pub(crate) fn admitted_index(&self) -> Option<std::sync::Arc<index::SpatialIndex>> {
        let hash = INDEX_CACHE.hash_for(self.path())?;
        let key = index::IndexKey::new(hash);
        INDEX_CACHE.get(self.path(), &key, index::ValidityHeuristic::of(self.path()).as_ref()).ok()
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

/// Admit the dataset's feature identity — **ADR-016 §3–§6**.
///
/// Refusal is the default: absent a declaration, the engine looks for its own `id` column and
/// refuses if it is not there. A declaration redirects identity to a named source column, and
/// **changes nothing else** — in particular it does not weaken any check.
///
/// The uniqueness scan is what turns "a column exists" into "an id identifies one feature", and it
/// runs for a **native** column too: ADR-016's Context records that the native column was
/// previously trusted without it, which is the gap this closes.
fn admit_identity(
    conn: &Connection,
    path: &str,
    schema: &SchemaRef,
    declared: Option<IdentityDeclaration>,
    cancel: &CancelToken,
) -> Result<DatasetIdentity> {
    let (source, column, skip) = match declared {
        Some(d) => {
            let col = d.column.clone();
            (IdSource::Mapped { column: col.clone(), by: d.by, at: d.at }, col, d.skip_uniqueness_check)
        }
        None => (IdSource::File, ID_COLUMN.to_string(), false),
    };

    let field = schema.fields().iter().find(|f| f.name() == &column).ok_or_else(|| {
        EngineError::IdentityUnusable {
            column: column.clone(),
            detail: if matches!(source, IdSource::File) {
                "the file has no such column, and no identity mapping was declared. Stable \
                 per-feature identity is required (docs/11); declare a mapping to a column that \
                 carries it"
                    .to_string()
            } else {
                "the file has no such column".to_string()
            },
        }
    })?;

    // §4's value-preserving test. A type needing a transform to reach u64 is refused outright.
    identity::admit_column_type(&column, field.data_type())?;

    if skip {
        // Recorded, not hidden. A caller may take responsibility for uniqueness; it may not make
        // that invisible to the consumer downstream of it.
        return Ok(DatasetIdentity::new(source, IdUniqueness::DeclaredNotVerified, None, None));
    }

    // **One pass, three questions.** Row count, distinct count and the extreme values come from a
    // single scan because each extra pass over a 5 GB column is another cold-open cost. `MIN` is
    // here because a signed source column widens into u64 exactly only if it holds no negative
    // value — §4 admits the *type* and this refuses the *values*.
    let sql = format!(
        "SELECT count(*), count(DISTINCT \"{c}\"), min(\"{c}\"), max(\"{c}\") \
         FROM read_parquet('{p}')",
        c = column.replace('"', "\"\""),
        p = path.replace('\'', "''")
    );

    // Bound to the caller's token before the scan starts, so a cancel arriving mid-scan reaches
    // DuckDB's interrupt rather than waiting for a whole column to be read (principle 7).
    cancel.attach(std::sync::Arc::clone(&conn.interrupt_handle()))?;
    let scan = run_identity_scan(conn, &sql);
    cancel.detach();
    if cancel.is_cancelled() {
        return Err(EngineError::Cancelled);
    }
    let (rows, distinct, min, max) = scan?;

    if let Some(m) = min {
        if m < 0 {
            return Err(EngineError::IdentityUnusable {
                column: column.clone(),
                detail: format!(
                    "holds a negative value ({m}); identity is carried as u64 and a negative \
                     source value cannot widen into it without changing the value"
                ),
            });
        }
    }
    if distinct != rows {
        return Err(EngineError::IdentityUnusable {
            column: column.clone(),
            detail: format!(
                "{rows} rows carry only {distinct} distinct values, so at least two features share \
                 an identity. ADR-010 rule 2 resolves a pick through this id, and a shared id \
                 returns a wrong-but-plausible feature with nothing raised"
            ),
        });
    }

    Ok(DatasetIdentity::new(
        source,
        IdUniqueness::VerifiedAtOpenFullFile,
        Some(rows),
        max.map(|m| m as u64),
    ))
}

fn run_identity_scan(conn: &Connection, sql: &str) -> Result<(u64, u64, Option<i64>, Option<i64>)> {
    let mut stmt = conn
        .prepare(sql)
        .map_err(|e| EngineError::Query(format!("identity scan prepare: {e}")))?;
    let mut rows = stmt
        .query([])
        .map_err(|e| EngineError::Query(format!("identity scan: {e}")))?;
    let row = rows
        .next()
        .map_err(|e| EngineError::Query(format!("identity scan: {e}")))?
        .ok_or_else(|| EngineError::Query("identity scan returned no row".into()))?;
    let count: i64 = row.get(0).map_err(|e| EngineError::Query(format!("count: {e}")))?;
    let distinct: i64 = row.get(1).map_err(|e| EngineError::Query(format!("distinct: {e}")))?;
    // MIN/MAX are NULL for an empty file, which is not an error — it is zero features.
    let min: Option<i64> = row.get(2).ok();
    let max: Option<i64> = row.get(3).ok();
    Ok((count as u64, distinct as u64, min, max))
}

/// The geometry column, checked at open so a stream cannot fail halfway for a reason that was
/// knowable up front.
fn check_geometry_column(schema: &SchemaRef, geometry_column: &str) -> Result<()> {
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
