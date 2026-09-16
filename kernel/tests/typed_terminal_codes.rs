// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The typed code survives the crossing into a string** — P3 gate attempt 1, blocking findings 1
//! and 5.
//!
//! Two surfaces stringify a typed refusal, and at attempt 1 both dropped the code on the way:
//!
//! - the **data-plane terminal** (`BatchSource::next_into` is typed `Result<_, String>`), so the
//!   shell's `liveTicketSet.ts` matched `"engine.source_changed"` against prose that never
//!   contained it and the invalidation path could not fire at all;
//! - the **publish surface** (`PrepareOutcome::Refused { message }`), so the shell's
//!   `formatPublishRefusal` had no code to parse.
//!
//! **The first test here drives the real product path end to end** — `SkpHost::viewport_query`
//! mints a ticket, `EngineSourceFactory::ticket_only` (what `frontends/shell/src-tauri` installs)
//! redeems it through `SourceFactory::create`, and the terminal is read off the `dyn BatchSource`
//! the data plane itself drains. That is the human's ruling of 2026-09-16 (round 4) applied to this
//! seam: a cross-module claim is proven from the real producer/consumer shape, never from an
//! imagined one. The unit tests below it pin the mapping the end-to-end test exercises.
//!
//! No duration, no rate and no performance word appears in this file (ADR-018; A6).

use std::path::{Path, PathBuf};
use std::sync::Arc;

use spatial_data_plane::transport::{OpenRequest, SourceFactory};
use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};
use spatial_engine::EngineError;
use spatial_kernel::publish::error::PublishError;
use spatial_kernel::skp::{error_of, terminal_detail_of, SkpHost, StreamRegistry};
use spatial_kernel::{Catalog, EngineSourceFactory, OPERATION};
use spatial_skp::v0::{DatasetHandle, ViewportQueryRequest, SKP_VERSION};

/// The code the shell's `liveTicketSet.ts` matches as a prefix. Spelled as a literal on both sides
/// deliberately — a shared constant would let the two agree while both being wrong, and the whole
/// point of this file is that the two ends are pinned independently against the same bytes.
const SOURCE_CHANGED_CODE: &str = "engine.source_changed";

fn fixture(name: &str) -> PathBuf {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/typed-terminals");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 200,
            avg_vertices: 12,
            identity: IdentityMode::NativeUnique,
            ..Default::default()
        },
    )
    .expect("write fixture");
    path
}

/// Move a file's modification time forward without touching a byte of it — one of the descriptor's
/// four components, and the only one a test can change while DuckDB is reading the file without
/// making DuckDB fail first on a truncated read.
fn touch_modification_time(path: &Path) {
    let later = std::time::SystemTime::now() + std::time::Duration::from_secs(120);
    std::fs::File::options()
        .write(true)
        .open(path)
        .expect("reopen to set mtime")
        .set_modified(later)
        .expect("set mtime");
}

/// **End to end, from the real producer to the real consumer shape.**
///
/// Nothing here is constructed by hand: the ticket comes from `SkpHost::viewport_query`, the source
/// comes from the `SourceFactory` the shell installs, and the terminal is whatever
/// `BatchSource::next_into` hands the data plane. If `EngineSource::next_into` stopped prefixing
/// the code, this fails — and so would the shell, which is the point.
///
/// Mutation: restore `Some(Err(e.to_string()))` in `kernel/src/lib.rs`'s `EngineSource::next_into`.
/// Expected failure: `the_data_plane_terminal_a_real_redeemed_stream_produces_carries_its_typed_code`
/// fails on the prefix assertion — exactly the defect that shipped at attempt 1, caught this time
/// from the shape the product actually produces.
#[test]
fn the_data_plane_terminal_a_real_redeemed_stream_produces_carries_its_typed_code() {
    let path = fixture("terminal-carries-code");
    let handle = DatasetHandle::mint();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(catalog.clone(), tickets.clone());

    let ticket = host
        .viewport_query(ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle,
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
        })
        .expect("viewport_query mints a ticket");

    // The source the data plane would get, built through the factory the shell installs.
    let factory = EngineSourceFactory::ticket_only(catalog, tickets);
    let (mut source, _cancel) = factory
        .create(&OpenRequest {
            operation: OPERATION.to_string(),
            params: ticket.stream.as_str().as_bytes().to_vec(),
        })
        .expect("the ticket redeems into a source");

    // Change the source under the open stream. The post-check finds it after the scan is drained
    // and the lease released, and the clean terminal becomes the typed refusal (§13 C rule (i)).
    touch_modification_time(&path);

    let mut buf = Vec::new();
    let mut terminal = None;
    while let Some(item) = source.next_into(&mut buf) {
        if let Err(detail) = item {
            terminal = Some(detail);
            break;
        }
    }

    let detail = terminal.expect("a changed source terminates this stream with a typed refusal");
    assert!(
        detail.starts_with(&format!("{SOURCE_CHANGED_CODE}: ")),
        "the terminal the data plane receives must open with the typed code — this is the exact \
         string `frontends/shell/src/streaming/liveTicketSet.ts` matches as a prefix: {detail}"
    );
    // The prose is carried whole behind the code; nothing is summarized away.
    assert!(detail.contains("does not establish snapshot consistency"), "{detail}");
}

