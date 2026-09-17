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

use std::path::{Path, PathBuf};
use std::sync::Arc;

use spatial_data_plane::transport::{OpenRequest, SourceFactory};
use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};
use spatial_kernel::skp::{GenerationRegistry, SkpHost, StreamRegistry, TicketLiveness};
use spatial_kernel::{Catalog, EngineSourceFactory, OPERATION};
use spatial_skp::v0::{DatasetHandle, StreamHandle, ViewportQueryRequest, SKP_VERSION};

/// Mutation recorded in-source (`scripts/plan/verify-mutation.mjs`): deleting the
/// `st.invalidated.contains(dataset)` guard in `live_or_mint` makes an invalidated dataset resurrect
/// and this test fail.
#[test]
fn the_state_is_three_valued_never_minted_is_not_invalidated() {
    let g = GenerationRegistry::new();

    // 1. Never minted: `live_or_mint` gives it a session rather than refusing. A dataset this
    //    registry has never heard of has NOT been observed to change, and telling its caller its
    //    file changed would be a false statement about the file (`docs/01` principle 8).
    let first = g.live_or_mint("ds_never_seen").expect("a dataset with no history gets a session");

    // 2. Live: the same call is idempotent and returns the same generation.
    assert_eq!(g.live_or_mint("ds_never_seen"), Some(first), "an existing session is not re-minted");

    // 3. Invalidated: and only now does it refuse.
    g.invalidate("ds_never_seen");
    assert_eq!(
        g.live_or_mint("ds_never_seen"),
        None,
        "only an invalidated dataset refuses — that is the whole point of the third state"
    );
}

/// Mutation recorded in-source: removing `st.invalidated.remove(dataset)` from `mint_for_open`
/// leaves a reopened dataset permanently refused and this test fails.
#[test]
fn a_fresh_open_clears_an_earlier_invalidation_because_that_is_what_reopening_is() {
    let g = GenerationRegistry::new();
    let before = g.mint_for_open("ds_a");
    g.invalidate("ds_a");
    assert_eq!(g.live_or_mint("ds_a"), None);

    let after = g.mint_for_open("ds_a");
    assert_ne!(after, before, "a reopen mints a new generation, never reuses the ended one");
    assert!(
        g.live_or_mint("ds_a").is_some(),
        "boundary 4's refusals say 'until reopen'; this is the reopen"
    );
}

/// Mutation recorded in-source: making `live_or_mint` mint over an invalidated entry (dropping its
/// early `return None`) resurrects a dead session and this test fails.
#[test]
fn live_or_mint_never_resurrects_an_invalidated_generation() {
    let g = GenerationRegistry::new();
    g.mint_for_open("ds_a");
    g.invalidate("ds_a");
    for _ in 0..5 {
        assert_eq!(g.live_or_mint("ds_a"), None, "repeated asking must not eventually succeed");
    }
}

/// Mutation recorded in-source: making `attribute_ticket` insert unconditionally (returning `true`
/// when the dataset has no live generation) fails this test's second half.
#[test]
fn a_ticket_is_attributable_only_under_a_live_generation() {
    let g = GenerationRegistry::new();
    g.mint_for_open("ds_a");
    assert!(g.attribute_ticket("sh_1", "ds_a"), "a live dataset attributes its ticket");
    assert_eq!(g.attributed_ticket_count(), 1);

    // The false path: a dataset with no live generation cannot attribute one, and the caller must
    // refuse rather than record a ticket under a generation that does not exist.
    g.invalidate("ds_a");
    assert!(!g.attribute_ticket("sh_2", "ds_a"), "an ended session attributes nothing");
    // And the ticket from the ended generation is gone with it — nothing is left answering about a
    // generation that no longer exists.
    assert_eq!(g.attributed_ticket_count(), 0);
}

