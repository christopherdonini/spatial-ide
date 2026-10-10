*Custodian's filing note (2026-10-10): `e2e-stale-expectations-reaim`'s worker report 3, the worker-high run 19:18:47Z to 20:46:45Z by its transcript, under the form's Amendment 3: T2 re-run with the base f0fccfaf against H ef1cc519c913a2bbc5d28a86530c579fae0f3ed6, both halves, and M13. Nothing was committed; the branch is unchanged. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 90dafff9858b3447373bd3ed04a3a86ecd1084c7aa76cbe49714fd2a0dcb4c40. The base run's one failing test is a shared-run failure the custodian re-runs alone; it is not recorded as a failure.*

---

# Report: e2e-stale-expectations-reaim, third run (T2 re-run at the f0fccfaf base, and M13)

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. I read the worker definition, the form's item 6, item 12 and Amendment 3, the ruling (lines 6 to 12) and worker report 2 first. The form and the brief did not conflict anywhere.

**Headline**
- **T2, workspace: equal.** Output: `keys base=359 H=359; lines base=465 H=465; differences=0`.
- **T2, src-tauri: equal.** Output: `keys base=20 H=20; lines base=23 H=23; differences=0`.
- **I6′ did not fire.**
- **M13 failed as predicted.** The edited generator wrote `acb02874815803c515c792419ce1fc2f4b1b110518a217c305702b87f7a9d697`, against T1's base line `cc0a841a3996ff8f378d378af445fbc2651e26812bf66cb1cd31c5a891933dc1`.
- **One shared-run failure to re-run alone:** the base workspace run had one failing test, a failure that may depend on timing (details under T2, workspace). It is not recorded as a failure.

## 1. Patches and worktrees
- `hashlog.patch` sha256 is 21842089695a2e00e54492a8cea58c232a4e3412bb0cd6576b6c6099ce12a40f. This matches the brief.
- `m13.patch` sha256 is 570fa5eeaea53225c45fc818018df48274054ea29e2380ce90f3cae942209e31. This matches the brief.
- Base worktree: I ran `git worktree add --detach C:/dev/wt/reaim-base f0fccfaf6814c6993462853211ba20f7c8cdab31`. HEAD was f0fccfaf6814c6993462853211ba20f7c8cdab31, with a clean status.
- Preconditions:
  - `git diff --quiet cf2434e6 ef1cc519 -- engine/src/fixture.rs kernel/tests/manual_walkthrough_fixtures.rs` returned rc 0.
  - `git diff --quiet b8ad22ff f0fccfaf -- engine/src/fixture.rs` returned rc 0.
- `hashlog.patch` applied with `git apply` (rc 0) in both worktrees. `git diff --stat` in each showed only `engine/src/fixture.rs | 49 +++-` (48 insertions, 1 deletion). `git status --porcelain` was ` M engine/src/fixture.rs` in each.
- I reverted it in both with `git apply -R` (rc 0):
  - Base: `git status --porcelain` empty, `git diff` 0 bytes, HEAD f0fccfaf6814c6993462853211ba20f7c8cdab31.
  - H: `git status --porcelain` empty, `git diff` 0 bytes, HEAD ef1cc519c913a2bbc5d28a86530c579fae0f3ed6.
- The permission system refused nothing, so I7′ did not fire.

## 2. T2, workspace
Command: `cargo test --workspace --locked --no-fail-fast`, phase `t2` of `itm6.sh`. It differs from CI's command by `--no-fail-fast`, as in the previous run.

| Run | Passed | Failed | Ignored | Exit code |
|---|---|---|---|---|
| Base, tag `f0`, target `D:/wt-targets/reaim-base` | 926 | 1 | 55 | 101 |
| H, tag `h3`, target `D:/wt-targets/k6` | 927 | 0 | 57 | 0 |

