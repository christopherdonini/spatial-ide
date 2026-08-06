//! **Publish a static bundle** — the hero slice's last operation (`docs/07`, ADR-008).
//!
//! Cancellable, progress-reporting, streaming (`docs/01` principle 7). Stages into a sibling
//! directory and finalizes with a single rename, so a bundle under the destination name is either
//! complete and valid or absent — never partial.
//!
//! ## This is a class-3 external side effect, and the permission model for it does not exist
//!
//! ADR-006 classes an operation that writes outside the workspace as an external side effect:
//! approval-gated, and **never called undoable**. `docs/09` is more specific — "Export and publish
//! are distinct capabilities, never implied by write. Class-3 side effects always require
//! approval."
//!
//! **This slice has no permission model and no approval gate**, exactly as `kernel/README.md`
//! already records for capability grants generally. So the operation declares its reversibility
//! class **on this API** — [`REVERSIBILITY_CLASS`] — and this comment says plainly that the gating
//! `docs/09` requires is **owed and absent**. Shipping an ungated class-3 operation while saying
//! nothing would be the silent version of the same gap.
//!
//! **The class is not recorded in the manifest, and is not claimed to be.** ADR-006's declaration
//! is addressed to the *caller deciding whether to invoke the operation*, and by the time a bundle
//! exists that decision has been made. A field in the manifest would tell a bundle's reader
//! something about an act they did not perform and cannot undo. Adding one is a live option — it
//! would document how the artifact came to exist — but it is a different thing from the ADR-006
//! declaration and would not discharge it.
//!
//! ## The order of operations, and why it is that order
//!
//! 1. **Validate the name and the destination, and create the staging directory** — before the
//!    query, before the hash. An unwritable destination is then refused in milliseconds rather than
//!    after a whole-file read.
//! 2. **Verify the source pin.** The pin was taken by an explicit earlier call; this re-hashes and
//!    compares. The brief says "between open and publish"; what is actually checked is **between
//!    pin and publish**, which is a faithful substitution and is recorded as what it is.
//! 3. **Resolve the projection and compile the style against it.** Both are refusals that must
//!    happen before a single partition is written.
//! 4. **Stream, ordered, writing one partition per batch**, hashing and bounding as it goes.
//! 5. **Write the style, the viewer, the manifest, the sidecar.**
//! 6. **Re-check the source with the fail-closed heuristic**, then rename.
//!
//! ## Declared recovery policy (ADR-010 rule 7)
//!
//! **`none` — fail visibly, remove the staging directory, terminate with a typed error.** No retry,
//! no resume, no partial bundle kept for later. A staging directory that cannot be removed is
//! reported rather than swallowed, carrying the failure it was cleaning up after.

use std::io::Write as _;
use std::path::{Path, PathBuf};

use spatial_engine::{CancelToken, Dataset, ViewportQuery};
use spatial_renderer::canonical;
use spatial_renderer::CompiledStyle;

use crate::bundle::{
    self, Asset, BuildInfo, Column, Filter, FormatDeclaration, Known, License, LicenseTerms,
    Locator, Manifest, Operation, Redistribution, Reproducibility, ResourceRef, Software, Unknown,
};

pub mod error;
pub mod viewer_assets;

pub use error::PublishError;
pub use viewer_assets::{ViewerAsset, ViewerAssets, MAX_VIEWER_ASSETS, MAX_VIEWER_ASSET_BYTES};

/// ADR-006's reversibility class for this operation, declared on the API rather than implied.
///
/// A published bundle is files written outside any transaction, in a location the operation does not
/// own. Nothing here can undo that, and nothing here will claim it can.
pub const REVERSIBILITY_CLASS: &str = "irreversible";

/// The operation identifier carried in the manifest's operation digest.
pub const OPERATION: &str = "publish-static-bundle";

/// Phases a caller can watch. Reported so the operation's silence is detectable (ADR-010 rule 7).
///
/// `Querying` is the one worth naming: with an `ORDER BY`, DuckDB sorts before the first row
/// arrives, so a large source spends a long quiet period there. That window is DuckDB's own and is
/// outside every ceiling this workspace declares; reporting the phase is what stops it looking like
/// a hang.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PublishPhase {
    VerifyingSource,
    Querying,
    WritingPartitions,
    WritingStyle,
    WritingViewer,
    WritingManifest,
    Finalizing,
}

impl PublishPhase {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::VerifyingSource => "verifying-source",
            Self::Querying => "querying",
            Self::WritingPartitions => "writing-partitions",
            Self::WritingStyle => "writing-style",
            Self::WritingViewer => "writing-viewer",
            Self::WritingManifest => "writing-manifest",
            Self::Finalizing => "finalizing",
        }
    }
}

/// Progress, as an observer rather than a log line, so a caller can drive a UI or a test from it.
pub trait PublishProgress: Send + Sync {
    fn phase(&self, phase: PublishPhase);
    fn partition_written(&self, index: usize, rows: usize, bytes: u64);
}