/// Mutation recorded in-source: changing `invalidate`'s filter to `d == dataset` alone (dropping
/// `*tg == g`) returns tickets from an older generation and this test's cross-dataset assertion
/// fails.
#[test]
fn invalidate_returns_exactly_the_tickets_of_the_generation_it_ended() {
    let g = GenerationRegistry::new();
    g.mint_for_open("ds_a");
    g.mint_for_open("ds_b");
    assert!(g.attribute_ticket("sh_a1", "ds_a"));
    assert!(g.attribute_ticket("sh_a2", "ds_a"));
    assert!(g.attribute_ticket("sh_b1", "ds_b"));

    let mut ended = g.invalidate("ds_a");
    ended.sort();
    assert_eq!(ended, vec!["sh_a1".to_string(), "sh_a2".to_string()]);

    // The other dataset's session is untouched: a generation is per dataset-session, and one
    // dataset's changed source says nothing about another's. Its ticket survives the prune that
    // swept `ds_a`'s, which is the observable form of "untouched".
    assert_eq!(g.attributed_ticket_count(), 1);
    assert!(g.live_or_mint("ds_b").is_some());

    // Idempotent: invalidating again ends nothing further and returns nothing.
    assert!(g.invalidate("ds_a").is_empty(), "a second invalidation has nothing left to end");
}

/// Mutation recorded in-source: dropping either `st.live.remove` or the `tickets.retain` line in
/// `forget_dataset` fails one of these assertions.
#[test]
fn forget_dataset_removes_the_generation_the_invalidation_and_every_attribution() {
    let g = GenerationRegistry::new();
    g.mint_for_open("ds_a");
    g.attribute_ticket("sh_a1", "ds_a");
    g.invalidate("ds_a");

    g.forget_dataset("ds_a");

    assert_eq!(g.attributed_ticket_count(), 0, "the attribution is gone");
    // The invalidation is gone too, so the name is a stranger again rather than a refused one —
    // `close_dataset` then `open_dataset` under the same name is an ordinary reopen.
    assert!(
        g.live_or_mint("ds_a").is_some(),
        "forgetting clears the invalidation as well as the generation"
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
/// Mutation recorded in-source: removing the `Self::prune_locked` call from `attribute_ticket`
/// leaves the dead entries in place and this test fails.
#[test]
fn dead_generation_attributions_are_pruned_rather_than_accumulating() {
    let g = GenerationRegistry::new();
    for round in 0..50 {
        g.mint_for_open("ds_a");
        assert!(g.attribute_ticket(&format!("sh_{round}"), "ds_a"));
        g.invalidate("ds_a");
    }
    // Every ticket above belongs to a generation that has since ended, and the last `invalidate`
    // swept them. Only a live one would survive, and there is none.
    assert_eq!(g.attributed_ticket_count(), 0, "the map did not grow across 50 ended sessions");
}

/// The `Mutex` under concurrent use — two threads minting, attributing and invalidating the same
/// registry.
///
/// **Asserts a count and an invariant, never a timing.** What it establishes is that the registry
/// is internally consistent under concurrent access and does not deadlock or poison: every ticket
/// either belongs to the live generation or does not, and the map stays bounded by the same rule.
///
/// Mutation recorded in-source: replacing the `Mutex` with unsynchronised interior mutability does
/// not compile; making `attribute_ticket` read `live` outside the lock it later inserts under
/// reintroduces the torn read this exercises.
#[test]
fn the_registry_is_consistent_when_two_threads_use_it_at_once() {
    let g: Arc<GenerationRegistry> = GenerationRegistry::new();
    g.mint_for_open("ds_a");

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
                    g.invalidate("ds_a");
                    g.mint_for_open("ds_a");
                }
            }
            attributed
        }));
    }
    let total: u32 = handles.into_iter().map(|h| h.join().expect("no thread panicked")).sum();
    assert!(total > 0, "at least some attributions landed under a live generation");

    // Bounded afterwards, by the same rule the single-threaded test asserts: end the session and
    // nothing from it survives.
    g.invalidate("ds_a");
    assert_eq!(g.attributed_ticket_count(), 0, "no attribution outlived the generation it named");
}