`node cmp.mjs out/f0-hl-t2 out/h3-hl-t2` printed one line and exited 0: `keys base=359 H=359; lines base=465 H=465; differences=0`. Each hash-log folder has 61 files. The 11 keys that differed at b8ad22ff are therefore equal at f0fccfaf.

**The base failure, which may depend on timing**
- The failing test is `spatial-engine --test filter_type_admission`, test `the_type_walk_agrees_with_the_binder_over_the_p0_matrix`.
- Its panic is at `engine\tests\filter_type_admission.rs:1355:5`: `2117 B-T1 counterexample(s)`.
- Its first lines read, for example: `B-T1: 4564 admitted, 5164 refused, 2117 failures` and `cmp = u32 col:TINYINT: admitted, but the stream ended in error: refused: the source file changed while it was open ({mtime}). ...`.
- It is a source-file-changed (mtime) refusal in a shared run. The same test passed at the b8ad22ff base in the previous run (`base-t2.log`) and at H in this run and the last.
- `git log b8ad22ff..f0fccfaf -- engine/src engine/tests/filter_type_admission.rs` lists nothing.
- I have not recorded it as a failure. Please re-run `cargo test -p spatial-engine --test filter_type_admission --locked` alone at f0fccfaf. I removed that worktree, so a re-run needs a fresh one.
- Its hash-log keys were compared with the rest and are equal.

## 3. T2, src-tauri
- The `npm` phase was `npm ci && npm run build` in `renderer/bundle-viewer`, then in `frontends/shell`. It returned rc 0 at the base and rc 0 at H. Both builds printed Vite's chunk-size warning and `built in 5.13s` (base) and `4.81s` (H).
- `tauri` phase: `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked --no-fail-fast`.

| Run | Passed | Failed | Ignored | Exit code |
|---|---|---|---|---|
| Base, tag `f0` | 68 | 0 | 0 | 0 |
| H, tag `h3` | 68 | 0 | 0 | 0 |

- The suite does write fixtures through `fixture.rs`. Each `*-hl-tauri` folder has 1 file and 23 lines, 20 keys.
- `cmp.mjs` over the two folders printed `keys base=20 H=20; lines base=23 H=23; differences=0`, and exited 0. That is equal key sets and equal multisets.

## 4. M13 at H
- I applied `m13.patch` with `git apply` (rc 0). `git diff --stat` showed `engine/src/fixture.rs | 2 +-`. The edit changes `IdentityMode::DuplicateIds => ids.append_value(7),` to `IdentityMode::DuplicateIds => ids.append_value(8),`.
- I removed `target/fixtures/manual-walkthrough/dupkey-refused.parquet` (one file, not recursive). Its sha256 before removal was cc0a84…, equal to both `base-t1.sha` and `h-t1.sha`.
- I ran `cargo test -p spatial-kernel --test manual_walkthrough_fixtures --locked -- --ignored --nocapture generate_the_dupkey_refusing_fixture` through a small script in the scratchpad, in a shared hold. The result was rc 0, 1 passed.
- **Observed sha256:** `acb02874815803c515c792419ce1fc2f4b1b110518a217c305702b87f7a9d697`.
- **Base line** in `reaim2/out/base-t1.sha`: `cc0a841a3996ff8f378d378af445fbc2651e26812bf66cb1cd31c5a891933dc1 *dupkey-refused.parquet`.
- The hashes differ, as predicted. By the form's rule this is the failure `fixture byte-identity: T1: dupkey-refused.parquet`. M13 was observed by applying it and comparing the hash; I ran no `verify-mutation`.
- I reverted with `git apply -R` (rc 0). `git status --porcelain` was empty, `git diff` was 0 bytes, and HEAD was ef1cc519c913a2bbc5d28a86530c579fae0f3ed6.
- **Restore:** I removed the M13 file, then ran the same generator at the clean H in a shared hold (rc 0, 1 passed). The sha256 is `cc0a841a3996ff8f378d378af445fbc2651e26812bf66cb1cd31c5a891933dc1`. That equals `reaim2/out/h-t1.sha`'s line for the file, and also `base-t1.sha`'s.

