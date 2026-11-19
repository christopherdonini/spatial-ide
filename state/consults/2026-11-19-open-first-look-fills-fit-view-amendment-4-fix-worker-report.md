Built: open-first-look-fills-fit-view Amendment 4 fix, worker (the custodian's filing note, 2026-11-19: the Sonnet worker, model claude-sonnet-5-5, from 2026-11-19T04:27:06Z to 04:46:06Z by its transcript, Read 1, Bash 37, Write 2, none errored; 10401 bytes, sha256 56a09b119362f2f14c083c8a150431b748e440ddf1661ae4e9e929e630ba88c6; below byte for byte but for the hold lines' project values written <m> (2), with this note and one final newline)
Result: F' = e374eb711caaeae4dd898e8ddb49a35d4d80c619 pushed. Both suites exit 0 at F'. M-A4-2 and M-A4-3 failed where predicted. M-A4-1 failed both suites, but E-AND failed earlier than predicted (finding below).

**Start state.** HEAD fcf5889721aff275740bfb033a129a0557e623d7 (K), porcelain empty, `ls-remote` gave K. `df -h`: C: 47G free, D: 347G free.

**Step 2, rows as the suites read them.** Quoted as `<path>:<line> at K`.
- `frontends/shell/src/console/render.ts:46` at K: `const text = JSON.stringify(request, null, 2);` The row's request is the whole `{skp, dataset, intent}` as pretty JSON.
- `frontends/shell/src/skp/types.ts:309-311` at K: `StepIntent` is `{action:"filter.apply", params:{filter: Filter|null}}` or `{action:"style.set", params: StyleSetParams}`. `Filter` is `{predicate, dialect}`.
- `frontends/shell/e2e/command-bar.mjs:361-368` at K (`readRecordStepRows`, returning `{request, outcome}`) and `:411-448` at K (`stepAnd`). Its two waits were `r.every(outcome==="ok")` and `r.length === rowsBefore + 1 && every ok`.
- `frontends/shell/e2e/project.mjs:181-187` at K (`readRecordStepRows`, returning outcomes only) and `:189-198` at K (`waitRecorded(page, atLeast, what)`). `stepClauses` and `stepStyle` passed counts `1`, `rows+1`, `rows`, `rows+1`, `ctx.rows+1` and `ctx.rows+2`.

**Diff.** `git diff --numstat e1fd8495 -- <file>`: `command-bar.mjs` 16 added, 5 removed (21, ceiling 30). `project.mjs` 24 added, 14 removed (38, ceiling 40). The commit stat reads "2 files changed, 40 insertions(+), 19 deletions(-)". The whole diff is above as the `git diff` printed before the commit; summary (mine):
- Each file gets a `stepKey(requestText)`. It does `JSON.parse(...).intent` and reduces it to `filter:<predicate>` or `style.set:<property>=<JSON value>`.
- Each file keeps a `committed` list of the steps it has made, in order.
- `command-bar.mjs` has `waitCommitted(page, committed)`. `stepAnd` waits after A on `[A]` and after B on `[A, AB]`.
- `project.mjs` rows now carry `{request, outcome}`. `waitRecorded(page, committed, step, what)` pushes the step, then waits.
- The wait holds when the last `n = min(rows read, committed length)` rows' keys equal the last `n` of `committed`, `n > 0`, and the last row is `ok`.
- `project.mjs` steps: A, `(A) AND (C)`, A (C switched off), `FILTER_AB`, then `fillOpacity=0.37` and `fillColor="#112233"`. The CLAUSES note now reads "their 4 record_step rows reached ok".
- Prediction changed by one: the switch-off of C is recorded as a step. The run confirms it (4 rows).

**Checks.** `node --check` on `command-bar.mjs` exit 0 and on `project.mjs` exit 0. README entries for E-AND, CLAUSES and STYLE read at F (E-AND near line 802, STYLE near line 844): they are still true after the edit ("exactly one more record_step row that reaches ok and carries that text"; "each followed by its row at ok"; "rows reach ok"). No README edited. The header comment at `command-bar.mjs:40` still quotes the old E-AND message text; I left it as the record of an earlier mutation.

