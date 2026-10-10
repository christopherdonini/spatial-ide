# PR #199 gate 1 — reviewer
Reviewed: cut/wire-bytes-invariant-trace-flag-race @ 17f0e1aaa2574a2b4704bbc92582233b36a1433b

**Verdict: PASS.** I found no Correctness finding and no Evidence finding. There is one Documentation finding (D-1). Under the proportional-gates rule it must be fixed in this PR before the merge, with no re-gate.

Base: §7's B = `git merge-base origin/main HEAD` = d151c2e0fb7ac3d53bf8ba4ad1540d1fb11dedc5. The worktree `C:/dev/wt/wb` is at the head, `git status --porcelain` is empty (0 lines), and nothing was committed or published.

## Correctness
None.

## Evidence
None.

## Documentation (must be fixed before the merge)

**D-1. The PR body's "stale pin" sentence is wrong. It repeats worker report 1.**
- What the PR body says: the form's pin for `TraceKey`'s `Default` derive "points at a stale line of `engine/src/trace.rs`", and the worker "re-derived it by symbol, as the form's pins line allows".
- What I found:
  - The pin is engine/src/trace.rs:767 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:da031c27293af9dfb7493f0b3593dbd8b30695b5ae6a82e5971d082fe50eb36a. It recomputes exactly.
  - `engine/src/trace.rs` is unchanged from 0c2be9cb to the head: `git diff 0c2be9cb HEAD -- engine/src/trace.rs` is 0 lines.
  - Line 767 is the call `start(TraceKey::default())` inside the unit test `a_second_trace_is_refused_rather_than_replacing_the_first`. It is a use that shows the `Default` exists, not the derive. The derive is at line 119, on the struct at line 120.
- So the pin is accurate for what the form claims (§4: "TraceKey has a Default"). It is not stale, and the Pins line's re-derivation clause (which applies when a merge moves a pinned file) did not apply.
- The fix: in the PR body, replace that sentence with "the pin points at a call of `TraceKey::default()`, not the derive (line 119); the file is unchanged since 0c2be9cb". The worker report on main is append-only and stays as filed. The PR body is the place to correct it.

## Checks, item by item

**Full diff** (`git diff origin/main...origin/cut/wire-bytes-invariant-trace-flag-race`): three files.
- `kernel/tests/wire_bytes_invariant.rs`: 23 added, 0 removed. It is the only code or test file.
- `kernel/README.md`: 5 added, 3 removed.
- `engine/README.md`: 2 added, 1 removed.
- Both README changes are inside their Owner's index sections.
- There are two commits: b47d96d2 (fix) and 17f0e1aa (docs). Both are signed off.
- Neither commit message, nor the PR title or body, has an outside issue or PR reference or an outside @mention. PR #189 is this repository's own.

**§7 count**, by the form's command: `git diff --numstat d151c2e0 HEAD -- kernel/tests/wire_bytes_invariant.rs` gives `23 0`. That is 23 against 40, so there is no overrun. There are 4 non-generated files against the limit of 5: the form, which is on main and unchanged by this PR (`git diff HEAD origin/main` on it is empty), plus the three files above.

**§8, item by item:**
1. Clear. Both form commits (a4e1638b and 76a09d5c, the latter carrying Amendment 1) are ancestors of the base. The merges of #197 (b8ad22ff) and #198 (b271660a) are in the base. The code commit b47d96d2 comes after all of them.
2. Clear. No file under engine/, protocol/, frontends/ or kernel/src, no other test file, and no Cargo or workflow file is changed.
3. Clear. The binding is `let _serial = serial();`, it is the first statement of both bodies (lines 191 and 398), it lives to the end of each body, and the lock is §2's `TRACE_SERIAL`.
4. Clear. `trace.rs` is unchanged, and both `expect("no other trace is running")` calls are intact.
5. Clear. The diff has 0 removed lines, so no assertion, message, test name, collector, fixture, header or recorded-mutation comment changed.
6. Clear. There is no sleep, retry, timeout or test-thread setting.
7. Clear. Both tests are still in this file. The binary has exactly two tests: the `#[tokio::test]` attributes are at lines 189 and 396, line 180 is that attribute named inside the doc comment, and `watch_support/mod.rs` has none.
8. Clear. The new doc comment has no path:line cite.
9. Clear. The PR body's claims stay within §1.
10. Clear. There is no code for an OPEN-1 site.
11. Clear on every round-25 item. There is no overrun, and §7 was not edited. There is no scope addition. No `verify-mutation` run is called an observation: the report and the PR body both say none was used. No test-text span is pinned by hash at a branch commit. Lead-data's branch pointers are named "read at b47d96d2", and the worker's lines are named at b47d96d2.

