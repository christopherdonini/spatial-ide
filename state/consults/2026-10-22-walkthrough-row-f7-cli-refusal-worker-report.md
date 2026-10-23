*Custodian's filing note (2026-10-22): the F7 piece's row by a worker, at 8fbd04cc on its branch from B fd47e6cf: one line changed (§7). Its §4 item 4 found the form's licence path wrong (`renderer/bundle-viewer/LICENSES` does not exist; the texts are in the root's `LICENSES/`) and ran the check over the real paths, empty; the custodian re-ran that diff (c7d02156..2fc01f59, empty) and records the correction in the form's Amendment 1. The run 14:47:40Z to 15:04:40Z by its transcript (Bash 16, Read 1); its claims were read against that transcript's calls before filing. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 17f6e72dcf0f78a2faa25edc2883e65200c47c89f7072b5c8a164e17acbf4557.*

---

Built: walkthrough-row-f7-cli-refusal at 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222

One item needs your attention. The form's §4 item 4 last check names a path that does not exist. `git diff <B′>..<head> -- renderer/bundle-viewer/LICENSES` is empty only because the directory does not exist. My self-test (the directory holds files) FAILED: 0 files at 2fc01f59. The licence texts are in the repo-root `LICENSES/` (38 files). I ran the diff from B′ = c7d02156d042c25f14d84c841ac89268ea5cec78 (merge-base of 2fc01f59 and B, an ancestor of B) to 2fc01f59 over `LICENSES`, `renderer/bundle-viewer/notice.mjs` and `renderer/bundle-viewer/portedNotices.mjs`. It is empty (rc 0, no stat output). This matches the form's own text in `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md` (the line starting "The licence texts are not edited"). I did not compare `dist/NOTICE.txt` sha256 at B′ and H. I did not edit the form.

Steps (scratch files are `f7-w-*` in the scratchpad):
1. Row replaced by my uncommitted script. It rc=0 and found exactly one `| F7 |` line (line 274), with no CR in the file. Old F7 line sha256 = a8fcaaef76e76459ddbf2b17ab700aa21bdf53e373fd6237c819b71649829fcb, which equals the form's pin. New F7 line sha256 = e8d2e05c00c1f82e32309c975d0070d96e3b5fa39b371223834b8017af0a7de2, both with the trailing LF.
2. §4 items 1 to 3 at my head (node script, rc=0, all PASS, self-tests positive at B):
   - Item 1: one hunk, one `| F7 |` line removed and one added.
   - Item 2: `publish-bundle.exe --data` has 1 match at B and 0 at H. `viewer/NOTICE.txt` has 0 at B and exactly 1 at H, in the F7 line. The F7 line names `kernel/src/bin/publish-bundle.rs`. The 2 `cargo build -p spatial-kernel --bin` lines are identical at B and H.
   - Item 3: only line 274 differs, the line count is equal and the final LF is kept.
3. §4 item 4 at #241's head 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d, rc=0 for each check except the `LICENSES` self-test above:
   - The W12 paragraph of the module doc of `kernel/src/bin/publish-bundle.rs`, with `//! ` removed, equals the form's W12 block byte for byte (12 lines). The form's W12 span is identical at B and at 2fc01f59.
   - `ViewerAssets::` appears in code only as `from_dir`. `with_build_record` has 0 matches.
   - The gate in `run_inner` passes `req.viewer.is_built_asset(rel, bytes)` as the skip, then returns `PublishError::RedactionFinding`.
   - `renderer/bundle-viewer/redaction-reviewed.json` holds 2 `NOTICE.txt` rows: credential at 19092 and local-filesystem-path at 111337.
4. §7: `git diff --numstat fd47e6cf...HEAD -- frontends/shell/MANUAL-WALKTHROUGH.md` gives `1	1	frontends/shell/MANUAL-WALKTHROUGH.md`, which is 1 line plus 1 line. That output is 1 line, not the 2 lines you named. `--name-only` lists only that file.
5. Suites (before the commit, on the working tree with the one-line change):
   - verify-cites: rc=0, "PASS — every rooted (in-tree) path:line reference across 2202 file(s) resolves. (130 loose reference(s) advised above.)"
   - verify-quotes: the first run hit my 300 s timeout (rc=124). The rerun with a 580 s timeout was rc=0, "PASS — 130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors".
   - verify-test-claims: rc=0, "PASS — all 613 claimed test(s) across 190 file(s) exist or are planned, superseded or withdrawn".
   - verify: rc=0, "verify:plan PASS".
   - `queue.mjs --check`: rc=0, current. `site.mjs --check`: rc=0, current.
   - `node --test` on the three globs: rc=0, 527 tests, 527 pass, 0 fail. It ran inside a shared hold, which was granted and released.
6. Commit 8fbd04cc ("1 file changed, 1 insertion(+), 1 deletion(-)"), file added by path, `git commit -s -F`. The trailers read Co-Authored-By, Claude-Session, then git's own Signed-off-by last, so the commit does not end with your two lines. Push was rc=0 as fd47e6cf..8fbd04cc. `git ls-remote` shows origin's branch = 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222 = HEAD, and `git status --porcelain` is empty.

Not done, per the brief: the form's OPEN items, any other line or file, any write in the `rds` worktree. Model as the harness reports: claude-sonnet-5-5 (Sonnet 5.5). No override, no context handoff.
