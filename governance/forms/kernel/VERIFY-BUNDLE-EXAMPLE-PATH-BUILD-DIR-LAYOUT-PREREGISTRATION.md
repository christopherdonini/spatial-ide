# kernel: the tests that run a built example find it under rustc 1.100.0's build-dir layout, verify_bundle (red on main's Rust CI since #309's merge) and scale_pass's two helpers, through one shared function — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node verify-bundle-example-path-build-dir-layout (S3), filler entry 15, placed ahead of every entry by the human's message of 2026-11-13 (06:43Z) (`state/directives/2026-11-13-advisor-session-from-advisor-live-human-clicks-until-then-publish-approval-answers-rust-ci-fix-filler-now-toolchain-consult.md`, item 8). The form, the notes, the OPEN items, what is not settled and the packet gaps are lead-data's draft (`state/consults/2026-11-12-verify-bundle-example-path-build-dir-layout-five-line-form-lead-data-draft.md`, read only at main 5007eaa1; its 47 pins filled by script at its filing), carried byte for byte with these changes, all the custodian's: this title and lead line added; the draft's opening lines (the filing note, its draft line and its read note) and its closing lines (its report path line, which gives no sha256, and its model line, claude-opus-5-5) dropped; its two pins into the root Cargo.toml written in the prose shape (`Cargo.toml:<lines>` at the commit, sha256 the hash), which the quote checker reads as unrooted, since a bare Cargo.toml matches 14 tracked paths; the custodian's settlement added. By the draft's read note, no text in it is a quotation unless it is marked byte-copied, and identifiers in backticks are names. Form path: `governance/forms/kernel/VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## The form

Form path, by the forms index (governance/README.md:23 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:1a043fffd97b3db90f07c55a43d498dbda72f522eca034adc375ab8ebd153978): `governance/forms/kernel/VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md`.

## The five lines

