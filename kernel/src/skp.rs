// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **`SkpHost` — the five SKP v0 commands, meeting the engine and the data plane.**
//!
//! `protocol/skp` defines the wire shapes with zero dependency on `engine`, `protocol/data-plane`
//! or this crate; this module is where that changes on purpose. Every Tauri command handler in
//! `frontends/shell/src-tauri` is a thin wrapper that decodes a request, calls one method here, and
//! serializes the result — the same "frontends are clients only, no logic" discipline docs/02
//! states for the module boundary, applied one layer lower.
//!
//! See `protocol/skp/SKP-V0.md` for the design note and
//! `docs/adr/ADR-019-control-plane-admission-tickets.md` for the ticket mechanism `StreamRegistry`
//! implements.

use std::collections::{HashMap, HashSet};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use std::path::Path;

use spatial_data_plane::transport::{BatchSource, SourceCancel};
use spatial_engine::{
    AdmittedPredicate, AdmittedProjection, ArmOutcome, ArmedWatch, CancelToken, Dataset,
    EngineError, FilterError, PredicateAdmitError, ProjectionError, SourceWatchArm,
    TypeRefusalReason, ViewportQuery, WatchSignal, WatchSink,
};
use spatial_skp::v0::{
    CancelKey, CancelRequest, CancelResponse, CancelState, CheckComponent, ChecksState,
    CloseDatasetRequest, CloseDatasetResponse, CoverageState, CrsInfo, CrsUnit, DatasetHandle,
    DatasetSessionEnded, DecU64, DescribeRequest, DescribeResponse, EndReason as WireEndReason,
    Extent, FieldInfo, GeometryInfo, IdentityInfo, LicenseInfo, OpenDatasetRequest,
    OpenDatasetResponse, RowCount, SessionRef, SkpError, SourceChecks, SourceCoverage, SourceInfo,
    StreamHandle, ViewportQueryRequest, ViewportQueryResponse, SKP_VERSION,
};

use crate::{open_engine_stream, wrap_for_data_plane, Catalog};

/// `engine/SOURCE-WATCHER-PREREGISTRATION.md` §7: events enqueued and not yet emitted; each open
/// ends at most once.
pub const SESSION_END_EVENT_QUEUE_BOUND: usize = 64;

/// The channel the watcher's single emission point (`SessionInvalidator::end_generation`) sends
/// on, and the shell's `run` `setup` closure drains — one emitter thread, never a payload logged.
pub type SessionEndSender = std::sync::mpsc::SyncSender<DatasetSessionEnded>;
pub type SessionEndReceiver = std::sync::mpsc::Receiver<DatasetSessionEnded>;

/// A bounded channel for dataset-session-ended events (§7's declared bound). `try_send` never
/// blocks and never waits — a full queue loses the event and never skips or blocks the end
/// (§2b's single emission point; Decision 2).
pub fn session_end_channel() -> (SessionEndSender, SessionEndReceiver) {
    std::sync::mpsc::sync_channel(SESSION_END_EVENT_QUEUE_BOUND)
}

/// Why a dataset-session generation ended — the kernel's own record, never on the wire directly
/// (the wire's `EndReason`, `spatial_skp::v0::EndReason`, is the projection `end_reason_of` below
/// makes of this one).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SessionEndReason {
    ObservedChange,
    CoverageLost,
}

fn end_reason_of(r: SessionEndReason) -> WireEndReason {
    match r {
        SessionEndReason::ObservedChange => WireEndReason::ObservedChange,
        SessionEndReason::CoverageLost => WireEndReason::CoverageLost,
    }
}

/// The wire's `CancelState` is the projection `cancel_state_of` makes of [`CancelOutcome`]: an
/// exhaustive `match`, so a new outcome cannot reach the wire without a wire value.
fn cancel_state_of(o: CancelOutcome) -> CancelState {
    match o {
        CancelOutcome::Requested => CancelState::Requested,
        CancelOutcome::Unknown => CancelState::Unknown,
        CancelOutcome::AlreadyTerminal => CancelState::AlreadyTerminal,
    }
}

/// ADR-019: an unredeemed ticket is swept and its slot freed.
pub const TICKET_TTL: Duration = Duration::from_secs(30);
/// ADR-019, ADR-010 rule 6 (declared, not discovered): `viewport_query` mints tickets at gesture
/// rate under supersede-on-pan, and an unbounded pending set per dataset is exactly the failure a
/// declared ceiling exists to name in advance.
///
/// **Not the ceiling reached first in practice.** Every `Pending` ticket already holds a leased
/// `engine::pool::Class::Stream` connection (`SkpHost::viewport_query` builds the engine stream
/// *before* minting), and that pool's own `MAX_STREAM_CONNECTIONS` is 4 — so a dataset's fifth
/// concurrent pending ticket fails at the connection lease with `engine.connections_exhausted`
/// long before this constant's count is ever checked. This ceiling stays as the declared backstop
/// for whichever pool sizing ends up binding, per ADR-010 rule 6's "declared, not discovered" —
/// it is not dead, just usually not the one that fires (reviewer finding B5, this cut).
pub const MAX_PENDING_TICKETS: usize = 8;
/// B4 (reviewer, this cut): neither `Redeemed` nor `CancelledBeforeRedeem` has any other event that
/// ever removes its entry — unlike `Pending`, which the stream itself either redeems or lets expire
/// against [`TICKET_TTL`]. Left unbounded, `StreamRegistry`'s map would grow for the whole life of
/// the process. Evicting an entry this old trades away `cancel()`'s ability to reach an
/// exceptionally long-running *redeemed* stream after this window (it would report `unknown`
/// instead of forwarding the cancellation, the same as an always-unknown handle) for bounded
/// memory — accepted because docs/08's target datasets stream in well under five minutes, and an
/// abandoned client's own transport disconnect is what the data plane's own cleanup is for, not
/// this registry.
pub const TERMINAL_ENTRY_MAX_AGE: Duration = Duration::from_secs(300);

/// `state` in a [`CancelResponse`] (SKP-V0.md §1), projected onto the wire's closed
/// [`CancelState`] by `cancel_state_of` — no timestamp, counter or duration attaches to it
/// (ADR-004 Amendment 4).
pub enum CancelOutcome {
    Requested,
    Unknown,
    AlreadyTerminal,
}

struct PendingBuilt {
    source: Box<dyn BatchSource>,
    cancel: Arc<dyn SourceCancel>,
}

enum TicketState {
    /// Minted by `viewport_query`, not yet redeemed by the data plane. The engine stream already
    /// exists and is already validated — `viewport_query` built it synchronously before minting —
    /// so redemption costs a lock and a map removal, nothing more.
    Pending {
        built: PendingBuilt,
        dataset: String,
        minted_at: Instant,
    },
    /// Redeemed exactly once. `cancelled` is this registry's own record of whether `cancel` has
    /// been called on it — never inferred from the underlying `SourceCancel`, which exposes no way
    /// to ask. `redeemed_at` bounds this entry's own lifetime in the map (`TERMINAL_ENTRY_MAX_AGE`)
    /// — it is not a signal that the underlying stream has finished.
    Redeemed {
        dataset: String,
        cancel: Arc<dyn SourceCancel>,
        cancelled: bool,
        redeemed_at: Instant,
    },
    /// Was `Pending`, cancelled before a redemption ever arrived. A later redemption is refused —
    /// this is the whole of what closes the cancel-then-redeem race ADR-019 names.
    CancelledBeforeRedeem { cancelled_at: Instant },
}

/// The kernel's half of ADR-019: mints and redeems single-use, expiring stream tickets.
///
/// **Shared, not owned, by two callers.** `SkpHost::viewport_query` mints;
/// `EngineSourceFactory::ticket_only`'s `create` redeems. Both must hold the *same* `Arc` — see
/// `frontends/shell/src-tauri`'s app setup, which constructs one `StreamRegistry` and gives a clone
/// to each.
#[derive(Default)]
pub struct StreamRegistry {
    /// **Invariant (architect, PR #116 attempt 1, S1): no `TicketState` is ever dropped while this
    /// guard is held.** Every method below that removes or replaces an entry (`sweep_locked`,
    /// `cancel`'s and `cancel_all_for_dataset`'s `Pending` arms) moves the retired value out —
    /// `sweep_locked` into its returned `Vec`, `cancel`/`cancel_all_for_dataset` via
    /// `mem::replace` — and every caller drops that moved-out value only after this guard is
    /// released, before the method itself returns (see each method's own `// Entry 132` comment).
    /// `mint` and `redeem` also call `insert` under this guard: `mint` always inserts a
    /// freshly-minted [`StreamHandle`]'s key, and `redeem` inserts only immediately after removing
    /// the same key — both calls' returned `Option<TicketState>` is therefore always `None`, so
    /// neither call drops a live value via `insert`'s return.
    tickets: Mutex<HashMap<String, TicketState>>,
}

impl StreamRegistry {
    pub fn new() -> Arc<Self> {
        Arc::new(Self::default())
    }

    /// **DECISIONS-PENDING.md entry 132.** Returns the entries it swept instead of dropping them
    /// in place: a swept `Pending` entry's `PendingBuilt.source` may be a real `EngineSource` whose
    /// `Drop` re-enters `StreamRegistry::cancel` (via `SessionInvalidator::end_generation`) when its
    /// post-check has already recorded a source change — dropping it here, under the lock every
    /// caller below still holds when it calls this, would re-lock that same `Mutex` on the same
    /// thread and hang. Every caller drops the returned `Vec` only after releasing its guard (each
    /// one calls `drop(tickets)` before its own return path, and the swept entries fall out of scope
    /// after that).
    #[must_use]
    fn sweep_locked(tickets: &mut HashMap<String, TicketState>) -> Vec<TicketState> {
        let expired: Vec<String> = tickets
            .iter()
            .filter(|(_, state)| match state {
                TicketState::Pending { minted_at, .. } => minted_at.elapsed() > TICKET_TTL,
                TicketState::Redeemed { redeemed_at, .. } => {
                    redeemed_at.elapsed() > TERMINAL_ENTRY_MAX_AGE
                }
                TicketState::CancelledBeforeRedeem { cancelled_at } => {
                    cancelled_at.elapsed() > TERMINAL_ENTRY_MAX_AGE
                }
            })
            .map(|(k, _)| k.clone())
            .collect();
        expired
            .into_iter()
            .filter_map(|k| tickets.remove(&k))
            .collect()
    }

    /// Reclaim stale entries — a `Pending` ticket's leased connection among them — without waiting
    /// for `mint`/`redeem`/`cancel`/`cancel_all_for_dataset` to do it as an incidental side effect.
    ///
    /// **B5 (reviewer, this cut).** Every one of those four methods sweeps only *after* acquiring
    /// this registry's own lock, which is fine when reaching them costs nothing scarce — but
    /// `SkpHost::viewport_query` leases an `engine::pool::Class::Stream` connection *before* it
    /// ever calls `mint`, so once enough expired `Pending` tickets have exhausted that pool, a new
    /// `viewport_query` fails at the lease and never reaches a method that would have swept them.
    /// Without an entry point reachable *before* the lease, that lockout would be permanent rather
    /// than bounded by `TICKET_TTL`. Called at the top of `viewport_query`, before it leases.
    pub fn sweep_expired(&self) {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        let swept = Self::sweep_locked(&mut tickets);
        // Entry 132: release the lock before `swept`'s entries drop.
        drop(tickets);
        drop(swept);
    }

    /// Mint a ticket for an already-built, already-validated engine source. Refuses beyond
    /// [`MAX_PENDING_TICKETS`] pending tickets for this dataset — a declared ceiling, not a queue.
    pub fn mint(
        &self,
        dataset: &str,
        source: Box<dyn BatchSource>,
        cancel: Arc<dyn SourceCancel>,
    ) -> Result<StreamHandle, SkpError> {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        let swept = Self::sweep_locked(&mut tickets);
        let pending_for_dataset = tickets
            .values()
            .filter(|s| matches!(s, TicketState::Pending { dataset: d, .. } if d == dataset))
            .count();
        let result = if pending_for_dataset >= MAX_PENDING_TICKETS {
            Err(SkpError::too_many_pending_streams(MAX_PENDING_TICKETS))
        } else {
            let handle = StreamHandle::mint();
            tickets.insert(
                handle.as_str().to_string(),
                TicketState::Pending {
                    built: PendingBuilt { source, cancel },
                    dataset: dataset.to_string(),
                    minted_at: Instant::now(),
                },
            );
            Ok(handle)
        };
        // Entry 132: release the lock before `swept` (and, on the refusal arm, the un-inserted
        // `source`/`cancel` this call was passed) drop.
        drop(tickets);
        drop(swept);
        result
    }

    /// Redeem a ticket exactly once. Called by the data plane's `SourceFactory::create` — its
    /// `Result<_, String>` shape is that trait's, not this module's.
    pub fn redeem(
        &self,
        handle: &str,
    ) -> Result<(Box<dyn BatchSource>, Arc<dyn SourceCancel>), String> {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        let swept = Self::sweep_locked(&mut tickets);
        let result = match tickets.get(handle) {
            None => Err(format!(
                "ticket `{handle}` is unknown: never minted, already redeemed and gone, or \
                 expired after {TICKET_TTL:?}"
            )),
            Some(TicketState::CancelledBeforeRedeem { .. }) => Err(format!(
                "ticket `{handle}` was cancelled before it was redeemed"
            )),
            Some(TicketState::Redeemed { .. }) => Err(format!(
                "ticket `{handle}` was already redeemed; a ticket is single-use"
            )),
            Some(TicketState::Pending { .. }) => {
                let Some(TicketState::Pending { built, dataset, .. }) = tickets.remove(handle)
                else {
                    unreachable!("state checked immediately above, under the same lock");
                };
                // Not a drop-under-lock: `built.source`/`built.cancel` are moved out into `result`
                // below, owned by this function's caller once it unlocks — never dropped here.
                tickets.insert(
                    handle.to_string(),
                    TicketState::Redeemed {
                        dataset,
                        cancel: built.cancel.clone(),
                        cancelled: false,
                        redeemed_at: Instant::now(),
                    },
                );
                Ok((built.source, built.cancel))
            }
        };
        // Entry 132: release the lock before `swept`'s entries drop.
        drop(tickets);
        drop(swept);
        result
    }

    /// Cancel one ticket by its [`StreamHandle`] string.
    pub fn cancel(&self, handle: &str) -> CancelOutcome {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        let swept = Self::sweep_locked(&mut tickets);
        // Entry 132: the retired `Pending` state (if any) is moved out here via `mem::replace`
        // rather than dropped by `*state = ..`'s implicit drop of the old value — the old value may
        // be a real `EngineSource` whose `Drop` re-enters this same method (through
        // `SessionInvalidator::end_generation`) when its post-check found a source change, and doing
        // that under this call's own lock is exactly entry 132's hang.
        let mut retired: Option<TicketState> = None;
        let outcome = match tickets.get_mut(handle) {
            None => CancelOutcome::Unknown,
            Some(TicketState::CancelledBeforeRedeem { .. }) => CancelOutcome::AlreadyTerminal,
            Some(state @ TicketState::Pending { .. }) => {
                retired = Some(std::mem::replace(
                    state,
                    TicketState::CancelledBeforeRedeem {
                        cancelled_at: Instant::now(),
                    },
                ));
                CancelOutcome::Requested
            }
            Some(TicketState::Redeemed {
                cancel, cancelled, ..
            }) => {
                if *cancelled {
                    CancelOutcome::AlreadyTerminal
                } else {
                    // ADR-019's Consequences: reaches the producer's own CancelToken directly, the
                    // same one a data-plane CANCEL frame would reach — the two mechanisms converge.
                    // `cancel.cancel()` sets a flag and interrupts DuckDB (`engine/src/cancel.rs`);
                    // it does not drop the `TicketState`, and this arm takes no registry lock (it
                    // mutates the entry already held under this call's own guard).
                    cancel.cancel();
                    *cancelled = true;
                    CancelOutcome::Requested
                }
            }
        };
        // Release the lock before `swept` and `retired` drop.
        drop(tickets);
        drop(swept);
        drop(retired);
        outcome
    }

    /// Cancel every ticket — pending or redeemed — for one dataset. Returns how many were.
    pub fn cancel_all_for_dataset(&self, dataset: &str) -> u32 {
        let mut tickets = self.tickets.lock().unwrap_or_else(|e| e.into_inner());
        let swept = Self::sweep_locked(&mut tickets);
        // Entry 132: every retired `Pending` state is moved out here, for the same reason `cancel`
        // above moves its single one out — see that method's comment.
        let mut retired: Vec<TicketState> = Vec::new();
        let mut n = 0u32;
        for state in tickets.values_mut() {
            match state {
                TicketState::Pending { dataset: d, .. } if d == dataset => {
                    retired.push(std::mem::replace(
                        state,
                        TicketState::CancelledBeforeRedeem {
                            cancelled_at: Instant::now(),
                        },
                    ));
                    n += 1;
                }
                TicketState::Redeemed {
                    dataset: d,
                    cancel,
                    cancelled,
                    ..
                } if d == dataset && !*cancelled => {
                    cancel.cancel();
                    *cancelled = true;
                    n += 1;
                }
                _ => {}
            }
        }
        // Release the lock before `swept` and `retired` drop.
        drop(tickets);
        drop(swept);
        drop(retired);
        n
    }
}

/// **The authoritative ticket → dataset-session-generation mapping** (`§13 D`; Brief A boundary 4).
///
/// **What §13 G's naming rule actually required, stated as the code spells it.** The fact this
/// module owns is the *dataset-session* generation, and no symbol here is the bare word
/// `generation`: the type is `GenerationRegistry`, the field on [`SkpHost`] is `generations`, and
/// the methods are `mint_for_open`, `live_generation`, `attribute_ticket`, `begin_close`,
/// `invalidate`, `forget_dataset` and `attributed_ticket_count`. `dataset_session_generation` is the **term of art** this
/// doc comment and the preregistration use for it; it is deliberately not a symbol, because the
/// value it names never leaves this process and there is nothing for it to label.
///
/// The rule exists because `engine/src/pool.rs` already owns a connection **lease** generation
/// (`ConnectionFacts::lease_generation`, ADR-004 Amendment 4), and the two are unrelated facts —
/// a diff that reused the bare name would make the A2 grep read the wrong symbol (the proposed
/// ADR-016 Amendment 1's block-on-sight 3).
///
/// **The kernel side is authoritative and the client side mirrors it.** This is where a refusal is
/// decided; the shell mirrors by *live-ticket set* rather than by value, so **no generation value
/// crosses the wire** (boundary 9; A2/A3) and both sides fail closed independently.
///
/// **A generation is minted per open and is never persisted and never published.** It is a `u64`
/// counter in this process's memory: it is not a ResourceRef field — neither logical URI, content
/// hash, source revision, locator, cache status nor portability policy (ADR-005; `docs/11`) — and
/// no ADR-005 amendment is needed or implied, because nothing is stored and no grade is claimed.
///
/// **Only `mint_for_open` mints one** (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §2a;
/// round 23, item 2), carrying the reference its caller, `SkpHost::open_dataset`, returned to a
/// client. Nothing else inserts a live generation, so no generation carries a reference no client
/// holds.
#[derive(Default)]
pub struct GenerationRegistry {
    inner: Mutex<GenerationState>,
}

#[derive(Default)]
struct GenerationState {
    /// The generation currently live for each open dataset, paired with its kernel-minted
    /// [`SessionRef`] (Amendment 1: every generation carries one, never `Option`). Inserted only by
    /// [`GenerationRegistry::mint_for_open`], with the reference `open_dataset` returned to its
    /// client. A dataset absent from this map has no live generation — it never opened through
    /// `open_dataset`, its generation was invalidated, or it was closed.
    live: HashMap<String, (u64, SessionRef)>,
    /// Which generation each minted ticket belongs to. Boundary 4's "every batch is attributed to
    /// a generation via its ticket", held here rather than on the wire.
    /// `handle → (dataset, generation, when it was attributed)`. The instant is what
    /// [`GenerationRegistry::prune_locked`] bounds this map by, in the shape `StreamRegistry`
    /// already uses for its own entries.
    tickets: HashMap<String, (String, u64, Instant)>,
    /// Datasets whose generation was **ended by a detected change**.
    ///
    /// **Three states, not two, and the third is why this set exists.** A dataset absent from
    /// `live` is either one whose source was observed to have changed *or* one that is not open
    /// through `open_dataset` — never opened there, or closed. Collapsing the two would refuse
    /// `viewport_query` on a dataset that is merely not open with a message saying its file
    /// changed, which is a false statement about the file (`docs/01` principle 8). Only membership
    /// here refuses by the reason; the other answers `skp.unknown_dataset`.
    /// A mark is written only by an [`GenerationRegistry::invalidate`] that removed a live
    /// generation, so a closed or never-opened name is never marked.
    /// **This set is NOT pruned by age, and the reason is a correctness one rather than an
    /// oversight.** An entry leaves only on `mint_for_open` (the dataset was reopened) or
    /// `forget_dataset` (it was closed). Dropping one on a timer would let `live_generation`
    /// answer a dataset whose source was observed to have changed as merely not open — losing the
    /// reason its session ended, which is what the refusal exists to state — so the safe fix is
    /// not the small one and is not taken here.
    ///
    /// What it costs: one entry per dataset that was invalidated and then neither reopened nor
    /// closed, for the life of the process. Bounded by distinct dataset handles, and `close_dataset`
    /// is the ordinary end of every one of them. Recorded rather than fixed blind (P3 attempt-2
    /// should-fix).
    ///
    /// **`HashMap<String, SessionEndReason>`, not a `HashSet`** (`SOURCE-WATCHER-PREREGISTRATION.md`
    /// §2b's Reason section): the first mark stands — [`GenerationRegistry::invalidate`] never
    /// overwrites an existing entry, so [`GenerationRegistry::ended_reason`] always answers with the
    /// reason the generation actually ended for, not whichever call happened to race last.
    invalidated: HashMap<String, SessionEndReason>,
    /// Handles whose generation was **ended by a detected change**, so that a redemption arriving
    /// after the invalidation can be refused **by name** instead of being answered as though the
    /// ticket had merely expired (P3b §2c; Brief A boundary 4).
    ///
    /// **Why this map is necessary rather than decorative.** [`GenerationRegistry::invalidate`]
    /// removes the dataset's live generation and then `prune_locked` sweeps every attribution
    /// naming it, in the same call — so one line later a dead ticket is **indistinguishable from an
    /// unknown one** in `tickets`. Without this record `ticket_liveness` could never answer
    /// `EndedBySourceChange` for any handle, and the only honest answer left would be `Unknown`.
    ///
    /// **`(dataset, when it was ended)`, not the bare instant the preregistration declared.** The
    /// dataset is what lets `forget_dataset` and `mint_for_open` drop exactly this dataset's dead
    /// handles and no others — a reopen or a close must not silently retire another dataset's
    /// record. Recorded as a §10 deviation in `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`
    /// rather than taken silently.
    ///
    /// **Bounded by the same sum `prune_locked` already uses**, `TICKET_TTL +
    /// TERMINAL_ENTRY_MAX_AGE`, and by `forget_dataset`/`mint_for_open` — never by a timer that
    /// could resurrect a generation, which is what `invalidated` above must never be pruned by.
    /// Dropping an entry here only degrades the refusal to `StreamRegistry::redeem`'s own
    /// "unknown" answer for a handle nothing else in the process still knows about; it never
    /// admits a stream.
    ///
    /// `(dataset, reason, when it was ended)` — the reason added so
    /// [`GenerationRegistry::ticket_liveness`] can answer [`TicketLiveness::EndedByCoverageLoss`]
    /// as well as [`TicketLiveness::EndedBySourceChange`] (`SOURCE-WATCHER-PREREGISTRATION.md` §2b).
    dead_tickets: HashMap<String, (String, SessionEndReason, Instant)>,
    /// Names in the middle of a `close_dataset` (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`
    /// §2a). Set by [`GenerationRegistry::begin_close`] and cleared by
    /// [`GenerationRegistry::forget_dataset`]. While a name is here, `live_generation` answers
    /// [`NotLive::NotOpen`] and `attribute_ticket` refuses, so no ticket minted after the close
    /// began stays redeemable.
    ///
    /// **Never pruned by time**: a timer could let a closing name answer as live again. Bounded
    /// structurally (§7): at most one entry per `close_dataset` call in progress, plus the residual
    /// of a close that unwinds between `begin_close` and `forget_dataset`, which leaves that name
    /// refused as not open — what its caller asked for.
    closing: HashSet<String>,
    next: u64,
}