// ---------------------------------------------------------------------------------------------
// P3b §2c — the kernel-authoritative dead-ticket refusal at redemption, three-valued.
//
// These three extend the file rather than opening a new one because the rule under test is
// `GenerationRegistry`'s: what it records when a generation ends, and what a redemption is
// therefore entitled to say. The first is an END-TO-END test from the real product shape (the
// human's class fix, `DECISIONS-PENDING.md:46`): a real `SkpHost`, a real `viewport_query`, the
// real `EngineSourceFactory` constructor `frontends/shell/src-tauri/src/lib.rs:373-377` installs, and
// the real `SourceFactory::create` the data plane calls at
// `protocol/data-plane/src/server.rs:384`. Nothing is fabricated and `end_generation` is never
// called by a test.
// ---------------------------------------------------------------------------------------------

/// A fixture written per test, in the shape `kernel/tests/typed_terminal_codes.rs:40-55` uses.
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
/// mutation `kernel/tests/typed_terminal_codes.rs:60-68` performs, and the only one a test can make
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
/// The window this exercises is the only one in which the dead-ticket arm is reachable at all
/// (§5 prediction 1): a ticket minted, its generation ended while the ticket is still pending, and
/// the redemption arriving afterwards. Every step runs through the product path — the ticket comes
/// from `SkpHost::viewport_query` (`kernel/src/skp.rs:629`), the generation is ended by
/// `viewport_query`'s own pre-check refusal (`kernel/src/skp.rs:682-687`) and not by this test, and
/// the redemption goes through `SourceFactory::create` on the constructor the shell installs.
///
/// RECORDED MUTATION: delete the `TicketLiveness::EndedBySourceChange` arm from
/// `EngineSourceFactory::create_from_ticket` (`kernel/src/lib.rs`), leaving `Live | Unknown |
/// EndedBySourceChange => tickets.redeem(..)`. Expected failure:
/// `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code` fails on the prefix
/// assertion, the refusal having degraded to `redeem`'s "was cancelled before it was redeemed".
#[test]
fn a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code() {
    let path = dead_ticket_fixture("dead-ticket-refusal");
    let dataset = DatasetHandle::mint();
    let catalog = Arc::new(Catalog::new());
    catalog.open(dataset.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(catalog.clone(), tickets.clone());

    let request = |d: DatasetHandle| ViewportQueryRequest {
        skp: SKP_VERSION.to_string(),
        dataset: d,
        bbox: None,
        bbox_crs: None,
        limit: None,
        filter: None,
    };

    // 1. A real ticket, minted under a live generation and never redeemed.
    let ticket = host.viewport_query(request(dataset.clone())).expect("viewport_query mints");

    // 2. The source changes under it.
    touch_modification_time(&path);

    // 3. A second real `viewport_query` refuses at R-D2's pre-check and ends the generation through
    //    the product path. The refusal itself is the pre-check's, asserted so that a future change
    //    making this call succeed cannot leave the rest of the test passing vacuously.
    let refused = host.viewport_query(request(dataset.clone())).expect_err("the pre-check refuses");
    assert_eq!(refused.code, "engine.source_changed", "{}", refused.message);

    // 4. The redemption, through the constructor `frontends/shell/src-tauri/src/lib.rs:373-377`
    //    installs and the call `protocol/data-plane/src/server.rs:384` makes.
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
         `isSourceChangedTerminal` matches: {detail}"
    );
}

/// **T2 — the fabrication this arm exists to prevent.**
///
/// A syntactically valid handle that was never minted. The kernel has no record of it, so it says
/// what `StreamRegistry::redeem` says (`kernel/src/skp.rs:176-187`) and makes no statement about any
/// file. This is the P3 attempt-2 defect the human's round-4 ruling removed
/// (`engine/ADMISSION-PREREGISTRATION.md:742-744`), asserted negatively so that re-introducing it
/// fails here by name.
///
/// RECORDED MUTATION: map `TicketLiveness::Unknown` to the source-changed refusal alongside
/// `EndedBySourceChange` in `create_from_ticket`. Observed failure (performed once on this branch,
/// then reverted): `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal` FAILED on
/// the `is unknown` assertion, which fires before the negative one and prints the fabricated
/// diagnosis in full — *"`redeem`'s own refusal is what answers: engine.source_changed: refused: the
/// source file changed while it was open ({this dataset's session ended…"*. The preregistration
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

    assert!(detail.contains("is unknown"), "`redeem`'s own refusal is what answers: {detail}");
    assert!(
        !detail.contains("source_changed") && !detail.contains("changed"),
        "the kernel must not diagnose a source change for a handle it has no record of: {detail}"
    );
}

