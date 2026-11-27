*Filed by the custodian: the worker's report of colour-by-refill's commit 5 (Amendment 7, ADV-2026-11-23-23), node:colour-by-refill-keeps-the-view@commit-5, commit 2095a7ac471d2441fd8e054a448d334c7bcde455 on cut/colour-by-refill-keeps-the-view (parent da55b7a6), dispatched at 2026-11-23T20:42:20Z. Its run: Bash 49, Read 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-23T20:42:25Z to 2026-11-23T22:02:27Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 3321 bytes, sha256 e6063d8601667eb31cb9a1cceedf40b97e2ab5a4858308e107b8311ec982331a, byte for byte, 6 values of the machine script's lines masked by the custodian, as <m>, with one final newline added. It is evidence for the build gates and the closing amendment, not a gate.*

---

DONE, no stop. Commit 5 is pushed (head moved da55b7a6 to 2095a7ac471d2441fd8e054a448d334c7bcde455). Tree clean, no PR.
- Step 1 (at da55b7a6): RF10 search at WorkingCanvas.test.ts:855, its recorded-mutation comments at :849-852. `grep -n -F 'resetFitForNewGeneration('` on WorkingCanvas.tsx gives :198 (interface decl) and :1665 (method). `grep -c -F 'resetFitForNewGeneration(options) {'` printed 1.
- Change: one line, `source.indexOf("resetFitForNewGeneration() {")` became `source.indexOf("resetFitForNewGeneration(options) {")`. The text was taken by script from Amendment 7 item 2 between its backticks, in the read worktree at 06dde5c0. I also added one comment line before RF10's `it(...)` (+2/-1 in the commit).
- Mutation: deleted the `lastQueriedRef.current = null;` line in the reset (:1668), run alone in a hold. It failed by name: `× RF10: a new filter generation and the unreported fit clear lastQueriedRef, and the camera is written in exactly three places`. The AssertionError reads `expected 'resetFitForNewGeneration(options) {\n…' to contain 'lastQueriedRef.current = null;'`. Restored from my copy; `cmp` against HEAD's file printed CMP_OK, and `git status` showed only the test file. The comment line names the mutation, the head da55b7a6 and the failure by name.
- df -m /c (free MB): 42246 at 20:42Z, 42801 at 20:42Z, 42377 at 21:25Z, 41639 at 22:02Z. Never under the floor.
- Suites, all exit 0:
  - shell `npm run verify`: 128 files, 1609 tests passed.
  - `node scripts/plan/` verify, verify-cites, verify-quotes and verify-test-claims.
  - verify-mutation over `--base e4e6493d --head HEAD`.
  - the `node --test` suite. Its log has no `# pass` lines, so I have no test count for it.
- Count (`git diff --numstat e4e6493d...HEAD`): 925 lines (909 added, 16 deleted) over 12 paths, against the 980 ceiling. The files are KNOWN-LIMITATIONS.md, shell MANUAL-WALKTHROUGH.md, e2e/README.md, e2e/colour-refill.mjs, App.colourRefill.test.tsx, App.tsx, WorkingCanvas.test.ts, WorkingCanvas.tsx, WorkingCanvas.wiring.test.tsx, candidateArmSession.refillKeepsView.test.ts, candidateArmSession.ts and kernel/tests/manual_walkthrough_fixtures.rs.
- Hold lines (the `also=` and `others=` values are masked as `<m>`): `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>` then `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)` for the mutation run. The verify and plan-suite holds read the same, with shells <m> and <m>. The MACHINE_WAITING lines are masked as `<m>`.
- Otherwise than the brief says:
  - My first mutation call ran in the foreground with `-MaxWaitMinutes 20` and ended with exit 97, WAIT_TIMEOUT, and nothing ran. I re-ran it with `run_in_background` and 120.
  - The plan suites ran from one small `.sh` file in one hold, because the brief's hold shape allows a single command.
  - `git commit -s` itself added the Signed-off-by line; I typed none.
  - I took the count over all files in the range, not a 12-path filter. It is the same 12 files.
- Pre-gate self-check: no cross-module interface was touched. Every completion claim above rests on logs in D:/wt-data/cbr. No user-facing message was added. RF10 reached its assertion (the failure was at :856). Model: Sonnet 5.5, no override, no context handoff.
