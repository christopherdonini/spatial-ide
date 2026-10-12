# PR #190 gate 1 — reviewer, attempt 2
Reviewed: cut/b2-piece-1a-step-record-and-dataset-reference @ 91fe4c850d2dfffa0d057beaf0cafa9c057e1808

**Verdict: PASS.** There are no Correctness or Evidence findings.
- **C1 is resolved.** The shell lock gains exactly the one line the human allowed. `cargo metadata --locked --offline` on that manifest exits 0, and all 13 CI checks pass at 91fe4c85, both shell jobs included (in both the push run and the pull_request run).
- **There are two Documentation findings.** Both must be fixed in this PR before the merge. Neither needs a re-gate.

## Correctness / Evidence (blocking)

None.

## Documentation (must fix before the merge; not blocking)

**D1. The PR body is stale at the head.** D3 from attempt 1 is fixed: the size line now names its head and base. But the body was not brought up to the fix head:
- "Amendments 1 to 4 (generation 5)" should be Amendments 1 to 6, generation 7.
- "Head: a3f9f34f" should be 91fe4c85.
- The "Tests" line has these problems:
  - it names R1 to R7 but not R8;
  - it says each mutation was "observed over 1e637d55", but R7, K1's added mutation and R8 were observed at 507838e2;
  - it says the workspace run "passed 920". Report 3 and my run both give 922.
- "Worker reports" names reports 1 and 2 only. Reports 3 and 4 are missing.
- The size line says the fix commits "are counted again from the merge base before the merge". They now are counted (D2): name the figure, or point to the closing record.

**D2. The class 8 record at the fix head (owed by Amendment 5 item 9 and Amendment 6 item 5).** This is §7's command, three-dot, run at 91fe4c85 from the merge base db7c88d0. The two-dot run from db7c88d0 gives the same numbers.

| Group | Lines | Ceiling | Result |
|---|---|---|---|
| Engine product (`descriptor.rs`) | 154 | 180 | within |
| Engine tests (`source_observation.rs`) | 238 | 240 | within |
| Kernel product (`dataset_ref.rs` 872, `lib.rs` 1, `Cargo.toml` 3) | 876 | 760 | **over by 116** |
| Kernel tests (`dataset_ref.rs` 424, `no_generation…` 117) | 541 | 520 | **over by 21** |
| ADR | 184 | 280 | within |
| Indexes (engine 6, kernel 11) | 17 | 30 | within |
| Shell lock (`frontends/shell/src-tauri/Cargo.lock`), in no §7 group | 1 | — | counts toward the total |
| **Total** | **2,011 over 11 files** | **2,010 over ≤ 10 files** | **over by 1 line and by 1 file** |

- The architect's D-5 (a) said that at 14acee0b the total was "exactly at its ceiling and not over it". The shell lock line pushes the total over, in lines and in files. The closing record must record four things as class 8: both kernel groups, the line total and the file count. §7 must not be edited, and it is not.
- The shell lock belongs to no group in §7's table. Amendment 6 item 5 counts it by the command, so it counts only toward the total.

## Suggestions (not findings)

- **S1. Attempt 1's S1 still stands.** `DatasetUri::mint` calls `.expect` on the OS random source. This is checklist item 1. It has no product caller yet. Decide before 1b adds one.
- **S2. A blank basis is refused with the `claim` helper's detail, "an empty claim is not recorded".** This is the architect's N-8; the worker disclosed it. The variant and the path are as Amendment 5 states.
- **S3. The canonical-form detail, "a project-relative locator is in canonical form", reads as a statement of fact.** Today it states the rule the locator broke, which is the module's convention; "must be in canonical form" would read as the refusal it is. This is a nit.
- **S4. Worker report 4 is slightly wrong about the kernel index.** It says two kernel-index test pointers "point at modules, not functions". They don't: both are `file::module::fn` pointers, and each resolves to a function inside the named module. Nothing on the branch needs fixing.

## C1 and the locks

- **Shell lock.** `git diff 14acee0b 91fe4c85 -- frontends/shell/src-tauri/Cargo.lock` (exit 0) shows exactly one added line, `"getrandom 0.3.4",`, in `spatial-kernel`'s dependency list. There is no other hunk.
  - The `getrandom` packages locked there are 0.2.17, 0.3.4 and 0.4.3, the same three at 14acee0b and at the head. So there is no new package and no version change.
  - This matches Decision C at `state/directives/2026-10-08-decisions-a-b-c.md:26-28`. I recomputed its hash at 994b9737: 799adebe4fd997e6c004484cb9339c11d24b4c48293bf7d5d31bf4bc799b5177, which matches Amendment 6.
