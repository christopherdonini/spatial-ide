*Custodian's filing note (2026-10-19): the worker's report of PR #233's gate 3 words, in C:/dev/wt/mm3a from 2fa7c8d0; the head 975ba1a328cd8d3519b4c683c71c5ee72be005fb, pushed. The run 2026-10-19T21:16:35Z to 21:19:09Z by its transcript (Bash 5, Grep 1, Read 2, Write 2); its one SubagentHandback call, at 21:19:08Z. Its Write calls are its apply script and its commit message, in its scratch folder. The custodian checked each of the three words against its filed gate 3 report by script (the reviewer's D1 equal to line 12, its D2 ending line 817 and found once, the architect's D2 in line 20 with the old text gone). Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed.*

---

Gate 3's three Documentation items are applied and pushed as one commit. The checks all pass.

**Head:** the worktree was at 2fa7c8d09df2e8f21370c1bf68b23213a25615a0 and clean before I started. The new commit is 975ba1a328cd8d3519b4c683c71c5ee72be005fb on cut/shell-migration-milestone-3-pr-a. I published it as an ordinary push, never forced.

**Method:** one Node script extracted every replacement from the two gate reports and found each old text exactly once. No count was other than one, and the script also checked the lines (command-bar.mjs line 12 and line 20, README.md line 817). I typed no replacement by hand.

**Old and new text, as the script printed them:**
- **Item 1, R's D1, command-bar.mjs line 12:**
  - OLD: `// MUTATIONS (section 4: every mutation is observed). Written down by the worker; the custodian ran each alone at 7e4ea32a0ccef474b8b05ed582271a4baa24101f and each failed by its named step (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md). Each is a replacement of one exact text, found exactly once at the head that adds this file, and each is to be reverted after it is observed:`
  - NEW: `// MUTATIONS (section 4: every mutation is observed). Written down by the worker. Each is a replacement of one exact text, found exactly once at 2fa7c8d09df2e8f21370c1bf68b23213a25615a0, and each is to be reverted after it is observed. The custodian ran all eight alone at that head, and each failed the step its entry names (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-e2e-custodian-runs.md):`
- **Item 2, R's D2, README.md line 817:**
  - OLD: `Each step's mutation is in the file's header, with the exact text it replaces; the custodian ran each alone at 7e4ea32a, recorded in state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md.`
  - NEW: `Each mutation is in the file's header, with the exact text it replaces and the step it fails; the custodian ran all eight alone at 2fa7c8d0, and each failed that step (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-e2e-custodian-runs.md).`
- **Item 3, A's D2, command-bar.mjs line 20:**
  - OLD: `Expected, a prediction until the custodian observes it: step E-SEARCH fails,`
  - NEW: `Predicted, and observed at 2fa7c8d0: step E-SEARCH fails,`

**`git diff --numstat` against 2fa7c8d0:**
- frontends/shell/e2e/README.md: 1 added, 1 removed.
- frontends/shell/e2e/command-bar.mjs: 2 added, 2 removed.
- The hunks are at README.md 817 and command-bar.mjs 12 and 20 only. No step condition, message or id changed.

**Commands and exit codes:**
- `git fetch origin`: 0
- `git status --porcelain --untracked-files=all`: empty
- apply script: 0
- ASCII scan of command-bar.mjs: 0. It found 0 non-ASCII bytes, and its self-test on a byte above 127 found 1, so the scan can see one.
- `node --check` on command-bar.mjs: 0
- `git diff --numstat 2fa7c8d0`: 0
- `node scripts/plan/verify-cites.mjs`: 0, PASS
- `node scripts/plan/verify-quotes.mjs`: 0, PASS, with 129 checked, 98 verified, 30 baselined and 1 advisory
- `git commit -s -F`: 0
- `git push origin cut/shell-migration-milestone-3-pr-a`: 0

The app was not launched. The commit message ends with the two required trailer lines.

**Final porcelain:** empty.

**Model:** Sonnet 5.5, as the harness reports it (claude-sonnet-5-5). No override and no context handoff.
