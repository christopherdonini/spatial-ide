Reviewed: PR #313 at 5977712dd15d30b40cddb6d087f299275fc4f9df (base 3fe9f97d) (the custodian's filing note, 2026-11-13: the gate, the architect, attempt 1, dispatched beside the reviewer, the five-line form's two gates from dispatch, PLAN node verify-bundle-example-path-build-dir-layout, filler entry 15; its brief by file (sha256 b763f692e84baabe916712811ac27949cd417b3e24a877b0e4a04364e810d59c); the run 10:58:33Z to 11:04:40Z by its transcript, 42 calls (Read 20, Grep 20, Glob 1, SubagentHandback 1), none errored, model claude-opus-5-5; below, the hand-back byte for byte (19293 bytes, sha256 b87d1d7a45a9e2834549d56301a1e0a244d7039a26f08d568385684330dc520d), one final newline added if it had none, save its 41 sha256:<H> placeholders, each filled by script with the sha256 of its cited whole lines at its named commit (git show, LF-joined, a final newline); nothing else changed. Its D1 words for the module doc's lines 6 to 10, with the reviewer's different words for the same lines, go to the advisor in question round 76.)

Reviewed: PR #313 at 5977712dd15d30b40cddb6d087f299275fc4f9df (base 3fe9f97d), gate, architect, attempt 1
Verdict: PASS WITH NOTES (WORDS-ONLY)
Branch: cut/verify-bundle-example-path-build-dir-layout @ 5977712dd15d30b40cddb6d087f299275fc4f9df

I have no shell, I ran no commands and I left no background shell. Every check below comes from a Read or Grep in this run: the custodian's byte copies in the brief's folder, and main's checkout at 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 (the packet's main; I cannot confirm the checkout's head without a shell). The reviewer observes M1 and reads the CI logs. For M1 I rely on the record in the extract, calls 42 to 49.

## Findings by class

**Correctness:** none.

**Evidence:** none blocks this gate. CI at H is the merge condition (Part 1, item 4). The closing amendment's citations for the build-dir layout are set out under check 2.

**Documentation (must fix before the merge). D1: `kernel/tests/built_targets/mod.rs` states one of N2 (C)'s unverified premises as fact.**
- **Where:** `kernel/tests/built_targets/mod.rs:6-10 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:47adec683072674c33afdfe2556ff7e6826aab10f4e31a4d9e3d9441661dc68d` and `kernel/tests/built_targets/mod.rs:14-15 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:20aa84ce75462fab9db5d4c7b3743044f5843484bca08b48fe4c0849e95eaf85`.
- **The defect:** the module doc says that the examples and binaries sit under `<profile>/` on both layouts. The function doc calls the directory `target/debug` or `target/release`, "holding" them. On the build-dir layout, only the example's place is shown, and only by green CI. The binaries' place (`publish-bundle` at `<profile>/`) is exercised by no run of this piece. The form itself lists it as unsettled (`governance/forms/kernel/VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md:76 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:a6026062aaf3f8a515d302e8b7de87dbf4b5b407e5d55e2bf08216edc0c8a65d`, `governance/forms/kernel/VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md:151 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:6be232764721dbc25b65fb667d28420f11faa2ecedeae9e001cc47ac81bdcb32`).
- **Not on that ground:** the `target/` prefix is also untrue whenever `CARGO_TARGET_DIR` is set, as in the worker's own runs (extract call 48, `state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md:755 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:7fe1468c6de67b485a9a3a7ffeef4621b7db0e72b02ab1c4a25ce31ca3d29501`).
- **Whose words:** the worker's doc comment, not the human's. Under §31 and Part 1, item 2, the worker applies these words with no re-gate, and the PR body lists them. They add 1 line, so the size goes from 93 to 94 lines against the 120 budget.
- **Closure:** replace lines 6-10 with:
  ```
  //! A test binary sits in `<profile>/deps/` on one cargo layout and under
  //! `<profile>/build/<package>/<hash>/out/` on another. The examples and binaries a test runs
  //! are looked for under `<profile>/`, and each helper that finds one fails loudly unless it is
  //! there. So the profile directory is the nearest ancestor of the test binary named for the
  //! build's profile, not a fixed number of parents up. Test-only: this module has no test target
  //! of its own.
  ```
  and replace lines 14-15 with:
  ```
  /// The profile directory (`debug` or `release` under cargo's target directory) under which the
  /// helpers look for the built examples and binaries: the nearest ancestor of the running test
  /// binary named for the build's profile.
  ```
