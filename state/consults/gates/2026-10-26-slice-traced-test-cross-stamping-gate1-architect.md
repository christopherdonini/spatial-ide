Reviewed: PR #260 at 6859cc1b852ef0f38c8a632b5fd759d4e4fbd778, gate 1, architect
Verdict: PASS WITH NOTES

Branch and commit reviewed: cut/slice-traced-test-cross-stamping @ 6859cc1b852ef0f38c8a632b5fd759d4e4fbd778.

How to read the cites. H is 6859cc1b852ef0f38c8a632b5fd759d4e4fbd778, the head, which I read in the worktree C:/dev/wt/sc. B is 1fd4923cbbc98e0f2478c64d82b5096620ba9d57. M is fa4c8650494a817334845667596264757289a8cc, the main checkout. Every `engine/tests/slice.rs` line number below is at H unless it is marked (B). Every engine/src and kernel line number is at M.

What I could not run. I have no shell, so this report has no sha256, no `git diff`, no CI read and no `git log`. I read B's `engine/tests/slice.rs` from the main checkout at M. Going by their subjects, the two commits since B (4c90fc80 and fa4c8650) are filings and do not touch that file, but I could not confirm that by git. The comparisons below between H and B are by reading. They rest on the custodian's numstat from 1fd4923c (92 added, 0 removed), and I account for all 92 lines below.

## Findings by class

- **Correctness:** none.
- **Evidence:** none.
- **Documentation (must-fix):** none. No replacement words are owed.
- **Notes (no action):**
  - **N-1. The form's Change line on a run that is already red.** The line says no other test "can stamp" either name into the trace while the traced test holds it. That is not true once another test has already failed. If a shared test panics after it takes its first batch and before it reaches `quiesce` (for example at an assertion in `the_payload…`, :551-600 (H)), unwinding releases its read guard while its producer is still live. The stream's drop then cancels that producer, which can stamp `producer_cancelled` into a trace the traced test starts afterwards. The same happens when `quiesce` itself fails after its 10 s window.
    - This is not a Correctness finding, for three reasons. First, the traced test can take the write guard only after that reader's unwind, so the panic has already made the binary red. Second, in every run where the binary passes, every shared test reached the end of its body normally, so the claim holds. Third, the form already disclaims that "the trace holds only this test's events" (note 4, May not claim).
    - The form is on main and append-only, and the branch carries no form, so no words are owed. If the custodian wants this limit on record, the PR body can name it by reference to this note.
  - **N-2. One more producer stamps after its guard is released.** W1's last sentence names the quiesced producers. `cancelling_before_the_first_batch…`'s producer, which is not quiesced, can also stamp `producer_finished` after its guard is released: the Err send at stream.rs:1374 comes before the mark at stream.rs:1399. The sentence does not say "only", and the traced test reads neither name, so it stays true. No change.

## Check 1: the five lines against the head

- **Authority.** It is a form record. Its pins are historical at dcd85569, and I did not recompute them (no shell). For the code, the base tree is authoritative, as the form's line 3 says. It sets nothing the head contradicts.

- **Scope.**
  - The diff is one file. The new code sits at :111-184 (H): W1 at :111-145, `static TRACE_LOCK: std::sync::RwLock<()>` at :146, `exclusive()` at :148-150, `shared()` at :152-154, W2 and the M-3 line at :156-170, `quiesce(ds: &Dataset)` at :171-183, and a blank line at :184. That is 74 lines, after `impl Drop for Watchdog` (:105-109) and above `fn small()` (:185).
  - There are eleven first statements (`let _serial = …`):
    - `exclusive()` at :842;
    - `shared()` at :517, :542, :607, :660, :702, :730, :774, :932, :957 and :1009.
  - There are seven closing lines:
    - `drop(s);` then `quiesce(&ds);` at :601-602 and :1003-1004, the two tests where `s` is still live;
    - `quiesce(&ds);` alone at :697, :725 and :952, where the stream was a temporary or was dropped in a block (:943-947).
  - 74 + 11 + 7 = 92, which matches the numstat of 92 and 0 against a budget of 100. So no other line changed. I compared all eleven test bodies at H with B :441-966 (B) by eye and found them identical apart from the inserted lines.
  - No `pub` item is added. The admission tests (:257-509), `a_viewport_in_another_crs…` (:638), h6 (:1073) and the arrow-version test (:1147) take neither guard.

