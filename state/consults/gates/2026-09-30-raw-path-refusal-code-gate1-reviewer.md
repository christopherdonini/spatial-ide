*Custodian's filing note (2026-09-30): the reviewer's gate 1 on PR #148, for PLAN node `publish-refusal-codes-and-attempt-lifecycle` at g1, the first piece (A4-4), full gating. Reviewed: cut/raw-path-refusal-code @ 8b4f15360cc2a47b7eeef1dec875ce3f1e102836 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 19:03:02Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 8b4f153. Its mutation observation at 8b4f153 is the observation of record for §4's mutation, and its P0 run at 4db0865 is the reproduction of record. N1 (T1 shares the `crs` fixture file with its sibling, which `fixture` rewrites on every call) is taken as correction round 1: the form's Amendment 1. Profile paths redacted at filing: none.*

---

Reviewed: cut/raw-path-refusal-code @ 8b4f15360cc2a47b7eeef1dec875ce3f1e102836

**Verdict: PASS.** Nothing blocks. There are three non-blocking notes.

**Checks**

1. **The diff (`git diff 8cee33b...8b4f153`)**
   - The one product change is at `kernel/src/lib.rs:382-383` @ 8b4f153. `open_engine_stream(&ds, &query, None).map_err(|e| skp::terminal_detail_of(&e))?` replaces `e.to_string()`, and a comment sits above it.
   - `open_engine_stream` returns `spatial_engine::Result` (`kernel/src/lib.rs:225-236` @ 8b4f153). It is the only fallible `EngineError` call in `create_from_raw_params`, and `wrap_for_data_plane` cannot fail. So every create-time `EngineError` on the raw path now gets `"<error_of code>: <Display>"` (`kernel/src/skp.rs:1848-1850` @ 8b4f153).
   - The seam: `protocol/data-plane/src/server.rs:475-490` @ 8b4f153 sends every `Ok(Err(detail))` from `factory.create` as `TERM_PRODUCER_FAILED` carrying that string, unchanged. The mid-stream arm (`kernel/src/lib.rs:623` @ 8b4f153) already used the same function, so the prefix is still minted in one place.
   - These refusals stay unprefixed `String`s: unknown operation (`kernel/src/lib.rs:334-337`), params decode (`:353`, via `StreamParams::decode`), unknown dataset (`:357`), all @ 8b4f153. `h7_an_engine_refusal_arrives_as_a_typed_terminal_with_its_own_words` still passes.
   - The raw path has a product caller: `kernel/src/main.rs:158` @ 8b4f153 (`with_connection_reports`, Raw mode).
   - I found no consumer that matches this detail by prefix or equality. canvas-probe only prints it (`frontends/canvas-probe/src/main.ts:261`), and the shell installs `ticket_only` (`frontends/shell/src-tauri/src/lib.rs:399`).
   - I recomputed all 13 span hashes in the form at a446efd, and all 13 match.

2. **P0 at B (4db0865)**
   - I ran T1 in a scratch worktree at `D:/wt-targets/raw-path-refusal-code/scratch-b`: rc=101.
   - It panicked at `kernel/tests/end_to_end.rs:546:28` with `the detail carries its typed code: refused: the viewport is expressed in EPSG:4326 and the dataset is in EPSG:2056. ...`. That is the prefix assertion, and the detail arrived unprefixed, as the form predicted.
   - I removed the scratch worktree and ran `git worktree prune`. The worktree list no longer has it.

3. **Mutation**: see the observation below.

