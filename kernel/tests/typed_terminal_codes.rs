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
use spatial_engine::{EngineError, WatchSignal};
use spatial_kernel::publish::error::PublishError;
use spatial_kernel::skp::{error_of, session_end_channel, terminal_detail_of, SkpHost, StreamRegistry};
use spatial_kernel::{Catalog, EngineSourceFactory, OPERATION};
use spatial_skp::v0::{DatasetHandle, OpenDatasetRequest, ViewportQueryRequest, SKP_VERSION};

mod injected_watch;
mod watch_support;

/// The code the shell's `liveTicketSet.ts` matches as a prefix. Spelled as a literal on both sides
/// deliberately — a shared constant would let the two agree while both being wrong, and the whole
/// point of this file is that the two ends are pinned independently against the same bytes.
const SOURCE_CHANGED_CODE: &str = "engine.source_changed";

/// The coverage-lost sibling of [`SOURCE_CHANGED_CODE`] — spelled as its own literal for the same
/// reason.
const SOURCE_COVERAGE_LOST_CODE: &str = "engine.source_coverage_lost";

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
    let host = SkpHost::new(catalog.clone(), tickets.clone(), watch_support::no_watch_arm(), session_end_channel().0);

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
    let factory = EngineSourceFactory::ticket_only(catalog, tickets, host.generations());
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
    //
    // **Re-pinned on the human's ruling of 2026-09-16 (round 7)**: the engine's text states the
    // engine's fact only — what differed, and what the check does not establish — and carries no
    // consequence sentence and no guidance. Those belong to the owner that performs them (P3b).
    assert_eq!(
        detail,
        "engine.source_changed: refused: the source file changed while it was open ({size, mtime, \
footer-length, footer-hash}). This check does not establish snapshot consistency, cannot detect \
every in-place modification, and may detect a change during a query only after that query has \
finished reading"
    );

    // **No consequence and no guidance in the ENGINE's words** (the same ruling). The owner's
    // sentence is `refusalGuidance("engine.source_changed")`, asserted in
    // `frontends/shell/src/admission/formatRefusal.test.ts`; nothing the engine emits may duplicate
    // it or contradict it.
    for forbidden in ["discard", "no longer refer", "reopen the file"] {
        assert!(
            !detail.contains(forbidden),
            "the engine states its own fact only; `{forbidden}` is a consequence or a guidance: \
             {detail}"
        );
    }

    // One source of codes: this is `error_of`'s table, not a second spelling beside it.
    assert_eq!(error_of(&e).code, SOURCE_CHANGED_CODE);
}

/// Architect gate-1 B1 (fix-list item 5): `frontends/shell/src/testUtils/terminalShapes.ts`'s
/// `REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL` claimed a pin here that did not exist — this file had
/// no match for `coverage` at all. Same shape as
/// `a_data_plane_terminal_detail_begins_with_the_refusal_s_typed_code` above, for
/// `EngineError::SourceCoverageLost`.
///
/// **The exact bytes the shell's own tests are written against**:
/// `REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL` in `frontends/shell/src/testUtils/terminalShapes.ts`.
///
/// Mutation: drop the `[P6 placeholder]` mark from `EngineError::SourceCoverageLost`'s `Display`
/// (`engine/src/error.rs`). Applied, run and reverted on this branch: `assertion `left == right`
/// failed`, `left: "engine.source_coverage_lost: refused: the advisory watch on this source lost
/// coverage (overflow). ..."`, `right: "engine.source_coverage_lost: [P6 placeholder] refused: ..."`
/// — 1 failed.
#[test]
fn a_coverage_lost_terminal_detail_carries_its_typed_code_and_exact_text() {
    let e = EngineError::SourceCoverageLost { detail: "overflow".to_string() };
    let detail = terminal_detail_of(&e);

    assert!(
        detail.starts_with(&format!("{SOURCE_COVERAGE_LOST_CODE}: ")),
        "the terminal detail must open with the typed code: {detail}"
    );
    assert!(detail.ends_with(&e.to_string()), "the refusal's own text is carried verbatim");

    assert_eq!(
        detail,
        "engine.source_coverage_lost: [P6 placeholder] refused: the advisory watch on this source \
         lost coverage (overflow). This is not a statement that the file changed — the OS \
         notification stream this session was relying on stopped reporting, and this check cannot \
         see whether the file changed while it was not"
    );

    // Never a claim the file changed: the operator-visible-text rule (round 7), same discipline as
    // the source-changed pin above.
    for forbidden in ["discard", "no longer refer", "reopen the file"] {
        assert!(!detail.contains(forbidden), "{forbidden}: {detail}");
    }

    // One source of codes: this is `error_of`'s table, not a second spelling beside it.
    assert_eq!(error_of(&e).code, SOURCE_COVERAGE_LOST_CODE);
}

