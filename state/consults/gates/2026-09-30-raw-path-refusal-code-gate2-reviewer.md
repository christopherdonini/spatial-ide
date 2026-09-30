*Custodian's filing note (2026-09-30): the reviewer's gate 2 on PR #148, scoped to correction round 1 (the form's Amendment 1), for PLAN node `publish-refusal-codes-and-attempt-lifecycle` at g1, the first piece (A4-4). Reviewed: cut/raw-path-refusal-code @ 3777ad027e4eebe9df9707b8046a54f484e4e8b9 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 19:47:46Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 3777ad0. Its mutation observation at 3777ad0, with the message text, is the observation of record for correction round 1; Amendment 1 item 3's owed evidence is its checks 2, 3 and the observation. Profile paths redacted at filing: none.*

---

Reviewed: cut/raw-path-refusal-code @ 3777ad027e4eebe9df9707b8046a54f484e4e8b9

**Verdict: PASS.** Nothing blocks. There are two non-blocking notes.

**Checks**

1. **The correction diff**
   - `git diff --stat 8b4f153..3777ad0` shows one file, `kernel/tests/end_to_end.rs`, with 1 insertion and 1 deletion.
   - The one hunk is `kernel/tests/end_to_end.rs:525` @ 3777ad0, where `fixture("crs", 500)` becomes `fixture("crs-raw-create", 500)`. No other test text changed. The sibling at `:498` still uses `"crs"`. The helper at `:37-47` is unchanged.
   - This matches Amendment 1 item 2 (the form on main, §10).
   - All 9 fixture names in end_to_end.rs are now unique: h1, h1-viewport, h2, h2-early, h3, h5, h7, crs, crs-raw-create.
   - After the runs, `target/fixtures/` holds two separate files, `e2e-crs.parquet` and `e2e-crs-raw-create.parquet`. Both are 199435 bytes, so the generator and the feature count are the same.
2. **The pair, under default threads**
   - I ran T1 and `a_viewport_in_the_wrong_crs_is_refused_end_to_end` together 12 times. All 12 runs gave rc=0 with 2 passed each time.
   - No timing-sensitive test failed, so nothing needed a rerun.
3. **Size budget**
   - `git diff --numstat 8cee33b...3777ad0 -- kernel/src kernel/tests` gives `kernel/src/lib.rs` 6/1 and `kernel/tests/end_to_end.rs` 37/0.
   - That is 44 changed lines over 2 files, against the §7 ceiling of 60 over 2. No class 8.
4. **The end_to_end suite at 3777ad0**
   - `cargo test -p spatial-kernel --test end_to_end`: rc=0, 10 passed, 0 failed.
   - The passing tests include T1, h7 and the sibling.
5. **rustfmt**
   - `rustfmt --check --edition 2021` on end_to_end.rs finds 21 hunks at 3777ad0.
   - It also finds 21 at 8b4f153. I checked that from a copy made with `git show` into scratch, then deleted the copy.
6. **`gh pr checks 148`**
   - The PR head is 3777ad0 (`gh pr view` headRefOid).
   - All 7 checks pass, and gh exited rc=0:
     - both `cargo test --workspace (windows-latest)` jobs (20m39s and 19m53s);
     - `every commit is signed off`;
     - both tauri NSIS build jobs (5m16s and 4m15s);
     - both `typecheck · build · vitest · cargo test` jobs.
   - Gate 1's N2 (a check still pending) is resolved.

**Mutation observation (of record for correction round 1)**
- Commit: 3777ad0, in the worktree `C:/dev/wt/raw-path-refusal-code`.
- Applied: at `kernel/src/lib.rs:383` @ 3777ad0, `.map_err(|e| skp::terminal_detail_of(&e))` changed back to `.map_err(|e| e.to_string())`.
- Ran `cargo test -p spatial-kernel --test end_to_end a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code`: rc=101.
- `a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code` FAILED. It panicked at `kernel\tests\end_to_end.rs:546:28`, which is the prefix assertion's `unwrap_or_else(panic!)`. The message text, copied from the test output:
  `the detail carries its typed code: refused: the viewport is expressed in EPSG:4326 and the dataset is in EPSG:2056. This slice performs no reprojection, so a viewport in another CRS cannot be honoured (docs/05: mixing CRS without a declared transform is an error)`
- Reverted with `git checkout -- kernel/src/lib.rs`. Porcelain was then empty, and HEAD is 3777ad0.
- I applied the mutation by hand. This was not a `verify-mutation` run.
- This supplies the message text that the worker report says was not captured (`state/consults/2026-09-30-raw-path-refusal-code-worker-report-2.md:10`).

**Blocking**
None.

**Non-blocking**
- **N1.** The worker report (`state/consults/2026-09-30-raw-path-refusal-code-worker-report-2.md:14`) gives the §7 figure as 43 added lines. §7 (the form on main) counts insertions plus deletions, which is 44. The custodian's filing note on the same file (`:3`) already records 44. This is not class 8, because both figures are under 60. Any closing reference should carry 44.
- **N2.** Amendment 1 item 3 lists the evidence owed. For the record: the pair ran 12 times, T1's mutation was re-observed above at 3777ad0, and §7 was recounted at 44 over 2 files. The P0 observation at 4db0865 stands as gate 1 recorded it.

The worktree is clean at 3777ad0, and no scratch files remain. Main at `C:/dev/spatial-ide` was not touched.