- **Clause check of the words (H line numbers):**
  - "in `<profile>/deps/` on one cargo layout": extract call 39 shows `debug\deps\verify_bundle-….exe` (`state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md:648 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:a141893ef452f01eca81860369b79f972c427eafc714c42aefecc47dedbd597c`).
  - "under `<profile>/build/<package>/<hash>/out/` on another": the form's N1 reading of the failing run (`governance/forms/kernel/VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md:23 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:da775963d9df7c9e9c92b09a41dfc2af5ab2c76e308ee319facba34836eced42`) and the PR CI Running line. That line is the reviewer's to read and the closing amendment's to cite (check 2).
  - "looked for under `<profile>/`": `kernel/tests/verify_bundle.rs:69 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:c0ca2ed5fd6ea4ea739ca474e731f5cb494589d1a61b05316af3b28c11d8d940`, `kernel/tests/scale_pass.rs:1274 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:cbbdb806464bd62d4c7052efda3a87e8eb21f5bcc72007b9d026502572fccf2d` and `kernel/tests/scale_pass.rs:1282 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:bf9cf4deb560b51bf5cb12837d780d525ba09241b9979ec0b0322f88e03c091f`.
  - "fails loudly unless it is there", three paths:
    - verify_bundle returns only if the file exists (`kernel/tests/verify_bundle.rs:70-72 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:85ddfb47ce8bc70ddcb752d2879adcfe5fbd36739938289379fb3968ddf08bf9`); otherwise it builds and asserts (`kernel/tests/verify_bundle.rs:92-97 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:b9fa28d2c2cd5d5122d78b5d507dc4ec0434d0bd6e7726239810a5ddd2e92693`).
    - `binary_beside_me` asserts at `kernel/tests/scale_pass.rs:1275 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:0a5c5a0aff4fd4d365c64e8dce2584f54b2df3966bbbc823739e96826b5e62ca`.
    - `example_beside_me` asserts at `kernel/tests/scale_pass.rs:1283-1287 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:73364ee0e49f2f306c4722ea77e3dafd27181c21ed9c5063859aa2ea1cae815d`.
  - "nearest ancestor … not a fixed number of parents up": `kernel/tests/built_targets/mod.rs:31-33 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:510e45260e6a4a3ddf50aa2b4896d49329244684b4b793e4b7baa25a85d40229`.
  - "no test target of its own": cargo's auto-discovery finds `tests/<name>.rs` and `tests/<name>/main.rs` only, and my Grep of `kernel/Cargo.toml` (main, equal to B for kernel/ by the packet's section 1) finds no `[[test]]` and no `autotests`.
  - "`debug` or `release`": `kernel/tests/built_targets/mod.rs:25-29 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:f3f4a34d04597961bbaba10958b4c662ac574b34c3609fbb8b137470b917a0e1`.
  - "under cargo's target directory": the derived path under `CARGO_TARGET_DIR`, extract call 48, as cited under "The defect".
- **Cases the words still cover:** three settings move the profile directory or the files: a custom `--profile`, debug assertions turned on in release through RUSTFLAGS, and a `build-dir` configured apart from the target directory. These are dev-only switches and do not block. Under §31 they are named here for the source comment if the worker wants them recorded. In every one of them the helpers still look under `<profile>/` and still fail loudly, so the words stay true.

**Notes (preferences, not acceptance conditions):**
- **N-a.** Two docs the diff does not change still say "beside", which is loose on the build-dir layout: `kernel/tests/verify_bundle.rs:15 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:85f5698c394abc2356dca74ff423d758837596f9122330340725466a9bf48aa7` and `kernel/tests/scale_pass.rs:1266 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:d41f19ac56cf44de187e4f0af27872bf9e23652414c5462a8a4fe89956655964`. "Beside" was already loose on the deps layout, and neither sentence claims a path.
- **N-b.** `verify_bundle.rs:54-56` ("taken from this binary's own path") is unchanged and still true: the directory is an ancestor on that path, and a `--release` run finds `release`.
- **N-c.** The `RECORDED MUTATION:` line names T (f740eeef). The PR body should ask for a merge commit, never a squash, so that T and H stay reachable from main. #312's two-parent merge is the precedent.

## Check 1: the five lines against the diff

