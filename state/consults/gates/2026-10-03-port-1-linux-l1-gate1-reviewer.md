VERDICT: PASS
Reviewed cut/port-1-linux-l1 @ eddcb28b8a4a3c86eb8e479062d329331e68ae86. PR #162, gate 1, reviewer.

Convention: text marked "quoted" is byte-copied from the source named beside it. Everything else is paraphrase. The base is b43c0eb (the merge-base). Ranges are three-dot.

## S1 (blocking)

None.

## Checklist results

**§9 Reviewer list**

1. **Full diff.** 14 files: §7's 13 plus the form, which only gains appended lines (0 deletions against main). §8 items 1 to 14 were checked one by one, and none fires:
   - The Windows check name, build and test commands, toolchain, cache key expression and timeout are unchanged. H2 is confirmed: main's runs 37100739772, 37100146744 and 37048762877 already report `cargo test --workspace (windows-latest)`.
   - No `RUSTFLAGS`, `-D warnings`, `continue-on-error`, `|| true`, `--skip` or `--exclude`, and no install step.
   - The new job uses `contents: read` (workflow level) and has no `secrets.` reference.
   - Both actions are already used by the `plan` job.
   - No test is added, removed or renamed. All 15 off-Windows reasons are §7's strings, byte for byte: `git grep -c` gives 11/1/1/1 for the LOD string and 1 for the case-policy string. The release-only string appears 3 times, and 0 bare `#[ignore]` attributes remain (3 at the base).
   - The script has no flag, export, dependency or network call, and exits 2 on a git failure (M7).
   - The KNOWN-LIMITATIONS change sits inside item 1 only.
   - The template change is one line appended at the end.
   - No profile path.
   - No probe commit is in HEAD (`merge-base --is-ancestor e03da5f HEAD` gives 1).
2. **M1 to M7, observed by me at eddcb28.** The script is unchanged since 824d561. For each mutation I applied it, ran only its named test with `node --test --test-name-pattern`, saw rc 1 with 0 pass and 1 fail, and restored the file. Afterwards `git status --porcelain` was empty and the full file ran 7 of 7 green. The first failing assertion matches each test's RECORDED MUTATION comment:
   - M1: status, actual 1, with the lod.rs:927 line.
   - M2: actual 0, expected 1.
   - M3: status, with boundary.rs:537.
   - M4: status, with shared.rs:1.
   - M5: stdout equality: line 2 missing, 3 sites.
   - M6: status, with engine/tests/x.rs:1.
   - M7: actual 0, expected 2.

   For the closing record: the worker's observations are at 824d561 and mine at eddcb28. §8 item 15 needs a commit for each.
3. **E1 to E3, by run id.**
   - **E1.**
     - Push run 37102627964 is the first run carrying the Linux entry: the branch's earliest product-ci-rust run, at 6c3cd63.
     - Pull-request run 37104963552 is at 6c3cd63, and the PR was opened non-draft at 6c3cd63 (07:01:23Z).
     - Both are green on both entries. The suite steps sum to 797/0/55 (Linux) and 831/0/40 (Windows) in both runs.
   - **E2.** Run 37104963555, job 111151558398, is green. It prints 18 site lines, then (quoted, from the job log) `cfg-boundary: 18 sites in 6 files, 0 outside every boundary`. The `plan` job 111151558269 shows `ℹ tests 415` and `ℹ fail 0` (quoted). T1 to T7 each show ✔.
   - **E3a.** Run 37103210808, job 111146644161: red, with one `predicate.rs:3221 outside every boundary` line and a count of 19 sites in 7 files, 1 outside.
   - **E3b.** Run 37103232248, job 111146706467, is a push event on the probe branch: red, naming 3221 and 3224, with 20 sites in 7 files, 2 outside. H4 holds.
   - **Probe.** e03da5f's parent is 6c3cd63, and 840f93b's parent is e03da5f. Each commit changes only `engine/src/predicate.rs` (+3). `ls-remote` shows no probe head. The probe's other runs were cancelled (37103210864, 37103211000, 37103232236 and 37103232401) or green (Rust fmt).
   - **Probe's `plan` job.** The `plan` job going red on the probe (T1 and T2 read the planted tree) is confirmed in jobs 111146643986 and 111146706459, as the worker said.
