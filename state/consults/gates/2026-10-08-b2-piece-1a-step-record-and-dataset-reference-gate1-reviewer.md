# PR #190 gate 1 — reviewer
Reviewed: cut/b2-piece-1a-step-record-and-dataset-reference @ a3f9f34f58d285cbcb20853f10f93df5591b514d

**Verdict: FAIL.** One blocking finding, C1. It is both a Correctness and an Evidence finding. Everything else I checked holds:
- the code, the seams, the mutations and the hashes;
- the ADR equality and the count;
- the local suites.

There are three Documentation findings, which must be fixed before the merge, and some suggestions.

## Correctness / Evidence (blocking)

**C1. The shell's lock file is missing the `getrandom` edge, so the shell's CI is red at the reviewed commit.**
- **Cause.** `frontends/shell/src-tauri/Cargo.lock` is a second tracked lock that locks `spatial-kernel` by path. The branch adds `getrandom = "0.3"` to the kernel (line 34 of `kernel/Cargo.toml` at a3f9f34f) but does not add the matching edge to that lock.
- **CI.** `gh pr checks 190` shows four jobs failing on both a3f9f34f runs (push and pull_request), with `error: cannot update the lock file ...frontends\shell\src-tauri\Cargo.lock because --locked was passed`:
  - "typecheck · build · vitest · cargo test", twice;
  - "tauri build (NSIS…)", twice.
- **Main is green.** Main's "Product CI — shell" passed at 1ca0af4c, the merge base.
- **Since when.** The same job has failed on the branch since 1e637d55, the commit that added the dependency, and again at 1251fc3c and 479ae81d. Neither worker report nor Amendment 4 records it.
- **Reproduced locally:** `cargo metadata --format-version 1 --locked --offline --manifest-path frontends/shell/src-tauri/Cargo.toml` exits 101.
- **The fix, probed:** running the same command without `--locked` writes exactly one line, `+ "getrandom 0.3.4",`, in `spatial-kernel`'s dependency list. There is no new package and no version change, because 0.3.4 is already locked there. I restored the file at once.
- **Why the fix needs the human first:**
  - It edits a file under `frontends/`. The form's §5 declares `frontends/` unchanged, and §8 item 9 blocks any frontend file.
  - It is a second lock change. Round 70's OPEN-5 ruling (`state/directives/2026-10-08-round-70-rulings.md:42-46`) allows only the one edge, and says "If it shows anything else, stop and tell me."
  - So it goes to the human first. It then needs a class 9 amendment that declares the scope addition before the edit (round 25, item 2).
- **§9 unmet.** §9 requires "CI green at the reviewed commit", and it is not.

## Documentation (must fix before the merge; not blocking)

**D1. The module header overstates what is held.** Lines 17–18 of `kernel/src/dataset_ref.rs` at a3f9f34f say no "path of any kind" is held.
- `parse` accepts a project-relative locator and holds its path (R5 proves it).
- Read under the bullet's own heading ("Nothing session-scoped is held"), the claim is true. That is why I class it as Documentation, not as an unsupported guarantee.
- Reword it to "no absolute path".

**D2. The `Locator::ProjectRelative` doc comment is stale.** Lines 125–126 of `kernel/src/dataset_ref.rs` at a3f9f34f say the path is "neither built nor interpreted here". Since Amendment 2, `parse` checks its grammar (`stays_inside_the_project_folder`).

**D3. The PR body's size line pairs the count with the wrong head.** It reads "1,930 lines over 10 files" next to "Base B: c01f2e09 … Head: a3f9f34f".
- §7's command run at a3f9f34f against c01f2e09 gives 2,218 lines over 19 files, because the merge brings in main's changes.
- 1,930 over 10 holds at 479ae81d against c01f2e09, and at a3f9f34f against the merge base 1ca0af4c.
- Name the head, or the base, that the figure was counted at. Amendment 4 item 8 already names 479ae81d and is correct.

## Suggestions (not findings)

- **S1. `DatasetUri::mint` panics if the OS random source fails.** It calls `.expect("OS CSPRNG unavailable")` on a fallible call (line 92 of `kernel/src/dataset_ref.rs` at a3f9f34f). That is reviewer checklist item 1 (no unwrap on a fallible path).
  - It matches the shipped precedent, `protocol/skp/src/v0/handles.rs:19`, byte-copied: `    getrandom::fill(&mut bytes).expect("OS CSPRNG unavailable");`
  - `protocol/data-plane/src/session.rs:137-138` maps the error instead.
  - It has no product caller in 1a. Decide whether `mint` returns a `Result` before 1b adds the first caller.
