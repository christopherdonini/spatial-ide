*Custodian's filing note (2026-10-09): `wire-bytes-invariant-trace-flag-race`'s worker report 1, the worker-high run 19:25:50Z to 19:39:05Z by its transcript, on `cut/wire-bytes-invariant-trace-flag-race` from d151c2e0, head b47d96d28c6621077a9ce9d2ca56d78cdd84edfb, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is e103c7720a499adb3fe46690f7f02b178e333c310809f98066eb9572274b0e11. The custodian checked that the worktree is clean at that head. The rest is the worker's.*

---

REPORT: wire-bytes-invariant-trace-flag-race (slot 2, item c). Code is built and published. No invalidator fired. One difference from your brief: clippy warns on both added lines (below). Model observed: Sonnet 5.5. No context handoff received or produced.

**Commits**
- b47d96d2 "fix: wire_bytes_invariant's two traced tests take turns on the trace flag and slot". Signed off, trailer present. It adds the file-local `static TRACE_SERIAL: std::sync::Mutex<()>`, `fn serial()` with its doc, and `let _serial = serial();` as the first statement of each of the two test bodies.
- That is the only commit. The branch is cut from d151c2e0.

**Before any code**
- The form is in the worktree with Amendment 1. §8 item 1 is satisfied: items a and b are merged (#197, #198) in the base.
- rustc is 1.97.1 (8bab26f4f 2026-07-14). The locked versions are tokio 1.53.1 and tokio-macros 2.7.2 (Cargo.lock lines 2066-2070 and 2082-2086).
- Macro check passed. The expansion read from tokio-macros-2.7.2 `src/entry.rs`, `parse_knobs`, is `return Builder::new_multi_thread().enable_all().build().expect("Failed building the Runtime").block_on(body);`. So `block_on` runs on the test's own thread, and the second invalidator did not fire.

**§7 counts, by the form's command**
- B = `git merge-base origin/main HEAD` = d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5. `git diff --numstat B HEAD -- kernel/tests/wire_bytes_invariant.rs` gives `23 0 kernel/tests/wire_bytes_invariant.rs`. That is 23 lines against the 40 ceiling, so no overrun.
- `git diff --stat d151c2e0 HEAD` shows only that one file.
- Non-generated files so far: 1 of 5. The two READMEs and PLAN.yaml are not touched.

**Baseline and prediction runs**
Each is 100 consecutive `cargo test -p spatial-kernel --test wire_bytes_invariant`, each run with exit 0 and "2 passed; 0 failed". I did not record timing.
- R-0, at d151c2e0 before any code: 100 of 100 passed, no failure to record. The build step ran inside the hold. Windows reproduction was neither expected nor required.
- R-1 (P-2), at b47d96d2: 100 of 100 passed, so P-2 holds. The falsification condition (a failure at an opening assertion or at a start's expect with the lock in place) did not occur.
- Neither count says anything about a rate or the race's absence (§1).
- There was no timing-dependent failure to hand over.

**Mutations**
Each was applied by hand and run by name. None was a `verify-mutation` run. All were observed at b47d96d2 and reverted. After each revert `git status --porcelain` was empty, and HEAD was still b47d96d2. Nothing mutated was committed.
- **M-1 (P-1 holds).**
  - Edit: in `serial()`, `let g = TRACE_SERIAL.lock()...; std::mem::forget(trace::start(TraceKey::default())); g`.
  - Run: `cargo test -p spatial-kernel --test wire_bytes_invariant`.
  - Both tests failed, each at its opening assertion:
    - `tracing_changes_no_byte_on_the_wire` panicked at kernel\tests\wire_bytes_invariant.rs:197:5: "tracing is off unless a trace is started".
    - `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too` panicked at kernel\tests\wire_bytes_invariant.rs:403:5: "tracing is off unless a trace is started".
  - Result line: "0 passed; 2 failed". The line numbers include the two mutation lines.
- **M-0.**
  - Edit: in `tracing_changes_no_byte_on_the_wire`, `drop(guard);` became `std::mem::forget(guard);` (line 216 at this commit).
  - Run: `cargo test -p spatial-kernel --test wire_bytes_invariant -- --test-threads=1`.
  - The printed order was `tracing_changes_no_byte_on_the_wire ... ok`, then `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too ... FAILED` at kernel\tests\wire_bytes_invariant.rs:401:5 with "tracing is off unless a trace is started". The result line was "1 passed; 1 failed".
  - This is the sibling-first shape of §0.1. It shows consistency only, not CI's cause.
  - I ran it with the lock in place, at b47d96d2, not at the branch point. With --test-threads=1 the lock is released between the tests, so the outcome is the same. Say if you want a re-run at d151c2e0.

**fmt and clippy**
- `cargo fmt --all --check` exits 0.
- `cargo clippy -p spatial-kernel --test wire_bytes_invariant` finished with exit 0 but shows 2 warnings on added lines, both `clippy::await_holding_lock`. They are on `let _serial = serial();` at lines 191 and 398 of the file at b47d96d2.
- This is not the "no warning on an added line" your brief expected. The form foresaw it at §2 ("Clippy's await_holding_lock would name this hold... No allow attribute is added"), and no workflow runs clippy (`grep clippy .github/workflows` finds only a comment in rust-fmt.yml). I added no allow attribute.
- The 5 `spatial-kernel` lib warnings, the 3 engine warnings and the 2 renderer warnings are not from this diff.
- `trace_spans` (the precedent) shows no `await_holding_lock` warning.

**Heavy commands (all with the shell shape you gave)**
- R-0: `hold shared -Project SpatialIDE -Minutes 10 -MaxWaitMinutes 5`, granted (cores 0-7). Command: my 100-run loop script, with CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. Exit 0, release confirmed.
- R-1: same hold shape, same command, exit 0, release confirmed.
- Every other build or run was free: at most 2 jobs and single runs (the initial `--no-run` build of about 58 s, the single test runs, the mutation runs, fmt and clippy).
- No exit code from 96 to 99 occurred.

**§8, item by item**
1. No code before the form was committed, and items a and b are merged. Clear.
2. Only kernel/tests/wire_bytes_invariant.rs changed. Nothing under engine/, protocol/, frontends/ or kernel/src, no other test file, no Cargo or workflow file. Clear.
3. The binding is `_serial`, not `_`. `serial()` is the first statement of both bodies. The guard lives to the end of each body. The lock is the §2 one. Clear.
4. start's refusal, the flag and the slot are untouched, and no test tolerates a refused start. Clear.
5. No assertion, message, test name, collector, fixture, module header or recorded-mutation comment was edited. The diff is 23 additions and 0 deletions. Clear.
6. No sleep, retry, timeout or test-thread setting in the file or CI. `--test-threads=1` was used only on the command line for M-0. Clear.
7. The two tests are not merged or moved. Clear.
8. The new doc has no path:line cite. It names symbols only. Clear.
9. I made no claim beyond §1. Clear.
10. No code for an OPEN-1 site, per Amendment 1. Clear.
11. No §7 overrun and no scope addition. No `verify-mutation` run was called an observation, and every mutation carries its commit id. No test-text span is pinned by hash at a branch commit. Clear.

**Differences from the form**
- The form's pin for `TraceKey`'s Default, engine/src/trace.rs:767, is stale. At this tree the `#[derive(Clone, Debug, Default)]` is at engine/src/trace.rs:119, on the struct (derive on line 119, `pub struct TraceKey` on line 120). Re-derived by symbol as the Pins line allows. The mutation compiled and ran as specified.
- The clippy warnings above, which the form predicted but your brief did not.
- M-0 was observed at the piece head, not the branch point.
- Not done, as instructed: the owner's-index update, the PLAN edit, and the pre-gate verifiers (verify-cites, verify-quotes, the `node --test` scripts suite, verify-plan). I added no record text, so the form and Amendment 1 are unchanged.

**Final state**
- `git status --porcelain` is empty.
- HEAD is b47d96d28c6621077a9ce9d2ca56d78cdd84edfb.
- It is published. `git push -u origin cut/wire-bytes-invariant-trace-flag-race` was the only publish, with no force and no pull request, and origin/cut/wire-bytes-invariant-trace-flag-race equals HEAD.
- Worktree: C:/dev/wt/wb.
- File changed: C:\dev\wt\wb\kernel\tests\wire_bytes_invariant.rs.
- Run summaries (R-0 and R-1) are in my scratch folder.