4. **P2 to P5, recomputed.**
   - **Method, per binary.** The CI logs were split by step. In the suite step and in the list step, the k-th `running N tests` block (or `N tests, M benchmarks` summary) is paired with the k-th `Running`/`Doc-tests` header. Each step has 89 headers and 89 blocks on both entries, including three `running 0 tests` blocks on Linux.
   - **Interleaving.** The headers do interleave in log order: 8 of them fall inside a block in Linux job 111151558653, and 6 in 111145008291. The Amendment's method note is therefore factual. Pairing by ordinal survives the interleaving, because cargo runs the binaries one after another. It is cross-checked by a Linux-minus-Windows residue of 0 on every binary.
   - **P2 holds**, per binary, in 37104963552, in 37102627964, and in eddcb28's run 37106233154. Linux minus Windows is 15: the 14 LOD tests (lod_tier_builder 11, lod_tier_cancellation 1, lod_tier_preflight 1, no_generation_in_persisted_artifacts 1) and `spatial_kernel` lib `permission::audit::normalize::tests::case_differences_collapse_on_windows`. Windows minus Linux is 0.
   - **H1 holds** on all four E1 jobs: the list step's set equals the suite step's `ignored` set (55 and 40).
   - **P3 differs.** Per binary, in all three runs, Windows minus Linux is 19:
     - `source_watch_adapter` 13, `source_watch_windows` 3 and `watcher_first_read_windows` 1;
     - two in the `spatial_engine` lib: `watch::windows_watch::tests::names_match_folds_case` and `...::an_invalid_handle_reports_its_issuing_error_through_the_handshake`.

     Linux minus Windows is 0. `engine/src/watch.rs` holds `#[cfg(windows)]` at line 103, with `mod windows_watch {` at line 104 and the two tests at 744 and 769. The CI Windows suite's 871 names equal my local head `--list`'s 871 names, apart from the harness's ` - should panic` suffix on one name.
   - **P4 holds.**
     - Method: the base and head trees were exported with `git archive` (b43c0eb and eddcb28) into scratch directories on D:, every file was touched, and each was built under the stated target dir. The Compiling lines show all five workspace crates rebuilt from each tree.
     - The sorted Windows `-- --list` (1043 lines, 871 tests) is byte-identical at the base and the head: sha256 90c9a11102676aad24c5f6d84998eba72f810770b23c17f5bdab56b47045db85 for both.
     - The sorted `-- --list --ignored` (150 lines, 40 tests) is byte-identical too: dd2a9542e94f09f8dda830dd1956179e38165d923bb1b561dd2c05900eb383bb for both.
     - Disclosure: my first base run, in an untouched export, compiled nothing, because cargo judged the old-mtime sources fresh against head artifacts. I discarded that run. The scratch trees are deleted.
   - **P5 holds.** The API job names match §2 item 1's two strings byte for byte.
   - **P6 holds.** The output is (quoted) `NAME="Ubuntu"`, `VERSION_ID="24.04"`, `x86_64`.
5. **§7 recounted** with the form's command over b43c0eb...eddcb28 (and over ...6c3cd63): 563 insertions plus 37 deletions makes 600 lines, over 13 files. That is exactly §7's list, against a ceiling of 750. No overrun, and §7 is unedited.

**Custodian's points**

- **(a) The reading is the form's.**
  - §2 item 3(d) makes each `cfg!(…)` a site, and §7 declares stdout per site. §0 counts origin.rs as 2, with one line pinned. So 18 sites, 18 lines, `origin.rs:172` twice. E2's log shows exactly that.
  - The worker's own literal count also came to 18. No §5 prediction or registered text changed, so §10 has no class to record. The template (`docs/PREREGISTRATION-TEMPLATE.md:96-99` @ d310206 sha256:d7456e0dbdeb1a915f23b138fcca691f47cc64acdc1d77aee40fe75a2bfb0cab) forbids inventing one.
  - No §8 item requires an amendment for an interpretation. Not a breach.
- **(b) The template line complies with §2 item 8 and §8 item 9.**
  - It is exactly one line, after the last one, and nothing above it is edited. A blank separator would be a second appended line, and §8 item 9 blocks that literally.
  - The content matches §7: bold lead, reference form, the one sentence with R3's three items, and the KNOWN-LIMITATIONS sentence. Its pin recomputes (below).
  - Consequence: in CommonMark the line renders as a lazy continuation of the round-25 (e) paragraph. See S2-5.
- **(c) Re-run myself: clean.** `node scripts/hooks/profile-path-scan.mjs --range b43c0eb HEAD` (tool @ 7680dc970d5a) gives rc 0 and "range read 5 commits, 589 added lines, 2 path names", then "clean". The same holds against origin/main.
  - The PR check `no profile path in the range` passes at 6c3cd63 (job 111151558064) and at eddcb28 (job 111155199441).
  - The a886894 ordering slip is disclosed, and the range scan covers it. No finding.