## 5. Heavy commands
Every command ran in its own shared hold on `-Project SpatialIDE`. None returned an exit code from 96 to 99.

| # | Command | Exit code |
|---|---|---|
| 1 | Base T2 workspace | 101 (one test failed; hash logs written) |
| 2 | H T2 workspace | 0 |
| 3 | Base `npm` | 0 |
| 4 | Base `tauri` | 0 |
| 5 | H `npm` | 0 |
| 6 | H `tauri` | 0 |
| 7 | M13 generator | 0 |
| 8 | Restore generator | 0 |

## 6. Section 8, items 1 to 18
1. No product path was edited, apart from the temporary `fixture.rs` patches, which were reverted. Nothing was committed.
2. No arm was set or pinned.
3. No fixed sleep or frame count was used as a wait.
4. Not applicable. No GROUP′ code was touched.
5. No result log or dated README record was edited.
6. No recursive delete was made by me, and I touched no junction.
   - A scan of the base worktree for reparse points found none before `git worktree remove`.
   - My only manual deletes were the two single-file `rm` calls on `dupkey-refused.parquet`.
7. Not applicable. I ran no source-changed suite.
8. KNOWN-LIMITATIONS was not touched.
9. No mutation was committed or pushed. M13 is reverted and the worktree clean.
10. No refusal-message constant was written.
11. The one timing-dependent failure (the `filter_type_admission` test, section 2) was reported and not recorded as a failure.
12. No invalidator fired, so none was worked around.
13. No new dependency.
14. Both patches were applied only in `C:/dev/wt/reaim-base` and `C:/dev/wt/reaim`. Neither was committed, pushed or left in place, and neither was applied anywhere else.
15. I ran no GROUP′ solo run.
16. Not applicable. I did not touch step 6 (c).
17. Nothing was written under `target/fixtures/compat-corpus`, and I did not run `admission_p4_corpus`.
18. Not applicable. I wrote no GROUP′ code.

## 7. Differences from the form and the brief
- T2 runs used `--no-fail-fast`, as in the previous run. This is the same deviation, not new.
- The brief names the one-line hold shape. I ran the long commands through `itm6.sh` and a small `m13run.sh` in the scratchpad, as the brief ordered for `itm6.sh`. Neither is in the main checkout.
- The previous run's `D:/wt-targets/reaim-base` target folder already existed. I reused it; cargo rebuilt the changed crates.
- Before M13's file was regenerated at the clean H, I removed it a second time (single file) so the restore was a fresh write.
- Nothing was written to the main checkout's `target/fixtures`. Main's own status shows only the two untracked files it had at the start.

## 8. Final state
- H: `C:/dev/wt/reaim`, branch `cut/e2e-stale-expectations-reaim`, HEAD `ef1cc519c913a2bbc5d28a86530c579fae0f3ed6`, equal to origin's branch. `git status --porcelain` is empty. H's `target/fixtures/manual-walkthrough/dupkey-refused.parquet` is restored to cc0a84….
- The base worktree `C:/dev/wt/reaim-base` is gone. I removed it with `git worktree remove` (rc 0), after showing it clean at HEAD f0fccfaf. It no longer appears in `git worktree list`.
- C: has 38 GB free at the end (37 and 36 GB mid-run). It never went below the 35 GB floor.
- New logs and hash logs are in the reaim2 folder under `out/`: `f0-t2.log`, `h3-t2.log`, `f0-npm.log`, `h3-npm.log`, `f0-tauri.log`, `h3-tauri.log`, `f0-hl-t2`, `h3-hl-t2`, `f0-hl-tauri`, `h3-hl-tauri`. The previous `base-*` and `h-*` files are untouched. The M13 logs `m13-run.log` and `m13-restore.log` are in the scratchpad folder, one level above the reaim2 folder.
- Item 7's solo runs are not done. I ran no e2e suite and never started the app.