- **S2. The writer can produce a value its own reader refuses.**
  - `to_json` writes `byte_size` and `footer_length` as `Json::UInt` with no cap.
  - `parse` refuses anything above 2^53 − 1.
  - ADR-036 §2 says such integers are written as decimal strings.
  - It cannot happen in practice (it would take an 8 PiB file). It is 1c's format question.
- **S3. O3's comment says more than the test checks.** It says offset 260 is "inside the first data page"; the test only asserts that the offset falls before the footer. The outcome holds either way. Reword the comment or assert the page layout.

## Nits

- G1's `use` items are appended in the middle of `no_generation_in_persisted_artifacts.rs`.
- The product code matches `_ => None` rather than naming the identity source's file variant, only to keep K5's `File` token clean. It is recorded as class 3.

## Checks that hold

- **Diff** (`origin/main...origin/cut/…`): 12 files. That is §7's 10, plus `docs/README.md` and `Cargo.lock`. `protocol/` and `frontends/` are empty.
  - Existing tests are untouched: the descriptor tests' hunks end before the test module, and `publish.rs`, `verify_bundle.rs`, `engine/src/lib.rs` and `engine/src/dataset.rs` are unchanged.
  - The only change to `no_generation_in_persisted_artifacts.rs`'s existing text is the header family K-2 allows.
- **Lock diff** (`git diff c01f2e09 a3f9f34f -- Cargo.lock`): exactly one added line, `+ "getrandom 0.3.4",`, in `spatial-kernel`'s list. The requirement matches `protocol/skp/Cargo.toml:15` and `protocol/data-plane/Cargo.toml:17`.
- **§7 count:**
  - at 479ae81d against c01f2e09: 1,930 over 10 files;
  - at a3f9f34f against 1ca0af4c: also 1,930 over 10;
  - per file: descriptor 154, source_observation 238, dataset_ref.rs 818, lib.rs 1, Cargo.toml 3, kernel tests 408 + 117, ADR 174, READMEs 6 + 11;
  - this matches Amendment 4 item 8: kernel product 822 against 760 and kernel tests 525 against 520 are recorded as class 8, and §7 is not edited;
  - the merge of main adds no line to these files (the diff from 479ae81d to a3f9f34f over them is empty).
