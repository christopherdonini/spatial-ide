// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The shell's publish seam** — binding-local, never SKP (`NEXT-CUT.md`'s Design section;
//! `protocol/skp/SKP-V0.md` §4 items 1/3/11/13; `kernel/PERMISSION-BOUNDARY.md` point 5; the
//! `binding_pick_file` precedent). Two Tauri commands drive one gated operation, reusing
//! `spatial_kernel::permission::boundary` in-process — the exact machinery `publish-bundle` drives,
//! never a second policy.
//!
//! ## The split, and why it is the anti-theater property (`NEXT-CUT.md`, binding, near-verbatim)
//!
//! - `binding_publish_prepare` opens the **native** OS destination picker (the destination never
//!   crosses from JS), runs [`spatial_kernel::publish::preflight`] (pure — this is where P0's
//!   row-filter refusal fires), mints a [`PublishGrant`] from facts the host holds (the dataset's
//!   own `ContentPin`, never the request), composes a host-rendered prompt, and stashes a
//!   **single-use, TTL-bounded** pending attempt keyed by a host-minted opaque id.
//! - `binding_publish_execute` takes the pending attempt (single-use — a second call on the same id
//!   always misses), opens a **fresh** [`AuditLog`] for this attempt alone (F-9: the shell never
//!   holds a log across attempts), and runs `permission::boundary::execute` with a [`ShellApproval`]
//!   that already holds the operator's typed phrase (F-6: never blocks — the wait happened in the
//!   DOM, before this command ever runs).
//!
//! `spatial_kernel::publish::publish_unguarded` is never referenced from this crate;
//! `tests/sole_caller_scan.rs` asserts that with a source scan, mirroring
//! `kernel/tests/permission_boundary.rs`'s own structural property one crate up.
//!
//! ## Two things this module deliberately does NOT do (later pieces, `NEXT-CUT.md`'s phase table)
//!
//! - **Typed-refusal structure** (`RefusalBlock`/`formatRefusal`) is P2's. A refusal crosses to JS
//!   here as plain `Display` text (`{ status: "refused", message: "..." }`).
//! - **Progress and cancel events** are P2's (a Tauri event + `CancelToken`, instrument surface, not
//!   SKP). [`execute`] runs with `None` progress on a token nothing outside the call can reach.
//!
//! ## The scope parameter is not the query parameter, and the distinction is load-bearing
//!
//! [`PublishScope`] carries only what the grant's own facts do not: whether this publish streams the
//! whole file or the current viewport, and — for the bbox case — the extent. That extent is a
//! **query** parameter (which rows to stream); it never becomes part of [`SourceScope`] or
//! [`DestinationScope`], which come from the dataset's own `ContentPin` and the native picker's
//! answer respectively, never from JS.

use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};
use spatial_kernel::permission::audit::{rfc3339_utc_now, ApprovalRoute};
use spatial_kernel::permission::{
    self, boundary, Approval, ApprovalPrompt, ApprovalSource, AuditLog, BoundaryError,
    DestinationScope, GrantSet, OperationKind, PermissionError, Principal, PublishAttempt,
    PublishGrant, SourceScope,
};
use spatial_kernel::publish::{
    self, CorrespondingSource, CorrespondingSourceKind, OperatorLicense, PublishRequest,
    ViewerAssets, ViewerLicenseInput, OPERATION_CLASS, REVERSIBILITY_CLASS,
};

/// The declared bound on a **prepared** attempt's own lifecycle (ADR-010 rule 6: a ceiling with no
/// number is not declared). **Not** the grant's own 20-minute ceiling
/// (`spatial_kernel::permission::MAX_GRANT_LIFETIME`) — this bounds how long a pending attempt may
/// sit waiting for the operator's DOM confirmation before the host discards it. The grant minted
/// alongside it (see [`prepare_with_query`]) uses this same value as its own lifetime, so the two
/// expire together rather than one silently outliving the other.
pub const PENDING_ATTEMPT_TTL: Duration = Duration::from_secs(120);

/// The filter-scope sentence, from `NEXT-CUT.md`'s conditional block item 3 — **verbatim**, never
/// silently dropped when the shell's active SQL filter would have applied to this publish.
pub const FILTER_SCOPE_SENTENCE: &str = "this bundle format cannot record a row predicate (ADR-017 \
     §8, bundle_version 1); publishing publishes the viewport extent, not your filter";

// -------------------------------------------------------------------------------------------
// The scope parameter — the two §8 shapes, and nothing else
// -------------------------------------------------------------------------------------------

