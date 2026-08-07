// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **A strict reader for a published bundle** — ADR-017 §14's contract, on the command line.
//!
//! ```text
//! cargo run --release -p spatial-kernel --example verify-bundle -- \
//!     --bundle <dir> [--json <out.json>] [--quiet]
//! ```
//!
//! ## Why this is an `example` and not `src/bin/`
//!
//! ADR-017 §14 specifies what *a* conforming reader must do, and names the shipped one as the
//! browser viewer (`renderer/bundle-viewer/`). **Nobody has decided to ship a CLI verifier.**
//! Putting one in `src/bin/` would be that decision, made by an instrument — so this follows
//! `engine/examples/make-fixture.rs`'s stated precedent verbatim: *"an example rather than a binary
//! so it cannot end up in the shipped surface by accident."*
//!
//! It exists because the 5 GB scale pass needs a reader that can verify a bundle **the reference
//! viewer is specified to refuse**: ADR-017 §16's reader ceilings are 2 000 000 features and
//! 512 MiB resident, and a 5 GB source produces neither. That is not a defect in the viewer; it is
//! the viewer's declared, correct behaviour, and it is why the browser is excluded from that pass.
//!
//! ## What it verifies — ADR-017 §14's "must verify", transcribed
//!
//! - the manifest parses and its `bundle_version` is implemented;
//! - every asset path is bundle-relative: no `..`, no drive letter, no leading `/`, no backslash;
//! - the style's content hash and `style_version`;
//! - every viewer asset's byte count and content hash;
//! - **per partition**: byte count · content hash · Arrow IPC decode · row count · the ADR-010
//!   rule 1 envelope's `frame` · `crs` against the manifest's · `axis_order` · `geometry_encoding` ·
//!   the declared `attribute_columns` · and the presence of every declared attribute column.
//!
//! Two aggregate checks that only matter at scale are added, and are marked as this reader's own
//! rather than §14's: summed partition rows equal the manifest's `rows`, and partition file names
//! are contiguous zero-padded five-digit from `00000` (ADR-017 §1's fixed width).
//!
//! ## What it must not claim to verify — §14's own list, plus three of this reader's
//!
//! §14: **the identity facts** (carried, displayed, never re-checked), **Arrow types beyond column
//! names**, and **its own executing code**. This reader adds: it does not verify `build-info.json`
//! (not hash-listed, excluded from every hash — ADR-017 §12); it does not verify the source
//! parquet; and it makes **no geometric-correctness claim**, having no GEOS or PostGIS oracle
//! (`docs/08`, test-oracle separation).
//!
//! ## Streaming, because the thing it verifies does not fit in memory
//!
//! Each partition is read **once**, hashed and decoded from that same buffer, and dropped before
//! the next. A verifier that held a 5.7 GB bundle to check it would be unable to check the bundles
//! it exists for -- and one that read every partition twice, once to hash and once to decode, would
//! do ~11.5 GB of IO to verify 5.74 GB. Both were true of earlier drafts of this file.

use std::collections::BTreeSet;
use std::path::{Path, PathBuf};

use spatial_renderer::canonical::sha256_hex;

/// Every failure this reader can report, using ADR-017 §14's **named states** verbatim where one
/// applies — so a failure here and a failure in the browser viewer are the same word.
#[derive(Debug)]
struct Failure {
    state: &'static str,
    detail: String,
}

fn fail(state: &'static str, detail: impl Into<String>) -> Failure {
    Failure { state, detail: detail.into() }
}