/// A no-op observer, so the operation never branches on `Option` internally.
struct Silent;
impl PublishProgress for Silent {
    fn phase(&self, _: PublishPhase) {}
    fn partition_written(&self, _: usize, _: usize, _: u64) {}
}

/// License terms an operator supplies for a source that declares none.
#[derive(Clone, Debug)]
pub struct OperatorLicense {
    pub license: String,
    pub attribution: Option<String>,
    pub redistribution: Redistribution,
    /// Who declared it and when — a claim carries its claimant, the same shape `CrsAssertion` and
    /// `IdentityDeclaration` already use.
    pub by: String,
    pub at: String,
}

/// One publish.
pub struct PublishRequest<'a> {
    pub dataset: &'a Dataset,
    /// The catalog name. Becomes `spatial://dataset/<name>`; validated, never derived from a path.
    pub dataset_name: &'a str,
    pub query: ViewportQuery,
    /// The attribute columns to publish, in the caller's declared order.
    pub attributes: Vec<String>,
    /// The style document source. Compiled here against the dataset schema and this projection.
    pub style_source: &'a str,
    pub viewer: &'a ViewerAssets,
    /// Terms for a source that declares none. Supplying these for a source that *does* declare is
    /// refused.
    pub license: Option<OperatorLicense>,
    pub destination: PathBuf,
    /// When the caller considers the operation to have started, as an RFC-3339 UTC string.
    ///
    /// Supplied rather than read from a clock here, so the operation stays a function of its inputs
    /// and a determinism test can publish twice and compare bytes. It reaches only the sidecar,
    /// which is excluded from every hash.
    pub started_at: String,
    /// The clock for `finished_at`, **called once after the bundle is written**.
    ///
    /// A `String` here would be read before `publish` ran, so `finished_at − started_at` would
    /// measure whatever the caller did before calling rather than the build — a wall-clock fact
    /// that quietly described something else. A closure keeps the instant honest and still keeps
    /// the clock out of this module, so a test can supply a fixed one.
    pub finished_at: &'a dyn Fn() -> String,
}

/// What one publish produced. Facts, with **no budget attached and no comparison implied**.
#[derive(Clone, Debug)]
pub struct PublishOutcome {
    pub bundle_path: PathBuf,
    pub manifest_bytes: usize,
    pub total_bytes: u64,
    pub partitions: usize,
    pub rows: u64,
    pub build_millis: f64,
    pub content_hash_millis: f64,
    pub style_hash: String,
    pub operation_digest: String,
    pub bounds: Option<[f64; 4]>,
    pub reproducibility_grade: &'static str,
}

/// Publish a static bundle.
pub fn publish(
    req: &PublishRequest<'_>,
    cancel: &CancelToken,
    progress: Option<&dyn PublishProgress>,
) -> Result<PublishOutcome, PublishError> {
    let started = std::time::Instant::now();
    let silent = Silent;
    let progress: &dyn PublishProgress = progress.unwrap_or(&silent);

    let logical_uri = dataset_logical_uri(req.dataset_name)?;

    // Destination first, staging created before anything expensive runs.
    if req.destination.exists() {
        return Err(PublishError::DestinationExists {
            path: req.destination.display().to_string(),
        });
    }
    let staging = Staging::create(&req.destination)?;

    match run(req, cancel, progress, &staging, &logical_uri, started) {
        Ok(outcome) => Ok(outcome),
        Err(e) => {
            // **Cleanup is reported, never swallowed** (ADR-010 rule 7).
            if let Err(io) = staging.remove() {
                return Err(PublishError::StagingNotRemoved {
                    // The original error is carried whole, not flattened to a string: a caller
                    // matching on `Cancelled` must still be able to, or a cleanup failure would
                    // silently change what the operation reports going wrong.
                    after: Box::new(e),
                    path: staging.path().display().to_string(),
                    detail: io.to_string(),
                });
            }
            Err(e)
        }
    }
}