- **Change.** The lock is read in place.
  - Each guard is bound to `_serial`, not `_`, and is declared first, so it drops last.
  - Both guards recover from poisoning with `unwrap_or_else(|e| e.into_inner())`.
  - `quiesce` polls `ds.connections().active_leases()` every 5 ms within a 10 s `WINDOW`, then asserts it equals 0.
  - The argument behind the exclusion holds at M:
    - The lease is taken on the caller's thread before the spawn (stream.rs:1234, then the spawn at :1265). So `quiesce` cannot read a 0 from before the lease.
    - Every `PRODUCER_CANCELLED` mark is at stream.rs:1795, :1845, :1854, :1901, :1934, :2001 or :2558. All of them are inside `produce` (:1770-2263) or `flush` (:2471, which `produce` calls at :2031, :2080, :2116 and :2136), and so before the lease is decided at :1306-1309.
    - Both ways a lease ends decrement the count under the pool mutex: `return_healthy` at pool.rs:447 and `discard` at pool.rs:464. `active_leases` reads that count at pool.rs:494-497.
    - The only Err sends are at stream.rs:1363 and :1374, both after the lease is decided. `flush` sends only Ok (:2579). So a drained stream, or the cancel-early test's single `next_into`, returns only after every mark the traced test reads.
    - `CANCELLATION_REQUESTED` is marked only at cancel.rs:123, through `cancel()`. A stream's drop goes through `cancel_for_drop` (stream.rs:906, cancel.rs:113-115) and does not stamp.
    - Every library caller of `.cancel()` sits under `#[cfg(test)]`: index.rs:764, pin.rs:136 and stream.rs:2680. None of them runs in this binary.
    - No test takes both guards, so the lock cannot deadlock.

- **Tests+mutation.** No new test. The eleven names in the form match the eleven guarded tests at H exactly. M-1 to M-3 are recorded at :127-131, :132-145 and :162-170, each naming 8a79b7f06cee3068314ea583792f56c98049b078 in full. See check 2.

- **Out-of-scope.** See check 3.

## Check 2: the words

- **W1** (:111-125) and **W2** (:156-160) match note 8's blocks line for line, with the `> ` prefix removed and the same wrapping. I compared them by reading; I could not compare bytes.

- **The clause checks of note 8 hold at the head:**
  - W1's "takes `exclusive()` … `shared()` as its first statement; each holds its guard to the end of its body" is now true: see the eleven lines under check 1, and the guards are named bindings.
  - "the shared tests still run beside each other" is std's reader sharing; there is no other lock.
  - "a shared test that drops a stream before the stream has ended calls `quiesce`" covers the five tests named under check 1.
  - "refused before it is built": stream.rs:1209-1219 come before `build_sql` at :1222 and `SQL_BUILT` at :1227.
  - W2's "inside `produce`, before it gives its lease up" and "no active lease … no producer left" hold, as shown under check 1.
  - "Bounded at ten seconds … in the shape of the kernel's trace-span suite" matches kernel/tests/trace_spans.rs:163-175 at M: the same 10 s window, the same 5 ms poll and the same assert_eq.
  - The words are not the human's. They are doc comments.

- **The three recorded lines against the worker's report:**
  - **M-1** (:127-131). Report: "FAILED. 0 passed; 1 failed; … 21 filtered out", run with `--exact`, at the start's expect with `no other trace is running`, in a debug build on the code commit. The recorded line says the same.
  - **M-2** (:132-145). Report: "FAILED. 12 passed; 10 failed". The ten names in the recorded line are the form's ten. Twelve passed plus ten failed makes the binary's 22 `#[test]`s at H: eight admission tests, the other-CRS refusal, the traced test, h6 and arrow-version.
  - **M-3** (:162-170). Report: "FAILED. 17 passed; 5 failed", with the five names, left 1 and right 0. The message in the recorded line is the code's string at :180-181, with `{WINDOW:?}` rendered as `10s` and the line continuation joined.
  - The report's line 19 gives a restore check after each mutation, diff_rc=0 against 8a79b7f0. No record calls a verify-mutation run an observation.