/// What rows this publish streams. **Exactly the two ADR-017 §8 shapes** — the conditional block's
/// point 2. The bbox here is a **query** parameter; see the module docs for why it never reaches
/// [`SourceScope`] or [`DestinationScope`].
#[derive(serde::Deserialize, Clone, Debug)]
#[serde(tag = "kind", rename_all = "kebab-case")]
pub enum PublishScope {
    WholeFile,
    ViewportBbox { bbox: JsBbox },
}

/// A viewport extent as JS sends it — plain `f64`, not SKP's `HexF64` wire encoding. This is a
/// binding-local command, not SKP (module docs), so ADR-004's determinism discipline for the
/// data-plane hot path does not apply here.
#[derive(serde::Deserialize, Clone, Copy, Debug)]
pub struct JsBbox {
    pub xmin: f64,
    pub ymin: f64,
    pub xmax: f64,
    pub ymax: f64,
}

impl PublishScope {
    fn to_query(&self) -> ViewportQuery {
        match self {
            Self::WholeFile => ViewportQuery::all(),
            Self::ViewportBbox { bbox } => ViewportQuery {
                bbox: Some(Bbox { xmin: bbox.xmin, ymin: bbox.ymin, xmax: bbox.xmax, ymax: bbox.ymax }),
                // No CRS assertion crosses from JS in this cut, on the same ground
                // `publish-bundle --bbox` declares: the shell performs no reprojection, so an
                // omitted `bbox_crs` states the coordinates are the dataset's own (ADR-015 §7.3).
                bbox_crs: None,
                limit: None,
                // **Never** the shell's active SQL filter. P0 (`publish::preflight`) refuses a
                // predicate-carrying query outright; this scope has no shape that could carry one.
                filter: None,
            },
        }
    }

    fn row_scope_sentence(&self) -> String {
        match self {
            Self::WholeFile => "row scope: the whole file — every row the dataset contains".to_string(),
            Self::ViewportBbox { bbox } => format!(
                "row scope: the current viewport extent only (xmin {}, ymin {}, xmax {}, ymax {}) \
                 — not the whole file",
                bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax
            ),
        }
    }
}

// -------------------------------------------------------------------------------------------
// ApprovalSource — F-6: never blocks, the wait happened in the DOM
// -------------------------------------------------------------------------------------------

/// **F-6: never blocks.** The wait for the operator's answer already happened in the DOM, before
/// `binding_publish_execute` is ever called; this only carries the already-typed phrase into the
/// one comparison (`permission::approval::check`), which stays in Rust so the DOM never
/// re-implements it (`NEXT-CUT.md`'s Approval design paragraph: "never re-implement the comparison
/// in JS").
pub struct ShellApproval(String);

impl ShellApproval {
    pub fn new(typed: impl Into<String>) -> Self {
        Self(typed.into())
    }
}

impl ApprovalSource for ShellApproval {
    fn respond(&self, _prompt: &ApprovalPrompt) -> Result<Approval, PermissionError> {
        Ok(Approval::new(self.0.clone()))
    }

    fn route(&self) -> ApprovalRoute {
        ApprovalRoute::ShellDialog
    }
}

// -------------------------------------------------------------------------------------------
// The pending-attempt store — single-use, TTL-bounded, host-keyed
// -------------------------------------------------------------------------------------------

struct PendingAttempt {
    dataset: Arc<Dataset>,
    dataset_name: String,
    query: ViewportQuery,
    /// Derived from the style document, never picked by an operator — see [`style_attributes`].
    /// `NEXT-CUT.md`'s non-goal is "attribute-projection **publishing UI**"; this is not one, and
    /// its absence would be a worse gap: publishing zero attributes while the active style names a
    /// match column produces `StyleError::MatchColumnNotPublished` on **every** non-literal style,
    /// which is not "no selection UI", it is the operation refusing to do what it was asked.
    attributes: Vec<String>,
    style_source: String,
    viewer: ViewerAssets,
    viewer_license: ViewerLicenseInput,
    /// Always `None` in this cut — an operator-declared license is not part of the shell's publish
    /// affordance (`NEXT-CUT.md` non-goals list attribute-projection and much else; license
    /// declaration UI is not named as in-scope either). Kept as a field, not hardcoded at the
    /// `PublishRequest` call site, so a later cut adding the UI is a data change, not a signature one.
    license: Option<OperatorLicense>,
    destination: PathBuf,
    started_at: String,
    principal: Principal,
    created_at: Instant,
}

/// The pending-attempt store (`NEXT-CUT.md` P1 item 3): **single-use, TTL-bounded, host-keyed**.
///
/// Lives in Tauri managed state and dies with the process — nothing here is persisted, matching the
/// grant it sits beside.
#[derive(Default)]
pub struct PendingAttempts {
    inner: Mutex<HashMap<String, PendingAttempt>>,
}