#[allow(clippy::too_many_arguments)]
fn run(
    req: &PublishRequest<'_>,
    cancel: &CancelToken,
    progress: &dyn PublishProgress,
    staging: &Staging,
    logical_uri: &str,
    started: std::time::Instant,
) -> Result<PublishOutcome, PublishError> {
    let ds = req.dataset;

    // ---- license, before any work is spent on a bundle that may not be publishable -------------
    let license = admit_license(ds.source_license(), req.license.as_ref())?;

    // ---- source pin ---------------------------------------------------------------------------
    progress.phase(PublishPhase::VerifyingSource);
    let pin = ds.content_pin().ok_or(PublishError::SourceNotPinned)?;
    check_cancel(cancel)?;
    let content_hash_millis = pin.verify_by_rehash(ds.path(), cancel)?;

    // ---- projection and style -----------------------------------------------------------------
    let projection = ds.resolve_projection(&req.attributes)?;
    let schema_for_style: Vec<(String, arrow::datatypes::DataType)> = ds
        .file_schema()
        .fields()
        .iter()
        .map(|f| (f.name().clone(), f.data_type().clone()))
        .collect();
    let published_names = projection.names();
    let style: CompiledStyle =
        spatial_renderer::compile(req.style_source, &schema_for_style, &published_names)?;

    // ---- partitions ---------------------------------------------------------------------------
    progress.phase(PublishPhase::Querying);
    let mut stream = ds.stream_for_publish(&req.query, &projection, cancel.clone())?;

    staging.create_dir(bundle::DATA_DIR)?;
    progress.phase(PublishPhase::WritingPartitions);

    let mut partitions: Vec<Asset> = Vec::new();
    let mut rows_total: u64 = 0;
    let mut bounds: Option<[f64; 4]> = None;
    let mut payload = Vec::new();

    loop {
        check_cancel(cancel)?;
        let Some(info) = stream.next_into(&mut payload) else { break };
        let info = info?;
        // Cancellation is observed on both sides of the encode-and-write, which is what makes the
        // uninterruptible window "one partition" rather than "however long the rest takes".
        check_cancel(cancel)?;

        let index = partitions.len();
        if index >= spatial_engine::MAX_PUBLISH_PARTITIONS {
            return Err(PublishError::CeilingExceeded {
                ceiling: "MAX_PUBLISH_PARTITIONS",
                limit: spatial_engine::MAX_PUBLISH_PARTITIONS as u64,
                saw: index as u64 + 1,
            });
        }
        let rel = bundle::partition_path(index);
        let hash = staging.write(&rel, &payload)?;
        partitions.push(Asset {
            path: rel,
            bytes: payload.len() as u64,
            content_hash: hash,
            rows: Some(info.rows as u64),
        });
        rows_total += info.rows as u64;
        bounds = union(bounds, info.xy_bounds);
        progress.partition_written(index, info.rows, payload.len() as u64);
        payload.clear();
        check_cancel(cancel)?;
    }

    // ---- style ---------------------------------------------------------------------------------
    progress.phase(PublishPhase::WritingStyle);
    // `staging.write` hashes the bytes it wrote, and those bytes are `style.canonical_json()`, so
    // this equals `style.style_hash()` by construction. It is used rather than the compiled value so
    // the manifest lists a hash of **what is on disk** — which is the property a reader verifies.
    let style_hash = staging.write(bundle::STYLE_PATH, style.canonical_json().as_bytes())?;

    // ---- viewer --------------------------------------------------------------------------------
    progress.phase(PublishPhase::WritingViewer);
    staging.create_dir(bundle::VIEWER_DIR)?;
    let mut viewer_assets = Vec::with_capacity(req.viewer.len());
    for asset in req.viewer.iter() {
        check_cancel(cancel)?;
        let rel = format!("{}/{}", bundle::VIEWER_DIR, asset.path);
        if let Some(parent) = Path::new(&rel).parent() {
            staging.create_dir(&parent.to_string_lossy().replace('\\', "/"))?;
        }
        let hash = staging.write(&rel, &asset.bytes)?;
        viewer_assets.push(Asset {
            path: rel,
            bytes: asset.bytes.len() as u64,
            content_hash: hash,
            rows: None,
        });
    }

    // ---- manifest ------------------------------------------------------------------------------
    progress.phase(PublishPhase::WritingManifest);
    let operation = build_operation(ds, req, logical_uri, &pin, projection.fields(), &style)?;
    let operation_digest = operation.digest()?;
    let manifest = build_manifest(
        ds,
        logical_uri,
        &pin,
        &style,
        &style_hash,
        operation,
        &operation_digest,
        projection.fields(),
        bounds,
        rows_total,
        partitions,
        viewer_assets,
        license,
    );
    let manifest_json = manifest.canonical()?;
    staging.write(bundle::MANIFEST_PATH, manifest_json.as_bytes())?;

    // ---- finalize ------------------------------------------------------------------------------
    progress.phase(PublishPhase::Finalizing);
    check_cancel(cancel)?;

    // **The fail-closed re-check.** Cheap, and it is a heuristic rather than a content hash — which
    // is why the manifest records only "hashed at publish start" and does not shelve this beside it
    // as though a second hash had been taken.
    pin.verify_by_heuristic(ds.path())?;

    let build_millis = started.elapsed().as_secs_f64() * 1000.0;
    // Measured before the sidecar exists, and the sidecar records that this is what it means: two
    // numbers under one name in one operation would be worse than either.
    let bytes_before_sidecar = staging.total_bytes()?;
    let build_info = BuildInfo {
        started_at: req.started_at.clone(),
        // Sampled here, after every byte of the bundle is on disk.
        finished_at: (req.finished_at)(),
        build_millis,
        content_hash_millis,
        total_bytes: bytes_before_sidecar,
        partition_count: manifest.partitions.len() as u64,
        rows: rows_total,
    };
    staging.write(
        bundle::BUILD_INFO_PATH,
        canonical::to_canonical_string(&build_info.to_json())?.as_bytes(),
    )?;

    // The figure the caller is handed covers the whole bundle, sidecar included.
    let total_bytes = staging.total_bytes()?;
    staging.finalize(&req.destination)?;

    Ok(PublishOutcome {
        bundle_path: req.destination.clone(),
        manifest_bytes: manifest_json.len(),
        total_bytes,
        partitions: manifest.partitions.len(),
        rows: rows_total,
        build_millis,
        content_hash_millis,
        style_hash: style.style_hash().to_string(),
        operation_digest,
        bounds,
        reproducibility_grade: manifest.reproducibility.grade,
    })
}

