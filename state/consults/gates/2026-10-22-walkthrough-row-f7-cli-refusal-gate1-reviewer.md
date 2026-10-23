Reviewed: PR #244 at 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222, gate 1, reviewer, main 53e30138, #241 at 2fc01f59
Branch and commit reviewed: cut/walkthrough-row-f7-cli-refusal @ 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222

Verdict: PASS WITH NOTES

## Correctness
No findings.

I read each clause of the new F7 row against #241 at 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d and against Part G at B. Each clause holds:
- **The refusal.** `run_inner` calls `redaction::first_undeclared_findings(...)` with skip `|rel, bytes| req.viewer.is_built_asset(rel, bytes)` and returns `PublishError::RedactionFinding`. This is in `kernel/src/publish/mod.rs` at A, around line 953.
- **No skip in the CLI.** The CLI's only `ViewerAssets::` call in code is `from_dir`. `from_dir` builds with an empty `build_record`. `is_built_asset` looks the path up in `build_record`, so with no record it is false.
- **No declaration excuses the file.** `ATTRIBUTABLE_CLASSES` is `&["username", "machine-identifier"]`, so neither the credential match nor the path match can be re-classed as declared.
- **The "unless" list is complete.** The bundle root holds `MANIFEST_PATH`, `STYLE_PATH`, `BUILD_INFO_PATH`, `DATA_DIR` and `VIEWER_DIR`, and nothing else. The "unless" list names those three top-level files.
- **The file named.** `walk` reads the root's sorted files first, pushes `data` then `viewer`, and pops `viewer` first. In `dist`, `NOTICE.txt` sorts before `app.js` and `index.html`.
- **Part G.** G1 sets the style by F2/F4, G2 to G5 export and approve, and G7 serves the bundle and judges the style match. The row's outcome cell restates G7's.
- **The window before #241 merges** (main's CLI does not yet refuse) is bounded by §2.3. The PR body states it.

## Evidence
No findings. Each command is listed below with its exit code.

## Documentation
No must-fix finding in this PR. Notes only:
- **N1. The OPEN items.** If the human answers no to OPEN-1 and OPEN-2, merging leaves F8 ("Close the browser tab/terminal from F7…") and G7's parenthetical ("Part F's own F7 command…") pointing at a command F7 no longer has. G7's own command is complete in its row, so an operator is not stopped. These are the human's items; I raise no finding on them.
- **N2. Old quoted spans removed.** §2.0(b) says existing quoted spans in a touched row stay byte-identical. §2.1 replaces the whole F7 row, so the old row's quoted spans are removed with it. The diff equals §2.1 exactly, so this is no defect of the diff, but the form's two rules overlap.
- **N3. The R-F7 audit line.** The R-F7 report gives the audit line's fields, not the line byte-copied. I resolved prediction 4 against the tester's own artifact (`f7-r-audit.jsonl` in the session scratchpad) instead; see check 4.
- **N4. Governance CI.** Governance CI's `pull_request` paths do not include `frontends/shell/MANUAL-WALKTHROUGH.md`, so it did not run on #244. E2 therefore rests on the local runs below. Governance CI did run on main 53e30138, which carries the form and Amendment 1, and succeeded.

## What I checked (commands, exit codes)
Scratch files are `f7-g1r-*` in the session scratchpad. The worktree was clean before and after: `git status --porcelain --untracked-files=all` gave 0 bytes both times (rc 0), and HEAD stayed 8fbd04cc.

**1. The diff.**
- `git diff fd47e6cf...8fbd04cc` (rc 0), `--numstat` (rc 0) and `--name-only` (rc 0): `1	1	frontends/shell/MANUAL-WALKTHROUGH.md`, one file. The merge-base is B (rc 0), and there is one commit with parent B.
- `node f7-g1r-check13.mjs` (rc 1; the one FAIL was my own self-test choice, explained below):
  - There is no CR at B or at H.
  - The form at main has exactly one `  > | F7 |` line, line 98. H's single `| F7 |` line equals it byte for byte with the `  > ` prefix removed.
  - The new line's sha256 is e8d2e05c00c1f82e32309c975d0070d96e3b5fa39b371223834b8017af0a7de2, and the old line's is a8fcaaef…, equal to the form's pin.
  - The form at main is B's form plus appended bytes: `cmp` rc 0. Line 98 has the same hash at B and at main.

**2. §4 items 1 to 3 at H.** Same script, with every self-test positive at B:
- **Item 1:** one hunk `@@ -274 +274 @@`, one `-| F7 |` line and one `+| F7 |` line.
- **Item 2:**
  - `publish-bundle.exe --data`: 1 match at B, 0 at H.
  - `viewer/NOTICE.txt`: 0 at B, 1 at H, in the F7 line. Self-tested on the form's row.
  - The F7 line names `kernel/src/bin/publish-bundle.rs`. That pattern has 0 matches in the walkthrough at B, which caused the script's FAIL. I re-self-tested it with `git grep -F -c` at B (rc 0): 5 hits in the form, 1 in `src-tauri/src/publish.rs`, 1 in the milestone-4 form.
  - The `cargo build -p spatial-kernel --bin` lines (278 and 1543) are byte-identical at B and H, and so is lines 277-280's deviation paragraph.