- **ADR-036 equality, by an independent script.** How I built the expected text:
  - I took §2.3's text between the markers in the form at a3f9f34f (12,284 bytes).
  - From Amendment 1, I applied (a) the `at` row, (b) the second sentence of "How it is written" and the new line in §11's list after the "(1b)" items, and (c) the tree line, plus the OPEN block and one blank line before "Nothing else in the folder".
  - From Amendment 2, I applied item 1 (§4's last bullet), item 2 (after "After a crash"), and item 4 (the project-relative bullet and the second sentence of the Consequences bullet).
  - Each fenced ADR block is taken from the form and de-indented by its fence's indent. Each anchor had to match exactly once.
  - Result: 14,091 bytes, sha256 7663c9b8050fb10c2819edfd4e4312d4eb48f88aa4ef12cee4eebe421959f3e8, equal to the filed ADR byte for byte. Status is Proposed.
- **Hashes, all recomputed and matching:**
  - The form's nine code pins at aa00e565, and again at c01f2e09: descriptor.rs 58-83, 269-288 and 97-102; dataset.rs 603-606 and 658-671; crs.rs 229-243 and 114-123; identity.rs 33-41; commands.rs 20-38.
  - `2026-10-06-machine-script-adopted.md:12-22` and `2026-10-05-product-first-direction.md:15`, both at 0053ced0.
  - Amendment 1: the round-69 rulings' lines 6-9 and 10-20, at their adding commit 45e7a0b0.
  - Amendment 2: the round-70 rulings' lines 8-14, 16-20, 22-26 and 28-33, at ab0469f4.
  - Report 1 from line 5: dab0e1e4…c58331 at 5576a426.
  - Report 2 from line 5: 8630f802…6ca9b at 1ca0af4c.
  - Both reports' "as written" hashes (report 1's d6c7419f…79ee2 and report 2's 8630f802…6ca9b): I recomputed them from the SubagentHandback messages in the worker's own transcript, with one final newline.
  - All of these adding commits are on main.
- **Index lines:** they match §2.8 item by item. The engine index is 33 lines and the kernel index is 39 (each at most 60). Every pointer resolves.
- **Seams:**
  - Engine to kernel: `linked` calls `descriptor().observation()`, `crs()` and `identity().source()`, which are real accessors.
  - Kernel to wire: `Admission` holds the wire's own `CrsAssertion` and `IdentityDeclaration`.
  - K2 proves both end to end through `SkpHost::open_dataset`.
  - Round 8's exemption: the PR body and the PLAN node both name 1b and 1c. No `pub` item goes beyond §2.4's list.

## Commands (all under `CARGO_TARGET_DIR=D:/wt-targets/1a`; every held call ran `CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8`)

| # | Command | Held | Exit | Result |
|---|---|---|---|---|
| 1 | `cargo fmt --all -- --check` | no | 0 | |
| 2 | `node scripts/adrIndex.mjs --check` (in frontends/shell) | no | 0 | PASS, 34 ADRs |
| 3 | `verify.mjs`, `queue.mjs --check`, `site.mjs --check`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` | no | 0 each | |
| 4 | the machine script's `status` | no | 0 | quiet |
| 5 | `cargo test --workspace --locked --features spatial-engine/fixture --lib --test source_observation --test dataset_ref --test no_generation_in_persisted_artifacts` | yes | 0 | every new test passed |
| 6 | `cargo test --workspace --locked --features spatial-engine/fixture` (first attempt) | yes | killed | **Void, not a result.** I dry-ran the mutation script on the tree while it compiled, so I stopped my own cargo by its PID (23792, with its tree). The hold was released. |
| 7 | the same command, re-run on a clean tree | yes | 0 | 101 binaries: 921 passed, 0 failed, 54 ignored |
| 8 | `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture` | yes | 0 | 73 warning lines, 44 with a location, none in a changed file; kernel/src/lib.rs warnings are at 398 and 473, the added line is 63 |
| 9 | `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | yes | 0 | 450 of 450 |
| 10 | 17 mutation runs (table below) | yes, each | 101 each | |
| 11 | the run in row 5 again, after all reverts | yes | 0 | |
| 12 | `cargo metadata … --locked --offline` on src-tauri | no | 101 | the C1 failure |
| 13 | the same without `--locked`, to probe the fix | no | 0 | one line written; restored with `git checkout` |
| 14 | `gh pr checks 190` | no | 1 | four failing, every other line pass; printed whole |

No hold was refused, and no exit code 96 to 99 occurred. No failure was timing-sensitive.

## Mutations (made again by me on a3f9f34f, each run alone by name, workspace form)

These are my own runs, not `verify-mutation`. Each failure agrees with the recorded note in its test's doc comment.

| Row | Mutation | Failing assertion | Reverted |
|---|---|---|---|
| O1 | `observation()` sets `footer_hash: None` | the footer-hash `assert_eq` (source_observation.rs line 101): left None, right Some(sha) | yes |
| O2 | `SourceObservation::components_differing_from` uses an inline rule that leaves out the footer hash | line 140: left ["size","mtime","footer-length"], right adds "footer-hash" | yes |
| O3 | `observation()` sets `modified_nanos: None` | "the declared limit: no component is named for this edit" | yes |
| O4 | the shared rule counts a footer hash present on one side only | "a footer hash that was never taken is not a changed component" | yes |
| R1 | the parser sets `identity: None` | the round-trip `assert_eq`: the reparsed text has `"identity":null` | yes |
| R2 | the unknown-key check is disabled | `unwrap_err()` on an Ok value, first case | yes |
| R3 | the locator-count check is disabled | `unwrap_err()` on Ok with nine locators | yes |
| R4 | the hex check is removed from `parse_uri` | "…0123456789ABCDEF0123456789ABCDEF" must be refused | yes |
| R5 | the project-relative arm returns Malformed | "a project-relative locator parses: Malformed { path: \"$.resource.locators[1].at\", detail: \"mutation\" }" | yes |
| R6 | `claim_of` uses `unwrap_or("")` | `unwrap_err()` on Ok(Some(CrsAssertion{definition_json: ""})) | yes |
| R7 | the grammar check returns Ok | `unwrap_err()` on Ok for "../x.parquet" | yes |
| K1 | the writer renames `portability_policy` to `portability` | the key-set assert "the reference holds those members and no seventh" | yes |
| K2 | the writer always writes `crs_assertion` as null | the second `open_dataset` panics with "open: SkpError { code: \"engine.format_default_contradicted\" … }" | yes |
| K3 | `check` always returns NoChangeDetected | the second assert: left NoChangeDetected, right Differs{observed:["mtime"]} | yes |
| K4 | the identity comparison is disabled | the first check: left NoChangeDetected, right Differs{admission:["identity"]} | yes |
| K5 | `linked` calls `std::fs::metadata(ds.path())` | the real-source scan: left ["std::fs"], right [] | yes |
| G1 | `linked` records `ProjectRelative(ds.path())` | "the reference's text names the fixture's path" | yes |

The worktree at C:/dev/wt/1a-rev is left clean, with its HEAD at a3f9f34f58d285cbcb20853f10f93df5591b514d. My mutation and ADR-rebuild scripts are only in my scratch folder.
