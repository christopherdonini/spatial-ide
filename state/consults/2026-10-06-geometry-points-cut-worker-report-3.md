*Custodian's filing note (2026-10-06): `geometry-points-cut`'s worker report 3, the class 9 pile-of-points walkthrough fixture (Amendment 3, item 7), by the worker (Sonnet 5.5, by its definition) on the custodian's brief. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is bf97e536764b463e04373e55782c52c05a608cca0af4b4cd845428407e156155. Write audit PASS: 6 Edits in the worktree `C:/dev/wt/points`, 2 Writes in the session's scratch folder, and no write in the main checkout (its porcelain unchanged) or under the user's Claude folder. Tool calls Bash 21, Read 5, Grep 3, Edit 6, Write 2, SubagentHandback 1. Run window from the transcript: 2026-10-06T22:21:58.975Z to 2026-10-06T22:41:40.254Z. The custodian checked: origin's branch head is 2e481e74, the worktree is clean, and §7's per-group count at that head is in Amendment 4.*

---

Report, tag node:geometry-points-cut@g4

**Commit** 2e481e743e48a73b402acdf51c02ade172cce0dc on cut/geometry-points-cut. It is pushed as an ordinary update (7620550a..2e481e74), and the worktree is clean and level with origin.

**Numstat of this commit:** 3/2 frontends/shell/MANUAL-WALKTHROUGH.md, 38/0 kernel/tests/manual_walkthrough_fixtures.rs.

**§7 count at my head** (the given command, d3fe6055..HEAD with the two excluded files): 2397 added, 263 deleted over all files. I did not have the form's group definitions, so the per-group split is not computed. The two files I touched are 60/0 (MANUAL-WALKTHROUGH.md) and 146/0 (manual_walkthrough_fixtures.rs) in that range, and 107 of those 146 lines were already on the branch.

**Fixture design:** `generate_the_point_pile_fixture` writes `point-pile.parquet`. It is LV95, declared `["Point"]`, with a covering, and holds 11 points: P-1's six, then five more at P-1's second point (index 1) plus (d·0.01 m, d·0.01 m) for d = 1 to 5. The pile spreads at most about 7 cm, and the extent stays P-1's own, 20.617 m × 9.877 m.
- **Spacing:** `averagePointSpacing` = sqrt(w·h/n) = sqrt(203.6/11) = 4.3025 m, taking pixels per metre as 2^zoom (the pixelsPerWorldUnitAtZoom convention).
- **Refusal start:** 4.3025 × 2^z < 9 below z = 1.065, which is 2.09 px per metre.
- **Pile overlap:** the pile's pixel spread is about 0.0707 × 2^z, which stays under the 8 px that overlaps two 4 px symbols up to z ≈ 6.8.
- **Spacing at the overlap zoom:**
  - z = 2: 17.2 px, pile spread 0.28 px.
  - z = 3: 34.4 px, spread 0.57 px.
  - z = 5: 137.7 px, spread 2.26 px.
  - Spacing stays at or above 9 px from z = 1.065 upward, so the pile overlaps across the whole non-refused range and no far-apart points were needed.
- **Helpers:** existing ones only (`point_p1`, `encode_point`, `GeometryMode::RowsWithBounds`). `engine/src/fixture.rs` is untouched and there is no new pub item.
- **Row P2 step (d):** it names `point-pile.parquet` with Zoom to layer and hovering the pile, and the "no pile available" fallback is kept only for a file that cannot be opened. The fixture table row (used by P2) and the Before-P1 generate command list it too. The blank verdict line is unchanged.
- **Ran once:** it wrote `C:\dev\wt\points\kernel\../target/fixtures/manual-walkthrough\point-pile.parquet` (11 features); I confirmed the file exists under the worktree's target.

**Checks, exit codes:**
- `cargo fmt --all --check`: 0.
- `cargo test --workspace --locked --features spatial-engine/fixture`: 0, 885 passed, 0 failed, 50 ignored (summed from the 98 "test result" lines).
- `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`: 0. The warnings are all in other lines and files, and none is in manual_walkthrough_fixtures.rs.
- `verify-cites.mjs`: 0. `verify-test-claims.mjs`: 0. `verify.mjs`: 0.
- `verify-quotes.mjs` with no arguments: PASS (121 checked, 0 errors).
- `verify-quotes.mjs --show-cites` scoped to the two files: exit 1. That is existing: 29 not-found quotes in MANUAL-WALKTHROUGH.md at other lines, none on a line I changed. My stash-based baseline run on that file alone also exited 1, and I did not pin the exact count at the base.

**Heavy commands, all under a shared hold** (cores 0-7, CARGO_BUILD_JOBS=8, RUST_TEST_THREADS=8):
- The generator build and run (hold granted, 16 s).
- The workspace test (hold granted, ran in the background past 590 s). Its Bash line piped cargo into grep inside the held call, so it departed from the one-command shape. The rc it returned was grep's, but the 885/0 figure was read from the output.
- Clippy (hold granted).

fmt and the verify scripts are light and ran unheld.

**Noticed, not done:**
- The scratch folder is shared and already held many files. I wrote `gen.rs` and `sp.mjs` there, and I cannot tell whether those two names already existed, so they may have overwritten earlier files. My commit message is `pile-commit-msg.txt`.
- I made a stray `/tmp/a` once and removed it.
- The Read/Edit tools needed a prior Read of the walkthrough file.

**Model:** Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it, no override, no handoff received or produced.

**Pre-gate self-check:**
- Cross-module use: none, only the existing fixture helpers.
- Completion claims: each rests on the figures and exit codes above.
- User-facing text: the row text describes what the file holds, and the computed figures match the formula read at `pickResolution.ts` lines 137-163.
- Required tests reaching their assertion: not applicable, because the generator carries no test and the count stays 885.
