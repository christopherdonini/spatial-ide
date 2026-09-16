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
//! - the **publish surface** (`PrepareOutcome::Refused { message }`), so
//!   `formatRefusal.ts`'s `publish.geographic_crs_not_publishable` case was unreachable.
//!
//! This file pins the **producing** end of both. The consuming end is pinned on the TypeScript side
//! against these same shapes (`liveTicketSet.test.ts`, `formatRefusal.test.ts`), built from what is
//! asserted here rather than invented — which is what attempt 1's TS test did.
//!
//! No duration, no rate and no performance word appears in this file (ADR-018; A6).

use spatial_engine::EngineError;
use spatial_kernel::publish::error::PublishError;
use spatial_kernel::skp::{error_of, terminal_detail_of, SOURCE_CHANGED_CODE};

/// Mutation recorded in-source: restoring `Some(Err(e.to_string()))` in
/// `kernel/src/lib.rs::EngineSource::next_into` — i.e. dropping `terminal_detail_of` — fails the
/// prefix assertion below, and with it the shell's whole invalidation path.
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

    // One source of codes: this is `error_of`'s table, not a second spelling beside it.
    assert_eq!(error_of(&e).code, SOURCE_CHANGED_CODE);
}

/// Every engine refusal gets the same treatment, not just the one the client acts on — so a future
/// client matching a different code finds it already there.
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

/// The publish surface's half — item 5. `PublishError::code()` has no wildcard arm, so a new
/// variant fails the build until it is named; this asserts the two properties a client depends on.
///
/// Mutation recorded in-source: changing `frontends/shell/src-tauri/src/publish.rs`'s
/// `e.refusal_detail()` back to `e.to_string()` makes the shell's `publish.*` guidance cases
/// unreachable again — asserted on the TypeScript side against this shape.
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

    // Every publish code lives in the `publish.` namespace and is distinct from the `engine.` one,
    // so a single client-side dispatch over `code` cannot confuse the two surfaces.
    for other in [PublishError::RowFilterNotRecordable, PublishError::SourceNotPinned] {
        assert!(other.code().starts_with("publish."), "{}", other.code());
        assert_ne!(other.code(), e.code());
    }
}
