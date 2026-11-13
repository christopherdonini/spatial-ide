Reviewed: PR #313 at 5977712dd15d30b40cddb6d087f299275fc4f9df (base 3fe9f97d) (the custodian's filing note, 2026-11-13: the gate, the reviewer, attempt 1, dispatched beside the architect, the five-line form's two gates from dispatch, PLAN node verify-bundle-example-path-build-dir-layout, filler entry 15; its brief by file (sha256 3dab97a29477affb54bb2fb6979ce7510125d3ab9c2549252f1d9faf540e7fca); the run 10:58:33Z to 12:20:39Z by its transcript, 60 calls (Bash 53, Read 6, SubagentHandback 1), 2 errored (a search's grep exit 1 at 11:03:36Z; the clippy -D warnings run's exit 101 at 11:56:49Z, which the report records), model claude-opus-5-5; its turn ended once while its full suite ran in the background, and the custodian's message naming the finished run resumed it; below, the hand-back byte for byte (19409 bytes, sha256 c5e67274dbc066894b6a2184153940bb5f8386475f86521d94d24c00cb28ffb5), one final newline added if it had none, save its one scratch path, written here as <the custodian's scratchpad>; nothing else changed. Its D1 words for the module doc's lines 6 to 10 differ from the architect's; both go to the advisor in question round 76.)

Reviewed: PR #313 at 5977712dd15d30b40cddb6d087f299275fc4f9df (base 3fe9f97d), gate, reviewer, attempt 1
Branch and commit: cut/verify-bundle-example-path-build-dir-layout @ 5977712dd15d30b40cddb6d087f299275fc4f9df

Verdict: PASS WITH NOTES

## Findings by class

**Correctness:** none.

**Evidence:** none.

**Documentation (must be fixed before the merge; this does not block):**

- **D1. The module doc in `kernel/tests/built_targets/mod.rs` (lines 6–10 at H) says more than the evidence shows.** This is the worker's wording, not the human's or the advisor's.
  - **The problem.** The doc states, as fact, that "the examples and binaries a test runs sit under `<profile>/` on both" layouts.
  - **What the evidence covers.** On the build-dir layout, only the examples half is shown: CI's verify_bundle passes on rustc 1.100.0 (check 7). No run of this piece shows where a binary (`publish-bundle`) sits on that layout.
  - **The form agrees.** N3 ("What no run of this piece exercises") names the `<profile>/<bin>` placement on the new layout, and "What is not settled" names where cargo puts the bins. My grep of both CI logs for `debug/publish-bundle` and `debug/examples` found nothing (0 and 0).
  - **Closure:** replace lines 6–10 with the words below. The worker applies them with no re-gate, and the PR body lists them.

```
//! A test binary sits in `<profile>/deps/` on one cargo layout and under
//! `<profile>/build/<package>/<hash>/out/` on another. The examples a test runs sit under
//! `<profile>/examples/` on both; the binaries sit under `<profile>/` on the first, and no run
//! yet shows where they sit on the second. So the profile directory is the nearest ancestor of
//! the test binary named for the build's profile, not a fixed number of parents up. Test-only:
//! this module has no test target of its own.
```

  Each clause, checked against the code and the runs:
  - **"in `<profile>/deps/` on one cargo layout":** my local run on 1.97.1 logs `Running tests\verify_bundle.rs (D:/wt-targets/vbf\debug\deps\verify_bundle-08a1f7fba9a4850b.exe)`. True.
  - **"under `<profile>/build/<package>/<hash>/out/` on another":** CI on 1.100.0 logs `(target/debug/build/spatial-kernel/66dea325524b6dc7/out/verify_bundle-66dea325524b6dc7)`, and all 117 Running lines in each job sit under that shape. True.
  - **"examples … under `<profile>/examples/` on both":** two runs show it.
    - Locally, 5(a) deleted `debug/examples/verify-bundle.exe`, the fallback rebuilt it, and `ls` shows it there afterwards.
    - In CI, verify_bundle passes on 1.100.0 in both jobs. It can pass only if `profile_dir().join("examples")` exists, because the post-build assertion, byte-equal at B and H, otherwise fires. True.
  - **"the binaries sit under `<profile>/` on the first":** `ls D:/wt-targets/vbf/debug/publish-bundle.exe` gives rc 0. True.
  - **"no run yet shows where they sit on the second":** the form's N3 and my CI-log grep (0 matches). True.
  - **"nearest ancestor … named for the build's profile":** `ancestors().skip(1).find(file_name == profile)`, with the profile from `cfg!(debug_assertions)`. True.
  - **"no test target of its own":** it is a `mod.rs` in a subfolder of `tests/`, which cargo does not discover as a target. True.
  - **Operator view:** none. This is test-only code with no user-visible text.

