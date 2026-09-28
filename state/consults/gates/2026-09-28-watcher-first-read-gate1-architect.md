*Custodian's filing note (2026-09-28): gate 1 (architect; full gating under AUTONOMY.md §21a, entered through §21b's mid-piece clause after the class-6 overrun) of PLAN node `watcher-first-read-on-watch-thread`. Reviewed: cut/watcher-first-read @ 0c7be386304882e2b693f77cc7300a07b92b898f (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: cut/watcher-first-read @ 0c7be386304882e2b693f77cc7300a07b92b898f
VERDICT: FAIL

This gate is the architect's, gate 1, full gating under AUTONOMY.md §21a, entered through §21b's mid-piece clause. It covers PLAN node `watcher-first-read-on-watch-thread`, wave-2 C-1. There is one blocking finding (B1), and it is confined to the test module. The product change itself meets the direction.

## 1. Does the change do exactly what the C-1 direction says?

Yes, on every point except the proof of the arm-side handshake (see B1). The direction is the C-1 paragraph of `state/directives/2026-09-28-after-wave-s1-batch.md`, paraphrased here, not quoted.

- **Who issues the reads.** `issue_read` is now called only inside `watch_thread`: the first read at `engine/src/watch.rs:294` and the re-issue at `:350`. `arm` issues no `ReadDirectoryChangesW` itself. The pre-fix defect was that the caller's thread issued the read. That is gone, so the thread-exit cancellation cannot fire.
- **One-shot handshake.** Each thread sends exactly once, on both branches, before it can return (`:294-303`). `spawn_watch_thread` blocks on it through `await_first_read` (`:555`). `arm` returns `Watching` only after every handle's handshake succeeds (`:619-677`). That is the same property the old §2a step 6 secured by ordering.
- **Issuing error becomes today's refusal.** `await_first_read` (`:505-508`) produces `[P6 placeholder] could not arm the {which} directory watch: {e}`. The pre-fix grandparent string used a `\` line continuation and resolves to the same bytes, so both reason texts are byte-identical. The spawn-failure texts (`:550-552`) are also byte-identical to the pre-fix ones.
- **Rejected and unacceptable alternatives are absent.** There is no completion port. No shell file is touched, so nothing keeps the caller's thread alive and tokio's keep-alive is unchanged.
- **The new failure paths are sound.**
  - When the grandparent's handshake fails, its thread is joined and its handle closed (`:561-567`). The parent's live `SourceWatch` is then dropped, which cancels, joins and closes it (`:670`).
  - A failed spawn now drops a closure holding no pending read, so reviewer B2's use-after-free cannot arise at all.

## 2. Is §2a's mapping table unchanged, and does any stated behaviour change?

- **Mapping table and reason texts: unchanged.** Every mapping site after the first read (`:304-382`) is untouched. Everything is keyed to engine/SOURCE-WATCHER-PREREGISTRATION.md §2a's table.
- **At-most-once emission: unchanged.** All handles still share one `fired` flag, with the same `swap` sites.
- **Disarm: unchanged.** `SourceWatch::drop` is untouched. `CancelIoEx(raw, null)` reaches a read issued by another thread, so a disarm abort still maps to "nothing".
- **Refusal codes: unchanged.** There is no `EngineError` or wire change.
- **ADR-035: nothing it states changes.** It states no arming order and disclaims event ordering.
- **One stated behaviour does change, as the direction requires.** §2a's Arming list, items 4 to 6, puts both first reads in `arm`, then spawns the threads "once every read is pending". That sequence is superseded. The direction mandates this: every read on the owning thread implies spawn-before-read. The direction preserves only the mapping table. The Amendment acknowledges the move ("step 6's spawn logic moves ahead of steps 4 and 5"). The watcher preregistration's §§0–12 are immutable as filed (§22), so no edit is due there. See note N2.
- **One new window exists, with no observable effect.** The parent's thread can now deliver a signal while the grandparent is still being armed. If the grandparent then fails, the kernel's `ChecksOnly` branch (`kernel/src/skp.rs:1129-1140`) ignores the recorded `PreAdmission` signal. Before the fix, the same completion was discarded by `drop(p_pending)`. The admitted outcome is the same either way.

## 3. Is each claim in the Out-of-scope line true?

Each claim is true of the diff.

- **ADR none:** true. No ADR file is touched, and ADR-035 states nothing the diff changes.
- **Security none:** true. Nothing that ADR-020, ADR-009 or ADR-021 governs is touched.
- **Wire none:** true. `protocol/**` is untouched, and `dataset_session_ended` and its reasons are unchanged.
- **Guarantee none:** true as the line words it. No guarantee's text changes. The property §2a's step 6 served (`Watching` implies every read is pending) is kept by the handshake. The §2a mapping row that the defect broke is restored, not restated.
- **Routing.** The line names no §21a category as touched, so round 25, item 2 (e) is not triggered. The piece is now under full gating anyway.

## 4. Does the Amendment (class 6) record what it must?

The Amendment is correct.

- **Declared figure:** ≤150 lines across ≤3 files.
- **Final figure: 416 across 2 files.** I recounted every hunk of the three-dot diff at the reviewed commit:
  - `watch.rs`: 185 insertions and 131 deletions.
  - The test file: 100 insertions.
  - These agree with the hunk headers and with the file's net +54.
- **Counting rule:** §21c's rule, with the form excluded. The reason is given.
- **Scope line not edited.** Lines 1–11 of the branch's form are identical to the copy tracked on main. The reviewer should still confirm with `git diff 0d2576c 0c7be38 -- engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, since I have no shell.
- **Consequence stated correctly.** The single-gate route closes, full gating applies (reviewer and architect), and the short form stays. This matches §21b's size-overrun clause and class 6.
- **Quote fidelity.** The Amendment presents no passage as quoted.
- **One unresolved tool claim.** The Amendment says the histogram, patience and minimal diff algorithms give the same total. That is unresolved by me; the reviewer recomputes it.
- **§25 fail-by-name checks: none triggered.**
  - The piece is short form, so a class-8 overrun does not apply.
  - There is no scope addition, so class 9 does not apply.
  - No record calls a `verify-mutation` run an observation.
  - No test-text span is pinned at a branch commit.
  - The Out-of-scope line names no §21a category.

## 5. Are the new tests weaker than the direction requires?

- **Test (1) is sound.**
  - It uses the real `SkpHost::new` and `open_dataset`, whose signatures I checked in `kernel/src/skp.rs`, and the real `PlatformWatch` on a real fixture.
  - It fails on the pre-fix code. The worker reverted to `0d2576c` and got `Ok(DatasetSessionEnded { .. reason: CoverageLost })`. The custodian's reproduction in W2-C.md matches.
  - The 5 s bound is labelled a harness ceiling, and the event arrives within 136 µs when the bug is present.
- **Test (2) runs the real issuing error, not a hook.** It uses the real `watch_thread` and `issue_read`, and `ReadDirectoryChangesW` on a null handle really fails. It is still too weak; see B1.

## Blocking findings

**B1. Test (2) never exercises the arm-side refusal path.**
- **Where:** `engine/src/watch.rs:727-763` (test), `:516-569` (`spawn_watch_thread`), `:630` and `:669-672` (arm's `ChecksOnly` returns).
- **What the test does.** It spawns `watch_thread` itself with `std::thread::spawn` (`:739-750`), then calls `await_first_read` (`:751`). That rebuilds, inside the test, the composition that `spawn_watch_thread` performs.
- **Why that is not enough.**
  - The direction requires that the arm-failure path still refuses synchronously. The form's Tests+mutation line says "arm's mapping of it is the ChecksOnly refusal".
  - No test reaches `spawn_watch_thread`, which is where arm waits on the handshake and turns its `Err` into a refusal.
  - Two mutations survive every test: returning `Ok(Handle{..})` without awaiting the handshake, and ignoring the handshake's `Err`. Test (1) passes under both, and no existing test forces an issuing error through arm.
  - The doc comment's "not a reimplementation" holds only for `await_first_read`, not for the path the test claims to prove.
- **Fix, inside Scope.**
  - Drive `spawn_watch_thread(null_mut(), ..)` directly. Assert it returns `Err(reason)` containing `could not arm the parent directory watch`.
  - Record the arm-side mutation (`spawn_watch_thread` returns `Ok` without consulting the handshake) failing by name, as a class-4 amendment, observed at a named commit and reverted.
  - Keep the declared thread-side mutation.

## Non-blocking notes

- **N1. Stale SAFETY and doc comments** (`engine/src/watch.rs:215-220`, `:229-231`).
  - `unsafe impl Send for PendingRead` is justified by arm "mov[ing] a freshly-issued `PendingRead` into the one watch thread". Arm no longer does that: `PendingRead` is now created and dropped on its own thread, so the `unsafe impl` is unneeded and its justification is false.
  - `PendingRead::drop`'s doc cites a failed spawn dropping a closure that captured one. No closure captures one now.
  - Recommendation: fold the fix into the B1 round (same file; see the "scope is the file" reading). Remove the `Send` impl or reword it.
- **N2. Step comments no longer match §2a's numbering.** Arm's comments `Step 4` and `Step 5` (`:614`, `:634`) number steps against §2a (`Step 1 (§2a)`, `:572`), but now describe a different step 4. The PR body should say that §2a's Arming items 4–6 are superseded by this form's Change line, with no edit to the immutable preregistration.
- **N3. Mutation observations need an observation of record at a commit.**
  - The worker observed both mutations on an uncommitted CRLF working tree based on `0d2576c`. The custodian then normalised it to LF at `0f68413`.
  - Round 25, item 2 (c) wants the failure recorded by name with the commit it was observed at.
  - The reviewer gate, which has a shell, should re-observe test (1)'s pre-fix failure and both test-(2) mutations (the declared one and B1's) at the fix commit. Its report then becomes the observation of record.
- **N4. The `.expect` in `await_first_read` (`:507`) relies on the invariant that the thread always sends before it returns.**
  - It holds by construction today.
  - Mapping a `RecvError` to a `ChecksOnly` reason instead would keep the fallback-not-panic rule from reviewer B2 on this product path.
- **N5. A quoted phrase in the form matches no tracked source** (form line 3). It reads "Hits every session in the dev app", with the phrase in double quotes. It is not introduced as verbatim, so it is not a gate failure under round 10. The directive's own quoted phrase is `hits every session`. The five-line form is not rewritten, so the PR body should label the phrase as a paraphrase.
- **N6. Arm now pays up to two sequential thread-spawn-plus-handshake round trips.** This is negligible against `open_dataset`'s DuckDB work and does not bear on any budget in docs/08.

Files:
- C:/dev/wt/watcher-first-read/engine/src/watch.rs
- C:/dev/wt/watcher-first-read/kernel/tests/watcher_first_read_windows.rs
- C:/dev/wt/watcher-first-read/engine/WATCHER-FIRST-READ-PREREGISTRATION.md
- C:/dev/wt/watcher-first-read/engine/SOURCE-WATCHER-PREREGISTRATION.md
- C:/dev/wt/watcher-first-read/kernel/src/skp.rs
