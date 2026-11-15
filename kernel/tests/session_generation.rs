// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The dataset-session generation registry** — Brief A settled boundary 4's kernel half.
//!
//! `GenerationRegistry` shipped with zero tests at P3 gate attempt 1 (blocking finding 3). Every
//! rule it holds is asserted here: the three-valued state, reopening, the never-resurrect rule,
//! ticket attribution and its false path, invalidation's ticket collection, forgetting, the bound
//! on its map, and the lock under concurrent use.
//!
//! **Not a gate test.** G-A2's end-to-end detected-change invalidation and G-A3's late-batch
//! rejection are P5's. These are unit assertions on one type's rules — with the exception of P3b's
//! own `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code` below, which is
//! an end-to-end test of the redemption seam from the real product shape and says so at its own
//! doc comment. It does not score G-A2 either: it asserts the kernel's refusal, not an owner's
//! consequence.
//!
//! No duration, no rate and no performance word appears in this file (ADR-018; A6). The
//! concurrency test asserts a *count*, never a time.
//!
//! **`SOURCE-WATCHER-PREREGISTRATION.md` §2b's Amendment 1 update.** `mint_for_open` now takes the
//! `SessionRef` `open_dataset` mints (here, a bare `SessionRef::mint()` — these tests exercise the
//! registry directly, never `open_dataset`); `invalidate` takes a reason and answers
//! `Option<EndReport>` (`.tickets` where it used to answer a bare `Vec<String>` directly).
//!
//! **`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §2a.** `live_or_mint` is replaced by
//! `live_generation`, which never mints and answers `Result<u64, NotLive>`: a dataset that
//! `mint_for_open` never minted for answers `NotLive::NotOpen`.

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::Arc;

use spatial_data_plane::transport::{OpenRequest, SourceFactory};
use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};
use spatial_kernel::skp::{
    session_end_channel, GenerationRegistry, NotLive, SessionEndReason, SkpHost, StreamRegistry,
    TicketLiveness,
};
use spatial_kernel::{Catalog, EngineSourceFactory, OPERATION};
use spatial_skp::v0::{DatasetHandle, SessionRef, StreamHandle, ViewportQueryRequest, SKP_VERSION};

/// Mutation recorded in-source (`scripts/plan/verify-mutation.mjs`): CR1's, restoring a minting
/// arm in `live_generation` (a `SessionRef::mint()` generation on the no-mark, not-closing arm,
/// returning `Ok`), makes a never-opened name answer `Ok` and this test fail. Applied at
/// `12ccbeb`, run and reverted: `the_state_is_three_valued_never_minted_is_not_invalidated`
/// FAILED on its first `NotOpen` assertion (`left: Ok(1)`).
#[test]
fn the_state_is_three_valued_never_minted_is_not_invalidated() {
    let g = GenerationRegistry::new();

    // 1. Never minted: `live_generation` answers `NotOpen`, repeatedly, and mints nothing. A
    //    dataset this registry has never heard of has NOT been observed to change, and telling its
    //    caller its file changed would be a false statement about the file (`docs/01` principle 8).
    for _ in 0..3 {
        assert_eq!(g.live_generation("ds_never_seen"), Err(NotLive::NotOpen));
    }
    assert!(
        !g.attribute_ticket("sh_1", "ds_never_seen"),
        "nothing was minted to attribute to"
    );

    // 2. Live: only `mint_for_open` mints, and the same call then answers that generation.
    let first = g.mint_for_open("ds_never_seen", SessionRef::mint());
    assert_eq!(
        g.live_generation("ds_never_seen"),
        Ok(first),
        "an existing session is not re-minted"
    );

    // 3. Invalidated: and only now does it refuse by the reason.
    g.invalidate("ds_never_seen", SessionEndReason::ObservedChange);
    assert_eq!(
        g.live_generation("ds_never_seen"),
        Err(NotLive::Ended(SessionEndReason::ObservedChange)),
        "only an invalidated dataset refuses by the reason — that is the whole point of the third state"
    );
}