/// Mutation: drop `terminal_detail_of` from `EngineSource::next_into`. Expected failure:
/// `a_data_plane_terminal_detail_begins_with_the_refusal_s_typed_code` fails, and with it the
/// shell's whole invalidation path.
#[test]
fn a_data_plane_terminal_detail_begins_with_the_refusal_s_typed_code() {
    let e = EngineError::SourceChanged {
        detail: "{size, mtime, footer-length, footer-hash}".to_string(),
    };
    let detail = terminal_detail_of(&e);

    // The exact shape the client matches on: `"<code>: "` as a PREFIX, never a substring search.
    assert!(
        detail.starts_with(&format!("{SOURCE_CHANGED_CODE}: ")),
        "the terminal detail must open with the typed code: {detail}"
    );
    // And the prose is still all there, unedited — the code is added, nothing is taken away. The
    // wording itself is the human's at P6, so nothing here asserts it verbatim; what is asserted is
    // that `Display`'s output is carried whole.
    assert!(detail.ends_with(&e.to_string()), "the refusal's own text is carried verbatim");

    // **The exact bytes the shell's own tests are written against.** `formatTerminalRefusal.test.ts`
    // and both streaming-manager test files use this literal; pinning it here means a change to the
    // code or to the `Display` text fails in the PRODUCER's suite first, instead of leaving the
    // consumers asserting against a shape that is no longer sent. Same discipline as the publish
    // seam below, and it retires the hand-transcribed terminal string those tests used to carry.
    assert_eq!(
        detail,
        "engine.source_changed: refused: the source file changed while it was open ({size, mtime, \
footer-length, footer-hash}). Everything read for this session is discarded and the identities it \
handed out no longer refer to anything; reopen the file to continue. This check does not establish \
snapshot consistency, cannot detect every in-place modification, and may detect a change during a \
query only after that query has finished reading"
    );

    // One source of codes: this is `error_of`'s table, not a second spelling beside it.
    assert_eq!(error_of(&e).code, SOURCE_CHANGED_CODE);
}

/// Every engine refusal gets the same treatment, not just the one the client acts on — so a future
/// client matching a different code finds it already there.
///
/// Mutation: special-case `terminal_detail_of` to prefix only `SourceChanged`. Expected failure:
/// `the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case` fails — a future
/// client matching a different code would find nothing to match.
#[test]
fn the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case() {
    for e in [
        EngineError::Cancelled,
        EngineError::IdentityOrdinalPartitionedUnsupported { detail: "a directory".into() },
        EngineError::InternalInconsistency { detail: "contradictory provenance".into() },
        EngineError::NoCoveringBbox { detail: "no covering".into() },
    ] {
        let detail = terminal_detail_of(&e);
        let code = error_of(&e).code;
        assert!(code.starts_with("engine."), "{code}");
        assert!(detail.starts_with(&format!("{code}: ")), "{detail}");
    }
}

/// The publish surface's half. `PublishError::code()` has no wildcard arm, so a new variant fails
/// the build until it is named; this asserts the two properties the shell's own parser depends on.
///
/// **The shell side is pinned against this exact shape** in
/// `frontends/shell/src/publish/formatPublishRefusal.test.ts`, whose input is this function's
/// output quoted verbatim rather than an invented string.
///
/// Mutation: change `frontends/shell/src-tauri/src/publish.rs`'s `e.refusal_detail()` back to
/// `e.to_string()`. Expected failure: `a_publish_refusal_detail_begins_with_its_typed_code` still
/// passes (it tests the kernel), but the shell's own `formatPublishRefusal` test fails — which is
/// why both ends are pinned and neither alone is trusted.
#[test]
fn a_publish_refusal_detail_begins_with_its_typed_code() {
    let e = PublishError::GeographicCrsNotPublishable {
        crs_identifier: "OGC:CRS84".to_string(),
        unit_source: "unit:format-rule".to_string(),
    };
    assert_eq!(e.code(), "publish.geographic_crs_not_publishable");
    let detail = e.refusal_detail();
    assert!(detail.starts_with("publish.geographic_crs_not_publishable: "), "{detail}");
    assert!(detail.ends_with(&e.to_string()), "the refusal's own text is carried verbatim");

    // **The exact bytes the shell's own test is written against.** `formatPublishRefusal.test.ts`'s
    // `REAL_KERNEL_REFUSAL` is this literal, captured from this function's output rather than
    // guessed at. Pinning it on both sides is what makes a transcription drift fail HERE, in the
    // producer's own suite, instead of silently leaving the consumer's test asserting against a
    // shape the producer no longer sends — the failure mode the human's ruling of 2026-09-16
    // (round 4) names.
    assert_eq!(
        detail,
        "publish.geographic_crs_not_publishable: refused: OGC:CRS84 is a geographic CRS whose \
         coordinates are in degrees (unit:format-rule), and the bundled viewer has no degrees path \
         — it renders in the dataset's own CRS, while this shell's degrees display is a view-time \
         convention a bundle does not carry. Publishing it would hand a recipient a bundle nothing \
         can render correctly. Reproject the source to a projected CRS and open that, or wait for \
         the reader change that adds the degrees path"
    );

    // Every publish code lives in the `publish.` namespace and is distinct from the `engine.` one,
    // so a single client-side dispatch over `code` cannot confuse the two surfaces.
    for other in [PublishError::RowFilterNotRecordable, PublishError::SourceNotPinned] {
        assert!(other.code().starts_with("publish."), "{}", other.code());
        assert_ne!(other.code(), e.code());
    }
}