/// **T3 — the dead-ticket record is bounded**, by the same two levers every other per-dataset map in
/// this registry is bounded by.
///
/// The age half of the bound (`TICKET_TTL + TERMINAL_ENTRY_MAX_AGE`, `kernel/src/skp.rs:408-414`) is
/// **not** asserted here for the same reason
/// `dead_generation_attributions_are_pruned_rather_than_accumulating` above does not assert its own:
/// it would need a clock this file must not take (ADR-018). It is stated at `prune_locked`'s own
/// doc, and §7 declares the value as the existing sum rather than a second constant.
///
/// RECORDED MUTATION: drop the `st.dead_tickets.retain(..)` line from `forget_dataset`. Expected
/// failure: `the_dead_ticket_record_is_bounded_by_the_same_sum_and_by_reopen_and_close` fails on the
/// after-close count assertion.
#[test]
fn the_dead_ticket_record_is_bounded_by_the_same_sum_and_by_reopen_and_close() {
    let g = GenerationRegistry::new();

    g.mint_for_open("ds_a");
    assert!(g.attribute_ticket("sh_a1", "ds_a"));
    g.invalidate("ds_a");
    assert_eq!(g.dead_ticket_count(), 1, "the ended handle is recorded");

    // Closing the dataset forgets it entirely — `StreamRegistry` no longer answers for the handle
    // either, so the record could only speak about a ticket nothing else in the process knows.
    g.forget_dataset("ds_a");
    assert_eq!(g.dead_ticket_count(), 0, "close clears this dataset's dead handles");

    // And so does a reopen, which is what boundary 4's "until reopen" means.
    g.mint_for_open("ds_b");
    assert!(g.attribute_ticket("sh_b1", "ds_b"));
    g.invalidate("ds_b");
    assert_eq!(g.dead_ticket_count(), 1);
    g.mint_for_open("ds_b");
    assert_eq!(g.dead_ticket_count(), 0, "reopen clears this dataset's dead handles");

    // Scoped per dataset, never wholesale: one dataset's reopen must not retire another's record.
    g.mint_for_open("ds_c");
    assert!(g.attribute_ticket("sh_c1", "ds_c"));
    g.invalidate("ds_c");
    g.mint_for_open("ds_d");
    assert_eq!(g.dead_ticket_count(), 1, "another dataset's open left ds_c's record alone");
}

/// The reason the record exists at all, asserted rather than argued (§5 prediction 2): `invalidate`
/// prunes the attributions it just read, in the same call, so **without** this record a handle that
/// was just ended is indistinguishable from one that was never minted.
///
/// RECORDED MUTATION: move the `st.dead_tickets.insert(..)` loop in `invalidate` to after the
/// `Self::prune_locked(&mut st)` call and source it from `st.tickets` instead of `ended`. Expected
/// failure: `a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it` fails on
/// the `EndedBySourceChange` assertion, the attribution having already been swept.
#[test]
fn a_ticket_whose_generation_ended_is_recorded_dead_before_the_prune_sweeps_it() {
    let g = GenerationRegistry::new();
    g.mint_for_open("ds_a");
    assert!(g.attribute_ticket("sh_a1", "ds_a"));
    assert_eq!(g.ticket_liveness("sh_a1"), TicketLiveness::Live);

    g.invalidate("ds_a");

    // The attribution is gone — this is the sweep the record exists to survive.
    assert_eq!(g.attributed_ticket_count(), 0, "invalidate's own prune swept the attribution");
    assert_eq!(g.dead_ticket_count(), 1, "and the record kept the handle");
    assert_eq!(
        g.ticket_liveness("sh_a1"),
        TicketLiveness::EndedBySourceChange,
        "without the record this could only ever have answered Unknown"
    );
    // And it is exactly this handle, not every handle: a stranger is still Unknown.
    assert_eq!(g.ticket_liveness("sh_never_minted"), TicketLiveness::Unknown);
}
