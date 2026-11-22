Reviewed: cut/cancel-stamp-order at 3f3820c9eddaca61d503c76e8d2308e50c6a8667 (the custodian's filing note, 2026-11-22: PR 350's code gate 1, the architect, beside the reviewer (ADV-2026-11-22-10 item 5); Read 33, Grep 21, Glob 3, SubagentHandback 1, by unique call ids, one Read errored (a path that did not exist), model claude-opus-5-5, from 2026-11-22T10:17:34Z to 2026-11-22T10:24:55Z by its transcript; the report below byte for byte from its hand-back of 12753 bytes, sha256 6252e53ee05bacd23bd53f12b0b23b55a041c9526cfbeca01666a47634d6992b, nothing masked by the custodian, with this note in its first line and one final newline), gate, architect
Verdict: PASS WITH NOTES, PR #350 @ 3f3820c9eddaca61d503c76e8d2308e50c6a8667

Reviewed: cut/cancel-stamp-order @ 3f3820c9eddaca61d503c76e8d2308e50c6a8667, read in C:\dev\wt\gate-read (detached at the head). Every path:line below is at that head unless a note says otherwise. I had no shell, so I made no git diff. I read each changed file's base side from the main checkout at 8b5fd6d9, on the assumption (paraphrase) that the four commits after 4b7655a2 there are records only and leave these ten files unchanged. The reviewer's three-dot diff is the proof. Every proposed word below is mine, the architect's; none is the human's or the advisor's. Text in double quotes is bytes copied from the file named. Everything else is paraphrase.

## Correctness

None. Against the code as built:

- **The order in `cancel_inner`** (engine/src/cancel.rs:179-254) matches form §2.1.
  - Under `transition` (:187-192), the step-2 SeqCst load runs (:193).
  - Then the guard (:197), `BeforeStamp` (:199) firing whether or not `stamp` is set, the mark (:201), the counter and `OnStamp` (:204-205), the publication (:208) and `AfterPublish` (:210). All of this happens before the lock is released at :213.
  - The slot lock (:214-222) and the re-interrupter (:229) come after the release. It is not a plain swap.
  - Panic safety holds. `publish` is declared after `_transition`, so an unwind stores the flag before the poisoned lock is released. Later calls recover the lock (:192).
- **N4.** The SeqCst store in `PublishOnDrop::drop` (:98) comes before the SeqCst `in_execute` load (:229) in program order. The pair with `execute_guarded` (:311, :314) is kept. Every access to `cancelled` and `in_execute` stays SeqCst.
- **Lock order and no cycle.**
  - Shipped build: under `transition`, the only locks taken are `mark_cold`'s `CURRENT` (engine/src/trace.rs:313) and the buffer (:151).
  - Neither `CURRENT`'s holders (`start` :330-338, `TraceGuard::drop` :356) nor the buffer's holders (`push`, `events` :190-194) take a registry lock or call `cancel`.
  - `transition` is released before the slot is taken.
  - Registry holders that call `cancel()`:
    - kernel/src/skp.rs:353 and :392 under `tickets`, and :963 under `inflight`;
    - frontends/shell/src-tauri/src/publish.rs:1175 and :1185 under the publish registry. That registry is not in D3's list, but it is the same registry → `transition` edge.
  - The data-plane callers (protocol/data-plane/src/adapter_ws.rs:145, :163, :173, :180, :278, :295, :305) hold no lock across `source_cancel.cancel()`.
  - `BatchStream::drop` (engine/src/stream.rs:902-907) holds nothing across `cancel_for_drop`.
  - So no cycle.
- **docs/01 principle 7.** In the shipped build, a call blocks on `transition` (:191) only while another call on the same token holds it, which is steps 2 to 4. The test build adds the seam actions inside the lock, which is test-only.
- **The two trace promises.** At most one stamp per token: `cancelled` has one writer, under the lock (:197, :98). A drop first means no stamp: step 2 (:193). A successful run's drop does not stamp (`stamp` false, :170). The test `kernel/tests/trace_spans.rs::a_successful_run_stamps_no_cancellation_instant` is preserved.
- **Hooks test-only.** `Seam`, `Seams`, `set_seam`, `stamp_count`, `seam_slot`, `fire`, the `seams` field and the `try_lock` probe are all `#[cfg(test)]` (:61-90, :180-186, :198-210, :260-298). There is no new `pub` item.
- **Seam rule.** `CancelToken::cancel`'s signature and the consuming sides are unchanged. The end-to-end tests from the real shape are I4 (`Dataset::stream_with_cancel`, then drop, then `cancel`) and the two kernel tests (`SkpHost::cancel` reaching the engine's own token).
- **ADR-010.** Rule 6: `TRACE_BUFFER_RECORDS` (trace.rs:80) is unchanged, and no capacity is added. Rule 7 is not engaged. Neither ADR-006 nor docs/08 is engaged: no claim is made.
- **ADR-018's note** (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:150-155):
  - The heading at :153 is the ruled heading by eye.
  - The body at :155 equals the gate report's line 100 by eye.
  - The placement matches ADV-2026-11-22-07 item 1 (a): blank line, `---`, blank line, heading, blank line, body after the old last line :149.
  - The worker's numstat of 6/0 implies no line above was changed. The reviewer recomputes the hash.
  - Each clause holds against the code: the stamp comes before the publication (cancel.rs:201, :208); the interrupt runs only when bound (:214); the spawn runs only on `first && in_execute` (:229); a call that finds the flag set stamps nothing (:193); and lod_tier_cancellation.rs:84-87 stamps before `cancel()`.
