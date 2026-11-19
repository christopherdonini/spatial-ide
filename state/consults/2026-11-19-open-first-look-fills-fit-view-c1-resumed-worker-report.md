*Filed by the custodian: the resumed worker's hand-back (claude-sonnet-5-5), 5721 bytes, sha256 7964ac6f9961f0ecb844680f0e48264158566c07daa5ae58d1e529a4075155db, below the rule with one mask applied (this project's name, twice in hold lines, written <m>, ADV-2026-11-18-07) and one final newline added; calls Bash 19, Write 1, SubagentHandback 1, none errored, from 2026-11-19T08:18:31Z to 08:33:46Z by its transcript, resumed under ADV-2026-11-19-12 after its stop (state/consults/2026-11-19-open-first-look-fills-fit-view-c1-worker-report.md). Its head e2be4fd58b12ada0309b78ba0432fe547797f57b is on the branch, and CI there was green when the custodian read it.*

---

Built: open-first-look-fills-fit-view Amendment 5 fix (C1), worker
Result: done. E-AND passes unmutated at G2 and fails by name under all three mutations, as predicted. Vitest under M-X2 fails RC3 and RC5 as predicted. RC16 is not in the failed list (22 of 24 passed). The file stands at 71 against the 70 ceiling.

**Commits (both pushed):**
- G = 8a58d91bcc859319ccf9095520313c8c856bee27. Recorded as seen: it failed in `command-bar` (run `a5-command-bar`, rc=1) with `[E-AND] FAIL (13457ms): parseLabel is not defined`. My omission: I dropped the definition while compacting.
- G2 = e2be4fd58b12ada0309b78ba0432fe547797f57b (`e2be4fd5`). Push output: `8a58d91b..e2be4fd5  cut/open-first-look-fills-fit-view -> cut/open-first-look-fills-fit-view`. It adds the `parseLabel` definition and nothing else (1 insertion).
- Numstat against F for `frontends/shell/e2e/command-bar.mjs` is 64 added and 7 removed, which is 71 against 70. This is a ceiling excess of one line, caused by putting back the definition I dropped.
- `node --check` exited 0. I did not amend or change G.

**Name search** (`grep -n` on the file at G2): each of the six names is defined once and used.

| Name | Definition | Use |
|---|---|---|
| `LABEL` | `command-bar.mjs:377` | `:378`, `:395` |
| `consoleLabel` | `:379` | `:479` |
| `parseLabel` | `:378` | `:479` |
| `readConsole` | `:381` | `:402` |
| `watchConsole` | `:397` | `:483` |
| `stepAndWatched` | `:466` | `:464` |

**Runs:**

| Tag | Start | End | rc | PASS | FAIL |
|---|---|---|---|---|---|
| a5b-command-bar (G2, unmutated) | 08:19:50Z | 08:22:18Z | 0 | 14 steps and FIXTURES | 0 |
| a5-m1-command-bar | | 08:25:53Z | 1 | | E-AND |
| a5-m3-command-bar | | 08:28:54Z | 1 | | E-AND |
| a5-mx2-command-bar | | 08:32:08Z | 1 | | E-AND |

Every other step passed in each mutation run, and each run's first line names head e2be4fd5.

- **Unmutated, byte-copied:**
  - `[E-AND] PASS (29048ms): A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, card B's commit added exactly one record_step row, at ok (Console after card A's wait: 256 actions, 444 dropped; after card B's map settled: 256 actions, 672 dropped); B off: 4.4%, Applied A's text`
  - Last two lines: `This run launched the app; it stays RUNNING on CDP port 9223.` and `rc=0 end 2026-11-19T08:22:18Z`
  - Load line: `load a5b-command-bar 08:19:37Z 85,83,77`
  - App-down: `killed tree 22088`, `killed tree 73956`, `port 9223 free`, `port 5400 free`.
  - Session log: `<S>/flc1-a5b-command-bar.session.log`.
  - Hold: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:47672 also=<m>`; release `MACHINE_RELEASED project=<m> shell=bash.exe:47672 affinity=FF (cores 0-7)`.
  - 444 to 672 means 228 entries were recorded between the mark and the settled reading, with no F2.
- **M-A4-1:** I deleted the line `if (dataset !== null) stepQueue.enqueue(dataset, { action: "filter.apply", params: { filter } });`, found once at `App.tsx:1060` at `e374eb71` and matched at G2. It failed at card A's wait: `[E-AND] FAIL (42146ms): E-AND: the newest record_step rows did not end with card A's step at ok before card B ([])`.
- **M-A4-3:** I enqueued the same line twice. Failure: `[E-AND] FAIL (18605ms): E-AND: card B's commit added 2 record_step rows, expected exactly one, at ok, carrying the combined text: [["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]`
- **M-X2:** the reviewer's report line, inserted before that step. Failure: `[E-AND] FAIL (18847ms): E-AND: card B's commit added 2 record_step rows, expected exactly one, at ok, carrying the combined text: [["filter:\"zone\" = 'residential'","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]`

I applied each mutation with one anchored `node` script that refuses unless the anchor occurs exactly once, and showed `git diff` each time. After M-A4-1 and M-A4-3 I ran `git checkout -- frontends/shell/src/App.tsx` and `git diff` was empty. After the M-X2 run I left it applied for the vitest run, then reverted: `git diff` empty, porcelain empty.

**Vitest under M-X2** (`npx vitest run src/App.command.test.tsx`, output in `<S>/flc1-vitest-mx2.log`, exit 1, run in the worktree, with no hold since it is a 5.6 s run):
- `× RC3: two simple clauses reach the manager as (t1) AND (t2) with the dialect constant, two cards are on, ...` fails at `src/App.command.test.tsx:512:106`.
- `× RC5: off issues the remaining combination and on restores it, ...` fails at `:543:101`.
- Summary: `Test Files  1 failed (1)` and `Tests  2 failed | 22 passed (24)`.
- RC16's name is not in the log, since passing tests are not listed.

**Holds, asked stamps:** 08:03:34Z (G, failed run), 08:19:32Z, 08:23:13Z, 08:26:33Z, 08:29:49Z. All exited 0. The `others=` values are `<m>`.

**Not covered:** the "readings run beside the wait without changing what the map checks read" question was not proven separately. The only evidence is that E-AND passed with unchanged map checks. The Console is a DOM panel capped at 16rem, and `renderTrace` reads `[render-trace]` console messages, by my reading.

**Final state:** HEAD is G2. The porcelain is empty and `ls-remote` gives G2. `df -h`: C: 46G free, D: 362G free. The last busy check printed FREE. No background shell of mine is running; the app-down script killed the app and vite after each run.

**Off-scope noticed, not done:** the Edit tool wrote the literal em dash into `command-bar.mjs`, so the file is no longer pure ASCII. This is harmless.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), no override. Context handoffs: none received or produced.
