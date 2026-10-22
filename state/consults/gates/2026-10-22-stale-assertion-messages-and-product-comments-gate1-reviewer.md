Reviewed: PR #243 at b24e5281aef6da8b744de3ca840e9ffc10503cb6, gate 1, reviewer
Branch: cut/stale-assertion-messages-and-product-comments @ b24e5281aef6da8b744de3ca840e9ffc10503cb6

Verdict: FAIL

The only blocking finding is E5, the Evidence item for green PR CI. It needs a re-run of one CI job and no code change. Nothing else in this report blocks. Once that job's re-run is green, this gate has no further blocking finding.

## Evidence (blocking)

**E-1: E5 is not met.** `gh pr checks 243` returns rc=1 on both reads, the first early in the review and the second after E4.
- Every run has headSha b24e5281aef6da8b744de3ca840e9ffc10503cb6. The pull_request runs test the merge commit ff481936, which is H merged into main baad2770.
- One check is red: "test · verify:plan · queue/site drift" in the pull_request run 39790303500 (Governance CI).
- Its log (`gh run view 39790303500 --log-failed`, rc=0) shows that verify:test-claims PASSed. verify.mjs then got `gh: HTTP 503` from the GitHub API on its merged-PR lookups for PRs #51, #52, #54 and #231. It printed `verify:plan FAIL — 4 issue(s)`, each one "PR #N is not merged (Command failed: gh api …/pulls/N gh: HTTP 503)", and the job exited 1.
- The cause is the API's availability, not the diff:
  - The push run of the same workflow at the same head sha (39782466359) passed.
  - My local `node scripts/plan/verify.mjs` at H exited 0.
  - The diff touches no PLAN node, PR reference or `scripts/` file.
- Every other check is green at b24e5281, both pull_request and push. The windows cargo test check was pending at the first read and passed at the second, in run 39790303427.
- **Cure:** re-run the failed job of run 39790303500 and read the checks green, with no code change and no re-gate of anything else. Re-running it is a PR action, which this brief forbids me.

## Correctness

No findings.
- All seven hunks equal the form's New text blocks byte for byte (§2.1 M1, M2, C1, B1 and §2.3's three spans).
- The four removed blocks equal the form's "As it stands" blocks, and the three §2.3 removed spans equal B's lines 100-102, 1143 and 1145-1146.
- I spot-checked the §2.3 anchors and B1's "requests none" at H with `git grep`:
  - the `Self::FormatDefaultContradicted` Display arm is at `engine/src/error.rs` :333;
  - `convict_or_record` and the `"at level …"` `format!` are in `engine/src/dataset.rs`;
  - `fitToExtent` is in `WorkingCanvas.tsx`;
  - the "P3i-b B4: dual-arm coverage" paragraph is in the doc comment that starts with "S4:", directly above `async function runFieldSequenceIdentityCheck`;
  - the only non-test `columns:` setter in `frontends/shell/src` is `skp/client.ts`'s `columns: null`.
  
  The architect owns clause truth. These checks only confirm that the anchors exist.

## Documentation (must fix before the merge, no re-gate)

**D-1: the PR body says "§4 items 1 to 7 … hold at H" without saying how item 3 holds.** The form's §4 item 3 says `npx vitest list` "is identical at B and H". It holds only after sorting. `vitest list` orders whole file groups nondeterministically:
- my raw cmp is rc=1, with the first difference at line 774;
- the worker's first difference was at line 269;
- both lists have 1375 lines, and the sorted lists cmp rc=0.

Replacement words for the PR body's Evidence sentence. These are not the human's wording; it is the worker's PR body.

> The worker's report, `state/consults/2026-10-22-stale-assertion-messages-and-product-comments-worker-report.md`: §4 items 1 to 7, E1 to E4 and E6 hold at H, item 3 on the sorted lists (`npx vitest list` orders whole file groups nondeterministically). E5 is this PR's CI.

Clause check:
- "items 1 to 7 … hold at H": my runs of items 1 to 7 at H all exit 0 (listed below).
- "item 3 on the sorted lists": raw cmp rc=1 and sorted cmp rc=0, 1375 lines each.
- "orders … nondeterministically": two independent B/H pairs first differ at different lines (269 and 774), with identical sorted content.
- "E1 to E4 and E6": confirmed below.

**D-2 (note only, no fix, because the record is under `state/` and append-only):** the worker report's item 2 says "509 lines each". My `cargo test -p spatial-engine -- --list` stdout has 555 lines at both B and H (462 `: test` lines), with cmp rc=0. Both counts support the item, because B equals H in each. The worker's line count cannot be reproduced from the report.

## Disclosures

- My E2/E3 call ran past the Bash tool's 600 s cap. The harness moved it to the background, where it finished with every command at rc 0; verify-quotes alone took about 8 minutes. It was not started in the background.
- My first item 6/7 script failed with rc=1, a JS SyntaxError from a backslash the tool collapsed. It ran nothing. I re-ran it escape-free as `samc-g1r-item67b.mjs`, rc=0.

## What I checked (each command's output is in my scratch folder, files `samc-g1r-*`)

1. **The full diff:** `git diff 4b26d279…b24e5281` rc=0 and `--numstat` rc=0. `samc-g1r-check1.mjs` rc=0 printed:
   - the form on origin/main equals the form at B;
   - 7 hunks: session_identity.rs@193, regression.mjs@100, @1143, @1145 and @1830, crsAssertionState.ts@9, buildLayers.ts@31;
   - each hunk's added lines equal New text blocks 0 to 6 byte for byte (7 of 7, 0 misses);
   - the minus blocks of M1, M2, C1 and B1 equal the "As it stands" blocks;
   - every hunk's minus and plus lines equal the B and H file lines at those offsets;
   - no CR bytes.
