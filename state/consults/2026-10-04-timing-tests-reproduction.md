# Timing tests Phase R: the skp cancel stall reproduction (consult)

Piece: node:timing-tests-assert-property-not-budget@g1, Phase R.
Form: kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md (the form), at main e582d79f; §0.3 (H-S), §0.6, §2, §5, §8 as cited below.
Run by: the tester agent, in the throwaway worktree C:/dev/wt/timing-r, detached at main 1c71ebafb6fd829d754b7733073b088575829955 (git rev-parse HEAD, checked before the first command; git status --porcelain was empty then).
Filed: 2026-10-04 (date -u read 20:10 UTC after the last run).
These are scratch observations: not tests of record, not mutations (§4, §8 item 10). Nothing was committed or published. No performance number, no docs/08 claim; every printed figure is a report (§6).

## 1. Commit applied to, and the tree check (§2)

Every variant below was applied to 1c71ebafb6fd829d754b7733073b088575829955 and reverted with `git checkout -- <file>` before the next.

`git diff --stat 02dfcff3 1c71ebaf -- kernel/src kernel/tests engine protocol` (the paths the pins live under) printed nothing; rc=0; 0 bytes of output.

The form's own wording, `git diff --stat 02dfcff3 1c71ebaf -- kernel engine protocol`, is not empty. Its whole output:

```
 ...NG-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md | 203 +++++++++++++++++++++
 1 file changed, 203 insertions(+)
```

The one changed path is kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md, the form itself (added after 02dfcff3). `git diff --numstat 02dfcff3 1c71ebaf -- '*.rs' '*.toml'` printed nothing. So the code trees are identical between the pin and the commit run; the pin 02dfcff3 and the tree agree, and no §0.3 cite was re-read against a different tree (§2, §5 invalidator 2 does not apply).

## 2. Method

- Every cargo command ran with CARGO_TARGET_DIR=D:/wt-targets/timing-r. The first (cold) build of `cargo test -p spatial-kernel --test skp_admission --no-run` took 17m 59s.
- One run = one `cargo test -p <package> --test <binary> <test name> -- --exact --nocapture` invocation, the test alone (names: skp_admission / cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock; candidate_a / every_batch_and_a_terminal_frame_are_delivered). Each invocation's full output was captured to its own log, with the shell's exit code appended as `rc=N`. The runs of one variant were issued by a shell loop in one Bash call per variant.
- The variant lines start with `VARIANT-OBS` and are printed by the scratch edits only. "Offset" figures are the engine trace's own stamps, each named by its event: CANCELLATION_REQUESTED and PRODUCER_CANCELLED (the pair; both are offsets on the same trace clock, from the trace's start). They are reported, not measured, and no gap is judged.
- "TAG_BATCH after host.cancel returned" counts TAG_BATCH frames the test client read between host.cancel's return and the end of its drain (terminal, connection end, or the 60 s deadline). The two TAG_BATCH frames before host.cancel are counted in "whole run" only.
- A test result of `ok` for R-1, R-1b, R-3 and R-3b means only that the scratch variant reached its end without panicking (R-1 and R-3 record the deadline instead of panicking). It is not a pass of the property; the observed fields are the result.
- The test's own retry wrapper (ATTEMPTS 5, unchanged) re-runs an attempt on the documented cancel_requested/cancel_observed ordering race. Where it did, the run printed an `attempt` line and a second VARIANT-OBS row; both rows are in the tables.

## 3. Applied diffs (text), each against 1c71ebafb6fd829d754b7733073b088575829955

R-1 (kernel/tests/skp_admission.rs; waits for two TAG_BATCH frames before host.cancel, grants no further credit, records the 60 s timeout and reads the trace instead of panicking, records the TAG_BATCH count; the later assertions are removed by an early return of Ok(()) after the VARIANT-OBS line):