- **Scope:**
  - The packet's numstat and extract call 92 name exactly the four files: 93 lines against 120.
  - No product code, no Cargo file, no workflow file, and nothing under engine/, protocol/ or KNOWN-LIMITATIONS. The diff copy has no other path.
  - README: only line 361 (Last-verified) and line 390 (the preregistration list) change.
- **Change:**
  - **One shared function, three callers:** `built_targets::profile_dir` and `exe_name` are called by `build_verifier` (`kernel/tests/verify_bundle.rs:66-69 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:9c7eb0816c8ccb33d48bd7e3f44f520dc4a7f5051e967e400c71c78c3fc326c1`), `binary_beside_me` (`kernel/tests/scale_pass.rs:1271-1274 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:801a5009306c63ceb984325982100f42ddb97bdbb85a7775297df625fc619615`) and `example_beside_me` (`kernel/tests/scale_pass.rs:1279-1282 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:f988d016ba6ca8b9169b2858eb7986ceeebccb6c3b9a1dde490e36525100af17`).
  - **What stays unchanged, B against H:**
    - **Executable names:** B's literals and its format at `kernel/tests/verify_bundle.rs:70-74 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:dd83f522da8f27b8567076db64b9fd908af8ee1732b70b3d436334a52f690181` and `kernel/tests/scale_pass.rs:1276-1280 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:d67b08d8990e7d50bd0a13d8c6fece2ebef869f5412ab6bbee30d618be58cde4` produce the same strings as `exe_name` at `kernel/tests/built_targets/mod.rs:44-50 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:76bd702a20ed9de79f8699d8cf66858381edacf0135dc5082d078f934156d537`.
    - **The build fallback and the release flag:** B lines 80-104 equal H lines 74-98 byte for byte by reading. The release flag is `kernel/tests/verify_bundle.rs:74 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:f9cf336dfaf38894d8a1cc8b595fbbaab18b4b6409a7478104ce8095846a940a`. It now agrees with `cfg!(debug_assertions)` by construction.
    - **Existence assertions:** all three are unchanged (B `kernel/tests/scale_pass.rs:1282 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:0a5c5a0aff4fd4d365c64e8dce2584f54b2df3966bbbc823739e96826b5e62ca` and `kernel/tests/scale_pass.rs:1298-1302 @ 3fe9f97d066f49168170f63c23b4c14c0bc843ae sha256:73364ee0e49f2f306c4722ea77e3dafd27181c21ed9c5063859aa2ea1cae815d`, against H 1275 and 1283-1287; verify_bundle B 98-103 against H 92-97).
- **Tests+mutation:**
  - **No test added, removed or renamed:** the verify_bundle hunks touch neither `#[test]` nor a test body. Extract call 87 shows scale_pass's entries equal and 66/66 ignored entries at base and head.
  - **M1 as declared:** call 42 replaces the profile choice with `"deps"` (`state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md:693-698 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:6f81a207a7be96ca302430a586d92e8795066e239fe2051d8902737405006ba1`).
  - **The `RECORDED MUTATION:` line, clause by clause** (`kernel/tests/built_targets/mod.rs:17-21 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:2122ed5de4d5d69cf510b7b126ba43efafbb393d802eb7f0cad94088ddc4043a`):
    - "at f740eeef…": call 41 printed HEAD = f740eeef, and call 49 shows the HEAD unchanged after the revert.
    - "the profile name replaced by `deps`": call 42.
    - The command: call 43.
    - "rustc 1.97.1": call 6 (`state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md:187 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:4ad84f16acc2f3bdcfbc7b0788f1e74a4e649b962154a585b8f8d0b28eb0dd06`).
    - The three failing names, "exit 101, 0 passed, 3 failed": calls 47 and 48 (`state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md:735-744 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:0521ff25177384ee94e659b06486439b260ce5634f63bbad095c04d67447b542`).
    - "at the post-build existence assertion": each test panicked at `verify_bundle.rs:92:5` with that assertion's message (`state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md:754-755 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:3118b14010a56733e8c27e1cacd31659c847b8813b7d0d025a9751a646e82a2a`). Line 92 is the post-build assertion at T and at H, since H changes only mod.rs.
    - "reverted": call 49 shows a checkout and an empty porcelain.
    - Every clause matches. The form's prediction for the deps layout is observed. The prediction for the build-dir layout (the function's own panic) is not required by the line and was not observed.
  - **verify-mutation:** call 93 reports 0 new tests. The record does not call that run an observation of the mutation (round 25, item 2).