/// Architect gate-1 B1, the pre-check half: `liveTicketSet.ts::refusalDetailOf` builds
/// `"<code>: <message>"` for a coverage-lost pre-check refusal, and
/// `REAL_SOURCE_COVERAGE_LOST_PRE_CHECK_REFUSAL_DETAIL` (`terminalShapes.ts`) claimed a pin for that
/// exact shape that did not exist either. Driven through a real `SkpHost`, an injected watch
/// (`injected_watch::InjectedArm`, per `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2a's "no
/// constructor exists for tests only") and a signal fired **after** admission — `SkpHost::
/// open_dataset`'s sink's own `Admitted` arm — never a signal recorded before admission, which
/// takes a different path (`SOURCE_CHANGED_CODE` above's sibling refusal).
///
/// **The exact bytes the shell's own tests are written against**:
/// `REAL_SOURCE_COVERAGE_LOST_PRE_CHECK_REFUSAL_DETAIL` in
/// `frontends/shell/src/testUtils/terminalShapes.ts`.
///
/// Mutation: in `SkpHost::viewport_query`'s `live_or_mint` error arm, map every reason
/// (`SessionEndReason::CoverageLost` included) to `EngineError::SourceChanged` (block-on-sight 3's
/// own violation). Applied, run and reverted on this branch: `assertion `left == right` failed:
/// refused: the source file changed while it was open (...)`, `left: "engine.source_changed"`,
/// `right: "engine.source_coverage_lost"` — 1 failed.
#[test]
fn a_coverage_lost_pre_check_refusal_carries_its_typed_code_and_exact_text() {
    let path = fixture("coverage-lost-pre-check");
    let arm = injected_watch::InjectedArm::new();
    let host =
        SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), arm.clone(), session_end_channel().0);

    let open = host
        .open_dataset(OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: path.display().to_string(),
            cancel_key: "coverage-lost-pre-check".to_string(),
            crs_assertion: None,
            identity: None,
        })
        .expect("open");

    // A coverage loss AFTER admission: the sink's own `Admitted` arm ends the generation with
    // `SessionEndReason::CoverageLost` (`SOURCE-WATCHER-PREREGISTRATION.md` §2b).
    arm.signal(&path, WatchSignal::CoverageLost { cause: "overflow".to_string() });

    let refused = host
        .viewport_query(ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: open.dataset,
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
        })
        .expect_err("a coverage-lost generation refuses the pre-check");
    assert_eq!(refused.code, SOURCE_COVERAGE_LOST_CODE, "{}", refused.message);

    let detail = format!("{}: {}", refused.code, refused.message);
    assert_eq!(
        detail,
        "engine.source_coverage_lost: [P6 placeholder] refused: the advisory watch on this source \
         lost coverage ({[P6 placeholder] this dataset's session ended when the advisory watch on \
         its source lost coverage}). This is not a statement that the file changed — the OS \
         notification stream this session was relying on stopped reporting, and this check cannot \
         see whether the file changed while it was not"
    );
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
