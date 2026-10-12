# PR #197 gate 1 — reviewer
Reviewed: cut/covering-names-missing-column @ 4e77715c7531e35d8fb3ee82c836ead307e794bd

**Verdict: PASS.** Correctness and Evidence both pass. There are three Documentation findings (DOC-1 to DOC-3). Under the proportional rule, each must be fixed in this PR before the merge, with no re-gate. The architect's D3 (the superseded index for Amendment 4) is still owed in the closing amendment, and so is the class 8 record of 637.

Worktree `C:/dev/wt/cov`, branch `cut/covering-names-missing-column`, HEAD 4e77715c7531e35d8fb3ee82c836ead307e794bd, merge base 76a09d5ce2ebe252034bccde5cb447163c6b8118. The worktree was clean when I started and is clean at the head now. I committed nothing.

## Correctness: pass

**The diff (`origin/main...origin/cut/covering-names-missing-column`):** 8 files, 606 insertions and 60 deletions. The files are `KNOWN-LIMITATIONS.md` (+2), `engine/ADMISSION-RESULTS.md` (3 and 3), `engine/README.md` (3 and 3), `engine/src/dataset.rs` (115 and 51), `engine/tests/covering_names_missing_column.rs` (+366), `kernel/README.md` (3 and 3), `kernel/tests/skp_projection.rs` (+105) and `protocol/skp/SKP-V0.md` (+9). `git diff --stat` over `protocol/data-plane/ protocol/skp/src protocol/skp/tests frontends/` printed nothing (rc 0): the diff there is **empty**.

**The code, read in full:**
- `judge_covering` is at `engine/src/dataset.rs:1421`. It takes `Option<&CoveringBbox>` and `&SchemaRef`, and no `Connection`.
- `open_inner` calls it once, at :436, after `check_geometry_column` and before `sanity_check`.
- `sanity_check` only matches on the finding it receives, at :1252-1269. Its R-S3 format string is byte-identical to the old one once Rust's line continuation is applied, and C-4 asserts the full text.
- The U+0000 path is checked first and is unchanged.
- `no_covering_bbox_detail`'s body is unchanged; only its doc comment changed.
- The only readers of `covering()` are `stream.rs:1478`, the index builds at `dataset.rs:740` and :856, `kernel/src/skp.rs:1975` and `kernel/src/main.rs:121`. None is edited.
- Publish takes `stream_for_publish` before `staging.create_dir` (`kernel/src/publish/mod.rs:731-733`), which agrees with §2b. That path is unrun, as §6 declares.

**§8, item by item, at the head:**
1. Pass. `refused_pre_lease` asserts `leases_issued` is unchanged (C-1 to C-5). K-1 asserts `cancel_all_for_dataset` is 0 before and after, and that leases are unchanged. I re-ran both and they are green.
2. Pass. C-3's seven rows agree with `state/drafts/covering-names-missing-column-p0/p0-output.txt`: a, d and e bind; b, c, f and g do not.
3. Pass. `covering_not_addressable_reason` and `field_path_exists` each have one caller, `judge_covering` (:1423, :1433), and `judge_covering` has one caller, `open_inner` (:436). `sanity_check` calls neither.
4. Pass. `git diff --stat` printed nothing for `engine/src/layout.rs`, `error.rs`, `addressability.rs`, `stream.rs`, `engine/tests/admission_format_semantics.rs`, `b1_projection_hostile_covering.rs`, `admission_p4_corpus.rs`, `kernel/tests/typed_terminal_codes.rs`, `docs/adr`, B1's form and ADMISSION's form. In `ADMISSION-RESULTS.md` only lines 2, 4 and 8 move.
5. Pass. C-1 asserts the exact detail and both negatives.
6. Pass. No variant, code, key or literal is added, and the protocol and frontend stat is empty.
7. Pass. The detail states the declared path and the schema fact only.
8. Pass. The results file came from its generator, and the generator is untouched.
9. Pass. `grep '^\+.*(cfg|target_os|Connection|conn\.|execute|prepare)'` over the added engine/src lines matched only the doc line "takes no `Connection`".
10. Pass.
    - The format string at `engine/src/dataset.rs:1408` equals `state/directives/2026-10-09-rulings-on-the-eight-forms.md:18` after its lead-in, with `<path>` replaced by `{}` and the path rendered through `render_visible_escape`.
    - `KNOWN-LIMITATIONS.md:115` equals line 19 of the same file after its lead-in, plus the item's three-space indent. A shell string compare printed KL-OK.
    - Lines 18 and 19 are unchanged since b4dc05e0.