fn check_cancel(cancel: &CancelToken) -> Result<(), PublishError> {
    if cancel.is_cancelled() {
        return Err(PublishError::Cancelled);
    }
    Ok(())
}

fn union(a: Option<[f64; 4]>, b: Option<[f64; 4]>) -> Option<[f64; 4]> {
    match (a, b) {
        (None, x) | (x, None) => x,
        (Some(a), Some(b)) => Some([
            a[0].min(b[0]),
            a[1].min(b[1]),
            a[2].max(b[2]),
            a[3].max(b[3]),
        ]),
    }
}

/// `spatial://dataset/<name>`, with the name checked rather than escaped.
///
/// Escaping would let a path *through* in encoded form, which is the same leak wearing percent
/// signs. Refusing is what keeps `docs/09`'s "no local filesystem paths" true of the manifest.
fn dataset_logical_uri(name: &str) -> Result<String, PublishError> {
    let reject = |detail: &str| {
        Err(PublishError::DatasetNameRejected {
            name: name.to_string(),
            detail: detail.to_string(),
        })
    };
    if name.is_empty() {
        return reject("is empty");
    }
    if name.len() > 128 {
        return reject("is longer than 128 characters");
    }
    if !name
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_' || c == '.')
        || name.contains("..")
    {
        return reject(
            "must be ASCII letters, digits, `-`, `_` or `.` with no `..` — anything else can carry \
             a path separator, a drive letter or a traversal",
        );
    }
    Ok(format!("spatial://dataset/{name}"))
}

/// Combine what the source declares with what the operator declared, and refuse the two cases that
/// are not this operation's judgement to make.
fn admit_license(
    source: &spatial_engine::dataset::SourceLicense,
    operator: Option<&OperatorLicense>,
) -> Result<License, PublishError> {
    let source_redistribution = |s: &str| match s.to_ascii_lowercase().as_str() {
        "permitted" | "allowed" | "yes" => Redistribution::Permitted,
        "forbidden" | "prohibited" | "no" => Redistribution::Forbidden,
        // Anything the vocabulary does not cover is **unknown**, never assumed permitted. The
        // publish still proceeds — `docs/14` says surface it when known, not refuse when unclear —
        // but the manifest says `unknown` rather than a guess.
        _ => Redistribution::Unknown,
    };

    match (source.declares_anything(), operator) {
        (true, Some(op)) => Err(PublishError::LicenseDeclaredTwice {
            source: source.license.clone().unwrap_or_else(|| "(terms without a name)".into()),
            operator: op.license.clone(),
        }),
        (true, None) => {
            let redistribution = source
                .redistribution
                .as_deref()
                .map(source_redistribution)
                .unwrap_or(Redistribution::Unknown);
            if redistribution == Redistribution::Forbidden {
                return Err(PublishError::LicenseNotCarryable {
                    declared_by: "source",
                    redistribution: source.redistribution.clone().unwrap_or_default(),
                });
            }
            // **Carried through, with no fallback.** The three source keys are independent, so a
            // source declaring only `attribution` (or only `redistribution`) reaches here with no
            // license name — and `license` is then `null`, the absence itself. This arm used to
            // substitute `"(unnamed)"`, which put text no source wrote into the one member whose
            // whole contract is verbatim carriage, and put it there in a form plausible enough to
            // be read as a license name. ADR-017 Corrigendum 1 settles the shape.
            Ok(License::DeclaredBySource(LicenseTerms {
                license: source.license.clone(),
                attribution: source.attribution.clone(),
                redistribution,
            }))
        }
        (false, Some(op)) => {
            // **The empty declaration is refused, which is what makes §5's "non-empty string" a
            // property rather than an aspiration.** `declared-by-operator` exists to say somebody
            // claimed something; `""` is not a claim, and the CLI's own check does not cover a
            // caller using the library directly.
            if op.license.trim().is_empty() {
                return Err(PublishError::OperatorLicenseEmpty);
            }
            if op.redistribution == Redistribution::Forbidden {
                return Err(PublishError::LicenseNotCarryable {
                    declared_by: "operator",
                    redistribution: op.redistribution.as_str().to_string(),
                });
            }
            Ok(License::DeclaredByOperator {
                license: op.license.clone(),
                attribution: op.attribution.clone(),
                redistribution: op.redistribution,
                by: op.by.clone(),
                at: op.at.clone(),
            })
        }
        // The fixture's case, and the common one: nothing declared anywhere. Recorded honestly as
        // `not-declared`; no attribution is invented to fill the field.
        (false, None) => Ok(License::NotDeclared),
    }
}

