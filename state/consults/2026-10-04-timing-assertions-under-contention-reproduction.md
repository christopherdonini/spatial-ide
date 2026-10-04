# Phase R reproduction: timing-assertions-under-contention (scratch observations, not tests of record)
# (PLAN node timing-assertions-under-contention; piece tag node:timing-assertions-under-contention@g1)

File: state/consults/2026-10-04-timing-assertions-under-contention-reproduction.md
Form run: kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md, Phase R (section 2), on main 201f833e.
Run by: the tester agent (agent definition: tester, model sonnet). The model I observe myself running as: Sonnet 5.5 (claude-sonnet-5-5). No model override. No context handoff.
Authority for the observations: scratch only. Nothing here is a test of record, a docs/08 measurement or a verdict (form section 6). Every printed cancellation figure names its pair of instants.

## 0. Summary (every sentence below is resolved against the steps and the run logs in section 10)

- S1. The tree check `git diff --stat 61f7e64b 201f833e -- kernel/src kernel/tests engine protocol` is empty; every variant ran on 201f833e (detached) plus an uncommitted scratch diff that was reverted.
- S2. R-1: 20 of 20 pass alone. R-2: 20 of 20 pass under L1, 0 failures; the prediction of at least 1 failure is missed (a class-2 recorded result under section 5).
- S3. R-3 (instrumented, alone): 20 of 20 runs show TERM_CANCELLED, 0 batches, observed_at present and >= sent_at, CANCELLATION_REQUESTED present and registry_empty false; PRODUCER_CANCELLED present in 18 of 20 (no prediction).
- S4. R-4: the first attempt is VOID as a row (L1 exited at 22:49:39.643 during its run 9, after 8 in-life runs); the re-run under L2 shows the four structural properties in 20 of 20, registry_empty true in 8 and false in 12, client pre-send to adapter receipt at or over 100 ms in 0 of 20 (largest 43.529 ms, in a registry_empty true run).
- S5. R-5 (alone): 20 of 20 under 100 ms, the largest cancel_requested to cancel_observed 3.5 us, both stamps present, batches_after_cancel 0 in every run.
- S6. R-6 (under L1): both stamps present and batches_after_cancel 0 in 20 of 20; cancel_requested to cancel_observed at or over 100 ms in 0 of 20 (largest 87.9 us); the reported, unbudgeted observed to terminal received term was at or over 100 ms in 11 of 20.
- S7. R-7 (whole slice binary, under L1): 5 of 5 runs pass, 22 tests each; no failing line to record.
- S8. Routing: STOP not triggered, W not triggered, C not triggered; no node arises from Phase R. Deciding rows: R-1 to R-4 (STOP), R-4 (W and C: no run at or over 100 ms).
- S9. Loaders: L1 2026-10-04T22:32:32.429Z to 22:49:39.643Z, L2 22:53:57.828Z to 23:11:12.632Z, both rc=0; 16 logical cores; both load directories deleted.
- S10. End state: every scratch edit reverted, `git status --porcelain` empty at 201f833e, no cargo, rustc or test process left running.

## 1. Where, at what commit, and the tree check

- Worktree: C:/dev/wt/tauc-r, detached at 201f833ec6765d9b1c0b624f2601d67b60cf4f69 (`git rev-parse HEAD`). `git status --porcelain` was empty before the first build and is empty at the end (section 9).
- Test runs used CARGO_TARGET_DIR=D:/wt-targets/tauc-r (cold build; the kernel end_to_end test binary finished building at about 22:18Z and the engine slice test binary at 22:31:03Z, from build0.start 22:04:47Z).
- No commit was made anywhere. "Commit" for every variant below is the base commit 201f833ec6765d9b1c0b624f2601d67b60cf4f69 plus the uncommitted scratch diff shown, which was reverted with `git checkout -- <file>` after its runs.
- Logical core count: 16 (`nproc` and `$NUMBER_OF_PROCESSORS` both printed 16).

Tree check, form section 2: `git diff --stat 61f7e64b 201f833e -- kernel/src kernel/tests engine protocol`, run in the worktree twice (at the start, 22:04Z, and again after all variants were reverted):

```
$ git diff --stat 61f7e64b 201f833e -- kernel/src kernel/tests engine protocol
(no output; rc=0)
```

The diff is empty, so the code tree of the Phase R commit (201f833e) equals the 61f7e64b tree the form pins; the question of which is authoritative does not arise. No invalidator of section 5 ("a Phase R commit whose code tree differs from 61f7e64b") applies.

## 2. The load L, the loaders, and what "inside the loader life" means here

L = `cargo build --release -p spatial-engine` run from the worktree in a fresh, empty CARGO_TARGET_DIR. Times from `date -u` in the command that ran the loader; the loader exit code is the build's.

| loader | target directory | start (UTC) | exit (UTC) | rc | deleted after use |
|---|---|---|---|---|---|
| L1 | D:/wt-targets/timing-load-1 | 2026-10-04T22:32:32.429Z | 2026-10-04T22:49:39.643Z | 0 (release build finished in 17m 07s) | yes (`rm -rf`; D:/wt-targets listing afterwards has no timing-load-* entry) |
| L2 | D:/wt-targets/timing-load-2 | 2026-10-04T22:53:57.828Z | 2026-10-04T23:11:12.632Z | 0 (release build finished in 17m 14s) | yes (same check) |

Both directories did not exist before their loader started: an `ls` of each, run immediately before its loader, printed "No such file or directory".

Window check per loaded variant (first start and last end are the `date -u` stamps printed by the run loop; per-run end times in the tables below are the log files' mtimes, converted to UTC, and agree with the loop's printed end stamps to within 0.6 s, the larger gaps being under load, where launching `date` itself is slow):

| row | first run start (UTC) | last run end (UTC) | loader | inside the loader life? |
|---|---|---|---|---|
| R-2 | 22:32:39.586 | 22:37:30.093 | L1 (22:32:32.429 to 22:49:39.643) | yes, all 20 |
| R-6 | 22:39:01.053 | 22:45:30.778 | L1 | yes, all 20 |
| R-7 | 22:47:21.198 | 22:47:58.465 | L1 | yes, all 5 |
| R-4, first attempt | 22:48:42.082 | 22:50:35.857 | L1 | NO as a row: run 9 started 22:49:36.662 and ended 22:49:43.346, straddling L1's exit at 22:49:39.643; runs 10 to 20 started after run 9 ended, so after the exit. The row is VOID. Runs 1 to 8 ended by 22:49:36.483, inside the life. |
| R-4b (the R-4 row, re-run) | 22:54:06.015 | 23:00:04.239 | L2 (22:53:57.828 to 23:11:12.632) | yes, all 20 |
| R-1, R-3, R-5 | (alone rows; no loader running. R-1 ended 22:32:18.832, before L1 started 22:32:32.429. R-3 22:50:58.890 to 22:52:27.707 and R-5 22:52:45.952 to 22:53:36.321 both fall after L1's exit and before L2's start.) | | none | n/a |

The first R-4 attempt was void as a row, so the loader was restarted in a new empty directory (L2) and the whole R-4 row of 20 was re-run (R-4b). The R-4 row for the results in section 6 is R-4b. The eight in-life runs of the void first attempt are kept as supplementary observations, labelled as such.