fn main() -> std::process::ExitCode {
    let mut bundle: Option<PathBuf> = None;
    let mut json_out: Option<PathBuf> = None;
    let mut quiet = false;

    let mut args = std::env::args().skip(1);
    while let Some(a) = args.next() {
        match a.as_str() {
            "--bundle" => bundle = args.next().map(PathBuf::from),
            "--json" => json_out = args.next().map(PathBuf::from),
            "--quiet" => quiet = true,
            other => {
                eprintln!("unknown argument `{other}`");
                return std::process::ExitCode::FAILURE;
            }
        }
    }
    let Some(bundle) = bundle else {
        eprintln!("--bundle <dir> is required");
        return std::process::ExitCode::FAILURE;
    };

    let started = std::time::Instant::now();
    let outcome = verify(&bundle, quiet);
    let elapsed_ms = started.elapsed().as_secs_f64() * 1000.0;

    let (ok, summary) = match &outcome {
        Ok(s) => (true, s.clone()),
        Err(f) => {
            eprintln!("[verify] FAILED {}: {}", f.state, f.detail);
            (false, Summary { state: f.state, detail: f.detail.clone(), ..Default::default() })
        }
    };

    if !quiet {
        println!("bundle            {}", bundle.display());
        println!("verified          {ok}");
        println!("partitions        {}", summary.partitions);
        println!("rows              {}", summary.rows);
        println!("partition bytes   {}", summary.partition_bytes);
        println!("viewer assets     {}", summary.viewer_assets);
        println!("manifest sha256   {}", summary.manifest_hash);
        // Wall time and bytes side by side, deliberately not divided — this repository makes no
        // throughput claim anywhere.
        println!("wall ms           {elapsed_ms:.1}");
    }

    if let Some(path) = json_out {
        let json = format!(
            r#"{{"verified":{ok},"state":{:?},"detail":{:?},"partitions":{},"rows":{},"partition_bytes":{},"viewer_assets":{},"manifest_sha256":{:?},"wall_ms":{elapsed_ms:.3}}}"#,
            summary.state,
            summary.detail,
            summary.partitions,
            summary.rows,
            summary.partition_bytes,
            summary.viewer_assets,
            summary.manifest_hash,
        );
        if let Err(e) = std::fs::write(&path, json) {
            eprintln!("[verify] the summary could not be written to {}: {e}", path.display());
            return std::process::ExitCode::FAILURE;
        }
    }

    if ok { std::process::ExitCode::SUCCESS } else { std::process::ExitCode::FAILURE }
}

#[derive(Clone, Default)]
struct Summary {
    state: &'static str,
    detail: String,
    partitions: usize,
    rows: u64,
    partition_bytes: u64,
    viewer_assets: usize,
    manifest_hash: String,
}