fn format_declaration() -> FormatDeclaration {
    FormatDeclaration {
        framing: "arrow-ipc-stream-per-partition",
        compression: "none",
        dictionaries: "none",
        geometry_encoding: "geoarrow.polygon".into(),
        coordinate_layout: "interleaved-xy".into(),
        partition_target_bytes: spatial_engine::PUBLISH_PARTITION_TARGET_BYTES as u64,
        partition_max_rows: spatial_engine::PUBLISH_PARTITION_ROWS as u64,
        partition_boundary_rule: "cut-before-append",
        max_partitions: spatial_engine::MAX_PUBLISH_PARTITIONS as u64,
    }
}

fn columns(fields: &[arrow::datatypes::Field]) -> Vec<Column> {
    let mut out = vec![
        Column { name: "id".into(), arrow_type: "UInt64".into(), nullable: false },
        Column {
            name: "geometry".into(),
            arrow_type: "List<List<FixedSizeList<Float64>[2]>>".into(),
            nullable: false,
        },
    ];
    out.extend(fields.iter().map(|f| Column {
        name: f.name().clone(),
        arrow_type: f.data_type().to_string(),
        nullable: f.is_nullable(),
    }));
    out
}

fn build_operation(
    ds: &Dataset,
    req: &PublishRequest<'_>,
    logical_uri: &str,
    pin: &spatial_engine::ContentPin,
    fields: &[arrow::datatypes::Field],
    style: &CompiledStyle,
) -> Result<Operation, PublishError> {
    let identity = ds.identity();
    let crs = ds.crs();
    let filter = match req.query.bbox.as_ref() {
        None => Filter::WholeFile,
        Some(b) => Filter::CoveringBboxIntersects {
            xmin: b.xmin,
            ymin: b.ymin,
            xmax: b.xmax,
            ymax: b.ymax,
            bbox_crs: req.query.bbox_crs.clone(),
        },
    };
    Ok(Operation {
        operation: OPERATION,
        source_logical_uri: logical_uri.to_string(),
        source_content_hash: format!("sha256:{}", pin.hash()),
        id_source: identity.source().as_envelope_value(),
        id_uniqueness: identity.uniqueness().as_str().to_string(),
        id_verified_rows: identity.verified_rows(),
        crs_identifier: crs.identifier().to_string(),
        crs_source: crs.source().as_str().to_string(),
        axis_order: crs.axis_order().as_str().to_string(),
        axis_normalization: "none-performed".to_string(),
        crs_definition_hash: match crs.definition_json() {
            Some(def) => Known::Value(canonical::sha256_hex(def.as_bytes())),
            None => Known::Unknown(Unknown::new(
                "no-definition",
                "the source declares a CRS identifier with no definition body",
            )),
        },
        filter,
        limit: req.query.limit,
        projection: fields
            .iter()
            .map(|f| Column {
                name: f.name().clone(),
                arrow_type: f.data_type().to_string(),
                nullable: f.is_nullable(),
            })
            .collect(),
        ordering: "identity-ascending",
        format: format_declaration(),
        style_hash: style.style_hash().to_string(),
    })
}