impl PendingAttempts {
    pub fn new() -> Self {
        Self::default()
    }

    fn insert(&self, id: String, attempt: PendingAttempt) {
        let mut g = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        // Opportunistic: an attempt nobody ever executes should not sit in memory for the rest of
        // the process's life. Not a background timer — the next `prepare` call pays this cost, and
        // it is cheap (a handful of entries, one duration comparison each).
        g.retain(|_, a| a.created_at.elapsed() <= PENDING_ATTEMPT_TTL);
        g.insert(id, attempt);
    }

    /// **Single-use.** Taken and removed together, so a second call with the same id always misses
    /// — there is no way to read a pending attempt without consuming it.
    fn take(&self, id: &str) -> Option<PendingAttempt> {
        let mut g = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        let attempt = g.remove(id)?;
        if attempt.created_at.elapsed() > PENDING_ATTEMPT_TTL {
            return None; // expired: already removed above, never returned to the caller
        }
        Some(attempt)
    }

    #[cfg(test)]
    fn len(&self) -> usize {
        self.inner.lock().unwrap_or_else(|e| e.into_inner()).len()
    }
}

/// 32 hex characters from the OS CSPRNG — the same source and the same reasoning
/// `protocol/data-plane/src/session.rs::mint_token` uses for its session token, at half the length:
/// this id is a **lookup key** into host-only memory, never a bearer credential presented over a
/// network, so 16 bytes of entropy is not undersized for "unguessable, unenumerable within one
/// process's lifetime".
fn mint_attempt_id() -> Result<String, String> {
    let mut bytes = [0u8; 16];
    getrandom::fill(&mut bytes).map_err(|e| format!("could not read the OS CSPRNG: {e}"))?;
    Ok(hex::encode(bytes))
}

// -------------------------------------------------------------------------------------------
// The prompt data JS renders — ApprovalPrompt's field set, plus the row-scope and filter-scope
// sentences (`NEXT-CUT.md`'s Approval design paragraph)
// -------------------------------------------------------------------------------------------

#[derive(serde::Serialize, Clone, Debug)]
pub struct PublishPromptData {
    pub operation: &'static str,
    pub class: u8,
    pub reversibility: &'static str,
    pub source_name: String,
    pub source_content_hash: String,
    pub style_hash: String,
    pub destination_display: String,
    pub confirmation_phrase: String,
    pub grantor: String,
    pub grant_remaining_s: u64,
    /// NEW relative to `ApprovalPrompt::render`'s field set: whole-file or viewport-bbox, in words.
    pub row_scope: String,
    /// NEW: present only when the shell's active filter would have applied to this publish — the
    /// [`FILTER_SCOPE_SENTENCE`], never silently dropped.
    pub filter_scope: Option<String>,
}

#[derive(serde::Serialize, Debug)]
#[serde(tag = "status", rename_all = "kebab-case")]
pub enum PrepareOutcome {
    Prompt { attempt_id: String, prompt: PublishPromptData },
    /// The operator dismissed the native picker. **Not an error** (`NEXT-CUT.md` P1 item 4) — no
    /// typed refusal, no grant minted, no pending attempt stashed: nothing was attempted.
    PickerCancelled,
    /// A typed refusal's `Display` text — `RowFilterNotRecordable` (P0) reaches JS through here,
    /// among every other `preflight`/grant-issuance refusal. Structure (`RefusalBlock`) is P2's.
    Refused { message: String },
}

#[derive(serde::Serialize, Debug)]
#[serde(tag = "status", rename_all = "kebab-case")]
pub enum ExecuteOutcome {
    Success {
        bundle_path: String,
        rows: u64,
        partitions: usize,
        total_bytes: u64,
        manifest_bytes: usize,
        style_hash: String,
        operation_digest: String,
        build_millis: f64,
    },
    /// The publish **succeeded** and a bundle exists on disk, but its outcome record could not be
    /// written (`BoundaryError::OutcomeNotAudited`). Reported distinctly from `Success` — the same
    /// posture `publish-bundle` takes (non-zero exit, bundle on disk): an unaudited class-3 side
    /// effect is not a success.
    SucceededUnaudited { bundle_path: String, detail: String },
    Refused { message: String },
    /// The attempt id names nothing the host still holds — already executed, expired, or never
    /// issued. Not `Refused`: nothing was authorized or denied, there was simply no pending attempt
    /// to act on.
    UnknownAttempt,
}

// -------------------------------------------------------------------------------------------
// prepare
// -------------------------------------------------------------------------------------------

