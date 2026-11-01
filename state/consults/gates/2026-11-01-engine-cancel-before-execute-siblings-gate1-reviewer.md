Reviewed: PR #273 at 5317510c3f7b06bf647932ae4b3d77bb91fb96e4 (base e3fb936a), gate 1, reviewer
Verdict: PASS WITH NOTES

Branch and commit: cut/engine-cancel-before-execute-siblings @ 5317510c3f7b06bf647932ae4b3d77bb91fb96e4. Main was at 0f6c62a44004c0f8a0af32e4c571d199f127b13e. The merge base is e3fb936a65087cc59a9a477d765b928df24eca2a (`git merge-base HEAD origin/main`, rc=0).

## Correctness
None.

## Evidence
None. All three recorded mutations fail as the record says, and each file was restored byte-equal (check 3). Every test is green at the head, locally and in CI on Windows and Ubuntu (checks 2 and 5).

## Documentation (fix both before the merge, no re-gate)

**D1. The form's Change line promises a change to the owner's index Cancellation row. The row was not changed.**
- The form's Change line says "engine/README.md item 3's blockquote and the owner's-index Cancellation row are brought into line". OPEN-3 (b) replaced the blockquote half; the row half still stands.
- `engine/README.md:543` at the head is unchanged from B. It still lists only `an_interrupt_on_an_idle_connection_is_not_latched` and T5.
- Whose words: not the human's. `git blame` gives 629fb7f1, "owner's index sections … (lead-data report 1 …)".
- Replacement words for the whole line 543:
  `  - Cancellation → `spatial_engine::CancelToken` · pinned by `engine/src/cancel.rs::tests::an_interrupt_on_an_idle_connection_is_not_latched`, `engine/tests/cancel_execute_window.rs::a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled`, `engine/src/dataset.rs::tests::a_cancellable_open_read_runs_inside_the_execute_window`, `engine/src/dataset.rs::tests::a_cancel_inside_the_identity_scans_execute_window_ends_the_admission_cancelled`, `engine/src/index.rs::tests::a_cancel_inside_the_index_scans_execute_window_ends_the_build_cancelled``
- Clause check:
  - The first two entries are unchanged.
  - The three added names exist at the head: `engine/src/dataset.rs:2198` and `:2212` in `dataset.rs`'s `mod tests`, and `engine/src/index.rs:913` in `index.rs`'s `mod tests`. All three passed in my head run.
  - The `path::tests::name` form is the row's own convention (`engine/src/cancel.rs::tests::…`).
  - The three tests pin the same property that T5 pins for `stream.rs`: the site's statement runs inside `CancelToken::execute_guarded`.
- Size: this adds +1/−1, so 218 changed lines. The closing record names that figure.

**D2. A comment's "this line" has lost what it pointed at.** At `engine/src/dataset.rs:2001-2007`, "both return before this line, so neither ever bumps the counter" meant the increment. The increment has moved into the closure at `:2014`, so "this line" now points at a comment line.
- Whose words: not the human's.
- Replacement: in `:2003`, change "both return before this line, so" to "both return before the guarded scan below, so". Re-wrap to 100 columns.
- Clause check:
  - The session-ordinal arm returns at `:1957`.
  - The `skip` arm returns at `:1982`.
  - The guarded scan is at `:2012-2017`, and its increment at `:2014` is the only `IDENTITY_VERIFICATION_SCANS.fetch_add` in the crate (grep).

## Notes (not findings, nothing owed)
- **N1. A rare false failure is possible in T-B and T-C. A false pass is not.**
  - The race: the helper reads `is_executing()` as true, is preempted before `cancel()`, and in that gap the guarded call returns `Ok` and passes the post-detach check. The test then fails at its `Err(Cancelled)` assertion.
  - Under each mutation the window never opens, so `saw_window` fails first.
  - Optional hardening: return `token.is_executing()` read after `token.cancel()`. A true value then proves the cancel landed inside the window, so the outcome is `Cancelled` by step 4 or by the post-detach check.
  - If this failure is ever seen in a shared run, it goes to the custodian for a re-run alone on the machine; it is not recorded as a failure.
