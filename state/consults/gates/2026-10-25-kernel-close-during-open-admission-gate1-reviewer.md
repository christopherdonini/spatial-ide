Reviewed: PR #258 at 7b437be350acb93f4c1210c948147f658e1cadf9 (base dd0b6113), gate 1, reviewer
Verdict: PASS WITH NOTES

Branch: cut/kernel-close-during-open-admission @ 7b437be350acb93f4c1210c948147f658e1cadf9

I found nothing under Correctness or Evidence. There is one Documentation finding to fix in the PR body before the merge, with no re-gate. There is also one observation on a record already filed on main, which needs no change to the PR.

## Correctness
None.

## Evidence
None. One observation: my whole-crate test and clippy runs did not recompile, because `D:/wt-targets/m4a` already held this worktree's build ("Finished ... in 0.49s" and "in 0.44s"). The test binary contains the new test, since `a_close_during_open_admission_...` ran and passed. Clippy's cached diagnostics are replayed for the same source. My M1 run did recompile `spatial-kernel` from the throwaway worktree ("Compiling spatial-kernel v0.0.0 (C:\dev\wt\kcdo-g1r\kernel)", 35.83 s).

## Documentation (must fix before the merge; no re-gate; the custodian's or worker's wording, not the human's)
D1. The PR body's Rule (00) line says "(checked by `git diff --name-only` at the form's commit)". The form's settlement records the check "at main fb361420". The form's commit is bb1c446c, whose parent is fb361420 (from `git log --format='%h %p %s' fb361420^..dd0b6113`). So the body names a different commit from the one the record names.
Replacement words: "**Rule (00):** no other open branch touches `kernel/src/skp.rs`, and nothing here touches `protocol/` (checked by `git diff --name-only origin/main...<branch>` for every open branch at main fb361420, as the form's settlement records)."
Clause check:
- "no other open branch touches kernel/src/skp.rs" and "nothing under protocol/": these are the settlement's words at fb361420. For this branch, `git diff --name-only dd0b6113...HEAD` gives only `kernel/src/skp.rs`, so nothing under `protocol/`.
- "at main fb361420": the settlement's commit, and the form commit's parent, per the log above.