I did not control other activity on the machine (the custodian's live recorder, other sessions). "Alone" here means no loader of mine was running and no cargo, rustc or test process I started other than the one run.

## 3. Each variant: the applied diff, the commit, and which edit it was built from

All variants applied to 201f833ec6765d9b1c0b624f2601d67b60cf4f69 (detached HEAD), none committed.

- R-1 (h2_a alone), R-2 (h2_a under L), R-7 (slice whole binary under L): no diff (`git status --porcelain` empty while they ran; R-1 and R-2 on the freshly built tree, R-7 after the R-5/R-6 slice edit was reverted and `cargo test -p spatial-engine --test slice --no-run` rebuilt it).
- R-3 and R-4/R-4b: one diff, kernel/tests/end_to_end.rs, sha256 of the diff text below (LF bytes) = e0e6f3f058a422ecab56fc4d4b09c651d5d1714cd1922fec1099f4b2873011fb. It was applied once with the Edit tool (R-3 and the first R-4 attempt ran from that application), saved with `git diff`, reverted, and re-applied with `git apply` for R-4b; `git diff` after re-application was byte-identical to the saved diff (`diff` printed no difference). R-4/R-4b are built from the same edit as R-3.
- R-5 and R-6: one diff, engine/tests/slice.rs, sha256 of the diff text below (LF bytes) = 2ed55e8ad1545827a014e61d92dd3fa8bc85413f970337edb1dc0d04bb505ad9. It was applied once with the Edit tool (R-6 ran from that application), saved, reverted, and re-applied with `git apply` for R-5; `git diff` after re-application was byte-identical to the saved diff. R-5/R-6 are built from the same edit. R-7 ran on the unmodified slice.rs. The slice edit and the h2_a edit were never in the tree together.

Reading of the five edits (i) to (v) against the diff (form section 2, R-3):
- (i) `registry_empty = dp.registry.snapshot().is_empty()`, read immediately before `let sent_at = Instant::now();`.
- (ii) `spatial_engine::trace::start(TraceKey { label: "h2_a-phase-R", ..Default::default() })`, before `start(&mut client, ...)` (before START).
- (iii) the 100 ms `assert!` replaced by one `println!` VARIANT-OBS line carrying: client pre-send to adapter receipt (printed as `observed_at.checked_duration_since(sent_at)`, so `None` would show an observed_at before sent_at rather than a saturated zero); the terminal code; the batch count; `observed_at >= sent_at`; registry_empty; CANCELLATION_REQUESTED, PRODUCER_CANCELLED, EXECUTE_RETURNED and FIRST_BATCH_FULL each as present@offset or absent. Offsets are milliseconds from the trace origin (trace start).
- (iv) the remaining assertions stay: `assert_eq!(c.batches, 0)`, `assert_eq!(terminal code, wire::TERM_CANCELLED)`, `states.last().expect("one stream")`, `state.observed_at().expect("observed")`.
- (v) `drop(guard)` occurs right after the events are read, before `client.close`.
- One honest limit of (ii) and (v): the trace guard is dropped as soon as the test has the registry state, so a producer-side stamp made after that drop is absent from the record. An absent PRODUCER_CANCELLED, EXECUTE_RETURNED or FIRST_BATCH_FULL therefore means "not in the trace at the instant the events were read"; it does not distinguish "never stamped" from "stamped later".

### 3.1 Diff, R-3 and R-4/R-4b (kernel/tests/end_to_end.rs)

```diff
diff --git a/kernel/tests/end_to_end.rs b/kernel/tests/end_to_end.rs
index 45349e39..be79afeb 100644
--- a/kernel/tests/end_to_end.rs
+++ b/kernel/tests/end_to_end.rs
@@ -436,9 +436,18 @@ async fn h2_a_cancel_before_the_first_batch_still_stops_the_query() {
     let dp = host(&path).await;
     let mut client = connect(&dp).await;
 
+    // VARIANT (ii): an engine trace started before START (this test runs alone: one stream).
+    let guard = spatial_engine::trace::start(spatial_engine::trace::TraceKey {
+        label: "h2_a-phase-R".into(),
+        ..Default::default()
+    })
+    .expect("no other trace is running");
+
     start(&mut client, params(None)).await;
     // No credit granted, so nothing can be written; cancel while the producer is still working.
     tokio::time::sleep(Duration::from_millis(50)).await;
+    // VARIANT (i): the registry read immediately before sent_at.
+    let registry_empty = dp.registry.snapshot().is_empty();
     let sent_at = Instant::now();
     cancel(&mut client).await;
 
@@ -450,13 +459,26 @@ async fn h2_a_cancel_before_the_first_batch_still_stops_the_query() {
 
     let states = dp.registry.snapshot();
     let state = states.last().expect("one stream");
-    let latency = state
-        .observed_at()
-        .expect("observed")
-        .duration_since(sent_at);
-    assert!(
-        latency < Duration::from_millis(100),
-        "observed after {latency:?}"
+    let observed_at = state.observed_at().expect("observed");
+    let events = guard.trace().events();
+    // VARIANT (v): the trace guard dropped before the client closes.
+    drop(guard);
+    // VARIANT (iii): the 100 ms assert replaced by one VARIANT-OBS line.
+    let off = |name: &str| match events.iter().find(|e| e.name == name) {
+        Some(e) => format!("present@{:.3}ms", e.offset_nanos as f64 / 1e6),
+        None => "absent".to_string(),
+    };
+    println!(
+        "VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = {:?}; terminal_code={}; batches={}; observed_at>=sent_at={}; registry_empty={}; CANCELLATION_REQUESTED={}; PRODUCER_CANCELLED={}; EXECUTE_RETURNED={}; FIRST_BATCH_FULL={}",
+        observed_at.checked_duration_since(sent_at),
+        c.terminal.as_ref().unwrap().0,
+        c.batches,
+        observed_at >= sent_at,
+        registry_empty,
+        off(spatial_engine::trace::CANCELLATION_REQUESTED),
+        off(spatial_engine::trace::PRODUCER_CANCELLED),
+        off(spatial_engine::trace::EXECUTE_RETURNED),
+        off(spatial_engine::trace::FIRST_BATCH_FULL),
     );
     client.close(None).await.ok();
     dp.shutdown().await;
```

### 3.2 Diff, R-5 and R-6 (engine/tests/slice.rs)

```diff
diff --git a/engine/tests/slice.rs b/engine/tests/slice.rs
index 26357370..7cf19c19 100644
--- a/engine/tests/slice.rs
+++ b/engine/tests/slice.rs
@@ -812,9 +812,12 @@ fn cancelling_mid_stream_stops_production_promptly() {
     // cancel_observed`, 100 ms, "scored on the producer's clock" (ADR-018). This is the only figure
     // here that is checked against a declared number, and it is the number that was declared.
     let budgeted = Duration::from_nanos(observed.saturating_sub(requested));
-    assert!(
-        budgeted < Duration::from_millis(100),
-        "cancel_requested → cancel_observed took {budgeted:?}, over docs/08:8's declared 100 ms"
+    println!(
+        "VARIANT-OBS slice: cancel_requested (CANCELLATION_REQUESTED) -> cancel_observed (PRODUCER_CANCELLED) = {budgeted:?}; reported term (observed -> terminal received) = {:?}; batches_after_cancel = {}",
+        terminal_received.saturating_sub(budgeted),
+        s.stats()
+            .batches_after_cancel
+            .load(std::sync::atomic::Ordering::SeqCst)
     );
 
     // **REPORTED, never asserted: the unbudgeted acknowledged term.** docs/08:8 reports the
```

The slice VARIANT-OBS line carries: cancel_requested (CANCELLATION_REQUESTED) to cancel_observed (PRODUCER_CANCELLED), named; the reported term (observed to terminal received, the unbudgeted acknowledged term, computed as in the existing println); batches_after_cancel. The two `.expect()` calls for the stamps stay above it, so a missing stamp would panic with its message and appear as a failing run; none did. The existing "reported, not asserted" println and the batches_after_cancel `assert!` are unchanged.

Commands (each run): `cargo test -p spatial-kernel --test end_to_end h2_a_cancel_before_the_first_batch_still_stops_the_query -- --exact --nocapture` for R-1 to R-4; `cargo test -p spatial-engine --test slice cancelling_mid_stream_stops_production_promptly -- --exact --nocapture` for R-5 and R-6; `cargo test -p spatial-engine --test slice` for R-7. Each under `timeout`, stdout+stderr to its own log, `rc=N` appended to that log (the `rc=` column below is that line). The `-- --exact` flag is placed after the test name as the form writes it.

## 4. Runs: one table row per run

### R-1: h2_a unmodified, alone, 20 runs

| run | end (UTC, log mtime) | rc | result line | test time |
|---|---|---|---|---|
| 1 | 22:31:13.976 | 0 | ok | 2.92s |
| 2 | 22:31:17.382 | 0 | ok | 2.78s |
| 3 | 22:31:20.830 | 0 | ok | 2.82s |
| 4 | 22:31:24.201 | 0 | ok | 2.79s |
| 5 | 22:31:27.491 | 0 | ok | 2.68s |
| 6 | 22:31:30.759 | 0 | ok | 2.74s |
| 7 | 22:31:33.896 | 0 | ok | 2.61s |
| 8 | 22:31:37.198 | 0 | ok | 2.78s |
| 9 | 22:31:41.050 | 0 | ok | 3.19s |
| 10 | 22:31:44.814 | 0 | ok | 3.07s |
| 11 | 22:31:48.227 | 0 | ok | 2.81s |
| 12 | 22:31:51.697 | 0 | ok | 2.84s |
| 13 | 22:31:55.212 | 0 | ok | 2.89s |
| 14 | 22:31:58.630 | 0 | ok | 2.84s |
| 15 | 22:32:02.061 | 0 | ok | 2.86s |
| 16 | 22:32:05.546 | 0 | ok | 2.89s |
| 17 | 22:32:09.041 | 0 | ok | 2.89s |
| 18 | 22:32:12.324 | 0 | ok | 2.74s |
| 19 | 22:32:15.521 | 0 | ok | 2.66s |
| 20 | 22:32:18.810 | 0 | ok | 2.77s |

R-1 tally: 20 of 20 runs rc=0 with "1 passed; 0 failed".

### R-2: h2_a unmodified, under L1, 20 runs

| run | end (UTC, log mtime) | rc | result line | test time |
|---|---|---|---|---|
| 1 | 22:32:50.175 | 0 | ok | 8.61s |
| 2 | 22:33:00.929 | 0 | ok | 8.71s |
| 3 | 22:33:12.174 | 0 | ok | 8.98s |
| 4 | 22:33:23.425 | 0 | ok | 8.92s |
| 5 | 22:33:37.964 | 0 | ok | 12.05s |
| 6 | 22:33:46.167 | 0 | ok | 6.86s |
| 7 | 22:34:00.561 | 0 | ok | 11.71s |
| 8 | 22:34:15.202 | 0 | ok | 11.51s |
| 9 | 22:34:29.242 | 0 | ok | 11.19s |
| 10 | 22:34:43.867 | 0 | ok | 11.43s |
| 11 | 22:35:00.343 | 0 | ok | 13.59s |
| 12 | 22:35:15.950 | 0 | ok | 12.03s |
| 13 | 22:35:30.993 | 0 | ok | 11.82s |
| 14 | 22:35:48.477 | 0 | ok | 14.40s |
| 15 | 22:36:06.003 | 0 | ok | 14.47s |
| 16 | 22:36:20.944 | 0 | ok | 11.26s |
| 17 | 22:36:36.174 | 0 | ok | 11.75s |
| 18 | 22:36:53.951 | 0 | ok | 12.97s |
| 19 | 22:37:11.068 | 0 | ok | 13.40s |
| 20 | 22:37:29.667 | 0 | ok | 13.24s |

R-2 tally: 20 of 20 runs rc=0 with "1 passed; 0 failed"; 0 failures.

### R-3: h2_a instrumented (section 3.1 diff), alone, 20 runs

| run | end (UTC, log mtime) | rc | pre-send -> adapter receipt | terminal code | batches | observed_at >= sent_at | registry_empty | CANCELLATION_REQUESTED | PRODUCER_CANCELLED | EXECUTE_RETURNED | FIRST_BATCH_FULL |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 22:51:02.835 | 0 | Some(466.2us) | 1 | 0 | true | false | present@53.281ms | present@53.288ms | present@35.020ms | present@36.317ms |
| 2 | 22:51:07.130 | 0 | Some(294.9us) | 1 | 0 | true | false | present@65.099ms | present@65.101ms | present@28.716ms | present@30.122ms |
| 3 | 22:51:11.070 | 0 | Some(284.1us) | 1 | 0 | true | false | present@58.209ms | present@58.211ms | present@33.013ms | present@34.819ms |
| 4 | 22:51:15.527 | 0 | Some(351.9us) | 1 | 0 | true | false | present@64.280ms | present@64.287ms | present@35.064ms | present@36.441ms |
| 5 | 22:51:19.481 | 0 | Some(325.5us) | 1 | 0 | true | false | present@59.233ms | present@59.234ms | present@34.895ms | present@36.290ms |
| 6 | 22:51:23.456 | 0 | Some(537.1us) | 1 | 0 | true | false | present@54.153ms | present@54.156ms | present@29.759ms | present@31.159ms |
| 7 | 22:51:27.772 | 0 | Some(266.2us) | 1 | 0 | true | false | present@55.184ms | present@55.185ms | present@27.759ms | present@29.085ms |
| 8 | 22:51:31.807 | 0 | Some(321.4us) | 1 | 0 | true | false | present@56.578ms | present@56.581ms | present@36.812ms | present@38.087ms |
| 9 | 22:51:36.775 | 0 | Some(385.2us) | 1 | 0 | true | false | present@56.417ms | absent | present@36.207ms | present@37.829ms |
| 10 | 22:51:41.199 | 0 | Some(336.1us) | 1 | 0 | true | false | present@59.639ms | present@59.640ms | present@33.658ms | present@35.021ms |
| 11 | 22:51:45.666 | 0 | Some(353.8us) | 1 | 0 | true | false | present@63.758ms | present@63.895ms | present@40.317ms | present@41.900ms |
| 12 | 22:51:50.589 | 0 | Some(353.3us) | 1 | 0 | true | false | present@58.963ms | present@58.964ms | present@35.951ms | present@37.383ms |
| 13 | 22:51:55.179 | 0 | Some(301.1us) | 1 | 0 | true | false | present@57.828ms | absent | present@36.377ms | present@37.694ms |
| 14 | 22:52:00.082 | 0 | Some(366.8us) | 1 | 0 | true | false | present@55.559ms | present@55.563ms | present@41.382ms | present@42.976ms |
| 15 | 22:52:04.712 | 0 | Some(323.2us) | 1 | 0 | true | false | present@52.236ms | present@52.238ms | present@32.805ms | present@33.977ms |
| 16 | 22:52:09.363 | 0 | Some(296.2us) | 1 | 0 | true | false | present@59.556ms | present@59.560ms | present@38.601ms | present@40.263ms |
| 17 | 22:52:14.283 | 0 | Some(433.5us) | 1 | 0 | true | false | present@56.449ms | present@56.451ms | present@34.076ms | present@35.423ms |
| 18 | 22:52:19.088 | 0 | Some(310.7us) | 1 | 0 | true | false | present@62.878ms | present@62.881ms | present@31.390ms | present@33.171ms |
| 19 | 22:52:23.888 | 0 | Some(296us) | 1 | 0 | true | false | present@64.737ms | present@64.739ms | present@26.666ms | present@27.953ms |
| 20 | 22:52:27.683 | 0 | Some(300.5us) | 1 | 0 | true | false | present@63.502ms | present@63.503ms | present@27.734ms | present@28.932ms |

R-3 tally: rc=0 20/20; terminal code 1 (TERM_CANCELLED) 20/20; batches 0 20/20; observed_at >= sent_at 20/20; CANCELLATION_REQUESTED present 20/20; registry_empty false 20/20 (true 0); PRODUCER_CANCELLED present 18/20; EXECUTE_RETURNED present 20/20; FIRST_BATCH_FULL present 20/20; pre-send to adapter receipt at or over 100 ms in 0/20 runs (largest 0.537 ms).

### R-4 (void first attempt), supplementary: section 3.1 diff, under L1, 20 runs, of which only runs 1 to 8 ran inside the loader life

| run | end (UTC, log mtime) | rc | pre-send -> adapter receipt | terminal code | batches | observed_at >= sent_at | registry_empty | CANCELLATION_REQUESTED | PRODUCER_CANCELLED | EXECUTE_RETURNED | FIRST_BATCH_FULL |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 22:48:47.517 | 0 | Some(423.9us) | 1 | 0 | true | false | present@60.008ms | present@60.011ms | present@43.041ms | present@44.946ms |
| 2 | 22:48:52.346 | 0 | Some(313.6us) | 1 | 0 | true | false | present@64.281ms | present@64.285ms | present@44.879ms | present@46.045ms |
| 3 | 22:48:57.244 | 0 | Some(318.1us) | 1 | 0 | true | false | present@51.874ms | present@51.877ms | present@31.293ms | present@32.783ms |
| 4 | 22:49:01.326 | 0 | Some(263.9us) | 1 | 0 | true | false | present@58.105ms | present@58.108ms | present@27.235ms | present@28.787ms |
| 5 | 22:49:05.771 | 0 | Some(230.8us) | 1 | 0 | true | false | present@64.733ms | present@64.736ms | present@29.685ms | present@30.986ms |
| 6 | 22:49:11.396 | 0 | Some(397.7us) | 1 | 0 | true | false | present@62.282ms | present@62.284ms | present@41.709ms | present@43.179ms |
| 7 | 22:49:21.874 | 0 | Some(735.6us) | 1 | 0 | true | false | present@52.788ms | absent | absent | absent |
| 8 | 22:49:36.427 | 0 | Some(582.6us) | 1 | 0 | true | false | present@61.557ms | absent | present@55.619ms | present@57.895ms |
| 9 | 22:49:43.308 | 0 | Some(557.1us) | 1 | 0 | true | false | present@65.933ms | present@65.942ms | present@44.558ms | present@47.121ms |
| 10 | 22:49:49.029 | 0 | Some(460.5us) | 1 | 0 | true | false | present@60.209ms | present@60.212ms | present@37.596ms | present@39.481ms |
| 11 | 22:49:55.469 | 0 | Some(385.6us) | 1 | 0 | true | false | present@52.255ms | present@52.260ms | present@43.731ms | present@45.620ms |
| 12 | 22:50:00.654 | 0 | Some(369.1us) | 1 | 0 | true | false | present@61.304ms | present@61.306ms | present@35.591ms | present@37.391ms |
| 13 | 22:50:05.457 | 0 | Some(402.9us) | 1 | 0 | true | false | present@57.123ms | present@57.359ms | present@37.199ms | present@38.572ms |
| 14 | 22:50:10.213 | 0 | Some(329us) | 1 | 0 | true | false | present@52.484ms | present@52.486ms | present@31.493ms | present@32.978ms |
| 15 | 22:50:15.013 | 0 | Some(321.3us) | 1 | 0 | true | false | present@59.883ms | present@59.885ms | present@27.043ms | present@28.340ms |
| 16 | 22:50:19.119 | 0 | Some(211.1us) | 1 | 0 | true | false | present@66.281ms | present@66.284ms | present@37.162ms | present@39.380ms |
| 17 | 22:50:23.360 | 0 | Some(339.3us) | 1 | 0 | true | false | present@64.404ms | present@64.409ms | present@29.257ms | present@30.537ms |
| 18 | 22:50:27.571 | 0 | Some(331.3us) | 1 | 0 | true | false | present@61.786ms | present@61.787ms | present@28.986ms | present@30.160ms |
| 19 | 22:50:31.722 | 0 | Some(325.2us) | 1 | 0 | true | false | present@57.397ms | present@57.400ms | present@33.513ms | present@34.970ms |
| 20 | 22:50:35.831 | 0 | Some(255.2us) | 1 | 0 | true | false | present@52.330ms | present@52.331ms | present@28.599ms | present@29.749ms |

First-attempt tally (VOID as a row; reported for completeness only). Runs 1 to 8, inside L1: terminal 1 8/8, batches 0 8/8, observed_at >= sent_at 8/8, CANCELLATION_REQUESTED present 8/8, registry_empty true 0/8, pre-send to adapter receipt at or over 100 ms 0/8 (largest 0.736 ms). Runs 9 to 20 (run 9 straddles the exit, 10 to 20 after it): all rc=0, all terminal 1 / 0 batches, registry_empty true 0/12, at or over 100 ms 0/12 (largest 0.557 ms); these twelve are neither loaded nor alone-by-design and carry no weight.

### R-4: section 3.1 diff, under L2, 20 runs (the R-4 row; the "R-4b" label in the log names)

| run | end (UTC, log mtime) | rc | pre-send -> adapter receipt | terminal code | batches | observed_at >= sent_at | registry_empty | CANCELLATION_REQUESTED | PRODUCER_CANCELLED | EXECUTE_RETURNED | FIRST_BATCH_FULL |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 22:54:22.707 | 0 | Some(704.6us) | 1 | 0 | true | false | present@71.040ms | absent | absent | absent |
| 2 | 22:54:37.790 | 0 | Some(641.1us) | 1 | 0 | true | false | present@73.533ms | absent | absent | absent |
| 3 | 22:54:53.020 | 0 | Some(617.7us) | 1 | 0 | true | false | present@78.995ms | absent | absent | absent |
| 4 | 22:55:11.867 | 0 | Some(29.5031ms) | 1 | 0 | true | true | present@94.944ms | absent | absent | absent |
| 5 | 22:55:23.112 | 0 | Some(425.5us) | 1 | 0 | true | false | present@52.824ms | present@52.828ms | present@43.148ms | present@44.879ms |
| 6 | 22:55:36.182 | 0 | Some(600.8us) | 1 | 0 | true | false | present@69.470ms | absent | absent | absent |
| 7 | 22:55:56.581 | 0 | Some(682.9us) | 1 | 0 | true | false | present@65.062ms | absent | absent | absent |
| 8 | 22:56:14.193 | 0 | Some(694.6us) | 1 | 0 | true | false | present@62.462ms | absent | absent | absent |
| 9 | 22:56:35.232 | 0 | Some(782.7us) | 1 | 0 | true | false | present@55.214ms | absent | absent | absent |
| 10 | 22:56:52.773 | 0 | Some(696us) | 1 | 0 | true | false | present@79.391ms | absent | absent | absent |
| 11 | 22:57:09.919 | 0 | Some(922us) | 1 | 0 | true | true | present@66.272ms | absent | absent | absent |
| 12 | 22:57:31.756 | 0 | Some(30.5793ms) | 1 | 0 | true | true | present@96.942ms | absent | absent | absent |
| 13 | 22:57:49.465 | 0 | Some(43.5293ms) | 1 | 0 | true | true | present@134.124ms | absent | absent | absent |
| 14 | 22:58:11.236 | 0 | Some(1.0315ms) | 1 | 0 | true | true | present@83.229ms | absent | absent | absent |
| 15 | 22:58:32.172 | 0 | Some(1.1734ms) | 1 | 0 | true | true | present@66.973ms | absent | absent | absent |
| 16 | 22:58:51.109 | 0 | Some(1.2034ms) | 1 | 0 | true | true | present@68.374ms | absent | absent | absent |
| 17 | 22:59:07.360 | 0 | Some(709.7us) | 1 | 0 | true | false | present@60.610ms | absent | absent | absent |
| 18 | 22:59:27.623 | 0 | Some(723.1us) | 1 | 0 | true | false | present@55.726ms | absent | absent | absent |
| 19 | 22:59:45.071 | 0 | Some(677.8us) | 1 | 0 | true | false | present@67.818ms | absent | absent | absent |
| 20 | 23:00:03.728 | 0 | Some(994.7us) | 1 | 0 | true | true | present@67.582ms | absent | absent | absent |

R-4 tally: rc=0 20/20; terminal code 1 20/20; batches 0 20/20; observed_at >= sent_at 20/20; CANCELLATION_REQUESTED present 20/20; registry_empty true 8/20 and false 12/20; PRODUCER_CANCELLED present 1/20; EXECUTE_RETURNED present 1/20; FIRST_BATCH_FULL present 1/20; client pre-send to adapter receipt at or over 100 ms in 0/20 runs (largest 43.529 ms); at or over 100 ms with registry_empty true 0; at or over 100 ms with registry_empty false 0.

Pre-send to adapter receipt in the R-4 runs with registry_empty true (ms): run 4: 29.503, run 11: 0.922, run 12: 30.579, run 13: 43.529, run 14: 1.032, run 15: 1.173, run 16: 1.203, run 20: 0.995.
The same figure in the R-4 runs with registry_empty false (ms): run 1: 0.705, run 2: 0.641, run 3: 0.618, run 5: 0.425, run 6: 0.601, run 7: 0.683, run 8: 0.695, run 9: 0.783, run 10: 0.696, run 17: 0.710, run 18: 0.723, run 19: 0.678.

### R-5: slice cancelling_mid_stream_stops_production_promptly, VARIANT-OBS (section 3.2 diff), alone, 20 runs

| run | end (UTC, log mtime) | rc | cancel_requested -> cancel_observed | reported term (observed -> terminal received) | batches_after_cancel | both stamps present |
|---|---|---|---|---|---|---|
| 1 | 22:52:49.389 | 0 | 1.2us | 5.379ms | 0 | yes (the two expect() calls passed; rc=0) |
| 2 | 22:52:51.810 | 0 | 900ns | 5.2397ms | 0 | yes (the two expect() calls passed; rc=0) |
| 3 | 22:52:54.625 | 0 | 3.1us | 5.0843ms | 0 | yes (the two expect() calls passed; rc=0) |
| 4 | 22:52:57.132 | 0 | 2us | 6.0345ms | 0 | yes (the two expect() calls passed; rc=0) |
| 5 | 22:52:59.489 | 0 | 1.6us | 5.9732ms | 0 | yes (the two expect() calls passed; rc=0) |
| 6 | 22:53:01.968 | 0 | 2.3us | 5.225ms | 0 | yes (the two expect() calls passed; rc=0) |
| 7 | 22:53:04.749 | 0 | 1.7us | 5.0076ms | 0 | yes (the two expect() calls passed; rc=0) |
| 8 | 22:53:07.071 | 0 | 1.3us | 5.0133ms | 0 | yes (the two expect() calls passed; rc=0) |
| 9 | 22:53:09.388 | 0 | 0ns | 5.3939ms | 0 | yes (the two expect() calls passed; rc=0) |
| 10 | 22:53:11.836 | 0 | 1.3us | 5.8207ms | 0 | yes (the two expect() calls passed; rc=0) |
| 11 | 22:53:14.586 | 0 | 1.6us | 4.8369ms | 0 | yes (the two expect() calls passed; rc=0) |
| 12 | 22:53:16.891 | 0 | 2.3us | 4.9346ms | 0 | yes (the two expect() calls passed; rc=0) |
| 13 | 22:53:19.250 | 0 | 1.8us | 5.2014ms | 0 | yes (the two expect() calls passed; rc=0) |
| 14 | 22:53:21.615 | 0 | 3.5us | 5.4384ms | 0 | yes (the two expect() calls passed; rc=0) |
| 15 | 22:53:24.366 | 0 | 2.2us | 5.8009ms | 0 | yes (the two expect() calls passed; rc=0) |
| 16 | 22:53:26.648 | 0 | 1.1us | 4.7033ms | 0 | yes (the two expect() calls passed; rc=0) |
| 17 | 22:53:28.884 | 0 | 900ns | 6.3825ms | 0 | yes (the two expect() calls passed; rc=0) |
| 18 | 22:53:31.308 | 0 | 2us | 5.6378ms | 0 | yes (the two expect() calls passed; rc=0) |
| 19 | 22:53:34.028 | 0 | 900ns | 5.8234ms | 0 | yes (the two expect() calls passed; rc=0) |
| 20 | 22:53:36.297 | 0 | 1.5us | 5.0596ms | 0 | yes (the two expect() calls passed; rc=0) |

### R-6: as R-5, under L1, 20 runs

| run | end (UTC, log mtime) | rc | cancel_requested -> cancel_observed | reported term (observed -> terminal received) | batches_after_cancel | both stamps present |
|---|---|---|---|---|---|---|
| 1 | 22:39:16.134 | 0 | 2.1us | 62.3438ms | 0 | yes (the two expect() calls passed; rc=0) |
| 2 | 22:39:34.930 | 0 | 7.3us | 43.718ms | 0 | yes (the two expect() calls passed; rc=0) |
| 3 | 22:39:55.385 | 0 | 8.2us | 153.673ms | 0 | yes (the two expect() calls passed; rc=0) |
| 4 | 22:40:11.480 | 0 | 3.5us | 141.5409ms | 0 | yes (the two expect() calls passed; rc=0) |
| 5 | 22:40:29.589 | 0 | 4.2us | 127.1652ms | 0 | yes (the two expect() calls passed; rc=0) |
| 6 | 22:40:48.704 | 0 | 3.9us | 108.2848ms | 0 | yes (the two expect() calls passed; rc=0) |
| 7 | 22:41:07.659 | 0 | 6.2us | 14.0906ms | 0 | yes (the two expect() calls passed; rc=0) |
| 8 | 22:41:23.234 | 0 | 7.7us | 140.5894ms | 0 | yes (the two expect() calls passed; rc=0) |
| 9 | 22:41:56.269 | 0 | 3.8us | 134.7396ms | 0 | yes (the two expect() calls passed; rc=0) |
| 10 | 22:42:19.669 | 0 | 2.8us | 145.1487ms | 0 | yes (the two expect() calls passed; rc=0) |
| 11 | 22:42:39.518 | 0 | 3.6us | 33.8924ms | 0 | yes (the two expect() calls passed; rc=0) |
| 12 | 22:42:54.905 | 0 | 87.9us | 74.7497ms | 0 | yes (the two expect() calls passed; rc=0) |
| 13 | 22:43:09.012 | 0 | 74.7us | 142.8807ms | 0 | yes (the two expect() calls passed; rc=0) |
| 14 | 22:43:34.390 | 0 | 12.5us | 13.5644ms | 0 | yes (the two expect() calls passed; rc=0) |
| 15 | 22:43:54.584 | 0 | 2.5us | 74ms | 0 | yes (the two expect() calls passed; rc=0) |
| 16 | 22:44:09.153 | 0 | 2.6us | 61.8238ms | 0 | yes (the two expect() calls passed; rc=0) |
| 17 | 22:44:25.082 | 0 | 5.8us | 158.8268ms | 0 | yes (the two expect() calls passed; rc=0) |
| 18 | 22:44:44.945 | 0 | 4.8us | 133.7161ms | 0 | yes (the two expect() calls passed; rc=0) |
| 19 | 22:45:04.034 | 0 | 6.5us | 126.8101ms | 0 | yes (the two expect() calls passed; rc=0) |
| 20 | 22:45:30.383 | 0 | 3.4us | 69.0442ms | 0 | yes (the two expect() calls passed; rc=0) |

R-5 tally: rc=0 20/20; both stamps present (no expect() panic) 20/20; cancel_requested -> cancel_observed at or over 100 ms in 0/20 (largest 3.5 us); batches_after_cancel at most 1 in 20/20 (largest 0); the reported term observed -> terminal received (not the budgeted pair; reported, never asserted) at or over 100 ms in 0/20 (range 4.703 to 6.383 ms).

R-6 tally: rc=0 20/20; both stamps present (no expect() panic) 20/20; cancel_requested -> cancel_observed at or over 100 ms in 0/20 (largest 87.9 us); batches_after_cancel at most 1 in 20/20 (largest 0); the reported term observed -> terminal received (not the budgeted pair; reported, never asserted) at or over 100 ms in 11/20 (range 13.564 to 158.827 ms).

### R-7: `cargo test -p spatial-engine --test slice`, unmodified, whole binary, under L1, 5 runs

| run | end (UTC, log mtime) | rc | test result line | failing lines |
|---|---|---|---|---|
| 1 | 22:47:33.261 | 0 | test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 5.59s | none |
| 2 | 22:47:39.738 | 0 | test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 5.72s | none |
| 3 | 22:47:46.360 | 0 | test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 5.78s | none |
| 4 | 22:47:52.384 | 0 | test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 5.21s | none |
| 5 | 22:47:58.432 | 0 | test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 5.32s | none |

R-7 tally: 5 of 5 runs rc=0 with 0 failed; no failing line or message to record. The test cancelling_mid_stream_stops_production_promptly ran inside each of these with its unmodified 100 ms assertion and passed.

## 5. Failing and void runs: full output, verbatim

Failing runs: R-1 0, R-2 0, R-3 0, R-4 0, R-5 0, R-6 0, R-7 0. There is no failing run to quote.

Void runs: the first R-4 attempt (section 2). Its twenty logs follow verbatim (all twenty are quoted, so the in-life runs 1 to 8 and the out-of-life runs 9 to 20 can be read side by side). Each log ends with its `rc=N` line.

#### R-4 first attempt (VOID row), run 1

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.49s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(423.9µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@60.008ms; PRODUCER_CANCELLED=present@60.011ms; EXECUTE_RETURNED=present@43.041ms; FIRST_BATCH_FULL=present@44.946ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.76s

rc=0
```

#### R-4 first attempt (VOID row), run 2

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.68s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(313.6µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@64.281ms; PRODUCER_CANCELLED=present@64.285ms; EXECUTE_RETURNED=present@44.879ms; FIRST_BATCH_FULL=present@46.045ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.78s

rc=0
```

#### R-4 first attempt (VOID row), run 3

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.64s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(318.1µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@51.874ms; PRODUCER_CANCELLED=present@51.877ms; EXECUTE_RETURNED=present@31.293ms; FIRST_BATCH_FULL=present@32.783ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.95s

rc=0
```

#### R-4 first attempt (VOID row), run 4

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.50s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(263.9µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@58.105ms; PRODUCER_CANCELLED=present@58.108ms; EXECUTE_RETURNED=present@27.235ms; FIRST_BATCH_FULL=present@28.787ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.29s

rc=0
```

#### R-4 first attempt (VOID row), run 5

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.48s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(230.8µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@64.733ms; PRODUCER_CANCELLED=present@64.736ms; EXECUTE_RETURNED=present@29.685ms; FIRST_BATCH_FULL=present@30.986ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.67s

rc=0
```

#### R-4 first attempt (VOID row), run 6

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 1.32s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(397.7µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@62.282ms; PRODUCER_CANCELLED=present@62.284ms; EXECUTE_RETURNED=present@41.709ms; FIRST_BATCH_FULL=present@43.179ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.87s

rc=0
```

#### R-4 first attempt (VOID row), run 7

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.78s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(735.6µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@52.788ms; PRODUCER_CANCELLED=absent; EXECUTE_RETURNED=absent; FIRST_BATCH_FULL=absent
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 9.32s

rc=0
```

#### R-4 first attempt (VOID row), run 8

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 2.20s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(582.6µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@61.557ms; PRODUCER_CANCELLED=absent; EXECUTE_RETURNED=present@55.619ms; FIRST_BATCH_FULL=present@57.895ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 11.53s

rc=0
```

#### R-4 first attempt (VOID row), run 9

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.92s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(557.1µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@65.933ms; PRODUCER_CANCELLED=present@65.942ms; EXECUTE_RETURNED=present@44.558ms; FIRST_BATCH_FULL=present@47.121ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 5.51s

rc=0
```

#### R-4 first attempt (VOID row), run 10

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.70s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(460.5µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@60.209ms; PRODUCER_CANCELLED=present@60.212ms; EXECUTE_RETURNED=present@37.596ms; FIRST_BATCH_FULL=present@39.481ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 4.65s

rc=0
```

#### R-4 first attempt (VOID row), run 11

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.78s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(385.6µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@52.255ms; PRODUCER_CANCELLED=present@52.260ms; EXECUTE_RETURNED=present@43.731ms; FIRST_BATCH_FULL=present@45.620ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 5.28s

rc=0
```

#### R-4 first attempt (VOID row), run 12

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.68s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(369.1µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@61.304ms; PRODUCER_CANCELLED=present@61.306ms; EXECUTE_RETURNED=present@35.591ms; FIRST_BATCH_FULL=present@37.391ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 4.15s

rc=0
```

#### R-4 first attempt (VOID row), run 13

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.60s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(402.9µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@57.123ms; PRODUCER_CANCELLED=present@57.359ms; EXECUTE_RETURNED=present@37.199ms; FIRST_BATCH_FULL=present@38.572ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.87s

rc=0
```

#### R-4 first attempt (VOID row), run 14

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.58s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(329µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@52.484ms; PRODUCER_CANCELLED=present@52.486ms; EXECUTE_RETURNED=present@31.493ms; FIRST_BATCH_FULL=present@32.978ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.85s

rc=0
```

#### R-4 first attempt (VOID row), run 15

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.56s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(321.3µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@59.883ms; PRODUCER_CANCELLED=present@59.885ms; EXECUTE_RETURNED=present@27.043ms; FIRST_BATCH_FULL=present@28.340ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.94s

rc=0
```

#### R-4 first attempt (VOID row), run 16

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.50s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(211.1µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@66.281ms; PRODUCER_CANCELLED=present@66.284ms; EXECUTE_RETURNED=present@37.162ms; FIRST_BATCH_FULL=present@39.380ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.29s

rc=0
```

#### R-4 first attempt (VOID row), run 17

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.54s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(339.3µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@64.404ms; PRODUCER_CANCELLED=present@64.409ms; EXECUTE_RETURNED=present@29.257ms; FIRST_BATCH_FULL=present@30.537ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.43s

rc=0
```

#### R-4 first attempt (VOID row), run 18

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.51s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(331.3µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@61.786ms; PRODUCER_CANCELLED=present@61.787ms; EXECUTE_RETURNED=present@28.986ms; FIRST_BATCH_FULL=present@30.160ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.39s

rc=0
```

#### R-4 first attempt (VOID row), run 19

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.49s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(325.2µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@57.397ms; PRODUCER_CANCELLED=present@57.400ms; EXECUTE_RETURNED=present@33.513ms; FIRST_BATCH_FULL=present@34.970ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.38s

rc=0
```

#### R-4 first attempt (VOID row), run 20

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.53s
     Running tests\end_to_end.rs (D:/wt-targets/tauc-r\debug\deps\end_to_end-098528e12e50e2b3.exe)

running 1 test
VARIANT-OBS h2_a: client pre-send -> adapter receipt (not cancel_observed) = Some(255.2µs); terminal_code=1; batches=0; observed_at>=sent_at=true; registry_empty=false; CANCELLATION_REQUESTED=present@52.330ms; PRODUCER_CANCELLED=present@52.331ms; EXECUTE_RETURNED=present@28.599ms; FIRST_BATCH_FULL=present@29.749ms
test h2_a_cancel_before_the_first_batch_still_stops_the_query ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 3.31s

rc=0
```

## 6. Results, row by row against section 5 predictions

| row | prediction (form section 5) | observed | verdict |
|---|---|---|---|
| R-1 | 20 of 20 pass | 20 of 20 pass (rc=0, "1 passed") | prediction held |
| R-2 | at least 1 of 20 fails, each at end_to_end.rs:457 with h2_a's message | 20 of 20 pass, 0 fail; no failure exists to locate at :457 | prediction MISSED on the count; no failure was seen, so the line clause has nothing to bind. Per section 5, a miss on R-2's count without STOP is a class-2 recorded result |
| R-3 | in 20 of 20: TERM_CANCELLED; 0 batches; observed_at present and >= sent_at; CANCELLATION_REQUESTED present; registry_empty false. PRODUCER_CANCELLED: no prediction (0.8) | TERM_CANCELLED 20/20; 0 batches 20/20; observed_at present (the `.expect` passed in every run) and >= sent_at 20/20; CANCELLATION_REQUESTED present 20/20; registry_empty false 20/20. PRODUCER_CANCELLED present 18/20 (reported, no prediction) | prediction held |
| R-4 (re-run, L2) | TERM_CANCELLED, 0 batches, observed_at present and >= sent_at, CANCELLATION_REQUESTED present, in 20 of 20; every run with client pre-send to adapter receipt at or over 100 ms has registry_empty true | the four structural properties: 20/20, 20/20, 20/20, 20/20. Runs at or over 100 ms: 0 (largest 43.529 ms). So the H-W clause has no run to bind: vacuously true, not tested | structural clause held; the H-W clause is untested, no run reached 100 ms |
| R-5 | 20 of 20 under 100 ms; both stamps present; batches_after_cancel at most 1 | cancel_requested -> cancel_observed under 100 ms in 20/20 (largest 3.5 us); both stamps present 20/20; batches_after_cancel at most 1 in 20/20 | prediction held |
| R-6 | both stamps present and batches_after_cancel at most 1 in 20 of 20; the count at or over 100 ms has no prediction and is reported | both stamps present 20/20; batches_after_cancel at most 1 in 20/20; cancel_requested -> cancel_observed at or over 100 ms in 0/20 (largest 87.9 us); the reported term (observed -> terminal received) at or over 100 ms in 11/20 | prediction held; the reported count at or over 100 ms (budgeted pair) is 0 |
| R-7 | no prediction on the count; every failing line recorded | 5 of 5 whole-binary runs passed all 22 tests under L1; no failing line | nothing to record |

Observations that carry no claim (reported, in the form's section 6 sense: structural, not measurements, not p50/p95, not a reference profile):
- Under L2, registry_empty was true at the client instant in 8 of 20 R-4 runs and false in 12; alone (R-3) it was false in all 20 runs. EXECUTE_RETURNED was recorded in 20 of the 20 R-3 runs, at 26.7 to 41.4 ms trace offset (offsets are from the trace start, which precedes START).
- The cargo "finished in" test-time column for the instrumented h2_a: R-3 (alone) 3.09 to 4.12 s; first-attempt runs 1 to 8 (L1, late in its life) 3.29 to 11.53 s; R-4 (L2) 7.65 to 16.63 s. The load differs between the two loaders and across each loader's life (a release build of the engine, then the link and tail phase); no comparison between loaded rows is claimed.
- Of the registry_empty true runs in R-4, 5 had client pre-send to adapter receipt near 1 ms (0.92, 1.03, 1.17, 1.20, 0.99 ms) and 3 had 29.5 to 43.5 ms (29.5, 30.6, 43.5 ms). This phase draws no conclusion from that split on H-W (0.6): its discriminator, a run at or over 100 ms, did not occur.
- The largest client pre-send to adapter receipt figures in R-4 were in runs with registry_empty true: 43.5 ms, 30.6 ms, 29.5 ms. None reached 100 ms. The figure is the client instant to the adapter reader's receipt stamp; it is not ADR-018's cancel_requested to cancel_observed and is not a docs/08 result.
- PRODUCER_CANCELLED was present in 18/20 R-3 runs and in 1/20 R-4 runs. See the limit in section 3 on what absent means here; this form's 0.8 says no committed test reads these stamps for h2_a.
- slice.rs: the budgeted pair (cancel_requested -> cancel_observed, the product's own two stamps: CancelToken::cancel and the producer's cancel observation) was microseconds in every R-5 and R-6 run, loaded or not. The term that moved under load was the reported, unbudgeted observed -> terminal received term.
- The cargo "finished in" test-time column ranges 2.61 to 3.19 s for R-1 (alone) and 6.86 to 14.47 s for R-2 (under L1), so L1 was loading the machine at the test level; yet h2_a passed all 20 R-2 runs, and the instrumented h2_a showed no run at or over 100 ms under L2 either.

## 7. Routing (form section 5)

- STOP: NOT triggered. Conditions checked: (a) any R-1 to R-4 run with a terminal other than TERM_CANCELLED, a batch, observed_at absent or before sent_at, or CANCELLATION_REQUESTED absent: none, over R-3 (20 runs), R-4 (20 runs) and the 20 runs of the void first attempt, and R-1/R-2 passed all their assertions; (b) any R-1/R-2 failure at a line other than end_to_end.rs:457: no R-1 or R-2 run failed. Deciding rows: R-1, R-2, R-3, R-4.
- W: NOT triggered. W requires at least one R-4 run at or over 100 ms with registry_empty true; the number of R-4 runs at or over 100 ms is 0 (largest 43.529 ms, in a run with registry_empty true). Deciding rows: R-4 (all 20).
- C: NOT triggered. C requires at least one R-4 run at or over 100 ms with registry_empty false; there are 0. Deciding rows: R-4.
- So no routed node arises from Phase R, and the form takes no class-1 amendment from it. The only recorded result is the class-2 one: R-2 missed its count (0 of 20 failed, prediction at least 1) and R-4's H-W clause went unexercised (no run reached 100 ms). Both are the custodian's to record; I record no routing and append no node.
- R-5, R-6, R-7 route nothing (form section 2); they are OPEN-1's evidence: the slice.rs budgeted pair never approached 100 ms in 40 single-test observations (20 alone, 20 loaded L1), and the unmodified assertion passed in each of the 5 whole-binary R-7 runs.
- No reproduction of the recorded contention failures (form 0.5: h2_a at 252.7 ms and 163.6 ms; slice.rs at 101.33 ms) was obtained by this load. That is an absence under this one load, L, and does not show they cannot recur (form section 1).

## 8. Failure classes for this harness (tester report additions)

- The harness uses the interface the product exposes: h2_a drives the real data-plane WebSocket, the real kernel EngineSourceFactory and a real GeoParquet fixture; slice.rs drives the engine's own Dataset stream and CancelToken. Neither is mocked; the only additions are the scratch trace start and the printed line.
- Every result claim points to a table in this file. The per-run logs themselves are in the tester's scratch directory and are not committed; the void-row logs are quoted in section 5, and every other run log is a pass whose key fields are in the tables.
- No operator-facing line in a results file is written: this is a consult, scratch, uncommitted code.
- Every measurement test reaches its assertion: the VARIANT-OBS line prints after the `expect()` calls and the remaining `assert_eq!`s, so a run that printed it passed them; each logged run shows rc=0 and "1 passed". The R-4 run 9 to 20 logs of the void row are included for the same reason.

## 9. End state

Output of the end-state checks (the S10 and S9 lines of the check script in section 10, copied from its output):

```
== S9
MATCH    S9 L1 times: expected L1 start 2026-10-04T22:32:32.429Z|L1 exit 2026-10-04T22:49:39.643Z rc=0, got L1 start 2026-10-04T22:32:32.429Z|L1 exit 2026-10-04T22:49:39.643Z rc=0
MATCH    S9 L2 times: expected L2 start 2026-10-04T22:53:57.828Z|L2 exit 2026-10-04T23:11:12.632Z rc=0, got L2 start 2026-10-04T22:53:57.828Z|L2 exit 2026-10-04T23:11:12.632Z rc=0
MATCH    S9 logical cores: expected 16, got 16
MATCH    S9 timing-load directories remaining: expected 0, got 0
== S10
MATCH    S10 git status --porcelain lines: expected 0, got 0
MATCH    S10 git diff bytes (working tree vs HEAD): expected 0, got 0
MATCH    S10 HEAD: expected 201f833ec6765d9b1c0b624f2601d67b60cf4f69, got 201f833ec6765d9b1c0b624f2601d67b60cf4f69
MATCH    S10 cargo/rustc/end_to_end/slice processes (tasklist): expected 0, got 0
```

- Every scratch edit was reverted with `git checkout -- <file>` (end_to_end.rs and slice.rs, each more than once); the worktree is at 201f833ec6765d9b1c0b624f2601d67b60cf4f69 with an empty `git status --porcelain` and an empty `git diff`.
- Load directories D:/wt-targets/timing-load-1 and timing-load-2 were deleted; D:/wt-targets/tauc-r (the test target) and the worktree C:/dev/wt/tauc-r remain for the custodian to remove.
- The fixture files the tests write go under the worktree's target/fixtures (git-ignored); they do not appear in `git status`.
- Nothing was committed, nothing was pushed, no other worktree and no file in the main checkout other than this consult was touched.

## 10. Final step (form section 2): each summary sentence resolved against my steps and the run logs

Method: after the tables above were generated, I re-counted every number in the Summary (section 0) directly from the raw run logs with grep, sed and sort (a different path from the generator that built the tables), and checked each against the sentence. The script prints MATCH or MISMATCH per check. Its full output follows.

The first execution of this script printed 13 MISMATCH lines. All 13 were a defect in the script's own helper (a quoted glob that grep took literally, so it counted 0 files); I fixed the helper, re-ran, and the re-run printed 44 MATCH and 0 MISMATCH. The output below is the re-run's.

```
== S1
MATCH    S1 tree diff stat bytes: expected 0, got 0
MATCH    S1 HEAD: expected 201f833ec6765d9b1c0b624f2601d67b60cf4f69, got 201f833ec6765d9b1c0b624f2601d67b60cf4f69
== S2
MATCH    S2 R-1 logs with '1 passed; 0 failed': expected 20, got 20
MATCH    S2 R-1 logs with rc=0 last line: expected 20, got 20
MATCH    S2 R-2 logs with '1 passed; 0 failed': expected 20, got 20
MATCH    S2 R-2 logs with rc=0 last line: expected 20, got 20
MATCH    S2 R-2 logs mentioning FAILED or panicked: expected 0, got 0
== S3
MATCH    S3 R-3 logs: terminal 1, 0 batches, ge true, registry_empty false, CANCELLATION_REQUESTED present: expected 20, got 20
MATCH    S3 R-3 logs with PRODUCER_CANCELLED present: expected 18, got 18
MATCH    S3 R-3 logs rc=0 and passed: expected 20, got 20
== S4
MATCH    S4 first attempt log count: expected 20, got 20
MATCH    S4 R-4 re-run logs with the four structural properties: expected 20, got 20
MATCH    S4 R-4 re-run registry_empty=true: expected 8, got 8
MATCH    S4 R-4 re-run registry_empty=false: expected 12, got 12
MATCH    S4 R-4 re-run pre-send->receipt in ms units at or over 100: expected 0, got 0
MATCH    S4 R-4 re-run pre-send->receipt in s units: expected 0, got 0
MATCH    S4 R-4 re-run largest ms-unit receipt: expected 43.5293, got 43.5293
MATCH    S4 largest receipt run has registry_empty=true: expected 1, got 1
MATCH    S4 first attempt: logs ok: expected 20, got 20
MATCH    S4 first attempt run 8 mtime before L1 exit (1=yes): expected 1, got 1
MATCH    S4 first attempt run 9 mtime after L1 exit (1=yes): expected 1, got 1
MATCH    S4 first attempt run 9 test time at least 5s (so it began before the exit, given its mtime): expected 5.51s, got 5.51s
== S5
MATCH    S5 R-5 logs passed: expected 20, got 20
MATCH    S5 R-5 logs batches_after_cancel = 0: expected 20, got 20
MATCH    S5 R-5 pair values in ms or s units: expected 0, got 0
MATCH    S5 R-5 largest pair value in us: expected 3.5, got 3.5
== S6
MATCH    S6 R-6 logs passed: expected 20, got 20
MATCH    S6 R-6 logs batches_after_cancel = 0: expected 20, got 20
MATCH    S6 R-6 pair values in ms or s units: expected 0, got 0
MATCH    S6 R-6 largest pair value in us: expected 87.9, got 87.9
MATCH    S6 R-6 reported term at or over 100 ms: expected 11, got 11
== S7
MATCH    S7 R-7 logs with '22 passed; 0 failed': expected 5, got 5
MATCH    S7 R-7 logs rc=0: expected 5, got 5
MATCH    S7 R-7 logs mentioning FAILED: expected 0, got 0
== S8
MATCH    S8 STOP: R-3, R-4 and first-attempt logs lacking the four structural properties: expected 0, got 0
MATCH    S8 W/C: R-4 re-run logs at or over 100 ms (ms units): expected 0, got 0
== S9
MATCH    S9 L1 times: expected L1 start 2026-10-04T22:32:32.429Z|L1 exit 2026-10-04T22:49:39.643Z rc=0, got L1 start 2026-10-04T22:32:32.429Z|L1 exit 2026-10-04T22:49:39.643Z rc=0
MATCH    S9 L2 times: expected L2 start 2026-10-04T22:53:57.828Z|L2 exit 2026-10-04T23:11:12.632Z rc=0, got L2 start 2026-10-04T22:53:57.828Z|L2 exit 2026-10-04T23:11:12.632Z rc=0
MATCH    S9 logical cores: expected 16, got 16
MATCH    S9 timing-load directories remaining: expected 0, got 0
== S10
MATCH    S10 git status --porcelain lines: expected 0, got 0
MATCH    S10 git diff bytes (working tree vs HEAD): expected 0, got 0
MATCH    S10 HEAD: expected 201f833ec6765d9b1c0b624f2601d67b60cf4f69, got 201f833ec6765d9b1c0b624f2601d67b60cf4f69
MATCH    S10 cargo/rustc/end_to_end/slice processes (tasklist): expected 0, got 0
```

| sentence | resolved against | result |
|---|---|---|
| S1 | the tree-check command run twice and the S1 lines above; HEAD printed by `git rev-parse` | matches |
| S2 | the S2 lines (R-1 and R-2 logs: 20 of 20 with "1 passed; 0 failed" and rc=0; none mentions FAILED or panicked) | matches |
| S3 | the S3 lines (20 logs with the four structural properties plus registry_empty=false; 18 with PRODUCER_CANCELLED present) | matches |
| S4 | the S4 lines: the first attempt's run 8 log was last written before L1's exit and run 9's after it, and run 9's own test time (5.51 s) exceeds the 3.7 s between L1's exit and its end, so it began before the exit; the re-run: 20 with the structural properties, registry_empty true 8 and false 12, no ms-unit receipt at or over 100, no s-unit receipt, largest 43.5293 ms, in a registry_empty true log | matches |
| S5 | the S5 lines (20 passed, batches_after_cancel 0 in 20, no ms or s unit pair value, largest 3.5 us) | matches |
| S6 | the S6 lines (20 passed, batches_after_cancel 0 in 20, no ms or s unit pair value, largest 87.9 us, reported term at or over 100 ms in 11) | matches |
| S7 | the S7 lines (5 logs with "22 passed; 0 failed", all rc=0, none mentions FAILED) | matches |
| S8 | the S8 lines (no R-3, R-4 or first-attempt log lacks the structural properties; no R-4 re-run receipt at or over 100 ms, so neither W nor C; STOP conditions (b) holds vacuously because no R-1 or R-2 run failed, per the S2 lines) | matches |
| S9 | the S9 lines (loader time files, `nproc`, no timing-load directory remains) | matches |
| S10 | the S10 lines (empty status, empty diff, HEAD, no cargo/rustc/test process by `tasklist`) | matches |

No sentence failed to match, so there is no STOP.