**Observations (not findings):**
- `verify_bundle.rs:50` and `scale_pass.rs:1266` still say "beside this test binary". That wording was already loose on the deps layout, the piece does not change those lines, and the Change line does not cover them. No finding.
- 5(b) took 9m 41s, recompiling 8 crates, after 5(a)'s nested `cargo build --example`. The worker's call 66 shows the same. This is how the build fallback behaved before this piece, not something it changed.

## Checks 1 to 12

**1. Start state.**
- HEAD is `5977712dd15d30b40cddb6d087f299275fc4f9df`, on branch `cut/verify-bundle-example-path-build-dir-layout`. Porcelain is empty (rc 0).
- `git -C C:/dev/spatial-ide fetch -q origin`: rc 0. `origin/cut/verify-bundle-example-path-build-dir-layout` is `5977712dd15d30b40cddb6d087f299275fc4f9df`, equal to H. origin/main is `2e4d5d0b28a072bb706e8d0d8373cd40651615c3`, as the packet gives.
- `df -h /c /d`: rc 0. C: has 16G free and D: 201G, both above the floors.
- `rustc --version`: rc 0, `rustc 1.97.1 (8bab26f4f 2026-07-14)`.

**2. Scope.** `git diff --name-only B...H` (rc 0) names `kernel/README.md`, `kernel/tests/built_targets/mod.rs`, `kernel/tests/scale_pass.rs` and `kernel/tests/verify_bundle.rs`: the four Scope files and nothing else. A grep for the forbidden paths returns rc 1, meaning none is there.

**3. Counts.**
- numstat (rc 0): `2 2 kernel/README.md`, `50 0 kernel/tests/built_targets/mod.rs`, `5 20 kernel/tests/scale_pass.rs`, `4 10 kernel/tests/verify_bundle.rs`.
- Total: 61 added and 32 deleted, 93 lines against the declared 120.
- The 61 added lines hold 0 CR and 0 tab.
- Each file's blob at H ends with `0a` and holds 0 CR. `core.autocrlf` is false.

**4. The Change line, clause by clause at H.**
- **`profile_dir`:** yes on both counts.
  - It finds the nearest ancestor by `me.ancestors().skip(1).find(...)`, where `skip(1)` drops the binary itself.
  - The profile is `"debug"`, or `"release"` when `cfg!(debug_assertions)` is false.
  - When no ancestor matches, it panics with `"no ancestor of the test binary {} is named `{profile}`"`, with `me.display()` in the placeholder.
  - The workspace has no custom profile (`[profile.release]` only, with no debug-assertions override), and no `--profile` use under `.github/`, `scripts/` or `kernel/` (grep rc 1).
- **The three helpers each call it:** yes. `build_verifier` at `verify_bundle.rs:67`; `binary_beside_me` and `example_beside_me` at `scale_pass.rs:1272` and `:1280`.
- **Byte-equal at B and H** (my script `vbf-gr-cmp.mjs`, rc 0, `ALL-EQUAL`). Each block is unique in its file, compared by sha256:
  - the build fallback plus the release flag plus the post-build assertion: 30 lines, `fd876b3585a21a3a` at both;
  - the release flag line: `f9cf336dfaf38894` at both, equal to the form's N1 pin prefix;
  - the post-build existence assertion: `b9fa28d2c2cd5d51` at both;
  - `binary_beside_me`'s assertion: `df9043e12e8b79a3` at both;
  - `example_beside_me`'s assertion: `abab4ed719266140` at both;
  - the join line: `c0ca2ed5fd6ea4ea` at both.
- **Executable names:** the same, by reading. At B, verify_bundle used the literals `"verify-bundle.exe"` and `"verify-bundle"`. `exe_name("verify-bundle")` gives `format!("{name}.exe")` on Windows and `name.to_string()` elsewhere, which yields the same names. scale_pass's blocks were moved unchanged into `exe_name`.
- **`#[ignore]`:** the lists at B and H are equal. `measure_the_five_gigabyte_scale_pass` and `measure_publish_at_five_gigabytes` keep identical attributes.
- **Licence header:** the same two lines as `verify_bundle.rs`'s (script: `licence header equal: true`).
- **Docs:**
  - The `profile_dir` doc is true. Its RECORDED MUTATION line is checked under check 6.
  - The `exe_name` doc is true.
  - The module doc's "examples and binaries … on both" claim is D1.