2. **§4, items 1 to 5** (heavy, each inside a shared hold that was granted and released, with CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8):
   - **At B** (`samc-g1r-atB.sh`, outer exit 0):
     - `git checkout B -- <4 files>` rc=0; `git diff --quiet B -- <4 files>` rc=0;
     - `cargo test -p spatial-engine -- --list` rc=0, 555 lines; the M1 test name appears once (self-test positive);
     - `npx vitest list` rc=0, 1375 lines;
     - `git checkout HEAD -- <4 files>` rc=0; porcelain 0 bytes; HEAD b24e5281.
   - **At H, cargo** (`samc-g1r-atH1.sh`, porcelain 0 bytes before and after):
     - item 1, `cargo test -p spatial-engine --test session_identity`: rc=0, "18 passed; 0 failed";
     - item 2, `--list` at H: rc=0, 555 lines; `cmp` with B rc=0;
     - item 4, `cargo fmt --all -- --check`: rc=0.
   - **At H, shell** (`samc-g1r-atH2.sh`, porcelain 0 bytes):
     - item 3, `npx vitest list`: rc=0, raw cmp rc=1, sorted cmp rc=0 (D-1);
     - item 5, `npx vitest run` of the three files: rc=0, "Test Files 3 passed (3)", "Tests 43 passed (43)";
     - `npm run typecheck`: rc=0;
     - `node --check e2e/regression.mjs`: rc=0.
3. **§4, items 6 and 7** (`samc-g1r-item67b.mjs` rc=0, from git objects):
   - each pattern is positive at B and absent at H: `429-430` B=1 H=0, `PROPOSED ADR-016` B=1 H=0, `carries no attributes` B=1 H=0, `testing-library` B=1 H=0;
   - the `K7_SETTLED_PARTIAL_TEXT` literal (regression.mjs line 1765) equals the `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` literal (residencyStatus.ts line 434), 94 bytes and no backslash, at both B and H;
   - `git diff -U0` has 7 hunks over exactly 4 files;
   - every changed line in P3 (6) and P4 (9) begins with ` *`;
   - P1's lines 191-192 are byte-identical;
   - P2's line 1830 differs raw and is equal with the parenthesis masked.
4. **E1:** items 1 to 7 hold, item 3 as a sorted multiset.
5. **E2 at H** (porcelain 0 bytes after):
   - `verify-cites.mjs` rc=0 (PASS), `verify-quotes.mjs` rc=0 (PASS), `verify-test-claims.mjs` rc=0 (PASS, 613 claims), `verify.mjs` rc=0 ("verify:plan PASS");
   - tool commits by `git log -1 H -- <tool>`: verify-cites a382c50813c316feb0525adf54da40607ce16d66, verify-quotes c3e70acb4914a4533764f312cdf0a25eb300e436, verify-test-claims fb42c2590c9c3369c8a12e45c6d19a18a9c595a2, verify.mjs 8dd1e7af87cc436c61e2b41fd9e2bb00bbf3e7d8; the last commit touching `scripts/plan` is 49a7f532777a04aaca3b37e1034fdcd1771dabd0;
   - the done-commit run is outstanding and belongs to the custodian.
6. **E3:** `queue.mjs --check` rc=0 (current); `site.mjs --check` rc=0 (current).
7. **E4:** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` in a hold: rc=0, tests 527, pass 527, fail 0. Porcelain 0 bytes.
8. **E5:** `gh pr checks 243` rc=1, twice; `gh run list --branch … --json …headSha…` rc=0, twice. See E-1.
9. **E6:** `git diff --numstat B...H`: 2+3=5, 7+7=14, 3+3=6, 5+4=9, as predicted (P2 is 14 under OPEN-2).
10. **§8, against the diff** (`samc-g1r-s8.mjs` rc=0):
    - **Item 1:** the only changed lines that are not comments are M1's string lines (3 removed, 2 added) and M2's line 1830. Every other changed line starts with `//` or `*`.
    - **Item 2:** the cargo and vitest lists are unchanged (B equals H). P1's compared expressions are byte-identical. No app string is touched; P3 and P4 changes are block-comment lines only.
    - **Item 3:** the paths are the 4 files only, with nothing under `scripts/plan/`, `protocol/` or `state/`. Amendment 1 (OPEN-2 yes) is present in the form at B. The single commit B..H is b24e5281, and merge-base(origin/main, H) = B.
    - **Item 6:** the double-quote count is unchanged per file. The existing spans `"constant attribute"`, `` `format!("at level ...")` `` and `"P3i-b B4"` are present at H. No new quotation was added.
    - **Item 7:** added lines have 0 bare `path:line`, `sha256:` or `@ <hash>` hits; the self-test finds 7 in the removed lines.
    - **Item 8:** the numstat is within §7's 6, 15, 8 and 10 (total 34, against 39), and the form is byte-identical at B and H.
    - **Item 11:** no `state/` path is in the diff.
11. **Clause anchors:** `git grep` at H rc=0, and `git show H:frontends/shell/e2e/residency-harness.mjs` rc=0.
12. **The PR:** `gh pr view 243` rc=0, showing a draft, head b24e5281, and a body that asks for a merge commit.

Final worktree state: porcelain 0 bytes, HEAD b24e5281aef6da8b744de3ca840e9ffc10503cb6. I made no commit, push or PR action.