- **Out-of-scope, one clause at a time:**
  - ADR: none.
  - Security: none (test-only code, no exposure surface).
  - Wire: none (nothing under protocol/).
  - Guarantee: none.
  - No product code changes.
  - T1 to T3 keep every assertion: lines 226-341 at H have no hunk. They pass at H: calls 64 and 69.
  - The fail-loudly rule is kept by the unchanged post-build assertion, and the new panic also fails loudly (`kernel/tests/built_targets/mod.rs:34-39 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:76f134a22a273321bf955b901309a6dea2545e9d4b41950484d58c973ead1ff2`).
  - scale_pass's rows, ceilings and debug refusal: only the `mod` line (`kernel/tests/scale_pass.rs:36 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:d1fe6a5df895ccfa5b10f973bbf5433cac5b19b3dfd27b2e8f74d57346420ad8`) and the two helpers change.
  - No ADR-018, docs/08, undo-class, user-visible or dependency change.
  - All clauses hold.

## Check 2: the design against N2 (C), N4 and OPEN-7 (A)

- **The function:** it is the nearest-profile-ancestor walk (`ancestors().skip(1).find(...)`, mod.rs:31-33), with the profile name taken from `cfg!(debug_assertions)` (25-29).
- **Its place:** the new test-only module that N4 and OPEN-7 (A) name. Both files use it through `mod built_targets;` (verify_bundle.rs:19; scale_pass.rs:36). Both helpers in scale_pass are in scope, as OPEN-2 (A) settles.
- **Seams:** the `pub` items live in a test crate and are reachable by no product build. Their consumers are the existing tests, which run them, so the caller rule does not bite. The seam that matters is cargo's real directory layout. The test binary's place was read first, from the failing run's log (N1). The example's place on the new layout was not read first; it rests on the premise. The end-to-end proof from the real shape is T1 to T3 in the PR's CI, on both jobs.
- **Unverified premises, in the code and the record:**
  - **The example at `<profile>/examples/` on the build-dir layout:**
    - It does not appear as a claim in the commit messages (call 40) or in the `RECORDED MUTATION:` line, which is scoped to 1.97.1.
    - It does appear as fact in mod.rs's module doc and function doc, which is D1.
    - The code makes it fail loudly, not pass vacuously.
  - **The binaries at `<profile>/` on the new layout:** unexercised (N3). It appears only in D1's sentence.
  - **The `release` branch:** unexercised (N3), and no claim is made about it.
- **What the closing amendment must cite from CI,** by the Tests+mutation line and N3, as references only:
  - one run id, either 43407671188 (pull_request) or 43407245478 (push), at H;
  - the two job names;
  - head commit 5977712dd15d30b40cddb6d087f299275fc4f9df;
  - that run's logged rustc line, with the claim made for that rustc only;
  - in each job, the Run the ordinary suite step's success, and one Running line showing a test binary under `build/<package>/<hash>/out/`.
- **Preference, not a condition:** that Running line should be verify_bundle's own. The reviewer can also confirm from the log that the example was built in that run and not restored from a cache.

## Check 3: the words against the code at H

- **mod.rs module doc (6-10):**
  - The layout clauses about the test binary: true on the deps layout (call 39). On the build-dir layout they rest on the CI Running line.
  - The clause that the examples and binaries sit under `<profile>/` on both layouts: D1.
  - "nearest ancestor … not a fixed number of parents up": true (31-33).
  - "no test target": true (cargo auto-discovery; no `[[test]]` in `kernel/Cargo.toml`).
- **`profile_dir` doc:**
  - 14-15: D1.
  - 17-21: true, by check 1.
  - 23: true. The panic message carries `me.display()` (35-37). The `expect` on `current_exe` also panics; the sentence does not say "only".
- **`exe_name` doc (43):** true. `.exe` under `cfg!(windows)`, the bare name otherwise (44-50).
- **The other two test files:**
  - The diff changes no doc line in either.
  - The only `expect` lines it touches are the two-parent walk's, which it removes. Their `current_exe` expect moves unchanged into mod.rs:30.
  - The packet's section 6, item 5 and extract call 34 agree that no `deps` remains in either file.
- **kernel/README.md:**
  - Line 390 adds the form's path (`kernel/README.md:390 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:9046048d8827d3e17a0fdb5c535fadeef3196776e754601d99f4355b732ae828`). It resolves: I read that file on main, and the packet gives its sha256 at B.
  - Line 361 adds the clause "at 3fe9f97d" (`kernel/README.md:361 @ 5977712dd15d30b40cddb6d087f299275fc4f9df sha256:e2508163bff4e7685376167756afa78ee1538f64f26977702d72280108963436`). It is true: the one pointer the piece adds exists at B. It follows the pattern of the clauses before it.
  - The section's line count is unchanged, since two lines are replaced.