- **`cargo metadata --format-version 1 --locked --offline --manifest-path frontends/shell/src-tauri/Cargo.toml`:** exit 0. At attempt 1 it exited 101.
- **Root lock.** `git diff c01f2e09 91fe4c85 -- Cargo.lock` still shows the one added line, `"getrandom 0.3.4",`, in `spatial-kernel`'s list. The three-dot diff from the merge base shows the same single line.
- **Amendment 6 came before its code** (round 25, item 2). 994b9737, which adds Amendment 6 on main, was committed at 16:30:02+02:00. 91fe4c85, the code, was committed at 16:31:06+02:00.
- **The PR body shows both lock diffs,** as Amendment 6 item 1 asks.

## CI at 91fe4c85 (`gh pr checks 190`, every line printed)

The last poll (exit 0) gave 13 lines, all pass:
- L1 portable correctness on ubuntu-24.04, twice;
- cargo test --workspace on windows-latest, twice;
- cargo fmt --check;
- the cfg boundary;
- DCO sign-off;
- no profile path in the range;
- tauri build (NSIS), twice;
- test · verify:plan · queue/site drift;
- typecheck · build · vitest · cargo test, twice.

`gh run view` on all eight runs confirms that each run's headSha is 91fe4c850d2dfffa0d057beaf0cafa9c057e1808. Two earlier polls exited 8 with jobs still pending; I did not cut either.

## Attempt 1's D1 to D3

- **D1 is fixed at 507838e2.** The module header now says "absolute path".
- **D2 is fixed at 507838e2.** `Locator::ProjectRelative`'s doc now says it is checked for canonical form only and that containment belongs to 1c's resolver.
- **D3 is fixed in the PR body.** The size line now names the build head 479ae81d against c01f2e09. The rest of the body is stale (D1 above).

## Amendment 5, recomputed

- **ADR-036, by my own script.** I took §2.3's text between its markers from main's form. Then I applied:
  - Amendment 1 (a), (b) with the new §11 line, and (c);
  - Amendment 2, items 1, 2 and 4: the project-relative bullet and the second sentence of the Consequences bullet;
  - Amendment 5, items 1 (a), 1 (b), 5 (a) and 5 (b).

  Each fenced block was taken from the form and de-indented by its fence's indent, and each anchor had to match exactly once. The result is **byte-equal** to the filed file: 16,354 bytes, sha256 33fdaa57ff5d4b00828d82d99f84593d82aecbb83ca0eca85d77e543eef91c08. The `git show HEAD:` blob hashes the same. Status is Proposed.
- **The branch's form** equals main's form through Amendment 5. Amendment 6 is on main only.
- **The code, as I read it:**
  - `in_canonical_form` replaces the old function with the same refusals. Its doc says it checks the string only and that containment belongs to 1c.
  - `expect_state` keeps the closed `{state, basis}` set and the closed word. It accepts any non-blank basis within `MAX_REF_STRING_BYTES` and keeps none, and the fixed-text comparison is gone.
  - The module header and the comment above the constants say so.
  - `to_json` still writes the fixed texts.
  - No `pub` item and no error variant is added.
- **K1 starts from the real shape.** It takes `source.source_revision` from a real `publish_unguarded` manifest. It asserts that the two basis texts differ, parses the entry, and asserts the text written back equals the reference's own.
- **R8** covers all four named-state paths, each with four cases: another basis, a blank basis, an over-long basis and another word.
- **Test-text row (architect D-5 (c)).** R7's old recorded-mutation note was added at 1251fc3c and replaced at 14acee0b. Both are branch commits, not on main. At 1e637d55 the note had a different, unrecorded "Mutation:" form.

## Mutations (made again by me at the head, each test run alone by name in the workspace form, then reverted)

These are my own runs, not `verify-mutation`.

| Row | Mutation | Failing assertion, as the run printed it | Reverted, tree clean |
|---|---|---|---|
| R7 | `in_canonical_form`'s condition replaced by `if false` (the check is removed) | first case `../x.parquet`: `unwrap_err()` on an `Ok` value holding `ProjectRelative("../x.parquet")`, at R7's `unwrap_err` | yes |
| K1, added | `expect_state` restored to its a3f9f34f body (the fixed-text comparison) | `the bundle's own state parses: Malformed { path: "$.resource.source_revision.basis", detail: "the basis text is fixed in version 1" }` | yes |
| R8 | in `expect_state`, `claim` becomes `bounded` (the blank check is removed) | the blank case of the first named state: `unwrap_err()` on an `Ok` value | yes |

