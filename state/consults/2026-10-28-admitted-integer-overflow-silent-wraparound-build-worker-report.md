*Custodian's filing note (2026-10-28): the worker-high's report on O1, `admitted-integer-overflow-silent-wraparound`, built under the full form and Amendments 1 to 4 on its branch in C:/dev/wt/o1-clang (the clang-cl target), M1 in C:/dev/wt/o1-msvc on its own target. The pinned test's five tests pass at the head; M2 to M4 observed; M1 on the MSVC build fails T-A, T-C and T-E as predicted and T-B as not predicted (the form's Amendment 5); 535 lines over §7's four files against 450, 536 with CLAUDE.md's one line (Amendment 6, class 8). The custodian's check: the branch head 49297300 and the numstat by git; the transcript shows 10 cargo calls, 0 outside a shared hold (by command text: none), 2 commits and 1 push(es). The run 10:20:30Z to 12:30:29Z by its transcript (Bash 176, Read 5, Write 7, Edit 5). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is bb985ae44c31daf28704e3cce4d48b501135c2e248ea4b82c2cde64cb0e78a27.*

---

Built: admitted-integer-overflow-silent-wraparound at 492973009fbc1aaf31fcb12f6c974a0574ff1b4e

Pushed: origin's branch cut/admitted-integer-overflow-silent-wraparound equals HEAD, by `git ls-remote` (492973009fbc1aaf31fcb12f6c974a0574ff1b4e). `git status --porcelain` in C:/dev/wt/o1-clang is empty. No PR action taken.

**Probe moved.** `engine/tests/o1_probe.rs` went to D:/wt-targets/o1-clang-data/o1_probe.rs.keep. Its sha256 there is c89d746fcc00ef4738b4a460f103d7a4c2d75ce1d5946151f16a1c6e7df4dd67, and it was never committed. The brief's sha256 (2f11ce87…) and the form's (ee4f7c8d…) were shown by command and match.

**Commits**
- Code, 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0: "feat: admitted-integer-overflow-silent-wraparound: the bundled DuckDB compiled with clang-cl on Windows, and the pinned test (form sections 2a, 2b, 4)". It touches:
  - `.cargo/config.toml`: unchanged, sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f.
  - `engine/Cargo.toml`: 7 comment lines above the `duckdb` dependency.
  - `engine/tests/admitted_integer_overflow.rs`.
  - `CONTRIBUTING.md`: 1 line.
  - `CLAUDE.md`: 1 line.
- Record, 492973009fbc1aaf31fcb12f6c974a0574ff1b4e: "docs: admitted-integer-overflow-silent-wraparound: the recorded mutations M1 to M4 beside the pinned tests (form section 4, Amendment 4)". It adds only `/// RECORDED MUTATION:` doc comments to the test file (26 lines), with no line cites.
- Both were made with `git commit -s -F`. Each message file had an `@` only on its first trailer line.

**The human's words**
- Everything inserted was assembled by my script (`o1c-assemble2.mjs`, in my scratch folder) from the filed directives and the form, not typed. The script asserts that each part is a substring of its source.
- Assembled build-of-record sentence in `engine/Cargo.toml` (sha256 b8f6b1d4bfafb10462f1b157b289da49356ee7ff8563b4f08aba67734fd9fb5d). The marker line sits above it as in the form.
  - The line-17 sentence of the resent directive.
  - The Amendment 2 clause, with the define read from the config.
  - W-2 in the architect's words, because port-2 is not merged: the workflow on main has no macOS entry, and the log shows port-2 "committed to its branch, not merged".
  - W-1's replacement words, since L1 completed at P0.
- OPEN-6 words in `CLAUDE.md` (sha256 fefa6ca8ef61fb5d165e115f956b524addf994520e37a798dadb60a43169bcfb), as a new line after the Environment line.
- The CONTRIBUTING sentence is the form's own words (sha256 37eff563441c0e90bed5f1352fe0ed3252552f06f6bb13c1a37298cbd82dd340).
  - The missing-tool failure it names was never observed (clang-cl was on PATH throughout), so it rests on the source reading. Lead-data's reading (§5 item 3) flags this.

**The pinned test at head against §3.** All five tests pass (rc 0). Each cell is run in both shapes, `all` and `view`.

