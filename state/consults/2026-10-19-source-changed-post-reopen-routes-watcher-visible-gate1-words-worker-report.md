*Custodian's filing note (2026-10-19): the worker's report applying PR #231's gate 1 Documentation words, in C:/dev/wt/wv from e1fe3a83; the head b9a5780541a05cf94598e0218b8d3bba4e0ec1ba, pushed. The run 2026-10-19T18:20:32Z to 18:24:08Z by its transcript (Bash 11, Write 1); its one SubagentHandback call, at 18:24:07Z. Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed.*

---

All five items are applied in one commit and pushed.

**Head:** was e1fe3a83158a50eb13e4308ac5844ae67a75bc6f, with a clean porcelain after `git fetch origin` (rc 0). Now b9a5780541a05cf94598e0218b8d3bba4e0ec1ba, pushed to origin as an ordinary update (push rc 0).

The script printed counts of exactly 1 for every old text, and it wrote the three files only after all counts passed (rc 0). The replacements are extracted from the two gate reports; item 5 is from your brief.

**Item 1 (R D1):**
- README line 240
  - OLD: `(`FSCTL_SET_REPARSE_POINT`, so the opened path exists at every instant)`
  - NEW: `(`FSCTL_SET_REPARSE_POINT`; the junction's name is never deleted, and no Windows document states that the rewrite is atomic, though no probe stat or open through it failed and no run's check reported that the source could not be re-read)`
- Driver line 261
  - OLD: `(`FSCTL_SET_REPARSE_POINT`, so the open path exists at every instant)`
  - NEW: `(`FSCTL_SET_REPARSE_POINT`; the name is never deleted; that an open through it never fails mid-rewrite is a reading no Windows document states)`

**Item 2 (A D2), driver line 262:** `no link-making tool` became `no `mklink``.

**Item 3 (A D3), each whole line as A gives it:**
- 174 now reads: `// that tile already passed. Polling for one and writing the repoint request the instant it appears is therefore`. It said "mutating the instant it appears".
- 175 now reads: `// mutating no earlier than "this tile's pre-check already passed"; the helper makes the repoint after it reads that request,`
- 176 now reads: `// and whether that lands before this tile's drain is not established here (S5d's race; ADR-018) -- the same use this driver already makes of `[render-trace]`
- 1090 now ends: `... mint-confirmed signal) and requesting the repoint`. It ended "and mutating".
- 1091 now reads: `        // the instant a NEW one appears (the helper makes it after reading the request), instead of before the gesture at all.`
- The old lines 175 and 176 were different text, and the script checked the old 174 to 176 and the 1090 and 1091 fragments before replacing.

**Item 4 (R D2), driver line 228:**
- OLD: `// X-4: the scratch copy this run opens and mutates. Under `e2e/out`, which is gitignored.`
- NEW: `// X-4: the reference copy, hashed before and after the run; no route opens it (every route opens a copy through the junction). Under `e2e/out`, which is gitignored.`

**Item 5:** your sentence is appended in N6's row at `MANUAL-WALKTHROUGH.md` line 949, after `(Every cite in this row was read at `71d16a1170c6`.)` and before the closing ` |`.

**`git diff --numstat` against e1fe3a83 (added, deleted):**
- MANUAL-WALKTHROUGH.md: 1/1
- e2e/README.md: 1/1
- e2e/source-changed.mjs: 8/8

**Against the merge base with origin/main** (this is the PR's whole diff, which carries the earlier overrun):
- MANUAL-WALKTHROUGH.md: 19/14
- e2e/README.md: 5/13
- e2e/source-changed.mjs: 264/111

I reviewed `git diff -U0`: only the intended lines changed, and no step's condition, message or id changed.

**Commands, all foreground:**
- `node --check` on the driver: rc 0.
- ASCII scan of the driver (a Node byte count): 0 non-ASCII bytes. The positive self-test on a string with a non-ASCII character counted 2, so the scan can see them. An earlier `grep -P` scan failed on locale, rc 2, and I did not use it.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS.
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS.
- `git commit -s -F`: rc 0.
- `git push origin cut/source-changed-watcher-visible`: rc 0, no force.
- Final `git status --porcelain --untracked-files=all`: empty.

I did not launch the app. Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5).