**§2 against the code.**
- C1: the static and the function are after `collect_frames` and above the first test, neither is `pub`, and the lock recovers from poisoning with `into_inner`.
- C3: the doc covers each required point and names symbols only.
- The seam: only the existing `is_enabled`, `start` → `Option<TraceGuard>` and the guard's `Drop` are used.
- `trace::start` has no product caller. A search of engine/src, kernel/src and protocol (outside trace.rs) finds only the two doc comments at kernel/src/lib.rs:616 and engine/src/stream.rs:709.

**Hash pins: all 64 in the form recompute** at their pinned commits: 63 at 0c2be9cb and Amendment 1's at b4dc05e0, for the rulings file's lines 51-52.

**Macro-expansion check: confirmed.**
- `Cargo.lock` at the head has tokio 1.53.1 (lines 2068-2069) and tokio-macros 2.7.2 (lines 2084-2085), matching §2. The lock file is unchanged by the PR.
- In the cargo registry's tokio-macros-2.7.2 `src/entry.rs`, `parse_knobs` handles a test like this: `let body = async #body; #crate_path::pin!(body);`, then `return Builder::new_multi_thread().enable_all().build().expect("Failed building the Runtime").block_on(body);`.
- In tokio-1.53.1, `src/runtime/scheduler/multi_thread/mod.rs:87-93` shows that `block_on<F: Future>` (no `Send` bound) runs `enter_runtime(...)` and then `blocking.block_on(future)`. That polls the future on the calling thread, which is the test's own thread.
- The `!Send` `MutexGuard` held across `.await` compiles, which agrees: the body is never spawned.
- The guard is held across the whole body.

**Mutations: both re-observed at 17f0e1aa**, whose test file is identical to b47d96d2's (`git diff b47d96d2 HEAD -- kernel/tests/wire_bytes_invariant.rs` is empty). Each ran in its own shared hold, was reverted with `git checkout --`, and `git status --porcelain` was then 0 lines with HEAD at 17f0e1aa.
- **M-1.** The edit: `let g = TRACE_SERIAL.lock()...; std::mem::forget(trace::start(TraceKey::default())); g`. Run: `cargo test -p spatial-kernel --test wire_bytes_invariant`, exit 101. Both tests failed by name at their opening assertion:
  - `tracing_changes_no_byte_on_the_wire`, at kernel\tests\wire_bytes_invariant.rs:197:5;
  - `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too`, at kernel\tests\wire_bytes_invariant.rs:403:5;
  - both with "tracing is off unless a trace is started", and "0 passed; 2 failed".
  - P-1 holds, matching the worker's record at b47d96d2.
- **M-0.** The edit: line 216's `drop(guard);` becomes `std::mem::forget(guard);`. Run: `-- --test-threads=1`, exit 101. The printed order was the sibling `... ok`, then the projected test `FAILED` at :401:5 with the same message, "1 passed; 1 failed". This is the sibling-first shape and matches the worker's record. It shows consistency only.
- The code's recorded-mutation note, the K-6 comment, is byte-unchanged (0 removed lines). The form asks for no new in-code note.

**R-0 / R-1.** I did not re-run the 100-run sets. The worker records 100/100 at d151c2e0 and 100/100 at b47d96d2. Run once at the head in a shared hold: 2 passed, 0 failed.

**Suites:**
- `cargo test -p spatial-kernel --test wire_bytes_invariant`: exit 0, "2 passed; 0 failed", run in a shared hold.
- `cargo fmt --all --check`: exit 0.
- `cargo clippy -p spatial-kernel --test wire_bytes_invariant`: exit 0, run in a shared hold. The test target has exactly two warnings, both `clippy::await_holding_lock`, at wire_bytes_invariant.rs:191:9 and :398:9, as §2 foresaw. No other warning is on an added line. The renderer has 2 lib warnings, the engine 3 and the kernel lib 5, all outside the diff.

