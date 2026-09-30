# close_dataset releases a dataset's watch even when its catalog entry is already gone (wave-2 W2-C observation 3) — preregistration

**Authority:** PLAN node `kernel-close-dataset-unknown-keeps-openrecord`, placed position 4 of 16 by question round 31, item 1 (RULED 2026-09-30). Origin: wave-2 W2-C, unproven observation 3 (`state/cloud/wave2/W2-C.md:75` @ 24224d5 sha256:2e68031dc1cc46e90b957935d322cc1edd22121bc0e0532b5e8406349761bc6a; custodian field `state/cloud/wave2/W2-C.md:101` @ 24224d5 sha256:1553b55015bced1f2dde30e18d7ef30188b8d91c7376327be825f9d29deb53d4). Evidence, not Authority; nothing from any `cloud/wave2-*` branch merges.
**Drafted by** the architect agent on the custodian's brief, read at `main` 24224d5. Shape model: `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`. **Committed before any code**, on main, as the node's gate file (the architect's consult: `state/consults/2026-09-30-close-dataset-unknown-architect-draft.md`). Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** (1) every span hash, computed at 24224d5 (the architect had no Bash); (2) the committed-before-code line names main and the consult; (3) §4 gains the fixture-name rule and §8 its item 14, after PR #148's gate-1 reviewer's N1 (`state/consults/gates/2026-09-30-raw-path-refusal-code-gate1-reviewer.md`): this module's `fixture` rewrites its file on every call, and every test in it uses a name of its own; (4) this line. Nothing else changed.
**Gating:** full (AUTONOMY.md §21a, a stated guarantee: `engine/SOURCE-WATCHER-PREREGISTRATION.md:159` @ 24224d5 sha256:8e1594dccaf75842d17bc3689b5738c888837f8f58747f8571af736b5c14fb38 and `engine/SOURCE-WATCHER-PREREGISTRATION.md:395` @ 24224d5 sha256:90d088ef276df2002b8a0e6d354e0dbbb50c289de95c89008486a8b3c79f3f1d; and the close-path order of `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §2c, under test). Under round 25, item 2 (e), no five-line form is used.

## §0. Disclosure
- Reasoned from code. W2-C's cite is at its baseline d4245fe and is not reused.
- The defect: `kernel/src/skp.rs:1444-1446` @ 24224d5 sha256:a536b9132726e8d30b8f26283b7a205f16295cc01fe72128f0dcee7cde9e3ec0 returns before `kernel/src/skp.rs:1451-1452` @ 24224d5 sha256:659dac45faac01014cb5373ecd2ed79153fae225f9ccb68ddd63d9e55806d4eb.
- What it keeps: the `OpenRecord` (`kernel/src/skp.rs:921-928` @ 24224d5 sha256:7157c7e8521b4d72684af4d14a469842e3dadfea926d521b235a3070358e6da4, held at `kernel/src/skp.rs:977-979` @ 24224d5 sha256:8891088d74da654ca9fb90ce30c6cf07274a9f2dfe2d9e8cb8b14e52a10f0c25). That is the watch (2 handles and 2 threads per open on Windows, per the watcher form's §7 row) and its admitted sink (`kernel/src/skp.rs:1052-1095` @ 24224d5 sha256:d49bc6485f7a0d46fccd9e6ef86e349b08094d5518f6e51d36dbeae2f6607093).
- Reachability: none in the product. Catalog removers are `kernel/src/skp.rs:1470` @ 24224d5 sha256:8154b2987c0a6efba38c6533def50ed061b2ced10537f3d4d4c98bec6b9f5e28 (after the record removal) and `kernel/src/skp.rs:1136` @ 24224d5 sha256:d7563c914b16a6771f49899f0a4fad18b3e243e620bfcc5c4f60c0a2d2d92282 (before any record insert, handle never returned). `Catalog::remove` (`kernel/src/lib.rs:202-204` @ 24224d5 sha256:540f1436491b3244ed7489c75c9e7747deaea13e535333c8e7babda46ce7b4af) has no other caller. The shell's `SkpHost::catalog()` uses are `.get` only.
- **H1 (hypothesis):** no product path removes a catalog entry while its OpenRecord exists. Discriminator: §6 item 2's grep. A product remover found is invalidator I1.
- Intake:

  | Item | Disposition |
  |---|---|
  | W2-C observation 3 | In |
  | The unknown path's generation-registry entries and `Pending` tickets for the name (untouched before and after) | Out: unreachable, not claimed (§1) |
  | A close between open's catalog insert and its admission (a generation minted after forget) | Out: open-side, unreachable, the custodian's routing |
  | W2-C C-1, W2-C observation 2 | Out: their own nodes |
  | `Catalog::remove`'s doc drift | Out: node `catalog-open-replace-drop-latency-note` |

- Fixture drive: nothing is measured.

## §1. May and may not claim
- **May claim:** when `close_dataset(name)` returns, by any outcome, the host holds no `OpenRecord` for `name`, and the watch that record held has been dropped (disarmed and joined, per `ArmedWatch`'s Drop contract, `engine/src/watch.rs:37-39` @ 24224d5 sha256:b012d3eea867c5438f071b795284b2f1ebd478df25a3290976081b4e975da112).
- **May not claim:**
  - anything about the generation registry, tickets or events on the unknown path;
  - the product watch's handle and thread release beyond its Drop contract (the engine's tests own that);
  - any reachable product path;
  - any `docs/08` figure.
- **Unchanged:**
  - the refusal: code `skp.unknown_dataset`, message and `handle` field, and its condition, catalog absence (`protocol/skp/src/v0/error.rs:51-57` @ 24224d5 sha256:c86ba58f00d82a25f4d89de5d8dc974c6eba29200ef75b77ddc9bf80d6e63395);
  - the success path's order `begin_close`, `cancel_all_for_dataset`, `forget_dataset`, `catalog.remove` and its linearization (close-races §2d);
  - no wire, SKP-V0, ADR or KNOWN-LIMITATIONS change;
  - operation classes unchanged (ADR-006).
- **Seams:**
  - The shell's `close_dataset` (`frontends/shell/src-tauri/src/commands.rs:111-124` @ 24224d5 sha256:07565b3726dd8036ebdf53ea2677412d77e48901b611668f3fe57ae1a5d82933) receives the identical result.
  - The kernel drops the watch through the existing `ArmedWatch` trait, as the success path already does.
  - No new seam, so no end-to-end test is owed. The gate checks this reading.

## §2. The change
1. `kernel/src/skp.rs` `SkpHost::close_dataset`: the `watches` removal and its drop move above the `catalog.get` check. The new order is:
   1. the record removed under the map guard, dropped after release;
   2. the `unknown_dataset` check;
   3. then close-races §2c's steps 3 to 6, unchanged.

   This swaps close-races §2c's steps 1 and 2. That form is a record and is not edited.
2. The comment above the removal states the new first step and why: the watcher form's watch-lifetime line, and release on every outcome. The ordering comment for steps 3 to 6 is unchanged.
3. Nothing else: no new item of any visibility in product code.
4. Portability (`state/directives/PORTABILITY-2026-09-30.md` §2):
   - **R1:** release on close is identical on every platform. Off Windows the record holds no watch (`engine/src/watch.rs:73-74` @ 24224d5 sha256:2b972c08d83d8b4c501b125e1fefdc4779b37627113367d0909d51e0ab501966), and removing it is the same.
   - **R2:** no `cfg` is added, and the change is outside every boundary file.
   - **R3:** does not engage. Not a new or materially changed OS-dependent feature: the watcher boundary and its per-platform behaviour (KNOWN-LIMITATIONS 24) are untouched; only the time at which shared code drops a trait object changes.
   - **R4:** no new coupling, no Windows assumption, no exclusion.
   - **R5:** claims L1 correctness on the platforms CI runs, nothing at L2 or L3.
   - **R6:** no test ignored on any platform.

## §3. Fixtures and predicted outcomes
The in-crate `fixture(name)` helper (`kernel/src/skp.rs:2691-2707` @ 24224d5 sha256:ed97bce00a906aa83a1265033e16074817382b5554a86fbbbe4e9a3b819a2eaf) generates per run, untracked. No claim depends on its bytes, and it is not hash-verified (disclosed).

| # | Scenario | Base | After |
|---|---|---|---|
| S1 | open through a test arm returning `Watching`; `host.catalog().remove(handle)`; `close_dataset(handle)`; close again | FAIL: `skp.unknown_dataset`, record present, watch not dropped | `skp.unknown_dataset` (same field) both times; record absent; watch dropped before the first close returns |
| S2 | open through the same arm; `close_dataset(handle)` | `Ok { cancelled_streams: 0 }`, record absent, watch dropped | same |

## §4. Tests, one mutation each
Placement and method:
- In-crate, in `ticket_drop_under_lock_regression`, beside CR1 to CR4.
- The test arm and watch are defined inside that module. The watch's `Drop` sets an `Arc<AtomicBool>`; `resolves_unchanged` is `true`.
- `host.watches` is read directly (the K15 precedent). `SkpHost::catalog` and `Catalog::remove` are existing `pub` items with product callers.
- No sleep, no timeout, no spawned thread, no timing assertion (round 25, item 1 (a)). No test-only hook in product code.
- T1 and T2 each pass `fixture` a name that no other test uses: the helper rewrites its file on every call (custodian's edit 3).

Tests:
- **P0**, before any code: T1 at the test-only commit fails on its record-absent assertion.
- **T1** `a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch` (S1).
  - Asserts:
    - the precondition, record present and flag false;
    - `Catalog::remove` returns `Some`;
    - the first close's code is `skp.unknown_dataset` and its `handle` field is the handle;
    - the record is absent and the flag is true;
    - the second close has the same code.
  - Mutation: restore the base order (the removal below the check). T1 fails on the record-absent assertion.
- **T2** `a_close_drops_its_watch_before_it_returns` (S2).
  - Asserts: `Ok` with 0 cancelled; the record is absent; the flag is true.
  - Mutation: delete the `watches` removal in `close_dataset`. T2 fails on the record-absent assertion.
- Mutations are observed by applying one, running the named test, recording its failure by name in the test's doc with the commit, and reverting. A `verify-mutation` run is not an observation.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:** P0 fails at base; T1 and T2 pass on the fix, and each fails under its own mutation; every other kernel test passes.
- **Declared unchanged:**
  - CR1 to CR4 and R2 (the close-races tests);
  - E7 `a_pending_drop_inside_close_emits_once_with_its_session_reference`;
  - E8 `an_end_recorded_before_forget_dataset_and_enqueued_after_it_carries_its_reference`;
  - K15;
  - `close_dataset_cancels_every_ticket_for_that_dataset_only`;
  - `a_close_between_liveness_and_redeem_keeps_redeems_wording`;
  - K5 and K13 in `kernel/tests/source_watch_ordering.rs`;
  - `kernel/tests/session_end_event.rs` (E9 included);
  - `kernel/tests/source_watch_windows.rs` (the real `PlatformWatch` closes);
  - `SkpError::unknown_dataset`, byte for byte.
- **Invalidators:**
  - **I1 (stop, to the custodian):** a product remover of a catalog entry with a live OpenRecord is found. The observation is then reachable and is regraded.
  - **I2 (invalid run):** P0 passes at base. Recorded as class 2.
  - **I3 (stop, to the human):** the fix needs a changed refusal, a new code or string, or a wire change.
  - **I4 (stop):** a declared-unchanged test fails.
  - **I5 (stop):** the scope needs generation or ticket calls on the unknown path.
  - **I6 (stop):** T1 or T2 needs timing, a thread or a hook.
- **Falsification:** after `close_dataset(name)` returns, an OpenRecord for `name` remains or its watch is undropped; or any close refusal differs from base; or the success path's step order changes.

## §6. Instruments
Assertions only:
1. Map membership, the drop flag, the error code and field.
2. The remover grep: `git grep -nE "\.remove\(|catalog\(\)" -- kernel/src frontends/shell/src-tauri/src`, read for `Catalog` receivers (H1).
3. `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify-mutation`, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings
- No new constant.
- **Size budget:** ≤ 150 changed lines, insertions plus deletions, over ≤ 1 file (`kernel/src/skp.rs`).
  - Counting command: `git diff --numstat <merge-base>...<head> -- . ':!kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit.
  - An overrun is class 8, and this line is never edited to match.
  - Estimate: about 10 product lines and 110 test lines.

## §8. Block-on-sight
1. Any change to the refusal's code, message, fields or condition.
2. Any diff under `protocol/`, `engine/`, `frontends/` or `docs/`, or to `kernel/src/lib.rs`, KNOWN-LIMITATIONS, SKP-V0, or the watcher or close-races forms.
3. The success path's order changed; the watch dropped under the `watches` guard or after `begin_close`.
4. Any generations or tickets call added on the unknown path.
5. Any new item in product code; a test-only hook; a `cfg(test)` branch in product code.
6. A sleep, `recv_timeout`, spawned thread or timeout in T1 or T2.
7. Any `cfg(windows|unix|target_os)` in product code; a platform ignore on T1 or T2.
8. A declared-unchanged test's assertions edited.
9. Anything from `cloud/wave2-*` merged or cherry-picked.
10. A record calling a `verify-mutation` run an observation; a mutation without its commit.
11. A §7 overrun not recorded as class 8, or §7 edited; any code of a scope addition before its class-9 amendment.
12. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit or named without its commit id;
    - a bare self-line.
13. A squash or rebase merge.
14. T1 or T2 passing `fixture` a name another test uses (custodian's edit 3).

## §9. Gates
- **Architect:**
  - the watcher form's lines cited in the Header;
  - close-races §2c and §2d;
  - ADR-035 Decision 3 (no new emission route);
  - ADR-018 vocabulary; ADR-006;
  - the caller rule and the seam reading (§1);
  - R1 to R6;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - P0 and both mutations re-observed;
  - §7 recounted;
  - §6's grep re-run (H1).
- **Suites, green before either gate:**
  - `cargo test -p spatial-kernel` on Windows; `cargo clippy`; `cargo fmt --check`;
  - `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify-mutation` and `verify:plan`;
  - CI's `node --test` scripts suite;
  - branch CI read before gating.
- **Operator:** none. Nothing user-visible changes.

## §10. Amendments (opens empty, append-only; classes 1 to 9)