/// Translate `scope` into a query and delegate to [`prepare_with_query`] — the seam a test can
/// bypass to construct a query [`prepare`] itself could never produce (see
/// `tests::a_row_predicate_refuses_through_prepare_with_the_p0_message`), proving the refusal is
/// `preflight`'s own, reached through this function's real code path, not a second check.
#[allow(clippy::too_many_arguments)]
pub fn prepare(
    grants: &Mutex<GrantSet>,
    store: &PendingAttempts,
    dataset: Arc<Dataset>,
    dataset_name: String,
    style_source: String,
    scope: PublishScope,
    filter_active: bool,
    viewer: ViewerAssets,
    viewer_license: ViewerLicenseInput,
    destination: PathBuf,
    started_at: String,
) -> PrepareOutcome {
    let query = scope.to_query();
    let row_scope = scope.row_scope_sentence();
    prepare_with_query(
        grants, store, dataset, dataset_name, style_source, query, row_scope, filter_active, viewer,
        viewer_license, destination, started_at,
    )
}

#[allow(clippy::too_many_arguments)]
fn prepare_with_query(
    grants: &Mutex<GrantSet>,
    store: &PendingAttempts,
    dataset: Arc<Dataset>,
    dataset_name: String,
    style_source: String,
    query: ViewportQuery,
    row_scope: String,
    filter_active: bool,
    viewer: ViewerAssets,
    viewer_license: ViewerLicenseInput,
    destination: PathBuf,
    started_at: String,
) -> PrepareOutcome {
    let attributes = style_attributes(&style_source);
    let request = PublishRequest {
        dataset: &dataset,
        dataset_name: &dataset_name,
        query: query.clone(),
        attributes: attributes.clone(),
        style_source: &style_source,
        viewer: &viewer,
        viewer_license: viewer_license.clone(),
        license: None,
        destination: destination.clone(),
        started_at: started_at.clone(),
        finished_at: &rfc3339_utc_now,
    };

    // **Pure — includes P0's row-filter refusal.** A filter-active publish refuses HERE, surfaced to
    // JS as a typed message, before any grant is minted and before the native picker's answer is
    // used for anything but this check.
    let pre = match publish::preflight(&request) {
        Ok(p) => p,
        Err(e) => return PrepareOutcome::Refused { message: e.to_string() },
    };

    let resolved_destination = match permission::grant::resolve_destination(&destination) {
        Ok(d) => d,
        Err(e) => return PrepareOutcome::Refused { message: e.to_string() },
    };

    let principal = Principal::from_environment();

    // **The grant's facts, never the request's** (F-5's binding rule: the requester never mints its
    // own authority from what it asserts). `content_hash` is the dataset's own `ContentPin`, read
    // off `pre` — which `preflight` derived from `ds.content_pin()`, not from anything JS sent — and
    // the destination is the native picker's own answer, resolved the same way the boundary will
    // re-resolve it. `dataset_name` is the one member legitimately taken from the request: it
    // *becomes* the manifest's logical URI (`kernel/src/permission/grant.rs`).
    let destination_scope = match DestinationScope::exact(&destination) {
        Ok(d) => d,
        Err(e) => return PrepareOutcome::Refused { message: e.to_string() },
    };
    let grant = match PublishGrant::new(
        OperationKind::Publish,
        SourceScope { dataset_name: dataset_name.clone(), content_hash: pre.source_content_hash() },
        destination_scope,
        principal.clone(),
        // The pending attempt's own TTL, not the 20-minute ceiling: the two expire together (module
        // docs).
        PENDING_ATTEMPT_TTL,
    ) {
        Ok(g) => g,
        Err(e) => return PrepareOutcome::Refused { message: e.to_string() },
    };
    let grant_remaining_s = grant.remaining(Instant::now()).as_secs();

    {
        let mut held = grants.lock().unwrap_or_else(|e| e.into_inner());
        if let Err(e) = held.add(grant) {
            return PrepareOutcome::Refused { message: e.to_string() };
        }
    }

    let prompt = PublishPromptData {
        operation: publish::OPERATION,
        class: OPERATION_CLASS,
        reversibility: REVERSIBILITY_CLASS,
        source_name: dataset_name.clone(),
        source_content_hash: pre.source_content_hash(),
        style_hash: pre.style_hash().to_string(),
        destination_display: resolved_destination.display().to_string(),
        confirmation_phrase: boundary::confirmation_phrase(&resolved_destination),
        grantor: format!("{} {}", principal.kind.as_str(), principal.id),
        grant_remaining_s,
        row_scope,
        filter_scope: filter_active.then(|| FILTER_SCOPE_SENTENCE.to_string()),
    };

    let attempt_id = match mint_attempt_id() {
        Ok(id) => id,
        Err(message) => return PrepareOutcome::Refused { message },
    };

    store.insert(
        attempt_id.clone(),
        PendingAttempt {
            dataset,
            dataset_name,
            query,
            attributes,
            style_source,
            viewer,
            viewer_license,
            license: None,
            destination,
            started_at,
            principal,
            created_at: Instant::now(),
        },
    );

    PrepareOutcome::Prompt { attempt_id, prompt }
}

