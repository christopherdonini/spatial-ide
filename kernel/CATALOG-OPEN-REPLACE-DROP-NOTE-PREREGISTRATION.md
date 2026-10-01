# Catalog::open's replaced dataset: a latency note, and Catalog::remove's doc corrected (round 25, item 1, S2) — preregistration

**Authority:** PLAN node `catalog-open-replace-drop-latency-note`, placed position 5 of 16 by question round 31, item 1 (RULED 2026-09-30). The ruling: question round 25, item 1 (RULED 2026-09-26), its S2 branch, and sub-item (d)'s Outcome line. Origin: `state/consults/2026-09-26-catalog-open-drop-reproduction.md` §1, §3 and §5 probe (a).
**Drafted by** the architect agent on the custodian's brief, read at `main` f815eb5 (the consult: `state/consults/2026-10-01-catalog-open-replace-note-architect-draft.md`). Shape model: `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`. **Committed before any code**, on main, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** (1) every span hash, computed at f815eb5 (the architect had no Bash); (2) the consult's path in the line above; (3) one intake row in §0, for the same claim in SKP-V0's `close_dataset` paragraph, which the custodian's holder grep found; (4) the round-33 sentence in the Note only line. Nothing else changed.
**Gating:** full (AUTONOMY.md §21a, a stated invariant under test: `engine/tests/connection_reuse.rs:438-454` @ f815eb5 sha256:78ab4f73ec062e112a7dee7c72ee8c0103a84d63363335b97b4f56152fde16ec; and docs/01 principle 7 on the lock `kernel/src/skp.rs:1273-1276` @ f815eb5 sha256:fb03fc52c3219de0e4b3b461db9cfa05f66e7decef519974cfd1ec4bba8b0630 reads through). Under round 25, item 2 (e), no five-line form is used.
**Note only.** The ruling does not decide whether the fix is taken; this form takes the note, and the fix is invalidator I3 (§5). The choice is put to the human in question round 33 (2026-10-02).