/// Why [`GenerationRegistry::live_generation`] has no live generation to answer with.
///
/// Its product caller is `SkpHost::viewport_query`'s mint step, which refuses on either value:
/// `Ended` by the reason the first mark recorded, `NotOpen` as `skp.unknown_dataset`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum NotLive {
    /// The dataset's generation was ended by a detected change or a coverage loss, and it has not
    /// been reopened.
    Ended(SessionEndReason),
    /// The dataset has no live generation and no end mark: it is not open through `open_dataset`,
    /// or its close has begun.
    NotOpen,
}

/// What the **dataset-session generation registry** knows about one ticket handle — three-valued,
/// deliberately, because two values would make the kernel fabricate a diagnosis.
///
/// The P3 attempt-2 defect this type exists to prevent, in the human's own words
/// (`DECISIONS-PENDING.md:44`, quoted in `engine/ADMISSION-PREREGISTRATION.md:742-744`): a guard
/// that "told a caller its source 'was observed to have changed' for any handle the map did not
/// know — expired, already redeemed, never minted — which is a diagnosis the kernel had not made
/// (`docs/01` principle 8)". [`TicketLiveness::Unknown`] is the third value that keeps that
/// statement unmade.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TicketLiveness {
    /// Attributed to this dataset's currently-live generation.
    Live,
    /// This handle's generation was ended because the source was observed to have changed. The
    /// only value a caller may refuse by name on.
    EndedBySourceChange,
    /// This handle's generation was ended because the advisory watch lost coverage of the source
    /// (`SOURCE-WATCHER-PREREGISTRATION.md` §2a) — never a claim that the file changed.
    EndedByCoverageLoss,
    /// This registry has **no record** of the handle — never minted, already swept, or minted
    /// against a `Catalog` entry opened through an entry point that never touched this registry.
    /// Says nothing at all about the file; the caller must answer from whatever else it knows
    /// (`StreamRegistry::redeem`'s own three refusals).
    Unknown,
}

impl GenerationRegistry {
    pub fn new() -> Arc<Self> {
        Arc::new(Self::default())
    }

    /// Mint a fresh generation for one open, carrying the [`SessionRef`] `open_dataset` already
    /// minted for it. Called once per successful `open_dataset`.
    ///
    /// Counts up and never reuses a value, so an invalidated generation can never be confused with
    /// a later one for the same dataset name — the handle is minted fresh per open too, but the
    /// two are independent and this does not rely on that.
    pub fn mint_for_open(&self, dataset: &str, session: SessionRef) -> u64 {
        let mut st = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        // Prunes like every other mutating method — this one was missed at attempt 2, so a process
        // that only ever opened datasets (never queried) accumulated attributions from earlier
        // generations. Safe here because pruning only drops entries naming generations that are
        // already dead.
        Self::prune_locked(&mut st);
        st.next += 1;
        let g = st.next;
        st.live.insert(dataset.to_string(), (g, session));
        // A fresh open clears an earlier invalidation for the same name: that is what reopening
        // *is*, and boundary 4's refusals say "until reopen" in as many words.
        st.invalidated.remove(dataset);
        // P3b §2c: and so does its dead-ticket record. A handle minted under the generation that
        // ended cannot be redeemed after a reopen anyway — `StreamRegistry` swept it long before —
        // so keeping the record past the reopen would only grow the map for the life of the
        // process. Scoped to this dataset: another dataset's dead handles are untouched.
        st.dead_tickets.retain(|_, (d, _, _)| d != dataset);
        g
    }

    /// The dataset's live generation. **It never mints one** (round 23, item 2): the only live
    /// generation is one `mint_for_open` inserted.
    ///
    /// Answers, in order: an end mark, `Err(NotLive::Ended(reason))` with the reason the first mark
    /// recorded (`SOURCE-WATCHER-PREREGISTRATION.md` §2b's Reason section); a close in progress,
    /// `Err(NotLive::NotOpen)`; a live generation, `Ok`; otherwise `Err(NotLive::NotOpen)`. It
    /// never resurrects an invalidated generation.
    pub fn live_generation(&self, dataset: &str) -> Result<u64, NotLive> {
        let mut st = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        Self::prune_locked(&mut st);
        if let Some(reason) = st.invalidated.get(dataset).copied() {
            return Err(NotLive::Ended(reason));
        }
        if st.closing.contains(dataset) {
            return Err(NotLive::NotOpen);
        }
        match st.live.get(dataset) {
            Some((g, _)) => Ok(*g),
            None => Err(NotLive::NotOpen),
        }
    }

    /// Attribute a freshly minted ticket to the dataset's live generation.
    ///
    /// Returns `false` when the dataset has **no** live generation, or its close has begun — the
    /// ticket is then not attributable and its caller must refuse rather than record it under a
    /// generation that does not exist or is being closed.
    pub fn attribute_ticket(&self, handle: &str, dataset: &str) -> bool {
        let mut st = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        Self::prune_locked(&mut st);
        if st.closing.contains(dataset) {
            return false;
        }
        let Some((g, _)) = st.live.get(dataset) else {
            return false;
        };
        let g = *g;
        st.tickets
            .insert(handle.to_string(), (dataset.to_string(), g, Instant::now()));
        true
    }

    /// How many ticket attributions this registry currently holds.
    ///
    /// **An instrument, and its only caller is the test suite — deliberately, and this is a named
    /// category in this tree rather than a dead `pub`.** `spatial_engine`'s
    /// `index_consultations()`, `row_group_consultations()` and `attribute_concatenations()` have
    /// exactly this shape for exactly this reason: the property under test is about the *shipped*
    /// code, and an accessor compiled only into a test build would let a claim be proven about a
    /// build nobody runs (`dataset.rs`'s own note on `INDEX_CONSULTATIONS`).
    ///
    /// What it exists for: the bound on this map (`prune_locked`) is **assertable** instead of
    /// asserted about in prose. It is not a rendering input, never reaches the wire, and carries no
    /// generation value.
    ///
    /// **Its callers, named so the caller-grep can verify this exemption rather than trust the
    /// words "test-only"** (the human's ruling of 2026-09-16, round 5 item 4) — all in
    /// `kernel/tests/session_generation.rs`:
    /// `dead_generation_attributions_are_pruned_rather_than_accumulating`,
    /// `a_ticket_is_attributable_only_under_a_live_generation`,
    /// `invalidate_returns_exactly_the_tickets_of_the_generation_it_ended`,
    /// `forget_dataset_removes_the_generation_the_invalidation_and_every_attribution`,
    /// `the_registry_is_consistent_when_two_threads_use_it_at_once`.
    pub fn attributed_ticket_count(&self) -> usize {
        let mut st = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        Self::prune_locked(&mut st);
        st.tickets.len()
    }

    /// **What this registry knows about one ticket handle — and nothing more** (P3b §2c).
    ///
    /// The three answers are exactly [`TicketLiveness`]'s, and the middle one is the only one a
    /// caller may refuse by name on. A handle this registry has no record of returns
    /// [`TicketLiveness::Unknown`], never a source-change diagnosis: the kernel does not say a file
    /// changed because it cannot find a ticket (`docs/01` principle 8; the attempt-2 defect the
    /// human's round-4 ruling removed, `engine/ADMISSION-PREREGISTRATION.md:742-744`).
    ///
    /// **Its product caller is `EngineSourceFactory::liveness_refusal`**, which
    /// `EngineSourceFactory::create_from_ticket` calls and which
    /// `EngineSourceFactory::redeem_or_liveness_refusal` calls again on a refusal, reached on every
    /// real START frame through `SourceFactory::create` (`EngineSourceFactory`'s impl, in
    /// `kernel/src/lib.rs`) and START's `factory.create` arm in `protocol/data-plane/src/server.rs`.
    /// This is not an instrument: it acts.
    pub fn ticket_liveness(&self, handle: &str) -> TicketLiveness {
        let mut st = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        Self::prune_locked(&mut st);
        if let Some((_, reason, _)) = st.dead_tickets.get(handle) {
            return match reason {
                SessionEndReason::ObservedChange => TicketLiveness::EndedBySourceChange,
                SessionEndReason::CoverageLost => TicketLiveness::EndedByCoverageLoss,
            };
        }
        // Checked against `live` rather than taken from the map's mere presence: `prune_locked`
        // above already drops attributions naming a dead generation, and this says the same thing a
        // second way rather than resting on that call's ordering.
        match st.tickets.get(handle) {
            Some((dataset, g, _)) if st.live.get(dataset).map(|(live_g, _)| live_g) == Some(g) => {
                TicketLiveness::Live
            }
            _ => TicketLiveness::Unknown,
        }
    }

    /// How many dead-ticket records this registry currently holds.
    ///
    /// **An instrument, and its only caller is the test suite** — the same named category
    /// [`GenerationRegistry::attributed_ticket_count`] above occupies, with the same justification:
    /// the property under test is the bound on a map the **shipped** build maintains, and an
    /// accessor compiled only into a test build would prove it about a build nobody runs. It is not
    /// a rendering input, never reaches the wire, carries no generation value, and **nothing
    /// branches on it** — `ticket_liveness` above is what acts.
    ///
    /// **Its callers, named so the caller-grep can verify this exemption rather than trust the
    /// words "test-only"** (the human's ruling of 2026-09-16, round 5 item 4) — both in
    /// `kernel/tests/session_generation.rs`:
    /// `the_dead_ticket_record_is_bounded`,
    /// `a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it`.
    pub fn dead_ticket_count(&self) -> usize {
        let mut st = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        Self::prune_locked(&mut st);
        st.dead_tickets.len()
    }

    /// Drop ticket attributions that can no longer matter — **the sibling discipline
    /// [`StreamRegistry::sweep_locked`] applies to its own map, applied here**.
    ///
    /// Two conditions, both of which make an entry dead rather than merely old:
    ///
    /// 1. **Older than [`TICKET_TTL`] plus [`TERMINAL_ENTRY_MAX_AGE`].** `StreamRegistry` itself
    ///    stops answering for a handle past that window (it evicts `Redeemed` entries at
    ///    `TERMINAL_ENTRY_MAX_AGE`), so an attribution outliving it is answering about a ticket
    ///    nothing else in the process still knows. The bound is the **sum** deliberately: a ticket
    ///    may sit `Pending` for a whole `TICKET_TTL` before it is redeemed and starts its own
    ///    terminal clock, and pruning at the shorter bound would forget a ticket that is still
    ///    live.
    /// 2. **Its generation is no longer the dataset's live one.** Such an entry can only ever
    ///    answer about a generation that has already ended, which is what its absence conveys just
    ///    as well, so keeping it buys nothing and costs memory.
    fn prune_locked(st: &mut GenerationState) {
        let max_age = TICKET_TTL + TERMINAL_ENTRY_MAX_AGE;
        let live = &st.live;
        st.tickets.retain(|_, (dataset, g, attributed_at)| {
            attributed_at.elapsed() <= max_age
                && live.get(dataset).map(|(live_g, _)| live_g) == Some(g)
        });
        // P3b §2c: the dead-ticket record, bounded by the **same sum** rather than by a second
        // value of its own (§7's declared table). Only condition 1 applies to it — a dead handle's
        // generation is dead by definition, so condition 2 would drop every entry the instant it
        // was written. Past this window `StreamRegistry` no longer answers for the handle either
        // (`sweep_locked`), so the refusal this record would have produced degrades to `redeem`'s
        // own "unknown" answer — a weaker statement, never a wrong one, and never an admission.
        st.dead_tickets
            .retain(|_, (_, _, ended_at)| ended_at.elapsed() <= max_age);
    }

    /// The reason this dataset's generation ended, if it has. Round 18 item 3: `describe`'s
    /// `session_end` reads this. The first mark stands — this is the reason [`Self::invalidate`]
    /// recorded on its **first** call for this dataset, never a later one.
    ///
    /// Product caller: the kernel's `describe` assembly.
    pub fn ended_reason(&self, dataset: &str) -> Option<SessionEndReason> {
        let mut st = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        Self::prune_locked(&mut st);
        st.invalidated.get(dataset).copied()
    }

    /// Mark `dataset` as closing — the first registry step of `SkpHost::close_dataset`
    /// (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §2c). From here until `forget_dataset`,
    /// `live_generation` answers [`NotLive::NotOpen`] and `attribute_ticket` refuses.
    ///
    /// **It does not remove the live generation**: an end recorded during the close still finds it
    /// and emits (ADR-035 Decision 3's close-time routes). Product caller: `close_dataset`.
    pub(crate) fn begin_close(&self, dataset: &str) {
        let mut st = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        st.closing.insert(dataset.to_string());
    }

    /// End a dataset's generation. `Some` exactly when this call removed the dataset's live
    /// generation (ADR-035 D3's transition report) — idempotent, so the pre-check and a post-check
    /// (or the watcher's sink) observing the same change do not double-report, and a source whose
    /// post-check fires on several concurrent tile streams ends one session rather than N.
    ///
    /// **The reference is taken under this guard, in the same step as the removal** — the report's
    /// `session` is `EndReport.session`, never absent (Amendment 1).
    ///
    /// **A mark is written only when a live generation is removed**
    /// (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §2a): with no live generation — a closed
    /// or never-opened name, or one already ended — this call writes nothing and returns `None`.
    ///
    /// **The first mark stands** (§2b's Reason section): if this dataset was already invalidated,
    /// `st.invalidated`'s existing entry is never overwritten by a later call's `reason` — the
    /// reason returned in the report (when one is returned) is always the first one recorded.
    pub fn invalidate(&self, dataset: &str, reason: SessionEndReason) -> Option<EndReport> {
        let mut st = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        let Some((g, session)) = st.live.remove(dataset) else {
            Self::prune_locked(&mut st);
            return None;
        };
        st.invalidated.entry(dataset.to_string()).or_insert(reason);
        let recorded_reason = st.invalidated[dataset];
        let ended: Vec<String> = st
            .tickets
            .iter()
            .filter(|(_, (d, tg, _))| d == dataset && *tg == g)
            .map(|(h, _)| h.clone())
            .collect();
        // **P3b §2c: moved into the dead-ticket record BEFORE the prune, which is the whole reason
        // that record exists.** `prune_locked` below sweeps these same attributions in this same
        // call, after which a dead ticket is indistinguishable from an unknown one in `tickets` —
        // so a redemption arriving a moment later could only ever be answered "unknown". Recording
        // them here is what lets `ticket_liveness` say the right one of `EndedBySourceChange` /
        // `EndedByCoverageLoss` for exactly the handles this call ended, and `Unknown` for every
        // other.
        let ended_at = Instant::now();
        for h in &ended {
            st.dead_tickets
                .insert(h.clone(), (dataset.to_string(), recorded_reason, ended_at));
        }
        // The generation these entries name is gone as of the line above, so `prune_locked`'s
        // second condition now sweeps them — collected first, because the caller still has to
        // cancel them.
        Self::prune_locked(&mut st);
        Some(EndReport {
            session,
            reason: recorded_reason,
            tickets: ended,
        })
    }

    /// Forget a dataset entirely — its live generation, its closing mark and every ticket
    /// attributed to it. Called from `close_dataset`, so the map does not grow for the life of the
    /// process.
    pub fn forget_dataset(&self, dataset: &str) {
        let mut st = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        st.live.remove(dataset);
        st.invalidated.remove(dataset);
        st.closing.remove(dataset);
        st.tickets.retain(|_, (d, _, _)| d != dataset);
        // P3b §2c: "entirely" includes the dead-ticket record — a closed dataset's handles are
        // gone from `StreamRegistry` too, so the record could only answer about tickets nothing
        // else in the process still knows.
        st.dead_tickets.retain(|_, (d, _, _)| d != dataset);
    }
}

/// The transition report [`GenerationRegistry::invalidate`] returns — ADR-035 D3.
///
/// `session` is never absent (Amendment 1): every generation carries a kernel-minted
/// [`SessionRef`], the one `open_dataset` returned to its client (only
/// [`GenerationRegistry::mint_for_open`] inserts a live generation).
pub struct EndReport {
    pub session: SessionRef,
    pub reason: SessionEndReason,
    pub tickets: Vec<String>,
}

/// **Ending a dataset-session generation, as one callable thing two callers share.**
///
/// `SkpHost` ends a generation at the **pre-check** (a `viewport_query` refused synchronously);
/// `crate::EngineSource` ends one at a stream's **post-check**, which is the case boundary 4
/// declares can be found only after that query has finished reading. The second caller lives on a
/// producer's own drop path and cannot hold an `&SkpHost`, so the two pieces of state the operation
/// needs — the generation map and the ticket registry it cancels through — are held here and shared
/// as one `Arc`.
///
/// Nothing new is introduced for the cancellation: it is `StreamRegistry::cancel`, the same path a
/// data-plane CANCEL frame reaches (ADR-019's Consequences).
pub struct SessionInvalidator {
    generations: Arc<GenerationRegistry>,
    tickets: Arc<StreamRegistry>,
    events: SessionEndSender,
}

impl SessionInvalidator {
    pub fn new(
        generations: Arc<GenerationRegistry>,
        tickets: Arc<StreamRegistry>,
        events: SessionEndSender,
    ) -> Arc<Self> {
        Arc::new(Self {
            generations,
            tickets,
            events,
        })
    }

    /// **Record half of the single emission point** (§2b step 1; phase-2 delta 5). Takes the
    /// [`EndReport`] under `GenerationRegistry`'s own guard, which the guard's release (inside
    /// `invalidate`) already completes before this returns. Private: its product caller is
    /// [`Self::end_generation`] below; the in-crate `ticket_drop_under_lock_regression` test module
    /// reaches it as a descendant of this module.
    fn record(&self, dataset: &str, reason: SessionEndReason) -> Option<EndReport> {
        self.generations.invalidate(dataset, reason)
    }

    /// **Enqueue half of the single emission point** (§2b step 2; phase-2 delta 5). `try_send`s one
    /// [`DatasetSessionEnded`] event for an already-taken [`EndReport`] — called only after
    /// [`Self::record`]'s guard has been released, never under it. Never waits and never blocks the
    /// end: a full queue loses the event (Decision 2).
    fn enqueue(&self, report: &EndReport) {
        let _ = self.events.try_send(DatasetSessionEnded {
            session: report.session.clone(),
            reason: end_reason_of(report.reason),
        });
    }

    /// **The single emission point** (§2b). End `dataset`'s generation for `reason`, emit at most
    /// one [`DatasetSessionEnded`] event, then cancel every ticket that belonged to it. Returns how
    /// many tickets this call actually cancelled.
    ///
    /// **Order, exactly** (§2b): 1. [`Self::record`] takes the report; 2. after the guard is
    /// released (`invalidate` has already returned by this point — the enqueue never runs under
    /// `GenerationRegistry`'s own lock), [`Self::enqueue`] sends one event; 3. cancel the report's
    /// tickets through the existing `StreamRegistry::cancel`. The emission never waits and never
    /// blocks the end — a full queue loses the event (Decision 2 keeps that safe).
    ///
    /// **Idempotent**, so the pre-check and a post-check (or the watcher's sink) observing the same
    /// change do not double-cancel or double-emit, and so a source whose post-check fires on
    /// several concurrent tile streams ends one session rather than N.
    pub fn end_generation(&self, dataset: &str, reason: SessionEndReason) -> u32 {
        let Some(report) = self.record(dataset, reason) else {
            return 0;
        };
        self.enqueue(&report);
        let mut cancelled = 0u32;
        for h in report.tickets {
            if matches!(self.tickets.cancel(&h), CancelOutcome::Requested) {
                cancelled += 1;
            }
        }
        cancelled
    }
}

/// Names an in-flight `open_dataset` call so `cancel(cancel_key)` can reach it before it returns a
/// handle. Separate from [`StreamRegistry`]: a different handle kind (client-minted, SKP-V0.md §3),
/// a different underlying cancel primitive (`engine::CancelToken` directly, not the data plane's
/// type-erased `SourceCancel`), and a different lifetime (dies the instant `open_dataset` returns).
#[derive(Default)]
struct OpenRegistry {
    inflight: Mutex<HashMap<String, CancelToken>>,
}

impl OpenRegistry {
    fn begin(&self, key: &str, token: CancelToken) -> Result<(), SkpError> {
        let mut m = self.inflight.lock().unwrap_or_else(|e| e.into_inner());
        if m.contains_key(key) {
            return Err(SkpError::cancel_key_in_use(key));
        }
        m.insert(key.to_string(), token);
        Ok(())
    }

    fn end(&self, key: &str) {
        self.inflight
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .remove(key);
    }

    fn cancel(&self, key: &str) -> CancelOutcome {
        let m = self.inflight.lock().unwrap_or_else(|e| e.into_inner());
        match m.get(key) {
            None => CancelOutcome::Unknown,
            Some(token) => {
                let was_cancelled = token.is_cancelled();
                token.cancel();
                if was_cancelled {
                    CancelOutcome::AlreadyTerminal
                } else {
                    CancelOutcome::Requested
                }
            }
        }
    }
}

/// RAII counterpart to [`OpenRegistry::end`] — S5 (reviewer, this cut). `begin`/`end` alone rely on
/// the caller reaching the matching `end` on every path out of the function, panics included; this
/// makes "every path" true by construction instead of by discipline.
struct OpenGuard<'a> {
    opens: &'a OpenRegistry,
    key: String,
}

impl Drop for OpenGuard<'_> {
    fn drop(&mut self) {
        self.opens.end(&self.key);
    }
}

/// Whether a dataset's source is under active watch — fixed at admission, never rewritten by a
/// later loss (rule 3). `describe`'s `coverage` is read straight from this.
enum CoverageOutcome {
    Watching,
    ChecksOnly { reason: String },
}

/// One open's watch bookkeeping, held in [`SkpHost::watches`]. `watch` is `None` exactly when
/// arming produced [`ArmOutcome::ChecksOnly`].
struct OpenRecord {
    /// Never read back — held only so `close_dataset`'s removal drops (disarms and joins) it.
    #[allow(dead_code)]
    watch: Option<Box<dyn ArmedWatch>>,
    coverage: CoverageOutcome,
}

/// The per-open latch the sink writes into before admission (§2b's "Open and admission"). Lock
/// order: latch, then generations — the admission code below is the only place that ever holds
/// both, latch outer; the sink's own `Admitted` arm always drops the latch guard before it ever
/// reaches into `generations` (via `SessionInvalidator::end_generation`), so the two are never
/// held by two different threads in opposite order.
enum LatchState {
    PreAdmission { recorded: Option<WatchSignal> },
    Admitted,
}

fn reason_of_signal(signal: &WatchSignal) -> SessionEndReason {
    match signal {
        WatchSignal::Change { .. } => SessionEndReason::ObservedChange,
        WatchSignal::CoverageLost { .. } => SessionEndReason::CoverageLost,
    }
}

/// The refusal a signal recorded **before admission** takes (§2b step 1): "A `Change` refuses as
/// `engine.source_changed`, with a detail naming a notification before admission; a `CoverageLost`
/// refuses as `engine.source_coverage_lost`."
fn engine_error_of_pre_admission_signal(signal: WatchSignal) -> EngineError {
    match signal {
        WatchSignal::Change { .. } => EngineError::SourceChanged {
            detail: "{[P6 placeholder] a notification arrived for this source before admission}"
                .to_string(),
        },
        WatchSignal::CoverageLost { cause } => EngineError::SourceCoverageLost { detail: cause },
    }
}

/// The composition SKP v0 needs: a shared catalog, a shared ticket registry, and an open-call
/// registry local to this host. One `SkpHost` per running shell process.
pub struct SkpHost {
    catalog: Arc<Catalog>,
    tickets: Arc<StreamRegistry>,
    opens: OpenRegistry,
    /// The authoritative ticket → `dataset_session_generation` mapping (§13 D). Owned here because
    /// this host is where a ticket is minted and where a refusal under an invalidated generation is
    /// decided.
    generations: Arc<GenerationRegistry>,
    /// The shared end-a-generation operation. Held as an `Arc` because the **producer** side holds
    /// the same one: a stream's post-check runs on its own thread, long after this host's call
    /// returned, and has to be able to end the session it found changed.
    invalidator: Arc<SessionInvalidator>,
    /// Arms a watch over one open's source (`SOURCE-WATCHER-PREREGISTRATION.md` §2a). Product
    /// constructor: `PlatformWatch`, built in the shell's `run` `setup` closure.
    arm: Arc<dyn SourceWatchArm>,
    /// One [`OpenRecord`] per currently-open dataset — the watch itself (dropped, which disarms and
    /// joins, on `close_dataset`) and the coverage fact `describe` reads.
    watches: Mutex<HashMap<String, OpenRecord>>,
}

impl SkpHost {
    pub fn new(
        catalog: Arc<Catalog>,
        tickets: Arc<StreamRegistry>,
        arm: Arc<dyn SourceWatchArm>,
        events: SessionEndSender,
    ) -> Self {
        let generations = GenerationRegistry::new();
        let invalidator = SessionInvalidator::new(generations.clone(), tickets.clone(), events);
        Self {
            catalog,
            tickets,
            opens: OpenRegistry::default(),
            generations,
            invalidator,
            arm,
            watches: Mutex::new(HashMap::new()),
        }
    }

