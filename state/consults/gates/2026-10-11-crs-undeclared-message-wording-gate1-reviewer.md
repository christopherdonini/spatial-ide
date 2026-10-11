# PR #206 gate 1 — reviewer
Reviewed: cut/crs-undeclared-message-wording @ d88636ef7a0c4035e9c9e9fc6fc962ff1218d60c

**Verdict: PASS.** I found no Correctness finding and no Evidence finding. There is one Documentation finding (D-1), which must be fixed in this PR before the merge. It needs no re-gate.

## Correctness
None.

## Evidence
None.

## Documentation (must be fixed before the merge)

**D-1. The "code and tests" total counts the walkthrough, which §7 lists as a document.**
- **Where it appears:**
  - the PR body's Size (§7) section gives code and tests as 49 changed lines (38 insertions, 11 deletions) against 65;
  - the form's Amendment 2, item 2, gives the code and tests total as 49 against 65;
  - worker report 1's §7 section gives the same figure.
- **What §7 says:** it puts `frontends/shell/MANUAL-WALKTHROUGH.md` on its own Documents line (at most 2). It is not under "Code and tests, at most 65".
- **The count by §7's categories:**
  - code and tests are 47 (37 insertions, 10 deletions) against 65;
  - the walkthrough is 2 against 2.
- **Why this is Documentation, not Evidence:** every per-file figure and every sub-ceiling figure is right, and the total is inside 65 by either reading. So no limit claim is unsupported.
- **The fix:**
  - correct the PR body's Size line;
  - correct the Amendment 2 figure with one appended sentence, by whichever route the record cap allows. Amendment 2 is on main, outside this diff.

## Checks, item by item

