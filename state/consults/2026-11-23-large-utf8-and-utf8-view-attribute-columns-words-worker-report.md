*Filed by the custodian: the worker's report of the words commit, node:large-utf8-and-utf8-view-attribute-columns@words, commit b035ccb3727e2468ab289ecf539c83d928fe60a9 on cut/large-utf8-and-utf8-view-attribute-columns (parent a15a240d), dispatched at 2026-11-23T21:26:08Z. Its run: Bash 19, Read 4, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-sonnet-5-5, from 2026-11-23T21:26:09Z to 2026-11-23T21:47:16Z by its transcript; 2 calls named the main checkout (reads of the agent definitions there, which change nothing). The report below from its hand-back, 2910 bytes, sha256 6ca39ee46ab3ae25c1efbcb81165ce9fb2b3ef12fbabed1ad05476cc2786500d, byte for byte, nothing masked, with one final newline added. Its commit changes ADR text only, the two notes of ADV-2026-11-23-28 items 1 and 2. It is evidence for the closing amendment, not a gate.*

---

The words commit is made and pushed. All four checks exit 0.

- **Head:** it was a15a240d15987658f3aa26164e858ad9b22df0a6 with a clean tree, and is now b035ccb3727e2468ab289ecf539c83d928fe60a9. The push printed `a15a240d..b035ccb3  cut/large-utf8-and-utf8-view-attribute-columns -> cut/large-utf8-and-utf8-view-attribute-columns`.
- **Fences:** the four backtick-fence lines are at lines 16, 26, 30 and 38 of THE RULING. Both fences were taken by node script from `git show f0718827:<path>` and saved in `<TMP>/lutf8w/`.
  - Fence 1 (ADR-023 note): 9 lines, 2791 bytes, sha256 fde37ca2a01e794aba8c09d78d49abc229a60bb29788bdfa2cfe23c675b53b73.
  - Fence 2 (ADR-021 note): 7 lines, 1264 bytes, sha256 9ea4ba0023377d3f25d71556c06e42defd847c4827f9c8df68ee46e8b04e1774.
- **Step 1 (ADR-023):** the base file at 69066c72 ends with LF and is a byte prefix of the branch file (both true). I replaced everything after that prefix with LF plus fence 1. `cmp` of the tail against LF plus fence 1 printed "cmp1 ok". `git diff --numstat 69066c72` over this file gives `10 0`.
- **Step 2 (ADR-021):** the file ended with LF before the append. I appended LF plus fence 2. `cmp` of the tail printed "cmp2 ok". `git diff --numstat 69066c72` gives `8 0`, which is 7 lines plus one.
- **`git diff --name-only` before commit:** exactly the two ADR files.
- **Branch numstat, `git diff --numstat 69066c72...HEAD`, whole:**
  - `8 0 docs/adr/ADR-021-row-filter-on-viewport-query.md`
  - `10 0 docs/adr/ADR-023-attribute-projection-on-viewport-query.md`
  - `4 3 engine/README.md`
  - `20 5 engine/src/attributes.rs`
  - `22 6 engine/src/predicate.rs`
  - `2 2 engine/src/stream.rs`
  - `89 0 engine/tests/large_utf8_and_utf8_view_admission.rs`
- **Checks, run in `C:/dev/wt/lutf8`:**
  - `node scripts/plan/verify.mjs`: rc=0, PASS.
  - `node scripts/plan/verify-cites.mjs`: rc=0, PASS. 271 loose references were advised, among them two old-path cites in `state/drafts/sitting-script-2026-11-24.md:864`.
  - `node scripts/plan/verify-quotes.mjs`: rc=0, PASS. 161 checked, 130 verified, 1 advisory.
  - `node scripts/plan/verify-test-claims.mjs`: rc=0, PASS. 971 claimed tests across 300 files, advisory only.
- **Differences from the brief:**
  - Against the commit a15a240d the ADR-023 diff is `2 2`, because I replaced the draft. Against the base it is `10 0`, as the brief wants, and I read the brief's check as base-relative.
  - The ADR-021 numstat was taken before commit against HEAD and base alike (`8 0`).
  - The checks ran as background jobs because they exceeded the tool timeout.
  - The commit message file holds the subject, a blank line and the Co-Authored-By trailer. The only sign-off is the one `-s` generated.

Nothing was written in `C:/dev/spatial-ide`. No code, test, cargo command, stash, rebase, amend, reset, merge or force was used. `git status --porcelain` in the worktree prints nothing after the commit.