/// Mutation recorded in-source: removing `st.invalidated.remove(dataset)` from `mint_for_open`
/// leaves a reopened dataset permanently refused and this test fails. Applied at `12ccbeb`, run
/// and reverted: `a_fresh_open_clears_an_earlier_invalidation_because_that_is_what_reopening_is`
/// FAILED on `boundary 4's refusals say 'until reopen'; this is the reopen`.
#[test]
fn a_fresh_open_clears_an_earlier_invalidation_because_that_is_what_reopening_is() {
    let g = GenerationRegistry::new();
    let before = g.mint_for_open("ds_a", SessionRef::mint());
    g.invalidate("ds_a", SessionEndReason::ObservedChange);
    assert!(g.live_generation("ds_a").is_err());

    let after = g.mint_for_open("ds_a", SessionRef::mint());
    assert_ne!(
        after, before,
        "a reopen mints a new generation, never reuses the ended one"
    );
    assert!(
        g.live_generation("ds_a").is_ok(),
        "boundary 4's refusals say 'until reopen'; this is the reopen"
    );
}

/// Mutation recorded in-source: making `live_generation` mint over an invalidated entry (its early
/// `return Err(NotLive::Ended(reason))` replaced by a fresh generation inserted and `Ok`)
/// resurrects a dead session and this test fails. Applied at `12ccbeb`, run and reverted:
/// `live_generation_never_resurrects_an_invalidated_generation` FAILED on
/// `repeated asking must not eventually succeed`.
#[test]
fn live_generation_never_resurrects_an_invalidated_generation() {
    let g = GenerationRegistry::new();
    g.mint_for_open("ds_a", SessionRef::mint());
    g.invalidate("ds_a", SessionEndReason::ObservedChange);
    for _ in 0..5 {
        assert!(
            g.live_generation("ds_a").is_err(),
            "repeated asking must not eventually succeed"
        );
    }
}

/// RECORDED MUTATION: in `GenerationRegistry::attribute_ticket` (`kernel/src/skp.rs`), replace
/// its `let Some((g, _)) = st.live.get(dataset) else { return false; };` and `let g = *g;` with
/// `let g = st.live.get(dataset).map_or(0, |(g, _)| *g);`, so a dataset with no live generation
/// has its ticket inserted under generation 0, which `mint_for_open` never issues, and `true`
/// returned; the `closing` refusal stays. Applied at `2a6adbb10d2ab8bc65e3a3ab8fb9ae057683afcf`,
/// run alone and reverted: `a_ticket_is_attributable_only_under_a_live_generation` FAILED on
/// `an ended session attributes nothing`, the assertion of its second half.
#[test]
fn a_ticket_is_attributable_only_under_a_live_generation() {
    let g = GenerationRegistry::new();
    g.mint_for_open("ds_a", SessionRef::mint());
    assert!(
        g.attribute_ticket("sh_1", "ds_a"),
        "a live dataset attributes its ticket"
    );
    assert_eq!(g.attributed_ticket_count(), 1);

    // The false path: a dataset with no live generation cannot attribute one, and the caller must
    // refuse rather than record a ticket under a generation that does not exist.
    g.invalidate("ds_a", SessionEndReason::ObservedChange);
    assert!(
        !g.attribute_ticket("sh_2", "ds_a"),
        "an ended session attributes nothing"
    );
    // And the ticket from the ended generation is gone with it — nothing is left answering about a
    // generation that no longer exists.
    assert_eq!(g.attributed_ticket_count(), 0);
}

