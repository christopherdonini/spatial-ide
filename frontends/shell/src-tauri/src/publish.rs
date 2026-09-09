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

use spatial_engine::{Bbox, CancelToken, Dataset, EngineError, ViewportQuery};
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
    /// The FULL resolved destination string. The dialog's own instruction tells the operator to
    /// type "the destination's final path component" (`PublishDialog.tsx`) -- **never this
    /// struct's own field**, because there is no such field: the confirmation phrase is computed
    /// host-side, both here at `prepare` time (for the boundary's own record) and again,
    /// independently, inside `boundary::execute` at approval-check time — it is never serialized
    /// to JS at all (reviewer gate, publish cut: an earlier version carried a `confirmation_phrase`
    /// field nothing rendered, which made the ADR-024 claim "the phrase never crosses into JS"
    /// literally false; dropping the field is what makes that claim true rather than aspirational).
    /// A page script -- or an E2E suite -- can still *derive* the expected phrase from this field's
    /// own basename (`e2e/publish.mjs` does exactly that), which is why this is defence-in-depth
    /// against operator error, never a secret the host is withholding.
    pub destination_display: String,
    pub grantor: String,
    pub grant_remaining_s: u64,
    /// NEW relative to `ApprovalPrompt::render`'s field set: whole-file or viewport-bbox, in words.
    pub row_scope: String,
    /// NEW: present only when the shell's active filter would have applied to this publish — the
    /// [`FILTER_SCOPE_SENTENCE`], never silently dropped.
    pub filter_scope: Option<String>,
    /// **ADR-017's Exposure review, 2026-08-17, condition 1** — the human's own words, verbatim:
    /// *"the approval dialog must state the plain outcome — what will be written, where, and
    /// roughly what it contains ... in one human sentence alongside the provenance fields"* (G3).
    /// Composed host-side, from facts already in hand at `prepare` time (see
    /// [`compose_outcome_summary`]) — the same "host composes, JS only renders" discipline every
    /// other field on this struct already follows. `PublishDialog.tsx` renders it first, before the
    /// provenance `<dl>` — this field ADDS clarity; nothing else on this struct changes meaning or
    /// is removed.
    pub outcome_summary: String,
}

/// The plain-outcome sentence [`PublishPromptData::outcome_summary`] carries — composed from facts
/// `prepare_with_query` already holds at this point in its own body: the resolved destination's own
/// basename and parent. **Never a row or partition count**: `publish::preflight` is "pure with
/// respect to the filesystem's contents" (`kernel/src/publish/mod.rs`'s own doc comment on
/// `PublishPreflight`) — it reads no data, so neither figure is known yet, and inventing one here
/// would be exactly the kind of unmeasured claim `docs/08`/ADR-018 forbid. Said honestly instead:
/// "the selected rows" (row scope itself is named precisely, one field below this one, by
/// `PublishScope::row_scope_sentence`) and "one or more data partitions" (the true, if imprecise,
/// range — this bundle format always writes at least one).
fn compose_outcome_summary(resolved_destination: &std::path::Path) -> String {
    let basename = resolved_destination
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_else(|| resolved_destination.display().to_string());
    let parent_display = match resolved_destination.parent() {
        Some(p) if !p.as_os_str().is_empty() => p.display().to_string(),
        _ => "the current directory".to_string(),
    };
    format!(
        "This will create a folder named \"{basename}\" at {parent_display}, containing the \
         selected rows as one or more data partitions, the interactive viewer page, and a manifest."
    )
}

#[derive(serde::Serialize, Debug)]
#[serde(tag = "status", rename_all = "kebab-case")]
pub enum PrepareOutcome {
    Prompt { attempt_id: String, prompt: PublishPromptData },
    /// The operator dismissed the native picker. **Not an error** (`NEXT-CUT.md` P1 item 4) — no
    /// typed refusal, no grant minted, no pending attempt stashed: nothing was attempted.
    PickerCancelled,
    /// The operator cancelled during the "Preparing…" pin phase — RELEASE-0.1 item 10
    /// (DECISIONS-PENDING entry 7's ruled pre-fix; `docs/01` principle 7's progress/cancel clause).
    /// **Not an error**, the same posture [`Self::PickerCancelled`] already takes: nothing was
    /// written (ADR-006 — the pin is not a side effect), no grant was minted, no pending attempt was
    /// stashed, and the approval dialog never opens.
    Cancelled,
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

/// [`prepare`]'s own real code path, generalized over the cancel token and pin-progress sink the
/// Tauri command wrapper supplies — RELEASE-0.1 item 10 (DECISIONS-PENDING entry 7's ruled
/// pre-fix), the same `_with_progress` pattern [`execute_with_progress`] already established for
/// the execute phase (`commands.rs`'s own `binding_publish_prepare` calls this directly; `prepare`
/// below is a thin wrapper kept byte-for-byte for the existing test suite, which pre-pins every
/// fixture and so never exercises the pin phase at all).
///
/// **Order, and why it is this order — this is the piece that fixes it.** The predictable ADR-025
/// checks, and every other refusal [`publish::preflight`] can make without the pin, run FIRST, via
/// [`publish::preflight_pinless`] — so an over-ceiling (or unlicensed, or row-filtered) source is
/// refused before a single byte is hashed. Only once that passes does the pin itself run,
/// cancellable and progress-reporting via [`ensure_pinned_with_progress`]. [`prepare_with_query`]
/// runs last, UNCHANGED — it re-runs the full [`publish::preflight`] internally (the pin-free parts
/// included), which is pure, already-computed-once-more work over facts already in hand (no dataset
/// scan, no IO — `Dataset::file_schema()` is cached) rather than threading this function's own
/// intermediate result through as a second source of truth that could drift from it. No claim is
/// made here about what that re-check costs: nothing in this tree has measured it.
///
/// **The one case this ordering cannot help: `DeclaredNotVerified` identity** — see
/// [`publish::preflight_pinless`]'s own doc comment; the same residual applies here since this
/// function calls exactly that.
#[allow(clippy::too_many_arguments)]
pub fn prepare_with_progress(
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
    cancel: &CancelToken,
    on_pin_progress: Option<&mut dyn FnMut(u64, u64)>,
) -> PrepareOutcome {
    let query = scope.to_query();
    let row_scope = scope.row_scope_sentence();
    let attributes = style_attributes(&style_source);

    let request = PublishRequest {
        dataset: &dataset,
        dataset_name: &dataset_name,
        query: query.clone(),
        attributes,
        style_source: &style_source,
        viewer: &viewer,
        viewer_license: viewer_license.clone(),
        license: None,
        destination: destination.clone(),
        started_at: started_at.clone(),
        finished_at: &rfc3339_utc_now,
    };

    // The predictable ADR-025 checks (and every other pin-free refusal), BEFORE any byte is
    // hashed — the reordering this piece exists to build.
    if let Err(e) = publish::preflight_pinless(&request) {
        return PrepareOutcome::Refused { message: e.to_string() };
    }

    // The pin phase: cancellable and progress-reporting (`docs/01` principle 7). A cancel here
    // leaves nothing behind (ADR-006 — the pin is not a side effect): no grant minted, no pending
    // attempt stashed, the approval dialog never opens.
    match ensure_pinned_with_progress(&dataset, cancel, on_pin_progress) {
        EnsurePinnedOutcome::Cancelled => return PrepareOutcome::Cancelled,
        EnsurePinnedOutcome::Failed(message) => return PrepareOutcome::Refused { message },
        EnsurePinnedOutcome::Ok => {}
    }

    prepare_with_query(
        grants, store, dataset, dataset_name, style_source, query, row_scope, filter_active, viewer,
        viewer_license, destination, started_at,
    )
}

/// A thin wrapper over [`prepare_with_progress`] with a throwaway [`CancelToken`] nothing outside
/// this call can reach and no progress sink — exactly the relationship [`execute`] already has with
/// [`execute_with_progress`], and for the same reason: this module's own test suite is its only
/// caller (`#[allow(dead_code)]` below is that, disclosed, not a silenced real defect), while
/// `commands.rs` calls the `_with_progress` form directly with the real token and sink.
///
/// **SF3, this batch's reviewer gate — it now delegates rather than skipping ahead to
/// [`prepare_with_query`].** Before this batch it called `prepare_with_query` directly, so the
/// suite's own ~dozen `prepare(...)` tests exercised a path the shipped command does not take: the
/// ADR-025 reordering and the pin phase were both invisible to them. Delegating costs those tests
/// one extra [`publish::preflight_pinless`] over an already-pinned fixture (a re-check over facts
/// already in hand — no scan; `Dataset::file_schema()` is cached, `engine/src/dataset.rs:660`) and
/// an [`ensure_pinned_with_progress`] that returns `Ok` immediately on a dataset that already holds
/// a [`Dataset::content_pin`]. What it buys is that those tests now run the shipped code.
///
/// One consequence, stated rather than hidden: `prepare` on an UNPINNED dataset no longer refuses
/// `SourceNotPinned` — it pins, like the real command does. The refusal itself is unchanged and
/// still proven, through the pin-free path it belongs to
/// (`tests::an_unpinned_dataset_still_refuses_through_the_pin_free_path_but_prepare_now_pins_it`).
#[allow(dead_code)]
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
    prepare_with_progress(
        grants, store, dataset, dataset_name, style_source, scope, filter_active, viewer,
        viewer_license, destination, started_at, &CancelToken::new(), None,
    )
}