```diff
diff --git a/kernel/tests/skp_admission.rs b/kernel/tests/skp_admission.rs
index fc28eb31..613f9481 100644
--- a/kernel/tests/skp_admission.rs
+++ b/kernel/tests/skp_admission.rs
@@ -873,7 +873,8 @@ async fn cancel_reaches_the_producer_directly_once() -> Result<(), OrderingRaceO
     // Wait for the stream to be genuinely producing before cancelling — cancelling an operation
     // that has not started anything yet would prove nothing about mid-flight observation. The loop
     // only exits by `break` below; falling through would mean the deadline panicked first.
-    loop {
+    let mut batches_total: u32 = 0;
+    while batches_total < 2 {
         let msg = tokio::time::timeout(RECV_DEADLINE, c.next())
             .await
             .expect("no timeout waiting for the first batch")
@@ -881,7 +882,7 @@ async fn cancel_reaches_the_producer_directly_once() -> Result<(), OrderingRaceO
             .expect("not a transport error");
         let Message::Binary(b) = msg else { continue };
         if b.first() == Some(&wire::TAG_BATCH) {
-            break;
+            batches_total += 1;
         }
     }
 
@@ -899,30 +900,42 @@ async fn cancel_reaches_the_producer_directly_once() -> Result<(), OrderingRaceO
     // reports is `TERM_PRODUCER_FAILED` carrying the engine's own "cancelled" text — a
     // characteristic of this convergence path, asserted here rather than assumed.
     let mut terminal_code = None;
+    let mut timed_out = false;
+    let mut batches_after_cancel: u32 = 0;
     loop {
         let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
             Ok(Some(Ok(m))) => m,
             Ok(Some(Err(_))) | Ok(None) => break,
-            Err(_) => panic!("timed out waiting for the terminal frame after cancel"),
+            Err(_) => {
+                timed_out = true;
+                break;
+            }
         };
         let Message::Binary(b) = msg else { continue };
+        if b.first() == Some(&wire::TAG_BATCH) {
+            batches_total += 1;
+            batches_after_cancel += 1;
+        }
         if b.first() == Some(&wire::TAG_TERMINAL) {
             terminal_code = b.get(wire::FRAME_PREFIX_LEN).copied();
             break;
         }
     }
-    assert_eq!(
-        terminal_code,
-        Some(wire::TERM_PRODUCER_FAILED),
-        "an SKP-cancelled ticket stream ends in TERM_PRODUCER_FAILED, not TERM_CANCELLED — the \
-         cancel reached the engine directly rather than through a data-plane CANCEL frame"
-    );
-
     let trace = guard.trace();
     let requested = trace.first(trace::CANCELLATION_REQUESTED);
     let observed = trace.first(trace::PRODUCER_CANCELLED);
     drop(guard);
-
+    eprintln!(
+        "VARIANT-OBS timed_out_at_60s_after_host_cancel_return={timed_out} \
+         terminal_code={terminal_code:?} tag_batch_total_whole_run={batches_total} \
+         tag_batch_between_host_cancel_return_and_end_of_drain={batches_after_cancel} \
+         CANCELLATION_REQUESTED_offset_ns={:?} PRODUCER_CANCELLED_offset_ns={:?}",
+        requested.as_ref().map(|e| e.offset_nanos),
+        observed.as_ref().map(|e| e.offset_nanos)
+    );
+    return Ok(());
+    #[allow(unreachable_code)]
+    let (requested, observed): (Option<trace::Event>, Option<trace::Event>) = (None, None);
     let requested =
         requested.expect("cancel_requested must be stamped — CancelToken::cancel() ran");
     let observed = observed.expect(
```