/// RECORDED MUTATION: in `GenerationRegistry::invalidate` (`kernel/src/skp.rs`), drop `*tg == g`
/// from the filter that collects the ended tickets, leaving `d == dataset` alone. Applied at
/// `2a6adbb10d2ab8bc65e3a3ab8fb9ae057683afcf`, run alone and reverted, it fails nothing here:
/// `invalidate_returns_exactly_the_tickets_of_the_generation_it_ended` PASSED. An attribution
/// naming an older generation of a name is left when `invalidate` runs only if `mint_for_open`
/// minted again for that name while it was still live, with no pruning call between, since
/// `prune_locked` sweeps an attribution whose generation is no longer live. This test mints
/// each name once, and `SkpHost::open_dataset` mints a fresh `DatasetHandle` for every open.
#[test]
fn invalidate_returns_exactly_the_tickets_of_the_generation_it_ended() {
    let g = GenerationRegistry::new();
    g.mint_for_open("ds_a", SessionRef::mint());
    g.mint_for_open("ds_b", SessionRef::mint());
    assert!(g.attribute_ticket("sh_a1", "ds_a"));
    assert!(g.attribute_ticket("sh_a2", "ds_a"));
    assert!(g.attribute_ticket("sh_b1", "ds_b"));

    let mut ended = g
        .invalidate("ds_a", SessionEndReason::ObservedChange)
        .expect("ds_a has a live generation to end")
        .tickets;
    ended.sort();
    assert_eq!(ended, vec!["sh_a1".to_string(), "sh_a2".to_string()]);

    // The other dataset's session is untouched: a generation is per dataset-session, and one
    // dataset's changed source says nothing about another's. Its ticket survives the prune that
    // swept `ds_a`'s, which is the observable form of "untouched".
    assert_eq!(g.attributed_ticket_count(), 1);
    assert!(g.live_generation("ds_b").is_ok());

    // Idempotent: invalidating again ends nothing further and returns nothing.
    assert!(
        g.invalidate("ds_a", SessionEndReason::ObservedChange)
            .is_none(),
        "a second invalidation has nothing left to end"
    );
}

/// Mutation recorded in-source: dropping `st.live.remove` in `forget_dataset` fails this test.
/// Applied at `12ccbeb`, run and reverted:
/// `forget_dataset_removes_the_generation_the_invalidation_and_every_attribution` FAILED on
/// `forgetting removes a live generation` (`left: Ok(3)`). Dropping the `tickets.retain` line
/// instead, applied at `12ccbeb`, run and reverted, fails nothing here: this test PASSED, because
/// `prune_locked` sweeps an attribution whose generation is no longer live on the next call, so
/// that line is not observable through this registry's public methods.
#[test]
fn forget_dataset_removes_the_generation_the_invalidation_and_every_attribution() {
    let g = GenerationRegistry::new();
    g.mint_for_open("ds_a", SessionRef::mint());
    g.attribute_ticket("sh_a1", "ds_a");
    g.invalidate("ds_a", SessionEndReason::ObservedChange);

    g.forget_dataset("ds_a");

    assert_eq!(g.attributed_ticket_count(), 0, "the attribution is gone");
    // The invalidation is gone too, so the name is not open rather than a refused one —
    // `close_dataset` then `open_dataset` under the same name is an ordinary reopen.
    assert_eq!(
        g.live_generation("ds_a"),
        Err(NotLive::NotOpen),
        "forgetting clears the invalidation as well as the generation"
    );
    let reopened = g.mint_for_open("ds_a", SessionRef::mint());
    assert_eq!(
        g.live_generation("ds_a"),
        Ok(reopened),
        "a reopen is `mint_for_open`"
    );

    // A generation still live when the close forgets it: `forget_dataset` itself removes it.
    g.mint_for_open("ds_b", SessionRef::mint());
    assert!(g.attribute_ticket("sh_b1", "ds_b"));
    g.forget_dataset("ds_b");
    assert_eq!(
        g.live_generation("ds_b"),
        Err(NotLive::NotOpen),
        "forgetting removes a live generation"
    );
}

