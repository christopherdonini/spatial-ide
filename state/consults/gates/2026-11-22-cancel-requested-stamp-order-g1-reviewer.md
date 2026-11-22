Reviewed: cut/cancel-stamp-order at 3f3820c9eddaca61d503c76e8d2308e50c6a8667 (the custodian's filing note, 2026-11-22: PR 350's code gate 1, the reviewer, beside the architect (ADV-2026-11-22-10 item 5); Read 7, Bash 69, SubagentHandback 1, by unique call ids, one Bash call errored (a listing of a scratch path that did not exist), model claude-opus-5-5, from 2026-11-22T10:17:34Z to 2026-11-22T11:10:44Z by its transcript; it read records in the main checkout from 2026-11-22T10:18:00Z to 10:21:31Z, before 1122o was committed, its brief having named the read worktree; the report below byte for byte from its hand-back of 15981 bytes, sha256 35812614cc8d8dcd2f3fac35c9b93a616abaa9ce64a0f2b41e9d0f62ba5aec03, 1 value masked by the custodian (a project= value, as <m>), with this note in its first line and one final newline), gate, reviewer
Verdict: PASS WITH NOTES, PR #350 @ 3f3820c9eddaca61d503c76e8d2308e50c6a8667

Reviewed: cut/cancel-stamp-order @ 3f3820c9eddaca61d503c76e8d2308e50c6a8667. Merge base 4b7655a255590bff20dc2c866b5ae1b7568b112f. I read in C:/dev/wt/gate-read, detached at the head; `git status --porcelain` was empty before and after. Exports were built under `<S>` with targets under D:/wt-targets/cancel-g1. Each heavy run was inside a shared hold: the hold line was `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF ... also=<m>`, and each run ended with `MACHINE_RELEASED`. No exit code from 96 to 99 appeared. Nothing I started is still running: `ps -W` shows no cargo, rustc or test binary.

The ruling ADV-2026-11-22-10 has no tracked file on main at 8b5fd6d9. `git ls-files | grep adv-2026-11-22-10` returned nothing. I read it from the scratch copy `<S>/adv-22-10.md` (see DOC-2).

## Correctness
None. There is nothing blocking.

## Evidence
None open. The piece's evidence holds. I did have to void one set of my own runs and re-run it:
- My first C1 set ran on the shared target D:/wt-targets/cancel-g1 straight after the head export. It ran the head's binaries. `<S>/g1r-c1-build-engine.log` shows "Finished ... in 0.67s" with no compile, and the lib test binary is `spatial_engine-ed6c0faaf45917bf.exe` in both exports.
- The cause: path packages get a workspace-relative unit hash, and the dep-info files point at the head export's sources.
- That set is VOID. I re-ran C1 on its own target, D:/wt-targets/cancel-g1/c1 (log `<S>/g1r-c1r-*`). That build did compile from the C1 export: `Compiling spatial-engine ... g1r-exp-c1`.

## Check 1: CI's skipped steps, at the head in gate-read (one background call, results in `<S>/g1r-*.log`)
- `node scripts/plan/verify-quotes.mjs`: rc=0. "verify:quotes PASS — 159 checked, 128 verified, 30 baselined, 1 advisory, ... 0 hash-reference errors (2 hash-baselined) ... 937 ruling cites resolved, 0 ruling-cite errors."
- `node scripts/plan/verify-test-claims.mjs`: rc=0. "verify:test-claims PASS — all 895 claimed test(s) across 281 file(s) ..."
- `node scripts/plan/verify.mjs --offline`: rc=0. "verify:plan PASS".
- `node scripts/plan/verify-cites.mjs`: rc=1. "verify:cites FAIL — 10 unresolved in-tree reference(s)". The ten are exactly the brief's list:
  - the form at :13 (twice), :169 (twice), :170, :174 and :175;
  - `state/consults/2026-10-04-timing-tests-assert-property-not-budget-architect-draft.md:18`;
  - `state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:64` and `:65`.
  - Each one runs past skp_admission.rs (908 lines) or skp_filter_cancellation.rs (252 lines). This is the ruled known state, so it is not a finding.
- Nothing else is red. `gh pr checks 350` (rc=1, read at 10:33:26Z): every check passes except the verify:plan job in both runs. Windows `cargo test --workspace` has now passed in PR run 45010506562 (18m5s).
- N-d, my own recomputation: `node <S>/g1r-pins.mjs` over form :398, :400-411 and :551-595 gave rc=0, "checked=54 mismatches=0". That covers:
  - Amendment 1's five-pin line;
  - item 2's three hashes (:407-409, plus the trace.rs:370-371 pin);
  - all 45 pins of Amendment 2.