// -------------------------------------------------------------------------------------------
// execute
// -------------------------------------------------------------------------------------------

/// Take the pending attempt (single-use), open a **fresh** audit log for it alone (F-9), and run it
/// through `permission::boundary::execute` with a [`ShellApproval`] carrying `typed_phrase`.
/// `publish::publish_unguarded` is never referenced (`tests/sole_caller_scan.rs` asserts it crate-wide).
pub fn execute(
    grants: &Mutex<GrantSet>,
    store: &PendingAttempts,
    attempt_id: &str,
    typed_phrase: &str,
) -> ExecuteOutcome {
    let Some(pending) = store.take(attempt_id) else {
        return ExecuteOutcome::UnknownAttempt;
    };

    let request = PublishRequest {
        dataset: &pending.dataset,
        dataset_name: &pending.dataset_name,
        query: pending.query,
        attributes: pending.attributes,
        style_source: &pending.style_source,
        viewer: &pending.viewer,
        viewer_license: pending.viewer_license,
        license: pending.license,
        destination: pending.destination,
        started_at: pending.started_at,
        finished_at: &rfc3339_utc_now,
    };

    // Mirrors `publish-bundle`'s own ordering exactly: resolve, then open one audit log **for this
    // call**. Opening it here — every time `execute` runs, never cached across calls — is what
    // closes F-9: the shell never holds a log across attempts by construction, not by convention.
    let resolved_destination = match permission::grant::resolve_destination(&request.destination) {
        Ok(d) => d,
        Err(e) => return ExecuteOutcome::Refused { message: e.to_string() },
    };
    let audit = match AuditLog::open_for(&resolved_destination) {
        Ok(a) => a,
        Err(e) => return ExecuteOutcome::Refused { message: e.to_string() },
    };

    let approval = ShellApproval::new(typed_phrase);
    let held = grants.lock().unwrap_or_else(|e| e.into_inner());
    let grantset: &GrantSet = &held;

    let attempt = PublishAttempt {
        request: &request,
        grants: grantset,
        approval: &approval,
        principal: &pending.principal,
        audit: &audit,
        clock: &rfc3339_utc_now,
    };

    // `publish_unguarded` is never called: this is the one path through the boundary's steps 3-8
    // (`kernel/src/permission/boundary.rs`'s own header), on a cancel token nothing outside this
    // call can reach — progress and cancel are P2's (`NEXT-CUT.md`'s phase table).
    match boundary::execute(&attempt, &CancelToken::new(), None) {
        Ok(outcome) => ExecuteOutcome::Success {
            bundle_path: outcome.bundle_path.display().to_string(),
            rows: outcome.rows,
            partitions: outcome.partitions,
            total_bytes: outcome.total_bytes,
            manifest_bytes: outcome.manifest_bytes,
            style_hash: outcome.style_hash,
            operation_digest: outcome.operation_digest,
            build_millis: outcome.build_millis,
        },
        Err(BoundaryError::OutcomeNotAudited { outcome, path, detail }) => {
            ExecuteOutcome::SucceededUnaudited {
                bundle_path: outcome.bundle_path.display().to_string(),
                detail: format!("{path}: {detail}"),
            }
        }
        Err(e) => ExecuteOutcome::Refused { message: e.to_string() },
    }
}

// -------------------------------------------------------------------------------------------
// The viewer, the dataset name and the style's own attributes — small host-side helpers
// -------------------------------------------------------------------------------------------

/// The columns this publish must include so the style it carries can bind to something.
///
/// **Not attribute-projection UI** (`NEXT-CUT.md`'s non-goal): nothing here is chosen by an
/// operator, and there is no selection surface — it is a derivation from the style document
/// already in hand, done so the operation can succeed rather than so a user can pick columns.
/// Its absence would be worse than absent: `preflight` publishes `attributes: Vec::new()`
/// unconditionally otherwise, so *every* style using a `match` (not merely some) would refuse with
/// `StyleError::MatchColumnNotPublished` — a silent, universal breakage of the feature this seam
/// exists to expose, not a missing convenience.
///
/// A style that fails to parse here returns no attributes rather than surfacing an error: this is
/// a best-effort deriver, not a second style parser, and `publish::preflight` re-parses and
/// re-validates the same document immediately afterward — its refusal is the real one.
fn style_attributes(style_source: &str) -> Vec<String> {
    match spatial_renderer::style::parse(style_source) {
        Ok(doc) => doc.match_column().map(|c| vec![c.to_string()]).unwrap_or_default(),
        Err(_) => Vec::new(),
    }
}