11. Pass. 66e3088a's parent is 76a09d5c, and the form there already carries Amendments 1 and 2.
12. Pass. No `cfg` was added, and the case rule is `eq_ignore_ascii_case`.
13. Pass. A grep for `pub` over the added lines matches one doc comment only.

**Seams:** engine to kernel goes through the existing `pub fn covering` and `NoCoveringBbox`. K-1 proves it from the real shape, through the real `Catalog` and `SkpHost`. There is no new callback, option or `pub` item.

**Clippy:** `cargo clippy -p spatial-engine --all-targets` gives rc 0. It prints 39 warning lines, all at existing sites (`stream.rs`, `rowgroup.rs`, `trace.rs` and existing test files). There are **none in `engine/src/dataset.rs` or `engine/tests/covering_names_missing_column.rs`**, so there is no warning on an added line.

## Evidence: pass

**§7's count, by its own command at the head:**

| File | Insertions | Deletions |
|---|---|---|
| `engine/src/dataset.rs` | 115 | 51 |
| `engine/tests/covering_names_missing_column.rs` | 366 | 0 |
| `kernel/tests/skp_projection.rs` | 105 | 0 |

- **637 in 3 files.** I get 637. The cap is 520 lines in 4 files, so this is a class 8 overrun of 117. §7's line on main is unedited.
- At a06a746b the same command gives 114, 366 and 105, which is 636. That matches Amendment 3, item 2.

**The two comment-only commits, by bytes:**
- **9340c5f8:** numstat is 3 and 3 in `engine/README.md` and 3 and 3 in `kernel/README.md`, and nothing else. The hunks are at engine 499, 501 and 518 and kernel 350, 352 and 377.
  - I extracted the 12 fenced blocks from `state/drafts/covering-names-missing-column-owners-index-update.md` by script.
  - Each old line equals the line in the parent, and each new line equals the line at 9340c5f8. All six pairs printed OLD-OK and NEW-OK.
- **4e77715c:** numstat is 3 and 2 in `engine/src/dataset.rs`, and nothing else. The one hunk is at @@ -1440,8 +1440,9 @@. All five changed lines begin `///`: two deleted and three added, inside `field_path_exists`'s doc comment. No code byte changed. The claim now stops at row g's top-level name and excludes a non-ASCII child name, which agrees with Amendment 2, item 4.

**Hash pins, recomputed** with `git show <rev>:<path> | sed -n 'a,bp' | sha256sum`:
- All 35 `path:line @ rev sha256:` pins in the form are OK. That is 34 at bc357c28, plus `state/directives/2026-10-09-rulings-on-the-eight-forms.md:15-20` at b4dc05e0.
- The report hashes, from line 5 to the end, on origin/main:
  - P0 report: 8955c419…715e. OK.
  - Worker report 1: 1e62707a…c503. OK, both on main and at d007a50b.
  - Worker report 2: 8571bf6f…b7c9. OK.
  - Tester report 1: cbff60af…a5a6b20 is not the value; the value is cbff60af5614df3890288dd6b5cf13727ab64d7edd285659cade8d2504a2ba5a. OK.
- The whole-file hashes: `p0-output.txt` is 4b2a623b…465c, OK, and `p0-test.rs.txt` is c785ec17…bff, OK.
- `git log --diff-filter=A` on worker report 1 gives exactly d007a50bbc01e599229a48c70ca726eddec3a4d8, as Amendment 4 says.
- `git merge-base --is-ancestor` puts bc357c28, b4dc05e0, e73a594c, d007a50b and 76a09d5c all on main.
- The form on main is append-only against 76a09d5c: the diff removes 0 lines.

