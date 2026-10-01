*Custodian's filing note (2026-10-01): the reviewer's gate 1 on PR #151, for PLAN node `catalog-open-replace-drop-latency-note` at g1 (note only), full gating. Reviewed: cut/catalog-replace-note @ 53e1cf453cb0ca90423844edb17fd9e0c01efe98 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 06:12:54Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 53e1cf4. Its T1/T2 run at the base and its mutation table at 53e1cf4 are the observations of record; its greps at 53e1cf4 are H1 and I5 of record; its rustfmt counts over stdin (lib.rs 16 at both commits) replace the worker's false zero. Its N3 is the architect's B2, taken in correction round 1. Profile paths redacted at filing: none.*

---

Reviewed: cut/catalog-replace-note @ 53e1cf453cb0ca90423844edb17fd9e0c01efe98

**Verdict: PASS.** No blocking issues. Three non-blocking items follow. One CI run (the pull_request run) was still in progress when I read the checks.

## Checks

**1. Full diff (`git diff d8544a0...53e1cf4`).**
- Only two files change: `kernel/src/lib.rs` (+18/−3) and `kernel/tests/catalog_replace.rs` (+109/−0).
- Nothing changes under engine/, protocol/, frontends/, docs/, state/, PLAN.yaml or the form.
- In lib.rs, every changed line is a `///` doc line. A grep for `+`/`-` lines that are not `///` lines found 0 (rc=1).
- The new doc text matches the code at 53e1cf4:
  - `insert`'s returned `Arc` is a temporary of the guarded statement at `kernel/src/lib.rs:178` and `:202`. It drops at the end of the statement, before the guard, and only on the Ok path because the `?` returns first.
  - The only other holder of the pool's `Arc` is `Lease` (`engine/src/pool.rs:416`, `:501`). So the note's condition (last reference and no lease in flight) is exact.
  - The bind-then-drop fix shape matches `close_dataset`'s `removed_watch` in `kernel/src/skp.rs`, inside the function that starts at `:1438`.
  - `remove`'s new sentence matches `Lease`, which holds both `physical` and `pool` (`engine/src/pool.rs:499-505`), and the test it names exists at `engine/tests/connection_reuse.rs:439`.
  - The new sentence equals §2 item 2's text byte for byte, minus its final period (N2).
- The note contains no number or duration word.

**2. §6 greps at 53e1cf4.**
- H1 (callers): the `Catalog` receivers are only `kernel/src/main.rs:105` (a fresh catalog, opened once), `kernel/src/skp.rs:1099` (a freshly minted handle) and `kernel/src/skp.rs:2964` (test module). The other hits are OpenOptions/File calls at `state.rs:37`, `audit/log.rs:147,218` and `skp.rs:2721`. Nothing under protocol. H1 holds; I1 does not fire.
- I5 (holders): `engine/src` has no hit. The hits are:
  - `publish.rs:160,373,452,479,1357`: pending-attempt fields and parameters, plus a test fixture.
  - `lib.rs`: the catalog map, its guards, the doc and the fn signatures.
  - `skp.rs:1263`: a call-local return value, passed on as `&Dataset`.
  - `SKP-V0.md:131`: prose already routed to `kernel-close-races-followups`.
  - `pool_poll.rs:13`: a comment.
  
  No stream holds an `Arc<Dataset>`. I5 does not fire.

**3. T1 and T2 at base d8544a0.**
- Both names match the form's §4 byte for byte (one hit each in the form, one `fn` each in the test file).
- I ran them in a scratch worktree at d8544a0 with the 53e1cf4 test file copied in: 2 passed, rc=0. No I2.
- The scratch worktree is removed and pruned.

**4. Mutations, the observations of record (applied at 53e1cf4, reverted, porcelain empty after each):**

| Mutation | Change | Result |
|---|---|---|
| M1 | `kernel/src/lib.rs:178` `insert(name.into(), Arc::new(ds))` → `entry(name.into()).or_insert(Arc::new(ds))` | T1 FAILED at `kernel/tests/catalog_replace.rs:62` with ``assertion `left == right` failed: get(N)'s path is B`` (left …t1-a.parquet, right …t1-b.parquet). T2 ok. |
| M2 | the same change at `kernel/src/lib.rs:202` (`open_cancellable`) | T2 FAILED at `kernel/tests/catalog_replace.rs:102` with the same assertion message (left …t2-a, right …t2-b). T1 ok. |

