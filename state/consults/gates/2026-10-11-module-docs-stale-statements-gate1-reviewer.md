# PR #209 gate 1 — reviewer
Reviewed: cut/module-docs-stale-statements @ 117d8d5c2b102f6dea1c2fe5eb01832a44148604

**Verdict: FAIL, on one Correctness finding (C-1).** One unpinned sentence makes a guarantee that the code does not support: the stream path "writes nothing". It appears at three sites. All the other rewritten sentences hold against their pins at B. Evidence E1, E3, E5, E7, E8 and E9 hold on my own reruns. There are four Documentation findings, which must be fixed before the merge.

The verdict follows `state/directives/2026-10-05-product-first-direction.md:15 @ 31f77bf5c7500f5379c8f7261ad5106d898d81ee sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`. The class comes from the form's §9 `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:448 @ 31f77bf5c7500f5379c8f7261ad5106d898d81ee sha256:5539ac39876dcb83ee252fab4dab95582dcf41afa2fd31c120a37c7386593ed7` and its §5 invalidator `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:394 @ 31f77bf5c7500f5379c8f7261ad5106d898d81ee sha256:24fbe46bee9ba5007eaa99ad3682d278cd290f4aed7d1b0bf482215694752069`.

## Correctness

**C-1. "The stream path writes nothing" has no pin, and the code does not support it.**
- **Where the claim sits:**
  - `engine/README.md:93 @ 117d8d5c2b102f6dea1c2fe5eb01832a44148604 sha256:215717bbb63e4ececab143739cf8c6660b3ae7dba3202bc9ba6c78adeb4393ef`
  - `engine/src/lib.rs:53-54 @ 117d8d5c2b102f6dea1c2fe5eb01832a44148604 sha256:7bd1d1e01af4e5c61dd7f5249fbf4bbc0574f86f213d4fdf04539d87f35d714e`
  - `kernel/src/lib.rs:38-39 @ 117d8d5c2b102f6dea1c2fe5eb01832a44148604 sha256:956b7562806d38052c8ffbdf74c3cfb10ab721a1fd9cf0a443389dadbd395524`, which reads "A stream still writes nothing."
- **The form does not pin it.** Row D4's Says asks for the sentence (`kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:93 @ 31f77bf5c7500f5379c8f7261ad5106d898d81ee sha256:265ae3dcd833d43d841b01f6003805383160c1df076a570484668cfa9a0afa98`), but no Facts entry supports it. The worker disclosed this as deviation 5.
- **The code leaves a write path open:**
  - Every engine connection is an in-memory DuckDB connection (`engine/src/pool.rs:432`).
  - It is configured only by `engine/src/pool.rs:185-187 @ 31f77bf5c7500f5379c8f7261ad5106d898d81ee sha256:85ddecd14bba31865609e78ad6d68623024fe29092adc44e590c9801a1b3127a`, which sets three extension and geoparquet settings. It sets no `temp_directory` and no `memory_limit`.
  - The publish stream issues a whole-result sort: `engine/src/stream.rs:1474 @ 31f77bf5c7500f5379c8f7261ad5106d898d81ee sha256:422015e6cd78da6f4862d8f0e3dd605890858af95c3d09a40bab4a1073519bd2` (`ORDER BY {source_column} ASC`).
- **DuckDB's default spills to disk.** The bundled DuckDB is libduckdb-sys 1.10505.0, read from `duckdb.tar.gz` in the cargo registry; these files are not in the repo.
  - `src/include/duckdb/main/config.hpp:112-115` (sha256 dd10a05953f20b36fc2b381f8165c29ee2e28dfe0dbdf3e47e23760c41c5dded) declares `bool use_temporary_directory = true;` with the doc comment "store intermediates that do not fit in memory".
  - `src/main/config.cpp:551-559` (sha256 5820d6cb0966d540b1c03f7d748a5b62e4c2394d2764715c8dac725916e4e78b) sets `temporary_directory = ".tmp"` for an in-memory database.
  - `src/main/database.cpp:465-466` applies that default when the caller set no directory.
- **Consequence.** A stream whose sort exceeds DuckDB's memory limit can write spill files to `.tmp` under the process's working directory. The absolute "writes nothing" is therefore an unsupported guarantee.
- **Not a regression.** The same claim stood at B, in the form's D4 pin `engine/src/lib.rs:47-50` and in kernel `lib.rs:36`. This piece restates it in three rewritten lines, and §1 lets a rewritten sentence claim only what its pin shows.
- **Fix, with no code change:**
  - Reduce the claim at all three sites to what the code shows. For example: the engine's own code opens no file for writing on the stream path, and DuckDB's default spill of intermediates (`.tmp`, in-memory default) is not configured off.
  - Or drop the sentence.
  - Disabling the spill would be a code change, which is §5's other invalidator, so it does not belong in this piece.

