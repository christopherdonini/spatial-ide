*Custodian's filing note (2026-11-01): `engine-cancel-before-execute-siblings`, built by a worker on `cut/engine-cancel-before-execute-siblings` from main e3fb936a, head 5317510c; 216 changed lines against the Scope's 150, class 6 (the form's Amendment 1). The custodian's check by git: origin's branch is at 5317510c, 3 commits past main. By its transcript: 3 commits, one push to the branch, no reset, rebase, merge, amend, force, PR action or claude call; Read 24, Bash 89, Grep 6, Edit 21, Write 5; run 23:53:04Z to 01:05:46Z. Its nine shared holds match its nine hold lines; no hold refused. Draft PR #273 opened by the custodian. Extracted by script from its SubagentHandback call, with one final newline added; the session's scratch folder, named 0 time(s) by its full path, is written `<scratch>/`; nothing else is changed. Its sha256 as handed back, from line 5 to the end, is e8649175b092aecb882ff9b65ae7d44880abcf1600a031cee866ddbb14a2068d; as filed, e8649175b092aecb882ff9b65ae7d44880abcf1600a031cee866ddbb14a2068d.*

---

Built: engine-cancel-before-execute-siblings at 5317510c3f7b06bf647932ae4b3d77bb91fb96e4

One thing to act on: the diff is 216 changed lines (202 insertions + 14 deletions) against the Scope's 150. I did not trim it. Everything else passed with no stop rule met.

Branch cut/engine-cancel-before-execute-siblings. Worktree C:/dev/wt/ecbs from e3fb936a65087cc59a9a477d765b928df24eca2a. `.cargo/config.toml` sha256 is 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, equal to the one you gave. The form's sha256 is b4ba6c5ae6c057ab5abc29a6b41a8ca2d8f5aa6d74b987e69db903abca3c85cc. Target dir was D:/wt-targets/ecbs.

**Commits** (each signed off, no `@` outside the first trailer line, `git add` by path):
1. 7a213633abc6ed81a0a2df824e73e39dc88e66d3 `fix: engine-cancel-before-execute-siblings, the six other cancel.attach sites run inside the execute-window guard`
2. 2ccac3d1a8b3def9fa16c861d71623ab2ad1e200 `test: engine-cancel-before-execute-siblings, three tests that each tested site runs inside the execute window`
3. 5317510c3f7b06bf647932ae4b3d77bb91fb96e4 `docs: engine-cancel-before-execute-siblings, the three recorded mutations beside their tests`

**Sites as changed.** The line numbers at my base e3fb936a matched the form's pins, so no cite had moved. Lines below are base lines.
- Site 1: `engine/src/dataset.rs`, `cancellable`, `run(conn)` at 1685 (attach at 1684). It now runs as `cancel.execute_guarded(|| run(conn)).into_result()`. I added a 4-line doc paragraph to the function.
- Site 2: `engine/src/dataset.rs`, `admit_identity`, `run_identity_scan` at 2008. It is now inside `execute_guarded`, and `IDENTITY_VERIFICATION_SCANS.fetch_add` (base 2003) moved into the same closure (OPEN-4 (a)). I added two comment lines beside the old increment saying so.
- Site 3: `engine/src/index.rs`, `SpatialIndex::build_observed`, `Self::scan` at 337. `observe(.., DuckDbScan)` stays outside the guard.
- Site 4: `engine/src/rowgroup.rs`, `RowGroupIndex::build`, `Self::read_metadata` at 345.
- Site 5: `engine/src/layout.rs`, `rewrite`, `conn.execute_batch(&copy)` at 350. The `Query("clustered COPY: ..")` mapping moved into the closure, and the old `copied.map_err(..)?` is now `copied?;`.
- Site 6: `engine/src/layout.rs`, `curve_keys`, `stmt.query_arrow([])` at 448. The `Query("curve-key scan: ..")` mapping moved into the closure, and the old `scanned.map_err(..)?` at 452 is now `scanned?`.
- `engine/src/cancel.rs`: new crate-private `impl<T> Guarded<T, EngineError> { fn into_result }` (Ok and Err pass through, Cancelled becomes `EngineError::Cancelled`). The `is_executing` doc now names the T5 test, T-A, T-B and T-C.
- No error string changed (the same format strings moved into closures). `stream.rs`, `execute_guarded`'s four steps and the re-interrupter are untouched. No existing test was changed.

**README sentence** (`engine/README.md`, appended to the paragraph after the blockquote; the blockquote is byte for byte as it was). Byte-copied from `sed -n 61,63p`:
```
The six other sites that bind a token to a connection — `cancellable` (the four open-path reads), the
identity scan, the index build's scan, the row-group metadata read and the two `layout.rs` statements —
run their statement through the same guard; at the last three that routing is not observed by any test.
```

**Tests** (commit 2):
- T-A `dataset::tests::a_cancellable_open_read_runs_inside_the_execute_window`. The closure returns `cancel.is_executing()`. It asserts `matches!(inside, Ok(true))`.
- T-B `dataset::tests::a_cancel_inside_the_identity_scans_execute_window_ends_the_admission_cancelled`. It writes a per-run parquet of 4,000,000 u64 ids by DuckDB COPY and calls `admit_identity` on the native `id`. It asserts `saw_window` first, then `matches!(admitted, Err(EngineError::Cancelled))`. The file is removed before the assertions.
- T-C `index::tests::a_cancel_inside_the_index_scans_execute_window_ends_the_build_cancelled`. It uses a per-run parquet of 4,000,000 rows (id plus four doubles) and a `CoveringBbox` built from `FieldPath`. It calls `SpatialIndex::build_observed` and asserts `saw_window`, then `Err(Cancelled)`. The file is removed before the assertions.
- Helper: `cancel.rs` `#[cfg(test)] pub(crate) mod test_support::cancel_when_executing(&CancelToken, &Arc<AtomicBool>) -> JoinHandle<bool>`. It spins on `is_executing()` with a 1 ms sleep, bounded by `done` and a 60 s `TEST_LIVENESS_DEADLINE`, then cancels. It times nothing.

**Mutations.** Each was applied alone and the named test run alone, all at commit 2ccac3d1a8b3def9fa16c861d71623ab2ad1e200. After each I ran `git checkout` on the file and showed its sha256 equal to commit 2's.
- T-A: `cancellable` runs `run(conn)` outside the guard. The test failed by name at `dataset.rs:2199` with "the open read must run inside the execute window: Ok(false)". `dataset.rs` reverted to fb13ab05efe7227d176a49cc8fe2e7610e02bb215e68c55e7e873af7a9e7a253.
- T-B: `run_identity_scan` runs outside the guard. The test failed by name at `dataset.rs:2225` with "the identity scan never ran inside the execute window", which is the `saw_window` assertion. Reverted to the same `dataset.rs` hash. I observed only that first assertion failing, so I do not claim what admission returned.
- T-C: `Self::scan` runs outside the guard. The test failed by name at `index.rs:951` with "the index scan never ran inside the execute window". `index.rs` reverted to 216f2246a6033d73e6ef61f7447025048cc5842db9c639f6b51ee2fb30696b87.
- Commit 3 holds the three `RECORDED MUTATION (observed at 2ccac3d1...)` doc lines beside the tests, comments only. A mutation log is at the scratch folder's `ecbs-mutA.log`, `ecbs-mutB.log` and `ecbs-mutC.log`.

**Checks at head 5317510c** (hold-wrapped checks have no printed exit code; I read the log tail):
- Commit 1: `cargo test -p spatial-engine --locked` exited 0, 51 `test result: ok` lines, the lib at 205 passed, 0 failed. `--features fixture --no-run` exited 0 and built the test executables.
- Head: `cargo test -p spatial-engine --locked` exited 0. 51 of 51 result lines are ok and none failed. The lib shows `208 passed; 0 failed`, and `cancel_execute_window` (T5) passed. The three new tests passed in that run.
- Head: `cargo test -p spatial-engine --locked --features fixture --no-run`, rc=0, last line `Executable tests\stream_fetch_overflow.rs ...`.
- `cargo fmt --all -- --check`, rc=0, no output.
- `cargo clippy -p spatial-engine --locked --tests --no-deps`, rc=0, last line `Finished dev profile ... in 47.60s`. The only warning in a Scope file is `engine\src\rowgroup.rs:331:5`, `this function has too many arguments (8/7)`, on the untouched `RowGroupIndex::build` signature (pre-existing). Nothing is reported at my changed lines.
- `node scripts/plan/verify.mjs --offline`, rc=0: `verify:plan PASS`.
- `verify-cites.mjs`, rc=0: `verify:cites PASS`, 76 loose references advised (none mine).
- `verify-quotes.mjs`, rc=0: `verify:quotes PASS — 133 checked, 102 verified, 30 baselined, 1 advisory`.
- `verify-test-claims.mjs`, rc=0: `verify:test-claims PASS — all 701 claimed test(s) across 215 file(s) exist or are planned, superseded or withdrawn`.

**Size.** `git diff --numstat origin/main...HEAD -- engine/src engine/README.md` gives:
```
3 0 engine/README.md
50 4 engine/src/cancel.rs
71 4 engine/src/dataset.rs
61 1 engine/src/index.rs
14 4 engine/src/layout.rs
3 1 engine/src/rowgroup.rs
```
That totals 216 against the Scope's 150, an overrun of 66. Commit 1 alone is 71; the tests and helper add 136; the mutation records add 9. The form estimated about 115. The helper (29 lines) and the two 4,000,000-row tests (about 55 lines each, after rustfmt) account for most of the excess. I did not trim.

**Disclosures.**
- The `is_executing` doc in commit 1 names `test_support::cancel_when_executing`, which lands in commit 2. It is plain backticks, not an intra-doc link.
- Caller grep for the new items: `into_result` has the six product sites. `cancel_when_executing` is cfg(test) with two callers (T-B and T-C).
- Pre-gate classes:
  - No cross-module seam is touched; kernel files are not edited.
  - Each completion claim points to a named test or a mutation observation.
  - No user-visible string was added or changed.
  - Each test reached its intended assertion under its mutation.
- No stop rule met. Sites 4 to 6 are routed through the guard with no test, as the settlement words it. The temp parquets were removed after every run (checked after mutations B and C).
- Waiting loops: my early `until [ -s <hold output> ]` loops returned at once (the hold's first line makes the file non-empty), so they waited nothing. A later `until ! tasklist | grep cargo.exe` loop carried a hard `timeout` and ended itself.

**Hold lines** (mine only, `also=` elided; each followed by `MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)`). Each ran `hold shared` with `-Project SpatialIDE`, `-What` naming this piece, 8 build jobs and test threads:
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:32028` (commit 1 test)
- `... shell=bash.exe:31192` (commit 1 fixture compile)
- `... shell=bash.exe:4516` (the three new tests)
- `... shell=bash.exe:31424` (mutation T-A)
- `... shell=bash.exe:47796` (mutation T-B)
- `... shell=bash.exe:39220` (mutation T-C)
- `... shell=bash.exe:27064` (head full test)
- `... shell=bash.exe:55336` (head fixture compile)
- `... shell=bash.exe:57080` (clippy)
- No hold was refused; there were no exit codes 96 to 99.

**Final state.** `git rev-parse HEAD` and `origin/cut/engine-cancel-before-execute-siblings` are both 5317510c3f7b06bf647932ae4b3d77bb91fb96e4, pushed once with `-u` after commit 3. `git status --porcelain` is empty. Only the six Scope files changed. The form, `governance/PLAN.yaml`, `.claude/` and `stream.rs` are untouched. No PR action.

**Background shells.** None left running: all my background Bash commands exited on their own and no process of mine remains.

**Model** as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.