**Mutations, re-observed by me** in `C:/dev/wt/cov` at 4e77715c. Each was applied alone to `engine/src/dataset.rs` and run in its own shared hold. After each, `git checkout -- engine/src/dataset.rs` left `git status --porcelain` empty.
- **M1:** `.and_then(|_| None::<CoveringFinding>)` after `judge_covering`'s `.map(...)` at :1436.
  - Engine run, rc 101. C-1 failed at `covering_names_missing_column.rs:114:5`, C-2 at :165:5, C-3 at :231:9 ("row b"), C-4 at :273:35 (the open fails with a `prepare covering sample` binder error) and C-5 at :358:5.
  - Kernel run, rc 101. K-1 failed at `skp_projection.rs:947:5`, and N-13's kernel half stayed ok.
- **M2:** `segments.take(0)` at :1459. Engine run, rc 101. C-2 failed at :165:5 and C-3 at :231:9 ("row c"); C-1, C-4 and C-5 stayed ok.
- **M3:** `f.name() == first` and `f.name() == segment` at :1454 and :1465. Engine run, rc 101. C-3 failed at :231:9 ("row d", left false, right true); the other four stayed ok.
- **M4:** `match None::<&CoveringFinding>` at :1252. Engine run, rc 101. C-4 failed at :273:35, and the other four were ok.
- **The record:** all four match worker report 1, lines 48-62, and the PR body's table. Each test line named there is the assertion or expect at that line of the test file at the head; the test file is unchanged since 7196452e. No `verify-mutation` run is called an observation anywhere.

**Discharge claims:**
- Amendment 1, items 2 to 4 agree with `p0-output.txt`.
- Amendment 2, item 5 is met by item 2.
- Amendment 3, item 2 recomputes to 636 at a06a746b.
- Amendment 3, item 5's owed owner's-index update is applied at 9340c5f8, byte-equal to lead-data's blocks.
- Amendment 4's commit is confirmed above.
- Worker report 2's claims (six lines, numstat) are confirmed.
- Tester report 1's results are confirmed by my re-runs at the head, except one name (DOC-3).

**Suites at the head.** Each ran in its own shared hold of the shape `cd C:/dev/wt/cov && export CARGO_TARGET_DIR=D:/wt-targets/cov CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 && <M> hold shared -Project SpatialIDE … && <cmd> ; rc=$? ; <M> release -Project SpatialIDE ; exit $rc`. Every hold was granted (`MACHINE_HOLD shared … cores=0-7`) and released, and none returned 96 to 99.
- `cargo test -p spatial-engine --test covering_names_missing_column -- --include-ignored`: rc 0. 5 passed, 0 failed, 0 ignored (C-1 to C-5).
- `cargo test -p spatial-kernel --test skp_projection covering`: rc 0. 2 passed, 12 filtered out (K-1, and `a_hostile_covering_refuses_a_bbox_query_before_the_mint_and_describe_reports_no_covering`).
- `cargo clippy -p spatial-engine --all-targets`: rc 0, as above.
- Mutation runs: M1 engine, M1 kernel, M2, M3 and M4, each rc 101 as expected. The two M1 holds overlapped; both were shared.
- I saw no timing-sensitive failure.

**Governance, at the head in the worktree.** Each ran with no hold (they are light), with `timeout`:
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS.
- `verify-quotes.mjs`: rc 0, PASS (121 checked, 90 verified, 30 baselined).
- `verify-test-claims.mjs`: rc 0, PASS (531 claims).
- `verify.mjs`: rc 0, PASS.
- `queue.mjs --check`: rc 0.
- `site.mjs --check`: rc 0.
- `cfg-boundary.mjs`: rc 0 (18 sites, 0 outside every boundary).
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 of 457 passed.
- These ran on the branch's tree, whose form is at generation 3. Amendments 3 and 4 are on main only and are covered by main's CI.