    /// The catalog this host mutates. `frontends/shell/src-tauri`'s app setup gives the identical
    /// `Arc` to the data-plane's raw-params tests, if any run in-process; the running shell itself
    /// only ever installs `EngineSourceFactory::ticket_only`.
    pub fn catalog(&self) -> Arc<Catalog> {
        self.catalog.clone()
    }

    /// The ticket registry this host mints into. `EngineSourceFactory::ticket_only` needs the
    /// identical `Arc` to redeem what this mints.
    pub fn tickets(&self) -> Arc<StreamRegistry> {
        self.tickets.clone()
    }

    /// The dataset-session generation registry this host mints into (P3b §2c).
    /// `EngineSourceFactory::ticket_only` needs the identical `Arc` to answer
    /// [`GenerationRegistry::ticket_liveness`] about what this host ended — the host constructs the
    /// registry privately (`SkpHost::new`, `:689`) and nothing else can hand out that `Arc`.
    ///
    /// **Its product caller is one line**: `frontends/shell/src-tauri/src/lib.rs:373-377` (`host.generations()` at `:376`),
    /// `EngineSourceFactory::ticket_only(catalog, tickets, host.generations())`. Same shape as
    /// [`Self::catalog`] and [`Self::tickets`] above, for the same reason.
    pub fn generations(&self) -> Arc<GenerationRegistry> {
        self.generations.clone()
    }

    pub fn open_dataset(&self, req: OpenDatasetRequest) -> Result<OpenDatasetResponse, SkpError> {
        check_version(&req.skp)?;
        let cancel_key = CancelKey::try_from(req.cancel_key.clone())
            .map_err(|e| SkpError::protocol("malformed_cancel_key", e))?;
        let cancel = CancelToken::new();
        self.opens.begin(cancel_key.as_str(), cancel.clone())?;
        // S5 (reviewer, this cut): a guard, not a bare `self.opens.end(...)` after the call below —
        // `open_cancellable` runs arbitrary engine/DuckDB code, and an unwind out of it must still
        // free this cancel key. Without this, a panic here would leave `cancel_key` permanently
        // `cancel_key_in_use` for the rest of the process's life, since nothing else ever removes it.
        let _end_open_on_drop = OpenGuard {
            opens: &self.opens,
            key: cancel_key.as_str().to_string(),
        };
        let handle = DatasetHandle::mint();
        // `NEXT-CUT.md` P1: the wire carries the caller's *claim* (identifier/definition_json,
        // column) and nothing else — `by`/`at` are never read from the request (I4, ADR-004
        // Amendment 4, ADR-024 F-5). `host_minted_crs_assertion`/`host_minted_identity_declaration`
        // are the one place either attribution is supplied, and both mint it identically.
        let assertion = req.crs_assertion.map(host_minted_crs_assertion);
        let identity = req.identity.map(host_minted_identity_declaration);
        // The handle IS the catalog name — never user-controlled text (`kernel/src/lib.rs`'s own
        // "names, never paths" rule, one level up: now also "names, never chosen by the caller").
        // `SOURCE-WATCHER-PREREGISTRATION.md` §2b: arm before `open_cancellable`, and so before the
        // descriptor read in `Dataset::open_inner`. The sink writes into a per-open latch that
        // starts pre-admission; a signal recorded there is read back at admission, below.
        let dataset_name = handle.as_str().to_string();
        let latch = Arc::new(Mutex::new(LatchState::PreAdmission { recorded: None }));
        let sink: WatchSink = {
            let latch = latch.clone();
            let invalidator = self.invalidator.clone();
            let dataset_name = dataset_name.clone();
            Arc::new(move |signal: WatchSignal| {
                let mut guard = latch.lock().unwrap_or_else(|e| e.into_inner());
                match &mut *guard {
                    LatchState::PreAdmission { recorded } => {
                        if recorded.is_none() {
                            *recorded = Some(signal);
                        }
                    }
                    LatchState::Admitted => {
                        // Admission's own critical section (below) always mints this dataset's
                        // generation before it ever sets the latch to `Admitted`, so by the time
                        // this arm is reached the generation this call ends is guaranteed to exist
                        // (Amendment 1: it always carries a `SessionRef`, even one no client
                        // holds). Dropped before reaching into `generations` — lock order.
                        drop(guard);
                        let reason = reason_of_signal(&signal);
                        // Phase-2 delta 8, following `kernel/src/lib.rs`'s own post-check
                        // `eprintln!` convention: the reason's wire spelling only — no reference, no
                        // dataset handle, no duration (the operator-visible-text rule; ADR-018).
                        //
                        // Advisory 2 (architect gate-1): this line runs before `end_generation`
                        // and unconditionally, so after another route (or the other handle) has
                        // already ended the generation, an "observed" wording would state an end
                        // this call did not make. Worded as the signal itself, which this call
                        // always did just receive, rather than as a claimed consequence — the
                        // round-7 engine-facts rule (`SkpHost::end_generation`'s signature is
                        // unchanged; the alternative of logging only when `record` returns `Some`
                        // was not taken, to keep this fix to the wording alone).
                        eprintln!(
                            "the advisory source watcher signalled {}",
                            match reason {
                                SessionEndReason::ObservedChange => "observed-change",
                                SessionEndReason::CoverageLost => "coverage-lost",
                            }
                        );
                        invalidator.end_generation(&dataset_name, reason);
                    }
                }
            })
        };
        let arm_outcome = self.arm.arm(Path::new(&req.path), sink);

        let outcome =
            self.catalog
                .open_cancellable(handle.as_str(), &req.path, assertion, identity, &cancel);
        if let Err(e) = outcome {
            // The open itself refused before admission was ever reached: disarm, nothing else to
            // clean up (the catalog entry was never inserted).
            drop(arm_outcome);
            return Err(error_of(&e));
        }

        // Admission, under the latch — the whole decision, including `mint_for_open` on the
        // success arm, runs inside this one critical section (lock order: latch, then
        // generations), so the sink's own `Admitted` arm can never race a still-in-progress
        // admission (it always finds either `PreAdmission` or a fully-admitted generation).
        let session = match arm_outcome {
            ArmOutcome::Watching(watch) => {
                let mut guard = latch.lock().unwrap_or_else(|e| e.into_inner());
                let recorded = match &*guard {
                    LatchState::PreAdmission { recorded } => recorded.clone(),
                    LatchState::Admitted => {
                        unreachable!("this call is the only place the latch is ever admitted")
                    }
                };
                // Reviewer gate-1 B3 / §8 item 3 (Amendment 5 item 1): a signal recorded
                // before admission, or the watch's own internal state disagreeing
                // (belt-and-suspenders on the sink's asynchronous callback), now take the
                // *same* refusal path — its code is the recorded signal's kind, never a
                // hardcoded `SourceChanged`. The old two-step form assumed a false
                // `resolves_unchanged()` with no recorded signal meant a `Change`; the
                // product watch sets its own `fired` flag before it ever calls the sink, so
                // the pending signal reaching the sink next can be a `CoverageLost`.
                let resolves_unchanged = watch.resolves_unchanged();
                if recorded.is_some() || !resolves_unchanged {
                    // The latch stays `PreAdmission`: this call never sets `Admitted` on a
                    // refused open, so the sink's own `Admitted` arm (its log line and
                    // `end_generation`) is unreachable for it and leaves no `invalidated`
                    // mark. No third latch state is added — after the drop below, no watch
                    // thread remains to call the sink at all.
                    drop(guard);
                    self.catalog.remove(handle.as_str());
                    // Drop the watch, which joins its threads. `ArmedWatch::resolves_unchanged`'s
                    // contract: `false` means a signal has been delivered to the sink, or
                    // will be before this `Drop` returns — so the latch's recorded signal,
                    // read back below, is settled by the time this returns.
                    drop(watch);
                    let guard = latch.lock().unwrap_or_else(|e| e.into_inner());
                    let recorded = match &*guard {
                        LatchState::PreAdmission { recorded } => recorded.clone(),
                        LatchState::Admitted => {
                            unreachable!("this call is the only place the latch is ever admitted")
                        }
                    };
                    drop(guard);
                    return Err(error_of(&match recorded {
                        Some(signal) => engine_error_of_pre_admission_signal(signal),
                        // The conservative fallback (Amendment 5 item 1): `resolves_unchanged()`
                        // was false, so the contract above promises a signal, but none is
                        // recorded even after the watch's `Drop` returned. Refusing as a
                        // coverage loss here never breaks §8 item 3; refusing a real coverage
                        // loss as `SourceChanged` would.
                        None => EngineError::SourceCoverageLost {
                            detail: "[P6 placeholder] a notification arrived for this source \
                                     before admission, but its kind could not be recovered \
                                     after disarming"
                                .to_string(),
                        },
                    }));
                }
                // Step 3: mint, still under the latch, before it flips to `Admitted`.
                let session = SessionRef::mint();
                self.generations
                    .mint_for_open(handle.as_str(), session.clone());
                *guard = LatchState::Admitted;
                drop(guard);
                self.watches
                    .lock()
                    .unwrap_or_else(|e| e.into_inner())
                    .insert(
                        dataset_name,
                        OpenRecord {
                            watch: Some(watch),
                            coverage: CoverageOutcome::Watching,
                        },
                    );
                session
            }
            ArmOutcome::ChecksOnly { reason } => {
                let mut guard = latch.lock().unwrap_or_else(|e| e.into_inner());
                let session = SessionRef::mint();
                self.generations
                    .mint_for_open(handle.as_str(), session.clone());
                *guard = LatchState::Admitted;
                drop(guard);
                self.watches
                    .lock()
                    .unwrap_or_else(|e| e.into_inner())
                    .insert(
                        dataset_name,
                        OpenRecord {
                            watch: None,
                            coverage: CoverageOutcome::ChecksOnly { reason },
                        },
                    );
                session
            }
        };
        Ok(OpenDatasetResponse {
            dataset: handle,
            session,
        })
    }

    pub fn describe(&self, req: DescribeRequest) -> Result<DescribeResponse, SkpError> {
        check_version(&req.skp)?;
        let ds = self
            .catalog
            .get(req.dataset.as_str())
            .ok_or_else(|| SkpError::unknown_dataset(req.dataset.as_str()))?;
        let mut resp = describe_dataset(&ds);

        resp.coverage = {
            let watches = self.watches.lock().unwrap_or_else(|e| e.into_inner());
            match watches.get(req.dataset.as_str()) {
                Some(OpenRecord {
                    coverage: CoverageOutcome::Watching,
                    ..
                }) => SourceCoverage {
                    state: CoverageState::Watching,
                    reason: None,
                },
                Some(OpenRecord {
                    coverage: CoverageOutcome::ChecksOnly { reason },
                    ..
                }) => SourceCoverage {
                    state: CoverageState::ChecksOnly,
                    reason: Some(reason.clone()),
                },
                // No `OpenRecord`: this dataset was opened through an entry point other than this
                // host's own `open_dataset` (`Catalog::open`/`open_cancellable` directly), so no
                // watch was ever armed for it.
                None => SourceCoverage {
                    state: CoverageState::ChecksOnly,
                    reason: Some(
                        "[P6 placeholder] no watch was armed for this dataset".to_string(),
                    ),
                },
            }
        };
        resp.checks = {
            let components = ds.descriptor().unestablished_components();
            if components.is_empty() {
                SourceChecks {
                    state: ChecksState::Full,
                    components: Vec::new(),
                }
            } else {
                SourceChecks {
                    state: ChecksState::Degraded,
                    components: components
                        .into_iter()
                        .map(|c| match c {
                            "mtime" => CheckComponent::Mtime,
                            "footer-hash" => CheckComponent::FooterHash,
                            other => unreachable!(
                                "SourceDescriptor::unestablished_components produced an unknown \
                                 component: {other}"
                            ),
                        })
                        .collect(),
                }
            }
        };
        resp.session_end = self
            .generations
            .ended_reason(req.dataset.as_str())
            .map(end_reason_of);

        Ok(resp)
    }

    /// Three steps, composed in order and by nothing else
    /// (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §2b): resolve, mint, attribute. The split
    /// mirrors `SessionInvalidator`'s `record`/`enqueue`; each step's only product caller is this
    /// method.
    pub fn viewport_query(
        &self,
        req: ViewportQueryRequest,
    ) -> Result<ViewportQueryResponse, SkpError> {
        let (dataset_name, ds) = self.viewport_query_resolve(&req)?;
        let handle = self.viewport_query_mint(&dataset_name, &ds, &req)?;
        self.viewport_query_attribute(handle, &dataset_name)
    }

    /// `viewport_query`'s resolve step: the version, the sweep, and the catalog entry.
    fn viewport_query_resolve(
        &self,
        req: &ViewportQueryRequest,
    ) -> Result<(String, Arc<Dataset>), SkpError> {
        check_version(&req.skp)?;
        // B5 (reviewer, this cut): reclaim stale pending tickets' leased connections *before*
        // attempting to lease another. `open_engine_stream` below leases from a pool bounded by
        // `MAX_STREAM_CONNECTIONS`, and that lease can fail before this call ever reaches
        // `tickets.mint`'s own sweep — the only other place a `Pending` ticket's expiry is noticed.
        // See `MAX_PENDING_TICKETS`'s doc comment for why that pool, not this registry's declared
        // ceiling, is the one that binds in practice.
        self.tickets.sweep_expired();
        let dataset_name = req.dataset.as_str().to_string();
        let ds = self
            .catalog
            .get(&dataset_name)
            .ok_or_else(|| SkpError::unknown_dataset(&dataset_name))?;
        Ok((dataset_name, ds))
    }

    /// `viewport_query`'s mint step: the live check, the query, the engine stream with its
    /// pre-check end, the data-plane wrap, and the ticket.
    fn viewport_query_mint(
        &self,
        dataset_name: &str,
        ds: &Dataset,
        req: &ViewportQueryRequest,
    ) -> Result<StreamHandle, SkpError> {
        // Filter admission (`NEXT-CUT.md` P4; `AdmittedPredicate::admit`, `engine/src/predicate.rs`
        // P3) runs *inside* `build_viewport_query`, right here — after `ds` is resolved (admission
        // needs the dataset's own resident schema, an ADR-016-style structural precondition: no
        // extra IO beyond DuckDB's own parse/bind against what is already open) but strictly
        // *before* `open_engine_stream` below ever leases a `Class::Stream` connection and *before*
        // `self.tickets.mint` ever runs. A refused predicate returns here, synchronously, as one of
        // the twelve typed `skp.filter_*` codes (`filter_error_of`) — never as a data-plane terminal
        // frame arriving after a round trip, and never after a ticket a client would have to redeem
        // just to learn it was refused (SKP-V0 §1, ADR-019 §1). A residual admission-*lease*
        // exhaustion is not one of those twelve: it routes through `engine.connections_exhausted`
        // instead — see [`predicate_admit_error_of`].
        // **A ticket is refused under an invalidated generation, before anything is built** (§13 D;
        // boundary 4's "new tickets refused under G"). The kernel side is authoritative: this
        // refusal does not depend on the client noticing anything, and the client's own live-ticket
        // mirror fails closed independently of it.
        //
        // An **invalidated** dataset is one whose source was observed to have changed. It stays in
        // the catalog deliberately — `describe` still answers, and the operator is told to reopen
        // rather than finding the name gone. A dataset with no live generation and no end mark is
        // not that — it is not open through `open_dataset`, or its close has begun — and
        // `live_generation` below answers `NotOpen`, refused as `skp.unknown_dataset`: the answer a
        // query issued after the close gets, and nothing is built or minted
        // (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §2b).
        // **Refusals take their code from the reason, never `SourceChanged` for a coverage loss**
        // (`SOURCE-WATCHER-PREREGISTRATION.md` §2b; block-on-sight 3).
        if let Err(not_live) = self.generations.live_generation(dataset_name) {
            let reason = match not_live {
                NotLive::Ended(reason) => reason,
                NotLive::NotOpen => return Err(SkpError::unknown_dataset(dataset_name)),
            };
            return Err(error_of(&match reason {
                SessionEndReason::ObservedChange => EngineError::SourceChanged {
                    detail: "{this dataset's session ended when its source was observed to have \
                             changed}"
                        .to_string(),
                },
                SessionEndReason::CoverageLost => EngineError::SourceCoverageLost {
                    detail: "{[P6 placeholder] this dataset's session ended when the advisory \
                             watch on its source lost coverage}"
                        .to_string(),
                },
            }));
        }
        let (query, projection) =
            build_viewport_query(ds, req).map_err(viewport_query_build_error_of)?;
        // Validated **before** any handle is minted (SKP-V0.md §1): `ViewportCrsMismatch`,
        // `ViewportCrsUnidentifiable` and `NoCoveringBbox` return here, synchronously, with their
        // full typed text — never as a data-plane terminal frame arriving after a round trip.
        // R-D2's pre-check runs inside `Dataset::stream_inner`, so a source that changed refuses
        // here, synchronously and typed. **The generation ends on that refusal** — the check is
        // what detected the change, and leaving the generation live would let the next
        // `viewport_query` mint another ticket against a file that is no longer the one that
        // opened. Every ticket that belonged to it is cancelled through the existing cancel. This
        // is the engine's own descriptor pre-check, never the watcher, so it always passes
        // `ObservedChange`, as §2b's single emission point assigns to the pre-check.
        let (stream, cancel) =
            open_engine_stream(ds, &query, projection.as_ref()).map_err(|e| {
                if matches!(e, EngineError::SourceChanged { .. }) {
                    self.end_generation(dataset_name);
                }
                error_of(&e)
            })?;
        // `None`: `frontends/shell` has no consumer for `StreamConnectionRecord` telemetry yet
        // (unlike `kernel::main`'s own product binary, which does via `with_connection_reports`) —
        // no half-built reporting path here waiting for a caller that doesn't exist (S7, reviewer,
        // this cut: this used to be a field that could only ever be constructed as `None`).
        let (source, source_cancel) = wrap_for_data_plane(
            stream,
            cancel,
            dataset_name.to_string(),
            ds.connections().config().reuses_connections(),
            None,
            // §13 C rule (ii)'s reader: the producer records what its post-check found before it
            // sends any terminal, and this source ends the dataset-session generation on whichever
            // terminal it reaches — including a cancelled one, which keeps its own `cancelled`
            // terminal while the change still ends the session.
            Some(self.invalidator.clone()),
        );
        self.tickets.mint(dataset_name, source, source_cancel)
    }

    /// `viewport_query`'s attribute step: the ticket attributed to the live generation, or, on
    /// `false`, cancelled and refused.
    fn viewport_query_attribute(
        &self,
        handle: StreamHandle,
        dataset_name: &str,
    ) -> Result<ViewportQueryResponse, SkpError> {
        // Boundary 4's "every batch is attributed to a generation via its ticket", held entirely
        // kernel-side. `attribute_ticket` returning false means the generation ended, or the close
        // began, between the check above and this line — a real race, and the honest answer is to
        // cancel the ticket just minted rather than hand out one that is already dead.
        if !self
            .generations
            .attribute_ticket(handle.as_str(), dataset_name)
        {
            self.tickets.cancel(handle.as_str());
            // The actual reason this generation ended, never hardcoded to `SourceChanged`
            // (block-on-sight 3). No recorded end means the close had begun, or had already
            // forgotten the name: the answer is `skp.unknown_dataset`, what the same query issued
            // after the close gets (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §2b, §2d).
            let Some(reason) = self.generations.ended_reason(dataset_name) else {
                return Err(SkpError::unknown_dataset(dataset_name));
            };
            // Phase-2 delta 9: one detail string per reason, so the coverage-lost one carries its
            // own `[P6 placeholder]` mark (§7; §8 item 9) — the observed-change one is the existing,
            // already-unmarked sentence this arm has always used for that reason.
            return Err(error_of(&match reason {
                SessionEndReason::ObservedChange => EngineError::SourceChanged {
                    detail: "{this dataset's session ended while this query was being prepared}"
                        .to_string(),
                },
                SessionEndReason::CoverageLost => EngineError::SourceCoverageLost {
                    detail: "{[P6 placeholder] this dataset's session ended while this query was \
                             being prepared}"
                        .to_string(),
                },
            }));
        }
        Ok(ViewportQueryResponse {
            stream: handle,
            expires_in_ms: TICKET_TTL.as_millis() as u32,
        })
    }

    /// End a dataset's `dataset_session_generation` and cancel every ticket that belonged to it.
    ///
    /// **Boundary 4's invalidation path, kernel half — and only that half.** New tickets are
    /// refused (the live-generation check in `viewport_query`) and in-flight producer streams are
    /// cancelled through the **existing** cancel (`StreamRegistry::cancel`, the same one a
    /// data-plane CANCEL frame reaches — ADR-019's Consequences).
    ///
    /// **Clearing residency and refusing picks is P3b's** (`state/NEXT-CUT.md`'s split row: "P3a
    /// claims nothing about boundary 4's owner-side consequences"). No client does either today,
    /// and this doc does not say one does.
    ///
    /// Idempotent, so the pre-check path and a post-check path observing the same change do not
    /// double-cancel. The operation itself lives on [`SessionInvalidator`], which the producer side
    /// also holds — one implementation, two callers.
    pub fn end_generation(&self, dataset: &str) -> u32 {
        // The engine's own pre-check descriptor comparison — never the watcher — so this always
        // passes `ObservedChange`, as §2b's single emission point assigns to the pre-check.
        self.invalidator
            .end_generation(dataset, SessionEndReason::ObservedChange)
    }

    pub fn cancel(&self, req: CancelRequest) -> Result<CancelResponse, SkpError> {
        check_version(&req.skp)?;
        // Disambiguated by the host on the handle's own shape (SKP-V0.md §1): a well-formed
        // `sh_...` stream handle is looked up in the ticket registry; anything else is treated as a
        // client-minted cancel key naming an in-flight `open_dataset`.
        let outcome = match req.handle.parse::<StreamHandle>() {
            Ok(h) => self.tickets.cancel(h.as_str()),
            Err(_) => self.opens.cancel(&req.handle),
        };
        Ok(CancelResponse {
            state: cancel_state_of(outcome),
        })
    }

    pub fn close_dataset(
        &self,
        req: CloseDatasetRequest,
    ) -> Result<CloseDatasetResponse, SkpError> {
        check_version(&req.skp)?;
        let name = req.dataset.as_str();
        // `SOURCE-WATCHER-PREREGISTRATION.md` §2b: the `OpenRecord` (and so the watch) is removed
        // under the map guard and dropped only after release — disarming and joining the watch
        // thread(s) before anything below runs, so the watcher can never reach `invalidate` after
        // `forget_dataset`. This is the first step, ahead of the `unknown_dataset` check, so a
        // close releases its dataset's watch on every outcome after the SKP version check, the
        // `unknown_dataset` refusal included
        // (`kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md` §2).
        let removed_watch = self
            .watches
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .remove(name);
        drop(removed_watch);
        if self.catalog.get(name).is_none() {
            return Err(SkpError::unknown_dataset(name));
        }
        // The order is `begin_close`, `cancel_all_for_dataset`, `forget_dataset`, `catalog.remove`
        // (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §2c), and this call linearizes at
        // `begin_close` (§2d): a racing `viewport_query` answers what it would answer wholly before
        // or wholly after this call.
        // 1. `begin_close` first: from here a racing query's live check answers `NotOpen` and its
        //    attribution refuses, so no ticket minted after this point stays redeemable. The live
        //    generation stays until `forget_dataset`, so an end recorded during the close (a
        //    `Pending` ticket's drop below) still finds it and emits (ADR-035 Decision 3).
        self.generations.begin_close(name);
        // 2. Then cancel every ticket minted before it.
        let cancelled_streams = self.tickets.cancel_all_for_dataset(name);
        // 3. The generation dies with the open it was minted for; its end mark, its closing mark
        //    and its ticket attributions go with it, so the mapping does not grow for the life of
        //    the process. An end reaching `invalidate` after this finds no live generation and
        //    writes nothing.
        self.generations.forget_dataset(name);
        // 4. The name goes last, so a query resolving it before this line still meets steps 1-3.
        self.catalog.remove(name);
        Ok(CloseDatasetResponse { cancelled_streams })
    }
}

fn check_version(skp: &str) -> Result<(), SkpError> {
    if skp != SKP_VERSION {
        return Err(SkpError::version_unsupported(skp));
    }
    Ok(())
}

/// The `by` this host mints for a caller's claim (a CRS assertion or an identity declaration) —
/// `Principal::OsUser`, in the identical `"<kind> <id>"` form
/// [`crate::permission::boundary::execute`]'s approval prompt already uses for a grant's own
/// grantor (`NEXT-CUT.md` P1: "the existing os-user form"). Best-effort and unverified, exactly as
/// `Principal::from_environment`'s own doc comment states — recorded because a claim with no
/// claimant is not attributable (`docs/09`), never because it is authenticated.
fn host_attribution() -> String {
    let p = crate::permission::grant::Principal::from_environment();
    format!("{} {}", p.kind.as_str(), p.id)
}

