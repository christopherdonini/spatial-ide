*Custodian's filing note (2026-09-28): gate 2 (reviewer; the re-gate after correction round 1, scoped to it, with the observations of record) of PLAN node `watcher-first-read-on-watch-thread`. Reviewed: cut/watcher-first-read @ c7f1afb009a9be4c3a310365a63fa00f03846820 (from the report's own first line), and it confirms that c7f1afb..fc3e51f is form-only. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. On its S1: the worker's report-2 was committed to main at aeb2f3c while this gate ran. Profile paths redacted at filing (0).*

---

Reviewed: cut/watcher-first-read @ c7f1afb009a9be4c3a310365a63fa00f03846820
VERDICT: PASS

**Scope and state.** This gate covers correction round 1 (`git diff 0466858 c7f1afb`, which is code commit ad2e692 plus the form's Amendment 2 lines) and the observations of record.
- `git diff --stat ad2e692 c7f1afb -- engine/src kernel` is empty. The code at c7f1afb is byte-identical to ad2e692.
- The head moved to fc3e51f while I worked. `git diff --stat c7f1afb fc3e51f` shows only `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, 1 insertion (the class-1 Amendment 3 line). That delta is form-only, with no code.
- Observations (i) to (iv) ran on a tree whose code equals c7f1afb.
- The worktree is left clean at fc3e51f (`git status --porcelain` empty). Every probe was restored with `git checkout HEAD -- engine/src/watch.rs`. Every cargo process ran in the foreground or finished, so none is left running.

## 1. Gate-1 items against the round's diff

- **Architect B1: closed.** Test (2) now calls the real `spawn_watch_thread(std::ptr::null_mut(), .., "parent")`. It matches `Err(reason)` and panics on `Ok(_)` with "an invalid handle must fail to issue its first read". It asserts `reason.contains("could not arm the parent directory watch")`. The hand-built `watch_thread` + `await_first_read` composition is gone, and so are the now-unused test imports. This test also reaches `spawn_watch_thread`'s join-and-close `Err` arm, which closes my gate-1 N2 as well.
- **S1: closed.**
  - `await_first_read` now matches `ready.recv()`. `Ok(result)` maps through the same format string. `Err(_)` returns `Err("[P6 placeholder] could not arm the {which} directory watch: the watch thread exited without reporting whether its first read was issued")`.
  - The caller's `Err(reason)` arm then does `join.join()` followed by `CloseHandle`, so the join-and-close path runs on `RecvError`.
  - The new reason string: it states an engine fact and no consequence for the owner, so it meets the operator-text rule. It has the same prefix as the issuing-error text, so the mapping stays uniform.
  - A panicking thread is also safe here. Any `PendingRead` it created is dropped during unwind, and that drop cancels and synchronizes before the join returns.
- **S2: closed.** Test (1) calls `host.describe(DescribeRequest{..})` after the opener thread joins and asserts `coverage.state == CoverageState::Watching`, before the bounded wait. The comment cites `kernel/tests/source_watch_ordering.rs:237`, a file this commit does not edit. That line is `assert_eq!(d.coverage.state, CoverageState::Watching);`, so the cite resolves.
- **S3: closed.**
  - `unsafe impl Send for PendingRead {}` is removed, and the full suite compiles and passes without it. The compiler now enforces that a `PendingRead` never leaves its issuing thread.
  - The struct doc and `Drop` doc are rewritten and accurate: the value is created and dropped only on its own watch thread, and no closure captures one.
  - `SendableHandle`'s SAFETY comment now has its own reasoning (an opaque HANDLE, moved into `spawn_watch_thread`'s closure). That matches the code.
- **Extra `Handle` SAFETY rewrite: correct in substance.** The old comment pointed at the deleted `PendingRead` impl, so leaving it would have left a dangling reference. The new text says HANDLE is opaque and that the handle is closed after `SourceWatch::drop` joins the thread, which is true. See N1 for a wording slip.
- **Architect N2: closed.** A comment before arm's "Step 4" says that §2a Arming items 4–6 are superseded by this piece's Change line, that the watcher preregistration is not edited, and that "Step 4"/"Step 5" number this function's own order. See N2 for a small point.
- **Reviewer N1: closed.** Both `unsafe { CloseHandle(handle) }` blocks in `spawn_watch_thread` have SAFETY lines, and both are correct: the spawn failed so no thread exists, or the thread has been joined.
- **Reviewer N3: closed.** `drop(ready)` follows each of `watch_thread`'s two sends.
- **Reviewer gate-1 S4, under the ruling the custodian relayed:** the helpers pass all three limbs.
  - They are private to `engine/src/watch.rs`: none of `SendableHandle`, `await_first_read` or `spawn_watch_thread` is `pub`.
  - Their only product callers are `arm` (watch.rs:643, :681) and the watch thread's handshake. The test module is their only other caller.
  - No behaviour leaves the module.

  So S4 closes.

## 2. Observations of record

Code equal to c7f1afb. Each mutation was applied with `sed` and checked with `git diff`, then run, reverted with `git checkout HEAD -- engine/src/watch.rs`, and followed by an empty `git status --porcelain`.

- **(i) Declared thread-side mutation.** Inserted `let _ = ready.send(Ok(()));` before `let mut pending = match issue_read(handle, filter) {`. Ran `cargo test -p spatial-engine --lib watch::windows_watch::tests`.
  - `an_invalid_handle_reports_its_issuing_error_through_the_handshake` **FAILED**: "panicked at engine\src\watch.rs:779:26: an invalid handle must fail to issue its first read". That is the `Ok(_) => panic!` arm, at :778 unmutated.
  - `names_match_folds_case` passed.
- **(ii) `spawn_watch_thread` returns Ok without consulting the handshake.** Replaced `match await_first_read(ready_rx, which) {` with `drop(ready_rx); match Ok::<(), String>(()) {`. Same test **FAILED**: "panicked at engine\src\watch.rs:779:26: an invalid handle must fail to issue its first read".
  - Extra probe (ii′), the architect's second surviving mutation: call `await_first_read` but ignore its `Err` (`let _ = await_first_read(..); match Ok::<(), String>(()) {`). **FAILED** with the same message at :779:26.
- **(iii) Vacuity: every watch thread sends Err and returns.** Inserted `let _ = ready.send(Err("vacuity mutation: every arm becomes ChecksOnly".to_string())); return;` before the first `issue_read`. Ran `cargo test -p spatial-kernel --test watcher_first_read_windows`.
  - `the_opener_threads_exit_does_not_end_a_healthy_session` **FAILED**: "panicked at kernel\tests\watcher_first_read_windows.rs:95:5: assertion `left == right` failed: the watch must actually be armed: SourceCoverage { state: ChecksOnly, reason: Some("[P6 placeholder] could not arm the parent directory watch: vacuity mutation: every arm becomes ChecksOnly") } left: ChecksOnly right: Watching".
- **(iv) Test (1) on origin/main's `engine/src/watch.rs`.**
  - origin/main is now aeb2f3c. Its watch.rs equals the merge-base 09f6917's (`git diff --quiet` passed).
  - `git checkout origin/main -- engine/src/watch.rs`, then the same test. It **FAILED**: "panicked at kernel\tests\watcher_first_read_windows.rs:103:5: a healthy session must not end just because its opener thread exited: Ok(DatasetSessionEnded { session: SessionRef("sr_bf5e688fc147e2f35e1d0bcba4c437d4"), reason: CoverageLost })".
  - The pre-fix code passes the new Watching control at :95, so the positive control does not mask the regression signal.
  - Restored with `git checkout HEAD -- engine/src/watch.rs`. The status was clean and HEAD was fc3e51f.

## 3. Suites and hygiene

All runs used `CARGO_TARGET_DIR=C:/dev/spatial-ide/target`, and all exited 0.

| Command | Suites | Passed | Failed | Ignored |
|---|---|---|---|---|
| `cargo test -p spatial-engine` | 30 | 355 | 0 | 13 |
| `cargo test -p spatial-kernel` | 38 | 299 | 0 | 28 |
| `cargo test --workspace` | 82 | 781 | 0 | 41 |

- **Per-suite results.** Both `watch::windows_watch::tests` passed. In the kernel run, `watcher_first_read_windows` passed 1, `session_end_event` 7, `source_watch_ordering` 14 and `source_watch_windows` 3. The counts rose from gate 1 through the merge of main at 0466858.
- **clippy** (`-p spatial-engine -p spatial-kernel --all-targets`, rc 0): 70 `warning` lines. Zero `-->` locations point into `engine/src/watch.rs` or `kernel/tests/watcher_first_read_windows.rs`.
- **rustfmt `--check --edition 2021`:**
  - The kernel test file is clean (rc 0).
  - watch.rs has 8 hunks, against origin/main's 13. The only line not in main's set is trailing context of the pre-existing `Ok(PendingRead { handle, buffer, overlapped })` hunk (:264): the rewritten `SendableHandle` SAFETY comment now follows it.
  - The diff introduces no formatting hunk.
- **`git ls-files --eol`:** i/lf w/lf `attr/text=auto eol=lf` for all three files, with 0 CR bytes in each.
- **Reason strings, scripted.** A tokenizer extracted every string literal from origin/main's and c7f1afb's watch.rs, skipping comments and resolving `\`-newline continuations. Each `{which}` was expanded to parent/grandparent, matching the call sites at :651, :690 and :774.
  - All 33 of main's literals are present byte for byte on the branch, including the 10 `[P6 placeholder]` reasons.
  - Branch-only literals: the new RecvError reason (×2 after expansion), the `which`/thread-name arguments, and test strings.
- **DCO:** ad2e692 and c7f1afb are both signed off.

## 4. The form

- **Append-only.** `git diff 0d2576c c7f1afb -- engine/WATCHER-FIRST-READ-PREREGISTRATION.md` adds only lines at @@ -9,3 +9,7: a blank line and three Amendment lines. Nothing is removed or edited, and the Scope line is untouched. c7f1afb..fc3e51f appends one more line and nothing else.
- **Class-6 figure.** `git diff --numstat origin/main...c7f1afb` (merge-base still 09f6917) gives: form 4+0, `engine/src/watch.rs` 220+145, `kernel/tests/watcher_first_read_windows.rs` 121+0. That is 486 across 2 files with the form excluded, and it is 486 under histogram, patience and minimal. This matches the Amendment.
- **Class-4 line against my observations.**
  - Test (2) drives `spawn_watch_thread` with a null handle: true.
  - It fails under (b) and under the declared thread-side mutation: true (observations i and ii).
  - Test (1) asserts Watching and fails under the vacuity mutation: true (iii).
  - It still fails with main's pre-fix watch.rs: true (iv).
  - "observed … at ad2e692" is consistent: the code at ad2e692 equals c7f1afb's.
  - "re-observed at gate 2": discharged by section 2 of this report.
- **Round 25 item 2 checks.**
  - No record calls a `verify-mutation` run an observation.
  - No test-text span is pinned by hash at a branch commit.
  - The observations carry commit ids.
  - No class-8 or class-9 trigger applies: this is the short form, and there is no scope addition on a standing rule.
  - The Out-of-scope line is unchanged and names no §21a category.

## Blocking
None.

## Should-fix
- **S1: the observation record the form cites is untracked on main.** The class-4 line names `state/consults/2026-09-28-watcher-first-read-worker-report-2.md` as its "Observation record". In `C:/dev/spatial-ide` that file is `??` (untracked). It is evidence rather than Authority, so the round-14 untracked-Authority rule does not strictly bite. Still, commit it to main before the branch merges, so that the tracked form's pointer resolves.
- **S2: the worker report misstates two facts; the form does not repeat them.**
  - It says `session_end_event` passed 14. The actual count is 7; the 14 is `source_watch_ordering`'s.
  - It says clippy produced "2 pre-existing warnings total". The run produces 70 warning lines across both crates, none in the touched files.
  - Its mutation line numbers (772/766) cannot be matched to the one-line mutations as briefed; mine fail at :779.
  - Since the form says "re-observed at gate 2", this report's section 2 should be read as the observation of record.

## Nits
- **N1: `Handle`'s SAFETY comment says "this struct's `Drop`".** `Handle` has no `Drop` impl; closing happens in `SourceWatch::drop`, which the parenthetical names. The struct doc "closed and joined on `Drop`" has the same pre-existing slip. The comment should say "whichever thread `SourceWatch`'s `Drop` runs on".
- **N2: the arm comment's "(§22)" names no document.** It should read "AUTONOMY.md §22" (or wherever §22 lives).
- **N3: the class-6 line's "one ChecksOnly reason text"** is one format string yielding two texts (parent and grandparent). This is harmless.
- **N4: Amendment 3 (fc3e51f, record-only; not in this gate's scope, noted only).** It says §2a's "failure rule" is unchanged. That rule (engine/SOURCE-WATCHER-PREREGISTRATION.md, §2a Arming, the "Any failure in steps 1–5" paragraph) speaks of "the OS error's text". The new RecvError reason carries no OS error. It is still an engine fact, and the path is unreachable today.

Files:
- C:/dev/wt/watcher-first-read/engine/src/watch.rs
- C:/dev/wt/watcher-first-read/kernel/tests/watcher_first_read_windows.rs
- C:/dev/wt/watcher-first-read/engine/WATCHER-FIRST-READ-PREREGISTRATION.md
- C:/dev/wt/watcher-first-read/engine/SOURCE-WATCHER-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-09-28-watcher-first-read-worker-report-2.md (untracked)