| Test | §3 predicts | Head asserts and passes |
|---|---|---|
| T-A | W: A-ar-n, S-ar-n; F: B-ar-s; T-c-ar-n and T-c-ar-s; T-o and its mirror; T-m (Q1 only). P1/P2/Q1/Q2 end in the fixed detail, no batch. | 30 of 30 cells ok |
| T-B | E-ar-n and T-e-ar-n: P1/P2/P3/Q1/Q2/Q3 complete, equal to the i128 oracle (including 3037000499² and the i64::MIN product). | ok |
| T-C | No completed run differs from the oracle (all files, P1/P2/P3 and Q1/Q2/Q3). | ok, so P3 and T-c-ar-s Q3 either error or equal X |
| T-D | C1 `v * v` gives NotBoolean; C2 `v * 1.5 > 0` gives TypeNotAdmitted. | ok |
| T-E | L1 and L4 complete with the 2,048 ids; L2 completes with 0. | ok |

- Per-cell terminals at head are not printed, because a passing test prints nothing. M4's run shows all 30 T-A cells as errors at head.
- No cell outcome other than what §3 and §5 predict was seen at head.

**Suites**
- Head, hold pid 24308, cmd-rc 0: `cargo test -p spatial-engine --locked`. 49 result lines, 469 passed, 0 failed, 17 ignored. P0's 464 plus the 5 new tests is 469.
- The six named existing tests are `ok` at head.
- DuckDB was not rebuilt on the clang-cl target in any run: 0 "Compiling libduckdb" lines.