#[allow(clippy::too_many_arguments)]
fn build_manifest(
    ds: &Dataset,
    logical_uri: &str,
    pin: &spatial_engine::ContentPin,
    style: &CompiledStyle,
    style_hash: &str,
    operation: Operation,
    operation_digest: &str,
    fields: &[arrow::datatypes::Field],
    bounds: Option<[f64; 4]>,
    rows: u64,
    partitions: Vec<Asset>,
    viewer: Vec<Asset>,
    license: License,
) -> Manifest {
    let identity = ds.identity();
    let crs = ds.crs();
    let source_hash = format!("sha256:{}", pin.hash());

    let bundle_ref = ResourceRef {
        logical_uri: format!("{logical_uri}/bundle"),
        content_hash: Known::Unknown(Unknown::new(
            "not-applicable",
            "a manifest cannot contain its own hash; this bundle's identity is the ordered \
             per-asset hash list under `data` and `viewer`, together with the style's",
        )),
        source_revision: Known::Unknown(Unknown::new(
            "none-pinned",
            "this bundle format carries no revision of itself; a republish is a new bundle",
        )),
        locators: vec![Locator { kind: "bundle-relative", at: ".".into() }],
        cache_status: "materialized",
        portability_policy: "self-contained",
    };

    let source_ref = ResourceRef {
        logical_uri: logical_uri.to_string(),
        content_hash: Known::Value(source_hash.clone()),
        source_revision: Known::Unknown(Unknown::new(
            "none-pinned",
            "this engine pins no file revision. The source content hash above is the only thing \
             tying this bundle's identity space to a byte sequence",
        )),
        locators: vec![Locator {
            kind: "bundle-local",
            at: format!("{}/", bundle::DATA_DIR),
        }],
        cache_status: "materialized-in-bundle",
        portability_policy: "self-contained",
    };

    let style_ref = ResourceRef {
        logical_uri: format!("{logical_uri}/style"),
        content_hash: Known::Value(style_hash.to_string()),
        source_revision: Known::Unknown(Unknown::new(
            "none-pinned",
            "the style is immutable text carried verbatim; its content hash is its identity",
        )),
        locators: vec![Locator { kind: "bundle-local", at: bundle::STYLE_PATH.into() }],
        cache_status: "materialized-in-bundle",
        portability_policy: "self-contained",
    };

    Manifest {
        bundle: bundle_ref,
        source: source_ref,
        style: style_ref,
        style_version: spatial_renderer::STYLE_VERSION,
        style_match_column: style.match_column().map(|s| s.to_string()),
        software: Software {
            engine: spatial_engine::CRATE_VERSION.to_string(),
            kernel: env!("CARGO_PKG_VERSION").to_string(),
            renderer: spatial_renderer::CRATE_VERSION.to_string(),
            arrow: spatial_engine::ARROW_CRATE_VERSION_REQUIREMENT.to_string(),
            duckdb: ds.duckdb_version().unwrap_or_else(|_| "unavailable".to_string()),
            bundle_writer: bundle::BUNDLE_VERSION,
        },
        operation,
        crs_source_identifier: crs.identifier().to_string(),
        // Verbatim, as a JSON **string**: the file's own definition travels unaltered (ADR-015 §1),
        // and embedding it as a nested object would need canonicalization of arbitrary JSON that
        // this format does not define.
        crs_source_definition: crs.definition_json().map(|s| s.to_string()),
        crs_display_identifier: crs.identifier().to_string(),
        crs_transform: "none — rendered in source CRS",
        crs_source_kind: crs.source().as_str().to_string(),
        axis_order: crs.axis_order().as_str().to_string(),
        axis_normalization: "none-performed".to_string(),
        id_source: identity.source().as_envelope_value(),
        id_uniqueness: identity.uniqueness().as_str().to_string(),
        id_verified_rows: identity.verified_rows(),
        id_js_exact: identity.js_exact(),
        identity_caveat: "uniqueness was verified over this file at open. Stability across reopen \
                          is NOT established: nothing here pins a source revision, so two files \
                          could present identical identities. The source content hash above is the \
                          only thing tying this identity space to a byte sequence"
            .to_string(),
        schema: columns(fields),
        bounds,
        bounds_basis: "computed-over-published-rows",
        rows,
        partitions,
        viewer,
        license,
        reproducibility: Reproducibility::snapshot(&source_hash, style_hash, operation_digest),
        source_verification: "content hash taken at publish start and compared with the pin; NOT \
                              re-hashed at finalize. A length and modification-time heuristic was \
                              re-checked at finalize as an operational fail-closed guard, and that \
                              heuristic is not a content hash"
            .to_string(),
    }
}

/// The staging directory, and the single rename that finalizes it.
struct Staging {
    path: PathBuf,
}

impl Staging {
    /// Create `<dest>.staging-<random hex>` beside the destination.
    ///
    /// **Beside**, so the rename is within one filesystem and is therefore atomic. **Random hex**
    /// rather than a pid: a crashed publish leaves the directory behind, and a pid in its name would
    /// be a machine identifier sitting on disk for free, when a random suffix costs nothing and
    /// removes the argument entirely.
    fn create(destination: &Path) -> Result<Self, PublishError> {
        let parent = destination.parent().unwrap_or_else(|| Path::new("."));
        if !parent.exists() {
            return Err(PublishError::DestinationNotWritable {
                path: parent.display().to_string(),
                raw_os_error: None,
                detail: "the destination's parent directory does not exist".into(),
            });
        }
        let name = destination
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_else(|| "bundle".into());
        let path = parent.join(format!(".{name}.staging-{}", random_suffix()));
        std::fs::create_dir(&path)
            .map_err(|e| error::classify_io(&path.display().to_string(), "creating the staging directory", e))?;
        Ok(Self { path })
    }

    fn path(&self) -> &Path {
        &self.path
    }

    fn create_dir(&self, rel: &str) -> Result<(), PublishError> {
        let target = self.path.join(rel);
        std::fs::create_dir_all(&target)
            .map_err(|e| error::classify_io(&target.display().to_string(), "creating a bundle directory", e))
    }

    /// Write one file and return its `sha256:` hash. The hash is taken over the **bytes written**,
    /// not over a buffer that was intended to be written.
    fn write(&self, rel: &str, bytes: &[u8]) -> Result<String, PublishError> {
        viewer_assets::validate_relative_path(rel)?;
        let target = self.path.join(rel);
        let display = target.display().to_string();
        let mut f = std::fs::File::create(&target)
            .map_err(|e| error::classify_io(&display, "creating a bundle file", e))?;
        f.write_all(bytes)
            .map_err(|e| error::classify_io(&display, "writing a bundle file", e))?;
        // Flushed and synced before it is hashed and listed: a manifest that lists a hash for bytes
        // still sitting in a buffer is describing something that may never reach the disk.
        f.flush().map_err(|e| error::classify_io(&display, "flushing a bundle file", e))?;
        f.sync_all().map_err(|e| error::classify_io(&display, "syncing a bundle file", e))?;
        Ok(canonical::sha256_hex(bytes))
    }