/// Derive a manifest-safe dataset name from the dataset's own source file. The shell's
/// `DatasetHandle` is an opaque `ds_<hex>` token (`protocol/skp/src/v0/handles.rs`), not a name a
/// human would recognize in a published manifest.
///
/// Non `[A-Za-z0-9._-]` characters become `-`; `dataset_logical_uri`
/// (`kernel/src/publish/mod.rs`) stays the real authority — this is a courtesy, not a second
/// validator, and a case it does not anticipate surfaces as the legitimate typed refusal
/// `PublishError::DatasetNameRejected`.
pub fn dataset_name_for(ds: &Dataset) -> String {
    let stem = ds.path().file_stem().and_then(|s| s.to_str()).unwrap_or("dataset");
    let sanitized: String = stem
        .chars()
        .map(|c| if c.is_ascii_alphanumeric() || c == '-' || c == '_' || c == '.' { c } else { '-' })
        .collect();
    if sanitized.is_empty() { "dataset".to_string() } else { sanitized }
}

/// The reference bundle viewer this repository ships (`renderer/bundle-viewer/dist`) and the
/// distributed-code declaration ADR-009 item 7 requires for it.
///
/// **Dev-tree relative, and that is a known limit, not an oversight.** `CARGO_MANIFEST_DIR` points
/// at `frontends/shell/src-tauri` at compile time; three `..` reaches the workspace root. This holds
/// for `cargo tauri dev` and for a manual walkthrough run from a checkout — everything this cut's
/// evidence (P4/P5) needs. **It does not hold for a packaged build**: nothing here wires the viewer
/// into `tauri.conf.json`'s `bundle.resources`, and that packaging decision is out of this piece's
/// scope (`NEXT-CUT.md` P1 names the host seam, not distribution).
pub fn bundled_viewer() -> Result<(ViewerAssets, ViewerLicenseInput), String> {
    let dir =
        std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../renderer/bundle-viewer/dist");
    let viewer = ViewerAssets::from_dir(&dir).map_err(|e| {
        format!(
            "the reference bundle viewer is not built at {} ({e}) — run `npm run build` in \
             renderer/bundle-viewer first",
            dir.display()
        )
    })?;
    let license = ViewerLicenseInput {
        program: "Spatial IDE bundle viewer".into(),
        copyright: "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors".into(),
        license: "AGPL-3.0-or-later".into(),
        notice_path: "NOTICE.txt".into(),
        // WrittenOffer, not a URL: this repository is not yet public (ADR-009 item 1's gate;
        // CLAUDE.md's "before any public code"), so a URL route would assert a durable public
        // location that does not exist yet. A written offer states the same AGPL obligation
        // honestly, and `CorrespondingSourceNotDurable` only ever fires on the `Url` kind.
        corresponding_source: CorrespondingSource {
            kind: CorrespondingSourceKind::WrittenOffer,
            at: "Corresponding source is available from Christopher Donini on written request; \
                 this repository is not yet public."
                .into(),
        },
    };
    Ok((viewer, license))
}