The test docs record the worker's observations at c3e8e54, naming the commit. Under §8 item 14 (merge, not squash) that commit stays reachable.

**5. Suites.**
- `cargo test -p spatial-kernel`: rc=0. Lib 135 passed; catalog_replace 2 passed; every integration binary ok, none failed. The declared-unchanged kernel tests pass.
- `cargo clippy -p spatial-kernel --tests`: rc=0.
  - Nothing in catalog_replace.rs.
  - The two lib.rs sites (`:368`, `:438`, a very complex type) already exist at base `:353`/`:423`.
- rustfmt `--check --edition 2021` on stdin:
  - new file: 0 hunks.
  - lib.rs: 16 at d8544a0 and 16 at 53e1cf4, the same hunks shifted by +12/+15 lines, with none in the new doc lines. No new hunk.
- From C:/dev/spatial-ide (main at 84dd58e):

| Check | Tool commit | rc | Result |
|---|---|---|---|
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` | — | 0 | 353/353 pass |
| verify-cites | 522e448 | 0 | PASS, 32 advisory |
| verify-quotes | f9444a4 | 0 | PASS, 113 checked |
| verify-test-claims | 57c626f | 0 | PASS, 418 claims |
| verify.mjs | 2607202 | 0 | verify:plan PASS |
| verify-mutation `--base d8544a0 --head 53e1cf4`, run in the worktree | 7d24ed1, the same on main | 0 | PASS, ok at `catalog_replace.rs:42` and `:77` |

This verify-mutation run checks that a mutation is recorded. It is not an observation of a mutation.

**6. Budget and block-on-sight items.**
- §7: the form's command gives 18+3 and 109+0, so 130 changed lines over 2 files against a ceiling of 120.
  - The overrun is recorded as class 8 in §10 Amendment 1, on main.
  - `git diff d8544a0 84dd58e` on the form shows only appended lines, so §7 is not edited.
  - 130 is within `AUTONOMY.md:350` (≤150).
- §8 item 6: a scan of the test file for `sleep|recv_timeout|spawn|timeout|Duration|Instant|loop|until\(` found nothing (rc=1). The same pattern self-tests positive on `engine/tests/connection_reuse.rs` (17 hits).
- §8 item 10: `catalog-replace-t{1,2}-{a,b}.parquet` occur only in `kernel/tests/catalog_replace.rs:44,45,79,80`.
- All four commits carry a sign-off.

**7. `gh pr checks 151`.**
- Run 36820675307 (push, 53e1cf4), "cargo test --workspace (windows-latest)": pass in 19m39s.
- Run 36822384061 (pull_request, 53e1cf4), the same job: pending.
- Tauri NSIS, shell typecheck/vitest/cargo and the sign-off check: pass on both events.
- No governance job ran on this branch, which touches kernel files only.

## Blocking
None.

## Non-blocking
- **N1. The worker's report on main makes two false tool claims** (`state/consults/2026-10-01-catalog-replace-note-worker-report-1.md`):
  - It reports lib.rs at "0 hunks at d8544a0 and 0 at head (checked as git-show copies)". A file copy of lib.rs fails to resolve `mod bundle`, so rustfmt prints no `Diff in` lines; I reproduced that false zero. Over stdin the count is 16 at both commits.
  - It says no clippy warning mentions lib.rs. Two pre-existing ones do.
  
  Neither changes the outcome: no new hunk, no new warning. Under the record cap this is a ledger note, not a correction round.
- **N2. The replacement sentence drops the form's final period** in `kernel/src/lib.rs:210-216`, to keep the existing ` — nothing here…` continuation. Every other byte matches §2 item 2. This is the faithful splice, since the replaced span ended without a period. Record it if §2 is read strictly.
- **N3. "Otherwise the last holder drops it on its own thread" has an ambiguous "it"** (`kernel/src/lib.rs:167-168`).
  - Read as the pool, the sentence is true in both cases.
  - Read as the dataset, it is false in the lease case: there the `Dataset` itself still drops under the guard, and only the pool goes to the producer thread (form §0, the lease bullet).
  
  A later edit could say "drops the pool" or name both holders. Not owed here.

## Files
- C:/dev/wt/catalog-replace-note/kernel/src/lib.rs
- C:/dev/wt/catalog-replace-note/kernel/tests/catalog_replace.rs
- C:/dev/spatial-ide/kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-01-catalog-replace-note-worker-report-1.md

The worktree is clean (empty porcelain) and the scratch worktree is removed and pruned. Main is untouched.