Observation (record on main, outside this PR's diff; no PR change): the worker's report `state/consults/2026-10-25-kernel-close-during-open-admission-build-worker-report.md` says "Summed over the 47 result lines". My run of the same command at the same head printed 45 `test result` lines (and 45 Running/Doc-tests lines), with the same totals: 379 passed, 0 failed, 41 ignored. The PR body does not carry the 47. If the custodian wants the record corrected, that is an appended note, not an edit.

## Check 1: the diff
- `git diff --numstat dd0b6113...HEAD` exited 0 and printed `128	0	kernel/src/skp.rs`. That is one file, 128 of the 140 budgeted lines, with 0 deletions.
- `git diff --name-only` lists only `kernel/src/skp.rs`. The merge base with origin/main is dd0b6113.
- The module's bounds at the head: `#[cfg(test)]` at line 3414, `mod ticket_drop_under_lock_regression {` at 3415, and its closing `}` at 5162 (the file has 5162 lines).
- The one hunk, from `git diff -U0`, is `@@ -5033,0 +5034,128 @@`: insertions only, at lines 5034 to 5161. They come after the last existing test's closing brace at 5033 and before the module's `}`.
- Zero `-` lines, so no existing test changed.
- No product line changed; no lockfile or Cargo.toml change; no new `pub` item, hook, callback or `cfg(test)` branch in product code. The new items are private to the test module.
- Commits: bc7b0fbd adds the test (121 lines). 7b437be3 adds 7 doc-comment lines, the M1 record (`git diff bc7b0fbd 7b437be3`).

## Check 2: the test against the Change line and note 1
I read the base at dd0b6113: `open_dataset` (skp.rs:1100-1299), `close_dataset` (1554-1595), `mint_for_open` (574-593), `live_generation` (602-615), `forget_dataset` (827-837) and `Catalog` (lib.rs:218-254). Line numbers are the base tree's; the base is authoritative for the code.

- **The seam reaches the named window.** `open_cancellable` inserts the catalog entry (lib.rs:233). `resolves_unchanged()` is then called at skp.rs:1206 with the latch held. `SessionRef::mint()` and `mint_for_open` follow at 1244-1246.
- **No deadlock.** The inner `close_dataset` takes `watches`, the catalog, `generations` and `tickets`, never the latch. That follows the lock order documented at 1002-1006, and the first run completed.
- **Item 1.** `names.len()==1` holds because the catalog is fresh and the insert has happened. `live == Err(NotLive::NotOpen)` holds because there is no closing mark yet and no `live` entry yet, which proves the call comes before the mint. The inner close's catalog check at 1573 finds the entry, so the close returns `Ok`. `cancelled_streams == 0` because no ticket exists.
- **Item 2.** The Watching arm has no catalog or closing check before the mint, and `mint_for_open` has none either, so the open returns `Ok`. `name == names[0]` ties the closed name to the returned handle. M1 fails this item's expect.
- **Item 3.** The inner close's `catalog.remove` (1593) removed the entry.
- **Item 4.** `mint_for_open` inserts `(g, session)` after the close's `forget_dataset`, so `live_session == Some(open.session)`. `watches.insert` (1249-1258) adds the record after the close's removal at 1567-1571, which found none. The watch is held in the record, not yet dropped.
- **Item 5.** `describe` refuses on `catalog.get` (1303-1306). `viewport_query_resolve` refuses on `catalog.get` (1396-1399) before `require_live` or `tickets.mint`, so the ticket map is empty.
- **Item 6.** No `invalidate` ran, and `tx` is still held by the host, so the receiver reports `Empty`, not `Disconnected`.
- **Item 7.** The second close removes and drops the `OpenRecord` first (1567-1572), so the flag is set and `holds_a_record` is false. It then refuses at 1573 with `skp.unknown_dataset`. `forget_dataset` is never reached, so the generation stays live.
- **Determinism.** No sleep, spawned thread or timeout appears in the new lines; everything runs on the test thread.
- **The `Weak`.** The host owns `arm: Arc<dyn SourceWatchArm>` and `watches -> OpenRecord -> Box<dyn ArmedWatch>`, and both hold `CloseOnAdmissionArm`, which holds `std::sync::Weak<SkpHost>` from `Arc::new_cyclic`. So no strong cycle exists. `upgrade()` happens only after construction, inside `resolves_unchanged`, and the strong `Arc` drops when that function returns.
- **The doc comment's four statements are each true.** (a) "pins today's behaviour: a known gap the product cannot reach": `mint_hex_id` takes 16 bytes from `getrandom` (protocol/skp/src/v0/handles.rs:19-23). A `git grep "\.names()"` over kernel/src, frontends/shell/src-tauri/src, protocol and engine/src finds only test uses in skp.rs and a projection's `names()` in publish/mod.rs:526. (b) "M1 below is the fix shape". (c) "A fix flips this test, and it is then replaced under the fix's own form". (d) "It claims no property".
- **No assertion pins anything other than today's behaviour.** Items 5 and 6 hold trivially, because the refusals happen at the catalog lookup and nothing invalidates; their messages say no more than that. None can pass for a reason other than the one it names.
- The Change line's clauses each map to an assertion above.

## Check 3: tests and the mutation (shared holds, `CARGO_TARGET_DIR=D:/wt-targets/m4a`, `CARGO_BUILD_JOBS=8`, `RUST_TEST_THREADS=8`)
- **Module run** in C:/dev/wt/kcdo: `cargo test -p spatial-kernel --locked --lib ticket_drop_under_lock_regression` exited 0. Result: `test result: ok. 23 passed; 0 failed; 0 ignored; 0 measured; 140 filtered out`. The new test reported `... ok`.
- **Whole-crate run:** `cargo test -p spatial-kernel --locked` exited 0. Its 45 `test result` lines sum, by awk, to 379 passed, 0 failed, 41 ignored. The lib line is `ok. 163 passed; 0 failed`. There were no FAILED or panicked lines.
- **M1** in the throwaway worktree C:/dev/wt/kcdo-g1r (detached at 7b437be3). Its diff:
  ```
  +                if self.catalog.get(handle.as_str()).is_none() {
  +                    return Err(SkpError::unknown_dataset(handle.as_str()));
  +                }
  ```
  It sits after the "Step 3" comment, immediately before `let session = SessionRef::mint();` in the Watching arm.
  - `cargo test -p spatial-kernel --locked --lib a_close_during_open_admission_leaves_a_generation_for_a_name_the_catalog_no_longer_holds` exited 101.
  - It failed at `kernel\src\skp.rs:5138:27`, which is head line 5135 plus the 3 inserted lines, with `the open returns Ok although a close ran inside its admission: SkpError { code: "skp.unknown_dataset", ...`. That is item 2's expect on the open's result. Item 1's assertions passed before it.
  - Result line: `test result: FAILED. 0 passed; 1 failed; ... 162 filtered out`.
  - Reverted with `git checkout -- kernel/src/skp.rs` (exit 0); the porcelain was empty (0 bytes).
  - No `verify-mutation` run was used.
- **The `RECORDED MUTATION (M1)` doc lines** (skp.rs:5103-5108) name the mutation, the failing expect and `bc7b0fbd479f97d05a60f4f48578c9870fed639e`, a commit on the branch and HEAD's parent. My observation at the head matches them.

## Check 4: fmt and clippy
- `cargo fmt --all -- --check` exited 0 with empty output.
- `cargo clippy -p spatial-kernel --tests --locked` (shared hold) exited 0, with 39 `warning` lines. The only skp.rs location is `kernel\src\skp.rs:277:10`, in product code. There is no warning in lines 5034-5161.

## Check 5: verify scripts and CI
All four scripts ran in C:/dev/wt/kcdo:
- `node scripts/plan/verify.mjs --offline` exited 0: `verify:plan PASS`.
- `verify-cites.mjs` exited 0: `verify:cites PASS` (96 loose references advised).
- `verify-quotes.mjs` exited 0: `verify:quotes PASS — 131 checked, 100 verified, ...`.
- `verify-test-claims.mjs` exited 0: `verify:test-claims PASS — all 661 claimed test(s)`.

CI:
- The first `gh pr checks 258` exited 8, with one job pending (windows `cargo test --workspace`, run 40220795011).
- I waited on it with `gh run watch 40220795011 --exit-status` (exit 0); `gh run view` then gave `7b437be3... completed success`.
- The second `gh pr checks 258` exited 0 with 18 pass.
- Every run's headSha from `gh run view` is 7b437be350acb93f4c1210c948147f658e1cadf9:
  - push runs 40219616937, 40219616999, 40219616948, 40219616947, 40219617023;
  - pull_request runs 40220795011, 40220794948, 40220795047, 40220795124, 40220794951, 40220795007, 40220795054.

## Check 6: the PR body
- additions 128, deletions 0, head 7b437be3, draft, base main: all match.
- "128 of the declared 140 lines" matches. "the module's 23 tests" matches my module run. "379 passed, 0 failed" matches my run. "the four verify scripts pass" and "clippy reports nothing in the new lines" match.
- The M1 description matches my run.
- It states what main will carry under OPEN-1 (A): "a green test that asserts a state of the kind round 22, item 1 calls the defect ... in an interleaving the product cannot reach", as the settlement requires.
- The OPEN-1 cite (directive, item 1) resolves: item 1 reads "Filler entry 5, OPEN-1: (A)."
- One Rule (00) imprecision, D1 above.
- The form's Out-of-scope line names no §21a category as touched.

## Hold lines (this project's only)
- Module run: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:45328 ...`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:45328 affinity=FF (cores 0-7)`.
- Crate run: `MACHINE_HOLD shared ... shell=bash.exe:9120 ...`, then `MACHINE_RELEASED ... shell=bash.exe:9120 ...`.
- M1 run: `MACHINE_HOLD shared ... shell=bash.exe:18444 ...`, then `MACHINE_RELEASED ... shell=bash.exe:18444 ...`.
- Clippy run: `MACHINE_HOLD shared ... shell=bash.exe:11628 ...`, then `MACHINE_RELEASED ... shell=bash.exe:11628 ...`.
- All four were shared holds; no exit code from 96 to 99 occurred.

## End state
- The PR worktree's `git status --porcelain` is empty (0 bytes), and its HEAD is still 7b437be3.
- `git worktree remove C:/dev/wt/kcdo-g1r` exited 0 without `--force`. `git worktree list` shows 0 matches for kcdo-g1r, and the directory is gone.
- `tasklist` finds no cargo.exe and no rustc.exe running.
- I made no commit, push or PR action.

Scratch files (all in <the session scratch folder>/):
- kcdo-g1r-diff.txt
- kcdo-g1r-t1.txt
- kcdo-g1r-t2.txt
- kcdo-g1r-m1.diff
- kcdo-g1r-m1run.txt
- kcdo-g1r-clippy.txt
- kcdo-g1r-checks2.txt