**CI (`gh pr checks 197`, rc 0), every line.** All 16 checks pass, and every run's headSha is 4e77715c (checked with `gh run view`):
- L1 portable correctness · cargo test --workspace (ubuntu-24.04): pass 4m58s, pass 4m44s
- cargo fmt --check (workspace and src-tauri): pass 12s, pass 8s
- **cargo test --workspace (windows-latest): pass 15m54s, pass 11m19s**. Green at the head, in both the push run and the pull_request run, so `a_cancel_inside_the_sort_is_observed_rather_than_waited_out` did not redden here.
- cfg boundary (PORTABILITY R2): pass 9s, pass 10s
- every commit is signed off: pass 8s
- no profile path in the range: pass 7s
- tauri build (NSIS, build-only, no signing): pass 4m17s, pass 4m34s
- test · verify:plan · queue/site drift: pass 1m34s, pass 1m14s
- typecheck · build · vitest · cargo test: pass 6m12s, pass 6m35s

**PR body, line 1:** it now limits the refusal to a view query with a bbox: "A view query with a bbox then refuses before any handle is minted; one without a bbox still streams." D2 is resolved.

**Low profile:** the title, the body and all 7 commit messages hold no outside issue or PR reference and no @mention. The only URLs are the session trailers.

## Documentation (must fix before the merge; no re-gate)

**DOC-1. The PR body is stale against the head.**
- It says "It is at generation 4", and lists Amendments 1 to 3 only. The form is at generation 5, with Amendment 4.
- It gives "**Head:** 9340c5f8". The head is 4e77715c.
- The Budget section says 636. At the head, §7's command gives 637 (dataset.rs 115 and 51), and the closing amendment records that as class 8.
- "Before the gates close: … the tester run C-5 and the P4 generator …" is now done: tester report 1, at 9340c5f8.
- The custodian's runs are labelled "at the head 9340c5f8".
- These are consistent with the body's own stated head, so I do not class them as an unsupported measurement. Update the head, the generation, the amendment list, the count and the suites lines, and name worker report 2 and tester report 1.

**DOC-2. Amendment 1, item 1's three hash references carry no explicit `@ <rev>` at a main commit** (round 15, item (e)). This is the same defect the architect's D1 found in Amendment 3.
- All three recompute, and all three files were added to main by c7bc58979240d842eb02ccf41428e1b974e5053c, the commit that also wrote Amendment 1.
- Fix it in the owed closing amendment, as a reference only: Amendment 1, item 1's three hashes → @ c7bc58979240d842eb02ccf41428e1b974e5053c. Add the line to D3's superseded index. Do not open another correction round; the record cap leaves one.

**DOC-3. Tester report 1 misnames a test it says it copied from the run output.**
- `state/consults/2026-10-09-covering-names-missing-column-tester-report-1.md:45` reads: "- `a_hostile_covering_refuses_a_bbox_viewport_query_before_the_mint_and_describe_reports_no_covering`: ok"
- The test is `kernel/tests/skp_projection.rs:835` at 9340c5f8 and at 4e77715c. It reads: "fn a_hostile_covering_refuses_a_bbox_query_before_the_mint_and_describe_reports_no_covering() {"
- `git grep` finds no function with the report's name. The result is unaffected: 2 passed, re-observed at the head.
- The record is append-only, so the closing amendment carries a one-sentence correction by reference.

## Notes (not findings)

- The form cites `engine/src/dataset.rs:734-738` and `engine/src/dataset.rs:1239-1245` bare (§2b and §2a), each beside a pinned partner. If the closing amendment wants to pin them, these are the hashes at bc357c284c70c313a25b30f0a3bb5dbcafa7291d: f75ec955b3792e2a3a56de1ed197270943f789ebdf37cc0324c9d4a72d36a6df and b8dbd158712f047dee600fbbd903a8ce25976713d96f53d3a9a189c6f2db562a. This is pre-existing form text and is not among round 14's named failures.
- `ADMISSION-RESULTS.md`'s header names 7196452e, the head when it was generated. No commit since then changes code beyond one comment, and the tester's regeneration at 9340c5f8 moved only the header.
- When `build_index` refuses for such a file, its message ends with the existing run of spaces ("nothing to … index"). That text is pre-existing and declared unchanged, as worker report 1 disclosed.
- One thing I did outside my scratch folder: I briefly wrote and deleted twelve block files under the shell's `/tmp` while comparing the README lines, then redid the comparison in the scratch folder. Nothing remains. Every process I started has exited, and the worktree is clean at 4e77715c7531e35d8fb3ee82c836ead307e794bd.