- Byte comparisons:
  - Form :396 equals the attempt-1 report :26 @ eb1329ed with its `> ` removed (cmp rc=0).
  - Lead-data's draft :7-141 against form :390-537 (diff rc=1) differs in exactly three places: the added sentence in item 1's lead (cmp rc=0 once it is removed), the pins line, and item 2. So Amendment 2 item 7 holds.

## Check 2: the count (`git diff --numstat B...3f3820c9`, rc=0)
| File | Ins/Del |
|---|---|
| ADR-018 | 6/0 |
| engine/README.md | 3/3 |
| engine/src/cancel.rs | 345/8 |
| engine/src/trace.rs | 3/2 |
| engine/tests/cancel_request_stamp.rs | 199/0 |
| engine/tests/slice.rs | 5/1 |
| kernel/CANCELLATION-AND-TRACING.md | 8/0 |
| kernel/README.md | 2/2 |
| kernel/tests/skp_admission.rs | 11/53 |
| kernel/tests/skp_filter_cancellation.rs | 10/40 |

The total is 592 + 109 = 701 against the ceiling of 800. These are exactly the ten Scope paths (Amendment 1 item 3, Amendment 2 item 9); no other path changed.

## Check 3: the code against §2.1 to §2.6 and Amendment 1 items 6, 10, 12, 14 and 16 (cancel.rs at the head; it is byte-equal to C2, `git diff --stat ebdd0fd7 3f3820c9 -- engine/src/cancel.rs` is empty)
- **Order in `cancel_inner`.** Each step and its line:
  - lock `transition`: :187-192;
  - SeqCst load: :193;
  - `PublishOnDrop`: :197;
  - `BeforeStamp`: :198-199;
  - `mark`: :201;
  - count and `OnStamp`: :202-206;
  - `drop(publish)`, the only store to `cancelled` in the file: :208;
  - `AfterPublish`: :209-210;
  - the lock is released at the end of the block: :213.
  - The slot is taken at :214-218, and `first && in_execute.load(SeqCst)` is at :229.
  - This is §2.1, not a plain swap. The `swap` is gone, so §8 item 13 is met.
- **Lock order and no cycle (D3, N-a).** Under `transition` the only lock taken is through `trace::mark` → `mark_cold` → `CURRENT` (trace.rs:313), then `push` → buffer (:151). In the test build the seam slot mutex is also taken, released by `.take()` (:294) before the action runs. `start` and `TraceGuard::drop` take `CURRENT` alone and call no `cancel`. The slot is taken only after `transition` is released. The claim holds.
- **Hooks are test-only and fire on the first call only.**
  - Each is behind `#[cfg(test)]`: the field at :62-63, `Seam` at :67-69, `Seams` at :81, the try_lock probe at :180-186, the seam calls, and `set_seam`, `stamp_count`, `seam_slot` and `fire` at :261-298.
  - `fire` takes the action out (:294), so it runs once.
  - The only new `pub` items are `pub(crate)` under cfg(test).
- **The two trace promises.** At most once: T6, I1 and I2 are green at the head. `cancel_for_drop` stamps nothing: `stamp` is false, and T7, I4 and kernel `a_successful_run_stamps_no_cancellation_instant` are green at the head.
- **The producer-reach checks.** Both are preserved byte for byte:
  - The base spans skp_admission.rs:926-931 and skp_filter_cancellation.rs:269-274 hash to the form's 1b408595… and 7501e797… and each occurs once at the head, at :888 and :240.
  - :892-895, :914-919 and :244-247 are found once each.
  - The ordering `assert!` follows them as a separate statement, at skp_admission.rs:894-899 and skp_filter_cancellation.rs:246-251.
  - The 5 s bound (:943-948 at the base) is unchanged, now at :902.
- **No retry, sleep, longer timeout or skip.** The added lines of the diff contain no sleep, ignore or retry, and the only added `from_secs` is I3's constant. The unit waits use the existing `TEST_LIVENESS_DEADLINE`, as §2.8 allows.
- **N5 (item 16).** The doc comments on `cancel()` (:145-147) and `cancel_inner` (:173-178) state the order. The re-interrupter comment (:223) agrees with `first`.
- **slice.rs.** The only change is §2.6's `assert!(observed >= requested, …)` and the exact subtraction (:900-905). :917's `saturating_sub` is unchanged.

## Check 4: N-b
`engine/tests/cancel_request_stamp.rs` at the head:
- :94-95: the constant on its own line, with its comment line above it.
- :98: `for i in 0..M`.
- :106: `let deadline = Instant::now() + I3_SPIN_DEADLINE;`, set inside each iteration's observer thread, so the 60 s bounds each iteration.
- :108-114: `while !token.is_cancelled()` with a counter and the deadline check every 1024 spins (:111). There is no sleep.
- The worker's statement holds.