- **The kernel note** (kernel/CANCELLATION-AND-TRACING.md:270-276) is §10 at the end of the file, and its lines equal the report's 126-130 by eye. The numstat of 8/0 implies nothing above was edited. "`None`, never zero" holds (trace.rs:209-211).
- **The trace sentence** (trace.rs:370-372) equals the report's 218-220 by eye, +3/−2. Its clauses hold after C2.
- **Tests against §4.1, §4.2 and Amendments 1 and 2.**
  - T1 to T8 (cancel.rs:716-899) and I1 to I4 (engine/tests/cancel_request_stamp.rs:42-199) have the registered shapes.
  - `BeforeStamp` fires when `stamp` is false (N2).
  - I3's deadline stands alone at cancel_request_stamp.rs:95. Its spin (:108-114) has no sleep. Its comment (:94) says the deadline applies per iteration, which answers N-b.
  - I4's fixture is under the worktree's target/fixtures (:147).
- **Producer-reach checks, kept.**
  - In skp_admission.rs, the base lines :926-931, :892-895 and :914-919 now read at :888-893, :854-857 and :876-881.
  - In skp_filter_cancellation.rs, the base lines :269-274 and :244-247 now read at :240-245 and :215-218.
  - Each ordering assertion is separate and has its own message (skp_admission.rs:894-899; skp_filter_cancellation.rs:246-251). The 5 s bound is unchanged (skp_admission.rs:902-907).
  - The slice assertion (engine/tests/slice.rs:900-904) is placed as §2.6 asks, and the 100 ms assertion (:905-908) is unchanged.