**F'.** e374eb711caaeae4dd898e8ddb49a35d4d80c619. Push output: `fcf58897..e374eb71  cut/open-first-look-fills-fit-view -> cut/open-first-look-fills-fit-view`. At the end HEAD is F', `ls-remote` gives F', and the porcelain is empty. The message ends with the two trailer lines the brief gave, then git's signed-off line.

**Exe.** `D:/wt-targets/fl/exes/spatial-ide-shell-fl.exe`, 91534848 bytes, sha256 5a347ec80c9fee3a964487bfd11e774adca1c6c9d9e3fad4149c909d0a2adcc5. Harness `sha256sum -c`: ten OK.

**Runs.** All at head e374eb71. PASS/FAIL are step counts from the log, including FIXTURES lines where printed.

| tag | start | end | rc | PASS / FAIL |
|---|---|---|---|---|
| a4-command-bar | 04:31:26Z | 04:33:40Z | 0 | 14 / 0 |
| a4-project | 04:34:41Z | 04:35:15Z | 0 | 12 / 0 |
| a4-m1-command-bar | 04:36:16Z | 04:38:45Z | 1 | 13 / 1 |
| a4-m1-project | 04:39:43Z | 04:40:25Z | 1 | 1 / 1 |
| a4-m2-project | 04:41:03Z | 04:41:53Z | 1 | 2 / 1 |
| a4-m3-command-bar | 04:42:27Z | 04:45:05Z | 1 | 13 / 1 |

**Byte-copied lines.** From `<H>/out/fl-e2e-<tag>.log`.
- a4-command-bar first line: `worktree C:/dev/wt/fl head e374eb711caaeae4dd898e8ddb49a35d4d80c619 start 2026-11-19T04:31:26Z`
- a4-command-bar E-AND: `[E-AND] PASS (25871ms): A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, one more record_step row reached ok; B off: 4.4%, Applied A's text`
- a4-command-bar last two lines: `This run launched the app; it stays RUNNING on CDP port 9223.` and `rc=0 end 2026-11-19T04:33:40Z`
- a4-command-bar other steps: all PASS (OPEN, E-CTRLK, E-SEARCH, E-HELP, E-BARFOCUS, E-REVEAL, E-SLASH, E-FIELD, E-REFUSE, E-TOOLONG, E-ADV, E-PANEL, E-SEL, FIXTURES).
- a4-command-bar load: `load a4-command-bar 04:31:17Z 10,10,15`
- a4-project first line: `worktree C:/dev/wt/fl head e374eb711caaeae4dd898e8ddb49a35d4d80c619 start 2026-11-19T04:34:41Z`
- a4-project CLAUSES: `[CLAUSES] PASS (9109ms): three clauses, the second off; the Filter section reads Applied: ("zone" = 'residential') AND ("zone" IS NOT NULL); their 4 record_step rows reached ok`
- a4-project STYLE: `[STYLE] PASS (3317ms): opacity 0.37 and colour #112233 committed; their record_step rows reached ok`
- a4-project last two lines: `Full console ledger: C:\dev\wt\fl\frontends\shell\e2e\out\project-console-ledger-1795062915020.json` and `rc=0 end 2026-11-19T04:35:15Z`
- a4-project other steps: all PASS (OPEN, POSE, SAVE, READBACK-FILTER, READBACK-STYLE, READBACK-VIEW, SECOND-SAVE, INSIDE-OPEN, INSIDE-SAVE, NOTICE-S18).
- a4-project load: `load a4-project 04:34:29Z 9,19,24`
- App-down output, both runs, from the hold output: `port 9223 free` and `port 5400 free`.
- Session logs, all copied: `<S>/fla4-a4-command-bar.session.log`, `fla4-a4-project.session.log`, `fla4-a4-m1-command-bar.session.log`, `fla4-a4-m1-project.session.log`, `fla4-a4-m2-project.session.log`, `fla4-a4-m3-command-bar.session.log`. Each is named by the app's stderr.
- Hold lines, with the values written as `<m>`: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`. There were no `others=`, MACHINE_WAITING or MACHINE_ERROR lines.

**Mutations.** None committed. Each was applied by a script, `<S>/fla4-mut.mjs`, which refuses unless its anchor occurs once. That is a script file, not an inline `node -e` as the brief said. The anchor lines are:
- `git show e1fd8495:frontends/shell/src/App.tsx | sed -n '1060p'` gave `      if (dataset !== null) stepQueue.enqueue(dataset, { action: "filter.apply", params: { filter } });`
- The same command with line 2051 gave `    for (const transition of transitions) stepQueue.enqueue(dataset, transition);`
- At HEAD the same lines are present, once each. `App.tsx` is unchanged from F to F'.

Each revert was `git checkout -- frontends/shell/src/App.tsx`, followed by an empty `git diff` and an empty porcelain.

- **M-A4-1** (delete the line at 1060; the diff showed that one line removed).
  - `[E-AND] FAIL (42234ms): E-AND: the newest record_step rows did not end with card A's step at ok before card B ([])`
  - `[CLAUSES] FAIL (30318ms): CLAUSES: waited 30000ms for the newest record_step rows to end with ["filter:\"zone\" = 'residential'"], the last ok (after clause A); the last reading was []`
  - Finding: the prediction said E-AND fails after B. It failed at the wait after card A, before B. Deleting the step removes A's row too, so no step reaches the console. Both suites fail as the amendment says. The other command-bar steps passed.