/// Host-mints `by`/`at` onto a wire [`spatial_skp::v0::CrsAssertion`] — the wire carries neither
/// (SKP-V0.md, `protocol/skp/src/v0/commands.rs`'s own doc comment on the type), so this is the
/// only place either is supplied (I4; ADR-004 Amendment 4; ADR-024 F-5). `definition_json` is
/// always present on the wire (a plain `String`, not `Option`), so it is always carried through as
/// `Some` — the engine's own `crs::admit` is what may still refuse it (`AxisOrderUnestablished` if
/// it establishes no axis order, `CrsAssertionConflict` if the file already declares a CRS).
///
/// `definition_provenance` (ADR-026 decision 2, this cut's P2) is minted here too, identically to
/// `by`/`at`: sha256 of exactly the wire's `definition_json` text, compared against the pinned
/// in-tree catalog (`spatial_engine::crs_catalog`). **Never taken from the wire** — there is no
/// such field on `spatial_skp::v0::CrsAssertion`, and there must not be one (the wire gains
/// nothing for this piece).
fn host_minted_crs_assertion(wire: spatial_skp::v0::CrsAssertion) -> spatial_engine::CrsAssertion {
    let definition_provenance =
        spatial_engine::crs_catalog::definition_provenance(Some(&wire.definition_json));
    spatial_engine::CrsAssertion {
        identifier: wire.identifier,
        definition_json: Some(wire.definition_json),
        by: host_attribution(),
        at: crate::permission::audit::clock::rfc3339_utc_now(),
        definition_provenance,
    }
}

/// Host-mints `by`/`at` onto a wire [`spatial_skp::v0::IdentityDeclaration`] — same discipline as
/// [`host_minted_crs_assertion`]. `IdentityDeclaration::new` always sets
/// `skip_uniqueness_check = false`: the wire has no field for it, so a mapped column's uniqueness
/// is always verified (ADR-016 §5) and never silently skipped.
fn host_minted_identity_declaration(
    wire: spatial_skp::v0::IdentityDeclaration,
) -> spatial_engine::IdentityDeclaration {
    spatial_engine::IdentityDeclaration::new(
        wire.column,
        host_attribution(),
        crate::permission::audit::clock::rfc3339_utc_now(),
    )
}

/// Every way [`build_viewport_query`] can refuse — the projection refusals beside
/// [`PredicateAdmitError`]'s two kinds, in one type so the function has one `Result` to return.
///
/// **`ProjectionEmptyList` is not a [`ProjectionError`] variant** (F4): `resolve_projection(&[])` is
/// publish's own valid empty projection, so the `columns: []` refusal is minted here, at the SKP
/// boundary, and never inside the shared gate.
enum ViewportQueryBuildError {
    /// `columns: []`, never read as `columns: null` (entry 79 item (1)).
    ProjectionEmptyList,
    Projection(ProjectionError),
    Predicate(PredicateAdmitError),
}

/// Maps [`ViewportQueryBuildError`]'s three kinds to a wire code — exhaustive, no wildcard arm.
fn viewport_query_build_error_of(e: ViewportQueryBuildError) -> SkpError {
    match e {
        ViewportQueryBuildError::ProjectionEmptyList => SkpError::protocol(
            // X17 (Amendment 5, row 5.6): states a kernel fact, never an instruction — the
            // operator-visible-text rule (RULED 2026-09-16, round 7, item 1). The former text told
            // the caller what to send; this states what the wire already is.
            "projection_empty_list",
            "refused: an empty projection (`columns: []`) is not admitted; the wire's own \
             no-projection value is `columns: null`",
        ),
        ViewportQueryBuildError::Projection(pe) => projection_error_of(&pe),
        ViewportQueryBuildError::Predicate(pae) => predicate_admit_error_of(pae),
    }
}

/// Maps [`AdmittedPredicate::admit`]'s two failure kinds to the wire code each one already has —
/// the match `viewport_query` takes on [`build_viewport_query`]'s error.
///
/// **Two kinds, two existing codes, no new one.** A [`PredicateAdmitError::Filter`] is a claim
/// about the predicate's own text and keeps its `skp.filter_*` code via [`filter_error_of`].
/// [`PredicateAdmitError::ConnectionsExhausted`] is a fact about the engine's admission-class
/// connection pool, never about the text, so it routes through [`error_of`]'s existing
/// `EngineError::ConnectionsExhausted` arm to `engine.connections_exhausted` (SKP-V0.md `:266`'s
/// `engine.` + variant-name rule) — the ruling of 2026-09-13 (DECISIONS-PENDING entry 91 (a)):
/// residual exhaustion surfaces as the typed `engine.connections_exhausted`, **never** as a false
/// binder refusal. ADR-021 item 8's twelve-code `skp.filter_*` list is untouched: this function
/// mints no code either side of the match does not already mint.
fn predicate_admit_error_of(e: PredicateAdmitError) -> SkpError {
    match e {
        PredicateAdmitError::Filter(fe) => filter_error_of(&fe),
        PredicateAdmitError::ConnectionsExhausted { class, capacity } => {
            error_of(&EngineError::ConnectionsExhausted { class, capacity })
        }
    }
}

/// `projection_error_of(&ProjectionError) -> SkpError` — one exhaustive `match`, no wildcard arm,
/// the [`filter_error_of`] precedent applied to the six declared `skp.projection_*` codes.
fn projection_error_of(e: &ProjectionError) -> SkpError {
    let message = e.to_string();
    match e {
        ProjectionError::TooManyColumns { limit, saw } => SkpError::protocol_with_fields(
            "projection_too_many_columns",
            message,
            [("limit", limit.to_string()), ("saw", saw.to_string())],
        ),
        ProjectionError::ColumnUnknown {
            column,
            known_columns,
        } => SkpError::protocol_with_fields(
            "projection_column_unknown",
            message,
            [
                ("column", column.clone()),
                (
                    "known_columns",
                    spatial_engine::attributes::known_columns_wire_field(known_columns),
                ),
            ],
        ),
        ProjectionError::ColumnIsGeometry { column } => SkpError::protocol_with_fields(
            "projection_column_is_geometry",
            message,
            [("column", column.clone())],
        ),
        ProjectionError::ColumnIsIdentity { column, id_column } => SkpError::protocol_with_fields(
            "projection_column_is_identity",
            message,
            [("column", column.clone()), ("id_column", id_column.clone())],
        ),
        ProjectionError::ColumnDuplicated { column } => SkpError::protocol_with_fields(
            "projection_column_duplicated",
            message,
            [("column", column.clone())],
        ),
        ProjectionError::TypeNotAdmitted {
            column,
            arrow_type,
            detail,
            ..
        } => SkpError::protocol_with_fields(
            "projection_type_not_admitted",
            message,
            [
                ("column", column.clone()),
                ("arrow_type", arrow_type.clone()),
                ("detail", detail.clone()),
            ],
        ),
        // **§10 Amendment 12, 12.1(f).** The eighth code — `column` carries the bound name's raw
        // bytes (JSON-escaped by serialization, never the visible `\u0000` escape: that rendering
        // is for messages, not wire field values — 12.2 N-1a).
        ProjectionError::ColumnNameNotAddressable { column, detail } => {
            SkpError::protocol_with_fields(
                "projection_column_name_not_addressable",
                message,
                [("column", column.clone()), ("detail", detail.clone())],
            )
        }
    }
}

/// Build the engine's [`ViewportQuery`] and, if the request declares one, its admitted attribute
/// projection — both refused synchronously and typed, before any lease or mint (ADR-023 §3).
///
/// **Projection admission runs first (O3).** It is pure and takes no admission-class lease, so a
/// request carrying both a bad projection and a bad predicate is refused on the projection before
/// either ever reaches DuckDB's parser.
fn build_viewport_query(
    ds: &Dataset,
    req: &ViewportQueryRequest,
) -> Result<(ViewportQuery, Option<AdmittedProjection>), ViewportQueryBuildError> {
    let projection = match &req.columns {
        None => None,
        Some(names) if names.is_empty() => {
            return Err(ViewportQueryBuildError::ProjectionEmptyList)
        }
        Some(names) => Some(
            ds.admit_projection(names)
                .map_err(ViewportQueryBuildError::Projection)?,
        ),
    };

    let query = match &req.bbox {
        Some(b) => {
            let bbox = spatial_engine::Bbox {
                xmin: b.xmin.0,
                ymin: b.ymin.0,
                xmax: b.xmax.0,
                ymax: b.ymax.0,
            };
            // `bbox_crs: null` declares "in the dataset's own CRS" (ADR-015 §7; SKP-V0.md §1) — it
            // is a declaration, not an inference from silence.
            let crs = req
                .bbox_crs
                .clone()
                .unwrap_or_else(|| ds.crs().identifier().to_string());
            ViewportQuery::viewport(bbox, crs)
        }
        None => ViewportQuery::all(),
    };
    let query = match &req.limit {
        Some(n) => query.with_limit(n.0),
        None => query,
    };
    let query = match &req.filter {
        // **Real admission, not a pass-through.** `Filter::new` (`protocol/skp`) only ever checked
        // the wire dialect is `duckdb-expr/0`; `AdmittedPredicate::admit` (`engine/src/predicate.rs`,
        // P3) is what actually parses the predicate's grammar (structural admission), resolves every
        // column against `ds`'s resident schema (namespace admission), and asks DuckDB's own binder
        // whether it evaluates to `BOOLEAN` (bind admission) — all three stages, in that order, each
        // gating the next. `?` here is what makes this function, and so `viewport_query` above,
        // refuse synchronously and typed the moment any stage refuses — carrying
        // `PredicateAdmitError`'s two kinds apart, never folded into one another (the caller's
        // match, [`predicate_admit_error_of`], is what puts each on its own wire code).
        Some(f) => query.with_filter(
            AdmittedPredicate::admit(f.predicate.clone(), ds)
                .map_err(ViewportQueryBuildError::Predicate)?,
        ),
        None => query,
    };
    Ok((query, projection))
}

/// **`skp/0.4`, crs-unit-fact-and-bounds.** Projects the engine's recorded
/// `spatial_engine::CoordinateUnit` onto the wire's closed four-value `CrsUnit`. Exhaustive, no
/// wildcard arm: a fifth engine variant is a compile error here, not a silent default (§8 item 2
/// of this piece's preregistration). The CRS identifier is never consulted.
fn crs_unit_of(unit: &spatial_engine::CoordinateUnit) -> CrsUnit {
    match unit {
        spatial_engine::CoordinateUnit::Degree => CrsUnit::Degree,
        spatial_engine::CoordinateUnit::Metre => CrsUnit::Metre,
        // A named unit that is neither degree nor metre is a real, established fact — never
        // folded into `Unestablished`, which means no unit was established at all.
        spatial_engine::CoordinateUnit::Named(_) => CrsUnit::Other,
        spatial_engine::CoordinateUnit::Unestablished => CrsUnit::Unestablished,
    }
}

fn describe_dataset(ds: &Dataset) -> DescribeResponse {
    let crs = ds.crs();
    let identity = ds.identity();
    let license = ds.source_license();

    // **C2** (SKP-V0.md §2): never a bare integer. `verified_rows()` is `Some` only under
    // `VerifiedAtOpenFullFile`; `None` is the honest answer under `DeclaredNotVerified`.
    let row_count = match identity.verified_rows() {
        Some(rows) => RowCount {
            basis: "identity-uniqueness-scan-full-file".to_string(),
            value: Some(DecU64(rows)),
        },
        None => RowCount {
            basis: "not-established".to_string(),
            value: None,
        },
    };

    DescribeResponse {
        source: SourceInfo {
            path_display: ds.path().display().to_string(),
            geoparquet_version: ds.geoparquet_version().to_string(),
        },
        crs: CrsInfo {
            identifier: crs.identifier().to_string(),
            definition_json: crs.definition_json().map(str::to_string),
            source: crs.source().as_str().to_string(),
            asserted_by: crs.asserted_by().map(str::to_string),
            asserted_at: crs.asserted_at().map(str::to_string),
            // `Some` only for a caller-asserted CRS (`DatasetCrs::definition_provenance`'s own doc
            // comment) — `None` for a file-declared one, which never went through either ADR-026
            // supply route.
            definition_provenance: crs.definition_provenance().map(str::to_string),
            axis_order: crs.axis_order().as_str().to_string(),
            axis_normalization: "none-performed".to_string(),
            // Boundary 9's two provenance fields, read from the admission record the engine made
            // at open — never re-derived here, and never defaulted. `admission()` is `Some` for
            // every dataset that opened (`Dataset::admission`'s own contract), so the `None` arms
            // below are unreachable; they record "not established" rather than inventing a class,
            // which is the same rule `dataset::open_inner` applies to itself.
            provenance: ds.admission().map_or_else(
                || "not-established".to_string(),
                |a| a.crs_provenance.as_str().to_string(),
            ),
            axis_provenance: ds.admission().map_or_else(
                || "not-established".to_string(),
                |a| a.axis_provenance.as_str().to_string(),
            ),
            // **The P2-held carrier, closed at P3** (the P2 architect: "P3 carries it over the
            // wire via describe, never as a second TypeScript literal"). The bytes are
            // `spatial_engine::GEOGRAPHIC_DISPLAY_CONVENTION`'s own, read from the constant, so the
            // shell renders them rather than retyping them.
            display_convention: ds
                .is_geographic_degrees_instance()
                .then(|| spatial_engine::GEOGRAPHIC_DISPLAY_CONVENTION.to_string()),
            // **`skp/0.4`, crs-unit-fact-and-bounds.** Read from the same admission record as the
            // two provenance fields above, never re-derived and never read from the CRS
            // identifier. `admission() == None` is the same unreachable arm the two fields above
            // already treat as "not established" — here that is `CrsUnit::Unestablished`.
            unit: ds
                .admission()
                .map_or(CrsUnit::Unestablished, |a| crs_unit_of(&a.coordinate_unit)),
        },
        geometry: GeometryInfo {
            column: ds.geometry_column().to_string(),
            encoding: "geoarrow.polygon".to_string(),
            coordinate_layout: "interleaved-xy".to_string(),
            frame: "authoritative-project-crs".to_string(),
        },
        identity: IdentityInfo {
            source: identity.source().as_envelope_value(),
            uniqueness: identity.uniqueness().as_str().to_string(),
            verified_rows: identity.verified_rows().map(DecU64),
            max_value: identity.max_value().map(DecU64),
            js_exact: identity.js_exact(),
            class: match identity.source() {
                spatial_engine::IdSource::File => "native",
                spatial_engine::IdSource::Mapped { .. } => "mapped",
                spatial_engine::IdSource::SessionOrdinal => "session-ordinal",
            }
            .to_string(),
            // The statement, verbatim from the engine's constant, for the session tier only. No
            // generation value accompanies it and none exists on this response (A2, §13 D).
            session_statement: identity
                .source()
                .is_session_ordinal()
                .then(|| spatial_engine::SESSION_IDENTITY_STATEMENT.to_string()),
        },
        schema: ds
            .file_schema()
            .fields()
            .iter()
            .map(|f| FieldInfo {
                name: f.name().clone(),
                arrow_type: f.data_type().to_string(),
                nullable: f.is_nullable(),
                // **`skp/0.6`.** Live admission only (round 17 item 4, stop item 4) — a projectable
                // `Float32` or dictionary column is still refused at publish preflight by the
                // bundle-format restriction, which this fact knows nothing about.
                projectable: spatial_engine::attributes::admit_projection_column(
                    f,
                    ds.geometry_column(),
                    ds.identity().source().source_column(),
                )
                .is_ok(),
            })
            .collect(),
        covering_bbox: ds.covering().is_some(),
        row_count,
        // **C1** (SKP-V0.md §2): no `Dataset::bounds()` accessor exists on the engine; `describe`
        // never claims a dataset extent it cannot establish without a second query.
        extent: Extent {
            basis: "not-established-at-open".to_string(),
            value: None,
        },
        license: LicenseInfo {
            license: license.license.clone(),
            attribution: license.attribution.clone(),
            redistribution: license.redistribution.clone(),
            declares_anything: license.declares_anything(),
        },
        // Boundary 9's sanity-check level, read from the same admission record. `level` and
        // `reason` say what was read and from where; neither ever says a file passed (boundary 2).
        sanity: spatial_skp::v0::SanityInfo {
            level: ds.admission().map_or_else(
                || "none".to_string(),
                |a| a.sanity_level.as_str().to_string(),
            ),
            reason: ds.admission().map_or_else(
                || "no admission record; not checked".to_string(),
                |a| a.sanity_reason.clone(),
            ),
        },
        // `skp/0.5`: placeholder shapes, always overwritten by `SkpHost::describe` (this function
        // has no access to the host's watch/generation state) — never read as final values.
        coverage: SourceCoverage {
            state: CoverageState::ChecksOnly,
            reason: None,
        },
        checks: SourceChecks {
            state: ChecksState::Full,
            components: Vec::new(),
        },
        session_end: None,
    }
}

/// The detail string a **data-plane terminal** carries for an engine error: `"<code>: <display>"`.
///
/// **Why the code is prefixed here and not left to the client to infer** (P3 gate attempt 1,
/// architect-ruled). `BatchSource::next_into` is typed `Result<_, String>`, so the typed
/// `EngineError` is stringified at `crate::EngineSource::next_into` and everything downstream —
/// the data-plane terminal frame, the shell's `Terminal.detail` — sees prose only. A client that
/// must **clear residency and refuse picks** on `engine.source_changed` **(P3b — no client does
/// either in P3a)** could not decide that from prose without matching on wording, and the wording
/// is the human's at P6. The code table is
/// [`error_of`]'s own, so there is exactly one place a code is minted and this cannot drift from
/// what the control plane reports for the same error.
///
/// **No data-plane change.** The prefix rides the existing `String` the terminal already carries;
/// `protocol/data-plane/` is untouched (block-on-sight A3).
pub fn terminal_detail_of(e: &EngineError) -> String {
    format!("{}: {e}", error_of(e).code)
}