/// The grant-minting, attempt-stashing tail both [`prepare_with_progress`] and [`prepare`] end in —
/// and the seam a test can bypass to construct a query neither of them could ever produce (see
/// `tests::a_row_predicate_refuses_through_prepare_with_the_p0_message_and_stashes_nothing`),
/// proving that refusal is `publish::preflight`'s own, reached through the real code path, not a
/// second check written for the test. It takes no pin of its own: an unpinned dataset reaching here
/// refuses `SourceNotPinned` inside `preflight`, which is exactly why the pin belongs upstream in
/// [`prepare_with_progress`].
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
        // **S1, this cut's own reviewer gate**: unlike `publish-bundle` (one grant, one process,
        // exits), this `GrantSet` lives for the whole app session in Tauri managed state — without
        // pruning, every `prepare` call only grows it, and the 65th in a session refused
        // `GrantCeilingExceeded` forever, since nothing ever removed an old, already-expired grant.
        // Mirrors `PendingAttempts::insert`'s own prune-on-insert precedent (this file, above).
        held.prune_expired(Instant::now());
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
        grantor: format!("{} {}", principal.kind.as_str(), principal.id),
        grant_remaining_s,
        row_scope,
        filter_scope: filter_active.then(|| FILTER_SCOPE_SENTENCE.to_string()),
        outcome_summary: compose_outcome_summary(&resolved_destination),
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
///
/// A thin wrapper over [`execute_with_progress`] with a throwaway token nothing outside this call
/// can reach and no observer — P1's own original body, kept byte-for-byte so every P1 test keeps
/// calling this exact signature unchanged. `commands.rs::binding_publish_execute` calls
/// [`execute_with_progress`] directly instead, supplying the real cancel token and progress sink
/// (P2, `NEXT-CUT.md` item 3) — so this function's only remaining caller is this module's own P1
/// test suite (`#[allow(dead_code)]` below is that, disclosed, not a silenced real defect).
#[allow(dead_code)]
pub fn execute(
    grants: &Mutex<GrantSet>,
    store: &PendingAttempts,
    attempt_id: &str,
    typed_phrase: &str,
) -> ExecuteOutcome {
    execute_with_progress(grants, store, attempt_id, typed_phrase, &CancelToken::new(), None)
}