## §0. Disclosure
- Reasoned from code. The reproduction's probes sit in an untracked scratch worktree: evidence, not Authority. Its tracked §5 records their output. Probe (b)'s figures are observations and are not used.
- The site: `kernel/src/lib.rs:168` @ f815eb5 sha256:e722e5cdb78b7cf62bfa6dd016358564faf71539a99d3123c8a403c32bd68590 and `kernel/src/lib.rs:190` @ f815eb5 sha256:e722e5cdb78b7cf62bfa6dd016358564faf71539a99d3123c8a403c32bd68590. `insert`'s return value is a temporary of the guard's statement, dropped before the guard (the reproduction §1, probe (a)).
- The contrast: `Catalog::remove`'s guard is a tail-expression temporary released before the caller receives the value (`kernel/src/lib.rs:202-204` @ f815eb5 sha256:540f1436491b3244ed7489c75c9e7747deaea13e535333c8e7babda46ce7b4af).
- S2 still holds at f815eb5: no `Drop` reached from a replaced `Arc<Dataset>` takes or waits on the catalog lock. `Dataset`'s fields are unchanged (`engine/src/dataset.rs:145-180` @ f815eb5 sha256:2dfefca70e65eeb2228332afb774610efd450c6e6fa288264a693795dd74d7d0), and no new `Drop` impl is in its field graph.
- What runs under the guard, and when: if the replaced Arc is the last reference to its dataset and no lease is in flight, the pool's idle DuckDB connections close. Otherwise:
  - a `get` holder (a call's local, a publish attempt at `frontends/shell/src-tauri/src/publish.rs:160` @ f815eb5 sha256:3ebb33be63c6c58bcded1803ebff3354bbdb58e07f8e26354875dcc1682adfef) drops the dataset later, on its own thread;
  - a lease in flight drops the pool later, on its producer thread (`engine/src/pool.rs:572-579` @ f815eb5 sha256:6180d00fe7c7cfbeb9646f52f645b09b09d1eff1bbf9dd2048e8f7edcb0900cb).
- Reachability: only through a handle collision.
  - `slice-host` opens once (`kernel/src/main.rs:105` @ f815eb5 sha256:5caa01474e49a75bfad83b36e1e52409b3322465dfa9811cba8af59a75c60e4d).
  - SKP opens under a fresh handle (`kernel/src/skp.rs:1038` @ f815eb5 sha256:238cd96f1a7d324b88b87bdf32fa1f79fbd8eea52da6fccd3c7bdd44edaf9a11; `protocol/skp/src/v0/handles.rs:17-21` @ f815eb5 sha256:ed8e290352da217b235c32b2b1f4f2ae09144455a5c797ae24cde6a0753cc730), 128 random bits; a collision is not structurally excluded.
  - The shell and the raw data-plane path call `get` only.
- **H1 (hypothesis):** no product path opens under a name already in the catalog, except through a handle collision. Discriminator: §6 item 2. A product path found is invalidator I1.
- The drift: `kernel/src/lib.rs:198-199` @ f815eb5 sha256:11bef5ad76ff6ff38d9be9b4148267088916adca5c700e344665920432f7ab0f. No stream holds an `Arc<Dataset>`. The lease holds the pool (`engine/src/pool.rs:499-505` @ f815eb5 sha256:7bde4e759e00148ef12837ab5c7dde38f53b6e05678dd61a5e84e63c3c903514), and the stream clones plain values (`engine/src/stream.rs:1196-1201` @ f815eb5 sha256:9b0e368c66149f8b2c2bda9f842ea764f0a2cc5ad091f1a0c36b8bf10d337750).
- Intake:

  | Item | Disposition |
  |---|---|
  | The replace-under-guard note | In, as a doc note |
  | `Catalog::remove`'s doc drift | In |
  | The same claim in SKP-V0's `close_dataset` paragraph (`protocol/skp/SKP-V0.md:129-131` @ f815eb5 sha256:2f066ecdc959ac31f4c8a48640eae06db7c8c3de363021a1b9c7598fd429b468): a registry entry holds no `Arc<Dataset>` (`TicketState` holds the name) | Out: SKP-V0 is not edited here (§8 item 2); routed to PLAN node `kernel-close-races-followups`, for the next SKP-V0 change |
  | The fix (bind, drop after the guard) | Out: invalidator I3, the human's at round 33 |
  | `open`'s doc naming "the test suite" among product paths (`kernel/src/lib.rs:158-160` @ f815eb5 sha256:3c89c14d5ac165158fa56d1738e4d1e22460a9cb15324fb371a0754b2dfe8c0c) | Out: true of its callers, not owed |

- Fixture drive: nothing is measured.

## §1. May and may not claim
- **May claim:**
  1. On `open`'s and `open_cancellable`'s Ok path, the replaced `Arc<Dataset>` is dropped before the write guard is released. When it is the last reference and no lease is in flight, its pool's idle connections close there. This is a reading of the code and of the language's drop order, and no test distinguishes it.
  2. The replaced dataset's pool is gone by the time the call returns (T1, T2).
  3. A live stream holds no `Arc<Dataset>`. Its lease keeps the pool alive until released.
- **May not claim:**
  - any duration, or anything about readers' waits beyond "they wait on the guard";
  - any `docs/08` figure;
  - anything on the Err path (the `?` at `:167` and `:189` returns before the guard, and an existing entry stays);
  - any reachable product path;
  - that a stream completes after removal (untested).
- **Vocabulary:** the DuckDB teardown is named as an external section this code does not bound (ADR-018 item 4, class (b)). No duration word appears.
- **Unchanged:** every line of `kernel/src/lib.rs` that is not a `///` doc line; no wire, SKP-V0, ADR, KNOWN-LIMITATIONS or engine change; ADR-006 operation classes unchanged.
- **Seams:** none new. T1 and T2 use `Catalog::open`, `open_cancellable`, `get` and `names`, and `Dataset::connections` and `path`. All are existing `pub` items with product callers (`kernel/src/main.rs:105`, `kernel/src/skp.rs:1099`, `frontends/shell/src-tauri/src/pool_poll.rs:186` @ f815eb5 sha256:677fc1524252d60010d3dd406e1becf863b08fce7836b793a0c24d7744b85692). No end-to-end test is owed. The gate checks this reading.

## §2. The change
1. `kernel/src/lib.rs`, `Catalog::open`'s doc gains a replace note stating §1 May 1:
   - its condition: the last reference, no lease in flight;
   - the external section, and that other catalog callers wait on the guard;
   - today's reachability: `slice-host` opens once; SKP's handle is 128 random bits and a collision is not excluded;
   - and that, if replacement becomes reachable, the fix is the shape `SkpHost::close_dataset` uses for its removed watch.
   No number, no duration word. `open_cancellable`'s doc gains at most one line pointing to it.
2. `kernel/src/lib.rs`, `Catalog::remove`'s doc. The sentence from "The `Arc<Dataset>`" to "regardless of removal order" is replaced by: "A live stream holds no `Arc<Dataset>`: its producer thread holds a lease on the dataset's connection pool, and the lease keeps that pool, and the connection the stream reads, alive until it is released, whatever the removal order (`engine/tests/connection_reuse.rs`'s `a_lease_in_flight_keeps_the_pool_alive_after_the_dataset_is_dropped`)." The rest of the comment is unchanged.
3. A new file, `kernel/tests/catalog_replace.rs`, with an SPDX header, holds T1 and T2.
4. Nothing else. No product code token changes, and no new item of any visibility is added.
5. Portability (`state/directives/PORTABILITY-2026-09-30.md` §2):
   - **R1:** identical on every platform. No OS dependence.
   - **R2:** no `cfg`, and no boundary file touched.
   - **R3:** does not engage. Not an OS-dependent feature.
   - **R4:** no new coupling, no Windows assumption.
   - **R5:** L1 correctness on the platforms CI runs, nothing at L2 or L3.
   - **R6:** no test ignored on any platform.

## §3. Fixtures and predicted outcomes
Fixtures are generated per run by `spatial_engine::fixture::write_geoparquet` (the `kernel/tests/end_to_end.rs:37-47` @ f815eb5 sha256:b231db2c011b7dcc248b03691a0f309f21ef78882aafe004c6997f1e0e17ccc0 shape) under `target/fixtures`. Each test uses its own two file names, which no other test uses. They are untracked and not hash-verified (disclosed); no claim depends on their bytes.

| # | Scenario | Base | After |
|---|---|---|---|
| S1 | `open(N, A)`; `open(N, B)` | `get(N)` path is B; `names()` is `[N]`; A's pool's `Weak` has strong count 0 | same |
| S2 | as S1 through `open_cancellable` | same | same |

## §4. Tests, one mutation each
- Placement: `kernel/tests/catalog_replace.rs`, public API only. No sleep, no timeout, no spawned thread, no timing assertion (round 25, item 1 (a)). No test-only hook in product code.
- **No P0.** No product behaviour changes. T1 and T2 pin the outcome and are predicted to pass at the base (§5 I2).
- **T1** `replacing_a_name_through_open_serves_the_new_dataset_and_drops_the_old_one_before_open_returns` (S1). It asserts:
  - A's pool is alive after the first open, read through a `Weak` from `get(N)`'s `connections()`, with the `get` clone dropped first;
  - the second open is `Ok`;
  - `get(N)`'s `path()` is B;
  - `names()` is `[N]`;
  - the `Weak`'s strong count is 0.
  - Mutation M1: `open`'s `insert` becomes `entry(name.into()).or_insert(Arc::new(ds))`. T1 fails on the path assertion.
- **T2** `replacing_a_name_through_open_cancellable_serves_the_new_dataset_and_drops_the_old_one_before_it_returns` (S2). Same assertions, with a fresh `CancelToken` and no identity declaration.
  - Mutation M2: the same change in `open_cancellable`. T2 fails on the path assertion.
- Mutations are observed by applying one, running the named test, recording its failure by name in the test's doc with the commit, and reverting. A `verify-mutation` run is not an observation.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:** T1 and T2 pass at the base and at head; each fails under its own mutation; every other kernel test passes.
- **Declared unchanged:**
  - `engine/tests/connection_reuse.rs`'s `dropping_the_dataset_closes_its_idle_connections` and `a_lease_in_flight_keeps_the_pool_alive_after_the_dataset_is_dropped`;
  - the close-races tests;
  - the close-dataset-unknown tests T1 and T2 (`kernel/src/skp.rs`);
  - `kernel/tests/end_to_end.rs`, `kernel/tests/skp_admission.rs`, `kernel/tests/session_end_event.rs`;
  - every non-doc line of `kernel/src/lib.rs`, byte for byte.
- **Invalidators:**
  - **I1 (stop, to the custodian):** a product path that opens under a name already present, other than through a handle collision, is found (H1).
  - **I2 (stop, invalid run):** T1 or T2 fails at the base. The replace path does not behave as read. Recorded as class 2.
  - **I3 (scope, the human):** round 33 rules the fix in.
    - Before this form is committed: the custodian folds in the consult's fix delta and records it as a custodian's edit.
    - After it is committed: the fix is its own PLAN node, depending on this one, and is not an amendment here.
  - **I4 (stop, S1 under the ruling):** a `Drop` reached from a replaced `Arc<Dataset>` is found to take, or wait on, the catalog lock.
  - **I5 (stop):** a stream-held `Arc<Dataset>` is found (§6 item 3), which would make §2 item 2 false.
  - **I6 (stop):** a declared-unchanged test fails.
  - **I7 (stop):** T1 or T2 needs timing, a thread or a hook.
- **Falsification:** after `open` or `open_cancellable` returns `Ok` on a replace, the old dataset's pool remains alive (no other holder, no lease); or a live stream holds an `Arc<Dataset>`; or the replaced value is shown to outlive the guard at the base.

## §6. Instruments
Assertions only:
1. Path equality, `names()`, and the `Weak` strong count.
2. The caller grep: `git grep -nE "\.open\(|\.open_cancellable\(" -- kernel/src frontends/shell/src-tauri/src protocol`, read for `Catalog` receivers (H1).
3. The holder grep: `git grep -n "Arc<Dataset>" -- engine/src kernel/src protocol frontends/shell/src-tauri/src`, read for stream-owned holders (I5).
4. `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify-mutation`, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings
- No new constant.
- **Size budget:** ≤ 120 changed lines, insertions plus deletions, over ≤ 2 files (`kernel/src/lib.rs`, `kernel/tests/catalog_replace.rs`).
  - Counting command: `git diff --numstat <merge-base>...<head> -- . ':!kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit.
  - An overrun is class 8, and this line is never edited to match.
  - Estimate: about 20 doc lines and 75 test lines.

## §8. Block-on-sight
1. Any change in `kernel/src/lib.rs` to a line that is not a `///` doc line.
2. Any diff under `engine/`, `protocol/`, `frontends/` or `docs/`, or to KNOWN-LIMITATIONS or SKP-V0.
3. A number, a duration word, or a `docs/08` reference in the note.
4. A claim that a product path replaces a name, or that a collision is impossible.
5. Any new item in product code; a test-only hook; a `cfg(test)` branch in product code.
6. A sleep, `recv_timeout`, spawned thread, poll loop or timeout in T1 or T2.
7. A test that copies the statement shape onto a local lock and is presented as proving the product.
8. Any `cfg(windows|unix|target_os)` in product code; a platform ignore on T1 or T2.
9. A declared-unchanged test's assertions edited.
10. A fixture name shared with another test.
11. A record calling a `verify-mutation` run an observation; a mutation without its commit.
12. A §7 overrun not recorded as class 8, or §7 edited; any code of a scope addition before its class-9 amendment.
13. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit or named without its commit id;
    - a bare self-line;
    - reproduced text without its path:line and hash;
    - a correction round without its superseded index.
14. A squash or rebase merge.

## §9. Gates
- **Architect:**
  - the Header's §21a reading;
  - §1's scope closure (the Err path, the last-reference condition, the lease case);
  - ADR-018 item 4 vocabulary; ADR-006;
  - the caller rule and the seam reading;
  - R1 to R6;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - T1 and T2 at the base and at head;
  - M1 and M2 observed;
  - §7 recounted;
  - §6 items 2 and 3 re-run.
- **Suites, green before either gate:**
  - `cargo test -p spatial-kernel` on Windows; `cargo clippy`;
  - `cargo fmt --check`, read as no new hunk in the touched files (the crate's existing drift, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md` Amendment 2 item 2), with 0 hunks in the new file;
  - `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify-mutation` and `verify:plan`, each with the tool's commit;
  - CI's `node --test` scripts suite;
  - branch CI read before gating.
- **Operator:** none. Nothing user-visible changes.

## §10. Amendments (opens empty, append-only; classes 1 to 9; each correction round ends with a superseded index)

### Amendment 1 — budget overrun, §7 not edited (class 8)

Budget overrun, §7 not edited. §7 declares at most 120 changed lines over at most 2 files. The final figure is 130 over 2 files at 53e1cf4, by §7's command with merge base d8544a0: `kernel/src/lib.rs` 18+3 and `kernel/tests/catalog_replace.rs` 109+0. The reason is the worker's report (`state/consults/2026-10-01-catalog-replace-note-worker-report-1.md`): formatting the new test file to 0 rustfmt hunks, as §9 requires, took it from 83 lines to 109, and the worker did not trim it to fit. The figure stays inside AUTONOMY.md §21c's bound, so the gating is unchanged.

### Amendment 2 — budget overrun at correction round 1's head, §7 not edited (class 8)

Written after correction round 1's head was seen (class 8). Budget overrun, §7 not edited. §7 declares at most 120 changed lines over at most 2 files. The final figure is 133 over 2 files at 4941e47, by §7's command with merge base d8544a0: `kernel/src/lib.rs` 21+3 and `kernel/tests/catalog_replace.rs` 109+0. The reason is correction round 1, the gate-1 architect's B1 and B2 (`state/consults/gates/2026-10-01-catalog-replace-note-gate1-architect.md`): the replace note's rewording adds three `///` lines. Amendment 1 (130 at 53e1cf4) was also written after its outcome was seen, though its first line does not say so (the gate-1 architect's N3).