4. **Suites at 8b4f153, exit codes read directly**
   - `cargo test -p spatial-kernel`: rc=0. Totals over the 38 result lines: 310 passed, 0 failed, 28 ignored. end_to_end had 10 passed, including T1. The declared-unchanged tests passed: h7, `a_viewport_in_the_wrong_crs_is_refused_end_to_end`, typed_terminal_codes (6), skp_admission (10), post_check_cost_report (1). No timing-sensitive test failed, so nothing needed a rerun.
   - `cargo clippy -p spatial-kernel --tests`: rc=0. The only warnings in the two changed files are `type_complexity` at `kernel/src/lib.rs:353` and `:423`. Both are untouched signature lines that predate the base, and end_to_end.rs has none.
   - rustfmt hunk counts:

     | File | 8cee33b | 8b4f153 |
     |---|---|---|
     | lib.rs (counted with its module tree, own hunks only) | 16 | 16 |
     | end_to_end.rs | 21 | 21 |

     No lib.rs hunk falls at lines 378-383. In end_to_end.rs, 4db0865 and 92045df each had 22 hunks (one at T1, line 544), and D removes it.
   - On main at 1c63abf:
     - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc=0, 353/353 passed.
     - verify-cites: rc=0, PASS.
     - verify-quotes: rc=0, PASS (112 checked).
     - verify-test-claims: rc=0, PASS (403 claims, 1 planned).
     - verify.mjs: rc=0, verify:plan PASS.
   - The same four scripts on the branch worktree: all rc=0. verify-test-claims shows 0 planned there, so T1 resolves.

5. **§8 and §7**
   - The product diff adds or changes no string literal outside comments. It adds no `pub` item.
   - Files touched: `kernel/src/lib.rs` and `kernel/tests/end_to_end.rs` only. Nothing under `protocol/`, `frontends/`, `publish/` or `permission/`.
   - `git diff --numstat 8cee33b...8b4f153 -- kernel/src kernel/tests` gives lib.rs 6/1 and end_to_end.rs 37/0. That is 44 lines over 2 files, against the ceiling of 60 over 2. No class 8.

6. **Timing**: T1 (`kernel/tests/end_to_end.rs:523-558` @ 8b4f153) has no sleep, timeout, `Instant` or elapsed-time check. The only deadline is the harness's `RECV_DEADLINE` (`kernel/tests/end_to_end.rs:193-197` @ 8b4f153), which only bounds a failing run.

7. **PR CI (`gh pr checks 148`)**, both runs on 8b4f153:
   - pass: `cargo test --workspace` (push run, 20m17s); `every commit is signed off`; both tauri build jobs; both `typecheck · build · vitest · cargo test` jobs.
   - pending: `cargo test --workspace` for the pull_request run (36760578398, in_progress). gh exited rc=8 because of it.

**Mutation observation (of record)**
- Commit: 8b4f153, worktree `C:/dev/wt/raw-path-refusal-code`.
- Applied: `kernel/src/lib.rs:383`'s `.map_err(|e| skp::terminal_detail_of(&e))` changed back to `.map_err(|e| e.to_string())`.
- Ran `cargo test -p spatial-kernel --test end_to_end a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code`: rc=101.
- `a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code` FAILED at `kernel/tests/end_to_end.rs:546:28`, the prefix assertion (`strip_prefix("engine.viewport_crs_mismatch: ")` then `unwrap_or_else(panic!)`), with the unprefixed `refused: the viewport is expressed in EPSG:4326 ...` detail.
- Reverted with `git checkout -- kernel/src/lib.rs`, and porcelain was empty.
- This was a mutation applied by hand, not a `verify-mutation` run.

**Blocking**
None.

**Non-blocking**
- **N1.** T1 uses `fixture("crs", 500)` (`kernel/tests/end_to_end.rs:525` @ 8b4f153), the same file name as its sibling at `:498`, so both write `target/fixtures/e2e-crs.parquet`. `write_geoparquet_cancellable` writes that file in place with `File::create` (`engine/src/fixture.rs:874` @ 8b4f153). When the two tests run in parallel, one can truncate the file while the other's `catalog.open` is reading it. I could not make it happen: I ran both tests together with `--test-threads 2` 60 times, and all 60 passed. Giving T1 a distinct fixture name (for example `"crs-raw-create"`) would remove the race.
- **N2.** The pull_request-event `cargo test --workspace` was still pending when I checked. The push-event run on the same SHA passed. Read the PR checks again before the merge.
- **N3.** The worker report (`state/consults/2026-09-30-raw-path-refusal-code-worker-report-1.md`, bullet under BUILT) records its mutation at 92045df. The observation of record is the one above, at 8b4f153. Also, the 21 rustfmt hunks in end_to_end.rs predate the base; D (rustfmt only) cleared only the hunk T1 introduced.

The worktree is clean at 8b4f153, and no scratch worktree remains.