/// Maps every `EngineError` variant to an SKP error code, verbatim message, and named fields
/// (SKP-V0.md §5). **No wildcard arm** — a new `EngineError` variant fails this build until it is
/// mapped here, which is what keeps a typed refusal from silently degrading into "failed".
pub fn error_of(e: &EngineError) -> SkpError {
    let message = e.to_string();
    let (name, fields): (&str, Vec<(&'static str, String)>) = match e {
        EngineError::Source(_) => ("source", vec![]),
        EngineError::CrsUndeclared { detail } => {
            ("crs_undeclared", vec![("detail", detail.clone())])
        }
        EngineError::CrsAssertionConflict { declared, asserted } => (
            "crs_assertion_conflict",
            vec![
                ("declared", declared.clone()),
                ("asserted", asserted.clone()),
            ],
        ),
        EngineError::CrsAssertionIdentifierBlank => ("crs_assertion_identifier_blank", vec![]),
        EngineError::CrsAssertionDefinitionTooLarge { limit, saw } => (
            "crs_assertion_definition_too_large",
            vec![("limit", limit.to_string()), ("saw", saw.to_string())],
        ),
        EngineError::ViewportCrsMismatch { dataset, viewport } => (
            "viewport_crs_mismatch",
            vec![("dataset", dataset.clone()), ("viewport", viewport.clone())],
        ),
        EngineError::ViewportCrsUnidentifiable => ("viewport_crs_unidentifiable", vec![]),
        EngineError::AxisOrderUnestablished { detail } => {
            ("axis_order_unestablished", vec![("detail", detail.clone())])
        }
        EngineError::AxisOrderUnsupported { established } => (
            "axis_order_unsupported",
            vec![("established", established.clone())],
        ),
        // **A P1 stub, and only because this match has no wildcard arm.** Brief A's boundary 9
        // names `engine.format_default_contradicted` as one of this cut's typed refusals; the
        // `describe` additions, the SKP version bump and the fixtures that go with it are P3's, and
        // nothing here bumps a version or adds a wire field. Without this arm the kernel does not
        // compile at all, which is exactly what the no-wildcard discipline is for.
        EngineError::FormatDefaultContradicted { detail } => (
            "format_default_contradicted",
            vec![("detail", detail.clone())],
        ),
        // **Brief A P3, boundary 9's remaining two typed refusals.** Both are `engine.` + the
        // variant name, per SKP-V0.md `:266`'s rule, and both carry `detail` in the structured
        // field rather than only in the message — a client that must clear residency and refuse
        // picks needs the code, not the prose.
        //
        // `source_changed`'s `detail` names **every** descriptor component that differed
        // (`{size, mtime, footer-length, footer-hash}`), never a generation value: the generation
        // it ends is kernel and client state and never reaches the wire (§13 D, A2).
        EngineError::SourceChanged { detail } => {
            ("source_changed", vec![("detail", detail.clone())])
        }
        EngineError::IdentityOrdinalPartitionedUnsupported { detail } => (
            "identity_ordinal_partitioned_unsupported",
            vec![("detail", detail.clone())],
        ),
        // The retyped internal-inconsistency arm (Brief A P3). It used to
        // arrive here as `engine.source`, telling a caller its file was unreadable when the
        // contradiction is in this tree's own record.
        EngineError::InternalInconsistency { detail } => {
            ("internal_inconsistency", vec![("detail", detail.clone())])
        }
        EngineError::GeoMetadata(_) => ("geo_metadata", vec![]),
        EngineError::NoCoveringBbox { detail } => {
            ("no_covering_bbox", vec![("detail", detail.clone())])
        }
        EngineError::Wkb(_) => ("wkb", vec![]),
        EngineError::EncodingMismatch { claimed, found } => (
            "encoding_mismatch",
            vec![("claimed", claimed.clone()), ("found", found.clone())],
        ),
        EngineError::Query(_) => ("query", vec![]),
        EngineError::Arrow(_) => ("arrow", vec![]),
        EngineError::Cancelled => ("cancelled", vec![]),
        EngineError::CeilingExceeded {
            ceiling,
            limit,
            saw,
        } => (
            "ceiling_exceeded",
            vec![
                ("ceiling", ceiling.to_string()),
                ("limit", limit.to_string()),
                ("saw", saw.to_string()),
            ],
        ),
        EngineError::IdentityUnusable {
            column,
            detail,
            candidate_columns,
        } => (
            "identity_unusable",
            vec![
                ("column", column.clone()),
                ("detail", detail.clone()),
                // `SkpError::fields` is `BTreeMap<String, String>` (SKP-V0.md §5) — no list shape
                // on the wire, so the schema-ordered, unranked candidate list is comma-joined into
                // one string field. Empty when the file carries no 64-bit integer column at all.
                ("candidate_columns", candidate_columns.join(",")),
            ],
        ),
        EngineError::FeatureTooLarge { id, limit, saw } => (
            "feature_too_large",
            vec![
                ("id", id.to_string()),
                ("limit", limit.to_string()),
                ("saw", saw.to_string()),
            ],
        ),
        EngineError::ConnectionSetup { detail } => {
            ("connection_setup", vec![("detail", detail.clone())])
        }
        EngineError::AttributeUnpublishable { column, detail } => (
            "attribute_unpublishable",
            vec![("column", column.clone()), ("detail", detail.clone())],
        ),
        EngineError::SourceChangedUnderPublish {
            pinned,
            observed,
            detected_by,
        } => (
            "source_changed_under_publish",
            vec![
                ("pinned", pinned.clone()),
                ("observed", observed.clone()),
                ("detected_by", detected_by.to_string()),
            ],
        ),
        EngineError::ConnectionsExhausted { class, capacity } => (
            "connections_exhausted",
            vec![
                ("class", class.to_string()),
                ("capacity", capacity.to_string()),
            ],
        ),
        EngineError::TimingDependentOrdering { ordering, cut } => (
            "timing_dependent_ordering",
            vec![("ordering", ordering.to_string()), ("cut", cut.to_string())],
        ),
        // `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2a: a distinct code, never
        // `engine.source_changed` for a coverage loss (block-on-sight 3). The engine never raises
        // this itself; its product callers are this module's watcher-sink and admission-latch sites.
        EngineError::SourceCoverageLost { detail } => {
            ("source_coverage_lost", vec![("detail", detail.clone())])
        }
        // **The same kind of stub the `FormatDefaultContradicted` arm above records, and for the
        // same reason: this match has no wildcard.** `engine/LOD-PREREGISTRATION.md` §7 declares the
        // LOD refusal identifiers, and `EngineError::LodRefused` carries whichever one fired. No SKP
        // command builds a tier today — the tier builder's entry point is `engine::lod::build_tiers`
        // and nothing on the control plane calls it — so this arm is unreachable from the wire; it
        // exists so that a typed LOD refusal cannot later degrade into "failed" by arriving on a
        // wildcard. **No wire field, no parameter and no version is added here** (that preregistration's
        // §5, "declared unchanged"): `refusal` is carried in the same `fields` map every other arm
        // uses, and `message` is the error's own `Display`.
        EngineError::LodRefused { refusal, detail } => (
            "lod_refused",
            vec![("refusal", refusal.to_string()), ("detail", detail.clone())],
        ),
    };
    SkpError {
        code: format!("engine.{name}"),
        message,
        fields: fields
            .into_iter()
            .map(|(k, v)| (k.to_string(), v))
            .collect(),
    }
}

/// Maps every `FilterError` variant (`engine::predicate`, P3's admission) to its declared
/// `skp.filter_*` wire code and named fields — `NEXT-CUT.md` design essential 5's taxonomy,
/// field for field. **No wildcard arm**: a thirteenth `FilterError` variant fails this build until
/// it is mapped here (correction round 2, W10; architect B7, reviewer B7), the same discipline
/// [`error_of`] applies to `EngineError` above. `message` is
/// `FilterError`'s own `Display` output, unedited, exactly [`error_of`]'s own convention.
pub fn filter_error_of(e: &FilterError) -> SkpError {
    let message = e.to_string();
    match e {
        FilterError::DialectUnsupported { declared } => SkpError::protocol_with_fields(
            "filter_dialect_unsupported",
            message,
            [("declared", declared.clone())],
        ),
        FilterError::Unparsable { detail } => SkpError::protocol_with_fields(
            "filter_unparsable",
            message,
            [("detail", detail.clone())],
        ),
        FilterError::NotASingleExpression { statements } => SkpError::protocol_with_fields(
            "filter_not_a_single_expression",
            message,
            [("statements", statements.to_string())],
        ),
        FilterError::ConstructNotAdmitted { construct } => SkpError::protocol_with_fields(
            "filter_construct_not_admitted",
            message,
            [("construct", construct.clone())],
        ),
        FilterError::UnknownColumn { column } => SkpError::protocol_with_fields(
            "filter_unknown_column",
            message,
            [("column", column.clone())],
        ),
        FilterError::ColumnNotFilterable { column, reason } => SkpError::protocol_with_fields(
            "filter_column_not_filterable",
            message,
            [("column", column.clone()), ("reason", reason.clone())],
        ),
        FilterError::IdentityAliasAmbiguous {
            column,
            source_column,
        } => SkpError::protocol_with_fields(
            "filter_identity_alias_ambiguous",
            message,
            [
                ("column", column.clone()),
                ("source_column", source_column.clone()),
            ],
        ),
        FilterError::NotBoolean { inferred_type } => SkpError::protocol_with_fields(
            "filter_not_boolean",
            message,
            [("inferred_type", inferred_type.clone())],
        ),
        FilterError::TooLong { limit, saw } => SkpError::protocol_with_fields(
            "filter_too_long",
            message,
            [("limit", limit.to_string()), ("saw", saw.to_string())],
        ),
        FilterError::TooDeep { limit, saw } => SkpError::protocol_with_fields(
            "filter_too_deep",
            message,
            [("limit", limit.to_string()), ("saw", saw.to_string())],
        ),
        FilterError::RejectedByBinder { detail } => SkpError::protocol_with_fields(
            "filter_rejected_by_binder",
            message,
            [("detail", detail.clone())],
        ),
        FilterError::TypeNotAdmitted {
            construct,
            operand_types,
            reason,
        } => filter_type_not_admitted(message, construct.clone(), operand_types, *reason),
    }
}

/// [`filter_error_of`]'s `TypeNotAdmitted` arm, factored out for readability. B-T6 calls
/// [`filter_error_of`] itself, not this function directly (correction round 2, W12; architect N4,
/// reviewer N5). `operand_types`' entries are joined with `"; "` on the wire
/// (`FILTER-BIND-COERCIONS-PREREGISTRATION.md` §2.6: a `DECIMAL` name carries a comma).
/// `reason`'s wire value comes from [`TypeRefusalReason::wire_value`] (O-4) — never from this
/// module's own text.
fn filter_type_not_admitted(
    message: String,
    construct: String,
    operand_types: &[String],
    reason: TypeRefusalReason,
) -> SkpError {
    SkpError::protocol_with_fields(
        "filter_type_not_admitted",
        message,
        [
            ("construct", construct),
            ("operand_types", operand_types.join("; ")),
            ("reason", reason.wire_value().to_string()),
        ],
    )
}

/// A [`SourceWatchArm`] that always returns `ChecksOnly` — every test in this file that constructs
/// an [`SkpHost`] and does not care about watch behaviour uses this, rather than a test-only
/// constructor on `SkpHost` itself (§2a: "Tier-1 tests implement the two traits themselves, so no
/// constructor exists for tests only").
#[cfg(test)]
struct NoWatchArm;
#[cfg(test)]
impl SourceWatchArm for NoWatchArm {
    fn arm(&self, _path: &Path, _sink: WatchSink) -> ArmOutcome {
        ArmOutcome::ChecksOnly {
            reason: "test fixture: no watch armed".to_string(),
        }
    }
}
#[cfg(test)]
fn no_watch_arm() -> Arc<dyn SourceWatchArm> {
    Arc::new(NoWatchArm)
}

/// K15's fixture (`SOURCE-WATCHER-PREREGISTRATION.md` §10 Amendment 5 item 1): an [`ArmedWatch`]
/// that reproduces the product watch's own ordering — `resolves_unchanged()` already `false` by
/// the time admission ever checks it, with the signal itself delivered to the sink only from
/// `Drop`, exactly the race the unified refusal path (`SkpHost::open_dataset`) exists for.
#[cfg(test)]
struct RacingCoverageLossWatch {
    sink: WatchSink,
}
#[cfg(test)]
impl ArmedWatch for RacingCoverageLossWatch {
    fn resolves_unchanged(&self) -> bool {
        false
    }
}
#[cfg(test)]
impl Drop for RacingCoverageLossWatch {
    fn drop(&mut self) {
        (self.sink)(WatchSignal::CoverageLost {
            cause: "K15 fixture: a coverage loss racing admission".to_string(),
        });
    }
}
#[cfg(test)]
struct RacingCoverageLossArm;
#[cfg(test)]
impl SourceWatchArm for RacingCoverageLossArm {
    fn arm(&self, _path: &Path, sink: WatchSink) -> ArmOutcome {
        ArmOutcome::Watching(Box::new(RacingCoverageLossWatch { sink }))
    }
}
#[cfg(test)]
// K15's own two registered mutations are recorded on the test itself, below in
// `ticket_drop_under_lock_regression` — this constructor carries no mutation of its own.
fn racing_coverage_loss_arm() -> Arc<dyn SourceWatchArm> {
    Arc::new(RacingCoverageLossArm)
}

/// A fresh, never-drained event channel's sender — for tests that construct an `SkpHost` without
/// caring about the emitted events themselves.
#[cfg(test)]
fn discard_session_end_events() -> SessionEndSender {
    session_end_channel().0
}

#[cfg(test)]
mod tests {
    use super::*;

    fn synthetic_source() -> (Box<dyn BatchSource>, Arc<dyn SourceCancel>) {
        struct Empty;
        impl BatchSource for Empty {
            fn next_into(
                &mut self,
                _out: &mut Vec<u8>,
            ) -> Option<Result<spatial_data_plane::transport::BatchMeta, String>> {
                None
            }
        }
        struct NoopCancel(std::sync::atomic::AtomicBool);
        impl SourceCancel for NoopCancel {
            fn cancel(&self) {
                self.0.store(true, std::sync::atomic::Ordering::SeqCst);
            }
        }
        (
            Box::new(Empty),
            Arc::new(NoopCancel(std::sync::atomic::AtomicBool::new(false))),
        )
    }

    /// T4 (`protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md` §4): the seam is the response
    /// JSON the kernel writes and the shell and `protocol/skp` read. Each of `cancel`'s three
    /// outcomes comes through the real `SkpHost::cancel` — an unminted `sh_` handle (`unknown`), a
    /// minted ticket cancelled once (`requested`), a minted, redeemed ticket cancelled twice
    /// (`already_terminal`) — is serialized, and is compared with the shared fixture both sides'
    /// tests read; same real-shape discipline as
    /// `the_real_describe_crs_shape_matches_the_shared_fixture`.
    ///
    /// RECORDED MUTATION (M4), observed at commit 5d4da4d: `cancel_state_of` maps `AlreadyTerminal` to
    /// `Unknown`. This test fails at the `already_terminal` comparison (left `unknown`).
    #[test]
    fn the_real_cancel_responses_match_the_shared_fixtures() {
        let tickets = StreamRegistry::new();
        let host = SkpHost::new(
            Arc::new(Catalog::new()),
            tickets.clone(),
            no_watch_arm(),
            discard_session_end_events(),
        );
        let cancel = |handle: &str| {
            serde_json::to_value(
                host.cancel(CancelRequest {
                    skp: SKP_VERSION.to_string(),
                    handle: handle.to_string(),
                })
                .expect("cancel answers"),
            )
            .unwrap()
        };
        let fixture = |name: &str| -> serde_json::Value {
            let path = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .parent()
                .expect("workspace root")
                .join(format!("protocol/skp/tests/data/{name}.json"));
            let raw = std::fs::read_to_string(&path).expect("read shared fixture");
            serde_json::from_str(&raw).expect("shared fixture is valid JSON")
        };

        // F6, Unknown.
        assert_eq!(
            cancel("sh_00000000000000000000000000000000"),
            fixture("v0-cancel-response-unknown")
        );
        // F6, Requested: a minted, never-redeemed ticket cancelled once.
        let (s, c) = synthetic_source();
        let pending = tickets.mint("d", s, c).unwrap();
        assert_eq!(cancel(pending.as_str()), fixture("v0-cancel-response"));
        // F6, AlreadyTerminal: minted, redeemed, cancelled twice.
        let (s, c) = synthetic_source();
        let redeemed = tickets.mint("d", s, c).unwrap();
        tickets.redeem(redeemed.as_str()).unwrap();
        assert_eq!(cancel(redeemed.as_str()), fixture("v0-cancel-response"));
        assert_eq!(
            cancel(redeemed.as_str()),
            fixture("v0-cancel-response-already_terminal")
        );
    }

    #[test]
    fn a_ticket_redeems_exactly_once() {
        let reg = StreamRegistry::default();
        let (s, c) = synthetic_source();
        let handle = reg.mint("d", s, c).unwrap();
        assert!(reg.redeem(handle.as_str()).is_ok());
        assert!(
            reg.redeem(handle.as_str()).is_err(),
            "a second redemption must be refused"
        );
    }

    #[test]
    fn cancelling_before_redemption_refuses_the_later_redemption() {
        let reg = StreamRegistry::default();
        let (s, c) = synthetic_source();
        let handle = reg.mint("d", s, c).unwrap();
        assert!(matches!(
            reg.cancel(handle.as_str()),
            CancelOutcome::Requested
        ));
        assert!(reg.redeem(handle.as_str()).is_err());
    }

    #[test]
    fn cancel_on_an_unknown_handle_is_unknown_not_an_error() {
        let reg = StreamRegistry::default();
        assert!(matches!(
            reg.cancel("sh_00000000000000000000000000000000"),
            CancelOutcome::Unknown
        ));
    }

    #[test]
    fn cancelling_a_redeemed_ticket_twice_is_already_terminal_the_second_time() {
        let reg = StreamRegistry::default();
        let (s, c) = synthetic_source();
        let handle = reg.mint("d", s, c).unwrap();
        reg.redeem(handle.as_str()).unwrap();
        assert!(matches!(
            reg.cancel(handle.as_str()),
            CancelOutcome::Requested
        ));
        assert!(matches!(
            reg.cancel(handle.as_str()),
            CancelOutcome::AlreadyTerminal
        ));
    }

    #[test]
    fn the_pending_ceiling_is_per_dataset_and_declared() {
        let reg = StreamRegistry::default();
        for _ in 0..MAX_PENDING_TICKETS {
            let (s, c) = synthetic_source();
            reg.mint("d", s, c).unwrap();
        }
        let (s, c) = synthetic_source();
        let err = reg.mint("d", s, c).unwrap_err();
        assert_eq!(err.code, "skp.too_many_pending_streams");
        // A different dataset is not affected by another dataset's pending count.
        let (s, c) = synthetic_source();
        assert!(reg.mint("other", s, c).is_ok());
    }

    /// B5: without `sweep_expired`, an expired `Pending` ticket sits in the map — and holds
    /// whatever it leased — until some *other* registry method happens to run and sweep it as a
    /// side effect. `SkpHost::viewport_query` cannot rely on that: it leases a connection before
    /// calling any of them. This exercises the reclaim directly, without a real 30-second wait —
    /// `minted_at` is backdated past `TICKET_TTL` under the same lock a real sweep would use.
    #[test]
    fn sweep_expired_reclaims_a_stale_pending_ticket_without_any_other_call() {
        let reg = StreamRegistry::default();
        let (s, c) = synthetic_source();
        let handle = reg.mint("d", s, c).unwrap();
        {
            let mut tickets = reg.tickets.lock().unwrap();
            match tickets.get_mut(handle.as_str()) {
                Some(TicketState::Pending { minted_at, .. }) => {
                    *minted_at = Instant::now() - TICKET_TTL - Duration::from_secs(1);
                }
                other => panic!(
                    "expected a fresh Pending ticket, found_entry={}",
                    other.is_some()
                ),
            }
        }
        reg.sweep_expired();
        assert!(
            reg.redeem(handle.as_str()).is_err(),
            "an expired pending ticket must already be gone, not merely redeemable-but-stale"
        );
    }

    /// B4: a terminal (`CancelledBeforeRedeem`) entry has no event that ever removes it other than
    /// aging out — this exercises that path directly the same way the sibling test above exercises
    /// `Pending` expiry, again without a real five-minute wait.
    #[test]
    fn sweep_expired_reclaims_an_old_cancelled_before_redeem_entry() {
        let reg = StreamRegistry::default();
        let (s, c) = synthetic_source();
        let handle = reg.mint("d", s, c).unwrap();
        assert!(matches!(
            reg.cancel(handle.as_str()),
            CancelOutcome::Requested
        ));
        {
            let mut tickets = reg.tickets.lock().unwrap();
            match tickets.get_mut(handle.as_str()) {
                Some(TicketState::CancelledBeforeRedeem { cancelled_at }) => {
                    *cancelled_at =
                        Instant::now() - TERMINAL_ENTRY_MAX_AGE - Duration::from_secs(1);
                }
                other => panic!(
                    "expected CancelledBeforeRedeem, found_entry={}",
                    other.is_some()
                ),
            }
        }
        reg.sweep_expired();
        // Gone from the map entirely: a fresh cancel on the same handle now reports `Unknown`, not
        // `AlreadyTerminal` -- the two are observably different outcomes over SKP's own wire shape.
        assert!(matches!(
            reg.cancel(handle.as_str()),
            CancelOutcome::Unknown
        ));
    }

    #[test]
    fn close_dataset_cancels_every_ticket_for_that_dataset_only() {
        let reg = StreamRegistry::default();
        let (s1, c1) = synthetic_source();
        let pending = reg.mint("d", s1, c1).unwrap();
        let (s2, c2) = synthetic_source();
        let redeemed = reg.mint("d", s2, c2).unwrap();
        reg.redeem(redeemed.as_str()).unwrap();
        let (s3, c3) = synthetic_source();
        let other = reg.mint("other", s3, c3).unwrap();

        assert_eq!(reg.cancel_all_for_dataset("d"), 2);
        assert!(reg.redeem(pending.as_str()).is_err());
        assert!(matches!(
            reg.cancel(redeemed.as_str()),
            CancelOutcome::AlreadyTerminal
        ));
        // Untouched: a different dataset's ticket was not cancelled.
        assert!(reg.redeem(other.as_str()).is_ok());
    }

    #[test]
    fn version_mismatch_is_refused_before_anything_else() {
        assert!(check_version(SKP_VERSION).is_ok());
        let e = check_version("skp/9").unwrap_err();
        assert_eq!(e.code, "skp.version_unsupported");
    }

    #[test]
    fn every_engine_error_variant_maps_to_a_distinct_engine_dot_code() {
        // A compile-time property (`error_of`'s match has no wildcard) exercised at runtime for one
        // representative of each family, so a reviewer sees the mapping rather than trusting it.
        let e = error_of(&EngineError::CrsUndeclared { detail: "d".into() });
        assert_eq!(e.code, "engine.crs_undeclared");
        assert_eq!(e.fields.get("detail").map(String::as_str), Some("d"));

        let e = error_of(&EngineError::Cancelled);
        assert_eq!(e.code, "engine.cancelled");
        assert!(e.fields.is_empty());

        let e = error_of(&EngineError::CeilingExceeded {
            ceiling: "c",
            limit: 1,
            saw: 2,
        });
        assert_eq!(e.code, "engine.ceiling_exceeded");
        assert_eq!(e.fields.get("limit").map(String::as_str), Some("1"));
    }

    /// The engine→kernel seam for `engine/LOD-PREREGISTRATION.md`'s typed LOD refusals, **from the
    /// engine's real path** (the cross-module seam rule, the human 2026-09-16): nothing is
    /// hand-constructed here. A geographic-CRS GeoParquet is written with the engine's own fixture
    /// generator, opened as a real `Dataset`, and handed to `spatial_engine::lod::build_tiers`,
    /// which refuses §2c's angular-unit case; that refusal — the value the engine actually produced
    /// — is what `error_of` maps.
    ///
    /// The arm it exercises is `skp.rs`'s `EngineError::LodRefused`, which carries **which** refusal
    /// fired in `fields["refusal"]` rather than in the code, so a consumer branches on the
    /// identifier §7 declares and never on prose.
    ///
    // RECORDED MUTATION: map `LodRefused` to the `("source", vec![])` arm in `error_of` (dropping
    // both fields) → an_engine_produced_lod_refusal_reaches_the_wire_as_engine_dot_lod_refused
    // fails by name on `assert_eq!(e.code, "engine.lod_refused")` — observed: left `engine.source`,
    // right `engine.lod_refused`, and both field assertions then fail for a missing key.
    #[test]
    fn an_engine_produced_lod_refusal_reaches_the_wire_as_engine_dot_lod_refused() {
        use spatial_engine::fixture::{write_geoparquet, CoordinateDomain, CrsMode, FixtureSpec};

        let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .expect("workspace root")
            .join("target/fixtures/lod-seam");
        std::fs::create_dir_all(&dir).expect("fixture dir");
        let path = dir.join("wgs84-for-lod-seam.parquet");
        write_geoparquet(
            &path,
            &FixtureSpec {
                features: 8,
                avg_vertices: 8,
                crs_mode: CrsMode::DeclaredCrs84Degrees,
                domain: CoordinateDomain::Wgs84Degrees,
                ..Default::default()
            },
        )
        .expect("write a geographic source");

        let dataset = spatial_engine::dataset::Dataset::open(&path).expect("open");
        let produced = spatial_engine::lod::build_tiers(
            &dataset,
            spatial_engine::lod::LOD_BUILD_WORKERS_ARM_S,
            &spatial_engine::cancel::CancelToken::new(),
            None,
        )
        .expect_err("a geographic CRS is refused for tier building");

        // The engine's own value, not one this test built: `LodRefused` naming §7's identifier.
        let refusal_identifier = match &produced {
            EngineError::LodRefused { refusal, .. } => *refusal,
            other => panic!("expected LodRefused from the engine, found {other:?}"),
        };
        assert_eq!(refusal_identifier, "engine.lod_crs_not_linear");

        let e = error_of(&produced);
        assert_eq!(e.code, "engine.lod_refused");
        assert_eq!(
            e.fields.get("refusal").map(String::as_str),
            Some("engine.lod_crs_not_linear")
        );
        let detail = e
            .fields
            .get("detail")
            .expect("the refusal's detail reaches the wire");
        assert!(
            !detail.is_empty(),
            "a typed refusal arrives with the evidence that convicted it"
        );
        assert_eq!(
            e.message,
            produced.to_string(),
            "the message is the error's own Display"
        );
    }

    /// SF3/SF4 (reviewer gate, admission-remediation cut): the two new typed refusals get their
    /// own distinct `engine.*` codes, same discipline as the test above.
    #[test]
    fn crs_assertion_shape_refusals_map_to_distinct_engine_dot_codes() {
        let e = error_of(&EngineError::CrsAssertionIdentifierBlank);
        assert_eq!(e.code, "engine.crs_assertion_identifier_blank");
        assert!(e.fields.is_empty());

        let e = error_of(&EngineError::CrsAssertionDefinitionTooLarge {
            limit: 65_536,
            saw: 70_000,
        });
        assert_eq!(e.code, "engine.crs_assertion_definition_too_large");
        assert_eq!(e.fields.get("limit").map(String::as_str), Some("65536"));
        assert_eq!(e.fields.get("saw").map(String::as_str), Some("70000"));
    }

    // ---- `filter_error_of` — one test per `skp.filter_*` code (`NEXT-CUT.md` design essential 5,
    // brief evidence item B) ------------------------------------------------------------------
    //
    // `filter_error_of`'s match has no wildcard arm (a compile-time exhaustiveness property, same
    // discipline `error_of` uses above), and unlike `every_engine_error_variant_maps_to_a_distinct_
    // engine_dot_code`'s three-of-twenty sample, every one of `FilterError`'s twelve variants gets
    // its own test below — code AND every field key asserted, never a bare `is_err`.

    #[test]
    fn filter_dialect_unsupported_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::DialectUnsupported {
            declared: "sql/legacy".into(),
        });
        assert_eq!(e.code, "skp.filter_dialect_unsupported");
        assert_eq!(
            e.fields.get("declared").map(String::as_str),
            Some("sql/legacy")
        );
    }

    #[test]
    fn filter_unparsable_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::Unparsable {
            detail: "syntax error".into(),
        });
        assert_eq!(e.code, "skp.filter_unparsable");
        assert_eq!(
            e.fields.get("detail").map(String::as_str),
            Some("syntax error")
        );
    }

    #[test]
    fn filter_not_a_single_expression_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::NotASingleExpression { statements: 2 });
        assert_eq!(e.code, "skp.filter_not_a_single_expression");
        assert_eq!(e.fields.get("statements").map(String::as_str), Some("2"));
    }

    #[test]
    fn filter_construct_not_admitted_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::ConstructNotAdmitted {
            construct: "a subquery".into(),
        });
        assert_eq!(e.code, "skp.filter_construct_not_admitted");
        assert_eq!(
            e.fields.get("construct").map(String::as_str),
            Some("a subquery")
        );
    }

    #[test]
    fn filter_unknown_column_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::UnknownColumn {
            column: "zzz".into(),
        });
        assert_eq!(e.code, "skp.filter_unknown_column");
        assert_eq!(e.fields.get("column").map(String::as_str), Some("zzz"));
    }

    #[test]
    fn filter_column_not_filterable_maps_to_its_code_and_fields() {
        let e = filter_error_of(&FilterError::ColumnNotFilterable {
            column: "geometry".into(),
            reason: "this is the geometry column".into(),
        });
        assert_eq!(e.code, "skp.filter_column_not_filterable");
        assert_eq!(e.fields.get("column").map(String::as_str), Some("geometry"));
        assert_eq!(
            e.fields.get("reason").map(String::as_str),
            Some("this is the geometry column")
        );
    }

    #[test]
    fn filter_identity_alias_ambiguous_maps_to_its_code_and_fields() {
        let e = filter_error_of(&FilterError::IdentityAliasAmbiguous {
            column: "id".into(),
            source_column: "parcel_key".into(),
        });
        assert_eq!(e.code, "skp.filter_identity_alias_ambiguous");
        assert_eq!(e.fields.get("column").map(String::as_str), Some("id"));
        assert_eq!(
            e.fields.get("source_column").map(String::as_str),
            Some("parcel_key")
        );
    }

    #[test]
    fn filter_not_boolean_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::NotBoolean {
            inferred_type: "BIGINT".into(),
        });
        assert_eq!(e.code, "skp.filter_not_boolean");
        assert_eq!(
            e.fields.get("inferred_type").map(String::as_str),
            Some("BIGINT")
        );
    }

    #[test]
    fn filter_too_long_maps_to_its_code_and_fields() {
        let e = filter_error_of(&FilterError::TooLong {
            limit: 4096,
            saw: 5000,
        });
        assert_eq!(e.code, "skp.filter_too_long");
        assert_eq!(e.fields.get("limit").map(String::as_str), Some("4096"));
        assert_eq!(e.fields.get("saw").map(String::as_str), Some("5000"));
    }

    #[test]
    fn filter_too_deep_maps_to_its_code_and_fields() {
        let e = filter_error_of(&FilterError::TooDeep { limit: 32, saw: 40 });
        assert_eq!(e.code, "skp.filter_too_deep");
        assert_eq!(e.fields.get("limit").map(String::as_str), Some("32"));
        assert_eq!(e.fields.get("saw").map(String::as_str), Some("40"));
    }

    #[test]
    fn filter_rejected_by_binder_maps_to_its_code_and_field() {
        let e = filter_error_of(&FilterError::RejectedByBinder {
            detail: "binder refused".into(),
        });
        assert_eq!(e.code, "skp.filter_rejected_by_binder");
        assert_eq!(
            e.fields.get("detail").map(String::as_str),
            Some("binder refused")
        );
    }

    /// B-T6 (`FILTER-BIND-COERCIONS-PREREGISTRATION.md` §4). Mutation: the arm maps to
    /// `filter_rejected_by_binder`. It fails by name.
    #[test]
    fn filter_type_not_admitted_maps_to_its_code_and_fields() {
        let e = filter_error_of(&FilterError::TypeNotAdmitted {
            construct: "=".to_string(),
            operand_types: vec!["VARCHAR".to_string(), "INTEGER literal".to_string()],
            reason: TypeRefusalReason::TextWithNonText,
        });
        assert_eq!(e.code, "skp.filter_type_not_admitted");
        assert_eq!(e.fields.get("construct").map(String::as_str), Some("="));
        assert_eq!(
            e.fields.get("operand_types").map(String::as_str),
            Some("VARCHAR; INTEGER literal")
        );
        assert_eq!(
            e.fields.get("reason").map(String::as_str),
            Some("text_with_non_text")
        );
        assert_eq!(e.fields.len(), 3, "no extra field: {e:?}");
    }

    /// The ruling of 2026-09-13 (DECISIONS-PENDING entry 91 (a)) at this crate's own boundary: a
    /// residual admission-lease exhaustion reaching `viewport_query`'s error match surfaces as the
    /// typed `engine.connections_exhausted`, **never** as a binder rejection. Before this arm
    /// existed the same value folded through `From<PredicateAdmitError> for FilterError` into
    /// `FilterError::RejectedByBinder` and left here as `skp.filter_rejected_by_binder` — a refusal
    /// the shell's declared retryable set does not retry, i.e. a silent tile drop.
    #[test]
    fn a_residual_admission_lease_exhaustion_maps_to_engine_connections_exhausted_never_filter_rejected_by_binder(
    ) {
        let e = predicate_admit_error_of(PredicateAdmitError::ConnectionsExhausted {
            class: "admission",
            capacity: 4,
        });
        assert_ne!(
            e.code, "skp.filter_rejected_by_binder",
            "a lease-capacity fact must never be reported as a binder rejection: {e:?}"
        );
        assert_eq!(e.code, "engine.connections_exhausted");
        assert_eq!(e.fields.get("class").map(String::as_str), Some("admission"));
        assert_eq!(e.fields.get("capacity").map(String::as_str), Some("4"));

        // The other half of the same match, in the same test: an admission-*content* refusal still
        // takes `filter_error_of`'s twelve-code route, unchanged (ADR-021 item 8) — including the
        // genuine binder rejection, whose code the arm above must not be allowed to steal.
        let e =
            predicate_admit_error_of(PredicateAdmitError::Filter(FilterError::RejectedByBinder {
                detail: "binder refused".into(),
            }));
        assert_eq!(e.code, "skp.filter_rejected_by_binder");
        assert_eq!(
            e.fields.get("detail").map(String::as_str),
            Some("binder refused")
        );

        let e = predicate_admit_error_of(PredicateAdmitError::Filter(FilterError::NotBoolean {
            inferred_type: "BIGINT".into(),
        }));
        assert_eq!(e.code, "skp.filter_not_boolean");
        assert_eq!(
            e.fields.get("inferred_type").map(String::as_str),
            Some("BIGINT")
        );
    }

    /// **`skp/0.4`, crs-unit-fact-and-bounds**, §3 row 9: a named unit that is neither degree nor
    /// metre is a real, established fact (`Other`), never folded into `Unestablished`, which means
    /// no unit was established at all — the two are different facts and must stay apart.
    ///
    /// Mutation: `Named(_) => CrsUnit::Unestablished` in `crs_unit_of`. Expected failure: this test
    /// fails by name.
    #[test]
    fn named_unit_projects_to_other_never_to_unestablished() {
        let named = spatial_engine::CoordinateUnit::Named("US survey foot".to_string());
        assert_eq!(crs_unit_of(&named), CrsUnit::Other);
        assert_ne!(crs_unit_of(&named), CrsUnit::Unestablished);
    }

    /// **`skp/0.4`, crs-unit-fact-and-bounds.** The real `describe` response for §3 row 3
    /// (`AbsentKey` x `Wgs84Degrees`, `unit:format-rule`) carries the same `crs` key set and the
    /// same `unit` value as the shared shell/Rust fixture
    /// `protocol/skp/tests/data/v0-describe-response-session-ordinal.json` — the same real-shape
    /// discipline `an_engine_produced_lod_refusal_reaches_the_wire_as_engine_dot_lod_refused` above
    /// follows: a real `SkpHost::open_dataset` + `describe` round trip, not a hand-built value.
    ///
    /// Mutation: that fixture's `unit` set to `"metre"`. Expected failure: this test fails by name.
    #[test]
    fn the_real_describe_crs_shape_matches_the_shared_fixture() {
        use spatial_engine::fixture::{write_geoparquet, CoordinateDomain, CrsMode, FixtureSpec};

        let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .expect("workspace root")
            .join("target/fixtures/skp-crs-unit-seam");
        std::fs::create_dir_all(&dir).expect("fixture dir");
        let path = dir.join("row3-absent-key-degrees.parquet");
        write_geoparquet(
            &path,
            &FixtureSpec {
                features: 20,
                avg_vertices: 6,
                hole_every: 0,
                crs_mode: CrsMode::AbsentKey,
                domain: CoordinateDomain::Wgs84Degrees,
                with_geo_bbox: true,
                ..Default::default()
            },
        )
        .expect("write fixture");

        let catalog = Arc::new(Catalog::new());
        let host = SkpHost::new(
            catalog,
            StreamRegistry::new(),
            no_watch_arm(),
            discard_session_end_events(),
        );
        let open = host
            .open_dataset(OpenDatasetRequest {
                skp: SKP_VERSION.to_string(),
                path: path.display().to_string(),
                cancel_key: "row3-crs-unit-seam".to_string(),
                crs_assertion: None,
                identity: None,
            })
            .expect("open");
        let describe = host
            .describe(DescribeRequest {
                skp: SKP_VERSION.to_string(),
                dataset: open.dataset,
            })
            .expect("describe");

        let real_crs = serde_json::to_value(&describe.crs).unwrap();
        let real_keys: std::collections::BTreeSet<String> =
            real_crs.as_object().unwrap().keys().cloned().collect();

        let fixture_path = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .expect("workspace root")
            .join("protocol/skp/tests/data/v0-describe-response-session-ordinal.json");
        let fixture_raw = std::fs::read_to_string(&fixture_path).expect("read shared fixture");
        let fixture_json: serde_json::Value =
            serde_json::from_str(&fixture_raw).expect("shared fixture is valid JSON");
        let fixture_crs = fixture_json
            .get("crs")
            .expect("shared fixture has a crs object");
        let fixture_keys: std::collections::BTreeSet<String> =
            fixture_crs.as_object().unwrap().keys().cloned().collect();

        assert_eq!(
            real_keys, fixture_keys,
            "the real describe crs key set must match the shared fixture's"
        );
        assert_eq!(
            real_crs.get("unit"),
            fixture_crs.get("unit"),
            "the real describe unit value must match the shared fixture's"
        );
    }
}

