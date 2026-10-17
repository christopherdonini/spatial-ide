*Custodian's filing note (2026-10-17): the words worker's report for `publish-approval-unknown-attempt-under-load`'s first step (PR #227, its form's Amendment 3 item 3), in C:/dev/wt/ua1 from 39dc2c8e; the head 6a00d6a843b951cd2ccfe42d60245dfdc718b90d, pushed. The run 2026-10-17T21:02:21Z to 2026-10-17T21:05:11Z by its transcript (Read 3, Bash 7, Write 1; the one Write is its commit message, in its scratch folder); its one SubagentHandback call, at 21:05:10Z. Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed. The message's sha256 as handed back is a9ce371a017eab4535dce8316a2987ca019cea52650cfd5d51173277aaac46bd; this file's, from line 5 to the end, is ccc4aa8c965770c14932ab9d89ba9453e708e005c5de46c84ffa0b2fcf11560d.*

---

The gate words are applied in one commit, 6a00d6a843b951cd2ccfe42d60245dfdc718b90d, and pushed as an ordinary update (rc 0, 39dc2c8e..6a00d6a8). All checks passed.

**Start state.** `git fetch origin` gave 0. The head was 39dc2c8e1bf7c72f4bc273487713ebedfb9ce1a2, and `git status --porcelain --untracked-files=all` was empty.

**Method.** A Node script extracted each old and new span from the two gate reports, checked that every old span occurs exactly once in its file, then applied the replacements. Every old span occurred exactly once. I did not apply the reviewer's D1, D2 or D7.

**Replacements** (all line numbers at the head, 39dc2c8e):
- **`frontends/shell/e2e/README.md` line 222, the publish entry:** two replacements from the architect's D1.
- **`frontends/shell/e2e/README.md` line 771, the selection entry:** three replacements from the architect's D2.
- **`frontends/shell/e2e/selection.mjs`:** line 20 (reviewer's D3), line 55 (D4) and line 615 (D5).
- **`frontends/shell/e2e/exportElapsed.mjs`:** line 14 (reviewer's D6).

The diff is 7 changed lines over 3 files (README 2/2, exportElapsed.mjs 1/1, selection.mjs 3/3).

**Commands (exit codes):**
- `npm run test:export-elapsed` in `frontends/shell`: 0, 5 pass, 0 fail.
- `node --check` on `selection.mjs`: 0.
- `node --check` on `exportElapsed.mjs`: 0.
- `node scripts/plan/verify-cites.mjs`: 0.
- `node scripts/plan/verify-quotes.mjs`: 0.
- `node scripts/plan/verify-test-claims.mjs`: 0.
- `git diff --numstat origin/main...HEAD` from the worktree root (form not in the diff): 0.

**Count.** The numstat total is 160 changed lines (129 added, 31 deleted) over 7 files. The reviewer's figure at 39dc2c8e was 154 (126 + 28) over 7 files, so the words add 6 lines. The per-file figures:
- `.github/workflows/product-ci-shell.yml` 2/2
- `frontends/shell/e2e/README.md` 3/3
- `frontends/shell/e2e/exportElapsed.mjs` 54/0
- `frontends/shell/e2e/exportElapsed.test.mjs` 35/0
- `frontends/shell/e2e/publish.mjs` 17/13
- `frontends/shell/e2e/selection.mjs` 16/12
- `frontends/shell/package.json` 2/1

**Differences.** The reviewer's D3 to D6 are plain quoted "Change ... to ..." text, not bold. I took the quoted new text for those four, and the bold text for the architect's D1 and D2.

**Final state.** `git status --porcelain --untracked-files=all` is empty.

**Self-check, the four failure classes.**
- **Cross-module code:** none touched.
- **Completion claims:** each is backed by the command exit codes above.
- **User-facing messages:** the changes are text only, in comments and the README.
- **Required tests:** the export-elapsed suite ran to its assertions, with 5 passing.

**Model.** claude-sonnet-5-5 as the harness reports it, with no override and no context handoff.