- **kernel/README.md:** two lines change, at 361 and 390. Each is B's line with a suffix, and nothing else changes.
  - Line 361 gains `; every pointer the build-dir layout piece adds or changes (this piece's form in the preregistration list) at 3fe9f97d`.
  - Line 390 gains `, `governance/forms/kernel/VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md``.
  - The form exists at 3fe9f97d and at 5977712d (`git cat-file -e`), so the pointer resolves and both clauses are true.

**5. Local runs at H**, each in its own shared hold.
- **(a)** `debug/examples/verify-bundle.exe` existed (`ls -l` rc 0, 52748800 bytes) and was deleted (rm rc 0; `ls` afterwards rc 2). `r5a_rc=0`. Result: `test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 617.94s`. The build fallback ran, and the example is present afterwards.
- **(b)** `r5b_rc=0`. Result: `test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.81s`.
- **(c)** `cargo test --workspace --locked`: `r5c_rc=0`. My script `vbf-gr-sum.mjs` was self-tested on 5(a)'s log and on the worker's M1 log, where it named the 3 failures. On this log it gives `{"lines":122,"passed":1074,"failed":0,"ignored":66,"notok":0,"unparsed":0,"failing":[]}`.
- **(d)** `cargo fmt --all -- --check`: `r5d_rc=0`, output 0 bytes.
- **(e)** `cargo clippy --locked -p spatial-kernel --all-targets -- -D warnings`: `r5e_rc=101`, recorded and not claimed.
  - Its errors are at `renderer\src\canonical.rs:303:20` and `renderer\src\style.rs:10:5`, then `could not compile `spatial-renderer` (lib)`.
  - That run never lints the kernel's test targets, so I made one extra run without `-D warnings` (`r5e2_rc=0`). Its spans are in `renderer/src/{canonical,style}.rs`, `kernel/src/permission/boundary.rs`, `kernel/src/publish/mod.rs`, `kernel/src/skp.rs`, `kernel/src/lib.rs` (×2) and `kernel/src/bin/publish-bundle.rs`.
  - It has 0 matches for built_targets, verify_bundle or scale_pass. No diagnostic's primary span is in a line B...H adds.

**6. M1, my own observation.**
- **Applied** by `vbf-gr-m1.mjs`, which refuses unless the statement occurs exactly once. Output: `occurrences: 1` and `applied`. The diff is the five-line `let profile = if cfg!(debug_assertions) {…};` replaced by `    let profile = "deps";`.
- **Run** in a hold: `m1_rc=101`. Byte-copied:
```
thread 'every_corruption_class_is_caught_with_its_declared_state' (60556) panicked at kernel\tests\verify_bundle.rs:92:5:
verify-bundle was built but is not at D:\wt-targets\vbf\debug\deps\examples\verify-bundle.exe — the path derivation is wrong, and this test would otherwise pass vacuously
thread 'a_missing_or_unparseable_manifest_is_refused_by_name' (82168) panicked at kernel\tests\verify_bundle.rs:92:5:
verify-bundle was built but is not at D:\wt-targets\vbf\debug\deps\examples\verify-bundle.exe — the path derivation is wrong, and this test would otherwise pass vacuously
thread 'a_real_bundle_verifies' (56104) panicked at kernel\tests\verify_bundle.rs:92:5:
verify-bundle was built but is not at D:\wt-targets\vbf\debug\deps\examples\verify-bundle.exe — the path derivation is wrong, and this test would otherwise pass vacuously
test result: FAILED. 0 passed; 3 failed; 0 ignored; 0 measured; 0 filtered out; finished in 627.29s
```
- **Reverted:** `git checkout -- kernel/tests/built_targets/mod.rs` gives rc 0, the porcelain is 0 bytes, and `git diff --quiet HEAD` gives rc 0.
- **Against the form's prediction:** it matches. T1 to T3 fail by name on the deps layout at the post-build existence assertion.
- **Against the `RECORDED MUTATION:` line at H, clause by clause:**
  - **Commit:** the record says f740eeef and I ran at 5977712d. T to H changes only mod.rs's doc comment (stat 5+/1−, the `(pending)` line replaced), so the code under mutation is identical.
  - **Toolchain:** 1.97.1. Matches.
  - **Command:** `cargo test --locked -p spatial-kernel --test verify_bundle`. Matches.
  - **Tests:** the three named. Matches.
  - **Exit code:** 101. Matches.
  - **Counts:** 0 passed, 3 failed. Matches.
  - **Place:** the post-build existence assertion. Matches.