/// **The map is bounded** (P3 gate attempt 1, blocking finding 6): attributions do not accumulate
/// for the life of the process.
///
/// Asserted through the observable rule rather than by reaching into the map: an attribution whose
/// generation is no longer live can only ever answer "not live", which is what a *missing* entry
/// already answers, so it is pruned on the next mutating call. The age-based half of the bound
/// (`TICKET_TTL + TERMINAL_ENTRY_MAX_AGE`) is not asserted here — it would need a clock this test
/// must not take (ADR-018) — and is stated in `prune_locked`'s own doc.
///
/// RECORDED MUTATION: remove the `Self::prune_locked(&mut st)` call from
/// `GenerationRegistry::attribute_ticket` (`kernel/src/skp.rs`). Applied at
/// `2a6adbb10d2ab8bc65e3a3ab8fb9ae057683afcf`, run alone and reverted, it fails nothing here:
/// `dead_generation_attributions_are_pruned_rather_than_accumulating` PASSED. Each round's
/// `invalidate` prunes after it removes the generation. Every public method that answers from the
/// attributions prunes before it reads them, except `invalidate`, whose filter keeps only the
/// generation it ends; so, without a clock this file must not take (ADR-018), the call is not
/// observable through this registry's public methods.
#[test]
fn dead_generation_attributions_are_pruned_rather_than_accumulating() {
    let g = GenerationRegistry::new();
    for round in 0..50 {
        g.mint_for_open("ds_a", SessionRef::mint());
        assert!(g.attribute_ticket(&format!("sh_{round}"), "ds_a"));
        g.invalidate("ds_a", SessionEndReason::ObservedChange);
    }
    // Every ticket above belongs to a generation that has since ended, and the last `invalidate`
    // swept them. Only a live one would survive, and there is none.
    assert_eq!(
        g.attributed_ticket_count(),
        0,
        "the map did not grow across 50 ended sessions"
    );
}

/// The `Mutex` under concurrent use — two threads minting, attributing and invalidating the same
/// registry.
///
/// **Asserts a count and a bound, never a timing.** What it establishes is that two threads
/// using the registry at once neither deadlock nor panic, that some attributions land under a
/// live generation, and that once the session is ended no attribution survives. It does not
/// establish that each attribution `attribute_ticket` answers `true` for names a generation still
/// live when inserted (the torn read below).
///
/// RECORDED MUTATION, the first of two: replace `GenerationRegistry`'s `Mutex<GenerationState>`
/// with `RefCell<GenerationState>`, each `lock().unwrap_or_else(..)` becoming `borrow_mut()`.
/// Applied at `2a6adbb10d2ab8bc65e3a3ab8fb9ae057683afcf` and reverted: `spatial-kernel`
/// does not build, failing with E0277 (`cannot be shared between threads safely`) at, among
/// any other sites, `impl SourceFactory for EngineSourceFactory` (`kernel/src/lib.rs`): that
/// trait is `Send + Sync` and the factory holds the registry in an `Arc`. The second, by
/// reading only and never observed: make `attribute_ticket` read `live` under one lock and
/// insert under a second, so that another thread's `invalidate` and `mint_for_open` can fall
/// between the two: the ticket is then attributed to the generation just ended, and `true` is
/// returned. That interleaving is timing-dependent, and this test's assertions hold under it in
/// any case: such an attribution still counts toward `total`, and the next pruning call sweeps
/// it, so the final count is 0 either way. The window can open in this test; the test does not
/// detect it.
#[test]
fn the_registry_is_consistent_when_two_threads_use_it_at_once() {
    let g: Arc<GenerationRegistry> = GenerationRegistry::new();
    g.mint_for_open("ds_a", SessionRef::mint());

    let mut handles = Vec::new();
    for thread in 0..2u32 {
        let g = Arc::clone(&g);
        handles.push(std::thread::spawn(move || {
            let mut attributed = 0u32;
            for i in 0..200u32 {
                let handle = format!("sh_{thread}_{i}");
                if g.attribute_ticket(&handle, "ds_a") {
                    attributed += 1;
                    // Read the map from inside the race too: the count is whatever it is at this
                    // instant, and what is asserted is that reading it neither deadlocks nor
                    // panics on a poisoned lock.
                    let _ = g.attributed_ticket_count();
                }
                if i % 50 == 49 {
                    g.invalidate("ds_a", SessionEndReason::ObservedChange);
                    g.mint_for_open("ds_a", SessionRef::mint());
                }
            }
            attributed
        }));
    }
    let total: u32 = handles
        .into_iter()
        .map(|h| h.join().expect("no thread panicked"))
        .sum();
    assert!(
        total > 0,
        "at least some attributions landed under a live generation"
    );

    // Bounded afterwards, by the same rule the single-threaded test asserts: end the session and
    // nothing from it survives.
    g.invalidate("ds_a", SessionEndReason::ObservedChange);
    assert_eq!(
        g.attributed_ticket_count(),
        0,
        "no attribution outlived the generation it named"
    );
}