R-1b (kernel/tests/skp_admission.rs; as R-1's wait and drain, plus one CREDIT of u32::MAX right after host.cancel returns; the terminal-code, stamp and ordering assertions stay, the VARIANT-OBS line is printed before them):

```diff
diff --git a/kernel/tests/skp_admission.rs b/kernel/tests/skp_admission.rs
index fc28eb31..80d3f709 100644
--- a/kernel/tests/skp_admission.rs
+++ b/kernel/tests/skp_admission.rs
@@ -873,7 +873,8 @@ async fn cancel_reaches_the_producer_directly_once() -> Result<(), OrderingRaceO
     // Wait for the stream to be genuinely producing before cancelling — cancelling an operation
     // that has not started anything yet would prove nothing about mid-flight observation. The loop
     // only exits by `break` below; falling through would mean the deadline panicked first.
-    loop {
+    let mut batches_total: u32 = 0;
+    while batches_total < 2 {
         let msg = tokio::time::timeout(RECV_DEADLINE, c.next())
             .await
             .expect("no timeout waiting for the first batch")
@@ -881,7 +882,7 @@ async fn cancel_reaches_the_producer_directly_once() -> Result<(), OrderingRaceO
             .expect("not a transport error");
         let Message::Binary(b) = msg else { continue };
         if b.first() == Some(&wire::TAG_BATCH) {
-            break;
+            batches_total += 1;
         }
     }
 
@@ -893,24 +894,50 @@ async fn cancel_reaches_the_producer_directly_once() -> Result<(), OrderingRaceO
         outcome.unwrap().state,
         spatial_skp::v0::CancelState::Requested
     );
+    c.send(Message::Binary(
+        wire::frame(wire::TAG_CREDIT, &u32::MAX.to_be_bytes()).into(),
+    ))
+    .await
+    .expect("credit after cancel");
 
     // Drain to a terminal. `SkpHost::cancel` interrupts the engine directly (ADR-019's Consequences); the
     // adapter's own `StreamState` never saw a CANCEL control frame, so the terminal code the wire
     // reports is `TERM_PRODUCER_FAILED` carrying the engine's own "cancelled" text — a
     // characteristic of this convergence path, asserted here rather than assumed.
     let mut terminal_code = None;
+    let mut timed_out = false;
+    let mut batches_after_cancel: u32 = 0;
     loop {
         let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
             Ok(Some(Ok(m))) => m,
             Ok(Some(Err(_))) | Ok(None) => break,
-            Err(_) => panic!("timed out waiting for the terminal frame after cancel"),
+            Err(_) => {
+                timed_out = true;
+                break;
+            }
         };
         let Message::Binary(b) = msg else { continue };
+        if b.first() == Some(&wire::TAG_BATCH) {
+            batches_total += 1;
+            batches_after_cancel += 1;
+        }
         if b.first() == Some(&wire::TAG_TERMINAL) {
             terminal_code = b.get(wire::FRAME_PREFIX_LEN).copied();
             break;
         }
     }
+    let trace = guard.trace();
+    let requested = trace.first(trace::CANCELLATION_REQUESTED);
+    let observed = trace.first(trace::PRODUCER_CANCELLED);
+    drop(guard);
+    eprintln!(
+        "VARIANT-OBS timed_out_at_60s_after_host_cancel_return={timed_out} \
+         terminal_code={terminal_code:?} tag_batch_total_whole_run={batches_total} \
+         tag_batch_between_host_cancel_return_and_end_of_drain={batches_after_cancel} \
+         CANCELLATION_REQUESTED_offset_ns={:?} PRODUCER_CANCELLED_offset_ns={:?}",
+        requested.as_ref().map(|e| e.offset_nanos),
+        observed.as_ref().map(|e| e.offset_nanos)
+    );
     assert_eq!(
         terminal_code,
         Some(wire::TERM_PRODUCER_FAILED),
@@ -918,11 +945,6 @@ async fn cancel_reaches_the_producer_directly_once() -> Result<(), OrderingRaceO
          cancel reached the engine directly rather than through a data-plane CANCEL frame"
     );
 
-    let trace = guard.trace();
-    let requested = trace.first(trace::CANCELLATION_REQUESTED);
-    let observed = trace.first(trace::PRODUCER_CANCELLED);
-    drop(guard);
-
     let requested =
         requested.expect("cancel_requested must be stamped — CancelToken::cancel() ran");
     let observed = observed.expect(
```

R-1c: no diff (the unmodified test at 1c71ebaf).

R-3 (protocol/data-plane/tests/candidate_a.rs; credit 12 instead of 100, factory(12, 4096, 0) unchanged; recv_by prints RECV_BY-TIMEOUT and returns None instead of panicking; the assertions are replaced by the VARIANT-OBS line):

```diff
diff --git a/protocol/data-plane/tests/candidate_a.rs b/protocol/data-plane/tests/candidate_a.rs
index cb3073d9..c3fcb6c3 100644
--- a/protocol/data-plane/tests/candidate_a.rs
+++ b/protocol/data-plane/tests/candidate_a.rs
@@ -205,7 +205,10 @@ async fn recv_by(c: &mut Client, what: &str) -> Option<Message> {
     match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
         Ok(Some(Ok(m))) => Some(m),
         Ok(Some(Err(_))) | Ok(None) => None,
-        Err(_) => panic!("timed out after {RECV_DEADLINE:?} waiting for {what}"),
+        Err(_) => {
+            eprintln!("RECV_BY-TIMEOUT after {RECV_DEADLINE:?} waiting for {what}");
+            None
+        }
     }
 }
 
@@ -262,34 +265,12 @@ async fn every_batch_and_a_terminal_frame_are_delivered() {
     let mut c = connect(&dp).await.expect("connect");
 
     send_start(&mut c).await;
-    grant(&mut c, 100).await;
+    grant(&mut c, 12).await;
     let r = drain(&mut c).await;
-
-    assert!(r.opened, "the stream announces itself in band");
-    assert_eq!(r.batches, 12, "every batch arrives");
-    assert_eq!(r.terminal.as_ref().unwrap().0, wire::TERM_COMPLETED);
-    assert!(
-        r.one_frame_per_message,
-        "a message carried more or less than one frame; the payload offset is then not fixed"
-    );
-    assert_eq!(r.payload_offsets, vec![wire::FRAME_PREFIX_LEN]);
-    assert!(
-        r.payload_offsets.iter().all(|o| o % 8 == 0),
-        "payloads must start 8-byte aligned inside the delivered message"
+    eprintln!(
+        "VARIANT-OBS credit=12 opened={} tag_batch_received={} terminal={:?}",
+        r.opened, r.batches, r.terminal
     );
-    assert_eq!(
-        dp.json_frames_seen.load(Ordering::SeqCst),
-        0,
-        "H5: zero JSON bytes on the data path"
-    );
-
-    // Progress is monotonic and its total is known here, so it is a real denominator.
-    assert!(r
-        .progress
-        .windows(2)
-        .all(|w| w[0].0 < w[1].0 && w[0].1 <= w[1].1));
-    assert_eq!(r.progress.last().unwrap().2, 12);
-    dp.shutdown().await;
 }
 
 #[tokio::test]
```

R-3b (as R-3 with credit 13; the full diff):

```diff
diff --git a/protocol/data-plane/tests/candidate_a.rs b/protocol/data-plane/tests/candidate_a.rs
index cb3073d9..377618d9 100644
--- a/protocol/data-plane/tests/candidate_a.rs
+++ b/protocol/data-plane/tests/candidate_a.rs
@@ -205,7 +205,10 @@ async fn recv_by(c: &mut Client, what: &str) -> Option<Message> {
     match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
         Ok(Some(Ok(m))) => Some(m),
         Ok(Some(Err(_))) | Ok(None) => None,
-        Err(_) => panic!("timed out after {RECV_DEADLINE:?} waiting for {what}"),
+        Err(_) => {
+            eprintln!("RECV_BY-TIMEOUT after {RECV_DEADLINE:?} waiting for {what}");
+            None
+        }
     }
 }
 
@@ -262,34 +265,12 @@ async fn every_batch_and_a_terminal_frame_are_delivered() {
     let mut c = connect(&dp).await.expect("connect");
 
     send_start(&mut c).await;
-    grant(&mut c, 100).await;
+    grant(&mut c, 13).await;
     let r = drain(&mut c).await;
-
-    assert!(r.opened, "the stream announces itself in band");
-    assert_eq!(r.batches, 12, "every batch arrives");
-    assert_eq!(r.terminal.as_ref().unwrap().0, wire::TERM_COMPLETED);
-    assert!(
-        r.one_frame_per_message,
-        "a message carried more or less than one frame; the payload offset is then not fixed"
-    );
-    assert_eq!(r.payload_offsets, vec![wire::FRAME_PREFIX_LEN]);
-    assert!(
-        r.payload_offsets.iter().all(|o| o % 8 == 0),
-        "payloads must start 8-byte aligned inside the delivered message"
+    eprintln!(
+        "VARIANT-OBS credit=13 opened={} tag_batch_received={} terminal={:?}",
+        r.opened, r.batches, r.terminal
     );
-    assert_eq!(
-        dp.json_frames_seen.load(Ordering::SeqCst),
-        0,
-        "H5: zero JSON bytes on the data path"
-    );
-
-    // Progress is monotonic and its total is known here, so it is a real denominator.
-    assert!(r
-        .progress
-        .windows(2)
-        .all(|w| w[0].0 < w[1].0 && w[0].1 <= w[1].1));
-    assert_eq!(r.progress.last().unwrap().2, 12);
-    dp.shutdown().await;
 }
 
 #[tokio::test]
```

## 4. Run outcomes (one table row per run or printed attempt)

R-1 table (one row per run; kernel/tests/skp_admission.rs variant R-1)

| run | exit | test result line | timed out at 60 s after host.cancel returned | terminal code | TAG_BATCH whole run | TAG_BATCH after host.cancel returned | CANCELLATION_REQUESTED offset (ns) | PRODUCER_CANCELLED offset (ns) |
|---|---|---|---|---|---|---|---|---|
| 1 | rc=0 | test result: ok. 1 passed; 0 failed | true | None | 2 | 0 | Some(30746100) | Some(30747800) |
| 2 | rc=0 | test result: ok. 1 passed; 0 failed | true | None | 2 | 0 | Some(26956200) | Some(26957500) |
| 3 | rc=0 | test result: ok. 1 passed; 0 failed | true | None | 2 | 0 | Some(21835000) | Some(21836000) |
| 4 | rc=0 | test result: ok. 1 passed; 0 failed | true | None | 2 | 0 | Some(21279100) | Some(21281000) |
| 5 | rc=0 | test result: ok. 1 passed; 0 failed | true | None | 2 | 0 | Some(22795000) | Some(22796700) |
| 6 | rc=0 | test result: ok. 1 passed; 0 failed | true | None | 2 | 0 | Some(22772900) | Some(22773900) |
| 7 | rc=0 | test result: ok. 1 passed; 0 failed | true | None | 2 | 0 | Some(20650900) | Some(20651800) |
| 8 | rc=0 | test result: ok. 1 passed; 0 failed | true | None | 2 | 0 | Some(22471300) | Some(22472300) |
| 9 | rc=0 | test result: ok. 1 passed; 0 failed | true | None | 2 | 0 | Some(21671600) | Some(21672700) |
| 10 | rc=0 | test result: ok. 1 passed; 0 failed | true | None | 2 | 0 | Some(20820900) | Some(20823500) |

R-1b table (one row per attempt printed; the test's own retry wrapper re-runs an attempt on the known ordering race, so a run can print two rows)

| run | attempt line | exit | test result line | timed out | terminal code (2 = TERM_PRODUCER_FAILED) | TAG_BATCH whole run | TAG_BATCH between host.cancel return and terminal | CANCELLATION_REQUESTED offset (ns) | PRODUCER_CANCELLED offset (ns) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(20097400) | Some(20098300) |
| 2 | 1 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(17731200) | Some(17732100) |
| 3 | 1 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(17210100) | Some(17212000) |
| 4 | 1 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(19265300) | Some(19266600) |
| 5 | 1 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(20395600) | Some(20397200) |
| 6 | 1 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(32097100) | Some(32096200) |
| 6 | 2 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(37950800) | Some(37953100) |
| 7 | 1 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(23310300) | Some(23311500) |
| 8 | 1 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(20591400) | Some(20592500) |
| 9 | 1 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(18676900) | Some(18678400) |
| 10 | 1 | rc=0 | test result: ok. 1 passed; 0 failed | false | Some(2) | 2 | 0 | Some(17723300) | Some(17724700) |

R-1c table (unmodified test)

| run | exit | test result line | retry-wrapper attempt lines printed |
|---|---|---|---|
| 1 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 2 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 3 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 4 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 5 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 6 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 7 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 8 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 9 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 10 | rc=0 | test result: ok. 1 passed; 0 failed | 1 |
| 11 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 12 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 13 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 14 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 15 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 16 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 17 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 18 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 19 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |
| 20 | rc=0 | test result: ok. 1 passed; 0 failed | 0 |

R-3 table (credit 12)

| run | exit | TAG_BATCH received | opened | terminal | recv_by deadline reached (RECV_BY-TIMEOUT printed) |
|---|---|---|---|---|---|
| 1 | rc=0 | 12 | true | None | 1 |
| 2 | rc=0 | 12 | true | None | 1 |
| 3 | rc=0 | 12 | true | None | 1 |
| 4 | rc=0 | 12 | true | None | 1 |
| 5 | rc=0 | 12 | true | None | 1 |
| 6 | rc=0 | 12 | true | None | 1 |
| 7 | rc=0 | 12 | true | None | 1 |
| 8 | rc=0 | 12 | true | None | 1 |
| 9 | rc=0 | 12 | true | None | 1 |
| 10 | rc=0 | 12 | true | None | 1 |

R-3b table (credit 13)

| run | exit | TAG_BATCH received | opened | terminal (code, text) | recv_by deadline reached |
|---|---|---|---|---|---|
| 1 | rc=0 | 12 | true | Some((0, "")) | 0 |
| 2 | rc=0 | 12 | true | Some((0, "")) | 0 |
| 3 | rc=0 | 12 | true | Some((0, "")) | 0 |
| 4 | rc=0 | 12 | true | Some((0, "")) | 0 |
| 5 | rc=0 | 12 | true | Some((0, "")) | 0 |
| 6 | rc=0 | 12 | true | Some((0, "")) | 0 |
| 7 | rc=0 | 12 | true | Some((0, "")) | 0 |
| 8 | rc=0 | 12 | true | Some((0, "")) | 0 |
| 9 | rc=0 | 12 | true | Some((0, "")) | 0 |
| 10 | rc=0 | 12 | true | Some((0, "")) | 0 |

## 5. Verbatim output of every timed-out run

No run failed. The timed-out runs are R-1's 10 runs (the recorded 60 s deadline) and R-3's 10 runs (the recorded 30 s deadline). Each log is the full captured output of one cargo test invocation, followed by the appended exit code line.

### R1 run 1

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.65s
     Running tests\skp_admission.rs (D:/wt-targets/timing-r\debug\deps\skp_admission-7b6159bf50ded573.exe)

running 1 test
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock has been running for over 60 seconds
VARIANT-OBS timed_out_at_60s_after_host_cancel_return=true terminal_code=None tag_batch_total_whole_run=2 tag_batch_between_host_cancel_return_and_end_of_drain=0 CANCELLATION_REQUESTED_offset_ns=Some(30746100) PRODUCER_CANCELLED_offset_ns=Some(30747800)
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 67.11s

rc=0
```

### R1 run 2

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.56s
     Running tests\skp_admission.rs (D:/wt-targets/timing-r\debug\deps\skp_admission-7b6159bf50ded573.exe)

running 1 test
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock has been running for over 60 seconds
VARIANT-OBS timed_out_at_60s_after_host_cancel_return=true terminal_code=None tag_batch_total_whole_run=2 tag_batch_between_host_cancel_return_and_end_of_drain=0 CANCELLATION_REQUESTED_offset_ns=Some(26956200) PRODUCER_CANCELLED_offset_ns=Some(26957500)
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 66.43s

rc=0
```

### R1 run 3

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.49s
     Running tests\skp_admission.rs (D:/wt-targets/timing-r\debug\deps\skp_admission-7b6159bf50ded573.exe)

running 1 test
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock has been running for over 60 seconds
VARIANT-OBS timed_out_at_60s_after_host_cancel_return=true terminal_code=None tag_batch_total_whole_run=2 tag_batch_between_host_cancel_return_and_end_of_drain=0 CANCELLATION_REQUESTED_offset_ns=Some(21835000) PRODUCER_CANCELLED_offset_ns=Some(21836000)
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 65.48s

rc=0
```

### R1 run 4

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.47s
     Running tests\skp_admission.rs (D:/wt-targets/timing-r\debug\deps\skp_admission-7b6159bf50ded573.exe)

running 1 test
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock has been running for over 60 seconds
VARIANT-OBS timed_out_at_60s_after_host_cancel_return=true terminal_code=None tag_batch_total_whole_run=2 tag_batch_between_host_cancel_return_and_end_of_drain=0 CANCELLATION_REQUESTED_offset_ns=Some(21279100) PRODUCER_CANCELLED_offset_ns=Some(21281000)
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 65.73s

rc=0
```

### R1 run 5

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.47s
     Running tests\skp_admission.rs (D:/wt-targets/timing-r\debug\deps\skp_admission-7b6159bf50ded573.exe)

running 1 test
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock has been running for over 60 seconds
VARIANT-OBS timed_out_at_60s_after_host_cancel_return=true terminal_code=None tag_batch_total_whole_run=2 tag_batch_between_host_cancel_return_and_end_of_drain=0 CANCELLATION_REQUESTED_offset_ns=Some(22795000) PRODUCER_CANCELLED_offset_ns=Some(22796700)
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 65.34s

rc=0
```

### R1 run 6

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.47s
     Running tests\skp_admission.rs (D:/wt-targets/timing-r\debug\deps\skp_admission-7b6159bf50ded573.exe)

running 1 test
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock has been running for over 60 seconds
VARIANT-OBS timed_out_at_60s_after_host_cancel_return=true terminal_code=None tag_batch_total_whole_run=2 tag_batch_between_host_cancel_return_and_end_of_drain=0 CANCELLATION_REQUESTED_offset_ns=Some(22772900) PRODUCER_CANCELLED_offset_ns=Some(22773900)
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 65.31s

rc=0
```

### R1 run 7

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.68s
     Running tests\skp_admission.rs (D:/wt-targets/timing-r\debug\deps\skp_admission-7b6159bf50ded573.exe)

running 1 test
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock has been running for over 60 seconds
VARIANT-OBS timed_out_at_60s_after_host_cancel_return=true terminal_code=None tag_batch_total_whole_run=2 tag_batch_between_host_cancel_return_and_end_of_drain=0 CANCELLATION_REQUESTED_offset_ns=Some(20650900) PRODUCER_CANCELLED_offset_ns=Some(20651800)
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 64.95s

rc=0
```

### R1 run 8

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.47s
     Running tests\skp_admission.rs (D:/wt-targets/timing-r\debug\deps\skp_admission-7b6159bf50ded573.exe)

running 1 test
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock has been running for over 60 seconds
VARIANT-OBS timed_out_at_60s_after_host_cancel_return=true terminal_code=None tag_batch_total_whole_run=2 tag_batch_between_host_cancel_return_and_end_of_drain=0 CANCELLATION_REQUESTED_offset_ns=Some(22471300) PRODUCER_CANCELLED_offset_ns=Some(22472300)
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 65.23s

rc=0
```

### R1 run 9

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.45s
     Running tests\skp_admission.rs (D:/wt-targets/timing-r\debug\deps\skp_admission-7b6159bf50ded573.exe)

running 1 test
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock has been running for over 60 seconds
VARIANT-OBS timed_out_at_60s_after_host_cancel_return=true terminal_code=None tag_batch_total_whole_run=2 tag_batch_between_host_cancel_return_and_end_of_drain=0 CANCELLATION_REQUESTED_offset_ns=Some(21671600) PRODUCER_CANCELLED_offset_ns=Some(21672700)
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 65.23s

rc=0
```

### R1 run 10

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.42s
     Running tests\skp_admission.rs (D:/wt-targets/timing-r\debug\deps\skp_admission-7b6159bf50ded573.exe)

running 1 test
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock has been running for over 60 seconds
VARIANT-OBS timed_out_at_60s_after_host_cancel_return=true terminal_code=None tag_batch_total_whole_run=2 tag_batch_between_host_cancel_return_and_end_of_drain=0 CANCELLATION_REQUESTED_offset_ns=Some(20820900) PRODUCER_CANCELLED_offset_ns=Some(20823500)
test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 9 filtered out; finished in 64.99s

rc=0
```

### R3 run 1

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.25s
     Running tests\candidate_a.rs (D:/wt-targets/timing-r\debug\deps\candidate_a-b0c77ead573c2d8c.exe)

running 1 test
RECV_BY-TIMEOUT after 30s waiting for a frame, or the connection to end
VARIANT-OBS credit=12 opened=true tag_batch_received=12 terminal=None
test every_batch_and_a_terminal_frame_are_delivered ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 10 filtered out; finished in 30.02s

rc=0
```

### R3 run 2

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.26s
     Running tests\candidate_a.rs (D:/wt-targets/timing-r\debug\deps\candidate_a-b0c77ead573c2d8c.exe)

running 1 test
RECV_BY-TIMEOUT after 30s waiting for a frame, or the connection to end
VARIANT-OBS credit=12 opened=true tag_batch_received=12 terminal=None
test every_batch_and_a_terminal_frame_are_delivered ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 10 filtered out; finished in 30.01s

rc=0
```

### R3 run 3

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.26s
     Running tests\candidate_a.rs (D:/wt-targets/timing-r\debug\deps\candidate_a-b0c77ead573c2d8c.exe)

running 1 test
RECV_BY-TIMEOUT after 30s waiting for a frame, or the connection to end
VARIANT-OBS credit=12 opened=true tag_batch_received=12 terminal=None
test every_batch_and_a_terminal_frame_are_delivered ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 10 filtered out; finished in 30.02s

rc=0
```

### R3 run 4

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.22s
     Running tests\candidate_a.rs (D:/wt-targets/timing-r\debug\deps\candidate_a-b0c77ead573c2d8c.exe)

running 1 test
RECV_BY-TIMEOUT after 30s waiting for a frame, or the connection to end
VARIANT-OBS credit=12 opened=true tag_batch_received=12 terminal=None
test every_batch_and_a_terminal_frame_are_delivered ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 10 filtered out; finished in 30.02s

rc=0
```

### R3 run 5

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.25s
     Running tests\candidate_a.rs (D:/wt-targets/timing-r\debug\deps\candidate_a-b0c77ead573c2d8c.exe)

running 1 test
RECV_BY-TIMEOUT after 30s waiting for a frame, or the connection to end
VARIANT-OBS credit=12 opened=true tag_batch_received=12 terminal=None
test every_batch_and_a_terminal_frame_are_delivered ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 10 filtered out; finished in 30.02s

rc=0
```

### R3 run 6

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.28s
     Running tests\candidate_a.rs (D:/wt-targets/timing-r\debug\deps\candidate_a-b0c77ead573c2d8c.exe)

running 1 test
RECV_BY-TIMEOUT after 30s waiting for a frame, or the connection to end
VARIANT-OBS credit=12 opened=true tag_batch_received=12 terminal=None
test every_batch_and_a_terminal_frame_are_delivered ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 10 filtered out; finished in 30.02s

rc=0
```

### R3 run 7

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.22s
     Running tests\candidate_a.rs (D:/wt-targets/timing-r\debug\deps\candidate_a-b0c77ead573c2d8c.exe)

running 1 test
RECV_BY-TIMEOUT after 30s waiting for a frame, or the connection to end
VARIANT-OBS credit=12 opened=true tag_batch_received=12 terminal=None
test every_batch_and_a_terminal_frame_are_delivered ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 10 filtered out; finished in 30.02s

rc=0
```

### R3 run 8

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.22s
     Running tests\candidate_a.rs (D:/wt-targets/timing-r\debug\deps\candidate_a-b0c77ead573c2d8c.exe)

running 1 test
RECV_BY-TIMEOUT after 30s waiting for a frame, or the connection to end
VARIANT-OBS credit=12 opened=true tag_batch_received=12 terminal=None
test every_batch_and_a_terminal_frame_are_delivered ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 10 filtered out; finished in 30.01s

rc=0
```

### R3 run 9

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.21s
     Running tests\candidate_a.rs (D:/wt-targets/timing-r\debug\deps\candidate_a-b0c77ead573c2d8c.exe)

running 1 test
RECV_BY-TIMEOUT after 30s waiting for a frame, or the connection to end
VARIANT-OBS credit=12 opened=true tag_batch_received=12 terminal=None
test every_batch_and_a_terminal_frame_are_delivered ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 10 filtered out; finished in 30.01s

rc=0
```

### R3 run 10

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.24s
     Running tests\candidate_a.rs (D:/wt-targets/timing-r\debug\deps\candidate_a-b0c77ead573c2d8c.exe)

running 1 test
RECV_BY-TIMEOUT after 30s waiting for a frame, or the connection to end
VARIANT-OBS credit=12 opened=true tag_batch_received=12 terminal=None
test every_batch_and_a_terminal_frame_are_delivered ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 10 filtered out; finished in 30.02s

rc=0
```

## 6. Results against §5's predictions, row by row

Each row states the prediction as §5 words it, what the logs in §4 and §5 show, and whether it held. All counts are over the tables above and the verbatim logs below (re-counted with grep over the run logs).

| Row | §5 prediction | Observed | Held |
|---|---|---|---|
| R-1 (10 runs) | no TAG_TERMINAL within the 60 s deadline in 10 of 10 runs; exactly 2 TAG_BATCH in each | 10 of 10 runs: timed out at 60 s after host.cancel returned, terminal_code=None; TAG_BATCH whole run = 2 in 10 of 10 (0 after host.cancel returned) | yes, 10 of 10, both parts |
| R-1 stamps (no prediction) | CANCELLATION_REQUESTED and PRODUCER_CANCELLED recorded, present or absent | both present in 10 of 10 runs; in each, the PRODUCER_CANCELLED offset is later than the CANCELLATION_REQUESTED offset on the trace clock | recorded, no prediction |
| R-1b (10 runs, 11 attempts printed) | TERM_PRODUCER_FAILED in 10 of 10 runs | terminal_code=Some(2) (wire::TERM_PRODUCER_FAILED = 2, protocol/data-plane/src/wire.rs:37) in 11 of 11 printed attempts, in all 10 runs; no attempt timed out | yes, 10 of 10 runs |
| R-1b stamps | both stamps present | both present in 11 of 11 attempts. One attempt (run 6, attempt 1) printed PRODUCER_CANCELLED offset 32096200 before CANCELLATION_REQUESTED offset 32097100: the documented ordering race, which the test's own retry wrapper retried (attempt line in run 6's log); run 6's attempt 2 had them in order | yes (presence); the ordering-race attempt is recorded, a class-2 result that does not route |
| R-1b count | at most 7 TAG_BATCH between host.cancel's return and the terminal, in each run | 0 in 11 of 11 attempts (whole-run count 2 each) | yes |
| R-1b remaining assertions | stay; failures recorded by message | the test result line is `ok. 1 passed; 0 failed` in 10 of 10 runs; no assertion message was printed | no failure to record |
| R-1c (20 runs) | 20 of 20 pass | 20 of 20 `1 passed; 0 failed`, rc=0; run 10 printed one retry-wrapper attempt line (the ordering race, requested 18354400 ns, observed 18353500 ns) and passed on its second attempt | yes, 20 of 20 |
| R-3 (10 runs, credit 12) | 12 TAG_BATCH, then no terminal before recv_by's deadline, in 10 of 10 | 10 of 10: tag_batch_received=12, terminal=None, RECV_BY-TIMEOUT printed once (30 s deadline, `what` = "a frame, or the connection to end") | yes, 10 of 10 |
| R-3b (10 runs, credit 13) | 12 TAG_BATCH, then TERM_COMPLETED, in 10 of 10 | 10 of 10: tag_batch_received=12, terminal=Some((0, "")) (wire::TERM_COMPLETED = 0), no deadline reached | yes, 10 of 10 |

Observed batch counts, in one place:
- R-1: 2 TAG_BATCH whole run, 0 after host.cancel returned, in each of 10 runs.
- R-1b: 2 TAG_BATCH whole run, 0 between host.cancel's return and the terminal, in each of 11 attempts.
- R-3: 12 TAG_BATCH, then no terminal, in each of 10 runs. R-3b: 12 TAG_BATCH, then a terminal with code 0, in each of 10 runs.
- No run in any variant failed or panicked. The "timed-out" runs are R-1's 10 runs (the recorded 60 s deadline) and R-3's 10 runs (the recorded 30 s deadline); their full logs are filed verbatim in §5. Runs of R-1b, R-1c and R-3b had no timeout and no failure.

## 7. Routing (§5)

S1 if and only if R-1's terminal prediction and R-1b's terminal-code prediction both hold in every run; otherwise S2.

- Deciding row 1, R-1's terminal prediction (no TAG_TERMINAL within the 60 s deadline): held in 10 of 10 runs.
- Deciding row 2, R-1b's terminal-code prediction (TERM_PRODUCER_FAILED): held in 10 of 10 runs (11 of 11 attempts).
- Both hold in every run, so the routing is **S1**.
- Rows that do not route (§5): R-1b's stamp and count predictions held (the one ordering-race attempt is recorded above); R-1c held 20 of 20; R-3 and R-3b held 10 of 10 each. No miss on a non-routing row has to be carried to the data-plane form. R-3 and R-3b's observed result is the §2 (ii) input (Fable's item 1): at credit equal to the batch count (12) no terminal arrived before the deadline, at credit 13 TERM_COMPLETED arrived.
- R-1b's batches-after-cancel counts (§2 (iii), Fable's item 2): 0 in each of 11 attempts.
- Making the routing record and appending any node are the custodian's work, not this consult's.

Reading of H-S, limited as §1 and §8 item 8 require: H-S is observed only as far as R-1 and R-1b observed it, in scratch, at 1c71ebafb6fd829d754b7733073b088575829955: with credit 2 granted once and no further credit, a host.cancel after two TAG_BATCH frames was followed by no terminal within 60 s in 10 of 10 runs while both trace stamps were present; with one CREDIT of u32::MAX granted right after host.cancel returned, a terminal with code TERM_PRODUCER_FAILED followed in every run. No claim is made about the shipped build beyond that, about where any item was held, or that any flake is fixed. The recorded skp CI failure's line (kernel/tests/skp_admission.rs:906 at 02dfcff3) was not itself reproduced in an unmodified test: R-1c, the unmodified test, passed 20 of 20, and R-1's variant is a different test that does not panic at that line.

## 8. Summary sentences, each resolved against the steps and run logs (§2 final step)

1. Every variant's diff was taken by `git diff` at 1c71ebafb6fd829d754b7733073b088575829955, with the file reverted to that commit before R-1b and before R-3. Resolved: git rev-parse HEAD printed that hash first; R-1c ran first on the unmodified tree; `git checkout -- kernel/tests/skp_admission.rs` ran after R-1 and after R-1b, and `git checkout -- protocol/data-plane/tests/candidate_a.rs` ran after R-3b. One departure from "revert before the next", disclosed: R-3b was made from R-3's edit by a `sed` on the credit and label lines without a revert in between (the two diffs differ in three lines, §3); each diff is the whole difference from 1c71ebaf at the time of its runs.
2. The code trees between 02dfcff3 and 1c71ebaf are identical. Resolved: `git diff --stat 02dfcff3 1c71ebaf -- kernel/src kernel/tests engine protocol` printed nothing (rc=0); the form's wider `-- kernel engine protocol` prints only the form's own file, and `--numstat` over `*.rs` and `*.toml` printed nothing.
3. R-1 ran 10 times and R-1b 10 times (11 attempts), R-1c 20 times, R-3 10 times, R-3b 10 times. Resolved: the table row counts in §4 (10, 10 runs / 11 rows, 20, 10, 10) and the log file counts.
4. R-1: no terminal within 60 s and 2 TAG_BATCH in 10 of 10 runs. Resolved: grep over the 10 VARIANT-OBS lines gave timed_out=true 10, terminal_code=None 10, tag_batch_total_whole_run=2 10.
5. R-1b: TERM_PRODUCER_FAILED in every run, both stamps present, 0 TAG_BATCH between host.cancel's return and the terminal. Resolved: grep over the 11 VARIANT-OBS lines gave terminal_code=Some(2) 11, both offsets Some 11, between_...=0 11, timed_out=true 0; Some(2) read against wire.rs:37.
6. R-1c: 20 of 20 passed. Resolved: 20 logs contain `1 passed; 0 failed` and rc=0; one printed a retry-wrapper attempt line.
7. R-3: 12 TAG_BATCH then no terminal before the 30 s deadline in 10 of 10 runs; R-3b: 12 TAG_BATCH then TERM_COMPLETED in 10 of 10 runs. Resolved: grep counts 10 (tag_batch_received=12 terminal=None, RECV_BY-TIMEOUT 10) and 10 (terminal=Some((0, "")), RECV_BY-TIMEOUT 0).
8. The routing is S1, decided by R-1's terminal row and R-1b's terminal-code row. Resolved: both held in every run per sentences 4 and 5 and §5's condition.
9. No run failed, no process was left running, every scratch edit was reverted, and the worktree is clean at 1c71ebaf. Resolved: all 60 invocations (20 + 10 + 10 + 10 + 10) have rc=0; `tasklist` filtered for cargo, rustc, skp_admission and candidate_a printed nothing after the last revert and again immediately before this file was assembled; `git status --porcelain` printed nothing and `git rev-parse HEAD` printed 1c71ebafb6fd829d754b7733073b088575829955 at both of those moments.