- Each failure agrees with its recorded note at 14acee0b and with worker report 3. The line numbers differ from the report's by exactly the shift that the later comments and the worker's mutation shape explain.
- After all three reverts, R7, R8 and K1 pass again.

## Hashes recomputed

- Decision C, lines 26-28 at 994b9737: matches (above).
- Worker report 3, line 5 to end, on main: 73adb8c085b131008b66e9e44fe684a0ac62a1b11c911a77979c9f5ee1763759. Matches its filing note.
- Worker report 4, line 5 to end, as staged in the main checkout (working file and index alike): 5daedf220020475973a2e142fbe046ec9022ca9c11d8beabd2f2ffd9c57d3122. Matches its filing note. It is not yet committed.

## Anything the fixes broke

I found nothing.
- The indexes' last-verified lines name 14acee0b (D-4). Every other index line is unchanged.
- The engine index is about 33 lines and the kernel index about 39 (each at most 60).
- `adrIndex --check` passes.
- `verify-test-claims` passes with R7's new name.
- No `frontends/` file other than the one lock line, and no `protocol/` file, is in the three-dot diff.

## Commands

All cargo calls set `CARGO_TARGET_DIR=D:/wt-targets/1a`. Every held call ran `CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8` inside `<M> hold shared -Project SpatialIDE`, followed by `<M> release`.

| # | Command | Held | Exit | Result |
|---|---|---|---|---|
| 1 | `git diff 14acee0b 91fe4c85 -- frontends/shell/src-tauri/Cargo.lock`; `git diff c01f2e09 91fe4c85 -- Cargo.lock` | no | 0 | one line each |
| 2 | `cargo metadata --format-version 1 --locked --offline --manifest-path frontends/shell/src-tauri/Cargo.toml` | no | 0 | |
| 3 | `gh pr checks 190`, three polls | no | 8, 8, 0 | all 13 pass at the end |
| 4 | `gh run view` for each of the 8 runs | no | 0 | all at 91fe4c85 |
| 5 | my ADR-036 script | no | 0 | byte-equal |
| 6 | §7's command at 91fe4c85, from db7c88d0 (three-dot and two-dot) | no | 0 | 2,011 over 11 files |
| 7 | `verify.mjs`, `queue.mjs --check`, `site.mjs --check`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` | no | 0 each | |
| 8 | `node scripts/adrIndex.mjs --check` (in frontends/shell); `cargo fmt --all -- --check` | no | 0, 0 | 34 ADRs |
| 9 | the machine script's `status` | no | 0 | quiet |
| 10 | `cargo test --workspace --locked --features spatial-engine/fixture` | yes | 0 | 101 binaries: 922 passed, 0 failed, 54 ignored |
| 11 | `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture` | yes | 0 | 73 warning lines, 44 locations, none in a changed file |
| 12 | `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | yes | 0 | 450 of 450 |
| 13 | R7 mutation, `--lib -- dataset_ref::tests::a_project_relative_locator_outside_canonical_form_is_refused --exact` | yes | 101 | table above |
| 14 | R8 mutation, `--lib -- dataset_ref::tests::a_named_states_basis_is_free_text_and_its_word_is_closed --exact` | yes | 101 | table above |
| 15 | K1 added mutation, `--test dataset_ref -- the_reference_uses_the_bundles_resource_ref_vocabulary --exact` | yes | 101 | table above |
| 16 | `--lib --test dataset_ref -- dataset_ref the_reference_uses`, after the reverts | yes | 0 | 9 + 2 passed |

- No hold was refused, and no exit code 96 to 99 occurred.
- Nothing was timing-sensitive, and the stale-binary case did not occur, so no `cargo clean` was needed.
- **One deviation of mine from the hold's shape:** in row 10 I put an `echo` of the exit code into my log between the release and the `exit`. The hold and the release ran as required.
- My first R7 mutation attempt aborted before it edited anything: the anchor holding a backslash did not match. I re-applied the mutation by matching the whole line.

The worktree `C:/dev/wt/1a-rev2` is clean, at HEAD 91fe4c850d2dfffa0d057beaf0cafa9c057e1808. My scripts and logs are only in my scratch folder.