## Evidence

No Evidence finding.
- **E1:** my recount gives 178 `//` lines plus the fn pair.
- **E3:** passed (Check 7).
- **E5:** passed (Check 4).
- **E7:** passed (Check 5).
- **E8:** holds read as content identity. The lines are the B lines named in §0, and they have moved; see Check 6.
- **E9:** green (Check 10).
- **E2 and E4** were not re-run, as the brief directs. Nothing in Checks 2 or 3 gives a reason to doubt the worker's numbers.

## Documentation (must be fixed before the merge; no re-gate)

**D-1. The scope of "Only" in the attribute paragraph.**
- The text: `engine/README.md:390-392 @ 117d8d5c2b102f6dea1c2fe5eb01832a44148604 sha256:89b65ed625575f28a02b73861f4d2ad13269f8bd5e26a4c6323dc915439a6b99`, "Only publish preflight refuses `Float32` and dictionaries".
- It is true for the projection, which is the paragraph's subject. Engine-wide it is not: the filter namespace also refuses a dictionary column by name (`engine/src/predicate.rs:1224 @ 31f77bf5c7500f5379c8f7261ad5106d898d81ee sha256:d78a3ca66e7322bb1f56dcc61231ea7ee0817dbdffd0c2d0df784d4d9aff450a`).
- I class this D because its context bounds the sentence. The fix is to scope it, for example "Of a projection's columns, only publish preflight refuses …".

**D-2. The appended note in PERMISSION-BOUNDARY.md points to a section that does not exist.**
- The text: `kernel/PERMISSION-BOUNDARY.md:496-497 @ 117d8d5c2b102f6dea1c2fe5eb01832a44148604 sha256:ab9316a052b5c73cbda67886f8672ce3ced3635f5bfa37f11d121b265390322c` names "`kernel/README.md`'s permission-boundary section, first bullet".
- kernel/README.md has no such heading. The C8 bullet is the first bullet of the section headed "Publishing, and the trigger this file named in advance" (line 240 at H).
- Name that heading. The note is this branch's own unmerged append, so editing it still satisfies E7 against B.

**D-3. The E1 tally in the PR body is off by two.**
- The PR body and worker report say "180 changed `.rs` lines are `//` lines" plus the fn line.
- The script gives 180 changed `.rs` lines in total: 178 `//` lines and 2 non-comment lines (the fn pair).
- The prediction (`kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:376 @ 31f77bf5c7500f5379c8f7261ad5106d898d81ee sha256:4706802867a67ab430419184bfd238c8e3d25648f1b6c95476bee956e5e0bee0`) holds. Only the count needs correcting in the PR body.

**D-4. §2.4's two owner's-index lines are not in the head.**
- The PR body says they land later.
- Their commit needs a scoped check before the merge, against engine/README.md's index allowance (at most 2 of 142) and kernel/README.md's ceiling of 24, which has 10 lines left.

**For the architect gate (not a finding at this head):** row DX's Says asks for the sentence that SKP, MCP, plugin, notebook and AI exposure each still need their own review. That contradicts §8 item 7 and the §5 invalidator, because C8 does not carry the sentence. The head's text at all three sites matches C8, so nothing at the head is false or beyond C8. Restoring the sentence (ADR-017:1140-1141 would pin it) is the architect's red-line ruling.

## Checks

