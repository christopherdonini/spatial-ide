# Preregistration: a signal recorded before a ChecksOnly arm outcome (`watch-grandparent-spawn-signal`)

*File: `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`.*

## Header

- **Authority.** PLAN node `watch-grandparent-spawn-signal`, generation 1, placed by question round 31, item 1 (RULED 2026-09-30). Drafting by the architect: question round 43, item 2 (RULED 2026-10-03). Bound by the watcher's rules as filed: `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2a (failure rule) and §2b (Open and admission), as superseded in part by `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`'s class-1 amendment. Nothing is amended: no ADR, no SKP-V0 text, and neither of those two preregistrations.
- **Drafted by** the architect agent on the custodian's brief, reading main at 38bb2d63. Code cites are pinned at 38bb2d63, a main commit; self-references are by section and item.
- **Committed on main before any code** (§8 item 1).
- **Append-only once committed.** An amendment written after any outcome has been seen says so in its first line and states what it touches or invalidates. Classes 1 to 9 of `docs/PREREGISTRATION-TEMPLATE.md`.

## §0. Disclosure

1. **Source (evidence, not Authority; round 14's distinction):** the watcher's gate-2 reviewer, Suggestions, S1, `state/consults/2026-09-26-source-watcher-gate2-reviewer.md:173 @ 38bb2d63 sha256:feeb76ca7ad1390609c242067351150d631f100380e5cbe2e21322f817790fa2`. Its line numbers are at 68f5c56 and are not reused. Declared out of `kernel-generation-close-races` by that piece's §0 item 5, `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:67 @ 38bb2d63 sha256:9a8ac8f2b2f77685c03d8169bddbad788809d26cbd5804053e8fcc078e0c017c`.
2. **The defect at 38bb2d63 (read, not run):**
   - `arm` spawns P's thread, and P's first read is pending when the handshake returns, before G is touched: `engine/src/watch.rs:649-666 @ 38bb2d63 sha256:0db962a13fbfa55ac233f7ddeb5950e7204532f822a07d2103cc5d880a9e5b84`.
   - G has three failure returns, each dropping `SourceWatch` (cancel, join, close: `engine/src/watch.rs:484-510 @ 38bb2d63 sha256:29e320c493f9a252013de9dc37e5ab070206d0fe05ea7f5c64316de91f852009`) and returning `ChecksOnly`. They are the open at `engine/src/watch.rs:681-691 @ 38bb2d63 sha256:ff205d18f337132a1a3431428bbebf6b9d2aa23a688821450a7311dbadcf9a2a`, and the spawn and the handshake at `engine/src/watch.rs:693-707 @ 38bb2d63 sha256:de9c4b2c54abaf017209f6a7bc96729d77927d3537bdd6bb23ffaf50d7803fe2`.
   - Between the two, P's thread can call the sink: `engine/src/watch.rs:330-357 @ 38bb2d63 sha256:2eb19ea10c440feec1c7c07ec947511cef5c00f1b1a96fa1becc64f29ff21d28`.
   - The kernel's sink records a pre-admission signal in the latch: `kernel/src/skp.rs:1130-1137 @ 38bb2d63 sha256:fd93195661072061145d64af4605105707da3fbe5cdcdd4642d8c18ffa5495b6`.
   - The `ChecksOnly` arm mints, admits and stores the `OpenRecord` without reading the latch: `kernel/src/skp.rs:1258-1276 @ 38bb2d63 sha256:a9e2edb1ca9718d9141e8e046637a31aa1997d8490cf11dcf746794b676c5a88`.
   - The `Watching` arm refuses on a recorded signal: `kernel/src/skp.rs:1203-1239 @ 38bb2d63 sha256:2cac0db4c39b826d35dd883e97be3db30cda55552c3fc82eb73d1c5a29e80386`.
3. **History.** At 68f5c56 only G's spawn could fail after P's thread had started, because every read was issued before any thread spawned (`engine/SOURCE-WATCHER-PREREGISTRATION.md:88 @ 38bb2d63 sha256:fe47b1410d43351e2e9740f831ac28cb1247aeb2f40e2ccd8a6d3ecdc301ea18`). `engine/WATCHER-FIRST-READ-PREREGISTRATION.md:13 @ 38bb2d63 sha256:6c83368c6a52a57fed746fd9cbb59799f0b1b9661ee01ba9a1c4edac88e201db` and `engine/WATCHER-FIRST-READ-PREREGISTRATION.md:16 @ 38bb2d63 sha256:c5eb2f9b6f3c9d9a1dbaac42816a41ebbab1e70e4c9bc526afa1266b920a3f15` moved P's spawn ahead of G. The window now covers all three G failure returns. The kernel fix below does not depend on which one fired.
4. **Readings, for the gates.**
   - **(a)** §2b's admission step 1 (`engine/SOURCE-WATCHER-PREREGISTRATION.md:149 @ 38bb2d63 sha256:aef2aac81d66c47753a316568686c5257af2989e5f14f62f0348d2aa07d2342c`) names no coverage condition. This piece reads it as binding on every arm outcome. The code at 38bb2d63 applies it to `Watching` only.
   - **(b) Considered and rejected: admit, and make the discard explicit.** Every sink call precedes `arm`'s return, because the product joins P before returning, so a recorded signal precedes the descriptor read in `Dataset::open_inner`. That makes admitting defensible. It is rejected for three reasons:
     - it would drop a delivered engine fact without trace (docs/01 principle 8);
     - the signal is evidence of a write in progress at open time;
     - one admission rule for both outcomes is smaller than two.
   - **(c) Engine interface.** The kernel was written as if `ChecksOnly` meant no sink call. The doc on `ArmOutcome::ChecksOnly` (`engine/src/watch.rs:56-59 @ 38bb2d63 sha256:4bb4577fdf2e211ceba8e5d9b7785582c0162cf03a66e5fd7ddbee4a710030d2`) does not say otherwise. §2a adds the engine fact; the consequence stays in the kernel (the operator-visible-text rule, round 7).
5. **Hypothesis H1.** At the base, GS1 and GS2 fail at their `expect_err`: the open returns `Ok`. Discriminator: §5's P-1 run.
6. **Fixture-drive confound: none.** Nothing is measured, and no 5 GB fixture is read.

## §1. What this may and may not claim

- **May claim:**
  - (i) A signal recorded in the latch before a `ChecksOnly` arm outcome refuses the open: a `Change` as `engine.source_changed`, a `CoverageLost` as `engine.source_coverage_lost`. This is the same mapping and the same detail strings as the `Watching` arm.
  - (ii) Such a refused open leaves no catalog entry and emits no event.
  - (iii) A `ChecksOnly` outcome with no recorded signal admits exactly as at the base (K8 unchanged).
- **May not claim:**
  - that the race was reproduced on real Windows. There is no product interposition point between P's handshake and G's arming, and a test-only hook would be a code path with no product caller;
  - any timing, latency, `docs/08` row or OS delivery claim (ADR-035 Consequences; ADR-018);
  - the no-generation clause for a refused open. The accessor it needs would be a test-only `pub` item, the K6 precedent;
  - anything about the shell.
- **Wire change: none.** `skp/0.5`'s codes, members, literal and event are unchanged. `protocol/` and `frontends/` diffs are empty.
- **Operation classes: unchanged** (ADR-006). The refused open removes its catalog entry exactly as the `Watching` refusal does.
- **Cited, none amended:** ADR-035, ADR-018, ADR-006, ADR-010 rule 6.
- **Seam.** The diff crosses `spatial_engine::watch`'s `SourceWatchArm::arm` → `ArmOutcome` and `WatchSink` → `SkpHost::open_dataset`.
  - The consuming side's actual interface is the one quoted in §0 item 2: the sink may be called before `ChecksOnly` is returned, and every such call returns before `arm` does.
  - The end-to-end proof drives a real `SkpHost::open_dataset` through a test implementor of the real `SourceWatchArm` trait. The implementor reproduces that ordering: the sink is called inside `arm`, then `ChecksOnly` is returned. This is the precedent of the K6 and K15 tests.
  - The gate checks this reading.

## §2. The change

### 2a. Engine, documentation only: `engine/src/watch.rs`

- `ArmOutcome::ChecksOnly`'s doc gains one engine fact. A watch thread started before a later arming step failed may already have delivered a signal to the sink. Every such delivery returns before `arm` does.
- No code, `cfg`, `pub` item or reason text changes.

### 2b. Kernel: `kernel/src/skp.rs`, the `ChecksOnly` arm of `SkpHost::open_dataset`

- Under the latch guard it already takes, read `PreAdmission { recorded }`.
- **On `Some(signal)`:**
  - drop the guard, then remove the catalog entry (the `Watching` refusal's order: latch released before `catalog.remove`);
  - return `Err(error_of(&engine_error_of_pre_admission_signal(signal)))`;
  - mint no `SessionRef`, call no `mint_for_open`, leave the latch `PreAdmission`, store no `OpenRecord`.
- **On `None`:** the body at 38bb2d63, unchanged.
- One comment, the owner's consequence, names this arm's refusal and points to §2b step 1 by section.
- The `Watching` arm, the sink closure, `engine_error_of_pre_admission_signal` and every string are byte-unchanged.

### 2c. Test plumbing: `kernel/tests/injected_watch/mod.rs`

- `InjectedArm::arm`, for a path marked checks-only: fire and remove any signal queued by `fire_on_next_arm` first, then return `ChecksOnly`.
- This is the product's ordering (§0 item 2). No product item changes.

### 2d. Portability (R3; `state/directives/PORTABILITY-2026-09-30.md:49-54 @ 38bb2d63 sha256:60f4aa60c2364c5acc141be1a32c0d23a3b38f2a9df5d03d40c51cef44bf9959`)

- **Owning boundary:** file watching, `engine/src/watch.rs` (R2 table).
- **Windows: supported.** The refusal is reachable in the product through the three G failure returns.
- **macOS and Linux: explicitly reduced, unchanged.** `PlatformWatch::arm` returns `ChecksOnly` and never calls the sink (`engine/src/watch.rs:90-99 @ 38bb2d63 sha256:9dbd93e14888fb00852e619fcf9a87df4870b3b980c565be92ca349bc6794791`), so the new branch is unreachable there in the product. KNOWN-LIMITATIONS 24 is unchanged.
- **R1:** one admission rule on every platform.
- **R2 and R4:** no new `cfg` in product code. The kernel change is platform-neutral.
- **Tests per platform:**
  - GS1 and GS2 are Tier 1 and platform-neutral. They run on product-ci-rust's Windows and Linux entries (L1, R5; nothing claimed at L2 or L3). macOS has no entry until PORT-2.
  - The two Windows-only engine unit tests that port-1 recorded under I7 (`PORT-1-LINUX-L1-PREREGISTRATION.md:380-384 @ 38bb2d63 sha256:a7fe2e0b5a2c3ecccd80feefc55407c512a87a3c4ea971c9599eb7a9b23bf780`) are untouched. They stay compile-outs inside the boundary.
  - No new ignore and no new compile-out (R6).
- **Deferrals:** none.

## §3. Fixtures

| Fixture | Use | Predicted |
|---|---|---|
| `write_geoparquet` output in `target/fixtures/source-watch-ordering/` (that file's `fixture` helper) | GS1, GS2 | as §4 |

## §4. Tests and mutations (all in `kernel/tests/source_watch_ordering.rs`)

| Test | Asserts | Mutation, failing it by name |
|---|---|---|
| GS1 `a_signal_recorded_before_a_checks_only_outcome_refuses_the_open` | path marked checks-only, `Change` queued: `open_dataset` is `Err` with code `engine.source_changed`; `host.catalog().names()` empty; no event within a bounded `recv_timeout`; a second open of the path (still checks-only, nothing queued) succeeds and `describe` reports `CoverageState::ChecksOnly` | in the `ChecksOnly` arm, skip the latch read and admit unconditionally (the 38bb2d63 body): the open returns `Ok`, failing at `expect_err` |
| GS2 `a_coverage_loss_recorded_before_a_checks_only_outcome_refuses_with_its_own_code` | as GS1, with `CoverageLost` queued: code `engine.source_coverage_lost` | in the `ChecksOnly` arm's refusal, map every recorded signal to `EngineError::SourceChanged`: the code assertion fails, and GS1 stays green |

- Each test carries a `RECORDED MUTATION:` doc and a `// Mutation: see …` line, in the file's convention.
- A mutation is observed by applying it, running the named test, recording its failure by name with the commit, and reverting it. A `verify-mutation` run is never called an observation (round 25, item 2 (c)).
- Unchanged and green: K6 `a_signal_between_arming_and_admission_refuses_the_open`, K8 `an_unwatchable_source_opens_checks_only_and_describe_says_so`, and every Tier-2 adapter test.

## §5. Predictions · declared unchanged · invalidators · falsification

- **Predictions:**
  - **P-1 (H1):** with only §2c and §4 applied over the base, GS1 and GS2 each fail at `expect_err`. The worker records the run and its commit.
  - **P-2:** after §2b, both pass.
  - **P-3:** on each CI entry, the workspace `--list` gains exactly GS1 and GS2, and `--list --ignored` is unchanged.
- **Declared unchanged:**
  - `engine/src/watch.rs` outside the one doc comment;
  - the `Watching` arm, the sink closure, `LatchState` and `engine_error_of_pre_admission_signal`;
  - K6 and K8 byte-unchanged;
  - SKP-V0, ADR-035, KNOWN-LIMITATIONS;
  - the cfg-boundary check's site count, base against head.
- **Invalidators (each stops the piece, reported to the custodian):**
  - **I1:** GS1 passes at the base.
  - **I2:** the fix needs a change to the `Watching` arm, the sink closure, a string, or a new `pub` item.
  - **I3:** a read of `engine/src/watch.rs` at the base finds a sink call that can follow a `ChecksOnly` return, which falsifies §1's seam reading.
  - **I4:** a product `SourceWatchArm` implementor other than `PlatformWatch` is found.
- **Falsification:** §0 item 4(a)'s reading is ruled wrong by a gate or the human.

## §6. Instruments

Assertions only: typed refusal codes, catalog names, event absence and coverage state. No measurement.

## §7. Declared values and ceilings

- **No constant** is added or changed.
- **Budget** (a class-8 overrun is recorded against this line, and §7 is not edited): at most 160 insertions plus deletions, over at most 4 files of non-generated code and tests (`kernel/src/skp.rs`, `engine/src/watch.rs`, `kernel/tests/injected_watch/mod.rs`, `kernel/tests/source_watch_ordering.rs`). Counted by `git diff --numstat origin/main...HEAD`, excluding this form, `*.md`, `state/**`, `PLAN.yaml`, `CUSTODIAN-QUEUE.*`, `site/**` and lockfiles.

## §8. Block-on-sight

1. Code before this form is on main.
2. A new or changed wire code, member, literal, detail string or `Display` string.
3. Any `engine/src/watch.rs` change beyond §2a's doc sentence, or a new `cfg` anywhere in product code.
4. A new `pub` item, option, callback or test-only code path in product code (the caller rule).
5. The `Watching` arm, the sink closure, K6 or K8 edited.
6. A refused open that leaves a catalog entry or an `OpenRecord`, mints a `SessionRef`, or emits an event.
7. A mutation recorded as observed on the strength of a `verify-mutation` run.
8. A §7 overrun not recorded as class 8, or §7 edited.
9. Any diff under `protocol/`, `frontends/` or `renderer/`.

## §9. Gates

- **Full gating:** `AUTONOMY.md:315-332 @ 38bb2d63 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3` (a stated guarantee: §2b admission) and `AUTONOMY.md:347-355 @ 38bb2d63 sha256:8af13ef9b286c6b0b7f5ac1381434cba61397d02565af952e23d69afa818d10b` (new user-visible behaviour). Round 25, item 2 (e): full form from dispatch.
- **Architect:**
  - §8 item by item;
  - §0 item 4's readings;
  - the §1 seam reading against `engine/src/watch.rs` at the reviewed commit;
  - docs/01 principle 8;
  - R1 to R6 against §2d.
- **Reviewer:** the full diff, §4's mutations observed by name, §5's P-1 record.
- **Suites:**
  - `cargo test --workspace` green on product-ci-rust's Windows and Linux entries;
  - `verify-plan`, `verify-cites`, `verify-quotes`, `verify-mutation` and `verify-test-claims` green;
  - the `node --test` scripts suite green.
- **Operator:** none. No shell change, and the race is not operator-reproducible.
- **Owner's index:** the PR edits `kernel/README.md`'s Owner's index (pointer under Watcher arming and admission; the module's preregistration list; Last verified at). `engine/README.md` is unchanged, because no pointer or pinning test of its own changes.

## §10. Amendments (opens empty, append-only; classes 1 to 9; each correction round ends with a superseded index)