- **Indexes.** engine/README.md:537, :544 and :557, and kernel/README.md:361 and :392, are pointers only. They are within ADV-2026-11-22-09 item 1 and under 60 lines.
- **Scope.** Ten paths, 701 lines against a ceiling of 800 (build report :85-100, the worker's numstat).

## Evidence

None blocking. The mutation outcomes in the build report (:42-65) match Amendment 1 item 9 as Amendment 2 items 4 and 13 correct it. The two outcomes not listed as kills are recorded as extras and not claimed as kills: I3 under M2, and the extra M4 failures. The red verify-cites matches the ruled shape: seven cites in the form at :13, :169, :170, :174 and :175, and three in two consults (build report :109-113). It is not a finding.

## Documentation (must-fix before the merge; none is the human's wording, so under AUTONOMY §31 the worker applies these words with no re-gate, and the PR body lists them)

- **D1. kernel/tests/skp_admission.rs:761-763.**
  - The defect: "so the producer's `PRODUCER_CANCELLED` cannot precede it" is stated without its condition. The order of the two offsets rests on the clock assumption that ADR-018:155 names. A foreign stamp from another test in this binary lands in the same process-wide trace (trace.rs:98; Amendment 1 item 15).
  - Replace :761-763 with:
    `/// them: `CancelToken::cancel_inner` (`engine/src/cancel.rs`) stamps `CANCELLATION_REQUESTED``
    `/// before it publishes the flag a producer loads, so, under the clock assumption ADR-018's note of`
    `/// 2026-11-22 states, this producer's `PRODUCER_CANCELLED` is not stamped earlier. Equal offsets`
    `/// pass. A `PRODUCER_CANCELLED` from another test running in this binary lands in the same`
    `/// process-wide trace and is not excluded.`
  - Clause check:
    - stamps before the publication: cancel.rs:201, then :208;
    - the clock assumption: ADR-018:155;
    - not stamped earlier: happens-before through the SeqCst store at :98;
    - another test's stamp lands in the trace: trace.rs:98 and :313.
- **D2. kernel/tests/skp_filter_cancellation.rs:113-115.**
  - The same defect as D1, without the residual, because this binary holds one test.
  - Replace with:
    `/// The presence checks and the stamp-order assertion are separate: `CancelToken::cancel_inner``
    `/// stamps `CANCELLATION_REQUESTED` before it publishes the flag a producer loads, so, under the`
    `/// clock assumption ADR-018's note of 2026-11-22 states, the producer's `PRODUCER_CANCELLED` is`
    `/// not stamped earlier, and equal offsets pass.`
  - Clause check: as in D1.
- **D3. engine/src/cancel.rs:147.**
  - The defect: "so the stamp precedes every observer that loads the flag" is false for a load made before the publication.
  - Replace that clause with "so the stamp happens before every load of the flag that finds it set", and reflow the doc comment's lines.
  - Clause check: the mark at :201 is sequenced before the only store, at :98 via :208, and a SeqCst load that reads true synchronizes with that store.
- **D4. engine/tests/cancel_request_stamp.rs:197.**
  - The defect: the message says "a span opening on the request exists". What the test checks is `segment_ms` (Amendment 1 item 7: no entry in `SPANS` opens on this stamp).
  - Replace with `"a segment opening on the request is derivable for a token whose drop came first"`.
  - Clause check: `segment_ms` returns `Some` exactly when that segment is derivable (trace.rs:209-219).

## Notes

- **N1. The build report's C1 line** (state/consults/2026-11-22-cancel-requested-stamp-order-build-worker-report.md:28, on main) gives one message, "the drop to find the transition lock held", for T3, T4 and T5. As built, T3's and T5's wait messages are different (cancel.rs:787 and :850). The reviewer resolves that line against cst-c1b-unit.log. The closing amendment should cite the log, not the report's summary.
- **N2. Campaign wording.** At C3 the wrappers are gone, so a "wrapper hits" count has nothing to hit. The C3 evidence is the pass counts, 50 of 50 per binary (report :68-69). Per §4.4, the record should also say that the C1 campaign showed no detection power for `skp_filter_cancellation` (0 hits, report :33).
- **N3. Not a finding (item 6), but a later piece would meet it.** The clippy warning `manual_is_multiple_of` at cancel_request_stamp.rs:111 is a new row that the clippy deny-warnings pieces (governance/forms/engine/CLIPPY-DENY-WARNINGS-WORKSPACE-12A-PREREGISTRATION.md) do not list. CI has no clippy step, and §4.5 is met at rc 0. I recommend the one-line fix in the later commit this PR already needs. It is a code line, so the reviewer's narrow read applies.
- **N4. Still open before the merge, all already ruled or recorded:**
  - the verify-cites fix: a scripts node, then a commit here;
  - ADV-2026-11-22-07 item 6's disclosure and residual, and the C2 commit message's misdescription (report :118), in the PR body and the closing amendment;
  - the merge after the v0.2 tag, with the check for changes on main;
  - the `skp_admission` residual, which may now show red in CI; that is a finding for the advisor, not a retry.
- **N5. ADV-2026-11-22-10 is not filed.** I found it on neither tree. I worked from the brief's paraphrase of its item 5. It must be on main before any tracked record cites it.
- **N6. Test-build extras.** In the test build, each `fire` takes its seam slot's mutex under `transition`, and the counter is a SeqCst read-modify-write at the mark. These are part of the hooks, so Amendment 1 item 11 stands. The I tests link the library built without `cfg(test)`, so they run the shipped statements.
- **N7. The owner's index pins I3** (engine/README.md:544), which the form ranks as supporting evidence only (§4.2). This is allowed under the index's rule; T2 or I4 would be a deterministic pin.
- **N8. Byte checks for the reviewer.** I recomputed no hashes. The reviewer checks the two notes and the trace sentence against the ruled hashes, and confirms that no line above either note changed.

No ADR skeleton: no decision is missing.

Relevant paths:
- C:\dev\wt\gate-read\engine\src\cancel.rs
- C:\dev\wt\gate-read\engine\src\trace.rs
- C:\dev\wt\gate-read\engine\tests\cancel_request_stamp.rs
- C:\dev\wt\gate-read\engine\tests\slice.rs
- C:\dev\wt\gate-read\kernel\tests\skp_admission.rs
- C:\dev\wt\gate-read\kernel\tests\skp_filter_cancellation.rs
- C:\dev\wt\gate-read\docs\adr\ADR-018-what-cancellation-acknowledged-means.md
- C:\dev\wt\gate-read\kernel\CANCELLATION-AND-TRACING.md
- C:\dev\wt\gate-read\engine\README.md
- C:\dev\wt\gate-read\kernel\README.md
- C:\dev\spatial-ide\state\consults\2026-11-22-cancel-requested-stamp-order-build-worker-report.md