fn verify(bundle: &Path, quiet: bool) -> Result<Summary, Failure> {
    // ---- manifest ------------------------------------------------------------------------------
    let manifest_path = bundle.join(spatial_kernel::bundle::MANIFEST_PATH);
    let manifest_bytes = std::fs::read(&manifest_path)
        .map_err(|e| fail("manifest-unreachable", format!("{}: {e}", manifest_path.display())))?;
    let manifest_hash = sha256_hex(&manifest_bytes);
    let m: serde_json::Value = serde_json::from_slice(&manifest_bytes)
        .map_err(|e| fail("manifest-unparseable", e.to_string()))?;

    let version = m["bundle_version"]
        .as_i64()
        .ok_or_else(|| fail("manifest-schema-invalid", "bundle_version is not an integer"))?;
    if version != spatial_kernel::bundle::BUNDLE_VERSION {
        return Err(fail(
            "manifest-unsupported-version",
            format!("bundle_version {version}; this reader implements {}", spatial_kernel::bundle::BUNDLE_VERSION),
        ));
    }

    // ---- style ---------------------------------------------------------------------------------
    //
    // `style` is an object carrying a `docs/11` ResourceRef under `resource`, not a bare ref — so
    // the hash is at `style.resource.content_hash`. A `Known::Value` serializes as a bare string;
    // an unknown one would be an object, and `as_str` correctly refuses that rather than
    // stringifying a state.
    let style_path = bundle.join(spatial_kernel::bundle::STYLE_PATH);
    let style_bytes = std::fs::read(&style_path)
        .map_err(|e| fail("asset-missing", format!("{}: {e}", style_path.display())))?;
    let declared_style_hash = m["style"]["resource"]["content_hash"]
        .as_str()
        .ok_or_else(|| fail("manifest-schema-invalid", "style.resource.content_hash is absent"))?;
    if sha256_hex(&style_bytes) != declared_style_hash {
        return Err(fail("asset-hash-mismatch", "style.json"));
    }
    let style: serde_json::Value = serde_json::from_slice(&style_bytes)
        .map_err(|e| fail("style-unparseable", e.to_string()))?;
    let declared_style_version = m["style"]["style_version"].as_i64().unwrap_or(-1);
    if style["style_version"].as_i64() != Some(declared_style_version) {
        return Err(fail(
            "style-unsupported-version",
            format!(
                "the style declares {:?}, the manifest declares {declared_style_version}",
                style["style_version"]
            ),
        ));
    }

    // ---- viewer assets --------------------------------------------------------------------------
    let viewer = m["viewer"]
        .as_array()
        .ok_or_else(|| fail("manifest-schema-invalid", "viewer is not an array"))?;
    for asset in viewer {
        // A viewer asset with a wrong byte count is not a *partition* mismatch.
        verify_listed_asset(bundle, asset, "asset-hash-mismatch")?;
    }

    // ---- partitions ------------------------------------------------------------------------------
    let manifest_crs = m["crs"]["source"]
        .as_str()
        .ok_or_else(|| fail("manifest-schema-invalid", "crs.source is absent"))?
        .to_string();
    // Nested under `crs`, with the rest of the coordinate-space record — not top-level.
    // Fails closed: a manifest with no axis_order would otherwise skip §14's axis-order check.
    let manifest_axis = m["crs"]["axis_order"]
        .as_str()
        .ok_or_else(|| fail("manifest-schema-invalid", "crs.axis_order is absent"))?
        .to_string();
    let declared_attributes: Vec<String> = m["schema"]
        .as_array()
        .map(|cols| {
            cols.iter()
                .filter_map(|c| c["name"].as_str())
                .filter(|n| *n != "id" && *n != "geometry")
                .map(str::to_string)
                .collect()
        })
        .unwrap_or_default();

    // Under `data`, beside the row count and the format declaration they describe.
    let partitions = m["data"]["partitions"]
        .as_array()
        .ok_or_else(|| fail("manifest-schema-invalid", "data.partitions is not an array"))?;

    let mut rows_total: u64 = 0;
    let mut bytes_total: u64 = 0;
    let mut names = BTreeSet::new();

    for (i, asset) in partitions.iter().enumerate() {
        // **Read once, then hash and decode from the same buffer.**
        //
        // An earlier draft called `verify_listed_asset` here, which reads the file to hash it, and
        // then read it a *second* time to decode — ~11.5 GB of IO to verify a 5.74 GB bundle, while
        // two comments claimed it read once. At 6 633 partitions that is not a rounding error, and
        // `strict_reader.wall_ms` would have described roughly double the necessary work.
        let rel = admit_asset_path(asset)?;
        names.insert(rel.clone());

        let declared_rows = asset["rows"]
            .as_u64()
            .ok_or_else(|| fail("manifest-schema-invalid", format!("{rel}: rows is absent")))?;
        let bytes = asset["bytes"].as_u64().unwrap_or(0);

        let payload = std::fs::read(bundle.join(&rel))
            .map_err(|e| fail("asset-missing", format!("{rel}: {e}")))?;
        check_bytes_and_hash(&rel, &payload, asset, "partition-byte-count-mismatch")?;
        verify_partition(
            &rel,
            &payload,
            declared_rows,
            &manifest_crs,
            &manifest_axis,
            &declared_attributes,
        )?;

        rows_total += declared_rows;
        bytes_total += bytes;

        if !quiet && (i % 500 == 0 || i + 1 == partitions.len()) {
            eprintln!("[verify] partition {}/{} verified", i + 1, partitions.len());
        }
    }

    // ---- this reader's own aggregate checks, marked as such ---------------------------------------
    let declared_rows = m["data"]["rows"].as_u64().unwrap_or(u64::MAX);
    if rows_total != declared_rows {
        return Err(fail(
            "partition-row-count-mismatch",
            format!("partitions sum to {rows_total} rows; the manifest declares {declared_rows}"),
        ));
    }
    for i in 0..partitions.len() {
        let expected = spatial_kernel::bundle::partition_path(i);
        if !names.contains(&expected) {
            return Err(fail(
                "asset-missing",
                format!("partition names are not contiguous from 00000: `{expected}` is absent"),
            ));
        }
    }

    Ok(Summary {
        state: "verified",
        detail: String::new(),
        partitions: partitions.len(),
        rows: rows_total,
        partition_bytes: bytes_total,
        viewer_assets: viewer.len(),
        manifest_hash,
    })
}

/// Path safety, byte count and content hash for one listed asset — reading it once.
///
/// Used for viewer assets. Partitions go through [`admit_asset_path`] + [`check_bytes_and_hash`]
/// directly, so the bytes they decode are the same bytes that were hashed.
fn verify_listed_asset(
    bundle: &Path,
    asset: &serde_json::Value,
    mismatch_state: &'static str,
) -> Result<String, Failure> {
    let rel = admit_asset_path(asset)?;
    let payload = std::fs::read(bundle.join(&rel))
        .map_err(|e| fail("asset-missing", format!("{rel}: {e}")))?;
    check_bytes_and_hash(&rel, &payload, asset, mismatch_state)?;
    Ok(rel)
}

/// ADR-017 §14's path rule, on its own so a caller that reads the file itself can still apply it.
fn admit_asset_path(asset: &serde_json::Value) -> Result<String, Failure> {
    let rel = asset["path"]
        .as_str()
        .ok_or_else(|| fail("manifest-schema-invalid", "an asset has no path"))?
        .to_string();

    // ADR-017 §14: bundle-relative, no `..`, no drive letter, no leading `/`. Three additions
    // beyond §14's literal list, each closing a real hole on Windows:
    //
    //   - **backslash** is a separator there, so admitting it would make one manifest mean two
    //     different things on two platforms;
    //   - **a colon anywhere**, not only at index 1 — `data/part-00000.arrows:stream` names an NTFS
    //     alternate data stream, which is a different byte sequence from the file it appears to be;
    //   - **a `.` component**, which is redundant at best and a normalization difference at worst.
    let bad = rel.is_empty()
        || rel.starts_with('/')
        || rel.contains('\\')
        || rel.contains(':')
        || rel.split('/').any(|c| c == ".." || c == "." || c.is_empty());
    if bad {
        return Err(fail("manifest-schema-invalid", format!("unsafe asset path `{rel}`")));
    }
    Ok(rel)
}