**The full diff** (`origin/main...origin/cut/crs-undeclared-message-wording`; merge-base 496fdd7f, which is §7's B):
- **Files:** exactly 7, 41 insertions and 14 deletions.
  - The six in-scope files.
  - `engine/README.md`: three Owner's index lines, 3 added and 3 deleted, and nothing else.
- **Encoding:** every file at the head is valid UTF-8, with no BOM, no CR and a final LF. `git ls-files --eol` shows i/lf w/lf for all seven.
- **Commits:** C1 185dc9b3, then H fb95bec0, then head d88636ef.
  - C1 holds the five non-engine files.
  - H holds error.rs only.
  - The head holds README only.

**§8 item 2, by my own script** (check.mjs in my scratch folder; it reads every file with `git show <rev>:<path>`):
- **The template:** line 33 of the directive, read from origin/main, with its three leading spaces stripped.
  - That line's sha256 with LF is 6fab951e5e8386de3008ac3f5640185edb64fc7632e23482f0b0567602148964, equal to the form's pin.
  - It has no trailing whitespace.
- **How each place was joined:**
  - JS concatenations: each literal is JSON-parsed, and only `+` and whitespace may sit between literals.
  - Rust literals: each `\`-newline continuation is folded together with the next line's leading whitespace.
  - JSON: parsed.
  - Row B2: `` \` `` is unescaped.
- **The detail:** the (None, None) arm of crs.rs at the head, `no \`geo\` metadata CRS on the primary geometry column`. formatRefusal.test.ts and the JSON keep their own detail.
- **Result: every place MATCH, compared byte for byte:**
  - regression.mjs and admission-remediation.mjs constants: 308 bytes each, sha256 b2a427aa…0f57;
  - the v0-error-example.json message: 308 bytes, same hash;
  - row B2: 308 bytes, same hash;
  - T-1's expected string: 308 bytes, same hash;
  - formatRefusal.test.ts: 268 bytes, detail `no \`crs\` key`;
  - the Display arm: 264 bytes, which is the template itself with `{detail}`.
- **Against the base:** each place at B equals the same first clause and detail followed by the old second sentence. The JSON's code, its fields and its key order are unchanged, and so are the formatRefusal detail and the JSON detail.
- **The PR body:** both ```text blocks MATCH, the template and the T-1 value.
- **Negative self-test:** a PR-body copy with one character changed gives MISMATCH on both blocks. Run at C1, the script fails closed, because T-1 is absent there.

**§8, item by item:**
1. Holds.
   - Amendment 1 is 6fd91ad6, committed at 01:14:22+02:00.
   - #202 (c6627398), #204 (e17758b7) and 6fd91ad6 are all ancestors of B.
   - C1 is the first code, at 01:24:51+02:00.
2. Holds (above).
3. Holds. The first clause, the detail, the fields, the code, the variant and the raise sites are unchanged. The diff has no hunk in crs.rs, dataset.rs or geoparquet.rs.
4. Holds.
   - `git diff --quiet 496fdd7f d88636ef` over geoparquet.rs, dataset.rs, crs.rs, kernel/, protocol/skp/src, SKP-V0.md, KNOWN-LIMITATIONS.md, ADMISSION-RESULTS.md, RELEASE-0.1.md and frontends/shell/src (formatRefusal.test.ts excluded) exits 0.
   - The walkthrough hunk is row B2 only.
   - The e2e hunks are inside the constants only.
5. Holds. In v0-error-example.json only the message value on line 3 changes. SKP-V0.md is untouched.
6. Holds. Every place carries line 33's bytes. The comments name the directive's path and item 5 and do not restate the wording.
7. Holds. No guidance string is added.
8. Holds. The added comments carry no path:line.
9. Holds. The only cfg is `#[cfg(test)]`. There is no pub item, dependency, sleep, retry or timeout. cfg-boundary exits 0.
10. Holds. The body's heading says the string is byte-copied by script and not typed, and both blocks match by script.
11. Holds.
    - The §7 overrun is recorded as class 8 (Amendment 2), and §7 is not edited. The form's history is three commits, each adding lines only (numstat 313/0, 21/0, 9/0).
    - No scope addition.
    - No verify-mutation run is called an observation.
    - No test-text span is hash-pinned at a branch commit, and every branch-line cite names fb95bec0.
- Amendment 1 item 4 re-run: `git diff --quiet 142af722 e17758b7 -- <its seven paths>` exits 0. From e17758b7 to 496fdd7f, the same paths plus both e2e files, the walkthrough and engine/README.md also give exit 0.
- `CRS_UNDECLARED_MESSAGE` uses at the head:
  - regression.mjs:2672;
  - admission-remediation.mjs:222-223 and 710-711.
  - Each compares the constant whole.
- Quotes of the old sentence left at the head: only KNOWN-LIMITATIONS.md:47 and engine/ADMISSION-RESULTS.md:13 and :33. Both are out of scope under line 34 and the node.

**M-1, M-2 and M-3:**
- **M-1, re-observed by me once, at d88636ef.** error.rs there is byte-identical to fb95bec0's (`git diff --quiet fb95bec0 d88636ef -- engine/src/error.rs` exits 0).
  - I replaced the Display arm's three new lines with line 285 of 185dc9b3's error.rs, by script.
  - Under a shared hold, `cargo test -p spatial-engine --lib the_crs_undeclared_message` gave exit 101. `error::tests::the_crs_undeclared_message_is_the_human_wording_byte_for_byte ... FAILED`, panicking at engine\src\error.rs:453:9 on the assert_eq. Left was the old sentence and right the new one. 0 passed, 1 failed.
  - I reverted with `git checkout -- engine/src/error.rs`. `git status --porcelain` was then empty (0 lines).
  - This matches the report's M-1 record at fb95bec0 and the scratchpad's crs/out m1.log, line for line.
- **M-2** (the scratchpad's crs/out reg-c1.log, rc=1):
  - B2'/B3' FAIL with "refusal message mismatch": Expected is the new text, Actual the old.
  - The 16 other steps PASS.
  - reg-h.log (rc=0): all 17 PASS, with B2'/B3' reporting the message verbatim.
- **M-3** (adm-c1.log, rc=1):
  - ASSERT' FAILs with "refusal message mismatch" and NOPERSIST' with "message mismatch". Both show Expected new and Actual old.
  - PASTED' and AXISTRAP' FAIL as consequences, as the report says (missing `identifier`; JSON.parse on undefined).
  - The other 7 PASS.
  - adm-h.log (rc=0): all 11 PASS.
- **The C1 attribution:** the logs do not name commits. They agree with the report's attribution by content (the old engine text at C1, the new at H) and by mtime: C1 runs at 01:37-01:38, after C1's commit and before H's at 01:40; H runs at 01:54-01:55, after the H build log at 01:49.
- **The fixture hash:** only the hash before reg-c1 is filed in crs/out (5139b97b…6e9). The after-run hashes are not there.
  - I re-hashed the fixture now: the same 5139b97b…6e9.
  - Its mtime is 2026-09-13, before every run.
  - So the claim that the fixture did not change holds.

**§7's count** (`git diff --numstat`):
- **B...H, per file:**
  - error.rs 25/4 = 29 (ceiling 40);
  - regression.mjs 4/2 = 6 (10);
  - admission-remediation.mjs 4/2 = 6 (10);
  - formatRefusal.test.ts 3/1 = 4 (6);
  - v0-error-example.json 1/1 = 2 (2);
  - MANUAL-WALKTHROUGH.md 1/1 = 2 (documents, 2).
- **error.rs sub-ceilings** (hunks @@ -27,3 +27,4, @@ -285 +286,3 and @@ -442,0 +446,18):
  - the Display string, 3 added and 1 deleted = 4 (ceiling 6);
  - the OPEN-1 comment, 4 added and 3 deleted = 7 (ceiling 6), an overrun;
  - T-1, 18 added (ceiling 28).
- **B...head:** the same, plus engine/README.md 3/3, which §7 places outside the count. Seven files are in the diff, nine counting the form and PLAN.yaml on main, against at most 9.
- **How Amendment 2 records the OPEN-1 comment:** class 8, at 7 against 6 by §21c's insertions-plus-deletions sum at fb95bec0, with §7 not edited. That holds. Its code-and-tests total is D-1.

**The owner's-index update against the diff** (index.mjs in my scratch folder, at d88636ef):
- **What was checked:**
  - all 46 test pins exist as `fn` in their named files, the `::tests::` pins inside `mod tests`. 46 matches the filing note's recount; lead-data's "43" is the erratum already recorded;
  - every named file exists;
  - every `spatial_engine::` item resolves, and so does `spatial_kernel::skp::error_of`;
  - the watch and trace identifiers, including `static CURRENT` at trace.rs:98;
  - every ceiling constant is declared in its named file;
  - the 16 accepted ADRs have Accepted status lines, and ADR-023 and ADR-036 have Proposed;
  - all 14 KNOWN-LIMITATIONS items exist;
  - the named sections exist: SKP-V0 §1/§5/§7, CANCELLATION §7, ADR-004 Amendment 4, SOURCE-WATCHER §2a, the drained-helper form's §2 and Part B;
  - engine/Cargo.toml's only `path =` is the crate itself.
- **Result:** 212 checks, one flagged, a false positive of my ceiling regex (`CURRENT` is a `static`, which the trace check resolved).
- **The three changed lines** match lead-data's §1.1-1.3 exactly.
- **The section** is 35 lines, against at most 60.
- **Last verified at fb95bec0 holds.** fb95bec0 and the head differ only in engine/README.md, every pointer resolves at the head, and the merge commit makes fb95bec0 reachable from main.

**Hash pins in the form, recomputed** (pins.mjs, `git show <rev>:<path>`, the whole cited lines with LF):
- **Result:** 85 of 85 match, 74 at 142af722 and 11 at e17758b7. Both commits are on main.
- **Negative self-test:** one changed hex digit gives MISMATCH.
- **Amendment 1 item 1's directive line 6** at the commit that adds it (6fd91ad6): sha256 224f6eb6…a6fa, which matches.

**Suites at the head, each under `<M> hold shared` (granted every time, MACHINE_RELEASED every time, no code from 96 to 99).** CARGO_TARGET_DIR=D:/wt-targets/cov, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8.

| Command | Exit | Result |
|---|---|---|
| `cargo test -p spatial-engine --lib` | 0 | 203 passed, T-1 ok |
| `cargo test -p spatial-skp --test fixtures` | 0 | 24 passed |
| `cargo test -p spatial-kernel --lib` | 0 | 153 passed |
| `npx vitest run src/admission src/skp` (frontends/shell) | 0 | 17 files, 139 tests passed |
| `cargo clippy -p spatial-engine --all-targets` | 0 | 39 warning lines, all pre-existing in stream.rs, rowgroup.rs, trace.rs and engine/tests/*; none in error.rs and none on an added line |
| `cargo fmt --all --check` (light, no hold) | 0 | clean |

No timing-sensitive failure was seen.

**Governance checks at the head** (in the worktree, no hold):

| Command | Exit | Result |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 1685 files; 49 loose references advised, all pre-existing in state/drafts |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS, 121 checked, 90 verified, 30 baselined, 1 advisory |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 534 claims |
| `node scripts/plan/verify.mjs` | 0 | verify:plan PASS |
| `node scripts/plan/queue.mjs --check` | 0 | current |
| `node scripts/plan/site.mjs --check` | 0 | current |
| `node scripts/plan/cfg-boundary.mjs` | 0 | 18 sites, 0 outside every boundary |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` | 0 | 457 of 457 pass |

**CI** (`gh pr checks 206`):
- **First read:** two Windows `cargo test --workspace` jobs were pending, and that call exited 8.
- **Waiting:** I watched with `gh pr checks 206 --watch --interval 115` from 00:46:48Z to 00:48:45Z.
- **Final read:** rc=0, and all 13 lines pass:
  - L1 portable correctness · cargo test --workspace (ubuntu-24.04), twice (3m28s, 4m55s);
  - cargo fmt --check (14s);
  - cargo test --workspace (windows-latest), twice (18m46s, 18m44s);
  - cfg boundary (6s);
  - every commit is signed off (8s);
  - no profile path in the range (9s);
  - tauri build (NSIS, build-only, no signing), twice (4m58s, 4m13s);
  - test · verify:plan · queue/site drift (1m22s);
  - typecheck · build · vitest · cargo test, twice (6m39s, 7m25s).
- **Run commits:** all runs are at headSha d88636ef7a0c4035e9c9e9fc6fc962ff1218d60c (`gh run view --json headSha`).

**The PR body against the head and the report:**
- The commits, B, C1 and H, the change list, the "not touched" list, the Evidence section (17/17 and 11/11 at H, the step names at C1, the suite counts) and the whole-diff stat (7 files, +41/−14) all agree with the head, the report and the logs. The one exception is D-1.
- **Low-profile direction:**
  - The title, the body and the three commit messages have no outside issue or PR reference, no link and no @mention.
  - The only `@` strings are the commits' Co-Authored-By and Signed-off-by email trailers.

**Other checks:**
- **The seam (rule 8):** no interface on Display → error_of → SkpError → formatRefusal → RefusalBlock is edited. The real-shape end-to-end proof is the C1/H e2e pair through the built app. The caller grep has nothing to check: there is no new pub item, callback or option.
- **Not run, per the brief:** I ran no e2e suite and did not start the app.

**Final state:** the worktree at C:/dev/wt/crs is at d88636ef7a0c4035e9c9e9fc6fc962ff1218d60c, and `git status --porcelain` is empty. I committed nothing and published nothing. I started no process that is still running. My temporary files are only in my scratch folder: check.mjs, pins.mjs, index.mjs and the logs.

Files referred to:
- C:/dev/spatial-ide/engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-10-crs-undeclared-message-wording-worker-report-1.md
- C:/dev/spatial-ide/state/consults/2026-10-11-crs-undeclared-message-wording-owners-index-update.md
- C:/dev/wt/crs/engine/src/error.rs
- C:/dev/wt/crs/engine/README.md