    fn total_bytes(&self) -> Result<u64, PublishError> {
        fn walk(dir: &Path, total: &mut u64) -> std::io::Result<()> {
            for entry in std::fs::read_dir(dir)? {
                let entry = entry?;
                let path = entry.path();
                if path.is_dir() {
                    walk(&path, total)?;
                } else {
                    *total += entry.metadata()?.len();
                }
            }
            Ok(())
        }
        let mut total = 0;
        walk(&self.path, &mut total).map_err(|e| PublishError::Io {
            context: "measuring the staged bundle".into(),
            raw_os_error: e.raw_os_error(),
            detail: e.to_string(),
        })?;
        Ok(total)
    }

    /// The single atomic step.
    ///
    /// **The pre-check in `publish` is not sufficient on its own and is not relied on alone.** It is
    /// a TOCTOU window, and on POSIX renaming a directory onto an existing *empty* directory
    /// succeeds — so the rename's own failure is the second line. The residual race is declared
    /// rather than closed: two concurrent publishes to one destination can still interleave, and
    /// nothing here serializes them.
    fn finalize(&self, destination: &Path) -> Result<(), PublishError> {
        if destination.exists() {
            return Err(PublishError::DestinationExists {
                path: destination.display().to_string(),
            });
        }
        std::fs::rename(&self.path, destination).map_err(|e| {
            error::classify_io(&destination.display().to_string(), "finalizing the bundle", e)
        })?;
        // The directory has moved; `remove` is a no-op from here because the staging path no longer
        // exists. That is deliberate rather than incidental: it means the caller's error path can
        // stay one shape — always attempt removal — without needing to know whether finalize ran.
        Ok(())
    }

    fn remove(&self) -> std::io::Result<()> {
        if self.path.exists() {
            std::fs::remove_dir_all(&self.path)?;
        }
        Ok(())
    }
}

impl Drop for Staging {
    /// Best-effort cleanup for the one path the explicit handling cannot reach: a **panic** inside
    /// the operation.
    ///
    /// The declared recovery policy is "fail visibly, remove the staging directory, terminate with a
    /// typed error", and every `Err` return already does that and reports the outcome. A panic
    /// returns no error to report, so without this a partial staging directory would survive with
    /// nothing said — which is the silent termination ADR-010 rule 7 forbids.
    ///
    /// It is deliberately quiet on success and deliberately does **not** panic on failure: a
    /// `Drop` that panics during unwinding aborts the process, replacing a diagnosable failure with
    /// one that has no message at all.
    fn drop(&mut self) {
        if !self.path.exists() {
            return;
        }
        if let Err(e) = std::fs::remove_dir_all(&self.path) {
            eprintln!(
                "[publish] the staging directory {} could not be removed: {e}",
                self.path.display()
            );
        }
    }
}

