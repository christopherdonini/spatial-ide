# Milestone 5's second part, PR B: the worker's report on the code at e958b913 (node:shell-migration-milestone-5@pr-b-code)

*Filed by the custodian. The worker (worker-high, Sonnet) worked in D:/wt/m5b on cut/shell-migration-milestone-5-pr-b from PR A's head d6c2daf69eb500027197945f5a4302f0508e0f69 and pushed e958b913240d296b7229cd976831b205fc8adbde. By the facts script its records run from 2026-11-28T02:02:29Z to 2026-11-28T02:23:41Z, and 133 of its calls ran with the main checkout as its working folder, the shell's start folder; the main checkout's status showed no change after it. By its completion notice it took 1271742 ms and 158 tool uses. Its hand-back is below as received, with the harness indent removed: 7538 bytes, sha256 1591f8a1403f532b8ef82a1b874ec340a32245a35a1dfdd2f358957bbfee0c24. It is the worker's own account; the build gates read it.*

---

**Pushed head: e958b913240d296b7229cd976831b205fc8adbde** on cut/shell-migration-milestone-5-pr-b (base d6c2daf6). Every step completed except what is listed under departures. Tree clean, no PR opened. I ran as Sonnet 5.5.

**1. Commits** (all `git commit -s`, each pushed in its own call):
- 0d38b74c: test: PR B's tests, red before their code (J-U1, J-U2, J-R1, J-A1, J-A2, C-U2b, C-A8, M15-1's two tab-list cases)
- 12f326aa: feat: PR B's code, the Jobs tab and urgency 3 ordered by route
- 9a10d12d: test: PR B's recorded mutations observed
- e958b913: docs: jobs.mjs (J-E1, J-E2, written, never run), KNOWN-LIMITATIONS items 81 to 83, Part AF rows AF4 and AF5
- 0d38b74c has no Claude-Session trailer. The later three have both trailers.

**2. Tests, red before and green after.**
- jobs.test.ts, JobsTab.test.tsx and App.jobs.test.tsx failed to load before the code: "Failed to resolve import ./jobs (./jobs/jobs)". They could not run, so no test inside them was red by name.
- C-U2b (conditions.test.ts) was red by name: "expected [ 'stream-terminal#null', …(4) ] to deeply equal …".
- C-A8 (App.conditions.test.tsx) was red by name. First red: `e2eSaveProjectToFolder` answered "not-asked", because a reopened open holds its folder (O-11). I changed the test to expect "not-asked" and one save with folder null. The red reason then was "the save's first line is the top: expected 'The saved view was not applied…' to be 'The project was saved.'".
- C-R3 (StudioLayout) and "the Table tab is third in Activity" (App.table) were red: the tab list lacked Jobs.
- After 12f326aa all are green: 81 tests in the eight files run together.

**3. Mutations.** Each was applied, its set run, the failure recorded beside its test with the commit and date, then reverted by `git checkout`. All were observed at 12f326aa0004fc112a0ecfb37c10d710653f2a9c, on 2026-11-28.
- M15-1 (Jobs before Problems in `ACTIVITY_TABS`): StudioLayout C-R3 and App.table "the Table tab is third in Activity" failed.
- C-U2b mutation 1 (urgency 3 by seq alone): C-U2b and C-A8 failed.
- C-U2b mutation 2 (seq descending): C-U2, C-U2b, C-U3 and C-U7 failed.
- J-U1 (list the scan for `complete` too): both J-U1 tests failed.
- J-U2 (never un-latch): "a false answer clears the latch…" failed.
- J-R1 (drop `disabled`): "an export row shows S-9; Cancel asks once…" failed.
- J-A1 (JobsTab gets `applyScanEvent({kind:"reset"})` in place of `handleCancelScan`): J-A1 failed on the relinquished statement.
- J-A2 (drop the `setExportJobs` removal): both J-A2 tests failed.
- C-A8's mutation is C-U2b's first one.
- Not recorded, to hold the line count: the extra J-R1 mutations I first drafted (S-7, S-11 and no-digit) were dropped.

**4. Words copied by script** (scratchpad copy-words.mjs, write-kl.mjs and write-wt.mjs, reading D:/wt/read-1128a at 51f5e1da).
- S-2, S-7, S-8, S-9 and S-11 were written into jobs.ts by `copy-words.mjs write-jobs`, then `check-jobs` returned OK for each, once, rc 0.
  - sha256 of each JSON literal: S-2 98cba9ab…c902fe, S-7 78df01e1…f77b, S-8 3c3f240e…13d2, S-9 c5019cd9…b0de, S-11 a6d346a8…1fac.
