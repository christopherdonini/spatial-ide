# `data-plane-stream-registry-bound`: the data plane's `StreamRegistry` is bounded by a declared age and a declared count of terminal records — preregistration

## Header

- **Authority.** PLAN node `data-plane-stream-registry-bound`; RULED 2026-09-26 — question round 24, item 1, part (c). Paraphrase: (c) follows (b), and it is fixed with a time bound plus a declared count ceiling that mirrors the kernel's registry. It does not drop an entry at its terminal.
- **Evidence (not Authority).** `state/cloud/wave1/A5.md`, Finding A5-1 and its custodian fields (the Windows reproduction). The finding's reproducer is on branch `cloud/wave1-A5`, which is not on `main`. Nothing merges from that branch. This piece writes its own test file.
- **Drafted by** the architect agent on the custodian's brief of 2026-09-26. It was drafted read-only: no command was run. The files named in §0 were read at `main` `e562e9b` (nothing under `protocol/`, `kernel/`, `engine/` or `frontends/` changes from `e562e9b` to `522493a`, the main this record is committed on; checked by the custodian with `git diff --stat`).
- **Reference form.** Code is cited by symbol, documents by section, and the ledger by round and item. There are no line cites. A gate that needs a line pins it at a commit on `main`.
- **Committed before any code.** Once committed, this record is append-only. An amendment written after any outcome has been seen says so in its first line.
- **Branch.** `cut/data-plane-stream-registry-bound`, from `main`, after `data-plane-origin-non-ascii` (merged). Disjoint from `engine-source-change-watcher`'s files: `git diff --stat origin/main...cut/source-change-watcher -- protocol/data-plane` is empty at `522493a` and `c0ebab8`.
- **Gating.** Full (`AUTONOMY.md` §21a), for two reasons:
  - a property currently under test: `candidate_a.rs`'s `a_completed_stream_is_recorded_with_its_terminal_outcome`, and the registry reads in §2's seam table;
  - the size bound of §21c.

## §0. Disclosure

- **Read:**
  - docs/01 principles 7 and 8;
  - ADR-010 rule 6 (Accepted);
  - ADR-019's Status (Proposed, so it is not cited as authority);
  - `AUTONOMY.md` §21a–§21c;
  - `docs/PREREGISTRATION-TEMPLATE.md`;
  - `protocol/data-plane/ORIGIN-NON-ASCII-PREREGISTRATION.md` (the model for this form).