**Owner's index.**
- All 10 "New" lines of lead-data's update appear as whole lines in the READMEs at the head. The numstat (kernel 5/3, engine 2/1) matches 3 replacements, 2 insertions, 1 replacement and 1 insertion.
- Every pointer in both sections resolves at the head:
  - every `path::[mod::]fn` test pointer: 47 distinct in kernel, 42 in engine, file and `fn` and inline `mod` each found;
  - every backticked file path exists;
  - the new symbols `start`:329, `TraceGuard`:343, `TraceKey`:120, `mark`:302, `is_enabled`:320 and `CURRENT`:98 are in `engine/src/trace.rs`, and the module is public at `engine/src/lib.rs:115`;
  - the targets ADR-004 "Amendment 4" (its heading at line 31) and `kernel/CANCELLATION-AND-TRACING.md` §5 (:144) and §7 (:178, which states the one-traced-stream limit) exist.
- Section sizes are 41 and 35 lines, under 60.
- "Last verified at: b47d96d2" holds, because 17f0e1aa changes only the two READMEs.
- Lead-data's two self-noted slips. The first (§0 cites §9 rather than line 239) is not a defect: the quoted phrase in quotation marks appears byte for byte in form line 239, and a section cite is allowed. The second (the engine line in quotation marks) is real: the README line carries bold markers. Both are in a filed consult on main and outside this diff, and the PR body discloses them accurately. Nothing more is owed here.

**Governance**, run at the head in the worktree, outside a hold because they are light:

| Check | Exit | Result |
|---|---|---|
| verify-cites | 0 | PASS, 1622 files, 49 loose advisories outside this diff |
| verify-quotes | 0 | PASS |
| verify-test-claims | 0 | PASS, 531 claims |
| verify | 0 | verify:plan PASS |
| queue --check | 0 | current |
| site --check | 0 | current |
| cfg-boundary | 0 | 0 sites outside every boundary |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 | 457 of 457 passed |

**CI** (`gh pr checks 199`). At first, one check was pending: windows-latest in pull_request run 38048283192. I waited with `gh pr checks 199 --watch --interval 110` (exit 0, settled by 11:43:44Z) and re-printed it, exit 0. All 13 lines pass. Push run 38047957538 and pull_request run 38048283192 are both at 17f0e1aa.
- L1 portable correctness · cargo test --workspace (ubuntu-24.04): pass 4m33s (run 38047957538)
- L1 portable correctness · cargo test --workspace (ubuntu-24.04): pass 4m19s (run 38048283192)
- cargo fmt --check (workspace and src-tauri): pass 11s
- cargo test --workspace (windows-latest): pass 14m26s (run 38047957538)
- cargo test --workspace (windows-latest): pass 18m40s (run 38048283192)
- cfg boundary (PORTABILITY R2): pass 9s
- every commit is signed off: pass 8s
- no profile path in the range: pass 9s
- tauri build (NSIS, build-only, no signing): pass 4m50s
- tauri build (NSIS, build-only, no signing): pass 4m29s
- test · verify:plan · queue/site drift: pass 1m14s
- typecheck · build · vitest · cargo test: pass 7m50s
- typecheck · build · vitest · cargo test: pass 5m57s

**PR body against the head and the report.** Everything else matches: the base and head, the 23 against 40, the section sizes 41 and 35, the mutation outcomes, R-0 and R-1 with their commits, the clippy pair, and the May-not-claim line. The one exception is D-1.

## Note (no finding, no action)
The lock is released when a test's body future completes. That happens before `block_on` returns and before that test's runtime is dropped. Leftovers from one test's teardown can therefore overlap the next test's body. Because the guard is gone by then, the flag stays off through the next test's untraced run. A late `batch_full` stamp landing in the next test's trace would need a producer that is still running after its collector saw TAG_TERMINAL. That is the same data-plane link §1 already lists as unpinned, and nothing in the diff or the PR claims it.

## Holds and commands
- Heavy runs: 4 shared holds, each `hold shared -Project SpatialIDE`, `-Minutes 15 -MaxWaitMinutes 20`, granted on cores 0-7, each released (MACHINE_RELEASED printed). Each ran with CARGO_TARGET_DIR=D:/wt-targets/cov, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. The script returned no code from 96 to 99.
  1. The test at the head: exit 0.
  2. clippy: exit 0.
  3. M-1: exit 101, the expected failure.
  4. M-0: exit 101, the expected failure.
- Free runs: fmt, the governance scripts, `node --test` and the `gh` commands.
- I killed no process.
- Disclosure: I wrote one temporary file outside the scratch folder (`gov.out` under `/tmp`) while running the governance loop, then deleted it. Every other temporary file is in the scratch folder.