// ---------------------------------------------------------------------------------------------
// P3b §2c — the kernel-authoritative dead-ticket refusal at redemption, three-valued.
//
// These three extend the file rather than opening a new one because the rule under test is
// `GenerationRegistry`'s: what it records when a generation ends, and what a redemption is
// therefore entitled to say. The first is an END-TO-END test from the real product shape (the
// human's class fix, question round 4, item 1): a real `SkpHost`, a real `viewport_query`, the
// real `EngineSourceFactory::ticket_only` constructor the shell's `run` setup installs, and the real
// `SourceFactory::create` the data plane's START arm calls (its `factory.create` call in
// `protocol/data-plane/src/server.rs`). Nothing is fabricated and `end_generation` is never
// called by a test.
// ---------------------------------------------------------------------------------------------

/// A fixture written per test, in the shape `typed_terminal_codes.rs`'s `fixture` uses.
fn dead_ticket_fixture(name: &str) -> PathBuf {
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

/// Move a file's modification time forward without touching a byte of it — the same single-component
/// mutation `typed_terminal_codes.rs`'s `touch_modification_time` performs, and the only one a test can make
/// while DuckDB holds the file open without making DuckDB fail on a truncated read first.
fn touch_modification_time(path: &Path) {
    let later = std::time::SystemTime::now() + std::time::Duration::from_secs(120);
    std::fs::File::options()
        .write(true)
        .open(path)
        .expect("reopen to set mtime")
        .set_modified(later)
        .expect("set mtime");
}

/// **T1 — the end-to-end test from the real shape.**
///
/// The window this exercises is the one §5 prediction 1 names, with every liveness read after the
/// end: a ticket minted, its generation ended while the ticket is still pending, and the redemption
/// arriving afterwards, so `create_from_ticket`'s first read refuses by name. Since
/// `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md` §2b (#147) the same refusal is also reached
/// when the end is recorded after that first read and before `redeem`, at the second read
/// `redeem_or_liveness_refusal` makes; that order is pinned in-crate by
/// `an_end_between_liveness_and_redeem_refuses_by_its_code`, in `kernel/src/skp.rs`'s
/// `ticket_drop_under_lock_regression` module. Every step runs through the product path — the
/// ticket comes
/// from `SkpHost::viewport_query`, the generation is ended by the `open_engine_stream` refusal arm
/// that ends it on `EngineError::SourceChanged` and not by this test, and
/// the redemption goes through `SourceFactory::create` on the constructor the shell installs.
///
/// RECORDED MUTATION: in `EngineSourceFactory::liveness_refusal` (`kernel/src/lib.rs`), which
/// `create_from_ticket` calls before `redeem` and `redeem_or_liveness_refusal` calls again when
/// `redeem` refuses, delete the `TicketLiveness::EndedBySourceChange` arm and add that variant to
/// the `Live | Unknown => None` arm, so neither read refuses by name. Applied at
/// `959f4706fbd8824dc27352d719dae71c9a1a7c4d`, run alone and reverted:
/// `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`
/// FAILED on `the refusal must carry its typed code as a prefix`, the detail being `redeem`'s
/// `was cancelled before it was redeemed`.
#[test]
fn a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code() {
    let path = dead_ticket_fixture("dead-ticket-refusal");
    let dataset = DatasetHandle::mint();
    let catalog = Arc::new(Catalog::new());
    catalog
        .open(dataset.as_str(), &path, None)
        .expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(dataset.as_str(), SessionRef::mint());

    let request = |d: DatasetHandle| ViewportQueryRequest {
        skp: SKP_VERSION.to_string(),
        dataset: d,
        bbox: None,
        bbox_crs: None,
        limit: None,
        filter: None,
        columns: None,
    };

    // 1. A real ticket, minted under a live generation and never redeemed.
    let ticket = host
        .viewport_query(request(dataset.clone()))
        .expect("viewport_query mints");

    // 2. The source changes under it.
    touch_modification_time(&path);

    // 3. A second real `viewport_query` refuses at R-D2's pre-check and ends the generation through
    //    the product path. The refusal itself is the pre-check's, asserted so that a future change
    //    making this call succeed cannot leave the rest of the test passing vacuously.
    let refused = host
        .viewport_query(request(dataset.clone()))
        .expect_err("the pre-check refuses");
    assert_eq!(refused.code, "engine.source_changed", "{}", refused.message);

    // 4. The redemption, through the `ticket_only` constructor the shell's `run` setup installs
    //    and the `factory.create` call the data plane's START arm makes.
    let factory = EngineSourceFactory::ticket_only(catalog, tickets, host.generations());
    let detail = factory
        .create(&OpenRequest {
            operation: OPERATION.to_string(),
            params: ticket.stream.as_str().as_bytes().to_vec(),
        })
        .err()
        .expect("a ticket whose generation ended does not redeem");

    assert!(
        detail.starts_with("engine.source_changed: "),
        "the refusal must carry its typed code as a prefix, which is what the shell's own \
         `isSessionEndedTerminal` matches: {detail}"
    );
}

/// **T2 — the fabrication this arm exists to prevent.**
///
/// A syntactically valid handle that was never minted. The kernel has no record of it, so it says
/// what `StreamRegistry::redeem` says and makes no statement about any
/// file. This is the P3 attempt-2 defect the human's round-4 ruling removed
/// (`engine/ADMISSION-PREREGISTRATION.md:742-744`), asserted negatively so that re-introducing it
/// fails here by name.
///
/// RECORDED MUTATION: in `EngineSourceFactory::liveness_refusal` (`kernel/src/lib.rs`), the first
/// read `create_from_ticket` makes, add `TicketLiveness::Unknown` to the `EndedBySourceChange` arm
/// and leave `Live => None`, so a handle this registry has no record of is answered with the
/// source-changed refusal. Applied at `959f4706fbd8824dc27352d719dae71c9a1a7c4d`, run alone and
/// reverted: `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal` FAILED on the
/// `is unknown` assertion (`` `redeem`'s own refusal is what answers ``), which fires before the
/// negative one, its detail carrying the `engine.source_changed: ` prefix. The preregistration
/// predicted the negative assertion; the positive one is simply written first, and both cover the
/// same defect.
#[test]
fn an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal() {
    let catalog = Arc::new(Catalog::new());
    let tickets = StreamRegistry::new();
    let generations = GenerationRegistry::new();
    // Minted here and never given to any registry: a well-formed handle with no history anywhere.
    let stranger = StreamHandle::mint();

    assert_eq!(
        generations.ticket_liveness(stranger.as_str()),
        TicketLiveness::Unknown,
        "a handle this registry never saw is Unknown, not dead"
    );

    let factory = EngineSourceFactory::ticket_only(catalog, tickets, generations);
    let detail = factory
        .create(&OpenRequest {
            operation: OPERATION.to_string(),
            params: stranger.as_str().as_bytes().to_vec(),
        })
        .err()
        .expect("an unknown handle does not redeem");

    assert!(
        detail.contains("is unknown"),
        "`redeem`'s own refusal is what answers: {detail}"
    );
    assert!(
        !detail.contains("source_changed") && !detail.contains("changed"),
        "the kernel must not diagnose a source change for a handle it has no record of: {detail}"
    );
}

/// **T3 — the dead-ticket record is bounded**, by the same two levers every other per-dataset map in
/// this registry is bounded by.
///
/// The age half of the bound (`TICKET_TTL + TERMINAL_ENTRY_MAX_AGE`, per
/// `GenerationRegistry::prune_locked` and its doc's condition 1) is
/// **not** asserted here for the same reason
/// `dead_generation_attributions_are_pruned_rather_than_accumulating` above does not assert its own:
/// it would need a clock this file must not take (ADR-018). It is stated at `prune_locked`'s own
/// doc, and §7 declares the value as the existing sum rather than a second constant.
///
/// RECORDED MUTATION: drop the `st.dead_tickets.retain(..)` line from
/// `GenerationRegistry::forget_dataset` (`kernel/src/skp.rs`; `mint_for_open`'s own line of that
/// form stays). Applied at `959f4706fbd8824dc27352d719dae71c9a1a7c4d`, run alone and reverted:
/// `the_dead_ticket_record_is_bounded` FAILED on `close clears this dataset's dead handles`
/// (`left: 1`).
#[test]
fn the_dead_ticket_record_is_bounded() {
    let g = GenerationRegistry::new();

    g.mint_for_open("ds_a", SessionRef::mint());
    assert!(g.attribute_ticket("sh_a1", "ds_a"));
    g.invalidate("ds_a", SessionEndReason::ObservedChange);
    assert_eq!(g.dead_ticket_count(), 1, "the ended handle is recorded");

    // Closing the dataset forgets it entirely — `StreamRegistry` no longer answers for the handle
    // either, so the record could only speak about a ticket nothing else in the process knows.
    g.forget_dataset("ds_a");
    assert_eq!(
        g.dead_ticket_count(),
        0,
        "close clears this dataset's dead handles"
    );

    // And so does a reopen, which is what boundary 4's "until reopen" means.
    g.mint_for_open("ds_b", SessionRef::mint());
    assert!(g.attribute_ticket("sh_b1", "ds_b"));
    g.invalidate("ds_b", SessionEndReason::ObservedChange);
    assert_eq!(g.dead_ticket_count(), 1);
    g.mint_for_open("ds_b", SessionRef::mint());
    assert_eq!(
        g.dead_ticket_count(),
        0,
        "reopen clears this dataset's dead handles"
    );

    // Scoped per dataset, never wholesale: one dataset's reopen must not retire another's record.
    g.mint_for_open("ds_c", SessionRef::mint());
    assert!(g.attribute_ticket("sh_c1", "ds_c"));
    g.invalidate("ds_c", SessionEndReason::ObservedChange);
    g.mint_for_open("ds_d", SessionRef::mint());
    assert_eq!(
        g.dead_ticket_count(),
        1,
        "another dataset's open left ds_c's record alone"
    );
}

/// The reason the record exists at all, asserted rather than argued (§5 prediction 2): `invalidate`
/// prunes the attributions it just read, in the same call, so **without** this record a handle that
/// was just ended is indistinguishable from one that was never minted.
///
/// RECORDED MUTATION: in `GenerationRegistry::invalidate` (`kernel/src/skp.rs`), move the
/// `st.dead_tickets.insert(..)` loop to after the `Self::prune_locked(&mut st)` call, taking
/// its handles from `st.tickets` (those naming this dataset and generation, collected into a
/// `Vec` first so that it builds) instead of from `ended`. Applied at
/// `2a6adbb10d2ab8bc65e3a3ab8fb9ae057683afcf`, run alone and reverted:
/// `a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it` FAILED on
/// `and the record kept the handle` (`left: 0`), which fires before the `EndedBySourceChange`
/// assertion; both cover the same defect, the prune having swept the attribution first.
#[test]
fn a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it() {
    let g = GenerationRegistry::new();
    g.mint_for_open("ds_a", SessionRef::mint());
    assert!(g.attribute_ticket("sh_a1", "ds_a"));
    assert_eq!(g.ticket_liveness("sh_a1"), TicketLiveness::Live);

    g.invalidate("ds_a", SessionEndReason::ObservedChange);

    // The attribution is gone — this is the sweep the record exists to survive.
    assert_eq!(
        g.attributed_ticket_count(),
        0,
        "invalidate's own prune swept the attribution"
    );
    assert_eq!(g.dead_ticket_count(), 1, "and the record kept the handle");
    assert_eq!(
        g.ticket_liveness("sh_a1"),
        TicketLiveness::EndedBySourceChange,
        "without the record this could only ever have answered Unknown"
    );
    // And it is exactly this handle, not every handle: a stranger is still Unknown.
    assert_eq!(
        g.ticket_liveness("sh_never_minted"),
        TicketLiveness::Unknown
    );
}