## Check 4: the constitution

- **docs/01:** no principle is touched. There is no CRS, data path, performance claim (docs/08), undo class (ADR-006) or user-visible behaviour.
- **ADRs:** none applies, as the form's Out-of-scope line says. ADR-010 and ADR-011 are not reached.
- **Licence header (ADR-009):** mod.rs lines 1-2 equal `kernel/tests/support/mod.rs:1-2 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:a9652090fe9cde28ac932c10be298d703b896fda8e91e6ab4ebb46a5b0ec46df` and the header of `verify_bundle.rs`. By my Grep, all 54 headed files in kernel/tests carry the same two lines.
- **What the piece owes:** no ADR note, no KNOWN-LIMITATIONS item and no Platform section. N7 holds: no OS-dependent product feature changes, the `.exe` handling is kept, and the workflow has no macOS entry.

## Check 5: anything on main made untrue

These are main's Greps for the two-parent walk, `<profile>/deps/<test>`, `deps/`, `beside_me` and `current_exe`:
- **kernel/README.md:** no hits. Nothing becomes untrue.
- **`governance/forms/kernel/SCALE-PASS-PREREGISTRATION.md`:** no hits on the walk or the layout. Its "beside" hits at 218, 513 and 568 are unrelated.
- **docs/ (docs/08 included):** no hits.
- **kernel/RESULTS.md, the scale pass's and other passes' records:**
  - Lines 644, 651, 1208, 1212, 2881, 3553 and 3969 give by-hand commands on `target/release/deps/<test>-<hash>.exe`. Example: `kernel/RESULTS.md:2881 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:9f4b3b93f1852f6bf5e054d236c38664e9ba5b6c0d17d1370c7efb72b1548cf3` (`pin-tree.mjs --binaries target/release/deps/cancel_rescore-*.exe`).
  - The piece does not make them untrue: it moves no test binary. They are records of past passes.
  - They stop applying on a toolchain with the build-dir layout. That is for the advisor (below).
- **The form's own N1 and N2:** they describe B's walk at pins @ 5007eaa1. Those are historical pins, and the pin is authoritative over the tree. They are not made untrue.
- **governance/PLAN.yaml:7108** (the node's own text): it describes main's failure and is not made untrue.

## Check 6: the departure's record (no finding)

- **Call 28:** a Write of `kernel/tests/built_targets/mod.rs` refused with the Guardian's message (`state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md:436 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:013970b055827f7281808e68aa262cc132bb4cea7b17163df933d5cb778e2e2e`). The message says the path "cannot be placed". It does not itself say that the folder was missing. Call 37's porcelain (`?? kernel/tests/built_targets/`) confirms the folder was new.
- **Call 29:** `mkdir -p` of that folder, `ok` (`state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md:439 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:dc01da0bd232d0e690fa97ff96164bf029d40cfdac59111187143c445cee823b`).
- **Call 30:** the same Write, with content identical to call 28 by reading, succeeds (`state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md:449 @ 2e4d5d0b28a072bb706e8d0d8373cd40651615c3 sha256:b81c9a9d9cfa29d1b02b04329f611a3e3b3b1c9acbaa67f0132159159e5c98cd`). The extract shows the success. It shows no Guardian output on an allowed call, so "checked and allowed" is inferred from the success.
- **After it:** call 31 goes on editing with no stop and no report.
- The calls show what the packet's section 6, item 1 says, with the one inference noted above.

## For the advisor

1. kernel/RESULTS.md's by-hand commands on `target/release/deps/…` (check 5) fail on the build-dir layout. They are input for the toolchain-pin consult, not this piece.
2. This report pins the piece's files at H, a branch commit, as the brief directs. Those pins resolve on main only once a merge commit keeps H reachable (round 15 (e); round 25, item 2 (d)'s pattern). The merge method is the advisor's call.

## Packet gaps

- The CI logs' rustc line and Running lines (the packet says the custodian has not read them). They are the reviewer's to read.
- Whether `kernel/Cargo.toml` declares test targets. I read it on main.
- The planned merge method (merge commit or squash), which decides whether f740eeef and H stay reachable.