/// A random suffix for the staging directory name.
///
/// Not a pid, not a timestamp, not a counter — see [`Staging::create`]. Address-derived entropy is
/// deliberately mixed with the system clock so two publishes in the same millisecond in the same
/// process still differ.
fn random_suffix() -> String {
    use std::hash::{BuildHasher, Hasher};
    let mut h = std::collections::hash_map::RandomState::new().build_hasher();
    h.write_usize(&h as *const _ as usize);
    h.write_u128(
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_nanos())
            .unwrap_or(0),
    );
    format!("{:016x}", h.finish())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_dataset_name_that_could_carry_a_path_is_refused_rather_than_escaped() {
        for bad in ["../etc", "a/b", "a\\b", "C:", "", "a..b", "sp ace", "naïve"] {
            assert!(
                dataset_logical_uri(bad).is_err(),
                "`{bad}` must not become a logical URI"
            );
        }
        assert_eq!(dataset_logical_uri("parcels").unwrap(), "spatial://dataset/parcels");
        assert_eq!(dataset_logical_uri("parcels-2026_v1.2").unwrap(), "spatial://dataset/parcels-2026_v1.2");
    }

    #[test]
    fn two_staging_names_in_one_process_differ() {
        let a = random_suffix();
        let b = random_suffix();
        assert_ne!(a, b);
        assert_eq!(a.len(), 16);
        // No pid, no timestamp anyone can read back off the disk.
        assert!(a.chars().all(|c| c.is_ascii_hexdigit()));
    }

    #[test]
    fn a_source_and_an_operator_declaring_license_together_is_refused() {
        let source = spatial_engine::dataset::SourceLicense {
            license: Some("ODbL-1.0".into()),
            attribution: None,
            redistribution: None,
        };
        let op = OperatorLicense {
            license: "CC-BY-4.0".into(),
            attribution: None,
            redistribution: Redistribution::Permitted,
            by: "operator".into(),
            at: "2026-08-06T00:00:00Z".into(),
        };
        assert!(matches!(
            admit_license(&source, Some(&op)),
            Err(PublishError::LicenseDeclaredTwice { .. })
        ));
    }

    #[test]
    fn a_forbidden_redistribution_term_refuses_the_publish_from_either_side() {
        let source = spatial_engine::dataset::SourceLicense {
            license: Some("internal-only".into()),
            attribution: None,
            redistribution: Some("forbidden".into()),
        };
        assert!(matches!(
            admit_license(&source, None),
            Err(PublishError::LicenseNotCarryable { declared_by: "source", .. })
        ));

        let op = OperatorLicense {
            license: "internal-only".into(),
            attribution: None,
            redistribution: Redistribution::Forbidden,
            by: "operator".into(),
            at: "2026-08-06T00:00:00Z".into(),
        };
        assert!(matches!(
            admit_license(&Default::default(), Some(&op)),
            Err(PublishError::LicenseNotCarryable { declared_by: "operator", .. })
        ));
    }

    #[test]
    fn a_source_declaring_nothing_publishes_as_not_declared_and_invents_nothing() {
        let l = admit_license(&Default::default(), None).unwrap();
        assert_eq!(l, License::NotDeclared);
    }

    #[test]
    fn an_unrecognised_redistribution_word_is_unknown_and_never_assumed_permitted() {
        let source = spatial_engine::dataset::SourceLicense {
            license: Some("Some-License".into()),
            attribution: None,
            redistribution: Some("ask us first".into()),
        };
        let l = admit_license(&source, None).unwrap();
        let License::DeclaredBySource(terms) = &l else { panic!("got {l:?}") };
        assert_eq!(terms.redistribution, Redistribution::Unknown);
    }

    /// An operator who declares a blank license is refused, so ADR-017 §5's "non-empty string"
    /// under `declared-by-operator` holds for every caller and not only for the CLI.
    #[test]
    fn an_operator_declaring_a_blank_license_is_refused_rather_than_recorded() {
        for blank in ["", "   ", "\t\n"] {
            let op = OperatorLicense {
                license: blank.into(),
                attribution: Some("© Example Cadastre".into()),
                redistribution: Redistribution::Permitted,
                by: "operator".into(),
                at: "2026-08-06T00:00:00Z".into(),
            };
            assert!(
                matches!(
                    admit_license(&Default::default(), Some(&op)),
                    Err(PublishError::OperatorLicenseEmpty)
                ),
                "a license of {blank:?} was admitted"
            );
        }
        // …and a real one still is, so the check is not simply refusing every operator.
        let ok = OperatorLicense {
            license: "CC-BY-4.0".into(),
            attribution: None,
            redistribution: Redistribution::Permitted,
            by: "operator".into(),
            at: "2026-08-06T00:00:00Z".into(),
        };
        assert!(admit_license(&Default::default(), Some(&ok)).is_ok());
    }

    /// **A source that declares attribution and names no license.**
    ///
    /// The three source metadata keys are independent, so this is an ordinary shape rather than a
    /// corner: `declares_anything()` is true, `license` is not. It used to become the invented
    /// string `"(unnamed)"` in a manifest member whose contract is verbatim carriage; ADR-017
    /// Corrigendum 1 makes it `null` — the absence, not a value.
    ///
    /// It is deliberately **not** a refusal. Refusing would make a source that bothered to declare
    /// attribution unpublishable while a source declaring nothing publishes fine, destroying the
    /// attribution `docs/14` requires published bundles to preserve, in the name of protecting it.
    #[test]
    fn a_source_that_names_no_license_but_declares_attribution_carries_a_null_not_a_placeholder() {
        let source = spatial_engine::dataset::SourceLicense {
            license: None,
            attribution: Some("© Example Cadastre".into()),
            redistribution: Some("permitted".into()),
        };
        let l = admit_license(&source, None).unwrap();
        let License::DeclaredBySource(terms) = &l else {
            panic!("a source that declares attribution is `declared-by-source`, got {l:?}")
        };
        assert_eq!(terms.license, None, "a placeholder was substituted for an absent license");
        assert_eq!(terms.attribution.as_deref(), Some("© Example Cadastre"));
        assert_eq!(terms.redistribution, Redistribution::Permitted);
        // What this becomes in the manifest is asserted where the serializer lives
        // (`bundle::tests`) and against a real parquet footer in `kernel/tests/publish.rs`.

        // The same source declaring **only** redistribution — no license, no attribution — is the
        // other way into this arm, and behaves identically.
        let only_terms = spatial_engine::dataset::SourceLicense {
            license: None,
            attribution: None,
            redistribution: Some("permitted".into()),
        };
        let l = admit_license(&only_terms, None).unwrap();
        let License::DeclaredBySource(terms) = &l else { panic!("got {l:?}") };
        assert_eq!(terms.license, None);
        assert_eq!(terms.attribution, None);
    }
}