- **M-A4-2** (delete the loop at 2051; the diff showed that one line removed). `[STYLE] FAIL (30370ms): STYLE: waited 30000ms for the newest record_step rows to end with ["filter:\"zone\" = 'residential'","filter:(\"zone\" = 'residential') AND (\"zone\" IS NOT NULL)","style.set:fillOpacity=0.37"], the last ok (after the opacity); the last reading was [{"request":"{\n  \"skp\": \"skp/0.13\",\n  \"dataset\": \"ds_b0d4e67f7911ce78fbece907ecb57059\",\n  \"intent\": {\n    \"action\": \"filter.apply\",\n    \"params\": {\n      \"filter\": {\n        \"predicate\": \"(\\\"zone` (the log line is longer; the copy stops here). CLAUSES passed in this run. The failure is after the opacity, as predicted.
- **M-A4-3** (the 1060 line enqueued twice; the diff showed the line added once more). `[E-AND] FAIL (49501ms): E-AND: after card B was added the newest record_step rows did not end with A's step then the combined text's, the last at ok: [["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]` It failed on the tail, as predicted, and the wait after A passed.

**Timing.** None of the failures looks timing-dependent. Each is a content mismatch or an empty reading after a 30 s wait. No unmutated step failed.

**Hold stamps** (`<S>/fla4-h<n>.asked`, from `date -u +%FT%TZ`):

| hold | asked | run |
|---|---|---|
| h1 | 2026-11-19T04:30:55Z | a4-command-bar |
| h2 | 2026-11-19T04:34:20Z | a4-project |
| h3 | 2026-11-19T04:36:04Z | a4-m1-command-bar |
| h4 | 2026-11-19T04:39:28Z | a4-m1-project |
| h5 | 2026-11-19T04:40:52Z | a4-m2-project |
| h6 | 2026-11-19T04:42:15Z | a4-m3-command-bar |

h3 to h6 were written in the same call as the hold, just before it. No hold had a WAIT_TIMEOUT. A busy check before each hold and one at the end each gave FREE.

**Pre-gate self-check.**
1. Interfaces: the matchers read the real `record_step` request text (`render.ts:46`, `types.ts:309-311`) and the rows the console renders. No imagined interface.
2. Completion claims: each rests on a run log, the six logs above.
3. User-facing messages: no product text changed.
4. Tests reach their assertions: each mutation fails at the intended step.

**Off-scope, not done.** `recording.mjs` still counts rows since the open (named not covered in the ruling). The stale error text in the `command-bar.mjs:40` header comment.

**Background shells left:** none. Each hold call exited and released. Harness app and vite were killed by run-suite, ports 9223 and 5400 free.

**Model:** claude-sonnet-5-5 (Sonnet 5.5), no override. No context handoff received or produced.