```
Authority: PLAN node `verify-bundle-example-path-build-dir-layout` (governance/PLAN.yaml:7093-7109 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:a06c2fb8a1bc190bbdc1526d51c7da5e07d5b7306f36766eaad397719278612a), placed by the custodian on 2026-11-12 and graded S3; its slot waits for the human's ruling (the node's needs_human, same lines). The finding is main's Product CI — Rust workspace run at 5560c7d5 on rustc 1.100.0, failing in both suite jobs, as the custodian read CI's logs for this form's brief. If it is placed in the filler slot, it runs under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84). Reuse index: two misses (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian for this form's brief). The search words, byte-copied from the brief's reuse output: "cargo test example binary path build-dir" and "test locate built example executable message-format json".
Scope: 4 files: kernel/tests/built_targets/mod.rs (new; a test-only module with no test target of its own); kernel/tests/verify_bundle.rs; kernel/tests/scale_pass.rs (OPEN-2); kernel/README.md (owner's index: this form added to the preregistration list, and the Last-verified bullet; OPEN-5). Declared line budget 120 by §21c's counting rule (governance/AUTONOMY.md:357 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); about 85 estimated (N5); this form is exempt. No product code, no Cargo.toml or Cargo.lock, no workflow file, no new dependency, no new item in the spatial-kernel library, and nothing under engine/, protocol/ or KNOWN-LIMITATIONS.md.
Change: the test helpers that locate a built target from the running test binary stop taking the profile directory as two parents up and take it instead, through one shared function in the new module, as the nearest ancestor of the test binary named for the build's profile (`debug`, or `release` when debug assertions are off). The helpers are verify_bundle.rs's `build_verifier` (kernel/tests/verify_bundle.rs:64-75 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:538f53e30d1f584e4076125f0e840ee2fbf57164b4bb0b0b9a6bb68ae6f89d9b) and scale_pass.rs's `binary_beside_me` and `example_beside_me` (kernel/tests/scale_pass.rs:1270-1304 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:fc5fa7f88bfc14a38c6dbceb65936071ede2bde647fef6d256d0daabbeb7a7b2). The path then holds both where test binaries sit in `<profile>/deps/` and where rustc 1.100.0's cargo puts them, under `<profile>/build/<package>/<hash>/out/`. These stay unchanged: the executable name, verify_bundle's build fallback, its release flag read from that directory's name, and every existence assertion.
Tests+mutation: no test is added, removed or renamed. T1 to T3 are unchanged and run the new path: kernel/tests/verify_bundle.rs::a_real_bundle_verifies, kernel/tests/verify_bundle.rs::every_corruption_class_is_caught_with_its_declared_state and kernel/tests/verify_bundle.rs::a_missing_or_unparseable_manifest_is_refused_by_name. M1: the profile name the shared function matches is replaced by `deps`. Predicted failure: T1 to T3 by name, on either layout. On the deps layout they fail at the post-build existence assertion (kernel/tests/verify_bundle.rs:98-103 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:b9fa28d2c2cd5d5122d78b5d507dc4ec0434d0bd6e7726239810a5ddd2e92693), because the derived path is under `deps/examples/`. On the build-dir layout they fail at the shared function's own panic, because no ancestor has that name. M1 is observed on this machine's rustc 1.97.1: apply it, run `cargo test -p spatial-kernel --test verify_bundle`, record the failures by name with the commit in a `RECORDED MUTATION:` doc line on the shared function, and revert. On the build-dir layout, the piece's observation is its PR's own Product CI — Rust workspace run at the head commit. In both jobs the step Run the ordinary suite succeeds at the rustc that run's toolchain step logs (1.100.0 expected; the action floats on stable), and one Running line per job shows a test binary under `build/<package>/<hash>/out/`. That run is recorded by run id, job, head commit, that Running line and the logged rustc line, and the claim is made for that rustc only (N3). scale_pass's tests stay `#[ignore]`d and are not run. The function their helpers now call is the one T1 to T3 run in both CI jobs (N4).
Out-of-scope: ADR: none (no status line, no amendment). Security: none (nothing ADR-020, ADR-009 or ADR-021 governs; no new exposure surface). Wire: none (nothing under protocol/; no message, field, code or literal). Guarantee: none. No product code changes. T1 to T3 keep every assertion and their outcomes. Verify_bundle's rule that a missing example fails loudly (kernel/tests/verify_bundle.rs:16-17 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:e7ea3ca6cfdbfaa6487d8e7c137cd83cced5ae69a88474722a5ed06fd6003025) is kept by the unchanged post-build assertion. scale_pass's rows, its ceilings and its refusal of a debug build are unchanged. No ADR-018 cancellation behaviour, docs/08 claim, undo class or user-visible behaviour changes, and there is no new dependency.
```

## Notes

**N1. What fails, by reading (no run)**
- **The walk.** `build_verifier` takes the profile directory as two parents up from the test binary (kernel/tests/verify_bundle.rs:65-69 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:dd603daf04c9e5abbc99b01c9c8bfc30e6c648c1d044419a41f4a9aa0a36caaa) and joins `examples/<exe>` to it (kernel/tests/verify_bundle.rs:75 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:c0ca2ed5fd6ea4ea739ca474e731f5cb494589d1a61b05316af3b28c11d8d940).
- **On the layout the brief reports,** two parents up from `.../build/spatial-kernel/<hash>/out/<test>` is the `<hash>` directory. That matches the derived path in the panic message the brief carries. The build step succeeded (kernel/tests/verify_bundle.rs:81-97 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:1ddfe149d89d0f8cc4abd51d415d89cb275c747791b4463f8bab4b250dd08850), and the assertion after it fired.
- **The release flag** reads the same directory's name (kernel/tests/verify_bundle.rs:80 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:f9cf336dfaf38894d8a1cc8b595fbbaab18b4b6409a7478104ce8095846a940a). On the new layout it is wrong too. Once the profile directory is found correctly it is right again, without being edited.
- **scale_pass.rs has the same two-parent walk twice.** `binary_beside_me` (kernel/tests/scale_pass.rs:1270-1284 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:76f7af9444600efa40ae875a45cdb09a69683eee30ae6a40cc17c4e286228442) is called for `publish-bundle` (kernel/tests/scale_pass.rs:1137 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:6c463d0e9378cf907b43e60f87aa5af96a78b290ee12ee22da815382565f2e1c). `example_beside_me` (kernel/tests/scale_pass.rs:1286-1304 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:2610296703b902f15894e0cb3dd3824aa279ab3de9ea0aec8e3c53ed516aa604) is called for `verify-bundle` (kernel/tests/scale_pass.rs:1181 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:b1d5a22b787e959890428354755cfca9d77b703fe91cee29452bee2746eef2e2). The node names only the second. The first fails the same way, and earlier in the pass.
- **No other `current_exe()` user in kernel/ or engine/ walks up.** I read each call site. The six others re-run their own binary or hash it: project_save_crash.rs, session_history_crash.rs, redaction_hostname_off_windows.rs, query_window_attribution.rs, first_batch_factorial.rs and import_layout_factorial.rs. No test in engine/ uses `current_exe()`.

**N2. The design options (settles item 2)**

**(A) Take the path from cargo's own JSON report.** Run `cargo build --message-format=json` and use the `executable` field of the `compiler-artifact` message whose target is the `verify-bundle` example.
- **Layouts:** holds on both by construction, since cargo reports the file it wrote. This rests on my reading of cargo's message format, which I cannot open here.
- **Operating systems:** holds on both; the reported path carries `.exe` on Windows.
- **Dependency:** needs a JSON parse. `serde_json` is already a normal dependency of spatial-kernel (kernel/Cargo.toml:31 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:6ffce8c6673dc84a04eca89270c26d82bf4d91feda19ab482cb4ff6e5f865110) and integration tests can use it, so no new package enters. Any other JSON or cargo-metadata crate would be a new dependency and a red line. None is proposed.
- **Costs:**
  - It spawns a nested cargo once per process every time. Today that happens only when the example is absent. The OnceLock keeps it to once per process (kernel/tests/verify_bundle.rs:56-62 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:fedfdf5ae915ecc55d0c2148b6df835003bf37bef4f21f1feec4f6fc05b9327f). The 5560c7d5 run shows a nested build succeeds on 1.100.0, because it reached the assertion after the build.
  - About 70 lines for verify_bundle alone.
  - It cannot serve scale_pass, which must not build mid-pass. The pass's tree is pinned before the build (governance/forms/kernel/SCALE-PASS-PREREGISTRATION.md:13 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:9db0db568fd9c5e13530c4653e721e659384a3d78886d0541ceed544e3e344ef). A cargo build of this package relinks its release binaries (kernel/tests/import_layout_factorial.rs:1443-1445 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:6890fef35e546b88141710e5ef71a1301675f9dc12fa17a3a9c848012504566c).
  - So scale_pass would still need a walk, and that walk would run nowhere except the by-hand pass.

**(B) A variable cargo sets for integration tests.** Rejected.
- `CARGO_BIN_EXE_<name>` exists for bins only. That is why the test walks at all (kernel/tests/verify_bundle.rs:14-15 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:89cff996b73ca94cf69786239999b6ca524f253c11b509ff18e5e2fa18c75589).
- `CARGO_TARGET_TMPDIR` names a scratch directory. Deriving the profile directory from it is another layout assumption, and I cannot tell from this packet whether it sits in the build directory or the artifact directory under 1.100.0.
- For `publish-bundle` alone, `CARGO_BIN_EXE_publish-bundle` does not depend on the layout and is already used at kernel/tests/publish_cli.rs:162 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:f62f2c07eb0db9992a97e89ee46d9c162404ac00ad921a78b31c81ce3f87d925. But scale_pass's doc records a reason for deriving instead (kernel/tests/scale_pass.rs:1265-1269 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:b67ccb06387fc45724b9cfb256326956a44571aa955b807dd5f598251d3040a8). That is OPEN-2 (C).

**(C) The nearest ancestor named for the profile, shared by both files.** Recommended.
- **Old layout (1.97.1 here, 1.99.1 by the brief):** gives the same directory as today. The ancestor of `<profile>/deps/<test>` is `<profile>`.
- **1.100.0:** holds if cargo still puts the uplifted example at `<profile>/examples/`. The thing that moved is the test binary, an intermediate that is never uplifted. The example is a final artifact. By my reading of cargo's split between the two, it stays; I have not verified this. The brief's log shows where the test binary is, not where the example is.
- **Operating systems:** holds on both; the directory names are the same and the `.exe` handling is kept.
- **Dependency:** none.
- **What it buys:**
  - It serves scale_pass without building anything.
  - T1 to T3 run the very function scale_pass calls in both CI jobs, which is item 4's check.
- **Size:** about 85 lines.
- **If its premise is wrong,** it fails loudly at the post-build assertion and never passes vacuously.
- **The profile name** comes from `cfg!(debug_assertions)`, as the existing debug refusal does (kernel/tests/support/mod.rs:344 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:02ebd2530f0db056f85bcabde624f516ea64f425abfe19efdea7e16fdc038b38). The workspace's release profile sets debug info only, with no debug-assertions override (`Cargo.toml:49-51` at 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5, sha256 e2b7b15c29f396eb50cb4f81e388eb54d09e99510c37f26772c9915b79a6f608).

**(D) Pin CI's toolchain.** Not proposed. It hides the defect rather than fixing it. The workflow (.github/workflows/product-ci-rust.yml:205 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:9858e384d6b5f79c5707271f8309a0315845dd5f5317bdbdc311d836d673e641) is outside engine/ and kernel/, and a toolchain pin is the custodian's to raise.

**Recommendation:** (C). If the PR's CI shows (C)'s path absent on 1.100.0, (A) is the fallback (OPEN-3).

**N3. Evidence (settles item 3)**
- **What runs locally,** on rustc 1.97.1, the deps layout:
  1. T1 to T3 in isolation with the built example deleted first. This runs the build fallback and the post-build assertion.
  2. T1 to T3 again with the example present.
  3. M1, observed as the Tests+mutation line says.
  4. `cargo build --workspace --tests --locked`, which compiles scale_pass with its changed helpers, as CI's build step does (.github/workflows/product-ci-rust.yml:221-223 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:28d4027dbcd221a067f2678af513b8c3182424ee36dfdf62c69a48526b82051f).
  5. The ordinary suite, `cargo test --workspace --locked`.
  6. `cargo test --workspace --locked -- --list --ignored`, whose scale_pass entries are unchanged.
- **What only the PR's CI shows:** the build-dir layout. In both jobs, Run the ordinary suite (.github/workflows/product-ci-rust.yml:233-234 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:b583ae49475deb6fd0c6a7b2d4ee8a35323f6b6f814b70b68e8b908491ceed3c) succeeds, so T1 to T3 pass and the 8 binaries after verify_bundle run.
- **Does that CI run count as the piece's observation?** Yes, for the 1.100.0 claim. It is a run of the piece's own head commit on the layout in question, and no local run can produce it.
  - The form says so in its Tests+mutation line.
  - The closing amendment cites it by references only: run id, job names, head commit, the logged rustc line, and one Running line per job showing `build/<package>/<hash>/out/`. That Running line is what shows the new layout was actually exercised, since the toolchain floats.
  - Local runs are the observation of record for 1.97.1 and for M1.
- **What no run of this piece exercises:**
  - The `release` branch of the shared function. CI runs debug, and a local release build is the vendored DuckDB release build that `Cargo.toml:53-55` at 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5, sha256 99c9840e06e33472c4d1d1a1a273c4c39664712dfae551f218619831cee42dbc warns about.
  - The `<profile>/<bin>` placement of `publish-bundle` on the new layout.
  - Both are first exercised at scale_pass's next by-hand run, and both fail loudly there if wrong.

**N4. scale_pass in scope (settles item 4)**
- **Recommendation:** in scope, both helpers.
- **Reason:**
  - It is the same defect in the same shape.
  - The node names it.
  - The pass refuses debug and runs by hand in release for the better part of an hour (kernel/tests/scale_pass.rs:7-11 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:89c0ef435cdd9afcdd457bc93233388b5d0e3537463380fe8a8217be8b64557b). Discovering a path defect partway through it is the costliest place to find one.
- **How it is checked without the 5 GB run:**
  - Its two helpers keep their own existence assertions and their own exe-name logic. They lose only their walk, which becomes a call to the shared function.
  - T1 to T3 run that shared function on both CI jobs at 1.100.0.
  - Both CI jobs and the local build compile scale_pass.
- **The shared function lives in a new `kernel/tests/built_targets/mod.rs`,** not in `kernel/tests/support/mod.rs`. Support's doc scopes it to measurement instruments that measure the machine (kernel/tests/support/mod.rs:4-5 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:775dc55729d71fe02b387e06b44bc1fc7fba9e7d7197d09876d031ea348d529c, kernel/tests/support/mod.rs:21-22 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:6d8deac11494927d8647c53994c57e59e851bde53b52d5bc3696b6d7075e2fc7). Two byte-identical copies could drift apart.

**N5. Size against §21c (the bound: governance/AUTONOMY.md:350-351 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333)**
- **Estimate, insertions plus deletions:**
  - built_targets/mod.rs: about 30 (licence header, module doc, the profile-directory function, the exe-name function);
  - verify_bundle.rs: about 22 (`mod` line; the walk and exe-name lines replaced by calls; doc lines that name `<profile>/deps/`; the M1 doc line);
  - scale_pass.rs: about 27 (`mod` line; two walks and two exe-name blocks replaced by calls; the `expect` messages that name `deps`);
  - kernel/README.md: 4.
- **Total:** about 83 lines over 4 files. The declared budget of 120 leaves room for a rustfmt reflow.
- **Under (A) for verify_bundle plus (C) for scale_pass,** it is about 125 lines, and the budget would need raising to 150.

**N6. The gate and the budget (settles item 5)**
- **If it runs in the filler slot, as the node proposes:** §36 applies, with the reviewer and the architect from dispatch and §25 (e) set aside (governance/AUTONOMY.md:692 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84).
- **If the human places it in slot 1 or 2 instead:** §21b allows a single reviewer (governance/AUTONOMY.md:336-343 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:0d9e55c933bc9d5d076596899b10998c0f2d1bb4616347a95a55e6758268ef17). The piece is tests only, under §21c, and touches no §21a category.
- The placement is the human's (OPEN-6).
- **Budget:** the PLAN's 60 minutes (governance/PLAN.yaml:7104 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:9269a017dd1abf63dbe1f02f7fdc96be80b9d19e3258dccef5a0189a31e4a514) holds for the worker. It rests on about 83 lines, all in tests, one mutation, and a warm local target.
- **Outside that budget:**
  - CI wall time. If main's 1.100.0 runs saved no cache, the PR pays a cold build, recorded at 41 minutes (.github/workflows/product-ci-rust.yml:102 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:3a4839156ce9e27e7847298221eaaa201090efa555284a8a8e18fedcabebe344).
  - The two gates.

**N7. Platform (docs/PREREGISTRATION-TEMPLATE.md:177 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:6f5f5efc2cfb92e6b7c14bd23f0087adbb53769df674affdb4c1a2e2819a33b0)**
- **No Platform section is owed.** The piece adds or changes no OS-dependent product feature.
- **Windows and Linux:** T1 to T3 run on both entries of this workflow (.github/workflows/product-ci-rust.yml:194-197 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:d06209e30a3082d5514bd9d4b3873a329f21324eab4e0c444d370e1c2c377e27). The `.exe` handling is unchanged.
- **macOS:** this workflow has no macOS entry at 5007eaa1. Nothing is deferred, and no KNOWN-LIMITATIONS item is owed.

**N8. Noted for the custodian, not proposed**
- **One failing binary hides the rest.** Run the ordinary suite has no `--no-fail-fast` (.github/workflows/product-ci-rust.yml:234 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:a9a5f7dfd80682cf7c1f55f66873911fb936d9a5379c813aa09d8e36cd73e74a), so one failing binary hides every binary after it. That is how 8 binaries went unrun on main. The workflow is outside engine/ and kernel/.
- **The owner's index cites pre-move paths.** It lists preregistrations at paths from before the forms moved, for example `kernel/SCALE-PASS-PREREGISTRATION.md` in kernel/README.md:391 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:25607ee2f66f8ebcd716e7a0a7c65aed9d59ff5c279e537bbec48c482d7633b1, which governance/MOVED.tsv:124 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:f62307e43f5edd410e6aeb7ded68307150006d639796d7b0d5b6b09f7ee451d2 maps to governance/forms/kernel/. They resolve through the move map. This piece does not change them.
- **Rule (00) overlap.** This piece's paths are the four Scope files. Another S3 kernel test node placed the same day (governance/PLAN.yaml:7091 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:f67a1e484582ab37fc0aa116971d19c6b601756972d5cf8367b0729f16041357) may also touch kernel/README.md.

## OPEN items

None is a red line. No new dependency, no contract change and no altered guarantee is proposed.

- **OPEN-1. The design.** Recommendation: (C).
  - (C) The shared nearest-profile-ancestor walk (N2).
  - (A) Cargo's JSON report for verify_bundle, plus (C) for scale_pass. That is about 125 lines, and scale_pass's walk is then exercised by no CI run.
  - (A) alone, with scale_pass left as it is.
- **OPEN-2. scale_pass in scope.** Recommendation: (A).
  - (A) Both helpers through the shared function (N4).
  - (B) `example_beside_me` only, as the node names it. `binary_beside_me` then still fails first, at kernel/tests/scale_pass.rs:1137 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:6c463d0e9378cf907b43e60f87aa5af96a78b290ee12ee22da815382565f2e1c.
  - (C) `binary_beside_me` moved to `CARGO_BIN_EXE_publish-bundle`. This reverses the reason its doc records, and that reversal is the custodian's to decide.
  - (D) Out of scope, with a follow-up node.
- **OPEN-3. If the PR's CI shows (C)'s path absent on 1.100.0.** Recommendation: (A).
  - (A) The piece stops. Before any further code, an amendment records the newly found fact and moves verify_bundle to cargo's JSON report, and scale_pass's walk is re-decided in the same amendment.
  - (B) Re-draft as a new form.
- **OPEN-4. If the PR's CI shows another of the 8 previously unrun binaries failing on 1.100.0.** Recommendation: (A).
  - (A) Out of scope: a new node for it. This piece's claim (verify_bundle passes and the suite runs past it) is recorded as met, and the human decides whether to click with that check red.
  - (B) Widen this piece. That breaks the S3 placement and needs the human.
- **OPEN-5. kernel/README.md in Scope.** Recommendation: (A).
  - (A) Include it: this form added to the preregistration list (kernel/README.md:390 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:55647c24b12ae4c7947a83a47267a6e5535cb88ec8432cf3a10a6e2900c0d4c6), and the Last-verified bullet (kernel/README.md:361 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:cb9d62bca9c57af647b3b07b1a392d828db7d855196d821699f9345f74bb9379). No pointer's target changes. The verifier row's pinned test is unchanged (kernel/README.md:379 @ 5007eaa1856b9ed2ebfc6e6f2e6c80acccfa04a5 sha256:5d527cb6107246ad27ff57c5042c07275b4a55c59ea557fec65a4bf36e6b7ac9).
  - (B) Omit it, saving 4 lines.
- **OPEN-6. The gate.** This is the human's placement. Recommendation: (A).
  - (A) The filler slot under §36, with the reviewer and the architect from dispatch, as the node proposes.
  - (B) Slot 1 or 2, with a single reviewer under §21b.
- **OPEN-7. Where the shared function lives.** Recommendation: (A), for N4's reason.
  - (A) A new kernel/tests/built_targets/mod.rs.
  - (B) Added to kernel/tests/support/mod.rs.
  - (C) Two byte-identical copies, with the reviewer comparing bytes.

## What is not settled

- Where cargo puts the uplifted example and bins under 1.100.0. (C) rests on my reading; the PR's CI settles it, and OPEN-3 covers the miss.
- The `release` arm of the shared function. It is not run by this piece (N3).
- Whether any of the 8 previously unrun binaries fails on 1.100.0 (OPEN-4).

## Packet gaps

- Where the verify-bundle example actually lands in the failing 1.100.0 run. The log gives the test binary's location and the derived path, not the example's.
- Cargo's own documentation of the build-dir layout and of the `compiler-artifact` message's `executable` field. I could not read either here.
- Whether main's 1.100.0 runs saved a rust-cache, which decides whether the PR pays a cold build.
- Whether Product CI — Rust workspace is a required check for merge (OPEN-4).
- How long the ordinary suite takes locally on this machine (N6's budget).
- The paths of pieces in flight and PRs awaiting the click, for rule (00).
- Whether a scale pass re-run is planned (OPEN-2's urgency).

## The custodian's settlement (class 1, before any code)

- **The placement and the gate: OPEN-6 (A).** The human placed this node in their message of 2026-11-13 (06:43Z) (`state/directives/2026-11-13-advisor-session-from-advisor-live-human-clicks-until-then-publish-approval-answers-rust-ci-fix-filler-now-toolchain-consult.md`, line 33), byte-copied: "verify-bundle-example-path-build-dir-layout takes the filler slot now, ahead of every entry." The same line, byte-copied: "From now on a red CI on main that is not GitHub's outage is fixed first: its fix takes the filler slot at once, and you tell me after." So the piece runs in the filler slot under AUTONOMY.md §36, with the reviewer and the architect from dispatch, as filler entry 15 ahead of every queued entry. That is OPEN-6 (A). The Authority line's clause that its slot waits for the human's ruling is settled by that line; the five lines are carried as the draft wrote them.
- **OPEN-1 (C), OPEN-2 (A), OPEN-3 (A), OPEN-4 (A), OPEN-5 (A) and OPEN-7 (A)**, each the draft's recommendation and none a red line, taken on 2026-11-13 at this form's commit under the human's direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held to 2026-11-16 by the human's message of 2026-11-09 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`, line 9). The message of 2026-11-13, item 2 (a), puts the advisor's answer in that place from the human's message "advisor live", which the human has not typed at this commit.
- **The toolchain.** The same line asks for a read-only architect consult on pinning the Rust toolchain that CI installs, and says, byte-copied: "Nothing about the toolchain changes until I answer." This piece changes no workflow file and no toolchain (its Scope line), and the draft's option (D) is not proposed. The consult runs beside this piece and changes nothing.
- **OPEN-4 (A) at the click.** If the PR's own CI shows another of the 8 binaries failing, this piece's claim is recorded as met, a new node is placed for that failure, and whether this PR merges with that check red is the human's word.
- **The read commit and main.** At main 376f6498, `git diff --name-only 5007eaa1 376f6498` over kernel/, .github/, the root Cargo.toml, governance/AUTONOMY.md, governance/README.md, governance/MOVED.tsv and docs/PREREGISTRATION-TEMPLATE.md lists none. The custodian's script re-computed the carried body's 47 pins at their commit, 5007eaa1: all equal. governance/PLAN.yaml has changed by the custodian's records since; its pins keep the read commit's lines.
- **The local toolchain** at this commit, by `rustc --version`: rustc 1.97.1 (8bab26f4f 2026-07-14). M1 is observed on it.
- **Rule (00)** at main 376f6498, by `git diff --name-only origin/main...<branch>` against the four Scope files and protocol/ for every branch on origin ahead of main: none touches the four files. One touches protocol/: `cut/b1-close-nul-names`, stale, with no piece in flight. PR B (`cut/b1-shell-half-pr-b`), #312 (`cut/known-limitations-first-look-partial-view`) and port-2 (`cut/port-2-macos-l1-and-app-dirs`) touch none of them. Filler entry 14, which may also touch kernel/README.md, is queued, not in flight. It is checked again at dispatch.
- **The route:** filler entry 15, the slot's one in flight, with the slot idle at this commit; a five-line form within §21c's size (a declared budget of 120 lines over 4 files); the reviewer and the architect from dispatch (§36). Every cargo call runs inside a shared hold. By the same line, the human is told after, in the custodian's closing message.
- **The PLAN node:** its gate names this form; its title and summary record the placement.

## Amendments (opens empty; append-only)