- KNOWN-LIMITATIONS items 81, 82 and 83 were appended by `write-kl.mjs`. `check-kl` returned OK for all three (rc 0).
  - Item 81: 126 B, sha256 dbb3aaaa…cfb. Item 82: 142 B, sha256 7d7256b3…5435 (the sha prefix is 7d7256b3…e53c).
  - Item 83: 854 B, sha256 c962879c157982ee5bbc8520f304adfe914337cc40b19ff10ad1aeed6c33283a.
- Script bug fixed first: it produced "83.." from the fence's "NN.", and now yields "83." (the earlier 855 B figure was that bug).
- Each item has my source comment naming by symbol where the code does each clause.
- Item 82's comment names OPEN-B4's case. `answerOpenAsk` calls `run.cancel()` itself, so the Jobs row still reads Cancel until the run ends.
- I checked each clause of 81, 82 and 83 against the landed code. All are met, so none was withheld.
- The AF4, AF5 and AF6 rows take S-2, S-7, S-8, S-9 and S-11 from the ruling by `write-wt.mjs`. Nothing is typed.

**5. Checks.**
- `npm run verify` in frontends/shell: **exit 0**, at e958b913, under the shared hold. 135 test files and 1684 tests passed. The log is D:/wt/m5b-verify.log. `df -m` before the run: C: 41998 MB, D: 37062 MB.
- §7 count (`git diff --numstat d6c2daf6...HEAD -- frontends/shell` with the two excludes; lines are added plus deleted):

| Group | File | Lines | Ceiling |
|---|---|---|---|
| B-P | jobs.ts | 68 | 120 |
| B-P | JobsTab.tsx | 47 | 170 |
| B-P | App.tsx | 155 | 150 |
| B-P | contributions.ts | 2 | 5 |
| B-P | surfaceRegistry.ts | 2 | 6 |
| B-P | styles.css | 23 | 40 |
| B-P | package.json | 1 | 1 |
| B-P total | | 298 | 492 |
| B-T | jobs.test.ts | 95 | 260 |
| B-T | JobsTab.test.tsx | 126 | 230 |
| B-T | App.jobs.test.tsx | 329 | 400 |
| B-T total | | 550 | 890 |
| B-E | jobs.mjs | 193 | 480 |

  - Amendment 15 item 5: StudioLayout.test.tsx 5 and App.table.test.tsx 2.
  - Amendment 16 item 3: conditions.ts 13, conditions.test.ts 23, App.conditions.test.tsx 23, so 59.
  - Whole count: 1,032 added plus 75 deleted, 1,107, against 1,862 plus Amendment 16's lines and a hard cap of 1,950.
  - **App.tsx is 5 lines over its 150 ceiling: class 8**, which is the overrun Amendment 15 predicted, reported and not recorded by me. The count includes the 70-line `handleCancelScan` move.
- Lock diff `git diff d6c2daf6 -- frontends/shell/package-lock.json` is empty (0 bytes).
- Text checks: no `%`, `ETA` or `remaining` in src/jobs/ except the regex that JobsTab.test.tsx asserts against (line 122).

**6. Departures and notes.**
- `jobsFrom` takes a third parameter, `isInFlight`, and App passes `isScanInFlight`. §2.4 shows two parameters. A value import of App from jobs.ts would make a cycle: contributions.ts reads `JOBS_LABEL` at module load, and App imports contributions. J-U1 pins that the predicate is used exactly.
- 12f326aa edited the already-committed App.jobs.test.tsx. I dropped J-A2's second-test assertion that S-7 shows after both runs end, because the first look's scan is still in flight in that test. The commit message says so.
- Amendment 4's N-2 and Amendment 15 item 7 govern J-E1's start. jobs.mjs applies the slow predicate through the Filter panel as FIND' does, and does not pan. H6 is neither confirmed nor refuted. Any status other than the relinquished one fails. A row gone before the click is VOID (exit 2). jobs.mjs was only `node --check`ed and never run.
- J-A1's `.residency-status` twin is compared in one test. The brief's J-A1 text mentioned "relinquishFill runs"; the check is the status equality plus the row going, not a spy.
- Part AF4 and AF5 wording is my draft for the human's sight. In AF5, whether Cancel answers false or the row goes depends on the host (the pin's cancel key exists only after the picker). The row records both outcomes.
- Setup: src/generated/NOTICE.txt is gitignored and was missing, so I ran `node scripts/buildViewerFirst.mjs` and `npm run generate:notice` before the vitest runs. I did not run any e2e suite, app or dev server.
- Pre-gate self-check: cross-module interfaces were used as they really are (`ExportRunReport`, `isScanInFlight`, `scanLivenessText`, `relinquishFill` through the real App). Completion claims point to the test names and verify's log. User-facing text is the advisor's, copied by script, and describes implemented behaviour. The tests reach their assertions, which I observed through the mutations.
- This report exceeds worker.md's ~20-line limit; the brief's own list overrides it.
