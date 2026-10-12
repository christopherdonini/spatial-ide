# PR #202 gate 1 — reviewer
Reviewed: cut/filter-identity-alias-ambiguous-reached-through-skp @ d3c9f00daa5ec7bdb47e4b187ed8c66ddb17306c

**Verdict: PASS.** No Correctness finding and no Evidence finding. There are three Documentation findings (D-1 to D-3). All three are in the PR body, and each must be fixed in this PR before the merge. None of them needs a re-gate.

I left the worktree `C:/dev/wt/fi` at d3c9f00daa5ec7bdb47e4b187ed8c66ddb17306c, and `git status --porcelain` is empty. I committed and published nothing. Base B = 34d14658 (`git merge-base origin/main HEAD`), so it matches the PR body.

## Correctness: none

- **The full diff,** `origin/main...origin/cut/filter-identity-alias-ambiguous-reached-through-skp`, touches exactly five files:
  - `kernel/tests/skp_admission_remediation.rs` (+95/−2);
  - `engine/src/predicate.rs` (+6/−6, all inside `identity_alias_ambiguity`'s doc comment, one hunk);
  - `protocol/skp/SKP-V0.md` (+8/−4, one hunk, §7.5's paragraph only; the heading is untouched);
  - `kernel/README.md` and `engine/README.md` (3/3 each).

  No product line changes. All five files decode as UTF-8 at the head, including `SKP-V0.md` (iconv rc 0), and no added line has a CR.
- **Both corrected texts match the form's declared text byte for byte** (§2.2 and §2.3), with `<T-1>` filled in as the test name and `<date>` as 2026-10-10. A script compared them.
- **The seam:**
  - T-1 calls `SkpHost::open_dataset` with the wire's `spatial_skp::v0::IdentityDeclaration`, then `SkpHost::describe`, then `SkpHost::viewport_query` with the wire's `Filter`.
  - It never calls `Catalog::open_cancellable` and never sets `skip_uniqueness_check`.
  - `host_minted_identity_declaration` (kernel/src/skp.rs, read at the head) has no skip field.
  - `filter_error_of` passes the `FilterError` Display through unchanged as the message, and maps the fields `column` and `source_column`.
  - Step (iv) means something: `StreamRegistry::new()` returns an `Arc`, so the test's `tickets.clone()` is the same registry the host mints into.
- **The PR body's quotation of the message** matches the Display arm at engine/src/predicate.rs:338-343 with F-1's values `column`=`id` and `source_column`=`u64`. I checked it by script: I built the string from the arm's source (Rust line continuations joined) and found it, fenced, in the body. It also matches worker report 1, line 50. I made no scratch print.
- **§8, item by item:**
  1. The form is at 34d14658, the code starts at caf131fd, and the flush merge 7b3d8040 is an ancestor. No breach.
  2. Only the doc comment changes in `engine/src`. Nothing changes in `kernel/src`, `protocol/skp/src` or `frontends/`. No breach.
  3. No message, wire literal, fixture, SKP §8 or user-visible string changes. No breach.
  4. `fixture.rs` is untouched. The test uses main's `StringIds` and `FilterWitness`. No breach.
  5. The route is SkpHost only. No breach.
  6. Only §7.5's paragraph changes. No breach.
  7. The texts are exactly the declared ones. No breach.
  8. There is no path:line in either comment, and no intra-doc link: the changed engine lines contain no `[` or `<` (a script count gave 0; the pattern self-tested positive). No breach.
  9. There is no pub item, dependency, cfg, ignore, sleep, retry or timeout. No breach.
  10. Round 25:
     - No §7 overrun, and §7 is not edited.
     - There is no scope addition.
     - The mutations are recorded as observed by hand, and the worker report says `verify-mutation` was not used.
     - The test text names caf131fd, its commit id, and carries no hash pin at a branch commit.

  No breach.

## Evidence: none

- **§7, by the form's command:** `git diff --numstat 34d14658 HEAD -- kernel/tests/skp_admission_remediation.rs engine/src/predicate.rs protocol/skp/SKP-V0.md` gives:
  - the test file: 97 of 110;
  - `predicate.rs`: 12 of 20;
  - `SKP-V0.md`: 12 of 20;
  - total: 121 of 150.
- **Hash pins:** I recomputed all 74 by script (`git show <rev>:<path> | sed -n a,bp | sha256sum`), and all 74 match:
  - 70 at d9bdc3a099adf93cabb9e3f9c98fe9d01afef3ba;
  - Amendment 1's three at 14475652d737d29612f01a8f2e0bf4c129021506 and one at ca909857d2a4a0fffa8df4adfe4a14570dd40135.

  All three commits are on main. The form holds 74 `sha256:` tokens and 74 `@ rev` tokens, so none was missed. The whole-file hash of the impact read, 4c5d3919…8268, also matches. The form is identical on main and on the branch.
- **The mutations.** The record is worker report 1, lines 44-47: M-1 and M-2 observed at caf131fd, failing at (iii) and at (ii). The test text differs from caf131fd at the head only in the two filled commit ids. I also re-observed each mutation myself at d3c9f00daa5ec7bdb47e4b187ed8c66ddb17306c, one at a time, each in its own shared hold:
  - **M-1:** `return None;` at the top of `identity_alias_ambiguity`. The command `cargo test -p spatial-kernel --test skp_admission_remediation a_declared_identity_beside` exited 101. T-1 failed at kernel/tests/skp_admission_remediation.rs:334, the `expect_err` of (iii): the query was admitted and a `ViewportQueryResponse` was returned. I reverted with `git checkout -- engine/src/predicate.rs`, and `git status --porcelain` was empty.
  - **M-2:** `let identity = None;` in place of `req.identity.map(host_minted_identity_declaration)` in `SkpHost::open_dataset`. The same command exited 101. T-1 failed at :312, the `expect` of (ii): `engine.identity_unusable` on `id`. I reverted, and `git status --porcelain` was empty.
- **Suites at the head.** Each ran in its own shared hold. Every hold was granted and released, and no exit code 96 to 99 occurred. `CARGO_TARGET_DIR=D:/wt-targets/cov`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8` (the last except for doc and clippy).
  - `cargo test -p spatial-kernel --test skp_admission_remediation`: rc 0, 7 passed. T-1 passed (P-1 holds).
  - `cargo test -p spatial-kernel --lib`: rc 0, 153 passed.
  - `cargo test -p spatial-engine --test predicate_admission --test filter_type_admission`: rc 0. filter_type_admission had 3 passed (209.59 s, its own figure, not a claim). predicate_admission had **6** passed.
  - `cargo doc -p spatial-engine --no-deps`: rc 0, and cargo reports **18 warnings**. All are links to private items, unresolved links, or one unclosed HTML tag, and none points into lines 1108-1116. I compared with the base **by reading**, with no scratch build at the base. The engine crate's only change is the doc text, and its changed lines contain no `[` or `<`, so it cannot add or remove a link or HTML warning. No README is pulled into the crate docs.
  - `cargo fmt --all --check`: rc 0 (a light run, outside any hold).
  - `cargo clippy -p spatial-kernel --all-targets`: rc 0. It gave 40 warning or error-prefixed lines, all in other files. None is in `kernel/tests/skp_admission_remediation.rs` or `engine/src/predicate.rs`, so there is no warning on an added line.
- **Governance checks at the head,** outside any hold (light):

  | Check | rc | Result |
  |---|---|---|
  | `verify-cites` | 0 | PASS, 53 loose references advised |
  | `verify-quotes` | 0 | PASS: 121 checked, 90 verified, 30 baselined, 0 errors |
  | `verify-test-claims` | 0 | PASS, 533 claims |
  | `verify` | 0 | verify:plan PASS |
  | `queue --check` | 0 | current |
  | `site --check` | 0 | current |
  | `cfg-boundary` | 0 | 0 outside every boundary |
  | `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 | 457 passed, 0 failed |

- **CI:** `gh pr checks 202`, polled every 2 minutes, settled after 3 polls. All 13 lines pass, and every run is at headSha d3c9f00daa5ec7bdb47e4b187ed8c66ddb17306c (checked with `gh run view`). The lines, in full:
  - L1 portable correctness · cargo test --workspace (ubuntu-24.04): pass 3m32s; pass 4m50s
  - cargo fmt --check (workspace and src-tauri): pass 10s
  - cargo test --workspace (windows-latest): pass 16m36s; pass 19m8s
  - cfg boundary (PORTABILITY R2): pass 12s
  - every commit is signed off: pass 7s
  - no profile path in the range: pass 11s
  - tauri build (NSIS, build-only, no signing): pass 3m49s; pass 4m43s
  - test · verify:plan · queue/site drift: pass 1m37s
  - typecheck · build · vitest · cargo test: pass 5m33s; pass 7m14s

  So P-3 holds on both platforms.
- **The owner's index:**
  - Each of the six "New line" blocks in lead-data's update is present verbatim in the README at the head (checked by script). That is three lines replaced in each README.
  - T-1 joins the wire error codes pins (kernel) and the filter admission pins (engine). The form joins the kernel's preregistration list and the engine's list of engine halves of pieces filed elsewhere. Last verified moves to d5863945.
  - I resolved every backticked pointer in both sections at the head by script: 267 in all, with 0 unresolved.
    - 100 file paths exist.
    - 93 test pins: each `fn` exists in its file and its named `mod` exists. That is 48 kernel plus 45 engine, which matches lead-data's count.
    - 74 crate symbols: each final segment is present as a word in its crate's source. This is a weak check.
    - I excluded one token, `skp/0.5`, because it is a version literal, not a path.
  - Every ADR in both lists has the Status line its list implies. Every KNOWN-LIMITATIONS item number listed exists.
- **Low profile:** the PR title, the body and the four commit messages carry no `#n`, no outside link and no @mention. The pattern self-tested positive on the commit trailers' e-mail addresses.

## Documentation: must fix in this PR before the merge

Paraphrase: these describe the PR body; nothing below quotes it.

- **D-1. Test count.** The PR body's P-3 bullet gives the two engine suites a single count of 3. The run gives 3 for filter_type_admission and 6 for predicate_admission, 9 in all. The same miscount is in worker report 1, line 56 (state/consults/2026-10-10-filter-identity-alias-ambiguous-reached-through-skp-worker-report-1.md:56). The pass claim stands, so this is not Evidence. Fix: state 3 and 6 (or 9).
- **D-2. Doc warning count.** The PR body (and worker report 1, line 57) says 19 warnings. Cargo's own summary at the head is 18. The engine sources are identical at d5863945 and at the head, since only the READMEs differ. Fix: 18, by cargo's own line.
- **D-3. A claim at the v0.1.0 tag, which goes beyond §1.** The proposed-node bullet in the PR body says, by reading the code at the tag, that the same holds for v0.1.0. The form's §1 says the piece may not claim a reachability date or commit beyond 0.6.
  - The code supports the statement. At b391e43:
    - kernel/src/skp.rs:344 maps `req.identity`;
    - engine/src/predicate.rs:875 holds the alias rule, and :911 refuses with it;
    - frontends/shell/src/admission/AdmissionPanel.tsx:312 sends `identity`.

    So this is Documentation, not Evidence.
  - The human asked for that answer in the proposed node (state/directives/2026-10-10-reaim-t2-base-f0fccfaf-filter-identity-no-shell-run-guidance-node.md:18).
  - Fix: either move the sentence to the node, or label it as the node's by-reading answer, outside this piece's claims.

## Commands and holds

Every hold was shared, Project SpatialIDE, granted and released:
1. suite 1: rc 0
2. `--lib`: rc 0
3. the two engine suites: rc 0
4. `cargo doc`: rc 0
5. clippy: rc 0
6. M-1: rc 101, the expected failure
7. M-2: rc 101, the expected failure

The governance scripts, `node --test` and `cargo fmt --check` ran outside any hold, since they are light. I wrote temporary files only in my scratch folder.