**Mutations M2 to M4**
Each was applied exactly as worded, run on the pinned test file at the code commit on the clang-cl target, reverted with `git checkout`, and the file's sha256 shown equal to HEAD's (stream.rs b1e2e146…8c9f5, predicate.rs 950cd7a9…f09f6).
- **M2** (`NOT (…)` in the composition): T-B fails at E-ar-n all [v * v > 0], completed with 1 id [0] against 5. T-C and T-E also fail, as wrong rows follow from the mutation (T-C: 16 runs wrong; T-E: B-ar-s all [4000000000 * 4000000000 > 0], 0 ids). T-A and T-D pass.
- **M3** (BOOLEAN check removed): T-D fails at C1, which was refused as TypeNotAdmitted rather than NotBoolean. Only T-D fails. Rustc also warned of an unused variable `inferred`.
- **M4** (`classify`'s out-of-range arm deleted): T-A fails, with 30 of 30 cells in DuckDB's own text. The first is A-ar-n all [v * v > 0]: "query: execute: Out of Range Error: Overflow in multiplication of INT64 (4000000000 * 4000000000)!". Only T-A fails.
- I read "fails elsewhere" as the named test failing at an unpredicted place. The extra tests failing under M2 are disclosed above, not treated as a stop.

**M1** (checkout C:/dev/wt/o1-msvc, detached at 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0, `.cargo/config.toml` deleted)
- The environment held no `CXX_*`, `CXXFLAGS_*`, `CC_*` or `CARGO*` variable. No config file exists in any ancestor or in the cargo home.
- Target D:/wt-targets/o1-msvc, new. The cold build finished in 34m 32s (cargo's own line, not a measurement).
- Compiler for the DuckDB units: all 352 are `cl.exe` (MSVC 14.44.35207), with no clang and no `DUCKDB_STATIC_BUILD`, read from the build script's saved `output` file. Archiver is `lib.exe`.
- cmd-rc 101. 1 passed (T-D) and 4 failed:
  - **T-A:** 28 of 30 cells did not end in the fixed detail. S-ar-n all [v * v > 0] completed with 2 ids, as predicted. Only T-m ended in the fixed detail.
  - **T-C:** 24 runs completed with a wrong id set, the first being A-ar-n all [v * v > 0], 1023 against 2047, as predicted.
  - **T-E:** fails at B-ar-s all [4000000000 * 4000000000 > 0], 0 ids against 2,048, as predicted.
  - **T-B (not predicted):** fails at T-e-ar-n all [a * b > 0], which ended in the fixed detail. The exact T-e file raises an overflow on MSVC, so the MSVC build appears to report false overflow on a product that fits. I did not find which row. The custodian may want this in the form.
- Every T-o terminal T-A printed (identical in both shapes and for the mirror):

| Cell | Terminal on MSVC |
|---|---|
| T-o-ar-n [a * b > 0] | completed with 1 id, first [0] (exact: ids 0 and 1) |
| T-o-ar-n [a * b < 0] | completed with 0 ids |
| T-o-mirror-ar-n [a * b > 0] | completed with 1 id, first [0] |
| T-o-mirror-ar-n [a * b < 0] | completed with 0 ids |

  So the one-sided hole is real on MSVC: Q1 wraps and delivers rows that exact arithmetic does not.
- The T-c cells also wrapped: [a * b > 0] completed with [0, 2] where exact is {0, 1}.
- The checkout and target are left for the custodian. The checkout's porcelain is ` D .cargo/config.toml`.

**Scope count** (`git diff --numstat origin/main...HEAD`)
- .cargo/config.toml 4, engine/Cargo.toml 7, engine/tests/admitted_integer_overflow.rs 523 (497 at the code commit, 26 of comments in the record commit), CONTRIBUTING.md 1, CLAUDE.md 1.
- Four files: 535 lines against §7's 450, an overrun of 85 (class 8). With CLAUDE.md, 536 over 5 files.
- The overrun is mostly rustfmt expansion of the test. I did not trim to fit it.

**Checks at head 49297300** (exit code, then last line)
- Pinned test, hold pid 4028: rc 0, "test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.39s".
- Engine suite, hold pid 24308: rc 0, 469 passed (above).
- `cargo fmt --all -- --check`: rc 0.
- `cargo clippy -p spatial-engine --locked --tests --no-deps`, hold pid 12952: rc 0, "Finished `dev` profile [unoptimized + debuginfo] target(s) in 41.55s". It printed 6 lib-test warnings and others in other files (rowgroup.rs, stream.rs, trace.rs, fixture_generation.rs, identity.rs, admission_property_campaign.rs and more). None is in a Scope file: 0 mentions of `admitted_integer_overflow`.
- `node scripts/plan/verify.mjs --offline`: rc 0, "verify:plan PASS — … PLAN.yaml agrees with the repository."
- `verify-cites.mjs`: rc 0, "verify:cites PASS — every rooted (in-tree) path:line reference across 2460 file(s) resolves. (75 loose reference(s) advised above.)"
- `verify-quotes.mjs`: rc 0, "verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 879 ruling cites resolved, 0 ruling-cite errors."
- `verify-test-claims.mjs`: rc 0, "verify:test-claims PASS — all 687 claimed test(s) across 210 file(s) exist or are planned, superseded or withdrawn (43 planned, 11 superseded, 17 withdrawn, advisory)."
- The four node checks ran at 49297300 before the push; the pinned test, suite, fmt and clippy ran after it.

**Imports** (`dumpbin /DEPENDENTS` on `admitted_integer_overflow-edb12c7ea8efeaee.exe`, clang-cl target, rc 0)
- kernel32.dll, bcryptprimitives.dll, api-ms-win-core-synch-l1-2-0.dll, KERNEL32.dll, WS2_32.dll, RstrtMgr.DLL, ntdll.dll, USERENV.dll, MSVCP140.dll, VCRUNTIME140.dll, VCRUNTIME140_1.dll.
- The api-ms-win-crt set: math, string, runtime, heap, environment, filesystem, convert, stdio, locale.
- No clang, compiler-rt or libc++ DLL. The only "clang" match is the target path.
- compiler-rt in the link: no sign of it, but the linker line itself was not seen (cargo hides it on success), as in P0.

**Stop rules and disclosures**
- No stop rule was met.
- Nothing from §8's block-on-sight list was in the diff: no workflow file, no `Cargo.lock` change, no `#[ignore]` or `cfg`, no weakened assertion.
- CONTRIBUTING's missing-tool claim was not observed (above).
- The M1 T-B failure on MSVC was not predicted.
- I made and removed an empty directory `x` in the main checkout (the shell's reset cwd) by a stray command. It is gone; the main checkout's porcelain is the two untracked files it started with.
- `git worktree add` wrote its metadata under the main repository's `.git`.
- The test file's `RECORDED MUTATION` comment lines are 101 to 102 columns, which rustfmt does not enforce.

**Holds (SpatialIDE only; the `also=` segments elided)**
All were shared, with cores 0-7 and affinity FF, and no exit code 96 to 99 appeared. The hold's bash pid is given in the table, followed by the command's rc.

| Command | Hold bash pid | rc |
|---|---|---|
| --no-run build | 35036 | 0 |
| pinned test | 25680 | 0 |
| suite | 44604 | 0 |
| M2 | 16728 | 101 (test failures, as expected) |
| M3 | 35160 | 101 (test failures, as expected) |
| M4 | 19320 | 101 (test failures, as expected) |
| M1 | 39196 | 101 (test failures, as expected) |
| pinned test at head | 4028 | 0 |
| suite at head | 24308 | 0 |
| clippy | 12952 | 0 |

**Processes.** A final scan found no cargo, rustc, clang-cl, cl.exe, link.exe or test process. Four `powershell.exe` consoles are running that I cannot attribute; every hold and release call of mine returned. I started no background process that is still running.

Model as the harness reports it: Sonnet 5.5, model ID claude-sonnet-5-5 (worker-high). No override and no context handoff.