## Check 3: Out-of-scope

- **ADR.** The diff touches no ADR. The one-traced-stream limit is trace.rs:92's "One traced stream per traced run — a declared limit (ADR-010 rule 6)". Rule 6 in ADR-010 is the declared-ceilings rule (docs/adr/ADR-010-render-frames-origins-boundaries.md:141), so the form describes it correctly. trace.rs is not changed. ADR-018's scored pair is the assertion at :897-904 (H), which is identical to :811-818 (B).
- **Security and wire.** Nothing under protocol/, nothing governed by ADR-009, ADR-020 or ADR-021, and no surface for SKP, the data plane or MCP. `quiesce`'s message is test text, not wire text.
- **Guarantee.** The disclosure is described rightly. The lock decides what a pass of the traced test can rest on, which is the property-under-test contact (docs/08:8's budget on the producer's clock). The assertion's text, message, 100 ms bound and the pair `CANCELLATION_REQUESTED`/`PRODUCER_CANCELLED` are unchanged, and no figure is re-taken. That is what round 53 orders: B-keep, the assertion stays, and a failure is re-run once alone. I read that at state/directives/2026-10-04-round-53-open-1-ruling.md lines 6-7, at M. N-1 gives the bound on "narrows what a pass can rest on": it holds in every run in which the binary passes.
- **Filler rule** (state/directives/2026-10-24-filler-slot-standing-rule-appended-to-autonomy.md line 8). One file and 92 lines, inside §21c's size. The reviewer and the architect gate from dispatch. The work is graded S3, has no user-visible string and no red-line text. The worker's report line 37 and the custodian's filing note record shared holds only, none exclusive.
- **Round 25, item 2.** Nothing fails by name:
  - no full-form §7 overrun;
  - no class-9 scope addition;
  - no verify-mutation run called an observation;
  - no test-text span pinned by hash at a branch commit;
  - §25(e) is set aside by §36.

## Check 4: the worker's disclosures

- **M-2's compiled form** (the guard bound to a local, and `#[allow(unreachable_code)]` on the return; report lines 17 and 34). M-1 used the same binding to a local (report line 16), and its recorded line does not mention it either. In a single-expression fn, that binding is the least that lets a statement sit "after the lock is taken", which is the form's own wording. It does not change which tests call `shared()` or `exclusive()`, which is the only thing M-1 and M-2 discriminate. So there is no bearing on the evidence. The recorded lines name the insertion and the outcome correctly, and claim no other edit. No finding.
- **`quiesce`'s message** (:180-181) is the worker's own wording, not the human's and not the form's. The form fixes no text for it and forbids changes only to existing messages. Each clause is true of the code:
  - "still held a lease": `active_leases` is nonzero after the window.
  - "{WINDOW:?} after its stream was dropped": `quiesce` is called only after the stream drops, so at least 10 s have passed.
  - "its producer could still stamp the traced test's trace": a held lease means the producer has not reached stream.rs:1306, so it can still reach a mark site.

  It states test facts only. No finding.

- **Not checked by me:** CI on both platforms (OPEN-2 (A) has it follow), and the figures the worker's report gives for fmt, clippy, verify-* and the holds. Those are the reviewer's and the custodian's to read.

Files read: C:/dev/spatial-ide/engine/SLICE-TRACED-TEST-CROSS-STAMPING-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/2026-10-26-slice-traced-test-cross-stamping-build-worker-report.md, C:/dev/spatial-ide/state/directives/2026-10-24-filler-slot-standing-rule-appended-to-autonomy.md, C:/dev/spatial-ide/state/directives/2026-10-04-round-53-open-1-ruling.md, C:/dev/wt/sc/engine/tests/slice.rs (H), C:/dev/spatial-ide/engine/tests/slice.rs (read as B), C:/dev/spatial-ide/engine/src/stream.rs, C:/dev/spatial-ide/engine/src/pool.rs, C:/dev/spatial-ide/engine/src/cancel.rs, C:/dev/spatial-ide/engine/src/trace.rs (grep), C:/dev/spatial-ide/kernel/tests/trace_spans.rs, C:/dev/spatial-ide/docs/adr/ADR-010-render-frames-origins-boundaries.md (grep).