- **N2. The per-run parquet files are removed on every path that returns, but not on every panic path.**
  - `remove_file` runs before the assertions. No `spatial-engine-ecbs-*` file was left in the temp dir after my unmutated run or after mutated runs B and C, both of which panicked at an assertion.
  - Not removed: a panic before the remove (the COPY's `unwrap`, `join().unwrap()`, or a panic inside `admit_identity` or `build_observed`). This is the same pattern as the existing `index.rs` tests at `:883` and `:906`.
  - Optional: a Drop guard.
- **N3.** The form predicts that under the T-B mutation "admission returns Ok". The record claims only the `saw_window` failure, which is what both the worker and I observed. Nothing is claimed beyond the observation.
- **The Out-of-scope line says "Guarantee: touched" on a five-line form.** That is the human's ruling: `state/directives/2026-10-30-…-rulings.md:17`, OPEN-2 (a), under AUTONOMY §36. No finding.

## Check 1: the diff
- **Size.** `git diff --numstat e3fb936a...HEAD -- engine/src engine/README.md` (rc=0) gives README 3/0, cancel.rs 50/4, dataset.rs 71/4, index.rs 61/1, layout.rs 14/4, rowgroup.rs 3/1. That is 202 insertions and 14 deletions, 216 lines, equal to Amendment 1. The unfiltered numstat lists the same six files and nothing else.
- **The six sites**, each as drafted:
  - `dataset.rs:1689` `cancellable`: `run(conn)` is guarded.
  - `:2012-2017` identity scan: the counter is now inside the closure (OPEN-4 (a)).
  - `index.rs:337-339`: `observe(DuckDbScan)` stays outside.
  - `rowgroup.rs:345-347`: `read_metadata` is guarded.
  - `layout.rs:350-355`: the `Query("clustered COPY: …")` mapping is inside, then `copied?`.
  - `layout.rs:453-458`: only `query_arrow`; the prepare (`:449`) comes before attach, then `scanned?`.
- **Attach sites.** The product code has seven `.attach(` sites; the seventh is `lease_for_stream` at `dataset.rs:2184`, unchanged. No guarded closure attaches or calls `execute_guarded`, so nothing nests.
- **`into_result`** (`cancel.rs:83-93`) is `pub(crate)`. It maps Ok→Ok, Err→Err, and Cancelled→`EngineError::Cancelled`. Its callers are the six product sites.
- **Error strings.** No error string changed: the two `layout.rs` format strings are byte-identical, just moved.
- **Existing tests.** No existing test was changed: the test hunks only add lines.
- **Untouched code.** The `cancel.rs` hunks are only `:83-93`, `:215-227` (the doc) and `:297-324` (`test_support`). So `execute_guarded` (`:193-213`) and the re-interrupter (`:132-177`) are untouched, and `stream.rs` is absent from the numstat.
- **README.** The sentence is at `:61-63`, after the paragraph. The blockquote `:52-56` has sha256 29b5010fa7d4921211080a7cf2f8d9fc087ccc923da81fd9171472320f6371a4 at both B and the head (OPEN-3 (b)).
  - Its clauses check against the code: six other attach sites; four `cancellable` callers (`:1432`, `:1708`, `:1738`, `:1814`); and no test of the `rowgroup.rs` site or either `layout.rs` site.
- **Doc comments, true against the code:**
  - the `into_result` doc;
  - the `cancellable` doc: refused at step 2 or re-raised by the re-interrupter;
  - the `is_executing` doc: it names T5, T-A, T-B and T-C, and has no product caller (grep);
  - `test_support`: `Instant` is used only for the deadline;
  - except D2.

## Check 2: the head, in `C:/dev/wt/ecbs` on `D:/wt-targets/ecbs`
- **Tests.** `cargo test -p spatial-engine --locked` returned rc=0, with 51 of 51 `test result: ok` lines.
  - The lib reported `test result: ok. 208 passed; 0 failed; …`.
  - `dataset::tests::a_cancellable_open_read_runs_inside_the_execute_window ... ok` (T-A)
  - `dataset::tests::a_cancel_inside_the_identity_scans_execute_window_ends_the_admission_cancelled ... ok` (T-B)
  - `index::tests::a_cancel_inside_the_index_scans_execute_window_ends_the_build_cancelled ... ok` (T-C)
  - `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled ... ok` (T5)
- **fmt.** `cargo fmt --all -- --check` returned rc=0 with 0 bytes of output.
- **Clippy.** `cargo clippy -p spatial-engine --locked --tests --no-deps` returned rc=0 ("Finished … in 0.53s", a cached replay of the warnings).
  - The only Scope-file warning is `engine\src\rowgroup.rs:331:5` (too many arguments) on the unchanged signature; the changed lines there are `:345-347`.
  - The other warnings are in `stream.rs`, `trace.rs` and `engine/tests/*`, none of them changed. None is at a changed line.

## Check 3: mutations, on an export
- **Setup.** `git archive 2ccac3d1` was extracted with `tar --force-local` into `D:/wt-targets/ecbs-g1r-export` (each step rc=0). Base sha256: `dataset.rs` fb13ab05efe7227d176a49cc8fe2e7610e02bb215e68c55e7e873af7a9e7a253, `index.rs` 216f2246a6033d73e6ef61f7447025048cc5842db9c639f6b51ee2fb30696b87, both equal to the worker's.
- **Cold build.** `cargo test -p spatial-engine --locked --offline --lib --no-run` with `CARGO_TARGET_DIR=D:/wt-targets/ecbs-g1r-target` returned rc=0 in 9m 49s.
- **Control.** The three tests unmutated returned rc=0, 3 passed.
- **The mutations.** Each was applied by a script that requires exactly one match:
  - **A**: `cancellable` runs `run(conn)` outside the guard. rc=101; `panicked at engine\src\dataset.rs:2199:9: the open read must run inside the execute window: Ok(false)`. Restored, sha256 fb13ab05… ✓.
  - **B**: `run_identity_scan` runs outside the guard (the counter kept). rc=101; `panicked at engine\src\dataset.rs:2225:9: the identity scan never ran inside the execute window`. Restored, fb13ab05… ✓.
  - **C**: `Self::scan` runs outside the guard. rc=101; `panicked at engine\src\index.rs:951:9: the index scan never ran inside the execute window`. Restored: `index.rs` 216f2246… ✓ and `dataset.rs` fb13ab05… ✓.
- Each failed by name at the assertion the record names (`dataset.rs:2195-2196`, `:2222-2224`, `index.rs:922-924`, commit 2ccac3d1). The export and its target are both removed (`ls`: no such file or directory).

## Check 4: the tests' soundness
- **The helper** (`cancel.rs:297-324`) is `#[cfg(test)] pub(crate)`. It sleeps 1 ms per turn and is bounded by `done` and the 60 s `TEST_LIVENESS_DEADLINE`. It reports only a bool and times nothing.
- **T-B and T-C reach their assertions only through the guarded site.** No other `execute_guarded` can be reached from `admit_identity` or `build_observed` (grep of every call site), and mutations B and C close the window, after which `saw_window` fails.
- **T-A** is deterministic and needs no file.
- **The counter.** The tests that read `identity_verification_scans()` are integration tests in their own processes, so T-B's increment in the lib binary cannot race them.
- **Cleanup**: see N2.

## Check 5: the verify scripts and CI
- **Verify scripts at the head**, in the worktree:
  - `verify.mjs --offline`: rc=0, `verify:plan PASS`.
  - `verify-cites.mjs`: rc=0, `verify:cites PASS` (76 loose references advised).
  - `verify-quotes.mjs` (timeout 580): rc=0, `verify:quotes PASS — 133 checked, 102 verified, 30 baselined, 1 advisory, … 0 ruling-cite errors`.
  - `verify-test-claims.mjs`: rc=0, `PASS — all 701 claimed test(s) across 215 file(s) …`.
- **`gh pr checks 273`** (rc=0): 18 of 18 pass.
- **Run head shas.** `gh run view` gives headSha 5317510c3f7b06bf647932ae4b3d77bb91fb96e4 for each of the 12 runs, all completed success: Rust workspace, fmt, Governance, Ported notices and shell on both push and pull_request; DCO and Exposure scan on pull_request.
- **The new tests in CI.** T-A, T-B, T-C and T5 show `... ok` in the logs of:
  - ubuntu-24.04 L1, jobs 124703828244 (push) and 124710385285 (PR);
  - windows-latest, jobs 124703828153 (push) and 124710385626 (PR).

## Hold lines
All are mine, with `also=` elided; each was followed by `MACHINE_RELEASED project=SpatialIDE shell=<same> affinity=FF (cores 0-7)`. No hold was refused and no exit code was 96 to 99.
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:69688` (head cargo test)
- `… shell=bash.exe:47312` (fmt)
- `… shell=bash.exe:34416` (clippy)
- `… shell=bash.exe:52152` (cold export build)
- `… shell=bash.exe:56176` (control)
- `… shell=bash.exe:82024` (mutation A)
- `… shell=bash.exe:78108` (mutation B)
- `… shell=bash.exe:37304` (mutation C)

## End state
- **Background shells**: five were started (bmdoci0nq, boyefa102, brqdsx4gg, bey4z7p0f, brytf254n). All exited on their own, with notifications received, so none was killed. `tasklist` shows no `cargo.exe`.
- **Worktree**: `git status --porcelain` in `C:/dev/wt/ecbs` is empty (0 bytes) and HEAD is 5317510c3f7b06bf647932ae4b3d77bb91fb96e4.
- **Export and target**: `D:/wt-targets/ecbs-g1r-export` and `D:/wt-targets/ecbs-g1r-target` are both gone.
- **Writes**: only my scratch folder (`ecbs-g1r-*` files), the export, its target and the worktree's own target.