## Check 5: the discriminator (`<S>/g1r-disc.sh`, `<S>/g1r-c1redo.sh`; the rc of each test is in `<S>/g1r-disc-rc.txt` and `<S>/g1r-c1r-rc.txt`; each test was run by name with `--exact`)
- **Head**, the tests and their rc:
  - T1 to T8: rc=0, each "1 passed".
  - `cancellation_is_visible_and_sticky`: rc=0.
  - I1 to I4: rc=0. I3 printed "0 inversions in 200 iterations".
  - kernel `a_successful_run_stamps_no_cancellation_instant`: rc=0.
- **C1** (the valid set, on its own target):
  - T1: rc=101, "the cancelled flag was already published when the request was stamped", left 2, right 1.
  - T2: rc=101, "an observer that saw the flag found 0 request stamps, not 1".
  - T3, T4 and T5: rc=101, each after 60.0 s with its own deadline message ("B to …", "the drop to …", "the cancel to find the transition lock held").
  - T6, T7, T8, `cancellation_is_visible_and_sticky`, I1, I2 and I4: rc=0.
  - I3: rc=101, "32 inversions in 200 iterations".
- So T1 and T2 are red with their own messages at C1, and every test of §4.1 and §4.2 is green at the head.

## Check 6: mutations on the head export (`<S>/g1r-mut.sh`, `<S>/g1r-mut-rc.txt`)
Each was applied by `node <S>/g1r-mutate.mjs`, which refuses unless its anchor is found exactly once. I dry-ran both anchors, and a negative control returned "ANCHOR-COUNT 0", rc=1. After each mutation the file was restored, and `cmp` against `git show 3f3820c9:engine/src/cancel.rs` gave rc=0. The first run after each mutation recompiled spatial-engine.

**M1** (inside the lock: publication, `after_publish`, `before_stamp`, the mark, `on_stamp`), against Amendment 1 item 9:
- Killed T1 (rc=101 at cancel.rs:730, the flag message, left 2 right 1).
- Killed T2 (rc=101 at :761, "found 0 request stamps, not 1").
- T3 to T8, I1, I2 and I4 passed (rc=0). I3 passed, with 0 inversions.
- This matches item 9.

**M5** (`stamp` ignored), against Amendment 1 item 9 and Amendment 2 item 4:
- Killed T5 (rc=101, "a drop then a cancel stamped a request", left 1).
- Killed T7 (rc=101, "a drop stamped a request").
- Killed I4 (rc=101 at cancel_request_stamp.rs:188).
- Killed `a_successful_run_stamps_no_cancellation_instant` (rc=101 at trace_spans.rs:351).
- T1 to T4, T6, T8, I1 and I2 passed. I3 passed.
- This matches.

## Check 7: the worker's logs (read, not re-run)
- **C1 campaign** (`cst-camp-c1-*-summary.txt`):
  - skp_admission had 4 hits, in runs 15, 35, 43 and 46, each "attempt 1/5" with requested and observed 600 to 700 ns apart (for example "requested 17548800 ns, observed 17548200 ns"). All 50 runs had rc=0.
  - skp_filter_cancellation: 0 hits in 50.