- **(d) Figures confirmed per binary** (item 4 above).
  - On the routing: §5's heading says each invalidator stops the piece. But I7's own text names its disposition (record as class 2, and report the unlisted compile-out), and names no escalation target, unlike I3 and I4.
  - Reading I7's text as the route is the only reading that gives that text effect. The template's class 2 definition (deviation recorded as a result, prediction never edited) is met: §0 and §5 are unedited, and the Amendment is append-only.
  - The two tests sit in the declared file-watching boundary (KNOWN-LIMITATIONS 24). They are a pre-existing Windows-only implementation module, not a module excluded "to make a platform pass", so they are no R4/R6 finding.
  - I agree with the routing. The report the Amendment promises is still owed.

**Amendment 1, resolved clause by clause.**
- **Items 1, 2 and 4:** each resolves against the run ids above.
- **Item 3:**
  - its figures (19; 13, 3 and 1; the two names) resolve;
  - "watch.rs untouched" resolves against the diff;
  - its KNOWN-LIMITATIONS claim resolves: the Linux line exists and is unchanged.
- **Item 5:** "None" is correct. This is not a correction round.
- **Record form:** the body's first line declares post-result. It carries no `path:line`, no hash and no quote.

**Hashes, recomputed** (`git show <rev>:./<path> | sed -n 'a,bp' | sha256sum`)
- **Form and template.** All 28 distinct `@ rev sha256` pins in the form match, and so does the template line's R3 pin (PORTABILITY:49-54 @ d310206, 60f4aa60…). The pre-existing template pins at 1a0251461aa2 and 83cad32c93eb match. The six word-form workflow hashes in §0 also match (product-ci-rust 14, 24-25, 30-43 and 180-193; governance-ci 68-97; rust-fmt 1-28). d310206 and 6a11144 are on main.
- **The architect's four pins, all @ d310206:**
  1. `state/directives/PORTABILITY-2026-09-30.md:119-133`, sha256:efd05728ea3df4712dfae1f72c66683abd78b772e8dfc5d76ea0292511b039b7. It holds §6 from its heading through Scope 1-5 and Acceptance (the line ending with the gating clause). The pin is as described.
  2. `state/questions/round-33.md:45-47`, sha256:e755f57cb991ed935e34d510ce8ba5a0f44742d17645c682df987d7b48cc256d. It holds item 7's profiles and its two options. As described.
  3. `state/directives/PORTABILITY-2026-09-30.md:31-65`, sha256:c69eed809fbffa8c0d0ee6f3a750039e2a0d6ce17e17a021cef170ef24f6699b. It holds all of §2 (heading, R1 to R6), and the boundary table is inside it at 37-45. That narrower span is the form's own §0 pin, sha256:da37f199a78a71a33125784031fedf483c3fbaf96de7b4a45ce3358a00d99c53. The pin is broader than "the table", so it should be described as §2 or re-pinned 37-45.
  4. `docs/PREREGISTRATION-TEMPLATE.md:96-99`, sha256:d7456e0dbdeb1a915f23b138fcca691f47cc64acdc1d77aee40fe75a2bfb0cab. It holds the §10 opening rule against inventing a class. As described.
- **The architect's three S2s.** I agree with all three. On its S2 (2): the first clause (paraphrase: the pin keeps the image from moving) asserts what §1 lists under may-not-claim (paraphrase: that the ubuntu-24.04 image keeps its contents after E1). Fix it before merge.

**Caller and seam.**
- `cfg-boundary.mjs` exports nothing. Its only product caller is governance-ci's `cfg-boundary` job.
- `id: build` is read by the list step's `if`. `matrix.job_name` is read by `name:`.
- The tests spawn the shipped CLI against the real tree and against `git show HEAD:` files.
- Messages state facts only.

## Exit codes (local, Windows, worktree at eddcb28; tool commits at the head)

- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0, 415 tests, 415 pass, 0 fail.
- `node scripts/plan/verify-cites.mjs` @ 522e448d55e0: rc 0, PASS.
- `node scripts/plan/verify-quotes.mjs` @ f9444a4d99a9: rc 0, PASS (113 checked, 0 hash-reference errors).
- `node scripts/plan/verify-test-claims.mjs` @ e9735d4749f0: rc 0.
- `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD` @ 7d24ed155a12: rc 0, all 7 new tests have a recorded mutation. This is a presence check, not an observation. The observations are M1 to M7 above.
- `node scripts/plan/verify.mjs` (verify:plan) @ 260720226f13: rc 0, PASS.
- `node scripts/plan/cfg-boundary.mjs` @ 824d56110722: rc 0, 18 sites in 6 files, 0 outside.
- `node scripts/hooks/profile-path-scan.mjs --range b43c0eb HEAD` @ 7680dc970d5a: rc 0, clean.
- `cargo fmt --all --check`: rc 0.
- `cargo test --workspace --locked -- --list` and `-- --list --ignored`, at the base and at the head: all four rc 0.
- The five verify tools are byte-identical to origin/main.
- Versions: rustc 1.97.1 (8bab26f4f 2026-07-14), cargo 1.97.1, node v24.18.1, git 2.49.0.windows.1.

**CI (§9 Suites)**
- At 6c3cd63, all green:
  - product-ci-rust 37104963552, both entries;
  - governance-ci 37104963555, `plan` and `cfg-boundary`;
  - Rust fmt 37104963563;
  - Exposure scan 37104963562;
  - DCO 37104963568;
  - shell 37104963749.
- At eddcb28, all green:
  - product-ci-rust 37106233154: Linux 111155200117 and Windows 111155200210. Pending at dispatch, completed success when read. Its figures are the same: 797/0/55 and 831/0/40, P2 15/0, P3 19/0.
  - governance-ci, push 37106230373 and pull_request 37106233088;
  - Rust fmt 37106233132;
  - Exposure scan 37106233057;
  - DCO 37106233119;
  - shell 37106233441.
- None pending when last read.

## S2

1. **`.github/workflows/product-ci-rust.yml` lines 37-41.** The architect's S2 (2), confirmed. The pin clause reads against §1's may-not-claim, and "catches" is an unmeasured capability claim. Reword both before merge.
2. **`scripts/plan/cfg-boundary.mjs` line 20.** The architect's S2 (1), confirmed. The added clause (paraphrase: never by the piece that needs it) goes beyond §2 item 3(e) and PORTABILITY R2. I10 says that only of this piece.
3. **product-ci-rust build-step comment.** The architect's S2 (3), confirmed. The comment at head lines 212-215 now sits above `Runner profile (Linux)`, not above the build step it describes.
4. **`scripts/plan/cfg-boundary.mjs` lines 224-228.** The bare `catch { continue; }` swallows every read error, not just a missing file. An unreadable tracked file is skipped silently, which can produce a green without a scan. Narrowing it to ENOENT needs a §7 stderr line, so route it to a later piece or an amendment. It is not a fix inside this piece's declared outputs.
5. **Template rendering.** The R3 entry renders inside the round-25 (e) paragraph (see (b)). It is not a breach of this form. A blank separator belongs to the architect's next template change. Nothing cites the line yet, so the shift is free now and costs a cite later.
6. **T1 is a snapshot of the tree** (18 sites and the exact per-file map). Any R2-legitimate cfg edit in a boundary file will turn governance's `plan` job red until `cfg-boundary.test.mjs` is edited. The form chose this design (S1), but the custodian should expect that coupling on future Rust pieces that touch a boundary file.
7. **§2 item 0, "recorded before any code".** The P1 re-derivation existed before a886894 only as hand-back 1, a message. Its committed record is e2bba91, after the code. The content matched §0, so nothing turns on it. The closing record should say where P1 is recorded.
8. **For the closing amendment:** M1 to M7 each with its commit (824d561 for the worker, eddcb28 for this gate), and the owed report of the unlisted compile-out (Amendment 1 item 3).

## N

1. **product-ci-rust header** (paraphrase): it says the file watcher's own test *targets* are compiled out off Windows. That is true but now known to be incomplete: two lib unit tests compile out too. KNOWN-LIMITATIONS 1's wording ("tests") already covers them.
2. **governance-ci header** (paraphrase): it says neither new check is a required check. That is a current-state fact about repository settings, and it goes stale silently if the human sets the check as required.
3. **Output lines.** `origin.rs:172` prints two identical lines, so a reader cannot tell the two sites apart. §7 fixes the format, so this is not for this piece.
4. **Script coverage gaps.** The token set omits `target_env` and `target_vendor`. Raw C strings (`cr"…"`) are blanked as ordinary strings. A run from a subdirectory under-scans. None of these produces a false green on today's tree, and CI runs from the root.
5. **Process (my own runs).** The target dir now holds head artifacts built from a scratch copy whose content is identical to the worktree's HEAD. A later build in the worktree reads them as fresh, which is correct for eddcb28. I spawned no process that is still running, the worktree is clean at eddcb28, and the scratch trees are removed.