1. **Diff, budget and ceilings.**
   - Command: `git diff --numstat origin/main...origin/cut/module-docs-stale-statements`, rc 0. Totals: 200 insertions and 114 deletions, 314 lines in 16 files, against the OPEN-2 (b) ceilings of 450 lines and 18 files.
   - Per file, against §7 with the OPEN-2 additions:

     | File | Lines | Ceiling |
     |---|---|---|
     | engine/README.md | 96 | 142 |
     | engine/src/lib.rs | 43 | 54 |
     | engine/src/identity.rs | 12 | 14 |
     | engine/src/crs.rs | 19 | 24 |
     | engine/src/geoparquet.rs | 30 | 36 |
     | engine/src/dataset.rs | 6 | 6 |
     | engine/src/envelope.rs | 6 | 8 |
     | engine/src/predicate.rs | 8 | 10 |
     | kernel/README.md | 14 | 24 |
     | kernel/src/lib.rs | 27 | 42 |
     | kernel/src/bundle/mod.rs | 2 | 4 |
     | kernel/CANCELLATION-AND-TRACING.md | 14/0 (insertions only) | 16 |
     | kernel/src/publish/mod.rs | 14 | 30 |
     | kernel/src/permission/mod.rs | 9 | 14 |
     | kernel/src/permission/boundary.rs | 4 | 8 |
     | kernel/PERMISSION-BOUNDARY.md | 10/0 (insertions only) | 12 |

   - No overrun. Every path is in §7. `kernel/src/skp.rs` is untouched. `engine/src/identity.rs:251-254` hashes to 568ebc196f96189f89e427dd1a4f9f27cb6d2e8b6b7bcb4ca3c1974069a90d55 at both B and H, the same as the form's pin.
   - The form's 144 backticked pins, recomputed at B by script (rc 0): 143 match. The one difference is `PLAN.yaml:3805-3821`, as expected.
   - Amendment 1's ruling pin, state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:14 @ d8f2b800, resolves: sha256 0ab595d8…eab2f matches, and d8f2b800 is an ancestor of B.
   - The form at B is byte-identical to main's copy (sha256 2c3422d1…cd78a). Amendment 1 is in B, so it precedes the first code commit 8305d4ed. B contains the merges of #205 (3a3876a3) and #206 (4c6680e7).

2. **Every rewritten sentence against its pin at B.**
   - **D3 holds.** Checked against end_to_end.rs:380-482: the cancelled terminal; `observed_at >= sent_at`; `batches_after_cancel() <= 1`; the 5 s bound; `c.batches == 0` in the early case; the REPORT prints that are never asserted; the line-385 comment.
   - **D4 holds**, except C-1. Checked against lod.rs:9-14, :151, :992-1011, :1152, :1235-1237 and :1397-1399, skp.rs:2185-2189, PLAN.yaml:850 and area-d:130. The only non-engine caller of `build_tiers` is test code: skp.rs:2671, under `#[cfg(test)]` from :2314, and kernel/tests.
   - **D1 holds.** Checked against:
     - geoparquet.rs:16-23, :37 and :444-450;
     - crs.rs:286-288;
     - dataset.rs:398-426 and :1332-1351;
     - SanityLevel's Metadata (bbox or covering statistics) and Sample;
     - the wire codes at skp.rs:2046, :2069 and :2078;
     - ADR-015:3 and Amendment 1 items 1-5 and 7.
     The seven named tests exist.
   - **D2 holds.** Checked against dataset.rs:1730-1756, :1744-1750 and :319-327, identity.rs:42-55, and ADR-016:3 and Amendment 1 items 1 and 6.
   - **D5 holds, with D-1.** Checked against attributes.rs:78-101 and :45-48, and publish/mod.rs:414-447.
   - **D6 holds.** Checked against lib.rs:17-28, stream.rs:991-999, ADR-034:3 (Accepted) and ADR-023:3 (Proposed, binds nothing).
   - **D7 holds.** Checked against index.rs:4-5 and README:104-108 and :176-179. Both anchors match the headings at H (lines 125 and 197). `pub mod index` is at lib.rs:100.
   - **D8 holds.** I checked every site's status word against ADR-013:3, :248-251, :257-258, :265 and :318-322, ADR-015:155, ADR-016:180 and ADR-017:3. On the block-on-sight moves:
     - 433413a is on main (rc 0).
     - ADR-013 draft BoS 8 moved to Amendment 1 item 2, which carries the identifier ban.
     - ADR-016 draft BoS 5 moved to item 1 ("verified against the corpus, never assumed").
     - ADR-013 draft BoS 2 and ADR-015 draft BoS 5 (the only-site rule) are named as history, correctly: the accepted text does not carry them.
     - identity.rs:50 "A2" is ADMISSION-PREREGISTRATION.md:211's A2. Leaving it is correct.
     - The lod.rs subset clause is dropped, as the form directs.
   - **D9 holds.** Checked against ADR-017:1044-1048, ADR-018:3 and docs/08:8. ADR-018's words are used only in its own sense.
   - **D10 holds.** The preflight order (row-filter, degrees, encoding, name, licenses, projection with bundle restriction, style, ceilings, then the pin) and the run order (destination, staging, rehash, stream, style, viewer, manifest, heuristic, sidecar, finalize) match publish/mod.rs:449-611 and run_inner at B.
   - **DX holds**, with D-2. Checked against commands.rs:265 and :402, publish.rs:831, ADR-017:1134-1142, skp.rs:1174-1176, README:16-19 and :237-241, and audit/log.rs:82, :85 and :133-149. 8 MiB × 5 ≈ 40 MiB. Apart from the bundle and the audit log, the kernel's only write calls are in test code.
   - **DE5 holds.** The assertion is unchanged.
   - **DK holds.** Checked against README:3-12 and skp.rs:170-176; the qualifier is not called tested. The test at skp.rs:3590-3597 calls only `StreamRegistry::cancel`. `EngineSourceFactory` is the only non-test `impl SourceFactory`.
   - **§2.5 rows hold.** predicate.rs: ADR-033:3 is Accepted.