- **Code read:**
  - `protocol/data-plane/src/server.rs`: the ceilings and their compile-time floors, `StreamRegistry`, `serve`, `handle`, `terminal_and_drain`;
  - `protocol/data-plane/src/adapter_ws.rs`: `drive`, its reader task and the peer drain;
  - `protocol/data-plane/src/transport.rs`: `StreamState`, `Terminal`, `StreamId`;
  - `protocol/data-plane/src/wire.rs`: the `pub` tags and `payload_len`;
  - `protocol/data-plane/src/lib.rs`: the re-exports; `server` is a `pub mod`;
  - `protocol/data-plane/Cargo.toml`: `tokio-tungstenite` and `futures-util` are already dev-dependencies;
  - `protocol/data-plane/tests/candidate_a.rs`;
  - `kernel/src/skp.rs`: `TICKET_TTL`, `MAX_PENDING_TICKETS`, `TERMINAL_ENTRY_MAX_AGE`, `StreamRegistry`, `sweep_locked`, `cancel`, and the `tests` module's backdating tests;
  - `kernel/src/main.rs` (`serve`'s use);
  - `frontends/shell/src-tauri/src/lib.rs` (app setup, `serve`, `Box::leak`);
  - `kernel/tests/{end_to_end,concurrency_in_situ,slice_budgets,indexed_budgets}.rs`, at their registry reads.
- **The defect (paraphrase of Finding A5-1).** `record` and `record_terminal` push and never remove. The shell leaks its `RunningDataPlane` for the life of the process, so the registry grows by one entry per stream served.
- **Every reader of the registry in the workspace is a test.** No product code reads `snapshot`, `terminals`, `active` or `refusals`. The shell's app setup reads only `addr` and `session` from `RunningDataPlane`, and `kernel/src/main.rs` reads only `addr`, `launch_url` and `shutdown`. `active` has no reader at all.
- **The data plane's cancel reads nothing from this registry.** A CANCEL frame carries no stream id, because it is scoped to its connection. `drive`'s reader task observes it through its own `Arc<StreamState>` clone and its own `SourceCancel`. That task runs through the peer drain, and `record_terminal` runs only after `drive` returns, which is after the drain. The id-keyed late cancel, SKP `cancel` on a `StreamHandle`, is answered by the kernel's `StreamRegistry` and is not touched here (see Note 1).
- **Same shape elsewhere, out of scope:** none found in `protocol/transport-bakeoff` or `spikes/`. Neither is touched.
- No pilot, corpus or measurement was used. The 5 GB fixture is not read.

## §1. What this preregistration may and may not claim

- **May claim, once §4 passes:**
  - After any number of finished streams, the registry holds at most `MAX_TERMINAL_RECORDS` terminal records. Each record is a finished stream's `StreamState` together with its terminal. Every live entry is also held.
  - A live entry is never removed. A live entry is one that is recorded and whose terminal has not been recorded.
  - An entry is never removed by the call that records its own terminal.
  - A terminal record is retained until the first of two events:
    - it is older than `TERMINAL_RECORD_MAX_AGE` when a later `record` or `record_terminal` runs;
    - `MAX_TERMINAL_RECORDS` newer terminal records exist.
  - A CANCEL frame sent after the terminal frame, during the peer drain, is still observed by the producer. This was true before the fix and is unchanged by it.
- **May not claim:**
  - Any byte figure for an entry or for the registry. No memory is measured.
  - A count ceiling on live entries. They are bounded by the connection itself: by `MAX_CONCURRENT_STREAMS` while a stream holds its slot, and by `PEER_DRAIN_TIMEOUT` while it drains. The count of draining connections is not capped, and this piece does not cap it.
  - Anything about a handler that panics or is dropped at runtime shutdown before it reaches `record_terminal`.
  - That this registry answers any cancel.
  - Anything about the kernel's registry, A5-2, or wave 1's unproven observations.
  - Any performance number or docs/08 row.
- **Nothing else changes:**
  - no wire change (data-plane frames, SKP, MCP);
  - no new user-visible or operator-visible string;
  - no admission change: no stream is refused, delayed or queued because of the registry;
  - no operation-class change (ADR-006): this is producer-side instrument state, not an operation.
- **ADRs:** ADR-010 rule 6 is cited and none is edited. The ceiling on concurrent streams stays a refusal, and queuing stays the reserved ADR-014 question, as `MAX_CONCURRENT_STREAMS`'s doc states it.

## §2. The change, stated before it is applied

**The mirror, and where it departs:**

| Kernel `StreamRegistry` | Data-plane `StreamRegistry` (this piece) |
|---|---|
| `TICKET_TTL` ages out *live* pending tickets | None. A live stream is never pruned, because its connection bounds it (§1) |
| `MAX_PENDING_TICKETS`: new *live* work is refused | Already `MAX_CONCURRENT_STREAMS`: a refusal, unchanged |
| `TERMINAL_ENTRY_MAX_AGE`: terminal entries are aged out, swept on registry calls | `TERMINAL_RECORD_MAX_AGE`, the same value, pruned on `record` and `record_terminal` |
| No count ceiling on terminal entries | `MAX_TERMINAL_RECORDS` (the ruling's declared count ceiling): at the ceiling, the **oldest terminal record is evicted** |

**Evict, not refuse.** The kernel refuses only live work that holds a resource. It never refuses because of terminal bookkeeping, and it already evicts terminal entries (by age). Refusing a stream because an instrument record is full would do two harmful things. It would stall tiles for bookkeeping, against docs/01 principle 7. It would also make an instrument an admission policy, and admission policy is ADR-014's reserved question. Refusing to *record* instead would leave the newest stream unrecorded, and `snapshot().last()` would silently name an older stream, against principle 8. Eviction bounds memory and keeps both properties.

**`protocol/data-plane/src/server.rs`:**

1. **Two declared constants,** placed beside the existing ceilings (§7), each with a compile-time floor in the file's existing `const _: () = assert!(..)` form.
2. **`StreamRegistry`'s state.** It moves under **one** `Mutex`. That mutex holds two collections:
   - the recorded `Arc<StreamState>`s, in admission order;
   - the terminal records `(stream id, Terminal, ended_at: Instant)`, in the order their terminals were recorded.

   `refusals` stays an `AtomicU64` outside the mutex. The exact shape is the worker's choice.
3. **One prune, run under that lock at the end of `record` and of `record_terminal`, never on a read.** It does two things:
   - **Age:** it removes every terminal record whose `ended_at` is strictly older than `TERMINAL_RECORD_MAX_AGE` (the kernel's `>` comparison). Each removal takes the matching `StreamState` with it.
   - **Count:** while there are more than `MAX_TERMINAL_RECORDS` terminal records, it removes the record whose terminal was recorded earliest, and its `StreamState`.

   It never removes an entry that has no terminal record. The entry whose terminal `record_terminal` has just recorded is the newest, so given the floor it is never the one removed.
4. **Reads are unchanged in signature and order:**
   - `snapshot() -> Vec<Arc<StreamState>>` in admission order;
   - `terminals() -> Vec<(String, Terminal)>` in terminal order, with the `Instant` dropped;
   - `active()` and `refusals()` keep their bodies.

   Reads never prune. A read must not change the state it reports.
5. **Pruned values may drop under the guard.** Neither `StreamState` nor `Terminal` implements `Drop`, and neither reaches the registry. This is the kernel's entry-132 hazard, checked absent by reading `transport.rs`.
6. **`handle`'s `pump::spawn` `Err` arm.** This is the one path that records a stream and never records its terminal. After its `terminal_and_drain`, it records `Terminal::ProducerFailed` with the same detail string it already sends, computed once. Without this, that arm would leave a live entry for ever. No test reaches the arm without fault injection, which §8 forbids, so it is proved by reading: every return of `handle` after `record` passes through `record_terminal`.
7. **The struct doc** replaces its opening "Every stream this process has served" with its bound. It names both constants and states the following:
   - The data plane's cancel reads nothing here.
   - The readers are instruments and tests.
   - An idle process keeps up to `MAX_TERMINAL_RECORDS` records of any age until the next stream event. The count bound is what bounds memory; the age acts at stream events, as in the kernel.

   The citations are by section, with no line cites.

**`protocol/data-plane/tests/stream_registry_bound.rs` (new).** It holds §4's T1–T3. They run against the real `spatial_data_plane::serve` over loopback, with a `tokio_tungstenite` client, in the shape of `candidate_a.rs::connect_with`.
- Each stream's id is read from the real OPEN frame (`wire::TAG_OPEN`; the payload is the operation id and the stream id).
- The factory picks its source from the first byte of `OpenRequest.params`: either one small batch and then the end, or an endless source that honours its `SourceCancel`.
- Every wait is bounded by the file's own deadline constant, whose comment says it is a hang bound and not a claim.

**`server.rs`'s `#[cfg(test)] mod tests` (new module).** It holds T4 and T5, in the kernel's precedent shape: a timestamp is backdated under the registry's own lock (`skp.rs`'s `sweep_expired_reclaims_an_old_cancelled_before_redeem_entry`). The backdating uses `Instant::checked_sub(..).expect(..)`. There is no injectable clock and no test-only branch in product code.

**Seams:**

| Seam | Actual interface on `main` | What the consumer needs | Proof from the real shape |
|---|---|---|---|
| `handle` → `record` / `record_terminal` | private, same file; call sites unchanged except §2 item 6 | none beyond this piece | T1–T3 over a real socket |
| registry → `snapshot().last()` readers: `candidate_a.rs` (`a_cancel_control_frame_reaches_the_source_and_is_observed_producer_side`, `withholding_credit_bounds_producer_memory`); `kernel/tests/end_to_end.rs` (the two H2 tests, the H3 test); `slice_budgets.rs`, `indexed_budgets.rs` | `snapshot() -> Vec<Arc<StreamState>>`, unchanged | the newest stream's state while its connection is still open (it is live, and admitted last) | T2; existing suites |
| registry → `candidate_a.rs` `the_declared_concurrency_ceiling_refuses_rather_than_queues` | `snapshot().len()`, `refusals()` | 4 live entries visible; the counter unchanged | T2; existing test |
| registry → `candidate_a.rs` `a_completed_stream_is_recorded_with_its_terminal_outcome` | `terminals()` | empty while live; present after close (not dropped at the terminal) | T4; existing test |
| registry → `concurrency_in_situ.rs` `superseded_query_cancel_while_a_second_stream_continues` | `snapshot()`, `len() == 3`, `[1]` | admission order; 3 entries retained within one test | existing test |
| shell app setup, `kernel/src/main.rs` → `serve` | `RunningDataPlane.addr`, `.session`, `launch_url`, `shutdown` | never reads `registry` | none needed; declared unchanged |

**New `pub` items:** the two constants, and nothing else. Their product reader is the prune; their test readers are T1, T2, T4 and T5. They are `pub` in `server` in the same way as the crate's other ceilings, and they are not re-exported, so `lib.rs` is unchanged. No new method, option or callback is added.

## §3. Fixtures: outcomes declared in advance

There are no fixture files. The sources are synthetic, in the test file. "Finished" means the TERMINAL frame was received, the client closed, and the stream's id appears in `terminals()`.

| Row | Setup | Before the fix | After the fix |
|---|---|---|---|
| F1 | 200 finished streams, run one after another | 200 `StreamState`s and 200 terminal records (Finding A5-1, cloud and Windows) | exactly `MAX_TERMINAL_RECORDS` of each: the last `MAX_TERMINAL_RECORDS` opened, in order |
| F2 | 1 live stream (endless, 0 credit), then `MAX_TERMINAL_RECORDS + 8` finished streams, then the live one is cancelled and closed | `snapshot().len()` = `MAX_TERMINAL_RECORDS + 9` (predicted) | the live id is present throughout; `snapshot().len()` = `MAX_TERMINAL_RECORDS + 1` before its cancel; after its terminal, it is the newest terminal record |
| F3 | 1 stream completes; a CANCEL is sent after the TERMINAL frame, before close | the producer observes it (predicted) | the same; the recorded terminal stays `Completed` |
| F4 | a unit registry: one terminal record at its terminal, and one backdated to `TERMINAL_RECORD_MAX_AGE − 1 s` | not applicable (the new internal state) | retained after the next `record` |
| F5 | a unit registry: one terminal record backdated to `TERMINAL_RECORD_MAX_AGE + 1 s`, and one live entry recorded before it | not applicable | the terminal record and its state are pruned on the next `record`; the live entry is retained |

## §4. Tests, one mutation per new test

Each mutation is performed once on the branch, observed to fail the named test, reverted, and recorded above that test. `verify-mutation` verifies them as a pre-gate self-check.

- **T1** `the_registry_retains_at_most_the_declared_count_of_finished_streams` (F1; the finding's shape, made to pass). A test-file `const _: () = assert!(STREAMS > MAX_TERMINAL_RECORDS)` keeps it discriminating. Every stream is asserted `TERM_COMPLETED`, so none was refused. **Mutation:** the count prune is removed; only the age prune runs.
- **T2** `a_live_stream_is_never_pruned_at_the_count_ceiling` (F2). **Mutation:** the count prune evicts the oldest entry in admission order, live or terminal.
- **T3** `a_cancel_after_the_terminal_frame_is_still_observed_by_the_producer` (F3; the data plane's late cancel). **Mutation, outside the diff and reverted:** in `adapter_ws::drive`, the reader is aborted as soon as the terminal frame is sent, skipping the `PEER_DRAIN_TIMEOUT` wait.
- **T4** `a_terminal_record_survives_its_terminal_and_is_kept_within_its_declared_age` (F4; unit). **Mutation:** `record_terminal` removes the entry whose terminal it records. This is the drop at the terminal that the ruling forbids.
- **T5** `a_terminal_record_older_than_its_declared_age_is_pruned_on_the_next_record` (F5; unit). **Mutation:** the age prune is removed; only the count prune runs.

**Existing tests, unchanged and green:**
- every `candidate_a.rs` test in §2's seam table;
- `kernel/tests/end_to_end.rs` `h2_cancellation_is_observed_by_the_producer_inside_the_budget`, `h2_a_cancel_before_the_first_batch_still_stops_the_query` and `h3_a_consumer_that_withholds_credit_bounds_producer_memory`;
- `kernel/tests/concurrency_in_situ.rs` `superseded_query_cancel_while_a_second_stream_continues` and `the_admission_slot_is_released_when_the_stream_ends_not_when_the_peer_leaves`.

`slice_budgets.rs` and `indexed_budgets.rs` are `#[ignore]`d measurement harnesses and are not run. Their only registry read is `snapshot().last()` on the newest, live stream, and T2 covers that property.

**Test-first run.** The uncommitted working tree has the two constants and T1–T3, with the registry body unchanged:
- T1 fails: 200 ≠ `MAX_TERMINAL_RECORDS`.
- T2 fails on its count assertion.
- T3 passes.
- T4 and T5 have no pre-fix run, because they read the fix's internal state. Their proof is their mutations.

The fix and the tests then land in one commit.

## §5. Hypotheses · predictions · declared unchanged · invalidators · falsification

**Hypotheses:**
- **H1.** A client close after TERMINAL ends the peer drain promptly, so `record_terminal` runs within the test's deadline. Discriminator: `candidate_a.rs`'s `a_completed_stream_is_recorded_with_its_terminal_outcome`, and T1's per-stream wait.
- **H2.** With 0 credit, the endless source stays live until CANCEL. Discriminator: T2 observes its id without a terminal record while the other streams run. `withholding_credit_bounds_producer_memory` already relies on this.

**Predictions.** §3's outcome columns, and §4's test-first run. All existing tests stay green after the fix. A wrong prediction is a class-2 result and is never edited.

**Declared unchanged:**
- admission: `MAX_CONCURRENT_STREAMS`, `MAX_IDLE_CONNECTIONS`, the idle and crowded start timeouts, and `PEER_DRAIN_TIMEOUT`; the refusal paths and `refusals`;
- where `record` is called (at admission, after `pump::spawn` is attempted) and where `record_terminal` is called (after `drive`);
- `snapshot`, `terminals`, `active` and `refusals`: their signatures, their order semantics, and `active`'s body;
- `RunningDataPlane`, `serve`, `DataPlaneConfig`, and every `pub` signature;
- `adapter_ws.rs` (the reader task, the drain, the late-CANCEL observation), `transport.rs`, `pump.rs`, `session.rs`, `wire.rs`, `lib.rs`;
- the wire, SKP and MCP;
- `kernel/`, `frontends/`, `protocol/transport-bakeoff`, `spikes/`, every ADR, and `protocol/data-plane/README.md`.

**Invalidators** (the piece stops and returns to the architect; a policy question goes to the human):
- A reader in the workspace needs a record beyond `MAX_TERMINAL_RECORDS` terminals back, or older than `TERMINAL_RECORD_MAX_AGE`. None was found at the read commit.
- A product reader of the registry lands on `main` before merge.
- The bound needs a `pub` signature change, a new `pub` item beyond §2's two constants, an edit to a file outside §7, a dependency, or a change to `adapter_ws`.
- An existing test changes outcome.
- H1 or H2 is false. If so, T1–T3 prove nothing as written.

**Falsification:** any one of these, after the fix:
- more than `MAX_TERMINAL_RECORDS` terminal records, or finished-stream states, are retained after more than `MAX_TERMINAL_RECORDS` finished streams;
- a live entry is removed;
- an entry is removed by its own `record_terminal`;
- a terminal record younger than `TERMINAL_RECORD_MAX_AGE` is removed while fewer than `MAX_TERMINAL_RECORDS` newer terminal records exist;
- a CANCEL during the drain is no longer observed.

## §6. Instruments

Assertions only: entry counts, stream ids and their order, `is_cancelled()`, and terminal codes. There is no measurement, no docs/08 figure, and no new counter or accessor.

## §7. Declared values and ceilings

- **`MAX_TERMINAL_RECORDS: usize = 64`** (`server.rs`). It bounds the finished streams whose state and terminal are retained. Its floor is `MAX_TERMINAL_RECORDS >= MAX_CONCURRENT_STREAMS`, so a full admission window's streams are all retained when they end. The value is declared, not derived (ADR-010 rule 6), and is set below the finding's 200 so that T1 discriminates.
- **`TERMINAL_RECORD_MAX_AGE: Duration = Duration::from_secs(300)`** (`server.rs`). It bounds how long a terminal record survives a later stream event. It has the same value as the kernel's `TERMINAL_ENTRY_MAX_AGE` but is declared independently, because the data plane does not depend on the kernel.
  - Its floor is `TERMINAL_RECORD_MAX_AGE.as_secs() >= 1`. An age of zero would prune an entry at its own terminal.
  - Its doc states the trade: after this age, a finished stream's state is no longer readable through `snapshot()`, and no cancel reads it.
  - It is a declared constant, not a measurement.
- **Pinning.** Each constant is pinned by its declaration site, its compile-time floor, and T1, T2, T4 and T5, which reference it by name, never by literal. The data plane has no `ceilings.json`, and none is created.
- **Line budget:** at most 450 insertions plus deletions over non-generated code and tests, counted by §21c's rule, with this preregistration excluded. Planning figures:
  - `server.rs`: constants, registry and doc about 130, `handle`'s arm about 6, the unit tests T4–T5 about 70;
  - `tests/stream_registry_bound.rs`: about 240.
- **File ceiling:** 2 code and test files, `protocol/data-plane/src/server.rs` and `protocol/data-plane/tests/stream_registry_bound.rs`. Beyond those, only this preregistration, the custodian's `PLAN.yaml`, and the generated set.
- **Time:** PLAN `budget_minutes` 120. Planning figures:

  | Step | Minutes |
  |---|---|
  | `server.rs`: constants, registry, prune, doc and arm | 35 |
  | `server.rs`: T4–T5 | 15 |
  | `tests/stream_registry_bound.rs`: T1–T3 and the test-first run | 35 |
  | five mutations run and recorded | 20 |
  | suites and pre-gate self-check | 15 |

## §8. Block-on-sight (each checked separately)

1. An entry removed by the `record_terminal` call that records its own terminal.
2. A live entry (one with no terminal record) removed by any path.
3. A stream refused, delayed or queued because of the registry; any change to admission.
4. Pruning on a read path: `snapshot`, `terminals`, `active` or `refusals`.
5. A change to the signature or order semantics of `snapshot`, `terminals`, `active` or `refusals`.
6. A new `pub` item beyond §7's two constants: a `prune`, a clock hook, a setter, or a re-export.
7. An injectable clock, a `#[cfg(test)]` branch in the registry's product logic, or fault injection in `handle`.
8. A duration presented as a claim: a figure other than a declared constant's value, a p50/p95, or a "prunes within" statement. A test deadline not marked as a hang bound.
9. Any statement that this registry answers a cancel, or that the ruling's late cancel reaches it.
10. A test written against an imagined client instead of the real `serve` over a real socket, or stream ids not read from the real OPEN frame (the seam rule).
11. Any diff outside §7's files, including `adapter_ws.rs`, `lib.rs`, `transport.rs`, `kernel/`, `frontends/` and the README.
12. Any change to `Cargo.toml` or `Cargo.lock`, or a new dependency.
13. Any edit to an existing test.
14. A new user-visible or operator-visible string. §2 item 6 reuses the detail string that arm already sends.
15. A bare line cite in a code comment or in this record; any byte figure for the registry.

## §9. Gates

- **Architect** (full gating, §21a):
  - §8 item by item;
  - ADR-010 rule 6; docs/01 principles 7 and 8;
  - §2's seam table against each reader's actual interface;
  - the caller rule for the two constants;
  - §2 item 6 by reading;
  - every discharge claim resolved.
- **Reviewer:**
  - the full diff;
  - `git diff --stat origin/main...HEAD` shows only §7's files;
  - each §4 mutation's recorded run, T3's reverted mutation in `adapter_ws.rs` included;
  - T1's order assertion and T2's live-id assertion;
  - no `pub` signature change;
  - every discharge claim resolved;
  - any hash recomputed.
- **Suites,** green before either gate, each result naming its commit:
  - `cargo test -p spatial-data-plane` and `cargo test -p spatial-kernel`;
  - `cargo fmt --check`, and `cargo clippy -p spatial-data-plane --all-targets` as CI runs it;
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`;
  - `verify-quotes.mjs` (a floor), `verify-cites.mjs` and `verify-test-claims.mjs`;
  - `verify-mutation.mjs --base origin/main --head HEAD` (all five new tests named);
  - `verify.mjs --offline`.
- **E2E: none.** T1–T3 are the end-to-end proof from the real shape: the real `serve`, a real loopback socket, a real WebSocket client. The shell never reads the registry, and its `pub` surface is unchanged.
- **Operator:** none. No walkthrough row, no felt verdict.

## §10. Amendments

*(Opens empty and is append-only. Results are recorded in the closing amendment as references and hashes only, under the record cap.)*

### Amendment 1 — 2026-09-26, written after the worker's results were seen: the closing record

References and hashes only (the record cap, 2026-09-18). Each row names its template class. Each hash is `git show <rev>:<path> | sed -n '<a>,<b>p' | sha256sum` over LF bytes.

1. **Class 1, the commits:** `2b99551` (the fix and T1–T5, one commit, per §4) and `e061cb1` (the mutation records); `state/consults/2026-09-26-stream-registry-bound-worker-report.md:7-9 @ 370b2ba sha256:e7170bef7438d0e4bd856f70acbded21c70dd7561e9ad5e164e1274fac34ab19`.
2. **Class 1, the test-first run against §4:** `state/consults/2026-09-26-stream-registry-bound-worker-report.md:11 @ 370b2ba sha256:3fe69c2e2ae585df263b62d05714154f2743098c1f28eaf2580ba07723c584fb`.
3. **Class 1, §4's five mutations:** the worker's runs, recorded above T1–T5 at `e061cb1`, are the observation of record; `state/consults/2026-09-26-stream-registry-bound-worker-report.md:25-32 @ 370b2ba sha256:2fb374370363e1f5f98ba7e27cb2886dada7553febb8c3131f014a2afc70bdc1`. T4's mutation fails T4 by name at its backdating lookup, before its retention assertion, which is therefore proven on the shipped build by assertion only.
4. **Class 2, §7's line budget, §7 not edited** (round 23, item 4, O7): declared at most 450; final 570, `git diff --numstat 522493a...e061cb1 -- protocol/data-plane/src/server.rs protocol/data-plane/tests/stream_registry_bound.rs` (243 and 327); Scope unchanged.
5. **Class 1, §9's `cargo fmt --check`:** not clean at `522493a` (seven files of the crate, `server.rs` among them) and at `e061cb1` (the same seven and the new test file); `.github/workflows/product-ci-rust.yml` at `370b2ba` runs no `cargo fmt` and no `cargo clippy` step. The worker's clippy run and the other suites: `state/consults/2026-09-26-stream-registry-bound-worker-report.md:13-23 @ 370b2ba sha256:675840a52494234b8993cb8a3374fba4f62d2ea8d4c09a84e92e55f514b2a576`.

### Amendment 2 — 2026-09-26, record correction after the gates, attempt 1 (class 3)

1. Amendment 1 row 5's `cargo fmt --check` results are the custodian's runs of `cargo fmt -p spatial-data-plane -- --check` under rustfmt 1.9.0-stable (8bab26f4f6 2026-07-14), at `522493a` and at `e061cb1` (round 15 (c)).
2. The five mutation excerpts' panic locations are qualified at `8ed5228`: T1–T3's line numbers are the test file's at `2b99551`, before the records; T4's and T5's are the mutated tree's (§8 item 15).

Superseded: nothing; row 5 gains its tool, and the excerpts their line-number basis.