- **Line mapping:** `kernel/tests/verify_bundle.rs:98-103 @ 5007eaa1` (sha256 b9fa28d2c2cd5d5122d78b5d507dc4ec0434d0bd6e7726239810a5ddd2e92693, recomputed) is byte-equal to lines 98–103 at B and lines 92–97 at H. The panic at `:92:5` is that assertion.

**7. CI at H.** Both runs are `Product CI — Rust workspace`, headSha 5977712d…, conclusion success. The step `Run the ordinary suite` succeeded in all four jobs:
- run 43407671188 (pull_request): jobs 131825893881 (ubuntu-24.04) and 131825894002 (windows-latest);
- run 43407245478 (push): jobs 131824479677 (windows-latest) and 131824479961 (ubuntu-24.04).

Byte-copied from the log files. In the Running lines, the `^[` characters are literal caret and bracket bytes in the files, not ESC.
- **The rustc lines:**
  - 131825893881: `L1 portable correctness · cargo test --workspace (ubuntu-24.04)	Run dtolnay/rust-toolchain@stable	2026-11-13T10:14:47.2565182Z rustc 1.100.0 (0ef1bc386 2026-11-09)`
  - 131825894002: `cargo test --workspace (windows-latest)	Run dtolnay/rust-toolchain@stable	2026-11-13T10:15:05.8900876Z rustc 1.100.0 (0ef1bc386 2026-11-09)`
  - 131824479677: `cargo test --workspace (windows-latest)	Run dtolnay/rust-toolchain@stable	2026-11-13T10:12:01.1874937Z rustc 1.100.0 (0ef1bc386 2026-11-09)`
  - 131824479961: `L1 portable correctness · cargo test --workspace (ubuntu-24.04)	Run dtolnay/rust-toolchain@stable	2026-11-13T10:11:45.7096931Z rustc 1.100.0 (0ef1bc386 2026-11-09)`
- **The Running lines:**
  - 131825893881: `L1 portable correctness · cargo test --workspace (ubuntu-24.04)	Run the ordinary suite	2026-11-13T10:31:31.5859597Z ^[[1m^[[92m     Running^[[0m tests/verify_bundle.rs (target/debug/build/spatial-kernel/66dea325524b6dc7/out/verify_bundle-66dea325524b6dc7)`
  - 131825894002: `cargo test --workspace (windows-latest)	Run the ordinary suite	2026-11-13T10:39:18.0321848Z ^[[1m^[[92m     Running^[[0m tests\verify_bundle.rs (target\debug\build\spatial-kernel/22da53baa802e9be\out\verify_bundle-22da53baa802e9be.exe)`
  - 131824479677: `cargo test --workspace (windows-latest)	Run the ordinary suite	2026-11-13T10:37:36.6158741Z ^[[1m^[[92m     Running^[[0m tests\verify_bundle.rs (target\debug\build\spatial-kernel/22da53baa802e9be\out\verify_bundle-22da53baa802e9be.exe)`
  - 131824479961: `L1 portable correctness · cargo test --workspace (ubuntu-24.04)	Run the ordinary suite	2026-11-13T10:30:33.3803245Z ^[[1m^[[92m     Running^[[0m tests/verify_bundle.rs (target/debug/build/spatial-kernel/66dea325524b6dc7/out/verify_bundle-66dea325524b6dc7)`
- **verify_bundle's `test result:` lines:**
  - 131825893881: `… 2026-11-13T10:31:33.5082306Z test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.92s`
  - 131825894002: `… 2026-11-13T10:39:20.0260949Z test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.97s`
  - 131824479677: `… 2026-11-13T10:37:38.5158638Z test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.87s`
  - 131824479961: `… 2026-11-13T10:30:35.0925971Z test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.71s`
  - Each `…` stands for the job name and step prefix shown in the Running line above.
- **The suite in each job** (script `vbf-gr-ci.mjs`, rc 0): 117 Running lines, all under `build/<pkg>/<hash>/out/` and 0 under `deps/`, and 8 Running lines after verify_bundle. Totals:
  - windows: 122 result lines, 1074 passed, 0 failed, 66 ignored;
  - ubuntu: 122 result lines, 1034 passed, 0 failed, 83 ignored.
- **OPEN-3 and OPEN-4:** neither case shows. verify_bundle passes on 1.100.0, so (C)'s path is present. Nothing fails among the binaries after it.

