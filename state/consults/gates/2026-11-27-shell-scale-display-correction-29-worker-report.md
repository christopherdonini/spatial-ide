# Shell-scale-display's correction under ADV-2026-11-27-29, the worker's report

*Filed by the custodian, 2026-11-27. The one correction commit of ADV-2026-11-27-29 (the form's Amendment 17), made in D:/wt/scale from cbea7d4e06622e5b1debc058ba2a23ea696df761 to 56897cb477be31fed65a898a38dde8a3b3936de1. A sonnet worker made it, with no app, dev server or e2e suite started. Its run, from its notice only (ADV-2026-11-26-02), was at least 36 tool uses, by the notice that came with its hand-back (an interim notice; the agent was still waiting on work of its own). Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (3683 bytes, sha256 aeaa0c7e85c1e8f2cb712c1a344db9ba848aa0b26521dda4edb493043396dd22), byte for byte. Its account is the worker's.*

---

Pushed head 56897cb477be31fed65a898a38dde8a3b3936de1 (origin/cut/shell-scale-display equals it). Every step completed.

Commit: 56897cb4 "fix: shell-scale-display's correction under ADV-2026-11-27-29 (the bar's maximum to its test, the item an image, the seam's comment, two README clauses, two spans)". No second commit. Start state was cbea7d4e, clean, equal to origin. Worktree is clean after the commit.

Olds and News (one script took each byte from the ruling's fences; count before, then New's count after):
- Every Old occurred 1 time in its file before. Every New occurs 1 time after, with item 2's wraps joined by a script.
- Two removals have no fence Old: the line `export const SCALE_BAR_MAX_PX = 150;` and the import name `SCALE_BAR_MAX_PX,`. Each occurred 1 time before and 0 after.
- ScaleItem's added doc line is " * " plus the ruling's sentence. The bar div is `<div className="status-scale" role="img" title=... aria-label=...>`.
- Item 2's New is wrapped at "...and E-SCALE in" / "`e2e/layout.mjs`, which must ...". The lines are 137 and 136 characters.

The four checks after the change:
1. SCALE_BAR_MAX_PX under frontends/shell occurs only in scaleBar.test.ts, at the declaration on line 21 and its uses on lines 45, 46 and 54.
2. "accessible name" occurs 0 times in scaleBar.ts, App.scale.test.tsx and layout.mjs. It is also 0 in README.md line 746 (the E-SCALE entry) and in regionParts.tsx lines 225 to 236 (ScaleItem's doc).
3. Each New occurs exactly once, as above.
4. `git diff --stat cbea7d4e` lists 9 files, 16 insertions and 13 deletions. The files are KNOWN-LIMITATIONS.md, MANUAL-WALKTHROUGH.md, e2e/README.md, e2e/layout.mjs, App.scale.test.tsx, e2e-test-surface.ts, regionParts.tsx, scaleBar.test.ts and scaleBar.ts.

§7's count, using the form's counting command with 530d7b0e...HEAD at 56897cb4. The form is on main, not on the branch, so I read §7 from origin/main.
- Insertions are 491 and deletions are 5. The total is 496 against the 760 ceiling.
- The file count is 11 against 10, so the class 8 is as Amendment 17 records. §7 was not edited.
- Per file, changed lines against ceiling:
  - e2e/layout.mjs: 84 of 150
  - App.scale.test.tsx: 184 of 240
  - App.tsx: 7 of 20
  - WorkingCanvas.tsx: 2 of 3
  - StudioLayout.test.tsx: 1 of 2
  - contributions.ts: 1 of 3
  - regionParts.tsx: 38 of 45
  - scaleBar.test.ts: 91 of 180
  - scaleBar.ts: 70 of 90
  - styles.css: 15 of 25
  - e2e-test-surface.ts: 3 lines, no ceiling (the class 8 of Amendment 17)
- All files are within their ceilings.
- I took the merge-base to be 530d7b0e, the base Amendment 8 names.

The checks, each run at 56897cb4 from D:/wt/scale-logs/corr29-*.log:
- Shell `npm run typecheck`: exit 0, tsc --noEmit with no errors.
- Shell `npm test`: exit 0, "Tests 1688 passed (1688)". Both ran in one shared hold: disk C: 41939 MB and D: 31331 MB free beforehand, and the hold was released.
- verify-cites: rc 0, "PASS ... across 3747 file(s) resolves".
- verify-quotes: rc 0, "PASS — 159 checked, 128 verified, 30 baselined".
- verify-test-claims: rc 0, "PASS — all 901 claimed test(s) across 293 file(s)".
- verify-mutation `--base 530d7b0e... --head HEAD`: rc 0, "PASS — all 5 new test(s) have a recorded mutation naming them". It records mutations and runs none.
- verify.mjs: rc 0, "verify:plan PASS".
- node --test on the scripts: rc 0, tests 623, pass 623, fail 0.

Departures: none from the ruling. No mutation was run by me. The brief's `git diff --stat cbea7d4e` check reads the commit's changes against the branch's parent. I ran clippy, cargo, the app and e2e not at all, and did not touch the PR.

Model: Sonnet 5.5, no override, no context handoff.