#[cfg(test)]
mod tests {
    use super::*;
    use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode};
    use spatial_kernel::publish::ViewerAsset;
    use std::path::Path;
    use std::sync::{Mutex as StdMutex, MutexGuard as StdMutexGuard, OnceLock};

    const STYLE: &str = r##"{
      "style_version": 1,
      "layer": {
        "geometry": "polygon",
        "fill_color": {"match": {
          "column": "zone",
          "cases": [{"when": "residential", "then": "#aa3333"}],
          "on_null": "#888888",
          "on_unmatched": "#cccccc"}},
        "fill_opacity": {"literal": 0.8},
        "outline_color": {"literal": "#202020"},
        "outline_width": {"literal": 1.0}
      }
    }"##;

    /// Serializes the `SPATIAL_IDE_AUDIT_LOG` set-var/run/read window, the same discipline
    /// `kernel/tests/permission_boundary.rs` documents for the identical hazard.
    fn env_lock() -> StdMutexGuard<'static, ()> {
        static LOCK: OnceLock<StdMutex<()>> = OnceLock::new();
        LOCK.get_or_init(|| StdMutex::new(())).lock().unwrap_or_else(|e| e.into_inner())
    }

    fn workspace(name: &str) -> PathBuf {
        let d = std::env::temp_dir().join("spatial-ide-shell-publish-tests").join(name);
        let _ = std::fs::remove_dir_all(&d);
        std::fs::create_dir_all(&d).unwrap();
        std::fs::canonicalize(&d).unwrap()
    }

    fn fixture(dir: &Path, features: usize) -> Arc<Dataset> {
        let path = dir.join("parcels.parquet");
        write_geoparquet(
            &path,
            &FixtureSpec {
                features,
                attributes: AttributeMode::CategoricalZone,
                crs_mode: CrsMode::DeclaredLv95,
                identity: IdentityMode::NativeUnique,
                ..Default::default()
            },
        )
        .unwrap();
        let ds = Dataset::open(&path).unwrap();
        ds.pin_content(&CancelToken::new()).unwrap();
        Arc::new(ds)
    }

    fn viewer() -> ViewerAssets {
        // Synthetic, deliberately (`kernel/tests/publish.rs`'s own convention): a Rust test must not
        // need Node or a built `renderer/bundle-viewer/dist` to run.
        ViewerAssets::new(vec![
            ViewerAsset { path: "index.html".into(), bytes: b"<!doctype html><title>t</title>".to_vec() },
            ViewerAsset { path: "NOTICE.txt".into(), bytes: b"stub notice\n".to_vec() },
        ])
        .unwrap()
    }

    fn viewer_license() -> ViewerLicenseInput {
        ViewerLicenseInput {
            program: "test viewer".into(),
            copyright: "Copyright (C) 2026 the Spatial IDE contributors".into(),
            license: "AGPL-3.0-or-later".into(),
            notice_path: "NOTICE.txt".into(),
            corresponding_source: CorrespondingSource {
                kind: CorrespondingSourceKind::WrittenOffer,
                at: "on request".into(),
            },
        }
    }

    /// Runs `prepare` end to end and unwraps the prompt, panicking with the outcome otherwise — most
    /// tests below want a granted, prompted attempt as their starting point.
    fn prepared(
        d: &Path,
        name: &str,
    ) -> (Mutex<GrantSet>, PendingAttempts, String, String) {
        let ds = fixture(d, 50);
        let dest = d.join(format!("out-{name}"));
        let grants = Mutex::new(GrantSet::new());
        let store = PendingAttempts::new();
        let outcome = prepare(
            &grants,
            &store,
            ds,
            "parcels".into(),
            STYLE.into(),
            PublishScope::WholeFile,
            false,
            viewer(),
            viewer_license(),
            dest,
            "2026-08-16T10:00:00Z".into(),
        );
        let PrepareOutcome::Prompt { attempt_id, prompt } = outcome else {
            panic!("expected a prompt, got {outcome:?}")
        };
        (grants, store, attempt_id, prompt.confirmation_phrase)
    }

    #[test]
    fn a_second_execute_on_the_same_attempt_id_is_unknown_not_a_stale_approval() {
        let _guard = env_lock();
        let d = workspace("single-use");
        let log = d.join("audit.jsonl");
        std::env::set_var(spatial_kernel::permission::AUDIT_LOG_ENV, &log);

        let (grants, store, attempt_id, phrase) = prepared(&d, "single-use");

        let first = execute(&grants, &store, &attempt_id, &phrase);
        assert!(matches!(first, ExecuteOutcome::Success { .. }), "got {first:?}");

        // The **same, correct** phrase again — this is not testing that a wrong phrase refuses (that
        // is `approval::check`'s own suite); it is testing that the attempt itself is gone.
        let second = execute(&grants, &store, &attempt_id, &phrase);
        assert!(matches!(second, ExecuteOutcome::UnknownAttempt), "got {second:?}");
    }

    #[test]
    fn a_pending_attempt_past_its_ttl_is_treated_as_unknown() {
        let d = workspace("ttl");
        let ds = fixture(&d, 10);
        let store = PendingAttempts::new();

        store.insert(
            "expired-id".into(),
            PendingAttempt {
                dataset: ds,
                dataset_name: "parcels".into(),
                query: ViewportQuery::all(),
                attributes: vec!["zone".into()],
                style_source: STYLE.into(),
                viewer: viewer(),
                viewer_license: viewer_license(),
                license: None,
                destination: d.join("out"),
                started_at: "2026-08-16T10:00:00Z".into(),
                principal: Principal::from_environment(),
                created_at: Instant::now() - (PENDING_ATTEMPT_TTL + Duration::from_secs(1)),
            },
        );

        assert!(
            store.take("expired-id").is_none(),
            "a pending attempt past its declared TTL must not be returned"
        );
    }

    #[test]
    fn a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt() {
        let _guard = env_lock();
        let d = workspace("per-attempt-log");

        // Attempt A, its own log.
        let log_a = d.join("audit-a.jsonl");
        std::env::set_var(spatial_kernel::permission::AUDIT_LOG_ENV, &log_a);
        let (grants_a, store_a, id_a, phrase_a) = prepared(&d, "a");
        let out_a = execute(&grants_a, &store_a, &id_a, &phrase_a);
        assert!(matches!(out_a, ExecuteOutcome::Success { .. }), "got {out_a:?}");

        // Attempt B, pointed at a **different** log path before it prepares or executes — proving
        // `execute` re-resolves and re-opens `AuditLog::open_for` on *this* call rather than holding
        // whatever attempt A opened (F-9).
        let log_b = d.join("audit-b.jsonl");
        std::env::set_var(spatial_kernel::permission::AUDIT_LOG_ENV, &log_b);
        let (grants_b, store_b, id_b, phrase_b) = prepared(&d, "b");
        let out_b = execute(&grants_b, &store_b, &id_b, &phrase_b);
        assert!(matches!(out_b, ExecuteOutcome::Success { .. }), "got {out_b:?}");

        let raw_a = std::fs::read_to_string(&log_a).unwrap();
        let raw_b = std::fs::read_to_string(&log_b).unwrap();
        assert_eq!(raw_a.lines().count(), 2, "attempt a's own log should hold exactly its own pair: {raw_a}");
        assert_eq!(raw_b.lines().count(), 2, "attempt b's own log should hold exactly its own pair: {raw_b}");
        assert!(!raw_a.contains("out-b"), "attempt b's destination leaked into attempt a's log");
        assert!(!raw_b.contains("out-a"), "attempt a's destination leaked into attempt b's log");

        for line in raw_a.lines().chain(raw_b.lines()) {
            let v: serde_json::Value = serde_json::from_str(line).unwrap();
            if v["phase"] == "outcome" {
                assert_eq!(v["approval_route"], "shell-dialog", "{line}");
            }
        }
    }

    #[test]
    fn a_row_predicate_refuses_through_prepare_with_the_p0_message_and_stashes_nothing() {
        let d = workspace("p0-through-prepare");
        let ds = fixture(&d, 30);
        let predicate = spatial_engine::AdmittedPredicate::admit("zone = 'residential'", &ds)
            .expect("a real predicate over a real fixture column admits");
        let query = ViewportQuery::all().with_filter(predicate);

        let grants = Mutex::new(GrantSet::new());
        let store = PendingAttempts::new();
        let outcome = prepare_with_query(
            &grants,
            &store,
            ds,
            "parcels".into(),
            STYLE.into(),
            query,
            "row scope: the whole file".into(),
            false,
            viewer(),
            viewer_license(),
            d.join("out"),
            "2026-08-16T10:00:00Z".into(),
        );
        match outcome {
            PrepareOutcome::Refused { message } => {
                assert!(message.contains("ADR-017"), "{message}");
                assert!(message.contains("bundle_version"), "{message}");
            }
            other => panic!("expected a refusal, got {other:?}"),
        }
        assert_eq!(store.len(), 0, "a refused prepare must not stash a pending attempt");
    }

    #[test]
    fn the_filter_scope_sentence_is_present_only_when_filter_active_is_true() {
        let d = workspace("filter-scope-sentence");
        let ds = fixture(&d, 20);
        let grants = Mutex::new(GrantSet::new());
        let store = PendingAttempts::new();

        let without = prepare(
            &grants, &store, ds.clone(), "parcels".into(), STYLE.into(), PublishScope::WholeFile,
            false, viewer(), viewer_license(), d.join("out-no-filter"), "2026-08-16T10:00:00Z".into(),
        );
        let PrepareOutcome::Prompt { prompt, .. } = without else { panic!("expected a prompt") };
        assert!(prompt.filter_scope.is_none(), "no active filter must mean no sentence");

        let with = prepare(
            &grants, &store, ds, "parcels".into(), STYLE.into(), PublishScope::WholeFile,
            true, viewer(), viewer_license(), d.join("out-with-filter"), "2026-08-16T10:00:00Z".into(),
        );
        let PrepareOutcome::Prompt { prompt, .. } = with else { panic!("expected a prompt") };
        assert_eq!(prompt.filter_scope.as_deref(), Some(FILTER_SCOPE_SENTENCE));
    }

    #[test]
    fn dataset_name_for_sanitizes_a_filename_stem() {
        let d = workspace("dataset-name");
        let path = d.join("my data (2026).parquet");
        write_geoparquet(
            &path,
            &FixtureSpec {
                features: 5,
                attributes: AttributeMode::CategoricalZone,
                crs_mode: CrsMode::DeclaredLv95,
                identity: IdentityMode::NativeUnique,
                ..Default::default()
            },
        )
        .unwrap();
        let ds = Dataset::open(&path).unwrap();
        let name = dataset_name_for(&ds);
        assert!(
            name.chars().all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_' || c == '.'),
            "{name}"
        );
        assert!(!name.contains(' '), "{name}");
    }
}