/// Byte count and content hash, over bytes the caller has already read.
///
/// **Fails closed on an absent `bytes` member.** The earlier version skipped the byte-count check
/// when the manifest omitted it, which turns a malformed manifest into a passing verification —
/// exactly backwards for a reader whose job is to refuse.
///
/// `mismatch_state` lets the caller name the right ADR-017 §14 state: a *viewer* asset with a wrong
/// byte count is not a `partition-byte-count-mismatch`, and failing for the wrong reason is what
/// this reader's own test suite exists to prevent.
fn check_bytes_and_hash(
    rel: &str,
    payload: &[u8],
    asset: &serde_json::Value,
    mismatch_state: &'static str,
) -> Result<(), Failure> {
    let declared_bytes = asset["bytes"].as_u64().ok_or_else(|| {
        fail("manifest-schema-invalid", format!("{rel}: bytes is absent"))
    })?;
    if payload.len() as u64 != declared_bytes {
        return Err(fail(
            mismatch_state,
            format!("{rel}: {} bytes on disk, {declared_bytes} declared", payload.len()),
        ));
    }
    let declared_hash = asset["content_hash"]
        .as_str()
        .ok_or_else(|| fail("manifest-schema-invalid", format!("{rel}: content_hash is absent")))?;
    if sha256_hex(payload) != declared_hash {
        return Err(fail("asset-hash-mismatch", rel.to_string()));
    }
    Ok(())
}

/// Decode one partition and check everything ADR-017 §14 requires of it.
fn verify_partition(
    rel: &str,
    payload: &[u8],
    declared_rows: u64,
    manifest_crs: &str,
    manifest_axis: &str,
    declared_attributes: &[String],
) -> Result<(), Failure> {
    let mut reader = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(payload), None)
        .map_err(|e| fail("partition-decode-failed", format!("{rel}: {e}")))?;

    let schema = reader.schema();
    let md = schema.metadata();

    let get = |k: &str| md.get(k).map(String::as_str).unwrap_or_default();

    // ADR-010 rule 1: the buffer says what space it is in.
    if get("frame") != "authoritative-project-crs" {
        return Err(fail("envelope-frame-mismatch", format!("{rel}: frame `{}`", get("frame"))));
    }
    if get("crs") != manifest_crs {
        return Err(fail(
            "envelope-crs-mismatch",
            format!("{rel}: envelope `{}`, manifest `{manifest_crs}`", get("crs")),
        ));
    }
    if get("axis_order") != manifest_axis {
        return Err(fail(
            "envelope-axis-order-mismatch",
            format!("{rel}: envelope `{}`, manifest `{manifest_axis}`", get("axis_order")),
        ));
    }
    if !get("geometry_encoding").starts_with("geoarrow.") {
        return Err(fail(
            "envelope-encoding-mismatch",
            format!("{rel}: geometry_encoding `{}`", get("geometry_encoding")),
        ));
    }

    // The declared projection, and that every declared column is actually present. **Names only** —
    // §14 forbids claiming to verify Arrow types beyond column names, and this reader does not.
    // Fails closed:  turned an unparseable list into , which passes
    // whenever the manifest declares no attributes -- exactly this pass's configuration.
    let declared: Vec<String> = serde_json::from_str(get("attribute_columns")).map_err(|e| {
        fail("envelope-attributes-mismatch", format!("{rel}: attribute_columns is unparseable: {e}"))
    })?;
    if declared != declared_attributes {
        return Err(fail(
            "envelope-attributes-mismatch",
            format!("{rel}: envelope {declared:?}, manifest {declared_attributes:?}"),
        ));
    }
    for name in declared_attributes {
        if schema.field_with_name(name).is_err() {
            return Err(fail(
                "attribute-schema-mismatch",
                format!("{rel}: declared column `{name}` is absent from the batch"),
            ));
        }
    }

    let mut rows: u64 = 0;
    for batch in reader.by_ref() {
        let batch = batch.map_err(|e| fail("partition-decode-failed", format!("{rel}: {e}")))?;
        rows += batch.num_rows() as u64;
    }
    if rows != declared_rows {
        return Err(fail(
            "partition-row-count-mismatch",
            format!("{rel}: decoded {rows} rows, manifest declares {declared_rows}"),
        ));
    }
    Ok(())
}