- **C3 campaign:** 100 of 100 runs rc=0, and no log has a hit, an ordering failure or a panic (grep rc=1).
- **M2's extra I3 failure:** `cst-m2-int.log` has "2 inversions in 200 iterations" and a panic at cancel_request_stamp.rs:138:5. It is recorded, not claimed as a kill.
- **C4:** `cst-notes.log` has "NOTES-OK". No numstat log exists in `<S>`. My own head numstat reproduces 6/0, 8/0 and 3/2 (DOC-5).
- **Ruled texts.** I checked them myself:
  - The ADR-018 tail is blank, `---`, blank, the heading (cmp with the ruling's fence line, rc=0), blank, then line 155, which equals report :100 @ eb1329ed (sha 3b06d7a4…, cmp rc=0).
  - The kernel note's last 5 lines equal :126-130 (sha 29254115…), after blank, `---`, blank.
  - trace.rs:370-372 equals :218-220 (sha 7fb56c15…).
  - The only deletions in those three files are trace.rs's two ruled lines.

## Check 8: §8 items 1 to 13
1. Met. The only added timeout is cancel_request_stamp.rs:94-95, on its own line.
2. Met. T1 and T2 are red at C1 and green at the head (check 5), and the C3 counts are in the logs (check 7).
3. Met. The presence checks are byte-identical, with a separate ordering `assert!` (check 3).
4. Met. There is no Cargo.toml or Cargo.lock in the diff.
5. Met. No existing line is edited, the notes are byte-equal to the ruled text, no other ADR is touched, and trace.rs changes only in the ruled sentence (Amendment 1 item 3's bullet).
6. Met. All hooks are under cfg(test), and there is no new `pub` item.
7. Met. Every access to `cancelled` and `in_execute` is SeqCst (cancel.rs:93, :193, :229, :257).
8. Met. No mark is added in a per-row loop.
9. Met. The slot is taken after `transition` is released (:213 to :214), and `cancel_inner` is never called under `CURRENT`.
10. Met. No wire byte, user-visible string or walkthrough row changes.
11. Met. Ten paths, and slice.rs changes only in §2.6's lines.
12. Not applicable at this gate: the PR is an open draft (`gh pr view`), and the merge comes after the tag.
13. Met. The `in_execute` load (:229) comes after the publication (:208).

## Check 9: the clippy warning and C2's message
- **Clippy.** The warning is **not corrected** at 3f3820c9: cancel_request_stamp.rs:111 still reads `spins % 1024 != 0 || Instant::now() < deadline,`. No workflow has a clippy step (grep of `.github/workflows/` finds only a comment in rust-fmt.yml), so it gates nothing. The suggested fix is `!spins.is_multiple_of(1024) || Instant::now() < deadline,` (the toolchain is rustc 1.97.1). If it lands with the entries commit, it is a code line, so it needs the reviewer's narrow read (ADV-2026-11-22-10 item 5).
- **C2's message.** It says "The doc comments on cancel, cancel_for_drop and cancel_inner state the order." `git diff 4a26ed74 ebdd0fd7 -- engine/src/cancel.rs` has no line naming `cancel_for_drop`. This confirms the message is wrong. Record it in the closing amendment; nothing is rewritten.

## Documentation (must be fixed before the merge; none of these is the human's wording, so the worker applies the words with no re-gate and the PR body lists them)
- **DOC-1. Two test doc comments state as a guarantee an offset order the form lists as "Not proven" (§1; §5.3).** I judged this documentation, not an unsupported guarantee: the asserting test is the instrument, and no shipped-app observer reads these comments.
  - At kernel/tests/skp_admission.rs:762-763, replace "so the producer's `PRODUCER_CANCELLED` cannot / precede it. Equal offsets pass." so that lines 762-763 read:
    `/// before it publishes the flag a producer loads, so, under the clock assumption ADR-018's note of`
    `/// 2026-11-22 states, the producer's `PRODUCER_CANCELLED` does not precede it. Equal offsets pass.`
  - At kernel/tests/skp_filter_cancellation.rs:114-115, the lines read:
    `/// stamps `CANCELLATION_REQUESTED` before it publishes the flag a producer loads, so, under the`
    `/// clock assumption ADR-018's note of 2026-11-22 states, the producer's `PRODUCER_CANCELLED` does`
    `/// not precede it, and equal offsets pass.`
  - Clause check:
    - "stamps before it publishes": cancel.rs:201 (the mark) before :208 (the store).
    - "the flag a producer loads": the SeqCst `is_cancelled` load (cancel.rs:257) at the producer sites of §0.3.
    - "the clock assumption ADR-018's note … states": ADR-018:155 has "which is assumed and not proven here".
    - "equal offsets pass": `>=` at skp_admission.rs:895 and skp_filter_cancellation.rs:247.
- **DOC-2.** ADV-2026-11-22-10 is cited by the brief and will be cited by the closing amendment, but it is not filed on main. File it before any tracked record cites it.
- **DOC-3.** The filed build report says T3, T4 and T5 "each panicked … with `timed out waiting for: the drop to find the transition lock held`". Its own `cst-c1b-unit.log` and my C1 logs show that message for T4 only; T3 and T5 carry "B to …" and "the cancel to …". The report is filed and is not edited. The closing amendment cites this report by reference.
- **DOC-4.** C2's commit message, as in check 9. It goes in the closing amendment.
- **DOC-5.** The worker's C4 numstat has no log in `<S>`. The figure stands on this gate's numstat (check 2), which the closing amendment cites.

## Notes
- §4.5's green verify-cites is not met at this head, as ruled. It is to be met at ADV-2026-11-22-10 item 4's later head, which the reviewer's narrow read covers.
- The worker's stray 180-byte file is outside my scope.

Files:
- C:\dev\wt\gate-read\engine\src\cancel.rs
- C:\dev\wt\gate-read\engine\tests\cancel_request_stamp.rs
- C:\dev\wt\gate-read\kernel\tests\skp_admission.rs
- C:\dev\wt\gate-read\kernel\tests\skp_filter_cancellation.rs
- C:\dev\wt\gate-read\governance\forms\engine\CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md
- `<S>/g1r-disc-rc.txt`, `<S>/g1r-c1r-rc.txt`, `<S>/g1r-mut-rc.txt`, `<S>/g1r-cites.log`, `<S>/g1r-pins.log`, `<S>/g1r-numstat.txt`