/// [`execute`]'s own body, generalized over the cancel token and progress observer the Tauri
/// command wrapper supplies — P2's minimal host-side wiring for progress events and a working
/// Cancel-publish control (`NEXT-CUT.md` P2 item 3: "listen to the Tauri publish progress events
/// P1 wired ... if P1 did not wire events, add the minimal host-side emission now"; P1 did not —
/// see this module's own top doc comment, "Two things this module deliberately does NOT do").
#[allow(clippy::too_many_arguments)]
pub fn execute_with_progress(
    grants: &Mutex<GrantSet>,
    store: &PendingAttempts,
    attempt_id: &str,
    typed_phrase: &str,
    cancel: &CancelToken,
    progress: Option<&dyn publish::PublishProgress>,
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

    // **S1's "consumed" half, captured before anything below can early-return.** The SAME facts
    // the grant was minted against (`prepare_with_query`'s own `SourceScope`/`DestinationScope`) —
    // `dataset.content_pin()` is `Some` by this point (`ensure_pinned` ran during `prepare`) and is
    // never recomputed, only read, so this matches `preflight`'s own `source_content_hash()`
    // exactly. Used at every return path below to evict this attempt's own grant the instant its
    // single use is spent (`GrantSet::remove_matching`'s own doc comment) — whether the attempt
    // goes on to succeed, refuse, or fail before `boundary::execute` is even reached.
    let facts = permission::grant::OperationFacts {
        operation: OperationKind::Publish,
        dataset_name: pending.dataset_name.clone(),
        content_hash: pending
            .dataset
            .content_pin()
            .map(|p| format!("sha256:{}", p.hash()))
            .unwrap_or_default(),
        destination: resolved_destination.clone(),
    };
    let consume_grant = || {
        grants.lock().unwrap_or_else(|e| e.into_inner()).remove_matching(&facts);
    };

    let audit = match AuditLog::open_for(&resolved_destination) {
        Ok(a) => a,
        Err(e) => {
            consume_grant();
            return ExecuteOutcome::Refused { message: e.to_string() };
        }
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
    // (`kernel/src/permission/boundary.rs`'s own header). `cancel`/`progress` are now the caller's
    // own — [`execute`] above supplies a throwaway token and `None`; `binding_publish_execute`
    // supplies the real [`RunningPublishes`]-registered token and an [`EventProgress`] sink.
    let boundary_outcome = boundary::execute(&attempt, cancel, progress);
    // Release the read borrow before re-locking (mutably) to remove -- `held`/`grantset` are not
    // used again below.
    drop(held);
    consume_grant();

    match boundary_outcome {
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
// Progress + cancel (P2, `NEXT-CUT.md` item 3) — a Tauri event during `execute_with_progress`,
// and a registry the JS Cancel-publish control can reach mid-run.
// -------------------------------------------------------------------------------------------

/// The Tauri event `execute_with_progress` emits, once per phase transition
/// (`spatial_kernel::publish::PublishPhase::as_str()` verbatim — never a percentage or ETA,
/// `NEXT-CUT.md` P2 item 3: "phases only, no percentages beyond what PublishProgress carries").
/// JS listens via `@tauri-apps/api/event`'s `listen(PUBLISH_PROGRESS_EVENT, ...)`
/// (`src/publish/client.ts`).
pub const PUBLISH_PROGRESS_EVENT: &str = "publish://progress";

#[derive(serde::Serialize, Clone, Debug)]
pub struct PublishProgressEvent {
    /// The real minted attempt id for every EXECUTE-phase event; during the "Preparing…" pin phase
    /// (RELEASE-0.1 item 10), no `attempt_id` exists yet (`mint_attempt_id` runs deep inside
    /// `prepare_with_query`, after the pin and the grant) — this field carries
    /// [`prepare_cancel_key`]'s own output instead, the SAME lookup string `binding_publish_cancel`
    /// must be called with to reach that phase's `CancelToken`. Never a bearer credential either
    /// way — see [`prepare_cancel_key`]'s own doc comment.
    pub attempt_id: String,
    pub phase: &'static str,
    /// Bytes hashed so far / the source's total length — present ONLY for the pin phase
    /// ([`PIN_PHASE_LABEL`]); every kernel [`publish::PublishPhase`] event still crosses phase-only,
    /// `None` on both fields, exactly as before this piece. **A fraction of bytes read, never a
    /// rate or an ETA** — ADR-018: no timing claim is derived from these two numbers anywhere in
    /// this tree, here or in the frontend that renders them.
    pub bytes_done: Option<u64>,
    pub bytes_total: Option<u64>,
}

/// A [`publish::PublishProgress`] that emits [`PUBLISH_PROGRESS_EVENT`] through a caller-supplied
/// sink — generic over a plain closure, not `tauri::AppHandle` directly, so this stays testable
/// without a live Tauri app (this module's own "testable without a webview" discipline, top doc
/// comment). Every default method (`partition_written` aside, which has none) is left at its
/// no-op default: phases only, nothing else crosses.
pub struct EventProgress<F: Fn(PublishProgressEvent) + Send + Sync> {
    attempt_id: String,
    emit: F,
}

impl<F: Fn(PublishProgressEvent) + Send + Sync> EventProgress<F> {
    pub fn new(attempt_id: String, emit: F) -> Self {
        Self { attempt_id, emit }
    }
}

impl<F: Fn(PublishProgressEvent) + Send + Sync> publish::PublishProgress for EventProgress<F> {
    fn phase(&self, phase: publish::PublishPhase) {
        (self.emit)(PublishProgressEvent {
            attempt_id: self.attempt_id.clone(),
            phase: phase.as_str(),
            bytes_done: None,
            bytes_total: None,
        });
    }
    fn partition_written(&self, _index: usize, _rows: usize, _bytes: u64) {}
}

/// The pin phase's own phase label, crossing through the SAME [`PUBLISH_PROGRESS_EVENT`] channel
/// every kernel [`publish::PublishPhase`] does (RELEASE-0.1 item 10).
///
/// **A shell-local string constant, deliberately NOT a new kernel `PublishPhase` variant.** That
/// enum types phases INSIDE `kernel::publish::run_inner`'s own streaming operation, reachable only
/// from `execute_with_progress`/`boundary::execute` — the pin phase runs entirely in THIS crate,
/// before `publish::prepare` (let alone `execute`) is ever called, so a kernel enum variant would
/// misrepresent where the phase actually happens. Spelled in the same kebab-case style
/// `PublishPhase::as_str()` uses, so the wire carries one consistent phase vocabulary even though
/// the two halves are typed in different crates.
pub const PIN_PHASE_LABEL: &str = "pinning-source";

/// How much of the source must be read between two pin-phase events that actually cross to the
/// webview — [`pin_progress_should_emit`]'s own step.
///
/// 64 MiB against `spatial_engine::index::content_hash_observed`'s own 1 MiB read buffer: one event
/// per 64 buffers instead of one per buffer.
pub const PIN_PROGRESS_EMIT_INTERVAL_BYTES: u64 = 64 << 20;

/// Whether a `(bytes_done, bytes_total)` observation from the pin's own hash loop may be emitted to
/// the webview — **MF2, this batch's reviewer gate**.
///
/// `content_hash_observed` calls its `on_progress` sink once per 1 MiB buffer, so
/// `binding_publish_prepare`'s emitter previously put one Tauri event on the webview per MiB read —
/// thousands of them, each a `setState` and a re-render, for a source at `docs/07`'s own hero-slice
/// scale (the exact count for that fixture is arithmetic, not a measurement, and the test below
/// carries it). This is the host-side gate that bounds it: **at most one event per
/// [`PIN_PROGRESS_EMIT_INTERVAL_BYTES`] read, plus the first observation and the final one,
/// always.**
///
/// It is a BOUND on how many events cross, not a claim about anything — nothing in this tree has
/// measured what those events cost, and this function's existence asserts nothing about it. The
/// shape is `frontends/shell/src/canvas/coalesceOncePerFrame.ts`'s (the style-panel cut's own S5
/// fix, recorded there), moved to the producing side: the events are never generated rather than
/// generated and then thrown away in JS.
///
/// `last_emitted` is the `bytes_done` of the most recently emitted observation, `0` before any —
/// unambiguously "none yet", since `content_hash_observed` adds the chunk length to its running
/// total BEFORE calling the sink and breaks out on a zero-length read (`engine/src/index.rs`), so
/// no observation ever carries `bytes_done == 0`.
///
/// **Two observations always cross, on top of the step rule** (the reviewer's re-review of this
/// batch, both one-line cases):
///
/// 1. **The first**, whatever the step arithmetic says (`last_emitted == 0`). The panel's Cancel
///    control is rendered only once a pin-phase event has arrived — `PublishPanel.tsx`'s
///    `cancelControlVisible`, whose criterion is `state.phase !== null` — so without this case the
///    operator has no Cancel at all until 64 MiB have been read, on a source that may be far larger.
///    The first chunk puts the control up; every later one is governed by the step.
/// 2. **The final one** — the observation that makes the readout end at `total / total` rather than
///    stopping short at whatever multiple of the interval came last; a UI that never shows a
///    completed count is a worse lie than a coarse one. Guarded by `last_emitted < bytes_total`, so
///    a source that GREW past the total read at open time (`content_hash_observed` measures the
///    length once, via `File::metadata`, and never re-measures) crosses this branch exactly once
///    rather than on every chunk that follows — after the first crossing the step rule alone
///    governs the tail, and the bound holds for a growing source too.
///
/// A `bytes_total` of `0` (metadata unreadable — `content_hash_observed` falls back to `0` there)
/// has no meaningful "final" observation to recognize, so case 2 never fires for it; case 1 and the
/// step rule govern, and the bound still holds.
pub fn pin_progress_should_emit(bytes_done: u64, bytes_total: u64, last_emitted: u64) -> bool {
    if last_emitted == 0 {
        return true;
    }
    if bytes_total > 0 && bytes_done >= bytes_total && last_emitted < bytes_total {
        return true;
    }
    bytes_done.saturating_sub(last_emitted) >= PIN_PROGRESS_EMIT_INTERVAL_BYTES
}

/// The prefix [`prepare_cancel_key`] builds its output from — pulled out as its own constant so
/// `PublishPanel.test.ts` can pin the frontend's own copy equal to this one by reading this file's
/// source text, the same discipline `FILTER_SCOPE_SENTENCE` already established for the filter-scope
/// sentence.
pub const PREPARE_CANCEL_KEY_PREFIX: &str = "prepare:";

/// The [`RunningPublishes`] lookup key for the prepare phase's own `CancelToken` — RELEASE-0.1 item
/// 10 (DECISIONS-PENDING entry 7's ruled pre-fix: "thread the `CancelToken` + a phase label into
/// `publish-prepare`").
///
/// **Not a minted `attempt_id`.** None exists yet during "Preparing…" — `mint_attempt_id` runs deep
/// inside `prepare_with_query`, after the pin and after the grant is minted — so this is derived
/// from `dataset_handle` instead, a fact the frontend already holds before it ever calls
/// `binding_publish_prepare`. That lets the panel compute the SAME key and register its Cancel
/// listener before the round trip even starts, with **no new Tauri command**:
/// `binding_publish_cancel` (`commands.rs`) already takes an arbitrary lookup string and reaches
/// whatever [`RunningPublishes`] holds under it (that struct's own `cancel` method has no notion of
/// "this must be a real attempt id" — it is a plain `HashMap<String, CancelToken>` keyed however a
/// caller likes). This is simply a second class of key sharing that one registry, the same way
/// [`PendingAttempts`] and [`RunningPublishes`] are already two distinct registries keyed by two
/// distinct id shapes for two distinct lifetimes (that struct's own doc comment, above).
///
/// A collision with a real, CSPRNG-minted `attempt_id` (32 lowercase hex characters,
/// `mint_attempt_id`) is not reachable: every key this function produces carries the
/// `PREPARE_CANCEL_KEY_PREFIX` prefix, and `mint_attempt_id`'s alphabet never emits a `:`.
pub fn prepare_cancel_key(dataset_handle: &str) -> String {
    format!("{PREPARE_CANCEL_KEY_PREFIX}{dataset_handle}")
}

/// The registry `binding_publish_cancel` reaches into — a running publish's own [`CancelToken`],
/// keyed by `attempt_id`, live only for the duration of one `execute_with_progress` call.
/// **Not** [`PendingAttempts`]: that store holds an attempt BEFORE it starts running (single-use,
/// consumed by `take`); this one holds a token WHILE it runs, inserted by the Tauri command
/// wrapper immediately before the blocking call and removed immediately after, regardless of
/// outcome — so a stale entry never outlives the call it belongs to.
#[derive(Default)]
pub struct RunningPublishes {
    inner: Mutex<HashMap<String, CancelToken>>,
}

impl RunningPublishes {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn insert(&self, attempt_id: String, token: CancelToken) {
        let mut g = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        g.insert(attempt_id, token);
    }

    pub fn remove(&self, attempt_id: &str) {
        let mut g = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        g.remove(attempt_id);
    }

    /// `true` iff a running publish was found and cancelled. A miss (already finished, or an
    /// `attempt_id` this registry never held) is not an error — the same "nothing to act on"
    /// posture [`PendingAttempts::take`] takes on an unknown id.
    pub fn cancel(&self, attempt_id: &str) -> bool {
        let g = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        match g.get(attempt_id) {
            Some(token) => {
                token.cancel();
                true
            }
            None => false,
        }
    }

    #[cfg(test)]
    fn len(&self) -> usize {
        self.inner.lock().unwrap_or_else(|e| e.into_inner()).len()
    }
}

/// Register a fresh [`CancelToken`] under `key`, run `body` with it, and remove the key
/// **unconditionally** afterwards, whatever `body` produced.
///
/// **M4, this batch's reviewer gate.** `binding_publish_prepare` hand-wrote this
/// insert/await/remove sequence, and the removal — the thing that keeps a finished publish's token
/// from lingering in the registry, where a later `binding_publish_cancel` under the same key would
/// find and "cancel" something already over — was covered by no test at all: that command is not
/// reachable from a unit test without a live Tauri app. Written once, here, it is
/// (`tests::a_registered_cancel_key_is_gone_from_running_publishes_after_any_outcome`).
///
/// The token stays reachable for exactly as long as `body` runs, which for the prepare phase means
/// from just before the `spawn_blocking` call until just after it — the same window
/// `frontends/shell/src/publish/PublishPanel.tsx`'s own `cancelControlVisible` will offer a Cancel
/// inside, since the first pin-phase progress event is emitted from within `body` itself. A panic
/// inside the blocking task does not skip the removal: `spawn_blocking`'s `JoinHandle` surfaces it
/// as an `Err`, so `body` still returns normally here.
pub async fn with_registered_cancel<T, Fut>(
    running: &RunningPublishes,
    key: &str,
    body: impl FnOnce(CancelToken) -> Fut,
) -> T
where
    Fut: std::future::Future<Output = T>,
{
    let cancel = CancelToken::new();
    running.insert(key.to_string(), cancel.clone());
    let out = body(cancel).await;
    running.remove(key);
    out
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

/// **A real gap this piece found by writing `frontends/shell/e2e/publish.mjs`, not by inspection —
/// every publish attempt through this shell's own UI refused `SourceNotPinned` before this fix,
/// because nothing on this crate's own admission or publish path ever called
/// [`Dataset::pin_content`].** `publish::preflight`'s `SourceNotPinned` refusal exists *because*
/// pinning is a caller responsibility by design (`kernel/src/bin/publish-bundle.rs::main` pins
/// explicitly, itself, before building its own `PublishRequest` — the CLI's own established
/// pattern, not something `preflight`/`prepare` does on a caller's behalf) — P1/P2/P3's own unit
/// tests never caught this because their shared `fixture()` helper pins the dataset itself before
/// ever calling `prepare`/`execute`, which the real `binding_publish_prepare` never did.
///
/// Pins **once, idempotently**: a dataset [`Dataset::content_pin`] already holds is left alone —
/// hashing is real, uncached-per-call IO/CPU work (`ContentPin::take` reads the whole file), so a
/// caller across several publish attempts on the same admitted dataset pays this cost once, not
/// once per attempt.
///
/// **The gap this doc comment used to name as owed is CLOSED, RELEASE-0.1 item 10 (DECISIONS-PENDING
/// entry 7's ruled pre-fix).** This function is now a thin wrapper over
/// [`ensure_pinned_with_progress`] with `on_progress: None`, kept for callers (and this module's own
/// older tests) that do not need the pin-progress sink; `commands.rs`'s real
/// `binding_publish_prepare` calls [`prepare_with_progress`] directly, which calls
/// [`ensure_pinned_with_progress`] with a real cancel token — registered in [`RunningPublishes`]
/// under [`prepare_cancel_key`] BEFORE the blocking call starts, the same `RunningPublishes`
/// precedent [`commands.rs`]'s own `binding_publish_execute` established — and a real progress sink
/// that emits [`PUBLISH_PROGRESS_EVENT`] with [`PIN_PHASE_LABEL`] and the bytes-hashed fraction. A
/// Cancel during "Preparing…" now reaches this phase and aborts it with a typed
/// [`PrepareOutcome::Cancelled`] rather than running to completion unreachably. `docs/01` principle
/// 7's progress/cancel clause is met for the pin phase now, including at `docs/07`'s hero-slice
/// scale (5 GB); see this crate's `frontends/shell/MANUAL-WALKTHROUGH.md` Part M, row M10, for the
/// operator-facing record of what changed.
///
/// **The record elsewhere still says otherwise, and that is the human's to correct, not this
/// crate's**: ADR-024's Consequences list still records this gap as open as of its acceptance —
/// quoting the sentence this doc comment used to carry — and an accepted ADR is append-only, so an
/// appended dated note is queued rather than written here (DECISIONS-PENDING entry 63).
///
/// No production call site remains in this crate (`commands.rs` now calls
/// [`ensure_pinned_with_progress`] itself, via [`prepare_with_progress`]) — this function's only
/// remaining caller is this module's own test suite, the same disclosed situation [`prepare`]'s own
/// doc comment states for itself, above this one (`#[allow(dead_code)]` below is that).
#[allow(dead_code)]
pub fn ensure_pinned(dataset: &Dataset, cancel: &CancelToken) -> Result<(), String> {
    match ensure_pinned_with_progress(dataset, cancel, None) {
        EnsurePinnedOutcome::Ok => Ok(()),
        EnsurePinnedOutcome::Cancelled => Err(EngineError::Cancelled.to_string()),
        EnsurePinnedOutcome::Failed(message) => Err(message),
    }
}

/// The pin phase's own typed outcome — distinguishes "the operator cancelled" from "hashing
/// failed" so [`prepare_with_progress`] can report the former as [`PrepareOutcome::Cancelled`]
/// rather than folding it into a plain refusal message (RELEASE-0.1 item 10).
pub enum EnsurePinnedOutcome {
    /// Already pinned, or pinned successfully just now.
    Ok,
    /// The operator cancelled during "Preparing…". **ADR-006: the pin is not a side effect** —
    /// hashing reads the source, it writes nothing, so a cancelled pin leaves nothing behind to
    /// undo or clean up; the dataset's own [`Dataset::content_pin`] stays exactly what it was
    /// before this call (`None`, for the case this piece's own tests exercise).
    Cancelled,
    Failed(String),
}

/// As [`ensure_pinned`], reporting bytes hashed / total through `on_progress` as the hash proceeds
/// and returning a typed [`EnsurePinnedOutcome`] instead of folding cancellation into a plain
/// string error.
pub fn ensure_pinned_with_progress(
    dataset: &Dataset,
    cancel: &CancelToken,
    on_progress: Option<&mut dyn FnMut(u64, u64)>,
) -> EnsurePinnedOutcome {
    if dataset.content_pin().is_some() {
        return EnsurePinnedOutcome::Ok;
    }
    match dataset.pin_content_observed(cancel, on_progress) {
        Ok(_) => EnsurePinnedOutcome::Ok,
        Err(EngineError::Cancelled) => EnsurePinnedOutcome::Cancelled,
        Err(e) => EnsurePinnedOutcome::Failed(e.to_string()),
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
/// **Resolved from the packaged resource directory FIRST, the dev-tree checkout path as a
/// fallback — RELEASE-0.1 item 3 closes the packaged-build gap this doc comment used to record as
/// owed, dated 2026-09-07.** `tauri.conf.json`'s `bundle.resources` now maps
/// `renderer/bundle-viewer/dist` onto a `bundle-viewer/` resource directory the packaged app
/// carries beside its executable, so a `tauri build` artifact can serve it — a plain `tauri dev`
/// run still resolves nothing under a resource directory (there isn't one), and falls through to
/// the dev-tree path exactly as before. Both paths are named in the refusal when neither holds.
///
/// **The `dist/*` resource glob is FLAT, not recursive** (release-cut fix batch nit): it copies
/// `dist/`'s immediate files (`index.html`, `app.js`, `NOTICE.txt` today) into `bundle-viewer/`,
/// never a `dist/**` glob. Correct while the viewer's own build emits no subdirectory; if that ever
/// changes (a future asset folder, say), the resource mapping and this resolution both need
/// revisiting together, not assumed to still work.
///
/// **Takes an already-resolved resource directory, not a `tauri::AppHandle`**, on this module's own
/// established discipline (`EventProgress`'s doc comment, above: "generic over a plain closure, not
/// `tauri::AppHandle` directly, so this stays testable without a live Tauri app") — the caller
/// (`commands.rs`) already holds an `AppHandle` and reads `app.path().resource_dir()` once, before
/// calling in; [`resolve_viewer_dir`] is the pure function the fallback ORDER is unit-tested
/// against, with no `AppHandle` and no filesystem I/O in the test at all.
pub fn bundled_viewer(
    resource_dir: Option<&std::path::Path>,
) -> Result<(ViewerAssets, ViewerLicenseInput), String> {
    let (_label, dir) = resolve_viewer_dir(resource_dir, |p| p.is_dir())?;
    let viewer = ViewerAssets::from_dir(&dir).map_err(|e| {
        format!(
            "the reference bundle viewer directory {} exists but could not be read ({e}) — run \
             `npm run build` in renderer/bundle-viewer again",
            dir.display()
        )
    })?;
    Ok((viewer, bundled_viewer_license()))
}

/// The dev-tree checkout path: `CARGO_MANIFEST_DIR` points at `frontends/shell/src-tauri` at
/// compile time; three `..` reaches the workspace root. This holds for `cargo tauri dev` and for a
/// manual walkthrough run from a checkout, whether or not anything is packaged.
fn dev_tree_viewer_dir() -> std::path::PathBuf {
    std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../renderer/bundle-viewer/dist")
}

/// The fallback order [`bundled_viewer`] resolves against, as a pure function of an injectable
/// "does this directory exist" predicate — no `AppHandle`, no real filesystem I/O, so
/// `resolver_tests` below can prove the ORDER (packaged resource directory tried before the
/// dev-tree path) without building the real viewer or faking a Tauri runtime.
fn resolve_viewer_dir(
    resource_dir: Option<&std::path::Path>,
    exists: impl Fn(&std::path::Path) -> bool,
) -> Result<(&'static str, std::path::PathBuf), String> {
    let mut candidates: Vec<(&'static str, std::path::PathBuf)> = Vec::new();
    if let Some(dir) = resource_dir {
        candidates.push(("the packaged resource directory", dir.join("bundle-viewer")));
    }
    candidates.push(("the dev-tree checkout path", dev_tree_viewer_dir()));

    for (label, dir) in &candidates {
        if exists(dir) {
            return Ok((*label, dir.clone()));
        }
    }

    // **The dev-tree path VALUE is suppressed from the refusal string when a resource dir was
    // supplied** (release-cut fix batch, MUST-FIX/SHOULD-FIX combined): `dev_tree_viewer_dir()`
    // bakes the BUILD MACHINE's own `CARGO_MANIFEST_DIR` (a compile-time constant) into whatever
    // string this function returns — fine for a `tauri dev` refusal read on that same machine, but
    // a real path-disclosure once it ships inside a packaged binary's error text, naming a
    // directory that means nothing on the operator's own machine while leaking one from whoever
    // built the installer. The CANDIDATE is still named (both labels stay in the string, in
    // candidate order — `resolver_tests::the_packaged_labels_index_precedes_the_dev_tree_labels_
    // index_in_the_refusal_string` pins this), only its specific path value is replaced.
    // `resource_dir` being `Some` is exactly the packaged-build signal — a plain `tauri dev` run
    // never supplies one (`commands.rs`'s own call sites).
    let tried = candidates
        .iter()
        .map(|(label, dir)| {
            if resource_dir.is_some() && *label == "the dev-tree checkout path" {
                format!("{label} (not applicable to a packaged installation)")
            } else {
                format!("{label} ({})", dir.display())
            }
        })
        .collect::<Vec<_>>()
        .join(", or ");
    // **The remedy is packaged-context when a resource dir was supplied, developer-context only
    // when it was not (release-cut fix batch, reviewer nit).** `run \`npm run build\`` tells an
    // end user to run a build step nothing about their installed app can act on; `resource_dir`
    // being `Some` is the same packaged-build signal the dev-tree-value suppression above already
    // keys on. When `resource_dir` is `None` this is a `tauri dev` run from a checkout, where the
    // developer remedy is exactly the right one.
    let remedy = if resource_dir.is_some() {
        "the viewer resources are missing from the installed application — reinstall Spatial IDE, \
         or the install is incomplete"
    } else {
        "run `npm run build` in renderer/bundle-viewer first"
    };
    Err(format!("the reference bundle viewer is not built at {tried} — {remedy}"))
}

#[cfg(test)]
mod resolver_tests {
    use super::*;

    #[test]
    fn the_packaged_resource_directory_is_tried_before_the_dev_tree_path() {
        let resource = std::path::Path::new("Z:/pretend/resources");
        let (label, dir) =
            resolve_viewer_dir(Some(resource), |p| p == resource.join("bundle-viewer")).unwrap();
        assert_eq!(label, "the packaged resource directory");
        assert_eq!(dir, resource.join("bundle-viewer"));
    }

    #[test]
    fn the_dev_tree_path_is_the_fallback_when_the_resource_directory_does_not_hold_the_viewer() {
        let resource = std::path::Path::new("Z:/pretend/resources");
        let dev_tree = dev_tree_viewer_dir();
        let (label, dir) = resolve_viewer_dir(Some(resource), |p| p == dev_tree).unwrap();
        assert_eq!(label, "the dev-tree checkout path");
        assert_eq!(dir, dev_tree);
    }

    #[test]
    fn no_resource_directory_at_all_tries_only_the_dev_tree_path() {
        // `tauri dev`: `app.path().resource_dir()` has nothing packaged-resource-shaped to
        // resolve, and the caller passes `None` rather than a directory that was never packaged.
        let dev_tree = dev_tree_viewer_dir();
        let (label, dir) = resolve_viewer_dir(None, |p| p == dev_tree).unwrap();
        assert_eq!(label, "the dev-tree checkout path");
        assert_eq!(dir, dev_tree);
    }

    #[test]
    fn neither_path_existing_names_both_labels_in_the_refusal_but_suppresses_the_dev_tree_value() {
        let resource = std::path::Path::new("Z:/pretend/resources");
        let err = resolve_viewer_dir(Some(resource), |_| false).unwrap_err();
        assert!(err.contains("the packaged resource directory"), "{err}");
        assert!(err.contains("the dev-tree checkout path"), "{err}");
        assert!(err.contains(&resource.join("bundle-viewer").display().to_string()), "{err}");
        // SHOULD-FIX (release-cut fix batch): the dev-tree path's own VALUE — the build machine's
        // `CARGO_MANIFEST_DIR` — must NOT appear in a refusal a packaged binary can emit.
        assert!(
            !err.contains(&dev_tree_viewer_dir().display().to_string()),
            "the build machine's own dev-tree path leaked into a packaged-context refusal: {err}"
        );
        assert!(err.contains("not applicable to a packaged installation"), "{err}");
        // Reviewer nit, release-cut fix batch: a packaged context (resource_dir Some) gets a
        // packaged-context remedy, never the developer instruction to run an npm build.
        assert!(err.contains("reinstall Spatial IDE"), "{err}");
        assert!(!err.contains("npm run build"), "{err}");
    }

    #[test]
    fn no_resource_directory_at_all_and_no_dev_tree_path_gets_the_developer_remedy() {
        // The mirror of the test above: `resource_dir` is `None` (a `tauri dev` run from a
        // checkout where the dev-tree path itself does not hold either) — the remedy stays
        // developer-context, since there is no installed app to tell an end user to reinstall.
        let err = resolve_viewer_dir(None, |_| false).unwrap_err();
        assert!(err.contains("the dev-tree checkout path"), "{err}");
        assert!(!err.contains("the packaged resource directory"), "{err}");
        assert!(err.contains("run `npm run build` in renderer/bundle-viewer first"), "{err}");
        assert!(!err.contains("reinstall Spatial IDE"), "{err}");
    }

    /// **MUST-FIX 7 (release-cut fix batch): pins that the packaged resource directory is tried
    /// FIRST, not merely that it is admissible when the dev-tree path is excluded from the
    /// predicate.** Swapping the two `candidates.push` calls in `resolve_viewer_dir` would leave
    /// every OTHER test in this module green (each `exists` closure there matches only one
    /// specific path), because none of them puts both candidates in a state where either could
    /// win. This one does: with `exists` unconditionally `true`, both the packaged and the
    /// dev-tree directories "exist" — the WINNER is entirely a function of push order, and a
    /// swap would flip this assertion.
    #[test]
    fn when_both_paths_exist_the_packaged_resource_directory_wins_not_the_dev_tree_path() {
        let resource = std::path::Path::new("Z:/pretend/resources");
        let (label, dir) = resolve_viewer_dir(Some(resource), |_| true).unwrap();
        assert_eq!(label, "the packaged resource directory");
        assert_eq!(dir, resource.join("bundle-viewer"));
    }

    /// **MUST-FIX 7's other half: an index comparison, not a `contains` (which is order-blind).**
    /// Proves the packaged label is textually FIRST in the refusal string too — `contains` alone
    /// would pass under either order; this fails if the two candidates were ever emitted swapped.
    #[test]
    fn the_packaged_labels_index_precedes_the_dev_tree_labels_index_in_the_refusal_string() {
        let resource = std::path::Path::new("Z:/pretend/resources");
        let err = resolve_viewer_dir(Some(resource), |_| false).unwrap_err();
        let packaged_at = err.find("the packaged resource directory").expect("packaged label present");
        let dev_tree_at = err.find("the dev-tree checkout path").expect("dev-tree label present");
        assert!(
            packaged_at < dev_tree_at,
            "packaged label must precede the dev-tree label in the refusal string: {err}"
        );
    }
}

/// The reference bundle viewer's license declaration, split out from [`bundled_viewer`] so it can be
/// asserted on directly without a built `renderer/bundle-viewer/dist` (F-3, entry 49's own test —
/// `bundled_viewer` alone cannot be exercised without Node).
pub fn bundled_viewer_license() -> ViewerLicenseInput {
    ViewerLicenseInput {
        program: "Spatial IDE bundle viewer".into(),
        copyright: "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors".into(),
        license: "AGPL-3.0-or-later".into(),
        notice_path: "NOTICE.txt".into(),
        // Url, not WrittenOffer: the repository has been public since 2026-08-03 (CLAUDE.md's
        // "before any public code" did not hold in fact — ADR-009's corrigendum records the flip on
        // 2026-08-03), and ADR-017 Corrigendum 3's durable route now has somewhere real to point.
        // DECISIONS-PENDING entry 49 (2026-09-07) ruled this route for F-3; ADR-017's own corrigendum
        // records the same ruling.
        // `admit_viewer_license`'s `Url` arm (`kernel/src/publish/mod.rs:972-975`) requires `at` to
        // start with `http://` or `https://`, refusing with `PublishError::CorrespondingSourceNotDurable`
        // (`kernel/src/publish/error.rs:91`) otherwise — an `https://` URL satisfies it.
        corresponding_source: CorrespondingSource {
            kind: CorrespondingSourceKind::Url,
            at: "https://github.com/christopherdonini/spatial-ide".into(),
        },
    }
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
            // The `corresponding_source` half is taken from `bundled_viewer_license()` itself (not a
            // hand-copied duplicate), so this fixture cannot drift from the production writer.
            corresponding_source: bundled_viewer_license().corresponding_source,
        }
    }

    /// F-3 (DECISIONS-PENDING entry 49): the shell's bundle license notice names the public
    /// repository. Asserts against `bundled_viewer_license()` directly — the production writer, not
    /// a copy of it — so a revert of the writer to `WrittenOffer` fails this test without needing a
    /// built `renderer/bundle-viewer/dist`.
    ///
    /// **Guard proven by observation**: reverting `bundled_viewer_license()`'s `corresponding_source`
    /// to `CorrespondingSourceKind::WrittenOffer` / "Corresponding source is available from
    /// Christopher Donini on written request; this repository is not yet public." and re-running this
    /// test produced, verbatim, on the `kind` `assert_eq!` below (this function's first assertion):
    /// `assertion `left == right` failed` / `  left: WrittenOffer` / ` right: Url` — the revert was
    /// then restored.
    #[test]
    fn the_bundle_license_notice_names_the_public_repository_not_a_written_offer() {
        let license = bundled_viewer_license();
        assert_eq!(license.corresponding_source.kind, CorrespondingSourceKind::Url);
        assert_eq!(
            license.corresponding_source.at,
            "https://github.com/christopherdonini/spatial-ide"
        );
        // Reviewer nit: the substring negative checks ("not yet public", "written request") the
        // exact `assert_eq!` above already makes redundant were dropped — an exact match to the real
        // repository URL cannot also contain either phrase.
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
        // `confirmation_phrase` no longer exists on `PublishPromptData` (reviewer gate: it crossed
        // to JS unrendered, which made ADR-024's "never crosses into JS" claim false) -- derived
        // here from `destination_display`'s own basename, the SAME defence-in-depth derivation
        // `e2e/publish.mjs` now performs, so this test fixture exercises the identical path a real
        // caller (or a script) would.
        let phrase = Path::new(&prompt.destination_display)
            .file_name()
            .expect("destination_display names a real final component")
            .to_string_lossy()
            .to_string();
        (grants, store, attempt_id, phrase)
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

    // ---------------------------------------------------------------------------------------
    // ADR-017's Exposure review, 2026-08-17, condition 1 -- the plain-outcome sentence
    // ---------------------------------------------------------------------------------------

    /// **G3's own binding condition**, proven through `prepare`'s own real code path: the sentence
    /// names the destination's own basename and parent, and every noun the piece's own template
    /// names (folder, data partitions, the viewer page, a manifest) -- while never carrying a row
    /// or partition NUMBER, because `preflight` has not read any data yet at this point and
    /// inventing one would be exactly the unmeasured claim ADR-018/docs/08 forbid.
    #[test]
    fn the_outcome_summary_names_the_real_destination_and_never_invents_a_row_or_partition_count() {
        let d = workspace("outcome-summary");
        let ds = fixture(&d, 20);
        let grants = Mutex::new(GrantSet::new());
        let store = PendingAttempts::new();
        let dest = d.join("my-parcels");

        let outcome = prepare(
            &grants, &store, ds, "parcels".into(), STYLE.into(), PublishScope::WholeFile, false,
            viewer(), viewer_license(), dest.clone(), "2026-08-16T10:00:00Z".into(),
        );
        let PrepareOutcome::Prompt { prompt, .. } = outcome else { panic!("expected a prompt") };

        assert!(
            prompt.outcome_summary.contains("my-parcels"),
            "must name the destination's own basename: {}",
            prompt.outcome_summary
        );
        let parent_display = dest.parent().unwrap().display().to_string();
        assert!(
            prompt.outcome_summary.contains(&parent_display),
            "must name the destination's own parent: {}",
            prompt.outcome_summary
        );
        for word in ["folder", "data partition", "viewer", "manifest"] {
            assert!(
                prompt.outcome_summary.to_lowercase().contains(word),
                "outcome_summary missing {word:?}: {}",
                prompt.outcome_summary
            );
        }
        // **Never an invented row/partition COUNT** -- not "no digit anywhere" (a real destination
        // path may legitimately carry digits, e.g. `e2e/publish.mjs`'s own timestamp-tagged
        // directories; asserting that in this suite's own earlier draft was wrong, caught by the
        // E2E run against a real path). The precise claim: no "<N> rows"/"<N> partition(s)" figure,
        // because none is known yet at `prepare` time.
        let lower = prompt.outcome_summary.to_lowercase();
        assert!(
            !has_counted_word(&lower, "row") && !has_counted_word(&lower, "partition"),
            "outcome_summary must carry no row/partition COUNT at prepare time: {}",
            prompt.outcome_summary
        );
    }

    /// Whether `text` contains a digit immediately (whitespace aside) preceding `word` (or its
    /// plural, since `word` -- "row"/"partition" -- is itself a prefix of the plural spelling) --
    /// i.e. a claimed COUNT, not merely the word itself (`the_outcome_summary_...`'s own test,
    /// above, wants "the selected rows" to pass and "10 rows" to fail).
    fn has_counted_word(text: &str, word: &str) -> bool {
        text.match_indices(word).any(|(i, _)| {
            text[..i].trim_end().chars().next_back().is_some_and(|c| c.is_ascii_digit())
        })
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

    // ---------------------------------------------------------------------------------------
    // P2: progress + cancel
    // ---------------------------------------------------------------------------------------

    #[test]
    fn execute_with_progress_emits_every_phase_reached_stamped_with_the_right_attempt_id() {
        let _guard = env_lock();
        let d = workspace("progress-events");
        let log = d.join("audit.jsonl");
        std::env::set_var(spatial_kernel::permission::AUDIT_LOG_ENV, &log);

        let (grants, store, attempt_id, phrase) = prepared(&d, "progress");
        let phases: StdMutex<Vec<(String, &'static str)>> = StdMutex::new(Vec::new());
        let progress = EventProgress::new(attempt_id.clone(), |event: PublishProgressEvent| {
            phases.lock().unwrap_or_else(|e| e.into_inner()).push((event.attempt_id, event.phase));
        });

        let outcome =
            execute_with_progress(&grants, &store, &attempt_id, &phrase, &CancelToken::new(), Some(&progress));
        assert!(matches!(outcome, ExecuteOutcome::Success { .. }), "got {outcome:?}");

        let recorded = phases.into_inner().unwrap_or_else(|e| e.into_inner());
        assert!(!recorded.is_empty(), "expected at least one phase event on a real successful publish");
        assert!(
            recorded.iter().all(|(id, _)| id == &attempt_id),
            "every event must be stamped with THIS attempt's own id, never another's: {recorded:?}"
        );
        // Not the full fixed phase sequence (a future kernel-side phase addition/reordering is not
        // this shell test's contract to pin) — only that a real, late phase this run must reach on
        // a success actually crossed, proving the observer is wired into the real call, not a stub
        // that would pass on zero events too.
        let phase_names: Vec<&str> = recorded.iter().map(|(_, p)| *p).collect();
        assert!(phase_names.contains(&"writing-manifest"), "{phase_names:?}");
    }

    #[test]
    fn running_publishes_cancel_is_a_lookup_not_an_error_on_a_miss() {
        let running = RunningPublishes::new();
        assert!(!running.cancel("nope"), "cancelling an id never inserted must not be an error, just false");

        let token = CancelToken::new();
        running.insert("a".into(), token.clone());
        assert_eq!(running.len(), 1);
        assert!(!token.is_cancelled());

        assert!(running.cancel("a"), "a known id must be found and cancelled");
        assert!(token.is_cancelled(), "cancel() on the registry's own clone must flip the SAME token's flag");

        running.remove("a");
        assert_eq!(running.len(), 0);
        assert!(!running.cancel("a"), "after remove, the same id is a miss again");
    }

    // ---------------------------------------------------------------------------------------
    // P4: the real gap `e2e/publish.mjs` found -- nothing pinned before this fix
    // ---------------------------------------------------------------------------------------

    /// **Deliberately does NOT use the shared `fixture()` helper above**, because that helper
    /// pins the dataset itself (`fixture()`'s own body) -- which is exactly what hid this bug from
    /// every P1/P2/P3 unit test. This dataset starts genuinely unpinned, the way `open_dataset`
    /// actually leaves one.
    fn unpinned_fixture(dir: &Path) -> Dataset {
        let path = dir.join("parcels.parquet");
        write_geoparquet(
            &path,
            &FixtureSpec {
                features: 10,
                attributes: AttributeMode::CategoricalZone,
                crs_mode: CrsMode::DeclaredLv95,
                identity: IdentityMode::NativeUnique,
                ..Default::default()
            },
        )
        .unwrap();
        Dataset::open(&path).unwrap()
    }

    #[test]
    fn ensure_pinned_pins_an_unpinned_dataset_and_is_idempotent_on_an_already_pinned_one() {
        let d = workspace("ensure-pinned");
        let ds = unpinned_fixture(&d);
        assert!(ds.content_pin().is_none(), "a freshly opened dataset starts unpinned");

        ensure_pinned(&ds, &CancelToken::new()).expect("pins successfully");
        let first_hash = ds.content_pin().expect("a pin now exists").hash().to_string();
        assert!(!first_hash.is_empty());

        // A second call on an already-pinned dataset must not replace the pin (real IO/CPU cost;
        // `ensure_pinned`'s own doc comment: "once, idempotently").
        ensure_pinned(&ds, &CancelToken::new()).expect("a second call is a no-op, not an error");
        assert_eq!(
            ds.content_pin().unwrap().hash().to_string(),
            first_hash,
            "the existing pin must be left alone, never recomputed"
        );
    }

    /// The regression itself, proven the way `a_row_predicate_refuses_through_prepare_with_the_p0_message`
    /// proves P0's refusal: through the module's own real code path, on a dataset nothing pinned --
    /// this is what `SourceNotPinned` looked like to every real operator before that fix, and what
    /// `binding_publish_prepare`/`binding_publish_prepare_e2e_destination` must never do again.
    ///
    /// **Retargeted by SF3 (this batch's reviewer gate), not weakened.** `prepare` now delegates to
    /// `prepare_with_progress` (that function's own doc comment says why), so it PINS an unpinned
    /// dataset instead of refusing -- exactly what the real command does. The refusal itself is
    /// unchanged and still reached through the pin-free tail, `prepare_with_query`, which is the
    /// function that actually carries the property: reach `publish::preflight` without a pin and it
    /// refuses. Both halves are asserted here, so the pair cannot silently drift apart.
    #[test]
    fn an_unpinned_dataset_still_refuses_through_the_pin_free_path_but_prepare_now_pins_it() {
        let d = workspace("unpinned-refuses");
        let ds = Arc::new(unpinned_fixture(&d));
        let grants = Mutex::new(GrantSet::new());
        let store = PendingAttempts::new();

        // The pin-free tail, unchanged: no pin, `SourceNotPinned`.
        let refused = prepare_with_query(
            &grants, &store, ds.clone(), "parcels".into(), STYLE.into(), PublishScope::WholeFile.to_query(),
            PublishScope::WholeFile.row_scope_sentence(), false, viewer(), viewer_license(),
            d.join("out-pinless"), "2026-08-16T10:00:00Z".into(),
        );
        match refused {
            PrepareOutcome::Refused { message } => {
                assert!(message.contains("pin"), "{message}");
            }
            other => panic!("expected SourceNotPinned refusal on an unpinned dataset, got {other:?}"),
        }
        assert!(ds.content_pin().is_none(), "the refusing path must not have pinned anything");

        // `prepare`, since SF3: the same shipped path the command takes -- it pins, then prompts.
        let prompted = prepare(
            &grants, &store, ds.clone(), "parcels".into(), STYLE.into(), PublishScope::WholeFile, false,
            viewer(), viewer_license(), d.join("out"), "2026-08-16T10:00:00Z".into(),
        );
        assert!(
            matches!(prompted, PrepareOutcome::Prompt { .. }),
            "prepare must pin an unpinned dataset itself now, got {prompted:?}"
        );
        assert!(ds.content_pin().is_some(), "...and the pin it took must actually be held");
    }

    // ---------------------------------------------------------------------------------------
    // MF2 (this batch's reviewer gate): the pin-progress emission gate.
    // ---------------------------------------------------------------------------------------

    /// The bound itself, at the shape `content_hash_observed` actually produces: one observation per
    /// 1 MiB read, over a total that is NOT a multiple of the emit interval (the 5 GB hero fixture's
    /// own byte count, `kernel/RESULTS.md` fifth section's fixture table: 5,004,376,705 B).
    ///
    /// Three properties, all load-bearing: at most one event per `PIN_PROGRESS_EMIT_INTERVAL_BYTES`
    /// read (so the count is bounded by the file's own size divided by the interval, plus the two
    /// always-crossing observations), the FIRST observation crosses, so the panel's Cancel control
    /// is up after one chunk rather than after 64 MiB, and the FINAL one crosses, so the readout
    /// ends at `total / total` rather than at whatever multiple of the interval came last. Delete
    /// the `bytes_done >= bytes_total` branch in `pin_progress_should_emit` and the final-observation
    /// assertion below fails; delete the `last_emitted == 0` branch and the first-observation
    /// assertion below fails.
    #[test]
    fn the_pin_progress_gate_bounds_the_event_count_and_always_emits_the_final_observation() {
        const TOTAL: u64 = 5_004_376_705; // the docs/07 hero fixture's own length
        const CHUNK: u64 = 1 << 20; // `index::content_hash_observed`'s own read buffer

        let mut emitted: Vec<u64> = Vec::new();
        let mut last_emitted = 0u64;
        let mut done = 0u64;
        while done < TOTAL {
            done = (done + CHUNK).min(TOTAL);
            if pin_progress_should_emit(done, TOTAL, last_emitted) {
                last_emitted = done;
                emitted.push(done);
            }
        }

        // The ungated shape, stated as arithmetic rather than asserted from memory:
        // 5,004,376,705 B / 1,048,576 B = 4,772 full buffers + a 572,033 B tail = 4,773 callbacks,
        // each of which used to become a Tauri event, a `setState` and a render.
        let observations = TOTAL.div_ceil(CHUNK);
        assert_eq!(observations, 4_773);
        // `+ 2`, not `+ 1`: the two observations that cross outside the step rule are the first one
        // and the final one (`pin_progress_should_emit`'s own doc comment, cases 1 and 2).
        let bound = TOTAL / PIN_PROGRESS_EMIT_INTERVAL_BYTES + 2;
        assert!(
            (emitted.len() as u64) <= bound,
            "at most one event per {PIN_PROGRESS_EMIT_INTERVAL_BYTES} B read, plus the first and the final one: got {} for a bound of {bound}",
            emitted.len()
        );
        assert_eq!(
            *emitted.first().unwrap(),
            CHUNK,
            "the first observation must always cross -- it is what puts the panel's Cancel control up"
        );
        assert_eq!(
            *emitted.last().unwrap(),
            TOTAL,
            "the final observation must always cross, whatever the step arithmetic says"
        );
        assert!(emitted
            .windows(2)
            .all(|w| w[1] - w[0] >= PIN_PROGRESS_EMIT_INTERVAL_BYTES || w[1] == TOTAL));
    }

    #[test]
    fn the_pin_progress_gate_holds_back_everything_inside_one_interval() {
        // Every case here is AFTER something has already been emitted (`last_emitted != 0`); the
        // first observation's own always-crosses rule is the test below this one.
        assert!(!pin_progress_should_emit(2 << 20, 5_000_000_000, 1 << 20), "1 MiB past the first event");
        assert!(!pin_progress_should_emit(64 << 20, 5_000_000_000, 1 << 20), "one MiB short of the interval");
        assert!(pin_progress_should_emit(65 << 20, 5_000_000_000, 1 << 20), "exactly the interval");
        // A short final read lands nowhere near an interval boundary and must still cross.
        assert!(pin_progress_should_emit(100, 100, 50), "the tail of a file smaller than one read buffer");
        assert!(
            pin_progress_should_emit(5_004_376_705, 5_004_376_705, 5_003_804_672),
            "the last MiB of the hero fixture, well inside the interval since the previous event"
        );
        // A `bytes_total` of 0 (unreadable metadata) has no final observation to recognize; the step
        // rule alone governs, and the bound still holds.
        assert!(!pin_progress_should_emit(2 << 20, 0, 1 << 20));
        assert!(pin_progress_should_emit(65 << 20, 0, 1 << 20));
    }

    /// **The first observation always crosses** — the reviewer's re-review, one-line case 1.
    ///
    /// `PublishPanel.tsx`'s `cancelControlVisible` renders the Cancel control only once a pin-phase
    /// event has arrived (its criterion is `state.phase !== null`), so what this rule buys is
    /// operator-visible: Cancel is up after the FIRST chunk the hash loop reads, not after the first
    /// 64 MiB. A statement about which observations cross, not about when anything happens in time —
    /// nothing here is measured (ADR-018: no rate, no ETA, and this is neither).
    ///
    /// Mutation: delete the `last_emitted == 0` branch from `pin_progress_should_emit` and every
    /// assertion in this test fails.
    #[test]
    fn the_first_observation_always_crosses_so_cancel_is_up_after_the_first_chunk() {
        const CHUNK: u64 = 1 << 20; // `index::content_hash_observed`'s own read buffer

        assert!(
            pin_progress_should_emit(CHUNK, 5_004_376_705, 0),
            "one 1 MiB chunk into the 5 GB hero fixture, nothing emitted yet"
        );
        // The same, for a source whose length could not be read at all.
        assert!(pin_progress_should_emit(CHUNK, 0, 0), "unreadable metadata does not suppress the first event");
        // And it is the FIRST one only: the chunk after it is back under the step rule.
        assert!(!pin_progress_should_emit(2 * CHUNK, 5_004_376_705, CHUNK));
    }

    /// **A source that grows past its open-time total emits once** — the reviewer's re-review,
    /// one-line case 2's guard.
    ///
    /// `content_hash_observed` reads the length once at open time via `File::metadata` and never
    /// re-measures (that function's own doc comment), so a file appended to while it is being hashed
    /// keeps producing observations after `bytes_done` has passed `bytes_total`. Without
    /// `last_emitted < bytes_total` on the final-observation branch, EVERY one of those crosses —
    /// the per-chunk flood MF2 exists to prevent, on exactly the tail where the bound is supposed to
    /// hold.
    ///
    /// Mutation: delete `&& last_emitted < bytes_total` and the over-total count below is 11, not 1.
    #[test]
    fn a_source_that_grows_past_its_open_time_total_emits_the_final_observation_once() {
        const CHUNK: u64 = 1 << 20;
        const TOTAL: u64 = 100 << 20; // the length at open time
        const GREW_TO: u64 = 110 << 20; // what the hash loop actually reads

        let mut over_total: Vec<u64> = Vec::new();
        let mut last_emitted = 0u64;
        let mut done = 0u64;
        while done < GREW_TO {
            done += CHUNK;
            if pin_progress_should_emit(done, TOTAL, last_emitted) {
                last_emitted = done;
                if done >= TOTAL {
                    over_total.push(done);
                }
            }
        }

        assert_eq!(
            over_total,
            vec![TOTAL],
            "exactly one observation crosses at or past the open-time total, and it is the crossing one"
        );
    }

    // ---------------------------------------------------------------------------------------
    // M4 (this batch's reviewer gate): the registry entry a finished prepare must not leave behind.
    // ---------------------------------------------------------------------------------------

    /// The prepare key is reachable WHILE the body runs and absent after it returns -- **whatever
    /// the outcome**, which is why this runs the same assertion over a prompt, a refusal and a
    /// cancellation. Delete `running.remove(key)` from `with_registered_cancel` and every case
    /// fails.
    #[tokio::test]
    async fn a_registered_cancel_key_is_gone_from_running_publishes_after_any_outcome() {
        for outcome in [
            PrepareOutcome::Prompt { attempt_id: "att_1".into(), prompt: prompt_stub() },
            PrepareOutcome::Refused { message: "refused".into() },
            PrepareOutcome::Cancelled,
        ] {
            let running = RunningPublishes::new();
            let key = prepare_cancel_key("ds_abc123");
            let (registry, lookup) = (&running, key.as_str());
            let returned = with_registered_cancel(&running, &key, move |cancel| async move {
                assert!(
                    registry.cancel(lookup),
                    "the token must be reachable under its own key while the body runs"
                );
                assert!(cancel.is_cancelled(), "...and that lookup must reach THIS token, not a copy");
                outcome
            })
            .await;
            assert!(
                matches!(returned, PrepareOutcome::Prompt { .. } | PrepareOutcome::Refused { .. } | PrepareOutcome::Cancelled),
                "the body's own value is returned unchanged"
            );
            assert_eq!(
                running.len(),
                0,
                "a finished prepare must leave no entry behind -- a later cancel under the same key \
                 would otherwise 'cancel' something already over"
            );
            assert!(!running.cancel(&key), "and the key must no longer resolve to anything");
        }
    }

    /// A minimal `PublishPromptData` for the registry test above -- it never renders or crosses a
    /// wire there, it only stands in for "some successful outcome".
    fn prompt_stub() -> PublishPromptData {
        PublishPromptData {
            operation: "publish",
            class: 3,
            reversibility: "irreversible",
            source_name: "parcels".into(),
            source_content_hash: "sha256:abc".into(),
            style_hash: "sha256:def".into(),
            destination_display: "C:\\out\\bundle".into(),
            grantor: "os-user test".into(),
            grant_remaining_s: 120,
            row_scope: "row scope: the whole file".into(),
            filter_scope: None,
            outcome_summary: "a stub".into(),
        }
    }

    // ---------------------------------------------------------------------------------------
    // Reviewer gate (S1): the 64-grant ceiling never applies to a real session
    // ---------------------------------------------------------------------------------------

    /// **S1, this cut's own reviewer gate**: before `execute_with_progress` evicted a consumed
    /// grant (`GrantSet::remove_matching`), the SAME shared `GrantSet` this shell keeps for its
    /// whole session (unlike `publish-bundle`'s one-grant-one-process shape) only ever grew, and
    /// the 65th `prepare` in a session refused `GrantCeilingExceeded` forever. Seventy real
    /// prepare-then-execute cycles, all against ONE shared `grants`/`store` pair (mirroring the
    /// shell's own managed state, which is exactly one `Mutex<GrantSet>` for the whole app), all
    /// succeeding, is the regression test: `MAX_GRANTS` is 64, so a 65th-or-later success here is
    /// only possible because consumed grants stopped accumulating.
    #[test]
    fn seventy_sequential_prepare_execute_cycles_never_hit_the_grant_ceiling() {
        let _guard = env_lock();
        let d = workspace("seventy-cycles");
        let log = d.join("audit.jsonl");
        std::env::set_var(spatial_kernel::permission::AUDIT_LOG_ENV, &log);

        let grants = Mutex::new(GrantSet::new());
        let store = PendingAttempts::new();
        let ds = fixture(&d, 10);

        const CYCLES: usize = 70; // > MAX_GRANTS (64, spatial_kernel::permission::MAX_GRANTS)
        for i in 0..CYCLES {
            let dest = d.join(format!("out-{i}"));
            let outcome = prepare(
                &grants,
                &store,
                ds.clone(),
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
                panic!("prepare #{i} refused (a GrantSet-ceiling regression?): {outcome:?}")
            };
            let phrase = Path::new(&prompt.destination_display)
                .file_name()
                .expect("destination_display names a real final component")
                .to_string_lossy()
                .to_string();
            let exec = execute(&grants, &store, &attempt_id, &phrase);
            assert!(matches!(exec, ExecuteOutcome::Success { .. }), "execute #{i} did not succeed: {exec:?}");
        }
    }

    // ---------------------------------------------------------------------------------------
    // RELEASE-0.1 item 10 (DECISIONS-PENDING entry 7's ruled pre-fix): the cancellable,
    // progress-reported pin phase, and the ADR-025 checks reordered ahead of it.
    // ---------------------------------------------------------------------------------------

    /// **Typed outcome, no side effect (ADR-006: the pin is not a side effect).** A pre-cancelled
    /// token — deterministic, no timing race, the same style `engine/src/pin.rs`'s own
    /// `a_cancelled_pin_is_a_typed_cancellation_and_not_a_partial_hash` uses — so the fixture size
    /// does not matter: `content_hash_observed`'s own cancellation check runs before the first
    /// read either way.
    ///
    /// **No audit-record assertion here, and that absence is itself the point, stated rather than
    /// silently skipped**: `prepare_with_progress` never opens an `AuditLog` at all — only
    /// `execute_with_progress` does, deep inside `boundary::execute` (`kernel/src/permission/
    /// boundary.rs`'s own "what is not audited" enumeration is scoped to refusals `boundary::execute`
    /// itself can reach; step 1 there is `preflight`, called only from `execute`). This
    /// cancellation happens earlier still — inside the shell's own `binding_publish_prepare`,
    /// before `publish::prepare`'s pending-attempt store or any grant is ever touched — so it is
    /// outside that enumeration's scope by construction, not an omission from it.
    #[test]
    fn cancel_during_the_pin_phase_produces_a_typed_cancelled_outcome_with_no_side_effect() {
        let d = workspace("cancel-during-pin");
        let ds = Arc::new(unpinned_fixture(&d));
        let grants = Mutex::new(GrantSet::new());
        let store = PendingAttempts::new();

        let cancel = CancelToken::new();
        cancel.cancel();
        let outcome = prepare_with_progress(
            &grants,
            &store,
            ds.clone(),
            "parcels".into(),
            STYLE.into(),
            PublishScope::WholeFile,
            false,
            viewer(),
            viewer_license(),
            d.join("out"),
            "2026-08-16T10:00:00Z".into(),
            &cancel,
            None,
        );
        assert!(matches!(outcome, PrepareOutcome::Cancelled), "got {outcome:?}");
        assert!(
            ds.content_pin().is_none(),
            "a cancelled pin must leave content_pin() None -- nothing was written or hashed to completion"
        );
        assert_eq!(store.len(), 0, "no pending attempt may be stashed for a cancelled prepare");
    }

    /// The pin phase's own progress report, wired end to end through `prepare_with_progress` (the
    /// fixture-level version of `engine/src/index.rs`'s own
    /// `a_progress_observed_hash_reports_monotone_bytes_ending_at_the_total`, one layer up, through
    /// the function `commands.rs` actually calls) — and proof that a successful pin still reaches
    /// the `Prompt` outcome afterward, unaffected by the new pin-free check running first.
    #[test]
    fn prepare_with_progress_reports_the_pin_phase_and_still_reaches_a_prompt() {
        let d = workspace("prepare-with-progress");
        let ds = Arc::new(unpinned_fixture(&d));
        assert!(ds.content_pin().is_none());
        let grants = Mutex::new(GrantSet::new());
        let store = PendingAttempts::new();

        let mut seen: Vec<(u64, u64)> = Vec::new();
        let outcome = prepare_with_progress(
            &grants,
            &store,
            ds.clone(),
            "parcels".into(),
            STYLE.into(),
            PublishScope::WholeFile,
            false,
            viewer(),
            viewer_license(),
            d.join("out"),
            "2026-08-16T10:00:00Z".into(),
            &CancelToken::new(),
            Some(&mut |done, total| seen.push((done, total))),
        );
        assert!(matches!(outcome, PrepareOutcome::Prompt { .. }), "got {outcome:?}");
        assert!(!seen.is_empty(), "the pin phase must report at least one progress callback");
        assert_eq!(
            seen.last().unwrap().0,
            seen.last().unwrap().1,
            "the last report must end exactly at the total: {seen:?}"
        );
        assert!(
            seen.windows(2).all(|w| w[0].0 <= w[1].0),
            "bytes_done must be monotone non-decreasing: {seen:?}"
        );
        assert!(ds.content_pin().is_some(), "the pin must actually have run");
    }

    /// **The reordering itself, on this suite's own 20-feature fixture.** A source that
    /// forbids redistribution is a pin-free refusal (`publish::preflight_pinless`'s own license
    /// check, which runs before the ceiling check and needs no pin either) — `prepare_with_progress`
    /// must reach it WITHOUT ever pinning the dataset. `kernel/tests/publish.rs`'s own
    /// `a_dataset_whose_verified_row_count_exceeds_max_features_refuses_before_any_hash_is_taken`
    /// (`#[ignore]`d, release-mode only) proves the same property for the ADR-025 feature ceiling
    /// specifically, on the multi-million-row fixture that ceiling needs and this crate's own suite
    /// does not build; this one proves the general mechanism — the pin-free path — on a fixture that
    /// is built in every `cargo test`.
    #[test]
    fn a_license_refusal_reaches_prepare_with_progress_before_any_pin_is_taken() {
        let d = workspace("license-refusal-before-pin");
        let path = d.join("forbidden.parquet");
        write_geoparquet(
            &path,
            &FixtureSpec {
                features: 20,
                attributes: AttributeMode::CategoricalZone,
                crs_mode: CrsMode::DeclaredLv95,
                identity: IdentityMode::NativeUnique,
                license: spatial_engine::fixture::LicenseMode::ForbidsRedistribution,
                ..Default::default()
            },
        )
        .unwrap();
        let ds = Arc::new(Dataset::open(&path).unwrap()); // deliberately NOT pinned
        assert!(ds.content_pin().is_none());

        let grants = Mutex::new(GrantSet::new());
        let store = PendingAttempts::new();
        let outcome = prepare_with_progress(
            &grants,
            &store,
            ds.clone(),
            "parcels".into(),
            STYLE.into(),
            PublishScope::WholeFile,
            false,
            viewer(),
            viewer_license(),
            d.join("out"),
            "2026-08-16T10:00:00Z".into(),
            &CancelToken::new(),
            None,
        );
        match outcome {
            PrepareOutcome::Refused { message } => {
                assert!(message.contains("forbid"), "{message}");
            }
            other => panic!("expected a license refusal, got {other:?}"),
        }
        assert!(
            ds.content_pin().is_none(),
            "the whole point: a pin-free refusal must never take a pin as a side effect"
        );
        assert_eq!(store.len(), 0, "no pending attempt may be stashed for a refused prepare");
    }
}
