*Custodian's filing note (2026-10-11): ported-code-notice-route worker report 2, correction round 1 under the form's Amendment 2, the worker run 10:38:00Z to 10:44:51Z by its transcript (Write and Edit calls 0, all in C:/dev/wt/pcnr), on cut/ported-code-notice-route, head 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is bf3f38fa89dad284949fa0167510cab172cc5cc36334837165d0d62edc032296.*

---

All four changes are made, committed and pushed. Everything I ran passed.

**Start state:** after `git fetch origin`, HEAD equalled `origin/cut/ported-code-notice-route` (c8196576), and `git status --porcelain` was empty.

**New head:** 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45. The push was plain (c8196576..7b58300b).
- c1b236ad: "fix: generateNotice passes one portedRoot to the prebuild check and the notice (Amendment 2 item 1)". It holds changes 1 and 4.
- 7b58300b: "docs: the ported README and CONTRIBUTING name the checks each guarantee rests on (Amendment 2 item 2)". It holds changes 2 and 3.
- Both commits are signed off and carry the Co-Authored-By trailer.

**The four changes**
1. `frontends/shell/scripts/generateNotice.mjs`:
   - Line 96 binds `portedRoot`, `join(repoRoot,'LICENSES','third-party','ported')`.
   - Line 115 passes it to `portedPrebuildCheck` as `root`.
   - Line 186 passes `{ portedRoot }` to `notice()` as the fourth argument.
   - Nothing else in the file changed. The cross-module reads were `portedNotices.mjs` `portedPrebuildCheck`'s `root` parameter and `notice.mjs` `options.portedRoot` (line 111-113).
2. `LICENSES/third-party/ported/README.md`, the "What the build verifies" section:
   - A three-bullet preamble says where each check runs. `readPortedRegistry` runs in every NOTICE generation, `check:dist-notice`, the repository check and the prebuild. `checkPortedFiles` runs only in the repository check and the shell prebuild. `portedSectionFindings` runs only in `check:dist-notice`.
   - The table now has a "Checked by" column. `readPortedRegistry` covers the hashes and sizes plus the schema fields, and it treats `upstream_repository` and `license_id` only as non-empty strings. `checkPortedFiles` covers the `license_id` allowlist, the header window, and `adopted_by`.
   - The "tracked" claims are stated as git-checkout only. Outside a checkout the file must exist on disk, and a directive `adopted_by` is checked for form only.
3. `CONTRIBUTING.md`, line 172: the packaged-build claim now reads "a packaged build from a git checkout". It also says a build outside a checkout does not search for marked files. It checks the registry and the registered files only, and prints one NOTE line saying that unregistered markers were not searched.
4. `frontends/shell/scripts/checkDistNotice.mjs`, lines 457-461 (comment lines only): the comment now says the application section sits after the DuckDB sentinel and the viewer subsection sits inside the viewer slice. I took the viewer-slice placement from the architect's C-3 and Amendment 2; I did not re-trace it in the code.

I used no quotation marks except in file paths and the commit subjects, and I named no outside project.

**Runs** (exit codes checked)
- Shell `npm run verify`, in `frontends/shell`, under a shared hold (rc 0): rc=0. The released hold and the run came back clean, and citationIntegrity reported 30 passed, 0 failed.
  - `check:dist-notice: PASS -- all 3 required notice strings, all 26 Vite package name(s), and all 335 linked crate name(s) found across 4 dist file(s); ...anchored entry-line counts match each section's own source (viewer 3, frontend 26, Rust crates 352, DuckDB amalgamation 26, ported source files 0)...`
- `node --test` for `portedNotices.test.mjs` and `notice.test.mjs`: rc 0.
- `node scripts/check-ported-notices.mjs`: rc 0. `check-ported-notices: PASS -- 2157 tracked file(s) searched for port markers; 0 registered work(s), 0 registered file(s)`
- `node scripts/plan/verify-cites.mjs`: rc 0. 1722 files, PASS.
- `node scripts/plan/verify-quotes.mjs`: rc 0. 121 checked, 90 verified, 0 hash-reference errors, PASS.
- `node scripts/plan/verify-test-claims.mjs`: rc 0. 543 tests, PASS.
- `node scripts/plan/verify.mjs`: rc 0. PASS.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0. 457 tests, 457 pass, 0 fail.

**Viewer:** not built; its code is unchanged.

**NOTICE sha256:** `18c71526fcf566d5640f13b3b06783b67008c1ba6233ce64b32b4bc0a20ac7de` for `frontends/shell/src/generated/NOTICE.txt`. This equals the P2 value.

**Budget:** `git diff --numstat 81d98ed9...HEAD` sums to 1279 added and 5 deleted lines, 1284 in total, over 19 files. That is within Amendment 1 (j)'s 1,550 lines and 20 files.

**Final `git status --porcelain`:** empty.

**Deviations**
- I ran the `hold shared` command with the script path in a shell variable, `$M`, and redirected the `npm run verify` output to a log file under my scratchpad's parent temp directory. Neither changes what ran or when. The hold was granted and released.
- Nothing else was left undone.