/// **DECISIONS-PENDING.md entry 132 — a `Pending` ticket's `EngineSource` dropped under
/// `StreamRegistry`'s `Mutex`, whose `Drop` re-locks the same `Mutex` on the same thread.**
///
/// **The chain, read from the real code before this module was written.** A `Pending`
/// [`TicketState`] owns a [`PendingBuilt`] whose `source` is a boxed real `crate::EngineSource`
/// (built by `crate::wrap_for_data_plane`, the same function `SkpHost::viewport_query` calls).
/// `StreamRegistry::cancel`'s `Pending` arm, `cancel_all_for_dataset`'s `Pending` arm, and
/// `sweep_locked`'s `retain` (reached from `sweep_expired`, `mint`, `redeem`, `cancel` and
/// `cancel_all_for_dataset`, each of which sweeps under its own lock before doing anything else)
/// all replaced or removed a `Pending` entry **while the `tickets` `Mutex` guard was held** —
/// dropping its `PendingBuilt.source` right there. `EngineSource::drop` calls
/// `end_session_if_source_changed`, which — if the stream's post-check has already recorded a
/// change (`StreamStats::source_changed_detail`, set by the producer thread before any terminal is
/// sent, `engine/src/stream.rs:1190-1195`) — calls `SessionInvalidator::end_generation`, which
/// calls `GenerationRegistry::invalidate` (a **different** `Mutex`, no conflict) and then, for
/// every ticket handle that generation held, `StreamRegistry::cancel` again — **the same `Mutex`,
/// on the same thread, already held**. `std::sync::Mutex` is not reentrant: the second `lock()`
/// blocks forever.
///
/// **Every other lock in this file was read and ruled out.** `GenerationRegistry`'s own `Mutex`
/// wraps only `String`/`u64`/`Instant` values with no `Drop` impl that reaches back anywhere
/// (`GenerationState`, above). `OpenRegistry`'s `Mutex` holds `engine::CancelToken`s, whose `Drop`
/// (`engine/src/cancel.rs`) is the default (no user impl) and touches nothing beyond its own
/// `Arc<Inner>`. `StreamRegistry::cancel`'s and `cancel_all_for_dataset`'s `Redeemed` arms call
/// `cancel.cancel()` (`EngineCancel` → `CancelToken::cancel`, `kernel/src/lib.rs:571-575`), which
/// sets an atomic flag and interrupts DuckDB — it does not drop the `TicketState`, and neither arm
/// takes a registry lock beyond the one its own call already holds. `StreamRegistry::redeem`
/// removes a `Pending` entry too, but **moves** its
/// `built.source`/`built.cancel` out into its `Ok(..)` return value rather than dropping them under
/// the lock — the caller (outside any lock) owns the drop, so `redeem` was never part of this
/// defect; it is exercised here only via the `sweep_locked` call at its own top.
///
/// **Reproducing the race deterministically.** A genuinely unredeemed `Pending` ticket only reaches
/// this state by a real race against its own producer thread (ADR-019: the engine stream is built,
/// and its producer thread started, synchronously and *before* the ticket is minted — nothing here
/// waits for a consumer to call `next_into` even once). Waiting on that race would make these tests
/// flaky. Instead, [`drained_stream_with_a_recorded_change`] drains the real `BatchStream` to its
/// real terminal on the test's own thread first — the producer thread the real stream already
/// started runs to completion and records its real post-check finding regardless of who reads the
/// channel — and only then is the same, now-finished, stream wrapped into a real `EngineSource` and
/// minted as `Pending`, exactly as `SkpHost::viewport_query` would have left it had the producer
/// merely finished first. Every step after the drain is the real product call.
///
/// **Detecting a hang without hanging this suite.** Each of the first three tests below runs the
/// suspect call (`cancel`, `sweep_expired`, `cancel_all_for_dataset`) on a spawned thread and waits
/// on a bounded channel receive (see [`run_with_timeout`]). A pre-fix run blocks that spawned thread
/// forever; the *test* thread does not block past the timeout and fails by name instead. **The
/// spawned thread itself is not joined and is deliberately leaked on a real hang** — if the call
/// really deadlocked, nothing can un-stick it, and joining it here would just move the hang into
/// this test.
#[cfg(test)]
mod ticket_drop_under_lock_regression {
    use super::*;
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::sync::mpsc;
    use std::time::Duration;