3. **E1.** A script over `git diff -U0 B H -- '*.rs'`, rc 0, found 180 changed lines: 178 comment lines and 2 non-comment lines. The two are `-    fn an_absent_crs_key_is_not_silently_ogc_crs84() {` and `+    fn an_absent_crs_key_is_not_a_declaration() {`.

4. **E5.** `cargo fmt --all -- --check`: rc 0.

5. **E7.** Both append-only checks hold, rc 0.
   - CANCELLATION-AND-TRACING.md: B has 254 lines; H's lines 1-254 hash to dfaa9a44…b353, the same as B's whole file. numstat is 14/0.
   - PERMISSION-BOUNDARY.md: B has 491 lines; H's lines 1-491 hash to dfa0b4e8…6cbf, the same as B. numstat is 10/0, and H has 501 lines.

6. **E8.** B's lines 499, 510 and 519 are byte-identical at H, where they now sit at lines 527, 538 and 547.
   - Per-line hashes match: 8d215cb2…, 7b136bec… and b6e78aaf….
   - B's tail from line 499 equals H's tail from line 527: sha256 56e1a249783fae6251b55553af3fd06453bdd23cdd749ae98b13ab48485dd1c5 for both.
   - The shift is +28.

7. **E3.** One shared-hold call, `-What "module-docs-stale-statements: cargo test of three named tests"`, with CARGO_TARGET_DIR=D:/wt-targets/mdocs, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. The hold was granted and released, with no 96-99 code.
   - `cargo test -p spatial-engine --lib -- geoparquet::tests::an_absent_crs_key_is_not_a_declaration --exact`: 1 passed.
   - `cargo test -p spatial-engine --test slice -- h6_the_engine_module_names_no_transport --exact`: 1 passed.
   - `cargo test -p spatial-kernel --test permission_boundary -- the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate --exact`: 1 passed.
   - Chained with `&&`, rc 0.

8. **Quoted spans.** I compared the quote characters on each side of the diff, per file, by script (rc 0).
   - engine/src/geoparquet.rs has 5 on each side, and crs.rs and kernel/src/lib.rs have 1 on each side. The retained spans ("the unit is…", "Consequences", "Decision", `decided here")` and `undo")` are byte-unchanged.
   - Three spans were deleted together with their stale sentences, as disclosed: engine/README.md lost two and engine/src/lib.rs lost one.
   - No quotation mark was added.

9. **Governance at H.** Run at 117d8d5c; the scripts/plan tree's last commit is c813c6ab.
   - `node scripts/plan/verify-cites.mjs`: rc 0, PASS, with 91 loose references advised, none in this diff.
   - `verify-quotes.mjs`: rc 0, PASS, with 121 checked and 0 errors.
   - `verify-test-claims.mjs`: rc 0, PASS, with 543 tests.
   - `verify.mjs`: rc 0, verify:plan PASS.
   - No new bare `path:line` appears on any added line: the grep exited 1, meaning no match.

10. **CI.** `gh pr checks 209`: 16 of 16 pass at 117d8d5c, both windows-latest `cargo test --workspace` jobs included (17m44s and 11m12s). Those two were still pending at the first read, which exited with rc 8, and had passed by 14:27Z. The final read exited with rc 0.

11. **Low profile.** The title, the body and the four commit messages (8305d4ed, 5f307304, d060e7ff and 117d8d5c) carry only in-repo references (#205 and #206). The only links are in the trailers or attribution lines, and there is no @mention outside them. This passes `state/directives/2026-10-08-low-profile-on-github.md`.

Final `git status --porcelain` in C:/dev/wt/mdocs: empty (rc 0). HEAD is 117d8d5c2b102f6dea1c2fe5eb01832a44148604.
