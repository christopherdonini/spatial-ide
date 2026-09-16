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
//! rejection are P5's. These are unit assertions on one type's rules.
//!
//! No duration, no rate and no performance word appears in this file (ADR-018; A6). The
//! concurrency test asserts a *count*, never a time.

use std::sync::Arc;

use spatial_kernel::skp::GenerationRegistry;

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