**8. The record against N3**, from the first worker's run extract:
- **Run 1** (example deleted): call 55. The extract's call 64 gives `r1rc=0`.
- **Run 2** (example present): call 65. Call 69 gives `r2rc=0`.
- **Run 3** (M1): calls 42 (apply) and 43 (run). Call 47 gives `m1rc=101` and `[exited with code 101]`. Call 48 holds the failures and call 49 the revert.
- **Run 4** (`cargo build --workspace --tests --locked`): call 70. Call 72 gives `[exited with code 0]`, the task's exit, which is `exit $rc`. The `r3rc=` echo line itself does not appear in the extract.
- **Run 5** (the suite): call 73. Call 83 gives `[exited with code 0]`, and call 85's `grep -c "r4rc=0"` gives `1`. The sum is 1074/0/66.
- **Run 6** (`--list --ignored`): call 86 gives `listrc=0`. Call 87 compares them: `scale_pass entries base 3 head 3 equal true`.
- No run is missing from the record.

**9. Governance checks at H**, all from the worktree root:
- `node --test …` (hold): `nt_rc=0`, `ℹ pass 598`, `ℹ fail 0`.
- `verify-cites`: rc 0, PASS.
- `verify-quotes` (hold): `vq_rc=0`, `verify:quotes PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, …, 0 ruling-cite errors.`
- `verify-test-claims`: rc 0, PASS.
- `verify.mjs --offline`: rc 0, PASS.
- `verify-mutation --base B --head H`: rc 0, `verify:mutation PASS — all 0 new test(s) have a recorded mutation naming them.` This is a tool check that the record names its mutation. It is not the observation; check 6 is.
- `forms-layout`: rc 0, PASS.

**10. The departure's record** (no finding). Calls 28, 29, 30 and 52 show what section 6, item 1 of the packet says.
- **Call 28:** a Write to `C:/dev/wt/vbf/kernel/tests/built_targets/mod.rs`, which errored with `<tool_use_error>spatial-guardian: refused, because the path cannot be placed.</tool_use_error>`.
- **Call 29:** `mkdir -p C:/dev/wt/vbf/kernel/tests/built_targets && echo ok`, which printed `ok`.
- **Call 30:** the same path, with content byte-equal to call 28's (`cmp` rc 0). Result: `File created successfully`. The extract shows the call succeeding; it does not otherwise show the Guardian's check.
- **Call 52:** an Edit of the existing file, replacing `/// RECORDED MUTATION: (pending)` with the five-line doc.
- **Did any other call create the file?** No. The other Write and Edit calls (10, 40, 53, 84) are scratch files, and 33 and 50 errored. Call 42 rewrote the existing file and call 49 restored it.

**11. CI.** I ran `gh pr checks 313` between 2026-11-13T12:14:47Z and 12:14:49Z (rc 0). Every check passes. The PR's headRefOid is 5977712d… and it is a draft.

**12. The end.**
- My processes are all stopped. Every hold has its MACHINE_RELEASED line, and all six of my background tasks reported completed. `tasklist` shows 0 cargo.exe and 0 verify_bundle processes.
- HEAD is 5977712dd15d30b40cddb6d087f299275fc4f9df.
- `git -C C:/dev/wt/vbf status --porcelain` is 0 bytes.

## For the advisor

Nothing new. The departure stays as ruled.

## The packet's gaps

- The CI job ids. I took them from `gh run view --json jobs`.
- That the gh logs carry color codes as literal `^[` text.
- That clippy with `-D warnings` stops in `spatial-renderer` before it lints kernel test targets. Without that, the added-lines question cannot be answered from that run alone, which is why I ran the extra clippy.

## Hold lines (this project only, also= elided)

Each hold printed `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=… (commands started from now on inherit it; release when done)` and later `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`. The pids:
- 80044: 5(a)
- 28912: 5(b)
- 61172: 5(c)
- 32808: 5(d)
- 63172: 5(e)
- 29520: the extra clippy
- 74432: M1
- 61764: node --test
- 61988: verify-quotes

## Background shells left

None. All six completed: b21sbay4e, bdmndeyx9, b68b58rzi, b2py0slin, bxd3122ta and bo7jv2din.

## Model

Opus 5.5 (claude-opus-5-5), as the harness reports it.

Scratch evidence is in <the custodian's scratchpad>, under the names starting `vbf-gr-`. The main logs are `vbf-gr-5c.txt` (the suite), `vbf-gr-m1.txt` (M1), `vbf-gr-cmp.txt` (the byte-equality checks) and `vbf-gr-ci.txt` (the CI extraction).