    use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};

    /// Generous relative to any real lock hold in this registry (a handful of map operations); the
    /// only thing this bounds is how long a pre-fix run of this suite waits before failing.
    const HANG_TIMEOUT: Duration = Duration::from_secs(5);

    fn fixture(name: &str) -> std::path::PathBuf {
        let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../target/fixtures/ticket-drop-under-lock");
        std::fs::create_dir_all(&dir).expect("fixture dir");
        let path = dir.join(format!("{name}.parquet"));
        write_geoparquet(
            &path,
            &FixtureSpec {
                features: 50,
                avg_vertices: 8,
                identity: IdentityMode::NativeUnique,
                ..Default::default()
            },
        )
        .expect("write fixture");
        path
    }

    /// Move a file's modification time forward without touching a byte of it — the single-component
    /// mutation `kernel/tests/session_generation.rs`'s `touch_modification_time` makes,
    /// reproduced here for the same reason: it is a real, detectable source change that does not
    /// make DuckDB fail on a truncated read.
    fn touch_modification_time(path: &std::path::Path) {
        let later = std::time::SystemTime::now() + Duration::from_secs(120);
        std::fs::File::options()
            .write(true)
            .open(path)
            .expect("reopen to set mtime")
            .set_modified(later)
            .expect("set mtime");
    }

    /// Build a real engine stream, let its pre-check pass, mutate the file, then drain the stream to
    /// its real terminal on this thread — see this module's own doc comment for why the drain
    /// replaces waiting on the real background-completion race. Asserts the post-check actually
    /// found the change, so a future engine change that breaks this setup fails here loudly rather
    /// than leaving every test below vacuously non-reproducing.
    fn drained_stream_with_a_recorded_change(
        path: &std::path::Path,
    ) -> (spatial_engine::BatchStream, spatial_engine::CancelToken) {
        let ds = spatial_engine::Dataset::open(path).expect("open dataset");
        let query = spatial_engine::ViewportQuery::all();
        let (mut stream, cancel) =
            crate::open_engine_stream(&ds, &query, None).expect("build stream");
        // The pre-check already ran, synchronously, inside `open_engine_stream` above, and passed —
        // mutating only now is what makes this the post-check's finding, not the pre-check's.
        touch_modification_time(path);
        let mut buf = Vec::new();
        while stream.next_into(&mut buf).is_some() {
            buf.clear();
        }
        assert!(
            stream.stats().source_changed_detail().is_some(),
            "setup did not force a real post-check finding — every test in this module would pass \
             vacuously"
        );
        (stream, cancel)
    }

    /// Run `f` on a spawned thread; `None` means it did not finish within `timeout`. The defect this
    /// module guards reproduces as exactly that — never a panic — so a bounded join turns a hang
    /// into an ordinary, named test failure instead of hanging the whole suite.
    fn run_with_timeout<T: Send + 'static>(
        timeout: Duration,
        f: impl FnOnce() -> T + Send + 'static,
    ) -> Option<T> {
        let (tx, rx) = mpsc::channel();
        std::thread::spawn(move || {
            let _ = tx.send(f());
        });
        rx.recv_timeout(timeout).ok()
    }

    /// A real `Pending` ticket, minted and attributed exactly as `SkpHost::viewport_query` would
    /// leave it, wrapping a stream already drained (see [`drained_stream_with_a_recorded_change`]).
    /// Returns the registries and the handle so each test can drive its own suspect call.
    fn seeded_pending_ticket(
        dataset: &str,
        path: &std::path::Path,
    ) -> (Arc<StreamRegistry>, Arc<GenerationRegistry>, StreamHandle) {
        let (stream, cancel) = drained_stream_with_a_recorded_change(path);
        let ds = spatial_engine::Dataset::open(path).expect("reopen for connection config");
        let reuses = ds.connections().config().reuses_connections();

        let tickets = StreamRegistry::new();
        let generations = GenerationRegistry::new();
        let invalidator = SessionInvalidator::new(
            generations.clone(),
            tickets.clone(),
            discard_session_end_events(),
        );
        let (source, source_cancel) = crate::wrap_for_data_plane(
            stream,
            cancel,
            dataset.to_string(),
            reuses,
            None,
            Some(invalidator),
        );

        generations.mint_for_open(dataset, SessionRef::mint());
        let handle = tickets
            .mint(dataset, source, source_cancel)
            .expect("mint a pending ticket");
        assert!(
            generations.attribute_ticket(handle.as_str(), dataset),
            "attribute under the live generation `mint_for_open` just minted"
        );
        (tickets, generations, handle)
    }

    /// RECORDED MUTATION (A): in the fixed `StreamRegistry::cancel`, replace
    /// `retired = Some(std::mem::replace(state, TicketState::CancelledBeforeRedeem { .. }))` with
    /// the pre-fix `*state = TicketState::CancelledBeforeRedeem { .. }` (dropping the old value in
    /// place, under the lock). Observed failure (performed once on this branch, then reverted): this
    /// test FAILED by timeout, on the "did not return within" message below — and so did
    /// `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`,
    /// which drives the same `StreamRegistry::cancel` call on a similarly-seeded ticket (correcting
    /// `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`'s Results section, which had said only
    /// this test failed).
    ///
    /// RECORDED MUTATION (B, reviewer should-fix, PR #116 attempt 1): replace the same line with
    /// `std::mem::forget(std::mem::replace(state, TicketState::CancelledBeforeRedeem { .. }))` —
    /// retiring the entry without ever dropping the moved-out `EngineSource`, so `end_generation`
    /// never runs. Does not hang (nothing is dropped under the lock). Observed failure (performed
    /// once on this branch, then reverted): the `ticket_liveness` assertion below FAILED (`Live`,
    /// not `EndedBySourceChange`) — and so did
    /// `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`
    /// (its `viewport_query` stopped refusing, because the generation was never ended).
    #[test]
    fn cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang() {
        let path = fixture("cancel-path");
        let (tickets, generations, handle) = seeded_pending_ticket("ds_cancel_path", &path);

        let outcome = run_with_timeout(HANG_TIMEOUT, {
            let tickets = tickets.clone();
            let h = handle.as_str().to_string();
            move || tickets.cancel(&h)
        })
        .unwrap_or_else(|| {
            panic!(
                "cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang: \
                 StreamRegistry::cancel did not return within {HANG_TIMEOUT:?} — its dropped \
                 EngineSource re-locked the same Mutex from inside cancel() (DECISIONS-PENDING.md \
                 entry 132; the spawned thread is leaked, not joined, so this test itself does not \
                 hang)"
            )
        });
        assert!(matches!(outcome, CancelOutcome::Requested));
        // Reviewer should-fix (PR #116 attempt 1): the hang-avoidance assertion above cannot see a
        // fix that avoids the hang by forgetting the retired value instead of dropping it after
        // release — only this generation-liveness check can.
        assert_eq!(
            generations.ticket_liveness(handle.as_str()),
            TicketLiveness::EndedBySourceChange
        );
    }

    /// RECORDED MUTATION: in the fixed `StreamRegistry::sweep_locked`, replace the collect-and-remove
    /// form with the pre-fix `tickets.retain(|_, state| ...)` (dropping a swept value in place,
    /// inside `retain`, under the caller's lock). Observed failure (performed once on this branch,
    /// then reverted): `sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang`
    /// FAILED — panicked on the "did not return within" message below.
    #[test]
    fn sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang() {
        let path = fixture("sweep-path");
        let (tickets, generations, handle) = seeded_pending_ticket("ds_sweep_path", &path);

        // Seeded directly past `TICKET_TTL` rather than waiting for real time to pass — ADR-018
        // forbids a test spending a real 30-second wait to prove a lock-ordering property. `Instant`
        // on this platform (Windows, backed by `QueryPerformanceCounter`) counts from system boot,
        // not from process start, so subtracting `TICKET_TTL` is safe on any machine that has been
        // up longer than that — `checked_sub` makes the (practically unreachable) alternative a
        // clear test failure rather than a panic mid-arithmetic.
        let expired_minted_at = std::time::Instant::now()
            .checked_sub(TICKET_TTL + Duration::from_secs(1))
            .expect("system uptime exceeds TICKET_TTL; re-run once the machine has been up longer");
        {
            let mut map = tickets.tickets.lock().unwrap_or_else(|e| e.into_inner());
            let Some(TicketState::Pending { built, dataset, .. }) = map.remove(handle.as_str())
            else {
                panic!("seeded_pending_ticket did not leave a Pending entry");
            };
            map.insert(
                handle.as_str().to_string(),
                TicketState::Pending {
                    built,
                    dataset,
                    minted_at: expired_minted_at,
                },
            );
        }

        run_with_timeout(HANG_TIMEOUT, {
            let tickets = tickets.clone();
            move || tickets.sweep_expired()
        })
        .unwrap_or_else(|| {
            panic!(
                "sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang: \
                 StreamRegistry::sweep_expired did not return within {HANG_TIMEOUT:?} — the swept \
                 EngineSource re-locked the same Mutex from inside sweep_locked's own drop \
                 (DECISIONS-PENDING.md entry 132; the spawned thread is leaked, not joined)"
            )
        });
        // No behaviour change from the fix: the sweep's drop still reaches
        // `SessionInvalidator::end_generation`, which still records the handle as dead before
        // pruning its attribution — this registry still knows the handle was ended by a source
        // change, not merely swept away.
        assert_eq!(
            generations.ticket_liveness(handle.as_str()),
            TicketLiveness::EndedBySourceChange
        );
    }

    /// RECORDED MUTATION (A): in the fixed `StreamRegistry::cancel_all_for_dataset`, replace
    /// `retired.push(std::mem::replace(state, TicketState::CancelledBeforeRedeem { .. }))` with the
    /// pre-fix `*state = TicketState::CancelledBeforeRedeem { .. }`. Observed failure (performed once
    /// on this branch, then reverted): this test FAILED by timeout, on the "did not return within"
    /// message below.
    ///
    /// RECORDED MUTATION (B, reviewer should-fix, PR #116 attempt 1): replace the same line with
    /// `retired.push`'s argument wrapped in `std::mem::forget` applied to the replaced value instead
    /// of pushed (retiring the entry without ever dropping the moved-out `EngineSource`, so
    /// `end_generation` never runs). Does not hang. Observed failure (performed once on this branch,
    /// then reverted): this test's old assertions (`n == 1`) still PASSED — the reviewer's finding
    /// that "forgetting the retired value passes the whole suite on the cancel_all path" — and only
    /// the `ticket_liveness` assertion below, added for this finding, FAILED (`Live`, not
    /// `EndedBySourceChange`).
    #[test]
    fn cancel_all_for_dataset_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang() {
        let path = fixture("cancel-all-for-dataset-path");
        let (tickets, generations, handle) = seeded_pending_ticket("ds_cancel_all_path", &path);

        let n = run_with_timeout(HANG_TIMEOUT, {
            let tickets = tickets.clone();
            move || tickets.cancel_all_for_dataset("ds_cancel_all_path")
        })
        .unwrap_or_else(|| {
            panic!(
                "cancel_all_for_dataset_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang: \
                 StreamRegistry::cancel_all_for_dataset did not return within {HANG_TIMEOUT:?} — its \
                 dropped EngineSource re-locked the same Mutex from inside cancel_all_for_dataset() \
                 (DECISIONS-PENDING.md entry 132; the spawned thread is leaked, not joined)"
            )
        });
        assert_eq!(n, 1);
        // Reviewer should-fix (PR #116 attempt 1): `n == 1` alone cannot see a fix that avoids the
        // hang by forgetting the retired value instead of dropping it after release.
        assert_eq!(
            generations.ticket_liveness(handle.as_str()),
            TicketLiveness::EndedBySourceChange
        );
    }

    /// **No behaviour change, asserted as an outcome.** After a ticket whose source changed is
    /// cancelled — through `StreamRegistry::cancel` directly, the same call this module's `cancel`
    /// test drives; only the `viewport_query` below goes through a real `SkpHost` — the next
    /// `viewport_query` on that dataset refuses by its typed code, the same refusal
    /// `kernel/tests/session_generation.rs`'s pre-check test already asserts for the *pre-check*
    /// path; this is the same claim on the *post-check* / drop path the fix touches.
    ///
    /// **Not free of `cancel`'s mutations, corrected (PR #116 attempt 1).** This test carries
    /// no mutation of its own, but two of `cancel`'s RECORDED MUTATIONs above also fail it when
    /// reintroduced, both observed once on this branch and reverted: (A) (drop-in-place under the
    /// lock, the original hang) hangs this test's own `cancel` call exactly as it hangs
    /// `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` — correcting
    /// `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`'s Results section, which said only that
    /// test failed; (B) (forgetting the
    /// retired value) fails this test at its `expect_err` call below, where `viewport_query`
    /// returns `Ok` so the `refused.code` assertion is never reached: a forgotten `EngineSource`
    /// never ends the generation this test's `viewport_query` depends on refusing against.
    #[test]
    fn after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name() {
        let dataset_handle = DatasetHandle::mint();
        let name = dataset_handle.as_str().to_string();
        let path = fixture("viewport-query-refusal-path");

        let (stream, cancel) = drained_stream_with_a_recorded_change(&path);
        let reuses = spatial_engine::Dataset::open(&path)
            .expect("reopen for connection config")
            .connections()
            .config()
            .reuses_connections();

        let catalog = Arc::new(Catalog::new());
        // Opened after the mutation above — fine, because this test's refusal comes from
        // `GenerationRegistry`'s `invalidated` set (set by the cancel below), never from this
        // dataset's own pre-check descriptor.
        catalog.open(&name, &path, None).expect("open dataset");
        let tickets = StreamRegistry::new();
        let host = SkpHost::new(
            catalog,
            tickets.clone(),
            no_watch_arm(),
            discard_session_end_events(),
        );
        let generations = host.generations();
        let invalidator = SessionInvalidator::new(
            generations.clone(),
            tickets.clone(),
            discard_session_end_events(),
        );
        let (source, source_cancel) = crate::wrap_for_data_plane(
            stream,
            cancel,
            name.clone(),
            reuses,
            None,
            Some(invalidator),
        );

        generations.mint_for_open(&name, SessionRef::mint());
        let handle = tickets
            .mint(&name, source, source_cancel)
            .expect("mint a pending ticket");
        assert!(generations.attribute_ticket(handle.as_str(), &name));

        run_with_timeout(HANG_TIMEOUT, {
            let tickets = tickets.clone();
            let h = handle.as_str().to_string();
            move || tickets.cancel(&h)
        })
        .unwrap_or_else(|| panic!("StreamRegistry::cancel did not return within {HANG_TIMEOUT:?}"));

        let request = ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: dataset_handle,
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
            columns: None,
        };
        let refused = host
            .viewport_query(request)
            .expect_err("the ended generation refuses");
        assert_eq!(refused.code, "engine.source_changed", "{}", refused.message);
    }

    /// Test-only `BatchSource`: `synthetic_source` in `tests` is private to that module.
    struct EmptySource;
    impl BatchSource for EmptySource {
        fn next_into(
            &mut self,
            _out: &mut Vec<u8>,
        ) -> Option<Result<spatial_data_plane::transport::BatchMeta, String>> {
            None
        }
    }

    /// Test-only `SourceCancel` whose `cancel` panics with a message naming the test that planted it.
    struct PanickingCancel(&'static str);
    impl SourceCancel for PanickingCancel {
        fn cancel(&self) {
            panic!("{}: SourceCancel::cancel panics on purpose", self.0);
        }
    }

    /// Q (`Redeemed`, never cancelled, never attributed to a generation, so the unwind's generation
    /// end never cancels it a second time) and P (`Pending`, real source, generation opened but the
    /// ticket not yet attributed), both in registries this struct holds.
    struct UnwindSetup {
        tickets: Arc<StreamRegistry>,
        generations: Arc<GenerationRegistry>,
        p: String,
        p_dataset: String,
        q: String,
    }

    impl UnwindSetup {
        fn new(test: &'static str, stem: &str, p_dataset: &str, q_dataset: &str) -> Self {
            let tickets = StreamRegistry::new();
            let generations = GenerationRegistry::new();
            // Q first, so no sweep can remove P before the call under test.
            let q = tickets
                .mint(
                    q_dataset,
                    Box::new(EmptySource),
                    Arc::new(PanickingCancel(test)),
                )
                .expect("mint Q");
            tickets.redeem(q.as_str()).expect("redeem Q");
            let path = fixture(stem);
            let (stream, cancel) = drained_stream_with_a_recorded_change(&path);
            let reuses = spatial_engine::Dataset::open(&path)
                .expect("reopen for connection config")
                .connections()
                .config()
                .reuses_connections();
            let invalidator = SessionInvalidator::new(
                generations.clone(),
                tickets.clone(),
                discard_session_end_events(),
            );
            let (source, source_cancel) = crate::wrap_for_data_plane(
                stream,
                cancel,
                p_dataset.to_string(),
                reuses,
                None,
                Some(invalidator),
            );
            generations.mint_for_open(p_dataset, SessionRef::mint());
            let p = tickets
                .mint(p_dataset, source, source_cancel)
                .expect("mint P");
            Self {
                tickets,
                generations,
                p: p.as_str().to_string(),
                p_dataset: p_dataset.to_string(),
                q: q.as_str().to_string(),
            }
        }

        /// Seed P past `TICKET_TTL` under the lock, as
        /// `sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang` does.
        fn backdate_p(&self) {
            let expired = std::time::Instant::now()
                .checked_sub(TICKET_TTL + Duration::from_secs(1))
                .expect(
                    "system uptime exceeds TICKET_TTL; re-run once the machine has been up longer",
                );
            let mut map = self
                .tickets
                .tickets
                .lock()
                .unwrap_or_else(|e| e.into_inner());
            let Some(TicketState::Pending { built, dataset, .. }) = map.remove(&self.p) else {
                panic!("UnwindSetup did not leave a Pending entry for P");
            };
            map.insert(
                self.p.clone(),
                TicketState::Pending {
                    built,
                    dataset,
                    minted_at: expired,
                },
            );
        }

        /// Require exactly P's and Q's entries (else fail by name). If P's key is not first in the
        /// map's iteration order, swap the two entries' values in place and the test's names for
        /// their keys with them: no key is removed or inserted, so the order does not move. Run
        /// before `attribute_p`.
        fn put_p_first(&mut self, test: &str) {
            let mut map = self
                .tickets
                .tickets
                .lock()
                .unwrap_or_else(|e| e.into_inner());
            let two = map.len() == 2 && map.contains_key(&self.p) && map.contains_key(&self.q);
            if two && map.keys().next() != Some(&self.p) {
                let mut values = map.values_mut();
                std::mem::swap(values.next().unwrap(), values.next().unwrap());
                std::mem::swap(&mut self.p, &mut self.q);
            }
            drop(map);
            assert!(
                two,
                "{test}: the map does not hold exactly P's and Q's entries"
            );
        }

        fn attribute_p(&self) {
            assert!(self.generations.attribute_ticket(&self.p, &self.p_dataset));
        }

        /// Run `call` on a spawned thread inside `catch_unwind`. Asserts it returned within
        /// `HANG_TIMEOUT`, that it unwound out of Q's panicking cancel, and that P's source was
        /// dropped (`EndedBySourceChange`), not leaked.
        fn call_unwinds_and_drops_p(
            &self,
            test: &'static str,
            site: &'static str,
            call: impl FnOnce(&StreamRegistry) + Send + 'static,
        ) {
            let tickets = self.tickets.clone();
            let outcome = run_with_timeout(HANG_TIMEOUT, move || {
                std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| call(&tickets)))
            })
            .unwrap_or_else(|| {
                panic!(
                    "{test}: StreamRegistry::{site} did not return within {HANG_TIMEOUT:?} — the \
                     unwind dropped a swept or retired EngineSource while the guard was held, and \
                     its Drop re-locked the same Mutex (the spawned thread is leaked, not joined)"
                )
            });
            let payload = outcome.expect_err("Q's cancel panics, so the call must unwind");
            let message = payload
                .downcast_ref::<String>()
                .cloned()
                .or_else(|| payload.downcast_ref::<&str>().map(|s| (*s).to_string()))
                .unwrap_or_default();
            assert!(message.contains(test), "unexpected panic: {message}");
            assert_eq!(
                self.generations.ticket_liveness(&self.p),
                TicketLiveness::EndedBySourceChange,
                "{test}: P's source was not dropped"
            );
        }
    }

    /// `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md` §4, T1: an unwind out of `cancel` (Q's
    /// panicking cancel) while P, expired and in another dataset, sits in `swept`.
    ///
    /// RECORDED MUTATION (M1): in `StreamRegistry::cancel`, declare `swept` after the guard again,
    /// the order at `c9f41126`. Observed at commit 1c8cea2207e2 (applied, run, reverted): this test
    /// FAILED by timeout (its name, then `: StreamRegistry::cancel did not return within 5s`); the
    /// two tests below passed.
    #[test]
    fn an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard() {
        const T: &str = "an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard";
        let s = UnwindSetup::new(T, "unwind-cancel-swept", "ds_p", "ds_q");
        s.backdate_p();
        s.attribute_p();
        let q = s.q.clone();
        s.call_unwinds_and_drops_p(T, "cancel", move |r| {
            r.cancel(&q);
        });
    }

    /// `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md` §4, T2: as T1, through
    /// `cancel_all_for_dataset` on Q's dataset.
    ///
    /// RECORDED MUTATION (M2): the same change in `cancel_all_for_dataset`. Observed at commit
    /// 1c8cea2207e2 (applied, run, reverted): this test FAILED by timeout (its name, then
    /// `: StreamRegistry::cancel_all_for_dataset did not return within 5s`); the tests above and
    /// below passed, because T3's `swept` is empty.
    #[test]
    fn an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard() {
        const T: &str = "an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard";
        let s = UnwindSetup::new(T, "unwind-cancel-all-swept", "ds_p", "ds_q");
        s.backdate_p();
        s.attribute_p();
        s.call_unwinds_and_drops_p(T, "cancel_all_for_dataset", |r| {
            r.cancel_all_for_dataset("ds_q");
        });
    }

    /// `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md` §4, T3: P is not expired and shares
    /// dataset D with Q; `cancel_all_for_dataset` on D retires P (into `retired`) before it reaches
    /// Q's panicking cancel, which needs P's key first in the map's iteration order
    /// (`put_p_first`). The extra assertion checks P's entry is `CancelledBeforeRedeem`, so a
    /// failed precondition fails by name and cannot pass vacuously.
    ///
    /// RECORDED MUTATION (M3): in `cancel_all_for_dataset`, declare `retired` after the guard
    /// again. Observed at commit 1c8cea2207e2 (applied, run, reverted): this test FAILED by timeout
    /// (its name, then `: StreamRegistry::cancel_all_for_dataset did not return within 5s`); the
    /// two tests above passed, because their `retired` is empty.
    #[test]
    fn an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard()
    {
        const T: &str = "an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard";
        let mut s = UnwindSetup::new(T, "unwind-cancel-all-retired", "ds_d", "ds_d");
        s.put_p_first(T);
        s.attribute_p();
        s.call_unwinds_and_drops_p(T, "cancel_all_for_dataset", |r| {
            r.cancel_all_for_dataset("ds_d");
        });
        let map = s.tickets.tickets.lock().unwrap_or_else(|e| e.into_inner());
        assert!(
            matches!(
                map.get(&s.p),
                Some(TicketState::CancelledBeforeRedeem { .. })
            ),
            "{T}: P was not retired before Q's cancel panicked"
        );
    }

    // ---------------------------------------------------------------------------------------------
    // E5, E7, E8 (`SOURCE-WATCHER-PREREGISTRATION.md` §4) — in-crate, reusing this module's own
    // helpers, per the doc's own placement note.
    //
    // **Phase-2 delta 5/6.** `SessionInvalidator::end_generation` is now split into two private
    // methods, `record` (the `GenerationRegistry::invalidate` call, returning `Option<EndReport>`)
    // and `enqueue` (`events.try_send` for an already-taken `EndReport`) — see their doc comments
    // just above `end_generation` in this same `impl SessionInvalidator` block. `end_generation`
    // itself calls them in that order, then cancels the report's tickets, exactly as before.
    //
    // The withdrawn no-window claim from this comment's earlier revision (phase 1, superseded at
    // `4137f4d`, Amendment 3 item 2) is not repeated here. E8 below no longer argues from a claimed
    // absence of a window; it drives the window directly, by calling `record` and `enqueue` itself
    // on the test's own thread around a real `host.close_dataset` call — the same shape ADR-035
    // Decision 3's close bullet describes for a data-plane thread that records an end, releases the
    // guard, lets `close_dataset`'s `forget_dataset` run, and only then enqueues.

    /// E5 `a_pending_ticket_retired_by_sweep_emits_once_and_does_not_hang`. The non-hang half of this
    /// claim is already `sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang`
    /// above; this test's own addition is the event itself, on a real channel this time rather than
    /// `discard_session_end_events()`.
    ///
    /// RECORDED MUTATION: same as E1 — move `SessionInvalidator::end_generation`'s `try_send` into
    /// `SkpHost::end_generation` only. Expected failure: this test's own sweep-triggered drop never
    /// goes through `SkpHost::end_generation` (nothing here ever calls it), so the event never
    /// arrives.
    #[test]
    fn a_pending_ticket_retired_by_sweep_emits_once_and_does_not_hang() {
        let path = fixture("sweep-emits-path");
        let (stream, cancel) = drained_stream_with_a_recorded_change(&path);
        let reuses = spatial_engine::Dataset::open(&path)
            .expect("reopen for connection config")
            .connections()
            .config()
            .reuses_connections();

        let dataset = "ds_sweep_emits_path";
        let tickets = StreamRegistry::new();
        let generations = GenerationRegistry::new();
        let (tx, rx) = super::session_end_channel();
        let invalidator = SessionInvalidator::new(generations.clone(), tickets.clone(), tx);
        let (source, source_cancel) = crate::wrap_for_data_plane(
            stream,
            cancel,
            dataset.to_string(),
            reuses,
            None,
            Some(invalidator),
        );

        generations.mint_for_open(dataset, SessionRef::mint());
        let handle = tickets
            .mint(dataset, source, source_cancel)
            .expect("mint a pending ticket");
        assert!(generations.attribute_ticket(handle.as_str(), dataset));

        // Seeded past `TICKET_TTL`, exactly as the non-hang test above does — see that test's own
        // comment for why a real wait is never used here (ADR-018).
        let expired_minted_at = std::time::Instant::now()
            .checked_sub(TICKET_TTL + Duration::from_secs(1))
            .expect("system uptime exceeds TICKET_TTL; re-run once the machine has been up longer");
        {
            let mut map = tickets.tickets.lock().unwrap_or_else(|e| e.into_inner());
            let Some(TicketState::Pending {
                built, dataset: d, ..
            }) = map.remove(handle.as_str())
            else {
                panic!("seeding did not leave a Pending entry");
            };
            map.insert(
                handle.as_str().to_string(),
                TicketState::Pending {
                    built,
                    dataset: d,
                    minted_at: expired_minted_at,
                },
            );
        }

        run_with_timeout(HANG_TIMEOUT, {
            let tickets = tickets.clone();
            move || tickets.sweep_expired()
        })
        .unwrap_or_else(|| {
            panic!("StreamRegistry::sweep_expired did not return within {HANG_TIMEOUT:?}")
        });

        let event = rx
            .recv_timeout(Duration::from_secs(5))
            .expect("one event, within the bound");
        assert_eq!(event.reason, WireEndReason::ObservedChange);
        assert!(
            rx.recv_timeout(Duration::from_millis(200)).is_err(),
            "exactly one event"
        );
    }

    /// E7 `a_pending_drop_inside_close_emits_once_with_its_session_reference`. A real `SkpHost`, a
    /// real `open_dataset` (so this test knows the exact reference the event must carry), and one
    /// `Pending` ticket for that same dataset wired through the **host's own** invalidator — so
    /// closing the dataset drops it via `cancel_all_for_dataset` (`SkpHost::close_dataset`, the
    /// removal, `begin_close`, cancel, forget order documented on that method), strictly before
    /// `forget_dataset` runs.
    ///
    /// RECORDED MUTATION (registered, §4's own text for E7: "look the reference up after the
    /// guard"): `SessionInvalidator::enqueue` re-reads the session from `GenerationRegistry`'s
    /// `live` map (keyed by dataset) instead of using the one already taken into `report` by
    /// `record`. Applied, run and reverted on this branch (`enqueue` and its one product call site
    /// in `end_generation` temporarily took a `dataset: &str` parameter to make the re-read
    /// possible; this test's own direct call below was updated to match, then both were reverted):
    /// `panicked at kernel\src\skp.rs:2870:14: one event, carrying the open's own reference: Timeout` —
    /// 1 failed. `record` (`GenerationRegistry::invalidate`) already removes the dataset's `live`
    /// entry as part of taking the report, strictly before `enqueue` ever runs, so any re-read
    /// finds nothing and the mutated `enqueue` returns without sending.
    ///
    /// RECORDED EXTRA (the mutation this doc's earlier revision mislabelled as E7's registered
    /// one, gate-1 B3): move the `enqueue` call out of `SessionInvalidator::end_generation` into
    /// `SkpHost::end_generation`'s own wrapper only, so the post-check/drop/close routes — which
    /// reach `SessionInvalidator::end_generation` directly, never through that wrapper — stop
    /// emitting. Observed failure (performed on this branch, then reverted): this test's
    /// `recv_timeout` timed out with "one event, carrying the open's own reference" never
    /// satisfied.
    ///
    /// RECORDED MUTATION (second, phase 1's own finding): swap `close_dataset`'s two lines —
    /// `self.generations.forget_dataset(name)` before `self.tickets.cancel_all_for_dataset(name)`.
    /// Observed failure (performed once on this branch, then reverted): by the time the ticket's
    /// drop reaches `GenerationRegistry::invalidate`, `forget_dataset` has already removed the live
    /// entry, so `invalidate` returns `None`, `end_generation` returns `0`, and no event is ever
    /// enqueued — this test's `recv_timeout` timed out.
    ///
    /// RECORDED EXTRA (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §4): make `begin_close`
    /// remove `live`. Applied at `12ccbeb`, run and reverted: this mutation FAILED this test by
    /// timeout, `one event, carrying the open's own reference: Timeout` — the drop's end found no
    /// live generation, so nothing emitted.
    #[test]
    fn a_pending_drop_inside_close_emits_once_with_its_session_reference() {
        let path = fixture("close-drop-path");
        let (tx, rx) = super::session_end_channel();
        let host = SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            no_watch_arm(),
            tx,
        );
        let open = host
            .open_dataset(OpenDatasetRequest {
                skp: SKP_VERSION.to_string(),
                path: path.display().to_string(),
                cancel_key: "e7".to_string(),
                crs_assertion: None,
                identity: None,
            })
            .expect("open");
        let name = open.dataset.as_str().to_string();

        let (stream, cancel) = drained_stream_with_a_recorded_change(&path);
        let reuses = spatial_engine::Dataset::open(&path)
            .expect("reopen for connection config")
            .connections()
            .config()
            .reuses_connections();
        // The host's OWN invalidator, cloned from its private field (accessible: this test module is
        // a descendant of the module `SkpHost` is defined in) — so this ticket's drop reaches the
        // exact channel `host`'s constructor was given, the same one `rx` above reads.
        let (source, source_cancel) = crate::wrap_for_data_plane(
            stream,
            cancel,
            name.clone(),
            reuses,
            None,
            Some(host.invalidator.clone()),
        );
        let handle = host
            .tickets()
            .mint(&name, source, source_cancel)
            .expect("mint a pending ticket");
        assert!(host.generations().attribute_ticket(handle.as_str(), &name));

        host.close_dataset(CloseDatasetRequest {
            skp: SKP_VERSION.to_string(),
            dataset: open.dataset,
        })
        .expect("close");

        let event = rx
            .recv_timeout(Duration::from_secs(5))
            .expect("one event, carrying the open's own reference");
        assert_eq!(event.session, open.session);
        assert!(
            rx.recv_timeout(Duration::from_millis(200)).is_err(),
            "exactly one event"
        );
    }

    /// E8 `an_end_recorded_before_forget_dataset_and_enqueued_after_it_carries_its_reference`
    /// (rebuilt, phase 2 delta 6). ADR-035 Decision 3's close bullet names a route E7 alone cannot
    /// reach: a data-plane thread records the end (`record`, under `GenerationRegistry`'s guard),
    /// releases that guard, `close_dataset`'s `forget_dataset` then runs on the close's own thread,
    /// and only *afterwards* does the first thread's `enqueue` run. This test drives that window
    /// directly instead of arguing from ticket-drop timing: it calls `SessionInvalidator::record`
    /// itself (reachable — this module is a descendant of `skp`, `record` and `enqueue` are private
    /// to that module), then runs a real `host.close_dataset` to completion, then calls `enqueue` on
    /// the already-taken `EndReport` — proving the reference recorded before `forget_dataset` still
    /// carries correctly on an enqueue that runs after it.
    ///
    /// RECORDED MUTATION (registered, phase 2 delta 6): `enqueue` reads the reference from
    /// `GenerationRegistry` instead of from the already-taken `EndReport`. Observed failure
    /// (performed on this branch, then reverted): by the time this test's `enqueue` call runs,
    /// `close_dataset`'s `forget_dataset` has already removed the dataset's `live` entry, so the
    /// re-read finds nothing and no event carries the reference — this test's `recv_timeout` timed
    /// out with its one-event expectation (the `expect` in the test body below) never satisfied.
    ///
    /// RECORDED MUTATION (registered, phase 2 delta 6, second): `enqueue` is skipped when
    /// `ended_reason(dataset)` is `None`. Observed failure (performed on this branch, then
    /// reverted): `forget_dataset` clears `invalidated` along with `live`
    /// (`GenerationRegistry::forget_dataset`), so by the time this test's `enqueue` call runs,
    /// `ended_reason` already answers `None` for the (now-closed) dataset, and the mutated `enqueue`
    /// sends nothing — this test's `recv_timeout` timed out the same way.
    // Mutation: see the two RECORDED MUTATIONs above (enqueue re-reads GenerationRegistry; enqueue
    // skipped when ended_reason is None).
    #[test]
    fn an_end_recorded_before_forget_dataset_and_enqueued_after_it_carries_its_reference() {
        let path = fixture("close-drop-race-path");
        let (tx, rx) = super::session_end_channel();
        let host = SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            no_watch_arm(),
            tx,
        );
        let open = host
            .open_dataset(OpenDatasetRequest {
                skp: SKP_VERSION.to_string(),
                path: path.display().to_string(),
                cancel_key: "e8".to_string(),
                crs_assertion: None,
                identity: None,
            })
            .expect("open");
        let name = open.dataset.as_str().to_string();

        // The data-plane thread's own step 1 (§2b), performed here on the test's own thread, before
        // `close_dataset` ever runs: take the report under `GenerationRegistry`'s guard, which the
        // guard's own release (inside `invalidate`) already completes before `record` returns.
        let report = host
            .invalidator
            .record(&name, SessionEndReason::ObservedChange)
            .expect("a live generation to end");

        // The close's own thread runs to completion — including `forget_dataset` — while the
        // report above is only held locally, its `enqueue` not yet called.
        host.close_dataset(CloseDatasetRequest {
            skp: SKP_VERSION.to_string(),
            dataset: open.dataset,
        })
        .expect("close");

        // The data-plane thread's own step 2 (§2b), run only now — strictly after `forget_dataset`.
        host.invalidator.enqueue(&report);

        let event = rx
            .recv_timeout(Duration::from_secs(5))
            .expect("one event, carrying the reference recorded before forget_dataset ran");
        assert_eq!(event.session, open.session);
        assert!(
            rx.recv_timeout(Duration::from_millis(200)).is_err(),
            "exactly one event"
        );
    }

    /// K15 `a_coverage_loss_racing_admission_refuses_with_its_own_code_and_leaves_no_mark`
    /// (`SOURCE-WATCHER-PREREGISTRATION.md` §10 Amendment 5 item 1). In-crate, beside E5, E7 and
    /// E8 — `GenerationState`'s `invalidated` map is private, and an accessor for it would be the
    /// test-only `pub` item §5 forbids. [`RacingCoverageLossWatch`] reports `false` at admission
    /// and delivers `CoverageLost` to the sink from its own `Drop`, the product watch's order.
    ///
    /// RECORDED MUTATION: in the unified refusal path (`SkpHost::open_dataset`), refuse with a
    /// hardcoded `EngineError::SourceChanged` — the code at `ee6fa38` — instead of mapping the
    /// signal recorded after the drop by its own kind. Applied, run and reverted on this branch:
    /// `assertion `left == right` failed: refused: the source file changed while it was open
    /// ({[P6 placeholder] a notification arrived for this source before admission}). ...`, `left:
    /// "engine.source_changed"`, `right: "engine.source_coverage_lost"` — 1 failed.
    ///
    /// SECOND RECORDED MUTATION: set the latch to `LatchState::Admitted` before the watch is
    /// dropped — the order at `ee6fa38`. Applied, run and reverted on this branch: the sink's
    /// `Admitted` arm ran from the watch's own `Drop` and reached this call's own re-lock below,
    /// which panicked — `internal error: entered unreachable code: this call is the only place
    /// the latch is ever admitted` — 1 failed, never reaching this test's `invalidated`-mark
    /// assertion.
    #[test]
    fn a_coverage_loss_racing_admission_refuses_with_its_own_code_and_leaves_no_mark() {
        let path = fixture("k15-coverage-loss-race");
        let (tx, rx) = super::session_end_channel();
        let host = SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            racing_coverage_loss_arm(),
            tx,
        );

        let refused = host
            .open_dataset(OpenDatasetRequest {
                skp: SKP_VERSION.to_string(),
                path: path.display().to_string(),
                cancel_key: "k15".to_string(),
                crs_assertion: None,
                identity: None,
            })
            .expect_err("a coverage loss racing admission refuses the open");
        assert_eq!(
            refused.code, "engine.source_coverage_lost",
            "{}",
            refused.message
        );

        assert!(
            host.catalog().names().is_empty(),
            "a refused-before-admission open must leave no catalog entry behind"
        );

        // In-crate access to `GenerationRegistry`'s private state (no test-only `pub` item): a
        // fresh registry, touched by nothing but this one refused open, so an empty map proves
        // both "no live generation" and "no invalidated mark" without needing to know the
        // internally minted dataset handle this call never returned.
        {
            let generations = host.generations();
            let st = generations.inner.lock().unwrap_or_else(|e| e.into_inner());
            assert!(
                st.live.is_empty(),
                "a refused-before-admission open must mint no generation"
            );
            assert!(
                st.invalidated.is_empty(),
                "a refused-before-admission open must leave no invalidated mark"
            );
        }

        assert!(
            rx.recv_timeout(Duration::from_millis(200)).is_err(),
            "an open refused before admission must never emit"
        );
    }

    // ---------------------------------------------------------------------------------------------
    // `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §4 — the close races, in-crate beside E5,
    // E7, E8 and K15 (§4 (iv)). Every interleaving runs on the test's own thread: no sleep, no
    // spawned thread and no timeout (§4's determinism rule; §8 item 1).

    /// The racing call a [`RunOnDrop`] runs from its own `Drop`.
    type RacingCall = Box<dyn FnOnce() + Send>;

    /// §4 (ii): a test-owned `BatchSource`, minted through the real `StreamRegistry::mint`, whose
    /// `Drop` runs one racing call synchronously. A retired `Pending` ticket is dropped only after
    /// the registry's guard is released (entry 132), so the call runs with no lock held — the point
    /// E7 uses, taken as a deterministic instant, not as a claim that product code runs a query
    /// there.
    struct RunOnDrop(Option<RacingCall>);
    impl BatchSource for RunOnDrop {
        fn next_into(
            &mut self,
            _out: &mut Vec<u8>,
        ) -> Option<Result<spatial_data_plane::transport::BatchMeta, String>> {
            None
        }
    }
    impl Drop for RunOnDrop {
        fn drop(&mut self) {
            if let Some(call) = self.0.take() {
                call();
            }
        }
    }

    /// The drop-point ticket's no-op `SourceCancel` (§4 (ii)).
    struct NoopCancel;
    impl SourceCancel for NoopCancel {
        fn cancel(&self) {}
    }

    /// A real `open_dataset` through `host`, so the test holds the reference `open_dataset` returned.
    fn open_through(
        host: &SkpHost,
        path: &std::path::Path,
        cancel_key: &str,
    ) -> OpenDatasetResponse {
        host.open_dataset(OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: path.display().to_string(),
            cancel_key: cancel_key.to_string(),
            crs_assertion: None,
            identity: None,
        })
        .expect("open")
    }

    fn unrestricted_query(dataset: DatasetHandle) -> ViewportQueryRequest {
        ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset,
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
            columns: None,
        }
    }

    fn close(host: &SkpHost, dataset: DatasetHandle) {
        host.close_dataset(CloseDatasetRequest {
            skp: SKP_VERSION.to_string(),
            dataset,
        })
        .expect("close");
    }

    /// CR2 (S2). A whole `viewport_query(A)` runs inside `close_dataset(A)`, after
    /// `cancel_all_for_dataset` releases its guard and before `forget_dataset`: the drop point of a
    /// retired `Pending` ticket (§4 (ii)).
    ///
    /// TEST-FIRST (P1): at `051c56f`, before the change, this test FAILED at its `expect_err`
    /// (`a viewport_query inside close_dataset is refused: ViewportQueryResponse { .. }`).
    ///
    /// REGISTERED MUTATION: delete `live_generation`'s `closing` check, so the query mints, fails
    /// attribution and cancels itself, and the ticket map has two entries. Applied at `12ccbeb`,
    /// run and reverted: `a_viewport_query_inside_close_is_refused_before_it_builds_or_mints`
    /// FAILED on `only the drop-point ticket: the racing query minted none` (`left: 2`).
    ///
    /// RECORDED EXTRA: move `begin_close` after `cancel_all_for_dataset`. The query returns `Ok`,
    /// and this test fails at `expect_err`. Applied at `12ccbeb`, run and reverted: this mutation
    /// FAILED this test at its `expect_err` (`ViewportQueryResponse { .. }` returned).
    #[test]
    fn a_viewport_query_inside_close_is_refused_before_it_builds_or_mints() {
        let path = fixture("cr2-query-inside-close");
        let (tx, rx) = super::session_end_channel();
        let host = Arc::new(SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            no_watch_arm(),
            tx,
        ));
        let open = open_through(&host, &path, "cr2");
        let name = open.dataset.as_str().to_string();

        let answer: Arc<Mutex<Option<Result<ViewportQueryResponse, SkpError>>>> =
            Arc::new(Mutex::new(None));
        let racing = RunOnDrop(Some(Box::new({
            let host = host.clone();
            let answer = answer.clone();
            let dataset = open.dataset.clone();
            move || {
                let result = host.viewport_query(unrestricted_query(dataset));
                *answer.lock().unwrap_or_else(|e| e.into_inner()) = Some(result);
            }
        })));
        host.tickets()
            .mint(&name, Box::new(racing), Arc::new(NoopCancel))
            .expect("mint the drop-point ticket");

        close(&host, open.dataset);

        let answer = answer
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .take()
            .expect("the drop point ran the racing query inside close_dataset");
        let refused = answer.expect_err("a viewport_query inside close_dataset is refused");
        assert_eq!(refused.code, "skp.unknown_dataset", "{}", refused.message);

        {
            let map = host
                .tickets
                .tickets
                .lock()
                .unwrap_or_else(|e| e.into_inner());
            assert_eq!(
                map.len(),
                1,
                "only the drop-point ticket: the racing query minted none"
            );
        }
        {
            let generations = host.generations();
            let st = generations.inner.lock().unwrap_or_else(|e| e.into_inner());
            assert!(
                !st.live.contains_key(&name),
                "no live generation for the closed name"
            );
            assert!(
                !st.invalidated.contains_key(&name),
                "no invalidated mark for the closed name"
            );
            assert!(
                st.tickets.values().all(|(d, _, _)| d != &name),
                "no attribution for it"
            );
            assert!(
                st.dead_tickets.values().all(|(d, _, _)| d != &name),
                "no dead ticket for it"
            );
        }
        assert!(
            matches!(rx.try_recv(), Err(mpsc::TryRecvError::Empty)),
            "a query refused inside close emits nothing"
        );
    }

    /// CR4 (S4). `close_dataset(A)` completes, then an end reaches `invalidate` for A — a post-check
    /// finding delivered after the close, through the data plane's own `end_generation`.
    ///
    /// TEST-FIRST (P1): at `051c56f`, before the change, this test FAILED on
    /// `a post-close end writes no invalidated mark`.
    ///
    /// REGISTERED MUTATION: restore marking before the live lookup in `invalidate`. Applied at
    /// `12ccbeb`, run and reverted: `an_end_reaching_invalidate_after_close_leaves_no_mark_and_emits_nothing`
    /// FAILED on `a post-close end writes no invalidated mark`.
    #[test]
    fn an_end_reaching_invalidate_after_close_leaves_no_mark_and_emits_nothing() {
        let path = fixture("cr4-end-after-close");
        let (tx, rx) = super::session_end_channel();
        let host = SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            no_watch_arm(),
            tx,
        );
        let open = open_through(&host, &path, "cr4");
        let name = open.dataset.as_str().to_string();

        close(&host, open.dataset);

        let cancelled = host
            .invalidator
            .end_generation(&name, SessionEndReason::ObservedChange);
        assert_eq!(cancelled, 0, "an end after close cancels nothing");
        {
            let generations = host.generations();
            let st = generations.inner.lock().unwrap_or_else(|e| e.into_inner());
            assert!(
                st.invalidated.is_empty(),
                "a post-close end writes no invalidated mark"
            );
            assert!(st.live.is_empty(), "a post-close end mints no generation");
            assert!(
                st.dead_tickets.is_empty(),
                "a post-close end records no dead ticket"
            );
        }
        assert_eq!(host.generations().ended_reason(&name), None);
        assert!(
            matches!(rx.try_recv(), Err(mpsc::TryRecvError::Empty)),
            "a post-close end emits nothing"
        );
    }

    /// CR1 (S1) — **round 23, item 2's test**: the unheld-reference path does not exist. A query on
    /// A resolves; `close_dataset(A)` completes; the query continues through its own mint and
    /// attribute steps (§4 (i): `viewport_query`'s product steps with a real close between them).
    /// B is a second open that stays open.
    ///
    /// REGISTERED MUTATION: restore a minting arm in `live_generation` (a `SessionRef::mint()`
    /// generation on the no-mark, not-closing arm, returning `Ok`), so the call returns `Ok` and
    /// this test fails at its `expect_err`. Applied at `12ccbeb`, run and reverted:
    /// `the_close_race_mints_no_generation_so_no_unheld_reference_exists` FAILED at its
    /// `expect_err` (`the query continuing after the close is refused: ViewportQueryResponse { .. }`).
    #[test]
    fn the_close_race_mints_no_generation_so_no_unheld_reference_exists() {
        let path_a = fixture("cr1-closed");
        let path_b = fixture("cr1-stays-open");
        let (tx, rx) = super::session_end_channel();
        let host = SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            no_watch_arm(),
            tx,
        );
        let open_a = open_through(&host, &path_a, "cr1-a");
        let open_b = open_through(&host, &path_b, "cr1-b");

        let req = unrestricted_query(open_a.dataset.clone());
        let (name, ds) = host
            .viewport_query_resolve(&req)
            .expect("A resolves while it is open");

        close(&host, open_a.dataset);

        let refused = host
            .viewport_query_mint(&name, &ds, &req)
            .and_then(|handle| host.viewport_query_attribute(handle, &name))
            .expect_err("the query continuing after the close is refused");
        assert_eq!(refused.code, "skp.unknown_dataset", "{}", refused.message);

        {
            let generations = host.generations();
            let st = generations.inner.lock().unwrap_or_else(|e| e.into_inner());
            assert_eq!(st.live.len(), 1, "the only live generation is B's");
            assert_eq!(
                st.live
                    .get(open_b.dataset.as_str())
                    .map(|(_, session)| session),
                Some(&open_b.session),
                "B's generation carries the reference open_dataset returned for B"
            );
        }
        {
            let map = host
                .tickets
                .tickets
                .lock()
                .unwrap_or_else(|e| e.into_inner());
            assert!(map.is_empty(), "the refused query minted no ticket");
        }
        assert!(
            matches!(rx.try_recv(), Err(mpsc::TryRecvError::Empty)),
            "the close race emits nothing"
        );
    }

    /// CR3 (S3). A ticket minted before `close_dataset(A)` and attributed after it: the close
    /// cancelled it, and the query's attribution refuses with the close's answer, not a
    /// session-ended code no end was recorded for (watcher gate-1 advisory 7).
    ///
    /// REGISTERED MUTATION: restore `unwrap_or(SessionEndReason::ObservedChange)` on the
    /// attribute step's `ended_reason`, so the code is `engine.source_changed`. Applied at
    /// `12ccbeb`, run and reverted:
    /// `a_ticket_minted_before_close_and_attributed_after_it_refuses_as_unknown_dataset` FAILED on
    /// its code assertion (`left: "engine.source_changed"`).
    #[test]
    fn a_ticket_minted_before_close_and_attributed_after_it_refuses_as_unknown_dataset() {
        let path = fixture("cr3-mint-before-close");
        let (tx, rx) = super::session_end_channel();
        let host = SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            no_watch_arm(),
            tx,
        );
        let open = open_through(&host, &path, "cr3");

        let req = unrestricted_query(open.dataset.clone());
        let (name, ds) = host
            .viewport_query_resolve(&req)
            .expect("A resolves while it is open");
        let handle = host
            .viewport_query_mint(&name, &ds, &req)
            .expect("A mints while it is open");
        let ticket = handle.as_str().to_string();

        close(&host, open.dataset);

        let refused = host
            .viewport_query_attribute(handle, &name)
            .expect_err("an attribution after the close refuses");
        assert_eq!(refused.code, "skp.unknown_dataset", "{}", refused.message);
        {
            let map = host
                .tickets
                .tickets
                .lock()
                .unwrap_or_else(|e| e.into_inner());
            assert!(
                matches!(
                    map.get(&ticket),
                    Some(TicketState::CancelledBeforeRedeem { .. })
                ),
                "the close cancelled the ticket before any redemption"
            );
        }
        assert!(
            matches!(rx.try_recv(), Err(mpsc::TryRecvError::Empty)),
            "no end was recorded, so nothing emits"
        );
    }

    /// R2 (S5). The registry alone: while a dataset is closing, a new attribution refuses and the
    /// live check answers `NotOpen`, but an end recorded during the close still finds the live
    /// generation and carries its reference (ADR-035 Decision 3's close-time routes); after
    /// `forget_dataset` no closing mark remains.
    ///
    /// REGISTERED MUTATION: delete `attribute_ticket`'s `closing` check, so attribution returns
    /// `true`. Applied at `12ccbeb`, run and reverted:
    /// `a_closing_dataset_refuses_new_attributions_but_still_records_an_end` FAILED on
    /// `a closing dataset attributes nothing`.
    #[test]
    fn a_closing_dataset_refuses_new_attributions_but_still_records_an_end() {
        let g = GenerationRegistry::new();
        let session = SessionRef::mint();
        g.mint_for_open("ds_a", session.clone());

        g.begin_close("ds_a");

        assert!(
            !g.attribute_ticket("sh_a1", "ds_a"),
            "a closing dataset attributes nothing"
        );
        assert_eq!(g.live_generation("ds_a"), Err(NotLive::NotOpen));
        let report = g
            .invalidate("ds_a", SessionEndReason::ObservedChange)
            .expect("an end during the close still finds the live generation");
        assert_eq!(report.session, session);
        assert_eq!(
            g.live_generation("ds_a"),
            Err(NotLive::Ended(SessionEndReason::ObservedChange))
        );

        g.forget_dataset("ds_a");
        let st = g.inner.lock().unwrap_or_else(|e| e.into_inner());
        assert!(
            st.closing.is_empty(),
            "forget_dataset clears the closing mark"
        );
    }

    // ---------------------------------------------------------------------------------------------
    // `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md` §4 — a generation end between
    // `create_from_ticket`'s liveness step and its redeem step, in-crate beside the close races (§3
    // there). The window is driven by the step split on the test's own thread: no sleep, no spawned
    // thread and no timeout.

    /// A real `open_dataset` (no watch armed) and a real `viewport_query` ticket, past the liveness
    /// step: `EngineSourceFactory::liveness_refusal` returns `None` for it, as it does for every
    /// live ticket. Returns the host, the file, the open and the ticket's handle string.
    fn a_ticket_past_the_liveness_step(
        tag: &str,
    ) -> (SkpHost, std::path::PathBuf, OpenDatasetResponse, String) {
        let path = fixture(tag);
        let host = SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            no_watch_arm(),
            discard_session_end_events(),
        );
        let open = open_through(&host, &path, tag);
        let ticket = host
            .viewport_query(unrestricted_query(open.dataset.clone()))
            .expect("a real ticket")
            .stream
            .as_str()
            .to_string();
        assert_eq!(
            crate::EngineSourceFactory::liveness_refusal(&host.generations(), &ticket),
            None,
            "the liveness step passes a live ticket, so the end below lands between the two steps"
        );
        (host, path, open, ticket)
    }

    /// Guards against a vacuous pass: the end under test really cancelled the ticket before the
    /// redeem step runs, so `redeem` has a refusal to word.
    fn assert_cancelled_before_redeem(host: &SkpHost, ticket: &str) {
        let map = host
            .tickets
            .tickets
            .lock()
            .unwrap_or_else(|e| e.into_inner());
        assert!(
            matches!(
                map.get(ticket),
                Some(TicketState::CancelledBeforeRedeem { .. })
            ),
            "the ticket is CancelledBeforeRedeem before the redeem step runs"
        );
    }

    /// The redeem step, run whole on this thread; its refusal.
    fn the_redeem_step_refusal(host: &SkpHost, ticket: &str) -> String {
        match crate::EngineSourceFactory::redeem_or_liveness_refusal(
            &host.tickets(),
            &host.generations(),
            ticket,
        ) {
            Ok(_) => panic!("the redeem step redeemed a ticket that was cancelled before it"),
            Err(refusal) => refusal,
        }
    }

    /// `redeem`'s own answer for a ticket that stays `CancelledBeforeRedeem`: the wording a refusal
    /// with no dead-ticket record keeps (ii).
    fn redeems_own_wording(host: &SkpHost, ticket: &str) -> String {
        match host.tickets().redeem(ticket) {
            Ok(_) => panic!("a cancelled ticket redeemed"),
            Err(own) => own,
        }
    }

    /// R1 (S1). The product end: a second `viewport_query` refuses at the pre-check on a moved
    /// mtime and ends the generation, `ObservedChange`, between the two steps.
    ///
    /// TEST-FIRST (P1): at the split commit, before the re-read, this test FAILS on its prefix
    /// assertion (the detail is `redeem`'s cancelled wording).
    ///
    /// REGISTERED MUTATION: delete the re-read in `redeem_or_liveness_refusal` (return `r`).
    #[test]
    fn an_end_between_liveness_and_redeem_refuses_by_its_code() {
        let (host, path, open, ticket) = a_ticket_past_the_liveness_step("r1-source-changed");

        touch_modification_time(&path);
        let refused = host
            .viewport_query(unrestricted_query(open.dataset))
            .expect_err("the pre-check refuses the moved source and ends the generation");
        assert_eq!(refused.code, "engine.source_changed", "{}", refused.message);
        assert_cancelled_before_redeem(&host, &ticket);

        let detail = the_redeem_step_refusal(&host, &ticket);
        assert!(detail.starts_with("engine.source_changed: "), "{detail}");
    }

    /// R2 (S2). A close ends nothing by name: `close_dataset` cancels the ticket and forgets the
    /// dataset's dead-ticket record, so the refusal is `redeem`'s own.
    ///
    /// REGISTERED MUTATION: make the fallback in `redeem_or_liveness_refusal` return the
    /// source-changed refusal for every `r`.
    #[test]
    fn a_close_between_liveness_and_redeem_keeps_redeems_wording() {
        let (host, _path, open, ticket) = a_ticket_past_the_liveness_step("r2-close");

        close(&host, open.dataset);
        assert_cancelled_before_redeem(&host, &ticket);

        let detail = the_redeem_step_refusal(&host, &ticket);
        assert!(!detail.starts_with("engine."), "{detail}");
        assert_eq!(detail, redeems_own_wording(&host, &ticket));
    }

    /// R3 (S3). The sink's call: `end_generation(name, CoverageLost)` between the two steps takes
    /// its own code, never `engine.source_changed` (block-on-sight 7).
    ///
    /// TEST-FIRST (P1): at the split commit, before the re-read, this test FAILS on its prefix
    /// assertion.
    ///
    /// REGISTERED MUTATION: in `liveness_refusal`, map `EndedByCoverageLoss` to the source-changed
    /// refusal.
    #[test]
    fn a_coverage_loss_between_liveness_and_redeem_keeps_its_own_code() {
        let (host, _path, open, ticket) = a_ticket_past_the_liveness_step("r3-coverage-lost");

        host.invalidator
            .end_generation(open.dataset.as_str(), SessionEndReason::CoverageLost);
        assert_cancelled_before_redeem(&host, &ticket);

        let detail = the_redeem_step_refusal(&host, &ticket);
        assert!(
            detail.starts_with("engine.source_coverage_lost: "),
            "{detail}"
        );
        assert!(!detail.starts_with("engine.source_changed"), "{detail}");
    }

    /// R4 (S4). A client cancel ends no generation: the generation stays live, the ticket is
    /// `CancelledBeforeRedeem`, and the refusal is `redeem`'s own.
    ///
    /// REGISTERED MUTATION: R2's.
    #[test]
    fn a_client_cancel_between_liveness_and_redeem_keeps_redeems_wording() {
        let (host, _path, open, ticket) = a_ticket_past_the_liveness_step("r4-client-cancel");

        host.cancel(CancelRequest {
            skp: SKP_VERSION.to_string(),
            handle: ticket.clone(),
        })
        .expect("cancel");
        assert_cancelled_before_redeem(&host, &ticket);
        assert!(
            host.generations()
                .live_generation(open.dataset.as_str())
                .is_ok(),
            "a client cancel leaves the generation live"
        );

        let detail = the_redeem_step_refusal(&host, &ticket);
        assert!(!detail.starts_with("engine."), "{detail}");
        assert_eq!(detail, redeems_own_wording(&host, &ticket));
    }

    // `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md` §4: a close releases its
    // dataset's watch on every outcome. No sleep, spawned thread or timeout.

    /// An [`ArmedWatch`] whose `Drop` sets a flag the test holds; `resolves_unchanged` is `true`.
    struct FlagWatch(Arc<AtomicBool>);
    impl ArmedWatch for FlagWatch {
        fn resolves_unchanged(&self) -> bool {
            true
        }
    }
    impl Drop for FlagWatch {
        fn drop(&mut self) {
            self.0.store(true, Ordering::SeqCst);
        }
    }

    /// Arms `Watching` over a [`FlagWatch`] sharing the test's flag.
    struct FlagArm(Arc<AtomicBool>);
    impl SourceWatchArm for FlagArm {
        fn arm(&self, _path: &Path, _sink: WatchSink) -> ArmOutcome {
            ArmOutcome::Watching(Box::new(FlagWatch(self.0.clone())))
        }
    }

    fn watching_host(flag: &Arc<AtomicBool>) -> SkpHost {
        let arm = Arc::new(FlagArm(flag.clone()));
        SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            arm,
            discard_session_end_events(),
        )
    }

    fn close_req(dataset: DatasetHandle) -> CloseDatasetRequest {
        CloseDatasetRequest {
            skp: SKP_VERSION.to_string(),
            dataset,
        }
    }

    fn holds_a_record(host: &SkpHost, name: &str) -> bool {
        host.watches
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .contains_key(name)
    }

    /// T1 (S1). A close of a dataset whose catalog entry is already gone refuses as before and
    /// still drops the `OpenRecord` (and so the watch) it held.
    ///
    /// TEST-FIRST (P0): at `4f045da`, before the change, this test FAILED on `the close removed the
    /// record`.
    ///
    /// REGISTERED MUTATION: restore the base order (the `watches` removal below the
    /// `unknown_dataset` check). Applied at `f4fb9ed`, run and reverted: this test FAILED on `the
    /// close removed the record`; T2 passed.
    #[test]
    fn a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch() {
        let path = fixture("close-unknown-keeps-record");
        let dropped = Arc::new(AtomicBool::new(false));
        let host = watching_host(&dropped);
        let open = open_through(&host, &path, "close-unknown");
        let name = open.dataset.as_str().to_string();
        assert!(holds_a_record(&host, &name), "precondition: a record");
        assert!(!dropped.load(Ordering::SeqCst), "precondition: armed");
        assert!(
            host.catalog().remove(&name).is_some(),
            "the entry was present"
        );

        let refused = host
            .close_dataset(close_req(open.dataset.clone()))
            .expect_err("refused");
        assert_eq!(refused.code, "skp.unknown_dataset", "{}", refused.message);
        assert_eq!(refused.fields.get("handle"), Some(&name));
        assert!(
            !holds_a_record(&host, &name),
            "the close removed the record"
        );
        assert!(
            dropped.load(Ordering::SeqCst),
            "the close dropped the watch"
        );

        let again = host
            .close_dataset(close_req(open.dataset))
            .expect_err("refused again");
        assert_eq!(again.code, "skp.unknown_dataset", "{}", again.message);
    }

    /// T2 (S2). An ordinary close returns only after its watch is dropped and its record removed.
    ///
    /// REGISTERED MUTATION: delete the `watches` removal in `close_dataset`. Applied at `f4fb9ed`,
    /// run and reverted: this test FAILED on `the close removed the record`.
    #[test]
    fn a_close_drops_its_watch_before_it_returns() {
        let path = fixture("close-drops-its-watch");
        let dropped = Arc::new(AtomicBool::new(false));
        let host = watching_host(&dropped);
        let open = open_through(&host, &path, "close-drops");
        let name = open.dataset.as_str().to_string();

        let closed = host.close_dataset(close_req(open.dataset)).expect("close");
        assert_eq!(closed.cancelled_streams, 0);
        assert!(
            !holds_a_record(&host, &name),
            "the close removed the record"
        );
        assert!(
            dropped.load(Ordering::SeqCst),
            "the close dropped the watch"
        );
    }
}