- **Item 3:** 1969 lines at both, only line 274 differs, the final LF is kept, and the comparator's planted-change self-test passes.

**3. §4 item 4 at 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d.** `node f7-g1r-item4.mjs`, rc 0, all PASS:
- **W12.** The block has 12 lines and is identical at A, B and 4b26d279. `publish-bundle.rs` lines 47-58, with `//! ` stripped, equal it byte for byte, with a `//!` line on each side.
- **The CLI's viewer.** In code, `ViewerAssets::` appears once (line 533), as `from_dir`. `with_build_record` has 0 matches in the file, self-tested positive in `viewer_assets.rs`.
- **The skip.** The `run_inner` gate passes `is_built_asset` as the skip and returns `RedactionFinding`.
- **The reviewed rows.** `redaction-reviewed.json` holds 2 `NOTICE.txt` rows: credential at 19092 and local-filesystem-path at 111337.
- **The licence texts, as Amendment 1 corrects the check.** `git diff c7d02156..2fc01f59 -- LICENSES renderer/bundle-viewer/notice.mjs renderer/bundle-viewer/portedNotices.mjs` is 0 bytes.
  - Self-tests: `LICENSES/` holds 38 files, `renderer/bundle-viewer/LICENSES` holds 0, both `.mjs` files exist, and the whole diff B′..A is non-empty (24 files).
  - B′ is an ancestor of A, and it equals the current merge-base of A and B.
- Also read at A: `is_built_asset`'s body, `from_dir`'s empty record, `walk`, and `ATTRIBUTABLE_CLASSES` (sed and grep, rc 0).

**4. §4 item 5, R-F7.** `node f7-g1r-rf7.mjs` over the tester's scratch artifacts, rc 0:
- The stderr file's 15 lines equal the report's stderr block byte for byte, with no CR. Its last line begins `[publish] ` and names `` `viewer/NOTICE.txt` ``.
- `f7-r-out` has 0 entries, so there is no output directory and no staging sibling. Stdout is 0 bytes.
- The audit log has 2 lines: intent, then outcome, with the same attempt id. The last line carries `"outcome":"refused"` and `"error_kind":"RedactionFinding"` byte for byte.
- **Exit code 1** comes from the tester's transcript (`agent-ad757d26…`): its tool result reads `exit=1` (`node f7-g1r-tx.mjs`, rc 0; a first attempt was rc 1 on a path-form error).
- All four predictions are met.

**5. E1 to E5, at H in `C:/dev/wt/f7`.**
- **E1:** items 1 to 5 hold, as above.
- **E2, each with its tool's commit** (the last commit at H touching the script):
  - `verify-cites` @ a382c50813c316feb0525adf54da40607ce16d66: rc 0, PASS, 2202 files.
  - `verify-quotes` @ c3e70acb4914a4533764f312cdf0a25eb300e436: rc 0, PASS, 130 checked, 0 hash-reference errors.
  - `verify-test-claims` @ fb42c2590c9c3369c8a12e45c6d19a18a9c595a2: rc 0, PASS, 613 claims.
  - `verify` @ 8dd1e7af87cc436c61e2b41fd9e2bb00bbf3e7d8: rc 0, verify:plan PASS.
- **E3:**
  - `queue.mjs --check` @ deb56eddf3dd2121e1943312285e80b0c22372d1: rc 0, current.
  - `site.mjs --check` @ f9444a4d99a9087394c55d4b1d4c414a8b11f980: rc 0, current.
- **E4:** `node --test` on the three globs, inside a shared hold. The hold was granted and released. rc 0: 527 tests, 527 pass, 0 fail.
- **E5:** `gh pr checks 244` rc 0, all 8 checks pass. `gh run list --branch` rc 0: every run is at headSha 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222.
  - pull_request runs: Exposure scan 39803510447, Ported notices 39803510629, DCO 39803510544, Product CI shell 39803510428.
  - push runs: Ported notices 39801352927, Product CI shell 39801352749.
  - Governance CI on main 53e30138: success (`gh run list --workflow governance-ci.yml`, rc 0).

**6. §7 and §8.**
- **§7:** `git diff --numstat B...H -- frontends/shell/MANUAL-WALKTHROUGH.md` gives 1+1 = 2, against a ceiling of 2. `--name-only` lists 1 file. No overrun.
- **§8:** `node f7-g1r-s8.mjs`, rc 0.
  - **Item 1:** only F7 changed (check 2, item 3).
  - **Item 2:** nothing under kernel/, renderer/, scripts/plan/ or protocol/, and no code (name-only).
  - **Item 3:** the new text has no quotation marks (the pattern self-tested positive on the old row, 18 hits). The apostrophes are possessives only. The CLI's P6 message is not reproduced.
  - **Item 5:** no bare path:line (pattern self-tested positive), no hash pin, no branch pin.
  - **Item 7:** #244 is a draft. #241 is OPEN and unmerged at 2fc01f59 (`gh pr view 241`, rc 0). Nothing has been clicked.
  - §2.0(d): no backticked snake_case token.

Not done, per the brief: no commit, push, PR action or `claude` command, and no write outside `f7-g1r-*` scratch files. OPEN-1 to OPEN-4 are left to the human.
